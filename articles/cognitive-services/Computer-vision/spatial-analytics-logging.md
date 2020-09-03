---
title: Telemetry and logging for Spatial Analytics containers
titleSuffix: Azure Cognitive Services
description: Spatial Analytics provides each container with a common configuration framework, so that you can easily configure and manage compute, AI insight egress, logging, telemetry, and security settings.
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: computer-vision
ms.topic: conceptual
ms.date: 09/01/2020
ms.author: aahi
---

# Telemetry and troubleshooting

Spatial Analytics includes a set of features to monitor the health of the system and help with diagnosing issues.

## Enable video frame and JSON output visualization on the host computer

To enable a visualization of spatial events in a video frame, you need to use the `.Debug` version of a [Spatial Analysis Operation](spatial-analytics-operations.md). There are two Debug skills available: `Microsoft.ComputerVision.PersonCrossingLine.Debug` and `Microsoft.ComputerVision.PersonCrossingPolygon.Debug`.

You must edit the deployment manifest to use the correct value for the `DISPLAY` environment variable. It needs to match the `$DISPLAY` variable on the host computer. After updating the deployment manifest, re-deploy the container.

After the deployment has completed, you might have to copy the `.Xauthority` file from the host computer to the container, and restart it. In the sample below, `peopleanalytics` is the name of the container on the host computer.

```bash
sudo docker cp $XAUTHORITY peopleanalytics:/root/.Xauthority
sudo docker stop peopleanalytics
sudo docker start peopleanalytics
xhost +
```


## Collecting System Health Telemetry with Telegraf

Telegraf is open source and the image built by the Spatial Analytics team takes the following inputs and uses the Azure Monitor service as the output sink. The telegraf module can be built with desired custom Inputs and Outputs by the end user. The Telegraf module in Spatial Analytics is part of the deployment manifest. This module is optional and can be removed from the manifest if you don't need it. 

Inputs: 
1. Spatial Analytics Metrics
2. Disk Metrics
3. CPU Metrics
4. Docker Metrics
5. GPU Metrics

Outputs:
1. Azure Monitor

The supplied Telegraf module will publish all the telemetry data emitted by the Spatial Analytics container to Azure Monitor. See the [Azure Monitor](https://docs.microsoft.com/azure/azure-monitor/overview) for information on adding Azure monitor to your subscription.

After setting up Azure Monitor, you will need to create credentials that enable the module to send telemetry. You can use the Azure Portal to create a new Service Principal, or use the Azure CLI command below to create one.

> [!NOTE] 
> This command requires you to have Owner privileges on the subscription. 

```bash
# Find your Azure IoT Hub resource ID by running this command. The resource ID  should start with something like 
# "/subscriptions/b60d6458-1234-4be4-9885-c7e73af9ced8/resourceGroups/...”
az iot hub list

# Create a Service Principal with `Monitoring Metrics Publisher` role in the IoTHub resource:
# Save the output from this command. The values will be used in the deployment manifest. The password won't be shown again so make sure to write it down
az ad sp create-for-rbac --role="Monitoring Metrics Publisher" --name "<principal name>" --scopes="<resource ID of IoT Hub>"
```

In the deployment manifest, look for the *telegraf* module, and replace the following values with the Service Principal information from the previous step and re-deploy.

```json
"env": {
    "AZURE_TENANT_ID": {
    	"value": "<Tenant Id>"
    },
    "AZURE_CLIENT_ID": {
    	"value": "Application Id"
    },
    "AZURE_CLIENT_SECRET": {
    	"value": "<Password>"
    },
    "region": {
    	"value": "<Region>"
    },
    "resource_id": {
    	"value": "/subscriptions/{subscriptionId}/resourceGroups/{resoureGroupName}/providers/Microsoft.Devices/IotHubs/{IotHub}"
    },
...
```

Once the telegraf module is deployed, the reported metrics can be accessed either through the Azure Monitor service, or by selecting **Monitoring** in the IoT Hub on the Azure portal .

![Azure Monitor telemetry report](./media/spatial-analytics/iot-hub-telemetry.png)

### System health events

| Event Name | Description|
|------|---------|
|archon_exit 	|Sent when a user changes the Spatial Analysis module status from *running* to *stopped*.  |
|archon_error 	|Sent when any of the processes inside the container crash. This is a critical error.  |
|InputRate 	|The rate at which the graph processes video input. Reported every 5 minutes. | 
|OutputRate 	|The rate at which the graph outputs AI insights. Reported every 5 minutes. |
|archon_allGraphsStarted | Sent when all graphs have finished starting up. |
|archon_configchange 	| Sent when a graph configuration has changed. |
|archon_graphCreationFailed 	|Sent when the graph with the reported `graphId` fails to start. |
|archon_graphCreationSuccess 	|Sent when the graph with the reported `graphId` starts successfully. |
|archon_graphCleanup 	| Sent when the graph with the reported `graphId` cleans up and exits. |
|archon_graphHeartbeat 	|Heartbeat sent every minute for every graph of a skill. |
|archon_apiKeyAuthFail |Sent when the Computer Vision resource key fails to authenticate the container for more than 24 hours, due to the following reasons: Out of Quota, Invalid, Offline. |
|VideoIngesterHeartbeat 	|Sent every hour to indicate that video is streamed from the Video source, with the number of errors in that hour. Reported for each graph. |
|VideoIngesterState | Reports *Stopped* or *Started* for video streaming. Reported for each graph. |

##  Troubleshooting an IoT Edge Device

You can use `iotedge` command line tool to check the status and logs of the running modules. For example:
* `iotedge list`: Reports a list of running modules. 
  You can further check for errors with `iotedge logs edgeAgent`. If `iotedge` gets stuck, you can try restarting it with `iotedge restart edgeAgent`
* `iotedge logs <module-name>`
* `iotedge restart <module-name>` to restart a specific module 

## Collect log files with the penginelogs container

Spatial Analytics generates Docker debugging logs that you can use to diagnose runtime issues, or include in support tickets.

To optimize logs uploaded to a remote endpoint, such as Azure Blob Storage, we recommend maintaining a small file size. See the example below for the recommended Docker logs configuration.

Adina: where does this go?

```json
{
	"HostConfig": {
		"LogConfig": {
			"Config": {
				"max-size": "500m",
				"max-file": "1000"
			}
		}
	}
}
```


### Configure the log level

Log level configuration allows you to control the verbosity of the generated logs. Supported log levels are: `none`, `verbose`, `info`, `warning`,  and `error`. The default log verbose level for both nodes and platform is `info`. 

Log levels can be modified globally by setting the `ARCHON_LOG_LEVEL` environment variable to one of the allowed values.
It can also be set through the IoT Edge Module Twin document either globally, for all deployed skills, or for every specific skill by setting the values for `platformLogLevel` and `nodeLogLevel` as shown below.

```json
{
	"version": 1,
	"properties": {
		"desired": {
			"globalSettings": {
				"platformLogLevel": "verbose"
			},
			"graphs": {
				"samplegraph": {
					"nodeLogLevel": "verbose",
					"platformLogLevel": "verbose"
				}
			}
		}
	}
}
```

### Collecting Logs

> [!NOTE]
> the `penginelogs` module does not effect the logging content, it is only assists in collecting, filtering and uploading existing logs.
> You must have Docker API version 1.40 or higher to use this module.`

The sample deployment manifest file includes a module named `penginelogs` that collects and uploads logs. This module is disabled by default and should be enabled through the IoTEdge module configuration when you need to access logs. 

The `penginelogs` operation is on-demand and controlled via an IoT Edge direct method, and can send logs to an Azure Blob Storage.

### Configure penginelogs upload targets

From the IoT Edge portal, select your device and then the **penginelogs** module. In the **Environment Variables** section, add the following information:

**Configure Upload to Azure Blob Storage**

1. Create your own Azure Blob Storage account, if you haven't already.
2. Get the **Connection String** for your storage account from the Azure portal. It will be located in **Access Keys**.
3. Spatial Analytics logs will be automatically uploaded into a Blob Storage container named *rtcvlogs* with the following file name format: `{CONTAINER_NAME}/{START_TIME}-{END_TIME}-{QUERY_TIME}.log`.

```json
{
	"IOTEDGE_WORKLOADURI":"fd://iotedge.socket",
	"AZURE_STORAGE_CONNECTION_STRING":"XXXXXX",   //from the Azure Blob Storage account
	"ARCHON_LOG_LEVEL":"info"
}
```

>[!NOTE]
> If you are running in a Non ASE Kubernetes environment, replace the container create options for the logging module to the following:
>
>`"createOptions": "{\"HostConfig\": {\"Binds\": [\"/var/run/docker.sock:/var/run/docker.sock\",\"/usr/bin/docker:/usr/bin/docker\"],\"LogConfig\": {\"Config\": {\"max-size\": \"500m\"}}}}"`

### Uploading Project Archon Logs

Logs are uploaded on-demand with the `getRTCVLogs` IoT Edge method, in the `penginelogs` module. 


1. Go to your IoT Hub portal page, select **Edge Devices**, then select your device and your penginelogs module. 
2. Go to the details page of the module and click on the ***direct method*** tab.
3. Type `getRTCVLogs` on Method Name, and a json format string in payload. You can enter `{}`, which is an empty payload. 
4. Set the connection and method Timeouts, and click **Invoke Method**.
5. Select your target container, and build a payload json string using the parameters described in the **Logging syntax** section. Click **Invoke Method** to perform the request.

>[!NOTE]
> Invoking the `getRTCVLogs` method with an empty payload will return a list of all containers deployed on the device. The method name is case sensitive. You will get a 501 error if an incorrect method name is given.


 
![getRTCVLogs Direct method page](./media/DirectMethodforLogCollection.png)

 
### Logging syntax

The below table lists the parameters you can use when querying logs.

| Keyword | Description | Default Value |
|--|--|--|
| StartTime | Desired logs start time, in milliseconds UTC. | `-1`, the start of the container's runtime. When `[-1.-1]` is used as a time range, the API returns logs from the last one hour.|
| EndTime | Desired logs end time, in milliseconds UTC. | `-1`, the current time. When `[-1.-1]` time range is used, the api returns logs from the last one hour. |
| ContainerId | Target container for fetching logs.| `null`, when there is no container ID. The API returns all available containers information with IDs.|
| DoPost | Perform the upload operation. When this is set to `false`, it performs the requested operation and returns the upload size without performing the upload. When set to `true`, it will initiate the asynchronous upload of the selected logs | `false`, do not upload.|
| Throttle | Indicate how many lines of logs to upload per batch | `1000`, Use this parameter to adjust post speed. |
| Filters | Filters logs to be uploaded | `null`, filters can be specified as key value pairs based on the Project-Archon logs structure: `[UTC, LocalTime, LOGLEVEL,PID, CLASS, DATA]`. For example: `{"TimeFilter":[-1,1573255761112]}, {"TimeFilter":[-1,1573255761112]}, {"CLASS":["myNode"]`|

The following table lists the attributes in the query response.

| Keyword | Description|
|--|--|
|DoPost|[true,false] Indicates if logs have been uploaded or not. When you choose not to upload logs, the api returns information ***synchronously***. When you choose to upload logs, the api returns 200, if the request is valid, and starts uploading logs ***asynchronously***.|
|TimeFilter| Time filter applyed to the logs.|
|ValueFilters| Keywords filters applyed to the logs. |
|TimeStamp| Method execution start time. |
|ContainerId| Target container id. |
|FetchCounter| Total number of log lines. |
|FetchSizeInByte| Total amount of log data in bytes. |
|MatchCounter| Valid number of log lines. |
|MatchSizeInByte| Valid amount of log data in bytes. |
|FilterCount| Total number of log lines after applying filter. |
|FilterSizeInByte| Total amount of log data in bytes after applying filter. |
|FetchLogsDurationInMiliSec| Fetch operation duration. |
|PaseLogsDurationInMiliSec| Filter operation duration. |
|PostLogsDurationInMiliSec| Post operation duration. |

#### Example request 

```json
{
	"StartTime": -1,
	"EndTime": -1,
	"ContainerId": "5fa17e4d8056e8d16a5a998318716a77becc01b36fde25b3de9fde98a64bf29b",
	"DoPost": false,
	"Filters": null
}
```

#### Example response 

```json
{
	"status": 200,
	"payload": {
		"DoPost": false,
		"TimeFilter": [-1, 1581310339411],
		"ValueFilters": {},
		"Metas": {
			"TimeStamp": "2020-02-10T04:52:19.4365389+00:00",
			"ContainerId": "5fa17e4d8056e8d16a5a998318716a77becc01b36fde25b3de9fde98a64bf29b",
			"FetchCounter": 61,
			"FetchSizeInByte": 20470,
			"MatchCounter": 61,
			"MatchSizeInByte": 20470,
			"FilterCount": 61,
			"FilterSizeInByte": 20470,
			"FetchLogsDurationInMiliSec": 0,
			"PaseLogsDurationInMiliSec": 0,
			"PostLogsDurationInMiliSec": 0
		}
	}
}
```

Check fetch log's lines, times, and sizes, replace ***DoPost*** to `true`, then you can push logs with same filters to destinations. Adina: Do we want to add this internediate step? Why not satting DoPost to true from be very beginning?

 **4. Export the log file from Azure Blob Storage and send to Microsoft**

 Follow these steps to export the log file from the Azure Blob Storage account. Shrey to add instructions.

 Once you create a Suport Ticket, you will be in contact with a Microsoft suport engineer which will colect the log file and will further investigate the issue at hand.

 ![Support Ticker](./media/SuportTicket.png)

## Troubleshooting the Azure Stack Edge device

The following section is provided for help with debugging and verification of the status of your Azure Stack Edge device.

1.	How to access the Kubernetes API Endpoint: Follow these steps to access the URL for the Kubernetes API endpoint. 
	* In the local web UI of your device, go to Devices page. 
	* Under the Device endpoints, copy the Kubernetes API service endpoint. This endpoint is a string in the following format: https://compute..[device-IP-address].
	* Save the endpoint string. You will use this later when configuring a client to access the Kubernetes cluster via kubectl.

2.	Connect to PowerShell interface<br> 
		Remotely, connect from a Windows client. After the Kubernetes cluster is created, you can manage the applications via this cluster. This will require you to connect to the PowerShell interface of the device. Depending on the operating system of client, the procedures to remotely connect to the device are different.<br>Follow these steps on the Windows client running PowerShell.
		Before you begin, make sure that your Windows client is running Windows PowerShell 5.0 or later. Follow these steps to remotely connect from a Windows client. 
	* Run a Windows PowerShell session as an Administrator. 
	* Make sure that the Windows Remote Management service is running on your client. At the command prompt, type: 
		```winrm quickconfig```<br>
	Note:If you see complaints about firewall exception, see this link https://4sysops.com/archives/enabling-powershell-remoting-fails-due-to-public-network-connection-type/
	* Assign a variable to the device IP address. $ip = "" Replace with the IP address of your device. 
	* To add the IP address of your device to the client’s trusted hosts list, type the following command: Set-Item WSMan:\localhost\Client\TrustedHosts $ip -Concatenate -Force 
	* Start a Windows PowerShell session on the device: Enter-PSSession -ComputerName $ip -Credential $ip\EdgeUser -ConfigurationName Minishell 
	* Provide the password when prompted. Use the same password that is used to sign into the local web UI. The default local web UI password is Password1. 
    <br><br>
	##### Powershell Setup for Linux
	This step is only required if you do not have a Windows client. Install Powershell from this location: https://docs.microsoft.com/en-us/powershell/scripting/install/installing-powershell-core-on-linux?view=powershell-6
		
	* Download the Microsoft repository GPG keys
	wget -q https://packages.microsoft.com/config/ubuntu/18.04/packages-microsoft-prod.deb
	
	* Register the Microsoft repository GPG keys
	sudo dpkg -i packages-microsoft-prod.deb
	
	* Update the list of products
	sudo apt-get update
	
	* Enable the "universe" repositories
	sudo add-apt-repository universe
	
	* Install PowerShell
	sudo apt-get install -y powershell
	
	* Start PowerShell
	pwsh

3.	Useful Commands:
	* ```Get-HcsKubernetesUserConfig -AseUser``` <br>
			This will produce the Kubernetes config needed in step 3. Copy this and save it in a file named config. Do not save the config file as .txt file, save the file without any file extension.<br>
	* ```Get-HcsApplianceInfo``` <br>
			To get the info about your device.<br>
	* ```Enable-HcsSupportAccess``` <br>
			This generates access credentials to start a support session.<br>
    <br><br>
4.	Access the Kubernetes cluster<br>
	After the Kubernetes cluster is created, you can use the ```kubectl``` via cmdline to access the cluster.
	* Create a namespace.<br>
	```New-HcsKubernetesNamespace -Namespace```<br> 
	* Create a user and get a config file.<br> ```New-HcsKubernetesUser -UserName``` <br>
	This will produce the Kubernetes config. Copy this and save it in a file named config. Do not save the config file as .txt file, save the file without any file extension.
	* Use the config file retrieved in the previous step. The config file should live in the .kube folder of your user profile on the local machine. Copy the file to that folder in your user profile.	
	*Associate the namespace with the user you created.<br> ```Grant-HcsKubernetesNamespaceAccess -Namespace -UserName```<br>
	* You can now install kubectl on your Windows client using the following command:
	```curl https://storage.googleapis.com/kubernetesrelease/release/v1.15.2/bin/windows/amd64/kubectl.exe -O kubectl.exe```
	* Add a DNS entry to the hosts file on your system. 
    	* Run Notepad as administrator and open the hosts file located at C:\windows\system32\drivers\etc\hosts . 
      	* Use the information that you saved from the Device page in the local UI in the earlier step to create the entry in the hosts file. For example, copy this endpoint https://compute.asedevice.microsoftdatabox.com/[10.100.10.10] to create the following entry with device IP address and DNS domain: 10.100.10.10     compute.asedevice.microsoftdatabox.com
		* To verify that you can connect to the Kubernetes pods, type:
	kubectl get pods -n "iotedge"
		* To get container logs a module, run the following command: <br>
	```kubectl logs <pod-name> -n <namespace> --all-containers```

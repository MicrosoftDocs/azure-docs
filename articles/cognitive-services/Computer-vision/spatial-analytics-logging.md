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

## Collecting System Health Telemetry with Telegraf

Spatial Analytics exposes a set of mechanisms to monitor the health of the system and help with diagnosing issues.

The Telegraf module is part of the deployment manifest at [DeploymentManifest.json](./DeploymentManifest.json). Telegraf telemetry is an optional module and can be removed from the manifest if not required. 

Telegraf is open source and the image built by the Spatial Analytics team takes the following inputs and uses the Azure Monitor service as the output sink. The telegraf module can be built with desired custom Inputs and Outputs by the end user.

Inputs: 
1) Spatial Analytics Metrics
2) Disk Metrics
3) CPU Metrics
4) Docker Metrics
5) GPU Metrics

Outputs:
1) Azure Monitor

The supplied Telegraf module will publish all the telemetry data emitted by the Spatial Analytics container to the [Azure Monitor](https://azure.microsoft.com/en-us/services/monitor/?&ef_id=Cj0KCQjwuJz3BRDTARIsAMg-HxVBufYXeg3EMX4-UaxjfR6-bxYN55_EwARaPT3L0NgiDffa_knIOnEaAsa0EALw_wcB:G:s&OCID=AID2000128_SEM_Cj0KCQjwuJz3BRDTARIsAMg-HxVBufYXeg3EMX4-UaxjfR6-bxYN55_EwARaPT3L0NgiDffa_knIOnEaAsa0EALw_wcB:G:s&gclid=Cj0KCQjwuJz3BRDTARIsAMg-HxVBufYXeg3EMX4-UaxjfR6-bxYN55_EwARaPT3L0NgiDffa_knIOnEaAsa0EALw_wcB).

**Azure Monitor Setup**

1) Please follow the instrutions at  [Azure Monitor](https://azure.microsoft.com/en-us/services/monitor/?&ef_id=Cj0KCQjwuJz3BRDTARIsAMg-HxVBufYXeg3EMX4-UaxjfR6-bxYN55_EwARaPT3L0NgiDffa_knIOnEaAsa0EALw_wcB:G:s&OCID=AID2000128_SEM_Cj0KCQjwuJz3BRDTARIsAMg-HxVBufYXeg3EMX4-UaxjfR6-bxYN55_EwARaPT3L0NgiDffa_knIOnEaAsa0EALw_wcB:G:s&gclid=Cj0KCQjwuJz3BRDTARIsAMg-HxVBufYXeg3EMX4-UaxjfR6-bxYN55_EwARaPT3L0NgiDffa_knIOnEaAsa0EALw_wcB) to setup Azure Monitor in your subscription.

2) Create credentials for pushing telemetry from the **host computer** to Azure Monitor. You can use the Azure Portal to create a new Service Principal or use the Azure CLI command below to create one replacing the name and resource ID with appropriate values.

<br>**Note:** This command requires you to have Owner privileges on the subscription. <br>

```
# Find your Azure IoT Hub resource ID by running this command. The resource ID  should start with something like 
# "/subscriptions/b60d6458-f40d-4be4-9885-c7e73af9ced8/resourceGroups/...”
az iot hub list

# Create a Service Principal with `Monitoring Metrics Publisher` role in the IoTHub resource:
az ad sp create-for-rbac --role="Monitoring Metrics Publisher" --name "<principal name>" --scopes="<resource ID of IoT Hub>"

Save the output from this command. The values will be used in the deployment manifest. You will not see the password again in the clear so make sure to write it down

Example for customer named “Contoso Foods”. 
az ad sp create-for-rbac --role="Monitoring Metrics Publisher" --name "contoso-foods-telemetry" --scopes="/subscriptions/39fb9547-5632-4b79-b0a0-7e16f32bb63b/resourceGroups/dcsmvp2skicg/providers/Microsoft.Devices/IotHubs/dcsmvp2skicgiothub"

```

**Setup the Telegraf Module**

In the [DeploymentManifest.json](./DeploymentManifest.json) look for the 'telegraf' module set the following configuration using the Service Principal information from the previous step and re-deploy.

```
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
```
Once the telegraf module is deloyed, reported metrics can be accessed either through Azure Monitoring service or by selecting Monitoring in the Azure IoTHub portal page.

![Azure Monitor telemetry report](./media/AzureIotHubTelemetry.png)

**System Health Events for Spatial Analysis**

| Event Name | Description|
|------|---------|
|archon_exit 	|Sent when the user changes the Spatial Analysis module status from "status": "running" to "status": "stopped" 
|archon_error 	|Sent when there is a crash of any of the processes inside the container. This is a critical error. 
|InputRate 	|This is the rate at which the graph processes video input. It is reported per individual process every 5 minutes. 
|OutputRate 	|This is the rate at which the graph outputs AI insights. It is reported per individual process every 5 minutes.
|archon_allGraphsStarted | Sent when all graphs have finished starting up.
|archon_configchange 	| Sent when a graph configuration has changed. 
|archon_graphCreationFailed 	|Sent when the graph with reported graphId fails to start.
|archon_graphCreationSuccess 	|Sent when the graph with reported graphId starts successfully. 
|archon_graphCleanup 	| Sent when the graph with reported graphId cleans up and exits. 
|archon_graphHeartbeat 	|Heartbeat sent every minute for every graph of a skill.
|archon_apiKeyAuthFail |Sent when the Computer Vision resource API key fails to authenticate for the container because of the following reasons: Out of Quota, Invalid, Offline for more than 24 hours. 
|VideoIngesterHeartbeat 	|Sent every hour to indicate that video is streamed from the Video source and reports the count of errors in that hour. It is reported for each graph.
|VideoIngesterState | Reports state values: Stopped,Started for video streaming. It is reported for each graph.

# Logging and Troubleshooting for Project Archon

Project-Archon exposes a set of mechanisms to monitor the health of the system and help with diagnosing issues:
- Visualization of the processed video stream on the **host computer** can be used to visually inspect the quality of the processed video, events and detections,
- The Logging collection module can be deployed and used to remotely collect debugging logs,


##  Troubleshooting Iot Edge Device
You can use `iotedge` command line tool to check the status and logs of the running modules, below are some example usages;
* iotedge list: it will report the list of the running modules, if you just deployed then it will take some time to download the docker image. 
  You can further check by running `iotedge logs edgeAgent` and see if there are errors, docker authentication is the common error and in order to fix that make sure you have the right username amd password in the manifest for the azure container registry.
  Another common error is about iotedge timeout which will auto recover but if its staying in the same state you can try restarting `iotedge restart edgeAgent`
* iotedge logs `modulename`
* iotedge restart `modulename`, with this command you can restart any module 


## Enable video frame and JSON output visualization on the host computer

To enable the visualization of video frames, events, and detections, you need to use the  ***.Debug** version of an AI skill. There are two Debug skills available: Microsoft.ComputerVision.PersonCrossingLine.Debug and Microsoft.ComputerVision.PersonCrossingPolygon.Debug.<br><br>
You must edit the deployment manifest to use the correct value for the DISPLAY environment variable. It needs to match the $DISPLAY variable on the **host computer**. Regenerate the deployment manifest and redeploy.<br><br>
After the deployment has completed, you *may* have to copy the .Xauthority file from the **host computer** to the container and restart it. In the sample below, peopleanalytics is the name of the container where Project-Archon has been installed on the **host computer**<br>
```
sudo docker cp $XAUTHORITY peopleanalytics:/root/.Xauthority
sudo docker stop peopleanalytics
sudo docker start peopleanalytics
xhost +
```


## Collecting Log Files with the penginelogs Container

### Understanding Project Archon Logs
Project-Archon generates debugging Docker logs that can be used to diagnose runtime issues. These logs can be sent to Microsoft when a suport ticket is created.<br>

 **1. Configure log file size**

To optimize logs upload to a remote endpoint such as Azure Blob Storage, it is recommended to maintain the individual logs size to a relative small size. Below is the recommended configuration for Docker logs:<br>

Adina: where does this go?

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

 **2. Configure log level**

Log level configuration allows to control the verbosity of the logs generated by both the platform and the nodes. Supported log levels are `{"none","verbose", "info", "warning", "error"}.` The default log verbose level for both nodes and platform is `info`. <br>
Log levels can be modified globally by setting the `ARCHON_LOG_LEVEL` environment variable to one of the allowed values.
It can also be set through the IoTEdge Module Twin document either globally, for all deployed skills, or for every specific skill by setting the values for `platformLogLevel` and `nodeLogLevel` as shown below.<br>

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


### Collecting Project-Archon Logs

The sample deployment manifest file at [DeploymentManifest.json](./DeploymentManifest.json) includes a special module named **penginelogs** that is responsible for collecting and uploading logs. This module is ***disabled*** by default and should be enabled through the IoTEdge module configuration when needed to access and retrieve logs from the deployment. The support engineer will provide you with the username and password credentials for accesing the penginelogs container. 

*Note: this module does not effect the logging content, it is only responsible for collecting, filtering and uploading existing logs.* <br>

**`Docker API version 1.40 or higher is required for the Logs module.`**

The ***penginelogs*** operation is om-demand and it is controlled via an IoT Edge direct method and can push logs to Azure Blob Storage.


### Configure penginelogs upload targets
From the IoTEdge portal, select your device and then the ***penginelogs*** module. In the Environment Variables section of the Module configuration add the following information:

**Configure Upload to Azure Blob Storage**

1. Create your own Azure storage account.
2. Go to `Access Keys` -> `Connection String`, record it.
3. Project-Archon logs will be automatically uploaded into a Blob Storage container named **rtcvlogs** with the following file name format: `{CONTAINER_NAME}/{START_TIME}-{END_TIME}-{QUERY_TIME}.log`.


    {
	    "IOTEDGE_WORKLOADURI":"fd://iotedge.socket",
	    "AZURE_STORAGE_CONNECTION_STRING":"XXXXXX",            ** from the COnfigure Azure Blob Storage section**
	    "ARCHON_LOG_LEVEL":"info"
    }


*Note: If you are running in a Non ASE Kubernetes environment please replace the container create options for the logging module to the following*
`"createOptions": "{\"HostConfig\": {\"Binds\": [\"/var/run/docker.sock:/var/run/docker.sock\",\"/usr/bin/docker:/usr/bin/docker\"],\"LogConfig\": {\"Config\": {\"max-size\": \"500m\"}}}}"`

### Uploading Project Archon Logs

Log are uploaded on demand by invoking the `getRTCVLogs` IoT Edge direct method on the **penginelogs** module. 

![getRTCVLogs Direct method page](./media/DirectMethodforLogCollection.png)

 - Go to your IoT Hub portal page, select **Edge Devices**, then select your device and your penginelogs module. 
 - Go to the details page of the module and click on the ***direct method*** tab.
 - Type `getRTCVLogs` on Method Name, and a json format string in payload. By default put `{}`. 
 - Set connection Timeout and Method Timeout, click “***Invoke Method***”. 

	*Note: Invoking the `getRTCVLogs` method with an empty payload will return a list of all containers deployed on the device. The Method Name is case-sensitive. You will get a 501 error if an incorrect method name is given.*

 - Select your target container, build a payload json string using the parameters described below and click “***Invoke Method***” to perform your request.
 
### Logging syntax

**1. Query parameters**

| Keyword | Description | Default Value |
|--|--|--|
| StartTime | desired logs start time, in milliseconds UTC. | `-1`, from the very beginning. ***When `[-1.-1]` time range is used, the api returns logs from the last one hour***.|
| EndTime | desired logs end time, in milliseconds UTC. | `-1`, end now. ***When `[-1.-1]` time range is used, the api returns logs from the last one hour***. |
| ContainerId | target container for fetching logs.| `null`, when there is no container id, api returns all available containers information with ids.|
| DoPost | perform the upload operation. When this is set to `false`, it performs the requested operation and returns the upload size without performing the upload. When set to `true`, it will initiate the asynchronous upload of the selected logs | `false`, do not upload.|
| Throttle | indicate how many lines of logs to upload per batch | `1000`, Use this parameter to adjust post speed. |
| Filters | filters logs to be uploaded | `null', Filters can be specified as key value pairs based on the Project-Archon logs structure: `[UTC, LocalTime, LOGLEVEL,PID, CLASS, DATA]`. Sample filer: `{"TimeFilter":[-1,1573255761112]}, {"TimeFilter":[-1,1573255761112]}, {"CLASS":["myNode"]`|

**2. Query response**

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

**3. Sample payloads**

    {
	    "StartTime": -1,
	    "EndTime": -1,
	    "ContainerId": "5fa17e4d8056e8d16a5a998318716a77becc01b36fde25b3de9fde98a64bf29b",
	    "DoPost": false,
	    "Filters": null
    }

Sample return 

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

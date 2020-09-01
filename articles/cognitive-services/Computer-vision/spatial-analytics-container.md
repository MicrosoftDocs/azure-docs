---
title: How to install and run the Spatial Analytics container - Computer Vision
titleSuffix: Azure Cognitive Services
description: The Spatial Analytics container letes you can easily configure and manage compute, AI insight egress, logging, telemetry, and security settings.
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: computer-vision
ms.topic: conceptual
ms.date: 09/01/2020
ms.author: aahi
---

# Install and run the Spatial Analytics container (Preview)

The Spatial Analytics container enables you to analyze real-time streaming video to understand spatial relationships between people, their identities, activities, and interactions with objects in your own environment. Containers are great for specific security and data governance requirements. In this article you'll learn how to download, install, and run a Spatial Analytics container for Spatial Analytics.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Prerequisites

* Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services)
* Once you have your Azure subscription, <a href="https://portal.azure.com/#create/Microsoft.CognitiveServicesComputerVision"  title="Create a Computer Vision resource"  target="_blank">create a Computer Vision resource <span class="docon docon-navigate-external x-hidden-focus"></span></a> in the Azure portal to get your key and endpoint. After it deploys, click **Go to resource**.
    * You will need the key and endpoint from the resource you create to run the Spatial Analytics container. You'll use your key and endpoint later.

### Spatial Analytics container requirements

| Requirement | Description |
|--|--|
| Camera | The Spatial Analytics container is not tied to a specific camera brand. The camera device needs to support Real Time Streaming Protocol(RTSP) and H.264 encoding, needs to be accessible to the host computer, and needs to be capable of streaming at 15FPS and 1080p resolution. |
| Compute device | To run the Spatial Analytics container, you need a compute device with a [NVIDIA Tesla T4 GPU](https://www.nvidia.com/en-us/data-center/tesla-t4/). We recommend that you use [Azure Stack Edge](https://azure.microsoft.com/en-us/products/azure-stack/edge/) with GPU acceleration, however the container runs on any other device with an NVIDIA Tesla T4 GPU. We will refer to this device as the host computer. |
| Linux OS | [Ubuntu Desktop 18.04 LTS](https://ubuntu.com/download/desktop) must be installed on the host computer.  |

In this article, you will download and install the following software packages. The host computer must be able to run the following:

* [NVIDIA CUDA Toolkit](https://docs.nvidia.com/cuda/cuda-installation-guide-linux/index.html) and [NVIDIA graphics drivers](https://docs.nvidia.com/datacenter/tesla/tesla-installation-notes/index.html) 
* Configurations for [NVIDIA MPS](https://docs.nvidia.com/deploy/pdf/CUDA_Multi_Process_Service_Overview.pdf) (Multi-Process Service).
* [Docker CE](https://docs.docker.com/install/linux/docker-ce/ubuntu/#install-docker-engine---community-1) and [NVIDIA-Docker2](https://github.com/NVIDIA/nvidia-docker) 
* [Azure IoT Edge](https://docs.microsoft.com/azure/iot-edge/how-to-install-iot-edge-linux) runtime.
* [Azure IoT Hub](https://docs.microsoft.com/en-us/azure/iot-hub/) 

## Request access to the private container registry

Fill out and submit the [request form](https://aka.ms/cognitivegate) to request access to the container. 

[!INCLUDE [Request access to public preview](../../../includes/cognitive-services-containers-request-access.md)]

[!INCLUDE [Gathering required container parameters](../containers/includes/container-gathering-required-parameters.md)]


## Setup the host computer

It is recommended that you use an [Azure Stack Edge](https://azure.microsoft.com/products/azure-stack/edge/) device for your host computer. Click **Desktop Machine** if you're configuring a different device.

#### [Azure Stack Edge device](#tab/azure-stack-edge)

### Azure Stack Edge device configuration

Azure Stack Edge is a Hardware-as-a-Service solution and an AI-enabled edge computing device with network data transfer capabilities. This guide provides you an overview of how to deploy the Spatial Analytics container on Azure Stack Edge. You can read more about Azure Stack Edge and detailed setup instructions below:

* [Azure Stack Edge / Data Box Gateway Resource Creation](https://docs.microsoft.com/azure/databox-online/azure-stack-edge-deploy-prep)
* [Install and Setup](https://docs.microsoft.com/azure/databox-online/azure-stack-edge-deploy-install)
* [Connection and Activation](https://docs.microsoft.com/azure/databox-online/azure-stack-edge-deploy-connect-setup-activate)

#### Configure Compute on the ASE Portal 

1. Activation: Project Archon uses the compute features of the Azure Stack Edge to run an AI solution. First, activate the Azure Stack Edge device by following the activation steps listed [here](https://docs.microsoft.com/en-us/azure/databox-online/azure-stack-edge-deploy-connect-setup-activate). 

2. Enabling Compute Prerequisites: Before you begin, make sure that: 

    * You've activated your Azure Stack Edge device 
    * You've access to a Windows client system running PowerShell 5.0 or later to access the device.  
    * To deploy a Kubernetes cluster, you need to configure your Azure Stack Edge device via the _Local UI_ on the [Azure Portal](https://portal.azure.com/). Each of these procedures are described in the following sections. 

3. Local UI Steps: Enable the compute on your Azure Stack Edge device. To enable the compute, in the local web UI of your device, go to the Compute page. 

    * Select a network interface that you want to enable for compute. Select Enable. Enabling compute results in the creation of a virtual switch on your device on that network interface. 
    * Leave the Kubernetes test node IPs and the Kubernetes external services IPs blank.
    * Select Apply - This operation should take about 2 minutes. 

![Link](./media/ase1.PNG)

#### Continue the IoT Edge setup on the Azure Portal 

1. In the [Azure Portal](https://portal.azure.com/) view of your Azure Stack Edge resource, go to _Overview_. In the right-pane, on the _Compute_ tile, select _Get started_.

    ![Link](./media/ase2.PNG)

2. On the _Configure Edge compute_ tile, click _Configure_. 

    ![Link](./media/ase3.PNG)

3. On the _Configure Edge compute_ view, input the following:<br>
Iot Hub: Choose from New or Existing. 
By default, a Standard tier (S1) is used to create an IoT resource. To use a free tier IoT resource, create one and then select the existing resource. 
In each case, the IoT Hub resource uses the same subscription and resource group that is used by the Azure Stack Edge resource 

4. Click _Create_. The IoT Hub resource creation takes a couple of minutes. After the IoT Hub resource is created, the _Configure Edge compute_ tile updates to show the compute configuration. To confirm that the Edge compute role has been configured, select the _View config_ on the Configure compute tile. 

![Link](./media/ase4.PNG)

5. When the Edge compute role is set up on the Edge device, it creates two devices: an IoT device and an IoT Edge device. Both devices can be viewed in the IoT Hub resource. The Azure IoT Edge Runtime is already running on this IoT Edge device.         	 

    Note: At this point, only the Linux platform is available for your IoT Edge device.

  For help troubleshooting the Azure Stack Edge device, please go to the [Troubleshooting](Project-Archon-Telemetry.md) page.

#### [Desktop machine](#tab/desktop-machine)

Follow these instructions if your host computer isn't an Azure Stack Edge device. Otherwise skip to the **Enable NVIDIA MPS** section.

### System Requirements

The host computer requires a [NVIDIA Tesla T4 GPU](https://www.nvidia.com/en-us/data-center/tesla-t4/).

#### Hardware Requirements(Minimum)

* 4 GB system RAM
* 4 GB of GPU RAM
* Single core CPU
* 1 T4 GPU
* 20 GB of HDD space

#### Hardware Recommended

* 32 GB system RAM
* 16 GB of GPU RAM
* 8 core CPU
* 2 T4 GPUs
* 50 GB of SSD space


#### Install NVIDIA CUDA Toolkit and Nvidia graphics drivers on the host computer

Use the following bash script to install the required Nvidia graphics drivers, and CUDA Toolkit.

```bash
wget https://developer.download.nvidia.com/compute/cuda/repos/ubuntu1804/x86_64/cuda-ubuntu1804.pin
sudo mv cuda-ubuntu1804.pin /etc/apt/preferences.d/cuda-repository-pin-600
sudo apt-key adv --fetch-keys https://developer.download.nvidia.com/compute/cuda/repos/ubuntu1804/x86_64/7fa2af80.pub
sudo add-apt-repository "deb http://developer.download.nvidia.com/compute/cuda/repos/ubuntu1804/x86_64/ /"
sudo apt-get update
sudo apt-get -y install cuda

```

Reboot the machine, and run the following command.

```bash
nvidia-smi
```

You should see the following output.

![NVIDIA driver SMI info](./media/nvidia-smi-info.PNG)

### Install Docker CE and nvidia-docker2 on the host computer

Install Docker CE on the host computer.

```bash
sudo apt-get update
sudo apt-get install apt-transport-https ca-certificates curl gnupg-agent software-properties-common
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io
```

Install nvidia-docker-2.

```bash
distribution=$(. /etc/os-release;echo $ID$VERSION_ID)
curl -s -L https://nvidia.github.io/nvidia-docker/gpgkey | sudo apt-key add -
curl -s -L https://nvidia.github.io/nvidia-docker/$distribution/nvidia-docker.list | sudo tee /etc/apt/sources.list.d/nvidia-docker.list
sudo apt-get update
sudo apt-get install -y docker-ce nvidia-docker2
sudo systemctl restart docker
```

---

## Enable NVIDIA MPS on the host computer

> [!TIP]
> Run the MPS instructions from a terminal window on the host computer. Not inside your Docker container instance.

For best performance and utilization, configure the **host computer's** GPU(s) for [NVIDIA MPS](https://docs.nvidia.com/deploy/pdf/CUDA_Multi_Process_Service_Overview.pdf). Run the MPS instructions from a terminal window on the host computer.

```bash
# Set GPU(s) compute mode to EXCLUSIVE_PROCESS
sudo nvidia-smi --compute-mode=EXCLUSIVE_PROCESS

# Cronjob for setting GPU(s) compute mode to EXCLUSIVE_PROCESS on boot
echo "SHELL=/bin/bash" > /tmp/nvidia-mps-cronjob
echo "PATH=/usr/local/sbin:/usr/local/bin:/sbin:/bin:/usr/sbin:/usr/bin" >> /tmp/nvidia-mps-cronjob
echo "@reboot   root    nvidia-smi --compute-mode=EXCLUSIVE_PROCESS" >> /tmp/nvidia-mps-cronjob

sudo chown root:root /tmp/nvidia-mps-cronjob
sudo mv /tmp/nvidia-mps-cronjob /etc/cron.d/

# Service entry for automatically starting MPS control daemon
echo "[Unit]" > /tmp/nvidia-mps.service
echo "Description=NVIDIA MPS control service" >> /tmp/nvidia-mps.service
echo "After=cron.service" >> /tmp/nvidia-mps.service
echo "" >> /tmp/nvidia-mps.service
echo "[Service]" >> /tmp/nvidia-mps.service
echo "Restart=on-failure" >> /tmp/nvidia-mps.service
echo "ExecStart=/usr/bin/nvidia-cuda-mps-control -f" >> /tmp/nvidia-mps.service
echo "" >> /tmp/nvidia-mps.service
echo "[Install]" >> /tmp/nvidia-mps.service
echo "WantedBy=multi-user.target" >> /tmp/nvidia-mps.service

sudo chown root:root /tmp/nvidia-mps.service
sudo mv /tmp/nvidia-mps.service /etc/systemd/system/

sudo systemctl --now enable nvidia-mps.service

```

## Deploy the Spatial Analytics container on the host computer using Azure IoT Hub and Azure IoT Edge

First, create an instance of an [Azure IoT Hub](https://docs.microsoft.com/azure/iot-hub/iot-hub-create-through-portal) service, either using the Standard (S1) or Free (F0) tier pricing tier. If your host computer is an Azure Stack Edge, use the same subscription and resource group that is used by the Azure Stack Edge resource.

Follow these instructions to create an instance of Azure IoT Hub using the Azure CLI. Make sure to replace the name of the parameters where appropriate. Alternatively, you can create the Azure IoT Hub on the [Azure Portal](https://portal.azure.com/).

```bash
az login
az account set --subscription <name or ID of Azure Subscription>
az group create --name "test-resource-group" --location "WestUS"

az iot hub create --name "test-iot-hub-123" --sku S1 --resource-group "test-resource-group"

az iot hub device-identity create --hub-name "test-iot-hub-123" --device-id "my-edge-device" --edge-enabled
```
 

If the host computer isn't an Azure Stack Edge device, you will need to install [Azure IoT Edge](https://docs.microsoft.com/en-us/azure/iot-edge/how-to-install-iot-edge-linux) and register the host computer as an IoT Edge device in your IoT Hub instance, using a [connection string](https://docs.microsoft.com/azure/iot-edge/how-to-register-device#register-in-the-azure-portal).
You need to connect the IoT Edge device to your Azure IoT Hub. You need to copy the connection string from the IoT Edge device you created earlier. Alternatively, you can run this command in Azure CLI later to replace the names with your own.

```bash
az iot hub device-identity show-connection-string --device-id my-edge-device --hub-name test-iot-hub-123
```

On the host computer open  `/etc/iotedge/config.yaml` for editing. Replace `ADD DEVICE CONNECTION STRING HERE` with the connection string. Save and close the file. 
Run this command to restart the IoT Edge service on the host computer.

```bash
sudo systemctl restart iotedge
```


## How to deploy the container on Azure IoT Edge on the host computer 

Deploy the Project Archon container as an **IoT Module** on the **host computer** either from [Azure Portal](https://docs.microsoft.com/en-us/azure/iot-edge/how-to-deploy-modules-portal) or [Azure CLI](https://docs.microsoft.com/en-us/azure/iot-edge/how-to-deploy-modules-cli). Set the **image URI** to the location of your Azure Container Registry. Below are the steps to deploy from Azure CLI.<br>

### IoT Deployment manifest

To streamline the container deployment on multiple **host computers**, you may create a deployment manifest file and capture the  **Container Create Options** and **Environment Variables**. You can find an example of a deployment manifest at [DeploymentManifest.json](./DeploymentManifest.json).<br>

Set the **Container Create Options** for the **IoT Edge Module** as shown below. It's in the `createOptions` in `peopleanalytics` module in `DeploymentManifest.json`: 

```json
{
  "k8s-experimental": {
    "volumes": [
      {
        "volume": {
          "name": "dshm",
          "emptyDir": {
            "medium": "Memory",
            "sizeLimit": 536870912
          }
        },
        "volumeMounts": [
          {
            "name": "dshm",
            "mountPath": "/dev/shm",
            "mountPropagation": "None",
            "readOnly": "false",
            "subPath": ""
          }
        ]
      }
    ]
  },
  "HostConfig": {
    "IpcMode": "host",
    "NetworkMode": "host",
    "Binds": [
      "/tmp/.X11-unix:/tmp/.X11-unix"
    ],
    "Runtime": "nvidia",
    "LogConfig": {
      "Type": "json-file",
      "Config": {
        "max-size": "10m",
        "max-file": "200"
      }
    }
  }
}
```   

### Environment Variables
The following table represents the various **Environment Variables** for the **IoT Edge Module** and their corresponding descriptions, you can also set them in `env` in `peopleanalytics` in `DeploymentManifest.json`:

| Setting Name | Value | Description|
|---------|---------|---------|
| ARCHON_LOG_LEVEL | Info; Verbose | Logging level, select one of the the two values|
| ARCHON_SHARED_BUFFER_LIMIT | 377487360 | Do not modify|
| ARCHON_PERF_MARKER| false| Set this to true for performance logging, otherwise this should be false| 
| ARCHON_NODES_LOG_LEVEL | Info; Verbose | Logging level, select one of the two values|
| OMP_WAIT_POLICY | PASSIVE | Do not modify|
| QT_X11_NO_MITSHM | 1 | Do not modify|
| API_KEY | your API Key| Collect this value from Azure Portal from your **Project Archon** resource _Keys_ page|
| BILLING_ENDPOINT | your Endpoint URI| Collect this value from Azure Portal from your **Project Archon** resource _Overview_ page|
| EULA | accept | This value needs to be **accept** for the container to run|
| DISPLAY | :1 | This value needs to be same as the output of `echo $DISPLAY` on the host computer|


> [!IMPORTANT]
> The `Eula`, `Billing`, and `ApiKey` options must be specified to run the container; otherwise, the container won't start.  For more information, see [Billing](#billing).<br>

You also need to provide credentials to the Azure Container Registry where the container is stored.

```
 "runtime": {
                    "settings": {
                        "minDockerVersion": "v1.25",
                        "registryCredentials": {
                            "offlinepreviewprojectarchon": {
                                "address": "offlinepreviewprojectarchon.azurecr.io",
                                "password": "<Service Principal Password>",
                                "username": "<Service Principal Id>"
                            },
                            "rtvsofficial": {
                                "address": "rtvsofficial.azurecr.io",
                                "password": "<Service Principal Password>",
                                "username": "<Service Principal Id>"
                            }
                        }
                    },
                    "type": "docker"
                },
```
Once you update the `deployment.json` file with your own settings and selection of operations, you may use this command in [Azure CLI](https://docs.microsoft.com/en-us/azure/iot-edge/how-to-deploy-modules-cli) to deploy the container on the **host computer** as an IoT Edge Module. 

```
az iot edge deployment create --deployment-id "<deployment name>" --hub-name "<IoT Hub name>" --content deployment.json --target-condition "deviceId='<IoT Edge device name>'" -–subscription "<subscriptionId>"
```
* deployment name: Pick a name for the deployment
* IoT Hub name: Your Azure IoT Hub name. 
* deployment.json: The name of the deployment file. 
* IoT Edge device name: Your IoT Edge device name for the **host computer**. 
* Subscription: subscription Id or name

This command starts the deployment. Navigate to the page of your Azure IoT Hub instance in the Azure Portal to see the deployment status. The status may show as "417 – The device’s deployment configuration is not set" until the device finishes downloading the container images and starts running.

You can [add AI skills](people-analytics-ai-skills.md) for detection and tracking for each camera device you configure. 

## Validate that the deployment is successful

There are several ways to validate that the container is running. Locate the *Runtime Status* in the **IoT Edge Module Settings** for the Spatial Analytics module in your Azure IoT Hub instance on Azure Portal. Validate that the **Desired Value** and **Reported Value** for the *Runtime Status* is `Running`.

Once the deployment is complete and the container is running, the **host computer** will start sending events to the Azure IoT Hub. If you used the `.Debug` version of the operations, you’ll see a visualizer window for each camera you configured in the deployment manifest. You can now define the lines and zones you want to monitor in the deployment manifest and follow the instructions to deploy again. 

## Configure the operations performed by Spatial Analytics

Use [Spatial Analytics operations](spatial-analytics-operations.md) to configure the container to use connected cameras, enable video recording, and more.

### Re-deploying / Deleting the deployment

If you need to update the deployment, you need to make sure your previous deployments are successfully deployed OR you need to delete deployments that did not complete (from the Azure Portal-> IoT Hub -> IoT Edge device -> Deployments). Otherwise, those deployments will continue to proceed leaving the system in a bad state.  More information can be found here: https://docs.microsoft.com/cli/azure/ext/azure-cli-iot-ext/iot/edge/deployment?view=azure-cli-latest

## How to consume output generated by the Spatial Analytics container

You may want to consume the detections or events generated by the Project Archon container by integrating these into your application or solution. Here are a few approaches you can investigate to get started: 

1.	Use the Azure Event Hub SDK for your chosen programming language to connect to the Azure IoT Hub endpoint and receive the events. See [Read device-to-cloud messages from the built-in endpoint](https://docs.microsoft.com/azure/iot-hub/iot-hub-devguide-messages-read-builtin) for more information. 
2.	Set up **Message Routing** on your Azure IoT Hub to send the events to other endpoints or save the events to Azure Blob Storage, etc. See [IoT Hub Message Routing](https://docs.microsoft.com/azure/iot-hub/iot-hub-devguide-messages-d2c) for more information. 
3.	Setup an **Azure Stream Analytics** job to process the events in real-time as they arrive and create visualizations. See the sample at [Azure Stream Analytics sample Job](Project-Archon-Stream-Analytics-Sample.md)


## Running Spatial Analysis using recorded video file

The following section is provided to run the Spatial Analysis operations using a pre-recorded video file.

1.	Record a video file from the H.264 encoded camera stream and save it as mp4
2.	Create a blob storage account in azure or use an existing one 
3. 	Update blob storage configurations (Configuration section)
	* Chane `Secure transfer required` to `Disabled`
	* Change `Allow Blob public access` to `Enabled`
4. 	Navigate to `Container` section and create a new container or use an existing one
5. 	Upload the video file to the container
6. 	Click on (...) link on the uploaded file and select `Generate SAS`
7. 	In the new dialog make sure to set the `Expiry Date` long enough to cover the testing period 
8.	Set `Allowed Protocols` to `HTTP` (`HTTPS` is not supported)
9. 	Click on `Generate SAS Token and URL` and copy the `Blob SAS URL` url value 
10.	Replace the starting `https` with `http` and test this url in the browser (browser should be able to play that file using http url)
11.	Replace the `VIDEO_URL` in the deployment manifest with http url just created (as shown below) for all the graphs
12.	Update the `VIDEO_IS_LIVE` to `false`
13.	Re-deploy using updated manifest
14.	Spatial Analysis module will start consuming video file and it will continuously auto replay as well.


```json
"zonecrossing": {
  "operationId" : "cognitiveservices.vision.spatialanalysis-personcrossingpolygon",
  "version": 1,
  "enabled": true,
  "parameters": {
      "VIDEO_URL": "Replace http url here",
      "VIDEO_SOURCE_ID": "personcountgraph",
      "VIDEO_IS_LIVE": false,
        "VIDEO_DECODE_GPU_INDEX": 0,
        "VICA_NODE_CONFIG": "{ \"gpu_index\": 0}",
      "TRACKER_NODE_CONFIG": "{ \"gpu_index\": 0 }",
      "DETECTOR_NODE_CONFIG": "{ \"gpu_index\": 0 }",
      "SPACEANALYTICS_CONFIG": "{\"zones\":[{\"name\":\"queue\",\"polygon\":[[0.3,0.3],[0.3,0.9],[0.6,0.9],[0.6,0.3],[0.3,0.3]], \"threshold\":35.0}]}"
    }
  },

```

## Troubleshooting the Azure Stack Edge device

When starting or running the container, you may experience issues. You can collect logs and telemetry which are helpful when troubleshooting issues. Visit the [Troubleshooting page](Project-Archon-Telemetry.md) for details.<br>
This page also has troubleshooting steps for Azure Stack Edge device configuration.

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


## Summary

In this article, you learned concepts and workflow for downloading, installing, and running the Project Archon  container for Spatial Analysis. In summary:

* Project Archon provides Linux container for Docker, encapsulating Spatial Analysis capabilities.
* Container images are downloaded from the container registry in Azure.
* Container images run as IoT Modules in Azure IoT Edge.
* How to configure the container with parameters for camera, zone, and line configuration. 
* You're required to provide the API key information when deploying the container on Azure IoT Edge.
* You're required to accept EULA terms when deploying the container on Azure IoT Edge.

---
title: How to install and run the People Analytics container - Computer Vision
titleSuffix: Azure Cognitive Services
description: How to download, install, and run containers for Computer Vision in this walkthrough tutorial.
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: computer-vision
ms.topic: conceptual
ms.date: 05/05/2020
ms.author: aahi
---

# Install and run the People Analytics container (Preview)

The People Analytics container enables you to analyze real-time streaming video to understand spatial relationships between people, their identities, activities, and interactions with objects in your own environment. Containers are great for specific security and data governance requirements. In this article you'll learn how to download, install, and run a People Analytics container for People Analytics.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Prerequisites

You must meet the following prerequisites before using the People Analytics container:

| Required | Purpose |
|--|--|
| Camera | The People Analytics container is not tied to a specific camera brand. The camera device needs to support Real Time Streaming Protocol(RTSP) and H.264 encoding, needs to be accessible to the host computer, and needs to be capable of streaming at 15FPS and 1080p resolution. |
| Edge hardware device | You need a compute device to run the People Analytics container. This device requires a [NVIDIA Tesla T4 GPU](https://www.nvidia.com/en-us/data-center/tesla-t4/). We recommend that you use [Azure Stack Edge](https://azure.microsoft.com/en-us/products/azure-stack/edge/) with GPU acceleration, however the container runs on any other device with an NVIDIA Tesla T4 GPU. We will refer to this device as the **host computer**. |
| Linux OS | You need [Ubuntu Desktop 18.04 LTS](https://ubuntu.com/download/desktop) installed on the **host computer**.  |
| NVIDIA CUDA Toolkit and Drivers | [NVIDIA CUDA Toolkit](https://docs.nvidia.com/cuda/cuda-installation-guide-linux/index.html) and [NVIDIA graphics drivers](https://docs.nvidia.com/datacenter/tesla/tesla-installation-notes/index.html) need to be installed on the **host computer**.<br>Reboot.<br>After reboot, run these instructions from a terminal window on the **host computer**:<br>`nvidia-smi`<br>Check the output and verify that the NVIDIA GPU is detected.<br>
| NVIDIA MPS | The  host computer GPU(s) need to be configured for [NVIDIA MPS](https://docs.nvidia.com/deploy/pdf/CUDA_Multi_Process_Service_Overview.pdf) (Multi-Process Service). |
| Docker Engine | [Docker CE](https://docs.docker.com/install/linux/docker-ce/ubuntu/#install-docker-engine---community-1) and the [NVIDIA-Docker2](https://github.com/NVIDIA/nvidia-docker) need to be installed on the **host computer**.  For a primer on Docker and container basics, see the [Docker overview](https://docs.docker.com/engine/docker-overview/).<br><br> Docker must be configured to allow the container to connect with and send billing data to Azure.   |
| Familiarity with Docker | You should have a basic understanding of Docker concepts, like registries, repositories, containers, and container images, as well as knowledge of basic `docker` commands. |
| Azure IoT Hub | You should have a basic understanding of Azure IoT Hub service and deployment configurations as you will need to deploy an instance of Azure IoT Hub service. For documentation, see the [Azure IoT Hub](https://docs.microsoft.com/en-us/azure/iot-hub/) documentation. 
|Azure IoT Edge| You should have a basic understanding of Azure IoT Edge deployment configurations as you will need to install the Azure IoT Edge runtime on the **host computer**. For documentation, see the [Azure IoT Edge](https://docs.microsoft.com/en-us/azure/iot-edge/how-to-install-iot-edge-linux) documentation.<br>To manually provision the IoT Edge device, you need to provide it with a [connection string](https://docs.microsoft.com/en-us/azure/iot-edge/how-to-register-device#register-in-the-azure-portal) that you can create by registering the **host computer**  as an IoT Edge in your Azure IoT Hub instance.|
|Computer Vision resource |In order to use the container, you must have:<br><br>An Azure **Computer Vision** resource and the associated API key the endpoint URI. Both values are available on the Overview and Keys pages for the resource and are required to start the container.<br><br>**{API_KEY}**: One of the two available resource keys on the **Keys** page<br><br>**{ENDPOINT_URI}**: The endpoint as provided on the **Overview** page|

## Request access to the private container registry

Fill out and submit the [request form](https://aka.ms/cognitivegate) to request access to the container. 

[!INCLUDE [Request access to public preview](../../../includes/cognitive-services-containers-request-access.md)]

[!INCLUDE [Gathering required container parameters](../containers/includes/container-gathering-required-parameters.md)]


## Setup the host computer

It is recommended that you use an [Azure Stack Edge](https://azure.microsoft.com/products/azure-stack/edge/) device for your **host computer**. If you need to configure a desktop or any other edge machine, skip to the next section titled **Setup a Desktop Machine**.

### Azure Stack Edge device configuration

Azure Stack Edge is a Hardware-as-a-Service solution and an AI-enabled edge computing device with network data transfer capabilities. This guide provides you an overview of how to deploy the People Analytics container on Azure Stack Edge. You can read more about Azure Stack Edge and detailed setup instructions here. See information below for Azure Stack Edge devices.

* [Azure Stack Edge / Data Box Gateway Resource Creation](https://docs.microsoft.com/azure/databox-online/azure-stack-edge-deploy-prep)
* [Install and Setup](https://docs.microsoft.com/azure/databox-online/azure-stack-edge-deploy-install)
* [Connection and Activation](https://docs.microsoft.com/azure/databox-online/azure-stack-edge-deploy-connect-setup-activate)

#### Configure Compute on the ASE Portal 

1. For activation, the People Analytics container uses the compute features of the Azure Stack Edge to run an AI solution. First, activate the Azure Stack Edge device by following the activation steps listed [here](https://docs.microsoft.com/azure/databox-online/azure-stack-edge-deploy-connect-setup-activate). 

2. Enabling Compute Prerequisites: Before you begin, make sure that: 

    * You've activated your Azure Stack Edge device 
    * You've access to a Windows client system running PowerShell 5.0 or later to access the device.  
    * If you're deploying to a Kubernetes cluster, you need to configure your Azure Stack Edge device via the _Local UI_ on the [Azure Portal](https://portal.azure.com/). Each of these procedures are described in the following sections. 

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

3. On the _Configure Edge compute_ view, input the following:

    Iot Hub: Choose from New or Existing. 
    By default, a Standard tier (S1) is used to create an IoT resource. To use a free tier IoT resource, create one and then select the existing resource. 
    In each case, the IoT Hub resource uses the same subscription and resource group that is used by the Azure Stack Edge resource 

4. Click _Create_. The IoT Hub resource creation takes a couple of minutes. After the IoT Hub resource is created, the _Configure Edge compute_ tile updates to show the compute configuration. To confirm that the Edge compute role has been configured, select the _View config_ on the Configure compute tile. 

    ![Link](./media/ase4.PNG)

5. When the Edge compute role is set up on the Edge device, it creates two devices: an IoT device and an IoT Edge device. Both devices can be viewed in the IoT Hub resource. The Azure IoT Edge Runtime is already running on this IoT Edge device.         	 

    Note: At this point, only the Linux platform is available for your IoT Edge device.

    For help troubleshooting the Azure Stack Edge device, please go to the [Troubleshooting](Project-Archon-Telemetry.md) page.

## Optional - Setup a Desktop Machine

Follow these instructions if your host computer isn't an Azure Stack Edge device. Otherwise skip to the **Enable NVIDIA MPS** section.

### System Requirements

The **host computer** requires a [NVIDIA Tesla T4 GPU](https://www.nvidia.com/en-us/data-center/tesla-t4/).

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

```bash
wget https://developer.download.nvidia.com/compute/cuda/repos/ubuntu1804/x86_64/cuda-ubuntu1804.pin
sudo mv cuda-ubuntu1804.pin /etc/apt/preferences.d/cuda-repository-pin-600
sudo apt-key adv --fetch-keys https://developer.download.nvidia.com/compute/cuda/repos/ubuntu1804/x86_64/7fa2af80.pub
sudo add-apt-repository "deb http://developer.download.nvidia.com/compute/cuda/repos/ubuntu1804/x86_64/ /"
sudo apt-get update
sudo apt-get -y install cuda
```

Reboot, and run the following command.

```bash
nvidia-smi
```
You should see the following output.

![NVIDIA driver SMI info](.\media\nvidia-smi-info.png)


### Install Docker CE and nvidia-docker2 on the host computer

Install Docker CE.

```bash
sudo apt-get update
sudo apt-get install apt-transport-https ca-certificates curl gnupg-agent software-properties-common
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io
```

Install *nvidia-docker-2*.

```bash
distribution=$(. /etc/os-release;echo $ID$VERSION_ID)
curl -s -L https://nvidia.github.io/nvidia-docker/gpgkey | sudo apt-key add -
curl -s -L https://nvidia.github.io/nvidia-docker/$distribution/nvidia-docker.list | sudo tee /etc/apt/sources.list.d/nvidia-docker.list
sudo apt-get update
sudo apt-get install -y docker-ce nvidia-docker2
sudo systemctl restart docker
```

## Enable NVIDIA MPS on the host computer

For best performance and utilization, configure the **host computer's** GPU(s) for [NVIDIA MPS](https://docs.nvidia.com/deploy/pdf/CUDA_Multi_Process_Service_Overview.pdf). Run the MPS instructions from a terminal window on the host computer (not inside your Docker container instance).

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

## Deploy the People Analytics container on the host computer using Azure IoT Hub and Azure IoT Edge

Fist, create an instance of an [Azure IoT Hub](https://docs.microsoft.com/azure/iot-hub/iot-hub-create-through-portal) service, either using the Standard tier (S1) for the Free tier(F0) IoT resource. If your **host computer** is an Azure Stack Edge, use the same subscription and resource group that is used by the Azure Stack Edge resource.

Follow these instructions to create an instance of Azure IoT Hub in Azure CLI. Make sure to replace the name of the parameters as you see fit. Alternatively, you can create the Azure IoT Hub on the [Azure Portal](https://portal.azure.com/).

```bash
az login
az account set --subscription <name or ID of Azure Subscription>
az group create --name "test-resource-group" --location "WestUS"

az iot hub create --name "test-iot-hub-123" --sku S1 --resource-group "test-resource-group"

az iot hub device-identity create --hub-name "test-iot-hub-123" --device-id "my-edge-device" --edge-enabled
```
 

If the **host computer** is **not** an Azure Stack Edge, you need to install [Azure IoT Edge](https://docs.microsoft.com/en-us/azure/iot-edge/how-to-install-iot-edge-linux) and register the **host computer** as an IoT Edge in your Azure IoT Hub instance using a [connection string](https://docs.microsoft.com/en-us/azure/iot-edge/how-to-register-device#register-in-the-azure-portal).
You need to connect the IoT Edge device to your Azure IoT Hub. You need to copy the connection string from the IoT Edge device you created earlier. Alternatively, you can run this command in Azure CLI later to replace the names with your own.

```bash
az iot hub device-identity show-connection-string --device-id my-edge-device --hub-name test-iot-hub-123
```
On the **host computer** open  /etc/iotedge/config.yaml for editing. Replace ADD DEVICE CONNECTION STRING HERE with the conection string. Save and close the file. 
Run this command to restart the IoT Edge service on the **host computer**.

```bash
sudo systemctl restart iotedge
```


## How to deploy the container on Azure IoT Edge on the host computer 

Deploy the People Analytics container as an **IoT Module** on the **host computer** either from [Azure Portal](https://docs.microsoft.com/azure/iot-edge/how-to-deploy-modules-portal) or [Azure CLI](https://docs.microsoft.com/azure/iot-edge/how-to-deploy-modules-cli). Set the image URI to the location of your Azure Container Registry.<br>
Set the **Container Create Options** for the **IoT Edge Module** as shown below: 

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
      "/tmp/.X11-unix:/tmp/.X11-unix",
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
The following table represents the various **Environment Variables** for the **IoT Edge Module** and their corresponding descriptions:

| Setting Name | Value | Description|
|---------|---------|---------|
| ARCHON_LOG_LEVEL | Info; Verbose | Logging level, select one of the the two values|
| ARCHON_SHARED_BUFFER_LIMIT | 377487360 | Do not modify|
| ARCHON_PERF_MARKER| false| Set this to true for performance logging, otherwise this should be false| 
| ARCHON_NODES_LOG_LEVEL | Info; Verbose | Logging level, select one of the two values|
| OMP_WAIT_POLICY | PASSIVE | Do not modify|
| QT_X11_NO_MITSHM | 1 | Do not modify|
| API KEY | your API Key| Collect this value from Azure Portal from your **People Analytics** resource _Keys_ page|
| Endpoint URI | your Endpoint URI| Collect this value from Azure Portal from your **People Analytics** resource _Overview_ page|
| EULA | accept | This value needs to be **accept** for the container to run|
| DISPLAY | :1 | This value needs to be same as the output of `echo $DISPLAY` on the host computer|

***

> [!IMPORTANT]
> The `Eula`, `Billing`, and `ApiKey` options must be specified to run the container; otherwise, the container won't start.  For more information, see [Billing](#billing).<br>

### IoT Deployment manifest
To streamline the container deployment on multiple **host computers**, you may create a deployment manifest file and capture the  **Container Create Options** and **Environment Variables**. You can find an example of a deployment manifest at [DeploymentManifest.json](./DeploymentManifest.json).
You need to update this file with your own deployment settings. For instance, you need to provide credentials to the Azure Container Registry where the container is stored.

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
Once you update the deployment.json file with your own settings and selection of AI skills, you may use this command in [Azure CLI](https://docs.microsoft.com/azure/iot-edge/how-to-deploy-modules-cli) to deploy the container on the **host computer** as an IoT Edge Module. 

```bash
az iot edge deployment create --deployment-id "<deployment name>" --hub-name "<IoT Hub name>" --content deployment.json --target-condition "deviceId='<IoT Edge device name>'" –subscription "<subscriptionId>"
```

* deployment name: Pick a name for the deployment
* IoT Hub name: Your Azure IoT Hub name. 
* deployment.json: The name of the deployment file. 
* IoT Edge device name: Your IoT Edge device name for the **host computer**. 
* Subscription: subscription Id or name

This command starts the deployment. Navigate to the page of your Azure IoT Hub instance in the Azure Portal to see the deployment status. The status may show as "417 – The device’s deployment configuration is not set" until the device finishes downloading the container images and starts running.

You can [add AI skills](people-analytics-ai-skills.md) for detection and tracking for each camera device you configure. 

## Validate that the deployment is successful

There are several ways to validate that the container is running. Locate the *Runtime Status* in the **IoT Edge Module Settings** for the People Analytics module in your Azure IoT Hub instance on Azure Portal. Validate that the **Desired Value** and **Reported Value** for the *Runtime Status* is `Running`.

Once the deployment is complete and the container is running, the **host computer** will start sending events to the Azure IoT Hub. If you used the .Debug version of the skills, you’ll see a visualizer window for each camera you configured in the deployment manifest. You can now define the lines and zones you want to monitor in the deployment manifest and follow the instructions to deploy again. 

### Re-deploying / Deleting the deployment

If you need to update the deployment, you need to make sure your previous deployments are successfully deployed OR you need to delete deployments that did not complete (from the Azure Portal-> IoT Hub -> IoT Edge device -> Deployments). Otherwise, those deployments will continue to proceed leaving the system in a bad state.  More information can be found here: https://docs.microsoft.com/en-us/cli/azure/ext/azure-cli-iot-ext/iot/edge/deployment?view=azure-cli-latest


## Enable Video Recording

You can record video as it's processed by the container using the **Microsoft.ComputerVision.VideoRecorder** AI skill. For more information, see the [People Analytics AI skills](people-analytics-skills.md#enable-video-recording-with-the-microsoft-computervision-videorecorder-skill) article.

## How to consume output generated by the People Analytics container

You may want to consume the detections or events generated by the People Analytics container by integrating these into your application or solution. Here are a few approaches you can investigate to get started: 
1.	Use the Azure Event Hub SDK for your chosen programming language to connect to the Azure IoT Hub endpoint and receive the events. See [Read device-to-cloud messages from the built-in endpoint](https://docs.microsoft.com/en-us/azure/iot-hub/iot-hub-devguide-messages-read-builtin) for more information. 
2.	Set up **Message Routing** on your Azure IoT Hub to send the events to other endpoints or save the events to Azure Blob Storage, etc. See [IoT Hub Message Routing](https://docs.microsoft.com/en-us/azure/iot-hub/iot-hub-devguide-messages-d2c) for more information. 

## Troubleshooting

When starting or running the container, you may experience issues. You can collect logs and telemetry which are helpful when troubleshooting issues. Visit the [Troubleshooting page](Project-Archon-Telemetry.md) for details.<br>
This page also has troubleshooting steps for Azure Stack Edge device configuration.
 
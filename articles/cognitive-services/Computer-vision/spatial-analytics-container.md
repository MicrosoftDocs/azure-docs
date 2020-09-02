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

The Spatial Analytics container enables you to analyze real-time streaming video to understand spatial relationships between people, their identities, activities, and interactions with objects in your own environment. Containers are great for specific security and data governance requirements.

## Prerequisites

* Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services)
* Once you have your Azure subscription, <a href="https://portal.azure.com/#create/Microsoft.CognitiveServicesComputerVision"  title="Create a Computer Vision resource"  target="_blank">create a Computer Vision resource <span class="docon docon-navigate-external x-hidden-focus"></span></a> in the Azure portal to get your key and endpoint. After it deploys, click **Go to resource**.
    * You will need the key and endpoint from the resource you create to run the Spatial Analytics container. You'll use your key and endpoint later.

### Spatial Analytics container requirements

To run the Spatial Analytics container, you need a compute device (referred to here as a host computer) with a [NVIDIA Tesla T4 GPU](https://www.nvidia.com/data-center/tesla-t4/). We recommend that you use [Azure Stack Edge](https://azure.microsoft.com/products/azure-stack/edge/) with GPU acceleration, however the container runs on any other desktop machine that meets the minimum requirements. We will refer to this device as the host computer.

#### [Azure Stack Edge device](#tab/azure-stack-edge)

Azure Stack Edge is a Hardware-as-a-Service solution and an AI-enabled edge computing device with network data transfer capabilities. For detailed preparation and setup instructions, see the [Azure Stack Edge documentation](https://docs.microsoft.com/azure/databox-online/azure-stack-edge-deploy-prep).

#### [Desktop machine](#tab/desktop-machine)

#### Minimum hardware requirements

* 4 GB system RAM
* 4 GB of GPU RAM
* Single core CPU
* 1 NVIDIA Tesla T4 GPU
* 20 GB of HDD space

#### Recommended hardware

* 32 GB system RAM
* 16 GB of GPU RAM
* 8 core CPU
* 2 NVIDIA Tesla T4 GPUs
* 50 GB of SSD space

---

| Requirement | Description |
|--|--|
| Camera | The Spatial Analytics container is not tied to a specific camera brand. The camera device needs to: support Real Time Streaming Protocol(RTSP) and H.264 encoding, be accessible to the host computer, and be capable of streaming at 15FPS and 1080p resolution. |
| Linux OS | [Ubuntu Desktop 18.04 LTS](https://ubuntu.com/download/desktop) must be installed on the host computer.  |

In this article, you will download and install the following software packages. The host computer must be able to run the following:

* [NVIDIA CUDA Toolkit](https://docs.nvidia.com/cuda/cuda-installation-guide-linux/index.html) and [NVIDIA graphics drivers](https://docs.nvidia.com/datacenter/tesla/tesla-installation-notes/index.html) 
* Configurations for [NVIDIA MPS](https://docs.nvidia.com/deploy/pdf/CUDA_Multi_Process_Service_Overview.pdf) (Multi-Process Service).
* [Docker CE](https://docs.docker.com/install/linux/docker-ce/ubuntu/#install-docker-engine---community-1) and [NVIDIA-Docker2](https://github.com/NVIDIA/nvidia-docker) 
* [Azure IoT Edge](https://docs.microsoft.com/azure/iot-edge/how-to-install-iot-edge-linux) runtime.
* [Azure IoT Hub](https://docs.microsoft.com/azure/iot-hub/) 

## Request access to the private container registry

Fill out and submit the [request form](https://aka.ms/cognitivegate) to request access to the container. 

[!INCLUDE [Request access to public preview](../../../includes/cognitive-services-containers-request-access.md)]

[!INCLUDE [Gathering required container parameters](../containers/includes/container-gathering-required-parameters.md)]


## Setup the host computer

It is recommended that you use an Azure Stack Edge device for your host computer. Click **Desktop Machine** if you're configuring a different device.

#### [Azure Stack Edge device](#tab/azure-stack-edge)

### Configure compute on the Azure Stack Edge portal 
 
Spatial Analytics uses the compute features of the Azure Stack Edge to run an AI solution. To enable the compute features, make sure that: 

* You've [connected and activated](https://docs.microsoft.com/azure/databox-online/azure-stack-edge-deploy-connect-setup-activate) your Azure Stack Edge device. 
* You have a Windows client system running PowerShell 5.0 or later, to access the device.  
* To deploy a Kubernetes cluster, you need to configure your Azure Stack Edge device via the **Local UI** on the [Azure Portal](https://portal.azure.com/): 
  1. Enable the compute feature on your Azure Stack Edge device. To enable compute, go to the **Compute** page in the web interface for your device. 
  2. Select a network interface that you want to enable for compute, then click **Enable**. This will create a virtual switch on your device, on that network interface.
  3. Leave the Kubernetes test node IPs and the Kubernetes external services IPs blank.
  4. Click **Apply**. This operation may take about two minutes. 

![Configure compute](media/spatial-analytics/configure-compute.png)

### Set up an Edge compute role and create an IoT Hub resource

In the [Azure portal](https://portal.azure.com/), navigate to your Azure Stack Edge resource. On the **Overview** page or navigation list, click the Edge compute **Get started** button. 

![Configure edge compute](media/configure-edge-compute.png)

In the **Configure Edge compute** tile, click **Configure**. 

![Link](media/spatial-analytics/configure-edge-compute-tile.png)

In the **Configure Edge compute** page, choose an existing IoT Hub or choose to create a new one. By default, a Standard (S1) pricing tier is used to create an IoT Hub resource. To use a free tier IoT Hub resource, create one and then select it. The IoT Hub resource uses the same subscription and resource group that is used by the Azure Stack Edge resource 

Click **Create**. The IoT Hub resource creation may take a couple of minutes. After the IoT Hub resource is created, the **Configure Edge compute** tile will update to show the new configuration. To confirm that the Edge compute role has been configured, select **View config** on the **Configure compute** tile.

When the Edge compute role is set up on the Edge device, it creates two devices: an IoT device and an IoT Edge device. Both devices can be viewed in the IoT Hub resource. The Azure IoT Edge Runtime will already be running on the IoT Edge device.         	 

> [!NOTE]
> Currently only the Linux platform is available for IoT Edge devices. For help troubleshooting the Azure Stack Edge device, see the [logging and troubleshooting](spatial-analytics-logging.md) article.

#### [Desktop machine](#tab/desktop-machine)

Follow these instructions if your host computer isn't an Azure Stack Edge device.

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

![NVIDIA driver output](./media/nvidia-driver-output.png)

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

Install the *nvidia-docker-2* software package.

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

For best performance and utilization, configure the host computer's GPU(s) for [NVIDIA Multi Process Service (MPS)](https://docs.nvidia.com/deploy/pdf/CUDA_Multi_Process_Service_Overview.pdf). Run the MPS instructions from a terminal window on the host computer.

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

## Deploy the Spatial Analytics container using Azure IoT Hub and Azure IoT Edge

To deploy the Spatial Analytics container on the host computer, create an instance of an [Azure IoT Hub](https://docs.microsoft.com/azure/iot-hub/iot-hub-create-through-portal) service using the Standard (S1) or Free (F0) pricing tier. If your host computer is an Azure Stack Edge, use the same subscription and resource group that is used by the Azure Stack Edge resource.

Use the Azure CLI to create an instance of Azure IoT Hub. Replace the parameters where appropriate. Alternatively, you can create the Azure IoT Hub on the [Azure Portal](https://portal.azure.com/).

```bash
az login
az account set --subscription <name or ID of Azure Subscription>
az group create --name "test-resource-group" --location "WestUS"

az iot hub create --name "test-iot-hub-123" --sku S1 --resource-group "test-resource-group"

az iot hub device-identity create --hub-name "test-iot-hub-123" --device-id "my-edge-device" --edge-enabled
```

If the host computer isn't an Azure Stack Edge device, you will need to install [Azure IoT Edge](https://docs.microsoft.com/azure/iot-edge/how-to-install-iot-edge-linux). Next, register the host computer as an IoT Edge device in your IoT Hub instance, using a [connection string](https://docs.microsoft.com/azure/iot-edge/how-to-register-device#register-in-the-azure-portal).

You need to connect the IoT Edge device to your Azure IoT Hub. You need to copy the connection string from the IoT Edge device you created earlier. Alternatively, you can run the below command in the Azure CLI.

```bash
az iot hub device-identity show-connection-string --device-id my-edge-device --hub-name test-iot-hub-123
```

On the host computer open  `/etc/iotedge/config.yaml` for editing. Replace `ADD DEVICE CONNECTION STRING HERE` with the connection string. Save and close the file. 
Run this command to restart the IoT Edge service on the host computer.

```bash
sudo systemctl restart iotedge
```

Deploy the Project Archon container as an IoT Module on the host computer, either from the [Azure portal](https://docs.microsoft.com/azure/iot-edge/how-to-deploy-modules-portal) or [Azure CLI](https://docs.microsoft.com/azure/iot-edge/how-to-deploy-modules-cli). If you're using the portal, Set the image URI to the location of your Azure Container Registry. 

Use the below steps to deploy the container using the Azure CLI.

### IoT Deployment manifest

To streamline container deployment on multiple host computers, you can create a deployment manifest file to specify the container creation options, and environment variables. You can find an example of a deployment manifest [on GitHub](https://github.com/Azure-Samples/cognitive-services-sample-data-files).

In the deployment manifest, in `spatialanalysis`, set `createoptions` to specify the IoT Edge Module, as shown below. 

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

The following table shows the various Environment Variables used by the IoT Edge Module. You can also set them in the deployment manifest, using the `env` attribute in `spatialanalysis`:

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
> The `Eula`, `Billing`, and `ApiKey` options must be specified to run the container; otherwise, the container won't start.  For more information, see [Billing](#billing).

You also need to provide credentials to the Azure Container Registry where the container is stored.

```json
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

Once you update the `deployment.json` file with your own settings and selection of operations, you can use the below [Azure CLI](https://docs.microsoft.com/en-us/azure/iot-edge/how-to-deploy-modules-cli) command to deploy the container on the host computer, as an IoT Edge Module.
Change the following parameters:

|Column1  |Column2  |
|---------|---------|
| `--deployment-id` | A new name for the deployment. |
| `--hub-name` | Your Azure IoT Hub name. |
| `--content` | The name of the deployment file. |
| `--target-condition` | Your IoT Edge device name for the host computer. |
| `-–subscription` | Subscription ID or name. |

This command will start the deployment. Navigate to the page of your Azure IoT Hub instance in the Azure Portal to see the deployment status. The status may show as *417 – The device’s deployment configuration is not set* until the device finishes downloading the container images and starts running.


```
az iot edge deployment create --deployment-id "<deployment name>" --hub-name "<IoT Hub name>" --content deployment.json --target-condition "deviceId='<IoT Edge device name>'" -–subscription "<subscriptionId>"
```

## Validate that the deployment is successful

There are several ways to validate that the container is running. Locate the *Runtime Status* in the **IoT Edge Module Settings** for the Spatial Analytics module in your Azure IoT Hub instance on Azure Portal. Validate that the **Desired Value** and **Reported Value** for the *Runtime Status* is *Running*.

Once the deployment is complete and the container is running, the **host computer** will start sending events to the Azure IoT Hub. If you used the `.Debug` version of the operations, you’ll see a visualizer window for each camera you configured in the deployment manifest. You can now define the lines and zones you want to monitor in the deployment manifest and follow the instructions to deploy again. 

## Configure the operations performed by Spatial Analytics

You will need to use [Spatial Analytics operations](spatial-analytics-operations.md) to configure the container to use connected cameras, enable video recording, and more. For each camera device you configure, the operations for spatial analysis will generate an output stream of JSON messages, sent to your instance of Azure IoT Hub.

## Re-deploy or delete the deployment

If you need to update the deployment, you need to make sure your previous deployments are successfully deployed, or you need to delete IoT Edge Device deployments that did not complete. Otherwise, those deployments will continue, leaving the system in a bad state. You can use the Azure portal, or the [Azure CLI](https://docs.microsoft.com/cli/azure/ext/azure-cli-iot-ext/iot/edge/deployment?view=azure-cli-latest).

## How to consume output generated by the Spatial Analytics container

If you want to start consuming the output generated by the container, see the following articles:

*	Use the Azure Event Hub SDK for your chosen programming language to connect to the Azure IoT Hub endpoint and receive the events. See [Read device-to-cloud messages from the built-in endpoint](https://docs.microsoft.com/azure/iot-hub/iot-hub-devguide-messages-read-builtin) for more information. 
*	Set up Message Routing on your Azure IoT Hub to send the events to other endpoints or save the events to Azure Blob Storage, etc. See [IoT Hub Message Routing](https://docs.microsoft.com/azure/iot-hub/iot-hub-devguide-messages-d2c) for more information. 

## Running Spatial Analysis using recorded video file

To start using Spatial Analytics, use the following steps to send a pre-recorded video file to the container, and get the output.

1.	Record a video file from the H.264 encoded camera stream and save it as mp4
2.	Create a blob storage account in Azure, or use an existing one.
3. 	Update the blob storage configuration in the Azure portal:
	1. Change **Secure transfer required** to **Disabled**
	2. Change **Allow Blob public access** to **Enabled**
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

## Troubleshooting

If you encounter issues when starting or running the container, see [telemetry and troubleshooting](spartial-analytics-logging.md) for steps for common issues. This article also contains information on generating and collecting logs and collecting system health.

## Billing

The Spatial Analytics container sends billing information to Azure, using a Computer Vision resource on your Azure account.

Azure Cognitive Services containers aren't licensed to run without being connected to the metering / billing endpoint. You must enable the containers to communicate billing information with the billing endpoint at all times. Cognitive Services containers don't send customer data, such as the video or image that's being analyzed, to Microsoft.


## Summary

In this article, you learned concepts and workflow for downloading, installing, and running the Project Archon  container for Spatial Analysis. In summary:

* Spatial Analytics is a Linux container for Docker.
* Container images are downloaded from the container registry in Azure.
* Container images run as IoT Modules in Azure IoT Edge.
* How to configure the container and deploy it on a host machine.
---
title: Configure Project Archon containers
titleSuffix: Azure Cognitive Services
description: Project Archon provides each container with a common configuration framework, so that you can easily configure and manage compute, AI insight egress, logging, telemetry, and security settings.
services: cognitive-services
author: IEvangelist
manager: salmanq
ms.service: cognitive-services
ms.subservice: vision-service
ms.topic: conceptual
ms.date: 06/10/2020
ms.author: adinatru
---

# Tutorial: How to Deploy a People Counting Web Application

In this tutorial, you will learn how to integrate the Azure Computer Vision service into a web app to understand the movement of people and monitor the number of people occupying a physical space. This can have useful applications across a wide range of scenarios and industries. For example, if a company wants to optimize the use of its real estate space, they are able to quickly create a solution to determine the space occupancy.

In this tutorial you will learn how to:

* Deploy the Project Archon container
* Configure the operation and camera
* Configure the IoT Hub connection in the Web Application
* Deploy and Test the Web Application

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/en-us/free/cognitive-services/) before you begin.



## Prerequisites

* [Visual Studio 2017 Community edition](https://visualstudio.microsoft.com/vs/community/) or higher, with the "ASP.NET and web development" and "Azure development" workloads installed.
* Basic understanding of Node.js web application (follow https://docs.microsoft.com/en-us/azure/app-service/quickstart-nodejs?pivots=platform-linux to create such an app quickly).
* Basic understanding of Azure IoT Edge deployment configurations (follow https://docs.microsoft.com/en-us/azure/iot-hub/ to create an instance)
* An Azure Stack Edge device with GPU (follow https://docs.microsoft.com/en-us/azure/databox-online/azure-stack-edge-deploy-prep). Alternatively, you can use your own edge device with at least one Nvidia GPU T4.

<br>Project Archon container is published under the **spatial-analysis** name and it will be referred to as such in this article.

## Deploy the spatial-analysis Container

First create a Computer Vision resource. For details, see the section "Create the Computer Vision resource" on the [Project-Archon page](./Project-Archon.md). Locate and copy the values for the Billing Endpoint and the API Key.
Fill in the [Application for Gated Services](http://aka.ms/csgate) form to provide your Subscription ID for access to the container operations.

The next steps will detail how to deploy the **spatial-analysis** container using the [Azure CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli?view=azure-cli-latest). Once the container is deployed and you are able to collect telemetry data from your device, you can use that data to power your web application. 

### Configure the Azure Stack Edge Device
Follow [the Host Computer Setup](./Project-Archon-Host-Machine-Setup.md) to configure the Azure Stack Edge device and connect an IoT Edge device to Azure IoT Hub. For help with troubleshooting the Azure Stack Edge device, please refer to the [Troubleshooting](./Project-Archon-Troubleshooting.md) page.

### Deploy an Azure IoT Hub service in your Subscription
First, create an instance of an Azure IoT Hub service with either the Standard Pricing Tier (S1) or Free Tier (S0). Follow these instructions to create this instance in the Azure CLI.

```
az login
az account set --subscription <name or ID of Azure Subscription>
az group create --name "<Resource Group Name>" --location "WestUS"

az iot hub create --name "<IoT Hub Name>" --sku S1 --resource-group "test-resource-group"

az iot hub device-identity create --hub-name "<IoT Hub Name>" --device-id "<Edge Device Name>" --edge-enabled
```

Fill in the required parameters:
* Subscription: The name or ID of your Azure Subscription
* Resource group: Create a name for your resource group
* Iot Hub Name: Create a name for your IoT Hub
* IoTHub Name: The name of the IoT Hub you created 
* Edge Device Name: Create a name for your Edge Device

### Deploy the Container on Azure IoT Edge on the Host Computer
The next step is to deploy the **spatial-analysis** container as an IoT Module on the host computer using the Azure CLI. The deployment process requires a Deployment Manifest file which outlines the required containers, variables, and configurations for your deployment. A sample Deployment Manifest can be found at [DeploymentManifest.json](./DeploymentManifest.json) and includes a basic deployment configuration for the spatial-analysis container. 

Note: The spatial-analysis-telegraf and spatial-analysis-diagnostics containers are optional. You may decide to remove them from the DeploymentManifest.json. For more information see [Collecting System Health Telemetry with Telegraf](./Project-Archon-Telemetry.md) and [Logging and Troubleshooting](./Project-Archon-Troubleshooting.md). 

### Set Environment Variables
Most of the **Environment Variables** for the IoT Edge Module are already set in the sample DeploymentManifest.json. In the [DeploymentManifest.json](./DeploymentManifest.json) file, search for the BILLING_ENDPOINT and API_KEY environment variables, shown below. Replace the values with the Endpoint URI and the API Key that you created earlier.

```
"BILLING_ENDPOINT":{, 
"value": "<Use one key from Archon azure resource (keys page)>"
},
"API_KEY":{
"value": "<Use endpoint from Archon azure resource (overview page)>"
}
```
### Configure the Operation parameters
Now that the initial configuration of the **spatial-analysis** container is complete, the next step is to configure the operations parameters and add these to the deployment. 

The first step is to update the sample [DeploymentManifest.json](./DeploymentManifest.json) and configure the operationId for cognitiveservices.vision.spatialanalysis-personcount as shown below:


```
"personcount": {
    "operationId": "cognitiveservices.vision.spatialanalysis-personcount",
    "version": 1,
    "enabled": true,
    "parameters": {
        "VIDEO_URL": "<Replace RTSP URL here>",
        "VIDEO_SOURCE_ID": "<Replace with friendly name>",
        "VIDEO_IS_LIVE":true,
        "TRACKER_NODE_CONFIG": "{ \"gpu_index\": 0 }",
        "DETECTOR_NODE_CONFIG": "{ \"gpu_index\": 0 }",
        "SPACEANALYTICS_CONFIG": "{\"zones\":[{\"name\":\"queue\",\"polygon\":[<Replace with your values>], \"events\": [{\"type\":\"count\"}], \"threshold\":<use 0 for no threshold.}]}"
    }
},
```

After the Deployment Manifest is updated, follow the camera manufacturer's instructions to install the camera, configure the camera url, and configure the user name and password. 

Next, set the VIDEO_URL to the rtsp url of the camera and the credentials for connecting to the camera.

If the edge device has more than one GPU, select the GPU on which to run this operation. Make sure you load balance the operations where there are no more than 8 operations running on a single GPU at a time.  

For the next step, you need to configure the zone in which you want to count people. To configure the zone polygon, first follow the manufacturer’s instructions to retrieve a frame from the camera. To determine each vertex of the polygon, select a point on the frame, take the x,y pixel coordinates of the point relative to the left, top corner of the frame, and divide by the corresponding frame dimensions. Set the results as x,y coordinates of the vertex. You set the zone polygon configuration in the SPACEANALYTICS_CONFIG field.

This is a sample video frame that shows how the vertex coordinates are being calculated for a frame of size 1920/1080.
![Sample video frame](./media/TutorialSampleVideoFrame.jpg)

You may also select a confidence threshold for when detected people are counted and events are generated. Set the threshold to 0 if you’d like all events to be output.

### Execute the Deployment
Now that the deployment manifest is complete, use this command in the Azure CLI to deploy the container on the host computer as an IoT Edge Module.

```
az iot edge deployment create --deployment-id "<deployment name>" --hub-name "<IoT Hub name>" --content deployment.json --target-condition "deviceId='<IoT Edge device name>'" -–subscription "<subscriptionId>"
```

Fill in the required parameters:
* Deployment name: Choose a name for this deployment
* IoT Hub Name: Your Azure IoT Hub name
* Deployment.json: The name of your deployment file
* IoT Edge device name: The IoT Edge device name of your host computer
* Subscription: Your subscription Id or name

This command will begin the deployment, and you can view the deployment status in your Azure IoT Hub instance in the Azure Portal. The status may show as "417 – The device’s deployment configuration is not set" until the device finishes downloading the container images and starts running.

### Validate that the Deployment was Successful
Locate the *Runtime Status* in the IoT Edge Module Settings for the spatial-analysis module in your IoT Hub instance on the Azure Portal. The **Desired Value** and **Reported Value** for the *Runtime Status* should say `Running`. See below for what this will look like on the Azure Portal.

![Example deployment verification](./media/TutorialDeploymentVerification.png)

At this point, the spatial-analysis container is running the operation, it emits AI insights for the cognitiveservices.vision.spatialanalysis-personcount operation and it routes these insights as telemetry to your Azure IoT Hub instance. To configure additional cameras, you may update the [DeploymentManifest.json](./DeploymentManifest.json) file and execute the deployment again.


# Person Counting Web Application
Person Counting Web Application enables developers to quickly configure a sample web app and host it in their Azure environment and use the app to validate E2E events. <br>
A container form of this app is made available to users for download. 

### Container Image Transfer
The Person Counting Web Application is available in the Project Archon official ACR.<br>

#### Pull the image
```
docker pull rtvsofficial.azurecr.io/acceleratorapp.personcount:1.0
```

<br>(Note: the image url might have changed please check with your team contact.)

#### Push the image to an ACR in your subscription
```
az acr login --name <your ACR name>

docker tag rtvsofficial.azurecr.io/acceleratorapp.personcount:1.0 [desired local image name]

docker push [desired local image name]
```

# Setup Steps
1.  Create a new Azure Web App for Containers 
2.  Fill up All the required fields on the create page with the desired values 
3.  Go to the Docker Tab and select Single Container > Azure Container Registry
![Enter image details](./media/SolutionApp1.png)

4.  Enter the Image details as set in the container image section above. 
5.  Leave the other sections empty, move on to the Review+Create tab and create the app.
<br><br>

# Configuration Steps
1.  Wait for setup to complete and navigate to the resource in the Azure portal 
2.  Go to the configuration section and add these 2 new application settings 
![Configure Parameters](./media/SolutionApp2.png)

3.  EventHubConsumerGroup – This is the string name of the consumer group from your Azure IoT hub, you can create a new consumer group in your IoT hub or use the default group. 
4.  IotHubConnectionString – This is the connection string to your Azure IoT hub, this can be retrieved from the keys section of your Azure IoT hub resource 
5.  Once these 2 settings are added, click __Save__ and proceed to step 6 
6.  Update the Authentication/Authorization with the desired level of auth. Recommended is AAD express settings. 

# Test the deployment
1.  Go to the Azure Web App and see that the deployment is successful and the Web App is running
2.  Navigate to the configured url: <yourapp>.azurewebsites.net to view the running person count pipelines
![Test the deployment](./media/SolutionApp3.png)

## Next steps

* Go back to ![Project Archon documentation](Project-Archon.md)

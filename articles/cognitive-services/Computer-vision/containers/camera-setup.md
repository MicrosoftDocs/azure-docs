---
title: Configure Project Archon containers
titleSuffix: Azure Cognitive Services
description: Project Archon provides each container with a common configuration framework, so that you can easily configure and manage compute, AI insight egress, logging, telemetry, and security settings.
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: vision-service
ms.topic: conceptual
ms.date: 07/23/2020
ms.author: aahi
---

# Companion Tool for Zone and Line configuration

The Companion Tool for Project Archon enables the configuration of AI skills with camera information and zone and line configuration. Before you can use this tool, you need to deploy the Project Archon container to the **host computer** via [Azure IoT Hub](https://docs.microsoft.com/en-us/azure/iot-hub/). The Companion Tool is a Web application built with the purpose of quickly enabling experimentation and Proof-Of-Concept (POC) deployments.

## Container Image Transfer
The Insights Validation App is available in the Project Archon official ACR.<br>

#### Pull the image
docker pull rtvsofficial.azurecr.io/companionapp:1.0
<br>(Note: the image url might have changed please check with your team contact.)


#### Push the image to an ACR in your subscription
az acr login --name <your ACR name>

docker tag rtvsofficial.azurecr.io/companionapp:1.0 [desired local image name]

docker push [desired local image name]

## Deploy the Companion Tool container as a Web App
Go to [Azure Portal](https://portal.azure.com/) and create a resource of type Web App. Select _Image Source_ to be Azure Container Registry and point container image in your local ACR. Don’t enter anything in the Startup Command. <br>

![Azure Web App](./media/AzureWebAppCreation.jpg)

Once the Web App is up and running, you may configure App Logging in case troubleshooting is needed. This step is optional.

![Azure Web App Service Logs](./media/AzureWebApp-Service-logs.png)

You need to configure the Azure IoT Hub connection string. 
Click on the **Configuration** tab and add the two following variables to the **Application settings** tab.
* IOT_HUB_CONNECTION_STRING = <your Azure IoT Hub connection string>
* WEBSITES_PORT = 3002
* APPLICATION_ACCESS_TOKEN = a GUID you generate - this is for added security.

![Azure Web App Application Settings](./media/AzureWebApp-Configuration.png)

Click on the **Configuration** tab and add the two following variables to the **General settings** tab and Web sockets.

![Azure Web App General Setting](./media/AzureWebApp-General-Settings.png)


Click on the **Overview** tab and copy the URL for your web application. When you navigate to the URL, please add the tokenId. For example: WEBSITE.azurewebsites.net/?tokenId=APPLICATION_ACCESS_TOKEN

![Azure Web App Overview](./media/AzureWebApp-Overview.png)

## Use the Companion Tool to configure a skill
Once you have connected the Companion Tool with an Azure IoT Hub connection, the tool will present the IoT Edge devices that have been connected to the Azure IoT Hub. In this screenshot you can see these listed as *Iot Edge*. 

![Companion Tool View of IoT Edge devices](./media/CompanionTool-EdgeDevices.png)

Click on an entry  to view the list of Project Archon containers deployed on each *IoT Edge* device.

![Companion Tool View of IoT Modules](./media/CompanionTool-EdgeModules.png)

You can click on an entry to add/remove/view/configure skills. Click the _Refresh_ button to refresh the skills on the page. 
You can click the _Trash_ icon to delete a skill.

![Companion Tool View of Skills](./media/CompanionTool-Skills.png)

Click the _New_ button to create a new skill for a given camera. You can add multiple skills for the same camera. You can provide an rtsp URL to a live camera or an http URL to a recorded video. You can add multiple skills at a time. Click Save to save the skills.

![Companion Tool View of New Camera](./media/CompanionTool-NewCamera.png)

Once the skill is created, you can click on it to configure lines, zones, and other parameters.

![Companion Tool View of Skill Configuration](./media/CompanionTool-SkillConfig.png)

Click _Load camera view_ to load an image. The _Diagnostic Services_ toggle should be enabled.
NOTE: Enabling _Diagnostic Services_ may affect the performance of the system. Make sure to disable the toggle once you are done with line or zone configuration. 
NOTE: When you receive a 404 – “Not found - IotHub related” error, you need to run this command in the **host computer** to restart Azure IoT Edge.
```
systemctl restart iotedge
```
This page  is specific to a skill. In the image above, the skill is Microsoft.ComputerVision.PersonCrossingLine.<br>
Press the _New_ button to draw a new line. You can draw multiple lines. You can set the AI confidence threshold in the _Threshold_ edit box. Click the _Save_ button to save the lines.
You may import lines from JSON you created using the Offline Line Editor. Press the _Import_ button and click _Save_ to save these. <br>
You can delete a line by clicking the _Trash_ icon. You can also select the line and click the _Delete_ key.<br>
You can click the _Refresh_ button to reload the page.
The _Live View_ can toggle between a live view from camera or a single image. <br>
You can click the _Import_ button to load a JSON representing line configuration. 
Click the _Export Graph_ button to export the skill configuration to JSON format.<br>
You can enable or disable the skill by using the _Graph Enabled_ toggle. <br>
The bottom of the page has the fields for the skill configuration. You can update these and click _Save_ to save the changes on the page. Refer to the [documentation](Project-Archon.md). <br>

![Companion Tool View of Skills Parameters](./media/CompanionTool-Fields.png)

You can draw lines and zones using the Tools on the left hand pane. Use the _Export_ button to export the lines in JSON format. You can import these when you configure a skill. You can also export a image frame by clicking the _Export Image_ Frame button.<br>

![Companion Tool View of Offline Line Editor](./media/CompanionTool-OfflineLineEditor.png)

This shows the Offline Zone Editor with two zones. When you draw a zone, click on the initial vertex to close the zone, or right click on your mouse.

![Companion Tool View of Offline Zone Editor](./media/CompanionTool-OfflineZoneEditor.png)


# Enable Video Recording with the Microsoft.ComputerVision.VideoRecorder skill
The Microsoft.ComputerVision.VideoRecorder was created to enable the recording of the video as it is being processed by the container. The deployment manifest file at [DeploymentManifest.json](./DeploymentManifest.json) has the configuration needed for the Microsoft.ComputerVision.VideoRecorder skill. The video recording is saved in an Azure Blob Storage that you need to configure. 
<br><br>**The video recording is not sent to Microsoft. Remove this skill if you are not interested in recoding the video.** <br> 

You may use a local Azure Blob Storage module to enable the Microsoft.ComputerVision.VideoRecorder skill to save the video and optionally upload video clips to cloud storage. There are a few one-time setup steps required.
* Recorded Video Storage. Deploy the [Azure Blob Storage on IoT Edge](https://docs.microsoft.com/en-us/azure/iot-edge/how-to-deploy-blob).
* The video recording partition may not be mounted automatically. The partition must be mounted before we can use the video recording feature. We recommend using a separate partition for the video recording, to avoid accidentally filling up the main partition. If the main partition is full, the machine may become unstable/unusable.<br>


```
"localblobstorage": {
                        "settings": {
                            "image": "mcr.microsoft.com/azure-blob-storage:latest",
                            "createOptions": "{\"HostConfig\":{\"Binds\":[\"/blobroot:/blobroot\"],\"PortBindings\":{\"11002/tcp\":[{\"HostPort\":\"11002\"}]}}}"
                        },
                        "type": "docker",
                        "env": {
                            "LOCAL_STORAGE_ACCOUNT_NAME": {
                                "value": "<LBS_ACCOUNT_NAME>"
                            },
                            "LOCAL_STORAGE_ACCOUNT_KEY": {
                                "value": "<LBS_ACCOUNT_KEY>"
                            }
                        },
                        "status": "running",
                        "restartPolicy": "always",
                        "version": "1.0"
                    },
"VideoRecorder": {
                        "version": 2,
                        "enabled": false,
                        "skillId": "Microsoft.ComputerVision.VideoRecorder",
                        "parameters": {
                            "DEVICES_PATH_PARAM": "{\"devices\": {\"<camera id>\": {\"url\": \"<camera url>\",\"format\": \"<video extension>\"}}}",
                            "CONNECTION_STRING_PARAM": "DefaultEndpointsProtocol=http;BlobEndpoint=http://localblobstorage:11002/$LBS_ACCOUNT_NAME;AccountName=$LBS_ACCOUNT_NAME;AccountKey=$LBS_ACCOUNT_KEY",
                            "CONTAINER_NAME_PARAM": "recordedvideo",
                            "DURATION_TIME_PARAM": 1200,
                            "SAFE_TIME_PARAM": 60,
                            "OUTPUT_PATH_PARAM" : "outputvideo",
                            "PUBLIC_KEY_PARAM": ""
                        }
                    }
					
```
| Parameter Name | Description|
|---------|---------|
|`DEVICES_PATH_PARAM`| The .json which contains the camera recording info (camera id, camera url, and video extension) |
|`CONNECTION_STRING_PARAM`| The connection string to the blob storage endpoint where the video will be saved |
|`CONTAINER_NAME_PARAM`| The name of the blob storage container where the video will be saved |
|`DURATION_TIME_PARAM`| The duration of each video clip (in seconds) |
|`SAFE_TIME_PARAM`| The time before the current recording ends to start recording the next video clip (in seconds) |
|`OUTPUT_PATH_PARAM`| An identifier for the location where the recorder process temporarily saves video files, and the exporter process monitors. This must be a unique string for each instance of the recorder node deployed in the container. |
|`PUBLIC_KEY_PARAM`| The Blob SAS URL or local path to the public key which the exporter process uses in order to encrypt videos. If this is not provided, videos will not be encrypted |

Use the following Environment Variables:
* LOCAL_STORAGE_ACCOUNT_NAME: Choose a local storage account name.
* LOCAL_STORAGE_ACCOUNT_KEY: Generate a [64-byte base64 key](https://generate.plus/en/base64?gp_base64_base%5Blength%5D=64). Please make sure to re-generate key once after opening this link and do **NOT** select the 'URL safe' option.
 
Paste this in the **Container Create Options**:
```
{
  "HostConfig": {
    "Binds": [
      "/srv/blobroot:/blobroot"
    ],
    "PortBindings": {
      "11002/tcp": [
        {
          "HostPort": "11002"
        }
      ]
    }
  }
}
```
 
The video recording data will be saved in "/srv/blobroot" as specified in the **Container Create Options** above. You need to provide write access to the blob root folder manually. Run these commands on the **host computer** (see [this page](https://docs.microsoft.com/en-us/azure/iot-edge/how-to-store-data-blob#granting-directory-access-to-container-user-on-linux) for further understanding).
```
sudo chown -R 11000:11000 /srv/blobroot 
sudo chmod -R 700 /srv/blobroot
```
Add the following in the Module Twin settings for the Project Archon container in Azure IoT Hub and replace the placeholder values:
```
{
    "deviceAutoDeleteProperties": {
      "deleteOn": <true, false>,
      "deleteAfterMinutes": <delete after minutes>,
      "retainWhileUploading": <true, false>
    },
    "deviceToCloudUploadProperties": {
      "uploadOn": <true, false>,
      "uploadOrder": <"OldestFirst", "NewestFirst">,
      "cloudStorageConnectionString": "<cloud storage connection string>",
      "storageContainersForUpload": {
        "<source container name1>": {
        "target": "<target container name1>"
        }
    },
    "deleteAfterUpload": <true, false>
    }
}
``` 
| Name | Description|
|---------|---------|
|`deleteOn`| This option allows for automatic video deletion after a period of time (automatic clean up). Videos should be (automatically or manually) collected from local blob storage after they are recorded.|
`deleteAfterMinutes`| The videos must be (automatically or manually) collected before this time, or else they will be deleted. | 
`uploadOn` |True if videos should be automatically uploaded to blob storage, False if videos will be manually collected and/or there is no connectivity.|
_cloud storage connection string_ |Replace this with the connection string to the location where videos should be uploaded to (a cloud storage account under your subscription).|
_source container name1_| Replace this with recordedvideo  (or whatever matches the CONTAINER_NAME_PARAM setting in the [DeploymentManifest.json](./DeploymentManifest.json)).|
_target container name1_| Replace this with the target container name.|

## Encryption for video recording

 You need a key-pair for encrypting/decrypting video recording. Use `ssh-keygen` to generate key pairs. Do keep the private key in a secure place and supply the public key to the VideoRecorder skill via skill settings.<br>
1.	Save private_key.pem to a safe and secure location, such as an Azure KeyVault with proper access controls. A person who has access to this key will be able to decrypt and view videos recorded by the Microsoft.ComputerVision.VideoRecorder skill.
2.	Upload public_key.pem to a Blob Storage and take note of the blob's SAS url. This URL needs to be updated as the value for the PUBLIC_KEY_PARAM variable in the deployment manifest.<br>

Recorded video files are saved under /<LBS_BLOB_FOLDER>/BlockBlob/blobcontainer/. These are encrypted using the public key and these must be decrypted using the public key before viewing.<br><br>

To start the video recording manually, you need to edit the Module Twin for the container on your Azure IoT Hub and set the VideoRecorder graph state to "enabled": true. To stop the video recording, set the VideoRecorder graph state to "enabled": false.

To start and stop the VideoRecorder skill on a schedule, you can create an  Azure Function that calls into the your Azure IoT Hub and setting the function to run on a schedule.

## Next steps

* Go back to ![Project Archon documentation](Project-Archon.md)

---
title: Blob storage on Azure IoT Edge devices | Microsoft Docs 
description: Deploy an Azure Blob Storage module to your IoT Edge device to store data at the edge.  
author: kgremban
manager: timlt
ms.author: kgremban
ms.date: 09/20/2018
ms.topic: conceptual
ms.service: iot-edge
services: iot-edge
---

# Store data at the edge with Azure Blob Storage (preview)

Azure Blog Storage works with Azure IoT Edge to provide an unstructured data storage solution at the edge. 

This article provides instructions for deploying an Azure Blob Storage container that runs a blob service on your IoT Edge device. 

>[!NOTE]
>Azure Blob Storage modules for IoT Edge are in [public preview](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Prerequisites

An Azure IoT Edge device:

* You can use your development machine or a virtual machine as an Edge device by following the steps in the quickstart for [Linux](quickstart-linux.md) or [Windows devices](quickstart.md).
* The Azure Blob Storage module supports the following device configurations:

   | Operating system | Architecture |
   | ---------------- | ------------ |
   | Ubuntu Server 16.04 | AMD64 |
   | Ubuntu Server 18.04 | AMD64 |
   | Windows 10 IoT Enterprise (October update) | AMD64 |
   | Windows Server 2019 | AMD64 |
   | Rasbian Stretch | ARM32 |

Cloud resources:

* A standard-tier [IoT Hub](../iot-hub/iot-hub-create-through-portal.md) in Azure. 


## Deploy blob storage to your device

Azure Blob Storage provides two standard container images, one for Linux containers and one for Windows containers. When you use one of these module images to deploy blob storage to your IoT Edge device, you configure the module instance with an account name and account key that other modules or applications can use to access the storage, just like the account name and account key that you use to access blob storage in the cloud. 

There are several ways to deploy modules to an IoT Edge device, and all of them work with blob storage modules. The two simplest methods are to use the Azure portal or Visual Studio Code templates. 

### Azure portal

To deploy blob storage through the Azure portal, follow the steps in [Deploy Azure IoT Edge modules from the Azure portal](how-to-deploy-modules-portal.md). 

Use the following steps to configure the deployment manifest:

1. In the **Registry settings** section of the page, you don't need to provide any credentials to access the blob storage images. 

2. In the **Deployment modules** section of the page, select **Add** then choose **IoT Edge Module**. 

3. Specify the settings for your blob storage module. 

   * **Name** - Enter a recognizable name for your module, like **AzureBlobStorage**.
   * **Image URI** - If your IoT Edge device uses Linux containers, enter **mcr.microsoft.com/azure-blob-storage:linux**. If your IoT Edge device uses Windows containers, enter **mcr.microsoft.com/azure-blob-storage:nanoserver-1809**. 
   * **Container Create Options** - Copy and paste the following JSON. Update `\<your storage account name\>` with any name. Update `\<your storage account key\>` with a 64-byte base64 key. You can generate a key with tools like [GeneratePlus](https://generate.plus/en/base64) which allows you to select your byte length. You'll use these credentials to access the blob storage from other modules.

      ```json
      {
          "Env":[
              "LOCAL_STORAGE_ACCOUNT_NAME=<your storage account name>",
              "LOCAL_STORAGE_ACCOUNT_KEY=<your storage account key>"
          ],
          "HostConfig":[
              "Binds":[
                  "/tmp/blobroot:/blobroot"
              ],
              "PortBindings":{
                  "11002/tcp":[{"HostPort":"11002"}]
              }
          ]
      }
      ```

Continue following the steps in the deployment guide to deploy your blob storage module. 

### Visual Studio Code templates

Azure IoT Edge provides templates in Visual Studio Code to help you develop edge solutions. These steps require that you have [Visual Studio Code](https://code.visualstudio.com/) installed on your development machine, and configured with the [Azure IoT Edge extension](https://marketplace.visualstudio.com/items?itemName=vsciot-vscode.azure-iot-edge).

Use the following steps to create a new IoT Edge solution with a blob storage module, and configure the deployment manifest. 

1. In Visual Studio Code, select **View** > **Integrated Terminal**.

2. Select **View** > **Command Palette**. 

3. In the command palette, enter and run the command **Azure IoT Edge: New IoT Edge Solution**. 

4. Follow the prompts to create a new solution: 

   1. **Select Folder** - Browse to the folder where you want to create the new solution.  
   2. **Provide a solution name** - Enter a name for your solution, or accept the default.
   3. **Select module template** - Choose **Existing Module (Enter full image URL)**.
   4. **Provide a module name** - Enter a recognizable name for your module, like **AzureBlobStorage**.
   5. **Provide Docker image for the module** - If your IoT Edge device uses Linux containers, enter **mcr.microsoft.com/azure-blob-storage:linux**. If your IoT Edge device uses Windows containers, enter **mcr.microsoft.com/azure-blob-storage:nanoserver-1809**. 

VS Code takes the information you provided, creates an IoT Edge solution, and then loads it in a new window. 

The solution template creates a deployment manifest template that includes your blob storage module image, but you need to configure the module's create options. 

1. Open **deployment.template.json** in your new solution workspace and find the **modules** section. 

2. Delete the **tempSensor** module, as it's not necessary for this deployment. 

3. Copy and paste the following code into the **createOptions** field of your blob storage module: 

   ```json
   {\"Env\": [\"LOCAL_STORAGE_ACCOUNT_NAME=$STORAGE_ACCOUNT_NAME\",\" LOCAL_STORAGE_ACCOUNT_KEY=$STORAGE_ACCOUNT_KEY\"],\"HostConfig\": {\"Binds\": [\"/tmp/blobroot:/blobroot\"],\"PortBindings\": {\"11002/tcp\": [{\"HostPort\":\"11002\"}]}}}
   ```

   ![Update module create options](./media/how-to-store-data-blob/create-options.png)

4. Save **deployment.template.json**.

5. Open **.env** in your solution workspace. 

6. You don't have to enter any container registry values for the blob storage image since it's publicly available. 

7. Add two new environment variables: 

   ```env
   STORAGE_ACCOUNT_NAME=
   STORAGE_ACCOUNT_KEY=
   ```

8. Provide any name for the storage account name, and provide a 64-byte base64 key for the storage account key. You can generate a key with tools like [GeneratePlus](https://generate.plus/en/base64) which allows you to select your byte length. You'll use these credentials to access the blob storage from other modules. 

9. Save **.env**. 

10. Right-click **deployment.template.json** and select **Generate IoT Edge deployment manifest**. 

Visual Studio Code takes the information that you provided in deployment.template.json and .env and uses it to create a new deployment manifest file. The deployment manifest is created in a new **config** folder in your solution workspace. Once you have that file, you can follow the steps in [Deploy Azure IoT Edge modules from Visual Studio Code](how-to-deploy-modules-vscode.md) or [Deploy Azure IoT Edge modules with Azure CLI 2.0](how-to-deploy-modules-cli.md).

## Connect to your blob storage module




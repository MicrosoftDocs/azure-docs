---
title: Use an Azure Files based volume in a Service Fabric Mesh application | Microsoft Docs
description: Learn how to store state in an Azure Service Fabric Mesh application by mounting an Azure Files based volume inside a service using the Azure CLI.
services: service-fabric-mesh
documentationcenter: .net
author: rwike77
manager: jeconnoc
editor: ''
ms.assetid: 
ms.service: service-fabric-mesh
ms.devlang: azure-cli
ms.topic: conceptual
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 10/31/2018
ms.author: ryanwi
ms.custom: mvc, devcenter 
---

# Mount an Azure Files based volume in a Service Fabric Mesh application 

This article describes how to mount an Azure Files based volume in a service of a Service Fabric Mesh application.  The Azure Files volume driver is a Docker volume driver used to mount an Azure Files share to a container which you use to persist service state. Volumes give you general-purpose file storage and allow you to read/write files using normal disk I/O file APIs.  To learn more about volumes and options for storing application data, read [storing state](service-fabric-mesh-storing-state.md).

To mount a volume in a service, create a volume resource in your Service Fabric Mesh application and then reference that volume in your service.  Declaring the volume resource and referencing it in the service resource can be done either in the [YAML-based resource files]() or the [JSON-based deployment template](). Before mounting the volume, first create an Azure storage account and a [file share in Azure Files](/azure/storage/files/storage-how-to-create-file-share).

## Prerequisites

You can use the Azure Cloud Shell or a local installation of the Azure CLI to complete this task. To use the Azure CLI with this article, ensure that `az --version` returns at least `azure-cli (2.0.43)`.  Install (or update) the Azure Service Fabric Mesh CLI extension module by following these [instructions](service-fabric-mesh-howto-setup-cli.md).

## Sign in to Azure

Sign in to Azure and set your subscription.

```azurecli
az login
az account set --subscription "<subscriptionID>"
```

## Create a storage account (optional)
You can use an existing Azure storage account, or create a new storage account.

```azurecli
az group create \
    --name storage-quickstart-resource-group \
    --location westus

az storage account create \
--name storagequickstart \
--resource-group storage-quickstart-resource-group \
--location westus \
--sku Standard_LRS \
--kind StorageV2
```

## Create a storage account and file share

Create an Azure file share by following these [instructions](/azure/storage/files/storage-how-to-create-file-share). 

```azurecli
current_env_conn_string=$(az storage account show-connection-string -n <storage-account> -g <resource-group> --query 'connectionString' -o tsv)

 if [[ $current_env_conn_string == "" ]]; then  
     echo "Couldn't retrieve the connection string."
 fi

 az storage share create --name files --quota 2048 --connection-string $current_env_conn_string 1 > /dev/null
 ```

The storage account name, storage account key and the file share name are referenced as `<storageAccountName>`, `<storageAccountKey>`, and `<fileShareName>` in the following instructions. These values are available in the [Azure portal](https://portal.azure.com):
* <storageAccountName> - Under **Storage Accounts**, it is the name of the storage account you used when you created the file share.
* <storageAccountKey> - Select your storage account under **Storage Accounts** and then select **Access keys** and use the value under **key1**.
* <fileShareName> - Select your storage account under  **Storage Accounts** and then select **Files**. The name to use is the name of the file share you just created.



## Declare a volume resource and update the service resource (YAML)

Add a *volume.yaml* file in the *App resources* directory.
```yaml
volume:
  schemaVersion: 1.0.0-preview2
  name: testVolume
  properties:
    description: Azure Files storage volume for counter App.
    provider: SFAzureFile
    azureFileParameters: 
        shareName: <fileShareName>
        accountName: <storageAccountName>
        accountKey: <storageAccountKey>
```

Update the *service.yaml* file in the *Service Resources* directory.
```yaml
## Service definition ##
application:
  schemaVersion: 1.0.0-preview2
  name: VolumeTest
  properties:
    services:
      - name: VolumeTestService
        properties:
          description: VolumeTestService description.
          osType: Windows
          codePackages:
            - name: VolumeTestService
              image: volumetestservice:dev
              volumeRefs:
                - name: "[resourceId('Microsoft.ServiceFabricMesh/volumes', 'testVolume')]"
                  destinationPath: C:\app\data
              endpoints:
                - name: VolumeTestServiceListener
                  port: 20003
              environmentVariables:
                - name: ASPNETCORE_URLS
                  value: http://+:20003
                - name: STATE_FOLDER_NAME
                  value: "[parameters('stateFolderName')]"
#                - name: ApplicationInsights:InstrumentationKey
#                  value: "<Place AppInsights key here, or reference it via a secret>"
              resources:
                requests:
                  cpu: 0.5
                  memoryInGB: 1
          replicaCount: 1
          networkRefs:
            - name: VolumeTestNetwork
```

## Declare a volume resource and update the service resource (JSON)

First create a volume resource
```json
{
  "$schema": "http://schema.management.azure.com/schemas/2014-04-01-preview/deploymentTemplate.json",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "location": {
      "defaultValue": "EastUS",
      "type": "String",
      "metadata": {
        "description": "Location of the resources."
      }
    },
    "fileShareName": {
      "type": "string",
      "metadata": {
        "description": "Name of the Azure Files file share that provides the volume for the container."
      }
    },
    "storageAccountName": {
      "type": "string",
      "metadata": {
        "description": "Name of the Azure storage account that contains the file share."
      }
    },
    "storageAccountKey": {
      "type": "securestring",
      "metadata": {
        "description": "Access key for the Azure storage account that contains the file share."
      }
    },
    "stateFolderName": {
      "type": "string",
      "defaultValue": "TestVolumeData",
      "metadata": {
        "description": "Folder in which to store the state. Provide a empty value to create a unique folder for each container to store the state. A non-empty value will retain the state across deployments, however if more than one applications are using the same folder, the counter may update more frequently."
      }
    }
  },
  "resources": [
    {
      "apiVersion": "2018-09-01-preview",
      "name": "VolumeTest",
      "type": "Microsoft.ServiceFabricMesh/applications",
      "location": "[parameters('location')]",
      "dependsOn": [
        "Microsoft.ServiceFabricMesh/networks/VolumeTestNetwork",
        "Microsoft.ServiceFabricMesh/volumes/testVolume"
      ],
      "properties": {
        "services": [
          {
            "name": "VolumeTestService",
            "properties": {
              "description": "VolumeTestService description.",
              "osType": "Windows",
              "codePackages": [
                {
                  "name": "VolumeTestService",
                  "image": "volumetestservice:dev",
                  "volumeRefs": [
                    {
                      "name": "[resourceId('Microsoft.ServiceFabricMesh/volumes', 'testVolume')]",
                      "destinationPath": "C:\\app\\data"
                    }
                  ],
                  "environmentVariables": [
                    {
                      "name": "ASPNETCORE_URLS",
                      "value": "http://+:20003"
                    },
                    {
                      "name": "STATE_FOLDER_NAME",
                      "value": "[parameters('stateFolderName')]"
                    }
                  ],
                  ...
                }
              ],
              ...
            }
          }
        ],
        "description": "VolumeTest description."
      }
    },
    {
      "apiVersion": "2018-09-01-preview",
      "name": "testVolume",
      "type": "Microsoft.ServiceFabricMesh/volumes",
      "location": "[parameters('location')]",
      "dependsOn": [],
      "properties": {
        "description": "Azure Files storage volume for the test application.",
        "provider": "SFAzureFile",
        "azureFileParameters": {
          "shareName": "[parameters('fileShareName')]",
          "accountName": "[parameters('storageAccountName')]",
          "accountKey": "[parameters('storageAccountKey')]"
        }
      }
    }
    ...
  ]
}
```

## Next steps

- View the Azure Files volume sample application on [GitHub](https://github.com/Azure-Samples/service-fabric-mesh/tree/master/src/counter).
- To learn more about Service Fabric Resource Model, see [Service Fabric Mesh Resource Model](service-fabric-mesh-service-fabric-resources.md).
- To learn more about Service Fabric Mesh, read the [Service Fabric Mesh overview](service-fabric-mesh-overview.md).
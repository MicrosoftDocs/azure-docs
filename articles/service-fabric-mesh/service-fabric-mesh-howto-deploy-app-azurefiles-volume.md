---
title: Use an Azure Files based volume in a Service Fabric Mesh app 
description: Learn how to store state in an Azure Service Fabric Mesh application by mounting an Azure Files based volume inside a service using the Azure CLI.
author: dkkapur
ms.topic: conceptual
ms.date: 11/21/2018
ms.author: dekapur
ms.custom: mvc, devcenter 
---

# Mount an Azure Files based volume in a Service Fabric Mesh application 

This article describes how to mount an Azure Files based volume in a service of a Service Fabric Mesh application.  The Azure Files volume driver is a Docker volume driver used to mount an Azure Files share to a container, which you use to persist service state. Volumes give you general-purpose file storage and allow you to read/write files using normal disk I/O file APIs.  To learn more about volumes and options for storing application data, read [storing state](service-fabric-mesh-storing-state.md).

To mount a volume in a service, create a volume resource in your Service Fabric Mesh application and then reference that volume in your service.  Declaring the volume resource and referencing it in the service resource can be done either in the [YAML-based resource files](#declare-a-volume-resource-and-update-the-service-resource-yaml) or the [JSON-based deployment template](#declare-a-volume-resource-and-update-the-service-resource-json). Before mounting the volume, first create an Azure storage account and a [file share in Azure Files](/azure/storage/files/storage-how-to-create-file-share).

## Prerequisites
> [!NOTE]
> **Known Issue with deployment on Windows RS5 development machine:** There is open bug with Powershell cmdlet New-SmbGlobalMapping on RS5 Windows machines that prevents mounting of Azurefile Volumes. Below is sample error that is encountered when  AzureFile based volume is being mounted on local development machine.
```
Error event: SourceId='System.Hosting', Property='CodePackageActivation:counterService:EntryPoint:131884291000691067'.
There was an error during CodePackage activation.System.Fabric.FabricException (-2147017731)
Failed to start Container. ContainerName=sf-2-63fc668f-362d-4220-873d-85abaaacc83e_6d6879cf-dd43-4092-887d-17d23ed9cc78, ApplicationId=SingleInstance_0_App2, ApplicationName=fabric:/counterApp. DockerRequest returned StatusCode=InternalServerError with ResponseBody={"message":"error while mounting volume '': mount failed"}
```
The workaround for the issue is to 
1)Run below command as Powershell administrator and 2)Reboot the machine.
```powershell
PS C:\WINDOWS\system32> Mofcomp c:\windows\system32\wbem\smbwmiv2.mof
```

You can use the Azure Cloud Shell or a local installation of the Azure CLI to complete this article. 

To use the Azure CLI locally with this article, ensure that `az --version` returns at least `azure-cli (2.0.43)`.  Install (or update) the Azure Service Fabric Mesh CLI extension module by following these [instructions](service-fabric-mesh-howto-setup-cli.md).

To sign in to Azure and set your subscription:

```azurecli
az login
az account set --subscription "<subscriptionID>"
```

## Create a storage account and file share (optional)
Mounting an Azure Files volume requires a storage account and file share.  You can use an existing Azure storage account and file share, or create resources:

```azurecli-interactive
az group create --name myResourceGroup --location eastus

az storage account create --name myStorageAccount --resource-group myResourceGroup --location eastus --sku Standard_LRS --kind StorageV2

$current_env_conn_string=$(az storage account show-connection-string -n myStorageAccount -g myResourceGroup --query 'connectionString' -o tsv)

az storage share create --name myshare --quota 2048 --connection-string $current_env_conn_string
```

## Get the storage account name and key and the file share name
The storage account name, storage account key, and the file share name are referenced as `<storageAccountName>`, `<storageAccountKey>`, and `<fileShareName>` in the following sections. 

List your storage accounts and get the name of the storage account with the file share you want to use:
```azurecli-interactive
az storage account list
```

Get the name of the file share:
```azurecli-interactive
az storage share list --account-name <storageAccountName>
```

Get the storage account key ("key1"):
```azurecli-interactive
az storage account keys list --account-name <storageAccountName> --query "[?keyName=='key1'].value"
```

You can also find these values in the [Azure portal](https://portal.azure.com):
* `<storageAccountName>` - Under **Storage Accounts**, the name of the storage account used to create the file share.
* `<storageAccountKey>` - Select your storage account under **Storage Accounts** and then select **Access keys** and use the value under **key1**.
* `<fileShareName>` - Select your storage account under  **Storage Accounts** and then select **Files**. The name to use is the name of the file share you created.

## Declare a volume resource and update the service resource (JSON)

Add parameters for the `<fileShareName>`, `<storageAccountName>`, and `<storageAccountKey>` values you found in a previous step. 

Create a Volume resource as a peer of the Application resource. Specify a name and the provider ("SFAzureFile" to use the Azure Files based volume). In `azureFileParameters`, specify the parameters for the `<fileShareName>`, `<storageAccountName>`, and `<storageAccountKey>` values you found in a previous step.

To mount the volume in your service, add a `volumeRefs` to the `codePackages` element of the service.  `name` is the resource ID for the volume (or a deployment template parameter for the volume resource) and the name of the volume declared in the volume.yaml resource file.  `destinationPath` is the local directory that the volume will be mounted to.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2014-04-01-preview/deploymentTemplate.json",
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
        "description": "Folder in which to store the state. Provide an empty value to create a unique folder for each container to store the state. A non-empty value will retain the state across deployments, however if more than one applications are using the same folder, the counter may update more frequently."
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

## Declare a volume resource and update the service resource (YAML)

Add a new *volume.yaml* file in the *App resources* directory for your application.  Specify a name and the provider ("SFAzureFile" to use the Azure Files based volume). `<fileShareName>`, `<storageAccountName>`, and `<storageAccountKey>` are the values you found in a previous step.

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

Update the *service.yaml* file in the *Service Resources* directory to mount the volume in your service.  Add the `volumeRefs` element to the `codePackages` element.  `name` is the resource ID for the volume (or a deployment template parameter for the volume resource) and the name of the volume declared in the volume.yaml resource file.  `destinationPath` is the local directory that the volume will be mounted to.

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
                  value: TestVolumeData
              resources:
                requests:
                  cpu: 0.5
                  memoryInGB: 1
          replicaCount: 1
          networkRefs:
            - name: VolumeTestNetwork
```

## Next steps

- View the Azure Files volume sample application on [GitHub](https://github.com/Azure-Samples/service-fabric-mesh/tree/master/src/counter).
- To learn more about Service Fabric Resource Model, see [Service Fabric Mesh Resource Model](service-fabric-mesh-service-fabric-resources.md).
- To learn more about Service Fabric Mesh, read the [Service Fabric Mesh overview](service-fabric-mesh-overview.md).

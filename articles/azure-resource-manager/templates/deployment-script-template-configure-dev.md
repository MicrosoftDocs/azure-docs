---
title: Configure development environment for deployment scripts in templates | Microsoft Docs
description: configure development environment for deployment scripts in Azure Resource Manager templates.
services: azure-resource-manager
author: mumian
ms.service: azure-resource-manager
ms.topic: conceptual
ms.date: 07/27/2020
ms.author: jgao

---
# Configure development environment for deployment scripts in templates (Preview)

Learn how to create a development environment for developing and testing deployment scripts with a deployment script image. You can either create [Azure container instance](../../container-instances/container-instances-overview.md) or use [Docker](https://docs.docker.com/get-docker/). Both are covered in this article.

## Prerequisites

If you don't have a deployment script, you can create a **hello.ps1** file with the following content:

```powershell
param([string] $name)
$output = 'Hello {0}' -f $name
Write-Output $output
$DeploymentScriptOutputs = @{}
$DeploymentScriptOutputs['text'] = $output
```

## Use Azure container instance

To author your scripts on your computer, you need to create a storage account and mount the storage account to the container instance. So that you can upload your script to the storage account and run the script on the container instance.

> [!NOTE]
> The storage account that you create to test your script is not the same storage account that the deployment script service uses to execute the script. Deployment script service creates a unique name as a file share on every execution.

### Create an Azure container instance

The following ARM template creates a container instance and a file share, and then mounts the file share to the container image.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "projectName": {
      "type": "string",
      "metadata": {
        "description": "Specify a project name that is used for generating resource names."
      }
    },
    "containerImage": {
      "type": "string",
      "defaultValue": "mcr.microsoft.com/azuredeploymentscripts-powershell:az4.3",
      "metadata": {
        "description": "Specify the container image."
      }
    },
    "mountPath": {
      "type": "string",
      "defaultValue": "deploymentScript",
      "metadata": {
        "description": "Specify the mount path."
      }
    }
  },
  "variables": {
    "storageAccountName": "[concat(parameters('projectName'), 'store')]",
    "fileShareName": "[concat(parameters('projectName'), 'share')]",
    "containerGroupName": "[concat(parameters('projectName'), 'cg')]",
    "containerName": "[concat(parameters('projectName'), 'container')]"
  },
  "resources": [
    {
      "type": "Microsoft.Storage/storageAccounts",
      "apiVersion": "2019-06-01",
      "name": "[variables('storageAccountName')]",
      "location": "[resourceGroup().location]",
      "sku": {
        "name": "Standard_LRS",
        "tier": "Standard"
      },
      "kind": "StorageV2",
      "properties": {
        "accessTier": "Hot"
      }
    },
    {
      "type": "Microsoft.Storage/storageAccounts/fileServices/shares",
      "apiVersion": "2019-06-01",
      "name": "[concat(variables('storageAccountName'), '/default/', variables('fileShareName'))]",
      "dependsOn": [
        "[resourceId('Microsoft.Storage/storageAccounts', variables('storageAccountName'))]"
      ]
    },
    {
      "type": "Microsoft.ContainerInstance/containerGroups",
      "apiVersion": "2019-12-01",
      "name": "[variables('containerGroupName')]",
      "location": "[resourceGroup().location]",
      "dependsOn": [
        "[resourceId('Microsoft.Storage/storageAccounts', variables('storageAccountName'))]"
      ],
      "properties": {
        "containers": [
          {
            "name": "[variables('containerName')]",
            "properties": {
              "image": "[parameters('containerImage')]",
              "resources": {
                "requests": {
                  "cpu": 1,
                  "memoryInGb": 1.5
                }
              },
              "ports": [
                {
                  "protocol": "TCP",
                  "port": 80
                }
              ],
              "volumeMounts": [
                {
                  "name": "filesharevolume",
                  "mountPath": "[parameters('mountPath')]"
                }
              ],
              "command": [
                "/bin/sh",
                "-c",
                "pwsh -c 'Start-Sleep -Seconds 1800'"
              ]
            }
          }
        ],
        "osType": "Linux",
        "volumes": [
          {
            "name": "filesharevolume",
            "azureFile": {
              "readOnly": false,
              "shareName": "[variables('fileShareName')]",
              "storageAccountName": "[variables('storageAccountName')]",
              "storageAccountKey": "[listKeys(resourceId('Microsoft.Storage/storageAccounts', variables('storageAccountName')), '2019-06-01').keys[0].value]"
            }
          }
        ]
      }
    }
  ]
}
```
The default value for the mount path is **deploymentScript**.  This is the path in the container instance where it is mounted to the file share.

The default container image specified in the template is **mcr.microsoft.com/azuredeploymentscripts-powershell:az4.3"**.  For a list of supported Azure PowerShell versions and Azure CLI versions, see [Azure PowerShell or Azure CLI](./deployment-script-template.md#prerequisites).

The template suspends the container instance 1800 seconds. You have 30 minutes before the container instance goes into terminal state and the session ends.

To deploy the template:

```azurepowershell
$projectName = Read-Host -Prompt "Enter a project name that is used to generate resource names"
$location = Read-Host -Prompt "Enter the location (i.e. centralus)"
$templateFile = Read-Host -Prompt "Enter the template file path and file name"
$resourceGroupName = "${projectName}rg"

New-azResourceGroup -Location $location -name $resourceGroupName
New-AzResourceGroupDeployment -resourceGroupName $resourceGroupName -TemplateFile $templatefile -projectName $projectName
```

### Upload deployment script

Upload your deployment script to the storage account. The following is a PowerShell example:

```azurepowershell
$projectName = Read-Host -Prompt "Enter the same project name that you used earlier"
$fileName = Read-Host -Prompt "Enter the deployment script file name with the path"

$resourceGroupName = "${projectName}rg"
$storageAccountName = "${projectName}store"
$fileShareName = "${projectName}share"

$context = (Get-AzStorageAccount -ResourceGroupName $resourceGroupName -Name $storageAccountName).Context
Set-AzStorageFileContent -Context $context -ShareName $fileShareName -Source $fileName -Force
```

You can also upload the file by using the Azure portal and Azure CLI.

### Test the deployment script

1. From the Azure portal, open the resource group where you deployed the container instance and the storage account.
1. Open the container group. The default container group name is the project name with **cg** appended. You shall see the container instance is in the **Running** state.
1. Select **Containers** from the left menu. You shall see a container instance.  The container instance name is the project name with **container** appended.

    ![deployment script connect container instance](./media/deployment-script-template-configure-dev/deployment-script-container-instance-connect.png)

1. Select **Connect**, and then select **Connect**. If  you can't connect to the container instance, restart the container group and try again.
1. In the console pane, run the following commands:

    ```
    cd deploymentScript
    ls
    pwsh ./hello.ps1 "John Dole"
    ```

    The output is **Hello John Dole**.

    ![deployment script container instance test](./media/deployment-script-template-configure-dev/deployment-script-container-instance-test.png)

## Use Docker

You can use a pre-configured docker container image as your deployment script development environment. To install Docker, see [Get Docker](https://docs.docker.com/get-docker/).
You also need to configure file sharing to mount the directory, which contains the deployment scripts into Docker container.

1. Pull the deployment script container image to the local computer:

    ```command
    docker pull mcr.microsoft.com/azuredeploymentscripts-powershell:az4.3
    ```

    The example uses version PowerShell 4.3.0.

    To pull a CLI image from a Microsoft Container Registry (MCR):

    ```command
    docker pull mcr.microsoft.com/azure-cli:2.0.80
    ```

    This example uses version CLI 2.0.80. Deployment script uses the default CLI containers images found [here](https://hub.docker.com/_/microsoft-azure-cli).

1. Run the docker image locally.

    ```command
    docker run -v <host drive letter>:/<host directory name>:/data -it mcr.microsoft.com/azuredeploymentscripts-powershell:az4.3
    ```

    Replace **&lt;host driver letter>** and **&lt;host directory name>** with an existing folder on the shared drive.  It maps the folder to the **/data** folder in the container. For examples, to map D:\docker:

    ```command
    docker run -v d:/docker:/data -it mcr.microsoft.com/azuredeploymentscripts-powershell:az4.3
    ```

    **-it** means keeping the container image alive.

    A CLI example:

    ```command
    docker run -v d:/docker:/data -it mcr.microsoft.com/azure-cli:2.0.80
    ```

1. The following screenshot shows how to run a PowerShell script, given that you have a helloworld.ps1 file in the shared drive.

    ![Resource Manager template deployment script docker cmd](./media/deployment-script-template/resource-manager-deployment-script-docker-cmd.png)

After the script is tested successfully, you can use it as a deployment script in your templates.

## Next steps

In this article, you learned how to use deployment scripts. To walk through a deployment script tutorial:

> [!div class="nextstepaction"]
> [Tutorial: Use deployment scripts in Azure Resource Manager templates](./template-tutorial-deployment-script.md)

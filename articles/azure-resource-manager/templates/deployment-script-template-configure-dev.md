---
title: Configure development environment for deployment scripts in templates | Microsoft Docs
description: configure development environment for deployment scripts in Azure Resource Manager templates.
services: azure-resource-manager
author: mumian
ms.service: azure-resource-manager
ms.topic: conceptual
ms.date: 07/16/2020
ms.author: jgao

---
# Use deployment scripts in templates (Preview)

Learn how to create a development environment for developing deployment scripts with an deployment script image.  You can either create an Azure container instance or use docker. See a list of [supported Azure PowerShell versions](https://mcr.microsoft.com/v2/azuredeploymentscripts-powershell/tags/list). See a list of [supported Azure CLI versions](https://mcr.microsoft.com/v2/azure-cli/tags/list).

## Use Azure container instance

### Create an Azure container instance

An ARM template has been created to simplify the configuration process. The ARM template creates a container instance and a file share, and then mounts the file share to the container image.

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
      "defaultValue": "mcr.microsoft.com/azuredeploymentscripts-powershell:az2.7",
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
                "pwsh -c 'Start-Sleep 2000'"
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

To deploy the template:

```azurepowershell
$projectName = Read-Host -Prompt "Enter a project name that is used to generate resource group name"
$location = Read-Host -Prompt "Enter the location (i.e. centralus)"
$templateFile = Read-Host -Prompt "Enter the template file path and file name"
$resourceGroupName = "${projectName}rg"

New-azResourceGroup -Location $location -name $resourceGroupName
New-AzResourceGroupDeployment -resourceGroupName $resourceGroupName -TemplateFile $templatefile -projectName $projectName
```

### Upload deployment script

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Open the resource group where you deployed the container instance and the storage account.
1. Open the storage account. The default storage account name is the project name with **store** appended.
1. Select **File shares**.
1. Select your file share.  The default file share name is the project name with **share** appended.
1. Select **Upload** and then follow the instruction to upload your deployment script file. For the testing purpose, you can create a **ps1** file with the following content:

    ```powershell
    param([string] $name)
    $output = 'Hello {0}' -f $name
    Write-Output $output
    $DeploymentScriptOutputs = @{}
    $DeploymentScriptOutputs['text'] = $output
    ```

### Test the deployment script

1. From the Azure portal, open the resource group where you deployed the container instance and the storage account.
1. Open the container group. The default container group name is the project name with **cg** appended. You shall see the container instance is in the started state.
1. Select **Containers** from the left menu. You shall see a container instance.  The container instance name is the project name with **container** appended.
1. Select **Connect**, and then select **Connect**. If  you can't connect to the container instance, restart the container group and try again.
1. Run the **ls** commmand to list the files.  You shall see a **deploymentScript** folder if you use the default mount path value when you deploy the template.
1. Run **cd deploymentScript**. The commands are case-sensitive.
1. Run **ls** to list the file.  You shall see the deployment script files that you have uploaded.
1. Execute the deployment script file.  For example, for PowerShell script:

    ```cmd
    pwsh ./myds.ps1 "John Dole"
    ```

    The output shall be **Hello John Dole**.


## Use Docker

You can use a pre-configured docker container image as your deployment script development environment. To install Docker, see [Get Docker](https://docs.docker.com/get-docker/).
You also need to configure file sharing to mount the directory which contains the deployment scripts into Docker container.

1. Pull the deployment script container image to the local computer:

    ```command
    docker pull mcr.microsoft.com/azuredeploymentscripts-powershell:az2.7
    ```

    The example uses version PowerShell 2.7.0.

    To pull a CLI image from a Microsoft Container Registry (MCR):

    ```command
    docker pull mcr.microsoft.com/azure-cli:2.0.80
    ```

    This example uses version CLI 2.0.80. Deployment script uses the default CLI containers images found [here](https://hub.docker.com/_/microsoft-azure-cli).

1. Run the docker image locally.

    ```command
    docker run -v <host drive letter>:/<host directory name>:/data -it mcr.microsoft.com/azuredeploymentscripts-powershell:az2.7
    ```

    Replace **&lt;host driver letter>** and **&lt;host directory name>** with an existing folder on the shared drive.  It maps the folder to the **/data** folder in the container. For examples, to map D:\docker:

    ```command
    docker run -v d:/docker:/data -it mcr.microsoft.com/azuredeploymentscripts-powershell:az2.7
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

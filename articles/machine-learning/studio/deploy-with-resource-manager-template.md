---
title: Deploy a Machine Learning workspace with Azure Resource Manager | Microsoft Docs
description: How to deploy a workspace for Azure Machine Learning using Azure Resource Manager template
services: machine-learning
documentationcenter: ''
author: ahgyger
manager: haining
editor: garye

ms.assetid: 4955ac4d-ff99-4908-aa27-69b6bfcc8e85
ms.service: machine-learning
ms.workload: data-services
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 3/15/2017
ms.author: ahgyger

---
# Deploy Machine Learning Workspace Using Azure Resource Manager
## Introduction
Using an Azure Resource Manager deployment template saves you time by giving you a scalable way to deploy interconnected components with a validation and retry mechanism. To set up Azure Machine Learning Workspaces, for example, you need to first configure an Azure storage account and then deploy your workspace. Imagine doing this manually for hundreds of workspaces. An easier alternative is to use an Azure Resource Manager template to deploy an Azure Machine Learning Workspace and all its dependencies. This article takes you through this process step-by-step. For a great overview of Azure Resource Manager, see [Azure Resource Manager overview](../azure-resource-manager/resource-group-overview.md).

## Step-by-step: create a Machine Learning Workspace
We will create an Azure resource group, then deploy a new Azure storage account and a new Azure Machine Learning Workspace using a Resource Manager template. Once the deployment is complete, we will print out important information about the workspaces that were created (the primary key, the workspaceID, and the URL to the workspace).

### Create an Azure Resource Manager template
A Machine Learning Workspace requires an Azure storage account to store the dataset linked to it.
The following template uses the name of the resource group to generate the storage account name and the workspace name.  It also uses the storage account name as a property when creating the workspace.

```
{
    "contentVersion": "1.0.0.0",
    "$schema": "http://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
    "variables": {
        "namePrefix": "[resourceGroup().name]",
        "location": "[resourceGroup().location]",
        "mlVersion": "2016-04-01",
        "stgVersion": "2015-06-15",
        "storageAccountName": "[concat(variables('namePrefix'),'stg')]",
        "mlWorkspaceName": "[concat(variables('namePrefix'),'mlwk')]",
        "mlResourceId": "[resourceId('Microsoft.MachineLearning/workspaces', variables('mlWorkspaceName'))]",
        "stgResourceId": "[resourceId('Microsoft.Storage/storageAccounts', variables('storageAccountName'))]",
        "storageAccountType": "Standard_LRS"
    },
    "resources": [
        {
            "apiVersion": "[variables('stgVersion')]",
            "name": "[variables('storageAccountName')]",
            "type": "Microsoft.Storage/storageAccounts",
            "location": "[variables('location')]",
            "properties": {
                "accountType": "[variables('storageAccountType')]"
            }
        },
        {
            "apiVersion": "[variables('mlVersion')]",
            "type": "Microsoft.MachineLearning/workspaces",
            "name": "[variables('mlWorkspaceName')]",
            "location": "[variables('location')]",
            "dependsOn": ["[variables('stgResourceId')]"],
            "properties": {
                "UserStorageAccountId": "[variables('stgResourceId')]"
            }
        }
    ],
    "outputs": {
        "mlWorkspaceObject": {"type": "object", "value": "[reference(variables('mlResourceId'), variables('mlVersion'))]"},
        "mlWorkspaceToken": {"type": "string", "value": "[listWorkspaceKeys(variables('mlResourceId'), variables('mlVersion')).primaryToken]"},
        "mlWorkspaceWorkspaceID": {"type": "string", "value": "[reference(variables('mlResourceId'), variables('mlVersion')).WorkspaceId]"},
        "mlWorkspaceWorkspaceLink": {"type": "string", "value": "[concat('https://studio.azureml.net/Home/ViewWorkspace/', reference(variables('mlResourceId'), variables('mlVersion')).WorkspaceId)]"}
    }
}

```
Save this template as mlworkspace.json file under c:\temp\.

### Deploy the resource group, based on the template
* Open PowerShell
* Install modules for Azure Resource Manager and Azure Service Management  

```
# Install the Azure Resource Manager modules from the PowerShell Gallery (press “A”)
Install-Module AzureRM -Scope CurrentUser

# Install the Azure Service Management modules from the PowerShell Gallery (press “A”)
Install-Module Azure -Scope CurrentUser
```

   These steps download and install the modules necessary to complete the remaining steps. This only needs to be done once in the environment where you are executing the PowerShell commands.   

* Authenticate to Azure  

```
# Authenticate (enter your credentials in the pop-up window)
Add-AzureRmAccount
```
This step needs to be repeated for each session. Once authenticated, your subscription information should be displayed.

![Azure Account][1]

Now that we have access to Azure, we can create the resource group.

* Create a resource group

```
$rg = New-AzureRmResourceGroup -Name "uniquenamerequired523" -Location "South Central US"
$rg
```

Verify that the resource group is correctly provisioned. **ProvisioningState** should be “Succeeded.”
The resource group name is used by the template to generate the storage account name. The storage account name must be between 3 and 24 characters in length and use numbers and lower-case letters only.

![Resource Group][2]

* Using the resource group deployment, deploy a new Machine Learning Workspace.

```
# Create a Resource Group, TemplateFile is the location of the JSON template.
$rgd = New-AzureRmResourceGroupDeployment -Name "demo" -TemplateFile "C:\temp\mlworkspace.json" -ResourceGroupName $rg.ResourceGroupName
```

Once the deployment is completed, it is straightforward to access properties of the workspace you deployed. For example, you can access the Primary Key Token.

```
# Access Azure ML Workspace Token after its deployment.
$rgd.Outputs.mlWorkspaceToken.Value
```

Another way to retrieve tokens of existing workspace is to use the Invoke-AzureRmResourceAction command. For example, you can list the primary and secondary tokens of all workspaces.

```  
# List the primary and secondary tokens of all workspaces
Get-AzureRmResource |? { $_.ResourceType -Like "*MachineLearning/workspaces*"} |% { Invoke-AzureRmResourceAction -ResourceId $_.ResourceId -Action listworkspacekeys -Force}  
```
After the workspace is provisioned, you can also automate many Azure Machine Learning Studio tasks using the [PowerShell Module for Azure Machine Learning](http://aka.ms/amlps).

## Next Steps
* Learn more about [authoring Azure Resource Manager Templates](../azure-resource-manager/resource-group-authoring-templates.md). 
* Have a look at the [Azure Quickstart Templates Repository](https://github.com/Azure/azure-quickstart-templates). 
* Watch this video about [Azure Resource Manager](https://channel9.msdn.com/Events/Ignite/2015/C9-39). 

<!--Image references-->
[1]: ../media/machine-learning-deploy-with-resource-manager-template/azuresubscription.png
[2]: ../media/machine-learning-deploy-with-resource-manager-template/resourcegroupprovisioning.png


<!--Link references-->

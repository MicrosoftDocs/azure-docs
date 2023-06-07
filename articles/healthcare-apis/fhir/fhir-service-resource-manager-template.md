---
title: Deploy Azure Health Data Services FHIR service using ARM template
description: Learn how to deploy FHIR service by using an Azure Resource Manager template (ARM template)
author: expekesheth
ms.service: healthcare-apis
ms.custom: devx-track-arm-template
ms.topic: tutorial
ms.author: kesheth
ms.date: 06/06/2022
---

# Deploy a FHIR service within Azure Health Data Services - using ARM template

In this article, you'll learn how to deploy FHIR service within the Azure Health Data Services (hereby called FHIR service) using the Azure Resource Manager template (ARM template). We provide you two options using PowerShell or using CLI.

An [ARM template](../../azure-resource-manager/templates/overview.md) is a JSON file that defines the infrastructure and configuration for your project. The template uses declarative syntax. In declarative syntax, you describe your intended deployment without writing the sequence of programming commands to create the deployment.

## Prerequisites

# [PowerShell](#tab/PowerShell)

* An Azure account with an active subscription. [Create one for free](https://azure.microsoft.com/free/).
* If you want to run the code locally:
    * [Azure PowerShell](/powershell/azure/install-azure-powershell).

# [CLI](#tab/CLI)

* An Azure account with an active subscription. [Create one for free](https://azure.microsoft.com/free/).
* If you want to run the code locally:
    * A Bash shell (such as Git Bash, which is included in [Git for Windows](https://gitforwindows.org)).
    * [Azure CLI](/cli/azure/install-azure-cli).

---

## Review the ARM template

The template used in this article is from [Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/azure-api-for-fhir/).

The template defines three Azure resources:
- Microsoft.HealthcareApis/workspaces
- Microsoft.HealthcareApis/workspaces/fhirservices      
- Microsoft.Storage/storageAccounts

> [!NOTE]
> Local RBAC will be deprecated on September 9th, 2023. Access Policies configuration associated with Local RBAC in ARM template will be deprecated. For questions, please [contact us](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/overview).

You can deploy the FHIR service resource by **removing** the workspaces resource, the storage resource, and the `dependsOn` property in the “Microsoft.HealthcareApis/workspaces/fhirservices” resource.


```json
{
    "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "authorityurl": {
            "type": "string",
            "defaultValue": "https://login.microsoftonline.com"
        },
        "tagName": {
            "type": "string",
            "defaultValue": "My Deployment"
        },
        "region": {
            "type": "string",
                  "allowedValues": [
                "australiaeast",
                "canadacentral",
                "eastus",
                "eastus2",
                "germanywestcentral",
                "japaneast",
                "northcentralus",
                "northeurope",
                "southafricanorth",
                "southcentralus",
                "southeastasia",
                "switzerlandnorth",
                "uksouth",
                "ukwest",
                "westcentralus",
                "westeurope",
                "westus2"
            ]
        },
        "workspaceName": {
            "type": "string"
        },
        "fhirServiceName": {
            "type": "string"
        },
        "tenantid": {
            "type": "string"
        },
        "storageAccountName": {
            "type": "string"
        },
        "storageAccountConfirm": {
            "type": "bool",
            "defaultValue": true
        },
        "AccessPolicies": {
            "type": "array",
            "defaultValue": []
        },
        "smartProxyEnabled": {
            "type": "bool",
            "defaultValue": false
        }
    },
    "variables": { 
        "authority": "[Concat(parameters('authorityurl'), '/', parameters('tenantid'))]",
        "createManagedIdentity": true,
        "managedIdentityType": {
            "type": "SystemAssigned"
        },
        "storageBlobDataContributerRoleId": "[concat('/subscriptions/', subscription().subscriptionId, '/providers/Microsoft.Authorization/roleDefinitions/', 'ba92f5b4-2d11-453d-a403-e96b0029c9fe')]"
    },
    "resources": [
        {
            "type": "Microsoft.HealthcareApis/workspaces",
            "name": "[parameters('workspaceName')]",
            "apiVersion": "2020-11-01-preview",
            "location": "[parameters('region')]",
            "properties": {}
        },
       {          
            "type": "Microsoft.HealthcareApis/workspaces/fhirservices",
            "kind": "fhir-R4",
            "name": "[concat(parameters('workspaceName'), '/', parameters('fhirServiceName'))]",
            "apiVersion": "2020-11-01-preview",
            "location": "[parameters('region')]",
            "dependsOn": [
                "[resourceId('Microsoft.HealthcareApis/workspaces', parameters('workspaceName'))]"
            ],
            "tags": {
                "environmentName": "[parameters('tagName')]"
            },
            "properties": {
                "accessPolicies": "[parameters('AccessPolicies')]",
                "authenticationConfiguration": {
                    "authority": "[variables('Authority')]",
                    "audience": "[concat('https//', parameters('workspaceName'), '-', parameters('fhirServiceName'), '.fhir.azurehealthcareapis.com')]",
                    "smartProxyEnabled": "[parameters('smartProxyEnabled')]"
                },
                "corsConfiguration": {
                    "allowCredentials": false,
                    "headers": ["*"],
                    "maxAge": 1440,
                    "methods": ["DELETE", "GET", "OPTIONS", "PATCH", "POST", "PUT"],
                    "origins": ["https://localhost:6001"]
                },
                "exportConfiguration": {
                    "storageAccountName": "[parameters('storageAccountName')]"
                }
            },
            "identity": "[if(variables('createManagedIdentity'), variables('managedIdentityType'), json('null'))]"
        },
        {
            "name": "[parameters('storageAccountName')]",
            "type": "Microsoft.Storage/storageAccounts",
            "apiVersion": "2019-06-01",
            "location": "[resourceGroup().location]",
            "properties": {
                "supportsHttpsTrafficOnly": "true"
            },
            "condition": "[parameters('storageAccountConfirm')]",
            "dependsOn": [
                "[parameters('fhirServiceName')]"
            ],
            "sku": {
                "name": "Standard_LRS"
            },
            "kind": "Storage",
            "tags": {
                "environmentName": "[parameters('tagName')]",
                "test-account-rg": "true"
            }
        }
    ],
    "outputs": {
    }
}
```

## Deploy ARM template

You can deploy the ARM template using two options: PowerShell or CLI.

The sample code provided below uses the template in the “templates” subfolder of the subfolder “src”. You may want to change the location path to reference the template file properly.

The deployment process takes a few minutes to complete. Take a note of the names for the FHIR service and the resource group, which you'll use later.

# [PowerShell](#tab/PowerShell)

### Deploy the template: using PowerShell

Run the code in PowerShell locally, in Visual Studio Code, or in Azure Cloud Shell, to deploy the FHIR service. 

If you haven't logged in to Azure, use "Connect-AzAccount" to log in. Once you've logged in, use "Get-AzContext" to verify the subscription and tenant you want to use. You can change the subscription and tenant if needed.

You can create a new resource group, or use an existing one by skipping the step or commenting out the line starting with “New-AzResourceGroup”.

```powershell-interactive
### variables
$resourcegroupname="your resource group"
$location="South Central US"
$workspacename="your workspace name"
$servicename="your fhir service name"
$tenantid="xxx"
$subscriptionid="xxx"
$storageaccountname="storage account name"
$storageaccountconfirm=1

### login to azure
Connect-AzAccount 
#Connect-AzAccount SubscriptionId $subscriptionid
Set-AzContext -Subscription $subscriptionid
Connect-AzAccount -Tenant $tenantid -SubscriptionId $subscriptionid
#Get-AzContext 

### create resource group
New-AzResourceGroup -Name $resourcegroupname -Location $location

### deploy the resource
New-AzResourceGroupDeployment -ResourceGroupName $resourcegroupname -TemplateFile "src/templates/fhirtemplate.json" -region $location -workspaceName $workspacename -fhirServiceName $fhirservicename -tenantid $tenantid -storageAccountName $storageaccountname -storageAccountConfirm $storageaccountconfirm
```
# [CLI](#tab/CLI)

### Deploy the template: using CLI

Run the code locally, in Visual Studio Code or in Azure Cloud Shell, to deploy the FHIR service. 

If you haven’t logged in to Azure, use "az login" to log in. Once you've logged in, use "az account show --output table" to verify the subscription and tenant you want to use. You can change the subscription and tenant if needed.

You can create a new resource group, or use an existing one by skipping the step or commenting out the line starting with "az group create".

```azurecli-interactive
### variables
resourcegroupname=your resource group name
location=southcentralus
workspacename=your workspace name
fhirservicename=your fhir service name
tenantid=xxx
subscriptionid=xxx
storageaccountname=your storage account name
storageaccountconfirm=true

### login to azure
az login
az account show --output table
az account set --subscription $subscriptionid

### create resource group
az group create --name $resourcegroupname --location $location

### deploy the resource
az deployment group create --resource-group $resourcegroupname --template-file 'src\\templates\\fhirtemplate.json' --parameters region=$location workspaceName=$workspacename fhirServiceName=$fhirservicename tenantid=$tenantid storageAccountName=$storageaccountname storageAccountConfirm=$storageaccountconfirm
```

---

## Review the deployed resources

You can verify that the FHIR service is up and running by opening the browser and navigating to `https://<yourfhir servic>.azurehealthcareapis.com/metadata`. If the capability statement is displayed or downloaded automatically, your deployment is successful. 

## Clean up the resources

When the resource is no longer needed, run the code below to delete the resource group.

# [PowerShell](#tab/PowerShell)
```powershell-interactive
$resourceGroupName = “your resource group name”
Remove-AzResourceGroup -Name $resourceGroupName
```
# [CLI](#tab/CLI)
```azurecli-interactive
resourceGroupName = “your resource group name”
az group delete --name $resourceGroupName
```
---

## Next steps

In this quickstart guide, you've deployed the FHIR service within Azure Health Data Services using an ARM template. For more information about FHIR service supported features, see.

>[!div class="nextstepaction"]
>[Supported FHIR Features](fhir-features-supported.md)

FHIR&#174; is a registered trademark of [HL7](https://hl7.org/fhir/) and is used with the permission of HL7.

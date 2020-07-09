---
title: Create a workspace with Azure Resource Manager template
titleSuffix: Azure Machine Learning
description: Learn how to use an Azure Resource Manager template to create a new Azure Machine Learning workspace.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: how-to
ms.author: larryfr
author: Blackmist
ms.date: 07/09/2020
ms.custom: seoapril2019

# Customer intent: As a DevOps person, I need to automate or customize the creation of Azure Machine Learning by using templates.
---

# Use an Azure Resource Manager template to create a workspace for Azure Machine Learning

[!INCLUDE [aml-applies-to-basic-enterprise-sku](../../includes/aml-applies-to-basic-enterprise-sku.md)]
<br>

In this article, you learn several ways to create an Azure Machine Learning workspace using Azure Resource Manager templates. A Resource Manager template makes it easy to create resources as a single, coordinated operation. A template is a JSON document that defines the resources that are needed for a deployment. It may also specify deployment parameters. Parameters are used to provide input values when using the template.

For more information, see [Deploy an application with Azure Resource Manager template](../azure-resource-manager/templates/deploy-powershell.md).

## Prerequisites

* An **Azure subscription**. If you do not have one, try the [free or paid version of Azure Machine Learning](https://aka.ms/AMLFree).

* To use a template from a CLI, you need either [Azure PowerShell](https://docs.microsoft.com/powershell/azure/overview?view=azps-1.2.0) or the [Azure CLI](https://docs.microsoft.com/cli/azure/install-azure-cli?view=azure-cli-latest).

## Resource Manager template

The following Resource Manager template can be used to create an Azure Machine Learning workspace and associated Azure resources:

<!-- [!code-json[create-azure-machine-learning-service-workspace](https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/101-machine-learning-create/azuredeploy.json)] -->

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "workspaceName": {
      "type": "string",
      "metadata": {
        "description": "Specifies the name of the Azure Machine Learning workspace."
      }
    },
    "location": {
      "type": "string",
      "allowedValues": [
        "australiaeast",
        "brazilsouth",
        "canadacentral",
        "centralus",
        "eastasia",
        "eastus",
        "eastus2",
        "francecentral",
        "japaneast",
        "koreacentral",
        "northcentralus",
        "northeurope",
        "southeastasia",
        "southcentralus",
        "uksouth",
        "westcentralus",
        "westus",
        "westus2",
        "westeurope"
      ],
      "metadata": {
        "description": "Specifies the location for all resources."
      }
    },
    "sku": {
      "type": "string",
      "defaultValue": "basic",
      "allowedValues": [
        "basic",
        "enterprise"
      ],
      "metadata": {
        "description": "Specifies the sku, also referred as 'edition' of the Azure Machine Learning workspace."
      }
    },
    "storageAccountOption": {
      "type": "string",
      "defaultValue": "new",
      "allowedValues": [
        "new",
        "existing"
      ],
      "metadata": {
        "description": "Determines whether or not a new storage should be provisioned."
      }
    },
    "storageAccountName": {
      "type": "string",
      "defaultValue": "[concat('sa',uniqueString(resourceGroup().id, parameters('workspaceName')))]",
      "metadata": {
        "description": "Name of the storage account."
      }
    },
    "storageAccountType": {
      "type": "string",
      "defaultValue": "Standard_LRS",
      "allowedValues": [
        "Standard_LRS",
        "Standard_GRS",
        "Standard_RAGRS",
        "Standard_ZRS",
        "Premium_LRS",
        "Premium_ZRS",
        "Standard_GZRS",
        "Standard_RAGZRS"
      ]
    },
    "storageAccountBehindVNet": {
      "type": "string",
      "defaultValue": "false",
      "allowedValues": [
        "true",
        "false"
      ],
      "metadata": {
        "description": "Determines whether or not to put the storage account behind VNet"
      }
    },
    "storageAccountResourceGroupName": {
      "type": "string",
      "defaultValue": "[resourceGroup().name]"
    },
    "keyVaultOption": {
      "type": "string",
      "defaultValue": "new",
      "allowedValues": [
        "new",
        "existing"
      ],
      "metadata": {
        "description": "Determines whether or not a new key vault should be provisioned."
      }
    },
    "keyVaultName": {
      "type": "string",
      "defaultValue": "[concat('kv',uniqueString(resourceGroup().id, parameters('workspaceName')))]",
      "metadata": {
        "description": "Name of the key vault."
      }
    },
    "keyVaultBehindVNet": {
      "type": "string",
      "defaultValue": "false",
      "allowedValues": [
        "true",
        "false"
      ],
      "metadata": {
        "description": "Determines whether or not to put the storage account behind VNet"
      }
    },
    "keyVaultResourceGroupName": {
      "type": "string",
      "defaultValue": "[resourceGroup().name]"
    },
    "applicationInsightsOption": {
      "type": "string",
      "defaultValue": "new",
      "allowedValues": [
        "new",
        "existing"
      ],
      "metadata": {
        "description": "Determines whether or not new ApplicationInsights should be provisioned."
      }
    },
    "applicationInsightsName": {
      "type": "string",
      "defaultValue": "[concat('ai',uniqueString(resourceGroup().id, parameters('workspaceName')))]",
      "metadata": {
        "description": "Name of ApplicationInsights."
      }
    },
    "applicationInsightsResourceGroupName": {
      "type": "string",
      "defaultValue": "[resourceGroup().name]"
    },
    "containerRegistryOption": {
      "type": "string",
      "defaultValue": "none",
      "allowedValues": [
        "new",
        "existing",
        "none"
      ],
      "metadata": {
        "description": "Determines whether or not a new container registry should be provisioned."
      }
    },
    "containerRegistryName": {
      "type": "string",
      "defaultValue": "[concat('cr',uniqueString(resourceGroup().id, parameters('workspaceName')))]",
      "metadata": {
        "description": "The container registry bind to the workspace."
      }
    },
    "containerRegistrySku": {
      "type": "string",
      "defaultValue": "Standard",
      "allowedValues": [
        "Basic",
        "Standard",
        "Premium"
      ]
    },
    "containerRegistryResourceGroupName": {
      "type": "string",
      "defaultValue": "[resourceGroup().name]"
    },
    "containerRegistryBehindVNet": {
      "type": "string",
      "defaultValue": "false",
      "allowedValues": [
        "true",
        "false"
      ],
      "metadata": {
        "description": "Determines whether or not to put container registry behind VNet."
      }
    },
    "vnetOption": {
      "type": "string",
      "defaultValue": "[if(equals(parameters('privateEndpointType'), 'none'), 'none', 'new')]",
      "allowedValues": [
        "new",
        "existing",
        "none"
      ],
      "metadata": {
        "description": "Determines whether or not a new VNet should be provisioned."
      }
    },
    "vnetName": {
      "type": "string",
      "defaultValue": "[concat('vn',uniqueString(resourceGroup().id, parameters('workspaceName')))]",
      "metadata": {
        "description": "Name of the VNet"
      }
    },
    "vnetResourceGroupName": {
      "type": "string",
      "defaultValue": "[resourceGroup().name]"
    },
    "addressPrefixes": {
      "type": "array",
      "defaultValue": [
        "10.0.0.0/16"
      ],
      "metadata": {
        "description": "Address prefix of the virtual network"
      }
    },
    "subnetOption": {
      "type": "string",
      "defaultValue": "[if(or(not(equals(parameters('privateEndpointType'), 'none')), equals(parameters('vnetOption'), 'new')), 'new', 'none')]",
      "allowedValues": [
        "new",
        "existing",
        "none"
      ],
      "metadata": {
        "description": "Determines whether or not a new subnet should be provisioned."
      }
    },
    "subnetName": {
      "type": "string",
      "defaultValue": "[concat('sn',uniqueString(resourceGroup().id, parameters('workspaceName')))]",
      "metadata": {
        "description": "Name of the subnet"
      }
    },
    "subnetPrefix": {
      "type": "string",
      "defaultValue": "10.0.0.0/24",
      "metadata": {
        "description": "Subnet prefix of the virtual network"
      }
    },
    "adbWorkspace": {
      "type": "string",
      "defaultValue": "",
      "metadata": {
        "description": "Azure Databrick workspace to be linked to the workspace"
      }
    },
    "confidential_data":{
      "type": "string",
      "defaultValue": "false",
      "allowedValues": [
        "false",
        "true"
      ],
      "metadata": {
        "description": "Specifies that the Azure Machine Learning workspace holds highly confidential data."
      }
    },
    "encryption_status":{
      "type": "string",
      "defaultValue": "Disabled",
      "allowedValues": [
        "Enabled",
        "Disabled"
      ],
      "metadata": {
        "description": "Specifies if the Azure Machine Learning workspace should be encrypted with customer managed key."
      }
    },
    "cmk_keyvault":{
      "type": "string",
      "defaultValue": "",
      "metadata": {
        "description": "Specifies the customer managed keyVault arm id."
      }
    },
    "resource_cmk_uri":{
      "type": "string",
      "defaultValue": "",
      "metadata": {
        "description": "Specifies if the customer managed keyvault key uri."
      }
    },
    "privateEndpointType": {
      "type": "string",
      "defaultValue": "none",
      "allowedValues": [
        "AutoApproval",
        "ManualApproval",
        "none"
      ]
    }
  },
  "variables": {
    "tenantId": "[subscription().tenantId]",
    "storageAccount": "[resourceId(parameters('storageAccountResourceGroupName'), 'Microsoft.Storage/storageAccounts', parameters('storageAccountName'))]",
    "keyVault": "[resourceId(parameters('keyVaultResourceGroupName'), 'Microsoft.KeyVault/vaults', parameters('keyVaultName'))]",
    "containerRegistry": "[resourceId(parameters('containerRegistryResourceGroupName'), 'Microsoft.ContainerRegistry/registries', parameters('containerRegistryName'))]",
    "applicationInsights": "[resourceId(parameters('applicationInsightsResourceGroupName'), 'Microsoft.Insights/components', parameters('applicationInsightsName'))]",
    "vnet": "[resourceId(parameters('vnetResourceGroupName'), 'Microsoft.Network/virtualNetworks', parameters('vnetName'))]",
    "subnet": "[resourceId(parameters('vnetResourceGroupName'), 'Microsoft.Network/virtualNetworks/subnets', parameters('vnetName'), parameters('subnetName'))]",
    "privateEdnpoint": "[resourceId('Microsoft.Network/privateEndpoints', concat(parameters('workspaceName'), '-PrivateEndpoint'))]",
    "privateDnsGuid": "[guid(resourceGroup().id, deployment().name)]",
    "locationsPEAvailable": [
      "southcentralus",
      "eastus",
      "westus2"
    ],
    "enablePE": "[or(equals(parameters('privateEndpointType'), 'none'), contains(variables('locationsPEAvailable'), parameters('location')))]",
    "networkRuleSetBehindVNet": {
      "defaultAction": "deny",
      "virtualNetworkRules": [
        {
          "action": "Allow",
          "id": "[variables('subnet')]"
        }
      ]
    },
    "subnetPolicyForPE": {
      "privateEndpointNetworkPolicies": "Disabled",
      "privateLinkServiceNetworkPolicies": "Enabled"
    },
    "privateEndpointSettings": {
      "name": "[concat(parameters('workspaceName'), '-PrivateEndpoint')]",
      "properties": {
        "privateLinkServiceId": "[resourceId('Microsoft.MachineLearningServices/workspaces', parameters('workspaceName'))]",
        "groupIds": [
          "amlworkspace"
        ]
      }
    },
    "defaultPEConnections": "[array(variables('privateEndpointSettings'))]"
  },
  "resources": [    
    {
      "condition": "[and(variables('enablePE'), equals(parameters('vnetOption'), 'new'))]",
      "type": "Microsoft.Network/virtualNetworks",
      "apiVersion": "2019-09-01",
      "name": "[parameters('vnetName')]",
      "location": "[parameters('location')]",
      "properties": {
        "addressSpace": {
          "addressPrefixes": "[parameters('addressPrefixes')]"
        },
        "enableDdosProtection": false,
        "enableVmProtection": false
      }
    },
    {
      "condition": "[and(variables('enablePE'), equals(parameters('subnetOption'), 'new'))]",
      "type": "Microsoft.Network/virtualNetworks/subnets",
      "apiVersion": "2019-09-01",
      "name": "[concat(parameters('vnetName'), '/', parameters('subnetName'))]",
      "dependsOn": [
        "[variables('vnet')]"
      ],
      "properties": {
        "addressPrefix": "[parameters('subnetPrefix')]",
        "privateEndpointNetworkPolicies": "Disabled",
        "privateLinkServiceNetworkPolicies": "Enabled",
        "serviceEndpoints": [
          {
            "service": "Microsoft.Storage"
          },
          {
            "service": "Microsoft.KeyVault"
          },
          {
            "service": "Microsoft.ContainerRegistry"
          }
        ]
      }
    },
    {
      "condition": "[and(equals(parameters('subnetOption'), 'existing'), not(equals(parameters('privateEndpointType'), 'none')))]",
      "type": "Microsoft.Resources/deployments",
      "apiVersion": "2019-10-01",
      "name": "UpdateSubnetPolicy",
      "dependsOn": [
        "[variables('subnet')]"
      ],
      "resourceGroup": "[parameters('vnetResourceGroupName')]",
      "properties": {
        "mode": "Incremental",
        "template": {
          "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
          "contentVersion": "1.0.0.0",
          "resources": [
            {
              "type": "Microsoft.Network/virtualNetworks/subnets",
              "apiVersion": "2019-09-01",
              "name": "[concat(parameters('vnetName'), '/', parameters('subnetName'))]",
              "properties": "[if(and(equals(parameters('subnetOption'), 'existing'), not(equals(parameters('privateEndpointType'), 'none'))), union(reference(variables('subnet'), '2019-09-01'), variables('subnetPolicyForPE')), json('null'))]"
            }
          ]
        }
      }
    },
    {
      "condition": "[and(variables('enablePE'), equals(parameters('storageAccountOption'), 'new'))]",
      "type": "Microsoft.Storage/storageAccounts",
      "apiVersion": "2019-04-01",
      "name": "[parameters('storageAccountName')]",
      "dependsOn": [
          "[variables('subnet')]"
      ],
      "location": "[parameters('location')]",
      "sku": {
        "name": "[parameters('storageAccountType')]"
      },
      "kind": "StorageV2",
      "properties": {
        "encryption": {
          "services": {
            "blob": {
              "enabled": true
              },
            "file": {
              "enabled": true
            }
          },
          "keySource": "Microsoft.Storage"
        },
        "supportsHttpsTrafficOnly": true,
        "networkAcls": "[if(equals(parameters('storageAccountBehindVNet'), 'true'), variables('networkRuleSetBehindVNet'), json('null'))]"
      }
    },
    {
      "condition": "[and(variables('enablePE'), equals(parameters('keyVaultOption'), 'new'))]",
      "type": "Microsoft.KeyVault/vaults",
      "apiVersion": "2019-09-01",
      "dependsOn": [
          "[variables('subnet')]"
      ],
      "name": "[parameters('keyVaultName')]",
      "location": "[parameters('location')]",
      "properties": {
        "tenantId": "[variables('tenantId')]",
        "sku": {
            "name": "standard",
            "family": "A"
        },
        "accessPolicies": [],
        "networkAcls": "[if(equals(parameters('keyVaultBehindVNet'), 'true'), variables('networkRuleSetBehindVNet'), json('null'))]"
      }
    },
    {
      "condition": "[and(variables('enablePE'), equals(parameters('containerRegistryOption'), 'new'))]",
      "type": "Microsoft.ContainerRegistry/registries",
      "apiVersion": "2019-05-01",
      "name": "[parameters('containerRegistryName')]",
      "dependsOn": [
          "[variables('subnet')]"
      ],
      "location": "[parameters('location')]",
      "sku": {
        "name": "[parameters('containerRegistrySku')]"
      },
      "properties": {
        "adminUserEnabled": true,
        "networkRuleSet": "[if(equals(parameters('containerRegistryBehindVNet'), 'true'), variables('networkRuleSetBehindVNet'), json('null'))]"
      }
    },
    {
      "condition": "[and(variables('enablePE'), equals(parameters('applicationInsightsOption'), 'new'))]",
      "type": "Microsoft.Insights/components",
      "apiVersion": "2018-05-01-preview",
      "name": "[parameters('applicationInsightsName')]",
      "location": "[if(or(equals(parameters('location'),'eastus2'), equals(parameters('location'),'westcentralus')),'southcentralus',parameters('location'))]",
      "kind": "web",
      "properties": {
          "Application_Type": "web"
      }
    },
    {
      "condition": "[variables('enablePE')]",
      "type": "Microsoft.MachineLearningServices/workspaces",
      "apiVersion": "2020-04-01",
      "name": "[parameters('workspaceName')]",
      "location": "[parameters('location')]",
      "dependsOn": [
        "[variables('storageAccount')]",
        "[variables('keyVault')]",
        "[variables('applicationInsights')]",
        "[variables('containerRegistry')]"
      ],
      "identity": {
        "type": "systemAssigned"
      },
      "sku": {
        "tier": "[parameters('sku')]",
        "name": "[parameters('sku')]"
      },
      "properties": {
        "friendlyName": "[parameters('workspaceName')]",
        "storageAccount": "[variables('storageAccount')]",
        "keyVault": "[variables('keyVault')]",
        "applicationInsights": "[variables('applicationInsights')]",
        "containerRegistry": "[if(not(equals(parameters('containerRegistryOption'), 'none')), variables('containerRegistry'), json('null'))]",
        "adbWorkspace": "[if(empty(parameters('adbWorkspace')), json('null'), parameters('adbWorkspace'))]",
        "encryption": {
          "status": "[parameters('encryption_status')]",
          "keyVaultProperties": {
            "keyVaultArmId": "[parameters('cmk_keyvault')]",
            "keyIdentifier": "[parameters('resource_cmk_uri')]"
          }
        },
        "hbiWorkspace": "[parameters('confidential_data')]"
      }
    },
    {
      "condition": "[and(variables('enablePE'), not(equals(parameters('privateEndpointType'), 'none')))]",
      "apiVersion": "2020-04-01",
      "name": "[concat(parameters('workspaceName'), '-PrivateEndpoint')]",
      "type": "Microsoft.Network/privateEndpoints",
      "location": "[parameters('location')]",
      "dependsOn": [
        "[resourceId('Microsoft.MachineLearningServices/workspaces', parameters('workspaceName'))]",
        "[variables('subnet')]"
      ],
      "properties": {
        "privateLinkServiceConnections":"[if(equals(parameters('privateEndpointType'), 'AutoApproval'), variables('defaultPEConnections'), json('null'))]",
        "manualPrivateLinkServiceConnections": "[if(equals(parameters('privateEndpointType'), 'ManualApproval'), variables('defaultPEConnections'), json('null'))]",
        "subnet": {
          "id": "[variables('subnet')]"
        }
      }
    },
    {
      "condition": "[and(variables('enablePE'), equals(parameters('privateEndpointType'), 'AutoApproval'))]",
      "type": "Microsoft.Network/privateDnsZones",
      "apiVersion": "2018-09-01",
      "name": "privatelink.api.azureml.ms",
      "dependsOn": [
        "[variables('privateEdnpoint')]"
      ],
      "location": "global",
      "properties":{}
    },
    {
      "condition": "[and(variables('enablePE'), equals(parameters('privateEndpointType'), 'AutoApproval'))]",
      "type": "Microsoft.Network/privateDnsZones/virtualNetworkLinks",
      "apiVersion": "2018-09-01",
      "name": "[concat('privatelink.api.azureml.ms', '/', uniqueString(resourceId('Microsoft.Network/virtualNetworks', parameters('vnetName'))))]",
      "location": "global",
      "dependsOn": [
        "[variables('privateEdnpoint')]",
        "privatelink.api.azureml.ms"
      ],
      "properties": {
        "virtualNetwork": {
          "id": "[resourceId('Microsoft.Network/virtualNetworks', parameters('vnetName'))]"
        },
        "registrationEnabled": false
      }
    },
    {
      "condition": "[and(variables('enablePE'), equals(parameters('privateEndpointType'), 'AutoApproval'))]",
      "type": "Microsoft.Resources/deployments",
      "apiVersion": "2019-10-01",
      "name": "[concat('EndpointDnsRecords-', variables('privateDnsGuid'))]",
      "dependsOn": [
        "privatelink.api.azureml.ms"
      ],
      "properties": {
        "mode": "Incremental",
        "expressionEvaluationOptions": {
          "scope": "inner"
        },
        "parameters": {
          "privateEndpointIPConfig": {
            "value": "[if(equals(parameters('privateEndpointType'), 'AutoApproval'), reference(variables('privateEdnpoint'), '2020-04-01').customDnsConfigs, json('null'))]"
          }
        },
        "template": {
          "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
          "contentVersion": "1.0.0.0",
          "parameters": {
            "privateEndpointIPConfig": {
              "type": "array"
            }
          },
          "variables": {
            "copy": [
              {
                "name": "aRecordName",
                "count": "[length(parameters('privateEndpointIPConfig'))]",
                "input": "[substring(parameters('privateEndpointIPConfig')[copyIndex('aRecordName')].fqdn, 0, sub(length(parameters('privateEndpointIPConfig')[copyIndex('aRecordName')].fqdn), 15))]"
              }
            ]
          },
          "resources": [
            {
              "type": "Microsoft.Network/privateDnsZones/A",
              "name": "[concat('privatelink.api.azureml.ms','/', variables('aRecordName')[copyIndex('fqdnCopy')])]",
              "apiVersion": "2018-09-01",
              "properties": {
                "aRecords": [
                  {
                    "ipv4Address": "[parameters('privateEndpointIPConfig')[copyIndex('fqdnCopy')].ipAddresses[0]]"
                  }
                ],
                "ttl": 3600 
              },
              "copy": {
                "name": "fqdnCopy",
                "count": "[length(parameters('privateEndpointIPConfig'))]"
              }
            }
          ]
        }
      }
    }
  ],
  "outputs": {
    "PrivateEndPointNotSupported": {
      "condition": "[and(not(variables('enablePE')), not(equals(parameters('privateEndpointType'), 'none')))]",
      "type": "string",
      "value": "Private endpoint is not supported in the specified location."
    }
  }
}
```

This template creates the following Azure services:

* Azure Resource Group
* Azure Storage Account
* Azure Key Vault
* Azure Application Insights
* Azure Container Registry
* Azure Machine Learning workspace

The resource group is the container that holds the services. The various services are required by the Azure Machine Learning workspace.

The example template has two parameters:

* The **location** where the resource group and services will be created.

    The template will use the location you select for most resources. The exception is the Application Insights service, which is not available in all of the locations that the other services are. If you select a location where it is not available, the service will be created in the South Central US location.

* The **workspace name**, which is the friendly name of the Azure Machine Learning workspace.

    > [!NOTE]
    > The workspace name is case-insensitive.

    The names of the other services are generated randomly.

> [!TIP]
> While the template associated with this document creates a new Azure Container Registry, you can also create a new workspace without creating a container registry. One will be created when you perform an operation that requires a container registry. For example, training or deploying a model.
>
> You can also reference an existing container registry or storage account in the Azure Resource Manager template, instead of creating a new one. However, the container registry you use must have the __admin account__ enabled. For information on enabling the admin account, see [Admin account](/azure/container-registry/container-registry-authentication#admin-account).

[!INCLUDE [machine-learning-delete-acr](../../includes/machine-learning-delete-acr.md)]

For more information on templates, see the following articles:

* [Author Azure Resource Manager templates](../azure-resource-manager/templates/template-syntax.md)
* [Deploy an application with Azure Resource Manager templates](../azure-resource-manager/templates/deploy-powershell.md)
* [Microsoft.MachineLearningServices resource types](https://docs.microsoft.com/azure/templates/microsoft.machinelearningservices/allversions)

Create your resource group:

# [Azure CLI](#tab/CLI)

```azurecli
az group create --name examplegroup --location eastus
```

# [Azure PowerShell](#tab/PowerShell)

```azurepowershell
New-AzResourceGroup -Name examplegroup -Location eastus
```

---

Then, deploy the template

# [Azure CLI](#tab/CLI)

```azurecli
az deployment group create \
    --name exampledeployment \
    --resource-group examplegroup \
    --template-uri "https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/201-machine-learning-advanced/azuredeploy.json" \
    --parameters workspaceName=exampleworkspace location=eastus
```

# [Azure PowerShell](#tab/PowerShell)

```azurepowershell
New-azresourcegroupdeployment -name exampledeployment `
  -resourcegroupname examplegroup -location "East US" `
  -templatefile .\azuredeploy.json -workspaceName "exampleworkspace"
```

---

### Advanced template

The following example template demonstrates how to create a workspace with three settings:

* Enable high confidentiality settings for the workspace
* Enable encryption for the workspace
* Uses an existing Azure Key Vault to retrieve customer-managed keys

For more information, see [Encryption at rest](concept-enterprise-security.md#encryption-at-rest).

> [!IMPORTANT]
> There are some specific requirements your subscription must meet before using this template:
> * The __Azure Machine Learning__ application must be a __contributor__ for your Azure subscription.
> * You must have an existing Azure Key Vault that contains an encryption key.
> * You must have an access policy in the Azure Key Vault that grants __get__, __wrap__, and __unwrap__ access to the __Azure Cosmos DB__ application.
> * The Azure Key Vault must be in the same region where you plan to create the Azure Machine Learning workspace.

__To add the Azure Machine Learning app as a contributor__, use the following commands:

1. To authenticate to Azure from the CLI, use the following command:

    ```azurecli-interactive
    az login
    ```
    
    [!INCLUDE [subscription-login](../../includes/machine-learning-cli-subscription.md)]

1. To get the object ID of the Azure Machine Learning app, use the following command. The value may be different for each of your Azure subscriptions:

    ```azurecli-interactive
    az ad sp list --display-name "Azure Machine Learning" --query '[].[appDisplayName,objectId]' --output tsv
    ```

    This command returns the object ID, which is a GUID.

1. To add the object ID as a contributor to your subscription, use the following command. Replace `<object-ID>` with the GUID from the previous step. Replace `<subscription-ID>` with the name or ID of your Azure subscription:

    ```azurecli-interactive
    az role assignment create --role 'Contributor' --assignee-object-id <object-ID> --subscription <subscription-ID>
    ```

__To add a key to your Azure Key Vault__, use the information in the [Adding a key, secret, or certificate to the key vault](../key-vault/general/manage-with-cli2.md#adding-a-key-secret-or-certificate-to-the-key-vault) section of the __Manage Key Vault using Azure CLI__ article.

__To add an access policy to the key vault, use the following commands__:

1. To get the object ID of the Azure Cosmos DB app, use the following command. The value may be different for each of your Azure subscriptions:

    ```azurecli-interactive
    az ad sp list --display-name "Azure Cosmos DB" --query '[].[appDisplayName,objectId]' --output tsv
    ```
    
    This command returns the object ID, which is a GUID.

1. To set the policy, use the following command. Replace `<keyvault-name>` with the name of the existing Azure Key Vault. Replace `<object-ID>` with the GUID from the previous step:

    ```azurecli-interactive
    az keyvault set-policy --name <keyvault-name> --object-id <object-ID> --key-permissions get unwrapKey wrapKey
    ```

__To get the values__ for the `cmk_keyvault` (ID of the Key Vault) and the `resource_cmk_uri` (key URI) parameters needed by this template, use the following steps:

1. To get the Key Vault ID, use the following command:

    ```azurecli-interactive
    az keyvault show --name mykeyvault --resource-group myresourcegroup --query "id"
    ```

    This command returns a value similar to `/subscriptions/{subscription-guid}/resourceGroups/myresourcegroup/providers/Microsoft.KeyVault/vaults/mykeyvault`.

1. To get the value for the URI for the customer managed key, use the following command:

    ```azurecli-interactive
    az keyvault key show --vault-name mykeyvault --name mykey --query "key.kid"
    ```

    This command returns a value similar to `https://mykeyvault.vault.azure.net/keys/mykey/{guid}`.

__Example template__

:::code language="json" source="~/quickstart-templates/201-machine-learning-encrypted-workspace/azuredeploy.json":::

> [!IMPORTANT]
> Once a workspace has been created, you cannot change the settings for confidential data, encryption, key vault ID, or key identifiers. To change these values, you must create a new workspace using the new values.

## Use the Azure portal

1. Follow the steps in [Deploy resources from custom template](https://docs.microsoft.com/azure/azure-resource-manager/resource-group-template-deploy-portal#deploy-resources-from-custom-template). When you arrive at the __Edit template__ screen, paste in the template from this document.
1. Select __Save__ to use the template. Provide the following information and agree to the listed terms and conditions:

   * Subscription: Select the Azure subscription to use for these resources.
   * Resource group: Select or create a resource group to contain the services.
   * Workspace name: The name to use for the Azure Machine Learning workspace that will be created. The workspace name must be between 3 and 33 characters. It may only contain alphanumeric characters and '-'.
   * Location: Select the location where the resources will be created.

For more information, see [Deploy resources from custom template](../azure-resource-manager/templates/deploy-portal.md#deploy-resources-from-custom-template).

## Use Azure PowerShell

This example assumes that you have saved the template to a file named `azuredeploy.json` in the current directory:

```powershell
New-AzResourceGroup -Name examplegroup -Location "East US"
new-azresourcegroupdeployment -name exampledeployment `
  -resourcegroupname examplegroup -location "East US" `
  -templatefile .\azuredeploy.json -workspaceName "exampleworkspace" -sku "basic"
```

For more information, see [Deploy resources with Resource Manager templates and Azure PowerShell](../azure-resource-manager/templates/deploy-powershell.md) and [Deploy private Resource Manager template with SAS token and Azure PowerShell](../azure-resource-manager/templates/secure-template-with-sas-token.md).

## Use the Azure CLI

This example assumes that you have saved the template to a file named `azuredeploy.json` in the current directory:

```azurecli-interactive
az group create --name examplegroup --location "East US"
az group deployment create \
  --name exampledeployment \
  --resource-group examplegroup \
  --template-file azuredeploy.json \
  --parameters workspaceName=exampleworkspace location=eastus sku=basic
```

For more information, see [Deploy resources with Resource Manager templates and Azure CLI](../azure-resource-manager/templates/deploy-cli.md) and [Deploy private Resource Manager template with SAS token and Azure CLI](../azure-resource-manager/templates/secure-template-with-sas-token.md).

## Troubleshooting

### Resource provider errors

[!INCLUDE [machine-learning-resource-provider](../../includes/machine-learning-resource-provider.md)]

### Azure Key Vault access policy and Azure Resource Manager templates

When you use an Azure Resource Manager template to create the workspace and associated resources (including Azure Key Vault), multiple times. For example, using the template multiple times with the same parameters as part of a continuous integration and deployment pipeline.

Most resource creation operations through templates are idempotent, but Key Vault clears the access policies each time the template is used. Clearing the access policies breaks access to the Key Vault for any existing workspace that is using it. For example, Stop/Create functionalities of Azure Notebooks VM may fail.  

To avoid this problem, we recommend one of the following approaches:

* Do not deploy the template more than once for the same parameters. Or delete the existing resources before using the template to recreate them.

* Examine the Key Vault access policies and then use these policies to set the `accessPolicies` property of the template. To view the access policies, use the following Azure CLI command:

    ```azurecli-interactive
    az keyvault show --name mykeyvault --resource-group myresourcegroup --query properties.accessPolicies
    ```

    For more information on using the `accessPolicies` section of the template, see the [AccessPolicyEntry object reference](https://docs.microsoft.com/azure/templates/Microsoft.KeyVault/2018-02-14/vaults#AccessPolicyEntry).

* Check if the Key Vault resource already exists. If it does, do not recreate it through the template. For example, to use the existing Key Vault instead of creating a new one, make the following changes to the template:

    * **Add** a parameter that accepts the ID of an existing Key Vault resource:

        ```json
        "keyVaultId":{
          "type": "string",
          "metadata": {
            "description": "Specify the existing Key Vault ID."
          }
        }
      ```

    * **Remove** the section that creates a Key Vault resource:

        ```json
        {
          "type": "Microsoft.KeyVault/vaults",
          "apiVersion": "2018-02-14",
          "name": "[variables('keyVaultName')]",
          "location": "[parameters('location')]",
          "properties": {
            "tenantId": "[variables('tenantId')]",
            "sku": {
              "name": "standard",
              "family": "A"
            },
            "accessPolicies": [
            ]
          }
        },
        ```

    * **Remove** the `"[resourceId('Microsoft.KeyVault/vaults', variables('keyVaultName'))]",` line from the `dependsOn` section of the workspace. Also **Change** the `keyVault` entry in the `properties` section of the workspace to reference the `keyVaultId` parameter:

        ```json
        {
          "type": "Microsoft.MachineLearningServices/workspaces",
          "apiVersion": "2019-11-01",
          "name": "[parameters('workspaceName')]",
          "location": "[parameters('location')]",
          "dependsOn": [
            "[resourceId('Microsoft.Storage/storageAccounts', variables('storageAccountName'))]",
            "[resourceId('Microsoft.Insights/components', variables('applicationInsightsName'))]"
          ],
          "identity": {
            "type": "systemAssigned"
          },
          "sku": {
            "tier": "[parameters('sku')]",
            "name": "[parameters('sku')]"
          },
          "properties": {
            "friendlyName": "[parameters('workspaceName')]",
            "keyVault": "[parameters('keyVaultId')]",
            "applicationInsights": "[resourceId('Microsoft.Insights/components',variables('applicationInsightsName'))]",
            "storageAccount": "[resourceId('Microsoft.Storage/storageAccounts/',variables('storageAccountName'))]"
          }
        }
        ```

    After these changes, you can specify the ID of the existing Key Vault resource when running the template. The template will then reuse the Key Vault by setting the `keyVault` property of the workspace to its ID.

    To get the ID of the Key Vault, you can reference the output of the original template run or use the Azure CLI. The following command is an example of using the Azure CLI to get the Key Vault resource ID:

    ```azurecli-interactive
    az keyvault show --name mykeyvault --resource-group myresourcegroup --query id
    ```

    This command returns a value similar to the following text:

    ```text
    /subscriptions/{subscription-guid}/resourceGroups/myresourcegroup/providers/Microsoft.KeyVault/vaults/mykeyvault
    ```

## Next steps

* [Deploy resources with Resource Manager templates and Resource Manager REST API](../azure-resource-manager/templates/deploy-rest.md).
* [Creating and deploying Azure resource groups through Visual Studio](../azure-resource-manager/templates/create-visual-studio-deployment-project.md).

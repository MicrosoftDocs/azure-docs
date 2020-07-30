---
title: ARM template for creating App Configuration store
description: This quickstart demonstrates how to use Azure Resource Manager templates to deploy an App Configuration store, set key-values to the configuration store and reference key-values from the configuration store.
author: ZhijunZhao
ms.author: lcozzens
ms.date: 07/24/2020
ms.topic: quickstart
ms.service: azure-app-configuration
ms.custom: [mvc, subject-armqs]
---

# Quickstart: ARM template for creating App Configuration store

This quickstart shows you how to use Azure Resource Manager templates to deploy an Azure App Configuration store. Then you learn how to set key-values to the configuration store and reference key-values from the configuration store.

[!INCLUDE [About Azure Resource Manager](../../includes/resource-manager-quickstart-introduction.md)]

## Before you begin

* If you don't have an Azure subscription, create a [free account.](https://azure.microsoft.com/free/)

* This quickstart requires the Azure PowerShell module. Run `Get-InstalledModule -Name Az` to find the version that is installed on your local machine. If you need to install or upgrade, see [Install Azure PowerShell module](https://docs.microsoft.com/powershell/azure/install-Az-ps).

## Sign in to Azure

Sign in to your Azure subscription with the `Connect-AzAccount` command, and enter your Azure credentials in the pop-up browser:

```azurepowershell-interactive
# Connect to your Azure account
Connect-AzAccount
```

If you have more than one subscription, select the subscription you'd like to use for this quickstart by running the following cmdlets. Don't forget to replace `<your subscription name>` with the name of your subscription:

```azurepowershell-interactive
# List all available subscriptions.
Get-AzSubscription

# Select the Azure subscription you want to use to create the resource group and resources.
Get-AzSubscription -SubscriptionName "<your subscription name>" | Select-AzSubscription
```

## Create a resource group

Create an Azure resource group with [New-AzResourceGroup](https://docs.microsoft.com/powershell/module/az.resources/new-azresourcegroup). A resource group is a logical container into which Azure resources are deployed and managed.

```azurepowershell-interactive
$resourceGroup = "<your resource group name>"
$location = "WestUS2"
New-AzResourceGroup `
    -Name $resourceGroup `
    -Location $location
```

## Deploy the ARM template

This section shows the content of the template and how to deploy it.

1. Copy and paste the following json code into a new file named *appconfig.json*. Replace `<your App Configuration store name>` with a unique name for your App Configuration Store.

   ```json
    {
        "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
        "contentVersion": "1.0.0.0",
        "parameters": {
            "configStoreName": {
                "type": "string",
                "defaultValue": "<your App Configuration store name>",
                "metadata": {
                    "description": "Specifies the name of the App Configuration store."
                }
            },
            "keyValueName": {
                "type": "string",
                "defaultValue": "myKey$myLabel",
                "metadata": {
                    "description": "Specifies the name of the key-value resource. The name is a combination of key and label with $ as delimiter."
                }
            }
        },
        "resources": [
            {
                "name": "[parameters('configStoreName')]",
                "type": "Microsoft.AppConfiguration/configurationStores",
                "apiVersion": "2020-07-01-preview",
                "location": "[resourceGroup().location]",
                "sku": {
                    "name": "standard"
                },
                "resources": [
                    {
                        "name": "[parameters('keyValueName')]",
                        "type": "keyValues",
                        "apiVersion": "2020-07-01-preview",
                        "dependsOn": [
                            "[parameters('configStoreName')]"
                        ],
                        "properties": {
                            "value": "Hello World!",
                            "contentType": "the-content-type",
                            "tags": {
                                "tag1": "tag-value-1",
                                "tag2": "tag-value-2"
                            }
                        }
                    }
                ]
            }
        ],
        "outputs": {
            "reference-value": {
                "value": "[reference(resourceId('Microsoft.AppConfiguration/configurationStores/keyValues', parameters('configStoreName'), parameters('keyValueName')), '2020-07-01-preview').value]",
                "type": "string"
            }
        }
    }
   ```

1. In your PowerShell window, run the following command to deploy the App Configuration store. Don't forget to replace `<path to appconfig.json>` with actual value.

   ```azurepowershell
   New-AzResourceGroupDeployment `
       -ResourceGroupName $resourceGroup `
       -TemplateFile "<path to appconfig.json>"
   ```

Congratulations! You've deployed an App Configuration store with one key-value inside.

### Set key-values using the ARM template

In the above template, there are two resource types.

1. `Microsoft.AppConfiguration/configurationStores` for creating the App Configuration store.
1. `Microsoft.AppConfiguration/configurationStores/keyValues` for setting key-values to the App Configuration store.

In an App Configuration store, each key-value is uniquely identified by its key and label combination. In ARM template, each key-value is represented by a single `Microsoft.AppConfiguration/configurationStores/keyValues` resource, whose name is a combination of key and label. The key and label are joined by delimiter `$`. Label is optional.

In the above template, the key-value name is `myKey$myLabel`, which means the key is `myKey` and the label is `myLabel`. To create a key-value without a label, the key-value name shall be like `myKey`.

To include non-ASCII characters or ARM resource name reserved characters in the key or label, percent-encoding, also known as URL encoding, is supported. `%` is not allowed in ARM resource name. So, `~` is used as the encoding character.

1. Encoding character `~` can be encoded as `~7E`.
2. Delimiter `$` can be encoded as `~24`.
3. One example of non-ASCII characters is `𝄞`, which can be encoded as `~F0~9D~84~9E`.

For example, to create a key-value pair with key as `AppName:DbEndpoint` and label as `Test`, the resource name should be `AppName~3ADbEndpoint$Test`.

### Reference key-values in the ARM template

ARM template function `reference` is supported by App Configuration service. In the `outputs` section of the above template, resource id of the key-value is passed to the `reference` function, which returns the key-value object from the App Configuration store.

> [!WARNING]
> ARM templates can't set or reference key-values in an App Configuration store that has Private Link enabled.

## Clean up resources

If you aren't going to use the created resource group and configuration store, delete them by running the following cmdlet:

```azurepowershell-interactive
Remove-AzResourceGroup `
  -Name $resourceGroup
```

## Next steps

To learn about creating an application with Azure App Configuration, continue to the following article:

> [!div class="nextstepaction"]
> [Quickstart: Create an ASP.NET Core app with Azure App Configuration](quickstart-aspnet-core-app.md)

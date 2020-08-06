---
title: ARM template for creating App Configuration store
titleSuffix: Azure App Configuration
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
                    // Add multiple key-values to the new App Configuration store by defining additional keyValues resources here.
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

1. In your PowerShell window, run the following command to deploy the App Configuration store. Replace `<path to appconfig.json>` with actual value.

   ```azurepowershell
   New-AzResourceGroupDeployment `
       -ResourceGroupName $resourceGroup `
       -TemplateFile "<path to appconfig.json>"
   ```

You've deployed a new App Configuration store with a single key-value inside.

### Set key-values using the ARM template

In the above template, there are two resource types.

- `Microsoft.AppConfiguration/configurationStores` for creating the App Configuration store.
- `Microsoft.AppConfiguration/configurationStores/keyValues` for creating key-values inside the App Configuration store.

In an ARM template, each key-value is represented by a single `Microsoft.AppConfiguration/configurationStores/keyValues` resource. The `keyValues` resource's name is a combination of key and label. The key and label are joined by the `$` delimiter. The label is optional.

In the above template, the key-value resource name is `myKey$myLabel`. This means the key is `myKey` and the label is `myLabel`. To create a key-value without a label, use a key-value resource name of `myKey`.

Percent-encoding, also known as URL encoding, allows keys or labels to include characters that are not allowed in ARM template resource names. `%` is not an allowed character either, so `~` is used in its place. To correctly encode a name, follow these steps:

1. Apply URL encoding
2. Replace `~` with `~7E`
3. Replace `%` with `~`

For example, to create a key-value pair with key name `AppName:DbEndpoint` and label name `Test`, the resource name should be `AppName~3ADbEndpoint$Test`.

### Reference key-values in the ARM template

The ARM template function `reference` is supported by App Configuration. In the `outputs` section of the above template, the resource ID of the key-value is passed to the `reference` function, which returns the key-value object from the App Configuration store.

> [!WARNING]
> As the ARM template is executed outside of your virtual network, it will not be allowed to set or reference key-values in an App Configuration store that has Private Endpoint enabled but without allowing public network access.

## Clean up resources

If you aren't going to use the created resource group and App Configuration store, delete them by running the following cmdlet:

```azurepowershell-interactive
Remove-AzResourceGroup `
  -Name $resourceGroup
```

## Next steps

To learn about creating an application with Azure App Configuration, continue to the following article:

> [!div class="nextstepaction"]
> [Quickstart: Create an ASP.NET Core app with Azure App Configuration](quickstart-aspnet-core-app.md)

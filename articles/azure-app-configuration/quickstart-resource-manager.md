---
title: Automated VM deployment with Azure App Configuration quickstart
description: This quickstart demonstrates how to use the Azure PowerShell module and Azure Resource Manager templates to deploy an Azure App Configuration store. Then use the values in the store to deploy a VM.
author: lisaguthrie
ms.author: lcozzens
ms.date: 08/11/2020
ms.topic: quickstart
ms.service: azure-app-configuration
ms.custom: [mvc, subject-armqs]
---

# Quickstart: Automated VM deployment with App Configuration and Resource Manager template (ARM template)

Learn how to use Azure Resource Manager templates and Azure PowerShell to deploy an Azure App Configuration store, how to add key-values into the store, and how to use the key-values in the store to deploy an Azure resource, like an Azure virtual machine in this example.

[!INCLUDE [About Azure Resource Manager](../../includes/resource-manager-quickstart-introduction.md)]

If your environment meets the prerequisites and you're familiar with using ARM templates, select the **Deploy to Azure** button. The template will open in the Azure portal.

[![Deploy to Azure](../media/template-deployments/deploy-to-azure.svg)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2F101-app-configuration-store%2Fazuredeploy.json)

## Prerequisites

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Review the templates

The templates used in this quickstart are from [Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/). The [first template](https://azure.microsoft.com/resources/templates/101-app-configuration-store/) creates an App Configuration store:

:::code language="json" source="~/quickstart-templates/101-app-configuration-store/azuredeploy.json" range="1-37" highlight="27-35":::

One Azure resource is defined in the template:

- [Microsoft.AppConfiguration/configurationStores](/azure/templates/microsoft.appconfiguration/2019-10-01/configurationstores): create an App Configuration store.

The [second template](https://azure.microsoft.com/resources/templates/101-app-configuration/) creates a virtual machine by using the key-values in the store. Before this step, you need to add key-values by using the portal or Azure CLI.

:::code language="json" source="~/quickstart-templates/101-app-configuration/azuredeploy.json" range="1-217" highlight="77, 181,189":::

## Deploy the templates

### Create an App Configuration store

1. Select the following image to sign in to Azure and open a template. The template creates an App Configuration store.

    [![Deploy to Azure](../media/template-deployments/deploy-to-azure.svg)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2F101-app-configuration-store%2Fazuredeploy.json)

1. Select or enter the following values.

    - **subscription**: select the Azure subscription used to create the App Configuration store.
    - **Resource group**: select **Create new** to create a new resource group unless you want to use an existing resource group.
    - **Region**: select a location for the resource group.  For example, **East US**.
    - **Config Store Name**: enter a new App Configuration store name.
    - **Location**: specify the location of the App Configuration store.  Use the default value.
    - **Sku Name**: specify the SKU name of the App Configuration store. Use the default value.

1. Select **Review + create**.
1. Verify that the page shows **Validation Passed**, and then select **Create**.

Make a note of the resource group name and the App Configuration store name.  You need these values when you deploy the virtual machine
### Add VM configuration key-values

After you have created an App Configuration store, you can use the Azure portal or Azure CLI to add key-values to the store.

1. Sign in to the [Azure portal](https://portal.azure.com), and then navigate to the newly created App Configuration store.
1. Select **Configuration explorer** from the left menu.
1. Select **Create** to add the following key-value pairs:

   |Key|Value|Label|
   |-|-|-|
   |windowsOsVersion|2019-Datacenter|template|
   |diskSizeGB|1023|template|

   Keep **Content Type** empty.

To use Azure CLI, see [Work with key-values in an Azure App Configuration store](./scripts/cli-work-with-keys.md).

### Deploy VM using stored key-values

Now that you've added key-values to the store, you're ready to deploy a VM using an Azure Resource Manager template. The template references the **windowsOsVersion** and **diskSizeGB** keys you created.

> [!WARNING]
> ARM templates can't reference keys in an App Configuration store that has Private Link enabled.

1. Select the following image to sign in to Azure and open a template. The template creates a virtual machine using stored key-values in the App Configuration store.

    [![Deploy to Azure](../media/template-deployments/deploy-to-azure.svg)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2F101-app-configuration%2Fazuredeploy.json)

1. Select or enter the following values.

    - **subscription**: select the Azure subscription used to create the virtual machine.
    - **Resource group**: either specify the same resource group as the App Configuration store, or select **Create new** to create a new resource group.
    - **Region**: select a location for the resource group.  For example, **East US**.
    - **Location**: specify the location of the virtual machine. use the default value.
    - **Admin Username**: specify an administrator username for the virtual machine.
    - **Admin Password**: specify an administrator password for the virtual machine.
    - **Domain Name Label**: specify a unique domain name.
    - **Storage Account Name**: specify a unique name for a storage account associated with the virtual machine.
    - **App Config Store Resource Group**: specify the resource group that contains your App Configuration store.
    - **App Config Store Name**: specify the name of your Azure App Configuration store.
    - **VM Sku Key**: specify **windowsOsVersion**.  This is the key value name that you added to the store.
    - **Disk Size Key**: specify **diskSizeGB**. This is the they key value name that you added to the store.

1. Select **Review + create**.
1. Verify that the page shows **Validation Passed**, and then select **Create**.

## Review deployed resources

1. Sign in to the [Azure portal](https://portal.azure.com), and then navigate to the newly created virtual machine.
1. Select **Overview** from the left menu, and verify the **SKU** is **2019-Datacenter**.
1. Select **Disks** from the left menu, and verify the size of the data disk is **2013**.

## Clean up resources

When no longer needed, delete the resource group, the App Configuration store, VM, and all related resources. If you're planning to use the App Configuration store or VM in future, you can skip deleting it. If you aren't going to continue to use this job, delete all resources created by this quickstart by running the following cmdlet:

```azurepowershell-interactive
Remove-AzResourceGroup `
  -Name $resourceGroup
```

## Next steps

In this quickstart, you deployed a VM using an Azure Resource Manager template and key-values from Azure App Configuration.

To learn about creating other applications with Azure App Configuration, continue to the following article:

> [!div class="nextstepaction"]
> [Quickstart: Create an ASP.NET Core app with Azure App Configuration](quickstart-aspnet-core-app.md)

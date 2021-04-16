---
title: 'Quickstart: Create an Azure DNS zone and record - Azure Resource Manager template (ARM template)'
titleSuffix: Azure DNS
description: Learn how to create a DNS zone and record in Azure DNS. This is a step-by-step quickstart to create and manage your first DNS zone and record using Azure Resource Manager template (ARM template).
services: dns
author: duongau
ms.author: duau
ms.date: 09/8/2020
ms.topic: quickstart
ms.service: dns
ms.custom:
  - subject-armqs
  - mode-arm
#Customer intent: As an administrator or developer, I want to learn how to configure Azure DNS using Azure ARM template so I can use Azure DNS for my name resolution.
---

# Quickstart: Create an Azure DNS zone and record using an ARM template

This quickstart describes how to use an Azure Resource Manager template (ARM Template) to create a DNS zone with an `A` record in it.

[!INCLUDE [About Azure Resource Manager](../../includes/resource-manager-quickstart-introduction.md)]

If your environment meets the prerequisites and you're familiar with using ARM templates, select the **Deploy to Azure** button. The template will open in the Azure portal.

[![Deploy to Azure](../media/template-deployments/deploy-to-azure.svg)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2F101-azure-dns-new-zone%2Fazuredeploy.json)

## Prerequisites

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Review the template

The template used in this quickstart is from [Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/101-azure-dns-new-zone).

In this quickstart, you'll create a unique DNS zone with a suffix of `azurequickstart.org`. An `A` record pointing to two IP addresses will also be placed in the zone.

:::code language="json" source="~/quickstart-templates/101-azure-dns-new-zone/azuredeploy.json":::

Two Azure resources have been defined in the template:

- [**Microsoft.Network/dnsZones**](/azure/templates/microsoft.network/dnsZones)
- [**Microsoft.Network/dnsZones/A**](/azure/templates/microsoft.network/dnsZones/A): Used to create an `A` record in the zone.

To find more templates that are related to Azure Traffic Manager, see [Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/?resourceType=Microsoft.Network&pageNumber=1&sort=Popular).

## Deploy the template

1. Select **Try it** from the following code block to open Azure Cloud Shell, and then follow the instructions to sign in to Azure.

    ```azurepowershell-interactive
    $projectName = Read-Host -Prompt "Enter a project name that is used for generating resource names"
    $location = Read-Host -Prompt "Enter the location (i.e. centralus)"
    $templateUri = "https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/101-azure-dns-new-zone/azuredeploy.json"

    $resourceGroupName = "${projectName}rg"

    New-AzResourceGroup -Name $resourceGroupName -Location "$location"
    New-AzResourceGroupDeployment -ResourceGroupName $resourceGroupName -TemplateUri $templateUri

    Read-Host -Prompt "Press [ENTER] to continue ..."
    ```

    Wait until you see the prompt from the console.

1. Select **Copy** from the previous code block to copy the PowerShell script.

1. Right-click the shell console pane and then select **Paste**.

1. Enter the values.

    The template deployment creates a zone with one `A` record pointing to two IP addresses. The resource group name is the project name with **rg** appended.

    It takes a couple seconds to deploy the template. When completed, the output is similar to:

    :::image type="content" source="./media/dns-getstarted-template/create-dns-zone-powershell-output.png" alt-text="Azure DNS zone Resource Manager template PowerShell deployment output":::

Azure PowerShell is used to deploy the template. In addition to Azure PowerShell, you can also use the Azure portal, Azure CLI, and REST API. To learn other deployment methods, see [Deploy templates](../azure-resource-manager/templates/deploy-portal.md).

## Validate the deployment

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Select **Resource groups** from the left pane.

1. Select the resource group that you created in the previous section. The default resource group name is the project name with **rg** appended.

1. The resource group should contain the following resources seen here:

    :::image type="content" source="./media/dns-getstarted-template/resource-group-dns-zone.png" alt-text="DNS zone deployment resource group":::

1. Select the DNS zone with the suffix of `azurequickstart.org` to verify that the zone is created properly with an `A` record referencing the value of `1.2.3.4` and `1.2.3.5`.

    :::image type="content" source="./media/dns-getstarted-template/dns-zone-overview.png" alt-text="DNS zone deployment":::

1. Copy one of the name server names from the previous step.

1. Open a command prompt, and run the following command:

   ```cmd
   nslookup www.<dns zone name> <name server name>
   ```

   For example:

   ```cmd
   nslookup www.2lwynbseszpam.azurequickstart.org ns1-09.azure-dns.com.
   ```

   You should see something like the following screenshot:

    :::image type="content" source="./media/dns-getstarted-template/dns-zone-validation.png" alt-text="DNS zone nslookup":::

The host name `www.2lwynbseszpam.azurequickstart.org` resolves to `1.2.3.4` and `1.2.3.5`, just as you configured it. This result verifies that name resolution is working correctly.

## Clean up resources

When you no longer need the resources that you created with the DNS zone, delete the resource group. This removes the DNS zone and all the related resources.

To delete the resource group, call the `Remove-AzResourceGroup` cmdlet:

```azurepowershell-interactive
Remove-AzResourceGroup -Name <your resource group name>
```

## Next steps

In this quickstart, you created a:

- DNS zone
- `A` record

Now that you've created your first DNS zone and record using an ARM template, you can create records for a web app in a custom domain.

> [!div class="nextstepaction"]
> [Create DNS records for a web app in a custom domain](./dns-web-sites-custom-domain.md)

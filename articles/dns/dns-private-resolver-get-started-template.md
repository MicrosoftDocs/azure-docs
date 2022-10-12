---
title: 'Quickstart: Create an Azure DNS Private resolver - Azure Resource Manager template (ARM template)'
titleSuffix: Azure DNS Private resolver
description: Learn how to create Azure DNS private resolver. This article is a step-by-step quickstart to create and manage your first Azure DNS private resolver using Azure Resource Manager template (ARM template).
services: dns
author: aarunraaj
ms.author: arselvar
ms.date: 10/07/2022
ms.topic: quickstart
ms.service: dns
ms.custom: devx-track-azurepowershell, subject-armqs, mode-arm
#Customer intent: As an administrator or developer, I want to learn how to create Azure DNS private resolver using ARM template so I can use Azure DNS private resolver as forwarder..
---

# Quickstart: Create an Azure DNS Private Resolver using an ARM template

This quickstart describes how to use an Azure Resource Manager template (ARM template) to create Azure DNS private resolver.

[!INCLUDE [About Azure Resource Manager](../../includes/resource-manager-quickstart-introduction.md)]

If your environment meets the prerequisites and you're familiar with using ARM templates, select the **Deploy to Azure** button. The template will open in the Azure portal.

[![Deploy to Azure](../media/template-deployments/deploy-to-azure.svg)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fquickstarts%2Fmicrosoft.network%2Fazure-dns-private-resolver%2Fazuredeploy.json)

## Prerequisites

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Review the template

The template used in this quickstart is from [Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/azure-dns-private-resolver).

This template is configured to create a:

- Virtual network
- DNS resolver
- Inbound & outbound endpoints
- Forwarding Rules & rulesets.

:::code language="bicep" source="~/quickstart-templates/quickstarts/microsoft.network/azure-dns-private-resolver/azuredeploy.json":::

Three resources have been defined in this template:

- [**Microsoft.Network/virtualnetworks**](/azure/templates/microsoft.network/virtualnetworks)
- [**Microsoft.Network/dnsresolvers**]()
- [**Microsoft.Network/dnsForwardingRulesets**]()

## Deploy the template

# [CLI](#tab/CLI)

````azurecli-interactive
read -p "Enter the location: " location
resourceGroupName="exampleRG"
templateUri="https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/quickstarts/microsoft.network/azure-dns-private-resolver/azuredeploy.json"

az group create \
--name $resourceGroupName \
--locataion $location

az deployment group create \
--resource-group $resourceGroupName \
--template-uri $templateUri
````

# [PowerShell](#tab/PowerShell)
````azurepowershell-interactive
$location = Read-Host -Prompt "Enter the location: "
$templateUri = "https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/quickstarts/microsoft.network/azure-dns-private-resolver/azuredeploy.json"

$resourceGroupName = "exampleRG"

New-AzResourceGroup -Name $resourceGroupName -Location $location
New-AzResourceGroupDeployment -ResourceGroupName $resourceGroupName -TemplateUri $templateUri
````
---

## Validate the deployment

1. Sign in to the [Azure portal](https://portal.azure.com)

1. Select **Resource groups** from the left pane.

1. Select the resource group that you created in the previous section.

1. The resource group should contain the following resources:

    :::image type="content" source="./media/dns-resolver-getstarted-template/dns-resolver-resource-group.png" alt-text="DNS private resolver deployment resource group":::

1. Select the DNS private resolver service to verify the provisioning and current state.

    :::image type="content" source="./media/dns-resolver-getstarted-template/resolver-page.png" alt-text="Azure DNS private resolver":::

1. Select the Inbound Endpoints and Outbound Endpoints to verify that the endpoints are created and the outbound endpoint is associated with the forwarding ruleset.

    :::image type="content" source="./media/dns-resolver-getstarted-template/resolver-inbound-endpoint.png" alt-text="DNS private resolver inbound endpoint":::

    :::image type="content" source="./media/dns-resolver-getstarted-template/resolver-outbound-endpoint.png" alt-text="DNS private resolver outbound endpoint":::

1. Select the **Associated ruleset** from the outbound endpoint page to verify the forwarding ruleset and rules creation.

    :::image type="content" source="./media/dns-resolver-getstarted-template/resolver-forwarding-rule.png" alt-text="DNS private resolver forwarding rulesets":::

1. Verify the resolver Virtual network is linked with forwarding ruleset.

    :::image type="content" source="./media/dns-resolver-getstarted-template/resolver-vnet-link.png" alt-text="DNS private resolver VNET link":::

## Next steps

In this quickstart, you created a virtual network and DNS private resolver. Now configure name resolution for Azure and on-premises domains
- [Resolve Azure and on-premises domains](private-resolver-hybrid-dns.md)
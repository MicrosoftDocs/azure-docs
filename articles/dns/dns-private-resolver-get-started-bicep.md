---
title: 'Quickstart: Create an Azure DNS Private resolver - Bicep'
titleSuffix: Azure DNS Private resolver
description: Learn how to create Azure DNS private resolver. This is a step-by-step quickstart to create and manage your first Azure DNS private resolver using Bicep.
services: dns
author: arunraj-selvaraj
ms.author: aarunraaj
ms.date: 10/07/2022
ms.topic: quickstart
ms.service: dns
ms.custom: devx-track-azurepowershell, subject-armqs, mode-arm
#Customer intent: As an administrator or developer, I want to learn how to create Azure DNS private resolver using Bicep so I can use Azure DNS private resolver as forwarder.
---

# Quickstart: Create an Azure DNS Private Resolver using Bicep

This quickstart describes how to use Bicep to create Azure DNS private resolver.

[!INCLUDE [About Bicep](../../includes/resource-manager-quickstart-bicep-introduction.md)]

## Prerequisites

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Review the Bicep file

The Bicep file used in this quickstart is from [Azure Quickstart Templates](https://azure.microsoft.com/en-us/resources/templates/azure-dns-private-resolver).

This Bicep file is configured to create a:

- Virtual network
- DNS resolver
- Inbound & outbound endpoints
- Forwarding Rules & rulesets.

:::code language="bicep" source="~/quickstart-templates/quickstarts/microsoft.network/azure-dns-private-resolver/main.bicep":::

Three resources defined in this Bicep file:

- [**Microsoft.Network/virtualnetworks**](/azure/templates/microsoft.network/virtualnetworks)
- [**Microsoft.Network/dnsresolvers**]()
- [**Microsoft.Network/dnsForwardingRulesets**]()

## Deploy the Bicep file

1. Save the Bicep file as **main.bicep** to your local computer.
2. Deploy the Bicep file using either Azure CLI or Azure PowerShell

# [CLI](#tab/CLI)

````azurecli
az group create --name exampleRG --location eastus
az deployment group create --resource-group exampleRG --template-file main.bicep
````

# [PowerShell](#tab/PowerShell)

````azurepowershell
New-AzResourceGroup -Name exampleRG -Location eastus
New-AzResourceGroupDeployment -ResourceGroupName exampleRG -TemplateFile ./main.bicep
````

---

When the deployment finishes, you should see a message indicating the deployment succeeded.

## Validate the deployment

Use the Azure portal, Azure CLI, or Azure PowerShell to list the deployed resources in the resource group.

# [CLI](#tab/CLI)

```azurecli-interactive
az resource list --resource-group exampleRG
```

# [PowerShell](#tab/PowerShell)

```azurepowershell-interactive
Get-AzResource -ResourceGroupName exampleRG
```

---

## Clean up resources

When no longer needed, use the Azure portal, Azure CLI, or Azure PowerShell to delete the resources in the following order.

### Delete the DNS resolver

# [PowerShell](#tab/PowerShell)
```azurepowershell
#Delete the inbound endpoint
Remove-AzDnsResolverInboundEndpoint -Name myinboundendpoint -DnsResolverName mydnsresolver -ResourceGroupName myresourcegroup

#Delete the virtual network link
Remove-AzDnsForwardingRulesetVirtualNetworkLink -DnsForwardingRulesetName $dnsForwardingRuleset.Name -Name vnetlink -ResourceGroupName myresourcegroup

#Delete the DNS forwarding ruleset
Remove-AzDnsForwardingRuleset -Name $dnsForwardingRuleset.Name -ResourceGroupName myresourcegroup

#Delete the outbound endpoint
Remove-AzDnsResolverOutboundEndpoint -DnsResolverName mydnsresolver -ResourceGroupName myresourcegroup -Name myoutboundendpoint

#Delete the DNS resolver
Remove-AzDnsResolver -Name mydnsresolver -ResourceGroupName myresourcegroup
````
---

## Next steps
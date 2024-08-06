---
title: Create a custom IPv4 address prefix - Azure portal
titleSuffix: Azure Virtual Network
description: Learn how to onboard a custom IP address prefix using the Azure portal
author: mbender-ms
ms.author: mbender
ms.service: azure-virtual-network
ms.subservice: ip-services
ms.topic: how-to
maims.date: 08/05/2024
---

# Create a custom IPv4 address prefix using the Azure portal

In this article, you learn how to create a custom IPv4 address prefix using the Azure portal. You prepare a range to provision, provision the range for IP allocation, and enable the range advertisement by Microsoft.

A custom IPv4 address prefix enables you to bring your own IPv4 ranges to Microsoft and associate it to your Azure subscription. You maintain ownership of the range while Microsoft would be permitted to advertise it to the Internet. A custom IP address prefix functions as a regional resource that represents a contiguous block of customer owned IP addresses.

[!INCLUDE [ip-services-custom-ip-global-regional-unified-model](../../../includes/ip-services-custom-ip-global-regional-unified-model.md)]

## Prerequisites

# [Azure portal](#tab/azureportal)

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- A customer owned IPv4 range to provision in Azure.
    - A sample customer range (1.2.3.0/24) is used for this example. This range isn't validated in Azure so replace the example range with yours.

> [!NOTE]
> For problems encountered during the provisioning process, please see [Troubleshooting for custom IP prefix](manage-custom-ip-address-prefix.md#troubleshooting-and-faqs).

# [Azure CLI](#tab/azurecli/)

[!INCLUDE [azure-cli-prepare-your-environment-no-header.md](~/reusable-content/azure-cli/azure-cli-prepare-your-environment-no-header.md)]

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- This tutorial requires version 2.28 or later of the Azure CLI (you can run az version to determine which you have). If using Azure Cloud Shell, the latest version is already installed.
- Sign in to Azure CLI and select the subscription you want to use with `az account`.
- A customer owned IPv4 range to provision in Azure.
    - A sample customer range (1.2.3.0/24) is used for this example. This range isn't validated in Azure so replace the example range with yours.

> [!NOTE]
> For problems encountered during the provisioning process, please see [Troubleshooting for custom IP prefix](manage-custom-ip-address-prefix.md#troubleshooting-and-faqs).

# [Azure PowerShell](#tab/azurepowershell/)

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- Azure PowerShell installed locally or Azure Cloud Shell.
- Sign in to Azure PowerShell and select the subscription to use with this feature. For more information, see [Sign in with Azure PowerShell](/powershell/azure/authenticate-azureps).
- Ensure your `Az.Network` module is 5.1.1 or later. To verify the installed module, use the command `Get-InstalledModule -Name "Az.Network"`. If the module requires an update, use the command `Update-Module -Name "Az.Network"` if necessary.
- A customer owned IPv4 range to provision in Azure.
    - A sample customer range (1.2.3.0/24) is used for this example. This range isn't validated in Azure so replace the example range with yours.

If you choose to install and use PowerShell locally, this article requires the Azure PowerShell module version 5.4.1 or later. Run `Get-Module -ListAvailable Az` to find the installed version. If you need to upgrade, see [Install Azure PowerShell module](/powershell/azure/install-azure-powershell). If you're running PowerShell locally, you also need to run `Connect-AzAccount` to create a connection with Azure.

> [!NOTE]
> For problems encountered during the provisioning process, please see [Troubleshooting for custom IP prefix](manage-custom-ip-address-prefix.md#troubleshooting-and-faqs).

---

## Pre-provisioning steps

[!INCLUDE [ip-services-pre-provisioning-steps](../../../includes/ip-services-pre-provisioning-steps.md)]


## Provisioning and Commissioning a Custom IPv4 Prefix

# [Azure portal](#tab/azureportal)

# [Azure CLI](#tab/azurecli)

# [Azure PowerShell](#tab/azurepowershell/)

---

[!INCLUDE [ip-services-provision-ipv4-portal](../../../includes/ip-services-provision-ipv4-portal.md)]

[!INCLUDE [ip-services-provision-ipv4-cli](../../../includes/ip-services-provision-ipv4-cli.md)]

[!INCLUDE [ip-services-provision-ipv4-powershell](../../../includes/ip-services-provision-ipv4-powershell.md)]

---
## Next steps

- To learn about scenarios and benefits of using a custom IP prefix, see [Custom IP address prefix (BYOIP)](custom-ip-address-prefix.md).

- For more information on managing a custom IP prefix, see [Manage a custom IP address prefix (BYOIP)](manage-public-ip-address-prefix.md).
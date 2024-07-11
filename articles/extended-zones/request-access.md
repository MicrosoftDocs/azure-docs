---
title: Request access to Azure Extended Zones
description: Learn how to request and gain access to Azure Extended Zone using PowerShell or Azure CLI.
author: halkazwini
ms.author: halkazwini
ms.service: azure
ms.topic: how-to
ms.date: 07/11/2024

---

# Request access to Azure Extended Zones

> [!IMPORTANT]
> Azure Extended Zones service is currently in PREVIEW.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

In this article, you learn how to request and gain access to Azure Extended Zone using PowerShell or Azure CLI.

## Prerequisites

# [**PowerShell**](#tab/powershell)

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- Azure Cloud Shell or Azure PowerShell.

    The steps in this article run the Azure PowerShell cmdlets interactively in [Azure Cloud Shell](/azure/cloud-shell/overview). To run the cmdlets in the Cloud Shell, select **Open Cloud Shell** at the upper-right corner of a code block. Select **Copy** to copy the code and then paste it into Cloud Shell to run it. You can also run the Cloud Shell from within the Azure portal.

    You can also [install Azure PowerShell locally](/powershell/azure/install-azure-powershell) to run the cmdlets. This article requires the [Az.EdgeZones](/powershell/module/az.edgezones) module version 0.1.0 or later. Run [Get-Module -ListAvailable Az.EdgeZones](/powershell/module/microsoft.powershell.core/get-module) to find the installed version. Run [Install-Module -Name Az.EdgeZones](/powershell/module/powershellget/install-module) to install Az.EdgeZones module. If you run PowerShell locally, sign in to Azure using the [Connect-AzAccount](/powershell/module/az.accounts/connect-azaccount) cmdlet.

# [**Azure CLI**](#tab/cli)

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- Azure Cloud Shell or Azure CLI.

    The steps in this article run the Azure CLI commands interactively in [Azure Cloud Shell](/azure/cloud-shell/overview). To run the commands in the Cloud Shell, select **Open Cloud Shell** at the upper-right corner of a code block. Select **Copy** to copy the code, and paste it into Cloud Shell to run it. You can also run the Cloud Shell from within the Azure portal.

    You can also [install Azure CLI locally](/cli/azure/install-azure-cli) to run the commands. This article requires the [edgezones](/cli/azure/edge-zones) extension for Azure CLI version 2.57.0 or higher. Run [az --version](/cli/azure/reference-index#az-version) command to find the installed version. If you run Azure CLI locally, sign in to Azure using the [az login](/cli/azure/reference-index#az-login) command.


---


## Sign in to Azure

Sign in to the [Azure portal](https://portal.azure.com) with your Azure account.



## Related content

- [Deploy a virtual machine in an Extended Zone](deploy-vm-portal.md)
- [Deploy an AKS cluster in an Extended Zone](deploy-aks-cluster.md)
- [Frequently asked questions](faq.md)

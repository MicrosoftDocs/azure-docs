---
title: Connect to Azure Government with PowerShell
description: Information on connecting to your subscription in Azure Government with PowerShell
ms.service: azure-government
ms.topic: quickstart
ms.workload: azure-government
ms.custom: devx-track-azurepowershell, mode-api
ms.date: 12/07/2021
---

# Quickstart: Connect to Azure Government with PowerShell

Microsoft Azure Government delivers a dedicated cloud with world-class security and compliance, enabling US government agencies and their partners to transform their workloads to the cloud. To manage your Azure Government cloud workloads and applications you can connect to Azure Government using different tools, as described in the following video.

</br>

> [!VIDEO https://www.youtube.com/embed/Q3kx4cmRkCA]

This quickstart shows how to use PowerShell to access and start managing resources in Azure Government. If you don't have an Azure Government subscription, create a [free account](https://azure.microsoft.com/global-infrastructure/government/request/) before you begin.

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

## Prerequisites

- Review [Guidance for developers](./documentation-government-developer-guide.md).<br/> This article discusses Azure Government's unique URLs and endpoints for managing your environment. You must know about these endpoints in order to connect to Azure Government. 
- Review [Compare Azure Government and global Azure](./compare-azure-government-global-azure.md) and click on a service of interest to see variations between Azure Government and global Azure.

## Install PowerShell

Install PowerShell on your local machine. For more information, including how to check your PowerShell version, see [Install the Azure Az PowerShell module](/powershell/azure/install-az-ps).

## Specifying Azure Government as the *environment* to connect to

When you start PowerShell, you have to tell Azure PowerShell to connect to Azure Government by specifying an environment parameter. The parameter ensures that PowerShell is connecting to the correct endpoints. The collection of endpoints is determined when you log in to your account. Different APIs require different versions of the environment switch.

```powershell
Connect-AzAccount -EnvironmentName AzureUSGovernment
```

</br>

When you get prompted to sign in, enter your email address for the Azure Government environment.

<br>

![Connect to Azure Government](./media/connect-with-powershell/connect-with-powershell.png)

## Get current regions 

To list the available regions in Azure Government, run the following commands and print the current list:

```powershell
Get-AzLocation

Get-AzureLocation # For classic deployment model 
```

> [!NOTE]
> The Azure Government region display names have no spaces between `US` and `Gov` or `US` and `DoD` when using the `Location` parameter.

| Common Name | Display Name | Location Name |
| --- | --- | --- |
| US Gov Virginia |`USGov Virginia` | `usgovvirginia` |
| US Gov Texas |`USGov Texas` | `usgovtexas` |
| US Gov Arizona |`USGov Arizona` | `usgovarizona` |
| US DoD East |`USDoD East` | `usdodeast` |
| US DoD Central |`USDoD Central` | `usdodcentral` |

## Next steps

This quickstart showed you how to use PowerShell to connect to Azure Government. Once you are connected to Azure Government, you may want to explore Azure services. Make sure you check out the feature variations and usage limitations, described in [Compare Azure Government and global Azure](./compare-azure-government-global-azure.md). To learn more about Azure services, continue to the Azure documentation.

> [!div class="nextstepaction"]
> [Azure documentation](../index.yml)

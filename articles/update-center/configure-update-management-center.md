---
title: Configure Update management center (preview)
description: The article describes how to enable update management center (preview) for Windows and Linux machines running on Azure and Azure Arc-enabled servers
ms.service: Update-management-center
author: SGSneha
ms.author: v-ssudhir
ms.date: 03/07/2022
ms.topic: conceptual
---

 # How to configure Update management center (preview)

The article describes how to configure Update management center (preview) in Azure for Windows and Linux machines running on Azure or outside of Azure connected to Azure Arc-enabled servers using one of the following methods:

* From the Azure portal
* Using Azure PowerShell
* Using the Azure CLI
* Using the Azure REST API

To enable update management center (preview) functionality, you must register the various feature resource providers in your Azure subscription, as detailed below. After registering for (preview) features, you need to access (preview) link: **https://aka.ms/umc-preview**

## Prerequisites

* Azure subscription. If you don't have one yet, you can [activate your MSDN subscriber benefits](https://azure.microsoft.com/pricing/member-offers/msdn-benefits-details/) or sign up for a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

* Your account must be a member of the Azure [Owner](/azure/role-based-access-control/built-in-roles#owner) or [Contributor](/azure/role-based-access-control/built-in-roles#contributor) role in the subscription.

* One or more [Azure virtual machines](/azure/virtual-machines), or physical or virtual machines managed by [Arc-enabled servers](/azure/azure-arc/servers/overview).

* Ensure that you meet all [prerequisites for update management center](https://github.com/Azure/update-center-docs/Docs/overview.md#prerequisites)


## Next steps

To troubleshoot, see the [Troubleshoot](troubleshoot.md) update management center (preview).

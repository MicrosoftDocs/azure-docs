---
author: alkohli
ms.service: databox  
ms.topic: include
ms.date: 10/15/2020
ms.author: alkohli
---

Before you begin, make sure that:

* Your Microsoft Azure subscription is enabled for an Azure Stack Edge resource. Make sure that you used a supported subscription such as [Microsoft Enterprise Agreement (EA)](https://azure.microsoft.com/overview/sales-number/), [Cloud Solution Provider (CSP)](https://docs.microsoft.com/partner-center/azure-plan-lp), or [Microsoft Azure Sponsorship](https://azure.microsoft.com/offers/ms-azr-0036p/).
* You have owner or contributor access at resource group level for the Azure Stack Edge/Azure Storage Gateway, IoT Hub, and Azure Storage resources.

  * To create any Azure Stack Edge resource, you should have permissions as a contributor (or higher) scoped at resource group level. You also need to make sure that the `Microsoft.DataBoxEdge` provider is registered. For information on how to register, go to [Register resource provider](azure-stack-edge-j-series-manage-access-power-connectivity-mode.md#register-resource-providers).
  * To create any IoT Hub resource, make sure that Microsoft.Devices provider is registered. For information on how to register, go to [Register resource provider](azure-stack-edge-j-series-manage-access-power-connectivity-mode.md#register-resource-providers).
  * To create a Storage account resource, again you need contributor or higher access scoped at the resource group level. Azure Storage is by default a registered resource provider.
* You have admin or user access to Azure Active Directory Graph API. For more information, see [Azure Active Directory Graph API](https://docs.microsoft.com/previous-versions/azure/ad/graph/howto/azure-ad-graph-api-permission-scopes#default-access-for-administrators-users-and-guest-users-).
* You have your Microsoft Azure storage account with access credentials.


---
ms.service: partner-services
author: vpriyanshi
ms.topic: include
ms.date: 11/17/2023
ms.author: priyverma
---

### Marketplace purchase errors

- **The Microsoft.SaaS RP is not registered on the Azure subscription.**

  - Before you use a resource provider, you must make sure your Azure subscription is registered for the resource provider. Learn more about [Resource provider registration](../../azure-resource-manager/management/resource-providers-and-types.md#register-resource-provider) and [resolving errors on RP registration](../../azure-resource-manager/troubleshooting/error-register-resource-provider.md).

- **Plan cannot be purchased on a free subscription, please upgrade your account.**

  - You cannot make marketplace purchases on a free Azure subscription. Refer to the [Azure free Account FAQ]( https://azure.microsoft.com/free/free-account-faq). For further information, see [purchase SaaS offer in the Azure portal](https://learn.microsoft.com/marketplace/purchase-saas-offer-in-azure-portal#common-error-messages-and-solutions).

- **Purchase has failed because we couldn't find a valid payment method associated with your Azure subscription.**

  - Use a different Azure subscription or add or update current credit card or payment method information for this subscription. For more information, see [purchase SaaS offer in the Azure portal](https://learn.microsoft.com/marketplace/purchase-saas-offer-in-azure-portal#common-error-messages-and-solutions).

- **The Publisher does not make available Offer, Plan in your Subscription/Azure account’s region.**

  - The offer or the specific plan is not available to the billing account market connected to the Azure Subscription. 

- **Enrollment for Azure Marketplace is set to Free/BYOL SKUs only, purchase for Azure product is not allowed. Please contact your enrolment administrator to change EA settings.**

  - Enterprise administrators can disable or enable Azure Marketplace purchases for all Azure subscriptions under their enrollment. For more information, see [Azure Marketplace - Microsoft Cost Management](../../cost-management-billing/manage/ea-azure-marketplace.md#enabling-azure-marketplace-purchases). More information on different listing options is present in [Introduction to listing options](https://learn.microsoft.com/partner-center/marketplace/determine-your-listing-type#Overview)

- **Marketplace is not enabled for the Azure subscription.**

  - Enterprise administrators can disable or enable Azure Marketplace purchases for all Azure subscriptions under their enrollment. Please refer [Azure Marketplace - Microsoft Cost Management](../../cost-management-billing/manage/ea-azure-marketplace.md#enabling-azure-marketplace-purchases).

- **Plan by publisher is not available to you for purchase due to private marketplace settings made by your tenant’s IT administrator.**

  - Customer uses private marketplace to limit the access of its organization to specific offers and plans. The specific offer or the plan were not set up to be available in the tenant's private marketplace. Please contact your tenant’s IT administrator.

- **The EA subscription doesn't allow Marketplace purchases.**
  
  - Use a different subscription or check if your EA subscription is enabled for Marketplace purchase. For more information, see [Enable Marketplace purchases](../../cost-management-billing/manage/ea-azure-marketplace.md#enabling-azure-marketplace-purchases).

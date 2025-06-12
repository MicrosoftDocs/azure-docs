---
author: ProfessorKendrick
ms.topic: include
ms.date: 04/14/2025
ms.author: kkendrick
---

|Error message |Details |
|---------|---------|
|"The Microsoft.SaaS RP is not registered on the Azure subscription."     |Before you use a resource provider, you must make sure that your Azure subscription is registered for it. For more information, see [Register a resource provider](../../azure-resource-manager/management/resource-providers-and-types.md#register-resource-provider) and [Resolve errors for resource provider registration](../../azure-resource-manager/troubleshooting/error-register-resource-provider.md).         |
|"Plan cannot be purchased on a free subscription, please upgrade your account."     |You can't make Azure Marketplace purchases on a free Azure subscription. For more information, see the [Azure free account FAQ]( https://azure.microsoft.com/free/free-account-faq) and [Purchase a SaaS offer in the Azure portal](/marketplace/purchase-saas-offer-in-azure-portal#common-error-messages-and-solutions).         |
|"Purchase has failed because we couldn't find a valid payment method associated with your Azure subscription."    |Use a different Azure subscription, or add or update credit card or payment method information for this subscription. For more information, see [Purchase a SaaS offer in the Azure portal](/marketplace/purchase-saas-offer-in-azure-portal#common-error-messages-and-solutions).         |
|"The Publisher does not make available Offer, Plan in your Subscription/Azure account's region."    |The offer or the specific plan isn't available to the billing account market that's connected to the Azure subscription.          |
|"Enrollment for Azure Marketplace is set to Free/BYOL SKUs only, purchase for Azure product is not allowed. Please contact your enrollment administrator to change EA settings."     |Enterprise administrators can disable or enable Azure Marketplace purchases for all Azure subscriptions under their enrollment. For more information, see [Enabling Azure Marketplace purchases](../../cost-management-billing/manage/ea-azure-marketplace.md#enabling-azure-marketplace-purchases) and [Introduction to listing options](/partner-center/marketplace/determine-your-listing-type#overview).         |
|"Marketplace is not enabled for the Azure subscription."     |Enterprise administrators can disable or enable Azure Marketplace purchases for all Azure subscriptions under their enrollment. For more information, see [Enabling Azure Marketplace purchases](../../cost-management-billing/manage/ea-azure-marketplace.md#enabling-azure-marketplace-purchases).         |
|"Plan by publisher is not available to you for purchase due to private marketplace settings made by your tenant's IT administrator."     |The customer uses a private marketplace to limit the access of its organization to specific offers and plans. The specific offer or the plan wasn't set up to be available in the tenant's private marketplace. Contact your tenant's IT administrator.         |
|"The EA subscription doesn't allow Marketplace purchases."     |Use a different subscription or check if your Enterprise Agreement subscription is enabled for Azure Marketplace purchase. For more information, see [Enabling Azure Marketplace purchases](../../cost-management-billing/manage/ea-azure-marketplace.md#enabling-azure-marketplace-purchases).         |

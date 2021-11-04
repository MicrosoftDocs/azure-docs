---
author: alkohli
ms.service: databox  
ms.topic: include
ms.date: 11/04/2021
ms.author: alkohli
---

Before you begin, make sure that:

* You have your Microsoft Azure storage account with access credentials, such as storage account name and access key.

* The subscription you use for Data Box service is one of the following types:
  * Microsoft Customer Agreement (MCA) for new subscriptions or Microsoft Enterprise Agreement (EA) for existing subscriptions. Read more about [MCA for new subscriptions](https://www.microsoft.com/licensing/how-to-buy/microsoft-customer-agreement) and [EA subscriptions](https://azure.microsoft.com/pricing/enterprise-agreement/).
  * Cloud Solution Provider (CSP). Learn more about [Azure CSP program](/azure/cloud-solution-provider/overview/azure-csp-overview).
    > [!NOTE]
    > This service is not supported for the Azure CSP program in India.
  * Microsoft Azure Sponsorship. Learn more about [Azure sponsorship program](https://azure.microsoft.com/offers/ms-azr-0036p/).
  * Microsoft Partner Network (MPN). Learn more about [Microsoft Partner Network](https://partner.microsoft.com/commercial#).

* Ensure that you have owner or contributor access to the subscription to create a device order.

* If you plan to use a customer-managed key for encryption, you must enable **Get**, **Unwrap Key**, and **Wrap Key** key permissions for the customer-managed key. If these permissions are not set, order creation will fail. The permissions must remain in place for the lifetime of the order. Otherwise, the customer-managed key can't be accessed at the start of the Data Copy phase.<!--Can't find instructions for setting this in Azure Key Vault, although I was able to find the screen where it's set. All docs recommend using role-based access. This is the old way - ACLs?-->

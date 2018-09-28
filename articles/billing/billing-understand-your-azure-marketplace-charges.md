---
title: Understand your Azure external service charges | Microsoft Docs
description: Learn about billing of external services, formerly known as Marketplace, charges in Azure.
services: ''
documentationcenter: ''
author: adpick
manager: tonguyen
editor: ''
tags: billing

ms.assetid: 5e0e2a3c-d111-4054-8508-0c111c1b749b
ms.service: billing
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.date: 06/15/2018
ms.author: cwatson
ms.custom: H1Hack27Feb2017
---
# Understand your Azure billing for external service charges
External services are published by third party software vendors in the Azure marketplace. For example, SendGrid is an external services that you can purchase in Azure, but is not published by Microsoft.

When you provision a new external service or resource, a warning is shown:

![Marketplace purchase warning](./media/billing-understand-your-azure-marketplace-charges/marketplace-warning.PNG)

> [!NOTE]
> External services are published by companies that are not Microsoft, but sometimes Microsoft products are also categorized as external services.
> 
> 

## How external services are billed
- External services are billed separately. They are treated as individual orders within your Azure subscription. The billing period for each service is set when you purchase the service. Not to be confused with the billing period of the subscription under which you purchased it. You also receive separate bills and your credit card is charged separately.
- Each external service has a different billing model. Some services are billed in a pay-as-you-go fashion while others use a monthly based payment model. You need a credit card for Azure external services, you can't buy external services with invoice pay.
- You can't use monthly free credits for external services. If you are using an Azure subscription that includes [free credits](https://azure.microsoft.com/pricing/spending-limits/), they can't be applied to external service bills. Use a credit card to purchase external services.

## View external service spending and history in the Azure portal
You can view a list of the external services that are on each subscription within the [Azure portal](https://portal.azure.com/): 

1. Sign in to the [Azure portal](https://portal.azure.com/) as the account administrator.
2. In the Hub menu, select **Subscriptions**.
   
    ![Select Subscriptions in the Hub menu](./media/billing-understand-your-azure-marketplace-charges/sub-button.png) 
3. In the **Subscriptions** blade, select the subscription that you want to view, and then select **External services**.
   
    ![Select a subscription in the billing blade](./media/billing-understand-your-azure-marketplace-charges/select-sub-external-services.png)
4. You should see each of your external service orders, the publisher name, service tier you bought, name you gave the resource, and the current order status. To see past bills, select an external service.
   
    ![Select an external service](./media/billing-understand-your-azure-marketplace-charges/external-service-blade2.png)
5. From here, you can view past bill amounts including the tax breakdown.
   
    ![View external services billing history](./media/billing-understand-your-azure-marketplace-charges/billing-overview-blade.png)

## View external service spending for Enterprise Agreement (EA) customers
EA customers can see external service spending and download reports in the EA portal. See [Azure Marketplace for EA Customers](https://ea.azure.com/helpdocs/azureMarketplace) to get started.

## Manage payment methods for external service orders
Update your payment methods for external service orders from the [Account Center](https://account.windowsazure.com/).

> [!NOTE]
> If you purchased your subscription with a Work or School account, [contact support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade) to make changes to your payment method.
> 
> 

1. Sign in to the [Account Center](https://account.windowsazure.com/) and [navigate to the **marketplace** tab](https://account.windowsazure.com/Store)
   
    ![Select marketplace in the account center](./media/billing-understand-your-azure-marketplace-charges/select-marketplace.png)
2. Select the external service you want to manage
   
    ![Select the external service you want to manage](./media/billing-understand-your-azure-marketplace-charges/select-ext-service.png)
3. Click **Change payment method** on the right side of the page. This link brings you to a different portal to manage your payment method.
   
    ![Order summary](./media/billing-understand-your-azure-marketplace-charges/change-payment.PNG)
4. Click **Edit info** and follow instructions to update your payment information.
   
    ![Select edit info](./media/billing-understand-your-azure-marketplace-charges/edit-info.png)

## Cancel an external service order
If you want to cancel your external service order, delete the resource in the [Azure portal](https://portal.azure.com).

![Delete Resource](./media/billing-understand-your-azure-marketplace-charges/deleteMarketplaceOrder.PNG)

## Need help? Contact support.
If you still have questions, [contact support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade) to get your issue resolved quickly.


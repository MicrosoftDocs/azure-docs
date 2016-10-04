<properties
	pageTitle="Understand your Azure External Service Charges | Microsoft Azure"
	description="Describes how to understand charges related to your Marketplace orders."
	services=""
	documentationCenter=""
	authors="JiangChen79"
	manager="felixwu"
	editor=""
	tags="billing"
	/>

<tags
	ms.service="billing"
	ms.workload="na"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="08/17/2016"
	ms.author="cjiang"/>

# Understand your Azure External Service Charges

This article explains the billing of external services in Azure. External services used to be called Marketplace orders. External Services are provided by independent service vendors, but are integrated completely within the Azure ecosystem. Learn how to:

- Identify External Services
- Understand how the billing differs from other Azure resources
- View and track any costs you accrue from the use of external services
- Manage external service orders and how you pay for them

## What are Azure external services?

### Identifying external services

When you provision a new resource, the following warning appears when the resource is an external service order:

![Marketplace purchase warning](./media/billing-understand-your-azure-marketplace-charges/marketplace-warning.PNG)

Usually external services are published by companies that are not Microsoft, but sometimes Microsoft products are also categorized as external services.

### External services are billed separately

External services are treated as individual orders within your Azure subscription. The billing period for each service is set when you purchase the service. Not to be confused with the billing period of the subscription under which you purchased it. You also receive separate bills and your credit card is charged separately.

### Payment models

You need a credit card to buy External services. If your subscription uses Invoice pay, you are not able to buy them. Some services are billed in a pay-as-you-go fashion while others use a monthly base payment model.

### Azure free credit and external services

If you are using an azure subscription that includes [free credit](https://azure.microsoft.com/pricing/spending-limits/), this credit can't be applied to external service bills. You must have a credit card associated with your subscription to purchase external services, and this is the card that is charged.

## Viewing your external service spending and history

You can view a list of the external services that are on each subscription within the [Azure portal](https://portal.azure.com/): 

1. Navigate to the Billing blade
   
  

2. Select a subscription
   
![Select a subscription](./media/billing-understand-your-azure-marketplace-charges/external-service-blade.png)

3. Use the External Services command to view each of your external service orders, the publisher name, service tier you bought, name you gave the resource, and the current order status.

![use the external services command](./media/billing-understand-your-azure-marketplace-charges/external-service-command.png)

4. From here, you can view past bill amounts including the tax breakdown.

![view external services billing history](./media/billing-understand-your-azure-marketplace-charges/billing-overview-blade.png)

## How to manage your orders and payments
The summary page in the [Azure Account Center](https://account.windowsazure.com/) has user actions, allowing you to update your payment instrument:

> [AZURE.NOTE] If you are using your organization ID to change personal information, you should log a ticket with support.

To update your payment method click on the **Change payment method** link on the right side of the page.

![Order summary](./media/billing-understand-your-azure-marketplace-charges/order-summary.png)

This link brings you to a different portal where you are able to make changes to your preferred payment method.

To change your payment method, follow these steps:

1. Click **Change how you pay**.

    ![Subscriptions](./media/billing-understand-your-azure-marketplace-charges/subscriptions.jpg)

2. Select the payment method you want to change to. The **Pay with** option allows you to select your credit card. The **Add a new way to pay** option allows you to add a new credit card.

    ![Change payment method](./media/billing-understand-your-azure-marketplace-charges/change-payment-method.jpg)
    
If you want to cancel your external service order, you need to delete the resource in the [Azure portal](https://portal.azure.com).

     ![Delete Resource](./media/billing-understand-your-azure-marketplace-charges/change-payment-method.jpg)

> [AZURE.NOTE] If you still have further questions, [contact support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade) to get your issue resolved quickly.

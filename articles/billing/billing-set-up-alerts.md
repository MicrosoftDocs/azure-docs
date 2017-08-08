---
title: Set up billing or credit alerts for Azure subscriptions | Microsoft Docs
description: Describes how you can set up alerts on your Azure bill so you can avoid billing surprises.
keywords: credit alert,billing alert
services: ''
documentationcenter: ''
author: vikdesai
manager: tonguyen
editor: ''
tags: billing

ms.assetid: 9b7b3eeb-cd9d-4690-86a3-51b1e2a8974f
ms.service: billing
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 02/28/2017
ms.author: vikdesai
ms.custom: H1Hack27Feb2017
---
# Set up billing or credit alerts for your Microsoft Azure subscriptions
If you’re the Account Admin for an Azure subscription, you can use the Azure Billing Alert Service to create customized billing alerts that help you monitor and manage billing activity for your Azure accounts.

This service is in preview, so you need to enable it in the Preview Features page first.

## Set the alert threshold and email recipients
1. Visit [the Preview Features page](https://account.windowsazure.com/PreviewFeatures) and enable **Billing Alert Service**.

1. After you receive the email confirmation that the billing service is turned on for your subscription, visit [the Subscriptions page](https://account.windowsazure.com/Subscriptions) in the account portal. Click the subscription you want to monitor, and then click **Alerts**.

    ![Screenshot of the subscriptions view of Azure Account center, with Alerts highlighted][Image1]

2. Next, click **Add Alert** to create your first one. You can set up a total of five billing alerts per subscription, with a different threshold and up to two email recipients for each alert.

    ![Screenshot of the Alerts view, where you can add alert][Image2]

3. When you add an alert, you give it a unique name, choose a spending threshold, and choose the email addresses where alerts are sent. When setting up the threshold, you can choose either a **Billing Total** or a **Monetary Credit** from the **Alert For** list. For a billing total, an alert is sent when subscription spending exceeds the threshold. For a monetary credit, an alert is sent when monetary credits drop below the limit. Monetary credits usually apply to Free Trial and Visual Studio subscriptions.

    ![Screenshot of the alert addition view, where you can configure recipients][Image3]

Azure supports any email address but doesn't verify that the email address works, so double-check for typos.

## Check on your alerts
After you set up alerts, the Account Center lists them and shows how many more you can set up. For each alert, you see the date and time it was sent, whether it’s an alert for Billing Total or Monetary Credit, and the limit you set up. The date and time format is 24-hour Universal Time Coordinate (UTC) and the date is yyyy-mm-dd format. Click the plus sign for an alert in the list to edit it, or click the trash-can to delete it.

## Billing alerts for Enterprise Agreement (EA) customers
EA customers can get alerts for each department under an enrollment by setting spending quotas. See [Department Spending Quotas](https://ea.azure.com/helpdocs/departmentSpendingQuotas) in the EA portal to get started.

## Learn more about Azure cost management
- Estimate costs using the [pricing calculator](https://azure.microsoft.com/pricing/calculator/), [total cost of ownership calculator](https://aka.ms/azure-tco-calculator), and when you add a service.
- [Review your usage and costs regularly in Azure portal](billing-getting-started.md#costs).
- Turn on [Azure Advisor cost recommendations](../advisor/advisor-cost-recommendations.md).

To learn more, see [Azure cost management guidance](billing-getting-started.md).

[Image1]: ./media/azure-billing-set-up-alerts/billingalert1.png 
[Image2]: ./media/azure-billing-set-up-alerts/billingalert2.png
[Image3]: ./media/azure-billing-set-up-alerts/billingalerts3.png 

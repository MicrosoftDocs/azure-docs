<properties
	pageTitle="Set up billing alerts for your Microsoft Azure subscriptions | Microsoft Azure"
	description="Describes how you can set up alerts on your Azure bill so you can avoid billing surprises."
	services="billing"
	documentationCenter=""
	authors="vikdesai"
	manager="msmbaldwin"
	editor=""
	tags="billing"
	/>

<tags
	ms.service="multiple"
	ms.workload="multiple"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="04/17/2016"
	ms.author="vikdesai"/>

# Set up billing alerts for your Microsoft Azure subscriptions

Are you concerned about how much you're spending each month for your Azure subscription? If you’re the account administrator for an Azure subscription, you can use the Azure Billing Alert Service to create customized billing alerts that help you monitor and manage billing activity for your Azure accounts.

This service is a preview service, so the first thing you have to do is sign up for it - visit <a href="https://account.windowsazure.com/PreviewFeatures">the Preview Features page </a> in the Azure account management portal to do this.

## Set the alert threshold and email recipients

After you receive the email confirmation that the billing service is turned on for your subscription, visit <a href="https://account.windowsazure.com/Subscriptions">the Subscriptions page</a> in the account portal. Click the subscription you want to monitor, and then click **Alerts**.

![][Image1]

Next, click **Add Alert** to create your first one - you can set up a total of five billing alerts per subscription, with a different threshold and up to two email recipients for each alert.

![][Image2]

When you add an alert, you give it a unique name, choose a spending threshold, and choose the email addresses where alerts will be sent. When setting up the threshold, you can choose either a **Billing Total** or a **Monetary Credit** from the **Alert For** list. For a billing total, an alert is sent when subscription spending exceeds the threshold. For a monetary credit, an alert is sent when monetary credits drop below the limit. Monetary credits usually apply to free trials and subscriptions associated with MSDN accounts.

![][Image3]

Azure supports any email address but doesn’t verify that the email address works, so double-check for typos.

## Check on your alerts

After you set up alerts, the Account Center lists them and shows how many more you can set up. For each alert, you see the date and time it was sent, whether it’s an alert for Billing Total or Monetary Credit, and the limit you set up. The date and time format is 24-hour Universal Time Coordinate (UTC) and the date is yyyy-mm-dd format. Click the plus sign for an alert in the list to edit it, or click the trash can to delete it.

[Image1]: ./media/azure-billing-set-up-alerts/billingalert1.png
[Image2]: ./media/azure-billing-set-up-alerts/billingalert2.png
[Image3]: ./media/azure-billing-set-up-alerts/billingalerts3.png

<properties
   pageTitle="Testing your developer service for deployment to the Azure Marketplace | Microsoft Azure"
   description="Detailed instructions on testing your offer before deploying to the Azure Marketplace."
   services="marketplace-publishing"
   documentationCenter=""
   authors="HannibalSII"
   manager=""
   editor=""/>

<tags
   ms.service="marketplace-publishing"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="Azure"
   ms.workload="na"
   ms.date="12/08/2015"
   ms.author="hascipio; v-shresh"/>

# Testing your Developer Service in Staging for the Azure Marketplace#

## Step 1. Push to staging

- Navigate to [Publisher Portal](https://publish.windowsazure.com). Go to **Publish** tab and click on **“Push to Staging”**. It will pop-up a box and ask for subscriptions you want to white list for Staged offer. Add the pay-as-you-go subscription you create in earlier.

## Step 2. Test the staged offer

- Once you push to staging, you will see all the steps included in staging your offer. Once all the steps are complete, your offer will be staged. Some of the steps might take even longer than a day.
- If staging fails at any point, you will see the reason for failure. Please fix the issue and push to staging again.
- Once staged, go through the all the customer scenarios (Purchase\Upgrade\Delete etc.)
- Make sure the Marketing content is as required and filled by you before pushing to staging.

## Step 3. Notify On-boarding team

- Once you are done with testing, notify the on-boarding team for validation. On-boarding team will test the customer scenarios and also validate the Marketing content.

## Next Steps

Now that you offer is "Staged", and you have tested it's functionality and marketing content, you can proceed to the final offer and/or SKU publishing phase, **Step 4**, [Deploying your offer to the Marketplace](marketplace-publishing-push-to-production.md)


## See Also
- [Getting Started: How to Publish an offer to the Azure Marketplace](marketplace-publishing-getting-started.md)

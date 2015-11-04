<properties
   pageTitle="Testing your Solution Template offer for the Marketplace | Microsoft Azure"
   description="Understand how to test your Solution Template offer for the Azure Marketplace."
   services="marketplace-publishing"
   documentationCenter=""
   authors="HannibalSII"
   manager=""
   editor=""/>

<tags
   ms.service="marketplace-publishing"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="na"
   ms.date="10/08/2015"
   ms.author="hascipio; v-divte" />

# Testing your Solution Template offer in Staging
Staging means deploying your offer in a private "sandbox" where you can test and verify its functionality before pushing it to production. The offer will appear in staging just as it would to a customer who has deployed it. Your offer **must be certified to be pushed to staging**.

After the offer is staged, you can view and test the offer in the [Azure Preview Portal](https://ms.portal.azure.com/).

Please follow the steps below to push your offer to staging and carrying out the testing in the [Azure Preview Portal](https://ms.portal.azure.com/).

1.	Navigate to [Publishing Portal](https://publish.windowsazure.com)-> select **Solution Templates** tab-> your offer -> **Publish** ->Click on **“Push to Staging"**
2.	Provide the list of Azure subscriptions which you will use to preview/test your offer.
3.	Login to the Azure Preview Portal using the same subscription id with which you have staged your offer in the previous step.
4.	Carry out at least one round of testing in the Azure Preview Portal on the points mentioned below.
  -	Marketing content is showing up correctly in the gallery
  -	End-to-end deployment of the topology
  -	Perform performance testing and stress testing
  -	Ensure that your topology adheres to the best practices.

## Next step
If you are content with the results then you can proceed to the final offer publishing phase, **Step 4**,  [Deploying your offer to the Marketplace](marketplace-publishing-push-to-production.md). Otherwise, please make changes in your offer and request for certification again.

> [AZURE.NOTE] For marketing content changes, certification is not required.

## See Also
- [Getting Started: How to publish an offer to the Azure Marketplace](marketplace-publishing-getting-started.md)

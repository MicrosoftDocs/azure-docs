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
   ms.date="10/05/2015"
   ms.author="hascipio" />

# Testing your Solution Template offer in Staging
Staging means deploying your offer in a private "sandbox" where you can test and verify its functionality before pushing it to production. The offer will appear in staging just as it would to a customer who has deployed it. Your offer **must be certified to be pushed to staging**.

After the offer is staged, you can view the offer in the [Azure Preview Portal](https://ms.portal.azure.com/). In this portal, you can view your staged as well as published offer.

Please follow the steps below to push your offer to staging and carrying out the testing in the [Azure Preview Portal](https://ms.portal.azure.com/).

1.	Navigate to [Publishing Portal](https://publish.windowsazure.com)-> select **Solution Templates** tab-> your offer -> **Publish** ->Click on **“Push to Staging"**
2.	Provide the list of Azure subscriptions which you will use to preview/test your offer.
3.	Login to the Azure Preview Portal using the same subscription id with which you have staged your offer in the previous step.
4.	Carry out at least one round of testing in the Azure Preview Portal on the points mentioned below.
  -	Marketing content is showing up correctly in the gallery
  -	End-to-end deployment of the topology
  -	Perform performance testing and stress testing
  -	Ensure that your topology adheres to the best practices.

If you are content with the result, proceed to the next step, else repeat Step 2 in the Create an Azure compatible solution of the [Creating a Solution Template for the Marketplace](marketplace-publishing-solution-template-creation.md#ccreate an Azure compatible solution) guide followed by certification of the modified topology.

> [AZURE.NOTE] The replication across the data centers take up to 24-48hours. Once the replication is complete, your offer will be listed in the [Azure Marketplace](http://azure.microsoft.com/marketplace).

## Next step
Now that you offer is in "Staging", once the onboarding team notifies, you can proceed to the final offer and/or SKU publishing phase, **Step 4**,  [Deploying your offer to the Marketplace](marketplace-publishing-push-to-production.md)

## See Also
- [Getting Started: How to publish an offer to the Azure Marketplace](marketplace-publishing-getting-started.md)

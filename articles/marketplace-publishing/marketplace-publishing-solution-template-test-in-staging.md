---
title: Testing your solution template offer for the Marketplace | Microsoft Docs
description: Understand how to test your solution template offer for the Azure Marketplace.
services: marketplace-publishing
documentationcenter: ''
author: HannibalSII
manager: hascipio
editor: ''

ms.assetid: ef8f9b5e-b98c-49f3-913f-cdf772c14c12
ms.service: marketplace
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 12/04/2015
ms.author: hascipio; v-divte

---
# Test your solution template offer in staging
Staging means deploying your offer in a private "sandbox" where you can test and verify its functionality before pushing it to production. The offer appears in staging just as it would to a customer who has deployed it. Your offer must be certified to be pushed to staging.

After the offer is staged, you can view and test the offer in the [Azure Portal](https://portal.azure.com/).

Follow the steps below to push your offer to staging and test it in the [Azure Portal](https://portal.azure.com/):

1. Go to the [Publishing Portal](https://publish.windowsazure.com) > **Solution Templates** tab > your offer > **Publish** > **Push to Staging**.
2. Provide the list of Azure subscriptions that you will use to preview and test your offer.
3. Sign in to the Azure preview portal by using the subscription ID that you used in the previous step.
4. Carry out at least one round of testing in the Azure preview portal on the points mentioned below:
   * Make sure that marketing content shows up correctly in the Azure Marketplace.
   * End-to-end deployment of the topology.
   * Perform performance testing and stress testing.
   * Ensure that your topology adheres to the best practices.

## Next steps
If you are satisfied with the results, then you can proceed to the final offer publishing phase, **Step 4**:  [Deploying your offer to the Marketplace](marketplace-publishing-push-to-production.md). Otherwise, make changes in your offer and request certification again.

> [!NOTE]
> For marketing content changes, certification is not required.
> 
> 

See [Getting started: How to publish an offer to the Azure Marketplace](marketplace-publishing-getting-started.md) for a guide to all publisher tasks.


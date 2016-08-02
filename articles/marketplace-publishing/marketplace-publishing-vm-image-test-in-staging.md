<properties
   pageTitle="Test your VM offer for the Marketplace | Microsoft Azure"
   description="Understand how to test your VM image for the Azure Marketplace."
   services="marketplace-publishing"
   documentationCenter=""
   authors="HannibalSII"
   manager=""
   editor=""/>

<tags
   ms.service="marketplace"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="na"
   ms.date="08/01/2016"
   ms.author="hascipio" />

# Test your VM offer for the Azure Marketplace in staging

Staging means deploying your SKU in a private “sandbox” where you can test and validate its functionality before deploying it to the Marketplace. The SKU appears in staging just as it would to a customer who has deployed it. Your VM image must be certified to be pushed to staging.

## Step 1: Push your offer to staging

1. On the **Publish** tab, click **Push to Staging**.

    ![drawing](media/marketplace-publishing-vm-image-test-in-staging/vm-image-push-to-staging.png)

2. If the Publishing Portal notifies you of any errors, correct them.
3.	In the **Who can access your staged offer?** dialog box, enter the list of Azure subscriptions that you will use to preview your offer in the [Azure preview portal](https://portal.azure.com).

    >[AZURE.NOTE] 1. In case of Virtual Machines and Solution templates, please **do not** whitelist subscriptions of type CSP, DreamSpark or Azure in Open.


    >[AZURE.NOTE] 2. In case of Virtual Machines, when you click on the button **PUSH TO STAGING**, the following steps are performed behind the scene. You will be able to view the progress of each step under the PUBLISH tab in the Publishing portal. You must check this page at regular interval (until the status shows STAGED) for any failure information which need correction from your end.

    > - At first your staging request goes to the certification team who validate the vhd. However, if your request has got only marketing change, then the certification step is skipped.
    > - Once the certification is complete, replication of the offer start across all the Azure datacenters. It generally takes 24-48hours for the replication to complete but may take up to a week depending on the size of the vhd. However, if your request has got only marketing change, then the replication is faster.
    > - When the replication is complete, then the offer will be available in the [Azure portal](http:/portal.azure.com). At that time the status become STAGED in the Publishing portal. A staged offer is visible in the [Azure portal](http:/portal.azure.com) only using the email id(s) associated with the subscription with which the offer is staged.

4. Sign in to the [Azure preview portal](https://portal.azure.com) by using one of the Azure subscriptions listed in the previous step.
5. Find your offer and validate your VM image points:
  - Make sure that marketing content shows up correctly in the Marketplace.
  - End-to-end deployment of the VM image.

      ![img-map-portal](media/marketplace-publishing-push-to-staging/pubportal-mapping-azure-portal.jpg)

> [AZURE.IMPORTANT] Your offer will remain in staging until you notify Microsoft via the Publishing Portal [**Publish** tab > click on the button **"Request Approval to Push to Production"**] that you are ready to push to production. This is an ideal time to have all members of your team check over everything in preparation for your offer going listed.

> The staging platform is designed for testing the offer in a preview mode by the publisher. We strongly discourage using this platofrm for commerical purposes.

## Next steps
Now that your offer is "staged" and you have tested its functionality and marketing content, you can proceed to the final publishing phase, **Step 4**: [Deploying your offer to the Marketplace](marketplace-publishing-push-to-production.md).

## See also
- [Getting started: How to publish an offer to the Azure Marketplace](marketplace-publishing-getting-started.md)

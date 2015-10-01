<properties
   pageTitle="Test your VM offer for the Marketplace | Microsoft Azure"
   description="Understand how to test your VM image for the Azure Marketplace."
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
   ms.date="10/01/2015"
   ms.author="hascipio" />

## Testing your VM offer in staging
Staging means deploying your SKU in a private “sandbox” where you can test and validate its functionality before deploying it to the Marketplace. The SKU will appear in staging just as it would to a customer who has deployed it. Your VM image must be certified to be pushed to staging.
1. Click **Push to Staging** in the **Publish** tab.

  ![drawing](media/marketplace-publishing-vm-image-test-in-staging/vm-image-push-to-staging.png)

2. Correct any errors or discrepancies if which the service may notify you a this point.
3.	Provide the list of Azure subscriptions you will use to preview your offer in [Azure Preview portal](https://portal.azure.com) in the pop up box as shown in the screenshot above.
4. Validate your VM Image for following points:
  - Marketing content is showing up correctly in the gallery

    ![drawing][img-map-portal]
   *Product & Details mapping*

  - End-to-end deployment of VM image

 5.	Your offer will remain in staging until you notify Microsoft that you are ready to push to production. This is an ideal time to have all members of the team check over everything in preparation for your offer going live.

 [img-map-portal]:media/marketplace-publishing-push-to-staging/pubportal-mapping-azure-portal.jpg

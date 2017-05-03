---
title: Managing your virtual machine image on the Azure Marketplace | Microsoft Docs
description: Detailed guide on how to manage your virtual machine image on the Azure Marketplace after initial publication
services: Azure Marketplace
documentationcenter: ''
author: HannibalSII
manager: hascipio
editor: ''

ms.assetid: cc8648d4-59c2-4678-b47d-992300677537
ms.service: marketplace
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: Azure
ms.workload: na
ms.date: 08/03/2016
ms.author: hascipio;

---
# Post-production guide for virtual machine offers in the Azure Marketplace
This article explains how you can update a live virtual machine offer in the Azure Marketplace. It also guides you through the process of adding one or more new SKUs to an existing offer and removing a live virtual machine offer or SKU from the Marketplace.

After an offer/SKU is staged in the [Azure portal](http://portal.azure.com), you can't change the following fields:

* **Offer Identifier**. [Publishing portal -> Virtual Machines -> Select your Offer -> VM Images tab -> Offer Identifier]
* **SKU Identifier**. [Publishing portal -> Virtual Machines -> Select your Offer -> SKUs tab -> Add a SKU]
* **Publisher Namespace**. [Publishing portal -> Virtual  Machines -> Walkthrough tab -> Tell Us About Your Company (Found Under “Step 2 Register Your Company”) -> Publisher Namespace -> Namespace]

After the offer/SKU is listed in the [Marketplace](http://azure.microsoft.com/marketplace), you can't change the following fields:

* **Offer Identifier**. [Publishing portal -> Virtual Machines ->  Select your Offer -> VM Images tab -> Offer Identifier]
* **SKU Identifier**. [Publishing portal -> Virtual Machines -> Select your Offer -> SKUs tab -> Add a SKU]
* **Publisher Namespace**. [Publishing portal -> Virtual Machines -> Walkthrough tab -> Tell Us About Your Company (Found Under Step 2 Register) Publisher Namespace -> Namespace]
* **Ports**. [Publishing portal -> Virtual Machines -> Select your Offer -> VM Images tab -> Open Ports]
* **Pricing Change of listed SKU(s)**
* **Billing Model Change of listed SKU(s)**
* **Removal of billing regions of listed SKU(s)**
* **Changing the data disk count of listed SKU(s)**

## Update the technical details of a SKU
To add a new version to the listed SKU and republish your offer, follow these steps:

1. Sign in to the [Publishing portal](https://publish.windowsazure.com).
2. Go to the **VIRTUAL MACHINES** tab, and select your offer.
3. In the menu on the left, click the **VM IMAGES** tab.
4. In the **SKUs** section, locate the SKU that you want to update.
5. Add a new version number of the SKU, and click the **+** button. The new version should be in an X.Y.Z format, where X, Y, and Z are integers. Version changes should only be incremental.
6. In the **OS VHD URL** box, add the shared access signature URI created for the operating system VHD and save the changes.

   > [!IMPORTANT]
   > You can't increment/decrement the data disk count of a listed SKU. You need to create a new SKU in this case. For detailed guidance, refer to the section [Add a new SKU under a listed offer](#3-how-to-add-a-new-sku-under-a-live-offer).
   >
   >
7. Go to the **PUBLISH** tab, and click **PUSH TO STAGING**. For detailed guidance on testing your offer in the staging environment, refer to this [link](marketplace-publishing-vm-image-test-in-staging.md)
8. After you've tested your offer in staging, go to the **PUBLISH** tab in the Publishing portal. Click **REQUEST APPROVAL TO PUSH TO PRODUCTION** to republish your offer in the Marketplace.

    ![Marketplace-Offer VM Images](media/marketplace-publishing-vm-image-post-publishing/img01_07.png)

## Update the nontechnical details of an offer or a SKU
You can update the nontechnical (marketing, legal, support, categories) details of your live offer or SKU in the Marketplace.

### Update the offer description and logos
To update the offer details and republish your offer, follow these steps:

1. Sign in to the [Publishing portal](https://publish.windowsazure.com).
2. Go to the **virtual machines** tab, and select your offer.
3. In the menu on the left, click the **MARKETING** tab.
4. Click **ENGLISH (US)**.
5. In the menu on the left, click the **DETAILS** tab. In the **Description** section, update the offer title, summary, and long summary and save the changes.

   > [!NOTE]
   > When you update the SKU details, be aware of these restrictions: Do not enter duplicate text for the offer description and the SKU description. Do not enter duplicate text for the SKU title and the offer long summary. Do not enter duplicate text for the SKU title and the offer summary.
   >
   >

    ![drawing](media/marketplace-publishing-vm-image-post-publishing/img02.1_05.png)
6. In the **LOGOS** section of the **DETAILS** tab, update the logos. Ensure that the logos follow the [Azure Marketplace guidelines](marketplace-publishing-push-to-staging.md#step-1-provide-marketplace-marketing-content). (Refer to the section Step 1: Provide Marketplace marketing content > Details > Azure Marketplace Logo Guidelines.)

   > [!NOTE]
   > A hero icon is optional. You can choose not to upload a hero icon. However, after a hero icon is uploaded, there is no provision to delete it from the Publishing portal. In that case, you must follow the [hero icon guidelines](marketplace-publishing-push-to-staging.md#step-1-provide-marketplace-marketing-content). (Refer to the section Step 1: Provide Marketplace marketing content > Details > Additional guidelines for the Hero logo banner.)
   >
   >
7. Go to the **PUBLISH** tab, and click **PUSH TO STAGING**. For detailed guidance on testing your offer in the staging environment, refer to this [link](marketplace-publishing-vm-image-test-in-staging.md).
8. After you've tested your offer in staging, go to the **PUBLISH** tab in the Publishing portal. Click **REQUEST APPROVAL TO PUSH TO PRODUCTION** to republish your offer in the Marketplace.

    ![Logos](media/marketplace-publishing-vm-image-post-publishing/img02.1_08.png)

### Update the SKU description
To update the SKU details and republish your offer, follow these steps:

1. Sign in to the [Publishing portal](https://publish.windowsazure.com).
2. Go to the **VIRTUAL MACHINES** tab, and select your offer.
3. In the menu on the left, click the **MARKETING** tab.
4. Click **ENGLISH (US)**.
5. In the menu on the left, click the **PLANS** tab. In the **SKUs** section, update the SKU title, summary, and description and save the changes.

   > [!NOTE]
   > When you update the SKU details, be aware of these restrictions: Do not enter duplicate text for the offer description and the SKU description. Do not enter duplicate text for the SKU title and the offer long summary. Do not enter duplicate text for the SKU title and the offer summary.
   >
   >
6. Go to the **PUBLISH** tab, and click **PUSH TO STAGING**. For detailed guidance on testing your offer in the staging environment, refer to this link
7. After you've tested your offer in staging, go to the **PUBLISH** tab in the Publishing portal. Click **REQUEST APPROVAL TO PUSH TO PRODUCTION** to republish your offer in the Marketplace.

    ![drawing](media/marketplace-publishing-vm-image-post-publishing/img02.2_07.png)

### Change existing links or add new links
To change existing links or add new links and then republish your offer, follow these steps:

1. Sign in to the [Publishing portal](https://publish.windowsazure.com).
2. Go to the **virtual machines** tab, and select your offer.
3. In the menu on the left, click the **MARKETING** tab.
4. Click **ENGLISH (US)**.
5. In the menu on the left, click the **LINKS** tab.
6. If you want to add a new link, in the **Links** section, click **ADD LINK**. In the **Add Link** dialog box, enter the link title and URL and save the changes. You can enter any link that contains information that may help customers.
7. If you want to update or delete an existing link, select the link and click the edit button or the delete button accordingly.

   > [!NOTE]
   > Ensure that the links that you've entered in this section are working properly, because these links get validated during your production request process.
   >
   >
8. Go to the **PUBLISH** tab and click **PUSH TO STAGING**. For detailed guidance on testing your offer in the staging environment, refer to this [link](marketplace-publishing-vm-image-test-in-staging.md).
9. After you've tested your offer in staging, go to the **PUBLISH** tab in the Publishing portal. Click **REQUEST APPROVAL TO PUSH TO PRODUCTION** to republish your offer in the Marketplace.

    ![drawing](media/marketplace-publishing-vm-image-post-publishing/img02.3_09-01.png)

    ![drawing](media/marketplace-publishing-vm-image-post-publishing/img02.3-2.png)

### Change an existing sample image or add a new sample image
To change an existing sample image or add new sample images and then republish your offer, follow these steps:

> [!NOTE]
> Only one sample image is displayed in the [Azure portal](https://portal.azure.com).
>
>

1. Sign in to the [Publishing portal](https://publish.windowsazure.com).
2. Go to the **VIRTUAL MACHINES** tab, and select your offer.
3. In the menu on the left, click the **MARKETING** tab.
4. Click **ENGLISH (US)**.
5. In the menu on the left, click the **SAMPLE IMAGES** tab.
6. If you want to add a new sample image, in the **Sample Images** section, click **UPLOAD A NEW IMAGE** and then save the changes.

   > [!NOTE]
   > Including a sample image is optional.
   >
   >8. Go to the **PUBLISH** tab, and click **PUSH TO STAGING**. For detailed guidance on testing your offer in the staging environment, refer to this [link](marketplace-publishing-vm-image-test-in-staging.md).
9. After you've tested your offer in staging, go to the **PUBLISH** tab in the Publishing portal. Click **REQUEST APPROVAL TO PUSH TO PRODUCTION** to republish your offer in the Marketplace.

    ![drawing](media/marketplace-publishing-vm-image-post-publishing/img02.4_09.png)

### Update the legal content
To update the legal content and republish your offer, follow these steps:

1. Sign in to the [Publishing portal](https://publish.windowsazure.com).
2. Go to the **VIRTUAL MACHINES** tab, and select your offer.
3. In the menu on the left side, click the **MARKETING** tab.
4. Click **ENGLISH (US)**.
5. In the menu on the left side, click the **LEGAL** tab. In the **Legal** section, update your policies/terms of use. Enter or paste the policies/terms in the **Terms of Use** box and save the changes.
6. The character limit for the legal terms of use is 1 million characters.
7. Go to the **PUBLISH** tab, and click **PUSH TO STAGING**. For detailed guidance on testing your offer in the staging environment, refer to this [link](marketplace-publishing-vm-image-test-in-staging.md)
8. After you've tested your offer in staging, go to the **PUBLISH** tab in the Publishing portal. Click **REQUEST APPROVAL TO PUSH TO PRODUCTION** to republish your offer in the Marketplace.

    ![drawing](media/marketplace-publishing-vm-image-post-publishing/img02.5_08.png)

### Update the support information
To update the support information and republish your offer, follow these steps:

1. Sign in to the [Publishing portal](https://publish.windowsazure.com).
2. Go to the **VIRTUAL MACHINES** tab, and select your offer.
3. In the menu on the left side, click the **SUPPORT** tab.
4. In the *Engineering Contact* section of the **SUPPORT** tab, update the contact details. These details are used for internal communication between the partner and Microsoft only.
5. In the **Customer Support** section of the **SUPPORT** tab, update the Support contact details such as **Name**, **Email**, **Phone** and **Support URL**. These details are used for internal communication between the partner and Microsoft only.

   > [!NOTE]
   > If you want to provide only email support, provide a dummy phone number in the **Customer Support** section. In this case, your provided email will be used instead.
   >
   >
6. Go to the **PUBLISH** tab, and click **PUSH TO STAGING**. For detailed guidance on testing your offer in the staging environment, refer to this [link](marketplace-publishing-vm-image-test-in-staging.md)
7. After you've tested your offer in staging, go to the **PUBLISH** tab in the Publishing portal and click **REQUEST APPROVAL TO PUSH TO PRODUCTION** to republish your offer in the Azure Marketplace.

    ![drawing](media/marketplace-publishing-vm-image-post-publishing/img02.6_07.png)

### Update the categories
To update the categories section for your offer and republish your offer, follow these steps:

1. Sign in to the [Publishing portal](https://publish.windowsazure.com).
2. Go to the **VIRTUAL MACHINES** tab, and select your offer.
3. In the menu on the left side, click the **CATEGORIES** tab.
4. In the **Categories** section, update the categories for your offer and save the changes. You can select up to five categories for the Azure Marketplace Gallery.
5. Go to the **PUBLISH** tab, and click **PUSH TO STAGING**. For detailed guidance on testing your offer in the staging environment, refer to this [link](marketplace-publishing-vm-image-test-in-staging.md)
6. After you've tested your offer in staging, go to the **PUBLISH** tab in the Publishing portal. Click **REQUEST APPROVAL TO PUSH TO PRODUCTION** to republish your offer in the Marketplace.

    ![drawing](media/marketplace-publishing-vm-image-post-publishing/img02.7_06.png)

## Add a new SKU under a listed offer
To add a new SKU in your live offer, follow these steps:

1. Sign in to the [Publishing portal](https://publish.windowsazure.com).
2. Go to the **VIRTUAL MACHINES** tab, and select your offer.
3. In the menu on the left side, click the **SKUs** tab. Then click **ADD A SKU**. In the dialog box, enter a SKU identifier in lowercase. Select the check box for a bring-your-own billing model (BYOL) if you want to publish the new SKU with a BYOL billing model. Otherwise, clear the check box for BYOL. Click the tick mark in the dialog box to create a new SKU. If you did not opt for the BYOL billing model, the billing model is automatically set to Hourly. If you want the 30-day free trial for the Hourly billing model, click the **One Month** option for “Is a free trial available?”. Otherwise, select **NO TRIAL**. (“Is a free trial available?” is only shown if you haven't selected BYOL while creating the new SKU.)

   > [!IMPORTANT]
   > The option “Hide this SKU from the Marketplace because it should always be bought via a solution template” should be **YES** only if you're approved for publishing a solution template offer in the Marketplace. Otherwise, this option should always be **NO**.
   >
   >
4. In the menu on the left side, click the **VM IMAGES** tab and find out the new SKU that you've created.
5. To set up the new SKU, refer to STEP 5 of this [link](marketplace-publishing-vm-image-creation.md#5-obtain-certification-for-your-vm-image) for guidance.
6. To add the marketing material for the new SKU, refer to the section Step 1: Provide Marketplace marketing content -> Details-> point numbers 2 to 5 of this [link](marketplace-publishing-push-to-staging.md#step-1-provide-marketplace-marketing-content).
7. To add the pricing information for the new SKU, refer to the section 2.1. Set your VM prices of this [link](marketplace-publishing-push-to-staging.md#step-2-set-your-prices)
8. Go to the **PUBLISH** tab, and click **PUSH TO STAGING**. For detailed guidance on testing your offer in the staging environment, refer to this [link](marketplace-publishing-vm-image-test-in-staging.md)
9. After you've tested your offer in staging, go to the **PUBLISH** tab in the Publishing portal. Click **REQUEST APPROVAL TO PUSH TO PRODUCTION** to republish your offer in the Marketplace.

    ![drawing](media/marketplace-publishing-vm-image-post-publishing/img03_09-01.png)

    ![drawing](media/marketplace-publishing-vm-image-post-publishing/img03_09-02.png)

## Change the data disk count for a listed SKU
You can't increment/decrement the data disk count of a listed SKU. You need to create a new SKU in this case. Refer to the section [3. How to add a new SKU under a live offer](#3-how-to-add-a-new-sku-under-a-live-offer) for detailed guidance.

## Delete a listed offer from the Marketplace
Various aspects need to be taken care of in the case of a request to remove a live offer. To get guidance from the support team to remove a listed offer from the Marketplace, follow these steps:

1. Raise a support ticket using this [link](https://support.microsoft.com/en-us/getsupport?wf=0&tenant=ClassicCommercial&oaspworkflow=start_1.0.0.0&locale=en-us&supportregion=en-us&pesid=15635&ccsid=635993707583706681)
2. Select **Problem type** as **“Managing offers”**, and select **Category** as **“Modifying an offer and/or SKU already in production”**.
3. Submit the request.

The support team will guide you through the offer/SKU deletion process.

> [!NOTE]
> You can always delete the offer while it is in a Draft status (not in Staging or Production). Click  **DISCARD DRAFT** on the **HISTORY** tab.
>
>

## Delete a listed SKU from the Marketplace
To delete a listed SKU from the Marketplace, follow these steps:

1. Sign in to the [Publishing portal](https://publish.windowsazure.com).
2. Go to the **VIRTUAL MACHINES** tab, and select your offer.
3. In the pane on the left, click the **SKUS** tab.
4. Select the SKU that you want to delete and click the delete button against that SKU.
5. Go to the **PUBLISH** tab in the Publishing portal, and click **REQUEST APPROVAL TO PUSH TO PRODUCTION** to republish the offer in the Marketplace.
6. After the offer is republished in the Marketplace, the SKU is deleted from the Marketplace and the Azure portal.

## Delete the current version of a listed SKU from the Marketplace
To delete the current version of a listed SKU from the Marketplace, follow these steps: 

1. Sign in to the [Publishing portal](https://publish.windowsazure.com).
2. Go to the **VIRTUAL MACHINES** tab, and select your offer.
3. In the pane on the left, click the **VM IMAGES** tab.
4. Select the SKU whose current version you want to delete, and click the delete button against that version.
5. Go to the **PUBLISH** tab in the Publishing portal, and click **REQUEST APPROVAL TO PUSH TO PRODUCTION** to republish the offer in the Marketplace.
6. After the offer gets republished in the Marketplace, the current version of the listed SKU is deleted from the Marketplace and the Azure portal. The SKU is then rolled back to its previous version.

## Revert the listing price to production values
To revert the listing price to production values, follow these steps:

1. Sign in to the [Publishing portal](https://publish.windowsazure.com).
2. Go to the **virtual machines** tab, and select your offer.
3. In the menu on the left side, click the **PRICING** tab.
4. In the Pricing tab, select a region whose pricing you want to reset.

    ![drawing](media/marketplace-publishing-vm-image-post-publishing/img08-04.png)
5. For SKUs with an hourly billing model, reset the prices for all the cores as they are in the production for the selected region. For SKUs with a BYOL billing model, make the SKU available in the region by selecting the check box for the SKU in the **EXTERNALLY-LICENSED (BYOL) SKU AVAILABILITY** section.

    ![drawing](media/marketplace-publishing-vm-image-post-publishing/img08-05.png)
6. Click **AUTOPRICE OTHER MARKETS BASED ON PRICES IN UNITED STATES**.

   > [!NOTE]
   > The button’s label might be different depending on the region that you select. Because we selected United States, the button is labeled “Autoprice other markets based on prices in United States”.
   >
   >

    ![drawing](media/marketplace-publishing-vm-image-post-publishing/img08-06.png)
7. On page 1 of the Autoprice wizard, select the base market and click the arrow.

    ![drawing](media/marketplace-publishing-vm-image-post-publishing/img08-07.png)
8. On page 2, select service plans and cores, and click the arrow.

    ![drawing](media/marketplace-publishing-vm-image-post-publishing/img08-08.png)
9. On page 3, click **Toggle All** to select all regions or manually select check boxes for specific regions and click the arrow.

    ![drawing](media/marketplace-publishing-vm-image-post-publishing/img08-09.png)
10. On page 4, review the exchange rates and click **Finish**. The wizard resets the pricing according to your selections.

11. On the **PRICING** tab, click **VIEW SUMMARY AND CHANGES**.
    Select **Draft** in the **View Version** section, and select **Production** in the **Compare with** section. If you see no pricing difference, the pricing reverted to the production values successfully.

    ![drawing](media/marketplace-publishing-vm-image-post-publishing/img08-11.png)
12. Go to the PUBLISH tab, and click **PUSH TO STAGING**. For detailed guidance on testing your offer in the staging environment, refer to this [link](marketplace-publishing-vm-image-test-in-staging.md)
13. After you've tested your offer in staging, go to the **PUBLISH** tab in the Publishing portal. Click **REQUEST APPROVAL TO PUSH TO PRODUCTION** to republish your offer in the Marketplace.

## To revert the billing model to production values
To revert the billing model to production values, follow these steps:

1. Sign in to the [Publishing portal](https://publish.windowsazure.com).
2. Go to the **VIRTUAL MACHINES** tab and select your offer.
3. In the menu on the left side, click the **SKUS** tab.
4. Click EDIT button to revert the billing model. A window will open. Check or uncheck the checkbox **‘Billing and licensing is done externally from Azure (aka Bring Your Own License)’** accordingly.

    ![drawing](media/marketplace-publishing-vm-image-post-publishing/img09-04.png)
5. Once done please refer to the answer of the question 8 in this document to revert back the pricing.
6. After that go to the **PUBLISH** tab in the Publishing portal and push the offer to staging to test it. Once you are done with testing the offer, then click **REQUEST APPROVAL TO PUSH TO PRODUCTION** to republish your offer in the Azure Marketplace.

## 10. How to revert visibility setting of a listed SKU to the production value
Please follow the steps below:

1. Sign in to the [Publishing portal](https://publish.windowsazure.com).
2. Go to the **VIRTUAL MACHINES** tab and select your offer.
3. In the menu on the left side, click the **SKUS** tab.
4. Select your SKU and revert the visibility setting of the SKU to the production value.

    ![drawing](media/marketplace-publishing-vm-image-post-publishing/img10-04.png)
5. Once you are done with the changes, then click **REQUEST APPROVAL TO PUSH TO PRODUCTION** to republish your offer in the Azure Marketplace.

## See Also
* [Getting Started: How to publish an offer to the Azure Marketplace](marketplace-publishing-getting-started.md)
* [Understanding payout reporting](marketplace-publishing-report-payout.md)
* [How to change your Cloud Solution Provider reseller incentive](marketplace-publishing-csp-incentive.md)
* [Troubleshooting common publishing problems in the Marketplace](marketplace-publishing-support-common-issues.md)
* [Get support as a publisher](marketplace-publishing-get-publisher-support.md)
* [Creating a VM image on-premises](marketplace-publishing-vm-image-creation-on-premise.md)
* [Create a virtual machine running Windows in the Azure preview portal](../virtual-machines/virtual-machines-windows-hero-tutorial.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json)

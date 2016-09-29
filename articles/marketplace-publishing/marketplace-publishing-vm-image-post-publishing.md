<properties
   pageTitle="Managing your virtual machine image on the Azure Marketplace | Microsoft Azure"
   description="Detailed guide on how to manage your virtual machine image on the Azure Marketplace after initial publication."
   services="Azure Marketplace"
   documentationCenter=""
   authors="HannibalSII"
   manager=""
   editor=""/>

<tags
   ms.service="marketplace"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="Azure"
   ms.workload="na"
   ms.date="08/03/2016"
   ms.author="hascipio;"/>

# Post-production guide for virtual machine offers in the Azure Marketplace

This article explains how you can update a live Virtual Machine offer in the Azure Marketplace. It also guides you on the process of adding one or more new SKUs to an existing offer and remove a live Virtual Machine offer or SKU from the Azure Marketplace.

Once an offer/SKU is staged in the [Azure Portal](http://portal.azure.com), you cannot change the fields given below:

- **Offer Identifier:** [Publishing portal -> Virtual Machines -> Select your Offer -> VM Images tab -> Offer Identifier]
- **SKU Identifier:** [Publishing portal -> Virtual Machines -> Select your Offer -> SKUs tab -> Add a SKU]
- **Publisher Namespace:** [Publishing portal -> Virtual  Machines -> Walkthrough tab -> Tell Us About Your Company (Found Under “Step 2 Register Your Company”) -> Publisher Namespace -> Namespace]

Once the offer/SKU is listed in the [Azure Marketplace](http://azure.microsoft.com/marketplace), you cannot change the fields given below:

- **Offer Identifier:** [Publishing portal -> Virtual Machines ->  Select your Offer -> VM Images tab -> Offer Identifier]
- **SKU Identifier:** [Publishing portal -> Virtual Machines -> Select your Offer -> SKUs tab -> Add a SKU]
- **Publisher Namespace:** [Publishing portal -> Virtual Machines -> Walkthrough tab -> Tell Us About Your Company (Found Under Step 2 Register) Publisher Namespace -> Namespace]
- **Ports** [Publishing portal -> Virtual Machines -> Select your Offer -> VM Images tab -> Open Ports]
- **Pricing Change of listed SKU(s)**
- **Billing Model Change of listed SKU(s)**
- **Removal of billing regions of listed SKU(s)**
- **Changing the data disk count of listed SKU(s)**



## 1. How to update the technical details of a SKU

You can add a new version to the listed SKU and re-publish your offer by following the steps given below:

1. Login to the [Publishing portal](https://publish.windowsazure.com).
2. Navigate to the **VIRTUAL MACHINES** tab and select your offer.
3. From the left hand side menu, click on the **VM IMAGES** tab.
4. From the **SKUs** section of the **VM IMAGES** tab, locate the SKU that you want to update.
5. After that, add a new version number of the SKU and click on the **"+"** button. The new version should be of X.Y.Z format where X, Y, Z are integers. Version changes should only be incremental.
6. In the **OS VHD URL** box, add the shared access signature URI created for the operating system VHD and save the changes.

    >[AZURE.IMPORTANT] You cannot increment/decrement the data disk count of a listed SKU. You need to create a new SKU in this case. Please refer to the section [3. How to add a new SKU under a listed offer](#3-how-to-add-a-new-sku-under-a-live-offer) for detailed guidance.

7. After making the changes, navigate to the **PUBLISH** tab and click on the button **PUSH TO STAGING**. For detailed guidance on testing your offer in the staging environment please refer to this [link](marketplace-publishing-vm-image-test-in-staging.md)
8. Once you have tested your offer in staging, navigate to the **PUBLISH** tab in the Publishing portal and click on the button **REQUEST APPROVAL TO PUSH TO PRODUCTION** to re-publish your offer in the Azure Marketplace.

    ![drawing](media/marketplace-publishing-vm-image-post-publishing/img01_07.png)

## 2. How to update the non-technical details of an offer or a SKU

You can update the non-technical (marketing, legal, support, categories) details of your live offer or SKU in the Azure Marketplace.

### 2.1 Update the offer description and logos

You can update the offer details and re-publish your offer by following the steps below:

1. Login to the [Publishing portal](https://publish.windowsazure.com).
2. Navigate to the **VIRTUAL MACHINES** tab and select your offer.
3. From the left hand side menu, click on the **MARKETING** tab.
4. Click on the **ENGLISH (US)** button.
5. From the left hand side menu, click on the **DETAILS** tab. Under the *DESCRIPTION* section of the **DETAILS** tab you can update the offer title, offer summary, offer long summary and save the changes.

    >[AZURE.NOTE] Please take care of the following while you are updating the SKU details.
    **Do not enter duplicate text under the offer description and the SKU description. Do not enter duplicate text under the SKU title and the offer long summary. Do not enter duplicate text under the SKU title and the offer summary.**

    ![drawing](media/marketplace-publishing-vm-image-post-publishing/img02.1_05.png)

6. Under the *LOGOS* section of the **DETAILS** tab, you can update the logos. However, ensure that the logos follow the [Azure Marketplace guidelines](marketplace-publishing-push-to-staging.md#step-1-provide-marketplace-marketing-content) (refer to the section Step 1: Provide Marketplace marketing content -> Details-> Azure Marketplace Logo Guidelines).

    >[AZURE.NOTE] Hero icon is optional. You can choose not to upload a Hero icon. However, once Hero icon is uploaded, then there is no provision to delete it from the Publishing portal. In that case, you must follow the [Hero icon guidelines](marketplace-publishing-push-to-staging.md#step-1-provide-marketplace-marketing-content) (refer to the section Step 1: Provide Marketplace marketing content -> Details-> Additional guidelines for the Hero logo banner).

7. After making the changes, navigate to the **PUBLISH** tab and click on the button **PUSH TO STAGING**. For detailed guidance on testing your offer in the staging environment please refer to this [link](marketplace-publishing-vm-image-test-in-staging.md).
8. Once you have tested your offer in staging, navigate to the **PUBLISH** tab in the Publishing portal and click on the button **REQUEST APPROVAL TO PUSH TO PRODUCTION** to re-publish your offer in the Azure Marketplace.

    ![drawing](media/marketplace-publishing-vm-image-post-publishing/img02.1_08.png)

### 2.2. Update the SKU description

You can update the SKU details and re-publish your offer by following the steps below:

1. Login to the [Publishing portal](https://publish.windowsazure.com)
2. Navigate to the **VIRTUAL MACHINES** tab and select your offer.
3. From the left hand side menu, click on the **MARKETING** tab.
4. Click on the **ENGLISH (US)** button.
5. From the left hand side menu, click on the **PLANS** tab. Under the *SKUs* section of the **PLANS** tab you can update the SKU title, SKU summary and SKU description details and save the changes.

    >[AZURE.NOTE] Please take care of the following while you are updating the SKU details. **Do not enter duplicate text under the offer description and the SKU description. Do not enter duplicate text under the SKU's title and the offer long summary. Do not enter duplicate text under the SKU Title and the offer summary.**

6. After making the changes, navigate to the **PUBLISH** tab and click on the button **PUSH TO STAGING**. For detailed guidance on testing your offer in the staging environment please refer to this link
7. Once you have tested your offer in staging, navigate to the **PUBLISH** tab in the Publishing portal and click on the button **REQUEST APPROVAL TO PUSH TO PRODUCTION** to re-publish your offer in the Azure Marketplace.

    ![drawing](media/marketplace-publishing-vm-image-post-publishing/img02.2_07.png)

### 2.3 Change the existing links or add new links

You can change the existing links or add new links and then re-publish your offer by following the steps below:

1. Login to the [Publishing portal](https://publish.windowsazure.com)
2. Navigate to the **VIRTUAL MACHINES** tab and select your offer.
3. From the left hand side menu, click on the **MARKETING** tab.
4. Click on the **ENGLISH (US)** button.
5. From the left hand side menu, click on the **LINKS** tab.
6. If you want to add a new link, then under the *Links* section click on the **ADD LINK** button. The *“Add Link”* dialog box will open. In this dialog box, you can add the link Title and URL fields and save the changes. You can enter any link which contains information that may help the customers.
7. If you want to update or delete an existing link, then select the appropriate link and click on the edit button or the delete button accordingly.

    >[AZURE.NOTE] Please make sure that the links which you have entered in this section are working properly, as these links get validated during your production request process.

8. After making the changes, navigate to the **PUBLISH** tab and click on the button **PUSH TO STAGING**. For detailed guidance on testing your offer in the staging environment please refer to this [link](marketplace-publishing-vm-image-test-in-staging.md).
9. Once you have tested your offer in staging, navigate to the **PUBLISH** tab in the Publishing portal and click on the button **REQUEST APPROVAL TO PUSH TO PRODUCTION** to re-publish your offer in the Azure Marketplace.

    ![drawing](media/marketplace-publishing-vm-image-post-publishing/img02.3_09-01.png)

    ![drawing](media/marketplace-publishing-vm-image-post-publishing/img02.3-2.png)

### 2.4 Change an existing sample image or add a new sample image

You can change an existing sample images or add new sample images and then re-publish your offer by following the steps below:

>[AZURE.NOTE] Only one sample image is displayed in the [https://portal.azure.com](https://portal.azure.com).

1. Login to the [Publishing portal](https://publish.windowsazure.com)
2. Navigate to the **VIRTUAL MACHINES** tab and select your offer.
3. From the left hand side menu, click on the **MARKETING** tab.
4. Click on the **ENGLISH (US)** button.
5. From the left hand side menu, click on the **SAMPLE IMAGES** tab.
6. If you want to add a new sample image, then under the *Sample Images* section click on the **UPLOAD A NEW IMAGE** button and then save the changes.

    >[AZURE.NOTE] Including a sample image is an optional step.

7. If you want to update or delete an existing sample image, then locate the appropriate sample image and then click on the **REPLACE IMAGE** button or the delete button accordingly.

8. After making the changes, navigate to the **PUBLISH** tab and click on the button **PUSH TO STAGING**. For detailed guidance on testing your offer in the staging environment please refer to this [link](marketplace-publishing-vm-image-test-in-staging.md).
9. Once you have tested your offer in staging, navigate to the **PUBLISH** tab in the Publishing portal and click on the button **REQUEST APPROVAL TO PUSH TO PRODUCTION** to re-publish your offer in the Azure Marketplace.

    ![drawing](media/marketplace-publishing-vm-image-post-publishing/img02.4_09.png)

### 2.5 Update the legal content

You can update the legal content and re-publish your offer by following the steps below:

1. Login to the [Publishing portal](https://publish.windowsazure.com)
2. Navigate to the **VIRTUAL MACHINES** tab and select your offer.
3. From the left hand side menu, click on the **MARKETING** tab.
4. Click on the **ENGLISH (US)** button.
5. From the left hand side menu, click on the **LEGAL** tab. Under the *Legal* section you can update your policies/terms of use. Enter or paste the policies/terms in the *Terms of Use* textbox and save the changes.
6. The character limit for the legal terms of use is 1,000,000 characters.
7. After making the changes, navigate to the **PUBLISH** tab and click on the button **PUSH TO STAGING**. For detailed guidance on testing your offer in the staging environment please refer to this [link](marketplace-publishing-vm-image-test-in-staging.md)
8. Once you have tested your offer in staging, navigate to the **PUBLISH** tab in the Publishing portal and click on the button **REQUEST APPROVAL TO PUSH TO PRODUCTION** to re-publish your offer in the Azure Marketplace.

    ![drawing](media/marketplace-publishing-vm-image-post-publishing/img02.5_08.png)

### 2.6 Update the support information

You can update the support information and re-publish your offer by following the steps below:

1. Login to the [Publishing portal](https://publish.windowsazure.com)
2. Navigate to the **VIRTUAL MACHINES** tab and select your offer.
3. From the left hand side menu, click on the **SUPPORT** tab.
4. Under the *Engineering Contact* section of the **SUPPORT** tab you can update the contact details. These details are used for internal communication between the partner and Microsoft only.
5. Under the *Customer Support* section of the **SUPPORT** tab you can update the Support contact details like **Name, Email, Phone** and **Support URL**. These details are used for internal communication between the partner and Microsoft only.

    >[AZURE.NOTE] If you want to provide only email support, provide a dummy phone number under the **Customer Support** section. In this case, your provided email will be used instead.

6. After making the changes, navigate to the **PUBLISH** tab and click on the button **PUSH TO STAGING**. For detailed guidance on testing your offer in the staging environment please refer to this [link](marketplace-publishing-vm-image-test-in-staging.md)
7. Once you have tested your offer in staging, navigate to the **PUBLISH** tab in the Publishing portal and click on the button **REQUEST APPROVAL TO PUSH TO PRODUCTION** to re-publish your offer in the Azure Marketplace.

    ![drawing](media/marketplace-publishing-vm-image-post-publishing/img02.6_07.png)

### 2.7 Update the categories

You can update the categories section for your offer and re-publish your offer by following the steps below:

1. Login to the [Publishing portal](https://publish.windowsazure.com)
2. Navigate to the **VIRTUAL MACHINES** tab and select your offer.
3. From the left hand side menu, click the **CATEGORIES** tab.
4. Under the *Categories* section you can update the categories for your offer and save the changes. You can select up to five categories for the Azure Marketplace gallery.
5. After making the changes, navigate to the **PUBLISH** tab and click on the button **PUSH TO STAGING**. For detailed guidance on testing your offer in the staging environment please refer to this [link](marketplace-publishing-vm-image-test-in-staging.md)
6. Once you have tested your offer in staging, navigate to the **PUBLISH** tab in the Publishing portal and click on the button **REQUEST APPROVAL TO PUSH TO PRODUCTION** to re-publish your offer in the Azure Marketplace.

    ![drawing](media/marketplace-publishing-vm-image-post-publishing/img02.7_06.png)

## 3. How to add a new SKU under a listed offer

You can add a new SKU under your live offer by following the steps given below:

1. Login to the [Publishing portal](https://publish.windowsazure.com).
2. Navigate to the **VIRTUAL MACHINES** tab and select your offer.
3. From the left hand side menu, click on the **SKUs** tab. After that click on the button **ADD A SKU**.  A new dialog box will open. Enter a SKU identifier in lower case. Check the checkbox for bring-your-own billing model(BYOL) if you want to publish the new SKU with BYOL billing model. Otherwise, uncheck the check box for BYOL. After that click on the tick mark in the dialog box to create a new SKU. If you did not opt for the BYOL billing model for the new SKU, then the billing model will be automatically set to Hourly for the new SKU. If you want to enable the 30days free trial for Hourly billing model, then click on the “One Month” option for “Is a free trial available?”. Otherwise select “NO TRIAL”. [Note: The option “Is a free trial available?” is only shown if you have NOT selected BYOL in the dialog box while creating the new SKU.]

    >[AZURE.IMPORTANT] The option “Hide this SKU from the Marketplace because it should always be bought via a solution template” should be marked as “YES” ONLY if you are approved for publishing a solution template offer in the Azure Marketplace. Otherwise, this option should always be marked as “NO”.

4. Now from the left hand side menu, click on the **VM IMAGES** tab and find out the new SKU which you have created.
5. To set up the new SKU, refer to the STEP 5 of this [link](marketplace-publishing-vm-image-creation.md#5-obtain-certification-for-your-vm-image) for guidance.
6. To add the marketing material for the new SKU, refer to the section Step 1: Provide Marketplace marketing content -> Details-> point numbers 2 to 5 of this [link](marketplace-publishing-push-to-staging.md#step-1-provide-marketplace-marketing-content).
7. To add the pricing information for the new SKU, refer to the section 2.1. Set your VM prices of this [link](marketplace-publishing-push-to-staging.md#step-2-set-your-prices)
8. After making the changes, navigate to the **PUBLISH** tab and click on the button **PUSH TO STAGING**. For detailed guidance on testing your offer in the staging environment please refer to this [link](marketplace-publishing-vm-image-test-in-staging.md)
9. Once you have tested your offer in staging, navigate to the **PUBLISH** tab in the Publishing portal and click on the button **REQUEST APPROVAL TO PUSH TO PRODUCTION** to re-publish your offer in the Azure Marketplace.

    ![drawing](media/marketplace-publishing-vm-image-post-publishing/img03_09-01.png)

    ![drawing](media/marketplace-publishing-vm-image-post-publishing/img03_09-02.png)

## 4. How to change the data disk count for a listed SKU

You cannot increment/decrement the data disk count of a listed SKU. You need a create a new SKU in this case. Please refer to the section [3. How to add a new SKU under a live offer](#3-how-to-add-a-new-sku-under-a-live-offer) for detailed guidance.

## 5.	How to delete a listed offer from the Azure Marketplace

There are various aspects that need to be taken care of in case of a request to remove a live offer. Please follow the steps below to get guidance from the support team to remove a listed offer from the Azure Marketplace:

1.	Raise a support ticket using this [link](https://support.microsoft.com/en-us/getsupport?wf=0&tenant=ClassicCommercial&oaspworkflow=start_1.0.0.0&locale=en-us&supportregion=en-us&pesid=15635&ccsid=635993707583706681)
2.	Select Problem type as **“Managing offers”** and select Category as **“Modifying an offer and/or SKU already in production”**
3.	Submit the request

The support team will guide you through the offer/SKU deletion process.

>[AZURE.NOTE] You can always delete the offer while it is in a Draft status (i.e., not in STAGING or PRODUCTION) by clicking on the **DISCARD DRAFT** button under the **HISTORY** tab.

## 6. How to delete a listed SKU from the Azure Marketplace

You can delete a listed SKU from the Azure Marketplace by following the steps given below:

1. Login to the [Publishing portal](https://publish.windowsazure.com).
2. Navigate to the **VIRTUAL MACHINES** tab and select your offer.
3. From the left hand side pane, click on the **SKUS** tab.
4. Select the SKU which you want to delete and click on the delete button against that SKU.
5. Once done, navigate to the PUBLISH tab in the Publishing portal and click on the button **REQUEST APPROVAL TO PUSH TO PRODUCTION** to re-publish the offer in the Azure Marketplace.
6. Once the offer gets re-published in the Azure Marketplace, the SKU will be deleted from the Azure Marketplace and the Azure Portal.

## 7. How to delete the current version of a listed SKU from the Azure Marketplace

You can delete the current version of a listed SKU from the Azure Marketplace by following the steps given below. Once the process is complete, the SKU will be rolled back to its previous version.

1. Login to the [Publishing portal](https://publish.windowsazure.com).
2.	Navigate to the **VIRTUAL MACHINES** tab and select your offer.
3.	From the left hand side pane, click on the **VM IMAGES** tab.
4.	Select the SKU whose current version you want to delete and click on the delete button against that version.
5.	Once done, navigate to the **PUBLISH** tab in the Publishing portal and click on the button **REQUEST APPROVAL TO PUSH TO PRODUCTION** to re-publish the offer in the Azure Marketplace.
6.	Once the offer gets re-published in the Azure Marketplace, the current version of the listed SKU will be deleted from the Azure Marketplace and the Azure Portal. The SKU will be rolled back to its previous version.

## 8. How to revert listing price to production values
I have changed the pricing of a listed SKU (or I have removed the billing regions of a listed SKU). Since it is not supported in the Azure Marketplace, I want to revert my changes to the production values. How do I achieve that?

Please follow the steps given below:

1. Login to the [Publishing portal](https://publish.windowsazure.com).
2. Navigate to the **VIRTUAL MACHINES** tab and select your offer.
3. From the left hand side menu, click the **PRICING** tab.
4. Under the Pricing tab, select a region whose pricing you want to reset.

    ![drawing](media/marketplace-publishing-vm-image-post-publishing/img08-04.png)

5. In case of SKUs with hourly billing model, reset the prices for all the cores as they are in the production for the selected region. For SKUs with BYOL billing model, make the SKU available in the region by checking the checkbox against the SKU under the section EXTERNALLY-LICENSED (BYOL) SKU AVAILABILITY (see the screenshot below).

    ![drawing](media/marketplace-publishing-vm-image-post-publishing/img08-05.png)

6. Now click the button **AUTOPRICE OTHER MARKETS BASED ON PRICES IN UNITED STATES**.

    >[AZURE.NOTE] The button’s label may be different depending on the region which you have selected. Since we have selected United States while creating this document, so the button is labeled as “Auto price other markets based on prices in United States” in the screenshot below.

    ![drawing](media/marketplace-publishing-vm-image-post-publishing/img08-06.png)

7. The auto price wizard will open. The first page displays the selection for base market. Make your section and move to the next page by clicking on the **“->”** button.

    ![drawing](media/marketplace-publishing-vm-image-post-publishing/img08-07.png)

8. Option for selecting the cores and plans will be displayed on the page 2. Select the desired plans and the cores and click “->” button.

    ![drawing](media/marketplace-publishing-vm-image-post-publishing/img08-08.png)

9. Page 3 displays the markets/regions. Click the Toggle All button to select all regions or manually check the boxes for region. Click on the “->” button to move to the next page.

    ![drawing](media/marketplace-publishing-vm-image-post-publishing/img08-09.png)

10. Page 4 displays the exchange rates. Click on the finish button to complete the steps. The wizard will reset the pricing according to your selection.

11. Now navigate to the pricing tab and click the “VIEW SUMMARY AND CHANGES” button.
Select “Draft” in the “View Version” section and “Production” in “Compare with” section (see the screenshot below). If you see no pricing difference, it implies pricing has been reverted to the production values successfully.

    ![drawing](media/marketplace-publishing-vm-image-post-publishing/img08-11.png)

12. After making the changes, navigate to the PUBLISH tab and click on the button **PUSH TO STAGING**. For detailed guidance on testing your offer in the staging environment please refer to this [link](marketplace-publishing-vm-image-test-in-staging.md)
13. Once you have tested your offer in staging, navigate to the PUBLISH tab in the Publishing portal and click on the button **REQUEST APPROVAL TO PUSH TO PRODUCTION** to re-publish your offer in the Azure Marketplace.

## 9. How to revert billing model to production values
I have changed the billing model of a listed SKU. Since it is not supported in the Azure Marketplace, I want to revert my changes to the production values. How do I achieve that?

Please follow the steps below:

1. Login to the [Publishing portal](https://publish.windowsazure.com).
2. Navigate to the **VIRTUAL MACHINES** tab and select your offer.
3. From the left hand side menu, click the **SKUS** tab.
4. Click EDIT button to revert the billing model. A window will open. Check or uncheck the checkbox **‘Billing and licensing is done externally from Azure (aka Bring Your Own License)’** accordingly.

    ![drawing](media/marketplace-publishing-vm-image-post-publishing/img09-04.png)

5. Once done please refer to the answer of the question 8 in this document to revert back the pricing.
6. After that navigate to the **PUBLISH** tab in the Publishing portal and push the offer to staging to test it. Once you are done with testing the offer, then click on the button **REQUEST APPROVAL TO PUSH TO PRODUCTION** to re-publish your offer in the Azure Marketplace.

## 10. How to revert visibility setting of a listed SKU to the production value

Please follow the steps below:

1. Login to the [Publishing portal](https://publish.windowsazure.com).
2. Navigate to the **VIRTUAL MACHINES** tab and select your offer.
3. From the left hand side menu, click the **SKUS** tab.
4. Select your SKU and revert the visibility setting of the SKU to the production value.

    ![drawing](media/marketplace-publishing-vm-image-post-publishing/img10-04.png)

5. Once you are done with the changes, then click on the button **REQUEST APPROVAL TO PUSH TO PRODUCTION** to re-publish your offer in the Azure Marketplace.

## See Also
- [Getting Started: How to publish an offer to the Azure Marketplace](marketplace-publishing-getting-started.md)
- [Understanding seller insights reporting](marketplace-publishing-report-seller-insights.md)
- [Understanding payout reporting](marketplace-publishing-report-payout.md)
- [How to change your Cloud Solution Provider reseller incentive](marketplace-publishing-csp-incentive.md)
- [Troubleshooting common publishing problems in the Marketplace](marketplace-publishing-support-common-issues.md)
- [Get support as a publisher](marketplace-publishing-get-publisher-support.md)
- [Creating a VM image on-premises](marketplace-publishing-vm-image-creation-on-premise.md)
- [Create a virtual machine running Windows in the Azure preview portal](../virtual-machines/virtual-machines-windows-hero-tutorial.md)

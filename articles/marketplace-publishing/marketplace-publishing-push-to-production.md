<properties
   pageTitle="Deploy your offer to the Azure Marketplace | Microsoft Azure"
   description="Learn about and walk through the instructions to deploy your offer--virtual machine image, developer service, data service, etc.--to the Azure Marketplace."
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

# Deploy your offer to the Azure Marketplace
When you are satisfied with your offer (that is, you have tested customer scenarios, marketing content, etc.) and you are ready to launch, request **Push to production** on the **Publish** tab.  

1. The four steps under the WALKTHROUGH page in the Publishing portal should be completed and green. For Virtual Machine offers, ensure that the following guidelines are followed.

    ![drawing][img-pubportal-walkthru-checked]

2. Select the **Publish** tab from the list on the left side.

    ![drawing][img-pubportal-menu-publish]

3. Click the button **Request approval to push to production**. Once the request is made, the approval team executes a final review, and then your offer will be available in the Azure Marketplace.

    ![drawing][img-pubportal-publish-pushproduction]

>[AZURE.NOTE] In case of Virtual Machines, when you click on the button Request approval to push to production, the following steps are performed behind the scene. You will be able to view the progress of each step under the PUBLISH tab in the Publishing portal. You must check this page at regular interval (until the status shows "Listed") for any failure information which need correction from your end.

> - At first your production request goes to the certification team who validate the vhd. However, if you are updating your already listed offer and the request has got only marketing change, then the certification step is skipped.
> - At the next step, the request come to the content validation team who verify the marketing content of the offer.
> - If the above steps are successful, then the offer is approved in production. At this time, the status become "Listed" in the publishing portal. However, this “Listed” status does not imply that the process is complete. The following steps need to be complete before the offer is available in the Azure Marketplace.
> - Once the offer is approved in production in the step above, replication of the offer start across all the Azure datacenters. It generally takes 24-48hours for the replication to complete but may take up to a week depending on the size of the vhd. However, if you are updating your already listed offer and it has got only marketing change, then the replication is faster.
> - When the replication is complete, then the offer will be available in the Azure Marketplace.

> [AZURE.IMPORTANT] You can always delete the offer while it is in a **Draft** status (i.e., never **Push to staging** or **Push to production**). On the **History** tab, click the **Discard draft** button at the bottom of the page to delete a draft.


## Production checklist for all Virtual Machine offers

- Ensure that you are a Microsoft Azure Certified partner
- Under the SKUs tab, the option "Hide this SKU from the Marketplace because it should always be bought via a solution template" should be marked as YES only if the SKU is a part of a Solution Template. In all the other cases, this option should always be marked as NO.
- Remember: You should not change the SKU visibility setting once the SKU is listed. We do not support this functionality.
- Ensure that the logos adhere to the Azure Marketplace logo guidelines given below.
- Offer and SKU description shouldn’t be same.
- SKU’s Title and Offer Long summary shouldn’t be same.
- SKU Title and Offer Summary shouldn’t be same.
- SKU Titles should not be identical for an offer with multiple SKUs.

**Azure Marketplace logo guidelines**

- The Azure design has a simple color palette. Keep the number of primary and secondary colors on your logo low.
- The theme colors of the Azure portal are white and black. Hence avoid using these colors as the background color of your logos. Use some color that would make your logos prominent in the Azure portal. We recommend simple primary colors. If you are using transparent background, then make sure that the logo/text is not white or black.
- Do not use a gradient background on the logo.
- Avoid placing text, even your company or brand name, on the logo.
- The look and feel of your logo should be 'flat' and should avoid gradients.
- The logo should not be stretched.

**Additional guidelines for the Hero logo:**

- The Hero logo is optional. The publisher can choose not to upload a Hero logo. **However once uploaded the hero icon cannot be deleted from the Publishing portal. At that time, the partner must follow the Azure Marketplace guidelines for Hero icons else the offer will not be approved to production.**
- The Publisher Display Name, SKU title and the offer long summary are displayed in white font color. Hence you should avoid keeping any light color in the background of the Hero Icon. Black, white and transparent background is not allowed for Hero icons.
- The publisher display name, SKU title, the offer long summary and the create button are embedded programmatically inside the Hero logo once the offer goes listed. So you should not enter any text while you are designing the Hero logo. Just leave empty space on the right because the text (i.e. publisher display name, SKU title, the offer long summary) will be included programmatically by us over there. The empty space for the text should be 415x100 on the right (and it is offset by 370px from the left).


## Additional production checklist for already listed Virtual Machine offers

- Check if there is already an offer with the same offer name from your company. If yes, then you should add a new version of the SKU in the existing offer instead of creating a new duplicate offer.
- Data disk should not change between two versions of the same SKU.
- The Azure Marketplace does not support pricing change of the listed SKUS as it impacts the billing of the existing customers. Ensure that you do not change the pricing of the listed SKUs in the regions where the SKU is available. However, you can add new SKUs or add new regions to an existing SKU.


## Next steps
Once the offer goes live, test the customer scenarios to validate that all the contracts and functionality work properly in the production environment as tested and validated in the staging environment.

## See also
- [Getting started: How to publish an offer to the Azure Marketplace](marketplace-publishing-getting-started.md)

[img-pubportal-walkthru-checked]:media/marketplace-publishing-push-to-production/pubportal-walkthru-checked.png
[img-pubportal-menu-publish]:media/marketplace-publishing-push-to-production/pubportal-menu-publish.png
[img-pubportal-publish-pushproduction]:media/marketplace-publishing-push-to-production/pubportal-publish-pushproduction.png

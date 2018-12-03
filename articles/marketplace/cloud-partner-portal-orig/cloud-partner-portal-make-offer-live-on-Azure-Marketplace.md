---
title: Make your Virtual Machine offer live on Azure Marketplace
description: Make your Virtual Machine offer live on Azure Marketplace
services: Azure, Marketplace, Cloud Partner Portal, 
documentationcenter:
author: qianw211
manager: Patrick.Butler  
editor:

ms.assetid: 
ms.service: marketplace
ms.workload: 
ms.tgt_pltfrm: 
ms.devlang: 
ms.topic: conceptual
ms.date: 09/13/2018
ms.author: pbutlerm
---

Make your Virtual Machine offer live on Azure Marketplace
=========================================================

Once you've populated all the offer details, it's time to publish
your offer and make it live on Azure Marketplace. There are a few stages the offer goes through. Make sure both your marketing content and
your VM image meet the quality requirements, in order to be Azure Certified and go live on the website.

![Offer Go Live Sequence
0](./media/cloud-partner-portal-offer-go-live-azure-marketplace/makeanofferlive.png)

Let's go through this process in more detail to better understand what
is happening during each step. In this process, you
will need to act to ensure your offer continues to make progress.

Publishing Process
------------------

Click "Publish" under the Editor tab to start the Publish process.

![Offer Go Live Sequence 
1 - Publish](./media/cloud-partner-portal-offer-go-live-azure-marketplace/publish.png)

Under the Status tab, you will see the Publishing Steps and where your
offer is in the process.

![Offer Go Live Sequence
2 - status](./media/cloud-partner-portal-offer-go-live-azure-marketplace/status.png)

At any point in the publishing process, you can also sign in and click the All Offers tab to view the latest status for any of your offers. You
can click directly on the status for your offer and see the details on
where your offer is in the publishing process.

![Offer Go Live Sequence
3 - all offers status](./media/cloud-partner-portal-offer-go-live-azure-marketplace/alloffersstatus.png)

Let's walk through each of the publishing steps, discuss what happens at
each step and how long you should estimate each step will take.

**Validate Pre-Requisites (\<1 day)**

When you click "Publish", an automated check will take place to ensure you've populated all the required fields on your offer. If any fields
are not populated, a warning will appear next to the field and you will
need to populate it accurately then click 'Publish' again.

Once you've completed this step correctly, a pop-up will appear asking
for an email address. This is the email to which you will receive
publishing status notifications for the remainder of the publishing
process. Once you submit your email address, this step is complete.

![Offer Go Live Sequence
4 - Publish Your Offer](./media/cloud-partner-portal-offer-go-live-azure-marketplace/publishyouroffer.png)

**Certification (\<5 days)**

This step is where we run several tests to ensure your VM image meets
the requirements for Azure Certified. All the guidance you will need to
ensure you pass the certification requirements are
[here](https://docs.microsoft.com/azure/marketplace-publishing/marketplace-publishing-vm-image-creation-prerequisites).

Since this step can take several days, you can sign out of the Cloud
Partner Portal. We will send you an email notification if there are any
errors that you need to address. If everything passes with success, the
process will automatically move on to the Provisioning step.

**Provisioning (\<1 day)**

During this stage, we are replicating your images to all global Azure
data centers, and can take up to a day to complete.

**Packaging and Lead Generation Registration (\<1 hour)**

During this stage, we are combining the technical and marketing content
into what will be the product page on the website.

Additionally, if you configured the Lead Generation feature, we will
validate that your CRM integration is working by sending a test lead to
your CRM. You will see a record with fake data populate in your CRM or
Azure Table after this step is complete. All documentation for Lead
Generation is located
[here](./cloud-partner-portal-get-customer-leads.md).

**Offer Available in Preview**

You will get a notification email that your offer has successfully
completed the steps required to access the offer in preview. During this
step, you should preview your offer and make sure everything looks as it
should be and that your VM properly deploys in the staging environment.

**Only whitelisted subscriptions can do this verification.**\*

**Publisher signoff**

Once you verify everything looks correct and works properly in preview,
you are ready to go live. To do this, click Go Live under the status tab
and we will begin steps to make your offer live in production and on the
website. Typically, it will take several hours from the time you click
Go Live and when the offer is live on the website. We will send you an
email notification once your offer is officially live on the website.

![Offer Go Live Sequence
5 - go live](./media/cloud-partner-portal-offer-go-live-azure-marketplace/golive.png)

**Live**

Your offer is now Live on Azure Marketplace and Azure Portal, and
customers will be able to view and deploy your virtual machine in their
Azure subscriptions. At any point, you can click on the All offers tab,
and see the status for all your offers listed on the right column. You
can click on the status to see the publishing flow status in detail for
your offer.

Error Handling
--------------

During the publishing process, an error may be encountered. If an error
is encountered, you will receive a notification email informing you that
an error occurred with instructions on next steps. You can also see
errors at any time during this process by clicking the Status tab. You
will see which point in the process the error occurred along with an
error message outlining what needs to be resolved.

![Offer Go Live Sequence
6 - error message](./media/cloud-partner-portal-offer-go-live-azure-marketplace/errormessage.png)

If you encounter errors during the publishing process, you are required
to fix these then click 'Publish' to restart the process. You must start
at the beginning of the publishing steps at Validate Pre-Requisites when
re-publishing after any error fix.

If you are having issues resolving an error, you should open a support
request to get help from our support engineers.

![Offer Go Live Sequence
7 - get support](./media/cloud-partner-portal-offer-go-live-azure-marketplace/getsupport.png)

Canceling the publishing request
--------------------------------

You might start the process of publishing and have a need to cancel your
request. You can only cancel a publishing request once the publish
request reaches the Publisher Sign-off step. To cancel, click on 'Cancel
Publish'. The publishing status will reset to Step 1, and to publish
again, you should click Publish and follow the steps in the status.

![Offer Go Live Sequence
8 - status](./media/cloud-partner-portal-offer-go-live-azure-marketplace/status5.png)


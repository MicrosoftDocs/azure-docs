---
title: 'Status of Microsoft Sentinel solution after publishing in the Microsoft Partner center'
description: This article walks you through the details of tracking solutions post publish in Microsoft Partner center.
author: anilgodavarthy
ms.author: angodavarthy
ms.service: microsoft-sentinel
ms.topic: conceptual 
ms.date: 10/09/2024

#CustomerIntent: As a ISV partner, I want to track the status of my solution so that I can correct any issues and ensure that my solution is available to customers in Azure Marketplace and in Sentinel Content hub.
---

# Solution tracking after publishing in the Microsoft Partner center

This document explains what happens once your offer is successfully published. Within partner center, your solution would be referred to as an offer (the terms solution and offer are used interchangeably in the context of this document). Once you publish the offer, the offer goes through a series of validation checks before it becomes live in Azure Marketplace and in the Sentinel content hub. 

If you didn't create an offer yet, follow the steps in the [Publish solutions to Microsoft Sentinel](publish-sentinel-solutions.md) article.

## Step 1: Automated validation phase
The first step in the publishing process is a set of automated validations to ensure that the offer is set up correctly and can be provisioned successfully. This step can take anywhere between 1-2 hours. Any issues identified in the validation phase should be fixed before offer can proceed to the next stage in its lifecycle. 

Once the offer is published, the owner of your developer account is notified via email. The notifications are also shown under Action Center in Partner Center. In addition, you can add users with either the developer or manager role from your developer account to receive the notifications. For more information about Action Center, see [Action Center Overview](/partner-center/action-center/action-center-overview). For more information about adding members, see [Notifications](/partner-center/marketplace-offers/review-publish-offer#notifications).

## Step 2: Preview creation
During the preview creation phase, we create a version of your offer that is accessible only to the preview audience you specified during offer creation. The preview version of your offer isn't available to anyone outside the preview audience until you make the offer live (step 3). Don't use the preview audience settings to give people outside your organization visibility into an offer. Use the Private Offer option instead. At this point, your offering isn't yet fully tested and validated, and hence isn't ready for outside distribution.

## Step 3: Publisher approval
An email is sent to you once the offer is created successfully. At this point, you can review and approve your offer. You can also refresh the Offer overview page in your browser to see if your offer reaches the Publisher approval phase. If it has, the Go live button and preview links are available. Ensure that you validated all aspects of your solution in preview phase before you make the offer live. Ensure that you validate all aspects of your solution in preview phase before you make the offer live. 

:::image type="content" source="media/sentinel-solutions-post-publish-tracking/partner-go-live-button.png" alt-text="Screenshot of the go live button activatedn view in partner center." lightbox="media/sentinel-solutions-post-publish-tracking/partner-go-live-button.png":::   

## Step 4: Certification
Offers submitted to the commercial marketplace must be certified before being published. Offers undergo a series of rigorous automated and manual validations. To learn more, see [commercial marketplace certification policies](/legal/marketplace/certification-policies). As part of the manual validations, we check for publisher business eligibility, content validation (appropriate title, well written descriptions, quality screenshots etc.), and technical validations (Malware scanning, package analysis etc.).

If your offer fails any of the checks or if you aren't eligible to submit an offer of that type, a certification failure report is sent to your email address. The errors also show up within Action Center in Partner Center. This report contains descriptions of any policies that failed, along with review notes. Review this report, address any issues, make updates to your offer where needed, and resubmit the offer using the [commercial marketplace portal](https://go.microsoft.com/fwlink/?linkid=2165935) in Partner Center. You can resubmit the offer as many times as needed until passing certification.

If there are certification failures, you can select the "View certification link" to review the issues.

:::image type="content" source="media/sentinel-solutions-post-publish-tracking/partner-certification-failures.png" alt-text="Screenshot showing errors during certification phase in partner center." lightbox="media/sentinel-solutions-post-publish-tracking/partner-certification-failures.png" :::  

## Step 5: Publishing
In this step, we perform a series of final validation checks to ensure the live offer is configured just like the preview version of the offer. After these validation checks are complete, your offer will be live in the marketplace. You can select the Azure Marketplace link under Publish step to navigate to the published solution in Azure Marketplace (visible to customers).

:::image type="content" source="media/sentinel-solutions-post-publish-tracking/partner-publish-view.png" alt-text="Screenshot showing the final validations during publish phase." lightbox="media/sentinel-solutions-post-publish-tracking/partner-publish-view.png" :::  

## Step 6: Solution availability in Sentinel content hub
Once the solution is published in Azure Marketplace, it takes anywhere between 1-2 days before the solution is available in Sentinel content hub. If you published your solution over the weekend, your solution is available by Tuesday. Once your solution is synced to Sentinel, customers are able to find the same in Content hub and can manage the entire lifecycle within Sentinel (install, configure, monitor, uninstall etc.)

:::image type="content" source="media/sentinel-solutions-post-publish-tracking/partner-solution-content-hub.png" alt-text="Screenshot showing the solution in Sentinel Content hub." lightbox="media/sentinel-solutions-post-publish-tracking/partner-solution-content-hub.png" :::  

## Related content

[Discover and manage Microsoft Sentinel out-of-the-box content](/azure/sentinel/sentinel-solutions-deploy?tabs=azure-portal#discover-content)
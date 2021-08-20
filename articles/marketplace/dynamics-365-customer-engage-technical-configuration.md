---
title: Set up Dynamics 365 for Customer Engagement & PowerApps offer technical configuration on Microsoft AppSource - Azure Marketplace
description: Set up Dynamics 365 for Customer Engagement & PowerApps offer technical configuration on Microsoft AppSource (Azure Marketplace.
ms.service: marketplace 
ms.subservice: partnercenter-marketplace-publisher
ms.topic: how-to
ms.custom: references_regions
author: vamahtan
ms.author: vamahtan
ms.date: 06/29/2021
---

# Set up Dynamics 365 for Customer Engagement & Power Apps offer technical configuration

This page defines the technical details used to connect to your offer. This connection lets us provision your offer for the customers who choose to acquire it.

## Offer information

**Base license model** determines how customers are assigned your application in the CRM Admin Center. Do one of the following:

- Select **Resource** for instance-based licensing
- Select **User** if licenses are assigned one per tenant or if you chose to manage your app licenses through Microsoft.

The **Requires S2S outbound and CRM Secure Store Access** check box enables configuration of CRM Secure Store or Server-to-Server (S2S) outbound access. This feature requires specialized consideration from the Dynamics 365 Team during the certification phase. Microsoft will contact you to complete additional steps to support this feature.

Leave **Application configuration URL** blank; it is for future use.

## CRM package

In the **URL of your package location** box, enter the URL of the Azure Blob Storage account that contains the uploaded CRM package .zip file. Include a read-only SAS key in the URL so Microsoft can pick up your package for verification.

> [!IMPORTANT]
> To avoid a publishing block, make sure that the expiration date in the URL of your Blob storage hasn’t expired. You can revise the date by accessing your policy. We recommend the **Expiry time** be at least one month in the future.

Select the **There is more than one CRM package in my package file** box if applicable. If so, be sure to include all the packages in your .zip file.

For detailed information on how to build your package and update its structure, see [Step 3: Create an AppSource package for your app](/powerapps/developer/common-data-service/create-package-app-appsource).

## CRM package availability

Select **+ Add region** to specify the geographic regions in which your CRM package will be available to customers. Do not select any of the following sovereign regions: US Gov Cloud Sovereign, China Cloud Sovereign, Germany Sovereign, US Gov High Cloud Sovereign, Test in production Sovereign, or US DoD Cloud Sovereign.

By default, the **Application configuration URL** you entered above will be used for each region. Leave the Application Configuration URL field blank.

Select **Save draft** before continuing to the next tab in the left-nav menu, **Co-sell with Microsoft**. For information on setting up co-sell with Microsoft (optional), see [Co-sell with Microsoft sales teams and partners overview](./co-sell-overview.md). If you're not setting up co-sell or you've finished, continue with **Next steps** below.

## Next steps

- [Configure supplemental content](dynamics-365-customer-engage-supplemental-content.md)
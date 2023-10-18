---
title: Control external access to resources in Microsoft Entra ID with sensitivity labels 
description: Use sensitivity labels as a part of your overall security plan for external access
services: active-directory
author: janicericketts
manager: martinco
ms.service: active-directory
ms.workload: identity
ms.subservice: fundamentals
ms.topic: conceptual
ms.date: 02/23/2023
ms.author: jricketts
ms.reviewer: ajburnle
ms.custom: "it-pro, seodec18"
ms.collection: M365-identity-device-management
---

# Control external access to resources in Microsoft Entra ID with sensitivity labels 

Use sensitivity labels to help control access to your content in Office 365 applications, and in containers like Microsoft Teams, Microsoft 365 Groups, and SharePoint sites. They protect content without hindering user collaboration. Use sensitivity labels to send organization-wide content across devices, apps, and services, while protecting data. Sensitivity labels help organizations meet compliance and security policies. 
 
See, [Learn about sensitivity labels](/microsoft-365/compliance/sensitivity-labels?view=o365-worldwide&preserve-view=true)

## Before you begin

This article is number 8 in a series of 10 articles. We recommend you review the articles in order. Go to the **Next steps** section to see the entire series. 

## Assign classification and enforce protection settings

You can classify content without adding any protection settings. Content classification assignment stays with the content while it’s used and shared. The classification generates usage reports with sensitive-content activity data.

Enforce protection settings such as encryption, watermarks, and access restrictions. For example, users apply a Confidential label to a document or email. The label can encrypt the content and add a Confidential watermark. In addition, you can apply a sensitivity label to a container like a SharePoint site, and help manage external users access.

Learn more:

* [Restrict access to content by using sensitivity labels to apply encryption](/microsoft-365/compliance/encryption-sensitivity-labels?view=o365-worldwide&preserve-view=true)
* [Use sensitivity labels to protect content in Microsoft Teams, Microsoft 365 Groups, and SharePoint sites](/microsoft-365/compliance/sensitivity-labels-teams-groups-sites)

Sensitivity labels on containers can restrict access to the container, but content in the container doesn't inherit the label. For example, a user takes content from a protected site, downloads it, and then shares it without restrictions, unless the content had a sensitivity label.

 >[!NOTE]
>To apply sensitivity labels users sign into their Microsoft work or school account.

## Permissions to create and manage sensitivity levels

Team members who need to create sensitivity labels require permissions to: 

* Microsoft 365 Defender portal,
* Microsoft Purview compliance portal, or 
* [Microsoft Purview compliance portal](/purview/microsoft-365-compliance-center?view=o365-worldwide&preserve-view=true)

By default, tenant Global Administrators have access to admin centers and can provide access, without granting tenant Admin permissions. For this delegated limited admin access, add users to the following role groups: 

* Compliance Data Administrator,
* Compliance Administrator, or 
* Security Administrator

## Sensitivity label strategy

As you plan the governance of external access to your content, consider content, containers, email, and more.

### High, Medium, or Low Business Impact

To define High, Medium, or Low Business Impact (HBI, MBI, LBI) for data, sites, and groups, consider the effect on your organization if the wrong content types are shared. 

* Credit card, passport, national/regional ID numbers
  * [Apply a sensitivity label to content automatically](/microsoft-365/compliance/apply-sensitivity-label-automatically?view=o365-worldwide&preserve-view=true)
* Content created by corporate officers: compliance, finance, executive, etc.
* Strategic or financial data in libraries or sites. 

Consider the content categories that external users can't have access to, such as containers and encrypted content. You can use sensitivity labels, enforce encryption, or use container access restrictions. 

### Email and content

Sensitivity labels can be applied automatically or manually to content. 

See, [Apply a sensitivity label to content automatically](/purview/apply-sensitivity-label-automatically?view=o365-worldwide&preserve-view=true)

#### Sensitivity labels on email and content

A sensitivity label in a document or email is customizable, clear text, and persistent. 

* **Customizable** - create labels for your organization and determine the resulting actions 
* **Clear text** - is incorporated in metadata and readable by applications and services
* **Persistency** - ensures the label and associated protections stay with the content, and help enforce policies

> [!NOTE]
> Each content item can have one sensitivity label applied.

### Containers

Determine the access criteria if Microsoft 365 Groups, Teams, or SharePoint sites are restricted with sensitivity labels. You can label content in containers or use automatic labeling for files in SharePoint, OneDrive, etc.

Learn more: [Get started with sensitivity labels](/microsoft-365/compliance/get-started-with-sensitivity-labels?view=o365-worldwide&preserve-view=true)

#### Sensitivity labels on containers

You can apply sensitivity labels to containers such as Microsoft 365 Groups, Microsoft Teams, and SharePoint sites. Sensitivity labels on a supported container apply the classification and protection settings to the connected site or group. Sensitivity labels on these containers can control:

* **Privacy** - select the users who can see the site
* **External user access** - determine if group owners can add guests to a group
* **Access from unmanaged devices** - decide if and how unmanaged devices access content

   ![Screenshot of options and entries under Site and group settings.](media/secure-external-access/8-edit-label.png)

Sensitivity labels applied to a container, such as a SharePoint site, aren't applied to content in the container; they control access to content in the container. Labels can be applied automatically to the content in the container. For users to manually apply labels to content, enable sensitivity labels for Office files in SharePoint and OneDrive.

Learn more:

* [Enable sensitivity labels for Office files in SharePoint and OneDrive](/purview/sensitivity-labels-sharepoint-onedrive-files?view=o365-worldwide&preserve-view=true).
* [Use sensitivity labels to protect content in Microsoft Teams, Microsoft 365 Groups, and SharePoint sites](/purview/sensitivity-labels-teams-groups-sites)
* [Assign sensitivity labels to Microsoft 365 groups in Microsoft Entra ID](../enterprise-users/groups-assign-sensitivity-labels.md)

### Implement sensitivity labels

After you determine use of sensitivity labels, see the following documentation for implementation.

* [Get started with sensitivity labels](/purview/get-started-with-sensitivity-labels?view=o365-worldwide&preserve-view=true)
* [Create and publish sensitivity labels](/purview/create-sensitivity-labels?view=o365-worldwide&preserve-view=true)
* [Restrict access to content by using sensitivity labels to apply encryption](/purview/encryption-sensitivity-labels?view=o365-worldwide&preserve-view=true)

## Next steps

Use the following series of articles to learn about securing external access to resources. We recommend you follow the listed order.

1. [Determine your security posture for external access with Microsoft Entra ID](1-secure-access-posture.md)

2. [Discover the current state of external collaboration in your organization](2-secure-access-current-state.md)

3. [Create a security plan for external access to resources](3-secure-access-plan.md)

4. [Secure external access with groups in Microsoft Entra ID and Microsoft 365](4-secure-access-groups.md) 

5. [Transition to governed collaboration with Microsoft Entra B2B collaboration](5-secure-access-b2b.md) 

6. [Manage external access with Microsoft Entra entitlement management](6-secure-access-entitlement-managment.md) 

7. [Manage external access to resources with Conditional Access policies](7-secure-access-conditional-access.md) 

8. [Control external access to resources in Microsoft Entra ID with sensitivity labels](8-secure-access-sensitivity-labels.md) (You're here)

9. [Secure external access to Microsoft Teams, SharePoint, and OneDrive for Business with Microsoft Entra ID](9-secure-access-teams-sharepoint.md) 

10. [Convert local guest accounts to Microsoft Entra B2B guest accounts](10-secure-local-guest.md)

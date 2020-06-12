---

title: Download a list of groups in the Azure Active Directory portal | Microsoft Docs
description: Download group properties in bulk in the Azure admin center in Azure Active Directory. 
services: active-directory 
author: curtand
ms.author: curtand
manager: mtillman
ms.date: 04/16/2020
ms.topic: how-to
ms.service: active-directory
ms.subservice: users-groups-roles
ms.workload: identity
ms.custom: it-pro
ms.reviewer: jeffsta
ms.collection: M365-identity-device-management
---

# Bulk download a list of groups in Azure Active Directory

Using Azure Active Directory (Azure AD) portal, you can bulk download the list of all the groups in your organization to a comma-separated values (CSV) file.

## To download a list of groups

1. Sign in to [the Azure portal](https://portal.azure.com) with an administrator account in the organization.
1. In Azure AD, select **Groups** > **Download groups**.
1. On the **Groups download** page, select **Start** to receive a CSV file listing your groups.

   ![The download groups command is on the All groups page](./media/groups-bulk-download/bulk-download.png)

## Check download status

You can see the status of all of your pending bulk requests in the **Bulk operation results** page.

[![](media/groups-bulk-download/bulk-center.png "Check status in the Bulk Operations Results page")](media/groups-bulk-download/bulk-center.png#lightbox)

## Bulk download service limits

Each bulk activity to download a group list can run for up to one hour. This enables you to download a list of at least 300,000 groups.

## Next steps

- [Bulk remove group members](groups-bulk-remove-members.md)
- [Download members of a group](groups-bulk-download-members.md)

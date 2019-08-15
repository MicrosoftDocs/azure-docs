---

title: Download a list of groups in the Azure Active Directory portal | Microsoft Docs
description: Download group properties in bulk in the Azure admin center in Azure Active Directory. 
services: active-directory 
author: curtand
ms.author: curtand
manager: mtillman
ms.date: 08/15/2019
ms.topic: conceptual
ms.service: active-directory
ms.subservice: users-groups-roles
ms.workload: identity
ms.custom: it-pro
ms.reviewer: jeffsta
ms.collection: M365-identity-device-management
---

# Download a list of groups in Azure Active Directory

Azure Active Directory (Azure AD) supports bulk group list download, bulk import for group members, and bulk removal of group members.

## To download a list of groups

1. Sign in to your Azure AD organization with an administrator account in the organization.
1. In Azure AD, select **Groups** > **Download groups**.
1. On the **Groups download** page, select **Start** to receive a CSV file listing your groups.

   ![The download groups command is on the All groups page](./media/groups-bulk-download/bulk-download.png)

## Check download status

You can see the status of all of your pending bulk requests in the **Bulk operation results (preview)** page.

   ![The Bulk operations results page shows you bulk request status](./media/groups-bulk-download/bulk-center.png)

## Next steps

- [Bulk remove group members](groups-bulk-remove-members.md)
- [Download members of a group](groups-bulk-download-members.md)

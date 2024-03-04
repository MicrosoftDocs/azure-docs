---
title: Bulk download group membership list - Azure portal
description: Add users in bulk in the Azure admin center. 
services: active-directory 
author: barclayn
ms.author: barclayn
manager: amycolannino
ms.date: 04/24/2023
ms.topic: how-to
ms.service: active-directory
ms.subservice: enterprise-users
ms.workload: identity
ms.custom: it-pro
ms.reviewer: yuan.karppanen
ms.collection: M365-identity-device-management
---

# Bulk download members of a group in Azure Active Directory

You can bulk download the members of a group in your organization to a comma-separated values (CSV) file in the portal for Azure Active Directory (Azure AD), part of Microsoft Entra. All admins and non-admin users can download group membership lists.

## To bulk download group membership

[!INCLUDE [portal updates](~/articles/active-directory/includes/portal-update.md)]

1. Sign in to the [Azure portal](https://portal.azure.com) with an account in the organization.
1. In Azure AD, select **Groups** > **All groups**.
1. Open the group whose membership you want to download, and then select **Members**.
1. On the **Members** page, select **Bulk operations** and choose, **Download members** to download a CSV file listing the group members.

   ![The Download Members command is on the profile page for the group](./media/groups-bulk-download-members/download-panel.png)

## Check download status

You can see the status of all of your pending bulk requests in the **Bulk operation results** page.

[![Check status in the Bulk Operations Results page.](./media/groups-bulk-download-members/bulk-center.png)](./media/groups-bulk-download-members/bulk-center.png#lightbox)

## Bulk download service limits

Each bulk activity to download a list of group members can run for up to one hour. This enables you to download a list of at least 500,000 members.

## Next steps

- [Bulk import group members](groups-bulk-import-members.md)
- [Bulk remove group members](groups-bulk-download-members.md)

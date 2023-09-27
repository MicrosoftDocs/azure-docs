---
title: View update and sign-in activities for Managed identities
description: Step-by-step instructions for viewing the activities made to managed identities, and authentications carried out by managed identities
services: active-directory
documentationcenter: ''
author: barclayn
manager: amycolannino
editor: ''
ms.service: active-directory
ms.subservice: msi
ms.topic: how-to
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 06/24/2022
ms.author: barclayn
ms.collection: M365-identity-device-management
---

# View update and sign-in activities for Managed identities

This article will explain how to view updates carried out to managed identities, and sign-in attempts made by managed identities.

## Prerequisites

- If you're unfamiliar with managed identities for Azure resources, check out the [overview section](overview.md).
- If you don't already have an Azure account, [sign up for a free account](https://azure.microsoft.com/free/).

## View updates made to user-assigned managed identities

This procedure demonstrates how to view updates carried out to user-assigned managed identities

1. In the Azure portal, browse to **Activity Log**.

 ![Browse to the activity log in the Azure portal](./media/how-to-view-managed-identity-activity/browse-to-activity-log.png)

2. Select the **Add Filter** search pill and select **Operation** from the list.

![Start building the search filter](./media/how-to-view-managed-identity-activity/start-adding-search-filter.png)

3. In the **Operation** dropdown list, enter these operation names: "Delete User Assigned Identity" and "Write UserAssignedIdentities".

![Add operations to the search filter](./media/how-to-view-managed-identity-activity/add-operations-to-search-filter.png)

4. When matching operations are displayed, select one to view the summary.

![View summary of the operation](./media/how-to-view-managed-identity-activity/view-summary-of-operation.png)

5. Select the **JSON** tab to view more detailed information about the operation, and scroll to the **properties** node to view information about the identity that was modified.

![View detail of the operation](./media/how-to-view-managed-identity-activity/view-json-of-operation.png)

## View role assignments added and removed for managed identities

 > [!NOTE] 
 > You will need to search by the object (principal) ID of the managed identity you want to view role assignment changes for

1. Locate the managed identity you wish to view the role assignment changes for. If you're looking for a system-assigned managed identity, the object ID will be displayed in the **Identity** screen under the resource. If you're looking for a user-assigned identity, the object ID will be displayed in the **Overview** page of the managed identity.

User-assigned identity:

![Get object ID of user-assigned identity](./media/how-to-view-managed-identity-activity/get-object-id-of-user-assigned-identity.png)

System-assigned identity:

![Get object ID of system-assigned identity](./media/how-to-view-managed-identity-activity/get-object-id-of-system-assigned-identity.png)

2. Copy the object ID.
3. Browse to the **Activity log**.

 ![Browse to the activity log in the Azure portal](./media/how-to-view-managed-identity-activity/browse-to-activity-log.png)

4. Select the **Add Filter** search pill and select **Operation** from the list.

![Start building the search filter](./media/how-to-view-managed-identity-activity/start-adding-search-filter.png)

5. In the **Operation** dropdown list, enter these operation names: "Create role assignment" and "Delete role assignment".

![Add role assignment operations to the search filter](./media/how-to-view-managed-identity-activity/add-role-assignment-operations-to-search-filter.png)

6. Paste the object ID in the search box; the results will be filtered automatically.

![Search by object ID](./media/how-to-view-managed-identity-activity/search-by-object-id.png)
 
7. When matching operations are displayed, select one to view the summary.
 
![Summary of role assignment for managed identity](./media/how-to-view-managed-identity-activity/summary-of-role-assignment-for-msi.png)

## View authentication attempts by managed identities

1. Browse to **Microsoft Entra ID**.

![Browse to active directory](./media/how-to-view-managed-identity-activity/browse-to-active-directory.png)

2. Select **Sign-in logs** from the **Monitoring** section.

![Select sign-in logs](./media/how-to-view-managed-identity-activity/sign-in-logs-menu-item.png)

3. Select the **Managed identity sign-ins** tab.

![managed identity sign-in](./media/how-to-view-managed-identity-activity/msi-sign-ins.png)

4. The sign-in events will now be filtered by managed identities.

![managed identity sign-in events](./media/how-to-view-managed-identity-activity/msi-sign-in-events.png) 

5. To view the identity's Enterprise application in Microsoft Entra ID, select the “Managed Identity ID” column.
6. To view the Azure resource or user-assigned managed identity, search by name in the search bar of the Azure portal.

 > [!NOTE] 
 > Since managed identity authentication requests originate within the Azure infrastructure, the IP Address value is excluded here.

## Next steps

* [Managed identities for Azure resources](./overview.md)
* [Azure Activity log](../../azure-monitor/essentials/activity-log.md)
* [Microsoft Entra sign-ins log](../reports-monitoring/concept-sign-ins.md)

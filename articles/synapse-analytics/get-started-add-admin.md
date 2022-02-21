---
title: 'Quickstart: Get started add an Administrator' 
description: In this tutorial, you'll learn how to add another administrative user to your workspace.
author: saveenr
ms.author: saveenr
ms.reviewer: sngun
ms.service: synapse-analytics
ms.subservice: workspace
ms.topic: tutorial
ms.date: 04/02/2021
ms.custom: subject-rbac-steps
---

# Add an administrator to your Synapse workspace

In this tutorial, you'll learn how to add an administrator to your Synapse workspace. This user will have full control over the workspace.

## Overview

So far in the get started guide, we've focused on activities *you* do in the workspace. Because you created the workspace in STEP 1, you are an administrator of the Synapse workspace. Now, we will make another user Ryan (`ryan@contoso.com`) an administrator. When we are done, Ryan will be able to do everything you can do in the workspace.

## Azure RBAC: Owner role for the workspace

1. Open the Azure portal and open your Synapse workspace.
1. On the left side, select **Access control (IAM)**.
1. Select **Add** > **Add role assignment** to open the Add role assignment page.
1. Assign the following role. For detailed steps, see [Assign Azure roles using the Azure portal](../role-based-access-control/role-assignments-portal.md).
    
    | Setting | Value |
    | --- | --- |
    | Role | Owner |
    | Assign access to | USER |
    | Member | ryan@contoso.com |

    ![Add role assignment page in Azure portal.](../../includes/role-based-access-control/media/add-role-assignment-page.png)

1. Select **Save**. 
 
 
## Synapse RBAC: Synapse Administrator role for the workspace

Assign to `ryan@contoso.com` to Synapse RBAC **Synapse Administrator** role on the workspace.

1. Open your workspace in Synapse Studio.
1. On the left side, select  **Manage** to open the Manage hub.
1. Under **Security**, select **Access control**.
1. Select **Add**.
1. Leave **Scope** set to **Workspace**.
1. Add `ryan@contoso.com` to the **Synapse Administrator** role. 
1. Then select **Apply**.
 
## Azure RBAC: Role assignments on the workspace's primary storage account

1. Open the workspace's primary storage account in the Azure portal.
1. On the left side, select **Access control (IAM)**.
1. Select **Add** > **Add role assignment** to open the Add role assignment page.
1. Assign the following role. For detailed steps, see [Assign Azure roles using the Azure portal](../role-based-access-control/role-assignments-portal.md).
    
    | Setting | Value |
    | --- | --- |
    | Role 1 | Owner |
    | Role 2| Azure Storage Blob Data Contributor|
    | Assign access to | USER |
    | Member | ryan@contoso.com |

    ![Add role assignment page in Azure portal.](../../includes/role-based-access-control/media/add-role-assignment-page.png)

## Dedicated SQL pools: db_owner role

Assign `ryan@contoso.com` to the **db_owner** on each dedicated SQL pool in the workspace.

```
CREATE USER [ryan@contoso.com] FROM EXTERNAL PROVIDER; 
EXEC sp_addrolemember 'db_owner', 'ryan@contoso.com'
```

## Next steps

* [Get started with Azure Synapse Analytics](get-started.md)
* [Create a workspace](quickstart-create-workspace.md)
* [Use serverless SQL pool](quickstart-sql-on-demand.md)

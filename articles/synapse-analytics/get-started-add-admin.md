---
title: 'Tutorial: Get started add an Administrator' 
description: In this tutorial, you'll learn how to add another administrative user to your workspace.
services: synapse-analytics
author: saveenr
ms.author: saveenr
manager: julieMSFT
ms.reviewer: jrasnick
ms.service: synapse-analytics
ms.subservice: workspace
ms.topic: tutorial
ms.date: 04/02/2021 
---

# Add an administrator to your Synapse workspace

In this tutorial, you'll learn how to add an administrator to your Synapse workspace. This user will have full control over the workspace.

## Overview

So far in the get started guide, we've focused on activities *you* do in the workspace. Because you created the workspace in STEP 1, you are an administrator of the Synapse workspace. Now, we will make another user Ryan (`ryan@contoso.com`) an administrator. When we are done, Ryan will be able to do everything you can do in the workspace.

## Azure RBAC: Owner role for the workspace

Assign to `ryan@contoso.com` to Azure RBAC **Owner** role on the workspace.

1. Open the Azure portal and open you Synapse workspace.
1. On the left side, select **Access Control (IAM)**.
1. Add `ryan@contoso.com` to the **Owner** role. 
1. Click **Save**.
 
 
## Synapse RBAC: Synapse Administrator role for the workspace

Assign to `ryan@contoso.com` to Synapse RBAC **Synapse Administrator** role on the workspace.

1. Open your workspace in Synapse Studio.
1. On the left side, click **Manage** to open the Manage hub.
1. Under **Security**, click **Access control**.
1. Click **Add**.
1. Leave **Scope** set to **Workspace**.
1. Add `ryan@contoso.com` to the **Synapse Administrator** role. 
1. Then click **Apply**.
 
## Azure RBAC: Role assignments on the primary storage account

Assign to `ryan@contoso.com` to **Owner** role on the workspace's primary storage account.
Assign to `ryan@contoso.com` to **Azure Storage Blob Data Contributor** role on the workspace's primary storage account.

1. Open the workspace's primary storage account in the Azure portal.
1. On the left side, click **Access Control (IAM)**.
1. Add `ryan@contoso.com` to the **Owner** role. 
1. Add `ryan@contoso.com` to the **Azure Storage Blob Data Contributor** role

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

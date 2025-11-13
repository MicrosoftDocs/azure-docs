---
title: Manage sync of Arc resources to Azure Migrate project
description: Learn how to sync Arc-enabled resources, manage project scope, and configure automatic synchronization in Azure Migrate.
author: snehithm
ms.author: snmuvva
ms.service: azure-migrate
ms.topic: how-to
ms.date: 10/23/2025
ms.custom: engagement-fy25
monikerRange: migrate
---

# Manage sync of Arc resources to Azure Migrate project

This article describes how to sync Arc-enabled resources in Azure Migrate, manage project scope, and configure automatic synchronization.

When you create an Azure Migrate project for Arc resources, it syncs metadata from your Arc-enabled servers and SQL Server instances. As your environment changes, you need to sync the project to ensure assessments, and business cases reflect the current state of your infrastructure.

## Prerequisites

- You need an existing Azure Migrate project created for Arc resources. If you don't have one, see [Create a migrate project for Arc resources](quickstart-evaluate-readiness-savings-for-arc-resources.md).
- You also need **Migrate Arc Discovery Reader - Preview** role on subscriptions containing Arc resources you want to sync.

## Sync types
Azure Migrate supports the following sync types
- Manual sync
- Automatic sync

## Manual sync

Manual sync allows you to immediately refresh your Azure Migrate project with the latest data from your Arc-enabled resources.

### When to use manual sync

Use manual sync when:
- New Arc-enabled servers or SQL Server instances are added to subscriptions in scope
- Servers or SQL Server instances are removed from your environment
- Configuration of servers changes (CPU, memory, disk changes)
- You want to ensure the latest data before creating an assessment or business case

### Perform an on-demand sync

1. In the Azure portal, search for **Azure Arc** and select **Azure Arc** under Services.

2. Under **Migration**, select **Savings and Readiness (Preview)**.

3. On the toolbar, select **Sync Arc data**.

4. The sync process begins. Depending on the number of Arc resources in your subscriptions, this process might take several minutes.

5. You receive a notification when the sync completes successfully.

> [!NOTE]
> During sync, Azure Migrate collects metadata about your Arc-enabled resources but doesn't change the resources. When you perform an on-demand sync, change sync type, enable/disable tag sync or edit project scope, along with data sync, Azure Migrate also recalculates the default assessments and business cases.

## Automatic sync

Automatic sync configures your Azure Migrate project to periodically sync Arc resource data without manual intervention. This setting ensures your assessments and business cases always reflect the current state of your infrastructure.

### How automatic sync works

When you enable automatic sync:
- Azure Migrate uses the project's managed identity to access Arc resources
- The managed identity is automatically enabled when you create a project with Arc resources
- Automatic sync runs once every 24 hours. 
- You can manually trigger a sync anytime. Manual sync uses your identity, while automatic (periodic) sync uses the Azure Migrate project managed identity to perform the sync.


### Configure automatic sync

To configure automatic sync, you must first ensure the Azure Migrate project managed identity has appropriate permissions. 

#### Step 1: Assign managed identity permissions

The Azure Migrate project has a system-assigned managed identity that must be granted access to your Arc resources.

1. Navigate to your Azure Migrate project in the Azure portal.

2. Note the **Project name** as you'll need it to find the managed identity.

3. For each subscription containing Arc resources in your project scope:

   1. Navigate to the subscription in the Azure portal.
   
   2. Select **Access control (IAM)** from the left menu.
   
   3. Select **+ Add** > **Add role assignment**.
   
   4. On the **Role** tab, search for and select **Migrate Arc Discovery Reader - Preview**.
   
   5. Select **Next**.
   
   6. On the **Members** tab, select **Managed identity**.
   
   7. Select **+ Select members**.
   
   8. In the **Managed identity** dropdown, select **Migrate Project**.
   
   9. Search for and select your Azure Migrate project name.
   
   10. Select **Select**.
   
   11. Select **Review + assign** and complete the role assignment.

4. Repeat for all subscriptions in your project scope.

> [!IMPORTANT]
> Automatic sync won't work until the managed identity has the **Migrate Arc Discovery Reader - Preview** role on **all** subscriptions in your project scope.

#### Step 2: Enable automatic sync

1. In the Azure portal, search for **Azure Arc** and select **Azure Arc** under Services.

2. Under **Migration**, select **Savings and Readiness (Preview)**.

3. Select **View/edit scope** from the toolbar.
    
    :::image type="content" source="./media/how-to-manage-arc-resource-sync/edit-scope-entry-point.png" alt-text="Screenshot of Azure portal showing View/edit scope menu in the Savings and Readiness pane in Arc Center." lightbox="./media/how-to-manage-arc-resource-sync/edit-scope-entry-point.png":::

4. Select **Edit project scope**

5. In the **Edit project scope** pane, from the **Sync Type** drop down, select **Periodic (automatic)**.

    :::image type="content" source="./media/how-to-manage-arc-resource-sync/configure-automatic-sync.png" alt-text="Screenshot of Azure portal showing Scope type dropdown in the Edit project scope pane." lightbox="./media/how-to-manage-arc-resource-sync/configure-automatic-sync.png":::

6. Select **Save**.

### Disable automatic sync

To disable automatic sync:

1. In the Azure portal, search for **Azure Arc** and select **Azure Arc** under Services.

2. Under **Migration**, select **Savings and Readiness (Preview)**.

3. Select **View/edit scope** from the toolbar.

4. Select **Edit project scope**

5. In the **Edit project scope** pane, from the **Sync Type** drop down, select **On-demand (manual)**.

6. Select **Save**.

## Configure tag synchronization

Azure Migrate can synchronize Azure Resource Manager tags from your Arc-enabled resources to the Migrate inventory. Tag syncing helps you organize and filter resources in assessments and business cases.

### About tag synchronization

- **Default behavior**: Tag sync is enabled by default when you create a project
- **Sync scope**: Tags synced from Arc-enabled servers and SQL Server instances
- **Tag format**: Tags appear in Azure Migrate inventory with the same key-value pairs as in Azure Resource Manager
- **Update frequency**: Tags sync during manual or automatic sync operations
- **Use cases**: Filter resources by environment, application, cost center, or other organizational criteria

### Enable or disable tag synchronization

1. In the Azure portal, search for **Azure Arc** and select **Azure Arc** under Services.

2. Under **Migration**, select **Savings and Readiness (Preview)**.

3. Select **View/edit scope** from the toolbar.

4. Select **Edit project scope**

5. In the **Edit project scope** pane, select the **Sync tags** checkbox

6. Select **Save**.


> [!NOTE]
> - Disabling tag sync doesn't remove existing tags from the Migrate inventory. It only stops syncing new or updated tags.
> - To remove existing tags from the inventory, disable tag sync, then manually remove tags from resources in the Migrate inventory view.

After tags are synced, you can use them to create scoped assessments and business case in Azure Migrate. 

### View synced tags

After tags are synced:

1. Navigate to **Savings and Readiness (Preview)** in Azure Arc Center.

2. Select **View/Edit scope** > **View inventory**.

3. In the inventory view, you'll see tags displayed for each resource.

4. Use tags to filter and group resources when creating custom assessments or business cases.

## View and edit project scope

The project scope determines which subscriptions' Arc resources are included in your Azure Migrate project.

### View current scope

1. In the Azure portal, navigate to **Savings and Readiness (Preview)** in Azure Arc Center.

2. Select **View/edit scope** from the toolbar.

3. The dropdown menu shows two options:
   - **View Azure Arc resources in this project**: See all Arc resources currently in the project
   - **Edit project scope**: Modify which subscriptions are included

### View Azure Arc resources in this project

To view which Arc resources are currently included in your project:

1. Select **View/Edit scope** > **View Azure Arc resources in this project**.

2. You're redirected to the Azure Migrate inventory page showing:
   - All Arc-enabled servers in scope
   - All Arc-enabled SQL Server instances in scope
   - Configuration details

3. Use filters to view specific resource types or search for specific resources.

### Edit scope

To add or remove subscriptions from your project scope:

1. Select **View/edit scope** > **Edit project scope**.

2. In the **Edit project scope** pane, select the dropdown **Arc resources included from**.

3. Select/unselect the checkbox next to the subscriptions you want to add/remove. 

4. Select **Save** to apply changes. 

5. A sync automatically runs to include or exclude resources based on the new scope.

> [!IMPORTANT]
> When you add subscriptions to scope:
> - If using manual sync, you must have **Migrate Arc Discovery Reader - Preview** role on the subscription
> - The subscription must have the `Microsoft.OffAzure` resource provider registered
> - If using automatic sync, ensure the managed identity has the same **Migrate Arc Discovery Reader - Preview** role on the new subscriptions. 




## Next steps

- [View and review discovered inventory](how-to-review-discovered-inventory.md)
- [Build a business case](how-to-build-a-business-case.md)
- [Create an application assessment](create-application-assessment.md)
- [Enable additional data collection for Arc-enabled servers](how-to-enable-additional-data-collection-for-arc-servers.md)
---
title: Schedule an Environment for Automatic Deletion
description: Learn how to schedule a deletion date and time for an environment. Set an expiration date to specify when the environment and its resources are deleted.  
author: RoseHJM
ms.author: rosemalcolm
ms.service: azure-deployment-environments
ms.topic: how-to 
ms.date: 07/25/2025

# Customer intent: As a developer, I want automatically delete my environment on a specific date so that I can keep resources current.

---

# Schedule a deletion date for a deployment environment

In this article, you learn how to set an expiration date for a deployment environment. On the expiration date, Azure Deployment Environments automatically deletes the environment and all its resources. If your timeline changes, you can change the expiration date.

Working with many deployment environments across multiple projects can be challenging. Scheduled deletion helps you manage your environments by automatically deleting them on a specific date at a specific time. Using automatic expiration and deletion helps you keep track of your active and inactive environments and helps you avoid paying for environments that you no longer need. 

As a developer, you can view and schedule the expiration dates for your environment in the developer portal. You can schedule an environment for deletion when you create it, or at a later time. You can also change the expiration date and time for an environment that you created. 

Deployment Environments provides platform engineers with a centralized way of viewing and managing deletion schedules for environments in Azure portal. As a user with Project Admin permissions, you can schedule any environment in your project for deletion, regardless of who created it. You can also change the expiration date and time for any environment in your project.

## Prerequisites

- To schedule your own environment for automatic deletion, you must have the [Deployment Environments User](how-to-manage-deployment-environments-access.md) role.
- To schedule any environment in your project for automatic deletion, you must have the [DevCenter Project Admin](how-to-manage-deployment-environments-access.md) role.

## Add an environment

You can schedule an expiration date and time when you create an environment via the developer portal.

1. Sign in to the [developer portal](https://devportal.microsoft.com).
1. From the **New** menu at the top left, select **New environment**.
 
   :::image type="content" source="media/how-to-schedule-environment-deletion/new-environment.png" alt-text="Screenshot of that shows the New menu. New environment is highlighted.":::
 
1. In the **Add an environment** pane, enter or select the following values:

   |Field  |Value  |
   |---------|---------|
   |**Name**     | Enter a descriptive name for your environment. |
   |**Project**  | Select the project you want to create the environment in. If you have access to more than one project, you see a list of the available projects. |
   |**Type**     | Select the environment type you want to create. If you have access to more than one environment type, you see a list of the available types. |
   |**Definition** | Select the environment definition you want to use to create the environment. You see a list of the environment definitions available from the catalogs associated with your dev center. |
   |**Expiration** | Select **Enable scheduled deletion**. |

   :::image type="content" source="media/how-to-schedule-environment-deletion/add-environment-pane.png" alt-text="Screenshot showing the Add an environment pane. The Enable scheduled deletion checkbox is highlighted.":::

   If your environment is configured to accept parameters, you can enter them on a separate pane. In this example, you don't need to specify any parameters.

1. Under **Expiration**, select a **deletion date**, and then select a **deletion time**. 
   The date and time you select is the date and time that the environment and all its resources are deleted. If you want to change the date or time, you can do so later.

   :::image type="content" source="media/how-to-schedule-environment-deletion/set-expiration-date-time.png" alt-text="Screenshot showing the Add an environment pane. The select deletion date and time boxes are highlighted.":::

   You can also specify a time zone for the expiration date and time. Select the time zones button to see a list of time zones.
 
   :::image type="content" source="media/how-to-schedule-environment-deletion/select-time-zones.png" alt-text="Screenshot showing the Add an environment pane. The time zones button is highlighted.":::
 
1. Make sure that the time zone reflects the time zone you want to use for the expiration date and time. Select the time zone that you want to use.

   :::image type="content" source="media/how-to-schedule-environment-deletion/set-time-zone.png" alt-text="Screenshot showing the Add an environment pane. A selected time zone is highlighted.":::

1. Select **Create**. You see your environment in the developer portal immediately. An indicator shows that the environment is being created.

## Change an environment expiration date and time

Plans change, projects change, and timelines change. If you need to change the expiration date and time for an environment, you can do so in the developer portal.

1. Sign in to the [developer portal](https://devportal.microsoft.com).
 
1. On the environment you want to change, select the **Actions** menu (**...**), and then select **Change expiration**.
 
   :::image type="content" source="media/how-to-schedule-environment-deletion/environment-tile-actions.png" alt-text="Screenshot of the developer portal, showing an environment tile with the actions menu open, and Change expiration highlighted." lightbox="media/how-to-schedule-environment-deletion/environment-tile-actions.png":::

1. In the **Change \<environment> expiration** pane, you can change any of the following options:
   - Clear **Enable scheduled deletion** to disable scheduled deletion. 
   - Select a new date for expiration.
   - Select a new time for expiration.
   - Select a new time zone for expiration.
 
   :::image type="content" source="media/how-to-schedule-environment-deletion/change-expiration-date-time.png" alt-text="Screenshot showing the options for scheduled deletion." lightbox="media/how-to-schedule-environment-deletion/change-expiration-date-time.png":::

1. After you set the new expiration date and time, select **Change**.

## Schedule an environment deletion as a project admin

Developers might not always know when an environment is no longer needed. As a project admin, you can schedule the deletion of any environment in your project, regardless of who created it. 

1. Sign in to the [Azure portal](https://portal.azure.com), and select the project that contains the environment that you want to schedule for deletion.
 
1. In the left pane, under **Manage**, select **Environments**.
 
1. In the list of environments, for the environment you want to schedule for deletion, scroll right, and then select **...** > **Change expiration**.

   :::image type="content" source="media/how-to-schedule-environment-deletion/azure-portal-schedule-environment-deletion.png" alt-text="Screenshot showing the initial steps for changing an expiration." lightbox="media/how-to-schedule-environment-deletion/azure-portal-schedule-environment-deletion.png":::

1. In the **Change \<environment> expiration date** pane, select **Enable scheduled deletion**.
 
1. Select the date and time you want the environment to expire and be deleted, and then select **Save**.

   :::image type="content" source="media/how-to-schedule-environment-deletion/azure-portal-change-expiration-date.png" alt-text="Screenshot showing the change expiration date pane.":::

   The environment is now scheduled for deletion on the date and time you specified.

## Related content

* [Quickstart: Create and access Azure Deployment Environments by using the developer portal](quickstart-create-access-environments.md)



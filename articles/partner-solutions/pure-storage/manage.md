---
title: Manage settings for your Pure Storage resource via Azure portal
description: Manage settings, view resources, reconfigure metrics/logs, and more for your Pure Storage resource via Azure portal.

ms.topic: how-to
ms.date: 03/24/2025

---

# Manage Pure Storage resources

This article describes how to manage the settings for Pure Storage for Azure.

## Resource overview

[!INCLUDE [manage](../includes/manage.md)]

:::image type="content" source="media/manage/resource-overview.png" alt-text="A screenshot of a Pure Storage resource in the Azure portal with the overview displayed in the working pane." lightbox="media/manage/resource-overview.png":::

The *Essentials* details include:

- Resource group
- Location
- Subscription
- Subscription ID
- Pricing Plan
- Billing Term

To manage your resource, select the links next to corresponding details.

Below the essentials, you can navigate to other details about your resource by selecting the links.

- Get Started
- Documentation on Microsoft Learn
- Pure Storage support

### Create a Storage Pool

To create a storage pool

1. Select **Settings > Storage Pool** from the service menu.
1. Select **Create a new storage pool** from the working pane's command bar. 

    The *Create a Storage Pool* window appears.
    There are required fields that you need to fill out.

1. Enter the values for each required setting.
  
    | Setting                            | Action                                |
    |------------------------------------|---------------------------------------|
    | Resource group                     | Choose a resource group.              |
    | Storage Pool name                  | Provide a name for your Storage Pool. |
    | Availability zone                  | Choose an availability zone.          |
    | Performance                        | Adjust the performance slider.        |
    | Virtual network                    | Choose a virtual network.             |
    | Delegated subnet                   | Choose a delegated subnet.            |

1. Select the **Create** button.

    > [!NOTE]
    > It can take up to 1 hour for deployment to complete. 

### Connect a Storage Pool to an Azure VMware resource

To connect a storage pool to an Azure VMware resource, select the **Connect Azure VMware Solution** button from the working pane's command bar. 
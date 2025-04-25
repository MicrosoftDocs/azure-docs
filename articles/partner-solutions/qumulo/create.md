---
title: Get started with Azure Native Qumulo Scalable File Service
description: Learn how to create an Azure Native Qumulo Scalable File Service resource in the Azure portal.
ms.topic: quickstart
ms.custom:
  - ignite-2023
ms.date: 02/09/2025
---

# Quickstart: Get started with Qumulo Scalable File Service

In this quickstart, you create an instance of Qumulo Scalable File Service.

## Prerequisites

[!INCLUDE [create-prerequisites](../includes/create-prerequisites.md)]
- For custom roles, you also need *write* access to the resource groups for your delegated subnet and Qumulo file system namespace.
- You must [subscribe to Qumulo](overview.md#subscribe-to-qumulo).
- A [virtual network](/azure/virtual-network/manage-subnet-delegation?tabs=manage-subnet-delegation-portal) with a [subnet](/azure/virtual-network/manage-subnet-delegation?tabs=manage-subnet-delegation-portal) with at least 256 IP Addresses delegated to `Qumulo.Storage/fileSystems`.

## Create a Qumulo resource

[!INCLUDE [create-resource](../includes/create-resource.md)]

### Basics tab

The *Basics* tab has four sections:

- Project details
- Azure resource details
- Administrator account credentials
- Qumulo file system details

:::image type="content" source="media/create/basics-tab.png" alt-text="A screenshot of the Create a Qumulo resource in Azure options inside of the Azure portal's working pane with the Basics tab displayed.":::

There are required fields (identified with a red asterisk) in each section that you need to fill out.

1. Enter the values for each required setting under *Project details*.

   | Field               | Action                                                    |
   |---------------------|-----------------------------------------------------------|
   | Subscription        | Select a subscription from your existing subscriptions.   |
   | Resource group      | Use an existing resource group or create a new one.       |

1. Enter the values for each required setting under *Azure Resource details*.

   | Field              | Action                                    |
   |--------------------|-------------------------------------------|
   | Resource name      | Specify a unique name for the resource.   |
   | Region             | Select an Azure region for your resource. |

1. Enter the values for each required setting under *Administrator account credentials*.

   | Field             | Action                                                           |
   |-------------------|------------------------------------------------------------------|
   | Password          | Create a password for your administrator account.                |
   | Confirm password  | Confirm the password you created for your administrator account. |

1. Enter the values for each required setting under *Qumulo file system details*.

   | Field              | Action                                          |
   |--------------------|-------------------------------------------------|
   | Storage class      | Choose the storage class for your resource.     |
   | Availability Zone  | Choose the availability zone for your resource. |

   > [!NOTE]
   > If you select *Hot ZRS* as your storage class, you will not specify an Availability Zone.
   
   Select the **Change plan** link to change your billing plan.

   The remaining fields update to reflect the details of the plan you selected for this resource.

1. Select the **Next** button at the bottom of the page.

### Networking tab

Enter the values for each required setting.

:::image type="content" source="media/create/networking-tab.png" alt-text="A screenshot of the Create a Qumulo resource in Azure options inside of the Azure portal's working pane with the Networking tab displayed.":::

   | Field             | Action                                                |
   |-------------------|-------------------------------------------------------|
   | Virtual network   | Choose the virtual network for your resource.         |
   | Subnet            | Choose the Qumulo-delegated subnet for your resource. |

### Tags (optional)

[!INCLUDE [tags](../includes/tags.md)]

### Review + Create tab

[!INCLUDE [review-create](../includes/review-create.md)]

## Next step

> [!div class="nextstepaction"]
> [Manage the Qumulo Scalable File Service in the Azure portal](manage.md)
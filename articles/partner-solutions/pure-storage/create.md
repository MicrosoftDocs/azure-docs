---
title: "Quickstart: Create an Everpure Cloud Azure Native resource"
description: Learn how to create an Everpure Cloud resource by using the Azure portal.
author: agrimayadav
ms.author: agrimayadav
ms.topic: quickstart
ms.date: 08/28/2026

---
# Quickstart: Create an Everpure Cloud Azure Native resource

This quickstart shows you how to create an Everpure Cloud resource by using the Azure portal.

## Prerequisites

[!INCLUDE [create-prerequisites](../includes/create-prerequisites.md)]
- You must [Subscribe to Everpure Cloud Azure Native](overview.md#subscribe-to-everpure-cloud-azure-native).
- A dedicated [subnet](../../virtual-network/manage-subnet-delegation.md) delegated to *PureStorage.Block/storagePools*. The subnet requires a minimum size of **/27**.

## Create a resource

[!INCLUDE [create-resource](../includes/create-resource.md)]

### Basics tab

The **Basics** tab has four sections:

- Project Details
- Instance Details
- Billing Details
- Company Details

:::image type="content" source="media/create/basics-tab.png" alt-text="A screenshot of the Create Everpure Cloud Azure Native options in the Azure portal, with the Basics tab displayed.":::

Enter values for each required setting.

1. **Project Details:**

    | Setting           | Value                                      |
    |-------------------|--------------------------------------------|
    | Subscription      | Select your subscription.                  |
    | Resource group    | Specify a resource group.                  |

1. **Instance Details:**

    | Setting           | Value                                      |
    |-------------------|--------------------------------------------|
    | Resource name     | Specify a unique name for the resource.    |
    | Region            | Select the region.                         |

1. **Company Details:**

    | Setting           | Value                                      |
    |-------------------|--------------------------------------------|
    | Company Name      | Provide your company's name.               |
    | Address Line 1    | Provide your company's address.            |
    | State             | Select a state from the dropdown.          |
    | Zip               | Provide your company's zip code.           |
    | First Name        | Provide your first name.                   |
    | Last Name         | Provide your last name.                    |

1. Select **Next** to add tags, or select **Review and create**.

### Tags tab (optional)

[!INCLUDE [tags](../includes/tags.md)]

### Review + create tab

[!INCLUDE [review-create](../includes/review-create.md)]

> [!IMPORTANT]
> After you create the Everpure Cloud resource, you need to [create a storage pool](manage.md#create-a-storage-pool) to use and manage your storage volumes.

## Next step

> [!div class="nextstepaction"]
> [Manage Everpure Cloud Azure Native resources](manage.md)

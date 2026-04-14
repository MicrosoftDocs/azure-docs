---
title: "Quickstart: Create an Azure Native Pure Storage Cloud Resource"
description: Learn how to create a resource for Pure Storage Cloud by using the Azure portal.
author: ProfessorKendrick
ms.author: kkendrick
ms.topic: quickstart
ms.date: 12/10/2025

---
# Quickstart: Create an Azure Native Pure Storage Cloud resource

This quickstart shows you how to create a Pure Storage Cloud resource by using the Azure portal.

## Prerequisites

[!INCLUDE [create-prerequisites](../includes/create-prerequisites.md)]
- You must [Subscribe to Azure Native Pure Storage Cloud](overview.md#subscribe-to-azure-native-pure-storage-cloud).
- A dedicated [subnet](../../virtual-network/manage-subnet-delegation.md) delegated to *PureStorage.Block/storagePools*. The subnet requires a minimum size of **/27**.

## Create a resource

[!INCLUDE [create-resource](../includes/create-resource.md)]

### Basics tab

The **Basics** tab has four sections:

- Project Details
- Instance Details
- Billing Details
- Company Details

:::image type="content" source="media/create/basics-tab.png" alt-text="A screenshot of the Create an Azure Native Pure Storage Cloud Storage options inside of the Azure portal's working pane with the Basics tab displayed.":::

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
> After you create the Pure Storage resource, you need to [create a storage pool](manage.md#create-a-storage-pool) to use and manage your storage volumes. 

## Next step

> [!div class="nextstepaction"]
> [Manage Azure Native Pure Storage resources](manage.md)
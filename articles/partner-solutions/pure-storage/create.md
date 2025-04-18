---
title: "Quickstart: Create an Azure Native Pure Storage Cloud Resource (preview)"
description: Learn how to create a resource for Pure Storage Cloud (preview) using the Azure portal.
author: ProfessorKendrick
ms.author: kkendrick
ms.topic: quickstart
ms.date: 10/29/2024

---
# Quickstart: Create an Azure Native Pure Storage Cloud resource (preview)

This quickstart shows you how to create a Pure Storage Cloud (preview) resource using the Azure portal.

## Prerequisites

[!INCLUDE [create-prerequisites](../includes/create-prerequisites.md)]
- You must [Subscribe to Azure Native Pure Storage Cloud (preview)](overview.md#subscribe-to-azure-native-pure-storage-cloud-preview)
- A dedicated [subnet](../../virtual-network/manage-subnet-delegation.md) delegated to `PureStorage.Block/storagePools`. The subnet must be named *GatewaySubnet* and requires a minimum size of **/27**.
- An [Azure VMware solution](../../azure-vmware/tutorial-create-private-cloud.md). All hosts must be in the same Host Location within the same Azure Subscription. 

## Create a resource

[!INCLUDE [create-resource](../includes/create-resource.md)]

### Basics tab

The *Basics* tab has four sections:

- Project Details
- Instance Details
- Billing Details
- Company Details

:::image type="content" source="media/create/basics-tab.png" alt-text="A screenshot of the Create an Azure Native Pure Storage Cloud Storage options inside of the Azure portal's working pane with the Basics tab displayed.":::

There are required fields that you need to fill out.

1. Enter the values for each required setting under *Project Details*.

    | Setting           | Action                                     |
    |-------------------|--------------------------------------------|
    | Subscription      | Select your subscription.                  |
    | Resource group    | Specify a resource group.                 |

1. Enter the values for each required setting under *Instance Details*.

    | Setting           | Action                                     |
    |-------------------|--------------------------------------------|
    | Resource name     | Specify a unique name for the resource.    |
    | Region            | Select the region.                         |

1. Enter the values for each required setting under *Company Details*.

    | Setting           | Action                                     |
    |-------------------|--------------------------------------------|
    | Company Name      | Provide your company's name.               |
    | Address Line 1    | Provide your company's address.            |
    | State             | Select a state from the dropdown.          |
    | Zip               | Provide your company's zip code.           |
    | First Name        | Provide your first name.                   |
    | Last Name         | Provide your last name.                    |

1. Select the **Review and create** button at the bottom of the page.

### Tags tab (optional)

[!INCLUDE [tags](../includes/tags.md)]

### Review + create tab

[!INCLUDE [review-create](../includes/review-create.md)]

## Next step

> [!div class="nextstepaction"]
> [Manage Azure Native Pure Storage (preview) resources](manage.md)
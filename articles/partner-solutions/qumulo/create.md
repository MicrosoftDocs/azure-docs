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

   > [!NOTE]
   >
   > For custom roles, you also need write access to:
   >
   > - The resource group where your delegated subnet is created.
   > - The resource group where your Qumulo file system namespace is created.

- You must [subscribe to Qumulo](overview.md#subscribe-to-qumulo).
- A [delegated subnet](/azure/virtual-network/manage-subnet-delegation?tabs=manage-subnet-delegation-portal) for Qumulo Scalable File Service.

   > [!NOTE]
   > The selected subnet address range should have at least 256 IP addresses: 251 free and 5 Azure reserved addresses.
   >
   > Your Qumulo subnet should be in the same region as that of the Qumulo service. The subnet must be delegated to `Qumulo.Storage/fileSystems`.

## Create a Qumulo resource

[!INCLUDE [create-resource](../includes/create-resource.md)]

> [!NOTE]
> 
> When you create the service instance, the following entities are also created and mapped to a Qumulo file system namespace:
> 
> - A delegated subnet that enables the Qumulo service to inject service endpoints (eNICs) into your virtual network.
> - A managed resource group that has internal networking and other resources required for the Qumulo service.
> - A Qumulo resource in the region of your choosing. This entity stores and manages your data.
> - A Software as a Service (SaaS) resource, based on the plan that you select in the Azure Marketplace offer for Qumulo. This resource is used for billing.

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
    | Region             | Select a region to deploy your resource.  |

1. Enter the values for each required setting under *Administrator account credentials*.

    | Field             | Action                                                                                           |
    |-------------------|--------------------------------------------------------------------------------------------------|
    | Password          | Create a password for your administrator account.                                                |
    | Confirm password  | Confirm the password you created for your administrator account.                                 |

1. Enter the values for each required setting under *Qumulo file system details*.

    | Field             | Action                                                                                           |
    |-------------------|--------------------------------------------------------------------------------------------------|
    | Storage class     | Choose the storage class for your workloads.                                                     |
    | Availability Zone | Choose the availability zone where Azure will provision your Qumulo file system.                 |

    > [!NOTE]
    > If you choose to associate your resource with an existing organization, the resource is billed to that organization's plan. 

    Select the **Change plan** link to change your billing plan.

    The remaining fields update to reflect the details of the plan you selected for this new organization.

1. Select the **Next** button at the bottom of the page.

### Networking tab

### Tags (optional)

[!INCLUDE [tags](../includes/tags.md)]

### Review + Create tab

[!INCLUDE [review-create](../includes/review-create.md)]

## Next steps

- [Manage the Qumulo Scalable File Service in the Azure portal](manage.md)
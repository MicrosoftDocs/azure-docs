---
title: Get started with Azure Native Qumulo Scalable File Service
description: Learn how to create an Azure Native Qumulo Scalable File Service resource in the Azure portal.
ms.topic: quickstart
ms.custom:
  - ignite-2023
ms.date: 03/09/2026
---

# Quickstart: Get started with Qumulo Scalable File Service

In this quickstart, you create an instance of Qumulo Scalable File Service.

When you create the service instance, the following entities are also created and mapped to a Qumulo file system namespace: 

- A delegated subnet that enables the Qumulo service to inject service endpoints (eNICs) into your virtual network.
- A managed resource group that has internal networking and other resources required for the Qumulo service.
- A Qumulo resource in the region of your choosing. This entity stores and manages your data.
- A Software as a Service (SaaS) resource, based on the plan that you select in Azure Marketplace offer for Qumulo. This resource is used for billing.

## Prerequisites

[!INCLUDE [create-prerequisites](../includes/create-prerequisites.md)]
- You must [subscribe to Qumulo](overview.md#subscribe-to-qumulo).
- A [virtual network](/azure/virtual-network/manage-subnet-delegation?tabs=manage-subnet-delegation-portal) with a [delegated subnet](/azure/virtual-network/manage-subnet-delegation?tabs=manage-subnet-delegation-portal) with at least 256 IP Addresses delegated to `Qumulo.Storage/fileSystems`.
- For custom roles, you also need *write* access to the resource groups for your delegated subnet and Qumulo file system namespace.

> [!IMPORTANT]
> For successful creation of a Qumulo service, custom role-based access control (RBAC) roles need to have the following permissions in the subnet and Qumulo service resource groups:
>
> - Qumulo.Storage/\*
> - Microsoft.Network/virtualNetworks/subnets/join/action

## Create a Qumulo resource

[!INCLUDE [create-resource](../includes/create-resource.md)]

4. On the **Basics** tab, enter the values for each required field (identified with a red asterisk):

   | Field | Action |
   |---|---|
   | **Subscription** | Select a subscription from your existing subscriptions. |
   | **Resource group** | Use an existing resource group or create a new one. |
   | **Resource name** | Specify a unique name for the resource. |
   | **Region** | Select an Azure region for your resource. |
   | **Password** | Create a password for your administrator account. |
   | **Confirm password** | Confirm the password you created for your administrator account. |
   | **Storage class** | Choose the storage class for your resource. |
   | **Availability Zone** | Choose the availability zone for your resource. |
   | **Pre-provisioned performance** | Select the pre-provisioned performance for your resource. The default is *Elastic Pay-as-you-go*, or you can provision dedicated capacity during resource creation. |

   > [!NOTE]
   > If you select *Hot ZRS* as your storage class, you don't need to specify an availability zone.

5. If needed, select the **Change plan** link to change your billing plan. The remaining fields update to reflect your selected plan.

6. Select **Next** to continue to the **Networking** tab and enter the values for each required setting:

   | Field | Action |
   |---|---|
   | **Virtual network** | Choose the virtual network for your resource. |
   | **Subnet** | Choose the Qumulo-delegated subnet for your resource. |

7. Optionally, select the **Tags** tab to add tags to your resource.

8. Select **Review + Create** to validate and create your resource. If the review identifies errors, go back to fix them and then select **Review + Create** again.

9. When validation passes, select **Create**. A deployment notification appears. When the deployment is complete, select **Go to resource** to view your new Qumulo resource.

## Next step

> [!div class="nextstepaction"]
> [Manage a resource](manage.md)

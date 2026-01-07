---
title: Manage Settings for Pure Storage Cloud Resource
description: Manage settings, view resources, reconfigure metrics/logs, and more for your Pure Storage Cloud resource by using the Azure portal.

ms.topic: how-to
ms.date: 12/10/2025

---

# Manage Azure Native Pure Storage resources

This article describes how to manage your Pure Storage Cloud Resource and connect storage to your Azure VMware Solution (AVS) resource.

## Resource overview

[!INCLUDE [manage](../includes/manage.md)]

:::image type="content" source="media/manage/resource-overview.png" alt-text="A screenshot of a Pure Storage resource in the Azure portal with the overview displayed in the working pane." lightbox="media/manage/resource-overview.png":::

The **Essentials** details include:

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
- [Pure Storage support](https://pure1.purestorage.com/)

## Create a storage pool

After you create a resource, you can create a storage pool to connect to an Azure VMware Solution resource. 

1. Select **Settings > Storage Pool** from the sidebar menu.

1. Select **Create a new storage pool** from the working pane's command bar. 

    The **Create a Storage Pool** window appears.

    :::image type="content" source="media/manage/storage-pool.png" alt-text="A screenshot of the Create a storage pool pane inside Azure portal.":::

    There are required fields that you need to fill out.

    > [!NOTE]
    > The storage pool defaults to the same region as your Pure Storage resource.

1. Enter values for each required setting.

    | Setting                            | Value                                 |
    |------------------------------------|---------------------------------------|
    | Resource group                     | Choose a resource group.              |
    | Storage Pool name                  | Provide a name for your storage pool. |
    | Availability zone                  | Choose an availability zone.          |
    | Performance                        | Adjust the performance slider.        |
    | Virtual network                    | Choose a virtual network.             |
    | Delegated subnet                   | Choose a delegated subnet.            |

1. Select the **Create** button.

    > [!NOTE]
    > It can take up to one hour for deployment to complete.

### Connect a Storage Pool to an Azure VMware Solution resource

> [!IMPORTANT]
>
> - Before you can connect a storage pool to an Azure VMware Solution resource, you must create a [Storage Pool](#create-a-storage-pool) and an [Azure VMware Solution](../../azure-vmware/tutorial-create-private-cloud.md).
> - All hosts must be in the same Host Location within the same Azure Subscription. 
> - In order to connect your storage pool to an Azure VMware Solution resource, you must be an *Owner* or *RBACAdministrator* in your subscription.

[!INCLUDE [manage](../includes/manage.md)]

To connect a storage pool to an Azure VMware Solution resource, select **Connect Azure VMware Solution** from the working pane's command bar.

:::image type="content" source="media/manage/connect-vm.png" alt-text="A screenshot of a Storage Pool resource inside Azure portal with the Connect Azure VMware Solution button emphasized":::

>[!IMPORTANT]
> After you connect, see the [Pure Storage Resource Guide](https://support.purestorage.com/bundle/m_azure_native_pure_storage_cloud/page/Pure_Cloud_Block_Store/Azure_Native_Pure_Storage_Cloud/management/c_psc_management.html) to learn how to manage your datastores and volumes.

## Get support

Contact [Pure Storage](https://pure1.purestorage.com) for customer support.

For more information, see the [Pure Storage troubleshooting documentation](https://support.purestorage.com/bundle/m_azure_native_pure_storage_cloud/page/Pure_Cloud_Block_Store/Azure_Native_Pure_Storage_Cloud/troubleshooting/c_troubleshooting.html).

## Related content

- [FAQ: Pure Storage Cloud](faq.yml)

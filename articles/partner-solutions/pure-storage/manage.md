---
title: Manage Settings for Everpure Cloud Azure Native
description: Manage settings, view resources, reconfigure metrics/logs, and more for your Everpure Cloud resource by using the Azure portal.
author: Reshmi-Sriram
ms.author: reshmisriram
ms.topic: how-to
ms.date: 08/22/2026

---

# Manage Everpure Cloud Azure Native resources

This article describes how to manage your Everpure Cloud resource and connect storage to your Azure VMware Solution (AVS) resource.

## Resource overview

[!INCLUDE [manage](../includes/manage.md)]

:::image type="content" source="media/manage/resource-overview.png" alt-text="A screenshot of an Everpure Cloud resource in the Azure portal with the overview displayed in the working pane." lightbox="media/manage/resource-overview.png":::

The **Essentials** details include:

- Resource group
- Location
- Subscription
- Subscription ID
- Pricing Plan
- Billing Term

To manage your resource, select the links next to each detail.

In the section after the essentials, you can select the links to navigate to other details about your resource.  

- Get Started
- Documentation on Microsoft Learn
- [Everpure Cloud support](https://pure1.purestorage.com/)

## Create a storage pool

After you create a resource, you can create a storage pool to connect to an Azure VMware Solution resource. 

1. Select **Settings** > **Storage Pool** from the sidebar menu.

1. Select **Create a new storage pool** from the working pane's command bar. 

    The **Create a Storage Pool** window appears.

    :::image type="content" source="media/manage/storage-pool.png" alt-text="A screenshot of the Create a storage pool pane inside Azure portal.":::

    Fill out the required fields.

    > [!NOTE]
    > The storage pool defaults to the same region as your Everpure Cloud resource.

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
    > Deployment can take up to one hour to complete.

### Connect volumes to Azure virtual machines 

For the native VM use case, create a volume group in a storage pool, create one or more volumes in that volume group, and then mount the volume group to a supported Azure virtual machine.

#### Create a volume group

1. Select the storage pool where you want to create the volume group.
1. In the sidebar, expand **Storage management**, and then select **Volume Groups**.
1. Select **Create a Volume Group**.
1. Enter a name for the volume group. To customize specific QoS settings, expand **Advanced Settings**.
1. Select **Create**.

The new volume group appears in the list of available volume groups. Provisioning typically takes a few minutes.

#### Create a volume

1. Open the volume group where you want to create the volume.
1. Select **Create a Volume**.
1. Enter the volume details, including the volume name and provisioned size.
1. Select **Create**.

Provisioning a new volume typically takes a few minutes. After creation, the volume appears in the volume group. A single volume group can contain up to 64 volumes.

#### Mount a volume group to an Azure VM

1. Open the volume group that contains the volume that you want to use, and then select the option to mount the volume group to a VM.
1. Review the volume group details, such as the virtual network and the storage pool availability zone.
1. In the Azure VM details section, select the VM that you want to use. The selector presents VMs in the same Azure region and subscription as the service.
1. Select the number of iSCSI sessions, and choose whether to restart the VM automatically if a restart is required.
1. Select **Mount**.

When you start the mount operation, the service deploys an Azure VM extension on the selected VM. The extension automates the guest-side configuration that is required for the mount operation, including iSCSI session configuration and the expected operating system settings, so that you don't need to complete a separate manual host-side runbook.  

### Connect a Storage Pool to an Azure VMware Solution resource

> [!IMPORTANT]
>
> - Before you can connect a storage pool to an Azure VMware Solution resource, you must create a [Storage Pool](#create-a-storage-pool) and an [Azure VMware Solution](../../azure-vmware/tutorial-create-private-cloud.md).
> - All hosts must be in the same host location within the same Azure subscription. 
> - To connect your storage pool to an Azure VMware Solution resource, you must be an *Owner* or *RBACAdministrator* in your subscription.

[!INCLUDE [manage](../includes/manage.md)]

To connect a storage pool to an Azure VMware Solution resource, select **Connect Azure VMware Solution** from the working pane's command bar.

:::image type="content" source="media/manage/connect-vm.png" alt-text="A screenshot of a Storage Pool resource inside Azure portal with the Connect Azure VMware Solution button emphasized":::

>[!IMPORTANT]
> After you connect, see the [Everpure Cloud Resource Guide](https://support.purestorage.com/bundle/m_azure_native_pure_storage_cloud/page/Pure_Cloud_Block_Store/Azure_Native_Pure_Storage_Cloud/management/c_psc_management.html) to learn how to manage your datastores and volumes.

## Get support

Contact [Everpure Cloud](https://pure1.purestorage.com) for customer support.

For more information, see the [Everpure Cloud troubleshooting documentation](https://support.purestorage.com/bundle/m_azure_native_pure_storage_cloud/page/Pure_Cloud_Block_Store/Azure_Native_Pure_Storage_Cloud/troubleshooting/c_troubleshooting.html).

## Related content

- [FAQ: Everpure Cloud](faq.yml)

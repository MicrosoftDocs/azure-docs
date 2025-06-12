---
title: Configure VMware vSAN
description:  Learn how to configure VMware vSAN.
ms.topic: how-to
ms.service: azure-vmware
ms.date: 12/07/2023
ms.custom:
  - engagement-fy23
  - build-2025

#Customer intent: As an Azure service administrator, I want to configure VMware vSAN.

---

# Configure VMware vSAN (OSA)

VMware vSAN has many capabilities that are included with every Azure VMware Solution deployment. Each cluster has its own VMware vSAN datastore.

Azure VMware Solution defaults with the following configurations per cluster:

   | Field | Value |
   | --- | --- |
   | **TRIM/UNMAP** | Disabled |
   | **Space efficiency** | Deduplication and compression |

> [!NOTE]
> Run commands are executed one at a time in the order submitted.

In this article, learn how to:

> [!div class="checklist"]
> * Enable or disable vSAN TRIM/UNMAP.
> * Enable vSAN compression only.
> * Disable vSAN deduplication and compression.
> * Enable or disable vSAN data-in-transit encryption.

## Set VMware vSAN TRIM/UNMAP

To enable or disable the TRIM/UNMAP command, run the `Set-AVSVSANClusterUNMAPTRIM` cmdlet.

> [!NOTE]
> When you enable TRIM/UNMAP on your vSAN datastore, there might be a negative impact on performance.

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Select **Run command** > **Packages** > **Set-AVSVSANClusterUNMAPTRIM**.

1. Provide the required values or change the default values according to the following table. Then select **Run**.

   | Field | Value |
   | --- | --- |
   | **Name**  | The cluster name as defined in vCenter Server. Comma delimit to target only certain clusters. (Blank targets all clusters.) |
   | **Enable**  | `true` or `false`. |
   | **Retain up to**  | Retention period of the cmdlet output. The default value is `60`.  |
   | **Specify name for execution**  | Alphanumeric name. For example, *Disable vSAN TRIMUNMAP*.  |
   | **Timeout**  |  The period after which a cmdlet exits if it's taking too long to finish.  |

1. Check **Notifications** to see the progress.

After vSAN TRIM/UNMAP is enabled, you must meet certain prerequisites in order for the command to function as intended and successfully reclaim unused capacity. The VM-level prerequisites are:

- Virtual machine hardware version 11 or later for Windows.
- Virtual machine hardware version 13 or later for Linux.
- The `disk.scsiUnmapAllowed` flag isn't set to `false`. The default is implied `true`. This setting can be used as a *stop switch* at the virtual machine level. You can use this setting if you want to disable this behavior on a per-VM basis and don't want to use in-guest configuration to disable this behavior. VMX file changes require a restart to take effect.
- The guest operating system must be able to identify the virtual disk as *thin*.
- After you enable a VM at a cluster level, it must be turned off, and then turned back on. (A restart is insufficient.)

For more information about how to reclaim space for Windows and Linux systems for TRIM/UNMAP to execute, see the following VMware articles:
- [How to reclaim disk space](https://knowledge.broadcom.com/external/article/340005/reclaiming-disk-space-from-thin-provisio.html)
- [Learn the procedure to enable TRIM/UNMAP](https://knowledge.broadcom.com/external/article/326595/procedure-to-enable-trimunmap.html)

## Set VMware vSAN space efficiency

To set your preferred space efficiency model, run the `Set-vSANCompressDedupe` cmdlet.

> [!NOTE]
> Changing this setting causes a vSAN resync and performance degradation while disks are reformatting.
> Assure that you have enough available space when you change to the new configuration. We recommend that you have at least 25% available space.

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Select **Run command** > **Packages** > **Set-vSANCompressDedupe**.

1. Provide the required values or change the default values according to the following table. Then select **Run**.

   | Field | Value |
   | --- | --- |
   | **Compression**  | `true` or `false`. |
   | **Deduplication**  | `true` or `false`. (When you enable deduplication, you enable both deduplication and compression.) |
   | **ClustersToChange**  | The cluster name as defined in vCenter Server. Comma delimit to target multiple clusters. |
   | **Retain up to**  | Retention period of the cmdlet output. The default value is `60`.  |
   | **Specify name for execution**  | Alphanumeric name. For example, *set cluster-1 to compress only*.  |
   | **Timeout**  |  The period after which a cmdlet exits if taking too long to finish.  |

Learn more about the `Set-vSANCompressDedupe` cmdlet:

- When you set `Compression` to `false` and `Deduplication` to `true`, vSAN is set to `Deduplication` and `Compression`.
- When you set `Compression` to `false` and `Deduplication` to `false`, all space efficiency is disabled.
- The default settings for Azure VMware Solution are `Deduplication` and `Compression`.
- The `Compression` setting provides only slightly better performance.
- When you disable both the `Compression` and `Deduplication` settings, you can achieve the greatest performance gains, but at the cost of space efficiency.

## Set VMware vSAN data-in-transit encryption

Run the `Set-vSANDataInTransitEncryption` cmdlet to enable or disable data-in-transit encryption for all clusters or specified clusters of a software-defined data center (SDDC).

   > [!NOTE]
   > When you change this setting, there's a performance impact. See [vSAN Data Encryption and Performance](https://blogs.vmware.com/virtualblocks/2021/08/12/storageminute-vsan-data-encryption-performance/).

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Select **Run command** > **Packages** > **Set-vSANDataInTransitEncryption**.

1. Provide the required values or change the default values according to the following table. Then select **Run**.

   | Field | Value |
   | --- | --- |
   | **ClusterName**  | Name of the cluster. Leave blank if you're required to enable for the whole SDDC. Otherwise, enter a comma-separated list of names. |
   | **Enable**  |  Specify `true` or `false` to enable or disable the feature.

1. Check **Notifications** to see the progress.

You can also use the `Get-vSANDataInTransitEncryptionStatus` command to check the current status or check the status after you perform the `Set-vSANDataInTransitEncryptionStatus` operation. This action verifies the cluster's current encryption state.

## Related content

- [Configure storage policies for your Azure VMware Solution virtual machines](configure-storage-policy.md)
- [Set Windows Server Active Directory as an external identity source for VMware vCenter Server](configure-identity-source-vcenter.md)

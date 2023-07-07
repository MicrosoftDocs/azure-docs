---
title: Configure VMware vSAN
description:  Learn how to configure VMware vSAN
ms.topic: how-to
ms.service: azure-vmware
ms.date: 2/5/2023

#Customer intent: As an Azure service administrator, I want to configure VMware vSAN.

---

# Configure VMware vSAN

VMware vSAN has additional capabilities that are set w/ every Azure VMware Solution deployment.  Each cluster has their own VMware vSAN Datastore.
Azure VMware Solution defaults with the following configurations per cluster:

   | **Field** | **Value** |
   | --- | --- |
   | **TRIM/UNMAP** | Disabled |
   | **Space Efficiency** | Deduplication and Compression |

> [!NOTE]
> Run commands are executed one at a time in the order submitted.

In this how-to, you learn how to:

> [!div class="checklist"]
> * Enable or Disable vSAN TRIM/UNMAP
> * Enable vSAN Compression Only
> * Disable vSAN Deduplication and Compression

## Set VMware vSAN TRIM/UNMAP

You'll run the `Set-AVSVSANClusterUNMAPTRIM` cmdlet to enable or disable TRIM/UNMAP.

1. Sign in to the [Azure portal](https://portal.azure.com).

   >[!NOTE]
   >Enabling TRIM/UNMAP on your vSAN Datastore may have a negative performance impact.
   >https://core.vmware.com/resource/vsan-space-efficiency-technologies#sec19560-sub6

1. Select **Run command** > **Packages** > **Set-AVSVSANClusterUNMAPTRIM**.

1. Provide the required values or change the default values, and then select **Run**.

   | **Field** | **Value** |
   | --- | --- |
   | **Name**  | Cluster name as defined in vCenter Server. Comma delimit to target only certain clusters. (Blank will target all clusters) |
   | **Enable**  | True or False. |
   | **Retain up to**  | Retention period of the cmdlet output. The default value is 60.  |
   | **Specify name for execution**  | Alphanumeric name, for example, **Disable vSAN TRIMUNMAP**.  |
   | **Timeout**  |  The period after which a cmdlet exits if taking too long to finish.  |

1. Check **Notifications** to see the progress.
   >[!NOTE]
   >After vSAN TRIM/UNMAP is Enabled, below lists additional requirements for it to function as intended.
   >Prerequisites -  VM Level
   >Once enabled, there are several prerequisites that must be met for TRIM/UNMAP to successfully reclaim no longer used capacity.
   >- A minimum of virtual machine hardware version 11 for Windows
   >- A minimum of virtual machine hardware version 13 for Linux.
   >- disk.scsiUnmapAllowed flag is not set to false. The default is implied true. This setting can be used as a "stop switch" at the virtual machine level should you wish to disable this behavior on a per VM basis and do not want to use in guest configuration to disable this behavior. VMX file changes require a reboot to take effect.
   >- The guest operating system must be able to identify the virtual disk as thin.
   >- After enabling at a cluster level, the VM must be powered off and back on (a reboot is insufficient).
   >- Additional guidance can be found here: https://core.vmware.com/resource/vsan-space-efficiency-technologies#sec19560-sub6

## Set VMware vSAN Space Efficiency

You'll run the `Set-vSANCompressDedupe` cmdlet to set preferred space efficiency model.
   >[!NOTE]
   >Changing this setting will cause a vSAN resync and performance degradation while disks are reformatted.
   >Assure enough space is available when changing to new configuration.  25% free space or greater is recommended in general.

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Select **Run command** > **Packages** > **Set-vSANCompressDedupe**.

1. Provide the required values or change the default values, and then select **Run**.

   | **Field** | **Value** |
   | --- | --- |
   | **Compression**  | True or False. |
   | **Deduplication**  | True or False. (Enabling this, enables both dedupe and compression) |
   | **ClustersToChange**  | Cluster name as defined in vCenter Server. Comma delimit to target multiple clusters. |
   | **Retain up to**  | Retention period of the cmdlet output. The default value is 60.  |
   | **Specify name for execution**  | Alphanumeric name, for example, **set cluster-1 to compress only**.  |
   | **Timeout**  |  The period after which a cmdlet exits if taking too long to finish.  |

   >[!NOTE]
   >Setting Compression to False and Deduplication to True sets vSAN to Dedupe and Compression.
   >Setting Compression to False and Dedupe to False, disables all space efficiency.
   >Azure VMware Solution default is Dedupe and Compression
   >Compression only provides slightly better performance
   >Disabling both compression and deduplication offers the greatest performance gains, however at the cost of space utilization.

1. Check **Notifications** to see the progress.

## Next steps

Now that you've learned how to configure VMware vSAN, you can learn more about:

- [How to configure storage policies](configure-storage-policy.md) - Create and configure storage policies for your Azure VMware Solution virtual machines.


- [How to configure external identity for vCenter Server](configure-identity-source-vcenter.md) - vCenter Server has a built-in local user called cloudadmin and assigned to the CloudAdmin role. The local cloudadmin user is used to set up users in Active Directory (AD). With the Run command feature, you can configure Active Directory over LDAP or LDAPS for vCenter Server as an external identity source.

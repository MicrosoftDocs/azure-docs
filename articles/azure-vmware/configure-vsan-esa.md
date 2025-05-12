---
# Required metadata
# For more information, see https://learn.microsoft.com/en-us/help/platform/learn-editor-add-metadata
# For valid values of ms.service, ms.prod, and ms.topic, see https://learn.microsoft.com/en-us/help/platform/metadata-taxonomies

title: Configure VMware vSAN (ESA)
description: Configure VMware vSAN (ESA)
author:      jkpravinkumar # GitHub alias
ms.author:   pjeyakumar # Microsoft alias
ms.service: azure-vmware
ms.topic: article
ms.date:     05/12/2025
---

# Configure VMware vSAN (ESA)

VMware [vSAN](https://techdocs.broadcom.com/us/en/vmware-cis/vsan/vsan/8-0/release-notes/vmware-vsan-803-release-notes.html) ESA (Express Storage Architecture) has enhanced capabilities that are configured by default with each Azure VMware Solution deployment, and each cluster utilizes its own high-performance vSAN ESA datastore. Below are the Azure VMware Solution SKUs that support vSAN ESA as the default architecture type, with the following configurations per cluster:


  | **Field** | **Value** |
  | --- | --- |
  | **TRIM/UNMAP** | Enabled by default (Cannot be disabled in vSAN ESA based clusters).|
  | **Space Efficiency** | Compression (Storage policy managed compression). Deduplication is not supported in vSAN ESA.|

   >[!NOTE]
   >Run commands are executed one at a time in the order submitted.

In this article, learn how to:

> [!div class="checklist"]
> - Supported host types
> - Enable or Disable vSAN TRIM/UNMAP
> - Enable vSAN Compression
> - Enable or Disable vSAN Data-In-Transit Encryption
## Supported host types

vSAN ESA (Express Storage Architecture) is supported on the following Azure VMware Solution host types:

- AV48


## Set VMware vSAN TRIM/UNMAP

Guest Trim/Unmap is enabled by default and cannot be disabled for cluster with vSAN ESA. Run command Set-AVSVSANClusterUNMAPTRIM is not applicable for vSAN ESA based clusters.

   >[!NOTE]
   >vSAN TRIM/UNMAP is enabled by default on vSAN ESA based clusters. To disable UNMAP at the VM level, the following additional requirements are needed for it to function as intended.
   >- All VMs in vSAN ESA cluster(s) are set by default to use UNMAP inherited from the cluster level. UNMAP can be disabled using the disk.scsiUnmapAllowed flag with a value of 'false' at the virtual machine level, should you wish to disable this behavior on a per-VM basis. VMX file changes require a reboot to take effect.
   >- The guest operating system must be able to identify the virtual disk as thin.

## Set VMware vSAN Space Efficiency

In vSAN ESA (Express Storage Architecture), compression is enabled by default on the cluster. See [VMware documentation](https://techdocs.broadcom.com/us/en/vmware-cis/vsan/vsan/8-0/vsan-administration/increasing-space-efficiency-in-a-vsan-cluster/using-deduplication-and-compression-in-vsan-cluster.html).

## Set VMware vSAN Data-In-Transit Encryption

Run the Set-vSANDataInTransitEncryption cmdlet to enable or disable data-in-transit encryption for all clusters or specified clusters of a SDDC.

   >[!NOTE]
   >Changing this setting will cause a performance impact. See [VMware KB](https://blogs.vmware.com/virtualblocks/2021/08/12/storageminute-vsan-data-encryption-performance/).

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. Select Run command > Packages > Set-vSANDataInTransitEncryption.

1. Provide the required values or change the default values, and then select Run.

   | **Field** | **Value** |
   | --- | --- |
   | **ClusterName**  | Name of the cluster. Leave blank if required to enable for whole SDDC else enter comma separated list of names. |
   | **Enable**  |  Specify True/False to Enable/Disable the feature.|
   
1. Check Notifications to see the progress.

>[!NOTE]
>You can also use the Get-vSANDataInTransitEncryptionStatus command to check for the current status or status after performing the Set-vSANDataInTransitEncryptionStatus operation and verify the cluster's current encryption state.
   
   > [!NOTE]
   > Now that you learned how to configure VMware vSAN, learn more about:
   
## Next steps

Now that you learned how to configure VMware vSAN, learn more about:

- [How to configure storage policies](/azure/azure-vmware/configure-storage-policy) - Create and configure storage policies for your Azure VMware Solution virtual machines.

- [How to configure external identity for vCenter Server](/azure/azure-vmware/configure-identity-source-vcenter) - vCenter Server has a built-in local user called cloudadmin and assigned to the CloudAdmin role. The local cloudadmin user is used to set up users in Active Directory (AD). With the Run command feature, you can configure Active Directory over LDAP or LDAPS for vCenter Server as an external identity source.


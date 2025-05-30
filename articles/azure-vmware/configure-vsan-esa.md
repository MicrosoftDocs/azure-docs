---
# Required metadata
# For more information, see https://learn.microsoft.com/en-us/help/platform/learn-editor-add-metadata
# For valid values of ms.service, ms.prod, and ms.topic, see https://learn.microsoft.com/en-us/help/platform/metadata-taxonomies

title: Configure VMware vSAN ESA
description: Configure VMware vSAN ESA
author:      jkpravinkumar # GitHub alias
ms.author:   pjeyakumar # Microsoft alias
ms.service: azure-vmware
ms.topic: how-to
ms.date:     05/12/2025
---

# Configure VMware vSAN ESA

VMware [vSAN](https://techdocs.broadcom.com/us/en/vmware-cis/vsan/vsan/8-0/release-notes/vmware-vsan-803-release-notes.html) ESA (Express Storage Architecture) offers enhanced capabilities that are configured by default with each Azure VMware Solution deployment. Each cluster uses its own high-performance vSAN ESA datastore. The following table shows the Azure VMware Solution host types that support vSAN ESA as the default architecture type, along with the configurations per cluster:

| **Field** | **Value** |
| --- | --- |
| **TRIM/UNMAP** | Enabled by default.|
| **Space Efficiency** | Compression only (Storage policy managed compression). Deduplication isn't supported.|

> [!NOTE]
> Run commands are executed one at a time in the order submitted.

In this article, you learn more about:

> [!div class="checklist"]
> - Supported host type
> - Supported vSAN services
> - How to enable or disable vSAN TRIM/UNMAP
> - How to enable vSAN Compression
> - How to enable or disable vSAN Data-In-Transit Encryption

## Supported host types
vSAN ESA (Express Storage Architecture) is supported on the following Azure VMware Solution host types:

- AV48
- AV48 (Stretched Clusters)
- AV64 (Gen 2)

## Supported vSAN services

The following table shows the list of vSAN features available in Azure VMware Solution.

  | **vSAN Services** | **Availability** |
  | --- | --- |
  | **Auto-Policy Management** | Not supported|
  | **Compression** | Supported|
  | **Data-at-rest encryption** | Supported, enabled by default|
  | **Data-in-transit encryption** | Supported|
  | **Deduplication** | Not supported|
  | **File Service** | Not supported|
  | **Guest Trim/Unmap** | Supported, enabled by default|
  | **iSCSI Target Service** | Not supported|
  | **Support for Windows Server Failover Clusters (WSFC)** | Supported|
  | **vSAN Data Protection** | Not supported|
  | **vSAN Performance Service** | Supported|
  | **vSAN Stretched cluster** | Supported|
  | **vSAN Support Insight** | Not supported|

## Set VMware vSAN TRIM/UNMAP

Guest Trim/Unmap is enabled by default and can't be disabled for cluster with vSAN ESA. Run command `Set-AVSVSANClusterUNMAPTRIM` isn't applicable for vSAN ESA based clusters.

> [!NOTE]
> vSAN TRIM/UNMAP is enabled by default on vSAN ESA based clusters. To disable UNMAP at the VM level, the following lists additional requirements are needed for it to function as intended.
>- All VMs in vSAN ESA clusters are set by default to use UNMAP inherited from the cluster level. UNMAP can be disabled using the disk.scsiUnmapAllowed flag with a value of 'false' at the virtual machine level, should you wish to disable this behavior on a per-VM basis. VMX file changes require a reboot to take effect.
>- The guest operating system must be able to identify the virtual disk as thin.

## Set VMware vSAN space efficiency

In vSAN ESA (Express Storage Architecture), space efficiency is enabled through Storage policy managed compression. See [VMware documentation](https://techdocs.broadcom.com/us/en/vmware-cis/vsan/vsan/8-0/vsan-administration/increasing-space-efficiency-in-a-vsan-cluster/using-deduplication-and-compression-in-vsan-cluster.html).

## Set VMware vSAN Data-In-Transit Encryption

Run the `Set-vSANDataInTransitEncryption` cmdlet to enable or disable data-in-transit encryption for all clusters or specified clusters of an SDDC.

> [!NOTE]
> Changing this setting impacts performance. See [VMware KB](https://blogs.vmware.com/virtualblocks/2021/08/12/storageminute-vsan-data-encryption-performance/).

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. Select **Run command** > **Packages** > **Set-vSANDataInTransitEncryption**.

1. Provide the required values or change the default values, and then select Run.

   | **Field** | **Value** |
   | --- | --- |
   | **Cluster Name** | Name of the cluster. Leave blank if necessary to enable for whole SDDC else enter comma separated list of names. |
   | **Enable**| Specify True/False to Enable/Disable the feature.|
   
1. Check Notifications to see the progress.

>[!NOTE]
>You can also use the `Get-vSANDataInTransitEncryptionStatus` command to check for the current status or status after performing the `Set-vSANDataInTransitEncryptionStatus` operation and verify the cluster's current encryption state.

## Next steps

Now that you learned how to configure VMware vSAN, learn more about:

- [How to configure storage policies](/azure/azure-vmware/configure-storage-policy) - Create and configure storage policies for your Azure VMware Solution virtual machines.

- [How to configure external identity for vCenter Server](/azure/azure-vmware/configure-identity-source-vcenter) - vCenter Server has a built-in local user called cloudadmin and assigned to the CloudAdmin role. The local cloudadmin user is used to set up users in Active Directory (AD). With the Run command feature, you can configure Active Directory over LDAP or LDAPS for vCenter Server as an external identity source.


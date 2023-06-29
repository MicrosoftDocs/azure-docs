---
title: ArchitectureAzure Large Instances NETAPP storage data protection with Azure CVO   
description: Provides an overview of ALI for Epic NETAPP storage data protection.
ms.topic: conceptual
author: jjaygbay1
ms.author: jacobjaygbay
ms.service: baremetal-infrastructure
ms.date: 06/01/2023
---

# Azure Large Instances NETAPP storage data protection with Azure CVO   

This article describes the end-to-end setup steps necessary to move data between ALI for Epic NETAPP storage and Azure CVO (NETAPP Cloud volume ONTAP), enabling ALI NETAPP storage data backup/restore/update use cases.
It's intended to help you gain a better understanding of end-to-end solution architecture and the key setup processes involved.
For a more detailed, step-by-step implementation of the solution,
consult your NETAPP professional service/account representative and MSFT account representative for ALI integration.

:::image type="content" source="media/ali-netapp-with-cvo/end-to-end-solution-architecture.png" alt-text="Networking diagram of ALI for Epic diagram." lightbox="media/ali-netapp-with-cvo/end-to-end-solution-architecture.png" border="false":::

## High level E2E key steps

1. Setup a BlueXP account (formerly NETAPP cloud manager) to support the creation of an Azure
Connector and subsequent CVO (Cloud Volume Ontap) on Azure setup.
2. Create target CVO/storage volume and setup encryption at CVO data storage VM (SVM).
3. Setup snap-Mirroring relationship between the source volume of the ALI NETAPP storage array
and the target volume of the Azure CVO followed by initial data transfer from source to target.
4. Enable Azure VM host setup with ISCSI.

> [!Note]
>Snap-mirror policy is created by the cluster admin to be used for volume level snap-mirroring relationship.

5. Create read/writable snap-mirrored target volumes using Flxclone technology
1. Map the volumes to Azure VM host via ISCSI protocol to support various use cases (backup, testing, training/reporting).
1. Perform data update/restore between source Azure BMI NETAPP storage and target Azure CVO 
when needed. 
1. Complete Compute host setup and source data LUNs mapping from NETAPP storage array followed by LVM (logical volume manager) setup over data LUNs and logical volume mounting for data access.

## More details on E2E key steps

### Azure CVO setup

1. Create NETAPP account through NETAPP central portal to be used for BlueXP.
2. Ensure the necessary Azure CVO marketplace license and Azure subscription are in place.
3. Set up Azure resource group and network (Vnet and subnet) to host Azure CVO and Connector.
4. Create the Azure CVO connector.
1. The Azure CVO connector is a gateway that resides on an Azure subscription with all the credentials and Azure API permissions for BlueXP to manage Azure CVO resources and processes.
1. Create Azure CVO using CVO connector via BlueXP, defining:
    * the VM type/size
    * Data disk capacity
    * Network/resource group/location.
1. Enable volume encryption using Azure key vault followed by target volume creation at CVO.

### Snap-mirror setup between NETAPP ALI and Azure CVO

This section provides an overview of the snap-mirror concept and architecture before going into further setup example detail, as this is the most important step.

Snap-Mirror technology keeps your data mirrored between ALI NETAPP and Azure CVO by using ONTAP Snapshot copies.
Snap-Mirror performs block-level incremental data transfers to ensure that only the data that has changed is sent to your destination replica.

Data is mirrored at the volume level via snap-mirror operation.
The relationship between the source volume in ALI NETAPP storage and the destination volume in Azure CVO is called a *Data protection relationship*. The clusters of both ALI NETAPP storage and Azure CVO in which the volumes reside and the SVMs that serve data from the volumes must be peered.
A peer relationship enables clusters and SVMs to exchange data securely.

Create peer relationships between source and destination clusters and between source and destination SVMs before you can replicate Snapshot copies using Snap-Mirror. 
A peer relationship defines network connections that enable clusters and SVMs to exchange data securely.

Clusters and SVMs in peer relationships communicate over the inter-cluster network using inter-cluster logical interfaces (LIFs).
You can configure inter-cluster LIFs in custom IP space.
Doing so allows you to isolate replication traffic in multi-tenant environments.

### Cluster peering between ALI NETAPP storage and Azure CVO

1. Create Custom IPSpace with Intercluster LIF setup with assigned ALINETAPP storage home nodes and associated physical network ports.
2. Set up Routing of custom IPSpace to enable traffic routing between IPSpace and Azure CVO default ipspace network /Intercluster LIF.
3. Setup Routing of Azure CVO default ipspace network /Intercluster LIF to reach ALI storage custom IPSpace network and intercluster LIF.
4. Setup the cluster level peering between ALI storage cluster and Azure CVO cluster.

> [!Note]
>Full meshed IPSpace on all the nodes in the cluster can be optional if needed. For example, you can create custom IPSpace just for two nodes in the cluster instead on all the nodes and use that IPSpace to create snap-mirror peering at both cluster and SVM level between ALIstorage and Azure CVO. In addition, you can leverage the same IPSpace if existed, to create SVM peering between single ALI NETAPP storage cluster SVM and multiple Azure CVO SVMs too.

### SVM peering between ALI NETAPP storage and Azure CVO

1. Setup peering between selected ALI data SVM (Vserver) and Azure CVO data SVM (Vserver). 
1. Volume snap-mirroring setup between Source and target volumes 
1. Identify the source volume of ALI storage and configure the snap-mirror relationship (CVO target volume name, snap-mirror schedule, snap-mirror policy) to initialize the first baseline async mirroring between two volumes.
1. Initialize the data transfer and async mirroring on source and target volume.

> [!Note]
> You can use the default policy (though it’s not recommended) or create a custom policy (recommended) that includes the network bandwidth throttling for the snap-mirror traffic to co-exist with other network traffic with minimum impact. Similarly, you can define the schedule of the snap-mirror operation to take place in the off-peak period where higher network bandwidth between ALI and Azure CVO are available for large baseline transfer. Avoid taking manual snapshots – always use an automation to take snapshots and y clean them up on a regular basis. Remember, you must turn off policies when you are performing data-intensive migration work (such as Endian Conversions) to disable snapshots for Snap Mirror.

### VM setup in Azure 

1. Create Azure VM compute host with ISCSI initiator and multipath configured in the same 
resource group/Vnet via Azure portal.
2. Configure initiator group in Azure CVO for LUN mapping to ISCSI host.

### Target LUNs mapped to Azure VM 

1. Identify the target volume mirrored via snap-mirror operation and create the Flex clone at 
CVO data SVM level and map the LUN of the volume to the selected ISCSI initiator group.
2. Discover the ISCSI targets, login and establish the session to locate the ISCSI LUNs from Azure 
CVO.
3. Originally configured LVM and file system metadata on source Volumes/LUNs mirrored to the 
target Volumes/LUNS would be automatically scanned and recognized at the compute host. 
Note: LVM/LV may appear as inactivated and can be reactivated if needed
4. Create mount point and activate the LV of LVM to mount the LVM/file system of presented 
ISCSI LUNs which is read/write enabled.
5. The data generated on source volume of BMI storage should now be accessible (read/write) 
to the compute host on Azure for different use cases (backup/testing/training/reporting, etc) 
on Azure VM.

### Backup use case

Use snap-mirror to asynchronously transfer current data from source volume at Azure BMI storage to 
Azure CVO volume to shorten the backup window with less impact on the source volume at Azure BMI. 
Use a suitable backup solution on ISCSI host to back up data presented to the host to other repositories 
for long-term cost-effective data offloading such as Azure archival storage. 

> [!Note] 
> On prem Netapp cluster in Azure BMI is not accessible to BlueXP as it is managed by Azure BMI team with restricted access in multi-tenanted environment. So, the current backup/restore is more focused on Azure CVO and utilizes the snap-mirror technology to carry data transfer between Azure BMI NETAPP Data SVM and Azure CVO.

### Update/Restore use case

1. Use snap-mirror restore function to restore the data from Azure CVO target volume (snap-mirrored) back to source volume if corrupted at BMI NETAPP storage.
2. You can also use backup data at Azure blob archival storage to restore the backup to Azure 
CVO volume if corrupted at CVO and then mirror it back to BMI storage.
Dev/test/reporting/training use case
1. Read/write enabled flex-clone from target volume(snap-mirrored) snapshot mounted at the 
Azure VM ISCSI initiator host can be used for dev/test/training/reporting
In summary, you should now have a better understanding of the E2E keys steps required. You can now move on to plan the E2E implementation of the above-mentioned tasks either on your own or engage the NETAPP/MSFT resources for assistance if needed.

## Next steps

Learn how to identify and interact with ALI instances through the Azure portal.

> [!div class="nextstepaction"]
> [What is Azure for Large Instances?](../../what-is-azure-large-instances.md)
---
title: Deploy disaster recovery using JetStream DR
description: Learn how to implement JetStream DR for your Azure VMware Solution private cloud and on-premises VMware workloads. 
ms.topic: how-to
ms.service: azure-vmware
ms.date: 7/7/2023
ms.custom: references_regions
---

# Deploy disaster recovery using JetStream DR software

[JetStream DR](https://www.jetstreamsoft.com/product-portfolio/jetstream-dr/) is a cloud-native disaster recovery solution designed to minimize downtime of virtual machines (VMs) if there is a disaster. Instances of JetStream DR are deployed at both the protected and recovery sites. 

JetStream is built on the foundation of Continuous Data Protection (CDP), using [VMware vSphere API for I/O filtering (VAIO) framework](https://core.vmware.com/resource/vmware-vsphere-apis-io-filtering-vaio), which enables minimal or close to no data loss. JetStream DR provides the level of protection wanted for business and mission-critical applications. It also enables cost-effective DR by using minimal resources at the DR site and using cost-effective cloud storage, such as [Azure Blob Storage](https://azure.microsoft.com/services/storage/blobs/).

In this article, you'll implement JetStream DR for your Azure VMware Solution private cloud and on-premises VMware vSphere workloads.

To learn more about JetStream DR, see:

- [JetStream Solution brief](https://www.jetstreamsoft.com/2020/09/28/disaster-recovery-for-avs/)

- [JetStream DR on Azure Marketplace](https://portal.azure.com/#blade/Microsoft_Azure_Marketplace/GalleryItemDetailsBladeNopdl/id/jetstreamsoftware1596597632545.jsdravs-111721)

## Core components of the JetStream DR solution

| Items | Description |
| --- | --- |
| **JetStream Management Server Virtual Appliance (MSA)**  | MSA enables both Day 0 and Day 2 configuration, such as primary sites, protection domains, and recovering VMs.  The MSA is deployed from an OVA file on a vSphere node by the cloud admin.  The MSA collects and maintains statistics relevant to VM protection and implements a vCenter Server plugin that allows you to manage JetStream DR natively with the vSphere Client. The MSA doesn't handle replication data of protected VMs.  | 
| **JetStream DR Virtual Appliance (DRVA)**  | Linux-based Virtual Machine appliance receives protected VMs replication data from the source ESXi host. It maintains the replication log and manages the transfer of the VMs and their data to the object store such as Azure Blob Storage. Depending upon the number of protected VMs and the amount of VM data to replicate, the private cloud admin can create one or more DRVA instances.  | 
| **JetStream ESXi host components (IO Filter packages)**  | JetStream software installed on each ESXi host configured for JetStream DR. The host driver intercepts the vSphere VMs I/O and sends the replication data to the DRVA. The IO filters also monitor relevant events, such as vMotion, Storage vMotion, snapshots, etc.   | 
| **JetStream Protected Domain**  | Logical group of VMs that will be protected together using the same policies and runbook. The data for all VMs in a protection domain is stored in the same Azure Blob container instance. A single DRVA instance handles replication to remote DR storage for all VMs in a Protected Domain.   | 
| **Azure Blob Storage containers**  | The protected VM's replicated data is stored in Azure Blobs. JetStream software creates one Azure Blob container instance for each JetStream Protected Domain.    | 

## JetStream scenarios on Azure VMware Solution
You can use JetStream DR with Azure VMware Solution for the following two scenarios:  

- On-premises VMware vSphere to Azure VMware Solution DR

- Azure VMware Solution to Azure VMware Solution DR

### Scenario 1: On-premises VMware vSphere to Azure VMware Solution DR

In this scenario, the primary site is your on-premises VMware vSphere environment and the DR site is an Azure VMware Solution private cloud.

:::image type="content" source="media/jetstream-disaster-recovery/jetstream-on-premises-to-cloud-diagram.png" alt-text="Diagram showing the on-premises to Azure VMware Solution private cloud JetStream deployment." border="false" lightbox="media/jetstream-disaster-recovery/jetstream-on-premises-to-cloud-diagram.png":::

### Scenario 2: Azure VMware Solution to Azure VMware Solution DR

In this scenario, the primary site is an Azure VMware Solution private cloud in one Azure region. The disaster recovery site is an Azure VMware Solution private cloud in a different Azure region. 

:::image type="content" source="media/jetstream-disaster-recovery/jetstream-cloud-to-cloud-diagram.png" alt-text="Diagram showing the Azure VMware Solution private cloud to private cloud JetStream deployment." border="false" lightbox="media/jetstream-disaster-recovery/jetstream-cloud-to-cloud-diagram.png":::


## Disaster Recovery with Azure NetApp Files, JetStream DR and Azure VMware Solution 

Disaster Recovery to cloud is a resilient and cost-effective way of protecting the workloads against site outages and data corruption events like ransomware. Leveraging the VMware VAIO framework, on-premises VMware workloads can be replicated to Azure Blob storage and recovered with minimal or close to no data loss and near-zero Recovery Time Objective (RTO). JetStream DR can seamlessly recover workloads replicated from on-premises to Azure VMware Solution and specifically to Azure NetApp Files. 

JetStream DR enables cost-effective disaster recovery by consuming minimal resources at the DR site and using cost-effective cloud storage. JetStream DR automates recovery to Azure NetApp Files (ANF) datastores using Azure Blob Storage. It can recover independent VMs or groups of related VMs into the recovery site infrastructure according to runbook settings. It also provides point-in-time recovery for ransomware protection. 

### Install JetStream DR 
To install JetStream DR in the on-premises data center and in the Azure VMware Solution private cloud:

- Install JetStream DR in the on-premises data center: 

  - Download the JetStream DR bundle from Azure Marketplace (ZIP) and deploy the JetStream DR MSA (OVA) in the designated cluster.
  - Configure the cluster with the IO filter package (install JetStream VIB). 
  - Provision Azure Blob (Azure Storage Account) in the same region as the DR Azure VMware Solution cluster.
  - Deploy the disaster recovery virtual appliance (DRVA) and assign a replication log volume (VMDK from existing datastore or shared iSCSI storage). 
  - Create Protected Domains (groups of related VMs) and assign DRVAs and the Azure Blob Storage/ANF.
  - Start protection. 

- Install JetStream DR in the Azure VMware Solution private cloud: 

   - Use the Run command to install and configure JetStream DR.
   - Add the same Azure Blob container and discover domains using the Scan Domain option.
   - Deploy the DRVA appliance. 
   - Create a replication log volume using an available vSAN or ANF datastore.
   - Import protected domains and configure RocVA (recovery VA) to use ANF datastore for VM placements. 
   - Select the appropriate failover option and start continuous rehydration for near-zero RTO domains/VMs. 

- During a disaster event, trigger failover to Azure NetApp Files datastores in the designated Azure VMware Solution DR site. 

- Invoke failback to the protected site after the protected site has been recovered. 

### Ransomware recovery 

Recovering from ransomware can be a daunting task. Specifically, it can be hard for IT organizations to pinpoint what the “safe point of return is,”. After that safe point is determined, how to ensure that recovered workloads are safeguarded from the attacks re-occurring by sleeping malware or through vulnerable applications. 

JetStream DR for Azure VMware Solution together with Azure NetApp Files datastores can address these concerns by allowing organizations to recover from an available point-in-time. It ensures that workloads are recovered to a functional and isolated network if required, allows the applications to function and communicate with each other without exposing them to any North-South traffic. It also gives security teams a safe place to perform forensics, and conduct other recovery measures. 

For full details, refer to the article: [Disaster Recovery with Azure NetApp Files, JetStream DR and Azure VMware Solution](https://www.jetstreamsoft.com/portal/jetstream-knowledge-base/disaster-recovery-with-azure-netapp-files-jetstream-dr-and-avs-azure-vmware-solution/). 


## Prerequisites

### Scenario 1: On-premises VMware vSphere to Azure VMware Solution DR 

- Azure VMware Solution private cloud deployed with a minimum of three nodes in the target DR region.  


   :::image type="content" source="media/jetstream-disaster-recovery/disaster-recovery-scenario-prerequisite.png" alt-text="Diagram showing the first prerequisite for disaster recovery solution on Azure VMware Solution." lightbox="media/jetstream-disaster-recovery/disaster-recovery-scenario-prerequisite.png":::


- Network connectivity configured between the primary site JetStream appliances and the Azure Storage blob instance. 

- [Setup and Subscribe to JetStream DR](https://portal.azure.com/#blade/Microsoft_Azure_Marketplace/GalleryItemDetailsBladeNopdl/id/jetstreamsoftware1596597632545.jsdravs-111721) from the Azure Marketplace to download the JetStream DR software.

- [Azure Blob Storage account](../storage/common/storage-account-create.md) created using either Standard or Premium Performance tier. For [access tier, select **Hot**](../storage/blobs/access-tiers-overview.md). 

   >[!NOTE]
   >The **Enable hierarchical namespace** option on the blob isn't supported.   

- An NSX-T network segment configured on Azure VMware Solution private cloud with DHCP enabled on the segment for the transient JetStream Virtual appliances employed during recovery or failover.  

- A DNS server configured to resolve the IP addresses of Azure VMware Solution vCenter Server, Azure VMware Solution ESXi hosts, Azure Storage account, and the JetStream Marketplace service for the JetStream virtual appliances. 

- (Optional) Azure NetApp Files volume(s) are created and attached to the Azure VMware Solution private cloud for recovery or failover of protected VMs to Azure NetApp Files backed datastores.  

  - [Attach Azure NetApp Files datastores to Azure VMware Solution hosts](attach-azure-netapp-files-to-azure-vmware-solution-hosts.md)
  - [Disaster Recovery with Azure NetApp Files, JetStream DR and AVS (Azure VMware Solution)](https://www.jetstreamsoft.com/portal/jetstream-knowledge-base/disaster-recovery-with-azure-netapp-files-jetstream-dr-and-avs-azure-vmware-solution/)   

### Scenario 2: Azure VMware Solution to Azure VMware Solution DR

- Azure VMware Solution private cloud deployed with a minimum of three nodes in both the primary and secondary regions.  
 
- Network connectivity configured between the primary site JetStream appliances and the Azure Storage blob instance. 

- [Setup and Subscribe to JetStream DR](https://portal.azure.com/#blade/Microsoft_Azure_Marketplace/GalleryItemDetailsBladeNopdl/id/jetstreamsoftware1596597632545.jsdravs-111721) from the Azure Marketplace to download the JetStream DR software.

- [Azure Blob Storage account](../storage/common/storage-account-create.md) created using either Standard or Premium Performance tier. For [access tier, select **Hot**](../storage/blobs/access-tiers-overview.md). 

   >[!NOTE]
   >The **Enable hierarchical namespace** option on the blob isn't supported.   

- An NSX-T network segment configured on Azure VMware Solution private cloud with DHCP enabled on the segment for the transient JetStream Virtual appliances employed during recovery or failover.   

- DNS configured on both the primary and DR sites to resolve the IP addresses of Azure VMware Solution vCenter Server, Azure VMware Solution ESXi hosts, Azure Storage account, the JetStream DR Management Server Appliance (MSA) and the JetStream Marketplace service for the JetStream virtual appliances.
- (Optional) Azure NetApp Files volume(s) are created and attached to the Azure VMware Solution private cloud for recovery or failover of protected VMs to Azure NetApp Files backed datastores.

  - [Attach Azure NetApp Files datastores to Azure VMware Solution hosts](attach-azure-netapp-files-to-azure-vmware-solution-hosts.md)
  - [Disaster Recovery with Azure NetApp Files, JetStream DR and AVS (Azure VMware Solution)](https://www.jetstreamsoft.com/portal/jetstream-knowledge-base/disaster-recovery-with-azure-netapp-files-jetstream-dr-and-avs-azure-vmware-solution/)
  
For more on-premises JetStream DR prerequisites, see the [JetStream Pre-Installation Guide](https://www.jetstreamsoft.com/portal/jetstream-knowledge-base/pre-installation-guidelines/).

## Install JetStream DR on Azure VMware Solution  
 
You can follow these steps for both supported scenarios. 
 
1. In your on-premises data center, install JetStream DR following the [JetStream documentation](https://www.jetstreamsoft.com/portal/jetstream-knowledge-base/installing-jetstream-dr-software/).  

1. In your Azure VMware Solution private cloud, install JetStream DR using a Run command. From the [Azure portal](https://portal.azure.com),select **Run command** > **Packages** > **JSDR.Configuration**.  
    
   >[!NOTE]
   >If you need access to the Azure US Gov portal, go to https://portal.azure.us/

   :::image type="content" source="media/run-command/run-command-overview-jetstream.png" alt-text="Screenshot showing how to access the JetStream run commands available." lightbox="media/run-command/run-command-overview-jetstream.png":::
 
   >[!NOTE]
   >The default CloudAdmin user in Azure VMware Solution doesn't have sufficient privileges to install JetStream DR.  Azure VMware Solution enables simplified and automated installation of JetStream DR by invoking the Azure VMware Solution Run command for JetStream DR.  
 

1. Run the **Invoke-PreflightJetDRInstall** cmdlet, which checks if the prerequisites for installing JetStream DR have been met. For example, it validates the required number of hosts, cluster names, and unique VM names. 

1. Provide the required values or change the default values, and then select **Run**.

   | **Field** | **Value** |
   | --- | --- |
   | **Network**  | Name of the NSX-T Data Center network segment where you must deploy the JetStream MSA.  |
   | **Datastore**  | Name of the datastore where you will deploy the JetStream MSA.  |
   | **ProtectedCluster** | Name of the Azure VMware Solution private cloud cluster to be protected, for example, **Cluster-1**.  You can only provide one cluster name. |
   | **Cluster** | Name of the Azure VMware Solution private cluster where the JetStream MSA will be deployed, for example, **Cluster-1**. |
   | **VMName** | Name of JetStream MSA VM, for example, **jetstreamServer**. |
   | **Specify name for execution**  | Alphanumeric name of the execution, for example, **Invoke-PreflightJetDRInstall-Exec1**. It's used to verify if the cmdlet ran successfully. |
   | **Timeout**  | The period after which a cmdlet exits if taking too long to finish.  |

1. [View the status of the execution](concepts-run-command.md#view-the-status-of-an-execution).
   

## Install the JetStream DR MSA

Azure VMware Solution supports the installation of JetStream using either static IP addresses or using DHCP-based IP addresses.  

### Static IP address

1. Select **Run command** > **Packages** > **Install-JetDRWithStaticIP**.

1. Provide the required values or change the default values, and then select **Run**.


   | **Field** | **Value** |
   | --- | --- |
   | **ProtectedCluster** | Name of the Azure VMware Solution private cloud cluster to be protected, for example, **Cluster-1**.  You can only provide one cluster name during the install. |
   | **Datastore**  | Name of the datastore where the JetStream MSA will be deployed.  |
   | **VMName** | Name of JetStream MSA VM, for example, **jetstreamServer**. |
   | **Cluster** | Name of the Azure VMware Solution private cluster where the JetStream MSA will be deployed, for example, **Cluster-1**. |
   | **Netmask** | Netmask of the MSA to be deployed, for example, **255.255.255.0**. |
   | **MSIp** | IP address of the JetStream MSA VM.   |
   | **Dns** | DNS IP that the JetStream MSA VM should use.   |
   | **Gateway** | IP address of the network gateway for the JetStream MSA VM.  |
   | **Credential**  |  Credentials of the root user of the JetStream MSA VM.   |
   | **HostName** | Hostname (FQDN) of the JetStream MSA VM.  |
   | **Network**  | Name of the NSX-T Data Center network segment where the JetStream MSA will be deployed. |
   | **Specify name for execution**  | Alphanumeric name of the execution, for example, **Install-JetDRWithStaticIP-Exec1**.   It's used to verify if the cmdlet ran successfully and should be unique for each run.  |


1. [View the status of the execution](concepts-run-command.md#view-the-status-of-an-execution).


### DHCP-based IP address

This step also installs JetStream vSphere Installation Bundle (VIB) on the clusters that need DR protection. 

1. Select **Run command** > **Packages** > **Install-JetDRWithDHCP**.

1. Provide the required values or change the default values, and then select **Run**.

   | **Field** | **Value** |
   | --- | --- |
   | **ProtectedCluster** | Name of the Azure VMware Solution private cloud cluster to be protected, for example, **Cluster-1**.  You can only provide one cluster name during the install. |
   | **Datastore**  | Name of the datastore where the JetStream MSA will be deployed.  |
   | **VMName** | Name of JetStream MSA VM, for example, **jetstreamServer**. |
   | **Cluster** | Name of the Azure VMware Solution private cluster where the JetStream MSA will be deployed, for example, **Cluster-1**. |
   | **Credential**  |  Credentials of the root user of the JetStream MSA VM.   |
   | **HostName** | Hostname (FQDN) of the JetStream MSA VM.  |
   | **Network**  | Name of the NSX-T Data Center network segment where the JetStream MSA will be deployed. |
   | **Specify name for execution**  | Alphanumeric name of the execution, for example, **Install-JetDRWithDHCP-Exec1**.   It's used to verify if the cmdlet ran successfully and should be unique for each run. |
 
 
1. [View the status of the execution](concepts-run-command.md#view-the-status-of-an-execution).
 
 
## Add JetStream DR to new Azure VMware Solution clusters  


1. Select **Run command** > **Packages** > **Enable-JetDRForCluster**.

1. Provide the required values or change the default values, and then select **Run**.

   | **Field** | **Value** |
   | --- | --- |
   | **ProtectedCluster** | Name of the Azure VMware Solution private cloud cluster to be protected, for example, **Cluster-1**.  You can only provide one cluster name during the install. |
   | **Credential**  |  Credentials of the root user of the JetStream MSA VM.   |
   | **MSIp** | IP address of the JetStream MSA VM.   |
   | **Specify name for execution**  | Alphanumeric name of the execution, for example, **Enable-JetDRForCluster-Exec1**.   It's used to verify if the cmdlet ran successfully and should be unique for each run.  |
  
1. [View the status of the execution](concepts-run-command.md#view-the-status-of-an-execution).
 
 
 

## Configure JetStream DR 
 
This section only covers an overview of the steps required for configuring JetStream DR.  For detailed descriptions and steps, see the [Configuring JetStream DR](https://www.jetstreamsoft.com/portal/jetstream-knowledge-base/configuring-jetstream-dr/) documentation. 
 
Once JetStream DR MSA and JetStream VIB are installed on the Azure VMware Solution clusters, use the JetStream portal to complete the remaining configuration steps. 



1. Access the JetStream portal from the vCenter appliance.

1. [Add an external storage site](https://www.jetstreamsoft.com/portal/jetstream-knowledge-base/add-a-storage-site/).  

1. [Deploy a JetStream DRVA appliance](https://www.jetstreamsoft.com/portal/jetstream-knowledge-base/deploy-a-dr-virtual-appliance/). 

1. [Create a JetStream replication log store volume](https://www.jetstreamsoft.com/portal/jetstream-knowledge-base/create-a-replication-log-store-volume/) using one of the datastores available to the Azure VMware Solution cluster. 

   >[!TIP]
   >Fast local storage, such as vSAN datastore, is preferred for the replication log volume. 
 
1. [Create a JetStream protected domain](https://www.jetstreamsoft.com/portal/jetstream-knowledge-base/create-a-protected-domain/). You'll provide the Azure Blob Storage site, JetStream DRVA instance, and replication log volume created in previous steps. 

1. [Select the VMs](https://www.jetstreamsoft.com/portal/jetstream-knowledge-base/select-vms-for-protection/) you want to protect and then [start VM protection](https://www.jetstreamsoft.com/portal/jetstream-knowledge-base/start-vm-protection/).

 
For remaining configuration steps for JetStream DR, such as creating a failover runbook, invoking failover to the DR site, and invoking failback to the primary site, see the [JetStream Admin Guide documentation](https://www.jetstreamsoft.com/portal/jetstream-knowledge-base/disaster-recovery-with-azure-netapp-files-jetstream-dr-and-avs-azure-vmware-solution/)).  
 
## Disable JetStream DR on an Azure VMware Solution cluster  
 
This cmdlet disables JetStream DR only on one of the clusters and doesn't completely uninstall JetStream DR. 

1. Select **Run command** > **Packages** > **Disable-JetDRForCluster**.

1. Provide the required values or change the default values, and then select **Run**.

   | **Field** | **Value** |
   | --- | --- |
   | **ProtectedCluster** | Name of the Azure VMware Solution private cloud cluster currently protected by JetStream DR, for example, **Cluster-1**.  You can only provide one cluster name to be disabled. |
   | **Credential**  |  Credentials of the root user of the JetStream MSA VM.   |
   | **MSIp** | IP address of the JetStream MSA VM.   |
   | **Specify name for execution**  | Alphanumeric name of the execution, for example, **Disable-JetDRForCluster-Exec1**.   It's used to verify if the cmdlet ran successfully and should be unique for each run.  |

1. [View the status of the execution](concepts-run-command.md#view-the-status-of-an-execution).


 
## Uninstall JetStream DR  

1. Select **Run command** > **Packages** > **Invoke-PreflightJetDRUninstall**. This cmdlet checks if the cluster has at least four hosts (minimum required). 

1. Provide the required values or change the default values, and then select **Run**.

   | **Field** | **Value** |
   | --- | --- |
   | **ProtectedCluster** | Name of the Azure VMware Solution private cloud cluster currently protected by JetStream DR, for example, **Cluster-1**.  You can only provide one cluster name during uninstall. |
   | **Credential**  |  Credentials of the root user of the JetStream MSA VM.   |
   | **MSIp** | IP address of the JetStream MSA VM.   |
   | **Specify name for execution**  | Alphanumeric name of the execution, for example, **Invoke-PreflightJetDRUninstall-Exec1**.   It's used to verify if the cmdlet ran successfully and should be unique for each run.|

1. [View the status of the execution](concepts-run-command.md#view-the-status-of-an-execution).

1. After the preflight cmdlet completes successfully, select **Uninstall-JetDR**, provide the required values or change the default values, and select **Run**.

   | **Field** | **Value** |
   | --- | --- |
   | **ProtectedCluster** | Name of the Azure VMware Solution private cloud cluster currently protected by JetStream DR, for example, **Cluster-1**.  You can only provide one cluster name during uninstall. |
   | **Credential**  |  Credentials of the root user of the JetStream MSA VM.   |
   | **MSIp** | IP address of the JetStream MSA VM.   |
   | **Specify name for execution**  | Alphanumeric name of the execution, for example, **Uninstall-JetDR-Exec1**.   It's used to verify if the cmdlet ran successfully and should be unique for each run.|

 1. [View the status of the execution](concepts-run-command.md#view-the-status-of-an-execution).


## Support  
 
JetStream DR is a solution that [JetStream Software](https://www.jetstreamsoft.com/) supports. For any product or support issues with JetStream, contact support-avs@jetstreamsoft.com.  
 
Azure VMware Solution uses the Run command to automate both the install and uninstall of JetStream DR. Contact Microsoft support for any issue with the run commands. For issues with JetStream install and uninstall cmdlets, contact JetStream for support. 



## Next steps

- [Infrastructure Setup: JetStream DR for Azure VMware Solution](https://vimeo.com/480574312/b5386a871c) 

- [JetStream DR for Azure VMware Solution (Full demo)](https://vimeo.com/475620858/2ce9413248)
   
   - [Get started with JetStream DR for Azure VMware Solution](https://vimeo.com/491880696/ec509ff8e3)

   - [Configure and protect VMs](https://vimeo.com/491881616/d887590fb2)

   - [Failover to Azure VMware Solution](https://vimeo.com/491883564/ca9fc57092)

   - [Failback to on-premises](https://vimeo.com/491884402/65ee817b60)

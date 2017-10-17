---
title: Assess on-premises VMware VMs for migration to Azure with Azure Migrate | Microsoft Docs
description: Describes how to set up and run an assessment for migrating VMware VMs to Azure using the Azure Migration Planner
services: migration-planner
documentationcenter: ''
author: rayne-wiselman
manager: carmonm
editor: ''

ms.assetid: a2521630-730f-4d8b-b298-e459abdced46
ms.service: site-recovery
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: storage-backup-recovery
ms.date: 09/26/2017
ms.author: raynew

---
# Assess on-premises VMware VMs for migration to Azure

[Azure Migration Planner](migrate-overview.md) assesses on-premises workloads for migration to Azure.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create an Azure Migrate project
> * Install the collector appliance on-premises, to discover VMware VMs.
> * Group VMs and create an assessment


This tutorial presumes that you've read an [overview](migrate-overview.md) of the Azure Migrate service.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/pricing/free-trial/) before you begin.


## Prequisites

- **VMware**: You need at least one VMware VM located on an ESXi host or cluster running version 5.0 or higher. The host or cluster must be managed by a vCenter server running version 5.5 or 6.0.
- **Credentials**: You need a read-only administrator account that Azure Migrate can use to access the vCenter server, to discover VMs. You also need permissions to import a file in .OVA format on the vCenter server, to create a VM. 
- **Statistics settings**: Set the statistics settings for the vCenter server to level 2 before you start.


## Create a project

1. In the Azure Portal, click **New**.
2. Search for **Azure Migrate**, and select the service (**Azure Migrate (preview)** in the search results. Then click **Create**.
3. Specify a project name, and the Azure subscription for the project.
4. Create a new resource group.
5. Specify the region in which to create the project, then click **Create**. Metadata gathered from on-premises VMs will be stored in this region.

    ![Azure Migrate](./media/tutorial-assessment-vmware/project-1.png)
    


## Download collector appliance

Azure Migrate creates an on-premises VM known as the collector appliance. This VM discovers your on-premises VMware VMs, and sends metadata about them to the Azure Migrate service. To install the collector appliance, you download an .OVA file, and import it to the on-premises vCenter server, to create the VM.

1. In **Getting Started** > **Discover & Assess**, click **Discover Machines**.
2. In **Discover machines**, click **Download**, to obtain the .OVA file.
3. In **Copy project credentials**, copy the project ID and key. You need these when you configure the collector on-premises.

    ![Download .ova file](./media/tutorial-assessment-vmware/download-ova.png)

### Verify the collector

Check that the .OVA file is secure, before you deploy it.

1. On the machine to which you downloaded the file, open an administrator command window.
2. Run the following command to generate the hash for the OVA:
    - ```C:\>CertUtil -HashFile <download_location> [Hashing Algorithm]```
    - Example usage: ```C:\>CertUtil -HashFile C:\AzureMigrate\AzureMigrate.ova SHA256```
3. The generated hash should match this table.

    **Algorithm** | **Hash value**
    --- | ---
    MD 5 | 1b4dc6698b83eac6c5a0f71838e887bf
    SHA1 | ceeddb17e97f1e38f393890e5986452bec23adbf
    SHA256 | 9a379033deaa2af6e243267faaef37339f2be4eb55bafb736b1587fe840ceba4

## Create the collector appliance VM

Import the .ovf file on the vCenter server.

1. In the vSphere Client console, click **File** > **Deploy OVF Template**.

    ![Deploy OVF](./media/tutorial-assessment-vmware/vcenter-wizard.png)

2. In the Deploy OVF Template Wizard > **Source**, specify the location of the .ovf file.
3. In **Name** and **Location**, specify a friendly name for the collector VM, the inventory object in which the VM
will be hosted.
5. In **Host/Cluster**, specify the host or cluster on which the collector VM will run.
7. In storage, specify the storage destination for the collector VM.
8. In **Disk Format**, specify the disk type and size.
9. In **Network Mapping**, specify the network to which the collector VM will connect. The network needs internet connectivity, to send metadata to Azure. 
10. Review and confirm the settings, then click **Finish**.


## Run the collector to discover VMs

1. In the vSphere Client console, right-click the VM > **Open Console**.
2. Provide the language, time zone and password preferences for the appliance.
3. In the Azure Migrate Collector, open **Set Up Prequisites**.
4. Accept the license terms, and read the third-party information.
5. The collector checks that the VM has internet access. If the VM accesses the internet via a proxy, click **Proxy settings**, and specify the proxy address and listening port. Specify credentials if proxy access need authentication.
6. The collector checks that the Windows profiler service is running. The service is installed by default on the collector VM.
7. Download and install the VMware PowerCLI.
8. In **Discover Machines**, do the following:
    - Specify the name (FQDN) or IP address of the vCenter server.
    - Specify the read-only account that the collector will use to discover VMs on the vCenter server.
    - Select a scope for VM discovery. The collector can only discover VMs within the specified scope. Scope can be set to a specific folder, datacenter, or cluster, but it shouldn't contain more than 1000 VMs. 
9. In **Select Project**, specify the Azure Migrate project ID and key that you copied. If didn't copy them, click **Discover Machines** in the Azure Migrate project **Overview** page, and copy the values.  
10. In **Complete Discovery**, check discovery status, and check that metadata collected from the VMs is in scope. The collector provides an approximate discovery time.


### Verify VMs in the portal

Discovery time depends on how many VMs you are discovering. Typically, for 100 VMs, after the collector finishes running, it takes around an hour for discovery to finish. 

1. In the Migration Planner project, click **Manage** > **Machines**.
2. Check that the VMs you want to discover appear in the portal.


## Create and view an assessment

After VMs are discovered, you group them and create an assessment. 

1. In the project **Overview** page, click **+Create assessment**.
2. Create the VM group, and specify a name for it.
3. Select the VMs you want to add to the group.
4. Click **Create Assessment**, to create the group and the assessment.
5. After the assessment is created, view it in **Overview** > **Dashboard**. Click **Export assessment**, to download it as an Excel file.

### Sample assessment

Here's an example assessment report. It includes information about whether VMs are compatible for Azure, and estimated monthly cost estimates for compute and storage.

![Assessment report](./media/tutorial-assessment-vmware/assessment-report.png)

#### Readiness

- For VMs that are ready, Azure Migrate recommends a VM size in Azure.
- For VMs that aren't ready, Azure Migrate provides an explanation of incompatibilities.

  ![Assessment readiness](./media/tutorial-assessment-vmware/assessment-suitability.png)  

#### Costs

Estimated monthly costs are for all VMs in the group. You can drill down to see costs for a specific machine.

![Assessment VM cost](./media/tutorial-assessment-vmware/assessment-vm-cost.png) 



## Next steps

- Learn how to create more detailed groups using [machine](how-to-create-group-machine-dependencies.md) or [group](how-to-create-group-dependencies.md) dependency mapping.
- [Learn more](concepts-assessment-calculation.md) about how assessments are calculated.

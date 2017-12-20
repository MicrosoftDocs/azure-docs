---
title: Scale discovery and assessment with Azure Migrate | Microsoft Docs
description: Describes how to assess large numbers of on-premises machines with the Azure Migrate service.
author: rayne-wiselman
ms.service: azure-migrate
ms.topic: article
ms.date: 12/19/2017
ms.author: raynew
---

# Discover and assess a large VMware environment

This article describes how to assess large numbers of on-premises machines with [Azure Migrate](migrate-overview.md). Azure Migrate assesses machines to check whether they're suitable for migration to Azure, and provides sizing and cost estimations for running the machine in Azure.

## Prerequisites

- **VMware**: The VMs that you plan to migrate must be managed by a vCenter Server running version 5.5, 6.0, or 6.5. Additionally, you need one ESXi host running version 5.0 or higher to deploy the collector VM.
- **vCenter account**: You need a read-only account to access the vCenter Server. Azure Migrate uses this account to discover the on-premises VMs.
- **Permissions**: On the vCenter server, you need permissions to create a VM by importing a file in .OVA format.
- **Statistics settings**: The statistics settings for the vCenter Server should be set to level 3 before you start deployment. If lower than level 3, assessment will work, but performance data for storage and network isn't collected. The size recommendations in this case will be done based on performance data for CPU and memory and configuration data for disk and network adapters.

## Plan Azure Migrate projects

You need to plan your discoveries and assessments based on the following limits:

| **Entity** | **Machine limit** |
| ---------- | ----------------- |
| Project    | 1500              | 
| Discovery  | 1000              |
| Assessment | 400               |

- If you have fewer than 400 machines to discover and assess, you need a single project and a single discovery. Depending on your requirements, you can either assess all the machines in a single assessment or split the machines into multiple assessments. 
- If you have between 400 and 1000 machines to discover, you need a single project with a single discovery. But, you will need multiple assessments to assess these machines as a single assessment can hold up to 400 machines.
- If you have between 1000 and 1500 machines, you need a single project with two discoveries in it.
- If you have more than 1500 machines, you need to create multiple projects, and perform multiple discoveries, according to your requirements. For example:
    - If you have 3000 machines,  you could set up two projects with two discoveries, or three projects with a single discovery.
    - If you have 5000 machines, you could set up four projects. Two with a discovery of 1500 machines, and one with a discovery of 500 machines. Alternatively, you could set up five projects with a single discovery in each one. 

## Plan multiple discoveries

You can use the same Azure Migrate collector to do multiple discoveries to one or more projects. 
 
- When you do a discovery using the Azure Migrate collector, you can set the discovery scope to a vCenter Server folder, datacenter, cluster, or host.
- To do more than one discovery, verify in vCenter Server that the VMs you want to discover are in folders, datacenters, clusters, or hosts that support the limitation of 1000 machines.
- We recommend that for assessment purposes, you keep machines with inter-dependencies within the same project and assessment. So in vCenter Server, make sure that dependent machines are in the same folder, datacenter, or cluster for the purposes of assessment.


## Create a project

Create an Azure Migrate project in accordance with your requirements.

1. In the Azure portal, click **Create a resource**.
2. Search for **Azure Migrate**, and select the service **Azure Migrate (preview)** in the search results. Then click **Create**.
3. Specify a project name, and the Azure subscription for the project.
4. Create a new resource group.
5. Specify the location in which you want to create the project, then click **Create**. Note that you can still assess your VMs for a different target location. The location specified for the project is used to store the metadata gathered from on-premises VMs.

## Set up the collector appliance

Azure Migrate creates an on-premises VM known as the collector appliance. This VM discovers on-premises VMware VMs, and sends metadata about them to the Azure Migrate service. To set up the collector appliance, you download an .OVA file, and import it to the on-premises vCenter server to create the VM.

### Download the collector appliance

If you have multiple projects, you only need to download the collector appliance once to the vCenter server. After downloading and setting up the appliance, you run it for each project, and specify the unique project ID and key.

1. In the Azure Migrate project, click **Getting Started** > **Discover & Assess** > **Discover Machines**.
2. In **Discover machines**, click **Download**, to download the .OVA file.
3. In **Copy project credentials**, copy the ID and key for the project. You need these when you configure the collector.

   
### Verify the collector appliance

Check that the .OVA file is secure, before you deploy it.

1. On the machine to which you downloaded the file, open an administrator command window.
2. Run the following command to generate the hash for the OVA:
    - ```C:\>CertUtil -HashFile <file_location> [Hashing Algorithm]```
    - Example usage: ```C:\>CertUtil -HashFile C:\AzureMigrate\AzureMigrate.ova SHA256```
3. The generated hash should match these settings.

    
    For the OVA version 1.0.8.38
    **Algorithm** | **Hash value**
    --- | ---
    MD5 | dd27dd6ace28f9195a2b5d52a4003067 
    SHA1 | d2349e06a5d4693fc2a1c0619591b9e45c36d695
    SHA256 | 1492a0c6d6ef76e79269d5cd6f6a22f336341e1accbc9e3dfa5dad3049be6798

    For the OVA version 1.0.8.40
    **Algorithm** | **Hash value**
    --- | ---
    MD5 | afbae5a2e7142829659c21fd8a9def3f
    SHA1 | 1751849c1d709cdaef0b02a7350834a754b0e71d
    SHA256 | d093a940aebf6afdc6f616626049e97b1f9f70742a094511277c5f59eacc41ad



## Create the collector VM

Import the downloaded file to the vCenter server.

1. In the vSphere Client console, click **File** > **Deploy OVF Template**.

    ![Deploy OVF](./media/how-to-scale-assessment/vcenter-wizard.png)

2. In the Deploy OVF Template Wizard > **Source**, specify the location of the .ova file.
3. In **Name** and **Location**, specify a friendly name for the collector VM, and the inventory object in which the VM
will be hosted.
5. In **Host/Cluster**, specify the host or cluster on which the collector VM will run.
7. In storage, specify the storage destination for the collector VM.
8. In **Disk Format**, specify the disk type and size.
9. In **Network Mapping**, specify the network to which the collector VM will connect. The network needs internet connectivity, to send metadata to Azure. 
10. Review and confirm the settings, then click **Finish**.

## Identify the key and ID for each project

If you have multiple projects, make sure you identify the ID and key for each one. You need the key when you run the collector to discover the VMs.

1. In the project, click **Getting Started** > **Discover & Assess** > **Discover Machines**.
2. In **Copy project credentials**, copy the ID and key for the project. 
    ![Project ID](./media/how-to-scale-assessment/project-id.png)

## vCenter Statistics level to collect the performance counters
Following is the list of counters that are collected during the discovery. The counters are by default available at various level in the vCenter Server. We recommend you set the highest common level (Level 3) for the statistics level so that all the counters are collected correctly. If you have vCenter set at a lower level, only a few counters might get collected completely, with the rest set to 0. Hence the assessment might show incomplete data. The below table also lists the assessment results that will be impacted if a particular counter is not collected.

|Counter                                  |Level    |Per device level  |Assessment impact                               |
|-----------------------------------------|---------|------------------|------------------------------------------------|
|cpu.usage.average                        | 1       |NA                |Recommended VM Size and cost                    |
|mem.usage.average                        | 1       |NA                |Recommended VM Size and cost                    |
|virtualDisk.read.average                 | 2       |2                 |Disk size, storage cost and the VM size         |
|virtualDisk.write.average                | 2       |2                 |Disk size, storage cost and the VM size         |
|virtualDisk.numberReadAveraged.average   | 1       |3                 |Disk size, storage cost and the VM size         |
|virtualDisk.numberWriteAveraged.average  | 1       |3                 |Disk size, storage cost and the VM size         |
|net.received.average                     | 2       |3                 |VM Size and network cost                        |
|net.transmitted.average                  | 2       |3                 |VM Size and network cost                        |

> [!WARNING]
> If you have just set a higher statistics level, it will take upto a day to generate the performance counters. Hence, it is recommended that you run the discovery after one day.

## Run the collector to discover VMs

For each discovery you need to perform, you run the collector to discovery VMs in the required scope. Run the discoveries one after the other. Concurrent discoveries aren't supported, and each discovery must have a different scope.

1. In the vSphere Client console, right-click the VM > **Open Console**.
2. Provide the language, time zone, and password preferences for the appliance.
3. On the desktop, click the **Run collector** shortcut.
4. In the Azure Migrate Collector, open **Set up prerequisites**.
    - Accept the license terms, and read the third-party information.
    - The collector checks that the VM has internet access.
    - If the VM accesses the internet via a proxy, click **Proxy settings**, and specify the proxy address and listening port. Specify credentials if the proxy needs authentication.
    - The collector checks that the collector service is running. The service is installed by default on the collector VM.
    - Download and install the VMware PowerCLI.

5. In **Specify vCenter Server details**, do the following:
    - Specify the name (FQDN) or IP address of the vCenter server.
    - In **User name** and **Password**, specify the read-only account credentials that the collector will use to discover VMs on the vCenter server.
    - In **Collection scope**, select a scope for VM discovery. The collector can only discover VMs within the specified scope. Scope can be set to a specific folder, datacenter, or cluster. It shouldn't contain more than 1000 VMs. 
    - In **Tag category for grouping**, select **None**.

        ![Select scope](./media/how-to-scale-assessment/select-scope.png)

6. In **Specify migration project**, specify the ID and key for the project. If didn't copy them, open the Azure portal from the collector VM. In the project **Overview** page, click **Discover Machines**, and copy the values.  
7. In **View collection progress**, monitor the discovery process, and check that metadata collected from the VMs is in scope. The collector provides an approximate discovery time.


### Verify VMs in the portal

Discovery time depends on how many VMs you are discovering. Typically, for 100 VMs, after the collector finishes running it takes around an hour for discovery to finish. 

1. In the Migration Planner project, click **Manage** > **Machines**.
2. Check that the VMs you want to discover appear in the portal.


## Next steps

- Learn how to [create a group](how-to-create-a-group.md) for assessment.
- [Learn more](concepts-assessment-calculation.md) about how assessments are calculated.

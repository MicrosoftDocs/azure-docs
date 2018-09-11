---
title: Scale discovery and assessment by using Azure Migrate | Microsoft Docs
description: Describes how to assess large numbers of on-premises machines by using the Azure Migrate service.
author: rayne-wiselman
ms.service: azure-migrate
ms.topic: conceptual
ms.date: 09/10/2018
ms.author: raynew
---



# Discover and assess a large VMware environment

Azure Migrate has a limit of 1500 machines per project, this article describes how to assess large numbers of on-premises virtual machines (VMs) by using [Azure Migrate](migrate-overview.md).   

## Prerequisites

- **VMware**: The VMs that you plan to migrate must be managed by vCenter Server version 5.5, 6.0, or 6.5. Additionally, you need one ESXi host running version 5.0 or later to deploy the collector VM.
- **vCenter account**: You need a read-only account to access vCenter Server. Azure Migrate uses this account to discover the on-premises VMs.
- **Permissions**: In vCenter Server, you need permissions to create a VM by importing a file in OVA format.
- **Statistics settings**: This requirement is only applicable to the [one-time discovery model](https://docs.microsoft.com/azure/migrate/concepts-collector#discovery-methods). For one-time discovery model, the statistics settings for vCenter Server should be set to level 3 before you start deployment. The statistics level is to be set to 3 for each of the day, week, and month collection intervals. If the level is lower than 3 for any of the three collection intervals, the assessment will work, but the performance data for storage and network won't be collected. The size recommendations will then be based on performance data for CPU and memory, and configuration data for disk and network adapters.

### Set up permissions

Azure Migrate needs access to VMware servers to automatically discover VMs for assessment. The VMware account needs the following permissions:

- User type: At least a read-only user
- Permissions: Data Center object –> Propagate to Child Object, role=Read-only
- Details: User assigned at datacenter level, and has access to all the objects in the datacenter.
- To restrict access, assign the No access role with the Propagate to child object, to the child objects (vSphere hosts, datastores, VMs, and networks).

If you're deploying in a tenant environment, here's one way to set this up:

1.  Create a user per tenant and using [RBAC](https://docs.microsoft.com/azure/role-based-access-control/role-assignments-portal), assign read-only permissions to all the VMs belonging to a particular tenant. Then, use those credentials for discovery. RBAC ensures that the corresponding vCenter user will have access to only tenant-specific VMs.
2. You set up RBAC for different tenant users as described in the following example for User #1 and User #2:

    - In **User name** and **Password**, specify the read-only account credentials that the collector will use to discover VMs in
    - Datacenter1 - give read-only permissions to User #1 and User #2. Don't propagate those permissions to all child objects, because you'll set permissions on individual VMs.

      - VM1 (Tenant #1) (read-only permission to User #1)
      - VM2 (Tenant #1) (read-only permission to User #1)
      - VM3 (Tenant #2) (read-only permission to User #2)
      - VM4 (Tenant #2) (read-only permission to User #2)

   - If you perform discovery using User #1 credentials, then only VM1 and VM2 will be discovered.

## Plan your migration projects and discoveries

A single Azure Migrate collector supports discovery from multiple vCenter Servers (one after another) and also supports discovery to multiple migration projects (one after another).

The collector, in case of one-time discovery, works in a fire and forget model, once a discovery is done, you can use the same collector to collect data from a different vCenter Server or send it to a different migration project. In case of continuous discovery, one appliance is connected to a single project only, so you cannot use the same collector to trigger a second discovery.

Plan your discoveries and assessments based on the following limits:

| **Entity** | **Machine limit** |
| ---------- | ----------------- |
| Project    | 1,500             |
| Discovery  | 1,500             |
| Assessment | 1,500             |

Keep these planning considerations in mind:

- When you do a discovery by using the Azure Migrate collector, you can set the discovery scope to a vCenter Server folder, datacenter, cluster, or host.
- To do more than one discovery, verify in vCenter Server that the VMs you want to discover are in folders, datacenters, clusters, or hosts that support the limitation of 1,500 machines.
- We recommend that for assessment purposes, you keep machines with interdependencies within the same project and assessment. In vCenter Server, make sure that dependent machines are in the same folder, datacenter, or cluster for the assessment.

Depending on your scenario, you can split your discoveries as prescribed below:

### Multiple vCenter Servers with less than 1500 VMs
If you have multiple vCenter Servers in your environment, and the total number of virtual machines is less than 1500, you can use the following approach based on your scenario:

**One-time discovery:** You can use a single collector and a single migration project to discover all the virtual machines across all vCenter Servers. Since the one-time discovery collector discovers one vCenter Server at a time, you can run the same collector against all the vCenter Servers, one after another, and point the collector to the same migration project. Once all the discoveries are complete, you can then create assessments for the machines.

**Continuous discovery:** In case of continuous discovery, one appliance can be connected to only a single project. So you need to deploy one appliance for each of your vCenter Servers and then create one project for each appliance and trigger discoveries accordingly.

### Multiple vCenter Servers with more than 1500 VMs

If you have multiple vCenter Servers with less than 1500 virtual machines per vCenter Server, but more than 1500 VMs across all vCenter Servers, you need to create multiple migration projects (one migration project can hold only 1500 VMs). You can achieve this by creating a migration project per vCenter Server and splitting the discoveries.

**One-time discovery:** You can use a single collector to discover each vCenter Server (one after another). If you want the discoveries to start at the same time, you can also deploy multiple appliances and run the discoveries in parallel.

**Continuous discovery:** You need to create multiple collector appliances (one for each vCenter Server) and connect each appliance to a project and trigger discovery accordingly.

### More than 1500 machines in a single vCenter Server

If you have more than 1500 virtual machines in a single vCenter Server, you need to split the discovery into multiple migration projects. To split discoveries, you can leverage the Scope field in the appliance and specify the host, cluster, folder, or datacenter that you want to discover. For example, if you have two folders in vCenter Server, one with 1000 VMs (Folder1) and other with 800 VMs (Folder2), you can use the scope field to split the discoveries between these folders.

**One-time discovery:** You can use the same collector to trigger both the discoveries. In the first discovery, you can specify Folder1 as the scope and point it to the first migration project, once the first discovery is complete, you can use the same collector, change its scope to Folder2 and migration project details to the second migration project and do the second discovery.

**Continuous discovery:** In this case, you need to create two collector appliances, for the first collector, specify the scope as Folder1 and connect it to the first migration project. You can in parallel start the discovery of Folder2 using the second collector appliance and connect it to the second migration project.

### Multi-tenant environment

If you have an environment that is shared across tenants and you do not want to discover the VMs of one tenant in another tenant's subscription, you can use the Scope field in the collector appliance to scope the discovery. If the tenants are sharing hosts, create a credential that has read-only access to only the VMs belonging to the specific tenant and then use this credential in the collector appliance and specify the Scope as the host to do the discovery.

## Discover on-premises environment

Once you are ready with your plan, you can then start discovery of the on-premises virtual machines:

### Create a project

Create an Azure Migrate project in accordance with your requirements:

1. In the Azure portal, select **Create a resource**.
2. Search for **Azure Migrate**, and select the service **Azure Migrate** in the search results. Then select **Create**.
3. Specify a project name and the Azure subscription for the project.
4. Create a new resource group.
5. Specify the location in which you want to create the project, and then select **Create**. Note that you can still assess your VMs for a different target location. The location specified for the project is used to store the metadata gathered from on-premises VMs.

### Set up the collector appliance

Azure Migrate creates an on-premises VM known as the collector appliance. This VM discovers on-premises VMware VMs, and it sends metadata about them to the Azure Migrate service. To set up the collector appliance, you download an OVA file and import it to the on-premises vCenter Server instance.

#### Download the collector appliance

If you have multiple projects, you need to download the collector appliance only once to vCenter Server. After you download and set up the appliance, you run it for each project, and you specify the unique project ID and key.

1. In the Azure Migrate project, click **Getting Started** > **Discover & Assess** > **Discover Machines**.
2. In **Discover machines**, there are two options available for the appliance, click **Download** to download the appropriate appliance based on your preference.

    a. **One-time discovery:** The appliance for this model, communicates with vCenter Server to gather metadata about the VMs. For performance data collection of the VMs, it relies on the historical performance data stored in vCenter Server and collects the performance history of last one month. In this model, Azure Migrate collects average counter (vs. peak counter) for each metric, [learn more] (https://docs.microsoft.com/azure/migrate/concepts-collector#what-data-is-collected). Since its a one-time discovery, changes in the on-premises environment are not reflected once the discovery is complete. If you want the changes to reflect, you have to do a rediscovery of the same environment to the same project.

    b. **Continuous discovery:** The appliance for this model, continuously profiles the on-premises environment to gather real-time utilization data for each VM. In this model, peak counters are collected for each metric (CPU utilization, memory utilization etc.). This model does not depend on the statistics settings of vCenter Server for performance data collection. You can stop the continuous profiling anytime from the appliance.

    > [!NOTE]
    > The continuous discovery functionality is in preview.

3. In **Copy project credentials**, copy the ID and key for the project. You need these when you configure the collector.


#### Verify the collector appliance

Check that the OVA file is secure before you deploy it:

1. On the machine to which you downloaded the file, open an administrator command window.

2. Run the following command to generate the hash for the OVA:

   ```C:\>CertUtil -HashFile <file_location> [Hashing Algorithm]```

   Example usage: ```C:\>CertUtil -HashFile C:\AzureMigrate\AzureMigrate.ova SHA256```

3. Make sure that the generated hash matches the following settings.

#### One-time discovery

For OVA version 1.0.9.14

**Algorithm** | **Hash value**
--- | ---
MD5 | 6d8446c0eeba3de3ecc9bc3713f9c8bd
SHA1 | e9f5bdfdd1a746c11910ed917511b5d91b9f939f
SHA256 | 7f7636d0959379502dfbda19b8e3f47f3a4744ee9453fc9ce548e6682a66f13c

For OVA version 1.0.9.12

**Algorithm** | **Hash value**
--- | ---
MD5 | d0363e5d1b377a8eb08843cf034ac28a
SHA1 | df4a0ada64bfa59c37acf521d15dcabe7f3f716b
SHA256 | f677b6c255e3d4d529315a31b5947edfe46f45e4eb4dbc8019d68d1d1b337c2e

For OVA version 1.0.9.8

**Algorithm** | **Hash value**
--- | ---
MD5 | b5d9f0caf15ca357ac0563468c2e6251
SHA1 | d6179b5bfe84e123fabd37f8a1e4930839eeb0e5
SHA256 | 09c68b168719cb93bd439ea6a5fe21a3b01beec0e15b84204857061ca5b116ff

For OVA version 1.0.9.7

**Algorithm** | **Hash value**
--- | ---
MD5 | d5b6a03701203ff556fa78694d6d7c35
SHA1 | f039feaa10dccd811c3d22d9a59fb83d0b01151e
SHA256 | e5e997c003e29036f62bf3fdce96acd4a271799211a84b34b35dfd290e9bea9c

#### Continuous discovery

For OVA version 1.0.10.4

**Algorithm** | **Hash value**
--- | ---
MD5 | 2ca5b1b93ee0675ca794dd3fd216e13d
SHA1 | 8c46a52b18d36e91daeae62f412f5cb2a8198ee5
SHA256 | 3b3dec0f995b3dd3c6ba218d436be003a687710abab9fcd17d4bdc90a11276be

### Create the collector VM

Import the downloaded file to vCenter Server:

1. In the vSphere Client console, select **File** > **Deploy OVF Template**.

    ![Deploy OVF](./media/how-to-scale-assessment/vcenter-wizard.png)

2. In the Deploy OVF Template Wizard > **Source**, specify the location of the OVA file.
3. In **Name** and **Location**, specify a friendly name for the collector VM, and the inventory object in which the VM
   will be hosted.
4. In **Host/Cluster**, specify the host or cluster on which the collector VM will run.
5. In storage, specify the storage destination for the collector VM.
6. In **Disk Format**, specify the disk type and size.
7. In **Network Mapping**, specify the network to which the collector VM will connect. The network needs internet connectivity to send metadata to Azure.
8. Review and confirm the settings, and then select **Finish**.

### Identify the ID and key for each project

If you have multiple projects, be sure to identify the ID and key for each one. You need the key when you run the collector to discover the VMs.

1. In the project, select **Getting Started** > **Discover & Assess** > **Discover Machines**.
2. In **Copy project credentials**, copy the ID and key for the project.
    ![Copy project credentials](./media/how-to-scale-assessment/copy-project-credentials.png)

### Set the vCenter statistics level

The collector appliance discovers the following static metadata about the selected virtual machines.

1. VM Display name (on vCenter)
2. VM’s inventory path (host/folder in vCenter)
3. IP address
4. MAC address
5. Operating system
5. Number of cores, disks, NICs
6. Memory size, Disk sizes
7. And performance counters of the VM, disk and network as listed in the table below.

For one-time discovery, the following table lists the exact performance counters that are collected, and also lists the assessment results that are impacted if a particular counter is not collected.

For continuous discovery, the same counters are collected at real time (20-seconds interval), so there is no dependency on vCenter statistics level. The appliance then rolls-up the 20-second samples to create a single data point for every 15 minutes by selecting the peak value from the 20-second samples and sends it to Azure.

|Counter                                  |Level    |Per-device level  |Assessment impact                               |
|-----------------------------------------|---------|------------------|------------------------------------------------|
|cpu.usage.average                        | 1       |NA                |Recommended VM size and cost                    |
|mem.usage.average                        | 1       |NA                |Recommended VM size and cost                    |
|virtualDisk.read.average                 | 2       |2                 |Disk size, storage cost, and VM size         |
|virtualDisk.write.average                | 2       |2                 |Disk size, storage cost, and VM size         |
|virtualDisk.numberReadAveraged.average   | 1       |3                 |Disk size, storage cost, and VM size         |
|virtualDisk.numberWriteAveraged.average  | 1       |3                 |Disk size, storage cost, and VM size         |
|net.received.average                     | 2       |3                 |VM size and network cost                        |
|net.transmitted.average                  | 2       |3                 |VM size and network cost                        |

> [!WARNING]
> For one-time discovery, if you have just set a higher statistics level, it will take up to a day to generate the performance counters. So, we recommend that you run the discovery after one day. For the continuous discovery model, wait for at least a day after starting discovery for the appliance to profile the environment and then create assessments.

### Run the collector to discover VMs

For each discovery that you need to perform, you run the collector to discover VMs in the required scope. Run the discoveries one after the other. Concurrent discoveries aren't supported, and each discovery must have a different scope.

1.  In the vSphere Client console, right-click the VM > **Open Console**.
2.  Provide the language, time zone, and password preferences for the appliance.
3.  On the desktop, select the **Run collector** shortcut.
4.  In the Azure Migrate collector, open **Set up prerequisites** and then:

    a. Accept the license terms, and read the third-party information.

    The collector checks that the VM has internet access.

    b. If the VM accesses the internet via a proxy, select **Proxy settings**, and specify the proxy address and listening port. Specify credentials if the proxy needs authentication.

    The collector checks that the collector service is running. The service is installed by default on the collector VM.

    c. Download and install VMware PowerCLI.

5.  In **Specify vCenter Server details**, do the following:
    - Specify the name (FQDN) or IP address of vCenter Server.
    - In **User name** and **Password**, specify the read-only account credentials that the collector will use to discover VMs in vCenter Server.
    - In **Select scope**, select a scope for VM discovery. The collector can discover only VMs within the specified scope. Scope can be set to a specific folder, datacenter, or cluster. It shouldn't contain more than 1,000 VMs.

6.  In **Specify migration project**, specify the ID and key for the project. If you didn't copy them, open the Azure portal from the collector VM. On the project's **Overview** page, select **Discover Machines** and copy the values.  
7.  In **View collection progress**, monitor the discovery process and check that metadata collected from the VMs is in scope. The collector provides an approximate discovery time.


#### Verify VMs in the portal

For one-time discovery, the discovery time depends on how many VMs you are discovering. Typically, for 100 VMs, after the collector finishes running it takes around an hour for configuration and performance data collection to complete. You can create assessments (both performance-based and as on-premises assessments) immediately after the discovery is done.

For continuous discovery (in preview), the collector will continuously profile the on-premises environment and will keep sending the performance data at an hour interval. You can review the machines in the portal after an hour of kicking off the discovery. It is strongly recommended to wait for at least a day before creating any performance-based assessments for the VMs.

1. In the migration project, click **Manage** > **Machines**.
2. Check that the VMs you want to discover appear in the portal.


## Next steps

- Learn how to [create a group](how-to-create-a-group.md) for assessment.
- [Learn more](concepts-assessment-calculation.md) about how assessments are calculated.

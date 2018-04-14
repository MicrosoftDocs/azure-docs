---
title: Assess on-premises workloads for migration to Azure | Microsoft Docs
description: Learn how to prepare Azure for migration of on-premises machines using Azure Migrate, the Database Migration Service, and Azure Site Recovery
services: site-recovery
author: rayne-wiselman
ms.service: site-recovery
ms.topic: tutorial
ms.date: 04/08/2018
ms.author: raynew
ms.custom: MVC

---
# Scenario 1: Assess on-premises workloads for migration to Azure

As they consider migration to Azure, Contoso company would like to run a technical assessment to figure out whether their on-premises workloads are suitable for migration to the cloud. In particular, they want to assess machine and database compatibility for migration and estimate capacity and costs for running their resources in Azure.

To get their feet wet and better understand the technologies involved, they're assessing and migrating a small on-premises app.


## Architecture

 ![Migration assessment architecture](./media/migrate-scenarios-assessment/migration-assessment-architecture.png)

In this scenario:
- Contoso on-premises datacenter: **contoso-datacenter**
- On-premises domain controller: **contosodc1**
- VMware ESXi host: contosohost1.contoso.com
- vCenter VM: **vcenter**
- Internal travel apptiered across two VMs - **WEBVM** and **SQLVM**.

## Azure services and technologies

**Technology** | **Description** | **Costs**
--- | --- | ---
Databse Migration Assistant | The [Database Migration Assistant](https://docs.microsoft.com/sql/dma/dma-overview) assesses on-premises SQL Servers for compatibility issues before you migrate to Azure. The Assistant assesses feature parity between your migration source and target and recommends improvements where appropriate. | Downloadable tool free of charge. 
Azure Migrate service | The [Azure Migrate](https://docs.microsoft.com/azure/migrate/migrate-overview) service assesses on-premises machines for migration to Azure. It verifies migration suitability of machines, performance-based sizing, and provides cost estimations for running in Azure. | There's currently no charge for using the Azure Migrate service.
Service Map | Azure Migrate uses Service Map to show dependencies between machines you want to migrate. | [Service Map](https://docs.microsoft.com/azure/operations-management-suite/operations-management-suite-service-map) is part of Azure Log Analytics. It can currently be used for 180 days without incurring charges.


## Prerequisites

If you want to deploy this scenario, here's what you should have:

- An on-premises vCenter server running version 5.5, 6.0, or 6.5.
    - Permissions to create at least a read-only account in vCenter, so that the Azure Migrate service can discover VMs.
    - Permissions to create a VM on the vCenter server, using an .OVA template.
- At least one ESXi host running version 5.0 or higher.
- At least two on-premises VMware VMs, one running a SQL Server database.
    - You should have permissions to install Azure Migrate agents on each VM.
    - The VMs should have direct internet connectivity.


## Scenario overview

Here's what we're going to do:


> [!div class="checklist"]
> * **Step 1: Prepare Azure**. All we need is an Azure subscription.
> * **Step 2: Prepare for database assessment**: Make sure that the external links to the SQL Server machine are allowed.
> * **Step 3: Prepare for VM assessment**: Set up on-premises accounts, and tweak VMware settings.
> * **Step 4: Discover on-premises VMs**: Create an Azure Migrate collector VM. Then, run the collector to discover VMs for assessment.
> * **Step 5: Prepare for dependency analysis**: Install Azure Migrate agents on the VMs, so that we can see the dependency mapping between VMs.
> * **Step 6: Download and install Database Migration Assistant**: Set up the Database Migration Assistant, to assess the on-premises SQL Server database.
> * **Step 7: Assess the database**: Run and analyze the database assessment.
> * **Step 8: Assess the VMs**: Check dependencies, group the VMs, and run the assessment. AFter the assessment is ready, analyze it in preparation for migration.


## Step 1: Prepare Azure

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/pricing/free-trial/).

- If you create a free account, you're the administrator of your subscription and can perform all actions.
- If you use an existing subscription and you're not the administrator, you need to work with the admin to assign you Owner or Contributor permissions for the subscription, or for the resource group you use for this scenario.

## Step 2: Prepare for database assessment

1.	Note the FQDN of the VM running the SQL Server instance. You need this when you connect for database assessment.
2.	Check that the Windows firewall running on the SQL Server machine allows external connections on TCP port 1433 (default), os that the  Database Migration Assistant can connect.

## Step 3: Prepare for VM  assessment

Create a VMware account that Azure Migrate will use to automatically discover VMs for assessment, verify that you have permissions to create a VM, note the ports that must be open, and set the statistics settings level.

### Set up a VMware account

 Create a VMware account with the following properties:

- User type: At least a read-only user.
- Permissions: Data Center object –> Propagate to Child Object, role=Read-only.
- Details: User assigned at datacenter level, and has access to all the objects in the datacenter.
- To restrict access, assign the **No access** role with the **Propagate to child** object, to the child objects (vSphere hosts, datastores, VMs and networks).

### Verify permissions to create a VM

Check you have permissions to create a VM by importing a file in .OVA format. [Learn more](https://kb.vmware.com/s/article/1023189?other.KM_Utility.getArticleLanguage=1&r=2&other.KM_Utility.getArticleData=1&other.KM_Utility.getArticle=1&ui-comm-runtime-components-aura-components-siteforce-qb.Quarterback.validateRoute=1&other.KM_Utility.getGUser=1).

### Verify ports

To assess machines with Azure Migrate, we use dependency mapping. For this feature, you need to install an agent on the VMs you want to assess. The agent on the VM must be able to connect to Azure Log Analytics from port TCP 443.


### Set statistics settings

Before you start deployment, the statistics settings for the vCenter Server should be set to level 3. If the level higher than 3, the assessment will work, but performance data for storage and network isn't collected.
    - Disk recommendations aren’t based on utilization, and Azure Migrate recommends standard disks without considering disk throughput.
    - The size recommendations will be done based on performance data for CPU and memory, and configuration data for disk and network adapters.

Configure the level as follows:

1. In the vSphere Web Client, open the vCenter server instance.
2. Select the **Manage** tab, and under **Settings**, click **General**.
3. Click **Edit**, and in **Statistics**, set the statistic level settings to **Level 3**.

    ![vCenter statistics level](./media/migrate-scenarios-assessment/vcenter-statistics-level.png)



## Step 4: Discover VMs

Create an Azure Migrate project, download and set up the collector VM. Then, run the collector to discover your VMs.

### Create a project

1. Log in to the [Azure portal](https://portal.azure.com), and click **Create a resource**.
2. Search for **Azure Migrate**. Select **Azure Migrate** in the search results, and click **Create**.
3. Specify a project name, and the Azure subscription.
4. Create a new resource group.
5. Specify the location for the project, then click **Create**.

    - You can only create an Azure Migrate project in the West Central US or East US region.
    - You can plan a migration for any target location.
    - The project location is only used to store the metadata gathered from on-premises VMs.

    ![Azure Migrate](./media/migrate-scenarios-assessment/project-1.png)


    

### Download the collector appliance

Azure Migrate creates an on-premises VM known as the collector appliance. This VM discovers on-premises VMware VMs, and sends metadata about them to the Azure Migrate service. To set up the collector appliance, you download an .OVA file, and import it to the on-premises vCenter server to create the VM.

1. In the Azure Migrate project, click **Getting Started** > **Discover & Assess** > **Discover Machines**.
2. In **Discover machines**, click **Download**, to download the .OVA file.
3. In **Copy project credentials**, copy the project ID and key. You need these when you configure the collector.

    ![Download .ova file](./media/migrate-scenarios-assessment/download-ova.png) 

### Verify the collector appliance

Check that the .OVA file is secure, before you deploy it.

1. On the machine to which you downloaded the file, open an administrator command window.
2. Run the following command to generate the hash for the OVA:
    - ```C:\>CertUtil -HashFile <file_location> [Hashing Algorithm]```
    - Example usage: ```C:\>CertUtil -HashFile C:\AzureMigrate\AzureMigrate.ova SHA256```
3. The generated hash should match these settings (version 1.0.9.7)
	
    **Algorithm** | **Hash value**
    --- | ---
    MD5 | d5b6a03701203ff556fa78694d6d7c35
    SHA1 | f039feaa10dccd811c3d22d9a59fb83d0b01151e
    SHA256 | e5e997c003e29036f62bf3fdce96acd4a271799211a84b34b35dfd290e9bea9c
	

### Create the collector appliance

Import the downloaded file to the vCenter Server.

1. In the vSphere Client console, click **File** > **Deploy OVF Template**.

    ![Deploy OVF](./media/migrate-scenarios-assessment/vcenter-wizard.png) 

2. In the Deploy OVF Template Wizard > **Source**, specify the location of the .ova file, and click **Next**.
3. In **OVF Template Details**, click **Next**. In **End User License Agreement**, click **Accept** to accept the agreement, and click **Next**.
4. In **Name and Location**, specify a friendly name for the collector VM, and the inventory location in which the VM will be hosted, and click **Next**. Specify the host or cluster on which the collector appliance will run.
5. In **Storage**, specify where you want to store files for the appliance, and click **Next**.
6. In **Disk Format**, specify how you want to provision the storage.
7. In **Network Mapping**, specify the network to which the collector VM will connect. The network needs internet connectivity, to send metadata to Azure. 
8. In **Ready to Complete**, review the settings, select **POwer on after deployment**, and then click **Finish**.

A message confirming successful completion is issued after the appliance is created.

### Run the collector to discover VMs

Before you start, note that the collector currently only supports "English (United States)" as the operating system language and the collector interface language.

1. In the vSphere Client console, right-click the VM > **Open Console**.
2. Provide the language, time zone, and password preferences for the appliance.
3. On the desktop, click the **Run collector** shortcut.

    ![Collector shortcut](./media/migrate-scenarios-assessment/collector-shortcut.png) 
    
4. In the Azure Migrate Collector, open **Set up prerequisites**.
    - Accept the license terms, and read the third-party information.
    - The collector checks that the VM has internet access, the time is synchronized, that the collector service is running (it's installed by default on the VM). It also installs VMWare PowerCLI is installed. 
    
    > [!NOTE]
    > We're presuming that the VM has direct access to the internet, without a proxy.

    ![Verify prerequisites](./media/migrate-scenarios-assessment/collector-verify-prereqs.png)
    

5. In **Specify vCenter Server details**, do the following:
    - Specify the name (FQDN) or IP address of the vCenter server.
    - In **Username** and **Password**, specify the read-only account credentials that the collector will use to discover VMs on the vCenter server.
    - In **Select scope**, select a scope for VM discovery. The collector can only discover VMs within the specified scope. Scope can be set to a specific folder, datacenter, or cluster. It shouldn't contain more than 1000 VMs. 

	![Connect to vCenter](./media/migrate-scenarios-assessment/collector-connect-vcenter.png)

6. In **Specify migration project**, specify the Azure Migrate project ID and key that you copied from the portal. If didn't copy them, open the Azure portal from the collector VM. In the project **Overview** page, click **Discover Machines**, and copy the values.  

    ![Connect to Azure](./media/migrate-scenarios-assessment/collector-connect-azure.png)

7. In **View collection progress**, monitor discovery, and check that metadata collected from the VMs is in scope. The collector provides an approximate discovery time.

    ![Collection in progress](./media/migrate-scenarios-assessment/collector-collection-process.png)
   


### Verify VMs in the portal

After collection completes, check that the VMs appear in the portal.

1. In the Azure Migrate project, click **Manage** > **Machines**.
2. Check that the VMs you want to discover appear in the page.

    ![Discovered machines](./media/migrate-scenarios-assessment/discovery-complete.png)

3. Note that the machines currently don't have the Azure Migrate agents installed. We need to install these so that we can view dependencies.
	
	![Discovered machines](./media/migrate-scenarios-assessment/machines-no-agent.png)


## Step 5: Prepare for dependency analysis

To view dependencies between VMs we want to assess, we download and install agents on the web app VMs – WEBVM and SQLVM.

### Take a snapshot

Take a snapshot of the VMs before you install the agents.

![Machine snapshot](./media/migrate-scenarios-assessment/snapshot-vm.png) 


### Download and install the VM agents

1.	In the Azure Migrate project > **Machines** page, select the machine, and click **Requires installation** in the **Dependencies** column.
2.	On the **Discover Machines** page, for each VM, download and install the Microsoft Monitoring Agent (MMA), and the Dependency agent.
3.	Copy the workspace ID and key. You need these when you install the MMA.

    ![Agent download](./media/migrate-scenarios-assessment/download-agents.png) 

 > [!NOTE]
    > If you have machines with no internet connectivity, you need to download and install [OMS gateway](../log-analytics/log-analytics-oms-gateway.md) on them.

#### Install the Dependency agent

1.	Double-click the downloaded Dependency agent.
2.	On the **License Terms** page, click **I Agree to accept the license**.
3.	In **Installing**, wait for the installation to finish. Then click **Next**.

    ![Dependency agent](./media/migrate-scenarios-assessment/dependency-agent.png) 


#### Install the MMA

1. Double-click the downloaded agent.
2. On the **Welcome** page, click **Next**. On the **License Terms** page, click **I Agree** to accept the license.
3. In **Destination Folder**, keep the default installation folder > **Next**. 
4. In **Agent Setup Options**, select **Connect the agent to Azure Log Analytics** > **Next**. 

    ![MMA installation](./media/migrate-scenarios-assessment/mma-install.png) 
5. In **Azure Log Analytics**, paste in the workspace ID and key that you copied from the portal. Click **Next**.
    ![MMA installation](./media/migrate-scenarios-assessment/mma-install2.png) 

6. In **Ready to Install**, install the MMA.

### Rerun the collector


1.	After agents have been installed, on the collector VM, you need to collect metadata again.

     ![Rerun collector](./media/migrate-scenarios-assessment/rerun-collector.png) 

2. After metadata has been collected, go back to the portal. In the **Machines** page, the **Dependencies** column now shows that you can view dependencies for the VMs that have the agents installed.


## Step 6: Download and install Database Migration Assistant

1. Download the Database Migration Assistant from the [Microsoft Download Center](https://www.microsoft.com/download/details.aspx?id=53595).
    - You can install the Assistant on any machine that can connect to the SQL instance. You don't need to run it on the SQL Server machine.
    - You shouldn't run it on the SQL Server host machine.
2. Double-click the downloaded setup file (DownloadMigrationAssistant.msi) to start the installation.
3. On the **Finish** page, make sure that *Launch Microsoft Data Migration Assistant** is selected, and click **Finish**.

## Step 7: Run the and analyze database assessment

Run an assessment to analyze your source SQL Server instance, against a specified target.

1. In **New**, select **Assesment**, and give the assessment a project name.
2. In **Source server type**, select **SQL Server**. In **Target server type**, select **SQL Server on Azure Virtual Machines**.

    ![Select source](./media/migrate-scenarios-assessment/dma-assessment-1.png)

    > [!NOTE]
      At present Database Migration Assistant doesn't support assessment for migrating to a SQL Managed Instance. As a workaround, we're using SQL Server on Azure VM as our supposed target for the assessment.

1.  In **Select Target Version**, specify the target version of SQL Server that you want to run in Azure, and what you want to discover in the assessment:
    - **Compatibility Issues** tells you about changes that might break migration, or that require a minor adjustment before migration. It also tells you about any features you're currently using that have been deprecated. Issues are organized by compatibility level. 
    - **New features' recommendation** let's you know about new features in the target SQL Server platform that can be used for your database after migration. These are organized by Performance, Security, and Storage. 

    ![Select target](./media/migrate-scenarios-assessment/dma-assessment-2.png)

2. In **Connect to a server**, specify the name of the machine running the SQL Server instance, the authentication type, and connection details. Then click **Connect**.

    ![Select target](./media/migrate-scenarios-assessment/dma-assessment-3.png)
    
3. In **Add source**, select the database you want to assess, and click **Add**.
4. An assessment with the name you specified is created.

    ![Create assessment](./media/migrate-scenarios-assessment/dma-assessment-4.png)

5.  **Next** to start the assessment.
6. In **Review Results**, you'll see results for the assessment tests you enabled.


### Analyze the database assessment

Results are displayed in the Assistant as soon as they're available. 

1. In the **Compatibility Issues** report, check whether your database has issues for each compatibility level, and if so,  how to fix them. Compatability levels map to SQL Server versions as follows:
    - 100: SQL Server 2008/Azure SQL Database
    - 110: SQL Server 2012/Azure SQL Database
    - 120: SQL Server 2014/Azure SQL Database
    - 130: SQL Server 2016/Azure SQL Database
    - 140: SQL Server 2017/Azure SQL Database

    ![Compatibility issues](./media/migrate-scenarios-assessment/dma-assessment-5.png)

2. In the **Feature recommendations** report, view performance, security, and storage features that the assessment recommends you should configure after migration. A variety of features are recommended, including In-Memory OLTP and Columnstore, Stretch Database, Always Encrypted, Dynamic Data Masking, and Transparent Data Encryption.

    ![Feature recommendations](./media/migrate-scenarios-assessment/dma-assessment-6.png)

3. If fix any issues, click **Restart Assessment** to rerun it. 
4. Click **Export report** to get the assessment report in JSON or CSV format.

If you're running a larger scale assessment:

- You can run multiple assessments concurrently and view the state of the assessments by opening the **All Assessments** page.
- You can [consolidate assessments into a SQL Server database](https://docs.microsoft.com/sql/dma/dma-consolidatereports?view=ssdt-18vs2017#import-assessment-results-into-a-sql-server-database).
- You can [consolidate assessments into a PowerBI report](https://docs.microsoft.com/sql/dma/dma-powerbiassesreport?view=ssdt-18vs2017).


       
## Step 8: Run and analyze the VM assessment

Verify machine dependencies, create a group, and run the assessment.

### Verify dependencies

1.	On the **Machines** page, for the VMs you want to analyze, click **View Dependencies**.

    ![View machine dependencies](./media/migrate-scenarios-assessment/view-machine-dependencies.png) 

2. For the SQLVM, the dependency map shows the following details:
    - Process groups/processes with active network connections running on SQLVM, during the specified time period (an hour by default)
    - Inbound (client) and outbound (server) TCP connections to and from all dependent machines.
    - Dependent machines with the Azure Migrate agents installed are shown as separate boxes
    - Machines without the agents installed show port and IP address information.
 3. For machines with the agent installed, click on the machine box to view more information, including FQDN, operating aystem, MAC address. 

    ![View group dependencies](./media/migrate-scenarios-assessment/sqlvm-dependencies.png)

4. Repeat the process for the WEBVM.

> [!NOTE]
    > To view more granular dependencies, you can expand the time range, /ou can select a specific duration, or start/end dates. 


### Group VMs and run an assessment

After you've verified dependencies, you're ready to group the VMs, and run an assessment. 

1. On the **Machines** page, click **+Create assessment**.
2. On the **Create Assessment** page, select **Create New**.
3. In **Add machines to the group**, add the VMs (SQLVM and WEBVM).
4. Click **Create assessment**. This creates the group and runs an assessment for it. 

    ![Create an assessment](./media/migrate-scenarios-assessment/run-vm-assessment.png)

5. The assessment appears in the **Manage** > **Assessments** page.


### Analyze the VM assessment

An Azure Migrate assessment includes information about whether the on-premises VMs are compatible for Azure, suggested right-sizing for the Azure VM, and estimated monthly Azure costs. 

![Assessment report](./media/migrate-scenarios-assessment/assessment-overview.png)

#### Review confidence rating

![Assessment display](./media/migrate-scenarios-assessment/assessment-display.png)

Your assessment gets a confidence rating from 1 star to 5 star (1 star being the lowest and 5 star being the highest).
- The confidence rating is assigned to an assessment based on the availability of data points needed to compute the assessment.
- The rating helps you to estimate the reliability of the size recommendations provided by Azure Migrate.
- Confidence rating is useful when you are doing *performance-based sizing* as Azure Migrate may not have sufficient data points to do utilization-based sizing. For *as on-premises sizing*, the confidence rating is always 5-star as Azure Migrate has all the data points it needs to size the VM.
- Depending on the percentage of data points available, the confidence rating for the assessment is provided:

   **Availability of data points** | **Confidence rating**
   --- | ---
   0%-20% | 1 Star
   21%-40% | 2 Star
   41%-60% | 3 Star
   61%-80% | 4 Star
   81%-100% | 5 Star

#### Verify readiness

![Assessment readiness](./media/migrate-scenarios-assessment/azure-readiness.png)  

Note that:
- For performance-based sizing of the VM, Azure Migrate needs:
    - Utilization data for CPU and memory.
    - Read/write IOPS and throughput for each disk attached to the VM.
    - Network in/out information for each network adapter attached to the VM.
-  If any of the above utilization numbers are not available in vCenter Server, size recommendations might not be reliable. 


**Setting** | **Indication** | **Details**
--- | --- | ---
**Azure VM readiness** | Indicates whether the VM is ready for migration | Possible states:</br><br/>- Ready for Azure<br/><br/>- Ready with conditions <br/><br/>- Not ready for Azure<br/><br/>- Readiness unknown<br/><br/> If a VM isn't ready, we'll show some remediation steps.
**Azure VM size** | For ready VMs, we recommend an Azure VM size. | Sizing recommendation depends on assessment properties:<br/><br/>- If you used performance-based sizing, sizing considers the performance history of the VMs.<br/><br/>-If you used 'as on-premises', sizing is based on the on-premises VM size, and utilization data isn't used.
**Suggested tool** | Since our machines are running the agents, Azure Migrate looks at the processes running inside the machine and identifies whether the machine is a database machine or not.
**VM information** | The report shows settings for the on-premises VM, including operating system, boot type, disk and storage information.




#### Review monthly cost estimates

This view shows the total compute and storage cost of running the VMs in Azure, along with the details for each machine. 

![Assessment readiness](./media/migrate-scenarios-assessment/azure-costs.png) 

- Cost estimates are calculated using the size recommendations for a machine.
- Estimated monthly costs for compute and storage are aggregated for all VMs in the group. 


## Conclusion

In this scenario we've:

> [!div class="checklist"]
> * Assessed our on-premises database with the Database Migration Assistant tool.
> * Assessed our on-premises VMs, using dependency mapping, with the Azure Migrate service.
> * Reviewed the assessments to make sure our on-premises resources are ready for migration to Azure.

## Next steps

Let's continue with the next scenario, to do a lift-and shift migration of the on-premises VMs to Azure.




---
title: Refactor a Contoso app by migrating it to Azure Web App and Azure SQL Database | Microsoft Docs
description: Learn how Contoso rehosts an on-premises app by migrating it to an Azure Web App and Azure SQL Server database.
services: site-recovery
author: rayne-wiselman
manager: carmonm
ms.service: site-recovery
ms.topic: conceptual
ms.date: 10/11/2018
ms.author: raynew
---

# Contoso migration: Refactor an on-premises app to an Azure Web App and Azure SQL database

This article demonstrates how Contoso refactors their SmartHotel360 app in Azure. They migrate the app frontend VM to an Azure Web App, and the app database to an Azure SQL database.

This document is one in a series of articles that show how the fictitious company Contoso migrates their on-premises resources to the Microsoft Azure cloud. The series includes background information, and scenarios that illustrate setting up a migration infrastructure, assessing on-premises resources for migration, and running different types of migrations. Scenarios grow in complexity. We'll add additional articles over time.

**Article** | **Details** | **Status**
--- | --- | ---
[Article 1: Overview](contoso-migration-overview.md) | Provides an overview of Contoso's migration strategy, the article series, and the sample apps we use. | Available
[Article 2: Deploy an Azure infrastructure](contoso-migration-infrastructure.md) | Describes how Contoso prepares its on-premises and Azure infrastructure for migration. The same infrastructure is used for all migration articles. | Available
[Article 3: Assess on-premises resources](contoso-migration-assessment.md)  | Shows how Contoso runs an assessment of an on-premises two-tier SmartHotel app running on VMware. Contoso assesses app VMs with the [Azure Migrate](migrate-overview.md) service, and the app SQL Server database with the [Database Migration Assistant](https://docs.microsoft.com/sql/dma/dma-overview?view=sql-server-2017). | Available
[Article 4: Rehost an app to Azure VMs and a SQL Managed Instance](contoso-migration-rehost-vm-sql-managed-instance.md) | Demonstrates how Contoso runs a lift-and-shift migration to Azure for the SmartHotel app. Contoso migrates the app frontend VM using [Azure Site Recovery](https://docs.microsoft.com/azure/site-recovery/site-recovery-overview), and the app database to a SQL Managed Instance, using the [Azure Database Migration Service](https://docs.microsoft.com/azure/dms/dms-overview). | Available
[Article 5: Rehost an app to Azure VMs](contoso-migration-rehost-vm.md) | Shows how Contoso migrate the SmartHotel app VMs using Site Recovery only. | Available
[Article 6: Rehost an app to Azure VMs and SQL Server Always On Availability Group](contoso-migration-rehost-vm-sql-ag.md) | Shows how Contoso migrates the SmartHotel app. Contoso uses Site Recovery to migrate the app VMs, and the Database Migration service to migrate the app database to a SQL Server cluster protected by an AlwaysOn availability group. | Available
[Article 7: Rehost a Linux app to Azure VMs](contoso-migration-rehost-linux-vm.md) | Shows how Contoso does a lift-and-shift migration of the Linux osTicket app to Azure VMs, using Site Recovery | Available
[Article 8: Rehost a Linux app to Azure VMs and Azure MySQL Server](contoso-migration-rehost-linux-vm-mysql.md) | Demonstrates how Contoso migrates the Linux osTicket app to Azure VMs using Site Recovery, and migrates the app database to an Azure MySQL Server instance using MySQL Workbench. | Available
Article 9: Refactor an app to an Azure Web App and Azure SQL database | Demonstrates how Contoso migrates the SmartHotel app to an Azure Web App, and migrates the app database to Azure SQL Server instance | This article
[Article 10: Refactor a Linux app to Azure Web Apps and Azure MySQL](contoso-migration-refactor-linux-app-service-mysql.md) | Shows how Contoso migrates the Linux osTicket app to Azure Web Apps in multiple sites, integrated with GitHub for continuous delivery. They migrate the app database to an Azure MySQL instance. | Available
[Article 11: Refactor TFS on Azure DevOps Services](contoso-migration-tfs-vsts.md) | Shows how Contoso migrates their on-premises Team Foundation Server (TFS) deployment by migrating it to Azure DevOps Services in Azure. | Available
[Article 12: Rearchitect an app on Azure containers and Azure SQL Database](contoso-migration-rearchitect-container-sql.md) | Shows how Contoso migrates and rearchitects their SmartHotel app to Azure. They rearchitect the app web tier as a Windows container, and the app database in an Azure SQL Database. | Available
[Article 13: Rebuild an app in Azure](contoso-migration-rebuild.md) | Shows how Contoso rebuild their SmartHotel app using a range of Azure capabilities and services, including App Services, Azure Kubernetes, Azure Functions, Cognitive services, and Cosmos DB. | Available
[Article 14: Scale a migration to Azure](contoso-migration-scale.md) | After trying out migration combinations, Contoso prepares to scale to a full migration to Azure. | Available

In this article, Contoso migrates the two-tier Windows. NET SmartHotel360 app running on VMware VMs to Azure. If you'd like to use this app, it's provided as open source and you can download it from [GitHub](https://github.com/Microsoft/SmartHotel360).

## Business drivers

The IT leadership team has worked closely with business partners to understand what they want to achieve with this migration:

- **Address business growth**: Contoso is growing, and there is pressure on on-premises systems and infrastructure.
- **Increase efficiency**: Contoso needs to remove unnecessary procedures, and streamline processes for developers and users.  The business needs IT to be fast and not waste time or money, thus delivering faster on customer requirements.
- **Increase agility**:  Contoso IT needs to be more responsive to the needs of the business. It must be able to react faster than the changes in the marketplace, to enable the success in a global economy.  It mustn't get in the way, or become a business blocker.
- **Scale**: As the business grows successfully, Contoso IT must provide systems that are able to grow at the same pace.
- **Costs**: Contoso wants to minimize licensing costs.

## Migration goals

The Contoso cloud team has pinned down goals for this migration. These goals were used to determine the best migration method.

**Requirements** | **Details**
--- | --- 
**App** | The app in Azure will remain as critical as it is today.<br/><br/> It should have the same performance capabilities as it currently does in VMWare.<br/><br/> The team doesn't want to invest in the app. For now, admins will simply move the app safely to the cloud.<br/><br/> The team want to stop supporting Windows Server 2008 R2, on which the app currently runs.<br/><br/> The team also wants to move away from SQL Server 2008 R2 to a modern PaaS Database platform, which will minimize the need for management.<br/><br/> Contoso want to leverage its investment in SQL Server licensing and Software Assurance where possible.<br/><br/> In addition, Contoso wants to mitigate the single point of failure on the web tier.
**Limitations** | The app consists of an ASP.NET app and a WCF service running on the same VM. They want to split this across two web apps using the Azure App Service. 
**Azure** | Contoso wants to move the app to Azure, but doesn't want to run it on VMs. Contoso wants to leverage Azure PaaS services for both the web and data tiers. 
**DevOps** | Contoso wants to move to a DevOps model, using Azure DevOps for their builds and release pipelines.

## Solution design

After pinning down goals and requirements, Contoso designs and review a deployment solution, and identifies the migration process, including the Azure services that will be used for migration.

### Current app

- The SmartHotel360 on-premises app is tiered across two VMs (WEBVM and SQLVM).
- The VMs are located on VMware ESXi host **contosohost1.contoso.com** (version 6.5)
- The VMware environment is managed by vCenter Server 6.5 (**vcenter.contoso.com**), running on a VM.
- Contoso has an on-premises datacenter (contoso-datacenter), with an on-premises domain controller (**contosodc1**).
- The on-premises VMs in the Contoso datacenter will be decommissioned after the migration is done.


### Proposed solution

- For the database tier of the app, Contoso compared Azure SQL Database with SQL Server using [this article](https://docs.microsoft.com/azure/sql-database/sql-database-features). Contoso decided to go with Azure SQL Database for a few reasons:
    - Azure SQL Database is a relational-database managed service. It delivers predictable performance at multiple service levels, with near-zero administration. Advantages include dynamic scalability with no downtime, built-in intelligent optimization, and global scalability and availability.
    - Contoso can leverage the lightweight Data Migration Assistant (DMA) to assess and migrate the on-premises database to Azure SQL.
    - With Software Assurance, Contoso can exchange existing licenses for discounted rates on a SQL Database, using the Azure Hybrid Benefit for SQL Server. This could provide savings of up to 30%.
    - SQL Database provides a number of security features including always encrypted, dynamic data masking, and row-level security/threat detection.
- For the app web tier, Contoso has decided to use Azure App Service. This PaaS service enables that to deploy the app with just a few configuration changes. Contoso will use Visual Studio to make the change, and deploy two web apps. One for the website, and one for the WCF service.
- To meet requirements for a DevOps pipeline, Contoso has selected to use Azure DevOps for Source Code Management (SCM) with Git repos. Automated builds and release will be used to build the code, and deploy it to the Azure Web Apps.
  
### Solution review
Contoso evaluates their proposed design by putting together a pros and cons list.

**Consideration** | **Details**
--- | ---
**Pros** | The SmartHotel360 app code won't need to be altered for migration to Azure.<br/><br/> Contoso can leverage their investment in Software Assurance using the Azure Hybrid Benefit for both SQL Server and Windows Server.<br/><br/> After the migration Windows Server 2008 R2 won't need to be supported. [Learn more](https://support.microsoft.com/lifecycle).<br/><br/> Contoso can configure the web tier of the app with multiple instances, so that it's no longer a single point of failure.<br/><br/> The database will no longer be dependent on the aging SQL Server 2008 R2.<br/><br/> SQL Database supports the technical requirements. Contoso assessed the on-premises database using the Database Migration Assistant and found that it's compatible.<br/><br/> SQL Database has built-in fault tolerance that Contoso don't need to set up. This ensures that the data tier is no longer a single point of failover.
**Cons** | Azure App Services only supports one app deployment for each Web App. This means that two Web Apps must be provisioned (one for the website and one for the WCF service).<br/><br/> If Contoso uses the Data Migration Assistant instead of Data Migration Service to migrate their database, it won’t have the infrastructure ready for migrating databases at scale. Contoso will need to build another region to ensure failover if the primary region is unavailable.

## Proposed architecture

![Scenario architecture](media/contoso-migration-refactor-web-app-sql/architecture.png) 


### Migration process

1. Contoso provisions an Azure SQL instance, and migrates the SmartHotel360 database to it.
2. Contoso provisions and configures Web Apps, and deploys the SmartHotel360 app to them.

    ![Migration process](media/contoso-migration-refactor-web-app-sql/migration-process.png) 

### Azure services

**Service** | **Description** | **Cost**
--- | --- | ---
[Database Migration Assistant (DMA)](https://docs.microsoft.com/sql/dma/dma-overview?view=ssdt-18vs2017) | Contoso will use DMA to assess and detect compatibility issues that might impact their database functionality in Azure. DMA assesses feature parity between SQL sources and targets, and recommends performance and reliability improvements. | It's a downloadable tool free of charge.
[Azure SQL Database](https://azure.microsoft.com/services/sql-database/) | An intelligent, fully managed relational cloud database service. | Cost based on features, throughput, and size. [Learn more](https://azure.microsoft.com/pricing/details/sql-database/managed/).
[Azure App Services - Web Apps](https://docs.microsoft.com/azure/app-service/app-service-web-overview) | Create powerful cloud apps using a fully managed platform | Cost based on size, location, and usage duration. [Learn more](https://azure.microsoft.com/pricing/details/app-service/windows/).
[Azure DevOps](https://docs.microsoft.com/azure/azure-portal/tutorial-azureportal-devops) | Provides a continuous integration and continuous deployment (CI/CD) pipeline for app development. The pipeline starts with a Git repository for managing app code, a build system for producing packages and other build artifacts, and a Release Management system to deploy changes in dev, test, and production environments. 

## Prerequisites

Here's Contoso needs to run this scenario:

**Requirements** | **Details**
--- | ---
**Azure subscription** | Contoso created subscriptions during an early article. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/pricing/free-trial/).<br/><br/> If you create a free account, you're the administrator of your subscription and can perform all actions.<br/><br/> If you use an existing subscription and you're not the administrator, you need to work with the admin to assign you Owner or Contributor permissions.
**Azure infrastructure** | [Learn how](contoso-migration-infrastructure.md) Contoso set up an Azure infrastructure.


## Scenario steps

Here's how Contoso will run the migration:

> [!div class="checklist"]
> * **Step 1: Provision a SQL Database instance in Azure**: Contoso provisions a SQL instance in Azure. After the app website is migrate to Azure, the WCF service web app will point to this instance.
> * **Step 2: Migrate the database with DMA**: Contoso migrates the app database with the Database Migration Assistant.
> * **Step 3: Provision Web Apps**: Contoso provisions the two web apps.
> * **Step 4: Set up Azure DevOps**: Contoso creates a new Azure DevOps project, and imports the Git repo.
> * **Step 5: Configure connection strings**: Contoso configures connection strings so that the web tier web app, the WCF service web app, and the SQL instance can communicate.
> * **Step 6: Set up build and release pipelines**: As a final step, Contoso sets up build and release pipelines to create the app, and deploys them to two separate Azure Web Apps.


## Step 1: Provision an Azure SQL Database

1. Contoso admins select to create a SQL Database in Azure. 

    ![Provision SQL](media/contoso-migration-refactor-web-app-sql/provision-sql1.png)

2. They specify a database  name to match the database running on the on-premises VM (**SmartHotel.Registration**). They place the database in the ContosoRG resource group. This is the resource group they use for production resources in Azure.

    ![Provision SQL](media/contoso-migration-refactor-web-app-sql/provision-sql2.png)

3. They set up a new SQL Server instance (**sql-smarthotel-eus2**) in the primary region.

    ![Provision SQL](media/contoso-migration-refactor-web-app-sql/provision-sql3.png)

4. They set the pricing tier to match their server and database needs. And they select to save money with Azure Hybrid Benefit because they already have a SQL Server license.
5. For sizing they use v-Core-based purchasing, and set the limits for their expected requirements.

    ![Provision SQL](media/contoso-migration-refactor-web-app-sql/provision-sql4.png)

6. Then they create the database instance.

    ![Provision SQL](media/contoso-migration-refactor-web-app-sql/provision-sql5.png)

7. After the instance is created, they open the database, and note details they need when they use the Database Migration Assistance for migration.

    ![Provision SQL](media/contoso-migration-refactor-web-app-sql/provision-sql6.png)


**Need more help?**

- [Get help](https://docs.microsoft.com/azure/sql-database/sql-database-get-started-portal) provisioning a SQL Database.
- [Learn about](https://docs.microsoft.com/azure/sql-database/sql-database-vcore-resource-limits-elastic-pools) v-Core resource limits.


## Step 2: Migrate the database with DMA

Contoso admins will migrate the SmartHotel360 database using DMA.

### Install DMA

1. They download the tool from the [Microsoft Download Center](https://www.microsoft.com/download/details.aspx?id=53595) to the on-premises SQL Server VM (**SQLVM**).
2. They run setup (DownloadMigrationAssistant.msi) on the VM.
3. On the **Finish** page, they select **Launch Microsoft Data Migration Assistant** before finishing the wizard.

### Migrate the database with DMA

1. In the DMA, they create a new project (**SmartHotelDB**) and select **Migration** 
2. They select the source server type as **SQL Server**, and the target as **Azure SQL Database**. 

    ![DMA](media/contoso-migration-refactor-web-app-sql/dma-1.png)

3. In the migration details, they add **SQLVM** as the source server, and the **SmartHotel.Registration** database. 

     ![DMA](media/contoso-migration-refactor-web-app-sql/dma-2.png)

4. They receive an error which seems to be associated with authentication. However after investigating, the issue is the period (.) in the database name. As a workaround, they decided to provision a new SQL database using the name **SmartHotel-Registration**, to resolve the issue. When they run DMA again, they're able to select **SmartHotel-Registration**, and continue with the wizard.

    ![DMA](media/contoso-migration-refactor-web-app-sql/dma-3.png)

5. In **Select Objects**, they select the database tables, and generate a SQL script.

    ![DMA](media/contoso-migration-refactor-web-app-sql/dma-4.png)

6. After DMS creates the script, they click **Deploy schema**.

    ![DMA](media/contoso-migration-refactor-web-app-sql/dma-5.png)

7. DMA confirms that the deployment succeeded.

    ![DMA](media/contoso-migration-refactor-web-app-sql/dma-6.png)

8. Now they start the migration.

    ![DMA](media/contoso-migration-refactor-web-app-sql/dma-7.png)

9. After the migration finishes, Contoso admins can verify that the database is running on the Azure SQL instance.

    ![DMA](media/contoso-migration-refactor-web-app-sql/dma-8.png)

10. They delete the extra SQL database **SmartHotel.Registration** in the Azure portal.

    ![DMA](media/contoso-migration-refactor-web-app-sql/dma-9.png)


## Step 3: Provision Web Apps

With the database migrated, Contoso admins can now provision the two web apps.

1. They select **Web App** in the portal.

    ![Web app](media/contoso-migration-refactor-web-app-sql/web-app1.png)

2. They provide an app name (**SHWEB-EUS2**), run it on Windows, and place it un the production resources group **ContosoRG**. They create a new app service and plan.

    ![Web app](media/contoso-migration-refactor-web-app-sql/web-app2.png)

3. After the web app is provisioned, they repeat the process to create a web app for the WCF service (**SHWCF-EUS2**)

    ![Web app](media/contoso-migration-refactor-web-app-sql/web-app3.png)

4. After they're done, they browse to the address of the apps to check they've been created successfully.


## Step 4: Set up Azure DevOps


Contoso needs to build the DevOps infrastructure and pipelines for the application.  To do this, Contoso admins create a new DevOps project, import the code, and then set up build and release pipelines.

1.	 In the Contoso Azure DevOps account, they create a new project (**ContosoSmartHotelRefactor**), and select **Git** for version control.

    ![New project](./media/contoso-migration-refactor-web-app-sql/vsts1.png)
2. They import the Git Repo that currently holds their app code. It's in a [public repo](https://github.com/Microsoft/SmartHotel360-internal-booking-apps) and you can download it.

    ![Download app code](./media/contoso-migration-refactor-web-app-sql/vsts2.png)
    
3. After the code is imported, they connect Visual Studio to the repo, and clone the code using Team Explorer.

    ![Connect to project](./media/contoso-migration-refactor-web-app-sql/devops1.png)

4. After the repo is cloned to the developer machine, they open the Solution file for the app. The web app and wcf service each have separate project within the file.

    ![Solution file](./media/contoso-migration-refactor-web-app-sql/vsts4.png)
    

## Step 5: Configure connection strings

Contoso admins need to make sure the web apps and database can all communicate. To do this, they configure connection strings in the code and in the web apps.

1. In the web app for the WCF service (**SHWCF-EUS2**) > **Settings** > **Application settings**, they add a new connection string named **DefaultConnection**.
2. The connection string is pulled from the **SmartHotel-Registration** database, and should be updated with the correct credentials.

    ![Connection string](media/contoso-migration-refactor-web-app-sql/string1.png)

3. Using Visual Studio, they open the **SmartHotel.Registration.wcf** project from the solution file. The **connectionStrings** section of the web.config file for the WCF service SmartHotel.Registration.Wcf should be updated with the connection string.

     ![Connection string](media/contoso-migration-refactor-web-app-sql/string2.png)

4. The **client** section of the web.config file for the SmartHotel.Registration.Web should be changed to point to the new location of the WCF service. This is the URL of the WCF web app hosting the service endpoint.

    ![Connection string](media/contoso-migration-refactor-web-app-sql/strings3.png)

5. After the changes are in the code, admins need to commit the changes. Using Team Explorer in Visual Studio, they commmit and sync.


## Step 6: Set up build and release pipelines in Azure DevOps

Contoso admins now configure Azure DevOps to perform build and release process.

1. In Azure DevOps, they click **Build and release** > **New pipeline**.

    ![New pipeline](./media/contoso-migration-refactor-web-app-sql/pipeline1.png)

2. They select **Azure Repos Git** and the relevant repo.

    ![Git and repo](./media/contoso-migration-refactor-web-app-sql/pipeline2.png)

3. In **Select a template**, they select the ASP.NET template for their build.

     ![ASP.NET template](./media/contoso-migration-refactor-web-app-sql/pipeline3.png)
    
4. The name **ContosoSmartHotelRefactor-ASP.NET-CI** is used for the build. They click **Save & Queue**.

     ![Save and queue](./media/contoso-migration-refactor-web-app-sql/pipeline4.png)

5. This kicks off the first build. They click on the build number to watch the process. After it's finished they can see the process feedback, and click **Artifacts** to review the build results.

    ![Review](./media/contoso-migration-refactor-web-app-sql/pipeline5.png)

6. The folder **Drop** contains the build results.

    - The two zip files are the packages that contain the apps.
    - These files are used in the release pipeline for deployment to Azure Web Apps

     ![Artifact](./media/contoso-migration-refactor-web-app-sql/pipeline6.png)

7. They click **Releases** > **+New pipeline**.

    ![New pipeline](./media/contoso-migration-refactor-web-app-sql/pipeline7.png)

8. They select the Azure App Service deployment template.

    ![Azure App Service template](./media/contoso-migration-refactor-web-app-sql/pipeline8.png)

9. They name the release pipeline **ContosoSmartHotel360Refactor**, and specify the name of the WCF web app (SHWCF-EUS2) for the **Stage** name.

    ![Environment](./media/contoso-migration-refactor-web-app-sql/pipeline9.png)

10. Under the stages, they click **1 job, 1 task** to configure deployment of the WCF service.

    ![Deploy WCF](./media/contoso-migration-refactor-web-app-sql/pipeline10.png)

11. They verify the subscription is selected and authorized, and select the **App service name**.

     ![Select app service](./media/contoso-migration-refactor-web-app-sql/pipeline11.png)

12. On the pipeline > **Artifacts**, they select **+Add an artifact**, and select to build with the **ContosoSmarthotel360Refactor** pipeline.

     ![Build](./media/contoso-migration-refactor-web-app-sql/pipeline12.png)

15. They click the lightning bolt on the artifact is checked., to enable continuous deployment trigger.

     ![Lightning bolt](./media/contoso-migration-refactor-web-app-sql/pipeline13.png)

16. The continuous deployment trigger should be set to **Enabled**.

   ![Continuous deployment enabled](./media/contoso-migration-refactor-web-app-sql/pipeline14.png) 

17. Now, they move back to the Stage 1 job, I tasks, and click **Deploy Azure App Service**.

    ![Deploy app service](./media/contoso-migration-refactor-web-app-sql/pipeline15.png)

18. In **Select a file or folder**, they locate the **SmartHotel.Registration.Wcf.zip** file that was creating during the build, and clilck **Save**.-sql

    ![Save WCF](./media/contoso-migration-refactor-web-app-sql/pipeline16.png)

19. They click **Pipeline** > **Stages** **+Add**, to add an environment for **SHWEB-EUS2**. They select another Azure App Service deployment.

    ![Add environment](./media/contoso-migration-refactor-web-app-sql/pipeline17.png)

20. They repeat the process to publish the web app (**SmartHotel.Registration.Web.zip**) file to the correct web app.

    ![Publish web app](./media/contoso-migration-refactor-web-app-sql/pipeline18.png)

21. After it's saved, the release pipeline will show as follows.

     ![Release pipeline summary](./media/contoso-migration-refactor-web-app-sql/pipeline19.png)

22. They move back to **Build**, and click **Triggers** > **Enable continuous integration**. This enables the pipeline so that when changes are committed to the code, and full build and release occurs.

    ![Enable continuous integration](./media/contoso-migration-refactor-web-app-sql/pipeline20.png)

23. They click **Save & Queue** to run the full pipeline. A new build is triggered that in turn creates the first release of the app to the Azure App Service.

    ![Save pipeline](./media/contoso-migration-refactor-web-app-sql/pipeline21.png)

24. Contoso admins can follow the build and release pipeline process from Azure DevOps. After the build completes, the release will start.

    ![Build and release app](./media/contoso-migration-refactor-web-app-sql/pipeline22.png)

25. After the pipeline finishes, both sites have been deployed and the app is up and running online.

    ![Finish release](./media/contoso-migration-refactor-web-app-sql/pipeline23.png)

At this point, the app is successfully migrated to Azure.



## Clean up after migration

After migration, Contoso needs to complete these cleanup steps:  

- Remove the on-premises VMs from the vCenter inventory.
- Remove the VMs from local backup jobs.
- Update internal documentation to show the new locations for the SmartHotel360 app. Show the database as running in Azure SQL database, and the front end as running in two web apps.
- Review any resources that interact with the decommissioned VMs, and update any relevant settings or documentation to reflect the new configuration.


## Review the deployment

With the migrated resources in Azure, Contoso needs to fully operationalize and secure their new infrastructure.

### Security

- Contoso needs to ensure that their new **SmartHotel-Registration** database is secure. [Learn more](https://docs.microsoft.com/azure/sql-database/sql-database-security-overview).
- In particular, Contoso should update the web apps to use SSL with certificates.

### Backups

- Contoso needs to review backup requirements for the Azure SQL Database. [Learn more](https://docs.microsoft.com/azure/sql-database/sql-database-automated-backups).
- Contoso also needs to learn about managing SQL Database backups and restores. [Learn more](https://docs.microsoft.com/azure/sql-database/sql-database-automated-backups) about automatic backups.
- Contoso should consider implementing failover groups to provide regional failover for the database. [Learn more](https://docs.microsoft.com/azure/sql-database/sql-database-geo-replication-overview).
- Contoso needs to consider deploying the Web App in the main East US 2 and Central US region for resilience. Contoso could configure Traffic Manager to ensure failover in case of regional outages.

### Licensing and cost optimization

- After all resources are deployed, Contoso should assign Azure tags based on their [infrastructure planning](contoso-migration-infrastructure.md#set-up-tagging).
- All licensing is built into the cost of the PaaS services that Contoso is consuming. This will be deducted from the EA.
- Contoso will enable Azure Cost Management licensed by Cloudyn, a Microsoft subsidiary. It's a multi-cloud cost management solution that helps you to utilize and manage Azure and other cloud resources.  [Learn more](https://docs.microsoft.com/azure/cost-management/overview) about Azure Cost Management.

## Conclusion

In this article, Contoso refactored the SmartHotel360 app in Azure by migrating the app frontend VM to two Azure Web Apps. The app database was migrated to an Azure SQL database.







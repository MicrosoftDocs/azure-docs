---
title: Discover SQL Server instances in an existing Azure Migrate project
description: Learn how to discover SQL Server instances in an existing Azure Migrate project. 
author: rashi-ms
ms.author: rajosh
ms.manager: abhemraj
ms.topic: how-to
ms.date: 11/23/2020
---


# Discover SQL Server instances in an existing project 

This article describes how to discover SQL Server instances and databases in an [Azure Migrate](./migrate-services-overview.md) project that was created before the preview of Azure SQL assessment feature.

Discovering SQL Server instances and databases running on on-premises machines helps identify and tailor a migration path to Azure SQL. The Azure Migrate appliance performs this discovery using the Domain credentials or SQL Server authentication credentials that have access to the SQL Server instances and databases running on the targeted servers. This discovery process is agentless i.e. nothing is installed on the target servers.

> [!Note]
> Discovery and assessment of SQL Server instances and databases running in your VMware environment is now in preview. To try out this feature, use [**this link**](https://aka.ms/AzureMigrate/SQL) to create a project in **Australia East** region. If you already have a project in Australia East and want to try out this feature, please ensure that you have completed the [**prerequisites**](how-to-discover-sql-existing-project.md) in this article.

## Before you start

- Make sure you've: 
    - Created an [Azure Migrate project](./create-manage-projects.md) before the announcement of SQL assessment feature for your region
    - Added the [Azure Migrate: Discovery and assessment](./how-to-assess.md) tool to a project
- Review [app-discovery support and requirements](./migrate-support-matrix-vmware.md#vmware-requirements).
-  Make sure servers where you're running app-discovery have PowerShell version 2.0 or later installed, and VMware Tools (later than 10.2.0) is installed.
- Check the [requirements](./migrate-appliance.md) for deploying the Azure Migrate appliance.
- Verify that you have the [required roles](./create-manage-projects.md#verify-permissions) in the subscription to create resources.
- Ensure that you appliance has access to the internet

## Enable discovery of SQL Server instances and databases

1. In your Azure Migrate Project, either
    - Select **Not enabled** on the Hub tile, or
        :::image type="content" source="./media/how-to-discover-sql-existing-project/hub-not-enabled.png" alt-text="Azure Migrate hub tile with SQL discovery not enabled":::
    - Select **Not enabled** on any entry in the Server discovery page under SQL instances column
        :::image type="content" source="./media/how-to-discover-sql-existing-project/discovery-not-enabled.png" alt-text="Azure Migrate discovered servers blade with SQL discovery not enabled":::
2. In Discover SQL Server instances and databases follow the steps entailed:
    - Select **Upgrade**, to create the required resource.
        :::image type="content" source="./media/how-to-discover-sql-existing-project/discovery-upgrade-appliance.png" alt-text="Button to upgrade the Azure Migrate appliance":::
    - Validate that the services running on the appliance are updated to the latest versions. To do so, launch the Appliance configuration manager from your appliance server and select view appliance services from the Set up prerequisites panel.
        - Appliance and its components are automatically updated
         :::image type="content" source="./media/how-to-discover-sql-existing-project/appliance-services-version.png" alt-text="Check the appliance version":::
    - In the manage credentials and discovery sources panel of the Appliance configuration manager, add Domain or SQL Server Authentication credentials that have Sysadmin access on the SQL Server instance and databases to be discovered. 
    You can leverage either the automatic credential mapping feature of the appliance, or manually map the credentials to the respective server as highlighted [here](/azure/migrate/tutorial-discover-vmware#start-continuous-discovery).
        
    Some points to note:
    - Please ensure that software inventory is enabled already, or provide Domain or Non-domain credentials to enable the same. Software inventory must be performed to discover SQL Server instances.
    - Appliance will attempt to validate the Domain credentials with AD, as they are added. Please ensure that appliance server has network line of sight to the AD server associated with the credentials. Credentials associated with SQL Server Authentication are not validated. 

3. Once the desired credentials are added please select Start Discovery, to begin the scan.

> [!Note] 
>Please allow SQL discovery to run for sometime before creating assessments for Azure SQL. If the discovery of SQL Server instances and databases is not allowed to complete, the respective instances are marked as **Unknown** in the assessment report.

## Next steps

- Learn how to create an [Azure SQL assessment](./how-to-create-azure-sql-assessment.md)
- Learn more about [Azure SQL assessments](./concepts-azure-sql-assessment-calculation.md)
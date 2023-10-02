---
title: Discover SQL Server instances in an existing Azure Migrate project
description: Learn how to discover SQL Server instances in an existing Azure Migrate project. 
author: vineetvikram
ms.author: vivikram
ms.manager: abhemraj
ms.topic: how-to
ms.service: azure-migrate
ms.date: 09/27/2023
ms.custom: engagement-fy23
---

# Discover web apps and SQL Server instances in an existing project

This article describes how to discover web apps and SQL Server instances and databases in an [Azure Migrate](./migrate-services-overview.md) project that was created before the preview of Azure SQL assessment feature and/or before the preview of Azure App Service assessment feature.

Discovering web apps and SQL Server instances and databases running on on-premises machines helps identify and tailor a migration path to Azure. The Azure Migrate appliance performs this discovery using the Windows OS domain or non-domain credentials or SQL Server authentication credentials that have access to the SQL Server instances and databases running on the targeted servers.
This discovery process is agentless that is, nothing is installed on the target servers.

## Before you start

- Make sure you've:
    - Created an [Azure Migrate project](./create-manage-projects.md) before the announcement of SQL and web apps assessment feature for your region
    - Added the [Azure Migrate: Discovery and assessment](./how-to-assess.md) tool to a project
- Review [app-discovery support and requirements](./migrate-support-matrix-vmware.md#vmware-requirements).
-  In case you're discovering assets on a VMware environment, make sure the servers where you're running app discovery have PowerShell version 2.0 or later installed, and VMware tools (later than 10.2.0) installed.
- Check the [requirements](./migrate-appliance.md) for deploying the Azure Migrate appliance.
- Verify that you have the [required roles](./create-manage-projects.md#verify-permissions) in the subscription to create resources.
- Ensure that your appliance has access to the internet

> [!Note]
> Though the procedure described in this article is for VMware, the processes are similar for Microsoft Hyper-V and Physical environments.
> Discovery and assessment for SQL Server instances and databases is available across the Microsoft Hyper-V and Physical environments.

## Enable discovery of web apps and SQL Server instances and databases

1. In your Azure Migrate project, either
    - Select **Not enabled** on the Hub tile, or
        :::image type="content" source="./media/how-to-discover-sql-existing-project/hub-not-enabled.png" alt-text="Azure Migrate hub tile with SQL and web apps discovery not enabled":::
    - Select **Not enabled** on any entry in the Server discovery page under SQL instances or Web apps column
        :::image type="content" source="./media/how-to-discover-sql-existing-project/discovery-not-enabled.png" alt-text="Azure Migrate discovered servers blade with SQL and web apps discovery not enabled":::
2. To discover web apps and SQL Server instances and databases follow the steps entailed:
    - Select **Upgrade**, to create the required resource.
        :::image type="content" source="./media/how-to-discover-sql-existing-project/discovery-upgrade-appliance.png" alt-text="Button to upgrade the Azure Migrate appliance":::
    - Validate that the services running on the appliance are updated to the latest versions. To do so, launch the Appliance configuration manager from your appliance server and select view appliance services from the Setup prerequisites panel.
        - Appliance and its components are automatically updated
         :::image type="content" source="./media/how-to-discover-sql-existing-project/appliance-services-version.png" alt-text="Check the appliance version":::
    - In the manage credentials and discovery sources panel of the Appliance configuration manager, add Domain or SQL Server Authentication credentials that have Sysadmin access on the SQL Server instance and databases to be discovered or have [these permissions](migrate-support-matrix-vmware.md#configure-the-custom-login-for-sql-server-discovery) for each SQL Server instance.
    - Web apps discovery works with both domain and non-domain Windows OS credentials as long as the account used has local admin privileges on servers.
    You can leverage the automatic credential-mapping feature of the appliance, as highlighted [here](./tutorial-discover-vmware.md#start-continuous-discovery).

    Some points to note:
    - Ensure that software inventory is enabled already, or provide Domain or Non-domain credentials to enable the same. Software inventory must be performed to discover SQL Server instances and web apps.
    - Appliance will attempt to validate the Domain credentials with AD, as they're added. Ensure that appliance server has network line of sight to the AD server associated with the credentials. Non-domain credentials and credentials associated with SQL Server Authentication aren't validated.

3. Once the desired credentials are added, select Start Discovery, to begin the scan.

> [!Note]
> - Allow web apps and SQL discovery to run for sometime before creating assessments for Azure App Service or Azure SQL. If the discovery of web apps and SQL Server instances and databases is not allowed to complete, the respective instances are marked as **Unknown** in the assessment report.
> - In a project containing multiple appliances, it's possible the Web app discovery and assessment agent of one appliance ends up discovering a web app running on a server discovered by another appliance. This doesn't impede the discovery or assessment experience of the web app.

## Next steps

- Learn how to create an [Azure SQL assessment](./how-to-create-azure-sql-assessment.md).
- Learn more about [Azure SQL assessments](./concepts-azure-sql-assessment-calculation.md).
- Learn how to create an [Azure App Service assessment](./how-to-create-azure-app-service-assessment.md).
- Learn more about [Azure App Service assessments](./concepts-azure-webapps-assessment-calculation.md).
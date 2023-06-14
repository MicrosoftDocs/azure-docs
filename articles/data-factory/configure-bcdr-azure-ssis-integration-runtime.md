---
title: Configure Azure-SSIS integration runtime for business continuity and disaster recovery (BCDR)
description: This article describes how to configure Azure-SSIS integration runtime in Azure Data Factory with Azure SQL Database/Managed Instance failover group for business continuity and disaster recovery (BCDR). 
services: data-factory
ms.service: data-factory
ms.subservice: integration-services
ms.workload: data-services
ms.devlang: powershell
author: chugugrace
ms.author: chugu
manager: mflasko
ms.reviewer: douglasl
ms.topic: conceptual
ms.custom: seo-lt-2019
ms.date: 04/12/2023
---

# Configure Azure-SSIS integration runtime for business continuity and disaster recovery (BCDR) 

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

Azure SQL Database/Managed Instance and SQL Server Integration Services (SSIS) in Azure Data Factory (ADF) or Synapse Pipelines can be combined as the recommended all-Platform as a Service (PaaS) solution for SQL Server migration. You can deploy your SSIS projects into SSIS catalog database (SSISDB) hosted by Azure SQL Database/Managed Instance and run your SSIS packages on Azure SSIS integration runtime (IR) in ADF or Synapse Pipelines.

For business continuity and disaster recovery (BCDR), Azure SQL Database/Managed Instance can be configured with a [geo-replication/failover group](/azure/azure-sql/database/auto-failover-group-overview), where SSISDB in a primary Azure region with read-write access (primary role) will be continuously replicated to a secondary region with read-only access (secondary role). When a disaster occurs in the primary region, a failover will be triggered, where the primary and secondary SSISDBs will swap roles.

For BCDR, you can also configure a dual standby Azure SSIS IR pair that works in sync with Azure SQL Database/Managed Instance failover group. This allows you to have a pair of running Azure-SSIS IRs that at any given time, only one can access the primary SSISDB to fetch and execute packages, as well as write package execution logs (primary role), while the other can only do the same for packages deployed somewhere else, for example in Azure Files (secondary role). When SSISDB failover occurs, the primary and secondary Azure-SSIS IRs will also swap roles and if both are running, there'll be a near-zero downtime.

This article describes how to configure Azure-SSIS IR with Azure SQL Database/Managed Instance failover group for BCDR.

## Configure a dual standby Azure-SSIS IR pair with Azure SQL Database failover group

To configure a dual standby Azure-SSIS IR pair that works in sync with Azure SQL Database failover group, complete the following steps.

1. Using Azure portal/ADF UI, you can create a new Azure-SSIS IR with your primary Azure SQL Database server to host SSISDB in the primary region. If you have an existing Azure-SSIS IR that's already attached to SSIDB hosted by your primary Azure SQL Database server and it's still running, you need to stop it first to reconfigure it. This will be your primary Azure-SSIS IR.

   When [selecting to use SSISDB](./tutorial-deploy-ssis-packages-azure.md#creating-ssisdb) on the **Deployment settings** page of **Integration runtime setup** pane, select also the **Use dual standby Azure-SSIS Integration Runtime pair with SSISDB failover** check box. For **Dual standby pair name**, enter a name to identify your pair of primary and secondary Azure-SSIS IRs. When you complete the creation of your primary Azure-SSIS IR, it will be started and attached to a primary SSISDB that will be created on your behalf with read-write access. If you've just reconfigured it, you need to restart it.

1. Using Azure portal, you can check whether the primary SSISDB has been created on the **Overview** page of your primary Azure SQL Database server. Once it's created, you can [create a failover group for your primary and secondary Azure SQL Database servers and add SSISDB to it](/azure/azure-sql/database/failover-group-add-single-database-tutorial?tabs=azure-portal#2---create-the-failover-group) on the **Failover groups** page. Once your failover group is created, you can check whether the primary SSISDB has been replicated to a secondary one with read-only access on the **Overview** page of your secondary Azure SQL Database server.

1. Using Azure portal/ADF UI, you can create another Azure-SSIS IR with your secondary Azure SQL Database server to host SSISDB in the secondary region. This will be your secondary Azure-SSIS IR. For complete BCDR, make sure that all resources it depends on are also created in the secondary region, for example Azure Storage for storing custom setup script/files, ADF for orchestration/scheduling package executions, etc.

   When [selecting to use SSISDB](./tutorial-deploy-ssis-packages-azure.md#creating-ssisdb) on the **Deployment settings** page of **Integration runtime setup** pane, select also the **Use dual standby Azure-SSIS Integration Runtime pair with SSISDB failover** check box. For **Dual standby pair name**, enter the same name to identify your pair of primary and secondary Azure-SSIS IRs. When you complete the creation of your secondary Azure-SSIS IR, it will be started and attached to the secondary SSISDB.

1. If you want to have a near-zero downtime when SSISDB failover occurs, keep both of your Azure-SSIS IRs running. Only your primary Azure-SSIS IR can access the primary SSISDB to fetch and execute packages, as well as write package execution logs, while your secondary Azure-SSIS IR can only do the same for packages deployed somewhere else, for example in Azure Files.

   If you want to minimize your running cost, you can stop your secondary Azure-SSIS IR after it's created. When SSISDB failover occurs, your primary and secondary Azure-SSIS IRs will swap roles. If your primary Azure-SSIS IR is stopped, you need to restart it. Depending on whether it's injected into a virtual network and the injection method used, it will take within 5 minutes or around 20 - 30 minutes for it to run.

1. If you [use ADF for orchestration/scheduling package executions](./how-to-invoke-ssis-package-ssis-activity.md), make sure that all relevant ADF pipelines with Execute SSIS Package activities and associated triggers are copied to your secondary ADF with the triggers initially disabled. When SSISDB failover occurs, you need to enable them.

1. You can [test your Azure SQL Database failover group](/azure/azure-sql/database/failover-group-add-single-database-tutorial?tabs=azure-portal#3---test-failover) and check on [Azure-SSIS IR monitoring page in ADF portal](./monitor-integration-runtime.md#monitor-the-azure-ssis-integration-runtime-in-azure-portal) whether your primary and secondary Azure-SSIS IRs have swapped roles. 

## Configure a dual standby Azure-SSIS IR pair with Azure SQL Managed Instance failover group

To configure a dual standby Azure-SSIS IR pair that works in sync with Azure SQL Managed Instance failover group, complete the following steps.

1. Using Azure portal, you can [create a failover group for your primary and secondary Azure SQL Managed Instances](/azure/azure-sql/managed-instance/failover-group-add-instance-tutorial?tabs=azure-portal) on the **Failover groups** page of your primary Azure SQL Managed Instance.

1. Using Azure portal/ADF UI, you can create a new Azure-SSIS IR with your primary Azure SQL Managed Instance to host SSISDB in the primary region. If you have an existing Azure-SSIS IR that's already attached to SSIDB hosted by your primary Azure SQL Managed Instance and it's still running, you need to stop it first to reconfigure it. This will be your primary Azure-SSIS IR.

   When [selecting to use SSISDB](./create-azure-ssis-integration-runtime-portal.md#creating-ssisdb) on the **Deployment settings** page of **Integration runtime setup** pane, select also the **Use dual standby Azure-SSIS Integration Runtime pair with SSISDB failover** check box. For **Dual standby pair name**, enter a name to identify your pair of primary and secondary Azure-SSIS IRs. When you complete the creation of your primary Azure-SSIS IR, it will be started and attached to a primary SSISDB that will be created on your behalf with read-write access. If you've just reconfigured it, you need to restart it. You can also check whether the primary SSISDB has been replicated to a secondary one with read-only access on the **Overview** page of your secondary Azure SQL Managed Instance.

1. Using Azure portal/ADF UI, you can create another Azure-SSIS IR with your secondary Azure SQL Managed Instance to host SSISDB in the secondary region. This will be your secondary Azure-SSIS IR. For complete BCDR, make sure that all resources it depends on are also created in the secondary region, for example Azure Storage for storing custom setup script/files, ADF for orchestration/scheduling package executions, etc.

   When [selecting to use SSISDB](./create-azure-ssis-integration-runtime-portal.md#creating-ssisdb) on the **Deployment settings** page of **Integration runtime setup** pane, select also the **Use dual standby Azure-SSIS Integration Runtime pair with SSISDB failover** check box. For **Dual standby pair name**, enter the same name to identify your pair of primary and secondary Azure-SSIS IRs. When you complete the creation of your secondary Azure-SSIS IR, it will be started and attached to the secondary SSISDB.

1. Azure SQL Managed Instance can secure sensitive data in databases, such as SSISDB, by encrypting them using Database Master Key (DMK). DMK itself is in turn encrypted using Service Master Key (SMK) by default. Since September 2021, SMK is replicated from your primary Azure SQL Managed Instance to your secondary one during the creation of failover group. If your failover group was created before then, please delete all user databases, including SSISDB, from your secondary Azure SQL Managed Instance and recreate your failover group.

1. If you want to have a near-zero downtime when SSISDB failover occurs, keep both of your Azure-SSIS IRs running. Only your primary Azure-SSIS IR can access the primary SSISDB to fetch and execute packages, as well as write package execution logs, while your secondary Azure-SSIS IR can only do the same for packages deployed somewhere else, for example in Azure Files.

   If you want to minimize your running cost, you can stop your secondary Azure-SSIS IR after it's created. When SSISDB failover occurs, your primary and secondary Azure-SSIS IRs will swap roles. If your primary Azure-SSIS IR is stopped, you need to restart it. Depending on whether it's injected into a virtual network and the injection method used, it will take within 5 minutes or around 20 - 30 minutes for it to run.

1. If you [use Azure SQL Managed Instance Agent for orchestration/scheduling package executions](./how-to-invoke-ssis-package-managed-instance-agent.md), make sure that all relevant SSIS jobs with their job steps and associated schedules are copied to your secondary Azure SQL Managed Instance with the schedules initially disabled. Using SSMS, complete the following steps.

   1. For each SSIS job, right-click and select the **Script Job as**, **CREATE To**, and **New Query Editor Window** dropdown menu items to generate its script.

      :::image type="content" source="media/configure-bcdr-azure-ssis-integration-runtime/generate-ssis-job-script.png" alt-text="Generate SSIS job script":::

   1. For each generated SSIS job script, find the command to execute `sp_add_job` stored procedure and modify/remove the value assignment to `@owner_login_name` argument as necessary.

   1. For each updated SSIS job script, run it on your secondary Azure SQL Managed Instance to copy the job with its job steps and associated schedules.

   1. Using the following script, create a new T-SQL job to enable/disable SSIS job schedules based on the primary/secondary SSISDB role, respectively, in both your primary and secondary Azure SQL Managed Instances and run it regularly. When SSISDB failover occurs, SSIS job schedules that were disabled will be enabled and vice versa.

      ```sql
      IF (SELECT Top 1 role_desc FROM SSISDB.sys.dm_geo_replication_link_status WHERE partner_database = 'SSISDB') = 'PRIMARY'
         BEGIN
            IF (SELECT enabled FROM msdb.dbo.sysschedules WHERE schedule_id = <ScheduleID>) = 0
	           EXEC msdb.dbo.sp_update_schedule @schedule_id = <ScheduleID >, @enabled = 1
         END
      ELSE
         BEGIN
            IF (SELECT enabled FROM msdb.dbo.sysschedules WHERE schedule_id = <ScheduleID>) = 1
    	       EXEC msdb.dbo.sp_update_schedule @schedule_id = <ScheduleID >, @enabled = 0
         END
      ```

1. If you [use ADF for orchestration/scheduling package executions](./how-to-invoke-ssis-package-ssis-activity.md), make sure that all relevant ADF pipelines with Execute SSIS Package activities and associated triggers are copied to your secondary ADF with the triggers initially disabled. When SSISDB failover occurs, you need to enable them.

1. You can [test your Azure SQL Managed Instance failover group](/azure/azure-sql/managed-instance/failover-group-add-instance-tutorial?tabs=azure-portal#test-failover) and check on [Azure-SSIS IR monitoring page in ADF portal](./monitor-integration-runtime.md#monitor-the-azure-ssis-integration-runtime-in-azure-portal) whether your primary and secondary Azure-SSIS IRs have swapped roles. 

## Attach a new Azure-SSIS IR to existing SSISDB hosted by Azure SQL Database/Managed Instance

If a disaster occurs and impacts your existing Azure-SSIS IR but not Azure SQL Database/Managed Instance in the same region, you can replace it with a new one in another region. To attach your existing SSISDB hosted by Azure SQL Database/Managed Instance to a new Azure-SSIS IR, complete the following steps.

1. If your existing Azure-SSIS IR is still running, you need to stop it first using Azure portal/ADF UI or Azure PowerShell. If the disaster also impacts ADF in the same region, you can skip this step.

1. Using SSMS, run the following command for SSISDB in your Azure SQL Database/Managed Instance to update the metadata that will allow connections from your new ADF/Azure-SSIS IR.

   ```sql
   EXEC [catalog].[failover_integration_runtime] @data_factory_name = 'YourNewADF', @integration_runtime_name = 'YourNewAzureSSISIR'
   ```

1. Using [Azure portal/ADF UI](./create-azure-ssis-integration-runtime-portal.md) or [Azure PowerShell](./create-azure-ssis-integration-runtime-powershell.md), create your new ADF/Azure-SSIS IR named *YourNewADF*/*YourNewAzureSSISIR*, respectively, in another region. If you use Azure portal/ADF UI, you can ignore the test connection error on **Deployment settings** page of **Integration runtime setup** pane.

## Next steps

You can consider these other configuration options for your Azure-SSIS IR:

- [Configure package stores for your Azure-SSIS IR](./create-azure-ssis-integration-runtime-portal.md#creating-azure-ssis-ir-package-stores)

- [Configure custom setups for your Azure-SSIS IR](./how-to-configure-azure-ssis-ir-custom-setup.md)

- [Configure virtual network injection for your Azure-SSIS IR](./join-azure-ssis-integration-runtime-virtual-network.md)

- [Configure self-hosted IR as a proxy for your Azure-SSIS IR](./self-hosted-integration-runtime-proxy-ssis.md)

---
title: Migrate on-premises SQL Server Integration Services (SSIS) jobs to Azure Data Factory  
description: This article describes how to migrate SQL Server Integration Services (SSIS) jobs to Azure Data Factory pipelines/activities/triggers by using SQL Server Management Studio.
author: chugugrace
ms.author: chugu
ms.service: data-factory
ms.subservice: integration-services
ms.topic: conceptual
ms.date: 07/20/2023
---
# Migrate SQL Server Agent jobs to ADF with SSMS

[!INCLUDE[appliesto-adf-xxx-md](includes/appliesto-adf-xxx-md.md)]

When [migrating on-premises SQL Server Integration Services (SSIS) workloads to SSIS in ADF](scenario-ssis-migration-overview.md), after SSIS packages are migrated, you can do batch migration of SQL Server Agent jobs with job step type of SQL Server Integration Services Package to Azure Data Factory (ADF) pipelines/activities/schedule triggers via SQL Server Management Studio (SSMS) **SSIS Job Migration Wizard**.

In general, for selected SQL agent jobs with applicable job step types, **SSIS Job Migration Wizard** can:

- map on-premises SSIS package location to where the packages are migrated to, which are accessible by SSIS in ADF.
    > [!NOTE]
    > Package location of File System is supported only.
- migrate applicable jobs with applicable job steps to corresponding ADF resources as below:

|SQL Agent job object  |ADF resource  |Notes|
|---------|---------|---------|
|SQL Agent job|pipeline     |Name of the pipeline will be *Generated for \<job name>*. <br> <br> Built-in agent jobs are not applicable: <li> SSIS Server Maintenance Job <li> syspolicy_purge_history <li> collection_set_* <li> mdw_purge_data_* <li> sysutility_*|
|SSIS job step|Execute SSIS package activity|<li> Name of the activity will be \<step name>. <li> Proxy account used in job step will be migrated as Windows authentication of this activity. <li> *Execution options* except *Use 32-bit runtime* defined in job step will be ignored in migration. <li> *Verification* defined in job step will be ignored in migration.|
|schedule      |schedule trigger        |Name of the schedule trigger will be *Generated for \<schedule name>*. <br> <br> Below options in SQL Agent job schedule will be ignored in migration: <li> Second-level interval. <li> *Start automatically when SQL Server Agent starts* <li> *Start whenever the CPUs become idle* <li> *weekday* and *weekend day* &gt;time zone&lt; <br> Below are the differences after SQL Agent job schedule is migrated to ADF schedule trigger: <li> ADF Schedule Trigger subsequent run is independent of the execution state of the antecedent triggered run. <li> ADF Schedule Trigger recurrence configuration differs from Daily frequency in SQL agent job.|

- generate Azure Resource Manager (ARM) templates in local output folder, and deploy to data factory directly or later manually. For more information about ADF Resource Manager templates, see [Microsoft.DataFactory resource types](/azure/templates/microsoft.datafactory/allversions).

## Prerequisites

The feature described in this article requires SQL Server Management Studio version 18.5 or higher. To get the latest version of SSMS, see [Download SQL Server Management Studio (SSMS)](/sql/ssms/download-sql-server-management-studio-ssms).

## Migrate SSIS jobs to ADF

1. In SSMS, in Object Explorer, select SQL Server Agent, select Jobs, then right-click and select **Migrate SSIS Jobs to ADF**.
:::image type="content" source="media/how-to-migrate-ssis-job-ssms/menu.png" alt-text="Screenshot shows SQL Server Management Studio Object Explorer, where you can select Jobs, then Migrate S S I S Jobs to A D F.":::

1. Sign In Azure, select Azure Subscription, Data Factory, and Integration Runtime. Azure Storage is optional, which is used in the package location mapping step if SSIS jobs to be migrated have SSIS File System packages.
:::image type="content" source="media/how-to-migrate-ssis-job-ssms/step1.png" alt-text="menu":::

1. Map the paths of SSIS packages and configuration files in SSIS jobs to destination paths where migrated pipelines can access. In this mapping step, you can:

    1. Select a source folder, then **Add Mapping**.
    1. Update source folder path. Valid paths are folder paths or parent folder paths of packages.
    1. Update destination folder path. Default is relative path to the default Storage account, which is selected in step 1.
    1. Delete a selected mapping via **Delete Mapping**.
:::image type="content" source="media/how-to-migrate-ssis-job-ssms/step2.png" alt-text="Screenshot shows the Map S S I S Package and Configuration Paths page, where you can add mapping.":::
:::image type="content" source="media/how-to-migrate-ssis-job-ssms/step2-1.png" alt-text="Screenshot shows the Map S S I S Package and Configuration Paths page, where you can update the source and destination folder paths.":::

1. Select applicable jobs to migrate, and configure the settings of corresponding *Executed SSIS Package activity*.

    - *Default Setting*, applies to all selected steps by default. For more information of each property, see *Settings tab* for the [Execute SSIS Package activity](how-to-invoke-ssis-package-ssis-activity.md) when package location is *File System (Package)*.
    :::image type="content" source="media/how-to-migrate-ssis-job-ssms/step3-1.png" alt-text="Screenshot shows the Select S S I S Jobs page, where you can configure the settings of corresponding Executed SSIS Package activity.":::
    - *Step Setting*, configure setting for a selected step.
        
        **Apply Default Setting**: default is selected. Unselect to configure setting for selected step only.  
        For more information of other properties, see *Settings tab* for the [Execute SSIS Package activity](how-to-invoke-ssis-package-ssis-activity.md) when package location is *File System (Package)*.
    :::image type="content" source="media/how-to-migrate-ssis-job-ssms/step3-2.png" alt-text="Screenshot shows the Select S S I S Jobs page, where you can apply the default settings.":::

1. Generate and deploy ARM template.
    1. Select or input the output path for the ARM templates of the migrated ADF pipelines. Folder will be created automatically if not exists.
    2. Select the option of **Deploy ARM templates to your data factory**:
        - Default is unselected. You can deploy generated ARM templates later manually.
        - Select to deploy generated ARM templates to data factory directly.
    :::image type="content" source="media/how-to-migrate-ssis-job-ssms/step4.png" alt-text="Screenshot shows the Configure Migration page, where you can select or input the output path for the ARM templates of the migrated ADF pipelines and select the option of Deploy ARM templates to your data factory.":::

1. Migrate, then check results.
:::image type="content" source="media/how-to-migrate-ssis-job-ssms/step5.png" alt-text="Screenshot shows the Migration Result page, which displays the progress of the migration.":::

## Next steps

[Run and monitor pipeline](how-to-invoke-ssis-package-ssis-activity.md)

---
title: Migrate data to Azure with Atempo Miria
description: Getting started guide to implement Atempo Miria infrastructure with Azure Storage. This article helps you integrate the Atempo Miria Infrastructure with Azure storage.
author: timkresler
ms.author: timkresler
ms.service: azure-storage
ms.topic: quickstart #Required; leave this attribute/value as-is.
ms.date: 05/04/2023
ms.custom: template-quickstart #Required; leave this attribute/value as-is.
---
# Atempo Quick Start Guide

This document will provide assistance in getting started with configuring Atemop Miria to migrate data to Azure Storage.

## Reference Architecture

The following diagram provides a reference architecture for on-premises to Azure deployments.

:::image type="content" source="./media/atempo-quick-start-guide/picture-1.png" alt-text="Screenshot of components required for a Miria migration, including source, destination, and Miria components such as Data Mover and Control Panel."::: 

&nbsp;

Your existing Atempo Miria deployment can easily integrate with Azure by adding and configuring a connection to Azure, either a standard connection or an ExpressRoute.

## Before you Begin

A little upfront planning helps configure your Miria software to use Azure as a data migration target.

### Get Started with Azure

Microsoft offers a framework to get you started with Azure. The [Cloud Adoption Framework (CAF)](/azure/cloud-adoption-framework/) is a detailed approach to enterprise digital transformation and a comprehensive guide to planning a production-grade cloud adoption. The CAF includes a step-by-step Azure setup guide to help you get up and running quickly and securely. You will find sample architectures, specific best practices for deploying applications, and free training resources to put you on the path to Azure expertise.

### Considerations For Migrations

Several aspects are important when considering migrations of file data to Azure. Before proceeding learn more

- [Storage Migration Overview](https://www.atempo.com/solutions/miria-large-data-and-file-migration-and-copy-2/)
- Latest supported features by Miria in the [Migration tools comparison matrix](/azure/storage/solution-integration/validated-partners/data-management/migration-tools-comparison)

Remember, you need enough network capacity to support migrations without impacting production applications. This section outlines the tools and techniques that are available to assess your network needs.

### Determine Unutilized Internet Bandwidth

It's important to know how much unutilized bandwidth (or headroom) you have available on a day-to-day basis. To help you assess whether you can meet your goals for

- Initial time for migrations
- Time required to do incremental resync before final switch-over to the target file service

Use the following methods to identify the bandwidth headroom that is free to consume

- If you're an existing Azure ExpressRoute customer, view your circuit usage in the Azure portal
- Contact your ISP and request reports to show your existing daily and monthly utilization
- There are several tools that can measure utilization by monitoring your network traffic at the router/switch level

  - SolarWinds Bandwidth Analyzer Pack
  - Paessler PRTG
  - Cisco Network Assistant
  - WhatsUp Gold

## Implementation Guidance

### Before you begin

This documentation assumes that:
- you have the [read and write permissions](/azure/role-based-access-control/built-in-roles#storage-blob-data-contributor) in the Azure Storage Container that you are using, or an appropriate [RBAC role](/azure/role-based-access-control/built-in-roles#storage-blob-data-contributor).
- you already have a Miria Server and Miria Data Mover installed and running on a VM or on a server in your environment. If this is not the case, please refer to the following links for more information regarding:
    - [Miria Server and Data Movers deployment and initial configuration](https://www.atempo.com/privatedocs/Miria_2022_Migration_Documentation.pdf)
    - [Details on platforms and OS versions supported by Miria](https://usergroup.atempo.com/wp-content/uploads/2021/08/COMPATIBILITY-GUIDE_MIRIA_2021.pdf)

&nbsp;

The following section guides you in successive steps:

1. Creating and configuring your Azure BLOB Storage
2. Creating a Miria Target Storage - Azure BLOB
3. Creating a Miria Source Storage with SMB/CIFS share
4. Creating and launching your data migration task
5. Checking on progress, logs, and reports at the project and task level 
6. Creating other tasks in your migration project

### Azure Storage configuration

This section provides a brief guide for how to add Azure BLOB to an on-premises-to-Azure Miria deployment

1. Open the Azure portal, and search for storage accounts

:::image type="content" source="./media/atempo-quick-start-guide/marketplace.png" alt-text="Screenshot of the Azure Marketplace listing for Storage Accounts.":::

&nbsp;

2. Select Create to add an account:

- Select an existing resource group or Create new
- Provide a unique name for your storage account
- Select the region
- Select Standard or Premium performance, depending on your needs
- Select the Redundancy that meets your data protection requirements

:::image type="content" source="./media/atempo-quick-start-guide/storage-creation.png" alt-text="Screenshot of the Basics panel for creating a new storage account.":::

3. Next, we recommend the default settings from the Advanced screen

:::image type="content" source="./media/atempo-quick-start-guide/advanced.png" alt-text="Screenshot of the Advanced Options panel when creating a new storage account.":::

&nbsp;

4. Keep the default networking options for now and move on to Data protection. You can select to enable soft delete, which allows you to recover accidentally deleted data within the defined retention period. Soft delete offers protection against accidental or malicious deletion

:::image type="content" source="./media/atempo-quick-start-guide/data-protection.png" alt-text="Screenshot of the Data Protection Options panel when creating a new Storage Account.":::

5. Add tags for organization if you use tagging and Create your account

6. Another step is mandatory before you can add the account to your Miria environment. Navigate to the Access keys item under Security + Networking and copy the Storage account name and one of the two access keys.
   
:::image type="content" source="./media/atempo-quick-start-guide/access-keys.png" alt-text="Screenshot of the Access Keys configuration panel in the Miria software.":::

&nbsp;

7. Under Data Storage, create a Container with a unique name

:::image type="content" source="./media/atempo-quick-start-guide/new-container.png" alt-text="Screenshot of the New Container Creation dialog box in the Miria software.":::

&nbsp;

8. Optional - Configure security best practices

### Creating a Miria Target Storage: Azure BLOB

1. In Miria Web UI, you need to declare the Azure storage and the newly created container. To do so, navigate to Infrastructure in the left pane, then select Object storage & application
:::image type="content" source="./media/atempo-quick-start-guide/miria-overview.png" alt-text="Screenshot of the Miria Overview section of the Miria software.":::


:::image type="content" source="./media/atempo-quick-start-guide/miria-overview.png" alt-text="Screenshot of the Miria Overview section of the Miria software.":::

&nbsp;

2. Select the New Storage Manager button on top right

:::image type="content" source="./media/atempo-quick-start-guide/storage-managers.png" alt-text="Screenshot of the New Storage Manager dialog box in the Miria software.":::

&nbsp;

3. In the "Type" drop-down list, select Microsoft Azure Block Blob among Cloud entries and select Next

:::image type="content" source="./media/atempo-quick-start-guide/block-blob-config.png" alt-text="Screenshot of the selection of Azure Block Blob Configuration option.":::

&nbsp;

4. Select a Storage Manager name (here SM_Azure) and replace placeholder with your Account name in the Network address field:

:::image type="content" source="./media/atempo-quick-start-guide/storage-manager-config.png" alt-text="Screenshot of the Storage Manager Configuration panel when creating a new source for migration.":::

&nbsp;

5. In the Default proxy platform drop-down list, select the desired Data Mover or Data Mover Pool (here WIN-H9K5NN91J0H) used to reach out to your Azure storage

:::image type="content" source="./media/atempo-quick-start-guide/platform-drop-down.png" alt-text="Screenshot of the Platform Drop Down selection UI in the Miria software.":::

&nbsp;

6. Select Create at the bottom

:::image type="content" source="./media/atempo-quick-start-guide/create-button.png" alt-text="Screenshot of the Create button used to confirm the configuration.":::

&nbsp;

Once the Storage Manager is successfully created, we need to create the Miria container associated to this bucket. To do so, select the Back button to display the list of Storage Managers.

7. Select the three dots located at the end of the line associated to the Storage Manager we created and select Add Container

:::image type="content" source="./media/atempo-quick-start-guide/storage-manager-add-container.png" alt-text="Screenshot of the Add a Storage Manager Container UI in the Miria software.":::

&nbsp;

8. Select a Storage Manager Container name (here SMC_Azure) and activate the toggle Available as Source to support future workflows.  Name the source platform (here SMC_Azure)
:::image type="content" source="./media/atempo-quick-start-guide/storage-manager-container-config.png" alt-text="Screenshot of the Configure Container UI inside the Miria software.":::

&nbsp;

9. Scroll down to Available as Source toggle and select "Enabled" to support future workflows using this SMC as a source. Name the source platform (here Azure).

:::image type="content" source="./media/atempo-quick-start-guide/availible-as-source.png" alt-text="Screenshot of the selection toggle to enable this container as a source.":::

&nbsp;

10. Scroll down to the Configuration section at the bottom and type Azure account name, its Access Key and Container Name

:::image type="content" source="./media/atempo-quick-start-guide/configuration-miria-migration.png" alt-text="Screenshot of the Configuration panel in the Miria software.":::

&nbsp;

Access tier “Default” matches the one chosen during the Azure storage account creation (Step 3 above).

Then select Create at the bottom. Your SMC is successfully created, select Back to get back to the home screen

:::image type="content" source="./media/atempo-quick-start-guide/storage-managers-2.png" alt-text="Screenshot of the fully configured Azure Storage Managers.":::

&nbsp;

Congratulations! Your Azure storage container and bucket are now fully declared and ready to use.

### Creating a Miria Source Storage for a Windows file server

In this example, we're moving data from an SMB/CIFS share of a Windows file server (our source storage) to Azure (our target storage).
To create the source storage in Miria:

1. Navigate to the Infrastructure item on the left pane, then select NAS

:::image type="content" source="./media/atempo-quick-start-guide/infrastructure-pane.png" alt-text="Screenshot of the Miria configuration menu with the Infrastructure menu selected.":::

&nbsp;

2. Select the New NAS button in the top right

:::image type="content" source="./media/atempo-quick-start-guide/network-attached-storage.png" alt-text="Screenshot of the Create new Network Attached Storage button.":::

&nbsp;

3. In the NAS Type drop-down list, select Other

4. In the "Protocol" radio button, select Windows (CIFS)

:::image type="content" source="./media/atempo-quick-start-guide/network-attached-storage-type.png" alt-text="Screenshot of the Network Attached Storage Type interface, with the Other type selected.":::

&nbsp;

5. Under Data Movers, select Single agent or Pool (depending on your setup) and add a Windows Data Mover

6. Select Next at the bottom right

:::image type="content" source="./media/atempo-quick-start-guide/data-movers.png" alt-text="Screenshot of the Data Movers configuration panel, with an agent selected.":::

&nbsp;

7. In the Stream option text box, add “host=” followed by FQDN (or IP address) of your NAS

8. Select Next

:::image type="content" source="./media/atempo-quick-start-guide/stream-option.png" alt-text="Screenshot of the Stream Options configuration panel, with an IP address configured for the Network Attached Storage.":::

&nbsp;

9. Select a NAS name

10. Add the credentials you want to use for Data migration accessing this share

11. Select Create

:::image type="content" source="./media/atempo-quick-start-guide/summary-of-the-network-attached-storage.png" alt-text="Screenshot of the Summary of Network Attached Storage Configuration dialog box.":::

&nbsp;

Congratulations!  Your Windows file server is now ready to be used as a source

:::image type="content" source="./media/atempo-quick-start-guide/network-attached-storage-windows-file-server.png" alt-text="Screenshot of the Windows Fileserver displayed as Ready to migrate.":::

## Start your migration

### Creating and starting your data migration task

1. Now you can create your Migration project by selecting Migration in the left pane and New Project:

:::image type="content" source="./media/atempo-quick-start-guide/migration-projects.png" alt-text="Screenshot of the Migration Projects dialog box with no projects configured.":::

&nbsp;

2. Select the "New Project" button

:::image type="content" source="./media/atempo-quick-start-guide/new-project.png" alt-text="Screenshot of the New Project dialog box.":::

&nbsp;

3. Select your source and target from the drop-down lists and select Next

:::image type="content" source="./media/atempo-quick-start-guide/source-and-destination.png" alt-text="Screenshot of the Source and Destination configuration dialog box.":::

&nbsp;

4. Select the folder containing data to migrate on the left side of the panel and select "Add". This folder appears in the selection list located in the below section of the window

:::image type="content" source="./media/atempo-quick-start-guide/objects-to-migrate.png" alt-text="Screenshot of the selection dialog box where the user selects the Objects to Migrate.":::

&nbsp;

Once your folder selection is complete, select Next

5. At this step, you may select among different advanced options if needed. Review them and select Next

:::image type="content" source="./media/atempo-quick-start-guide/options.png" alt-text="Screenshot of the advanced options for the Migration job.":::

&nbsp;

6. Select a name for your task then select Create

:::image type="content" source="./media/atempo-quick-start-guide/summary.png" alt-text="Screenshot of the migration summary dialog box where the migration job is named.":::

&nbsp;

7. You may now start your migration by clicking Start

:::image type="content" source="./media/atempo-quick-start-guide/migration-tasks.png" alt-text="Screenshot of the dialog box where the user can start the migration job":::

&nbsp;

The task runs

:::image type="content" source="./media/atempo-quick-start-guide/project-active.png" alt-text="Screenshot of dialog box where the user can monitor the migration jobs progress.":::

&nbsp;

and after a period is completed

:::image type="content" source="./media/atempo-quick-start-guide/projects-completed.png" alt-text="Screenshot of the dialog box showing the project completed.":::

:::image type="content" source="./media/atempo-quick-start-guide/tasks-completed.png" alt-text="Screenshot of the dialog box showing the tasks completed.":::

&nbsp;

You may monitor on the Azure side that your container is populated with your data

:::image type="content" source="./media/atempo-quick-start-guide/miria-target-container.png" alt-text="Screenshot of the Azure container data was moved into.":::

### Checking on migration progress, logs, and reports

In the above step, we have created two objects at once

- A migration project,
- And a task in this migration project

You might want to create a migration task per subset of data to migrate, for instance by usage, user group, department, project, etc. to have more control of the migration of each data sets

The Web interface offer multiple options to check on progress

- At the project level - to get a global view of the progress of all tasks created in the project,
- At the individual task level - to check on the progress for a specific task such as the data subset

To access the logs or more details on the tasks in this project, select on the three dots located at the end to display this menu

- By selecting Show Logs, you see the logs for all tasks in the project
- By selecting See Tasks, you see a graphical overview of the volume associated to all tasks as shown in this screenshot

:::image type="content" source="./media/atempo-quick-start-guide/migration-tasks-small.png" alt-text="Screenshot of the Migration Tasks dialog box.":::

&nbsp;

The above screenshot provides an overview of all iterations of the migration tasks in your project. We currently have only one iteration for our task. We can easily launch a new iteration of the same task to collect all the latest and changed files since the last run. Select the task in the bottom part of the panel and select Start Task. Each iteration of the task is shown on the above interface.

The bottom part of the screen is listing the tasks created in this project.

:::image type="content" source="./media/atempo-quick-start-guide/task-completed-2.png" alt-text="Screenshot of the dialog box showing the completed tasks.":::

&nbsp;

To drill down on an individual task, just apply a similar process, select the three-dot menu at the end of the task line to display the task-related submenu

:::image type="content" source="./media/atempo-quick-start-guide/show-logs-integrity-check.png" alt-text="Screenshot of the dialog box showing the logs collected.":::

&nbsp;

- Selecting Show logs shows the logs for this task only.
- Selecting Integrity check provides access to the associated report for this task.
- Selecting See Details provides a graphical volume report with details at the task level as shown in the following screenshot

:::image type="content" source="./media/atempo-quick-start-guide/task-details.png" alt-text="Screenshot of the output of the task details overview pane.":::

&nbsp;

The lower part of the screen provides more details on the job run.

:::image type="content" source="./media/atempo-quick-start-guide/runs-details.png" alt-text="Screenshot of the output of the runs details overview pane.":::

To download the report associated to this task, select the three-dot menu at the end of the line and select Download Report

### Creating other tasks in your migration project

More tasks can be added to a Migration project going back to the project level, by clicking the word project in the “bread crumb”

:::image type="content" source="./media/atempo-quick-start-guide/critical-data-breadcrumb.png" alt-text="Screenshot of the critical data breadcrumb.":::

To add a task, use the top menu with the three horizontal dots, select New Task and follow a similar process to create your task within the project

:::image type="content" source="./media/atempo-quick-start-guide/start-button-new-task.png" alt-text="Screenshot of the Create New Task dialog box.":::

&nbsp;

After the administrator adds multiple tasks to the project, the Start menu on the top provides a way to start new iterations for all the tasks in this project at once.

## Support

When you need help with your migration to Azure solution, you should open a case with both Atempo and Azure

### To Open a Case with Atempo

On the [Atempo Support Site](https://support.atempo.com/login), sign into your account using the credentials received with your Miria package and open a case

### To Open a Case with Azure

Search for Support in the Azure portal search bar. Select Help + support -> New Support Request

## Next steps

Learn more about the process and recommendations for migrating data to Azure Storage

- [Azure Storage migration overview](../data-management/azure-file-migration-program-solutions.md)



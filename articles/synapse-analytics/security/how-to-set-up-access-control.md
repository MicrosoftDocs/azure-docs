---
title: Secure your Synapse workspace (preview)
description: This article will teach you how to use roles and access control to control activities and access to data in Synapse workspace.
services: synapse-analytics 
author: matt1883 
ms.service: synapse-analytics 
ms.topic: how-to 
ms.subservice:  
ms.date: 04/15/2020 
ms.author: mahi
ms.reviewer: jrasnick
---
# Secure your Synapse workspace (preview)

This article will teach you how to use roles and access control to control activities and access to data. By following these instructions, access control in Azure Synapse Analytics is simplified. You only need to add and remove users to one of three security groups.

## Overview

To secure a Synapse workspace (preview), you'll follow a pattern of configuring the following items:

- Azure roles (such as the built-in ones like Owner, Contributor, etc.)
- Synapse roles – these roles are unique to Synapse and aren't based on Azure roles. There are three of these roles:
  - Synapse workspace admin
  - Synapse SQL admin
  - Apache Spark for Azure Synapse Analytics admin
- Access control for data in Azure Data Lake Storage Gen 2 (ADLSGEN2).
- Access control for Synapse SQL and Spark databases

## Steps to secure a Synapse workspace

This document uses standard names to simplify the instructions. Replace them with any names of your choice.

|Setting | Example value | Description |
| :------ | :-------------- | :---------- |
| **Synapse workspace** | WS1 |  The name that the Synapse workspace will have. |
| **ADLSGEN2 account** | STG1 | The ADLS account to use with your workspace. |
| **Container** | CNT1 | The container in STG1 that the workspace will use by default. |
| **Active directory tenant** | contoso | the active directory tenant name.|
||||

## STEP 1: Set up security groups

Create and populate three security groups for your workspace:

- **WS1\_WSAdmins** – for users who need complete control over the workspace
- **WS1\_SparkAdmins** – for those users who need complete control over the Spark aspects of the workspace
- **WS1\_SQLAdmins** – for users who need complete control over the SQL aspects of the workspace
- Add **WS1\_WSAdmins** to **WS1\_SQLAdmins**
- Add **WS1\_WSAdmins** to **WS1\_SparkAdmins**

## STEP 2: Prepare your Data Lake Storage Gen2 account

Identify this information about your storage:

- The ADLSGEN2 account to use for your workspace. This document calls it STG1.  STG1 is considered the "primary" storage account for your workspace.
- The container inside WS1 that your Synapse workspace will use by default. This document calls it CNT1.  This container is used for:
  - Storing the backing data files for Spark tables
  - Execution logs for Spark jobs

- Using the Azure portal, assign the security groups the following roles on CNT1

  - Assign **WS1\_WSAdmins** to the **Storage Blob Data Contributor** role
  - Assign **WS1\_SparkAdmins** to the **Storage Blob Data Contributor** role
  - Assign **WS1\_SQLAdmins** to the **Storage Blob Data Contributor** role

## STEP 3: Create and configure your Synapse Workspace

In the Azure portal, create a Synapse workspace:

- Name the workspace WS1
- Choose STG1 for the Storage account
- Choose CNT1 for the container that is being used as the "filesystem".
- Open WS1 in Synapse Studio
- Select **Manage** > **Access Control** assign the security groups to the following Synapse roles.
  - Assign **WS1\_WSAdmins** to Synapse Workspace admins
  - Assign **WS1\_SparkAdmins** to Synapse Spark admins
  - Assign **WS1\_SQLAdmins** to Synapse SQL admins

## STEP 4: Configuring Data Lake Storage Gen2 for use by Synapse workspace

The Synapse workspace needs access to STG1 and CNT1 so it can run pipelines and perform system tasks.

- Open the Azure portal
- Locate STG1
- Navigate to CNT1
- Ensure that the MSI (Managed Service Identity) for WS1 is assigned to the **Storage Blob Data Contributor** role on CNT1
  - If you don't see it assigned, assign it.
  - The MSI has the same name as the workspace. In this case, it would be &quot;WS1&quot;.

## STEP 5: Configure admin access for SQL pools

- Open the Azure portal
- Navigate to WS1
- Under **Settings**, click **SQL Active Directory admin**
- Click **Set admin** and choose WS1\_SQLAdmins

## STEP 6: Maintaining access control

The configuration is finished.

Now, to manage access for users, you can add and remove users to the three security groups.

Although you can manually assign users to Synapse roles, if you do, it won't configure things consistently. Instead, only add or remove users to the security groups.

## STEP 7: Verify access for users in the roles

Users in each role need to complete the following steps:

|   | Step | Workspace admins | Spark admins | SQL admins |
| --- | --- | --- | --- | --- |
| 1 | Upload a parquet file into CNT1 | YES | YES | YES |
| 2 | Read the parquet file using SQL on-demand | YES | NO | YES |
| 3 | Create a Spark pool | YES [1] | YES [1] | NO  |
| 4 | Reads the parquet file with a Notebook | YES | YES | NO |
| 5 | Create a pipeline from the Notebook and Trigger the pipeline to run now | YES | NO | NO |
| 6 | Create a SQL pool and run a SQL script such as &quot;SELECT 1&quot; | YES [1] | NO | YES[1] |

> [!NOTE]
> [1] To create SQL or Spark pools the user must have at least Contributor role on the Synapse workspace.
> [!TIP]
>
> - Some steps will deliberately not be allowed depending on the role.
> - Keep in mind that some tasks may fail if the security was not fully configured. These tasks are noted in the table.

## STEP 8: Network Security

To configure the workspace firewall, virtual network, and [Private Link](../../azure-sql/database/private-endpoint-overview.md).

## STEP 9: Completion

Your workspace is now fully configured and secured.

## How roles interact with Synapse Studio

Synapse Studio will behave differently based on user roles. Some items may be hidden or disabled if a user isn't assigned to roles that give the appropriate access. The following table summarizes the effect on Synapse Studio.

| Task | Workspace Admins | Spark admins | SQL admins |
| --- | --- | --- | --- |
| Open Synapse Studio | YES | YES | YES |
| View Home hub | YES | YES | YES |
| View Data Hub | YES | YES | YES |
| Data Hub / See linked ADLS Gen2 accounts and containers | YES [1] | YES[1] | YES[1] |
| Data Hub / See Databases | YES | YES | YES |
| Data Hub / See objects in databases | YES | YES | YES |
| Data Hub / Access data in SQL pool databases | YES   | NO   | YES   |
| Data Hub / Access data in SQL on-demand databases | YES [2]  | NO  | YES [2]  |
| Data Hub / Access data in Spark databases | YES [2] | YES [2] | YES [2] |
| Use the Develop hub | YES | YES | YES |
| Develop Hub / author SQL Scripts | YES | NO | YES |
| Develop Hub / author Spark Job Definitions | YES | YES | NO |
| Develop Hub / author Notebooks | YES | YES | NO |
| Develop Hub / author Dataflows | YES | NO | NO |
| Use the Orchestrate hub | YES | YES | YES |
| Orchestrate hub / use Pipelines | YES | NO | NO |
| Use the Manage Hub | YES | YES | YES |
| Manage Hub / SQL pools | YES | NO | YES |
| Manage Hub / Spark pools | YES | YES | NO |
| Manage Hub / Triggers | YES | NO | NO |
| Manage Hub / Linked services | YES | YES | YES |
| Manage Hub / Access Control (assign users to Synapse workspace roles) | YES | NO | NO |
| Manage Hub / Integration runtimes | YES | YES | YES |
| Use the Monitor Hub | YES | YES | YES |
| Monitor Hub / Orchestration / Pipeline runs  | YES | NO | NO |
| Monitor Hub / Orchestration / Trigger runs  | YES | NO | NO |
| Monitor Hub / Orchestration / Integration runtimes  | YES | YES | YES |
| Monitor Hub / Activities / Spark applications | YES | YES | NO  |
| Monitor Hub / Activities / SQL requests | YES | NO | YES |
| Monitor Hub / Activities / Spark pools | YES | YES | NO  |
| Monitor Hub / Triggers | YES | NO | NO |
| Manage Hub / Linked services | YES | YES | YES |
| Manage Hub / Access Control (assign users to Synapse workspace roles) | YES | NO | NO |
| Manage Hub / Integration runtimes | YES | YES | YES |


> [!NOTE]
> [1] Access to data in containers depends on the access control in ADLS Gen2. </br>
> [2] SQL OD tables and Spark tables store their data in ADLS Gen2 and access requires the appropriate permissions on ADLS Gen2.

## Next steps

Create a [Synapse Workspace](../quickstart-create-workspace.md)

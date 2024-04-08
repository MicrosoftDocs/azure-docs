---
title: Enable Defender for open-source relational databases on AWS
description: Learn how to enable Microsoft Defender for open-source relational databases to detect potential security threats on AWS environments.
ms.date: 04/07/2024
ms.topic: how-to
ms.author: dacurwin
author: dcurwin
#customer intent: As a reader, I want to learn how to configure Microsoft Defender for open-source relational databases to enhance the security of my AWS databases.
---

# Enable Defender for open-source relational databases on AWS

Microsoft Defender for Cloud detects anomalous activities indicating unusual and potentially harmful attempts to access or exploit databases for the following services:

- [Aurora PostgreSQL](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/Aurora.AuroraPostgreSQL.html)
- [Aurora MySQL](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/Aurora.AuroraMySQL.html)

To get alerts from the Microsoft Defender plan, you need to follow the instructions on this page to enable Defender for open-source relational databases AWS.

Learn more about this Microsoft Defender plan in [Overview of Microsoft Defender for open-source relational databases](defender-for-databases-introduction.md).

## Prerequisites

- You need a Microsoft Azure subscription. If you don't have an Azure subscription, you can [sign up for a free subscription](https://azure.microsoft.com/pricing/free-trial/).

- You must [enable Microsoft Defender for Cloud](get-started.md#enable-defender-for-cloud-on-your-azure-subscription) on your Azure subscription.

- At least one connected [AWS account](quickstart-onboard-aws.md) with the required access and permissions.

- **Region availability**: All regions

When you enable Defender for open-source relational databases on your RDS instances, Defender for Cloud automatically enables auditing by using audit logs in order to be able to consume and analyze access patterns to your database.

Each relational database management system or service type has its own requirements. The following table describes the requirements for each type.

| PostgreSQL and Aurora PostgreSQL | Option | Aurora MySQL instance and cluster parameter group | Option |
|--|--|
| log_connections | should be 1 | server_audit_logging | should be 1 | 
| log_disconnections | should be 1 |  server_audit_events | If it exists, expand the value to include CONNECT, QUERY, <br> - If it doesn't exist, add it with the value CONNECT, QUERY. |
| - | - | server_audit_excl_users | If it exists, expand it to include rdsadmin. |
| - | - | server_audit_incl_users | - If it exists with a value and rdsadmin as part of the include, then it won't be present in SERVER_AUDIT_EXCL_USER, and the value of incl is empty. |

An option group is required for MySQL and MariaDB with the following options ( If the option doesn’t exist, add the option. If the option exists expand the values in the option):

| MARIADB_AUDIT_PLUGIN | Option |
|--|--|
| SERVER_AUDIT_EVENTS | - If it exists, expand the value to include CONNECT <br> - If it doesn't exist, add it with value CONNECT. |
| SERVER_AUDIT_EXCL_USER | If it exists, expand it to include rdsadmin. |
| SERVER_AUDIT_INCL_USERS | If it exists with a value and rdsadmin is part of the include, then it won't be present in SERVER_AUDIT_EXCL_USER, and the value of incl is empty. |

> [!NOTE]
>
> If a parameter group already exists it will be updated accordingly.
>
> If you are using the default parameter group, a new parameter group will be created that includes the required parameter changes with the prefix `defenderfordatabases*`.
>
> If a new parameter group was created or if static parameters were updated they won't take effect until the instance is restarted.
>
> MARIADB_AUDIT_PLUGIN is supported in MariaDB 10.2 and higher, MySQL 8.0.25 and higher 8.0 versions and All MySQL 5.7 versions.
>
> Changes to [MARIADB_AUDIT_PLUGIN are added to the next maintenance window](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Appendix.MySQL.Options.AuditPlugin.html#Appendix.MySQL.Options.AuditPlugin.Add).

**Required permissions for DefenderForCloud-DataThreatProtectionDB Role**:

| Permission added | Description |
|--|--|
| rds:AddTagsToResource | to add tag on option group and parameter group created |
| rds:DescribeDBClusterParameters | describe the parameters inside the cluster group |
| rds:CreateDBParameterGroup | create database parameter group |
| rds:ModifyOptionGroup | modify option inside the option group |
| rds:DescribeDBLogFiles | describe the log file |
| rds:DescribeDBParameterGroups | describe the database parameter group |
| rds:CreateOptionGroup | create option group |
| rds:ModifyDBParameterGroup | modify parameter inside the databases parameter group |
| rds:DownloadDBLogFilePortion | download log file |
| rds:DescribeDBInstances | describe the database |
| rds:ModifyDBClusterParameterGroup | modify cluster parameter inside the cluster parameter group |
| rds:ModifyDBInstance | modify databases to assign parameter group or option group if needed |
| rds:ModifyDBCluster | modify cluster to assign cluster parameter group if needed |
| rds:DescribeDBParameters | describe the parameters inside the database group |
| rds:CreateDBClusterParameterGroup | create cluster parameter group |
| rds:DescribeDBClusters | describe the cluster |
| rds:DescribeDBClusterParameterGroups | describe the cluster parameter group |
| rds:DescribeOptionGroups | describe the option group |

## Enable Defender for open-source relational databases on your AWS account

1. Sign in to [the Azure portal](https://portal.azure.com)

1. Search for and select **Microsoft Defender for Cloud**.

1. Select **Environment settings**.

1. Select the relevant AWS account.

1. Locate the Databases plan and select **Settings**.

1. Toggle open-source relation databases to **On**

1. Select **Configure access**.

1. In the deployment method section, select **Download**.

1. Follow the update stack in AWS instructions.

1. Check the box confirming the CloudFormation template has been updated on AWS environment (Stack).

1. Select **Review and generate**.

1. Review the presented information and select **Update**.



However, this is achiever differently on each relational database management system or service type.

For PostgreSQL, Aurora PostgreSQL and Aurora MySQL the following Cluster Parameter/Parameter Group settings are required:

## Next step

> [!div class="nextstepaction"]
> [Respond to Defender OSS alerts](defender-for-databases-usage.md)

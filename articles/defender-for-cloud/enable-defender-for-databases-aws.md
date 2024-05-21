---
title: Enable Defender for open-source relational databases on AWS
description: Learn how to enable Microsoft Defender for open-source relational databases to detect potential security threats on AWS environments.
ms.date: 05/01/2024
ms.topic: how-to
ms.author: dacurwin
author: dcurwin
#customer intent: As a reader, I want to learn how to configure Microsoft Defender for open-source relational databases to enhance the security of my AWS databases.
---

# Enable Defender for open-source relational databases on AWS (Preview)

Microsoft Defender for Cloud detects anomalous activities in your AWS environment indicating unusual and potentially harmful attempts to access or exploit databases for the following RDS instance types:

- Aurora PostgreSQL
- Aurora MySQL
- PostgreSQL
- MySQL
- MariaDB

To get alerts from the Microsoft Defender plan, you need to follow the instructions on this page to enable Defender for open-source relational databases on AWS.

The Defender for open-source relational databases on AWS plan also includes the ability to discover sensitive data within your account and enrich the Defender for Cloud experience with the findings. This is feature is also included with Defender CSPM.

Learn more about this Microsoft Defender plan in [Overview of Microsoft Defender for open-source relational databases](defender-for-databases-introduction.md).

## Prerequisites

- You need a Microsoft Azure subscription. If you don't have an Azure subscription, you can [sign up for a free subscription](https://azure.microsoft.com/pricing/free-trial/).

- You must [enable Microsoft Defender for Cloud](get-started.md#enable-defender-for-cloud-on-your-azure-subscription) on your Azure subscription.

- At least one connected [AWS account](quickstart-onboard-aws.md) with the required access and permissions.

- Region availability: All public AWS regions (excluding Tel Aviv, Milan, Jakarta, Spain and Bahrain).

## Enable Defender for open-source relational databases

1. Sign in to [the Azure portal](https://portal.azure.com)

1. Search for and select **Microsoft Defender for Cloud**.

1. Select **Environment settings**.

1. Select the relevant AWS account.

1. Locate the Databases plan and select **Settings**.

    :::image type="content" source="media/enable-defender-for-databases-aws/databases-settings.png" alt-text="Screenshot of the AWS environment settings page that shows where the settings button is located." lightbox="media/enable-defender-for-databases-aws/databases-settings.png":::

1. Toggle open-source relation databases to **On**.  

    :::image type="content" source="media/enable-defender-for-databases-aws/toggle-open-source-on.png" alt-text="Screenshot that shows how to toggle the open-source relational databases to on." lightbox="media/enable-defender-for-databases-aws/toggle-open-source-on.png":::

    > [!NOTE]
    > Toggling the open-source relational databases to on will also enable sensitive data discovery to on, which is a shared feature with Defender CSPM's sensitive data discovery for relation database service (RDS).
    >
    > :::image type="content" source="media/enable-defender-for-databases-aws/cspm-shared.png" alt-text="Screenshot that shows the settings page for Defender CSPM and the sensitive data turned on with the protected resources." lightbox="media/enable-defender-for-databases-aws/cspm-shared.png":::
    >
    > Learn more about [sensitive data discovery in AWS RDS instances](concept-data-security-posture-prepare.md#discovering-aws-rds-instances).

1. Select **Configure access**.

1. In the deployment method section, select **Download**.

1. Follow the update stack in AWS instructions. This process will create or update the CloudFormation template with the [required permissions](#required-permissions-for-defenderforcloud-datathreatprotectiondb-role).

1. Check the box confirming the CloudFormation template has been updated on AWS environment (Stack).

1. Select **Review and generate**.

1. Review the presented information and select **Update**.

Defender for Cloud will automatically [make changes to your parameter and option group settings](#affected-parameter-and-option-group-settings).

### Required permissions for DefenderForCloud-DataThreatProtectionDB Role

The following table shows a list of the required permissions that were given to the role that was created or updated, when you downloaded the CloudFormation template and updated the AWS Stack.

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

## Affected parameter and option group settings

When you enable Defender for open-source relational databases on your RDS instances, Defender for Cloud automatically enables auditing by using audit logs in order to be able to consume and analyze access patterns to your database.

Each relational database management system or service type has its own configurations. The following table describes the configurations affected by Defender for Cloud (you are not required to manually set these configurations, this is provided as a reference).

| Type | Parameter | Value |
|--|--|--|
| PostgreSQL and Aurora PostgreSQL | log_connections | 1|
| PostgreSQL and Aurora PostgreSQL | log_disconnections | 1 |
| Aurora MySQL cluster parameter group | server_audit_logging | 1 |
| Aurora MySQL cluster parameter group | server_audit_events | - If it exists, expand the value to include CONNECT, QUERY, <br> - If it doesn't exist, add it with the value CONNECT, QUERY. |
| Aurora MySQL cluster parameter group | server_audit_excl_users | If it exists, expand it to include rdsadmin. |
| Aurora MySQL cluster parameter group | server_audit_incl_users | - If it exists with a value and rdsadmin as part of the include, then it won't be present in SERVER_AUDIT_EXCL_USER, and the value of include is empty. |

An option group is required for MySQL and MariaDB with the following options for the MARIADB_AUDIT_PLUGIN (If the option doesn’t exist, add the option. If the option exists expand the values in the option):

| Option name | Value |
|--|--|
| SERVER_AUDIT_EVENTS | If it exists, expand the value to include CONNECT <br> If it doesn't exist, add it with value CONNECT. |
| SERVER_AUDIT_EXCL_USER | If it exists, expand it to include rdsadmin. |
| SERVER_AUDIT_INCL_USERS | If it exists with a value and rdsadmin is part of the include, then it won't be present in SERVER_AUDIT_EXCL_USER, and the value of include is empty. |

> [!IMPORTANT]
> You might need to reboot your instances to apply the changes.
>
> If you are using the default parameter group, a new parameter group will be created that includes the required parameter changes with the prefix `defenderfordatabases*`.
>
> If a new parameter group was created or if static parameters were updated, they won't take effect until the instance is rebooted.

> [!NOTE]
>
> - If a parameter group already exists it will be updated accordingly.
>
> - MARIADB_AUDIT_PLUGIN is supported in MariaDB 10.2 and higher, MySQL 8.0.25 and higher 8.0 versions and All MySQL 5.7 versions.
>
> - Changes to [MARIADB_AUDIT_PLUGIN for MySQL instances are added to the next maintenance window](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Appendix.MySQL.Options.AuditPlugin.html#Appendix.MySQL.Options.AuditPlugin.Add).

## Related content

- [What's supported in Sensitive Data Discovery](concept-data-security-posture-prepare.md#whats-supported).
- [Discovering sensitive data on AWS RDS instances](concept-data-security-posture-prepare.md#discovering-aws-rds-instances).

## Next step

> [!div class="nextstepaction"]
> [Respond to Defender OSS alerts](defender-for-databases-usage.md)

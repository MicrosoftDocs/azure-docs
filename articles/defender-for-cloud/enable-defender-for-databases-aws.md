---
title: Enable Defender for open-source relational databases AWS
description: Learn how to enable Microsoft Defender for open-source relational databases to detect potential security threats on AWS environments.
ms.date: 04/07/2024
ms.topic: how-to
ms.author: dacurwin
author: dcurwin
#customer intent: As a reader, I want to learn how to configure Microsoft Defender for open-source relational databases to enhance the security of my AWS databases.
---

# Enable Defender for open-source relational databases AWS

Microsoft Defender for Cloud detects anomalous activities indicating unusual and potentially harmful attempts to access or exploit databases for the following services:

- [Azure Database for PostgreSQL](../postgresql/index.yml)
- [Azure Database for MySQL](../mysql/index.yml)
- [Azure Database for MariaDB](../mariadb/index.yml)

To get alerts from the Microsoft Defender plan you'll first need to follow the instructions on this page to enable Defender for open-source relational databases AWS.

Learn more about this Microsoft Defender plan in [Overview of Microsoft Defender for open-source relational databases](defender-for-databases-introduction.md).

## Prerequisites

- You need a Microsoft Azure subscription. If you don't have an Azure subscription, you can [sign up for a free subscription](https://azure.microsoft.com/pricing/free-trial/).

- You must [enable Microsoft Defender for Cloud](get-started.md#enable-defender-for-cloud-on-your-azure-subscription) on your Azure subscription.

- At least one connected [AWS account](quickstart-onboard-aws.md)

- **Region availability**: All regions

## Enable Defender for open-source relational databases on your AWS account

1. Sign in to [the Azure portal](https://portal.azure.com)

1. Search for and select **Microsoft Defender for Cloud**.

1. Select **Environment settings**.

1. Toggle RDS to **On**.

1. Set the permission type.

1. In the deployment sections, select **Download**.

1. Follow the update stack in AWS instructions.

1. Check the box confirming the CloudFormation template has been updated on AWS environment (Stack).

1. Select **Review and generate**.

1. Review and confirm that the following permissions ad added to enable threat protection:

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

1. Select **Update**.

## Next step

> [!div class="nextstepaction"]
> [Respond to Defender OSS alerts](defender-for-databases-usage.md)

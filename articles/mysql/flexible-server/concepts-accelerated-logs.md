---
title: Accelerated logs feature
description: This article describes the accelerated logs feature in Azure Database for MySQL - Flexible Server and its benefits for high-performance workloads.
author: code-sidd
ms.author: sisawant
ms.reviewer: maghan
ms.date: 05/21/2024
ms.service: mysql
ms.subservice: flexible-server
ms.topic: concept-article
ms.custom:
    - references_regions
    - ignite-2023
#customer intent: As a reader, I want to understand the concept of accelerated logs in Azure Database for MySQL - Flexible Server.
---

# Accelerated logs feature in Azure Database for MySQL - Flexible Server

[!INCLUDE [applies-to-mysql-flexible-server](../includes/applies-to-mysql-flexible-server.md)]

This article outlines the accelerated logs feature and guides you through enabling or disabling this feature for the Azure Database for MySQL service based on the Business Critical service tier.

> [!IMPORTANT]  
> The accelerated logs feature is currently in and subject to [limitations](#limitations) and ongoing development. This feature is only available for servers based on the Business -Critical service tier. We recommend using it in non-production environments, such as development, testing, or quality assurance, to evaluate its performance and suitability for your specific use cases.

## Introduction

The accelerated logs feature is designed to significantly boost performance for users of the Business Critical service tier in Azure Database for MySQL flexible server. It substantially enhances performance by optimizing transactional log-related operations. Enabling this feature allows a server to automatically store transactional logs on faster storage to enhance server throughput without incurring any extra cost.

Database servers with mission-critical workloads demand robust performance, requiring high throughput, and substantial IOPS. However, these databases can also be sensitive to latency fluctuations in server transaction commit times. The accelerated logs feature is designed to address these challenges by optimizing the placement of transactional logs on high-performance storage. Separating transaction log operations from database queries and data updates results in significant improvement in database transaction commit latency times.

### Key benefits

- **Enhanced throughput:** Experience up to 2x increased query throughput in high concurrency scenarios, resulting in faster query execution. This improvement also comes with reduced latency, reducing latency by up to 50%, for enhanced performance.
- **Cost efficiency**: Accelerated logs provide enhanced performance at no extra expense, offering a cost-effective solution for mission-critical workloads.
- **Enhanced scalability:** Accelerated logs can accommodate growing workloads, making them ideal for applications that need to scale easily while maintaining high performance. Applications and services on the Business Critical service tier benefit from more responsive interactions and reduced query wait times.

## Regions

The accelerated logs feature is available in the following regions.

- Australia East
- Canada Central
- Central India
- China North 3
- East Asia
- East US
- East US 2
- France Central
- Japan East
- Korea Central
- North Europe
- Norway East
- Poland Central
- South Africa North
- South Central US
- Sweden Central
- Switzerland North
- UAE North
- UK South
- US Gov Virginia
- West Europe
- West US 2
- West US 3

## Enable accelerated logs feature

The enable accelerated logs feature is available during the phase. You can enable this feature during server creation or on an existing server. The following sections provide details on how to enable the accelerated logs feature.

### Enable accelerated logs during server creation

This section provides details specifically for enabling the accelerated logs feature. You can follow these steps to enable Accelerated logs while creating your flexible server.

> [!IMPORTANT]  
> The accelerated logs feature is only available for servers based on the Business Critical service tier. Disabling the feature when scaling down to any other service tier is recommended.

1. In the [Azure portal](https://portal.azure.com/), choose flexible Server and Select **Create**. For details on how to fill details such as **Subscription**, **Resource group**, **Server name**, **Region**, and other fields, see [how-to documentation](quickstart-create-server-portal.md) for the server creation.

1. Select the **Configure server** option to change the default compute and storage.

1. The checkbox for Accelerated logs under the Storage option is visible only when the server from the Business Critical compute tier is selected.

    :::image type="content" source="media/concepts-accelerated-logs/accelerated-logs-mysql-portal-create.png" alt-text="Screenshot shows accelerated logs during server create." lightbox="media/concepts-accelerated-logs/accelerated-logs-mysql-portal-create.png":::

1. Enable the checkbox for **Accelerated logs** to enable the feature. If the high availability option is checked, the accelerated logs feature isn't available to choose. To learn more, visit [limitations](#limitations).

1. Select the **Compute size** from the dropdown list. Select **Save** and deploy your Azure Database for MySQL flexible server instance following instructions from [how-to create a server](quickstart-create-server-portal.md).

### Enable accelerated logs on your existing server

During the Public phase, this section details enabling accelerated logs. You can follow these steps to enable accelerated logs on your Azure Database for MySQL flexible server instance.

> [!NOTE]  
> Your server will restart during the deployment process, so ensure you either pause your workload or schedule it during a time that aligns with your application maintenance or off-hours.

1. Navigate to the [Azure portal](https://portal.azure.com/).

1. Under the Settings sections, navigate to the **Compute + Storage** page. You can enable **Accelerated Logs** by selecting the checkbox under the **Storage** section.

    :::image type="content" source="media/concepts-accelerated-logs/accelerated-logs-mysql-portal-enable.png" alt-text="Screenshot shows accelerated logs enable after server create." lightbox="media/concepts-accelerated-logs/accelerated-logs-mysql-portal-enable.png":::

1. Select **Save** and wait for the deployment process to be completed. The feature is ready to be used once you receive a successful deployment message.

## Disable the accelerated logs feature

During the public phase, disabling the accelerated logs feature is a straightforward process:

> [!NOTE]  
> Your server will restart during the deployment process, so ensure you either pause your workload or schedule it during a time that aligns with your application maintenance or off-hours.

1. Navigate to the [Azure portal](https://portal.azure.com/).

1. Under the Settings sections, navigate to the **Compute + Storage** page. You find the "Accelerated Logs" checkbox under the Storage section. Uncheck this box to disable the feature.

    :::image type="content" source="media/concepts-accelerated-logs/accelerated-logs-mysql-portal-disable.png" alt-text="Screenshot shows accelerated logs disable after server create." lightbox="media/concepts-accelerated-logs/accelerated-logs-mysql-portal-disable.png":::

1. Select **Save** and wait for the deployment process to be completed. After you receive a successful deployment message, the feature is disabled.

## Limitations

The accelerated logs feature in Azure Database for MySQL - Flexible Server has the following limitations:

- During the phase, you can't enable the accelerated logs feature on servers that have the following features enabled:
    - [High availability concepts in Azure Database for MySQL - Flexible Server](concepts-high-availability.md) (HA) servers.
    - Created primary servers with [Read replicas in Azure Database for MySQL - Flexible Server](concepts-read-replicas.md) servers.
    - Servers enabled with [Data encryption with customer managed keys for Azure Database for MySQL - Flexible Server](concepts-customer-managed-key.md) (CMK).

- The accelerated logs feature is currently available only in specific [regions](#regions).

- After the accelerated logs feature is activated, any previously configured value for the ["binlog_expire_seconds"](https://dev.mysql.com/doc/refman/8.0/en/replication-options-binary-log.html#sysvar_binlog_expire_logs_seconds) server parameter will be disregarded and not considered.

- The accelerated logs feature is subject to ongoing development and might have other limitations or changes in future releases.

- During the phase, you can't enable the accelerated logs feature on servers with the following features.
    - [High availability concepts in Azure Database for MySQL - Flexible Server](concepts-high-availability.md) (HA) servers.
    - Created primary servers with [Read replicas in Azure Database for MySQL - Flexible Server](concepts-read-replicas.md) servers.
    - Servers enabled with [Data encryption with customer managed keys for Azure Database for MySQL - Flexible Server](concepts-customer-managed-key.md) (CMK).

- Accelerated logs feature is currently available only in specific [regions](#regions).
- After the accelerated logs feature is activated, any previously configured value for the ["binlog_expire_seconds"](https://dev.mysql.com/doc/refman/8.0/en/replication-options-binary-log.html#sysvar_binlog_expire_logs_seconds) server parameter will be disregarded and not considered.

## Related content

- [Create an Azure Database for MySQL flexible server by using the Azure portal](quickstart-create-server-portal.md)
- [Limitations in Azure Database for MySQL](concepts-limitations.md)

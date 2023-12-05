---
title: Troubleshooting Guides for Azure Database for PostgreSQL - Flexible Server
description: Troubleshooting guides for Azure Database for PostgreSQL - Flexible Server.
ms.service: postgresql
ms.subservice: flexible-server
ms.topic: how-to
ms.author: alkuchar
author: AwdotiaRomanowna
ms.date: 03/21/2023
---

# Troubleshooting guides for Azure Database for PostgreSQL - Flexible Server

[!INCLUDE [applies-to-postgresql-flexible-server](../includes/applies-to-postgresql-flexible-server.md)]

The Troubleshooting Guides for Azure Database for PostgreSQL - Flexible Server are designed to help you quickly identify and resolve common challenges you may encounter while using Azure Database for PostgreSQL. Integrated directly into the Azure portal, the Troubleshooting Guides provide actionable insights, recommendations, and data visualizations to assist you in diagnosing and addressing issues related to common performance problems. With these guides at your disposal, you'll be better equipped to optimize your PostgreSQL experience on Azure and ensure a smoother, more efficient database operation.

## Overview

The troubleshooting guides available in Azure Database for PostgreSQL - Flexible Server provide you with the necessary tools to analyze and troubleshoot prevalent performance issues, 
including:
* High CPU Usage, 
* High Memory Usage, 
* High IOPS Usage, 
* High Temporary Files, 
* Autovacuum Monitoring,
* Autovacuum Blockers. 

:::image type="content" source="./media/concepts-troubleshooting-guides/overview-troubleshooting-guides.jpg" alt-text="Screenshot of multiple Troubleshooting Guides combined." lightbox="./media/concepts-troubleshooting-guides/overview-troubleshooting-guides.jpg":::

Each guide is packed with multiple charts, guidelines, recommendations tailored to the specific problem you may encounter, which can help expedite the troubleshooting process.
The troubleshooting guides are directly integrated into the Azure portal and your Azure Database for PostgreSQL - Flexible Server, making them convenient and easy to use. 

The troubleshooting guides consist of the following components:

- **High CPU Usage**

  * CPU Utilization
  * Workload Details
  * Transaction Trends and Counts
  * Long Running Transactions
  * Top CPU Consuming queries
  * Total User Only Connections

- **High Memory Usage**

  * Memory Utilization
  * Workload Details
  * Long Running Sessions
  * Top Queries by Data Usage
  * Total User only Connections
  * Guidelines for configuring parameters

- **High IOPS Usage**

  * IOPS Usage
  * Workload Details
  * Session Details
  * Top Queries by IOPS
  * IO Wait Events
  * Checkpoint Details
  * Storage Usage

- **High Temporary Files**

  * Storage Utilization
  * Temporary Files Generated
  * Workload Details
  * Top Queries by Temporary Files

- **Autovacuum Monitoring**

  * Bloat Ratio
  * Tuple Counts
  * Tables Vacuumed & Analyzed Execution Counts
  * Autovacuum Workers Execution Counts

- **Autovacuum Blockers**

  * Emergency AV and Wraparound
  * Autovacuum Blockers


Before using any troubleshooting guide, it is essential to ensure that all prerequisites are in place. For a detailed list of prerequisites, please refer to the [Use Troubleshooting Guides](how-to-troubleshooting-guides.md) article.

### Limitations

* Troubleshooting Guides are not available for [read replicas](concepts-read-replicas.md).
* Please be aware that enabling Query Store on the Burstable pricing tier can lead to a negative impact on performance. As a result, it is generally not recommended to use Query Store with this particular pricing tier.


## Next steps

* Learn more about [How to use Troubleshooting Guides](how-to-troubleshooting-guides.md).
* Learn more about [Troubleshoot high CPU utilization](how-to-high-cpu-utilization.md).
* Learn more about [High memory utilization](how-to-high-memory-utilization.md).
* Learn more about [Troubleshoot high IOPS utilization](how-to-high-io-utilization.md).
* Learn more about [Autovacuum Tuning](how-to-autovacuum-tuning.md).

[//]: # (* Learn how to [create and manage read replicas in the Azure CLI and REST API]&#40;how-to-read-replicas-cli.md&#41;.)

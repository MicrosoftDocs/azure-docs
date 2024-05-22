---
title: Monitoring - Affirmed MCC Data Product - Azure Operator Insights
description: This article gives an overview of the Monitoring - Affirmed MCC Data Product provided by Azure Operator Insights.
author: rcdun
ms.author: rdunstan
ms.reviewer: rathishr
ms.service: operator-insights
ms.topic: concept-article
ms.date: 12/06/2023

#CustomerIntent: As an MCC operator, I want to understand the capabilities of the Monitoring - Affirmed MCC Data Product so that I can use it to provide insights to my network.
---

# Monitoring - Affirmed MCC Data Product overview

The Monitoring - Affirmed MCC Data Product supports data analysis and insight for operators of the Affirmed Networks Mobile Content Cloud (MCC). It ingests performance management data (performance statistics) from MCC network elements. It then digests and enriches this data to provide visualizations for the operator and to provide access to the underlying enriched data for operator data scientists.

## Background

The Affirmed Networks Mobile Content Cloud (MCC) is a virtualized Evolved Packet Core (vEPC) that can provide the following functionality.

- Serving Gateway (SGW) routes and forwards user data packets between the RAN and the core network.
- Packet Data Network Gateway (PGW) provides interconnect between the core network and external IP networks.
- Gi-LAN Gateway (GIGW) provides subscriber-aware or subscriber-unaware value-added services (VAS) without enabling MCC gateway services, allowing operators to take advantage of VAS while still using their incumbent gateway.
- Gateway GPRS support node (GGSN) provides interworking between the GPRS network and external packet switched networks.
- Serving GPRS support node and MME (SGSN/MME) is responsible for the delivery of data packets to and from the mobile stations within its geographical service area.
- Control and User Plane Separation (CUPS), an LTE enhancement that separates control and user plane function to allow independent scaling of functions.

The Monitoring - Affirmed MCC Data Product supports all of the MCC variants described.

## Data types

The following data type is provided as part of the Monitoring - Affirmed MCC Data Product.

- `pmstats` contains performance management data reported by the MCC management node, giving insight into the performance characteristics of the MCC network elements.

## Setup

To use the Monitoring - Affirmed MCC Data Product:

1. Deploy the Data Product by following [Create an Azure Operator Insights Data Product](data-product-create.md).
1. Configure your network to produce performance management data, as described in [Required network configuration](#required-network-configuration).
1. Set up ingestion (data upload) from your network. For example, you could use the [Azure Operator Insights ingestion agent](ingestion-agent-overview.md) or [connect Azure Data Factory](ingestion-with-data-factory.md) to your Data Product.
    - Use the information in [Required ingestion configuration](#required-ingestion-configuration) when you're setting up ingestion.
    - If you're using the Azure Operator Insights ingestion agent, also meet the requirements in [Requirements for the Azure Operator Insights ingestion agent](#requirements-for-the-azure-operator-insights-ingestion-agent).

### Required network configuration

Configure the EMS server to export performance management data to a remote server. If you're using the Azure Operator Insights ingestion agent, the remote server must be an [SFTP server](set-up-ingestion-agent.md#prepare-the-sftp-server). If you're providing your own ingestion agent, the remote server needs to be accessible by your ingestion agent.
   
1. Obtain the IP address, user, and password of the remote server.
1. Configure the transfer of EMS statistics to a remote server by following [Copying Performance Management Statistics Files to Destination Server](https://manuals.metaswitch.com/MCC/13.1/Acuitas_Users_RevB/Content/Appendix%20Interfacing%20with%20Northbound%20Interfaces/Exported_Performance_Management_Data.htm#northbound_2817469247_308739) in the _Acuitas User's Guide_.

> [!IMPORTANT]
> Increase the frequency of the cron job by reducing the `timeInterval` argument from `15` (default) to `5` minutes.

### Required ingestion configuration

Use the information in this section to configure your ingestion method. Refer to the documentation for your chosen method to determine how to supply these values.

| Data type | Required container name | Requirements for data |
|---------|---------|---------|
| `pmstats` | `pmstats` | Performance data from MCC nodes. File names must start with the dataset name. For example, `WORKFLOWPERFSTATSSLOT` data must be ingested in files whose names start with `WORKFLOWPERFSTATSSLOT`. |

If you're using the Azure Operator Insights ingestion agent:
- Configure the ingestion agent to use SFTP pull from the SFTP server.
- We recommend the following configuration settings in addition to the (required) settings in the previous table.

|Information | Configuration setting for Azure Operator Ingestion agent  | Recommended value  |
| --------- | --------- | --------- |
| [Settling time](ingestion-agent-overview.md#processing-files) | `source.sftp_pull.filtering.settling_time` | `60s` (upload files that haven't been modified in the last 60 seconds) |
| Schedule for checking for new files | `source.sftp_pull.scheduling.cron` | `0 */5 * * * * *` (every 5 minutes) |

> [!TIP]
> For more information about all the configuration options for the ingestion agent, see [Configuration reference for Azure Operator Insights ingestion agent](ingestion-agent-configuration-reference.md).

### Requirements for the Azure Operator Insights ingestion agent

The Azure Operator Insights ingestion agent collects files from _ingestion pipelines_ that you configure on it. Ingestion pipelines include the details of the SFTP server, the files to collect from it and how to manage those files.

You must choose how to set up your agents, pipelines, and VMs using the following rules.

- Pipelines must not overlap, meaning that they must not collect the same files from the same servers.
- You must configure each pipeline on exactly one agent. If you configure a pipeline on multiple agents, Azure Operator Insights receives duplicate data.
- Each agent must run on a separate VM.
- The number of agents and therefore VMs also depends on:
    - The scale and redundancy characteristics of your deployment.
    - The number and size of the files, and how frequently the files are copied.

As a guide, this table documents the throughput that the recommended specification on a standard D4s_v3 Azure VM can achieve.

| File count | File size (KiB) | Time (seconds) | Throughput (Mbps) |
|------------|-----------------|----------------|-------------------|
| 64         | 16,384          | 6              | 1,350             |
| 1,024      | 1,024           | 10             | 910               |
| 16,384     | 64              | 80             | 100               |
| 65,536     | 16              | 300            | 25                |

For example, if you need to collect from two file sources, you could:

- Deploy one VM with one agent, configured with two pipelines. Each pipeline collects from one file source.
- Deploy two VMs, each with one agent. Each agent (and therefore each VM) collects from one file source.

Each Linux VM running the agent must meet the following minimum specifications.

| Resource | Requirements                                                        |
|----------|---------------------------------------------------------------------|
| OS       | Red Hat Enterprise Linux 8.6 or later, or Oracle Linux 8.8 or later |
| vCPUs    | Minimum 4, recommended 8                                            |
| Memory   | Minimum 32 GB                                                       |
| Disk     | 30 GB                                                               |
| Network  | Connectivity to the SFTP server and to Azure                        |
| Software | systemd, logrotate, and zip installed                                |
| Other    | SSH or alternative access to run shell commands                     |
| DNS      | (Preferable) Ability to resolve Microsoft hostnames. If not, you need to perform extra configuration when you set up the agent (described in [Map Microsoft hostnames to IP addresses for ingestion agents that can't resolve public hostnames](map-hostnames-ip-addresses.md).) |

## Related content

- [Data Quality Monitoring](concept-data-quality-monitoring.md)
- [Azure Operator Insights Data Types](concept-data-types.md)
- [Affirmed Networks MCC documentation](https://manuals.metaswitch.com/MCC) 

> [!NOTE]
> Affirmed Networks login credentials are required to access the MCC product documentation.

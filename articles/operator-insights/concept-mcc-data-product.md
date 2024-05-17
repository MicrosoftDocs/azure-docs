---
title: Quality of Experience - Affirmed MCC Data Products - Azure Operator Insights
description: This article gives an overview of the Azure Operator Insights Data Products provided to monitor the Quality of Experience for the Affirmed Mobile Content Cloud (MCC).
author: rcdun
ms.author: rdunstan
ms.reviewer: rathishr
ms.service: operator-insights
ms.topic: concept-article
ms.date: 10/25/2023

#CustomerIntent: As an MCC operator, I want to understand the capabilities of the relevant Quality of Experience Data Product, in order to provide insights to my network.
---

# Quality of Experience - Affirmed MCC Data Product overview

The *Quality of Experience - Affirmed MCC* Data Products support data analysis and insight for operators of the Affirmed Networks Mobile Content Cloud (MCC). They ingest Event Data Records (EDRs) from MCC network elements, and then digest and enrich this data to provide a range of visualizations for the operator. Operator data scientists have access to the underlying enriched data to support further data analysis.

## Background

The Affirmed Networks Mobile Content Cloud (MCC) is a virtualized Evolved Packet Core (vEPC) that can provide the following functionality.

- Serving Gateway (SGW) routes and forwards user data packets between the RAN and the core network.
- Packet Data Network Gateway (PGW) provides interconnect between the core network and external IP networks.
- Gi-LAN Gateway (GIGW) provides subscriber-aware or subscriber-unaware value-added services (VAS) without enabling MCC gateway services, allowing operators to take advantage of VAS while still using their incumbent gateway.
- Gateway GPRS support node (GGSN) provides interworking between the GPRS network and external packet switched networks.
- Serving GPRS support node and MME (SGSN/MME) is responsible for the delivery of data packets to and from the mobile stations within its geographical service area.
- Control and User Plane Separation (CUPS), an LTE enhancement that separates control and user plane function to allow independent scaling of functions.

The data produced by the MCC varies according to the functionality. This variation affects the enrichments and visualizations that are relevant. Azure Operator Insights provides the following Quality of Experience Data Products to support specific MCC functions.

- **Quality of Experience - Affirmed MCC GIGW**
- **Quality of Experience - Affirmed MCC PGW/GGSN**

## Data types

The following data types are provided for all Quality of Experience - Affirmed MCC Data Products.

- `edr` contains data from the Event Data Records (EDRs) written by the MCC network elements. EDRs record each significant event arising during calls or sessions handled by the MCC. They provide a comprehensive record of what happened, allowing operators to explore both individual problems and more general patterns. The Data Product supports the following EDRs.
  - `Status`
  - `Session`
  - `Bearer`
  - `Flow`
  - `HTTP`
  - `RTT`
  - `MME CRR`
  - `SGSN CRR`
  
  > [!Note]
  > Both kinds of `CRR` records are stored in the `all_mme_sgsn_events` table.
- `edr-sanitized` contains data from the `edr` data type but with personal data suppressed. Sanitized data types can be used to support data analysis while also enforcing subscriber privacy.
- `edr-validation`: This data type contains a subset of performance management statistics and provides you with the ability to optionally ingest a minimum number of PMstats tables for a data quality check.
- `device`: This optional data type contains device data (for example, device model, make and capabilities) that the Data Product can use to enrich the MCC Event Data Records. To use this data type, you must upload the device reference data in a CSV file. The CSV must conform to the [Device reference schema for the Quality of Experience Affirmed MCC Data Product](device-reference-schema.md).
- `enrichment`: This data type holds the enriched Event Data Records and covers multiple sub data types for precomputed aggregations targeted to accelerate specific dashboards, granularities, and queries. These multiple sub data types include:
    - `agg-enrichment-5m`: contains enriched Event Data Records aggregated over five-minute intervals.
    - `agg-enrichment-1h`: contains enriched Event Data Records aggregated over one-hour intervals.
    - `agg-enrichment-1d`: contains enriched Event Data Records aggregated over one-day intervals.
    - `enriched-flow-dcount`: contains precomputed counts used to report the unique IMSIs, MCCs, and Applications over time.
- `location`: This optional data type contains data enriched with location information, if you have a source of location data. This covers the following sub data types.
    - `agg-location-5m`: contains enriched location data aggregated over five-minute intervals.
    - `agg-location-1h`: contains enriched location data aggregated over one-hour intervals.
    - `agg-location-1d`: contains enriched location data aggregated over one-day intervals.
    - `enriched-loc-dcount`: contains precomputed counts used to report location data over time.
- `agg-functions`: This data type contains functions used in the visualizations to conditionally select different data sources depending on the given parameters.

## Setup

To use the Quality of Experience - Affirmed MCC Data Product:

- Deploy the Data Product by following [Create an Azure Operator Insights Data Product](data-product-create.md).
- Configure your network to provide data either using your own ingestion method, or by setting up the [Azure Operator Insights ingestion agent](ingestion-agent-overview.md). 
    - Use the information in [Required ingestion configuration](#required-ingestion-configuration) when you're setting up ingestion.
    - We recommend the Azure Operator Insights ingestion agent for the `edr` data type. To ingest the `device` and `edr-validation` data types, you can use a separate instance of the ingestion agent, or set up your own ingestion method.
    - If you're using the Azure Operator Insights ingestion agent, also meet the requirements in [Requirements for the Azure Operator Insights ingestion agent](#requirements-for-the-azure-operator-insights-ingestion-agent).
- Configure your Affirmed MCCs to send EDRs to the ingestion agent. See [Configuration for Affirmed MCCs](#configuration-for-affirmed-mccs).
- If you're using the `edr-validation` data type, configure your Affirmed EMS to export performance management stats to a remote server. See [Configuration for Affirmed EMS](#configuration-for-affirmed-ems).

### Required ingestion configuration

Use the information in this section to configure your ingestion method. Refer to the documentation for your chosen method to determine how to supply these values.

| Data type | Required container name | Requirements for data |
|---------|---------|---------|
| `edr` | `edr` | MCC EDR data. |
| `device` | `device` | Device reference data. |
| `edr-validation` | `edr-validation` | PM Stat data for `EDR_HTTP_STATS`, `EDR_FLOW_STATS`, and `EDR_SESSION_STATS` datasets. File name prefixes must match the name of the dataset. |

### Requirements for the Azure Operator Insights ingestion agent

Use the VM requirements to set up one or more VMs for the ingestion agent. Use the example configuration to configure the ingestion agent to upload data to the Data Product, as part of following [Install the Azure Operator Insights ingestion agent and configure it to upload data](set-up-ingestion-agent.md).

# [EDR ingestion](#tab/edr-ingestion)

#### VM requirements

Each agent instance must run on its own Linux VM. The number of VMs needed depends on the scale and redundancy characteristics of your deployment. This recommended specification can achieve 1.5-Gbps throughput on a standard D4s_v3 Azure VM. For any other VM spec, we recommend that you measure throughput at the network design stage.

Latency on the MCC to agent connection can negatively affect throughput. Latency should usually be low if the MCC and agent are colocated or the agent runs in an Azure region close to the MCC.

Talk to the Affirmed Support Team to determine your requirements.

Each VM running the agent must meet the following minimum specifications for EDR ingestion.

| Resource | Requirements                                                        |
|----------|---------------------------------------------------------------------|
| OS       | Red Hat Enterprise Linux 8.6 or later, or Oracle Linux 8.8 or later |
| vCPUs    | 4                                                                   |
| Memory   | 32 GB                                                               |
| Disk     | 64 GB                                                               |
| Network  | Connectivity from MCCs and to Azure                                 |
| Software | systemd, logrotate, and zip installed                               |
| Other    | SSH or alternative access to run shell commands                     |
| DNS      | (Preferable) Ability to resolve Microsoft hostnames. If not, you need to perform extra configuration when you set up the agent (described in [Map Microsoft hostnames to IP addresses for ingestion agents that can't resolve public hostnames](map-hostnames-ip-addresses.md).) |

#### Deploying multiple VMs for fault tolerance

The ingestion agent is designed to be highly reliable and resilient to low levels of network disruption. If an unexpected error occurs, the agent restarts and provides service again as soon as it's running.

The agent doesn't buffer data, so if a persistent error or extended connectivity problems occur, EDRs are dropped.

For extra fault tolerance, you can deploy multiple instances of the ingestion agent and configure the MCC to switch to a different instance if the original instance becomes unresponsive, or to share EDR traffic across a pool of agents. For more information, see the [Affirmed Networks Active Intelligent vProbe System Administration Guide](https://manuals.metaswitch.com/vProbe/latest/vProbe_System_Admin/Content/02%20AI-vProbe%20Configuration/Generating_SESSION__BEARER__FLOW__and_HTTP_Transac.htm) (only available to customers with Affirmed support) or speak to the Affirmed Networks Support Team.

# [Performance management and device data ingestion](#tab/pm-stat-or-device-data-ingestion)

#### Performance management ingestion via an SFTP server

If you're using the Azure Operator Insights ingestion agent to ingest performance management stats files for the `edr-validation` data type:
- Configure the EMS to export performance management stats to an SFTP server.
- Configure the ingestion agent to use SFTP pull from the SFTP server.
- We recommend the following configuration settings in addition to the (required) settings in the previous table.

|Information | Configuration setting for Azure Operator Ingestion agent  | Recommended value  |
| --------- | --------- | --------- |
| [Settling time](ingestion-agent-overview.md#processing-files) | `source.sftp_pull.filtering.settling_time` | `60s` (upload files that haven't been modified in the last 60 seconds) |
| Schedule for checking for new files | `source.sftp_pull.scheduling.cron` | `0 */5 * * * * *` (every 5 minutes) |

#### Device data ingestion via an SFTP server

If the device data is stored on an SFTP server, you can ingest device data by configuring an extra `sftp_pull` ingestion pipeline on the same ingestion agent instance that you're using for PM stat ingestion. You can choose your own value for `source.sftp_pull.scheduling.cron` for the device data pipeline, depending on how frequently you want the ingestion pipeline to check for new device data files.

> [!TIP]
> For more information about all the configuration options for the ingestion agent, see [Configuration reference for Azure Operator Insights ingestion agent](ingestion-agent-configuration-reference.md).

#### VM requirements

Each agent instance running SFTP pull pipelines must run on a separate Linux VM to any agent instance used for EDR ingestion. The number of VMs needed depends on the scale and redundancy characteristics of your deployment. 

As a guide, this table documents the throughput that the recommended specification on a standard D4s_v3 Azure VM can achieve.

| File count | File size (KiB) | Time (seconds) | Throughput (Mbps) |
|------------|-----------------|----------------|-------------------|
| 64         | 16,384          | 6              | 1,350             |
| 1,024      | 1,024           | 10             | 910               |
| 16,384     | 64              | 80             | 100               |
| 65,536     | 16              | 300            | 25                |

Each Linux VM running the agent must meet the following minimum specifications for SFTP pull ingestion.

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

---

### Configuration for Affirmed MCCs

After installing and configuring your ingestion agents, configure the MCCs to send EDRs to them.

Follow the steps in "Generating SESSION, BEARER, FLOW, and HTTP Transaction EDRs" in the [Affirmed Networks Active Intelligent vProbe System Administration Guide](https://manuals.metaswitch.com/vProbe/latest) (only available to customers with Affirmed support), making the following changes:

- Replace the IP addresses of the MSFs in MCC configuration with the IP addresses of the VMs running the ingestion agents.
- Confirm that the following EDR server parameters are set.

    - `port`: 36001
    - `encoding`: protobuf
    - `keep-alive`: 2 seconds

### Configuration for Affirmed EMS

If you're using the `edr-validation` data type, configure the EMS to export the relevant performance management statistics to a remote server. If you're using the Azure Operator Insights ingestion agent to ingest performance management statistics, the remote server must be an [SFTP server](set-up-ingestion-agent.md#prepare-the-sftp-server), otherwise the remote server needs to be accessible by your ingestion method.

1. Obtain the IP address, user, and password of the remote server.
1. Configure the transfer of EMS statistics to a remote server
    - Use the instructions in [Copying Performance Management Statistics Files to Destination Server](https://manuals.metaswitch.com/MCC/13.1/Acuitas_Users_RevB/Content/Appendix%20Interfacing%20with%20Northbound%20Interfaces/Exported_Performance_Management_Data.htm#northbound_2817469247_308739) in the _Acuitas User's Guide_.
    - For `edr-validation`, you only need to export three CSV files. List these file names in the `opt/Affirmed/NMS/conf/pm/mcc.files.txt` file on the EMS:
      - `EDR_HTTP_STATS`
      - `EDR_FLOW_STATS`
      - `EDR_SESSION_STATS`

> [!IMPORTANT]
> Increase the frequency of the cron job by reducing the `timeInterval` argument from `15` (default) to `5` minutes.

## Related content

- [Data Quality Monitoring](concept-data-quality-monitoring.md)
- [Azure Operator Insights Data Types](concept-data-types.md)
- [Monitoring - Affirmed MCC Data Product](concept-monitoring-mcc-data-product.md)
- [Affirmed Networks MCC documentation](https://manuals.metaswitch.com/MCC) 

> [!NOTE]
> Affirmed Networks login credentials are required to access the MCC product documentation.

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

- *pmstats* contains performance management data reported by the MCC management node, giving insight into the performance characteristics of the MCC network elements.

## Setup

To use the Monitoring - Affirmed MCC Data Product:

1. Deploy the Data Product by following [Create an Azure Operator Insights Data Product](data-product-create.md).
1. Configure your network to provide data by setting up an Azure Operator Insights ingestion agent on a virtual machine (VM).

    1. Read [Requirements for the Azure Operator Insights ingestion agent](#requirements-for-the-azure-operator-insights-ingestion-agent).
    1. [Install the Azure Operator Insights ingestion agent and configure it to upload data](set-up-ingestion-agent.md).

    Alternatively, you can provide your own ingestion agent.

## Requirements for the Azure Operator Insights ingestion agent

Use the VM requirements to set up a suitable VM for the ingestion agent. Use the example configuration to configure the ingestion agent to upload data to the Data Product, as part of following [Install the Azure Operator Insights ingestion agent and configure it to upload data](set-up-ingestion-agent.md).

## Choosing agents and VMs

An ingestion agent collects files from _ingestion pipelines_ that you configure on it. Ingestion pipelines include the details of the SFTP server, the files to collect from it and how to manage those files.

You must choose how to set up your agents, pipelines, and VMs using the following rules:
- Pipelines must not overlap, meaning that they must not collect the same files from the same servers.
- You must configure each pipeline on exactly one agent. If you configure a pipeline on multiple agents, Azure Operator Insights receives duplicate data.
- Each agent can have multiple file sources.
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

- Deploy one VM with one agent that collects from both file sources.
- Deploy two VMs, each with one agent. Each agent (and therefore each VM) collects from one file source.

### VM requirements

Each VM running the agent must meet the following minimum specifications.

| Resource | Requirements                                                        |
|----------|---------------------------------------------------------------------|
| OS       | Red Hat Enterprise Linux 8.6 or later, or Oracle Linux 8.8 or later |
| vCPUs    | Minimum 4, recommended 8                                            |
| Memory   | Minimum 32 GB                                                       |
| Disk     | 30 GB                                                               |
| Network  | Connectivity to the SFTP server and to Azure                        |
| Software | systemd, logrotate, and zip installed                                |
| Other    | SSH or alternative access to run shell commands                     |
| DNS      | (Preferable) Ability to resolve public DNS. If not, you need to perform extra steps to resolve Azure locations. See [VMs without public DNS: Map Azure host names to IP addresses.](#vms-without-public-dns-map-azure-host-names-to-ip-addresses). |

### Required agent configuration

This section should be followed as part of [Configure the agent software](set-up-ingestion-agent.md).

1. Change to the configuration directory: `cd /etc/az-aoi-ingestion`
1. Make a copy of the default configuration file: `sudo cp example_config.yaml config.yaml`
1. Edit the *config.yaml* file and fill out the fields. Delete all pipelines except `contoso-logs`, and change the pipeline ID to `pmstats`. Start by filling out the parameters that don't depend on the type of Data Product. Many parameters are set to default values and don't need to be changed. The full reference for each parameter is described in [Configuration reference for Azure Operator Insights ingestion agent](ingestion-agent-configuration-reference.md). The following parameters must be set:

    1. **agent\_id** should be changed to a unique identifier for your on-premises site – for example, the name of the city or state for this site.  This name becomes searchable metadata in Operator Insights for all data ingested by this agent. Reserved URL characters must be percent-encoded.
    1. For the secret provider with name `data_product_keyvault`, set the following fields:
        1. **provider.vault\_name** must be the name of the Key Vault for your Data Product. You identified this name in [Grant permissions for the Data Product Key Vault](#grant-permissions-for-the-data-product-key-vault).  
        1. **provider.auth** must be filled out with:

            1. **tenant\_id** as your Microsoft Entra ID tenant.

            2. **identity\_name** as the application ID of the service principal that you created in [Create a service principal](#create-a-service-principal).

            3. **cert\_path** as the file path of the base64-encoded pcks12 certificate in the secrets directory folder, for the service principal to authenticate with.
    1. For the secret provider with name `local_file_system`, set the following fields:

        1. **provider.auth.secrets_directory** the absolute path to the secrets directory on the agent VM, which was created in the [Prepare the VMs](#prepare-the-vms) step.
    

    1. **pipelines** a list of ingestion pipeline details, which specifies the configured SFTP server and configures which files should be uploaded, where they should be uploaded, and how often. Multiple ingestion pipelines can be specified. Must be filled out with the following values:

        1. **id** a unique identifier for the ingestion pipeline. Any URL reserved characters in source_id must be percent-encoded.

        1. **source.sftp_pull.server** must be filled out with:

            1. **host** the hostname or IP address of the SFTP server.

            1. **filtering.base\_path** the path to a folder on the SFTP server that files will be uploaded to Azure Operator Insights from.

            1. **known\_hosts\_file** the path on the VM to the global known_hosts file, located at `/etc/ssh/ssh_known_hosts`. This file should contain the public SSH keys of the SFTP host server as outlined in [Prepare the VMs](#prepare-the-vms). 

            1. **user** the name of the user on the SFTP server that the agent should use to connect.

            1. **auth** must be filled according to the authentication method that you chose in [Configure the connection between the SFTP server and VM](#configure-the-connection-between-the-sftp-server-and-vm). The required fields depend on which authentication type is specified:

                - Password:

                    1. **type** set to `password`

                    1. **secret\_name** is the name of the file containing the password in the `secrets_directory` folder.

                - SSH key:

                    1. **type** set to `ssh_key`

                    1. **key\_secret** is the name of the file containing the SSH key in the `secrets_directory` folder.

                    1. **passphrase\_secret\_name** is the name of the file containing the passphrase for the SSH key in the `secrets_directory` folder. If the SSH key doesn't have a passphrase, don't include this field.

   
2. Continue to edit *config.yaml* to set the parameters that depend on the type of Data Product that you're using.
For the **Monitoring - Affirmed MCC** Data Product, set the following parameters in each file pipeline block.

    1. **source.sftp_pull.filtering.settling_time** set to `60s`
    2. **source.sftp_pull.scheduling.cron** set to  `0 */5 * * * * *` so that the agent checks for new files in the file source every 5 minutes
    3. **sink.container\_name** set to `pmstats`

> [!TIP]
> The agent supports additional optional configuration for the following:
> - Specifying a pattern of files in the `base_path` folder which will be uploaded (by default all files in the folder are uploaded).
> - Specifying a pattern of files in the `base_path` folder which should not be uploaded.
> - A time and date before which files in the `base_path` folder will not be uploaded.
> - How often the ingestion agent uploads files (the value provided in the example configuration file corresponds to every hour).
> - A settling time, which is a time period after a file is last modified that the agent will wait before it is uploaded (the value provided in the example configuration file is 5 minutes).
>
> For more information about these configuration options, see [Configuration reference for Azure Operator Insights ingestion agent](ingestion-agent-configuration-reference.md).

## Related content

- [Data Quality Monitoring](concept-data-quality-monitoring.md)
- [Azure Operator Insights Data Types](concept-data-types.md)
- [Affirmed Networks MCC documentation](https://manuals.metaswitch.com/MCC) 

> [!NOTE]
> Affirmed Networks login credentials are required to access the MCC product documentation.

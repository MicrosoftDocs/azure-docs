---
title: "AI Vectra Stream connector for Microsoft Sentinel"
description: "Learn how to install the connector AI Vectra Stream to connect your data source to Microsoft Sentinel."
author: cwatson-cat
ms.topic: how-to
ms.date: 02/23/2023
ms.service: microsoft-sentinel
ms.author: cwatson
---

# AI Vectra Stream connector for Microsoft Sentinel

The AI Vectra Stream connector allows to send Network Metadata collected by Vectra Sensors accross the Network and Cloud to Microsoft Sentinel

## Connector attributes

| Connector attribute | Description |
| --- | --- |
| **Log Analytics table(s)** | VectraStream_CL<br/> |
| **Data collection rules support** | Not currently supported |
| **Supported by** | [Vectra AI](https://www.vectra.ai/support) |

## Query samples

**List all DNS Queries**
   ```kusto
VectraStream 

   | where metadata_type == "metadat_dns" 

   | project orig_hostname, id_orig_h, resp_hostname, id_resp_h, id_resp_p, qtype_name, ['query'], answers
   ```

**Number of DNS requests per type**
   ```kusto
VectraStream 

   | where metadata_type == "metadat_dns" 

   | summarize count() by type_name
   ```

**Top 10 of query to non existing domain**
   ```kusto
VectraStream 

   | where metadata_type == "metadat_dns" 

   | where rcode_name == "NXDomain"

   | summarize Count=count() by tostring(query)

   | order by Count desc

   | limit 10
   ```

**Host and Web sites using non-ephemeral Diffie-Hellman key exchange**
   ```kusto
VectraStream 

   | where metadata_type == "metadat_dns" 

   | where cipher contains "TLS_RSA"

   | distinct orig_hostname, id_orig_h, id_resp_h, server_name, cipher

   | project orig_hostname, id_orig_h, id_resp_h, server_name, cipher
   ```



## Prerequisites

To integrate with AI Vectra Stream make sure you have: 

- **Vectra AI Brain**: must be configured to export Stream metadata in JSON


## Vendor installation instructions


> [!NOTE]
   >  This data connector depends on a parser based on a Kusto Function to work as expected **VectraStream** which is deployed with the Microsoft Sentinel Solution.

1. Install and onboard the agent for Linux

Install the Linux agent on sperate Linux instance.

> Logs are collected only from **Linux** agents.


2. Configure the logs to be collected

Follow the configuration steps below to get Vectra Stream metadata into Microsoft Sentinel. The Log Analytics agent is leveraged to send custom JSON into Azure Monitor, enabling the storage of the metadata into a custom table. For more information, refer to the [Azure Monitor Documentation](/azure/azure-monitor/agents/data-sources-json).
1. Download config file for the log analytics agent: VectraStream.conf (located in the Connector folder within the Vectra solution: https://aka.ms/sentinel-aivectrastream-conf).
2. Login to the server where you have installed Azure Log Analytics agent.
3. Copy VectraStream.conf to the /etc/opt/microsoft/omsagent/**workspace_id**/conf/omsagent.d/ folder.
4. Edit VectraStream.conf as follows:

	 i. configure an alternate port to send data to, if desired. Default port is 29009.

	 ii. replace **workspace_id** with real value of your Workspace ID.
5. Save changes and restart the Azure Log Analytics agent for Linux service with the following command:
		sudo /opt/microsoft/omsagent/bin/service_control restart


3. Configure and connect Vectra AI Stream

Configure Vectra AI Brain to forward Stream metadata in JSON format to your Microsoft Sentinel workspace via the Log Analytics Agent.

From the Vectra UI, navigate to Settings > Cognito Stream and Edit the destination configuration:

- Select Publisher: RAW JSON

- Set the server IP or hostname (which is the host which run the Log Analytics Agent)

- Set all the port to **29009** (this port can be modified if required)

- Save

- Set Log types (Select all log types available)

- Click on **Save**





## Next steps

For more information, go to the [related solution](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/vectraaiinc.vectra_sentinel_solution?tab=Overview) in the Azure Marketplace.

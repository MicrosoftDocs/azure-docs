---
title: Resiliency in Azure Monitor for SAP Solutions #Required; Must be "Resiliency in *your official service name*"
description: Find out about reliability in Azure Monitor for SAP Solutions #Required; 
author: srivastavap #Required; your GitHub user alias, with correct capitalization.
ms.author: sap-embrace-monitor #Required; Microsoft alias of author; optional team alias.
ms.topic: overview
ms.custom: subject-reliability
ms.prod: non-product-specific
---


# What is reliability in 'Azure Monitor for SAP Solutions?
This article describes reliability support in Azure Monitor for SAP Solutions(AMS), and covers <!-- IF (AZ SUPPORTED) --> both regional resiliency with availability zones and <!-- END IF (AZ SUPPORTED)--> cross-region resiliency with customer enabled disaster recovery. For a more detailed overview of reliability in Azure, see [Azure reliability](https://docs.microsoft.com/azure/architecture/framework/resiliency/overview.md).

## Availability zone support
Azure availability zones are at least three physically separate groups of datacenters within each Azure region. Datacenters within each zone are equipped with independent power, cooling, and networking infrastructure. In the case of a local zone failure, availability zones are designed so that if one zone is affected, regional services, capacity, and high availability are supported by the remaining two zones.  Failures can range from software and hardware failures to events such as earthquakes, floods, and fires. Tolerance to failures is achieved with redundancy and logical isolation of Azure services. For more detailed information on availability zones in Azure, see [Availability zone service and regional support](availability-zones-service-support.md).

There are three types of Azure services that support availability zones: zonal, zone-redundant, and always-available services. You can learn more about these types of services and how they promote resiliency in the [Azure services with availability zone support](availability-zones-service-support.md#azure-services-with-availability-zone-support).

Azure Monitor for SAP Solutions supports zone-redundancy. While creating AMS monitor, customer is asked to enable or disable zone redundancy. Zone redundancy can only be chosen at the time of AMS creation. Once the AMS resource is created the customer cannot revert to other option of being zone redundant or not.

### Regional availability

Azure Monitor for SAP Solutions zonal support is available in the following regions:

| Americas         | Europe         | Asia Pacific    |
|------------------|----------------|-----------------|
| West US 3        | North Europe   | Australia East  |
| East US          | West Europe    | Central India   |
| East US 2        |                | East Asia       |

### Prerequisites
Zone redundancy for AMS is customer driven. Here are the requirements which need to be fulfilled before choosing zone redundancy support for AMS:
- There should be quota to create a ZRS storage account and an app service plan with Elastic Premium SKU.
- Log Analytics workspace(LAWS) should be linked to [Azure Monitor Logs Dedicated Cluster](https://learn.microsoft.com/en-us/azure/azure-monitor/logs/logs-dedicated-clusters). Customer can also provide a Log Analytics workspace which is not linked to dedicated cluster and link the Log Analytics workspace to dedicated cluster afterwards. For detailed steps to link dedicated cluster to Log Analytics Workspace please follow this [document.](https://learn.microsoft.com/en-us/azure/azure-monitor/logs/logs-dedicated-clusters?tabs=cli#link-a-workspace-to-a-cluster)

Note: Until the Log Analytics Workspace is linked to dedicated cluster, AMS monitor won't be fully zone resilient.

#### Create a resource with availability zone enabled
Here are the following ways zone redundant AMS can be created: 

# [Azure portal](#tab/azure-portal)

1. Open the Azure portal and navigate to the **Azure Monitor for SAP solutions** page. Information on creating a AMS in the portal can be found [here](https://learn.microsoft.com/en-us/azure/sap/monitor/quickstart-portal).

1. In the **Basics** page, fill out the fields for your AMS. Pay special attention to the fields in the table below (also highlighted in the screenshot below), which have specific requirements for zone redundancy.

    | Setting      | Suggested value  | Notes for Zone Redundancy |
    | ------------ | ---------------- | ----------- |
    | **Zone Redundancy** | Enabled or Disabled | The subscription under which this new function app is created. You must pick a region that is availability zone enabled from the [list above](#prerequisites). |
    | **Log Analytics Workspace** | Log Analytics Workspace | Log Analytics workspace which has to be linked to dedicated cluster if zone redundancy is Enabled. |

    ![Screenshot of Zone redundancy option while AMS creation.](../media/ams-az.png)


# [ARM Template](#tab/azure-portal)
You can use an [ARM template](../azure-resource-manager/templates/quickstart-create-templates-use-visual-studio-code.md) to deploy to a zone-redundant Azure Montior for SAP solutions.


Below is an ARM template snippet for a zone-redundant AMS showing the `zoneRedundancyPreference` field and the `logAnalyticsWorkspaceArmId` fields.

```json
"resources": [
    {
      "apiVersion": "2023-04-01-preview",
      "location": "<SERVICE_LOCATION>",
      "name": "<YOUR_MONITOR_NAME>",
      "properties": {
        "appLocation": "<YOUR_WORKLOAD_LOCATION>",
        "managedResourceGroupConfiguration": {
          "name": "<MONITOR_NAME>"
        },
        "monitorSubnet": "<YOUR_SUBNET_ID>",
        "routingPreference": "<YOUR_ROUTING_PREFERENCE>",
        "zoneRedundancyPreference":"Enabled",
        "logAnalyticsWorkspaceArmId": "<ARM ID FOR LOG ANALYTICS WORKSPACE CONNECTED TO DEDICATED CLUSTER>",
      },
      "type": "Microsoft.Workloads/monitors"
    }
]
```
---

After the zone-redundant plan is created and deployed with dedicated cluster LAWS, AMS is considered zone-redundant.


### Zone down experience
During a zone-wide outage, the customer should expect brief degradation of performance, until the service self-healing re-balances underlying capacity to adjust to healthy zones. This is not dependent on zone restoration; it is expected that the Microsoft-managed service self-healing state will compensate for a lost zone, leveraging capacity from other zones. 

Log analytics workspace for a zone-redundant monitor resource fails over to other zones of the region when a zone goes down. For additional information refer [reliability for Log Analytics workspace](https://github.com/MicrosoftDocs/azure-docs-pr/blob/main/articles/reliability/migrate-monitor-log-analytics.md)

Azure functions deployed in the managed resource group continue to process events from other zones of the region and failed instances are added over time. For additional information refer [reliability for function apps](https://github.com/MicrosoftDocs/azure-docs-pr/blob/main/articles/reliability/reliability-functions.md)

Azure storage account will continue to be available as ZRS takes advantage of Azure availability zones to replicate data in the primary region across three separate data centers. For additional information refer [reliability for Azure Storage Account](https://github.com/MicrosoftDocs/azure-docs-pr/blob/main/articles/reliability/migrate-storage.md)


## Disaster recovery: cross-region failover
In the case of a region-wide disaster, Azure can provide protection from regional or large geography disasters with disaster recovery by making use of another region. For more information on Azure disaster recovery architecture, see [Azure to Azure disaster recovery architecture](/azure/site-recovery/azure-to-azure-architecture.md).

For AMS cross-region failover, customers are responsible for setup and execution of cross region failover.

Following sections explains the pre-requisites and manual steps to recover AMS on cross-region failover scenario.

### Pre-requisites
  1. Customers should setup the DR story for their SAP workloads in DR region. For example, use ASR for SAP VMs to replicate to DR region.
  1. Customers should also replicate the AMS monitoring telemetry data in Log Analytics workspace to DR region. Following section will explain how to replicate AMS telemetry data.

### How to replicate AMS telemetry data?
Follow the steps below to replicate or back-up the AMS monitor data into DR region.
  1. Export the telemetry data from LAWS in primary region to a storage account. [For detailed steps, please refer this document.](https://learn.microsoft.com/en-us/azure/azure-monitor/logs/logs-export-logic-app)
      1. Create a logic app or use an existing one. 
      1. Create a new workflow in the logic app. 
      1. Following the steps in the [document](https://learn.microsoft.com/en-us/azure/azure-monitor/logs/logs-export-logic-app) replicating Action "Run query and list results" for each custom logs table present in Log Analytics Workspace. To know all the custom log tables, navigate to Tables under Settings in Log Analytics Workspace and filter on Type column to find all Custom Tables.
      1. For the [Add the create blob action](https://learn.microsoft.com/en-us/azure/azure-monitor/agents/data-sources-custom-logs#upload-and-parse-a-sample-log) append the name of custom table name in the blob name input. This creates respective files for each custom table.
  1. Import the data collected in previous step into the LAWS created in DR region. Please follow this [document](https://learn.microsoft.com/en-us/azure/azure-monitor/agents/data-sources-custom-logs#upload-and-parse-a-sample-log) and repeat for all the files for respective custom tables.
We recommend customers to periodically backup the AMS monitoring telemetry data to the Log analytics workspace in DR region.

### AMS cross region fail-over story
Assuming primary Azure region A is unavailable, and customers have already replicated their SAP VMs to DR region B. They would now require AMS to be available so they can monitor SAP systems in DR region B.  

Since region A is unavailable then AMS service in region A will also be unavailable. However, AMS service in all other regions is still available. Customer can use AMS from any other available service region to start monitoring SAP systems in DR region.

Customers can manually deploy net new AMS in DR region B and start monitoring their replicated SAP system in DR region B.
While creating new AMS monitor in DR region B, customer can provide the Log Analytics workspace in region B which has the telemetry data backed up from primary region A, so that customer will have the historical monitoring telemetry data.

### Cross-region disaster recovery in multi-region geography

Customers are responsible for setup and execution of cross-region disaster region.


#### Set up disaster recovery and outage detection
When service goes down in a region customers will be notified through AZCOM. Customer also can check the service health page in Azure portal, and can also configure the notifications on service health by following the steps [here](https://learn.microsoft.com/en-in/azure/service-health/alerts-activity-log-service-notifications-portal?toc=%2Fazure%2Fservice-health%2Ftoc.json).

### Single-region geography disaster recovery

The DR is identical for single-region and multi-region geographies.

As explained in previous sections, customers need to setup DR story for the SAP workloads, and also backup the monitoring telemetry data into a Log Analytics workspace in DR region.

### Capacity and proactive disaster recovery resiliency
For seamless creation of AMS for a region, the subscription should have quota for creating 1 storage account, key vault, EP1 SKU App Service Plan and Log Analytics Workspace.

## Next steps

> [!div class="nextstepaction"]
> [Resiliency in Azure](/azure/availability-zones/overview.md)

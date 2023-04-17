# Customer Enabled DR For Azure Monitor For SAP Solutions 
This document describes cross-region resiliency with customer enabled disaster recovery. It captures the detailed steps for the customer to follow in case the region is down to get their workload onboarded to Azure Monitor For SAP Solutions in a different region. 
Azure Monitor For SAP Solutions(AMS) supports 3+0 region architecture. So, service may experience downtime because no paired region exists, and no Microsoft initiated failover will take place in the event of a region outage. 
Customers will be notified about the region outage, and they should follow the steps provided below to get their workload onboard to ANS in a different region. 
## CEDR Readiness (Prerequisites): 
  1. Customers should setup the DR story for their SAP workloads in DR region. For example, use ASR for SAP VMs to replicate to DR region.
  1. Customers should also replicate the AMS monitoring telemetry data in Log Analytics workspace to DR region. Following section will explain how to replicate AMS telemetry data.


### AMS cross region fail-over story
Assuming primary Azure region A is unavailable, and customers have already replicated their SAP VMs to DR region B. Customer can use AMS from any other available service region to start monitoring SAP systems in DR region B.

Customers can manually deploy a new AMS in DR region B and start monitoring their replicated SAP system in DR region B.
While creating new AMS monitor in DR region B, customer can provide the Log Analytics workspace in region B which has the telemetry data backed up from primary region A, so that customer will have the historical monitoring telemetry data.

![Portal screenshot for setting up AMS in DR region B](../media/AMS_Setup_DR-Region-B.png)

### How to replicate AMS telemetry data?
Follow the steps below to replicate or back-up the AMS monitor data into DR region.
  1. Export the telemetry data from LAWS in primary region to a storage account. [For detailed steps, please refer this document.](https://learn.microsoft.com/en-us/azure/azure-monitor/logs/logs-export-logic-app)
      1. Create a logic app or use an existing one. 

![Portal screenshot for creating logic app](../media/create-logic-app.png)

      1. Create a new workflow in the logic app. 

![Portal screenshot for setting up AMS in DR region B](../media/create-logic-app-workflow.png)

      1. Following the steps in the [document](https://learn.microsoft.com/en-us/azure/azure-monitor/logs/logs-export-logic-app) replicating Action "Run query and list results" for each custom logs table present in Log Analytics Workspace. To know all the custom log tables, navigate to Tables under Settings in Log Analytics Workspace and filter on Type column to find all Custom Tables.

![Portal screenshot for setting up AMS in DR region B](../media/logic-app-workflows.png)

      1. For the [Add the create blob action](https://learn.microsoft.com/en-us/azure/azure-monitor/agents/data-sources-custom-logs#upload-and-parse-a-sample-log) append the name of custom table name in the blob name input. This creates respective files for each custom table.

  1. Import the data collected in previous step into the LAWS created in DR region. Please follow this [document](https://learn.microsoft.com/en-us/azure/azure-monitor/agents/data-sources-custom-logs#upload-and-parse-a-sample-log) and repeat for all the files for respective custom tables.
	1. Follow the document to add custom table in the secondary Log Analytics.
      1. Send the data exported in step 1 in storage blobs to secondary Log Analytics following this [document](https://learn.microsoft.com/en-us/azure/azure-monitor/logs/data-collector-api?tabs=powershell#sample-requests).
We recommend customers to periodically backup the AMS monitoring telemetry data to the Log analytics workspace in DR region.


### Cross-region disaster recovery in multi-region geography

Customers are responsible for setup and execution of cross-region disaster region.


#### Set up disaster recovery and outage detection
When service goes down in a region customers will be notified through AZCOM. Customer also can check the service health page in Azure portal, and can also configure the notifications on service health by following the steps [here](https://learn.microsoft.com/en-in/azure/service-health/alerts-activity-log-service-notifications-portal?toc=%2Fazure%2Fservice-health%2Ftoc.json).

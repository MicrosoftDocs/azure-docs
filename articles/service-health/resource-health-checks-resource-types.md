---
title: Supported Resource Types through Azure Resource Health | Microsoft Docs
description: Supported Resource Types through Azure Resource health
ms.topic: conceptual
ms.date: 01/29/2019
---

# Resource types and health checks in Azure resource health
Below is a complete list of all the checks executed through resource health by resource types.

## Microsoft.AnalysisServices/servers
|Executed Checks|
|---|
|<ul><li>Is the server up and running?</li><li>Has the server run out of memory?</li><li>Is the server starting up?</li><li>Is the server recovering?</li></ul>|

## Microsoft.ApiManagement/service
|Executed Checks|
|---|
|<ul><li>Is the Api Management service up and running?</li></ul>|

## Microsoft.Batch/batchAccounts
|Executed Checks|
|---|
|<ul><li>Is the Batch account up and running?</li><li>Has the pool quota been exceeded for this batch account?</li></ul>|

## Microsoft.CacheRedis/Redis
|Executed Checks|
|---|
|<ul><li>Are all the Cache nodes up and running?</li><li>Can the Cache be reached from within the datacenter?</li><li>Has the Cache reached the maximum number of connections?</li><li> Has the cache exhausted its available memory? </li><li>Is the Cache experiencing a high number of page faults?</li><li>Is the Cache under heavy load?</li></ul>|

## Microsoft.CDN/profile
|Executed Checks|
|---|
|<ul> <li>Is the supplemental portal accessible for CDN configuration operations?</li><li>Are there ongoing delivery issues with the CDN endpoints?</li><li>Can users change the configuration of their CDN resources?</li><li>Are configuration changes propagating at the expected rate?</li><li>Can users manage the CDN configuration using the Azure portal, PowerShell, or the API?</li> </ul>|

## Microsoft.classiccompute/virtualmachines
|Executed Checks|
|---|
|<ul><li>Is the host server up and running?</li><li>Has the host OS booting completed?</li><li>Is the virtual machine container provisioned and powered up?</li><li>Is there network connectivity between the host and the storage account?</li><li>Has the booting of the guest OS completed?</li><li>Is there ongoing planned maintenance?</li></ul>|

## Microsoft.cognitiveservices/accounts
|Executed Checks|
|---|
|<ul><li>Can the account be reached from within the datacenter?</li><li>Is the Cognitive Services Resource Provider available?</li><li>Is the Cognitive Service available in the appropriate region?</li><li>Can read operations be performed on the storage account holding the resource metadata?</li><li>Has the API call quota been reached?</li><li>Has the API call read-limit been reached?</li></ul>|

## Microsoft.compute/virtualmachines
|Executed Checks|
|---|
|<ul><li>Is the server hosting this virtual machine up and running?</li><li>Has the host OS booting completed?</li><li>Is the virtual machine container provisioned and powered up?</li><li>Is there network connectivity between the host and the storage account?</li><li>Has the booting of the guest OS completed?</li><li>Is there ongoing planned maintenance?</li></ul>|

## Microsoft.datafactory/factories
|Executed Checks|
|---|
|<ul><li>Have there been pipeline run failures?</li><li>Is the cluster hosting the Data Factory healthy?</li></ul>|

## Microsoft.datalakeanalytics/accounts
|Executed Checks|
|---|
|<ul><li>Have users experienced problems submitting or listing their Data Lake Analytics jobs?</li><li>Are Data Lake Analytics jobs unable to complete due to system errors?</li></ul>|


## Microsoft.datalakestore/accounts
|Executed Checks|
|---|
|<ul><li>Have users experienced problems uploading data to Data Lake Store?</li><li>Have users experienced problems downloading data from Data Lake Store?</li></ul>|

## Microsoft.datamigration/services
|Executed Checks|
|---|
|<ul><li>Has the database migration service failed to provision?</li><li>Has the database migration service stopped due to inactivity or user request?</li></ul>|

## Microsoft.DataShare/accounts
|Executed Checks|
|---|
|<ul><li>Is the Data Share account up and running?</li><li>Is the cluster hosting the Data Share available?</li></ul>|

## Microsoft.DBforMariaDB/servers
|Executed Checks|
|---|
|<ul><li>Is the server unavailable due to maintenance?</li><li>Is the server unavailable due to reconfiguration?</li></ul>|

## Microsoft.DBforMySQL/servers
|Executed Checks|
|---|
|<ul><li>Is the server unavailable due to maintenance?</li><li>Is the server unavailable due to reconfiguration?</li></ul>|

## Microsoft.DBforPostgreSQL/servers
|Executed Checks|
|---|
|<ul><li>Is the server unavailable due to maintenance?</li><li>Is the server unavailable due to reconfiguration?</li></ul>|

## Microsoft.devices/iothubs
|Executed Checks|
|---|
|<ul><li>Is the IoT hub up and running?</li></ul>|

## Microsoft.documentdb/databaseAccounts
|Executed Checks|
|---|
|<ul><li>Have there been any database or collection requests not served due to an Azure Cosmos DB service unavailability?</li><li>Have there been any document requests not served due to an Azure Cosmos DB service unavailability?</li></ul>|

## Microsoft.eventhub/namespaces
|Executed Checks|
|---|
|<ul><li>Is the Event Hubs namespace experiencing user generated errors?</li><li>Is the Event Hubs namespace currently being upgraded?</li></ul>|

## Microsoft.hdinsight/clusters
|Executed Checks|
|---|
|<ul><li>Are core services available on the HDInsight cluster?</li><li>Can the HDInsight cluster access the key for BYOK encryption at rest?</li></ul>|

## Microsoft.KeyVault/vaults
|Executed Checks|
|---|
|<ul><li>Are requests to key vault failing due to Azure KeyVault platform issues?</li><li>Are requests to key vault being throttled due to too many requests made by customer?</li></ul>|

## Microsoft.MachineLearning/webServices
|Executed Checks|
|---|
|<ul><li>Is the web service up and running?</li></ul>|

## Microsoft.Media/mediaservices
|Executed Checks|
|---|
|<ul><li>Is the media service up and running?</li></ul>|

## Microsoft.network/applicationgateways
|Executed Checks|
|---|
|<ul><li>Is performance of the Application Gateway degraded?</li><li>Is the Application Gateway available?</li></ul>|

## Microsoft.network/connections
|Executed Checks|
|---|
|<ul><li>Is the VPN tunnel connected?</li><li>Are there configuration conflicts in the connection?</li><li>Are the pre-shared keys properly configured?</li><li>Is the VPN on-premises device reachable?</li><li>Are there mismatches in the IPSec/IKE security policy?</li><li>Is the S2S VPN connection properly provisioned or in a failed state?</li><li>Is the VNET-to-VNET connection properly provisioned or in a failed state?</li></ul>|

## Microsoft.network/expressroutecircuits
|Executed Checks|
|---|
|<ul><li>Is the ExpressRoute circuit healthy?</li></ul>|

## Microsoft.network/frontdoors
|Executed Checks|
|---|
|<ul><li>Are Front Door backends responding with errors to health probes?</li><li>Are configuration changes delayed?</li></ul>|

## Microsoft.network/LoadBalancers
|Executed Checks|
|---|
|<ul><li>Are the load balancing endpoints available?</li></ul>|

## Microsoft.network/virtualNetworkGateways
|Executed Checks|
|---|
|<ul><li>Is the VPN gateway reachable from the internet?</li><li>Is the VPN Gateway in standby mode?</li><li>Is the VPN service running on the gateway?</li></ul>|

## Microsoft.NotificationHubs/namespace
|Executed Checks|
|---|
|<ul><li>Can runtime operations like registration, installation, or send be performed on the namespace?</li></ul>|

## Microsoft.operationalinsights/workspaces
|Executed Checks|
|---|
|<ul><li>Are there indexing delays for the workspace?</li></ul>|

## Microsoft.PowerBIDedicated/Capacities
|Executed Checks|
|---|
|<ul><li>Is the capacity resource up and running?</li><li>Are all the workloads up and running?</li></ul>|

## Microsoft.PowerBI/workspaceCollections
|Executed Checks|
|---|
|<ul><li>Is the host OS up and running?</li><li>Is the workspaceCollection reachable from outside the datacenter?</li><li>Is the Power BI Resource Provider available?</li><li>Is the Power BI Service available in the appropriate region?</li></ul>|

## Microsoft.search/searchServices
|Executed Checks|
|---|
|<ul><li>Can diagnostics operations be performed on the cluster?</li></ul>|

## Microsoft.ServiceBus/namespaces
|Executed Checks|
|---|
|<ul><li>Are customers experiencing user generated Service Bus errors?</li><li>Are users experiencing an increase in transient errors due to a Service Bus namespace upgrade?</li></ul>|

## Microsoft.SQL/managedInstances/databases
|Executed Checks|
|---|
|<ul><li>Is the database up and running?</li></ul>|

## Microsoft.SQL/Server/databases
|Executed Checks|
|---|
|<ul><li>Have there been logins to the database?</li></ul>|

## Microsoft.Storage/storageAccounts
|Executed Checks|
|---|
|<ul><li>Are requests to read data from the Storage account failing due to Azure Storage platform issues?</li><li>Are requests to write data to the Storage account failing due to Azure Storage platform issues?</li><li>Is the Storage cluster where the Storage account resides unavailable?</li></ul>|

## Microsoft.StreamAnalytics/streamingjobs
|Executed Checks|
|---|
|<ul><li>Are all the hosts where the job is executing up and running?</li><li>Was the job unable to start?</li><li>Are there ongoing runtime upgrades?</li><li>Is the job in an expected state (for example running or stopped by customer)?</li><li>Has the job encountered out of memory exceptions?</li><li>Are there ongoing scheduled compute updates?</li><li>Is the Execution Manager (control plan) available?</li></ul>|

## Microsoft.web/serverFarms
|Executed Checks|
|---|
|<ul><li>Is the host server up and running?</li><li>Is Internet Information Services running?</li><li>Is the Load balancer running?</li><li>Can the App Service Plan be reached from within the datacenter?</li><li>Is the storage account hosting the sites content for the serverFarm  available??</li></ul>|

## Microsoft.web/sites
|Executed Checks|
|---|
|<ul><li>Is the host server up and running?</li><li>Is Internet Information server running?</li><li>Is the Load balancer running?</li><li>Can the Web App be reached from within the datacenter?</li><li>Is the storage account hosting the site content available?</li></ul>|

## Next Steps
-  See [Introduction to Azure Service Health dashboard](service-health-overview.md) and [Introduction to Azure Resource Health](resource-health-overview.md) to understand more about them. 
-  [Frequently asked questions about Azure Resource Health](resource-health-faq.md)
- Set up alerts so you are notified of health issues. For more information, see [Configure Alerts for service health events](../azure-monitor/platform/alerts-activity-log-service-notifications.md). 

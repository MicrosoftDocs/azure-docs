---
title: Supported Resource Types through Azure Resource Health | Microsoft Docs
description: Supported Resource Types through Azure Resource health
ms.topic: conceptual
ms.date: 01/23/2023
---

# Resource types and health checks in Azure resource health
Below is a complete list of all the checks executed through resource health by resource types.

## Microsoft.AnalysisServices/servers
|Executed Checks|
|---|
| - Is the server up and running?<br> - Has the server run out of memory?<br> - Is the server starting up?<br> - Is the server recovering?|

## Microsoft.ApiManagement/service
|Executed Checks|
|---|
| - Is the Api Management service up and running?|

## Microsoft.AppPlatform/Spring
|Executed Checks|
|---|
| - Is the Azure Spring Cloud instance available?|

## Microsoft.Batch/batchAccounts
|Executed Checks|
|---|
| - Is the Batch account up and running?<br> - Has the pool quota been exceeded for this batch account?|

## Microsoft.Cache/Redis
|Executed Checks|
|---|
| - Are all the Cache nodes up and running?<br> - Can the Cache be reached from within the datacenter?<br> - Has the Cache reached the maximum number of connections?<br> -  Has the cache exhausted its available memory? <br> - Is the Cache experiencing a high number of page faults?<br> - Is the Cache under heavy load?|

## Microsoft.CDN/profile
|Executed Checks|
|---|
| - Is the supplemental portal accessible for CDN configuration operations?<br> - Are there ongoing delivery issues with the CDN endpoints?<br> - Can users change the configuration of their CDN resources?<br> - Are configuration changes propagating at the expected rate?<br> - Can users manage the CDN configuration using the Azure portal, PowerShell, or the API?|

## Microsoft.classiccompute/virtualmachines
|Executed Checks|
|---|
| - Is the server hosting this virtual machine up and running?<br> - Is the virtual machine container provisioned and powered up?<br> - Is there network connectivity between the host and the storage account?<br> - Is there ongoing planned maintenance?<br> - Are there heartbeats between Guest and host agent *(if Guest extension is installed)*?|

## Microsoft.classiccompute/domainnames
|Executed Checks|
|---|
| - Is production slot deployment healthy across all role instances?<br> - Is the role healthy across all its VM instances?<br> - What is the health status of each VM within a role of a cloud service?<br> - Was the VM status change due to platform or customer initiated operation?<br> - Has the booting of the guest OS completed?<br> - Is there ongoing planned maintenance?<br> - Is the host hardware degraded and predicted to fail soon?<br> - [Learn More](../cloud-services/resource-health-for-cloud-services.md) about Executed Checks|

## Microsoft.cognitiveservices/accounts
|Executed Checks|
|---|
| - Can the account be reached from within the datacenter?<br> - Is the Azure AI services resource provider available?<br> - Is the Cognitive Service available in the appropriate region?<br> - Can read operations be performed on the storage account holding the resource metadata?<br> - Has the API call quota been reached?<br> - Has the API call read-limit been reached?|

## Microsoft.compute/hostgroups/hosts
|Executed Checks|
|---|
| - Is the host up and running?<br> - Is the host hardware degraded?<br> - Is the host deallocated?<br> - Has the host hardware service healed to different hardware?|

## Microsoft.compute/virtualmachines
|Executed Checks|
|---|
| - Is the server hosting this virtual machine up and running?<br> - Is the virtual machine container provisioned and powered up?<br> - Is there network connectivity between the host and the storage account?<br> - Is there ongoing planned maintenance?<br> - Are there heartbeats between Guest and host agent *(if Guest extension is installed)*?|

## Microsoft.compute/virtualmachinescalesets
|Executed Checks|
|---|
| - Is the server hosting this virtual machine up and running?<br> - Is the virtual machine container provisioned and powered up?<br> - Is there network connectivity between the host and the storage account?<br> - Is there ongoing planned maintenance?<br> - Are there heartbeats between Guest and host agent *(if Guest extension is installed)*?|


## Microsoft.ContainerService/managedClusters
|Executed Checks|
|---|
| - Is the cluster up and running?<br> - Are core services available on the cluster?<br> - Are all cluster nodes ready?<br> - Is the service principal current and valid?|

## Microsoft.datafactory/factories
|Executed Checks|
|---|
| - Have there been pipeline run failures?<br> - Is the cluster hosting the Data Factory healthy?|

## Microsoft.datalakeanalytics/accounts
|Executed Checks|
|---|
| - Have users experienced problems submitting or listing their Data Lake Analytics jobs?<br> - Are Data Lake Analytics jobs unable to complete due to system errors?|


## Microsoft.datalakestore/accounts
|Executed Checks|
|---|
| - Have users experienced problems uploading data to Data Lake Store?<br> - Have users experienced problems downloading data from Data Lake Store?|

## Microsoft.datamigration/services
|Executed Checks|
|---|
| - Has the database migration service failed to provision?<br> - Has the database migration service stopped due to inactivity or user request?|

## Microsoft.DataShare/accounts
|Executed Checks|
|---|
| - Is the Data Share account up and running?<br> - Is the cluster hosting the Data Share available?|

## Microsoft.DBforMariaDB/servers
|Executed Checks|
|---|
| - Is the server unavailable due to maintenance?<br> - Is the server unavailable due to reconfiguration?|

## Microsoft.DBforMySQL/servers
|Executed Checks|
|---|
| - Is the server unavailable due to maintenance?<br> - Is the server unavailable due to reconfiguration?|

## Microsoft.DBforPostgreSQL/servers
|Executed Checks|
|---|
| - Is the server unavailable due to maintenance?<br> - Is the server unavailable due to reconfiguration?|

## Microsoft.devices/iothubs
|Executed Checks|
|---|
| - Is the IoT hub up and running?|

## Microsoft.DigitalTwins/DigitalTwinsInstances
|Executed Checks|
|---|
| - Is the Azure Digital Twins instance up and running?|

## Microsoft.documentdb/databaseAccounts
|Executed Checks|
|---|
| - Have there been any database or collection requests not served due to an Azure Cosmos DB service unavailability?<br> - Have there been any document requests not served due to an Azure Cosmos DB service unavailability?|

## Microsoft.eventhub/namespaces
|Executed Checks|
|---|
| - Is the Event Hubs namespace experiencing user generated errors?<br> - Is the Event Hubs namespace currently being upgraded?|

## Microsoft.hdinsight/clusters
|Executed Checks|
|---|
| - Are core services available on the HDInsight cluster?<br> - Can the HDInsight cluster access the key for BYOK encryption at rest?|

## Microsoft.HybridCompute/machines
|Executed Checks|
|---|
| - Is the agent on your server connected to Azure and sending heartbeats?|

## Microsoft.IoTCentral/IoTApps
|Executed Checks|
|---|
| - Is the IoT Central Application available?|

## Microsoft.KeyVault/vaults
|Executed Checks|
|---|
| - Are requests to key vault failing due to Azure KeyVault platform issues?<br> - Are requests to key vault being throttled due to too many requests made by customer?|

## Microsoft.Kusto/clusters
|Executed Checks|
|---|
| - Is the cluster experiencing low ingestion success rates?<br> - Is the cluster experiencing high ingestion latency?<br> - Is the cluster experiencing a high number of query failures?|

## Microsoft.MachineLearning/webServices
|Executed Checks|
|---|
| - Is the web service up and running?|

## Microsoft.Media/mediaservices
|Executed Checks|
|---|
| - Is the media service up and running?|

## Microsoft.network/applicationgateways
|Executed Checks|
|---|
| - Is performance of the Application Gateway degraded?<br> - Is the Application Gateway available?|

## Microsoft.network/azureFirewalls
|Executed Checks|
|---|
| - Are there enough remaining available ports to perform Source NAT?<br> - Are there enough remaining available connections?|

## Microsoft.network/bastionhosts
|Executed Checks|
|---|
| - Is the Bastion Host up and running?|

## Microsoft.network/connections
|Executed Checks|
|---|
| - Is the VPN tunnel connected?<br> - Are there configuration conflicts in the connection?<br> - Are the pre-shared keys properly configured?<br> - Is the VPN on-premises device reachable?<br> - Are there mismatches in the IPSec/IKE security policy?<br> - Is the S2S VPN connection properly provisioned or in a failed state?<br> - Is the VNET-to-VNET connection properly provisioned or in a failed state?|

## Microsoft.network/expressroutecircuits
|Executed Checks|
|---|
| - Is the ExpressRoute circuit healthy?|

## Microsoft.network/frontdoors
|Executed Checks|
|---|
| - Are Front Door backends responding with errors to health probes?<br> - Are configuration changes delayed?|

## Microsoft.network/LoadBalancers
|Executed Checks|
|---|
| - Are the load balancing endpoints available?|


## Microsoft.network/natGateways
|Executed Checks|
|---|
| - Are the NAT gateway endpoints available?|

## Microsoft.network/trafficmanagerprofiles
|Executed Checks|
|---|
| - Are there any issues impacting the Traffic Manager profile?|

## Microsoft.network/virtualNetworkGateways
|Executed Checks|
|---|
| - Is the VPN gateway reachable from the internet?<br> - Is the VPN Gateway in standby mode?<br> - Is the VPN service running on the gateway?|

## Microsoft.network/vpnGateways
VPN Gateways in Virtual WAN
|Executed Checks|
|---|
| - Is the VPN gateway reachable from the internet?<br> - Is the VPN Gateway in standby mode?<br> - Is the VPN service running on the gateway?|

## Microsoft.NotificationHubs/namespace
|Executed Checks|
|---|
| - Can runtime operations like registration, installation, or send be performed on the namespace?|

## Microsoft.operationalinsights/workspaces
|Executed Checks|
|---|
| - Are there indexing delays for the workspace?|

## Microsoft.PowerBIDedicated/Capacities
|Executed Checks|
|---|
| - Is the capacity resource up and running?<br> - Are all the workloads up and running?

## Microsoft.search/searchServices
|Executed Checks|
|---|
| - Can diagnostics operations be performed on the cluster?|

## Microsoft.ServiceBus/namespaces
|Executed Checks|
|---|
| - Are customers experiencing user generated Service Bus errors?<br> - Are users experiencing an increase in transient errors due to a Service Bus namespace upgrade?|

## Microsoft.ServiceFabric/clusters
|Executed Checks|
|---|
| - Is the Service Fabric cluster up and running?<br> - Can the Service Fabric cluster be managed through Azure Resource Manager?|

## Microsoft.SQL/managedInstances/databases
|Executed Checks|
|---|
| - Is the database up and running?|

## Microsoft.SQL/servers/databases
|Executed Checks|
|---|
| - Have login attempts to the database failed because the database was unavailable?|

## Microsoft.Storage/storageAccounts
|Executed Checks|
|---|
| - Are requests to read data from the Storage account failing due to Azure Storage platform issues?<br> - Are requests to write data to the Storage account failing due to Azure Storage platform issues?<br> - Is the Storage cluster where the Storage account resides unavailable?|

## Microsoft.StreamAnalytics/streamingjobs
|Executed Checks|
|---|
| - Are all the hosts where the job is executing up and running?<br> - Was the job unable to start?<br> - Are there ongoing runtime upgrades?<br> - Is the job in an expected state (for example running or stopped by customer)?<br> - Has the job encountered out of memory exceptions?<br> - Are there ongoing scheduled compute updates?<br> - Is the Execution Manager (control plan) available?|

## Microsoft.web/serverFarms
|Executed Checks|
|---|
| - Is the host server up and running?<br> - Is Internet Information Services running?<br> - Is the Load balancer running?<br> - Can the App Service Plan be reached from within the datacenter?<br> - Is the storage account hosting the sites content for the serverFarm  available?|

## Microsoft.web/sites
|Executed Checks|
|---|
| - Is the host server up and running?<br> - Is Internet Information server running?<br> - Is the Load balancer running?<br> - Can the Web App be reached from within the datacenter?<br> - Is the storage account hosting the site content available?|

## Microsoft.RecoveryServices/vaults

| Executed Checks |
| --- |
| - Are any Backup operations on Backup Items configured in this vault failing due to causes beyond user control?<br>- Are any Restore operations on Backup Items configured in this vault failing due to causes beyond user control?|

## Microsoft.VoiceServices/communicationsgateway

| Executed Checks |
| --- |
| - Are traffic-carrying instances running?<br>- Can the service handle calls?|

## Next Steps
-  See [Introduction to Azure Service Health dashboard](service-health-overview.md) and [Introduction to Azure Resource Health](resource-health-overview.md) to understand more about them.
-  [Frequently asked questions about Azure Resource Health](resource-health-faq.yml)
- Set up alerts so you are notified of health issues. For more information, see [Configure Alerts for service health events](./alerts-activity-log-service-notifications-portal.md).

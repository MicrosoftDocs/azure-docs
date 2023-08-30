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
|<ul><li>Is the server up and running?</li><li>Has the server run out of memory?</li><li>Is the server starting up?</li><li>Is the server recovering?</li></ul>|

## Microsoft.ApiManagement/service
|Executed Checks|
|---|
|<ul><li>Is the Api Management service up and running?</li></ul>|

## Microsoft.AppPlatform/Spring
|Executed Checks|
|---|
|<ul><li>Is the Azure Spring Cloud instance available?</li></ul>|

## Microsoft.Batch/batchAccounts
|Executed Checks|
|---|
|<ul><li>Is the Batch account up and running?</li><li>Has the pool quota been exceeded for this batch account?</li></ul>|

## Microsoft.Cache/Redis
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
|<ul><li>Is the server hosting this virtual machine up and running?</li><li>Is the virtual machine container provisioned and powered up?</li><li>Is there network connectivity between the host and the storage account?</li><li>Is there ongoing planned maintenance?</li><li>Is there heartbeats between Guest and host agent *(if Guest extension is installed)*?</li></ul>|

## Microsoft.classiccompute/domainnames
|Executed Checks|
|---|
|<ul><li>Is production slot deployment healthy across all role instances?</li><li>Is the role healthy across all its VM instances?</li><li>What is the health status of each VM within a role of a cloud service?</li><li>Was the VM status change due to platform or customer initiated operation?</li><li>Has the booting of the guest OS completed?</li><li>Is there ongoing planned maintenance?</li><li>Is the host hardware degraded and predicted to fail soon?</li><li>[Learn More](../cloud-services/resource-health-for-cloud-services.md) about Executed Checks</li></ul>|

## Microsoft.cognitiveservices/accounts
|Executed Checks|
|---|
|<ul><li>Can the account be reached from within the datacenter?</li><li>Is the Azure AI services resource provider available?</li><li>Is the Cognitive Service available in the appropriate region?</li><li>Can read operations be performed on the storage account holding the resource metadata?</li><li>Has the API call quota been reached?</li><li>Has the API call read-limit been reached?</li></ul>|

## Microsoft.compute/hostgroups/hosts
|Executed Checks|
|---|
|<ul><li>Is the host up and running?</li><li>Is the host hardware degraded?</li><li>Is the host deallocated?</li><li>Has the host hardware service healed to different hardware?</li></ul>|

## Microsoft.compute/virtualmachines
|Executed Checks|
|---|
|<ul><li>Is the server hosting this virtual machine up and running?</li><li>Is the virtual machine container provisioned and powered up?</li><li>Is there network connectivity between the host and the storage account?</li><li>Is there ongoing planned maintenance?</li><li>Is there heartbeats between Guest and host agent *(if Guest extension is installed)*?</li></ul>|

## Microsoft.compute/virtualmachinescalesets
|Executed Checks|
|---|
|<ul><li>Is the server hosting this virtual machine up and running?</li><li>Is the virtual machine container provisioned and powered up?</li><li>Is there network connectivity between the host and the storage account?</li><li>Is there ongoing planned maintenance?</li><li>Is there heartbeats between Guest and host agent *(if Guest extension is installed)*?</li></ul>|


## Microsoft.ContainerService/managedClusters
|Executed Checks|
|---|
|<ul><li>Is the cluster up and running?</li><li>Are core services available on the cluster?</li><li>Are all cluster nodes ready?</li><li>Is the service principal current and valid?</li></ul>|

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

## Microsoft.DigitalTwins/DigitalTwinsInstances
|Executed Checks|
|---|
|<ul><li>Is the Azure Digital Twins instance up and running?</li></ul>|

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

## Microsoft.HybridCompute/machines
|Executed Checks|
|---|
|<ul><li>Is the agent on your server connected to Azure and sending heartbeats?</li></ul>|

## Microsoft.IoTCentral/IoTApps
|Executed Checks|
|---|
|<ul><li>Is the IoT Central Application available?</li></ul>|

## Microsoft.KeyVault/vaults
|Executed Checks|
|---|
|<ul><li>Are requests to key vault failing due to Azure KeyVault platform issues?</li><li>Are requests to key vault being throttled due to too many requests made by customer?</li></ul>|

## Microsoft.Kusto/clusters
|Executed Checks|
|---|
|<ul><li>Is the cluster experiencing low ingestion success rates?</li><li>Is the cluster experiencing high ingestion latency?</li><li>Is the cluster experiencing a high number of query failures?</li></ul>|

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

## Microsoft.network/azureFirewalls
|Executed Checks|
|---|
|<ul><li>Are there enough remaining available ports to perform Source NAT?</li><li>Are there enough remaining available connections?</li></ul>|

## Microsoft.network/bastionhosts
|Executed Checks|
|---|
|<ul><li>Is the Bastion Host up and running?</li></ul>|

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


## Microsoft.network/natGateways
|Executed Checks|
|---|
|<ul><li>Are the NAT gateway endpoints available?</li></ul>|

## Microsoft.network/trafficmanagerprofiles
|Executed Checks|
|---|
|<ul><li>Are there any issues impacting the Traffic Manager profile?</li></ul>|

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
|<ul><li>Is the capacity resource up and running?</li><li>Are all the workloads up and running?</li></ul>

## Microsoft.search/searchServices
|Executed Checks|
|---|
|<ul><li>Can diagnostics operations be performed on the cluster?</li></ul>|

## Microsoft.ServiceBus/namespaces
|Executed Checks|
|---|
|<ul><li>Are customers experiencing user generated Service Bus errors?</li><li>Are users experiencing an increase in transient errors due to a Service Bus namespace upgrade?</li></ul>|

## Microsoft.ServiceFabric/clusters
|Executed Checks|
|---|
|<ul><li>Is the Service Fabric cluster up and running?</li><li>Can the Service Fabric cluster be managed through Azure Resource Manager?</li></ul>|

## Microsoft.SQL/managedInstances/databases
|Executed Checks|
|---|
|<ul><li>Is the database up and running?</li></ul>|

## Microsoft.SQL/servers/databases
|Executed Checks|
|---|
|<ul><li>Have login attempts to the database failed because the database was unavailable?</li></ul>|

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

## Microsoft.RecoveryServices/vaults

| Executed Checks |
| --- |
|<ul><li>Are any Backup operations on Backup Items configured in this vault failing due to causes beyond user control?</li><li>Are any Restore operations on Backup Items configured in this vault failing due to causes beyond user control?</li></ul> |

## Next Steps
-  See [Introduction to Azure Service Health dashboard](service-health-overview.md) and [Introduction to Azure Resource Health](resource-health-overview.md) to understand more about them.
-  [Frequently asked questions about Azure Resource Health](resource-health-faq.yml)
- Set up alerts so you are notified of health issues. For more information, see [Configure Alerts for service health events](./alerts-activity-log-service-notifications-portal.md).

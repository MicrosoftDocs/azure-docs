---
title: Azure Resource Manager tag support for resources
description: Shows which Azure resource types support tags. Provides details for all Azure services.
author: tfitzmac
ms.service: azure-resource-manager
ms.topic: reference
ms.date: 11/20/2018
ms.author: tomfitz
---

# Tag support for Azure resources
This article describes whether a resource type supports [tagging](resource-group-using-tags.md).

## AAD Domain Services
| Resource type | Supports tags |
| ------------- | ----------- |
| domains | No | 

## AD Hybrid Health Service
| Resource type | Supports tags |
| ------------- | ----------- |
| services | No | 
| addsservices | No | 
| configuration | No | 
| agents | No | 
| aadsupportcases | No | 
| reports | No | 
| servicehealthmetrics | No | 
| logs | No | 
| anonymousapiusers | No | 

## Analysis Services
| Resource type | Supports tags |
| ------------- | ----------- |
| servers | Yes | 

## API Hubs
| Resource type | Supports tags |
| ------------- | ----------- |
| apiManagementAccounts | No | 
| apiManagementAccounts/connectionProviders | No | 
| apiManagementAccounts/connections | No | 
| apiManagementAccounts/connectionAcls | No | 
| apiManagementAccounts/connectionProviderAcls | No | 
| apiManagementAccounts/apis | No | 

## API Management
| Resource type | Supports tags |
| ------------- | ----------- |
| service | Yes | 

## Automation
| Resource type | Supports tags |
| ------------- | ----------- |
| automationAccounts | Yes | 
| automationAccounts/runbooks | Yes | 
| automationAccounts/configurations | Yes | 
| automationAccounts/webhooks | No | 
| automationAccounts/softwareUpdateConfigurations | No | 
| automationAccounts/jobs | No | 

## Batch
| Resource type | Supports tags |
| ------------- | ----------- |
| batchAccounts | Yes | 

## Batch AI
| Resource type | Supports tags |
| ------------- | ----------- |
| clusters | Yes | 
| jobs | Yes | 
| fileservers | Yes | 
| workspaces | Yes | 
| workspaces/clusters | No | 
| workspaces/fileservers | No | 
| workspaces/experiments | No | 
| workspaces/experiments/jobs | No | 

## Bing Maps
| Resource type | Supports tags |
| ------------- | ----------- |
| mapApis | Yes | 

## Biztalk Services
| Resource type | Supports tags |
| ------------- | ----------- |
| BizTalk | Yes | 

## Cache
| Resource type | Supports tags |
| ------------- | ----------- |
| Redis | Yes | 

## CDN
| Resource type | Supports tags |
| ------------- | ----------- |
| profiles | Yes | 
| profiles/endpoints | Yes | 
| profiles/endpoints/origins | No | 
| profiles/endpoints/customdomains | No | 
| validateProbe | No | 
| edgenodes | No | 

## Classic Compute
| Resource type | Supports tags |
| ------------- | ----------- |
| domainNames | No | 
| domainNames/slots | No | 
| domainNames/slots/roles | No | 
| virtualMachines | No | 
| virtualMachines/diagnosticSettings | No | 
| virtualMachines/metricDefinitions | No | 
| virtualMachines/metrics | No | 

## Classic Infrastructure Migrate
| Resource type | Supports tags |
| ------------- | ----------- |
| classicInfrastructureResources | No | 

## Classic Network
| Resource type | Supports tags |
| ------------- | ----------- |
| virtualNetworks | No | 
| virtualNetworks/virtualNetworkPeerings | No | 
| virtualNetworks/remoteVirtualNetworkPeeringProxies | No | 

## Classic Storage
| Resource type | Supports tags |
| ------------- | ----------- |
| storageAccounts/services | No | 
| storageAccounts/services/diagnosticSettings | No | 

## Compute
| Resource type | Supports tags |
| ------------- | ----------- |
| availabilitySets | Yes | 
| virtualMachines | Yes | 
| virtualMachines/extensions | Yes | 
| virtualMachineScaleSets | Yes | 
| virtualMachineScaleSets/extensions | No | 
| virtualMachineScaleSets/virtualMachines | No | 
| virtualMachineScaleSets/networkInterfaces | No | 
| virtualMachineScaleSets/virtualMachines/networkInterfaces | No | 
| virtualMachineScaleSets/publicIPAddresses | No | 
| restorePointCollections | Yes | 
| restorePointCollections/restorePoints | No | 
| virtualMachines/diagnosticSettings | No | 
| virtualMachines/metricDefinitions | No | 
| sharedVMImages | Yes | 
| sharedVMImages/versions | Yes | 
| disks | Yes | 
| snapshots | Yes | 
| images | Yes | 

## Container
| Resource type | Supports tags |
| ------------- | ----------- |
| containerGroups | Yes | 

## Container Instance
| Resource type | Supports tags |
| ------------- | ----------- |
| containerGroups | Yes | 
| serviceAssociationLinks | No | 

## Container Service
| Resource type | Supports tags |
| ------------- | ----------- |
| containerServices | Yes | 

## Cortana Analytics
| Resource type | Supports tags |
| ------------- | ----------- |
| accounts | Yes | 

## Cosmos DB
| Resource type | Supports tags |
| ------------- | ----------- |
| databaseAccounts | Yes | 
| databaseAccountNames | No | 

## Cost Management
| Resource type | Supports tags |
| ------------- | ----------- |
| Connectors | Yes | 

## Data Box Edge
| Resource type | Supports tags |
| ------------- | ----------- |
| DataBoxEdgeDevices | Yes | 

## Data Catalog
| Resource type | Supports tags |
| ------------- | ----------- |
| catalogs | Yes | 

## Data Connect
| Resource type | Supports tags |
| ------------- | ----------- |
| connectionManagers | Yes | 

## Data Factory
| Resource type | Supports tags |
| ------------- | ----------- |
| dataFactories | Yes | 
| factories | Yes | 
| factories/integrationRuntimes | No | 
| dataFactories/diagnosticSettings | No | 
| dataFactories/metricDefinitions | No | 
| dataFactorySchema | No | 

## Devices
| Resource type | Supports tags |
| ------------- | ----------- |
| IotHubs | Yes | 
| IotHubs/eventGridFilters | No | 
| ProvisioningServices | Yes | 

## Devspaces
| Resource type | Supports tags |
| ------------- | ----------- |
| controllers | Yes | 

## Devtest Lab
| Resource type | Supports tags |
| ------------- | ----------- |
| labs | Yes | 
| schedules | Yes | 
| labs/virtualMachines | Yes | 
| labs/serviceRunners | Yes | 

## Dynamics LCS
| Resource type | Supports tags |
| ------------- | ----------- |
| lcsprojects | No | 
| lcsprojects/connectors | No | 
| lcsprojects/clouddeployments | No | 

## Event Grid
| Resource type | Supports tags |
| ------------- | ----------- |
| eventSubscriptions | No | 
| topics | Yes | 
| domains | Yes | 
| domains/topics | No | 
| topicTypes | No | 
| extensionTopics | No | 

## Event Hub
| Resource type | Supports tags |
| ------------- | ----------- |
| namespaces | Yes | 
| clusters | Yes | 

## Hana on Azure
| Resource type | Supports tags |
| ------------- | ----------- |
| hanaInstances | Yes | 

## HDInsight
| Resource type | Supports tags |
| ------------- | ----------- |
| clusters | Yes | 
| clusters/applications | No | 

## Import Export
| Resource type | Supports tags |
| ------------- | ----------- |
| jobs | Yes | 

## Insights
| Resource type | Supports tags |
| ------------- | ----------- |
| components | Yes | 
| components/query | No | 
| components/metrics | No | 
| components/events | No | 
| webtests | Yes | 
| queries | No | 
| scheduledqueryrules | Yes | 
| components/pricingPlans | No | 
| migrateToNewPricingModel | No | 
| rollbackToLegacyPricingModel | No | 
| automatedExportSettings | No | 
| workbooks | Yes | 
| myWorkbooks | No | 
| logs | No | 

## Key Vault
| Resource type | Supports tags |
| ------------- | ----------- |
| vaults | Yes | 
| vaults/secrets | No | 
| vaults/accessPolicies | No | 
| deletedVaults | No | 

## Log Analytics
| Resource type | Supports tags |
| ------------- | ----------- |
| logs | No | 

## Logic
| Resource type | Supports tags |
| ------------- | ----------- |
| workflows | Yes | 
| integrationAccounts | Yes | 

## Machine Learning Services
| Resource type | Supports tags |
| ------------- | ----------- |
| workspaces | Yes | 
| workspaces/computes | No | 

## Managed Identity
| Resource type | Supports tags |
| ------------- | ----------- |
| Identities | No | 
| userAssignedIdentities | Yes | 

## MariaDB
| Resource type | Supports tags |
| ------------- | ----------- |
| servers | Yes | 
| servers/recoverableServers | No | 
| servers/virtualNetworkRules | No | 

## Marketplace Apps
| Resource type | Supports tags |
| ------------- | ----------- |
| classicDevServices | Yes | 

## Marketplace Ordering
| Resource type | Supports tags |
| ------------- | ----------- |
| agreements | No | 
| offertypes | No | 

## Media
| Resource type | Supports tags |
| ------------- | ----------- |
| mediaservices | Yes | 
| mediaservices/assets | No | 
| mediaservices/contentKeyPolicies | No | 
| mediaservices/streamingLocators | No | 
| mediaservices/streamingPolicies | No | 
| mediaservices/eventGridFilters | No | 
| mediaservices/transforms | No | 
| mediaservices/transforms/jobs | No | 
| mediaservices/streamingEndpoints | Yes | 
| mediaservices/liveEvents | Yes | 
| mediaservices/liveEvents/liveOutputs | No | 
| mediaservices/streamingEndpointOperations | No | 
| mediaservices/liveEventOperations | No | 
| mediaservices/liveOutputOperations | No | 
| mediaservices/assets/assetFilters | No | 
| mediaservices/accountFilters | No | 

## MySQL
| Resource type | Supports tags |
| ------------- | ----------- |
| servers | Yes | 
| servers/recoverableServers | No | 
| servers/virtualNetworkRules | No | 

## Network
| Resource type | Supports tags |
| ------------- | ----------- |
| virtualNetworks | Yes | 
| publicIPAddresses | Yes | 
| networkInterfaces | Yes | 
| interfaceEndpoints | Yes | 
| loadBalancers | Yes | 
| networkSecurityGroups | Yes | 
| applicationSecurityGroups | Yes | 
| serviceEndpointPolicies | Yes | 
| networkIntentPolicies | Yes | 
| routeTables | Yes | 
| publicIPPrefixes | Yes | 
| networkWatchers | Yes | 
| networkWatchers/connectionMonitors | Yes | 
| networkWatchers/lenses | Yes | 
| networkWatchers/pingMeshes | Yes | 
| virtualNetworkGateways | Yes | 
| localNetworkGateways | Yes | 
| connections | Yes | 
| applicationGateways | Yes | 
| expressRouteCircuits | Yes | 
| routeFilters | Yes | 
| virtualWans | Yes | 
| vpnSites | Yes | 
| virtualHubs | Yes | 
| vpnGateways | Yes | 
| azureFirewalls | Yes | 
| virtualNetworkTaps | Yes | 
| privateLinkServices | Yes | 
| ddosProtectionPlans | Yes | 
| networkProfiles | Yes | 
| frontdoors | Yes | 
| frontdoorWebApplicationFirewallPolicies | Yes | 
| webApplicationFirewallPolicies | Yes | 

## Notification Hubs
| Resource type | Supports tags |
| ------------- | ----------- |
| namespaces | Yes | 
| namespaces/notificationHubs | Yes | 

## Portal
| Resource type | Supports tags |
| ------------- | ----------- |
| dashboards | Yes | 

## Portal SDK
| Resource type | Supports tags |
| ------------- | ----------- |
| rootResources | Yes | 

## PostgreSQL
| Resource type | Supports tags |
| ------------- | ----------- |
| servers | Yes | 
| servers/recoverableServers | No | 
| servers/virtualNetworkRules | No | 
| servers/topQueryStatistics | No | 
| servers/queryTexts | No | 
| servers/waitStatistics | No | 
| servers/advisors | No | 

## Power BI
| Resource type | Supports tags |
| ------------- | ----------- |
| workspaceCollections | Yes | 

## Recovery Services
| Resource type | Supports tags |
| ------------- | ----------- |
| vaults | Yes | 
| backupProtectedItems | No | 

## Relay
| Resource type | Supports tags |
| ------------- | ----------- |
| namespaces | Yes | 

## Resources
| Resource type | Supports tags |
| ------------- | ----------- |
| resourceGroups | Yes | 
| subscriptions/resourceGroups | Yes | 

## Scheduler
| Resource type | Supports tags |
| ------------- | ----------- |
| jobcollections | Yes | 
| flows | Yes | 

## Search
| Resource type | Supports tags |
| ------------- | ----------- |
| searchServices | Yes | 
| resourceHealthMetadata | No | 

## Security
| Resource type | Supports tags |
| ------------- | ----------- |
| dataCollectionAgents | No | 

## Service Bus
| Resource type | Supports tags |
| ------------- | ----------- |
| namespaces | Yes | 
| namespaces/eventgridfilters | No | 

## Service Fabric
| Resource type | Supports tags |
| ------------- | ----------- |
| clusters | Yes | 
| clusters/applications | No | 

## Service Fabric Mesh
| Resource type | Supports tags |
| ------------- | ----------- |
| applications | Yes | 
| networks | Yes | 
| volumes | Yes | 

## SignalR Service
| Resource type | Supports tags |
| ------------- | ----------- |
| SignalR | Yes | 

## Site Recovery
| Resource type | Supports tags |
| ------------- | ----------- |
| SiteRecoveryVault | Yes | 

## Solutions
| Resource type | Supports tags |
| ------------- | ----------- |
| applications | Yes | 
| applicationDefinitions | Yes | 
| jitRequests | Yes | 

## SQL virtual machine
| Resource type | Supports tags |
| ------------- | ----------- |
| DWVM | Yes | 

## Storage
| Resource type | Supports tags |
| ------------- | ----------- |
| storageAccounts | Yes | 
| storageAccounts/blobServices | No | 
| storageAccounts/tableServices | No | 
| storageAccounts/queueServices | No | 
| storageAccounts/fileServices | No | 
| storageAccounts/services | No | 
| storageAccounts/services/metricDefinitions | No | 

## Storage Sync
| Resource type | Supports tags |
| ------------- | ----------- |
| storageSyncServices | Yes | 
| storageSyncServices/syncGroups | No | 
| storageSyncServices/syncGroups/cloudEndpoints | No | 
| storageSyncServices/syncGroups/serverEndpoints | No | 
| storageSyncServices/registeredServers | No | 
| storageSyncServices/workflows | No | 

## Storsimple
| Resource type | Supports tags |
| ------------- | ----------- |
| managers | Yes | 

## Stream Analytics
| Resource type | Supports tags |
| ------------- | ----------- |
| streamingjobs | Yes | 
| streamingjobs/diagnosticSettings | No | 
| streamingjobs/metricDefinitions | No | 

## Subscription
| Resource type | Supports tags |
| ------------- | ----------- |
| SubscriptionDefinitions | No | 
| SubscriptionOperations | No | 

## Support
| Resource type | Supports tags |
| ------------- | ----------- |
| supporttickets | No | 

## Visual Studio
| Resource type | Supports tags |
| ------------- | ----------- |
| account | Yes | 
| account/project | Yes | 
| account/extension | Yes | 
| account | Yes | 
| account/project | Yes | 
| account/extension | Yes | 

## Web
| Resource type | Supports tags |
| ------------- | ----------- |
| sites/instances | No | 
| sites/slots/instances | No | 
| sites/instances/extensions | No | 
| sites/slots/instances/extensions | No | 
| publishingUsers | No | 
| validate | No | 
| sourceControls | No | 
| sites/hostNameBindings | No | 
| sites/domainOwnershipIdentifiers | No | 
| sites/slots/hostNameBindings | No | 
| certificates | Yes | 
| serverFarms | Yes | 
| serverFarms/workers | No | 
| sites | Yes | 
| sites/slots | Yes | 
| sites/metrics | No | 
| sites/slots/metrics | No | 
| sites/premieraddons | Yes | 
| hostingEnvironments | Yes | 
| hostingEnvironments/multiRolePools | No | 
| hostingEnvironments/workerPools | No | 
| hostingEnvironments/metrics | No | 
| functions | No | 
| deletedSites | No | 
| apiManagementAccounts | No | 
| apiManagementAccounts/connections | No | 
| apiManagementAccounts/connectionAcls | No | 
| apiManagementAccounts/apis/connections/connectionAcls | No | 
| apiManagementAccounts/apis/connectionAcls | No | 
| apiManagementAccounts/apiAcls | No | 
| apiManagementAccounts/apis/apiAcls | No | 
| apiManagementAccounts/apis | No | 
| apiManagementAccounts/apis/localizedDefinitions | No | 
| apiManagementAccounts/apis/connections | No | 
| connections | Yes | 
| customApis | Yes | 
| connectionGateways | Yes | 
| billingMeters | No | 
| verifyHostingEnvironmentVnet | No | 

## XRM
| Resource type | Supports tags |
| ------------- | ----------- |
| organizations | No | 

## Next steps
To learn how to apply tags to resources, see [Use tags to organize your Azure resources](resource-group-using-tags.md).

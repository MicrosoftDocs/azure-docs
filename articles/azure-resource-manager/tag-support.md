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

## MICROSOFT.AADDOMAINSERVICES
| Resource type | Supports tags |
| ------------- | ----------- |
| domains | No | 

## MICROSOFT.ADHYBRIDHEALTHSERVICE
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

## MICROSOFT.ANALYSISSERVICES
| Resource type | Supports tags |
| ------------- | ----------- |
| servers | Yes | 

## MICROSOFT.APIHUBS
| Resource type | Supports tags |
| ------------- | ----------- |
| apiManagementAccounts | No | 
| apiManagementAccounts/connectionProviders | No | 
| apiManagementAccounts/connections | No | 
| apiManagementAccounts/connectionAcls | No | 
| apiManagementAccounts/connectionProviderAcls | No | 
| apiManagementAccounts/apis | No | 

## MICROSOFT.APIMANAGEMENT
| Resource type | Supports tags |
| ------------- | ----------- |
| service | Yes | 

## MICROSOFT.AUTOMATION
| Resource type | Supports tags |
| ------------- | ----------- |
| automationAccounts | Yes | 
| automationAccounts/runbooks | Yes | 
| automationAccounts/configurations | Yes | 
| automationAccounts/webhooks | No | 
| automationAccounts/softwareUpdateConfigurations | No | 
| automationAccounts/jobs | No | 

## MICROSOFT.BATCH
| Resource type | Supports tags |
| ------------- | ----------- |
| batchAccounts | Yes | 

## MICROSOFT.COMPUTE
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

## MICROSOFT.CONTAINER
| Resource type | Supports tags |
| ------------- | ----------- |
| containerGroups | Yes | 

## MICROSOFT.CONTAINERINSTANCE
| Resource type | Supports tags |
| ------------- | ----------- |
| containerGroups | Yes | 
| serviceAssociationLinks | No | 

## MICROSOFT.CONTAINERSERVICE
| Resource type | Supports tags |
| ------------- | ----------- |
| containerServices | Yes | 

## MICROSOFT.CORTANAANALYTICS
| Resource type | Supports tags |
| ------------- | ----------- |
| accounts | Yes | 

## MICROSOFT.COSTMANAGEMENT
| Resource type | Supports tags |
| ------------- | ----------- |
| Connectors | Yes | 

## MICROSOFT.DATABOXEDGE
| Resource type | Supports tags |
| ------------- | ----------- |
| DataBoxEdgeDevices | Yes | 
| DataBoxEdgeDevices/checkNameAvailability | No | 

## MICROSOFT.DATACATALOG
| Resource type | Supports tags |
| ------------- | ----------- |
| catalogs | Yes | 

## MICROSOFT.DATACONNECT
| Resource type | Supports tags |
| ------------- | ----------- |
| connectionManagers | Yes | 

## MICROSOFT.DATAFACTORY
| Resource type | Supports tags |
| ------------- | ----------- |
| dataFactories | Yes | 
| factories | Yes | 
| factories/integrationRuntimes | No | 
| dataFactories/diagnosticSettings | No | 
| dataFactories/metricDefinitions | No | 
| dataFactorySchema | No | 

## MICROSOFT.STORSIMPLE
| Resource type | Supports tags |
| ------------- | ----------- |
| managers | Yes | 

## MICROSOFT.STREAMANALYTICS
| Resource type | Supports tags |
| ------------- | ----------- |
| streamingjobs | Yes | 
| streamingjobs/diagnosticSettings | No | 
| streamingjobs/metricDefinitions | No | 

## MICROSOFT.SUBSCRIPTION
| Resource type | Supports tags |
| ------------- | ----------- |
| SubscriptionDefinitions | No | 
| SubscriptionOperations | No | 

## MICROSOFT.SUPPORT
| Resource type | Supports tags |
| ------------- | ----------- |
| supporttickets | No | 

## MICROSOFT.VISUALSTUDIO
| Resource type | Supports tags |
| ------------- | ----------- |
| account | Yes | 
| account/project | Yes | 
| account/extension | Yes | 

## MICROSOFT.WEB
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

## MICROSOFT.XRM
| Resource type | Supports tags |
| ------------- | ----------- |
| organizations | No | 

## MICROSOFT.NETWORK
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

## MICROSOFT.NOTIFICATIONHUBS
| Resource type | Supports tags |
| ------------- | ----------- |
| namespaces | Yes | 
| namespaces/notificationHubs | Yes | 

## MICROSOFT.PORTAL
| Resource type | Supports tags |
| ------------- | ----------- |
| dashboards | Yes | 

## MICROSOFT.PORTALSDK
| Resource type | Supports tags |
| ------------- | ----------- |
| rootResources | Yes | 

## MICROSOFT.POWERBI
| Resource type | Supports tags |
| ------------- | ----------- |
| workspaceCollections | Yes | 

## MICROSOFT.PROJECTOXFORD
| Resource type | Supports tags |
| ------------- | ----------- |
| accounts | Yes | 

## MICROSOFT.RECOVERYSERVICES
| Resource type | Supports tags |
| ------------- | ----------- |
| vaults | Yes | 
| backupProtectedItems | No | 

## MICROSOFT.RELAY
| Resource type | Supports tags |
| ------------- | ----------- |
| namespaces | Yes | 

## MICROSOFT.RESOURCES
| Resource type | Supports tags |
| ------------- | ----------- |
| resourceGroups | No | 
| subscriptions/resourceGroups | No | 

## MICROSOFT.SCHEDULER
| Resource type | Supports tags |
| ------------- | ----------- |
| jobcollections | Yes | 
| flows | Yes | 

## MICROSOFT.SEARCH
| Resource type | Supports tags |
| ------------- | ----------- |
| searchServices | Yes | 
| resourceHealthMetadata | No | 

## MICROSOFT.SECURITY
| Resource type | Supports tags |
| ------------- | ----------- |
| dataCollectionAgents | No | 

## MICROSOFT.SERVICEBUS
| Resource type | Supports tags |
| ------------- | ----------- |
| namespaces | Yes | 
| namespaces/eventgridfilters | No | 

## MICROSOFT.SERVICEFABRIC
| Resource type | Supports tags |
| ------------- | ----------- |
| clusters | Yes | 
| clusters/applications | No | 

## MICROSOFT.SERVICEFABRICMESH
| Resource type | Supports tags |
| ------------- | ----------- |
| applications | Yes | 
| networks | Yes | 
| volumes | Yes | 

## MICROSOFT.SIGNALRSERVICE
| Resource type | Supports tags |
| ------------- | ----------- |
| SignalR | Yes | 

## MICROSOFT.SITERECOVERY
| Resource type | Supports tags |
| ------------- | ----------- |
| SiteRecoveryVault | Yes | 

## MICROSOFT.SOLUTIONS
| Resource type | Supports tags |
| ------------- | ----------- |
| applications | Yes | 
| applicationDefinitions | Yes | 
| jitRequests | Yes | 

## MICROSOFT.BATCHAI
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

## MICROSOFT.BINGMAPS
| Resource type | Supports tags |
| ------------- | ----------- |
| mapApis | Yes | 

## MICROSOFT.BIZTALKSERVICES
| Resource type | Supports tags |
| ------------- | ----------- |
| BizTalk | Yes | 

## MICROSOFT.CACHE
| Resource type | Supports tags |
| ------------- | ----------- |
| Redis | Yes | 

## MICROSOFT.CDN
| Resource type | Supports tags |
| ------------- | ----------- |
| profiles | Yes | 
| profiles/endpoints | Yes | 
| profiles/endpoints/origins | No | 
| profiles/endpoints/customdomains | No | 
| validateProbe | No | 
| edgenodes | No | 

## MICROSOFT.CLASSICCOMPUTE
| Resource type | Supports tags |
| ------------- | ----------- |
| domainNames | No | 
| domainNames/slots | No | 
| domainNames/slots/roles | No | 
| virtualMachines | No | 
| virtualMachines/diagnosticSettings | No | 
| virtualMachines/metricDefinitions | No | 
| virtualMachines/metrics | No | 

## MICROSOFT.CLASSICNETWORK
| Resource type | Supports tags |
| ------------- | ----------- |
| virtualNetworks | No | 
| virtualNetworks/virtualNetworkPeerings | No | 
| virtualNetworks/remoteVirtualNetworkPeeringProxies | No | 

## MICROSOFT.CLASSICSTORAGE
| Resource type | Supports tags |
| ------------- | ----------- |
| storageAccounts/services | No | 
| storageAccounts/services/diagnosticSettings | No | 

## MICROSOFT.CLASSICINFRASTRUCTUREMIGRATE
| Resource type | Supports tags |
| ------------- | ----------- |
| classicInfrastructureResources | No | 

## MICROSOFT.DBFORMARIADB
| Resource type | Supports tags |
| ------------- | ----------- |
| servers | Yes | 
| servers/recoverableServers | No | 
| servers/virtualNetworkRules | No | 

## MICROSOFT.DBFORMYSQL
| Resource type | Supports tags |
| ------------- | ----------- |
| servers | Yes | 
| servers/recoverableServers | No | 
| servers/virtualNetworkRules | No | 

## MICROSOFT.DBFORPOSTGRESQL
| Resource type | Supports tags |
| ------------- | ----------- |
| servers | Yes | 
| servers/recoverableServers | No | 
| servers/virtualNetworkRules | No | 
| servers/topQueryStatistics | No | 
| servers/queryTexts | No | 
| servers/waitStatistics | No | 
| servers/advisors | No | 

## MICROSOFT.DEVICES
| Resource type | Supports tags |
| ------------- | ----------- |
| IotHubs | Yes | 
| IotHubs/eventGridFilters | No | 
| ProvisioningServices | Yes | 

## MICROSOFT.DEVSPACES
| Resource type | Supports tags |
| ------------- | ----------- |
| controllers | Yes | 

## MICROSOFT.DEVTESTLAB
| Resource type | Supports tags |
| ------------- | ----------- |
| labs | Yes | 
| schedules | Yes | 
| labs/virtualMachines | Yes | 
| labs/serviceRunners | Yes | 

## MICROSOFT.DOCUMENTDB
| Resource type | Supports tags |
| ------------- | ----------- |
| databaseAccounts | Yes | 
| databaseAccountNames | No | 

## MICROSOFT.DYNAMICSLCS
| Resource type | Supports tags |
| ------------- | ----------- |
| lcsprojects | No | 
| lcsprojects/connectors | No | 
| lcsprojects/clouddeployments | No | 

## MICROSOFT.EVENTGRID
| Resource type | Supports tags |
| ------------- | ----------- |
| eventSubscriptions | No | 
| topics | Yes | 
| domains | Yes | 
| domains/topics | No | 
| topicTypes | No | 
| extensionTopics | No | 

## MICROSOFT.EVENTHUB
| Resource type | Supports tags |
| ------------- | ----------- |
| namespaces | Yes | 
| clusters | Yes | 

## MICROSOFT.HANAONAZURE
| Resource type | Supports tags |
| ------------- | ----------- |
| hanaInstances | Yes | 

## MICROSOFT.HDINSIGHT
| Resource type | Supports tags |
| ------------- | ----------- |
| clusters | Yes | 
| clusters/applications | No | 

## MICROSOFT.IMPORTEXPORT
| Resource type | Supports tags |
| ------------- | ----------- |
| jobs | Yes | 

## MICROSOFT.INSIGHTS
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

## MICROSOFT.KEYVAULT
| Resource type | Supports tags |
| ------------- | ----------- |
| vaults | Yes | 
| vaults/secrets | No | 
| vaults/accessPolicies | No | 
| deletedVaults | No | 

## MICROSOFT.LOGANALYTICS
| Resource type | Supports tags |
| ------------- | ----------- |
| logs | No | 

## MICROSOFT.LOGIC
| Resource type | Supports tags |
| ------------- | ----------- |
| workflows | Yes | 
| integrationAccounts | Yes | 

## MICROSOFT.MACHINELEARNINGSERVICES
| Resource type | Supports tags |
| ------------- | ----------- |
| workspaces | Yes | 
| workspaces/computes | No | 

## MICROSOFT.MANAGEDIDENTITY
| Resource type | Supports tags |
| ------------- | ----------- |
| Identities | No | 
| userAssignedIdentities | Yes | 

## MICROSOFT.MARKETPLACEAPPS
| Resource type | Supports tags |
| ------------- | ----------- |
| classicDevServices | Yes | 

## MICROSOFT.MARKETPLACEORDERING
| Resource type | Supports tags |
| ------------- | ----------- |
| agreements | No | 
| offertypes | No | 

## MICROSOFT.MEDIA
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

## MICROSOFT.SQLVM
| Resource type | Supports tags |
| ------------- | ----------- |
| DWVM | Yes | 

## MICROSOFT.STORAGE
| Resource type | Supports tags |
| ------------- | ----------- |
| storageAccounts | Yes | 
| storageAccounts/blobServices | No | 
| storageAccounts/tableServices | No | 
| storageAccounts/queueServices | No | 
| storageAccounts/fileServices | No | 
| storageAccounts/services | No | 
| storageAccounts/services/metricDefinitions | No | 

## MICROSOFT.STORAGESYNC
| Resource type | Supports tags |
| ------------- | ----------- |
| storageSyncServices | Yes | 
| storageSyncServices/syncGroups | No | 
| storageSyncServices/syncGroups/cloudEndpoints | No | 
| storageSyncServices/syncGroups/serverEndpoints | No | 
| storageSyncServices/registeredServers | No | 
| storageSyncServices/workflows | No | 

## MICROSOFT.COSTMANAGEMENT
| Resource type | Supports tags |
| ------------- | ----------- |
| Connectors | Yes | 

## MICROSOFT.CONTAINERSERVICE
| Resource type | Supports tags |
| ------------- | ----------- |
| containerServices | Yes | 

## MICROSOFT.PORTAL
| Resource type | Supports tags |
| ------------- | ----------- |
| dashboards | Yes | 

## MICROSOFT.VISUALSTUDIO
| Resource type | Supports tags |
| ------------- | ----------- |
| account | Yes | 
| account/project | Yes | 
| account/extension | Yes | 
| account | Yes | 
| account/project | Yes | 
| account/extension | Yes | 

## MICROSOFT.SECURITY
| Resource type | Supports tags |
| ------------- | ----------- |
| dataCollectionAgents | No | 

## Next steps
To learn how to apply tags to resources, see [Use tags to organize your Azure resources](resource-group-using-tags.md).

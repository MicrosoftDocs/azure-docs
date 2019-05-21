---
title: Azure Resource Manager tag support for resources
description: Shows which Azure resource types support tags. Provides details for all Azure services.
author: tfitzmac
ms.service: azure-resource-manager
ms.topic: reference
ms.date: 02/13/2019
ms.author: tomfitz
---

# Tag support for Azure resources
This article describes whether a resource type supports [tags](resource-group-using-tags.md).

To get the same data as a file of comma-separated values, download [tag-support.csv](https://github.com/tfitzmac/resource-capabilities/blob/master/tag-support.csv).

## Microsoft.AAD
| Resource type | Supports tags |
| ------------- | ----------- |
| DomainServices | Yes | 
| DomainServices/oucontainer | No | 

## microsoft.aadiam
| Resource type | Supports tags |
| ------------- | ----------- |
| diagnosticSettings | No | 
| diagnosticSettingsCategories | No | 

## Microsoft.Addons
| Resource type | Supports tags |
| ------------- | ----------- |
| supportProviders | No | 

## Microsoft.ADHybridHealthService
| Resource type | Supports tags |
| ------------- | ----------- |
| aadsupportcases | No | 
| addsservices | No | 
| agents | No | 
| anonymousapiusers | No | 
| configuration | No | 
| logs | No | 
| reports | No | 
| services | No | 

## Microsoft.Advisor
| Resource type | Supports tags |
| ------------- | ----------- |
| configurations | No | 
| generateRecommendations | No | 
| recommendations | No | 
| suppressions | No | 

## Microsoft.AlertsManagement
| Resource type | Supports tags |
| ------------- | ----------- |
| actionRules | No | 
| alerts | No | 
| alertsList | No | 
| alertsSummary | No | 
| alertsSummaryList | No | 
| smartDetectorAlertRules | No | 
| smartDetectorRuntimeEnvironments | No | 
| smartGroups | No | 

## Microsoft.AnalysisServices
| Resource type | Supports tags |
| ------------- | ----------- |
| servers | Yes | 

## Microsoft.ApiManagement
| Resource type | Supports tags |
| ------------- | ----------- |
| reportFeedback | No | 
| service | Yes | 
| validateServiceName | No | 

## Microsoft.Attestation
| Resource type | Supports tags |
| ------------- | ----------- |
| attestationProviders | No | 

## Microsoft.Authorization
| Resource type | Supports tags |
| ------------- | ----------- |
| classicAdministrators | No | 
| denyAssignments | No | 
| elevateAccess | No | 
| locks | No | 
| permissions | No | 
| policyAssignments | No | 
| policyDefinitions | No | 
| policySetDefinitions | No | 
| providerOperations | No | 
| roleAssignments | No | 
| roleDefinitions | No | 

## Microsoft.Automation
| Resource type | Supports tags |
| ------------- | ----------- |
| automationAccounts | Yes | 
| automationAccounts/configurations | Yes | 
| automationAccounts/jobs | No | 
| automationAccounts/runbooks | Yes | 
| automationAccounts/softwareUpdateConfigurations | No | 
| automationAccounts/webhooks | No | 

## Microsoft.Azure.Geneva
| Resource type | Supports tags |
| ------------- | ----------- |
| environments | No | 
| environments/accounts | No | 
| environments/accounts/namespaces | No | 
| environments/accounts/namespaces/configurations | No | 

## Microsoft.AzureActiveDirectory
| Resource type | Supports tags |
| ------------- | ----------- |
| b2cDirectories | Yes | 

## Microsoft.AzureStack
| Resource type | Supports tags |
| ------------- | ----------- |
| registrations | Yes | 
| registrations/customerSubscriptions | No | 
| registrations/products | No | 

## Microsoft.Batch
| Resource type | Supports tags |
| ------------- | ----------- |
| batchAccounts | Yes | 

## Microsoft.Billing
| Resource type | Supports tags |
| ------------- | ----------- |
| billingAccounts | No | 
| billingAccounts/billingProfiles | No | 
| billingAccounts/billingProfiles/billingSubscriptions | No | 
| billingAccounts/billingProfiles/invoices | No | 
| billingAccounts/billingProfiles/invoices/pricesheet | No | 
| billingAccounts/billingProfiles/operationStatus | No | 
| billingAccounts/billingProfiles/paymentMethods | No | 
| billingAccounts/billingProfiles/policies | No | 
| billingAccounts/billingProfiles/pricesheet | No | 
| billingAccounts/billingProfiles/products | No | 
| billingAccounts/billingProfiles/transactions | No | 
| billingAccounts/billingSubscriptions | No | 
| billingAccounts/departments | No | 
| billingAccounts/eligibleOffers | No | 
| billingAccounts/enrollmentAccounts | No | 
| billingAccounts/invoices | No | 
| billingAccounts/invoiceSections | No | 
| billingAccounts/invoiceSections/billingSubscriptions | No | 
| billingAccounts/invoiceSections/billingSubscriptions/transfer | No | 
| billingAccounts/invoiceSections/importRequests | No | 
| billingAccounts/invoiceSections/initiateImportRequest | No | 
| billingAccounts/invoiceSections/initiateTransfer | No | 
| billingAccounts/invoiceSections/operationStatus | No | 
| billingAccounts/invoiceSections/products | No | 
| billingAccounts/invoiceSections/transfers | No | 
| billingAccounts/products | No | 
| billingAccounts/projects | No | 
| billingAccounts/projects/billingSubscriptions | No | 
| billingAccounts/projects/importRequests | No | 
| billingAccounts/projects/initiateImportRequest | No | 
| billingAccounts/projects/operationStatus | No | 
| billingAccounts/projects/products | No | 
| billingAccounts/transactions | No | 
| billingPeriods | No | 
| BillingPermissions | No | 
| billingProperty | No | 
| BillingRoleAssignments | No | 
| BillingRoleDefinitions | No | 
| CreateBillingRoleAssignment | No | 
| departments | No | 
| enrollmentAccounts | No | 
| importRequests | No | 
| importRequests/acceptImportRequest | No | 
| importRequests/declineImportRequest | No | 
| invoices | No | 
| transfers | No | 
| transfers/acceptTransfer | No | 
| transfers/declineTransfer | No | 
| transfers/operationStatus | No | 
| usagePlans | No | 

## Microsoft.BingMaps
| Resource type | Supports tags |
| ------------- | ----------- |
| mapApis | Yes | 
| updateCommunicationPreference | No | 

## Microsoft.BizTalkServices
| Resource type | Supports tags |
| ------------- | ----------- |
| BizTalk | Yes | 

## Microsoft.Blueprint
| Resource type | Supports tags |
| ------------- | ----------- |
| blueprintAssignments | No | 
| blueprintAssignments/assignmentOperations | No | 
| blueprintAssignments/operations | No | 
| blueprints | No | 
| blueprints/artifacts | No | 
| blueprints/versions | No | 
| blueprints/versions/artifacts | No | 

## Microsoft.BotService
| Resource type | Supports tags |
| ------------- | ----------- |
| botServices | Yes | 
| botServices/channels | No | 
| botServices/connections | No | 

## Microsoft.Cache
| Resource type | Supports tags |
| ------------- | ----------- |
| Redis | Yes | 
| RedisConfigDefinition | No | 

## Microsoft.Capacity
| Resource type | Supports tags |
| ------------- | ----------- |
| appliedReservations | No | 
| calculatePrice | No | 
| catalogs | No | 
| commercialReservationOrders | No | 
| reservationOrders | No | 
| reservationOrders/calculateRefund | No | 
| reservationOrders/merge | No | 
| reservationOrders/reservations | No | 
| reservationOrders/reservations/revisions | No | 
| reservationOrders/return | No | 
| reservationOrders/split | No | 
| reservationOrders/swap | No | 
| reservations | No | 
| resources | No | 
| validateReservationOrder | No | 

## Microsoft.Cdn
| Resource type | Supports tags |
| ------------- | ----------- |
| edgenodes | No | 
| profiles | Yes | 
| profiles/endpoints | Yes | 
| profiles/endpoints/customdomains | No | 
| profiles/endpoints/origins | No | 
| validateProbe | No | 

## Microsoft.CertificateRegistration
| Resource type | Supports tags |
| ------------- | ----------- |
| certificateOrders | Yes | 
| certificateOrders/certificates | No | 
| validateCertificateRegistrationInformation | No | 

## Microsoft.ClassicCompute
| Resource type | Supports tags |
| ------------- | ----------- |
| capabilities | No | 
| domainNames | No | 
| domainNames/capabilities | No | 
| domainNames/internalLoadBalancers | No | 
| domainNames/serviceCertificates | No | 
| domainNames/slots | No | 
| domainNames/slots/roles | No | 
| moveSubscriptionResources | No | 
| operatingSystemFamilies | No | 
| operatingSystems | No | 
| quotas | No | 
| resourceTypes | No | 
| validateSubscriptionMoveAvailability | No | 
| virtualMachines | No | 
| virtualMachines/diagnosticSettings | No | 

## Microsoft.ClassicInfrastructureMigrate
| Resource type | Supports tags |
| ------------- | ----------- |
| classicInfrastructureResources | No | 

## Microsoft.ClassicNetwork
| Resource type | Supports tags |
| ------------- | ----------- |
| capabilities | No | 
| expressRouteCrossConnections | No | 
| expressRouteCrossConnections/peerings | No | 
| gatewaySupportedDevices | No | 
| networkSecurityGroups | No | 
| quotas | No | 
| reservedIps | No | 
| virtualNetworks | No | 
| virtualNetworks/remoteVirtualNetworkPeeringProxies | No | 
| virtualNetworks/virtualNetworkPeerings | No | 

## Microsoft.ClassicStorage
| Resource type | Supports tags |
| ------------- | ----------- |
| capabilities | No | 
| disks | No | 
| images | No | 
| osImages | No | 
| osPlatformImages | No | 
| publicImages | No | 
| quotas | No | 
| storageAccounts | No | 
| storageAccounts/services | No | 
| storageAccounts/services/diagnosticSettings | No | 
| storageAccounts/vmImages | No | 
| vmImages | No | 

## Microsoft.CognitiveServices
| Resource type | Supports tags |
| ------------- | ----------- |
| accounts | Yes | 

## Microsoft.Commerce
| Resource type | Supports tags |
| ------------- | ----------- |
| RateCard | No | 
| UsageAggregates | No | 

## Microsoft.Compute
| Resource type | Supports tags |
| ------------- | ----------- |
| availabilitySets | Yes | 
| disks | Yes | 
| images | Yes | 
| restorePointCollections | Yes | 
| restorePointCollections/restorePoints | No | 
| sharedVMImages | Yes | 
| sharedVMImages/versions | Yes | 
| snapshots | Yes | 
| virtualMachines | Yes | 
| virtualMachines/diagnosticSettings | No | 
| virtualMachines/extensions | Yes | 
| virtualMachineScaleSets | Yes | 
| virtualMachineScaleSets/extensions | No | 
| virtualMachineScaleSets/networkInterfaces | No | 
| virtualMachineScaleSets/publicIPAddresses | No | 
| virtualMachineScaleSets/virtualMachines | No | 
| virtualMachineScaleSets/virtualMachines/networkInterfaces | No | 

## Microsoft.Consumption
| Resource type | Supports tags |
| ------------- | ----------- |
| AggregatedCost | No | 
| Balances | No | 
| Budgets | No | 
| Charges | No | 
| CostTags | No | 
| credits | No | 
| events | No | 
| Forecasts | No | 
| lots | No | 
| Marketplaces | No | 
| Pricesheets | No | 
| products | No | 
| ReservationDetails | No | 
| ReservationRecommendations | No | 
| ReservationSummaries | No | 
| ReservationTransactions | No | 
| Tags | No | 
| Terms | No | 
| UsageDetails | No | 

## Microsoft.ContainerInstance
| Resource type | Supports tags |
| ------------- | ----------- |
| containerGroups | Yes | 
| serviceAssociationLinks | No | 

## Microsoft.ContainerRegistry
| Resource type | Supports tags |
| ------------- | ----------- |
| registries | Yes | 
| registries/builds | No | 
| registries/builds/cancel | No | 
| registries/builds/getLogLink | No | 
| registries/buildTasks | Yes | 
| registries/buildTasks/steps | No | 
| registries/eventGridFilters | No | 
| registries/getBuildSourceUploadUrl | No | 
| registries/GetCredentials | No | 
| registries/importImage | No | 
| registries/queueBuild | No | 
| registries/regenerateCredential | No | 
| registries/regenerateCredentials | No | 
| registries/replications | Yes | 
| registries/runs | No | 
| registries/runs/cancel | No | 
| registries/scheduleRun | No | 
| registries/tasks | Yes | 
| registries/updatePolicies | No | 
| registries/webhooks | Yes | 
| registries/webhooks/getCallbackConfig | No | 
| registries/webhooks/ping | No | 

## Microsoft.ContainerService
| Resource type | Supports tags |
| ------------- | ----------- |
| containerServices | Yes | 
| managedClusters | Yes | 

## Microsoft.ContentModerator
| Resource type | Supports tags |
| ------------- | ----------- |
| applications | Yes | 
| updateCommunicationPreference | No | 

## Microsoft.CortanaAnalytics
| Resource type | Supports tags |
| ------------- | ----------- |
| accounts | Yes | 

## Microsoft.CostManagement
| Resource type | Supports tags |
| ------------- | ----------- |
| Alerts | No | 
| BillingAccounts | No | 
| Connectors | Yes | 
| Departments | No | 
| Dimensions | No | 
| EnrollmentAccounts | No | 
| Query | No | 
| register | No | 
| Reportconfigs | No | 
| Reports | No | 

## Microsoft.CustomerInsights
| Resource type | Supports tags |
| ------------- | ----------- |
| hubs | Yes | 
| hubs/authorizationPolicies | No | 
| hubs/connectors | No | 
| hubs/connectors/mappings | No | 
| hubs/interactions | No | 
| hubs/kpi | No | 
| hubs/links | No | 
| hubs/profiles | No | 
| hubs/roleAssignments | No | 
| hubs/roles | No | 
| hubs/suggestTypeSchema | No | 
| hubs/views | No | 
| hubs/widgetTypes | No | 

## Microsoft.DataBox
| Resource type | Supports tags |
| ------------- | ----------- |
| jobs | Yes | 

## Microsoft.DataBoxEdge
| Resource type | Supports tags |
| ------------- | ----------- |
| DataBoxEdgeDevices | Yes | 

## Microsoft.Databricks
| Resource type | Supports tags |
| ------------- | ----------- |
| workspaces | Yes | 
| workspaces/virtualNetworkPeerings | No | 

## Microsoft.DataCatalog
| Resource type | Supports tags |
| ------------- | ----------- |
| catalogs | Yes | 

## Microsoft.DataConnect
| Resource type | Supports tags |
| ------------- | ----------- |
| connectionManagers | Yes | 

## Microsoft.DataFactory
| Resource type | Supports tags |
| ------------- | ----------- |
| dataFactories | Yes | 
| dataFactories/diagnosticSettings | No | 
| dataFactorySchema | No | 
| factories | Yes | 
| factories/integrationRuntimes | No | 

## Microsoft.DataLakeAnalytics
| Resource type | Supports tags |
| ------------- | ----------- |
| accounts | Yes | 
| accounts/dataLakeStoreAccounts | No | 
| accounts/storageAccounts | No | 
| accounts/storageAccounts/containers | No | 

## Microsoft.DataLakeStore
| Resource type | Supports tags |
| ------------- | ----------- |
| accounts | Yes | 
| accounts/eventGridFilters | No | 
| accounts/firewallRules | No | 

## Microsoft.DataMigration
| Resource type | Supports tags |
| ------------- | ----------- |
| services | Yes | 
| services/projects | Yes | 

## Microsoft.DBforMariaDB
| Resource type | Supports tags |
| ------------- | ----------- |
| servers | Yes | 
| servers/recoverableServers | No | 
| servers/virtualNetworkRules | No | 

## Microsoft.DBforMySQL
| Resource type | Supports tags |
| ------------- | ----------- |
| servers | Yes | 
| servers/recoverableServers | No | 
| servers/virtualNetworkRules | No | 

## Microsoft.DBforPostgreSQL
| Resource type | Supports tags |
| ------------- | ----------- |
| servers | Yes | 
| servers/advisors | No | 
| servers/queryTexts | No | 
| servers/recoverableServers | No | 
| servers/topQueryStatistics | No | 
| servers/virtualNetworkRules | No | 
| servers/waitStatistics | No | 

## Microsoft.Devices
| Resource type | Supports tags |
| ------------- | ----------- |
| IotHubs | Yes | 
| IotHubs/eventGridFilters | No | 
| ProvisioningServices | Yes | 
| usages | No | 

## Microsoft.DevSpaces
| Resource type | Supports tags |
| ------------- | ----------- |
| controllers | Yes | 

## Microsoft.DevTestLab
| Resource type | Supports tags |
| ------------- | ----------- |
| labs | Yes | 
| labs/serviceRunners | Yes | 
| labs/virtualMachines | Yes | 
| schedules | Yes | 

## Microsoft.DocumentDB
| Resource type | Supports tags |
| ------------- | ----------- |
| databaseAccountNames | No | 
| databaseAccounts | Yes | 

## Microsoft.DomainRegistration
| Resource type | Supports tags |
| ------------- | ----------- |
| domains | Yes | 
| domains/domainOwnershipIdentifiers | No | 
| generateSsoRequest | No | 
| topLevelDomains | No | 
| validateDomainRegistrationInformation | No | 

## Microsoft.DynamicsLcs
| Resource type | Supports tags |
| ------------- | ----------- |
| lcsprojects | No | 
| lcsprojects/clouddeployments | No | 
| lcsprojects/connectors | No | 

## Microsoft.EventGrid
| Resource type | Supports tags |
| ------------- | ----------- |
| domains | Yes | 
| domains/topics | No | 
| eventSubscriptions | No | 
| extensionTopics | No | 
| topics | Yes | 
| topicTypes | No | 

## Microsoft.EventHub
| Resource type | Supports tags |
| ------------- | ----------- |
| clusters | Yes | 
| namespaces | Yes | 
| namespaces/authorizationrules | No | 
| namespaces/disasterrecoveryconfigs | No | 
| namespaces/eventhubs | No | 
| namespaces/eventhubs/authorizationrules | No | 
| namespaces/eventhubs/consumergroups | No | 

## Microsoft.Features
| Resource type | Supports tags |
| ------------- | ----------- |
| features | No | 
| providers | No | 

## Microsoft.Gallery
| Resource type | Supports tags |
| ------------- | ----------- |
| enroll | No | 
| galleryitems | No | 
| generateartifactaccessuri | No | 
| myareas | No | 
| myareas/areas | No | 
| myareas/areas/areas | No | 
| myareas/areas/areas/galleryitems | No | 
| myareas/areas/galleryitems | No | 
| myareas/galleryitems | No | 
| register | No | 
| resources | No | 
| retrieveresourcesbyid | No | 

## Microsoft.GuestConfiguration
| Resource type | Supports tags |
| ------------- | ----------- |
| guestConfigurationAssignments | No | 
| software | No | 

## Microsoft.HanaOnAzure
| Resource type | Supports tags |
| ------------- | ----------- |
| hanaInstances | Yes | 

## Microsoft.HDInsight
| Resource type | Supports tags |
| ------------- | ----------- |
| clusters | Yes | 
| clusters/applications | No | 

## Microsoft.ImportExport
| Resource type | Supports tags |
| ------------- | ----------- |
| jobs | Yes | 

## Microsoft.InformationProtection
| Resource type | Supports tags |
| ------------- | ----------- |
| labelGroups | No | 
| labelGroups/labels | No | 
| labelGroups/labels/conditions | No | 
| labelGroups/labels/subLabels | No | 
| labelGroups/labels/subLabels/conditions | No | 

## microsoft.insights
| Resource type | Supports tags |
| ------------- | ----------- |
| actiongroups | Yes | 
| activityLogAlerts | Yes | 
| alertrules | Yes | 
| automatedExportSettings | No | 
| autoscalesettings | Yes | 
| baseline | No | 
| calculatebaseline | No | 
| components | Yes | 
| components/events | No | 
| components/pricingPlans | No | 
| components/query | No | 
| diagnosticSettings | No | 
| diagnosticSettingsCategories | No | 
| eventCategories | No | 
| eventtypes | No | 
| extendedDiagnosticSettings | No | 
| logDefinitions | No | 
| logprofiles | No | 
| logs | No | 
| metricAlerts | Yes |
| migrateToNewPricingModel | No | 
| myWorkbooks | No | 
| queries | No | 
| rollbackToLegacyPricingModel | No | 
| scheduledqueryrules | Yes | 
| vmInsightsOnboardingStatuses | No | 
| webtests | Yes | 
| workbooks | Yes | 

## Microsoft.Intune
| Resource type | Supports tags |
| ------------- | ----------- |
| diagnosticSettings | No | 
| diagnosticSettingsCategories | No | 

## Microsoft.IoTCentral
| Resource type | Supports tags |
| ------------- | ----------- |
| IoTApps | Yes | 

## Microsoft.IoTSpaces
| Resource type | Supports tags |
| ------------- | ----------- |
| Graph | Yes | 

## Microsoft.KeyVault
| Resource type | Supports tags |
| ------------- | ----------- |
| deletedVaults | No | 
| vaults | Yes | 
| vaults/accessPolicies | No | 
| vaults/secrets | No | 

## Microsoft.Kusto
| Resource type | Supports tags |
| ------------- | ----------- |
| clusters | Yes | 
| clusters/databases | No | 
| clusters/databases/dataconnections | No | 
| clusters/databases/eventhubconnections | No | 

## Microsoft.LabServices
| Resource type | Supports tags |
| ------------- | ----------- |
| labaccounts | Yes | 
| users | No | 

## Microsoft.LocationBasedServices
| Resource type | Supports tags |
| ------------- | ----------- |
| accounts | Yes | 

## Microsoft.LocationServices
| Resource type | Supports tags |
| ------------- | ----------- |
| accounts | Yes | 

## Microsoft.LogAnalytics
| Resource type | Supports tags |
| ------------- | ----------- |
| logs | No | 

## Microsoft.Logic
| Resource type | Supports tags |
| ------------- | ----------- |
| integrationAccounts | Yes | 
| workflows | Yes | 

## Microsoft.MachineLearning
| Resource type | Supports tags |
| ------------- | ----------- |
| commitmentPlans | Yes | 
| webServices | Yes | 
| Workspaces | Yes | 

## Microsoft.MachineLearningExperimentation
| Resource type | Supports tags |
| ------------- | ----------- |
| accounts | Yes | 
| accounts/workspaces | Yes | 
| accounts/workspaces/projects | Yes | 
| teamAccounts | Yes | 
| teamAccounts/workspaces | Yes | 
| teamAccounts/workspaces/projects | Yes | 

## Microsoft.MachineLearningModelManagement
| Resource type | Supports tags |
| ------------- | ----------- |
| accounts | Yes | 

## Microsoft.MachineLearningServices
| Resource type | Supports tags |
| ------------- | ----------- |
| workspaces | Yes | 
| workspaces/computes | No | 

## Microsoft.ManagedIdentity
| Resource type | Supports tags |
| ------------- | ----------- |
| Identities | No | 
| userAssignedIdentities | Yes | 

## Microsoft.Management
| Resource type | Supports tags |
| ------------- | ----------- |
| getEntities | No | 
| managementGroups | No | 
| resources | No | 
| startTenantBackfill | No | 
| tenantBackfillStatus | No | 

## Microsoft.Maps
| Resource type | Supports tags |
| ------------- | ----------- |
| accounts | Yes | 
| accounts/eventGridFilters | No | 

## Microsoft.Marketplace
| Resource type | Supports tags |
| ------------- | ----------- |
| offers | No | 
| offerTypes | No | 
| offerTypes/publishers | No | 
| offerTypes/publishers/offers | No | 
| offerTypes/publishers/offers/plans | No | 
| offerTypes/publishers/offers/plans/agreements | No | 
| offerTypes/publishers/offers/plans/configs | No | 
| offerTypes/publishers/offers/plans/configs/importImage | No | 
| privategalleryitems | No | 
| products | No | 

## Microsoft.MarketplaceApps
| Resource type | Supports tags |
| ------------- | ----------- |
| classicDevServices | Yes | 
| updateCommunicationPreference | No | 

## Microsoft.MarketplaceOrdering
| Resource type | Supports tags |
| ------------- | ----------- |
| agreements | No | 
| offertypes | No | 

## Microsoft.Media
| Resource type | Supports tags |
| ------------- | ----------- |
| mediaservices | Yes | 
| mediaservices/accountFilters | No | 
| mediaservices/assets | No | 
| mediaservices/assets/assetFilters | No | 
| mediaservices/contentKeyPolicies | No | 
| mediaservices/eventGridFilters | No | 
| mediaservices/liveEventOperations | No | 
| mediaservices/liveEvents | Yes | 
| mediaservices/liveEvents/liveOutputs | No | 
| mediaservices/liveOutputOperations | No | 
| mediaservices/streamingEndpointOperations | No | 
| mediaservices/streamingEndpoints | Yes | 
| mediaservices/streamingLocators | No | 
| mediaservices/streamingPolicies | No | 
| mediaservices/transforms | No | 
| mediaservices/transforms/jobs | No | 

## Microsoft.Migrate
| Resource type | Supports tags |
| ------------- | ----------- |
| projects | Yes | 

## Microsoft.Network
| Resource type | Supports tags |
| ------------- | ----------- |
| applicationGateways | Yes | 
| applicationSecurityGroups | Yes | 
| azureFirewallFqdnTags | No | 
| azureFirewalls | Yes | 
| bgpServiceCommunities | No | 
| connections | Yes | 
| ddosCustomPolicies | Yes | 
| ddosProtectionPlans | Yes | 
| dnsOperationStatuses | No | 
| dnszones | Yes | 
| dnszones/A | No | 
| dnszones/AAAA | No | 
| dnszones/all | No | 
| dnszones/CAA | No | 
| dnszones/CNAME | No | 
| dnszones/MX | No | 
| dnszones/NS | No | 
| dnszones/PTR | No | 
| dnszones/recordsets | No | 
| dnszones/SOA | No | 
| dnszones/SRV | No | 
| dnszones/TXT | No | 
| expressRouteCircuits | Yes | 
| expressRouteServiceProviders | No | 
| frontdoors | Yes | 
| frontdoorWebApplicationFirewallPolicies | Yes | 
| getDnsResourceReference | No | 
| interfaceEndpoints | Yes | 
| internalNotify | No | 
| loadBalancers | Yes | 
| localNetworkGateways | Yes | 
| natGateways | Yes | 
| networkIntentPolicies | Yes | 
| networkInterfaces | Yes | 
| networkProfiles | Yes | 
| networkSecurityGroups | Yes | 
| networkWatchers | Yes | 
| networkWatchers/connectionMonitors | Yes | 
| networkWatchers/lenses | Yes | 
| networkWatchers/pingMeshes | Yes | 
| privateLinkServices | Yes | 
| publicIPAddresses | Yes | 
| publicIPPrefixes | Yes | 
| routeFilters | Yes | 
| routeTables | Yes | 
| serviceEndpointPolicies | Yes | 
| trafficManagerGeographicHierarchies | No | 
| trafficmanagerprofiles | Yes | 
| trafficmanagerprofiles/heatMaps | No | 
| virtualHubs | Yes | 
| virtualNetworkGateways | Yes | 
| virtualNetworks | Yes | 
| virtualNetworkTaps | Yes | 
| virtualWans | Yes | 
| vpnGateways | Yes | 
| vpnSites | Yes | 
| webApplicationFirewallPolicies | Yes | 

## Microsoft.NotificationHubs
| Resource type | Supports tags |
| ------------- | ----------- |
| namespaces | Yes | 
| namespaces/notificationHubs | Yes | 

## Microsoft.OperationalInsights
| Resource type | Supports tags |
| ------------- | ----------- |
| devices | No | 
| linkTargets | No | 
| storageInsightConfigs | No | 
| workspaces | Yes | 
| workspaces/dataSources | No | 
| workspaces/linkedServices | No | 
| workspaces/query | No | 

## Microsoft.OperationsManagement
| Resource type | Supports tags |
| ------------- | ----------- |
| managementassociations | No | 
| managementconfigurations | Yes | 
| solutions | Yes | 
| views | Yes | 

## Microsoft.PolicyInsights
| Resource type | Supports tags |
| ------------- | ----------- |
| policyEvents | No | 
| policyStates | No | 
| policyTrackedResources | No | 
| remediations | No | 

## Microsoft.Portal
| Resource type | Supports tags |
| ------------- | ----------- |
| consoles | No | 
| dashboards | Yes | 
| userSettings | No | 

## Microsoft.PowerBI
| Resource type | Supports tags |
| ------------- | ----------- |
| workspaceCollections | Yes | 

## Microsoft.PowerBIDedicated
| Resource type | Supports tags |
| ------------- | ----------- |
| capacities | Yes | 

## Microsoft.ProjectOxford
| Resource type | Supports tags |
| ------------- | ----------- |
| accounts | Yes | 

## Microsoft.RecoveryServices
| Resource type | Supports tags |
| ------------- | ----------- |
| backupProtectedItems | No | 
| vaults | Yes | 

## Microsoft.Relay
| Resource type | Supports tags |
| ------------- | ----------- |
| namespaces | Yes | 
| namespaces/authorizationrules | No | 
| namespaces/hybridconnections | No | 
| namespaces/hybridconnections/authorizationrules | No | 
| namespaces/wcfrelays | No | 
| namespaces/wcfrelays/authorizationrules | No | 

## Microsoft.ResourceGraph
| Resource type | Supports tags |
| ------------- | ----------- |
| resources | No | 
| subscriptionsStatus | No | 

## Microsoft.ResourceHealth
| Resource type | Supports tags |
| ------------- | ----------- |
| availabilityStatuses | No | 
| childAvailabilityStatuses | No | 
| childResources | No | 
| events | No | 
| impactedResources | No | 
| notifications | No | 

## Microsoft.Resources
| Resource type | Supports tags |
| ------------- | ----------- |
| deployments | No | 
| deployments/operations | No | 
| links | No | 
| notifyResourceJobs | No | 
| providers | No | 
| resourceGroups | No | 
| resources | No | 
| subscriptions | No | 
| subscriptions/providers | No | 
| subscriptions/resourceGroups | No | 
| subscriptions/resourcegroups/resources | No | 
| subscriptions/resources | No | 
| subscriptions/tagnames | No | 
| subscriptions/tagNames/tagValues | No | 
| tenants | No | 

## Microsoft.SaaS
| Resource type | Supports tags |
| ------------- | ----------- |
| applications | Yes | 
| saasresources | No | 

## Microsoft.Scheduler
| Resource type | Supports tags |
| ------------- | ----------- |
| flows | Yes | 
| jobcollections | Yes | 

## Microsoft.Search
| Resource type | Supports tags |
| ------------- | ----------- |
| resourceHealthMetadata | No | 
| searchServices | Yes | 

## Microsoft.Security
| Resource type | Supports tags |
| ------------- | ----------- |
| advancedThreatProtectionSettings | No | 
| alerts | No | 
| allowedConnections | No | 
| appliances | No | 
| applicationWhitelistings | No | 
| AutoProvisioningSettings | No | 
| Compliances | No | 
| dataCollectionAgents | No | 
| discoveredSecuritySolutions | No | 
| externalSecuritySolutions | No | 
| InformationProtectionPolicies | No | 
| jitNetworkAccessPolicies | No | 
| monitoring | No | 
| monitoring/antimalware | No | 
| monitoring/baseline | No | 
| monitoring/patch | No | 
| policies | No | 
| pricings | No | 
| securityContacts | No | 
| securitySolutions | No | 
| securitySolutionsReferenceData | No | 
| securityStatus | No | 
| securityStatus/endpoints | No | 
| securityStatus/subnets | No | 
| securityStatus/virtualMachines | No | 
| securityStatuses | No | 
| securityStatusesSummaries | No | 
| settings | No | 
| tasks | No | 
| topologies | No | 
| workspaceSettings | No | 

## Microsoft.SecurityGraph
| Resource type | Supports tags |
| ------------- | ----------- |
| diagnosticSettings | No | 
| diagnosticSettingsCategories | No | 

## Microsoft.ServiceBus
| Resource type | Supports tags |
| ------------- | ----------- |
| namespaces | Yes | 
| namespaces/authorizationrules | No | 
| namespaces/disasterrecoveryconfigs | No | 
| namespaces/eventgridfilters | No | 
| namespaces/queues | No | 
| namespaces/queues/authorizationrules | No | 
| namespaces/topics | No | 
| namespaces/topics/authorizationrules | No | 
| namespaces/topics/subscriptions | No | 
| namespaces/topics/subscriptions/rules | No | 
| premiumMessagingRegions | No | 

## Microsoft.ServiceFabric
| Resource type | Supports tags |
| ------------- | ----------- |
| clusters | Yes | 
| clusters/applications | No | 

## Microsoft.ServiceFabricMesh
| Resource type | Supports tags |
| ------------- | ----------- |
| applications | Yes | 
| gateways | Yes | 
| networks | Yes | 
| secrets | Yes | 
| volumes | Yes | 

## Microsoft.SignalRService
| Resource type | Supports tags |
| ------------- | ----------- |
| SignalR | Yes | 

## Microsoft.Solutions
| Resource type | Supports tags |
| ------------- | ----------- |
| applianceDefinitions | Yes | 
| appliances | Yes | 
| applicationDefinitions | Yes | 
| applications | Yes | 
| jitRequests | Yes | 

## Microsoft.SQL
| Resource type | Supports tags |
| ------------- | ----------- |
| managedInstances | Yes |
| managedInstances/databases | Yes (see note below) |
| managedInstances/databases/backupShortTermRetentionPolicies | No |
| managedInstances/databases/schemas/tables/columns/sensitivityLabels | No |
| managedInstances/databases/vulnerabilityAssessments | No |
| managedInstances/databases/vulnerabilityAssessments/rules/baselines | No |
| managedInstances/encryptionProtector | No |
| managedInstances/keys | No |
| managedInstances/restorableDroppedDatabases/backupShortTermRetentionPolicies | No |
| managedInstances/vulnerabilityAssessments | No |
| servers | Yes | 
| servers/administrators | No | 
| servers/communicationLinks | No | 
| servers/databases | Yes (see note below) | 
| servers/encryptionProtector | No | 
| servers/firewallRules | No | 
| servers/keys | No | 
| servers/restorableDroppedDatabases | No | 
| servers/serviceobjectives | No | 
| servers/tdeCertificates | No | 

> [!NOTE]
> The Master database doesn't support tags, but other databases, including Azure SQL Data Warehouse databases, support tags. Azure SQL Data Warehouse databases must be in Active (not Paused) state.


## Microsoft.SqlVirtualMachine
| Resource type | Supports tags |
| ------------- | ----------- |
| SqlVirtualMachineGroups | Yes | 
| SqlVirtualMachineGroups/AvailabilityGroupListeners | No | 
| SqlVirtualMachines | Yes | 

## Microsoft.Storage
| Resource type | Supports tags |
| ------------- | ----------- |
| storageAccounts | Yes | 
| storageAccounts/blobServices | No | 
| storageAccounts/fileServices | No | 
| storageAccounts/queueServices | No | 
| storageAccounts/services | No | 
| storageAccounts/tableServices | No | 
| usages | No | 

## Microsoft.StorageSync
| Resource type | Supports tags |
| ------------- | ----------- |
| storageSyncServices | Yes | 
| storageSyncServices/registeredServers | No | 
| storageSyncServices/syncGroups | No | 
| storageSyncServices/syncGroups/cloudEndpoints | No | 
| storageSyncServices/syncGroups/serverEndpoints | No | 
| storageSyncServices/workflows | No | 

## Microsoft.StorSimple
| Resource type | Supports tags |
| ------------- | ----------- |
| managers | Yes | 

## Microsoft.StreamAnalytics
| Resource type | Supports tags |
| ------------- | ----------- |
| streamingjobs | Yes (see note below) | 
| streamingjobs/diagnosticSettings | No | 

> [!NOTE]
> You can't add a tag when streamingjobs is running. Stop the resource to add a tag.

## Microsoft.Subscription
| Resource type | Supports tags |
| ------------- | ----------- |
| CreateSubscription | No | 
| SubscriptionDefinitions | No | 
| SubscriptionOperations | No | 

## microsoft.support
| Resource type | Supports tags |
| ------------- | ----------- |
| supporttickets | No | 

## Microsoft.TerraformOSS
| Resource type | Supports tags |
| ------------- | ----------- |
| providerRegistrations | Yes | 
| resources | Yes | 

## Microsoft.TimeSeriesInsights
| Resource type | Supports tags |
| ------------- | ----------- |
| environments | Yes | 
| environments/accessPolicies | No | 
| environments/eventsources | Yes | 
| environments/referenceDataSets | Yes | 

## microsoft.visualstudio
| Resource type | Supports tags |
| ------------- | ----------- |
| account | Yes | 
| account/extension | Yes | 
| account/project | Yes | 

## Microsoft.Web
| Resource type | Supports tags |
| ------------- | ----------- |
| apiManagementAccounts | No | 
| apiManagementAccounts/apiAcls | No | 
| apiManagementAccounts/apis | No | 
| apiManagementAccounts/apis/apiAcls | No | 
| apiManagementAccounts/apis/connectionAcls | No | 
| apiManagementAccounts/apis/connections | No | 
| apiManagementAccounts/apis/connections/connectionAcls | No | 
| apiManagementAccounts/apis/localizedDefinitions | No | 
| apiManagementAccounts/connectionAcls | No | 
| apiManagementAccounts/connections | No | 
| billingMeters | No | 
| certificates | Yes | 
| connectionGateways | Yes | 
| connections | Yes | 
| customApis | Yes | 
| deletedSites | No | 
| functions | No | 
| hostingEnvironments | Yes | 
| hostingEnvironments/multiRolePools | No | 
| hostingEnvironments/multiRolePools/instances | No | 
| hostingEnvironments/workerPools | No | 
| hostingEnvironments/workerPools/instances | No | 
| publishingUsers | No | 
| recommendations | No | 
| resourceHealthMetadata | No | 
| runtimes | No | 
| serverFarms | Yes | 
| serverFarms/workers | No | 
| sites | Yes | 
| sites/domainOwnershipIdentifiers | No | 
| sites/hostNameBindings | No | 
| sites/instances | No | 
| sites/instances/extensions | No | 
| sites/premieraddons | Yes | 
| sites/recommendations | No | 
| sites/resourceHealthMetadata | No | 
| sites/slots | Yes | 
| sites/slots/hostNameBindings | No | 
| sites/slots/instances | No | 
| sites/slots/instances/extensions | No | 
| sourceControls | No | 
| validate | No | 
| verifyHostingEnvironmentVnet | No | 

## Microsoft.WindowsDefenderATP
| Resource type | Supports tags |
| ------------- | ----------- |
| diagnosticSettings | No | 
| diagnosticSettingsCategories | No | 

## Microsoft.WindowsIoT
| Resource type | Supports tags |
| ------------- | ----------- |
| DeviceServices | Yes | 

## Microsoft.WorkloadMonitor
| Resource type | Supports tags |
| ------------- | ----------- |
| components | No | 
| componentsSummary | No | 
| monitorInstances | No | 
| monitorInstancesSummary | No | 
| monitors | No | 
| notificationSettings | No | 

## Next steps
To learn how to apply tags to resources, see [Use tags to organize your Azure resources](resource-group-using-tags.md).

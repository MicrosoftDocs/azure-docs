---
title: Azure Resource Manager complete mode deletion by resource type
description: Shows how resource types handle complete mode deletion in Azure Resource Manager templates.
author: tfitzmac
ms.service: azure-resource-manager
ms.topic: reference
ms.date: 04/24/2019
ms.author: tomfitz
---

# Deletion of Azure resources for complete mode deployments
This article describes how resource types handle deletion when not in a template that is deployed in complete mode.

The resource types marked with `Yes` are deleted when the type isn't in the template deployed with complete mode. 

The resource types marked with `No` aren't automatically deleted when not in the template; however, they're deleted if the parent resource is deleted. For a full description of the behavior, see [Azure Resource Manager deployment modes](deployment-modes.md).


## Microsoft.AAD

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | DomainServices | Yes | 
> | DomainServices/oucontainer | No | 

## microsoft.aadiam

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | diagnosticSettings | No | 
> | diagnosticSettingsCategories | No | 

## Microsoft.Addons

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | supportProviders | No | 

## Microsoft.ADHybridHealthService

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | aadsupportcases | No | 
> | addsservices | No | 
> | agents | No | 
> | anonymousapiusers | No | 
> | configuration | No | 
> | logs | No | 
> | reports | No | 
> | services | No | 

## Microsoft.Advisor

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | configurations | No | 
> | generateRecommendations | No | 
> | recommendations | No | 
> | suppressions | No | 

## Microsoft.AlertsManagement

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | actionRules | No | 
> | alerts | No | 
> | alertsList | No | 
> | alertsSummary | No | 
> | alertsSummaryList | No | 
> | smartDetectorAlertRules | No | 
> | smartDetectorRuntimeEnvironments | No | 
> | smartGroups | No | 

## Microsoft.AnalysisServices

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | servers | Yes | 

## Microsoft.ApiManagement

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | reportFeedback | No | 
> | service | Yes | 
> | validateServiceName | No | 

## Microsoft.Attestation

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | attestationProviders | No | 

## Microsoft.Authorization

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | classicAdministrators | No | 
> | denyAssignments | No | 
> | elevateAccess | No | 
> | locks | No | 
> | permissions | No | 
> | policyAssignments | No | 
> | policyDefinitions | No | 
> | policySetDefinitions | No | 
> | providerOperations | No | 
> | roleAssignments | No | 
> | roleDefinitions | No | 

## Microsoft.Automation

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | automationAccounts | Yes | 
> | automationAccounts/configurations | Yes | 
> | automationAccounts/jobs | No | 
> | automationAccounts/runbooks | Yes | 
> | automationAccounts/softwareUpdateConfigurations | No | 
> | automationAccounts/webhooks | No | 

## Microsoft.Azure.Geneva

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | environments | No | 
> | environments/accounts | No | 
> | environments/accounts/namespaces | No | 
> | environments/accounts/namespaces/configurations | No | 

## Microsoft.AzureActiveDirectory

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | b2cDirectories | Yes | 

## Microsoft.AzureStack

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | registrations | Yes | 
> | registrations/customerSubscriptions | No | 
> | registrations/products | No | 

## Microsoft.Batch

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | batchAccounts | Yes | 

## Microsoft.Billing

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | billingAccounts | No | 
> | billingAccounts/billingProfiles | No | 
> | billingAccounts/billingProfiles/billingSubscriptions | No | 
> | billingAccounts/billingProfiles/invoices | No | 
> | billingAccounts/billingProfiles/invoices/pricesheet | No | 
> | billingAccounts/billingProfiles/operationStatus | No | 
> | billingAccounts/billingProfiles/paymentMethods | No | 
> | billingAccounts/billingProfiles/policies | No | 
> | billingAccounts/billingProfiles/pricesheet | No | 
> | billingAccounts/billingProfiles/products | No | 
> | billingAccounts/billingProfiles/transactions | No | 
> | billingAccounts/billingSubscriptions | No | 
> | billingAccounts/departments | No | 
> | billingAccounts/eligibleOffers | No | 
> | billingAccounts/enrollmentAccounts | No | 
> | billingAccounts/invoices | No | 
> | billingAccounts/invoiceSections | No | 
> | billingAccounts/invoiceSections/billingSubscriptions | No | 
> | billingAccounts/invoiceSections/billingSubscriptions/transfer | No | 
> | billingAccounts/invoiceSections/importRequests | No | 
> | billingAccounts/invoiceSections/initiateImportRequest | No | 
> | billingAccounts/invoiceSections/initiateTransfer | No | 
> | billingAccounts/invoiceSections/operationStatus | No | 
> | billingAccounts/invoiceSections/products | No | 
> | billingAccounts/invoiceSections/transfers | No | 
> | billingAccounts/products | No | 
> | billingAccounts/projects | No | 
> | billingAccounts/projects/billingSubscriptions | No | 
> | billingAccounts/projects/importRequests | No | 
> | billingAccounts/projects/initiateImportRequest | No | 
> | billingAccounts/projects/operationStatus | No | 
> | billingAccounts/projects/products | No | 
> | billingAccounts/transactions | No | 
> | billingPeriods | No | 
> | BillingPermissions | No | 
> | billingProperty | No | 
> | BillingRoleAssignments | No | 
> | BillingRoleDefinitions | No | 
> | CreateBillingRoleAssignment | No | 
> | departments | No | 
> | enrollmentAccounts | No | 
> | importRequests | No | 
> | importRequests/acceptImportRequest | No | 
> | importRequests/declineImportRequest | No | 
> | invoices | No | 
> | transfers | No | 
> | transfers/acceptTransfer | No | 
> | transfers/declineTransfer | No | 
> | transfers/operationStatus | No | 
> | usagePlans | No | 

## Microsoft.BingMaps

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | mapApis | Yes | 
> | updateCommunicationPreference | No | 

## Microsoft.BizTalkServices

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | BizTalk | Yes | 

## Microsoft.Blueprint

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | blueprintAssignments | No | 
> | blueprintAssignments/assignmentOperations | No | 
> | blueprintAssignments/operations | No | 
> | blueprints | No | 
> | blueprints/artifacts | No | 
> | blueprints/versions | No | 
> | blueprints/versions/artifacts | No | 

## Microsoft.BotService

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | botServices | Yes | 
> | botServices/channels | No | 
> | botServices/connections | No | 

## Microsoft.Cache

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | Redis | Yes | 
> | RedisConfigDefinition | No | 

## Microsoft.Capacity

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | appliedReservations | No | 
> | calculatePrice | No | 
> | catalogs | No | 
> | commercialReservationOrders | No | 
> | reservationOrders | No | 
> | reservationOrders/calculateRefund | No | 
> | reservationOrders/merge | No | 
> | reservationOrders/reservations | No | 
> | reservationOrders/reservations/revisions | No | 
> | reservationOrders/return | No | 
> | reservationOrders/split | No | 
> | reservationOrders/swap | No | 
> | reservations | No | 
> | resources | No | 
> | validateReservationOrder | No | 

## Microsoft.Cdn

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | edgenodes | No | 
> | profiles | Yes | 
> | profiles/endpoints | Yes | 
> | profiles/endpoints/customdomains | No | 
> | profiles/endpoints/origins | No | 
> | validateProbe | No | 

## Microsoft.CertificateRegistration

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | certificateOrders | Yes | 
> | certificateOrders/certificates | No | 
> | validateCertificateRegistrationInformation | No | 

## Microsoft.ClassicCompute

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | capabilities | No | 
> | domainNames | No | 
> | domainNames/capabilities | No | 
> | domainNames/internalLoadBalancers | No | 
> | domainNames/serviceCertificates | No | 
> | domainNames/slots | No | 
> | domainNames/slots/roles | No | 
> | moveSubscriptionResources | No | 
> | operatingSystemFamilies | No | 
> | operatingSystems | No | 
> | quotas | No | 
> | resourceTypes | No | 
> | validateSubscriptionMoveAvailability | No | 
> | virtualMachines | No | 
> | virtualMachines/diagnosticSettings | No | 

## Microsoft.ClassicInfrastructureMigrate

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | classicInfrastructureResources | No | 

## Microsoft.ClassicNetwork

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | capabilities | No | 
> | expressRouteCrossConnections | No | 
> | expressRouteCrossConnections/peerings | No | 
> | gatewaySupportedDevices | No | 
> | networkSecurityGroups | No | 
> | quotas | No | 
> | reservedIps | No | 
> | virtualNetworks | No | 
> | virtualNetworks/remoteVirtualNetworkPeeringProxies | No | 
> | virtualNetworks/virtualNetworkPeerings | No | 

## Microsoft.ClassicStorage

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | capabilities | No | 
> | disks | No | 
> | images | No | 
> | osImages | No | 
> | osPlatformImages | No | 
> | publicImages | No | 
> | quotas | No | 
> | storageAccounts | No | 
> | storageAccounts/services | No | 
> | storageAccounts/services/diagnosticSettings | No | 
> | storageAccounts/vmImages | No | 
> | vmImages | No | 

## Microsoft.CognitiveServices

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | accounts | Yes | 

## Microsoft.Commerce

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | RateCard | No | 
> | UsageAggregates | No | 

## Microsoft.Compute

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | availabilitySets | Yes | 
> | disks | Yes | 
> | images | Yes | 
> | restorePointCollections | Yes | 
> | restorePointCollections/restorePoints | No | 
> | sharedVMImages | Yes | 
> | sharedVMImages/versions | Yes | 
> | snapshots | Yes | 
> | virtualMachines | Yes | 
> | virtualMachines/diagnosticSettings | No | 
> | virtualMachines/extensions | Yes | 
> | virtualMachineScaleSets | Yes | 
> | virtualMachineScaleSets/extensions | No | 
> | virtualMachineScaleSets/networkInterfaces | No | 
> | virtualMachineScaleSets/publicIPAddresses | No | 
> | virtualMachineScaleSets/virtualMachines | No | 
> | virtualMachineScaleSets/virtualMachines/networkInterfaces | No | 

## Microsoft.Consumption

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | AggregatedCost | No | 
> | Balances | No | 
> | Budgets | No | 
> | Charges | No | 
> | CostTags | No | 
> | credits | No | 
> | events | No | 
> | Forecasts | No | 
> | lots | No | 
> | Marketplaces | No | 
> | Pricesheets | No | 
> | products | No | 
> | ReservationDetails | No | 
> | ReservationRecommendations | No | 
> | ReservationSummaries | No | 
> | ReservationTransactions | No | 
> | Tags | No | 
> | Terms | No | 
> | UsageDetails | No | 

## Microsoft.ContainerInstance

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | containerGroups | Yes | 
> | serviceAssociationLinks | No | 

## Microsoft.ContainerRegistry

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | registries | Yes | 
> | registries/builds | No | 
> | registries/builds/cancel | No | 
> | registries/builds/getLogLink | No | 
> | registries/buildTasks | Yes | 
> | registries/buildTasks/steps | No | 
> | registries/eventGridFilters | No | 
> | registries/getBuildSourceUploadUrl | No | 
> | registries/GetCredentials | No | 
> | registries/importImage | No | 
> | registries/queueBuild | No | 
> | registries/regenerateCredential | No | 
> | registries/regenerateCredentials | No | 
> | registries/replications | Yes | 
> | registries/runs | No | 
> | registries/runs/cancel | No | 
> | registries/scheduleRun | No | 
> | registries/tasks | Yes | 
> | registries/updatePolicies | No | 
> | registries/webhooks | Yes | 
> | registries/webhooks/getCallbackConfig | No | 
> | registries/webhooks/ping | No | 

## Microsoft.ContainerService

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | containerServices | Yes | 
> | managedClusters | Yes | 

## Microsoft.ContentModerator

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | applications | Yes | 
> | updateCommunicationPreference | No | 

## Microsoft.CortanaAnalytics

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | accounts | Yes | 

## Microsoft.CostManagement

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | Alerts | No | 
> | BillingAccounts | No | 
> | Connectors | Yes | 
> | Departments | No | 
> | Dimensions | No | 
> | EnrollmentAccounts | No | 
> | Query | No | 
> | register | No | 
> | Reportconfigs | No | 
> | Reports | No | 

## Microsoft.CustomerInsights

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | hubs | Yes | 
> | hubs/authorizationPolicies | No | 
> | hubs/connectors | No | 
> | hubs/connectors/mappings | No | 
> | hubs/interactions | No | 
> | hubs/kpi | No | 
> | hubs/links | No | 
> | hubs/profiles | No | 
> | hubs/roleAssignments | No | 
> | hubs/roles | No | 
> | hubs/suggestTypeSchema | No | 
> | hubs/views | No | 
> | hubs/widgetTypes | No | 

## Microsoft.DataBox

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | jobs | Yes | 

## Microsoft.DataBoxEdge

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | DataBoxEdgeDevices | Yes | 

## Microsoft.Databricks

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | workspaces | Yes | 
> | workspaces/virtualNetworkPeerings | No | 

## Microsoft.DataCatalog

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | catalogs | Yes | 

## Microsoft.DataConnect

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | connectionManagers | Yes | 

## Microsoft.DataFactory

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | dataFactories | Yes | 
> | dataFactories/diagnosticSettings | No | 
> | dataFactorySchema | No | 
> | factories | Yes | 
> | factories/integrationRuntimes | No | 

## Microsoft.DataLakeAnalytics

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | accounts | Yes | 
> | accounts/dataLakeStoreAccounts | No | 
> | accounts/storageAccounts | No | 
> | accounts/storageAccounts/containers | No | 

## Microsoft.DataLakeStore

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | accounts | Yes | 
> | accounts/eventGridFilters | No | 
> | accounts/firewallRules | No | 

## Microsoft.DataMigration

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | services | Yes | 
> | services/projects | Yes | 

## Microsoft.DBforMariaDB

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | servers | Yes | 
> | servers/recoverableServers | No | 
> | servers/virtualNetworkRules | No | 

## Microsoft.DBforMySQL

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | servers | Yes | 
> | servers/recoverableServers | No | 
> | servers/virtualNetworkRules | No | 

## Microsoft.DBforPostgreSQL

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | servers | Yes | 
> | servers/advisors | No | 
> | servers/queryTexts | No | 
> | servers/recoverableServers | No | 
> | servers/topQueryStatistics | No | 
> | servers/virtualNetworkRules | No | 
> | servers/waitStatistics | No | 

## Microsoft.Devices

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | IotHubs | Yes | 
> | IotHubs/eventGridFilters | No | 
> | ProvisioningServices | Yes | 
> | usages | No | 

## Microsoft.DevSpaces

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | controllers | Yes | 

## Microsoft.DevTestLab

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | labs | Yes | 
> | labs/serviceRunners | Yes | 
> | labs/virtualMachines | Yes | 
> | schedules | Yes | 

## Microsoft.DocumentDB

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | databaseAccountNames | No | 
> | databaseAccounts | Yes | 

## Microsoft.DomainRegistration

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | domains | Yes | 
> | domains/domainOwnershipIdentifiers | No | 
> | generateSsoRequest | No | 
> | topLevelDomains | No | 
> | validateDomainRegistrationInformation | No | 

## Microsoft.DynamicsLcs

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | lcsprojects | No | 
> | lcsprojects/clouddeployments | No | 
> | lcsprojects/connectors | No | 

## Microsoft.EventGrid

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | domains | Yes | 
> | domains/topics | No | 
> | eventSubscriptions | No | 
> | extensionTopics | No | 
> | topics | Yes | 
> | topicTypes | No | 

## Microsoft.EventHub

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | clusters | Yes | 
> | namespaces | Yes | 
> | namespaces/authorizationrules | No | 
> | namespaces/disasterrecoveryconfigs | No | 
> | namespaces/eventhubs | No | 
> | namespaces/eventhubs/authorizationrules | No | 
> | namespaces/eventhubs/consumergroups | No | 

## Microsoft.Features

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | features | No | 
> | providers | No | 

## Microsoft.Gallery

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | enroll | No | 
> | galleryitems | No | 
> | generateartifactaccessuri | No | 
> | myareas | No | 
> | myareas/areas | No | 
> | myareas/areas/areas | No | 
> | myareas/areas/areas/galleryitems | No | 
> | myareas/areas/galleryitems | No | 
> | myareas/galleryitems | No | 
> | register | No | 
> | resources | No | 
> | retrieveresourcesbyid | No | 

## Microsoft.GuestConfiguration

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | guestConfigurationAssignments | No | 
> | software | No | 

## Microsoft.HanaOnAzure

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | hanaInstances | Yes | 

## Microsoft.HDInsight

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | clusters | Yes | 
> | clusters/applications | No | 

## Microsoft.ImportExport

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | jobs | Yes | 

## Microsoft.InformationProtection

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | labelGroups | No | 
> | labelGroups/labels | No | 
> | labelGroups/labels/conditions | No | 
> | labelGroups/labels/subLabels | No | 
> | labelGroups/labels/subLabels/conditions | No | 

## microsoft.insights

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | actiongroups | Yes | 
> | activityLogAlerts | Yes | 
> | alertrules | Yes | 
> | automatedExportSettings | No | 
> | autoscalesettings | Yes | 
> | baseline | No | 
> | calculatebaseline | No | 
> | components | Yes | 
> | components/events | No | 
> | components/pricingPlans | No | 
> | components/query | No | 
> | diagnosticSettings | No | 
> | diagnosticSettingsCategories | No | 
> | eventCategories | No | 
> | eventtypes | No | 
> | extendedDiagnosticSettings | No | 
> | logDefinitions | No | 
> | logprofiles | No | 
> | logs | No | 
> | metricAlerts | Yes |
> | migrateToNewPricingModel | No | 
> | myWorkbooks | No | 
> | queries | No | 
> | rollbackToLegacyPricingModel | No | 
> | scheduledqueryrules | Yes | 
> | vmInsightsOnboardingStatuses | No | 
> | webtests | Yes | 
> | workbooks | Yes | 

## Microsoft.Intune

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | diagnosticSettings | No | 
> | diagnosticSettingsCategories | No | 

## Microsoft.IoTCentral

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | IoTApps | Yes | 

## Microsoft.IoTSpaces

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | Graph | Yes | 

## Microsoft.KeyVault

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | deletedVaults | No | 
> | vaults | Yes | 
> | vaults/accessPolicies | No | 
> | vaults/secrets | No | 

## Microsoft.Kusto

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | clusters | Yes | 
> | clusters/databases | No | 
> | clusters/databases/dataconnections | No | 
> | clusters/databases/eventhubconnections | No | 

## Microsoft.LabServices

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | labaccounts | Yes | 
> | users | No | 

## Microsoft.LocationBasedServices

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | accounts | Yes | 

## Microsoft.LocationServices

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | accounts | Yes | 

## Microsoft.LogAnalytics

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | logs | No | 

## Microsoft.Logic

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | integrationAccounts | Yes | 
> | workflows | Yes | 

## Microsoft.MachineLearning

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | commitmentPlans | Yes | 
> | webServices | Yes | 
> | Workspaces | Yes | 

## Microsoft.MachineLearningExperimentation

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | accounts | Yes | 
> | accounts/workspaces | Yes | 
> | accounts/workspaces/projects | Yes | 
> | teamAccounts | Yes | 
> | teamAccounts/workspaces | Yes | 
> | teamAccounts/workspaces/projects | Yes | 

## Microsoft.MachineLearningModelManagement

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | accounts | Yes | 

## Microsoft.MachineLearningServices
> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | workspaces | Yes | 
> | workspaces/computes | No | 

## Microsoft.ManagedIdentity

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | Identities | No | 
> | userAssignedIdentities | Yes | 

## Microsoft.Management

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | getEntities | No | 
> | managementGroups | No | 
> | resources | No | 
> | startTenantBackfill | No | 
> | tenantBackfillStatus | No | 

## Microsoft.Maps

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | accounts | Yes | 
> | accounts/eventGridFilters | No | 

## Microsoft.Marketplace

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | offers | No | 
> | offerTypes | No | 
> | offerTypes/publishers | No | 
> | offerTypes/publishers/offers | No | 
> | offerTypes/publishers/offers/plans | No | 
> | offerTypes/publishers/offers/plans/agreements | No | 
> | offerTypes/publishers/offers/plans/configs | No | 
> | offerTypes/publishers/offers/plans/configs/importImage | No | 
> | privategalleryitems | No | 
> | products | No | 

## Microsoft.MarketplaceApps

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | classicDevServices | Yes | 
> | updateCommunicationPreference | No | 

## Microsoft.MarketplaceOrdering

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | agreements | No | 
> | offertypes | No | 

## Microsoft.Media

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | mediaservices | Yes | 
> | mediaservices/accountFilters | No | 
> | mediaservices/assets | No | 
> | mediaservices/assets/assetFilters | No | 
> | mediaservices/contentKeyPolicies | No | 
> | mediaservices/eventGridFilters | No | 
> | mediaservices/liveEventOperations | No | 
> | mediaservices/liveEvents | Yes | 
> | mediaservices/liveEvents/liveOutputs | No | 
> | mediaservices/liveOutputOperations | No | 
> | mediaservices/streamingEndpointOperations | No | 
> | mediaservices/streamingEndpoints | Yes | 
> | mediaservices/streamingLocators | No | 
> | mediaservices/streamingPolicies | No | 
> | mediaservices/transforms | No | 
> | mediaservices/transforms/jobs | No | 

## Microsoft.Migrate

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | projects | Yes | 

## Microsoft.Network

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | applicationGateways | Yes | 
> | applicationSecurityGroups | Yes | 
> | azureFirewallFqdnTags | No | 
> | azureFirewalls | Yes | 
> | bgpServiceCommunities | No | 
> | connections | Yes | 
> | ddosCustomPolicies | Yes | 
> | ddosProtectionPlans | Yes | 
> | dnsOperationStatuses | No | 
> | dnszones | Yes | 
> | dnszones/A | No | 
> | dnszones/AAAA | No | 
> | dnszones/all | No | 
> | dnszones/CAA | No | 
> | dnszones/CNAME | No | 
> | dnszones/MX | No | 
> | dnszones/NS | No | 
> | dnszones/PTR | No | 
> | dnszones/recordsets | No | 
> | dnszones/SOA | No | 
> | dnszones/SRV | No | 
> | dnszones/TXT | No | 
> | expressRouteCircuits | Yes | 
> | expressRouteServiceProviders | No | 
> | frontdoors | Yes | 
> | frontdoorWebApplicationFirewallPolicies | Yes | 
> | getDnsResourceReference | No | 
> | interfaceEndpoints | Yes | 
> | internalNotify | No | 
> | loadBalancers | Yes | 
> | localNetworkGateways | Yes | 
> | natGateways | Yes | 
> | networkIntentPolicies | Yes | 
> | networkInterfaces | Yes | 
> | networkProfiles | Yes | 
> | networkSecurityGroups | Yes | 
> | networkWatchers | Yes | 
> | networkWatchers/connectionMonitors | Yes | 
> | networkWatchers/lenses | Yes | 
> | networkWatchers/pingMeshes | Yes | 
> | privateLinkServices | Yes | 
> | publicIPAddresses | Yes | 
> | publicIPPrefixes | Yes | 
> | routeFilters | Yes | 
> | routeTables | Yes | 
> | serviceEndpointPolicies | Yes | 
> | trafficManagerGeographicHierarchies | No | 
> | trafficmanagerprofiles | Yes | 
> | trafficmanagerprofiles/heatMaps | No | 
> | virtualHubs | Yes | 
> | virtualNetworkGateways | Yes | 
> | virtualNetworks | Yes | 
> | virtualNetworkTaps | Yes | 
> | virtualWans | Yes | 
> | vpnGateways | Yes | 
> | vpnSites | Yes | 
> | webApplicationFirewallPolicies | Yes | 

## Microsoft.NotificationHubs

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | namespaces | Yes | 
> | namespaces/notificationHubs | Yes | 

## Microsoft.OperationalInsights

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | devices | No | 
> | linkTargets | No | 
> | storageInsightConfigs | No | 
> | workspaces | Yes | 
> | workspaces/dataSources | No | 
> | workspaces/linkedServices | No | 
> | workspaces/query | No | 

## Microsoft.OperationsManagement

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | managementassociations | No | 
> | managementconfigurations | Yes | 
> | solutions | Yes | 
> | views | Yes | 

## Microsoft.PolicyInsights

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | policyEvents | No | 
> | policyStates | No | 
> | policyTrackedResources | No | 
> | remediations | No | 

## Microsoft.Portal

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | consoles | No | 
> | dashboards | Yes | 
> | userSettings | No | 

## Microsoft.PowerBI

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | workspaceCollections | Yes | 

## Microsoft.PowerBIDedicated

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | capacities | Yes | 

## Microsoft.ProjectOxford

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | accounts | Yes | 

## Microsoft.RecoveryServices

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | backupProtectedItems | No | 
> | vaults | Yes | 

## Microsoft.Relay

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | namespaces | Yes | 
> | namespaces/authorizationrules | No | 
> | namespaces/hybridconnections | No | 
> | namespaces/hybridconnections/authorizationrules | No | 
> | namespaces/wcfrelays | No | 
> | namespaces/wcfrelays/authorizationrules | No | 

## Microsoft.ResourceGraph

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | resources | No | 
> | subscriptionsStatus | No | 

## Microsoft.ResourceHealth

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | availabilityStatuses | No | 
> | childAvailabilityStatuses | No | 
> | childResources | No | 
> | events | No | 
> | impactedResources | No | 
> | notifications | No | 

## Microsoft.Resources

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | deployments | No | 
> | deployments/operations | No | 
> | links | No | 
> | notifyResourceJobs | No | 
> | providers | No | 
> | resourceGroups | No | 
> | resources | No | 
> | subscriptions | No | 
> | subscriptions/providers | No | 
> | subscriptions/resourceGroups | No | 
> | subscriptions/resourcegroups/resources | No | 
> | subscriptions/resources | No | 
> | subscriptions/tagnames | No | 
> | subscriptions/tagNames/tagValues | No | 
> | tenants | No | 

## Microsoft.SaaS

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | applications | Yes | 
> | saasresources | No | 

## Microsoft.Scheduler

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | flows | Yes | 
> | jobcollections | Yes | 

## Microsoft.Search

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | resourceHealthMetadata | No | 
> | searchServices | Yes | 

## Microsoft.Security

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | advancedThreatProtectionSettings | No | 
> | alerts | No | 
> | allowedConnections | No | 
> | appliances | No | 
> | applicationWhitelistings | No | 
> | AutoProvisioningSettings | No | 
> | Compliances | No | 
> | dataCollectionAgents | No | 
> | discoveredSecuritySolutions | No | 
> | externalSecuritySolutions | No | 
> | InformationProtectionPolicies | No | 
> | jitNetworkAccessPolicies | No | 
> | monitoring | No | 
> | monitoring/antimalware | No | 
> | monitoring/baseline | No | 
> | monitoring/patch | No | 
> | policies | No | 
> | pricings | No | 
> | securityContacts | No | 
> | securitySolutions | No | 
> | securitySolutionsReferenceData | No | 
> | securityStatus | No | 
> | securityStatus/endpoints | No | 
> | securityStatus/subnets | No | 
> | securityStatus/virtualMachines | No | 
> | securityStatuses | No | 
> | securityStatusesSummaries | No | 
> | settings | No | 
> | tasks | No | 
> | topologies | No | 
> | workspaceSettings | No | 

## Microsoft.SecurityGraph

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | diagnosticSettings | No | 
> | diagnosticSettingsCategories | No | 

## Microsoft.ServiceBus

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | namespaces | Yes | 
> | namespaces/authorizationrules | No | 
> | namespaces/disasterrecoveryconfigs | No | 
> | namespaces/eventgridfilters | No | 
> | namespaces/queues | No | 
> | namespaces/queues/authorizationrules | No | 
> | namespaces/topics | No | 
> | namespaces/topics/authorizationrules | No | 
> | namespaces/topics/subscriptions | No | 
> | namespaces/topics/subscriptions/rules | No | 
> | premiumMessagingRegions | No | 

## Microsoft.ServiceFabric

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | clusters | Yes | 
> | clusters/applications | No | 

## Microsoft.ServiceFabricMesh

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | applications | Yes | 
> | gateways | Yes | 
> | networks | Yes | 
> | secrets | Yes | 
> | volumes | Yes | 

## Microsoft.SignalRService

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | SignalR | Yes | 

## Microsoft.Solutions

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | applianceDefinitions | Yes | 
> | appliances | Yes | 
> | applicationDefinitions | Yes | 
> | applications | Yes | 
> | jitRequests | Yes | 

## Microsoft.SQL

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | managedInstances | Yes |
> | managedInstances/databases | Yes |
> | managedInstances/databases/backupShortTermRetentionPolicies | No |
> | managedInstances/databases/schemas/tables/columns/sensitivityLabels | No |
> | managedInstances/databases/vulnerabilityAssessments | No |
> | managedInstances/databases/vulnerabilityAssessments/rules/baselines | No |
> | managedInstances/encryptionProtector | No |
> | managedInstances/keys | No |
> | managedInstances/restorableDroppedDatabases/backupShortTermRetentionPolicies | No |
> | managedInstances/vulnerabilityAssessments | No |
> | servers | Yes | 
> | servers/administrators | No | 
> | servers/communicationLinks | No | 
> | servers/databases | Yes | 
> | servers/encryptionProtector | No | 
> | servers/firewallRules | No | 
> | servers/keys | No | 
> | servers/restorableDroppedDatabases | No | 
> | servers/serviceobjectives | No | 
> | servers/tdeCertificates | No | 


## Microsoft.SqlVirtualMachine

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | SqlVirtualMachineGroups | Yes | 
> | SqlVirtualMachineGroups/AvailabilityGroupListeners | No | 
> | SqlVirtualMachines | Yes | 

## Microsoft.Storage

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | storageAccounts | Yes | 
> | storageAccounts/blobServices | No | 
> | storageAccounts/fileServices | No | 
> | storageAccounts/queueServices | No | 
> | storageAccounts/services | No | 
> | storageAccounts/tableServices | No | 
> | usages | No | 

## Microsoft.StorageSync

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | storageSyncServices | Yes | 
> | storageSyncServices/registeredServers | No | 
> | storageSyncServices/syncGroups | No | 
> | storageSyncServices/syncGroups/cloudEndpoints | No | 
> | storageSyncServices/syncGroups/serverEndpoints | No | 
> | storageSyncServices/workflows | No | 

## Microsoft.StorSimple

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | managers | Yes | 

## Microsoft.StreamAnalytics

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | streamingjobs | Yes | 
> | streamingjobs/diagnosticSettings | No | 

## Microsoft.Subscription

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | CreateSubscription | No | 
> | SubscriptionDefinitions | No | 
> | SubscriptionOperations | No | 

## microsoft.support

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | supporttickets | No | 

## Microsoft.TerraformOSS

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | providerRegistrations | Yes | 
> | resources | Yes | 

## Microsoft.TimeSeriesInsights

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | environments | Yes | 
> | environments/accessPolicies | No | 
> | environments/eventsources | Yes | 
> | environments/referenceDataSets | Yes | 

## microsoft.visualstudio

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | account | Yes | 
> | account/extension | Yes | 
> | account/project | Yes | 

## Microsoft.Web

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | apiManagementAccounts | No | 
> | apiManagementAccounts/apiAcls | No | 
> | apiManagementAccounts/apis | No | 
> | apiManagementAccounts/apis/apiAcls | No | 
> | apiManagementAccounts/apis/connectionAcls | No | 
> | apiManagementAccounts/apis/connections | No | 
> | apiManagementAccounts/apis/connections/connectionAcls | No | 
> | apiManagementAccounts/apis/localizedDefinitions | No | 
> | apiManagementAccounts/connectionAcls | No | 
> | apiManagementAccounts/connections | No | 
> | billingMeters | No | 
> | certificates | Yes | 
> | connectionGateways | Yes | 
> | connections | Yes | 
> | customApis | Yes | 
> | deletedSites | No | 
> | functions | No | 
> | hostingEnvironments | Yes | 
> | hostingEnvironments/multiRolePools | No | 
> | hostingEnvironments/multiRolePools/instances | No | 
> | hostingEnvironments/workerPools | No | 
> | hostingEnvironments/workerPools/instances | No | 
> | publishingUsers | No | 
> | recommendations | No | 
> | resourceHealthMetadata | No | 
> | runtimes | No | 
> | serverFarms | Yes | 
> | serverFarms/workers | No | 
> | sites | Yes | 
> | sites/domainOwnershipIdentifiers | No | 
> | sites/hostNameBindings | No | 
> | sites/instances | No | 
> | sites/instances/extensions | No | 
> | sites/premieraddons | Yes | 
> | sites/recommendations | No | 
> | sites/resourceHealthMetadata | No | 
> | sites/slots | Yes | 
> | sites/slots/hostNameBindings | No | 
> | sites/slots/instances | No | 
> | sites/slots/instances/extensions | No | 
> | sourceControls | No | 
> | validate | No | 
> | verifyHostingEnvironmentVnet | No | 

## Microsoft.WindowsDefenderATP

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | diagnosticSettings | No | 
> | diagnosticSettingsCategories | No | 

## Microsoft.WindowsIoT

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | DeviceServices | Yes | 

## Microsoft.WorkloadMonitor

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | components | No | 
> | componentsSummary | No | 
> | monitorInstances | No | 
> | monitorInstancesSummary | No | 
> | monitors | No | 
> | notificationSettings | No | 

## Next steps

To get the same data as a file of comma-separated values, download [complete-mode-deletion.csv](https://github.com/tfitzmac/resource-capabilities/blob/master/complete-mode-deletion.csv).
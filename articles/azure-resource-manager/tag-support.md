---
title: Azure Resource Manager tag support for resources
description: Shows which Azure resource types support tags. Provides details for all Azure services.
author: tfitzmac
ms.service: azure-resource-manager
ms.topic: reference
ms.date: 05/07/2019
ms.author: tomfitz
---

# Tag support for Azure resources
This article describes whether a resource type supports [tags](resource-group-using-tags.md). The column labeled **Supports tags** indicates whether the resource type has a property for the tag. The column labeled **Tag in cost report** indicates whether that resource type passes the tag to the cost report.

To get the same data as a file of comma-separated values, download [tag-support.csv](https://github.com/tfitzmac/resource-capabilities/blob/master/tag-support.csv).

## Microsoft.AAD
| Resource type | Supports tags | Tag in cost report |
| ------------- | ----------- | ----------- |
| DomainServices | Yes | 
| DomainServices/oucontainer | No | No |

## microsoft.aadiam
| Resource type | Supports tags | Tag in cost report |
| ------------- | ----------- | ----------- |
| diagnosticSettings | No |  No |
| diagnosticSettingsCategories | No |  No |

## Microsoft.Addons
| Resource type | Supports tags | Tag in cost report |
| ------------- | ----------- | ----------- |
| supportProviders | No |  No |

## Microsoft.ADHybridHealthService
| Resource type | Supports tags | Tag in cost report |
| ------------- | ----------- | ----------- |
| aadsupportcases | No |  No |
| addsservices | No |  No |
| agents | No |  No |
| anonymousapiusers | No |  No |
| configuration | No |  No |
| logs | No |  No |
| reports | No |  No |
| services | No |  No |

## Microsoft.Advisor
| Resource type | Supports tags | Tag in cost report |
| ------------- | ----------- | ----------- |
| configurations | No |  No |
| generateRecommendations | No |  No |
| recommendations | No |  No |
| suppressions | No |  No |

## Microsoft.AlertsManagement
| Resource type | Supports tags | Tag in cost report |
| ------------- | ----------- | ----------- |
| actionRules | No |  No |
| alerts | No |  No |
| alertsList | No |  No |
| alertsSummary | No |  No |
| alertsSummaryList | No |  No |
| smartDetectorAlertRules | No |  No |
| smartDetectorRuntimeEnvironments | No |  No |
| smartGroups | No |  No |

## Microsoft.AnalysisServices
| Resource type | Supports tags | Tag in cost report |
| ------------- | ----------- | ----------- |
| servers | Yes | 

## Microsoft.ApiManagement
| Resource type | Supports tags | Tag in cost report |
| ------------- | ----------- | ----------- |
| reportFeedback | No |  No |
| service | Yes | 
| validateServiceName | No |  No |

## Microsoft.Attestation
| Resource type | Supports tags | Tag in cost report |
| ------------- | ----------- | ----------- |
| attestationProviders | No |  No |

## Microsoft.Authorization
| Resource type | Supports tags | Tag in cost report |
| ------------- | ----------- | ----------- |
| classicAdministrators | No |  No |
| denyAssignments | No |  No |
| elevateAccess | No |  No |
| locks | No |  No |
| permissions | No |  No |
| policyAssignments | No |  No |
| policyDefinitions | No |  No |
| policySetDefinitions | No |  No |
| providerOperations | No |  No |
| roleAssignments | No |  No |
| roleDefinitions | No |  No |

## Microsoft.Automation
| Resource type | Supports tags | Tag in cost report |
| ------------- | ----------- | ----------- |
| automationAccounts | Yes | 
| automationAccounts/configurations | Yes | 
| automationAccounts/jobs | No |  No |
| automationAccounts/runbooks | Yes | 
| automationAccounts/softwareUpdateConfigurations | No | 
| automationAccounts/webhooks | No |  No |

## Microsoft.Azure.Geneva
| Resource type | Supports tags | Tag in cost report |
| ------------- | ----------- | ----------- |
| environments | No |  No |
| environments/accounts | No |  No |
| environments/accounts/namespaces | No |  No |
| environments/accounts/namespaces/configurations | No |  No |

## Microsoft.AzureActiveDirectory
| Resource type | Supports tags | Tag in cost report |
| ------------- | ----------- | ----------- |
| b2cDirectories | Yes | 

## Microsoft.AzureStack
| Resource type | Supports tags | Tag in cost report |
| ------------- | ----------- | ----------- |
| registrations | Yes | 
| registrations/customerSubscriptions | No |  No |
| registrations/products | No |  No |

## Microsoft.Batch
| Resource type | Supports tags | Tag in cost report |
| ------------- | ----------- | ----------- |
| batchAccounts | Yes | 

## Microsoft.Billing
| Resource type | Supports tags | Tag in cost report |
| ------------- | ----------- | ----------- |
| billingAccounts | No |  No |
| billingAccounts/billingProfiles | No |  No |
| billingAccounts/billingProfiles/billingSubscriptions | No |  No |
| billingAccounts/billingProfiles/invoices | No |  No |
| billingAccounts/billingProfiles/invoices/pricesheet | No |  No |
| billingAccounts/billingProfiles/operationStatus | No |  No |
| billingAccounts/billingProfiles/paymentMethods | No |  No |
| billingAccounts/billingProfiles/policies | No |  No |
| billingAccounts/billingProfiles/pricesheet | No |  No |
| billingAccounts/billingProfiles/products | No |  No |
| billingAccounts/billingProfiles/transactions | No |  No |
| billingAccounts/billingSubscriptions | No |  No |
| billingAccounts/departments | No |  No |
| billingAccounts/eligibleOffers | No |  No |
| billingAccounts/enrollmentAccounts | No |  No |
| billingAccounts/invoices | No |  No |
| billingAccounts/invoiceSections | No |  No |
| billingAccounts/invoiceSections/billingSubscriptions | No |  No |
| billingAccounts/invoiceSections/billingSubscriptions/transfer | No |  No |
| billingAccounts/invoiceSections/importRequests | No |  No |
| billingAccounts/invoiceSections/initiateImportRequest | No |  No |
| billingAccounts/invoiceSections/initiateTransfer | No |  No |
| billingAccounts/invoiceSections/operationStatus | No |  No |
| billingAccounts/invoiceSections/products | No |  No |
| billingAccounts/invoiceSections/transfers | No |  No |
| billingAccounts/products | No |  No |
| billingAccounts/projects | No |  No |
| billingAccounts/projects/billingSubscriptions | No |  No |
| billingAccounts/projects/importRequests | No |  No |
| billingAccounts/projects/initiateImportRequest | No |  No |
| billingAccounts/projects/operationStatus | No |  No |
| billingAccounts/projects/products | No |  No |
| billingAccounts/transactions | No |  No |
| billingPeriods | No |  No |
| BillingPermissions | No |  No |
| billingProperty | No |  No |
| BillingRoleAssignments | No |  No |
| BillingRoleDefinitions | No |  No |
| CreateBillingRoleAssignment | No |  No |
| departments | No |  No |
| enrollmentAccounts | No |  No |
| importRequests | No |  No |
| importRequests/acceptImportRequest | No |  No |
| importRequests/declineImportRequest | No |  No |
| invoices | No |  No |
| transfers | No |  No |
| transfers/acceptTransfer | No |  No |
| transfers/declineTransfer | No |  No |
| transfers/operationStatus | No |  No |
| usagePlans | No |  No |

## Microsoft.BingMaps
| Resource type | Supports tags | Tag in cost report |
| ------------- | ----------- | ----------- |
| mapApis | Yes | 
| updateCommunicationPreference | No |  No |

## Microsoft.BizTalkServices
| Resource type | Supports tags | Tag in cost report |
| ------------- | ----------- | ----------- |
| BizTalk | Yes | 

## Microsoft.Blueprint
| Resource type | Supports tags | Tag in cost report |
| ------------- | ----------- | ----------- |
| blueprintAssignments | No |  No |
| blueprintAssignments/assignmentOperations | No |  No |
| blueprintAssignments/operations | No |  No |
| blueprints | No |  No |
| blueprints/artifacts | No |  No |
| blueprints/versions | No |  No |
| blueprints/versions/artifacts | No |  No |

## Microsoft.BotService
| Resource type | Supports tags | Tag in cost report |
| ------------- | ----------- | ----------- |
| botServices | Yes | 
| botServices/channels | No |  No |
| botServices/connections | No |  No |

## Microsoft.Cache
| Resource type | Supports tags | Tag in cost report |
| ------------- | ----------- | ----------- |
| Redis | Yes | 
| RedisConfigDefinition | No |  No |

## Microsoft.Capacity
| Resource type | Supports tags | Tag in cost report |
| ------------- | ----------- | ----------- |
| appliedReservations | No |  No |
| calculatePrice | No |  No |
| catalogs | No |  No |
| commercialReservationOrders | No |  No |
| reservationOrders | No |  No |
| reservationOrders/calculateRefund | No |  No |
| reservationOrders/merge | No |  No |
| reservationOrders/reservations | No |  No |
| reservationOrders/reservations/revisions | No |  No |
| reservationOrders/return | No |  No |
| reservationOrders/split | No |  No |
| reservationOrders/swap | No |  No |
| reservations | No |  No |
| resources | No |  No |
| validateReservationOrder | No |  No |

## Microsoft.Cdn
| Resource type | Supports tags | Tag in cost report |
| ------------- | ----------- | ----------- |
| edgenodes | No |  No |
| profiles | Yes | 
| profiles/endpoints | Yes | 
| profiles/endpoints/customdomains | No |  No |
| profiles/endpoints/origins | No |  No |
| validateProbe | No |  No |

## Microsoft.CertificateRegistration
| Resource type | Supports tags | Tag in cost report |
| ------------- | ----------- | ----------- |
| certificateOrders | Yes | 
| certificateOrders/certificates | No |  No |
| validateCertificateRegistrationInformation | No |  No |

## Microsoft.ClassicCompute
| Resource type | Supports tags | Tag in cost report |
| ------------- | ----------- | ----------- |
| capabilities | No |  No |
| domainNames | No |  No |
| domainNames/capabilities | No |  No |
| domainNames/internalLoadBalancers | No |  No |
| domainNames/serviceCertificates | No |  No |
| domainNames/slots | No |  No |
| domainNames/slots/roles | No |  No |
| moveSubscriptionResources | No |  No |
| operatingSystemFamilies | No |  No |
| operatingSystems | No |  No |
| quotas | No |  No |
| resourceTypes | No |  No |
| validateSubscriptionMoveAvailability | No |  No |
| virtualMachines | No |  No |
| virtualMachines/diagnosticSettings | No |  No |

## Microsoft.ClassicInfrastructureMigrate
| Resource type | Supports tags | Tag in cost report |
| ------------- | ----------- | ----------- |
| classicInfrastructureResources | No |  No |

## Microsoft.ClassicNetwork
| Resource type | Supports tags | Tag in cost report |
| ------------- | ----------- | ----------- |
| capabilities | No |  No |
| expressRouteCrossConnections | No |  No |
| expressRouteCrossConnections/peerings | No |  No |
| gatewaySupportedDevices | No |  No |
| networkSecurityGroups | No |  No |
| quotas | No |  No |
| reservedIps | No |  No |
| virtualNetworks | No |  No |
| virtualNetworks/remoteVirtualNetworkPeeringProxies | No |  No |
| virtualNetworks/virtualNetworkPeerings | No |  No |

## Microsoft.ClassicStorage
| Resource type | Supports tags | Tag in cost report |
| ------------- | ----------- | ----------- |
| capabilities | No |  No |
| disks | No |  No |
| images | No |  No |
| osImages | No |  No |
| osPlatformImages | No |  No |
| publicImages | No |  No |
| quotas | No |  No |
| storageAccounts | No |  No |
| storageAccounts/services | No |  No |
| storageAccounts/services/diagnosticSettings | No |  No |
| storageAccounts/vmImages | No |  No |
| vmImages | No |  No |

## Microsoft.CognitiveServices
| Resource type | Supports tags | Tag in cost report |
| ------------- | ----------- | ----------- |
| accounts | Yes | 

## Microsoft.Commerce
| Resource type | Supports tags | Tag in cost report |
| ------------- | ----------- | ----------- |
| RateCard | No |  No |
| UsageAggregates | No |  No |

## Microsoft.Compute
| Resource type | Supports tags | Tag in cost report |
| ------------- | ----------- | ----------- |
| availabilitySets | Yes | 
| disks | Yes | 
| images | Yes | 
| restorePointCollections | Yes | 
| restorePointCollections/restorePoints | No |  No |
| sharedVMImages | Yes | 
| sharedVMImages/versions | Yes | 
| snapshots | Yes | 
| virtualMachines | Yes | 
| virtualMachines/diagnosticSettings | No |  No |
| virtualMachines/extensions | Yes | 
| virtualMachineScaleSets | Yes | 
| virtualMachineScaleSets/extensions | No |  No |
| virtualMachineScaleSets/networkInterfaces | No |  No |
| virtualMachineScaleSets/publicIPAddresses | No |  No |
| virtualMachineScaleSets/virtualMachines | No |  No |
| virtualMachineScaleSets/virtualMachines/networkInterfaces | No |  No |

## Microsoft.Consumption
| Resource type | Supports tags | Tag in cost report |
| ------------- | ----------- | ----------- |
| AggregatedCost | No |  No |
| Balances | No |  No |
| Budgets | No |  No |
| Charges | No |  No |
| CostTags | No |  No |
| credits | No |  No |
| events | No |  No |
| Forecasts | No |  No |
| lots | No |  No |
| Marketplaces | No |  No |
| Pricesheets | No |  No |
| products | No |  No |
| ReservationDetails | No |  No |
| ReservationRecommendations | No |  No |
| ReservationSummaries | No |  No |
| ReservationTransactions | No |  No |
| Tags | No |  No |
| Terms | No |  No |
| UsageDetails | No |  No |

## Microsoft.ContainerInstance
| Resource type | Supports tags | Tag in cost report |
| ------------- | ----------- | ----------- |
| containerGroups | Yes | 
| serviceAssociationLinks | No |  No |

## Microsoft.ContainerRegistry
| Resource type | Supports tags | Tag in cost report |
| ------------- | ----------- | ----------- |
| registries | Yes | 
| registries/builds | No |  No |
| registries/builds/cancel | No |  No |
| registries/builds/getLogLink | No |  No |
| registries/buildTasks | Yes | 
| registries/buildTasks/steps | No |  No |
| registries/eventGridFilters | No |  No |
| registries/getBuildSourceUploadUrl | No |  No |
| registries/GetCredentials | No |  No |
| registries/importImage | No |  No |
| registries/queueBuild | No |  No |
| registries/regenerateCredential | No |  No |
| registries/regenerateCredentials | No |  No |
| registries/replications | Yes | 
| registries/runs | No |  No |
| registries/runs/cancel | No |  No |
| registries/scheduleRun | No |  No |
| registries/tasks | Yes | 
| registries/updatePolicies | No |  No |
| registries/webhooks | Yes | 
| registries/webhooks/getCallbackConfig | No |  No |
| registries/webhooks/ping | No |  No |

## Microsoft.ContainerService
| Resource type | Supports tags | Tag in cost report |
| ------------- | ----------- | ----------- |
| containerServices | Yes | 
| managedClusters | Yes | 

## Microsoft.ContentModerator
| Resource type | Supports tags | Tag in cost report |
| ------------- | ----------- | ----------- |
| applications | Yes | 
| updateCommunicationPreference | No |  No |

## Microsoft.CortanaAnalytics
| Resource type | Supports tags | Tag in cost report |
| ------------- | ----------- | ----------- |
| accounts | Yes | 

## Microsoft.CostManagement
| Resource type | Supports tags | Tag in cost report |
| ------------- | ----------- | ----------- |
| Alerts | No |  No |
| BillingAccounts | No |  No |
| Connectors | Yes | 
| Departments | No |  No |
| Dimensions | No |  No |
| EnrollmentAccounts | No |  No |
| Query | No |  No |
| register | No |  No |
| Reportconfigs | No |  No |
| Reports | No |  No |

## Microsoft.CustomerInsights
| Resource type | Supports tags | Tag in cost report |
| ------------- | ----------- | ----------- |
| hubs | Yes | 
| hubs/authorizationPolicies | No |  No |
| hubs/connectors | No |  No |
| hubs/connectors/mappings | No |  No |
| hubs/interactions | No |  No |
| hubs/kpi | No |  No |
| hubs/links | No |  No |
| hubs/profiles | No |  No |
| hubs/roleAssignments | No |  No |
| hubs/roles | No |  No |
| hubs/suggestTypeSchema | No |  No |
| hubs/views | No |  No |
| hubs/widgetTypes | No |  No |

## Microsoft.DataBox
| Resource type | Supports tags | Tag in cost report |
| ------------- | ----------- | ----------- |
| jobs | Yes | 

## Microsoft.DataBoxEdge
| Resource type | Supports tags | Tag in cost report |
| ------------- | ----------- | ----------- |
| DataBoxEdgeDevices | Yes | 

## Microsoft.Databricks
| Resource type | Supports tags | Tag in cost report |
| ------------- | ----------- | ----------- |
| workspaces | Yes | 
| workspaces/virtualNetworkPeerings | No |  No |

## Microsoft.DataCatalog
| Resource type | Supports tags | Tag in cost report |
| ------------- | ----------- | ----------- |
| catalogs | Yes | 

## Microsoft.DataConnect
| Resource type | Supports tags | Tag in cost report |
| ------------- | ----------- | ----------- |
| connectionManagers | Yes | 

## Microsoft.DataFactory
| Resource type | Supports tags | Tag in cost report |
| ------------- | ----------- | ----------- |
| dataFactories | Yes | 
| dataFactories/diagnosticSettings | No |  No |
| dataFactorySchema | No |  No |
| factories | Yes | 
| factories/integrationRuntimes | No |  No |

## Microsoft.DataLakeAnalytics
| Resource type | Supports tags | Tag in cost report |
| ------------- | ----------- | ----------- |
| accounts | Yes | 
| accounts/dataLakeStoreAccounts | No |  No |
| accounts/storageAccounts | No |  No |
| accounts/storageAccounts/containers | No |  No |

## Microsoft.DataLakeStore
| Resource type | Supports tags | Tag in cost report |
| ------------- | ----------- | ----------- |
| accounts | Yes | 
| accounts/eventGridFilters | No |  No |
| accounts/firewallRules | No |  No |

## Microsoft.DataMigration
| Resource type | Supports tags | Tag in cost report |
| ------------- | ----------- | ----------- |
| services | Yes | 
| services/projects | Yes | 

## Microsoft.DBforMariaDB
| Resource type | Supports tags | Tag in cost report |
| ------------- | ----------- | ----------- |
| servers | Yes | 
| servers/recoverableServers | No |  No |
| servers/virtualNetworkRules | No |  No |

## Microsoft.DBforMySQL
| Resource type | Supports tags | Tag in cost report |
| ------------- | ----------- | ----------- |
| servers | Yes | 
| servers/recoverableServers | No |  No |
| servers/virtualNetworkRules | No |  No |

## Microsoft.DBforPostgreSQL
| Resource type | Supports tags | Tag in cost report |
| ------------- | ----------- | ----------- |
| servers | Yes | 
| servers/advisors | No |  No |
| servers/queryTexts | No |  No |
| servers/recoverableServers | No |  No |
| servers/topQueryStatistics | No |  No |
| servers/virtualNetworkRules | No |  No |
| servers/waitStatistics | No |  No |

## Microsoft.Devices
| Resource type | Supports tags | Tag in cost report |
| ------------- | ----------- | ----------- |
| IotHubs | Yes | 
| IotHubs/eventGridFilters | No |  No |
| ProvisioningServices | Yes | 
| usages | No |  No |

## Microsoft.DevSpaces
| Resource type | Supports tags | Tag in cost report |
| ------------- | ----------- | ----------- |
| controllers | Yes | 

## Microsoft.DevTestLab
| Resource type | Supports tags | Tag in cost report |
| ------------- | ----------- | ----------- |
| labs | Yes | 
| labs/serviceRunners | Yes | 
| labs/virtualMachines | Yes | 
| schedules | Yes | 

## Microsoft.DocumentDB
| Resource type | Supports tags | Tag in cost report |
| ------------- | ----------- | ----------- |
| databaseAccountNames | No |  No |
| databaseAccounts | Yes | 

## Microsoft.DomainRegistration
| Resource type | Supports tags | Tag in cost report |
| ------------- | ----------- | ----------- |
| domains | Yes | 
| domains/domainOwnershipIdentifiers | No |  No |
| generateSsoRequest | No |  No |
| topLevelDomains | No |  No |
| validateDomainRegistrationInformation | No |  No |

## Microsoft.DynamicsLcs
| Resource type | Supports tags | Tag in cost report |
| ------------- | ----------- | ----------- |
| lcsprojects | No |  No |
| lcsprojects/clouddeployments | No |  No |
| lcsprojects/connectors | No |  No |

## Microsoft.EventGrid
| Resource type | Supports tags | Tag in cost report |
| ------------- | ----------- | ----------- |
| domains | Yes | 
| domains/topics | No |  No |
| eventSubscriptions | No |  No |
| extensionTopics | No |  No |
| topics | Yes | 
| topicTypes | No |  No |

## Microsoft.EventHub
| Resource type | Supports tags | Tag in cost report |
| ------------- | ----------- | ----------- |
| clusters | Yes | 
| namespaces | Yes | 
| namespaces/authorizationrules | No |  No |
| namespaces/disasterrecoveryconfigs | No |  No |
| namespaces/eventhubs | No |  No |
| namespaces/eventhubs/authorizationrules | No |  No |
| namespaces/eventhubs/consumergroups | No |  No |

## Microsoft.Features
| Resource type | Supports tags | Tag in cost report |
| ------------- | ----------- | ----------- |
| features | No |  No |
| providers | No |  No |

## Microsoft.Gallery
| Resource type | Supports tags | Tag in cost report |
| ------------- | ----------- | ----------- |
| enroll | No |  No |
| galleryitems | No |  No |
| generateartifactaccessuri | No |  No |
| myareas | No |  No |
| myareas/areas | No |  No |
| myareas/areas/areas | No |  No |
| myareas/areas/areas/galleryitems | No |  No |
| myareas/areas/galleryitems | No |  No |
| myareas/galleryitems | No |  No |
| register | No |  No |
| resources | No |  No |
| retrieveresourcesbyid | No |  No |

## Microsoft.GuestConfiguration
| Resource type | Supports tags | Tag in cost report |
| ------------- | ----------- | ----------- |
| guestConfigurationAssignments | No |  No |
| software | No |  No |

## Microsoft.HanaOnAzure
| Resource type | Supports tags | Tag in cost report |
| ------------- | ----------- | ----------- |
| hanaInstances | Yes |  No |

## Microsoft.HDInsight
| Resource type | Supports tags | Tag in cost report |
| ------------- | ----------- | ----------- |
| clusters | Yes | 
| clusters/applications | No |  No |

## Microsoft.ImportExport
| Resource type | Supports tags | Tag in cost report |
| ------------- | ----------- | ----------- |
| jobs | Yes | 

## Microsoft.InformationProtection
| Resource type | Supports tags | Tag in cost report |
| ------------- | ----------- | ----------- |
| labelGroups | No |  No |
| labelGroups/labels | No |  No |
| labelGroups/labels/conditions | No |  No |
| labelGroups/labels/subLabels | No |  No |
| labelGroups/labels/subLabels/conditions | No |  No |

## microsoft.insights
| Resource type | Supports tags | Tag in cost report |
| ------------- | ----------- | ----------- |
| actiongroups | Yes | 
| activityLogAlerts | Yes | 
| alertrules | Yes | 
| automatedExportSettings | No |  No |
| autoscalesettings | Yes | 
| baseline | No |  No |
| calculatebaseline | No |  No |
| components | Yes | 
| components/events | No |  No |
| components/pricingPlans | No |  No |
| components/query | No |  No |
| diagnosticSettings | No |  No |
| diagnosticSettingsCategories | No |  No |
| eventCategories | No |  No |
| eventtypes | No |  No |
| extendedDiagnosticSettings | No |  No |
| logDefinitions | No |  No |
| logprofiles | No |  No |
| logs | No |  No |
| metricAlerts | Yes |
| migrateToNewPricingModel | No |  No |
| myWorkbooks | No |  No |
| queries | No |  No |
| rollbackToLegacyPricingModel | No |  No |
| scheduledqueryrules | Yes | 
| vmInsightsOnboardingStatuses | No |  No |
| webtests | Yes | 
| workbooks | Yes | 

## Microsoft.Intune
| Resource type | Supports tags | Tag in cost report |
| ------------- | ----------- | ----------- |
| diagnosticSettings | No |  No |
| diagnosticSettingsCategories | No |  No |

## Microsoft.IoTCentral
| Resource type | Supports tags | Tag in cost report |
| ------------- | ----------- | ----------- |
| IoTApps | Yes | 

## Microsoft.IoTSpaces
| Resource type | Supports tags | Tag in cost report |
| ------------- | ----------- | ----------- |
| Graph | Yes | 

## Microsoft.KeyVault
| Resource type | Supports tags | Tag in cost report |
| ------------- | ----------- | ----------- |
| deletedVaults | No |  No |
| vaults | Yes | 
| vaults/accessPolicies | No |  No |
| vaults/secrets | No |  No |

## Microsoft.Kusto
| Resource type | Supports tags | Tag in cost report |
| ------------- | ----------- | ----------- |
| clusters | Yes | 
| clusters/databases | No |  No |
| clusters/databases/dataconnections | No |  No |
| clusters/databases/eventhubconnections | No |  No |

## Microsoft.LabServices
| Resource type | Supports tags | Tag in cost report |
| ------------- | ----------- | ----------- |
| labaccounts | Yes | 
| users | No |  No |

## Microsoft.LocationBasedServices
| Resource type | Supports tags | Tag in cost report |
| ------------- | ----------- | ----------- |
| accounts | Yes | 

## Microsoft.LocationServices
| Resource type | Supports tags | Tag in cost report |
| ------------- | ----------- | ----------- |
| accounts | Yes | 

## Microsoft.LogAnalytics
| Resource type | Supports tags | Tag in cost report |
| ------------- | ----------- | ----------- |
| logs | No |  No |

## Microsoft.Logic
| Resource type | Supports tags | Tag in cost report |
| ------------- | ----------- | ----------- |
| integrationAccounts | Yes | 
| workflows | Yes | 

## Microsoft.MachineLearning
| Resource type | Supports tags | Tag in cost report |
| ------------- | ----------- | ----------- |
| commitmentPlans | Yes | 
| webServices | Yes | 
| Workspaces | Yes | 

## Microsoft.MachineLearningExperimentation
| Resource type | Supports tags | Tag in cost report |
| ------------- | ----------- | ----------- |
| accounts | Yes | 
| accounts/workspaces | Yes | 
| accounts/workspaces/projects | Yes | 
| teamAccounts | Yes | 
| teamAccounts/workspaces | Yes | 
| teamAccounts/workspaces/projects | Yes | 

## Microsoft.MachineLearningModelManagement
| Resource type | Supports tags | Tag in cost report |
| ------------- | ----------- | ----------- |
| accounts | Yes | 

## Microsoft.MachineLearningServices
| Resource type | Supports tags | Tag in cost report |
| ------------- | ----------- | ----------- |
| workspaces | Yes | 
| workspaces/computes | No |  No |

## Microsoft.ManagedIdentity
| Resource type | Supports tags | Tag in cost report |
| ------------- | ----------- | ----------- |
| Identities | No |  No |
| userAssignedIdentities | Yes | 

## Microsoft.Management
| Resource type | Supports tags | Tag in cost report |
| ------------- | ----------- | ----------- |
| getEntities | No |  No |
| managementGroups | No |  No |
| resources | No |  No |
| startTenantBackfill | No |  No |
| tenantBackfillStatus | No |  No |

## Microsoft.Maps
| Resource type | Supports tags | Tag in cost report |
| ------------- | ----------- | ----------- |
| accounts | Yes | 
| accounts/eventGridFilters | No |  No |

## Microsoft.Marketplace
| Resource type | Supports tags | Tag in cost report |
| ------------- | ----------- | ----------- |
| offers | No |  No |
| offerTypes | No |  No |
| offerTypes/publishers | No |  No |
| offerTypes/publishers/offers | No |  No |
| offerTypes/publishers/offers/plans | No |  No |
| offerTypes/publishers/offers/plans/agreements | No |  No |
| offerTypes/publishers/offers/plans/configs | No |  No |
| offerTypes/publishers/offers/plans/configs/importImage | No |  No |
| privategalleryitems | No |  No |
| products | No |  No |

## Microsoft.MarketplaceApps
| Resource type | Supports tags | Tag in cost report |
| ------------- | ----------- | ----------- |
| classicDevServices | Yes | 
| updateCommunicationPreference | No |  No |

## Microsoft.MarketplaceOrdering
| Resource type | Supports tags | Tag in cost report |
| ------------- | ----------- | ----------- |
| agreements | No |  No |
| offertypes | No |  No |

## Microsoft.Media
| Resource type | Supports tags | Tag in cost report |
| ------------- | ----------- | ----------- |
| mediaservices | Yes | 
| mediaservices/accountFilters | No |  No |
| mediaservices/assets | No |  No |
| mediaservices/assets/assetFilters | No |  No |
| mediaservices/contentKeyPolicies | No |  No |
| mediaservices/eventGridFilters | No |  No |
| mediaservices/liveEventOperations | No |  No |
| mediaservices/liveEvents | Yes | 
| mediaservices/liveEvents/liveOutputs | No |  No |
| mediaservices/liveOutputOperations | No |  No |
| mediaservices/streamingEndpointOperations | No |  No |
| mediaservices/streamingEndpoints | Yes | 
| mediaservices/streamingLocators | No |  No |
| mediaservices/streamingPolicies | No |  No |
| mediaservices/transforms | No |  No |
| mediaservices/transforms/jobs | No |  No |

## Microsoft.Migrate
| Resource type | Supports tags | Tag in cost report |
| ------------- | ----------- | ----------- |
| projects | Yes | 

## Microsoft.Network
| Resource type | Supports tags | Tag in cost report |
| ------------- | ----------- | ----------- |
| applicationGateways | Yes | 
| applicationSecurityGroups | Yes | 
| azureFirewallFqdnTags | No |  No |
| azureFirewalls | Yes | 
| bgpServiceCommunities | No |  No |
| connections | Yes | 
| ddosCustomPolicies | Yes | 
| ddosProtectionPlans | Yes | 
| dnsOperationStatuses | No |  No |
| dnszones | Yes | 
| dnszones/A | No |  No |
| dnszones/AAAA | No |  No |
| dnszones/all | No |  No |
| dnszones/CAA | No |  No |
| dnszones/CNAME | No |  No |
| dnszones/MX | No |  No |
| dnszones/NS | No |  No |
| dnszones/PTR | No |  No |
| dnszones/recordsets | No |  No |
| dnszones/SOA | No |  No |
| dnszones/SRV | No |  No |
| dnszones/TXT | No |  No |
| expressRouteCircuits | Yes (tag value doesn't currently appear in cost report) | 
| expressRouteServiceProviders | No |  No |
| frontdoors | Yes | 
| frontdoorWebApplicationFirewallPolicies | Yes | 
| getDnsResourceReference | No |  No |
| interfaceEndpoints | Yes | 
| internalNotify | No |  No |
| loadBalancers | Yes | 
| localNetworkGateways | Yes | 
| natGateways | Yes | 
| networkIntentPolicies | Yes | 
| networkInterfaces | Yes | 
| networkProfiles | Yes | 
| networkSecurityGroups | Yes | 
| networkWatchers | Yes (tag value doesn't currently appear in cost report) | 
| networkWatchers/connectionMonitors | Yes | 
| networkWatchers/lenses | Yes | 
| networkWatchers/pingMeshes | Yes | 
| privateLinkServices | Yes | 
| publicIPAddresses | Yes | 
| publicIPPrefixes | Yes | 
| routeFilters | Yes | 
| routeTables | Yes | 
| serviceEndpointPolicies | Yes | 
| trafficManagerGeographicHierarchies | No |  No |
| trafficmanagerprofiles | Yes | 
| trafficmanagerprofiles/heatMaps | No |  No |
| virtualHubs | Yes | 
| virtualNetworkGateways | Yes | 
| virtualNetworks | Yes | 
| virtualNetworks/subnets | No |  No |
| virtualNetworkTaps | Yes | 
| virtualWans | Yes | 
| vpnGateways | Yes (tag value doesn't currently appear in cost report) | 
| vpnSites | Yes | 
| webApplicationFirewallPolicies | Yes | 

## Microsoft.NotificationHubs
| Resource type | Supports tags | Tag in cost report |
| ------------- | ----------- | ----------- |
| namespaces | Yes | 
| namespaces/notificationHubs | Yes | 

## Microsoft.OperationalInsights
| Resource type | Supports tags | Tag in cost report |
| ------------- | ----------- | ----------- |
| devices | No |  No |
| linkTargets | No |  No |
| storageInsightConfigs | No |  No |
| workspaces | Yes | 
| workspaces/dataSources | No |  No |
| workspaces/linkedServices | No |  No |
| workspaces/query | No |  No |

## Microsoft.OperationsManagement
| Resource type | Supports tags | Tag in cost report |
| ------------- | ----------- | ----------- |
| managementassociations | No |  No |
| managementconfigurations | Yes | 
| solutions | Yes | 
| views | Yes | 

## Microsoft.PolicyInsights
| Resource type | Supports tags | Tag in cost report |
| ------------- | ----------- | ----------- |
| policyEvents | No |  No |
| policyStates | No |  No |
| policyTrackedResources | No |  No |
| remediations | No |  No |

## Microsoft.Portal
| Resource type | Supports tags | Tag in cost report |
| ------------- | ----------- | ----------- |
| consoles | No |  No |
| dashboards | Yes | 
| userSettings | No |  No |

## Microsoft.PowerBI
| Resource type | Supports tags | Tag in cost report |
| ------------- | ----------- | ----------- |
| workspaceCollections | Yes | 

## Microsoft.PowerBIDedicated
| Resource type | Supports tags | Tag in cost report |
| ------------- | ----------- | ----------- |
| capacities | Yes | 

## Microsoft.ProjectOxford
| Resource type | Supports tags | Tag in cost report |
| ------------- | ----------- | ----------- |
| accounts | Yes | 

## Microsoft.RecoveryServices
| Resource type | Supports tags | Tag in cost report |
| ------------- | ----------- | ----------- |
| backupProtectedItems | No |  No |
| vaults | Yes | 

## Microsoft.Relay
| Resource type | Supports tags | Tag in cost report |
| ------------- | ----------- | ----------- |
| namespaces | Yes | 
| namespaces/authorizationrules | No |  No |
| namespaces/hybridconnections | No |  No |
| namespaces/hybridconnections/authorizationrules | No |  No |
| namespaces/wcfrelays | No |  No |
| namespaces/wcfrelays/authorizationrules | No |  No |

## Microsoft.ResourceGraph
| Resource type | Supports tags | Tag in cost report |
| ------------- | ----------- | ----------- |
| resources | No |  No |
| subscriptionsStatus | No |  No |

## Microsoft.ResourceHealth
| Resource type | Supports tags | Tag in cost report |
| ------------- | ----------- | ----------- |
| availabilityStatuses | No |  No |
| childAvailabilityStatuses | No |  No |
| childResources | No |  No |
| events | No |  No |
| impactedResources | No |  No |
| notifications | No |  No |

## Microsoft.Resources
| Resource type | Supports tags | Tag in cost report |
| ------------- | ----------- | ----------- |
| deployments | No |  No |
| deployments/operations | No |  No |
| links | No |  No |
| notifyResourceJobs | No |  No |
| providers | No |  No |
| resourceGroups | No |  No |
| resources | No |  No |
| subscriptions | No |  No |
| subscriptions/providers | No |  No |
| subscriptions/resourceGroups | No |  No |
| subscriptions/resourcegroups/resources | No |  No |
| subscriptions/resources | No |  No |
| subscriptions/tagnames | No |  No |
| subscriptions/tagNames/tagValues | No |  No |
| tenants | No |  No |

## Microsoft.SaaS
| Resource type | Supports tags | Tag in cost report |
| ------------- | ----------- | ----------- |
| applications | Yes | 
| saasresources | No |  No |

## Microsoft.Scheduler
| Resource type | Supports tags | Tag in cost report |
| ------------- | ----------- | ----------- |
| flows | Yes | 
| jobcollections | Yes | 

## Microsoft.Search
| Resource type | Supports tags | Tag in cost report |
| ------------- | ----------- | ----------- |
| resourceHealthMetadata | No |  No |
| searchServices | Yes | 

## Microsoft.Security
| Resource type | Supports tags | Tag in cost report |
| ------------- | ----------- | ----------- |
| advancedThreatProtectionSettings | No |  No |
| alerts | No |  No |
| allowedConnections | No |  No |
| appliances | No |  No |
| applicationWhitelistings | No |  No |
| AutoProvisioningSettings | No |  No |
| Compliances | No |  No |
| dataCollectionAgents | No |  No |
| discoveredSecuritySolutions | No |  No |
| externalSecuritySolutions | No |  No |
| InformationProtectionPolicies | No |  No |
| jitNetworkAccessPolicies | No |  No |
| monitoring | No |  No |
| monitoring/antimalware | No |  No |
| monitoring/baseline | No |  No |
| monitoring/patch | No |  No |
| policies | No |  No |
| pricings | No |  No |
| securityContacts | No |  No |
| securitySolutions | No |  No |
| securitySolutionsReferenceData | No |  No |
| securityStatus | No |  No |
| securityStatus/endpoints | No |  No |
| securityStatus/subnets | No |  No |
| securityStatus/virtualMachines | No |  No |
| securityStatuses | No |  No |
| securityStatusesSummaries | No |  No |
| settings | No |  No |
| tasks | No |  No |
| topologies | No |  No |
| workspaceSettings | No |  No |

## Microsoft.SecurityGraph
| Resource type | Supports tags | Tag in cost report |
| ------------- | ----------- | ----------- |
| diagnosticSettings | No |  No |
| diagnosticSettingsCategories | No |  No |

## Microsoft.ServiceBus
| Resource type | Supports tags | Tag in cost report |
| ------------- | ----------- | ----------- |
| namespaces | Yes | 
| namespaces/authorizationrules | No |  No |
| namespaces/disasterrecoveryconfigs | No |  No |
| namespaces/eventgridfilters | No |  No |
| namespaces/queues | No |  No |
| namespaces/queues/authorizationrules | No |  No |
| namespaces/topics | No |  No |
| namespaces/topics/authorizationrules | No |  No |
| namespaces/topics/subscriptions | No |  No |
| namespaces/topics/subscriptions/rules | No |  No |
| premiumMessagingRegions | No |  No |

## Microsoft.ServiceFabric
| Resource type | Supports tags | Tag in cost report |
| ------------- | ----------- | ----------- |
| clusters | Yes | 
| clusters/applications | No |  No |

## Microsoft.ServiceFabricMesh
| Resource type | Supports tags | Tag in cost report |
| ------------- | ----------- | ----------- |
| applications | Yes | 
| gateways | Yes | 
| networks | Yes | 
| secrets | Yes | 
| volumes | Yes | 

## Microsoft.SignalRService
| Resource type | Supports tags | Tag in cost report |
| ------------- | ----------- | ----------- |
| SignalR | Yes | 

## Microsoft.Solutions
| Resource type | Supports tags | Tag in cost report |
| ------------- | ----------- | ----------- |
| applianceDefinitions | Yes | 
| appliances | Yes | 
| applicationDefinitions | Yes | 
| applications | Yes | 
| jitRequests | Yes | 

## Microsoft.SQL
| Resource type | Supports tags | Tag in cost report |
| ------------- | ----------- | ----------- |
| managedInstances | Yes |
| managedInstances/databases | Yes (see note below) |
| managedInstances/databases/backupShortTermRetentionPolicies | No | No |
| managedInstances/databases/schemas/tables/columns/sensitivityLabels | No | No |
| managedInstances/databases/vulnerabilityAssessments | No | No |
| managedInstances/databases/vulnerabilityAssessments/rules/baselines | No | No |
| managedInstances/encryptionProtector | No | No |
| managedInstances/keys | No | No |
| managedInstances/restorableDroppedDatabases/backupShortTermRetentionPolicies | No | No |
| managedInstances/vulnerabilityAssessments | No | No |
| servers | Yes | 
| servers/administrators | No |  No |
| servers/communicationLinks | No |  No |
| servers/databases | Yes (see note below) | 
| servers/encryptionProtector | No |  No |
| servers/firewallRules | No |  No |
| servers/keys | No |  No |
| servers/restorableDroppedDatabases | No |  No |
| servers/serviceobjectives | No |  No |
| servers/tdeCertificates | No |  No |

> [!NOTE]
> The Master database doesn't support tags, but other databases, including Azure SQL Data Warehouse databases, support tags. Azure SQL Data Warehouse databases must be in Active (not Paused) state.


## Microsoft.SqlVirtualMachine
| Resource type | Supports tags | Tag in cost report |
| ------------- | ----------- | ----------- |
| SqlVirtualMachineGroups | Yes | 
| SqlVirtualMachineGroups/AvailabilityGroupListeners | No |  No |
| SqlVirtualMachines | Yes | 

## Microsoft.Storage
| Resource type | Supports tags | Tag in cost report |
| ------------- | ----------- | ----------- |
| storageAccounts | Yes | 
| storageAccounts/blobServices | No |  No |
| storageAccounts/fileServices | No |  No |
| storageAccounts/queueServices | No |  No |
| storageAccounts/services | No |  No |
| storageAccounts/tableServices | No |  No |
| usages | No |  No |

## Microsoft.StorageSync
| Resource type | Supports tags | Tag in cost report |
| ------------- | ----------- | ----------- |
| storageSyncServices | Yes | 
| storageSyncServices/registeredServers | No |  No |
| storageSyncServices/syncGroups | No |  No |
| storageSyncServices/syncGroups/cloudEndpoints | No |  No |
| storageSyncServices/syncGroups/serverEndpoints | No |  No |
| storageSyncServices/workflows | No |  No |

## Microsoft.StorSimple
| Resource type | Supports tags | Tag in cost report |
| ------------- | ----------- | ----------- |
| managers | Yes | 

## Microsoft.StreamAnalytics
| Resource type | Supports tags | Tag in cost report |
| ------------- | ----------- | ----------- |
| streamingjobs | Yes (see note below) | 
| streamingjobs/diagnosticSettings | No |  No |

> [!NOTE]
> You can't add a tag when streamingjobs is running. Stop the resource to add a tag.

## Microsoft.Subscription
| Resource type | Supports tags | Tag in cost report |
| ------------- | ----------- | ----------- |
| CreateSubscription | No |  No |
| SubscriptionDefinitions | No |  No |
| SubscriptionOperations | No |  No |

## microsoft.support
| Resource type | Supports tags | Tag in cost report |
| ------------- | ----------- | ----------- |
| supporttickets | No |  No |

## Microsoft.TerraformOSS
| Resource type | Supports tags | Tag in cost report |
| ------------- | ----------- | ----------- |
| providerRegistrations | Yes | 
| resources | Yes | 

## Microsoft.TimeSeriesInsights
| Resource type | Supports tags | Tag in cost report |
| ------------- | ----------- | ----------- |
| environments | Yes | 
| environments/accessPolicies | No |  No |
| environments/eventsources | Yes | 
| environments/referenceDataSets | Yes | 

## microsoft.visualstudio
| Resource type | Supports tags | Tag in cost report |
| ------------- | ----------- | ----------- |
| account | Yes | 
| account/extension | Yes | 
| account/project | Yes | 

## Microsoft.Web
| Resource type | Supports tags | Tag in cost report |
| ------------- | ----------- | ----------- |
| apiManagementAccounts | No |  No |
| apiManagementAccounts/apiAcls | No |  No |
| apiManagementAccounts/apis | No |  No |
| apiManagementAccounts/apis/apiAcls | No |  No |
| apiManagementAccounts/apis/connectionAcls | No |  No |
| apiManagementAccounts/apis/connections | No |  No |
| apiManagementAccounts/apis/connections/connectionAcls | No |  No |
| apiManagementAccounts/apis/localizedDefinitions | No |  No |
| apiManagementAccounts/connectionAcls | No |  No |
| apiManagementAccounts/connections | No |  No |
| billingMeters | No |  No |
| certificates | Yes | 
| connectionGateways | Yes | 
| connections | Yes | 
| customApis | Yes | 
| deletedSites | No |  No |
| functions | No |  No |
| hostingEnvironments | Yes | 
| hostingEnvironments/multiRolePools | No |  No |
| hostingEnvironments/multiRolePools/instances | No |  No |
| hostingEnvironments/workerPools | No |  No |
| hostingEnvironments/workerPools/instances | No |  No |
| publishingUsers | No |  No |
| recommendations | No |  No |
| resourceHealthMetadata | No |  No |
| runtimes | No |  No |
| serverFarms | Yes | 
| serverFarms/workers | No |  No |
| sites | Yes | 
| sites/domainOwnershipIdentifiers | No |  No |
| sites/hostNameBindings | No |  No |
| sites/instances | No |  No |
| sites/instances/extensions | No |  No |
| sites/premieraddons | Yes | 
| sites/recommendations | No |  No |
| sites/resourceHealthMetadata | No |  No |
| sites/slots | Yes | 
| sites/slots/hostNameBindings | No |  No |
| sites/slots/instances | No |  No |
| sites/slots/instances/extensions | No |  No |
| sourceControls | No |  No |
| validate | No |  No |
| verifyHostingEnvironmentVnet | No |  No |

## Microsoft.WindowsDefenderATP
| Resource type | Supports tags | Tag in cost report |
| ------------- | ----------- | ----------- |
| diagnosticSettings | No |  No |
| diagnosticSettingsCategories | No |  No |

## Microsoft.WindowsIoT
| Resource type | Supports tags | Tag in cost report |
| ------------- | ----------- | ----------- |
| DeviceServices | Yes | 

## Microsoft.WorkloadMonitor
| Resource type | Supports tags | Tag in cost report |
| ------------- | ----------- | ----------- |
| components | No |  No |
| componentsSummary | No |  No |
| monitorInstances | No |  No |
| monitorInstancesSummary | No |  No |
| monitors | No |  No |
| notificationSettings | No |  No |

## Next steps
To learn how to apply tags to resources, see [Use tags to organize your Azure resources](resource-group-using-tags.md).

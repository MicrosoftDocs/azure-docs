---
title: Complete mode deletion
description: Shows how resource types handle complete mode deletion in Azure Resource Manager templates.
ms.topic: conceptual
ms.date: 06/15/2020
---

# Deletion of Azure resources for complete mode deployments

This article describes how resource types handle deletion when not in a template that is deployed in complete mode.

The resource types marked with **Yes** are deleted when the type isn't in the template deployed with complete mode.

The resource types marked with **No** aren't automatically deleted when not in the template; however, they're deleted if the parent resource is deleted. For a full description of the behavior, see [Azure Resource Manager deployment modes](deployment-modes.md).

If you deploy to [more than one resource group in a template](cross-resource-group-deployment.md), resources in the resource group specified in the deployment operation are eligible to be deleted. Resources in the secondary resource groups aren't deleted.

Jump to a resource provider namespace:
> [!div class="op_single_selector"]
> - [Microsoft.AAD](#microsoftaad)
> - [Microsoft.Addons](#microsoftaddons)
> - [Microsoft.ADHybridHealthService](#microsoftadhybridhealthservice)
> - [Microsoft.Advisor](#microsoftadvisor)
> - [Microsoft.AlertsManagement](#microsoftalertsmanagement)
> - [Microsoft.AnalysisServices](#microsoftanalysisservices)
> - [Microsoft.ApiManagement](#microsoftapimanagement)
> - [Microsoft.AppConfiguration](#microsoftappconfiguration)
> - [Microsoft.AppPlatform](#microsoftappplatform)
> - [Microsoft.Attestation](#microsoftattestation)
> - [Microsoft.Authorization](#microsoftauthorization)
> - [Microsoft.Automation](#microsoftautomation)
> - [Microsoft.AVS](#microsoftavs)
> - [Microsoft.Azure.Geneva](#microsoftazuregeneva)
> - [Microsoft.AzureActiveDirectory](#microsoftazureactivedirectory)
> - [Microsoft.AzureData](#microsoftazuredata)
> - [Microsoft.AzureStack](#microsoftazurestack)
> - [Microsoft.AzureStackHCI](#microsoftazurestackhci)
> - [Microsoft.AzureStackResourceMonitor](#microsoftazurestackresourcemonitor)
> - [Microsoft.Batch](#microsoftbatch)
> - [Microsoft.Billing](#microsoftbilling)
> - [Microsoft.BingMaps](#microsoftbingmaps)
> - [Microsoft.Blockchain](#microsoftblockchain)
> - [Microsoft.BlockchainTokens](#microsoftblockchaintokens)
> - [Microsoft.Blueprint](#microsoftblueprint)
> - [Microsoft.BotService](#microsoftbotservice)
> - [Microsoft.Cache](#microsoftcache)
> - [Microsoft.Capacity](#microsoftcapacity)
> - [Microsoft.Cdn](#microsoftcdn)
> - [Microsoft.CertificateRegistration](#microsoftcertificateregistration)
> - [Microsoft.ChangeAnalysis](#microsoftchangeanalysis)
> - [Microsoft.ClassicCompute](#microsoftclassiccompute)
> - [Microsoft.ClassicInfrastructureMigrate](#microsoftclassicinfrastructuremigrate)
> - [Microsoft.ClassicNetwork](#microsoftclassicnetwork)
> - [Microsoft.ClassicStorage](#microsoftclassicstorage)
> - [Microsoft.CognitiveServices](#microsoftcognitiveservices)
> - [Microsoft.Commerce](#microsoftcommerce)
> - [Microsoft.Compute](#microsoftcompute)
> - [Microsoft.Consumption](#microsoftconsumption)
> - [Microsoft.ContainerInstance](#microsoftcontainerinstance)
> - [Microsoft.ContainerRegistry](#microsoftcontainerregistry)
> - [Microsoft.ContainerService](#microsoftcontainerservice)
> - [Microsoft.CostManagement](#microsoftcostmanagement)
> - [Microsoft.CustomerLockbox](#microsoftcustomerlockbox)
> - [Microsoft.CustomProviders](#microsoftcustomproviders)
> - [Microsoft.DataBox](#microsoftdatabox)
> - [Microsoft.DataBoxEdge](#microsoftdataboxedge)
> - [Microsoft.Databricks](#microsoftdatabricks)
> - [Microsoft.DataCatalog](#microsoftdatacatalog)
> - [Microsoft.DataFactory](#microsoftdatafactory)
> - [Microsoft.DataLakeAnalytics](#microsoftdatalakeanalytics)
> - [Microsoft.DataLakeStore](#microsoftdatalakestore)
> - [Microsoft.DataMigration](#microsoftdatamigration)
> - [Microsoft.DataProtection](#microsoftdataprotection)
> - [Microsoft.DataShare](#microsoftdatashare)
> - [Microsoft.DBforMariaDB](#microsoftdbformariadb)
> - [Microsoft.DBforMySQL](#microsoftdbformysql)
> - [Microsoft.DBforPostgreSQL](#microsoftdbforpostgresql)
> - [Microsoft.DeploymentManager](#microsoftdeploymentmanager)
> - [Microsoft.DesktopVirtualization](#microsoftdesktopvirtualization)
> - [Microsoft.Devices](#microsoftdevices)
> - [Microsoft.DevOps](#microsoftdevops)
> - [Microsoft.DevSpaces](#microsoftdevspaces)
> - [Microsoft.DevTestLab](#microsoftdevtestlab)
> - [Microsoft.DigitalTwins](#microsoftdigitaltwins)
> - [Microsoft.DocumentDB](#microsoftdocumentdb)
> - [Microsoft.DomainRegistration](#microsoftdomainregistration)
> - [Microsoft.DynamicsLcs](#microsoftdynamicslcs)
> - [Microsoft.EnterpriseKnowledgeGraph](#microsoftenterpriseknowledgegraph)
> - [Microsoft.EventGrid](#microsofteventgrid)
> - [Microsoft.EventHub](#microsofteventhub)
> - [Microsoft.Experimentation](#microsoftexperimentation)
> - [Microsoft.Falcon](#microsoftfalcon)
> - [Microsoft.Features](#microsoftfeatures)
> - [Microsoft.Gallery](#microsoftgallery)
> - [Microsoft.Genomics](#microsoftgenomics)
> - [Microsoft.GuestConfiguration](#microsoftguestconfiguration)
> - [Microsoft.HanaOnAzure](#microsofthanaonazure)
> - [Microsoft.HardwareSecurityModules](#microsofthardwaresecuritymodules)
> - [Microsoft.HDInsight](#microsofthdinsight)
> - [Microsoft.HealthcareApis](#microsofthealthcareapis)
> - [Microsoft.HybridCompute](#microsofthybridcompute)
> - [Microsoft.HybridData](#microsofthybriddata)
> - [Microsoft.HybridNetwork](#microsofthybridnetwork)
> - [Microsoft.Hydra](#microsofthydra)
> - [Microsoft.ImportExport](#microsoftimportexport)
> - [Microsoft.Intune](#microsoftintune)
> - [Microsoft.IoTCentral](#microsoftiotcentral)
> - [Microsoft.IoTSpaces](#microsoftiotspaces)
> - [Microsoft.KeyVault](#microsoftkeyvault)
> - [Microsoft.Kubernetes](#microsoftkubernetes)
> - [Microsoft.KubernetesConfiguration](#microsoftkubernetesconfiguration)
> - [Microsoft.Kusto](#microsoftkusto)
> - [Microsoft.LabServices](#microsoftlabservices)
> - [Microsoft.Logic](#microsoftlogic)
> - [Microsoft.MachineLearning](#microsoftmachinelearning)
> - [Microsoft.MachineLearningServices](#microsoftmachinelearningservices)
> - [Microsoft.Maintenance](#microsoftmaintenance)
> - [Microsoft.ManagedIdentity](#microsoftmanagedidentity)
> - [Microsoft.ManagedNetwork](#microsoftmanagednetwork)
> - [Microsoft.ManagedServices](#microsoftmanagedservices)
> - [Microsoft.Management](#microsoftmanagement)
> - [Microsoft.Maps](#microsoftmaps)
> - [Microsoft.Marketplace](#microsoftmarketplace)
> - [Microsoft.MarketplaceApps](#microsoftmarketplaceapps)
> - [Microsoft.MarketplaceOrdering](#microsoftmarketplaceordering)
> - [Microsoft.Media](#microsoftmedia)
> - [Microsoft.Microservices4Spring](#microsoftmicroservices4spring)
> - [Microsoft.Migrate](#microsoftmigrate)
> - [Microsoft.MixedReality](#microsoftmixedreality)
> - [Microsoft.NetApp](#microsoftnetapp)
> - [Microsoft.Network](#microsoftnetwork)
> - [Microsoft.Notebooks](#microsoftnotebooks)
> - [Microsoft.NotificationHubs](#microsoftnotificationhubs)
> - [Microsoft.ObjectStore](#microsoftobjectstore)
> - [Microsoft.OffAzure](#microsoftoffazure)
> - [Microsoft.OperationalInsights](#microsoftoperationalinsights)
> - [Microsoft.OperationsManagement](#microsoftoperationsmanagement)
> - [Microsoft.Peering](#microsoftpeering)
> - [Microsoft.PolicyInsights](#microsoftpolicyinsights)
> - [Microsoft.Portal](#microsoftportal)
> - [Microsoft.PowerBI](#microsoftpowerbi)
> - [Microsoft.PowerBIDedicated](#microsoftpowerbidedicated)
> - [Microsoft.ProjectBabylon](#microsoftprojectbabylon)
> - [Microsoft.ProviderHub](#microsoftproviderhub)
> - [Microsoft.Quantum](#microsoftquantum)
> - [Microsoft.RecoveryServices](#microsoftrecoveryservices)
> - [Microsoft.RedHatOpenShift](#microsoftredhatopenshift)
> - [Microsoft.Relay](#microsoftrelay)
> - [Microsoft.ResourceGraph](#microsoftresourcegraph)
> - [Microsoft.ResourceHealth](#microsoftresourcehealth)
> - [Microsoft.Resources](#microsoftresources)
> - [Microsoft.SaaS](#microsoftsaas)
> - [Microsoft.Search](#microsoftsearch)
> - [Microsoft.Security](#microsoftsecurity)
> - [Microsoft.SecurityGraph](#microsoftsecuritygraph)
> - [Microsoft.SecurityInsights](#microsoftsecurityinsights)
> - [Microsoft.SerialConsole](#microsoftserialconsole)
> - [Microsoft.ServiceBus](#microsoftservicebus)
> - [Microsoft.ServiceFabric](#microsoftservicefabric)
> - [Microsoft.ServiceFabricMesh](#microsoftservicefabricmesh)
> - [Microsoft.Services](#microsoftservices)
> - [Microsoft.SignalRService](#microsoftsignalrservice)
> - [Microsoft.SoftwarePlan](#microsoftsoftwareplan)
> - [Microsoft.Solutions](#microsoftsolutions)
> - [Microsoft.SQL](#microsoftsql)
> - [Microsoft.SqlVirtualMachine](#microsoftsqlvirtualmachine)
> - [Microsoft.Storage](#microsoftstorage)
> - [Microsoft.StorageCache](#microsoftstoragecache)
> - [Microsoft.StorageReplication](#microsoftstoragereplication)
> - [Microsoft.StorageSync](#microsoftstoragesync)
> - [Microsoft.StorageSyncDev](#microsoftstoragesyncdev)
> - [Microsoft.StorageSyncInt](#microsoftstoragesyncint)
> - [Microsoft.StorSimple](#microsoftstorsimple)
> - [Microsoft.StreamAnalytics](#microsoftstreamanalytics)
> - [Microsoft.Subscription](#microsoftsubscription)
> - [Microsoft.Synapse](#microsoftsynapse)
> - [Microsoft.TimeSeriesInsights](#microsofttimeseriesinsights)
> - [Microsoft.Token](#microsofttoken)
> - [Microsoft.VirtualMachineImages](#microsoftvirtualmachineimages)
> - [Microsoft.VMware](#microsoftvmware)
> - [Microsoft.VMwareCloudSimple](#microsoftvmwarecloudsimple)
> - [Microsoft.VMwareOnAzure](#microsoftvmwareonazure)
> - [Microsoft.VnfManager](#microsoftvnfmanager)
> - [Microsoft.VSOnline](#microsoftvsonline)
> - [Microsoft.Web](#microsoftweb)
> - [Microsoft.WindowsDefenderATP](#microsoftwindowsdefenderatp)
> - [Microsoft.WindowsESU](#microsoftwindowsesu)
> - [Microsoft.WindowsIoT](#microsoftwindowsiot)
> - [Microsoft.WorkloadBuilder](#microsoftworkloadbuilder)
> - [Microsoft.WorkloadMonitor](#microsoftworkloadmonitor)

## Microsoft.AAD

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | DomainServices | Yes |
> | DomainServices / oucontainer | No |

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
> | servicehealthmetrics | No |
> | services | No |

## Microsoft.Advisor

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | configurations | No |
> | generateRecommendations | No |
> | metadata | No |
> | recommendations | No |
> | suppressions | No |

## Microsoft.AlertsManagement

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | actionRules | Yes |
> | alerts | No |
> | alertsList | No |
> | alertsMetaData | No |
> | alertsSummary | No |
> | alertsSummaryList | No |
> | smartDetectorAlertRules | Yes |
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

## Microsoft.AppConfiguration

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | configurationStores | Yes |
> | configurationStores / eventGridFilters | No |

## Microsoft.AppPlatform

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | Spring | Yes |
> | Spring / apps | No |
> | Spring / apps / deployments | No |

## Microsoft.Attestation

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | attestationProviders | Yes |

## Microsoft.Authorization

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | classicAdministrators | No |
> | dataAliases | No |
> | denyAssignments | No |
> | elevateAccess | No |
> | findOrphanRoleAssignments | No |
> | locks | No |
> | permissions | No |
> | policyAssignments | No |
> | policyDefinitions | No |
> | policySetDefinitions | No |
> | privateLinkAssociations | No |
> | providerOperations | No |
> | resourceManagementPrivateLinks | No |
> | roleAssignments | No |
> | roleAssignmentsUsageMetrics | No |
> | roleDefinitions | No |

## Microsoft.Automation

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | automationAccounts | Yes |
> | automationAccounts / configurations | Yes |
> | automationAccounts / jobs | No |
> | automationAccounts / privateEndpointConnectionProxies | No |
> | automationAccounts / privateEndpointConnections | No |
> | automationAccounts / privateLinkResources | No |
> | automationAccounts / runbooks | Yes |
> | automationAccounts / softwareUpdateConfigurations | No |
> | automationAccounts / webhooks | No |

## Microsoft.AVS

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | privateClouds | Yes |
> | privateClouds / authorizations | No |
> | privateClouds / clusters | No |
> | privateClouds / hcxEnterpriseSites | No |

## Microsoft.Azure.Geneva

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | environments | No |
> | environments / accounts | No |
> | environments / accounts / namespaces | No |
> | environments / accounts / namespaces / configurations | No |

## Microsoft.AzureActiveDirectory

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | b2cDirectories | Yes |
> | b2ctenants | No |

## Microsoft.AzureData

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | dataControllers | Yes |
> | hybridDataManagers | Yes |
> | postgresInstances | Yes |
> | sqlInstances | Yes |
> | sqlManagedInstances | Yes |
> | sqlServerInstances | Yes |
> | sqlServerRegistrations | Yes |
> | sqlServerRegistrations / sqlServers | No |

## Microsoft.AzureStack

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | cloudManifestFiles | No |
> | registrations | Yes |
> | registrations / customerSubscriptions | No |
> | registrations / products | No |

## Microsoft.AzureStackHCI

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | clusters | Yes |

## Microsoft.AzureStackResourceMonitor

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | storageAccountMonitor | Yes |

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
> | billingAccounts / agreements | No |
> | billingAccounts / billingPermissions | No |
> | billingAccounts / billingProfiles | No |
> | billingAccounts / billingProfiles / billingPermissions | No |
> | billingAccounts / billingProfiles / billingRoleAssignments | No |
> | billingAccounts / billingProfiles / billingRoleDefinitions | No |
> | billingAccounts / billingProfiles / billingSubscriptions | No |
> | billingAccounts / billingProfiles / createBillingRoleAssignment | No |
> | billingAccounts / billingProfiles / customers | No |
> | billingAccounts / billingProfiles / instructions | No |
> | billingAccounts / billingProfiles / invoices | No |
> | billingAccounts / billingProfiles / invoices / pricesheet | No |
> | billingAccounts / billingProfiles / invoices / transactions | No |
> | billingAccounts / billingProfiles / invoiceSections | No |
> | billingAccounts / billingProfiles / invoiceSections / billingPermissions | No |
> | billingAccounts / billingProfiles / invoiceSections / billingRoleAssignments | No |
> | billingAccounts / billingProfiles / invoiceSections / billingRoleDefinitions | No |
> | billingAccounts / billingProfiles / invoiceSections / billingSubscriptions | No |
> | billingAccounts / billingProfiles / invoiceSections / createBillingRoleAssignment | No |
> | billingAccounts / billingProfiles / invoiceSections / initiateTransfer | No |
> | billingAccounts / billingProfiles / invoiceSections / products | No |
> | billingAccounts / billingProfiles / invoiceSections / products / transfer | No |
> | billingAccounts / billingProfiles / invoiceSections / products / updateAutoRenew | No |
> | billingAccounts / billingProfiles / invoiceSections / transactions | No |
> | billingAccounts / billingProfiles / invoiceSections / transfers | No |
> | billingAccounts / BillingProfiles / patchOperations | No |
> | billingAccounts / billingProfiles / paymentMethods | No |
> | billingAccounts / billingProfiles / policies | No |
> | billingAccounts / billingProfiles / pricesheet | No |
> | billingAccounts / billingProfiles / pricesheetDownloadOperations | No |
> | billingAccounts / billingProfiles / products | No |
> | billingAccounts / billingProfiles / transactions | No |
> | billingAccounts / billingRoleAssignments | No |
> | billingAccounts / billingRoleDefinitions | No |
> | billingAccounts / billingSubscriptions | No |
> | billingAccounts / billingSubscriptions / invoices | No |
> | billingAccounts / createBillingRoleAssignment | No |
> | billingAccounts / createInvoiceSectionOperations | No |
> | billingAccounts / customers | No |
> | billingAccounts / customers / billingPermissions | No |
> | billingAccounts / customers / billingSubscriptions | No |
> | billingAccounts / customers / initiateTransfer | No |
> | billingAccounts / customers / policies | No |
> | billingAccounts / customers / products | No |
> | billingAccounts / customers / transactions | No |
> | billingAccounts / customers / transfers | No |
> | billingAccounts / departments | No |
> | billingAccounts / enrollmentAccounts | No |
> | billingAccounts / invoices | No |
> | billingAccounts / invoiceSections | No |
> | billingAccounts / invoiceSections / billingSubscriptionMoveOperations | No |
> | billingAccounts / invoiceSections / billingSubscriptions | No |
> | billingAccounts / invoiceSections / billingSubscriptions / transfer | No |
> | billingAccounts / invoiceSections / elevate | No |
> | billingAccounts / invoiceSections / initiateTransfer | No |
> | billingAccounts / invoiceSections / patchOperations | No |
> | billingAccounts / invoiceSections / productMoveOperations | No |
> | billingAccounts / invoiceSections / products | No |
> | billingAccounts / invoiceSections / products / transfer | No |
> | billingAccounts / invoiceSections / products / updateAutoRenew | No |
> | billingAccounts / invoiceSections / transactions | No |
> | billingAccounts / invoiceSections / transfers | No |
> | billingAccounts / lineOfCredit | No |
> | billingAccounts / patchOperations | No |
> | billingAccounts / paymentMethods | No |
> | billingAccounts / products | No |
> | billingAccounts / transactions | No |
> | billingPeriods | No |
> | billingPermissions | No |
> | billingProperty | No |
> | billingRoleAssignments | No |
> | billingRoleDefinitions | No |
> | createBillingRoleAssignment | No |
> | departments | No |
> | enrollmentAccounts | No |
> | invoices | No |
> | transfers | No |
> | transfers / acceptTransfer | No |
> | transfers / declineTransfer | No |
> | transfers / operationStatus | No |
> | transfers / validateTransfer | No |
> | validateAddress | No |

## Microsoft.BingMaps

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | mapApis | Yes |
> | updateCommunicationPreference | No |

## Microsoft.Blockchain

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | blockchainMembers | Yes |
> | cordaMembers | Yes |
> | watchers | Yes |

## Microsoft.BlockchainTokens

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | TokenServices | Yes |
> | TokenServices / BlockchainNetworks | No |
> | TokenServices / Groups | No |
> | TokenServices / Groups / Accounts | No |
> | TokenServices / TokenTemplates | No |

## Microsoft.Blueprint

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | blueprintAssignments | No |
> | blueprintAssignments / assignmentOperations | No |
> | blueprintAssignments / operations | No |
> | blueprints | No |
> | blueprints / artifacts | No |
> | blueprints / versions | No |
> | blueprints / versions / artifacts | No |

## Microsoft.BotService

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | botServices | Yes |
> | botServices / channels | No |
> | botServices / connections | No |
> | languages | No |
> | templates | No |

## Microsoft.Cache

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | Redis | Yes |
> | Redis / EventGridFilters | No |
> | Redis / privateEndpointConnectionProxies | No |
> | Redis / privateEndpointConnectionProxies / validate | No |
> | Redis / privateEndpointConnections | No |
> | Redis / privateLinkResources | No |
> | redisEnterprise | Yes |

## Microsoft.Capacity

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | appliedReservations | No |
> | autoQuotaIncrease | No |
> | calculateExchange | No |
> | calculatePrice | No |
> | calculatePurchasePrice | No |
> | catalogs | No |
> | commercialReservationOrders | No |
> | exchange | No |
> | placePurchaseOrder | No |
> | reservationOrders | No |
> | reservationOrders / calculateRefund | No |
> | reservationOrders / merge | No |
> | reservationOrders / reservations | No |
> | reservationOrders / reservations / revisions | No |
> | reservationOrders / return | No |
> | reservationOrders / split | No |
> | reservationOrders / swap | No |
> | reservations | No |
> | resourceProviders | No |
> | resources | No |
> | validateReservationOrder | No |

## Microsoft.Cdn

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | CdnWebApplicationFirewallManagedRuleSets | No |
> | CdnWebApplicationFirewallPolicies | Yes |
> | edgenodes | No |
> | profiles | Yes |
> | profiles / endpoints | Yes |
> | profiles / endpoints / customdomains | No |
> | profiles / endpoints / origingroups | No |
> | profiles / endpoints / origins | No |
> | validateProbe | No |

## Microsoft.CertificateRegistration

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | certificateOrders | Yes |
> | certificateOrders / certificates | No |
> | validateCertificateRegistrationInformation | No |

## Microsoft.ChangeAnalysis

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | profile | No |
> | resourceChanges | No |

## Microsoft.ClassicCompute

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | capabilities | No |
> | domainNames | Yes |
> | domainNames / capabilities | No |
> | domainNames / internalLoadBalancers | No |
> | domainNames / serviceCertificates | No |
> | domainNames / slots | No |
> | domainNames / slots / roles | No |
> | domainNames / slots / roles / metricDefinitions | No |
> | domainNames / slots / roles / metrics | No |
> | moveSubscriptionResources | No |
> | operatingSystemFamilies | No |
> | operatingSystems | No |
> | quotas | No |
> | resourceTypes | No |
> | validateSubscriptionMoveAvailability | No |
> | virtualMachines | Yes |
> | virtualMachines / diagnosticSettings | No |
> | virtualMachines / metricDefinitions | No |
> | virtualMachines / metrics | No |

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
> | expressRouteCrossConnections / peerings | No |
> | gatewaySupportedDevices | No |
> | networkSecurityGroups | Yes |
> | quotas | No |
> | reservedIps | Yes |
> | virtualNetworks | Yes |
> | virtualNetworks / remoteVirtualNetworkPeeringProxies | No |
> | virtualNetworks / virtualNetworkPeerings | No |

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
> | storageAccounts | Yes |
> | storageAccounts / blobServices | No |
> | storageAccounts / fileServices | No |
> | storageAccounts / metricDefinitions | No |
> | storageAccounts / metrics | No |
> | storageAccounts / queueServices | No |
> | storageAccounts / services | No |
> | storageAccounts / services / diagnosticSettings | No |
> | storageAccounts / services / metricDefinitions | No |
> | storageAccounts / services / metrics | No |
> | storageAccounts / tableServices | No |
> | storageAccounts / vmImages | No |
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
> | diskAccesses | Yes |
> | diskEncryptionSets | Yes |
> | disks | Yes |
> | galleries | Yes |
> | galleries / applications | No |
> | galleries / applications / versions | No |
> | galleries / images | No |
> | galleries / images / versions | No |
> | hostGroups | Yes |
> | hostGroups / hosts | Yes |
> | images | Yes |
> | proximityPlacementGroups | Yes |
> | restorePointCollections | Yes |
> | restorePointCollections / restorePoints | No |
> | sharedVMExtensions | Yes |
> | sharedVMExtensions / versions | No |
> | sharedVMImages | Yes |
> | sharedVMImages / versions | No |
> | snapshots | Yes |
> | sshPublicKeys | Yes |
> | swiftlets | Yes |
> | virtualMachines | Yes |
> | virtualMachines / extensions | Yes |
> | virtualMachines / metricDefinitions | No |
> | virtualMachines / runCommands | Yes |
> | virtualMachineScaleSets | Yes |
> | virtualMachineScaleSets / extensions | No |
> | virtualMachineScaleSets / networkInterfaces | No |
> | virtualMachineScaleSets / publicIPAddresses | No |
> | virtualMachineScaleSets / virtualMachines | No |
> | virtualMachineScaleSets / virtualMachines / networkInterfaces | No |

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
> | ReservationRecommendationDetails | No |
> | ReservationRecommendations | No |
> | ReservationSummaries | No |
> | ReservationTransactions | No |
> | Tags | No |
> | tenants | No |
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
> | registries / agentPools | Yes |
> | registries / builds | No |
> | registries / builds / cancel | No |
> | registries / builds / getLogLink | No |
> | registries / buildTasks | Yes |
> | registries / buildTasks / steps | No |
> | registries / eventGridFilters | No |
> | registries / exportPipelines | No |
> | registries / generateCredentials | No |
> | registries / getBuildSourceUploadUrl | No |
> | registries / GetCredentials | No |
> | registries / importImage | No |
> | registries / importPipelines | No |
> | registries / pipelineRuns | No |
> | registries / privateEndpointConnectionProxies | No |
> | registries / privateEndpointConnectionProxies / validate | No |
> | registries / privateEndpointConnections | No |
> | registries / privateLinkResources | No |
> | registries / queueBuild | No |
> | registries / regenerateCredential | No |
> | registries / regenerateCredentials | No |
> | registries / replications | Yes |
> | registries / runs | No |
> | registries / runs / cancel | No |
> | registries / scheduleRun | No |
> | registries / scopeMaps | No |
> | registries / taskRuns | No |
> | registries / tasks | Yes |
> | registries / tokens | No |
> | registries / updatePolicies | No |
> | registries / webhooks | Yes |
> | registries / webhooks / getCallbackConfig | No |
> | registries / webhooks / ping | No |

## Microsoft.ContainerService

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | containerServices | Yes |
> | managedClusters | Yes |
> | openShiftManagedClusters | Yes |

## Microsoft.CostManagement

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | Alerts | No |
> | BillingAccounts | No |
> | Budgets | No |
> | CloudConnectors | No |
> | Connectors | Yes |
> | costAllocationRules | No |
> | Departments | No |
> | Dimensions | No |
> | EnrollmentAccounts | No |
> | Exports | No |
> | ExternalBillingAccounts | No |
> | ExternalBillingAccounts / Alerts | No |
> | ExternalBillingAccounts / Dimensions | No |
> | ExternalBillingAccounts / Forecast | No |
> | ExternalBillingAccounts / Query | No |
> | ExternalSubscriptions | No |
> | ExternalSubscriptions / Alerts | No |
> | ExternalSubscriptions / Dimensions | No |
> | ExternalSubscriptions / Forecast | No |
> | ExternalSubscriptions / Query | No |
> | Forecast | No |
> | Query | No |
> | register | No |
> | Reportconfigs | No |
> | Reports | No |
> | Settings | No |
> | showbackRules | No |
> | Views | No |

## Microsoft.CustomerLockbox

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | requests | No |

## Microsoft.CustomProviders

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | associations | No |
> | resourceProviders | Yes |

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
> | workspaces / dbWorkspaces | No |
> | workspaces / storageEncryption | No |
> | workspaces / virtualNetworkPeerings | No |

## Microsoft.DataCatalog

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | catalogs | Yes |
> | datacatalogs | Yes |
> | datacatalogs / datasources | No |
> | datacatalogs / datasources / scans | No |
> | datacatalogs / datasources / scans / datasets | No |
> | datacatalogs / datasources / scans / filters | No |
> | datacatalogs / datasources / scans / triggers | No |
> | datacatalogs / scanrulesets | No |

## Microsoft.DataFactory

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | dataFactories | Yes |
> | dataFactories / diagnosticSettings | No |
> | dataFactories / metricDefinitions | No |
> | dataFactorySchema | No |
> | factories | Yes |
> | factories / integrationRuntimes | No |

## Microsoft.DataLakeAnalytics

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | accounts | Yes |
> | accounts / dataLakeStoreAccounts | No |
> | accounts / storageAccounts | No |
> | accounts / storageAccounts / containers | No |
> | accounts / transferAnalyticsUnits | No |

## Microsoft.DataLakeStore

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | accounts | Yes |
> | accounts / eventGridFilters | No |
> | accounts / firewallRules | No |

## Microsoft.DataMigration

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | services | Yes |
> | services / projects | Yes |

## Microsoft.DataProtection

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | BackupVaults | Yes |

## Microsoft.DataShare

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | accounts | Yes |
> | accounts / shares | No |
> | accounts / shares / datasets | No |
> | accounts / shares / invitations | No |
> | accounts / shares / providersharesubscriptions | No |
> | accounts / shares / synchronizationSettings | No |
> | accounts / sharesubscriptions | No |
> | accounts / sharesubscriptions / consumerSourceDataSets | No |
> | accounts / sharesubscriptions / datasetmappings | No |
> | accounts / sharesubscriptions / triggers | No |

## Microsoft.DBforMariaDB

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | servers | Yes |
> | servers / advisors | No |
> | servers / keys | No |
> | servers / privateEndpointConnectionProxies | No |
> | servers / privateEndpointConnections | No |
> | servers / privateLinkResources | No |
> | servers / queryTexts | No |
> | servers / recoverableServers | No |
> | servers / topQueryStatistics | No |
> | servers / virtualNetworkRules | No |
> | servers / waitStatistics | No |

## Microsoft.DBforMySQL

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | servers | Yes |
> | servers / advisors | No |
> | servers / keys | No |
> | servers / privateEndpointConnectionProxies | No |
> | servers / privateEndpointConnections | No |
> | servers / privateLinkResources | No |
> | servers / queryTexts | No |
> | servers / recoverableServers | No |
> | servers / topQueryStatistics | No |
> | servers / virtualNetworkRules | No |
> | servers / waitStatistics | No |

## Microsoft.DBforPostgreSQL

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | serverGroups | Yes |
> | servers | Yes |
> | servers / advisors | No |
> | servers / keys | No |
> | servers / privateEndpointConnectionProxies | No |
> | servers / privateEndpointConnections | No |
> | servers / privateLinkResources | No |
> | servers / queryTexts | No |
> | servers / recoverableServers | No |
> | servers / topQueryStatistics | No |
> | servers / virtualNetworkRules | No |
> | servers / waitStatistics | No |
> | serversv2 | Yes |
> | singleServers | Yes |

## Microsoft.DeploymentManager

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | artifactSources | Yes |
> | rollouts | Yes |
> | serviceTopologies | Yes |
> | serviceTopologies / services | Yes |
> | serviceTopologies / services / serviceUnits | Yes |
> | steps | Yes |

## Microsoft.DesktopVirtualization

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | applicationgroups | Yes |
> | applicationgroups / applications | No |
> | applicationgroups / desktops | No |
> | applicationgroups / startmenuitems | No |
> | hostpools | Yes |
> | hostpools / sessionhosts | No |
> | hostpools / sessionhosts / usersessions | No |
> | hostpools / usersessions | No |
> | workspaces | Yes |

## Microsoft.Devices

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | ElasticPools | Yes |
> | ElasticPools / IotHubTenants | Yes |
> | ElasticPools / IotHubTenants / securitySettings | No |
> | IotHubs | Yes |
> | IotHubs / eventGridFilters | No |
> | IotHubs / securitySettings | No |
> | ProvisioningServices | Yes |
> | usages | No |

## Microsoft.DevOps

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | pipelines | Yes |

## Microsoft.DevSpaces

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | controllers | Yes |

## Microsoft.DevTestLab

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | labcenters | Yes |
> | labs | Yes |
> | labs / environments | Yes |
> | labs / serviceRunners | Yes |
> | labs / virtualMachines | Yes |
> | schedules | Yes |

## Microsoft.DigitalTwins

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | digitalTwinsInstances | Yes |
> | digitalTwinsInstances / endpoints | No |

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
> | domains / domainOwnershipIdentifiers | No |
> | generateSsoRequest | No |
> | topLevelDomains | No |
> | validateDomainRegistrationInformation | No |

## Microsoft.DynamicsLcs

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | lcsprojects | No |
> | lcsprojects / clouddeployments | No |
> | lcsprojects / connectors | No |

## Microsoft.EnterpriseKnowledgeGraph

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | services | Yes |

## Microsoft.EventGrid

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | domains | Yes |
> | domains / topics | No |
> | eventSubscriptions | No |
> | extensionTopics | No |
> | partnerNamespaces | Yes |
> | partnerNamespaces / eventChannels | No |
> | partnerRegistrations | Yes |
> | partnerTopics | Yes |
> | partnerTopics / eventSubscriptions | No |
> | systemTopics | Yes |
> | systemTopics / eventSubscriptions | No |
> | topics | Yes |
> | topicTypes | No |

## Microsoft.EventHub

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | clusters | Yes |
> | namespaces | Yes |
> | namespaces / authorizationrules | No |
> | namespaces / disasterrecoveryconfigs | No |
> | namespaces / eventhubs | No |
> | namespaces / eventhubs / authorizationrules | No |
> | namespaces / eventhubs / consumergroups | No |
> | namespaces / networkrulesets | No |

## Microsoft.Experimentation

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | experimentWorkspaces | Yes |

## Microsoft.Falcon

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | namespaces | Yes |

## Microsoft.Features

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | featureProviders | No |
> | features | No |
> | providers | No |
> | subscriptionFeatureRegistrations | No |

## Microsoft.Gallery

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | enroll | No |
> | galleryitems | No |
> | generateartifactaccessuri | No |
> | myareas | No |
> | myareas / areas | No |
> | myareas / areas / areas | No |
> | myareas / areas / areas / galleryitems | No |
> | myareas / areas / galleryitems | No |
> | myareas / galleryitems | No |
> | register | No |
> | resources | No |
> | retrieveresourcesbyid | No |

## Microsoft.Genomics

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | accounts | Yes |

## Microsoft.GuestConfiguration

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | autoManagedAccounts | Yes |
> | autoManagedVmConfigurationProfiles | Yes |
> | configurationProfileAssignments | No |
> | guestConfigurationAssignments | No |
> | software | No |
> | softwareUpdateProfile | No |
> | softwareUpdates | No |

## Microsoft.HanaOnAzure

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | hanaInstances | Yes |
> | sapMonitors | Yes |

## Microsoft.HardwareSecurityModules

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | dedicatedHSMs | Yes |

## Microsoft.HDInsight

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | clusters | Yes |
> | clusters / applications | No |

## Microsoft.HealthcareApis

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | services | Yes |
> | services / iomtconnectors | No |
> | services / iomtconnectors / connections | No |
> | services / iomtconnectors / mappings | No |
> | services / privateEndpointConnectionProxies | No |
> | services / privateEndpointConnections | Yes |
> | services / privateLinkResources | Yes |

## Microsoft.HybridCompute

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | machines | Yes |
> | machines / extensions | Yes |

## Microsoft.HybridData

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | dataManagers | Yes |

## Microsoft.HybridNetwork

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | devices | Yes |
> | registeredSubscriptions | No |
> | vendors | No |
> | vendors / skus | No |
> | vendors / vnfs | No |
> | virtualNetworkFunctionSkus | No |
> | vnfs | Yes |

## Microsoft.Hydra

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | components | Yes |
> | networkScopes | Yes |

## Microsoft.ImportExport

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | jobs | Yes |

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
> | appTemplates | No |
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
> | hsmPools | Yes |
> | managedHSMs | Yes |
> | vaults | Yes |
> | vaults / accessPolicies | No |
> | vaults / eventGridFilters | No |
> | vaults / secrets | No |

## Microsoft.Kubernetes

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | connectedClusters | Yes |
> | registeredSubscriptions | No |

## Microsoft.KubernetesConfiguration

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | sourceControlConfigurations | No |

## Microsoft.Kusto

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | clusters | Yes |
> | clusters / attacheddatabaseconfigurations | No |
> | clusters / databases | No |
> | clusters / databases / dataconnections | No |
> | clusters / databases / eventhubconnections | No |
> | clusters / databases / principalassignments | No |
> | clusters / dataconnections | No |
> | clusters / principalassignments | No |
> | clusters / sharedidentities | No |

## Microsoft.LabServices

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | labaccounts | Yes |
> | users | No |

## Microsoft.Logic

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | hostingEnvironments | Yes |
> | integrationAccounts | Yes |
> | integrationServiceEnvironments | Yes |
> | integrationServiceEnvironments / managedApis | Yes |
> | isolatedEnvironments | Yes |
> | workflows | Yes |

## Microsoft.MachineLearning

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | commitmentPlans | Yes |
> | webServices | Yes |
> | Workspaces | Yes |

## Microsoft.MachineLearningServices

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | workspaces | Yes |
> | workspaces / computes | No |
> | workspaces / eventGridFilters | No |

## Microsoft.Maintenance

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | applyUpdates | No |
> | configurationAssignments | No |
> | maintenanceConfigurations | Yes |
> | updates | No |

## Microsoft.ManagedIdentity

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | Identities | No |
> | userAssignedIdentities | Yes |

## Microsoft.ManagedNetwork

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | managedNetworks | Yes |
> | managedNetworks / managedNetworkGroups | Yes |
> | managedNetworks / managedNetworkPeeringPolicies | Yes |
> | notification | Yes |

## Microsoft.ManagedServices

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | marketplaceRegistrationDefinitions | No |
> | registrationAssignments | No |
> | registrationDefinitions | No |

## Microsoft.Management

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | getEntities | No |
> | managementGroups | No |
> | managementGroups / settings | No |
> | resources | No |
> | startTenantBackfill | No |
> | tenantBackfillStatus | No |

## Microsoft.Maps

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | accounts | Yes |
> | accounts / eventGridFilters | No |
> | accounts / privateAtlases | Yes |

## Microsoft.Marketplace

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | offers | No |
> | offerTypes | No |
> | offerTypes / publishers | No |
> | offerTypes / publishers / offers | No |
> | offerTypes / publishers / offers / plans | No |
> | offerTypes / publishers / offers / plans / agreements | No |
> | offerTypes / publishers / offers / plans / configs | No |
> | offerTypes / publishers / offers / plans / configs / importImage | No |
> | privategalleryitems | No |
> | privateStoreClient | No |
> | privateStores | No |
> | privateStores / offers | No |
> | products | No |
> | publishers | No |
> | publishers / offers | No |
> | publishers / offers / amendments | No |
> | register | No |

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
> | mediaservices / accountFilters | No |
> | mediaservices / assets | No |
> | mediaservices / assets / assetFilters | No |
> | mediaservices / contentKeyPolicies | No |
> | mediaservices / eventGridFilters | No |
> | mediaservices / liveEventOperations | No |
> | mediaservices / liveEvents | Yes |
> | mediaservices / liveEvents / liveOutputs | No |
> | mediaservices / liveEvents / privateEndpointConnectionProxies | No |
> | mediaservices / liveOutputOperations | No |
> | mediaservices / mediaGraphs | No |
> | mediaservices / streamingEndpointOperations | No |
> | mediaservices / streamingEndpoints | Yes |
> | mediaservices / streamingEndpoints / privateEndpointConnectionProxies | No |
> | mediaservices / streamingLocators | No |
> | mediaservices / streamingPolicies | No |
> | mediaservices / streamingPrivateEndpointConnectionProxyOperations | No |
> | mediaservices / transforms | No |
> | mediaservices / transforms / jobs | No |

## Microsoft.Microservices4Spring

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | appClusters | Yes |

## Microsoft.Migrate

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | assessmentProjects | Yes |
> | migrateprojects | Yes |
> | moveCollections | Yes |
> | projects | Yes |

## Microsoft.MixedReality

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | holographicsBroadcastAccounts | Yes |
> | objectUnderstandingAccounts | Yes |
> | remoteRenderingAccounts | Yes |
> | spatialAnchorsAccounts | Yes |

## Microsoft.NetApp

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | netAppAccounts | Yes |
> | netAppAccounts / accountBackups | No |
> | netAppAccounts / capacityPools | Yes |
> | netAppAccounts / capacityPools / volumes | Yes |
> | netAppAccounts / capacityPools / volumes / snapshots | Yes |
## Microsoft.Network

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | applicationGateways | Yes |
> | applicationGatewayWebApplicationFirewallPolicies | Yes |
> | applicationSecurityGroups | Yes |
> | azureFirewallFqdnTags | No |
> | azureFirewalls | Yes |
> | bastionHosts | Yes |
> | bgpServiceCommunities | No |
> | connections | Yes |
> | ddosCustomPolicies | Yes |
> | ddosProtectionPlans | Yes |
> | dnsOperationStatuses | No |
> | dnszones | Yes |
> | dnszones / A | No |
> | dnszones / AAAA | No |
> | dnszones / all | No |
> | dnszones / CAA | No |
> | dnszones / CNAME | No |
> | dnszones / MX | No |
> | dnszones / NS | No |
> | dnszones / PTR | No |
> | dnszones / recordsets | No |
> | dnszones / SOA | No |
> | dnszones / SRV | No |
> | dnszones / TXT | No |
> | expressRouteCircuits | Yes |
> | expressRouteCrossConnections | Yes |
> | expressRouteGateways | Yes |
> | expressRoutePorts | Yes |
> | expressRouteServiceProviders | No |
> | firewallPolicies | Yes |
> | frontdoors | Yes |
> | frontdoorWebApplicationFirewallManagedRuleSets | No |
> | frontdoorWebApplicationFirewallPolicies | Yes |
> | getDnsResourceReference | No |
> | internalNotify | No |
> | loadBalancers | Yes |
> | localNetworkGateways | Yes |
> | natGateways | Yes |
> | networkIntentPolicies | Yes |
> | networkInterfaces | Yes |
> | networkProfiles | Yes |
> | networkSecurityGroups | Yes |
> | networkWatchers | Yes |
> | networkWatchers / connectionMonitors | Yes |
> | networkWatchers / flowLogs | Yes |
> | networkWatchers / lenses | Yes |
> | networkWatchers / pingMeshes | Yes |
> | p2sVpnGateways | Yes |
> | privateDnsOperationStatuses | No |
> | privateDnsZones | Yes |
> | privateDnsZones / A | No |
> | privateDnsZones / AAAA | No |
> | privateDnsZones / all | No |
> | privateDnsZones / CNAME | No |
> | privateDnsZones / MX | No |
> | privateDnsZones / PTR | No |
> | privateDnsZones / SOA | No |
> | privateDnsZones / SRV | No |
> | privateDnsZones / TXT | No |
> | privateDnsZones / virtualNetworkLinks | Yes |
> | privateEndpoints | Yes |
> | privateLinkServices | Yes |
> | publicIPAddresses | Yes |
> | publicIPPrefixes | Yes |
> | routeFilters | Yes |
> | routeTables | Yes |
> | serviceEndpointPolicies | Yes |
> | trafficManagerGeographicHierarchies | No |
> | trafficmanagerprofiles | Yes |
> | trafficmanagerprofiles / heatMaps | No |
> | trafficManagerUserMetricsKeys | No |
> | virtualHubs | Yes |
> | virtualNetworkGateways | Yes |
> | virtualNetworks | Yes |
> | virtualNetworks / subnets | No |
> | virtualNetworkTaps | Yes |
> | virtualWans | Yes |
> | vpnGateways | Yes |
> | vpnSites | Yes |
> | webApplicationFirewallPolicies | Yes |

## Microsoft.Notebooks

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | NotebookProxies | No |

## Microsoft.NotificationHubs

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | namespaces | Yes |
> | namespaces / notificationHubs | Yes |

## Microsoft.ObjectStore

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | osNamespaces | Yes |

## Microsoft.OffAzure

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | HyperVSites | Yes |
> | ImportSites | Yes |
> | ServerSites | Yes |
> | VMwareSites | Yes |

## Microsoft.OperationalInsights

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | clusters | Yes |
> | deletedWorkspaces | No |
> | linkTargets | No |
> | storageInsightConfigs | No |
> | workspaces | Yes |
> | workspaces / dataExports | No |
> | workspaces / dataSources | No |
> | workspaces / linkedServices | No |
> | workspaces / linkedStorageAccounts | No |
> | workspaces / metadata | No |
> | workspaces / query | No |
> | workspaces / scopedPrivateLinkProxies | No |

## Microsoft.OperationsManagement

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | managementassociations | No |
> | managementconfigurations | Yes |
> | solutions | Yes |
> | views | Yes |

## Microsoft.Peering

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | legacyPeerings | No |
> | peerAsns | No |
> | peerings | Yes |
> | peeringServiceCountries | No |
> | peeringServiceProviders | No |
> | peeringServices | Yes |

## Microsoft.PolicyInsights

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | policyEvents | No |
> | policyMetadata | No |
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

## Microsoft.ProjectBabylon

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | accounts | Yes |

## Microsoft.ProviderHub

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | providerRegistrations | No |
> | providerRegistrations / resourceTypeRegistrations | No |
> | rollouts | Yes |

## Microsoft.Quantum

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | Workspaces | Yes |

## Microsoft.RecoveryServices

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | backupProtectedItems | No |
> | vaults | Yes |

## Microsoft.RedHatOpenShift

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | OpenShiftClusters | Yes |

## Microsoft.Relay

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | namespaces | Yes |
> | namespaces / authorizationrules | No |
> | namespaces / hybridconnections | No |
> | namespaces / hybridconnections / authorizationrules | No |
> | namespaces / privateEndpointConnections | No |
> | namespaces / wcfrelays | No |
> | namespaces / wcfrelays / authorizationrules | No |

## Microsoft.ResourceGraph

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | queries | Yes |
> | resourceChangeDetails | No |
> | resourceChanges | No |
> | resources | No |
> | resourcesHistory | No |
> | subscriptionsStatus | No |

## Microsoft.ResourceHealth

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | availabilityStatuses | No |
> | childAvailabilityStatuses | No |
> | childResources | No |
> | emergingissues | No |
> | events | No |
> | impactedResources | No |
> | metadata | No |
> | notifications | No |

## Microsoft.Resources

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | calculateTemplateHash | No |
> | deployments | No |
> | deployments / operations | No |
> | deploymentScripts | Yes |
> | deploymentScripts / logs | No |
> | links | No |
> | notifyResourceJobs | No |
> | providers | No |
> | resourceGroups | No |
> | subscriptions | No |
> | templateSpecs | Yes |
> | templateSpecs / versions | Yes |
> | tenants | No |

## Microsoft.SaaS

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | applications | Yes |
> | saasresources | No |

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
> | adaptiveNetworkHardenings | No |
> | advancedThreatProtectionSettings | No |
> | alerts | No |
> | alertsSuppressionRules | No |
> | allowedConnections | No |
> | applicationWhitelistings | No |
> | assessmentMetadata | No |
> | assessments | No |
> | autoDismissAlertsRules | No |
> | automations | Yes |
> | AutoProvisioningSettings | No |
> | Compliances | No |
> | dataCollectionAgents | No |
> | deviceSecurityGroups | No |
> | discoveredSecuritySolutions | No |
> | externalSecuritySolutions | No |
> | InformationProtectionPolicies | No |
> | iotSecuritySolutions | Yes |
> | iotSecuritySolutions / analyticsModels | No |
> | iotSecuritySolutions / analyticsModels / aggregatedAlerts | No |
> | iotSecuritySolutions / analyticsModels / aggregatedRecommendations | No |
> | jitNetworkAccessPolicies | No |
> | policies | No |
> | pricings | No |
> | regulatoryComplianceStandards | No |
> | regulatoryComplianceStandards / regulatoryComplianceControls | No |
> | regulatoryComplianceStandards / regulatoryComplianceControls / regulatoryComplianceAssessments | No |
> | secureScoreControlDefinitions | No |
> | secureScoreControls | No |
> | secureScores | No |
> | secureScores / secureScoreControls | No |
> | securityContacts | No |
> | securitySolutions | No |
> | securitySolutionsReferenceData | No |
> | securityStatuses | No |
> | securityStatusesSummaries | No |
> | serverVulnerabilityAssessments | No |
> | settings | No |
> | subAssessments | No |
> | tasks | No |
> | topologies | No |
> | workspaceSettings | No |

## Microsoft.SecurityGraph

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | diagnosticSettings | No |
> | diagnosticSettingsCategories | No |

## Microsoft.SecurityInsights

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | aggregations | No |
> | alertRules | No |
> | alertRuleTemplates | No |
> | automationRules | No |
> | bookmarks | No |
> | cases | No |
> | dataConnectors | No |
> | dataConnectorsCheckRequirements | No |
> | entities | No |
> | entityQueries | No |
> | incidents | No |
> | officeConsents | No |
> | settings | No |
> | threatIntelligence | No |

## Microsoft.SerialConsole

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | consoleServices | No |

## Microsoft.ServiceBus

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | namespaces | Yes |
> | namespaces / authorizationrules | No |
> | namespaces / disasterrecoveryconfigs | No |
> | namespaces / eventgridfilters | No |
> | namespaces / networkrulesets | No |
> | namespaces / queues | No |
> | namespaces / queues / authorizationrules | No |
> | namespaces / topics | No |
> | namespaces / topics / authorizationrules | No |
> | namespaces / topics / subscriptions | No |
> | namespaces / topics / subscriptions / rules | No |
> | premiumMessagingRegions | No |

## Microsoft.ServiceFabric

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | applications | Yes |
> | clusters | Yes |
> | clusters / applications | No |
> | containerGroups | Yes |
> | containerGroupSets | Yes |
> | edgeclusters | Yes |
> | edgeclusters / applications | No |
> | managedclusters | Yes |
> | managedclusters / nodetypes | No |
> | networks | Yes |
> | secretstores | Yes |
> | secretstores / certificates | No |
> | secretstores / secrets | No |
> | volumes | Yes |

## Microsoft.ServiceFabricMesh

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | applications | Yes |
> | containerGroups | Yes |
> | gateways | Yes |
> | networks | Yes |
> | secrets | Yes |
> | volumes | Yes |

## Microsoft.Services

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | providerRegistrations | No |
> | providerRegistrations / resourceTypeRegistrations | No |
> | rollouts | Yes |

## Microsoft.SignalRService

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | SignalR | Yes |
> | SignalR / eventGridFilters | No |

## Microsoft.SoftwarePlan

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | hybridUseBenefits | No |

## Microsoft.Solutions

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | applicationDefinitions | Yes |
> | applications | Yes |
> | jitRequests | Yes |

## Microsoft.SQL

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | managedInstances | Yes |
> | managedInstances / databases | Yes |
> | managedInstances / databases / backupShortTermRetentionPolicies | No |
> | managedInstances / databases / schemas / tables / columns / sensitivityLabels | No |
> | managedInstances / databases / vulnerabilityAssessments | No |
> | managedInstances / databases / vulnerabilityAssessments / rules / baselines | No |
> | managedInstances / encryptionProtector | No |
> | managedInstances / keys | No |
> | managedInstances / restorableDroppedDatabases / backupShortTermRetentionPolicies | No |
> | managedInstances / vulnerabilityAssessments | No |
> | servers | Yes |
> | servers / administrators | No |
> | servers / communicationLinks | No |
> | servers / databases | Yes |
> | servers / encryptionProtector | No |
> | servers / firewallRules | No |
> | servers / keys | No |
> | servers / restorableDroppedDatabases | No |
> | servers / serviceobjectives | No |
> | servers / tdeCertificates | No |
> | virtualClusters | No |

## Microsoft.SqlVirtualMachine

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | SqlVirtualMachineGroups | Yes |
> | SqlVirtualMachineGroups / AvailabilityGroupListeners | No |
> | SqlVirtualMachines | Yes |

## Microsoft.Storage

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | storageAccounts | Yes |
> | storageAccounts / blobServices | No |
> | storageAccounts / fileServices | No |
> | storageAccounts / queueServices | No |
> | storageAccounts / services | No |
> | storageAccounts / services / metricDefinitions | No |
> | storageAccounts / tableServices | No |
> | usages | No |

## Microsoft.StorageCache

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | caches | Yes |
> | caches / storageTargets | No |
> | usageModels | No |

## Microsoft.StorageReplication

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | replicationGroups | No |

## Microsoft.StorageSync

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | storageSyncServices | Yes |
> | storageSyncServices / registeredServers | No |
> | storageSyncServices / syncGroups | No |
> | storageSyncServices / syncGroups / cloudEndpoints | No |
> | storageSyncServices / syncGroups / serverEndpoints | No |
> | storageSyncServices / workflows | No |

## Microsoft.StorageSyncDev

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | storageSyncServices | Yes |
> | storageSyncServices / registeredServers | No |
> | storageSyncServices / syncGroups | No |
> | storageSyncServices / syncGroups / cloudEndpoints | No |
> | storageSyncServices / syncGroups / serverEndpoints | No |
> | storageSyncServices / workflows | No |

## Microsoft.StorageSyncInt

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | storageSyncServices | Yes |
> | storageSyncServices / registeredServers | No |
> | storageSyncServices / syncGroups | No |
> | storageSyncServices / syncGroups / cloudEndpoints | No |
> | storageSyncServices / syncGroups / serverEndpoints | No |
> | storageSyncServices / workflows | No |

## Microsoft.StorSimple

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | managers | Yes |

## Microsoft.StreamAnalytics

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | clusters | Yes |
> | streamingjobs | Yes |

## Microsoft.Subscription

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | cancel | No |
> | CreateSubscription | No |
> | enable | No |
> | rename | No |
> | SubscriptionDefinitions | No |
> | SubscriptionOperations | No |
> | subscriptions | No |

## Microsoft.Synapse

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | privateLinkHubs | Yes |
> | workspaces | Yes |
> | workspaces / bigDataPools | Yes |
> | workspaces / operationStatuses | No |
> | workspaces / sqlPools | Yes |

## Microsoft.TimeSeriesInsights

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | environments | Yes |
> | environments / accessPolicies | No |
> | environments / eventsources | Yes |
> | environments / referenceDataSets | Yes |

## Microsoft.Token

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | stores | Yes |
> | stores / accessPolicies | No |
> | stores / services | No |
> | stores / services / tokens | No |

## Microsoft.VirtualMachineImages

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | imageTemplates | Yes |
> | imageTemplates / runOutputs | No |

## Microsoft.VMware

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | ArcZones | Yes |
> | ResourcePools | Yes |
> | VCenters | Yes |
> | VirtualMachines | Yes |
> | VirtualMachineTemplates | Yes |
> | VirtualNetworks | Yes |

## Microsoft.VMwareCloudSimple

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | dedicatedCloudNodes | Yes |
> | dedicatedCloudServices | Yes |
> | virtualMachines | Yes |

## Microsoft.VMwareOnAzure

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | privateClouds | Yes |

## Microsoft.VnfManager

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | devices | Yes |
> | registeredSubscriptions | No |
> | vendors | No |
> | vendors / skus | No |
> | vendors / vnfs | No |
> | virtualNetworkFunctionSkus | No |
> | vnfs | Yes |

## Microsoft.VSOnline

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | accounts | Yes |
> | plans | Yes |
> | registeredSubscriptions | No |

## Microsoft.Web

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | apiManagementAccounts | No |
> | apiManagementAccounts / apiAcls | No |
> | apiManagementAccounts / apis | No |
> | apiManagementAccounts / apis / apiAcls | No |
> | apiManagementAccounts / apis / connectionAcls | No |
> | apiManagementAccounts / apis / connections | No |
> | apiManagementAccounts / apis / connections / connectionAcls | No |
> | apiManagementAccounts / apis / localizedDefinitions | No |
> | apiManagementAccounts / connectionAcls | No |
> | apiManagementAccounts / connections | No |
> | billingMeters | No |
> | certificates | Yes |
> | connectionGateways | Yes |
> | connections | Yes |
> | customApis | Yes |
> | deletedSites | No |
> | hostingEnvironments | Yes |
> | hostingEnvironments / eventGridFilters | No |
> | hostingEnvironments / multiRolePools | No |
> | hostingEnvironments / workerPools | No |
> | kubeEnvironments | Yes |
> | publishingUsers | No |
> | recommendations | No |
> | resourceHealthMetadata | No |
> | runtimes | No |
> | serverFarms | Yes |
> | serverFarms / eventGridFilters | No |
> | sites | Yes |
> | sites/config  | No |
> | sites / eventGridFilters | No |
> | sites / hostNameBindings | No |
> | sites / networkConfig | No |
> | sites / premieraddons | Yes |
> | sites / slots | Yes |
> | sites / slots / eventGridFilters | No |
> | sites / slots / hostNameBindings | No |
> | sites / slots / networkConfig | No |
> | sourceControls | No |
> | staticSites | Yes |
> | validate | No |
> | verifyHostingEnvironmentVnet | No |

## Microsoft.WindowsDefenderATP

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | diagnosticSettings | No |
> | diagnosticSettingsCategories | No |

## Microsoft.WindowsESU

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | multipleActivationKeys | Yes |

## Microsoft.WindowsIoT

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | DeviceServices | Yes |

## Microsoft.WorkloadBuilder

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | workloads | Yes |
> | workloads / instances | No |
> | workloads / versions | No |
> | workloads / versions / artifacts | No |

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

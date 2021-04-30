---
title: Tag support for resources
description: Shows which Azure resource types support tags. Provides details for all Azure services.
ms.topic: conceptual
ms.date: 04/20/2021
---

# Tag support for Azure resources
This article describes whether a resource type supports [tags](tag-resources.md). The column labeled **Supports tags** indicates whether the resource type has a property for the tag. The column labeled **Tag in cost report** indicates whether that resource type passes the tag to the cost report. You can view costs by tags in the [Cost Management cost analysis](../../cost-management-billing/costs/group-filter.md) and the [Azure billing invoice and daily usage data](../../cost-management-billing/manage/download-azure-invoice-daily-usage-date.md).

To get the same data as a file of comma-separated values, download [tag-support.csv](https://github.com/tfitzmac/resource-capabilities/blob/master/tag-support.csv).

Jump to a resource provider namespace:
> [!div class="op_single_selector"]
> - [Microsoft.AAD](#microsoftaad)
> - [Microsoft.Addons](#microsoftaddons)
> - [Microsoft.ADHybridHealthService](#microsoftadhybridhealthservice)
> - [Microsoft.Advisor](#microsoftadvisor)
> - [Microsoft.AgFoodPlatform](#microsoftagfoodplatform)
> - [Microsoft.AlertsManagement](#microsoftalertsmanagement)
> - [Microsoft.AnalysisServices](#microsoftanalysisservices)
> - [Microsoft.AnyBuild](#microsoftanybuild)
> - [Microsoft.ApiManagement](#microsoftapimanagement)
> - [Microsoft.AppAssessment](#microsoftappassessment)
> - [Microsoft.AppConfiguration](#microsoftappconfiguration)
> - [Microsoft.AppPlatform](#microsoftappplatform)
> - [Microsoft.Attestation](#microsoftattestation)
> - [Microsoft.Authorization](#microsoftauthorization)
> - [Microsoft.Automanage](#microsoftautomanage)
> - [Microsoft.Automation](#microsoftautomation)
> - [Microsoft.AVS](#microsoftavs)
> - [Microsoft.Azure.Geneva](#microsoftazuregeneva)
> - [Microsoft.AzureActiveDirectory](#microsoftazureactivedirectory)
> - [Microsoft.AzureArcData](#microsoftazurearcdata)
> - [Microsoft.AzureCIS](#microsoftazurecis)
> - [Microsoft.AzureData](#microsoftazuredata)
> - [Microsoft.AzureSphere](#microsoftazuresphere)
> - [Microsoft.AzureStack](#microsoftazurestack)
> - [Microsoft.AzureStackHCI](#microsoftazurestackhci)
> - [Microsoft.BareMetalInfrastructure](#microsoftbaremetalinfrastructure)
> - [Microsoft.Batch](#microsoftbatch)
> - [Microsoft.Billing](#microsoftbilling)
> - [Microsoft.BingMaps](#microsoftbingmaps)
> - [Microsoft.Blockchain](#microsoftblockchain)
> - [Microsoft.BlockchainTokens](#microsoftblockchaintokens)
> - [Microsoft.Blueprint](#microsoftblueprint)
> - [Microsoft.BotService](#microsoftbotservice)
> - [Microsoft.Cache](#microsoftcache)
> - [Microsoft.Capacity](#microsoftcapacity)
> - [Microsoft.Cascade](#microsoftcascade)
> - [Microsoft.Cdn](#microsoftcdn)
> - [Microsoft.CertificateRegistration](#microsoftcertificateregistration)
> - [Microsoft.ChangeAnalysis](#microsoftchangeanalysis)
> - [Microsoft.ClassicCompute](#microsoftclassiccompute)
> - [Microsoft.ClassicInfrastructureMigrate](#microsoftclassicinfrastructuremigrate)
> - [Microsoft.ClassicNetwork](#microsoftclassicnetwork)
> - [Microsoft.ClassicStorage](#microsoftclassicstorage)
> - [Microsoft.ClusterStor](#microsoftclusterstor)
> - [Microsoft.Codespaces](#microsoftcodespaces)
> - [Microsoft.CognitiveServices](#microsoftcognitiveservices)
> - [Microsoft.Commerce](#microsoftcommerce)
> - [Microsoft.Compute](#microsoftcompute)
> - [Microsoft.ConnectedCache](#microsoftconnectedcache)
> - [Microsoft.ConnectedVehicle](#microsoftconnectedvehicle)
> - [Microsoft.ConnectedVMwarevSphere](#microsoftconnectedvmwarevsphere)
> - [Microsoft.Consumption](#microsoftconsumption)
> - [Microsoft.ContainerInstance](#microsoftcontainerinstance)
> - [Microsoft.ContainerRegistry](#microsoftcontainerregistry)
> - [Microsoft.ContainerService](#microsoftcontainerservice)
> - [Microsoft.CostManagement](#microsoftcostmanagement)
> - [Microsoft.CustomerLockbox](#microsoftcustomerlockbox)
> - [Microsoft.CustomProviders](#microsoftcustomproviders)
> - [Microsoft.D365CustomerInsights](#microsoftd365customerinsights)
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
> - [Microsoft.DeviceUpdate](#microsoftdeviceupdate)
> - [Microsoft.DevOps](#microsoftdevops)
> - [Microsoft.DevSpaces](#microsoftdevspaces)
> - [Microsoft.DevTestLab](#microsoftdevtestlab)
> - [Microsoft.DigitalTwins](#microsoftdigitaltwins)
> - [Microsoft.DocumentDB](#microsoftdocumentdb)
> - [Microsoft.DomainRegistration](#microsoftdomainregistration)
> - [Microsoft.DynamicsLcs](#microsoftdynamicslcs)
> - [Microsoft.EdgeOrder](#microsoftedgeorder)
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
> - [Microsoft.HealthBot](#microsofthealthbot)
> - [Microsoft.HealthcareApis](#microsofthealthcareapis)
> - [Microsoft.HybridCompute](#microsofthybridcompute)
> - [Microsoft.HybridData](#microsofthybriddata)
> - [Microsoft.HybridNetwork](#microsofthybridnetwork)
> - [Microsoft.Hydra](#microsofthydra)
> - [Microsoft.ImportExport](#microsoftimportexport)
> - [Microsoft.Insights](#microsoftinsights)
> - [Microsoft.Intune](#microsoftintune)
> - [Microsoft.IoTCentral](#microsoftiotcentral)
> - [Microsoft.IoTSecurity](#microsoftiotsecurity)
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
> - [Microsoft.MobileNetwork](#microsoftmobilenetwork)
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
> - [Microsoft.PowerPlatform](#microsoftpowerplatform)
> - [Microsoft.ProjectBabylon](#microsoftprojectbabylon)
> - [Microsoft.ProviderHub](#microsoftproviderhub)
> - [Microsoft.Purview](#microsoftpurview)
> - [Microsoft.Quantum](#microsoftquantum)
> - [Microsoft.RecoveryServices](#microsoftrecoveryservices)
> - [Microsoft.RedHatOpenShift](#microsoftredhatopenshift)
> - [Microsoft.Relay](#microsoftrelay)
> - [Microsoft.ResourceConnector](#microsoftresourceconnector)
> - [Microsoft.ResourceGraph](#microsoftresourcegraph)
> - [Microsoft.ResourceHealth](#microsoftresourcehealth)
> - [Microsoft.Resources](#microsoftresources)
> - [Microsoft.SaaS](#microsoftsaas)
> - [Microsoft.ScVmm](#microsoftscvmm)
> - [Microsoft.Search](#microsoftsearch)
> - [Microsoft.Security](#microsoftsecurity)
> - [Microsoft.SecurityGraph](#microsoftsecuritygraph)
> - [Microsoft.SecurityInsights](#microsoftsecurityinsights)
> - [Microsoft.SerialConsole](#microsoftserialconsole)
> - [Microsoft.ServiceBus](#microsoftservicebus)
> - [Microsoft.ServiceFabric](#microsoftservicefabric)
> - [Microsoft.ServiceFabricMesh](#microsoftservicefabricmesh)
> - [Microsoft.ServiceLinker](#microsoftservicelinker)
> - [Microsoft.Services](#microsoftservices)
> - [Microsoft.SignalRService](#microsoftsignalrservice)
> - [Microsoft.Singularity](#microsoftsingularity)
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
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | DomainServices | Yes | Yes |
> | DomainServices / oucontainer | No | No |

## Microsoft.Addons

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | supportProviders | No | No |

## Microsoft.ADHybridHealthService

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | aadsupportcases | No | No |
> | addsservices | No | No |
> | agents | No | No |
> | anonymousapiusers | No | No |
> | configuration | No | No |
> | logs | No | No |
> | reports | No | No |
> | servicehealthmetrics | No | No |
> | services | No | No |

## Microsoft.Advisor

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | advisorScore | No | No |
> | configurations | No | No |
> | generateRecommendations | No | No |
> | metadata | No | No |
> | recommendations | No | No |
> | suppressions | No | No |

## Microsoft.AgFoodPlatform

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | farmBeats | Yes | Yes |
> | farmBeats / eventGridFilters | No | No |

## Microsoft.AlertsManagement

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | actionRules | Yes | Yes |
> | alerts | No | No |
> | alertsList | No | No |
> | alertsMetaData | No | No |
> | alertsSummary | No | No |
> | alertsSummaryList | No | No |
> | migrateFromSmartDetection | No | No |
> | resourceHealthAlertRules | Yes | Yes |
> | smartDetectorAlertRules | Yes | Yes |
> | smartGroups | No | No |

## Microsoft.AnalysisServices

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | servers | Yes | Yes |

## Microsoft.AnyBuild

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | clusters | Yes | Yes |

## Microsoft.ApiManagement

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | deletedServices | No | No |
> | getDomainOwnershipIdentifier | No | No |
> | reportFeedback | No | No |
> | service | Yes | Yes |
> | validateServiceName | No | No |

> [!NOTE]
> Azure API Management only supports creating a maximum of 15 tag name/value pairs for each service.

## Microsoft.AppAssessment

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | migrateProjects | Yes | Yes |
> | migrateProjects / assessments | No | No |
> | migrateProjects / assessments / assessedApplications | No | No |
> | migrateProjects / assessments / assessedApplications / machines | No | No |
> | migrateProjects / assessments / assessedMachines | No | No |
> | migrateProjects / assessments / assessedMachines / applications | No | No |
> | migrateProjects / assessments / machinesToAssess | No | No |
> | migrateProjects / sites | No | No |
> | migrateProjects / sites / applianceConfigurations | No | No |
> | migrateProjects / sites / machines | No | No |
> | osVersions | No | No |

## Microsoft.AppConfiguration

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | configurationStores | Yes | No |
> | configurationStores / eventGridFilters | No | No |
> | configurationStores / keyValues | No | No |

## Microsoft.AppPlatform

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | Spring | Yes | Yes |
> | Spring / apps | No | No |
> | Spring / apps / deployments | No | No |

## Microsoft.Attestation

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | attestationProviders | Yes | Yes |
> | defaultProviders | No | No |

## Microsoft.Authorization

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | accessReviewScheduleDefinitions | No | No |
> | accessReviewScheduleSettings | No | No |
> | classicAdministrators | No | No |
> | dataAliases | No | No |
> | dataPolicyManifests | No | No |
> | denyAssignments | No | No |
> | elevateAccess | No | No |
> | findOrphanRoleAssignments | No | No |
> | locks | No | No |
> | permissions | No | No |
> | policyAssignments | No | No |
> | policyDefinitions | No | No |
> | policyExemptions | No | No |
> | policySetDefinitions | No | No |
> | privateLinkAssociations | No | No |
> | providerOperations | No | No |
> | resourceManagementPrivateLinks | Yes | Yes |
> | roleAssignmentApprovals | No | No |
> | roleAssignments | No | No |
> | roleAssignmentScheduleInstances | No | No |
> | roleAssignmentScheduleRequests | No | No |
> | roleAssignmentSchedules | No | No |
> | roleAssignmentsUsageMetrics | No | No |
> | roleDefinitions | No | No |
> | roleEligibilityScheduleInstances | No | No |
> | roleEligibilityScheduleRequests | No | No |
> | roleEligibilitySchedules | No | No |
> | roleManagementPolicies | No | No |
> | roleManagementPolicyAssignments | No | No |

## Microsoft.Automanage

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | accounts | Yes | Yes |
> | configurationProfileAssignments | No | No |
> | configurationProfilePreferences | Yes | Yes |

## Microsoft.Automation

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | automationAccounts | Yes | Yes |
> | automationAccounts / configurations | Yes | Yes |
> | automationAccounts / jobs | No | No |
> | automationAccounts / privateEndpointConnectionProxies | No | No |
> | automationAccounts / privateEndpointConnections | No | No |
> | automationAccounts / privateLinkResources | No | No |
> | automationAccounts / runbooks | Yes | Yes |
> | automationAccounts / softwareUpdateConfigurations | No | No |
> | automationAccounts / webhooks | No | No |

> [!NOTE]
> Azure Automation only supports creating a maximum of 15 tag name/value pairs for each Automation resource.

## Microsoft.AVS

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | privateClouds | Yes | Yes |
> | privateClouds / addons | No | No |
> | privateClouds / authorizations | No | No |
> | privateClouds / cloudLinks | No | No |
> | privateClouds / clusters | No | No |
> | privateClouds / clusters / datastores | No | No |
> | privateClouds / globalReachConnections | No | No |
> | privateClouds / hcxEnterpriseSites | No | No |
> | privateClouds / scriptExecutions | No | No |
> | privateClouds / scriptPackages | No | No |
> | privateClouds / scriptPackages / scriptCmdlets | No | No |
> | privateClouds / workloadNetworks | No | No |
> | privateClouds / workloadNetworks / dhcpConfigurations | No | No |
> | privateClouds / workloadNetworks / dnsServices | No | No |
> | privateClouds / workloadNetworks / dnsZones | No | No |
> | privateClouds / workloadNetworks / gateways | No | No |
> | privateClouds / workloadNetworks / portMirroringProfiles | No | No |
> | privateClouds / workloadNetworks / segments | No | No |
> | privateClouds / workloadNetworks / virtualMachines | No | No |
> | privateClouds / workloadNetworks / vmGroups | No | No |

## Microsoft.Azure.Geneva

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | environments | No | No |
> | environments / accounts | No | No |
> | environments / accounts / namespaces | No | No |
> | environments / accounts / namespaces / configurations | No | No |

## Microsoft.AzureActiveDirectory

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | b2cDirectories | Yes | No |
> | b2ctenants | No | No |
> | guestUsages | Yes | Yes |

## Microsoft.AzureArcData

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | dataControllers | Yes | Yes |
> | dataWarehouseInstances | Yes | Yes |
> | postgresInstances | Yes | Yes |
> | sqlManagedInstances | Yes | Yes |
> | sqlServerInstances | Yes | Yes |

## Microsoft.AzureCIS

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | autopilotEnvironments | Yes | Yes |

## Microsoft.AzureData

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | sqlServerRegistrations | Yes | Yes |
> | sqlServerRegistrations / sqlServers | No | No |

## Microsoft.AzureSphere

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | catalogs | Yes | Yes |
> | catalogs / products | Yes | Yes |

## Microsoft.AzureStack

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | cloudManifestFiles | No | No |
> | edgeSubscriptions | Yes | Yes |
> | linkedSubscriptions | Yes | Yes |
> | registrations | Yes | Yes |
> | registrations / customerSubscriptions | No | No |
> | registrations / products | No | No |

## Microsoft.AzureStackHCI

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | clusters | Yes | Yes |
> | galleryImages | Yes | Yes |
> | networkInterfaces | Yes | Yes |
> | virtualHardDisks | Yes | Yes |
> | virtualMachines | Yes | Yes |
> | virtualNetworks | Yes | Yes |

## Microsoft.BareMetalInfrastructure

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | bareMetalInstances | Yes | Yes |

## Microsoft.Batch

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | batchAccounts | Yes | Yes |
> | batchAccounts / certificates | No | No |
> | batchAccounts / pools | No | No |

## Microsoft.Billing

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | billingAccounts | No | No |
> | billingAccounts / agreements | No | No |
> | billingAccounts / billingPermissions | No | No |
> | billingAccounts / billingProfiles | No | No |
> | billingAccounts / billingProfiles / billingPermissions | No | No |
> | billingAccounts / billingProfiles / billingRoleAssignments | No | No |
> | billingAccounts / billingProfiles / billingRoleDefinitions | No | No |
> | billingAccounts / billingProfiles / billingSubscriptions | No | No |
> | billingAccounts / billingProfiles / createBillingRoleAssignment | No | No |
> | billingAccounts / billingProfiles / customers | No | No |
> | billingAccounts / billingProfiles / instructions | No | No |
> | billingAccounts / billingProfiles / invoices | No | No |
> | billingAccounts / billingProfiles / invoices / pricesheet | No | No |
> | billingAccounts / billingProfiles / invoices / transactions | No | No |
> | billingAccounts / billingProfiles / invoiceSections | No | No |
> | billingAccounts / billingProfiles / invoiceSections / billingPermissions | No | No |
> | billingAccounts / billingProfiles / invoiceSections / billingRoleAssignments | No | No |
> | billingAccounts / billingProfiles / invoiceSections / billingRoleDefinitions | No | No |
> | billingAccounts / billingProfiles / invoiceSections / billingSubscriptions | No | No |
> | billingAccounts / billingProfiles / invoiceSections / createBillingRoleAssignment | No | No |
> | billingAccounts / billingProfiles / invoiceSections / initiateTransfer | No | No |
> | billingAccounts / billingProfiles / invoiceSections / products | No | No |
> | billingAccounts / billingProfiles / invoiceSections / products / transfer | No | No |
> | billingAccounts / billingProfiles / invoiceSections / products / updateAutoRenew | No | No |
> | billingAccounts / billingProfiles / invoiceSections / transactions | No | No |
> | billingAccounts / billingProfiles / invoiceSections / transfers | No | No |
> | billingAccounts / billingProfiles / invoiceSections / validateDeleteInvoiceSectionEligibility | No | No |
> | billingAccounts / BillingProfiles / patchOperations | No | No |
> | billingAccounts / billingProfiles / paymentMethods | No | No |
> | billingAccounts / billingProfiles / policies | No | No |
> | billingAccounts / billingProfiles / pricesheet | No | No |
> | billingAccounts / billingProfiles / pricesheetDownloadOperations | No | No |
> | billingAccounts / billingProfiles / products | No | No |
> | billingAccounts / billingProfiles / reservations | No | No |
> | billingAccounts / billingProfiles / transactions | No | No |
> | billingAccounts / billingProfiles / validateDeleteBillingProfileEligibility | No | No |
> | billingAccounts / billingProfiles / validateDetachPaymentMethodEligibility | No | No |
> | billingAccounts / billingRoleAssignments | No | No |
> | billingAccounts / billingRoleDefinitions | No | No |
> | billingAccounts / billingSubscriptions | No | No |
> | billingAccounts / billingSubscriptions / elevateRole | No | No |
> | billingAccounts / billingSubscriptions / invoices | No | No |
> | billingAccounts / createBillingRoleAssignment | No | No |
> | billingAccounts / createInvoiceSectionOperations | No | No |
> | billingAccounts / customers | No | No |
> | billingAccounts / customers / billingPermissions | No | No |
> | billingAccounts / customers / billingSubscriptions | No | No |
> | billingAccounts / customers / initiateTransfer | No | No |
> | billingAccounts / customers / policies | No | No |
> | billingAccounts / customers / products | No | No |
> | billingAccounts / customers / transactions | No | No |
> | billingAccounts / customers / transfers | No | No |
> | billingAccounts / departments | No | No |
> | billingAccounts / departments / billingPermissions | No | No |
> | billingAccounts / departments / billingRoleAssignments | No | No |
> | billingAccounts / departments / billingRoleDefinitions | No | No |
> | billingAccounts / departments / billingSubscriptions | No | No |
> | billingAccounts / enrollmentAccounts | No | No |
> | billingAccounts / enrollmentAccounts / billingPermissions | No | No |
> | billingAccounts / enrollmentAccounts / billingRoleAssignments | No | No |
> | billingAccounts / enrollmentAccounts / billingRoleDefinitions | No | No |
> | billingAccounts / enrollmentAccounts / billingSubscriptions | No | No |
> | billingAccounts / invoices | No | No |
> | billingAccounts / invoices / transactions | No | No |
> | billingAccounts / invoices / transactionSummary | No | No |
> | billingAccounts / invoiceSections | No | No |
> | billingAccounts / invoiceSections / billingSubscriptionMoveOperations | No | No |
> | billingAccounts / invoiceSections / billingSubscriptions | No | No |
> | billingAccounts / invoiceSections / billingSubscriptions / transfer | No | No |
> | billingAccounts / invoiceSections / elevate | No | No |
> | billingAccounts / invoiceSections / initiateTransfer | No | No |
> | billingAccounts / invoiceSections / patchOperations | No | No |
> | billingAccounts / invoiceSections / productMoveOperations | No | No |
> | billingAccounts / invoiceSections / products | No | No |
> | billingAccounts / invoiceSections / products / transfer | No | No |
> | billingAccounts / invoiceSections / products / updateAutoRenew | No | No |
> | billingAccounts / invoiceSections / transactions | No | No |
> | billingAccounts / invoiceSections / transfers | No | No |
> | billingAccounts / lineOfCredit | No | No |
> | billingAccounts / patchOperations | No | No |
> | billingAccounts / payableOverage | No | No |
> | billingAccounts / paymentMethods | No | No |
> | billingAccounts / payNow | No | No |
> | billingAccounts / products | No | No |
> | billingAccounts / reservations | No | No |
> | billingAccounts / transactions | No | No |
> | billingPeriods | No | No |
> | billingPermissions | No | No |
> | billingProperty | No | No |
> | billingRoleAssignments | No | No |
> | billingRoleDefinitions | No | No |
> | createBillingRoleAssignment | No | No |
> | departments | No | No |
> | enrollmentAccounts | No | No |
> | invoices | No | No |
> | promotions | No | No |
> | transfers | No | No |
> | transfers / acceptTransfer | No | No |
> | transfers / declineTransfer | No | No |
> | transfers / operationStatus | No | No |
> | transfers / validateTransfer | No | No |
> | validateAddress | No | No |

## Microsoft.BingMaps

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | mapApis | Yes | Yes |
> | updateCommunicationPreference | No | No |

## Microsoft.Blockchain

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | blockchainMembers | Yes | Yes |
> | cordaMembers | Yes | Yes |
> | watchers | Yes | Yes |

## Microsoft.BlockchainTokens

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | TokenServices | Yes | Yes |
> | TokenServices / BlockchainNetworks | No | No |
> | TokenServices / Groups | No | No |
> | TokenServices / Groups / Accounts | No | No |
> | TokenServices / TokenTemplates | No | No |

## Microsoft.Blueprint

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | blueprintAssignments | No | No |
> | blueprintAssignments / assignmentOperations | No | No |
> | blueprintAssignments / operations | No | No |
> | blueprints | No | No |
> | blueprints / artifacts | No | No |
> | blueprints / versions | No | No |
> | blueprints / versions / artifacts | No | No |

## Microsoft.BotService

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | botServices | Yes | Yes |
> | botServices / channels | No | No |
> | botServices / connections | No | No |
> | hostSettings | No | No |
> | languages | No | No |
> | templates | No | No |

## Microsoft.Cache

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | Redis | Yes | Yes |
> | Redis / EventGridFilters | No | No |
> | Redis / privateEndpointConnectionProxies | No | No |
> | Redis / privateEndpointConnectionProxies / validate | No | No |
> | Redis / privateEndpointConnections | No | No |
> | Redis / privateLinkResources | No | No |
> | redisEnterprise | Yes | Yes |
> | redisEnterprise / databases | No | No |
> | RedisEnterprise / privateEndpointConnectionProxies | No | No |
> | RedisEnterprise / privateEndpointConnectionProxies / validate | No | No |
> | RedisEnterprise / privateEndpointConnections | No | No |
> | RedisEnterprise / privateLinkResources | No | No |

## Microsoft.Capacity

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | appliedReservations | No | No |
> | autoQuotaIncrease | No | No |
> | calculateExchange | No | No |
> | calculatePrice | No | No |
> | calculatePurchasePrice | No | No |
> | catalogs | No | No |
> | commercialReservationOrders | No | No |
> | exchange | No | No |
> | ownReservations | No | No |
> | placePurchaseOrder | No | No |
> | reservationOrders | No | No |
> | reservationOrders / calculateRefund | No | No |
> | reservationOrders / merge | No | No |
> | reservationOrders / reservations | No | No |
> | reservationOrders / reservations / revisions | No | No |
> | reservationOrders / return | No | No |
> | reservationOrders / split | No | No |
> | reservationOrders / swap | No | No |
> | reservations | No | No |
> | resourceProviders | No | No |
> | resources | No | No |
> | validateReservationOrder | No | No |

## Microsoft.Cascade

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | sites | Yes | Yes |

## Microsoft.Cdn

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | CdnWebApplicationFirewallManagedRuleSets | No | No |
> | CdnWebApplicationFirewallPolicies | Yes | Yes |
> | edgenodes | No | No |
> | profiles | Yes | Yes |
> | profiles / afdendpoints | Yes | Yes |
> | profiles / afdendpoints / routes | No | No |
> | profiles / customdomains | No | No |
> | profiles / endpoints | Yes | Yes |
> | profiles / endpoints / customdomains | No | No |
> | profiles / endpoints / origingroups | No | No |
> | profiles / endpoints / origins | No | No |
> | profiles / origingroups | No | No |
> | profiles / origingroups / origins | No | No |
> | profiles / rulesets | No | No |
> | profiles / rulesets / rules | No | No |
> | profiles / secrets | No | No |
> | profiles / securitypolicies | No | No |
> | validateProbe | No | No |

## Microsoft.CertificateRegistration

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | certificateOrders | Yes | Yes |
> | certificateOrders / certificates | No | No |
> | validateCertificateRegistrationInformation | No | No |

## Microsoft.ChangeAnalysis

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | changes | No | No |
> | profile | No | No |
> | resourceChanges | No | No |

## Microsoft.ClassicCompute

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | capabilities | No | No |
> | domainNames | No | No |
> | domainNames / capabilities | No | No |
> | domainNames / internalLoadBalancers | No | No |
> | domainNames / serviceCertificates | No | No |
> | domainNames / slots | No | No |
> | domainNames / slots / roles | No | No |
> | domainNames / slots / roles / metricDefinitions | No | No |
> | domainNames / slots / roles / metrics | No | No |
> | moveSubscriptionResources | No | No |
> | operatingSystemFamilies | No | No |
> | operatingSystems | No | No |
> | quotas | No | No |
> | resourceTypes | No | No |
> | validateSubscriptionMoveAvailability | No | No |
> | virtualMachines | No | No |
> | virtualMachines / diagnosticSettings | No | No |
> | virtualMachines / metricDefinitions | No | No |
> | virtualMachines / metrics | No | No |

## Microsoft.ClassicInfrastructureMigrate

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | classicInfrastructureResources | No | No |

## Microsoft.ClassicNetwork

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | capabilities | No | No |
> | expressRouteCrossConnections | No | No |
> | expressRouteCrossConnections / peerings | No | No |
> | gatewaySupportedDevices | No | No |
> | networkSecurityGroups | No | No |
> | quotas | No | No |
> | reservedIps | No | No |
> | virtualNetworks | No | No |
> | virtualNetworks / remoteVirtualNetworkPeeringProxies | No | No |
> | virtualNetworks / virtualNetworkPeerings | No | No |

## Microsoft.ClassicStorage

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | capabilities | No | No |
> | disks | No | No |
> | images | No | No |
> | osImages | No | No |
> | osPlatformImages | No | No |
> | publicImages | No | No |
> | quotas | No | No |
> | storageAccounts | No | No |
> | storageAccounts / blobServices | No | No |
> | storageAccounts / fileServices | No | No |
> | storageAccounts / metricDefinitions | No | No |
> | storageAccounts / metrics | No | No |
> | storageAccounts / queueServices | No | No |
> | storageAccounts / services | No | No |
> | storageAccounts / services / diagnosticSettings | No | No |
> | storageAccounts / services / metricDefinitions | No | No |
> | storageAccounts / services / metrics | No | No |
> | storageAccounts / tableServices | No | No |
> | storageAccounts / vmImages | No | No |
> | vmImages | No | No |

## Microsoft.ClusterStor

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | nodes | Yes | Yes |

## Microsoft.Codespaces

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | plans | Yes | No |
> | registeredSubscriptions | No | No |

## Microsoft.CognitiveServices

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | accounts | Yes | Yes |
> | accounts / privateEndpointConnectionProxies | No | No |
> | accounts / privateEndpointConnections | No | No |
> | accounts / privateLinkResources | No | No |

## Microsoft.Commerce

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | RateCard | No | No |
> | UsageAggregates | No | No |

## Microsoft.Compute

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | availabilitySets | Yes | Yes |
> | cloudServices | Yes | Yes |
> | cloudServices / networkInterfaces | No | No |
> | cloudServices / publicIPAddresses | No | No |
> | cloudServices / roleInstances | No | No |
> | cloudServices / roleInstances / networkInterfaces | No | No |
> | cloudServices / roles | No | No |
> | diskAccesses | Yes | Yes |
> | diskEncryptionSets | Yes | Yes |
> | disks | Yes | Yes |
> | galleries | Yes | Yes |
> | galleries / applications | No | No |
> | galleries / applications / versions | No | No |
> | galleries / images | No | No |
> | galleries / images / versions | No | No |
> | hostGroups | Yes | Yes |
> | hostGroups / hosts | Yes | Yes |
> | images | Yes | Yes |
> | proximityPlacementGroups | Yes | Yes |
> | restorePointCollections | Yes | Yes |
> | restorePointCollections / restorePoints | No | No |
> | sharedVMExtensions | Yes | Yes |
> | sharedVMExtensions / versions | No | No |
> | sharedVMImages | Yes | Yes |
> | sharedVMImages / versions | No | No |
> | snapshots | Yes | Yes |
> | sshPublicKeys | Yes | Yes |
> | virtualMachines | Yes | Yes |
> | virtualMachines / extensions | Yes | Yes |
> | virtualMachines / metricDefinitions | No | No |
> | virtualMachines / runCommands | Yes | Yes |
> | virtualMachineScaleSets | Yes | Yes |
> | virtualMachineScaleSets / extensions | No | No |
> | virtualMachineScaleSets / networkInterfaces | No | No |
> | virtualMachineScaleSets / publicIPAddresses | Yes | No |
> | virtualMachineScaleSets / virtualMachines | No | No |
> | virtualMachineScaleSets / virtualMachines / networkInterfaces | No | No |

> [!NOTE]
> You can't add a tag to a virtual machine that has been marked as generalized. You mark a virtual machine as generalized with [Set-AzVm -Generalized](/powershell/module/Az.Compute/Set-AzVM) or [az vm generalize](/cli/azure/vm#az_vm_generalize).

## Microsoft.ConnectedCache

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | CacheNodes | Yes | Yes |

## Microsoft.ConnectedVehicle

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | platformAccounts | Yes | Yes |
> | registeredSubscriptions | No | No |

## Microsoft.ConnectedVMwarevSphere

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | ResourcePools | Yes | Yes |
> | VCenters | Yes | Yes |
> | VCenters / InventoryItems | No | No |
> | VirtualMachines | Yes | Yes |
> | VirtualMachines / Extensions | Yes | Yes |
> | VirtualMachines / GuestAgents | No | No |
> | VirtualMachines / HybridIdentityMetadata | No | No |
> | VirtualMachineTemplates | Yes | Yes |
> | VirtualNetworks | Yes | Yes |

## Microsoft.Consumption

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | AggregatedCost | No | No |
> | Balances | No | No |
> | Budgets | No | No |
> | Charges | No | No |
> | CostTags | No | No |
> | credits | No | No |
> | events | No | No |
> | Forecasts | No | No |
> | lots | No | No |
> | Marketplaces | No | No |
> | Pricesheets | No | No |
> | products | No | No |
> | ReservationDetails | No | No |
> | ReservationRecommendationDetails | No | No |
> | ReservationRecommendations | No | No |
> | ReservationSummaries | No | No |
> | ReservationTransactions | No | No |
> | Tags | No | No |
> | tenants | No | No |
> | Terms | No | No |
> | UsageDetails | No | No |

## Microsoft.ContainerInstance

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | containerGroups | Yes | Yes |
> | serviceAssociationLinks | No | No |

## Microsoft.ContainerRegistry

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | registries | Yes | Yes |
> | registries / agentPools | Yes | Yes |
> | registries / builds | No | No |
> | registries / builds / cancel | No | No |
> | registries / builds / getLogLink | No | No |
> | registries / buildTasks | Yes | Yes |
> | registries / buildTasks / steps | No | No |
> | registries / connectedRegistries | No | No |
> | registries / connectedRegistries / deactivate | No | No |
> | registries / eventGridFilters | No | No |
> | registries / exportPipelines | No | No |
> | registries / generateCredentials | No | No |
> | registries / getBuildSourceUploadUrl | No | No |
> | registries / GetCredentials | No | No |
> | registries / importImage | No | No |
> | registries / importPipelines | No | No |
> | registries / pipelineRuns | No | No |
> | registries / privateEndpointConnectionProxies | No | No |
> | registries / privateEndpointConnectionProxies / validate | No | No |
> | registries / privateEndpointConnections | No | No |
> | registries / privateLinkResources | No | No |
> | registries / queueBuild | No | No |
> | registries / regenerateCredential | No | No |
> | registries / regenerateCredentials | No | No |
> | registries / replications | Yes | Yes |
> | registries / runs | No | No |
> | registries / runs / cancel | No | No |
> | registries / scheduleRun | No | No |
> | registries / scopeMaps | No | No |
> | registries / taskRuns | No | No |
> | registries / tasks | Yes | Yes |
> | registries / tokens | No | No |
> | registries / updatePolicies | No | No |
> | registries / webhooks | Yes | Yes |
> | registries / webhooks / getCallbackConfig | No | No |
> | registries / webhooks / ping | No | No |

## Microsoft.ContainerService

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | containerServices | Yes | Yes |
> | managedClusters | Yes | Yes |
> | ManagedClusters / eventGridFilters | No | No |
> | openShiftManagedClusters | Yes | Yes |

## Microsoft.CostManagement

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | Alerts | No | No |
> | BillingAccounts | No | No |
> | Budgets | No | No |
> | CloudConnectors | No | No |
> | Connectors | Yes | Yes |
> | costAllocationRules | No | No |
> | Departments | No | No |
> | Dimensions | No | No |
> | EnrollmentAccounts | No | No |
> | Exports | No | No |
> | ExternalBillingAccounts | No | No |
> | ExternalBillingAccounts / Alerts | No | No |
> | ExternalBillingAccounts / Dimensions | No | No |
> | ExternalBillingAccounts / Forecast | No | No |
> | ExternalBillingAccounts / Query | No | No |
> | ExternalSubscriptions | No | No |
> | ExternalSubscriptions / Alerts | No | No |
> | ExternalSubscriptions / Dimensions | No | No |
> | ExternalSubscriptions / Forecast | No | No |
> | ExternalSubscriptions / Query | No | No |
> | fetchPrices | No | No |
> | Forecast | No | No |
> | GenerateDetailedCostReport | No | No |
> | GenerateReservationDetailsReport | No | No |
> | Insights | No | No |
> | Query | No | No |
> | register | No | No |
> | Reportconfigs | No | No |
> | Reports | No | No |
> | ScheduledActions | No | No |
> | Settings | No | No |
> | showbackRules | No | No |
> | Views | No | No |

## Microsoft.CustomerLockbox

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | DisableLockbox | No | No |
> | EnableLockbox | No | No |
> | requests | No | No |
> | TenantOptedIn | No | No |

## Microsoft.CustomProviders

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | associations | No | No |
> | resourceProviders | Yes | Yes |

## Microsoft.D365CustomerInsights

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | instances | Yes | Yes |

## Microsoft.DataBox

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | jobs | Yes | Yes |

## Microsoft.DataBoxEdge

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | DataBoxEdgeDevices | Yes | Yes |

## Microsoft.Databricks

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | workspaces | Yes | Yes |
> | workspaces / dbWorkspaces | No | No |
> | workspaces / virtualNetworkPeerings | No | No |

## Microsoft.DataCatalog

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | catalogs | Yes | Yes |

## Microsoft.DataFactory

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | dataFactories | Yes | Yes |
> | dataFactories / diagnosticSettings | No | No |
> | dataFactories / metricDefinitions | No | No |
> | dataFactorySchema | No | No |
> | factories | Yes | Yes |
> | factories / integrationRuntimes | No | No |

> [!NOTE]
> If you have Azure-SSIS integration runtimes in your data factory, their running cost will be tagged with data factory tags. Running Azure-SSIS integration runtimes must be stopped and restarted for new data factory tags to be applied to their running cost.

## Microsoft.DataLakeAnalytics

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | accounts | Yes | Yes |
> | accounts / dataLakeStoreAccounts | No | No |
> | accounts / storageAccounts | No | No |
> | accounts / storageAccounts / containers | No | No |
> | accounts / transferAnalyticsUnits | No | No |

## Microsoft.DataLakeStore

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | accounts | Yes | Yes |
> | accounts / eventGridFilters | No | No |
> | accounts / firewallRules | No | No |

## Microsoft.DataMigration

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | DatabaseMigrations | No | No |
> | services | Yes | Yes |
> | services / projects | Yes | Yes |
> | SqlMigrationServices | Yes | Yes |

## Microsoft.DataProtection

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | BackupVaults | Yes | Yes |
> | ResourceGuards | Yes | Yes |

## Microsoft.DataShare

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | accounts | Yes | Yes |
> | accounts / shares | No | No |
> | accounts / shares / datasets | No | No |
> | accounts / shares / invitations | No | No |
> | accounts / shares / providersharesubscriptions | No | No |
> | accounts / shares / synchronizationSettings | No | No |
> | accounts / sharesubscriptions | No | No |
> | accounts / sharesubscriptions / consumerSourceDataSets | No | No |
> | accounts / sharesubscriptions / datasetmappings | No | No |
> | accounts / sharesubscriptions / triggers | No | No |

## Microsoft.DBforMariaDB

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | servers | Yes | Yes |
> | servers / advisors | No | No |
> | servers / keys | No | No |
> | servers / privateEndpointConnectionProxies | No | No |
> | servers / privateEndpointConnections | No | No |
> | servers / privateLinkResources | No | No |
> | servers / queryTexts | No | No |
> | servers / recoverableServers | No | No |
> | servers / resetQueryPerformanceInsightData | No | No |
> | servers / start | No | No |
> | servers / stop | No | No |
> | servers / topQueryStatistics | No | No |
> | servers / virtualNetworkRules | No | No |
> | servers / waitStatistics | No | No |

## Microsoft.DBforMySQL

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | flexibleServers | Yes | Yes |
> | servers | Yes | Yes |
> | servers / advisors | No | No |
> | servers / keys | No | No |
> | servers / privateEndpointConnectionProxies | No | No |
> | servers / privateEndpointConnections | No | No |
> | servers / privateLinkResources | No | No |
> | servers / queryTexts | No | No |
> | servers / recoverableServers | No | No |
> | servers / resetQueryPerformanceInsightData | No | No |
> | servers / start | No | No |
> | servers / stop | No | No |
> | servers / topQueryStatistics | No | No |
> | servers / upgrade | No | No |
> | servers / virtualNetworkRules | No | No |
> | servers / waitStatistics | No | No |

## Microsoft.DBforPostgreSQL

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | flexibleServers | Yes | Yes |
> | serverGroups | Yes | Yes |
> | serverGroupsv2 | Yes | Yes |
> | servers | Yes | Yes |
> | servers / advisors | No | No |
> | servers / keys | No | No |
> | servers / privateEndpointConnectionProxies | No | No |
> | servers / privateEndpointConnections | No | No |
> | servers / privateLinkResources | No | No |
> | servers / queryTexts | No | No |
> | servers / recoverableServers | No | No |
> | servers / resetQueryPerformanceInsightData | No | No |
> | servers / topQueryStatistics | No | No |
> | servers / virtualNetworkRules | No | No |
> | servers / waitStatistics | No | No |
> | serversv2 | Yes | Yes |

## Microsoft.DeploymentManager

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | artifactSources | Yes | Yes |
> | rollouts | Yes | Yes |
> | serviceTopologies | Yes | Yes |
> | serviceTopologies / services | Yes | Yes |
> | serviceTopologies / services / serviceUnits | Yes | Yes |
> | steps | Yes | Yes |

## Microsoft.DesktopVirtualization

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | applicationgroups | Yes | Yes |
> | applicationgroups / applications | No | No |
> | applicationgroups / desktops | No | No |
> | applicationgroups / startmenuitems | No | No |
> | hostpools | Yes | Yes |
> | hostpools / msixpackages | No | No |
> | hostpools / sessionhosts | No | No |
> | hostpools / sessionhosts / usersessions | No | No |
> | hostpools / usersessions | No | No |
> | scalingPlans | Yes | Yes |
> | workspaces | Yes | Yes |

## Microsoft.Devices

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | ElasticPools | Yes | Yes |
> | ElasticPools / IotHubTenants | Yes | Yes |
> | ElasticPools / IotHubTenants / securitySettings | No | No |
> | IotHubs | Yes | Yes |
> | IotHubs / eventGridFilters | No | No |
> | IotHubs / securitySettings | No | No |
> | ProvisioningServices | Yes | Yes |
> | usages | No | No |

## Microsoft.DeviceUpdate

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | accounts | Yes | Yes |
> | accounts / instances | Yes | Yes |
> | registeredSubscriptions | No | No |

## Microsoft.DevOps

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | pipelines | Yes | Yes |

## Microsoft.DevSpaces

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | controllers | Yes | Yes |

## Microsoft.DevTestLab

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | labcenters | Yes | Yes |
> | labs | Yes | Yes |
> | labs / environments | Yes | Yes |
> | labs / serviceRunners | Yes | Yes |
> | labs / virtualMachines | Yes | Yes |
> | schedules | Yes | Yes |

## Microsoft.DigitalTwins

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | digitalTwinsInstances | Yes | Yes |
> | digitalTwinsInstances / endpoints | No | No |

## Microsoft.DocumentDB

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | cassandraClusters | Yes | Yes |
> | databaseAccountNames | No | No |
> | databaseAccounts | Yes | Yes |
> | restorableDatabaseAccounts | No | No |

## Microsoft.DomainRegistration

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | domains | Yes | Yes |
> | domains / domainOwnershipIdentifiers | No | No |
> | generateSsoRequest | No | No |
> | topLevelDomains | No | No |
> | validateDomainRegistrationInformation | No | No |

## Microsoft.DynamicsLcs

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | lcsprojects | No | No |
> | lcsprojects / clouddeployments | No | No |
> | lcsprojects / connectors | No | No |

## Microsoft.EdgeOrder

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | addresses | Yes | Yes |
> | orderCollections | Yes | Yes |
> | orders | Yes | Yes |
> | productFamiliesMetadata | No | No |

## Microsoft.EnterpriseKnowledgeGraph

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | services | Yes | Yes |

## Microsoft.EventGrid

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | domains | Yes | Yes |
> | domains / topics | No | No |
> | eventSubscriptions | No | No |
> | extensionTopics | No | No |
> | partnerNamespaces | Yes | Yes |
> | partnerNamespaces / eventChannels | No | No |
> | partnerRegistrations | Yes | Yes |
> | partnerTopics | Yes | Yes |
> | partnerTopics / eventSubscriptions | No | No |
> | systemTopics | Yes | Yes |
> | systemTopics / eventSubscriptions | No | No |
> | topics | Yes | Yes |
> | topicTypes | No | No |

## Microsoft.EventHub

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | clusters | Yes | Yes |
> | namespaces | Yes | Yes |
> | namespaces / authorizationrules | No | No |
> | namespaces / disasterrecoveryconfigs | No | No |
> | namespaces / eventhubs | No | No |
> | namespaces / eventhubs / authorizationrules | No | No |
> | namespaces / eventhubs / consumergroups | No | No |
> | namespaces / networkrulesets | No | No |
> | namespaces / privateEndpointConnections | No | No |

## Microsoft.Experimentation

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | experimentWorkspaces | Yes | Yes |

## Microsoft.Falcon

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | namespaces | Yes | Yes |

## Microsoft.Features

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | featureConfigurations | No | No |
> | featureProviderNamespaces | No | No |
> | featureProviders | No | No |
> | features | No | No |
> | providers | No | No |
> | subscriptionFeatureRegistrations | No | No |

## Microsoft.Gallery

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | enroll | No | No |
> | galleryitems | No | No |
> | generateartifactaccessuri | No | No |
> | myareas | No | No |
> | myareas / areas | No | No |
> | myareas / areas / areas | No | No |
> | myareas / areas / areas / galleryitems | No | No |
> | myareas / areas / galleryitems | No | No |
> | myareas / galleryitems | No | No |
> | register | No | No |
> | resources | No | No |
> | retrieveresourcesbyid | No | No |

## Microsoft.Genomics

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | accounts | Yes | Yes |

## Microsoft.GuestConfiguration

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | autoManagedAccounts | Yes | Yes |
> | autoManagedVmConfigurationProfiles | Yes | Yes |
> | configurationProfileAssignments | No | No |
> | guestConfigurationAssignments | No | No |
> | software | No | No |
> | softwareUpdateProfile | No | No |
> | softwareUpdates | No | No |

## Microsoft.HanaOnAzure

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | hanaInstances | Yes | Yes |
> | sapMonitors | Yes | Yes |

## Microsoft.HardwareSecurityModules

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | dedicatedHSMs | Yes | Yes |

## Microsoft.HDInsight

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | clusterPools | Yes | Yes |
> | clusterPools / clusters | Yes | Yes |
> | clusters | Yes | Yes |
> | clusters / applications | No | No |

## Microsoft.HealthBot

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | healthBots | Yes | Yes |

## Microsoft.HealthcareApis

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | services | Yes | Yes |
> | services / iomtconnectors | No | No |
> | services / iomtconnectors / connections | No | No |
> | services / iomtconnectors / mappings | No | No |
> | services / privateEndpointConnectionProxies | No | No |
> | services / privateEndpointConnections | No | No |
> | services / privateLinkResources | No | No |
> | workspaces | Yes | Yes |
> | workspaces / dicomservices | Yes | Yes |

## Microsoft.HybridCompute

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | machines | Yes | Yes |
> | machines / assessPatches | No | No |
> | machines / extensions | Yes | Yes |
> | machines / installPatches | No | No |
> | machines / privateLinkScopes | No | No |
> | privateLinkScopes | Yes | Yes |
> | privateLinkScopes / privateEndpointConnectionProxies | No | No |
> | privateLinkScopes / privateEndpointConnections | No | No |

## Microsoft.HybridData

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | dataManagers | Yes | Yes |

## Microsoft.HybridNetwork

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | devices | Yes | Yes |
> | networkfunctions | Yes | Yes |
> | networkFunctionVendors | No | No |
> | registeredSubscriptions | No | No |
> | Vendors | No | No |
> | Vendors / vendorskus | No | No |
> | Vendors / vendorskus / previewsubscriptions | No | No |
> | virtualNetworkFunctions | Yes | Yes |
> | virtualNetworkFunctionVendors | No | No |

## Microsoft.Hydra

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | components | Yes | Yes |
> | networkScopes | Yes | Yes |

## Microsoft.ImportExport

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | jobs | Yes | Yes |

## Microsoft.Insights

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | actionGroups | Yes | Yes |
> | activityLogAlerts | Yes | Yes |
> | alertrules | Yes | Yes |
> | autoscalesettings | Yes | Yes |
> | components | Yes | Yes |
> | components / linkedStorageAccounts | No | No |
> | components / ProactiveDetectionConfigs | No | No |
> | diagnosticSettings | No | No |
> | guestDiagnosticSettings | Yes | Yes |
> | guestDiagnosticSettingsAssociation | Yes | Yes |
> | logprofiles | Yes | Yes |
> | metricAlerts | Yes | Yes |
> | privateLinkScopes | Yes | Yes |
> | privateLinkScopes / privateEndpointConnections | No | No |
> | privateLinkScopes / scopedResources | No | No |
> | queryPacks | Yes | Yes |
> | queryPacks / queries | No | No |
> | scheduledQueryRules | Yes | Yes |
> | webtests | Yes | Yes |
> | workbooks | Yes | Yes |
> | workbooktemplates | Yes | Yes |

## Microsoft.Intune

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | diagnosticSettings | No | No |
> | diagnosticSettingsCategories | No | No |

## Microsoft.IoTCentral

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | appTemplates | No | No |
> | IoTApps | Yes | Yes |

## Microsoft.IoTSecurity

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | defenderSettings | No | No |

## Microsoft.IoTSpaces

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | Graph | Yes | Yes |

## Microsoft.KeyVault

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | deletedManagedHSMs | No | No |
> | deletedVaults | No | No |
> | hsmPools | Yes | Yes |
> | managedHSMs | Yes | Yes |
> | vaults | Yes | Yes |
> | vaults / accessPolicies | No | No |
> | vaults / eventGridFilters | No | No |
> | vaults / keys | No | No |
> | vaults / keys / versions | No | No |
> | vaults / secrets | No | No |

## Microsoft.Kubernetes

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | connectedClusters | Yes | Yes |
> | registeredSubscriptions | No | No |

## Microsoft.KubernetesConfiguration

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | extensions | No | No |
> | sourceControlConfigurations | No | No |

## Microsoft.Kusto

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | clusters | Yes | Yes |
> | clusters / attacheddatabaseconfigurations | No | No |
> | clusters / databases | No | No |
> | clusters / databases / dataconnections | No | No |
> | clusters / databases / eventhubconnections | No | No |
> | clusters / databases / principalassignments | No | No |
> | clusters / databases / scripts | No | No |
> | clusters / dataconnections | No | No |
> | clusters / principalassignments | No | No |
> | clusters / sharedidentities | No | No |

## Microsoft.LabServices

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | labaccounts | Yes | No |
> | labplans | Yes | Yes |
> | labs | Yes | Yes |
> | users | No | No |

## Microsoft.Logic

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | hostingEnvironments | Yes | Yes |
> | integrationAccounts | Yes | Yes |
> | integrationServiceEnvironments | Yes | Yes |
> | integrationServiceEnvironments / managedApis | No | No |
> | isolatedEnvironments | Yes | Yes |
> | workflows | Yes | Yes |

## Microsoft.MachineLearning

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | commitmentPlans | Yes | Yes |
> | webServices | Yes | Yes |
> | Workspaces | Yes | Yes |

## Microsoft.MachineLearningServices

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | modelinventories | Yes | Yes |
> | virtualclusters | Yes | Yes |
> | workspaces | Yes | Yes |
> | workspaces / batchEndpoints | Yes | Yes |
> | workspaces / batchEndpoints / deployments | Yes | Yes |
> | workspaces / batchEndpoints / deployments / jobs | No | No |
> | workspaces / batchEndpoints / jobs | No | No |
> | workspaces / codes | No | No |
> | workspaces / codes / versions | No | No |
> | workspaces / computes | No | No |
> | workspaces / data | No | No |
> | workspaces / datastores | No | No |
> | workspaces / environments | No | No |
> | workspaces / eventGridFilters | No | No |
> | workspaces / jobs | No | No |
> | workspaces / labelingJobs | No | No |
> | workspaces / linkedServices | No | No |
> | workspaces / models | No | No |
> | workspaces / models / versions | No | No |
> | workspaces / onlineEndpoints | Yes | Yes |
> | workspaces / onlineEndpoints / deployments | Yes | Yes |

> [!NOTE]
> Workspace tags don't propagate to compute clusters and compute instances.

## Microsoft.Maintenance

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | applyUpdates | No | No |
> | configurationAssignments | No | No |
> | maintenanceConfigurations | Yes | Yes |
> | publicMaintenanceConfigurations | No | No |
> | updates | No | No |

## Microsoft.ManagedIdentity

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | Identities | No | No |
> | userAssignedIdentities | Yes | Yes |

## Microsoft.ManagedNetwork

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | managedNetworks | Yes | Yes |
> | managedNetworks / managedNetworkGroups | Yes | Yes |
> | managedNetworks / managedNetworkPeeringPolicies | Yes | Yes |
> | notification | Yes | Yes |

## Microsoft.ManagedServices

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | marketplaceRegistrationDefinitions | No | No |
> | registrationAssignments | No | No |
> | registrationDefinitions | No | No |

## Microsoft.Management

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | getEntities | No | No |
> | managementGroups | No | No |
> | managementGroups / settings | No | No |
> | resources | No | No |
> | startTenantBackfill | No | No |
> | tenantBackfillStatus | No | No |

## Microsoft.Maps

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | accounts | Yes | Yes |
> | accounts / creators | Yes | Yes |
> | accounts / eventGridFilters | No | No |
> | accounts / privateAtlases | Yes | Yes |

## Microsoft.Marketplace

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | macc | No | No |
> | offers | No | No |
> | offerTypes | No | No |
> | offerTypes / publishers | No | No |
> | offerTypes / publishers / offers | No | No |
> | offerTypes / publishers / offers / plans | No | No |
> | offerTypes / publishers / offers / plans / agreements | No | No |
> | offerTypes / publishers / offers / plans / configs | No | No |
> | offerTypes / publishers / offers / plans / configs / importImage | No | No |
> | privategalleryitems | No | No |
> | privateStoreClient | No | No |
> | privateStores | No | No |
> | privateStores / AdminRequestApprovals | No | No |
> | privateStores / offers | No | No |
> | privateStores / offers / acknowledgeNotification | No | No |
> | privateStores / queryNotificationsState | No | No |
> | privateStores / RequestApprovals | No | No |
> | privateStores / requestApprovals / query | No | No |
> | privateStores / requestApprovals / withdrawPlan | No | No |
> | products | No | No |
> | publishers | No | No |
> | publishers / offers | No | No |
> | publishers / offers / amendments | No | No |
> | register | No | No |

## Microsoft.MarketplaceApps

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | classicDevServices | Yes | Yes |
> | updateCommunicationPreference | No | No |

## Microsoft.MarketplaceOrdering

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | agreements | No | No |
> | offertypes | No | No |

## Microsoft.Media

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | mediaservices | Yes | Yes |
> | mediaservices / accountFilters | No | No |
> | mediaservices / assets | No | No |
> | mediaservices / assets / assetFilters | No | No |
> | mediaservices / contentKeyPolicies | No | No |
> | mediaservices / eventGridFilters | No | No |
> | mediaservices / graphInstances | No | No |
> | mediaservices / graphTopologies | No | No |
> | mediaservices / liveEventOperations | No | No |
> | mediaservices / liveEvents | Yes | Yes |
> | mediaservices / liveEvents / liveOutputs | No | No |
> | mediaservices / liveOutputOperations | No | No |
> | mediaservices / mediaGraphs | No | No |
> | mediaservices / privateEndpointConnectionOperations | No | No |
> | mediaservices / privateEndpointConnectionProxies | No | No |
> | mediaservices / privateEndpointConnections | No | No |
> | mediaservices / streamingEndpointOperations | No | No |
> | mediaservices / streamingEndpoints | Yes | Yes |
> | mediaservices / streamingLocators | No | No |
> | mediaservices / streamingPolicies | No | No |
> | mediaservices / transforms | No | No |
> | mediaservices / transforms / jobs | No | No |
> | videoAnalyzers | Yes | Yes |
> | videoAnalyzers / edgeModules | No | No |

## Microsoft.Microservices4Spring

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | appClusters | Yes | Yes |

## Microsoft.Migrate

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | assessmentProjects | Yes | Yes |
> | migrateprojects | Yes | Yes |
> | moveCollections | Yes | Yes |
> | projects | Yes | Yes |

## Microsoft.MixedReality

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | holographicsBroadcastAccounts | Yes | Yes |
> | objectAnchorsAccounts | Yes | Yes |
> | objectUnderstandingAccounts | Yes | Yes |
> | remoteRenderingAccounts | Yes | Yes |
> | spatialAnchorsAccounts | Yes | Yes |

## Microsoft.MobileNetwork

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | networks | Yes | Yes |
> | networks / sites | Yes | Yes |
> | packetCores | Yes | Yes |
> | sims | Yes | Yes |
> | sims / simProfiles | Yes | Yes |

## Microsoft.NetApp

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | netAppAccounts | Yes | No |
> | netAppAccounts / accountBackups | No | No |
> | netAppAccounts / capacityPools | Yes | No |
> | netAppAccounts / capacityPools / volumes | Yes | No |
> | netAppAccounts / capacityPools / volumes / snapshots | No | No |
> | netAppAccounts / volumeGroups | No | No |

## Microsoft.Network

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | applicationGateways | Yes | Yes |
> | applicationGatewayWebApplicationFirewallPolicies | Yes | Yes |
> | applicationSecurityGroups | Yes | Yes |
> | azureFirewallFqdnTags | No | No |
> | azureFirewalls | Yes | No |
> | bastionHosts | Yes | No |
> | bgpServiceCommunities | No | No |
> | connections | Yes | Yes |
> | ddosCustomPolicies | Yes | Yes |
> | ddosProtectionPlans | Yes | Yes |
> | dnsOperationStatuses | No | No |
> | dnszones | Yes | Yes |
> | dnszones / A | No | No |
> | dnszones / AAAA | No | No |
> | dnszones / all | No | No |
> | dnszones / CAA | No | No |
> | dnszones / CNAME | No | No |
> | dnszones / MX | No | No |
> | dnszones / NS | No | No |
> | dnszones / PTR | No | No |
> | dnszones / recordsets | No | No |
> | dnszones / SOA | No | No |
> | dnszones / SRV | No | No |
> | dnszones / TXT | No | No |
> | expressRouteCircuits | Yes | Yes |
> | expressRouteCrossConnections | Yes | Yes |
> | expressRouteGateways | Yes | Yes |
> | expressRoutePorts | Yes | Yes |
> | expressRouteServiceProviders | No | No |
> | firewallPolicies | Yes | Yes |
> | frontdoors | Yes, but limited (see [note below](#frontdoor)) | Yes |
> | frontdoorWebApplicationFirewallManagedRuleSets | Yes, but limited (see [note below](#frontdoor)) | No |
> | frontdoorWebApplicationFirewallPolicies | Yes, but limited (see [note below](#frontdoor)) | Yes |
> | getDnsResourceReference | No | No |
> | internalNotify | No | No |
> | ipGroups | Yes | Yes |
> | loadBalancers | Yes | Yes |
> | localNetworkGateways | Yes | Yes |
> | natGateways | Yes | Yes |
> | networkIntentPolicies | Yes | Yes |
> | networkInterfaces | Yes | Yes |
> | networkProfiles | Yes | Yes |
> | networkSecurityGroups | Yes | Yes |
> | networkWatchers | Yes | Yes |
> | networkWatchers / connectionMonitors | Yes | No |
> | networkWatchers / flowLogs | Yes | No |
> | networkWatchers / lenses | Yes | No |
> | networkWatchers / pingMeshes | Yes | No |
> | p2sVpnGateways | Yes | Yes |
> | privateDnsOperationStatuses | No | No |
> | privateDnsZones | Yes | Yes |
> | privateDnsZones / A | No | No |
> | privateDnsZones / AAAA | No | No |
> | privateDnsZones / all | No | No |
> | privateDnsZones / CNAME | No | No |
> | privateDnsZones / MX | No | No |
> | privateDnsZones / PTR | No | No |
> | privateDnsZones / SOA | No | No |
> | privateDnsZones / SRV | No | No |
> | privateDnsZones / TXT | No | No |
> | privateDnsZones / virtualNetworkLinks | Yes | Yes |
> | privateEndpoints | Yes | Yes |
> | privateLinkServices | Yes | Yes |
> | publicIPAddresses | Yes | Yes |
> | publicIPPrefixes | Yes | Yes |
> | routeFilters | Yes | Yes |
> | routeTables | Yes | Yes |
> | serviceEndpointPolicies | Yes | Yes |
> | trafficManagerGeographicHierarchies | No | No |
> | trafficmanagerprofiles | Yes | Yes |
> | trafficmanagerprofiles/heatMaps | No | No |
> | trafficManagerUserMetricsKeys | No | No |
> | virtualHubs | Yes | Yes |
> | virtualNetworkGateways | Yes | Yes |
> | virtualNetworks | Yes | Yes |
> | virtualNetworks / subnets | No | No |
> | virtualNetworkTaps | Yes | Yes |
> | virtualWans | Yes | No |
> | vpnGateways | Yes | Yes |
> | vpnSites | Yes | Yes |
> | webApplicationFirewallPolicies | Yes | Yes |

<a id="frontdoor"></a>

> [!NOTE]
> For Azure Front Door Service, you can apply tags when creating the resource, but updating or adding tags is not currently supported.


## Microsoft.Notebooks

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | NotebookProxies | No | No |

## Microsoft.NotificationHubs

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | namespaces | Yes | No |
> | namespaces / notificationHubs | Yes | No |

## Microsoft.ObjectStore

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | osNamespaces | Yes | Yes |

## Microsoft.OffAzure

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | HyperVSites | Yes | Yes |
> | ImportSites | Yes | Yes |
> | MasterSites | Yes | Yes |
> | ServerSites | Yes | Yes |
> | VMwareSites | Yes | Yes |

## Microsoft.OperationalInsights

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | clusters | Yes | Yes |
> | deletedWorkspaces | No | No |
> | linkTargets | No | No |
> | querypacks | Yes | Yes |
> | storageInsightConfigs | No | No |
> | workspaces | Yes | Yes |
> | workspaces / dataExports | No | No |
> | workspaces / dataSources | No | No |
> | workspaces / linkedServices | No | No |
> | workspaces / linkedStorageAccounts | No | No |
> | workspaces / metadata | No | No |
> | workspaces / query | No | No |
> | workspaces / scopedPrivateLinkProxies | No | No |
> | workspaces / storageInsightConfigs | No | No |
> | workspaces / tables | No | No |

## Microsoft.OperationsManagement

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | managementassociations | No | No |
> | managementconfigurations | Yes | Yes |
> | solutions | Yes | Yes |
> | views | Yes | Yes |

## Microsoft.Peering

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | cdnPeeringPrefixes | No | No |
> | legacyPeerings | No | No |
> | peerAsns | No | No |
> | peerings | Yes | Yes |
> | peeringServiceCountries | No | No |
> | peeringServiceProviders | No | No |
> | peeringServices | Yes | Yes |

## Microsoft.PolicyInsights

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | attestations | No | No |
> | eventGridFilters | No | No |
> | policyEvents | No | No |
> | policyMetadata | No | No |
> | policyStates | No | No |
> | policyTrackedResources | No | No |
> | remediations | No | No |

## Microsoft.Portal

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | consoles | No | No |
> | dashboards | Yes | Yes |
> | tenantconfigurations | No | No |
> | userSettings | No | No |

## Microsoft.PowerBI

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | privateLinkServicesForPowerBI | Yes | Yes |
> | tenants | Yes | Yes |
> | tenants / workspaces | No | No |
> | workspaceCollections | Yes | Yes |

## Microsoft.PowerBIDedicated

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | autoScaleVCores | Yes | Yes |
> | capacities | Yes | Yes |

## Microsoft.PowerPlatform

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | enterprisePolicies | Yes | Yes |

## Microsoft.ProjectBabylon

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | accounts | Yes | Yes |
> | deletedAccounts | No | No |

## Microsoft.ProviderHub

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | providerRegistrations | No | No |
> | providerRegistrations / customRollouts | No | No |
> | providerRegistrations / defaultRollouts | No | No |
> | providerRegistrations / resourceTypeRegistrations | No | No |

## Microsoft.Purview

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | accounts | Yes | Yes |
> | deletedAccounts | No | No |
> | getDefaultAccount | No | No |
> | removeDefaultAccount | No | No |
> | setDefaultAccount | No | No |

## Microsoft.Quantum

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | Workspaces | Yes | Yes |

## Microsoft.RecoveryServices

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | backupProtectedItems | No | No |
> | vaults | Yes | Yes |

## Microsoft.RedHatOpenShift

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | OpenShiftClusters | Yes | Yes |

## Microsoft.Relay

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | namespaces | Yes | Yes |
> | namespaces / authorizationrules | No | No |
> | namespaces / hybridconnections | No | No |
> | namespaces / hybridconnections / authorizationrules | No | No |
> | namespaces / privateEndpointConnections | No | No |
> | namespaces / wcfrelays | No | No |
> | namespaces / wcfrelays / authorizationrules | No | No |

## Microsoft.ResourceConnector

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | appliances | Yes | Yes |

## Microsoft.ResourceGraph

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | queries | Yes | Yes |
> | resourceChangeDetails | No | No |
> | resourceChanges | No | No |
> | resources | No | No |
> | resourcesHistory | No | No |
> | subscriptionsStatus | No | No |

## Microsoft.ResourceHealth

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | availabilityStatuses | No | No |
> | childAvailabilityStatuses | No | No |
> | childResources | No | No |
> | emergingissues | No | No |
> | events | No | No |
> | impactedResources | No | No |
> | metadata | No | No |

## Microsoft.Resources

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | deployments | Yes | No |
> | deployments / operations | No | No |
> | deploymentScripts | Yes | Yes |
> | deploymentScripts / logs | No | No |
> | links | No | No |
> | providers | No | No |
> | resourceGroups | Yes | No |
> | subscriptions | Yes | No |
> | templateSpecs | Yes | Yes |
> | templateSpecs / versions | Yes | Yes |
> | tenants | No | No |

## Microsoft.SaaS

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | applications | Yes | Yes |
> | resources | Yes | Yes |
> | saasresources | No | No |

## Microsoft.ScVmm

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | clouds | Yes | Yes |
> | VirtualMachines | Yes | Yes |
> | VirtualMachineTemplates | Yes | Yes |
> | VirtualNetworks | Yes | Yes |
> | vmmservers | Yes | Yes |

## Microsoft.Search

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | resourceHealthMetadata | No | No |
> | searchServices | Yes | Yes |

## Microsoft.Security

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | adaptiveNetworkHardenings | No | No |
> | advancedThreatProtectionSettings | No | No |
> | alerts | No | No |
> | alertsSuppressionRules | No | No |
> | allowedConnections | No | No |
> | applicationWhitelistings | No | No |
> | assessmentMetadata | No | No |
> | assessments | No | No |
> | autoDismissAlertsRules | No | No |
> | automations | Yes | Yes |
> | AutoProvisioningSettings | No | No |
> | Compliances | No | No |
> | connectors | No | No |
> | dataCollectionAgents | No | No |
> | devices | No | No |
> | deviceSecurityGroups | No | No |
> | discoveredSecuritySolutions | No | No |
> | externalSecuritySolutions | No | No |
> | InformationProtectionPolicies | No | No |
> | ingestionSettings | No | No |
> | insights | No | No |
> | iotAlerts | No | No |
> | iotAlertTypes | No | No |
> | iotDefenderSettings | No | No |
> | iotRecommendations | No | No |
> | iotRecommendationTypes | No | No |
> | iotSecuritySolutions | Yes | Yes |
> | iotSecuritySolutions / analyticsModels | No | No |
> | iotSecuritySolutions / analyticsModels / aggregatedAlerts | No | No |
> | iotSecuritySolutions / analyticsModels / aggregatedRecommendations | No | No |
> | iotSecuritySolutions / iotAlerts | No | No |
> | iotSecuritySolutions / iotAlertTypes | No | No |
> | iotSecuritySolutions / iotRecommendations | No | No |
> | iotSecuritySolutions / iotRecommendationTypes | No | No |
> | iotSensors | No | No |
> | iotSites | No | No |
> | jitNetworkAccessPolicies | No | No |
> | jitPolicies | No | No |
> | onPremiseIotSensors | No | No |
> | policies | No | No |
> | pricings | No | No |
> | regulatoryComplianceStandards | No | No |
> | regulatoryComplianceStandards / regulatoryComplianceControls | No | No |
> | regulatoryComplianceStandards / regulatoryComplianceControls / regulatoryComplianceAssessments | No | No |
> | secureScoreControlDefinitions | No | No |
> | secureScoreControls | No | No |
> | secureScores | No | No |
> | secureScores / secureScoreControls | No | No |
> | securityContacts | No | No |
> | securitySolutions | No | No |
> | securitySolutionsReferenceData | No | No |
> | securityStatuses | No | No |
> | securityStatusesSummaries | No | No |
> | serverVulnerabilityAssessments | No | No |
> | settings | No | No |
> | sqlVulnerabilityAssessments | No | No |
> | subAssessments | No | No |
> | tasks | No | No |
> | topologies | No | No |
> | workspaceSettings | No | No |

## Microsoft.SecurityGraph

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | diagnosticSettings | No | No |
> | diagnosticSettingsCategories | No | No |

## Microsoft.SecurityInsights

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | aggregations | No | No |
> | alertRules | No | No |
> | alertRuleTemplates | No | No |
> | automationRules | No | No |
> | bookmarks | No | No |
> | cases | No | No |
> | dataConnectors | No | No |
> | dataConnectorsCheckRequirements | No | No |
> | enrichment | No | No |
> | entities | No | No |
> | entityQueries | No | No |
> | entityQueryTemplates | No | No |
> | incidents | No | No |
> | officeConsents | No | No |
> | settings | No | No |
> | threatIntelligence | No | No |
> | watchlists | No | No |

## Microsoft.SerialConsole

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | consoleServices | No | No |
> | serialPorts | No | No |

## Microsoft.ServiceBus

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | namespaces | Yes | Yes |
> | namespaces / authorizationrules | No | No |
> | namespaces / disasterrecoveryconfigs | No | No |
> | namespaces / eventgridfilters | No | No |
> | namespaces / networkrulesets | No | No |
> | namespaces / privateEndpointConnections | No | No |
> | namespaces / queues | No | No |
> | namespaces / queues / authorizationrules | No | No |
> | namespaces / topics | No | No |
> | namespaces / topics / authorizationrules | No | No |
> | namespaces / topics / subscriptions | No | No |
> | namespaces / topics / subscriptions / rules | No | No |
> | premiumMessagingRegions | No | No |

## Microsoft.ServiceFabric

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | applications | Yes | Yes |
> | clusters | Yes | Yes |
> | clusters / applications | No | No |
> | containerGroups | Yes | Yes |
> | containerGroupSets | Yes | Yes |
> | edgeclusters | Yes | Yes |
> | edgeclusters / applications | No | No |
> | managedclusters | Yes | Yes |
> | managedclusters / applications | No | No |
> | managedclusters / applications / services | No | No |
> | managedclusters / applicationTypes | No | No |
> | managedclusters / applicationTypes / versions | No | No |
> | managedclusters / nodetypes | No | No |
> | networks | Yes | Yes |
> | secretstores | Yes | Yes |
> | secretstores / certificates | No | No |
> | secretstores / secrets | No | No |
> | volumes | Yes | Yes |

## Microsoft.ServiceFabricMesh

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | applications | Yes | Yes |
> | containerGroups | Yes | Yes |
> | gateways | Yes | Yes |
> | networks | Yes | Yes |
> | secrets | Yes | Yes |
> | volumes | Yes | Yes |

## Microsoft.ServiceLinker

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | linkers | No | No |

## Microsoft.Services

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | providerRegistrations | No | No |
> | providerRegistrations / resourceTypeRegistrations | No | No |
> | rollouts | Yes | Yes |

## Microsoft.SignalRService

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | SignalR | Yes | Yes |
> | SignalR / eventGridFilters | No | No |
> | WebPubSub | Yes | Yes |

## Microsoft.Singularity

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | accounts | Yes | Yes |
> | accounts / accountQuotaPolicies | No | No |
> | accounts / groupPolicies | No | No |
> | accounts / jobs | No | No |
> | accounts / storageContainers | No | No |
> | images | No | No |

## Microsoft.SoftwarePlan

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | hybridUseBenefits | No | No |

## Microsoft.Solutions

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | applicationDefinitions | Yes | Yes |
> | applications | Yes | Yes |
> | jitRequests | Yes | Yes |


## Microsoft.SQL

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | longtermRetentionManagedInstance / longtermRetentionDatabase / longtermRetentionBackup | No | No |
> | longtermRetentionServer / longtermRetentionDatabase / longtermRetentionBackup | No | No |
> | managedInstances | Yes | Yes |
> | managedInstances / databases | No | No |
> | managedInstances / databases / backupShortTermRetentionPolicies | No | No |
> | managedInstances / databases / schemas / tables / columns / sensitivityLabels | No | No |
> | managedInstances / databases / vulnerabilityAssessments | No | No |
> | managedInstances / databases / vulnerabilityAssessments / rules / baselines | No | No |
> | managedInstances / encryptionProtector | No | No |
> | managedInstances / keys | No | No |
> | managedInstances / restorableDroppedDatabases / backupShortTermRetentionPolicies | No | No |
> | managedInstances / vulnerabilityAssessments | No | No |
> | servers | Yes | Yes |
> | servers / administrators | No | No |
> | servers / communicationLinks | No | No |
> | servers / databases | Yes (see [note below](#sqlnote)) | Yes |
> | servers / encryptionProtector | No | No |
> | servers / firewallRules | No | No |
> | servers / keys | No | No |
> | servers / restorableDroppedDatabases | No | No |
> | servers / serviceobjectives | No | No |
> | servers / tdeCertificates | No | No |
> | virtualClusters | Yes | Yes |

<a id="sqlnote"></a>

> [!NOTE]
> The Master database doesn't support tags, but other databases, including Azure Synapse Analytics databases, support tags. Azure Synapse Analytics databases must be in Active (not Paused) state.

## Microsoft.SqlVirtualMachine

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | SqlVirtualMachineGroups | Yes | Yes |
> | SqlVirtualMachineGroups / AvailabilityGroupListeners | No | No |
> | SqlVirtualMachines | Yes | Yes |

## Microsoft.Storage

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | deletedAccounts | No | No |
> | storageAccounts | Yes | Yes |
> | storageAccounts / blobServices | No | No |
> | storageAccounts / fileServices | No | No |
> | storageAccounts / queueServices | No | No |
> | storageAccounts / services | No | No |
> | storageAccounts / services / metricDefinitions | No | No |
> | storageAccounts / tableServices | No | No |
> | usages | No | No |

## Microsoft.StorageCache

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | amlFilesystems | Yes | Yes |
> | caches | Yes | Yes |
> | caches / storageTargets | No | No |
> | usageModels | No | No |

## Microsoft.StorageReplication

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | replicationGroups | No | No |

## Microsoft.StorageSync

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | storageSyncServices | Yes | Yes |
> | storageSyncServices / registeredServers | No | No |
> | storageSyncServices / syncGroups | No | No |
> | storageSyncServices / syncGroups / cloudEndpoints | No | No |
> | storageSyncServices / syncGroups / serverEndpoints | No | No |
> | storageSyncServices / workflows | No | No |

## Microsoft.StorageSyncDev

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | storageSyncServices | Yes | Yes |
> | storageSyncServices / registeredServers | No | No |
> | storageSyncServices / syncGroups | No | No |
> | storageSyncServices / syncGroups / cloudEndpoints | No | No |
> | storageSyncServices / syncGroups / serverEndpoints | No | No |
> | storageSyncServices / workflows | No | No |

## Microsoft.StorageSyncInt

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | storageSyncServices | Yes | Yes |
> | storageSyncServices / registeredServers | No | No |
> | storageSyncServices / syncGroups | No | No |
> | storageSyncServices / syncGroups / cloudEndpoints | No | No |
> | storageSyncServices / syncGroups / serverEndpoints | No | No |
> | storageSyncServices / workflows | No | No |

## Microsoft.StorSimple

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | managers | Yes | Yes |

## Microsoft.StreamAnalytics

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | clusters | Yes | Yes |
> | clusters / privateEndpoints | No | No |
> | streamingjobs | Yes (see note below) | Yes |

> [!NOTE]
> You can't add a tag when streamingjobs is running. Stop the resource to add a tag.

## Microsoft.Subscription

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | acceptChangeTenant | No | No |
> | acceptOwnership | No | No |
> | acceptOwnershipStatus | No | No |
> | aliases | No | No |
> | cancel | No | No |
> | changeTenantRequest | No | No |
> | changeTenantStatus | No | No |
> | CreateSubscription | No | No |
> | enable | No | No |
> | policies | No | No |
> | rename | No | No |
> | SubscriptionDefinitions | No | No |
> | SubscriptionOperations | No | No |
> | subscriptions | No | No |

## Microsoft.Synapse

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | privateLinkHubs | Yes | Yes |
> | workspaces | Yes | Yes |
> | workspaces / bigDataPools | Yes | Yes |
> | workspaces / operationStatuses | No | No |
> | workspaces / sqlDatabases | Yes | Yes |
> | workspaces / sqlPools | Yes | Yes |

## Microsoft.TimeSeriesInsights

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | environments | Yes | No |
> | environments / accessPolicies | No | No |
> | environments / eventsources | Yes | No |
> | environments / privateEndpointConnectionProxies | No | No |
> | environments / privateEndpointConnections | No | No |
> | environments / privateLinkResources | No | No |
> | environments / referenceDataSets | Yes | No |

## Microsoft.Token

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | stores | Yes | Yes |
> | stores / accessPolicies | No | No |
> | stores / services | No | No |
> | stores / services / tokens | No | No |

## Microsoft.VirtualMachineImages

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | imageTemplates | Yes | Yes |
> | imageTemplates / runOutputs | No | No |

## Microsoft.VMware

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | ArcZones | Yes | Yes |
> | ResourcePools | Yes | Yes |
> | VCenters | Yes | Yes |
> | VCenters / InventoryItems | No | No |
> | virtualmachines | Yes | Yes |
> | VirtualMachineTemplates | Yes | Yes |
> | VirtualNetworks | Yes | Yes |

## Microsoft.VMwareCloudSimple

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | dedicatedCloudNodes | Yes | Yes |
> | dedicatedCloudServices | Yes | Yes |
> | virtualMachines | Yes | Yes |

## Microsoft.VnfManager

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | devices | Yes | Yes |
> | registeredSubscriptions | No | No |
> | vendors | No | No |
> | vendors / skus | No | No |
> | vendors / vnfs | No | No |
> | virtualNetworkFunctionSkus | No | No |
> | vnfs | Yes | Yes |

## Microsoft.VSOnline

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | accounts | Yes | No |
> | plans | Yes | No |
> | registeredSubscriptions | No | No |

## Microsoft.Web

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | apiManagementAccounts | No | No |
> | apiManagementAccounts / apiAcls | No | No |
> | apiManagementAccounts / apis | No | No |
> | apiManagementAccounts / apis / apiAcls | No | No |
> | apiManagementAccounts / apis / connectionAcls | No | No |
> | apiManagementAccounts / apis / connections | No | No |
> | apiManagementAccounts / apis / connections / connectionAcls | No | No |
> | apiManagementAccounts / apis / localizedDefinitions | No | No |
> | apiManagementAccounts / connectionAcls | No | No |
> | apiManagementAccounts / connections | No | No |
> | billingMeters | No | No |
> | certificates | Yes | Yes |
> | connectionGateways | Yes | Yes |
> | connections | Yes | Yes |
> | customApis | Yes | Yes |
> | deletedSites | No | No |
> | functionAppStacks | No | No |
> | generateGithubAccessTokenForAppserviceCLI | No | No |
> | hostingEnvironments | Yes | Yes |
> | hostingEnvironments / eventGridFilters | No | No |
> | hostingEnvironments / multiRolePools | No | No |
> | hostingEnvironments / workerPools | No | No |
> | kubeEnvironments | Yes | Yes |
> | publishingUsers | No | No |
> | recommendations | No | No |
> | resourceHealthMetadata | No | No |
> | runtimes | No | No |
> | serverFarms | Yes | Yes |
> | serverFarms / eventGridFilters | No | No |
> | serverFarms / firstPartyApps | No | No |
> | serverFarms / firstPartyApps / keyVaultSettings | No | No |
> | sites | Yes | Yes |
> | sites / config  | No | No |
> | sites / eventGridFilters | No | No |
> | sites / hostNameBindings | No | No |
> | sites / networkConfig | No | No |
> | sites / premieraddons | Yes | Yes |
> | sites / slots | Yes | Yes |
> | sites / slots / eventGridFilters | No | No |
> | sites / slots / hostNameBindings | No | No |
> | sites / slots / networkConfig | No | No |
> | sourceControls | No | No |
> | staticSites | Yes | Yes |
> | validate | No | No |
> | verifyHostingEnvironmentVnet | No | No |
> | webAppStacks | No | No |

## Microsoft.WindowsDefenderATP

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | diagnosticSettings | No | No |
> | diagnosticSettingsCategories | No | No |

## Microsoft.WindowsESU

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | multipleActivationKeys | Yes | Yes |

## Microsoft.WindowsIoT

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | DeviceServices | Yes | Yes |

## Microsoft.WorkloadBuilder

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | migrationAgents | Yes | Yes |
> | workloads | Yes | Yes |
> | workloads / instances | No | No |
> | workloads / versions | No | No |
> | workloads / versions / artifacts | No | No |

## Microsoft.WorkloadMonitor

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | monitors | No | No |

## Next steps

To learn how to apply tags to resources, see [Use tags to organize your Azure resources](tag-resources.md).

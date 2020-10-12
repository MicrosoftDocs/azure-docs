---
title: Move operation support by resource type
description: Lists the Azure resource types that can be moved to a new resource group or subscription.
ms.topic: conceptual
ms.date: 09/23/2020
---

# Move operation support for resources

This article lists whether an Azure resource type supports the move operation. It also provides information about special conditions to consider when moving a resource.

> [!IMPORTANT]
> In most cases, a child resource can't be moved independently from its parent resource. Child resources have a resource type in the format of `<resource-provider-namespace>/<parent-resource>/<child-resource>`. For example, `Microsoft.ServiceBus/namespaces/queues` is a child resource of `Microsoft.ServiceBus/namespaces`. When you move the parent resource, the child resource is automatically moved with it. If you don't see a child resource in this article, you can assume it is moved with the parent resource. If the parent resource doesn't support move, the child resource can't be moved.

Jump to a resource provider namespace:
> [!div class="op_single_selector"]
> - [Microsoft.AAD](#microsoftaad)
> - [microsoft.aadiam](#microsoftaadiam)
> - [Microsoft.Addons](#microsoftaddons)
> - [Microsoft.ADHybridHealthService](#microsoftadhybridhealthservice)
> - [Microsoft.Advisor](#microsoftadvisor)
> - [Microsoft.AlertsManagement](#microsoftalertsmanagement)
> - [Microsoft.AnalysisServices](#microsoftanalysisservices)
> - [Microsoft.ApiManagement](#microsoftapimanagement)
> - [Microsoft.AppConfiguration](#microsoftappconfiguration)
> - [Microsoft.AppPlatform](#microsoftappplatform)
> - [Microsoft.AppService](#microsoftappservice)
> - [Microsoft.Attestation](#microsoftattestation)
> - [Microsoft.Authorization](#microsoftauthorization)
> - [Microsoft.Automation](#microsoftautomation)
> - [Microsoft.AVS](#microsoftavs)
> - [Microsoft.AzureActiveDirectory](#microsoftazureactivedirectory)
> - [Microsoft.AzureData](#microsoftazuredata)
> - [Microsoft.AzureStack](#microsoftazurestack)
> - [Microsoft.AzureStackHCI](#microsoftazurestackhci)
> - [Microsoft.Batch](#microsoftbatch)
> - [Microsoft.Billing](#microsoftbilling)
> - [Microsoft.BingMaps](#microsoftbingmaps)
> - [Microsoft.BizTalkServices](#microsoftbiztalkservices)
> - [Microsoft.Blockchain](#microsoftblockchain)
> - [Microsoft.BlockchainTokens](#microsoftblockchaintokens)
> - [Microsoft.Blueprint](#microsoftblueprint)
> - [Microsoft.BotService](#microsoftbotservice)
> - [Microsoft.Cache](#microsoftcache)
> - [Microsoft.Capacity](#microsoftcapacity)
> - [Microsoft.Cdn](#microsoftcdn)
> - [Microsoft.CertificateRegistration](#microsoftcertificateregistration)
> - [Microsoft.ClassicCompute](#microsoftclassiccompute)
> - [Microsoft.ClassicInfrastructureMigrate](#microsoftclassicinfrastructuremigrate)
> - [Microsoft.ClassicNetwork](#microsoftclassicnetwork)
> - [Microsoft.ClassicStorage](#microsoftclassicstorage)
> - [Microsoft.ClassicSubscription](#microsoftclassicsubscription)
> - [Microsoft.CognitiveServices](#microsoftcognitiveservices)
> - [Microsoft.Commerce](#microsoftcommerce)
> - [Microsoft.Compute](#microsoftcompute)
> - [Microsoft.Consumption](#microsoftconsumption)
> - [Microsoft.ContainerInstance](#microsoftcontainerinstance)
> - [Microsoft.ContainerRegistry](#microsoftcontainerregistry)
> - [Microsoft.ContainerService](#microsoftcontainerservice)
> - [Microsoft.ContentModerator](#microsoftcontentmoderator)
> - [Microsoft.CortanaAnalytics](#microsoftcortanaanalytics)
> - [Microsoft.CostManagement](#microsoftcostmanagement)
> - [Microsoft.CustomerInsights](#microsoftcustomerinsights)
> - [Microsoft.CustomerLockbox](#microsoftcustomerlockbox)
> - [Microsoft.CustomProviders](#microsoftcustomproviders)
> - [Microsoft.DataBox](#microsoftdatabox)
> - [Microsoft.DataBoxEdge](#microsoftdataboxedge)
> - [Microsoft.Databricks](#microsoftdatabricks)
> - [Microsoft.DataCatalog](#microsoftdatacatalog)
> - [Microsoft.DataConnect](#microsoftdataconnect)
> - [Microsoft.DataExchange](#microsoftdataexchange)
> - [Microsoft.DataFactory](#microsoftdatafactory)
> - [Microsoft.DataLake](#microsoftdatalake)
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
> - [Microsoft.EnterpriseKnowledgeGraph](#microsoftenterpriseknowledgegraph)
> - [Microsoft.EventGrid](#microsofteventgrid)
> - [Microsoft.EventHub](#microsofteventhub)
> - [Microsoft.Experimentation](#microsoftexperimentation)
> - [Microsoft.Falcon](#microsoftfalcon)
> - [Microsoft.Features](#microsoftfeatures)
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
> - [microsoft.insights](#microsoftinsights)
> - [Microsoft.IoTCentral](#microsoftiotcentral)
> - [Microsoft.IoTSpaces](#microsoftiotspaces)
> - [Microsoft.KeyVault](#microsoftkeyvault)
> - [Microsoft.Kubernetes](#microsoftkubernetes)
> - [Microsoft.KubernetesConfiguration](#microsoftkubernetesconfiguration)
> - [Microsoft.Kusto](#microsoftkusto)
> - [Microsoft.LabServices](#microsoftlabservices)
> - [Microsoft.LocationBasedServices](#microsoftlocationbasedservices)
> - [Microsoft.LocationServices](#microsoftlocationservices)
> - [Microsoft.Logic](#microsoftlogic)
> - [Microsoft.MachineLearning](#microsoftmachinelearning)
> - [Microsoft.MachineLearningCompute](#microsoftmachinelearningcompute)
> - [Microsoft.MachineLearningExperimentation](#microsoftmachinelearningexperimentation)
> - [Microsoft.MachineLearningModelManagement](#microsoftmachinelearningmodelmanagement)
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
> - [Microsoft.SecurityInsights](#microsoftsecurityinsights)
> - [Microsoft.SerialConsole](#microsoftserialconsole)
> - [Microsoft.ServerManagement](#microsoftservermanagement)
> - [Microsoft.ServiceBus](#microsoftservicebus)
> - [Microsoft.ServiceFabric](#microsoftservicefabric)
> - [Microsoft.ServiceFabricMesh](#microsoftservicefabricmesh)
> - [Microsoft.Services](#microsoftservices)
> - [Microsoft.SignalRService](#microsoftsignalrservice)
> - [Microsoft.SoftwarePlan](#microsoftsoftwareplan)
> - [Microsoft.Solutions](#microsoftsolutions)
> - [Microsoft.Sql](#microsoftsql)
> - [Microsoft.SqlVirtualMachine](#microsoftsqlvirtualmachine)
> - [Microsoft.Storage](#microsoftstorage)
> - [Microsoft.StorageCache](#microsoftstoragecache)
> - [Microsoft.StorageSync](#microsoftstoragesync)
> - [Microsoft.StorageSyncDev](#microsoftstoragesyncdev)
> - [Microsoft.StorageSyncInt](#microsoftstoragesyncint)
> - [Microsoft.StorSimple](#microsoftstorsimple)
> - [Microsoft.StreamAnalytics](#microsoftstreamanalytics)
> - [Microsoft.StreamAnalyticsExplorer](#microsoftstreamanalyticsexplorer)
> - [Microsoft.Subscription](#microsoftsubscription)
> - [microsoft.support](#microsoftsupport)
> - [Microsoft.Synapse](#microsoftsynapse)
> - [Microsoft.TimeSeriesInsights](#microsofttimeseriesinsights)
> - [Microsoft.Token](#microsofttoken)
> - [Microsoft.VirtualMachineImages](#microsoftvirtualmachineimages)
> - [microsoft.visualstudio](#microsoftvisualstudio)
> - [Microsoft.VMware](#microsoftvmware)
> - [Microsoft.VMwareCloudSimple](#microsoftvmwarecloudsimple)
> - [Microsoft.VnfManager](#microsoftvnfmanager)
> - [Microsoft.VSOnline](#microsoftvsonline)
> - [Microsoft.Web](#microsoftweb)
> - [Microsoft.WindowsESU](#microsoftwindowsesu)
> - [Microsoft.WindowsIoT](#microsoftwindowsiot)
> - [Microsoft.WorkloadBuilder](#microsoftworkloadbuilder)
> - [Microsoft.WorkloadMonitor](#microsoftworkloadmonitor)

## Microsoft.AAD

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | domainservices | No | No |

## microsoft.aadiam

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | diagnosticsettings | No | No |
> | diagnosticsettingscategories | No | No |
> | privatelinkforazuread | Yes | Yes |
> | tenants | Yes | Yes |

## Microsoft.Addons

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | supportproviders | No | No |

## Microsoft.ADHybridHealthService

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
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
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | configurations | No | No |
> | generaterecommendations | No | No |
> | metadata | No | No |
> | recommendations | No | No |
> | suppressions | No | No |

## Microsoft.AlertsManagement

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | actionrules | Yes | Yes |
> | alerts | No | No |
> | alertslist | No | No |
> | alertsmetadata | No | No |
> | alertssummary | No | No |
> | alertssummarylist | No | No |
> | smartdetectoralertrules | Yes | Yes |
> | smartgroups | No | No |

## Microsoft.AnalysisServices

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | servers | Yes | Yes |

## Microsoft.ApiManagement

> [!IMPORTANT]
> An API Management service that is set to the Consumption SKU can't be moved.

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | reportfeedback | No | No |
> | service | Yes | Yes |

## Microsoft.AppConfiguration

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | configurationstores | Yes | Yes |
> | configurationstores / eventgridfilters | No | No |

## Microsoft.AppPlatform

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | spring | Yes | Yes |

## Microsoft.AppService

> [!IMPORTANT]
> See [App Service move guidance](./move-limitations/app-service-move-limitations.md).

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | apiapps | No | No |
> | appidentities | No | No |
> | gateways | No | No |

## Microsoft.Attestation

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | attestationproviders | Yes | Yes |

## Microsoft.Authorization

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | classicadministrators | No | No |
> | dataaliases | No | No |
> | denyassignments | No | No |
> | elevateaccess | No | No |
> | findorphanroleassignments | No | No |
> | locks | No | No |
> | permissions | No | No |
> | policyassignments | No | No |
> | policydefinitions | No | No |
> | policysetdefinitions | No | No |
> | privatelinkassociations | No | No |
> | resourcemanagementprivatelinks | No | No |
> | roleassignments | No | No |
> | roleassignmentsusagemetrics | No | No |
> | roledefinitions | No | No |

## Microsoft.Automation

> [!IMPORTANT]
> Runbooks must exist in the same resource group as the Automation Account.
>
> For information, see [Move your Azure Automation account to another subscription](../../automation/how-to/move-account.md?toc=/azure/azure-resource-manager/toc.json).

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | automationaccounts | Yes | Yes |
> | automationaccounts / configurations | Yes | Yes |
> | automationaccounts / runbooks | Yes | Yes |

## Microsoft.AVS

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | privateclouds | Yes | Yes |

## Microsoft.AzureActiveDirectory

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | b2cdirectories | Yes | Yes |
> | b2ctenants | No | No |

## Microsoft.AzureData

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | datacontrollers | No | No |
> | hybriddatamanagers | No | No |
> | postgresinstances | No | No |
> | sqlinstances | No | No |
> | sqlmanagedinstances | No | No |
> | sqlserverinstances | No | No |
> | sqlserverregistrations | Yes | Yes |

## Microsoft.AzureStack

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | cloudmanifestfiles | No | No |
> | registrations | Yes | Yes |

## Microsoft.AzureStackHCI

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | clusters | No | No |

## Microsoft.Batch

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | batchaccounts | Yes | Yes |

## Microsoft.Billing

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | billingaccounts | No | No |
> | billingperiods | No | No |
> | billingpermissions | No | No |
> | billingproperty | No | No |
> | billingroleassignments | No | No |
> | billingroledefinitions | No | No |
> | departments | No | No |
> | enrollmentaccounts | No | No |
> | invoices | No | No |
> | transfers | No | No |

## Microsoft.BingMaps

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | mapapis | No | No |

## Microsoft.BizTalkServices

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | biztalk | No | No |

## Microsoft.Blockchain

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | blockchainmembers | No | No |
> | cordamembers | No | No |
> | watchers | No | No |

## Microsoft.BlockchainTokens

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | tokenservices | No | No |

## Microsoft.Blueprint

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | blueprintassignments | No | No |
> | blueprints | No | No |

## Microsoft.BotService

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | botservices | Yes | Yes |

## Microsoft.Cache

> [!IMPORTANT]
> If the Azure Cache for Redis instance is configured with a virtual network, the instance can't be moved to a different subscription. See [Networking move limitations](./move-limitations/networking-move-limitations.md).

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | redis | Yes | Yes |
> | redisenterprise | No | No |

## Microsoft.Capacity

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | appliedreservations | No | No |
> | calculateexchange | No | No |
> | calculateprice | No | No |
> | calculatepurchaseprice | No | No |
> | catalogs | No | No |
> | commercialreservationorders | No | No |
> | exchange | No | No |
> | reservationorders | No | No |
> | reservations | No | No |
> | resources | No | No |
> | validatereservationorder | No | No |

## Microsoft.Cdn

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | cdnwebapplicationfirewallmanagedrulesets | No | No |
> | cdnwebapplicationfirewallpolicies | Yes | Yes |
> | edgenodes | No | No |
> | profiles | Yes | Yes |
> | profiles / endpoints | Yes | Yes |

## Microsoft.CertificateRegistration

> [!IMPORTANT]
> See [App Service move guidance](./move-limitations/app-service-move-limitations.md).

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | certificateorders | Yes | Yes |

## Microsoft.ClassicCompute

> [!IMPORTANT]
> See [Classic deployment move guidance](./move-limitations/classic-model-move-limitations.md). Classic deployment resources can be moved across subscriptions with an operation specific to that scenario.

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | capabilities | No | No |
> | domainnames | Yes | No |
> | quotas | No | No |
> | resourcetypes | No | No |
> | validatesubscriptionmoveavailability | No | No |
> | virtualmachines | Yes | Yes |

## Microsoft.ClassicInfrastructureMigrate

> [!IMPORTANT]
> See [Classic deployment move guidance](./move-limitations/classic-model-move-limitations.md). Classic deployment resources can be moved across subscriptions with an operation specific to that scenario.

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | classicinfrastructureresources | No | No |

## Microsoft.ClassicNetwork

> [!IMPORTANT]
> See [Classic deployment move guidance](./move-limitations/classic-model-move-limitations.md). Classic deployment resources can be moved across subscriptions with an operation specific to that scenario.

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | capabilities | No | No |
> | expressroutecrossconnections | No | No |
> | expressroutecrossconnections / peerings | No | No |
> | gatewaysupporteddevices | No | No |
> | networksecuritygroups | No | No |
> | quotas | No | No |
> | reservedips | No | No |
> | virtualnetworks | No | No |

## Microsoft.ClassicStorage

> [!IMPORTANT]
> See [Classic deployment move guidance](./move-limitations/classic-model-move-limitations.md). Classic deployment resources can be moved across subscriptions with an operation specific to that scenario.

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | disks | No | No |
> | images | No | No |
> | osimages | No | No |
> | osplatformimages | No | No |
> | publicimages | No | No |
> | quotas | No | No |
> | storageaccounts | Yes | No |
> | vmimages | No | No |

## Microsoft.ClassicSubscription

> [!IMPORTANT]
> See [Classic deployment move guidance](./move-limitations/classic-model-move-limitations.md). Classic deployment resources can be moved across subscriptions with an operation specific to that scenario.

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | operations | No | No |

## Microsoft.CognitiveServices

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | accounts | Yes | Yes |

## Microsoft.Commerce

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | ratecard | No | No |
> | usageaggregates | No | No |

## Microsoft.Compute

> [!IMPORTANT]
> See [Virtual Machines move guidance](./move-limitations/virtual-machines-move-limitations.md).

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | availabilitysets | Yes | Yes |
> | diskaccesses | No | No |
> | diskencryptionsets | No | No |
> | disks | Yes | Yes |
> | galleries | No | No |
> | galleries / images | No | No |
> | galleries / images / versions | No | No |
> | hostgroups | No | No |
> | hostgroups / hosts | No | No |
> | images | Yes | Yes |
> | proximityplacementgroups | Yes | Yes |
> | restorepointcollections | No | No |
> | restorepointcollections / restorepoints | No | No |
> | sharedvmextensions | No | No |
> | sharedvmimages | No | No |
> | sharedvmimages / versions | No | No |
> | snapshots | Yes | Yes |
> | sshpublickeys | No | No |
> | virtualmachines | Yes | Yes |
> | virtualmachines / extensions | Yes | Yes |
> | virtualmachinescalesets | Yes | Yes |

## Microsoft.Consumption

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | aggregatedcost | No | No |
> | balances | No | No |
> | budgets | No | No |
> | charges | No | No |
> | costtags | No | No |
> | credits | No | No |
> | events | No | No |
> | forecasts | No | No |
> | lots | No | No |
> | marketplaces | No | No |
> | pricesheets | No | No |
> | products | No | No |
> | reservationdetails | No | No |
> | reservationrecommendationdetails | No | No |
> | reservationrecommendations | No | No |
> | reservationsummaries | No | No |
> | reservationtransactions | No | No |
> | tags | No | No |
> | tenants | No | No |
> | terms | No | No |
> | usagedetails | No | No |

## Microsoft.ContainerInstance

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | containergroups | No | No |
> | serviceassociationlinks | No | No |

## Microsoft.ContainerRegistry

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | registries | Yes | Yes |
> | registries / agentpools | Yes | Yes |
> | registries / buildtasks | Yes | Yes |
> | registries / replications | Yes | Yes |
> | registries / tasks | Yes | Yes |
> | registries / webhooks | Yes | Yes |

## Microsoft.ContainerService

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | containerservices | No | No |
> | managedclusters | No | No |
> | openshiftmanagedclusters | No | No |

## Microsoft.ContentModerator

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | applications | No | No |

## Microsoft.CortanaAnalytics

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | accounts | No | No |

## Microsoft.CostManagement

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | alerts | No | No |
> | billingaccounts | No | No |
> | budgets | No | No |
> | cloudconnectors | No | No |
> | connectors | Yes | Yes |
> | departments | No | No |
> | dimensions | No | No |
> | enrollmentaccounts | No | No |
> | exports | No | No |
> | externalbillingaccounts | No | No |
> | forecast | No | No |
> | query | No | No |
> | register | No | No |
> | reportconfigs | No | No |
> | reports | No | No |
> | settings | No | No |
> | showbackrules | No | No |
> | views | No | No |

## Microsoft.CustomerInsights

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | hubs | No | No |

## Microsoft.CustomerLockbox

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | requests | No | No |

## Microsoft.CustomProviders

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | associations | No | No |
> | resourceproviders | Yes | Yes |

## Microsoft.DataBox

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | jobs | No | No |

## Microsoft.DataBoxEdge

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | availableskus | No | No |
> | databoxedgedevices | Yes | Yes |

## Microsoft.Databricks

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | workspaces | No | No |

## Microsoft.DataCatalog

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | catalogs | Yes | Yes |
> | datacatalogs | No | No |

## Microsoft.DataConnect

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | connectionmanagers | No | No |

## Microsoft.DataExchange

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | packages | No | No |
> | plans | No | No |

## Microsoft.DataFactory

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | datafactories | Yes | Yes |
> | datafactoryschema | No | No |
> | factories | Yes | Yes |

## Microsoft.DataLake

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | datalakeaccounts | No | No |

## Microsoft.DataLakeAnalytics

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | accounts | Yes | Yes |

## Microsoft.DataLakeStore

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | accounts | Yes | Yes |

## Microsoft.DataMigration

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | services | No | No |
> | services / projects | No | No |
> | slots | No | No |

## Microsoft.DataProtection

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | backupvaults | No | No |

## Microsoft.DataShare

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | accounts | Yes | Yes |

## Microsoft.DBforMariaDB

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | servers | Yes | Yes |

## Microsoft.DBforMySQL

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | flexibleServers | Yes | Yes |
> | servers | Yes | Yes |

## Microsoft.DBforPostgreSQL

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | flexibleServers | Yes | Yes |
> | servergroups | No | No |
> | servers | Yes | Yes |
> | serversv2 | Yes | Yes |
> | singleservers | Yes | Yes |

## Microsoft.DeploymentManager

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | artifactsources | Yes | Yes |
> | rollouts | Yes | Yes |
> | servicetopologies | Yes | Yes |
> | servicetopologies / services | Yes | Yes |
> | servicetopologies / services / serviceunits | Yes | Yes |
> | steps | Yes | Yes |

## Microsoft.DesktopVirtualization

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | applicationgroups | Yes | Yes |
> | hostpools | Yes | Yes |
> | workspaces | Yes | Yes |

## Microsoft.Devices

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | elasticpools | No | No |
> | elasticpools / iothubtenants | No | No |
> | iothubs | Yes | Yes |
> | provisioningservices | Yes | Yes |

## Microsoft.DevOps

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | pipelines | Yes | Yes |

## Microsoft.DevSpaces

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | controllers | Yes | Yes |

## Microsoft.DevTestLab

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | labcenters | No | No |
> | labs | Yes | No |
> | labs / environments | Yes | Yes |
> | labs / servicerunners | Yes | Yes |
> | labs / virtualmachines | Yes | No |
> | schedules | Yes | Yes |

## Microsoft.DigitalTwins

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | digitaltwinsinstances | No | No |

## Microsoft.DocumentDB

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | databaseaccountnames | No | No |
> | databaseaccounts | Yes | Yes |

## Microsoft.DomainRegistration

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | domains | Yes | Yes |
> | generatessorequest | No | No |
> | topleveldomains | No | No |
> | validatedomainregistrationinformation | No | No |

## Microsoft.EnterpriseKnowledgeGraph

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | services | Yes | Yes |

## Microsoft.EventGrid

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | domains | Yes | Yes |
> | eventsubscriptions | No - can't be moved independently but automatically moved with subscribed resource. | No - can't be moved independently but automatically moved with subscribed resource. |
> | extensiontopics | No | No |
> | partnernamespaces | Yes | Yes |
> | partnerregistrations | No | No |
> | partnertopics | Yes | Yes |
> | systemtopics | Yes | Yes |
> | topics | Yes | Yes |
> | topictypes | No | No |

## Microsoft.EventHub

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | clusters | Yes | Yes |
> | namespaces | Yes | Yes |
> | sku | No | No |

## Microsoft.Experimentation

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | experimentworkspaces | No | No |

## Microsoft.Falcon

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | namespaces | Yes | Yes |

## Microsoft.Features

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | featureproviders | No | No |
> | features | No | No |
> | providers | No | No |
> | subscriptionfeatureregistrations | No | No |

## Microsoft.Genomics

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | accounts | No | No |

## Microsoft.GuestConfiguration

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | automanagedaccounts | No | No |
> | automanagedvmconfigurationprofiles | No | No |
> | guestconfigurationassignments | No | No |
> | software | No | No |
> | softwareupdateprofile | No | No |
> | softwareupdates | No | No |

## Microsoft.HanaOnAzure

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | hanainstances | No | No |
> | sapmonitors | Yes | Yes |

## Microsoft.HardwareSecurityModules

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | dedicatedhsms | No | No |

## Microsoft.HDInsight

> [!IMPORTANT]
> You can move HDInsight clusters to a new subscription or resource group. However, you can't move across subscriptions the networking resources linked to the HDInsight cluster (such as the virtual network, NIC, or load balancer). In addition, you can't move to a new resource group a NIC that is attached to a virtual machine for the cluster.
>
> When moving an HDInsight cluster to a new subscription, first move other resources (like the storage account). Then, move the HDInsight cluster by itself.

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | clusters | Yes | Yes |

## Microsoft.HealthcareApis

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | services | Yes | Yes |

## Microsoft.HybridCompute

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | machines | Yes | Yes |
> | machines / extensions | Yes | Yes |

## Microsoft.HybridData

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | datamanagers | Yes | Yes |

## Microsoft.HybridNetwork

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | devices | No | No |
> | vnfs | No | No |

## Microsoft.Hydra

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | components | No | No |
> | networkscopes | No | No |

## Microsoft.ImportExport

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | jobs | Yes | Yes |

## microsoft.insights

> [!IMPORTANT]
> Make sure moving to new subscription doesn't exceed [subscription quotas](azure-subscription-service-limits.md#azure-monitor-limits).

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | actiongroups | Yes | Yes |
> | activitylogalerts | No | No |
> | alertrules | Yes | Yes |
> | autoscalesettings | Yes | Yes |
> | baseline | No | No |
> | components | Yes | Yes |
> | datacollectionrules | No | No |
> | diagnosticsettings | No | No |
> | diagnosticsettingscategories | No | No |
> | eventcategories | No | No |
> | eventtypes | No | No |
> | extendeddiagnosticsettings | No | No |
> | guestdiagnosticsettings | No | No |
> | listmigrationdate | No | No |
> | logdefinitions | No | No |
> | logprofiles | No | No |
> | logs | No | No |
> | metricalerts | No | No |
> | metricbaselines | No | No |
> | metricbatch | No | No |
> | metricdefinitions | No | No |
> | metricnamespaces | No | No |
> | metrics | No | No |
> | migratealertrules | No | No |
> | migratetonewpricingmodel | No | No |
> | myworkbooks | No | No |
> | notificationgroups | No | No |
> | privatelinkscopes | No | No |
> | rollbacktolegacypricingmodel | No | No |
> | scheduledqueryrules | Yes | Yes |
> | topology | No | No |
> | transactions | No | No |
> | vminsightsonboardingstatuses | No | No |
> | webtests | Yes | Yes |
> | webtests / gettestresultfile | No | No |
> | workbooks | Yes | Yes |
> | workbooktemplates | Yes | Yes |

## Microsoft.IoTCentral

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | apptemplates | No | No |
> | iotapps | Yes | Yes |

## Microsoft.IoTSpaces

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | graph | Yes | Yes |

## Microsoft.KeyVault

> [!IMPORTANT]
> Key Vaults used for disk encryption can't be moved to a resource group in the same subscription or across subscriptions.

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | deletedvaults | No | No |
> | hsmpools | No | No |
> | managedhsms | No | No |
> | vaults | Yes | Yes |

## Microsoft.Kubernetes

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | connectedclusters | Yes | Yes |
> | registeredsubscriptions | No | No |

## Microsoft.KubernetesConfiguration

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | sourcecontrolconfigurations | No | No |

## Microsoft.Kusto

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | clusters | Yes | Yes |

## Microsoft.LabServices

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | labaccounts | No | No |
> | users | No | No |

## Microsoft.LocationBasedServices

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | accounts | No | No |

## Microsoft.LocationServices

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | accounts | No | No |

## Microsoft.Logic

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | hostingenvironments | No | No |
> | integrationaccounts | Yes | Yes |
> | integrationserviceenvironments | Yes | No |
> | integrationserviceenvironments / managedapis | Yes | No |
> | isolatedenvironments | No | No |
> | workflows | Yes | Yes |

## Microsoft.MachineLearning

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | commitmentplans | No | No |
> | webservices | Yes | No |
> | workspaces | Yes | Yes |

## Microsoft.MachineLearningCompute

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | operationalizationclusters | No | No |

## Microsoft.MachineLearningExperimentation

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | accounts | No | No |
> | teamaccounts | No | No |

## Microsoft.MachineLearningModelManagement

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | accounts | No | No |

## Microsoft.MachineLearningServices

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | workspaces | No | No |

## Microsoft.Maintenance

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | configurationassignments | No | No |
> | maintenanceconfigurations | Yes | Yes |
> | updates | No | No |

## Microsoft.ManagedIdentity

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | identities | No | No |
> | userassignedidentities | No | No |

## Microsoft.ManagedNetwork

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | managednetworks | No | No |
> | managednetworks / managednetworkgroups | No | No |
> | managednetworks / managednetworkpeeringpolicies | No | No |
> | notification | No | No |

## Microsoft.ManagedServices

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | marketplaceregistrationdefinitions | No | No |
> | registrationassignments | No | No |
> | registrationdefinitions | No | No |

## Microsoft.Management

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | getentities | No | No |
> | managementgroups | No | No |
> | managementgroups / settings | No | No |
> | resources | No | No |
> | starttenantbackfill | No | No |
> | tenantbackfillstatus | No | No |

## Microsoft.Maps

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | accounts | Yes | Yes |
> | accounts / privateatlases | Yes | Yes |

## Microsoft.Marketplace

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | offers | No | No |
> | offertypes | No | No |
> | privategalleryitems | No | No |
> | privatestoreclient | No | No |
> | privatestores | No | No |
> | products | No | No |
> | publishers | No | No |
> | register | No | No |

## Microsoft.MarketplaceApps

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | classicdevservices | No | No |

## Microsoft.MarketplaceOrdering

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | agreements | No | No |
> | offertypes | No | No |

## Microsoft.Media

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | mediaservices | Yes | Yes |
> | mediaservices / liveevents | Yes | Yes |
> | mediaservices / streamingendpoints | Yes | Yes |

## Microsoft.Microservices4Spring

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | appclusters | No | No |

## Microsoft.Migrate

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | assessmentprojects | No | No |
> | migrateprojects | No | No |
> | movecollections | No | No |
> | projects | No | No |

## Microsoft.MixedReality

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | holographicsbroadcastaccounts | No | No |
> | objectunderstandingaccounts | No | No |
> | remoterenderingaccounts | Yes | Yes |
> | spatialanchorsaccounts | Yes | Yes |

## Microsoft.NetApp

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | netappaccounts | No | No |
> | netappaccounts / capacitypools | No | No |
> | netappaccounts / capacitypools / volumes | No | No |

## Microsoft.Network

> [!IMPORTANT]
> See [Networking move guidance](./move-limitations/networking-move-limitations.md).

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | applicationgateways | No | No |
> | applicationgatewaywebapplicationfirewallpolicies | No | No |
> | applicationsecuritygroups | Yes | Yes |
> | azurefirewalls | No | No |
> | bastionhosts | No | No |
> | bgpservicecommunities | No | No |
> | connections | Yes | Yes |
> | ddoscustompolicies | Yes | Yes |
> | ddosprotectionplans | No | No |
> | dnszones | Yes | Yes |
> | expressroutecircuits | No | No |
> | expressroutegateways | No | No |
> | expressrouteserviceproviders | No | No |
> | firewallpolicies | Yes | Yes |
> | frontdoors | No | No |
> | ipallocations | Yes | Yes |
> | ipgroups | Yes | Yes |
> | loadbalancers | Yes - Basic SKU<br> Yes - Standard SKU | Yes - Basic SKU<br>No - Standard SKU |
> | localnetworkgateways | Yes | Yes |
> | natgateways | No | No |
> | networkexperimentprofiles | No | No |
> | networkintentpolicies | Yes | Yes |
> | networkinterfaces | Yes | Yes |
> | networkprofiles | No | No |
> | networksecuritygroups | Yes | Yes |
> | networkwatchers | Yes | No |
> | networkwatchers / connectionmonitors | Yes | No |
> | networkwatchers / flowlogs | Yes | No |
> | networkwatchers / pingmeshes | Yes | No |
> | p2svpngateways | No | No |
> | privatednszones | Yes | Yes |
> | privatednszones / virtualnetworklinks | Yes | Yes |
> | privatednszonesinternal | No | No |
> | privateendpointredirectmaps | No | No |
> | privateendpoints | Yes | Yes |
> | privatelinkservices | No | No |
> | publicipaddresses | Yes - Basic SKU<br>Yes - Standard SKU | Yes - Basic SKU<br>No - Standard SKU |
> | publicipprefixes | Yes | Yes |
> | routefilters | No | No |
> | routetables | Yes | Yes |
> | securitypartnerproviders | Yes | Yes |
> | serviceendpointpolicies | Yes | Yes |
> | trafficmanagergeographichierarchies | No | No |
> | trafficmanagerprofiles | Yes | Yes |
> | trafficmanagerprofiles / heatmaps | No | No |
> | trafficmanagerusermetricskeys | No | No |
> | virtualhubs | No | No |
> | virtualnetworkgateways | Yes | Yes |
> | virtualnetworks | Yes | Yes |
> | virtualnetworktaps | No | No |
> | virtualrouters | Yes | Yes |
> | virtualwans | No | No |
> | vpngateways (Virtual WAN) | No | No |
> | vpnserverconfigurations | No | No |
> | vpnsites (Virtual WAN) | No | No |

## Microsoft.NotificationHubs

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | namespaces | Yes | Yes |
> | namespaces / notificationhubs | Yes | Yes |

## Microsoft.ObjectStore

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | osnamespaces | Yes | Yes |

## Microsoft.OffAzure

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | hypervsites | No | No |
> | importsites | No | No |
> | serversites | No | No |
> | vmwaresites | No | No |

## Microsoft.OperationalInsights

> [!IMPORTANT]
> Make sure that moving to a new subscription doesn't exceed [subscription quotas](azure-subscription-service-limits.md#azure-monitor-limits).
>
> Workspaces that have a linked automation account can't be moved. Before you begin a move operation, be sure to unlink any automation accounts.

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | clusters | No | No |
> | deletedworkspaces | No | No |
> | linktargets | No | No |
> | storageinsightconfigs | No | No |
> | workspaces | Yes | Yes |

## Microsoft.OperationsManagement

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | managementassociations | No | No |
> | managementconfigurations | Yes | Yes |
> | solutions | Yes | Yes |
> | views | Yes | Yes |

## Microsoft.Peering

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | legacypeerings | No | No |
> | peerasns | No | No |
> | peeringlocations | No | No |
> | peerings | No | No |
> | peeringservicecountries | No | No |
> | peeringservicelocations | No | No |
> | peeringserviceproviders | No | No |
> | peeringservices | No | No |

## Microsoft.PolicyInsights

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | policyevents | No | No |
> | policystates | No | No |
> | policytrackedresources | No | No |
> | remediations | No | No |

## Microsoft.Portal

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | consoles | No | No |
> | dashboards | Yes | Yes |
> | usersettings | No | No |

## Microsoft.PowerBI

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | workspacecollections | Yes | Yes |

## Microsoft.PowerBIDedicated

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | capacities | Yes | Yes |

## Microsoft.ProjectBabylon

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | accounts | No | No |

## Microsoft.ProviderHub

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | availableaccounts | No | No |
> | providerregistrations | No | No |
> | rollouts | No | No |

## Microsoft.Quantum

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | workspaces | No | No |

## Microsoft.RecoveryServices

> [!IMPORTANT]
> See [Recovery Services move guidance](../../backup/backup-azure-move-recovery-services-vault.md?toc=/azure/azure-resource-manager/toc.json).

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | replicationeligibilityresults | No | No |
> | vaults | Yes | Yes |

## Microsoft.RedHatOpenShift

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | openshiftclusters | No | No |

## Microsoft.Relay

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | namespaces | Yes | Yes |

## Microsoft.ResourceGraph

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | queries | Yes | Yes |
> | resourcechangedetails | No | No |
> | resourcechanges | No | No |
> | resources | No | No |
> | resourceshistory | No | No |
> | subscriptionsstatus | No | No |

## Microsoft.ResourceHealth

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | childresources | No | No |
> | emergingissues | No | No |
> | events | No | No |
> | metadata | No | No |
> | notifications | No | No |

## Microsoft.Resources

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | deployments | No | No |
> | deploymentscripts | No | No |
> | deploymentscripts / logs | No | No |
> | links | No | No |
> | providers | No | No |
> | resourcegroups | No | No |
> | resources | No | No |
> | subscriptions | No | No |
> | tags | No | No |
> | templatespecs | No | No |
> | templatespecs / versions | No | No |
> | tenants | No | No |

## Microsoft.SaaS

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | applications | Yes | No |
> | saasresources | No | No |

## Microsoft.Search

> [!IMPORTANT]
> You can't move several Search resources in different regions in one operation. Instead, move them in separate operations.

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | resourcehealthmetadata | No | No |
> | searchservices | Yes | Yes |

## Microsoft.Security

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | adaptivenetworkhardenings | No | No |
> | advancedthreatprotectionsettings | No | No |
> | alerts | No | No |
> | allowedconnections | No | No |
> | applicationwhitelistings | No | No |
> | assessmentmetadata | No | No |
> | assessments | No | No |
> | autodismissalertsrules | No | No |
> | automations | Yes | Yes |
> | autoprovisioningsettings | No | No |
> | complianceresults | No | No |
> | compliances | No | No |
> | datacollectionagents | No | No |
> | devicesecuritygroups | No | No |
> | discoveredsecuritysolutions | No | No |
> | externalsecuritysolutions | No | No |
> | informationprotectionpolicies | No | No |
> | iotsecuritysolutions | Yes | Yes |
> | iotsecuritysolutions / analyticsmodels | No | No |
> | iotsecuritysolutions / analyticsmodels / aggregatedalerts | No | No |
> | iotsecuritysolutions / analyticsmodels / aggregatedrecommendations | No | No |
> | jitnetworkaccesspolicies | No | No |
> | policies | No | No |
> | pricings | No | No |
> | regulatorycompliancestandards | No | No |
> | regulatorycompliancestandards / regulatorycompliancecontrols | No | No |
> | regulatorycompliancestandards / regulatorycompliancecontrols / regulatorycomplianceassessments | No | No |
> | securitycontacts | No | No |
> | securitysolutions | No | No |
> | securitysolutionsreferencedata | No | No |
> | securitystatuses | No | No |
> | securitystatusessummaries | No | No |
> | servervulnerabilityassessments | No | No |
> | settings | No | No |
> | subassessments | No | No |
> | tasks | No | No |
> | topologies | No | No |
> | workspacesettings | No | No |

## Microsoft.SecurityInsights

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | aggregations | No | No |
> | alertrules | No | No |
> | alertruletemplates | No | No |
> | automationrules | No | No |
> | bookmarks | No | No |
> | cases | No | No |
> | dataconnectors | No | No |
> | entities | No | No |
> | entityqueries | No | No |
> | incidents | No | No |
> | officeconsents | No | No |
> | settings | No | No |
> | threatintelligence | No | No |

## Microsoft.SerialConsole

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | consoleservices | No | No |

## Microsoft.ServerManagement

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | gateways | No | No |
> | nodes | No | No |

## Microsoft.ServiceBus

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | namespaces | Yes | Yes |
> | premiummessagingregions | No | No |
> | sku | No | No |

## Microsoft.ServiceFabric

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | applications | No | No |
> | clusters | Yes | Yes |
> | containergroups | No | No |
> | containergroupsets | No | No |
> | edgeclusters | No | No |
> | managedclusters | No | No |
> | networks | No | No |
> | secretstores | No | No |
> | volumes | No | No |

## Microsoft.ServiceFabricMesh

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | applications | Yes | Yes |
> | containergroups | No | No |
> | gateways | Yes | Yes |
> | networks | Yes | Yes |
> | secrets | Yes | Yes |
> | volumes | Yes | Yes |

## Microsoft.Services

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | rollouts | No | No |

## Microsoft.SignalRService

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | signalr | Yes | Yes |

## Microsoft.SoftwarePlan

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | hybridusebenefits | No | No |

## Microsoft.Solutions

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | applicationdefinitions | No | No |
> | applications | No | No |
> | jitrequests | No | No |

## Microsoft.Sql

> [!IMPORTANT]
> A database and server must be in the same resource group. When you move a SQL server, all its databases are also moved. This behavior applies to Azure SQL Database and Azure Synapse Analytics databases.

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | instancepools | No | No |
> | locations | Yes | Yes |
> | managedinstances | No | No |
> | servers | Yes | Yes |
> | servers / databases | Yes | Yes |
> | servers / databases / backuplongtermretentionpolicies | Yes | Yes |
> | servers / elasticpools | Yes | Yes |
> | servers / jobaccounts | Yes | Yes |
> | servers / jobagents | Yes | Yes |
> | virtualclusters | Yes | Yes |

## Microsoft.SqlVirtualMachine

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | sqlvirtualmachinegroups | Yes | Yes |
> | sqlvirtualmachines | Yes | Yes |

## Microsoft.Storage

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | storageaccounts | Yes | Yes |

## Microsoft.StorageCache

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | caches | No | No |

## Microsoft.StorageSync

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | storagesyncservices | Yes | Yes |

## Microsoft.StorageSyncDev

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | storagesyncservices | No | No |

## Microsoft.StorageSyncInt

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | storagesyncservices | No | No |

## Microsoft.StorSimple

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | managers | No | No |

## Microsoft.StreamAnalytics

> [!IMPORTANT]
> Stream Analytics jobs can't be moved when in running state.

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | clusters | No | No |
> | streamingjobs | Yes | Yes |

## Microsoft.StreamAnalyticsExplorer

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | environments | No | No |
> | instances | No | No |

## Microsoft.Subscription

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | subscriptions | No | No |

## microsoft.support

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | services | No | No |
> | supporttickets | No | No |

## Microsoft.Synapse

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | workspaces | Yes | Yes |
> | workspaces / bigdatapools | Yes | Yes |
> | workspaces / sqlpools | Yes | Yes |

## Microsoft.TimeSeriesInsights

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | environments | Yes | Yes |
> | environments / eventsources | Yes | Yes |
> | environments / referencedatasets | Yes | Yes |

## Microsoft.Token

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | stores | Yes | Yes |

## Microsoft.VirtualMachineImages

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | imagetemplates | No | No |

## microsoft.visualstudio

> [!IMPORTANT]
> To change the subscription for Azure DevOps, see [change the Azure subscription used for billing](/azure/devops/organizations/billing/change-azure-subscription?toc=/azure/azure-resource-manager/toc.json).

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | account | No | No |
> | account / extension | No | No |
> | account / project | No | No |

## Microsoft.VMware

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | arczones | No | No |
> | resourcepools | No | No |
> | vcenters | No | No |
> | virtualmachines | No | No |
> | virtualmachinetemplates | No | No |
> | virtualnetworks | No | No |

## Microsoft.VMwareCloudSimple

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | dedicatedcloudnodes | No | No |
> | dedicatedcloudservices | No | No |
> | virtualmachines | No | No |

## Microsoft.VnfManager

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | devices | No | No |
> | vnfs | No | No |

## Microsoft.VSOnline

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | accounts | No | No |
> | plans | No | No |
> | registeredsubscriptions | No | No |

## Microsoft.Web

> [!IMPORTANT]
> See [App Service move guidance](./move-limitations/app-service-move-limitations.md).

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | availablestacks | No | No |
> | billingmeters | No | No |
> | certificates | No | Yes |
> | connectiongateways | Yes | Yes |
> | connections | Yes | Yes |
> | customapis | Yes | Yes |
> | deletedsites | No | No |
> | deploymentlocations | No | No |
> | georegions | No | No |
> | hostingenvironments | No | No |
> | kubeenvironments | Yes | Yes |
> | publishingusers | No | No |
> | recommendations | No | No |
> | resourcehealthmetadata | No | No |
> | runtimes | No | No |
> | serverfarms | Yes | Yes |
> | serverfarms / eventgridfilters | No | No |
> | sites | Yes | Yes |
> | sites / premieraddons | Yes | Yes |
> | sites / slots | Yes | Yes |
> | sourcecontrols | No | No |
> | staticsites | No | No |

## Microsoft.WindowsESU

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | multipleactivationkeys | No | No |

## Microsoft.WindowsIoT

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | deviceservices | No | No |

## Microsoft.WorkloadBuilder

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | workloads | No | No |

## Microsoft.WorkloadMonitor

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | components | No | No |
> | componentssummary | No | No |
> | monitorinstances | No | No |
> | monitorinstancessummary | No | No |
> | monitors | No | No |

## Third-party services

Third-party services currently don't support the move operation.

## Next steps

For commands to move resources, see [Move resources to new resource group or subscription](move-resource-group-and-subscription.md).

To get the same data as a file of comma-separated values, download [move-support-resources.csv](https://github.com/tfitzmac/resource-capabilities/blob/master/move-support-resources.csv).

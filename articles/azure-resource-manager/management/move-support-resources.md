---
title: Move operation support by resource type
description: Lists the Azure resource types that can be moved to a new resource group or subscription.
ms.topic: conceptual
ms.date: 01/17/2020
---

# Move operation support for resources
This article lists whether an Azure resource type supports the move operation. It also provides information about special conditions to consider when moving a resource.

Jump to a resource provider namespace:
> [!div class="op_single_selector"]
> - [Microsoft.AAD](#microsoftaad)
> - [microsoft.aadiam](#microsoftaadiam)
> - [Microsoft.Advisor](#microsoftadvisor)
> - [Microsoft.AlertsManagement](#microsoftalertsmanagement)
> - [Microsoft.AnalysisServices](#microsoftanalysisservices)
> - [Microsoft.ApiManagement](#microsoftapimanagement)
> - [Microsoft.AppConfiguration](#microsoftappconfiguration)
> - [Microsoft.AppPlatform](#microsoftappplatform)
> - [Microsoft.AppService](#microsoftappservice)
> - [Microsoft.Authorization](#microsoftauthorization)
> - [Microsoft.Automation](#microsoftautomation)
> - [Microsoft.AzureActiveDirectory](#microsoftazureactivedirectory)
> - [Microsoft.AzureData](#microsoftazuredata)
> - [Microsoft.AzureStack](#microsoftazurestack)
> - [Microsoft.Batch](#microsoftbatch)
> - [Microsoft.BatchAI](#microsoftbatchai)
> - [Microsoft.Billing](#microsoftbilling)
> - [Microsoft.BingMaps](#microsoftbingmaps)
> - [Microsoft.BizTalkServices](#microsoftbiztalkservices)
> - [Microsoft.Blockchain](#microsoftblockchain)
> - [Microsoft.Blueprint](#microsoftblueprint)
> - [Microsoft.BotService](#microsoftbotservice)
> - [Microsoft.Cache](#microsoftcache)
> - [Microsoft.Cdn](#microsoftcdn)
> - [Microsoft.CertificateRegistration](#microsoftcertificateregistration)
> - [Microsoft.ClassicCompute](#microsoftclassiccompute)
> - [Microsoft.ClassicNetwork](#microsoftclassicnetwork)
> - [Microsoft.ClassicStorage](#microsoftclassicstorage)
> - [Microsoft.CognitiveServices](#microsoftcognitiveservices)
> - [Microsoft.Compute](#microsoftcompute)
> - [Microsoft.Consumption](#microsoftconsumption)
> - [Microsoft.Container](#microsoftcontainer)
> - [Microsoft.ContainerInstance](#microsoftcontainerinstance)
> - [Microsoft.ContainerRegistry](#microsoftcontainerregistry)
> - [Microsoft.ContainerService](#microsoftcontainerservice)
> - [Microsoft.ContentModerator](#microsoftcontentmoderator)
> - [Microsoft.CortanaAnalytics](#microsoftcortanaanalytics)
> - [Microsoft.CostManagement](#microsoftcostmanagement)
> - [Microsoft.CustomerInsights](#microsoftcustomerinsights)
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
> - [Microsoft.Devices](#microsoftdevices)
> - [Microsoft.DevOps](#microsoftdevops)
> - [Microsoft.DevSpaces](#microsoftdevspaces)
> - [Microsoft.DevTestLab](#microsoftdevtestlab)
> - [Microsoft.DocumentDB](#microsoftdocumentdb)
> - [Microsoft.DomainRegistration](#microsoftdomainregistration)
> - [Microsoft.EnterpriseKnowledgeGraph](#microsoftenterpriseknowledgegraph)
> - [Microsoft.EventGrid](#microsofteventgrid)
> - [Microsoft.EventHub](#microsofteventhub)
> - [Microsoft.Genomics](#microsoftgenomics)
> - [Microsoft.GuestConfiguration](#microsoftguestconfiguration)
> - [Microsoft.HanaOnAzure](#microsofthanaonazure)
> - [Microsoft.HDInsight](#microsofthdinsight)
> - [Microsoft.HealthcareApis](#microsofthealthcareapis)
> - [Microsoft.HybridCompute](#microsofthybridcompute)
> - [Microsoft.HybridData](#microsofthybriddata)
> - [Microsoft.ImportExport](#microsoftimportexport)
> - [microsoft.insights](#microsoftinsights)
> - [Microsoft.IoTCentral](#microsoftiotcentral)
> - [Microsoft.IoTSpaces](#microsoftiotspaces)
> - [Microsoft.KeyVault](#microsoftkeyvault)
> - [Microsoft.Kubernetes](#microsoftkubernetes)
> - [Microsoft.Kusto](#microsoftkusto)
> - [Microsoft.LabServices](#microsoftlabservices)
> - [Microsoft.LocationBasedServices](#microsoftlocationbasedservices)
> - [Microsoft.LocationServices](#microsoftlocationservices)
> - [Microsoft.Logic](#microsoftlogic)
> - [Microsoft.MachineLearning](#microsoftmachinelearning)
> - [Microsoft.MachineLearningCompute](#microsoftmachinelearningcompute)
> - [Microsoft.MachineLearningExperimentation](#microsoftmachinelearningexperimentation)
> - [Microsoft.MachineLearningModelManagement](#microsoftmachinelearningmodelmanagement)
> - [Microsoft.MachineLearningOperationalization](#microsoftmachinelearningoperationalization)
> - [Microsoft.MachineLearningServices](#microsoftmachinelearningservices)
> - [Microsoft.ManagedIdentity](#microsoftmanagedidentity)
> - [Microsoft.ManagedServices](#microsoftmanagedservices)
> - [Microsoft.Maps](#microsoftmaps)
> - [Microsoft.MarketplaceApps](#microsoftmarketplaceapps)
> - [Microsoft.Media](#microsoftmedia)
> - [Microsoft.Microservices4Spring](#microsoftmicroservices4spring)
> - [Microsoft.Migrate](#microsoftmigrate)
> - [Microsoft.NetApp](#microsoftnetapp)
> - [Microsoft.Network](#microsoftnetwork)
> - [Microsoft.NotificationHubs](#microsoftnotificationhubs)
> - [Microsoft.ObjectStore](#microsoftobjectstore)
> - [Microsoft.OperationalInsights](#microsoftoperationalinsights)
> - [Microsoft.OperationsManagement](#microsoftoperationsmanagement)
> - [Microsoft.Peering](#microsoftpeering)
> - [Microsoft.PolicyInsights](#microsoftpolicyinsights)
> - [Microsoft.Portal](#microsoftportal)
> - [Microsoft.PortalSdk](#microsoftportalsdk)
> - [Microsoft.PowerBI](#microsoftpowerbi)
> - [Microsoft.PowerBIDedicated](#microsoftpowerbidedicated)
> - [Microsoft.ProjectBabylon](#microsoftprojectbabylon)
> - [Microsoft.ProjectOxford](#microsoftprojectoxford)
> - [Microsoft.ProviderHub](#microsoftproviderhub)
> - [Microsoft.RecoveryServices](#microsoftrecoveryservices)
> - [Microsoft.Relay](#microsoftrelay)
> - [Microsoft.ResourceGraph](#microsoftresourcegraph)
> - [Microsoft.ResourceHealth](#microsoftresourcehealth)
> - [Microsoft.Resources](#microsoftresources)
> - [Microsoft.SaaS](#microsoftsaas)
> - [Microsoft.Scheduler](#microsoftscheduler)
> - [Microsoft.Search](#microsoftsearch)
> - [Microsoft.Security](#microsoftsecurity)
> - [Microsoft.SecurityInsights](#microsoftsecurityinsights)
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
> - [Microsoft.SqlVM](#microsoftsqlvm)
> - [Microsoft.Storage](#microsoftstorage)
> - [Microsoft.StorageSync](#microsoftstoragesync)
> - [Microsoft.StorageSyncDev](#microsoftstoragesyncdev)
> - [Microsoft.StorageSyncInt](#microsoftstoragesyncint)
> - [Microsoft.StorSimple](#microsoftstorsimple)
> - [Microsoft.StreamAnalytics](#microsoftstreamanalytics)
> - [Microsoft.StreamAnalyticsExplorer](#microsoftstreamanalyticsexplorer)
> - [Microsoft.Subscription](#microsoftsubscription)
> - [microsoft.support](#microsoftsupport)
> - [Microsoft.TerraformOSS](#microsoftterraformoss)
> - [Microsoft.TimeSeriesInsights](#microsofttimeseriesinsights)
> - [Microsoft.Token](#microsofttoken)
> - [Microsoft.VMwareCloudSimple](#microsoftvmwarecloudsimple)
> - [Microsoft.VSOnline](#microsoftvsonline)
> - [Microsoft.Web](#microsoftweb)
> - [Microsoft.WindowsIoT](#microsoftwindowsiot)
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
> | tenants | No | No |

## Microsoft.Advisor

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | configurations | No | No |
> | recommendations | No | No |
> | suppressions | No | No |

## Microsoft.AlertsManagement

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | actionrules | Yes | Yes |
> | alerts | No | No |
> | alertssummary | No | No |
> | smartdetectoralertrules | Yes | Yes |

## Microsoft.AnalysisServices

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | servers | Yes | Yes |

## Microsoft.ApiManagement

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | service | Yes | Yes |

## Microsoft.AppConfiguration

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | configurationstores | Yes | Yes |

## Microsoft.AppPlatform

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | spring | Yes | Yes |

## Microsoft.AppService

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | apiapps | No | No |
> | appidentities | No | No |
> | gateways | No | No |

> [!IMPORTANT]
> See [App Service move guidance](./move-limitations/app-service-move-limitations.md).

## Microsoft.Authorization

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | checkaccess | No | No |
> | denyassignments | No | No |
> | findorphanroleassignments | No | No |
> | locks | No | No |
> | permissions | No | No |
> | policyassignments | No | No |
> | policydefinitions | No | No |
> | policysetdefinitions | No | No |
> | roleassignments | No | No |
> | roleassignmentsusagemetrics | No | No |
> | roledefinitions | No | No |

## Microsoft.Automation

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | automationaccounts | Yes | Yes |
> | automationaccounts / configurations | Yes | Yes |
> | automationaccounts / runbooks | Yes | Yes |

> [!IMPORTANT]
> Runbooks must exist in the same resource group as the Automation Account.

## Microsoft.AzureActiveDirectory

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | b2cdirectories | Yes | Yes |

## Microsoft.AzureData

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | hybriddatamanagers | No | No |
> | postgresinstances | No | No |
> | sqlbigdataclusters | No | No |
> | sqlinstances | No | No |
> | sqlserverregistrations | Yes | Yes |

## Microsoft.AzureStack

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | registrations | Yes | Yes |

## Microsoft.Batch

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | batchaccounts | Yes | Yes |

## Microsoft.BatchAI

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | clusters | No | No |
> | fileservers | No | No |
> | jobs | No | No |
> | workspaces | No | No |

## Microsoft.Billing

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | billingperiods | No | No |
> | billingpermissions | No | No |
> | billingroleassignments | No | No |
> | billingroledefinitions | No | No |
> | createbillingroleassignment | No | No |

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
> | watchers | No | No |

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

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | redis | Yes | Yes |

> [!IMPORTANT]
> If the Azure Cache for Redis instance is configured with a virtual network, the instance can't be moved to a different subscription. See [Networking move limitations](./move-limitations/networking-move-limitations.md).

## Microsoft.Cdn

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | cdnwebapplicationfirewallpolicies | Yes | Yes |
> | profiles | Yes | Yes |
> | profiles / endpoints | Yes | Yes |

## Microsoft.CertificateRegistration

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | certificateorders | Yes | Yes |

> [!IMPORTANT]
> See [App Service move guidance](./move-limitations/app-service-move-limitations.md).

## Microsoft.ClassicCompute

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | domainnames | Yes | No |
> | virtualmachines | Yes | No |

> [!IMPORTANT]
> See [Classic deployment move guidance](./move-limitations/classic-model-move-limitations.md). Classic deployment resources can be moved across subscriptions with an operation specific to that scenario.

## Microsoft.ClassicNetwork

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | networksecuritygroups | No | No |
> | reservedips | No | No |
> | virtualnetworks | No | No |

> [!IMPORTANT]
> See [Classic deployment move guidance](./move-limitations/classic-model-move-limitations.md). Classic deployment resources can be moved across subscriptions with an operation specific to that scenario.

## Microsoft.ClassicStorage

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | storageaccounts | Yes | No |

> [!IMPORTANT]
> See [Classic deployment move guidance](./move-limitations/classic-model-move-limitations.md). Classic deployment resources can be moved across subscriptions with an operation specific to that scenario.

## Microsoft.CognitiveServices

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | accounts | Yes | Yes |

## Microsoft.Compute

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | availabilitysets | Yes | Yes |
> | diskencryptionsets | No | No |
> | disks | Yes | Yes |
> | galleries | No | No |
> | galleries / images | No | No |
> | galleries / images / versions | No | No |
> | hostgroups | No | No |
> | hostgroups / hosts | No | No |
> | images | Yes | Yes |
> | proximityplacementgroups | No | No |
> | restorepointcollections | No | No |
> | sharedvmimages | No | No |
> | sharedvmimages / versions | No | No |
> | snapshots | Yes | Yes |
> | virtualmachines | Yes | Yes |
> | virtualmachines / extensions | Yes | Yes |
> | virtualmachinescalesets | Yes | Yes |

> [!IMPORTANT]
> See [Virtual Machines move guidance](./move-limitations/virtual-machines-move-limitations.md).

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
> | operationresults | No | No |
> | operationstatus | No | No |
> | pricesheets | No | No |
> | products | No | No |
> | reservationdetails | No | No |
> | reservationrecommendations | No | No |
> | reservationsummaries | No | No |
> | reservationtransactions | No | No |
> | tags | No | No |
> | tenants | No | No |
> | terms | No | No |
> | usagedetails | No | No |

## Microsoft.Container

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | containergroups | No | No |

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
> | registries / buildtasks | Yes | Yes |
> | registries / replications | Yes | Yes |
> | registries / taskruns | Yes | Yes |
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
> | budgets | No | No |
> | connectors | Yes | Yes |
> | dimensions | No | No |
> | exports | No | No |
> | externalsubscriptions | No | No |
> | forecast | No | No |
> | query | No | No |
> | reportconfigs | No | No |
> | reports | No | No |
> | showbackrules | No | No |
> | views | No | No |

## Microsoft.CustomerInsights

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | hubs | No | No |

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
> | databoxedgedevices | No | No |

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
> | servers | Yes | Yes |

## Microsoft.DBforPostgreSQL

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | servergroups | No | No |
> | servers | Yes | Yes |
> | serversv2 | Yes | Yes |

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

## Microsoft.DocumentDB

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | databaseaccounts | Yes | Yes |

## Microsoft.DomainRegistration

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | domains | Yes | Yes |

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
> | eventSubscriptions | No - can't be moved independently but automatically moved with subscribed resource. | No - can't be moved independently but automatically moved with subscribed resource. |
> | eventsubscriptions | No - can't be moved independently but automatically moved with subscribed resource. | No - can't be moved independently but automatically moved with subscribed resource. |
> | extensiontopics | No | No |
> | topics | Yes | Yes |

## Microsoft.EventHub

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | clusters | Yes | Yes |
> | namespaces | Yes | Yes |

## Microsoft.Genomics

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | accounts | No | No |

## Microsoft.GuestConfiguration

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
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

## Microsoft.HDInsight

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | clusters | Yes | Yes |

> [!IMPORTANT]
> You can move HDInsight clusters to a new subscription or resource group. However, you can't move across subscriptions the networking resources linked to the HDInsight cluster (such as the virtual network, NIC, or load balancer). In addition, you can't move to a new resource group a NIC that is attached to a virtual machine for the cluster.
>
> When moving an HDInsight cluster to a new subscription, first move other resources (like the storage account). Then, move the HDInsight cluster by itself.

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
> | machines / extensions | No | No |

## Microsoft.HybridData

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | datamanagers | Yes | Yes |

## Microsoft.ImportExport

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | jobs | Yes | Yes |

## microsoft.insights

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | actiongroups | Yes | Yes |
> | activitylogalerts | No | No |
> | alertrules | Yes | Yes |
> | automatedexportsettings | No | No |
> | autoscalesettings | Yes | Yes |
> | baseline | No | No |
> | calculatebaseline | No | No |
> | components | Yes | Yes |
> | diagnosticsettings | No | No |
> | diagnosticsettingscategories | No | No |
> | eventtypes | No | No |
> | extendeddiagnosticsettings | No | No |
> | logdefinitions | No | No |
> | logs | No | No |
> | metricalerts | No | No |
> | metricbaselines | No | No |
> | metricdefinitions | No | No |
> | metricnamespaces | No | No |
> | metrics | No | No |
> | myworkbooks | No | No |
> | scheduledqueryrules | Yes | Yes |
> | topology | No | No |
> | transactions | No | No |
> | vminsightsonboardingstatuses | No | No |
> | webtests | Yes | Yes |
> | workbooks | Yes | Yes |
> | workbooktemplates | Yes | Yes |

> [!IMPORTANT]
> Make sure moving to new subscription doesn't exceed [subscription quotas](azure-subscription-service-limits.md#azure-monitor-limits).

## Microsoft.IoTCentral

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | iotapps | Yes | Yes |

## Microsoft.IoTSpaces

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | checknameavailability | Yes | Yes |
> | graph | Yes | Yes |

## Microsoft.KeyVault

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | vaults | Yes | Yes |

> [!IMPORTANT]
> Key Vaults used for disk encryption can't be moved to a resource group in the same subscription or across subscriptions.

## Microsoft.Kubernetes

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | connectedclusters | No | No |

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
> | commitmentplans | Yes | Yes |
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
> | accounts / workspaces | No | No |
> | accounts / workspaces / projects | No | No |
> | teamaccounts | No | No |
> | teamaccounts / workspaces | No | No |
> | teamaccounts / workspaces / projects | No | No |

## Microsoft.MachineLearningModelManagement

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | accounts | No | No |

## Microsoft.MachineLearningOperationalization

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | hostingaccounts | No | No |

## Microsoft.MachineLearningServices

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | workspaces | No | No |

## Microsoft.ManagedIdentity

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | identities | No | No |
> | userassignedidentities | No | No |

## Microsoft.ManagedServices

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | registrationassignments | No | No |
> | registrationdefinitions | No | No |

## Microsoft.Maps

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | accounts | Yes | Yes |

## Microsoft.MarketplaceApps

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | classicdevservices | No | No |

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
> | assessmentprojects | Yes | Yes |
> | migrateprojects | Yes | Yes |
> | projects | No | No |

## Microsoft.NetApp

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | netappaccounts | No | No |
> | netappaccounts / backuppolicies | No | No |
> | netappaccounts / capacitypools | No | No |
> | netappaccounts / capacitypools / volumes | No | No |
> | netappaccounts / capacitypools / volumes / mounttargets | No | No |
> | netappaccounts / capacitypools / volumes / snapshots | No | No |

## Microsoft.Network

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | applicationgateways | No | No |
> | applicationgatewaywebapplicationfirewallpolicies | No | No |
> | applicationsecuritygroups | Yes | Yes |
> | azurefirewalls | Yes | Yes |
> | bastionhosts | No | No |
> | connections | Yes | Yes |
> | ddoscustompolicies | Yes | Yes |
> | ddosprotectionplans | No | No |
> | dnszones | Yes | Yes |
> | expressroutecircuits | No | No |
> | expressroutegateways | No | No |
> | frontdoors | No | No |
> | frontdoorwebapplicationfirewallpolicies | No | No |
> | loadbalancers | Yes - Basic SKU<br>No - Standard SKU | Yes - Basic SKU<br>No - Standard SKU |
> | localnetworkgateways | Yes | Yes |
> | networkexperimentprofiles | Yes | Yes |
> | networkintentpolicies | Yes | Yes |
> | networkinterfaces | Yes | Yes |
> | networkprofiles | No | No |
> | networksecuritygroups | Yes | Yes |
> | networkwatchers | Yes | Yes |
> | networkwatchers / connectionmonitors | Yes | Yes |
> | networkwatchers / flowlogs | Yes | Yes |
> | networkwatchers / lenses | Yes | Yes |
> | networkwatchers / pingmeshes | Yes | Yes |
> | p2svpngateways | No | No |
> | privatednszones | Yes | Yes |
> | privatednszones / virtualnetworklinks | Yes | Yes |
> | privateendpointredirectmaps | No | No |
> | privateendpoints | No | No |
> | privatelinkservices | No | No |
> | publicipaddresses | Yes - Basic SKU<br>No - Standard SKU | Yes - Basic SKU<br>No - Standard SKU |
> | publicipprefixes | Yes | Yes |
> | routefilters | No | No |
> | routetables | Yes | Yes |
> | serviceendpointpolicies | Yes | Yes |
> | trafficmanagerprofiles | Yes | Yes |
> | virtualhubs | No | No |
> | virtualnetworkgateways | Yes | Yes |
> | virtualnetworks | Yes | Yes |
> | virtualnetworktaps | No | No |
> | virtualrouters | Yes | Yes |
> | virtualwans | No | No |
> | vpngateways (Virtual WAN) | No | No |
> | vpnserverconfigurations | No | No |
> | vpnsites (Virtual WAN) | No | No |
> | webapplicationfirewallpolicies | Yes | Yes |

> [!IMPORTANT]
> See [Networking move guidance](./move-limitations/networking-move-limitations.md).

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

## Microsoft.OperationalInsights

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | storageinsightconfigs | No | No |
> | workspaces | Yes | Yes |

> [!IMPORTANT]
> Make sure moving to new subscription doesn't exceed [subscription quotas](azure-subscription-service-limits.md#azure-monitor-limits).

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
> | peerings | Yes | Yes |
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
> | dashboards | Yes | Yes |

## Microsoft.PortalSdk

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | rootresources | No | No |

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

## Microsoft.ProjectOxford

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | accounts | No | No |

## Microsoft.ProviderHub

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | rollouts | No | No |

## Microsoft.RecoveryServices

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | backupprotecteditems | No | No |
> | replicationeligibilityresults | No | No |
> | vaults | Yes | Yes |

> [!IMPORTANT]
> See [Recovery Services move guidance](../../backup/backup-azure-move-recovery-services-vault.md?toc=/azure/azure-resource-manager/toc.json).

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

## Microsoft.ResourceHealth

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | availabilitystatuses | No | No |
> | childavailabilitystatuses | No | No |
> | childresources | No | No |
> | events | No | No |
> | notifications | No | No |

## Microsoft.Resources

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | deploymentscripts | No | No |
> | links | No | No |
> | tags | No | No |

## Microsoft.SaaS

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | applications | Yes | No |

## Microsoft.Scheduler

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | jobcollections | Yes | Yes |

## Microsoft.Search

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | searchservices | Yes | Yes |

> [!IMPORTANT]
> You can't move several Search resources in different regions in one operation. Instead, move them in separate operations.

## Microsoft.Security

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | adaptivenetworkhardenings | No | No |
> | advancedthreatprotectionsettings | No | No |
> | assessmentmetadata | No | No |
> | assessments | No | No |
> | automations | Yes | Yes |
> | complianceresults | No | No |
> | compliances | No | No |
> | datacollectionagents | No | No |
> | datacollectionresults | No | No |
> | devicesecuritygroups | No | No |
> | informationprotectionpolicies | No | No |
> | iotsecuritysolutions | Yes | Yes |
> | servervulnerabilityassessments | No | No |

## Microsoft.SecurityInsights

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | aggregations | No | No |
> | alertrules | No | No |
> | alertruletemplates | No | No |
> | bookmarks | No | No |
> | cases | No | No |
> | dataconnectors | No | No |
> | entities | No | No |
> | entityqueries | No | No |
> | officeconsents | No | No |
> | settings | No | No |

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

## Microsoft.ServiceFabric

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | applications | No | No |
> | clusters | Yes | Yes |
> | clusters / applications | No | No |
> | containergroups | No | No |
> | containergroupsets | No | No |
> | edgeclusters | No | No |
> | networks | No | No |
> | secretstores | No | No |
> | volumes | No | No |

## Microsoft.ServiceFabricMesh

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | applications | Yes | Yes |
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

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | instancepools | No | No |
> | managedinstances | No | No |
> | managedinstances / databases | No | No |
> | servers | Yes | Yes |
> | servers / databases | Yes | Yes |
> | servers / elasticpools | Yes | Yes |
> | virtualclusters | Yes | Yes |

> [!IMPORTANT]
> A database and server must be in the same resource group. When you move a SQL server, all its databases are also moved. This behavior applies to Azure SQL Database and Azure SQL Data Warehouse databases.

## Microsoft.SqlVirtualMachine

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | sqlvirtualmachinegroups | Yes | Yes |
> | sqlvirtualmachines | Yes | Yes |

## Microsoft.SqlVM

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | dwvm | No | No |

## Microsoft.Storage

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | storageaccounts | Yes | Yes |

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

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | streamingjobs | Yes | Yes |

> [!IMPORTANT]
> Stream Analytics jobs can't be moved when in running state.

## Microsoft.StreamAnalyticsExplorer

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | environments | No | No |
> | environments / eventsources | No | No |
> | instances | No | No |
> | instances / environments | No | No |
> | instances / environments / eventsources | No | No |

## Microsoft.Subscription

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | createsubscription | No | No |

## microsoft.support

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | createsupportticket | No | No |
> | supporttickets | No | No |

## Microsoft.TerraformOSS

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | providerregistrations | No | No |
> | resources | No | No |

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

## Microsoft.VMwareCloudSimple

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | dedicatedcloudnodes | No | No |
> | dedicatedcloudservices | No | No |
> | virtualmachines | No | No |

## Microsoft.VSOnline

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | accounts | Yes | Yes |
> | plans | Yes | Yes |

## Microsoft.Web

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | certificates | No | Yes |
> | connectiongateways | Yes | Yes |
> | connections | Yes | Yes |
> | customapis | Yes | Yes |
> | hostingenvironments | No | No |
> | serverfarms | Yes | Yes |
> | sites | Yes | Yes |
> | sites / premieraddons | Yes | Yes |
> | sites / slots | Yes | Yes |
> | staticsites | No | No |

> [!IMPORTANT]
> See [App Service move guidance](./move-limitations/app-service-move-limitations.md).

## Microsoft.WindowsIoT

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | deviceservices | No | No |

## Microsoft.WorkloadMonitor

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | components | No | No |
> | monitorinstances | No | No |
> | monitors | No | No |
> | notificationsettings | No | No |

## Third-party services

Third-party services currently don't support the move operation.

## Next steps
For commands to move resources, see [Move resources to new resource group or subscription](move-resource-group-and-subscription.md).

To get the same data as a file of comma-separated values, download [move-support-resources.csv](https://github.com/tfitzmac/resource-capabilities/blob/master/move-support-resources.csv).

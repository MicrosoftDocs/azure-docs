---
title: Move operation support by Azure resource type
description: Lists the Azure resource types that can be moved to a new resource group or subscription.
author: tfitzmac
ms.service: azure-resource-manager
ms.topic: reference
ms.date: 7/9/2019
ms.author: tomfitz
---

# Move operation support for resources
This article lists whether an Azure resource type supports the move operation. It also provides information about special conditions to consider when moving a resource.

Jump to a resource provider namespace:
> [!div class="op_single_selector"]
> - [Microsoft.AAD](#microsoftaad)
> - [microsoft.aadiam](#microsoftaadiam)
> - [Microsoft.AlertsManagement](#microsoftalertsmanagement)
> - [Microsoft.AnalysisServices](#microsoftanalysisservices)
> - [Microsoft.ApiManagement](#microsoftapimanagement)
> - [Microsoft.AppConfiguration](#microsoftappconfiguration)
> - [Microsoft.AppService](#microsoftappservice)
> - [Microsoft.Authorization](#microsoftauthorization)
> - [Microsoft.Automation](#microsoftautomation)
> - [Microsoft.AzureActiveDirectory](#microsoftazureactivedirectory)
> - [Microsoft.AzureStack](#microsoftazurestack)
> - [Microsoft.Backup](#microsoftbackup)
> - [Microsoft.Batch](#microsoftbatch)
> - [Microsoft.BatchAI](#microsoftbatchai)
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
> - [Microsoft.Container](#microsoftcontainer)
> - [Microsoft.ContainerInstance](#microsoftcontainerinstance)
> - [Microsoft.ContainerRegistry](#microsoftcontainerregistry)
> - [Microsoft.ContainerService](#microsoftcontainerservice)
> - [Microsoft.ContentModerator](#microsoftcontentmoderator)
> - [Microsoft.CortanaAnalytics](#microsoftcortanaanalytics)
> - [Microsoft.CostManagement](#microsoftcostmanagement)
> - [Microsoft.CustomerInsights](#microsoftcustomerinsights)
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
> - [Microsoft.DBforMariaDB](#microsoftdbformariadb)
> - [Microsoft.DBforMySQL](#microsoftdbformysql)
> - [Microsoft.DBforPostgreSQL](#microsoftdbforpostgresql)
> - [Microsoft.DeploymentManager](#microsoftdeploymentmanager)
> - [Microsoft.Devices](#microsoftdevices)
> - [Microsoft.DevSpaces](#microsoftdevspaces)
> - [Microsoft.DevTestLab](#microsoftdevtestlab)
> - [microsoft.dns](#microsoftdns)
> - [Microsoft.DocumentDB](#microsoftdocumentdb)
> - [Microsoft.DomainRegistration](#microsoftdomainregistration)
> - [Microsoft.EnterpriseKnowledgeGraph](#microsoftenterpriseknowledgegraph)
> - [Microsoft.EventGrid](#microsofteventgrid)
> - [Microsoft.EventHub](#microsofteventhub)
> - [Microsoft.Genomics](#microsoftgenomics)
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
> - [Microsoft.Maps](#microsoftmaps)
> - [Microsoft.MarketplaceApps](#microsoftmarketplaceapps)
> - [Microsoft.Media](#microsoftmedia)
> - [Microsoft.Migrate](#microsoftmigrate)
> - [Microsoft.NetApp](#microsoftnetapp)
> - [Microsoft.Network](#microsoftnetwork)
> - [Microsoft.NotificationHubs](#microsoftnotificationhubs)
> - [Microsoft.OperationalInsights](#microsoftoperationalinsights)
> - [Microsoft.OperationsManagement](#microsoftoperationsmanagement)
> - [Microsoft.Peering](#microsoftpeering)
> - [Microsoft.Portal](#microsoftportal)
> - [Microsoft.PortalSdk](#microsoftportalsdk)
> - [Microsoft.PowerBI](#microsoftpowerbi)
> - [Microsoft.PowerBIDedicated](#microsoftpowerbidedicated)
> - [Microsoft.ProjectOxford](#microsoftprojectoxford)
> - [Microsoft.RecoveryServices](#microsoftrecoveryservices)
> - [Microsoft.Relay](#microsoftrelay)
> - [Microsoft.SaaS](#microsoftsaas)
> - [Microsoft.Scheduler](#microsoftscheduler)
> - [Microsoft.Search](#microsoftsearch)
> - [Microsoft.Security](#microsoftsecurity)
> - [Microsoft.ServerManagement](#microsoftservermanagement)
> - [Microsoft.ServiceBus](#microsoftservicebus)
> - [Microsoft.ServiceFabric](#microsoftservicefabric)
> - [Microsoft.ServiceFabricMesh](#microsoftservicefabricmesh)
> - [Microsoft.SignalRService](#microsoftsignalrservice)
> - [Microsoft.SiteRecovery](#microsoftsiterecovery)
> - [Microsoft.Solutions](#microsoftsolutions)
> - [Microsoft.Sql](#microsoftsql)
> - [Microsoft.SqlVirtualMachine](#microsoftsqlvirtualmachine)
> - [Microsoft.SqlVM](#microsoftsqlvm)
> - [Microsoft.Storage](#microsoftstorage)
> - [Microsoft.StorageCache](#microsoftstoragecache)
> - [Microsoft.StorageSync](#microsoftstoragesync)
> - [Microsoft.StorageSyncDev](#microsoftstoragesyncdev)
> - [Microsoft.StorageSyncInt](#microsoftstoragesyncint)
> - [Microsoft.StorSimple](#microsoftstorsimple)
> - [Microsoft.StreamAnalytics](#microsoftstreamanalytics)
> - [Microsoft.StreamAnalyticsExplorer](#microsoftstreamanalyticsexplorer)
> - [Microsoft.TerraformOSS](#microsoftterraformoss)
> - [Microsoft.TimeSeriesInsights](#microsofttimeseriesinsights)
> - [Microsoft.Token](#microsofttoken)
> - [Microsoft.VirtualMachineImages](#microsoftvirtualmachineimages)
> - [microsoft.visualstudio](#microsoftvisualstudio)
> - [Microsoft.VMwareCloudSimple](#microsoftvmwarecloudsimple)
> - [Microsoft.Web](#microsoftweb)
> - [Microsoft.WindowsIoT](#microsoftwindowsiot)
> - [Microsoft.WindowsVirtualDesktop](#microsoftwindowsvirtualdesktop)

## Microsoft.AAD
| Resource type | Resource group | Subscription |
| ------------- | ----------- | ---------- |
| domainservices | No | No |

## microsoft.aadiam
| Resource type | Resource group | Subscription |
| ------------- | ----------- | ---------- |
| tenants | No | No |

## Microsoft.AlertsManagement
| Resource type | Resource group | Subscription |
| ------------- | ----------- | ---------- |
| actionrules | Yes | Yes |

## Microsoft.AnalysisServices
| Resource type | Resource group | Subscription |
| ------------- | ----------- | ---------- |
| servers | Yes | Yes |

## Microsoft.ApiManagement
| Resource type | Resource group | Subscription |
| ------------- | ----------- | ---------- |
| service | Yes | Yes |

## Microsoft.AppConfiguration
| Resource type | Resource group | Subscription |
| ------------- | ----------- | ---------- |
| configurationstores | Yes | Yes |

## Microsoft.AppService
| Resource type | Resource group | Subscription |
| ------------- | ----------- | ---------- |
| apiapps | No | No |
| appidentities | No | No |
| gateways | No | No |

> [!IMPORTANT]
> See [App Service move guidance](./move-limitations/app-service-move-limitations.md).

## Microsoft.Authorization
| Resource type | Resource group | Subscription |
| ------------- | ----------- | ---------- |
| policyassignments | No | No |

## Microsoft.Automation
| Resource type | Resource group | Subscription |
| ------------- | ----------- | ---------- |
| automationaccounts | Yes | Yes |
| automationaccounts/configurations | Yes | Yes |
| automationaccounts/runbooks | Yes | Yes |

> [!IMPORTANT]
> Runbooks must exist in the same resource group as the Automation Account.

## Microsoft.AzureActiveDirectory
| Resource type | Resource group | Subscription |
| ------------- | ----------- | ---------- |
| b2cdirectories | Yes | Yes |

## Microsoft.AzureStack
| Resource type | Resource group | Subscription |
| ------------- | ----------- | ---------- |
| registrations | Yes | Yes |

## Microsoft.Backup
| Resource type | Resource group | Subscription |
| ------------- | ----------- | ---------- |
| backupvault | No | No |

## Microsoft.Batch
| Resource type | Resource group | Subscription |
| ------------- | ----------- | ---------- |
| batchaccounts | Yes | Yes |

## Microsoft.BatchAI
| Resource type | Resource group | Subscription |
| ------------- | ----------- | ---------- |
| clusters | No | No |
| fileservers | No | No |
| jobs | No | No |
| workspaces | No | No |

## Microsoft.BingMaps
| Resource type | Resource group | Subscription |
| ------------- | ----------- | ---------- |
| mapapis | No | No |

## Microsoft.BizTalkServices
| Resource type | Resource group | Subscription |
| ------------- | ----------- | ---------- |
| biztalk | Yes | Yes |

## Microsoft.Blockchain
| Resource type | Resource group | Subscription |
| ------------- | ----------- | ---------- |
| blockchainmembers | Yes | Yes |

## Microsoft.Blueprint
| Resource type | Resource group | Subscription |
| ------------- | ----------- | ---------- |
| blueprintassignments | No | No |

## Microsoft.BotService
| Resource type | Resource group | Subscription |
| ------------- | ----------- | ---------- |
| botservices | Yes | Yes |

## Microsoft.Cache
| Resource type | Resource group | Subscription |
| ------------- | ----------- | ---------- |
| redis | Yes | Yes |

> [!IMPORTANT]
> If the Azure Cache for Redis instance is configured with a virtual network, the instance can't be moved to a different subscription. See [Virtual Networks move limitations](./move-limitations/virtual-network-move-limitations.md).

## Microsoft.Cdn
| Resource type | Resource group | Subscription |
| ------------- | ----------- | ---------- |
| profiles | Yes | Yes |
| profiles/endpoints | Yes | Yes |

## Microsoft.CertificateRegistration
| Resource type | Resource group | Subscription |
| ------------- | ----------- | ---------- |
| certificateorders | Yes | Yes |

> [!IMPORTANT]
> See [App Service move guidance](./move-limitations/app-service-move-limitations.md).

## Microsoft.ClassicCompute
| Resource type | Resource group | Subscription |
| ------------- | ----------- | ---------- |
| domainnames | Yes | No |
| virtualmachines | Yes | No |

> [!IMPORTANT]
> See [Classic deployment move guidance](./move-limitations/classic-model-move-limitations.md). Classic deployment resources can be moved across subscriptions with an operation specific to that scenario.

## Microsoft.ClassicNetwork
| Resource type | Resource group | Subscription |
| ------------- | ----------- | ---------- |
| networksecuritygroups | No | No |
| reservedips | No | No |
| virtualnetworks | No | No |

> [!IMPORTANT]
> See [Classic deployment move guidance](./move-limitations/classic-model-move-limitations.md). Classic deployment resources can be moved across subscriptions with an operation specific to that scenario.

## Microsoft.ClassicStorage
| Resource type | Resource group | Subscription |
| ------------- | ----------- | ---------- |
| storageaccounts | Yes | No |

> [!IMPORTANT]
> See [Classic deployment move guidance](./move-limitations/classic-model-move-limitations.md). Classic deployment resources can be moved across subscriptions with an operation specific to that scenario.

## Microsoft.CognitiveServices
| Resource type | Resource group | Subscription |
| ------------- | ----------- | ---------- |
| accounts | Yes | Yes |

## Microsoft.Compute
| Resource type | Resource group | Subscription |
| ------------- | ----------- | ---------- |
| availabilitysets | Yes | Yes |
| disks | Yes | Yes |
| galleries | No | No |
| galleries/images | No | No |
| galleries/images/versions | No | No |
| hostgroups | No | No |
| hostgroups/hosts | No | No |
| images | Yes | Yes |
| proximityplacementgroups | No | No |
| restorepointcollections | No | No |
| sharedvmimages | No | No |
| sharedvmimages/versions | No | No |
| snapshots | Yes | Yes |
| virtualmachines | Yes | Yes |
| virtualmachines/extensions | Yes | Yes |
| virtualmachinescalesets | Yes | Yes |

> [!IMPORTANT]
> See [Virtual Machines move guidance](./move-limitations/virtual-machines-move-limitations.md).

## Microsoft.Container
| Resource type | Resource group | Subscription |
| ------------- | ----------- | ---------- |
| containergroups | No | No |

## Microsoft.ContainerInstance
| Resource type | Resource group | Subscription |
| ------------- | ----------- | ---------- |
| containergroups | No | No |

## Microsoft.ContainerRegistry
| Resource type | Resource group | Subscription |
| ------------- | ----------- | ---------- |
| registries | Yes | Yes |
| registries/buildtasks | Yes | Yes |
| registries/replications | Yes | Yes |
| registries/tasks | Yes | Yes |
| registries/webhooks | Yes | Yes |

## Microsoft.ContainerService
| Resource type | Resource group | Subscription |
| ------------- | ----------- | ---------- |
| containerservices | No | No |
| managedclusters | No | No |
| openshiftmanagedclusters | No | No |

## Microsoft.ContentModerator
| Resource type | Resource group | Subscription |
| ------------- | ----------- | ---------- |
| applications | Yes | Yes |

## Microsoft.CortanaAnalytics
| Resource type | Resource group | Subscription |
| ------------- | ----------- | ---------- |
| accounts | No | No |

## Microsoft.CostManagement
| Resource type | Resource group | Subscription |
| ------------- | ----------- | ---------- |
| connectors | Yes | Yes |

## Microsoft.CustomerInsights
| Resource type | Resource group | Subscription |
| ------------- | ----------- | ---------- |
| hubs | Yes | Yes |

## Microsoft.DataBox
| Resource type | Resource group | Subscription |
| ------------- | ----------- | ---------- |
| jobs | No | No |

## Microsoft.DataBoxEdge
| Resource type | Resource group | Subscription |
| ------------- | ----------- | ---------- |
| databoxedgedevices | No | No |

## Microsoft.Databricks
| Resource type | Resource group | Subscription |
| ------------- | ----------- | ---------- |
| workspaces | No | No |

## Microsoft.DataCatalog
| Resource type | Resource group | Subscription |
| ------------- | ----------- | ---------- |
| catalogs | Yes | Yes |
| datacatalogs | No | No |

## Microsoft.DataConnect
| Resource type | Resource group | Subscription |
| ------------- | ----------- | ---------- |
| connectionmanagers | No | No |

## Microsoft.DataExchange
| Resource type | Resource group | Subscription |
| ------------- | ----------- | ---------- |
| packages | No | No |
| plans | No | No |

## Microsoft.DataFactory
| Resource type | Resource group | Subscription |
| ------------- | ----------- | ---------- |
| datafactories | Yes | Yes |
| factories | Yes | Yes |

## Microsoft.DataLake
| Resource type | Resource group | Subscription |
| ------------- | ----------- | ---------- |
| datalakeaccounts | No | No |

## Microsoft.DataLakeAnalytics
| Resource type | Resource group | Subscription |
| ------------- | ----------- | ---------- |
| accounts | Yes | Yes |

## Microsoft.DataLakeStore
| Resource type | Resource group | Subscription |
| ------------- | ----------- | ---------- |
| accounts | Yes | Yes |

## Microsoft.DataMigration
| Resource type | Resource group | Subscription |
| ------------- | ----------- | ---------- |
| services | No | No |
| services/projects | No | No |
| slots | No | No |

## Microsoft.DBforMariaDB
| Resource type | Resource group | Subscription |
| ------------- | ----------- | ---------- |
| servers | Yes | Yes |

## Microsoft.DBforMySQL
| Resource type | Resource group | Subscription |
| ------------- | ----------- | ---------- |
| servers | Yes | Yes |

## Microsoft.DBforPostgreSQL
| Resource type | Resource group | Subscription |
| ------------- | ----------- | ---------- |
| servergroups | No | No |
| servers | Yes | Yes |
| serversv2 | Yes | Yes |

## Microsoft.DeploymentManager
| Resource type | Resource group | Subscription |
| ------------- | ----------- | ---------- |
| artifactsources | Yes | Yes |
| rollouts | Yes | Yes |
| servicetopologies | Yes | Yes |
| servicetopologies/services | Yes | Yes |
| servicetopologies/services/serviceunits | Yes | Yes |
| steps | Yes | Yes |

## Microsoft.Devices
| Resource type | Resource group | Subscription |
| ------------- | ----------- | ---------- |
| elasticpools | No | No |
| elasticpools/iothubtenants | No | No |
| iothubs | Yes | Yes |
| provisioningservices | Yes | Yes |

## Microsoft.DevSpaces
| Resource type | Resource group | Subscription |
| ------------- | ----------- | ---------- |
| controllers | No | No |

## Microsoft.DevTestLab
| Resource type | Resource group | Subscription |
| ------------- | ----------- | ---------- |
| labcenters | No | No |
| labs | Yes | No |
| labs/environments | Yes | Yes |
| labs/servicerunners | Yes | Yes |
| labs/virtualmachines | Yes | No |
| schedules | Yes | Yes |

## microsoft.dns
| Resource type | Resource group | Subscription |
| ------------- | ----------- | ---------- |
| dnszones | No | No |
| dnszones/a | No | No |
| dnszones/aaaa | No | No |
| dnszones/cname | No | No |
| dnszones/mx | No | No |
| dnszones/ptr | No | No |
| dnszones/srv | No | No |
| dnszones/txt | No | No |
| trafficmanagerprofiles | No | No |

## Microsoft.DocumentDB
| Resource type | Resource group | Subscription |
| ------------- | ----------- | ---------- |
| databaseaccounts | Yes | Yes |

## Microsoft.DomainRegistration
| Resource type | Resource group | Subscription |
| ------------- | ----------- | ---------- |
| domains | Yes | Yes |

## Microsoft.EnterpriseKnowledgeGraph
| Resource type | Resource group | Subscription |
| ------------- | ----------- | ---------- |
| services | Yes | Yes |

## Microsoft.EventGrid
| Resource type | Resource group | Subscription |
| ------------- | ----------- | ---------- |
| domains | Yes | Yes |
| topics | Yes | Yes |

## Microsoft.EventHub
| Resource type | Resource group | Subscription |
| ------------- | ----------- | ---------- |
| clusters | Yes | Yes |
| namespaces | Yes | Yes |

## Microsoft.Genomics
| Resource type | Resource group | Subscription |
| ------------- | ----------- | ---------- |
| accounts | No | No |

## Microsoft.HanaOnAzure
| Resource type | Resource group | Subscription |
| ------------- | ----------- | ---------- |
| hanainstances | Yes | Yes |

## Microsoft.HDInsight
| Resource type | Resource group | Subscription |
| ------------- | ----------- | ---------- |
| clusters | Yes | Yes |

> [!IMPORTANT]
> You can move HDInsight clusters to a new subscription or resource group. However, you can't move across subscriptions the networking resources linked to the HDInsight cluster (such as the virtual network, NIC, or load balancer). In addition, you can't move to a new resource group a NIC that is attached to a virtual machine for the cluster.
>
> When moving an HDInsight cluster to a new subscription, first move other resources (like the storage account). Then, move the HDInsight cluster by itself.

## Microsoft.HealthcareApis
| Resource type | Resource group | Subscription |
| ------------- | ----------- | ---------- |
| services | Yes | Yes |

## Microsoft.HybridCompute
| Resource type | Resource group | Subscription |
| ------------- | ----------- | ---------- |
| machines | No | No |

## Microsoft.HybridData
| Resource type | Resource group | Subscription |
| ------------- | ----------- | ---------- |
| datamanagers | Yes | Yes |

## Microsoft.ImportExport
| Resource type | Resource group | Subscription |
| ------------- | ----------- | ---------- |
| jobs | Yes | Yes |

## microsoft.insights
| Resource type | Resource group | Subscription |
| ------------- | ----------- | ---------- |
| accounts | No | No |
| actiongroups | Yes | Yes |
| activitylogalerts | No | No |
| alertrules | Yes | Yes |
| autoscalesettings | Yes | Yes |
| components | Yes | Yes |
| guestdiagnosticsettings | No | No |
| metricalerts | No | No |
| notificationgroups | No | No |
| notificationrules | No | No |
| scheduledqueryrules | Yes | Yes |
| webtests | Yes | Yes |
| workbooks | Yes | Yes |

> [!IMPORTANT]
> Make sure moving to new subscription doesn't exceed [subscription quotas](../azure-subscription-service-limits.md#azure-monitor-limits).

## Microsoft.IoTCentral
| Resource type | Resource group | Subscription |
| ------------- | ----------- | ---------- |
| iotapps | Yes | Yes |

## Microsoft.IoTSpaces
| Resource type | Resource group | Subscription |
| ------------- | ----------- | ---------- |
| checknameavailability | Yes | Yes |
| graph | Yes | Yes |

## Microsoft.KeyVault
| Resource type | Resource group | Subscription |
| ------------- | ----------- | ---------- |
| hsmpools | No | No |
| vaults | Yes | Yes |

> [!IMPORTANT]
> Key Vaults used for disk encryption can't be moved to a resource group in the same subscription or across subscriptions.

## Microsoft.Kusto
| Resource type | Resource group | Subscription |
| ------------- | ----------- | ---------- |
| clusters | Yes | Yes |

## Microsoft.LabServices
| Resource type | Resource group | Subscription |
| ------------- | ----------- | ---------- |
| labaccounts | No | No |

## Microsoft.LocationBasedServices
| Resource type | Resource group | Subscription |
| ------------- | ----------- | ---------- |
| accounts | Yes | Yes |

## Microsoft.LocationServices
| Resource type | Resource group | Subscription |
| ------------- | ----------- | ---------- |
| accounts | No | No |

## Microsoft.Logic
| Resource type | Resource group | Subscription |
| ------------- | ----------- | ---------- |
| hostingenvironments | No | No |
| integrationaccounts | Yes | Yes |
| integrationserviceenvironments | No | No |
| isolatedenvironments | No | No |
| workflows | Yes | Yes |

## Microsoft.MachineLearning
| Resource type | Resource group | Subscription |
| ------------- | ----------- | ---------- |
| commitmentplans | Yes | Yes |
| webservices | Yes | No |
| workspaces | Yes | Yes |

## Microsoft.MachineLearningCompute
| Resource type | Resource group | Subscription |
| ------------- | ----------- | ---------- |
| operationalizationclusters | Yes | Yes |

## Microsoft.MachineLearningExperimentation
| Resource type | Resource group | Subscription |
| ------------- | ----------- | ---------- |
| accounts | No | No |
| accounts/workspaces | No | No |
| accounts/workspaces/projects | No | No |
| teamaccounts | No | No |
| teamaccounts/workspaces | No | No |
| teamaccounts/workspaces/projects | No | No |

## Microsoft.MachineLearningModelManagement
| Resource type | Resource group | Subscription |
| ------------- | ----------- | ---------- |
| accounts | Yes | Yes |

## Microsoft.MachineLearningOperationalization
| Resource type | Resource group | Subscription |
| ------------- | ----------- | ---------- |
| hostingaccounts | No | No |

## Microsoft.MachineLearningServices
| Resource type | Resource group | Subscription |
| ------------- | ----------- | ---------- |
| workspaces | No | No |

## Microsoft.ManagedIdentity
| Resource type | Resource group | Subscription |
| ------------- | ----------- | ---------- |
| userassignedidentities | No | No |

## Microsoft.Maps
| Resource type | Resource group | Subscription |
| ------------- | ----------- | ---------- |
| accounts | Yes | Yes |

## Microsoft.MarketplaceApps
| Resource type | Resource group | Subscription |
| ------------- | ----------- | ---------- |
| classicdevservices | No | No |

## Microsoft.Media
| Resource type | Resource group | Subscription |
| ------------- | ----------- | ---------- |
| mediaservices | Yes | Yes |
| mediaservices/liveevents | Yes | Yes |
| mediaservices/streamingendpoints | Yes | Yes |

## Microsoft.Migrate
| Resource type | Resource group | Subscription |
| ------------- | ----------- | ---------- |
| assessmentprojects | No | No |
| migrateprojects | No | No |
| projects | No | No |

## Microsoft.NetApp
| Resource type | Resource group | Subscription |
| ------------- | ----------- | ---------- |
| netappaccounts | No | No |
| netappaccounts/capacitypools | No | No |
| netappaccounts/capacitypools/volumes | No | No |
| netappaccounts/capacitypools/volumes/mounttargets | No | No |
| netappaccounts/capacitypools/volumes/snapshots | No | No |

## Microsoft.Network
| Resource type | Resource group | Subscription |
| ------------- | ----------- | ---------- |
| applicationgateways | No | No |
| applicationgatewaywebapplicationfirewallpolicies | No | No |
| applicationsecuritygroups | Yes | Yes |
| azurefirewalls | Yes | Yes |
| bastionhosts | No | No |
| connections | Yes | Yes |
| ddoscustompolicies | Yes | Yes |
| ddosprotectionplans | No | No |
| dnszones | Yes | Yes |
| expressroutecircuits | No | No |
| expressroutecrossconnections | No | No |
| expressroutegateways | No | No |
| expressrouteports | No | No |
| frontdoors | No | No |
| frontdoorwebapplicationfirewallpolicies | No | No |
| loadbalancers | Yes - Basic SKU<br>No - Standard SKU | Yes - Basic SKU<br>No - Standard SKU |
| localnetworkgateways | Yes | Yes |
| natgateways | Yes | Yes |
| networkintentpolicies | Yes | Yes |
| networkinterfaces | Yes | Yes |
| networkprofiles | No | No |
| networksecuritygroups | Yes | Yes |
| networkwatchers | Yes | Yes |
| networkwatchers/connectionmonitors | Yes | Yes |
| networkwatchers/lenses | Yes | Yes |
| networkwatchers/pingmeshes | Yes | Yes |
| p2svpngateways | No | No |
| privatednszones | Yes | Yes |
| privatednszones/virtualnetworklinks | Yes | Yes |
| privateendpoints | No | No |
| privatelinkservices | No | No |
| publicipaddresses | Yes - Basic SKU<br>No - Standard SKU | Yes - Basic SKU<br>No - Standard SKU |
| publicipprefixes | Yes | Yes |
| routefilters | No | No |
| routetables | Yes | Yes |
| securegateways | Yes | Yes |
| serviceendpointpolicies | Yes | Yes |
| trafficmanagerprofiles | Yes | Yes |
| virtualhubs | No | No |
| virtualnetworkgateways | Yes | Yes |
| virtualnetworks | Yes | Yes |
| virtualnetworktaps | No | No |
| virtualwans | No | No |
| vpngateways | No | No |
| vpnsites | No | No |
| webapplicationfirewallpolicies | Yes | Yes |

> [!IMPORTANT]
> See [Virtual Networks move guidance](./move-limitations/virtual-network-move-limitations.md).

## Microsoft.NotificationHubs
| Resource type | Resource group | Subscription |
| ------------- | ----------- | ---------- |
| namespaces | Yes | Yes |
| namespaces/notificationhubs | Yes | Yes |

## Microsoft.OperationalInsights
| Resource type | Resource group | Subscription |
| ------------- | ----------- | ---------- |
| workspaces | Yes | Yes |

> [!IMPORTANT]
> Make sure moving to new subscription doesn't exceed [subscription quotas](../azure-subscription-service-limits.md#azure-monitor-limits).

## Microsoft.OperationsManagement
| Resource type | Resource group | Subscription |
| ------------- | ----------- | ---------- |
| managementconfigurations | Yes | Yes |
| solutions | Yes | Yes |
| views | Yes | Yes |

## Microsoft.Peering
| Resource type | Resource group | Subscription |
| ------------- | ----------- | ---------- |
| peerings | No | No |

## Microsoft.Portal
| Resource type | Resource group | Subscription |
| ------------- | ----------- | ---------- |
| dashboards | Yes | Yes |

## Microsoft.PortalSdk
| Resource type | Resource group | Subscription |
| ------------- | ----------- | ---------- |
| rootresources | No | No |

## Microsoft.PowerBI
| Resource type | Resource group | Subscription |
| ------------- | ----------- | ---------- |
| workspacecollections | Yes | Yes |

## Microsoft.PowerBIDedicated
| Resource type | Resource group | Subscription |
| ------------- | ----------- | ---------- |
| capacities | Yes | Yes |

## Microsoft.ProjectOxford
| Resource type | Resource group | Subscription |
| ------------- | ----------- | ---------- |
| accounts | No | No |

## Microsoft.RecoveryServices
| Resource type | Resource group | Subscription |
| ------------- | ----------- | ---------- |
| vaults | Yes | Yes |

> [!IMPORTANT]
> See [Recovery Services move guidance](../backup/backup-azure-move-recovery-services-vault.md?toc=/azure/azure-resource-manager/toc.json).

## Microsoft.Relay
| Resource type | Resource group | Subscription |
| ------------- | ----------- | ---------- |
| namespaces | Yes | Yes |

## Microsoft.SaaS
| Resource type | Resource group | Subscription |
| ------------- | ----------- | ---------- |
| applications | Yes | No |

## Microsoft.Scheduler
| Resource type | Resource group | Subscription |
| ------------- | ----------- | ---------- |
| flows | Yes | Yes |
| jobcollections | Yes | Yes |

## Microsoft.Search
| Resource type | Resource group | Subscription |
| ------------- | ----------- | ---------- |
| searchservices | Yes | Yes |

> [!IMPORTANT]
> You can't move several Search resources in different regions in one operation. Instead, move them in separate operations.

## Microsoft.Security
| Resource type | Resource group | Subscription |
| ------------- | ----------- | ---------- |
| iotsecuritysolutions | Yes | Yes |

## Microsoft.ServerManagement
| Resource type | Resource group | Subscription |
| ------------- | ----------- | ---------- |
| gateways | No | No |
| nodes | No | No |

## Microsoft.ServiceBus
| Resource type | Resource group | Subscription |
| ------------- | ----------- | ---------- |
| namespaces | Yes | Yes |

## Microsoft.ServiceFabric
| Resource type | Resource group | Subscription |
| ------------- | ----------- | ---------- |
| applications | No | No |
| clusters | Yes | Yes |
| containergroups | No | No |
| containergroupsets | No | No |
| edgeclusters | No | No |
| networks | No | No |
| secretstores | No | No |
| volumes | No | No |

## Microsoft.ServiceFabricMesh
| Resource type | Resource group | Subscription |
| ------------- | ----------- | ---------- |
| applications | Yes | Yes |
| containergroups | No | No |
| gateways | Yes | Yes |
| networks | Yes | Yes |
| secrets | Yes | Yes |
| volumes | Yes | Yes |

## Microsoft.SignalRService
| Resource type | Resource group | Subscription |
| ------------- | ----------- | ---------- |
| signalr | Yes | Yes |

## Microsoft.SiteRecovery
| Resource type | Resource group | Subscription |
| ------------- | ----------- | ---------- |
| siterecoveryvault | No | No |

> [!IMPORTANT]
> See [Recovery Services move guidance](../backup/backup-azure-move-recovery-services-vault.md?toc=/azure/azure-resource-manager/toc.json).

## Microsoft.Solutions
| Resource type | Resource group | Subscription |
| ------------- | ----------- | ---------- |
| appliancedefinitions | No | No |
| appliances | No | No |
| applicationdefinitions | No | No |
| applications | No | No |
| jitrequests | No | No |

## Microsoft.Sql
| Resource type | Resource group | Subscription |
| ------------- | ----------- | ---------- |
| instancepools | Yes | Yes |
| managedinstances | Yes | Yes |
| managedinstances/databases | Yes | Yes |
| servers | Yes | Yes |
| servers/databases | Yes | Yes |
| servers/elasticpools | Yes | Yes |
| virtualclusters | Yes | Yes |

> [!IMPORTANT]
> A database and server must be in the same resource group. When you move a SQL server, all its databases are also moved. This behavior applies to Azure SQL Database and Azure SQL Data Warehouse databases.

## Microsoft.SqlVirtualMachine
| Resource type | Resource group | Subscription |
| ------------- | ----------- | ---------- |
| sqlvirtualmachinegroups | Yes | Yes |
| sqlvirtualmachines | Yes | Yes |

## Microsoft.SqlVM
| Resource type | Resource group | Subscription |
| ------------- | ----------- | ---------- |
| dwvm | No | No |

## Microsoft.Storage
| Resource type | Resource group | Subscription |
| ------------- | ----------- | ---------- |
| storageaccounts | Yes | Yes |

## Microsoft.StorageCache
| Resource type | Resource group | Subscription |
| ------------- | ----------- | ---------- |
| caches | No | No |

## Microsoft.StorageSync
| Resource type | Resource group | Subscription |
| ------------- | ----------- | ---------- |
| storagesyncservices | Yes | Yes |

## Microsoft.StorageSyncDev
| Resource type | Resource group | Subscription |
| ------------- | ----------- | ---------- |
| storagesyncservices | No | No |

## Microsoft.StorageSyncInt
| Resource type | Resource group | Subscription |
| ------------- | ----------- | ---------- |
| storagesyncservices | No | No |

## Microsoft.StorSimple
| Resource type | Resource group | Subscription |
| ------------- | ----------- | ---------- |
| managers | No | No |

## Microsoft.StreamAnalytics
| Resource type | Resource group | Subscription |
| ------------- | ----------- | ---------- |
| streamingjobs | Yes | Yes |

> [!IMPORTANT]
> Stream Analytics jobs can't be moved when in running state.

## Microsoft.StreamAnalyticsExplorer
| Resource type | Resource group | Subscription |
| ------------- | ----------- | ---------- |
| environments | No | No |
| environments/eventsources | No | No |
| instances | No | No |
| instances/environments | No | No |
| instances/environments/eventsources | No | No |

## Microsoft.TerraformOSS
| Resource type | Resource group | Subscription |
| ------------- | ----------- | ---------- |
| providerregistrations | No | No |
| resources | No | No |

## Microsoft.TimeSeriesInsights
| Resource type | Resource group | Subscription |
| ------------- | ----------- | ---------- |
| environments | Yes | Yes |
| environments/eventsources | Yes | Yes |
| environments/referencedatasets | Yes | Yes |

## Microsoft.Token
| Resource type | Resource group | Subscription |
| ------------- | ----------- | ---------- |
| stores | No | No |

## Microsoft.VirtualMachineImages
| Resource type | Resource group | Subscription |
| ------------- | ----------- | ---------- |
| imagetemplates | No | No |

## microsoft.visualstudio
| Resource type | Resource group | Subscription |
| ------------- | ----------- | ---------- |
| account | Yes | Yes |
| account/extension | Yes | Yes |
| account/project | Yes | Yes |

> [!IMPORTANT]
> To change the subscription for Azure DevOps, see [change the Azure subscription used for billing](/azure/devops/organizations/billing/change-azure-subscription?toc=/azure/azure-resource-manager/toc.json).

## Microsoft.VMwareCloudSimple
| Resource type | Resource group | Subscription |
| ------------- | ----------- | ---------- |
| dedicatedcloudnodes | Yes | Yes |
| dedicatedcloudservices | Yes | Yes |
| virtualmachines | Yes | Yes |

## Microsoft.Web
| Resource type | Resource group | Subscription |
| ------------- | ----------- | ---------- |
| certificates | No | Yes |
| connectiongateways | Yes | Yes |
| connections | Yes | Yes |
| customapis | Yes | Yes |
| hostingenvironments | No | No |
| serverfarms | Yes | Yes |
| sites | Yes | Yes |
| sites/premieraddons | Yes | Yes |
| sites/slots | Yes | Yes |

> [!IMPORTANT]
> See [App Service move guidance](./move-limitations/app-service-move-limitations.md).

## Microsoft.WindowsIoT
| Resource type | Resource group | Subscription |
| ------------- | ----------- | ---------- |
| deviceservices | No | No |

## Microsoft.WindowsVirtualDesktop
| Resource type | Resource group | Subscription |
| ------------- | ----------- | ---------- |
| applicationgroups | No | No |
| hostpools | No | No |
| workspaces | No | No |

## Third-party services

Third-party services currently don't support the move operation.

## Next steps
For commands to move resources, see [Move resources to new resource group or subscription](resource-group-move-resources.md).

To get the same data as a file of comma-separated values, download [move-support-resources.csv](https://github.com/tfitzmac/resource-capabilities/blob/master/move-support-resources.csv).

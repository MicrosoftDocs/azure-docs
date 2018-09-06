---
title: Lists Azure resources that support move operation | Microsoft Docs
description: Lists the Azure resource types that can be moved to a new resource group or subscription.
services: azure-resource-manager
documentationcenter: ''
author: tfitzmac

ms.service: azure-resource-manager
ms.workload: multiple
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.date: 09/05/2018
ms.author: tomfitz

---
# Move operation support for resources

This article lists whether an Azure resource type supports the move operation. 

RP	Resource	MoveTracked	MoveAvailable	SupportCrossRGMove	CrossRGMoveValidate	SupportCrossSubMove	CrossSubMoveValidate

## Microsoft.AAD

| Resource type | Resource group move | Subscription move |
| ------------- | ------------------- | ----------------- |
| domainservices | No | No |

## Microsoft.AnalysisServices
| Resource type | Resource group move | Subscription move |
| ------------- | ------------------- | ----------------- |
| servers | Yes | Yes |

## Microsoft.ApiManagement
| Resource type | Resource group move | Subscription move |
| ------------- | ------------------- | ----------------- |
| service | Yes | Yes |

## Microsoft.Authorization
| Resource type | Resource group move | Subscription move |
| ------------- | ------------------- | ----------------- |
| policyassignments | No | No |

## Microsoft.Automation
| Resource type | Resource group move | Subscription move |
| ------------- | ------------------- | ----------------- |
| automationaccounts | Yes | Yes |
| automationaccounts/configurations	| Yes | Yes |
| automationaccounts/runbooks | Yes | Yes |

## Microsoft.AzureActiveDirectory
| Resource type | Resource group move | Subscription move |
| ------------- | ------------------- | ----------------- |
| b2cdirectories | Yes | Yes |

## Microsoft.AzureStack
| Resource type | Resource group move | Subscription move |
| ------------- | ------------------- | ----------------- |
| registrations | Yes | Yes |

## Microsoft.Backup
| Resource type | Resource group move | Subscription move |
| ------------- | ------------------- | ----------------- |
| backupvault | No | No |

## Microsoft.Batch
| Resource type | Resource group move | Subscription move |
| ------------- | ------------------- | ----------------- |
| batchaccounts	| Yes | Yes |

## Microsoft.BatchAI
| Resource type | Resource group move | Subscription move |
| ------------- | ------------------- | ----------------- |
| clusters | No | No |
| fileservers | No | No |
| jobs | No | No |
| workspaces | No | No |

## Microsoft.BingMaps
| Resource type | Resource group move | Subscription move |
| ------------- | ------------------- | ----------------- |
| mapapis | No | No |

## Microsoft.BizTalkServices
| Resource type | Resource group move | Subscription move |
| ------------- | ------------------- | ----------------- |
| biztalk | Yes | Yes |

## Microsoft.Blueprint
| Resource type | Resource group move | Subscription move |
| ------------- | ------------------- | ----------------- |
| blueprintassignments | No | No |

## Microsoft.BotService
| Resource type | Resource group move | Subscription move |
| ------------- | ------------------- | ----------------- |
| botservices | Yes | Yes |

## Microsoft.Cache
| Resource type | Resource group move | Subscription move |
| ------------- | ------------------- | ----------------- |
| redis | Yes | Yes |

## Microsoft.Cdn
| Resource type | Resource group move | Subscription move |
| ------------- | ------------------- | ----------------- |
| profiles | Yes | Yes |
| profiles/endpoints | Yes | Yes |

## Microsoft.CertificateRegistration
| Resource type | Resource group move | Subscription move |
| ------------- | ------------------- | ----------------- |
| certificateorders	| Yes | Yes |

## Microsoft.ClassicCompute
| Resource type | Resource group move | Subscription move |
| ------------- | ------------------- | ----------------- |
| domainnames | Yes | No |
| virtualmachines | Yes | No |

## Microsoft.ClassicNetwork
| Resource type | Resource group move | Subscription move |
| ------------- | ------------------- | ----------------- |
| networksecuritygroups | No | No |
| reservedips | No | No |
| virtualnetworks | No | No |

## Microsoft.ClassicStorage
| Resource type | Resource group move | Subscription move |
| ------------- | ------------------- | ----------------- |
| storageaccounts | Yes | No |

## Microsoft.CognitiveServices
| Resource type | Resource group move | Subscription move |
| ------------- | ------------------- | ----------------- |
| accounts | Yes | Yes |

## Microsoft.Compute
| Resource type | Resource group move | Subscription move |
| ------------- | ------------------- | ----------------- |
| availabilitysets | Yes | Yes |
| disks | Yes | Yes |
| galleries | No | No |
| galleries/images | No | No |
| galleries/images/versions | No | No |
| images | Yes | Yes |
| restorepointcollections | No | No |
| sharedvmimages | No | No |
| sharedvmimages/versions | No | No |
| snapshots | Yes | Yes |
| virtualmachines | Yes | Yes |
| virtualmachines/extensions | Yes | Yes |
| virtualmachinescalesets | Yes | Yes |

## Microsoft.Container
| Resource type | Resource group move | Subscription move |
| ------------- | ------------------- | ----------------- |
| containergroups | No | No |

## Microsoft.ContainerInstance
| Resource type | Resource group move | Subscription move |
| ------------- | ------------------- | ----------------- |
| containergroups | No | No |

## Microsoft.ContainerRegistry
| Resource type | Resource group move | Subscription move |
| ------------- | ------------------- | ----------------- |
| registries | Yes | Yes |
| registries/buildtasks	| Yes | Yes |
| registries/replications | No | No |
| registries/webhooks | Yes | Yes |

## Microsoft.ContainerService
| Resource type | Resource group move | Subscription move |
| ------------- | ------------------- | ----------------- |
| containerservices | No | No |
| managedclusters | No | No |

## Microsoft.ContentModerator
| Resource type | Resource group move | Subscription move |
| ------------- | ------------------- | ----------------- |
| applications | Yes | Yes |

## Microsoft.CostManagement
| Resource type | Resource group move | Subscription move |
| ------------- | ------------------- | ----------------- |
| connectors | Yes | Yes |

## Microsoft.CustomerInsights
| Resource type | Resource group move | Subscription move |
| ------------- | ------------------- | ----------------- |
| hubs | Yes | Yes |

## Microsoft.DataBox
| Resource type | Resource group move | Subscription move |
| ------------- | ------------------- | ----------------- |
| jobs | No | No |

## Microsoft.DataBoxEdge
| Resource type | Resource group move | Subscription move |
| ------------- | ------------------- | ----------------- |
| databoxedgedevices | No | No |

## Microsoft.Databricks
| Resource type | Resource group move | Subscription move |
| ------------- | ------------------- | ----------------- |
| workspaces | No | No |

## Microsoft.DataCatalog
| Resource type | Resource group move | Subscription move |
| ------------- | ------------------- | ----------------- |
| catalogs | Yes | Yes |

## Microsoft.DataFactory
| Resource type | Resource group move | Subscription move |
| ------------- | ------------------- | ----------------- |
| datafactories | Yes | Yes |
| factories | Yes | Yes |

## Microsoft.DataLake
| Resource type | Resource group move | Subscription move |
| ------------- | ------------------- | ----------------- |
| datalakeaccounts | No | No |

## Microsoft.DataLakeAnalytics
| Resource type | Resource group move | Subscription move |
| ------------- | ------------------- | ----------------- |
| accounts | Yes | Yes |

## Microsoft.DataLakeStore
| Resource type | Resource group move | Subscription move |
| ------------- | ------------------- | ----------------- |
| accounts | Yes | Yes |

## Microsoft.DataMigration
| Resource type | Resource group move | Subscription move |
| ------------- | ------------------- | ----------------- |
| services | No | No |
| services/projects | No | No |
| slots | No | No |

## Microsoft.DBforMariaDB
| Resource type | Resource group move | Subscription move |
| ------------- | ------------------- | ----------------- |
| servers | No | No |

## Microsoft.DBforMySQL
| Resource type | Resource group move | Subscription move |
| ------------- | ------------------- | ----------------- |
| servers | No | No |

## Microsoft.DBforPostgreSQL
| Resource type | Resource group move | Subscription move |
| ------------- | ------------------- | ----------------- |
| servergroups | No | No |
| servers | No | No |

## Microsoft.Devices
| Resource type | Resource group move | Subscription move |
| ------------- | ------------------- | ----------------- |
| iothubs | Yes | Yes |
| provisioningservices | Yes | Yes |

## Microsoft.DevTestLab
| Resource type | Resource group move | Subscription move |
| ------------- | ------------------- | ----------------- |
| labcenters | No | No |
| labs | Yes | No |
| labs/servicerunners | Yes | Yes |
| labs/virtualmachines | Yes | No |
| schedules | No | No |

## microsoft.dns
| Resource type | Resource group move | Subscription move |
| ------------- | ------------------- | ----------------- |
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
| Resource type | Resource group move | Subscription move |
| ------------- | ------------------- | ----------------- |
| databaseaccounts | Yes | Yes |

## Microsoft.DomainRegistration
| Resource type | Resource group move | Subscription move |
| ------------- | ------------------- | ----------------- |
| domains | Yes | Yes |

## Microsoft.EventGrid
| Resource type | Resource group move | Subscription move |
| ------------- | ------------------- | ----------------- |
| topics | Yes | Yes |

## Microsoft.EventHub
| Resource type | Resource group move | Subscription move |
| ------------- | ------------------- | ----------------- |
| clusters | Yes | Yes |
| namespaces | Yes | Yes |

## Microsoft.HanaOnAzure
| Resource type | Resource group move | Subscription move |
| ------------- | ------------------- | ----------------- |
| hanainstances | Yes | Yes |

## Microsoft.HardwareSecurityModules
| Resource type | Resource group move | Subscription move |
| ------------- | ------------------- | ----------------- |
| dedicatedhsms | No | No |

## Microsoft.HDInsight
| Resource type | Resource group move | Subscription move |
| ------------- | ------------------- | ----------------- |
| clusters | Yes | Yes |

## Microsoft.ImportExport
| Resource type | Resource group move | Subscription move |
| ------------- | ------------------- | ----------------- |
| jobs | Yes | Yes |

## microsoft.insights
| Resource type | Resource group move | Subscription move |
| ------------- | ------------------- | ----------------- |
| actiongroups | Yes | Yes |
| activitylogalerts	| No | No |
| alertrules | Yes | Yes |
| autoscalesettings	| Yes | Yes |
| components | Yes | Yes |
| metricalerts | No | No |
| scheduledqueryrules | Yes | Yes |
| webtests | Yes | Yes |
| workbooks | Yes | Yes |

## Microsoft.IoTCentral
| Resource type | Resource group move | Subscription move |
| ------------- | ------------------- | ----------------- |
| iotapps | Yes | Yes |

## Microsoft.KeyVault
| Resource type | Resource group move | Subscription move |
| ------------- | ------------------- | ----------------- |
| vaults | Yes | Yes |

## Microsoft.LabServices
| Resource type | Resource group move | Subscription move |
| ------------- | ------------------- | ----------------- |
| labaccounts | Yes | Yes |

## Microsoft.LocationBasedServices
| Resource type | Resource group move | Subscription move |
| ------------- | ------------------- | ----------------- |
| accounts | Yes | Yes |

## Microsoft.LocationServices
| Resource type | Resource group move | Subscription move |
| ------------- | ------------------- | ----------------- |
| accounts | Yes | Yes |

## Microsoft.Logic
| Resource type | Resource group move | Subscription move |
| ------------- | ------------------- | ----------------- |
| integrationaccounts | Yes | Yes |
| workflows	| Yes | Yes |

## Microsoft.MachineLearning
| Resource type | Resource group move | Subscription move |
| ------------- | ------------------- | ----------------- |
| commitmentplans | Yes | Yes |
| webservices | Yes | No |
| workspaces | Yes | Yes |

## Microsoft.MachineLearningCompute
| Resource type | Resource group move | Subscription move |
| ------------- | ------------------- | ----------------- |
| operationalizationclusters | Yes | Yes |

## Microsoft.MachineLearningExperimentation
| Resource type | Resource group move | Subscription move |
| ------------- | ------------------- | ----------------- |
| accounts | Yes | Yes |
| accounts/workspaces | Yes | Yes |
| accounts/workspaces/projects | Yes | Yes |
| teamaccounts | Yes | Yes |
| teamaccounts/workspaces | Yes | Yes |
| teamaccounts/workspaces/projects | Yes | Yes |

## Microsoft.MachineLearningModelManagement
| Resource type | Resource group move | Subscription move |
| ------------- | ------------------- | ----------------- |
| accounts | Yes | Yes |

## Microsoft.ManagedIdentity
| Resource type | Resource group move | Subscription move |
| ------------- | ------------------- | ----------------- |
| userassignedidentities | Yes | Yes |

## Microsoft.Maps
| Resource type | Resource group move | Subscription move |
| ------------- | ------------------- | ----------------- |
| accounts | Yes | Yes |

## Microsoft.MarketplaceApps
| Resource type | Resource group move | Subscription move |
| ------------- | ------------------- | ----------------- |
| classicdevservices | No | No |

## Microsoft.Media
| Resource type | Resource group move | Subscription move |
| ------------- | ------------------- | ----------------- |
| mediaservices | Yes | Yes |
| mediaservices/liveevents | Yes | Yes |
| mediaservices/streamingendpoints | Yes | Yes |

## Microsoft.Migrate
| Resource type | Resource group move | Subscription move |
| ------------- | ------------------- | ----------------- |
| projects | No | No |

## Microsoft.Network
| Resource type | Resource group move | Subscription move |
| ------------- | ------------------- | ----------------- |
| applicationgateways | No | No |
| applicationsecuritygroups	| Yes | Yes |
| connections | Yes | Yes |
| ddosprotectionplans | No | No |
| dnszones | Yes | Yes |
| expressroutecircuits | No | No |
| expressrouteports	| No | No |
| loadbalancers	| Yes | Yes |
| localnetworkgateways | Yes | Yes |
| networkintentpolicies	| Yes | Yes |
| networkinterfaces | Yes | Yes |
| networksecuritygroups	| Yes | Yes |
| networkwatchers | Yes | Yes |
| networkwatchers/connectionmonitors | Yes | Yes |
| networkwatchers/lenses | Yes | Yes |
| networkwatchers/pingmeshes | Yes | Yes |
| publicipaddresses	| Yes | Yes |
| publicipprefixes | Yes | Yes |
| routefilters | No | No |
| routetables | Yes | Yes |
| trafficmanagerprofiles | Yes | Yes |
| virtualnetworkgateways | Yes | Yes |
| virtualnetworks | Yes | Yes |

## Microsoft.NotificationHubs
| Resource type | Resource group move | Subscription move |
| ------------- | ------------------- | ----------------- |
| namespaces | Yes | Yes |
| namespaces/notificationhubs | Yes | Yes |

## Microsoft.OperationalInsights
| Resource type | Resource group move | Subscription move |
| ------------- | ------------------- | ----------------- |
| workspaces | Yes | Yes |

## Microsoft.OperationsManagement
| Resource type | Resource group move | Subscription move |
| ------------- | ------------------- | ----------------- |
| managementconfigurations | Yes | Yes |
| solutions | Yes | Yes |
| views | Yes | Yes |

## Microsoft.Portal
| Resource type | Resource group move | Subscription move |
| ------------- | ------------------- | ----------------- |
| dashboards | Yes | Yes |

## Microsoft.PowerBI
| Resource type | Resource group move | Subscription move |
| ------------- | ------------------- | ----------------- |
| workspacecollections | Yes | Yes |

## Microsoft.PowerBIDedicated
| Resource type | Resource group move | Subscription move |
| ------------- | ------------------- | ----------------- |
| capacities | Yes | Yes |

## Microsoft.RecoveryServices
| Resource type | Resource group move | Subscription move |
| ------------- | ------------------- | ----------------- |
| vaults | Yes | Yes |

## Microsoft.Relay
| Resource type | Resource group move | Subscription move |
| ------------- | ------------------- | ----------------- |
| namespaces | Yes | Yes |

## Microsoft.SaaS
| Resource type | Resource group move | Subscription move |
| ------------- | ------------------- | ----------------- |
| applications | Yes | No |

## Microsoft.Scheduler
| Resource type | Resource group move | Subscription move |
| ------------- | ------------------- | ----------------- |
| flows | Yes | Yes |
| jobcollections | Yes | Yes |

## Microsoft.Search
| Resource type | Resource group move | Subscription move |
| ------------- | ------------------- | ----------------- |
| searchservices | Yes | Yes |

## Microsoft.ServiceBus
| Resource type | Resource group move | Subscription move |
| ------------- | ------------------- | ----------------- |
| namespaces | Yes | Yes |

## Microsoft.ServiceFabric
| Resource type | Resource group move | Subscription move |
| ------------- | ------------------- | ----------------- |
| clusters | Yes | Yes |

## Microsoft.ServiceFabricMesh
| Resource type | Resource group move | Subscription move |
| ------------- | ------------------- | ----------------- |
| applications | Yes | Yes |
| networks | Yes | Yes |
| volumes | Yes | Yes |

## Microsoft.SignalRService
| Resource type | Resource group move | Subscription move |
| ------------- | ------------------- | ----------------- |
| signalr | Yes | Yes |

## Microsoft.SiteRecovery
| Resource type | Resource group move | Subscription move |
| ------------- | ------------------- | ----------------- |
| siterecoveryvault | No | No |

## Microsoft.Solutions
| Resource type | Resource group move | Subscription move |
| ------------- | ------------------- | ----------------- |
| appliancedefinitions | No | No |
| appliances | No | No |
| applicationdefinitions | No | No |
| applications | No | No |

## Microsoft.Sql
| Resource type | Resource group move | Subscription move |
| ------------- | ------------------- | ----------------- |
| servers | Yes | Yes |
| servers/databases | Yes | Yes |
| servers/elasticpools | Yes | Yes |
| virtualclusters | Yes | Yes |

## Microsoft.Storage
| Resource type | Resource group move | Subscription move |
| ------------- | ------------------- | ----------------- |
| storageaccounts | Yes | Yes |

## Microsoft.StorageSync
| Resource type | Resource group move | Subscription move |
| ------------- | ------------------- | ----------------- |
| storagesyncservices | Yes | Yes |

## Microsoft.StorSimple
| Resource type | Resource group move | Subscription move |
| ------------- | ------------------- | ----------------- |
| managers | No | No |

## Microsoft.StreamAnalytics
| Resource type | Resource group move | Subscription move |
| ------------- | ------------------- | ----------------- |
| streamingjobs | Yes | Yes |

## Microsoft.TimeSeriesInsights
| Resource type | Resource group move | Subscription move |
| ------------- | ------------------- | ----------------- |
| environments | Yes | Yes |
| environments/eventsources | Yes | Yes |
| environments/referencedatasets | Yes | Yes |

## microsoft.visualstudio
| Resource type | Resource group move | Subscription move |
| ------------- | ------------------- | ----------------- |
| account | Yes | Yes |
| account/extension | Yes | Yes |
| account/project | Yes | Yes |

## Microsoft.Web
| Resource type | Resource group move | Subscription move |
| ------------- | ------------------- | ----------------- |
| certificates | No | Yes |
| classicmobileservices | No | No |
| connectiongateways | Yes | Yes |
| connections | Yes | Yes |
| customapis | Yes | Yes |
| hostingenvironments | No | No |
| serverfarms | Yes | Yes |
| sites | Yes | Yes |
| sites/premieraddons | Yes | Yes |
| sites/slots | Yes | Yes |

## Microsoft.WindowsIoT
| Resource type | Resource group move | Subscription move |
| ------------- | ------------------- | ----------------- |
| deviceservices | Yes | Yes |


## Third party services

Third party services currently don't support the move operation. These resource providers are:

* 84codes.CloudAMQP
* AppDynamics.APM
* Aspera.Transfers
* Auth0.Cloud
* Citrix.Cloud
* Citrix.Services
* CloudSimple.PrivateCloudIaaS
* Cloudyn.Analytics
* Conexlink.MyCloudIT
* Crypteron.DataSecurity
* Dynatrace.DynatraceSaaS
* Dynatrace.Ruxit
* LiveArena.Broadcast
* Lombiq.DotNest
* Mailjet.Email
* Myget.PackageManagement
* NewRelic.APM
* nuubit.nextgencdn
* Paraleap.CloudMonix
* Pokitdok.Platform
* RavenHq.Db
* Raygun.CrashReporting
* RevAPM.MobileCDN
* Sendgrid.Email
* Sparkpost.Basic
* stackify.retrace
* SuccessBricks.ClearDB
* TrendMicro.DeepSecurity
* U2uconsult.TheIdentityHub


## Next steps

* To learn about PowerShell cmdlets for managing your subscription, see [Using Azure PowerShell with Resource Manager](powershell-azure-resource-manager.md).
* To learn about Azure CLI commands for managing your subscription, see [Using the Azure CLI with Resource Manager](xplat-cli-azure-resource-manager.md).
* To learn about portal features for managing your subscription, see [Using the Azure portal to manage resources](resource-group-portal.md).
* To learn about applying a logical organization to your resources, see [Using tags to organize your resources](resource-group-using-tags.md).

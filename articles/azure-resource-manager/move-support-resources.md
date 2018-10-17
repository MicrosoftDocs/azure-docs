---
title: Move operation support by Azure resource type | Microsoft Docs
description: Lists the Azure resource types that can be moved to a new resource group or subscription.
services: azure-resource-manager
documentationcenter: ''
author: tfitzmac

ms.service: azure-resource-manager
ms.workload: multiple
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.date: 09/28/2018
ms.author: tomfitz

---
# Move operation support for resources

This article lists whether an Azure resource type supports the move operation. Although a resource type supports the move operation, there may be conditions that prevent the resource from being moved. For details about conditions that affect move operations, see [Move resources to new resource group or subscription](resource-group-move-resources.md).

## Find resource provider and resource type

To determine if a resource can be moved, you must find its resource provider and resource type.

For PowerShell, use:

```azurepowershell-interactive
Get-AzureRmResource -ResourceGroupName demogroup | Select Name, ResourceType | Format-table
```

For Azure CLI, use:

```azurecli-interactive
az resource list -g demogroup --query '[].{name:name, reourcetype:type}'
```

The resource type is returned in the format `<resource-provider>/<resource-type-name>`. So, the value `Microsoft.OperationalInsights/workspaces` has a resource provider of **Microsoft.OperationalInsights** and resource type name of **workspaces**.

After finding the resource provider and resource type, use the tables in this article to determine whether the resource type supports the move operation.

## Microsoft.AAD

| Resource type | Resource group | Subscription |
| ------------- | --------------- | ----------- |
| domainservices | No | No |

## Microsoft.AnalysisServices
| Resource type | Resource group | Subscription |
| ------------- | -------------- | ------------ |
| servers | Yes | Yes |

## Microsoft.ApiManagement
| Resource type | Resource group | Subscription |
| ------------- | --------------- | ----------- |
| service | Yes | Yes |

## Microsoft.Authorization
| Resource type | Resource group | Subscription |
| ------------- | --------------- | ----------- |
| policyassignments | No | No |

## Microsoft.Automation
| Resource type | Resource group | Subscription |
| ------------- | -------------- | ------------ |
| automationaccounts | Yes | Yes |
| automationaccounts/configurations	| Yes | Yes |
| automationaccounts/runbooks | Yes | Yes |

## Microsoft.AzureActiveDirectory
| Resource type | Resource group | Subscription |
| ------------- | -------------- | ------------ |
| b2cdirectories | Yes | Yes |

## Microsoft.AzureStack
| Resource type | Resource group | Subscription |
| ------------- | -------------- | ------------ |
| registrations | Yes | Yes |

## Microsoft.Backup
| Resource type | Resource group | Subscription |
| ------------- | -------------- | ------------ |
| backupvault | No | No |

## Microsoft.Batch
| Resource type | Resource group | Subscription |
| ------------- | -------------- | ------------ |
| batchaccounts	| Yes | Yes |

## Microsoft.BatchAI
| Resource type | Resource group | Subscription |
| ------------- | -------------- | ------------ |
| clusters | No | No |
| fileservers | No | No |
| jobs | No | No |
| workspaces | No | No |

## Microsoft.BingMaps
| Resource type | Resource group | Subscription |
| ------------- | -------------- | ------------ |
| mapapis | No | No |

## Microsoft.BizTalkServices
| Resource type | Resource group | Subscription |
| ------------- | -------------- | ------------ |
| biztalk | Yes | Yes |

## Microsoft.Blueprint
| Resource type | Resource group | Subscription |
| ------------- | -------------- | ------------ |
| blueprintassignments | No | No |

## Microsoft.BotService
| Resource type | Resource group | Subscription |
| ------------- | -------------- | ------------ |
| botservices | Yes | Yes |

## Microsoft.Cache
| Resource type | Resource group | Subscription |
| ------------- | -------------- | ------------ |
| redis | Yes | Yes |

## Microsoft.Cdn
| Resource type | Resource group | Subscription |
| ------------- | -------------- | ------------ |
| profiles | Yes | Yes |
| profiles/endpoints | Yes | Yes |

## Microsoft.CertificateRegistration
| Resource type | Resource group | Subscription |
| ------------- | -------------- | ------------ |
| certificateorders	| Yes | Yes |

## Microsoft.ClassicCompute
| Resource type | Resource group | Subscription |
| ------------- | -------------- | ------------ |
| domainnames | Yes | No |
| virtualmachines | Yes | No |

## Microsoft.ClassicNetwork
| Resource type | Resource group | Subscription |
| ------------- | -------------- | ------------ |
| networksecuritygroups | No | No |
| reservedips | No | No |
| virtualnetworks | No | No |

## Microsoft.ClassicStorage
| Resource type | Resource group | Subscription |
| ------------- | -------------- | ------------ |
| storageaccounts | Yes | No |

## Microsoft.CognitiveServices
| Resource type | Resource group | Subscription |
| ------------- | -------------- | ------------ |
| accounts | Yes | Yes |

## Microsoft.Compute
| Resource type | Resource group | Subscription |
| ------------- | -------------- | ------------ |
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
| Resource type | Resource group | Subscription |
| ------------- | -------------- | ------------ |
| containergroups | No | No |

## Microsoft.ContainerInstance
| Resource type | Resource group | Subscription |
| ------------- | -------------- | ------------ |
| containergroups | No | No |

## Microsoft.ContainerRegistry
| Resource type | Resource group | Subscription |
| ------------- | -------------- | ------------ |
| registries | Yes | Yes |
| registries/buildtasks	| Yes | Yes |
| registries/replications | No | No |
| registries/tasks | Yes | Yes |
| registries/webhooks | Yes | Yes |

## Microsoft.ContainerService
| Resource type | Resource group | Subscription |
| ------------- | -------------- | ------------ |
| containerservices | No | No |
| managedclusters | No | No |
| openshiftmanagedclusters | No | No |

## Microsoft.ContentModerator
| Resource type | Resource group | Subscription |
| ------------- | -------------- | ------------ |
| applications | Yes | Yes |

## Microsoft.CostManagement
| Resource type | Resource group | Subscription |
| ------------- | -------------- | ------------ |
| connectors | Yes | Yes |

## Microsoft.CustomerInsights
| Resource type | Resource group | Subscription |
| ------------- | -------------- | ------------ |
| hubs | Yes | Yes |

## Microsoft.DataBox
| Resource type | Resource group | Subscription |
| ------------- | -------------- | ------------ |
| jobs | No | No |

## Microsoft.DataBoxEdge
| Resource type | Resource group | Subscription |
| ------------- | -------------- | ------------ |
| databoxedgedevices | No | No |

## Microsoft.Databricks
| Resource type | Resource group | Subscription |
| ------------- | -------------- | ------------ |
| workspaces | No | No |

## Microsoft.DataCatalog
| Resource type | Resource group | Subscription |
| ------------- | -------------- | ------------ |
| catalogs | Yes | Yes |

## Microsoft.DataFactory
| Resource type | Resource group | Subscription |
| ------------- | -------------- | ------------ |
| datafactories | Yes | Yes |
| factories | Yes | Yes |

## Microsoft.DataLake
| Resource type | Resource group | Subscription |
| ------------- | -------------- | ------------ |
| datalakeaccounts | No | No |

## Microsoft.DataLakeAnalytics
| Resource type | Resource group | Subscription |
| ------------- | -------------- | ------------ |
| accounts | Yes | Yes |

## Microsoft.DataLakeStore
| Resource type | Resource group | Subscription |
| ------------- | -------------- | ------------ |
| accounts | Yes | Yes |

## Microsoft.DataMigration
| Resource type | Resource group | Subscription |
| ------------- | -------------- | ------------ |
| services | No | No |
| services/projects | No | No |
| slots | No | No |

## Microsoft.DBforMariaDB
| Resource type | Resource group | Subscription |
| ------------- | -------------- | ------------ |
| servers | No | No |

## Microsoft.DBforMySQL
| Resource type | Resource group | Subscription |
| ------------- | -------------- | ------------ |
| servers | Yes | Yes |

## Microsoft.DBforPostgreSQL
| Resource type | Resource group | Subscription |
| ------------- | -------------- | ------------ |
| servergroups | No | No |
| servers | Yes | Yes |

## Microsoft.DeploymentManager
| Resource type | Resource group | Subscription |
| ------------- | -------------- | ------------ |
| artifactsources | No | No |
| rollouts | No | No |
| servicetopologies | No | No |
| servicetopologies/services | No | No |
| servicetopologies/services/serviceunits | No | No |

## Microsoft.Devices
| Resource type | Resource group | Subscription |
| ------------- | -------------- | ------------ |
| iothubs | Yes | Yes |
| provisioningservices | Yes | Yes |

## Microsoft.DevTestLab
| Resource type | Resource group | Subscription |
| ------------- | -------------- | ------------ |
| labcenters | No | No |
| labs | Yes | No |
| labs/servicerunners | Yes | Yes |
| labs/virtualmachines | Yes | No |
| schedules | No | No |

## microsoft.dns
| Resource type | Resource group | Subscription |
| ------------- | -------------- | ------------ |
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
| ------------- | -------------- | ------------ |
| databaseaccounts | Yes | Yes |

## Microsoft.DomainRegistration
| Resource type | Resource group | Subscription |
| ------------- | -------------- | ------------ |
| domains | Yes | Yes |

## Microsoft.EventGrid
| Resource type | Resource group | Subscription |
| ------------- | -------------- | ------------ |
| topics | Yes | Yes |

## Microsoft.EventHub
| Resource type | Resource group | Subscription |
| ------------- | -------------- | ------------ |
| clusters | Yes | Yes |
| namespaces | Yes | Yes |

## Microsoft.HanaOnAzure
| Resource type | Resource group | Subscription |
| ------------- | -------------- | ------------ |
| hanainstances | Yes | Yes |

## Microsoft.HardwareSecurityModules
| Resource type | Resource group | Subscription |
| ------------- | -------------- | ------------ |
| dedicatedhsms | No | No |

## Microsoft.HDInsight
| Resource type | Resource group | Subscription |
| ------------- | -------------- | ------------ |
| clusters | Yes | Yes |

## Microsoft.ImportExport
| Resource type | Resource group | Subscription |
| ------------- | -------------- | ------------ |
| jobs | Yes | Yes |

## microsoft.insights
| Resource type | Resource group | Subscription |
| ------------- | -------------- | ------------ |
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
| Resource type | Resource group | Subscription |
| ------------- | -------------- | ------------ |
| iotapps | Yes | Yes |

## Microsoft.KeyVault
| Resource type | Resource group | Subscription |
| ------------- | -------------- | ------------ |
| vaults | Yes | Yes |

## Microsoft.LabServices
| Resource type | Resource group | Subscription |
| ------------- | -------------- | ------------ |
| labaccounts | Yes | Yes |

## Microsoft.LocationBasedServices
| Resource type | Resource group | Subscription |
| ------------- | -------------- | ------------ |
| accounts | Yes | Yes |

## Microsoft.LocationServices
| Resource type | Resource group | Subscription |
| ------------- | -------------- | ------------ |
| accounts | Yes | Yes |

## Microsoft.Logic
| Resource type | Resource group | Subscription |
| ------------- | -------------- | ------------ |
| integrationaccounts | Yes | Yes |
| workflows	| Yes | Yes |

## Microsoft.MachineLearning
| Resource type | Resource group | Subscription |
| ------------- | -------------- | ------------ |
| commitmentplans | Yes | Yes |
| webservices | Yes | No |
| workspaces | Yes | Yes |

## Microsoft.MachineLearningCompute
| Resource type | Resource group | Subscription |
| ------------- | -------------- | ------------ |
| operationalizationclusters | Yes | Yes |

## Microsoft.MachineLearningExperimentation
| Resource type | Resource group | Subscription |
| ------------- | -------------- | ------------ |
| accounts | Yes | Yes |
| accounts/workspaces | Yes | Yes |
| accounts/workspaces/projects | Yes | Yes |
| teamaccounts | Yes | Yes |
| teamaccounts/workspaces | Yes | Yes |
| teamaccounts/workspaces/projects | Yes | Yes |

## Microsoft.MachineLearningModelManagement
| Resource type | Resource group | Subscription |
| ------------- | -------------- | ------------ |
| accounts | Yes | Yes |

## Microsoft.MachineLearningServices
| Resource type | Resource group | Subscription |
| ------------- | -------------- | ------------ |
| workspaces | Yes | Yes |

## Microsoft.ManagedIdentity
| Resource type | Resource group | Subscription |
| ------------- | -------------- | ------------ |
| userassignedidentities | Yes | Yes |

## Microsoft.Maps
| Resource type | Resource group | Subscription |
| ------------- | -------------- | ------------ |
| accounts | Yes | Yes |

## Microsoft.MarketplaceApps
| Resource type | Resource group | Subscription |
| ------------- | -------------- | ------------ |
| classicdevservices | No | No |

## Microsoft.Media
| Resource type | Resource group | Subscription |
| ------------- | -------------- | ------------ |
| mediaservices | Yes | Yes |
| mediaservices/liveevents | Yes | Yes |
| mediaservices/streamingendpoints | Yes | Yes |

## Microsoft.Migrate
| Resource type | Resource group | Subscription |
| ------------- | -------------- | ------------ |
| projects | No | No |

## Microsoft.Network
| Resource type | Resource group | Subscription |
| ------------- | -------------- | ------------ |
| applicationgateways | No | No |
| applicationsecuritygroups	| Yes | Yes |
| azurefirewalls | Yes | Yes |
| connections | Yes | Yes |
| ddosprotectionplans | No | No |
| dnszones | Yes | Yes |
| expressroutecircuits | No | No |
| expressroutecrossconnections | No | No |
| expressroutegateways | No | No |
| expressrouteports	| No | No |
| frontdoors | Yes | Yes |
| frontdoorwebapplicationfirewallpolicies | Yes | Yes |
| interfaceendpoints | No | No |
| loadbalancers	| Yes | Yes |
| localnetworkgateways | Yes | Yes |
| networkintentpolicies	| Yes | Yes |
| networkinterfaces | Yes | Yes |
| networkprofiles | No | No |
| networksecuritygroups	| Yes | Yes |
| networkwatchers | Yes | Yes |
| networkwatchers/connectionmonitors | Yes | Yes |
| networkwatchers/lenses | Yes | Yes |
| networkwatchers/pingmeshes | Yes | Yes |
| publicipaddresses	| Yes | Yes |
| publicipprefixes | Yes | Yes |
| routefilters | No | No |
| routetables | Yes | Yes |
| serviceendpointpolicies | Yes | Yes |
| trafficmanagerprofiles | Yes | Yes |
| virtualhubs | Yes | Yes |
| virtualnetworkgateways | Yes | Yes |
| virtualnetworks | Yes | Yes |
| virtualnetworktaps | No | No |
| virtualwans | Yes | Yes |
| vpngateways | Yes | Yes |
| vpnsites | Yes | Yes |
| webapplicationfirewallpolicies | Yes | Yes |

## Microsoft.NotificationHubs
| Resource type | Resource group | Subscription |
| ------------- | -------------- | ------------ |
| namespaces | Yes | Yes |
| namespaces/notificationhubs | Yes | Yes |

## Microsoft.OperationalInsights
| Resource type | Resource group | Subscription |
| ------------- | -------------- | ------------ |
| workspaces | Yes | Yes |

## Microsoft.OperationsManagement
| Resource type | Resource group | Subscription |
| ------------- | -------------- | ------------ |
| managementconfigurations | Yes | Yes |
| solutions | Yes | Yes |
| views | Yes | Yes |

## Microsoft.Portal
| Resource type | Resource group | Subscription |
| ------------- | -------------- | ------------ |
| dashboards | Yes | Yes |

## Microsoft.PowerBI
| Resource type | Resource group | Subscription |
| ------------- | -------------- | ------------ |
| workspacecollections | Yes | Yes |

## Microsoft.PowerBIDedicated
| Resource type | Resource group | Subscription |
| ------------- | -------------- | ------------ |
| capacities | Yes | Yes |

## Microsoft.RecoveryServices
| Resource type | Resource group | Subscription |
| ------------- | -------------- | ------------ |
| vaults | Yes | Yes |

## Microsoft.Relay
| Resource type | Resource group | Subscription |
| ------------- | -------------- | ------------ |
| namespaces | Yes | Yes |

## Microsoft.SaaS
| Resource type | Resource group | Subscription |
| ------------- | -------------- | ------------ |
| applications | Yes | No |

## Microsoft.Scheduler
| Resource type | Resource group | Subscription |
| ------------- | -------------- | ------------ |
| flows | Yes | Yes |
| jobcollections | Yes | Yes |

## Microsoft.Search
| Resource type | Resource group | Subscription |
| ------------- | -------------- | ------------ |
| searchservices | Yes | Yes |

## Microsoft.ServiceBus
| Resource type | Resource group | Subscription |
| ------------- | -------------- | ------------ |
| namespaces | Yes | Yes |

## Microsoft.ServiceFabric
| Resource type | Resource group | Subscription |
| ------------- | -------------- | ------------ |
| clusters | Yes | Yes |

## Microsoft.ServiceFabricMesh
| Resource type | Resource group | Subscription |
| ------------- | -------------- | ------------ |
| applications | Yes | Yes |
| networks | Yes | Yes |
| volumes | Yes | Yes |

## Microsoft.SignalRService
| Resource type | Resource group | Subscription |
| ------------- | -------------- | ------------ |
| signalr | Yes | Yes |

## Microsoft.SiteRecovery
| Resource type | Resource group | Subscription |
| ------------- | -------------- | ------------ |
| siterecoveryvault | No | No |

## Microsoft.Solutions
| Resource type | Resource group | Subscription |
| ------------- | -------------- | ------------ |
| appliancedefinitions | No | No |
| appliances | No | No |
| applicationdefinitions | No | No |
| applications | No | No |

## Microsoft.Sql
| Resource type | Resource group | Subscription |
| ------------- | -------------- | ------------ |
| managedinstances | Yes | Yes |
| managedinstances/databases | Yes | Yes |
| servers | Yes | Yes |
| servers/databases | Yes | Yes |
| servers/elasticpools | Yes | Yes |
| virtualclusters | Yes | Yes |

## Microsoft.Storage
| Resource type | Resource group | Subscription |
| ------------- | -------------- | ------------ |
| storageaccounts | Yes | Yes |

## Microsoft.StorageSync
| Resource type | Resource group | Subscription |
| ------------- | -------------- | ------------ |
| storagesyncservices | Yes | Yes |

## Microsoft.StorSimple
| Resource type | Resource group | Subscription |
| ------------- | -------------- | ------------ |
| managers | No | No |

## Microsoft.StreamAnalytics
| Resource type | Resource group | Subscription |
| ------------- | -------------- | ------------ |
| streamingjobs | Yes | Yes |

## Microsoft.TimeSeriesInsights
| Resource type | Resource group | Subscription |
| ------------- | -------------- | ------------ |
| environments | Yes | Yes |
| environments/eventsources | Yes | Yes |
| environments/referencedatasets | Yes | Yes |

## microsoft.visualstudio
| Resource type | Resource group | Subscription |
| ------------- | -------------- | ------------ |
| account | Yes | Yes |
| account/extension | Yes | Yes |
| account/project | Yes | Yes |

## Microsoft.Web
| Resource type | Resource group | Subscription |
| ------------- | -------------- | ------------ |
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
| Resource type | Resource group | Subscription |
| ------------- | -------------- | ------------ |
| deviceservices | Yes | Yes |


## Third-party services

Third-party services currently don't support the move operation. These resource providers are:

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

* For commands to move resources, see [Move resources to new resource group or subscription](resource-group-move-resources.md).

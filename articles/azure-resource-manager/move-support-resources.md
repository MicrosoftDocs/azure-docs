---
title: Move operation support by Azure resource type
description: Lists the Azure resource types that can be moved to a new resource group or subscription.
author: tfitzmac
ms.service: azure-resource-manager
ms.topic: reference
ms.date: 03/22/2019
ms.author: tomfitz
---

# Move operation support for resources
This article lists whether an Azure resource type supports the move operation. Although a resource type supports the move operation, there may be conditions that prevent the resource from being moved. For details about conditions that affect move operations, see [Move resources to new resource group or subscription](resource-group-move-resources.md).

To get the same data as a file of comma-separated values, download [move-support-resources.csv](https://github.com/tfitzmac/resource-capabilities/blob/master/move-support-resources.csv).

## Microsoft.AAD
| Resource type | Resource group | Subscription |
| ------------- | ----------- | ---------- |
| domainservices | No | No |

## microsoft.aadiam
| Resource type | Resource group | Subscription |
| ------------- | ----------- | ---------- |
| tenants | No | No |

## Microsoft.AnalysisServices
| Resource type | Resource group | Subscription |
| ------------- | ----------- | ---------- |
| servers | Yes | Yes |

## Microsoft.ApiManagement
| Resource type | Resource group | Subscription |
| ------------- | ----------- | ---------- |
| service | Yes | Yes |

## Microsoft.AppService
| Resource type | Resource group | Subscription |
| ------------- | ----------- | ---------- |
| apiapps | No | No |
| appidentities | No | No |
| gateways | No | No |

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
| blockchainmembers | No | No |

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

## Microsoft.Cdn
| Resource type | Resource group | Subscription |
| ------------- | ----------- | ---------- |
| profiles | Yes | Yes |
| profiles/endpoints | Yes | Yes |

## Microsoft.CertificateRegistration
| Resource type | Resource group | Subscription |
| ------------- | ----------- | ---------- |
| certificateorders | Yes | Yes |

## Microsoft.ClassicCompute
| Resource type | Resource group | Subscription |
| ------------- | ----------- | ---------- |
| domainnames | Yes | No |
| virtualmachines | Yes | No |

## Microsoft.ClassicNetwork
| Resource type | Resource group | Subscription |
| ------------- | ----------- | ---------- |
| networksecuritygroups | No | No |
| reservedips | No | No |
| virtualnetworks | No | No |

## Microsoft.ClassicStorage
| Resource type | Resource group | Subscription |
| ------------- | ----------- | ---------- |
| storageaccounts | Yes | No |

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
| images | Yes | Yes |
| proximityplacementgroups | No | No |
| restorepointcollections | No | No |
| sharedvmimages | No | No |
| sharedvmimages/versions | No | No |
| snapshots | Yes | Yes |
| virtualmachines | Yes | Yes |
| virtualmachines/extensions | Yes | Yes |
| virtualmachinescalesets | Yes | Yes |

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
| registries/replications | No | No |
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

## Microsoft.DeploymentManager
| Resource type | Resource group | Subscription |
| ------------- | ----------- | ---------- |
| artifactsources | No | No |
| rollouts | No | No |
| servicetopologies | No | No |
| servicetopologies/services | No | No |
| servicetopologies/services/serviceunits | No | No |
| steps | No | No |

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
| labs/servicerunners | Yes | Yes |
| labs/virtualmachines | Yes | No |
| schedules | No | No |

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
| scheduledqueryrules | No | No |
| webtests | Yes | Yes |
| workbooks | Yes | Yes |

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
| accounts | Yes | Yes |

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
| accounts | Yes | Yes |
| accounts/workspaces | Yes | Yes |
| accounts/workspaces/projects | Yes | Yes |
| teamaccounts | Yes | Yes |
| teamaccounts/workspaces | Yes | Yes |
| teamaccounts/workspaces/projects | Yes | Yes |

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
| userassignedidentities | Yes | Yes |

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
| frontdoors | Yes | Yes |
| frontdoorwebapplicationfirewallpolicies | Yes | Yes |
| interfaceendpoints | No | No |
| loadbalancers | Yes | Yes |
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
| privatelinkservices | No | No |
| publicipaddresses | Yes | Yes |
| publicipprefixes | Yes | Yes |
| routefilters | No | No |
| routetables | Yes | Yes |
| securegateways | No | No |
| serviceendpointpolicies | Yes | Yes |
| trafficmanagerprofiles | Yes | Yes |
| virtualhubs | No | No |
| virtualnetworkgateways | Yes | Yes |
| virtualnetworks | Yes | Yes |
| virtualnetworktaps | No | No |
| virtualwans | No | No |
| vpngateways | No | No |
| vpnsites | Yes | Yes |
| webapplicationfirewallpolicies | Yes | Yes |

## Microsoft.NotificationHubs
| Resource type | Resource group | Subscription |
| ------------- | ----------- | ---------- |
| namespaces | Yes | Yes |
| namespaces/notificationhubs | Yes | Yes |

## Microsoft.OperationalInsights
| Resource type | Resource group | Subscription |
| ------------- | ----------- | ---------- |
| workspaces | Yes | Yes |

## Microsoft.OperationsManagement
| Resource type | Resource group | Subscription |
| ------------- | ----------- | ---------- |
| managementconfigurations | Yes | Yes |
| solutions | Yes | Yes |
| views | Yes | Yes |

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
| managedinstances | Yes | Yes |
| managedinstances/databases | Yes | Yes |
| servers | Yes | Yes |
| servers/databases | Yes | Yes |
| servers/elasticpools | Yes | Yes |
| servers/jobaccounts | No | No |
| servers/jobagents | No | No |
| virtualclusters | Yes | Yes |

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

## Microsoft.WindowsIoT
| Resource type | Resource group | Subscription |
| ------------- | ----------- | ---------- |
| deviceservices | Yes | Yes |

## Third-party services

Third-party services currently don't support the move operation.

## Next steps
For commands to move resources, see [Move resources to new resource group or subscription](resource-group-move-resources.md).

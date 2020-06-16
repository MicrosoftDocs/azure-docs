---
title: Support for moving Azure resources across regions
description: Lists the Azure resource types that can be moved across Azure regions
author: rayne-wiselman
ms.service: azure-resource-manager
ms.topic: reference
ms.date: 05/31/2020
ms.author: raynew
---

# Support for moving Azure resources across regions

This article confirms whether an Azure resource type is supported for moving to another Azure region. 

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
> - [Microsoft.AzureData](#microsoftazuredata)
> - [Microsoft.AzureStack](#microsoftazurestack)
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
> - [Microsoft.DataShare](#microsoftdatashare)
> - [Microsoft.DBforMariaDB](#microsoftdbformariadb)
> - [Microsoft.DBforMySQL](#microsoftdbformysql)
> - [Microsoft.DBforPostgreSQL](#microsoftdbforpostgresql)
> - [Microsoft.DeploymentManager](#microsoftdeploymentmanager)
> - [Microsoft.Devices](#microsoftdevices)
> - [Microsoft.DevSpaces](#microsoftdevspaces)
> - [Microsoft.DevTestLab](#microsoftdevtestlab)
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
> - [Microsoft.Microservices4Spring](#microsoftmicroservices4spring)
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
> - [Microsoft.ResourceGraph](#microsoftresourcegraph)
> - [Microsoft.SaaS](#microsoftsaas)
> - [Microsoft.Scheduler](#microsoftscheduler)
> - [Microsoft.Search](#microsoftsearch)
> - [Microsoft.Security](#microsoftsecurity)
> - [Microsoft.ServerManagement](#microsoftservermanagement)
> - [Microsoft.ServiceBus](#microsoftservicebus)
> - [Microsoft.ServiceFabric](#microsoftservicefabric)
> - [Microsoft.ServiceFabricMesh](#microsoftservicefabricmesh)
> - [Microsoft.SignalRService](#microsoftsignalrservice)
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

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- | 
> | domainservices | No | 
> | domainservices / replicasets | No | 

## microsoft.aadiam

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- |
> | tenants | No |

## Microsoft.AlertsManagement

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- |
> | actionrules | No | 

## Microsoft.AnalysisServices

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- |
> | servers | No |

## Microsoft.ApiManagement

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- |
> | service |  Yes (using template) <br/><br/> [Move API Management across regions](../../api-management/api-management-howto-migrate.md). | 

## Microsoft.AppConfiguration

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- |
> | configurationstores | No | 

## Microsoft.AppService

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- |
> | apiapps | Yes (using template)<br/><br/> [Move an App Service app to another region](../../app-service/manage-move-across-regions.md) | 
> | appidentities | No | 
> | gateways | No | 


## Microsoft.Authorization

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- |
> | policyassignments | No |

## Microsoft.Automation

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- |
> | automationaccounts | Yes (using template) <br/><br/> [Using geo-replication](../../automation/automation-managing-data.md#geo-replication-in-azure-automation) |  
> | automationaccounts / configurations | No | 
> | automationaccounts / runbooks | No | 



## Microsoft.AzureActiveDirectory

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- |
> | b2cdirectories | No | 

## Microsoft.AzureData

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- |
> | sqlserverregistrations | No |

## Microsoft.AzureStack

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- |
> | registrations | No | 

## Microsoft.Batch

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- |
> | batchaccounts |  Yes (using template)<br/><br/> [Move Batch account across regions](../../batch/best-practices.md#moving-batch-accounts-across-regions) |

## Microsoft.BatchAI

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- |
> | clusters | No | 
> | fileservers | No | 
> | jobs | No | 
> | workspaces | No | 

## Microsoft.BingMaps

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- |
> | mapapis | No | 

## Microsoft.BizTalkServices

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- |
> | biztalk | No | 

## Microsoft.Blockchain

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- |
> | blockchainmembers | No |
> | watchers | No | 

## Microsoft.Blueprint

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- |
> | blueprintassignments | No | 

## Microsoft.BotService

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- |
> | botservices | No | 

## Microsoft.Cache

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- |
> | redis | No | 


## Microsoft.Cdn

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- |
> | cdnwebapplicationfirewallpolicies | No |
> | profiles | No | 
> | profiles / endpoints | No | 

## Microsoft.CertificateRegistration

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- |
> | certificateorders | No | 


## Microsoft.ClassicCompute

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- |
> | domainnames | No |  
> | virtualmachines | No | 



## Microsoft.ClassicNetwork

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- |
> | networksecuritygroups | No |
> | reservedips | No | 
> | virtualnetworks | No | 

## Microsoft.ClassicStorage

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- |
> | storageaccounts | Yes |  


## Microsoft.CognitiveServices

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- |
> | accounts | No | 
> | Cognitive Search | Yes (using template)<br/><br/> [Move your Cognitive Search service to another region](../../search/search-howto-move-across-regions.md)

## Microsoft.Compute

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- |
> | availabilitysets | No | 
> | diskencryptionsets | No | 
> | disks | No | 
> | galleries | No | 
> | galleries / images | No | 
> | galleries / images / versions | No | 
> | hostgroups | No | 
> | hostgroups / hosts | No | 
> | images | No | 
> | proximityplacementgroups | No | 
> | restorepointcollections | No | 
> | sharedvmimages | No | 
> | sharedvmimages / versions | No | 
> | snapshots | No | 
> | virtualmachines | Yes | 
> | virtualmachines / extensions | No | 
> | virtualmachinescalesets | No | 

## Microsoft.Container

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- |
> | containergroups | No | 

## Microsoft.ContainerInstance

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- |
> | containergroups | No | 

## Microsoft.ContainerRegistry

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- |
> | registries | No |  
> | registries / buildtasks | No |  
> | registries / replications | No | 
> | registries / tasks | No |  
> | registries / webhooks | No | 

## Microsoft.ContainerService

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- |
> | containerservices | No | 
> | managedclusters | No | 
> | openshiftmanagedclusters | No | 

## Microsoft.ContentModerator

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- |
> | applications | No | 

## Microsoft.CortanaAnalytics

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- |
> | accounts | No | 

## Microsoft.CostManagement

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- |
> | connectors | No |  

## Microsoft.CustomerInsights

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- |
> | hubs | No |  

## Microsoft.CustomProviders

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- |
> | resourceproviders | No | 

## Microsoft.DataBox

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- |
> | jobs | No | 

## Microsoft.DataBoxEdge

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- |
> | databoxedgedevices | No | 

## Microsoft.Databricks

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- |
> | workspaces | No | 

## Microsoft.DataCatalog

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- |
> | catalogs | No | 
> | datacatalogs | No | 

## Microsoft.DataConnect

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- |
> | connectionmanagers | No | 

## Microsoft.DataExchange

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- |
> | packages | No | 
> | plans | No | 

## Microsoft.DataFactory

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- |
> | datafactories | No | 
> | factories | No |  

## Microsoft.DataLake

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- |
> | datalakeaccounts | No | 

## Microsoft.DataLakeAnalytics

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- |
> | accounts | No | 

## Microsoft.DataLakeStore

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- |
> | accounts | No | 

## Microsoft.DataMigration

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- |
> | services | No | 
> | services / projects | No | 
> | slots | No | 

## Microsoft.DataShare

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- |
> | accounts | No | 

## Microsoft.DBforMariaDB

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- |
> | servers | No |  

## Microsoft.DBforMySQL

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- |
> | servers | No |  

## Microsoft.DBforPostgreSQL

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- |
> | servergroups | No | 
> | servers | No |  
> | serversv2 | No | 

## Microsoft.DeploymentManager

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- |
> | artifactsources | No | 
> | rollouts | No |  
> | servicetopologies | No | 
> | servicetopologies / services | No |  
> | servicetopologies / services / serviceunits | No | 
> | steps | No | 

## Microsoft.Devices

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- |
> | elasticpools | No | 
> | elasticpools / iothubtenants | No | 
> | iothubs | Yes | 
> | provisioningservices | No | 

## Microsoft.DevSpaces

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- |
> | controllers | No | 
> | AKS cluster | No<br/><br/> [Learn more](../../dev-spaces/faq.md#can-i-migrate-my-aks-cluster-with-azure-dev-spaces-to-another-region) about moving to another region.

## Microsoft.DevTestLab

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- |
> | labcenters | No | 
> | labs | No | 
> | labs / environments | No |  
> | labs / servicerunners | No | 
> | labs / virtualmachines | No |  
> | schedules | No |  

## Microsoft.DocumentDB

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- |
> | databaseaccounts | No | 

## Microsoft.DomainRegistration

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- |
> | domains | No | 

## Microsoft.EnterpriseKnowledgeGraph

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- |
> | services | No |  

## Microsoft.EventGrid

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- |
> | domains | No |  
> | topics | No | 

## Microsoft.EventHub

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- |
> | clusters | No |  
> | namespaces | Yes (with template)<br/><br/> [Move an Event Hub namespace to another region](../../event-hubs/move-across-regions.md) | 

## Microsoft.Genomics

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- |
> | accounts | No | 

## Microsoft.HanaOnAzure

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- |
> | hanainstances | No | 
> | sapmonitors | No |  

## Microsoft.HDInsight

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- |
> | clusters | No | 

## Microsoft.HealthcareApis

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- |
> | services | No |  

## Microsoft.HybridCompute

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- |
> | machines | No | 

## Microsoft.HybridData

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- |
> | datamanagers |  No | 

## Microsoft.ImportExport

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- |
> | jobs |  No | 

## microsoft.insights

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- |
> | accounts | No | 
> | actiongroups |  No | 
> | activitylogalerts | No | 
> | alertrules |  No | 
> | autoscalesettings |  No | 
> | components |  No |  
> | guestdiagnosticsettings | No | 
> | metricalerts | No | 
> | notificationgroups | No | 
> | notificationrules | No | 
> | scheduledqueryrules |  No | 
> | webtests |  No | 
> | workbooks |  No |  


## Microsoft.IoTCentral

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- |
> | checknameavailability |  No
> | graph | No

## Microsoft.IoTHub

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- |
> |  iothub |  Yes (clone hub) <br/><br/> [Clone an IoT hub to another region](../../iot-hub/iot-hub-how-to-clone.md)

## Microsoft.IoTSpaces

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- |
> | checknameavailability |  No |  
> | graph |  No | 

## Microsoft.KeyVault

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- |
> | hsmpools | No | 
> | vaults |  No | 


## Microsoft.Kusto

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- |
> | clusters |  No |  

## Microsoft.LabServices

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- |
> | labaccounts | No | 

## Microsoft.LocationBasedServices

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- |
> | accounts | No | 

## Microsoft.LocationServices

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- |
> | accounts | No | 

## Microsoft.Logic

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- |
> | hostingenvironments | No | 
> | integrationaccounts |  No |  
> | integrationserviceenvironments | No | 
> | isolatedenvironments | No | 
> | workflows |  No |  

## Microsoft.MachineLearning

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- |
> | commitmentplans |  No | 
> | webservices |  No | 
> | workspaces |  No | 

## Microsoft.MachineLearningCompute

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- |
> | operationalizationclusters |  No | 

## Microsoft.MachineLearningExperimentation

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- |
> | accounts | No | 
> | accounts / workspaces | No | 
> | accounts / workspaces / projects | No | 
> | teamaccounts | No | 
> | teamaccounts / workspaces | No | 
> | teamaccounts / workspaces / projects | No | 

## Microsoft.MachineLearningModelManagement

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- |
> | accounts | No | 

## Microsoft.MachineLearningOperationalization

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- |
> | hostingaccounts | No | 

## Microsoft.MachineLearningServices

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- |
> | workspaces | No | 

## Microsoft.ManagedIdentity

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- |
> | userassignedidentities | No | 

## Microsoft.Maps

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- |
> | accounts |  No |  

## Microsoft.MarketplaceApps

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- |
> | classicdevservices | No | 

## Microsoft.Media

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- |
> | mediaservices |  No | 
> | mediaservices / liveevents |  No | 
> | mediaservices / streamingendpoints |  No | 

## Microsoft.Microservices4Spring

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- |
> | appclusters | No | 

## Microsoft.Migrate

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- |
> | assessmentprojects | No | 
> | migrateprojects | No | 
> | projects | No | 

## Microsoft.NetApp

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- |
> | netappaccounts | No | 
> | netappaccounts / capacitypools | No | 
> | netappaccounts / capacitypools / volumes | No | 
> | netappaccounts / capacitypools / volumes / mounttargets | No | 
> | netappaccounts / capacitypools / volumes / snapshots | No | 

## Microsoft.Network

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- |
> | applicationgateways | No | 
> | applicationgatewaywebapplicationfirewallpolicies | No | 
> | applicationsecuritygroups |  No |  
> | azurefirewalls |  No |  
> | bastionhosts | No | 
> | connections |  No | 
> | ddoscustompolicies |  No | 
> | ddosprotectionplans | No | 
> | dnszones |  No | 
> | expressroutecircuits | No | 
> | expressroutecrossconnections | No | 
> | expressroutegateways | No | 
> | expressrouteports | No | 
> | frontdoors | No | 
> | frontdoorwebapplicationfirewallpolicies | No | 
> | loadbalancers | Yes <br/><br/> You can export the existing configuration as a template, and deploy the template in the new region. Learn how to move an [external](../..//load-balancer/move-across-regions-external-load-balancer-portal.md) or [internal](../../load-balancer/move-across-regions-internal-load-balancer-portal.md) load balancer. |
> | localnetworkgateways |  No | 
> | natgateways |  No | 
> | networkintentpolicies |  No | 
> | networkinterfaces | Yes | 
> | networkprofiles | No | 
> | networksecuritygroups | Yes | 
> | networkwatchers |  No |  
> | networkwatchers / connectionmonitors |  No | 
> | networkwatchers / lenses |  No | 
> | networkwatchers / pingmeshes |  No | 
> | p2svpngateways | No | 
> | privatednszones |  No |  
> | privatednszones / virtualnetworklinks |  No |  
> | privateendpoints | No | 
> | privatelinkservices | No | 
> | publicipaddresses | Yes<br/><br/> You can export the existing public IP address configuration as a template, and deploy the template in the new region. [Learn more](../../virtual-network/move-across-regions-publicip-portal.md) about moving a public IP address. |
> | publicipprefixes | No | 
> | routefilters | No | 
> | routetables |  No | 
> | serviceendpointpolicies |  No | 
> | trafficmanagerprofiles |  No | 
> | virtualhubs | No | 
> | virtualnetworkgateways |  No |  
> | virtualnetworks |  No | 
> | virtualnetworktaps | No | 
> | virtualwans | No | 
> | vpngateways (Virtual WAN) | No | 
> | vpnsites (Virtual WAN) | No | 
> | webapplicationfirewallpolicies |  No | 


## Microsoft.NotificationHubs

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- |
> | namespaces |  No | 
> | namespaces / notificationhubs |  No |  

## Microsoft.OperationalInsights

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- |
> | workspaces |  No | 



## Microsoft.OperationsManagement

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- |
> | managementconfigurations |  No | 
> | views |  No | 

## Microsoft.Peering

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- |
> | peerings | No | 

## Microsoft.Portal

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- |
> | dashboards | No | 

## Microsoft.PortalSdk

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- |
> | rootresources | No | 

## Microsoft.PowerBI

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- |
> | workspacecollections |  No | 

## Microsoft.PowerBIDedicated

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- |
> | capacities |  No | 

## Microsoft.ProjectOxford

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- |
> | accounts | No | 

## Microsoft.RecoveryServices

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- |
> | vaults | No. [Disable vault and recreate](https://docs.microsoft.com/azure/site-recovery/move-vaults-across-regions) for Site Recovery  | 


## Microsoft.Relay

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- |
> | namespaces |  No | 

## Microsoft.ResourceGraph

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- |
> | queries |  No |  

## Microsoft.SaaS

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- |
> | applications |  No | 

## Microsoft.Scheduler

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- |
> | flows |  No |  
> | jobcollections |  No | 

## Microsoft.Search

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- |
> | searchservices |  No | 


## Microsoft.Security

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- |
> | iotsecuritysolutions |  No | 
> | playbookconfigurations | No | 

## Microsoft.ServerManagement

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- |
> | gateways | No | 
> | nodes | No | 

## Microsoft.ServiceBus

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- |
> | namespaces |  No | 

## Microsoft.ServiceFabric

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- |
> | applications | No | 
> | clusters |  No | 
> | clusters / applications | No | 
> | containergroups | No | 
> | containergroupsets | No | 
> | edgeclusters | No | 
> | networks | No | 
> | secretstores | No | 
> | volumes | No | 

## Microsoft.ServiceFabricMesh

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- |
> | applications |  No | 
> | containergroups | No | 
> | gateways |  No | 
> | networks |  No | 
> | secrets |  No | 
> | volumes |  No |  

## Microsoft.SignalRService

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- |
> | signalr |  No |  

## Microsoft.Solutions

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- |
> | appliancedefinitions | No | 
> | appliances | No | 
> | applicationdefinitions | No | 
> | applications | No | 
> | jitrequests | No | 

## Microsoft.Sql

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- |
> | instancepools | No | 
> | managedinstances | Yes | 
> | managedinstances / databases | Yes | 
> | servers | Yes | 
> | servers / databases | Yes | 
> | servers / elasticpools | Yes | 
> | virtualclusters | Yes | 

## Microsoft.SqlVirtualMachine

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- |
> | sqlvirtualmachinegroups |  No |  
> | sqlvirtualmachines |  No |  

## Microsoft.SqlVM

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- |
> | dwvm | No | 

## Microsoft.Storage

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- |
> | storageaccounts | Yes<br/><br/> [Move an Azure Storage account to another region](../../storage/common/storage-account-move.md) | 

## Microsoft.StorageCache

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- |
> | caches | No | 

## Microsoft.StorageSync

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- |
> | storagesyncservices |  No | 

## Microsoft.StorageSyncDev

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- |
> | storagesyncservices | No | 

## Microsoft.StorageSyncInt

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- |
> | storagesyncservices | No | 

## Microsoft.StorSimple

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- |
> | managers | No | 

## Microsoft.StreamAnalytics

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- |
> | streamingjobs |  No |  


## Microsoft.StreamAnalyticsExplorer

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- |
> | environments | No | 
> | environments / eventsources | No | 
> | instances | No | 
> | instances / environments | No | 
> | instances / environments / eventsources | No | 

## Microsoft.TerraformOSS

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- |
> | providerregistrations | No | 
> | resources | No | 

## Microsoft.TimeSeriesInsights

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- |
> | environments |  No | 
> | environments / eventsources |  No |  
> | environments / referencedatasets |  No | 

## Microsoft.Token

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- |
> | stores | No | 

## Microsoft.VirtualMachineImages

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- |
> | imagetemplates | No | 

## microsoft.visualstudio

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- |
> | account |  No | 
> | account / extension |  No | 
> | account / project |  No | 



## Microsoft.VMwareCloudSimple

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- |
> | dedicatedcloudnodes | No | 
> | dedicatedcloudservices | No | 
> | virtualmachines | No | 

## Microsoft.Web

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- |
> | certificates | No | 
> | connectiongateways |  No |  
> | connections |  No |  
> | customapis |  No | 
> | hostingenvironments | No | 
> | serverfarms |  No |  
> | sites |  No | 
> | sites / premieraddons |  No |  
> | sites / slots |  No |  


## Microsoft.WindowsIoT

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- |
> | deviceservices | No | 

## Microsoft.WindowsVirtualDesktop

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- |
> | applicationgroups | No | 
> | hostpools | No | 
> | workspaces | No | 

## Third-party services

Third-party services currently don't support the move operation.

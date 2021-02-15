---
title: Support for moving Azure resources across regions
description: Lists the Azure resource types that can be moved across Azure regions
author: rayne-wiselman
ms.service: azure-resource-manager
ms.topic: reference
ms.date: 08/25/2020
ms.author: raynew
---

# Support for moving Azure resources across regions

This article confirms whether an Azure resource type is supported for moving to another Azure region. 

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
> - [Microsoft.Purview](#microsoftpurview)
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
> | Resource type | Region move | 
> | ------------- | ----------- |
> | domainservices | No | 


## microsoft.aadiam

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- |
> | diagnosticsettings | No |
> | diagnosticsettingscategories | No |
> | privatelinkforazuread | No |
> | tenants |  No |

## microsoft.Addons

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- |
> | supportproviders | No |

## Microsoft.ADHybridHealthService

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
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
> | Resource type | Region move | 
> | ------------- | ----------- | 
> | configurations | No | 
> | generaterecommendations | No |
> | metadata | No |
> | recommendations | No |
> | suppressions | No | 

## Microsoft.AlertsManagement

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- |
> | actionrules | No | 
> | alerts | No | 
> | alertslist | No | 
> | alertsmetadata | No | 
> | alertssummary | No | 
> | alertssummarylist | No | 
> | smartdetectoralertrules | No | 
> | smartgroups | No | 

## Microsoft.AnalysisServices

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- |
> | servers | No |

## Microsoft.ApiManagement

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- |
> | reportfeedback | No |
> | service |  Yes (using template) <br/><br/> [Move API Management across regions](../../api-management/api-management-howto-migrate.md). | 

## Microsoft.AppConfiguration

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- |
> | configurationstores | No | 
> | configurationstores / eventgridfilters | No |

## Microsoft.AppPlatform

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- | 
> | spring | No | 

## Microsoft.AppService

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- |
> | apiapps | Yes (using template)<br/><br/> [Move an App Service app to another region](../../app-service/manage-move-across-regions.md) | 
> | appidentities | No | 
> | gateways | No | 

## Microsoft.Attestation

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- | 
> | attestationproviders | No | 

## Microsoft.Authorization

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- |
> | classicadministrators | No | 
> | dataaliases | No | 
> | denyassignments | No | 
> | elevateaccess | No | 
> | findorphanroleassignments | No | 
> | locks | No | 
> | permissions | No | 
> | policyassignments | No | 
> | policydefinitions | No | 
> | policysetdefinitions | No | 
> | privatelinkassociations | No | 
> | resourcemanagementprivatelinks | No | 
> | roleassignments | No | 
> | roleassignmentsusagemetrics | No | 
> | roledefinitions | No | 

## Microsoft.Automation

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- |
> | automationaccounts | Yes (using template) <br/><br/> [Using geo-replication](../../automation/automation-managing-data.md#geo-replication-in-azure-automation) |  
> | automationaccounts / configurations | No | 
> | automationaccounts / runbooks | No | 

## Microsoft.AVS

> [!div class="mx-tableFixed"]
> | Resource type | Region move | Subscription |
> | ------------- | ----------- | 
> | privateclouds | No | 


## Microsoft.AzureActiveDirectory

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- |
> | b2cdirectories | No | 
> | b2ctenants | No | 

## Microsoft.AzureData

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- |
> | datacontrollers | No | 
> | hybriddatamanagers | No | 
> | postgresinstances | No | 
> | sqlinstances | No | 
> | sqlmanagedinstances | No |
> | sqlserverinstances | No | 
> | sqlserverregistrations | No |

## Microsoft.AzureStack

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- |
> | cloudmanifestfiles | No |
> | registrations | No | 

## Microsoft.AzureStackHCI

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- | 
> | clusters | No | 

## Microsoft.Batch

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- |
> | batchaccounts |  Batch accounts can't be moved directly from one region to another, but you can use a template to export a template, modify it, and deploy the template to the new region. <br/><br/> Learn about [moving a Batch account across regions](../../batch/best-practices.md#moving-batch-accounts-across-regions) |

## Microsoft.Billing

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- | 
> | billingaccounts | No | 
> | billingperiods | No | 
> | billingpermissions | No | 
> | billingproperty | No | 
> | billingroleassignments | No | 
> | billingroledefinitions | No | 
> | departments | No | 
> | enrollmentaccounts | No | 
> | invoices | No | 
> | transfers | No | 

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
> | blockchainmembers | No <br/><br/> The blockchain network can't have nodes in different regions. 
> | cordamembers | No |
> | watchers | No | 

## Microsoft.BlockchainTokens

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- |
> | tokenservices | No |


## Microsoft.Blueprint

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- |
> | blueprintassignments | No | 
> | blueprints | No |

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
> | redisenterprise | No | 

## Microsoft.Capacity

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- | 
> | appliedreservations | No | 
> | calculateexchange | No | 
> | calculateprice | No | 
> | calculatepurchaseprice | No | 
> | catalogs | No | 
> | commercialreservationorders | No | 
> | exchange | No |
> | reservationorders | No | 
> | reservations | No | 
> | resources | No | 
> | validatereservationorder | No | 

## Microsoft.Cdn

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- |
> | cdnwebapplicationfirewallpolicies | No |
> | edgenodes | No
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
> | capabilities | No | 
> | domainnames | Yes | No |
> | quotas | No | 
> | resourcetypes | No |
> | validatesubscriptionmoveavailability | No | 
> | virtualmachines | No 

## Microsoft.ClassicInfrastructureMigrate

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- | 
> | classicinfrastructureresources | No | 

## Microsoft.ClassicNetwork

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- |
> | capabilities | No | 
> | expressroutecrossconnections | No | 
> | expressroutecrossconnections / peerings | No | 
> | gatewaysupporteddevices | No | 
> | networksecuritygroups | No |
> | quotas | No |
> | reservedips | No | 
> | virtualnetworks | No | 

## Microsoft.ClassicStorage

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- |
> | disks | No | 
> | images | No | 
> | osimages | No | 
> | osplatformimages | No | 
> | publicimages | No | 
> | quotas | No | 
> | storageaccounts | Yes |  
> | vmimages | No |

## Microsoft.ClassicSubscription

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- | 
> | operations | No | 

## Microsoft.CognitiveServices

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- |
> | accounts | No | 
> | Cognitive Search | Supported with manual steps.<br/><br/> Learn about [moving your Azure Cognitive Search service to another region](../../search/search-howto-move-across-regions.md)

## Microsoft.Commerce

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- | 
> | ratecard | No | 
> | usageaggregates | No | 

## Microsoft.Compute

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- |
> | availabilitysets | Yes <br/><br/> Use [Azure Resource Mover](../../resource-mover/tutorial-move-region-virtual-machines.md) to move availability sets. | 
> | diskaccesses | No |
> | diskencryptionsets | No | 
> | disks | Yes <br/><br/> Use [Azure Resource Mover](../../resource-mover/tutorial-move-region-virtual-machines.md) to move Azure VMs and related disks. | 
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
> | sshpublickeys | No |
> | virtualmachines | Yes <br/><br/> Use [Azure Resource Mover](../../resource-mover/tutorial-move-region-virtual-machines.md) to move Azure VMs. | 
> | virtualmachines / extensions | No | 
> | virtualmachinescalesets | No | 

## Microsoft.Consumption

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- | 
> | aggregatedcost | No | 
> | balances | No | 
> | budgets | No | 
> | charges | No | 
> | costtags | No | 
> | credits | No | 
> | events | No | 
> | forecasts | No | 
> | lots | No | 
> | marketplaces | No | 
> | pricesheets | No | 
> | products | No | 
> | reservationdetails | No | 
> | reservationrecommendationdetails | No | 
> | reservationrecommendations | No | 
> | reservationsummaries | No | 
> | reservationtransactions | No | 
> | tags | No | 
> | tenants | No | 
> | terms | No | 
> | usagedetails | No | 


## Microsoft.ContainerInstance

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- |
> | containergroups | No | 
> | serviceassociationlinks | No |


## Microsoft.ContainerRegistry

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- |
> | registries | No |  
> | registries / agentpools | No | 
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
> | alerts | No | 
> | billingaccounts | No | 
> | budgets | No | 
> | cloudconnectors | No | 
> | connectors | No | 
> | departments | No | 
> | dimensions | No | 
> | enrollmentaccounts | No | 
> | exports | No | 
> | externalbillingaccounts | No | 
> | forecast | No | 
> | query | No | 
> | register | No | 
> | reportconfigs | No | 
> | reports | No | 
> | settings | No | 
> | showbackrules | No | 
> | views | No | 

## Microsoft.CustomerInsights

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- |
> | hubs | No |  

## Microsoft.CustomerLockbox

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- | 
> | requests | No | 

## Microsoft.CustomProviders

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- |
> | associations | No |
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
> | availableskus | No |
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

## Microsoft.DataProtection

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- | ---------- |
> | backupvaults | No | 

## Microsoft.DataShare

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- |
> | accounts | No | 

## Microsoft.DBforMariaDB

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- |
> | servers | You can use a cross-region read replica to move an existing server. [Learn more](../../postgresql/howto-move-regions-portal.md).<br/><br/> If the service is provisioned with geo-redundant backup storage, you can use geo-restore to restore in other regions. [Learn more](../../mariadb/concepts-business-continuity.md#recover-from-an-azure-regional-data-center-outage).

## Microsoft.DBforMySQL

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- |
> | servers | You can use a cross-region read replica to move an existing server. [Learn more](../../mysql/howto-move-regions-portal.md).

## Microsoft.DBforPostgreSQL

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- |
> | servergroups | No | 
> | servers | You can use a cross-region read replica to move an existing server. [Learn-more](../../postgresql/howto-move-regions-portal.md).
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


## Microsoft.DesktopVirtualization

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- | 
> | applicationgroups | No | 
> | workspaces | No | 

## Microsoft.Devices

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- |
> | elasticpools | No. Resource isn't exposed.
> | elasticpools / iothubtenants | No. Resource isn't exposed.
> | iothubs | Yes. [Learn more](../../iot-hub/iot-hub-how-to-clone.md)
> | provisioningservices | No | 

## Microsoft.DevOps

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- |
> | controllers | No | 


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

## Microsoft.DigitalTwins

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- | 
> | digitaltwinsinstances | Yes, by recreating resources in new region. [Learn more](../../digital-twins/how-to-move-regions.md) |

## Microsoft.DocumentDB

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- |
> | databaseaccounts | No | 
> | databaseaccounts | No | 

## Microsoft.DomainRegistration

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- |
> | domains | No | 
> | generatessorequest | No | 
> | topleveldomains | No | 
> | validatedomainregistrationinformation | No |

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
> | eventsubscriptions | No |
> | extensiontopics | No | 
> | partnernamespaces | No | 
> | partnerregistrations | No | 
> | partnertopics | No | 
> | systemtopics | No | 
> | topics | No | 
> | topictypes | No | 

## Microsoft.EventHub

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- |
> | clusters | No |  
> | namespaces | Yes (with template)<br/><br/> [Move an Event Hub namespace to another region](../../event-hubs/move-across-regions.md) | 
> | sku | No |  

## Microsoft.Experimentation

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- | 
> | experimentworkspaces | No | 

## Microsoft.Falcon

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- | 
> | namespaces | No | 

## Microsoft.Features

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- | 
> | featureproviders | No | 
> | features | No | 
> | providers | No | 
> | subscriptionfeatureregistrations | No | 

## Microsoft.Genomics

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- |
> | accounts | No | 

## Microsoft.GuestConfiguration

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- | 
> | automanagedaccounts | No | 
> | automanagedvmconfigurationprofiles | No | 
> | guestconfigurationassignments | No | 
> | software | No | 
> | softwareupdateprofile | No | 
> | softwareupdates | No | 

## Microsoft.HanaOnAzure

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- |
> | hanainstances | No | 
> | sapmonitors | No |  

## Microsoft.HardwareSecurityModules

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- | 
> | dedicatedhsms | No | 


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
> | machines / extensions | No |

## Microsoft.HybridData

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- |
> | datamanagers |  No | 

## Microsoft.HybridNetwork

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- | 
> | devices | No | 
> | vnfs | No | 

## Microsoft.Hydra

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- | 
> | components | No | 
> | networkscopes | No | 

## Microsoft.ImportExport

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- |
> | jobs |  No | 

## microsoft.insights

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- |
> | accounts | No. [Learn more](../../azure-monitor/faq.md#how-do-i-move-an-application-insights-resource-to-a-new-region).
> | actiongroups |  No | 
> | activitylogalerts | No | 
> | alertrules |  No | 
> | autoscalesettings |  No | 
> | baseline | No |
> | components |  No |  
> | datacollectionrules | No | 
> | diagnosticsettings | No | 
> | diagnosticsettingscategories | No | 
> | eventcategories | No | 
> | eventtypes | No | 
> | extendeddiagnosticsettings | No | |
> | guestdiagnosticsettings | No | 
> | listmigrationdate | No | 
> | logdefinitions | No | 
> | logprofiles | No | 
> | logs | No | No |
> | metricalerts | No | 
> | metricbaselines | No | 
> | metricbatch | No | 
> | metricdefinitions | No | 
> | metricnamespaces | No | 
> | metrics | No | 
> | migratealertrules | No |
> | migratetonewpricingmodel | No | 
> | myworkbooks | No |
> | notificationgroups | No | 
> | privatelinkscopes | No |
> | rollbacktolegacypricingmodel | No |
> | scheduledqueryrules |  No | 
> | topology | No |
> | transactions | No |
> | vminsightsonboardingstatuses | No |
> | webtests |  No | 
> | webtests / gettestresultfile | No |
> | workbooks |  No |  
> | workbooktemplates | No |


## Microsoft.IoTCentral

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- |
> | apptemplates | No | 
> | iotapps | No | 



## Microsoft.IoTHub

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- |
> |  iothub |  Yes (clone hub) <br/><br/> [Clone an IoT hub to another region](../../iot-hub/iot-hub-how-to-clone.md)

## Microsoft.IoTSpaces

> [!div class="mx-tableFixed"]
> | Resource type | Region Move |
> | ------------- | ----------- | 
> | graph | No | 

## Microsoft.KeyVault

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- |
> | deletedvaults | No |
> | hsmpools | No | 
> | managedhsms | No |
> | vaults |  No | 

## Microsoft.Kubernetes

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- | 
> | connectedclusters | No | 
> | registeredsubscriptions | No | 

## Microsoft.KubernetesConfiguration

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- | 
> | sourcecontrolconfigurations | No | 

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
> | users | No | 

## Microsoft.LocationBasedServices

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- |
> | accounts | No | 

## Microsoft.LocationServices

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- |
> | accounts | No, it's a global service.

## Microsoft.Logic

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- |
> | hostingenvironments | No | 
> | integrationaccounts |  No |  
> | integrationserviceenvironments | No | 
> | integrationserviceenvironments / managedapis | No |
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
> | teamaccounts | No | 


## Microsoft.MachineLearningModelManagement

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- |
> | accounts | No | 


## Microsoft.MachineLearningServices

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- |
> | workspaces | No | 

## Microsoft.Maintenance

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- |
> | configurationassignments | Yes. [Learn more](../../virtual-machines/move-region-maintenance-configuration.md) | 
> | maintenanceconfigurations | Yes. [Learn more](../../virtual-machines/move-region-maintenance-configuration-resources.md) |
> | updates | No | 

## Microsoft.ManagedIdentity

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- |
> | identities | No | 
> | userassignedidentities | No | 

## Microsoft.ManagedNetwork

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- | 
> | managednetworks | No | 
> | managednetworks / managednetworkgroups | No |
> | managednetworks / managednetworkpeeringpolicies | No | 
> | notification | No | 

## Microsoft.ManagedServices

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- | 
> | marketplaceregistrationdefinitions | No | 
> | registrationassignments | No |
> | registrationdefinitions | No | 

## Microsoft.Management

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- | 
> | getentities | No | 
> | managementgroups | No | 
> | managementgroups / settings | No | 
> | resources | No | 
> | starttenantbackfill | No | 
> | tenantbackfillstatus | No | 

## Microsoft.Maps

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- |
> | accounts |  No, Azure Maps is a geospatial service. 
> | accounts / privateatlases | No

## Microsoft.Marketplace

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- |
> | offers | No | 
> | offertypes | No | 
> | privategalleryitems | No | 
> | privatestoreclient | No | 
> | privatestores | No | 
> | products | No | 
> | publishers | No | 
> | register | No | 

## Microsoft.MarketplaceApps

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- | 
> | classicdevservices | No | 

## Microsoft.MarketplaceOrdering

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- | 
> | agreements | No | 
> | offertypes | No | 

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
> | movecollections | No
> | projects | No | 

## Microsoft.MixedReality

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- | ---------- |
> | holographicsbroadcastaccounts | No | 
> | objectunderstandingaccounts | No | 
> | remoterenderingaccounts | No | 
> | spatialanchorsaccounts | No | 

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
> | bgpservicecommunities | No |
> | connections |  No | 
> | ddoscustompolicies |  No | 
> | ddosprotectionplans | No | 
> | dnszones |  No | 
> | expressroutecircuits | No | 
> | expressroutegateways | No | 
> | expressrouteserviceproviders | No | 
> | firewallpolicies | No |
> | frontdoors | No | 
> | ipallocations | No |
> | ipgroups | No |
> | loadbalancers | Yes <br/><br/> Use [Azure Resource Mover](../../resource-mover/tutorial-move-region-virtual-machines.md) to move internal and external load balancers. |
> | localnetworkgateways |  No | 
> | natgateways |  No | 
> | networkexperimentprofiles | No |
> | networkintentpolicies |  No | 
> | networkinterfaces | Yes <br/><br/> Use [Azure Resource Mover](../../resource-mover/tutorial-move-region-virtual-machines.md) to move NICs. | 
> | networkprofiles | No | 
> | networksecuritygroups | Yes <br/><br/> Use [Azure Resource Mover](../../resource-mover/tutorial-move-region-virtual-machines.md) to move network security groups (NGSs). | 
> | networkwatchers |  No |  
> | networkwatchers / connectionmonitors |  No | 
> | networkwatchers / flowlogs |  No | 
> | networkwatchers / pingmeshes |  No | 
> | p2svpngateways | No | 
> | privatednszones |  No |  
> | privatednszones / virtualnetworklinks | No |> | privatednszonesinternal | No |
> | privateendpointredirectmaps | No |
> | privateendpoints | No | 
> | privatelinkservices | No | 
> | publicipaddresses | Yes<br/><br/> Use [Azure Resource Mover](../../resource-mover/tutorial-move-region-virtual-machines.md) to move public IP addresses. |
> | publicipprefixes | No | 
> | routefilters | No | 
> | routetables |  No | 
> | securitypartnerproviders | No |
> | serviceendpointpolicies |  No | 
> | trafficmanagergeographichierarchies | No | 
> | trafficmanagerprofiles |  No | 
> | trafficmanagerusermetricskeys | No |
> | virtualhubs | No | 
> | virtualnetworkgateways |  No |  
> | virtualnetworks |  No | 
> | virtualnetworktaps | No | 
> | virtualwans | No | 
> | vpngateways (Virtual WAN) | No | 
> | vpnsites (Virtual WAN) | No | 
> | vpnsites (Virtual WAN) | No |


## Microsoft.NotificationHubs

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- |
> | namespaces |  No | 
> | namespaces / notificationhubs |  No |  

## Microsoft.ObjectStore

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- | 
> | osnamespaces | No | 

## Microsoft.OffAzure

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- | 
> | hypervsites | No | 
> | importsites | No | 
> | serversites | No | 
> | vmwaresites | No | 

## Microsoft.OperationalInsights

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- |
> | clusters | No | 
> | deletedworkspaces | No | 
> | linktargets | No | 
> | storageinsightconfigs | No |
> | workspaces | No |



## Microsoft.OperationsManagement

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- |
> | managementassociations | No |
> | managementconfigurations |  No | 
> | solutions | No |
> | views |  No | 

## Microsoft.Peering

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- |
> | legacypeerings | No | 
> | peerasns | No | 
> | peeringlocations | No | 
> | peerings | No | 
> | peeringservicecountries | No | 
> | peeringservicelocations | No | 
> | peeringserviceproviders | No | 
> | peeringservices | No | 

## Microsoft.PolicyInsights

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- | 
> | policyevents | No | 
> | policystates | No | 
> | policytrackedresources | No | 
> | remediations | No | 

## Microsoft.Portal

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- |
> | consoles | No |
> | dashboards | No | 
> | usersettings | No | 


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

## Microsoft.Purview

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- |
> | accounts | No | 

## Microsoft.ProviderHub

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- | 
> | availableaccounts | No | 
> | providerregistrations | No | 
> | rollouts | No | 

## Microsoft.Quantum

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- | 
> | workspaces | No | 

## Microsoft.RecoveryServices

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- |
> | replicationeligibilityresults | No |
> | vaults | No.<br/><br/> Moving Recovery Services vaults for Azure Backup across Azure regions isn't supported.<br/><br/> In Recovery Services vaults for Azure Site Recovery, you can [disable and recreate the vault](../../site-recovery/move-vaults-across-regions.md) in the target region. | 

## Microsoft.RedHatOpenShift

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- | 
> | openshiftclusters | No | 

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
> | resourcechangedetails | No | 
> | resourcechanges | No | 
> | resources | No | 
> | resourceshistory | No | 
> | subscriptionsstatus | No | 

## Microsoft.ResourceHealth

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- | 
> | childresources | No | 
> | emergingissues | No | 
> | events | No | 
> | metadata | No | 
> | notifications | No | 

## Microsoft.Resources

> [!div class="mx-tableFixed"]
> | Resource type | Region move |
> | ------------- | ----------- |
> | deploymentScripts |  Yes<br/><br/>[Move Microsoft.Resources resources to new region](microsoft-resources-move-regions.md) |
> | templateSpecs |  Yes<br/><br/>[Move Microsoft.Resources resources to new region](microsoft-resources-move-regions.md) |  

## Microsoft.SaaS

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- |
> | applications |  No | 
> | saasresources | No | 


## Microsoft.Search

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- |
> | resourcehealthmetadata | No |
> | searchservices |  No | 


## Microsoft.Security

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- |
> | adaptivenetworkhardenings | No | 
> | advancedthreatprotectionsettings | No | 
> | alerts | No | 
> | allowedconnections | No | 
> | applicationwhitelistings | No | 
> | assessmentmetadata | No | 
> | assessments | No | 
> | autodismissalertsrules | No | 
> | automations | No | 
> | autoprovisioningsettings | No |
> | complianceresults | No | 
> | compliances | No | 
> | datacollectionagents | No | 
> | devicesecuritygroups | No | 
> | discoveredsecuritysolutions | No | 
> | externalsecuritysolutions | No | 
> | informationprotectionpolicies | No | 
> | iotsecuritysolutions | No | 
> | iotsecuritysolutions / analyticsmodels | No | 
> | iotsecuritysolutions / analyticsmodels / aggregatedalerts | No | 
> | iotsecuritysolutions / analyticsmodels / aggregatedrecommendations | No | 
> | jitnetworkaccesspolicies | No | 
> | policies | No | 
> | pricings | No | 
> | regulatorycompliancestandards | No | 
> | regulatorycompliancestandards / regulatorycompliancecontrols | No | 
> | regulatorycompliancestandards / regulatorycompliancecontrols / regulatorycomplianceassessments | No | 
> | securitycontacts | No | 
> | securitysolutions | No | 
> | securitysolutionsreferencedata | No | 
> | securitystatuses | No | 
> | securitystatusessummaries | No | 
> | servervulnerabilityassessments | No | 
> | settings | No | 
> | subassessments | No |
> | tasks | No | 
> | topologies | No | 
> | workspacesettings | No | 

## Microsoft.SecurityInsights

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- | 
> | aggregations | No | 
> | alertrules | No | 
> | alertruletemplates | No | 
> | automationrules | No |
> | cases | No | 
> | dataconnectors | No | 
> | entities | No | 
> | entityqueries | No |
> | incidents | No | 
> | officeconsents | No | 
> | settings | No | 
> | threatintelligence | No | 

## Microsoft.SerialConsole

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- | 
> | consoleservices | No | 

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
> | premiummessagingregions | No | 
> | sku | No | 

## Microsoft.ServiceFabric

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- |
> | applications | No | 
> | clusters |  No |  
> | containergroups | No | 
> | containergroupsets | No | 
> | edgeclusters | No | 
> | managedclusters | No |
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

## Microsoft.Services

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- | 
> | rollouts | No | 

## Microsoft.SignalRService

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- |
> | signalr |  No |  

## Microsoft.SoftwarePlan

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- | 
> | hybridusebenefits | No | 

## Microsoft.Solutions

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- |
> | appliancedefinitions | No | 
> | appliances | No | 
> | jitrequests | No | 

## Microsoft.Sql

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- |
> | instancepools | No | 
> | locations | No |
> | managedinstances | Yes <br/><br/> [Learn more](../../azure-sql/database/move-resources-across-regions.md) about moving managed instances across regions. | 
> | managedinstances / databases | Yes | 
> | servers | Yes | 
> | servers / databases | Yes <br/><br/> [Learn more](../../azure-sql/database/move-resources-across-regions.md) about moving databases across regions.<br/><br/> [Learn more](../../resource-mover/tutorial-move-region-sql.md) about using Azure Resource Mover to move Azure SQL databases.  | 
> | servers / elasticpools | Yes <br/><br/> [Learn more](../../azure-sql/database/move-resources-across-regions.md) about moving elastic pools across regions.<br/><br/> [Learn more](../../resource-mover/tutorial-move-region-sql.md) about using Azure Resource Mover to move Azure SQL elastic pools.  | 
> | virtualclusters | Yes | 

## Microsoft.SqlVirtualMachine

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- |
> | sqlvirtualmachinegroups |  No |  
> | sqlvirtualmachines |  No |  


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
> | clusters | No |
> | streamingjobs |  No |  


## Microsoft.StreamAnalyticsExplorer

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- |
> | environments | No | 
> | instances | No | 

## Microsoft.Subscription

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- | 
> | subscriptions | No | 

## microsoft.support

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- | 
> | services | No | 
> | supporttickets | No | 

## Microsoft.Synapse

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- | 
> | workspaces | No | 
> | workspaces / bigdatapools | No | 
> | workspaces / sqlpools | No | 


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

## Microsoft.VMware

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- | 
> | arczones | No | 
> | resourcepools | No | 
> | vcenters | No | 
> | virtualmachines | No | 
> | virtualmachinetemplates | No | 
> | virtualnetworks | No | 

## Microsoft.VMwareCloudSimple

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- |
> | dedicatedcloudnodes | No | 
> | dedicatedcloudservices | No | 
> | virtualmachines | No | 

## Microsoft.VnfManager

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- | 
> | devices | No | 
> | vnfs | No | 

## Microsoft.VSOnline

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- | 
> | accounts | No | 
> | plans | No | 
> | registeredsubscriptions | No |


## Microsoft.Web

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- |
> | availablestacks | No | 
> | billingmeters | No | 
> | certificates | No | 
> | connectiongateways |  No |  
> | connections |  No |  
> | customapis |  No | 
> | deletedsites | No | 
> | deploymentlocations | No | 
> | georegions | No | 
> | hostingenvironments | No | 
> | kubeenvironments | No | 
> | publishingusers | No |
> | recommendations | No | 
> | resourcehealthmetadata | No | 
> | runtimes | No | 
> | serverfarms | No |  
> | serverfarms / eventgridfilters | N
> | sites |  No | 
> | sites / premieraddons |  No |  
> | sites / slots |  No |  
> | sourcecontrols | No |
> | staticsites | No | 

## Microsoft.WindowsESU

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- | 
> | multipleactivationkeys | No |

## Microsoft.WindowsIoT

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- |
> | deviceservices | No | 

## Microsoft.WorkloadBuilder

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- | 
> | workloads | No | 

## Microsoft.WorkloadMonitor

> [!div class="mx-tableFixed"]
> | Resource type | Region move | 
> | ------------- | ----------- | 
> | components | No |
> | componentssummary | No | 
> | monitorinstances | No | 
> | monitorinstancessummary | No | 
> | monitors | No | 
## Third-party services

Third-party services currently don't support the move operation.

## Next steps

[Learn more](../../resource-mover/overview.md) about the Resource Mover service.


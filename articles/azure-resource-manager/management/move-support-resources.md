---
title: Move operation support by resource type
description: Lists the Azure resource types that can be moved to a new resource group or subscription.
ms.topic: conceptual
ms.date: 06/15/2020
---

# Move operation support for resources

This article lists whether an Azure resource type supports the move operation. It also provides information about special conditions to consider when moving a resource.

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
> - [Microsoft.ChangeAnalysis](#microsoftchangeanalysis)
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
> - [Microsoft.CostManagementExports](#microsoftcostmanagementexports)
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
> - [Microsoft.PowerPlatform](#microsoftpowerplatform)
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
> | domainservices / oucontainer | No | No |
> | locations | No | No |
> | locations / operationresults | No | No |
> | operations | No | No |

## microsoft.aadiam

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | diagnosticsettings | No | No |
> | diagnosticsettingscategories | No | No |
> | operations | No | No |
> | privatelinkforazuread | Yes | Yes |
> | tenants | Yes | Yes |

## Microsoft.Addons

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | operationresults | No | No |
> | operations | No | No |
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
> | operations | No | No |
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
> | operations | No | No |
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
> | operations | No | No |
> | smartdetectoralertrules | Yes | Yes |
> | smartgroups | No | No |

## Microsoft.AnalysisServices

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | locations | No | No |
> | locations / checknameavailability | No | No |
> | locations / operationresults | No | No |
> | locations / operationstatuses | No | No |
> | operations | No | No |
> | servers | Yes | Yes |

## Microsoft.ApiManagement

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | checkfeedbackrequired | No | No |
> | checknameavailability | No | No |
> | checkservicenameavailability | No | No |
> | operations | No | No |
> | reportfeedback | No | No |
> | service | Yes | Yes |
> | validateservicename | No | No |

> [!IMPORTANT]
> An API Management service that is set to the Consumption SKU can't be moved.

## Microsoft.AppConfiguration

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | checknameavailability | No | No |
> | configurationstores | Yes | Yes |
> | configurationstores / eventgridfilters | No | No |
> | locations | No | No |
> | locations / operationsstatus | No | No |
> | operations | No | No |

## Microsoft.AppPlatform

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | locations | No | No |
> | locations / checknameavailability | No | No |
> | locations / operationresults | No | No |
> | locations / operationstatus | No | No |
> | operations | No | No |
> | spring | Yes | Yes |
> | spring / apps | No | No |
> | spring / apps / deployments | No | No |

## Microsoft.AppService

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | apiapps | No | No |
> | appidentities | No | No |
> | gateways | No | No |

> [!IMPORTANT]
> See [App Service move guidance](./move-limitations/app-service-move-limitations.md).

## Microsoft.Attestation

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | attestationproviders | Yes | Yes |
> | operations | No | No |

## Microsoft.Authorization

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | checkaccess | No | No |
> | classicadministrators | No | No |
> | dataaliases | No | No |
> | denyassignments | No | No |
> | elevateaccess | No | No |
> | findorphanroleassignments | No | No |
> | locks | No | No |
> | operations | No | No |
> | operationstatus | No | No |
> | permissions | No | No |
> | policyassignments | No | No |
> | policydefinitions | No | No |
> | policysetdefinitions | No | No |
> | privatelinkassociations | No | No |
> | provideroperations | No | No |
> | resourcemanagementprivatelinks | No | No |
> | roleassignments | No | No |
> | roleassignmentsusagemetrics | No | No |
> | roledefinitions | No | No |

## Microsoft.Automation

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | automationaccounts | Yes | Yes |
> | automationaccounts / configurations | Yes | Yes |
> | automationaccounts / jobs | No | No |
> | automationaccounts / privateendpointconnectionproxies | No | No |
> | automationaccounts / privateendpointconnections | No | No |
> | automationaccounts / privatelinkresources | No | No |
> | automationaccounts / runbooks | Yes | Yes |
> | automationaccounts / softwareupdateconfigurations | No | No |
> | automationaccounts / webhooks | No | No |
> | operations | No | No |

> [!IMPORTANT]
> Runbooks must exist in the same resource group as the Automation Account.

## Microsoft.AVS

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | locations | No | No |
> | locations / checkquotaavailability | No | No |
> | locations / checktrialavailability | No | No |
> | operations | No | No |
> | privateclouds | Yes | Yes |
> | privateclouds / clusters | No | No |

## Microsoft.AzureActiveDirectory

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | b2cdirectories | Yes | Yes |
> | b2ctenants | No | No |
> | checknameavailability | No | No |
> | operations | No | No |

## Microsoft.AzureData

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | datacontrollers | No | No |
> | hybriddatamanagers | No | No |
> | operations | No | No |
> | postgresinstances | No | No |
> | sqlinstances | No | No |
> | sqlmanagedinstances | No | No |
> | sqlserverinstances | No | No |
> | sqlserverregistrations | Yes | Yes |
> | sqlserverregistrations / sqlservers | No | No |

## Microsoft.AzureStack

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | cloudmanifestfiles | No | No |
> | operations | No | No |
> | registrations | Yes | Yes |
> | registrations / customersubscriptions | No | No |
> | registrations / products | No | No |

## Microsoft.AzureStackHCI

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | clusters | No | No |
> | operations | No | No |

## Microsoft.Batch

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | batchaccounts | Yes | Yes |
> | locations | No | No |
> | locations / accountoperationresults | No | No |
> | locations / checknameavailability | No | No |
> | locations / quotas | No | No |
> | operations | No | No |

## Microsoft.Billing

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | billingaccounts | No | No |
> | billingaccounts / agreements | No | No |
> | billingaccounts / billingpermissions | No | No |
> | billingaccounts / billingprofiles | No | No |
> | billingaccounts / billingprofiles / availablebalance | No | No |
> | billingaccounts / billingprofiles / billingpermissions | No | No |
> | billingaccounts / billingprofiles / billingroleassignments | No | No |
> | billingaccounts / billingprofiles / billingroledefinitions | No | No |
> | billingaccounts / billingprofiles / billingsubscriptions | No | No |
> | billingaccounts / billingprofiles / createbillingroleassignment | No | No |
> | billingaccounts / billingprofiles / customers | No | No |
> | billingaccounts / billingprofiles / instructions | No | No |
> | billingaccounts / billingprofiles / invoices | No | No |
> | billingaccounts / billingprofiles / invoices / pricesheet | No | No |
> | billingaccounts / billingprofiles / invoices / transactions | No | No |
> | billingaccounts / billingprofiles / invoicesections | No | No |
> | billingaccounts / billingprofiles / invoicesections / billingpermissions | No | No |
> | billingaccounts / billingprofiles / invoicesections / billingroleassignments | No | No |
> | billingaccounts / billingprofiles / invoicesections / billingroledefinitions | No | No |
> | billingaccounts / billingprofiles / invoicesections / billingsubscriptions | No | No |
> | billingaccounts / billingprofiles / invoicesections / createbillingroleassignment | No | No |
> | billingaccounts / billingprofiles / invoicesections / initiatetransfer | No | No |
> | billingaccounts / billingprofiles / invoicesections / products | No | No |
> | billingaccounts / billingprofiles / invoicesections / products / transfer | No | No |
> | billingaccounts / billingprofiles / invoicesections / products / updateautorenew | No | No |
> | billingaccounts / billingprofiles / invoicesections / transactions | No | No |
> | billingaccounts / billingprofiles / invoicesections / transfers | No | No |
> | billingaccounts / billingprofiles / patchoperations | No | No |
> | billingaccounts / billingprofiles / paymentmethods | No | No |
> | billingaccounts / billingprofiles / policies | No | No |
> | billingaccounts / billingprofiles / pricesheet | No | No |
> | billingaccounts / billingprofiles / pricesheetdownloadoperations | No | No |
> | billingaccounts / billingprofiles / products | No | No |
> | billingaccounts / billingprofiles / transactions | No | No |
> | billingaccounts / billingroleassignments | No | No |
> | billingaccounts / billingroledefinitions | No | No |
> | billingaccounts / billingsubscriptions | No | No |
> | billingaccounts / billingsubscriptions / invoices | No | No |
> | billingaccounts / createbillingroleassignment | No | No |
> | billingaccounts / createinvoicesectionoperations | No | No |
> | billingaccounts / customers | No | No |
> | billingaccounts / customers / billingpermissions | No | No |
> | billingaccounts / customers / billingsubscriptions | No | No |
> | billingaccounts / customers / initiatetransfer | No | No |
> | billingaccounts / customers / policies | No | No |
> | billingaccounts / customers / products | No | No |
> | billingaccounts / customers / transactions | No | No |
> | billingaccounts / customers / transfers | No | No |
> | billingaccounts / departments | No | No |
> | billingaccounts / enrollmentaccounts | No | No |
> | billingaccounts / invoices | No | No |
> | billingaccounts / invoicesections | No | No |
> | billingaccounts / invoicesections / billingsubscriptionmoveoperations | No | No |
> | billingaccounts / invoicesections / billingsubscriptions | No | No |
> | billingaccounts / invoicesections / billingsubscriptions / transfer | No | No |
> | billingaccounts / invoicesections / elevate | No | No |
> | billingaccounts / invoicesections / initiatetransfer | No | No |
> | billingaccounts / invoicesections / patchoperations | No | No |
> | billingaccounts / invoicesections / productmoveoperations | No | No |
> | billingaccounts / invoicesections / products | No | No |
> | billingaccounts / invoicesections / products / transfer | No | No |
> | billingaccounts / invoicesections / products / updateautorenew | No | No |
> | billingaccounts / invoicesections / producttransfersresults | No | No |
> | billingaccounts / invoicesections / transactions | No | No |
> | billingaccounts / invoicesections / transfers | No | No |
> | billingaccounts / lineofcredit | No | No |
> | billingaccounts / listinvoicesectionswithcreatesubscriptionpermission | No | No |
> | billingaccounts / operationresults | No | No |
> | billingaccounts / patchoperations | No | No |
> | billingaccounts / paymentmethods | No | No |
> | billingaccounts / products | No | No |
> | billingaccounts / transactions | No | No |
> | billingperiods | No | No |
> | billingpermissions | No | No |
> | billingproperty | No | No |
> | billingroleassignments | No | No |
> | billingroledefinitions | No | No |
> | createbillingroleassignment | No | No |
> | departments | No | No |
> | enrollmentaccounts | No | No |
> | invoices | No | No |
> | operationresults | No | No |
> | operations | No | No |
> | operationstatus | No | No |
> | transfers | No | No |
> | transfers / accepttransfer | No | No |
> | transfers / declinetransfer | No | No |
> | transfers / operationstatus | No | No |
> | transfers / validatetransfer | No | No |
> | validateaddress | No | No |

## Microsoft.BingMaps

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | listcommunicationpreference | No | No |
> | mapapis | No | No |
> | operations | No | No |
> | updatecommunicationpreference | No | No |

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
> | locations | No | No |
> | locations / blockchainmemberoperationresults | No | No |
> | locations / checknameavailability | No | No |
> | locations / listconsortiums | No | No |
> | locations / watcheroperationresults | No | No |
> | operations | No | No |
> | watchers | No | No |

## Microsoft.BlockchainTokens

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | operations | No | No |
> | tokenservices | No | No |

## Microsoft.Blueprint

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | blueprintassignments | No | No |
> | blueprintassignments / assignmentoperations | No | No |
> | blueprintassignments / operations | No | No |
> | blueprints | No | No |
> | blueprints / artifacts | No | No |
> | blueprints / versions | No | No |
> | blueprints / versions / artifacts | No | No |
> | operations | No | No |

## Microsoft.BotService

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | botservices | Yes | Yes |
> | botservices / channels | No | No |
> | botservices / connections | No | No |
> | checknameavailability | No | No |
> | listauthserviceproviders | No | No |
> | operations | No | No |

## Microsoft.Cache

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | checknameavailability | No | No |
> | locations | No | No |
> | locations / operationresults | No | No |
> | locations / operationsstatus | No | No |
> | operations | No | No |
> | redis | Yes | Yes |
> | redis / eventgridfilters | No | No |
> | redis / privatelinkresources | No | No |
> | redisenterprise | No | No |

> [!IMPORTANT]
> If the Azure Cache for Redis instance is configured with a virtual network, the instance can't be moved to a different subscription. See [Networking move limitations](./move-limitations/networking-move-limitations.md).

## Microsoft.Capacity

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | appliedreservations | No | No |
> | calculateexchange | No | No |
> | calculateprice | No | No |
> | calculatepurchaseprice | No | No |
> | catalogs | No | No |
> | checkoffers | No | No |
> | checkpurchasestatus | No | No |
> | checkscopes | No | No |
> | commercialreservationorders | No | No |
> | exchange | No | No |
> | listbenefits | No | No |
> | operations | No | No |
> | placepurchaseorder | No | No |
> | reservationorders | No | No |
> | reservationorders / availablescopes | No | No |
> | reservationorders / calculaterefund | No | No |
> | reservationorders / merge | No | No |
> | reservationorders / reservations | No | No |
> | reservationorders / reservations / availablescopes | No | No |
> | reservationorders / reservations / revisions | No | No |
> | reservationorders / return | No | No |
> | reservationorders / split | No | No |
> | reservationorders / swap | No | No |
> | reservations | No | No |
> | resources | No | No |
> | validatereservationorder | No | No |

## Microsoft.Cdn

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | cdnwebapplicationfirewallmanagedrulesets | No | No |
> | cdnwebapplicationfirewallpolicies | Yes | Yes |
> | checknameavailability | No | No |
> | checkresourceusage | No | No |
> | edgenodes | No | No |
> | operationresults | No | No |
> | operationresults / profileresults | No | No |
> | operationresults / profileresults / endpointresults | No | No |
> | operationresults / profileresults / endpointresults / customdomainresults | No | No |
> | operationresults / profileresults / endpointresults / origingroupresults | No | No |
> | operationresults / profileresults / endpointresults / originresults | No | No |
> | operations | No | No |
> | profiles | Yes | Yes |
> | profiles / endpoints | Yes | Yes |
> | profiles / endpoints / customdomains | No | No |
> | profiles / endpoints / origingroups | No | No |
> | profiles / endpoints / origins | No | No |
> | validateprobe | No | No |

## Microsoft.CertificateRegistration

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | certificateorders | Yes | Yes |
> | certificateorders / certificates | No | No |
> | operations | No | No |
> | validatecertificateregistrationinformation | No | No |

> [!IMPORTANT]
> See [App Service move guidance](./move-limitations/app-service-move-limitations.md).

## Microsoft.ChangeAnalysis

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | operations | No | No |

## Microsoft.ClassicCompute

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | capabilities | No | No |
> | checkdomainnameavailability | No | No |
> | domainnames | Yes | No |
> | domainnames / capabilities | No | No |
> | domainnames / internalloadbalancers | No | No |
> | domainnames / servicecertificates | No | No |
> | domainnames / slots | No | No |
> | domainnames / slots / roles | No | No |
> | domainnames / slots / roles / metricdefinitions | No | No |
> | domainnames / slots / roles / metrics | No | No |
> | movesubscriptionresources | No | No |
> | operatingsystemfamilies | No | No |
> | operatingsystems | No | No |
> | operations | No | No |
> | operationstatuses | No | No |
> | quotas | No | No |
> | resourcetypes | No | No |
> | validatesubscriptionmoveavailability | No | No |
> | virtualmachines | Yes | No |
> | virtualmachines / diagnosticsettings | No | No |
> | virtualmachines / metricdefinitions | No | No |
> | virtualmachines / metrics | No | No |

> [!IMPORTANT]
> See [Classic deployment move guidance](./move-limitations/classic-model-move-limitations.md). Classic deployment resources can be moved across subscriptions with an operation specific to that scenario.

## Microsoft.ClassicInfrastructureMigrate

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | classicinfrastructureresources | No | No |

> [!IMPORTANT]
> See [Classic deployment move guidance](./move-limitations/classic-model-move-limitations.md). Classic deployment resources can be moved across subscriptions with an operation specific to that scenario.

## Microsoft.ClassicNetwork

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | capabilities | No | No |
> | expressroutecrossconnections | No | No |
> | expressroutecrossconnections / peerings | No | No |
> | gatewaysupporteddevices | No | No |
> | networksecuritygroups | No | No |
> | operations | No | No |
> | quotas | No | No |
> | reservedips | No | No |
> | virtualnetworks | No | No |
> | virtualnetworks / remotevirtualnetworkpeeringproxies | No | No |
> | virtualnetworks / virtualnetworkpeerings | No | No |

> [!IMPORTANT]
> See [Classic deployment move guidance](./move-limitations/classic-model-move-limitations.md). Classic deployment resources can be moved across subscriptions with an operation specific to that scenario.

## Microsoft.ClassicStorage

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | capabilities | No | No |
> | checkstorageaccountavailability | No | No |
> | disks | No | No |
> | images | No | No |
> | operations | No | No |
> | osimages | No | No |
> | osplatformimages | No | No |
> | publicimages | No | No |
> | quotas | No | No |
> | storageaccounts | Yes | No |
> | storageaccounts / blobservices | No | No |
> | storageaccounts / fileservices | No | No |
> | storageaccounts / metricdefinitions | No | No |
> | storageaccounts / metrics | No | No |
> | storageaccounts / queueservices | No | No |
> | storageaccounts / services | No | No |
> | storageaccounts / services / diagnosticsettings | No | No |
> | storageaccounts / services / metricdefinitions | No | No |
> | storageaccounts / services / metrics | No | No |
> | storageaccounts / tableservices | No | No |
> | storageaccounts / vmimages | No | No |
> | vmimages | No | No |

> [!IMPORTANT]
> See [Classic deployment move guidance](./move-limitations/classic-model-move-limitations.md). Classic deployment resources can be moved across subscriptions with an operation specific to that scenario.

## Microsoft.ClassicSubscription

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | operations | No | No |

> [!IMPORTANT]
> See [Classic deployment move guidance](./move-limitations/classic-model-move-limitations.md). Classic deployment resources can be moved across subscriptions with an operation specific to that scenario.

## Microsoft.CognitiveServices

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | accounts | Yes | Yes |
> | checkdomainavailability | No | No |
> | locations | No | No |
> | locations / checkskuavailability | No | No |
> | locations / deletevirtualnetworkorsubnets | No | No |
> | locations / operationresults | No | No |
> | operations | No | No |

## Microsoft.Commerce

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | operations | No | No |
> | ratecard | No | No |
> | usageaggregates | No | No |

## Microsoft.Compute

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
> | locations | No | No |
> | locations / artifactpublishers | No | No |
> | locations / capsoperations | No | No |
> | locations / diskoperations | No | No |
> | locations / loganalytics | No | No |
> | locations / operations | No | No |
> | locations / publishers | No | No |
> | locations / runcommands | No | No |
> | locations / usages | No | No |
> | locations / virtualmachines | No | No |
> | locations / vmsizes | No | No |
> | locations / vsmoperations | No | No |
> | operations | No | No |
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
> | virtualmachines / metricdefinitions | No | No |
> | virtualmachines / runcommands | No | No |
> | virtualmachinescalesets | Yes | Yes |
> | virtualmachinescalesets / extensions | No | No |
> | virtualmachinescalesets / networkinterfaces | No | No |
> | virtualmachinescalesets / publicipaddresses | No | No |
> | virtualmachinescalesets / virtualmachines | No | No |
> | virtualmachinescalesets / virtualmachines / networkinterfaces | No | No |

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
> | operations | No | No |
> | operationstatus | No | No |
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
> | locations | No | No |
> | locations / cachedimages | No | No |
> | locations / capabilities | No | No |
> | locations / deletevirtualnetworkorsubnets | No | No |
> | locations / operations | No | No |
> | locations / usages | No | No |
> | operations | No | No |
> | serviceassociationlinks | No | No |

## Microsoft.ContainerRegistry

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | checknameavailability | No | No |
> | locations | No | No |
> | locations / authorize | No | No |
> | locations / deletevirtualnetworkorsubnets | No | No |
> | locations / operationresults | No | No |
> | locations / setupauth | No | No |
> | operations | No | No |
> | registries | Yes | Yes |
> | registries / agentpools | Yes | Yes |
> | registries / agentpools / listqueuestatus | No | No |
> | registries / builds | No | No |
> | registries / builds / cancel | No | No |
> | registries / builds / getloglink | No | No |
> | registries / buildtasks | Yes | Yes |
> | registries / buildtasks / listsourcerepositoryproperties | No | No |
> | registries / buildtasks / steps | No | No |
> | registries / buildtasks / steps / listbuildarguments | No | No |
> | registries / eventgridfilters | No | No |
> | registries / exportpipelines | No | No |
> | registries / generatecredentials | No | No |
> | registries / getbuildsourceuploadurl | No | No |
> | registries / getcredentials | No | No |
> | registries / importimage | No | No |
> | registries / importpipelines | No | No |
> | registries / listbuildsourceuploadurl | No | No |
> | registries / listcredentials | No | No |
> | registries / listpolicies | No | No |
> | registries / listusages | No | No |
> | registries / pipelineruns | No | No |
> | registries / privateendpointconnectionproxies | No | No |
> | registries / privateendpointconnectionproxies / validate | No | No |
> | registries / privateendpointconnections | No | No |
> | registries / privatelinkresources | No | No |
> | registries / queuebuild | No | No |
> | registries / regeneratecredential | No | No |
> | registries / regeneratecredentials | No | No |
> | registries / replications | Yes | Yes |
> | registries / runs | No | No |
> | registries / runs / cancel | No | No |
> | registries / runs / listlogsasurl | No | No |
> | registries / schedulerun | No | No |
> | registries / scopemaps | No | No |
> | registries / taskruns | No | No |
> | registries / taskruns / listdetails | No | No |
> | registries / tasks | Yes | Yes |
> | registries / tasks / listdetails | No | No |
> | registries / tokens | No | No |
> | registries / updatepolicies | No | No |
> | registries / webhooks | Yes | Yes |
> | registries / webhooks / getcallbackconfig | No | No |
> | registries / webhooks / listevents | No | No |
> | registries / webhooks / ping | No | No |

## Microsoft.ContainerService

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | containerservices | No | No |
> | locations | No | No |
> | locations / openshiftclusters | No | No |
> | locations / operationresults | No | No |
> | locations / operations | No | No |
> | locations / orchestrators | No | No |
> | managedclusters | No | No |
> | openshiftmanagedclusters | No | No |
> | operations | No | No |

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
> | externalbillingaccounts / alerts | No | No |
> | externalbillingaccounts / dimensions | No | No |
> | externalbillingaccounts / forecast | No | No |
> | externalbillingaccounts / query | No | No |
> | externalsubscriptions | No | No |
> | externalsubscriptions / alerts | No | No |
> | externalsubscriptions / dimensions | No | No |
> | externalsubscriptions / forecast | No | No |
> | externalsubscriptions / query | No | No |
> | forecast | No | No |
> | operations | No | No |
> | query | No | No |
> | register | No | No |
> | reportconfigs | No | No |
> | reports | No | No |
> | settings | No | No |
> | showbackrules | No | No |
> | views | No | No |

## Microsoft.CostManagementExports

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | operations | No | No |

## Microsoft.CustomerInsights

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | hubs | No | No |

## Microsoft.CustomerLockbox

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | operations | No | No |
> | requests | No | No |

## Microsoft.CustomProviders

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | associations | No | No |
> | locations | No | No |
> | locations / operationstatuses | No | No |
> | operations | No | No |
> | resourceproviders | Yes | Yes |

## Microsoft.DataBox

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | jobs | No | No |
> | locations | No | No |
> | locations / availableskus | No | No |
> | locations / checknameavailability | No | No |
> | locations / operationresults | No | No |
> | locations / regionconfiguration | No | No |
> | locations / validateaddress | No | No |
> | locations / validateinputs | No | No |
> | operations | No | No |

## Microsoft.DataBoxEdge

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | availableskus | No | No |
> | databoxedgedevices | Yes | Yes |
> | databoxedgedevices / checknameavailability | No | No |
> | operations | No | No |

## Microsoft.Databricks

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | locations | No | No |
> | locations / getnetworkpolicies | No | No |
> | locations / operationstatuses | No | No |
> | operations | No | No |
> | workspaces | No | No |
> | workspaces / dbworkspaces | No | No |
> | workspaces / virtualnetworkpeerings | No | No |

## Microsoft.DataCatalog

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | catalogs | Yes | Yes |
> | checknameavailability | No | No |
> | datacatalogs | No | No |
> | locations | No | No |
> | locations / jobs | No | No |
> | locations / operationresults | No | No |
> | operations | No | No |

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
> | checkazuredatafactorynameavailability | No | No |
> | checkdatafactorynameavailability | No | No |
> | datafactories | Yes | Yes |
> | datafactories / diagnosticsettings | No | No |
> | datafactories / metricdefinitions | No | No |
> | datafactoryschema | No | No |
> | factories | Yes | Yes |
> | factories / integrationruntimes | No | No |
> | locations | No | No |
> | locations / configurefactoryrepo | No | No |
> | locations / getfeaturevalue | No | No |
> | operations | No | No |

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
> | accounts / datalakestoreaccounts | No | No |
> | accounts / storageaccounts | No | No |
> | accounts / storageaccounts / containers | No | No |
> | accounts / storageaccounts / containers / listsastokens | No | No |
> | locations | No | No |
> | locations / capability | No | No |
> | locations / checknameavailability | No | No |
> | locations / operationresults | No | No |
> | locations / usages | No | No |
> | operations | No | No |

## Microsoft.DataLakeStore

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | accounts | Yes | Yes |
> | accounts / eventgridfilters | No | No |
> | accounts / firewallrules | No | No |
> | locations | No | No |
> | locations / capability | No | No |
> | locations / checknameavailability | No | No |
> | locations / deletevirtualnetworkorsubnets | No | No |
> | locations / operationresults | No | No |
> | locations / usages | No | No |
> | operations | No | No |

## Microsoft.DataMigration

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | locations | No | No |
> | locations / checknameavailability | No | No |
> | locations / operationresults | No | No |
> | locations / operationstatuses | No | No |
> | operations | No | No |
> | services | No | No |
> | services / projects | No | No |
> | slots | No | No |

## Microsoft.DataProtection

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | backupvaults | No | No |
> | locations | No | No |
> | operations | No | No |

## Microsoft.DataShare

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | accounts | Yes | Yes |
> | accounts / shares | No | No |
> | accounts / shares / datasets | No | No |
> | accounts / shares / invitations | No | No |
> | accounts / shares / providersharesubscriptions | No | No |
> | accounts / shares / synchronizationsettings | No | No |
> | accounts / sharesubscriptions | No | No |
> | accounts / sharesubscriptions / consumersourcedatasets | No | No |
> | accounts / sharesubscriptions / datasetmappings | No | No |
> | accounts / sharesubscriptions / triggers | No | No |
> | listinvitations | No | No |
> | locations | No | No |
> | locations / consumerinvitations | No | No |
> | locations / operationresults | No | No |
> | locations / rejectinvitation | No | No |
> | operations | No | No |

## Microsoft.DBforMariaDB

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | checknameavailability | No | No |
> | locations | No | No |
> | locations / azureasyncoperation | No | No |
> | locations / operationresults | No | No |
> | locations / performancetiers | No | No |
> | locations / privateendpointconnectionazureasyncoperation | No | No |
> | locations / privateendpointconnectionoperationresults | No | No |
> | locations / privateendpointconnectionproxyazureasyncoperation | No | No |
> | locations / privateendpointconnectionproxyoperationresults | No | No |
> | locations / recommendedactionsessionsazureasyncoperation | No | No |
> | locations / recommendedactionsessionsoperationresults | No | No |
> | locations / securityalertpoliciesazureasyncoperation | No | No |
> | locations / securityalertpoliciesoperationresults | No | No |
> | locations / serverkeyazureasyncoperation | No | No |
> | locations / serverkeyoperationresults | No | No |
> | operations | No | No |
> | servers | Yes | Yes |
> | servers / advisors | No | No |
> | servers / privateendpointconnectionproxies | No | No |
> | servers / privateendpointconnections | No | No |
> | servers / privatelinkresources | No | No |
> | servers / querytexts | No | No |
> | servers / recoverableservers | No | No |
> | servers / topquerystatistics | No | No |
> | servers / virtualnetworkrules | No | No |
> | servers / waitstatistics | No | No |

## Microsoft.DBforMySQL

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | checknameavailability | No | No |
> | locations | No | No |
> | locations / administratorazureasyncoperation | No | No |
> | locations / administratoroperationresults | No | No |
> | locations / azureasyncoperation | No | No |
> | locations / operationresults | No | No |
> | locations / performancetiers | No | No |
> | locations / privateendpointconnectionazureasyncoperation | No | No |
> | locations / privateendpointconnectionoperationresults | No | No |
> | locations / privateendpointconnectionproxyazureasyncoperation | No | No |
> | locations / privateendpointconnectionproxyoperationresults | No | No |
> | locations / recommendedactionsessionsazureasyncoperation | No | No |
> | locations / recommendedactionsessionsoperationresults | No | No |
> | locations / securityalertpoliciesazureasyncoperation | No | No |
> | locations / securityalertpoliciesoperationresults | No | No |
> | locations / serverkeyazureasyncoperation | No | No |
> | locations / serverkeyoperationresults | No | No |
> | operations | No | No |
> | servers | Yes | Yes |
> | servers / advisors | No | No |
> | servers / keys | No | No |
> | servers / privateendpointconnectionproxies | No | No |
> | servers / privateendpointconnections | No | No |
> | servers / privatelinkresources | No | No |
> | servers / querytexts | No | No |
> | servers / recoverableservers | No | No |
> | servers / topquerystatistics | No | No |
> | servers / virtualnetworkrules | No | No |
> | servers / waitstatistics | No | No |

## Microsoft.DBforPostgreSQL

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | checknameavailability | No | No |
> | locations | No | No |
> | locations / administratorazureasyncoperation | No | No |
> | locations / administratoroperationresults | No | No |
> | locations / azureasyncoperation | No | No |
> | locations / operationresults | No | No |
> | locations / performancetiers | No | No |
> | locations / privateendpointconnectionazureasyncoperation | No | No |
> | locations / privateendpointconnectionoperationresults | No | No |
> | locations / privateendpointconnectionproxyazureasyncoperation | No | No |
> | locations / privateendpointconnectionproxyoperationresults | No | No |
> | locations / recommendedactionsessionsazureasyncoperation | No | No |
> | locations / recommendedactionsessionsoperationresults | No | No |
> | locations / securityalertpoliciesazureasyncoperation | No | No |
> | locations / securityalertpoliciesoperationresults | No | No |
> | locations / serverkeyazureasyncoperation | No | No |
> | locations / serverkeyoperationresults | No | No |
> | operations | No | No |
> | servergroups | No | No |
> | servers | Yes | Yes |
> | servers / advisors | No | No |
> | servers / keys | No | No |
> | servers / privateendpointconnectionproxies | No | No |
> | servers / privateendpointconnections | No | No |
> | servers / privatelinkresources | No | No |
> | servers / querytexts | No | No |
> | servers / recoverableservers | No | No |
> | servers / topquerystatistics | No | No |
> | servers / virtualnetworkrules | No | No |
> | servers / waitstatistics | No | No |
> | serversv2 | Yes | Yes |
> | singleservers | Yes | Yes |

## Microsoft.DeploymentManager

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | artifactsources | Yes | Yes |
> | operationresults | No | No |
> | operations | No | No |
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
> | applicationgroups / applications | No | No |
> | applicationgroups / desktops | No | No |
> | applicationgroups / startmenuitems | No | No |
> | hostpools | Yes | Yes |
> | hostpools / sessionhosts | No | No |
> | hostpools / sessionhosts / usersessions | No | No |
> | hostpools / usersessions | No | No |
> | operations | No | No |
> | workspaces | Yes | Yes |

## Microsoft.Devices

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | checknameavailability | No | No |
> | checkprovisioningservicenameavailability | No | No |
> | elasticpools | No | No |
> | elasticpools / iothubtenants | No | No |
> | iothubs | Yes | Yes |
> | iothubs / eventgridfilters | No | No |
> | iothubs / securitysettings | No | No |
> | operationresults | No | No |
> | operations | No | No |
> | provisioningservices | Yes | Yes |
> | usages | No | No |

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
> | controllers / listconnectiondetails | No | No |
> | locations | No | No |
> | locations / checkcontainerhostmapping | No | No |
> | locations / operationresults | No | No |
> | operations | No | No |

## Microsoft.DevTestLab

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | labcenters | No | No |
> | labs | Yes | No |
> | labs / environments | Yes | Yes |
> | labs / servicerunners | Yes | Yes |
> | labs / virtualmachines | Yes | No |
> | locations | No | No |
> | locations / operations | No | No |
> | operations | No | No |
> | schedules | Yes | Yes |

## Microsoft.DigitalTwins

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | digitaltwinsinstances | No | No |
> | digitaltwinsinstances / operationresults | No | No |
> | locations | No | No |
> | operations | No | No |

## Microsoft.DocumentDB

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | databaseaccountnames | No | No |
> | databaseaccounts | Yes | Yes |
> | locations | No | No |
> | locations / deletevirtualnetworkorsubnets | No | No |
> | locations / operationresults | No | No |
> | locations / operationsstatus | No | No |
> | operationresults | No | No |
> | operations | No | No |

## Microsoft.DomainRegistration

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | checkdomainavailability | No | No |
> | domains | Yes | Yes |
> | domains / domainownershipidentifiers | No | No |
> | generatessorequest | No | No |
> | listdomainrecommendations | No | No |
> | operations | No | No |
> | topleveldomains | No | No |
> | validatedomainregistrationinformation | No | No |

## Microsoft.EnterpriseKnowledgeGraph

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | locations | No | No |
> | locations / operationresults | No | No |
> | operations | No | No |
> | services | Yes | Yes |

## Microsoft.EventGrid

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | domains | Yes | Yes |
> | domains / topics | No | No |
> | eventsubscriptions | No - can't be moved independently but automatically moved with subscribed resource. | No - can't be moved independently but automatically moved with subscribed resource. |
> | extensiontopics | No | No |
> | locations | No | No |
> | locations / eventsubscriptions | No | No |
> | locations / operationresults | No | No |
> | locations / operationsstatus | No | No |
> | locations / topictypes | No | No |
> | operationresults | No | No |
> | operations | No | No |
> | operationsstatus | No | No |
> | partnernamespaces | Yes | Yes |
> | partnernamespaces / eventchannels | No | No |
> | partnerregistrations | No | No |
> | partnertopics | Yes | Yes |
> | partnertopics / eventsubscriptions | No | No |
> | systemtopics | Yes | Yes |
> | systemtopics / eventsubscriptions | No | No |
> | topics | Yes | Yes |
> | topictypes | No | No |

## Microsoft.EventHub

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | availableclusterregions | No | No |
> | checknameavailability | No | No |
> | checknamespaceavailability | No | No |
> | clusters | Yes | Yes |
> | locations | No | No |
> | locations / deletevirtualnetworkorsubnets | No | No |
> | namespaces | Yes | Yes |
> | namespaces / authorizationrules | No | No |
> | namespaces / disasterrecoveryconfigs | No | No |
> | namespaces / disasterrecoveryconfigs / checknameavailability | No | No |
> | namespaces / eventhubs | No | No |
> | namespaces / eventhubs / authorizationrules | No | No |
> | namespaces / eventhubs / consumergroups | No | No |
> | namespaces / networkrulesets | No | No |
> | operations | No | No |
> | sku | No | No |

## Microsoft.Experimentation

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | experimentworkspaces | No | No |
> | locations | No | No |
> | locations / operations | No | No |

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
> | operations | No | No |
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
> | operations | No | No |
> | software | No | No |
> | softwareupdateprofile | No | No |
> | softwareupdates | No | No |

## Microsoft.HanaOnAzure

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | hanainstances | No | No |
> | locations | No | No |
> | locations / operations | No | No |
> | locations / operationsstatus | No | No |
> | operations | No | No |
> | sapmonitors | Yes | Yes |

## Microsoft.HardwareSecurityModules

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | dedicatedhsms | No | No |
> | locations | No | No |
> | operations | No | No |

## Microsoft.HDInsight

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | clusters | Yes | Yes |
> | clusters / applications | No | No |
> | clusters / operationresults | No | No |
> | locations | No | No |
> | locations / azureasyncoperations | No | No |
> | locations / billingspecs | No | No |
> | locations / capabilities | No | No |
> | locations / operationresults | No | No |
> | locations / usages | No | No |
> | locations / validatecreaterequest | No | No |
> | operations | No | No |

> [!IMPORTANT]
> You can move HDInsight clusters to a new subscription or resource group. However, you can't move across subscriptions the networking resources linked to the HDInsight cluster (such as the virtual network, NIC, or load balancer). In addition, you can't move to a new resource group a NIC that is attached to a virtual machine for the cluster.
>
> When moving an HDInsight cluster to a new subscription, first move other resources (like the storage account). Then, move the HDInsight cluster by itself.

## Microsoft.HealthcareApis

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | checknameavailability | No | No |
> | locations | No | No |
> | locations / operationresults | No | No |
> | operations | No | No |
> | services | Yes | Yes |
> | services / privateendpointconnections | No | No |
> | services / privatelinkresources | No | No |

## Microsoft.HybridCompute

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | locations | No | No |
> | locations / operationresults | No | No |
> | locations / operationstatus | No | No |
> | machines | Yes | Yes |
> | machines / extensions | Yes | Yes |
> | operations | No | No |

## Microsoft.HybridData

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | datamanagers | Yes | Yes |
> | operations | No | No |

## Microsoft.HybridNetwork

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | devices | No | No |
> | locations | No | No |
> | locations / operationstatuses | No | No |
> | operations | No | No |
> | vnfs | No | No |

## Microsoft.Hydra

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | components | No | No |
> | locations | No | No |
> | networkscopes | No | No |
> | operations | No | No |

## Microsoft.ImportExport

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | jobs | Yes | Yes |
> | locations | No | No |
> | locations / operationresults | No | No |
> | operations | No | No |

## microsoft.insights

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | actiongroups | Yes | Yes |
> | activitylogalerts | No | No |
> | alertrules | Yes | Yes |
> | autoscalesettings | Yes | Yes |
> | baseline | No | No |
> | calculatebaseline | No | No |
> | components | Yes | Yes |
> | components / events | No | No |
> | components / linkedstorageaccounts | No | No |
> | components / metadata | No | No |
> | components / metrics | No | No |
> | components / pricingplans | No | No |
> | components / query | No | No |
> | datacollectionrules | No | No |
> | diagnosticsettings | No | No |
> | diagnosticsettingscategories | No | No |
> | eventcategories | No | No |
> | eventtypes | No | No |
> | extendeddiagnosticsettings | No | No |
> | guestdiagnosticsettings | No | No |
> | listmigrationdate | No | No |
> | locations | No | No |
> | locations / operationresults | No | No |
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
> | operations | No | No |
> | privatelinkscopeoperationstatuses | No | No |
> | privatelinkscopes | No | No |
> | privatelinkscopes / privateendpointconnectionproxies | No | No |
> | privatelinkscopes / privateendpointconnections | No | No |
> | privatelinkscopes / scopedresources | No | No |
> | rollbacktolegacypricingmodel | No | No |
> | scheduledqueryrules | Yes | Yes |
> | topology | No | No |
> | transactions | No | No |
> | vminsightsonboardingstatuses | No | No |
> | webtests | Yes | Yes |
> | webtests / gettestresultfile | No | No |
> | workbooks | Yes | Yes |
> | workbooktemplates | Yes | Yes |

> [!IMPORTANT]
> Make sure moving to new subscription doesn't exceed [subscription quotas](azure-subscription-service-limits.md#azure-monitor-limits).

## Microsoft.IoTCentral

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | apptemplates | No | No |
> | checknameavailability | No | No |
> | checksubdomainavailability | No | No |
> | iotapps | Yes | Yes |
> | operations | No | No |

## Microsoft.IoTSpaces

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | checknameavailability | Yes | Yes |
> | graph | Yes | Yes |
> | operations | No | No |

## Microsoft.KeyVault

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | checknameavailability | No | No |
> | deletedvaults | No | No |
> | hsmpools | No | No |
> | locations | No | No |
> | locations / deletedvaults | No | No |
> | locations / deletevirtualnetworkorsubnets | No | No |
> | locations / operationresults | No | No |
> | managedhsms | No | No |
> | operations | No | No |
> | vaults | Yes | Yes |
> | vaults / accesspolicies | No | No |
> | vaults / eventgridfilters | No | No |
> | vaults / secrets | No | No |

> [!IMPORTANT]
> Key Vaults used for disk encryption can't be moved to a resource group in the same subscription or across subscriptions.

## Microsoft.Kubernetes

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | connectedclusters | Yes | Yes |
> | locations | No | No |
> | locations / operationstatuses | No | No |
> | operations | No | No |
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
> | clusters / attacheddatabaseconfigurations | No | No |
> | clusters / databases | No | No |
> | clusters / databases / dataconnections | No | No |
> | clusters / databases / eventhubconnections | No | No |
> | clusters / databases / principalassignments | No | No |
> | clusters / principalassignments | No | No |
> | locations | No | No |
> | locations / checknameavailability | No | No |
> | locations / operationresults | No | No |
> | operations | No | No |

## Microsoft.LabServices

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | labaccounts | No | No |
> | locations | No | No |
> | locations / operations | No | No |
> | operations | No | No |
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
> | locations | No | No |
> | locations / workflows | No | No |
> | operations | No | No |
> | workflows | Yes | Yes |

## Microsoft.MachineLearning

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | commitmentplans | No | No |
> | locations | No | No |
> | locations / operations | No | No |
> | locations / operationsstatus | No | No |
> | operations | No | No |
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

## Microsoft.MachineLearningServices

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | locations | No | No |
> | locations / computeoperationsstatus | No | No |
> | locations / quotas | No | No |
> | locations / updatequotas | No | No |
> | locations / usages | No | No |
> | locations / vmsizes | No | No |
> | locations / workspaceoperationsstatus | No | No |
> | operations | No | No |
> | workspaces | No | No |
> | workspaces / computes | No | No |
> | workspaces / eventgridfilters | No | No |

## Microsoft.Maintenance

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | applyupdates | No | No |
> | configurationassignments | No | No |
> | maintenanceconfigurations | Yes | Yes |
> | updates | No | No |

## Microsoft.ManagedIdentity

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | identities | No | No |
> | operations | No | No |
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
> | operations | No | No |
> | operationstatuses | No | No |
> | registrationassignments | No | No |
> | registrationdefinitions | No | No |

## Microsoft.Management

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | checknameavailability | No | No |
> | getentities | No | No |
> | managementgroups | No | No |
> | managementgroups / settings | No | No |
> | operationresults | No | No |
> | operationresults / asyncoperation | No | No |
> | operations | No | No |
> | resources | No | No |
> | starttenantbackfill | No | No |
> | tenantbackfillstatus | No | No |

## Microsoft.Maps

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | accounts | Yes | Yes |
> | accounts / eventgridfilters | No | No |
> | accounts / privateatlases | Yes | Yes |
> | operations | No | No |

## Microsoft.Marketplace

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | listavailableoffers | No | No |
> | offers | No | No |
> | offertypes | No | No |
> | offertypes / publishers | No | No |
> | offertypes / publishers / offers | No | No |
> | offertypes / publishers / offers / plans | No | No |
> | offertypes / publishers / offers / plans / agreements | No | No |
> | offertypes / publishers / offers / plans / configs | No | No |
> | offertypes / publishers / offers / plans / configs / importimage | No | No |
> | operations | No | No |
> | privategalleryitems | No | No |
> | privatestoreclient | No | No |
> | privatestores | No | No |
> | privatestores / offers | No | No |
> | products | No | No |
> | publishers | No | No |
> | publishers / offers | No | No |
> | publishers / offers / amendments | No | No |
> | register | No | No |

## Microsoft.MarketplaceApps

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | classicdevservices | No | No |
> | listcommunicationpreference | No | No |
> | operations | No | No |
> | updatecommunicationpreference | No | No |

## Microsoft.MarketplaceOrdering

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | agreements | No | No |
> | offertypes | No | No |
> | operations | No | No |

## Microsoft.Media

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | checknameavailability | No | No |
> | locations | No | No |
> | locations / checknameavailability | No | No |
> | mediaservices | Yes | Yes |
> | mediaservices / accountfilters | No | No |
> | mediaservices / assets | No | No |
> | mediaservices / assets / assetfilters | No | No |
> | mediaservices / contentkeypolicies | No | No |
> | mediaservices / eventgridfilters | No | No |
> | mediaservices / liveeventoperations | No | No |
> | mediaservices / liveevents | Yes | Yes |
> | mediaservices / liveevents / liveoutputs | No | No |
> | mediaservices / liveoutputoperations | No | No |
> | mediaservices / streamingendpointoperations | No | No |
> | mediaservices / streamingendpoints | Yes | Yes |
> | mediaservices / streaminglocators | No | No |
> | mediaservices / streamingpolicies | No | No |
> | mediaservices / transforms | No | No |
> | mediaservices / transforms / jobs | No | No |
> | operations | No | No |

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
> | locations | No | No |
> | locations / assessmentoptions | No | No |
> | locations / checknameavailability | No | No |
> | migrateprojects | No | No |
> | movecollections | No | No |
> | operations | No | No |
> | projects | No | No |

## Microsoft.MixedReality

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | holographicsbroadcastaccounts | No | No |
> | locations | No | No |
> | locations / checknameavailability | No | No |
> | objectunderstandingaccounts | No | No |
> | operations | No | No |
> | remoterenderingaccounts | Yes | Yes |
> | spatialanchorsaccounts | Yes | Yes |

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
> | operations | No | No |

## Microsoft.Network

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | applicationgatewayavailablerequestheaders | No | No |
> | applicationgatewayavailableresponseheaders | No | No |
> | applicationgatewayavailableservervariables | No | No |
> | applicationgatewayavailablessloptions | No | No |
> | applicationgatewayavailablewafrulesets | No | No |
> | applicationgateways | No | No |
> | applicationgatewaywebapplicationfirewallpolicies | No | No |
> | applicationsecuritygroups | Yes | Yes |
> | azurefirewallfqdntags | No | No |
> | azurefirewalls | No | No |
> | bastionhosts | No | No |
> | bgpservicecommunities | No | No |
> | checkfrontdoornameavailability | No | No |
> | checktrafficmanagernameavailability | No | No |
> | connections | Yes | Yes |
> | ddoscustompolicies | Yes | Yes |
> | ddosprotectionplans | No | No |
> | dnsoperationresults | No | No |
> | dnsoperationstatuses | No | No |
> | dnszones | Yes | Yes |
> | dnszones / a | No | No |
> | dnszones / aaaa | No | No |
> | dnszones / all | No | No |
> | dnszones / caa | No | No |
> | dnszones / cname | No | No |
> | dnszones / mx | No | No |
> | dnszones / ns | No | No |
> | dnszones / ptr | No | No |
> | dnszones / recordsets | No | No |
> | dnszones / soa | No | No |
> | dnszones / srv | No | No |
> | dnszones / txt | No | No |
> | expressroutecircuits | No | No |
> | expressroutegateways | No | No |
> | expressrouteserviceproviders | No | No |
> | firewallpolicies | Yes | Yes |
> | frontdooroperationresults | No | No |
> | frontdoors | No | No |
> | frontdoors / frontendendpoints | No | No |
> | frontdoorwebapplicationfirewallmanagedrulesets | No | No |
> | frontdoorwebapplicationfirewallpolicies | No | No |
> | getdnsresourcereference | No | No |
> | internalnotify | No | No |
> | ipallocations | Yes | Yes |
> | ipgroups | Yes | Yes |
> | loadbalancers | Yes - Basic SKU<br>No - Standard SKU | Yes - Basic SKU<br>No - Standard SKU |
> | localnetworkgateways | Yes | Yes |
> | locations | No | No |
> | locations / autoapprovedprivatelinkservices | No | No |
> | locations / availabledelegations | No | No |
> | locations / availableprivateendpointtypes | No | No |
> | locations / availableservicealiases | No | No |
> | locations / baremetaltenants | No | No |
> | locations / batchnotifyprivateendpointsforresourcemove | No | No |
> | locations / batchvalidateprivateendpointsforresourcemove | No | No |
> | locations / checkacceleratednetworkingsupport | No | No |
> | locations / checkdnsnameavailability | No | No |
> | locations / checkprivatelinkservicevisibility | No | No |
> | locations / commitinternalazurenetworkmanagerconfiguration | No | No |
> | locations / effectiveresourceownership | No | No |
> | locations / nfvoperationresults | No | No |
> | locations / nfvoperations | No | No |
> | locations / operationresults | No | No |
> | locations / operations | No | No |
> | locations / servicetags | No | No |
> | locations / setresourceownership | No | No |
> | locations / supportedvirtualmachinesizes | No | No |
> | locations / usages | No | No |
> | locations / validateresourceownership | No | No |
> | locations / virtualnetworkavailableendpointservices | No | No |
> | natgateways | Yes | Yes |
> | networkexperimentprofiles | No | No |
> | networkintentpolicies | Yes | Yes |
> | networkinterfaces | Yes | Yes |
> | networkprofiles | No | No |
> | networksecuritygroups | Yes | Yes |
> | networkwatchers | Yes | No |
> | networkwatchers / connectionmonitors | Yes | No |
> | networkwatchers / flowlogs | Yes | No |
> | networkwatchers / pingmeshes | Yes | No |
> | operations | No | No |
> | p2svpngateways | No | No |
> | privatednsoperationresults | No | No |
> | privatednsoperationstatuses | No | No |
> | privatednszones | Yes | Yes |
> | privatednszones / a | No | No |
> | privatednszones / aaaa | No | No |
> | privatednszones / all | No | No |
> | privatednszones / cname | No | No |
> | privatednszones / mx | No | No |
> | privatednszones / ptr | No | No |
> | privatednszones / soa | No | No |
> | privatednszones / srv | No | No |
> | privatednszones / txt | No | No |
> | privatednszones / virtualnetworklinks | Yes | Yes |
> | privatednszonesinternal | No | No |
> | privateendpointredirectmaps | No | No |
> | privateendpoints | Yes | Yes |
> | privatelinkservices | No | No |
> | publicipaddresses | Yes - Basic SKU<br>No - Standard SKU | Yes - Basic SKU<br>No - Standard SKU |
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

> [!IMPORTANT]
> See [Networking move guidance](./move-limitations/networking-move-limitations.md).

## Microsoft.NotificationHubs

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | checknameavailability | No | No |
> | checknamespaceavailability | No | No |
> | namespaces | Yes | Yes |
> | namespaces / notificationhubs | Yes | Yes |
> | operationresults | No | No |
> | operations | No | No |

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
> | operations | No | No |
> | serversites | No | No |
> | vmwaresites | No | No |

## Microsoft.OperationalInsights

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | clusters | No | No |
> | deletedworkspaces | No | No |
> | linktargets | No | No |
> | locations | No | No |
> | locations / operationstatuses | No | No |
> | operations | No | No |
> | storageinsightconfigs | No | No |
> | workspaces | Yes | Yes |
> | workspaces / datasources | No | No |
> | workspaces / linkedservices | No | No |
> | workspaces / linkedstorageaccounts | No | No |
> | workspaces / metadata | No | No |
> | workspaces / query | No | No |
> | workspaces / scopedprivatelinkproxies | No | No |

> [!IMPORTANT]
> Make sure that moving to a new subscription doesn't exceed [subscription quotas](azure-subscription-service-limits.md#azure-monitor-limits).
>
> Workspaces that have a linked automation account can't be moved. Before you begin a move operation, be sure to unlink any automation accounts.

## Microsoft.OperationsManagement

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | managementassociations | No | No |
> | managementconfigurations | Yes | Yes |
> | operations | No | No |
> | solutions | Yes | Yes |
> | views | Yes | Yes |

## Microsoft.Peering

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | checkserviceprovideravailability | No | No |
> | legacypeerings | No | No |
> | operations | No | No |
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
> | asyncoperationresults | No | No |
> | operations | No | No |
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
> | locations | No | No |
> | locations / consoles | No | No |
> | locations / usersettings | No | No |
> | operations | No | No |
> | usersettings | No | No |

## Microsoft.PowerBI

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | locations | No | No |
> | locations / checknameavailability | No | No |
> | workspacecollections | Yes | Yes |

## Microsoft.PowerBIDedicated

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | capacities | Yes | Yes |
> | locations | No | No |
> | locations / checknameavailability | No | No |
> | locations / operationresults | No | No |
> | locations / operationstatuses | No | No |
> | operations | No | No |

## Microsoft.PowerPlatform

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | operations | No | No |

## Microsoft.ProjectBabylon

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | accounts | No | No |
> | checknameavailability | No | No |
> | operations | No | No |

## Microsoft.ProviderHub

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | availableaccounts | No | No |
> | providerregistrations | No | No |
> | providerregistrations / resourcetyperegistrations | No | No |
> | rollouts | No | No |

## Microsoft.Quantum

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | locations | No | No |
> | locations / operationstatuses | No | No |
> | operations | No | No |
> | workspaces | No | No |

## Microsoft.RecoveryServices

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | backupprotecteditems | No | No |
> | locations | No | No |
> | locations / allocatedstamp | No | No |
> | locations / allocatestamp | No | No |
> | locations / backupaadproperties | No | No |
> | locations / backupcrossregionrestore | No | No |
> | locations / backupcrrjob | No | No |
> | locations / backupcrrjobs | No | No |
> | locations / backupcrroperationresults | No | No |
> | locations / backupcrroperationsstatus | No | No |
> | locations / backupprevalidateprotection | No | No |
> | locations / backupstatus | No | No |
> | locations / backupvalidatefeatures | No | No |
> | locations / checknameavailability | No | No |
> | operations | No | No |
> | replicationeligibilityresults | No | No |
> | vaults | Yes | Yes |

> [!IMPORTANT]
> See [Recovery Services move guidance](../../backup/backup-azure-move-recovery-services-vault.md?toc=/azure/azure-resource-manager/toc.json).

## Microsoft.RedHatOpenShift

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | locations | No | No |
> | locations / operationresults | No | No |
> | locations / operationsstatus | No | No |
> | openshiftclusters | No | No |
> | operations | No | No |

## Microsoft.Relay

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | checknameavailability | No | No |
> | namespaces | Yes | Yes |
> | namespaces / authorizationrules | No | No |
> | namespaces / hybridconnections | No | No |
> | namespaces / hybridconnections / authorizationrules | No | No |
> | namespaces / privateendpointconnections | No | No |
> | namespaces / wcfrelays | No | No |
> | namespaces / wcfrelays / authorizationrules | No | No |
> | operations | No | No |

## Microsoft.ResourceGraph

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | operations | No | No |
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
> | availabilitystatuses | No | No |
> | childavailabilitystatuses | No | No |
> | childresources | No | No |
> | emergingissues | No | No |
> | events | No | No |
> | metadata | No | No |
> | notifications | No | No |
> | operations | No | No |

## Microsoft.Resources

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | calculatetemplatehash | No | No |
> | checkpolicycompliance | No | No |
> | checkresourcename | No | No |
> | deployments | No | No |
> | deployments / operations | No | No |
> | deploymentscripts | No | No |
> | deploymentscripts / logs | No | No |
> | links | No | No |
> | locations | No | No |
> | locations / deploymentscriptoperationresults | No | No |
> | notifyresourcejobs | No | No |
> | operationresults | No | No |
> | operations | No | No |
> | providers | No | No |
> | resourcegroups | No | No |
> | resources | No | No |
> | subscriptions | No | No |
> | subscriptions / locations | No | No |
> | subscriptions / operationresults | No | No |
> | subscriptions / providers | No | No |
> | subscriptions / resourcegroups | No | No |
> | subscriptions / resourcegroups / resources | No | No |
> | subscriptions / resources | No | No |
> | subscriptions / tagnames | No | No |
> | subscriptions / tagnames / tagvalues | No | No |
> | tags | No | No |
> | templatespecs | No | No |
> | templatespecs / versions | No | No |
> | tenants | No | No |

## Microsoft.SaaS

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | applications | Yes | No |
> | checkmoderneligibility | No | No |
> | checknameavailability | No | No |
> | operationresults | No | No |
> | operations | No | No |
> | saasresources | No | No |

## Microsoft.Search

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | checknameavailability | No | No |
> | checkservicenameavailability | No | No |
> | operations | No | No |
> | resourcehealthmetadata | No | No |
> | searchservices | Yes | Yes |

> [!IMPORTANT]
> You can't move several Search resources in different regions in one operation. Instead, move them in separate operations.

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
> | locations | No | No |
> | locations / alerts | No | No |
> | locations / allowedconnections | No | No |
> | locations / applicationwhitelistings | No | No |
> | locations / discoveredsecuritysolutions | No | No |
> | locations / externalsecuritysolutions | No | No |
> | locations / jitnetworkaccesspolicies | No | No |
> | locations / securitysolutions | No | No |
> | locations / securitysolutionsreferencedata | No | No |
> | locations / tasks | No | No |
> | locations / topologies | No | No |
> | operations | No | No |
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
> | dataconnectorscheckrequirements | No | No |
> | entities | No | No |
> | entityqueries | No | No |
> | incidents | No | No |
> | officeconsents | No | No |
> | operations | No | No |
> | settings | No | No |
> | threatintelligence | No | No |

## Microsoft.SerialConsole

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | consoleservices | No | No |
> | locations | No | No |
> | locations / consoleservices | No | No |
> | operations | No | No |

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
> | checknameavailability | No | No |
> | checknamespaceavailability | No | No |
> | locations | No | No |
> | locations / deletevirtualnetworkorsubnets | No | No |
> | namespaces | Yes | Yes |
> | namespaces / authorizationrules | No | No |
> | namespaces / disasterrecoveryconfigs | No | No |
> | namespaces / disasterrecoveryconfigs / checknameavailability | No | No |
> | namespaces / eventgridfilters | No | No |
> | namespaces / networkrulesets | No | No |
> | namespaces / queues | No | No |
> | namespaces / queues / authorizationrules | No | No |
> | namespaces / topics | No | No |
> | namespaces / topics / authorizationrules | No | No |
> | namespaces / topics / subscriptions | No | No |
> | namespaces / topics / subscriptions / rules | No | No |
> | operations | No | No |
> | premiummessagingregions | No | No |
> | sku | No | No |

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
> | locations | No | No |
> | locations / clusterversions | No | No |
> | locations / environments | No | No |
> | locations / operationresults | No | No |
> | locations / operations | No | No |
> | managedclusters | No | No |
> | networks | No | No |
> | operations | No | No |
> | secretstores | No | No |
> | volumes | No | No |

## Microsoft.ServiceFabricMesh

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | applications | Yes | Yes |
> | containergroups | No | No |
> | gateways | Yes | Yes |
> | locations | No | No |
> | locations / applicationoperations | No | No |
> | locations / gatewayoperations | No | No |
> | locations / networkoperations | No | No |
> | locations / secretoperations | No | No |
> | locations / volumeoperations | No | No |
> | networks | Yes | Yes |
> | operations | No | No |
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
> | locations | No | No |
> | locations / checknameavailability | No | No |
> | locations / operationresults | No | No |
> | locations / operationstatuses | No | No |
> | locations / usages | No | No |
> | operations | No | No |
> | signalr | Yes | Yes |
> | signalr / eventgridfilters | No | No |

## Microsoft.SoftwarePlan

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | hybridusebenefits | No | No |
> | operations | No | No |

## Microsoft.Solutions

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | applicationdefinitions | No | No |
> | applications | No | No |
> | jitrequests | No | No |
> | locations | No | No |
> | locations / operationstatuses | No | No |
> | operations | No | No |

## Microsoft.Sql

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | checknameavailability | No | No |
> | instancepools | No | No |
> | locations | Yes | Yes |
> | locations / administratorazureasyncoperation | No | No |
> | locations / administratoroperationresults | No | No |
> | locations / auditingsettingsazureasyncoperation | No | No |
> | locations / auditingsettingsoperationresults | No | No |
> | locations / capabilities | No | No |
> | locations / databaseazureasyncoperation | No | No |
> | locations / databaseoperationresults | No | No |
> | locations / databaserestoreazureasyncoperation | No | No |
> | locations / deletevirtualnetworkorsubnets | No | No |
> | locations / deletevirtualnetworkorsubnetsazureasyncoperation | No | No |
> | locations / deletevirtualnetworkorsubnetsoperationresults | No | No |
> | locations / dnsaliasasyncoperation | No | No |
> | locations / dnsaliasoperationresults | No | No |
> | locations / elasticpoolazureasyncoperation | No | No |
> | locations / elasticpooloperationresults | No | No |
> | locations / encryptionprotectorazureasyncoperation | No | No |
> | locations / encryptionprotectoroperationresults | No | No |
> | locations / extendedauditingsettingsazureasyncoperation | No | No |
> | locations / extendedauditingsettingsoperationresults | No | No |
> | locations / failovergroupazureasyncoperation | No | No |
> | locations / failovergroupoperationresults | No | No |
> | locations / firewallrulesazureasyncoperation | No | No |
> | locations / firewallrulesoperationresults | No | No |
> | locations / instancefailovergroupazureasyncoperation | No | No |
> | locations / instancefailovergroupoperationresults | No | No |
> | locations / instancefailovergroups | No | No |
> | locations / instancepoolazureasyncoperation | No | No |
> | locations / instancepooloperationresults | No | No |
> | locations / jobagentazureasyncoperation | No | No |
> | locations / jobagentoperationresults | No | No |
> | locations / longtermretentionbackupazureasyncoperation | No | No |
> | locations / longtermretentionbackupoperationresults | No | No |
> | locations / longtermretentionbackups | No | No |
> | locations / longtermretentionmanagedinstancebackupazureasyncoperation | No | No |
> | locations / longtermretentionmanagedinstancebackupoperationresults | No | No |
> | locations / longtermretentionmanagedinstancebackups | No | No |
> | locations / longtermretentionmanagedinstances | No | No |
> | locations / longtermretentionpolicyazureasyncoperation | No | No |
> | locations / longtermretentionpolicyoperationresults | No | No |
> | locations / longtermretentionservers | No | No |
> | locations / manageddatabaseazureasyncoperation | No | No |
> | locations / manageddatabasecompleterestoreazureasyncoperation | No | No |
> | locations / manageddatabasecompleterestoreoperationresults | No | No |
> | locations / manageddatabaseoperationresults | No | No |
> | locations / manageddatabaserestoreazureasyncoperation | No | No |
> | locations / manageddatabaserestoreoperationresults | No | No |
> | locations / managedinstanceazureasyncoperation | No | No |
> | locations / managedinstanceencryptionprotectorazureasyncoperation | No | No |
> | locations / managedinstanceencryptionprotectoroperationresults | No | No |
> | locations / managedinstancekeyazureasyncoperation | No | No |
> | locations / managedinstancekeyoperationresults | No | No |
> | locations / managedinstancelongtermretentionpolicyazureasyncoperation | No | No |
> | locations / managedinstancelongtermretentionpolicyoperationresults | No | No |
> | locations / managedinstanceoperationresults | No | No |
> | locations / managedinstancetdecertazureasyncoperation | No | No |
> | locations / managedinstancetdecertoperationresults | No | No |
> | locations / managedserversecurityalertpoliciesazureasyncoperation | No | No |
> | locations / managedserversecurityalertpoliciesoperationresults | No | No |
> | locations / managedshorttermretentionpolicyazureasyncoperation | No | No |
> | locations / managedshorttermretentionpolicyoperationresults | No | No |
> | locations / notifyazureasyncoperation | No | No |
> | locations / privateendpointconnectionazureasyncoperation | No | No |
> | locations / privateendpointconnectionoperationresults | No | No |
> | locations / privateendpointconnectionproxyazureasyncoperation | No | No |
> | locations / privateendpointconnectionproxyoperationresults | No | No |
> | locations / securityalertpoliciesazureasyncoperation | No | No |
> | locations / securityalertpoliciesoperationresults | No | No |
> | locations / serveradministratorazureasyncoperation | No | No |
> | locations / serveradministratoroperationresults | No | No |
> | locations / serverazureasyncoperation | No | No |
> | locations / serverkeyazureasyncoperation | No | No |
> | locations / serverkeyoperationresults | No | No |
> | locations / serveroperationresults | No | No |
> | locations / shorttermretentionpolicyazureasyncoperation | No | No |
> | locations / shorttermretentionpolicyoperationresults | No | No |
> | locations / syncagentoperationresults | No | No |
> | locations / syncdatabaseids | No | No |
> | locations / syncgroupoperationresults | No | No |
> | locations / syncmemberoperationresults | No | No |
> | locations / tdecertazureasyncoperation | No | No |
> | locations / tdecertoperationresults | No | No |
> | locations / usages | No | No |
> | locations / virtualclusterazureasyncoperation | No | No |
> | locations / virtualclusteroperationresults | No | No |
> | locations / virtualnetworkrulesazureasyncoperation | No | No |
> | locations / virtualnetworkrulesoperationresults | No | No |
> | locations / vulnerabilityassessmentscanazureasyncoperation | No | No |
> | locations / vulnerabilityassessmentscanoperationresults | No | No |
> | managedinstances | No | No |
> | managedinstances / administrators | No | No |
> | managedinstances / databases | No | No |
> | managedinstances / databases / backuplongtermretentionpolicies | No | No |
> | managedinstances / databases / vulnerabilityassessments | No | No |
> | managedinstances / metricdefinitions | No | No |
> | managedinstances / metrics | No | No |
> | managedinstances / recoverabledatabases | No | No |
> | managedinstances / tdecertificates | No | No |
> | managedinstances / vulnerabilityassessments | No | No |
> | operations | No | No |
> | servers | Yes | Yes |
> | servers / administratoroperationresults | No | No |
> | servers / administrators | No | No |
> | servers / advisors | No | No |
> | servers / aggregateddatabasemetrics | No | No |
> | servers / auditingpolicies | No | No |
> | servers / auditingsettings | No | No |
> | servers / automatictuning | No | No |
> | servers / communicationlinks | No | No |
> | servers / connectionpolicies | No | No |
> | servers / databases | Yes | Yes |
> | servers / databases / advisors | No | No |
> | servers / databases / auditingpolicies | No | No |
> | servers / databases / auditingsettings | No | No |
> | servers / databases / auditrecords | No | No |
> | servers / databases / automatictuning | No | No |
> | servers / databases / backuplongtermretentionpolicies | No | No |
> | servers / databases / backupshorttermretentionpolicies | No | No |
> | servers / databases / connectionpolicies | No | No |
> | servers / databases / datamaskingpolicies | No | No |
> | servers / databases / datamaskingpolicies / rules | No | No |
> | servers / databases / extensions | No | No |
> | servers / databases / geobackuppolicies | No | No |
> | servers / databases / metricdefinitions | No | No |
> | servers / databases / metrics | No | No |
> | servers / databases / recommendedsensitivitylabels | No | No |
> | servers / databases / securityalertpolicies | No | No |
> | servers / databases / syncgroups | No | No |
> | servers / databases / syncgroups / syncmembers | No | No |
> | servers / databases / topqueries | No | No |
> | servers / databases / topqueries / querytext | No | No |
> | servers / databases / transparentdataencryption | No | No |
> | servers / databases / vulnerabilityassessment | No | No |
> | servers / databases / vulnerabilityassessments | No | No |
> | servers / databases / vulnerabilityassessmentscans | No | No |
> | servers / databases / vulnerabilityassessmentsettings | No | No |
> | servers / databases / workloadgroups | No | No |
> | servers / databasesecuritypolicies | No | No |
> | servers / disasterrecoveryconfiguration | No | No |
> | servers / dnsaliases | No | No |
> | servers / elasticpoolestimates | No | No |
> | servers / elasticpools | Yes | Yes |
> | servers / elasticpools / advisors | No | No |
> | servers / elasticpools / metricdefinitions | No | No |
> | servers / elasticpools / metrics | No | No |
> | servers / encryptionprotector | No | No |
> | servers / extendedauditingsettings | No | No |
> | servers / failovergroups | No | No |
> | servers / import | No | No |
> | servers / importexportoperationresults | No | No |
> | servers / jobaccounts | Yes | Yes |
> | servers / jobagents | Yes | Yes |
> | servers / jobagents / jobs | No | No |
> | servers / jobagents / jobs / executions | No | No |
> | servers / jobagents / jobs / steps | No | No |
> | servers / keys | No | No |
> | servers / operationresults | No | No |
> | servers / recommendedelasticpools | No | No |
> | servers / recoverabledatabases | No | No |
> | servers / restorabledroppeddatabases | No | No |
> | servers / securityalertpolicies | No | No |
> | servers / serviceobjectives | No | No |
> | servers / syncagents | No | No |
> | servers / tdecertificates | No | No |
> | servers / usages | No | No |
> | servers / virtualnetworkrules | No | No |
> | servers / vulnerabilityassessments | No | No |
> | virtualclusters | Yes | Yes |

> [!IMPORTANT]
> A database and server must be in the same resource group. When you move a SQL server, all its databases are also moved. This behavior applies to Azure SQL Database and Azure SQL Data Warehouse databases.

## Microsoft.SqlVirtualMachine

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | locations | No | No |
> | locations / availabilitygrouplisteneroperationresults | No | No |
> | locations / operationtypes | No | No |
> | locations / sqlvirtualmachinegroupoperationresults | No | No |
> | locations / sqlvirtualmachineoperationresults | No | No |
> | operations | No | No |
> | sqlvirtualmachinegroups | Yes | Yes |
> | sqlvirtualmachinegroups / availabilitygrouplisteners | No | No |
> | sqlvirtualmachines | Yes | Yes |

## Microsoft.Storage

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | checknameavailability | No | No |
> | locations | No | No |
> | locations / asyncoperations | No | No |
> | locations / checknameavailability | No | No |
> | locations / deletevirtualnetworkorsubnets | No | No |
> | locations / usages | No | No |
> | operations | No | No |
> | storageaccounts | Yes | Yes |
> | storageaccounts / blobservices | No | No |
> | storageaccounts / fileservices | No | No |
> | storageaccounts / listaccountsas | No | No |
> | storageaccounts / listservicesas | No | No |
> | storageaccounts / queueservices | No | No |
> | storageaccounts / services | No | No |
> | storageaccounts / services / metricdefinitions | No | No |
> | storageaccounts / tableservices | No | No |
> | usages | No | No |

## Microsoft.StorageCache

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | caches | No | No |

## Microsoft.StorageSync

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | locations | No | No |
> | locations / checknameavailability | No | No |
> | locations / operationresults | No | No |
> | locations / operations | No | No |
> | locations / workflows | No | No |
> | operations | No | No |
> | storagesyncservices | Yes | Yes |
> | storagesyncservices / registeredservers | No | No |
> | storagesyncservices / syncgroups | No | No |
> | storagesyncservices / syncgroups / cloudendpoints | No | No |
> | storagesyncservices / syncgroups / serverendpoints | No | No |
> | storagesyncservices / workflows | No | No |

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
> | operations | No | No |

## Microsoft.StreamAnalytics

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | clusters | No | No |
> | locations | No | No |
> | locations / quotas | No | No |
> | operations | No | No |
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
> | cancel | No | No |
> | createsubscription | No | No |
> | enable | No | No |
> | operationresults | No | No |
> | operations | No | No |
> | rename | No | No |
> | subscriptiondefinitions | No | No |
> | subscriptionoperations | No | No |
> | subscriptions | No | No |

## microsoft.support

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | checknameavailability | No | No |
> | operationresults | No | No |
> | operations | No | No |
> | operationsstatus | No | No |
> | services | No | No |
> | services / problemclassifications | No | No |
> | supporttickets | No | No |

## Microsoft.Synapse

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | checknameavailability | No | No |
> | operations | No | No |
> | workspaces | Yes | Yes |
> | workspaces / bigdatapools | Yes | Yes |
> | workspaces / operationresults | No | No |
> | workspaces / operationstatuses | No | No |
> | workspaces / sqlpools | Yes | Yes |

## Microsoft.TimeSeriesInsights

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | environments | Yes | Yes |
> | environments / accesspolicies | No | No |
> | environments / eventsources | Yes | Yes |
> | environments / referencedatasets | Yes | Yes |
> | operations | No | No |

## Microsoft.Token

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | stores | Yes | Yes |
> | stores / accesspolicies | No | No |
> | stores / services | No | No |
> | stores / services / tokens | No | No |

## Microsoft.VirtualMachineImages

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | imagetemplates | No | No |
> | imagetemplates / runoutputs | No | No |
> | locations | No | No |
> | locations / operations | No | No |
> | operations | No | No |

## microsoft.visualstudio

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | account | No | No |
> | account / extension | No | No |
> | account / project | No | No |
> | checknameavailability | No | No |
> | operations | No | No |

> [!IMPORTANT]
> To change the subscription for Azure DevOps, see [change the Azure subscription used for billing](/azure/devops/organizations/billing/change-azure-subscription?toc=/azure/azure-resource-manager/toc.json).

## Microsoft.VMware

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | arczones | No | No |
> | locations | No | No |
> | locations / operationstatuses | No | No |
> | operations | No | No |
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
> | locations | No | No |
> | locations / availabilities | No | No |
> | locations / operationresults | No | No |
> | locations / privateclouds | No | No |
> | locations / privateclouds / resourcepools | No | No |
> | locations / privateclouds / virtualmachinetemplates | No | No |
> | locations / privateclouds / virtualnetworks | No | No |
> | locations / usages | No | No |
> | operations | No | No |
> | virtualmachines | No | No |

## Microsoft.VnfManager

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | devices | No | No |
> | locations | No | No |
> | locations / operationstatuses | No | No |
> | operations | No | No |
> | vnfs | No | No |

## Microsoft.VSOnline

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | accounts | No | No |
> | operations | No | No |
> | plans | No | No |
> | registeredsubscriptions | No | No |

## Microsoft.Web

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | availablestacks | No | No |
> | billingmeters | No | No |
> | certificates | No | Yes |
> | checknameavailability | No | No |
> | connectiongateways | Yes | Yes |
> | connections | Yes | Yes |
> | customapis | Yes | Yes |
> | deletedsites | No | No |
> | deploymentlocations | No | No |
> | georegions | No | No |
> | hostingenvironments | No | No |
> | hostingenvironments / eventgridfilters | No | No |
> | hostingenvironments / multirolepools | No | No |
> | hostingenvironments / workerpools | No | No |
> | ishostingenvironmentnameavailable | No | No |
> | ishostnameavailable | No | No |
> | isusernameavailable | No | No |
> | kubeenvironments | Yes | Yes |
> | listsitesassignedtohostname | No | No |
> | locations | No | No |
> | locations / apioperations | No | No |
> | locations / connectiongatewayinstallations | No | No |
> | locations / deletedsites | No | No |
> | locations / deletevirtualnetworkorsubnets | No | No |
> | locations / extractapidefinitionfromwsdl | No | No |
> | locations / getnetworkpolicies | No | No |
> | locations / listwsdlinterfaces | No | No |
> | locations / managedapis | No | No |
> | locations / operationresults | No | No |
> | locations / operations | No | No |
> | locations / runtimes | No | No |
> | operations | No | No |
> | publishingusers | No | No |
> | recommendations | No | No |
> | resourcehealthmetadata | No | No |
> | runtimes | No | No |
> | serverfarms | Yes | Yes |
> | serverfarms / eventgridfilters | No | No |
> | sites | Yes | Yes |
> | sites / eventgridfilters | No | No |
> | sites / hostnamebindings | No | No |
> | sites / networkconfig | No | No |
> | sites / premieraddons | Yes | Yes |
> | sites / slots | Yes | Yes |
> | sites / slots / eventgridfilters | No | No |
> | sites / slots / hostnamebindings | No | No |
> | sites / slots / networkconfig | No | No |
> | sourcecontrols | No | No |
> | staticsites | No | No |
> | validate | No | No |
> | verifyhostingenvironmentvnet | No | No |

> [!IMPORTANT]
> See [App Service move guidance](./move-limitations/app-service-move-limitations.md).

## Microsoft.WindowsESU

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | locations | No | No |
> | locations / operationstatuses | No | No |
> | multipleactivationkeys | No | No |
> | operations | No | No |

## Microsoft.WindowsIoT

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | deviceservices | No | No |
> | operations | No | No |

## Microsoft.WorkloadBuilder

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription |
> | ------------- | ----------- | ---------- |
> | locations | No | No |
> | locations / operationstatuses | No | No |
> | operations | No | No |
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
> | notificationsettings | No | No |
> | operations | No | No |

## Third-party services

Third-party services currently don't support the move operation.

## Next steps
For commands to move resources, see [Move resources to new resource group or subscription](move-resource-group-and-subscription.md).

To get the same data as a file of comma-separated values, download [move-support-resources.csv](https://github.com/tfitzmac/resource-capabilities/blob/master/move-support-resources.csv).

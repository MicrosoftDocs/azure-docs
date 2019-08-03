---
title: Azure Resource Manager complete mode deletion by resource type
description: Shows how resource types handle complete mode deletion in Azure Resource Manager templates.
author: tfitzmac
ms.service: azure-resource-manager
ms.topic: reference
ms.date: 8/2/2019
ms.author: tomfitz
---

# Deletion of Azure resources for complete mode deployments

This article describes how resource types handle deletion when not in a template that is deployed in complete mode.

The resource types marked with **Yes** are deleted when the type isn't in the template deployed with complete mode.

The resource types marked with **No** aren't automatically deleted when not in the template; however, they're deleted if the parent resource is deleted. For a full description of the behavior, see [Azure Resource Manager deployment modes](deployment-modes.md).

Jump to a resource provider namespace:
> [!div class="op_single_selector"]
> - [Microsoft.AAD](#microsoftaad)
> - [Microsoft.AADDomainServices](#microsoftaaddomainservices)
> - [Microsoft.ADHybridHealthService](#microsoftadhybridhealthservice)
> - [Microsoft.Addons](#microsoftaddons)
> - [Microsoft.Advisor](#microsoftadvisor)
> - [Microsoft.AlertsManagement](#microsoftalertsmanagement)
> - [Microsoft.AnalysisServices](#microsoftanalysisservices)
> - [Microsoft.ApiManagement](#microsoftapimanagement)
> - [Microsoft.AppConfiguration](#microsoftappconfiguration)
> - [Microsoft.Attestation](#microsoftattestation)
> - [Microsoft.Authorization](#microsoftauthorization)
> - [Microsoft.Automation](#microsoftautomation)
> - [Microsoft.Azconfig](#microsoftazconfig)
> - [Microsoft.Azure.Geneva](#microsoftazuregeneva)
> - [Microsoft.AzureActiveDirectory](#microsoftazureactivedirectory)
> - [Microsoft.AzureData](#microsoftazuredata)
> - [Microsoft.AzureStack](#microsoftazurestack)
> - [Microsoft.Batch](#microsoftbatch)
> - [Microsoft.Billing](#microsoftbilling)
> - [Microsoft.BingMaps](#microsoftbingmaps)
> - [Microsoft.BizTalkServices](#microsoftbiztalkservices)
> - [Microsoft.Blockchain](#microsoftblockchain)
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
> - [Microsoft.CustomProviders](#microsoftcustomproviders)
> - [Microsoft.CustomerInsights](#microsoftcustomerinsights)
> - [Microsoft.CustomerLockbox](#microsoftcustomerlockbox)
> - [Microsoft.DBforMariaDB](#microsoftdbformariadb)
> - [Microsoft.DBforMySQL](#microsoftdbformysql)
> - [Microsoft.DBforPostgreSQL](#microsoftdbforpostgresql)
> - [Microsoft.DataBox](#microsoftdatabox)
> - [Microsoft.DataBoxEdge](#microsoftdataboxedge)
> - [Microsoft.DataCatalog](#microsoftdatacatalog)
> - [Microsoft.DataConnect](#microsoftdataconnect)
> - [Microsoft.DataFactory](#microsoftdatafactory)
> - [Microsoft.DataLakeAnalytics](#microsoftdatalakeanalytics)
> - [Microsoft.DataLakeStore](#microsoftdatalakestore)
> - [Microsoft.DataMigration](#microsoftdatamigration)
> - [Microsoft.DataShare](#microsoftdatashare)
> - [Microsoft.Databricks](#microsoftdatabricks)
> - [Microsoft.DeploymentManager](#microsoftdeploymentmanager)
> - [Microsoft.DesktopVirtualization](#microsoftdesktopvirtualization)
> - [Microsoft.DevOps](#microsoftdevops)
> - [Microsoft.DevSpaces](#microsoftdevspaces)
> - [Microsoft.DevTestLab](#microsoftdevtestlab)
> - [Microsoft.Devices](#microsoftdevices)
> - [Microsoft.DocumentDB](#microsoftdocumentdb)
> - [Microsoft.DomainRegistration](#microsoftdomainregistration)
> - [Microsoft.DynamicsLcs](#microsoftdynamicslcs)
> - [Microsoft.EnterpriseKnowledgeGraph](#microsoftenterpriseknowledgegraph)
> - [Microsoft.EventGrid](#microsofteventgrid)
> - [Microsoft.EventHub](#microsofteventhub)
> - [Microsoft.Features](#microsoftfeatures)
> - [Microsoft.Gallery](#microsoftgallery)
> - [Microsoft.Genomics](#microsoftgenomics)
> - [Microsoft.GuestConfiguration](#microsoftguestconfiguration)
> - [Microsoft.HDInsight](#microsofthdinsight)
> - [Microsoft.HanaOnAzure](#microsofthanaonazure)
> - [Microsoft.HardwareSecurityModules](#microsofthardwaresecuritymodules)
> - [Microsoft.HealthcareApis](#microsofthealthcareapis)
> - [Microsoft.HybridCompute](#microsofthybridcompute)
> - [Microsoft.HybridData](#microsofthybriddata)
> - [Microsoft.Hydra](#microsofthydra)
> - [Microsoft.ImportExport](#microsoftimportexport)
> - [Microsoft.Intune](#microsoftintune)
> - [Microsoft.IoTCentral](#microsoftiotcentral)
> - [Microsoft.IoTSpaces](#microsoftiotspaces)
> - [Microsoft.KeyVault](#microsoftkeyvault)
> - [Microsoft.Kusto](#microsoftkusto)
> - [Microsoft.LabServices](#microsoftlabservices)
> - [Microsoft.Logic](#microsoftlogic)
> - [Microsoft.MachineLearning](#microsoftmachinelearning)
> - [Microsoft.MachineLearningServices](#microsoftmachinelearningservices)
> - [Microsoft.ManagedIdentity](#microsoftmanagedidentity)
> - [Microsoft.ManagedLab](#microsoftmanagedlab)
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
> - [Microsoft.OffAzure](#microsoftoffazure)
> - [Microsoft.OperationalInsights](#microsoftoperationalinsights)
> - [Microsoft.OperationsManagement](#microsoftoperationsmanagement)
> - [Microsoft.Peering](#microsoftpeering)
> - [Microsoft.PolicyInsights](#microsoftpolicyinsights)
> - [Microsoft.Portal](#microsoftportal)
> - [Microsoft.PowerBI](#microsoftpowerbi)
> - [Microsoft.PowerBIDedicated](#microsoftpowerbidedicated)
> - [Microsoft.ProjectOxford](#microsoftprojectoxford)
> - [Microsoft.RecoveryServices](#microsoftrecoveryservices)
> - [Microsoft.Relay](#microsoftrelay)
> - [Microsoft.RemoteApp](#microsoftremoteapp)
> - [Microsoft.ResourceGraph](#microsoftresourcegraph)
> - [Microsoft.ResourceHealth](#microsoftresourcehealth)
> - [Microsoft.Resources](#microsoftresources)
> - [Microsoft.SaaS](#microsoftsaas)
> - [Microsoft.Scheduler](#microsoftscheduler)
> - [Microsoft.Search](#microsoftsearch)
> - [Microsoft.Security](#microsoftsecurity)
> - [Microsoft.SecurityGraph](#microsoftsecuritygraph)
> - [Microsoft.SecurityInsights](#microsoftsecurityinsights)
> - [Microsoft.ServiceBus](#microsoftservicebus)
> - [Microsoft.ServiceFabric](#microsoftservicefabric)
> - [Microsoft.ServiceFabricMesh](#microsoftservicefabricmesh)
> - [Microsoft.Services](#microsoftservices)
> - [Microsoft.SignalRService](#microsoftsignalrservice)
> - [Microsoft.SiteRecovery](#microsoftsiterecovery)
> - [Microsoft.SoftwarePlan](#microsoftsoftwareplan)
> - [Microsoft.Solutions](#microsoftsolutions)
> - [Microsoft.SqlVirtualMachine](#microsoftsqlvirtualmachine)
> - [Microsoft.StorSimple](#microsoftstorsimple)
> - [Microsoft.Storage](#microsoftstorage)
> - [Microsoft.StorageCache](#microsoftstoragecache)
> - [Microsoft.StorageReplication](#microsoftstoragereplication)
> - [Microsoft.StorageSync](#microsoftstoragesync)
> - [Microsoft.StorageSyncDev](#microsoftstoragesyncdev)
> - [Microsoft.StorageSyncInt](#microsoftstoragesyncint)
> - [Microsoft.StreamAnalytics](#microsoftstreamanalytics)
> - [Microsoft.Subscription](#microsoftsubscription)
> - [Microsoft.TimeSeriesInsights](#microsofttimeseriesinsights)
> - [Microsoft.VMwareCloudSimple](#microsoftvmwarecloudsimple)
> - [Microsoft.Web](#microsoftweb)
> - [Microsoft.WindowsDefenderATP](#microsoftwindowsdefenderatp)
> - [Microsoft.WindowsIoT](#microsoftwindowsiot)
> - [Microsoft.WorkloadMonitor](#microsoftworkloadmonitor)

## Microsoft.AAD

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | domainservices | Yes |
> | domainservices/oucontainer | No |
> | domainservices/replicasets | Yes |

## Microsoft.AADDomainServices

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | domains | No |

## Microsoft.ADHybridHealthService

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
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

## Microsoft.Addons

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | supportproviders | No |

## Microsoft.Advisor

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | configurations | No |
> | generaterecommendations | No |
> | metadata | No |
> | recommendations | No |
> | suppressions | No |

## Microsoft.AlertsManagement

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | actionrules | Yes |
> | alerts | No |
> | alertslist | No |
> | alertsmetadata | No |
> | alertssummary | No |
> | alertssummarylist | No |
> | feedback | No |
> | smartdetectoralertrules | No |
> | smartdetectorruntimeenvironments | No |
> | smartgroups | No |

## Microsoft.AnalysisServices

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | servers | Yes |

## Microsoft.ApiManagement

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | reportfeedback | No |
> | service | Yes |
> | validateservicename | No |

## Microsoft.AppConfiguration

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | configurationstores | Yes |
> | configurationstores/eventgridfilters | No |

## Microsoft.Attestation

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | attestationproviders | No |

## Microsoft.Authorization

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | classicadministrators | No |
> | dataaliases | No |
> | denyassignments | No |
> | elevateaccess | No |
> | locks | No |
> | permissions | No |
> | policyassignments | No |
> | policydefinitions | No |
> | policysetdefinitions | No |
> | provideroperations | No |
> | roleassignments | No |
> | roledefinitions | No |

## Microsoft.Automation

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | automationaccounts | Yes |
> | automationaccounts/configurations | Yes |
> | automationaccounts/jobs | No |
> | automationaccounts/runbooks | Yes |
> | automationaccounts/softwareupdateconfigurations | No |
> | automationaccounts/webhooks | No |

## Microsoft.Azconfig

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | configurationstores | Yes |
> | configurationstores/eventgridfilters | No |

## Microsoft.Azure.Geneva

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | environments | No |
> | environments/accounts | No |
> | environments/accounts/namespaces | No |
> | environments/accounts/namespaces/configurations | No |

## Microsoft.AzureActiveDirectory

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | b2cdirectories | Yes |
> | b2ctenants | No |

## Microsoft.AzureData

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | sqlserverregistrations | Yes |
> | sqlserverregistrations/sqlservers | No |

## Microsoft.AzureStack

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | registrations | Yes |
> | registrations/customersubscriptions | No |
> | registrations/products | No |

## Microsoft.Batch

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | batchaccounts | Yes |

## Microsoft.Billing

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | billingaccounts | No |
> | billingaccounts/agreements | No |
> | billingaccounts/billingprofiles | No |
> | billingaccounts/billingprofiles/billingsubscriptions | No |
> | billingaccounts/billingprofiles/invoices | No |
> | billingaccounts/billingprofiles/invoices/pricesheet | No |
> | billingaccounts/billingprofiles/invoicesections | No |
> | billingaccounts/billingprofiles/patchoperations | No |
> | billingaccounts/billingprofiles/paymentmethods | No |
> | billingaccounts/billingprofiles/policies | No |
> | billingaccounts/billingprofiles/pricesheet | No |
> | billingaccounts/billingprofiles/pricesheetdownloadoperations | No |
> | billingaccounts/billingprofiles/products | No |
> | billingaccounts/billingprofiles/transactions | No |
> | billingaccounts/billingsubscriptions | No |
> | billingaccounts/createinvoicesectionoperations | No |
> | billingaccounts/customers | No |
> | billingaccounts/customers/billingsubscriptions | No |
> | billingaccounts/departments | No |
> | billingaccounts/enrollmentaccounts | No |
> | billingaccounts/invoices | No |
> | billingaccounts/invoicesections | No |
> | billingaccounts/invoicesections/billingsubscriptionmoveoperations | No |
> | billingaccounts/invoicesections/billingsubscriptions | No |
> | billingaccounts/invoicesections/billingsubscriptions/transfer | No |
> | billingaccounts/invoicesections/elevate | No |
> | billingaccounts/invoicesections/initiatetransfer | No |
> | billingaccounts/invoicesections/patchoperations | No |
> | billingaccounts/invoicesections/productmoveoperations | No |
> | billingaccounts/invoicesections/products | No |
> | billingaccounts/invoicesections/products/transfer | No |
> | billingaccounts/invoicesections/products/updateautorenew | No |
> | billingaccounts/invoicesections/transactions | No |
> | billingaccounts/invoicesections/transfers | No |
> | billingaccounts/lineofcredit | No |
> | billingaccounts/patchoperations | No |
> | billingaccounts/paymentmethods | No |
> | billingaccounts/products | No |
> | billingaccounts/transactions | No |
> | billingperiods | No |
> | billingpermissions | No |
> | billingproperty | No |
> | billingroleassignments | No |
> | billingroledefinitions | No |
> | createbillingroleassignment | No |
> | departments | No |
> | enrollmentaccounts | No |
> | invoices | No |
> | transfers | No |
> | transfers/accepttransfer | No |
> | transfers/declinetransfer | No |
> | transfers/operationstatus | No |
> | validateaddress | No |

## Microsoft.BingMaps

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | mapapis | Yes |
> | updatecommunicationpreference | No |

## Microsoft.BizTalkServices

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | biztalk | Yes |

## Microsoft.Blockchain

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | blockchainmembers | Yes |
> | watchers | Yes |

## Microsoft.Blueprint

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | blueprintassignments | No |
> | blueprintassignments/assignmentoperations | No |
> | blueprintassignments/operations | No |
> | blueprints | No |
> | blueprints/artifacts | No |
> | blueprints/versions | No |
> | blueprints/versions/artifacts | No |

## Microsoft.BotService

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | botservices | Yes |
> | botservices/channels | No |
> | botservices/connections | No |
> | languages | No |
> | templates | No |

## Microsoft.Cache

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | redis | Yes |
> | redisconfigdefinition | No |

## Microsoft.Capacity

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | appliedreservations | No |
> | calculateexchange | No |
> | calculateprice | No |
> | calculatepurchaseprice | No |
> | catalogs | No |
> | commercialreservationorders | No |
> | exchange | No |
> | placepurchaseorder | No |
> | reservationorders | No |
> | reservationorders/calculaterefund | No |
> | reservationorders/merge | No |
> | reservationorders/reservations | No |
> | reservationorders/reservations/revisions | No |
> | reservationorders/return | No |
> | reservationorders/split | No |
> | reservationorders/swap | No |
> | reservations | No |
> | resources | No |
> | validatereservationorder | No |

## Microsoft.Cdn

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | cdnwebapplicationfirewallmanagedrulesets | No |
> | cdnwebapplicationfirewallpolicies | Yes |
> | edgenodes | No |
> | profiles | Yes |
> | profiles/endpoints | Yes |
> | profiles/endpoints/customdomains | No |
> | profiles/endpoints/origins | No |
> | validateprobe | No |

## Microsoft.CertificateRegistration

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | certificateorders | Yes |
> | certificateorders/certificates | No |
> | validatecertificateregistrationinformation | No |

## Microsoft.ClassicCompute

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | capabilities | No |
> | domainnames | Yes |
> | domainnames/capabilities | No |
> | domainnames/internalloadbalancers | No |
> | domainnames/servicecertificates | No |
> | domainnames/slots | No |
> | domainnames/slots/roles | No |
> | domainnames/slots/roles/metricdefinitions | No |
> | domainnames/slots/roles/metrics | No |
> | movesubscriptionresources | No |
> | operatingsystemfamilies | No |
> | operatingsystems | No |
> | quotas | No |
> | resourcetypes | No |
> | validatesubscriptionmoveavailability | No |
> | virtualmachines | Yes |
> | virtualmachines/diagnosticsettings | No |
> | virtualmachines/metricdefinitions | No |
> | virtualmachines/metrics | No |

## Microsoft.ClassicInfrastructureMigrate

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | classicinfrastructureresources | No |

## Microsoft.ClassicNetwork

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | capabilities | No |
> | expressroutecrossconnections | No |
> | expressroutecrossconnections/peerings | No |
> | gatewaysupporteddevices | No |
> | networksecuritygroups | Yes |
> | quotas | No |
> | reservedips | Yes |
> | virtualnetworks | Yes |
> | virtualnetworks/remotevirtualnetworkpeeringproxies | No |
> | virtualnetworks/virtualnetworkpeerings | No |

## Microsoft.ClassicStorage

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | capabilities | No |
> | disks | No |
> | images | No |
> | osimages | No |
> | osplatformimages | No |
> | publicimages | No |
> | quotas | No |
> | storageaccounts | Yes |
> | storageaccounts/metricdefinitions | No |
> | storageaccounts/metrics | No |
> | storageaccounts/services | No |
> | storageaccounts/services/diagnosticsettings | No |
> | storageaccounts/services/metricdefinitions | No |
> | storageaccounts/services/metrics | No |
> | storageaccounts/vmimages | No |
> | vmimages | No |

## Microsoft.CognitiveServices

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | accounts | Yes |

## Microsoft.Commerce

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | ratecard | No |
> | usageaggregates | No |

## Microsoft.Compute

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | availabilitysets | Yes |
> | diskencryptionsets | Yes |
> | disks | Yes |
> | galleries | Yes |
> | galleries/applications | Yes |
> | galleries/applications/versions | Yes |
> | galleries/images | Yes |
> | galleries/images/versions | Yes |
> | hostgroups | Yes |
> | hostgroups/hosts | Yes |
> | images | Yes |
> | proximityplacementgroups | Yes |
> | restorepointcollections | Yes |
> | restorepointcollections/restorepoints | No |
> | sharedvmimages | Yes |
> | sharedvmimages/versions | Yes |
> | snapshots | Yes |
> | virtualmachines | Yes |
> | virtualmachines/extensions | Yes |
> | virtualmachines/metricdefinitions | No |
> | virtualmachines/scriptjobs | No |
> | virtualmachines/softwareupdatedeployments | No |
> | virtualmachinescalesets | Yes |
> | virtualmachinescalesets/extensions | No |
> | virtualmachinescalesets/networkinterfaces | No |
> | virtualmachinescalesets/publicipaddresses | No |
> | virtualmachinescalesets/virtualmachines | No |
> | virtualmachinescalesets/virtualmachines/networkinterfaces | No |

## Microsoft.Consumption

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
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
> | reservationrecommendations | No |
> | reservationsummaries | No |
> | reservationtransactions | No |
> | tags | No |
> | tenants | No |
> | terms | No |
> | usagedetails | No |

## Microsoft.ContainerInstance

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | containergroups | Yes |
> | serviceassociationlinks | No |

## Microsoft.ContainerRegistry

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | registries | Yes |
> | registries/builds | No |
> | registries/builds/cancel | No |
> | registries/builds/getloglink | No |
> | registries/buildtasks | Yes |
> | registries/buildtasks/steps | No |
> | registries/eventgridfilters | No |
> | registries/getbuildsourceuploadurl | No |
> | registries/getcredentials | No |
> | registries/importimage | No |
> | registries/queuebuild | No |
> | registries/regeneratecredential | No |
> | registries/regeneratecredentials | No |
> | registries/replications | Yes |
> | registries/runs | No |
> | registries/runs/cancel | No |
> | registries/schedulerun | No |
> | registries/tasks | Yes |
> | registries/updatepolicies | No |
> | registries/webhooks | Yes |
> | registries/webhooks/getcallbackconfig | No |
> | registries/webhooks/ping | No |

## Microsoft.ContainerService

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | containerservices | Yes |
> | managedclusters | Yes |
> | openshiftmanagedclusters | Yes |

## Microsoft.ContentModerator

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | applications | Yes |
> | updatecommunicationpreference | No |

## Microsoft.CortanaAnalytics

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | accounts | Yes |

## Microsoft.CostManagement

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | alerts | No |
> | billingaccounts | No |
> | budgets | No |
> | cloudconnectors | No |
> | connectors | Yes |
> | departments | No |
> | dimensions | No |
> | enrollmentaccounts | No |
> | exports | No |
> | externalbillingaccounts | No |
> | externalbillingaccounts/alerts | No |
> | externalbillingaccounts/dimensions | No |
> | externalbillingaccounts/forecast | No |
> | externalbillingaccounts/query | No |
> | externalsubscriptions | No |
> | externalsubscriptions/alerts | No |
> | externalsubscriptions/dimensions | No |
> | externalsubscriptions/forecast | No |
> | externalsubscriptions/query | No |
> | forecast | No |
> | query | No |
> | register | No |
> | reportconfigs | No |
> | reports | No |
> | settings | No |
> | showbackrules | No |
> | views | No |

## Microsoft.CustomProviders

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | associations | No |
> | resourceproviders | Yes |

## Microsoft.CustomerInsights

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | hubs | Yes |
> | hubs/authorizationpolicies | No |
> | hubs/connectors | No |
> | hubs/connectors/mappings | No |
> | hubs/interactions | No |
> | hubs/kpi | No |
> | hubs/links | No |
> | hubs/profiles | No |
> | hubs/roleassignments | No |
> | hubs/roles | No |
> | hubs/suggesttypeschema | No |
> | hubs/views | No |
> | hubs/widgettypes | No |

## Microsoft.CustomerLockbox

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | requests | No |

## Microsoft.DBforMariaDB

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | servers | Yes |
> | servers/advisors | No |
> | servers/querytexts | No |
> | servers/recoverableservers | No |
> | servers/topquerystatistics | No |
> | servers/virtualnetworkrules | No |
> | servers/waitstatistics | No |

## Microsoft.DBforMySQL

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | servers | Yes |
> | servers/advisors | No |
> | servers/querytexts | No |
> | servers/recoverableservers | No |
> | servers/topquerystatistics | No |
> | servers/virtualnetworkrules | No |
> | servers/waitstatistics | No |

## Microsoft.DBforPostgreSQL

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | servergroups | Yes |
> | servers | Yes |
> | servers/advisors | No |
> | servers/querytexts | No |
> | servers/recoverableservers | No |
> | servers/topquerystatistics | No |
> | servers/virtualnetworkrules | No |
> | servers/waitstatistics | No |
> | serversv2 | Yes |

## Microsoft.DataBox

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | jobs | Yes |

## Microsoft.DataBoxEdge

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | databoxedgedevices | Yes |

## Microsoft.DataCatalog

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | catalogs | Yes |
> | datacatalogs | Yes |
> | datacatalogs/scantargets | No |
> | datacatalogs/scantargets/datasets | No |

## Microsoft.DataConnect

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | connectionmanagers | Yes |

## Microsoft.DataFactory

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | datafactories | Yes |
> | datafactories/diagnosticsettings | No |
> | datafactories/metricdefinitions | No |
> | datafactoryschema | No |
> | factories | Yes |
> | factories/integrationruntimes | No |

## Microsoft.DataLakeAnalytics

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | accounts | Yes |
> | accounts/datalakestoreaccounts | No |
> | accounts/storageaccounts | No |
> | accounts/storageaccounts/containers | No |
> | accounts/transferanalyticsunits | No |

## Microsoft.DataLakeStore

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | accounts | Yes |
> | accounts/eventgridfilters | No |
> | accounts/firewallrules | No |

## Microsoft.DataMigration

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | services | Yes |
> | services/projects | Yes |
> | slots | Yes |

## Microsoft.DataShare

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | accounts | Yes |
> | accounts/shares | No |
> | accounts/shares/datasets | No |
> | accounts/shares/invitations | No |
> | accounts/shares/providersharesubscriptions | No |
> | accounts/shares/synchronizationsettings | No |
> | accounts/sharesubscriptions | No |
> | accounts/sharesubscriptions/consumersourcedatasets | No |
> | accounts/sharesubscriptions/datasetmappings | No |
> | accounts/sharesubscriptions/triggers | No |

## Microsoft.Databricks

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | workspaces | Yes |
> | workspaces/virtualnetworkpeerings | No |

## Microsoft.DeploymentManager

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | artifactsources | Yes |
> | rollouts | Yes |
> | servicetopologies | Yes |
> | servicetopologies/services | Yes |
> | servicetopologies/services/serviceunits | Yes |
> | steps | Yes |

## Microsoft.DesktopVirtualization

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | applicationgroups | Yes |
> | applicationgroups/applications | No |
> | applicationgroups/assignedusers | No |
> | applicationgroups/startmenuitems | No |
> | hostpools | Yes |
> | hostpools/sessionhosts | No |
> | hostpools/sessionhosts/usersessions | No |
> | hostpools/usersessions | No |
> | workspaces | Yes |

## Microsoft.DevOps

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | pipelines | Yes |

## Microsoft.DevSpaces

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | controllers | Yes |

## Microsoft.DevTestLab

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | labcenters | Yes |
> | labs | Yes |
> | labs/environments | Yes |
> | labs/servicerunners | Yes |
> | labs/virtualmachines | Yes |
> | schedules | Yes |

## Microsoft.Devices

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | elasticpools | Yes |
> | elasticpools/iothubtenants | Yes |
> | iothubs | Yes |
> | iothubs/eventgridfilters | No |
> | provisioningservices | Yes |
> | usages | No |

## Microsoft.DocumentDB

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | databaseaccountnames | No |
> | databaseaccounts | Yes |

## Microsoft.DomainRegistration

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | domains | Yes |
> | domains/domainownershipidentifiers | No |
> | generatessorequest | No |
> | topleveldomains | No |
> | validatedomainregistrationinformation | No |

## Microsoft.DynamicsLcs

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | lcsprojects | No |
> | lcsprojects/clouddeployments | No |
> | lcsprojects/connectors | No |

## Microsoft.EnterpriseKnowledgeGraph

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | services | Yes |

## Microsoft.EventGrid

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | domains | Yes |
> | domains/topics | No |
> | eventsubscriptions | No |
> | extensiontopics | No |
> | topics | Yes |
> | topictypes | No |

## Microsoft.EventHub

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | clusters | Yes |
> | namespaces | Yes |
> | namespaces/authorizationrules | No |
> | namespaces/disasterrecoveryconfigs | No |
> | namespaces/eventhubs | No |
> | namespaces/eventhubs/authorizationrules | No |
> | namespaces/eventhubs/consumergroups | No |
> | namespaces/networkrulesets | No |

## Microsoft.Features

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | features | No |
> | providers | No |

## Microsoft.Gallery

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | enroll | No |
> | galleryitems | No |
> | generateartifactaccessuri | No |
> | myareas | No |
> | myareas/areas | No |
> | myareas/areas/areas | No |
> | myareas/areas/areas/galleryitems | No |
> | myareas/areas/galleryitems | No |
> | myareas/galleryitems | No |
> | register | No |
> | resources | No |
> | retrieveresourcesbyid | No |

## Microsoft.Genomics

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | accounts | Yes |

## Microsoft.GuestConfiguration

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | guestconfigurationassignments | No |
> | software | No |
> | softwareupdateprofile | No |
> | softwareupdates | No |

## Microsoft.HDInsight

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | clusters | Yes |
> | clusters/applications | No |

## Microsoft.HanaOnAzure

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | hanainstances | Yes |
> | sapmonitors | Yes |

## Microsoft.HardwareSecurityModules

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | dedicatedhsms | Yes |

## Microsoft.HealthcareApis

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | services | Yes |

## Microsoft.HybridCompute

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | machines | Yes |

## Microsoft.HybridData

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | datamanagers | Yes |

## Microsoft.Hydra

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | components | Yes |
> | networkscopes | Yes |

## Microsoft.ImportExport

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | jobs | Yes |

## Microsoft.Intune

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | diagnosticsettings | No |
> | diagnosticsettingscategories | No |

## Microsoft.IoTCentral

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | apptemplates | No |
> | iotapps | Yes |

## Microsoft.IoTSpaces

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | graph | Yes |

## Microsoft.KeyVault

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | deletedvaults | No |
> | hsmpools | Yes |
> | vaults | Yes |
> | vaults/accesspolicies | No |
> | vaults/eventgridfilters | No |
> | vaults/secrets | No |

## Microsoft.Kusto

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | clusters | Yes |
> | clusters/attacheddatabaseconfigurations | No |
> | clusters/databases | No |
> | clusters/databases/dataconnections | No |
> | clusters/databases/eventhubconnections | No |

## Microsoft.LabServices

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | labaccounts | Yes |
> | users | No |

## Microsoft.Logic

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | hostingenvironments | Yes |
> | integrationaccounts | Yes |
> | integrationserviceenvironments | Yes |
> | isolatedenvironments | Yes |
> | workflows | Yes |

## Microsoft.MachineLearning

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | commitmentplans | Yes |
> | webservices | Yes |
> | workspaces | Yes |

## Microsoft.MachineLearningServices

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | workspaces | Yes |
> | workspaces/computes | No |

## Microsoft.ManagedIdentity

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | identities | No |
> | userassignedidentities | Yes |

## Microsoft.ManagedLab

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | labaccounts | Yes |

## Microsoft.ManagedServices

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | marketplaceregistrationdefinitions | No |
> | registrationassignments | No |
> | registrationdefinitions | No |

## Microsoft.Management

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | getentities | No |
> | managementgroups | No |
> | resources | No |
> | starttenantbackfill | No |
> | tenantbackfillstatus | No |

## Microsoft.Maps

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | accounts | Yes |
> | accounts/eventgridfilters | No |

## Microsoft.Marketplace

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | offers | No |
> | offertypes | No |
> | offertypes/publishers | No |
> | offertypes/publishers/offers | No |
> | offertypes/publishers/offers/plans | No |
> | offertypes/publishers/offers/plans/agreements | No |
> | offertypes/publishers/offers/plans/configs | No |
> | offertypes/publishers/offers/plans/configs/importimage | No |
> | privategalleryitems | No |
> | products | No |
> | publishers | No |
> | publishers/offers | No |
> | publishers/offers/amendments | No |

## Microsoft.MarketplaceApps

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | classicdevservices | Yes |
> | updatecommunicationpreference | No |

## Microsoft.MarketplaceOrdering

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | agreements | No |
> | offertypes | No |

## Microsoft.Media

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | mediaservices | Yes |
> | mediaservices/accountfilters | No |
> | mediaservices/assets | No |
> | mediaservices/assets/assetfilters | No |
> | mediaservices/contentkeypolicies | No |
> | mediaservices/eventgridfilters | No |
> | mediaservices/liveeventoperations | No |
> | mediaservices/liveevents | Yes |
> | mediaservices/liveevents/liveoutputs | No |
> | mediaservices/liveoutputoperations | No |
> | mediaservices/streamingendpointoperations | No |
> | mediaservices/streamingendpoints | Yes |
> | mediaservices/streaminglocators | No |
> | mediaservices/streamingpolicies | No |
> | mediaservices/transforms | No |
> | mediaservices/transforms/jobs | No |

## Microsoft.Microservices4Spring

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | appclusters | Yes |

## Microsoft.Migrate

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | assessmentprojects | Yes |
> | migrateprojects | Yes |
> | projects | Yes |

## Microsoft.MixedReality

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | remoterenderingaccounts | Yes |
> | spatialanchorsaccounts | Yes |

## Microsoft.NetApp

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | netappaccounts | Yes |
> | netappaccounts/capacitypools | Yes |
> | netappaccounts/capacitypools/volumes | Yes |
> | netappaccounts/capacitypools/volumes/mounttargets | Yes |
> | netappaccounts/capacitypools/volumes/snapshots | Yes |

## Microsoft.Network

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | applicationgateways | Yes |
> | applicationgatewaywebapplicationfirewallpolicies | Yes |
> | applicationsecuritygroups | Yes |
> | azurefirewallfqdntags | No |
> | azurefirewalls | Yes |
> | bastionhosts | Yes |
> | bgpservicecommunities | No |
> | connections | Yes |
> | ddoscustompolicies | Yes |
> | ddosprotectionplans | Yes |
> | dnsoperationstatuses | No |
> | dnszones | Yes |
> | dnszones/a | No |
> | dnszones/aaaa | No |
> | dnszones/all | No |
> | dnszones/caa | No |
> | dnszones/cname | No |
> | dnszones/mx | No |
> | dnszones/ns | No |
> | dnszones/ptr | No |
> | dnszones/recordsets | No |
> | dnszones/soa | No |
> | dnszones/srv | No |
> | dnszones/txt | No |
> | expressroutecircuits | Yes |
> | expressroutecrossconnections | Yes |
> | expressroutegateways | Yes |
> | expressrouteports | Yes |
> | expressrouteserviceproviders | No |
> | firewallpolicies | Yes |
> | frontdoors | Yes |
> | frontdoorwebapplicationfirewallmanagedrulesets | No |
> | frontdoorwebapplicationfirewallpolicies | Yes |
> | getdnsresourcereference | No |
> | internalnotify | No |
> | loadbalancers | Yes |
> | localnetworkgateways | Yes |
> | natgateways | Yes |
> | networkintentpolicies | Yes |
> | networkinterfaces | Yes |
> | networkprofiles | Yes |
> | networksecuritygroups | Yes |
> | networkwatchers | Yes |
> | networkwatchers/connectionmonitors | Yes |
> | networkwatchers/lenses | Yes |
> | networkwatchers/pingmeshes | Yes |
> | p2svpngateways | Yes |
> | privatednsoperationstatuses | No |
> | privatednszones | Yes |
> | privatednszones/a | No |
> | privatednszones/aaaa | No |
> | privatednszones/all | No |
> | privatednszones/cname | No |
> | privatednszones/mx | No |
> | privatednszones/ptr | No |
> | privatednszones/soa | No |
> | privatednszones/srv | No |
> | privatednszones/txt | No |
> | privatednszones/virtualnetworklinks | Yes |
> | privateendpoints | Yes |
> | privatelinkservices | Yes |
> | publicipaddresses | Yes |
> | publicipprefixes | Yes |
> | routefilters | Yes |
> | routetables | Yes |
> | securegateways | Yes |
> | serviceendpointpolicies | Yes |
> | trafficmanagergeographichierarchies | No |
> | trafficmanagerprofiles | Yes |
> | trafficmanagerprofiles/heatmaps | No |
> | trafficmanagerusermetricskeys | No |
> | virtualhubs | Yes |
> | virtualnetworkgateways | Yes |
> | virtualnetworks | Yes |
> | virtualnetworktaps | Yes |
> | virtualwans | Yes |
> | vpngateways | Yes |
> | vpnsites | Yes |
> | webapplicationfirewallpolicies | Yes |

## Microsoft.NotificationHubs

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | namespaces | Yes |
> | namespaces/notificationhubs | Yes |

## Microsoft.OffAzure

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | hypervsites | Yes |
> | importsites | Yes |
> | serversites | Yes |
> | vmwaresites | Yes |

## Microsoft.OperationalInsights

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | devices | No |
> | linktargets | No |
> | storageinsightconfigs | No |
> | workspaces | Yes |
> | workspaces/datasources | No |
> | workspaces/linkedservices | No |
> | workspaces/query | No |

## Microsoft.OperationsManagement

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | managementassociations | No |
> | managementconfigurations | Yes |
> | solutions | Yes |
> | views | Yes |

## Microsoft.Peering

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | legacypeerings | No |
> | peerasns | No |
> | peerings | Yes |

## Microsoft.PolicyInsights

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | policyevents | No |
> | policystates | No |
> | policytrackedresources | No |
> | remediations | No |

## Microsoft.Portal

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | consoles | No |
> | dashboards | Yes |
> | usersettings | No |

## Microsoft.PowerBI

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | workspacecollections | Yes |

## Microsoft.PowerBIDedicated

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | capacities | Yes |

## Microsoft.ProjectOxford

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | accounts | Yes |

## Microsoft.RecoveryServices

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | backupprotecteditems | No |
> | vaults | Yes |

## Microsoft.Relay

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | namespaces | Yes |
> | namespaces/authorizationrules | No |
> | namespaces/hybridconnections | No |
> | namespaces/hybridconnections/authorizationrules | No |
> | namespaces/wcfrelays | No |
> | namespaces/wcfrelays/authorizationrules | No |

## Microsoft.RemoteApp

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | accounts | No |
> | collections | Yes |
> | collections/applications | No |
> | collections/securityprincipals | No |
> | templateimages | No |

## Microsoft.ResourceGraph

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | queries | Yes |
> | resourcechangedetails | No |
> | resourcechanges | No |
> | resources | No |
> | resourceshistory | No |
> | subscriptionsstatus | No |

## Microsoft.ResourceHealth

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | availabilitystatuses | No |
> | childavailabilitystatuses | No |
> | childresources | No |
> | events | No |
> | impactedresources | No |
> | metadata | No |
> | notifications | No |

## Microsoft.Resources

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | deployments | No |
> | deployments/operations | No |
> | links | No |
> | notifyresourcejobs | No |
> | providers | No |
> | resourcegroups | No |
> | resources | No |
> | subscriptions | No |
> | subscriptions/providers | No |
> | subscriptions/resourcegroups | No |
> | subscriptions/resourcegroups/resources | No |
> | subscriptions/resources | No |
> | subscriptions/tagnames | No |
> | subscriptions/tagnames/tagvalues | No |
> | tags | No |
> | tenants | No |

## Microsoft.SaaS

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | applications | Yes |
> | saasresources | No |

## Microsoft.Scheduler

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | flows | Yes |
> | jobcollections | Yes |

## Microsoft.Search

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | resourcehealthmetadata | No |
> | searchservices | Yes |

## Microsoft.Security

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | adaptivenetworkhardenings | No |
> | advancedthreatprotectionsettings | No |
> | alerts | No |
> | allowedconnections | No |
> | applicationwhitelistings | No |
> | assessmentmetadata | No |
> | assessments | No |
> | autoprovisioningsettings | No |
> | compliances | No |
> | datacollectionagents | No |
> | devicesecuritygroups | No |
> | discoveredsecuritysolutions | No |
> | externalsecuritysolutions | No |
> | informationprotectionpolicies | No |
> | iotsecuritysolutions | Yes |
> | iotsecuritysolutions/analyticsmodels | No |
> | iotsecuritysolutions/analyticsmodels/aggregatedalerts | No |
> | iotsecuritysolutions/analyticsmodels/aggregatedrecommendations | No |
> | jitnetworkaccesspolicies | No |
> | playbookconfigurations | Yes |
> | policies | No |
> | pricings | No |
> | regulatorycompliancestandards | No |
> | regulatorycompliancestandards/regulatorycompliancecontrols | No |
> | regulatorycompliancestandards/regulatorycompliancecontrols/regulatorycomplianceassessments | No |
> | securitycontacts | No |
> | securitysolutions | No |
> | securitysolutionsreferencedata | No |
> | securitystatuses | No |
> | securitystatusessummaries | No |
> | servervulnerabilityassessments | No |
> | settings | No |
> | tasks | No |
> | topologies | No |
> | workspacesettings | No |

## Microsoft.SecurityGraph

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | diagnosticsettings | No |
> | diagnosticsettingscategories | No |

## Microsoft.SecurityInsights

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | aggregations | No |
> | alertrules | No |
> | bookmarks | No |
> | cases | No |
> | dataconnectors | No |
> | entities | No |
> | entityqueries | No |
> | officeconsents | No |
> | settings | No |

## Microsoft.ServiceBus

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | namespaces | Yes |
> | namespaces/authorizationrules | No |
> | namespaces/disasterrecoveryconfigs | No |
> | namespaces/eventgridfilters | No |
> | namespaces/networkrulesets | No |
> | namespaces/queues | No |
> | namespaces/queues/authorizationrules | No |
> | namespaces/topics | No |
> | namespaces/topics/authorizationrules | No |
> | namespaces/topics/subscriptions | No |
> | namespaces/topics/subscriptions/rules | No |
> | premiummessagingregions | No |

## Microsoft.ServiceFabric

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | applications | Yes |
> | clusters | Yes |
> | clusters/applications | No |
> | containergroups | Yes |
> | containergroupsets | Yes |
> | edgeclusters | Yes |
> | edgeclusters/applications | No |
> | networks | Yes |
> | secretstores | Yes |
> | secretstores/certificates | No |
> | secretstores/secrets | No |
> | volumes | Yes |

## Microsoft.ServiceFabricMesh

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | applications | Yes |
> | containergroups | Yes |
> | gateways | Yes |
> | networks | Yes |
> | secrets | Yes |
> | volumes | Yes |

## Microsoft.Services

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | providerregistrations | No |
> | providerregistrations/resourcetyperegistrations | No |
> | rollouts | Yes |

## Microsoft.SignalRService

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | signalr | Yes |
> | signalr/eventgridfilters | No |

## Microsoft.SiteRecovery

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | siterecoveryvault | Yes |

## Microsoft.SoftwarePlan

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | hybridusebenefits | No |

## Microsoft.Solutions

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | applicationdefinitions | Yes |
> | applications | Yes |
> | jitrequests | Yes |

## Microsoft.SQL

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | managedInstances | Yes |
> | managedInstances/databases | Yes |
> | managedInstances/databases/backupShortTermRetentionPolicies | No |
> | managedInstances/databases/schemas/tables/columns/sensitivityLabels | No |
> | managedInstances/databases/vulnerabilityAssessments | No |
> | managedInstances/databases/vulnerabilityAssessments/rules/baselines | No |
> | managedInstances/encryptionProtector | No |
> | managedInstances/keys | No |
> | managedInstances/restorableDroppedDatabases/backupShortTermRetentionPolicies | No |
> | managedInstances/vulnerabilityAssessments | No |
> | servers | Yes |
> | servers/administrators | No |
> | servers/communicationLinks | No |
> | servers/databases | Yes |
> | servers/encryptionProtector | No |
> | servers/firewallRules | No |
> | servers/keys | No |
> | servers/restorableDroppedDatabases | No |
> | servers/serviceobjectives | No |
> | servers/tdeCertificates | No |

## Microsoft.SqlVirtualMachine

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | sqlvirtualmachinegroups | Yes |
> | sqlvirtualmachinegroups/availabilitygrouplisteners | No |
> | sqlvirtualmachines | Yes |

## Microsoft.StorSimple

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | managers | Yes |

## Microsoft.Storage

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | storageaccounts | Yes |
> | storageaccounts/blobservices | No |
> | storageaccounts/fileservices | No |
> | storageaccounts/queueservices | No |
> | storageaccounts/services | No |
> | storageaccounts/services/metricdefinitions | No |
> | storageaccounts/tableservices | No |
> | usages | No |

## Microsoft.StorageCache

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | caches | Yes |
> | caches/storagetargets | No |
> | usagemodels | No |

## Microsoft.StorageReplication

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | replicationgroups | No |

## Microsoft.StorageSync

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | storagesyncservices | Yes |
> | storagesyncservices/registeredservers | No |
> | storagesyncservices/syncgroups | No |
> | storagesyncservices/syncgroups/cloudendpoints | No |
> | storagesyncservices/syncgroups/serverendpoints | No |
> | storagesyncservices/workflows | No |

## Microsoft.StorageSyncDev

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | storagesyncservices | Yes |
> | storagesyncservices/registeredservers | No |
> | storagesyncservices/syncgroups | No |
> | storagesyncservices/syncgroups/cloudendpoints | No |
> | storagesyncservices/syncgroups/serverendpoints | No |
> | storagesyncservices/workflows | No |

## Microsoft.StorageSyncInt

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | storagesyncservices | Yes |
> | storagesyncservices/registeredservers | No |
> | storagesyncservices/syncgroups | No |
> | storagesyncservices/syncgroups/cloudendpoints | No |
> | storagesyncservices/syncgroups/serverendpoints | No |
> | storagesyncservices/workflows | No |

## Microsoft.StreamAnalytics

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | streamingjobs | Yes |

## Microsoft.Subscription

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | cancel | No |
> | createsubscription | No |
> | rename | No |
> | subscriptiondefinitions | No |
> | subscriptionoperations | No |

## Microsoft.TimeSeriesInsights

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | environments | Yes |
> | environments/accesspolicies | No |
> | environments/eventsources | Yes |
> | environments/referencedatasets | Yes |

## Microsoft.VMwareCloudSimple

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | dedicatedcloudnodes | Yes |
> | dedicatedcloudservices | Yes |
> | virtualmachines | Yes |

## Microsoft.Web

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | apimanagementaccounts | No |
> | apimanagementaccounts/apiacls | No |
> | apimanagementaccounts/apis | No |
> | apimanagementaccounts/apis/apiacls | No |
> | apimanagementaccounts/apis/connectionacls | No |
> | apimanagementaccounts/apis/connections | No |
> | apimanagementaccounts/apis/connections/connectionacls | No |
> | apimanagementaccounts/apis/localizeddefinitions | No |
> | apimanagementaccounts/connectionacls | No |
> | apimanagementaccounts/connections | No |
> | billingmeters | No |
> | certificates | Yes |
> | connectiongateways | Yes |
> | connections | Yes |
> | customapis | Yes |
> | deletedsites | No |
> | functions | No |
> | hostingenvironments | Yes |
> | hostingenvironments/multirolepools | No |
> | hostingenvironments/workerpools | No |
> | publishingusers | No |
> | recommendations | No |
> | resourcehealthmetadata | No |
> | runtimes | No |
> | serverfarms | Yes |
> | sites | Yes |
> | sites/hostnamebindings | No |
> | sites/networkconfig | No |
> | sites/premieraddons | Yes |
> | sites/slots | Yes |
> | sites/slots/hostnamebindings | No |
> | sites/slots/networkconfig | No |
> | sourcecontrols | No |
> | validate | No |
> | verifyhostingenvironmentvnet | No |

## Microsoft.WindowsDefenderATP

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | diagnosticsettings | No |
> | diagnosticsettingscategories | No |

## Microsoft.WindowsIoT

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | deviceservices | Yes |

## Microsoft.WorkloadMonitor

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | components | No |
> | componentssummary | No |
> | monitorinstances | No |
> | monitorinstancessummary | No |
> | monitors | No |
> | notificationsettings | No |

## Next steps

To get the same data as a file of comma-separated values, download [complete-mode-deletion.csv](https://github.com/tfitzmac/resource-capabilities/blob/master/complete-mode-deletion.csv).

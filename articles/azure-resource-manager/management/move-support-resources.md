---
title: Move operation support by resource type
description: Lists the Azure resource types that can be moved to a new resource group, subscription, or region.
ms.topic: conceptual
ms.date: 01/30/2023
---

# Move operation support for resources

This article lists whether an Azure resource type supports the move operation. It also provides information about special conditions to consider when moving a resource.

Before starting your move operation, review the [checklist](./move-resource-group-and-subscription.md#checklist-before-moving-resources) to make sure you have satisfied prerequisites. Moving resources across [Microsoft Entra tenants](../../active-directory/develop/quickstart-create-new-tenant.md) isn't supported.

> [!IMPORTANT]
> In most cases, a child resource can't be moved independently from its parent resource. Child resources have a resource type in the format of `<resource-provider-namespace>/<parent-resource>/<child-resource>`. For example, `Microsoft.ServiceBus/namespaces/queues` is a child resource of `Microsoft.ServiceBus/namespaces`. When you move the parent resource, the child resource is automatically moved with it. If you don't see a child resource in this article, you can assume it is moved with the parent resource. If the parent resource doesn't support move, the child resource can't be moved.

## Microsoft.AAD

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription | Region move |
> | ------------- | ----------- | ---------- | ----------- |
> | domainservices | No | No |  No |

## microsoft.aadiam

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription | Region move |
> | ------------- | ----------- | ---------- | ----------- |
> | diagnosticsettings | No | No | No |
> | diagnosticsettingscategories | No | No | No |
> | privatelinkforazuread | **Yes** | **Yes** | No |
> | tenants | **Yes** | **Yes** | No |

## Microsoft.Addons

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription | Region move |
> | ------------- | ----------- | ---------- | ----------- |
> | supportproviders | No | No | No |

## Microsoft.ADHybridHealthService

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription | Region move |
> | ------------- | ----------- | ---------- | ----------- |
> | aadsupportcases | No | No | No |
> | addsservices | No | No | No |
> | agents | No | No | No |
> | anonymousapiusers | No | No | No |
> | configuration | No | No | No |
> | logs | No | No | No |
> | reports | No | No | No |
> | servicehealthmetrics | No | No | No |
> | services | No | No | No |

## Microsoft.Advisor

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription | Region move |
> | ------------- | ----------- | ---------- | ----------- |
> | configurations | No | No | No |
> | generaterecommendations | No | No | No |
> | metadata | No | No | No |
> | recommendations | No | No | No |
> | suppressions | No | No | No |

## Microsoft.AlertsManagement

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription | Region move |
> | ------------- | ----------- | ---------- | ----------- |
> | actionrules | **Yes** | **Yes** | No |
> | alerts | No | No | No |
> | alertslist | No | No | No |
> | alertsmetadata | No | No | No |
> | alertssummary | No | No | No |
> | alertssummarylist | No | No | No |
> | smartdetectoralertrules | **Yes** | **Yes** | No |
> | smartgroups | No | No | No |

## Microsoft.AnalysisServices

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription | Region move |
> | ------------- | ----------- | ---------- | ----------- |
> | servers | **Yes** | **Yes** | No |

## Microsoft.ApiManagement

> [!IMPORTANT]
> An API Management service that is set to the Consumption SKU can't be moved.

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription | Region move |
> | ------------- | ----------- | ---------- | ----------- |
> | reportfeedback | No | No | No |
> | service | **Yes** | **Yes** | **Yes** (using template) <br/><br/> [Move API Management across regions](../../api-management/api-management-howto-migrate.md). |

## Microsoft.App

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription | Region move |
> | ------------- | ----------- | ---------- | ----------- |
> | managedenvironments | **Yes** | **Yes** | No |

## Microsoft.AppConfiguration

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription | Region move |
> | ------------- | ----------- | ---------- | ----------- |
> | configurationstores | **Yes** | **Yes** | No |
> | configurationstores / eventgridfilters | No | No | No |

## Microsoft.AppPlatform

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription | Region move |
> | ------------- | ----------- | ---------- | ----------- |
> | spring | **Yes** | **Yes** | No |

## Microsoft.AppService

> [!IMPORTANT]
> See [App Service move guidance](./move-limitations/app-service-move-limitations.md).

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription | Region move |
> | ------------- | ----------- | ---------- | ----------- |
> | apiapps | No | No | **Yes** (using template)<br/><br/> [Move an App Service app to another region](../../app-service/manage-move-across-regions.md) |
> | appidentities | No | No | No |
> | gateways | No | No | No |

## Microsoft.Attestation

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription | Region move |
> | ------------- | ----------- | ---------- | ----------- |
> | attestationproviders | **Yes** | **Yes** | No |

## Microsoft.Authorization

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription | Region move |
> | ------------- | ----------- | ---------- | ----------- |
> | classicadministrators | No | No | No |
> | dataaliases | No | No | No |
> | denyassignments | No | No | No |
> | elevateaccess | No | No | No |
> | findorphanroleassignments | No | No | No |
> | locks | No | No | No |
> | permissions | No | No | No |
> | policyassignments | No | No | No |
> | policydefinitions | No | No | No |
> | policysetdefinitions | No | No | No |
> | privatelinkassociations | No | No | No |
> | resourcemanagementprivatelinks | No | No | No |
> | roleassignments | No | No | No |
> | roleassignmentsusagemetrics | No | No | No |
> | roledefinitions | No | No | No |

## Microsoft.Automation

> [!IMPORTANT]
> Runbooks must exist in the same resource group as the Automation Account. 
> The movement of System assigned managed identity, and User-assigned managed identity takes place automatically with the Automation account. For information, see [Move your Azure Automation account to another subscription](../../automation/how-to/move-account.md?toc=/azure/azure-resource-manager/toc.json).

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription | Region move |
> | ------------- | ----------- | ---------- | ----------- |
> | automationaccounts | **Yes** | **Yes** | **Yes** [PowerShell script](../../automation/automation-disaster-recovery.md)  |
> | automationaccounts / configurations | **Yes** | **Yes** | No |
> | automationaccounts / runbooks | **Yes** | **Yes** | No |

## Microsoft.AVS

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription | Region move |
> | ------------- | ----------- | ---------- | ----------- |
> | privateclouds | **Yes** | **Yes** | No |

## Microsoft.AzureActiveDirectory

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription | Region move |
> | ------------- | ----------- | ---------- | ----------- |
> | b2cdirectories | **Yes** | **Yes** | No |
> | b2ctenants | No | No | No |

## Microsoft.AzureData

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription | Region move |
> | ------------- | ----------- | ---------- | ----------- |
> | datacontrollers | No | No | No |
> | hybriddatamanagers | No | No | No |
> | postgresinstances | No | No | No |
> | sqlinstances | No | No | No |
> | sqlmanagedinstances | No | No | No |
> | sqlserverinstances | No | No | No |
> | sqlserverregistrations | **Yes** | **Yes** | No |

## Microsoft.AzureStack

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription | Region move |
> | ------------- | ----------- | ---------- | ----------- |
> | cloudmanifestfiles | No | No | No |
> | registrations | **Yes** | **Yes** | No |

## Microsoft.AzureStackHCI

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription | Region move |
> | ------------- | ----------- | ---------- | ----------- |
> | clusters | No | No | No |

## Microsoft.Batch

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription | Region move |
> | ------------- | ----------- | ---------- | ----------- |
> | batchaccounts | **Yes** | **Yes** | Batch accounts can't be moved directly from one region to another, but you can use a template to export a template, modify it, and deploy the template to the new region. <br/><br/> Learn about [moving a Batch account across regions](../../batch/account-move.md) |

## Microsoft.Billing

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription | Region move |
> | ------------- | ----------- | ---------- | ----------- |
> | billingaccounts | No | No | No |
> | billingperiods | No | No | No |
> | billingpermissions | No | No | No |
> | billingproperty | No | No | No |
> | billingroleassignments | No | No | No |
> | billingroledefinitions | No | No | No |
> | departments | No | No | No |
> | enrollmentaccounts | No | No | No |
> | invoices | No | No | No |
> | transfers | No | No | No |

## Microsoft.BingMaps

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription | Region move |
> | ------------- | ----------- | ---------- | ----------- |
> | mapapis | No | No | No |

## Microsoft.BizTalkServices

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription | Region move |
> | ------------- | ----------- | ---------- | ----------- |
> | biztalk | No | No | No |

## Microsoft.Blockchain

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription | Region move |
> | ------------- | ----------- | ---------- | ----------- |
> | blockchainmembers | No | No | No <br/><br/> The blockchain network can't have nodes in different regions. |
> | cordamembers | No | No | No |
> | watchers | No | No | No |

## Microsoft.BlockchainTokens

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription | Region move |
> | ------------- | ----------- | ---------- | ----------- |
> | tokenservices | No | No | No |

## Microsoft.Blueprint

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription | Region move |
> | ------------- | ----------- | ---------- | ----------- |
> | blueprintassignments | No | No | No |
> | blueprints | No | No | No |

## Microsoft.BotService

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription | Region move |
> | ------------- | ----------- | ---------- | ----------- |
> | botservices | **Yes** | **Yes** | No |

## Microsoft.Cache

> [!IMPORTANT]
> If the Azure Cache for Redis instance is configured with a virtual network, the instance can't be moved to a different subscription. See [Networking move limitations](./move-limitations/networking-move-limitations.md).

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription | Region move |
> | ------------- | ----------- | ---------- | ----------- |
> | redis | **Yes** | **Yes** | No |
> | redisenterprise | No | No | No |

## Microsoft.Capacity

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription | Region move |
> | ------------- | ----------- | ---------- | ----------- |
> | appliedreservations | No | No | No |
> | calculateexchange | No | No | No |
> | calculateprice | No | No | No |
> | calculatepurchaseprice | No | No | No |
> | catalogs | No | No | No |
> | commercialreservationorders | No | No | No |
> | exchange | No | No | No |
> | reservationorders | No | No | No |
> | reservations | No | No | No |
> | resources | No | No | No |
> | validatereservationorder | No | No | No |

## Microsoft.Cdn

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription | Region move |
> | ------------- | ----------- | ---------- | ----------- |
> | cdnwebapplicationfirewallmanagedrulesets | No | No | No |
> | cdnwebapplicationfirewallpolicies | **Yes** | **Yes** | No |
> | edgenodes | No | No | No |
> | profiles | **Yes** | **Yes** | No |
> | profiles / endpoints | **Yes** | **Yes** | No |

## Microsoft.CertificateRegistration

> [!IMPORTANT]
> See [App Service move guidance](./move-limitations/app-service-move-limitations.md).

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription | Region move |
> | ------------- | ----------- | ---------- | ----------- |
> | certificateorders | **Yes** | **Yes** | No |

## Microsoft.ClassicCompute

> [!IMPORTANT]
> See [Classic deployment move guidance](./move-limitations/classic-model-move-limitations.md). Classic deployment resources can be moved across subscriptions with an operation specific to that scenario.

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription | Region move |
> | ------------- | ----------- | ---------- | ----------- |
> | capabilities | No | No | No |
> | domainnames | **Yes** | No | No |
> | quotas | No | No | No |
> | resourcetypes | No | No | No |
> | validatesubscriptionmoveavailability | No | No | No |
> | virtualmachines | **Yes** | **Yes** | No |

## Microsoft.ClassicInfrastructureMigrate

> [!IMPORTANT]
> See [Classic deployment move guidance](./move-limitations/classic-model-move-limitations.md). Classic deployment resources can be moved across subscriptions with an operation specific to that scenario.

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription | Region move |
> | ------------- | ----------- | ---------- | ----------- |
> | classicinfrastructureresources | No | No | No |

## Microsoft.ClassicNetwork

> [!IMPORTANT]
> See [Classic deployment move guidance](./move-limitations/classic-model-move-limitations.md). Classic deployment resources can be moved across subscriptions with an operation specific to that scenario.

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription | Region move |
> | ------------- | ----------- | ---------- | ----------- |
> | capabilities | No | No | No |
> | expressroutecrossconnections | No | No | No |
> | expressroutecrossconnections / peerings | No | No | No |
> | gatewaysupporteddevices | No | No | No |
> | networksecuritygroups | No | No | No |
> | quotas | No | No | No |
> | reservedips | No | No | No |
> | virtualnetworks | No | No | No |

## Microsoft.ClassicStorage

> [!IMPORTANT]
> See [Classic deployment move guidance](./move-limitations/classic-model-move-limitations.md). Classic deployment resources can be moved across subscriptions with an operation specific to that scenario.

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription | Region move |
> | ------------- | ----------- | ---------- | ----------- |
> | disks | No | No | No |
> | images | No | No | No |
> | osimages | No | No | No |
> | osplatformimages | No | No | No |
> | publicimages | No | No | No |
> | quotas | No | No | No |
> | storageaccounts | **Yes** | No | **Yes** |
> | vmimages | No | No | No |

## Microsoft.ClassicSubscription

> [!IMPORTANT]
> See [Classic deployment move guidance](./move-limitations/classic-model-move-limitations.md). Classic deployment resources can be moved across subscriptions with an operation specific to that scenario.

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription | Region move |
> | ------------- | ----------- | ---------- | ----------- |
> | operations | No | No | No |

## Microsoft.CognitiveServices

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription | Region move |
> | ------------- | ----------- | ---------- | ----------- |
> | accounts | **Yes** | **Yes** | No |
> | Cognitive Search | **Yes** | **Yes** | Supported with manual steps.<br/><br/> Learn about [moving your Azure AI Search service to another region](../../search/search-howto-move-across-regions.md) |

## Microsoft.Commerce

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription | Region move |
> | ------------- | ----------- | ---------- | ----------- |
> | ratecard | No | No | No |
> | usageaggregates | No | No | No |

## Microsoft.Communication

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription | Region move |
> | ------------- | ----------- | ---------- | ----------- |
> | communicationservices | **Yes** | **Yes** <br/><br/> Note that resources with attached phone numbers cannot be moved to subscriptions in different data locations, nor subscriptions that do not support having phone numbers. | No |

## Microsoft.Compute

> [!IMPORTANT]
> See [Virtual Machines move guidance](./move-limitations/virtual-machines-move-limitations.md).

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription | Region move |
> | ------------- | ----------- | ---------- | ----------- |
> | availabilitysets | **Yes** | **Yes** |  **Yes** <br/><br/> Use [Azure Resource Mover](../../resource-mover/tutorial-move-region-virtual-machines.md) to move availability sets. |
> | diskaccesses | No | No | No |
> | diskencryptionsets | No | No | No |
> | disks | **Yes** | **Yes** | **Yes** <br/><br/> Use [Azure Resource Mover](../../resource-mover/tutorial-move-region-virtual-machines.md) to move Azure VMs and related disks. |
> | galleries | No | No | No |
> | galleries / images | No | No | No |
> | galleries / images / versions | No | No | No |
> | hostgroups | No | No | No |
> | hostgroups / hosts | No | No | No |
> | images | **Yes** | **Yes** | No |
> | proximityplacementgroups | **Yes** | **Yes** | No |
> | restorepointcollections | No | No | No |
> | restorepointcollections / restorepoints | No | No | No |
> | sharedvmextensions | No | No | No |
> | sharedvmimages | No | No | No |
> | sharedvmimages / versions | No | No | No |
> | snapshots | **Yes** - Full <br> No - Incremental | **Yes** - Full <br> No - Incremental | No - Full <br> **Yes** - Incremental |
> | sshpublickeys | No | No | No |
> | virtualmachines | **Yes** | **Yes** | **Yes** <br/><br/> Use [Azure Resource Mover](../../resource-mover/tutorial-move-region-virtual-machines.md) to move Azure VMs. |
> | virtualmachines / extensions | **Yes** | **Yes** | No |
> | virtualmachinescalesets | **Yes** | **Yes** | No |


> [!IMPORTANT]
> See [Cloud Services (extended support) deployment move guidance](./move-limitations/cloud-services-extended-support.md). Cloud Services (extended support) deployment resources can be moved across subscriptions with an operation specific to that scenario.

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription | Region move |
> | ------------- | ----------- | ---------- | ----------- |
> | capabilities | No | No | No |
> | domainnames | **Yes** | No | No |
> | quotas | No | No | No |
> | resourcetypes | No | No | No |
> | validatesubscriptionmoveavailability | No | No | No |
> | virtualmachines | **Yes** | **Yes** | No |


## Microsoft.Confluent

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription | Region move |
> | ------------- | ----------- | ---------- | ----------- |
> | organizations | No | No | No |

## Microsoft.Consumption

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription | Region move |
> | ------------- | ----------- | ---------- | ----------- |
> | aggregatedcost | No | No | No |
> | balances | No | No | No |
> | budgets | No | No | No |
> | charges | No | No | No |
> | costtags | No | No | No |
> | credits | No | No | No |
> | events | No | No | No |
> | forecasts | No | No | No |
> | lots | No | No | No |
> | marketplaces | No | No | No |
> | pricesheets | No | No | No |
> | products | No | No | No |
> | reservationdetails | No | No | No |
> | reservationrecommendationdetails | No | No | No |
> | reservationrecommendations | No | No | No |
> | reservationsummaries | No | No | No |
> | reservationtransactions | No | No | No |
> | tags | No | No | No |
> | tenants | No | No | No |
> | terms | No | No | No |
> | usagedetails | No | No | No |

## Microsoft.ContainerInstance

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription | Region move |
> | ------------- | ----------- | ---------- | ----------- |
> | containergroups | No | No | No |
> | serviceassociationlinks | No | No | No |

## Microsoft.ContainerRegistry

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription | Region move |
> | ------------- | ----------- | ---------- | ----------- |
> | registries | **Yes** | **Yes** | No |
> | registries / agentpools | **Yes** | **Yes** | No |
> | registries / buildtasks | **Yes** | **Yes** | No |
> | registries / replications | **Yes** | **Yes** | No |
> | registries / tasks | **Yes** | **Yes** | No |
> | registries / webhooks | **Yes** | **Yes** | No |

## Microsoft.ContainerService

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription | Region move |
> | ------------- | ----------- | ---------- | ----------- |
> | containerservices | No | No | No |
> | managedclusters | No | No | No |
> | openshiftmanagedclusters | No | No | No |

## Microsoft.ContentModerator

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription | Region move |
> | ------------- | ----------- | ---------- | ----------- |
> | applications | No | No | No |

## Microsoft.CortanaAnalytics

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription | Region move |
> | ------------- | ----------- | ---------- | ----------- |
> | accounts | No | No | No |

## Microsoft.CostManagement

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription | Region move |
> | ------------- | ----------- | ---------- | ----------- |
> | alerts | No | No | No |
> | billingaccounts | No | No | No |
> | budgets | No | No | No |
> | cloudconnectors | No | No | No |
> | connectors | **Yes** | **Yes** | No |
> | departments | No | No | No |
> | dimensions | No | No | No |
> | enrollmentaccounts | No | No | No |
> | exports | No | No | No |
> | externalbillingaccounts | No | No | No |
> | forecast | No | No | No |
> | query | No | No | No |
> | register | No | No | No |
> | reportconfigs | No | No | No |
> | reports | No | No | No |
> | settings | No | No | No |
> | showbackrules | No | No | No |
> | views | No | No | No |

## Microsoft.CustomerInsights

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription | Region move |
> | ------------- | ----------- | ---------- | ----------- |
> | hubs | No | No | No |

## Microsoft.CustomerLockbox

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription | Region move |
> | ------------- | ----------- | ---------- | ----------- |
> | requests | No | No | No |

## Microsoft.CustomProviders

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription | Region move |
> | ------------- | ----------- | ---------- | ----------- |
> | associations | No | No | No |
> | resourceproviders | **Yes** | **Yes** | No |

## Microsoft.DataBox

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription | Region move |
> | ------------- | ----------- | ---------- | ----------- |
> | jobs | No | No | No |

## Microsoft.DataBoxEdge

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription | Region move |
> | ------------- | ----------- | ---------- | ----------- |
> | availableskus | No | No | No |
> | databoxedgedevices | No | No | No |

## Microsoft.Databricks

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription | Region move |
> | ------------- | ----------- | ---------- | ----------- |
> | workspaces | No | No | No |

## Microsoft.DataCatalog

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription | Region move |
> | ------------- | ----------- | ---------- | ----------- |
> | catalogs | **Yes** | **Yes** | No |
> | datacatalogs | No | No | No |

## Microsoft.DataConnect

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription | Region move |
> | ------------- | ----------- | ---------- | ----------- |
> | connectionmanagers | No | No | No |

## Microsoft.DataExchange

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription | Region move |
> | ------------- | ----------- | ---------- | ----------- |
> | packages | No | No | No |
> | plans | No | No | No |

## Microsoft.DataFactory

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription | Region move |
> | ------------- | ----------- | ---------- | ----------- |
> | datafactories | **Yes** | **Yes** | No |
> | factories | **Yes** | **Yes** | No |

## Microsoft.DataLake

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription | Region move |
> | ------------- | ----------- | ---------- | ----------- |
> | datalakeaccounts | No | No | No |

## Microsoft.DataLakeAnalytics

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription | Region move |
> | ------------- | ----------- | ---------- | ----------- |
> | accounts | **Yes** | **Yes** | No |

## Microsoft.DataLakeStore

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription | Region move |
> | ------------- | ----------- | ---------- | ----------- |
> | accounts | **Yes** | **Yes** | No |

## Microsoft.DataMigration

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription | Region move |
> | ------------- | ----------- | ---------- | ----------- |
> | services | No | No | No |
> | services / projects | No | No | No |
> | slots | No | No | No |
> | sqlmigrationservices | No | No | No |

## Microsoft.DataProtection

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription | Region move |
> | ------------- | ----------- | ---------- | ---------- |
> | backupvaults | [**Yes**](../../backup/create-manage-backup-vault.md#use-azure-portal-to-move-backup-vault-to-a-different-resource-group) | [**Yes**](../../backup/create-manage-backup-vault.md#use-azure-portal-to-move-backup-vault-to-a-different-subscription) | No |

## Microsoft.DataShare

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription | Region move |
> | ------------- | ----------- | ---------- | ----------- |
> | accounts | **Yes** | **Yes** | No |

## Microsoft.DBforMariaDB

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription | Region move |
> | ------------- | ----------- | ---------- | ----------- |
> | servers | **Yes** | **Yes** | You can use a cross-region read replica to move an existing server. [Learn more](../../postgresql/howto-move-regions-portal.md).<br/><br/> If the service is provisioned with geo-redundant backup storage, you can use geo-restore to restore in other regions. [Learn more](../../mariadb/concepts-business-continuity.md#recover-from-an-azure-regional-data-center-outage).

## Microsoft.DBforMySQL

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription | Region move |
> | ------------- | ----------- | ---------- | ----------- |
> | flexibleServers | **Yes** | **Yes** | No |
> | servers | **Yes** | **Yes** | You can use a cross-region read replica to move an existing server. [Learn more](../../mysql/howto-move-regions-portal.md).

## Microsoft.DBforPostgreSQL

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription | Region move |
> | ------------- | ----------- | ---------- | ----------- |
> | flexibleServers | **Yes** | **Yes** | No |
> | servergroups | No | No | No |
> | servers | **Yes** | **Yes** | You can use a cross-region read replica to move an existing server. [Learn more](../../postgresql/howto-move-regions-portal.md).
> | serversv2 | **Yes** | **Yes** | No |

## Microsoft.DeploymentManager

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription | Region move |
> | ------------- | ----------- | ---------- | ----------- |
> | artifactsources | **Yes** | **Yes** | No |
> | rollouts | **Yes** | **Yes** | No |
> | servicetopologies | **Yes** | **Yes** | No |
> | servicetopologies / services | **Yes** | **Yes** | No |
> | servicetopologies / services / serviceunits | **Yes** | **Yes** | No |
> | steps | **Yes** | **Yes** | No |

## Microsoft.DesktopVirtualization

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription | Region move |
> | ------------- | ----------- | ---------- | ----------- |
> | applicationgroups | **Yes** | **Yes** | No |
> | hostpools | **Yes** | **Yes** | No |
> | workspaces | **Yes** | **Yes** | No |

## Microsoft.Devices

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription | Region move |
> | ------------- | ----------- | ---------- | ----------- |
> | elasticpools | No | No | No. Resource isn't exposed. |
> | elasticpools / iothubtenants | No | No | No. Resource isn't exposed. |
> | iothubs | **Yes** | **Yes** | **Yes**. [Learn more](../../iot-hub/iot-hub-how-to-clone.md) |
> | provisioningservices | **Yes** | **Yes** | No |

## Microsoft.DevOps

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription | Region move |
> | ------------- | ----------- | ---------- | ----------- |
> | pipelines | **Yes** | **Yes** | No |
> | controllers | **pending** | **pending** | No |

## Microsoft.DevSpaces

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription | Region move |
> | ------------- | ----------- | ---------- | ----------- |
> | controllers | **Yes** | **Yes** | No |
> | AKS cluster | **pending** | **pending** | No<br/><br/> [Learn more](/previous-versions/azure/dev-spaces/) about moving to another region.

## Microsoft.DevTestLab

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription | Region move |
> | ------------- | ----------- | ---------- | ----------- |
> | labcenters | No | No | No |
> | labs | **Yes** | No | No |
> | labs / environments | **Yes** | **Yes** | No |
> | labs / servicerunners | **Yes** | **Yes** | No |
> | labs / virtualmachines | **Yes** | No | No |
> | schedules | **Yes** | **Yes** | No |

## Microsoft.DigitalTwins

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription | Region move |
> | ------------- | ----------- | ---------- | ----------- |
> | digitaltwinsinstances | No | No | **Yes**, by recreating resources in new region. [Learn more](../../digital-twins/how-to-move-regions.md) |

## Microsoft.DocumentDB

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription | Region move |
> | ------------- | ----------- | ---------- | ----------- |
> | databaseaccounts | **Yes** | **Yes** | No |

## Microsoft.DomainRegistration

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription | Region move |
> | ------------- | ----------- | ---------- | ----------- |
> | domains | **Yes** | **Yes** | No |
> | generatessorequest | No | No | No |
> | topleveldomains | No | No | No |
> | validatedomainregistrationinformation | No | No | No |

## Microsoft.Elastic

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription | Region move |
> | ------------- | ----------- | ---------- | ----------- |
> | monitors | No | No | No |

## Microsoft.EnterpriseKnowledgeGraph

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription | Region move |
> | ------------- | ----------- | ---------- | ----------- |
> | services | **Yes** | **Yes** | No |

## Microsoft.EventGrid

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription | Region move |
> | ------------- | ----------- | ---------- | ----------- |
> | domains | **Yes** | **Yes** | No |
> | eventsubscriptions | No - can't be moved independently but automatically moved with subscribed resource. | No - can't be moved independently but automatically moved with subscribed resource. | No |
> | extensiontopics | No | No | No |
> | partnernamespaces | **Yes** | **Yes** | No |
> | partnerregistrations | No | No | No |
> | partnertopics | **Yes** | **Yes** | No |
> | systemtopics | **Yes** | **Yes** | No |
> | topics | **Yes** | **Yes** | No |
> | topictypes | No | No | No |

## Microsoft.EventHub

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription | Region move |
> | ------------- | ----------- | ---------- | ----------- |
> | clusters | **Yes** | **Yes** | No |
> | namespaces | **Yes** | **Yes** | **Yes** (with template)<br/><br/> [Move an Event Hub namespace to another region](../../event-hubs/move-across-regions.md) |
> | sku | No | No | No |

## Microsoft.Experimentation

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription | Region move |
> | ------------- | ----------- | ---------- | ----------- |
> | experimentworkspaces | No | No | No |

## Microsoft.ExtendedLocation

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription | Region move |
> | ------------- | ----------- | ---------- | ----------- |
> | customLocations | No | No | No |

## Microsoft.Falcon

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription | Region move |
> | ------------- | ----------- | ---------- | ----------- |
> | namespaces | **Yes** | **Yes** | No |

## Microsoft.Features

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription | Region move |
> | ------------- | ----------- | ---------- | ----------- |
> | featureproviders | No | No | No |
> | features | No | No | No |
> | providers | No | No | No |
> | subscriptionfeatureregistrations | No | No | No |

## Microsoft.Genomics

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription | Region move |
> | ------------- | ----------- | ---------- | ----------- |
> | accounts | No | No | No |

## Microsoft.GuestConfiguration

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription | Region move |
> | ------------- | ----------- | ---------- | ----------- |
> | automanagedaccounts | No | No | No |
> | automanagedvmconfigurationprofiles | No | No | No |
> | guestconfigurationassignments | No | No | No |
> | software | No | No | No |
> | softwareupdateprofile | No | No | No |
> | softwareupdates | No | No | No |

## Microsoft.HanaOnAzure

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription | Region move |
> | ------------- | ----------- | ---------- | ----------- |
> | hanainstances | No | No | No |
> | sapmonitors | No | No | No |

## Microsoft.HardwareSecurityModules

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription | Region move |
> | ------------- | ----------- | ---------- | ----------- |
> | dedicatedhsms | No | No | No |

## Microsoft.HDInsight

> [!IMPORTANT]
> You can move HDInsight clusters to a new subscription or resource group. However, you can't move across subscriptions the networking resources linked to the HDInsight cluster (such as the virtual network, NIC, or load balancer). In addition, you can't move to a new resource group a NIC that is attached to a virtual machine for the cluster.
>
> When moving an HDInsight cluster to a new subscription, first move other resources (like the storage account). Then, move the HDInsight cluster by itself.

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription | Region move |
> | ------------- | ----------- | ---------- | ----------- |
> | clusters | **Yes** | **Yes** | No |

## Microsoft.HealthcareApis

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription | Region move |
> | ------------- | ----------- | ---------- | ----------- |
> | services | **Yes** | **Yes** | No |

## Microsoft.HybridCompute

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription | Region move |
> | ------------- | ----------- | ---------- | ----------- |
> | machines | **Yes** | **Yes** | No |
> | machines / extensions | **Yes** | **Yes** | No |

## Microsoft.HybridData

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription | Region move |
> | ------------- | ----------- | ---------- | ----------- |
> | datamanagers | **Yes** | **Yes** | No |

## Microsoft.HybridNetwork

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription | Region move |
> | ------------- | ----------- | ---------- | ----------- |
> | devices | No | No | No |
> | vnfs | No | No | No |

## Microsoft.Hydra

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription | Region move |
> | ------------- | ----------- | ---------- | ----------- |
> | components | No | No | No |
> | networkscopes | No | No | No |

## Microsoft.ImportExport

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription | Region move |
> | ------------- | ----------- | ---------- | ----------- |
> | jobs | **Yes** | **Yes** | No |

## Microsoft.Insights

> [!IMPORTANT]
> Make sure moving to new subscription doesn't exceed [subscription quotas](azure-subscription-service-limits.md#azure-monitor-limits).

> [!WARNING]
> Moving or renaming any Application Insights resource changes the resource ID. When the ID changes for a workspace-based resource, data sent for the prior ID is accessible only by querying the underlying Log Analytics workspace. The data will not be accessible from within the renamed or moved Application Insights resource.

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription | Region move |
> | ------------- | ----------- | ---------- | ----------- |
> | accounts | **Yes** | **Yes** | No. [Learn more](../../azure-monitor/app/create-workspace-resource.md#how-do-i-move-an-application-insights-resource-to-a-new-region). |
> | actiongroups | **Yes** | **Yes** | No |
> | activitylogalerts | No | No | No |
> | alertrules | **Yes** | **Yes** | No |
> | autoscalesettings | **Yes** | **Yes** | No |
> | baseline | No | No | No |
> | components | **Yes** | **Yes** | No |
> | datacollectionrules | No | No | No |
> | diagnosticsettings | No | No | No |
> | diagnosticsettingscategories | No | No | No |
> | eventcategories | No | No | No |
> | eventtypes | No | No | No |
> | extendeddiagnosticsettings | No | No | No |
> | guestdiagnosticsettings | No | No | No |
> | listmigrationdate | No | No | No |
> | logdefinitions | No | No | No |
> | logprofiles | No | No | No |
> | logs | No | No | No |
> | metricalerts | No | No | No |
> | metricbaselines | No | No | No |
> | metricbatch | No | No | No |
> | metricdefinitions | No | No | No |
> | metricnamespaces | No | No | No |
> | metrics | No | No | No |
> | migratealertrules | No | No | No |
> | migratetonewpricingmodel | No | No | No |
> | myworkbooks | No | No | No |
> | notificationgroups | No | No | No |
> | privatelinkscopes | No | No | No |
> | rollbacktolegacypricingmodel | No | No | No |
> | scheduledqueryrules | **Yes** | **Yes** | No |
> | topology | No | No | No |
> | transactions | No | No | No |
> | vminsightsonboardingstatuses | No | No | No |
> | webtests | **Yes** | **Yes** | No |
> | webtests / gettestresultfile | No | No | No |
> | workbooks | **Yes** | **Yes** | No |
> | workbooktemplates | **Yes** | **Yes** | No |

## Microsoft.IoTCentral

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription | Region move |
> | ------------- | ----------- | ---------- | ----------- |
> | apptemplates | No | No | No |
> | iotapps | **Yes** | **Yes** | No |

## Microsoft.IoTHub

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription | Region move |
> | ------------- | ----------- | ---------- | ----------- |
> | iothub | **Yes** | **Yes** | **Yes** (clone hub) <br/><br/> [Clone an IoT hub to another region](../../iot-hub/iot-hub-how-to-clone.md) |

## Microsoft.IoTSpaces

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription | Region move |
> | ------------- | ----------- | ---------- | ----------- |
> | graph | **Yes** | **Yes** | No |

## Microsoft.KeyVault

> [!IMPORTANT]
> Key Vaults used for disk encryption can't be moved to a resource group in the same subscription or across subscriptions.

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription | Region move |
> | ------------- | ----------- | ---------- | ----------- |
> | deletedvaults | No | No | No |
> | hsmpools | No | No | No |
> | managedhsms | No | No | No |
> | vaults | **Yes** | **Yes** | No |

## Microsoft.Kubernetes

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription | Region move |
> | ------------- | ----------- | ---------- | ----------- |
> | connectedclusters | No | No | No |
> | registeredsubscriptions | No | No | No |

## Microsoft.KubernetesConfiguration

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription | Region move |
> | ------------- | ----------- | ---------- | ----------- |
> | sourcecontrolconfigurations | No | No | No |

## Microsoft.Kusto

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription | Region move |
> | ------------- | ----------- | ---------- | ----------- |
> | clusters | **Yes** | **Yes** | No |

## Microsoft.LabServices

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription | Region move |
> | ------------- | ----------- | ---------- | ----------- |
> | labaccounts | No | No | No |
> | users | No | No | No |

## Microsoft.LoadTestService

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription | Region move |
> | ------------- | ----------- | ---------- | ----------- |
> | loadtests | Yes | Yes | No |

## Microsoft.LocationBasedServices

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription | Region move |
> | ------------- | ----------- | ---------- | ----------- |
> | accounts | No | No | No |

## Microsoft.LocationServices

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription | Region move |
> | ------------- | ----------- | ---------- | ----------- |
> | accounts | No | No | No, it's a global service. |

## Microsoft.Logic

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription | Region move |
> | ------------- | ----------- | ---------- | ----------- |
> | hostingenvironments | No | No | No |
> | integrationaccounts | **Yes** | **Yes** | No |
> | integrationserviceenvironments | **Yes** | No | No |
> | integrationserviceenvironments / managedapis | **Yes** | No | No |
> | isolatedenvironments | No | No | No |
> | workflows | **Yes** | **Yes** | No |

## Microsoft.MachineLearning

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription | Region move |
> | ------------- | ----------- | ---------- | ----------- |
> | commitmentplans | No | No | No |
> | webservices | **Yes** | No | No |
> | workspaces | **Yes** | **Yes** | No |

## Microsoft.MachineLearningCompute

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription | Region move |
> | ------------- | ----------- | ---------- | ----------- |
> | operationalizationclusters | No | No | No |

## Microsoft.MachineLearningExperimentation

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription | Region move |
> | ------------- | ----------- | ---------- | ----------- |
> | accounts | No | No | No |
> | teamaccounts | No | No | No |

## Microsoft.MachineLearningModelManagement

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription | Region move |
> | ------------- | ----------- | ---------- | ----------- |
> | accounts | No | No | No |

## Microsoft.MachineLearningServices

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription | Region move |
> | ------------- | ----------- | ---------- | ----------- |
> | workspaces | No | No | No |

## Microsoft.Maintenance

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription | Region move |
> | ------------- | ----------- | ---------- | ----------- |
> | configurationassignments | No | No | **Yes**. [Learn more](../../virtual-machines/move-region-maintenance-configuration.md) |
> | maintenanceconfigurations | **Yes** | **Yes** | **Yes**. [Learn more](../../virtual-machines/move-region-maintenance-configuration-resources.md) |
> | updates | No | No | No |

## Microsoft.ManagedIdentity

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription | Region move |
> | ------------- | ----------- | ---------- | ----------- |
> | identities | No | No | No |
> | userassignedidentities | No | No | No |

## Microsoft.ManagedNetwork

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription | Region move |
> | ------------- | ----------- | ---------- | ----------- |
> | managednetworks | No | No | No |
> | managednetworks / managednetworkgroups | No | No | No |
> | managednetworks / managednetworkpeeringpolicies | No | No | No |
> | notification | No | No | No |

## Microsoft.ManagedServices

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription | Region move |
> | ------------- | ----------- | ---------- | ----------- |
> | marketplaceregistrationdefinitions | No | No | No |
> | registrationassignments | No | No | No |
> | registrationdefinitions | No | No | No |

## Microsoft.Management

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription | Region move |
> | ------------- | ----------- | ---------- | ----------- |
> | getentities | No | No | No |
> | managementgroups | No | No | No |
> | managementgroups / settings | No | No | No |
> | resources | No | No | No |
> | starttenantbackfill | No | No | No |
> | tenantbackfillstatus | No | No | No |

## Microsoft.Maps

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription | Region move |
> | ------------- | ----------- | ---------- | ----------- |
> | accounts | **Yes** | **Yes** | No, Azure Maps is a geospatial service. |
> | accounts / privateatlases | **Yes** | **Yes** | No |

## Microsoft.Marketplace

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription | Region move |
> | ------------- | ----------- | ---------- | ----------- |
> | offers | No | No | No |
> | offertypes | No | No | No |
> | privategalleryitems | No | No | No |
> | privatestoreclient | No | No | No |
> | privatestores | No | No | No |
> | products | No | No | No |
> | publishers | No | No | No |
> | register | No | No | No |

## Microsoft.MarketplaceApps

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription | Region move |
> | ------------- | ----------- | ---------- | ----------- |
> | classicdevservices | No | No | No |

## Microsoft.MarketplaceOrdering

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription | Region move |
> | ------------- | ----------- | ---------- | ----------- |
> | agreements | No | No | No |
> | offertypes | No | No | No |

## Microsoft.Media

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription | Region move |
> | ------------- | ----------- | ---------- | ----------- |
> | mediaservices | **Yes** | **Yes** | No |
> | mediaservices / liveevents | **Yes** | **Yes** | No |
> | mediaservices / streamingendpoints | **Yes** | **Yes** | No |

## Microsoft.Microservices4Spring

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription | Region move |
> | ------------- | ----------- | ---------- | ----------- |
> | appclusters | No | No | No |

## Microsoft.Migrate

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription | Region move |
> | ------------- | ----------- | ---------- | ----------- |
> | assessmentprojects | No | No | No |
> | migrateprojects | No | No | No |
> | movecollections | No | No | No |
> | projects | No | No | No |

## Microsoft.MixedReality

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription | Region move |
> | ------------- | ----------- | ---------- | ---------- |
> | objectunderstandingaccounts | No | No | No |
> | remoterenderingaccounts | **Yes** | **Yes** | No |
> | spatialanchorsaccounts | **Yes** | **Yes** | No |

## Microsoft.MobileNetwork

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription | Region move |
> | ------------- | ----------- | ---------- | ---------- |
> | mobileNetworks | No | No | Yes<br><br>[Move your private mobile network resources to a different region](../../private-5g-core/region-move-private-mobile-network-resources.md) |
> | mobileNetworks / dataNetworks | No | No | Yes<br><br>[Move your private mobile network resources to a different region](../../private-5g-core/region-move-private-mobile-network-resources.md) |
> | mobileNetworks / simPolicies | No | No | Yes<br><br>[Move your private mobile network resources to a different region](../../private-5g-core/region-move-private-mobile-network-resources.md) |
> | mobileNetworks / sites | No | No | Yes<br><br>[Move your private mobile network resources to a different region](../../private-5g-core/region-move-private-mobile-network-resources.md) |
> | mobileNetworks / slices | No | No | Yes<br><br>[Move your private mobile network resources to a different region](../../private-5g-core/region-move-private-mobile-network-resources.md) |
> | packetCoreControlPlanes | No | No | Yes<br><br>[Move your private mobile network resources to a different region](../../private-5g-core/region-move-private-mobile-network-resources.md) |
> | packetCoreControlPlanes / packetCoreDataPlanes | No | No | Yes<br><br>[Move your private mobile network resources to a different region](../../private-5g-core/region-move-private-mobile-network-resources.md) |
> | packetCoreControlPlanes / packetCoreDataPlanes / attachedDataNetworks | No | No | Yes<br><br>[Move your private mobile network resources to a different region](../../private-5g-core/region-move-private-mobile-network-resources.md) |
> | sims | No | No | Yes<br><br>[Move your private mobile network resources to a different region](../../private-5g-core/region-move-private-mobile-network-resources.md) |
> | simGroups | No | No | Yes<br><br>[Move your private mobile network resources to a different region](../../private-5g-core/region-move-private-mobile-network-resources.md) |
> | simGroups / sims | No | No | Yes<br><br>[Move your private mobile network resources to a different region](../../private-5g-core/region-move-private-mobile-network-resources.md) |
> | packetCoreControlPlaneVersions | No | No | Yes<br><br>[Move your private mobile network resources to a different region](../../private-5g-core/region-move-private-mobile-network-resources.md) |

## Microsoft.NetApp

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription | Region move |
> | ------------- | ----------- | ---------- | ----------- |
> | netappaccounts | No | No | No |
> | netappaccounts / capacitypools | No | No | No |
> | netappaccounts / capacitypools / volumes | No | No | No |
> | netappaccounts / capacitypools / volumes / mounttargets | No | No | No |
> | netappaccounts / capacitypools / volumes / snapshots | No | No | No |

## Microsoft.Network

> [!IMPORTANT]
> See [Networking move guidance](./move-limitations/networking-move-limitations.md).

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription | Region move |
> | ------------- | ----------- | ---------- | ----------- |
> | applicationgateways | No | No | No |
> | applicationgatewaywebapplicationfirewallpolicies | No | No | No |
> | applicationsecuritygroups | **Yes** | **Yes** | No |
> | azurefirewalls | No | No | No |
> | bastionhosts | Yes | No | No |
> | bgpservicecommunities | No | No | No |
> | connections | **Yes** | **Yes** | No |
> | ddoscustompolicies | **Yes** | **Yes** | No |
> | ddosprotectionplans | No | No | No |
> | dnszones | **Yes** | **Yes** | No |
> | expressroutecircuits | No | No | No |
> | expressroutegateways | No | No | No |
> | expressrouteserviceproviders | No | No | No |
> | firewallpolicies | No | No | No |
> | frontdoors | No | No | No |
> | ipallocations | **Yes** | **Yes** | No |
> | ipgroups | No | No | No |
> | loadbalancers | **Yes** - Basic SKU<br> **Yes** - Standard SKU | **Yes** - Basic SKU<br>No - Standard SKU | **Yes** <br/><br/> Use [Azure Resource Mover](../../resource-mover/tutorial-move-region-virtual-machines.md) to move internal and external load balancers. |
> | localnetworkgateways | **Yes** | **Yes** | No |
> | natgateways | No | No | No |
> | networkexperimentprofiles | No | No | No |
> | networkintentpolicies | **Yes** | **Yes** | No |
> | networkinterfaces | **Yes** | **Yes** | **Yes** <br/><br/> Use [Azure Resource Mover](../../resource-mover/tutorial-move-region-virtual-machines.md) to move NICs. |
> | networkprofiles | No | No | No |
> | networksecuritygroups | **Yes** | **Yes** | **Yes** <br/><br/> Use [Azure Resource Mover](../../resource-mover/tutorial-move-region-virtual-machines.md) to move network security groups (NSGs). |
> | networkwatchers | **Yes** | No | No |
> | networkwatchers / connectionmonitors | **Yes** | No | No |
> | networkwatchers / flowlogs | **Yes** | No | No |
> | networkwatchers / pingmeshes | **Yes** | No | No |
> | p2svpngateways | No | No | No |
> | privatednszones | **Yes** | **Yes** | No |
> | privatednszones / virtualnetworklinks | **Yes** | **Yes** | No |
> | privatednszonesinternal | No | No | No |
> | privateendpointredirectmaps | No | No | No |
> | privateendpoints | **Yes** - for [supported private-link resources](./move-limitations/networking-move-limitations.md#private-endpoints)<br>No - for all other private-link resources | **Yes** - for [supported private-link resources](./move-limitations/networking-move-limitations.md#private-endpoints)<br>No - for all other private-link resources | No |
> | privatelinkservices | No | No | No |
> | publicipaddresses | **Yes** | **Yes** - see [Networking move guidance](./move-limitations/networking-move-limitations.md) | **Yes**<br/><br/> Use [Azure Resource Mover](../../resource-mover/tutorial-move-region-virtual-machines.md) to move public IP address configurations (IP addresses are not retained). |
> | publicipprefixes | **Yes** | **Yes** | No |
> | routefilters | No | No | No |
> | routetables | **Yes** | **Yes** | No |
> | securitypartnerproviders | **Yes** | **Yes** | No |
> | serviceendpointpolicies | **Yes** | **Yes** | No |
> | trafficmanagergeographichierarchies | No | No | No |
> | trafficmanagerprofiles | **Yes** | **Yes** | No |
> | trafficmanagerprofiles / heatmaps | No | No | No |
> | trafficmanagerusermetricskeys | No | No | No |
> | virtualhubs | No | No | No |
> | virtualnetworkgateways | **Yes** except Basic SKU - see [Networking move guidance](./move-limitations/networking-move-limitations.md)| **Yes** except Basic SKU - see [Networking move guidance](./move-limitations/networking-move-limitations.md) | No |
> | virtualnetworks | **Yes** | **Yes** | No |
> | virtualnetworktaps | No | No | No |
> | virtualrouters | **Yes** | **Yes** | No |
> | virtualwans | No | No |
> | vpngateways (Virtual WAN) | No | No | No |
> | vpnserverconfigurations | No | No | No |
> | vpnsites (Virtual WAN) | No | No | No |

## Microsoft.NotificationHubs

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription | Region move |
> | ------------- | ----------- | ---------- | ----------- |
> | namespaces | **Yes** | **Yes** | No |
> | namespaces / notificationhubs | **Yes** | **Yes** | No |

## Microsoft.ObjectStore

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription | Region move |
> | ------------- | ----------- | ---------- | ----------- |
> | osnamespaces | **Yes** | **Yes** | No |

## Microsoft.OffAzure

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription | Region move |
> | ------------- | ----------- | ---------- | ----------- |
> | hypervsites | No | No | No |
> | importsites | No | No | No |
> | mastersites | No | No | No |
> | serversites | No | No | No |
> | vmwaresites | No | No | No |

## Microsoft.OperationalInsights

> [!IMPORTANT]
> Make sure that moving to a new subscription doesn't exceed [subscription quotas](azure-subscription-service-limits.md#azure-monitor-limits).
>
> Workspaces that have a linked automation account can't be moved. Before you begin a move operation, be sure to unlink any automation accounts.

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription | Region move |
> | ------------- | ----------- | ---------- | ----------- |
> | clusters | No | No | No |
> | deletedworkspaces | No | No | No |
> | linktargets | No | No | No |
> | storageinsightconfigs | No | No | No |
> | workspaces | **Yes** | **Yes** | No |
> | querypacks | No | No | No |


## Microsoft.OperationsManagement

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription | Region move |
> | ------------- | ----------- | ---------- | ----------- |
> | managementassociations | No | No | No |
> | managementconfigurations | **Yes** | **Yes** | No |
> | solutions | **Yes** | **Yes** | No |
> | views | **Yes** | **Yes** | No |

## Microsoft.Peering

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription | Region move |
> | ------------- | ----------- | ---------- | ----------- |
> | legacypeerings | No | No | No |
> | peerasns | No | No | No |
> | peeringlocations | No | No | No |
> | peerings | **Yes** | **Yes** | No |
> | peeringservicecountries | No | No | No |
> | peeringservicelocations | No | No | No |
> | peeringserviceproviders | No | No | No |
> | peeringservices | **Yes** | **Yes** | No |

## Microsoft.PolicyInsights

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription | Region move |
> | ------------- | ----------- | ---------- | ----------- |
> | policyevents | No | No | No |
> | policystates | No | No | No |
> | policytrackedresources | No | No | No |
> | remediations | No | No | No |

## Microsoft.Portal

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription | Region move |
> | ------------- | ----------- | ---------- | ----------- |
> | consoles | No | No | No |
> | dashboards | **Yes** | **Yes** | No |
> | usersettings | No | No | No |

## Microsoft.PowerBI

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription | Region move |
> | ------------- | ----------- | ---------- | ----------- |
> | workspacecollections | **Yes** | **Yes** | No |

## Microsoft.PowerBIDedicated

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription | Region move |
> | ------------- | ----------- | ---------- | ----------- |
> | capacities | **Yes** | **Yes** | No |

## Microsoft.ProjectBabylon

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription | Region move |
> | ------------- | ----------- | ---------- | ---------- |
> | accounts | No | No | No |

## Microsoft.Purview

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription | Region move |
> | ------------- | ----------- | ---------- | ---------- |
> | accounts | **Yes** | **Yes** | No |

## Microsoft.ProviderHub

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription | Region move |
> | ------------- | ----------- | ---------- | ----------- |
> | availableaccounts | No | No | No |
> | providerregistrations | No | No | No |
> | rollouts | No | No | No |

## Microsoft.Quantum

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription | Region move |
> | ------------- | ----------- | ---------- | ----------- |
> | workspaces | No | No | No |

## Microsoft.RecoveryServices

>[!IMPORTANT]
>- See [Recovery Services move guidance](../../backup/backup-azure-move-recovery-services-vault.md?toc=/azure/azure-resource-manager/toc.json).
>- See [Continue backups in Recovery Services vault after moving resources across regions](../../backup/azure-backup-move-vaults-across-regions.md?toc=/azure/azure-resource-manager/toc.json).

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription | Region move |
> | ------------- | ----------- | ---------- | ----------- |
> | replicationeligibilityresults | No | No | No |
> | vaults | **Yes** | **Yes** | No.<br/><br/> Moving Recovery Services vaults for Azure Backup across Azure regions isn't supported.<br/><br/> In Recovery Services vaults for Azure Site Recovery, you can [disable and recreate the vault](../../site-recovery/move-vaults-across-regions.md) in the target region. |

## Microsoft.RedHatOpenShift

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription | Region move |
> | ------------- | ----------- | ---------- | ----------- |
> | openshiftclusters | No | No | No |

## Microsoft.Relay

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription | Region move |
> | ------------- | ----------- | ---------- | ----------- |
> | namespaces | **Yes** | **Yes** | No |

## Microsoft.ResourceGraph

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription | Region move |
> | ------------- | ----------- | ---------- | ----------- |
> | queries | **Yes** | **Yes** | No |
> | resourcechangedetails | No | No | No |
> | resourcechanges | No | No | No |
> | resources | No | No | No |
> | resourceshistory | No | No | No |
> | subscriptionsstatus | No | No | No |

## Microsoft.ResourceHealth

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription | Region move |
> | ------------- | ----------- | ---------- | ----------- |
> | childresources | No | No | No |
> | emergingissues | No | No | No |
> | events | No | No | No |
> | metadata | No | No | No |
> | notifications | No | No | No |

## Microsoft.Resources

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription | Region move |
> | ------------- | ----------- | ---------- | ----------- |
> | deployments | No | No | No |
> | deploymentscripts | No | No | **Yes**<br/><br/>[Move Microsoft.Resources resources to new region](microsoft-resources-move-regions.md) |
> | deploymentscripts / logs | No | No | No |
> | links | No | No | No |
> | providers | No | No | No |
> | resourcegroups | No | No | No |
> | resources | No | No | No |
> | subscriptions | No | No | No |
> | tags | No | No | No |
> | templatespecs | No | No | **Yes**<br/><br/>[Move Microsoft.Resources resources to new region](microsoft-resources-move-regions.md) |
> | templatespecs / versions | No | No | No |
> | tenants | No | No | No |

## Microsoft.SaaS

> [!IMPORTANT]
> Marketplace offerings that are implemented through the Microsoft.Saas resource provider support resource group and subscription moves. These offerings are represented by the `resources` type below. For example, **SendGrid** is implemented through Microsoft.Saas and supports move operations. However, limitations defined in the [move requirements checklist](./move-resource-group-and-subscription.md#checklist-before-moving-resources) may limit the supported move scenarios. For example, you can't move the resources from a Cloud Solution Provider (CSP) partner.

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription | Region move |
> | ------------- | ----------- | ---------- | ----------- |
> | applications | **Yes** | No | No |
> | resources | **Yes** | **Yes** | No |
> | saasresources | No | No | No |

## Microsoft.Search

> [!IMPORTANT]
> You can't move several Search resources in different regions in one operation. Instead, move them in separate operations.

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription | Region move |
> | ------------- | ----------- | ---------- | ----------- |
> | resourcehealthmetadata | No | No | No |
> | searchservices | **Yes** | **Yes** | No |

## Microsoft.Security

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription | Region move |
> | ------------- | ----------- | ---------- | ----------- |
> | adaptivenetworkhardenings | No | No | No |
> | advancedthreatprotectionsettings | No | No | No |
> | alerts | No | No | No |
> | allowedconnections | No | No | No |
> | applicationwhitelistings | No | No | No |
> | assessmentmetadata | No | No | No |
> | assessments | No | No | No |
> | autodismissalertsrules | No | No | No |
> | automations | **Yes** | **Yes** | No |
> | autoprovisioningsettings | No | No | No |
> | complianceresults | No | No | No |
> | compliances | No | No | No |
> | datacollectionagents | No | No | No |
> | devicesecuritygroups | No | No | No |
> | discoveredsecuritysolutions | No | No | No |
> | externalsecuritysolutions | No | No | No |
> | informationprotectionpolicies | No | No | No |
> | iotsecuritysolutions | **Yes** | **Yes** | No |
> | iotsecuritysolutions / analyticsmodels | No | No | No |
> | iotsecuritysolutions / analyticsmodels / aggregatedalerts | No | No | No |
> | iotsecuritysolutions / analyticsmodels / aggregatedrecommendations | No | No | No |
> | jitnetworkaccesspolicies | No | No | No |
> | policies | No | No | No |
> | pricings | No | No | No |
> | regulatorycompliancestandards | No | No | No |
> | regulatorycompliancestandards / regulatorycompliancecontrols | No | No | No |
> | regulatorycompliancestandards / regulatorycompliancecontrols / regulatorycomplianceassessments | No | No | No |
> | securitycontacts | No | No | No |
> | securitysolutions | No | No | No |
> | securitysolutionsreferencedata | No | No | No |
> | securitystatuses | No | No | No |
> | securitystatusessummaries | No | No | No |
> | servervulnerabilityassessments | No | No | No |
> | settings | No | No | No |
> | subassessments | No | No | No |
> | tasks | No | No | No |
> | topologies | No | No | No |
> | workspacesettings | No | No | No |

## Microsoft.SecurityInsights

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription | Region move |
> | ------------- | ----------- | ---------- | ----------- |
> | aggregations | No | No | No |
> | alertrules | No | No | No |
> | alertruletemplates | No | No | No |
> | automationrules | No | No | No |
> | bookmarks | No | No | No |
> | cases | No | No | No |
> | dataconnectors | No | No | No |
> | entities | No | No | No |
> | entityqueries | No | No | No |
> | incidents | No | No | No |
> | officeconsents | No | No | No |
> | settings | No | No | No |
> | threatintelligence | No | No | No |

## Microsoft.SerialConsole

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription | Region move |
> | ------------- | ----------- | ---------- | ----------- |
> | consoleservices | No | No | No |

## Microsoft.ServerManagement

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription | Region move |
> | ------------- | ----------- | ---------- | ----------- |
> | gateways | No | No | No |
> | nodes | No | No | No |

## Microsoft.ServiceBus

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription | Region move |
> | ------------- | ----------- | ---------- | ----------- |
> | namespaces | **Yes** | **Yes** | Yes (with template)<br/><br/> [Move an Azure Service Bus namespace to another region](../../service-bus-messaging/move-across-regions.md) |
> | premiummessagingregions | No | No | No |
> | sku | No | No | No |

## Microsoft.ServiceFabric

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription | Region move |
> | ------------- | ----------- | ---------- | ----------- |
> | applications | No | No | No |
> | clusters | **Yes** | **Yes** | No |
> | containergroups | No | No | No |
> | containergroupsets | No | No | No |
> | edgeclusters | No | No | No |
> | managedclusters | No | No | No |
> | networks | No | No | No |
> | secretstores | No | No | No |
> | volumes | No | No | No |

## Microsoft.ServiceFabricMesh

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription | Region move |
> | ------------- | ----------- | ---------- | ----------- |
> | applications | **Yes** | **Yes** | No |
> | containergroups | No | No | No |
> | gateways | **Yes** | **Yes** | No |
> | networks | **Yes** | **Yes** | No |
> | secrets | **Yes** | **Yes** | No |
> | volumes | **Yes** | **Yes** | No |

## Microsoft.ServiceNetworking

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription | Region move |
> | ------------- | ----------- | ---------- | ----------- |
> | trafficcontrollers | No | No | No |
> | associations | No | No | No |
> | frontends | No | No | No |

## Microsoft.Services

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription | Region move |
> | ------------- | ----------- | ---------- | ----------- |
> | rollouts | No | No | No |

## Microsoft.SignalRService

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription | Region move |
> | ------------- | ----------- | ---------- | ----------- |
> | signalr | **Yes** | **Yes** | No |

## Microsoft.SoftwarePlan

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription | Region move |
> | ------------- | ----------- | ---------- | ----------- |
> | hybridusebenefits | No | No | No |

## Microsoft.Solutions

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription | Region move |
> | ------------- | ----------- | ---------- | ----------- |
> | applicationdefinitions | No | No | No |
> | applications | No | No | No |
> | jitrequests | No | No | No |

## Microsoft.Sql

> [!IMPORTANT]
> A database and server must be in the same resource group. When you move a SQL server, all its databases are also moved. This behavior applies to Azure SQL Database and Azure Synapse Analytics databases.

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription | Region move |
> | ------------- | ----------- | ---------- | ----------- |
> | instancepools | No | No | No |
> | locations | **Yes** | **Yes** | No |
> | managedinstances | No | No | **Yes** <br/><br/> [Learn more](/azure/azure-sql/database/move-resources-across-regions) about moving managed instances across regions. |
> | managedinstances / databases | No | No | **Yes** |
> | servers | **Yes** | **Yes** | **Yes** |
> | servers / databases | **Yes** | **Yes** | **Yes** <br/><br/> [Learn more](/azure/azure-sql/database/move-resources-across-regions) about moving databases across regions.<br/><br/> [Learn more](../../resource-mover/tutorial-move-region-sql.md) about using Azure Resource Mover to move Azure SQL databases.  |
> | servers / databases / backuplongtermretentionpolicies | **Yes** | **Yes** | No |
> | servers / elasticpools | **Yes** | **Yes** | **Yes** <br/><br/> [Learn more](/azure/azure-sql/database/move-resources-across-regions) about moving elastic pools across regions.<br/><br/> [Learn more](../../resource-mover/tutorial-move-region-sql.md) about using Azure Resource Mover to move Azure SQL elastic pools.  |
> | servers / jobaccounts | **Yes** | **Yes** | No |
> | servers / jobagents | **Yes** | **Yes** | No |
> | virtualclusters | No | No | No |

## Microsoft.SqlVirtualMachine

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription | Region move |
> | ------------- | ----------- | ---------- | ----------- |
> | sqlvirtualmachinegroups | **Yes** | **Yes** | No |
> | sqlvirtualmachines | **Yes** | **Yes** | No |

## Microsoft.Storage

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription | Region move |
> | ------------- | ----------- | ---------- | ----------- |
> | storageaccounts | **Yes** | **Yes** | **Yes**<br/><br/> [Move an Azure Storage account to another region](../../storage/common/storage-account-move.md) |

## Microsoft.StorageCache

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription | Region move |
> | ------------- | ----------- | ---------- | ----------- |
> | caches | No | No | No |

## Microsoft.StorageSync

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription | Region move |
> | ------------- | ----------- | ---------- | ----------- |
> | storagesyncservices | **Yes** | **Yes** | No |

## Microsoft.StorageSyncDev

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription | Region move |
> | ------------- | ----------- | ---------- | ----------- |
> | storagesyncservices | No | No | No |

## Microsoft.StorageSyncInt

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription | Region move |
> | ------------- | ----------- | ---------- | ----------- |
> | storagesyncservices | No | No | No |

## Microsoft.StorSimple

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription | Region move |
> | ------------- | ----------- | ---------- | ----------- |
> | managers | No | No | No |

## Microsoft.StreamAnalytics

> [!IMPORTANT]
> Stream Analytics jobs can't be moved when in running state.

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription | Region move |
> | ------------- | ----------- | ---------- | ----------- |
> | clusters | No | No | No |
> | streamingjobs | **Yes** | **Yes** | No |

## Microsoft.StreamAnalyticsExplorer

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription | Region move |
> | ------------- | ----------- | ---------- | ----------- |
> | environments | No | No | No |
> | instances | No | No | No |

## Microsoft.Subscription

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription | Region move |
> | ------------- | ----------- | ---------- | ----------- |
> | subscriptions | No | No | No |

## Microsoft.Support

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription | Region move |
> | ------------- | ----------- | ---------- | ----------- |
> | services | No | No | No |
> | supporttickets | No | No | No |

## Microsoft.Synapse

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription | Region move |
> | ------------- | ----------- | ---------- | ----------- |
> | workspaces | No | No | No |
> | workspaces / bigdatapools | No | No | No |
> | workspaces / sqlpools | No | No | No |

## Microsoft.TimeSeriesInsights

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription | Region move |
> | ------------- | ----------- | ---------- | ----------- |
> | environments | **Yes** | **Yes** | No |
> | environments / eventsources | **Yes** | **Yes** | No |
> | environments / referencedatasets | **Yes** | **Yes** | No |

## Microsoft.Token

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription | Region move |
> | ------------- | ----------- | ---------- | ----------- |
> | stores | **Yes** | **Yes** | No |

## Microsoft.VirtualMachineImages

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription | Region move |
> | ------------- | ----------- | ---------- | ----------- |
> | imagetemplates | No | No | No |

## Microsoft.VisualStudio

> [!IMPORTANT]
> To change the subscription for Azure DevOps, see [change the Azure subscription used for billing](/azure/devops/organizations/billing/change-azure-subscription?toc=/azure/azure-resource-manager/toc.json).

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription | Region move |
> | ------------- | ----------- | ---------- | ----------- |
> | account | No | No | No |
> | account / extension | No | No | No |
> | account / project | No | No | No |

## Microsoft.VMware

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription | Region move |
> | ------------- | ----------- | ---------- | ----------- |
> | arczones | No | No | No |
> | resourcepools | No | No | No |
> | vcenters | No | No | No |
> | virtualmachines | No | No | No |
> | virtualmachinetemplates | No | No | No |
> | virtualnetworks | No | No | No |

## Microsoft.VMwareCloudSimple

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription | Region move |
> | ------------- | ----------- | ---------- | ----------- |
> | dedicatedcloudnodes | No | No | No |
> | dedicatedcloudservices | No | No | No |
> | virtualmachines | No | No | No |

## Microsoft.VnfManager

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription | Region move |
> | ------------- | ----------- | ---------- | ----------- |
> | devices | No | No | No |
> | vnfs | No | No | No |

## Microsoft.VSOnline

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription | Region move |
> | ------------- | ----------- | ---------- | ----------- |
> | accounts | No | No | No |
> | plans | No | No | No |
> | registeredsubscriptions | No | No | No |

## Microsoft.Web

> [!IMPORTANT]
> See [App Service move guidance](./move-limitations/app-service-move-limitations.md).

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription | Region move |
> | ------------- | ----------- | ---------- | ----------- |
> | availablestacks | No | No | No |
> | billingmeters | No | No | No |
> | certificates | No | **Yes** | No |
> | certificates (managed) | No | No | No |
> | connectiongateways | **Yes** | **Yes** | No |
> | connections | **Yes** | **Yes** | No |
> | customapis | **Yes** | **Yes** | No |
> | deletedsites | No | No | No |
> | deploymentlocations | No | No | No |
> | georegions | No | No | No |
> | hostingenvironments | No | No | No |
> | kubeenvironments | **Yes** | **Yes** | No |
> | publishingusers | No | No | No |
> | recommendations | No | No | No |
> | resourcehealthmetadata | No | No | No |
> | runtimes | No | No | No |
> | serverfarms | **Yes** | **Yes** | No |
> | serverfarms / eventgridfilters | No | No | No |
> | sites | **Yes** | **Yes** | No |
> | sites / premieraddons | **Yes** | **Yes** | No |
> | sites / slots | **Yes** | **Yes** | No |
> | sourcecontrols | No | No | No |
> | staticsites | Yes | Yes | No |

## Microsoft.WindowsESU

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription | Region move |
> | ------------- | ----------- | ---------- | ----------- |
> | multipleactivationkeys | No | No | No |

## Microsoft.WindowsIoT

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription | Region move |
> | ------------- | ----------- | ---------- | ----------- |
> | deviceservices | No | No | No |

## Microsoft.WorkloadBuilder

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription | Region move |
> | ------------- | ----------- | ---------- | ----------- |
> | workloads | No | No | No |

## Microsoft.WorkloadMonitor

> [!div class="mx-tableFixed"]
> | Resource type | Resource group | Subscription | Region move |
> | ------------- | ----------- | ---------- | ----------- |
> | components | No | No | No |
> | componentssummary | No | No | No |
> | monitorinstances | No | No | No |
> | monitorinstancessummary | No | No | No |
> | monitors | No | No | No |

## Third-party services

Third-party services currently don't support the move operation.

## Next steps

- For commands to move resources, see [Move resources to new resource group or subscription](move-resource-group-and-subscription.md).
- [Learn more](../../resource-mover/overview.md) about the Resource Mover service.
- To get the same data as a file of comma-separated values, download [move-support-resources.csv](https://github.com/tfitzmac/resource-capabilities/blob/master/move-support-resources.csv) for resource group and subscription move support. If you want those properties and region move support, download [move-support-resources-with-regions.csv](https://github.com/tfitzmac/resource-capabilities/blob/master/move-support-resources-with-regions.csv).


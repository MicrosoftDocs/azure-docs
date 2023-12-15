---
title: Resource naming restrictions
description: Shows the rules and restrictions for naming Azure resources.
ms.topic: conceptual
author: tfitzmac
ms.author: tomfitz
ms.reviewer: franksolomon
ms.date: 11/20/2023
---

# Naming rules and restrictions for Azure resources

This article summarizes naming rules and restrictions for Azure resources. For recommendations about how to name resources, see [Recommended naming and tagging conventions](/azure/cloud-adoption-framework/ready/azure-best-practices/naming-and-tagging).

This article lists resources by resource provider namespace. For a list of how resource providers match Azure services, see [Resource providers for Azure services](azure-services-resource-providers.md).

> [!NOTE]
> Resource and resource group names are case-insensitive unless specifically noted in the valid characters column.
>
> When using various APIs to retrieve the name for a resource or resource group, the returned value may have different casing than what you originally specified for the name. The returned value may even display different case values than what is listed in the valid characters table.
>
> Always perform a case-insensitive comparison of names.

In the following tables, the term alphanumeric refers to:

* **a** through **z** (lowercase letters)
* **A** through **Z** (uppercase letters)
* **0** through **9** (numbers)

> [!NOTE]
> All resources with a public endpoint can't include reserved words or trademarks in the name. For a list of the blocked words, see [Resolve reserved resource name errors](../templates/error-reserved-resource-name.md).

## Microsoft.AnalysisServices

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | servers | resource group | 3-63 | Lowercase letters and numbers.<br><br>Start with lowercase letter. |

## Microsoft.ApiManagement

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | service | global | 1-50 | Alphanumerics and hyphens.<br><br>Start with letter and end with alphanumeric. |
> | service / apis | service | 1-80 | Alphanumerics and hyphens.<br><br>Start with letter and end with alphanumeric. |
> | service / apis / issues | api | 1-80 | Alphanumerics and hyphens.<br><br>Start with letter and end with alphanumeric. |
> | service / apis / issues / attachments | issue | 1-80 | Alphanumerics and hyphens.<br><br>Start with letter and end with alphanumeric. |
> | service / apis / issues / comments | issue | 1-80 | Alphanumerics and hyphens.<br><br>Start with letter and end with alphanumeric. |
> | service / apis / operations | api | 1-80 | Alphanumerics and hyphens.<br><br>Start with letter and end with alphanumeric. |
> | service / apis / operations / tags | operation | 1-80 | Alphanumerics and hyphens.<br><br>Start with letter and end with alphanumeric. |
> | service / apis / releases | api | 1-80 | Alphanumerics, underscores, and hyphens.<br><br>Start and end with alphanumeric or underscore. |
> | service / apis / schemas | api | 1-80 | Alphanumerics and hyphens.<br><br>Start with letter and end with alphanumeric. |
> | service / apis / tagDescriptions | api | 1-80 | Alphanumerics and hyphens.<br><br>Start with letter and end with alphanumeric. |
> | service / apis / tags | api | 1-80 | Alphanumerics and hyphens.<br><br>Start with letter and end with alphanumeric. |
> | service / api-version-sets | service | 1-80 | Alphanumerics and hyphens.<br><br>Start with letter and end with alphanumeric. |
> | service / authorizationServers | service | 1-80 | Alphanumerics and hyphens.<br><br>Start with letter and end with alphanumeric. |
> | service / backends | service | 1-80 | Alphanumerics and hyphens.<br><br>Start with letter and end with alphanumeric. |
> | service / certificates | service | 1-80 | Alphanumerics and hyphens.<br><br>Start with letter and end with alphanumeric. |
> | service / diagnostics | service | 1-80 | Alphanumerics and hyphens.<br><br>Start with letter and end with alphanumeric. |
> | service / groups | service | 1-80 | Alphanumerics and hyphens.<br><br>Start with letter and end with alphanumeric. |
> | service / groups / users | group | 1-80 | Alphanumerics and hyphens.<br><br>Start with letter and end with alphanumeric. |
> | service / identityProviders | service | 1-80 | Alphanumerics and hyphens.<br><br>Start with letter and end with alphanumeric. |
> | service / loggers | service | 1-80 | Alphanumerics and hyphens.<br><br>Start with letter and end with alphanumeric. |
> | service / notifications | service | 1-80 | Alphanumerics and hyphens.<br><br>Start with letter and end with alphanumeric. |
> | service / notifications / recipientEmails | notification | 1-80 | Alphanumerics and hyphens.<br><br>Start with letter and end with alphanumeric. |
> | service / openidConnectProviders | service | 1-80 | Alphanumerics and hyphens.<br><br>Start with letter and end with alphanumeric. |
> | service / policies | service | 1-80 | Alphanumerics and hyphens.<br><br>Start with letter and end with alphanumeric. |
> | service / products | service | 1-80 | Alphanumerics and hyphens.<br><br>Start with letter and end with alphanumeric. |
> | service / products / apis | product | 1-80 | Alphanumerics and hyphens.<br><br>Start with letter and end with alphanumeric. |
> | service / products / groups | product | 1-80 | Alphanumerics and hyphens.<br><br>Start with letter and end with alphanumeric. |
> | service / products / tags | product | 1-80 | Alphanumerics and hyphens.<br><br>Start with letter and end with alphanumeric. |
> | service / properties | service | 1-80 | Alphanumerics and hyphens.<br><br>Start with letter and end with alphanumeric. |
> | service / subscriptions | service | 1-80 | Alphanumerics and hyphens.<br><br>Start with letter and end with alphanumeric. |
> | service / tags | service | 1-80 | Alphanumerics and hyphens.<br><br>Start with letter and end with alphanumeric. |
> | service / templates | service | 1-80 | Alphanumerics and hyphens.<br><br>Start with letter and end with alphanumeric. |
> | service / users | service | 1-80 | Alphanumerics and hyphens.<br><br>Start with letter and end with alphanumeric. |

## Microsoft.App

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | containerApps | resource group | 2-32 | 	Lowercase letters, numbers, and hyphens..<br><br>Start with letter and end with alphanumeric. |

## Microsoft.AppConfiguration

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | configurationStores | resource group | 5-50 | Alphanumerics, underscores, and hyphens. |

## Microsoft.AppPlatform

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | spring | global | 4-32 | Lowercase letters, numbers, and hyphens. |

## Microsoft.Authorization

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | locks | scope of assignment | 1-90 | Alphanumerics, periods, underscores, hyphens, and parenthesis.<br><br>Can't end in period. |
> | policyAssignments | scope of assignment | 1-128 display name<br><br>1-64 resource name<br><br>1-24 resource name at management group scope | Display name can contain any characters.<br><br>Resource name can't use:<br>`<>*%&:\?.+/` or control characters. <br><br>Can't end with period or space. |
> | policyDefinitions | scope of definition | 1-128 display name<br><br>1-64 resource name | Display name can contain any characters.<br><br>Resource name can't use:<br>`<>*%&:\?.+/` or control characters. <br><br>Can't end with period or space. |
> | policyExemptions | scope of exemption | 1-128 display name<br><br>1-64 resource name | Display name can contain any characters.<br><br>Resource name can't use:<br>`<>*%&:\?.+/` or control characters. <br><br>Can't end with period or space. |
> | policySetDefinitions | scope of definition | 1-128 display name<br><br>1-64 resource name | Display name can contain any characters.<br><br>Resource name can't use:<br>`<>*%&:\?.+/` or control characters. <br><br>Can't end with period or space. |
> | roleAssignments | tenant | 36 | Must be a globally unique identifier (GUID). |
> | roleDefinitions | tenant | 36 | Must be a globally unique identifier (GUID). |

## Microsoft.Automation

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | automationAccounts | resource group & region <br>(See note below) | 6-50 | Alphanumerics and hyphens.<br><br>Start with letter and end with alphanumeric. |
> | automationAccounts / certificates | automation account | 1-128 | Can't use:<br> `<>*%&:\?.+/` or control characters <br><br>Can't end with space.  |
> | automationAccounts / connections | automation account | 1-128 | Can't use:<br> `<>*%&:\?.+/` or control characters <br><br>Can't end with space. |
> | automationAccounts / credentials | automation account | 1-128 | Can't use:<br> `<>*%&:\?.+/` or control characters <br><br>Can't end with space. |
> | automationAccounts / runbooks | automation account | 1-63 | Alphanumerics, underscores, and hyphens.<br><br>Start with letter.  |
> | automationAccounts / schedules | automation account | 1-128 | Can't use:<br> `<>*%&:\?.+/` or control characters <br><br>Can't end with space. |
> | automationAccounts / variables | automation account | 1-128 | Can't use:<br> `<>*%&:\?.+/` or control characters <br><br>Can't end with space. |
> | automationAccounts / watchers | automation account | 1-63 |  Alphanumerics, underscores, and hyphens.<br><br>Start with letter. |
> | automationAccounts / webhooks | automation account | 1-128 | Can't use:<br> `<>*%&:\?.+/` or control characters <br><br>Can't end with space. |

> [!NOTE]
> Automation account names are unique per region and resource group. Names for deleted Automation accounts might not be immediately available.

## Microsoft.Batch

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | batchAccounts | Region | 3-24 | Lowercase letters and numbers. |
> | batchAccounts / applications | batch account | 1-64 | Alphanumerics, underscores, and hyphens. |
> | batchAccounts / certificates | batch account | 5-45 | Alphanumerics, underscores, and hyphens. |
> | batchAccounts / pools | batch account | 1-64 | Alphanumerics, underscores, and hyphens. |

## Microsoft.Blockchain

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | blockchainMembers | global | 2-20 | Lowercase letters and numbers.<br><br>Start with lowercase letter. |

## Microsoft.Blueprint

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | blueprint| Management groups, Subscriptions, Resource groups | 90 | Alphanumerics, underscores, and hyphens. |
> | blueprintAssignments | Management groups, Subscriptions, Resource groups | 90 | Alphanumerics, underscores, and hyphens. |

## Microsoft.BotService

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | botServices | global | 2-64 |  Alphanumerics, underscores, periods, and hyphens.<br><br>Start with alphanumeric. |
> | botServices / channels | bot service | 2-64 | Alphanumerics, underscores, periods, and hyphens.<br><br>Start with alphanumeric. |
> | botServices / Connections | bot service | 2-64 | Alphanumerics, underscores, periods, and hyphens.<br><br>Start with alphanumeric. |
> | enterpriseChannels | resource group | 2-64 | Alphanumerics, underscores, periods, and hyphens.<br><br>Start with alphanumeric. |

## Microsoft.Cache

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | Redis | global | 1-63 | Alphanumerics and hyphens.<br><br>Start and end with alphanumeric. Consecutive hyphens not allowed. |
> | Redis / firewallRules | Redis | 1-256 | Alphanumerics |

## Microsoft.Cdn

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | profiles | resource group | 1-260 | Alphanumerics and hyphens.<br><br>Start and end with alphanumeric. |
> | profiles / endpoints | global | 1-50 | Alphanumerics and hyphens.<br><br>Start and end with alphanumeric. |
> | profiles / originGroups | global | 1-50 | Alphanumerics and hyphens.<br><br>Start and end with alphanumeric. |
> | profiles / originGroups / origins | global | 1-50 | Alphanumerics and hyphens.<br><br>Start and end with alphanumeric. |
> | profiles / afdEndpoints / routes | global | 1-50 | Alphanumerics and hyphens.<br><br>Start and end with alphanumeric. |

## Microsoft.CertificateRegistration

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | certificateOrders | resource group | 3-30 | Alphanumerics. |

## Microsoft.CognitiveServices

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | accounts | resource group | 2-64 | Alphanumerics and hyphens.<br><br>Start and end with alphanumeric. |

## Microsoft.Compute

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | availabilitySets | resource group | 1-80 | Alphanumerics, underscores, periods, and hyphens.<br><br>Start with alphanumeric. End with alphanumeric or underscore. |
> | cloudservices | resource group | 1-15 <br><br>See note below. | Can't use spaces, control characters, or these characters:<br> `~ ! @ # $ % ^ & * ( ) = + _ [ ] { } \ | ; : . ' " , < > / ?`<br><br>Can't start with underscore. Can't end with period or hyphen. |
> | diskEncryptionSets | resource group | 1-80 | Alphanumerics, underscores, and hyphens. |
> | disks | resource group | 1-80 | Alphanumerics, underscores, and hyphens. |
> | galleries | resource group | 1-80 | Alphanumerics and periods.<br><br>Start and end with alphanumeric. |
> | galleries / applications | gallery | 1-80 | Alphanumerics, hyphens, and periods.<br><br>Start and end with alphanumeric. |
> | galleries / applications/versions | application | 32-bit integer | Numbers and periods.<br/>(Each segment is converted to an int32. So each segment has a max value of 2,147,483,647.)  |
> | galleries / images | gallery | 1-80 | Alphanumerics, underscores, hyphens, and periods.<br><br>Start and end with alphanumeric. |
> | galleries / images / versions | image | 32-bit integer | Numbers and periods.<br/>(Each segment is converted to an int32. So each segment has a max value of 2,147,483,647.) |
> | images | resource group | 1-80 | Alphanumerics, underscores, periods, and hyphens.<br><br>Start with alphanumeric. End with alphanumeric or underscore. |
> | snapshots | resource group | 1-80 | Alphanumerics, underscores, periods, and hyphens.<br><br>Start with alphanumeric. End with alphanumeric or underscore. |
> | virtualMachines | resource group | 1-15 (Windows)<br>1-64 (Linux)<br><br>See note below. | Can't use spaces, control characters, or these characters:<br> `~ ! @ # $ % ^ & * ( ) = + _ [ ] { } \ | ; : . ' " , < > / ?`<br><br>Windows VMs can't include period or end with hyphen.<br><br>Linux VMs can't end with period or hyphen. |
> | virtualMachineScaleSets | resource group | 1-15 (Windows)<br>1-64 (Linux)<br><br>See note below. | Can't use spaces, control characters, or these characters:<br> `~ ! @ # $ % ^ & * ( ) = + _ [ ] { } \ | ; : . ' " , < > / ?`<br><br>Can't start with underscore. Can't end with period or hyphen. |

> [!NOTE]
> Azure virtual machines have two distinct names: resource name and host name. When you create a virtual machine in the portal, the same value is used for both names. The restrictions in the preceding table are for the host name. The actual resource name can have up to 64 characters.

## Microsoft.Communication

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | communicationServices | global | 1-63 | Alphanumerics and hyphens.<br><br>Can't start or end with hyphen.<br><br>Can't use underscores. |

## Microsoft.ConfidentialLedger

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | ledgers | Resource group | 3-32 | Alphanumerics and hyphens.<br><br>Can't start or end with hyphen. |

## Microsoft.Consumption

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | budgets | subscription or resource group | 1-63 | Alphanumerics, hyphens, and underscores. |

## Microsoft.ContainerInstance

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | containerGroups | resource group | 1-63 | Lowercase letters, numbers, and hyphens.<br><br>Can't start or end with hyphen. Consecutive hyphens aren't allowed. |

## Microsoft.ContainerRegistry

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | registries | global | 5-50 | Alphanumerics. |
> | registries / buildTasks | registry | 5-50 | Alphanumerics. |
> | registries / buildTasks/steps | build task | 5-50 | Alphanumerics. |
> | registries / replications | registry | 5-50 | Alphanumerics. |
> | registries / scopeMaps | registry | 5-50 | Alphanumerics, hyphens, and underscores. |
> | registries / tasks | registry | 5-50 | Alphanumerics, hyphens, and underscores. |
> | registries / tokens | registry | 5-50 | Alphanumerics, hyphens, and underscores. |
> | registries / webhooks | registry | 5-50 | Alphanumerics. |

## Microsoft.ContainerService

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | managedClusters | resource group | 1-63 | Alphanumerics, underscores, and hyphens.<br><br>Start and end with alphanumeric. |
> | openShiftManagedClusters | resource group | 1-30 | Alphanumerics. |

## Microsoft.CustomerInsights

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | hubs | resource group | 1-64 | Alphanumerics.<br><br>Start with letter.  |
> | hubs / authorizationPolicies | hub | 1-50 | Alphanumerics, underscores, and periods.<br><br>Start and end with alphanumeric. |
> | hubs / connectors | hub | 1-128 | Alphanumerics and underscores.<br><br>Start with letter. |
> | hubs / connectors/mappings | connector | 1-128 | Alphanumerics and underscores.<br><br>Start with letter. |
> | hubs / interactions | hub | 1-128 | Alphanumerics and underscores.<br><br>Start with letter. |
> | hubs / kpi | hub | 1-512 | Alphanumerics and underscores.<br><br>Start with letter. |
> | hubs / links | hub | 1-512 | Alphanumerics and underscores.<br><br>Start with letter. |
> | hubs / predictions | hub | 1-512 | Alphanumerics and underscores.<br><br>Start with letter. |
> | hubs / profiles | hub | 1-128 | Alphanumerics and underscores.<br><br>Start with letter. |
> | hubs / relationshipLinks | hub | 1-512 | Alphanumerics and underscores.<br><br>Start with letter. |
> | hubs / relationships | hub | 1-512 | Alphanumerics and underscores.<br><br>Start with letter. |
> | hubs / roleAssignments | hub | 1-128 | Alphanumerics and underscores.<br><br>Start with letter. |
> | hubs / views | hub | 1-512 | Alphanumerics and underscores.<br><br>Start with letter. |

## Microsoft.CustomProviders

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | associations | resource group | 1-180 | Can't use:<br>`%&\\?/` or control characters<br><br>Can't end with period or space. |
> | resourceProviders | resource group | 3-64 | Can't use:<br>`%&\\?/` or control characters<br><br>Can't end with period or space. |

## Microsoft.DataBox

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | jobs | resource group | 3-24 | Alphanumerics, hyphens, underscores and periods. |

## Microsoft.Databricks

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | workspaces | resource group | 3-64 | Alphanumerics, underscores, and hyphens |

## Microsoft.DataFactory

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | factories | global | 3-63 | Alphanumerics and hyphens.<br><br>Start and end with alphanumeric. |
> | factories / dataflows | factory | 1-260 | Can't use:<br>`<>*#.%&:\\+?/` or control characters<br><br>Start with alphanumeric. |
> | factories / datasets | factory | 1-260 | Can't use:<br>`<>*#.%&:\\+?/` or control characters<br><br>Start with alphanumeric. |
> | factories / integrationRuntimes | factory | 3-63 | Alphanumerics and hyphens.<br><br>Start and end with alphanumeric. |
> | factories / linkedservices | factory | 1-260 | Can't use:<br>`<>*#.%&:\\+?/` or control characters<br><br>Start with alphanumeric. |
> | factories / pipelines | factory | 1-260 | Can't use:<br>`<>*#.%&:\\+?/` or control characters<br><br>Start with alphanumeric. |
> | factories / triggers | factory | 1-260 | Can't use:<br>`<>*#.%&:\\+?/` or control characters<br><br>Start with alphanumeric. |
> | factories / triggers / rerunTriggers | trigger | 1-260 | Can't use:<br>`<>*#.%&:\\+?/` or control characters<br><br>Start with alphanumeric. |

## Microsoft.DataLakeAnalytics

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | accounts | global | 3-24 | Lowercase letters and numbers. |
> | accounts / computePolicies | account | 3-60 | Alphanumerics, hyphens, and underscores. |
> | accounts / dataLakeStoreAccounts | account | 3-24 | Lowercase letters and numbers. |
> | accounts / firewallRules | account | 3-50 | Alphanumerics, hyphens, and underscores. |
> | accounts / storageAccounts | account | 3-60 | Alphanumerics, hyphens, and underscores. |

## Microsoft.DataLakeStore

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | accounts | global | 3-24 | Lowercase letters and numbers. |
> | accounts / firewallRules | account | 3-50 | Alphanumerics, hyphens, and underscores. |
> | accounts / virtualNetworkRules | account | 3-50 | Alphanumerics, hyphens, and underscores. |

## Microsoft.DataMigration

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | services | resource group | 2-62 | Alphanumerics, hyphens, periods, and underscores.<br><br>Start with alphanumeric. |
> | services / projects | service | 2-57 | Alphanumerics, hyphens, periods, and underscores.<br><br>Start with alphanumeric. |

## Microsoft.DBforMariaDB

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | servers | global | 3-63 | Lowercase letters, hyphens and numbers.<br><br>Can't start or end with hyphen. |
> | servers / databases | servers | 1-63 | Alphanumerics and hyphens. |
> | servers / firewallRules | servers | 1-128 | Alphanumerics, hyphens, and underscores. |
> | servers / virtualNetworkRules | servers | 1-128 | Alphanumerics and hyphens. |

## Microsoft.DBforMySQL

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | servers | global | 3-63 | Lowercase letters, hyphens and numbers.<br><br>Can't start or end with hyphen. |
> | servers / databases | servers | 1-63 | Alphanumerics and hyphens. |
> | servers / firewallRules | servers | 1-128 | Alphanumerics, hyphens, and underscores. |
> | servers / virtualNetworkRules | servers | 1-128 | Alphanumerics and hyphens. |

## Microsoft.DBforPostgreSQL

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | servers | global | 3-63 | Lowercase letters, hyphens and numbers.<br><br>Can't start or end with hyphen. |
> | servers / databases | servers | 1-63 | Alphanumerics and hyphens. |
> | servers / firewallRules | servers | 1-128 | Alphanumerics, hyphens, and underscores. |
> | servers / virtualNetworkRules | servers | 1-128 | Alphanumerics and hyphens. |

## Microsoft.Devices

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | IotHubs | global | 3-50 | Alphanumerics and hyphens.<br><br>Can't end with hyphen. |
> | IotHubs / certificates | IoT hub | 1-64 | Alphanumerics, hyphens, periods, and underscores. |
> | IotHubs / eventHubEndpoints / ConsumerGroups | eventHubEndpoints | 1-50 | Alphanumerics, hyphens, periods, and underscores. |
> | provisioningServices | resource group | 3-64 | Alphanumerics and hyphens.<br><br>End with alphanumeric. |
> | provisioningServices / certificates | provisioningServices | 1-64 | Alphanumerics, hyphens, periods, and underscores. |

## Microsoft.DevTestLab

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | labs | resource group | 1-50 | Alphanumerics, underscores, and hyphens. |
> | labs / customimages | lab | 1-80 | Alphanumerics, underscores, hyphens, and parentheses. |
> | labs / formulas | lab | 1-80 | Alphanumerics, underscores, hyphens, and parentheses. |
> | labs / virtualmachines | lab | 1-15 (Windows)<br>1-64 (Linux) | Alphanumerics and hyphens.<br><br>Start and end with alphanumeric. Can't be all numbers. |

## Microsoft.DocumentDB

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | databaseAccounts | global | 3-44 | Lowercase letters, numbers, and hyphens.<br><br>Start with lowercase letter or number. |

## Microsoft.ElasticSan (preview)

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | elasticSans | global | 3-24 | Lowercase letters, numbers, hyphens and underscores.<br><br>Start with lowercase letter or number.<br><br>Must begin and end with a letter or a number.<br><br>Each hyphen and underscore must be preceded and followed by an alphanumeric character. |
> | elasticSans / volumeGroups | elastic san | 3-63 | Lowercase letters, numbers and hyphens.<br><br>Start with lowercase letter or number.<br><br>Must begin and end with a letter or a number.<br><br>Each hyphen must be preceded and followed by an alphanumeric character. |

## Microsoft.EventGrid

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | domains | resource group | 3-50 | Alphanumerics and hyphens. |
> | domains / topics | domain | 3-50 | Alphanumerics and hyphens. |
> | eventSubscriptions | resource group | 3-64 | Alphanumerics and hyphens. |
> | topics | region | 3-50 | Alphanumerics and hyphens. |

## Microsoft.EventHub

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | clusters | resource group | 6-50 | Alphanumerics and hyphens.<br><br>Start with letter. End with letter or number. |
> | namespaces | global | 6-50 | Alphanumerics and hyphens.<br><br>Start with letter. End with letter or number. |
> | namespaces / AuthorizationRules | namespace | 1-50 | Alphanumerics, periods, hyphens and underscores.<br><br>Start and end with letter or number. |
> | namespaces / disasterRecoveryConfigs | global | 6-50 | Alphanumerics and hyphens.<br><br>Start with letter. End with alphanumeric. |
> | namespaces / eventhubs | namespace | 1-256 | Alphanumerics, periods, hyphens and underscores.<br><br>Start and end with letter or number. |
> | namespaces / eventhubs / authorizationRules | event hub | 1-50 | Alphanumerics, periods, hyphens and underscores.<br><br>Start and end with letter or number. |
> | namespaces / eventhubs / consumergroups | event hub | 1-50 | Alphanumerics, periods, hyphens and underscores.<br><br>Start and end with letter or number. |

## Microsoft.HDInsight

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | clusters | global | 3-59 | Alphanumerics and hyphens<br><br>Start and end with letter or number. |

## Microsoft.ImportExport

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | jobs | resource group | 2-64 | Alphanumerics and hyphens.<br><br>Start with letter. |

## Microsoft.Insights

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | actionGroups | resource group | 1-260 | Can't use:<br>`:<>+/&%\?` or control characters <br><br>Can't end with space or period.  |
> | components | resource group | 1-260 | Can't use:<br>`%&\?/` or control characters <br><br>Can't end with space or period.  |
> | scheduledQueryRules | resource group | 1-260 | Can't use:<br>`*<>%{}&:\\?/#` or control characters <br><br>Can't end with space or period.  |
> | metricAlerts | resource group | 1-260 | Can't use:<br>`*#&+:<>?@%{}\/` or control characters <br><br>Can't end with space or period.  |
> | activityLogAlerts | resource group | 1-260 | Can't use:<br>`<>*%{}&:\\?+/#` or control characters <br><br>Can't end with space or period.  |

## Microsoft.IoTCentral

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | IoTApps | global | 2-63 | Lowercase letters, numbers and hyphens.<br><br>Start with lowercase letter or number. |

## Microsoft.KeyVault

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | vaults | global | 3-24 | Alphanumerics and hyphens.<br><br>Start with letter. End with letter or digit. Can't contain consecutive hyphens. |
> | vaults / secrets | Vault | 1-127 | Alphanumerics and hyphens. |

## Microsoft.Kusto

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | clusters | global | 4-22 | Lowercase letters and numbers.<br><br>Start with letter. |
> | /clusters / databases | cluster | 1-260 | Alphanumerics, hyphens, spaces, and periods. |
> | /clusters / databases / dataConnections | database | 1-40 | Alphanumerics, hyphens, spaces, and periods. |
> | /clusters / databases / eventhubconnections | database | 1-40 | Alphanumerics, hyphens, spaces, and periods. |

## Microsoft.LabServices

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | labplans | resource group | 1-100 | Alphanumerics, hyphens, periods, and underscores.<br><br>Start with letter and end with alphanumeric. |
> | labs | resource group | 1-100 | Alphanumerics, hyphens, periods, and underscores.<br><br>Start with letter and end with alphanumeric. |

## Microsoft.LoadTestService

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | loadtests | global | 1-64 | Can't use:<br>`<>*&@:?+/\,;=.|[]"` or space.<br><br>Can't start with underscore, hyphen, or number. Can't end with underscore or hyphen.  |

## Microsoft.Logic

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | integrationAccounts | resource group | 1-80 | Alphanumerics, hyphens, underscores, periods, and parenthesis. |
> | integrationAccounts / assemblies | integration account | 1-80 | Alphanumerics, hyphens, underscores, periods, and parenthesis. |
> | integrationAccounts / batchConfigurations | integration account | 1-20 | Alphanumerics. |
> | integrationAccounts / certificates | integration account | 1-80 | Alphanumerics, hyphens, underscores, periods, and parenthesis. |
> | integrationAccounts / maps | integration account | 1-80 | Alphanumerics, hyphens, underscores, periods, and parenthesis. |
> | integrationAccounts / partners | integration account | 1-80 | Alphanumerics, hyphens, underscores, periods, and parenthesis. |
> | integrationAccounts / rosettanetprocessconfigurations | integration account | 1-80 | Alphanumerics, hyphens, underscores, periods, and parenthesis. |
> | integrationAccounts / schemas | integration account | 1-80 | Alphanumerics, hyphens, underscores, periods, and parenthesis. |
> | integrationAccounts / sessions | integration account | 1-80 | Alphanumerics, hyphens, underscores, periods, and parenthesis. |
> | integrationServiceEnvironments | resource group | 1-80 | Alphanumerics, hyphens, periods, and underscores. |
> | integrationServiceEnvironments / managedApis | integration service environment | 1-80 | Alphanumerics, hyphens, periods, and underscores. |
> | workflows | resource group | 1-43 | Alphanumerics, hyphens, underscores, periods, and parenthesis. |

## Microsoft.MachineLearning

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | commitmentPlans | resource group | 1-260 | Can't use:<br>`<>*%&:?+/\\` or control characters<br><br>Can't end with a space. |
> | webServices | resource group | 1-260 | Can't use:<br>`<>*%&:?+/\\` or control characters<br><br>Can't end with a space. |
> | workspaces | resource group | 1-260 | Can't use:<br>`<>*%&:?+/\\` or control characters<br><br>Can't end with a space. |

## Microsoft.MachineLearningServices

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | workspaces | resource group | 3-33 | Alphanumerics and hyphens |
> | workspaces / computes | workspace | 3-24 for compute instance<br>3-32 for AML compute<br>2-16 for other compute types | Alphanumerics and hyphens. |
> | workspaces / datastores | workspace | Maximum 255 characters for datastore name| Datastore name consists only of lowercase letters, digits, and underscores |

## Microsoft.ManagedIdentity

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | userAssignedIdentities | resource group | 3-128 | Alphanumerics, hyphens, and underscores<br><br>Start with letter or number. |

## Microsoft.Maps

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | accounts | resource group | 1-98 (for resource group name and account name) | Alphanumerics, underscores, periods, and hyphens.<br><br>Start with alphanumeric. |

## Microsoft.Media

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | mediaservices | Azure region | 3-24 | Lowercase letters and numbers. |
> | mediaservices / liveEvents | Media service | 1-32 | Alphanumerics and hyphens.<br><br>Start with alphanumeric. |
> | mediaservices / liveEvents / liveOutputs | Live event | 1-256 | Alphanumerics and hyphens.<br><br>Start with alphanumeric. |
> | mediaservices / streamingEndpoints | Media service | 1-24 | Alphanumerics and hyphens.<br><br>Start with alphanumeric. |

## Microsoft.MobileNetwork

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | mobileNetworks | Resource Group | 1-64 | Alphanumerics and hyphens.<br><br>Start with alphanumeric. |
> | mobileNetworks / sites | Mobile Network | 1-64 | Alphanumerics and hyphens.<br><br>Start with alphanumeric. |
> | mobileNetworks / slices | Mobile Network | 1-64 | Alphanumerics and hyphens.<br><br>Start with alphanumeric. |
> | mobileNetworks / services | Mobile Network | 1-64 | Alphanumerics and hyphens.<br><br>Start with alphanumeric. <br><br> The following words cannot be used on their own as the name: `default`, `requested`, `service`.|
> | mobileNetworks / dataNetworks | Mobile Network | 1-64 | Alphanumeric, hyphens and a period/dot (`.`) <br><br> Start and end with alphanumeric. <br><br> Note: A period/dot (`.`) must be followed by an alphanumeric character. |
> | mobileNetworks / simPolicies | Mobile Network | 1-64 | Alphanumerics and hyphens.<br><br>Start with alphanumeric. |
> | packetCoreControlPlanes | Resource Group | 1-64 | Alphanumeric, underscores and hyphens. <br><br> Start with alphanumeric. |
> | packetCoreControlPlanes / packetCoreDataPlanes | Packet Core Control Plane | 1-64 | Alphanumeric, underscores and hyphens. <br><br> Start with alphanumeric. |
> | packetCoreControlPlanes / packetCoreDataPlanes / attachedDataNetworks | Mobile Network | 1-64 | Alphanumeric, hyphens and a period/dot (`.`) <br><br> Start and end with alphanumeric. <br><br> Note: A period/dot (`.`) must be followed by an alphanumeric character. |
> | simGroups | Resource Group | 1-64 | Alphanumeric, underscores and hyphens <br><br> Start with alphanumeric |
> | simGroups / sims | Sim Group | 1-64 | Alphanumeric, underscores and hyphens <br><br> Start with alphanumeric |

## Microsoft.NetApp

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | netAppAccounts | resource group | 1-128 | Alphanumerics, underscores, and hyphens. <br><br> Start with alphanumeric. |
> | netAppAccounts / backups | NetApp account | 3-225 | Alphanumerics, underscores, periods, and hyphens. <br><br> Start with alphanumeric. |
> | netAppAccounts / backupPolicies | NetApp account | 1-64 | Alphanumerics, underscores, and hyphens. <br><br> Start with alphanumeric. |
> | netAppAccounts / capacityPools | NetApp account | 1-64 |  Alphanumerics, underscores, and hyphens.<br><br>Start with alphanumeric. |
> | netAppAccounts / snapshots | NetApp account | 1-255 | Alphanumerics, underscores, and hyphens. <br><br> Start with alphanumeric. |
> | netAppAccounts / snapshotPolicies | NetApp account | 1-64 |  Alphanumerics, underscores, and hyphens.<br><br>Start with alphanumeric. |
> | netAppAccounts / volumes | NetApp account | 1-64 | Alphanumerics, underscores, and hyphens. <br><br> Start with alphanumeric. <br><br> Volume cannot be named `bin` or `default`. |
> | netAppAccounts / volumeGroups | NetApp account | 3-64 |  Alphanumerics, underscores, and hyphens.<br><br>Start with alphanumeric. |

## Microsoft.Network

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | applicationGateways | resource group | 1-80 | Alphanumerics, underscores, periods, and hyphens.<br><br>Start with alphanumeric. End alphanumeric or underscore. |
> | applicationSecurityGroups | resource group | 1-80 | Alphanumerics, underscores, periods, and hyphens.<br><br>Start with alphanumeric. End alphanumeric or underscore. |
> | azureFirewalls | resource group | 1-80 | Alphanumerics, underscores, periods, and hyphens.<br><br>Start with alphanumeric. End with alphanumeric or underscore. |
> | bastionHosts | resource group | 1-80 | Alphanumerics, underscores, periods, and hyphens.<br><br>Start with alphanumeric. End alphanumeric or underscore. |
> | connections | resource group | 1-80 | Alphanumerics, underscores, periods, and hyphens.<br><br>Start with alphanumeric. End alphanumeric or underscore. |
> | dnsForwardingRuleset | resource group | 1-80 | Alphanumerics, underscores and hyphens.<br><br>Start with alphanumeric. End alphanumeric. |
> | dnsResolvers | resource group | 1-80 | Alphanumerics, underscores and hyphens.<br><br>Start with alphanumeric. End alphanumeric. |
> | dnsResolvers / inboundEndpoints | resource group | 1-80 | Alphanumerics, underscores and hyphens.<br><br>Start with alphanumeric. End alphanumeric. |
> | dnsResolvers / outboundEndpoints | resource group | 1-80 | Alphanumerics, underscores and hyphens.<br><br>Start with alphanumeric. End alphanumeric. |
> | dnsZones | resource group | 1-63 characters<br><br>2 to 34 labels<br><br>Each label is a set of characters separated by a period. For example, **contoso.com** has 2 labels. | Each label can contain alphanumerics, underscores, and hyphens.<br><br>Each label is separated by a period. |
> | expressRouteCircuits | resource group | 1-80 | Alphanumerics, underscores, periods, and hyphens.<br><br>Start with alphanumeric. End alphanumeric or underscore. |
> | firewallPolicies | resource group | 1-80 | Alphanumerics, underscores, periods, and hyphens.<br><br>Start with alphanumeric. End alphanumeric or underscore. |
> | firewallPolicies / ruleGroups | firewall policy | 1-80 | Alphanumerics, underscores, periods, and hyphens.<br><br>Start with alphanumeric. End alphanumeric or underscore. |
> | frontDoors | global | 5-64 | Alphanumerics and hyphens.<br><br>Start and end with alphanumeric. |
> | frontdoorWebApplicationFirewallPolicies | resource group | 1-128 | Alphanumerics.<br><br>Start with letter. |
> | loadBalancers | resource group | 1-80 | Alphanumerics, underscores, periods, and hyphens.<br><br>Start with alphanumeric. End alphanumeric or underscore. |
> | loadBalancers / inboundNatRules | load balancer | 1-80 | Alphanumerics, underscores, periods, and hyphens.<br><br>Start with alphanumeric. End alphanumeric or underscore. |
> | localNetworkGateways | resource group | 1-80 | Alphanumerics, underscores, periods, and hyphens.<br><br>Start with alphanumeric. End alphanumeric or underscore. |
> | networkInterfaces | resource group | 1-80 | Alphanumerics, underscores, periods, and hyphens.<br><br>Start with alphanumeric. End alphanumeric or underscore. |
> | networkSecurityGroups | resource group | 1-80 | Alphanumerics, underscores, periods, and hyphens.<br><br>Start with alphanumeric. End alphanumeric or underscore. |
> | networkSecurityGroups / securityRules | network security group | 1-80 |  Alphanumerics, underscores, periods, and hyphens.<br><br>Start with alphanumeric. End alphanumeric or underscore. |
> | networkWatchers | resource group | 1-80 | Alphanumerics, underscores, periods, and hyphens.<br><br>Start with alphanumeric. End alphanumeric or underscore. |
> | privateDnsZones | resource group | 1-63 characters<br><br>2 to 34 labels<br><br>Each label is a set of characters separated by a period. For example, **contoso.com** has 2 labels. | Each label can contain alphanumerics, underscores, and hyphens.<br><br>Each label is separated by a period. |
> | privateDnsZones / virtualNetworkLinks | private DNS zone | 1-80 | Alphanumerics, underscores, periods, and hyphens.<br><br>Start with alphanumeric. End alphanumeric or underscore. |
> | privateEndpoints | resource group | 2-64 | Alphanumerics, underscores, periods, and hyphens.<br><br>Start with alphanumeric. End alphanumeric or underscore. |
> | publicIPAddresses | resource group | 1-80 | Alphanumerics, underscores, periods, and hyphens.<br><br>Start with alphanumeric. End alphanumeric or underscore. |
> | publicIPPrefixes | resource group | 1-80 | Alphanumerics, underscores, periods, and hyphens.<br><br>Start with alphanumeric. End alphanumeric or underscore. |
> | routeFilters | resource group | 1-80 | Alphanumerics, underscores, periods, and hyphens.<br><br>Start with alphanumeric. End alphanumeric or underscore. |
> | routeFilters / routeFilterRules | route filter | 1-80 | Alphanumerics, underscores, periods, and hyphens.<br><br>Start with alphanumeric. End alphanumeric or underscore. |
> | routeTables | resource group | 1-80 | Alphanumerics, underscores, periods, and hyphens.<br><br>Start with alphanumeric. End alphanumeric or underscore. |
> | routeTables / routes | route table | 1-80 | Alphanumerics, underscores, periods, and hyphens.<br><br>Start with alphanumeric. End alphanumeric or underscore. |
> | serviceEndpointPolicies | resource group | 1-80 | Alphanumerics, underscores, periods, and hyphens.<br><br>Start with alphanumeric. End alphanumeric or underscore. |
> | trafficmanagerprofiles | global | 1-63 | Alphanumerics, hyphens, and periods.<br><br>Start and end with alphanumeric. |
> | virtualNetworkGateways | resource group | 1-80 | Alphanumerics, underscores, periods, and hyphens.<br><br>Start with alphanumeric. End alphanumeric or underscore. |
> | virtualNetworks | resource group | 2-64 | Alphanumerics, underscores, periods, and hyphens.<br><br>Start with alphanumeric. End alphanumeric or underscore. |
> | virtualnetworks / subnets | virtual network | 1-80 | Alphanumerics, underscores, periods, and hyphens.<br><br>Start with alphanumeric. End alphanumeric or underscore. |
> | virtualNetworks / virtualNetworkPeerings | virtual network | 1-80 | Alphanumerics, underscores, periods, and hyphens.<br><br>Start with alphanumeric. End alphanumeric or underscore. |
> | virtualWans | resource group | 1-80 | Alphanumerics, underscores, periods, and hyphens.<br><br>Start with alphanumeric. End alphanumeric or underscore. |
> | vpnGateways | resource group | 1-80 | Alphanumerics, underscores, periods, and hyphens.<br><br>Start with alphanumeric. End alphanumeric or underscore. |
> | vpnGateways / vpnConnections | VPN gateway | 1-80 | Alphanumerics, underscores, periods, and hyphens.<br><br>Start with alphanumeric. End alphanumeric or underscore. |
> | vpnSites | resource group | 1-80 | Alphanumerics, underscores, periods, and hyphens.<br><br>Start with alphanumeric. End alphanumeric or underscore. |

## Microsoft.NotificationHubs

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | namespaces | global | 6-50 | Alphanumerics and hyphens<br><br>Start with letter. End with alphanumeric. |
> | namespaces / AuthorizationRules | namespace | 1-256 | Alphanumerics, periods, hyphens, and underscores.<br><br>Start alphanumeric. |
> | namespaces / notificationHubs | namespace | 1-260 | Alphanumerics, periods, hyphens, and underscores.<br><br>Start alphanumeric. |
> | namespaces / notificationHubs / AuthorizationRules | notification hub | 1-256 | Alphanumerics, periods, hyphens, and underscores.<br><br>Start alphanumeric. |

## Microsoft.OperationalInsights

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | clusters | resource group | 4-63 | Alphanumerics and hyphens.<br><br>Start and end with alphanumeric. |
> | workspaces | resource group | 4-63 | Alphanumerics and hyphens.<br><br>Start and end with alphanumeric. |

## Microsoft.OperationsManagement

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | solutions | workspace | N/A | For solutions authored by Microsoft, the name must be in the pattern:<br>`SolutionType(WorkspaceName)`<br><br>For solutions authored by third parties, the name must be in the pattern:<br>`SolutionType[WorkspaceName]`<br><br>For example, a valid name is:<br>`AntiMalware(contoso-IT)`<br><br>The solution type is case-sensitive. |

## Microsoft.Portal

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | dashboards | resource group | 3-160 | Alphanumerics and hyphens.<br><br>To use restricted characters, add a tag named **hidden-title** with the dashboard name you want to use. The portal displays that name when showing the dashboard. |

## Microsoft.PowerBI

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | workspaceCollections | region | 3-63 | Alphanumerics and hyphens.<br><br>Can't start with hyphen. Can't use consecutive hyphens. |

## Microsoft.PowerBIDedicated

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | capacities | region | 3-63 | Lowercase letters or numbers<br><br>Start with lowercase letter. |

## Microsoft.Quantum

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | workspaces | region | 2-54 | Alphanumerics and hyphens.<br><br>Can't start or end with hyphen. |

## Microsoft.RecoveryServices

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | vaults | resource group | 2-50 | Alphanumerics and hyphens.<br><br>Start with letter. |
> | vaults / backupPolicies | vault | 3-150 | Alphanumerics and hyphens.<br><br>Start with letter. Can't end with hyphen. |

## Microsoft.Relay

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | namespaces | global | 6-50 | Alphanumerics and hyphens.<br><br>Start with a letter. End with a letter or number. |
> | namespaces / AuthorizationRules | namespace | 1-50 |  Alphanumerics, periods, hyphens and underscores.<br><br>Start and end with alphanumeric. |
> | namespaces / HybridConnections | namespace | 1-260 | Alphanumerics, periods, hyphens, underscores, and slashes.<br><br>Start and end with alphanumeric. |
> | namespaces / HybridConnections/authorizationRules | hybrid connection | 1-50 | Alphanumerics, periods, hyphens and underscores.<br><br>Start and end with alphanumeric. |
> | namespaces / WcfRelays | namespace | 1-260 | Alphanumerics, periods, hyphens, underscores, and slashes.<br><br>Start and end with alphanumeric. |
> | namespaces / WcfRelays / authorizationRules | Wcf relay | 1-50 | Alphanumerics, periods, hyphens and underscores.<br><br>Start and end with alphanumeric. |

## Microsoft.Resources

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | deployments | resource group | 1-64 | Alphanumerics, underscores, parentheses, hyphens, and periods. |
> | resourcegroups | subscription | 1-90 | Underscores, hyphens, periods, parentheses, and letters or digits as defined by the [Char.IsLetterOrDigit](/dotnet/api/system.char.isletterordigit) function.<br><br>Valid characters are members of the following categories in [UnicodeCategory](/dotnet/api/system.globalization.unicodecategory):<br>**UppercaseLetter**,<br>**LowercaseLetter**,<br>**TitlecaseLetter**,<br>**ModifierLetter**,<br>**OtherLetter**,<br>**DecimalDigitNumber**.<br><br>Can't end with period. |
> | tagNames | resource | 1-512 | Can't use:<br>`<>%&\?/` or control characters |
> | tagNames / tagValues | tag name | 1-256 | All characters. |
> | templateSpecs | resource group | 1-90 | Alphanumerics, underscores, parentheses, hyphens, and periods. |

## Microsoft.Security

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | advancedThreatProtectionSettings | resource group | see value | Must be `current` |
> | alertsSuppressionRules | subscription | 1-260 | Alphanumerics, underscores, and hyphens. |
> | assessmentMetadata | assessment type | 1-260 | Alphanumerics, underscores, and hyphens. |
> | assessments | assessment type | 1-260 | Alphanumerics, underscores, and hyphens. |
> | automations | resource group | 1-260 | Alphanumerics, underscores, and hyphens. |
> | autoProvisioningSettings | subscription | 1-260 | Alphanumerics, underscores, and hyphens. |
> | connectors | subscription | 1-260 | Alphanumerics, underscores, and hyphens. |
> | deviceSecurityGroups | resource group | 1-260 | Alphanumerics, underscores, and hyphens. |
> | informationProtectionPolicies | resource group | see values | Use one of:<br>`custom`<br>`effective` |
> | iotSecuritySolutions | resource group | 1-260 | Alphanumerics, underscores, and hyphens. |
> | locations / applicationWhitelistings | subscription | 1-260 | Alphanumerics, underscores, and hyphens. |
> | locations / jitNetworkAccessPolicies | resource group | 1-260 | Alphanumerics, underscores, and hyphens. |
> | ingestionSettings | subscription | 1-260 | Alphanumerics, underscores, and hyphens. |
> | pricings | subscription | 1-260 | Alphanumerics, underscores, and hyphens. |
> | securityContacts | subscription | 1-260 | Alphanumerics, underscores, and hyphens. |
> | settings | subscription | see values | Use one of:<br>`MCAS`<br>`Sentinel`<br>`WDATP`<br>`WDATP_EXCLUDE_LINUX_PUBLIC_PREVIEW` |
> | serverVulnerabilityAssessments | resource type | see value | Must be `Default` |
> | sqlVulnerabilityAssessments / baselineRules | Vulnerability assessment | 1-260 | Alphanumerics, underscores, and hyphens. |

## Microsoft.ServiceBus

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | namespaces | global | 6-50 | Alphanumerics and hyphens.<br><br>Start with a letter. End with a letter or number.<br><br>For more information, see [Create namespace](/rest/api/servicebus/create-namespace). |
> | namespaces / AuthorizationRules | namespace | 1-50 | Alphanumerics, periods, hyphens, and underscores.<br><br>Start and end with alphnumeric. |
> | namespaces / disasterRecoveryConfigs | global | 6-50 | Alphanumerics and hyphens.<br><br>Start with letter. End with alphanumeric. |
> | namespaces / migrationConfigurations | namespace |  | Should always be **$default**. |
> | namespaces / queues | namespace | 1-260 | Alphanumerics, periods, hyphens, underscores, and slashes.<br><br>Start and end with alphanumeric. |
> | namespaces / queues / authorizationRules | queue | 1-50 | Alphanumerics, periods, hyphens, and underscores.<br><br>Start and end with alphnumeric. |
> | namespaces / topics | namespace | 1-260 | Alphanumerics, periods, hyphens, underscores, and slashes.<br><br>Start and end with alphanumeric. |
> | namespaces / topics / authorizationRules | topic | 1-50 | Alphanumerics, periods, hyphens, and underscores.<br><br>Start and end with alphnumeric. |
> | namespaces / topics / subscriptions | topic | 1-50 | Alphanumerics, periods, hyphens, and underscores.<br><br>Start and end with alphnumeric. |
> | namespaces / topics / subscriptions / rules | subscription | 1-50 | Alphanumerics, periods, hyphens, and underscores.<br><br>Start and end with alphnumeric. |

## Microsoft.ServiceFabric

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | clusters | region | 4-23 | Lowercase letters, numbers, and hyphens.<br><br>Start with lowercase letter. End with lowercase letter or number. |

## Microsoft.SignalRService

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | signalR | global | 3-63 | Alphanumerics and hyphens.<br><br>Start with letter. End with letter or number.  |

## Microsoft.Sql

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | managedInstances | global | 1-63 | Lowercase letters, numbers, and hyphens.<br><br> Can't start or end with hyphen. |
> | servers | global | 1-63 | Lowercase letters, numbers, and hyphens.<br><br>Can't start or end with hyphen. |
> | servers / administrators | server |  | Must be `ActiveDirectory`. |
> | servers / databases | server | 1-128 | Can't use:<br>`<>*%&:\/?` or control characters<br><br>Can't end with period or space. |
> | servers / databases / syncGroups | database | 1-150 | Alphanumerics, hyphens, and underscores. |
> | servers / elasticPools | server | 1-128 | Can't use:<br>`<>*%&:\/?` or control characters<br><br>Can't end with period or space. |
> | servers / failoverGroups | global |  1-63 | Lowercase letters, numbers, and hyphens.<br><br>Can't start or end with hyphen. |
> | servers / firewallRules | server | 1-128 | Can't use:<br>`<>*%&:;\/?` or control characters<br><br>Can't end with period. |
> | servers / keys | server |  | Must be in format:<br>`VaultName_KeyName_KeyVersion`. |

## Microsoft.Storage

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | storageAccounts | global | 3-24 | Lowercase letters and numbers. |
> | storageAccounts / blobServices | storage account |  | Must be `default`. |
> | storageAccounts / blobServices / containers | storage account | 3-63 | Lowercase letters, numbers, and hyphens.<br><br>Start with lowercase letter or number. Can't use consecutive hyphens. |
> | storageAccounts / fileServices | storage account |  | Must be `default`. |
> | storageAccounts / fileServices / shares | storage account | 3-63 | Lowercase letters, numbers, and hyphens.<br><br>Can't start or end with hyphen. Can't use consecutive hyphens. |
> | storageAccounts / managementPolicies | storage account |  | Must be `default`. |
> | blob | container | 1-1024 | Any URL characters, case sensitive |
> | queue | storage account | 3-63 | Lowercase letters, numbers, and hyphens.<br><br>Can't start or end with hyphen. Can't use consecutive hyphens. |
> | table | storage account | 3-63 | Alphanumerics.<br><br>Start with letter. |

## Microsoft.StorageSync

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | storageSyncServices | resource group | 1-260 | Alphanumerics, spaces, periods, hyphens, and underscores.<br><br>Can't end with period or space. |
> | storageSyncServices / syncGroups | storage sync service | 1-260 | Alphanumerics, spaces, periods, hyphens, and underscores.<br><br>Can't end with period or space. |

## Microsoft.StorSimple

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | managers | resource group | 2-50 | Alphanumerics and hyphens.<br><br>Start with letter. End with alphanumeric. |

## Microsoft.StreamAnalytics

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | streamingjobs | resource group | 3-63 | Alphanumerics, hyphens, and underscores. |
> | streamingjobs / functions | streaming job | 3-63 | Alphanumerics, hyphens, and underscores. |
> | streamingjobs / inputs | streaming job | 3-63 | Alphanumerics, hyphens, and underscores. |
> | streamingjobs / outputs | streaming job | 3-63 | Alphanumerics, hyphens, and underscores. |
> | streamingjobs / transformations | streaming job | 3-63 | Alphanumerics, hyphens, and underscores. |

## Microsoft.Synapse

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | workspaces | global | 1-50 | Lowercase letters, hyphens, and numbers.<br><br>Start and end with letter or number.<br><br>Can't contain `-ondemand` |
> | workspaces / bigDataPools | workspace | 1-15 | Letters and numbers.<br><br>Start with letter. End with letter or number.<br><br>Can't contain [reserved word](../troubleshooting/error-reserved-resource-name.md). |
> | workspaces / sqlPools | workspace | 1-60 | Can't contain `<>*%&:\/?@-` or control characters. <br><br>Can't end with `.` or space. <br><br>Can't contain [reserved word](../troubleshooting/error-reserved-resource-name.md). |

## Microsoft.TimeSeriesInsights

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | environments | resource group | 1-90 | Can't use:<br>`'<>%&:\?/#` or control characters |
> | environments / accessPolicies | environment | 1-90 | Can't use:<br> `'<>%&:\?/#` or control characters |
> | environments / eventSources | environment | 1-90 | Can't use:<br>`'<>%&:\?/#` or control characters |
> | environments / referenceDataSets | environment | 3-63 | Alphanumerics |

## Microsoft.Web

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | certificates | resource group | 1-260 | Can't use:<br>`/` <br><br>Can't end with space or period.  |
> | serverfarms | resource group | 1-60 | Alphanumeric, hyphens and Unicode characters that can be mapped to Punycode |
> | sites | global or per domain. See note below. | 2-60 | Alphanumeric, hyphens and Unicode characters that can be mapped to Punycode<br><br>Can't start or end with hyphen. |
> | sites / slots | site | 2-59 | Alphanumeric, hyphens and Unicode characters that can be mapped to Punycode |

> [!NOTE]
> A web site must have a globally unique URL. When you create a web site that uses a hosting plan, the URL is `http://<app-name>.azurewebsites.net`. The app name must be globally unique. When you create a web site that uses an App Service Environment, the app name must be unique within the [domain for the App Service Environment](../../app-service/environment/using-an-ase.md#app-access). For both cases, the URL of the site is globally unique.
>
> Azure Functions has the same naming rules and restrictions as Microsoft.Web/sites. When generating the host ID, the function app name is truncated to 32 characters. This can cause host ID collision when a shared storage account is used. For more information, see [Host ID considerations](../../azure-functions/storage-considerations.md#host-id-considerations). 
>
> Unicode characters are parsed to Punycode using the [IdnMapping.GetAscii method](/dotnet/api/system.globalization.idnmapping.getascii)

## Next steps

* For recommendations about how to name resources, see [Ready: Recommended naming and tagging conventions](/azure/cloud-adoption-framework/ready/azure-best-practices/naming-and-tagging).

* All resources with a public endpoint can't include reserved words or trademarks in the name. For a list of the blocked words, see [Resolve reserved resource name errors](../templates/error-reserved-resource-name.md).

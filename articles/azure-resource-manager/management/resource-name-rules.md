---
title: Resource naming restrictions
description: Shows the rules and restrictions for naming Azure resources.
ms.topic: conceptual
ms.date: 01/16/2020
---

# Naming rules and restrictions for Azure resources

This article summarizes naming rules and restrictions for Azure resources. For recommendations about how to name resources, see [Ready: Recommended naming and tagging conventions](/azure/cloud-adoption-framework/ready/azure-best-practices/naming-and-tagging).

Resource names are case-insensitive unless specifically noted in the valid characters column.

In the following tables, the term alphanumeric refers to:

* **a** through **z** (lowercase letters)
* **A** through **Z** (uppercase letters)
* **0** through **9** (numbers)

## Microsoft.AnalysisServices

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | servers | resource group | 3-63 | Lowercase letters and numbers.<br><br>Start with lowercase letter. |

## Microsoft.ApiManagement

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | service | global | 1-50 | Alphanumerics.<br><br>Start with letter. |
> | service / apis | service | 1-256 | Can't use:<br> `*#&+:<>?` |
> | service / apis / issues | api | 1-256 | Can't use:<br> `*#&+:<>?` |
> | service / apis / issues / attachments | issue | 1-256 | Can't use:<br> `*#&+:<>?` |
> | service / apis / issues / comments | issue | 1-256 | Can't use:<br> `*#&+:<>?` |
> | service / apis / operations | api | 1-256 | Can't use:<br> `*#&+:<>?` |
> | service / apis / operations / tags | operation | 1-256 | Can't use:<br> `*#&+:<>?` |
> | service / apis / releases | api | 1-80 | Alphanumerics, underscores, and hyphens.<br><br>Start and end with alphanumeric or underscore. |
> | service / apis / schemas | api | 1-256 | Can't use:<br> `*#&+:<>?` |
> | service / apis / tagDescriptions | api | 1-256 | Can't use:<br> `*#&+:<>?` |
> | service / apis / tags | api | 1-256 | Can't use:<br> `*#&+:<>?` |
> | service / api-version-sets | service | 1-256 | Can't use:<br> `*#&+:<>?` |
> | service / authorizationServers | service | 1-256 | Can't use:<br> `*#&+:<>?` |
> | service / backends | service | 1-256 | Can't use:<br> `*#&+:<>?` |
> | service / certificates | service | 1-256 | Can't use:<br> `*#&+:<>?` |
> | service / diagnostics | service | 1-256 | Can't use:<br> `*#&+:<>?` |
> | service / groups | service | 1-256 | Can't use:<br> `*#&+:<>?` |
> | service / groups / users | group | 1-256 | Can't use:<br> `*#&+:<>?` |
> | service / identityProviders | service | 1-256 | Can't use:<br> `*#&+:<>?` |
> | service / loggers | service | 1-256 | Can't use:<br> `*#&+:<>?` |
> | service / notifications | service | 1-256 | Can't use:<br> `*#&+:<>?` |
> | service / notifications / recipientEmails | notification | 1-256 | Can't use:<br> `*#&+:<>?` |
> | service / openidConnectProviders | service | 1-256 | Can't use:<br> `*#&+:<>?` |
> | service / policies | service | 1-256 | Can't use:<br> `*#&+:<>?` |
> | service / products | service | 1-256 | Can't use:<br> `*#&+:<>?` |
> | service / products / apis | product | 1-256 | Can't use:<br> `*#&+:<>?` |
> | service / products / groups | product | 1-256 | Can't use:<br> `*#&+:<>?` |
> | service / products / tags | product | 1-256 | Can't use:<br> `*#&+:<>?` |
> | service / properties | service | 1-256 | Can't use:<br> `*#&+:<>?` |
> | service / subscriptions | service | 1-256 | Can't use:<br> `*#&+:<>?` |
> | service / tags | service | 1-256 | Can't use:<br> `*#&+:<>?` |
> | service / templates | service | 1-256 | Can't use:<br> `*#&+:<>?` |
> | service / users | service | 1-256 | Can't use:<br> `*#&+:<>?` |

## Microsoft.AppConfiguration

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | configurationStores | resource group | 5-50 | Alphanumerics, underscores, and hyphens. |

## Microsoft.Authorization

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | locks | scope of assignment | 1-90 | Alphanumerics, periods, underscores, hyphens, and parenthesis.<br><br>Can't end in period. |
> | policyassignments | scope of assignment | 1-128 display name<br><br>1-260 resource name | Display name can contain any characters.<br><br>Resource name can't include `%` and can't end with period or space. |
> | policydefinitions | scope of definition | 1-128 display name<br><br>1-260 resource name | Display name can contain any characters.<br><br>Resource name can't include `%` and can't end with period or space. |
> | policySetDefinitions | scope of definition | 1-128 display name<br><br>1-260 resource name | Display name can contain any characters.<br><br>Resource name can't include `%` and can't end with period or space.  |

## Microsoft.Automation

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | automationAccounts | resource group | 6-50 | Alphanumerics and hyphens.<br><br>Start with letter, and end with alphanumeric. |
> | automationAccounts / certificates | automation account | 1-128 | Can't use:<br> `<>*%&:\?.+/` <br><br>Can't end with space.  |
> | automationAccounts / connections | automation account | 1-128 | Can't use:<br> `<>*%&:\?.+/` <br><br>Can't end with space. |
> | automationAccounts / credentials | automation account | 1-128 | Can't use:<br> `<>*%&:\?.+/` <br><br>Can't end with space. |
> | automationAccounts / runbooks | automation account | 1-63 | Alphanumerics, underscores, and hyphens.<br><br>Start with letter.  |
> | automationAccounts / schedules | automation account | 1-128 | Can't use:<br> `<>*%&:\?.+/` <br><br>Can't end with space. |
> | automationAccounts / variables | automation account | 1-128 | Can't use:<br> `<>*%&:\?.+/` <br><br>Can't end with space. |
> | automationAccounts / watchers | automation account | 1-63 |  Alphanumerics, underscores, and hyphens.<br><br>Start with letter. |
> | automationAccounts / webhooks | automation account | 1-128 | Can't use:<br> `<>*%&:\?.+/` <br><br>Can't end with space. |

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
> | diskEncryptionSets | resource group | 1-80 | Alphanumerics and underscores. |
> | disks | resource group | 1-80 | Alphanumerics and underscores. |
> | galleries | resource group | 1-80 | Alphanumerics and periods.<br><br>Start and end with alphanumeric. |
> | galleries / applications | gallery | 1-80 | Alphanumerics, hyphens, and periods.<br><br>Start and end with alphanumeric. |
> | galleries / applications/versions | application | 32-bit integer | Numbers and periods. |
> | galleries / images | gallery | 1-80 | Alphanumerics, hyphens, and periods.<br><br>Start and end with alphanumeric. |
> | galleries / images / versions | image | 32-bit integer | Numbers and periods. |
> | images | resource group | 1-80 | Alphanumerics, underscores, periods, and hyphens.<br><br>Start with alphanumeric. End with alphanumeric or underscore. |
> | snapshots | resource group | 1-80 | Alphanumerics, underscores, periods, and hyphens.<br><br>Start with alphanumeric. End with alphanumeric or underscore. |
> | virtualMachines | resource group | 1-15 (Windows)<br>1-64 (Linux)<br><br>See note below. | Can't use:<br> `\/""[]:|<>+=;,?*@&`<br><br>Can't start with underscore. Can't end with period or hyphen. |
> | virtualMachineScaleSets | resource group | 1-15 (Windows)<br>1-64 (Linux)<br><br>See note below. | Can't use:<br> `\/""[]:|<>+=;,?*@&`<br><br>Can't start with underscore. Can't end with period or hyphen. |

> [!NOTE]
> Azure virtual machines have two distinct names: resource name and host name. When you create a virtual machine in the portal, the same value is used for both names. The restrictions in the preceding table are for the host name. The actual resource name can have up to 64 characters.

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
> | associations | resource group | 1-180 | Can't use:<br>`%&\\?/`<br><br>Can't end with period or space. |
> | resourceProviders | resource group | 3-64 | Can't use:<br>`%&\\?/`<br><br>Can't end with period or space. |

## Microsoft.DataBox

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | jobs | resource group | 3-24 | Alphanumerics, hyphens, underscores and periods. |

## Microsoft.Databricks

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | workspaces | resource group | 3-30 | Alphanumerics, underscores, and hyphens |

## Microsoft.DataFactory

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | factories | global | 3-63 | Alphanumerics and hyphens.<br><br>Start and end with alphanumeric. |
> | factories / dataflows | factory | 1-260 | Can't use:<br>`<>*#.%&:\\+?/`<br><br>Start with alphanumeric. |
> | factories / datasets | factory | 1-260 | Can't use:<br>`<>*#.%&:\\+?/`<br><br>Start with alphanumeric. |
> | factories / integrationRuntimes | factory | 3-63 | Alphanumerics and hyphens.<br><br>Start and end with alphanumeric. |
> | factories / linkedservices | factory | 1-260 | Can't use:<br>`<>*#.%&:\\+?/`<br><br>Start with alphanumeric. |
> | factories / pipelines | factory | 1-260 | Can't use:<br>`<>*#.%&:\\+?/`<br><br>Start with alphanumeric. |
> | factories / triggers | factory | 1-260 | Can't use:<br>`<>*#.%&:\\+?/`<br><br>Start with alphanumeric. |
> | factories / triggers / rerunTriggers | trigger | 1-260 | Can't use:<br>`<>*#.%&:\\+?/`<br><br>Start with alphanumeric. |

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
> | databaseAccounts | global | 3-31 | Lowercase letters, numbers, and hyphens.<br><br>Start with lowercase letter or number. |

## Microsoft.EventGrid

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | domains | resource group | 3-50 | Alphanumerics and hyphens. |
> | domains / topics | domain | 3-50 | Alphanumerics and hyphens. |
> | eventSubscriptions | resource group | 3-64 | Alphanumerics and hyphens. |
> | topics | resource group | 3-50 | Alphanumerics and hyphens. |

## Microsoft.EventHub

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | clusters | resource group | 6-50 | Alphanumerics and hyphens.<br><br>Start with letter. End with letter or number. |
> | namespaces | global | 6-50 | Alphanumerics and hyphens.<br><br>Start with letter. End with letter or number. |
> | namespaces / AuthorizationRules | namespace | 1-50 | Alphanumerics, periods, hyphens and underscores.<br><br>Start and end with letter or number. |
> | namespaces / disasterRecoveryConfigs | namespace | 1-50 | Alphanumerics, periods, hyphens and underscores.<br><br>Start and end with letter or number. |
> | namespaces / eventhubs | namespace | 1-50 | Alphanumerics, periods, hyphens and underscores.<br><br>Start and end with letter or number. |
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
> | workflows | resource group | 1-80 | Alphanumerics, hyphens, underscores, periods, and parenthesis. |

## Microsoft.MachineLearning

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | commitmentPlans | resource group | 1-260 | Can't use:<br>`<>*%&:?+/\\`<br><br>Can't end with a space. |
> | webServices | resource group | 1-260 | Can't use:<br>`<>*%&:?+/\\`<br><br>Can't end with a space. |
> | workspaces | resource group | 1-260 | Can't use:<br>`<>*%&:?+/\\`<br><br>Can't end with a space. |

## Microsoft.MachineLearningServices

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | workspaces | resource group | 3-33 | Alphanumerics and hyphens. |
> | workspaces / computes | workspace | 2-16 | Alphanumerics and hyphens. |

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
> | mediaservices | resource group | 3-24 | Lowercase letters and numbers. |
> | mediaservices / liveEvents | Media service | 1-32 | Alphanumerics and hyphens.<br><br>Start with alphanumeric. |
> | mediaservices / liveEvents / liveOutputs | Live event | 1-256 | Alphanumerics and hyphens.<br><br>Start with alphanumeric. |
> | mediaservices / streamingEndpoints | Media service | 1-24 | Alphanumerics and hyphens.<br><br>Start with alphanumeric. |

## Microsoft.Network

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | applicationGateways | resource group | 1-80 | Alphanumerics, underscores, periods, and hyphens.<br><br>Start with alphanumeric. End alphanumeric or underscore. |
> | applicationSecurityGroups | resource group | 1-80 | Alphanumerics, underscores, periods, and hyphens.<br><br>Start with alphanumeric. End alphanumeric or underscore. |
> | azureFirewalls | resource group | 1-80 | Alphanumerics, underscores, periods, and hyphens.<br><br>Start with alphanumeric. End with alphanumeric or underscore. |
> | bastionHosts | resource group | 1-80 | Alphanumerics, underscores, periods, and hyphens.<br><br>Start with alphanumeric. End alphanumeric or underscore. |
> | connections | resource group | 1-80 | Alphanumerics, underscores, periods, and hyphens.<br><br>Start with alphanumeric. End alphanumeric or underscore. |
> | dnsZones | resource group | 1-63 characters<br><br>2 to 34 labels<br><br>Each label is a set of characters separated by a period. For example, **contoso.com** has 2 labels. | Each label can contain alphanumerics, underscores, and hyphens.<br><br>Each label is separated by a period. |
> | expressRouteCircuits | resource group | 1-80 | Alphanumerics, underscores, periods, and hyphens.<br><br>Start with alphanumeric. End alphanumeric or underscore. |
> | firewallPolicies | resource group | 1-80 | Alphanumerics, underscores, periods, and hyphens.<br><br>Start with alphanumeric. End alphanumeric or underscore. |
> | firewallPolicies / ruleGroups | firewall policy | 1-80 | Alphanumerics, underscores, periods, and hyphens.<br><br>Start with alphanumeric. End alphanumeric or underscore. |
> | frontDoors | global | 5-64 | Alphanumerics and hyphens.<br><br>Start and end with alphanumeric. |
> | loadBalancers | resource group | 1-80 | Alphanumerics, underscores, periods, and hyphens.<br><br>Start with alphanumeric. End alphanumeric or underscore. |
> | loadBalancers / inboundNatRules | load balancer | 1-80 | Alphanumerics, underscores, periods, and hyphens.<br><br>Start with alphanumeric. End alphanumeric or underscore. |
> | localNetworkGateways | resource group | 1-80 | Alphanumerics, underscores, periods, and hyphens.<br><br>Start with alphanumeric. End alphanumeric or underscore. |
> | networkInterfaces | resource group | 1-80 | Alphanumerics, underscores, periods, and hyphens.<br><br>Start with alphanumeric. End alphanumeric or underscore. |
> | networkSecurityGroups | resource group | 1-80 | Alphanumerics, underscores, periods, and hyphens.<br><br>Start with alphanumeric. End alphanumeric or underscore. |
> | networkSecurityGroups / securityRules | network security group | 1-80 |  Alphanumerics, underscores, periods, and hyphens.<br><br>Start with alphanumeric. End alphanumeric or underscore. |
> | networkWatchers | resource group | 1-80 | Alphanumerics, underscores, periods, and hyphens.<br><br>Start with alphanumeric. End alphanumeric or underscore. |
> | privateDnsZones | resource group | 1-63 characters<br><br>2 to 34 labels<br><br>Each label is a set of characters separated by a period. For example, **contoso.com** has 2 labels. | Each label can contain alphanumerics, underscores, and hyphens.<br><br>Each label is separated by a period. |
> | privateDnsZones / virtualNetworkLinks | private DNS zone | 1-80 | Alphanumerics, underscores, periods, and hyphens.<br><br>Start with alphanumeric. End alphanumeric or underscore. |
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
> | namespaces | global | 6-50 | Alphanumerics and hyphens<br><br>Start and end with alphanumeric. |
> | namespaces / AuthorizationRules | namespace | 1-256 | Alphanumerics, periods, hyphens, and underscores.<br><br>Start alphanumeric. |
> | namespaces / notificationHubs | namespace | 1-260 | Alphanumerics, periods, hyphens, and underscores.<br><br>Start alphanumeric. |
> | namespaces / notificationHubs / AuthorizationRules | notification hub | 1-256 | Alphanumerics, periods, hyphens, and underscores.<br><br>Start alphanumeric. |

## Microsoft.OperationalInsights

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | clusters | resource group | 4-63 | Alphanumerics and hyphens.<br><br>Start and end with alphanumeric. |
> | workspaces | resource group | 4-63 | Alphanumerics and hyphens.<br><br>Start and end with alphanumeric. |

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
> | resourcegroups | subscription | 1-90 | Alphanumerics, underscores, parentheses, hyphens, periods, and unicode characters that match the [regex documentation](/rest/api/resources/resourcegroups/createorupdate).<br><br>Can't end with period. |
> | tagNames | resource | 1-512 | Can't use:<br>`<>%&\?/` |
> | tagNames / tagValues | tag name | 1-256 | All characters. |

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
> | managedInstances | global | 1-63 | Lowercase letters, numbers, and hyphens.<br><br>Can't start or end with hyphen. |
> | servers | global | 1-63 | Lowercase letters, numbers, and hyphens.<br><br>Can't start or end with hyphen. |
> | servers / databases | server | 1-128 | Can't use:<br>`<>*%&:\/?`<br><br>Can't end with period or space. |
> | servers / databases / syncGroups | database | 1-150 | Alphanumerics, hyphens, and underscores. |
> | servers / elasticPools | server | 1-128 | Can't use:<br>`<>*%&:\/?`<br><br>Can't end with period or space. |
> | servers / failoverGroups | global | 1-63 | Lowercase letters, numbers, and hyphens.<br><br>Can't start or end with hyphen. |
> | servers / firewallRules | server | 1-128 | Can't use:<br>`<>*%&:;\/?`<br><br>Can't end with period. |

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

## Microsoft.TimeSeriesInsights

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | environments | resource group | 1-90 | Can't use:<br>`'<>%&:\?/#` |
> | environments / accessPolicies | environment | 1-90 | Can't use:<br> `'<>%&:\?/#` |
> | environments / eventSources | environment | 1-90 | Can't use:<br>`'<>%&:\?/#` |
> | environments / referenceDataSets | environment | 3-63 | Alphanumerics |

## Microsoft.Web

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | serverfarms | resource group | 1-40 | Alphanumerics and hyphens. |
> | sites | global | 2-60 | Contains alphanumerics and hyphens.<br><br>Can't start or end with hyphen. |
> | sites / slots | site | 2-59 | Alphanumerics and hyphens. |

## Next steps

For recommendations about how to name resources, see [Ready: Recommended naming and tagging conventions](/azure/cloud-adoption-framework/ready/azure-best-practices/naming-and-tagging).

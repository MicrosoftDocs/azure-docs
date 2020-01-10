---
title: Resource naming restrictions
description: Shows the rules and restrictions for naming Azure resources.
ms.topic: conceptual
ms.date: 01/10/2020
---

# Naming rules and restrictions for Azure resources

This article summarizes naming rules and restrictions for Azure resources.

In general, avoid using a special character, such as a hyphen (-) or underscore (_), as the first or last character in any name. These characters cause most validation rules to fail. Resource names are case-insensitive unless specifically noted in the valid characters column.

In the following tables, the term alphanumerics refers to the letters **a** through **z** (lowercase), **A** through **Z** (uppercase), and digits **0** through **9**.

For recommendations about how to name resources, see [Ready: Recommended naming and tagging conventions](/azure/cloud-adoption-framework/ready/azure-best-practices/naming-and-tagging).

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
> | service / apis | service | 1-256 | Can't contain these characters: `*#&+:<>?` |
> | service / apis / issues | api | 1-256 | Can't contain these characters: `*#&+:<>?` |
> | service / apis / issues / attachments | issue | 1-256 | Can't contain these characters: `*#&+:<>?` |
> | service / apis / issues / comments | issue | 1-256 | Can't contain these characters: `*#&+:<>?` |
> | service / apis / operations | api | 1-256 | Can't contain these characters: `*#&+:<>?` |
> | service / apis / operations / tags | operation | 1-256 | Can't contain these characters: `*#&+:<>?` |
> | service / apis / releases | api | 1-80 | Alphanumerics, underscores, and hyphens.<br><br>Start and end with alphanumeric or underscore. |
> | service / apis / schemas | api | 1-256 | Can't contain these characters: `*#&+:<>?` |
> | service / apis / tagDescriptions | api | 1-256 | Can't contain these characters: `*#&+:<>?` |
> | service / apis / tags | api | 1-256 | Can't contain these characters: `*#&+:<>?` |
> | service / api-version-sets | service | 1-256 | Can't contain these characters: `*#&+:<>?` |
> | service / authorizationServers | service | Not specified | Can't contain these characters: `*#&+:<>?` |
> | service / backends | service | 1-255 | Can't contain these characters: `*#&+:<>?` |
> | service / certificates | service | 1-256 | Can't contain these characters: `*#&+:<>?` |
> | service / diagnostics | service | 1-256 | Can't contain these characters: `*#&+:<>?` |
> | service / groups | service | 1-256 | Can't contain these characters: `*#&+:<>?` |
> | service / groups / users | group | 1-256 | Can't contain these characters: `*#&+:<>?` |
> | service / identityProviders | service |  | Can't contain these characters: `*#&+:<>?` |
> | service / loggers | service |  | Can't contain these characters: `*#&+:<>?` |
> | service / notifications | service | | Can't contain these characters: `*#&+:<>?` |
> | service / notifications / recipientEmails | notification |  | Can't contain these characters: `*#&+:<>?` |
> | service / openidConnectProviders | service |  | Can't contain these characters: `*#&+:<>?` |
> | service / policies | service |  | Can't contain these characters: `*#&+:<>?` |
> | service / products | service | 1-256 | Can't contain these characters: `*#&+:<>?` |
> | service / products / apis | product | 1-256 | Can't contain these characters: `*#&+:<>?` |
> | service / products / groups | product | 1-256 | Can't contain these characters: `*#&+:<>?` |
> | service / products / tags | product | 1-256 | Can't contain these characters: `*#&+:<>?` |
> | service / properties | service | | Can't contain these characters: `*#&+:<>?` |
> | service / subscriptions | service | 1-256 | Can't contain these characters: `*#&+:<>?` |
> | service / tags | service | 1-256 | Can't contain these characters: `*#&+:<>?` |
> | service / templates | service | | Can't contain these characters: `*#&+:<>?` |
> | service / users | service | 1-256 | Can't contain these characters: `*#&+:<>?` |

## Microsoft.AppConfiguration

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | configurationStores | resource group | 5-50 | Alphanumerics, underscores, and hyphens. |

## Microsoft.Authorization

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | locks | Scope of assignment | 1-90 | Alphanumerics, periods, underscores, hyphens, and parenthesis.<br><br>Can't end in period. |
> | policyassignments | Scope of assignment | 1-128 |  |
> | policydefinitions | Scope of definition | 1-128 |  |
> | policySetDefinitions | Scope of definition | 1-128 |  |

## Microsoft.Automation

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | automationAccounts | resource group | 6-50 | Alphanumerics and hyphens.<br><br>Start with letter, and end with alphanumeric. Contains . |
> | automationAccounts / certificates | Automation account | 1-128 | Can't contain these characters: `< > * % & : \ ? . + /` <br><br>Can't end with space.  |
> | automationAccounts / configurations | Automation account |  | Alphanumerics and underscores.<br><br>Start with letter. End with alphanumeric. |
> | automationAccounts / connections | Automation account | 1-128 | Can't contain these characters: `< > * % & : \ ? . + /` <br><br>Can't end with space. |
> | automationAccounts / credentials | Automation account | 1-128 | Can't contain these characters: `< > * % & : \ ? . + /` <br><br>Can't end with space. |
> | automationAccounts / runbooks | Automation account | 1-63 | Alphanumerics, underscores, and hyphens.<br><br>Start with letter.  |
> | automationAccounts / schedules | Automation account | 1-128 | Can't contain these characters: `< > * % & : \ ? . + /` <br><br>Can't end with space. |
> | automationAccounts / variables | Automation account | 1-128 | Can't contain these characters: `< > * % & : \ ? . + /` <br><br>Can't end with space. |
> | automationAccounts / watchers | Automation account | 1-63 |  Alphanumerics, underscores, and hyphens.<br><br>Start with letter. |
> | automationAccounts / webhooks | Automation account | 1-128 | Can't contain these characters: `< > * % & : \ ? . + /` <br><br>Can't end with space. |

## Microsoft.Batch

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | batchAccounts | Region | 3-24 | Lowercase letters and numbers. |
> | batchAccounts / applications | Batch account | 1-64 | Alphanumerics, underscores, and hyphens. |
> | batchAccounts / certificates | Batch account | 5-45 | Alphanumerics, underscores, and hyphens. |
> | batchAccounts / pools | Batch account | 1-64 | Alphanumerics, underscores, and hyphens. |

## Microsoft.Blockchain

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | blockchainMembers | Global | 2-20 | Lowercase letters and numbers.<br><br>Start with lowercase letter. |

## Microsoft.BotService

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | botServices | Global | 2-64 | Start with alphanumeric character. Contains alphanumerics, underscores, periods, and hyphens. |
> | botServices / channels | Bot service |  | Start with alphanumeric character. Contains alphanumerics, underscores, periods, and hyphens. |
> | botServices / Connections | Bot service | 2-64 | Start with alphanumeric character. Contains alphanumerics, underscores, periods, and hyphens. |
> | enterpriseChannels | resource group | 2-64 | Start with alphanumeric character. Contains alphanumerics, underscores, periods, and hyphens. |

## Microsoft.Cache

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | Redis | Global | 1-63 | Start and end with alphanumeric. Contains alphanumeric and hyphens. Consecutive hyphens not allowed. |
> | Redis / firewallRules | Redis | Not specified |  |
> | Redis / linkedServers | Redis | Not specified |  |
> | Redis / patchSchedules | Redis | Not specified |  |

## Microsoft.Cdn

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | profiles | resource group | 1-260 | Start and end with alphanumeric. Contains alphanumeric and hyphens. |
> | profiles / endpoints | Global | 1-50 | Start and end with alphanumeric. Contains alphanumeric and hyphens. |

## Microsoft.CertificateRegistration

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | certificateOrders | resource group | 3-30 | Contains alphanumeric characters. |

## Microsoft.CognitiveServices

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | accounts | resource group | 2-64 | Start and end with alphanumeric character. Contains alphanumeric characters and hyphens. |

## Microsoft.Compute

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | availabilitySets | resource group | 1-80 | Alphanumerics, underscores, periods, and hyphens.<br><br>Start with alphanumeric, and end with alphanumeric or underscore. |
> | diskEncryptionSets | resource group | 1-80 | Alphanumerics and underscores. |
> | disks | resource group | 1-80 | Alphanumerics and underscores. |
> | galleries | 1-80 | Not specified | Alphanumerics and periods.<br><br>Start and end with alphanumeric. |
> | galleries / applications | Gallery | 1-80 | Start and end with alphanumeric. Contains alphanumeric, hyphens, and periods. |
> | galleries / applications/versions | Application | 32-bit integer | Numbers and periods. |
> | galleries / images | Gallery | 1-80 | Start and end with alphanumeric. Contains alphanumeric, hyphens, and periods. |
> | galleries / images / versions | Image | 32-bit integer | Numbers and periods. |
> | images | resource group | 1-80 | Start with alphanumeric, and end with alphanumeric or underscore. Contains alphanumerics, underscores, periods, and hyphens. |
> | snapshots | resource group | 1-80 | Start with alphanumeric, and end with alphanumeric or underscore. Contains alphanumerics, underscores, periods, and hyphens. |
> | virtualMachines | resource group | 1-15 (Windows), 1-64 (Linux) | Can't begin with underscore. Can't end with period or hyphen. Can't contain these characters: `\/""[]:|<>+=;,?*@&` |
> | virtualMachineScaleSets | resource group | 1-15 (Windows), 1-64 (Linux) | Can't begin with underscore. Can't end with period or hyphen. Can't contain these characters: `\/""[]:|<>+=;,?*@&` |

## Microsoft.ContainerInstance

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | containerGroups | resource group | 1-63 | Can't start or end with hyphen. Contains lowercase letters, numbers, and hyphens. Consecutive hyphens aren't allowed. |

## Microsoft.ContainerRegistry

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | registries | Global | 5-50 | Contains alphanumeric characters. |
> | registries / buildTasks | Registry | 5-50 | Contains alphanumeric characters. |
> | registries / buildTasks/steps | Build task | 5-50 | Contains alphanumeric characters. |
> | registries / replications | Registry | 5-50 | Contains alphanumeric characters. |
> | registries / scopeMaps | Registry | 5-50 | Contains alphanumeric characters, hyphens, and underscores. |
> | registries / taskRuns | Registry |  |  |
> | registries / tasks | Registry | 5-50 | Contains alphanumeric characters, hyphens, and underscores. |
> | registries / tokens | Registry | 5-50 | Contains alphanumeric characters, hyphens, and underscores. |
> | registries / webhooks | Registry | 5-50 | Contains alphanumeric characters. |

## Microsoft.ContainerService

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | managedClusters | resource group | 1-63 | Start and end with alphanumeric. Contains alphanumerics, underscores, and hyphens. |
> | openShiftManagedClusters | resource group | 1-30 | Contains alphanumerics. |

## Microsoft.CustomerInsights

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | hubs | resource group | 1-64 | Start with letter. Contains alphanumeric characters. |
> | hubs / authorizationPolicies | Hub | 1-50 | Start and end with alphanumeric character. Contains alphanumeric characters, underscores, and periods. |
> | hubs / connectors | Hub | 1-128 | Start with letter. Contains alphanumeric characters and underscores. |
> | hubs / connectors/mappings | Connector | 1-128 | Start with letter. Contains alphanumeric characters and underscores. |
> | hubs / interactions | Hub | 1-128 | Start with letter. Contains alphanumeric characters and underscores. |
> | hubs / kpi | Hub | 1-512 | Start with letter. Contains alphanumeric characters and underscores. |
> | hubs / links | Hub | 1-512 | Start with letter. Contains alphanumeric characters and underscores. |
> | hubs / predictions | Hub | 1-512 |  |
> | hubs / profiles | Hub | 1-128 | Start with letter. Contains alphanumeric characters and underscores. |
> | hubs / relationshipLinks | Hub | 1-512 | Start with letter. Contains alphanumeric characters and underscores. |
> | hubs / relationships | Hub | 1-512 | Start with letter. Contains alphanumeric characters and underscores. |
> | hubs / roleAssignments | Hub | 1-128 | Start with letter. Contains alphanumeric characters and underscores. |
> | hubs / views | Hub | 1-512 |  |

## Microsoft.CustomProviders

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | associations | resource group |  |  |
> | resourceProviders | resource group | 3-64 |  |

## Microsoft.DataBox

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | jobs | resource group | 3-24 | Alphanumeric characters, hyphens, underscores and periods. |

## Microsoft.Databricks

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | workspaces | resource group | 3-30 | Alphanumeric characters, underscores, and hyphens |

## Microsoft.DataFactory

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | /factories | resource group | 3-63 | Must start with alphanumeric character<br>`^[A-Za-z0-9]+(?:-[A-Za-z0-9]+)*$` |
> | /factories / dataflows | factories | 1-260 | `^[A-Za-z0-9_][^<>*#.%&:\\+?/]*$` |
> | /factories / datasets | factories | 1-260 | `^[A-Za-z0-9_][^<>*#.%&:\\+?/]*$` |
> | /factories / integrationRuntimes | factories | 3-63 | Must start with alphanumeric character<br>`^[A-Za-z0-9]+(?:-[A-Za-z0-9]+)*$` |
> | /factories / linkedservices | factories | 1-260 | `^[A-Za-z0-9_][^<>*#.%&:\\+?/]*$` |
> | /factories / pipelines | factories | 1-260 | `^[A-Za-z0-9_][^<>*#.%&:\\+?/]*$` |
> | /factories / triggers | factories | 1-260 | `^[A-Za-z0-9_][^<>*#.%&:\\+?/]*$` |
> | /factories / triggers / rerunTriggers | triggers | 1-260 | `^[A-Za-z0-9_][^<>*#.%&:\\+?/]*$` |

## Microsoft.DataLakeAnalytics

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | /accounts | resource group | Not specified |  |
> | /accounts / computePolicies | accounts | Not specified |  |
> | /accounts / dataLakeStoreAccounts | accounts | Not specified |  |
> | /accounts / firewallRules | accounts | Not specified |  |
> | /accounts / storageAccounts | accounts | Not specified |  |

## Microsoft.DataLakeStore

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | /accounts | resource group | Not specified |  |
> | /accounts / firewallRules | accounts | Not specified |  |
> | /accounts / trustedIdProviders | accounts | Not specified |  |
> | /accounts / virtualNetworkRules | accounts | Not specified |  |

## Microsoft.DataMigration

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | /services | resource group | Not specified |  |
> | /services / projects | services | Not specified |  |
> | /services / projects / files | projects | Not specified |  |
> | /services / projects / tasks | projects | Not specified |  |
> | /services / serviceTasks | services | Not specified |  |

## Microsoft.DBforMariaDB

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | /servers | resource group | Not specified |  |
> | /servers / configurations | servers | Not specified |  |
> | /servers / databases | servers | Not specified |  |
> | /servers / firewallRules | servers | Not specified |  |
> | /servers / keys | servers | Not specified |  |
> | /servers / privateEndpointConnections | servers | Not specified |  |
> | /servers / securityAlertPolicies | servers | Not specified |  |
> | /servers / virtualNetworkRules | servers | Not specified |  |

## Microsoft.DBforMySQL

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | /servers | resource group | Not specified |  |
> | /servers / configurations | servers | Not specified |  |
> | /servers / databases | servers | Not specified |  |
> | /servers / firewallRules | servers | Not specified |  |
> | /servers / keys | servers | Not specified |  |
> | /servers / privateEndpointConnections | servers | Not specified |  |
> | /servers / securityAlertPolicies | servers | Not specified |  |
> | /servers / virtualNetworkRules | servers | Not specified |  |

## Microsoft.DBforPostgreSQL

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | /servers | resource group | Not specified |  |
> | /servers / configurations | servers | Not specified |  |
> | /servers / databases | servers | Not specified |  |
> | /servers / firewallRules | servers | Not specified |  |
> | /servers / keys | servers | Not specified |  |
> | /servers / privateEndpointConnections | servers | Not specified |  |
> | /servers / securityAlertPolicies | servers | Not specified |  |
> | /servers / virtualNetworkRules | servers | Not specified |  |

## Microsoft.DeploymentManager

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | /artifactSources | resource group | Not specified |  |
> | /rollouts | resource group | Not specified |  |
> | /serviceTopologies | resource group | Not specified |  |
> | /serviceTopologies / services | serviceTopologies | Not specified |  |
> | /serviceTopologies / services / serviceUnits | services | Not specified |  |
> | /steps | resource group | Not specified |  |

## Microsoft.Devices

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | /IotHubs | resource group | Not specified |  |
> | /IotHubs / certificates | IotHubs | 1-64 | `^[A-Za-z0-9-._]{1,64}$` |
> | /IotHubs / eventHubEndpoints / ConsumerGroups | eventHubEndpoints | Not specified |  |
> | /provisioningServices | resource group | Not specified |  |
> | /provisioningServices / certificates | provisioningServices | Not specified |  |

## Microsoft.DevTestLab

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | /labs | resource group | Not specified |  |
> | /labs / artifactsources | labs | Not specified |  |
> | /labs / costs | labs | Not specified |  |
> | /labs / customimages | labs | Not specified |  |
> | /labs / formulas | labs | Not specified |  |
> | /labs / notificationchannels | labs | Not specified |  |
> | /labs / policysets / policies | policysets | Not specified |  |
> | /labs / schedules | labs | Not specified |  |
> | /labs / servicerunners | labs | Not specified |  |
> | /labs / users | labs | Not specified |  |
> | /labs / users / disks | users | Not specified |  |
> | /labs / users / environments | users | Not specified |  |
> | /labs / users / secrets | users | Not specified |  |
> | /labs / users / servicefabrics | users | Not specified |  |
> | /labs / users / servicefabrics / schedules | servicefabrics | Not specified |  |
> | /labs / virtualmachines | labs | Not specified |  |
> | /labs / virtualmachines/schedules | virtualmachines | Not specified |  |
> | /labs / virtualnetworks | labs | Not specified |  |
> | /schedules | resource group | Not specified |  |

## Microsoft.DocumentDB

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | databaseAccounts | Global | 3-31 | Must start with lowercase letters or numbers. Can contain only lowercase letters, numbers and the '-' character. |
> | databaseAccounts / cassandraKeyspaces | Database account |  |  Must start with lowercase letters or numbers. Can contain only lowercase letters, numbers and the '-' character. |
> | databaseAccounts / cassandraKeyspaces / tables | Cassandra keyspace |  |  Must start with lowercase letters or numbers. Can contain only lowercase letters, numbers and the '-' character. |
> | databaseAccounts / gremlinDatabases | Database account |  |  Must start with lowercase letters or numbers. Can contain only lowercase letters, numbers and the '-' character. |
> | databaseAccounts / gremlinDatabases / graphs | Gremlin database |  |  Must start with lowercase letters or numbers. Can contain only lowercase letters, numbers and the '-' character. |
> | databaseAccounts / mongodbDatabases | Database account |  |  Must start with lowercase letters or numbers. Can contain only lowercase letters, numbers and the '-' character. |
> | databaseAccounts / mongodbDatabases / collections | Mongodb database |  |  Must start with lowercase letters or numbers. Can contain only lowercase letters, numbers and the '-' character. |
> | databaseAccounts / privateEndpointConnections | Database account |  |  Must start with lowercase letters or numbers. Can contain only lowercase letters, numbers and the '-' character. |
> | databaseAccounts / sqlDatabases | Database account |  |  Must start with lowercase letters or numbers. Can contain only lowercase letters, numbers and the '-' character. |
> | databaseAccounts / sqlDatabases / containers | SQL database |  |  Must start with lowercase letters or numbers. Can contain only lowercase letters, numbers and the '-' character. |
> | databaseAccounts / sqlDatabases / containers / storedProcedures | Container |  |  Must start with lowercase letters or numbers. Can contain only lowercase letters, numbers and the '-' character. |
> | databaseAccounts / sqlDatabases / containers / triggers | Container |  |  Must start with lowercase letters or numbers. Can contain only lowercase letters, numbers and the '-' character. |
> | databaseAccounts / sqlDatabases / containers / userDefinedFunctions | Container |  |  Must start with lowercase letters or numbers. Can contain only lowercase letters, numbers and the '-' character. |
> | databaseAccounts / tables | Database account |  |  Must start with lowercase letters or numbers. Can contain only lowercase letters, numbers and the '-' character. |

## Microsoft.EventGrid

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | domains | resource group | 3-50 | Can only contain letters, numbers, and dashes. |
> | domains / topics | Domain | 3-50 | Can only contain letters, numbers, and dashes. |
> | eventSubscriptions | resource group | 3-64 | Can only contain letters, numbers, and dashes. |
> | topics | resource group | 3-50 | Can only contain letters, numbers, and dashes. |

## Microsoft.EventHub

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | clusters | resource group | 6-50 | Can contain only letters, numbers and hyphens. The cluster name must start with a letter, and it must end with a letter or number. |
> | namespaces | Global | 6-50 | Can contain only letters, numbers, and hyphens. The namespace must start with a letter, and it must end with a letter or number. |
> | namespaces / AuthorizationRules | Namespace | 1-50 | Can contain only letters, numbers, periods, hyphens and underscores. The name must start and end with a letter or number. |
> | namespaces / disasterRecoveryConfigs | Namespace | 1-50 | Can contain only letters, numbers, periods, hyphens and underscores. The name must start and end with a letter or number. |
> | namespaces / eventhubs | Namespace | 1-50 | Can contain only letters, numbers, periods, hyphens and underscores. The name must start and end with a letter or number. |
> | namespaces / eventhubs / authorizationRules | Event Hub | 1-50 | Can contain only letters, numbers, periods, hyphens and underscores. The name must start and end with a letter or number. |
> | namespaces / eventhubs / consumergroups | Event Hub | 1-50 | Can contain only letters, numbers, periods, hyphens and underscores. The name must start and end with a letter or number. |

## Microsoft.HDInsight

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | clusters | Global | 3-59 | Can contain letters, numbers, and hyphens (but the first and last character must be a letter or number). |
> | clusters / applications | Cluster |  |  |
> | clusters / extensions | Cluster |  |  |

## Microsoft.ImportExport

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | jobs | resource group | 2-64 | Must start with a letter, and contain only letters, numbers, and hyphens. |

## microsoft.insights

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | /actionGroups | resource group | Not specified |  |
> | /activityLogAlerts | resource group | Not specified |  |
> | /alertrules | resource group | Not specified |  |
> | /autoscalesettings | resource group | Not specified |  |
> | /components | resource group | Not specified |  |
> | /components / exportconfiguration | Component | Not specified |  |
> | /components / favorites | Component | Not specified |  |
> | /components / ProactiveDetectionConfigs | Component | Not specified |  |
> | /diagnosticSettings | resource group | Not specified |  |
> | /guestDiagnosticSettings | resource group | Not specified |  |
> | /guestDiagnosticSettingsAssociation | resource group | Not specified |  |
> | /logprofiles | resource group | Not specified |  |
> | /metricAlerts | resource group | Not specified |  |
> | /queryPacks | resource group | Not specified |  |
> | /queryPacks / queries | Query pack | Not specified |  |
> | /scheduledQueryRules | resource group | Not specified |  |
> | /webtests | resource group | Not specified |  |
> | /workbooks | resource group | Not specified |  |
> | /workbooktemplates | resource group | Not specified |  |

## Microsoft.IoTCentral

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | IoTApps | Global | 2-63 | Must start with lowercase letter or number, and contain only lowercase letters, numbers and dashes. |

## Microsoft.KeyVault

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | vaults | Global | 3-24 | Can contain alphanumeric characters and dashes. Must begin with a letter, end with a letter or digit, and not contain consecutive hyphens. |
> | vaults / secrets | Vault | 1-127 | Can only contain alphanumeric characters and dashes. |

## Microsoft.Kusto

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | clusters | Global | 4-22 | Start with a letter. Contains lowercase letters and numbers. |
> | /clusters / attachedDatabaseConfigurations | Cluster | Not specified |  |
> | /clusters / databases | Cluster | Not specified |  |
> | /clusters / databases / dataConnections | Database | Not specified |  |
> | /clusters / databases / eventhubconnections | Database | Not specified |  |

## Microsoft.Logic

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | integrationAccounts | resource group | 1-80 | Can contain letters, numbers, and these characters: -()._ |
> | integrationAccounts / agreements | Integration account | Not specified |  |
> | integrationAccounts / assemblies | Integration account | 1-80 | Can contain letters, numbers, and these characters: -()._ |
> | integrationAccounts / batchConfigurations | Integration account | 1-20 | Can only contain letters and numbers. |
> | integrationAccounts / certificates | Integration account | 1-80 | Can contain letters, numbers, and these characters: -()._ |
> | integrationAccounts / maps | Integration account | 1-80 | Can contain letters, numbers, and these characters: -()._ |
> | integrationAccounts / partners | Integration account | 1-80 | Can contain letters, numbers, and these characters: -()._ |
> | integrationAccounts / rosettanetprocessconfigurations | Integration account | 1-80 | Can contain letters, numbers, and these characters: -()._ |
> | integrationAccounts / schemas | Integration account | 1-80 |  Can contain letters, numbers, and these characters: -()._ |
> | integrationAccounts / sessions | Integration account | 1-80 | Can contain letters, numbers, and these characters: -()._ |
> | integrationServiceEnvironments | resource group | 1-80 | Can contain letters, numbers, and these characters: -._ |
> | integrationServiceEnvironments / managedApis | Integration service environment | 1-80 | Can contain letters, numbers, and these characters: -._ |
> | workflows | resource group | 1-80 | Can contain letters, numbers, and these characters: -()._ |

## Microsoft.MachineLearning

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | commitmentPlans | resource group | 1-260 | Can't end in a space, and can't include these characters: <>*%&:?+/ and \\ |
> | webServices | resource group | 1-260 | Can't end in a space, and can't include these characters: <>*%&:?+/ and \\ |
> | workspaces | resource group | 1-260 | Can't end in a space, and can't include these characters: <>*%&:?+/ and \\ |

## Microsoft.MachineLearningServices

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | workspaces | resource group | 3-33 | Only alphanumeric characters and '-' |
> | workspaces / computes | Workspace | 2-16 | Only alphanumeric characters and '-' |

## Microsoft.ManagedIdentity

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | userAssignedIdentities | resource group | 3-128 | Begin with letter or number, and contain lower and upper case letter, numbers, dash and underscore |

## Microsoft.Maps

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | accounts | resource group | 1-98 (for resource group name and account name) | Begin with alphanumeric. and contain only alphanumeric, underscore (_), period (.), or hyphen (-). |

## Microsoft.Media

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | mediaservices | resource group | 3-24 | Only lower case letters and numbers |
> | mediaServices / accountFilters | Media service | |  |
> | mediaServices / assets | Media service |  |  |
> | mediaServices / assets / assetFilters | Asset |  |  |
> | mediaServices / contentKeyPolicies | Media service |  |  |
> | mediaservices / liveEvents | Media service | 1-32 |  Must start with alphanumeric character and contain only alphanumeric characters and dashes |
> | mediaservices / liveEvents / liveOutputs | Live event | 1-256 | Must start with alphanumeric character and contain only alphanumeric characters and dashes |
> | mediaServices / mediaGraphs | Media service |  |  |
> | mediaservices / streamingEndpoints | Media service | 1-24 | Must start with alphanumeric character and contain only alphanumeric characters and dashes |
> | mediaServices / streamingLocators | Media service |  |  |
> | mediaServices / streamingPolicies | Media service |  |  |
> | mediaServices / transforms | Media service |  |  |
> | mediaServices / transforms / jobs | Transform |  |  |

## Microsoft.Migrate

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | assessmentProjects | resource group |  |  |
> | assessmentProjects / groups | Assessment project |  |  |
> | assessmentProjects / groups / assessments | Group |  |  |
> | assessmentProjects / hypervcollectors | Assessment project |  |  |
> | assessmentProjects / vmwarecollectors | Assessment project |  |  |
> | projects | resource group |  |  |
> | projects/groups | Project |  |  |
> | projects/groups/assessments | Group |  |  |

## Microsoft.NetApp

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | netAppAccounts | resource group |  |  |
> | netAppAccounts / capacityPools | NetApp account |  |  |
> | netAppAccounts / capacityPools / volumes | Capacity pool |  |  |
> | netAppAccounts / capacityPools / volumes / snapshots | Volume |  |  |

## Microsoft.Network

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | /applicationGateways | resource group | Not specified |  |
> | /ApplicationGatewayWebApplicationFirewallPolicies | resource group | Not specified |  |
> | /applicationSecurityGroups | resource group | Not specified |  |
> | /azureFirewalls | resource group | Not specified |  |
> | /bastionHosts | resource group | Not specified |  |
> | /connections | resource group | Not specified |  |
> | /ddosCustomPolicies | resource group | Not specified |  |
> | /ddosProtectionPlans | resource group | Not specified |  |
> | /dnsZones | resource group | Not specified |  |
> | /dnsZones/ | dnsZones | Not specified |  |
> | /expressRouteCircuits | resource group | Not specified |  |
> | /expressRouteCircuits / authorizations | expressRouteCircuits | Not specified |  |
> | /expressRouteCircuits / peerings | expressRouteCircuits | Not specified |  |
> | /expressRouteCircuits / peerings / connections | peerings | Not specified |  |
> | /expressRouteCrossConnections | resource group | Not specified |  |
> | /expressRouteCrossConnections / peerings | expressRouteCrossConnections | Not specified |  |
> | /expressRouteGateways | resource group | Not specified |  |
> | /expressRouteGateways / expressRouteConnections | expressRouteGateways | Not specified |  |
> | /ExpressRoutePorts | resource group | Not specified |  |
> | /firewallPolicies | resource group | Not specified |  |
> | /firewallPolicies / ruleGroups | firewallPolicies | Not specified |  |
> | /frontDoors | resource group | 5-64 | Must start with alphanumeric character<br>`^[a-zA-Z0-9]+([-a-zA-Z0-9]?[a-zA-Z0-9])*$` |
> | /FrontDoorWebApplicationFirewallPolicies | resource group | Not specified | Must contain only alphanumeric characters<br>`^[a-zA-Z0-9]*$` |
> | /interfaceEndpoints | resource group | Not specified |  |
> | /ipGroups | resource group | Not specified |  |
> | /loadBalancers | resource group | Not specified |  |
> | /loadBalancers / inboundNatRules | loadBalancers | Not specified |  |
> | /localNetworkGateways | resource group | Not specified |  |
> | /natGateways | resource group | Not specified |  |
> | /NetworkExperimentProfiles | resource group | Not specified | `^[a-zA-Z0-9_\-\(\)\.]*[^\.]$` |
> | /NetworkExperimentProfiles / Experiments | NetworkExperimentProfiles | Not specified | `^[a-zA-Z0-9_\-\(\)\.]*[^\.]$` |
> | /networkInterfaces | resource group | Not specified |  |
> | /networkInterfaces / tapConfigurations | networkInterfaces | Not specified |  |
> | /networkProfiles | resource group | Not specified |  |
> | /networkSecurityGroups | resource group | Not specified |  |
> | /networkSecurityGroups / securityRules | networkSecurityGroups | Not specified |  |
> | /networkWatchers | resource group | Not specified |  |
> | /networkWatchers / connectionMonitors | networkWatchers | Not specified |  |
> | /networkWatchers / packetCaptures | networkWatchers | Not specified |  |
> | /p2svpnGateways | resource group | Not specified |  |
> | /privateDnsZones | resource group | Not specified |  |
> | /privateDnsZones/ | privateDnsZones | Not specified |  |
> | /privateDnsZones / virtualNetworkLinks | privateDnsZones | Not specified |  |
> | /privateEndpoints | resource group | Not specified |  |
> | /privateLinkServices | resource group | Not specified |  |
> | /privateLinkServices / privateEndpointConnections | privateLinkServices | Not specified |  |
> | /publicIPAddresses | resource group | Not specified |  |
> | /publicIPPrefixes | resource group | Not specified |  |
> | /routeFilters | resource group | Not specified |  |
> | /routeFilters / routeFilterRules | routeFilters | Not specified |  |
> | /routeTables | resource group | Not specified |  |
> | /routeTables / routes | routeTables | Not specified |  |
> | /serviceEndpointPolicies | resource group | Not specified |  |
> | /serviceEndpointPolicies / serviceEndpointPolicyDefinitions | serviceEndpointPolicies | Not specified |  |
> | /trafficmanagerprofiles | resource group | Not specified |  |
> | /trafficmanagerprofiles/ | trafficmanagerprofiles | Not specified |  |
> | /virtualHubs | resource group | Not specified |  |
> | /virtualHubs / routeTables | virtualHubs | Not specified |  |
> | /virtualNetworkGateways | resource group | Not specified |  |
> | /virtualNetworks | resource group | Not specified |  |
> | /virtualnetworks / subnets | virtualnetworks | Not specified |  |
> | /virtualNetworks / virtualNetworkPeerings | virtualNetworks | Not specified |  |
> | /virtualNetworkTaps | resource group | Not specified |  |
> | /virtualRouters | resource group | Not specified |  |
> | /virtualRouters / peerings | virtualRouters | Not specified |  |
> | /virtualWans | resource group | Not specified |  |
> | /virtualWans / p2sVpnServerConfigurations | virtualWans | Not specified |  |
> | /vpnGateways | resource group | Not specified |  |
> | /vpnGateways / vpnConnections | vpnGateways | Not specified |  |
> | /vpnServerConfigurations | resource group | Not specified |  |
> | /vpnSites | resource group | Not specified |  |

## Microsoft.NotificationHubs

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | namespaces | Global | 6-50 | Must start and end with letter or number. | Must start and end with letter or number. Can only include letters, numbers, and hyphens. |
> | namespaces / AuthorizationRules | Namespace |  |  |
> | namespaces / notificationHubs | Namespace | 1-260 | Must start and end with letter or number. Can only include letters, numbers, periods, hyphens, and underscores. |
> | namespaces / notificationHubs / AuthorizationRules | Notification hub |  |  |

## Microsoft.OperationalInsights

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | /clusters | resource group | 4-63 | Must start with alphanumeric character<br>`^[A-Za-z0-9][A-Za-z0-9-]+[A-Za-z0-9]$` |
> | /workspaces | resource group | 4-63 | Must start with alphanumeric character<br>`^[A-Za-z0-9][A-Za-z0-9-]+[A-Za-z0-9]$` |
> | /workspaces / dataSources | workspaces | Not specified |  |
> | /workspaces / linkedServices | workspaces | Not specified |  |
> | /workspaces / savedSearches | workspaces | Not specified |  |
> | /workspaces / storageInsightConfigs | workspaces | Not specified |  |

## Microsoft.OperationsManagement

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | /ManagementConfigurations | resource group | Not specified | Must start with a lower case letter and contain only lower case letters or numbers<br>`^[a-z][a-z0-9]*$` |
> | /solutions | resource group | Not specified | Must start with a lower case letter and contain only lower case letters or numbers<br>`^[a-z][a-z0-9]*$` |

## Microsoft.Peering

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | /peerAsns | resource group | Not specified |  |
> | /peerings | resource group | Not specified |  |
> | /peeringServices | resource group | Not specified |  |
> | /peeringServices / prefixes | peeringServices | Not specified |  |

## Microsoft.PowerBI

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | /workspaceCollections | resource group | Not specified |  |

## Microsoft.PowerBIDedicated

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | /capacities | resource group | 3-63 | Must start with a lower case letter and contain only lower case letters or numbers<br>`^[a-z][a-z0-9]*$` |

## Microsoft.RecoveryServices

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | /vaults | resource group | Not specified |  |
> | /vaults / backupFabrics / backupProtectionIntent | backupFabrics | Not specified |  |
> | /vaults / backupFabrics / protectionContainers | backupFabrics | Not specified |  |
> | /vaults / backupFabrics / protectionContainers / protectedItems | protectionContainers | Not specified |  |
> | /vaults / backupPolicies | vaults | Not specified |  |
> | /vaults / certificates | vaults | Not specified |  |
> | /vaults / replicationAlertSettings | vaults | Not specified |  |
> | /vaults / replicationFabrics | vaults | Not specified |  |
> | /vaults / replicationFabrics / replicationNetworks / replicationNetworkMappings | replicationNetworks | Not specified |  |
> | /vaults / replicationFabrics /replicationProtectionContainers | replicationFabrics | Not specified |  |
> | /vaults / replicationFabrics / replicationProtectionContainers / replicationMigrationItems | replicationProtectionContainers | Not specified |  |
> | /vaults / replicationFabrics / replicationProtectionContainers / replicationProtectedItems | replicationProtectionContainers | Not specified |  |
> | /vaults / replicationFabrics / replicationProtectionContainers / replicationProtectionContainerMappings | replicationProtectionContainers | Not specified |  |
> | /vaults / replicationFabrics / replicationRecoveryServicesProviders | replicationFabrics | Not specified |  |
> | /vaults / replicationFabrics / replicationStorageClassifications / replicationStorageClassificationMappings | replicationStorageClassifications | Not specified |  |
> | /vaults / replicationFabrics / replicationvCenters | replicationFabrics | Not specified |  |
> | /vaults / replicationPolicies | vaults | Not specified |  |
> | /vaults / replicationRecoveryPlans | vaults | Not specified |  |
> | /vaults / replicationVaultSettings | vaults | Not specified |  |

## Microsoft.Relay

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | /namespaces | resource group | 6-50 |  |
> | /namespaces / AuthorizationRules | namespaces | 1-50 |  |
> | /namespaces / HybridConnections | namespaces | 1-50 |  |
> | /namespaces / HybridConnections/authorizationRules | HybridConnections | 1-50 |  |
> | /namespaces / WcfRelays | namespaces | 1-50 |  |
> | /namespaces / WcfRelays / authorizationRules | WcfRelays | 1-50 |  |

## Microsoft.Resources

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | /deployments | resource group | Not specified |  |
> | /deploymentScripts | resource group | 1-90 |  |

## Microsoft.Scheduler

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | /jobCollections | resource group | Not specified |  |
> | /jobCollections / jobs | jobCollections | Not specified |  |

## Microsoft.Search

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | /searchServices | resource group | Not specified |  |

## Microsoft.Security

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | /advancedThreatProtectionSettings | resource group | Not specified |  |
> | /assessmentMetadata | resource group | Not specified |  |
> | /automations | resource group | Not specified |  |
> | /autoProvisioningSettings | resource group | Not specified |  |
> | /deviceSecurityGroups | resource group | Not specified |  |
> | /informationProtectionPolicies | resource group | Not specified |  |
> | /iotSecuritySolutions | resource group | Not specified |  |
> | /locations / applicationWhitelistings | locations | Not specified |  |
> | /locations / jitNetworkAccessPolicies | locations | Not specified |  |
> | /pricings | resource group | Not specified |  |
> | /securityContacts | resource group | Not specified |  |
> | /settings | resource group | Not specified |  |
> | /workspaceSettings | resource group | Not specified |  |

## Microsoft.ServiceBus

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | /namespaces | resource group | Not specified |  |
> | /namespaces / AuthorizationRules | namespaces | 1-50 |  |
> | /namespaces / disasterRecoveryConfigs | namespaces | 1-50 |  |
> | /namespaces / ipfilterrules | namespaces | 1- |  |
> | /namespaces / migrationConfigurations | namespaces | Not specified |  |
> | /namespaces / queues | namespaces | 1-50 |  |
> | /namespaces / queues / authorizationRules | queues | 1-50 |  |
> | /namespaces / topics | namespaces | 1-50 |  |
> | /namespaces / topics / authorizationRules | topics | 1-50 |  |
> | /namespaces / topics / subscriptions | topics | 1-50 |  |
> | /namespaces / topics / subscriptions / rules | subscriptions | 1-50 |  |
> | /namespaces / virtualnetworkrules | namespaces | 1- |  |

## Microsoft.ServiceFabric

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | /clusters | resource group | Not specified |  |
> | /clusters / applications | clusters | Not specified |  |
> | /clusters / applications / services | applications | Not specified |  |
> | /clusters / applicationTypes | clusters | Not specified |  |
> | /clusters / applicationTypes / versions | applicationTypes | Not specified |  |

## Microsoft.ServiceFabricMesh

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | /applications | resource group | Not specified |  |
> | /gateways | resource group | Not specified |  |
> | /networks | resource group | Not specified |  |
> | /secrets | resource group | Not specified |  |
> | /secrets / values | secrets | Not specified |  |
> | /volumes | resource group | Not specified |  |

## Microsoft.SignalRService

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | /signalR | resource group | Not specified |  |

## Microsoft.Sql

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | /instancePools | resource group | Not specified |  |
> | /locations / instanceFailoverGroups | locations | Not specified |  |
> | /managedInstances | resource group | Not specified |  |
> | /managedInstances / administrators | managedInstances | Not specified |  |
> | /managedInstances / databases | managedInstances | Not specified |  |
> | /managedInstances / databases / backupShortTermRetentionPolicies | databases | Not specified |  |
> | /managedInstances / databases / schemas / tables / columns / sensitivityLabels | columns | Not specified |  |
> | /managedInstances / databases / securityAlertPolicies | databases | Not specified |  |
> | /managedInstances / databases / vulnerabilityAssessments | databases | Not specified |  |
> | /managedInstances / databases / vulnerabilityAssessments / rules / baselines | rules | Not specified |  |
> | /managedInstances / encryptionProtector | managedInstances | Not specified |  |
> | /managedInstances / keys | managedInstances | Not specified |  |
> | /managedInstances / restorableDroppedDatabases / backupShortTermRetentionPolicies | restorableDroppedDatabases | Not specified |  |
> | /managedInstances / securityAlertPolicies | managedInstances | Not specified |  |
> | /managedInstances / vulnerabilityAssessments | managedInstances | Not specified |  |
> | /servers | resource group | Not specified |  |
> | /servers / administrators | servers | Not specified |  |
> | /servers / advisors | servers | Not specified |  |
> | /servers / auditingPolicies | servers | Not specified |  |
> | /servers / auditingSettings | servers | Not specified |  |
> | /servers / backupLongTermRetentionVaults | servers | Not specified |  |
> | /servers / communicationLinks | servers | Not specified |  |
> | /servers / connectionPolicies | servers | Not specified |  |
> | /servers / databases | servers | Not specified |  |
> | /servers / databases / advisors | databases | Not specified |  |
> | /servers / databases / auditingPolicies | databases | Not specified |  |
> | /servers / databases / auditingSettings | databases | Not specified |  |
> | /servers / databases / backupLongTermRetentionPolicies | databases | Not specified |  |
> | /servers / databases / backupShortTermRetentionPolicies | databases | Not specified |  |
> | /servers / databases / connectionPolicies | databases | Not specified |  |
> | /servers / databases / dataMaskingPolicies | databases | Not specified |  |
> | /servers / databases / dataMaskingPolicies / rules | dataMaskingPolicies | Not specified |  |
> | /servers / databases / extendedAuditingSettings | databases | Not specified |  |
> | /servers / databases / extensions | databases | Not specified |  |
> | /servers / databases / geoBackupPolicies | databases | Not specified |  |
> | /servers / databases / schemas / tables / columns / sensitivityLabels | columns | Not specified |  |
> | /servers / databases / securityAlertPolicies | databases | Not specified |  |
> | /servers / databases / syncGroups | databases | Not specified |  |
> | /servers / databases / syncGroups / syncMembers | syncGroups | Not specified |  |
> | /servers / databases / transparentDataEncryption | databases | Not specified |  |
> | /servers / databases / vulnerabilityAssessments | databases | Not specified |  |
> | /servers / databases / vulnerabilityAssessments / rules / baselines | rules | Not specified |  |
> | /servers / databases / workloadGroups | databases | Not specified |  |
> | /servers / databases / workloadGroups / workloadClassifiers | workloadGroups | Not specified |  |
> | /servers / disasterRecoveryConfiguration | servers | Not specified |  |
> | /servers / dnsAliases | servers | Not specified |  |
> | /servers / elasticPools | servers | Not specified |  |
> | /servers / encryptionProtector | servers | Not specified |  |
> | /servers / extendedAuditingSettings | servers | Not specified |  |
> | /servers / failoverGroups | servers | Not specified |  |
> | /servers / firewallRules | servers | Not specified |  |
> | /servers / jobAgents | servers | Not specified |  |
> | /servers / jobAgents / credentials | jobAgents | Not specified |  |
> | /servers / jobAgents / jobs | jobAgents | Not specified |  |
> | /servers / jobAgents / jobs / executions | jobs | Not specified |  |
> | /servers / jobAgents / jobs / steps | jobs | Not specified |  |
> | /servers / jobAgents / targetGroups | jobAgents | Not specified |  |
> | /servers / keys | servers | Not specified |  |
> | /servers / privateEndpointConnections | servers | Not specified |  |
> | /servers / securityAlertPolicies | servers | Not specified |  |
> | /servers / syncAgents | servers | Not specified |  |
> | /servers / virtualNetworkRules | servers | Not specified |  |
> | /servers / vulnerabilityAssessments | servers | Not specified |  |

## Microsoft.SqlVirtualMachine

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | /sqlVirtualMachineGroups | resource group | Not specified |  |
> | /sqlVirtualMachineGroups / availabilityGroupListeners | sqlVirtualMachineGroups | Not specified |  |
> | /sqlVirtualMachines | resource group | Not specified |  |

## Microsoft.Storage

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | /storageAccounts | resource group | 3-24 |  |
> | /storageAccounts / blobServices | storageAccounts | Not specified |  |
> | /storageAccounts / blobServices / default / containers | default | 3-63 |  |
> | /storageAccounts / blobServices / default / containers / immutabilityPolicies | containers | Not specified |  |
> | /storageAccounts / fileServices | storageAccounts | Not specified |  |
> | /storageAccounts / fileServices / default / shares | default | 3-63 |  |
> | /storageAccounts / managementPolicies | storageAccounts | Not specified |  |
> | /storageAccounts / privateEndpointConnections | storageAccounts | Not specified |  |

## Microsoft.StorageSync

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | /storageSyncServices | resource group | Not specified |  |
> | /storageSyncServices / registeredServers | storageSyncServices | Not specified |  |
> | /storageSyncServices / syncGroups | storageSyncServices | Not specified |  |
> | /storageSyncServices / syncGroups / cloudEndpoints | syncGroups | Not specified |  |
> | /storageSyncServices / syncGroups / serverEndpoints | syncGroups | Not specified |  |

## Microsoft.StorSimple

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | /managers | resource group | 2-50 |  |
> | /managers / accessControlRecords | managers | Not specified |  |
> | /managers / bandwidthSettings | managers | Not specified |  |
> | /managers / devices / backupPolicies | devices | Not specified |  |
> | /managers / devices / backupPolicies / schedules | backupPolicies | Not specified |  |
> | /managers / devices / volumeContainers | devices | Not specified |  |
> | /managers / devices / volumeContainers / volumes | volumeContainers | Not specified |  |
> | /managers / storageAccountCredentials | managers | Not specified |  |

## Microsoft.StreamAnalytics

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | streamingjobs | resource group | 3-63 | Contains only alphanumeric characters, hyphens, and underscores. |
> | streamingjobs / functions | Streaming job | 3-63 | Contains only alphanumeric characters, hyphens, and underscores. |
> | streamingjobs / inputs | Streaming job | 3-63 | Contains only alphanumeric characters, hyphens, and underscores. |
> | streamingjobs / outputs | Streaming job | 3-63 | Contains only alphanumeric characters, hyphens, and underscores. |
> | streamingjobs / transformations | Streaming job | 3-63 | Contains only alphanumeric characters, hyphens, and underscores. |

## Microsoft.TimeSeriesInsights

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | environments | resource group | 1-90 | Any characters except '<>%&:\?/# |
> | environments / accessPolicies | Environment | 1-90 | Any characters except '<>%&:\?/# |
> | environments / eventSources | Environment | 1-90 | Any characters except '<>%&:\?/# |
> | environments / referenceDataSets | Environment | 3-63 |  Alphanumeric characters |

## Microsoft.Web

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | /certificates | resource group | Not specified |  |
> | /connectionGateways | resource group | Not specified |  |
> | /connections | resource group | Not specified |  |
> | /csrs | resource group | Not specified |  |
> | /customApis | resource group | Not specified |  |
> | /hostingEnvironments | resource group | Not specified |  |
> | /hostingEnvironments / workerPools | hostingEnvironments | Not specified |  |
> | /managedHostingEnvironments | resource group | Not specified |  |
> | /serverfarms | resource group | Not specified |  |
> | /serverfarms / virtualNetworkConnections / gateways | virtualNetworkConnections | Not specified |  |
> | /serverfarms / virtualNetworkConnections / routes | virtualNetworkConnections | Not specified |  |
> | /sites | Global | 1-60 | Contains alphanumerics and hyphens. |
> | /sites / config | sites | Not specified |  |
> | /sites / deployments | sites | Not specified |  |
> | /sites / domainOwnershipIdentifiers | sites | Not specified |  |
> | /sites / extensions | sites | Not specified |  |
> | /sites / functions | sites | Not specified |  |
> | /sites / functions / keys | functions | Not specified |  |
> | /sites / host / default/ | default | Not specified |  |
> | /sites / hostNameBindings | sites | Not specified |  |
> | /sites / hybridconnection | sites | Not specified |  |
> | /sites / hybridConnectionNamespaces / relays | hybridConnectionNamespaces | Not specified |  |
> | /sites / instances / deployments | instances | Not specified |  |
> | /sites / instances / extensions | instances | Not specified |  |
> | /sites / premieraddons | sites | Not specified |  |
> | /sites / publicCertificates | sites | Not specified |  |
> | /sites / siteextensions | sites | Not specified |  |
> | /sites / slots | Site | 2-59 | Contains alphanumerics and hyphens. |
> | /sites / slots / config | slots | Not specified |  |
> | /sites / slots / deployments | slots | Not specified |  |
> | /sites / slots / domainOwnershipIdentifiers | slots | Not specified |  |
> | /sites / slots / extensions | slots | Not specified |  |
> | /sites / slots / functions | slots | Not specified |  |
> | /sites / slots / functions / keys | functions | Not specified |  |
> | /sites / slots / host / default/ | default | Not specified |  |
> | /sites / slots /hostNameBindings | slots | Not specified |  |
> | /sites / slots /hybridconnection | slots | Not specified |  |
> | /sites / slots / hybridConnectionNamespaces / relays | hybridConnectionNamespaces | Not specified |  |
> | /sites / slots / instances / deployments | instances | Not specified |  |
> | /sites / slots / instances / extensions | instances | Not specified |  |
> | /sites / slots / premieraddons | slots | Not specified |  |
> | /sites / slots / publicCertificates | slots | Not specified |  |
> | /sites / slots / siteextensions | slots | Not specified |  |
> | /sites / slots / virtualNetworkConnections | slots | Not specified |  |
> | /sites / slots / virtualNetworkConnections / gateways | virtualNetworkConnections | Not specified |  |
> | /sites / virtualNetworkConnections | sites | Not specified |  |
> | /sites / virtualNetworkConnections / gateways | virtualNetworkConnections | Not specified |  |
> | /sourcecontrols | resource group | Not specified |  |

## providers

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | providers/Microsoft.Authorization/locks | Microsoft.Authorization | Not specified |  |
> | providers/Microsoft.OperationsManagement/ManagementAssociations | Microsoft.OperationsManagement | Not specified | Must start with a lower case letter and contain only lower case letters or numbers<br>`^[a-z][a-z0-9]*$` |
> | providers/Microsoft.Security/serverVulnerabilityAssessments | Microsoft.Security | Not specified |  |



> | /subscriptions/resourcegroups | subscriptions | 1-90 | `^[-\w\._\(\)]+$` |
> | /subscriptions/tagNames | subscriptions | Not specified |  |
> | /subscriptions/tagNames/tagValues | tagNames | Not specified |  |
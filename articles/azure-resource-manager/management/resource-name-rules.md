---
title: Resource naming restrictions
description: Shows the rules and restrictions for naming Azure resources.
ms.topic: conceptual
ms.date: 01/10/2020
---

# Naming rules and restrictions for Azure resources

This article summarizes naming rules and restrictions for Azure resources.

In general, avoid using a special character, such as a hyphen (-) or underscore (_), as the first or last character in any name. These characters cause most validation rules to fail. Resource names are case-insensitive unless specifically noted in the valid characters column.

For recommendations about how to name resources, see [Ready: Recommended naming and tagging conventions](/azure/cloud-adoption-framework/ready/azure-best-practices/naming-and-tagging).

## Microsoft.AnalysisServices

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | servers | Resource group | 3-63 | Lowercase letters and numbers.<br><br>Starts with lowercase letter. |

## Microsoft.ApiManagement

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | service | global | 1-50 | Alphanumerics.<br><br>Starts with letter. |
> | service / apis | service | 1-256 | Can't contain these characters: `*#&+:<>?` |
> | service / apis / issues | api | 1-256 | Can't contain these characters: `*#&+:<>?` |
> | service / apis / issues / attachments | issue | 1-256 | Can't contain these characters: `*#&+:<>?` |
> | service / apis / issues / comments | issue | 1-256 | Can't contain these characters: `*#&+:<>?` |
> | service / apis / operations | api | 1-256 | Can't contain these characters: `*#&+:<>?` |
> | service / apis / operations / tags | operation | 1-256 | Can't contain these characters: `*#&+:<>?` |
> | service / apis / releases | api | 1-80 | Alphanumerics, underscores, and hyphens.<br><br>Starts and ends with alphanumeric or underscore. |
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
> | configurationStores | Resource group | 5-50 | Alphanumerics, underscores, and hyphens. |

## Microsoft.Authorization

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | locks | Scope of assignment | 1-90 | Contains alphanumerics, periods, underscores, hyphens, and parenthesis. Can't end in period. |
> | policyassignments | Scope of assignment | 1-128 |  |
> | policydefinitions | Scope of definition | 1-128 |  |
> | policySetDefinitions | Scope of definition | 1-128 |  |

## Microsoft.Automation

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | automationAccounts | Resource group | 6-50 | Starts with letter, and ends with alphanumeric. Contains alphanumerics and hyphens. |
> | automationAccounts/certificates | Automation account | 1-128 | Can't end with space. Can't contain these characters: < > * % & : \ ? . + / |
> | automationAccounts/configurations | Automation account |  | Starts with letter, and ends with alphanumeric. Contains alphanumerics and underscores. |
> | automationAccounts/connections | Automation account | 1-128 | Can't end with space. Can't contain these characters: < > * % & : \ ? . + / |
> | automationAccounts/credentials | Automation account | 1-128 | Can't end with space. Can't contain these characters: < > * % & : \ ? . + / |
> | automationAccounts/runbooks | Automation account | 1-63 | Starts with letter. Contains alphanumerics, underscores, and hyphens. |
> | automationAccounts/schedules | Automation account | 1-128 | Can't end with space. Can't contain these characters: < > * % & : \ ? . + / |
> | automationAccounts/variables | Automation account | 1-128 | Can't end with space. Can't contain these characters: < > * % & : \ ? . + / |
> | automationAccounts/watchers | Automation account | 1-63 | Starts with letter. Contains alphanumerics, underscores, and hyphens. |
> | automationAccounts/webhooks | Automation account | 1-128 | Can't end with space. Can't contain these characters: < > * % & : \ ? . + / |

## Microsoft.Batch

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | batchAccounts | Region | 3-24 | Contains lowercase letters and numbers. |
> | batchAccounts/applications | Batch account | 1-64 | Contains alphanumerics, underscores, and hyphens. |
> | batchAccounts/certificates | Batch account | 5-45 | Contains alphanumerics, underscores, and hyphens. |
> | batchAccounts/pools | Batch account | 1-64 | Contains alphanumerics, underscores, and hyphens. |

## Microsoft.Blockchain

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | blockchainMembers | Global | 2-20 | Starts with lowercase letter. Contains lowercase letters and numbers. |

## Microsoft.BotService

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | botServices | Global | 2-64 | Starts with alphanumeric character. Contains alphanumerics, underscores, periods, and hyphens. |
> | botServices/channels | Bot service |  | Starts with alphanumeric character. Contains alphanumerics, underscores, periods, and hyphens. |
> | botServices/Connections | Bot service | 2-64 | Starts with alphanumeric character. Contains alphanumerics, underscores, periods, and hyphens. |
> | enterpriseChannels | Resource group | 2-64 | Starts with alphanumeric character. Contains alphanumerics, underscores, periods, and hyphens. |

## Microsoft.Cache

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | Redis | Global | 1-63 | Starts and ends with alphanumeric. Contains alphanumeric and hyphens. Consecutive hyphens not allowed. |
> | Redis/firewallRules | Redis | Not specified |  |
> | Redis/linkedServers | Redis | Not specified |  |
> | Redis/patchSchedules | Redis | Not specified |  |

## Microsoft.Cdn

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | profiles | Resource group | 1-260 | Starts and ends with alphanumeric. Contains alphanumeric and hyphens. |
> | profiles/endpoints | Global | 1-50 | Starts and ends with alphanumeric. Contains alphanumeric and hyphens. |

## Microsoft.CertificateRegistration

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | certificateOrders | Resource group | 3-30 | Contains alphanumeric characters. |

## Microsoft.CognitiveServices

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | accounts | Resource group | 2-64 | Starts and ends with alphanumeric character. Contains alphanumeric characters and hyphens. |

## Microsoft.Compute

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | availabilitySets | Resource group | 1-80 | Alphanumerics, underscores, periods, and hyphens.<br><br>Starts with alphanumeric, and ends with alphanumeric or underscore. |
> | diskEncryptionSets | Resource group | 1-80 | Alphanumerics and underscores. |
> | disks | Resource group | 1-80 | Alphanumerics and underscores. |
> | galleries | 1-80 | Not specified | Alphanumerics and periods.<br><br>Starts and ends with alphanumeric. |
> | galleries/applications | Gallery | 1-80 | Starts and ends with alphanumeric. Contains alphanumeric, hyphens, and periods. |
> | galleries/applications/versions | Application | 32-bit integer | Numbers and periods. |
> | galleries/images | Gallery | 1-80 | Starts and ends with alphanumeric. Contains alphanumeric, hyphens, and periods. |
> | galleries/images/versions | Image | 32-bit integer | Numbers and periods. |
> | images | Resource group | 1-80 | Starts with alphanumeric, and ends with alphanumeric or underscore. Contains alphanumerics, underscores, periods, and hyphens. |
> | snapshots | Resource group | 1-80 | Starts with alphanumeric, and ends with alphanumeric or underscore. Contains alphanumerics, underscores, periods, and hyphens. |
> | virtualMachines | Resource group | 1-15 (Windows), 1-64 (Linux) | Can't begin with underscore. Can't end with period or hyphen. Can't contain these characters: `\/""[]:|<>+=;,?*@&` |
> | virtualMachineScaleSets | Resource group | 1-15 (Windows), 1-64 (Linux) | Can't begin with underscore. Can't end with period or hyphen. Can't contain these characters: `\/""[]:|<>+=;,?*@&` |

## Microsoft.ContainerInstance

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | containerGroups | Resource group | 1-63 | Can't start or end with hyphen. Contains lowercase letters, numbers, and hyphens. Consecutive hyphens aren't allowed. |

## Microsoft.ContainerRegistry

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | registries | Global | 5-50 | Contains alphanumeric characters. |
> | registries/buildTasks | Registry | 5-50 | Contains alphanumeric characters. |
> | registries/buildTasks/steps | Build task | 5-50 | Contains alphanumeric characters. |
> | registries/replications | Registry | 5-50 | Contains alphanumeric characters. |
> | registries/scopeMaps | Registry | 5-50 | Contains alphanumeric characters, hyphens, and underscores. |
> | registries/taskRuns | Registry |  |  |
> | registries/tasks | Registry | 5-50 | Contains alphanumeric characters, hyphens, and underscores. |
> | registries/tokens | Registry | 5-50 | Contains alphanumeric characters, hyphens, and underscores. |
> | registries/webhooks | Registry | 5-50 | Contains alphanumeric characters. |

## Microsoft.ContainerService

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | managedClusters | Resource group | 1-63 | Starts and ends with alphanumeric. Contains alphanumerics, underscores, and hyphens. |
> | openShiftManagedClusters | Resource group | 1-30 | Contains alphanumerics. |

## Microsoft.CustomerInsights

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | hubs | Resource group | 1-64 | Starts with letter. Contains alphanumeric characters. |
> | hubs/authorizationPolicies | Hub | 1-50 | Starts and ends with alphanumeric character. Contains alphanumeric characters, underscores, and periods. |
> | hubs/connectors | Hub | 1-128 | Starts with letter. Contains alphanumeric characters and underscores. |
> | hubs/connectors/mappings | Connector | 1-128 | Starts with letter. Contains alphanumeric characters and underscores. |
> | hubs/interactions | Hub | 1-128 | Starts with letter. Contains alphanumeric characters and underscores. |
> | hubs/kpi | Hub | 1-512 | Starts with letter. Contains alphanumeric characters and underscores. |
> | hubs/links | Hub | 1-512 | Starts with letter. Contains alphanumeric characters and underscores. |
> | hubs/predictions | Hub | 1-512 |  |
> | hubs/profiles | Hub | 1-128 | Starts with letter. Contains alphanumeric characters and underscores. |
> | hubs/relationshipLinks | Hub | 1-512 | Starts with letter. Contains alphanumeric characters and underscores. |
> | hubs/relationships | Hub | 1-512 | Starts with letter. Contains alphanumeric characters and underscores. |
> | hubs/roleAssignments | Hub | 1-128 | Starts with letter. Contains alphanumeric characters and underscores. |
> | hubs/views | Hub | 1-512 |  |

## Microsoft.CustomProviders

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | associations | Resource group |  |  |
> | resourceProviders | Resource group | 3-64 |  |

## Microsoft.DataBox

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | jobs | Resource group | 3-24 | Alphanumeric characters, hyphens, underscores and periods. |

## Microsoft.Databricks

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | workspaces | Resource group | 3-30 | Alphanumeric characters, underscores, and hyphens |

## Microsoft.DataFactory

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | /factories | Resource group | 3-63 | Must start with alphanumeric character<br>`^[A-Za-z0-9]+(?:-[A-Za-z0-9]+)*$` |
> | /factories/dataflows | factories | 1-260 | `^[A-Za-z0-9_][^<>*#.%&:\\+?/]*$` |
> | /factories/datasets | factories | 1-260 | `^[A-Za-z0-9_][^<>*#.%&:\\+?/]*$` |
> | /factories/integrationRuntimes | factories | 3-63 | Must start with alphanumeric character<br>`^[A-Za-z0-9]+(?:-[A-Za-z0-9]+)*$` |
> | /factories/linkedservices | factories | 1-260 | `^[A-Za-z0-9_][^<>*#.%&:\\+?/]*$` |
> | /factories/pipelines | factories | 1-260 | `^[A-Za-z0-9_][^<>*#.%&:\\+?/]*$` |
> | /factories/triggers | factories | 1-260 | `^[A-Za-z0-9_][^<>*#.%&:\\+?/]*$` |
> | /factories/triggers/rerunTriggers | triggers | 1-260 | `^[A-Za-z0-9_][^<>*#.%&:\\+?/]*$` |

## Microsoft.DataLakeAnalytics

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | /accounts | Resource group | Not specified |  |
> | /accounts/computePolicies | accounts | Not specified |  |
> | /accounts/dataLakeStoreAccounts | accounts | Not specified |  |
> | /accounts/firewallRules | accounts | Not specified |  |
> | /accounts/storageAccounts | accounts | Not specified |  |

## Microsoft.DataLakeStore

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | /accounts | Resource group | Not specified |  |
> | /accounts/firewallRules | accounts | Not specified |  |
> | /accounts/trustedIdProviders | accounts | Not specified |  |
> | /accounts/virtualNetworkRules | accounts | Not specified |  |

## Microsoft.DataMigration

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | /services | Resource group | Not specified |  |
> | /services/projects | services | Not specified |  |
> | /services/projects/files | projects | Not specified |  |
> | /services/projects/tasks | projects | Not specified |  |
> | /services/serviceTasks | services | Not specified |  |

## Microsoft.DBforMariaDB

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | /servers | Resource group | Not specified |  |
> | /servers/configurations | servers | Not specified |  |
> | /servers/databases | servers | Not specified |  |
> | /servers/firewallRules | servers | Not specified |  |
> | /servers/keys | servers | Not specified |  |
> | /servers/privateEndpointConnections | servers | Not specified |  |
> | /servers/securityAlertPolicies | servers | Not specified |  |
> | /servers/virtualNetworkRules | servers | Not specified |  |

## Microsoft.DBforMySQL

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | /servers | Resource group | Not specified |  |
> | /servers/configurations | servers | Not specified |  |
> | /servers/databases | servers | Not specified |  |
> | /servers/firewallRules | servers | Not specified |  |
> | /servers/keys | servers | Not specified |  |
> | /servers/privateEndpointConnections | servers | Not specified |  |
> | /servers/securityAlertPolicies | servers | Not specified |  |
> | /servers/virtualNetworkRules | servers | Not specified |  |

## Microsoft.DBforPostgreSQL

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | /servers | Resource group | Not specified |  |
> | /servers/configurations | servers | Not specified |  |
> | /servers/databases | servers | Not specified |  |
> | /servers/firewallRules | servers | Not specified |  |
> | /servers/keys | servers | Not specified |  |
> | /servers/privateEndpointConnections | servers | Not specified |  |
> | /servers/securityAlertPolicies | servers | Not specified |  |
> | /servers/virtualNetworkRules | servers | Not specified |  |

## Microsoft.DeploymentManager

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | /artifactSources | Resource group | Not specified |  |
> | /rollouts | Resource group | Not specified |  |
> | /serviceTopologies | Resource group | Not specified |  |
> | /serviceTopologies/services | serviceTopologies | Not specified |  |
> | /serviceTopologies/services/serviceUnits | services | Not specified |  |
> | /steps | Resource group | Not specified |  |

## Microsoft.Devices

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | /IotHubs | Resource group | Not specified |  |
> | /IotHubs/certificates | IotHubs | 1-64 | `^[A-Za-z0-9-._]{1,64}$` |
> | /IotHubs/eventHubEndpoints/ConsumerGroups | eventHubEndpoints | Not specified |  |
> | /provisioningServices | Resource group | Not specified |  |
> | /provisioningServices/certificates | provisioningServices | Not specified |  |

## Microsoft.DevTestLab

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | /labs | Resource group | Not specified |  |
> | /labs/artifactsources | labs | Not specified |  |
> | /labs/costs | labs | Not specified |  |
> | /labs/customimages | labs | Not specified |  |
> | /labs/formulas | labs | Not specified |  |
> | /labs/notificationchannels | labs | Not specified |  |
> | /labs/policysets/policies | policysets | Not specified |  |
> | /labs/schedules | labs | Not specified |  |
> | /labs/servicerunners | labs | Not specified |  |
> | /labs/users | labs | Not specified |  |
> | /labs/users/disks | users | Not specified |  |
> | /labs/users/environments | users | Not specified |  |
> | /labs/users/secrets | users | Not specified |  |
> | /labs/users/servicefabrics | users | Not specified |  |
> | /labs/users/servicefabrics/schedules | servicefabrics | Not specified |  |
> | /labs/virtualmachines | labs | Not specified |  |
> | /labs/virtualmachines/schedules | virtualmachines | Not specified |  |
> | /labs/virtualnetworks | labs | Not specified |  |
> | /schedules | Resource group | Not specified |  |

## Microsoft.DocumentDB

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | databaseAccounts | Global | 3-31 | Must start with lowercase letters or numbers. Can contain only lowercase letters, numbers and the '-' character. |
> | databaseAccounts/cassandraKeyspaces | Database account |  |  Must start with lowercase letters or numbers. Can contain only lowercase letters, numbers and the '-' character. |
> | databaseAccounts/cassandraKeyspaces/tables | Cassandra keyspace |  |  Must start with lowercase letters or numbers. Can contain only lowercase letters, numbers and the '-' character. |
> | databaseAccounts/gremlinDatabases | Database account |  |  Must start with lowercase letters or numbers. Can contain only lowercase letters, numbers and the '-' character. |
> | databaseAccounts/gremlinDatabases/graphs | Gremlin database |  |  Must start with lowercase letters or numbers. Can contain only lowercase letters, numbers and the '-' character. |
> | databaseAccounts/mongodbDatabases | Database account |  |  Must start with lowercase letters or numbers. Can contain only lowercase letters, numbers and the '-' character. |
> | databaseAccounts/mongodbDatabases/collections | Mongodb database |  |  Must start with lowercase letters or numbers. Can contain only lowercase letters, numbers and the '-' character. |
> | databaseAccounts/privateEndpointConnections | Database account |  |  Must start with lowercase letters or numbers. Can contain only lowercase letters, numbers and the '-' character. |
> | databaseAccounts/sqlDatabases | Database account |  |  Must start with lowercase letters or numbers. Can contain only lowercase letters, numbers and the '-' character. |
> | databaseAccounts/sqlDatabases/containers | SQL database |  |  Must start with lowercase letters or numbers. Can contain only lowercase letters, numbers and the '-' character. |
> | databaseAccounts/sqlDatabases/containers/storedProcedures | Container |  |  Must start with lowercase letters or numbers. Can contain only lowercase letters, numbers and the '-' character. |
> | databaseAccounts/sqlDatabases/containers/triggers | Container |  |  Must start with lowercase letters or numbers. Can contain only lowercase letters, numbers and the '-' character. |
> | databaseAccounts/sqlDatabases/containers/userDefinedFunctions | Container |  |  Must start with lowercase letters or numbers. Can contain only lowercase letters, numbers and the '-' character. |
> | databaseAccounts/tables | Database account |  |  Must start with lowercase letters or numbers. Can contain only lowercase letters, numbers and the '-' character. |

## Microsoft.EventGrid

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | domains | Resource group | 3-50 | Can only contain letters, numbers, and dashes. |
> | domains/topics | Domain | 3-50 | Can only contain letters, numbers, and dashes. |
> | eventSubscriptions | Resource group | 3-64 | Can only contain letters, numbers, and dashes. |
> | topics | Resource group | 3-50 | Can only contain letters, numbers, and dashes. |

## Microsoft.EventHub

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | clusters | Resource group | 6-50 | Can contain only letters, numbers and hyphens. The cluster name must start with a letter, and it must end with a letter or number. |
> | namespaces | Global | 6-50 | Can contain only letters, numbers, and hyphens. The namespace must start with a letter, and it must end with a letter or number. |
> | namespaces/AuthorizationRules | Namespace | 1-50 | Can contain only letters, numbers, periods, hyphens and underscores. The name must start and end with a letter or number. |
> | namespaces/disasterRecoveryConfigs | Namespace | 1-50 | Can contain only letters, numbers, periods, hyphens and underscores. The name must start and end with a letter or number. |
> | namespaces/eventhubs | Namespace | 1-50 | Can contain only letters, numbers, periods, hyphens and underscores. The name must start and end with a letter or number. |
> | namespaces/eventhubs/authorizationRules | Event Hub | 1-50 | Can contain only letters, numbers, periods, hyphens and underscores. The name must start and end with a letter or number. |
> | namespaces/eventhubs/consumergroups | Event Hub | 1-50 | Can contain only letters, numbers, periods, hyphens and underscores. The name must start and end with a letter or number. |

## Microsoft.HDInsight

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | clusters | Global | 3-59 | Can contain letters, numbers, and hyphens (but the first and last character must be a letter or number). |
> | clusters/applications | Cluster |  |  |
> | clusters/extensions | Cluster |  |  |

## Microsoft.ImportExport

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | jobs | Resource group | 2-64 | Must start with a letter, and contain only letters, numbers, and hyphens. |

## microsoft.insights

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | /actionGroups | Resource group | Not specified |  |
> | /activityLogAlerts | Resource group | Not specified |  |
> | /alertrules | Resource group | Not specified |  |
> | /autoscalesettings | Resource group | Not specified |  |
> | /components | Resource group | Not specified |  |
> | /components/exportconfiguration | Component | Not specified |  |
> | /components/favorites | Component | Not specified |  |
> | /components/ProactiveDetectionConfigs | Component | Not specified |  |
> | /diagnosticSettings | Resource group | Not specified |  |
> | /guestDiagnosticSettings | Resource group | Not specified |  |
> | /guestDiagnosticSettingsAssociation | Resource group | Not specified |  |
> | /logprofiles | Resource group | Not specified |  |
> | /metricAlerts | Resource group | Not specified |  |
> | /queryPacks | Resource group | Not specified |  |
> | /queryPacks/queries | Query pack | Not specified |  |
> | /scheduledQueryRules | Resource group | Not specified |  |
> | /webtests | Resource group | Not specified |  |
> | /workbooks | Resource group | Not specified |  |
> | /workbooktemplates | Resource group | Not specified |  |

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
> | vaults/secrets | Vault | 1-127 | Can only contain alphanumeric characters and dashes. |

## Microsoft.Kusto

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | clusters | Global | 4-22 | Starts with a letter. Contains lowercase letters and numbers. |
> | /clusters/attachedDatabaseConfigurations | Cluster | Not specified |  |
> | /clusters/databases | Cluster | Not specified |  |
> | /clusters/databases/dataConnections | Database | Not specified |  |
> | /clusters/databases/eventhubconnections | Database | Not specified |  |

## Microsoft.Logic

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | integrationAccounts | Resource group | 1-80 | Can contain letters, numbers, and these characters: -()._ |
> | integrationAccounts/agreements | Integration account | Not specified |  |
> | integrationAccounts/assemblies | Integration account | 1-80 | Can contain letters, numbers, and these characters: -()._ |
> | integrationAccounts/batchConfigurations | Integration account | 1-20 | Can only contain letters and numbers. |
> | integrationAccounts/certificates | Integration account | 1-80 | Can contain letters, numbers, and these characters: -()._ |
> | integrationAccounts/maps | Integration account | 1-80 | Can contain letters, numbers, and these characters: -()._ |
> | integrationAccounts/partners | Integration account | 1-80 | Can contain letters, numbers, and these characters: -()._ |
> | integrationAccounts/rosettanetprocessconfigurations | Integration account | 1-80 | Can contain letters, numbers, and these characters: -()._ |
> | integrationAccounts/schemas | Integration account | 1-80 |  Can contain letters, numbers, and these characters: -()._ |
> | integrationAccounts/sessions | Integration account | 1-80 | Can contain letters, numbers, and these characters: -()._ |
> | integrationServiceEnvironments | Resource group | 1-80 | Can contain letters, numbers, and these characters: -._ |
> | integrationServiceEnvironments/managedApis | Integration service environment | 1-80 | Can contain letters, numbers, and these characters: -._ |
> | workflows | Resource group | 1-80 | Can contain letters, numbers, and these characters: -()._ |

## Microsoft.MachineLearning

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | commitmentPlans | Resource group | 1-260 | Can't end in a space, and can't include these characters: <>*%&:?+/ and \\ |
> | webServices | Resource group | 1-260 | Can't end in a space, and can't include these characters: <>*%&:?+/ and \\ |
> | workspaces | Resource group | 1-260 | Can't end in a space, and can't include these characters: <>*%&:?+/ and \\ |

## Microsoft.MachineLearningServices

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | workspaces | Resource group | 3-33 | Only alphanumeric characters and '-' |
> | workspaces/computes | Workspace | 2-16 | Only alphanumeric characters and '-' |

## Microsoft.ManagedIdentity

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | userAssignedIdentities | Resource group | 3-128 | Begin with letter or number, and contain lower and upper case letter, numbers, dash and underscore |

## Microsoft.Maps

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | accounts | Resource group | 1-98 (for resource group name and account name) | Begin with alphanumeric. and contain only alphanumeric, underscore (_), period (.), or hyphen (-). |

## Microsoft.Media

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | mediaservices | Resource group | 3-24 | Only lower case letters and numbers |
> | mediaServices/accountFilters | Media service | |  |
> | mediaServices/assets | Media service |  |  |
> | mediaServices/assets/assetFilters | Asset |  |  |
> | mediaServices/contentKeyPolicies | Media service |  |  |
> | mediaservices/liveEvents | Media service | 1-32 |  Must start with alphanumeric character and contain only alphanumeric characters and dashes |
> | mediaservices/liveEvents/liveOutputs | Live event | 1-256 | Must start with alphanumeric character and contain only alphanumeric characters and dashes |
> | mediaServices/mediaGraphs | Media service |  |  |
> | mediaservices/streamingEndpoints | Media service | 1-24 | Must start with alphanumeric character and contain only alphanumeric characters and dashes |
> | mediaServices/streamingLocators | Media service |  |  |
> | mediaServices/streamingPolicies | Media service |  |  |
> | mediaServices/transforms | Media service |  |  |
> | mediaServices/transforms/jobs | Transform |  |  |

## Microsoft.Migrate

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | assessmentProjects | Resource group |  |  |
> | assessmentProjects/groups | Assessment project |  |  |
> | assessmentProjects/groups/assessments | Group |  |  |
> | assessmentProjects/hypervcollectors | Assessment project |  |  |
> | assessmentProjects/vmwarecollectors | Assessment project |  |  |
> | projects | Resource group |  |  |
> | projects/groups | Project |  |  |
> | projects/groups/assessments | Group |  |  |

## Microsoft.NetApp

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | netAppAccounts | Resource group |  |  |
> | netAppAccounts/capacityPools | NetApp account |  |  |
> | netAppAccounts/capacityPools/volumes | Capacity pool |  |  |
> | netAppAccounts/capacityPools/volumes/snapshots | Volume |  |  |

## Microsoft.Network

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | /applicationGateways | Resource group | Not specified |  |
> | /ApplicationGatewayWebApplicationFirewallPolicies | Resource group | Not specified |  |
> | /applicationSecurityGroups | Resource group | Not specified |  |
> | /azureFirewalls | Resource group | Not specified |  |
> | /bastionHosts | Resource group | Not specified |  |
> | /connections | Resource group | Not specified |  |
> | /ddosCustomPolicies | Resource group | Not specified |  |
> | /ddosProtectionPlans | Resource group | Not specified |  |
> | /dnsZones | Resource group | Not specified |  |
> | /dnsZones/ | dnsZones | Not specified |  |
> | /expressRouteCircuits | Resource group | Not specified |  |
> | /expressRouteCircuits/authorizations | expressRouteCircuits | Not specified |  |
> | /expressRouteCircuits/peerings | expressRouteCircuits | Not specified |  |
> | /expressRouteCircuits/peerings/connections | peerings | Not specified |  |
> | /expressRouteCrossConnections | Resource group | Not specified |  |
> | /expressRouteCrossConnections/peerings | expressRouteCrossConnections | Not specified |  |
> | /expressRouteGateways | Resource group | Not specified |  |
> | /expressRouteGateways/expressRouteConnections | expressRouteGateways | Not specified |  |
> | /ExpressRoutePorts | Resource group | Not specified |  |
> | /firewallPolicies | Resource group | Not specified |  |
> | /firewallPolicies/ruleGroups | firewallPolicies | Not specified |  |
> | /frontDoors | Resource group | 5-64 | Must start with alphanumeric character<br>`^[a-zA-Z0-9]+([-a-zA-Z0-9]?[a-zA-Z0-9])*$` |
> | /FrontDoorWebApplicationFirewallPolicies | Resource group | Not specified | Must contain only alphanumeric characters<br>`^[a-zA-Z0-9]*$` |
> | /interfaceEndpoints | Resource group | Not specified |  |
> | /ipGroups | Resource group | Not specified |  |
> | /loadBalancers | Resource group | Not specified |  |
> | /loadBalancers/inboundNatRules | loadBalancers | Not specified |  |
> | /localNetworkGateways | Resource group | Not specified |  |
> | /natGateways | Resource group | Not specified |  |
> | /NetworkExperimentProfiles | Resource group | Not specified | `^[a-zA-Z0-9_\-\(\)\.]*[^\.]$` |
> | /NetworkExperimentProfiles/Experiments | NetworkExperimentProfiles | Not specified | `^[a-zA-Z0-9_\-\(\)\.]*[^\.]$` |
> | /networkInterfaces | Resource group | Not specified |  |
> | /networkInterfaces/tapConfigurations | networkInterfaces | Not specified |  |
> | /networkProfiles | Resource group | Not specified |  |
> | /networkSecurityGroups | Resource group | Not specified |  |
> | /networkSecurityGroups/securityRules | networkSecurityGroups | Not specified |  |
> | /networkWatchers | Resource group | Not specified |  |
> | /networkWatchers/connectionMonitors | networkWatchers | Not specified |  |
> | /networkWatchers/packetCaptures | networkWatchers | Not specified |  |
> | /p2svpnGateways | Resource group | Not specified |  |
> | /privateDnsZones | Resource group | Not specified |  |
> | /privateDnsZones/ | privateDnsZones | Not specified |  |
> | /privateDnsZones/virtualNetworkLinks | privateDnsZones | Not specified |  |
> | /privateEndpoints | Resource group | Not specified |  |
> | /privateLinkServices | Resource group | Not specified |  |
> | /privateLinkServices/privateEndpointConnections | privateLinkServices | Not specified |  |
> | /publicIPAddresses | Resource group | Not specified |  |
> | /publicIPPrefixes | Resource group | Not specified |  |
> | /routeFilters | Resource group | Not specified |  |
> | /routeFilters/routeFilterRules | routeFilters | Not specified |  |
> | /routeTables | Resource group | Not specified |  |
> | /routeTables/routes | routeTables | Not specified |  |
> | /serviceEndpointPolicies | Resource group | Not specified |  |
> | /serviceEndpointPolicies/serviceEndpointPolicyDefinitions | serviceEndpointPolicies | Not specified |  |
> | /trafficmanagerprofiles | Resource group | Not specified |  |
> | /trafficmanagerprofiles/ | trafficmanagerprofiles | Not specified |  |
> | /virtualHubs | Resource group | Not specified |  |
> | /virtualHubs/routeTables | virtualHubs | Not specified |  |
> | /virtualNetworkGateways | Resource group | Not specified |  |
> | /virtualNetworks | Resource group | Not specified |  |
> | /virtualnetworks/subnets | virtualnetworks | Not specified |  |
> | /virtualNetworks/virtualNetworkPeerings | virtualNetworks | Not specified |  |
> | /virtualNetworkTaps | Resource group | Not specified |  |
> | /virtualRouters | Resource group | Not specified |  |
> | /virtualRouters/peerings | virtualRouters | Not specified |  |
> | /virtualWans | Resource group | Not specified |  |
> | /virtualWans/p2sVpnServerConfigurations | virtualWans | Not specified |  |
> | /vpnGateways | Resource group | Not specified |  |
> | /vpnGateways/vpnConnections | vpnGateways | Not specified |  |
> | /vpnServerConfigurations | Resource group | Not specified |  |
> | /vpnSites | Resource group | Not specified |  |

## Microsoft.NotificationHubs

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | namespaces | Global | 6-50 | Must start and end with letter or number. | Must start and end with letter or number. Can only include letters, numbers, and hyphens. |
> | namespaces/AuthorizationRules | Namespace |  |  |
> | namespaces/notificationHubs | Namespace | 1-260 | Must start and end with letter or number. Can only include letters, numbers, periods, hyphens, and underscores. |
> | namespaces/notificationHubs/AuthorizationRules | Notification hub |  |  |

## Microsoft.OperationalInsights

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | /clusters | Resource group | 4-63 | Must start with alphanumeric character<br>`^[A-Za-z0-9][A-Za-z0-9-]+[A-Za-z0-9]$` |
> | /workspaces | Resource group | 4-63 | Must start with alphanumeric character<br>`^[A-Za-z0-9][A-Za-z0-9-]+[A-Za-z0-9]$` |
> | /workspaces/dataSources | workspaces | Not specified |  |
> | /workspaces/linkedServices | workspaces | Not specified |  |
> | /workspaces/savedSearches | workspaces | Not specified |  |
> | /workspaces/storageInsightConfigs | workspaces | Not specified |  |

## Microsoft.OperationsManagement

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | /ManagementConfigurations | Resource group | Not specified | Must start with a lower case letter and contain only lower case letters or numbers<br>`^[a-z][a-z0-9]*$` |
> | /solutions | Resource group | Not specified | Must start with a lower case letter and contain only lower case letters or numbers<br>`^[a-z][a-z0-9]*$` |

## Microsoft.Peering

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | /peerAsns | Resource group | Not specified |  |
> | /peerings | Resource group | Not specified |  |
> | /peeringServices | Resource group | Not specified |  |
> | /peeringServices/prefixes | peeringServices | Not specified |  |

## Microsoft.PowerBI

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | /workspaceCollections | Resource group | Not specified |  |

## Microsoft.PowerBIDedicated

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | /capacities | Resource group | 3-63 | Must start with a lower case letter and contain only lower case letters or numbers<br>`^[a-z][a-z0-9]*$` |

## Microsoft.RecoveryServices

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | /vaults | Resource group | Not specified |  |
> | /vaults/backupFabrics/backupProtectionIntent | backupFabrics | Not specified |  |
> | /vaults/backupFabrics/protectionContainers | backupFabrics | Not specified |  |
> | /vaults/backupFabrics/protectionContainers/protectedItems | protectionContainers | Not specified |  |
> | /vaults/backupPolicies | vaults | Not specified |  |
> | /vaults/certificates | vaults | Not specified |  |
> | /vaults/replicationAlertSettings | vaults | Not specified |  |
> | /vaults/replicationFabrics | vaults | Not specified |  |
> | /vaults/replicationFabrics/replicationNetworks/replicationNetworkMappings | replicationNetworks | Not specified |  |
> | /vaults/replicationFabrics/replicationProtectionContainers | replicationFabrics | Not specified |  |
> | /vaults/replicationFabrics/replicationProtectionContainers/replicationMigrationItems | replicationProtectionContainers | Not specified |  |
> | /vaults/replicationFabrics/replicationProtectionContainers/replicationProtectedItems | replicationProtectionContainers | Not specified |  |
> | /vaults/replicationFabrics/replicationProtectionContainers/replicationProtectionContainerMappings | replicationProtectionContainers | Not specified |  |
> | /vaults/replicationFabrics/replicationRecoveryServicesProviders | replicationFabrics | Not specified |  |
> | /vaults/replicationFabrics/replicationStorageClassifications/replicationStorageClassificationMappings | replicationStorageClassifications | Not specified |  |
> | /vaults/replicationFabrics/replicationvCenters | replicationFabrics | Not specified |  |
> | /vaults/replicationPolicies | vaults | Not specified |  |
> | /vaults/replicationRecoveryPlans | vaults | Not specified |  |
> | /vaults/replicationVaultSettings | vaults | Not specified |  |

## Microsoft.Relay

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | /namespaces | Resource group | 6-50 |  |
> | /namespaces/AuthorizationRules | namespaces | 1-50 |  |
> | /namespaces/HybridConnections | namespaces | 1-50 |  |
> | /namespaces/HybridConnections/authorizationRules | HybridConnections | 1-50 |  |
> | /namespaces/WcfRelays | namespaces | 1-50 |  |
> | /namespaces/WcfRelays/authorizationRules | WcfRelays | 1-50 |  |

## Microsoft.Resources

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | /deployments | Resource group | Not specified |  |
> | /deploymentScripts | Resource group | 1-90 |  |

## Microsoft.Scheduler

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | /jobCollections | Resource group | Not specified |  |
> | /jobCollections/jobs | jobCollections | Not specified |  |

## Microsoft.Search

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | /searchServices | Resource group | Not specified |  |

## Microsoft.Security

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | /advancedThreatProtectionSettings | Resource group | Not specified |  |
> | /assessmentMetadata | Resource group | Not specified |  |
> | /automations | Resource group | Not specified |  |
> | /autoProvisioningSettings | Resource group | Not specified |  |
> | /deviceSecurityGroups | Resource group | Not specified |  |
> | /informationProtectionPolicies | Resource group | Not specified |  |
> | /iotSecuritySolutions | Resource group | Not specified |  |
> | /locations/applicationWhitelistings | locations | Not specified |  |
> | /locations/jitNetworkAccessPolicies | locations | Not specified |  |
> | /pricings | Resource group | Not specified |  |
> | /securityContacts | Resource group | Not specified |  |
> | /settings | Resource group | Not specified |  |
> | /workspaceSettings | Resource group | Not specified |  |

## Microsoft.ServiceBus

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | /namespaces | Resource group | Not specified |  |
> | /namespaces/AuthorizationRules | namespaces | 1-50 |  |
> | /namespaces/disasterRecoveryConfigs | namespaces | 1-50 |  |
> | /namespaces/ipfilterrules | namespaces | 1- |  |
> | /namespaces/migrationConfigurations | namespaces | Not specified |  |
> | /namespaces/queues | namespaces | 1-50 |  |
> | /namespaces/queues/authorizationRules | queues | 1-50 |  |
> | /namespaces/topics | namespaces | 1-50 |  |
> | /namespaces/topics/authorizationRules | topics | 1-50 |  |
> | /namespaces/topics/subscriptions | topics | 1-50 |  |
> | /namespaces/topics/subscriptions/rules | subscriptions | 1-50 |  |
> | /namespaces/virtualnetworkrules | namespaces | 1- |  |

## Microsoft.ServiceFabric

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | /clusters | Resource group | Not specified |  |
> | /clusters/applications | clusters | Not specified |  |
> | /clusters/applications/services | applications | Not specified |  |
> | /clusters/applicationTypes | clusters | Not specified |  |
> | /clusters/applicationTypes/versions | applicationTypes | Not specified |  |

## Microsoft.ServiceFabricMesh

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | /applications | Resource group | Not specified |  |
> | /gateways | Resource group | Not specified |  |
> | /networks | Resource group | Not specified |  |
> | /secrets | Resource group | Not specified |  |
> | /secrets/values | secrets | Not specified |  |
> | /volumes | Resource group | Not specified |  |

## Microsoft.SignalRService

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | /signalR | Resource group | Not specified |  |

## Microsoft.Sql

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | /instancePools | Resource group | Not specified |  |
> | /locations/instanceFailoverGroups | locations | Not specified |  |
> | /managedInstances | Resource group | Not specified |  |
> | /managedInstances/administrators | managedInstances | Not specified |  |
> | /managedInstances/databases | managedInstances | Not specified |  |
> | /managedInstances/databases/backupShortTermRetentionPolicies | databases | Not specified |  |
> | /managedInstances/databases/schemas/tables/columns/sensitivityLabels | columns | Not specified |  |
> | /managedInstances/databases/securityAlertPolicies | databases | Not specified |  |
> | /managedInstances/databases/vulnerabilityAssessments | databases | Not specified |  |
> | /managedInstances/databases/vulnerabilityAssessments/rules/baselines | rules | Not specified |  |
> | /managedInstances/encryptionProtector | managedInstances | Not specified |  |
> | /managedInstances/keys | managedInstances | Not specified |  |
> | /managedInstances/restorableDroppedDatabases/backupShortTermRetentionPolicies | restorableDroppedDatabases | Not specified |  |
> | /managedInstances/securityAlertPolicies | managedInstances | Not specified |  |
> | /managedInstances/vulnerabilityAssessments | managedInstances | Not specified |  |
> | /servers | Resource group | Not specified |  |
> | /servers/administrators | servers | Not specified |  |
> | /servers/advisors | servers | Not specified |  |
> | /servers/auditingPolicies | servers | Not specified |  |
> | /servers/auditingSettings | servers | Not specified |  |
> | /servers/backupLongTermRetentionVaults | servers | Not specified |  |
> | /servers/communicationLinks | servers | Not specified |  |
> | /servers/connectionPolicies | servers | Not specified |  |
> | /servers/databases | servers | Not specified |  |
> | /servers/databases/advisors | databases | Not specified |  |
> | /servers/databases/auditingPolicies | databases | Not specified |  |
> | /servers/databases/auditingSettings | databases | Not specified |  |
> | /servers/databases/backupLongTermRetentionPolicies | databases | Not specified |  |
> | /servers/databases/backupShortTermRetentionPolicies | databases | Not specified |  |
> | /servers/databases/connectionPolicies | databases | Not specified |  |
> | /servers/databases/dataMaskingPolicies | databases | Not specified |  |
> | /servers/databases/dataMaskingPolicies/rules | dataMaskingPolicies | Not specified |  |
> | /servers/databases/extendedAuditingSettings | databases | Not specified |  |
> | /servers/databases/extensions | databases | Not specified |  |
> | /servers/databases/geoBackupPolicies | databases | Not specified |  |
> | /servers/databases/schemas/tables/columns/sensitivityLabels | columns | Not specified |  |
> | /servers/databases/securityAlertPolicies | databases | Not specified |  |
> | /servers/databases/syncGroups | databases | Not specified |  |
> | /servers/databases/syncGroups/syncMembers | syncGroups | Not specified |  |
> | /servers/databases/transparentDataEncryption | databases | Not specified |  |
> | /servers/databases/vulnerabilityAssessments | databases | Not specified |  |
> | /servers/databases/vulnerabilityAssessments/rules/baselines | rules | Not specified |  |
> | /servers/databases/workloadGroups | databases | Not specified |  |
> | /servers/databases/workloadGroups/workloadClassifiers | workloadGroups | Not specified |  |
> | /servers/disasterRecoveryConfiguration | servers | Not specified |  |
> | /servers/dnsAliases | servers | Not specified |  |
> | /servers/elasticPools | servers | Not specified |  |
> | /servers/encryptionProtector | servers | Not specified |  |
> | /servers/extendedAuditingSettings | servers | Not specified |  |
> | /servers/failoverGroups | servers | Not specified |  |
> | /servers/firewallRules | servers | Not specified |  |
> | /servers/jobAgents | servers | Not specified |  |
> | /servers/jobAgents/credentials | jobAgents | Not specified |  |
> | /servers/jobAgents/jobs | jobAgents | Not specified |  |
> | /servers/jobAgents/jobs/executions | jobs | Not specified |  |
> | /servers/jobAgents/jobs/steps | jobs | Not specified |  |
> | /servers/jobAgents/targetGroups | jobAgents | Not specified |  |
> | /servers/keys | servers | Not specified |  |
> | /servers/privateEndpointConnections | servers | Not specified |  |
> | /servers/securityAlertPolicies | servers | Not specified |  |
> | /servers/syncAgents | servers | Not specified |  |
> | /servers/virtualNetworkRules | servers | Not specified |  |
> | /servers/vulnerabilityAssessments | servers | Not specified |  |

## Microsoft.SqlVirtualMachine

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | /sqlVirtualMachineGroups | Resource group | Not specified |  |
> | /sqlVirtualMachineGroups/availabilityGroupListeners | sqlVirtualMachineGroups | Not specified |  |
> | /sqlVirtualMachines | Resource group | Not specified |  |

## Microsoft.Storage

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | /storageAccounts | Resource group | 3-24 |  |
> | /storageAccounts/blobServices | storageAccounts | Not specified |  |
> | /storageAccounts/blobServices/default/containers | default | 3-63 |  |
> | /storageAccounts/blobServices/default/containers/immutabilityPolicies | containers | Not specified |  |
> | /storageAccounts/fileServices | storageAccounts | Not specified |  |
> | /storageAccounts/fileServices/default/shares | default | 3-63 |  |
> | /storageAccounts/managementPolicies | storageAccounts | Not specified |  |
> | /storageAccounts/privateEndpointConnections | storageAccounts | Not specified |  |

## Microsoft.StorageSync

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | /storageSyncServices | Resource group | Not specified |  |
> | /storageSyncServices/registeredServers | storageSyncServices | Not specified |  |
> | /storageSyncServices/syncGroups | storageSyncServices | Not specified |  |
> | /storageSyncServices/syncGroups/cloudEndpoints | syncGroups | Not specified |  |
> | /storageSyncServices/syncGroups/serverEndpoints | syncGroups | Not specified |  |

## Microsoft.StorSimple

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | /managers | Resource group | 2-50 |  |
> | /managers/accessControlRecords | managers | Not specified |  |
> | /managers/bandwidthSettings | managers | Not specified |  |
> | /managers/devices/backupPolicies | devices | Not specified |  |
> | /managers/devices/backupPolicies/schedules | backupPolicies | Not specified |  |
> | /managers/devices/volumeContainers | devices | Not specified |  |
> | /managers/devices/volumeContainers/volumes | volumeContainers | Not specified |  |
> | /managers/storageAccountCredentials | managers | Not specified |  |

## Microsoft.StreamAnalytics

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | streamingjobs | Resource group | 3-63 | Contains only alphanumeric characters, hyphens, and underscores. |
> | streamingjobs/functions | Streaming job | 3-63 | Contains only alphanumeric characters, hyphens, and underscores. |
> | streamingjobs/inputs | Streaming job | 3-63 | Contains only alphanumeric characters, hyphens, and underscores. |
> | streamingjobs/outputs | Streaming job | 3-63 | Contains only alphanumeric characters, hyphens, and underscores. |
> | streamingjobs/transformations | Streaming job | 3-63 | Contains only alphanumeric characters, hyphens, and underscores. |

## Microsoft.TimeSeriesInsights

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | environments | Resource group | 1-90 | Any characters except '<>%&:\?/# |
> | environments/accessPolicies | Environment | 1-90 | Any characters except '<>%&:\?/# |
> | environments/eventSources | Environment | 1-90 | Any characters except '<>%&:\?/# |
> | environments/referenceDataSets | Environment | 3-63 |  Alphanumeric characters |

## Microsoft.Web

> [!div class="mx-tableFixed"]
> | Entity | Scope | Length | Valid Characters |
> | --- | --- | --- | --- |
> | /certificates | Resource group | Not specified |  |
> | /connectionGateways | Resource group | Not specified |  |
> | /connections | Resource group | Not specified |  |
> | /csrs | Resource group | Not specified |  |
> | /customApis | Resource group | Not specified |  |
> | /hostingEnvironments | Resource group | Not specified |  |
> | /hostingEnvironments/workerPools | hostingEnvironments | Not specified |  |
> | /managedHostingEnvironments | Resource group | Not specified |  |
> | /serverfarms | Resource group | Not specified |  |
> | /serverfarms/virtualNetworkConnections/gateways | virtualNetworkConnections | Not specified |  |
> | /serverfarms/virtualNetworkConnections/routes | virtualNetworkConnections | Not specified |  |
> | /sites | Global | 1-60 | Contains alphanumerics and hyphens. |
> | /sites/config | sites | Not specified |  |
> | /sites/deployments | sites | Not specified |  |
> | /sites/domainOwnershipIdentifiers | sites | Not specified |  |
> | /sites/extensions | sites | Not specified |  |
> | /sites/functions | sites | Not specified |  |
> | /sites/functions/keys | functions | Not specified |  |
> | /sites/host/default/ | default | Not specified |  |
> | /sites/hostNameBindings | sites | Not specified |  |
> | /sites/hybridconnection | sites | Not specified |  |
> | /sites/hybridConnectionNamespaces/relays | hybridConnectionNamespaces | Not specified |  |
> | /sites/instances/deployments | instances | Not specified |  |
> | /sites/instances/extensions | instances | Not specified |  |
> | /sites/premieraddons | sites | Not specified |  |
> | /sites/publicCertificates | sites | Not specified |  |
> | /sites/siteextensions | sites | Not specified |  |
> | /sites/slots | Site | 2-59 | Contains alphanumerics and hyphens. |
> | /sites/slots/config | slots | Not specified |  |
> | /sites/slots/deployments | slots | Not specified |  |
> | /sites/slots/domainOwnershipIdentifiers | slots | Not specified |  |
> | /sites/slots/extensions | slots | Not specified |  |
> | /sites/slots/functions | slots | Not specified |  |
> | /sites/slots/functions/keys | functions | Not specified |  |
> | /sites/slots/host/default/ | default | Not specified |  |
> | /sites/slots/hostNameBindings | slots | Not specified |  |
> | /sites/slots/hybridconnection | slots | Not specified |  |
> | /sites/slots/hybridConnectionNamespaces/relays | hybridConnectionNamespaces | Not specified |  |
> | /sites/slots/instances/deployments | instances | Not specified |  |
> | /sites/slots/instances/extensions | instances | Not specified |  |
> | /sites/slots/premieraddons | slots | Not specified |  |
> | /sites/slots/publicCertificates | slots | Not specified |  |
> | /sites/slots/siteextensions | slots | Not specified |  |
> | /sites/slots/virtualNetworkConnections | slots | Not specified |  |
> | /sites/slots/virtualNetworkConnections/gateways | virtualNetworkConnections | Not specified |  |
> | /sites/virtualNetworkConnections | sites | Not specified |  |
> | /sites/virtualNetworkConnections/gateways | virtualNetworkConnections | Not specified |  |
> | /sourcecontrols | Resource group | Not specified |  |

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
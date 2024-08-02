---
title: Azure permissions for Databases - Azure RBAC
description: Lists the permissions for the Azure resource providers in the Databases category.
ms.service: role-based-access-control
ms.topic: reference
author: rolyon
manager: amycolannino
ms.author: rolyon
ms.date: 04/25/2024
ms.custom: generated
---

# Azure permissions for Databases

This article lists the permissions for the Azure resource providers in the Databases category. You can use these permissions in your own [Azure custom roles](/azure/role-based-access-control/custom-roles) to provide granular access control to resources in Azure. Permission strings have the following format: `{Company}.{ProviderName}/{resourceType}/{action}`


## Microsoft.Cache

Power applications with high-throughput, low-latency data access.

Azure service: [Azure Cache for Redis](/azure/azure-cache-for-redis/)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.Cache/checknameavailability/action | Checks if a name is available for use with a new Redis Cache |
> | Microsoft.Cache/register/action | Registers the 'Microsoft.Cache' resource provider with a subscription |
> | Microsoft.Cache/unregister/action | Unregisters the 'Microsoft.Cache' resource provider with a subscription |
> | Microsoft.Cache/locations/checknameavailability/action | Checks if a name is available for use with a new Redis Enterprise cache |
> | Microsoft.Cache/locations/asyncOperations/read | Read an Async Operation's Status |
> | Microsoft.Cache/locations/operationResults/read | Gets the result of a long running operation for which the 'Location' header was previously returned to the client |
> | Microsoft.Cache/locations/operationsStatus/read | View the status of a long running operation for which the 'AzureAsync' header was previously returned to the client |
> | Microsoft.Cache/operations/read | Lists the operations that 'Microsoft.Cache' provider supports. |
> | Microsoft.Cache/redis/write | Modify the Redis Cache's settings and configuration in the management portal |
> | Microsoft.Cache/redis/read | View the Redis Cache's settings and configuration in the management portal |
> | Microsoft.Cache/redis/delete | Delete the entire Redis Cache |
> | Microsoft.Cache/redis/listKeys/action | View the value of Redis Cache access keys in the management portal |
> | Microsoft.Cache/redis/regenerateKey/action | Change the value of Redis Cache access keys in the management portal |
> | Microsoft.Cache/redis/import/action | Import data of a specified format from multiple blobs into Redis |
> | Microsoft.Cache/redis/export/action | Export Redis data to prefixed storage blobs in specified format |
> | Microsoft.Cache/redis/forceReboot/action | Force reboot a cache instance, potentially with data loss. |
> | Microsoft.Cache/redis/stop/action | Stop an Azure Cache for Redis, potentially with data loss. |
> | Microsoft.Cache/redis/start/action | Start an Azure Cache for Redis |
> | Microsoft.Cache/redis/flush/action | Deletes all of the keys in a cache.  |
> | Microsoft.Cache/redis/PrivateEndpointConnectionsApproval/action | Approve Private Endpoint Connections |
> | Microsoft.Cache/redis/accessPolicies/read | Get Redis Access Policies |
> | Microsoft.Cache/redis/accessPolicies/write | Modify Redis Access Policies |
> | Microsoft.Cache/redis/accessPolicies/delete | Delete Redis Access Policies |
> | Microsoft.Cache/redis/accessPolicyAssignments/read | Get Redis Access Policy Assignments |
> | Microsoft.Cache/redis/accessPolicyAssignments/write | Modify Redis Access Policy Assignments |
> | Microsoft.Cache/redis/accessPolicyAssignments/delete | Delete Access Policy Assignments |
> | Microsoft.Cache/redis/detectors/read | Get the properties of one or all detectors for an Azure Cache for Redis cache |
> | Microsoft.Cache/redis/eventGridFilters/read | Get Redis Cache Event Grid Filter |
> | Microsoft.Cache/redis/eventGridFilters/write | Update Redis Cache Event Grid Filters |
> | Microsoft.Cache/redis/eventGridFilters/delete | Delete Redis Cache Event Grid Filters |
> | Microsoft.Cache/redis/firewallRules/read | Get the IP firewall rules of a Redis Cache |
> | Microsoft.Cache/redis/firewallRules/write | Edit the IP firewall rules of a Redis Cache |
> | Microsoft.Cache/redis/firewallRules/delete | Delete IP firewall rules of a Redis Cache |
> | Microsoft.Cache/redis/linkedServers/read | Get Linked Servers associated with a redis cache. |
> | Microsoft.Cache/redis/linkedServers/write | Add Linked Server to a Redis Cache |
> | Microsoft.Cache/redis/linkedServers/delete | Delete Linked Server from a Redis Cache |
> | Microsoft.Cache/redis/metricDefinitions/read | Gets the available metrics for a Redis Cache |
> | Microsoft.Cache/redis/patchSchedules/read | Gets the patching schedule of a Redis Cache |
> | Microsoft.Cache/redis/patchSchedules/write | Modify the patching schedule of a Redis Cache |
> | Microsoft.Cache/redis/patchSchedules/delete | Delete the patch schedule of a Redis Cache |
> | Microsoft.Cache/redis/privateEndpointConnectionProxies/validate/action | Validate the private endpoint connection proxy |
> | Microsoft.Cache/redis/privateEndpointConnectionProxies/read | Get the private endpoint connection proxy |
> | Microsoft.Cache/redis/privateEndpointConnectionProxies/write | Create the private endpoint connection proxy |
> | Microsoft.Cache/redis/privateEndpointConnectionProxies/delete | Delete the private endpoint connection proxy |
> | Microsoft.Cache/redis/privateEndpointConnections/read | Read a private endpoint connection |
> | Microsoft.Cache/redis/privateEndpointConnections/write | Write a private endpoint connection |
> | Microsoft.Cache/redis/privateEndpointConnections/delete | Delete a private endpoint connection |
> | Microsoft.Cache/redis/privateLinkResources/read | Read 'groupId' of redis subresource that a private link can be connected to |
> | Microsoft.Cache/redisEnterprise/delete | Delete the entire Redis Enterprise cache |
> | Microsoft.Cache/redisEnterprise/read | View the Redis Enterprise cache's settings and configuration in the management portal |
> | Microsoft.Cache/redisEnterprise/write | Modify the Redis Enterprise cache's settings and configuration in the management portal |
> | Microsoft.Cache/redisEnterprise/PrivateEndpointConnectionsApproval/action | Approve Private Endpoint Connections |
> | Microsoft.Cache/redisEnterprise/databases/delete | Deletes a Redis Enterprise database and its contents |
> | Microsoft.Cache/redisEnterprise/databases/read | View the Redis Enterprise cache database's settings and configuration in the management portal |
> | Microsoft.Cache/redisEnterprise/databases/write | Modify the Redis Enterprise cache database's settings and configuration in the management portal |
> | Microsoft.Cache/redisEnterprise/databases/export/action | Export data to storage blobs from a Redis Enterprise database  |
> | Microsoft.Cache/redisEnterprise/databases/forceUnlink/action | Forcibly unlink a georeplica Redis Enterprise database from its peers |
> | Microsoft.Cache/redisEnterprise/databases/import/action | Import data from storage blobs to a Redis Enterprise database |
> | Microsoft.Cache/redisEnterprise/databases/listKeys/action | View the value of Redis Enterprise database access keys in the management portal |
> | Microsoft.Cache/redisEnterprise/databases/regenerateKey/action | Change the value of Redis Enterprise database access keys in the management portal |
> | Microsoft.Cache/redisEnterprise/databases/operationResults/read | View the result of Redis Enterprise database operations in the management portal |
> | Microsoft.Cache/redisEnterprise/operationResults/read | View the result of Redis Enterprise operations in the management portal |
> | Microsoft.Cache/redisEnterprise/privateEndpointConnectionProxies/validate/action | Validate the private endpoint connection proxy |
> | Microsoft.Cache/redisEnterprise/privateEndpointConnectionProxies/read | Get the private endpoint connection proxy |
> | Microsoft.Cache/redisEnterprise/privateEndpointConnectionProxies/write | Create the private endpoint connection proxy |
> | Microsoft.Cache/redisEnterprise/privateEndpointConnectionProxies/delete | Delete the private endpoint connection proxy |
> | Microsoft.Cache/redisEnterprise/privateEndpointConnectionProxies/operationResults/read | View the result of private endpoint connection operations in the management portal |
> | Microsoft.Cache/redisEnterprise/privateEndpointConnections/read | Read a private endpoint connection |
> | Microsoft.Cache/redisEnterprise/privateEndpointConnections/write | Write a private endpoint connection |
> | Microsoft.Cache/redisEnterprise/privateEndpointConnections/delete | Delete a private endpoint connection |
> | Microsoft.Cache/redisEnterprise/privateLinkResources/read | Read 'groupId' of redis subresource that a private link can be connected to |
> | Microsoft.Cache/redisEnterprise/providers/Microsoft.Insights/metricDefinitions/read | Gets the available metrics for a Redis Enterprise Cache |

## Microsoft.DBforMariaDB

Managed MariaDB database service for app developers.

Azure service: [Azure Database for MariaDB](/azure/mariadb/)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.DBforMariaDB/privateEndpointConnectionsApproval/action | Determines if user is allowed to approve a private endpoint connection |
> | Microsoft.DBforMariaDB/register/action | Register MariaDB Resource Provider |
> | Microsoft.DBforMariaDB/checkNameAvailability/action | Verify whether given server name is available for provisioning worldwide for a given subscription. |
> | Microsoft.DBforMariaDB/locations/administratorAzureAsyncOperation/read | Gets in-progress operations on MariaDB server administrators |
> | Microsoft.DBforMariaDB/locations/administratorOperationResults/read | Return MariaDB Server administrator operation results |
> | Microsoft.DBforMariaDB/locations/azureAsyncOperation/read | Return MariaDB Server Operation Results |
> | Microsoft.DBforMariaDB/locations/operationResults/read | Return ResourceGroup based MariaDB Server Operation Results |
> | Microsoft.DBforMariaDB/locations/operationResults/read | Return MariaDB Server Operation Results |
> | Microsoft.DBforMariaDB/locations/performanceTiers/read | Returns the list of Performance Tiers available. |
> | Microsoft.DBforMariaDB/locations/privateEndpointConnectionAzureAsyncOperation/read | Gets the result for a private endpoint connection operation |
> | Microsoft.DBforMariaDB/locations/privateEndpointConnectionOperationResults/read | Gets the result for a private endpoint connection operation |
> | Microsoft.DBforMariaDB/locations/privateEndpointConnectionProxyAzureAsyncOperation/read | Gets the result for a private endpoint connection proxy operation |
> | Microsoft.DBforMariaDB/locations/privateEndpointConnectionProxyOperationResults/read | Gets the result for a private endpoint connection proxy operation |
> | Microsoft.DBforMariaDB/locations/securityAlertPoliciesAzureAsyncOperation/read | Return the list of Server threat detection operation result. |
> | Microsoft.DBforMariaDB/locations/securityAlertPoliciesOperationResults/read | Return the list of Server threat detection operation result. |
> | Microsoft.DBforMariaDB/locations/serverKeyAzureAsyncOperation/read | Gets in-progress operations on data encryption server keys |
> | Microsoft.DBforMariaDB/locations/serverKeyOperationResults/read | Gets in-progress operations on transparent data encryption server keys |
> | Microsoft.DBforMariaDB/operations/read | Return the list of MariaDB Operations. |
> | Microsoft.DBforMariaDB/performanceTiers/read | Returns the list of Performance Tiers available. |
> | Microsoft.DBforMariaDB/servers/start/action | Starts a specific server. |
> | Microsoft.DBforMariaDB/servers/stop/action | Stops a specific server. |
> | Microsoft.DBforMariaDB/servers/resetQueryPerformanceInsightData/action | Reset Query Performance Insight data |
> | Microsoft.DBforMariaDB/servers/queryTexts/action | Return the texts for a list of queries |
> | Microsoft.DBforMariaDB/servers/queryTexts/action | Return the text of a query |
> | Microsoft.DBforMariaDB/servers/privateEndpointConnectionsApproval/action | Determines if user is allowed to approve a private endpoint connection |
> | Microsoft.DBforMariaDB/servers/read | Return the list of servers or gets the properties for the specified server. |
> | Microsoft.DBforMariaDB/servers/write | Creates a server with the specified parameters or update the properties or tags for the specified server. |
> | Microsoft.DBforMariaDB/servers/delete | Deletes an existing server. |
> | Microsoft.DBforMariaDB/servers/restart/action | Restarts a specific server. |
> | Microsoft.DBforMariaDB/servers/updateConfigurations/action | Update configurations for the specified server |
> | Microsoft.DBforMariaDB/servers/administrators/read | Gets a list of MariaDB server administrators. |
> | Microsoft.DBforMariaDB/servers/administrators/write | Creates or updates MariaDB server administrator with the specified parameters. |
> | Microsoft.DBforMariaDB/servers/administrators/delete | Deletes an existing administrator of MariaDB server. |
> | Microsoft.DBforMariaDB/servers/advisors/read | Return the list of advisors |
> | Microsoft.DBforMariaDB/servers/advisors/read | Return an advisor |
> | Microsoft.DBforMariaDB/servers/advisors/createRecommendedActionSession/action | Create a new recommendation action session |
> | Microsoft.DBforMariaDB/servers/advisors/recommendedActions/read | Return the list of recommended actions |
> | Microsoft.DBforMariaDB/servers/advisors/recommendedActions/read | Return a recommended action |
> | Microsoft.DBforMariaDB/servers/configurations/read | Return the list of configurations for a server or gets the properties for the specified configuration. |
> | Microsoft.DBforMariaDB/servers/configurations/write | Update the value for the specified configuration |
> | Microsoft.DBforMariaDB/servers/databases/read | Return the list of MariaDB Databases or gets the properties for the specified Database. |
> | Microsoft.DBforMariaDB/servers/databases/write | Creates a MariaDB Database with the specified parameters or update the properties for the specified Database. |
> | Microsoft.DBforMariaDB/servers/databases/delete | Deletes an existing MariaDB Database. |
> | Microsoft.DBforMariaDB/servers/firewallRules/read | Return the list of firewall rules for a server or gets the properties for the specified firewall rule. |
> | Microsoft.DBforMariaDB/servers/firewallRules/write | Creates a firewall rule with the specified parameters or update an existing rule. |
> | Microsoft.DBforMariaDB/servers/firewallRules/delete | Deletes an existing firewall rule. |
> | Microsoft.DBforMariaDB/servers/keys/read | Return the list of server keys or gets the properties for the specified server key. |
> | Microsoft.DBforMariaDB/servers/keys/write | Creates a key with the specified parameters or update the properties or tags for the specified server key. |
> | Microsoft.DBforMariaDB/servers/keys/delete | Deletes an existing server key. |
> | Microsoft.DBforMariaDB/servers/logFiles/read | Return the list of MariaDB LogFiles. |
> | Microsoft.DBforMariaDB/servers/performanceTiers/read | Returns the list of Performance Tiers available. |
> | Microsoft.DBforMariaDB/servers/privateEndpointConnectionProxies/validate/action | Validates a private endpoint connection create call from NRP side |
> | Microsoft.DBforMariaDB/servers/privateEndpointConnectionProxies/read | Returns the list of private endpoint connection proxies or gets the properties for the specified private endpoint connection proxy. |
> | Microsoft.DBforMariaDB/servers/privateEndpointConnectionProxies/write | Creates a private endpoint connection proxy with the specified parameters or updates the properties or tags for the specified private endpoint connection proxy. |
> | Microsoft.DBforMariaDB/servers/privateEndpointConnectionProxies/delete | Deletes an existing private endpoint connection proxy |
> | Microsoft.DBforMariaDB/servers/privateEndpointConnections/read | Returns the list of private endpoint connections or gets the properties for the specified private endpoint connection. |
> | Microsoft.DBforMariaDB/servers/privateEndpointConnections/delete | Deletes an existing private endpoint connection |
> | Microsoft.DBforMariaDB/servers/privateEndpointConnections/write | Approves or rejects an existing private endpoint connection |
> | Microsoft.DBforMariaDB/servers/privateLinkResources/read | Get the private link resources for the corresponding MariaDB Server |
> | Microsoft.DBforMariaDB/servers/providers/Microsoft.Insights/diagnosticSettings/read | Gets the disagnostic setting for the resource |
> | Microsoft.DBforMariaDB/servers/providers/Microsoft.Insights/diagnosticSettings/write | Creates or updates the diagnostic setting for the resource |
> | Microsoft.DBforMariaDB/servers/providers/Microsoft.Insights/logDefinitions/read | Gets the available logs for MariaDB servers |
> | Microsoft.DBforMariaDB/servers/providers/Microsoft.Insights/metricDefinitions/read | Return types of metrics that are available for databases |
> | Microsoft.DBforMariaDB/servers/recoverableServers/read | Return the recoverable MariaDB Server info |
> | Microsoft.DBforMariaDB/servers/replicas/read | Get read replicas of a MariaDB server |
> | Microsoft.DBforMariaDB/servers/securityAlertPolicies/read | Retrieve details of the server threat detection policy configured on a given server |
> | Microsoft.DBforMariaDB/servers/securityAlertPolicies/write | Change the server threat detection policy for a given server |
> | Microsoft.DBforMariaDB/servers/securityAlertPolicies/read | Retrieve a list of server threat detection policies configured for a given server |
> | Microsoft.DBforMariaDB/servers/topQueryStatistics/read | Return the list of Query Statistics for the top queries. |
> | Microsoft.DBforMariaDB/servers/topQueryStatistics/read | Return a Query Statistic |
> | Microsoft.DBforMariaDB/servers/virtualNetworkRules/read | Return the list of virtual network rules or gets the properties for the specified virtual network rule. |
> | Microsoft.DBforMariaDB/servers/virtualNetworkRules/write | Creates a virtual network rule with the specified parameters or update the properties or tags for the specified virtual network rule. |
> | Microsoft.DBforMariaDB/servers/virtualNetworkRules/delete | Deletes an existing Virtual Network Rule |
> | Microsoft.DBforMariaDB/servers/waitStatistics/read | Return wait statistics for an instance |
> | Microsoft.DBforMariaDB/servers/waitStatistics/read | Return a wait statistic |

## Microsoft.DBforMySQL

Managed MySQL database service for app developers.

Azure service: [Azure Database for MySQL](/azure/mysql/)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.DBforMySQL/getPrivateDnsZoneSuffix/action | Gets the private dns zone suffix. |
> | Microsoft.DBforMySQL/privateEndpointConnectionsApproval/action | Determines if user is allowed to approve a private endpoint connection |
> | Microsoft.DBforMySQL/register/action | Register MySQL Resource Provider |
> | Microsoft.DBforMySQL/checkNameAvailability/action | Verify whether given server name is available for provisioning worldwide for a given subscription. |
> | Microsoft.DBforMySQL/flexibleServers/read | Returns the list of servers or gets the properties for the specified server. |
> | Microsoft.DBforMySQL/flexibleServers/write | Creates a server with the specified parameters or updates the properties or tags for the specified server. |
> | Microsoft.DBforMySQL/flexibleServers/delete | Deletes an existing server. |
> | Microsoft.DBforMySQL/flexibleServers/validateEstimateHighAvailability/action |  |
> | Microsoft.DBforMySQL/flexibleServers/detachVNet/action |  |
> | Microsoft.DBforMySQL/flexibleServers/getReplicationStatusForMigration/action | Return whether the replication is able to migration. |
> | Microsoft.DBforMySQL/flexibleServers/resetGtid/action |  |
> | Microsoft.DBforMySQL/flexibleServers/checkServerVersionUpgradeAvailability/action |  |
> | Microsoft.DBforMySQL/flexibleServers/privateEndpointConnectionsApproval/action | Determines if user is allowed to approve a private endpoint connection |
> | Microsoft.DBforMySQL/flexibleServers/backupAndExport/action | Creates a server backup for long term with specific backup name and export it. |
> | Microsoft.DBforMySQL/flexibleServers/validateBackup/action | Validate that the server is ready for backup. |
> | Microsoft.DBforMySQL/flexibleServers/checkHaReplica/action |  |
> | Microsoft.DBforMySQL/flexibleServers/updateConfigurations/action | Updates configurations for the specified server. |
> | Microsoft.DBforMySQL/flexibleServers/cutoverMigration/action | Performs a migration cutover with the specified parameters. |
> | Microsoft.DBforMySQL/flexibleServers/failover/action | Failovers a specific server. |
> | Microsoft.DBforMySQL/flexibleServers/restart/action | Restarts a specific server. |
> | Microsoft.DBforMySQL/flexibleServers/start/action | Starts a specific server. |
> | Microsoft.DBforMySQL/flexibleServers/stop/action | Stops a specific server. |
> | Microsoft.DBforMySQL/flexibleServers/administrators/read | Returns the list of administrators for a server or gets the properties for the specified administrator |
> | Microsoft.DBforMySQL/flexibleServers/administrators/write | Creates an administrator with the specified parameters or updates an existing administrator |
> | Microsoft.DBforMySQL/flexibleServers/administrators/delete | Deletes an existing server administrator. |
> | Microsoft.DBforMySQL/flexibleServers/advancedThreatProtectionSettings/read | Returns the list of Advanced Threat Protection settings for a server or gets the properties for the specified Advanced Threat Protection setting. |
> | Microsoft.DBforMySQL/flexibleServers/advancedThreatProtectionSettings/write | Update the server's advanced threat protection setting. |
> | Microsoft.DBforMySQL/flexibleServers/backups/write | Creates a server backup with specific backup name. |
> | Microsoft.DBforMySQL/flexibleServers/backups/read | Returns the list of backups for a server or gets the properties for the specified backup. |
> | Microsoft.DBforMySQL/flexibleServers/backupsv2/write |  |
> | Microsoft.DBforMySQL/flexibleServers/backupsv2/read |  |
> | Microsoft.DBforMySQL/flexibleServers/configurations/read | Returns the list of  MySQL server configurations or gets the configurations for the specified server. |
> | Microsoft.DBforMySQL/flexibleServers/configurations/write | Updates the configuration of a MySQL server. |
> | Microsoft.DBforMySQL/flexibleServers/databases/read | Returns the list of databases for a server or gets the properties for the specified database. |
> | Microsoft.DBforMySQL/flexibleServers/databases/write | Creates a database with the specified parameters or updates an existing database. |
> | Microsoft.DBforMySQL/flexibleServers/databases/delete | Deletes an existing database. |
> | Microsoft.DBforMySQL/flexibleServers/firewallRules/write | Creates a firewall rule with the specified parameters or updates an existing rule. |
> | Microsoft.DBforMySQL/flexibleServers/firewallRules/read | Returns the list of firewall rules for a server or gets the properties for the specified firewall rule. |
> | Microsoft.DBforMySQL/flexibleServers/firewallRules/delete | Deletes an existing firewall rule. |
> | Microsoft.DBforMySQL/flexibleServers/logFiles/read | Return a list of server log files for a server with file download links |
> | Microsoft.DBforMySQL/flexibleServers/maintenances/read |  |
> | Microsoft.DBforMySQL/flexibleServers/maintenances/write |  |
> | Microsoft.DBforMySQL/flexibleServers/outboundIp/read | Get the outbound ip of server |
> | Microsoft.DBforMySQL/flexibleServers/privateEndpointConnectionProxies/read | Returns the list of private endpoint connection proxies or gets the properties for the specified private endpoint connection proxy. |
> | Microsoft.DBforMySQL/flexibleServers/privateEndpointConnectionProxies/delete | Deletes an existing private endpoint connection proxy |
> | Microsoft.DBforMySQL/flexibleServers/privateEndpointConnectionProxies/write | Creates a private endpoint connection proxy with the specified parameters or updates the properties or tags for the specified private endpoint connection proxy. |
> | Microsoft.DBforMySQL/flexibleServers/privateEndpointConnectionProxies/validate/action | Validates a private endpoint connection create call from NRP side |
> | Microsoft.DBforMySQL/flexibleServers/privateEndpointConnections/read | Returns the list of private endpoint connections or gets the properties for the specified private endpoint connection. |
> | Microsoft.DBforMySQL/flexibleServers/privateEndpointConnections/read |  |
> | Microsoft.DBforMySQL/flexibleServers/privateEndpointConnections/delete | Deletes an existing private endpoint connection |
> | Microsoft.DBforMySQL/flexibleServers/privateEndpointConnections/write | Approves or rejects an existing private endpoint connection |
> | Microsoft.DBforMySQL/flexibleServers/privateLinkResources/read |  |
> | Microsoft.DBforMySQL/flexibleServers/privateLinkResources/read | Get the private link resources for the corresponding MySQL Server |
> | Microsoft.DBforMySQL/flexibleServers/providers/Microsoft.Insights/diagnosticSettings/read | Gets the disagnostic setting for the resource |
> | Microsoft.DBforMySQL/flexibleServers/providers/Microsoft.Insights/diagnosticSettings/write | Creates or updates the diagnostic setting for the resource |
> | Microsoft.DBforMySQL/flexibleServers/providers/Microsoft.Insights/logDefinitions/read | Gets the available logs for MySQL servers |
> | Microsoft.DBforMySQL/flexibleServers/providers/Microsoft.Insights/metricDefinitions/read | Return types of metrics that are available for databases |
> | Microsoft.DBforMySQL/flexibleServers/replicas/read | Returns the list of read replicas for a MySQL server |
> | Microsoft.DBforMySQL/flexibleServers/supportedFeatures/read | Return the list of the MySQL Server Supported Features |
> | Microsoft.DBforMySQL/locations/checkVirtualNetworkSubnetUsage/action | Checks the subnet usage for speicifed delegated virtual network. |
> | Microsoft.DBforMySQL/locations/checkNameAvailability/action | Verify whether given server name is available for provisioning worldwide for a given subscription. |
> | Microsoft.DBforMySQL/locations/listMigrations/action | Return the List of MySQL scheduled auto migrations |
> | Microsoft.DBforMySQL/locations/assessForMigration/action | Performs a migration assessment with the specified parameters. |
> | Microsoft.DBforMySQL/locations/updateMigration/action | Updates the scheduled migration for MySQL Server |
> | Microsoft.DBforMySQL/locations/administratorAzureAsyncOperation/read | Gets in-progress operations on MySQL server administrators |
> | Microsoft.DBforMySQL/locations/administratorOperationResults/read | Return MySQL Server administrator operation results |
> | Microsoft.DBforMySQL/locations/azureAsyncOperation/read | Return MySQL Server Operation Results |
> | Microsoft.DBforMySQL/locations/capabilities/read | Gets the capabilities for this subscription in a given location |
> | Microsoft.DBforMySQL/locations/capabilitySets/read |  |
> | Microsoft.DBforMySQL/locations/operationResults/read | Return ResourceGroup based MySQL Server Operation Results |
> | Microsoft.DBforMySQL/locations/operationResults/read | Return MySQL Server Operation Results |
> | Microsoft.DBforMySQL/locations/performanceTiers/read | Returns the list of Performance Tiers available. |
> | Microsoft.DBforMySQL/locations/privateEndpointConnectionAzureAsyncOperation/read | Gets the result for a private endpoint connection operation |
> | Microsoft.DBforMySQL/locations/privateEndpointConnectionOperationResults/read | Gets the result for a private endpoint connection operation |
> | Microsoft.DBforMySQL/locations/privateEndpointConnectionProxyAzureAsyncOperation/read | Gets the result for a private endpoint connection proxy operation |
> | Microsoft.DBforMySQL/locations/privateEndpointConnectionProxyOperationResults/read | Gets the result for a private endpoint connection proxy operation |
> | Microsoft.DBforMySQL/locations/securityAlertPoliciesAzureAsyncOperation/read | Return the list of Server threat detection operation result. |
> | Microsoft.DBforMySQL/locations/securityAlertPoliciesOperationResults/read | Return the list of Server threat detection operation result. |
> | Microsoft.DBforMySQL/locations/serverKeyAzureAsyncOperation/read | Gets in-progress operations on transparent data encryption server keys |
> | Microsoft.DBforMySQL/locations/serverKeyOperationResults/read | Gets in-progress operations on data encryption server keys |
> | Microsoft.DBforMySQL/operations/read | Return the list of MySQL Operations. |
> | Microsoft.DBforMySQL/performanceTiers/read | Returns the list of Performance Tiers available. |
> | Microsoft.DBforMySQL/servers/upgrade/action |  |
> | Microsoft.DBforMySQL/servers/start/action | Starts a specific server. |
> | Microsoft.DBforMySQL/servers/stop/action | Stops a specific server. |
> | Microsoft.DBforMySQL/servers/privateEndpointConnectionsApproval/action | Determines if user is allowed to approve a private endpoint connection |
> | Microsoft.DBforMySQL/servers/resetQueryPerformanceInsightData/action | Reset Query Performance Insight data |
> | Microsoft.DBforMySQL/servers/queryTexts/action | Return the texts for a list of queries |
> | Microsoft.DBforMySQL/servers/queryTexts/action | Return the text of a query |
> | Microsoft.DBforMySQL/servers/read | Return the list of servers or gets the properties for the specified server. |
> | Microsoft.DBforMySQL/servers/write | Creates a server with the specified parameters or update the properties or tags for the specified server. |
> | Microsoft.DBforMySQL/servers/delete | Deletes an existing server. |
> | Microsoft.DBforMySQL/servers/restart/action | Restarts a specific server. |
> | Microsoft.DBforMySQL/servers/updateConfigurations/action | Update configurations for the specified server |
> | Microsoft.DBforMySQL/servers/administrators/read | Gets a list of MySQL server administrators. |
> | Microsoft.DBforMySQL/servers/administrators/write | Creates or updates MySQL server administrator with the specified parameters. |
> | Microsoft.DBforMySQL/servers/administrators/delete | Deletes an existing administrator of MySQL server. |
> | Microsoft.DBforMySQL/servers/advisors/read | Return the list of advisors |
> | Microsoft.DBforMySQL/servers/advisors/read | Return an advisor |
> | Microsoft.DBforMySQL/servers/advisors/createRecommendedActionSession/action | Create a new recommendation action session |
> | Microsoft.DBforMySQL/servers/advisors/recommendedActions/read | Return the list of recommended actions |
> | Microsoft.DBforMySQL/servers/advisors/recommendedActions/read | Return a recommended action |
> | Microsoft.DBforMySQL/servers/configurations/read | Return the list of configurations for a server or gets the properties for the specified configuration. |
> | Microsoft.DBforMySQL/servers/configurations/write | Update the value for the specified configuration |
> | Microsoft.DBforMySQL/servers/databases/read | Return the list of MySQL Databases or gets the properties for the specified Database. |
> | Microsoft.DBforMySQL/servers/databases/write | Creates a MySQL Database with the specified parameters or update the properties for the specified Database. |
> | Microsoft.DBforMySQL/servers/databases/delete | Deletes an existing MySQL Database. |
> | Microsoft.DBforMySQL/servers/exports/write |  |
> | Microsoft.DBforMySQL/servers/exports/read |  |
> | Microsoft.DBforMySQL/servers/firewallRules/read | Return the list of firewall rules for a server or gets the properties for the specified firewall rule. |
> | Microsoft.DBforMySQL/servers/firewallRules/write | Creates a firewall rule with the specified parameters or update an existing rule. |
> | Microsoft.DBforMySQL/servers/firewallRules/delete | Deletes an existing firewall rule. |
> | Microsoft.DBforMySQL/servers/keys/read | Return the list of server keys or gets the properties for the specified server key. |
> | Microsoft.DBforMySQL/servers/keys/write | Creates a key with the specified parameters or update the properties or tags for the specified server key. |
> | Microsoft.DBforMySQL/servers/keys/delete | Deletes an existing server key. |
> | Microsoft.DBforMySQL/servers/logFiles/read | Return the list of MySQL LogFiles. |
> | Microsoft.DBforMySQL/servers/performanceTiers/read | Returns the list of Performance Tiers available. |
> | Microsoft.DBforMySQL/servers/privateEndpointConnectionProxies/validate/action | Validates a private endpoint connection create call from NRP side |
> | Microsoft.DBforMySQL/servers/privateEndpointConnectionProxies/read | Returns the list of private endpoint connection proxies or gets the properties for the specified private endpoint connection proxy. |
> | Microsoft.DBforMySQL/servers/privateEndpointConnectionProxies/write | Creates a private endpoint connection proxy with the specified parameters or updates the properties or tags for the specified private endpoint connection proxy. |
> | Microsoft.DBforMySQL/servers/privateEndpointConnectionProxies/delete | Deletes an existing private endpoint connection proxy |
> | Microsoft.DBforMySQL/servers/privateEndpointConnections/read | Returns the list of private endpoint connections or gets the properties for the specified private endpoint connection. |
> | Microsoft.DBforMySQL/servers/privateEndpointConnections/delete | Deletes an existing private endpoint connection |
> | Microsoft.DBforMySQL/servers/privateEndpointConnections/write | Approves or rejects an existing private endpoint connection |
> | Microsoft.DBforMySQL/servers/privateLinkResources/read | Get the private link resources for the corresponding MySQL Server |
> | Microsoft.DBforMySQL/servers/providers/Microsoft.Insights/diagnosticSettings/read | Gets the disagnostic setting for the resource |
> | Microsoft.DBforMySQL/servers/providers/Microsoft.Insights/diagnosticSettings/write | Creates or updates the diagnostic setting for the resource |
> | Microsoft.DBforMySQL/servers/providers/Microsoft.Insights/logDefinitions/read | Gets the available logs for MySQL servers |
> | Microsoft.DBforMySQL/servers/providers/Microsoft.Insights/metricDefinitions/read | Return types of metrics that are available for databases |
> | Microsoft.DBforMySQL/servers/recoverableServers/read | Return the recoverable MySQL Server info |
> | Microsoft.DBforMySQL/servers/replicas/read | Get read replicas of a MySQL server |
> | Microsoft.DBforMySQL/servers/securityAlertPolicies/read | Retrieve details of the server threat detection policy configured on a given server |
> | Microsoft.DBforMySQL/servers/securityAlertPolicies/write | Change the server threat detection policy for a given server |
> | Microsoft.DBforMySQL/servers/securityAlertPolicies/read | Retrieve a list of server threat detection policies configured for a given server |
> | Microsoft.DBforMySQL/servers/topQueryStatistics/read | Return the list of Query Statistics for the top queries. |
> | Microsoft.DBforMySQL/servers/topQueryStatistics/read | Return a Query Statistic |
> | Microsoft.DBforMySQL/servers/virtualNetworkRules/read | Return the list of virtual network rules or gets the properties for the specified virtual network rule. |
> | Microsoft.DBforMySQL/servers/virtualNetworkRules/write | Creates a virtual network rule with the specified parameters or update the properties or tags for the specified virtual network rule. |
> | Microsoft.DBforMySQL/servers/virtualNetworkRules/delete | Deletes an existing Virtual Network Rule |
> | Microsoft.DBforMySQL/servers/waitStatistics/read | Return wait statistics for an instance |
> | Microsoft.DBforMySQL/servers/waitStatistics/read | Return a wait statistic |

## Microsoft.DBforPostgreSQL

Managed PostgreSQL database service for app developers.

Azure service: [Azure Database for PostgreSQL](/azure/postgresql/)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.DBforPostgreSQL/assessForMigration/action | Performs a migration assessment with the specified parameters |
> | Microsoft.DBforPostgreSQL/privateEndpointConnectionsApproval/action | Determines if user is allowed to approve a private endpoint connection |
> | Microsoft.DBforPostgreSQL/register/action | Register PostgreSQL Resource Provider |
> | Microsoft.DBforPostgreSQL/checkNameAvailability/action | Verify whether given server name is available for provisioning worldwide for a given subscription. |
> | Microsoft.DBforPostgreSQL/flexibleServers/read | Return the list of servers or gets the properties for the specified server. |
> | Microsoft.DBforPostgreSQL/flexibleServers/write | Creates a server with the specified parameters or update the properties or tags for the specified server. |
> | Microsoft.DBforPostgreSQL/flexibleServers/delete | Deletes an existing server. |
> | Microsoft.DBforPostgreSQL/flexibleServers/waitStatistics/action |  |
> | Microsoft.DBforPostgreSQL/flexibleServers/resetQueryPerformanceInsightData/action |  |
> | Microsoft.DBforPostgreSQL/flexibleServers/checkMigrationNameAvailability/action | Checks the availability of the given migration name. |
> | Microsoft.DBforPostgreSQL/flexibleServers/administrators/action | Creates a server administrator with the specified parameters or update the properties or tags for the specified server administrator. |
> | Microsoft.DBforPostgreSQL/flexibleServers/restart/action | Restarts an existing server |
> | Microsoft.DBforPostgreSQL/flexibleServers/start/action | Starts an existing server |
> | Microsoft.DBforPostgreSQL/flexibleServers/stop/action | Stops an existing server |
> | Microsoft.DBforPostgreSQL/flexibleServers/getSourceDatabaseList/action |  |
> | Microsoft.DBforPostgreSQL/flexibleServers/testConnectivity/action |  |
> | Microsoft.DBforPostgreSQL/flexibleServers/startLtrBackup/action | Start long term backup for a server |
> | Microsoft.DBforPostgreSQL/flexibleServers/ltrPreBackup/action | Checks if a server is ready for a long term backup |
> | Microsoft.DBforPostgreSQL/flexibleServers/privateEndpointConnectionsApproval/action | Determines if the user is allowed to approve a private endpoint connection |
> | Microsoft.DBforPostgreSQL/flexibleServers/administrators/read | Return the list of server administrators or gets the properties for the specified server administrator. |
> | Microsoft.DBforPostgreSQL/flexibleServers/administrators/delete | Deletes an existing PostgreSQL server administrator. |
> | Microsoft.DBforPostgreSQL/flexibleServers/administrators/write | Creates a server administrator with the specified parameters or update the properties or tags for the specified server administrator. |
> | Microsoft.DBforPostgreSQL/flexibleServers/advancedThreatProtectionSettings/read | Returns the list of Advanced Threat Protection or gets the properties for the specified Advanced Threat Protection. |
> | Microsoft.DBforPostgreSQL/flexibleServers/advancedThreatProtectionSettings/write | Enables/Disables Azure Database for PostgreSQL Flexible Server Advanced Threat Protection |
> | Microsoft.DBforPostgreSQL/flexibleServers/advisors/read |  |
> | Microsoft.DBforPostgreSQL/flexibleServers/advisors/recommendedActions/read |  |
> | Microsoft.DBforPostgreSQL/flexibleServers/backups/read |  |
> | Microsoft.DBforPostgreSQL/flexibleServers/capabilities/read | Gets the capabilities for this subscription in a given location |
> | Microsoft.DBforPostgreSQL/flexibleServers/configurations/read | Returns the list of  PostgreSQL server configurations or gets the configurations for the specified server. |
> | Microsoft.DBforPostgreSQL/flexibleServers/configurations/write | Updates the configuration of a PostgreSQL server. |
> | Microsoft.DBforPostgreSQL/flexibleServers/databases/read | Returns the list of  PostgreSQL server databases or gets the database for the specified server. |
> | Microsoft.DBforPostgreSQL/flexibleServers/databases/write | Creates or Updates the database of a PostgreSQL server. |
> | Microsoft.DBforPostgreSQL/flexibleServers/databases/delete | Delete the database of a PostgreSQL server |
> | Microsoft.DBforPostgreSQL/flexibleServers/firewallRules/write | Creates a firewall rule with the specified parameters or update an existing rule. |
> | Microsoft.DBforPostgreSQL/flexibleServers/firewallRules/read | Return the list of firewall rules for a server or gets the properties for the specified firewall rule. |
> | Microsoft.DBforPostgreSQL/flexibleServers/firewallRules/delete | Deletes an existing firewall rule. |
> | Microsoft.DBforPostgreSQL/flexibleServers/logFiles/read | Return a list of server log Files for a PostgreSQL Flexible server with File download links |
> | Microsoft.DBforPostgreSQL/flexibleServers/ltrBackupOperations/read | Returns the PostgreSQL server long term backup operation tracking by backup name. |
> | Microsoft.DBforPostgreSQL/flexibleServers/ltrBackupOperations/read | Returns the list of  PostgreSQL server long term backup operation tracking. |
> | Microsoft.DBforPostgreSQL/flexibleServers/migrations/write | Creates a migration with the specified parameters. |
> | Microsoft.DBforPostgreSQL/flexibleServers/migrations/read | Gets the properties for the specified migration workflow. |
> | Microsoft.DBforPostgreSQL/flexibleServers/migrations/read | List of migration workflows for the specified database server. |
> | Microsoft.DBforPostgreSQL/flexibleServers/migrations/write | Update the properties for the specified migration. |
> | Microsoft.DBforPostgreSQL/flexibleServers/migrations/delete | Deletes an existing migration workflow. |
> | Microsoft.DBforPostgreSQL/flexibleServers/privateEndpointConnectionProxies/read | Returns the list of private endpoint connection proxies or gets the properties for the specified private endpoint connection proxy. |
> | Microsoft.DBforPostgreSQL/flexibleServers/privateEndpointConnectionProxies/delete | Deletes an existing private endpoint connection proxy resource. |
> | Microsoft.DBforPostgreSQL/flexibleServers/privateEndpointConnectionProxies/write | Creates a private endpoint connection proxy with the specified parameters or updates the properties or tags for the specified private endpoint connection proxy |
> | Microsoft.DBforPostgreSQL/flexibleServers/privateEndpointConnectionProxies/validate/action | Validates a private endpoint connection create call from NRP side |
> | Microsoft.DBforPostgreSQL/flexibleServers/privateEndpointConnections/read | Returns the list of private endpoint connections or gets the properties for the specified private endpoint connection. |
> | Microsoft.DBforPostgreSQL/flexibleServers/privateEndpointConnections/delete | Deletes an existing private endpoint connection |
> | Microsoft.DBforPostgreSQL/flexibleServers/privateEndpointConnections/write | Approves or rejects an existing private endpoint connection |
> | Microsoft.DBforPostgreSQL/flexibleServers/privateLinkResources/read | Return a list containing private link resource or gets the specified private link resource. |
> | Microsoft.DBforPostgreSQL/flexibleServers/providers/Microsoft.Insights/diagnosticSettings/read | Gets the disagnostic setting for the resource |
> | Microsoft.DBforPostgreSQL/flexibleServers/providers/Microsoft.Insights/diagnosticSettings/write | Creates or updates the diagnostic setting for the resource |
> | Microsoft.DBforPostgreSQL/flexibleServers/providers/Microsoft.Insights/logDefinitions/read | Gets the available logs for PostgreSQL servers |
> | Microsoft.DBforPostgreSQL/flexibleServers/providers/Microsoft.Insights/metricDefinitions/read | Return types of metrics that are available for databases |
> | Microsoft.DBforPostgreSQL/flexibleServers/queryStatistics/read |  |
> | Microsoft.DBforPostgreSQL/flexibleServers/queryTexts/read |  |
> | Microsoft.DBforPostgreSQL/flexibleServers/replicas/read |  |
> | Microsoft.DBforPostgreSQL/flexibleServers/topQueryStatistics/read |  |
> | Microsoft.DBforPostgreSQL/flexibleServers/virtualendpoints/write | Creates or Updates VirtualEndpoint |
> | Microsoft.DBforPostgreSQL/flexibleServers/virtualendpoints/write | Patches the VirtualEndpoint. Currently patch does a full replace |
> | Microsoft.DBforPostgreSQL/flexibleServers/virtualendpoints/delete | Deletes the VirtualEndpoint |
> | Microsoft.DBforPostgreSQL/flexibleServers/virtualendpoints/read | Gets the VirtualEndpoint details |
> | Microsoft.DBforPostgreSQL/flexibleServers/virtualendpoints/read | Lists the VirtualEndpoints |
> | Microsoft.DBforPostgreSQL/locations/administratorAzureAsyncOperation/read | Gets in-progress operations on PostgreSQL server administrators |
> | Microsoft.DBforPostgreSQL/locations/administratorOperationResults/read | Return PostgreSQL Server administrator operation results |
> | Microsoft.DBforPostgreSQL/locations/azureAsyncOperation/read | Return PostgreSQL Server Operation Results |
> | Microsoft.DBforPostgreSQL/locations/capabilities/read | Gets the capabilities for this subscription in a given location |
> | Microsoft.DBforPostgreSQL/locations/capabilities/{serverName}/read | Gets the capabilities for this subscription in a given location |
> | Microsoft.DBforPostgreSQL/locations/operationResults/read | Return ResourceGroup based PostgreSQL Server Operation Results |
> | Microsoft.DBforPostgreSQL/locations/operationResults/read | Return PostgreSQL Server Operation Results |
> | Microsoft.DBforPostgreSQL/locations/performanceTiers/read | Returns the list of Performance Tiers available. |
> | Microsoft.DBforPostgreSQL/locations/privateEndpointConnectionAzureAsyncOperation/read | Gets the result for a private endpoint connection operation |
> | Microsoft.DBforPostgreSQL/locations/privateEndpointConnectionOperationResults/read | Gets the result for a private endpoint connection operation |
> | Microsoft.DBforPostgreSQL/locations/privateEndpointConnectionProxyAzureAsyncOperation/read | Gets the result for a private endpoint connection proxy operation |
> | Microsoft.DBforPostgreSQL/locations/privateEndpointConnectionProxyOperationResults/read | Gets the result for a private endpoint connection proxy operation |
> | Microsoft.DBforPostgreSQL/locations/resourceType/usages/read | Gets the quota usages of a subscription |
> | Microsoft.DBforPostgreSQL/locations/securityAlertPoliciesAzureAsyncOperation/read | Return the list of Server threat detection operation result. |
> | Microsoft.DBforPostgreSQL/locations/securityAlertPoliciesOperationResults/read | Return the list of Server threat detection operation result. |
> | Microsoft.DBforPostgreSQL/locations/serverKeyAzureAsyncOperation/read | Gets in-progress operations on data encryption server keys |
> | Microsoft.DBforPostgreSQL/locations/serverKeyOperationResults/read | Gets in-progress operations on data encryption server keys |
> | Microsoft.DBforPostgreSQL/operations/read | Return the list of PostgreSQL Operations. |
> | Microsoft.DBforPostgreSQL/performanceTiers/read | Returns the list of Performance Tiers available. |
> | Microsoft.DBforPostgreSQL/serverGroupsv2/privateEndpointConnectionsApproval/action | Determines if user is allowed to approve a private endpoint connection for PostgreSQL SGv2 |
> | Microsoft.DBforPostgreSQL/serverGroupsv2/privateEndpointConnectionProxies/read | Returns the list of private endpoint connections or gets the properties for the specified private endpoint connection via proxy |
> | Microsoft.DBforPostgreSQL/serverGroupsv2/privateEndpointConnectionProxies/write | Creates a private endpoint connection with the specified parameters or updates the properties or tags for the specified private endpoint connection via proxy |
> | Microsoft.DBforPostgreSQL/serverGroupsv2/privateEndpointConnectionProxies/delete | Deletes an existing private endpoint connection via proxy |
> | Microsoft.DBforPostgreSQL/serverGroupsv2/privateEndpointConnectionProxies/validate/action | Validates a private endpoint connection creation by NRP |
> | Microsoft.DBforPostgreSQL/serverGroupsv2/privateEndpointConnections/read | Returns the list of private endpoint connections or gets the properties for the specified private endpoint connection |
> | Microsoft.DBforPostgreSQL/serverGroupsv2/privateEndpointConnections/write | Approves or rejects an existing private endpoint connection |
> | Microsoft.DBforPostgreSQL/serverGroupsv2/privateEndpointConnections/delete | Deletes an existing private endpoint connection |
> | Microsoft.DBforPostgreSQL/serverGroupsv2/privateLinkResources/read | Get the private link resources for the corresponding PostgreSQL SGv2 |
> | Microsoft.DBforPostgreSQL/servers/queryTexts/action | Return the text of a query |
> | Microsoft.DBforPostgreSQL/servers/resetQueryPerformanceInsightData/action | Reset Query Performance Insight data |
> | Microsoft.DBforPostgreSQL/servers/privateEndpointConnectionsApproval/action | Determines if user is allowed to approve a private endpoint connection |
> | Microsoft.DBforPostgreSQL/servers/read | Return the list of servers or gets the properties for the specified server. |
> | Microsoft.DBforPostgreSQL/servers/write | Creates a server with the specified parameters or update the properties or tags for the specified server. |
> | Microsoft.DBforPostgreSQL/servers/delete | Deletes an existing server. |
> | Microsoft.DBforPostgreSQL/servers/restart/action | Restarts a specific server. |
> | Microsoft.DBforPostgreSQL/servers/updateConfigurations/action | Update configurations for the specified server |
> | Microsoft.DBforPostgreSQL/servers/administrators/read | Gets a list of PostgreSQL server administrators. |
> | Microsoft.DBforPostgreSQL/servers/administrators/write | Creates or updates PostgreSQL server administrator with the specified parameters. |
> | Microsoft.DBforPostgreSQL/servers/administrators/delete | Deletes an existing administrator of PostgreSQL server. |
> | Microsoft.DBforPostgreSQL/servers/advisors/read | Return the list of advisors |
> | Microsoft.DBforPostgreSQL/servers/advisors/recommendedActionSessions/action | Make recommendations |
> | Microsoft.DBforPostgreSQL/servers/advisors/recommendedActions/read | Return the list of recommended actions |
> | Microsoft.DBforPostgreSQL/servers/configurations/read | Return the list of configurations for a server or gets the properties for the specified configuration. |
> | Microsoft.DBforPostgreSQL/servers/configurations/write | Update the value for the specified configuration |
> | Microsoft.DBforPostgreSQL/servers/databases/read | Return the list of PostgreSQL Databases or gets the properties for the specified Database. |
> | Microsoft.DBforPostgreSQL/servers/databases/write | Creates a PostgreSQL Database with the specified parameters or update the properties for the specified Database. |
> | Microsoft.DBforPostgreSQL/servers/databases/delete | Deletes an existing PostgreSQL Database. |
> | Microsoft.DBforPostgreSQL/servers/firewallRules/read | Return the list of firewall rules for a server or gets the properties for the specified firewall rule. |
> | Microsoft.DBforPostgreSQL/servers/firewallRules/write | Creates a firewall rule with the specified parameters or update an existing rule. |
> | Microsoft.DBforPostgreSQL/servers/firewallRules/delete | Deletes an existing firewall rule. |
> | Microsoft.DBforPostgreSQL/servers/keys/read | Return the list of server keys or gets the properties for the specified server key. |
> | Microsoft.DBforPostgreSQL/servers/keys/write | Creates a key with the specified parameters or update the properties or tags for the specified server key. |
> | Microsoft.DBforPostgreSQL/servers/keys/delete | Deletes an existing server key. |
> | Microsoft.DBforPostgreSQL/servers/logFiles/read | Return the list of PostgreSQL LogFiles. |
> | Microsoft.DBforPostgreSQL/servers/performanceTiers/read | Returns the list of Performance Tiers available. |
> | Microsoft.DBforPostgreSQL/servers/privateEndpointConnectionProxies/validate/action | Validates a private endpoint connection create call from NRP side |
> | Microsoft.DBforPostgreSQL/servers/privateEndpointConnectionProxies/read | Returns the list of private endpoint connection proxies or gets the properties for the specified private endpoint connection proxy. |
> | Microsoft.DBforPostgreSQL/servers/privateEndpointConnectionProxies/write | Creates a private endpoint connection proxy with the specified parameters or updates the properties or tags for the specified private endpoint connection proxy. |
> | Microsoft.DBforPostgreSQL/servers/privateEndpointConnectionProxies/delete | Deletes an existing private endpoint connection proxy |
> | Microsoft.DBforPostgreSQL/servers/privateEndpointConnections/read | Returns the list of private endpoint connections or gets the properties for the specified private endpoint connection. |
> | Microsoft.DBforPostgreSQL/servers/privateEndpointConnections/delete | Deletes an existing private endpoint connection |
> | Microsoft.DBforPostgreSQL/servers/privateEndpointConnections/write | Approves or rejects an existing private endpoint connection |
> | Microsoft.DBforPostgreSQL/servers/privateLinkResources/read | Get the private link resources for the corresponding PostgreSQL Server |
> | Microsoft.DBforPostgreSQL/servers/providers/Microsoft.Insights/diagnosticSettings/read | Gets the disagnostic setting for the resource |
> | Microsoft.DBforPostgreSQL/servers/providers/Microsoft.Insights/diagnosticSettings/write | Creates or updates the diagnostic setting for the resource |
> | Microsoft.DBforPostgreSQL/servers/providers/Microsoft.Insights/logDefinitions/read | Gets the available logs for PostgreSQL servers |
> | Microsoft.DBforPostgreSQL/servers/providers/Microsoft.Insights/metricDefinitions/read | Return types of metrics that are available for databases |
> | Microsoft.DBforPostgreSQL/servers/queryTexts/read | Return the texts for a list of queries |
> | Microsoft.DBforPostgreSQL/servers/recoverableServers/read | Return the recoverable PostgreSQL Server info |
> | Microsoft.DBforPostgreSQL/servers/replicas/read | Get read replicas of a PostgreSQL server |
> | Microsoft.DBforPostgreSQL/servers/securityAlertPolicies/read | Retrieve details of the server threat detection policy configured on a given server |
> | Microsoft.DBforPostgreSQL/servers/securityAlertPolicies/write | Change the server threat detection policy for a given server |
> | Microsoft.DBforPostgreSQL/servers/topQueryStatistics/read | Return the list of Query Statistics for the top queries. |
> | Microsoft.DBforPostgreSQL/servers/virtualNetworkRules/read | Return the list of virtual network rules or gets the properties for the specified virtual network rule. |
> | Microsoft.DBforPostgreSQL/servers/virtualNetworkRules/write | Creates a virtual network rule with the specified parameters or update the properties or tags for the specified virtual network rule. |
> | Microsoft.DBforPostgreSQL/servers/virtualNetworkRules/delete | Deletes an existing Virtual Network Rule |
> | Microsoft.DBforPostgreSQL/servers/waitStatistics/read | Return wait statistics for an instance |
> | Microsoft.DBforPostgreSQL/serversv2/read | Return the list of servers or gets the properties for the specified server. |
> | Microsoft.DBforPostgreSQL/serversv2/write | Creates a server with the specified parameters or update the properties or tags for the specified server. |
> | Microsoft.DBforPostgreSQL/serversv2/delete | Deletes an existing server. |
> | Microsoft.DBforPostgreSQL/serversv2/updateConfigurations/action | Update configurations for the specified server |
> | Microsoft.DBforPostgreSQL/serversv2/configurations/read | Return the list of configurations for a server or gets the properties for the specified configuration. |
> | Microsoft.DBforPostgreSQL/serversv2/configurations/write | Update the value for the specified configuration |
> | Microsoft.DBforPostgreSQL/serversv2/firewallRules/read | Return the list of firewall rules for a server or gets the properties for the specified firewall rule. |
> | Microsoft.DBforPostgreSQL/serversv2/firewallRules/write | Creates a firewall rule with the specified parameters or update an existing rule. |
> | Microsoft.DBforPostgreSQL/serversv2/firewallRules/delete | Deletes an existing firewall rule. |
> | Microsoft.DBforPostgreSQL/serversv2/providers/Microsoft.Insights/diagnosticSettings/read | Gets the disagnostic setting for the resource |
> | Microsoft.DBforPostgreSQL/serversv2/providers/Microsoft.Insights/diagnosticSettings/write | Creates or updates the diagnostic setting for the resource |
> | Microsoft.DBforPostgreSQL/serversv2/providers/Microsoft.Insights/logDefinitions/read | Gets the available logs for PostgreSQL servers |
> | Microsoft.DBforPostgreSQL/serversv2/providers/Microsoft.Insights/metricDefinitions/read | Return types of metrics that are available for databases |

## Microsoft.DocumentDB

A NoSQL document database-as-a-service.

Azure service: [Azure Cosmos DB](/azure/cosmos-db/)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.DocumentDB/register/action |  Register the Microsoft DocumentDB resource provider for the subscription |
> | Microsoft.DocumentDB/cassandraClusters/read | Read a managed Cassandra cluster or list all managed Cassandra clusters |
> | Microsoft.DocumentDB/cassandraClusters/write | Create or update a managed Cassandra cluster |
> | Microsoft.DocumentDB/cassandraClusters/delete | Delete a managed Cassandra cluster |
> | Microsoft.DocumentDB/cassandraClusters/repair/action | Request a repair of a managed Cassandra keyspace |
> | Microsoft.DocumentDB/cassandraClusters/fetchNodeStatus/action | Asynchronously fetch node status of all nodes in a managed Cassandra cluster |
> | Microsoft.DocumentDB/cassandraClusters/dataCenters/read | Read a data center in a managed Cassandra cluster or list all data centers in a managed Cassandra cluster |
> | Microsoft.DocumentDB/cassandraClusters/dataCenters/write | Create or update a data center in a managed Cassandra cluster |
> | Microsoft.DocumentDB/cassandraClusters/dataCenters/delete | Delete a data center in a managed Cassandra cluster |
> | Microsoft.DocumentDB/databaseAccountNames/read | Checks for name availability. |
> | Microsoft.DocumentDB/databaseAccounts/read | Reads a database account. |
> | Microsoft.DocumentDB/databaseAccounts/write | Update a database accounts. |
> | Microsoft.DocumentDB/databaseAccounts/listKeys/action | List keys of a database account |
> | Microsoft.DocumentDB/databaseAccounts/readonlykeys/action | Reads the database account readonly keys. |
> | Microsoft.DocumentDB/databaseAccounts/regenerateKey/action | Rotate keys of a database account |
> | Microsoft.DocumentDB/databaseAccounts/listConnectionStrings/action | Get the connection strings for a database account |
> | Microsoft.DocumentDB/databaseAccounts/changeResourceGroup/action | Change resource group of a database account |
> | Microsoft.DocumentDB/databaseAccounts/failoverPriorityChange/action | Change failover priorities of regions of a database account. This is used to perform manual failover operation |
> | Microsoft.DocumentDB/databaseAccounts/offlineRegion/action | Offline a region of a database account.  |
> | Microsoft.DocumentDB/databaseAccounts/onlineRegion/action | Online a region of a database account. |
> | Microsoft.DocumentDB/databaseAccounts/refreshDelegatedResourceIdentity/action | Update existing delegate resources on database account. |
> | Microsoft.DocumentDB/databaseAccounts/delete | Deletes the database accounts. |
> | Microsoft.DocumentDB/databaseAccounts/getBackupPolicy/action | Get the backup policy of database account |
> | Microsoft.DocumentDB/databaseAccounts/PrivateEndpointConnectionsApproval/action | Manage a private endpoint connection of Database Account |
> | Microsoft.DocumentDB/databaseAccounts/joinPerimeter/action | Joins a database account to a Network Security Perimeter |
> | Microsoft.DocumentDB/databaseAccounts/restore/action | Submit a restore request |
> | Microsoft.DocumentDB/databaseAccounts/backup/action | Submit a request to configure backup |
> | Microsoft.DocumentDB/databaseAccounts/apis/databases/write | (Deprecated. Please use resource paths without '/apis/' segment) Create a database. Only applicable to API types: 'sql', 'mongodb', 'gremlin'. |
> | Microsoft.DocumentDB/databaseAccounts/apis/databases/read | (Deprecated. Please use resource paths without '/apis/' segment) Read a database or list all the databases. Only applicable to API types: 'sql', 'mongodb', 'gremlin'. |
> | Microsoft.DocumentDB/databaseAccounts/apis/databases/delete | (Deprecated. Please use resource paths without '/apis/' segment) Delete a database. Only applicable to API types: 'sql', 'mongodb', 'gremlin'. |
> | Microsoft.DocumentDB/databaseAccounts/apis/databases/collections/write | (Deprecated. Please use resource paths without '/apis/' segment) Create or update a collection. Only applicable to API types: 'mongodb'. |
> | Microsoft.DocumentDB/databaseAccounts/apis/databases/collections/read | (Deprecated. Please use resource paths without '/apis/' segment) Read a collection or list all the collections. Only applicable to API types: 'mongodb'. |
> | Microsoft.DocumentDB/databaseAccounts/apis/databases/collections/delete | (Deprecated. Please use resource paths without '/apis/' segment) Delete a collection. Only applicable to API types: 'mongodb'. |
> | Microsoft.DocumentDB/databaseAccounts/apis/databases/collections/operationResults/read | (Deprecated. Please use resource paths without '/apis/' segment) Read status of the asynchronous operation. Only applicable to API types: 'mongodb'. |
> | Microsoft.DocumentDB/databaseAccounts/apis/databases/collections/settings/write | (Deprecated. Please use resource paths without '/apis/' segment) Update a collection throughput. Only applicable to API types: 'mongodb'. Only applicable for setting types: 'throughput'. |
> | Microsoft.DocumentDB/databaseAccounts/apis/databases/collections/settings/read | (Deprecated. Please use resource paths without '/apis/' segment) Read a collection throughput. Only applicable to API types: 'mongodb'. Only applicable for setting types: 'throughput'. |
> | Microsoft.DocumentDB/databaseAccounts/apis/databases/collections/settings/operationResults/read | (Deprecated. Please use resource paths without '/apis/' segment) Read status of the asynchronous operation. Only applicable to API types: 'mongodb'. Only applicable for setting types: 'throughput'. |
> | Microsoft.DocumentDB/databaseAccounts/apis/databases/containers/write | (Deprecated. Please use resource paths without '/apis/' segment) Create or update a container. Only applicable to API types: 'sql'. |
> | Microsoft.DocumentDB/databaseAccounts/apis/databases/containers/read | (Deprecated. Please use resource paths without '/apis/' segment) Read a container or list all the containers. Only applicable to API types: 'sql'. |
> | Microsoft.DocumentDB/databaseAccounts/apis/databases/containers/delete | (Deprecated. Please use resource paths without '/apis/' segment) Delete a container. Only applicable to API types: 'sql'. |
> | Microsoft.DocumentDB/databaseAccounts/apis/databases/containers/operationResults/read | (Deprecated. Please use resource paths without '/apis/' segment) Read status of the asynchronous operation. Only applicable to API types: 'sql'. |
> | Microsoft.DocumentDB/databaseAccounts/apis/databases/containers/settings/write | (Deprecated. Please use resource paths without '/apis/' segment) Update a container throughput. Only applicable to API types: 'sql'. Only applicable for setting types: 'throughput'. |
> | Microsoft.DocumentDB/databaseAccounts/apis/databases/containers/settings/read | (Deprecated. Please use resource paths without '/apis/' segment) Read a container throughput. Only applicable to API types: 'sql'. Only applicable for setting types: 'throughput'. |
> | Microsoft.DocumentDB/databaseAccounts/apis/databases/containers/settings/operationResults/read | (Deprecated. Please use resource paths without '/apis/' segment) Read status of the asynchronous operation. Only applicable to API types: 'sql'. Only applicable for setting types: 'throughput'. |
> | Microsoft.DocumentDB/databaseAccounts/apis/databases/graphs/write | (Deprecated. Please use resource paths without '/apis/' segment) Create or update a graph. Only applicable to API types: 'gremlin'. |
> | Microsoft.DocumentDB/databaseAccounts/apis/databases/graphs/read | (Deprecated. Please use resource paths without '/apis/' segment) Read a graph or list all the graphs. Only applicable to API types: 'gremlin'. |
> | Microsoft.DocumentDB/databaseAccounts/apis/databases/graphs/delete | (Deprecated. Please use resource paths without '/apis/' segment) Delete a graph. Only applicable to API types: 'gremlin'. |
> | Microsoft.DocumentDB/databaseAccounts/apis/databases/graphs/operationResults/read | (Deprecated. Please use resource paths without '/apis/' segment) Read status of the asynchronous operation. Only applicable to API types: 'gremlin'. |
> | Microsoft.DocumentDB/databaseAccounts/apis/databases/graphs/settings/write | (Deprecated. Please use resource paths without '/apis/' segment) Update a graph throughput. Only applicable to API types: 'gremlin'. Only applicable for setting types: 'throughput'. |
> | Microsoft.DocumentDB/databaseAccounts/apis/databases/graphs/settings/read | (Deprecated. Please use resource paths without '/apis/' segment) Read a graph throughput. Only applicable to API types: 'gremlin'. Only applicable for setting types: 'throughput'. |
> | Microsoft.DocumentDB/databaseAccounts/apis/databases/graphs/settings/operationResults/read | (Deprecated. Please use resource paths without '/apis/' segment) Read status of the asynchronous operation. Only applicable to API types: 'gremlin'. Only applicable for setting types: 'throughput'. |
> | Microsoft.DocumentDB/databaseAccounts/apis/databases/operationResults/read | (Deprecated. Please use resource paths without '/apis/' segment) Read status of the asynchronous operation. Only applicable to API types: 'sql', 'mongodb', 'gremlin'. |
> | Microsoft.DocumentDB/databaseAccounts/apis/databases/settings/write | (Deprecated. Please use resource paths without '/apis/' segment) Update a database throughput. Only applicable to API types: 'sql', 'mongodb', 'gremlin'. Only applicable for setting types: 'throughput'. |
> | Microsoft.DocumentDB/databaseAccounts/apis/databases/settings/read | (Deprecated. Please use resource paths without '/apis/' segment) Read a database throughput. Only applicable to API types: 'sql', 'mongodb', 'gremlin'. Only applicable for setting types: 'throughput'. |
> | Microsoft.DocumentDB/databaseAccounts/apis/databases/settings/operationResults/read | (Deprecated. Please use resource paths without '/apis/' segment) Read status of the asynchronous operation. Only applicable to API types: 'sql', 'mongodb', 'gremlin'. Only applicable for setting types: 'throughput'. |
> | Microsoft.DocumentDB/databaseAccounts/apis/keyspaces/write | (Deprecated. Please use resource paths without '/apis/' segment) Create a keyspace. Only applicable to API types: 'cassandra'. |
> | Microsoft.DocumentDB/databaseAccounts/apis/keyspaces/read | (Deprecated. Please use resource paths without '/apis/' segment) Read a keyspace or list all the keyspaces. Only applicable to API types: 'cassandra'. |
> | Microsoft.DocumentDB/databaseAccounts/apis/keyspaces/delete | (Deprecated. Please use resource paths without '/apis/' segment) Delete a keyspace. Only applicable to API types: 'cassandra'. |
> | Microsoft.DocumentDB/databaseAccounts/apis/keyspaces/operationResults/read | (Deprecated. Please use resource paths without '/apis/' segment) Read status of the asynchronous operation. Only applicable to API types: 'cassandra'. |
> | Microsoft.DocumentDB/databaseAccounts/apis/keyspaces/settings/write | (Deprecated. Please use resource paths without '/apis/' segment) Update a keyspace throughput. Only applicable to API types: 'cassandra'. Only applicable for setting types: 'throughput'. |
> | Microsoft.DocumentDB/databaseAccounts/apis/keyspaces/settings/read | (Deprecated. Please use resource paths without '/apis/' segment) Read a keyspace throughput. Only applicable to API types: 'cassandra'. Only applicable for setting types: 'throughput'. |
> | Microsoft.DocumentDB/databaseAccounts/apis/keyspaces/settings/operationResults/read | (Deprecated. Please use resource paths without '/apis/' segment) Read status of the asynchronous operation. Only applicable to API types: 'cassandra'. Only applicable for setting types: 'throughput'. |
> | Microsoft.DocumentDB/databaseAccounts/apis/keyspaces/tables/write | (Deprecated. Please use resource paths without '/apis/' segment) Create or update a table. Only applicable to API types: 'cassandra'. |
> | Microsoft.DocumentDB/databaseAccounts/apis/keyspaces/tables/read | (Deprecated. Please use resource paths without '/apis/' segment) Read a table or list all the tables. Only applicable to API types: 'cassandra'. |
> | Microsoft.DocumentDB/databaseAccounts/apis/keyspaces/tables/delete | (Deprecated. Please use resource paths without '/apis/' segment) Delete a table. Only applicable to API types: 'cassandra'. |
> | Microsoft.DocumentDB/databaseAccounts/apis/keyspaces/tables/operationResults/read | (Deprecated. Please use resource paths without '/apis/' segment) Read status of the asynchronous operation. Only applicable to API types: 'cassandra'. |
> | Microsoft.DocumentDB/databaseAccounts/apis/keyspaces/tables/settings/write | (Deprecated. Please use resource paths without '/apis/' segment) Update a table throughput. Only applicable to API types: 'cassandra'. Only applicable for setting types: 'throughput'. |
> | Microsoft.DocumentDB/databaseAccounts/apis/keyspaces/tables/settings/read | (Deprecated. Please use resource paths without '/apis/' segment) Read a table throughput. Only applicable to API types: 'cassandra'. Only applicable for setting types: 'throughput'. |
> | Microsoft.DocumentDB/databaseAccounts/apis/keyspaces/tables/settings/operationResults/read | (Deprecated. Please use resource paths without '/apis/' segment) Read status of the asynchronous operation. Only applicable to API types: 'cassandra'. Only applicable for setting types: 'throughput'. |
> | Microsoft.DocumentDB/databaseAccounts/apis/tables/write | (Deprecated. Please use resource paths without '/apis/' segment) Create or update a table. Only applicable to API types: 'table'. |
> | Microsoft.DocumentDB/databaseAccounts/apis/tables/read | (Deprecated. Please use resource paths without '/apis/' segment) Read a table or list all the tables. Only applicable to API types: 'table'. |
> | Microsoft.DocumentDB/databaseAccounts/apis/tables/delete | (Deprecated. Please use resource paths without '/apis/' segment) Delete a table. Only applicable to API types: 'table'. |
> | Microsoft.DocumentDB/databaseAccounts/apis/tables/operationResults/read | (Deprecated. Please use resource paths without '/apis/' segment) Read status of the asynchronous operation. Only applicable to API types: 'table'. |
> | Microsoft.DocumentDB/databaseAccounts/apis/tables/settings/write | (Deprecated. Please use resource paths without '/apis/' segment) Update a table throughput. Only applicable to API types: 'table'. Only applicable for setting types: 'throughput'. |
> | Microsoft.DocumentDB/databaseAccounts/apis/tables/settings/read | (Deprecated. Please use resource paths without '/apis/' segment) Read a table throughput. Only applicable to API types: 'table'. Only applicable for setting types: 'throughput'. |
> | Microsoft.DocumentDB/databaseAccounts/apis/tables/settings/operationResults/read | (Deprecated. Please use resource paths without '/apis/' segment) Read status of the asynchronous operation. Only applicable to API types: 'table'. Only applicable for setting types: 'throughput'. |
> | Microsoft.DocumentDB/databaseAccounts/cassandraKeyspaces/write | Create a Cassandra keyspace. |
> | Microsoft.DocumentDB/databaseAccounts/cassandraKeyspaces/read | Read a Cassandra keyspace or list all the Cassandra keyspaces. |
> | Microsoft.DocumentDB/databaseAccounts/cassandraKeyspaces/delete | Delete a Cassandra keyspace. |
> | Microsoft.DocumentDB/databaseAccounts/cassandraKeyspaces/operationResults/read | Read status of the asynchronous operation. |
> | Microsoft.DocumentDB/databaseAccounts/cassandraKeyspaces/tables/write | Create or update a Cassandra table. |
> | Microsoft.DocumentDB/databaseAccounts/cassandraKeyspaces/tables/read | Read a Cassandra table or list all the Cassandra tables. |
> | Microsoft.DocumentDB/databaseAccounts/cassandraKeyspaces/tables/delete | Delete a Cassandra table. |
> | Microsoft.DocumentDB/databaseAccounts/cassandraKeyspaces/tables/operationResults/read | Read status of the asynchronous operation. |
> | Microsoft.DocumentDB/databaseAccounts/cassandraKeyspaces/tables/throughputSettings/write | Update a Cassandra table throughput. |
> | Microsoft.DocumentDB/databaseAccounts/cassandraKeyspaces/tables/throughputSettings/read | Read a Cassandra table throughput. |
> | Microsoft.DocumentDB/databaseAccounts/cassandraKeyspaces/tables/throughputSettings/migrateToAutoscale/action | Migrate Cassandra table offer to autoscale. |
> | Microsoft.DocumentDB/databaseAccounts/cassandraKeyspaces/tables/throughputSettings/migrateToManualThroughput/action | Migrate Cassandra table offer to manual throughput. |
> | Microsoft.DocumentDB/databaseAccounts/cassandraKeyspaces/tables/throughputSettings/migrateToAutoscale/operationResults/read | Read status of the asynchronous operation. |
> | Microsoft.DocumentDB/databaseAccounts/cassandraKeyspaces/tables/throughputSettings/migrateToManualThroughput/operationResults/read | Read status of the asynchronous operation. |
> | Microsoft.DocumentDB/databaseAccounts/cassandraKeyspaces/tables/throughputSettings/operationResults/read | Read status of the asynchronous operation. |
> | Microsoft.DocumentDB/databaseAccounts/cassandraKeyspaces/throughputSettings/write | Update a Cassandra keyspace throughput. |
> | Microsoft.DocumentDB/databaseAccounts/cassandraKeyspaces/throughputSettings/read | Read a Cassandra keyspace throughput. |
> | Microsoft.DocumentDB/databaseAccounts/cassandraKeyspaces/throughputSettings/migrateToAutoscale/action | Migrate Cassandra keyspace offer to autoscale. |
> | Microsoft.DocumentDB/databaseAccounts/cassandraKeyspaces/throughputSettings/migrateToManualThroughput/action | Migrate Cassandra keyspace offer to manual throughput. |
> | Microsoft.DocumentDB/databaseAccounts/cassandraKeyspaces/throughputSettings/migrateToAutoscale/operationResults/read | Read status of the asynchronous operation. |
> | Microsoft.DocumentDB/databaseAccounts/cassandraKeyspaces/throughputSettings/migrateToManualThroughput/operationResults/read | Read status of the asynchronous operation. |
> | Microsoft.DocumentDB/databaseAccounts/cassandraKeyspaces/throughputSettings/operationResults/read | Read status of the asynchronous operation. |
> | Microsoft.DocumentDB/databaseAccounts/cassandraKeyspaces/views/write | Create or update a Cassandra view. |
> | Microsoft.DocumentDB/databaseAccounts/cassandraKeyspaces/views/read | Read a Cassandra table or list all the Cassandra views. |
> | Microsoft.DocumentDB/databaseAccounts/cassandraKeyspaces/views/delete | Delete a Cassandra view. |
> | Microsoft.DocumentDB/databaseAccounts/cassandraKeyspaces/views/operationResults/read | Read status of the asynchronous operation. |
> | Microsoft.DocumentDB/databaseAccounts/cassandraKeyspaces/views/throughputSettings/write | Update a Cassandra view throughput. |
> | Microsoft.DocumentDB/databaseAccounts/cassandraKeyspaces/views/throughputSettings/read | Read a Cassandra view throughput. |
> | Microsoft.DocumentDB/databaseAccounts/cassandraKeyspaces/views/throughputSettings/migrateToAutoscale/action | Migrate Cassandra view offer to autoscale. |
> | Microsoft.DocumentDB/databaseAccounts/cassandraKeyspaces/views/throughputSettings/migrateToManualThroughput/action | Migrate Cassandra view offer to manual throughput. |
> | Microsoft.DocumentDB/databaseAccounts/cassandraKeyspaces/views/throughputSettings/migrateToAutoscale/operationResults/read | Read status of the asynchronous operation. |
> | Microsoft.DocumentDB/databaseAccounts/cassandraKeyspaces/views/throughputSettings/migrateToManualThroughput/operationResults/read | Read status of the asynchronous operation. |
> | Microsoft.DocumentDB/databaseAccounts/cassandraKeyspaces/views/throughputSettings/operationResults/read | Read status of the asynchronous operation. |
> | Microsoft.DocumentDB/databaseAccounts/databases/collections/metricDefinitions/read | Reads the collection metric definitions. |
> | Microsoft.DocumentDB/databaseAccounts/databases/collections/metrics/read | Reads the collection metrics. |
> | Microsoft.DocumentDB/databaseAccounts/databases/collections/partitionKeyRangeId/metrics/read | Read database account partition key level metrics |
> | Microsoft.DocumentDB/databaseAccounts/databases/collections/partitions/read | Read database account partitions in a collection |
> | Microsoft.DocumentDB/databaseAccounts/databases/collections/partitions/metrics/read | Read database account partition level metrics |
> | Microsoft.DocumentDB/databaseAccounts/databases/collections/partitions/usages/read | Read database account partition level usages |
> | Microsoft.DocumentDB/databaseAccounts/databases/collections/usages/read | Reads the collection usages. |
> | Microsoft.DocumentDB/databaseAccounts/databases/metricDefinitions/read | Reads the database metric definitions |
> | Microsoft.DocumentDB/databaseAccounts/databases/metrics/read | Reads the database metrics. |
> | Microsoft.DocumentDB/databaseAccounts/databases/usages/read | Reads the database usages. |
> | Microsoft.DocumentDB/databaseAccounts/dataTransferJobs/read | Read container copy job or List all container copy jobs in a database account |
> | Microsoft.DocumentDB/databaseAccounts/dataTransferJobs/write | Create container copy job in a database account |
> | Microsoft.DocumentDB/databaseAccounts/dataTransferJobs/pause/action | Pause a container copy job in a database account |
> | Microsoft.DocumentDB/databaseAccounts/dataTransferJobs/resume/action | Resume container copy job in a database account |
> | Microsoft.DocumentDB/databaseAccounts/dataTransferJobs/cancel/action | Cancel container copy job in a database account |
> | Microsoft.DocumentDB/databaseAccounts/dataTransferJobs/complete/action | Complete an online container copy job in a database account |
> | Microsoft.DocumentDB/databaseAccounts/gremlinDatabases/write | Create a Gremlin database. |
> | Microsoft.DocumentDB/databaseAccounts/gremlinDatabases/read | Read a Gremlin database or list all the Gremlin databases. |
> | Microsoft.DocumentDB/databaseAccounts/gremlinDatabases/delete | Delete a Gremlin database. |
> | Microsoft.DocumentDB/databaseAccounts/gremlinDatabases/graphs/write | Create or update a Gremlin graph. |
> | Microsoft.DocumentDB/databaseAccounts/gremlinDatabases/graphs/read | Read a Gremlin graph or list all the Gremlin graphs. |
> | Microsoft.DocumentDB/databaseAccounts/gremlinDatabases/graphs/delete | Delete a Gremlin graph. |
> | Microsoft.DocumentDB/databaseAccounts/gremlinDatabases/graphs/operationResults/read | Read status of the asynchronous operation. |
> | Microsoft.DocumentDB/databaseAccounts/gremlinDatabases/graphs/throughputSettings/write | Update a Gremlin graph throughput. |
> | Microsoft.DocumentDB/databaseAccounts/gremlinDatabases/graphs/throughputSettings/read | Read a Gremlin graph throughput. |
> | Microsoft.DocumentDB/databaseAccounts/gremlinDatabases/graphs/throughputSettings/migrateToAutoscale/action | Migrate Gremlin graph offer to autoscale. |
> | Microsoft.DocumentDB/databaseAccounts/gremlinDatabases/graphs/throughputSettings/migrateToManualThroughput/action | Migrate Gremlin graph offer to manual throughput. |
> | Microsoft.DocumentDB/databaseAccounts/gremlinDatabases/graphs/throughputSettings/migrateToAutoscale/operationResults/read | Read status of the asynchronous operation. |
> | Microsoft.DocumentDB/databaseAccounts/gremlinDatabases/graphs/throughputSettings/migrateToManualThroughput/operationResults/read | Read status of the asynchronous operation. |
> | Microsoft.DocumentDB/databaseAccounts/gremlinDatabases/graphs/throughputSettings/operationResults/read | Read status of the asynchronous operation. |
> | Microsoft.DocumentDB/databaseAccounts/gremlinDatabases/operationResults/read | Read status of the asynchronous operation. |
> | Microsoft.DocumentDB/databaseAccounts/gremlinDatabases/throughputSettings/write | Update a Gremlin database throughput. |
> | Microsoft.DocumentDB/databaseAccounts/gremlinDatabases/throughputSettings/read | Read a Gremlin database throughput. |
> | Microsoft.DocumentDB/databaseAccounts/gremlinDatabases/throughputSettings/migrateToAutoscale/action | Migrate Gremlin Database offer to autoscale. |
> | Microsoft.DocumentDB/databaseAccounts/gremlinDatabases/throughputSettings/migrateToManualThroughput/action | Migrate Gremlin Database offer to manual throughput. |
> | Microsoft.DocumentDB/databaseAccounts/gremlinDatabases/throughputSettings/migrateToAutoscale/operationResults/read | Read status of the asynchronous operation. |
> | Microsoft.DocumentDB/databaseAccounts/gremlinDatabases/throughputSettings/migrateToManualThroughput/operationResults/read | Read status of the asynchronous operation. |
> | Microsoft.DocumentDB/databaseAccounts/gremlinDatabases/throughputSettings/operationResults/read | Read status of the asynchronous operation. |
> | Microsoft.DocumentDB/databaseAccounts/metricDefinitions/read | Reads the database account metrics definitions. |
> | Microsoft.DocumentDB/databaseAccounts/metrics/read | Reads the database account metrics. |
> | Microsoft.DocumentDB/databaseAccounts/mongodbDatabases/write | Create a MongoDB database. |
> | Microsoft.DocumentDB/databaseAccounts/mongodbDatabases/read | Read a MongoDB database or list all the MongoDB databases. |
> | Microsoft.DocumentDB/databaseAccounts/mongodbDatabases/delete | Delete a MongoDB database. |
> | Microsoft.DocumentDB/databaseAccounts/mongodbDatabases/collections/write | Create or update a MongoDB collection. |
> | Microsoft.DocumentDB/databaseAccounts/mongodbDatabases/collections/read | Read a MongoDB collection or list all the MongoDB collections. |
> | Microsoft.DocumentDB/databaseAccounts/mongodbDatabases/collections/delete | Delete a MongoDB collection. |
> | Microsoft.DocumentDB/databaseAccounts/mongodbDatabases/collections/partitionMerge/action | Merge the physical partitions of a MongoDB collection |
> | Microsoft.DocumentDB/databaseAccounts/mongodbDatabases/collections/operationResults/read | Read status of the asynchronous operation. |
> | Microsoft.DocumentDB/databaseAccounts/mongodbDatabases/collections/partitionMerge/operationResults/read | Read status of the asynchronous operation. |
> | Microsoft.DocumentDB/databaseAccounts/mongodbDatabases/collections/throughputSettings/write | Update a MongoDB collection throughput. |
> | Microsoft.DocumentDB/databaseAccounts/mongodbDatabases/collections/throughputSettings/read | Read a MongoDB collection throughput. |
> | Microsoft.DocumentDB/databaseAccounts/mongodbDatabases/collections/throughputSettings/migrateToAutoscale/action | Migrate MongoDB collection offer to autoscale. |
> | Microsoft.DocumentDB/databaseAccounts/mongodbDatabases/collections/throughputSettings/migrateToManualThroughput/action | Migrate MongoDB collection offer to manual throughput. |
> | Microsoft.DocumentDB/databaseAccounts/mongodbDatabases/collections/throughputSettings/redistributeThroughput/action | Redistribute throughput for the specified physical partitions of the MongoDB collection. |
> | Microsoft.DocumentDB/databaseAccounts/mongodbDatabases/collections/throughputSettings/retrieveThroughputDistribution/action | Retrieve throughput for the specified physical partitions of the MongoDB collection. |
> | Microsoft.DocumentDB/databaseAccounts/mongodbDatabases/collections/throughputSettings/migrateToAutoscale/operationResults/read | Read status of the asynchronous operation. |
> | Microsoft.DocumentDB/databaseAccounts/mongodbDatabases/collections/throughputSettings/migrateToManualThroughput/operationResults/read | Read status of the asynchronous operation. |
> | Microsoft.DocumentDB/databaseAccounts/mongodbDatabases/collections/throughputSettings/operationResults/read | Read status of the asynchronous operation. |
> | Microsoft.DocumentDB/databaseAccounts/mongodbDatabases/operationResults/read | Read status of the asynchronous operation. |
> | Microsoft.DocumentDB/databaseAccounts/mongodbDatabases/throughputSettings/write | Update a MongoDB database throughput. |
> | Microsoft.DocumentDB/databaseAccounts/mongodbDatabases/throughputSettings/read | Read a MongoDB database throughput. |
> | Microsoft.DocumentDB/databaseAccounts/mongodbDatabases/throughputSettings/migrateToAutoscale/action | Migrate MongoDB database offer to autoscale. |
> | Microsoft.DocumentDB/databaseAccounts/mongodbDatabases/throughputSettings/migrateToManualThroughput/action | Migrate MongoDB database offer to manual throughput. |
> | Microsoft.DocumentDB/databaseAccounts/mongodbDatabases/throughputSettings/redistributeThroughput/action | Redistribute throughput for the specified physical partitions of the MongoDB database. |
> | Microsoft.DocumentDB/databaseAccounts/mongodbDatabases/throughputSettings/retrieveThroughputDistribution/action | Retrieve throughput for the specified physical partitions of the MongoDB database. |
> | Microsoft.DocumentDB/databaseAccounts/mongodbDatabases/throughputSettings/migrateToAutoscale/operationResults/read | Read status of the asynchronous operation. |
> | Microsoft.DocumentDB/databaseAccounts/mongodbDatabases/throughputSettings/migrateToManualThroughput/operationResults/read | Read status of the asynchronous operation. |
> | Microsoft.DocumentDB/databaseAccounts/mongodbDatabases/throughputSettings/operationResults/read | Read status of the asynchronous operation. |
> | Microsoft.DocumentDB/databaseAccounts/mongodbRoleDefinitions/read | Read a MongoDB Role Definition |
> | Microsoft.DocumentDB/databaseAccounts/mongodbRoleDefinitions/write | Create or update a Mongo Role Definition |
> | Microsoft.DocumentDB/databaseAccounts/mongodbRoleDefinitions/delete | Delete a MongoDB Role Definition |
> | Microsoft.DocumentDB/databaseAccounts/mongodbUserDefinitions/read | Read a MongoDB User Definition |
> | Microsoft.DocumentDB/databaseAccounts/mongodbUserDefinitions/write | Create or update a MongoDB User Definition |
> | Microsoft.DocumentDB/databaseAccounts/mongodbUserDefinitions/delete | Delete a MongoDB User Definition |
> | Microsoft.DocumentDB/databaseAccounts/networkSecurityPerimeterAssociationProxies/read | Read association proxies related to network security perimeter |
> | Microsoft.DocumentDB/databaseAccounts/networkSecurityPerimeterAssociationProxies/write | Write association proxies related to network security perimeter |
> | Microsoft.DocumentDB/databaseAccounts/networkSecurityPerimeterAssociationProxies/delete | Deletes association proxies related to network security perimeter |
> | Microsoft.DocumentDB/databaseAccounts/networkSecurityPerimeterConfigurations/read | Get Effective configuration for Network Security Perimeter |
> | Microsoft.DocumentDB/databaseAccounts/notebookWorkspaces/write | Create or update a notebook workspace |
> | Microsoft.DocumentDB/databaseAccounts/notebookWorkspaces/read | Read a notebook workspace |
> | Microsoft.DocumentDB/databaseAccounts/notebookWorkspaces/delete | Delete a notebook workspace |
> | Microsoft.DocumentDB/databaseAccounts/notebookWorkspaces/listConnectionInfo/action | List the connection info for a notebook workspace |
> | Microsoft.DocumentDB/databaseAccounts/notebookWorkspaces/operationResults/read | Read the status of an asynchronous operation on notebook workspaces |
> | Microsoft.DocumentDB/databaseAccounts/operationResults/read | Read status of the asynchronous operation |
> | Microsoft.DocumentDB/databaseAccounts/percentile/read | Read percentiles of replication latencies |
> | Microsoft.DocumentDB/databaseAccounts/percentile/metrics/read | Read latency metrics |
> | Microsoft.DocumentDB/databaseAccounts/percentile/sourceRegion/targetRegion/metrics/read | Read latency metrics for a specific source and target region |
> | Microsoft.DocumentDB/databaseAccounts/percentile/targetRegion/metrics/read | Read latency metrics for a specific target region |
> | Microsoft.DocumentDB/databaseAccounts/privateEndpointConnectionProxies/read | Read a private endpoint connection proxy of Database Account |
> | Microsoft.DocumentDB/databaseAccounts/privateEndpointConnectionProxies/write | Create or update a private endpoint connection proxy of Database Account |
> | Microsoft.DocumentDB/databaseAccounts/privateEndpointConnectionProxies/delete | Delete a private endpoint connection proxy of Database Account |
> | Microsoft.DocumentDB/databaseAccounts/privateEndpointConnectionProxies/validate/action | Validate a private endpoint connection proxy of Database Account |
> | Microsoft.DocumentDB/databaseAccounts/privateEndpointConnectionProxies/operationResults/read | Read Status of private endpoint connection proxy asynchronous operation |
> | Microsoft.DocumentDB/databaseAccounts/privateEndpointConnections/read | Read a private endpoint connection or list all the private endpoint connections of a Database Account |
> | Microsoft.DocumentDB/databaseAccounts/privateEndpointConnections/write | Create or update a private endpoint connection of a Database Account |
> | Microsoft.DocumentDB/databaseAccounts/privateEndpointConnections/delete | Delete a private endpoint connection of a Database Account |
> | Microsoft.DocumentDB/databaseAccounts/privateEndpointConnections/operationResults/read | Read Status of privateEndpointConnenctions asynchronous operation |
> | Microsoft.DocumentDB/databaseAccounts/privateLinkResources/read | Read a private link resource or list all the private link resources of a Database Account |
> | Microsoft.DocumentDB/databaseAccounts/providers/Microsoft.Insights/diagnosticSettings/read | Gets the diagnostic setting for the resource |
> | Microsoft.DocumentDB/databaseAccounts/providers/Microsoft.Insights/diagnosticSettings/write | Creates or updates the diagnostic setting for the resource |
> | Microsoft.DocumentDB/databaseAccounts/providers/Microsoft.Insights/logDefinitions/read | Gets the available log catageries for Database Account |
> | Microsoft.DocumentDB/databaseAccounts/providers/Microsoft.Insights/metricDefinitions/read | Gets the available metrics for the database Account |
> | Microsoft.DocumentDB/databaseAccounts/readonlykeys/read | Reads the database account readonly keys. |
> | Microsoft.DocumentDB/databaseAccounts/region/databases/collections/metrics/read | Reads the regional collection metrics. |
> | Microsoft.DocumentDB/databaseAccounts/region/databases/collections/partitionKeyRangeId/metrics/read | Read regional database account partition key level metrics |
> | Microsoft.DocumentDB/databaseAccounts/region/databases/collections/partitions/read | Read regional database account partitions in a collection |
> | Microsoft.DocumentDB/databaseAccounts/region/databases/collections/partitions/metrics/read | Read regional database account partition level metrics |
> | Microsoft.DocumentDB/databaseAccounts/region/metrics/read | Reads the region and database account metrics. |
> | Microsoft.DocumentDB/databaseAccounts/services/read | Reads a CosmosDB Service Resource |
> | Microsoft.DocumentDB/databaseAccounts/services/write | Writes a CosmosDB Service Resource |
> | Microsoft.DocumentDB/databaseAccounts/services/delete | Deletes a CosmosDB Service Resource |
> | Microsoft.DocumentDB/databaseAccounts/sqlDatabases/write | Create a SQL database. |
> | Microsoft.DocumentDB/databaseAccounts/sqlDatabases/read | Read a SQL database or list all the SQL databases. |
> | Microsoft.DocumentDB/databaseAccounts/sqlDatabases/delete | Delete a SQL database. |
> | Microsoft.DocumentDB/databaseAccounts/sqlDatabases/clientEncryptionKeys/write | Create or update a Client Encryption Key. |
> | Microsoft.DocumentDB/databaseAccounts/sqlDatabases/clientEncryptionKeys/read | Read a Client Encryption Key or list all the Client Encryption Keys. |
> | Microsoft.DocumentDB/databaseAccounts/sqlDatabases/clientEncryptionKeys/operationResults/read | Read status of the asynchronous operation. |
> | Microsoft.DocumentDB/databaseAccounts/sqlDatabases/containers/write | Create or update a SQL container. |
> | Microsoft.DocumentDB/databaseAccounts/sqlDatabases/containers/read | Read a SQL container or list all the SQL containers. |
> | Microsoft.DocumentDB/databaseAccounts/sqlDatabases/containers/delete | Delete a SQL container. |
> | Microsoft.DocumentDB/databaseAccounts/sqlDatabases/containers/partitionMerge/action | Merge the physical partitions of a SQL container. |
> | Microsoft.DocumentDB/databaseAccounts/sqlDatabases/containers/operationResults/read | Read status of the asynchronous operation. |
> | Microsoft.DocumentDB/databaseAccounts/sqlDatabases/containers/partitionMerge/operationResults/read | Read status of the asynchronous operation. |
> | Microsoft.DocumentDB/databaseAccounts/sqlDatabases/containers/storedProcedures/write | Create or update a SQL stored procedure. |
> | Microsoft.DocumentDB/databaseAccounts/sqlDatabases/containers/storedProcedures/read | Read a SQL stored procedure or list all the SQL stored procedures. |
> | Microsoft.DocumentDB/databaseAccounts/sqlDatabases/containers/storedProcedures/delete | Delete a SQL stored procedure. |
> | Microsoft.DocumentDB/databaseAccounts/sqlDatabases/containers/storedProcedures/operationResults/read | Read status of the asynchronous operation. |
> | Microsoft.DocumentDB/databaseAccounts/sqlDatabases/containers/throughputSettings/write | Update a SQL container throughput. |
> | Microsoft.DocumentDB/databaseAccounts/sqlDatabases/containers/throughputSettings/read | Read a SQL container throughput. |
> | Microsoft.DocumentDB/databaseAccounts/sqlDatabases/containers/throughputSettings/migrateToAutoscale/action | Migrate SQL container offer to autoscale. |
> | Microsoft.DocumentDB/databaseAccounts/sqlDatabases/containers/throughputSettings/migrateToManualThroughput/action | Migrate a SQL container throughput offer to manual throughput. |
> | Microsoft.DocumentDB/databaseAccounts/sqlDatabases/containers/throughputSettings/redistributeThroughput/action | Redistribute throughput for the specified physical partitions of the SQL container. |
> | Microsoft.DocumentDB/databaseAccounts/sqlDatabases/containers/throughputSettings/retrieveThroughputDistribution/action | Retrieve throughput information for each physical partition of the SQL container. |
> | Microsoft.DocumentDB/databaseAccounts/sqlDatabases/containers/throughputSettings/migrateToAutoscale/operationResults/read | Read status of the asynchronous operation. |
> | Microsoft.DocumentDB/databaseAccounts/sqlDatabases/containers/throughputSettings/migrateToManualThroughput/operationResults/read | Read status of the asynchronous operation. |
> | Microsoft.DocumentDB/databaseAccounts/sqlDatabases/containers/throughputSettings/operationResults/read | Read status of the asynchronous operation. |
> | Microsoft.DocumentDB/databaseAccounts/sqlDatabases/containers/triggers/write | Create or update a SQL trigger. |
> | Microsoft.DocumentDB/databaseAccounts/sqlDatabases/containers/triggers/read | Read a SQL trigger or list all the SQL triggers. |
> | Microsoft.DocumentDB/databaseAccounts/sqlDatabases/containers/triggers/delete | Delete a SQL trigger. |
> | Microsoft.DocumentDB/databaseAccounts/sqlDatabases/containers/triggers/operationResults/read | Read status of the asynchronous operation. |
> | Microsoft.DocumentDB/databaseAccounts/sqlDatabases/containers/userDefinedFunctions/write | Create or update a SQL user defined function. |
> | Microsoft.DocumentDB/databaseAccounts/sqlDatabases/containers/userDefinedFunctions/read | Read a SQL user defined function or list all the SQL user defined functions. |
> | Microsoft.DocumentDB/databaseAccounts/sqlDatabases/containers/userDefinedFunctions/delete | Delete a SQL user defined function. |
> | Microsoft.DocumentDB/databaseAccounts/sqlDatabases/containers/userDefinedFunctions/operationResults/read | Read status of the asynchronous operation. |
> | Microsoft.DocumentDB/databaseAccounts/sqlDatabases/operationResults/read | Read status of the asynchronous operation. |
> | Microsoft.DocumentDB/databaseAccounts/sqlDatabases/throughputSettings/write | Update a SQL database throughput. |
> | Microsoft.DocumentDB/databaseAccounts/sqlDatabases/throughputSettings/read | Read a SQL database throughput. |
> | Microsoft.DocumentDB/databaseAccounts/sqlDatabases/throughputSettings/migrateToAutoscale/action | Migrate SQL database offer to autoscale. |
> | Microsoft.DocumentDB/databaseAccounts/sqlDatabases/throughputSettings/migrateToManualThroughput/action | Migrate a SQL database throughput offer to manual throughput. |
> | Microsoft.DocumentDB/databaseAccounts/sqlDatabases/throughputSettings/redistributeThroughput/action | Redistribute throughput for the specified physical partitions of the database. |
> | Microsoft.DocumentDB/databaseAccounts/sqlDatabases/throughputSettings/retrieveThroughputDistribution/action | Retrieve throughput information for each physical partition of the database. |
> | Microsoft.DocumentDB/databaseAccounts/sqlDatabases/throughputSettings/migrateToAutoscale/operationResults/read | Read status of the asynchronous operation. |
> | Microsoft.DocumentDB/databaseAccounts/sqlDatabases/throughputSettings/migrateToManualThroughput/operationResults/read | Read status of the asynchronous operation. |
> | Microsoft.DocumentDB/databaseAccounts/sqlDatabases/throughputSettings/operationResults/read | Read status of the asynchronous operation. |
> | Microsoft.DocumentDB/databaseAccounts/sqlRoleAssignments/read | Read a SQL Role Assignment |
> | Microsoft.DocumentDB/databaseAccounts/sqlRoleAssignments/write | Create or update a SQL Role Assignment |
> | Microsoft.DocumentDB/databaseAccounts/sqlRoleAssignments/delete | Delete a SQL Role Assignment |
> | Microsoft.DocumentDB/databaseAccounts/sqlRoleDefinitions/read | Read a SQL Role Definition |
> | Microsoft.DocumentDB/databaseAccounts/sqlRoleDefinitions/write | Create or update a SQL Role Definition |
> | Microsoft.DocumentDB/databaseAccounts/sqlRoleDefinitions/delete | Delete a SQL Role Definition |
> | Microsoft.DocumentDB/databaseAccounts/tables/write | Create or update a table. |
> | Microsoft.DocumentDB/databaseAccounts/tables/read | Read a table or list all the tables. |
> | Microsoft.DocumentDB/databaseAccounts/tables/delete | Delete a table. |
> | Microsoft.DocumentDB/databaseAccounts/tables/operationResults/read | Read status of the asynchronous operation. |
> | Microsoft.DocumentDB/databaseAccounts/tables/throughputSettings/write | Update a table throughput. |
> | Microsoft.DocumentDB/databaseAccounts/tables/throughputSettings/read | Read a table throughput. |
> | Microsoft.DocumentDB/databaseAccounts/tables/throughputSettings/migrateToAutoscale/action | Migrate table offer to autoscale. |
> | Microsoft.DocumentDB/databaseAccounts/tables/throughputSettings/migrateToManualThroughput/action | Migrate table offer to manual throughput. |
> | Microsoft.DocumentDB/databaseAccounts/tables/throughputSettings/migrateToAutoscale/operationResults/read | Read status of the asynchronous operation. |
> | Microsoft.DocumentDB/databaseAccounts/tables/throughputSettings/migrateToManualThroughput/operationResults/read | Read status of the asynchronous operation. |
> | Microsoft.DocumentDB/databaseAccounts/tables/throughputSettings/operationResults/read | Read status of the asynchronous operation. |
> | Microsoft.DocumentDB/databaseAccounts/usages/read | Reads the database account usages. |
> | Microsoft.DocumentDB/locations/notifyNetworkSecurityPerimeterUpdatesAvailable/action | Notifies Microsoft.DocumentDB that updates are available for networksecurityperimeter |
> | Microsoft.DocumentDB/locations/deleteVirtualNetworkOrSubnets/action | Notifies Microsoft.DocumentDB that VirtualNetwork or Subnet is being deleted |
> | Microsoft.DocumentDB/locations/read | Read the metadata of a location or List all location metadata |
> | Microsoft.DocumentDB/locations/deleteVirtualNetworkOrSubnets/operationResults/read | Read Status of deleteVirtualNetworkOrSubnets asynchronous operation |
> | Microsoft.DocumentDB/locations/operationsStatus/read | Reads Status of Asynchronous Operations |
> | Microsoft.DocumentDB/locations/restorableDatabaseAccounts/read | Read a restorable database account or List all the restorable database accounts |
> | Microsoft.DocumentDB/locations/restorableDatabaseAccounts/restore/action | Submit a restore request |
> | Microsoft.DocumentDB/mongoClusters/read | Reads a Mongo Cluster or list all Mongo Clusters. |
> | Microsoft.DocumentDB/mongoClusters/write | Create or Update the properties or tags of the specified Mongo Cluster. |
> | Microsoft.DocumentDB/mongoClusters/delete | Deletes the specified Mongo Cluster. |
> | Microsoft.DocumentDB/mongoClusters/PrivateEndpointConnectionsApproval/action | Manage a private endpoint connection of Mongo Cluster |
> | Microsoft.DocumentDB/mongoClusters/listConnectionStrings/action | List connection strings for a given Mongo Cluster |
> | Microsoft.DocumentDB/mongoClusters/firewallRules/read | Reads a firewall rule or lists all firewall rules for the specified Mongo Cluster. |
> | Microsoft.DocumentDB/mongoClusters/firewallRules/write | Create or Update a firewall rule on a specified Mongo Cluster. |
> | Microsoft.DocumentDB/mongoClusters/firewallRules/delete | Deletes an existing firewall rule for the specified Mongo Cluster. |
> | Microsoft.DocumentDB/mongoClusters/privateEndpointConnectionProxies/read | Reads a private endpoint connection proxy for the specified Mongo Cluster. |
> | Microsoft.DocumentDB/mongoClusters/privateEndpointConnectionProxies/write | Create or Update a private endpoint connection proxy on a specified Mongo Cluster. |
> | Microsoft.DocumentDB/mongoClusters/privateEndpointConnectionProxies/delete | Deletes an existing private endpoint connection proxy for the specified Mongo Cluster. |
> | Microsoft.DocumentDB/mongoClusters/privateEndpointConnectionProxies/validate/action | Validates private endpoint connection proxy for the specified Mongo Cluster. |
> | Microsoft.DocumentDB/mongoClusters/privateEndpointConnections/read | Reads a private endpoint connection or lists all private endpoint connection for the specified Mongo Cluster. |
> | Microsoft.DocumentDB/mongoClusters/privateEndpointConnections/write | Create or Update a private endpoint connection on a specified Mongo Cluster. |
> | Microsoft.DocumentDB/mongoClusters/privateEndpointConnections/delete | Deletes an existing private endpoint connection for the specified Mongo Cluster. |
> | Microsoft.DocumentDB/mongoClusters/privateLinkResources/read | Reads a private link resource or lists all private link resource for the specified Mongo Cluster. |
> | Microsoft.DocumentDB/mongoClusters/users/read | Reads a user or lists all users for the specified Mongo Cluster. |
> | Microsoft.DocumentDB/mongoClusters/users/write | Create or Update a user on a specified Mongo Cluster. |
> | Microsoft.DocumentDB/mongoClusters/users/delete | Deletes an existing user for the specified Mongo Cluster. |
> | Microsoft.DocumentDB/operationResults/read | Read status of the asynchronous operation |
> | Microsoft.DocumentDB/operations/read | Read operations available for the Microsoft DocumentDB  |
> | Microsoft.DocumentDB/throughputPool/throughputPoolAccounts/read | Read throughputPool account in throughputPool |
> | Microsoft.DocumentDB/throughputPool/throughputPoolAccounts/write | Create throughputPool account in throughputPool |

## Microsoft.Sql

Managed, intelligent SQL in the cloud.

Azure service: [Azure SQL Database](/azure/azure-sql/database/index), [Azure SQL Managed Instance](/azure/azure-sql/managed-instance/index), [Azure Synapse Analytics](/azure/synapse-analytics/)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.Sql/checkNameAvailability/action | Verify whether given server name is available for provisioning worldwide for a given subscription. |
> | Microsoft.Sql/register/action | Registers the subscription for the Microsoft SQL Database resource provider and enables the creation of Microsoft SQL Databases. |
> | Microsoft.Sql/unregister/action | Unregisters the subscription for the Azure SQL Database resource provider and disables the creation of Azure SQL Databases. |
> | Microsoft.Sql/privateEndpointConnectionsApproval/action | Determines if user is allowed to approve a private endpoint connection |
> | Microsoft.Sql/instancePools/read | Gets an instance pool |
> | Microsoft.Sql/instancePools/write | Creates or updates an instance pool |
> | Microsoft.Sql/instancePools/delete | Deletes an instance pool |
> | Microsoft.Sql/instancePools/usages/read | Gets an instance pool's usage info |
> | Microsoft.Sql/locations/notifyNetworkSecurityPerimeterUpdatesAvailable/action | Notify of NSP Update |
> | Microsoft.Sql/locations/deleteVirtualNetworkOrSubnets/action | Deletes Virtual network rules associated to a virtual network or subnet |
> | Microsoft.Sql/locations/read | Gets the available locations for a given subscription |
> | Microsoft.Sql/locations/administratorAzureAsyncOperation/read | Gets the Managed instance azure async administrator operations result. |
> | Microsoft.Sql/locations/administratorOperationResults/read | Gets the Managed instance administrator operations result. |
> | Microsoft.Sql/locations/advancedThreatProtectionAzureAsyncOperation/read | Retrieve results of the server Advanced Threat Protection settings write operation |
> | Microsoft.Sql/locations/advancedThreatProtectionOperationResults/read | Retrieve results of the server Advanced Threat Protection settings write operation |
> | Microsoft.Sql/locations/auditingSettingsAzureAsyncOperation/read | Retrieve result of the extended server blob auditing policy Set operation |
> | Microsoft.Sql/locations/auditingSettingsOperationResults/read | Retrieve result of the server blob auditing policy Set operation |
> | Microsoft.Sql/locations/capabilities/read | Gets the capabilities for this subscription in a given location |
> | Microsoft.Sql/locations/changeLongTermRetentionBackupAccessTierAzureAsyncOperation/read | Gets the async operation status of changing long term retention backup access tier operation. |
> | Microsoft.Sql/locations/changeLongTermRetentionBackupAccessTierOperationResults/read | Gets the changing LTR backup access tier operation result. |
> | Microsoft.Sql/locations/connectionPoliciesAzureAsyncOperation/read | Gets the in progress operation of server connection policy update. |
> | Microsoft.Sql/locations/connectionPoliciesOperationResults/read | Gets the in progress operation of server connection policy update. |
> | Microsoft.Sql/locations/databaseAzureAsyncOperation/read | Gets the status of a database operation. |
> | Microsoft.Sql/locations/databaseEncryptionProtectorRevalidateAzureAsyncOperation/read | Revalidate key for azure sql database azure async operation |
> | Microsoft.Sql/locations/databaseEncryptionProtectorRevalidateOperationResults/read | Revalidate key for azure sql database operation results |
> | Microsoft.Sql/locations/databaseEncryptionProtectorRevertAzureAsyncOperation/read | Revert key for azure sql database azure async operation |
> | Microsoft.Sql/locations/databaseEncryptionProtectorRevertOperationResults/read | Revert key for azure sql database operation results |
> | Microsoft.Sql/locations/databaseOperationResults/read | Gets the status of a database operation. |
> | Microsoft.Sql/locations/deletedServerAsyncOperation/read | Gets in-progress operations on deleted server |
> | Microsoft.Sql/locations/deletedServerOperationResults/read | Gets in-progress operations on deleted server |
> | Microsoft.Sql/locations/deletedServers/read | Return the list of deleted servers or gets the properties for the specified deleted server. |
> | Microsoft.Sql/locations/deletedServers/recover/action | Recover a deleted server |
> | Microsoft.Sql/locations/devOpsAuditingSettingsAzureAsyncOperation/read | Retrieve result of the server DevOps audit policy Set operation |
> | Microsoft.Sql/locations/devOpsAuditingSettingsOperationResults/read | Retrieve result of the server DevOps audit policy Set operation |
> | Microsoft.Sql/locations/distributedAvailabilityGroupsAzureAsyncOperation/read | Gets the status of a long term distributed availability groups async operation on Azure Sql Managed Instance. |
> | Microsoft.Sql/locations/distributedAvailabilityGroupsOperationResults/read | Gets the status of a long term distributed availability groups async operation. |
> | Microsoft.Sql/locations/elasticPoolAzureAsyncOperation/read | Gets the azure async operation for an elastic pool async operation |
> | Microsoft.Sql/locations/elasticPoolOperationResults/read | Gets the result of an elastic pool operation. |
> | Microsoft.Sql/locations/encryptionProtectorAzureAsyncOperation/read | Gets in-progress operations on transparent data encryption encryption protector |
> | Microsoft.Sql/locations/encryptionProtectorOperationResults/read | Gets in-progress operations on transparent data encryption encryption protector |
> | Microsoft.Sql/locations/extendedAuditingSettingsAzureAsyncOperation/read | Retrieve result of the extended server blob auditing policy Set operation |
> | Microsoft.Sql/locations/extendedAuditingSettingsOperationResults/read | Retrieve result of the extended server blob auditing policy Set operation |
> | Microsoft.Sql/locations/externalPolicyBasedAuthorizationsAzureAsycOperation/read | External policy based authorization async operation results |
> | Microsoft.Sql/locations/externalPolicyBasedAuthorizationsOperationResults/read | External policy based authorization operation results |
> | Microsoft.Sql/locations/firewallRulesAzureAsyncOperation/read | Gets the status of a firewall rule operation. |
> | Microsoft.Sql/locations/firewallRulesOperationResults/read | Gets the status of a firewall rule operation. |
> | Microsoft.Sql/locations/hybridCertificateAzureAsyncOperation/read | Gets the status of a long term hybrid certificate async operation on Azure Sql Managed Instance. |
> | Microsoft.Sql/locations/hybridCertificateOperationResults/read | Gets the status of a long term hybrid certificate async operation. |
> | Microsoft.Sql/locations/hybridLinkAzureAsyncOperation/read | Gets the status of a long term hybrid link async operation on Azure Sql Managed Instance. |
> | Microsoft.Sql/locations/hybridLinkOperationResults/read | Gets the status of a long term hybrid link async operation. |
> | Microsoft.Sql/locations/instanceFailoverGroups/read | Returns the list of instance failover groups or gets the properties for the specified instance failover group. |
> | Microsoft.Sql/locations/instanceFailoverGroups/write | Creates an instance failover group with the specified parameters or updates the properties or tags for the specified instance failover group. |
> | Microsoft.Sql/locations/instanceFailoverGroups/delete | Deletes an existing instance failover group. |
> | Microsoft.Sql/locations/instanceFailoverGroups/failover/action | Executes planned failover in an existing instance failover group. |
> | Microsoft.Sql/locations/instanceFailoverGroups/forceFailoverAllowDataLoss/action | Executes forced failover in an existing instance failover group. |
> | Microsoft.Sql/locations/instancePoolAzureAsyncOperation/read | Gets the status of an instance pool operation |
> | Microsoft.Sql/locations/instancePoolOperationResults/read | Gets the result for an instance pool operation |
> | Microsoft.Sql/locations/ipv6FirewallRulesAzureAsyncOperation/read | Gets the status of a firewall rule operation. |
> | Microsoft.Sql/locations/ipv6FirewallRulesOperationResults/read | Gets the status of a firewall rule operation. |
> | Microsoft.Sql/locations/jobAgentAzureAsyncOperation/read | Gets the status of an job agent operation. |
> | Microsoft.Sql/locations/jobAgentOperationResults/read | Gets the result of an job agent operation. |
> | Microsoft.Sql/locations/jobAgentPrivateEndpointAzureAsyncOperation/read | Gets the status of a job agent private endpoint operation |
> | Microsoft.Sql/locations/jobAgentPrivateEndpointOperationResults/read | Gets the result of a job agent private endpoint operation |
> | Microsoft.Sql/locations/ledgerDigestUploadsAzureAsyncOperation/read | Gets in-progress operations of ledger digest upload settings |
> | Microsoft.Sql/locations/ledgerDigestUploadsOperationResults/read | Gets in-progress operations of ledger digest upload settings |
> | Microsoft.Sql/locations/longTermRetentionBackupAzureAsyncOperation/read | Get the status of long term retention backup operation |
> | Microsoft.Sql/locations/longTermRetentionBackupOperationResults/read | Get the status of long term retention backup operation |
> | Microsoft.Sql/locations/longTermRetentionBackups/read | Lists the long term retention backups for every database on every server in a location |
> | Microsoft.Sql/locations/longTermRetentionManagedInstanceBackupAzureAsyncOperation/read | Get the status of managed instance long term retention backup operation |
> | Microsoft.Sql/locations/longTermRetentionManagedInstanceBackupOperationResults/read | Get the status of managed instance long term retention backup operation |
> | Microsoft.Sql/locations/longTermRetentionManagedInstanceBackups/read | Returns a list of managed instance LTR backups for a specific location  |
> | Microsoft.Sql/locations/longTermRetentionManagedInstances/longTermRetentionDatabases/longTermRetentionManagedInstanceBackups/read | Returns a list of LTR backups for a managed instance database |
> | Microsoft.Sql/locations/longTermRetentionManagedInstances/longTermRetentionDatabases/longTermRetentionManagedInstanceBackups/delete | Deletes an LTR backup for a managed instance database |
> | Microsoft.Sql/locations/longTermRetentionManagedInstances/longTermRetentionManagedInstanceBackups/read | Returns a list of managed instance LTR backups for a specific managed instance |
> | Microsoft.Sql/locations/longTermRetentionPolicyAzureAsyncOperation/read | Gets the status of a long term retention policy operation |
> | Microsoft.Sql/locations/longTermRetentionPolicyOperationResults/read | Gets the status of a long term retention policy operation |
> | Microsoft.Sql/locations/longTermRetentionServers/longTermRetentionBackups/read | Lists the long term retention backups for every database on a server |
> | Microsoft.Sql/locations/longTermRetentionServers/longTermRetentionDatabases/longTermRetentionBackups/copy/action | Copy a long term retention backup |
> | Microsoft.Sql/locations/longTermRetentionServers/longTermRetentionDatabases/longTermRetentionBackups/update/action | Update a long term retention backup |
> | Microsoft.Sql/locations/longTermRetentionServers/longTermRetentionDatabases/longTermRetentionBackups/read | Lists the long term retention backups for a database |
> | Microsoft.Sql/locations/longTermRetentionServers/longTermRetentionDatabases/longTermRetentionBackups/delete | Deletes a long term retention backup |
> | Microsoft.Sql/locations/longTermRetentionServers/longTermRetentionDatabases/longTermRetentionBackups/changeAccessTier/action | Change long term retention backup access tier operation. |
> | Microsoft.Sql/locations/managedDatabaseMoveOperationResults/read | Gets Managed Instance database move operation result. |
> | Microsoft.Sql/locations/managedDatabaseRestoreAzureAsyncOperation/completeRestore/action | Completes managed database restore operation |
> | Microsoft.Sql/locations/managedInstanceAdvancedThreatProtectionAzureAsyncOperation/read | Retrieve results of the managed instance Advanced Threat Protection settings write operation |
> | Microsoft.Sql/locations/managedInstanceAdvancedThreatProtectionOperationResults/read | Retrieve results of the managed instance Advanced Threat Protection settings write operation |
> | Microsoft.Sql/locations/managedInstanceDtcAzureAsyncOperation/read | Gets the status of Azure SQL Managed Instance DTC Azure async operation. |
> | Microsoft.Sql/locations/managedInstanceEncryptionProtectorAzureAsyncOperation/read | Gets in-progress operations on transparent data encryption managed instance encryption protector |
> | Microsoft.Sql/locations/managedInstanceEncryptionProtectorOperationResults/read | Gets in-progress operations on transparent data encryption managed instance encryption protector |
> | Microsoft.Sql/locations/managedInstanceKeyAzureAsyncOperation/read | Gets in-progress operations on transparent data encryption managed instance keys |
> | Microsoft.Sql/locations/managedInstanceKeyOperationResults/read | Gets in-progress operations on transparent data encryption managed instance keys |
> | Microsoft.Sql/locations/managedInstanceLongTermRetentionPolicyAzureAsyncOperation/read | Gets the status of a long term retention policy operation for a managed database |
> | Microsoft.Sql/locations/managedInstanceLongTermRetentionPolicyOperationResults/read | Gets the status of a long term retention policy operation for a managed database |
> | Microsoft.Sql/locations/managedInstancePrivateEndpointConnectionAzureAsyncOperation/read | Gets the result for a private endpoint connection operation |
> | Microsoft.Sql/locations/managedInstancePrivateEndpointConnectionOperationResults/read | Gets the result for a private endpoint connection operation |
> | Microsoft.Sql/locations/managedInstancePrivateEndpointConnectionProxyAzureAsyncOperation/read | Gets the result for a private endpoint connection proxy operation |
> | Microsoft.Sql/locations/managedInstancePrivateEndpointConnectionProxyOperationResults/read | Gets the result for a private endpoint connection proxy operation |
> | Microsoft.Sql/locations/managedLedgerDigestUploadsAzureAsyncOperation/read | Gets in-progress operations of ledger digest upload settings |
> | Microsoft.Sql/locations/managedLedgerDigestUploadsOperationResults/read | Gets in-progress operations of ledger digest upload settings |
> | Microsoft.Sql/locations/managedShortTermRetentionPolicyAzureAsyncOperation/read | Gets the status of a short term retention policy operation |
> | Microsoft.Sql/locations/managedShortTermRetentionPolicyOperationResults/read | Gets the status of a short term retention policy operation |
> | Microsoft.Sql/locations/managedTransparentDataEncryptionAzureAsyncOperation/read | Gets in-progress operations on managed database transparent data encryption |
> | Microsoft.Sql/locations/managedTransparentDataEncryptionOperationResults/read | Gets in-progress operations on managed database transparent data encryption |
> | Microsoft.Sql/locations/networkSecurityPerimeterAssociationProxyAzureAsyncOperation/read | Get network security perimeter proxy azure async operation |
> | Microsoft.Sql/locations/networkSecurityPerimeterAssociationProxyOperationResults/read | Get network security perimeter operation result |
> | Microsoft.Sql/locations/networkSecurityPerimeterConfigurationsReconcileAzureAsyncOperation/read | Sync sql server network security perimeter effective configuration with Network Provider |
> | Microsoft.Sql/locations/networkSecurityPerimeterConfigurationsReconcileOperationResults/read | Get Reconcile Network Security Perimeter Operation Result |
> | Microsoft.Sql/locations/networkSecurityPerimeterUpdatesAvailableAzureAsyncOperation/read | Get network security perimeter updates available azure async operation |
> | Microsoft.Sql/locations/privateEndpointConnectionAzureAsyncOperation/read | Gets the result for a private endpoint connection operation |
> | Microsoft.Sql/locations/privateEndpointConnectionOperationResults/read | Gets the result for a private endpoint connection operation |
> | Microsoft.Sql/locations/privateEndpointConnectionProxyAzureAsyncOperation/read | Gets the result for a private endpoint connection proxy operation |
> | Microsoft.Sql/locations/privateEndpointConnectionProxyOperationResults/read | Gets the result for a private endpoint connection proxy operation |
> | Microsoft.Sql/locations/refreshExternalGovernanceStatusAzureAsyncOperation/read | Refresh external governance enablement status async operation |
> | Microsoft.Sql/locations/refreshExternalGovernanceStatusMIAzureAsyncOperation/read | Refresh external governance enablement status async operation |
> | Microsoft.Sql/locations/refreshExternalGovernanceStatusMIOperationResults/read | Refresh external governance enablement status operation results |
> | Microsoft.Sql/locations/refreshExternalGovernanceStatusOperationResults/read | Refresh external governance enablement status operation results |
> | Microsoft.Sql/locations/replicationLinksAzureAsyncOperation/read | Return the get result of replication links async operation. |
> | Microsoft.Sql/locations/replicationLinksOperationResults/read | Return the get result of replication links operation. |
> | Microsoft.Sql/locations/serverAdministratorAzureAsyncOperation/read | Server Azure Active Directory administrator async operation results |
> | Microsoft.Sql/locations/serverAdministratorOperationResults/read | Server Azure Active Directory administrator operation results |
> | Microsoft.Sql/locations/serverConfigurationOptionAzureAsyncOperation/read | Gets the status of Azure SQL Managed Instance Server Configuration Option Azure async operation. |
> | Microsoft.Sql/locations/serverKeyAzureAsyncOperation/read | Gets in-progress operations on transparent data encryption server keys |
> | Microsoft.Sql/locations/serverKeyOperationResults/read | Gets in-progress operations on transparent data encryption server keys |
> | Microsoft.Sql/locations/serverTrustCertificatesAzureAsyncOperation/read | Gets the status of a long term server trust certificate async operation on Azure Sql Managed Instance. |
> | Microsoft.Sql/locations/serverTrustCertificatesOperationResults/read | Gets the status of a server trust certificate hybrid link async operation. |
> | Microsoft.Sql/locations/serverTrustGroupAzureAsyncOperation/read | Get the status of Server Trust Group async operation |
> | Microsoft.Sql/locations/serverTrustGroupOperationResults/read | Get the result of Server Trust Group operation |
> | Microsoft.Sql/locations/serverTrustGroups/write | Creates a Server Trust Group with the specified parameters |
> | Microsoft.Sql/locations/serverTrustGroups/delete | Deletes the existing SQL Server Trust Group |
> | Microsoft.Sql/locations/serverTrustGroups/read | Returns the existing SQL Server Trust Groups |
> | Microsoft.Sql/locations/shortTermRetentionPolicyOperationResults/read | Gets the status of a short term retention policy operation |
> | Microsoft.Sql/locations/sqlVulnerabilityAssessmentAzureAsyncOperation/read | Get a sql database vulnerability assessment scan azure async operation. |
> | Microsoft.Sql/locations/sqlVulnerabilityAssessmentOperationResults/read | Get a sql database vulnerability assessment scan operation results. |
> | Microsoft.Sql/locations/startManagedInstanceAzureAsyncOperation/read | Gets Azure SQL Managed Instance Start Azure async operation. |
> | Microsoft.Sql/locations/startManagedInstanceOperationResults/read | Gets Azure SQL Managed Instance Start operation result. |
> | Microsoft.Sql/locations/stopManagedInstanceAzureAsyncOperation/read | Gets Azure SQL Managed Instance Stop Azure async operation. |
> | Microsoft.Sql/locations/stopManagedInstanceOperationResults/read | Gets Azure SQL Managed Instance Stop operation result. |
> | Microsoft.Sql/locations/syncAgentOperationResults/read | Retrieve result of the sync agent resource operation |
> | Microsoft.Sql/locations/syncDatabaseIds/read | Retrieve the sync database ids for a particular region and subscription |
> | Microsoft.Sql/locations/syncGroupAzureAsyncOperation/read | Retrieve result of the sync group resource operation |
> | Microsoft.Sql/locations/syncGroupOperationResults/read | Retrieve result of the sync group resource operation |
> | Microsoft.Sql/locations/syncMemberOperationResults/read | Retrieve result of the sync member resource operation |
> | Microsoft.Sql/locations/timeZones/read | Return the list of managed instance time zones by location. |
> | Microsoft.Sql/locations/transparentDataEncryptionAzureAsyncOperation/read | Gets in-progress operations on logical database transparent data encryption |
> | Microsoft.Sql/locations/transparentDataEncryptionOperationResults/read | Gets in-progress operations on logical database transparent data encryption |
> | Microsoft.Sql/locations/usages/read | Gets a collection of usage metrics for this subscription in a location |
> | Microsoft.Sql/locations/virtualNetworkRulesAzureAsyncOperation/read | Returns the details of the specified virtual network rules azure async operation  |
> | Microsoft.Sql/locations/virtualNetworkRulesOperationResults/read | Returns the details of the specified virtual network rules operation  |
> | Microsoft.Sql/managedInstances/tdeCertificates/action | Create/Update TDE certificate |
> | Microsoft.Sql/managedInstances/joinServerTrustGroup/action | Determine if a user is allowed to join Managed Server into a Server Trust Group |
> | Microsoft.Sql/managedInstances/hybridCertificate/action | Creates or updates hybrid certificate with a specified parameters. |
> | Microsoft.Sql/managedInstances/read | Return the list of managed instances or gets the properties for the specified managed instance. |
> | Microsoft.Sql/managedInstances/write | Creates a managed instance with the specified parameters or update the properties or tags for the specified managed instance. |
> | Microsoft.Sql/managedInstances/delete | Deletes an existing  managed instance. |
> | Microsoft.Sql/managedInstances/start/action | Starts a given Azure SQL Managed Instance. |
> | Microsoft.Sql/managedInstances/stop/action | Stops a given Azure SQL Managed Instance. |
> | Microsoft.Sql/managedInstances/failover/action | Customer initiated managed instance failover. |
> | Microsoft.Sql/managedInstances/refreshExternalGovernanceStatus/action | Refreshes external governance enablemement status |
> | Microsoft.Sql/managedInstances/crossSubscriptionPITR/action | Determine if user is allowed to do cross subscription PITR operations |
> | Microsoft.Sql/managedInstances/administrators/read | Gets a list of managed instance administrators. |
> | Microsoft.Sql/managedInstances/administrators/write | Creates or updates managed instance administrator with the specified parameters. |
> | Microsoft.Sql/managedInstances/administrators/delete | Deletes an existing administrator of managed instance. |
> | Microsoft.Sql/managedInstances/advancedThreatProtectionSettings/write | Change the managed instance Advanced Threat Protection settings for a given managed instance |
> | Microsoft.Sql/managedInstances/advancedThreatProtectionSettings/read | Retrieve a list of managed instance Advanced Threat Protection settings configured for a given instance |
> | Microsoft.Sql/managedInstances/azureADOnlyAuthentications/read | Reads a specific managed server Azure Active Directory only authentication object |
> | Microsoft.Sql/managedInstances/azureADOnlyAuthentications/write | Adds or updates a specific managed server Azure Active Directory only authentication object |
> | Microsoft.Sql/managedInstances/azureADOnlyAuthentications/delete | Deletes a specific managed server Azure Active Directory only authentication object |
> | Microsoft.Sql/managedInstances/databases/read | Gets existing managed database |
> | Microsoft.Sql/managedInstances/databases/delete | Deletes an existing managed database |
> | Microsoft.Sql/managedInstances/databases/write | Creates a new database or updates an existing database. |
> | Microsoft.Sql/managedInstances/databases/cancelMove/action | Cancels Managed Instance database move. |
> | Microsoft.Sql/managedInstances/databases/completeMove/action | Completes Managed Instance database move. |
> | Microsoft.Sql/managedInstances/databases/startMove/action | Starts Managed Instance database move. |
> | Microsoft.Sql/managedInstances/databases/completeRestore/action | Completes managed database restore operation |
> | Microsoft.Sql/managedInstances/databases/readBackups/action | Determine if user is allowed to read backups |
> | Microsoft.Sql/managedInstances/databases/advancedThreatProtectionSettings/write | Change the database Advanced Threat Protection settings for a given managed database |
> | Microsoft.Sql/managedInstances/databases/advancedThreatProtectionSettings/read | Retrieve a list of the managed database Advanced Threat Protection settings configured for a given managed database |
> | Microsoft.Sql/managedInstances/databases/backupLongTermRetentionPolicies/write | Updates a long term retention policy for a managed database |
> | Microsoft.Sql/managedInstances/databases/backupLongTermRetentionPolicies/read | Gets a long term retention policy for a managed database |
> | Microsoft.Sql/managedInstances/databases/backupLongTermRetentionPolicies/delete | Updates a long term retention policy for a managed database |
> | Microsoft.Sql/managedInstances/databases/backupShortTermRetentionPolicies/read | Gets a short term retention policy for a managed database |
> | Microsoft.Sql/managedInstances/databases/backupShortTermRetentionPolicies/write | Updates a short term retention policy for a managed database |
> | Microsoft.Sql/managedInstances/databases/columns/read | Return a list of columns for a managed database |
> | Microsoft.Sql/managedInstances/databases/currentSensitivityLabels/read | List sensitivity labels of a given database |
> | Microsoft.Sql/managedInstances/databases/currentSensitivityLabels/write | Batch update sensitivity labels |
> | Microsoft.Sql/managedInstances/databases/ledgerDigestUploads/read | Read ledger digest upload settings |
> | Microsoft.Sql/managedInstances/databases/ledgerDigestUploads/write | Enable uploading ledger digests  |
> | Microsoft.Sql/managedInstances/databases/ledgerDigestUploads/disable/action | Disable uploading ledger digests |
> | Microsoft.Sql/managedInstances/databases/providers/Microsoft.Insights/diagnosticSettings/read | Gets the diagnostic setting for the resource |
> | Microsoft.Sql/managedInstances/databases/providers/Microsoft.Insights/diagnosticSettings/write | Creates or updates the diagnostic setting for the resource |
> | Microsoft.Sql/managedInstances/databases/providers/Microsoft.Insights/logDefinitions/read | Gets the available logs for managed instance databases |
> | Microsoft.Sql/managedInstances/databases/queries/read | Get query text by query id |
> | Microsoft.Sql/managedInstances/databases/queries/statistics/read | Get query execution statistics by query id |
> | Microsoft.Sql/managedInstances/databases/recommendedSensitivityLabels/read | List the recommended sensitivity labels for a given database |
> | Microsoft.Sql/managedInstances/databases/recommendedSensitivityLabels/write | Batch update recommended sensitivity labels |
> | Microsoft.Sql/managedInstances/databases/restoreDetails/read | Returns managed database restore details while restore is in progress. |
> | Microsoft.Sql/managedInstances/databases/schemas/read | Get a managed database schema. |
> | Microsoft.Sql/managedInstances/databases/schemas/tables/read | Get a managed database table |
> | Microsoft.Sql/managedInstances/databases/schemas/tables/columns/read | Get a managed database column |
> | Microsoft.Sql/managedInstances/databases/schemas/tables/columns/sensitivityLabels/read | Get the sensitivity label of a given column |
> | Microsoft.Sql/managedInstances/databases/schemas/tables/columns/sensitivityLabels/write | Create or update the sensitivity label of a given column |
> | Microsoft.Sql/managedInstances/databases/schemas/tables/columns/sensitivityLabels/delete | Delete the sensitivity label of a given column |
> | Microsoft.Sql/managedInstances/databases/schemas/tables/columns/sensitivityLabels/disable/action | Disable sensitivity recommendations on a given column |
> | Microsoft.Sql/managedInstances/databases/schemas/tables/columns/sensitivityLabels/enable/action | Enable sensitivity recommendations on a given column |
> | Microsoft.Sql/managedInstances/databases/securityAlertPolicies/write | Change the database threat detection policy for a given managed database |
> | Microsoft.Sql/managedInstances/databases/securityAlertPolicies/read | Retrieve a list of managed database threat detection policies configured for a given server |
> | Microsoft.Sql/managedInstances/databases/securityEvents/read | Retrieves the managed database security events |
> | Microsoft.Sql/managedInstances/databases/sensitivityLabels/read | List sensitivity labels of a given database |
> | Microsoft.Sql/managedInstances/databases/transparentDataEncryption/read | Retrieve details of the database Transparent Data Encryption on a given managed database |
> | Microsoft.Sql/managedInstances/databases/transparentDataEncryption/write | Change the database Transparent Data Encryption for a given managed database |
> | Microsoft.Sql/managedInstances/databases/vulnerabilityAssessments/write | Change the vulnerability assessment for a given database |
> | Microsoft.Sql/managedInstances/databases/vulnerabilityAssessments/delete | Remove the vulnerability assessment for a given database |
> | Microsoft.Sql/managedInstances/databases/vulnerabilityAssessments/read | Retrieve the vulnerability assessment policies on a givendatabase |
> | Microsoft.Sql/managedInstances/databases/vulnerabilityAssessments/rules/baselines/delete | Remove the vulnerability assessment rule baseline for a given database |
> | Microsoft.Sql/managedInstances/databases/vulnerabilityAssessments/rules/baselines/write | Change the vulnerability assessment rule baseline for a given database |
> | Microsoft.Sql/managedInstances/databases/vulnerabilityAssessments/rules/baselines/read | Get the vulnerability assessment rule baseline for a given database |
> | Microsoft.Sql/managedInstances/databases/vulnerabilityAssessments/scans/initiateScan/action | Execute vulnerability assessment database scan. |
> | Microsoft.Sql/managedInstances/databases/vulnerabilityAssessments/scans/export/action | Convert an existing scan result to a human readable format. If already exists nothing happens |
> | Microsoft.Sql/managedInstances/databases/vulnerabilityAssessments/scans/read | Return the list of database vulnerability assessment scan records or get the scan record for the specified scan ID. |
> | Microsoft.Sql/managedInstances/distributedAvailabilityGroups/read | Return the list of distributed availability groups or gets the properties for the specified distributed availability group. |
> | Microsoft.Sql/managedInstances/distributedAvailabilityGroups/write | Creates distributed availability groups with a specified parameters. |
> | Microsoft.Sql/managedInstances/distributedAvailabilityGroups/delete | Deletes a distributed availability group. |
> | Microsoft.Sql/managedInstances/distributedAvailabilityGroups/setRole/action | Set Role for Azure SQL Managed Instance Link to Primary or Secondary. |
> | Microsoft.Sql/managedInstances/distributedAvailabilityGroups/failover/action | Performs requested failover type in this distributed availability group. |
> | Microsoft.Sql/managedInstances/dnsAliases/read | Return the list of Azure SQL Managed Instance Dns Aliases for the specified instance. |
> | Microsoft.Sql/managedInstances/dnsAliases/write | Creates an Azure SQL Managed Instance Dns Alias with the specified parameters or updates the properties for the specified Azure SQL Managed Instance Dns Alias. |
> | Microsoft.Sql/managedInstances/dnsAliases/delete | Deletes an existing Azure SQL Managed Instance Dns Alias. |
> | Microsoft.Sql/managedInstances/dnsAliases/acquire/action | Acquire Azure SQL Managed Instance Dns Alias from another Managed Instance. |
> | Microsoft.Sql/managedInstances/dtc/read | Gets properties for the specified Azure SQL Managed Instance DTC. |
> | Microsoft.Sql/managedInstances/dtc/write | Updates Azure SQL Managed Instance's DTC properties for the specified instance. |
> | Microsoft.Sql/managedInstances/encryptionProtector/revalidate/action | Update the properties for the specified Server Encryption Protector. |
> | Microsoft.Sql/managedInstances/encryptionProtector/read | Returns a list of server encryption protectors or gets the properties for the specified server encryption protector. |
> | Microsoft.Sql/managedInstances/encryptionProtector/write | Update the properties for the specified Server Encryption Protector. |
> | Microsoft.Sql/managedInstances/endpointCertificates/read | Get the endpoint certificate. |
> | Microsoft.Sql/managedInstances/hybridLink/read | Return the list of hybrid links or gets the properties for the specified distributed availability group. |
> | Microsoft.Sql/managedInstances/hybridLink/write | Creates or updates hybrid link with a specified parameters. |
> | Microsoft.Sql/managedInstances/hybridLink/delete | Deletes a hybrid link with a specified distributed availability group. |
> | Microsoft.Sql/managedInstances/inaccessibleManagedDatabases/read | Gets a list of inaccessible managed databases in a managed instance |
> | Microsoft.Sql/managedInstances/keys/read | Return the list of managed instance keys or gets the properties for the specified managed instance key. |
> | Microsoft.Sql/managedInstances/keys/write | Creates a key with the specified parameters or update the properties or tags for the specified managed instance key. |
> | Microsoft.Sql/managedInstances/keys/delete | Deletes an existing Azure SQL Managed Instance  key. |
> | Microsoft.Sql/managedInstances/metricDefinitions/read | Get managed instance metric definitions |
> | Microsoft.Sql/managedInstances/metrics/read | Get managed instance metrics |
> | Microsoft.Sql/managedInstances/operations/read | Get managed instance operations |
> | Microsoft.Sql/managedInstances/operations/cancel/action | Cancels Azure SQL Managed Instance pending asynchronous operation that is not finished yet. |
> | Microsoft.Sql/managedInstances/outboundNetworkDependenciesEndpoints/read | Gets the list of the outbound network dependencies for the given managed instance. |
> | Microsoft.Sql/managedInstances/privateEndpointConnectionProxies/read | Returns the list of private endpoint connection proxies or gets the properties for the specified private endpoint connection proxy. |
> | Microsoft.Sql/managedInstances/privateEndpointConnectionProxies/write | Creates a private endpoint connection proxy with the specified parameters or updates the properties or tags for the specified private endpoint connection proxy. |
> | Microsoft.Sql/managedInstances/privateEndpointConnectionProxies/delete | Deletes an existing private endpoint connection proxy |
> | Microsoft.Sql/managedInstances/privateEndpointConnectionProxies/validate/action | Validates a private endpoint connection create call from NRP side |
> | Microsoft.Sql/managedInstances/privateEndpointConnections/read | Returns the list of private endpoint connections or gets the properties for the specified private endpoint connection. |
> | Microsoft.Sql/managedInstances/privateEndpointConnections/delete | Deletes an existing private endpoint connection |
> | Microsoft.Sql/managedInstances/privateEndpointConnections/write | Approves or rejects an existing private endpoint connection |
> | Microsoft.Sql/managedInstances/privateLinkResources/read | Get the private link resources for the corresponding sql server |
> | Microsoft.Sql/managedInstances/providers/Microsoft.Insights/diagnosticSettings/read | Gets the diagnostic setting for the resource |
> | Microsoft.Sql/managedInstances/providers/Microsoft.Insights/diagnosticSettings/write | Creates or updates the diagnostic setting for the resource |
> | Microsoft.Sql/managedInstances/providers/Microsoft.Insights/logDefinitions/read | Gets the available logs for managed instances |
> | Microsoft.Sql/managedInstances/providers/Microsoft.Insights/metricDefinitions/read | Return types of metrics that are available for managed instances |
> | Microsoft.Sql/managedInstances/recoverableDatabases/read | Returns a list of recoverable managed databases |
> | Microsoft.Sql/managedInstances/restorableDroppedDatabases/read | Returns a list of restorable dropped managed databases. |
> | Microsoft.Sql/managedInstances/restorableDroppedDatabases/backupShortTermRetentionPolicies/read | Gets a short term retention policy for a dropped managed database |
> | Microsoft.Sql/managedInstances/restorableDroppedDatabases/backupShortTermRetentionPolicies/write | Updates a short term retention policy for a dropped managed database |
> | Microsoft.Sql/managedInstances/securityAlertPolicies/write | Change the managed server threat detection policy for a given managed server |
> | Microsoft.Sql/managedInstances/securityAlertPolicies/read | Retrieve a list of managed server threat detection policies configured for a given server |
> | Microsoft.Sql/managedInstances/serverConfigurationOptions/read | Gets properties for the specified Azure SQL Managed Instance Server Configuration Option. |
> | Microsoft.Sql/managedInstances/serverConfigurationOptions/write | Updates Azure SQL Managed Instance's Server Configuration Option properties for the specified instance. |
> | Microsoft.Sql/managedInstances/serverTrustCertificates/write | Creates or updates server trust certificate with specified parameters. |
> | Microsoft.Sql/managedInstances/serverTrustCertificates/delete | Delete server trust certificate with a given name |
> | Microsoft.Sql/managedInstances/serverTrustCertificates/read | Return the list of server trust certificates. |
> | Microsoft.Sql/managedInstances/serverTrustGroups/read | Returns the existing SQL Server Trust Groups by Managed Instance name |
> | Microsoft.Sql/managedInstances/startStopSchedules/write | Creates Azure SQL Managed Instance's Start-Stop schedule with the specified parameters or updates the properties of the schedule for the specified instance. |
> | Microsoft.Sql/managedInstances/startStopSchedules/delete | Deletes Azure SQL Managed Instance's Start-Stop schedule. |
> | Microsoft.Sql/managedInstances/startStopSchedules/read | Get properties for specified Start-Stop schedule for the Azure SQL Managed Instance or a List of all Start-Stop schedules. |
> | Microsoft.Sql/managedInstances/topqueries/read | Get top resource consuming queries of a managed instance |
> | Microsoft.Sql/managedInstances/vulnerabilityAssessments/write | Change the vulnerability assessment for a given managed instance |
> | Microsoft.Sql/managedInstances/vulnerabilityAssessments/delete | Remove the vulnerability assessment for a given managed instance |
> | Microsoft.Sql/managedInstances/vulnerabilityAssessments/read | Retrieve the vulnerability assessment policies on a given managed instance |
> | Microsoft.Sql/operations/read | Gets available REST operations |
> | Microsoft.Sql/servers/tdeCertificates/action | Create/Update TDE certificate |
> | Microsoft.Sql/servers/read | Return the list of servers or gets the properties for the specified server. |
> | Microsoft.Sql/servers/write | Creates a server with the specified parameters or update the properties or tags for the specified server. |
> | Microsoft.Sql/servers/delete | Deletes an existing server. |
> | Microsoft.Sql/servers/import/action | Import new Azure SQL Database |
> | Microsoft.Sql/servers/joinPerimeter/action | Add server to Network Security Perimeter |
> | Microsoft.Sql/servers/privateEndpointConnectionsApproval/action | Determines if user is allowed to approve a private endpoint connection |
> | Microsoft.Sql/servers/refreshExternalGovernanceStatus/action | Refreshes external governance enablemement status |
> | Microsoft.Sql/servers/administratorOperationResults/read | Gets in-progress operations on server administrators |
> | Microsoft.Sql/servers/administrators/read | Gets a specific Azure Active Directory administrator object |
> | Microsoft.Sql/servers/administrators/write | Adds or updates a specific Azure Active Directory administrator object |
> | Microsoft.Sql/servers/administrators/delete | Deletes a specific Azure Active Directory administrator object |
> | Microsoft.Sql/servers/advancedThreatProtectionSettings/write | Change the server Advanced Threat Protection settings for a given server |
> | Microsoft.Sql/servers/advancedThreatProtectionSettings/read | Retrieve a list of server Advanced Threat Protection settings configured for a given server |
> | Microsoft.Sql/servers/advisors/read | Returns list of advisors available for the server |
> | Microsoft.Sql/servers/advisors/write | Updates auto-execute status of an advisor on server level. |
> | Microsoft.Sql/servers/advisors/recommendedActions/read | Returns list of recommended actions of specified advisor for the server |
> | Microsoft.Sql/servers/advisors/recommendedActions/write | Apply the recommended action on the server |
> | Microsoft.Sql/servers/auditingSettings/read | Retrieve details of the server blob auditing policy configured on a given server |
> | Microsoft.Sql/servers/auditingSettings/write | Change the server blob auditing for a given server |
> | Microsoft.Sql/servers/auditingSettings/operationResults/read | Retrieve result of the server blob auditing policy Set operation |
> | Microsoft.Sql/servers/automaticTuning/read | Returns automatic tuning settings for the server |
> | Microsoft.Sql/servers/automaticTuning/write | Updates automatic tuning settings for the server and returns updated settings |
> | Microsoft.Sql/servers/azureADOnlyAuthentications/read | Reads a specific server Azure Active Directory only authentication object |
> | Microsoft.Sql/servers/azureADOnlyAuthentications/write | Adds or updates a specific server Azure Active Directory only authentication object |
> | Microsoft.Sql/servers/azureADOnlyAuthentications/delete | Deletes a specific server Azure Active Directory only authentication object |
> | Microsoft.Sql/servers/communicationLinks/read | Return the list of communication links of a specified server. |
> | Microsoft.Sql/servers/communicationLinks/write | Create or update a server communication link. |
> | Microsoft.Sql/servers/communicationLinks/delete | Deletes an existing server communication link. |
> | Microsoft.Sql/servers/connectionPolicies/read | Return the list of server connection policies of a specified server. |
> | Microsoft.Sql/servers/connectionPolicies/write | Create or update a server connection policy. |
> | Microsoft.Sql/servers/databases/read | Return the list of databases or gets the properties for the specified database. |
> | Microsoft.Sql/servers/databases/write | Creates a database with the specified parameters or update the properties or tags for the specified database. |
> | Microsoft.Sql/servers/databases/delete | Deletes an existing database. |
> | Microsoft.Sql/servers/databases/pause/action | Pause Azure SQL Datawarehouse Database |
> | Microsoft.Sql/servers/databases/resume/action | Resume Azure SQL Datawarehouse Database |
> | Microsoft.Sql/servers/databases/export/action | Export Azure SQL Database |
> | Microsoft.Sql/servers/databases/upgradeDataWarehouse/action | Upgrade Azure SQL Datawarehouse Database |
> | Microsoft.Sql/servers/databases/move/action | Change the name of an existing database. |
> | Microsoft.Sql/servers/databases/restorePoints/action | Creates a new restore point |
> | Microsoft.Sql/servers/databases/import/action | Import Azure SQL Database |
> | Microsoft.Sql/servers/databases/failover/action | Customer initiated database failover. |
> | Microsoft.Sql/servers/databases/vulnerabilityAssessmentScans/action | Execute vulnerability assessment database scan. |
> | Microsoft.Sql/servers/databases/advancedThreatProtectionSettings/write | Change the database Advanced Threat Protection settings for a given database |
> | Microsoft.Sql/servers/databases/advancedThreatProtectionSettings/read | Retrieve a list of database Advanced Threat Protection settings configured for a given database |
> | Microsoft.Sql/servers/databases/advisors/read | Returns list of advisors available for the database |
> | Microsoft.Sql/servers/databases/advisors/write | Update auto-execute status of an advisor on database level. |
> | Microsoft.Sql/servers/databases/advisors/recommendedActions/read | Returns list of recommended actions of specified advisor for the database |
> | Microsoft.Sql/servers/databases/advisors/recommendedActions/write | Apply the recommended action on the database |
> | Microsoft.Sql/servers/databases/auditingSettings/read | Retrieve details of the blob auditing policy configured on a given database |
> | Microsoft.Sql/servers/databases/auditingSettings/write | Change the blob auditing policy for a given database |
> | Microsoft.Sql/servers/databases/auditRecords/read | Retrieve the database blob audit records |
> | Microsoft.Sql/servers/databases/automaticTuning/read | Returns automatic tuning settings for a database |
> | Microsoft.Sql/servers/databases/automaticTuning/write | Updates automatic tuning settings for a database and returns updated settings |
> | Microsoft.Sql/servers/databases/azureAsyncOperation/read | Gets the status of a database operation. |
> | Microsoft.Sql/servers/databases/backupLongTermRetentionPolicies/write | Sets a long term retention policy for a database |
> | Microsoft.Sql/servers/databases/backupLongTermRetentionPolicies/read | Gets a long term retention policy for a database |
> | Microsoft.Sql/servers/databases/backupShortTermRetentionPolicies/read | Gets a short term retention policy for a database |
> | Microsoft.Sql/servers/databases/backupShortTermRetentionPolicies/write | Updates a short term retention policy for a database |
> | Microsoft.Sql/servers/databases/columns/read | Return a list of columns for a database |
> | Microsoft.Sql/servers/databases/currentSensitivityLabels/read | List sensitivity labels of a given database |
> | Microsoft.Sql/servers/databases/currentSensitivityLabels/write | Batch update sensitivity labels |
> | Microsoft.Sql/servers/databases/dataMaskingPolicies/read | Return the list of database data masking policies. |
> | Microsoft.Sql/servers/databases/dataMaskingPolicies/write | Change data masking policy for a given database |
> | Microsoft.Sql/servers/databases/dataMaskingPolicies/rules/read | Retrieve details of the data masking policy rule configured on a given database |
> | Microsoft.Sql/servers/databases/dataMaskingPolicies/rules/write | Change data masking policy rule for a given database |
> | Microsoft.Sql/servers/databases/dataWarehouseQueries/read | Returns the data warehouse distribution query information for selected query ID |
> | Microsoft.Sql/servers/databases/dataWarehouseQueries/dataWarehouseQuerySteps/read | Returns the distributed query step information of data warehouse query for selected step ID |
> | Microsoft.Sql/servers/databases/dataWarehouseUserActivities/read | Retrieves the user activities of a SQL Data Warehouse instance which includes running and suspended queries |
> | Microsoft.Sql/servers/databases/encryptionProtector/revalidate/action | Revalidate the database encryption protector |
> | Microsoft.Sql/servers/databases/encryptionProtector/revert/action | Revertthe database encryption protector |
> | Microsoft.Sql/servers/databases/extendedAuditingSettings/read | Retrieve details of the extended blob auditing policy configured on a given database |
> | Microsoft.Sql/servers/databases/extendedAuditingSettings/write | Change the extended blob auditing policy for a given database |
> | Microsoft.Sql/servers/databases/extensions/write | Performs a database extension operation. |
> | Microsoft.Sql/servers/databases/extensions/read | Get database extensions operation. |
> | Microsoft.Sql/servers/databases/extensions/importExtensionOperationResults/read | Gets in-progress import operations |
> | Microsoft.Sql/servers/databases/geoBackupPolicies/read | Retrieve geo backup policies for a given database |
> | Microsoft.Sql/servers/databases/geoBackupPolicies/write | Create or update a database geobackup policy |
> | Microsoft.Sql/servers/databases/importExportAzureAsyncOperation/read | Gets in-progress import/export operations |
> | Microsoft.Sql/servers/databases/importExportOperationResults/read | Gets in-progress import/export operations |
> | Microsoft.Sql/servers/databases/ledgerDigestUploads/read | Read ledger digest upload settings |
> | Microsoft.Sql/servers/databases/ledgerDigestUploads/write | Enable uploading ledger digests  |
> | Microsoft.Sql/servers/databases/ledgerDigestUploads/disable/action | Disable uploading ledger digests |
> | Microsoft.Sql/servers/databases/linkWorkspaces/read | Return the list of synapselink workspaces for the specified database |
> | Microsoft.Sql/servers/databases/maintenanceWindowOptions/read | Gets a list of available maintenance windows for a selected database. |
> | Microsoft.Sql/servers/databases/maintenanceWindows/read | Gets maintenance windows settings for a selected database. |
> | Microsoft.Sql/servers/databases/maintenanceWindows/write | Sets maintenance windows settings for a selected database. |
> | Microsoft.Sql/servers/databases/metricDefinitions/read | Return types of metrics that are available for databases |
> | Microsoft.Sql/servers/databases/metrics/read | Return metrics for databases |
> | Microsoft.Sql/servers/databases/operationResults/read | Gets the status of a database operation. |
> | Microsoft.Sql/servers/databases/operations/cancel/action | Cancels Azure SQL Database pending asynchronous operation that is not finished yet. |
> | Microsoft.Sql/servers/databases/operations/read | Return the list of operations performed on the database |
> | Microsoft.Sql/servers/databases/providers/Microsoft.Insights/diagnosticSettings/read | Gets the diagnostic setting for the resource |
> | Microsoft.Sql/servers/databases/providers/Microsoft.Insights/diagnosticSettings/write | Creates or updates the diagnostic setting for the resource |
> | Microsoft.Sql/servers/databases/providers/Microsoft.Insights/logDefinitions/read | Gets the available logs for databases |
> | Microsoft.Sql/servers/databases/providers/Microsoft.Insights/metricDefinitions/read | Return types of metrics that are available for databases |
> | Microsoft.Sql/servers/databases/queryStore/read | Returns current values of Query Store settings for the database. |
> | Microsoft.Sql/servers/databases/queryStore/write | Updates Query Store setting for the database |
> | Microsoft.Sql/servers/databases/queryStore/queryTexts/read | Returns the collection of query texts that correspond to the specified parameters. |
> | Microsoft.Sql/servers/databases/recommendedSensitivityLabels/read | List the recommended sensitivity labels for a given database |
> | Microsoft.Sql/servers/databases/recommendedSensitivityLabels/write | Batch update recommended sensitivity labels |
> | Microsoft.Sql/servers/databases/replicationLinks/read | Return the list of replication links or gets the properties for the specified replication links. |
> | Microsoft.Sql/servers/databases/replicationLinks/write | Updates the replication link type |
> | Microsoft.Sql/servers/databases/replicationLinks/delete | Execute deletion of an existing replication link. |
> | Microsoft.Sql/servers/databases/replicationLinks/failover/action | Execute planned failover of an existing replication link. |
> | Microsoft.Sql/servers/databases/replicationLinks/forceFailoverAllowDataLoss/action | Execute forced failover of an existing replication link. |
> | Microsoft.Sql/servers/databases/replicationLinks/updateReplicationMode/action | Update replication mode for link to synchronous or asynchronous mode |
> | Microsoft.Sql/servers/databases/replicationLinks/unlink/action | Terminate the replication relationship forcefully or after synchronizing with the partner |
> | Microsoft.Sql/servers/databases/restorePoints/read | Returns restore points for the database. |
> | Microsoft.Sql/servers/databases/restorePoints/delete | Deletes a restore point for the database. |
> | Microsoft.Sql/servers/databases/schemas/read | Get a database schema. |
> | Microsoft.Sql/servers/databases/schemas/tables/read | Get a database table. |
> | Microsoft.Sql/servers/databases/schemas/tables/columns/read | Get a database column. |
> | Microsoft.Sql/servers/databases/schemas/tables/columns/sensitivityLabels/enable/action | Enable sensitivity recommendations on a given column |
> | Microsoft.Sql/servers/databases/schemas/tables/columns/sensitivityLabels/disable/action | Disable sensitivity recommendations on a given column |
> | Microsoft.Sql/servers/databases/schemas/tables/columns/sensitivityLabels/read | Get the sensitivity label of a given column |
> | Microsoft.Sql/servers/databases/schemas/tables/columns/sensitivityLabels/write | Create or update the sensitivity label of a given column |
> | Microsoft.Sql/servers/databases/schemas/tables/columns/sensitivityLabels/delete | Delete the sensitivity label of a given column |
> | Microsoft.Sql/servers/databases/schemas/tables/recommendedIndexes/read | Retrieve list of index recommendations on a database |
> | Microsoft.Sql/servers/databases/schemas/tables/recommendedIndexes/write | Apply index recommendation |
> | Microsoft.Sql/servers/databases/securityAlertPolicies/write | Change the database threat detection policy for a given database |
> | Microsoft.Sql/servers/databases/securityAlertPolicies/read | Retrieve a list of database threat detection policies configured for a given server |
> | Microsoft.Sql/servers/databases/securityMetrics/read | Gets a collection of database security metrics |
> | Microsoft.Sql/servers/databases/sensitivityLabels/read | List sensitivity labels of a given database |
> | Microsoft.Sql/servers/databases/serviceTierAdvisors/read | Return suggestion about scaling database up or down based on query execution statistics to improve performance or reduce cost |
> | Microsoft.Sql/servers/databases/skus/read | Gets a collection of skus available for a database |
> | Microsoft.Sql/servers/databases/sqlVulnerabilityAssessments/read | Retrieve SQL Vulnerability Assessment policies on a given database |
> | Microsoft.Sql/servers/databases/sqlVulnerabilityAssessments/initiateScan/action | Execute vulnerability assessment database scan. |
> | Microsoft.Sql/servers/databases/sqlVulnerabilityAssessments/baselines/write | Change the sql vulnerability assessment baseline set for a given database |
> | Microsoft.Sql/servers/databases/sqlVulnerabilityAssessments/baselines/read | List the Sql Vulnerability Assessment baseline set by Sql Vulnerability Assessments |
> | Microsoft.Sql/servers/databases/sqlVulnerabilityAssessments/baselines/rules/delete | Remove the sql vulnerability assessment rule baseline for a given database |
> | Microsoft.Sql/servers/databases/sqlVulnerabilityAssessments/baselines/rules/write | Change the sql vulnerability assessment rule baseline for a given database |
> | Microsoft.Sql/servers/databases/sqlVulnerabilityAssessments/baselines/rules/read | Get the sql vulnerability assessment rule baseline list for a given database |
> | Microsoft.Sql/servers/databases/sqlVulnerabilityAssessments/scans/read | Retrieve the scan record of the database SQL vulnerability assessment scan |
> | Microsoft.Sql/servers/databases/sqlVulnerabilityAssessments/scans/scanResults/read | Retrieve the scan results of the database SQL vulnerability assessment scan |
> | Microsoft.Sql/servers/databases/syncGroups/refreshHubSchema/action | Refresh sync hub database schema |
> | Microsoft.Sql/servers/databases/syncGroups/cancelSync/action | Cancel sync group synchronization |
> | Microsoft.Sql/servers/databases/syncGroups/triggerSync/action | Trigger sync group synchronization |
> | Microsoft.Sql/servers/databases/syncGroups/read | Return the list of sync groups or gets the properties for the specified sync group. |
> | Microsoft.Sql/servers/databases/syncGroups/write | Creates a sync group with the specified parameters or update the properties for the specified sync group. |
> | Microsoft.Sql/servers/databases/syncGroups/delete | Deletes an existing sync group. |
> | Microsoft.Sql/servers/databases/syncGroups/hubSchemas/read | Return the list of sync hub database schemas |
> | Microsoft.Sql/servers/databases/syncGroups/logs/read | Return the list of sync group logs |
> | Microsoft.Sql/servers/databases/syncGroups/refreshHubSchemaOperationResults/read | Retrieve result of the sync hub schema refresh operation |
> | Microsoft.Sql/servers/databases/syncGroups/syncMembers/read | Return the list of sync members or gets the properties for the specified sync member. |
> | Microsoft.Sql/servers/databases/syncGroups/syncMembers/write | Creates a sync member with the specified parameters or update the properties for the specified sync member. |
> | Microsoft.Sql/servers/databases/syncGroups/syncMembers/delete | Deletes an existing sync member. |
> | Microsoft.Sql/servers/databases/syncGroups/syncMembers/refreshSchema/action | Refresh sync member schema |
> | Microsoft.Sql/servers/databases/syncGroups/syncMembers/refreshSchemaOperationResults/read | Retrieve result of the sync member schema refresh operation |
> | Microsoft.Sql/servers/databases/syncGroups/syncMembers/schemas/read | Return the list of sync member database schemas |
> | Microsoft.Sql/servers/databases/topQueries/queryText/action | Returns the Transact-SQL text for selected query ID |
> | Microsoft.Sql/servers/databases/topQueries/read | Returns aggregated runtime statistics for selected query in selected time period |
> | Microsoft.Sql/servers/databases/topQueries/statistics/read | Returns aggregated runtime statistics for selected query in selected time period |
> | Microsoft.Sql/servers/databases/transparentDataEncryption/read | Retrieve details of the logical database Transparent Data Encryption on a given managed database |
> | Microsoft.Sql/servers/databases/transparentDataEncryption/write | Change the database Transparent Data Encryption for a given logical database |
> | Microsoft.Sql/servers/databases/transparentDataEncryption/operationResults/read | Gets in-progress operations on transparent data encryption |
> | Microsoft.Sql/servers/databases/usages/read | Gets the Azure SQL Database usages information |
> | Microsoft.Sql/servers/databases/vulnerabilityAssessments/write | Change the vulnerability assessment for a given database |
> | Microsoft.Sql/servers/databases/vulnerabilityAssessments/delete | Remove the vulnerability assessment for a given database |
> | Microsoft.Sql/servers/databases/vulnerabilityAssessments/read | Retrieve the vulnerability assessment policies on a givendatabase |
> | Microsoft.Sql/servers/databases/vulnerabilityAssessments/rules/baselines/delete | Remove the vulnerability assessment rule baseline for a given database |
> | Microsoft.Sql/servers/databases/vulnerabilityAssessments/rules/baselines/write | Change the vulnerability assessment rule baseline for a given database |
> | Microsoft.Sql/servers/databases/vulnerabilityAssessments/rules/baselines/read | Get the vulnerability assessment rule baseline for a given database |
> | Microsoft.Sql/servers/databases/vulnerabilityAssessments/scans/initiateScan/action | Execute vulnerability assessment database scan. |
> | Microsoft.Sql/servers/databases/vulnerabilityAssessments/scans/read | Return the list of database vulnerability assessment scan records or get the scan record for the specified scan ID. |
> | Microsoft.Sql/servers/databases/vulnerabilityAssessments/scans/export/action | Convert an existing scan result to a human readable format. If already exists nothing happens |
> | Microsoft.Sql/servers/databases/vulnerabilityAssessmentScans/operationResults/read | Retrieve the result of the database vulnerability assessment scan Execute operation |
> | Microsoft.Sql/servers/databases/vulnerabilityAssessmentSettings/read | Retrieve details of the vulnerability assessment configured on a given database |
> | Microsoft.Sql/servers/databases/vulnerabilityAssessmentSettings/write | Change the vulnerability assessment for a given database |
> | Microsoft.Sql/servers/databases/workloadGroups/read | Lists the workload groups for a selected database. |
> | Microsoft.Sql/servers/databases/workloadGroups/write | Sets the properties for a specific workload group. |
> | Microsoft.Sql/servers/databases/workloadGroups/delete | Drops a specific workload group. |
> | Microsoft.Sql/servers/databases/workloadGroups/workloadClassifiers/read | Lists the workload classifiers for a selected database. |
> | Microsoft.Sql/servers/databases/workloadGroups/workloadClassifiers/write | Sets the properties for a specific workload classifier. |
> | Microsoft.Sql/servers/databases/workloadGroups/workloadClassifiers/delete | Drops a specific workload classifier. |
> | Microsoft.Sql/servers/devOpsAuditingSettings/read | Retrieve details of the server DevOps audit policy configured on a given server |
> | Microsoft.Sql/servers/devOpsAuditingSettings/write | Change the server DevOps audit policy for a given server |
> | Microsoft.Sql/servers/disasterRecoveryConfiguration/read | Gets a collection of disaster recovery configurations that include this server |
> | Microsoft.Sql/servers/disasterRecoveryConfiguration/write | Change server disaster recovery configuration |
> | Microsoft.Sql/servers/disasterRecoveryConfiguration/delete | Deletes an existing disaster recovery configurations for a given server |
> | Microsoft.Sql/servers/disasterRecoveryConfiguration/failover/action | Failover a DisasterRecoveryConfiguration |
> | Microsoft.Sql/servers/disasterRecoveryConfiguration/forceFailoverAllowDataLoss/action | Force Failover a DisasterRecoveryConfiguration |
> | Microsoft.Sql/servers/dnsAliases/read | Return the list of Server Dns Aliases for the specified server. |
> | Microsoft.Sql/servers/dnsAliases/write | Creates a Server Dns Alias with the specified parameters or update the properties or tags for the specified Server Dns Alias. |
> | Microsoft.Sql/servers/dnsAliases/delete | Deletes an existing Server Dns Alias. |
> | Microsoft.Sql/servers/dnsAliases/acquire/action | Acquire Server Dns Alias from the current server and repoint it to another server. |
> | Microsoft.Sql/servers/elasticPoolEstimates/read | Returns list of elastic pool estimates already created for this server |
> | Microsoft.Sql/servers/elasticPoolEstimates/write | Creates new elastic pool estimate for list of databases provided |
> | Microsoft.Sql/servers/elasticPools/read | Retrieve details of elastic pool on a given server |
> | Microsoft.Sql/servers/elasticPools/write | Create a new or change properties of existing elastic pool |
> | Microsoft.Sql/servers/elasticPools/delete | Delete existing elastic pool |
> | Microsoft.Sql/servers/elasticPools/failover/action | Customer initiated elastic pool failover. |
> | Microsoft.Sql/servers/elasticPools/advisors/read | Returns list of advisors available for the elastic pool |
> | Microsoft.Sql/servers/elasticPools/advisors/write | Update auto-execute status of an advisor on elastic pool level. |
> | Microsoft.Sql/servers/elasticPools/advisors/recommendedActions/read | Returns list of recommended actions of specified advisor for the elastic pool |
> | Microsoft.Sql/servers/elasticPools/advisors/recommendedActions/write | Apply the recommended action on the elastic pool |
> | Microsoft.Sql/servers/elasticPools/databases/read | Gets a list of databases for an elastic pool |
> | Microsoft.Sql/servers/elasticPools/elasticPoolActivity/read | Retrieve activities and details on a given elastic database pool |
> | Microsoft.Sql/servers/elasticPools/elasticPoolDatabaseActivity/read | Retrieve activities and details on a given database that is part of elastic database pool |
> | Microsoft.Sql/servers/elasticPools/metricDefinitions/read | Return types of metrics that are available for elastic database pools |
> | Microsoft.Sql/servers/elasticPools/metrics/read | Return metrics for elastic database pools |
> | Microsoft.Sql/servers/elasticPools/operations/cancel/action | Cancels Azure SQL elastic pool pending asynchronous operation that is not finished yet. |
> | Microsoft.Sql/servers/elasticPools/operations/read | Return the list of operations performed on the elastic pool |
> | Microsoft.Sql/servers/elasticPools/providers/Microsoft.Insights/diagnosticSettings/read | Gets the diagnostic setting for the resource |
> | Microsoft.Sql/servers/elasticPools/providers/Microsoft.Insights/diagnosticSettings/write | Creates or updates the diagnostic setting for the resource |
> | Microsoft.Sql/servers/elasticPools/providers/Microsoft.Insights/metricDefinitions/read | Return types of metrics that are available for elastic database pools |
> | Microsoft.Sql/servers/elasticPools/skus/read | Gets a collection of skus available for an elastic pool |
> | Microsoft.Sql/servers/encryptionProtector/revalidate/action | Update the properties for the specified Server Encryption Protector. |
> | Microsoft.Sql/servers/encryptionProtector/read | Returns a list of server encryption protectors or gets the properties for the specified server encryption protector. |
> | Microsoft.Sql/servers/encryptionProtector/write | Update the properties for the specified Server Encryption Protector. |
> | Microsoft.Sql/servers/extendedAuditingSettings/read | Retrieve details of the extended server blob auditing policy configured on a given server |
> | Microsoft.Sql/servers/extendedAuditingSettings/write | Change the extended server blob auditing for a given server |
> | Microsoft.Sql/servers/externalPolicyBasedAuthorizations/read | Reads a specific server external policy based authorization property |
> | Microsoft.Sql/servers/externalPolicyBasedAuthorizations/write | Adds or updates a specific server external policy based authorization property |
> | Microsoft.Sql/servers/externalPolicyBasedAuthorizations/delete | Deletes a specific server external policy based authorization property |
> | Microsoft.Sql/servers/failoverGroups/read | Returns the list of failover groups or gets the properties for the specified failover group. |
> | Microsoft.Sql/servers/failoverGroups/write | Creates a failover group with the specified parameters or updates the properties or tags for the specified failover group. |
> | Microsoft.Sql/servers/failoverGroups/delete | Deletes an existing failover group. |
> | Microsoft.Sql/servers/failoverGroups/failover/action | Executes planned failover in an existing failover group. |
> | Microsoft.Sql/servers/failoverGroups/forceFailoverAllowDataLoss/action | Executes forced failover in an existing failover group. |
> | Microsoft.Sql/servers/failoverGroups/tryPlannedBeforeForcedFailover/action | Executes try planned before forced failover in an existing failover group. |
> | Microsoft.Sql/servers/firewallRules/write | Creates a server firewall rule with the specified parameters, update the properties for the specified rule or overwrite all existing rules with new server firewall rule(s). |
> | Microsoft.Sql/servers/firewallRules/read | Return the list of server firewall rules or gets the properties for the specified server firewall rule. |
> | Microsoft.Sql/servers/firewallRules/delete | Deletes an existing server firewall rule. |
> | Microsoft.Sql/servers/importExportOperationResults/read | Gets in-progress import/export operations |
> | Microsoft.Sql/servers/inaccessibleDatabases/read | Return a list of inaccessible database(s) in a logical server. |
> | Microsoft.Sql/servers/ipv6FirewallRules/write | Creates a IPv6 server firewall rule with the specified parameters, update the properties for the specified rule or overwrite all existing rules with new server firewall rule(s). |
> | Microsoft.Sql/servers/ipv6FirewallRules/read | Return the list of IPv6 server firewall rules or gets the properties for the specified server firewall rule. |
> | Microsoft.Sql/servers/ipv6FirewallRules/delete | Deletes an existing IPv6 server firewall rule. |
> | Microsoft.Sql/servers/jobAgents/read | Gets an Azure SQL DB job agent |
> | Microsoft.Sql/servers/jobAgents/write | Creates or updates an Azure SQL DB job agent |
> | Microsoft.Sql/servers/jobAgents/delete | Deletes an Azure SQL DB job agent |
> | Microsoft.Sql/servers/jobAgents/credentials/read | Gets an Azure SQL DB job credential |
> | Microsoft.Sql/servers/jobAgents/credentials/write | Creates or updates an Azure SQL DB job credential |
> | Microsoft.Sql/servers/jobAgents/credentials/delete | Deletes an Azure SQL DB job credential |
> | Microsoft.Sql/servers/jobAgents/executions/read | Gets all the job executions for the job agent |
> | Microsoft.Sql/servers/jobAgents/jobs/read | Gets an Azure SQL DB job |
> | Microsoft.Sql/servers/jobAgents/jobs/write | Creates or updates an Azure SQL DB job |
> | Microsoft.Sql/servers/jobAgents/jobs/delete | Deletes an Azure SQL DB job |
> | Microsoft.Sql/servers/jobAgents/jobs/executions/read | Get a job execution |
> | Microsoft.Sql/servers/jobAgents/jobs/executions/write | Creates or updates a job execution |
> | Microsoft.Sql/servers/jobAgents/jobs/executions/steps/read | Get a job step execution |
> | Microsoft.Sql/servers/jobAgents/jobs/executions/steps/targets/read | Get a target executoin |
> | Microsoft.Sql/servers/jobAgents/jobs/executions/targets/read | Gets the job target executions for a job execution |
> | Microsoft.Sql/servers/jobAgents/jobs/steps/read | Get a job step |
> | Microsoft.Sql/servers/jobAgents/jobs/steps/write | Create or update a job step |
> | Microsoft.Sql/servers/jobAgents/jobs/steps/delete | Delete a job step |
> | Microsoft.Sql/servers/jobAgents/jobs/versions/read | Get a job version |
> | Microsoft.Sql/servers/jobAgents/jobs/versions/steps/read | Gets the job step version |
> | Microsoft.Sql/servers/jobAgents/privateEndpoints/read | Get a private endpoint |
> | Microsoft.Sql/servers/jobAgents/privateEndpoints/write | Create or update a private endpoint |
> | Microsoft.Sql/servers/jobAgents/privateEndpoints/delete | Delete a private endpoint |
> | Microsoft.Sql/servers/jobAgents/targetGroups/read | Get a target group |
> | Microsoft.Sql/servers/jobAgents/targetGroups/write | Create or update a target group |
> | Microsoft.Sql/servers/jobAgents/targetGroups/delete | Delete a target group |
> | Microsoft.Sql/servers/keys/read | Return the list of server keys or gets the properties for the specified server key. |
> | Microsoft.Sql/servers/keys/write | Creates a key with the specified parameters or update the properties or tags for the specified server key. |
> | Microsoft.Sql/servers/keys/delete | Deletes an existing server key. |
> | Microsoft.Sql/servers/networkSecurityPerimeterAssociationProxies/read | Get network security perimeter association |
> | Microsoft.Sql/servers/networkSecurityPerimeterAssociationProxies/write | Create network security perimeter association |
> | Microsoft.Sql/servers/networkSecurityPerimeterAssociationProxies/delete | Drop network security perimeter association |
> | Microsoft.Sql/servers/networkSecurityPerimeterConfigurations/read | Get sql server network security perimeter effective configuration |
> | Microsoft.Sql/servers/networkSecurityPerimeterConfigurations/reconcile/action | Reconcile Network Security Perimeter |
> | Microsoft.Sql/servers/operationResults/read | Gets in-progress server operations |
> | Microsoft.Sql/servers/operations/read | Return the list of operations performed on the server |
> | Microsoft.Sql/servers/outboundFirewallRules/read | Read outbound firewall rule |
> | Microsoft.Sql/servers/outboundFirewallRules/delete | Delete outbound firewall rule |
> | Microsoft.Sql/servers/outboundFirewallRules/write | Create outbound firewall rule |
> | Microsoft.Sql/servers/privateEndpointConnectionProxies/updatePrivateEndpointProperties/action | Used by NRP to backfill properties to a private endpoint connection |
> | Microsoft.Sql/servers/privateEndpointConnectionProxies/validate/action | Validates a private endpoint connection create call from NRP side |
> | Microsoft.Sql/servers/privateEndpointConnectionProxies/read | Returns the list of private endpoint connection proxies or gets the properties for the specified private endpoint connection proxy. |
> | Microsoft.Sql/servers/privateEndpointConnectionProxies/write | Creates a private endpoint connection proxy with the specified parameters or updates the properties or tags for the specified private endpoint connection proxy. |
> | Microsoft.Sql/servers/privateEndpointConnectionProxies/delete | Deletes an existing private endpoint connection proxy |
> | Microsoft.Sql/servers/privateEndpointConnections/read | Returns the list of private endpoint connections or gets the properties for the specified private endpoint connection. |
> | Microsoft.Sql/servers/privateEndpointConnections/delete | Deletes an existing private endpoint connection |
> | Microsoft.Sql/servers/privateEndpointConnections/write | Approves or rejects an existing private endpoint connection |
> | Microsoft.Sql/servers/privateLinkResources/read | Get the private link resources for the corresponding sql server |
> | Microsoft.Sql/servers/providers/Microsoft.Insights/metricDefinitions/read | Return types of metrics that are available for servers |
> | Microsoft.Sql/servers/recommendedElasticPools/read | Retrieve recommendation for elastic database pools to reduce cost or improve performance based on historical resource utilization |
> | Microsoft.Sql/servers/recommendedElasticPools/databases/read | Retrieve metrics for recommended elastic database pools for a given server |
> | Microsoft.Sql/servers/recoverableDatabases/read | Return the list of recoverable databases or gets the properties for the specified recoverable database. |
> | Microsoft.Sql/servers/replicationLinks/read | Return the list of replication links or gets the properties for the specified replication links. |
> | Microsoft.Sql/servers/restorableDroppedDatabases/read | Get a list of databases that were dropped on a given server that are still within retention policy. |
> | Microsoft.Sql/servers/securityAlertPolicies/write | Change the server threat detection policy for a given server |
> | Microsoft.Sql/servers/securityAlertPolicies/read | Retrieve a list of server threat detection policies configured for a given server |
> | Microsoft.Sql/servers/securityAlertPolicies/operationResults/read | Retrieve results of the server threat detection policy write operation |
> | Microsoft.Sql/servers/serviceObjectives/read | Retrieve list of service level objectives (also known as performance tiers) available on a given server |
> | Microsoft.Sql/servers/sqlVulnerabilityAssessments/write | Change SQL Vulnerability Assessment for a given server |
> | Microsoft.Sql/servers/sqlVulnerabilityAssessments/delete | Remove SQL Vulnerability Assessment for a given server |
> | Microsoft.Sql/servers/sqlVulnerabilityAssessments/read | Retrieve SQL Vulnerability Assessment policies on a given server |
> | Microsoft.Sql/servers/sqlVulnerabilityAssessments/initiateScan/action | Execute vulnerability assessment database scan. |
> | Microsoft.Sql/servers/sqlVulnerabilityAssessments/baselines/write | Change the sql vulnerability assessment baseline set for a given system database |
> | Microsoft.Sql/servers/sqlVulnerabilityAssessments/baselines/read | Retrieve the Sql Vulnerability Assessment baseline set on a system database |
> | Microsoft.Sql/servers/sqlVulnerabilityAssessments/baselines/rules/read | Get the vulnerability assessment rule baseline for a given database |
> | Microsoft.Sql/servers/sqlVulnerabilityAssessments/baselines/rules/delete | Remove the sql vulnerability assessment rule baseline for a given database |
> | Microsoft.Sql/servers/sqlVulnerabilityAssessments/baselines/rules/write | Change the sql vulnerability assessment rule baseline for a given database |
> | Microsoft.Sql/servers/sqlVulnerabilityAssessments/scans/read | List SQL vulnerability assessment scan records by database. |
> | Microsoft.Sql/servers/sqlVulnerabilityAssessments/scans/scanResults/read | Retrieve the scan results of the database vulnerability assessment scan |
> | Microsoft.Sql/servers/syncAgents/read | Return the list of sync agents or gets the properties for the specified sync agent. |
> | Microsoft.Sql/servers/syncAgents/write | Creates a sync agent with the specified parameters or update the properties for the specified sync agent. |
> | Microsoft.Sql/servers/syncAgents/delete | Deletes an existing sync agent. |
> | Microsoft.Sql/servers/syncAgents/generateKey/action | Generate sync agent registration key |
> | Microsoft.Sql/servers/syncAgents/linkedDatabases/read | Return the list of sync agent linked databases |
> | Microsoft.Sql/servers/usages/read | Gets the Azure SQL Database Server usages information |
> | Microsoft.Sql/servers/virtualNetworkRules/read | Return the list of virtual network rules or gets the properties for the specified virtual network rule. |
> | Microsoft.Sql/servers/virtualNetworkRules/write | Creates a virtual network rule with the specified parameters or update the properties or tags for the specified virtual network rule. |
> | Microsoft.Sql/servers/virtualNetworkRules/delete | Deletes an existing Virtual Network Rule |
> | Microsoft.Sql/servers/vulnerabilityAssessments/write | Change the vulnerability assessment for a given server |
> | Microsoft.Sql/servers/vulnerabilityAssessments/delete | Remove the vulnerability assessment for a given server |
> | Microsoft.Sql/servers/vulnerabilityAssessments/read | Retrieve the vulnerability assessment policies on a given server |
> | Microsoft.Sql/virtualClusters/updateManagedInstanceDnsServers/action | Performs virtual cluster dns servers. |
> | Microsoft.Sql/virtualClusters/read | Return the list of virtual clusters or gets the properties for the specified virtual cluster. |
> | Microsoft.Sql/virtualClusters/write | Creates or updates the virtual clusters. |
> | Microsoft.Sql/virtualClusters/delete | Deletes an existing virtual cluster. |

## Microsoft.SqlVirtualMachine

Host enterprise SQL Server apps in the cloud.

Azure service: [SQL Server on Azure Virtual Machines](/azure/azure-sql/virtual-machines/windows/sql-server-on-azure-vm-iaas-what-is-overview)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.SqlVirtualMachine/register/action | Register subscription with Microsoft.SqlVirtualMachine resource provider |
> | Microsoft.SqlVirtualMachine/unregister/action | Unregister subscription with Microsoft.SqlVirtualMachine resource provider |
> | Microsoft.SqlVirtualMachine/locations/registerSqlVmCandidate/action | Register SQL Vm Candidate |
> | Microsoft.SqlVirtualMachine/locations/availabilityGroupListenerOperationResults/read | Get result of an availability group listener operation |
> | Microsoft.SqlVirtualMachine/locations/sqlVirtualMachineGroupOperationResults/read | Get result of a SQL virtual machine group operation |
> | Microsoft.SqlVirtualMachine/locations/sqlVirtualMachineOperationResults/read | Get result of SQL virtual machine operation |
> | Microsoft.SqlVirtualMachine/operations/read |  |
> | Microsoft.SqlVirtualMachine/sqlVirtualMachineGroups/read | Retrieve details of SQL virtual machine group |
> | Microsoft.SqlVirtualMachine/sqlVirtualMachineGroups/write | Create a new or change properties of existing SQL virtual machine group |
> | Microsoft.SqlVirtualMachine/sqlVirtualMachineGroups/delete | Delete existing SQL virtual machine group |
> | Microsoft.SqlVirtualMachine/sqlVirtualMachineGroups/availabilityGroupListeners/read | Retrieve details of SQL availability group listener on a given SQL virtual machine group |
> | Microsoft.SqlVirtualMachine/sqlVirtualMachineGroups/availabilityGroupListeners/write | Create a new or changes properties of existing SQL availability group listener |
> | Microsoft.SqlVirtualMachine/sqlVirtualMachineGroups/availabilityGroupListeners/delete | Delete existing availability group listener |
> | Microsoft.SqlVirtualMachine/sqlVirtualMachineGroups/sqlVirtualMachines/read | List Sql virtual machines by a particular sql virtual virtual machine group |
> | Microsoft.SqlVirtualMachine/sqlVirtualMachines/startAssessment/action | Start SQL best practices Assessment on SQL virtual machine |
> | Microsoft.SqlVirtualMachine/sqlVirtualMachines/redeploy/action | Redeploy existing SQL virtual machine |
> | Microsoft.SqlVirtualMachine/sqlVirtualMachines/read | Retrieve details of SQL virtual machine |
> | Microsoft.SqlVirtualMachine/sqlVirtualMachines/write | Create a new or change properties of existing SQL virtual machine |
> | Microsoft.SqlVirtualMachine/sqlVirtualMachines/delete | Delete existing SQL virtual machine |
> | Microsoft.SqlVirtualMachine/sqlVirtualMachines/fetchDCAssessment/action | Start SQL best practices Assessment with Disk Config rules on SQL virtual machine |
> | Microsoft.SqlVirtualMachine/sqlVirtualMachines/troubleshoot/action | Start SQL virtual machine troubleshooting operation |

## Next steps

- [Azure resource providers and types](/azure/azure-resource-manager/management/resource-providers-and-types)
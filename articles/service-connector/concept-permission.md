---
title: Service Connector permission requirements
description: See the resource permission requirements for creating connections using Service Connector in Azure.
author: maud-lv
ms.author: malev
ms.service: service-connector
ms.topic: concept-article
ms.date: 03/27/2026
#customer intent: As an Azure developer, I want to see required Service Connector permissions so I can use Service Connector to connect my Azure services.
---

# Service Connector permission requirements

Service Connector creates connections between Azure services using an [on-behalf-of tokens](/entra/identity-platform/v2-oauth2-on-behalf-of-flow). When you use Service Connector to create connections between Azure services, you must ensure that the necessary permissions are granted. This article outlines the Service Connector permission requirements for various Azure resources.

## App service connections

The following permissions apply to service connections for Azure app-related services.

### Azure App Service web app


| Action | Description |
| --- | --- |
|`Microsoft.Web/sites/config/write`|Update web app configuration settings.|
|`Microsoft.web/sites/config/delete`|Delete web app config.| 
|`Microsoft.Web/sites/config/list/action`|List web app security sensitive settings, such as publishing credentials, app settings, and connection strings.|
|`Microsoft.Web/sites/config/Read`|Get web app configuration settings.|
|`Microsoft.Web/sites/write`|Create a new web app or update an existing one.|
|`Microsoft.Web/sites/read`|Get the properties of a web app.|

### App Service webapp slot
 

| Action | Description |
| --- | --- |
|`Microsoft.Web/sites/slots/Write`|Create a new web app slot or update an existing one.|
|`Microsoft.Web/sites/slots/Read`|Get the properties of a web app deployment slot.|
|`Microsoft.Web/sites/slots/config/Read`|Get web app slot configuration settings.|
|`Microsoft.Web/sites/slots/config/Write`|Update web app slot configuration settings.|
|`Microsoft.web/sites/slots/config/delete`|Delete web app slot config.|
|`Microsoft.Web/sites/slots/config/list/Action`|List web app slot security sensitive settings, such as publishing credentials, app settings, and connection strings.|

### Azure App Configuration


| Action | Description |
| --- | --- |
|`Microsoft.AppConfiguration/configurationStores/ListKeys/action`|List the API keys for the specified configuration store.|
|`Microsoft.AppConfiguration/configurationStores/read`|Get the properties of the specified configuration store or list all the configuration stores under the specified resource group or subscription.|

### Azure Container Apps


| Action | Description |
| --- | --- |
|`Microsoft.App/containerApps/read`|Get a container app.|
|`Microsoft.App/containerApps/write`|Create or update a container app.|
|`Microsoft.App/containerApps/listsecrets/action`|List secrets of a container app.|
|`Microsoft.App/managedEnvironments/read`|Get a managed environment.|
|`Microsoft.App/locations/managedEnvironmentOperationStatuses/read`|Get a managed environment long running operation status.|
|`microsoft.app/locations/containerappoperationstatuses/read`|Get a container app long running operation status.|
|`microsoft.app/locations/containerappoperationresults/read`|Get a container app long running operation result.|
|`microsoft.app/locations/managedenvironmentoperationresults/read`|Get a managed environment long running operation result.|

### Azure Container Apps Distributed Application Runtime (Dapr)


| Action | Description |
| --- | --- |
|`Microsoft.App/managedEnvironments/daprComponents/read`|Read a managed environment Dapr component.|
|`Microsoft.App/managedEnvironments/daprComponents/write`|Create or update a managed environment Dapr component.|
|`Microsoft.App/managedEnvironments/daprComponents/delete`|Delete a managed environment Dapr component.|

### Azure Cache for Redis (Basic/Standard/Premium)


| Action | Description |
| --- | --- |
|`Microsoft.Cache/redis/read`|View the Redis cache settings and configuration in the management portal.|
|`Microsoft.Cache/redis/firewallRules/read`|Get the IP firewall rules of a Redis cache.|
|`Microsoft.Cache/redis/firewallRules/write`|Edit the IP firewall rules of a Redis cache.|
|`Microsoft.Cache/redis/firewallRules/delete`|Delete IP firewall rules of a Redis cache.|
|`Microsoft.Cache/redis/listKeys/action`|View the value of Redis cache access keys in the management portal.|

### Azure Managed Redis / Azure Cache for Redis Enterprise


| Action | Description |
| --- | --- |
|`Microsoft.Cache/redisEnterprise/read`|View the Redis Enterprise cache settings and configuration in the management portal.|
|`Microsoft.Cache/redisEnterprise/databases/read`|View the Redis Enterprise cache database settings and configuration in the management portal.|
|`Microsoft.Cache/redisEnterprise/databases/listKeys/action`|View the value of Redis Enterprise database access keys in the management portal.|

### Azure Spring Apps


| Action | Description |
| --- | --- |
|`Microsoft.AppPlatform/Spring/read`|Get Azure Spring Apps service instances.|
|`Microsoft.AppPlatform/Spring/apps/read`|Get the applications for a specific Azure Spring Apps instance.|
|`Microsoft.AppPlatform/Spring/apps/write`|Create or update the application for a specific Azure Spring Apps instance.|
|`Microsoft.AppPlatform/Spring/apps/listConnectorProps/action`|Get the connector properties of an Azure Spring Apps application.|
|`Microsoft.AppPlatform/Spring/apps/deployments/*/read`|Get the deployments for a specific application.|
|`Microsoft.AppPlatform/Spring/apps/deployments/*/write`|Create or update the deployment for a specific application.|
|`Microsoft.AppPlatform/Spring/apps/deployments/*/delete`|Delete the deployment for a specific application.|
|`Microsoft.AppPlatform/Spring/apps/deployments/listConnectorProps/action`|Get the connector properties of the deployment for a specific application.|

## Database service connections

The following permissions apply to service connections for Azure database services.

### Azure Cosmos DB


| Action | Description |
| --- | --- |
|`Microsoft.DocumentDB/databaseAccounts/read`|Read a database account.|
|`Microsoft.DocumentDB/databaseAccounts/write`|Update a database accounts.|
|`Microsoft.DocumentDB/databaseAccounts/listConnectionStrings/action`|Get the connection strings for a database account.|
|`Microsoft.DocumentDB/databaseAccounts/listKeys/action`|List keys of a database account.|
|`Microsoft.DocumentDB/databaseAccounts/sqlRoleAssignments/read`|Read a SQL role definition.|
|`Microsoft.DocumentDB/databaseAccounts/sqlRoleAssignments/write`|Create or update a SQL role definition.|
|`Microsoft.DocumentDB/databaseAccounts/sqlRoleAssignments/delete`|Delete a SQL role assignment.|

> [!IMPORTANT]
> Use the most secure authentication flow available. Some authentication flows require a high degree of trust in the application, and carry risks not present in other flows. Use these flows only when other more secure flows, such as managed identities, aren't viable.

### Azure Database for MySQL - Single Server (Legacy)


| Action | Description |
| --- | --- |
|`Microsoft.DBforMySQL/servers/firewallRules/read`|Return the list of firewall rules for a server or get the properties for the specified firewall rule.|
|`Microsoft.DBforMySQL/servers/firewallRules/write`|Create a firewall rule with the specified parameters or update an existing rule.|
|`Microsoft.DBforMySQL/servers/firewallRules/delete`|Delete an existing firewall rule.|
|`Microsoft.DBforMySQL/servers/read`|Return the list of servers or get the properties for the specified server.|
|`Microsoft.DBforMySQL/servers/databases/read`|Return the list of MySQL databases or get the properties for the specified database.|
|`Microsoft.DBforMySQL/servers/write`|Create a server with the specified parameters or update the properties or tags for the specified server.|

### Azure Database for MySQL - Flexible Server


| Action | Description |
| --- | --- |
|`Microsoft.DBforMySQL/flexibleServers/firewallRules/read`|Return the list of firewall rules for a server or get the properties for the specified firewall rule.|
|`Microsoft.DBforMySQL/flexibleServers/firewallRules/write`|Create a firewall rule with the specified parameters or update an existing rule.|
|`Microsoft.DBforMySQL/flexibleServers/firewallRules/delete`|Delete an existing firewall rule.|
|`Microsoft.DBforMySQL/flexibleServers/read`|Return the list of servers or get the properties for the specified server.|
|`Microsoft.DBforMySQL/flexibleServers/databases/read`|Return the list of databases for a server or get the properties for the specified database.|
|`Microsoft.DBforMySQL/flexibleServers/configurations/read`|Return the list of MySQL server configurations or get the configurations for the specified server.|

### Azure Database for MySQL service endpoint


| Action | Description |
| --- | --- |
|`Microsoft.DBforMySQL/servers/virtualNetworkRules/read`|Return the list of virtual network rules or get the properties for the specified virtual network rule.|
|`Microsoft.DBforMySQL/servers/virtualNetworkRules/write`|Create a virtual network rule with the specified parameters or update the properties or tags for the specified virtual network rule.|
|`Microsoft.DBforMySQL/servers/virtualNetworkRules/delete`|Delete an existing virtual network rule.|

### Azure Database for PostgreSQL - Single Server (Legacy)


| Action | Description |
| --- | --- |
|`Microsoft.DBforPostgreSQL/servers/firewallRules/read`|Return the list of firewall rules for a server or get the properties for the specified firewall rule.|
|`Microsoft.DBforPostgreSQL/servers/firewallRules/write`|Create a firewall rule with the specified parameters or update an existing rule.|
|`Microsoft.DBforPostgreSQL/servers/firewallRules/delete`|Delete an existing firewall rule.|
|`Microsoft.DBForPostgreSQL/servers/read`|Return the list of servers or get the properties for the specified server.|
|`Microsoft.DBForPostgreSQL/servers/databases/read`|Return the list of PostgreSQL databases or get the properties for the specified database.|
|`Microsoft.DBforPostgreSQL/servers/write`|Create a server with the specified parameters or update the properties or tags for the specified server.|

### Azure Database for PostgreSQL - Flexible Server


| Action | Description |
| --- | --- |
|`Microsoft.DBforPostgreSQL/flexibleServers/firewallRules/read`|Return the list of firewall rules for a server or get the properties for the specified firewall rule.|
|`Microsoft.DBforPostgreSQL/flexibleServers/firewallRules/write`|Create a firewall rule with the specified parameters or update an existing rule.|
|`Microsoft.DBforPostgreSQL/flexibleServers/firewallRules/delete`|Delete an existing firewall rule.|
|`Microsoft.DBForPostgreSQL/flexibleServers/read`|Return the list of servers or get the properties for the specified server.|
|`Microsoft.DBForPostgreSQL/flexibleServers/databases/read`|Return the list of PostgreSQL server databases or get the database for the specified server.|
|`Microsoft.DBforPostgreSQL/flexibleServers/configurations/read`|Return the list of PostgreSQL server configurations or get the configurations for the specified server.|

### Azure Database for PostgreSQL service endpoint


| Action | Description |
| --- | --- |
|`Microsoft.DBforPostgreSQL/servers/virtualNetworkRules/read`|Return the list of virtual network rules or get the properties for the specified virtual network rule.|
|`Microsoft.DBforPostgreSQL/servers/virtualNetworkRules/write`|Create a virtual network rule with the specified parameters or update the properties or tags for the specified virtual network rule.|
|`Microsoft.DBforPostgreSQL/servers/virtualNetworkRules/delete`|Delete an existing virtual network rule.|

### Azure SQL Database


| Action | Description |
| --- | --- |
|`Microsoft.Sql/servers/firewallRules/read`|Return the list of server firewall rules or get the properties for the specified server firewall rule.|
|`Microsoft.Sql/servers/firewallRules/write`|	Create a server firewall rule with the specified parameters, update the properties for the specified rule, or overwrite all existing rules with new server firewall rules.|
|`Microsoft.Sql/servers/firewallRules/delete`|Delete an existing server firewall rule.|
|`Microsoft.Sql/servers/databases/read`|Return the list of databases or get the properties for the specified database.|
|`Microsoft.Sql/servers/read`|Return the list of servers or get the properties for the specified server.|
|`Microsoft.Sql/servers/virtualNetworkRules/read`|Return the list of virtual network rules or get the properties for the specified virtual network rule.|
|`Microsoft.Sql/servers/virtualNetworkRules/write`|Create a virtual network rule with the specified parameters or update the properties or tags for the specified virtual network rule.|
|`Microsoft.Sql/servers/virtualNetworkRules/delete`|Delete an existing virtual network rule.|

## Other Azure service connections

The following permissions apply to service connections for other Azure services.

### Azure Event Hubs


| Action | Description |
| --- | --- |
|`Microsoft.EventHub/namespaces/read`|Get the list of namespace resource descriptions.|
|`Microsoft.EventHub/namespaces/ipFilterRules/read`|Get an IP filter resource.|
|`Microsoft.EventHub/namespaces/ipFilterRules/write`|Create an IP filter resource.|
|`Microsoft.EventHub/namespaces/ipFilterRules/delete`|Delete an IP filter resource.|
|`Microsoft.EventHub/namespaces/networkrulesets/read`|Get a NetworkRuleSet resource.|
|`Microsoft.EventHub/namespaces/networkrulesets/write`|Create a virtual network rule resource.|
|`Microsoft.EventHub/namespaces/authorizationRules/listkeys/action`|Get the connection string to the namespace.|

### Azure Key Vault


| Action | Description |
| --- | --- |
|`Microsoft.KeyVault/vaults/write`|Create a new key vault or update the properties of an existing key vault. Certain properties may require more permissions.|
|`Microsoft.KeyVault/vaults/read`|View the properties of a key vault.|
|`Microsoft.KeyVault/vaults/secrets/write`|Create a new secret or update the value of an existing secret.|
|`Microsoft.KeyVault/vaults/accessPolicies/write`|Update an existing access policy by merging or replacing, or add a new access policy to the key vault.|

### Azure Service Bus


| Action | Description |
| --- | --- |
|`Microsoft.ServiceBus/namespaces/read`|Get the list of namespace resource descriptions.|
|`Microsoft.ServiceBus/namespaces/ipFilterRules/read`|Get an IP filter resource.|
|`Microsoft.ServiceBus/namespaces/ipFilterRules/write`|Create an IP filter resource.|
|`Microsoft.ServiceBus/namespaces/ipFilterRules/delete`|Delete an IP filter resource.|
|`Microsoft.ServiceBus/namespaces/authorizationRules/listkeys/action`|Get the connection string to the namespace.|
|`Microsoft.ServiceBus/namespaces/networkrulesets/read`|Get a NetworkRuleSet resource.|
|`Microsoft.ServiceBus/namespaces/networkrulesets/write`|Create a virtual network rule resource.|

### Azure SignalR Service 


| Action | Description |
| --- | --- |
|`Microsoft.SignalRService/SignalR/read`|View the SignalR settings and configurations in the management portal or through API.|
|`Microsoft.SignalRService/SignalR/write`|Modify the SignalR settings and configurations in the management portal or through API.|
|`Microsoft.SignalRService/locations/operationresults/signalr/read`|Query the result of a location-based asynchronous operation.|
|`Microsoft.SignalRService/locations/operationStatuses/signalr/read`|Query the status of a location-based asynchronous operation.|
|`Microsoft.SignalRService/SignalR/operationResults/read`|View the results of an operation.|
|`Microsoft.SignalRService/SignalR/operationStatuses/read`|View the status of an operation.|
|`Microsoft.SignalRService/SignalR/listkeys/action`|View the value of SignalR access keys in the management portal or through API.|

### Azure Storage Blob


| Action | Description |
| --- | --- |
|`Microsoft.Storage/storageAccounts/read`|Return the list of storage accounts or get the properties for the specified storage account.|
|`Microsoft.Storage/storageAccounts/write`|Create a storage account with the specified parameters, or update the properties or tags, or add custom domain for the specified storage account.|
|`Microsoft.Storage/storageAccounts/listkeys/action`|Return the access keys for the specified storage account.|

### Azure Web PubSub


| Action | Description |
| --- | --- |
|`Microsoft.SignalRService/WebPubSub/read`|View the WebPubSub settings and configurations in the management portal or through API.|
|`Microsoft.SignalRService/WebPubSub/write`|Modify the WebPubSub settings and configurations in the management portal or through API.|
|`Microsoft.SignalRService/locations/operationresults/webpubsub/read`|Query the result of a location-based asynchronous operation.|
|`Microsoft.SignalRService/locations/operationStatuses/webpubsub/read`|Query the status of a location-based asynchronous operation.|
|`Microsoft.SignalRService/WebPubSub/operationResults/read`|View the results of an operation.|
|`Microsoft.SignalRService/WebPubSub/operationStatuses/read`|View the status of an operation.|
|`Microsoft.SignalRService/WebPubSub/listkeys/action`|View the value of WebPubSub access keys in the management portal or through API.|

## Identity-related scenarios

The following permissions apply to service connections for various identity-related scenarios.

### Managed identity or service principal

Service Connector might need to grant permissions to a managed identity or service principal if a connection is created with those authentication types. The following table lists the permission requirements for creating these connections.


| Action | Description |
| --- | --- |
|`Microsoft.Authorization/roleAssignments/read`|Get information about a role assignment.|
|`Microsoft.Authorization/roleAssignments/write`|Create a role assignment at the specified scope.|
|`Microsoft.Authorization/roleAssignments/delete`|Delete a role assignment at the specified scope.|

### Private endpoint or service endpoint

Service Connector might need to grant permissions to your identity if connections are created with that network solution. The following table lists the permission requirements for creating these connections.


| Action | Description |
| --- | --- |
|`Microsoft.Network/publicIPAddresses/read`|Get a public IP address definition.|
|`Microsoft.Network/virtualNetworks/subnets/read`|Get a virtual network subnet definition.|
|`Microsoft.Network/virtualNetworks/subnets/write`|Create a virtual network subnet or update an existing virtual network subnet.|
|`Microsoft.Network/privateEndpoints/read`|Get a private endpoint resource.|
|`Microsoft.Network/virtualNetworks/subnets/joinViaServiceEndpoint/action`|Join a resource such as a storage account or SQL database to a subnet. Not alertable.|
|`Microsoft.Network/networkSecurityGroups/join/action`|Join a network security group. Not alertable.|
|`Microsoft.Network/serviceEndpointPolicies/join/action`|Join a service endpoint policy. Not alertable.|
|`Microsoft.Network/natGateways/join/action`|Joins a Network Address Translation (NAT) gateway.|
|`Microsoft.Network/networkIntentPolicies/join/action`|Join a network intent policy. Not alertable.|
|`Microsoft.Network/networkSecurityGroups/join/action`|Join a network security group. Not alertable.|
|`Microsoft.Network/routeTables/join/action`|Join a route table. Not alertable.|

### User-assigned managed identity

Service Connector might need to grant permissions to a user-assigned managed identity if a connection is created with this authentication type. The following table lists the permission requirements for creating this connection.


| Action | Description |
| --- | --- |
|`Microsoft.ManagedIdentity/userAssignedIdentities/read`|Get an existing user-assigned identity.|
|`Microsoft.ManagedIdentity/userAssignedIdentities/assign/action`|Use a role-based access control (RBAC) action to assign an existing user-assigned identity to a resource.|
|`Microsoft.ManagedIdentity/userAssignedIdentities/federatedIdentityCredentials/read`|Get or list federated identity credentials.|
|`Microsoft.ManagedIdentity/userAssignedIdentities/federatedIdentityCredentials/write`|Add or update a federated identity credential.|
|`Microsoft.ManagedIdentity/userAssignedIdentities/federatedIdentityCredentials/delete`|Delete a federated identity credential.|

## Related content

- [Service Connector FAQ](faq.yml)
- [Service Connector internal concepts](concept-service-connector-internals.md)
- [Microsoft Entra roles assigned by Service Connector](concept-microsoft-entra-roles.md)

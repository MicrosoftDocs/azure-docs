---
title: Permission requirement for Service Connector
description: Resource permission requirement
author: maud-lv
ms.author: malev
ms.service: service-connector
ms.topic: conceptual
ms.date: 08/04/2023
---

# Permission requirement for Service Connector

Service Connector creates connections between Azure services using a [on-behalf-Of token](../active-directory/develop/v2-oauth2-on-behalf-of-flow.md). Creating a connection to a specific Azure resource requires its corresponding permissions.

### App Service  

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> |`Microsoft.Web/sites/config/write`|Update Web App's configuration settings|
> |`Microsoft.web/sites/config/delete`|Delete Web Apps Config.| 
> |`Microsoft.Web/sites/config/list/action`|List Web App's security sensitive settings, such as publishing credentials, app settings and connection strings| 
> |`Microsoft.Web/sites/config/Read`|Get Web App configuration settings|
> |`Microsoft.Web/sites/write`|Create a new Web App or update an existing one|
> |`Microsoft.Web/sites/read`|Get the properties of a Web App|

### Webapp Slot 
 
> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> |`Microsoft.Web/sites/slots/Write`|Create a new Web App Slot or update an existing one|
> |`Microsoft.Web/sites/slots/Read`|Get the properties of a Web App deployment slot|
> |`Microsoft.Web/sites/slots/config/Read`|Get Web App Slot's configuration settings|
> |`Microsoft.Web/sites/slots/config/Write`|Update Web App Slot's configuration settings|
> |`microsoft.web/sites/slots/config/delete`|Delete Web Apps Slots Config.|
> |`Microsoft.Web/sites/slots/config/list/Action`|List Web App Slot's security sensitive settings, such as publishing credentials, app settings and connection strings|

### Azure Spring App

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> |`Microsoft.AppPlatform/Spring/read`|Get Azure Spring Apps service instance(s)|
> |`Microsoft.AppPlatform/Spring/apps/read`|Get the applications for a specific Azure Spring Apps service instance|
> |`Microsoft.AppPlatform/Spring/apps/write`|Create or update the application for a specific Azure Spring Apps service instance|
> |`Microsoft.AppPlatform/Spring/apps/deployments/*/read`|Get the deployments for a specific application|
> |`Microsoft.AppPlatform/Spring/apps/deployments/*/write`|Create or update the deployment for a specific application|
> |`Microsoft.AppPlatform/Spring/apps/deployments/*/delete`|Delete the deployment for a specific application|

### Azure Container Apps 

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> |`Microsoft.App/containerApps/read`|Get a Container App|
> |`Microsoft.App/containerApps/write`|Create or update a Container App|
> |`Microsoft.App/containerApps/listsecrets/action`|List secrets of a container app|
> |`Microsoft.App/managedEnvironments/read`|Get a Managed Environment|
> |`Microsoft.App/locations/managedEnvironmentOperationStatuses/read`|Get a Managed Environment Long Running Operation Status|
> |`microsoft.app/locations/containerappoperationstatuses/read`|Get a Container App Long Running Operation Status|
> |`microsoft.app/locations/containerappoperationresults/read`|Get a Container App Long Running Operation Result|
> |`microsoft.app/locations/managedenvironmentoperationresults/read`|Get a Managed Environment Long Running Operation Result|

### Dapr in Azure Container Apps 

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> |`Microsoft.App/managedEnvironments/daprComponents/read`|Read Managed Environment Dapr Component|
> |`Microsoft.App/managedEnvironments/daprComponents/write`|Create or Update Managed Environment Dapr Component|
> |`Microsoft.App/managedEnvironments/daprComponents/delete`|Delete Managed Environment Dapr Component|

### Azure Cache for Redis 

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> |`Microsoft.Cache/redis/read`|View the Redis Cache's settings and configuration in the management portal|
> |`Microsoft.Cache/redis/firewallRules/read`|Get the IP firewall rules of a Redis Cache|
> |`Microsoft.Cache/redis/firewallRules/write`|Edit the IP firewall rules of a Redis Cache|
> |`Microsoft.Cache/redis/firewallRules/delete`|Delete IP firewall rules of a Redis Cache|
> |`Microsoft.Cache/redis/listKeys/action`|View the value of Redis Cache access keys in the management portal|

#### Azure Cache for Redis Enterprise 

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> |`Microsoft.Cache/redisEnterprise/read`|View the Redis Enterprise cache's settings and configuration in the management portal|
> |`Microsoft.Cache/redisEnterprise/databases/read`|View the Redis Enterprise cache database's settings and configuration in the management portal|
> |`Microsoft.Cache/redisEnterprise/databases/listKeys/action`|View the value of Redis Enterprise database access keys in the management portal|

### Azure Database for PostgreSQL

#### Azure Database for PostgreSQL

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> |`Microsoft.DBforPostgreSQL/servers/firewallRules/read`|Return the list of firewall rules for a server or gets the properties for the specified firewall rule.|
> |`Microsoft.DBforPostgreSQL/servers/firewallRules/write`|Creates a firewall rule with the specified parameters or update an existing rule.|
> |`Microsoft.DBforPostgreSQL/servers/firewallRules/delete`|Deletes an existing firewall rule.|
> |`Microsoft.DBForPostgreSQL/servers/read`|Return the list of servers or gets the properties for the specified server.|
> |`Microsoft.DBForPostgreSQL/servers/databases/read`|Return the list of PostgreSQL Databases or gets the properties for the specified Database.|
> |`Microsoft.DBforPostgreSQL/servers/write`|Creates a server with the specified parameters or update the properties or tags for the specified server.|

#### Azure Database for PostgreSQL (service endpoint) 

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> |`Microsoft.DBforPostgreSQL/servers/virtualNetworkRules/read`|Return the list of virtual network rules or gets the properties for the specified virtual network rule.|
> |`Microsoft.DBforPostgreSQL/servers/virtualNetworkRules/write`|Creates a virtual network rule with the specified parameters or update the properties or tags for the specified virtual network rule.|
> |`Microsoft.DBforPostgreSQL/servers/virtualNetworkRules/delete`|Deletes an existing Virtual Network Rule|

#### Azure Database for PostgreSQL - Flexible Server

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> |`Microsoft.DBforPostgreSQL/flexibleServers/firewallRules/read`|Return the list of firewall rules for a server or gets the properties for the specified firewall rule.|
> |`Microsoft.DBforPostgreSQL/flexibleServers/firewallRules/write`|Creates a firewall rule with the specified parameters or update an existing rule.|
> |`Microsoft.DBforPostgreSQL/flexibleServers/firewallRules/delete`|Deletes an existing firewall rule.|
> |`Microsoft.DBForPostgreSQL/flexibleServers/read`|Return the list of servers or gets the properties for the specified server.|
> |`Microsoft.DBForPostgreSQL/flexibleServers/databases/read`|Returns the list of PostgreSQL server databases or gets the database for the specified server.|
> |`Microsoft.DBforPostgreSQL/flexibleServers/configurations/read`|Returns the list of PostgreSQL server configurations or gets the configurations for the specified server.|

### Azure Database for MySQL 

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> |`Microsoft.DBforMySQL/servers/firewallRules/read`|Return the list of firewall rules for a server or gets the properties for the specified firewall rule.|
> |`Microsoft.DBforMySQL/servers/firewallRules/write`|Creates a firewall rule with the specified parameters or update an existing rule.|
> |`Microsoft.DBforMySQL/servers/firewallRules/delete`|Deletes an existing firewall rule.|
> |`Microsoft.DBforMySQL/servers/read`|Return the list of servers or gets the properties for the specified server.|
> |`Microsoft.DBforMySQL/servers/databases/read`|Return the list of MySQL Databases or gets the properties for the specified Database.|
> |`Microsoft.DBforMySQL/servers/write`|Creates a server with the specified parameters or update the properties or tags for the specified server.|

#### Azure Database for MySQL (service endpoint)   

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> |`Microsoft.DBforMySQL/servers/virtualNetworkRules/read`|Return the list of virtual network rules or gets the properties for the specified virtual network rule.|
> |`Microsoft.DBforMySQL/servers/virtualNetworkRules/write`|Creates a virtual network rule with the specified parameters or update the properties or tags for the specified virtual network rule.|
> |`Microsoft.DBforMySQL/servers/virtualNetworkRules/delete`|Deletes an existing Virtual Network Rule|

#### Azure Database for MySQL - Flexible Server

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> |`Microsoft.DBforMySQL/flexibleServers/firewallRules/read`|Returns the list of firewall rules for a server or gets the properties for the specified firewall rule.|
> |`Microsoft.DBforMySQL/flexibleServers/firewallRules/write`|Creates a firewall rule with the specified parameters or updates an existing rule.|
> |`Microsoft.DBforMySQL/flexibleServers/firewallRules/delete`|Deletes an existing firewall rule.|
> |`Microsoft.DBforMySQL/flexibleServers/read`|Returns the list of servers or gets the properties for the specified server.|
> |`Microsoft.DBforMySQL/flexibleServers/databases/read`|Returns the list of databases for a server or gets the properties for the specified database.|
> |`Microsoft.DBforMySQL/flexibleServers/configurations/read`|Returns the list of MySQL server configurations or gets the configurations for the specified server.|

### Azure App Configuration 

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> |`Microsoft.AppConfiguration/configurationStores/ListKeys/action`|Lists the API keys for the specified configuration store.|
> |`Microsoft.AppConfiguration/configurationStores/read`|Gets the properties of the specified configuration store or lists all the configuration stores under the specified resource group or subscription.|

### Azure Event Hubs

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> |`Microsoft.EventHub/namespaces/read`|Get the list of Namespace Resource Description|
> |`Microsoft.EventHub/namespaces/ipFilterRules/read`|Get IP Filter Resource|
> |`Microsoft.EventHub/namespaces/ipFilterRules/write`|Create IP Filter Resource|
> |`Microsoft.EventHub/namespaces/ipFilterRules/delete`|Delete IP Filter Resource|
> |`Microsoft.EventHub/namespaces/networkrulesets/read`|Gets NetworkRuleSet Resource|
> |`Microsoft.EventHub/namespaces/networkrulesets/write`|Create VNET Rule Resource|
> |`Microsoft.EventHub/namespaces/authorizationRules/listkeys/action`|Get the Connection String to the Namespace|

### Azure Service Bus 

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> |`Microsoft.ServiceBus/namespaces/read`|Get the list of Namespace Resource Description|
> |`Microsoft.ServiceBus/namespaces/ipFilterRules/read`|Get IP Filter Resource|
> |`Microsoft.ServiceBus/namespaces/ipFilterRules/write`|Create IP Filter Resource|
> |`Microsoft.ServiceBus/namespaces/ipFilterRules/delete`|Delete IP Filter Resource|
> |`Microsoft.ServiceBus/namespaces/authorizationRules/listkeys/action`|Get the Connection String to the Namespace|
> |`Microsoft.ServiceBus/namespaces/networkrulesets/read`|Gets NetworkRuleSet Resource|
> |`Microsoft.ServiceBus/namespaces/networkrulesets/write`|Create VNET Rule Resource|

### Azure Blob Storage

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> |`Microsoft.Storage/storageAccounts/read`|Returns the list of storage accounts or gets the properties for the specified storage account.|
> |`Microsoft.Storage/storageAccounts/write`|Creates a storage account with the specified parameters or update the properties or tags or adds custom domain for the specified storage account.|
> |`Microsoft.Storage/storageAccounts/listkeys/action`|Returns the access keys for the specified storage account.|

### Azure SignalR Service 

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> |`Microsoft.SignalRService/SignalR/read`|View the SignalR's settings and configurations in the management portal or through API|
> |`Microsoft.SignalRService/SignalR/write`|Modify the SignalR's settings and configurations in the management portal or through API|
> |`Microsoft.SignalRService/locations/operationresults/signalr/read`|Query the result of a location-based asynchronous operation|
> |`Microsoft.SignalRService/locations/operationStatuses/signalr/read`|Query the status of a location-based asynchronous operation|
> |`Microsoft.SignalRService/SignalR/operationResults/read`||
> |`Microsoft.SignalRService/SignalR/operationStatuses/read`||
> |`Microsoft.SignalRService/SignalR/listkeys/action`|View the value of SignalR access keys in the management portal or through API|

### Azure Web PubSub service

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> |`Microsoft.SignalRService/WebPubSub/read`|View the WebPubSub's settings and configurations in the management portal or through API|
> |`Microsoft.SignalRService/WebPubSub/write`|Modify the WebPubSub's settings and configurations in the management portal or through API|
> |`Microsoft.SignalRService/locations/operationresults/webpubsub/read`|Query the result of a location-based asynchronous operation|
> |`Microsoft.SignalRService/locations/operationStatuses/webpubsub/read`|Query the status of a location-based asynchronous operation|
> |`Microsoft.SignalRService/WebPubSub/operationResults/read`||
> |`Microsoft.SignalRService/WebPubSub/operationStatuses/read`|View the value of WebPubSub access keys in the management portal or through API|
> |`Microsoft.SignalRService/WebPubSub/listkeys/action`|View the value of WebPubSub access keys in the management portal or through API|

### Azure Cosmos DB

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> |`Microsoft.DocumentDB/databaseAccounts/read`|Reads a database account.|
> |`Microsoft.DocumentDB/databaseAccounts/write`|Update a database accounts.|
> |`Microsoft.DocumentDB/databaseAccounts/listConnectionStrings/action`|Get the connection strings for a database account|
> |`Microsoft.DocumentDB/databaseAccounts/listKeys/action`|List keys of a database account|

### Azure SQL Database

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> |`Microsoft.Sql/servers/firewallRules/read`|Return the list of server firewall rules or gets the properties for the specified server firewall rule.|
> |`Microsoft.Sql/servers/firewallRules/write`|	Creates a server firewall rule with the specified parameters, update the properties for the specified rule or overwrite all existing rules with new server firewall rule(s).|
> |`Microsoft.Sql/servers/firewallRules/delete`|Deletes an existing server firewall rule.|
> |`Microsoft.Sql/servers/databases/read`|Return the list of databases or gets the properties for the specified database.|
> |`Microsoft.Sql/servers/read`|Return the list of servers or gets the properties for the specified server.|
> |`Microsoft.Sql/servers/virtualNetworkRules/read`|Return the list of virtual network rules or gets the properties for the specified virtual network rule.|
> |`Microsoft.Sql/servers/virtualNetworkRules/write`|Creates a virtual network rule with the specified parameters or update the properties or tags for the specified virtual network rule.|
> |`Microsoft.Sql/servers/virtualNetworkRules/delete`|Deletes an existing Virtual Network Rule|


### Azure Key Vault

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> |`Microsoft.KeyVault/vaults/write`|Creates a new key vault or updates the properties of an existing key vault. Certain properties may require more permissions.|
> |`Microsoft.KeyVault/vaults/read`|View the properties of a key vault|
> |`Microsoft.KeyVault/vaults/secrets/write`|Creates a new secret or updates the value of an existing secret.|
> |`Microsoft.KeyVault/vaults/accessPolicies/write`|Updates an existing access policy by merging or replacing, or adds a new access policy to the key vault.|

### Azure Cosmos DB

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> |`Microsoft.DocumentDB/databaseAccounts/sqlRoleAssignments/read`|Read a SQL Role Definition|
> |`Microsoft.DocumentDB/databaseAccounts/sqlRoleAssignments/write`|Create or update a SQL Role Definition|
> |`Microsoft.DocumentDB/databaseAccounts/sqlRoleAssignments/delete`|Delete a SQL Role Assignment|

### Managed Identity/Service principal related connection

Service Connector may need to grant permissions to Managed Identity or Service Principal if a connection is created with those as authentication types. The following table lists the permission requirements for creating a connection in this scenario.

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> |`Microsoft.Authorization/roleAssignments/read`|Get information about a role assignment.|
> |`Microsoft.Authorization/roleAssignments/write`|Create a role assignment at the specified scope.|
> |`Microsoft.Authorization/roleAssignments/delete`|Delete a role assignment at the specified scope.|

### User-assigned managed identities connection

Service Connector may need to grant permissions to User-assigned Managed Identity if a connection is created with it as the authentication type. The following table lists the permission requirements for creating a connection in this scenario.

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> |`Microsoft.ManagedIdentity/userAssignedIdentities/read`|Gets an existing user assigned identity|
> |`Microsoft.ManagedIdentity/userAssignedIdentities/assign/action`|RBAC action for assigning an existing user assigned identity to a resource|
> |`Microsoft.ManagedIdentity/userAssignedIdentities/federatedIdentityCredentials/read`|Get or list Federated Identity Credentials|
> |`Microsoft.ManagedIdentity/userAssignedIdentities/federatedIdentityCredentials/write`|Add or update a Federated Identity Credential|
> |`Microsoft.ManagedIdentity/userAssignedIdentities/federatedIdentityCredentials/delete`|Delete a Federated Identity Credential|

### Private Endpoint/service endpoint related permission 

Service Connector may need to grant permissions to your identity if a connection is created with private endpoint or service endpoint as the network solution. The following table lists the permission requirements for creating a connection in this scenario.

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> |`Microsoft.Network/publicIPAddresses/read`|Gets a public IP address definition.|
> |`Microsoft.Network/virtualNetworks/subnets/read`|Gets a virtual network subnet definition|
> |`Microsoft.Network/virtualNetworks/subnets/write`|Creates a virtual network subnet or updates an existing virtual network subnet|
> |`Microsoft.Network/privateEndpoints/read`|Gets an private endpoint resource.|
> |`Microsoft.Network/virtualNetworks/subnets/joinViaServiceEndpoint/action`|Joins resource such as storage account or SQL database to a subnet. Not alertable.|
> |`Microsoft.Network/networkSecurityGroups/join/action`|Joins a network security group. Not Alertable.|
> |`Microsoft.Network/serviceEndpointPolicies/join/action`|Joins a Service Endpoint Policy. Not alertable.|
> |`Microsoft.Network/natGateways/join/action`|Joins a NAT Gateway|
> |`Microsoft.Network/networkIntentPolicies/join/action`|Joins a Network Intent Policy. Not alertable.|
> |`Microsoft.Network/networkSecurityGroups/join/action`|Joins a network security group. Not Alertable.|
> |`Microsoft.Network/routeTables/join/action`|Joins a route table. Not Alertable.|

> [!div class="nextstepaction"]
> [High availability](./concept-availability.md)

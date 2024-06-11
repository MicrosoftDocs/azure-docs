---
title: Azure permissions for Integration - Azure RBAC
description: Lists the permissions for the Azure resource providers in the Integration category.
ms.service: role-based-access-control
ms.topic: reference
author: rolyon
manager: amycolannino
ms.author: rolyon
ms.date: 04/25/2024
ms.custom: generated
---

# Azure permissions for Integration

This article lists the permissions for the Azure resource providers in the Integration category. You can use these permissions in your own [Azure custom roles](/azure/role-based-access-control/custom-roles) to provide granular access control to resources in Azure. Permission strings have the following format: `{Company}.{ProviderName}/{resourceType}/{action}`


## Microsoft.ApiCenter

Azure service: [Azure API Center](/azure/api-center/overview)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.ApiCenter/register/action | Register Microsoft.ApiCenter resource provider for the subscription. |
> | Microsoft.ApiCenter/unregister/action | Unregister Microsoft.ApiCenter resource provider for the subscription. |
> | Microsoft.ApiCenter/deletedServices/read | Returns paginated collection of deleted services. |
> | Microsoft.ApiCenter/deletedServices/read | Returns the deleted service. |
> | Microsoft.ApiCenter/deletedServices/delete | Purge the soft deleted service. |
> | Microsoft.ApiCenter/operations/read | Read all API operations available for Microsoft.ApiCenter resource provider. |
> | Microsoft.ApiCenter/resourceTypes/read | Read all resource types available for Microsoft.ApiCenter resource provider. |
> | Microsoft.ApiCenter/services/write | Creates or updates specified service. |
> | Microsoft.ApiCenter/services/write | Patches specified service. |
> | Microsoft.ApiCenter/services/read | Returns the details of the specified service. |
> | Microsoft.ApiCenter/services/read | Checks if specified service exists. |
> | Microsoft.ApiCenter/services/read | Returns paginated collection of services. |
> | Microsoft.ApiCenter/services/delete | Deletes specified service. |
> | Microsoft.ApiCenter/services/importFromApim/action | Imports resources from one or more API Management instances. |
> | Microsoft.ApiCenter/services/exportMetadataSchema/action | Returns effective metadata schema document. |
> | Microsoft.ApiCenter/services/validateMoveResources/action | Validates move resource request |
> | Microsoft.ApiCenter/services/moveResources/action | Move resource request |
> | Microsoft.ApiCenter/services/analysisReports/read | Get a certain analysis report of an API Center instance |
> | Microsoft.ApiCenter/services/eventGridFilters/read | Returns paginated collection of the Event Grid filters. |
> | Microsoft.ApiCenter/services/eventGridFilters/read | Returns the details of the specified Event Grid filter. |
> | Microsoft.ApiCenter/services/eventGridFilters/write | Creates or updates specified Event Grid filter. |
> | Microsoft.ApiCenter/services/eventGridFilters/delete | Deletes the details of the specified Event Grid filter. |
> | Microsoft.ApiCenter/services/metadataSchemas/write | Creates or updates specified metadataSchema. |
> | Microsoft.ApiCenter/services/metadataSchemas/read | Returns paginated collection of metadataSchemas. |
> | Microsoft.ApiCenter/services/metadataSchemas/read | Returns the details of the specified metadataSchema. |
> | Microsoft.ApiCenter/services/metadataSchemas/read | Checks if specified metadataSchema exists |
> | Microsoft.ApiCenter/services/metadataSchemas/delete | Deletes specified metadataSchema. |
> | Microsoft.ApiCenter/services/operationResults/read | Checks status of an APIM import operation |
> | Microsoft.ApiCenter/services/workspaces/write | Creates or updates specified workspace. |
> | Microsoft.ApiCenter/services/workspaces/read | Returns paginated collection of workspaces. |
> | Microsoft.ApiCenter/services/workspaces/read | Returns the details of the specified workspace. |
> | Microsoft.ApiCenter/services/workspaces/read | Checks if specified workspace exists |
> | Microsoft.ApiCenter/services/workspaces/delete | Deletes specified workspace. |
> | Microsoft.ApiCenter/services/workspaces/apis/write | Creates or updates specified API. |
> | Microsoft.ApiCenter/services/workspaces/apis/read | List APIs inside a catalog |
> | Microsoft.ApiCenter/services/workspaces/apis/read | Returns the details of the specified API. |
> | Microsoft.ApiCenter/services/workspaces/apis/read | Checks if specified API exists. |
> | Microsoft.ApiCenter/services/workspaces/apis/delete | Deletes specified API. |
> | Microsoft.ApiCenter/services/workspaces/apis/deployments/write | Creates or updates API Deployment. |
> | Microsoft.ApiCenter/services/workspaces/apis/deployments/read | Checks if specified API Deployment exists. |
> | Microsoft.ApiCenter/services/workspaces/apis/deployments/read | Returns the details of the specified API deployment. |
> | Microsoft.ApiCenter/services/workspaces/apis/deployments/read | Returns paginated collection of API deployments. |
> | Microsoft.ApiCenter/services/workspaces/apis/deployments/delete | Deletes specified API deployment. |
> | Microsoft.ApiCenter/services/workspaces/apis/portals/write | Creates or updates the portal configuration. |
> | Microsoft.ApiCenter/services/workspaces/apis/portals/write | Returns the configuration of the specified portal. |
> | Microsoft.ApiCenter/services/workspaces/apis/versions/write | Creates or updates API version. |
> | Microsoft.ApiCenter/services/workspaces/apis/versions/read | Checks if specified API version exists. |
> | Microsoft.ApiCenter/services/workspaces/apis/versions/read | Returns the details of the specified API version. |
> | Microsoft.ApiCenter/services/workspaces/apis/versions/read | Returns paginated collection of API versions. |
> | Microsoft.ApiCenter/services/workspaces/apis/versions/delete | Deletes specified API version. |
> | Microsoft.ApiCenter/services/workspaces/apis/versions/definitions/updateAnalysisState/action | Updates analysis results for specified API definition. |
> | Microsoft.ApiCenter/services/workspaces/apis/versions/definitions/exportSpecification/action | Exports API definition file. |
> | Microsoft.ApiCenter/services/workspaces/apis/versions/definitions/importSpecification/action | Imports API definition file. |
> | Microsoft.ApiCenter/services/workspaces/apis/versions/definitions/write | Creates or updates API Spec. |
> | Microsoft.ApiCenter/services/workspaces/apis/versions/definitions/read | Checks if specified API Spec exists. |
> | Microsoft.ApiCenter/services/workspaces/apis/versions/definitions/read | Returns the details of the specified API definition. |
> | Microsoft.ApiCenter/services/workspaces/apis/versions/definitions/read | Returns paginated collection of API definition. |
> | Microsoft.ApiCenter/services/workspaces/apis/versions/definitions/delete | Deletes specified API definition. |
> | Microsoft.ApiCenter/services/workspaces/apis/versions/definitions/analysisResults/read | Returns analysis report for specified API definition. |
> | Microsoft.ApiCenter/services/workspaces/apis/versions/definitions/operationResults/read | Checks status of individual import operation |
> | Microsoft.ApiCenter/services/workspaces/environments/read | Returns paginated collection of environments |
> | Microsoft.ApiCenter/services/workspaces/environments/write | Create or update environment |
> | Microsoft.ApiCenter/services/workspaces/environments/delete | Deletes specified environment. |
> | Microsoft.ApiCenter/services/workspaces/environments/read | Returns specified environment. |
> | Microsoft.ApiCenter/services/workspaces/portals/delete | Deletes specified configuration. |
> | **DataAction** | **Description** |
> | Microsoft.ApiCenter/services/workspaces/apis/read | Read APIs from an API Center. |
> | Microsoft.ApiCenter/services/workspaces/apis/deployments/read | Read API deployments from an API Center. |
> | Microsoft.ApiCenter/services/workspaces/apis/versions/read | Read API versions from an API Center. |
> | Microsoft.ApiCenter/services/workspaces/apis/versions/definitions/read | Read API definitions from an API Center. |
> | Microsoft.ApiCenter/services/workspaces/apis/versions/definitions/exportSpecification/action | Exports API definition file. |
> | Microsoft.ApiCenter/services/workspaces/environments/read | Read API environments from an API Center. |

## Microsoft.ApiManagement

Easily build and consume Cloud APIs.

Azure service: [API Management](/azure/api-management/)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.ApiManagement/register/action | Register subscription for Microsoft.ApiManagement resource provider |
> | Microsoft.ApiManagement/unregister/action | Un-register subscription for Microsoft.ApiManagement resource provider |
> | Microsoft.ApiManagement/checkNameAvailability/read | Checks if provided service name is available |
> | Microsoft.ApiManagement/deletedservices/read | Get deleted API Management Services which can be restored within the soft-delete period |
> | Microsoft.ApiManagement/gateways/read | Lists Gateway or Gets a Gateway |
> | Microsoft.ApiManagement/gateways/write | Creates a Gateway |
> | Microsoft.ApiManagement/gateways/delete | Deletes a Gateway |
> | Microsoft.ApiManagement/gateways/configConnections/read | Lists Gateway ConfigConnections or Gets a Gateway ConfigConnection |
> | Microsoft.ApiManagement/gateways/configConnections/write | Creates a Gateway Config Connection |
> | Microsoft.ApiManagement/gateways/configConnections/delete | Deletes a Gateway Config Connection |
> | Microsoft.ApiManagement/locations/deletedservices/read | Get deleted API Management Service which can be restored within the soft-delete period by location |
> | Microsoft.ApiManagement/locations/deletedservices/delete | Delete API Management Service without the option to restore it |
> | Microsoft.ApiManagement/locations/operationsStatuses/read | View the status of a long running operation for which the 'AzureAsync' header was previously returned to the client |
> | Microsoft.ApiManagement/operations/read | Read all API operations available for Microsoft.ApiManagement resource |
> | Microsoft.ApiManagement/reports/read | Get reports aggregated by time periods, geographical region, developers, products, APIs, operations, subscription and byRequest. |
> | Microsoft.ApiManagement/service/write | Create or Update API Management Service instance |
> | Microsoft.ApiManagement/service/read | Read metadata for an API Management Service instance |
> | Microsoft.ApiManagement/service/delete | Delete API Management Service instance |
> | Microsoft.ApiManagement/service/updatehostname/action | Setup, update or remove custom domain names for an API Management Service |
> | Microsoft.ApiManagement/service/updatecertificate/action | Upload TLS/SSL certificate for an API Management Service |
> | Microsoft.ApiManagement/service/backup/action | Backup API Management Service to the specified container in a user provided storage account |
> | Microsoft.ApiManagement/service/restore/action | Restore API Management Service from the specified container in a user provided storage account |
> | Microsoft.ApiManagement/service/managedeployments/action | Change SKU/units, add/remove regional deployments of API Management Service |
> | Microsoft.ApiManagement/service/getssotoken/action | Gets SSO token that can be used to login into API Management Service Legacy portal as an administrator |
> | Microsoft.ApiManagement/service/applynetworkconfigurationupdates/action | Updates the Microsoft.ApiManagement resources running in Virtual Network to pick updated Network Settings. |
> | Microsoft.ApiManagement/service/scheduledMaintenance/action | Perform Scheduled Maintenance on the service |
> | Microsoft.ApiManagement/service/users/action | Register a new user |
> | Microsoft.ApiManagement/service/notifications/action | Sends notification to a specified user |
> | Microsoft.ApiManagement/service/validatePolicies/action | Validates Tenant Policy Restrictions |
> | Microsoft.ApiManagement/service/apis/read | Lists all APIs of the API Management service instance. or Gets the details of the API specified by its identifier. |
> | Microsoft.ApiManagement/service/apis/write | Creates new or updates existing specified API of the API Management service instance. or Updates the specified API of the API Management service instance. |
> | Microsoft.ApiManagement/service/apis/delete | Deletes the specified API of the API Management service instance. |
> | Microsoft.ApiManagement/service/apis/diagnostics/read | Lists all diagnostics of an API. or Gets the details of the Diagnostic for an API specified by its identifier. |
> | Microsoft.ApiManagement/service/apis/diagnostics/write | Creates a new Diagnostic for an API or updates an existing one. or Updates the details of the Diagnostic for an API specified by its identifier. |
> | Microsoft.ApiManagement/service/apis/diagnostics/delete | Deletes the specified Diagnostic from an API. |
> | Microsoft.ApiManagement/service/apis/issues/read | Lists all issues associated with the specified API. or Gets the details of the Issue for an API specified by its identifier. |
> | Microsoft.ApiManagement/service/apis/issues/write | Creates a new Issue for an API or updates an existing one. or Updates an existing issue for an API. |
> | Microsoft.ApiManagement/service/apis/issues/delete | Deletes the specified Issue from an API. |
> | Microsoft.ApiManagement/service/apis/issues/attachments/read | Lists all attachments for the Issue associated with the specified API. or Gets the details of the issue Attachment for an API specified by its identifier. |
> | Microsoft.ApiManagement/service/apis/issues/attachments/write | Creates a new Attachment for the Issue in an API or updates an existing one. |
> | Microsoft.ApiManagement/service/apis/issues/attachments/delete | Deletes the specified comment from an Issue. |
> | Microsoft.ApiManagement/service/apis/issues/comments/read | Lists all comments for the Issue associated with the specified API. or Gets the details of the issue Comment for an API specified by its identifier. |
> | Microsoft.ApiManagement/service/apis/issues/comments/write | Creates a new Comment for the Issue in an API or updates an existing one. |
> | Microsoft.ApiManagement/service/apis/issues/comments/delete | Deletes the specified comment from an Issue. |
> | Microsoft.ApiManagement/service/apis/operations/read | Lists a collection of the operations for the specified API. or Gets the details of the API Operation specified by its identifier. |
> | Microsoft.ApiManagement/service/apis/operations/write | Creates a new operation in the API or updates an existing one. or Updates the details of the operation in the API specified by its identifier. |
> | Microsoft.ApiManagement/service/apis/operations/delete | Deletes the specified operation in the API. |
> | Microsoft.ApiManagement/service/apis/operations/policies/read | Get the list of policy configuration at the API Operation level. or Get the policy configuration at the API Operation level. |
> | Microsoft.ApiManagement/service/apis/operations/policies/write | Creates or updates policy configuration for the API Operation level. |
> | Microsoft.ApiManagement/service/apis/operations/policies/delete | Deletes the policy configuration at the Api Operation. |
> | Microsoft.ApiManagement/service/apis/operations/policy/read | Get the policy configuration at Operation level |
> | Microsoft.ApiManagement/service/apis/operations/policy/write | Create policy configuration at Operation level |
> | Microsoft.ApiManagement/service/apis/operations/policy/delete | Delete the policy configuration at Operation level |
> | Microsoft.ApiManagement/service/apis/operations/tags/read | Lists all Tags associated with the Operation. or Get tag associated with the Operation. |
> | Microsoft.ApiManagement/service/apis/operations/tags/write | Assign tag to the Operation. |
> | Microsoft.ApiManagement/service/apis/operations/tags/delete | Detach the tag from the Operation. |
> | Microsoft.ApiManagement/service/apis/operationsByTags/read | Lists a collection of operations associated with tags. |
> | Microsoft.ApiManagement/service/apis/policies/read | Get the policy configuration at the API level. or Get the policy configuration at the API level. |
> | Microsoft.ApiManagement/service/apis/policies/write | Creates or updates policy configuration for the API. |
> | Microsoft.ApiManagement/service/apis/policies/delete | Deletes the policy configuration at the Api. |
> | Microsoft.ApiManagement/service/apis/policy/read | Get the policy configuration at API level |
> | Microsoft.ApiManagement/service/apis/policy/write | Create policy configuration at API level |
> | Microsoft.ApiManagement/service/apis/policy/delete | Delete the policy configuration at API level |
> | Microsoft.ApiManagement/service/apis/products/read | Lists all Products, which the API is part of. |
> | Microsoft.ApiManagement/service/apis/releases/read | Lists all releases of an API.<br>An API release is created when making an API Revision current.<br>Releases are also used to rollback to previous revisions.<br>Results will be paged and can be constrained by the $top and $skip parameters.<br>or Returns the details of an API release. |
> | Microsoft.ApiManagement/service/apis/releases/delete | Removes all releases of the API or Deletes the specified release in the API. |
> | Microsoft.ApiManagement/service/apis/releases/write | Creates a new Release for the API. or Updates the details of the release of the API specified by its identifier. |
> | Microsoft.ApiManagement/service/apis/resolvers/read | Get the graphQL resolvers at the API level. or Get the graphQL resolver at the API level. |
> | Microsoft.ApiManagement/service/apis/resolvers/write | Creates or updates graphQL resolver for the API. or Updates the details of the graphQL resolver in the API specified by its identifier. |
> | Microsoft.ApiManagement/service/apis/resolvers/delete | Deletes the policy configuration at the Api. |
> | Microsoft.ApiManagement/service/apis/resolvers/policies/read | Get the list of policy configurations at the GraphQL API resolver level. or Get the policy configuration at the GraphQL API resolver level. |
> | Microsoft.ApiManagement/service/apis/resolvers/policies/write | Creates or updates policy configuration for the GraphQL API. |
> | Microsoft.ApiManagement/service/apis/resolvers/policies/delete | Deletes the policy configuration at the GraphQL Api. |
> | Microsoft.ApiManagement/service/apis/revisions/read | Lists all revisions of an API. |
> | Microsoft.ApiManagement/service/apis/revisions/delete | Removes all revisions of an API |
> | Microsoft.ApiManagement/service/apis/schemas/read | Get the schema configuration at the API level. or Get the schema configuration at the API level. |
> | Microsoft.ApiManagement/service/apis/schemas/write | Creates or updates schema configuration for the API. |
> | Microsoft.ApiManagement/service/apis/schemas/delete | Deletes the schema configuration at the Api. |
> | Microsoft.ApiManagement/service/apis/tagDescriptions/read | Lists all Tags descriptions in scope of API. Model similar to swagger - tagDescription is defined on API level but tag may be assigned to the Operations or Get Tag description in scope of API |
> | Microsoft.ApiManagement/service/apis/tagDescriptions/write | Create/Update tag description in scope of the Api. |
> | Microsoft.ApiManagement/service/apis/tagDescriptions/delete | Delete tag description for the Api. |
> | Microsoft.ApiManagement/service/apis/tags/read | Lists all Tags associated with the API. or Get tag associated with the API. |
> | Microsoft.ApiManagement/service/apis/tags/write | Assign tag to the Api. |
> | Microsoft.ApiManagement/service/apis/tags/delete | Detach the tag from the Api. |
> | Microsoft.ApiManagement/service/apisByTags/read | Lists a collection of apis associated with tags. |
> | Microsoft.ApiManagement/service/apiVersionSets/read | Lists a collection of API Version Sets in the specified service instance. or Gets the details of the Api Version Set specified by its identifier. |
> | Microsoft.ApiManagement/service/apiVersionSets/write | Creates or Updates a Api Version Set. or Updates the details of the Api VersionSet specified by its identifier. |
> | Microsoft.ApiManagement/service/apiVersionSets/delete | Deletes specific Api Version Set. |
> | Microsoft.ApiManagement/service/apiVersionSets/versions/read | Get list of version entities |
> | Microsoft.ApiManagement/service/authorizationProviders/read | Lists AuthorizationProvider within a service instance or Gets a AuthorizationProvider |
> | Microsoft.ApiManagement/service/authorizationProviders/write | Creates a AuthorizationProvider |
> | Microsoft.ApiManagement/service/authorizationProviders/delete | Deletes a AuthorizationProvider |
> | Microsoft.ApiManagement/service/authorizationProviders/authorizations/read | Lists Authorization or Get Authorization |
> | Microsoft.ApiManagement/service/authorizationProviders/authorizations/write | Creates a Authorization |
> | Microsoft.ApiManagement/service/authorizationProviders/authorizations/delete | Deletes a Authorization |
> | Microsoft.ApiManagement/service/authorizationProviders/authorizations/getLoginLinks/action | Posts Authorization Login Links |
> | Microsoft.ApiManagement/service/authorizationProviders/authorizations/confirmConsentCode/action | Posts Authorization Confirm Consent Code |
> | Microsoft.ApiManagement/service/authorizationProviders/authorizations/permission/read | Lists Authorization Permissions or Get Authorization Permission |
> | Microsoft.ApiManagement/service/authorizationProviders/authorizations/permission/write | Creates a Authorization Permission |
> | Microsoft.ApiManagement/service/authorizationProviders/authorizations/permission/delete | Deletes a Authorization Permission |
> | Microsoft.ApiManagement/service/authorizationServers/read | Lists a collection of authorization servers defined within a service instance. or Gets the details of the authorization server without secrets. |
> | Microsoft.ApiManagement/service/authorizationServers/write | Creates new authorization server or updates an existing authorization server. or Updates the details of the authorization server specified by its identifier. |
> | Microsoft.ApiManagement/service/authorizationServers/delete | Deletes specific authorization server instance. |
> | Microsoft.ApiManagement/service/authorizationServers/listSecrets/action | Gets secrets for the authorization server. |
> | Microsoft.ApiManagement/service/backends/read | Lists a collection of backends in the specified service instance. or Gets the details of the backend specified by its identifier. |
> | Microsoft.ApiManagement/service/backends/write | Creates or Updates a backend. or Updates an existing backend. |
> | Microsoft.ApiManagement/service/backends/delete | Deletes the specified backend. |
> | Microsoft.ApiManagement/service/backends/reconnect/action | Notifies the APIM proxy to create a new connection to the backend after the specified timeout. If no timeout was specified, timeout of 2 minutes is used. |
> | Microsoft.ApiManagement/service/caches/read | Lists a collection of all external Caches in the specified service instance. or Gets the details of the Cache specified by its identifier. |
> | Microsoft.ApiManagement/service/caches/write | Creates or updates an External Cache to be used in Api Management instance. or Updates the details of the cache specified by its identifier. |
> | Microsoft.ApiManagement/service/caches/delete | Deletes specific Cache. |
> | Microsoft.ApiManagement/service/certificates/read | Lists a collection of all certificates in the specified service instance. or Gets the details of the certificate specified by its identifier. |
> | Microsoft.ApiManagement/service/certificates/write | Creates or updates the certificate being used for authentication with the backend. |
> | Microsoft.ApiManagement/service/certificates/delete | Deletes specific certificate. |
> | Microsoft.ApiManagement/service/certificates/refreshSecret/action | Refreshes certificate by fetching it from Key Vault. |
> | Microsoft.ApiManagement/service/contentTypes/read | Returns list of content types or Returns content type |
> | Microsoft.ApiManagement/service/contentTypes/delete | Removes content type. |
> | Microsoft.ApiManagement/service/contentTypes/write | Creates new content type |
> | Microsoft.ApiManagement/service/contentTypes/contentItems/read | Returns list of content items or Returns content item details |
> | Microsoft.ApiManagement/service/contentTypes/contentItems/write | Creates new content item or Updates specified content item |
> | Microsoft.ApiManagement/service/contentTypes/contentItems/delete | Removes specified content item. |
> | Microsoft.ApiManagement/service/diagnostics/read | Lists all diagnostics of the API Management service instance. or Gets the details of the Diagnostic specified by its identifier. |
> | Microsoft.ApiManagement/service/diagnostics/write | Creates a new Diagnostic or updates an existing one. or Updates the details of the Diagnostic specified by its identifier. |
> | Microsoft.ApiManagement/service/diagnostics/delete | Deletes the specified Diagnostic. |
> | Microsoft.ApiManagement/service/documentations/read | Lists all Documentations of the API Management service instance. or Gets the details of the documentation specified by its identifier. |
> | Microsoft.ApiManagement/service/documentations/write | Creates or Updates a documentation. or Updates the specified documentation of the API Management service instance. |
> | Microsoft.ApiManagement/service/documentations/delete | Delete documentation. |
> | Microsoft.ApiManagement/service/eventGridFilters/write | Set Event Grid Filters |
> | Microsoft.ApiManagement/service/eventGridFilters/delete | Delete Event Grid Filters |
> | Microsoft.ApiManagement/service/eventGridFilters/read | Get Event Grid Filter |
> | Microsoft.ApiManagement/service/gateways/read | Lists a collection of gateways registered with service instance. or Gets the details of the Gateway specified by its identifier. |
> | Microsoft.ApiManagement/service/gateways/write | Creates or updates an Gateway to be used in Api Management instance. or Updates the details of the gateway specified by its identifier. |
> | Microsoft.ApiManagement/service/gateways/delete | Deletes specific Gateway. |
> | Microsoft.ApiManagement/service/gateways/listKeys/action | Retrieves gateway keys. |
> | Microsoft.ApiManagement/service/gateways/keys/action | Retrieves gateway keys. |
> | Microsoft.ApiManagement/service/gateways/regenerateKey/action | Regenerates specified gateway key invalidationg any tokens created with it. |
> | Microsoft.ApiManagement/service/gateways/generateToken/action | Gets the Shared Access Authorization Token for the gateway. |
> | Microsoft.ApiManagement/service/gateways/token/action | Gets the Shared Access Authorization Token for the gateway. |
> | Microsoft.ApiManagement/service/gateways/invalidateDebugCredentials/action | Forces gateway to reset all issued debug credentials |
> | Microsoft.ApiManagement/service/gateways/listDebugCredentials/action | Issue a debug credentials for requests |
> | Microsoft.ApiManagement/service/gateways/listTrace/action | List collected trace created by gateway |
> | Microsoft.ApiManagement/service/gateways/apis/read | Lists a collection of the APIs associated with a gateway. |
> | Microsoft.ApiManagement/service/gateways/apis/write | Adds an API to the specified Gateway. |
> | Microsoft.ApiManagement/service/gateways/apis/delete | Deletes the specified API from the specified Gateway. |
> | Microsoft.ApiManagement/service/gateways/certificateAuthorities/read | Get Gateway CAs list. or Get assigned Certificate Authority details. |
> | Microsoft.ApiManagement/service/gateways/certificateAuthorities/write | Adds an API to the specified Gateway. |
> | Microsoft.ApiManagement/service/gateways/certificateAuthorities/delete | Unassign Certificate Authority from Gateway. |
> | Microsoft.ApiManagement/service/gateways/hostnameConfigurations/read | Lists the collection of hostname configurations for the specified gateway. or Get details of a hostname configuration |
> | Microsoft.ApiManagement/service/gateways/hostnameConfigurations/write | Request subscription for a new product |
> | Microsoft.ApiManagement/service/gateways/hostnameConfigurations/delete | Deletes the specified hostname configuration. |
> | Microsoft.ApiManagement/service/groups/read | Lists a collection of groups defined within a service instance. or Gets the details of the group specified by its identifier. |
> | Microsoft.ApiManagement/service/groups/write | Creates or Updates a group. or Updates the details of the group specified by its identifier. |
> | Microsoft.ApiManagement/service/groups/delete | Deletes specific group of the API Management service instance. |
> | Microsoft.ApiManagement/service/groups/users/read | Lists a collection of user entities associated with the group. |
> | Microsoft.ApiManagement/service/groups/users/write | Add existing user to existing group |
> | Microsoft.ApiManagement/service/groups/users/delete | Remove existing user from existing group. |
> | Microsoft.ApiManagement/service/identityProviders/read | Lists a collection of Identity Provider configured in the specified service instance. or Gets the configuration details of the identity Provider without secrets. |
> | Microsoft.ApiManagement/service/identityProviders/write | Creates or Updates the IdentityProvider configuration. or Updates an existing IdentityProvider configuration. |
> | Microsoft.ApiManagement/service/identityProviders/delete | Deletes the specified identity provider configuration. |
> | Microsoft.ApiManagement/service/identityProviders/listSecrets/action | Gets Identity Provider secrets. |
> | Microsoft.ApiManagement/service/issues/read | Lists a collection of issues in the specified service instance. or Gets API Management issue details |
> | Microsoft.ApiManagement/service/locations/networkstatus/read | Gets the network access status of resources on which the service depends in the location. |
> | Microsoft.ApiManagement/service/loggers/read | Lists a collection of loggers in the specified service instance. or Gets the details of the logger specified by its identifier. |
> | Microsoft.ApiManagement/service/loggers/write | Creates or Updates a logger. or Updates an existing logger. |
> | Microsoft.ApiManagement/service/loggers/delete | Deletes the specified logger. |
> | Microsoft.ApiManagement/service/namedValues/read | Lists a collection of named values defined within a service instance. or Gets the details of the named value specified by its identifier. |
> | Microsoft.ApiManagement/service/namedValues/write | Creates or updates named value. or Updates the specific named value. |
> | Microsoft.ApiManagement/service/namedValues/delete | Deletes specific named value from the API Management service instance. |
> | Microsoft.ApiManagement/service/namedValues/listValue/action | Gets the secret of the named value specified by its identifier. |
> | Microsoft.ApiManagement/service/namedValues/refreshSecret/action | Refreshes named value by fetching it from Key Vault. |
> | Microsoft.ApiManagement/service/networkstatus/read | Gets the network access status of resources on which the service depends. |
> | Microsoft.ApiManagement/service/notifications/read | Lists a collection of properties defined within a service instance. or Gets the details of the Notification specified by its identifier. |
> | Microsoft.ApiManagement/service/notifications/write | Create or Update API Management publisher notification. |
> | Microsoft.ApiManagement/service/notifications/recipientEmails/read | Gets the list of the Notification Recipient Emails subscribed to a notification. |
> | Microsoft.ApiManagement/service/notifications/recipientEmails/write | Adds the Email address to the list of Recipients for the Notification. |
> | Microsoft.ApiManagement/service/notifications/recipientEmails/delete | Removes the email from the list of Notification. |
> | Microsoft.ApiManagement/service/notifications/recipientUsers/read | Gets the list of the Notification Recipient User subscribed to the notification. |
> | Microsoft.ApiManagement/service/notifications/recipientUsers/write | Adds the API Management User to the list of Recipients for the Notification. |
> | Microsoft.ApiManagement/service/notifications/recipientUsers/delete | Removes the API Management user from the list of Notification. |
> | Microsoft.ApiManagement/service/openidConnectProviders/read | Lists of all the OpenId Connect Providers. or Gets specific OpenID Connect Provider without secrets. |
> | Microsoft.ApiManagement/service/openidConnectProviders/write | Creates or updates the OpenID Connect Provider. or Updates the specific OpenID Connect Provider. |
> | Microsoft.ApiManagement/service/openidConnectProviders/delete | Deletes specific OpenID Connect Provider of the API Management service instance. |
> | Microsoft.ApiManagement/service/openidConnectProviders/listSecrets/action | Gets specific OpenID Connect Provider secrets. |
> | Microsoft.ApiManagement/service/operationresults/read | Gets current status of long running operation |
> | Microsoft.ApiManagement/service/outboundNetworkDependenciesEndpoints/read | Gets the outbound network dependency status of resources on which the service depends. |
> | Microsoft.ApiManagement/service/policies/read | Lists all the Global Policy definitions of the Api Management service. or Get the Global policy definition of the Api Management service. |
> | Microsoft.ApiManagement/service/policies/write | Creates or updates the global policy configuration of the Api Management service. |
> | Microsoft.ApiManagement/service/policies/delete | Deletes the global policy configuration of the Api Management Service. |
> | Microsoft.ApiManagement/service/policy/read | Get the policy configuration at Tenant level |
> | Microsoft.ApiManagement/service/policy/write | Create policy configuration at Tenant level |
> | Microsoft.ApiManagement/service/policy/delete | Delete the policy configuration at Tenant level |
> | Microsoft.ApiManagement/service/policyDescriptions/read | Lists all policy descriptions. |
> | Microsoft.ApiManagement/service/policyFragments/read | Gets all policy fragments. or Gets a policy fragment. |
> | Microsoft.ApiManagement/service/policyFragments/write | Creates or updates a policy fragment. |
> | Microsoft.ApiManagement/service/policyFragments/delete | Deletes a policy fragment. |
> | Microsoft.ApiManagement/service/policyFragments/listReferences/action | Lists policy resources that reference the policy fragment. |
> | Microsoft.ApiManagement/service/policyRestrictions/read | Lists all the Global Policy Restrictions of the Api Management service. or Get the Global policy restriction of the Api Management service. |
> | Microsoft.ApiManagement/service/policyRestrictions/write | Creates or updates the global policy restriction of the Api Management service. or Updates the global policy restriction of the Api Management service. |
> | Microsoft.ApiManagement/service/policyRestrictions/delete | Deletes the global policy restriction of the Api Management Service. |
> | Microsoft.ApiManagement/service/policySnippets/read | Lists all policy snippets. |
> | Microsoft.ApiManagement/service/portalConfigs/read | Lists a collection of developer portal config entities. or Gets developer portal config specified by its identifier. |
> | Microsoft.ApiManagement/service/portalConfigs/write | Creates a new developer portal config. or Updates the description of specified portal config or makes it current. |
> | Microsoft.ApiManagement/service/portalConfigs/listDelegationSecrets/action | Gets validation key of portal delegation settings. |
> | Microsoft.ApiManagement/service/portalConfigs/listMediaContentSecrets/action | Get media content blob container uri. |
> | Microsoft.ApiManagement/service/portalRevisions/read | Lists a collection of developer portal revision entities. or Gets developer portal revision specified by its identifier. |
> | Microsoft.ApiManagement/service/portalRevisions/write | Creates a new developer portal revision. or Updates the description of specified portal revision or makes it current. |
> | Microsoft.ApiManagement/service/portalSettings/read | Lists a collection of portal settings. or Get Sign In Settings for the Portal or Get Sign Up Settings for the Portal or Get Delegation Settings for the Portal. |
> | Microsoft.ApiManagement/service/portalSettings/write | Update Sign-In settings. or Create or Update Sign-In settings. or Update Sign Up settings or Update Sign Up settings or Update Delegation settings. or Create or Update Delegation settings. |
> | Microsoft.ApiManagement/service/portalSettings/listSecrets/action | Gets validation key of portal delegation settings. or Get media content blob container uri. |
> | Microsoft.ApiManagement/service/privateEndpointConnectionProxies/read | Get Private Endpoint Connection Proxy |
> | Microsoft.ApiManagement/service/privateEndpointConnectionProxies/write | Create the private endpoint connection proxy |
> | Microsoft.ApiManagement/service/privateEndpointConnectionProxies/delete | Delete the private endpoint connection proxy |
> | Microsoft.ApiManagement/service/privateEndpointConnectionProxies/validate/action | Validate the private endpoint connection proxy |
> | Microsoft.ApiManagement/service/privateEndpointConnectionProxies/operationresults/read | View the result of private endpoint connection operations in the management portal |
> | Microsoft.ApiManagement/service/privateEndpointConnections/read | Get Private Endpoint Connections |
> | Microsoft.ApiManagement/service/privateEndpointConnections/write | Approve Or Reject Private Endpoint Connections |
> | Microsoft.ApiManagement/service/privateEndpointConnections/delete | Delete Private Endpoint Connections |
> | Microsoft.ApiManagement/service/privateLinkResources/read | Get Private Link Group resources |
> | Microsoft.ApiManagement/service/products/read | Lists a collection of products in the specified service instance. or Gets the details of the product specified by its identifier. |
> | Microsoft.ApiManagement/service/products/write | Creates or Updates a product. or Update existing product details. |
> | Microsoft.ApiManagement/service/products/delete | Delete product. |
> | Microsoft.ApiManagement/service/products/apiLinks/read | Lists a collection of product-API links in the specified service instance. or Get product-API details. |
> | Microsoft.ApiManagement/service/products/apiLinks/write | Creates or Updates a product-API link. |
> | Microsoft.ApiManagement/service/products/apiLinks/delete | Delete product-API link. |
> | Microsoft.ApiManagement/service/products/apis/read | Lists a collection of the APIs associated with a product. |
> | Microsoft.ApiManagement/service/products/apis/write | Adds an API to the specified product. |
> | Microsoft.ApiManagement/service/products/apis/delete | Deletes the specified API from the specified product. |
> | Microsoft.ApiManagement/service/products/groupLinks/read | Lists a collection of product-group links in the specified service instance. or Get product-group details. |
> | Microsoft.ApiManagement/service/products/groupLinks/write | Creates or Updates a product-group link. |
> | Microsoft.ApiManagement/service/products/groupLinks/delete | Delete product-group link. |
> | Microsoft.ApiManagement/service/products/groups/read | Lists the collection of developer groups associated with the specified product. |
> | Microsoft.ApiManagement/service/products/groups/write | Adds the association between the specified developer group with the specified product. |
> | Microsoft.ApiManagement/service/products/groups/delete | Deletes the association between the specified group and product. |
> | Microsoft.ApiManagement/service/products/policies/read | Get the policy configuration at the Product level. or Get the policy configuration at the Product level. |
> | Microsoft.ApiManagement/service/products/policies/write | Creates or updates policy configuration for the Product. |
> | Microsoft.ApiManagement/service/products/policies/delete | Deletes the policy configuration at the Product. |
> | Microsoft.ApiManagement/service/products/policy/read | Get the policy configuration at Product level |
> | Microsoft.ApiManagement/service/products/policy/write | Create policy configuration at Product level |
> | Microsoft.ApiManagement/service/products/policy/delete | Delete the policy configuration at Product level |
> | Microsoft.ApiManagement/service/products/subscriptions/read | Lists the collection of subscriptions to the specified product. |
> | Microsoft.ApiManagement/service/products/tags/read | Lists all Tags associated with the Product. or Get tag associated with the Product. |
> | Microsoft.ApiManagement/service/products/tags/write | Assign tag to the Product. |
> | Microsoft.ApiManagement/service/products/tags/delete | Detach the tag from the Product. |
> | Microsoft.ApiManagement/service/productsByTags/read | Lists a collection of products associated with tags. |
> | Microsoft.ApiManagement/service/properties/read | Lists a collection of properties defined within a service instance. or Gets the details of the property specified by its identifier. |
> | Microsoft.ApiManagement/service/properties/write | Creates or updates a property. or Updates the specific property. |
> | Microsoft.ApiManagement/service/properties/delete | Deletes specific property from the API Management service instance. |
> | Microsoft.ApiManagement/service/properties/listSecrets/action | Gets the secrets of the property specified by its identifier. |
> | Microsoft.ApiManagement/service/providers/Microsoft.Insights/diagnosticSettings/read | Gets the diagnostic setting for ApiManagement service |
> | Microsoft.ApiManagement/service/providers/Microsoft.Insights/diagnosticSettings/write | Creates or updates the diagnostic setting for ApiManagement service |
> | Microsoft.ApiManagement/service/providers/Microsoft.Insights/logDefinitions/read | Gets the available logs for API Management service |
> | Microsoft.ApiManagement/service/providers/Microsoft.Insights/metricDefinitions/read | Gets the available metrics for API Management service |
> | Microsoft.ApiManagement/service/quotas/read | Get values for quota |
> | Microsoft.ApiManagement/service/quotas/write | Set quota counter current value |
> | Microsoft.ApiManagement/service/quotas/periods/read | Get quota counter value for period |
> | Microsoft.ApiManagement/service/quotas/periods/write | Set quota counter current value |
> | Microsoft.ApiManagement/service/regions/read | Lists all azure regions in which the service exists. |
> | Microsoft.ApiManagement/service/reports/read | Get report aggregated by time periods or Get report aggregated by geographical region or Get report aggregated by developers.<br>or Get report aggregated by products.<br>or Get report aggregated by APIs or Get report aggregated by operations or Get report aggregated by subscription.<br>or Get requests reporting data |
> | Microsoft.ApiManagement/service/schemas/read | Lists a collection of schemas registered. or Gets the details of the Schema specified by its identifier. |
> | Microsoft.ApiManagement/service/schemas/write | Creates or updates an Schema to be used in Api Management instance. |
> | Microsoft.ApiManagement/service/schemas/delete | Deletes specific Schema. |
> | Microsoft.ApiManagement/service/settings/read | Lists a collection of tenant settings. Always empty. Use /settings/public instead |
> | Microsoft.ApiManagement/service/subscriptions/read | Lists all subscriptions of the API Management service instance. or Gets the specified Subscription entity (without keys). |
> | Microsoft.ApiManagement/service/subscriptions/write | Creates or updates the subscription of specified user to the specified product. or Updates the details of a subscription specified by its identifier. |
> | Microsoft.ApiManagement/service/subscriptions/delete | Deletes the specified subscription. |
> | Microsoft.ApiManagement/service/subscriptions/regeneratePrimaryKey/action | Regenerates primary key of existing subscription of the API Management service instance. |
> | Microsoft.ApiManagement/service/subscriptions/regenerateSecondaryKey/action | Regenerates secondary key of existing subscription of the API Management service instance. |
> | Microsoft.ApiManagement/service/subscriptions/listSecrets/action | Gets the specified Subscription keys. |
> | Microsoft.ApiManagement/service/tagResources/read | Lists a collection of resources associated with tags. |
> | Microsoft.ApiManagement/service/tags/read | Lists a collection of tags defined within a service instance. or Gets the details of the tag specified by its identifier. |
> | Microsoft.ApiManagement/service/tags/write | Creates a tag. or Updates the details of the tag specified by its identifier. |
> | Microsoft.ApiManagement/service/tags/delete | Deletes specific tag of the API Management service instance. |
> | Microsoft.ApiManagement/service/tags/apiLinks/read | Lists a collection of Tag-API links in the specified service instance. or Get Tag-API details. |
> | Microsoft.ApiManagement/service/tags/apiLinks/write | Creates or Updates a Tag-API link. |
> | Microsoft.ApiManagement/service/tags/apiLinks/delete | Delete Tag-API link. |
> | Microsoft.ApiManagement/service/tags/operationLinks/read | Lists a collection of Tag-operation links in the specified service instance. or Get Tag-operation details. |
> | Microsoft.ApiManagement/service/tags/operationLinks/write | Creates or Updates a Tag-operation link. |
> | Microsoft.ApiManagement/service/tags/operationLinks/delete | Delete Tag-operation link. |
> | Microsoft.ApiManagement/service/tags/productLinks/read | Lists a collection of Tag-product links in the specified service instance. or Get Tag-product details. |
> | Microsoft.ApiManagement/service/tags/productLinks/write | Creates or Updates a Tag-product link. |
> | Microsoft.ApiManagement/service/tags/productLinks/delete | Delete Tag-product link. |
> | Microsoft.ApiManagement/service/templates/read | Gets all email templates or Gets API Management email template details |
> | Microsoft.ApiManagement/service/templates/write | Create or update API Management email template or Updates API Management email template |
> | Microsoft.ApiManagement/service/templates/delete | Reset default API Management email template |
> | Microsoft.ApiManagement/service/tenant/read | Lists a collection of tenant access settings. or Get the Global policy definition of the Api Management service. or Get tenant access information details |
> | Microsoft.ApiManagement/service/tenant/write | Set policy configuration for the tenant or Update tenant access information details or Update tenant access information details |
> | Microsoft.ApiManagement/service/tenant/delete | Remove policy configuration for the tenant |
> | Microsoft.ApiManagement/service/tenant/listSecrets/action | Get tenant access information details |
> | Microsoft.ApiManagement/service/tenant/regeneratePrimaryKey/action | Regenerate primary access key |
> | Microsoft.ApiManagement/service/tenant/regenerateSecondaryKey/action | Regenerate secondary access key |
> | Microsoft.ApiManagement/service/tenant/deploy/action | Runs a deployment task to apply changes from the specified git branch to the configuration in database. |
> | Microsoft.ApiManagement/service/tenant/save/action | Creates commit with configuration snapshot to the specified branch in the repository |
> | Microsoft.ApiManagement/service/tenant/validate/action | Validates changes from the specified git branch |
> | Microsoft.ApiManagement/service/tenant/operationResults/read | Get list of operation results or Get result of a specific operation |
> | Microsoft.ApiManagement/service/tenant/syncState/read | Get status of last git synchronization |
> | Microsoft.ApiManagement/service/tenants/apis/diagnostics/read | Lists all diagnostics of an API. or Gets the details of the Diagnostic for an API specified by its identifier. |
> | Microsoft.ApiManagement/service/tenants/apis/diagnostics/write | Creates a new Diagnostic for an API or updates an existing one. or Updates the details of the Diagnostic for an API specified by its identifier. |
> | Microsoft.ApiManagement/service/tenants/apis/diagnostics/delete | Deletes the specified Diagnostic from an API. |
> | Microsoft.ApiManagement/service/tenants/apis/operations/read | Lists a collection of the operations for the specified API. or Gets the details of the API Operation specified by its identifier. |
> | Microsoft.ApiManagement/service/tenants/apis/operations/write | Creates a new operation in the API or updates an existing one. or Updates the details of the operation in the API specified by its identifier. |
> | Microsoft.ApiManagement/service/tenants/apis/operations/delete | Deletes the specified operation in the API. |
> | Microsoft.ApiManagement/service/tenants/apis/operations/policies/read | Get the list of policy configuration at the API Operation level. or Get the policy configuration at the API Operation level. |
> | Microsoft.ApiManagement/service/tenants/apis/operations/policies/write | Creates or updates policy configuration for the API Operation level. |
> | Microsoft.ApiManagement/service/tenants/apis/operations/policies/delete | Deletes the policy configuration at the Api Operation. |
> | Microsoft.ApiManagement/service/tenants/apis/operations/tags/read | Lists all Tags associated with the Operation. or Get tag associated with the Operation. |
> | Microsoft.ApiManagement/service/tenants/apis/operations/tags/write | Assign tag to the Operation. |
> | Microsoft.ApiManagement/service/tenants/apis/operations/tags/delete | Detach the tag from the Operation. |
> | Microsoft.ApiManagement/service/tenants/apis/operationsByTags/read | Lists a collection of operations associated with tags. |
> | Microsoft.ApiManagement/service/tenants/apis/policies/read | Get the policy configuration at the API level. or Get the policy configuration at the API level. |
> | Microsoft.ApiManagement/service/tenants/apis/policies/write | Creates or updates policy configuration for the API. |
> | Microsoft.ApiManagement/service/tenants/apis/policies/delete | Deletes the policy configuration at the Api. |
> | Microsoft.ApiManagement/service/tenants/apis/products/read | Lists all Products, which the API is part of. |
> | Microsoft.ApiManagement/service/tenants/apis/releases/read | Lists all releases of an API.<br>An API release is created when making an API Revision current.<br>Releases are also used to rollback to previous revisions.<br>Results will be paged and can be constrained by the $top and $skip parameters.<br>or Returns the details of an API release. |
> | Microsoft.ApiManagement/service/tenants/apis/releases/delete | Removes all releases of the API or Deletes the specified release in the API. |
> | Microsoft.ApiManagement/service/tenants/apis/releases/write | Creates a new Release for the API. or Updates the details of the release of the API specified by its identifier. |
> | Microsoft.ApiManagement/service/tenants/apis/resolvers/read | Get the graphQL resolvers at the API level. or Get the graphQL resolver at the API level. |
> | Microsoft.ApiManagement/service/tenants/apis/resolvers/write | Creates or updates graphQL resolver for the API. or Updates the details of the graphQL resolver in the API specified by its identifier. |
> | Microsoft.ApiManagement/service/tenants/apis/resolvers/delete | Deletes the policy configuration at the Api. |
> | Microsoft.ApiManagement/service/tenants/apis/resolvers/policies/read | Get the list of policy configurations at the GraphQL API resolver level. or Get the policy configuration at the GraphQL API resolver level. |
> | Microsoft.ApiManagement/service/tenants/apis/resolvers/policies/write | Creates or updates policy configuration for the GraphQL API. |
> | Microsoft.ApiManagement/service/tenants/apis/resolvers/policies/delete | Deletes the policy configuration at the GraphQL Api. |
> | Microsoft.ApiManagement/service/tenants/apis/revisions/read | Lists all revisions of an API. |
> | Microsoft.ApiManagement/service/tenants/apis/revisions/delete | Removes all revisions of an API |
> | Microsoft.ApiManagement/service/tenants/apis/schemas/read | Get the schema configuration at the API level. or Get the schema configuration at the API level. |
> | Microsoft.ApiManagement/service/tenants/apis/schemas/write | Creates or updates schema configuration for the API. |
> | Microsoft.ApiManagement/service/tenants/apis/schemas/delete | Deletes the schema configuration at the Api. |
> | Microsoft.ApiManagement/service/tenants/apis/tagDescriptions/read | Lists all Tags descriptions in scope of API. Model similar to swagger - tagDescription is defined on API level but tag may be assigned to the Operations or Get Tag description in scope of API |
> | Microsoft.ApiManagement/service/tenants/apis/tagDescriptions/write | Create/Update tag description in scope of the Api. |
> | Microsoft.ApiManagement/service/tenants/apis/tagDescriptions/delete | Delete tag description for the Api. |
> | Microsoft.ApiManagement/service/tenants/apis/tags/read | Lists all Tags associated with the API. or Get tag associated with the API. |
> | Microsoft.ApiManagement/service/tenants/apis/tags/write | Assign tag to the Api. |
> | Microsoft.ApiManagement/service/tenants/apis/tags/delete | Detach the tag from the Api. |
> | Microsoft.ApiManagement/service/tenants/keys/read | Get a list of keys or Get details of key |
> | Microsoft.ApiManagement/service/tenants/keys/write | Create a Key to an existing Existing Entity or Update existing key details. This operation can be used to renew key. |
> | Microsoft.ApiManagement/service/tenants/keys/delete | Delete key. This operation can be used to delete key. |
> | Microsoft.ApiManagement/service/tenants/keys/regeneratePrimaryKey/action | Regenerate primary key |
> | Microsoft.ApiManagement/service/tenants/keys/regenerateSecondaryKey/action | Regenerate secondary key |
> | Microsoft.ApiManagement/service/users/read | Lists a collection of registered users in the specified service instance. or Gets the details of the user specified by its identifier. |
> | Microsoft.ApiManagement/service/users/write | Creates or Updates a user. or Updates the details of the user specified by its identifier. |
> | Microsoft.ApiManagement/service/users/delete | Deletes specific user. |
> | Microsoft.ApiManagement/service/users/generateSsoUrl/action | Retrieves a redirection URL containing an authentication token for signing a given user into the developer portal. |
> | Microsoft.ApiManagement/service/users/token/action | Gets the Shared Access Authorization Token for the User. |
> | Microsoft.ApiManagement/service/users/confirmations/send/action | Sends confirmation |
> | Microsoft.ApiManagement/service/users/groups/read | Lists all user groups. |
> | Microsoft.ApiManagement/service/users/identities/read | List of all user identities. |
> | Microsoft.ApiManagement/service/users/keys/read | Get keys associated with user |
> | Microsoft.ApiManagement/service/users/subscriptions/read | Lists the collection of subscriptions of the specified user. |
> | Microsoft.ApiManagement/service/workspaces/read | Lists a collection of Workspaces defined within a service instance. or Gets the details of the Workspace specified by its identifier. |
> | Microsoft.ApiManagement/service/workspaces/write | Creates Workspace. or Updates the details of the Workspace specified by its identifier. |
> | Microsoft.ApiManagement/service/workspaces/delete | Deletes specific Workspace of the API Management service instance. |
> | Microsoft.ApiManagement/service/workspaces/notifications/action | Sends notification to a specified user |
> | Microsoft.ApiManagement/service/workspaces/apis/read | Lists all APIs of the API Management service instance. or Gets the details of the API specified by its identifier. |
> | Microsoft.ApiManagement/service/workspaces/apis/write | Creates new or updates existing specified API of the API Management service instance. or Updates the specified API of the API Management service instance. |
> | Microsoft.ApiManagement/service/workspaces/apis/delete | Deletes the specified API of the API Management service instance. |
> | Microsoft.ApiManagement/service/workspaces/apis/diagnostics/read | Lists all diagnostics of an API. or Gets the details of the Diagnostic for an API specified by its identifier. |
> | Microsoft.ApiManagement/service/workspaces/apis/diagnostics/write | Creates a new Diagnostic for an API or updates an existing one. or Updates the details of the Diagnostic for an API specified by its identifier. |
> | Microsoft.ApiManagement/service/workspaces/apis/diagnostics/delete | Deletes the specified Diagnostic from an API. |
> | Microsoft.ApiManagement/service/workspaces/apis/operations/read | Lists a collection of the operations for the specified API. or Gets the details of the API Operation specified by its identifier. |
> | Microsoft.ApiManagement/service/workspaces/apis/operations/write | Creates a new operation in the API or updates an existing one. or Updates the details of the operation in the API specified by its identifier. |
> | Microsoft.ApiManagement/service/workspaces/apis/operations/delete | Deletes the specified operation in the API. |
> | Microsoft.ApiManagement/service/workspaces/apis/operations/policies/read | Get the list of policy configuration at the API Operation level. or Get the policy configuration at the API Operation level. |
> | Microsoft.ApiManagement/service/workspaces/apis/operations/policies/write | Creates or updates policy configuration for the API Operation level. |
> | Microsoft.ApiManagement/service/workspaces/apis/operations/policies/delete | Deletes the policy configuration at the Api Operation. |
> | Microsoft.ApiManagement/service/workspaces/apis/operations/tags/read | Lists all Tags associated with the Operation. or Get tag associated with the Operation. |
> | Microsoft.ApiManagement/service/workspaces/apis/operations/tags/write | Assign tag to the Operation. |
> | Microsoft.ApiManagement/service/workspaces/apis/operations/tags/delete | Detach the tag from the Operation. |
> | Microsoft.ApiManagement/service/workspaces/apis/operationsByTags/read | Lists a collection of operations associated with tags. |
> | Microsoft.ApiManagement/service/workspaces/apis/policies/read | Get the policy configuration at the API level. or Get the policy configuration at the API level. |
> | Microsoft.ApiManagement/service/workspaces/apis/policies/write | Creates or updates policy configuration for the API. |
> | Microsoft.ApiManagement/service/workspaces/apis/policies/delete | Deletes the policy configuration at the Api. |
> | Microsoft.ApiManagement/service/workspaces/apis/products/read | Lists all Products, which the API is part of. |
> | Microsoft.ApiManagement/service/workspaces/apis/releases/read | Lists all releases of an API.<br>An API release is created when making an API Revision current.<br>Releases are also used to rollback to previous revisions.<br>Results will be paged and can be constrained by the $top and $skip parameters.<br>or Returns the details of an API release. |
> | Microsoft.ApiManagement/service/workspaces/apis/releases/delete | Removes all releases of the API or Deletes the specified release in the API. |
> | Microsoft.ApiManagement/service/workspaces/apis/releases/write | Creates a new Release for the API. or Updates the details of the release of the API specified by its identifier. |
> | Microsoft.ApiManagement/service/workspaces/apis/revisions/read | Lists all revisions of an API. |
> | Microsoft.ApiManagement/service/workspaces/apis/schemas/read | Get the schema configuration at the API level. or Get the schema configuration at the API level. |
> | Microsoft.ApiManagement/service/workspaces/apis/schemas/write | Creates or updates schema configuration for the API. |
> | Microsoft.ApiManagement/service/workspaces/apis/schemas/delete | Deletes the schema configuration at the Api. |
> | Microsoft.ApiManagement/service/workspaces/apis/schemas/document/read | Get the document describing the Schema |
> | Microsoft.ApiManagement/service/workspaces/apis/schemas/document/write | Update the document describing the Schema |
> | Microsoft.ApiManagement/service/workspaces/apis/tags/read | Lists all Tags associated with the API. or Get tag associated with the API. |
> | Microsoft.ApiManagement/service/workspaces/apis/tags/write | Assign tag to the Api. |
> | Microsoft.ApiManagement/service/workspaces/apis/tags/delete | Detach the tag from the Api. |
> | Microsoft.ApiManagement/service/workspaces/apiVersionSets/read | Lists a collection of API Version Sets in the specified service instance. or Gets the details of the Api Version Set specified by its identifier. |
> | Microsoft.ApiManagement/service/workspaces/apiVersionSets/write | Creates or Updates a Api Version Set. or Updates the details of the Api VersionSet specified by its identifier. |
> | Microsoft.ApiManagement/service/workspaces/apiVersionSets/delete | Deletes specific Api Version Set. |
> | Microsoft.ApiManagement/service/workspaces/apiVersionSets/versions/read | Get list of version entities |
> | Microsoft.ApiManagement/service/workspaces/backends/read | Lists a collection of backed in the specified service instance. or Gets the details of the backend specified by its identifier. |
> | Microsoft.ApiManagement/service/workspaces/backends/write | Creates or Updates a Api Version Set. or Updates the details of the backend specified by its identifier. |
> | Microsoft.ApiManagement/service/workspaces/backends/delete | Deletes specific Api Version Set. |
> | Microsoft.ApiManagement/service/workspaces/backends/reconnect/action | Notifies the APIM proxy to create a new connection to the backend after the specified timeout. If no timeout was specified, timeout of 2 minutes is used. |
> | Microsoft.ApiManagement/service/workspaces/certificates/read | Lists a collection of all certificates in the specified workspace or Gets the details of the certificate specified by its identifier. |
> | Microsoft.ApiManagement/service/workspaces/certificates/write | Creates or updates the certificate being used for authentication with the backend. |
> | Microsoft.ApiManagement/service/workspaces/certificates/delete | Deletes specific certificate. |
> | Microsoft.ApiManagement/service/workspaces/certificates/refreshSecret/action | Refreshes certificate by fetching it from Key Vault. |
> | Microsoft.ApiManagement/service/workspaces/diagnostics/read | Lists all diagnostics of a workspace. or Gets the details of the Diagnostic for a workspace specified by its identifier. |
> | Microsoft.ApiManagement/service/workspaces/diagnostics/write | Creates a new Diagnostic for a workspace or updates an existing one. or Updates the details of the Diagnostic for a workspace specified by its identifier. |
> | Microsoft.ApiManagement/service/workspaces/diagnostics/delete | Deletes the specified Diagnostic from a workspace. |
> | Microsoft.ApiManagement/service/workspaces/documentations/read | Lists all Documentations of the API Management service instance. or Gets the details of the documentation specified by its identifier. |
> | Microsoft.ApiManagement/service/workspaces/documentations/write | Creates or Updates a documentation. or Updates the specified documentation of the API Management service instance. |
> | Microsoft.ApiManagement/service/workspaces/documentations/delete | Delete documentation. |
> | Microsoft.ApiManagement/service/workspaces/groups/read | Lists a collection of groups defined within a service instance. or Gets the details of the group specified by its identifier. |
> | Microsoft.ApiManagement/service/workspaces/groups/write | Creates or Updates a group. or Updates the details of the group specified by its identifier. |
> | Microsoft.ApiManagement/service/workspaces/groups/delete | Deletes specific group of the API Management service instance. |
> | Microsoft.ApiManagement/service/workspaces/groups/users/read | Lists a collection of user entities associated with the group. |
> | Microsoft.ApiManagement/service/workspaces/groups/users/write | Add existing user to existing group |
> | Microsoft.ApiManagement/service/workspaces/groups/users/delete | Remove existing user from existing group. |
> | Microsoft.ApiManagement/service/workspaces/loggers/read | Lists a collection of loggers in the specified workspace. or Gets the details of the logger specified by its identifier. |
> | Microsoft.ApiManagement/service/workspaces/loggers/write | Creates or Updates a logger. or Updates an existing logger. |
> | Microsoft.ApiManagement/service/workspaces/loggers/delete | Deletes the specified logger. |
> | Microsoft.ApiManagement/service/workspaces/namedValues/read | Lists a collection of named values defined within a service instance. or Gets the details of the named value specified by its identifier. |
> | Microsoft.ApiManagement/service/workspaces/namedValues/write | Creates or updates named value. or Updates the specific named value. |
> | Microsoft.ApiManagement/service/workspaces/namedValues/delete | Deletes specific named value from the API Management service instance. |
> | Microsoft.ApiManagement/service/workspaces/namedValues/listValue/action | Gets the secret of the named value specified by its identifier. |
> | Microsoft.ApiManagement/service/workspaces/namedValues/refreshSecret/action | Refreshes named value by fetching it from Key Vault. |
> | Microsoft.ApiManagement/service/workspaces/notifications/read | Lists a collection of properties defined within a service instance. or Gets the details of the Notification specified by its identifier. |
> | Microsoft.ApiManagement/service/workspaces/notifications/write | Create or Update API Management publisher notification. |
> | Microsoft.ApiManagement/service/workspaces/notifications/recipientEmails/read | Gets the list of the Notification Recipient Emails subscribed to a notification. |
> | Microsoft.ApiManagement/service/workspaces/notifications/recipientEmails/write | Adds the Email address to the list of Recipients for the Notification. |
> | Microsoft.ApiManagement/service/workspaces/notifications/recipientEmails/delete | Removes the email from the list of Notification. |
> | Microsoft.ApiManagement/service/workspaces/notifications/recipientUsers/read | Gets the list of the Notification Recipient User subscribed to the notification. |
> | Microsoft.ApiManagement/service/workspaces/notifications/recipientUsers/write | Adds the API Management User to the list of Recipients for the Notification. |
> | Microsoft.ApiManagement/service/workspaces/notifications/recipientUsers/delete | Removes the API Management user from the list of Notification. |
> | Microsoft.ApiManagement/service/workspaces/policies/read | Get the policy configuration at the Workspace level. or Get the policy configuration at the Workspace level. |
> | Microsoft.ApiManagement/service/workspaces/policies/write | Creates or updates policy configuration for the Workspace. |
> | Microsoft.ApiManagement/service/workspaces/policies/delete | Deletes the policy configuration at the Workspace. |
> | Microsoft.ApiManagement/service/workspaces/policyFragments/read | Gets all policy fragments. or Gets a policy fragment. |
> | Microsoft.ApiManagement/service/workspaces/policyFragments/write | Creates or updates a policy fragment. |
> | Microsoft.ApiManagement/service/workspaces/policyFragments/delete | Deletes a policy fragment. |
> | Microsoft.ApiManagement/service/workspaces/policyFragments/listReferences/action | Lists policy resources that reference the policy fragment. |
> | Microsoft.ApiManagement/service/workspaces/products/read | Lists a collection of products in the specified service instance. or Gets the details of the product specified by its identifier. |
> | Microsoft.ApiManagement/service/workspaces/products/write | Creates or Updates a product. or Update existing product details. |
> | Microsoft.ApiManagement/service/workspaces/products/delete | Delete product. |
> | Microsoft.ApiManagement/service/workspaces/products/apiLinks/read | Lists a collection of product-API links in the specified service instance. or Get product-API details. |
> | Microsoft.ApiManagement/service/workspaces/products/apiLinks/write | Creates or Updates a product-API link. |
> | Microsoft.ApiManagement/service/workspaces/products/apiLinks/delete | Delete product-API link. |
> | Microsoft.ApiManagement/service/workspaces/products/apis/read | Lists a collection of the APIs associated with a product. |
> | Microsoft.ApiManagement/service/workspaces/products/apis/write | Adds an API to the specified product. |
> | Microsoft.ApiManagement/service/workspaces/products/apis/delete | Deletes the specified API from the specified product. |
> | Microsoft.ApiManagement/service/workspaces/products/groupLinks/read | Lists a collection of product-group links in the specified service instance. or Get product-group details. |
> | Microsoft.ApiManagement/service/workspaces/products/groupLinks/write | Creates or Updates a product-group link. |
> | Microsoft.ApiManagement/service/workspaces/products/groupLinks/delete | Delete product-group link. |
> | Microsoft.ApiManagement/service/workspaces/products/groups/read | Lists the collection of developer groups associated with the specified product. |
> | Microsoft.ApiManagement/service/workspaces/products/groups/write | Adds the association between the specified developer group with the specified product. |
> | Microsoft.ApiManagement/service/workspaces/products/groups/delete | Deletes the association between the specified group and product. |
> | Microsoft.ApiManagement/service/workspaces/products/policies/read | Get the policy configuration at the Product level. or Get the policy configuration at the Product level. |
> | Microsoft.ApiManagement/service/workspaces/products/policies/write | Creates or updates policy configuration for the Product. |
> | Microsoft.ApiManagement/service/workspaces/products/policies/delete | Deletes the policy configuration at the Product. |
> | Microsoft.ApiManagement/service/workspaces/products/subscriptions/read | Lists the collection of subscriptions to the specified product. |
> | Microsoft.ApiManagement/service/workspaces/products/tags/read | Lists all Tags associated with the Product. or Get tag associated with the Product. |
> | Microsoft.ApiManagement/service/workspaces/products/tags/write | Assign tag to the Product. |
> | Microsoft.ApiManagement/service/workspaces/products/tags/delete | Detach the tag from the Product. |
> | Microsoft.ApiManagement/service/workspaces/schemas/read | Lists a collection of schemas registered. or Gets the details of the Schema specified by its identifier. |
> | Microsoft.ApiManagement/service/workspaces/schemas/write | Creates or updates an Schema to be used in Api Management instance. |
> | Microsoft.ApiManagement/service/workspaces/schemas/delete | Deletes specific Schema. |
> | Microsoft.ApiManagement/service/workspaces/subscriptions/read | Lists all subscriptions of the API Management service instance. or Gets the specified Subscription entity (without keys). |
> | Microsoft.ApiManagement/service/workspaces/subscriptions/write | Creates or updates the subscription of specified user to the specified product. or Updates the details of a subscription specified by its identifier. |
> | Microsoft.ApiManagement/service/workspaces/subscriptions/delete | Deletes the specified subscription. |
> | Microsoft.ApiManagement/service/workspaces/subscriptions/regeneratePrimaryKey/action | Regenerates primary key of existing subscription of the API Management service instance. |
> | Microsoft.ApiManagement/service/workspaces/subscriptions/regenerateSecondaryKey/action | Regenerates secondary key of existing subscription of the API Management service instance. |
> | Microsoft.ApiManagement/service/workspaces/subscriptions/listSecrets/action | Gets the specified Subscription keys. |
> | Microsoft.ApiManagement/service/workspaces/tags/read | Lists a collection of tags defined within a service instance. or Gets the details of the tag specified by its identifier. |
> | Microsoft.ApiManagement/service/workspaces/tags/write | Creates a tag. or Updates the details of the tag specified by its identifier. |
> | Microsoft.ApiManagement/service/workspaces/tags/delete | Deletes specific tag of the API Management service instance. |
> | Microsoft.ApiManagement/service/workspaces/tags/apiLinks/read | Lists a collection of Tag-API links in the specified service instance. or Get Tag-API details. |
> | Microsoft.ApiManagement/service/workspaces/tags/apiLinks/write | Creates or Updates a Tag-API link. |
> | Microsoft.ApiManagement/service/workspaces/tags/apiLinks/delete | Delete Tag-API link. |
> | Microsoft.ApiManagement/service/workspaces/tags/operationLinks/read | Lists a collection of Tag-operation links in the specified service instance. or Get Tag-operation details. |
> | Microsoft.ApiManagement/service/workspaces/tags/operationLinks/write | Creates or Updates a Tag-operation link. |
> | Microsoft.ApiManagement/service/workspaces/tags/operationLinks/delete | Delete Tag-operation link. |
> | Microsoft.ApiManagement/service/workspaces/tags/productLinks/read | Lists a collection of Tag-product links in the specified service instance. or Get Tag-product details. |
> | Microsoft.ApiManagement/service/workspaces/tags/productLinks/write | Creates or Updates a Tag-product link. |
> | Microsoft.ApiManagement/service/workspaces/tags/productLinks/delete | Delete Tag-product link. |
> | **DataAction** | **Description** |
> | Microsoft.ApiManagement/service/gateways/getConfiguration/action | Fetches configuration for specified self-hosted gateway |

## Microsoft.AppConfiguration

Fast, scalable parameter storage for app configuration.

Azure service: [Azure App Configuration](/azure/azure-app-configuration/)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.AppConfiguration/register/action | Registers a subscription to use Microsoft App Configuration. |
> | Microsoft.AppConfiguration/unregister/action | Unregisters a subscription from using Microsoft App Configuration. |
> | Microsoft.AppConfiguration/checkNameAvailability/read | Check whether the resource name is available for use. |
> | Microsoft.AppConfiguration/configurationStores/read | Gets the properties of the specified configuration store or lists all the configuration stores under the specified resource group or subscription. |
> | Microsoft.AppConfiguration/configurationStores/write | Create or update a configuration store with the specified parameters. |
> | Microsoft.AppConfiguration/configurationStores/delete | Deletes a configuration store. |
> | Microsoft.AppConfiguration/configurationStores/ListKeys/action | Lists the API keys for the specified configuration store. |
> | Microsoft.AppConfiguration/configurationStores/RegenerateKey/action | Regenerates of the API key's for the specified configuration store. |
> | Microsoft.AppConfiguration/configurationStores/ListKeyValue/action | Lists a key-value for the specified configuration store. |
> | Microsoft.AppConfiguration/configurationStores/PrivateEndpointConnectionsApproval/action | Auto-Approve a private endpoint connection under the specified configuration store. |
> | Microsoft.AppConfiguration/configurationStores/keyValues/action | Performs an action on an existing key-value from the configuration store. This also grants the ability to read key values. |
> | Microsoft.AppConfiguration/configurationStores/joinPerimeter/action | Determines if a user is allowed to associate an Azure App Configuration with a Network Security Perimeter. |
> | Microsoft.AppConfiguration/configurationStores/eventGridFilters/read | Gets the properties of the specified configuration store event grid filter or lists all the configuration store event grid filters under the specified configuration store. |
> | Microsoft.AppConfiguration/configurationStores/eventGridFilters/write | Create or update a configuration store event grid filter with the specified parameters. |
> | Microsoft.AppConfiguration/configurationStores/eventGridFilters/delete | Deletes a configuration store event grid filter. |
> | Microsoft.AppConfiguration/configurationStores/keyValues/write | Creates or updates a key-value in the configuration store. |
> | Microsoft.AppConfiguration/configurationStores/keyValues/delete | Deletes an existing key-value from the configuration store. |
> | Microsoft.AppConfiguration/configurationStores/networkSecurityPerimeterAssociationProxies/read | Get the properties of the specific network security perimeter association proxy or lists all the network security perimeter association proxies under the specified configuration store. |
> | Microsoft.AppConfiguration/configurationStores/networkSecurityPerimeterAssociationProxies/write | Create or update a network security perimeter association proxy under the specified configuration store. |
> | Microsoft.AppConfiguration/configurationStores/networkSecurityPerimeterAssociationProxies/delete | Delete a network security perimeter association proxy under the specified configuration store. |
> | Microsoft.AppConfiguration/configurationStores/networkSecurityPerimeterConfigurations/read | Get the properties of the specific network security perimeter configuration or lists all the network security perimeter configurations under the specified configuration store. |
> | Microsoft.AppConfiguration/configurationStores/networkSecurityPerimeterConfigurations/reconcile/action | Reconcile a network security perimeter configuration under the specified configuration store. |
> | Microsoft.AppConfiguration/configurationStores/privateEndpointConnectionProxies/validate/action | Validate a private endpoint connection proxy under the specified configuration store. |
> | Microsoft.AppConfiguration/configurationStores/privateEndpointConnectionProxies/read | Get a private endpoint connection proxy under the specified configuration store. |
> | Microsoft.AppConfiguration/configurationStores/privateEndpointConnectionProxies/write | Create or update a private endpoint connection proxy under the specified configuration store. |
> | Microsoft.AppConfiguration/configurationStores/privateEndpointConnectionProxies/delete | Delete a private endpoint connection proxy under the specified configuration store. |
> | Microsoft.AppConfiguration/configurationStores/privateEndpointConnections/read | Get a private endpoint connection or list private endpoint connections under the specified configuration store. |
> | Microsoft.AppConfiguration/configurationStores/privateEndpointConnections/write | Approve or reject a private endpoint connection under the specified configuration store. |
> | Microsoft.AppConfiguration/configurationStores/privateEndpointConnections/delete | Delete a private endpoint connection under the specified configuration store. |
> | Microsoft.AppConfiguration/configurationStores/privateLinkResources/read | Lists all the private link resources under the specified configuration store. |
> | Microsoft.AppConfiguration/configurationStores/providers/Microsoft.Insights/diagnosticSettings/read | Read all Diagnostic Settings values for a Configuration Store. |
> | Microsoft.AppConfiguration/configurationStores/providers/Microsoft.Insights/diagnosticSettings/write | Write/Overwrite Diagnostic Settings for Microsoft App Configuration. |
> | Microsoft.AppConfiguration/configurationStores/providers/Microsoft.Insights/logDefinitions/read | Retrieve all log definitions for Microsoft App Configuration. |
> | Microsoft.AppConfiguration/configurationStores/providers/Microsoft.Insights/metricDefinitions/read | Retrieve all metric definitions for Microsoft App Configuration. |
> | Microsoft.AppConfiguration/configurationStores/replicas/read | Gets the properties of the specified replica or lists all the replicas under the specified configuration store. |
> | Microsoft.AppConfiguration/configurationStores/replicas/write | Creates a replica with the specified parameters. |
> | Microsoft.AppConfiguration/configurationStores/replicas/delete | Deletes a replica. |
> | Microsoft.AppConfiguration/locations/notifyNetworkSecurityPerimeterUpdatesAvailable/action | Receive network security perimeter update notifications. |
> | Microsoft.AppConfiguration/locations/checkNameAvailability/read | Check whether the resource name is available for use. |
> | Microsoft.AppConfiguration/locations/deletedConfigurationStores/read | Gets the properties of the specified deleted configuration store or lists all the deleted configuration stores under the specified subscription. |
> | Microsoft.AppConfiguration/locations/deletedConfigurationStores/purge/action | Purge the specified deleted configuration store. |
> | Microsoft.AppConfiguration/locations/operationsStatus/read | Get the status of an operation. |
> | Microsoft.AppConfiguration/operations/read | Lists all of the operations supported by Microsoft App Configuration. |
> | **DataAction** | **Description** |
> | Microsoft.AppConfiguration/configurationStores/keyValues/read | Reads a key-value from the configuration store. |
> | Microsoft.AppConfiguration/configurationStores/keyValues/write | Creates or updates a key-value in the configuration store. |
> | Microsoft.AppConfiguration/configurationStores/keyValues/delete | Deletes an existing key-value from the configuration store. |
> | Microsoft.AppConfiguration/configurationStores/snapshots/read | Reads a snapshot from the configuration store. |
> | Microsoft.AppConfiguration/configurationStores/snapshots/write | Creates or updates a snapshot in the configuration store. |
> | Microsoft.AppConfiguration/configurationStores/snapshots/archive/action | Modifies archival state for an existing snapshot in the configuration store. |

## Microsoft.Communication

Azure service: [Azure Communication Services](/azure/communication-services/overview)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.Communication/Register/Action | Registers Microsoft.Communication resource provider |
> | Microsoft.Communication/Unregister/Action | Unregisters Microsoft.Communication resource provider |
> | Microsoft.Communication/CheckNameAvailability/action | Checks if a name is available |
> | Microsoft.Communication/CommunicationServices/Read | Reads communication services |
> | Microsoft.Communication/CommunicationServices/Write | Writes communication services |
> | Microsoft.Communication/CommunicationServices/Delete | Deletes communication services |
> | Microsoft.Communication/CommunicationServices/ListKeys/action | Reads the keys for a communication service |
> | Microsoft.Communication/CommunicationServices/RegenerateKey/action | Regenerates the primary or secondary key for a communication service |
> | Microsoft.Communication/CommunicationServices/LinkNotificationHub/action | Links an Azure Notification Hub to the communication service |
> | Microsoft.Communication/CommunicationServices/EventGridFilters/Read | Reads EventGrid filters on communication services |
> | Microsoft.Communication/CommunicationServices/EventGridFilters/Write | Writes EventGrid filters on communication services |
> | Microsoft.Communication/CommunicationServices/EventGridFilters/Delete | Removes an EventGrid filter on communication services |
> | Microsoft.Communication/EmailServices/read | Get the EmailService and its properties. |
> | Microsoft.Communication/EmailServices/write | Get the EmailService and its properties. |
> | Microsoft.Communication/EmailServices/delete | Operation to delete a EmailService. |
> | Microsoft.Communication/EmailServices/verifiedExchangeOnlineDomains/action | List Verified Domains from the exchange online tenant. |
> | Microsoft.Communication/EmailServices/Domains/read | Get the email Domain and its properties. |
> | Microsoft.Communication/EmailServices/Domains/write | Add a new Domain under the parent EmailService resource or update an existing Domain resource. |
> | Microsoft.Communication/EmailServices/Domains/delete | Operation to delete a Domain resource. |
> | Microsoft.Communication/EmailServices/Domains/InitiateVerification/action | Initiate verification of Dns record. |
> | Microsoft.Communication/EmailServices/Domains/CancelVerification/action | Cancel verification of Dns record. |
> | Microsoft.Communication/EmailServices/Domains/RevokeVerification/action | Revoke existing verified status of a Dns record. |
> | Microsoft.Communication/EmailServices/Domains/SenderUsernames/read | List all valid sender usernames for a domains resource. |
> | Microsoft.Communication/EmailServices/Domains/SenderUsernames/read | Get the email SenderUsername and its properties. |
> | Microsoft.Communication/EmailServices/Domains/SenderUsernames/write | Add a new SenderUsername under the parent Domain resource or update an existing SenderUsername resource. |
> | Microsoft.Communication/EmailServices/Domains/SenderUsernames/delete | Operation to delete a SenderUsername resource. |
> | Microsoft.Communication/EmailServices/Domains/SuppressionLists/read | List all suppression lists for a domains resource. |
> | Microsoft.Communication/EmailServices/Domains/SuppressionLists/read | Get the suppression list and its properties. |
> | Microsoft.Communication/EmailServices/Domains/SuppressionLists/write | Add a new suppression list under the parent Domain resource or update an existing suppression list. |
> | Microsoft.Communication/EmailServices/Domains/SuppressionLists/delete | Operation to delete a suppressio lists. |
> | Microsoft.Communication/EmailServices/Domains/SuppressionLists/SuppressionListAddresses/read | Get all the addresses in a suppression list. |
> | Microsoft.Communication/EmailServices/Domains/SuppressionLists/SuppressionListAddresses/read | Get all the addresses in a suppression list. |
> | Microsoft.Communication/EmailServices/Domains/SuppressionLists/SuppressionListAddresses/write | Add a new suppression list under the parent Domain resource or update an existing suppression list. |
> | Microsoft.Communication/EmailServices/Domains/SuppressionLists/SuppressionListAddresses/delete | Operation to delete an address from a suppression list. |
> | Microsoft.Communication/Locations/OperationStatuses/read | Reads the status of an async operation |
> | Microsoft.Communication/Locations/OperationStatuses/write | Writes the status of an async operation |
> | Microsoft.Communication/Operations/read | Reads operations |
> | Microsoft.Communication/RegisteredSubscriptions/read | Reads registered subscriptions |

## Microsoft.EventGrid

Get reliable event delivery at massive scale.

Azure service: [Event Grid](/azure/event-grid/)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.EventGrid/register/action | Registers the subscription for the EventGrid resource provider. |
> | Microsoft.EventGrid/unregister/action | Unregisters the subscription for the EventGrid resource provider. |
> | Microsoft.EventGrid/domains/write | Create or update a domain |
> | Microsoft.EventGrid/domains/read | Read a domain |
> | Microsoft.EventGrid/domains/delete | Delete a domain |
> | Microsoft.EventGrid/domains/listKeys/action | List keys for a domain |
> | Microsoft.EventGrid/domains/regenerateKey/action | Regenerate key for a domain |
> | Microsoft.EventGrid/domains/PrivateEndpointConnectionsApproval/action | Approve PrivateEndpointConnections for domains |
> | Microsoft.EventGrid/domains/eventSubscriptions/write | Create or update a Domain eventSubscription |
> | Microsoft.EventGrid/domains/eventSubscriptions/read | Read a Domain eventSubscription |
> | Microsoft.EventGrid/domains/eventSubscriptions/delete | Delete a Domain eventSubscription |
> | Microsoft.EventGrid/domains/eventSubscriptions/getFullUrl/action | Get full url for the Domain event subscription |
> | Microsoft.EventGrid/domains/eventSubscriptions/getDeliveryAttributes/action | Get Domain EventSubscription Delivery Attributes |
> | Microsoft.EventGrid/domains/networkSecurityPerimeterAssociationProxies/read | Read NspAssociationProxies for domains |
> | Microsoft.EventGrid/domains/networkSecurityPerimeterAssociationProxies/write | Write NspAssociationProxies for domains |
> | Microsoft.EventGrid/domains/networkSecurityPerimeterAssociationProxies/delete | Delete NspAssociationProxies for domains |
> | Microsoft.EventGrid/domains/networkSecurityPerimeterConfigurations/read | Read NspConfiguration for domains |
> | Microsoft.EventGrid/domains/privateEndpointConnectionProxies/validate/action | Validate PrivateEndpointConnectionProxies for domains |
> | Microsoft.EventGrid/domains/privateEndpointConnectionProxies/read | Read PrivateEndpointConnectionProxies for domains |
> | Microsoft.EventGrid/domains/privateEndpointConnectionProxies/write | Write PrivateEndpointConnectionProxies for domains |
> | Microsoft.EventGrid/domains/privateEndpointConnectionProxies/delete | Delete PrivateEndpointConnectionProxies for domains |
> | Microsoft.EventGrid/domains/privateEndpointConnections/read | Read PrivateEndpointConnections for domains |
> | Microsoft.EventGrid/domains/privateEndpointConnections/write | Write PrivateEndpointConnections for domains |
> | Microsoft.EventGrid/domains/privateEndpointConnections/delete | Delete PrivateEndpointConnections for domains |
> | Microsoft.EventGrid/domains/privateLinkResources/read | Get or List PrivateLinkResources for domains |
> | Microsoft.EventGrid/domains/providers/Microsoft.Insights/logDefinitions/read | Allows access to diagnostic logs |
> | Microsoft.EventGrid/domains/providers/Microsoft.Insights/metricDefinitions/read | Gets the available metrics for domains |
> | Microsoft.EventGrid/domains/topics/read | Read a domain topic |
> | Microsoft.EventGrid/domains/topics/write | Create or update a domain topic |
> | Microsoft.EventGrid/domains/topics/delete | Delete a domain topic |
> | Microsoft.EventGrid/domains/topics/eventSubscriptions/write | Create or update a DomainTopic eventSubscription |
> | Microsoft.EventGrid/domains/topics/eventSubscriptions/read | Read a DomainTopic eventSubscription |
> | Microsoft.EventGrid/domains/topics/eventSubscriptions/delete | Delete a DomainTopic eventSubscription |
> | Microsoft.EventGrid/domains/topics/eventSubscriptions/getFullUrl/action | Get full url for the DomainTopic event subscription |
> | Microsoft.EventGrid/domains/topics/eventSubscriptions/getDeliveryAttributes/action | Get DomainTopic EventSubscription Delivery Attributes |
> | Microsoft.EventGrid/eventSubscriptions/write | Create or update an eventSubscription |
> | Microsoft.EventGrid/eventSubscriptions/read | Read an eventSubscription |
> | Microsoft.EventGrid/eventSubscriptions/delete | Delete an eventSubscription |
> | Microsoft.EventGrid/eventSubscriptions/getFullUrl/action | Get full url for the event subscription |
> | Microsoft.EventGrid/eventSubscriptions/getDeliveryAttributes/action | Get EventSubscription Delivery Attributes |
> | Microsoft.EventGrid/eventSubscriptions/providers/Microsoft.Insights/diagnosticSettings/read | Gets the diagnostic setting for event subscriptions |
> | Microsoft.EventGrid/eventSubscriptions/providers/Microsoft.Insights/diagnosticSettings/write | Creates or updates the diagnostic setting for event subscriptions |
> | Microsoft.EventGrid/eventSubscriptions/providers/Microsoft.Insights/metricDefinitions/read | Gets the available metrics for eventSubscriptions |
> | Microsoft.EventGrid/extensionTopics/read | Read an extensionTopic. |
> | Microsoft.EventGrid/extensionTopics/providers/Microsoft.Insights/diagnosticSettings/read | Gets the diagnostic setting for topics |
> | Microsoft.EventGrid/extensionTopics/providers/Microsoft.Insights/diagnosticSettings/write | Creates or updates the diagnostic setting for topics |
> | Microsoft.EventGrid/extensionTopics/providers/Microsoft.Insights/metricDefinitions/read | Gets the available metrics for topics |
> | Microsoft.EventGrid/locations/notifyNetworkSecurityPerimeterUpdatesAvailable/action | Upate notifications for network security perimeter |
> | Microsoft.EventGrid/locations/eventSubscriptions/read | List regional event subscriptions |
> | Microsoft.EventGrid/locations/operationResults/read | Read the result of a regional operation |
> | Microsoft.EventGrid/locations/operationsStatus/read | Read the status of a regional operation |
> | Microsoft.EventGrid/locations/topictypes/eventSubscriptions/read | List regional event subscriptions by topictype |
> | Microsoft.EventGrid/namespaces/write | Create or update a namespace |
> | Microsoft.EventGrid/namespaces/read | Read a namespace |
> | Microsoft.EventGrid/namespaces/delete | Delete a namespace |
> | Microsoft.EventGrid/namespaces/listKeys/action | List keys for a namespace |
> | Microsoft.EventGrid/namespaces/regenerateKey/action | Regenerate key for a namespace |
> | Microsoft.EventGrid/namespaces/PrivateEndpointConnectionsApproval/action | Approve PrivateEndpointConnections for namespaces |
> | Microsoft.EventGrid/namespaces/caCertificates/read | Read a CA Certificate |
> | Microsoft.EventGrid/namespaces/caCertificates/write | Create or update a CA Certificate |
> | Microsoft.EventGrid/namespaces/caCertificates/delete | Delete a CA Certificate |
> | Microsoft.EventGrid/namespaces/clientGroups/read | Read a client group |
> | Microsoft.EventGrid/namespaces/clientGroups/write | Create or update a client group |
> | Microsoft.EventGrid/namespaces/clientGroups/delete | Delete a client group |
> | Microsoft.EventGrid/namespaces/clients/read | Read a client |
> | Microsoft.EventGrid/namespaces/clients/write | Create or update a client |
> | Microsoft.EventGrid/namespaces/clients/delete | Delete a client |
> | Microsoft.EventGrid/namespaces/permissionBindings/read | Read a Permission Binding |
> | Microsoft.EventGrid/namespaces/permissionBindings/write | Create or update a Permission Binding |
> | Microsoft.EventGrid/namespaces/permissionBindings/delete | Delete a Permission Binding |
> | Microsoft.EventGrid/namespaces/privateEndpointConnectionProxies/validate/action | Validate PrivateEndpointConnectionProxies for namespaces |
> | Microsoft.EventGrid/namespaces/privateEndpointConnectionProxies/read | Read PrivateEndpointConnectionProxies for namespaces |
> | Microsoft.EventGrid/namespaces/privateEndpointConnectionProxies/write | Write PrivateEndpointConnectionProxies for namespaces |
> | Microsoft.EventGrid/namespaces/privateEndpointConnectionProxies/delete | Delete PrivateEndpointConnectionProxies for namespaces |
> | Microsoft.EventGrid/namespaces/privateEndpointConnections/read | Read PrivateEndpointConnections for namespaces |
> | Microsoft.EventGrid/namespaces/privateEndpointConnections/write | Write PrivateEndpointConnections for namespaces |
> | Microsoft.EventGrid/namespaces/privateEndpointConnections/delete | Delete PrivateEndpointConnections for namespaces |
> | Microsoft.EventGrid/namespaces/privateLinkResources/read | Read PrivateLinkResources for namespaces |
> | Microsoft.EventGrid/namespaces/providers/Microsoft.Insights/metricDefinitions/read | Gets the available metrics for namespaces |
> | Microsoft.EventGrid/namespaces/topics/read | Read a namespace topic |
> | Microsoft.EventGrid/namespaces/topics/write | Create or update a namespace topic |
> | Microsoft.EventGrid/namespaces/topics/delete | Delete a namespace topic |
> | Microsoft.EventGrid/namespaces/topics/listKeys/action | List keys for a namespace topic |
> | Microsoft.EventGrid/namespaces/topics/eventSubscriptions/read | Read a namespace topic event subscription |
> | Microsoft.EventGrid/namespaces/topics/eventSubscriptions/write | Create or update a namespace topic event subscription |
> | Microsoft.EventGrid/namespaces/topics/eventSubscriptions/delete | Delete a namespace topic event subscription |
> | Microsoft.EventGrid/namespaces/topicSpaces/read | Read a Topic Space |
> | Microsoft.EventGrid/namespaces/topicSpaces/write | Create or update a Topic Space |
> | Microsoft.EventGrid/namespaces/topicSpaces/delete | Delete a Topic Space |
> | Microsoft.EventGrid/operationResults/read | Read the result of an operation |
> | Microsoft.EventGrid/operations/read | List EventGrid operations. |
> | Microsoft.EventGrid/operationsStatus/read | Read the status of an operation |
> | Microsoft.EventGrid/partnerConfigurations/read | Read a partner configuration |
> | Microsoft.EventGrid/partnerConfigurations/write | Create or update a partner configuration |
> | Microsoft.EventGrid/partnerConfigurations/delete | Delete a partner configuration |
> | Microsoft.EventGrid/partnerConfigurations/authorizePartner/action | Authorize a partner in the partner configuration |
> | Microsoft.EventGrid/partnerConfigurations/unauthorizePartner/action | Unauthorize a partner in the partner configuration |
> | Microsoft.EventGrid/partnerDestinations/read | Read a partner destination |
> | Microsoft.EventGrid/partnerDestinations/write | Create or update a partner destination |
> | Microsoft.EventGrid/partnerDestinations/delete | Delete a partner destination |
> | Microsoft.EventGrid/partnerDestinations/activate/action | Activate a partner destination |
> | Microsoft.EventGrid/partnerDestinations/getPartnerDestinationChannelInfo/action | Get channel details of activated partner destination |
> | Microsoft.EventGrid/partnerDestinations/setToIdleState/action | Set provisioning status of partner destination to idle |
> | Microsoft.EventGrid/partnerDestinations/reLinkPartnerDestination/action | Re-link an idle partner destination to a newly created channel |
> | Microsoft.EventGrid/partnerNamespaces/write | Create or update a partner namespace |
> | Microsoft.EventGrid/partnerNamespaces/read | Read a partner namespace |
> | Microsoft.EventGrid/partnerNamespaces/delete | Delete a partner namespace |
> | Microsoft.EventGrid/partnerNamespaces/listKeys/action | List keys for a partner namespace |
> | Microsoft.EventGrid/partnerNamespaces/regenerateKey/action | Regenerate key for a partner namespace |
> | Microsoft.EventGrid/partnerNamespaces/PrivateEndpointConnectionsApproval/action | Approve PrivateEndpointConnections for partner namespaces |
> | Microsoft.EventGrid/partnerNamespaces/channels/read | Read a channel |
> | Microsoft.EventGrid/partnerNamespaces/channels/write | Create or update a channel |
> | Microsoft.EventGrid/partnerNamespaces/channels/delete | Delete a channel |
> | Microsoft.EventGrid/partnerNamespaces/channels/channelReadinessStateChange/action | Change channel readiness state |
> | Microsoft.EventGrid/partnerNamespaces/channels/getFullUrl/action | Get full url for the partner destination channel |
> | Microsoft.EventGrid/partnerNamespaces/channels/SetChannelToIdle/action | Set provisioning status of channel to idle |
> | Microsoft.EventGrid/partnerNamespaces/eventChannels/read | Read an event channel |
> | Microsoft.EventGrid/partnerNamespaces/eventChannels/write | Create or update an event channel |
> | Microsoft.EventGrid/partnerNamespaces/eventChannels/delete | Delete an event channel |
> | Microsoft.EventGrid/partnerNamespaces/eventChannels/channelReadinessStateChange/action | Change event channel readiness state |
> | Microsoft.EventGrid/partnerNamespaces/eventChannels/SetEventChannelToIdle/action | Set provisioning status of event channel to idle |
> | Microsoft.EventGrid/partnerNamespaces/privateEndpointConnectionProxies/validate/action | Validate PrivateEndpointConnectionProxies for partner namespaces |
> | Microsoft.EventGrid/partnerNamespaces/privateEndpointConnectionProxies/read | Read PrivateEndpointConnectionProxies for partner namespaces |
> | Microsoft.EventGrid/partnerNamespaces/privateEndpointConnectionProxies/write | Write PrivateEndpointConnectionProxies for partner namespaces |
> | Microsoft.EventGrid/partnerNamespaces/privateEndpointConnectionProxies/delete | Delete PrivateEndpointConnectionProxies for partner namespaces |
> | Microsoft.EventGrid/partnerNamespaces/privateEndpointConnections/read | Read PrivateEndpointConnections for partner namespaces |
> | Microsoft.EventGrid/partnerNamespaces/privateEndpointConnections/write | Write PrivateEndpointConnections for partner namespaces |
> | Microsoft.EventGrid/partnerNamespaces/privateEndpointConnections/delete | Delete PrivateEndpointConnections for partner namespaces |
> | Microsoft.EventGrid/partnerNamespaces/privateLinkResources/read | Read PrivateLinkResources for partner namespaces |
> | Microsoft.EventGrid/partnerNamespaces/providers/Microsoft.Insights/diagnosticSettings/read | Gets the diagnostic setting for partner namespaces |
> | Microsoft.EventGrid/partnerNamespaces/providers/Microsoft.Insights/diagnosticSettings/write | Creates or updates the diagnostic setting for partner namespaces |
> | Microsoft.EventGrid/partnerNamespaces/providers/Microsoft.Insights/logDefinitions/read | Allows access to diagnostic logs |
> | Microsoft.EventGrid/partnerNamespaces/providers/Microsoft.Insights/metricDefinitions/read | Gets the available metrics for partner namespaces |
> | Microsoft.EventGrid/partnerRegistrations/write | Create or update a partner registration |
> | Microsoft.EventGrid/partnerRegistrations/read | Read a partner registration |
> | Microsoft.EventGrid/partnerRegistrations/delete | Delete a partner registration |
> | Microsoft.EventGrid/partnerTopics/read | Read a partner topic |
> | Microsoft.EventGrid/partnerTopics/write | Create or update a partner topic |
> | Microsoft.EventGrid/partnerTopics/delete | Delete a partner topic |
> | Microsoft.EventGrid/partnerTopics/setToIdleState/action | Set provisioning status of partner topic to idle |
> | Microsoft.EventGrid/partnerTopics/reLinkPartnerTopic/action | Re-link an idle PartnerTopic to a newly created channel |
> | Microsoft.EventGrid/partnerTopics/activate/action | Activate a partner topic |
> | Microsoft.EventGrid/partnerTopics/deactivate/action | Deactivate a partner topic |
> | Microsoft.EventGrid/partnerTopics/eventSubscriptions/write | Create or update a PartnerTopic eventSubscription |
> | Microsoft.EventGrid/partnerTopics/eventSubscriptions/read | Read a partner topic event subscription |
> | Microsoft.EventGrid/partnerTopics/eventSubscriptions/delete | Delete a partner topic event subscription |
> | Microsoft.EventGrid/partnerTopics/eventSubscriptions/getFullUrl/action | Get full url for the partner topic event subscription |
> | Microsoft.EventGrid/partnerTopics/eventSubscriptions/getDeliveryAttributes/action | Get PartnerTopic EventSubscription Delivery Attributes |
> | Microsoft.EventGrid/partnerTopics/providers/Microsoft.Insights/diagnosticSettings/read | Gets the diagnostic setting for partner topics |
> | Microsoft.EventGrid/partnerTopics/providers/Microsoft.Insights/diagnosticSettings/write | Creates or updates the diagnostic setting for partner topics |
> | Microsoft.EventGrid/partnerTopics/providers/Microsoft.Insights/logDefinitions/read | Allows access to diagnostic logs |
> | Microsoft.EventGrid/partnerTopics/providers/Microsoft.Insights/metricDefinitions/read | Gets the available metrics for partner topics |
> | Microsoft.EventGrid/sku/read | Read available Sku Definitions for event grid resources |
> | Microsoft.EventGrid/systemTopics/read | Read a system topic |
> | Microsoft.EventGrid/systemTopics/write | Create or update a system topic |
> | Microsoft.EventGrid/systemTopics/delete | Delete a system topic |
> | Microsoft.EventGrid/systemTopics/eventSubscriptions/write | Create or update a SystemTopic eventSubscription |
> | Microsoft.EventGrid/systemTopics/eventSubscriptions/read | Read a SystemTopic eventSubscription |
> | Microsoft.EventGrid/systemTopics/eventSubscriptions/delete | Delete a SystemTopic eventSubscription |
> | Microsoft.EventGrid/systemTopics/eventSubscriptions/getFullUrl/action | Get full url for the SystemTopic event subscription |
> | Microsoft.EventGrid/systemTopics/eventSubscriptions/getDeliveryAttributes/action | Get SystemTopic EventSubscription Delivery Attributes |
> | Microsoft.EventGrid/systemTopics/providers/Microsoft.Insights/diagnosticSettings/read | Gets the diagnostic setting for system topics |
> | Microsoft.EventGrid/systemTopics/providers/Microsoft.Insights/diagnosticSettings/write | Creates or updates the diagnostic setting for system topics |
> | Microsoft.EventGrid/systemTopics/providers/Microsoft.Insights/logDefinitions/read | Allows access to diagnostic logs |
> | Microsoft.EventGrid/systemTopics/providers/Microsoft.Insights/metricDefinitions/read | Gets the available metrics for system topics |
> | Microsoft.EventGrid/topics/write | Create or update a topic |
> | Microsoft.EventGrid/topics/read | Read a topic |
> | Microsoft.EventGrid/topics/delete | Delete a topic |
> | Microsoft.EventGrid/topics/listKeys/action | List keys for a topic |
> | Microsoft.EventGrid/topics/regenerateKey/action | Regenerate key for a topic |
> | Microsoft.EventGrid/topics/PrivateEndpointConnectionsApproval/action | Approve PrivateEndpointConnections for topics |
> | Microsoft.EventGrid/topics/eventSubscriptions/write | Create or update a Topic eventSubscription |
> | Microsoft.EventGrid/topics/eventSubscriptions/read | Read a Topic eventSubscription |
> | Microsoft.EventGrid/topics/eventSubscriptions/delete | Delete a Topic eventSubscription |
> | Microsoft.EventGrid/topics/eventSubscriptions/getFullUrl/action | Get full url for the Topic event subscription |
> | Microsoft.EventGrid/topics/eventSubscriptions/getDeliveryAttributes/action | Get Topic EventSubscription Delivery Attributes |
> | Microsoft.EventGrid/topics/networkSecurityPerimeterAssociationProxies/read | Read NspAssociationProxies for topics |
> | Microsoft.EventGrid/topics/networkSecurityPerimeterAssociationProxies/write | Write NspAssociationProxies for topics |
> | Microsoft.EventGrid/topics/networkSecurityPerimeterAssociationProxies/delete | Delete NspAssociationProxies for topics |
> | Microsoft.EventGrid/topics/networkSecurityPerimeterConfigurations/read | Read NspConfiguration for topics |
> | Microsoft.EventGrid/topics/privateEndpointConnectionProxies/validate/action | Validate PrivateEndpointConnectionProxies for topics |
> | Microsoft.EventGrid/topics/privateEndpointConnectionProxies/read | Read PrivateEndpointConnectionProxies for topics |
> | Microsoft.EventGrid/topics/privateEndpointConnectionProxies/write | Write PrivateEndpointConnectionProxies for topics |
> | Microsoft.EventGrid/topics/privateEndpointConnectionProxies/delete | Delete PrivateEndpointConnectionProxies for topics |
> | Microsoft.EventGrid/topics/privateEndpointConnections/read | Read PrivateEndpointConnections for topics |
> | Microsoft.EventGrid/topics/privateEndpointConnections/write | Write PrivateEndpointConnections for topics |
> | Microsoft.EventGrid/topics/privateEndpointConnections/delete | Delete PrivateEndpointConnections for topics |
> | Microsoft.EventGrid/topics/privateLinkResources/read | Read PrivateLinkResources for topics |
> | Microsoft.EventGrid/topics/providers/Microsoft.Insights/diagnosticSettings/read | Gets the diagnostic setting for topics |
> | Microsoft.EventGrid/topics/providers/Microsoft.Insights/diagnosticSettings/write | Creates or updates the diagnostic setting for topics |
> | Microsoft.EventGrid/topics/providers/Microsoft.Insights/logDefinitions/read | Allows access to diagnostic logs |
> | Microsoft.EventGrid/topics/providers/Microsoft.Insights/metricDefinitions/read | Gets the available metrics for topics |
> | Microsoft.EventGrid/topictypes/read | Read a topictype |
> | Microsoft.EventGrid/topictypes/eventSubscriptions/read | List global event subscriptions by topic type |
> | Microsoft.EventGrid/topictypes/eventtypes/read | Read eventtypes supported by a topictype |
> | Microsoft.EventGrid/verifiedPartners/read | Read a verified partner |
> | **DataAction** | **Description** |
> | Microsoft.EventGrid/events/send/action | Send events to topics |
> | Microsoft.EventGrid/events/receive/action | Receive events from namespace topics |
> | Microsoft.EventGrid/topicSpaces/subscribe/action | Subscribe to a topic space |
> | Microsoft.EventGrid/topicSpaces/publish/action | Publish to a topic space |

## Microsoft.EventHub

Receive telemetry from millions of devices.

Azure service: [Event Hubs](/azure/event-hubs/)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.EventHub/checkNamespaceAvailability/action | Checks availability of namespace under given subscription. This API is deprecated please use CheckNameAvailability instead. |
> | Microsoft.EventHub/checkNameAvailability/action | Checks availability of namespace under given subscription. |
> | Microsoft.EventHub/register/action | Registers the subscription for the EventHub resource provider and enables the creation of EventHub resources |
> | Microsoft.EventHub/unregister/action | Registers the EventHub Resource Provider |
> | Microsoft.EventHub/availableClusterRegions/read | Read operation to list available pre-provisioned clusters by Azure region. |
> | Microsoft.EventHub/clusters/read | Gets the Cluster Resource Description |
> | Microsoft.EventHub/clusters/write | Creates or modifies an existing Cluster resource. |
> | Microsoft.EventHub/clusters/delete | Deletes an existing Cluster resource. |
> | Microsoft.EventHub/clusters/namespaces/read | List namespace Azure Resource Manager IDs for namespaces within a cluster. |
> | Microsoft.EventHub/clusters/operationresults/read | Get the status of an asynchronous cluster operation. |
> | Microsoft.EventHub/clusters/providers/Microsoft.Insights/metricDefinitions/read | Get list of Cluster metrics Resource Descriptions |
> | Microsoft.EventHub/locations/deleteVirtualNetworkOrSubnets/action | Deletes the VNet rules in EventHub Resource Provider for the specified VNet |
> | Microsoft.EventHub/namespaces/write | Create a Namespace Resource and Update its properties. Tags and Capacity of the Namespace are the properties which can be updated. |
> | Microsoft.EventHub/namespaces/read | Get the list of Namespace Resource Description |
> | Microsoft.EventHub/namespaces/Delete | Delete Namespace Resource |
> | Microsoft.EventHub/namespaces/authorizationRules/action | Updates Namespace Authorization Rule. This API is deprecated. Please use a PUT call to update the Namespace Authorization Rule instead.. This operation is not supported on API version 2017-04-01. |
> | Microsoft.EventHub/namespaces/removeAcsNamepsace/action | Remove ACS namespace |
> | Microsoft.EventHub/namespaces/updateState/action | UpdateNamespaceState |
> | Microsoft.EventHub/namespaces/privateEndpointConnectionsApproval/action | Approve Private Endpoint Connection |
> | Microsoft.EventHub/namespaces/joinPerimeter/action | Action to Join the Network Security Perimeter. This action is used to perform linked access by NSP RP. |
> | Microsoft.EventHub/namespaces/authorizationRules/read | Get the list of Namespaces Authorization Rules description. |
> | Microsoft.EventHub/namespaces/authorizationRules/write | Create a Namespace level Authorization Rules and update its properties. The Authorization Rules Access Rights, the Primary and Secondary Keys can be updated. |
> | Microsoft.EventHub/namespaces/authorizationRules/delete | Delete Namespace Authorization Rule. The Default Namespace Authorization Rule cannot be deleted.  |
> | Microsoft.EventHub/namespaces/authorizationRules/listkeys/action | Get the Connection String to the Namespace |
> | Microsoft.EventHub/namespaces/authorizationRules/regenerateKeys/action | Regenerate the Primary or Secondary key to the Resource |
> | Microsoft.EventHub/namespaces/disasterrecoveryconfigs/checkNameAvailability/action | Checks availability of namespace alias under given subscription. |
> | Microsoft.EventHub/namespaces/disasterRecoveryConfigs/write | Creates or Updates the Disaster Recovery configuration associated with the namespace. |
> | Microsoft.EventHub/namespaces/disasterRecoveryConfigs/read | Gets the Disaster Recovery configuration associated with the namespace. |
> | Microsoft.EventHub/namespaces/disasterRecoveryConfigs/delete | Deletes the Disaster Recovery configuration associated with the namespace. This operation can only be invoked via the primary namespace. |
> | Microsoft.EventHub/namespaces/disasterRecoveryConfigs/breakPairing/action | Disables Disaster Recovery and stops replicating changes from primary to secondary namespaces. |
> | Microsoft.EventHub/namespaces/disasterRecoveryConfigs/failover/action | Invokes a GEO DR failover and reconfigures the namespace alias to point to the secondary namespace. |
> | Microsoft.EventHub/namespaces/disasterRecoveryConfigs/authorizationRules/read | Get Disaster Recovery Primary Namespace's Authorization Rules |
> | Microsoft.EventHub/namespaces/disasterRecoveryConfigs/authorizationRules/listkeys/action | Gets the authorization rules keys for the Disaster Recovery primary namespace |
> | Microsoft.EventHub/namespaces/eventhubs/write | Create or Update EventHub properties. |
> | Microsoft.EventHub/namespaces/eventhubs/read | Get list of EventHub Resource Descriptions |
> | Microsoft.EventHub/namespaces/eventhubs/Delete | Operation to delete EventHub Resource |
> | Microsoft.EventHub/namespaces/eventhubs/authorizationRules/action | Operation to update EventHub. This operation is not supported on API version 2017-04-01. Authorization Rules. Please use a PUT call to update Authorization Rule. |
> | Microsoft.EventHub/namespaces/eventhubs/authorizationRules/read |  Get the list of EventHub Authorization Rules |
> | Microsoft.EventHub/namespaces/eventhubs/authorizationRules/write | Create EventHub Authorization Rules and Update its properties. The Authorization Rules Access Rights can be updated. |
> | Microsoft.EventHub/namespaces/eventhubs/authorizationRules/delete | Operation to delete EventHub Authorization Rules |
> | Microsoft.EventHub/namespaces/eventhubs/authorizationRules/listkeys/action | Get the Connection String to EventHub |
> | Microsoft.EventHub/namespaces/eventhubs/authorizationRules/regenerateKeys/action | Regenerate the Primary or Secondary key to the Resource |
> | Microsoft.EventHub/namespaces/eventHubs/consumergroups/write | Create or Update ConsumerGroup properties. |
> | Microsoft.EventHub/namespaces/eventHubs/consumergroups/read | Get list of ConsumerGroup Resource Descriptions |
> | Microsoft.EventHub/namespaces/eventHubs/consumergroups/Delete | Operation to delete ConsumerGroup Resource |
> | Microsoft.EventHub/namespaces/ipFilterRules/read | Get IP Filter Resource |
> | Microsoft.EventHub/namespaces/ipFilterRules/write | Create IP Filter Resource |
> | Microsoft.EventHub/namespaces/ipFilterRules/delete | Delete IP Filter Resource |
> | Microsoft.EventHub/namespaces/messagingPlan/read | Gets the Messaging Plan for a namespace.<br>This API is deprecated.<br>Properties exposed via the MessagingPlan resource are moved to the (parent) Namespace resource in later API versions..<br>This operation is not supported on API version 2017-04-01. |
> | Microsoft.EventHub/namespaces/messagingPlan/write | Updates the Messaging Plan for a namespace.<br>This API is deprecated.<br>Properties exposed via the MessagingPlan resource are moved to the (parent) Namespace resource in later API versions..<br>This operation is not supported on API version 2017-04-01. |
> | Microsoft.EventHub/namespaces/networkruleset/read | Gets NetworkRuleSet Resource |
> | Microsoft.EventHub/namespaces/networkruleset/write | Create VNET Rule Resource |
> | Microsoft.EventHub/namespaces/networkruleset/delete | Delete VNET Rule Resource |
> | Microsoft.EventHub/namespaces/networkrulesets/read | Gets NetworkRuleSet Resource |
> | Microsoft.EventHub/namespaces/networkrulesets/write | Create VNET Rule Resource |
> | Microsoft.EventHub/namespaces/networkrulesets/delete | Delete VNET Rule Resource |
> | Microsoft.EventHub/namespaces/networkSecurityPerimeterAssociationProxies/write | Create NetworkSecurityPerimeterAssociationProxies |
> | Microsoft.EventHub/namespaces/networkSecurityPerimeterAssociationProxies/read | Get NetworkSecurityPerimeterAssociationProxies |
> | Microsoft.EventHub/namespaces/networkSecurityPerimeterAssociationProxies/delete | Delete NetworkSecurityPerimeterAssociationProxies |
> | Microsoft.EventHub/namespaces/networkSecurityPerimeterAssociationProxies/reconcile/action | Reconcile NetworkSecurityPerimeterAssociationProxies |
> | Microsoft.EventHub/namespaces/networkSecurityPerimeterConfigurations/read | Get Network Security Perimeter Configurations |
> | Microsoft.EventHub/namespaces/networkSecurityPerimeterConfigurations/reconcile/action | Reconcile Network Security Perimeter Configurations |
> | Microsoft.EventHub/namespaces/operationresults/read | Get the status of Namespace operation |
> | Microsoft.EventHub/namespaces/privateEndpointConnectionProxies/validate/action | Validate Private Endpoint Connection Proxy |
> | Microsoft.EventHub/namespaces/privateEndpointConnectionProxies/read | Get Private Endpoint Connection Proxy |
> | Microsoft.EventHub/namespaces/privateEndpointConnectionProxies/write | Create Private Endpoint Connection Proxy |
> | Microsoft.EventHub/namespaces/privateEndpointConnectionProxies/delete | Delete Private Endpoint Connection Proxy |
> | Microsoft.EventHub/namespaces/privateEndpointConnectionProxies/operationstatus/read | Get the status of an asynchronous private endpoint operation |
> | Microsoft.EventHub/namespaces/privateEndpointConnections/read | Get Private Endpoint Connection |
> | Microsoft.EventHub/namespaces/privateEndpointConnections/write | Create or Update Private Endpoint Connection |
> | Microsoft.EventHub/namespaces/privateEndpointConnections/delete | Removes Private Endpoint Connection |
> | Microsoft.EventHub/namespaces/privateEndpointConnections/operationstatus/read | Get the status of an asynchronous private endpoint operation |
> | Microsoft.EventHub/namespaces/privateLinkResources/read | Gets the resource types that support private endpoint connections |
> | Microsoft.EventHub/namespaces/providers/Microsoft.Insights/diagnosticSettings/read | Get list of Namespace diagnostic settings Resource Descriptions |
> | Microsoft.EventHub/namespaces/providers/Microsoft.Insights/diagnosticSettings/write | Get list of Namespace diagnostic settings Resource Descriptions |
> | Microsoft.EventHub/namespaces/providers/Microsoft.Insights/logDefinitions/read | Get list of Namespace logs Resource Descriptions |
> | Microsoft.EventHub/namespaces/providers/Microsoft.Insights/metricDefinitions/read | Get list of Namespace metrics Resource Descriptions |
> | Microsoft.EventHub/namespaces/schemagroups/write | Create or Update SchemaGroup properties. |
> | Microsoft.EventHub/namespaces/schemagroups/read | Get list of SchemaGroup Resource Descriptions |
> | Microsoft.EventHub/namespaces/schemagroups/delete | Operation to delete SchemaGroup Resource |
> | Microsoft.EventHub/namespaces/virtualNetworkRules/read | Gets VNET Rule Resource |
> | Microsoft.EventHub/namespaces/virtualNetworkRules/write | Create VNET Rule Resource |
> | Microsoft.EventHub/namespaces/virtualNetworkRules/delete | Delete VNET Rule Resource |
> | Microsoft.EventHub/operations/read | Get Operations |
> | Microsoft.EventHub/sku/read | Get list of Sku Resource Descriptions |
> | Microsoft.EventHub/sku/regions/read | Get list of SkuRegions Resource Descriptions |
> | **DataAction** | **Description** |
> | Microsoft.EventHub/namespaces/messages/send/action | Send messages |
> | Microsoft.EventHub/namespaces/messages/receive/action | Receive messages |
> | Microsoft.EventHub/namespaces/schemas/read | Retrieve schemas |
> | Microsoft.EventHub/namespaces/schemas/write | Write schemas |
> | Microsoft.EventHub/namespaces/schemas/delete | Delete schemas |

## Microsoft.HealthcareApis

Azure service: [Azure API for FHIR](/azure/healthcare-apis/azure-api-for-fhir/)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.HealthcareApis/register/action | Subscription Registration Action |
> | Microsoft.HealthcareApis/unregister/action | Unregisters the subscription for the resource provider. |
> | Microsoft.HealthcareApis/checkNameAvailability/read | Checks for the availability of the specified name. |
> | Microsoft.HealthcareApis/locations/checkNameAvailability/read | Checks for the availability of the specified name. |
> | Microsoft.HealthcareApis/locations/operationresults/read | Read the status of an asynchronous operation. |
> | Microsoft.HealthcareApis/Operations/read | Read the operations for all resource types. |
> | Microsoft.HealthcareApis/services/read | Reads resources. |
> | Microsoft.HealthcareApis/services/write | Writes resources. |
> | Microsoft.HealthcareApis/services/delete | Deletes resources. |
> | Microsoft.HealthcareApis/services/privateEndpointConnectionProxies/validate/action | Validate |
> | Microsoft.HealthcareApis/services/privateEndpointConnectionProxies/write | Writes Private Endpoint Connection Proxy resources. |
> | Microsoft.HealthcareApis/services/privateEndpointConnectionProxies/read | Reads Private Endpoint Connection Proxy resources. |
> | Microsoft.HealthcareApis/services/privateEndpointConnectionProxies/delete | Deletes Private Endpoint Connection Proxy resources. |
> | Microsoft.HealthcareApis/services/privateEndpointConnections/read | Reads Private Endpoint Connections resources. |
> | Microsoft.HealthcareApis/services/privateEndpointConnections/write | Writes connection status to Private Endpoint Connection. |
> | Microsoft.HealthcareApis/services/privateEndpointConnections/delete | Deletes Private Endpoint Connections. |
> | Microsoft.HealthcareApis/services/privateLinkResources/read | Reads Private Link resources. |
> | Microsoft.HealthcareApis/services/providers/Microsoft.Insights/diagnosticSettings/read | Gets the diagnostic settings for Azure API for FHIR |
> | Microsoft.HealthcareApis/services/providers/Microsoft.Insights/diagnosticSettings/write | Creates or updates the diagnostic settings for Azure API for FHIR |
> | Microsoft.HealthcareApis/services/providers/Microsoft.Insights/logDefinitions/read | Gets the available logs for Azure API for FHIR |
> | Microsoft.HealthcareApis/services/providers/Microsoft.Insights/metricDefinitions/read | Gets the metrics settings for Azure API for FHIR |
> | Microsoft.HealthcareApis/validateMedtechMappings/read | Handles requests related to editing IotConnector mapping files |
> | Microsoft.HealthcareApis/workspaces/read |  |
> | Microsoft.HealthcareApis/workspaces/write |  |
> | Microsoft.HealthcareApis/workspaces/delete |  |
> | Microsoft.HealthcareApis/workspaces/dicomservices/read |  |
> | Microsoft.HealthcareApis/workspaces/dicomservices/write |  |
> | Microsoft.HealthcareApis/workspaces/dicomservices/delete |  |
> | Microsoft.HealthcareApis/workspaces/dicomservices/providers/Microsoft.Insights/diagnosticSettings/read | Gets the diagnostic settings for the Azure service. |
> | Microsoft.HealthcareApis/workspaces/dicomservices/providers/Microsoft.Insights/diagnosticSettings/write | Creates or updates the diagnostic settings for the Azure service. |
> | Microsoft.HealthcareApis/workspaces/dicomservices/providers/Microsoft.Insights/logDefinitions/read | Gets the available logs for the Azure service. |
> | Microsoft.HealthcareApis/workspaces/dicomservices/providers/Microsoft.Insights/metricDefinitions/read | Gets the metrics settings for the Azure service. |
> | Microsoft.HealthcareApis/workspaces/eventGridFilters/read |  |
> | Microsoft.HealthcareApis/workspaces/eventGridFilters/write |  |
> | Microsoft.HealthcareApis/workspaces/eventGridFilters/delete |  |
> | Microsoft.HealthcareApis/workspaces/fhirservices/read |  |
> | Microsoft.HealthcareApis/workspaces/fhirservices/write |  |
> | Microsoft.HealthcareApis/workspaces/fhirservices/delete |  |
> | Microsoft.HealthcareApis/workspaces/fhirservices/providers/Microsoft.Insights/diagnosticSettings/read | Gets the diagnostic settings for the Azure service. |
> | Microsoft.HealthcareApis/workspaces/fhirservices/providers/Microsoft.Insights/diagnosticSettings/write | Creates or updates the diagnostic settings for the Azure service. |
> | Microsoft.HealthcareApis/workspaces/fhirservices/providers/Microsoft.Insights/logDefinitions/read | Gets the available logs for the Azure service. |
> | Microsoft.HealthcareApis/workspaces/fhirservices/providers/Microsoft.Insights/metricDefinitions/read | Gets the metrics settings for the Azure service. |
> | Microsoft.HealthcareApis/workspaces/iotconnectors/read |  |
> | Microsoft.HealthcareApis/workspaces/iotconnectors/write |  |
> | Microsoft.HealthcareApis/workspaces/iotconnectors/delete |  |
> | Microsoft.HealthcareApis/workspaces/iotconnectors/destinations/read |  |
> | Microsoft.HealthcareApis/workspaces/iotconnectors/destinations/write |  |
> | Microsoft.HealthcareApis/workspaces/iotconnectors/destinations/delete |  |
> | Microsoft.HealthcareApis/workspaces/iotconnectors/fhirdestinations/read |  |
> | Microsoft.HealthcareApis/workspaces/iotconnectors/fhirdestinations/write |  |
> | Microsoft.HealthcareApis/workspaces/iotconnectors/fhirdestinations/delete |  |
> | Microsoft.HealthcareApis/workspaces/iotconnectors/providers/Microsoft.Insights/diagnosticSettings/read | Gets the diagnostic settings for the Azure service. |
> | Microsoft.HealthcareApis/workspaces/iotconnectors/providers/Microsoft.Insights/diagnosticSettings/write | Creates or updates the diagnostic settings for the Azure service. |
> | Microsoft.HealthcareApis/workspaces/iotconnectors/providers/Microsoft.Insights/logDefinitions/read | Gets the available logs for the Azure service. |
> | Microsoft.HealthcareApis/workspaces/iotconnectors/providers/Microsoft.Insights/metricDefinitions/read | Gets the metrics settings for the Azure service. |
> | Microsoft.HealthcareApis/workspaces/privateEndpointConnectionProxies/read |  |
> | Microsoft.HealthcareApis/workspaces/privateEndpointConnectionProxies/write |  |
> | Microsoft.HealthcareApis/workspaces/privateEndpointConnectionProxies/delete |  |
> | Microsoft.HealthcareApis/workspaces/privateEndpointConnectionProxies/validate/action | Validate |
> | Microsoft.HealthcareApis/workspaces/privateEndpointConnections/read |  |
> | Microsoft.HealthcareApis/workspaces/privateEndpointConnections/write |  |
> | Microsoft.HealthcareApis/workspaces/privateEndpointConnections/delete |  |
> | Microsoft.HealthcareApis/workspaces/privateLinkResources/read | Reads Private Link resources. |
> | **DataAction** | **Description** |
> | Microsoft.HealthcareApis/services/fhir/resources/read | Read FHIR resources (includes searching and versioned history).  |
> | Microsoft.HealthcareApis/services/fhir/resources/write | Write FHIR resources (includes create and update). |
> | Microsoft.HealthcareApis/services/fhir/resources/delete | Delete FHIR resources (soft delete). |
> | Microsoft.HealthcareApis/services/fhir/resources/hardDelete/action | Hard Delete (including version history). |
> | Microsoft.HealthcareApis/services/fhir/resources/export/action | Export operation ($export). |
> | Microsoft.HealthcareApis/services/fhir/resources/smart/action | Allows user to access FHIR Service according to SMART on FHIR specification. |
> | Microsoft.HealthcareApis/services/fhir/resources/searchParameter/action | Allows running of $status operation for Search Parameters |
> | Microsoft.HealthcareApis/services/fhir/resources/convertData/action | Data convert operation ($convert-data) |
> | Microsoft.HealthcareApis/services/fhir/resources/resourceValidate/action | Validate operation ($validate). |
> | Microsoft.HealthcareApis/services/fhir/resources/reindex/action | Allows user to run Reindex job to index any search parameters that haven't yet been indexed. |
> | Microsoft.HealthcareApis/services/fhir/resources/editProfileDefinitions/action | Allows user to perform Create Update Delete operations on profile resources. |
> | Microsoft.HealthcareApis/services/fhir/resources/import/action | Import FHIR resources in batch. |
> | Microsoft.HealthcareApis/workspaces/dicomservices/resources/read | Read DICOM resources (includes searching and change feed).  |
> | Microsoft.HealthcareApis/workspaces/dicomservices/resources/write | Write DICOM resources. |
> | Microsoft.HealthcareApis/workspaces/dicomservices/resources/delete | Delete DICOM resources. |
> | Microsoft.HealthcareApis/workspaces/dicomservices/resources/manageExtendedQueryTags/action | Manage DICOM extended query tags. |
> | Microsoft.HealthcareApis/workspaces/dicomservices/resources/export/action | Export resources from the DICOM service. |
> | Microsoft.HealthcareApis/workspaces/fhirservices/resources/read | Read FHIR resources (includes searching and versioned history).  |
> | Microsoft.HealthcareApis/workspaces/fhirservices/resources/write | Write FHIR resources (includes create and update). |
> | Microsoft.HealthcareApis/workspaces/fhirservices/resources/delete | Delete FHIR resources (soft delete). |
> | Microsoft.HealthcareApis/workspaces/fhirservices/resources/hardDelete/action | Hard Delete (including version history). |
> | Microsoft.HealthcareApis/workspaces/fhirservices/resources/export/action | Export operation ($export). |
> | Microsoft.HealthcareApis/workspaces/fhirservices/resources/convertData/action | Data convert operation ($convert-data) |
> | Microsoft.HealthcareApis/workspaces/fhirservices/resources/resourceValidate/action | Validate operation ($validate). |
> | Microsoft.HealthcareApis/workspaces/fhirservices/resources/import/action | Import FHIR resources in batch. |
> | Microsoft.HealthcareApis/workspaces/fhirservices/resources/smart/action | Allows user to access FHIR Service according to SMART on FHIR specification. |
> | Microsoft.HealthcareApis/workspaces/fhirservices/resources/reindex/action | Allows user to run Reindex job to index any search parameters that haven't yet been indexed. |
> | Microsoft.HealthcareApis/workspaces/fhirservices/resources/editProfileDefinitions/action | Allows user to perform Create Update Delete operations on profile resources. |
> | Microsoft.HealthcareApis/workspaces/fhirservices/resources/searchParameter/action | Allows running of $status operation for Search Parameters |

## Microsoft.Logic

Automate the access and use of data across clouds without writing code.

Azure service: [Logic Apps](/azure/logic-apps/)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.Logic/register/action | Registers the Microsoft.Logic resource provider for a given subscription. |
> | Microsoft.Logic/integrationAccounts/read | Reads the integration account. |
> | Microsoft.Logic/integrationAccounts/write | Creates or updates the integration account. |
> | Microsoft.Logic/integrationAccounts/delete | Deletes the integration account. |
> | Microsoft.Logic/integrationAccounts/regenerateAccessKey/action | Regenerates the access key secrets. |
> | Microsoft.Logic/integrationAccounts/listCallbackUrl/action | Gets the callback URL for integration account. |
> | Microsoft.Logic/integrationAccounts/listKeyVaultKeys/action | Gets the keys in the key vault. |
> | Microsoft.Logic/integrationAccounts/logTrackingEvents/action | Logs the tracking events in the integration account. |
> | Microsoft.Logic/integrationAccounts/join/action | Joins the Integration Account. |
> | Microsoft.Logic/integrationAccounts/agreements/read | Reads the agreement in integration account. |
> | Microsoft.Logic/integrationAccounts/agreements/write | Creates or updates the agreement in integration account. |
> | Microsoft.Logic/integrationAccounts/agreements/delete | Deletes the agreement in integration account. |
> | Microsoft.Logic/integrationAccounts/agreements/listContentCallbackUrl/action | Gets the callback URL for agreement content in integration account. |
> | Microsoft.Logic/integrationAccounts/assemblies/read | Reads the assembly in integration account. |
> | Microsoft.Logic/integrationAccounts/assemblies/write | Creates or updates the assembly in integration account. |
> | Microsoft.Logic/integrationAccounts/assemblies/delete | Deletes the assembly in integration account. |
> | Microsoft.Logic/integrationAccounts/assemblies/listContentCallbackUrl/action | Gets the callback URL for assembly content in integration account. |
> | Microsoft.Logic/integrationAccounts/batchConfigurations/read | Reads the batch configuration in integration account. |
> | Microsoft.Logic/integrationAccounts/batchConfigurations/write | Creates or updates the batch configuration in integration account. |
> | Microsoft.Logic/integrationAccounts/batchConfigurations/delete | Deletes the batch configuration in integration account. |
> | Microsoft.Logic/integrationAccounts/certificates/read | Reads the certificate in integration account. |
> | Microsoft.Logic/integrationAccounts/certificates/write | Creates or updates the certificate in integration account. |
> | Microsoft.Logic/integrationAccounts/certificates/delete | Deletes the certificate in integration account. |
> | Microsoft.Logic/integrationAccounts/groups/read | Reads the group in integration account. |
> | Microsoft.Logic/integrationAccounts/groups/write | Creates or updates the group in integration account. |
> | Microsoft.Logic/integrationAccounts/groups/delete | Deletes the group in integration account. |
> | Microsoft.Logic/integrationAccounts/maps/read | Reads the map in integration account. |
> | Microsoft.Logic/integrationAccounts/maps/write | Creates or updates the map in integration account. |
> | Microsoft.Logic/integrationAccounts/maps/delete | Deletes the map in integration account. |
> | Microsoft.Logic/integrationAccounts/maps/listContentCallbackUrl/action | Gets the callback URL for map content in integration account. |
> | Microsoft.Logic/integrationAccounts/partners/read | Reads the partner in integration account. |
> | Microsoft.Logic/integrationAccounts/partners/write | Creates or updates the partner in integration account. |
> | Microsoft.Logic/integrationAccounts/partners/delete | Deletes the partner in integration account. |
> | Microsoft.Logic/integrationAccounts/partners/listContentCallbackUrl/action | Gets the callback URL for partner content in integration account. |
> | Microsoft.Logic/integrationAccounts/privateEndpointConnectionProxies/read | Gets the Private Endpoint Connection Proxies. |
> | Microsoft.Logic/integrationAccounts/privateEndpointConnectionProxies/write | Creates or Updates the Private Endpoint Connection Proxies. |
> | Microsoft.Logic/integrationAccounts/privateEndpointConnectionProxies/delete | Deletes the Private Endpoint Connection Proxies. |
> | Microsoft.Logic/integrationAccounts/privateEndpointConnectionProxies/validate/action | Validates the Private Endpoint Connection Proxies. |
> | Microsoft.Logic/integrationAccounts/privateEndpointConnectionProxies/operationStatuses/read | Gets Private Endpoint Connection Proxies operation status. |
> | Microsoft.Logic/integrationAccounts/providers/Microsoft.Insights/logDefinitions/read | Reads the Integration Account log definitions. |
> | Microsoft.Logic/integrationAccounts/rosettaNetProcessConfigurations/read | Reads the RosettaNet process configuration in integration account. |
> | Microsoft.Logic/integrationAccounts/rosettaNetProcessConfigurations/write | Creates or updates the  RosettaNet process configuration in integration account. |
> | Microsoft.Logic/integrationAccounts/rosettaNetProcessConfigurations/delete | Deletes the RosettaNet process configuration in integration account. |
> | Microsoft.Logic/integrationAccounts/schedules/read | Reads the schedule in integration account. |
> | Microsoft.Logic/integrationAccounts/schedules/write | Creates or updates the schedule in integration account. |
> | Microsoft.Logic/integrationAccounts/schedules/delete | Deletes the schedule in integration account. |
> | Microsoft.Logic/integrationAccounts/schemas/read | Reads the schema in integration account. |
> | Microsoft.Logic/integrationAccounts/schemas/write | Creates or updates the schema in integration account. |
> | Microsoft.Logic/integrationAccounts/schemas/delete | Deletes the schema in integration account. |
> | Microsoft.Logic/integrationAccounts/schemas/listContentCallbackUrl/action | Gets the callback URL for schema content in integration account. |
> | Microsoft.Logic/integrationAccounts/sessions/read | Reads the session in integration account. |
> | Microsoft.Logic/integrationAccounts/sessions/write | Creates or updates the session in integration account. |
> | Microsoft.Logic/integrationAccounts/sessions/delete | Deletes the session in integration account. |
> | Microsoft.Logic/integrationAccounts/usageConfigurations/read | Reads the usage configuration in integration account. |
> | Microsoft.Logic/integrationAccounts/usageConfigurations/write | Creates or updates the usage configuration in integration account. |
> | Microsoft.Logic/integrationAccounts/usageConfigurations/delete | Deletes the usage configuration in integration account. |
> | Microsoft.Logic/integrationAccounts/usageConfigurations/listCallbackUrl/action | Gets the callback URL for the usage configuration in integration account. |
> | Microsoft.Logic/integrationServiceEnvironments/read | Reads the integration service environment. |
> | Microsoft.Logic/integrationServiceEnvironments/write | Creates or updates the integration service environment. |
> | Microsoft.Logic/integrationServiceEnvironments/delete | Deletes the integration service environment. |
> | Microsoft.Logic/integrationServiceEnvironments/join/action | Joins the Integration Service Environment. |
> | Microsoft.Logic/integrationServiceEnvironments/availableManagedApis/read | Reads the integration service environment available managed APIs. |
> | Microsoft.Logic/integrationServiceEnvironments/managedApis/read | Reads the integration service environment managed API. |
> | Microsoft.Logic/integrationServiceEnvironments/managedApis/write | Creates or updates the integration service environment managed API. |
> | Microsoft.Logic/integrationServiceEnvironments/managedApis/join/action | Joins the Integration Service Environment Managed API. |
> | Microsoft.Logic/integrationServiceEnvironments/managedApis/apiOperations/read | Reads the integration service environment managed API operation. |
> | Microsoft.Logic/integrationServiceEnvironments/managedApis/operationStatuses/read | Reads the integration service environment managed API operation statuses. |
> | Microsoft.Logic/integrationServiceEnvironments/operationStatuses/read | Reads the integration service environment operation statuses. |
> | Microsoft.Logic/integrationServiceEnvironments/providers/Microsoft.Insights/metricDefinitions/read | Reads the integration service environment metric definitions. |
> | Microsoft.Logic/locations/workflows/validate/action | Validates the workflow. |
> | Microsoft.Logic/locations/workflows/recommendOperationGroups/action | Gets the workflow recommend operation groups. |
> | Microsoft.Logic/operations/read | Gets the operation. |
> | Microsoft.Logic/workflows/read | Reads the workflow. |
> | Microsoft.Logic/workflows/write | Creates or updates the workflow. |
> | Microsoft.Logic/workflows/delete | Deletes the workflow. |
> | Microsoft.Logic/workflows/run/action | Starts a run of the workflow. |
> | Microsoft.Logic/workflows/disable/action | Disables the workflow. |
> | Microsoft.Logic/workflows/enable/action | Enables the workflow. |
> | Microsoft.Logic/workflows/suspend/action | Suspends the workflow. |
> | Microsoft.Logic/workflows/validate/action | Validates the workflow. |
> | Microsoft.Logic/workflows/move/action | Moves Workflow from its existing subscription id, resource group, and/or name to a different subscription id, resource group, and/or name. |
> | Microsoft.Logic/workflows/listSwagger/action | Gets the workflow swagger definitions. |
> | Microsoft.Logic/workflows/regenerateAccessKey/action | Regenerates the access key secrets. |
> | Microsoft.Logic/workflows/listCallbackUrl/action | Gets the callback URL for workflow. |
> | Microsoft.Logic/workflows/accessKeys/read | Reads the access key. |
> | Microsoft.Logic/workflows/accessKeys/write | Creates or updates the access key. |
> | Microsoft.Logic/workflows/accessKeys/delete | Deletes the access key. |
> | Microsoft.Logic/workflows/accessKeys/list/action | Lists the access key secrets. |
> | Microsoft.Logic/workflows/accessKeys/regenerate/action | Regenerates the access key secrets. |
> | Microsoft.Logic/workflows/detectors/read | Reads the workflow detector. |
> | Microsoft.Logic/workflows/providers/Microsoft.Insights/diagnosticSettings/read | Reads the workflow diagnostic settings. |
> | Microsoft.Logic/workflows/providers/Microsoft.Insights/diagnosticSettings/write | Creates or updates the workflow diagnostic setting. |
> | Microsoft.Logic/workflows/providers/Microsoft.Insights/logDefinitions/read | Reads the workflow log definitions. |
> | Microsoft.Logic/workflows/providers/Microsoft.Insights/metricDefinitions/read | Reads the workflow metric definitions. |
> | Microsoft.Logic/workflows/runs/read | Reads the workflow run. |
> | Microsoft.Logic/workflows/runs/delete | Deletes a run of a workflow. |
> | Microsoft.Logic/workflows/runs/cancel/action | Cancels the run of a workflow. |
> | Microsoft.Logic/workflows/runs/actions/read | Reads the workflow run action. |
> | Microsoft.Logic/workflows/runs/actions/listExpressionTraces/action | Gets the workflow run action expression traces. |
> | Microsoft.Logic/workflows/runs/actions/repetitions/read | Reads the workflow run action repetition. |
> | Microsoft.Logic/workflows/runs/actions/repetitions/listExpressionTraces/action | Gets the workflow run action repetition expression traces. |
> | Microsoft.Logic/workflows/runs/actions/repetitions/requestHistories/read | Reads the workflow run repetition action request history. |
> | Microsoft.Logic/workflows/runs/actions/requestHistories/read | Reads the workflow run action request history. |
> | Microsoft.Logic/workflows/runs/actions/scoperepetitions/read | Reads the workflow run action scope repetition. |
> | Microsoft.Logic/workflows/runs/operations/read | Reads the workflow run operation status. |
> | Microsoft.Logic/workflows/triggers/read | Reads the trigger. |
> | Microsoft.Logic/workflows/triggers/run/action | Executes the trigger. |
> | Microsoft.Logic/workflows/triggers/reset/action | Resets the trigger. |
> | Microsoft.Logic/workflows/triggers/setState/action | Sets the trigger state. |
> | Microsoft.Logic/workflows/triggers/listCallbackUrl/action | Gets the callback URL for trigger. |
> | Microsoft.Logic/workflows/triggers/histories/read | Reads the trigger histories. |
> | Microsoft.Logic/workflows/triggers/histories/resubmit/action | Resubmits the workflow trigger. |
> | Microsoft.Logic/workflows/versions/read | Reads the workflow version. |
> | Microsoft.Logic/workflows/versions/triggers/listCallbackUrl/action | Gets the callback URL for trigger. |

## Microsoft.NotificationHubs

Send push notifications to any platform from any back end.

Azure service: [Notification Hubs](/azure/notification-hubs/)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.NotificationHubs/register/action | Registers the subscription for the NotificationHubs resource provider and enables the creation of Namespaces and NotificationHubs |
> | Microsoft.NotificationHubs/unregister/action | Unregisters the subscription for the NotificationHubs resource provider and enables the creation of Namespaces and NotificationHubs |
> | Microsoft.NotificationHubs/CheckNamespaceAvailability/action | Checks whether or not a given Namespace resource name is available within the NotificationHub service. |
> | Microsoft.NotificationHubs/CheckNamespaceAvailability/read | Checks whether or not a given Namespace resource name is available within the NotificationHub service. |
> | Microsoft.NotificationHubs/Namespaces/write | Create a Namespace Resource and Update its properties. Tags and Capacity of the Namespace are the properties which can be updated. |
> | Microsoft.NotificationHubs/Namespaces/read | Get the list of Namespace Resource Description |
> | Microsoft.NotificationHubs/Namespaces/delete | Delete Namespace Resource |
> | Microsoft.NotificationHubs/Namespaces/authorizationRules/action | Get the list of Namespaces Authorization Rules description. |
> | Microsoft.NotificationHubs/Namespaces/CheckNotificationHubAvailability/action | Checks whether or not a given NotificationHub name is available inside a Namespace. |
> | Microsoft.NotificationHubs/namespaces/privateEndpointConnectionsApproval/action | Approve Private Endpoint Connection |
> | Microsoft.NotificationHubs/Namespaces/authorizationRules/write | Create a Namespace level Authorization Rules and update its properties. The Authorization Rules Access Rights, the Primary and Secondary Keys can be updated. |
> | Microsoft.NotificationHubs/Namespaces/authorizationRules/read | Get the list of Namespaces Authorization Rules description. |
> | Microsoft.NotificationHubs/Namespaces/authorizationRules/delete | Delete Namespace Authorization Rule. The Default Namespace Authorization Rule cannot be deleted. |
> | Microsoft.NotificationHubs/Namespaces/authorizationRules/listkeys/action | Get the Connection String to the Namespace |
> | Microsoft.NotificationHubs/Namespaces/authorizationRules/regenerateKeys/action | Namespace Authorization Rule Regenerate Primary/SecondaryKey, Specify the Key that needs to be regenerated |
> | Microsoft.NotificationHubs/Namespaces/NotificationHubs/write | Create a Notification Hub and Update its properties. Its properties mainly include PNS Credentials. Authorization Rules and TTL |
> | Microsoft.NotificationHubs/Namespaces/NotificationHubs/read | Get list of Notification Hub Resource Descriptions |
> | Microsoft.NotificationHubs/Namespaces/NotificationHubs/delete | Delete Notification Hub Resource |
> | Microsoft.NotificationHubs/Namespaces/NotificationHubs/authorizationRules/action | Get the list of Notification Hub Authorization Rules |
> | Microsoft.NotificationHubs/Namespaces/NotificationHubs/pnsCredentials/action | Get All Notification Hub PNS Credentials. This includes, WNS, MPNS, APNS, GCM and Baidu credentials |
> | Microsoft.NotificationHubs/Namespaces/NotificationHubs/debugSend/action | Send a test push notification to 10 matched devices. |
> | Microsoft.NotificationHubs/Namespaces/NotificationHubs/authorizationRules/write | Create Notification Hub Authorization Rules and Update its properties. The Authorization Rules Access Rights, the Primary and Secondary Keys can be updated. |
> | Microsoft.NotificationHubs/Namespaces/NotificationHubs/authorizationRules/read | Get the list of Notification Hub Authorization Rules |
> | Microsoft.NotificationHubs/Namespaces/NotificationHubs/authorizationRules/delete | Delete Notification Hub Authorization Rules |
> | Microsoft.NotificationHubs/Namespaces/NotificationHubs/authorizationRules/listkeys/action | Get the Connection String to the Notification Hub |
> | Microsoft.NotificationHubs/Namespaces/NotificationHubs/authorizationRules/regenerateKeys/action | Notification Hub Authorization Rule Regenerate Primary/SecondaryKey, Specify the Key that needs to be regenerated |
> | Microsoft.NotificationHubs/Namespaces/NotificationHubs/metricDefinitions/read | Get list of Namespace metrics Resource Descriptions |
> | Microsoft.NotificationHubs/Namespaces/NotificationHubs/vapidkeys/read | Get new pair of VAPID keys for a Notification Hub |
> | Microsoft.NotificationHubs/Namespaces/operations/read | Returns a list of supported operations for Notification Hubs namespaces provider |
> | Microsoft.NotificationHubs/namespaces/privateEndpointConnectionProxies/validate/action | Validate Private Endpoint Connection Proxy |
> | Microsoft.NotificationHubs/namespaces/privateEndpointConnectionProxies/read | Get Private Endpoint Connection Proxy |
> | Microsoft.NotificationHubs/namespaces/privateEndpointConnectionProxies/write | Create Private Endpoint Connection Proxy |
> | Microsoft.NotificationHubs/namespaces/privateEndpointConnectionProxies/delete | Delete Private Endpoint Connection Proxy |
> | Microsoft.NotificationHubs/namespaces/privateEndpointConnectionProxies/operationstatus/read | Get the status of an asynchronous private endpoint operation |
> | Microsoft.NotificationHubs/namespaces/privateEndpointConnections/read | Get Private Endpoint Connection |
> | Microsoft.NotificationHubs/namespaces/privateEndpointConnections/write | Create or Update Private Endpoint Connection |
> | Microsoft.NotificationHubs/namespaces/privateEndpointConnections/delete | Removes Private Endpoint Connection |
> | Microsoft.NotificationHubs/namespaces/privateEndpointConnections/operationstatus/read | Removes Private Endpoint Connection |
> | Microsoft.NotificationHubs/namespaces/providers/Microsoft.Insights/diagnosticSettings/read | Get Namespace diagnostic settings |
> | Microsoft.NotificationHubs/namespaces/providers/Microsoft.Insights/diagnosticSettings/write | Create or Update Namespace diagnostic settings |
> | Microsoft.NotificationHubs/namespaces/providers/Microsoft.Insights/logDefinitions/read | Gets the available logs for Namespace |
> | Microsoft.NotificationHubs/operationResults/read | Returns operation results for Notification Hubs provider |
> | Microsoft.NotificationHubs/operations/read | Returns a list of supported operations for Notification Hubs provider |
> | Microsoft.NotificationHubs/resourceTypes/read | Gets a list of the resource types for Notification Hubs |

## Microsoft.Relay

Expose services that run in your corporate network to the public cloud.

Azure service: [Azure Relay](/azure/azure-relay/relay-what-is-it)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.Relay/checkNamespaceAvailability/action | Checks availability of namespace under given subscription. This API is deprecated please use CheckNameAvailability instead. |
> | Microsoft.Relay/checkNameAvailability/action | Checks availability of namespace under given subscription. |
> | Microsoft.Relay/register/action | Registers the subscription for the Relay resource provider and enables the creation of Relay resources |
> | Microsoft.Relay/unregister/action | Registers the subscription for the Relay resource provider and enables the creation of Relay resources |
> | Microsoft.Relay/namespaces/write | Create a Namespace Resource and Update its properties. Tags and Capacity of the Namespace are the properties which can be updated. |
> | Microsoft.Relay/namespaces/read | Get the list of Namespace Resource Description |
> | Microsoft.Relay/namespaces/Delete | Delete Namespace Resource |
> | Microsoft.Relay/namespaces/authorizationRules/action | Updates Namespace Authorization Rule. This API is deprecated. Please use a PUT call to update the Namespace Authorization Rule instead.. This operation is not supported on API version 2017-04-01. |
> | Microsoft.Relay/namespaces/removeAcsNamepsace/action | Remove ACS namespace |
> | Microsoft.Relay/namespaces/privateEndpointConnectionsApproval/action | Approve Private Endpoint Connection |
> | Microsoft.Relay/namespaces/authorizationRules/read | Get the list of Namespaces Authorization Rules description. |
> | Microsoft.Relay/namespaces/authorizationRules/write | Create a Namespace level Authorization Rules and update its properties. The Authorization Rules Access Rights, the Primary and Secondary Keys can be updated. |
> | Microsoft.Relay/namespaces/authorizationRules/delete | Delete Namespace Authorization Rule. The Default Namespace Authorization Rule cannot be deleted.  |
> | Microsoft.Relay/namespaces/authorizationRules/listkeys/action | Get the Connection String to the Namespace |
> | Microsoft.Relay/namespaces/authorizationRules/regenerateKeys/action | Regenerate the Primary or Secondary key to the Resource |
> | Microsoft.Relay/namespaces/disasterrecoveryconfigs/checkNameAvailability/action | Checks availability of namespace alias under given subscription. |
> | Microsoft.Relay/namespaces/disasterRecoveryConfigs/write | Creates or Updates the Disaster Recovery configuration associated with the namespace. |
> | Microsoft.Relay/namespaces/disasterRecoveryConfigs/read | Gets the Disaster Recovery configuration associated with the namespace. |
> | Microsoft.Relay/namespaces/disasterRecoveryConfigs/delete | Deletes the Disaster Recovery configuration associated with the namespace. This operation can only be invoked via the primary namespace. |
> | Microsoft.Relay/namespaces/disasterRecoveryConfigs/breakPairing/action | Disables Disaster Recovery and stops replicating changes from primary to secondary namespaces. |
> | Microsoft.Relay/namespaces/disasterRecoveryConfigs/failover/action | Invokes a GEO DR failover and reconfigures the namespace alias to point to the secondary namespace. |
> | Microsoft.Relay/namespaces/disasterRecoveryConfigs/authorizationRules/read | Get Disaster Recovery Primary Namespace's Authorization Rules |
> | Microsoft.Relay/namespaces/disasterRecoveryConfigs/authorizationRules/listkeys/action | Gets the authorization rules keys for the Disaster Recovery primary namespace |
> | Microsoft.Relay/namespaces/HybridConnections/write | Create or Update HybridConnection properties. |
> | Microsoft.Relay/namespaces/HybridConnections/read | Get list of HybridConnection Resource Descriptions |
> | Microsoft.Relay/namespaces/HybridConnections/Delete | Operation to delete HybridConnection Resource |
> | Microsoft.Relay/namespaces/HybridConnections/authorizationRules/action | Operation to update HybridConnection. This operation is not supported on API version 2017-04-01. Authorization Rules. Please use a PUT call to update Authorization Rule. |
> | Microsoft.Relay/namespaces/HybridConnections/authorizationRules/read |  Get the list of HybridConnection Authorization Rules |
> | Microsoft.Relay/namespaces/HybridConnections/authorizationRules/write | Create HybridConnection Authorization Rules and Update its properties. The Authorization Rules Access Rights can be updated. |
> | Microsoft.Relay/namespaces/HybridConnections/authorizationRules/delete | Operation to delete HybridConnection Authorization Rules |
> | Microsoft.Relay/namespaces/HybridConnections/authorizationRules/listkeys/action | Get the Connection String to HybridConnection |
> | Microsoft.Relay/namespaces/HybridConnections/authorizationRules/regeneratekeys/action | Regenerate the Primary or Secondary key to the Resource |
> | Microsoft.Relay/namespaces/messagingPlan/read | Gets the Messaging Plan for a namespace.<br>This API is deprecated.<br>Properties exposed via the MessagingPlan resource are moved to the (parent) Namespace resource in later API versions..<br>This operation is not supported on API version 2017-04-01. |
> | Microsoft.Relay/namespaces/messagingPlan/write | Updates the Messaging Plan for a namespace.<br>This API is deprecated.<br>Properties exposed via the MessagingPlan resource are moved to the (parent) Namespace resource in later API versions..<br>This operation is not supported on API version 2017-04-01. |
> | Microsoft.Relay/namespaces/networkrulesets/read | Gets NetworkRuleSet Resource |
> | Microsoft.Relay/namespaces/networkrulesets/write | Create VNET Rule Resource |
> | Microsoft.Relay/namespaces/networkrulesets/delete | Delete VNET Rule Resource |
> | Microsoft.Relay/namespaces/operationresults/read | Get the status of Namespace operation |
> | Microsoft.Relay/namespaces/privateEndpointConnectionProxies/validate/action | Validate Private Endpoint Connection Proxy |
> | Microsoft.Relay/namespaces/privateEndpointConnectionProxies/read | Get Private Endpoint Connection Proxy |
> | Microsoft.Relay/namespaces/privateEndpointConnectionProxies/write | Create Private Endpoint Connection Proxy |
> | Microsoft.Relay/namespaces/privateEndpointConnectionProxies/delete | Delete Private Endpoint Connection Proxy |
> | Microsoft.Relay/namespaces/privateEndpointConnectionProxies/operationstatus/read | Get the status of an asynchronous private endpoint operation |
> | Microsoft.Relay/namespaces/privateEndpointConnections/read | Get Private Endpoint Connection |
> | Microsoft.Relay/namespaces/privateEndpointConnections/write | Create or Update Private Endpoint Connection |
> | Microsoft.Relay/namespaces/privateEndpointConnections/delete | Removes Private Endpoint Connection |
> | Microsoft.Relay/namespaces/privateEndpointConnections/operationstatus/read | Get the status of an asynchronous private endpoint operation |
> | Microsoft.Relay/namespaces/privateLinkResources/read | Gets the resource types that support private endpoint connections |
> | Microsoft.Relay/namespaces/providers/Microsoft.Insights/diagnosticSettings/read | Get list of Namespace diagnostic settings Resource Descriptions |
> | Microsoft.Relay/namespaces/providers/Microsoft.Insights/diagnosticSettings/write | Get list of Namespace diagnostic settings Resource Descriptions |
> | Microsoft.Relay/namespaces/providers/Microsoft.Insights/logDefinitions/read | Get list of Namespace logs Resource Descriptions |
> | Microsoft.Relay/namespaces/providers/Microsoft.Insights/metricDefinitions/read | Get list of Namespace metrics Resource Descriptions |
> | Microsoft.Relay/namespaces/WcfRelays/write | Create or Update WcfRelay properties. |
> | Microsoft.Relay/namespaces/WcfRelays/read | Get list of WcfRelay Resource Descriptions |
> | Microsoft.Relay/namespaces/WcfRelays/Delete | Operation to delete WcfRelay Resource |
> | Microsoft.Relay/namespaces/WcfRelays/authorizationRules/action | Operation to update WcfRelay. This operation is not supported on API version 2017-04-01. Authorization Rules. Please use a PUT call to update Authorization Rule. |
> | Microsoft.Relay/namespaces/WcfRelays/authorizationRules/read |  Get the list of WcfRelay Authorization Rules |
> | Microsoft.Relay/namespaces/WcfRelays/authorizationRules/write | Create WcfRelay Authorization Rules and Update its properties. The Authorization Rules Access Rights can be updated. |
> | Microsoft.Relay/namespaces/WcfRelays/authorizationRules/delete | Operation to delete WcfRelay Authorization Rules |
> | Microsoft.Relay/namespaces/WcfRelays/authorizationRules/listkeys/action | Get the Connection String to WcfRelay |
> | Microsoft.Relay/namespaces/WcfRelays/authorizationRules/regeneratekeys/action | Regenerate the Primary or Secondary key to the Resource |
> | Microsoft.Relay/operations/read | Get Operations |
> | **DataAction** | **Description** |
> | Microsoft.Relay/namespaces/messages/send/action | Send messages |
> | Microsoft.Relay/namespaces/messages/listen/action | Receive messages |

## Microsoft.ServiceBus

Connect across private and public cloud environments.

Azure service: [Service Bus](/azure/service-bus-messaging/)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.ServiceBus/checkNamespaceAvailability/action | Checks availability of namespace under given subscription. This API is deprecated please use CheckNameAvailability instead. |
> | Microsoft.ServiceBus/checkNameAvailability/action | Checks availability of namespace under given subscription. |
> | Microsoft.ServiceBus/register/action | Registers the subscription for the ServiceBus resource provider and enables the creation of ServiceBus resources |
> | Microsoft.ServiceBus/unregister/action | Registers the subscription for the ServiceBus resource provider and enables the creation of ServiceBus resources |
> | Microsoft.ServiceBus/locations/deleteVirtualNetworkOrSubnets/action | Deletes the VNet rules in ServiceBus Resource Provider for the specified VNet |
> | Microsoft.ServiceBus/namespaces/write | Create a Namespace Resource and Update its properties. Tags and Capacity of the Namespace are the properties which can be updated. |
> | Microsoft.ServiceBus/namespaces/read | Get the list of Namespace Resource Description |
> | Microsoft.ServiceBus/namespaces/Delete | Delete Namespace Resource |
> | Microsoft.ServiceBus/namespaces/authorizationRules/action | Updates Namespace Authorization Rule. This API is deprecated. Please use a PUT call to update the Namespace Authorization Rule instead.. This operation is not supported on API version 2017-04-01. |
> | Microsoft.ServiceBus/namespaces/migrate/action | Migrate namespace operation |
> | Microsoft.ServiceBus/namespaces/removeAcsNamepsace/action | Remove ACS namespace |
> | Microsoft.ServiceBus/namespaces/privateEndpointConnectionsApproval/action | Approve Private Endpoint Connection |
> | Microsoft.ServiceBus/namespaces/authorizationRules/write | Create a Namespace level Authorization Rules and update its properties. The Authorization Rules Access Rights, the Primary and Secondary Keys can be updated. |
> | Microsoft.ServiceBus/namespaces/authorizationRules/read | Get the list of Namespaces Authorization Rules description. |
> | Microsoft.ServiceBus/namespaces/authorizationRules/delete | Delete Namespace Authorization Rule. The Default Namespace Authorization Rule cannot be deleted.  |
> | Microsoft.ServiceBus/namespaces/authorizationRules/listkeys/action | Get the Connection String to the Namespace |
> | Microsoft.ServiceBus/namespaces/authorizationRules/regenerateKeys/action | Regenerate the Primary or Secondary key to the Resource |
> | Microsoft.ServiceBus/namespaces/disasterrecoveryconfigs/checkNameAvailability/action | Checks availability of namespace alias under given subscription. |
> | Microsoft.ServiceBus/namespaces/disasterRecoveryConfigs/write | Creates or Updates the Disaster Recovery configuration associated with the namespace. |
> | Microsoft.ServiceBus/namespaces/disasterRecoveryConfigs/read | Gets the Disaster Recovery configuration associated with the namespace. |
> | Microsoft.ServiceBus/namespaces/disasterRecoveryConfigs/delete | Deletes the Disaster Recovery configuration associated with the namespace. This operation can only be invoked via the primary namespace. |
> | Microsoft.ServiceBus/namespaces/disasterRecoveryConfigs/breakPairing/action | Disables Disaster Recovery and stops replicating changes from primary to secondary namespaces. |
> | Microsoft.ServiceBus/namespaces/disasterRecoveryConfigs/failover/action | Invokes a GEO DR failover and reconfigures the namespace alias to point to the secondary namespace. |
> | Microsoft.ServiceBus/namespaces/disasterRecoveryConfigs/authorizationRules/read | Get Disaster Recovery Primary Namespace's Authorization Rules |
> | Microsoft.ServiceBus/namespaces/disasterRecoveryConfigs/authorizationRules/listkeys/action | Gets the authorization rules keys for the Disaster Recovery primary namespace |
> | Microsoft.ServiceBus/namespaces/eventGridFilters/write | Creates or Updates the Event Grid filter associated with the namespace. |
> | Microsoft.ServiceBus/namespaces/eventGridFilters/read | Gets the Event Grid filter associated with the namespace. |
> | Microsoft.ServiceBus/namespaces/eventGridFilters/delete | Deletes the Event Grid filter associated with the namespace. |
> | Microsoft.ServiceBus/namespaces/eventhubs/read | Get list of EventHub Resource Descriptions |
> | Microsoft.ServiceBus/namespaces/ipFilterRules/read | Get IP Filter Resource |
> | Microsoft.ServiceBus/namespaces/ipFilterRules/write | Create IP Filter Resource |
> | Microsoft.ServiceBus/namespaces/ipFilterRules/delete | Delete IP Filter Resource |
> | Microsoft.ServiceBus/namespaces/messagingPlan/read | Gets the Messaging Plan for a namespace.<br>This API is deprecated.<br>Properties exposed via the MessagingPlan resource are moved to the (parent) Namespace resource in later API versions..<br>This operation is not supported on API version 2017-04-01. |
> | Microsoft.ServiceBus/namespaces/messagingPlan/write | Updates the Messaging Plan for a namespace.<br>This API is deprecated.<br>Properties exposed via the MessagingPlan resource are moved to the (parent) Namespace resource in later API versions..<br>This operation is not supported on API version 2017-04-01. |
> | Microsoft.ServiceBus/namespaces/migrationConfigurations/write | Creates or Updates Migration configuration. This will start synchronizing resources from the standard to the premium namespace |
> | Microsoft.ServiceBus/namespaces/migrationConfigurations/read | Gets the Migration configuration which indicates the state of the migration and pending replication operations |
> | Microsoft.ServiceBus/namespaces/migrationConfigurations/delete | Deletes the Migration configuration. |
> | Microsoft.ServiceBus/namespaces/migrationConfigurations/revert/action | Reverts the standard to premium namespace migration |
> | Microsoft.ServiceBus/namespaces/migrationConfigurations/upgrade/action | Assigns the DNS associated with the standard namespace to the premium namespace which completes the migration and stops the syncing resources from standard to premium namespace |
> | Microsoft.ServiceBus/namespaces/networkruleset/read | Gets NetworkRuleSet Resource |
> | Microsoft.ServiceBus/namespaces/networkruleset/write | Create VNET Rule Resource |
> | Microsoft.ServiceBus/namespaces/networkruleset/delete | Delete VNET Rule Resource |
> | Microsoft.ServiceBus/namespaces/networkrulesets/read | Gets NetworkRuleSet Resource |
> | Microsoft.ServiceBus/namespaces/networkrulesets/write | Create VNET Rule Resource |
> | Microsoft.ServiceBus/namespaces/networkrulesets/delete | Delete VNET Rule Resource |
> | Microsoft.ServiceBus/namespaces/operationresults/read | Get the status of Namespace operation |
> | Microsoft.ServiceBus/namespaces/privateEndpointConnectionProxies/validate/action | Validate Private Endpoint Connection Proxy |
> | Microsoft.ServiceBus/namespaces/privateEndpointConnectionProxies/read | Get Private Endpoint Connection Proxy |
> | Microsoft.ServiceBus/namespaces/privateEndpointConnectionProxies/write | Create Private Endpoint Connection Proxy |
> | Microsoft.ServiceBus/namespaces/privateEndpointConnectionProxies/delete | Delete Private Endpoint Connection Proxy |
> | Microsoft.ServiceBus/namespaces/privateEndpointConnectionProxies/operationstatus/read | Get the status of an asynchronous private endpoint operation |
> | Microsoft.ServiceBus/namespaces/privateEndpointConnections/read | Get Private Endpoint Connection |
> | Microsoft.ServiceBus/namespaces/privateEndpointConnections/write | Create or Update Private Endpoint Connection |
> | Microsoft.ServiceBus/namespaces/privateEndpointConnections/delete | Removes Private Endpoint Connection |
> | Microsoft.ServiceBus/namespaces/privateEndpointConnections/operationstatus/read | Get the status of an asynchronous private endpoint operation |
> | Microsoft.ServiceBus/namespaces/privateLinkResources/read | Gets the resource types that support private endpoint connections |
> | Microsoft.ServiceBus/namespaces/providers/Microsoft.Insights/diagnosticSettings/read | Get list of Namespace diagnostic settings Resource Descriptions |
> | Microsoft.ServiceBus/namespaces/providers/Microsoft.Insights/diagnosticSettings/write | Get list of Namespace diagnostic settings Resource Descriptions |
> | Microsoft.ServiceBus/namespaces/providers/Microsoft.Insights/logDefinitions/read | Get list of Namespace logs Resource Descriptions |
> | Microsoft.ServiceBus/namespaces/providers/Microsoft.Insights/metricDefinitions/read | Get list of Namespace metrics Resource Descriptions |
> | Microsoft.ServiceBus/namespaces/queues/write | Create or Update Queue properties. |
> | Microsoft.ServiceBus/namespaces/queues/read | Get list of Queue Resource Descriptions |
> | Microsoft.ServiceBus/namespaces/queues/Delete | Operation to delete Queue Resource |
> | Microsoft.ServiceBus/namespaces/queues/authorizationRules/action | Operation to update Queue. This operation is not supported on API version 2017-04-01. Authorization Rules. Please use a PUT call to update Authorization Rule. |
> | Microsoft.ServiceBus/namespaces/queues/authorizationRules/write | Create Queue Authorization Rules and Update its properties. The Authorization Rules Access Rights can be updated. |
> | Microsoft.ServiceBus/namespaces/queues/authorizationRules/read |  Get the list of Queue Authorization Rules |
> | Microsoft.ServiceBus/namespaces/queues/authorizationRules/delete | Operation to delete Queue Authorization Rules |
> | Microsoft.ServiceBus/namespaces/queues/authorizationRules/listkeys/action | Get the Connection String to Queue |
> | Microsoft.ServiceBus/namespaces/queues/authorizationRules/regenerateKeys/action | Regenerate the Primary or Secondary key to the Resource |
> | Microsoft.ServiceBus/namespaces/skus/read | List Supported SKUs for Namespace |
> | Microsoft.ServiceBus/namespaces/topics/write | Create or Update Topic properties. |
> | Microsoft.ServiceBus/namespaces/topics/read | Get list of Topic Resource Descriptions |
> | Microsoft.ServiceBus/namespaces/topics/Delete | Operation to delete Topic Resource |
> | Microsoft.ServiceBus/namespaces/topics/authorizationRules/action | Operation to update Topic. This operation is not supported on API version 2017-04-01. Authorization Rules. Please use a PUT call to update Authorization Rule. |
> | Microsoft.ServiceBus/namespaces/topics/authorizationRules/write | Create Topic Authorization Rules and Update its properties. The Authorization Rules Access Rights can be updated. |
> | Microsoft.ServiceBus/namespaces/topics/authorizationRules/read |  Get the list of Topic Authorization Rules |
> | Microsoft.ServiceBus/namespaces/topics/authorizationRules/delete | Operation to delete Topic Authorization Rules |
> | Microsoft.ServiceBus/namespaces/topics/authorizationRules/listkeys/action | Get the Connection String to Topic |
> | Microsoft.ServiceBus/namespaces/topics/authorizationRules/regenerateKeys/action | Regenerate the Primary or Secondary key to the Resource |
> | Microsoft.ServiceBus/namespaces/topics/subscriptions/write | Create or Update TopicSubscription properties. |
> | Microsoft.ServiceBus/namespaces/topics/subscriptions/read | Get list of TopicSubscription Resource Descriptions |
> | Microsoft.ServiceBus/namespaces/topics/subscriptions/Delete | Operation to delete TopicSubscription Resource |
> | Microsoft.ServiceBus/namespaces/topics/subscriptions/rules/write | Create or Update Rule properties. |
> | Microsoft.ServiceBus/namespaces/topics/subscriptions/rules/read | Get list of Rule Resource Descriptions |
> | Microsoft.ServiceBus/namespaces/topics/subscriptions/rules/Delete | Operation to delete Rule Resource |
> | Microsoft.ServiceBus/namespaces/virtualNetworkRules/read | Gets VNET Rule Resource |
> | Microsoft.ServiceBus/namespaces/virtualNetworkRules/write | Create VNET Rule Resource |
> | Microsoft.ServiceBus/namespaces/virtualNetworkRules/delete | Delete VNET Rule Resource |
> | Microsoft.ServiceBus/operations/read | Get Operations |
> | Microsoft.ServiceBus/sku/read | Get list of Sku Resource Descriptions |
> | Microsoft.ServiceBus/sku/regions/read | Get list of SkuRegions Resource Descriptions |
> | **DataAction** | **Description** |
> | Microsoft.ServiceBus/namespaces/messages/send/action | Send messages |
> | Microsoft.ServiceBus/namespaces/messages/receive/action | Receive messages |

## Microsoft.ServicesHub

Azure service: [Services Hub](/services-hub/)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.ServicesHub/connectors/write | Create or update a Services Hub Connector |
> | Microsoft.ServicesHub/connectors/read | View or List Services Hub Connectors |
> | Microsoft.ServicesHub/connectors/delete | Delete Services Hub Connectors |
> | Microsoft.ServicesHub/connectors/checkAssessmentEntitlement/action | Lists the Assessment Entitlements for a given Services Hub Workspace |
> | Microsoft.ServicesHub/supportOfferingEntitlement/read | View the Support Offering Entitlements for a given Services Hub Workspace |
> | Microsoft.ServicesHub/workspaces/read | List the Services Hub Workspaces for a given User |

## Next steps

- [Azure resource providers and types](/azure/azure-resource-manager/management/resource-providers-and-types)
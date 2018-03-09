---
title: Azure Resource Manager Provider Operations | Microsoft Docs
description: Details the operations available on the Microsoft Azure Resource Manager resource providers
services: active-directory
documentationcenter:
author: rolyon
manager: mtillman


ms.service: active-directory
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 03/06/2018
ms.author: rolyon

---
# Azure Resource Manager Resource Provider operations

This document lists the operations available for each Microsoft Azure Resource Manager resource provider. These can be used in custom roles to provide granular Role-Based Access Control (RBAC) permissions to resources in Azure. Please note this is not a comprehensive list and operations may be added or removed as each provider is updated. Operation strings follow the format of `Microsoft.<ProviderName>/<ChildResourceType>/<action>`. 

> [!NOTE]
> For a comprehensive and current list please use `Get-AzureRmProviderOperation` (in PowerShell) or `az provider operation list` (in Azure CLI v2) to list operations of Azure resource providers.

## Microsoft.AAD

| Operation | Description |
|---|---|
|/domainServices/read|Reads Domain Services.|
|/domainServices/write|Write Domain Services|
|/domainServices/delete|Deletes Domain Services.|
|/Operations/read|The localized friendly description for the operation, as it should be shown to the user.|
|/locations/operationresults/read|Read the status of an asynchronous operation.|

## microsoft.aadiam

| Operation | Description |
|---|---|
|/diagnosticsettingscategories/read|Reading a diagnostic setting categories|
|/diagnosticsettings/write|Writing a diagnostic setting|
|/diagnosticsettings/read|Reading a diagnostic setting|
|/diagnosticsettings/delete|Deleting a diagnostic setting|
|/tenants/providers/Microsoft.Insights/diagnosticSettings/read|Gets the diagnostic setting for the resource|
|/tenants/providers/Microsoft.Insights/diagnosticSettings/write|Creates or updates the diagnostic setting for the resource|
|/tenants/providers/Microsoft.Insights/logDefinitions/read|Gets the available logs for tenants|

## Microsoft.ADHybridHealthService

| Operation | Description |
|---|---|
|/configuration/action|Updates Tenant Configuration.|
|/services/action|Updates a service instance in the tenant.|
|/configuration/write|Creates a Tenant Configuration.|
|/configuration/read|Reads the Tenant Configuration.|
|/services/write|Creates a service instance in the tenant.|
|/services/read|Reads the service instances in the tenant.|
|/services/delete|Deletes a service instance in the tenant.|
|/services/servicemembers/action|Creates a service member instance in the service.|
|/services/servicemembers/read|Reads the service member instance in the service.|
|/services/servicemembers/delete|Deletes a service member instance in the service.|
|/services/servicemembers/alerts/read|Reads the alerts for a service member.|
|/services/alerts/read|Reads the alerts for a service.|
|/services/alerts/read|Reads the alerts for a service.|

## Microsoft.Advisor

| Operation | Description |
|---|---|
|/generateRecommendations/action|Generates recommendations|
|/register/action|Registers the subscription for the Microsoft Advisor|
|/unregister/action|Unregisters the subscription for the Microsoft Advisor|
|/configurations/read|Get configurations|
|/configurations/write|Creates/updates configuration|
|/generateRecommendations/read|Gets generate recommendations status|
|/operations/read|Gets the operations for the Microsoft Advisor|
|/recommendations/read|Reads recommendations|
|/recommendations/suppressions/read|Gets suppressions|
|/recommendations/suppressions/write|Creates/updates suppressions|
|/recommendations/suppressions/delete|Deletes suppression|
|/suppressions/read|Gets suppressions|
|/suppressions/write|Creates/updates suppressions|
|/suppressions/delete|Deletes suppression|

## Microsoft.AlertsManagement

| Operation | Description |
|---|---|
|/alerts/read|Get all the alerts for the input filters.|
|/alerts/resolve/action|Change the state of the alert to 'Resolve'|
|/alertsSummary/read|Get the summary of alerts|
|/Operations/read|Reads the operations provided|

## Microsoft.AnalysisServices

| Operation | Description |
|---|---|
|/register/action|Registers Analysis Services resource provider.|
|/servers/read|Retrieves the information of the specified Analysis Server.|
|/servers/write|Creates or updates the specified Analysis Server.|
|/servers/delete|Deletes the Analysis Server.|
|/servers/suspend/action|Suspends the Analysis Server.|
|/servers/resume/action|Resumes the Analysis Server.|
|/servers/listGatewayStatus/action|List the status of the gateway associated with the server.|
|/servers/providers/Microsoft.Insights/metricDefinitions/read|Gets the available metrics for Analysis Server|
|/servers/providers/Microsoft.Insights/diagnosticSettings/read|Gets the diagnostic setting for Analysis Server|
|/servers/providers/Microsoft.Insights/diagnosticSettings/write|Creates or updates the diagnostic setting for Analysis Server|
|/servers/providers/Microsoft.Insights/logDefinitions/read|Gets the available logs for servers|
|/servers/skus/read|Retrieve available SKU information for the server|
|/skus/read|Retrieves the information of Skus|
|/operations/read|Retrieves the information of operations|
|/locations/checkNameAvailability/action|Checks that given Analysis Server name is valid and not in use.|
|/locations/operationresults/read|Retrieves the information of the specified operation result.|
|/locations/operationstatuses/read|Retrieves the information of the specified operation status.|

## Microsoft.ApiManagement

| Operation | Description |
|---|---|
|/register/action|Register subscription for Microsoft.ApiManagement resource provider|
|/unregister/action|Un-register subscription for Microsoft.ApiManagement resource provider|
|/checkNameAvailability/read|Checks if provided service name is available|
|/service/write|Create a new instance of API Management Service|
|/service/read|Read metadata for an API Management Service instance|
|/service/delete|Delete API Management Service instance|
|/service/updatehostname/action|Setup, update or remove custom domain names for an API Management Service|
|/service/updatecertificate/action|Upload SSL certificate for an API Management Service|
|/service/backup/action|Backup API Management Service to the specified container in a user provided storage account|
|/service/restore/action|Restore API Management Service from the specified container in a user provided storage account|
|/service/managedeployments/action|Change SKU/units, add/remove regional deployments of API Management Service|
|/service/getssotoken/action|Gets SSO token that can be used to login into API Management Service Legacy portal as an administrator|
|/service/applynetworkconfigurationupdates/action|Updates the Microsoft.ApiManagement resources running in Virtual Network to pick updated Network Settings.|
|/service/users/action|Register a new user|
|/service/notifications/action|Sends notification to a specified user|
|/service/operationresults/read|Gets current status of long running operation|
|/service/providers/Microsoft.Insights/metricDefinitions/read|Gets the available metrics for API Management service|
|/service/providers/Microsoft.Insights/diagnosticSettings/read|Gets the diagnostic setting for API Management service|
|/service/providers/Microsoft.Insights/diagnosticSettings/write|Creates or updates the diagnostic setting for API Management service|
|/service/providers/Microsoft.Insights/logDefinitions/read|Gets the available logs for API Management service|
|/service/networkstatus/read|Gets the network access status of resources on which the service depends on.|
|/service/loggers/read|Get list of loggers or Get details of logger|
|/service/loggers/write|Add new logger or Update existing logger details|
|/service/loggers/delete|Remove existing logger|
|/service/users/read|Get a list of registered users or Get account details of a user|
|/service/users/write|Register a new user or Update account details of an existing user|
|/service/users/delete|Remove user account|
|/service/users/token/action|Get token access token for a user|
|/service/users/generateSsoUrl/action|Generate SSO URL. The URL can be used to access admin portal|
|/service/users/subscriptions/read|Get list of user subscriptions|
|/service/users/applications/read|Get list of all user applications or Gets API Management application details|
|/service/users/applications/write|Registers an application to API Management or Updates application details|
|/service/users/applications/delete|Removes existing application|
|/service/users/applications/attachments/read|Gets application attachments or Gets attachment|
|/service/users/applications/attachments/write|Add Attachment to application|
|/service/users/applications/attachments/delete|Removes an attachment|
|/service/users/keys/read|Get list of user keys|
|/service/users/groups/read|Get list of user groups|
|/service/tenant/read|Get policy configuration for the tenant or Get tenant access information details|
|/service/tenant/write|Set policy configuration for the tenant or Update tenant access information details|
|/service/tenant/delete|Remove policy configuration for the tenant|
|/service/tenant/regeneratePrimaryKey/action|Regenerate primary access key|
|/service/tenant/regenerateSecondaryKey/action|Regenerate secondary access key|
|/service/tenant/save/action|Creates commit with configuration snapshot to the specified branch in the repository|
|/service/tenant/deploy/action|Runs a deployment task to apply changes from the specified git branch to the configuration in database.|
|/service/tenant/validate/action|Validates changes from the specified git branch|
|/service/tenant/operationResults/read|Get list of operation results or Get result of a specific operation|
|/service/tenant/syncState/read|Get status of last git synchronization|
|/service/identityProviders/read|Get list of Identity providers or Get details of Identity Provider|
|/service/identityProviders/write|Create a new Identity Provider or Update details of an existing Identity Provider|
|/service/identityProviders/delete|Remove existing Identity Provider|
|/service/subscriptions/read|Get a list of product subscriptions or Get details of product subscription|
|/service/subscriptions/write|Subscribe an existing user to an existing product or Update existing subscription details. This operation can be used to renew subscription|
|/service/subscriptions/delete|Delete subscription. This operation can be used to delete subscription|
|/service/subscriptions/regeneratePrimaryKey/action|Regenerate subscription primary key|
|/service/subscriptions/regenerateSecondaryKey/action|Regenerate subscription secondary key|
|/service/backends/read|Get list of backends or Get details of backend|
|/service/backends/write|Add a new backend or Update existing backend details|
|/service/backends/delete|Remove existing backend|
|/service/backends/reconnect/action|Create a Reconnect Request|
|/service/apis/read|Get list of all registered APIs or Get details of API|
|/service/apis/write|Create new API or Update existing API details|
|/service/apis/delete|Remove existing API|
|/service/apis/operationsByTags/read|Get list of Operation/Tag associations|
|/service/apis/revisions/read|Get revisions belonging to an API|
|/service/apis/revisions/delete|Removes all revisions of an API|
|/service/apis/releases/read|Get releases for an API or Get details of API reelase|
|/service/apis/releases/delete|Removes all releases of the API or Remove API release|
|/service/apis/releases/write|Create new API release or Update existing API release|
|/service/apis/products/read|Get all products which the API is part of|
|/service/apis/tagDescriptions/read|Get Tags descriptions in scope of API or Get Tag description in scope of API|
|/service/apis/tagDescriptions/write|Create/Change Tag description in scope of API|
|/service/apis/tagDescriptions/delete|Remove Tag description from the API|
|/service/apis/policy/read|Get policy configuration details for API|
|/service/apis/policy/write|Set policy configuration details for API|
|/service/apis/policy/delete|Remove policy configuration from API|
|/service/apis/policies/read|Get policies for API or Get policy configuration details for API|
|/service/apis/policies/write|Set policy configuration details for API|
|/service/apis/policies/delete|Remove policy configuration from API policies|
|/service/apis/operations/read|Get list of existing API operations or Get details of API operation|
|/service/apis/operations/write|Create new API operation or Update existing API operation|
|/service/apis/operations/delete|Remove existing API operation|
|/service/apis/operations/policy/read|Get policy configuration details for operation|
|/service/apis/operations/policy/write|Set policy configuration details for operation|
|/service/apis/operations/policy/delete|Remove policy configuration from operation|
|/service/apis/operations/policies/read|Get policies for API Operation or Get policy configuration details for API Operation|
|/service/apis/operations/policies/write|Set policy configuration details for API Operation|
|/service/apis/operations/policies/delete|Remove policy configuration from API Operation policies|
|/service/apis/operations/tags/read|Get tags associated with the Operation or Get Tag details|
|/service/apis/operations/tags/write|Associate existing Tag with existing Operation|
|/service/apis/operations/tags/delete|Delete association of existing Tag with existing Operation|
|/service/apis/schemas/read|Gets all the schemas for a given API or Gets the Schemas used by the API|
|/service/apis/schemas/write|Sets the Schemas used by the API|
|/service/apis/schemas/delete|Removes existing Schema|
|/service/apis/schemas/document/read|Get the document describing the Schema|
|/service/apis/schemas/document/write|Update the document describing the Schema|
|/service/apis/tags/read|Get all API/Tag association for the API or Get details of API/Tag association|
|/service/apis/tags/write|Add new API/Tag association|
|/service/apis/tags/delete|Remove existing API/Tag association|
|/service/apis/diagnostics/read|Get list of diagnostics or Get details of diagnostic|
|/service/apis/diagnostics/write|Add new diagnostic or Update existing diagnostic details|
|/service/apis/diagnostics/delete|Remove existing diagnostic|
|/service/apis/diagnostics/loggers/read|Get list of existing Diagnostic loggers|
|/service/apis/diagnostics/loggers/write|Map logger to a diagnostic setting|
|/service/apis/diagnostics/loggers/delete|Remove mapping of a logger with a diagnostic setting|
|/service/products/read|Get list of products or Get details of product|
|/service/products/write|Create new product or Update existing product details|
|/service/products/delete|Remove existing product|
|/service/products/subscriptions/read|Get list of product subscriptions|
|/service/products/apis/read|Get list of APIs added to existing product|
|/service/products/apis/write|Add existing API to existing product|
|/service/products/apis/delete|Remove existing API from existing product|
|/service/products/policy/read|Get policy configuration of existing product|
|/service/products/policy/write|Set policy configuration for existing product|
|/service/products/policy/delete|Remove policy configuration from existing product|
|/service/products/policies/read|Get policies for Product or Get policy configuration details for Product|
|/service/products/policies/write|Set policy configuration details for Product|
|/service/products/policies/delete|Remove policy configuration from Product policies|
|/service/products/groups/read|Get list of developer groups associated with product|
|/service/products/groups/write|Associate existing developer group with existing product|
|/service/products/groups/delete|Delete association of existing developer group with existing product|
|/service/products/tags/read|Get tags associated with the Product or Get Tag details|
|/service/products/tags/write|Associate existing Tag with existing Product|
|/service/products/tags/delete|Delete association of existing Tag with existing Product|
|/service/notifications/read|Gets all API Management publisher notifications or Get API Management publisher notification details|
|/service/notifications/write|Create or Update API Management publisher notification|
|/service/notifications/recipientEmails/read|Get Email Recipients associated with API Management Publisher Notification|
|/service/notifications/recipientEmails/write|Create new Email Recipient of the Notification|
|/service/notifications/recipientEmails/delete|Removes existing Email associated with a Notification|
|/service/notifications/recipientUsers/read|Get Recipient Users associated with the Notification|
|/service/notifications/recipientUsers/write|Add User to the Notification Recipients|
|/service/notifications/recipientUsers/delete|Removes User associated to the Notification Recipients|
|/service/openidConnectProviders/read|Get list of OpenID Connect providers or Get details of OpenID Connect Provider|
|/service/openidConnectProviders/write|Create a new OpenID Connect Provider or Update details of an existing OpenID Connect Provider|
|/service/openidConnectProviders/delete|Remove existing OpenID Connect Provider|
|/service/policySnippets/read|Get all policy snippets|
|/service/policies/read|Get policies for Tenant or Get policy configuration details for Tenant|
|/service/policies/write|Set policy configuration details for Tenant|
|/service/policies/delete|Remove policy configuration from Tenant policies|
|/service/certificates/read|Get list of certificates or Get details of certificate|
|/service/certificates/write|Add new certificate|
|/service/certificates/delete|Remove existing certificate|
|/service/templates/read|Gets all email templates or Gets API Management email template details|
|/service/templates/write|Create or update API Management email template or Updates API Management email template|
|/service/templates/delete|Reset default API Management email template|
|/service/apisByTags/read|Get list of API/Tag associations|
|/service/api-version-sets/read|Get list of version group entities or Gets details of a VersionSet|
|/service/api-version-sets/write|Create new VersionSet or Update existing VersionSet details|
|/service/api-version-sets/delete|Remove existing VersionSet|
|/service/api-version-sets/versions/read|Get list of version entities|
|/service/tagResources/read|Get list of Tags with associated Resources|
|/service/properties/read|Gets list of all properties or Gets details of specified property|
|/service/properties/write|Creates a new property or Updates value for specified property|
|/service/properties/delete|Removes existing property|
|/service/groups/read|Get list of groups or Gets details of a group|
|/service/groups/write|Create new group or Update existing group details|
|/service/groups/delete|Remove existing group|
|/service/groups/users/read|Get list of group users|
|/service/groups/users/write|Add existing user to existing group|
|/service/groups/users/delete|Remove existing user from existing group|
|/service/tags/read|Get list of Tags or Get details of Tag|
|/service/tags/write|Add new Tag or Update existing Tag details|
|/service/tags/delete|Remove existing Tag|
|/service/authorizationServers/read|Get list of authorization servers or Get details of authorization server|
|/service/authorizationServers/write|Create a new authorization server or Update details of an existing authorization server|
|/service/authorizationServers/delete|Remove existing authorization server|
|/service/diagnostics/read|Get list of diagnostics or Get details of diagnostic|
|/service/diagnostics/write|Add new diagnostic or Update existing diagnostic details|
|/service/diagnostics/delete|Remove existing diagnostic|
|/service/diagnostics/loggers/read|Get list of existing Diagnostic loggers|
|/service/diagnostics/loggers/write|Map logger to a diagnostic setting|
|/service/diagnostics/loggers/delete|Remove mapping of a logger with a diagnostic setting|
|/service/quotas/read|Get values for quota|
|/service/quotas/write|Set quota counter current value|
|/service/quotas/periods/read|Get quota counter value for period|
|/service/quotas/periods/write|Set quota counter current value|
|/service/reports/read|Get report aggregated by time periods or Get report aggregated by geographical region or Get report aggregated by developers. or Get report aggregated by products. or Get report aggregated by APIs or Get report aggregated by operations or Get report aggregated by subscription. or Get requests reporting data|
|/service/locations/networkstatus/read|Gets the network access status of resources on which the service depends on in the location.|
|/service/portalsettings/read|Get Sign Up Settings for the Portal or Get Sign In Settings for the Portal or Get Delegation Settings for the Portal|
|/service/portalsettings/write|Update Sign Up settings or Update Sign Up settings or Update Sign In settings or Update Sign In settings or Update Delegation settings or Update Delegation settings|
|/operations/read|Read all API operations available for Microsoft.ApiManagement resource|
|/reports/read|Get reports aggregated by time periods, geographical region, developers, products, APIs, operations, subscription and byRequest.|

## Microsoft.Authorization

| Operation | Description |
|---|---|
|/elevateAccess/action|Grants the caller User Access Administrator access at the tenant scope|
|/checkAccess/action|Checks if the caller is authorized to perform a particular action|
|/classicAdministrators/read|Reads the administrators for the subscription.|
|/classicAdministrators/write|Add or modify administrator to a subscription.|
|/classicAdministrators/delete|Removes the administrator from the subscription.|
|/locks/read|Gets locks at the specified scope.|
|/locks/write|Add locks at the specified scope.|
|/locks/delete|Delete locks at the specified scope.|
|/policyAssignments/read|Get information about a policy assignment.|
|/policyAssignments/write|Create a policy assignment at the specified scope.|
|/policyAssignments/delete|Delete a policy assignment at the specified scope.|
|/permissions/read|Lists all the permissions the caller has at a given scope.|
|/roleDefinitions/read|Get information about a role definition.|
|/roleDefinitions/write|Create or update a custom role definition with specified permissions and assignable scopes.|
|/roleDefinitions/delete|Delete the specified custom role definition.|
|/providerOperations/read|Get operations for all resource providers which can be used in role definitions.|
|/policyDefinitions/read|Get information about a policy definition.|
|/policyDefinitions/write|Create a custom policy definition.|
|/policyDefinitions/delete|Delete a policy definition.|
|/roleAssignments/read|Get information about a role assignment.|
|/roleAssignments/write|Create a role assignment at the specified scope.|
|/roleAssignments/delete|Delete a role assignment at the specified scope.|
|/policySetDefinitions/read|Get information about a policy set definition.|
|/policySetDefinitions/write|Create a custom policy set definition.|
|/policySetDefinitions/delete|Delete a policy set definition.|

## Microsoft.Automation

| Operation | Description |
|---|---|
|/automationAccounts/read|Gets an Azure Automation account|
|/automationAccounts/write|Creates or updates an Azure Automation account|
|/automationAccounts/write|Creates or updates an Azure Automation account|
|/automationAccounts/delete|Deletes an Azure Automation account|
|/automationAccounts/agentRegistrationInformation/read|Read an Azure Automation DSC's registration information|
|/automationAccounts/agentRegistrationInformation/regenerateKey/action|Writes a request to regenerate Azure Automation DSC keys|
|/automationAccounts/providers/Microsoft.Insights/metricDefinitions/read|Gets Automation Metric Definitions|
|/automationAccounts/configurations/read|Gets an Azure Automation DSC's content|
|/automationAccounts/configurations/getCount/action|Reads the count of an Azure Automation DSC's content|
|/automationAccounts/configurations/write|Writes an Azure Automation DSC's content|
|/automationAccounts/configurations/delete|Deletes an Azure Automation DSC's content|
|/automationAccounts/hybridRunbookWorkerGroups/read|Reads Hybrid Runbook Worker Resources|
|/automationAccounts/hybridRunbookWorkerGroups/delete|Deletes Hybrid Runbook Worker Resources|
|/automationAccounts/watchers/streams/read|Gets an Azure Automation watcher job stream|
|/automationAccounts/jobSchedules/read|Gets an Azure Automation job schedule|
|/automationAccounts/jobSchedules/write|Creates an Azure Automation job schedule|
|/automationAccounts/jobSchedules/delete|Deletes an Azure Automation job schedule|
|/automationAccounts/nodeConfigurations/readContent/action|Reads an Azure Automation DSC's node configuration content|
|/automationAccounts/nodeConfigurations/read|Reads an Azure Automation DSC's node configuration|
|/automationAccounts/nodeConfigurations/write|Writes an Azure Automation DSC's node configuration|
|/automationAccounts/nodeConfigurations/delete|Deletes an Azure Automation DSC's node configuration|
|/automationAccounts/compilationjobs/write|Writes an Azure Automation DSC's Compilation|
|/automationAccounts/compilationjobs/read|Reads an Azure Automation DSC's Compilation|
|/automationAccounts/connectionTypes/read|Gets an Azure Automation connection type asset|
|/automationAccounts/connectionTypes/write|Creates an Azure Automation connection type asset|
|/automationAccounts/connectionTypes/delete|Deletes an Azure Automation connection type asset|
|/automationAccounts/diagnosticSettings/read|Gets the diagnostic setting for the resource|
|/automationAccounts/diagnosticSettings/write|Sets the diagnostic setting for the resource|
|/automationAccounts/modules/read|Gets an Azure Automation module|
|/automationAccounts/modules/write|Creates or updates an Azure Automation module|
|/automationAccounts/modules/delete|Deletes an Azure Automation module|
|/automationAccounts/modules/activities/read|Gets Azure Automation Activities|
|/automationAccounts/usages/read|Gets Azure Automation Usage|
|/automationAccounts/credentials/read|Gets an Azure Automation credential asset|
|/automationAccounts/credentials/write|Creates or updates an Azure Automation credential asset|
|/automationAccounts/credentials/delete|Deletes an Azure Automation credential asset|
|/automationAccounts/certificates/read|Gets an Azure Automation certificate asset|
|/automationAccounts/certificates/write|Creates or updates an Azure Automation certificate asset|
|/automationAccounts/certificates/delete|Deletes an Azure Automation certificate asset|
|/automationAccounts/statistics/read|Gets Azure Automation Statistics|
|/automationAccounts/objectDataTypes/fields/read|Gets Azure Automation TypeFields|
|/automationAccounts/logDefinitions/read|Gets the available logs for the automation account|
|/automationAccounts/nodes/read|Reads Azure Automation DSC nodes|
|/automationAccounts/nodes/delete|Deletes Azure Automation DSC nodes|
|/automationAccounts/nodes/reports/read|Reads Azure Automation DSC report contentss|
|/automationAccounts/nodes/reports/read|Reads Azure Automation DSC reports|
|/automationAccounts/schedules/read|Gets an Azure Automation schedule asset|
|/automationAccounts/schedules/write|Creates or updates an Azure Automation schedule asset|
|/automationAccounts/schedules/delete|Deletes an Azure Automation schedule asset|
|/automationAccounts/jobs/runbookContent/action|Gets the content of the Azure Automation runbook at the time of the job execution|
|/automationAccounts/jobs/output/action|Gets the output of a job|
|/automationAccounts/jobs/read|Gets an Azure Automation job|
|/automationAccounts/jobs/write|Creates an Azure Automation job|
|/automationAccounts/jobs/stop/action|Stops an Azure Automation job|
|/automationAccounts/jobs/suspend/action|Suspends an Azure Automation job|
|/automationAccounts/jobs/resume/action|Resumes an Azure Automation job|
|/automationAccounts/jobs/runbookContent/action|Gets the content of the Azure Automation runbook at the time of the job execution|
|/automationAccounts/jobs/output/action|Gets the output of a job|
|/automationAccounts/jobs/read|Gets an Azure Automation job|
|/automationAccounts/jobs/write|Creates an Azure Automation job|
|/automationAccounts/jobs/stop/action|Stops an Azure Automation job|
|/automationAccounts/jobs/suspend/action|Suspends an Azure Automation job|
|/automationAccounts/jobs/resume/action|Resumes an Azure Automation job|
|/automationAccounts/jobs/streams/read|Gets an Azure Automation job stream|
|/automationAccounts/jobs/streams/read|Gets an Azure Automation job stream|
|/automationAccounts/connections/read|Gets an Azure Automation connection asset|
|/automationAccounts/connections/write|Creates or updates an Azure Automation connection asset|
|/automationAccounts/connections/delete|Deletes an Azure Automation connection asset|
|/automationAccounts/variables/read|Reads an Azure Automation variable asset|
|/automationAccounts/variables/write|Creates or updates an Azure Automation variable asset|
|/automationAccounts/variables/delete|Deletes an Azure Automation variable asset|
|/automationAccounts/linkedWorkspace/read|Gets the workspace linked to the automation account|
|/automationAccounts/runbooks/readContent/action|Gets the content of an Azure Automation runbook|
|/automationAccounts/runbooks/read|Gets an Azure Automation runbook|
|/automationAccounts/runbooks/write|Creates or updates an Azure Automation runbook|
|/automationAccounts/runbooks/delete|Deletes an Azure Automation runbook|
|/automationAccounts/runbooks/draft/readContent/action|Gets the content of an Azure Automation runbook draft|
|/automationAccounts/runbooks/draft/writeContent/action|Creates the content of an Azure Automation runbook draft|
|/automationAccounts/runbooks/draft/read|Gets an Azure Automation runbook draft|
|/automationAccounts/runbooks/draft/publish/action|Publishes an Azure Automation runbook draft|
|/automationAccounts/runbooks/draft/undoEdit/action|Undo edits to an Azure Automation runbook draft|
|/automationAccounts/runbooks/draft/testJob/read|Gets an Azure Automation runbook draft test job|
|/automationAccounts/runbooks/draft/testJob/write|Creates an Azure Automation runbook draft test job|
|/automationAccounts/runbooks/draft/testJob/stop/action|Stops an Azure Automation runbook draft test job|
|/automationAccounts/runbooks/draft/testJob/suspend/action|Suspends an Azure Automation runbook draft test job|
|/automationAccounts/runbooks/draft/testJob/resume/action|Resumes an Azure Automation runbook draft test job|
|/automationAccounts/webhooks/read|Reads an Azure Automation webhook|
|/automationAccounts/webhooks/write|Creates or updates an Azure Automation webhook|
|/automationAccounts/webhooks/delete|Deletes an Azure Automation webhook |
|/automationAccounts/webhooks/generateUri/action|Generates a URI for an Azure Automation webhook|

## Microsoft.AzureActiveDirectory

| Operation | Description |
|---|---|
|/register/action|Register subscription for Microsoft.AzureActiveDirectory resource provider|
|/b2cDirectories/write|Create or update B2C Dictory resource|
|/b2cDirectories/read|View B2C Directory resource|
|/b2cDirectories/delete|Delete B2C Directory resource|
|/operations/read|Read all API operations available for Microsoft.AzureActiveDirectory resource provider|

## Microsoft.AzureStack

| Operation | Description |
|---|---|
|/register/action|Registers Subscription with Microsoft.AzureStack resource provider|
|/Operations/read|Gets the properties of a resource provider operation|
|/registrations/read|Gets the properties of an Azure Stack registration|
|/registrations/write|Creates or updates an Azure Stack registration|
|/registrations/delete|Deletes an Azure Stack registration|
|/registrations/getActivationKey/action|Gets the latest Azure Stack activation key|
|/registrations/products/read|Gets the properties of an Azure Stack Marketplace product|
|/registrations/products/listDetails/action|Retrieves extended details for an Azure Stack Marketplace product|
|/registrations/customerSubscriptions/read|Gets the properties of an Azure Stack Customer Subscription|
|/registrations/customerSubscriptions/write|Creates or updates an Azure Stack Customer Subscription|
|/registrations/customerSubscriptions/delete|Deletes an Azure Stack Customer Subscription|

## Microsoft.Batch

| Operation | Description |
|---|---|
|/register/action|Registers the subscription for the Batch Resource Provider and enables the creation of Batch accounts|
|/unregister/action|Unregisters the subscription for the Batch Resource Provider preventing the creation of Batch accounts|
|/batchAccounts/write|Creates a new Batch account or updates an existing Batch account|
|/batchAccounts/read|Lists Batch accounts or gets the properties of a Batch account|
|/batchAccounts/delete|Deletes a Batch account|
|/batchAccounts/listkeys/action|Lists access keys for a Batch account|
|/batchAccounts/regeneratekeys/action|Regenerates access keys for a Batch account|
|/batchAccounts/syncAutoStorageKeys/action|Synchronizes access keys for the auto storage account configured for a Batch account|
|/batchAccounts/operationResults/read|Gets the results of a long running Batch account operation|
|/batchAccounts/providers/Microsoft.Insights/metricDefinitions/read|Gets the available metrics for the Batch service|
|/batchAccounts/providers/Microsoft.Insights/diagnosticSettings/read|Gets the diagnostic setting for the resource|
|/batchAccounts/providers/Microsoft.Insights/diagnosticSettings/write|Creates or updates the diagnostic setting for the resource|
|/batchAccounts/providers/Microsoft.Insights/logDefinitions/read|Gets the available logs for the Batch service|
|/batchAccounts/poolOperationResults/read|Gets the results of a long running pool operation on a Batch account|
|/batchAccounts/applications/read|Lists applications or gets the properties of an application|
|/batchAccounts/applications/write|Creates a new application or updates an existing application|
|/batchAccounts/applications/delete|Deletes an application|
|/batchAccounts/applications/versions/read|Gets the properties of an application package|
|/batchAccounts/applications/versions/write|Creates a new application package or updates an existing application package|
|/batchAccounts/applications/versions/activate/action|Activates an application package|
|/batchAccounts/applications/versions/delete|Deletes an application package|
|/batchAccounts/pools/read|Lists pools on a Batch account or gets the properties of a pool|
|/batchAccounts/pools/write|Creates a new pool on a Batch account or updates an existing pool|
|/batchAccounts/pools/delete|Deletes a pool from a Batch account|
|/batchAccounts/pools/stopResize/action|Stops an ongoing resize operation on a Batch account pool|
|/batchAccounts/pools/disableAutoscale/action|Disables automatic scaling for a Batch account pool|
|/batchAccounts/pools/upgradeOs/action|Upgrades the operating system of a Batch account pool|
|/batchAccounts/certificates/read|Lists certificates on a Batch account or gets the properties of a certificate|
|/batchAccounts/certificates/write|Creates a new certificate on a Batch account or updates an existing certificate|
|/batchAccounts/certificates/delete|Deletes a certificate from a Batch account|
|/batchAccounts/certificates/cancelDelete/action|Cancels the failed deletion of a certificate on a Batch account|
|/batchAccounts/certificateOperationResults/read|Gets the results of a long running certificate operation on a Batch account|
|/locations/checkNameAvailability/action|Checks that the account name is valid and not in use.|
|/locations/quotas/read|Gets Batch quotas of the specified subscription at the specified Azure region|

## Microsoft.BatchAI

| Operation | Description |
|---|---|
|/register/action|Registers the subscription for the Batch AI Resource Provider and enables the creation of Batch AI resources|
|/clusters/read|Lists Batch AI clusters or gets the properties of a Batch AI cluster|
|/clusters/write|Creates a new Batch AI cluster or updates an existing Batch AI cluster|
|/clusters/delete|Deletes a Batch AI cluster|
|/clusters/remoteLoginInformation/action|Lists remote-login information for a Batch AI cluster|
|/jobs/read|Lists Batch AI jobs or gets the properties of a Batch AI job|
|/jobs/write|Creates a new Batch AI job or updates an existing Batch AI job|
|/jobs/delete|Deletes a Batch AI job|
|/jobs/terminate/action|Terminates a Batch AI job|
|/jobs/remoteLoginInformation/action|Lists remote-login information for a Batch AI job|
|/fileservers/read|Lists Batch AI fileservers or gets the properties of a Batch AI fileserver|
|/fileservers/write|Creates a new Batch AI fileserver or updates an existing Batch AI fileserver|
|/fileservers/delete|Deletes a Batch AI fileserver|
|/fileservers/suspend/action|Suspends a Batch AI fileserver|
|/fileservers/resume/action|Resumes a Batch AI fileserver|

## Microsoft.Billing

| Operation | Description |
|---|---|
|/billingPeriods/read|Lists available billing periods|
|/invoices/read|Lists available invoices|

## Microsoft.BingMaps

| Operation | Description |
|---|---|
|/mapApis/Read|Read Operation|
|/mapApis/Write|Write Operation|
|/mapApis/Delete|Delete Operation|
|/mapApis/regenerateKey/action|Regenerates the Key|
|/mapApis/listSecrets/action|List the Secrets|
|/mapApis/listSingleSignOnToken/action|Read Single Sign On Authorization Token For The Resource|
|/Operations/read|Description of the operation.|

## Microsoft.Cache

| Operation | Description |
|---|---|
|/checknameavailability/action|Checks if a name is available for use with a new Redis Cache|
|/register/action|Registers the 'Microsoft.Cache' resource provider with a subscription|
|/unregister/action|Unregisters the 'Microsoft.Cache' resource provider with a subscription|
|/redis/write|Modify the Redis Cache's settings and configuration in the management portal|
|/redis/read|View the Redis Cache's settings and configuration in the management portal|
|/redis/delete|Delete the entire Redis Cache|
|/redis/listKeys/action|View the value of Redis Cache access keys in the management portal|
|/redis/regenerateKey/action|Change the value of Redis Cache access keys in the management portal|
|/redis/import/action|Import data of a specified format from multiple blobs into Redis|
|/redis/export/action|Export Redis data to prefixed storage blobs in specified format|
|/redis/forceReboot/action|Force reboot a cache instance, potentially with data loss.|
|/redis/stop/action|Stop a cache instance.|
|/redis/start/action|Start a cache instance.|
|/redis/metricDefinitions/read|Gets the available metrics for a Redis Cache|
|/redis/firewallRules/read|Get the IP firewall rules of a Redis Cache|
|/redis/firewallRules/write|Edit the IP firewall rules of a Redis Cache|
|/redis/firewallRules/delete|Delete IP firewall rules of a Redis Cache|
|/redis/listUpgradeNotifications/read|List the latest Upgrade Notifications for the cache tenant.|
|/redis/linkedservers/read|Get Linked Servers associated with a redis cache.|
|/redis/linkedservers/write|Add Linked Server to a Redis Cache|
|/redis/linkedservers/delete|Delete Linked Server from a Redis Cache|
|/redis/patchSchedules/read|Gets the patching schedule of a Redis Cache|
|/redis/patchSchedules/write|Modify the patching schedule of a Redis Cache|
|/redis/patchSchedules/delete|Delete the patch schedule of a Redis Cache|
|/redis/locations/operationresults/read|Gets the result of a long running operation for which the 'Location' header was previously returned to the client|
|/operations/read|Lists the operations that 'Microsoft.Cache' provider supports.|

## Microsoft.Capacity

| Operation | Description |
|---|---|
|/reservationorders/action|Update any Reservation|
|/register/action|Registers the Capacity resource provider and enables the creation of Capacity resources.|
|/reservationorders/read|Read All Reservations|
|/reservationorders/write|Create any Reservation|
|/reservationorders/delete|Delete any Reservation|
|/reservationorders/reservations/action|Update any Reservation|
|/reservationorders/reservations/read|Read All Reservations|
|/reservationorders/reservations/write|Create any Reservation|
|/reservationorders/reservations/delete|Delete any Reservation|
|/reservationorders/reservations/revisions/read|Read All Reservations|

## Microsoft.Cdn

| Operation | Description |
|---|---|
|/register/action|Registers the subscription for the CDN resource provider and enables the creation of CDN profiles.|
|/CheckNameAvailability/action||
|/ValidateProbe/action||
|/CheckResourceUsage/action||
|/operationresults/read||
|/operationresults/write||
|/operationresults/delete||
|/operationresults/profileresults/read||
|/operationresults/profileresults/write||
|/operationresults/profileresults/delete||
|/operationresults/profileresults/CheckResourceUsage/action||
|/operationresults/profileresults/GenerateSsoUri/action||
|/operationresults/profileresults/GetSupportedOptimizationTypes/action||
|/operationresults/profileresults/endpointresults/read||
|/operationresults/profileresults/endpointresults/write||
|/operationresults/profileresults/endpointresults/delete||
|/operationresults/profileresults/endpointresults/CheckResourceUsage/action||
|/operationresults/profileresults/endpointresults/Start/action||
|/operationresults/profileresults/endpointresults/Stop/action||
|/operationresults/profileresults/endpointresults/Purge/action||
|/operationresults/profileresults/endpointresults/Load/action||
|/operationresults/profileresults/endpointresults/ValidateCustomDomain/action||
|/operationresults/profileresults/endpointresults/customdomainresults/read||
|/operationresults/profileresults/endpointresults/customdomainresults/write||
|/operationresults/profileresults/endpointresults/customdomainresults/delete||
|/operationresults/profileresults/endpointresults/customdomainresults/DisableCustomHttps/action||
|/operationresults/profileresults/endpointresults/customdomainresults/EnableCustomHttps/action||
|/operationresults/profileresults/endpointresults/originresults/read||
|/operationresults/profileresults/endpointresults/originresults/write||
|/operationresults/profileresults/endpointresults/originresults/delete||
|/profiles/read||
|/profiles/write||
|/profiles/delete||
|/profiles/CheckResourceUsage/action||
|/profiles/GenerateSsoUri/action||
|/profiles/GetSupportedOptimizationTypes/action||
|/profiles/endpoints/read||
|/profiles/endpoints/write||
|/profiles/endpoints/delete||
|/profiles/endpoints/CheckResourceUsage/action||
|/profiles/endpoints/Start/action||
|/profiles/endpoints/Stop/action||
|/profiles/endpoints/Purge/action||
|/profiles/endpoints/Load/action||
|/profiles/endpoints/ValidateCustomDomain/action||
|/profiles/endpoints/providers/Microsoft.Insights/diagnosticSettings/read|Gets the diagnostic settings for the resource|
|/profiles/endpoints/providers/Microsoft.Insights/diagnosticSettings/write|Creates or updates the diagnostic settings for the resource|
|/profiles/endpoints/providers/Microsoft.Insights/logDefinitions/read|Gets the available logs for Microsoft.Cdn|
|/profiles/endpoints/customdomains/read||
|/profiles/endpoints/customdomains/write||
|/profiles/endpoints/customdomains/delete||
|/profiles/endpoints/customdomains/DisableCustomHttps/action||
|/profiles/endpoints/customdomains/EnableCustomHttps/action||
|/profiles/endpoints/origins/read||
|/profiles/endpoints/origins/write||
|/profiles/endpoints/origins/delete||
|/operations/read||
|/edgenodes/read||
|/edgenodes/write||
|/edgenodes/delete||

## Microsoft.CertificateRegistration

| Operation | Description |
|---|---|
|/provisionGlobalAppServicePrincipalInUserTenant/Action|Provision service principal for service app principal|
|/validateCertificateRegistrationInformation/Action|Validate certificate purchase object without submitting it|
|/register/action|Register the Microsoft Certificates resource provider for the subscription|
|/certificateOrders/Write|Add a new certificateOrder or update an existing one|
|/certificateOrders/Delete|Delete an existing AppServiceCertificate|
|/certificateOrders/Read|Get the list of CertificateOrders|
|/certificateOrders/reissue/Action|Reissue an existing certificateorder|
|/certificateOrders/renew/Action|Renew an existing certificateorder|
|/certificateOrders/retrieveCertificateActions/Action|Retrieve the list of certificate actions|
|/certificateOrders/retrieveEmailHistory/Action|Retrieve certificate email history|
|/certificateOrders/resendEmail/Action|Resend certificate email|
|/certificateOrders/verifyDomainOwnership/Action|Verify domain ownership|
|/certificateOrders/resendRequestEmails/Action|Resend request emails to another email address|
|/certificateOrders/resendRequestEmails/Action|Retrieve site seal for an issued App Service Certificate|
|/certificateOrders/certificates/Write|Add a new certificate or update an existing one|
|/certificateOrders/certificates/Delete|Delete an existing certificate|
|/certificateOrders/certificates/Read|Get the list of certificates|
|/certificateOrders/operations/Read|List all operations from app service certificate registration|

## Microsoft.ClassicCompute

| Operation | Description |
|---|---|
|/register/action|Register to Classic Compute|
|/checkDomainNameAvailability/action|Checks the availability of a given domain name.|
|/moveSubscriptionResources/action|Move all classic resources to a different subscription.|
|/validateSubscriptionMoveAvailability/action|Validate the subscription's availability for classic move operation.|
|/operatingSystemFamilies/read|Lists the guest operating system families available in Microsoft Azure, and also lists the operating system versions available for each family.|
|/capabilities/read|Shows the capabilities|
|/operatingSystems/read|Lists the versions of the guest operating system that are currently available in Microsoft Azure.|
|/resourceTypes/skus/read|Gets the Sku list for supported resource types.|
|/domainNames/read|Return the domain names for resources.|
|/domainNames/write|Add or modify the domain names for resources.|
|/domainNames/delete|Remove the domain names for resources.|
|/domainNames/swap/action|Swaps the staging slot to the production slot.|
|/domainNames/serviceCertificates/read|Returns the service certificates used.|
|/domainNames/serviceCertificates/write|Add or modify the service certificates used.|
|/domainNames/serviceCertificates/delete|Delete the service certificates used.|
|/domainNames/serviceCertificates/operationStatuses/read|Reads the operation status for the domain names service certificates.|
|/domainNames/capabilities/read|Shows the domain name capabilities|
|/domainNames/extensions/read|Returns the domain name extensions.|
|/domainNames/extensions/write|Add the domain name extensions.|
|/domainNames/extensions/delete|Remove the domain name extensions.|
|/domainNames/extensions/operationStatuses/read|Reads the operation status for the domain names extensions.|
|/domainNames/active/write|Sets the active domain name.|
|/domainNames/slots/read|Shows the deployment slots.|
|/domainNames/slots/write|Creates or update the deployment.|
|/domainNames/slots/delete|Deletes a given deployment slot.|
|/domainNames/slots/start/action|Starts a deployment slot.|
|/domainNames/slots/stop/action|Suspends the deployment slot.|
|/domainNames/slots/operationStatuses/read|Reads the operation status for the domain names slots.|
|/domainNames/slots/roles/read|Get the role for the deployment slot.|
|/domainNames/slots/roles/providers/Microsoft.Insights/metricDefinitions/read|Gets the metrics definitions.|
|/domainNames/slots/roles/providers/Microsoft.Insights/diagnosticSettings/read|Get the diagnostics settings.|
|/domainNames/slots/roles/providers/Microsoft.Insights/diagnosticSettings/write|Add or modify diagnostics settings.|
|/domainNames/slots/roles/extensionReferences/read|Returns the extension reference for the deployment slot role.|
|/domainNames/slots/roles/extensionReferences/write|Add or modify the extension reference for the deployment slot role.|
|/domainNames/slots/roles/extensionReferences/delete|Remove the extension reference for the deployment slot role.|
|/domainNames/slots/roles/extensionReferences/operationStatuses/read|Reads the operation status for the domain names slots roles extension references.|
|/domainNames/slots/roles/roleInstances/read|Get the role instance.|
|/domainNames/slots/roles/roleInstances/restart/action|Restarts role instances.|
|/domainNames/slots/roles/roleInstances/reimage/action|Reimages the role instance.|
|/domainNames/slots/roles/roleInstances/rebuild/action|Rebuilds the role instance.|
|/domainNames/slots/roles/roleInstances/operationStatuses/read|Reads the operation status for the domain names slots roles role instances.|
|/domainNames/slots/state/start/write|Changes the deployment slot state to stopped.|
|/domainNames/slots/state/stop/write|Changes the deployment slot state to started.|
|/domainNames/slots/upgradeDomain/write|Walk upgrade the domain.|
|/domainNames/internalLoadBalancers/read|Gets the internal load balancers.|
|/domainNames/internalLoadBalancers/write|Creates a new internal load balance.|
|/domainNames/internalLoadBalancers/delete|Remove a new internal load balance.|
|/domainNames/internalLoadBalancers/operationStatuses/read|Reads the operation status for the domain names internal load balancers.|
|/domainNames/loadBalancedEndpointSets/read|Shows the load balanced endpoint sets|
|/domainNames/loadBalancedEndpointSets/operationStatuses/read|Reads the operation status for the domain names load balanced endpoint sets.|
|/domainNames/availabilitySets/read|Show the availability set for the resource.|
|/quotas/read|Get the quota for the subscription.|
|/virtualMachines/read|Retrieves list of virtual machines.|
|/virtualMachines/write|Add or modify virtual machines.|
|/virtualMachines/delete|Removes virtual machines.|
|/virtualMachines/start/action|Start the virtual machine.|
|/virtualMachines/redeploy/action|Redeploys the virtual machine.|
|/virtualMachines/performMaintenance/action|Performs maintenance on the virtual machine.|
|/virtualMachines/restart/action|Restarts virtual machines.|
|/virtualMachines/stop/action|Stops the virtual machine.|
|/virtualMachines/shutdown/action|Shutdown the virtual machine.|
|/virtualMachines/attachDisk/action|Attaches a data disk to a virtual machine.|
|/virtualMachines/detachDisk/action|Detaches a data disk from virtual machine.|
|/virtualMachines/downloadRemoteDesktopConnectionFile/action|Downloads the RDP file for virtual machine.|
|/virtualMachines/networkInterfaces/associatedNetworkSecurityGroups/read|Gets the network security group associated with the network interface.|
|/virtualMachines/networkInterfaces/associatedNetworkSecurityGroups/write|Adds a network security group associated with the network interface.|
|/virtualMachines/networkInterfaces/associatedNetworkSecurityGroups/delete|Deletes the network security group associated with the network interface.|
|/virtualMachines/networkInterfaces/associatedNetworkSecurityGroups/operationStatuses/read|Reads the operation status for the virtual machines associated network security groups.|
|/virtualMachines/providers/Microsoft.Insights/metricDefinitions/read|Gets the metrics definitions.|
|/virtualMachines/providers/Microsoft.Insights/diagnosticSettings/read|Get the diagnostics settings.|
|/virtualMachines/providers/Microsoft.Insights/diagnosticSettings/write|Add or modify diagnostics settings.|
|/virtualMachines/metrics/read|Gets the metrics.|
|/virtualMachines/operationStatuses/read|Reads the operation status for the virtual machines.|
|/virtualMachines/extensions/read|Gets the virtual machine extension.|
|/virtualMachines/extensions/write|Puts the virtual machine extension.|
|/virtualMachines/extensions/operationStatuses/read|Reads the operation status for the virtual machines extensions.|
|/virtualMachines/asyncOperations/read|Gets the possible async operations|
|/virtualMachines/disks/read|Retrives list of data disks|
|/virtualMachines/associatedNetworkSecurityGroups/read|Gets the network security group associated with the virtual machine.|
|/virtualMachines/associatedNetworkSecurityGroups/write|Adds a network security group associated with the virtual machine.|
|/virtualMachines/associatedNetworkSecurityGroups/delete|Deletes the network security group associated with the virtual machine.|
|/virtualMachines/associatedNetworkSecurityGroups/operationStatuses/read|Reads the operation status for the virtual machines associated network security groups.|

## Microsoft.ClassicNetwork

| Operation | Description |
|---|---|
|/register/action|Register to Classic Network|
|/gatewaySupportedDevices/read|Retrieves the list of supported devices.|
|/reservedIps/read|Gets the reserved Ips|
|/reservedIps/write|Add a new reserved Ip|
|/reservedIps/delete|Delete a reserved Ip.|
|/reservedIps/link/action|Link a reserved Ip|
|/reservedIps/join/action|Join a reserved Ip|
|/reservedIps/operationStatuses/read|Reads the operation status for the reserved ips.|
|/virtualNetworks/read|Get the virtual network.|
|/virtualNetworks/write|Add a new virtual network.|
|/virtualNetworks/delete|Deletes the virtual network.|
|/virtualNetworks/peer/action|Peers a virtual network with another virtual network.|
|/virtualNetworks/join/action|Joins the virtual network.|
|/virtualNetworks/checkIPAddressAvailability/action|Checks the availability of a given IP address in a virtual network.|
|/virtualNetworks/capabilities/read|Shows the capabilities|
|/virtualNetworks/subnets/associatedNetworkSecurityGroups/read|Gets the network security group associated with the subnet.|
|/virtualNetworks/subnets/associatedNetworkSecurityGroups/write|Adds a network security group associated with the subnet.|
|/virtualNetworks/subnets/associatedNetworkSecurityGroups/delete|Deletes the network security group associated with the subnet.|
|/virtualNetworks/subnets/associatedNetworkSecurityGroups/operationStatuses/read|Reads the operation status for the virtual network subnet associeted network security group.|
|/virtualNetworks/operationStatuses/read|Reads the operation status for the virtual networks.|
|/virtualNetworks/gateways/read|Gets the virtual network gateways.|
|/virtualNetworks/gateways/write|Adds a virtual network gateway.|
|/virtualNetworks/gateways/delete|Deletes the virtual network gateway.|
|/virtualNetworks/gateways/startDiagnostics/action|Starts diagnositic for the virtual network gateway.|
|/virtualNetworks/gateways/stopDiagnostics/action|Stops the diagnositic for the virtual network gateway.|
|/virtualNetworks/gateways/downloadDiagnostics/action|Downloads the gateway diagnostics.|
|/virtualNetworks/gateways/listCircuitServiceKey/action|Retrieves the circuit service key.|
|/virtualNetworks/gateways/downloadDeviceConfigurationScript/action|Downloads the device configuration script.|
|/virtualNetworks/gateways/listPackage/action|Lists the virtual network gateway package.|
|/virtualNetworks/gateways/operationStatuses/read|Reads the operation status for the virtual networks gateways.|
|/virtualNetworks/gateways/packages/read|Gets the virtual network gateway package.|
|/virtualNetworks/gateways/connections/read|Retrieves the list of connections.|
|/virtualNetworks/gateways/connections/connect/action|Connects a site to site gateway connection.|
|/virtualNetworks/gateways/connections/disconnect/action|Disconnects a site to site gateway connection.|
|/virtualNetworks/gateways/connections/test/action|Tests a site to site gateway connection.|
|/virtualNetworks/gateways/clientRevokedCertificates/read|Read the revoked client certificates.|
|/virtualNetworks/gateways/clientRevokedCertificates/write|Revokes a client certificate.|
|/virtualNetworks/gateways/clientRevokedCertificates/delete|Unrevokes a client certificate.|
|/virtualNetworks/gateways/clientRootCertificates/read|Find the client root certificates.|
|/virtualNetworks/gateways/clientRootCertificates/write|Uploads a new client root certificate.|
|/virtualNetworks/gateways/clientRootCertificates/delete|Deletes the virtual network gateway client certificate.|
|/virtualNetworks/gateways/clientRootCertificates/download/action|Downloads certificate by thumbprint.|
|/virtualNetworks/gateways/clientRootCertificates/listPackage/action|Lists the virtual network gateway certificate package.|
|/networkSecurityGroups/read|Gets the network security group.|
|/networkSecurityGroups/write|Adds a new network security group.|
|/networkSecurityGroups/delete|Deletes the network security group.|
|/networkSecurityGroups/operationStatuses/read|Reads the operation status for the network security group.|
|/networkSecurityGroups/securityRules/read|Gets the security rule.|
|/networkSecurityGroups/securityRules/write|Adds or update a security rule.|
|/networkSecurityGroups/securityRules/delete|Deletes the security rule.|
|/networkSecurityGroups/securityRules/operationStatuses/read|Reads the operation status for the network security group security rules.|
|/quotas/read|Get the quota for the subscription.|

## Microsoft.ClassicStorage

| Operation | Description |
|---|---|
|/register/action|Register to Classic Storage|
|/checkStorageAccountAvailability/action|Checks for the availability of a storage account.|
|/capabilities/read|Shows the capabilities|
|/publicImages/read|Gets the public virtual machine image.|
|/images/read|Returns the image.|
|/storageAccounts/read|Return the storage account with the given account.|
|/storageAccounts/write|Adds a new storage account.|
|/storageAccounts/delete|Delete the storage account.|
|/storageAccounts/listKeys/action|Lists the access keys for the storage accounts.|
|/storageAccounts/regenerateKey/action|Regenerates the existing access keys for the storage account.|
|/storageAccounts/operationStatuses/read|Reads the operation status for the resource.|
|/storageAccounts/images/read|Returns the storage account image.|
|/storageAccounts/images/delete|Deletes a given storage account image.|
|/storageAccounts/disks/read|Returns the storage account disk.|
|/storageAccounts/disks/write|Adds a storage account disk.|
|/storageAccounts/disks/delete|Deletes a given storage account  disk.|
|/storageAccounts/disks/operationStatuses/read|Reads the operation status for the resource.|
|/storageAccounts/osImages/read|Returns the storage account operating system image.|
|/storageAccounts/osImages/delete|Deletes a given storage account operating system image.|
|/storageAccounts/services/read|Get the available services.|
|/storageAccounts/services/metricDefinitions/read|Gets the metrics definitions.|
|/storageAccounts/services/metrics/read|Gets the metrics.|
|/storageAccounts/services/diagnosticSettings/read|Get the diagnostics settings.|
|/storageAccounts/services/diagnosticSettings/write|Add or modify diagnostics settings.|
|/disks/read|Returns the storage account disk.|
|/osImages/read|Returns the operating system image.|
|/quotas/read|Get the quota for the subscription.|

## Microsoft.CognitiveServices

| Operation | Description |
|---|---|
|/register/action|Registers Subscription for Cognitive Services|
|/accounts/read|Reads API accounts.|
|/accounts/write|Writes API Accounts.|
|/accounts/delete|Deletes API accounts|
|/accounts/listKeys/action|List Keys|
|/accounts/regenerateKey/action|Regenerate Key|
|/accounts/providers/Microsoft.Insights/metricDefinitions/read|Gets the available metrics for Cognitive Services.|
|/accounts/providers/Microsoft.Insights/diagnosticSettings/read|Gets the diagnostic setting for the resource.|
|/accounts/providers/Microsoft.Insights/diagnosticSettings/write|Creates or updates the diagnostic setting for the resource.|
|/accounts/skus/read|Reads available SKUs for an existing resource.|
|/accounts/usages/read|Get the quota usage for an existing resource.|
|/skus/read|Reads available SKUs for Cognitive Services.|
|/Operations/read|List all available operations|
|/locations/checkSkuAvailability/action|Reads avaible SKUs for an subscription.|

## Microsoft.Commerce

| Operation | Description |
|---|---|
|/RateCard/read|Returns offer data, resource/meter metadata and rates for the given subscription.|
|/UsageAggregates/read|Retrieves Microsoft Azure’s consumption  by a subscription. The result contains aggregates usage data, subscription and resource related information, on a particular time range.|

## Microsoft.Compute

| Operation | Description |
|---|---|
|/register/action|Registers Subscription with Microsoft.Compute resource provider|
|/sharedVMImages/read|Get the properties of a SharedVMImage|
|/sharedVMImages/write|Creates a new SharedVMImage or updates an existing one|
|/sharedVMImages/delete|Deletes the SharedVMImage|
|/sharedVMImages/versions/read|Get the properties of a SharedVMImageVersion|
|/sharedVMImages/versions/write|Create a new SharedVMImageVersion or update an existing one|
|/sharedVMImages/versions/delete|Delete a SharedVMImageVersion|
|/sharedVMImages/versions/replicate/action|Replicate a SharedVMImageVersion to target regions|
|/restorePointCollections/read|Get the properties of a restore point collection|
|/restorePointCollections/write|Creates a new restore point collection or updates an existing one|
|/restorePointCollections/delete|Deletes the restore point collection and contained restore points|
|/restorePointCollections/restorePoints/read|Get the properties of a restore point|
|/restorePointCollections/restorePoints/write|Creates a new restore point|
|/restorePointCollections/restorePoints/delete|Deletes the restore point|
|/restorePointCollections/restorePoints/retrieveSasUris/action|Get the properties of a restore point along with blob SAS URIs|
|/virtualMachineScaleSets/read|Get the properties of a Virtual Machine Scale Set|
|/virtualMachineScaleSets/write|Creates a new Virtual Machine Scale Set or updates an existing one|
|/virtualMachineScaleSets/delete|Deletes the Virtual Machine Scale Set|
|/virtualMachineScaleSets/delete/action|Deletes the instances of the Virtual Machine Scale Set|
|/virtualMachineScaleSets/start/action|Starts the instances of the Virtual Machine Scale Set|
|/virtualMachineScaleSets/powerOff/action|Powers off the instances of the Virtual Machine Scale Set|
|/virtualMachineScaleSets/restart/action|Restarts the instances of the Virtual Machine Scale Set|
|/virtualMachineScaleSets/deallocate/action|Powers off and releases the compute resources for the instances of the Virtual Machine Scale Set |
|/virtualMachineScaleSets/manualUpgrade/action|Manually updates instances to latest model of the Virtual Machine Scale Set|
|/virtualMachineScaleSets/reimage/action|Reimages the instances of the Virtual Machine Scale Set|
|/virtualMachineScaleSets/redeploy/action|Redeploy the instances of the Virtual Machine Scale Set|
|/virtualMachineScaleSets/performMaintenance/action|Performs planned maintenance on the instances of the Virtual Machine Scale Set|
|/virtualMachineScaleSets/scale/action|Verify if an existing Virtual Machine Scale Set can Scale In/Scale Out to specified instance count|
|/virtualMachineScaleSets/forceRecoveryServiceFabricPlatformUpdateDomainWalk/action|Manually walk the platform update domains of a service fabric Virtual Machine Scale Set to finish a pending update that is stuck|
|/virtualMachineScaleSets/networkInterfaces/read|Get properties of all network interfaces of a Virtual Machine Scale Set|
|/virtualMachineScaleSets/publicIPAddresses/read|Get properties of all public IP addresses of a Virtual Machine Scale Set|
|/virtualMachineScaleSets/providers/Microsoft.Insights/metricDefinitions/read|Reads Virtual Machine Scalet Set Metric Definitions|
|/virtualMachineScaleSets/instanceView/read|Gets the instance view of the Virtual Machine Scale Set|
|/virtualMachineScaleSets/osUpgradeHistory/read|Gets the history of OS upgrades for a Virtual Machine Scale Set|
|/virtualMachineScaleSets/extensions/read|Gets the properties of a Virtual Machine Scale Set Extension|
|/virtualMachineScaleSets/extensions/write|Creates a new Virtual Machine Scale Set Extension or updates an existing one|
|/virtualMachineScaleSets/extensions/delete|Deletes the Virtual Machine Scale Set Extension|
|/virtualMachineScaleSets/skus/read|Lists the valid SKUs for an existing Virtual Machine Scale Set|
|/virtualMachineScaleSets/rollingUpgrades/read|Get latest Rolling Upgrade status for a Virtual Machine Scale Set|
|/virtualMachineScaleSets/rollingUpgrades/cancel/action|Cancels the rolling upgrade of a Virtual Machine Scale Set|
|/virtualMachineScaleSets/virtualMachines/read|Retrieves the properties of a Virtual Machine in a VM Scale Set|
|/virtualMachineScaleSets/virtualMachines/write|Updates the properties of a Virtual Machine in a VM Scale Set|
|/virtualMachineScaleSets/virtualMachines/delete|Delete a specific Virtual Machine in a VM Scale Set.|
|/virtualMachineScaleSets/virtualMachines/start/action|Starts a Virtual Machine instance in a VM Scale Set.|
|/virtualMachineScaleSets/virtualMachines/powerOff/action|Powers Off a Virtual Machine instance in a VM Scale Set.|
|/virtualMachineScaleSets/virtualMachines/restart/action|Restarts a Virtual Machine instance in a VM Scale Set.|
|/virtualMachineScaleSets/virtualMachines/deallocate/action|Powers off and releases the compute resources for a Virtual Machine in a VM Scale Set.|
|/virtualMachineScaleSets/virtualMachines/reimage/action|Reimages a Virtual Machine instance in a Virtual Machine Scale Set.|
|/virtualMachineScaleSets/virtualMachines/redeploy/action|Redeploys a Virtual Machine instance in a Virtual Machine Scale Set|
|/virtualMachineScaleSets/virtualMachines/performMaintenance/action|Performs planned maintenance on a Virtual Machine instance in a Virtual Machine Scale Set|
|/virtualMachineScaleSets/virtualMachines/networkInterfaces/read|Get properties of one or all network interfaces of a virtual machine created using Virtual Machine Scale Set|
|/virtualMachineScaleSets/virtualMachines/networkInterfaces/ipConfigurations/read|Get properties of one or all IP configurations of a network interface created using Virtual Machine Scale Set. IP configurations represent private IPs|
|/virtualMachineScaleSets/virtualMachines/networkInterfaces/ipConfigurations/publicIPAddresses/read|Get properties of public IP address created using Virtual Machine Scale Set. Virtual Machine Scale Set can create at most one public IP per ipconfiguration (private IP)|
|/virtualMachineScaleSets/virtualMachines/providers/Microsoft.Insights/metricDefinitions/read|Reads Virtual Machine in Scale Set Metric Definitions|
|/virtualMachineScaleSets/virtualMachines/instanceView/read|Retrieves the instance view of a Virtual Machine in a VM Scale Set.|
|/images/read|Get the properties of the Image|
|/images/write|Creates a new Image or updates an existing one|
|/images/delete|Deletes the image|
|/skus/read|Gets the list of Microsoft.Compute SKUs available for your Subscription|
|/operations/read|Lists operations available on Microsoft.Compute resource provider|
|/disks/read|Get the properties of a Disk|
|/disks/write|Creates a new Disk or updates an existing one|
|/disks/delete|Deletes the Disk|
|/disks/beginGetAccess/action|Get the SAS URI of the Disk for blob access|
|/disks/endGetAccess/action|Revoke the SAS URI of the Disk|
|/snapshots/read|Get the properties of a Snapshot|
|/snapshots/write|Create a new Snapshot or update an existing one|
|/snapshots/delete|Delete a Snapshot|
|/snapshots/beginGetAccess/action|Get the SAS URI of the Snapshot for blob access|
|/snapshots/endGetAccess/action|Revoke the SAS URI of the Snapshot|
|/availabilitySets/read|Get the properties of an availability set|
|/availabilitySets/write|Creates a new availability set or updates an existing one|
|/availabilitySets/delete|Deletes the availability set|
|/availabilitySets/vmSizes/read|List available sizes for creating or updating a virtual machine in the availability set|
|/virtualMachines/read|Get the properties of a virtual machine|
|/virtualMachines/write|Creates a new virtual machine or updates an existing virtual machine|
|/virtualMachines/delete|Deletes the virtual machine|
|/virtualMachines/start/action|Starts the virtual machine|
|/virtualMachines/powerOff/action|Powers off the virtual machine. Note that the virtual machine will continue to be billed.|
|/virtualMachines/redeploy/action|Redeploys virtual machine|
|/virtualMachines/restart/action|Restarts the virtual machine|
|/virtualMachines/deallocate/action|Powers off the virtual machine and releases the compute resources|
|/virtualMachines/generalize/action|Sets the virtual machine state to Generalized and prepares the virtual machine for capture|
|/virtualMachines/capture/action|Captures the virtual machine by copying virtual hard disks and generates a template that can be used to create similar virtual machines|
|/virtualMachines/runCommand/action|Executes a predefined script on the virtual machine|
|/virtualMachines/convertToManagedDisks/action|Converts the blob based disks of the virtual machine to managed disks|
|/virtualMachines/performMaintenance/action|Performs Maintenance Operation on the VM.|
|/virtualMachines/reimage/action|Reimages virtual machine which is using differencing disk.|
|/virtualMachines/providers/Microsoft.Insights/metricDefinitions/read|Reads Virtual Machine Metric Definitions|
|/virtualMachines/vmSizes/read|Lists available sizes the virtual machine can be updated to|
|/virtualMachines/instanceView/read|Gets the detailed runtime status of the virtual machine and its resources|
|/virtualMachines/extensions/read|Get the properties of a virtual machine extension|
|/virtualMachines/extensions/write|Creates a new virtual machine extension or updates an existing one|
|/virtualMachines/extensions/delete|Deletes the virtual machine extension|
|/locations/vmSizes/read|Lists available virtual machine sizes in a location|
|/locations/capsOperations/read|Gets the status of an asynchronous Caps operation|
|/locations/runCommands/read|Lists available run commands in location|
|/locations/diskOperations/read|Gets the status of an asynchronous Disk operation|
|/locations/usages/read|Gets service limits and current usage quantities for the subscription's compute resources in a location|
|/locations/operations/read|Gets the status of an asynchronous operation|
|/locations/publishers/read|Get the properties of a Publisher|
|/locations/publishers/artifacttypes/offers/read|Get the properties of a Platform Image Offer|
|/locations/publishers/artifacttypes/offers/skus/read|Get the properties of a Platform Image Sku|
|/locations/publishers/artifacttypes/offers/skus/versions/read|Get the properties of a Platform Image Version|
|/locations/publishers/artifacttypes/types/read|Get the properties of a VMExtension Type|
|/locations/publishers/artifacttypes/types/versions/read|Get the properties of a VMExtension Version|

## Microsoft.Consumption

| Operation | Description |
|---|---|
|/reservationSummaries/read|List the utilization summary for reserved instances by reservation order or managment groups. The summary data is either at monthly or daily level.|
|/usageDetails/read|List the usage details for a scope for EA and WebDirect subscriptions.|
|/balances/read|List the utilization summary for a billing period for a management group.|
|/operations/read|List all supported operations by Microsoft.Consumption resource provider.|
|/terms/read|List the terms for a subscription or a management group.|
|/marketplaces/read|List the marketplace resource usage details for a scope for EA and WebDirect subscriptions.|
|/pricesheets/read|List the Pricesheets data for a subscription or a management group.|
|/reservationTransactions/read|List the transaction history for reserved instances by management groups.|
|/budgets/read|List the budgets by a subscription or a management group.|
|/budgets/write|Creates, update and delete the budgets by a subscription or a management group.|
|/reservationDetails/read|List the utilization details for reserved instances by reservation order or managment groups. The details data is per instance per day level.|

## Microsoft.ContainerInstance

| Operation | Description |
|---|---|
|/containerGroups/read|Get all container goups.|
|/containerGroups/write|Create or update a specific container group.|
|/containerGroups/delete|Delete the specific container group.|
|/containerGroups/providers/Microsoft.Insights/metricDefinitions/read|Gets the available metrics for container group.|
|/containerGroups/providers/Microsoft.Insights/diagnosticSettings/read|Gets the diagnostic setting for the container group.|
|/containerGroups/providers/Microsoft.Insights/diagnosticSettings/write|Creates or updates the diagnostic setting for the container group.|
|/containerGroups/containers/logs/read|Get logs for a specific container.|

## Microsoft.ContainerRegistry

| Operation | Description |
|---|---|
|/register/action|Registers the subscription for the container registry resource provider and enables the creation of container registries.|
|/checkNameAvailability/read|Checks whether the container registry name is available for use.|
|/registries/read|Gets the properties of the specified container registry or lists all the container registries under the specified resource group or subscription.|
|/registries/write|Creates or updates a container registry with the specified parameters.|
|/registries/delete|Deletes a container registry.|
|/registries/listCredentials/action|Lists the login credentials for the specified container registry.|
|/registries/regenerateCredential/action|Regenerates one of the login credentials for the specified container registry.|
|/registries/operationStatuses/read|Gets a registry async operation status|
|/registries/replications/read|Gets the properties of the specified replication or lists all the replications for the specified container registry.|
|/registries/replications/write|Creates or updates a replication for a container registry with the specified parameters.|
|/registries/replications/delete|Deletes a replication from a container registry.|
|/registries/replications/operationStatuses/read|Gets a replication async operation status|
|/registries/listUsages/read|Lists the quota usages for the specified container registry.|
|/registries/eventGridFilters/read|Gets the properties of the specified event grid filter or lists all the event grid filters for the specified container registry.|
|/registries/eventGridFilters/write|Creates or updates an event grid filter for a container registry with the specified parameters.|
|/registries/eventGridFilters/delete|Deletes an event grid filter from a container registry.|
|/registries/webhooks/read|Gets the properties of the specified webhook or lists all the webhooks for the specified container registry.|
|/registries/webhooks/write|Creates or updates a webhook for a container registry with the specified parameters.|
|/registries/webhooks/delete|Deletes a webhook from a container registry.|
|/registries/webhooks/getCallbackConfig/action|Gets the configuration of service URI and custom headers for the webhook.|
|/registries/webhooks/ping/action|Triggers a ping event to be sent to the webhook.|
|/registries/webhooks/listEvents/action|Lists recent events for the specified webhook.|
|/registries/webhooks/operationStatuses/read|Gets a webhook async operation status|
|/operations/read|Lists all of the available Azure Container Registry REST API operations|
|/locations/operationResults/read|Gets an async operation result|

## Microsoft.ContainerService

| Operation | Description |
|---|---|
|/containerServices/read|Gets the specified Container Service|
|/containerServices/write|Puts or Updates the specified Container Service|
|/containerServices/delete|Deletes the specified Container Service|

## Microsoft.ContentModerator

| Operation | Description |
|---|---|
|/updateCommunicationPreference/action|Update communication preference|
|/listCommunicationPreference/action|List communication preference|
|/applications/read|Read Operation|
|/applications/write|Write Operation|
|/applications/write|Write Operation|
|/applications/delete|Delete Operation|
|/applications/listSecrets/action|List Secrets|
|/applications/listSingleSignOnToken/action|Read Single Sign On Tokens|
|/operations/read|read operations|

## Microsoft.CustomerInsights

| Operation | Description |
|---|---|
|/register/action|Registers the subscription for the Customer Insights resource provider and enables the creation of Customer Insights resources|
|/unregister/action|Unregisters the subscription for the Customer Insights resource provider|
|/hubs/read|Read any Azure Customer Insights Hub|
|/hubs/write|Create or Update any Azure Customer Insights Hub|
|/hubs/delete|Delete any Azure Customer Insights Hub|
|/hubs/suggesttypeschema/action|Generate Suggest Type Schema from sample data|
|/hubs/crmmetadata/action|Create or Update any Azure Customer Insights Crm Metadata|
|/hubs/adobemetadata/action|Create or Update any Azure Customer Insights Adobe Metadata|
|/hubs/salesforcemetadata/action|Create or Update any Azure Customer Insights SalesForce Metadata|
|/hubs/msemetadata/action|Create or Update any Azure Customer Insights Mse Metadata|
|/hubs/operationresults/read|Get Azure Customer Insights Hub Operation Results|
|/hubs/gdpr/read|Read any Azure Customer Insights Gdpr|
|/hubs/gdpr/write|Create or Update any Azure Customer Insights Gdpr|
|/hubs/gdpr/delete|Delete any Azure Customer Insights Gdpr|
|/hubs/predictions/read|Read any Azure Customer Insights Predictions|
|/hubs/predictions/write|Create or Update any Azure Customer Predictions|
|/hubs/predictions/delete|Delete any Azure Customer Insights Predictions|
|/hubs/predictions/operations/read|Read any Azure Customer Insights Predictions operation result|
|/hubs/providers/Microsoft.Insights/metricDefinitions/read|Gets the available metrics for resource|
|/hubs/providers/Microsoft.Insights/diagnosticSettings/read|Gets the diagnostic setting for the resource|
|/hubs/providers/Microsoft.Insights/diagnosticSettings/write|Creates or updates the diagnostic setting for the resource|
|/hubs/providers/Microsoft.Insights/logDefinitions/read|Gets the available logs for resource|
|/hubs/authorizationPolicies/read|Read any Azure Customer Insights Shared Access Signature Policy|
|/hubs/authorizationPolicies/write|Create or Update any Azure Customer Insights Shared Access Signature Policy|
|/hubs/authorizationPolicies/delete|Delete any Azure Customer Insights Shared Access Signature Policy|
|/hubs/authorizationPolicies/regeneratePrimaryKey/action|Regenerate Azure Customer Insights Shared Access Signature Policy primary key|
|/hubs/authorizationPolicies/regenerateSecondaryKey/action|Regenerate Azure Customer Insights Shared Access Signature Policy secondary key|
|/hubs/profiles/read|Read any Azure Customer Insights Profile|
|/hubs/profiles/write|Write any Azure Customer Insights Profile|
|/hubs/profiles/delete|Delete any Azure Customer Insights Profile|
|/hubs/profiles/operations/read|Read any Azure Customer Insights Profile operation result|
|/hubs/getbillingcredits/read|Get Azure Customer Insights Hub Billing Credits|
|/hubs/salesforcemetadata/read|Read any Azure Customer Insights SalesForce Metadata|
|/hubs/getbillinghistory/read|Get Azure Customer Insights Hub Billing History|
|/hubs/crmmetadata/read|Read any Azure Customer Insights Crm Metadata|
|/hubs/kpi/read|Read any Azure Customer Insights Key Performance Indicator|
|/hubs/kpi/write|Create or Update any Azure Customer Insights Key Performance Indicator|
|/hubs/kpi/delete|Delete any Azure Customer Insights Key Performance Indicator|
|/hubs/kpi/reprocess/action|Reprocess any Azure Customer Insights Key Performance Indicators|
|/hubs/kpi/operations/read|Read any Azure Customer Insights Key Performance Indicators operation result|
|/hubs/roles/read|Read any Azure Customer Insights Rbac Roles|
|/hubs/views/read|Read any Azure Customer Insights App View|
|/hubs/views/write|Create or Update any Azure Customer Insights App View|
|/hubs/views/delete|Delete any Azure Customer Insights App View|
|/hubs/images/read|Read any Azure Customer Insights Image|
|/hubs/images/write|Create or Update any Azure Customer Insights Image|
|/hubs/images/delete|Delete any Azure Customer Insights Image|
|/hubs/tenantmanagement/read|Manage any Azure Customer Insights hub settings|
|/hubs/interactions/read|Read any Azure Customer Insights Interaction|
|/hubs/interactions/write|Create or Update any Azure Customer Insights Interaction|
|/hubs/interactions/delete|Delete any azure Customer Insights Interactions|
|/hubs/interactions/suggestrelationshiplinks/action|Suggest RelationShip Links for any Azure Customer Insights Interactions|
|/hubs/interactions/operations/read|Read any Azure Customer Insights Interaction operation result|
|/hubs/widgettypes/read|Read any Azure Customer Insights App Widget Types|
|/hubs/predictivematchpolicies/read|Read any Azure Customer Insights Predictive Match Policies|
|/hubs/predictivematchpolicies/write|Create or Update any Azure Customer Insights Predictive Match Policies|
|/hubs/predictivematchpolicies/delete|Delete any Azure Customer Insights Predictive Match Policies|
|/hubs/predictivematchpolicies/operations/read|Read any Azure Customer Insights Predictive Match Policies operation result|
|/hubs/msemetadata/read|Read any Azure Customer Insights Mse Metadata|
|/hubs/roleAssignments/read|Read any Azure Customer Insights Rbac Assignment|
|/hubs/roleAssignments/write|Create or Update any Azure Customer Insights Rbac Assignment|
|/hubs/roleAssignments/delete|Delete any Azure Customer Insights Rbac Assignment|
|/hubs/roleAssignments/operations/read|Read any Azure Customer Insights Rbac Assignment operation result|
|/hubs/links/read|Read any Azure Customer Insights Links|
|/hubs/links/write|Create or Update any Azure Customer Links|
|/hubs/links/delete|Delete any Azure Customer Insights Links|
|/hubs/links/operations/read|Read any Azure Customer Insights Links operation result|
|/hubs/connectors/read|Read any Azure Customer Insights Connector|
|/hubs/connectors/write|Create or Update any Azure Customer Insights Connector|
|/hubs/connectors/delete|Delete any Azure Customer Insights Connector|
|/hubs/connectors/update/action|Update any Azure Customer Insights Connector|
|/hubs/connectors/activate/action|Activate any Azure Customer Insights Connector|
|/hubs/connectors/activate/action|Activate any Azure Customer Insights Connector|
|/hubs/connectors/getruntimestatus/action|Get any Azure Customer Insights Connector runtime status|
|/hubs/connectors/saveauthinfo/action|Create or Update any Azure Customer Insights Connector Authentication Infomation|
|/hubs/connectors/mappings/read|Read any Azure Customer Insights Connector Mapping|
|/hubs/connectors/mappings/write|Create or Update any Azure Customer Insights Connector Mapping|
|/hubs/connectors/mappings/delete|Delete any Azure Customer Insights Connector Mapping|
|/hubs/connectors/mappings/activate/action|Activate any Azure Customer Insights Connector Mapping|
|/hubs/connectors/mappings/operations/read|Read any Azure Customer Insights Connector Mapping operation result|
|/hubs/connectors/operations/read|Read any Azure Customer Insights Connector operation result|
|/hubs/sqlconnectionstrings/read|Read any Azure Customer Insights SqlConnectionStrings|
|/hubs/sqlconnectionstrings/write|Create or Update any Azure Customer Insights SqlConnectionStrings|
|/hubs/sqlconnectionstrings/delete|Delete any Azure Customer Insights SqlConnectionStrings|
|/hubs/adobemetadata/read|Read any Azure Customer Insights Adobe Metadata|
|/hubs/relationships/read|Read any Azure Customer Insights Relationships|
|/hubs/relationships/write|Create or Update any Azure Customer Insights Relationships|
|/hubs/relationships/delete|Delete any Azure Customer Insights Relationships|
|/hubs/relationships/operations/read|Read any Azure Customer Insights Relationships operation result|
|/hubs/relationshiplinks/read|Read any Azure Customer Insights Relationship Links|
|/hubs/relationshiplinks/write|Create or Update any Azure Customer Insights Relationship Links|
|/hubs/relationshiplinks/delete|Delete any Azure Customer Insights Relationship Links|
|/hubs/relationshiplinks/operations/read|Read any Azure Customer Insights Relationship Links operation result|
|/hubs/segments/read|Read any Azure Customer Insights Segments|
|/hubs/segments/write|Create or Update any Azure Customer Insights Segments|
|/hubs/segments/delete|Delete any Azure Customer Insights Segments|
|/hubs/segments/dynamic/action|Management any Azure Customer Insight Dynamic Segments|
|/hubs/segments/static/action|Management any Azure Customer Insight Static Segments|
|/operations/read|Read Azure Customer Insights Api Metadatas|

## Microsoft.DataCatalog

| Operation | Description |
|---|---|
|/checkNameAvailability/action|Checks catalog name availability for tenant.|
|/register/action|Registers subscription with Microsoft.DataCatalog resource provider.|
|/unregister/action|Unregisters subscription from Microsoft.DataCatalog resource provider.|
|/operations/read|Lists operations available on Microsoft.DataCatalog resource provider.|
|/catalogs/read|Get properties for catalog or catalogs under subscription or resource group.|
|/catalogs/write|Creates catalog or updates the tags and properties for the catalog.|
|/catalogs/delete|Deletes the catalog.|

## Microsoft.DataFactory

| Operation | Description |
|---|---|
|/datafactories/providers/Microsoft.Insights/metricDefinitions/read|Gets the available metrics for datafactories|
|/datafactories/providers/Microsoft.Insights/diagnosticSettings/read|Gets the diagnostic setting for the resource|
|/datafactories/providers/Microsoft.Insights/diagnosticSettings/write|Creates or updates the diagnostic setting for the resource|
|/factories/providers/Microsoft.Insights/metricDefinitions/read|Gets the available metrics for factories|
|/factories/providers/Microsoft.Insights/diagnosticSettings/read|Gets the diagnostic setting for the resource|
|/factories/providers/Microsoft.Insights/diagnosticSettings/write|Creates or updates the diagnostic setting for the resource|
|/factories/providers/Microsoft.Insights/logDefinitions/read|Gets the available logs for factories|

## Microsoft.DataLakeAnalytics

| Operation | Description |
|---|---|
|/register/action|Register subscription to DataLakeAnalytics.|
|/accounts/read|Get information about an existing DataLakeAnalytics account.|
|/accounts/write|Create or update a DataLakeAnalytics account.|
|/accounts/delete|Delete a DataLakeAnalytics account.|
|/accounts/TakeOwnership/action|Grant permissions to cancel jobs submitted by other users.|
|/accounts/operationResults/read|Get result of a DataLakeAnalytics account operation.|
|/accounts/providers/Microsoft.Insights/metricDefinitions/read|Get the available metrics for the DataLakeAnalytics account.|
|/accounts/providers/Microsoft.Insights/diagnosticSettings/read|Get the diagnostic settings for the DataLakeAnalytics account.|
|/accounts/providers/Microsoft.Insights/diagnosticSettings/write|Create or update the diagnostic settings for the DataLakeAnalytics account.|
|/accounts/providers/Microsoft.Insights/logDefinitions/read|Get the available logs for the DataLakeAnalytics account.|
|/accounts/firewallRules/read|Get information about a firewall rule.|
|/accounts/firewallRules/write|Create or update a firewall rule.|
|/accounts/firewallRules/delete|Delete a firewall rule.|
|/accounts/storageAccounts/read|Get information about a linked Storage account of a DataLakeAnalytics account.|
|/accounts/storageAccounts/write|Create or update a linked Storage account of a DataLakeAnalytics account.|
|/accounts/storageAccounts/delete|Unlink a Storage account from a DataLakeAnalytics account.|
|/accounts/storageAccounts/Containers/read|Get containers of a linked Storage account of a DataLakeAnalytics account.|
|/accounts/storageAccounts/Containers/listSasTokens/action|List SAS tokens for storage containers of a linked Storage account of a DataLakeAnalytics account.|
|/accounts/dataLakeStoreAccounts/read|Get information about a linked DataLakeStore account of a DataLakeAnalytics account.|
|/accounts/dataLakeStoreAccounts/write|Create or update a linked DataLakeStore account of a DataLakeAnalytics account.|
|/accounts/dataLakeStoreAccounts/delete|Unlink a DataLakeStore account from a DataLakeAnalytics account.|
|/accounts/computePolicies/read|Get information about a compute policy.|
|/accounts/computePolicies/write|Create or update a compute policy.|
|/accounts/computePolicies/delete|Delete a compute policy.|
|/operations/read|Get available operations of DataLakeAnalytics.|
|/locations/checkNameAvailability/action|Check availability of a DataLakeAnalytics account name.|
|/locations/operationResults/read|Get result of a DataLakeAnalytics account operation.|
|/locations/capability/read|Get capability information of a subscription regarding using DataLakeAnalytics.|

## Microsoft.DataLakeStore

| Operation | Description |
|---|---|
|/register/action|Register subscription to DataLakeStore.|
|/accounts/read|Get information about an existing DataLakeStore account.|
|/accounts/write|Create or update a DataLakeStore account.|
|/accounts/delete|Delete a DataLakeStore account.|
|/accounts/enableKeyVault/action|Enable KeyVault for a DataLakeStore account.|
|/accounts/Superuser/action|Grant Superuser on Data Lake Store when granted with Microsoft.Authorization/roleAssignments/write.|
|/accounts/operationResults/read|Get result of a DataLakeStore account operation.|
|/accounts/providers/Microsoft.Insights/metricDefinitions/read|Get the available metrics for the DataLakeStore account.|
|/accounts/providers/Microsoft.Insights/diagnosticSettings/read|Get the diagnostic settings for the DataLakeStore account.|
|/accounts/providers/Microsoft.Insights/diagnosticSettings/write|Create or update the diagnostic settings for the DataLakeStore account.|
|/accounts/providers/Microsoft.Insights/logDefinitions/read|Get the available logs for the DataLakeStore account.|
|/accounts/firewallRules/read|Get information about a firewall rule.|
|/accounts/firewallRules/write|Create or update a firewall rule.|
|/accounts/firewallRules/delete|Delete a firewall rule.|
|/accounts/trustedIdProviders/read|Get information about a trusted identity provider.|
|/accounts/trustedIdProviders/write|Create or update a trusted identity provider.|
|/accounts/trustedIdProviders/delete|Delete a trusted identity provider.|
|/operations/read|Get available operations of DataLakeStore.|
|/locations/checkNameAvailability/action|Check availability of a DataLakeStore account name.|
|/locations/operationResults/read|Get result of a DataLakeStore account operation.|
|/locations/capability/read|Get capability information of a subscription regarding using DataLakeStore.|

## Microsoft.DBforMySQL

| Operation | Description |
|---|---|
|/servers/read|Return the list of servers or gets the properties for the specified server.|
|/servers/write|Creates a server with the specified parameters or update the properties or tags for the specified server.|
|/servers/delete|Deletes an existing server.|
|/servers/providers/Microsoft.Insights/metricDefinitions/read|Return types of metrics that are available for databases|
|/servers/providers/Microsoft.Insights/diagnosticSettings/read|Gets the disagnostic setting for the resource|
|/servers/providers/Microsoft.Insights/diagnosticSettings/write|Creates or updates the diagnostic setting for the resource|
|/servers/firewallRules/read|Return the list of firewall rules for a server or gets the properties for the specified firewall rule.|
|/servers/firewallRules/write|Creates a firewall rule with the specified parameters or update an existing rule.|
|/servers/firewallRules/delete|Deletes an existing firewall rule.|
|/servers/recoverableServers/read|Return the recoverable MySQL Server info|
|/servers/virtualNetworkRules/read|Return the list of virtual network rules or gets the properties for the specified virtual network rule.|
|/servers/virtualNetworkRules/write|Creates a virtual network rule with the specified parameters or update the properties or tags for the specified virtual network rule.|
|/servers/virtualNetworkRules/delete|Deletes an existing Virtual Network Rule|
|/performanceTiers/read|Returns the list of Performance Tiers available.|
|/locations/performanceTiers/read|Returns the list of Performance Tiers available.|

## Microsoft.DBforPostgreSQL

| Operation | Description |
|---|---|
|/servers/read|Return the list of servers or gets the properties for the specified server.|
|/servers/write|Creates a server with the specified parameters or update the properties or tags for the specified server.|
|/servers/delete|Deletes an existing server.|
|/servers/providers/Microsoft.Insights/metricDefinitions/read|Return types of metrics that are available for databases|
|/servers/providers/Microsoft.Insights/diagnosticSettings/read|Gets the disagnostic setting for the resource|
|/servers/providers/Microsoft.Insights/diagnosticSettings/write|Creates or updates the diagnostic setting for the resource|
|/servers/providers/Microsoft.Insights/logDefinitions/read|Return types of logs that are available for databases|
|/servers/firewallRules/read|Return the list of firewall rules for a server or gets the properties for the specified firewall rule.|
|/servers/firewallRules/write|Creates a firewall rule with the specified parameters or update an existing rule.|
|/servers/firewallRules/delete|Deletes an existing firewall rule.|
|/servers/recoverableServers/read|Return the recoverable PostgreSQL Server info|
|/servers/virtualNetworkRules/read|Return the list of virtual network rules or gets the properties for the specified virtual network rule.|
|/servers/virtualNetworkRules/write|Creates a virtual network rule with the specified parameters or update the properties or tags for the specified virtual network rule.|
|/servers/virtualNetworkRules/delete|Deletes an existing Virtual Network Rule|
|/performanceTiers/read|Returns the list of Performance Tiers available.|
|/locations/performanceTiers/read|Returns the list of Performance Tiers available.|

## Microsoft.Devices

| Operation | Description |
|---|---|
|/register/action|Register the subscription for the IotHub resource provider and enables the creation of IotHub resources|
|/checkNameAvailability/Action|Check If IotHub name is available|
|/checkProvisioningServiceNameAvailability/Action|Check If IotHub name is available|
|/register/action|Register the subscription for the IotHub resource provider and enables the creation of IotHub resources|
|/ElasticPools/metricDefinitions/read|Gets the available metrics for the IotHub service|
|/elasticPools/iotHubTenants/Write|Create or Update the IotHub tenant resource|
|/elasticPools/iotHubTenants/Read|Gets the IotHub tenant resource|
|/elasticPools/iotHubTenants/Delete|Delete the IotHub tenant resource|
|/elasticPools/iotHubTenants/listKeys/Action|Gets IotHub tenant keys|
|/elasticPools/iotHubTenants/exportDevices/Action|Export Devices|
|/elasticPools/iotHubTenants/importDevices/Action|Import Devices|
|/ElasticPools/IotHubTenants/metricDefinitions/read|Gets the available metrics for the IotHub service|
|/elasticPools/iotHubTenants/iotHubKeys/listkeys/Action|Gets the IotHub tenant key|
|/elasticPools/iotHubTenants/quotaMetrics/Read|Get Quota Metrics|
|/elasticPools/iotHubTenants/eventHubEndpoints/consumerGroups/Write|Create EventHub Consumer Group|
|/elasticPools/iotHubTenants/eventHubEndpoints/consumerGroups/Read|Get EventHub Consumer Group(s)|
|/elasticPools/iotHubTenants/eventHubEndpoints/consumerGroups/Delete|Delete EventHub Consumer Group|
|/elasticPools/iotHubTenants/routing/routes/$testall/Action|Test a message against all existing Routes|
|/elasticPools/iotHubTenants/routing/routes/$testnew/Action|Test a message against a provided test Route|
|/ElasticPools/IotHubTenants/diagnosticSettings/read|Gets the diagnostic setting for the resource|
|/ElasticPools/IotHubTenants/diagnosticSettings/write|Creates or updates the diagnostic setting for the resource|
|/ElasticPools/IotHubTenants/logDefinitions/read|Gets the available log definitions for the IotHub Service|
|/elasticPools/iotHubTenants/jobs/Read|Get Job(s) details submitted on given IotHub|
|/elasticPools/iotHubTenants/getStats/Read|Gets the IotHub tenant stats resource|
|/elasticPools/iotHubTenants/routingEndpointsHealth/Read|Gets the health of all routing Endpoints for an IotHub|
|/ElasticPools/diagnosticSettings/read|Gets the diagnostic setting for the resource|
|/ElasticPools/diagnosticSettings/write|Creates or updates the diagnostic setting for the resource|
|/provisioningServices/Read|Get IotDps resource|
|/provisioningServices/Write|Create IotDps resource|
|/provisioningServices/Delete|Delete IotDps resource|
|/provisioningServices/listkeys/Action|Get all IotDps keys|
|/provisioningServices/metricDefinitions/read|Gets the available metrics for the provisioning service|
|/provisioningServices/diagnosticSettings/read|Gets the diagnostic setting for the resource|
|/provisioningServices/diagnosticSettings/write|Creates or updates the diagnostic setting for the resource|
|/provisioningServices/ProvisioningServiceKeys/listkeys/Action|Get IotDps Keys for key name|
|/provisioningServices/skus/Read|Get valid IotDps Skus|
|/provisioningServices/certificates/generateVerificationCode/Action|Generate Verification code|
|/provisioningServices/certificates/verify/Action|Verify Certificate resource|
|/provisioningServices/logDefinitions/read|Gets the available log definitions for the provisioning Service|
|/usages/Read|Get subscription usage details for this provider.|
|/operations/Read|Get All ResourceProvider Operations|
|/iotHubs/Read|Gets the IotHub resource(s)|
|/iotHubs/Write|Create or update IotHub Resource|
|/iotHubs/Delete|Delete IotHub Resource|
|/iotHubs/listkeys/Action|Get all IotHub Keys|
|/iotHubs/exportDevices/Action|Export Devices|
|/iotHubs/importDevices/Action|Import Devices|
|/IotHubs/metricDefinitions/read|Gets the available metrics for the IotHub service|
|/iotHubs/iotHubKeys/listkeys/Action|Get IotHub Key for the given name|
|/iotHubs/iotHubStats/Read|Get IotHub Statistics|
|/iotHubs/quotaMetrics/Read|Get Quota Metrics|
|/iotHubs/eventHubEndpoints/consumerGroups/Write|Create EventHub Consumer Group|
|/iotHubs/eventHubEndpoints/consumerGroups/Read|Get EventHub Consumer Group(s)|
|/iotHubs/eventHubEndpoints/consumerGroups/Delete|Delete EventHub Consumer Group|
|/iotHubs/routing/$testall/Action|Test a message against all existing Routes|
|/iotHubs/routing/$testnew/Action|Test a message against a provided test Route|
|/IotHubs/diagnosticSettings/read|Gets the diagnostic setting for the resource|
|/IotHubs/diagnosticSettings/write|Creates or updates the diagnostic setting for the resource|
|/iotHubs/skus/Read|Get valid IotHub Skus|
|/iotHubs/certificates/generateVerificationCode/Action|Generate Verification code|
|/iotHubs/certificates/verify/Action|Verify Certificate resource|
|/IotHubs/logDefinitions/read|Gets the available log definitions for the IotHub Service|
|/iotHubs/jobs/Read|Get Job(s) details submitted on given IotHub|
|/iotHubs/eventGridFilters/Write|Create new or Update existing Event Grid filter|
|/iotHubs/eventGridFilters/Read|Gets the Event Grid filter|
|/iotHubs/eventGridFilters/Delete|Deletes the Event Grid filter|
|/iotHubs/routingEndpointsHealth/Read|Gets the health of all routing Endpoints for an IotHub|

## Microsoft.DevTestLab

| Operation | Description |
|---|---|
|/register/action|Registers the subscription|
|/labs/delete|Delete labs.|
|/labs/read|Read labs.|
|/labs/write|Add or modify labs.|
|/labs/ListVhds/action|List disk images available for custom image creation.|
|/labs/GenerateUploadUri/action|Generate a URI for uploading custom disk images to a Lab.|
|/labs/CreateEnvironment/action|Create virtual machines in a lab.|
|/labs/ClaimAnyVm/action|Claim a random claimable virtual machine in the lab.|
|/labs/ExportResourceUsage/action|Exports the lab resource usage into a storage account|
|/labs/ImportVirtualMachine/action|Import a virtual machine into a different lab.|
|/labs/users/delete|Delete user profiles.|
|/labs/users/read|Read user profiles.|
|/labs/users/write|Add or modify user profiles.|
|/labs/users/secrets/delete|Delete secrets.|
|/labs/users/secrets/read|Read secrets.|
|/labs/users/secrets/write|Add or modify secrets.|
|/labs/users/environments/delete|Delete environments.|
|/labs/users/environments/read|Read environments.|
|/labs/users/environments/write|Add or modify environments.|
|/labs/users/serviceFabrics/delete|Delete service fabrics.|
|/labs/users/serviceFabrics/read|Read service fabrics.|
|/labs/users/serviceFabrics/write|Add or modify service fabrics.|
|/labs/users/serviceFabrics/Start/action|Start a service fabric.|
|/labs/users/serviceFabrics/Stop/action|Stop a service fabric|
|/labs/users/serviceFabrics/ListApplicableSchedules/action|Lists all applicable schedules|
|/labs/users/serviceFabrics/schedules/delete|Delete schedules.|
|/labs/users/serviceFabrics/schedules/read|Read schedules.|
|/labs/users/serviceFabrics/schedules/write|Add or modify schedules.|
|/labs/users/serviceFabrics/schedules/Execute/action|Execute a schedule.|
|/labs/users/disks/delete|Delete disks.|
|/labs/users/disks/read|Read disks.|
|/labs/users/disks/write|Add or modify disks.|
|/labs/users/disks/Attach/action|Attach and create the lease of the disk to the virtual machine.|
|/labs/users/disks/Detach/action|Detach and break the lease of the disk attached to the virtual machine.|
|/labs/customImages/delete|Delete custom images.|
|/labs/customImages/read|Read custom images.|
|/labs/customImages/write|Add or modify custom images.|
|/labs/serviceRunners/delete|Delete service runners.|
|/labs/serviceRunners/read|Read service runners.|
|/labs/serviceRunners/write|Add or modify service runners.|
|/labs/artifactSources/delete|Delete artifact sources.|
|/labs/artifactSources/read|Read artifact sources.|
|/labs/artifactSources/write|Add or modify artifact sources.|
|/labs/artifactSources/artifacts/read|Read artifacts.|
|/labs/artifactSources/artifacts/GenerateArmTemplate/action|Generates an ARM template for the given artifact, uploads the required files to a storage account, and validates the generated artifact.|
|/labs/artifactSources/armTemplates/read|Read azure resource manager templates.|
|/labs/costs/read|Read costs.|
|/labs/costs/write|Add or modify costs.|
|/labs/virtualNetworks/delete|Delete virtual networks.|
|/labs/virtualNetworks/read|Read virtual networks.|
|/labs/virtualNetworks/write|Add or modify virtual networks.|
|/labs/formulas/delete|Delete formulas.|
|/labs/formulas/read|Read formulas.|
|/labs/formulas/write|Add or modify formulas.|
|/labs/schedules/delete|Delete schedules.|
|/labs/schedules/read|Read schedules.|
|/labs/schedules/write|Add or modify schedules.|
|/labs/schedules/Execute/action|Execute a schedule.|
|/labs/schedules/ListApplicable/action|Lists all applicable schedules|
|/labs/galleryImages/read|Read gallery images.|
|/labs/policySets/EvaluatePolicies/action|Evaluates lab policy.|
|/labs/policySets/policies/delete|Delete policies.|
|/labs/policySets/policies/read|Read policies.|
|/labs/policySets/policies/write|Add or modify policies.|
|/labs/virtualMachines/delete|Delete virtual machines.|
|/labs/virtualMachines/read|Read virtual machines.|
|/labs/virtualMachines/write|Add or modify virtual machines.|
|/labs/virtualMachines/Start/action|Start a virtual machine.|
|/labs/virtualMachines/Stop/action|Stop a virtual machine|
|/labs/virtualMachines/Restart/action|Restart a virtual machine.|
|/labs/virtualMachines/ApplyArtifacts/action|Apply artifacts to virtual machine.|
|/labs/virtualMachines/AddDataDisk/action|Attach a new or existing data disk to virtual machine.|
|/labs/virtualMachines/DetachDataDisk/action|Detach the specified disk from the virtual machine.|
|/labs/virtualMachines/Claim/action|Take ownership of an existing virtual machine|
|/labs/virtualMachines/UnClaim/action|Release ownership of an existing virtual machine|
|/labs/virtualMachines/TransferDisks/action|Transfer ownership of virtual machine data disks to yourself|
|/labs/virtualMachines/ListApplicableSchedules/action|Lists all applicable schedules|
|/labs/virtualMachines/schedules/delete|Delete schedules.|
|/labs/virtualMachines/schedules/read|Read schedules.|
|/labs/virtualMachines/schedules/write|Add or modify schedules.|
|/labs/virtualMachines/schedules/Execute/action|Execute a schedule.|
|/labs/notificationChannels/delete|Delete notificationchannels.|
|/labs/notificationChannels/read|Read notificationchannels.|
|/labs/notificationChannels/write|Add or modify notificationchannels.|
|/labs/notificationChannels/Notify/action|Send notification to provided channel.|
|/schedules/delete|Delete schedules.|
|/schedules/read|Read schedules.|
|/schedules/write|Add or modify schedules.|
|/schedules/Execute/action|Execute a schedule.|
|/schedules/Retarget/action|Updates a schedule's target resource Id.|
|/labCenters/delete|Delete lab centers.|
|/labCenters/read|Read lab centers.|
|/labCenters/write|Add or modify lab centers.|
|/locations/operations/read|Read operations.|

## Microsoft.DocumentDB

| Operation | Description |
|---|---|
|/register/action| Register the Microsoft DocumentDB resource provider for the subscription|
|/databaseAccountNames/read|Checks for name availability.|
|/operationResults/read|Read status of the asynchronous operation|
|/databaseAccounts/read|Reads a database account.|
|/databaseAccounts/write|Update a database accounts.|
|/databaseAccounts/listKeys/action|List keys of a database account|
|/databaseAccounts/readonlykeys/action|Reads the database account readonly keys.|
|/databaseAccounts/regenerateKey/action|Rotate keys of a database account|
|/databaseAccounts/listConnectionStrings/action|Get the connection strings for a database account|
|/databaseAccounts/changeResourceGroup/action|Change resource group of a database account|
|/databaseAccounts/failoverPriorityChange/action|Change failover priorities of regions of a database account. This is used to perform manual failover operation|
|/databaseAccounts/delete|Deletes the database accounts.|
|/databaseAccounts/operationResults/read|Read status of the asynchronous operation|
|/databaseAccounts/providers/Microsoft.Insights/metricDefinitions/read|Gets the available metrics for the database Account|
|/databaseAccounts/providers/Microsoft.Insights/diagnosticSettings/read|Gets the diagnostic setting for the resource|
|/databaseAccounts/providers/Microsoft.Insights/diagnosticSettings/write|Creates or updates the diagnostic setting for the resource|
|/databaseAccounts/providers/Microsoft.Insights/logDefinitions/read|Gets the available log catageries for Database Account|
|/databaseAccounts/metricDefinitions/read|Reads the database account metrics definitions.|
|/databaseAccounts/metrics/read|Reads the database account metrics.|
|/databaseAccounts/usages/read|Reads the database account usages.|
|/databaseAccounts/percentile/targetRegion/metrics/read|Read latency metrics for a specific target region|
|/databaseAccounts/percentile/sourceRegion/targetRegion/metrics/read|Read latency metrics for a specific source and target region|
|/databaseAccounts/percentile/metrics/read|Read latency metrics|
|/databaseAccounts/region/metrics/read|Reads the region and database account metrics.|
|/databaseAccounts/region/databases/collections/metrics/read|Reads the regional collection metrics.|
|/databaseAccounts/region/databases/collections/partitions/read|Read database account partitions in a collection|
|/databaseAccounts/region/databases/collections/partitions/metrics/read|Read regional database account partition level metrics|
|/databaseAccounts/region/databases/collections/partitionKeyRangeId/metrics/read|Read regional database account partition key level metrics|
|/databaseAccounts/databases/collections/metricDefinitions/read|Reads the collection metric definitions.|
|/databaseAccounts/databases/collections/metrics/read|Reads the collection metrics.|
|/databaseAccounts/databases/collections/partitions/metrics/read|Read database account partition level metrics|
|/databaseAccounts/databases/collections/partitions/usages/read|Read database account partition level usages|
|/databaseAccounts/databases/collections/partitionKeyRangeId/metrics/read|Read database account partition key level metrics|
|/databaseAccounts/databases/collections/usages/read|Reads the collection usages.|
|/databaseAccounts/databases/metricDefinitions/read|Reads the database metric definitions|
|/databaseAccounts/databases/metrics/read|Reads the database metrics.|
|/databaseAccounts/databases/usages/read|Reads the database usages.|
|/databaseAccounts/readonlykeys/read|Reads the database account readonly keys.|
|/operations/read|Read operations available for the Microsoft DocumentDB |
|/locations/deleteVirtualNetworkOrSubnets/action|Notifies Microsoft.DocumentDB that VirtualNetwork or Subnet is being deleted|

## Microsoft.DomainRegistration

| Operation | Description |
|---|---|
|/generateSsoRequest/Action|Generate a request for signing into domain control center.|
|/validateDomainRegistrationInformation/Action|Validate domain purchase object without submitting it|
|/checkDomainAvailability/Action|Check if a domain is available for purchase|
|/listDomainRecommendations/Action|Retrieve the list domain recommendations based on keywords|
|/register/action|Register the Microsoft Domains resource provider for the subscription|
|/topLevelDomains/Read|Get toplevel domains|
|/topLevelDomains/Read|Get toplevel domain|
|/topLevelDomains/listAgreements/Action|List Agreement action|
|/domains/Read|Get the list of domains|
|/domains/Read|Get domain|
|/domains/Write|Add a new Domain or update an existing one|
|/domains/Delete|Delete an existing domain.|
|/domains/renew/Action|Renew an existing domain.|
|/domains/operationresults/Read|Get a domain operation|
|/domains/domainownershipidentifiers/Read|List ownership identifiers|
|/domains/domainownershipidentifiers/Read|Get ownership identifier|
|/domains/domainownershipidentifiers/Write|Create or update identifier|
|/domains/domainownershipidentifiers/Delete|Delete ownership identifier|
|/domains/operations/Read|List all operations from app service domain registration|

## Microsoft.DynamicsLcs

| Operation | Description |
|---|---|
|/lcsprojects/read|Display Microsoft Dynamics Lifecycle Services projects that belong to a user|
|/lcsprojects/write|Create and update Microsoft Dynamics Lifecycle Services projects that belong to the user. Only the name and description properties can be updated. The subscription and location associated with the project cannot be updated after creation|
|/lcsprojects/delete|Delete Microsoft Dynamics Lifecycle Services projects that belong to the user|
|/lcsprojects/clouddeployments/read|Display Microsoft Dynamics AX 2012 R3 Evaluation deployments in a Microsoft Dynamics Lifecycle Services project that belong to a user|
|/lcsprojects/clouddeployments/write|Create Microsoft Dynamics AX 2012 R3 Evaluation deployment in a Microsoft Dynamics Lifecycle Services project that belong to a user. Deployments can be managed from Azure management portal|
|/lcsprojects/connectors/read|Read connectors that belong to a Microsoft Dynamics Lifecycle Services project|
|/lcsprojects/connectors/write|Create and update connectors that belong to a Microsoft Dynamics Lifecycle Services project|

## Microsoft.EventGrid

| Operation | Description |
|---|---|
|/register/action|Registers the eventSubscription for the EventGrid resource provider and enables the creation of Event Grid subscriptions.|
|/eventSubscriptions/write|Create or update a eventSubscription|
|/eventSubscriptions/read|Read a eventSubscription|
|/eventSubscriptions/delete|Delete a eventSubscription|
|/eventSubscriptions/getFullUrl/action|Get full url for the event subscription|
|/eventSubscriptions/providers/Microsoft.Insights/metricDefinitions/read|Gets the available metrics for eventSubscriptions|
|/eventSubscriptions/providers/Microsoft.Insights/diagnosticSettings/read|Gets the diagnostic setting for event subscriptions|
|/eventSubscriptions/providers/Microsoft.Insights/diagnosticSettings/write|Creates or updates the diagnostic setting for event subscriptions|
|/extensionTopics/providers/Microsoft.Insights/metricDefinitions/read|Gets the available metrics for topics|
|/extensionTopics/providers/Microsoft.Insights/diagnosticSettings/read|Gets the diagnostic setting for topics|
|/extensionTopics/providers/Microsoft.Insights/diagnosticSettings/write|Creates or updates the diagnostic setting for topics|
|/topics/write|Create or update a topic|
|/topics/read|Read a topic|
|/topics/delete|Delete a topic|
|/topics/listKeys/action|List keys for the topic|
|/topics/regenerateKey/action|Regenerate key for the topic|
|/topics/providers/Microsoft.Insights/metricDefinitions/read|Gets the available metrics for topics|
|/topics/providers/Microsoft.Insights/diagnosticSettings/read|Gets the diagnostic setting for topics|
|/topics/providers/Microsoft.Insights/diagnosticSettings/write|Creates or updates the diagnostic setting for topics|

## Microsoft.EventHub

| Operation | Description |
|---|---|
|/checkNamespaceAvailability/action|Checks availability of namespace under given subscription. This API is deprecated please use CheckNameAvailabiltiy instead.|
|/checkNameAvailability/action|Checks availability of namespace under given subscription.|
|/register/action|Registers the subscription for the EventHub resource provider and enables the creation of EventHub resources|
|/unregister/action|Registers the EventHub Resource Provider|
|/sku/read|Get list of Sku Resource Descriptions|
|/sku/regions/read|Get list of SkuRegions Resource Descriptions|
|/namespaces/write|Create a Namespace Resource and Update its properties. Tags and Capacity of the Namespace are the properties which can be updated.|
|/namespaces/read|Get the list of Namespace Resource Description|
|/namespaces/Delete|Delete Namespace Resource|
|/namespaces/authorizationRules/action|Updates Namespace Authorization Rule. This API is depricated. Please use a PUT call to update the Namespace Authorization Rule instead.. This operation is not supported on API version 2017-04-01.|
|/namespaces/operationresults/read|Get the status of Namespace operation|
|/namespaces/providers/Microsoft.Insights/metricDefinitions/read|Get list of Namespace metrics Resource Descriptions|
|/namespaces/providers/Microsoft.Insights/diagnosticSettings/read|Get list of Namespace diagnostic settings Resource Descriptions|
|/namespaces/providers/Microsoft.Insights/diagnosticSettings/write|Get list of Namespace diagnostic settings Resource Descriptions|
|/namespaces/providers/Microsoft.Insights/logDefinitions/read|Get list of Namespace logs Resource Descriptions|
|/namespaces/authorizationRules/read|Get the list of Namespaces Authorization Rules description.|
|/namespaces/authorizationRules/write|Create a Namespace level Authorization Rules and update its properties. The Authorization Rules Access Rights, the Primary and Secondary Keys can be updated.|
|/namespaces/authorizationRules/delete|Delete Namespace Authorization Rule. The Default Namespace Authorization Rule cannot be deleted. |
|/namespaces/authorizationRules/listkeys/action|Get the Connection String to the Namespace|
|/namespaces/authorizationRules/regenerateKeys/action|Regenerate the Primary or Secondary key to the Resource|
|/namespaces/eventhubs/write|Create or Update EventHub properties.|
|/namespaces/eventhubs/read|Get list of EventHub Resource Descriptions|
|/namespaces/eventhubs/Delete|Operation to delete EventHub Resource|
|/namespaces/eventhubs/authorizationRules/action|Operation to update EventHub. This operation is not supported on API version 2017-04-01. Authorization Rules. Please use a PUT call to update Authorization Rule.|
|/namespaces/eventHubs/consumergroups/write|Create or Update ConsumerGroup properties.|
|/namespaces/eventHubs/consumergroups/read|Get list of ConsumerGroup Resource Descriptions|
|/namespaces/eventHubs/consumergroups/Delete|Operation to delete ConsumerGroup Resource|
|/namespaces/eventhubs/authorizationRules/read| Get the list of EventHub Authorization Rules|
|/namespaces/eventhubs/authorizationRules/write|Create EventHub Authorization Rules and Update its properties. The Authorization Rules Access Rights can be updated.|
|/namespaces/eventhubs/authorizationRules/delete|Operation to delete EventHub Authorization Rules|
|/namespaces/eventhubs/authorizationRules/listkeys/action|Get the Connection String to EventHub|
|/namespaces/eventhubs/authorizationRules/regenerateKeys/action|Regenerate the Primary or Secondary key to the Resource|
|/namespaces/disasterrecoveryconfigs/checkNameAvailability/action|Checks availability of namespace alias under given subscription.|
|/namespaces/disasterRecoveryConfigs/write|Creates or Updates the Disaster Recovery configuration associated with the namespace.|
|/namespaces/disasterRecoveryConfigs/read|Gets the Disaster Recovery configuration associated with the namespace.|
|/namespaces/disasterRecoveryConfigs/delete|Deletes the Disaster Recovery configuration associated with the namespace. This operation can only be invoked via the primary namespace.|
|/namespaces/disasterRecoveryConfigs/breakPairing/action|Disables Disaster Recovery and stops replicating changes from primary to secondary namespaces.|
|/namespaces/disasterRecoveryConfigs/failover/action|Invokes a GEO DR failover and reconfigures the namespace alias to point to the secondary namespace.|
|/namespaces/disasterRecoveryConfigs/authorizationRules/read|Get Disaster Recovery Primary Namespace's Authorization Rules|
|/namespaces/disasterRecoveryConfigs/authorizationRules/listkeys/action|Gets the authorization rules keys for the Disaster Recovery primary namespace|
|/namespaces/messagingPlan/read|Gets the Messaging Plan for a namespace. This API is deprecated. Properties exposed via the MessagingPlan resource are moved to the (parent) Namespace resource in later API versions.. This operation is not supported on API version 2017-04-01.|
|/namespaces/messagingPlan/write|Updates the Messaging Plan for a namespace. This API is deprecated. Properties exposed via the MessagingPlan resource are moved to the (parent) Namespace resource in later API versions.. This operation is not supported on API version 2017-04-01.|
|/operations/read|Get Operations|

## Microsoft.Features

| Operation | Description |
|---|---|
|/providers/features/read|Gets the feature of a subscription in a given resource provider.|
|/providers/features/register/action|Registers the feature for a subscription in a given resource provider.|
|/providers/features/unregister/action|Unregisters the feature for a subscription in a given resource provider.|
|/features/read|Gets the features of a subscription.|

## Microsoft.HDInsight

| Operation | Description |
|---|---|
|/clusters/write|Create or Update HDInsight Cluster|
|/clusters/read|Get details about HDInsight Cluster|
|/clusters/delete|Delete a HDInsight Cluster|
|/clusters/changerdpsetting/action|Change RDP setting for HDInsight Cluster|
|/clusters/configurations/action|Update HDInsight Cluster Configuration|
|/clusters/providers/Microsoft.Insights/metricDefinitions/read|Gets the available metrics for HDInsight Cluster|
|/clusters/providers/Microsoft.Insights/diagnosticSettings/read|Gets the diagnostic setting for the resource HDInsight Cluster|
|/clusters/providers/Microsoft.Insights/diagnosticSettings/write|Creates or updates the diagnostic setting for the resource HDInsight Cluster|
|/clusters/configurations/read|Get HDInsight Cluster Configurations|
|/clusters/roles/resize/action|Resize a HDInsight Cluster|
|/locations/capabilities/read|Get Subscription Capabilities|
|/locations/checkNameAvailability/read|Check Name Availability|

## Microsoft.ImportExport

| Operation | Description |
|---|---|
|/register/action|Registers the subscription for the import/export resource provider and enables the creation of import/export jobs.|
|/jobs/write|Creates a job with the specified parameters or update the properties or tags for the specified job.|
|/jobs/read|Gets the properties for the specified job or returns the list of jobs.|
|/jobs/listBitLockerKeys/action|Gets the BitLocker keys for the specified job.|
|/jobs/delete|Deletes an existing job.|
|/locations/read|Gets the properties for the specified location or returns the list of locations.|

## Microsoft.Insights

| Operation | Description |
|---|---|
|/Register/Action|Register the microsoft insights provider|
|/Unregister/Action|Register the microsoft insights provider|
|/AlertRules/Write|Writing to an alert rule configuration|
|/AlertRules/Delete|Deleting an alert rule configuration|
|/AlertRules/Read|Reading an alert rule configuration|
|/AlertRules/Activated/Action|Alert Rule activated|
|/AlertRules/Resolved/Action|Alert Rule resolved|
|/AlertRules/Throttled/Action|Alert rule is throttled|
|/AlertRules/Incidents/Read|Reading an alert rule incident configuration|
|/MetricDefinitions/Read|Read metric definitions|
|/MetricDefinitions/providers/Microsoft.Insights/Read|Read metric definitions|
|/MetricDefinitions/Microsoft.Insights/Read|Read metric definitions|
|/eventtypes/values/Read|Read management event type values|
|/eventtypes/digestevents/Read|Read management event type digest|
|/Metrics/Read|Read metrics|
|/Metrics/Write|Write metrics|
|/Metrics/providers/Metrics/Read|Read metrics|
|/MetricAlerts/Write|Writing a metric alert|
|/MetricAlerts/Delete|Deleting a metric alert|
|/MetricAlerts/Read|Reading a metric alert|
|/LogProfiles/Write|Writing to a log profile configuration|
|/LogProfiles/Delete|Delete log profiles configuration|
|/LogProfiles/Read|Read log profiles|
|/EventCategories/Read|Reading an event category|
|/Components/AnalyticsTables/Action|Application Insights analytics table action|
|/Components/ApiKeys/Action|Generating an Application Insights API key|
|/Components/Write|Writing to an application insights component configuration|
|/Components/Delete|Deleting an application insights component configuration|
|/Components/Read|Reading an application insights component configuration|
|/Components/ExportConfiguration/Action|Application Insights export settings action|
|/Components/Move/Action|Move an Application Insights Component to another resource group or subscription|
|/Components/ListMigrationDate/Action|Get back Subscription migration date|
|/Components/MigrateToNewpricingModel/Action|Migrate subscription to new pricing model|
|/Components/RollbackToLegacyPricingModel/Action|Rollback subscription to legacy pricing model|
|/Components/providers/Microsoft.Insights/MetricDefinitions/Read|Read metric definitions|
|/Components/GetToken/Read|Reading an Application Insights component token|
|/Components/MetricDefinitions/Read|Reading Application Insights component metric definitions|
|/Components/DefaultWorkItemConfig/Read|Reading an Application Insights default ALM integration configuration|
|/Components/Metrics/Read|Reading Application Insights component metrics|
|/Components/WorkItemConfigs/Delete|Deleting an Application Insights ALM integration configuration|
|/Components/WorkItemConfigs/Read|Reading an Application Insights ALM integration configuration|
|/Components/WorkItemConfigs/Write|Writing an Application Insights ALM integration configuration|
|/Components/Favorites/Delete|Deleting an Application Insights favorite|
|/Components/Favorites/Read|Reading an Application Insights favorite|
|/Components/Favorites/Write|Writing an Application Insights favorite|
|/Components/FeatureCapabilities/Read|Reading Application Insights component feature capabilities|
|/Components/ExportConfiguration/Delete|Deleting Application Insights export settings|
|/Components/ExportConfiguration/Read|Reading Application Insights export settings|
|/Components/ExportConfiguration/Write|Writing Application Insights export settings|
|/Components/ProactiveDetectionConfigs/Read|Reading Application Insights proactive detection configuration|
|/Components/ProactiveDetectionConfigs/Write|Writing Application Insights proactive detection configuration|
|/Components/QuotaStatus/Read|Reading Application Insights component quota status|
|/Components/SyntheticMonitorLocations/Read|Reading Application Insights webtest locations|
|/Components/GetAvailableBillingFeatures/Read|Reading Application Insights component available billing features|
|/Components/BillingPlanForComponent/Read|Reading a billing plan for Application Insights component|
|/Components/Annotations/Delete|Deleting an Application Insights annotation|
|/Components/Annotations/Read|Reading an Application Insights annotation|
|/Components/Annotations/Write|Writing an Application Insights annotation|
|/Components/ExtendQueries/Read|Reading Application Insights component extended query results|
|/Components/CurrentBillingFeatures/Read|Reading current billing features for Application Insights component|
|/Components/CurrentBillingFeatures/Write|Writing current billing features for Application Insights component|
|/Components/MyAnalyticsItems/Delete|Deleting an Application Insights personal analytics item|
|/Components/MyAnalyticsItems/Write|Writing an Application Insights personal analytics item|
|/Components/MyAnalyticsItems/Read|Reading an Application Insights personal analytics item|
|/Components/ApiKeys/Delete|Deleting an Application Insights API key|
|/Components/ApiKeys/Read|Reading an Application Insights API key|
|/Components/Api/Read|Reading Application Insights component data API|
|/Components/PricingPlans/Read|Reading an Application Insights component pricing plan|
|/Components/PricingPlans/Write|Writing an Application Insights component pricing plan|
|/Components/AnalyticsTables/Delete|Deleting an Application Insights analytics table schema|
|/Components/AnalyticsTables/Read|Reading an Application Insights analytics table schema|
|/Components/AnalyticsTables/Write|Writing an Application Insights analytics table schema|
|/Components/MyFavorites/Read|Reading an Application Insights personal favorite|
|/Components/ListMigrationDate/Read|Get back subscription migration date|
|/Components/AnalyticsItems/Delete|Deleting an Application Insights analytics item|
|/Components/AnalyticsItems/Read|Reading an Application Insights analytics item|
|/Components/AnalyticsItems/Write|Writing an Application Insights analytics item|
|/AutoscaleSettings/Write|Writing to an autoscale setting configuration|
|/AutoscaleSettings/Delete|Deleting an autoscale setting configuration|
|/AutoscaleSettings/Read|Reading an autoscale setting configuration|
|/AutoscaleSettings/Scaleup/Action|Autoscale scale up operation|
|/AutoscaleSettings/Scaledown/Action|Autoscale scale down operation|
|/AutoscaleSettings/providers/Microsoft.Insights/MetricDefinitions/Read|Read metric definitions|
|/ActivityLogAlerts/Write|Reading an activity log alert|
|/ActivityLogAlerts/Delete|Deleting an activity log alert|
|/ActivityLogAlerts/Read|Reading an activity log alert|
|/ActivityLogAlerts/Activated/Action|Triggered the Activity Log Alert|
|/DiagnosticSettings/Write|Writing to diagnostic settings configuration|
|/DiagnosticSettings/Delete|Deleting diagnostic settings configuration|
|/DiagnosticSettings/Read|Reading a diagnostic settings configuration|
|/ActionGroups/Write|Writing an action group|
|/ActionGroups/Delete|Deleting an action group|
|/ActionGroups/Read|Reading an action group|
|/Operations/Read|Reading operations|
|/LogDefinitions/Read|Read log definitions|
|/Webtests/Write|Writing to a webtest configuration|
|/Webtests/Delete|Deleting a webtest configuration|
|/Webtests/Read|Reading a webtest configuration|
|/Webtests/GetToken/Read|Reading a webtest token|
|/Webtests/MetricDefinitions/Read|Reading a webtest metric definitions|
|/Webtests/Metrics/Read|Reading a webtest metrics|
|/Tenants/Register/Action|Initializes the microsoft insights provider|
|/ExtendedDiagnosticSettings/Write|Writing to extended diagnostic settings configuration|
|/ExtendedDiagnosticSettings/Delete|Deleting extended diagnostic settings configuration|
|/ExtendedDiagnosticSettings/Read|Reading a extended diagnostic settings configuration|

## Microsoft.KeyVault

| Operation | Description |
|---|---|
|/register/action|Registers a subscription|
|/unregister/action|Unregisters a subscription|
|/hsmPools/read|View the properties of an HSM pool|
|/hsmPools/write|Create a new HSM pool of update the properties of an existing HSM pool|
|/hsmPools/delete|Delete an HSM pool|
|/hsmPools/joinVault/action|Join a key vault to an HSM pool|
|/checkNameAvailability/read|Checks that a key vault name is valid and is not in use|
|/vaults/read|View the properties of a key vault|
|/vaults/write|Create a new key vault or update the properties of an existing key vault|
|/vaults/delete|Delete a key vault|
|/vaults/deploy/action|Enables access to secrets in a key vault when deploying Azure resources|
|/vaults/providers/Microsoft.Insights/metricDefinitions/read|Gets the available metrics for a key vault|
|/vaults/providers/Microsoft.Insights/diagnosticSettings/Read|Gets the diagnostic setting for the resource|
|/vaults/providers/Microsoft.Insights/diagnosticSettings/Write|Creates or updates the diagnostic setting for the resource|
|/vaults/providers/Microsoft.Insights/logDefinitions/read|Gets the available logs for a key vault|
|/vaults/secrets/read|View the properties of a secret, but not its value|
|/vaults/secrets/write|Create a new secret or update the value of an existing secret|
|/vaults/accessPolicies/write|Update an existing access policy by merging or replacing, or add a new access policy to a vault.|
|/operations/read|Lists operations available on Microsoft.KeyVault resource provider|
|/deletedVaults/read|View the properties of soft deleted key vaults|
|/locations/deleteVirtualNetworkOrSubnets/action|Notifies Microsoft.KeyVault that a virtual network or subnet is being deleted|
|/locations/operationResults/read|Check the result of a long run operation|
|/locations/deletedVaults/read|View the properties of a soft deleted key vault|
|/locations/deletedVaults/purge/action|Purge a soft deleted key vault|

## Microsoft.LabServices

| Operation | Description |
|---|---|
|/register/action|Registers the subscription|
|/labAccounts/delete|Delete lab accounts.|
|/labAccounts/read|Read lab accounts.|
|/labAccounts/write|Add or modify lab accounts.|
|/labAccounts/CreateLab/action|Create a lab in a lab account.|
|/labAccounts/labs/delete|Delete labs.|
|/labAccounts/labs/read|Read labs.|
|/labAccounts/labs/write|Add or modify labs.|
|/labAccounts/labs/users/delete|Delete users.|
|/labAccounts/labs/users/read|Read users.|
|/labAccounts/labs/users/write|Add or modify users.|
|/labAccounts/labs/environmentSettings/delete|Delete environment setting.|
|/labAccounts/labs/environmentSettings/read|Read environment setting.|
|/labAccounts/labs/environmentSettings/write|Add or modify environment setting.|
|/labAccounts/labs/environmentSettings/Publish/action|Provisions/deprovisions required resources for an environment setting based on current state of the lab/environment setting.|
|/labAccounts/labs/environmentSettings/environments/delete|Delete environments.|
|/labAccounts/labs/environmentSettings/environments/read|Read environments.|
|/labAccounts/labs/environmentSettings/environments/write|Add or modify environments.|
|/locations/operations/read|Read operations.|

## Microsoft.LocationBasedServices

| Operation | Description |
|---|---|
|/register/action|Register the provider|
|/accounts/write|Create or update a Location Based Services Account.|
|/accounts/read|Get a Location Based Services Account.|
|/accounts/delete|Delete a Location Based Services Account.|
|/accounts/listKeys/action|List Location Based Services Account keys|
|/accounts/regenerateKey/action|Generate new Location Based Services Account primary or secondary key|
|/accounts/providers/Microsoft.Insights/metricDefinitions/read|Gets the available metrics for Location Based Services Accounts|
|/accounts/providers/Microsoft.Insights/diagnosticSettings/read|Gets the diagnostic setting for the resource|
|/accounts/providers/Microsoft.Insights/diagnosticSettings/write|Creates or updates the diagnostic setting for the resource|

## Microsoft.Logic

| Operation | Description |
|---|---|
|/register/action|Registers the Microsoft.Logic resource provider for a given subscription.|
|/workflows/read|Reads the workflow.|
|/workflows/write|Creates or updates the workflow.|
|/workflows/delete|Deletes the workflow.|
|/workflows/run/action|Starts a run of the workflow.|
|/workflows/disable/action|Disables the workflow.|
|/workflows/enable/action|Enables the workflow.|
|/workflows/suspend/action|Suspends the workflow.|
|/workflows/validate/action|Validates the workflow.|
|/workflows/move/action|Moves Workflow from its existing subscription id, resource group, and/or name to a different subscription id, resource group, and/or name.|
|/workflows/listSwagger/action|Gets the workflow swagger definitions.|
|/workflows/regenerateAccessKey/action|Regenerates the access key secrets.|
|/workflows/listCallbackUrl/action|Gets the callback URL for workflow.|
|/workflows/providers/Microsoft.Insights/metricDefinitions/read|Reads the workflow metric definitions.|
|/workflows/providers/Microsoft.Insights/diagnosticSettings/read|Reads the workflow diagnostic settings.|
|/workflows/providers/Microsoft.Insights/diagnosticSettings/write|Creates or updates the workflow diagnostic setting.|
|/workflows/providers/Microsoft.Insights/logDefinitions/read|Reads the workflow log definitions.|
|/workflows/versions/read|Reads the workflow version.|
|/workflows/versions/triggers/listCallbackUrl/action|Gets the callback URL for trigger.|
|/workflows/runs/read|Reads the workflow run.|
|/workflows/runs/cancel/action|Cancels the run of a workflow.|
|/workflows/runs/actions/read|Reads the workflow run action.|
|/workflows/runs/actions/listExpressionTraces/action|Gets the workflow run action expression traces.|
|/workflows/runs/actions/repetitions/read|Reads the workflow run action repetition.|
|/workflows/runs/actions/repetitions/listExpressionTraces/action|Gets the workflow run action repetition expression traces.|
|/workflows/runs/actions/scoperepetitions/read|Reads the workflow run action scope repetition.|
|/workflows/runs/operations/read|Reads the workflow run operation status.|
|/workflows/triggers/read|Reads the trigger.|
|/workflows/triggers/run/action|Executes the trigger.|
|/workflows/triggers/reset/action|Resets the trigger.|
|/workflows/triggers/setState/action|Sets the trigger state.|
|/workflows/triggers/listCallbackUrl/action|Gets the callback URL for trigger.|
|/workflows/triggers/histories/read|Reads the trigger histories.|
|/workflows/triggers/histories/resubmit/action|Resubmits the workflow trigger.|
|/workflows/accessKeys/read|Reads the access key.|
|/workflows/accessKeys/write|Creates or updates the access key.|
|/workflows/accessKeys/delete|Deletes the access key.|
|/workflows/accessKeys/list/action|Lists the access key secrets.|
|/workflows/accessKeys/regenerate/action|Regenerates the access key secrets.|
|/operations/read|Gets the operation.|
|/integrationAccounts/read|Reads the integration account.|
|/integrationAccounts/write|Creates or updates the integration account.|
|/integrationAccounts/delete|Deletes the integration account.|
|/integrationAccounts/regenerateAccessKey/action|Regenerates the access key secrets.|
|/integrationAccounts/listCallbackUrl/action|Gets the callback URL for integration account.|
|/integrationAccounts/listKeyVaultKeys/action|Gets the keys in the key vault.|
|/integrationAccounts/logTrackingEvents/action|Logs the tracking events in the integration account.|
|/integrationAccounts/providers/Microsoft.Insights/logDefinitions/read|Reads the Integration Account log definitions.|
|/integrationAccounts/maps/read|Reads the map in integration account.|
|/integrationAccounts/maps/write|Creates or updates the map in integration account.|
|/integrationAccounts/maps/delete|Deletes the map in integration account.|
|/integrationAccounts/maps/listContentCallbackUrl/action|Gets the callback URL for map content in integration account.|
|/integrationAccounts/batchConfigurations/read|Reads the batch configuration in integration account.|
|/integrationAccounts/batchConfigurations/write|Creates or updates the batch configuration in integration account.|
|/integrationAccounts/batchConfigurations/delete|Deletes the batch configuration in integration account.|
|/integrationAccounts/certificates/read|Reads the certificate in integration account.|
|/integrationAccounts/certificates/write|Creates or updates the certificate in integration account.|
|/integrationAccounts/certificates/delete|Deletes the certificate in integration account.|
|/integrationAccounts/assemblies/read|Reads the assembly in integration account.|
|/integrationAccounts/assemblies/write|Creates or updates the assembly in integration account.|
|/integrationAccounts/assemblies/delete|Deletes the assembly in integration account.|
|/integrationAccounts/assemblies/listContentCallbackUrl/action|Gets the callback URL for assembly content in integration account.|
|/integrationAccounts/sessions/read|Reads the batch configuration in integration account.|
|/integrationAccounts/sessions/write|Creates or updates the session in integration account.|
|/integrationAccounts/sessions/delete|Deletes the session in integration account.|
|/integrationAccounts/schemas/read|Reads the schema in integration account.|
|/integrationAccounts/schemas/write|Creates or updates the schema in integration account.|
|/integrationAccounts/schemas/delete|Deletes the schema in integration account.|
|/integrationAccounts/schemas/listContentCallbackUrl/action|Gets the callback URL for schema content in integration account.|
|/integrationAccounts/partners/read|Reads the parter in integration account.|
|/integrationAccounts/partners/write|Creates or updates the partner in integration account.|
|/integrationAccounts/partners/delete|Deletes the partner in integration account.|
|/integrationAccounts/partners/listContentCallbackUrl/action|Gets the callback URL for partner content in integration account.|
|/integrationAccounts/agreements/read|Reads the agreement in integration account.|
|/integrationAccounts/agreements/write|Creates or updates the agreement in integration account.|
|/integrationAccounts/agreements/delete|Deletes the agreement in integration account.|
|/integrationAccounts/agreements/listContentCallbackUrl/action|Gets the callback URL for agreement content in integration account.|
|/locations/workflows/validate/action|Validates the workflow.|

## Microsoft.MachineLearning

| Operation | Description |
|---|---|
|/register/action|Registers the subscription for the machine learning web service resource provider and enables the creation of web services.|
|/webServices/action|Create regional Web Service Properties for supported regions|
|/commitmentPlans/read|Read any Machine Learning Commitment Plan|
|/commitmentPlans/write|Create or Update any Machine Learning Commitment Plan|
|/commitmentPlans/delete|Delete any Machine Learning Commitment Plan|
|/commitmentPlans/join/action|Join any Machine Learning Commitment Plan|
|/commitmentPlans/commitmentAssociations/read|Read any Machine Learning Commitment Plan Association|
|/commitmentPlans/commitmentAssociations/move/action|Move any Machine Learning Commitment Plan Association|
|/skus/read|Get Machine Learning Commitment Plan SKUs|
|/operations/read|Get Machine Learning Operations|
|/Workspaces/read|Read any Machine Learning Workspace|
|/Workspaces/write|Create or Update any Machine Learning Workspace|
|/Workspaces/delete|Delete any Machine Learning Workspace|
|/Workspaces/listworkspacekeys/action|List keys for a Machine Learning Workspace|
|/Workspaces/resyncstoragekeys/action|Resync keys of storage account configured for a Machine Learning Workspace|
|/webServices/read|Read any Machine Learning Web Service|
|/webServices/write|Create or Update any Machine Learning Web Service|
|/webServices/delete|Delete any Machine Learning Web Service|
|/locations/operationresults/read|Get result of a Machine Learning Operation|
|/locations/operationsstatus/read|Get status of an ongoing Machine Learning Operation|

## Microsoft.MachineLearningCompute

| Operation | Description |
|---|---|
|/register/action|Registers subscription ID to the resource provider and enables the creation of a machine learning compute resources|
|/operationalizationClusters/read|Read any hosting account|
|/operationalizationClusters/write|Create or update any hosting account|
|/operationalizationClusters/delete|Delete any hosting account|
|/operationalizationClusters/listKeys/action|List the keys associated with operationalization cluster|
|/operationalizationClusters/checkUpdate/action|Check if updates are available for system services for the operationalization cluster|
|/operationalizationClusters/updateSystem/action|Update the system services in an operationalization cluster|

## Microsoft.MachineLearningModelManagement

| Operation | Description |
|---|---|
|/register/action|Registers subscription ID to the resource provider and enables the creation of a hosting account|
|/accounts/read|Read any hosting account|
|/accounts/write|Create or update any hosting account|
|/accounts/delete|Delete any hosting account|

## Microsoft.ManagedIdentity

| Operation | Description |
|---|---|
|/userAssignedIdentities/read|Gets an existing user assigned identity|
|/userAssignedIdentities/write|Creates a new user assigned identity or updates the tags associated with an existing user assigned identity|
|/userAssignedIdentities/delete|Deletes an existing user assigned identity|
|/userAssignedIdentities/assign/action|RBAC action for assigning an existing user assigned identity to a resource|

## Microsoft.ManagedLab

| Operation | Description |
|---|---|
|/register/action|Registers the subscription|
|/labAccounts/delete|Delete lab accounts.|
|/labAccounts/read|Read lab accounts.|
|/labAccounts/write|Add or modify lab accounts.|
|/labAccounts/CreateLab/action|Create a lab in a lab account.|
|/labAccounts/labs/delete|Delete labs.|
|/labAccounts/labs/read|Read labs.|
|/labAccounts/labs/write|Add or modify labs.|
|/labAccounts/labs/labVms/delete|Delete lab virtual machines.|
|/labAccounts/labs/labVms/read|Read lab virtual machines.|
|/labAccounts/labs/labVms/write|Add or modify lab virtual machines.|
|/labAccounts/labs/environmentSettings/delete|Delete environment setting.|
|/labAccounts/labs/environmentSettings/read|Read environment setting.|
|/labAccounts/labs/environmentSettings/write|Add or modify environment setting.|
|/labAccounts/labs/environmentSettings/environments/delete|Delete environments.|
|/labAccounts/labs/environmentSettings/environments/read|Read environments.|
|/labAccounts/labs/environmentSettings/environments/write|Add or modify environments.|
|/locations/operations/read|Read operations.|

## Microsoft.Management

| Operation | Description |
|---|---|
|/checkNameAvailability/action|Checks if the specified management group name is valid and unique.|
|/getEntities/action|List all entities (Management Groups, Subscriptions, etc.) for the authenticated user.|
|/managementGroups/read|List management groups for the authenticated user.|
|/managementGroups/write|Create or update a management group.|
|/managementGroups/delete|Delete management group.|
|/managementGroups/subscriptions/write|Associates existing subscription with the management group.|
|/managementGroups/subscriptions/delete|De-associates subscription from the management group.|

## Microsoft.MarketplaceApps

| Operation | Description |
|---|---|
|/ClassicDevServices/read|Does a GET operation on a classic dev service.|
|/ClassicDevServices/delete|Does a DELETE operation on a classic dev service resource.|
|/ClassicDevServices/listSingleSignOnToken/action|Gets the Single Sign On URL for a classic dev service.|
|/ClassicDevServices/listSecrets/action|Gets a classic dev service resource management keys.|
|/ClassicDevServices/regenerateKey/action|Generates a classic dev service resource management keys.|
|/Operations/read|Read the operations for all resource types.|

## Microsoft.MarketplaceOrdering

| Operation | Description |
|---|---|
|/offertypes/publishers/offers/plans/agreements/read|Get an agreement for a given marketplace virtual machine item|
|/offertypes/publishers/offers/plans/agreements/write|Sign or Cancel an agreement for a given marketplace virtual machine item|
|/agreements/read|Return all agreements under given subscription|
|/agreements/offers/plans/read|Return an agreement for a given marketplace item|
|/agreements/offers/plans/sign/action|Sign an agreement for a given marketplace item|
|/agreements/offers/plans/cancel/action|Cancel an agreement for a given marketplace item|

## Microsoft.Media

| Operation | Description |
|---|---|
|/register/action|Registers the subscription for the Media Services resource provider and enables the creation of Media Services accounts|
|/checknameavailability/action|Checks if a Media Services account name is available|
|/mediaservices/read|Read any Media Services Account|
|/mediaservices/write|Create or Update any Media Services Account|
|/mediaservices/delete|Delete any Media Services Account|
|/mediaservices/regenerateKey/action|Regenerate a Media Services ACS key|
|/mediaservices/listKeys/action|List the ACS keys for the Media Services account|
|/mediaservices/syncStorageKeys/action|Synchronize the Storage Keys for an attached Azure Storage account|
|/operations/read|Read any Media Services Account|

## Microsoft.Migrate

| Operation | Description |
|---|---|
|/Operations/read|Reads the exposed operations|

## Microsoft.Network

| Operation | Description |
|---|---|
|/register/action|Registers the subscription|
|/unregister/action|Unregisters the subscription|
|/checkTrafficManagerNameAvailability/action|Checks the availability of a Traffic Manager Relative DNS name.|
|/dnszones/read|Get the DNS zone, in JSON format. The zone properties include tags, etag, numberOfRecordSets, and maxNumberOfRecordSets. Note that this command does not retrieve the record sets contained within the zone.|
|/dnszones/write|Create or update a DNS zone within a resource group.  Used to update the tags on a DNS zone resource. Note that this command can not be used to create or update record sets within the zone.|
|/dnszones/delete|Delete the DNS zone, in JSON format. The zone properties include tags, etag, numberOfRecordSets, and maxNumberOfRecordSets.|
|/dnszones/MX/read|Get the record set of type ‘MX’, in JSON format. The record set contains a list of records as well as the TTL, tags, and etag.|
|/dnszones/MX/write|Create or update a record set of type ‘MX’ within a DNS zone. The records specified will replace the current records in the record set.|
|/dnszones/MX/delete|Remove the record set of a given name and type ‘MX’ from a DNS zone.|
|/dnszones/providers/Microsoft.Insights/metricDefinitions/read|Gets the DNS zone metric definitions|
|/dnszones/providers/Microsoft.Insights/diagnosticSettings/read|Gets the DNS zone diagnostic settings|
|/dnszones/providers/Microsoft.Insights/diagnosticSettings/write|Creates or updates the DNS zone diagnostic settings|
|/dnszones/all/read|Gets DNS record sets across types|
|/dnszones/NS/read|Gets DNS record set of type NS|
|/dnszones/NS/write|Creates or updates DNS record set of type NS|
|/dnszones/NS/delete|Deletes the DNS record set of type NS|
|/dnszones/AAAA/read|Get the record set of type ‘AAAA’, in JSON format. The record set contains a list of records as well as the TTL, tags, and etag.|
|/dnszones/AAAA/write|Create or update a record set of type ‘AAAA’ within a DNS zone. The records specified will replace the current records in the record set.|
|/dnszones/AAAA/delete|Remove the record set of a given name and type ‘AAAA’ from a DNS zone.|
|/dnszones/CNAME/read|Get the record set of type ‘CNAME’, in JSON format. The record set contains the TTL, tags, and etag.|
|/dnszones/CNAME/write|Create or update a record set of type ‘CNAME’ within a DNS zone. The records specified will replace the current records in the record set.|
|/dnszones/CNAME/delete|Remove the record set of a given name and type ‘CNAME’ from a DNS zone.|
|/dnszones/SOA/read|Gets DNS record set of type SOA|
|/dnszones/SOA/write|Creates or updates DNS record set of type SOA|
|/dnszones/SRV/read|Get the record set of type ‘SRV’, in JSON format. The record set contains a list of records as well as the TTL, tags, and etag.|
|/dnszones/SRV/write|Create or update record set of type SRV|
|/dnszones/SRV/delete|Remove the record set of a given name and type ‘SRV’ from a DNS zone.|
|/dnszones/PTR/read|Get the record set of type ‘PTR’, in JSON format. The record set contains a list of records as well as the TTL, tags, and etag.|
|/dnszones/PTR/write|Create or update a record set of type ‘PTR’ within a DNS zone. The records specified will replace the current records in the record set.|
|/dnszones/PTR/delete|Remove the record set of a given name and type ‘PTR’ from a DNS zone.|
|/dnszones/A/read|Get the record set of type ‘A’, in JSON format. The record set contains a list of records as well as the TTL, tags, and etag.|
|/dnszones/A/write|Create or update a record set of type ‘A’ within a DNS zone. The records specified will replace the current records in the record set.|
|/dnszones/A/delete|Remove the record set of a given name and type ‘A’ from a DNS zone.|
|/dnszones/TXT/read|Get the record set of type ‘TXT’, in JSON format. The record set contains a list of records as well as the TTL, tags, and etag.|
|/dnszones/TXT/write|Create or update a record set of type ‘TXT’ within a DNS zone. The records specified will replace the current records in the record set.|
|/dnszones/TXT/delete|Remove the record set of a given name and type ‘TXT’ from a DNS zone.|
|/dnszones/CAA/read|Get the record set of type ‘CAA’, in JSON format. The record set contains the TTL, tags, and etag.|
|/dnszones/CAA/write|Create or update a record set of type ‘CAA’ within a DNS zone. The records specified will replace the current records in the record set.|
|/dnszones/CAA/delete|Remove the record set of a given name and type ‘CAA’ from a DNS zone.|
|/dnszones/recordsets/read|Gets DNS record sets across types|
|/networkInterfaces/read|Gets a network interface definition. |
|/networkInterfaces/write|Creates a network interface or updates an existing network interface. |
|/networkInterfaces/join/action|Joins a Virtual Machine to a network interface|
|/networkInterfaces/delete|Deletes a network interface|
|/networkInterfaces/effectiveRouteTable/action|Get Route Table configured On Network Interface Of The Vm|
|/networkInterfaces/effectiveNetworkSecurityGroups/action|Get Network Security Groups configured On Network Interface Of The Vm|
|/networkInterfaces/loadBalancers/read|Gets all the load balancers that the network interface is part of|
|/networkInterfaces/providers/Microsoft.Insights/metricDefinitions/read|Gets available metrics for the Network Interface|
|/networkInterfaces/diagnosticIdentity/read|Gets Diagnostic Identity Of The Resource|
|/networkInterfaces/ipconfigurations/read|Gets a network interface ip configuration definition. |
|/publicIPAddresses/read|Gets a public ip address definition.|
|/publicIPAddresses/write|Creates a public Ip address or updates an existing public Ip address. |
|/publicIPAddresses/delete|Deletes a public Ip address.|
|/publicIPAddresses/join/action|Joins a public ip address|
|/publicIPAddresses/providers/Microsoft.Insights/metricDefinitions/read|Get the metrics definitions of Public IP Address|
|/publicIPAddresses/providers/Microsoft.Insights/diagnosticSettings/read|Get the diagnostic settings of Public IP Address|
|/publicIPAddresses/providers/Microsoft.Insights/diagnosticSettings/write|Create or update the diagnostic settings of Public IP Address|
|/publicIPAddresses/providers/Microsoft.Insights/logDefinitions/read|Get the log definitions of Public IP Address|
|/securegateways/read|Get Secure Gateway|
|/securegateways/write|Creates or updates a Secure Gateway|
|/securegateways/delete|Delete Secure Gateway|
|/securegateways/networkRuleCollections/read|Retrieve a Network Rule Collection for a given Secure Gateway|
|/securegateways/networkRuleCollections/write|Creates or updates a Network Rule Collection for a Secure Gateway|
|/securegateways/networkRuleCollections/delete|Deletes a Network Rule Collection for a Secure Gateway|
|/securegateways/applicationRuleCollections/read|Retrieve an Application Rule Collection for a given Secure Gateway|
|/securegateways/applicationRuleCollections/write|Creates or updates an Application Rule Collection for a Secure Gateway|
|/securegateways/applicationRuleCollections/delete|Deletes an Application Rule Collection for a Secure Gateway|
|/routeFilters/read|Gets a route filter definition|
|/routeFilters/join/action|Joins a route filter|
|/routeFilters/delete|Deletes a route filter definition|
|/routeFilters/write|Creates a route filter or Updates an existing rotue filter|
|/routeFilters/routeFilterRules/read|Gets a route filter rule definition|
|/routeFilters/routeFilterRules/write|Creates a route filter rule or Updates an existing route filter rule|
|/routeFilters/routeFilterRules/delete|Deletes a route filter rule definition|
|/networkWatchers/read|Get the network watcher definition|
|/networkWatchers/write|Creates a network watcher or updates an existing network watcher|
|/networkWatchers/delete|Deletes a network watcher|
|/networkWatchers/configureFlowLog/action|Configures flow logging for a target resource.|
|/networkWatchers/ipFlowVerify/action|Returns whether the packet is allowed or denied to or from a particular destination.|
|/networkWatchers/nextHop/action|For a specified target and destination IP address, return the next hop type and next hope IP address.|
|/networkWatchers/queryFlowLogStatus/action|Gets the status of flow logging on a resource.|
|/networkWatchers/queryTroubleshootResult/action|Gets the troubleshooting result from the previously run or currently running troubleshooting operation.|
|/networkWatchers/securityGroupView/action|View the configured and effective network security group rules applied on a VM.|
|/networkWatchers/topology/action|Gets a network level view of resources and their relationships in a resource group.|
|/networkWatchers/troubleshoot/action|Starts troubleshooting on a Networking resource in Azure.|
|/networkWatchers/connectivityCheck/action|Verifies the possibility of establishing a direct TCP connection from a virtual machine to a given endpoint including another VM or an arbitrary remote server.|
|/networkWatchers/azureReachabilityReport/action|Returns the relative latency score for internet service providers from a specified location to Azure regions.|
|/networkWatchers/availableProvidersList/action|Returns all available internet service providers for a specified Azure region.|
|/networkWatchers/lenses/start/action|Start monitoring network traffic on a specified endpoint|
|/networkWatchers/lenses/stop/action|Stop/pause monitoring network traffic on a specified endpoint|
|/networkWatchers/lenses/query/action|Query monitoring network traffic on a specified endpoint|
|/networkWatchers/lenses/read|Get Lens details|
|/networkWatchers/lenses/write|Creates a Lens|
|/networkWatchers/lenses/delete|Deletes a Lens|
|/networkWatchers/connectionMonitors/start/action|Start monitoring connectivity between specified endpoints|
|/networkWatchers/connectionMonitors/stop/action|Stop/pause monitoring connectivity between specified endpoints|
|/networkWatchers/connectionMonitors/query/action|Query monitoring connectivity between specified endpoints|
|/networkWatchers/connectionMonitors/read|Get Connection Monitor details|
|/networkWatchers/connectionMonitors/write|Creates a Connection Monitor|
|/networkWatchers/connectionMonitors/delete|Deletes a Connection Monitor|
|/networkWatchers/connectionMonitors/providers/Microsoft.Insights/metricDefinitions/read|Gets the available metrics for Connection Monitor|
|/networkWatchers/connectionMonitors/providers/Microsoft.Insights/diagnosticSettings/read|Get the diagnostic settings of Connection Monitor|
|/networkWatchers/connectionMonitors/providers/Microsoft.Insights/diagnosticSettings/write|Creates or updates the Connection Monitor Diagnostic Settings|
|/networkWatchers/packetCaptures/queryStatus/action|Gets information about properties and status of a packet capture resource.|
|/networkWatchers/packetCaptures/stop/action|Stop the running packet capture session.|
|/networkWatchers/packetCaptures/read|Get the packet capture definition|
|/networkWatchers/packetCaptures/write|Creates a packet capture|
|/networkWatchers/packetCaptures/delete|Deletes a packet capture|
|/loadBalancers/read|Gets a load balancer definition|
|/loadBalancers/write|Creates a load balancer or updates an existing load balancer|
|/loadBalancers/delete|Deletes a load balancer|
|/loadBalancers/networkInterfaces/read|Gets references to all the network interfaces under a load balancer|
|/loadBalancers/providers/Microsoft.Insights/metricDefinitions/read|Gets the available metrics for Load Balancer|
|/loadBalancers/providers/Microsoft.Insights/diagnosticSettings/read|Gets the Load Balancer Diagnostic Settings|
|/loadBalancers/providers/Microsoft.Insights/diagnosticSettings/write|Creates or updates the Load Balancer Diagnostic Settings|
|/loadBalancers/providers/Microsoft.Insights/logDefinitions/read|Gets the events for Load Balancer|
|/loadBalancers/loadBalancingRules/read|Gets a load balancer load balancing rule definition|
|/loadBalancers/backendAddressPools/read|Gets a load balancer backend address pool definition|
|/loadBalancers/backendAddressPools/join/action|Joins a load balancer backend address pool|
|/loadBalancers/inboundNatPools/read|Gets a load balancer inbound nat pool definition|
|/loadBalancers/inboundNatPools/join/action|Joins a load balancer inbound nat pool|
|/loadBalancers/inboundNatRules/read|Gets a load balancer inbound nat rule definition|
|/loadBalancers/inboundNatRules/write|Creates a load balancer inbound nat rule or updates an existing load balancer inbound nat rule|
|/loadBalancers/inboundNatRules/delete|Deletes a load balancer inbound nat rule|
|/loadBalancers/inboundNatRules/join/action|Joins a load balancer inbound nat rule|
|/loadBalancers/outboundNatRules/read|Gets a load balancer outbound nat rule definition|
|/loadBalancers/probes/read|Gets a load balancer probe|
|/loadBalancers/probes/join/action|Allows using probes of a load balancer. For example, with this permission healthProbe property of VM scale set can reference the probe.|
|/loadBalancers/virtualMachines/read|Gets references to all the virtual machines under a load balancer|
|/loadBalancers/frontendIPConfigurations/read|Gets a load balancer frontend IP configuration definition|
|/applicationGatewayAvailableSslOptions/read|Application Gateway available Ssl Options|
|/applicationGatewayAvailableSslOptions/predefinedPolicies/read|Application Gateway Ssl Predefined Policy|
|/trafficManagerGeographicHierarchies/read|Gets the Traffic Manager Geographic Hierarchy containing regions which can be used with the Geographic traffic routing method|
|/bgpServiceCommunities/read|Get Bgp Service Communities|
|/virtualNetworkTaps/read|Get Virtual Network Tap|
|/virtualNetworkTaps/join/action|Joins a virtual network tap|
|/virtualNetworkTaps/delete|Delete Virtual Network Tap|
|/virtualNetworkTaps/write|Create or Update Virtual Network Tap|
|/serviceEndpointPolicies/read|Gets a Service Endpoint Policy Description|
|/serviceEndpointPolicies/write|Creates a Service Endpoint Policy or updates an existing Service Endpoint Policy|
|/serviceEndpointPolicies/delete|Deletes a Service Endpoint Policy|
|/serviceEndpointPolicies/join/action|Joins a Service Endpoint Policy|
|/serviceEndpointPolicies/joinSubnet/action|Joins a Subnet To Service Endpoint Policies|
|/serviceEndpointPolicies/serviceEndpointPolicyDefinitions/read|Gets a Service Endpoint Policy Definition Decription|
|/serviceEndpointPolicies/serviceEndpointPolicyDefinitions/write|Creates a Service Endpoint Policy Definition or updates an existing Service Endpoint Policy Definition|
|/serviceEndpointPolicies/serviceEndpointPolicyDefinitions/delete|Deletes a Service Endpoint Policy Definition|
|/virtualnetworkgateways/supportedvpndevices/action|Lists Supported Vpn Devices|
|/virtualNetworkGateways/read|Gets a VirtualNetworkGateway|
|/virtualNetworkGateways/write|Creates or updates a VirtualNetworkGateway|
|/virtualNetworkGateways/delete|Deletes a virtualNetworkGateway|
|/virtualnetworkgateways/generatevpnclientpackage/action|Generate VpnClient package for virtualNetworkGateway|
|/virtualnetworkgateways/generatevpnprofile/action|Generate VpnProfile package for VirtualNetworkGateway|
|/virtualnetworkgateways/getvpnprofilepackageurl/action|Gets the URL of a pre-generated vpn client profile package|
|/virtualnetworkgateways/setvpnclientipsecparameters/action|Set Vpnclient Ipsec parameters for VirtualNetworkGateway P2S client.|
|/virtualnetworkgateways/getvpnclientipsecparameters/action|Get Vpnclient Ipsec parameters for VirtualNetworkGateway P2S client.|
|/virtualnetworkgateways/reset/action|Resets a virtualNetworkGateway|
|/virtualnetworkgateways/getadvertisedroutes/action|Gets virtualNetworkGateway advertised routes|
|/virtualnetworkgateways/getbgppeerstatus/action|Gets virtualNetworkGateway bgp peer status|
|/virtualnetworkgateways/getlearnedroutes/action|Gets virtualnetworkgateway learned routes|
|/virtualNetworkGateways/providers/Microsoft.Insights/metricDefinitions/read|Gets the available metrics for Virtual Network Gateway|
|/virtualNetworkGateways/providers/Microsoft.Insights/diagnosticSettings/read|Gets the Virtual Network Gateway Diagnostic Settings|
|/virtualNetworkGateways/providers/Microsoft.Insights/diagnosticSettings/write|Creates or updates the Virtual Network Gateway diagnostic settings, this operation is supplimented by insights resource provider.|
|/virtualNetworkGateways/providers/Microsoft.Insights/logDefinitions/read|Gets the events for Virtual Network Gateway|
|/virtualnetworkgateways/connections/read|Get VirtualNetworkGatewayConnection|
|/vpnsites/read|Gets a Vpn Site resource.|
|/vpnsites/write|Creates or updates a Vpn Site resource.|
|/vpnsites/delete|Deletes a Vpn Site resource.|
|/applicationGatewayAvailableWafRuleSets/read|Gets Application Gateway Available Waf Rule Sets|
|/applicationSecurityGroups/joinIpConfiguration/action|Joins an IP Configuration to Application Security Groups.|
|/applicationSecurityGroups/joinNetworkSecurityRule/action|Joins a Security Rule to Application Security Groups.|
|/applicationSecurityGroups/read|Gets an Application Security Group ID.|
|/applicationSecurityGroups/write|Creates an Application Security Group, or updates an existing Application Security Group.|
|/applicationSecurityGroups/delete|Deletes an Application Security Group|
|/expressRouteCrossConnections/read|Get Express Route Cross Connection|
|/expressRouteCrossConnections/write|Create or Update Express Route Cross Connection|
|/expressRouteCrossConnections/delete|Delete Express Route Cross Connection|
|/expressRouteCrossConnections/join/action|Joins an Express Route Cross Connection|
|/expressRouteCrossConnections/peerings/read|Gets an Express Route Cross Connection Peering|
|/expressRouteCrossConnections/peerings/write|Creates an Express Route Cross Connection Peering or Updates an existing Express Route Cross Connection Peering|
|/expressRouteCrossConnections/peerings/delete|Deletes an Express Route Cross Connection Peering|
|/expressRouteCrossConnections/peerings/arpTables/action|Gets an Express Route Cross Connection Peering Arp Table|
|/expressRouteCrossConnections/peerings/routeTables/action|Gets an Express Route Cross Connection Peering Route Table|
|/expressRouteCrossConnections/peerings/routeTableSummary/action|Gets an Express Route Cross Connection Peering Route Table Summary|
|/expressRouteCrossConnections/peerings/stats/read|Gets an Express Route Cross Connection Peering Stat|
|/virtualNetworks/read|Get the virtual network definition|
|/virtualNetworks/write|Creates a virtual network or updates an existing virtual network|
|/virtualNetworks/delete|Deletes a virtual network|
|/virtualNetworks/peer/action|Peers a virtual network with another virtual network|
|/virtualNetworks/providers/Microsoft.Insights/metricDefinitions/read|Get the metric definitions of Virtual Network|
|/virtualNetworks/providers/Microsoft.Insights/diagnosticSettings/read|Get the diagnostic settings of Virtual Network|
|/virtualNetworks/providers/Microsoft.Insights/diagnosticSettings/write|Create or update the diagnostic settings of the Virtual Network|
|/virtualNetworks/providers/Microsoft.Insights/logDefinitions/read|Get the log definitions of Virtual Network|
|/virtualNetworks/virtualNetworkPeerings/read|Gets a virtual network peering definition|
|/virtualNetworks/virtualNetworkPeerings/write|Creates a virtual network peering or updates an existing virtual network peering|
|/virtualNetworks/virtualNetworkPeerings/delete|Deletes a virtual network peering|
|/virtualNetworks/subnets/read|Gets a virtual network subnet definition|
|/virtualNetworks/subnets/write|Creates a virtual network subnet or updates an existing virtual network subnet|
|/virtualNetworks/subnets/delete|Deletes a virtual network subnet|
|/virtualNetworks/subnets/join/action|Joins a virtual network|
|/virtualNetworks/subnets/joinViaServiceEndpoint/action|Joins resource such as storage account or SQL database to a subnet.|
|/virtualNetworks/subnets/resourceNavigationLinks/read|Get the Resource Navigation Link definition|
|/virtualNetworks/subnets/resourceNavigationLinks/write|Creates a Resource Navigation Link or updates an existing Resource Navigation Link|
|/virtualNetworks/subnets/resourceNavigationLinks/delete|Deletes a Resource Navigation Link|
|/virtualNetworks/subnets/virtualMachines/read|Gets references to all the virtual machines in a virtual network subnet|
|/virtualNetworks/usages/read|Get the IP usages for each subnet of the virtual network|
|/virtualNetworks/checkIpAddressAvailability/read|Check if Ip Address is available at the specified virtual network|
|/virtualNetworks/remoteVirtualNetworkPeeringProxies/read|Gets a virtual network peering proxy definition|
|/virtualNetworks/remoteVirtualNetworkPeeringProxies/write|Creates a virtual network peering proxy or updates an existing virtual network peering proxy|
|/virtualNetworks/remoteVirtualNetworkPeeringProxies/delete|Deletes a virtual network peering proxy|
|/virtualNetworks/customViews/read|Get definition of a custom view of Virtual Network|
|/virtualNetworks/customViews/get/action|Get a Virtual Network custom view content|
|/virtualNetworks/taggedTrafficConsumers/read|Get the Tagged Traffic Consumer definition|
|/virtualNetworks/taggedTrafficConsumers/write|Creates a Tagged Traffic Consumer or updates an existing Tagged Traffic Consumer|
|/virtualNetworks/taggedTrafficConsumers/delete|Deletes a Tagged Traffic Consumer|
|/virtualNetworks/taggedTrafficConsumers/validate/action|Validates a Tagged Traffic Consumer|
|/virtualNetworks/virtualMachines/read|Gets references to all the virtual machines in a virtual network|
|/expressRouteServiceProviders/read|Gets Express Route Service Providers|
|/dnsoperationresults/read|Gets results of a DNS operation|
|/localnetworkgateways/read|Gets LocalNetworkGateway|
|/localnetworkgateways/write|Creates or updates an existing LocalNetworkGateway|
|/localnetworkgateways/delete|Deletes LocalNetworkGateway|
|/trafficManagerProfiles/read|Get the Traffic Manager profile configuration. This includes DNS settings, traffic routing settings, endpoint monitoring settings, and the list of endpoints routed by this Traffic Manager profile.|
|/trafficManagerProfiles/write|Create a Traffic Manager profile, or modify the configuration of an existing Traffic Manager profile. This includes enabling or disabling a profile and modifying DNS settings, traffic routing settings, or endpoint monitoring settings. Endpoints routed by the Traffic Manager profile can be added, removed, enabled or disabled.|
|/trafficManagerProfiles/delete|Delete the Traffic Manager profile. All settings associated with the Traffic Manager profile will be lost, and the profile can no longer be used to route traffic.|
|/trafficManagerProfiles/providers/Microsoft.Insights/metricDefinitions/read|Gets the available metrics for Traffic Manager.|
|/trafficManagerProfiles/providers/Microsoft.Insights/diagnosticSettings/read|Gets the Traffic Manager Diagnostic Settings|
|/trafficManagerProfiles/providers/Microsoft.Insights/diagnosticSettings/write|Creates or updates the Traffic Manager diagnostic settings, this operation is supplimented by insights resource provider.|
|/trafficManagerProfiles/providers/Microsoft.Insights/logDefinitions/read|Gets the events for Traffic Manager|
|/trafficManagerProfiles/nestedEndpoints/read|Gets an Nested Endpoint which belongs to a Traffic Manager Profile, including all the properties of that Nested Endpoint.|
|/trafficManagerProfiles/nestedEndpoints/write|Add a new Nested Endpoint in an existing Traffic Manager Profile or update the properties of an existing Nested Endpoint in that Traffic Manager Profile.|
|/trafficManagerProfiles/nestedEndpoints/delete|Deletes an Nested Endpoint from an existing Traffic Manager Profile. Traffic Manager will stop routing traffic to the deleted Nested Endpoint.|
|/trafficManagerProfiles/externalEndpoints/read|Gets an External Endpoint which belongs to a Traffic Manager Profile, including all the properties of that External Endpoint.|
|/trafficManagerProfiles/externalEndpoints/write|Add a new External Endpoint in an existing Traffic Manager Profile or update the properties of an existing External Endpoint in that Traffic Manager Profile.|
|/trafficManagerProfiles/externalEndpoints/delete|Deletes an External Endpoint from an existing Traffic Manager Profile. Traffic Manager will stop routing traffic to the deleted External Endpoint.|
|/trafficManagerProfiles/heatMaps/read|Gets the Traffic Manager Heat Map for the given Traffic Manager profile which contains query counts and latency data by location and source IP.|
|/trafficManagerProfiles/azureEndpoints/read|Gets an Azure Endpoint which belongs to a Traffic Manager Profile, including all the properties of that Azure Endpoint.|
|/trafficManagerProfiles/azureEndpoints/write|Add a new Azure Endpoint in an existing Traffic Manager Profile or update the properties of an existing Azure Endpoint in that Traffic Manager Profile.|
|/trafficManagerProfiles/azureEndpoints/delete|Deletes an Azure Endpoint from an existing Traffic Manager Profile. Traffic Manager will stop routing traffic to the deleted Azure Endpoint.|
|/trafficManagerUserMetricsKeys/read|Gets the subscription-level key used for Realtime User Metrics collection.|
|/trafficManagerUserMetricsKeys/write|Creates a new subscription-level key to be used for Realtime User Metrics collection.|
|/trafficManagerUserMetricsKeys/delete|Deletes the subscription-level key used for Realtime User Metrics collection.|
|/dnsoperationstatuses/read|Gets status of a DNS operation |
|/operations/read|Get Available Operations|
|/expressRouteCircuits/read|Get an ExpressRouteCircuit|
|/expressRouteCircuits/write|Creates or updates an existing ExpressRouteCircuit|
|/expressRouteCircuits/delete|Deletes an ExpressRouteCircuit|
|/expressRouteCircuits/stats/read|Gets an ExpressRouteCircuit Stat|
|/expressRouteCircuits/providers/Microsoft.Insights/metricDefinitions/read|Gets the metric definitions for ExpressRoute Circuits|
|/expressRouteCircuits/providers/Microsoft.Insights/diagnosticSettings/read|Gets diagnostic settings for ExpressRoute Circuits|
|/expressRouteCircuits/providers/Microsoft.Insights/diagnosticSettings/write|Creates or updates diagnostic settings for ExpressRoute Circuits|
|/expressRouteCircuits/providers/Microsoft.Insights/logDefinitions/read|Get the events for ExpressRoute Circuits|
|/expressRouteCircuits/peerings/read|Gets an ExpressRouteCircuit Peering|
|/expressRouteCircuits/peerings/write|Creates or updates an existing ExpressRouteCircuit Peering|
|/expressRouteCircuits/peerings/delete|Deletes an ExpressRouteCircuit Peering|
|/expressRouteCircuits/peerings/arpTables/action|Gets an ExpressRouteCircuit Peering ArpTable|
|/expressRouteCircuits/peerings/routeTables/action|Gets an ExpressRouteCircuit Peering RouteTable|
|/expressRouteCircuits/peerings/routeTablesSummary/action|Gets an ExpressRouteCircuit Peering RouteTable Summary|
|/expressRouteCircuits/peerings/stats/read|Gets an ExpressRouteCircuit Peering Stat|
|/expressRouteCircuits/peerings/connections/read|Gets an ExpressRouteCircuit Connection|
|/expressRouteCircuits/peerings/connections/write|Creates or updates an existing ExpressRouteCircuit Connection Resource|
|/expressRouteCircuits/peerings/connections/delete|Deletes an ExpressRouteCircuit Connection|
|/expressRouteCircuits/authorizations/read|Gets an ExpressRouteCircuit Authorization|
|/expressRouteCircuits/authorizations/write|Creates or updates an existing ExpressRouteCircuit Authorization|
|/expressRouteCircuits/authorizations/delete|Deletes an ExpressRouteCircuit Authorization|
|/vpnGateways/read|Gets a VpnGateway.|
|/vpnGateways/write|Puts a VpnGateway.|
|/vpnGateways/vpnConnections/read|Gets a VpnConnection.|
|/vpnGateways/vpnConnections/write|Puts a VpnConnection.|
|/connections/read|Gets VirtualNetworkGatewayConnection|
|/connections/write|Creates or updates an existing VirtualNetworkGatewayConnection|
|/connections/delete|Deletes VirtualNetworkGatewayConnection|
|/connections/sharedkey/action|Get VirtualNetworkGatewayConnection SharedKey|
|/connections/sharedKey/read|Gets VirtualNetworkGatewayConnection SharedKey|
|/connections/sharedKey/write|Creates or updates an existing VirtualNetworkGatewayConnection SharedKey|
|/connections/vpndeviceconfigurationscript/read|Gets Vpn Device Configuration of VirtualNetworkGatewayConnection|
|/networkSecurityGroups/read|Gets a network security group definition|
|/networkSecurityGroups/write|Creates a network security group or updates an existing network security group|
|/networkSecurityGroups/delete|Deletes a network security group|
|/networkSecurityGroups/join/action|Joins a network security group|
|/networksecuritygroups/providers/Microsoft.Insights/diagnosticSettings/read|Gets the Network Security Groups Diagnostic Settings|
|/networksecuritygroups/providers/Microsoft.Insights/diagnosticSettings/write|Creates or updates the Network Security Groups diagnostic settings, this operation is supplimented by insghts resource provider.|
|/networksecuritygroups/providers/Microsoft.Insights/logDefinitions/read|Gets the events for network security group|
|/networkSecurityGroups/defaultSecurityRules/read|Gets a default security rule definition|
|/networkSecurityGroups/securityRules/read|Gets a security rule definition|
|/networkSecurityGroups/securityRules/write|Creates a security rule or updates an existing security rule|
|/networkSecurityGroups/securityRules/delete|Deletes a security rule|
|/applicationGateways/read|Gets an application gateway|
|/applicationGateways/write|Creates an application gateway or updates an application gateway|
|/applicationGateways/delete|Deletes an application gateway|
|/applicationGateways/backendhealth/action|Gets an application gateway backend health|
|/applicationGateways/start/action|Starts an application gateway|
|/applicationGateways/stop/action|Stops an application gateway|
|/applicationGateways/setSecurityCenterConfiguration/action|Sets Application Gateway Security Center Configuration|
|/applicationGateways/effectiveNetworkSecurityGroups/action|Get Route Table configured On Application Gateway|
|/applicationGateways/effectiveRouteTable/action|Get Route Table configured On Application Gateway|
|/applicationGateways/providers/Microsoft.Insights/metricDefinitions/read|Gets the available metrics for Application Gateway|
|/applicationGateways/providers/Microsoft.Insights/logDefinitions/read|Gets the events for Application Gateway|
|/applicationGateways/backendAddressPools/join/action|Joins an application gateway backend address pool|
|/routeTables/read|Gets a route table definition|
|/routeTables/write|Creates a route table or Updates an existing rotue table|
|/routeTables/delete|Deletes a route table definition|
|/routeTables/join/action|Joins a route table|
|/routeTables/routes/read|Gets a route definition|
|/routeTables/routes/write|Creates a route or Updates an existing route|
|/routeTables/routes/delete|Deletes a route definition|
|/ddosProtectionPlans/read|Gets a DDoS Protection Plan|
|/ddosProtectionPlans/write|Creates a DDoS Protection Plan or updates a DDoS Protection Plan |
|/ddosProtectionPlans/delete|Deletes a DDoS Protection Plan|
|/ddosProtectionPlans/join/action|Joins a DDoS Protection Plan|
|/ddosProtectionPlans/ddosProtectionPlanProxies/read|Gets a DDoS Protection Plan Proxy definition|
|/ddosProtectionPlans/ddosProtectionPlanProxies/write|Creates a DDoS Protection Plan Proxy or updates and existing DDoS Protection Plan Proxy|
|/ddosProtectionPlans/ddosProtectionPlanProxies/delete|Deletes a DDoS Protection Plan Proxy|
|/virtualwans/delete|Deletes a Virtual Wan|
|/virtualwans/read|Get a Virtual Wan|
|/virtualwans/write|Create or update a Virtual Wan|
|/virtualwans/vpnconfiguration/read|Gets a Vpn Configuration|
|/virtualwans/vpnSites/read|Gets all VPN Sites that are associated to a Virtual Wan.|
|/virtualWans/virtualHubProxies/read|Gets a Virtual Hub proxy definition|
|/virtualWans/virtualHubProxies/write|Creates a Virtual Hub proxy or updates a Virtual Hub proxy|
|/virtualWans/virtualHubProxies/delete|Deletes a Virtual Hub proxy|
|/virtualwans/virtualHubs/read|Gets all Virtual Hubs that are associated to a Virtual Wan.|
|/virtualWans/vpnSiteProxies/read|Gets a Vpn Site proxy definition|
|/virtualWans/vpnSiteProxies/write|Creates a Vpn Site proxy or updates a Vpn Site proxy|
|/virtualWans/vpnSiteProxies/delete|Deletes a Vpn Site proxy|
|/virtualHubs/delete|Deletes a Virtual Hub|
|/virtualHubs/read|Get a Virtual Hub|
|/virtualHubs/write|Create or update a Virtual Hub|
|/virtualHubs/hubVirtualNetworkConnections/read|Get a HubVirtualNetworkConnection|
|/virtualHubs/hubVirtualNetworkConnections/write|Create or update a HubVirtualNetworkConnection|
|/virtualHubs/hubVirtualNetworkConnections/delete|Deletes a HubVirtualNetworkConnection|
|/locations/operationResults/read|Gets operation result of an async POST or DELETE operation|
|/locations/virtualNetworkAvailableEndpointServices/read|Gets a list of available Virtual Network Endpoint Services|
|/locations/checkDnsNameAvailability/read|Checks if dns label is available at the specified location|
|/locations/usages/read|Gets the resources usage metrics|
|/locations/operations/read|Gets operation resource that represents status of an asynchronous operation|

## Microsoft.NotificationHubs

| Operation | Description |
|---|---|
|/register/action|Registers the subscription for the NotifciationHubs resource provider and enables the creation of Namespaces and NotificationHubs|
|/CheckNamespaceAvailability/action|Checks whether or not a given Namespace resource name is available within the NotificationHub service.|
|/Namespaces/write|Create a Namespace Resource and Update its properties. Tags and Capacity of the Namespace are the properties which can be updated.|
|/Namespaces/read|Get the list of Namespace Resource Description|
|/Namespaces/Delete|Delete Namespace Resource|
|/Namespaces/authorizationRules/action|Get the list of Namespaces Authorization Rules description.|
|/Namespaces/CheckNotificationHubAvailability/action|Checks whether or not a given NotificationHub name is available inside a Namespace.|
|/Namespaces/authorizationRules/write|Create a Namespace level Authorization Rules and update its properties. The Authorization Rules Access Rights, the Primary and Secondary Keys can be updated.|
|/Namespaces/authorizationRules/read|Get the list of Namespaces Authorization Rules description.|
|/Namespaces/authorizationRules/delete|Delete Namespace Authorization Rule. The Default Namespace Authorization Rule cannot be deleted. |
|/Namespaces/authorizationRules/listkeys/action|Get the Connection String to the Namespace|
|/Namespaces/authorizationRules/regenerateKeys/action|Namespace Authorization Rule Regenerate Primary/SecondaryKey, Specify the Key that needs to be regenerated|
|/Namespaces/NotificationHubs/write|Create a Notification Hub and Update its properties. Its properties mainly include PNS Credentials. Authorization Rules and TTL|
|/Namespaces/NotificationHubs/read|Get list of Notification Hub Resource Descriptions|
|/Namespaces/NotificationHubs/Delete|Delete Notification Hub Resource|
|/Namespaces/NotificationHubs/authorizationRules/action|Get the list of Notification Hub Authorization Rules|
|/Namespaces/NotificationHubs/pnsCredentials/action|Get All Notification Hub PNS Credentials. This includes, WNS, MPNS, APNS, GCM and Baidu credentials|
|/Namespaces/NotificationHubs/debugSend/action|Send a test push notification.|
|/Namespaces/NotificationHubs/metricDefinitions/read|Get list of Namespace metrics Resource Descriptions|
|/Namespaces/NotificationHubs/authorizationRules/write|Create Notification Hub Authorization Rules and Update its properties. The Authorization Rules Access Rights, the Primary and Secondary Keys can be updated.|
|/Namespaces/NotificationHubs/authorizationRules/read|Get the list of Notification Hub Authorization Rules|
|/Namespaces/NotificationHubs/authorizationRules/delete|Delete Notification Hub Authorization Rules|
|/Namespaces/NotificationHubs/authorizationRules/listkeys/action|Get the Connection String to the Notification Hub|
|/Namespaces/NotificationHubs/authorizationRules/regenerateKeys/action|Notification Hub Authorization Rule Regenerate Primary/SecondaryKey, Specify the Key that needs to be regenerated|

## Microsoft.OperationalInsights

| Operation | Description |
|---|---|
|/register/action|Register a subscription to a resource provider.|
|/linkTargets/read|Lists existing accounts that are not associated with an Azure subscription. To link this Azure subscription to a workspace, use a customer id returned by this operation in the customer id property of the Create Workspace operation.|
|/workspaces/write|Creates a new workspace or links to an existing workspace by providing the customer id from the existing workspace.|
|/workspaces/read|Gets an existing workspace|
|/workspaces/delete|Deletes a workspace. If the workspace was linked to an existing workspace at creation time then the workspace it was linked to is not deleted.|
|/workspaces/generateregistrationcertificate/action|Generates Registration Certificate for the workspace. This Certificate is used to connect Microsoft System Center Operation Manager to the workspace.|
|/workspaces/sharedKeys/action|Retrieves the shared keys for the workspace. These keys are used to connect Microsoft Operational Insights agents to the workspace.|
|/workspaces/listKeys/action|Retrieves the list keys for the workspace. These keys are used to connect Microsoft Operational Insights agents to the workspace.|
|/workspaces/search/action|Executes a search query|
|/workspaces/purge/action|Delete specified data from workspace|
|/workspaces/metricDefinitions/read|Get Metric Definitions under workspace|
|/workspaces/datasources/read|Get datasources under a workspace.|
|/workspaces/datasources/write|Create/Update datasources under a workspace.|
|/workspaces/datasources/delete|Delete datasources under a workspace.|
|/workspaces/managementGroups/read|Gets the names and metadata for System Center Operations Manager management groups connected to this workspace.|
|/workspaces/linkedServices/read|Get linked services under given workspace.|
|/workspaces/linkedServices/write|Create/Update linked services under given workspace.|
|/workspaces/linkedServices/delete|Delete linked services under given workspace.|
|/workspaces/notificationSettings/read|Get the user's notification settings for the workspace.|
|/workspaces/notificationSettings/write|Set the user's notification settings for the workspace.|
|/workspaces/notificationSettings/delete|Delete the user's notification settings for the workspace.|
|/workspaces/schema/read|Gets the search schema for the workspace.  Search schema includes the exposed fields and their types.|
|/workspaces/usages/read|Gets usage data for a workspace including the amount of data read by the workspace.|
|/workspaces/intelligencepacks/read|Lists all intelligence packs that are visible for a given worksapce and also lists whether the pack is enabled or disabled for that workspace.|
|/workspaces/intelligencepacks/enable/action|Enables an intelligence pack for a given workspace.|
|/workspaces/intelligencepacks/disable/action|Disables an intelligence pack for a given workspace.|
|/workspaces/sharedKeys/read|Retrieves the shared keys for the workspace. These keys are used to connect Microsoft Operational Insights agents to the workspace.|
|/workspaces/api/query/action|Search using new engine.|
|/workspaces/api/query/schema/read|Get search schema V2.|
|/workspaces/savedSearches/read|Gets a saved search query|
|/workspaces/savedSearches/write|Creates a saved search query|
|/workspaces/savedSearches/delete|Deletes a saved search query|
|/workspaces/storageinsightconfigs/write|Creates a new storage configuration. These configurations are used to pull data from a location in an existing storage account.|
|/workspaces/storageinsightconfigs/read|Gets a storage configuration.|
|/workspaces/storageinsightconfigs/delete|Deletes a storage configuration. This will stop Microsoft Operational Insights from reading data from the storage account.|
|/workspaces/analytics/query/action|Search using new engine.|
|/workspaces/analytics/query/schema/read|Get search schema V2.|
|/workspaces/listKeys/read|Retrieves the list keys for the workspace. These keys are used to connect Microsoft Operational Insights agents to the workspace.|
|/workspaces/configurationScopes/read|Get Configuration Scope|
|/workspaces/configurationScopes/write|Set Configuration Scope|
|/workspaces/configurationScopes/delete|Delete Configuration Scope|

## Microsoft.OperationsManagement

| Operation | Description |
|---|---|
|/register/action|Register a subscription to a resource provider.|
|/managementConfigurations/write|Create a new Management Configuration|
|/managementConfigurations/read|Get Existing Management Configuration|
|/managementConfigurations/delete|Delete existing Management Configuratin|
|/managementAssociations/write|Create a new Management Association|
|/managementAssociations/read|Get Existing Management Association|
|/managementAssociations/delete|Delete existing Management Association|
|/solutions/write|Create new OMS solution|
|/solutions/read|Get exiting OMS solution|
|/solutions/delete|Delete existing OMS solution|

## Microsoft.Portal

| Operation | Description |
|---|---|
|/dashboards/read|Reads the dashboards for the subscription.|
|/dashboards/write|Add or modify dashboard to a subscription.|
|/dashboards/delete|Removes the dashboard from the subscription.|

## Microsoft.PowerBIDedicated

| Operation | Description |
|---|---|
|/capacities/read|Retrieves the information of the specified Power BI Dedicated Capacity.|
|/capacities/write|Creates or updates the specified Power BI Dedicated Capacity.|
|/capacities/delete|Deletes the Power BI Dedicated Capacity.|
|/capacities/checkNameAvailability/action|Checks that given Power BI Dedicated Capacity name is valid and not in use.|
|/capacities/providers/Microsoft.Insights/metricDefinitions/read|Gets the available metrics for Power BI Dedicated Capacity.|

## Microsoft.RecoveryServices

| Operation | Description |
|---|---|
|/register/action|Registers subscription for given Resource Provider|
|/Vaults/backupSecurityPIN/action|Returns Security PIN Information for Recovery Services Vault.|
|/Vaults/backupJobsExport/action|Export Jobs|
|/Vaults/write|Create Vault operation creates an Azure resource of type 'vault'|
|/Vaults/read|The Get Vault operation gets an object representing the Azure resource of type 'vault'|
|/Vaults/delete|The Delete Vault operation deletes the specified Azure resource of type 'vault'|
|/Vaults/backupJobsExport/operationResults/read|Returns the Result of Export Job Operation.|
|/Vaults/providers/Microsoft.Insights/metricDefinitions/read|Azure Backup Metrics|
|/Vaults/providers/Microsoft.Insights/diagnosticSettings/read|Azure Backup Diagnostics|
|/Vaults/providers/Microsoft.Insights/diagnosticSettings/write|Azure Backup Diagnostics|
|/Vaults/providers/Microsoft.Insights/logDefinitions/read|Azure Backup Logs|
|/Vaults/backupOperationResults/read|Returns Backup Operation Result for Recovery Services Vault.|
|/Vaults/monitoringAlerts/read|Gets the alerts for the Recovery services vault.|
|/Vaults/monitoringAlerts/write|Resolves the alert.|
|/vaults/replicationEvents/read|Read Any Events|
|/Vaults/backupProtectableItems/read|Returns list of all Protectable Items.|
|/vaults/replicationFabrics/read|Read Any Fabrics|
|/vaults/replicationFabrics/write|Create or Update Any Fabrics|
|/vaults/replicationFabrics/remove/action|Remove Fabric|
|/vaults/replicationFabrics/checkConsistency/action|Checks Consistency of the Fabric|
|/vaults/replicationFabrics/delete|Delete Any Fabrics|
|/vaults/replicationFabrics/renewcertificate/action|Renew Certificate for Fabric|
|/vaults/replicationFabrics/deployProcessServerImage/action|Deploy Process Server Image|
|/vaults/replicationFabrics/reassociateGateway/action|Reassociate Gateway|
|/vaults/replicationFabrics/replicationRecoveryServicesProviders/read|Read Any Recovery Services Providers|
|/vaults/replicationFabrics/replicationRecoveryServicesProviders/write|Create or Update Any Recovery Services Providers|
|/vaults/replicationFabrics/replicationRecoveryServicesProviders/remove/action|Remove Recovery Services Provider|
|/vaults/replicationFabrics/replicationRecoveryServicesProviders/delete|Delete Any Recovery Services Providers|
|/vaults/replicationFabrics/replicationRecoveryServicesProviders/refreshProvider/action|Refresh Provider|
|/vaults/replicationFabrics/replicationStorageClassifications/read|Read Any Storage Classifications|
|/vaults/replicationFabrics/replicationStorageClassifications/replicationStorageClassificationMappings/read|Read Any Storage Classification Mappings|
|/vaults/replicationFabrics/replicationStorageClassifications/replicationStorageClassificationMappings/write|Create or Update Any Storage Classification Mappings|
|/vaults/replicationFabrics/replicationStorageClassifications/replicationStorageClassificationMappings/delete|Delete Any Storage Classification Mappings|
|/vaults/replicationFabrics/replicationvCenters/read|Read Any Jobs|
|/vaults/replicationFabrics/replicationvCenters/write|Create or Update Any Jobs|
|/vaults/replicationFabrics/replicationvCenters/delete|Delete Any Jobs|
|/vaults/replicationFabrics/replicationNetworks/read|Read Any Networks|
|/vaults/replicationFabrics/replicationNetworks/replicationNetworkMappings/read|Read Any Network Mappings|
|/vaults/replicationFabrics/replicationNetworks/replicationNetworkMappings/write|Create or Update Any Network Mappings|
|/vaults/replicationFabrics/replicationNetworks/replicationNetworkMappings/delete|Delete Any Network Mappings|
|/vaults/replicationFabrics/replicationProtectionContainers/read|Read Any Protection Containers|
|/vaults/replicationFabrics/replicationProtectionContainers/discoverProtectableItem/action|Discover Protectable Item|
|/vaults/replicationFabrics/replicationProtectionContainers/write|Create or Update Any Protection Containers|
|/vaults/replicationFabrics/replicationProtectionContainers/remove/action|Remove Protection Container|
|/vaults/replicationFabrics/replicationProtectionContainers/switchprotection/action|Switch Protection Container|
|/vaults/replicationFabrics/replicationProtectionContainers/replicationProtectableItems/read|Read Any Protectable Items|
|/vaults/replicationFabrics/replicationProtectionContainers/replicationProtectionContainerMappings/read|Read Any Protection Container Mappings|
|/vaults/replicationFabrics/replicationProtectionContainers/replicationProtectionContainerMappings/write|Create or Update Any Protection Container Mappings|
|/vaults/replicationFabrics/replicationProtectionContainers/replicationProtectionContainerMappings/remove/action|Remove Protection Container Mapping|
|/vaults/replicationFabrics/replicationProtectionContainers/replicationProtectionContainerMappings/delete|Delete Any Protection Container Mappings|
|/vaults/replicationFabrics/replicationProtectionContainers/replicationProtectedItems/read|Read Any Protected Items|
|/vaults/replicationFabrics/replicationProtectionContainers/replicationProtectedItems/write|Create or Update Any Protected Items|
|/vaults/replicationFabrics/replicationProtectionContainers/replicationProtectedItems/delete|Delete Any Protected Items|
|/vaults/replicationFabrics/replicationProtectionContainers/replicationProtectedItems/remove/action|Remove Protected Item|
|/vaults/replicationFabrics/replicationProtectionContainers/replicationProtectedItems/plannedFailover/action|Planned Failover|
|/vaults/replicationFabrics/replicationProtectionContainers/replicationProtectedItems/unplannedFailover/action|Failover|
|/vaults/replicationFabrics/replicationProtectionContainers/replicationProtectedItems/testFailover/action|Test Failover|
|/vaults/replicationFabrics/replicationProtectionContainers/replicationProtectedItems/testFailoverCleanup/action|Test Failover Cleanup|
|/vaults/replicationFabrics/replicationProtectionContainers/replicationProtectedItems/failoverCommit/action|Failover Commit|
|/vaults/replicationFabrics/replicationProtectionContainers/replicationProtectedItems/reProtect/action|ReProtect Protected Item|
|/vaults/replicationFabrics/replicationProtectionContainers/replicationProtectedItems/updateMobilityService/action|Update Mobility Service|
|/vaults/replicationFabrics/replicationProtectionContainers/replicationProtectedItems/repairReplication/action|Repair replication|
|/vaults/replicationFabrics/replicationProtectionContainers/replicationProtectedItems/applyRecoveryPoint/action|Apply Recovery Point|
|/vaults/replicationFabrics/replicationProtectionContainers/replicationProtectedItems/recoveryPoints/read|Read Any Replication Recovery Points|
|/vaults/replicationPolicies/read|Read Any Policies|
|/vaults/replicationPolicies/write|Create or Update Any Policies|
|/vaults/replicationPolicies/delete|Delete Any Policies|
|/vaults/replicationRecoveryPlans/read|Read Any Recovery Plans|
|/vaults/replicationRecoveryPlans/write|Create or Update Any Recovery Plans|
|/vaults/replicationRecoveryPlans/delete|Delete Any Recovery Plans|
|/vaults/replicationRecoveryPlans/plannedFailover/action|Planned Failover Recovery Plan|
|/vaults/replicationRecoveryPlans/unplannedFailover/action|Failover Recovery Plan|
|/vaults/replicationRecoveryPlans/testFailover/action|Test Failover Recovery Plan|
|/vaults/replicationRecoveryPlans/testFailoverCleanup/action|Test Failover Cleanup Recovery Plan|
|/vaults/replicationRecoveryPlans/failoverCommit/action|Failover Commit Recovery Plan|
|/vaults/replicationRecoveryPlans/reProtect/action|ReProtect Recovery Plan|
|/Vaults/extendedInformation/read|The Get Extended Info operation gets an object's Extended Info representing the Azure resource of type ?vault?|
|/Vaults/extendedInformation/write|The Get Extended Info operation gets an object's Extended Info representing the Azure resource of type ?vault?|
|/Vaults/extendedInformation/delete|The Get Extended Info operation gets an object's Extended Info representing the Azure resource of type ?vault?|
|/Vaults/backupManagementMetaData/read|Returns Backup Management Metadata for Recovery Services Vault.|
|/Vaults/backupProtectionContainers/read|Returns all containers belonging to the subscription|
|/Vaults/backupFabrics/refreshContainers/action|Refreshes the container list|
|/Vaults/backupFabrics/operationResults/read|Returns status of the operation|
|/Vaults/backupFabrics/protectableContainers/read|Get all protectable containers|
|/Vaults/backupFabrics/protectionContainers/read|Returns all registered containers|
|/Vaults/backupFabrics/protectionContainers/write|Creates a registered container|
|/Vaults/backupFabrics/protectionContainers/inquire/action|Do inquiry for workloads within a container|
|/Vaults/backupFabrics/protectionContainers/operationResults/read|Gets result of Operation performed on Protection Container.|
|/Vaults/backupFabrics/protectionContainers/protectedItems/read|Returns object details of the Protected Item|
|/Vaults/backupFabrics/protectionContainers/protectedItems/write|Create a backup Protected Item|
|/Vaults/backupFabrics/protectionContainers/protectedItems/delete|Deletes Protected Item|
|/Vaults/backupFabrics/protectionContainers/protectedItems/backup/action|Performs Backup for Protected Item.|
|/Vaults/backupFabrics/protectionContainers/protectedItems/operationResults/read|Gets Result of Operation Performed on Protected Items.|
|/Vaults/backupFabrics/protectionContainers/protectedItems/operationsStatus/read|Returns the status of Operation performed on Protected Items.|
|/Vaults/backupFabrics/protectionContainers/protectedItems/recoveryPoints/read|Get Recovery Points for Protected Items.|
|/Vaults/backupFabrics/protectionContainers/protectedItems/recoveryPoints/restore/action|Restore Recovery Points for Protected Items.|
|/Vaults/backupFabrics/protectionContainers/protectedItems/recoveryPoints/provisionInstantItemRecovery/action|Provision Instant Item Recovery for Protected Item|
|/Vaults/backupFabrics/protectionContainers/protectedItems/recoveryPoints/revokeInstantItemRecovery/action|Revoke Instant Item Recovery for Protected Item|
|/Vaults/backupFabrics/backupProtectionIntent/write|Create a backup Protection Intent|
|/Vaults/backupFabrics/{fabricName}/protectionContainers/{containerName}/items/read|Get all items in a container|
|/Vaults/usages/read|Returns usage details for a Recovery Services Vault.|
|/vaults/usages/read|Read Any Vault Usages|
|/Vaults/certificates/write|The Update Resource Certificate operation updates the resource/vault credential certificate.|
|/Vaults/tokenInfo/read|Returns token information for Recovery Services Vault.|
|/vaults/replicationAlertSettings/read|Read Any Alerts Settings|
|/vaults/replicationAlertSettings/write|Create or Update Any Alerts Settings|
|/Vaults/backupOperations/read|Returns Backup Operation Status for Recovery Services Vault.|
|/Vaults/backupUsageSummaries/read|Returns summaries for Protected Items and Protected Servers for a Recovery Services .|
|/Vaults/backupstorageconfig/read|Returns Storage Configuration for Recovery Services Vault.|
|/Vaults/backupstorageconfig/write|Updates Storage Configuration for Recovery Services Vault.|
|/Vaults/backupProtectedItems/read|Returns the list of all Protected Items.|
|/Vaults/backupconfig/read|Returns Configuration for Recovery Services Vault.|
|/Vaults/backupconfig/write|Updates Configuration for Recovery Services Vault.|
|/Vaults/registeredIdentities/write|The Register Service Container operation can be used to register a container with Recovery Service.|
|/Vaults/registeredIdentities/read|The Get Containers operation can be used get the containers registered for a resource.|
|/Vaults/registeredIdentities/delete|The UnRegister Container operation can be used to unregister a container.|
|/Vaults/registeredIdentities/operationResults/read|The Get Operation Results operation can be used get the operation status and result for the asynchronously submitted operation|
|/vaults/replicationJobs/read|Read Any Jobs|
|/vaults/replicationJobs/cancel/action|Cancel Job|
|/vaults/replicationJobs/restart/action|Restart job|
|/vaults/replicationJobs/resume/action|Resume Job|
|/Vaults/backupPolicies/read|Returns all Protection Policies|
|/Vaults/backupPolicies/write|Creates Protection Policy|
|/Vaults/backupPolicies/delete|Delete a Protection Policy|
|/Vaults/backupPolicies/operationResults/read|Get Results of Policy Operation.|
|/Vaults/backupPolicies/operations/read|Get Status of Policy Operation.|
|/Vaults/vaultTokens/read|The Vault Token operation can be used to get Vault Token for vault level backend operations.|
|/Vaults/backupEngines/read|Returns all the backup management servers registered with vault.|
|/Vaults/monitoringConfigurations/read|Gets the Recovery services vault notification configuration.|
|/Vaults/monitoringConfigurations/write|Configures e-mail notifications to Recovery services vault.|
|/Vaults/backupJobs/read|Returns all Job Objects|
|/Vaults/backupJobs/cancel/action|Cancel the Job|
|/Vaults/backupJobs/operationResults/read|Returns the Result of Job Operation.|
|/operations/read|Operation returns the list of Operations for a Resource Provider|
|/locations/backupStatus/action|Check Backup Status for Recovery Services Vaults|
|/locations/backupPreValidateProtection/action||
|/locations/backupValidateFeatures/action|Validate Features|
|/locations/allocateStamp/action|AllocateStamp is internal operation used by service|
|/locations/allocatedStamp/read|GetAllocatedStamp is internal operation used by service|

## Microsoft.Relay

| Operation | Description |
|---|---|
|/checkNamespaceAvailability/action|Checks availability of namespace under given subscription. This API is deprecated please use CheckNameAvailabiltiy instead.|
|/checkNameAvailability/action|Checks availability of namespace under given subscription.|
|/register/action|Registers the subscription for the Relay resource provider and enables the creation of Relay resources|
|/unregister/action|Registers the subscription for the Relay resource provider and enables the creation of Relay resources|
|/namespaces/write|Create a Namespace Resource and Update its properties. Tags and Capacity of the Namespace are the properties which can be updated.|
|/namespaces/read|Get the list of Namespace Resource Description|
|/namespaces/Delete|Delete Namespace Resource|
|/namespaces/authorizationRules/action|Updates Namespace Authorization Rule. This API is depricated. Please use a PUT call to update the Namespace Authorization Rule instead.. This operation is not supported on API version 2017-04-01.|
|/namespaces/operationresults/read|Get the status of Namespace operation|
|/namespaces/providers/Microsoft.Insights/metricDefinitions/read|Get list of Namespace metrics Resource Descriptions|
|/namespaces/authorizationRules/read|Get the list of Namespaces Authorization Rules description.|
|/namespaces/authorizationRules/write|Create a Namespace level Authorization Rules and update its properties. The Authorization Rules Access Rights, the Primary and Secondary Keys can be updated.|
|/namespaces/authorizationRules/delete|Delete Namespace Authorization Rule. The Default Namespace Authorization Rule cannot be deleted. |
|/namespaces/authorizationRules/listkeys/action|Get the Connection String to the Namespace|
|/namespaces/authorizationRules/regenerateKeys/action|Regenerate the Primary or Secondary key to the Resource|
|/namespaces/HybridConnections/write|Create or Update HybridConnection properties.|
|/namespaces/HybridConnections/read|Get list of HybridConnection Resource Descriptions|
|/namespaces/HybridConnections/Delete|Operation to delete HybridConnection Resource|
|/namespaces/HybridConnections/authorizationRules/action|Operation to update HybridConnection. This operation is not supported on API version 2017-04-01. Authorization Rules. Please use a PUT call to update Authorization Rule.|
|/namespaces/HybridConnections/authorizationRules/read| Get the list of HybridConnection Authorization Rules|
|/namespaces/HybridConnections/authorizationRules/write|Create HybridConnection Authorization Rules and Update its properties. The Authorization Rules Access Rights can be updated.|
|/namespaces/HybridConnections/authorizationRules/delete|Operation to delete HybridConnection Authorization Rules|
|/namespaces/HybridConnections/authorizationRules/listkeys/action|Get the Connection String to HybridConnection|
|/namespaces/HybridConnections/authorizationRules/regeneratekeys/action|Regenerate the Primary or Secondary key to the Resource|
|/namespaces/disasterrecoveryconfigs/checkNameAvailability/action|Checks availability of namespace alias under given subscription.|
|/namespaces/disasterRecoveryConfigs/write|Creates or Updates the Disaster Recovery configuration associated with the namespace.|
|/namespaces/disasterRecoveryConfigs/read|Gets the Disaster Recovery configuration associated with the namespace.|
|/namespaces/disasterRecoveryConfigs/delete|Deletes the Disaster Recovery configuration associated with the namespace. This operation can only be invoked via the primary namespace.|
|/namespaces/disasterRecoveryConfigs/breakPairing/action|Disables Disaster Recovery and stops replicating changes from primary to secondary namespaces.|
|/namespaces/disasterRecoveryConfigs/failover/action|Invokes a GEO DR failover and reconfigures the namespace alias to point to the secondary namespace.|
|/namespaces/disasterRecoveryConfigs/authorizationRules/read|Get Disaster Recovery Primary Namespace's Authorization Rules|
|/namespaces/disasterRecoveryConfigs/authorizationRules/listkeys/action|Gets the authorization rules keys for the Disaster Recovery primary namespace|
|/namespaces/WcfRelays/write|Create or Update WcfRelay properties.|
|/namespaces/WcfRelays/read|Get list of WcfRelay Resource Descriptions|
|/namespaces/WcfRelays/Delete|Operation to delete WcfRelay Resource|
|/namespaces/WcfRelays/authorizationRules/action|Operation to update WcfRelay. This operation is not supported on API version 2017-04-01. Authorization Rules. Please use a PUT call to update Authorization Rule.|
|/namespaces/WcfRelays/authorizationRules/read| Get the list of WcfRelay Authorization Rules|
|/namespaces/WcfRelays/authorizationRules/write|Create WcfRelay Authorization Rules and Update its properties. The Authorization Rules Access Rights can be updated.|
|/namespaces/WcfRelays/authorizationRules/delete|Operation to delete WcfRelay Authorization Rules|
|/namespaces/WcfRelays/authorizationRules/listkeys/action|Get the Connection String to WcfRelay|
|/namespaces/WcfRelays/authorizationRules/regeneratekeys/action|Regenerate the Primary or Secondary key to the Resource|
|/namespaces/messagingPlan/read|Gets the Messaging Plan for a namespace. This API is deprecated. Properties exposed via the MessagingPlan resource are moved to the (parent) Namespace resource in later API versions.. This operation is not supported on API version 2017-04-01.|
|/namespaces/messagingPlan/write|Updates the Messaging Plan for a namespace. This API is deprecated. Properties exposed via the MessagingPlan resource are moved to the (parent) Namespace resource in later API versions.. This operation is not supported on API version 2017-04-01.|
|/operations/read|Get Operations|

## Microsoft.ResourceHealth

| Operation | Description |
|---|---|
|/register/action|Registers the subscription for the Microsoft ResourceHealth|
|/healthevent/action|Denotes the change in health state for the specified resource|
|/healthevent/Activated/action|Denotes the change in health state for the specified resource|
|/healthevent/Updated/action|Denotes the change in health state for the specified resource|
|/healthevent/Resolved/action|Denotes the change in health state for the specified resource|
|/healthevent/InProgress/action|Denotes the change in health state for the specified resource|
|/healthevent/Pending/action|Denotes the change in health state for the specified resource|
|/AvailabilityStatuses/read|Gets the availability statuses for all resources in the specified scope|
|/AvailabilityStatuses/current/read|Gets the availability status for the specified resource|

## Microsoft.Resources

| Operation | Description |
|---|---|
|/checkResourceName/action|Check the resource name for validity.|
|/providers/read|Get the list of providers.|
|/marketplace/purchase/action|Purchases a resource from the marketplace.|
|/subscriptions/read|Gets the list of subscriptions.|
|/subscriptions/operationresults/read|Get the subscription operation results.|
|/subscriptions/providers/read|Gets or lists resource providers.|
|/subscriptions/tagNames/read|Gets or lists subscription tags.|
|/subscriptions/tagNames/write|Adds a subscription tag.|
|/subscriptions/tagNames/delete|Deletes a subscription tag.|
|/subscriptions/tagNames/tagValues/read|Gets or lists subscription tag values.|
|/subscriptions/tagNames/tagValues/write|Adds a subscription tag value.|
|/subscriptions/tagNames/tagValues/delete|Deletes a subscription tag value.|
|/subscriptions/resources/read|Gets resources of a subscription.|
|/subscriptions/resourceGroups/read|Gets or lists resource groups.|
|/subscriptions/resourceGroups/write|Creates or updates a resource group.|
|/subscriptions/resourceGroups/delete|Deletes a resource group and all its resources.|
|/subscriptions/resourceGroups/moveResources/action|Moves resources from one resource group to another.|
|/subscriptions/resourceGroups/validateMoveResources/action|Validate move of resources from one resource group to another.|
|/subscriptions/resourcegroups/resources/read|Gets the resources for the resource group.|
|/subscriptions/resourcegroups/deployments/read|Gets or lists deployments.|
|/subscriptions/resourcegroups/deployments/write|Creates or updates an deployment.|
|/subscriptions/resourcegroups/deployments/operationstatuses/read|Gets or lists deployment operation statuses.|
|/subscriptions/resourcegroups/deployments/operations/read|Gets or lists deployment operations.|
|/subscriptions/locations/read|Gets the list of locations supported.|
|/links/read|Gets or lists resource links.|
|/links/write|Creates or updates a resource link.|
|/links/delete|Deletes a resource link.|
|/tenants/read|Gets the list of tenants.|
|/resources/read|Get the list of resources based upon filters.|
|/deployments/read|Gets or lists deployments.|
|/deployments/write|Creates or updates an deployment.|
|/deployments/delete|Deletes a deployment.|
|/deployments/cancel/action|Cancels a deployment.|
|/deployments/validate/action|Validates an deployment.|
|/deployments/operations/read|Gets or lists deployment operations.|

## Microsoft.Scheduler

| Operation | Description |
|---|---|
|/jobcollections/read|Get Job Collection|
|/jobcollections/write|Creates or updates job collection.|
|/jobcollections/delete|Deletes job collection.|
|/jobcollections/enable/action|Enables job collection.|
|/jobcollections/disable/action|Disables job collection.|
|/jobcollections/jobs/read|Gets job.|
|/jobcollections/jobs/write|Creates or updates job.|
|/jobcollections/jobs/delete|Deletes job.|
|/jobcollections/jobs/run/action|Runs job.|
|/jobcollections/jobs/generateLogicAppDefinition/action|Generates Logic App definition based on a Scheduler Job.|
|/jobcollections/jobs/jobhistories/read|Gets job history.|

## Microsoft.Search

| Operation | Description |
|---|---|
|/register/action|Registers the subscription for the search resource provider and enables the creation of search services.|
|/checkNameAvailability/action|Checks availability of the service name.|
|/searchServices/write|Creates or updates the search service.|
|/searchServices/read|Reads the search service.|
|/searchServices/delete|Deletes the search service.|
|/searchServices/start/action|Starts the search service.|
|/searchServices/stop/action|Stops the search service.|
|/searchServices/listAdminKeys/action|Reads the admin keys.|
|/searchServices/regenerateAdminKey/action|Regenerates the admin key.|
|/searchServices/createQueryKey/action|Creates the query key.|
|/searchServices/metricDefinitions/read|Gets the available metrics for the search service|
|/searchServices/queryKey/read|Reads the query keys.|
|/searchServices/queryKey/delete|Deletes the query key.|
|/searchServices/diagnosticSettings/read|Gets the diganostic setting read for the resource|
|/searchServices/diagnosticSettings/write|Creates or updates the diganostic setting for the resource|
|/searchServices/logDefinitions/read|Gets the available logs for the search service|

## Microsoft.Security

| Operation | Description |
|---|---|
|/register/action|Registers the subscription for Azure Security Center|
|/securityStatusesSummaries/read|Gets the security statuses summaries for the scope|
|/securitySolutionsReferenceData/read|Gets the security solutions reference data|
|/securityStatuses/read|Gets the security health statuses for Azure resources|
|/webApplicationFirewalls/read|Gets the web application firewalls|
|/webApplicationFirewalls/write|Creates a new web application firewall or updates an existing one|
|/webApplicationFirewalls/delete|Deletes a web application firewall|
|/securitySolutions/read|Gets the security solutions|
|/securitySolutions/write|Creates a new security solution or updates an existing one|
|/securitySolutions/delete|Deletes a security solution|
|/complianceResults/read|Gets the compliance results for the resource|
|/tasks/read|Gets all available security recommendations|
|/alerts/read|Gets all available security alerts|
|/policies/read|Gets the security policy|
|/policies/write|Updates the security policy|
|/workspaceSettings/read|Gets the workspace settings|
|/workspaceSettings/write|Updates the workspace settings|
|/workspaceSettings/delete|Deletes the workspace settings|
|/workspaceSettings/connect/action|Change workspace settings reconnection settings|
|/securityContacts/read|Gets the security contact|
|/securityContacts/write|Updates the security contact|
|/securityContacts/delete|Deletes the security contact|
|/pricings/read|Gets the pricing settings for the scope|
|/pricings/write|Updates the pricing settings for the scope|
|/pricings/delete|Deletes the pricing settings for the scope|
|/locations/read|Gets the security data location|
|/locations/jitNetworkAccessPolicies/read|Gets the just-in-time network access policies|
|/locations/jitNetworkAccessPolicies/write|Creates a new just-in-time network access policy or updates an existing one|
|/locations/jitNetworkAccessPolicies/initiate/action|Initiates a just-in-time network access policy|
|/locations/tasks/read|Gets all available security recommendations|
|/locations/tasks/start/action|Start a security recommendation|
|/locations/tasks/resolve/action|Resolve a security recommendation|
|/locations/tasks/activate/action|Activate a security recommendation|
|/locations/tasks/dismiss/action|Dismiss a security recommendation|
|/locations/alerts/read|Gets all available security alerts|
|/locations/alerts/dismiss/action|Dismiss a security alert|
|/locations/alerts/activate/action|Activate a security alert|
|/applicationWhitelistings/read|Gets the application whitelistings|
|/applicationWhitelistings/write|Creates a new application whitelisting or updates an existing one|

## Microsoft.ServiceBus

| Operation | Description |
|---|---|
|/checkNamespaceAvailability/action|Checks availability of namespace under given subscription. This API is deprecated please use CheckNameAvailabiltiy instead.|
|/checkNameAvailability/action|Checks availability of namespace under given subscription.|
|/register/action|Registers the subscription for the ServiceBus resource provider and enables the creation of ServiceBus resources|
|/unregister/action|Registers the subscription for the ServiceBus resource provider and enables the creation of ServiceBus resources|
|/sku/read|Get list of Sku Resource Descriptions|
|/sku/regions/read|Get list of SkuRegions Resource Descriptions|
|/namespaces/write|Create a Namespace Resource and Update its properties. Tags and Capacity of the Namespace are the properties which can be updated.|
|/namespaces/read|Get the list of Namespace Resource Description|
|/namespaces/Delete|Delete Namespace Resource|
|/namespaces/authorizationRules/action|Updates Namespace Authorization Rule. This API is depricated. Please use a PUT call to update the Namespace Authorization Rule instead.. This operation is not supported on API version 2017-04-01.|
|/namespaces/migrate/action|Migrate namespace operation|
|/namespaces/operationresults/read|Get the status of Namespace operation|
|/namespaces/providers/Microsoft.Insights/metricDefinitions/read|Get list of Namespace metrics Resource Descriptions|
|/namespaces/providers/Microsoft.Insights/diagnosticSettings/read|Get list of Namespace diagnostic settings Resource Descriptions|
|/namespaces/providers/Microsoft.Insights/diagnosticSettings/write|Get list of Namespace diagnostic settings Resource Descriptions|
|/namespaces/providers/Microsoft.Insights/logDefinitions/read|Get list of Namespace logs Resource Descriptions|
|/namespaces/authorizationRules/write|Create a Namespace level Authorization Rules and update its properties. The Authorization Rules Access Rights, the Primary and Secondary Keys can be updated.|
|/namespaces/authorizationRules/read|Get the list of Namespaces Authorization Rules description.|
|/namespaces/authorizationRules/delete|Delete Namespace Authorization Rule. The Default Namespace Authorization Rule cannot be deleted. |
|/namespaces/authorizationRules/listkeys/action|Get the Connection String to the Namespace|
|/namespaces/authorizationRules/regenerateKeys/action|Regenerate the Primary or Secondary key to the Resource|
|/namespaces/eventhubs/read|Get list of EventHub Resource Descriptions|
|/namespaces/disasterrecoveryconfigs/checkNameAvailability/action|Checks availability of namespace alias under given subscription.|
|/namespaces/disasterRecoveryConfigs/write|Creates or Updates the Disaster Recovery configuration associated with the namespace.|
|/namespaces/disasterRecoveryConfigs/read|Gets the Disaster Recovery configuration associated with the namespace.|
|/namespaces/disasterRecoveryConfigs/delete|Deletes the Disaster Recovery configuration associated with the namespace. This operation can only be invoked via the primary namespace.|
|/namespaces/disasterRecoveryConfigs/breakPairing/action|Disables Disaster Recovery and stops replicating changes from primary to secondary namespaces.|
|/namespaces/disasterRecoveryConfigs/failover/action|Invokes a GEO DR failover and reconfigures the namespace alias to point to the secondary namespace.|
|/namespaces/disasterRecoveryConfigs/authorizationRules/read|Get Disaster Recovery Primary Namespace's Authorization Rules|
|/namespaces/disasterRecoveryConfigs/authorizationRules/listkeys/action|Gets the authorization rules keys for the Disaster Recovery primary namespace|
|/namespaces/queues/write|Create or Update Queue properties.|
|/namespaces/queues/read|Get list of Queue Resource Descriptions|
|/namespaces/queues/Delete|Operation to delete Queue Resource|
|/namespaces/queues/authorizationRules/action|Operation to update Queue. This operation is not supported on API version 2017-04-01. Authorization Rules. Please use a PUT call to update Authorization Rule.|
|/namespaces/queues/authorizationRules/write|Create Queue Authorization Rules and Update its properties. The Authorization Rules Access Rights can be updated.|
|/namespaces/queues/authorizationRules/read| Get the list of Queue Authorization Rules|
|/namespaces/queues/authorizationRules/delete|Operation to delete Queue Authorization Rules|
|/namespaces/queues/authorizationRules/listkeys/action|Get the Connection String to Queue|
|/namespaces/queues/authorizationRules/regenerateKeys/action|Regenerate the Primary or Secondary key to the Resource|
|/namespaces/topics/write|Create or Update Topic properties.|
|/namespaces/topics/read|Get list of Topic Resource Descriptions|
|/namespaces/topics/Delete|Operation to delete Topic Resource|
|/namespaces/topics/authorizationRules/action|Operation to update Topic. This operation is not supported on API version 2017-04-01. Authorization Rules. Please use a PUT call to update Authorization Rule.|
|/namespaces/topics/authorizationRules/write|Create Topic Authorization Rules and Update its properties. The Authorization Rules Access Rights can be updated.|
|/namespaces/topics/authorizationRules/read| Get the list of Topic Authorization Rules|
|/namespaces/topics/authorizationRules/delete|Operation to delete Topic Authorization Rules|
|/namespaces/topics/authorizationRules/listkeys/action|Get the Connection String to Topic|
|/namespaces/topics/authorizationRules/regenerateKeys/action|Regenerate the Primary or Secondary key to the Resource|
|/namespaces/topics/subscriptions/write|Create or Update TopicSubscription properties.|
|/namespaces/topics/subscriptions/read|Get list of TopicSubscription Resource Descriptions|
|/namespaces/topics/subscriptions/Delete|Operation to delete TopicSubscription Resource|
|/namespaces/topics/subscriptions/rules/write|Create or Update Rule properties.|
|/namespaces/topics/subscriptions/rules/read|Get list of Rule Resource Descriptions|
|/namespaces/topics/subscriptions/rules/Delete|Operation to delete Rule Resource|
|/namespaces/messagingPlan/read|Gets the Messaging Plan for a namespace. This API is deprecated. Properties exposed via the MessagingPlan resource are moved to the (parent) Namespace resource in later API versions.. This operation is not supported on API version 2017-04-01.|
|/namespaces/messagingPlan/write|Updates the Messaging Plan for a namespace. This API is deprecated. Properties exposed via the MessagingPlan resource are moved to the (parent) Namespace resource in later API versions.. This operation is not supported on API version 2017-04-01.|
|/namespaces/eventGridFilters/write|Creates or Updates the Event Grid filter associated with the namespace.|
|/namespaces/eventGridFilters/read|Gets the Event Grid filter associated with the namespace.|
|/namespaces/eventGridFilters/delete|Deletes the Event Grid filter associated with the namespace.|
|/operations/read|Get Operations|

## Microsoft.ServiceFabric

| Operation | Description |
|---|---|
|/register/action|Register any Action|
|/clusters/read|Read any Cluster|
|/clusters/write|Create or Update any Cluster|
|/clusters/delete|Delete any Cluster|
|/clusters/applications/read|Read any Application|
|/clusters/applications/write|Create or Update any Application|
|/clusters/applications/delete|Delete any Application|
|/clusters/applications/services/read|Read any Service|
|/clusters/applications/services/write|Create or Update any Service|
|/clusters/applications/services/delete|Delete any Service|
|/clusters/applications/services/partitions/read|Read any Partition|
|/clusters/applications/services/partitions/replicas/read|Read any Replica|
|/clusters/applications/services/statuses/read|Read any Service Status|
|/clusters/statuses/read|Read any Cluster Status|
|/clusters/nodes/read|Read any Node|
|/clusters/applicationTypes/read|Read any Application Type|
|/clusters/applicationTypes/write|Create or Update any Application Type|
|/clusters/applicationTypes/delete|Delete any Application Type|
|/clusters/applicationTypes/versions/read|Read any Application Type Version|
|/clusters/applicationTypes/versions/write|Create or Update any Application Type Version|
|/clusters/applicationTypes/versions/delete|Delete any Application Type Version|
|/operations/read|Read any Available Operations|
|/locations/operationresults/read|Read any Operation Results|
|/locations/clusterVersions/read|Read any Cluster Version|
|/locations/environments/clusterVersions/read|Read any Cluster Version for a specific environment|
|/locations/operations/read|Read any Operations by location|

## Microsoft.Solutions

| Operation | Description |
|---|---|
|/register/action|Register to Solutions.|
|/applications/read|Retrieves a list of applications.|
|/applications/write|Creates an application.|
|/applications/delete|Removes an application.|
|/applicationDefinitions/read|Retrieves a list of application definitions.|
|/applicationDefinitions/write|Add or modify an application definition.|
|/applicationDefinitions/delete|Removes an application definition.|
|/locations/operationStatuses/read|Reads the operation status for the resource.|

## Microsoft.Sql

| Operation | Description |
|---|---|
|/unregister/action|UnRegisters the subscription for the Microsoft SQL Database resource provider and enables the creation of Microsoft SQL Databases.|
|/checkNameAvailability/action|Verify whether given server name is available for provisioning worldwide for a given subscription.|
|/register/action|Registers the subscription for the Microsoft SQL Database resource provider and enables the creation of Microsoft SQL Databases.|
|/servers/import/action|Create a new database on the server and deploy schema and data from a DacPac package|
|/servers/read|Return the list of servers or gets the properties for the specified server.|
|/servers/write|Creates a server with the specified parameters or update the properties or tags for the specified server.|
|/servers/delete|Deletes an existing server.|
|/servers/automaticTuning/read|Returns automatic tuning settings for the server|
|/servers/automaticTuning/write|Updates automatic tuning settings for the server and returns updated settings|
|/servers/operationResults/read|Gets in-progress server operations|
|/servers/securityAlertPolicies/read|Retrieve details of the server threat detection policy configured on a given server|
|/servers/securityAlertPolicies/write|Change the server threat detection policy for a given server|
|/servers/securityAlertPolicies/operationResults/read|Retrieve results of the server threat detection policy write operation|
|/servers/providers/Microsoft.Insights/metricDefinitions/read|Return types of metrics that are available for servers|
|/servers/administrators/read|Retrieve server administrator details|
|/servers/administrators/write|Create or update server administrator|
|/servers/administrators/delete|Delete server administrator|
|/servers/recoverableDatabases/read|This operation is used for disaster recovery of live database to restore database to last-known good backup point. It returns information about the last good backup but it doesn\u0027t actually restore the database.|
|/servers/serviceObjectives/read|Retrieve list of service level objectives (also known as performance tiers) available on a given server|
|/servers/firewallRules/write|Creates a server firewall rule with the specified parameters, update the properties for the specified rule or overwrite all existing rules with new server firewall rule(s).|
|/servers/firewallRules/read|Return the list of server firewall rules or gets the properties for the specified server firewall rule.|
|/servers/firewallRules/delete|Deletes an existing server firewall rule.|
|/servers/administratorOperationResults/read|Gets in-progress operations on server administrators|
|/servers/connectionPolicies/read|Return the list of server connection policies of a specified server.|
|/servers/connectionPolicies/write|Create or update a server connection policy.|
|/servers/recommendedElasticPools/read|Retrieve recommendation for elastic database pools to reduce cost or improve performance based on historica resource utilization|
|/servers/recommendedElasticPools/databases/read|Retrieve metrics for recommended elastic database pools for a given server|
|/servers/encryptionProtector/read|Returns a list of server encryption protectors or gets the properties for the specified server encryption protector.|
|/servers/encryptionProtector/write|Update the properties for the specified Server Encryption Protector.|
|/servers/elasticPools/read|Retrieve details of elastic pool on a given server|
|/servers/elasticPools/write|Create a new or change properties of existing elastic pool|
|/servers/elasticPools/delete|Delete existing elastic pool|
|/servers/elasticPools/providers/Microsoft.Insights/metricDefinitions/read|Return types of metrics that are available for elastic database pools|
|/servers/elasticPools/providers/Microsoft.Insights/diagnosticSettings/read|Gets the diagnostic setting for the resource|
|/servers/elasticPools/providers/Microsoft.Insights/diagnosticSettings/write|Creates or updates the diagnostic setting for the resource|
|/servers/elasticPools/metricDefinitions/read|Return types of metrics that are available for elastic database pools|
|/servers/elasticPools/metrics/read|Return metrics for elastic database pools|
|/servers/elasticPools/elasticPoolDatabaseActivity/read|Retrieve activities and details on a given database that is part of elastic database pool|
|/servers/elasticPools/advisors/read|Returns list of advisors available for the elastic pool|
|/servers/elasticPools/advisors/write|Update auto-execute status of an advisor on elastic pool level.|
|/servers/elasticPools/advisors/recommendedActions/read|Returns list of recommended actions of specified advisor for the elastic pool|
|/servers/elasticPools/advisors/recommendedActions/write|Apply the recommended action on the elastic pool|
|/servers/elasticPools/skus/read|Gets a collection of skus available for this elastic pool|
|/servers/elasticPools/operations/cancel/action|Cancels Azure SQL elastic pool pending asynchronous operation that is not finished yet.|
|/servers/elasticPools/operations/read|Return the list of operations performed on the elastic pool|
|/servers/elasticPools/elasticPoolActivity/read|Retrieve activities and details on a given elastic database pool|
|/servers/elasticPools/databases/read|Gets a list of databases for an elastic pool|
|/servers/auditingPolicies/read|Retrieve details of the default server table auditing policy configured on a given server|
|/servers/auditingPolicies/write|Change the default server table auditing for a given server|
|/servers/disasterRecoveryConfiguration/read|Gets a collection of disaster recovery configurations that include this server|
|/servers/disasterRecoveryConfiguration/write|Change server disaster recovery configuration|
|/servers/disasterRecoveryConfiguration/delete|Deletes an existing disaster recovery configurations for a given server|
|/servers/disasterRecoveryConfiguration/failover/action|Failover a DisasterRecoveryConfiguration|
|/servers/disasterRecoveryConfiguration/forceFailoverAllowDataLoss/action|Force Failover a DisasterRecoveryConfiguration|
|/servers/extendedAuditingSettings/read|Retrieve details of the extended server blob auditing policy configured on a given server|
|/servers/extendedAuditingSettings/write|Change the extended server blob auditing for a given server|
|/servers/keys/read|Return the list of server keys or gets the properties for the specified server key.|
|/servers/keys/write|Creates a key with the specified parameters or update the properties or tags for the specified server key.|
|/servers/keys/delete|Deletes an existing server key.|
|/servers/advisors/read|Returns list of advisors available for the server|
|/servers/advisors/write|Updates auto-execute status of an advisor on server level.|
|/servers/advisors/recommendedActions/read|Returns list of recommended actions of specified advisor for the server|
|/servers/advisors/recommendedActions/write|Apply the recommended action on the server|
|/servers/virtualNetworkRules/read|Return the list of virtual network rules or gets the properties for the specified virtual network rule.|
|/servers/virtualNetworkRules/write|Creates a virtual network rule with the specified parameters or update the properties or tags for the specified virtual network rule.|
|/servers/virtualNetworkRules/delete|Deletes an existing Virtual Network Rule|
|/servers/usages/read|Return server DTU quota and current DTU consuption by all databases within the server|
|/servers/elasticPoolEstimates/read|Returns list of elastic pool estimates already created for this server|
|/servers/elasticPoolEstimates/write|Creates new elastic pool estimate for list of databases provided|
|/servers/failoverGroups/read|Returns the list of failover groups or gets the properties for the specified failover group.|
|/servers/failoverGroups/write|Creates a failover group with the specified parameters or updates the properties or tags for the specified failover group.|
|/servers/failoverGroups/delete|Deletes an existing failover group.|
|/servers/failoverGroups/failover/action|Executes planned failover in an existing failover group.|
|/servers/failoverGroups/forceFailoverAllowDataLoss/action|Executes forced failover in an existing failover group.|
|/servers/communicationLinks/read|Return the list of communication links of a specified server.|
|/servers/communicationLinks/write|Create or update a server communication link.|
|/servers/communicationLinks/delete|Deletes an existing server communication link.|
|/servers/auditingSettings/read|Retrieve details of the server blob auditing policy configured on a given server|
|/servers/auditingSettings/write|Change the server blob auditing for a given server|
|/servers/auditingSettings/operationResults/read|Retrieve result of the server blob auditing policy Set operation|
|/servers/backupLongTermRetentionVaults/read|This operation is used to get a backup long term retention vault. It returns information about the vault registered to this server|
|/servers/backupLongTermRetentionVaults/write|This operation is used to register a backup long term retention vault to a server|
|/servers/backupLongTermRetentionVaults/delete|Deletes an existing backup archival vault.|
|/servers/syncAgents/read|Return the list of sync agents or gets the properties for the specified sync agent.|
|/servers/syncAgents/write|Creates a sync agent with the specified parameters or update the properties for the specified sync agent.|
|/servers/syncAgents/delete|Deletes an existing sync agent.|
|/servers/syncAgents/generateKey/action|Generate sync agent registeration key|
|/servers/syncAgents/linkedDatabases/read|Return the list of sync agent linked databases|
|/servers/restorableDroppedDatabases/read|Get a list of databases that were dropped on a given server that are still within retention policy.|
|/servers/databases/restorePoints/action|Creates a new restore point|
|/servers/databases/upgradeDataWarehouse/action|Upgrade Azure SQL Datawarehouse Database|
|/servers/databases/export/action|Export Azure SQL Database|
|/servers/databases/pause/action|Pause Azure SQL Datawarehouse Database|
|/servers/databases/resume/action|Resume Azure SQL Datawarehouse Database|
|/servers/databases/read|Return the list of databases or gets the properties for the specified database.|
|/servers/databases/write|Creates a database with the specified parameters or update the properties or tags for the specified database.|
|/servers/databases/delete|Deletes an existing database.|
|/servers/databases/move/action|Rename Azure SQL Database|
|/servers/databases/vulnerabilityAssessmentScans/action|Execute vulnerability assessment database scan.|
|/servers/databases/automaticTuning/read|Returns automatic tuning settings for a database|
|/servers/databases/automaticTuning/write|Updates automatic tuning settings for a database and returns updated settings|
|/servers/databases/operationResults/read|Gets the status of a database operation.|
|/servers/databases/replicationLinks/read|Return details about replication links established for a particular database|
|/servers/databases/replicationLinks/delete|Terminate the replication relationship forcefully and with potential data loss|
|/servers/databases/replicationLinks/failover/action|Failover after synchronizing all changes from the primary, making this database into the replication relationship\u0027s primary and making the remote primary into a secondary|
|/servers/databases/replicationLinks/forceFailoverAllowDataLoss/action|Failover immediately with potential data loss, making this database into the replication relationship\u0027s primary and making the remote primary into a secondary|
|/servers/databases/replicationLinks/updateReplicationMode/action|Update replication mode for link to synchronous or asynchronous mode|
|/servers/databases/replicationLinks/unlink/action|Terminate the replication relationship forcefully or after synchronizing with the partner|
|/servers/databases/dataMaskingPolicies/read|Return the list of database data masking policies.|
|/servers/databases/dataMaskingPolicies/write|Change data masking policy for a given database|
|/servers/databases/dataMaskingPolicies/rules/read|Retrieve details of the data masking policy rule configured on a given database|
|/servers/databases/dataMaskingPolicies/rules/write|Change data masking policy rule for a given database|
|/servers/databases/dataMaskingPolicies/rules/delete|Delete data masking policy rule for a given database|
|/servers/databases/securityAlertPolicies/read|Retrieve details of the threat detection policy configured on a given database|
|/servers/databases/securityAlertPolicies/write|Change the threat detection policy for a given database|
|/servers/databases/providers/Microsoft.Insights/metricDefinitions/read|Return types of metrics that are available for databases|
|/servers/databases/providers/Microsoft.Insights/diagnosticSettings/read|Gets the diagnostic setting for the resource|
|/servers/databases/providers/Microsoft.Insights/diagnosticSettings/write|Creates or updates the diagnostic setting for the resource|
|/servers/databases/providers/Microsoft.Insights/logDefinitions/read|Gets the available logs for databases|
|/servers/databases/vulnerabilityAssessmentScans/operationResults/read|Retrieve the result of the database vulnerability assessment scan Execute operation|
|/servers/databases/metricDefinitions/read|Return types of metrics that are available for databases|
|/servers/databases/topQueries/queryText/action|Returns the Transact-SQL text for selected query ID|
|/servers/databases/topQueries/read|Returns aggregated runtime statistics for selected query in selected time period|
|/servers/databases/topQueries/statistics/read|Returns aggregated runtime statistics for selected query in selected time period|
|/servers/databases/connectionPolicies/read|Retrieve details of the connection policy configured on a given database|
|/servers/databases/connectionPolicies/write|Change connection policy for a given database|
|/servers/databases/dataWarehouseUserActivities/read|Retrieves the user activities of a SQL Data Warehouse instance which includes running and suspended queries|
|/servers/databases/metrics/read|Return metrics for databases|
|/servers/databases/azureAsyncOperation/read|Gets the status of a database operation.|
|/servers/databases/syncGroups/refreshHubSchema/action|Refresh sync hub database schema|
|/servers/databases/syncGroups/cancelSync/action|Cancel sync group synchronization|
|/servers/databases/syncGroups/triggerSync/action|Trigger sync group synchronization|
|/servers/databases/syncGroups/read|Return the list of sync groups or gets the properties for the specified sync group.|
|/servers/databases/syncGroups/write|Creates a sync group with the specified parameters or update the properties for the specified sync group.|
|/servers/databases/syncGroups/delete|Deletes an existing sync group.|
|/servers/databases/syncGroups/refreshHubSchemaOperationResults/read|Retrieve result of the sync hub schema refresh operation|
|/servers/databases/syncGroups/syncMembers/read|Return the list of sync members or gets the properties for the specified sync member.|
|/servers/databases/syncGroups/syncMembers/write|Creates a sync member with the specified parameters or update the properties for the specified sync member.|
|/servers/databases/syncGroups/syncMembers/delete|Deletes an existing sync member.|
|/servers/databases/syncGroups/syncMembers/refreshSchema/action|Refresh sync member schema|
|/servers/databases/syncGroups/syncMembers/refreshSchemaOperationResults/read|Retrieve result of the sync member schema refresh operation|
|/servers/databases/syncGroups/syncMembers/schemas/read|Return the list of sync member database schemas|
|/servers/databases/syncGroups/logs/read|Return the list of sync group logs|
|/servers/databases/syncGroups/hubSchemas/read|Return the list of sync hub database schemas|
|/servers/databases/auditRecords/read|Retrieve the database blob audit records|
|/servers/databases/transparentDataEncryption/read|Retrieve status and details of transparent data encryption security feature for a given database|
|/servers/databases/transparentDataEncryption/write|Change transparent data encryption state|
|/servers/databases/transparentDataEncryption/operationResults/read|Gets in-progress operations on transparent data encryption|
|/servers/databases/auditingPolicies/read|Retrieve details of the table auditing policy configured on a given database|
|/servers/databases/auditingPolicies/write|Change the table auditing policy for a given database|
|/servers/databases/restorePoints/read|Returns restore points for the database.|
|/servers/databases/vulnerabilityAssessments/read|Retrieve details of the vulnerability assessment configured on a given database|
|/servers/databases/vulnerabilityAssessments/write|Change the vulnerability assessment for a given database|
|/servers/databases/vulnerabilityAssessments/delete|Remove the vulnerability assessment for a given database|
|/servers/databases/vulnerabilityAssessments/scans/action|Execute vulnerability assessment database scan.|
|/servers/databases/vulnerabilityAssessments/scans/read|Return the list of database vulnerability assessment scan records or get the scan record for the specified scan ID.|
|/servers/databases/vulnerabilityAssessments/scans/export/action|Convert an existing scan result to a human readable format. If already exists nothing happens|
|/servers/databases/vulnerabilityAssessments/rules/baselines/delete|Remove the vulnerability assessment rule baseline for a given database|
|/servers/databases/vulnerabilityAssessments/rules/baselines/write|Change the vulnerability assessment rule baseline for a given database|
|/servers/databases/vulnerabilityAssessments/rules/baselines/read|Get the vulnerability assessment rule baseline for a given database|
|/servers/databases/dataWarehouseQueries/read|Returns the data warehouse distribution query information for selected query ID|
|/servers/databases/dataWarehouseQueries/dataWarehouseQuerySteps/read|Returns the distributed query step information of data warehouse query for selected step ID|
|/servers/databases/extendedAuditingSettings/read|Retrieve details of the extended blob auditing policy configured on a given database|
|/servers/databases/extendedAuditingSettings/write|Change the extended blob auditing policy for a given database|
|/servers/databases/sensitivityLabels/read|List sensitivity labels of a given database|
|/servers/databases/serviceTierAdvisors/read|Return suggestion about scaling database up or down based on query execution statistics to improve performance or reduce cost|
|/servers/databases/extensions/read|Gets a collection of extensions for the database.|
|/servers/databases/extensions/write|Change the extension for a given database|
|/servers/databases/advisors/read|Returns list of advisors available for the database|
|/servers/databases/advisors/write|Update auto-execute status of an advisor on database level.|
|/servers/databases/advisors/recommendedActions/read|Returns list of recommended actions of specified advisor for the database|
|/servers/databases/advisors/recommendedActions/write|Apply the recommended action on the database|
|/servers/databases/geoBackupPolicies/read|Retrieve geo backup policies for a given database|
|/servers/databases/geoBackupPolicies/write|Create or update a database geobackup policy|
|/servers/databases/vulnerabilityAssessmentSettings/read|Retrieve details of the vulnerability assessment configured on a given database|
|/servers/databases/vulnerabilityAssessmentSettings/write|Change the vulnerability assessment for a given database|
|/servers/databases/usages/read|Gets the Azure SQL Database usages information|
|/servers/databases/operations/cancel/action|Cancels Azure SQL Database pending asynchronous operation that is not finished yet.|
|/servers/databases/operations/read|Return the list of operations performed on the database|
|/servers/databases/backupLongTermRetentionPolicies/write|Create or update a database backup archival policy.|
|/servers/databases/backupLongTermRetentionPolicies/read|Return the list of backup archival policies of a specified database.|
|/servers/databases/queryStore/read|Returns current values of Query Store settings for the database.|
|/servers/databases/queryStore/write|Updates Query Store setting for the database|
|/servers/databases/queryStore/queryTexts/read|Returns the collection of query texts that correspond to the specified parameters.|
|/servers/databases/auditingSettings/read|Retrieve details of the blob auditing policy configured on a given database|
|/servers/databases/auditingSettings/write|Change the blob auditing policy for a given database|
|/servers/databases/schemas/read|Retrieve list of schemas of a database|
|/servers/databases/schemas/tables/read|Retrieve list of tables of a database|
|/servers/databases/schemas/tables/recommendedIndexes/read|Retrieve list of index recommendations on a database|
|/servers/databases/schemas/tables/recommendedIndexes/write|Apply index recommendation|
|/servers/databases/schemas/tables/columns/read|Retrieve list of columns of a table|
|/servers/databases/schemas/tables/columns/sensitivityLabels/read|Get the sensitivity label of a given column|
|/servers/databases/schemas/tables/columns/sensitivityLabels/write|Create or update the sensitivity label of a given column|
|/servers/databases/schemas/tables/columns/sensitivityLabels/delete|Delete the sensitivity label of a given column|
|/servers/databases/securityMetrics/read|Gets a collection of database security metrics|
|/servers/databases/importExportOperationResults/read|Gets in-progress import/export operations|
|/servers/importExportOperationResults/read|Gets in-progress import/export operations|
|/virtualClusters/read|Return the list of virtual clusters or gets the properties for the specified virtual cluster.|
|/virtualClusters/write|Updates virtual cluster tags.|
|/operations/read|Gets available REST operations|
|/managedInstances/read|Return the list of managed instances or gets the properties for the specified managed instance.|
|/managedInstances/write|Creates a managed instance with the specified parameters or update the properties or tags for the specified managed instance.|
|/managedInstances/delete|Deletes an existing  managed instance.|
|/managedInstances/securityAlertPolicies/read|Retrieve details of the managed server threat detection policy configured on a given managed server|
|/managedInstances/securityAlertPolicies/write|Change the managed server threat detection policy for a given managed server|
|/managedInstances/administrators/read|Gets a list of managed instance administrators.|
|/managedInstances/administrators/write|Creates or updates managed instance administrator with the specified parameters.|
|/managedInstances/administrators/delete|Deletes an existing administrator of managed instance.|
|/managedInstances/metricDefinitions/read|Get managed instance metric definitions|
|/managedInstances/metrics/read|Get managed instance metrics|
|/managedInstances/databases/read|Gets existing managed database|
|/managedInstances/databases/delete|Deletes an existing managed database|
|/managedInstances/databases/write|Creates a new database or updates an existing database.|
|/managedInstances/databases/securityAlertPolicies/read|Retrieve details of the database threat detection policy configured on a given managed database|
|/managedInstances/databases/securityAlertPolicies/write|Change the database threat detection policy for a given managed database|
|/managedInstances/databases/transparentDataEncryption/read|Retrieve details of the database Transparent Data Encryption on a given managed database|
|/managedInstances/databases/transparentDataEncryption/write|Change the database Transparent Data Encryption for a given managed database|
|/managedInstances/databases/securityEvents/read|Retrieves the managed database security events|
|/locations/read|Gets the available locations for a given subscription|
|/locations/deleteVirtualNetworkOrSubnets/action|Deletes Virtual network rules associated to a virtual network or subnet|
|/locations/extendedAuditingSettingsAzureAsyncOperation/read|Retrieve result of the extended server blob auditing policy Set operation|
|/locations/capabilities/read|Gets the capabilities for this subscription in a given location|
|/locations/virtualNetworkRulesOperationResults/read|Returns the details of the specified virtual network rules operation |
|/locations/auditingSettingsOperationResults/read|Retrieve result of the server blob auditing policy Set operation|
|/locations/managedTransparentDataEncryptionAzureAsyncOperation/read|Gets in-progress operations on managed database transparent data encryption|
|/locations/extendedAuditingSettingsOperationResults/read|Retrieve result of the extended server blob auditing policy Set operation|
|/locations/managedDatabaseRestoreAzureAsyncOperation/completeRestore/action|Completes managed database restore operation|
|/locations/databaseAzureAsyncOperation/read|Gets the status of a database operation.|
|/locations/virtualNetworkRulesAzureAsyncOperation/read|Returns the details of the specified virtual network rules azure async operation |
|/locations/elasticPoolOperationResults/read|Gets the result of an elastic pool operation.|
|/locations/syncMemberOperationResults/read|Retrieve result of the sync member resource operation|
|/locations/deletedServers/read|Return the list of deleted servers or gets the properties for the specified deleted server.|
|/locations/deletedServers/recover/action|Recover a deleted server|
|/locations/managedTransparentDataEncryptionOperationResults/read|Gets in-progress operations on managed database transparent data encryption|
|/locations/databaseOperationResults/read|Gets the status of a database operation.|
|/locations/usages/read|Gets a collection of usage metrics for this subscription in a location|
|/locations/syncDatabaseIds/read|Retrieve the sync database ids for a particular region and subscription|
|/locations/deletedServerAsyncOperation/read|Gets in-progress operations on deleted server|
|/locations/elasticPoolAzureAsyncOperation/read|Gets the azure async operation for an elastic pool async operation|
|/locations/deletedServerOperationResults/read|Gets in-progress operations on deleted server|
|/locations/syncAgentOperationResults/read|Retrieve result of the sync agent resource operation|
|/locations/auditingSettingsAzureAsyncOperation/read|Retrieve result of the extended server blob auditing policy Set operation|
|/locations/syncGroupOperationResults/read|Retrieve result of the sync group resource operation|

## Microsoft.Storage

| Operation | Description |
|---|---|
|/register/action|Registers the subscription for the storage resource provider and enables the creation of storage accounts.|
|/checknameavailability/read|Checks that account name is valid and is not in use.|
|/storageAccounts/listkeys/action|Returns the access keys for the specified storage account.|
|/storageAccounts/regeneratekey/action|Regenerates the access keys for the specified storage account.|
|/storageAccounts/delete|Deletes an existing storage account.|
|/storageAccounts/read|Returns the list of storage accounts or gets the properties for the specified storage account.|
|/storageAccounts/listAccountSas/action|Returns the Account SAS token for the specified storage account.|
|/storageAccounts/listServiceSas/action|Returns the Service SAS token for the specified storage account.|
|/storageAccounts/write|Creates a storage account with the specified parameters or update the properties or tags or adds custom domain for the specified storage account.|
|/storageAccounts/providers/Microsoft.Insights/metricDefinitions/read|Get list of Microsoft Storage Metrics definitions.|
|/storageAccounts/providers/Microsoft.Insights/diagnosticSettings/read|Gets the diagnostic setting for the resource.|
|/storageAccounts/providers/Microsoft.Insights/diagnosticSettings/write|Creates or updates the diagnostic setting for the resource.|
|/storageAccounts/blobServices/write|Returns the result of put blob service properties|
|/storageAccounts/blobServices/read|Returns blob service properties or statistics|
|/storageAccounts/blobServices/providers/Microsoft.Insights/metricDefinitions/read|Get list of Microsoft Storage Metrics definitions.|
|/storageAccounts/blobServices/providers/Microsoft.Insights/diagnosticSettings/read|Gets the diagnostic setting for the resource.|
|/storageAccounts/blobServices/providers/Microsoft.Insights/diagnosticSettings/write|Creates or updates the diagnostic setting for the resource.|
|/storageAccounts/blobServices/containers/delete|Returns the result of deleting a container|
|/storageAccounts/blobServices/containers/read|Returns a container or a list of containers|
|/storageAccounts/blobServices/containers/write|Returns the result of put or lease blob container|
|/storageAccounts/blobServices/containers/clearLegalHold/action|Clear blob container legal hold|
|/storageAccounts/blobServices/containers/setLegalHold/action|Set blob container legal hold|
|/storageAccounts/blobServices/containers/immutabilityPolicies/extend/action|Extend blob container immutability policy|
|/storageAccounts/blobServices/containers/immutabilityPolicies/delete|Delete blob container immutability policy|
|/storageAccounts/blobServices/containers/immutabilityPolicies/write|Put blob container immutability policy|
|/storageAccounts/blobServices/containers/immutabilityPolicies/lock/action|Lock blob container immutability policy|
|/storageAccounts/blobServices/containers/immutabilityPolicies/read|Get blob container immutability policy|
|/storageAccounts/tableServices/providers/Microsoft.Insights/metricDefinitions/read|Get list of Microsoft Storage Metrics definitions.|
|/storageAccounts/tableServices/providers/Microsoft.Insights/diagnosticSettings/read|Gets the diagnostic setting for the resource.|
|/storageAccounts/tableServices/providers/Microsoft.Insights/diagnosticSettings/write|Creates or updates the diagnostic setting for the resource.|
|/storageAccounts/storageAccounts/queueServices/providers/Microsoft.Insights/diagnosticSettings/read|Gets the diagnostic setting for the resource.|
|/storageAccounts/fileServices/providers/Microsoft.Insights/metricDefinitions/read|Get list of Microsoft Storage Metrics definitions.|
|/storageAccounts/fileServices/providers/Microsoft.Insights/diagnosticSettings/read|Gets the diagnostic setting for the resource.|
|/storageAccounts/fileServices/providers/Microsoft.Insights/diagnosticSettings/write|Creates or updates the diagnostic setting for the resource.|
|/storageAccounts/queueServices/read|Returns queue service properties or statistics.|
|/storageAccounts/queueServices/write|Returns the result of setting queue service properties|
|/storageAccounts/queueServices/providers/Microsoft.Insights/metricDefinitions/read|Get list of Microsoft Storage Metrics definitions.|
|/storageAccounts/queueServices/providers/Microsoft.Insights/diagnosticSettings/write|Creates or updates the diagnostic setting for the resource.|
|/storageAccounts/queueServices/queues/read|Returns a queue or a list of queues.|
|/storageAccounts/queueServices/queues/write|Returns the result of writing a queue|
|/storageAccounts/queueServices/queues/delete|Returns the result of deleting a queue|
|/storageAccounts/services/diagnosticSettings/write|Create/Update storage account diagnostic settings.|
|/skus/read|Lists the Skus supported by Microsoft.Storage.|
|/usages/read|Returns the limit and the current usage count for resources in the specified subscription|
|/operations/read|Polls the status of an asynchronous operation.|
|/locations/deleteVirtualNetworkOrSubnets/action|Notifies Microsoft.Storage that virtual network or subnet is being deleted|

## Microsoft.StorageSync

| Operation | Description |
|---|---|
|/storageSyncServices/read|Read any Storage Sync Services|
|/storageSyncServices/write|Create or Update any Storage Sync Services|
|/storageSyncServices/delete|Delete any Storage Sync Services|
|/storageSyncServices/providers/Microsoft.Insights/metricDefinitions/read|Gets the available metrics for Storage Sync Services|
|/storageSyncServices/registeredServers/read|Read any Registered Server|
|/storageSyncServices/registeredServers/write|Create or Update any Registered Server|
|/storageSyncServices/registeredServers/delete|Delete any Registered Server|
|/storageSyncServices/syncGroups/read|Read any Sync Groups|
|/storageSyncServices/syncGroups/write|Create or Update any Sync Groups|
|/storageSyncServices/syncGroups/delete|Delete any Sync Groups|
|/storageSyncServices/syncGroups/serverEndpoints/read|Read any Server Endpoints|
|/storageSyncServices/syncGroups/serverEndpoints/write|Create or Update any Server Endpoints|
|/storageSyncServices/syncGroups/serverEndpoints/delete|Delete any Server Endpoints|
|/storageSyncServices/syncGroups/serverEndpoints/recallAction/action|Call this action to recall files to a server|
|/storageSyncServices/syncGroups/cloudEndpoints/read|Read any Cloud Endpoints|
|/storageSyncServices/syncGroups/cloudEndpoints/write|Create or Update any Cloud Endpoints|
|/storageSyncServices/syncGroups/cloudEndpoints/delete|Delete any Cloud Endpoints|
|/storageSyncServices/syncGroups/cloudEndpoints/prebackup/action|Call this action before backup|
|/storageSyncServices/syncGroups/cloudEndpoints/postbackup/action|Call this action after backup|
|/storageSyncServices/syncGroups/cloudEndpoints/prerestore/action|Call this action before restore|
|/storageSyncServices/syncGroups/cloudEndpoints/postrestore/action|Call this action after restore|
|/storageSyncServices/syncGroups/cloudEndpoints/restoreheartbeat/action|Restore heartbeat|
|/storageSyncServices/syncGroups/cloudEndpoints/operationresults/read|Location api for async backup calls|

## Microsoft.StorSimple

| Operation | Description |
|---|---|
|/managers/clearAlerts/action|Clear all the alerts associated with the device manager.|
|/managers/getActivationKey/action|Get activation key for the device manager.|
|/managers/regenerateActivationKey/action|Regenerate activation key for the device manager.|
|/managers/regenarateRegistationCertificate/action|Regenerate registration certificate for the device managers.|
|/managers/getEncryptionKey/action|Get encryption key for the device manager.|
|/managers/read|Lists or gets the Device Managers|
|/managers/delete|Deletes the Device Managers|
|/managers/write|Create or update the Device Managers|
|/managers/configureDevice/action|Configures a device|
|/managers/listActivationKey/action|Gets the activation key of the StorSimple Device Manager.|
|/managers/listPublicEncryptionKey/action|List public encryption keys of a StorSimple Device Manager.|
|/managers/listPrivateEncryptionKey/action|Gets private encryption key for a StorSimple Device Manager.|
|/managers/provisionCloudAppliance/action|Create a new cloud appliance.|
|/Managers/write|Create Vault operation creates an Azure resource of type 'vault'|
|/Managers/read|The Get Vault operation gets an object representing the Azure resource of type 'vault'|
|/Managers/delete|The Delete Vault operation deletes the specified Azure resource of type 'vault'|
|/managers/storageAccountCredentials/write|Create or update the Storage Account Credentials|
|/managers/storageAccountCredentials/read|Lists or gets the Storage Account Credentials|
|/managers/storageAccountCredentials/delete|Deletes the Storage Account Credentials|
|/managers/storageAccountCredentials/listAccessKey/action|List access keys of Storage Account Credentials|
|/managers/accessControlRecords/read|Lists or gets the Access Control Records|
|/managers/accessControlRecords/write|Create or update the Access Control Records|
|/managers/accessControlRecords/delete|Deletes the Access Control Records|
|/managers/metrics/read|Lists or gets the Metrics|
|/managers/bandwidthSettings/read|List the Bandwidth Settings (8000 Series Only)|
|/managers/bandwidthSettings/write|Creates a new or updates Bandwidth Settings (8000 Series Only)|
|/managers/bandwidthSettings/delete|Deletes an existing Bandwidth Settings (8000 Series Only)|
|/Managers/extendedInformation/read|The Get Extended Info operation gets an object's Extended Info representing the Azure resource of type ?vault?|
|/Managers/extendedInformation/write|The Get Extended Info operation gets an object's Extended Info representing the Azure resource of type ?vault?|
|/Managers/extendedInformation/delete|The Get Extended Info operation gets an object's Extended Info representing the Azure resource of type ?vault?|
|/managers/alerts/read|Lists or gets the Alerts|
|/managers/storageDomains/read|Lists or gets the Storage Domains|
|/managers/storageDomains/write|Create or update the Storage Domains|
|/managers/storageDomains/delete|Deletes the Storage Domains|
|/managers/devices/scanForUpdates/action|Scan for updates in a device.|
|/managers/devices/download/action|Dowload updates for a device.|
|/managers/devices/install/action|Install updates on a device.|
|/managers/devices/read|Lists or gets the Devices|
|/managers/devices/write|Create or update the Devices|
|/managers/devices/delete|Deletes the Devices|
|/managers/devices/deactivate/action|Deactivates a device.|
|/managers/devices/publishSupportPackage/action|Publish support package of a device for Microsoft Support troubleshooting.|
|/managers/devices/failover/action|Failover of the device.|
|/managers/devices/sendTestAlertEmail/action|Send test alert email to configured email recipients.|
|/managers/devices/installUpdates/action|Installs updates on the devices|
|/managers/devices/listFailoverSets/action|List the failover sets for an existing device.|
|/managers/devices/listFailoverTargets/action|List failover targets of the devices|
|/managers/devices/publicEncryptionKey/action|List public encryption key of the device manager|
|/managers/devices/hardwareComponentGroups/read|List the Hardware Component Groups|
|/managers/devices/hardwareComponentGroups/changeControllerPowerState/action|Change controller power state of hardware component groups|
|/managers/devices/metrics/read|Lists or gets the Metrics|
|/managers/devices/chapSettings/write|Create or update the Chap Settings|
|/managers/devices/chapSettings/read|Lists or gets the Chap Settings|
|/managers/devices/chapSettings/delete|Deletes the Chap Settings|
|/managers/devices/backupScheduleGroups/read|Lists or gets the Backup Schedule Groups|
|/managers/devices/backupScheduleGroups/write|Create or update the Backup Schedule Groups|
|/managers/devices/backupScheduleGroups/delete|Deletes the Backup Schedule Groups|
|/managers/devices/updateSummary/read|Lists or gets the Update Summary|
|/managers/devices/migrationSourceConfigurations/import/action|Import source configurations for migration|
|/managers/devices/migrationSourceConfigurations/startMigrationEstimate/action|Start a job to estimate the duration of the migration process.|
|/managers/devices/migrationSourceConfigurations/startMigration/action|Start migration using source configurations|
|/managers/devices/migrationSourceConfigurations/confirmMigration/action|Confirms a successful migration and commit it.|
|/managers/devices/migrationSourceConfigurations/fetchMigrationEstimate/action|Fetch the status for the migration estimation job.|
|/managers/devices/migrationSourceConfigurations/fetchMigrationStatus/action|Fetch the status for the migration.|
|/managers/devices/migrationSourceConfigurations/fetchConfirmMigrationStatus/action|Fetch the confirm status of migration.|
|/managers/devices/alertSettings/read|Lists or gets the Alert Settings|
|/managers/devices/alertSettings/write|Create or update the Alert Settings|
|/managers/devices/networkSettings/read|Lists or gets the Network Settings|
|/managers/devices/networkSettings/write|Creates a new or updates Network Settings|
|/managers/devices/jobs/read|Lists or gets the Jobs|
|/managers/devices/jobs/cancel/action|Cancel a running job|
|/managers/devices/metricsDefinitions/read|Lists or gets the Metrics Definitions|
|/managers/devices/volumeContainers/write|Creates a new or updates Volume Containers (8000 Series Only)|
|/managers/devices/volumeContainers/read|List the Volume Containers (8000 Series Only)|
|/managers/devices/volumeContainers/delete|Deletes an existing Volume Containers (8000 Series Only)|
|/managers/devices/volumeContainers/listEncryptionKeys/action|List encryption keys of Volume Containers|
|/managers/devices/volumeContainers/rolloverEncryptionKey/action|Rollover encryption keys of Volume Containers|
|/managers/devices/volumeContainers/metrics/read|List the Metrics|
|/managers/devices/volumeContainers/volumes/read|List the Volumes|
|/managers/devices/volumeContainers/volumes/write|Creates a new or updates Volumes|
|/managers/devices/volumeContainers/volumes/delete|Deletes an existing Volumes|
|/managers/devices/volumeContainers/volumes/metrics/read|List the Metrics|
|/managers/devices/volumeContainers/volumes/metricsDefinitions/read|List the Metrics Definitions|
|/managers/devices/volumeContainers/metricsDefinitions/read|List the Metrics Definitions|
|/managers/devices/iscsiservers/read|Lists or gets the iSCSI Servers|
|/managers/devices/iscsiservers/write|Create or update the iSCSI Servers|
|/managers/devices/iscsiservers/delete|Deletes the iSCSI Servers|
|/managers/devices/iscsiservers/backup/action|Take backup of an iSCSI server.|
|/managers/devices/iscsiservers/metrics/read|Lists or gets the Metrics|
|/managers/devices/iscsiservers/disks/read|Lists or gets the Disks|
|/managers/devices/iscsiservers/disks/write|Create or update the Disks|
|/managers/devices/iscsiservers/disks/delete|Deletes the Disks|
|/managers/devices/iscsiservers/disks/metrics/read|Lists or gets the Metrics|
|/managers/devices/iscsiservers/disks/metricsDefinitions/read|Lists or gets the Metrics Definitions|
|/managers/devices/iscsiservers/metricsDefinitions/read|Lists or gets the Metrics Definitions|
|/managers/devices/backups/read|Lists or gets the Backup Set|
|/managers/devices/backups/delete|Deletes the Backup Set|
|/managers/devices/backups/restore/action|Restore all the volumes from a backup set.|
|/managers/devices/backups/elements/clone/action|Clone a share or volume using a backup element.|
|/managers/devices/backupPolicies/write|Creates a new or updates Backup Polices (8000 Series Only)|
|/managers/devices/backupPolicies/read|List the Backup Polices (8000 Series Only)|
|/managers/devices/backupPolicies/delete|Deletes an existing Backup Polices (8000 Series Only)|
|/managers/devices/backupPolicies/backup/action|Take a manual backup to create an on-demand backup of all the volumes protected by the policy.|
|/managers/devices/backupPolicies/schedules/write|Creates a new or updates Schedules|
|/managers/devices/backupPolicies/schedules/read|List the Schedules|
|/managers/devices/backupPolicies/schedules/delete|Deletes an existing Schedules|
|/managers/devices/securitySettings/update/action|Update the security settings.|
|/managers/devices/securitySettings/read|List the Security Settings|
|/managers/devices/securitySettings/syncRemoteManagementCertificate/action|Synchronize the remote management certificate for a device.|
|/managers/devices/securitySettings/write|Creates a new or updates Security Settings|
|/managers/devices/fileservers/read|Lists or gets the File Servers|
|/managers/devices/fileservers/write|Create or update the File Servers|
|/managers/devices/fileservers/delete|Deletes the File Servers|
|/managers/devices/fileservers/backup/action|Take backup of an File Server.|
|/managers/devices/fileservers/metrics/read|Lists or gets the Metrics|
|/managers/devices/fileservers/shares/write|Create or update the Shares|
|/managers/devices/fileservers/shares/read|Lists or gets the Shares|
|/managers/devices/fileservers/shares/delete|Deletes the Shares|
|/managers/devices/fileservers/shares/metrics/read|Lists or gets the Metrics|
|/managers/devices/fileservers/shares/metricsDefinitions/read|Lists or gets the Metrics Definitions|
|/managers/devices/fileservers/metricsDefinitions/read|Lists or gets the Metrics Definitions|
|/managers/devices/timeSettings/read|Lists or gets the Time Settings|
|/managers/devices/timeSettings/write|Creates a new or updates Time Settings|
|/Managers/certificates/write|The Update Resource Certificate operation updates the resource/vault credential certificate.|
|/managers/cloudApplianceConfigurations/read|List the Cloud Appliance Supported Configurations|
|/managers/metricsDefinitions/read|Lists or gets the Metrics Definitions|
|/managers/encryptionSettings/read|Lists or gets the Encryption Settings|

## Microsoft.StreamAnalytics

| Operation | Description |
|---|---|
|/Register/action|Register subscription with Stream Analytics Resource Provider|
|/streamingjobs/Delete|Delete Stream Analytics Job|
|/streamingjobs/Read|Read Stream Analytics Job|
|/streamingjobs/Start/action|Start Stream Analytics Job|
|/streamingjobs/Stop/action|Stop Stream Analytics Job|
|/streamingjobs/Write|Write Stream Analytics Job|
|/streamingjobs/operationresults/Read|Read operation results for Stream Analytics Job|
|/streamingjobs/providers/Microsoft.Insights/metricDefinitions/read|Gets the available metrics for streamingjobs|
|/streamingjobs/providers/Microsoft.Insights/diagnosticSettings/read|Read diagnostic setting.|
|/streamingjobs/providers/Microsoft.Insights/diagnosticSettings/write|Write diagnostic setting.|
|/streamingjobs/providers/Microsoft.Insights/logDefinitions/read|Gets the available logs for streamingjobs|
|/streamingjobs/metricdefinitions/Read|Read Metric Definitions|
|/streamingjobs/transformations/Delete|Delete Stream Analytics Job Transformation|
|/streamingjobs/transformations/Read|Read Stream Analytics Job Transformation|
|/streamingjobs/transformations/Write|Write Stream Analytics Job Transformation|
|/streamingjobs/inputs/Delete|Delete Stream Analytics Job Input|
|/streamingjobs/inputs/Read|Read Stream Analytics Job Input|
|/streamingjobs/inputs/Sample/action|Sample Stream Analytics Job Input|
|/streamingjobs/inputs/Test/action|Test Stream Analytics Job Input|
|/streamingjobs/inputs/Write|Write Stream Analytics Job Input|
|/streamingjobs/inputs/operationresults/Read|Read operation results for Stream Analytics Job Input|
|/streamingjobs/outputs/Delete|Delete Stream Analytics Job Output|
|/streamingjobs/outputs/Read|Read Stream Analytics Job Output|
|/streamingjobs/outputs/Test/action|Test Stream Analytics Job Output|
|/streamingjobs/outputs/Write|Write Stream Analytics Job Output|
|/streamingjobs/outputs/operationresults/Read|Read operation results for Stream Analytics Job Output|
|/streamingjobs/functions/Delete|Delete Stream Analytics Job Function|
|/streamingjobs/functions/Read|Read Stream Analytics Job Function|
|/streamingjobs/functions/RetrieveDefaultDefinition/action|Retrieve Default Definition of a Stream Analytics Job Function|
|/streamingjobs/functions/Test/action|Test Stream Analytics Job Function|
|/streamingjobs/functions/Write|Write Stream Analytics Job Function|
|/streamingjobs/functions/operationresults/Read|Read operation results for Stream Analytics Job Function|
|/operations/Read|Read Stream Analytics Operations|
|/locations/quotas/Read|Read Stream Analytics Subscription Quota|

## Microsoft.Subscription

| Operation | Description |
|---|---|
|/SubscriptionDefinitions/read|Get an Azure subscription definition within a management group.|
|/SubscriptionDefinitions/write|Create an Azure subscription definition|

## Microsoft.Support

| Operation | Description |
|---|---|
|/register/action|Registers to Support Resource Provider|
|/supportTickets/read|Gets Support Ticket details (including status, severity, contact details and communications) or gets the list of Support Tickets across subscriptions.|
|/supportTickets/write|Creates or Updates a Support Ticket. You can create a Support Ticket for Technical, Billing, Quotas or Subscription Management related issues. You can update severity, contact details and communications for existing support tickets.|

## Microsoft.TimeSeriesInsights

| Operation | Description |
|---|---|
|/register/action|Registers the subscription for the Time Series Insights resource provider and enables the creation of Time Series Insights environments.|
|/environments/read|Get the properties of an environment.|
|/environments/write|Creates a new environment, or updates an existing environment.|
|/environments/delete|Deletes the environment.|
|/environments/eventsources/read|Get the properties of an event source.|
|/environments/eventsources/write|Creates a new event source for an environment, or updates an existing event source.|
|/environments/eventsources/delete|Deletes the event source.|
|/environments/eventsources/eventsources/providers/Microsoft.Insights/diagnosticSettings/write|Creates or updates the diagnostic setting for the resource|
|/environments/eventsources/providers/Microsoft.Insights/metricDefinitions/read|Gets the available metrics for eventsources|
|/environments/eventsources/providers/Microsoft.Insights/diagnosticSettings/read|Gets the diagnostic setting for the resource|
|/environments/providers/Microsoft.Insights/metricDefinitions/read|Gets the available metrics for environments|
|/environments/providers/Microsoft.Insights/diagnosticSettings/read|Gets the diagnostic setting for the resource|
|/environments/providers/Microsoft.Insights/diagnosticSettings/write|Creates or updates the diagnostic setting for the resource|
|/environments/accesspolicies/read|Get the properties of an access policy.|
|/environments/accesspolicies/write|Creates a new access policy for an environment, or updates an existing access policy.|
|/environments/accesspolicies/delete|Deletes the access policy.|
|/environments/referencedatasets/read|Get the properties of a reference data set.|
|/environments/referencedatasets/write|Creates a new reference data set for an environment, or updates an existing reference data set.|
|/environments/referencedatasets/delete|Deletes the reference data set.|
|/environments/status/read|Get the status of the environment, state of its associated operations like ingress.|

## microsoft.web

| Operation | Description |
|---|---|
|/unregister/action|Unregister Microsoft.Web resource provider for the subscription.|
|/validate/action|Validate .|
|/register/action|Register Microsoft.Web resource provider for the subscription.|
|/verifyhostingenvironmentvnet/action|Verify Hosting Environment Vnet.|
|/hostingEnvironments/Read|Get the properties of an App Service Environment|
|/hostingEnvironments/Write|Create a new App Service Environment or update existing one|
|/hostingEnvironments/Delete|Delete an App Service Environment|
|/hostingEnvironments/reboot/Action|Reboot all machines in an App Service Environment|
|/hostingenvironments/resume/action|Resume Hosting Environments.|
|/hostingenvironments/suspend/action|Suspend Hosting Environments.|
|/hostingenvironments/providers/Microsoft.Insights/diagnosticSettings/read|Gets the diagnostic setting for the resource|
|/hostingenvironments/providers/Microsoft.Insights/diagnosticSettings/write|Creates or updates the diagnostic setting for the resource|
|/hostingenvironments/metricdefinitions/read|Get Hosting Environments Metric Definitions.|
|/hostingenvironments/inboundnetworkdependenciesendpoints/read|Get the network endpoints of all inbound dependencies.|
|/hostingEnvironments/workerPools/Read|Get the properties of a Worker Pool in an App Service Environment|
|/hostingEnvironments/workerPools/Write|Create a new Worker Pool in an App Service Environment or update an existing one|
|/hostingEnvironments/workerPools/providers/Microsoft.Insights/metricDefinitions/Read|Gets the available metrics for App Service Environment WorkerPool|
|/hostingenvironments/workerpools/metricdefinitions/read|Get Hosting Environments Workerpools Metric Definitions.|
|/hostingenvironments/workerpools/metrics/read|Get Hosting Environments Workerpools Metrics.|
|/hostingenvironments/workerpools/skus/read|Get Hosting Environments Workerpools SKUs.|
|/hostingenvironments/workerpools/usages/read|Get Hosting Environments Workerpools Usages.|
|/hostingenvironments/outboundnetworkdependenciesendpoints/read|Get the network endpoints of all outbound dependencies.|
|/hostingenvironments/sites/read|Get Hosting Environments Web Apps.|
|/hostingenvironments/serverfarms/read|Get Hosting Environments App Service Plans.|
|/hostingenvironments/usages/read|Get Hosting Environments Usages.|
|/hostingenvironments/capacities/read|Get Hosting Environments Capacities.|
|/hostingenvironments/operations/read|Get Hosting Environments Operations.|
|/hostingEnvironments/multiRolePools/Read|Get the properties of a FrontEnd Pool in an App Service Environment|
|/hostingEnvironments/multiRolePools/Write|Create a new FrontEnd Pool in an App Service Environment or update an existing one|
|/hostingEnvironments/multiRolePools/providers/Microsoft.Insights/metricDefinitions/Read|Gets the available metrics for App Service Environment MultiRole|
|/hostingenvironments/multirolepools/metricdefinitions/read|Get Hosting Environments MultiRole Pools Metric Definitions.|
|/hostingenvironments/multirolepools/metrics/read|Get Hosting Environments MultiRole Pools Metrics.|
|/hostingenvironments/multirolepools/skus/read|Get Hosting Environments MultiRole Pools SKUs.|
|/hostingenvironments/multirolepools/usages/read|Get Hosting Environments MultiRole Pools Usages.|
|/hostingenvironments/diagnostics/read|Get Hosting Environments Diagnostics.|
|/publishingusers/read|Get Publishing Users.|
|/publishingusers/write|Update Publishing Users.|
|/checknameavailability/read|Check if resource name is available.|
|/geoRegions/Read|Get the list of Geo regions.|
|/sites/Read|Get the properties of a Web App|
|/sites/Write|Create a new Web App or update an existing one|
|/sites/Delete|Delete an existing Web App|
|/sites/backup/Action|Create a new web app backup|
|/sites/publishxml/Action|Get publishing profile xml for a Web App|
|/sites/publish/Action|Publish a Web App|
|/sites/restart/Action|Restart a Web App|
|/sites/start/Action|Start a Web App|
|/sites/stop/Action|Stop a Web App|
|/sites/slotsswap/Action|Swap Web App deployment slots|
|/sites/slotsdiffs/Action|Get differences in configuration between web app and slots|
|/sites/applySlotConfig/Action|Apply web app slot configuration from target slot to the current web app|
|/sites/resetSlotConfig/Action|Reset web app configuration|
|/sites/functions/action|Functions Web Apps.|
|/sites/listsyncfunctiontriggerstatus/action|List Sync Function Trigger Status Web Apps.|
|/sites/networktrace/action|Network Trace Web Apps.|
|/sites/newpassword/action|Newpassword Web Apps.|
|/sites/sync/action|Sync Web Apps.|
|/sites/migratemysql/action|Migrate MySql Web Apps.|
|/sites/recover/action|Recover Web Apps.|
|/sites/syncfunctiontriggers/action|Sync Function Triggers for Web Apps.|
|/sites/operationresults/read|Get Web Apps Operation Results.|
|/sites/webjobs/read|Get Web Apps WebJobs.|
|/sites/providers/Microsoft.Insights/metricDefinitions/Read|Gets the available metrics for Web App|
|/sites/providers/Microsoft.Insights/diagnosticSettings/read|Gets the diagnostic setting for the resource|
|/sites/providers/Microsoft.Insights/diagnosticSettings/write|Creates or updates the diagnostic setting for the resource|
|/sites/backup/read|Get Web Apps Backup.|
|/sites/backup/write|Update Web Apps Backup.|
|/sites/publiccertificates/delete|Delete Web Apps Public Certificates.|
|/sites/publiccertificates/read|Get Web Apps Public Certificates.|
|/sites/publiccertificates/write|Update Web Apps Public Certificates.|
|/sites/metricdefinitions/read|Get Web Apps Metric Definitions.|
|/sites/metrics/read|Get Web Apps Metrics.|
|/sites/processes/read|Get Web Apps Processes.|
|/sites/continuouswebjobs/delete|Delete Web Apps Continuous Web Jobs.|
|/sites/continuouswebjobs/read|Get Web Apps Continuous Web Jobs.|
|/sites/continuouswebjobs/start/action|Start Web Apps Continuous Web Jobs.|
|/sites/continuouswebjobs/stop/action|Stop Web Apps Continuous Web Jobs.|
|/sites/domainownershipidentifiers/read|Get Web Apps Domain Ownership Identifiers.|
|/sites/domainownershipidentifiers/write|Update Web Apps Domain Ownership Identifiers.|
|/sites/premieraddons/delete|Delete Web Apps Premier Addons.|
|/sites/premieraddons/read|Get Web Apps Premier Addons.|
|/sites/premieraddons/write|Update Web Apps Premier Addons.|
|/sites/triggeredwebjobs/delete|Delete Web Apps Triggered WebJobs.|
|/sites/triggeredwebjobs/read|Get Web Apps Triggered WebJobs.|
|/sites/triggeredwebjobs/run/action|Run Web Apps Triggered WebJobs.|
|/sites/triggeredwebjobs/history/read|Get Web Apps Triggered WebJobs History.|
|/sites/hostnamebindings/delete|Delete Web Apps Hostname Bindings.|
|/sites/hostnamebindings/read|Get Web Apps Hostname Bindings.|
|/sites/hostnamebindings/write|Update Web Apps Hostname Bindings.|
|/sites/virtualnetworkconnections/delete|Delete Web Apps Virtual Network Connections.|
|/sites/virtualnetworkconnections/read|Get Web Apps Virtual Network Connections.|
|/sites/virtualnetworkconnections/write|Update Web Apps Virtual Network Connections.|
|/sites/virtualnetworkconnections/gateways/read|Get Web Apps Virtual Network Connections Gateways.|
|/sites/virtualnetworkconnections/gateways/write|Update Web Apps Virtual Network Connections Gateways.|
|/sites/migratemysql/read|Get Web Apps Migrate MySql.|
|/sites/publishxml/read|Get Web Apps Publishing XML.|
|/sites/hybridconnectionrelays/read|Get Web Apps Hybrid Connection Relays.|
|/sites/perfcounters/read|Get Web Apps Performance Counters.|
|/sites/resourcehealthmetadata/read|Get Web Apps Resource Health Metadata.|
|/sites/usages/read|Get Web Apps Usages.|
|/sites/slots/Write|Create a new Web App Slot or update an existing one|
|/sites/slots/Delete|Delete an existing Web App Slot|
|/sites/slots/backup/Action|Create new Web App Slot backup.|
|/sites/slots/publishxml/Action|Get publishing profile xml for Web App Slot|
|/sites/slots/publish/Action|Publish a Web App Slot|
|/sites/slots/restart/Action|Restart a Web App Slot|
|/sites/slots/start/Action|Start a Web App Slot|
|/sites/slots/stop/Action|Stop a Web App Slot|
|/sites/slots/slotsswap/Action|Swap Web App deployment slots|
|/sites/slots/slotsdiffs/Action|Get differences in configuration between web app and slots|
|/sites/slots/applySlotConfig/Action|Apply web app slot configuration from target slot to the current slot.|
|/sites/slots/resetSlotConfig/Action|Reset web app slot configuration|
|/sites/slots/Read|Get the properties of a Web App deployment slot|
|/sites/slots/newpassword/action|Newpassword Web Apps Slots.|
|/sites/slots/sync/action|Sync Web Apps Slots.|
|/sites/slots/networktrace/action|Network Trace Web Apps Slots.|
|/sites/slots/operationresults/read|Get Web Apps Slots Operation Results.|
|/sites/slots/webjobs/read|Get Web Apps Slots WebJobs.|
|/sites/slots/providers/Microsoft.Insights/metricDefinitions/Read|Gets the available metrics for Web App Slot|
|/sites/slots/providers/Microsoft.Insights/diagnosticSettings/read|Gets the diagnostic setting for the resource|
|/sites/slots/providers/Microsoft.Insights/diagnosticSettings/write|Creates or updates the diagnostic setting for the resource|
|/sites/slots/backup/write|Update Web Apps Slots Backup.|
|/sites/slots/backup/read|Get Web Apps Slots Backup.|
|/sites/slots/publiccertificates/read|Get Web Apps Slots Public Certificates.|
|/sites/slots/publiccertificates/write|Create or Update Web Apps Slots Public Certificates.|
|/sites/slots/metricdefinitions/read|Get Web Apps Slots Metric Definitions.|
|/sites/slots/metrics/read|Get Web Apps Slots Metrics.|
|/sites/slots/continuouswebjobs/delete|Delete Web Apps Slots Continuous Web Jobs.|
|/sites/slots/continuouswebjobs/read|Get Web Apps Slots Continuous Web Jobs.|
|/sites/slots/continuouswebjobs/start/action|Start Web Apps Slots Continuous Web Jobs.|
|/sites/slots/continuouswebjobs/stop/action|Stop Web Apps Slots Continuous Web Jobs.|
|/sites/slots/domainownershipidentifiers/read|Get Web Apps Slots Domain Ownership Identifiers.|
|/sites/slots/premieraddons/delete|Delete Web Apps Slots Premier Addons.|
|/sites/slots/premieraddons/read|Get Web Apps Slots Premier Addons.|
|/sites/slots/premieraddons/write|Update Web Apps Slots Premier Addons.|
|/sites/slots/triggeredwebjobs/delete|Delete Web Apps Slots Triggered WebJobs.|
|/sites/slots/triggeredwebjobs/read|Get Web Apps Slots Triggered WebJobs.|
|/sites/slots/triggeredwebjobs/run/action|Run Web Apps Slots Triggered WebJobs.|
|/sites/slots/hostnamebindings/delete|Delete Web Apps Slots Hostname Bindings.|
|/sites/slots/hostnamebindings/read|Get Web Apps Slots Hostname Bindings.|
|/sites/slots/hostnamebindings/write|Update Web Apps Slots Hostname Bindings.|
|/sites/slots/phplogging/read|Get Web Apps Slots Phplogging.|
|/sites/slots/virtualnetworkconnections/delete|Delete Web Apps Slots Virtual Network Connections.|
|/sites/slots/virtualnetworkconnections/read|Get Web Apps Slots Virtual Network Connections.|
|/sites/slots/virtualnetworkconnections/write|Update Web Apps Slots Virtual Network Connections.|
|/sites/slots/virtualnetworkconnections/gateways/write|Update Web Apps Slots Virtual Network Connections Gateways.|
|/sites/slots/migratemysql/read|Get Web Apps Slots Migrate MySql.|
|/sites/slots/hybridconnectionrelays/read|Get Web Apps Slots Hybrid Connection Relays.|
|/sites/slots/perfcounters/read|Get Web Apps Slots Performance Counters.|
|/sites/slots/resourcehealthmetadata/read|Get Web Apps Slots Resource Health Metadata.|
|/sites/slots/usages/read|Get Web Apps Slots Usages.|
|/sites/slots/hybridconnection/delete|Delete Web Apps Slots Hybrid Connection.|
|/sites/slots/hybridconnection/read|Get Web Apps Slots Hybrid Connection.|
|/sites/slots/hybridconnection/write|Update Web Apps Slots Hybrid Connection.|
|/sites/slots/operations/read|Get Web Apps Slots Operations.|
|/sites/slots/config/Read|Get Web App Slot's configuration settings|
|/sites/slots/config/list/Action|List Web App Slot's security sensitive settings, such as publishing credentials, app settings and connection strings|
|/sites/slots/config/Write|Update Web App Slot's configuration settings|
|/sites/slots/config/delete|Delete Web Apps Slots Config.|
|/sites/slots/instances/read|Get Web Apps Slots Instances.|
|/sites/slots/instances/processes/read|Get Web Apps Slots Instances Processes.|
|/sites/slots/instances/processes/delete|Delete Web Apps Slots Instances Processes.|
|/sites/slots/instances/deployments/read|Get Web Apps Slots Instances Deployments.|
|/sites/slots/hybridconnectionnamespaces/relays/delete|Delete Web Apps Slots Hybrid Connection Namespaces Relays.|
|/sites/slots/hybridconnectionnamespaces/relays/write|Update Web Apps Slots Hybrid Connection Namespaces Relays.|
|/sites/slots/sourcecontrols/Read|Get Web App Slot's source control configuration settings|
|/sites/slots/sourcecontrols/Write|Update Web App Slot's source control configuration settings|
|/sites/slots/sourcecontrols/Delete|Delete Web App Slot's source control configuration settings|
|/sites/slots/restore/read|Get Web Apps Slots Restore.|
|/sites/slots/restore/write|Restore Web Apps Slots.|
|/sites/slots/analyzecustomhostname/read|Get Web Apps Slots Analyze Custom Hostname.|
|/sites/slots/backups/Read|Get the properties of a web app slots' backup|
|/sites/slots/backups/list/action|List Web Apps Slots Backups.|
|/sites/slots/backups/restore/action|Restore Web Apps Slots Backups.|
|/sites/slots/backups/delete|Delete Web Apps Slots Backups.|
|/sites/slots/snapshots/read|Get Web Apps Slots Snapshots.|
|/sites/slots/siteextensions/delete|Delete Web Apps Slots Site Extensions.|
|/sites/slots/siteextensions/read|Get Web Apps Slots Site Extensions.|
|/sites/slots/siteextensions/write|Update Web Apps Slots Site Extensions.|
|/sites/slots/deployments/delete|Delete Web Apps Slots Deployments.|
|/sites/slots/deployments/read|Get Web Apps Slots Deployments.|
|/sites/slots/deployments/write|Update Web Apps Slots Deployments.|
|/sites/slots/deployments/log/read|Get Web Apps Slots Deployments Log.|
|/sites/slots/diagnostics/read|Get Web Apps Slots Diagnostics.|
|/sites/slots/diagnostics/threadcount/read|Get Web Apps Slots Diagnostics Thread Count.|
|/sites/slots/diagnostics/workerprocessrecycle/read|Get Web Apps Slots Diagnostics Worker Process Recycle.|
|/sites/slots/diagnostics/workeravailability/read|Get Web Apps Slots Diagnostics Workeravailability.|
|/sites/slots/diagnostics/sitelatency/read|Get Web Apps Slots Diagnostics Site Latency.|
|/sites/slots/diagnostics/runtimeavailability/read|Get Web Apps Slots Diagnostics Runtime Availability.|
|/sites/slots/diagnostics/sitememoryanalysis/read|Get Web Apps Slots Diagnostics Site Memory Analysis.|
|/sites/slots/diagnostics/sitecrashes/read|Get Web Apps Slots Diagnostics Site Crashes.|
|/sites/slots/diagnostics/autoheal/read|Get Web Apps Slots Diagnostics Autoheal.|
|/sites/slots/diagnostics/siteswap/read|Get Web Apps Slots Diagnostics Site Swap.|
|/sites/slots/diagnostics/siterestartuserinitiated/read|Get Web Apps Slots Diagnostics Site Restart User Initiated.|
|/sites/slots/diagnostics/analyses/read|Get Web Apps Slots Diagnostics Analysis.|
|/sites/slots/diagnostics/analyses/execute/Action|Run Web Apps Slots Diagnostics Analysis.|
|/sites/slots/diagnostics/siterestartsettingupdate/read|Get Web Apps Slots Diagnostics Site Restart Setting Update.|
|/sites/slots/diagnostics/loganalyzer/read|Get Web Apps Slots Diagnostics Log Analyzer.|
|/sites/slots/diagnostics/servicehealth/read|Get Web Apps Slots Diagnostics Service Health.|
|/sites/slots/diagnostics/deployments/read|Get Web Apps Slots Diagnostics Deployments.|
|/sites/slots/diagnostics/aspnetcore/read|Get Web Apps Slots Diagnostics for ASP.NET Core app.|
|/sites/slots/diagnostics/sitecpuanalysis/read|Get Web Apps Slots Diagnostics Site CPU Analysis.|
|/sites/slots/diagnostics/deployment/read|Get Web Apps Slots Diagnostics Deployment.|
|/sites/slots/diagnostics/detectors/read|Get Web Apps Slots Diagnostics Detector.|
|/sites/slots/diagnostics/detectors/execute/Action|Run Web Apps Slots Diagnostics Detector.|
|/sites/slots/diagnostics/frebanalysis/read|Get Web Apps Slots Diagnostics FREB Analysis.|
|/sites/hybridconnection/delete|Delete Web Apps Hybrid Connection.|
|/sites/hybridconnection/read|Get Web Apps Hybrid Connection.|
|/sites/hybridconnection/write|Update Web Apps Hybrid Connection.|
|/sites/recommendationhistory/read|Get Web Apps Recommendation History.|
|/sites/operations/read|Get Web Apps Operations.|
|/sites/recommendations/Read|Get the list of recommendations for web app.|
|/sites/recommendations/disable/action|Disable Web Apps Recommendations.|
|/sites/config/Read|Get Web App configuration settings|
|/sites/config/list/Action|List Web App's security sensitive settings, such as publishing credentials, app settings and connection strings|
|/sites/config/Write|Update Web App's configuration settings|
|/sites/config/delete|Delete Web Apps Config.|
|/sites/instances/read|Get Web Apps Instances.|
|/sites/instances/processes/delete|Delete Web Apps Instances Processes.|
|/sites/instances/processes/read|Get Web Apps Instances Processes.|
|/sites/instances/extensions/read|Get Web Apps Instances Extensions.|
|/sites/instances/extensions/log/read|Get Web Apps Instances Extensions Log.|
|/sites/instances/deployments/read|Get Web Apps Instances Deployments.|
|/sites/instances/deployments/delete|Delete Web Apps Instances Deployments.|
|/sites/hybridconnectionnamespaces/relays/delete|Delete Web Apps Hybrid Connection Namespaces Relays.|
|/sites/hybridconnectionnamespaces/relays/listkeys/action|List Keys Web Apps Hybrid Connection Namespaces Relays.|
|/sites/hybridconnectionnamespaces/relays/write|Update Web Apps Hybrid Connection Namespaces Relays.|
|/sites/hybridconnectionnamespaces/relays/read|Get Web Apps Hybrid Connection Namespaces Relays.|
|/sites/metricsdefinitions/read|Get Web Apps Metrics Definitions.|
|/sites/sourcecontrols/Read|Get Web App's source control configuration settings|
|/sites/sourcecontrols/Write|Update Web App's source control configuration settings|
|/sites/sourcecontrols/Delete|Delete Web App's source control configuration settings|
|/sites/restore/read|Get Web Apps Restore.|
|/sites/restore/write|Restore Web Apps.|
|/sites/analyzecustomhostname/read|Analyze Custom Hostname.|
|/sites/backups/Read|Get the properties of a web app's backup|
|/sites/backups/list/action|List Web Apps Backups.|
|/sites/backups/restore/action|Restore Web Apps Backups.|
|/sites/backups/delete|Delete Web Apps Backups.|
|/sites/snapshots/read|Get Web Apps Snapshots.|
|/sites/functions/delete|Delete Web Apps Functions.|
|/sites/functions/listsecrets/action|List Secrets Web Apps Functions.|
|/sites/functions/read|Get Web Apps Functions.|
|/sites/functions/write|Update Web Apps Functions.|
|/sites/functions/token/read|Get Web Apps Functions Token.|
|/sites/functions/masterkey/read|Get Web Apps Functions Masterkey.|
|/sites/siteextensions/delete|Delete Web Apps Site Extensions.|
|/sites/siteextensions/read|Get Web Apps Site Extensions.|
|/sites/siteextensions/write|Update Web Apps Site Extensions.|
|/sites/deployments/delete|Delete Web Apps Deployments.|
|/sites/deployments/read|Get Web Apps Deployments.|
|/sites/deployments/write|Update Web Apps Deployments.|
|/sites/deployments/log/read|Get Web Apps Deployments Log.|
|/sites/diagnostics/read|Get Web Apps Diagnostics Categories.|
|/sites/diagnostics/threadcount/read|Get Web Apps Diagnostics Thread Count.|
|/sites/diagnostics/workerprocessrecycle/read|Get Web Apps Diagnostics Worker Process Recycle.|
|/sites/diagnostics/workeravailability/read|Get Web Apps Diagnostics Workeravailability.|
|/sites/diagnostics/sitelatency/read|Get Web Apps Diagnostics Site Latency.|
|/sites/diagnostics/runtimeavailability/read|Get Web Apps Diagnostics Runtime Availability.|
|/sites/diagnostics/sitememoryanalysis/read|Get Web Apps Diagnostics Site Memory Analysis.|
|/sites/diagnostics/sitecrashes/read|Get Web Apps Diagnostics Site Crashes.|
|/sites/diagnostics/autoheal/read|Get Web Apps Diagnostics Autoheal.|
|/sites/diagnostics/siteswap/read|Get Web Apps Diagnostics Site Swap.|
|/sites/diagnostics/siterestartuserinitiated/read|Get Web Apps Diagnostics Site Restart User Initiated.|
|/sites/diagnostics/analyses/read|Get Web Apps Diagnostics Analysis.|
|/sites/diagnostics/analyses/execute/Action|Run Web Apps Diagnostics Analysis.|
|/sites/diagnostics/siterestartsettingupdate/read|Get Web Apps Diagnostics Site Restart Setting Update.|
|/sites/diagnostics/loganalyzer/read|Get Web Apps Diagnostics Log Analyzer.|
|/sites/diagnostics/servicehealth/read|Get Web Apps Diagnostics Service Health.|
|/sites/diagnostics/failedrequestsperuri/read|Get Web Apps Diagnostics Failed Requests Per Uri.|
|/sites/diagnostics/deployments/read|Get Web Apps Diagnostics Deployments.|
|/sites/diagnostics/aspnetcore/read|Get Web Apps Diagnostics for ASP.NET Core app.|
|/sites/diagnostics/sitecpuanalysis/read|Get Web Apps Diagnostics Site CPU Analysis.|
|/sites/diagnostics/deployment/read|Get Web Apps Diagnostics Deployment.|
|/sites/diagnostics/detectors/read|Get Web Apps Diagnostics Detector.|
|/sites/diagnostics/detectors/execute/Action|Run Web Apps Diagnostics Detector.|
|/sites/diagnostics/frebanalysis/read|Get Web Apps Diagnostics FREB Analysis.|
|/customApis/Read|Get the list of Custom API.|
|/customApis/Write|Creates or updates a Custom API.|
|/customApis/Delete|Deletes a Custom API.|
|/customApis/Move/Action|Moves a Custom API.|
|/customApis/Join/Action|Joins a Custom API.|
|/customApis/extractApiDefinitionFromWsdl/Action|Extracts API definition from a WSDL.|
|/customApis/listWsdlInterfaces/Action|Lists WSDL interfaces for a Custom API.|
|/availablestacks/read|Get Available Stacks.|
|/isusernameavailable/read|Check if Username is available.|
|/serverfarms/Read|Get the properties on an App Service Plan|
|/serverfarms/Write|Create a new App Service Plan or update an existing one|
|/serverfarms/Delete|Delete an existing App Service Plan|
|/serverfarms/restartSites/Action|Restart all Web Apps in an App Service Plan|
|/serverfarms/operationresults/read|Get App Service Plans Operation Results.|
|/serverfarms/providers/Microsoft.Insights/metricDefinitions/Read|Gets the available metrics for App Service Plan|
|/serverfarms/providers/Microsoft.Insights/diagnosticSettings/read|Gets the diagnostic setting for the resource|
|/serverfarms/providers/Microsoft.Insights/diagnosticSettings/write|Creates or updates the diagnostic setting for the resource|
|/serverfarms/capabilities/read|Get App Service Plans Capabilities.|
|/serverfarms/metricdefinitions/read|Get App Service Plans Metric Definitions.|
|/serverfarms/metrics/read|Get App Service Plans Metrics.|
|/serverfarms/hybridconnectionplanlimits/read|Get App Service Plans Hybrid Connection Plan Limits.|
|/serverfarms/virtualnetworkconnections/read|Get App Service Plans Virtual Network Connections.|
|/serverfarms/virtualnetworkconnections/routes/delete|Delete App Service Plans Virtual Network Connections Routes.|
|/serverfarms/virtualnetworkconnections/routes/read|Get App Service Plans Virtual Network Connections Routes.|
|/serverfarms/virtualnetworkconnections/routes/write|Update App Service Plans Virtual Network Connections Routes.|
|/serverfarms/virtualnetworkconnections/gateways/write|Update App Service Plans Virtual Network Connections Gateways.|
|/serverfarms/firstpartyapps/settings/delete|Delete App Service Plans First Party Apps Settings.|
|/serverfarms/firstpartyapps/settings/read|Get App Service Plans First Party Apps Settings.|
|/serverfarms/firstpartyapps/settings/write|Update App Service Plans First Party Apps Settings.|
|/serverfarms/sites/read|Get App Service Plans Web Apps.|
|/serverfarms/workers/reboot/action|Reboot App Service Plans Workers.|
|/serverfarms/hybridconnectionrelays/read|Get App Service Plans Hybrid Connection Relays.|
|/serverfarms/skus/read|Get App Service Plans SKUs.|
|/serverfarms/usages/read|Get App Service Plans Usages.|
|/serverfarms/hybridconnectionnamespaces/relays/read|Get App Service Plans Hybrid Connection Namespaces Relays.|
|/serverfarms/hybridconnectionnamespaces/relays/delete|Delete App Service Plans Hybrid Connection Namespaces Relays.|
|/serverfarms/hybridconnectionnamespaces/relays/sites/read|Get App Service Plans Hybrid Connection Namespaces Relays Web Apps.|
|/ishostnameavailable/read|Check if Hostname is Available.|
|/connectionGateways/Read|Get the list of Connection Gateways.|
|/connectionGateways/Write|Creates or updates a Connection Gateway.|
|/connectionGateways/Delete|Deletes a Connection Gateway.|
|/connectionGateways/Move/Action|Moves a Connection Gateway.|
|/connectionGateways/Join/Action|Joins a Connection Gateway.|
|/connectionGateways/ListStatus/Action|Lists status of a Connection Gateway.|
|/connectiongateways/liststatus/action|List Status Connection Gateways.|
|/classicmobileservices/read|Get Classic Mobile Services.|
|/resourcehealthmetadata/read|Get Resource Health Metadata.|
|/skus/read|Get SKUs.|
|/certificates/Read|Get the list of certificates.|
|/certificates/Write|Add a new certificate or update an existing one.|
|/certificates/Delete|Delete an existing certificate.|
|/operations/read|Get Operations.|
|/recommendations/Read|Get the list of recommendations for subscriptions.|
|/ishostingenvironmentnameavailable/read|Get if Hosting Environment Name is available.|
|/apimanagementaccounts/apis/read|Get Api Management Accounts APIs.|
|/apimanagementaccounts/apis/delete|Delete Api Management Accounts APIs.|
|/apimanagementaccounts/apis/write|Update Api Management Accounts APIs.|
|/apimanagementaccounts/apis/connections/read|Get Api Management Accounts APIs Connections.|
|/apimanagementaccounts/apis/connections/confirmconsentcode/action|Confirm Consent Code Api Management Accounts APIs Connections.|
|/apimanagementaccounts/apis/connections/delete|Delete Api Management Accounts APIs Connections.|
|/apimanagementaccounts/apis/connections/getconsentlinks/action|Get Consent Links for Api Management Accounts APIs Connections.|
|/apimanagementaccounts/apis/connections/write|Update Api Management Accounts APIs Connections.|
|/apimanagementaccounts/apis/connections/listconnectionkeys/action|List Connection Keys Api Management Accounts APIs Connections.|
|/apimanagementaccounts/apis/connections/listsecrets/action|List Secrets Api Management Accounts APIs Connections.|
|/apimanagementaccounts/apis/connections/connectionacls/delete|Delete Api Management Accounts APIs Connections Connectionacls.|
|/apimanagementaccounts/apis/connections/connectionacls/read|Get Api Management Accounts APIs Connections Connectionacls.|
|/apimanagementaccounts/apis/connections/connectionacls/write|Update Api Management Accounts APIs Connections Connectionacls.|
|/apimanagementaccounts/apis/localizeddefinitions/delete|Delete Api Management Accounts APIs Localized Definitions.|
|/apimanagementaccounts/apis/localizeddefinitions/read|Get Api Management Accounts APIs Localized Definitions.|
|/apimanagementaccounts/apis/localizeddefinitions/write|Update Api Management Accounts APIs Localized Definitions.|
|/apimanagementaccounts/apis/connectionacls/read|Get Api Management Accounts APIs Connectionacls.|
|/apimanagementaccounts/apis/apiacls/delete|Delete Api Management Accounts APIs Apiacls.|
|/apimanagementaccounts/apis/apiacls/read|Get Api Management Accounts APIs Apiacls.|
|/apimanagementaccounts/apis/apiacls/write|Update Api Management Accounts APIs Apiacls.|
|/apimanagementaccounts/connectionacls/read|Get Api Management Accounts Connectionacls.|
|/apimanagementaccounts/apiacls/read|Get Api Management Accounts Apiacls.|
|/connections/Read|Get the list of Connections.|
|/connections/Write|Creates or updates a Connection.|
|/connections/Delete|Deletes a Connection.|
|/connections/Move/Action|Moves a Connection.|
|/connections/Join/Action|Joins a Connection.|
|/connections/confirmconsentcode/action|Confirm Connections Consent Code.|
|/connections/listconsentlinks/action|List Consent Links for Connections.|
|/deploymentlocations/read|Get Deployment Locations.|
|/sourcecontrols/read|Get Source Controls.|
|/sourcecontrols/write|Update Source Controls.|
|/billingmeters/read|Get list of billing meters.|
|/locations/extractapidefinitionfromwsdl/action|Extract Api Definition from WSDL for Locations.|
|/locations/listwsdlinterfaces/action|List WSDL Interfaces for Locations.|
|/locations/managedapis/read|Get Locations Managed APIs.|
|/locations/managedapis/Join/Action|Joins a Managed API.|
|/locations/managedapis/apioperations/read|Get Locations Managed API Operations.|
|/locations/apioperations/read|Get Locations API Operations.|
|/locations/connectiongatewayinstallations/read|Get Locations Connection Gateway Installations.|
|/listSitesAssignedToHostName/Read|Get names of sites assigned to hostname.|

## Microsoft.WorkloadMonitor

| Operation | Description |
|---|---|
|/workloads/read|Reads a workload resource|
|/workloads/write|Writes a workload resource|
|/workloads/delete|Deletes a workload resource|
|/healthInstances/read|Read operations resources|
|/components/read|Read operations resources|
|/Operations/read|Read operations resources|

## Next steps

- Learn how to [create a custom role](role-based-access-control-custom-roles.md).
- Review the [built in RBAC roles](role-based-access-built-in-roles.md).
- Learn how to manage access assignments [by user](role-based-access-control-manage-assignments.md) or [by resource](role-based-access-control-configure.md) 
- Learn how to [View activity logs to audit actions on resources](~/articles/azure-resource-manager/resource-group-audit.md)

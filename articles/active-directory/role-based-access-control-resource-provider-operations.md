---
title: Azure Resource Manager Provider Operations | Microsoft Docs
description: Details the operations available on the Microsoft Azure Resource Manager resource providers
services: active-directory
documentationcenter:
author: jboeshart
manager: 


ms.service: active-directory
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 04/19/2017
ms.author: jaboes

---
# Azure Resource Manager Resource Provider operations

This document lists the operations available for each Microsoft Azure Resource Manager resource provider. These can be used in custom roles to provide granular Role-Based Access Control (RBAC) permissions to resources in Azure. Please note this is not a comprehensive list and operations may be added or removed as each provider is updated. Operation strings follow the format of `Microsoft.<ProviderName>/<ChildResourceType>/<action>`. For a comprehensive and current list please use `Get-AzureRmProviderOperation` (in PowerShell) or `azure provider operations show` (in Azure CLI) to list operations of Azure resource providers.

## Microsoft.ADHybridHealthService

| Operation | Description |
|---|---|
|Microsoft.ADHybridHealthService/configuration/action|Updates Tenant Configuration.|
|Microsoft.ADHybridHealthService/services/action|Updates a service instance in the tenant.|
|Microsoft.ADHybridHealthService/configuration/write|Creates a Tenant Configuration.|
|Microsoft.ADHybridHealthService/configuration/read|Reads the Tenant Configuration.|
|Microsoft.ADHybridHealthService/services/write|Creates a service instance in the tenant.|
|Microsoft.ADHybridHealthService/services/read|Reads the service instances in the tenant.|
|Microsoft.ADHybridHealthService/services/delete|Deletes a service instance in the tenant.|
|Microsoft.ADHybridHealthService/services/servicemembers/action|Creates a service member instance in the service.|
|Microsoft.ADHybridHealthService/services/servicemembers/read|Reads the service member instance in the service.|
|Microsoft.ADHybridHealthService/services/servicemembers/delete|Deletes a service member instance in the service.|
|Microsoft.ADHybridHealthService/services/servicemembers/alerts/read|Reads the alerts for a service member.|
|Microsoft.ADHybridHealthService/services/alerts/read|Reads the alerts for a service.|
|Microsoft.ADHybridHealthService/services/alerts/read|Reads the alerts for a service.|

## Microsoft.Advisor

| Operation | Description |
|---|---|
|Microsoft.Advisor/generateRecommendations/action|Generates recommendations|
|Microsoft.Advisor/suppressions/action|Creates/updates suppressions|
|Microsoft.Advisor/register/action|Registers the subscription for the Microsoft Advisor|
|Microsoft.Advisor/generateRecommendations/read|Gets generate recommendations status|
|Microsoft.Advisor/recommendations/read|Reads recommendations|
|Microsoft.Advisor/suppressions/read|Gets suppressions|
|Microsoft.Advisor/suppressions/delete|Deletes suppression|

## Microsoft.AnalysisServices

| Operation | Description |
|---|---|
|Microsoft.AnalysisServices/servers/read|Retrieves the information of the specified Analysis Server.|
|Microsoft.AnalysisServices/servers/write|Creates or updates the specified Analysis Server.|
|Microsoft.AnalysisServices/servers/delete|Deletes the Analysis Server.|
|Microsoft.AnalysisServices/servers/suspend/action|Suspends the Analysis Server.|
|Microsoft.AnalysisServices/servers/resume/action|Resumes the Analysis Server.|
|Microsoft.AnalysisServices/servers/checkNameAvailability/action|Checks that given Analysis Server name is valid and not in use.|

## Microsoft.ApiManagement

| Operation | Description |
|---|---|
|Microsoft.ApiManagement/checkNameAvailability/action|Checks if provided service name is available|
|Microsoft.ApiManagement/register/action|Register subscription for Microsoft.ApiManagement resource provider|
|Microsoft.ApiManagement/unregister/action|Un-register subscription for Microsoft.ApiManagement resource provider|
|Microsoft.ApiManagement/service/write|Create a new instance of API Management Service|
|Microsoft.ApiManagement/service/read|Read metadata for an API Management Service instance|
|Microsoft.ApiManagement/service/delete|Delete API Management Service instance|
|Microsoft.ApiManagement/service/updatehostname/action|Setup, update or remove custom domain names for an API Management Service|
|Microsoft.ApiManagement/service/uploadcertificate/action|Upload SSL certificate for an API Management Service|
|Microsoft.ApiManagement/service/backup/action|Backup API Management Service to the specified container in a user provided storage account|
|Microsoft.ApiManagement/service/restore/action|Restore API Management Service from the specified container in a user provided storage account|
|Microsoft.ApiManagement/service/managedeployments/action|Change SKU/units, add/remove regional deployments of API Management Service|
|Microsoft.ApiManagement/service/getssotoken/action|Gets SSO token that can be used to login into API Management Service Legacy portal as an administrator|
|Microsoft.ApiManagement/service/applynetworkconfigurationupdates/action|Updates the Microsoft.ApiManagement resources running in Virtual Network to pick updated Network Settings.|
|Microsoft.ApiManagement/service/operationresults/read|Gets current status of long running operation|
|Microsoft.ApiManagement/service/networkStatus/read|Gets the network access status of resources.|
|Microsoft.ApiManagement/service/loggers/read|Get list of loggers or Get details of logger|
|Microsoft.ApiManagement/service/loggers/write|Add new logger or Update existing logger details|
|Microsoft.ApiManagement/service/loggers/delete|Remove existing logger|
|Microsoft.ApiManagement/service/users/read|Get a list of registered users or Get account details of a user|
|Microsoft.ApiManagement/service/users/write|Register a new user or Update account details of an existing user|
|Microsoft.ApiManagement/service/users/delete|Remove user account|
|Microsoft.ApiManagement/service/users/generateSsoUrl/action|Generate SSO URL. The URL can be used to access admin portal|
|Microsoft.ApiManagement/service/users/subscriptions/read|Get list of user subscriptions|
|Microsoft.ApiManagement/service/users/keys/read|Get list of user keys|
|Microsoft.ApiManagement/service/users/groups/read|Get list of user groups|
|Microsoft.ApiManagement/service/tenant/operationResults/read|Get list of operation results or Get result of a specific operation|
|Microsoft.ApiManagement/service/tenant/policy/read|Get policy configuration for the tenant|
|Microsoft.ApiManagement/service/tenant/policy/write|Set policy configuration for the tenant|
|Microsoft.ApiManagement/service/tenant/policy/delete|Remove policy configuration for the tenant|
|Microsoft.ApiManagement/service/tenant/configuration/save/action|Creates commit with configuration snapshot to the specified branch in the repository|
|Microsoft.ApiManagement/service/tenant/configuration/deploy/action|Runs a deployment task to apply changes from the specified git branch to the configuration in database.|
|Microsoft.ApiManagement/service/tenant/configuration/validate/action|Validates changes from the specified git branch|
|Microsoft.ApiManagement/service/tenant/configuration/operationResults/read|Get list of operation results or Get result of a specific operation|
|Microsoft.ApiManagement/service/tenant/configuration/syncState/read|Get status of last git synchronization|
|Microsoft.ApiManagement/service/tenant/access/read|Get tenant access information details|
|Microsoft.ApiManagement/service/tenant/access/write|Update tenant access information details|
|Microsoft.ApiManagement/service/tenant/access/regeneratePrimaryKey/action|Regenerate primary access key|
|Microsoft.ApiManagement/service/tenant/access/regenerateSecondaryKey/action|Regenerate secondary access key|
|Microsoft.ApiManagement/service/identityProviders/read|Get list of Identity providers or Get details of Identity Provider|
|Microsoft.ApiManagement/service/identityProviders/write|Create a new Identity Provider or Update details of an existing Identity Provider|
|Microsoft.ApiManagement/service/identityProviders/delete|Remove existing Identity Provider|
|Microsoft.ApiManagement/service/subscriptions/read|Get a list of product subscriptions or Get details of product subscription|
|Microsoft.ApiManagement/service/subscriptions/write|Subscribe an existing user to an existing product or Update existing subscription details. This operation can be used to renew subscription|
|Microsoft.ApiManagement/service/subscriptions/delete|Delete subscription. This operation can be used to delete subscription|
|Microsoft.ApiManagement/service/subscriptions/regeneratePrimaryKey/action|Regenerate subscription primary key|
|Microsoft.ApiManagement/service/subscriptions/regenerateSecondaryKey/action|Regenerate subscription secondary key|
|Microsoft.ApiManagement/service/backends/read|Get list of backends or Get details of backend|
|Microsoft.ApiManagement/service/backends/write|Add a new backend or Update existing backend details|
|Microsoft.ApiManagement/service/backends/delete|Remove existing backend|
|Microsoft.ApiManagement/service/apis/read|Get list of all registered APIs or Get details of API|
|Microsoft.ApiManagement/service/apis/write|Create new API or Update existing API details|
|Microsoft.ApiManagement/service/apis/delete|Remove existing API|
|Microsoft.ApiManagement/service/apis/policy/read|Get policy configuration details for API|
|Microsoft.ApiManagement/service/apis/policy/write|Set policy configuration details for API|
|Microsoft.ApiManagement/service/apis/policy/delete|Remove policy configuration from API|
|Microsoft.ApiManagement/service/apis/operations/read|Get list of existing API operations or Get details of API operation|
|Microsoft.ApiManagement/service/apis/operations/write|Create new API operation or Update existing API operation|
|Microsoft.ApiManagement/service/apis/operations/delete|Remove existing API operation|
|Microsoft.ApiManagement/service/apis/operations/policy/read|Get policy configuration details for operation|
|Microsoft.ApiManagement/service/apis/operations/policy/write|Set policy configuration details for operation|
|Microsoft.ApiManagement/service/apis/operations/policy/delete|Remove policy configuration from operation|
|Microsoft.ApiManagement/service/products/read|Get list of products or Get details of product|
|Microsoft.ApiManagement/service/products/write|Create new product or Update existing product details|
|Microsoft.ApiManagement/service/products/delete|Remove existing product|
|Microsoft.ApiManagement/service/products/subscriptions/read|Get list of product subscriptions|
|Microsoft.ApiManagement/service/products/apis/read|Get list of APIs added to existing product|
|Microsoft.ApiManagement/service/products/apis/write|Add existing API to existing product|
|Microsoft.ApiManagement/service/products/apis/delete|Remove existing API from existing product|
|Microsoft.ApiManagement/service/products/policy/read|Get policy configuration of existing product|
|Microsoft.ApiManagement/service/products/policy/write|Set policy configuration for existing product|
|Microsoft.ApiManagement/service/products/policy/delete|Remove policy configuration from existing product|
|Microsoft.ApiManagement/service/products/groups/read|Get list of developer groups associated with product|
|Microsoft.ApiManagement/service/products/groups/write|Associate existing developer group with existing product|
|Microsoft.ApiManagement/service/products/groups/delete|Delete association of existing developer group with existing product|
|Microsoft.ApiManagement/service/openidConnectProviders/read|Get list of OpenID Connect providers or Get details of OpenID Connect Provider|
|Microsoft.ApiManagement/service/openidConnectProviders/write|Create a new OpenID Connect Provider or Update details of an existing OpenID Connect Provider|
|Microsoft.ApiManagement/service/openidConnectProviders/delete|Remove existing OpenID Connect Provider|
|Microsoft.ApiManagement/service/certificates/read|Get list of certificates or Get details of certificate|
|Microsoft.ApiManagement/service/certificates/write|Add new certificate|
|Microsoft.ApiManagement/service/certificates/delete|Remove existing certificate|
|Microsoft.ApiManagement/service/properties/read|Gets list of all properties or Gets details of specified property|
|Microsoft.ApiManagement/service/properties/write|Creates a new property or Updates value for specified property|
|Microsoft.ApiManagement/service/properties/delete|Removes existing property|
|Microsoft.ApiManagement/service/groups/read|Get list of groups or Gets details of a group|
|Microsoft.ApiManagement/service/groups/write|Create new group or Update existing group details|
|Microsoft.ApiManagement/service/groups/delete|Remove existing group|
|Microsoft.ApiManagement/service/groups/users/read|Get list of group users|
|Microsoft.ApiManagement/service/groups/users/write|Add existing user to existing group|
|Microsoft.ApiManagement/service/groups/users/delete|Remove existing user from existing group|
|Microsoft.ApiManagement/service/authorizationServers/read|Get list of authorization servers or Get details of authorization server|
|Microsoft.ApiManagement/service/authorizationServers/write|Create a new authorization server or Update details of an existing authorization server|
|Microsoft.ApiManagement/service/authorizationServers/delete|Remove existing authorization server|
|Microsoft.ApiManagement/service/reports/bySubscription/read|Get report aggregated by subscription.|
|Microsoft.ApiManagement/service/reports/byRequest/read|Get requests reposting data|
|Microsoft.ApiManagement/service/reports/byOperation/read|Get report aggregated by operations|
|Microsoft.ApiManagement/service/reports/byGeo/read|Get report aggregated by geographical region|
|Microsoft.ApiManagement/service/reports/byUser/read|Get report aggregated by developers.|
|Microsoft.ApiManagement/service/reports/byTime/read|Get report aggregated by time periods|
|Microsoft.ApiManagement/service/reports/byApi/read|Get report aggregated by APIs|
|Microsoft.ApiManagement/service/reports/byProduct/read|Get report aggregated by products.|

## Microsoft.AppService

| Operation | Description |
|---|---|
|Microsoft.AppService/appidentities/Read|Returns the resource (web site) registered with the Gateway.|
|Microsoft.AppService/appidentities/Write|Creates a new App Identity.|
|Microsoft.AppService/appidentities/Delete|Deletes an existing App Identity.|
|Microsoft.AppService/deploymenttemplates/listMetadata/Action|Lists UI Metadata associated with the API App package.|
|Microsoft.AppService/deploymenttemplates/generate/Action|Returns a Deployment Template to provision API App instance(s).|
|Microsoft.AppService/gateways/Read|Returns the Gateway instance.|
|Microsoft.AppService/gateways/Write|Creates a new Gateway or updates existing one.|
|Microsoft.AppService/gateways/Delete|Deletes an existing Gateway instance.|
|Microsoft.AppService/gateways/listLoginUris/Action|Populates token store and returns OAuth login URIs.|
|Microsoft.AppService/gateways/listKeys/Action|Returns Gateway secrets.|
|Microsoft.AppService/gateways/tokens/Write|Creates a new Zumo Token with the given name.|
|Microsoft.AppService/gateways/registrations/Read|Returns the resource (web site) registered with the Gateway.|
|Microsoft.AppService/gateways/registrations/Write|Registers a resource (web site) with the Gateway.|
|Microsoft.AppService/gateways/registrations/Delete|Unregisters a resource (web site) from the Gateway.|
|Microsoft.AppService/apiapps/Read|Returns the API App instance.|
|Microsoft.AppService/apiapps/Write|Creates a new API App or updates existing one.|
|Microsoft.AppService/apiapps/Delete|Deletes an existing API App instance.|
|Microsoft.AppService/apiapps/listStatus/Action|Returns API App status.|
|Microsoft.AppService/apiapps/listKeys/Action|Returns API App secrets.|
|Microsoft.AppService/apiapps/apidefinitions/Read|Returns API App's API definition.|

## Microsoft.Authorization

| Operation | Description |
|---|---|
|Microsoft.Authorization/elevateAccess/action|Grants the caller User Access Administrator access at the tenant scope|
|Microsoft.Authorization/classicAdministrators/read|Reads the administrators for the subscription.|
|Microsoft.Authorization/classicAdministrators/write|Add or modify administrator to a subscription.|
|Microsoft.Authorization/classicAdministrators/delete|Removes the administrator from the subscription.|
|Microsoft.Authorization/locks/read|Gets locks at the specified scope.|
|Microsoft.Authorization/locks/write|Add locks at the specified scope.|
|Microsoft.Authorization/locks/delete|Delete locks at the specified scope.|
|Microsoft.Authorization/policyAssignments/read|Get information about a policy assignment.|
|Microsoft.Authorization/policyAssignments/write|Create a policy assignment at the specified scope.|
|Microsoft.Authorization/policyAssignments/delete|Delete a policy assignment at the specified scope.|
|Microsoft.Authorization/permissions/read|Lists all the permissions the caller has at a given scope.|
|Microsoft.Authorization/roleDefinitions/read|Get information about a role definition.|
|Microsoft.Authorization/roleDefinitions/write|Create or update a custom role definition with specified permissions and assignable scopes.|
|Microsoft.Authorization/roleDefinitions/delete|Delete the specified custom role definition.|
|Microsoft.Authorization/providerOperations/read|Get operations for all resource providers which can be used in role definitions.|
|Microsoft.Authorization/policyDefinitions/read|Get information about a policy definition.|
|Microsoft.Authorization/policyDefinitions/write|Create a custom policy definition.|
|Microsoft.Authorization/policyDefinitions/delete|Delete a policy definition.|
|Microsoft.Authorization/roleAssignments/read|Get information about a role assignment.|
|Microsoft.Authorization/roleAssignments/write|Create a role assignment at the specified scope.|
|Microsoft.Authorization/roleAssignments/delete|Delete a role assignment at the specified scope.|

## Microsoft.Automation

| Operation | Description |
|---|---|
|Microsoft.Automation/automationAccounts/read|Gets an Azure Automation account|
|Microsoft.Automation/automationAccounts/write|Creates or updates an Azure Automation account|
|Microsoft.Automation/automationAccounts/delete|Deletes an Azure Automation account|
|Microsoft.Automation/automationAccounts/configurations/readContent/action|Gets an Azure Automation DSC's content|
|Microsoft.Automation/automationAccounts/hybridRunbookWorkerGroups/read|Reads Hybrid Runbook Worker Resources|
|Microsoft.Automation/automationAccounts/hybridRunbookWorkerGroups/delete|Deletes Hybrid Runbook Worker Resources|
|Microsoft.Automation/automationAccounts/jobSchedules/read|Gets an Azure Automation job schedule|
|Microsoft.Automation/automationAccounts/jobSchedules/write|Creates an Azure Automation job schedule|
|Microsoft.Automation/automationAccounts/jobSchedules/delete|Deletes an Azure Automation job schedule|
|Microsoft.Automation/automationAccounts/connectionTypes/read|Gets an Azure Automation connection type asset|
|Microsoft.Automation/automationAccounts/connectionTypes/write|Creates an Azure Automation connection type asset|
|Microsoft.Automation/automationAccounts/connectionTypes/delete|Deletes an Azure Automation connection type asset|
|Microsoft.Automation/automationAccounts/modules/read|Gets an Azure Automation module|
|Microsoft.Automation/automationAccounts/modules/write|Creates or updates an Azure Automation module|
|Microsoft.Automation/automationAccounts/modules/delete|Deletes an Azure Automation module|
|Microsoft.Automation/automationAccounts/credentials/read|Gets an Azure Automation credential asset|
|Microsoft.Automation/automationAccounts/credentials/write|Creates or updates an Azure Automation credential asset|
|Microsoft.Automation/automationAccounts/credentials/delete|Deletes an Azure Automation credential asset|
|Microsoft.Automation/automationAccounts/certificates/read|Gets an Azure Automation certificate asset|
|Microsoft.Automation/automationAccounts/certificates/write|Creates or updates an Azure Automation certificate asset|
|Microsoft.Automation/automationAccounts/certificates/delete|Deletes an Azure Automation certificate asset|
|Microsoft.Automation/automationAccounts/schedules/read|Gets an Azure Automation schedule asset|
|Microsoft.Automation/automationAccounts/schedules/write|Creates or updates an Azure Automation schedule asset|
|Microsoft.Automation/automationAccounts/schedules/delete|Deletes an Azure Automation schedule asset|
|Microsoft.Automation/automationAccounts/jobs/read|Gets an Azure Automation job|
|Microsoft.Automation/automationAccounts/jobs/write|Creates an Azure Automation job|
|Microsoft.Automation/automationAccounts/jobs/stop/action|Stops an Azure Automation job|
|Microsoft.Automation/automationAccounts/jobs/suspend/action|Suspends an Azure Automation job|
|Microsoft.Automation/automationAccounts/jobs/resume/action|Resumes an Azure Automation job|
|Microsoft.Automation/automationAccounts/jobs/runbookContent/action|Gets the content of the Azure Automation runbook at the time of the job execution|
|Microsoft.Automation/automationAccounts/jobs/output/action|Gets the output of a job|
|Microsoft.Automation/automationAccounts/jobs/read|Gets an Azure Automation job|
|Microsoft.Automation/automationAccounts/jobs/write|Creates an Azure Automation job|
|Microsoft.Automation/automationAccounts/jobs/stop/action|Stops an Azure Automation job|
|Microsoft.Automation/automationAccounts/jobs/suspend/action|Suspends an Azure Automation job|
|Microsoft.Automation/automationAccounts/jobs/resume/action|Resumes an Azure Automation job|
|Microsoft.Automation/automationAccounts/jobs/streams/read|Gets an Azure Automation job stream|
|Microsoft.Automation/automationAccounts/connections/read|Gets an Azure Automation connection asset|
|Microsoft.Automation/automationAccounts/connections/write|Creates or updates an Azure Automation connection asset|
|Microsoft.Automation/automationAccounts/connections/delete|Deletes an Azure Automation connection asset|
|Microsoft.Automation/automationAccounts/variables/read|Reads an Azure Automation variable asset|
|Microsoft.Automation/automationAccounts/variables/write|Creates or updates an Azure Automation variable asset|
|Microsoft.Automation/automationAccounts/variables/delete|Deletes an Azure Automation variable asset|
|Microsoft.Automation/automationAccounts/runbooks/readContent/action|Gets the content of an Azure Automation runbook|
|Microsoft.Automation/automationAccounts/runbooks/read|Gets an Azure Automation runbook|
|Microsoft.Automation/automationAccounts/runbooks/write|Creates or updates an Azure Automation runbook|
|Microsoft.Automation/automationAccounts/runbooks/delete|Deletes an Azure Automation runbook|
|Microsoft.Automation/automationAccounts/runbooks/draft/readContent/action|Gets the content of an Azure Automation runbook draft|
|Microsoft.Automation/automationAccounts/runbooks/draft/writeContent/action|Creates the content of an Azure Automation runbook draft|
|Microsoft.Automation/automationAccounts/runbooks/draft/read|Gets an Azure Automation runbook draft|
|Microsoft.Automation/automationAccounts/runbooks/draft/publish/action|Publishes an Azure Automation runbook draft|
|Microsoft.Automation/automationAccounts/runbooks/draft/undoEdit/action|Undo edits to an Azure Automation runbook draft|
|Microsoft.Automation/automationAccounts/runbooks/draft/testJob/read|Gets an Azure Automation runbook draft test job|
|Microsoft.Automation/automationAccounts/runbooks/draft/testJob/write|Creates an Azure Automation runbook draft test job|
|Microsoft.Automation/automationAccounts/runbooks/draft/testJob/stop/action|Stops an Azure Automation runbook draft test job|
|Microsoft.Automation/automationAccounts/runbooks/draft/testJob/suspend/action|Suspends an Azure Automation runbook draft test job|
|Microsoft.Automation/automationAccounts/runbooks/draft/testJob/resume/action|Resumes an Azure Automation runbook draft test job|
|Microsoft.Automation/automationAccounts/webhooks/read|Reads an Azure Automation webhook|
|Microsoft.Automation/automationAccounts/webhooks/write|Creates or updates an Azure Automation webhook|
|Microsoft.Automation/automationAccounts/webhooks/delete|Deletes an Azure Automation webhook |
|Microsoft.Automation/automationAccounts/webhooks/generateUri/action|Generates a URI for an Azure Automation webhook|

## Microsoft.AzureActiveDirectory

This provider is not a full ARM provider and does not provide any ARM operations.

## Microsoft.Batch

| Operation | Description |
|---|---|
|Microsoft.Batch/register/action|Registers the subscription for the Batch Resource Provider and enables the creation of Batch accounts|
|Microsoft.Batch/batchAccounts/write|Creates a new Batch account or updates an existing Batch account|
|Microsoft.Batch/batchAccounts/read|Lists Batch accounts or gets the properties of a Batch account|
|Microsoft.Batch/batchAccounts/delete|Deletes a Batch account|
|Microsoft.Batch/batchAccounts/listkeys/action|Lists access keys for a Batch account|
|Microsoft.Batch/batchAccounts/regeneratekeys/action|Regenerates access keys for a Batch account|
|Microsoft.Batch/batchAccounts/syncAutoStorageKeys/action|Synchronizes access keys for the auto storage account configured for a Batch account|
|Microsoft.Batch/batchAccounts/applications/read|Lists applications or gets the properties of an application|
|Microsoft.Batch/batchAccounts/applications/write|Creates a new application or updates an existing application|
|Microsoft.Batch/batchAccounts/applications/delete|Deletes an application|
|Microsoft.Batch/batchAccounts/applications/versions/read|Gets the properties of an application package|
|Microsoft.Batch/batchAccounts/applications/versions/write|Creates a new application package or updates an existing application package|
|Microsoft.Batch/batchAccounts/applications/versions/activate/action|Activates an application package|
|Microsoft.Batch/batchAccounts/applications/versions/delete|Deletes an application package|
|Microsoft.Batch/locations/quotas/read|Gets Batch quotas of the specified subscription at the specified Azure region|

## Microsoft.Billing

| Operation | Description |
|---|---|
|Microsoft.Billing/invoices/read|Lists available invoices|

## Microsoft.BingMaps

| Operation | Description |
|---|---|
|Microsoft.BingMaps/mapApis/Read|Read Operation|
|Microsoft.BingMaps/mapApis/Write|Write Operation|
|Microsoft.BingMaps/mapApis/Delete|Delete Operation|
|Microsoft.BingMaps/mapApis/regenerateKey/action|Regenerates the Key|
|Microsoft.BingMaps/mapApis/listSecrets/action|List the Secrets|
|Microsoft.BingMaps/mapApis/listSingleSignOnToken/action|Read Single Sign On Authorization Token For The Resource|
|Microsoft.BingMaps/Operations/read|Description of the operation.|

## Microsoft.Cache

| Operation | Description |
|---|---|
|Microsoft.Cache/checknameavailability/action|Checks if a name is available for use with a new Redis Cache|
|Microsoft.Cache/register/action|Registers the 'Microsoft.Cache' resource provider with a subscription|
|Microsoft.Cache/unregister/action|Unregisters the 'Microsoft.Cache' resource provider with a subscription|
|Microsoft.Cache/redis/write|Modify the Redis Cache's settings and configuration in the management portal|
|Microsoft.Cache/redis/read|View the Redis Cache's settings and configuration in the management portal|
|Microsoft.Cache/redis/delete|Delete the entire Redis Cache|
|Microsoft.Cache/redis/listKeys/action|View the value of Redis Cache access keys in the management portal|
|Microsoft.Cache/redis/regenerateKey/action|Change the value of Redis Cache access keys in the management portal|
|Microsoft.Cache/redis/import/action|Import data of a specified format from multiple blobs into Redis|
|Microsoft.Cache/redis/export/action|Export Redis data to prefixed storage blobs in specified format|
|Microsoft.Cache/redis/forceReboot/action|Force reboot a cache instance, potentially with data loss.|
|Microsoft.Cache/redis/stop/action|Stop a cache instance.|
|Microsoft.Cache/redis/start/action|Start a cache instance.|
|Microsoft.Cache/redis/metricDefinitions/read|Gets the available metrics for a Redis Cache|
|Microsoft.Cache/redis/firewallRules/read|Get the IP firewall rules of a Redis Cache|
|Microsoft.Cache/redis/firewallRules/write|Edit the IP firewall rules of a Redis Cache|
|Microsoft.Cache/redis/firewallRules/delete|Delete IP firewall rules of a Redis Cache|
|Microsoft.Cache/redis/listUpgradeNotifications/read|List the latest Upgrade Notifications for the cache tenant.|
|Microsoft.Cache/redis/linkedservers/read|Get Linked Servers associated with a redis cache.|
|Microsoft.Cache/redis/linkedservers/write|Add Linked Server to a Redis Cache|
|Microsoft.Cache/redis/linkedservers/delete|Delete Linked Server from a Redis Cache|
|Microsoft.Cache/redis/patchSchedules/read|Gets the patching schedule of a Redis Cache|
|Microsoft.Cache/redis/patchSchedules/write|Modify the patching schedule of a Redis Cache|
|Microsoft.Cache/redis/patchSchedules/delete|Delete the patch schedule of a Redis Cache|

## Microsoft.CertificateRegistration

| Operation | Description |
|---|---|
|Microsoft.CertificateRegistration/provisionGlobalAppServicePrincipalInUserTenant/Action|Provision service principal for service app principal|
|Microsoft.CertificateRegistration/validateCertificateRegistrationInformation/Action|Validate certificate purchase object without submitting it|
|Microsoft.CertificateRegistration/register/action|Register the Microsoft Certificates resource provider for the subscription|
|Microsoft.CertificateRegistration/certificateOrders/Write|Add a new certificateOrder or update an existing one|
|Microsoft.CertificateRegistration/certificateOrders/Delete|Delete an existing AppServiceCertificate|
|Microsoft.CertificateRegistration/certificateOrders/Read|Get the list of CertificateOrders|
|Microsoft.CertificateRegistration/certificateOrders/reissue/Action|Reissue an existing certificateorder|
|Microsoft.CertificateRegistration/certificateOrders/renew/Action|Renew an existing certificateorder|
|Microsoft.CertificateRegistration/certificateOrders/retrieveCertificateActions/Action|Retrieve the list of certificate actions|
|Microsoft.CertificateRegistration/certificateOrders/retrieveEmailHistory/Action|Retrieve certificate email history|
|Microsoft.CertificateRegistration/certificateOrders/resendEmail/Action|Resend certificate email|
|Microsoft.CertificateRegistration/certificateOrders/verifyDomainOwnership/Action|Verify domain ownership|
|Microsoft.CertificateRegistration/certificateOrders/resendRequestEmails/Action|Resend request emails to another email address|
|Microsoft.CertificateRegistration/certificateOrders/resendRequestEmails/Action|Retrieve site seal for an issued App Service Certificate|
|Microsoft.CertificateRegistration/certificateOrders/certificates/Write|Add a new certificate or update an existing one|
|Microsoft.CertificateRegistration/certificateOrders/certificates/Delete|Delete an existing certificate|
|Microsoft.CertificateRegistration/certificateOrders/certificates/Read|Get the list of certificates|

## Microsoft.ClassicCompute

| Operation | Description |
|---|---|
|Microsoft.ClassicCompute/register/action|Register to Classic Compute|
|Microsoft.ClassicCompute/checkDomainNameAvailability/action|Checks the availability of a given domain name.|
|Microsoft.ClassicCompute/moveSubscriptionResources/action|Move all classic resources to a different subscription.|
|Microsoft.ClassicCompute/validateSubscriptionMoveAvailability/action|Validate the subscription's availability for classic move operation.|
|Microsoft.ClassicCompute/operatingSystemFamilies/read|Lists the guest operating system families available in Microsoft Azure, and also lists the operating system versions available for each family.|
|Microsoft.ClassicCompute/capabilities/read|Shows the capabilities|
|Microsoft.ClassicCompute/operatingSystems/read|Lists the versions of the guest operating system that are currently available in Microsoft Azure.|
|Microsoft.ClassicCompute/resourceTypes/skus/read|Gets the Sku list for supported resource types.|
|Microsoft.ClassicCompute/domainNames/read|Return the domain names for resources.|
|Microsoft.ClassicCompute/domainNames/write|Add or modify the domain names for resources.|
|Microsoft.ClassicCompute/domainNames/delete|Remove the domain names for resources.|
|Microsoft.ClassicCompute/domainNames/swap/action|Swaps the staging slot to the production slot.|
|Microsoft.ClassicCompute/domainNames/serviceCertificates/read|Returns the service certificates used.|
|Microsoft.ClassicCompute/domainNames/serviceCertificates/write|Add or modify the service certificates used.|
|Microsoft.ClassicCompute/domainNames/serviceCertificates/delete|Delete the service certificates used.|
|Microsoft.ClassicCompute/domainNames/serviceCertificates/operationStatuses/read|Reads the operation status for the domain names service certificates.|
|Microsoft.ClassicCompute/domainNames/capabilities/read|Shows the domain name capabilities|
|Microsoft.ClassicCompute/domainNames/extensions/read|Returns the domain name extensions.|
|Microsoft.ClassicCompute/domainNames/extensions/write|Add the domain name extensions.|
|Microsoft.ClassicCompute/domainNames/extensions/delete|Remove the domain name extensions.|
|Microsoft.ClassicCompute/domainNames/extensions/operationStatuses/read|Reads the operation status for the domain names extensions.|
|Microsoft.ClassicCompute/domainNames/active/write|Sets the active domain name.|
|Microsoft.ClassicCompute/domainNames/slots/read|Shows the deployment slots.|
|Microsoft.ClassicCompute/domainNames/slots/write|Creates or update the deployment.|
|Microsoft.ClassicCompute/domainNames/slots/delete|Deletes a given deployment slot.|
|Microsoft.ClassicCompute/domainNames/slots/start/action|Starts a deployment slot.|
|Microsoft.ClassicCompute/domainNames/slots/stop/action|Suspends the deployment slot.|
|Microsoft.ClassicCompute/domainNames/slots/operationStatuses/read|Reads the operation status for the domain names slots.|
|Microsoft.ClassicCompute/domainNames/slots/roles/read|Get the role for the deployment slot.|
|Microsoft.ClassicCompute/domainNames/slots/roles/extensionReferences/read|Returns the extension reference for the deployment slot role.|
|Microsoft.ClassicCompute/domainNames/slots/roles/extensionReferences/write|Add or modify the extension reference for the deployment slot role.|
|Microsoft.ClassicCompute/domainNames/slots/roles/extensionReferences/delete|Remove the extension reference for the deployment slot role.|
|Microsoft.ClassicCompute/domainNames/slots/roles/extensionReferences/operationStatuses/read|Reads the operation status for the domain names slots roles extension references.|
|Microsoft.ClassicCompute/domainNames/slots/roles/roleInstances/read|Get the role instance.|
|Microsoft.ClassicCompute/domainNames/slots/roles/roleInstances/restart/action|Restarts role instances.|
|Microsoft.ClassicCompute/domainNames/slots/roles/roleInstances/reimage/action|Reimages the role instance.|
|Microsoft.ClassicCompute/domainNames/slots/roles/roleInstances/operationStatuses/read|Reads the operation status for the domain names slots roles role instances.|
|Microsoft.ClassicCompute/domainNames/slots/state/start/write|Changes the deployment slot state to stopped.|
|Microsoft.ClassicCompute/domainNames/slots/state/stop/write|Changes the deployment slot state to started.|
|Microsoft.ClassicCompute/domainNames/slots/upgradeDomain/write|Walk upgrade the domain.|
|Microsoft.ClassicCompute/domainNames/internalLoadBalancers/read|Gets the internal load balancers.|
|Microsoft.ClassicCompute/domainNames/internalLoadBalancers/write|Creates a new internal load balance.|
|Microsoft.ClassicCompute/domainNames/internalLoadBalancers/delete|Remove a new internal load balance.|
|Microsoft.ClassicCompute/domainNames/internalLoadBalancers/operationStatuses/read|Reads the operation status for the domain names internal load balancers.|
|Microsoft.ClassicCompute/domainNames/loadBalancedEndpointSets/read|Shows the load balanced endpoint sets|
|Microsoft.ClassicCompute/domainNames/loadBalancedEndpointSets/operationStatuses/read|Reads the operation status for the domain names load balanced endpoint sets.|
|Microsoft.ClassicCompute/domainNames/availabilitySets/read|Show the availability set for the resource.|
|Microsoft.ClassicCompute/quotas/read|Get the quota for the subscription.|
|Microsoft.ClassicCompute/virtualMachines/read|Retrieves list of virtual machines.|
|Microsoft.ClassicCompute/virtualMachines/write|Add or modify virtual machines.|
|Microsoft.ClassicCompute/virtualMachines/delete|Removes virtual machines.|
|Microsoft.ClassicCompute/virtualMachines/start/action|Start the virtual machine.|
|Microsoft.ClassicCompute/virtualMachines/redeploy/action|Redeploys the virtual machine.|
|Microsoft.ClassicCompute/virtualMachines/restart/action|Restarts virtual machines.|
|Microsoft.ClassicCompute/virtualMachines/stop/action|Stops the virtual machine.|
|Microsoft.ClassicCompute/virtualMachines/shutdown/action|Shutdown the virtual machine.|
|Microsoft.ClassicCompute/virtualMachines/attachDisk/action|Attaches a data disk to a virtual machine.|
|Microsoft.ClassicCompute/virtualMachines/detachDisk/action|Detaches a data disk from virtual machine.|
|Microsoft.ClassicCompute/virtualMachines/downloadRemoteDesktopConnectionFile/action|Downloads the RDP file for virtual machine.|
|Microsoft.ClassicCompute/virtualMachines/networkInterfaces/associatedNetworkSecurityGroups/read|Gets the network security group associated with the network interface.|
|Microsoft.ClassicCompute/virtualMachines/networkInterfaces/associatedNetworkSecurityGroups/write|Adds a network security group associated with the network interface.|
|Microsoft.ClassicCompute/virtualMachines/networkInterfaces/associatedNetworkSecurityGroups/delete|Deletes the network security group associated with the network interface.|
|Microsoft.ClassicCompute/virtualMachines/networkInterfaces/associatedNetworkSecurityGroups/operationStatuses/read|Reads the operation status for the virtual machines associated network security groups.|
|Microsoft.ClassicCompute/virtualMachines/providers/Microsoft.Insights/metricDefinitions/read|Gets the metrics definitions.|
|Microsoft.ClassicCompute/virtualMachines/providers/Microsoft.Insights/diagnosticSettings/read|Get the diagnostics settings.|
|Microsoft.ClassicCompute/virtualMachines/providers/Microsoft.Insights/diagnosticSettings/write|Add or modify diagnostics settings.|
|Microsoft.ClassicCompute/virtualMachines/metrics/read|Gets the metrics.|
|Microsoft.ClassicCompute/virtualMachines/operationStatuses/read|Reads the operation status for the virtual machines.|
|Microsoft.ClassicCompute/virtualMachines/extensions/read|Gets the virtual machine extension.|
|Microsoft.ClassicCompute/virtualMachines/extensions/write|Puts the virtual machine extension.|
|Microsoft.ClassicCompute/virtualMachines/extensions/operationStatuses/read|Reads the operation status for the virtual machines extensions.|
|Microsoft.ClassicCompute/virtualMachines/asyncOperations/read|Gets the possible async operations|
|Microsoft.ClassicCompute/virtualMachines/disks/read|Retrives list of data disks|
|Microsoft.ClassicCompute/virtualMachines/associatedNetworkSecurityGroups/read|Gets the network security group associated with the virtual machine.|
|Microsoft.ClassicCompute/virtualMachines/associatedNetworkSecurityGroups/write|Adds a network security group associated with the virtual machine.|
|Microsoft.ClassicCompute/virtualMachines/associatedNetworkSecurityGroups/delete|Deletes the network security group associated with the virtual machine.|
|Microsoft.ClassicCompute/virtualMachines/associatedNetworkSecurityGroups/operationStatuses/read|Reads the operation status for the virtual machines associated network security groups.|

## Microsoft.ClassicNetwork

| Operation | Description |
|---|---|
|Microsoft.ClassicNetwork/register/action|Register to Classic Network|
|Microsoft.ClassicNetwork/gatewaySupportedDevices/read|Retrieves the list of supported devices.|
|Microsoft.ClassicNetwork/reservedIps/read|Gets the reserved Ips|
|Microsoft.ClassicNetwork/reservedIps/write|Add a new reserved Ip|
|Microsoft.ClassicNetwork/reservedIps/delete|Delete a reserved Ip.|
|Microsoft.ClassicNetwork/reservedIps/link/action|Link a reserved Ip|
|Microsoft.ClassicNetwork/reservedIps/join/action|Join a reserved Ip|
|Microsoft.ClassicNetwork/reservedIps/operationStatuses/read|Reads the operation status for the reserved ips.|
|Microsoft.ClassicNetwork/virtualNetworks/read|Get the virtual network.|
|Microsoft.ClassicNetwork/virtualNetworks/write|Add a new virtual network.|
|Microsoft.ClassicNetwork/virtualNetworks/delete|Deletes the virtual network.|
|Microsoft.ClassicNetwork/virtualNetworks/peer/action|Peers a virtual network with another virtual network.|
|Microsoft.ClassicNetwork/virtualNetworks/join/action|Joins the virtual network.|
|Microsoft.ClassicNetwork/virtualNetworks/checkIPAddressAvailability/action|Checks the availability of a given IP address in a virtual network.|
|Microsoft.ClassicNetwork/virtualNetworks/capabilities/read|Shows the capabilities|
|Microsoft.ClassicNetwork/virtualNetworks/subnets/associatedNetworkSecurityGroups/read|Gets the network security group associated with the subnet.|
|Microsoft.ClassicNetwork/virtualNetworks/subnets/associatedNetworkSecurityGroups/write|Adds a network security group associated with the subnet.|
|Microsoft.ClassicNetwork/virtualNetworks/subnets/associatedNetworkSecurityGroups/delete|Deletes the network security group associated with the subnet.|
|Microsoft.ClassicNetwork/virtualNetworks/subnets/associatedNetworkSecurityGroups/operationStatuses/read|Reads the operation status for the virtual network subnet associeted network security group.|
|Microsoft.ClassicNetwork/virtualNetworks/operationStatuses/read|Reads the operation status for the virtual networks.|
|Microsoft.ClassicNetwork/virtualNetworks/gateways/read|Gets the virtual network gateways.|
|Microsoft.ClassicNetwork/virtualNetworks/gateways/write|Adds a virtual network gateway.|
|Microsoft.ClassicNetwork/virtualNetworks/gateways/delete|Deletes the virtual network gateway.|
|Microsoft.ClassicNetwork/virtualNetworks/gateways/startDiagnostics/action|Starts diagnositic for the virtual network gateway.|
|Microsoft.ClassicNetwork/virtualNetworks/gateways/stopDiagnostics/action|Stops the diagnositic for the virtual network gateway.|
|Microsoft.ClassicNetwork/virtualNetworks/gateways/downloadDiagnostics/action|Downloads the gateway diagnostics.|
|Microsoft.ClassicNetwork/virtualNetworks/gateways/listCircuitServiceKey/action|Retrieves the circuit service key.|
|Microsoft.ClassicNetwork/virtualNetworks/gateways/downloadDeviceConfigurationScript/action|Downloads the device configuration script.|
|Microsoft.ClassicNetwork/virtualNetworks/gateways/listPackage/action|Lists the virtual network gateway package.|
|Microsoft.ClassicNetwork/virtualNetworks/gateways/operationStatuses/read|Reads the operation status for the virtual networks gateways.|
|Microsoft.ClassicNetwork/virtualNetworks/gateways/packages/read|Gets the virtual network gateway package.|
|Microsoft.ClassicNetwork/virtualNetworks/gateways/connections/read|Retrieves the list of connections.|
|Microsoft.ClassicNetwork/virtualNetworks/gateways/connections/connect/action|Connects a site to site gateway connection.|
|Microsoft.ClassicNetwork/virtualNetworks/gateways/connections/disconnect/action|Disconnects a site to site gateway connection.|
|Microsoft.ClassicNetwork/virtualNetworks/gateways/connections/test/action|Tests a site to site gateway connection.|
|Microsoft.ClassicNetwork/virtualNetworks/gateways/clientRevokedCertificates/read|Read the revoked client certificates.|
|Microsoft.ClassicNetwork/virtualNetworks/gateways/clientRevokedCertificates/write|Revokes a client certificate.|
|Microsoft.ClassicNetwork/virtualNetworks/gateways/clientRevokedCertificates/delete|Unrevokes a client certificate.|
|Microsoft.ClassicNetwork/virtualNetworks/gateways/clientRootCertificates/read|Find the client root certificates.|
|Microsoft.ClassicNetwork/virtualNetworks/gateways/clientRootCertificates/write|Uploads a new client root certificate.|
|Microsoft.ClassicNetwork/virtualNetworks/gateways/clientRootCertificates/delete|Deletes the virtual network gateway client certificate.|
|Microsoft.ClassicNetwork/virtualNetworks/gateways/clientRootCertificates/download/action|Downloads certificate by thumbprint.|
|Microsoft.ClassicNetwork/virtualNetworks/gateways/clientRootCertificates/listPackage/action|Lists the virtual network gateway certificate package.|
|Microsoft.ClassicNetwork/networkSecurityGroups/read|Gets the network security group.|
|Microsoft.ClassicNetwork/networkSecurityGroups/write|Adds a new network security group.|
|Microsoft.ClassicNetwork/networkSecurityGroups/delete|Deletes the network security group.|
|Microsoft.ClassicNetwork/networkSecurityGroups/operationStatuses/read|Reads the operation status for the network security group.|
|Microsoft.ClassicNetwork/networkSecurityGroups/securityRules/read|Gets the security rule.|
|Microsoft.ClassicNetwork/networkSecurityGroups/securityRules/write|Adds or update a security rule.|
|Microsoft.ClassicNetwork/networkSecurityGroups/securityRules/delete|Deletes the security rule.|
|Microsoft.ClassicNetwork/networkSecurityGroups/securityRules/operationStatuses/read|Reads the operation status for the network security group security rules.|
|Microsoft.ClassicNetwork/quotas/read|Get the quota for the subscription.|

## Microsoft.ClassicStorage

| Operation | Description |
|---|---|
|Microsoft.ClassicStorage/register/action|Register to Classic Storage|
|Microsoft.ClassicStorage/checkStorageAccountAvailability/action|Checks for the availability of a storage account.|
|Microsoft.ClassicStorage/capabilities/read|Shows the capabilities|
|Microsoft.ClassicStorage/publicImages/read|Gets the public virtual machine image.|
|Microsoft.ClassicStorage/images/read|Returns the image.|
|Microsoft.ClassicStorage/storageAccounts/read|Return the storage account with the given account.|
|Microsoft.ClassicStorage/storageAccounts/write|Adds a new storage account.|
|Microsoft.ClassicStorage/storageAccounts/delete|Delete the storage account.|
|Microsoft.ClassicStorage/storageAccounts/listKeys/action|Lists the access keys for the storage accounts.|
|Microsoft.ClassicStorage/storageAccounts/regenerateKey/action|Regenerates the existing access keys for the storage account.|
|Microsoft.ClassicStorage/storageAccounts/operationStatuses/read|Reads the operation status for the resource.|
|Microsoft.ClassicStorage/storageAccounts/images/read|Returns the storage account image.|
|Microsoft.ClassicStorage/storageAccounts/images/delete|Deletes a given storage account image.|
|Microsoft.ClassicStorage/storageAccounts/disks/read|Returns the storage account disk.|
|Microsoft.ClassicStorage/storageAccounts/disks/write|Adds a storage account disk.|
|Microsoft.ClassicStorage/storageAccounts/disks/delete|Deletes a given storage account  disk.|
|Microsoft.ClassicStorage/storageAccounts/disks/operationStatuses/read|Reads the operation status for the resource.|
|Microsoft.ClassicStorage/storageAccounts/osImages/read|Returns the storage account operating system image.|
|Microsoft.ClassicStorage/storageAccounts/osImages/delete|Deletes a given storage account operating system image.|
|Microsoft.ClassicStorage/storageAccounts/services/read|Get the available services.|
|Microsoft.ClassicStorage/storageAccounts/services/metricDefinitions/read|Gets the metrics definitions.|
|Microsoft.ClassicStorage/storageAccounts/services/metrics/read|Gets the metrics.|
|Microsoft.ClassicStorage/storageAccounts/services/diagnosticSettings/read|Get the diagnostics settings.|
|Microsoft.ClassicStorage/storageAccounts/services/diagnosticSettings/write|Add or modify diagnostics settings.|
|Microsoft.ClassicStorage/disks/read|Returns the storage account disk.|
|Microsoft.ClassicStorage/osImages/read|Returns the operating system image.|
|Microsoft.ClassicStorage/quotas/read|Get the quota for the subscription.|

## Microsoft.CognitiveServices

| Operation | Description |
|---|---|
|Microsoft.CognitiveServices/accounts/read|Reads API accounts.|
|Microsoft.CognitiveServices/accounts/write|Writes API Accounts.|
|Microsoft.CognitiveServices/accounts/delete|Deletes API accounts|
|Microsoft.CognitiveServices/accounts/listKeys/action|List Keys|
|Microsoft.CognitiveServices/accounts/regenerateKey/action|Regenerate Key|
|Microsoft.CognitiveServices/accounts/skus/read|Reads available SKUs for an existing resource.|
|Microsoft.CognitiveServices/accounts/usages/read|Get the quota usage for an existing resource.|
|Microsoft.CognitiveServices/Operations/read|Description of the operation.|

## Microsoft.Commerce

| Operation | Description |
|---|---|
|Microsoft.Commerce/RateCard/read|Returns offer data, resource/meter metadata and rates for the given subscription.|
|Microsoft.Commerce/UsageAggregates/read|Retrieves Microsoft Azure’s consumption  by a subscription. The result contains aggregates usage data, subscription and resource related information, on a particular time range.|

## Microsoft.Compute

| Operation | Description |
|---|---|
|Microsoft.Compute/register/action|Registers Subscription with Microsoft.Compute resource provider|
|Microsoft.Compute/restorePointCollections/read|Get the properties of a restore point collection|
|Microsoft.Compute/restorePointCollections/write|Creates a new restore point collection or updates an existing one|
|Microsoft.Compute/restorePointCollections/delete|Deletes the restore point collection and contained restore points|
|Microsoft.Compute/restorePointCollections/restorePoints/read|Get the properties of a restore point|
|Microsoft.Compute/restorePointCollections/restorePoints/write|Creates a new restore point|
|Microsoft.Compute/restorePointCollections/restorePoints/delete|Deletes the restore point|
|Microsoft.Compute/restorePointCollections/restorePoints/retrieveSasUris/action|Get the properties of a restore point along with blob SAS URIs|
|Microsoft.Compute/virtualMachineScaleSets/read|Get the properties of a virtual machine scale set|
|Microsoft.Compute/virtualMachineScaleSets/write|Creates a new virtual machine scale set or updates an existing one|
|Microsoft.Compute/virtualMachineScaleSets/delete|Deletes the virtual machine scale set|
|Microsoft.Compute/virtualMachineScaleSets/start/action|Starts the instances of the virtual machine scale set|
|Microsoft.Compute/virtualMachineScaleSets/powerOff/action|Powers off the instances of the virtual machine scale set|
|Microsoft.Compute/virtualMachineScaleSets/restart/action|Restarts the instances of the virtual machine scale set|
|Microsoft.Compute/virtualMachineScaleSets/deallocate/action|Powers off and releases the compute resources for the instances of the virtual machine scale set |
|Microsoft.Compute/virtualMachineScaleSets/manualUpgrade/action|Manually updates instances to latest model of the virtual machine scale set|
|Microsoft.Compute/virtualMachineScaleSets/scale/action|Scale In/Scale Out instance count of an existing virtual machine scale set|
|Microsoft.Compute/virtualMachineScaleSets/instanceView/read|Gets the instance view of the virtual machine scale set|
|Microsoft.Compute/virtualMachineScaleSets/skus/read|Lists the valid SKUs for an existing virtual machine scale set|
|Microsoft.Compute/virtualMachineScaleSets/virtualMachines/read|Retrieves the properties of a Virtual Machine in a VM Scale Set|
|Microsoft.Compute/virtualMachineScaleSets/virtualMachines/delete|Delete a specific Virtual Machine in a VM Scale Set.|
|Microsoft.Compute/virtualMachineScaleSets/virtualMachines/start/action|Starts a Virtual Machine instance in a VM Scale Set.|
|Microsoft.Compute/virtualMachineScaleSets/virtualMachines/powerOff/action|Powers Off a Virtual Machine instance in a VM Scale Set.|
|Microsoft.Compute/virtualMachineScaleSets/virtualMachines/restart/action|Restarts a Virtual Machine instance in a VM Scale Set.|
|Microsoft.Compute/virtualMachineScaleSets/virtualMachines/deallocate/action|Powers off and releases the compute resources for a Virtual Machine in a VM Scale Set.|
|Microsoft.Compute/virtualMachineScaleSets/virtualMachines/instanceView/read|Retrieves the instance view of a Virtual Machine in a VM Scale Set.|
|Microsoft.Compute/images/read|Get the properties of the Image|
|Microsoft.Compute/images/write|Creates a new Image or updates an existing one|
|Microsoft.Compute/images/delete|Deletes the image|
|Microsoft.Compute/operations/read|Lists operations available on Microsoft.Compute resource provider|
|Microsoft.Compute/disks/read|Get the properties of a Disk|
|Microsoft.Compute/disks/write|Creates a new Disk or updates an existing one|
|Microsoft.Compute/disks/delete|Deletes the Disk|
|Microsoft.Compute/disks/beginGetAccess/action|Get the SAS URI of the Disk for blob access|
|Microsoft.Compute/disks/endGetAccess/action|Revoke the SAS URI of the Disk|
|Microsoft.Compute/snapshots/read|Get the properties of a Snapshot|
|Microsoft.Compute/snapshots/write|Create a new Snapshot or update an existing one|
|Microsoft.Compute/snapshots/delete|Delete a Snapshot|
|Microsoft.Compute/availabilitySets/read|Get the properties of an availability set|
|Microsoft.Compute/availabilitySets/write|Creates a new availability set or updates an existing one|
|Microsoft.Compute/availabilitySets/delete|Deletes the availability set|
|Microsoft.Compute/availabilitySets/vmSizes/read|List available sizes for creating or updating a virtual machine in the availability set|
|Microsoft.Compute/virtualMachines/read|Get the properties of a virtual machine|
|Microsoft.Compute/virtualMachines/write|Creates a new virtual machine or updates an existing virtual machine|
|Microsoft.Compute/virtualMachines/delete|Deletes the virtual machine|
|Microsoft.Compute/virtualMachines/start/action|Starts the virtual machine|
|Microsoft.Compute/virtualMachines/powerOff/action|Powers off the virtual machine. Note that the virtual machine will continue to be billed.|
|Microsoft.Compute/virtualMachines/redeploy/action|Redeploys virtual machine|
|Microsoft.Compute/virtualMachines/restart/action|Restarts the virtual machine|
|Microsoft.Compute/virtualMachines/deallocate/action|Powers off the virtual machine and releases the compute resources|
|Microsoft.Compute/virtualMachines/generalize/action|Sets the virtual machine state to Generalized and prepares the virtual machine for capture|
|Microsoft.Compute/virtualMachines/capture/action|Captures the virtual machine by copying virtual hard disks and generates a template that can be used to create similar virtual machines|
|Microsoft.Compute/virtualMachines/convertToManagedDisks/action|Converts the blob based disks of the virtual machine to managed disks|
|Microsoft.Compute/virtualMachines/vmSizes/read|Lists available sizes the virtual machine can be updated to|
|Microsoft.Compute/virtualMachines/instanceView/read|Gets the detailed runtime status of the virtual machine and its resources|
|Microsoft.Compute/virtualMachines/extensions/read|Get the properties of a virtual machine extension|
|Microsoft.Compute/virtualMachines/extensions/write|Creates a new virtual machine extension or updates an existing one|
|Microsoft.Compute/virtualMachines/extensions/delete|Deletes the virtual machine extension|
|Microsoft.Compute/locations/vmSizes/read|Lists available virtual machine sizes in a location|
|Microsoft.Compute/locations/usages/read|Gets service limits and current usage quantities for the subscription's compute resources in a location|
|Microsoft.Compute/locations/operations/read|Gets the status of an asynchronous operation|

## Microsoft.ContainerRegistry

| Operation | Description |
|---|---|
|Microsoft.ContainerRegistry/register/action|Registers the subscription for the container registry resource provider and enables the creation of container registries.|
|Microsoft.ContainerRegistry/checknameavailability/read|Checks that registry name is valid and is not in use.|
|Microsoft.ContainerRegistry/registries/read|Returns the list of container registries or gets the properties for the specified container registry.|
|Microsoft.ContainerRegistry/registries/write|Creates a container registry with the specified parameters or update the properties or tags for the specified container registry.|
|Microsoft.ContainerRegistry/registries/delete|Deletes an existing container registry.|
|Microsoft.ContainerRegistry/registries/listCredentials/action|Lists the login credentials for the specified container registry.|
|Microsoft.ContainerRegistry/registries/regenerateCredential/action|Regenerates the login credentials for the specified container registry.|

## Microsoft.ContainerService

| Operation | Description |
|---|---|
|Microsoft.ContainerService/containerServices/subscriptions/read|Get the specified Container Services based on Subscription|
|Microsoft.ContainerService/containerServices/resourceGroups/read|Get the specified Container Services based on Resource Group|
|Microsoft.ContainerService/containerServices/resourceGroups/ContainerServiceName/read|Gets the specified Container Service|
|Microsoft.ContainerService/containerServices/resourceGroups/ContainerServiceName/write|Puts or Updates the specified Container Service|
|Microsoft.ContainerService/containerServices/resourceGroups/ContainerServiceName/delete|Deletes the specified Container Service|

## Microsoft.ContentModerator

| Operation | Description |
|---|---|
|Microsoft.ContentModerator/updateCommunicationPreference/action|Update communication preference|
|Microsoft.ContentModerator/listCommunicationPreference/action|List communication preference|
|Microsoft.ContentModerator/applications/read|Read Operation|
|Microsoft.ContentModerator/applications/write|Write Operation|
|Microsoft.ContentModerator/applications/write|Write Operation|
|Microsoft.ContentModerator/applications/delete|Delete Operation|
|Microsoft.ContentModerator/applications/listSecrets/action|List Secrets|
|Microsoft.ContentModerator/applications/listSingleSignOnToken/action|Read Single Sign On Tokens|
|Microsoft.ContentModerator/operations/read|read operations|

## Microsoft.CustomerInsights

| Operation | Description |
|---|---|
|Microsoft.CustomerInsights/hubs/read|Read any Azure Customer Insights Hub|
|Microsoft.CustomerInsights/hubs/write|Create or Update any Azure Customer Insights Hub|
|Microsoft.CustomerInsights/hubs/delete|Delete any Azure Customer Insights Hub|
|Microsoft.CustomerInsights/hubs/providers/Microsoft.Insights/metricDefinitions/read|Gets the available metrics for resource|
|Microsoft.CustomerInsights/hubs/providers/Microsoft.Insights/diagnosticSettings/read|Gets the diagnostic setting for the resource|
|Microsoft.CustomerInsights/hubs/providers/Microsoft.Insights/diagnosticSettings/write|Creates or updates the diagnostic setting for the resource|
|Microsoft.CustomerInsights/hubs/providers/Microsoft.Insights/logDefinitions/read|Gets the available logs for resource|
|Microsoft.CustomerInsights/hubs/authorizationPolicies/read|Read any Azure Customer Insights Shared Access Signature Policy|
|Microsoft.CustomerInsights/hubs/authorizationPolicies/write|Create or Update any Azure Customer Insights Shared Access Signature Policy|
|Microsoft.CustomerInsights/hubs/authorizationPolicies/delete|Delete any Azure Customer Insights Shared Access Signature Policy|
|Microsoft.CustomerInsights/hubs/authorizationPolicies/regeneratePrimaryKey/action|Regenerate Azure Customer Insights Shared Access Signature Policy primary key|
|Microsoft.CustomerInsights/hubs/authorizationPolicies/regenerateSecondaryKey/action|Regenerate Azure Customer Insights Shared Access Signature Policy secondary key|
|Microsoft.CustomerInsights/hubs/profiles/read|Read any Azure Customer Insights Profile|
|Microsoft.CustomerInsights/hubs/profiles/write|Write any Azure Customer Insights Profile|
|Microsoft.CustomerInsights/hubs/kpi/read|Read any Azure Customer Insights Key Performance Indicator|
|Microsoft.CustomerInsights/hubs/kpi/write|Create or Update any Azure Customer Insights Key Performance Indicator|
|Microsoft.CustomerInsights/hubs/kpi/delete|Delete any Azure Customer Insights Key Performance Indicator|
|Microsoft.CustomerInsights/hubs/views/read|Read any Azure Customer Insights App View|
|Microsoft.CustomerInsights/hubs/views/write|Create or Update any Azure Customer Insights App View|
|Microsoft.CustomerInsights/hubs/views/delete|Delete any Azure Customer Insights App View|
|Microsoft.CustomerInsights/hubs/interactions/read|Read any Azure Customer Insights Interaction|
|Microsoft.CustomerInsights/hubs/interactions/write|Create or Update any Azure Customer Insights Interaction|
|Microsoft.CustomerInsights/hubs/roleAssignments/read|Read any Azure Customer Insights Rbac Assignment|
|Microsoft.CustomerInsights/hubs/roleAssignments/write|Create or Update any Azure Customer Insights Rbac Assignment|
|Microsoft.CustomerInsights/hubs/roleAssignments/delete|Delete any Azure Customer Insights Rbac Assignment|
|Microsoft.CustomerInsights/hubs/connectors/read|Read any Azure Customer Insights Connector|
|Microsoft.CustomerInsights/hubs/connectors/write|Create or Update any Azure Customer Insights Connector|
|Microsoft.CustomerInsights/hubs/connectors/delete|Delete any Azure Customer Insights Connector|
|Microsoft.CustomerInsights/hubs/connectors/mappings/read|Read any Azure Customer Insights Connector Mapping|
|Microsoft.CustomerInsights/hubs/connectors/mappings/write|Create or Update any Azure Customer Insights Connector Mapping|
|Microsoft.CustomerInsights/hubs/connectors/mappings/delete|Delete any Azure Customer Insights Connector Mapping|

## Microsoft.DataCatalog

| Operation | Description |
|---|---|
|Microsoft.DataCatalog/checkNameAvailability/action|Checks catalog name availability for tenant.|
|Microsoft.DataCatalog/catalogs/read|Get properties for catalog or catalogs under subscription or resource group.|
|Microsoft.DataCatalog/catalogs/write|Creates catalog or updates the tags and properties for the catalog.|
|Microsoft.DataCatalog/catalogs/delete|Deletes the catalog.|

## Microsoft.DataFactory

| Operation | Description |
|---|---|
|Microsoft.DataFactory/datafactories/read|Reads Data Factory.|
|Microsoft.DataFactory/datafactories/write|Create or Update Data Factory|
|Microsoft.DataFactory/datafactories/delete|Deletes Data Factory.|
|Microsoft.DataFactory/datafactories/datapipelines/read|Reads Pipeline.|
|Microsoft.DataFactory/datafactories/datapipelines/delete|Deletes Pipeline.|
|Microsoft.DataFactory/datafactories/datapipelines/pause/action|Pauses Pipeline.|
|Microsoft.DataFactory/datafactories/datapipelines/resume/action|Resumes Pipeline.|
|Microsoft.DataFactory/datafactories/datapipelines/update/action|Updates Pipeline.|
|Microsoft.DataFactory/datafactories/datapipelines/write|Create or Update Pipeline|
|Microsoft.DataFactory/datafactories/linkedServices/read|Reads Linked service.|
|Microsoft.DataFactory/datafactories/linkedServices/delete|Deletes Linked service.|
|Microsoft.DataFactory/datafactories/linkedServices/write|Create or Update Linked service|
|Microsoft.DataFactory/datafactories/{resourceTypeName:regex(^(tables|datasets)$)}/read|Reads Table.|
|Microsoft.DataFactory/datafactories/{resourceTypeName:regex(^(tables|datasets)$)}/delete|Deletes Table.|
|Microsoft.DataFactory/datafactories/{resourceTypeName:regex(^(tables|datasets)$)}/write|Create or Update Table|

## Microsoft.DataLakeAnalytics

| Operation | Description |
|---|---|
|Microsoft.DataLakeAnalytics/accounts/read|Get information about the DataLakeAnalytics account.|
|Microsoft.DataLakeAnalytics/accounts/write|Create or update the DataLakeAnalytics account.|
|Microsoft.DataLakeAnalytics/accounts/delete|Delete the DataLakeAnalytics account.|
|Microsoft.DataLakeAnalytics/accounts/firewallRules/read|Get information about a firewall rule.|
|Microsoft.DataLakeAnalytics/accounts/firewallRules/write|Create or update a firewall rule.|
|Microsoft.DataLakeAnalytics/accounts/firewallRules/delete|Delete a firewall rule.|
|Microsoft.DataLakeAnalytics/accounts/storageAccounts/read|Get linked Storage account for the DataLakeAnalytics account.|
|Microsoft.DataLakeAnalytics/accounts/storageAccounts/write|Link a Storage account to the DataLakeAnalytics account.|
|Microsoft.DataLakeAnalytics/accounts/storageAccounts/delete|Unlink a Storage account from the DataLakeAnalytics account.|
|Microsoft.DataLakeAnalytics/accounts/storageAccounts/Containers/read|Get Containers under the Storage account|
|Microsoft.DataLakeAnalytics/accounts/storageAccounts/Containers/listSasTokens/action|List SAS Tokens for the Storage container|
|Microsoft.DataLakeAnalytics/accounts/dataLakeStoreAccounts/read|Get linked DataLakeStore account for the DataLakeAnalytics account.|
|Microsoft.DataLakeAnalytics/accounts/dataLakeStoreAccounts/write|Link a DataLakeStore account to the DataLakeAnalytics account.|
|Microsoft.DataLakeAnalytics/accounts/dataLakeStoreAccounts/delete|Unlink a DataLakeStore account from the DataLakeAnalytics account.|

## Microsoft.DataLakeStore

| Operation | Description |
|---|---|
|Microsoft.DataLakeStore/accounts/read|Get information about an existed DataLakeStore account.|
|Microsoft.DataLakeStore/accounts/write|Create a new DataLakeStore account, or Update an existed DataLakeStore account.|
|Microsoft.DataLakeStore/accounts/delete|Delete an existed DataLakeStore account.|
|Microsoft.DataLakeStore/accounts/firewallRules/read|Get information about a firewall rule.|
|Microsoft.DataLakeStore/accounts/firewallRules/write|Create or update a firewall rule.|
|Microsoft.DataLakeStore/accounts/firewallRules/delete|Delete a firewall rule.|
|Microsoft.DataLakeStore/accounts/trustedIdProviders/read|Get information about a trusted identity provider.|
|Microsoft.DataLakeStore/accounts/trustedIdProviders/write|Create or update a trusted identity provider.|
|Microsoft.DataLakeStore/accounts/trustedIdProviders/delete|Delete a trusted identity provider.|

## Microsoft.Devices

| Operation | Description |
|---|---|
|Microsoft.Devices/register/action|Register the subscription for the IotHub resource provider and enables the creation of IotHub resources|
|Microsoft.Devices/checkNameAvailability/Action|Check If IotHub name is available|
|Microsoft.Devices/usages/Read|Get subscription usage details for this provider.|
|Microsoft.Devices/operations/Read|Get All ResourceProvider Operations|
|Microsoft.Devices/iotHubs/Read|Gets the IotHub resource(s)|
|Microsoft.Devices/iotHubs/Write|Create or update IotHub Resource|
|Microsoft.Devices/iotHubs/Delete|Delete IotHub Resource|
|Microsoft.Devices/iotHubs/listkeys/Action|Get all IotHub Keys|
|Microsoft.Devices/iotHubs/exportDevices/Action|Export Devices|
|Microsoft.Devices/iotHubs/importDevices/Action|Import Devices|
|Microsoft.Devices/IotHubs/metricDefinitions/read|Gets the available metrics for the IotHub service|
|Microsoft.Devices/iotHubs/iotHubKeys/listkeys/Action|Get IotHub Key for the given name|
|Microsoft.Devices/iotHubs/iotHubStats/Read|Get IotHub Statistics|
|Microsoft.Devices/iotHubs/quotaMetrics/Read|Get Quota Metrics|
|Microsoft.Devices/iotHubs/eventHubEndpoints/consumerGroups/Write|Create EventHub Consumer Group|
|Microsoft.Devices/iotHubs/eventHubEndpoints/consumerGroups/Read|Get EventHub Consumer Group(s)|
|Microsoft.Devices/iotHubs/eventHubEndpoints/consumerGroups/Delete|Delete EventHub Consumer Group|
|Microsoft.Devices/iotHubs/routing/routes/$testall/Action|Test a message against all existing Routes|
|Microsoft.Devices/iotHubs/routing/routes/$testnew/Action|Test a message against a provided test Route|
|Microsoft.Devices/IotHubs/diagnosticSettings/read|Gets the diagnostic setting for the resource|
|Microsoft.Devices/IotHubs/diagnosticSettings/write|Creates or updates the diagnostic setting for the resource|
|Microsoft.Devices/iotHubs/skus/Read|Get valid IotHub Skus|
|Microsoft.Devices/iotHubs/jobs/Read|Get Job(s) details submitted on given IotHub|
|Microsoft.Devices/iotHubs/routingEndpointsHealth/Read|Gets the health of all routing Endpoints for an IotHub|

## Microsoft.DevTestLab

| Operation | Description |
|---|---|
|Microsoft.DevTestLab/Subscription/register/action|Registers the subscription|
|Microsoft.DevTestLab/labs/delete|Delete labs.|
|Microsoft.DevTestLab/labs/read|Read labs.|
|Microsoft.DevTestLab/labs/write|Add or modify labs.|
|Microsoft.DevTestLab/labs/ListVhds/action|List disk images available for custom image creation.|
|Microsoft.DevTestLab/labs/GenerateUploadUri/action|Generate a URI for uploading custom disk images to a Lab.|
|Microsoft.DevTestLab/labs/CreateEnvironment/action|Create virtual machines in a lab.|
|Microsoft.DevTestLab/labs/ClaimAnyVm/action|Claim a random claimable virtual machine in the lab.|
|Microsoft.DevTestLab/labs/ExportResourceUsage/action|Exports the lab resource usage into a storage account|
|Microsoft.DevTestLab/labs/users/delete|Delete user profiles.|
|Microsoft.DevTestLab/labs/users/read|Read user profiles.|
|Microsoft.DevTestLab/labs/users/write|Add or modify user profiles.|
|Microsoft.DevTestLab/labs/users/secrets/delete|Delete secrets.|
|Microsoft.DevTestLab/labs/users/secrets/read|Read secrets.|
|Microsoft.DevTestLab/labs/users/secrets/write|Add or modify secrets.|
|Microsoft.DevTestLab/labs/users/environments/delete|Delete environments.|
|Microsoft.DevTestLab/labs/users/environments/read|Read environments.|
|Microsoft.DevTestLab/labs/users/environments/write|Add or modify environments.|
|Microsoft.DevTestLab/labs/users/disks/delete|Delete disks.|
|Microsoft.DevTestLab/labs/users/disks/read|Read disks.|
|Microsoft.DevTestLab/labs/users/disks/write|Add or modify disks.|
|Microsoft.DevTestLab/labs/users/disks/Attach/action|Attach and create the lease of the disk to the virtual machine.|
|Microsoft.DevTestLab/labs/users/disks/Detach/action|Detach and break the lease of the disk attached to the virtual machine.|
|Microsoft.DevTestLab/labs/customImages/delete|Delete custom images.|
|Microsoft.DevTestLab/labs/customImages/read|Read custom images.|
|Microsoft.DevTestLab/labs/customImages/write|Add or modify custom images.|
|Microsoft.DevTestLab/labs/serviceRunners/delete|Delete service runners.|
|Microsoft.DevTestLab/labs/serviceRunners/read|Read service runners.|
|Microsoft.DevTestLab/labs/serviceRunners/write|Add or modify service runners.|
|Microsoft.DevTestLab/labs/artifactSources/delete|Delete artifact sources.|
|Microsoft.DevTestLab/labs/artifactSources/read|Read artifact sources.|
|Microsoft.DevTestLab/labs/artifactSources/write|Add or modify artifact sources.|
|Microsoft.DevTestLab/labs/artifactSources/artifacts/read|Read artifacts.|
|Microsoft.DevTestLab/labs/artifactSources/artifacts/GenerateArmTemplate/action|Generates an ARM template for the given artifact, uploads the required files to a storage account, and validates the generated artifact.|
|Microsoft.DevTestLab/labs/artifactSources/armTemplates/read|Read azure resource manager templates.|
|Microsoft.DevTestLab/labs/costs/read|Read costs.|
|Microsoft.DevTestLab/labs/costs/write|Add or modify costs.|
|Microsoft.DevTestLab/labs/virtualNetworks/delete|Delete virtual networks.|
|Microsoft.DevTestLab/labs/virtualNetworks/read|Read virtual networks.|
|Microsoft.DevTestLab/labs/virtualNetworks/write|Add or modify virtual networks.|
|Microsoft.DevTestLab/labs/formulas/delete|Delete formulas.|
|Microsoft.DevTestLab/labs/formulas/read|Read formulas.|
|Microsoft.DevTestLab/labs/formulas/write|Add or modify formulas.|
|Microsoft.DevTestLab/labs/schedules/delete|Delete schedules.|
|Microsoft.DevTestLab/labs/schedules/read|Read schedules.|
|Microsoft.DevTestLab/labs/schedules/write|Add or modify schedules.|
|Microsoft.DevTestLab/labs/schedules/Execute/action|Execute a schedule.|
|Microsoft.DevTestLab/labs/schedules/ListApplicable/action|Lists all applicable schedules|
|Microsoft.DevTestLab/labs/galleryImages/read|Read gallery images.|
|Microsoft.DevTestLab/labs/policySets/EvaluatePolicies/action|Evaluates lab policy.|
|Microsoft.DevTestLab/labs/policySets/policies/delete|Delete policies.|
|Microsoft.DevTestLab/labs/policySets/policies/read|Read policies.|
|Microsoft.DevTestLab/labs/policySets/policies/write|Add or modify policies.|
|Microsoft.DevTestLab/labs/virtualMachines/delete|Delete virtual machines.|
|Microsoft.DevTestLab/labs/virtualMachines/read|Read virtual machines.|
|Microsoft.DevTestLab/labs/virtualMachines/write|Add or modify virtual machines.|
|Microsoft.DevTestLab/labs/virtualMachines/Start/action|Start a virtual machine.|
|Microsoft.DevTestLab/labs/virtualMachines/Stop/action|Stop a virtual machine|
|Microsoft.DevTestLab/labs/virtualMachines/ApplyArtifacts/action|Apply artifacts to virtual machine.|
|Microsoft.DevTestLab/labs/virtualMachines/AddDataDisk/action|Attach a new or existing data disk to virtual machine.|
|Microsoft.DevTestLab/labs/virtualMachines/DetachDataDisk/action|Detach the specified disk from the virtual machine.|
|Microsoft.DevTestLab/labs/virtualMachines/Claim/action|Take ownership of an existing virtual machine|
|Microsoft.DevTestLab/labs/virtualMachines/ListApplicableSchedules/action|Lists all applicable schedules|
|Microsoft.DevTestLab/labs/virtualMachines/schedules/delete|Delete schedules.|
|Microsoft.DevTestLab/labs/virtualMachines/schedules/read|Read schedules.|
|Microsoft.DevTestLab/labs/virtualMachines/schedules/write|Add or modify schedules.|
|Microsoft.DevTestLab/labs/virtualMachines/schedules/Execute/action|Execute a schedule.|
|Microsoft.DevTestLab/labs/notificationChannels/delete|Delete notificationchannels.|
|Microsoft.DevTestLab/labs/notificationChannels/read|Read notificationchannels.|
|Microsoft.DevTestLab/labs/notificationChannels/write|Add or modify notificationchannels.|
|Microsoft.DevTestLab/labs/notificationChannels/Notify/action|Send notification to provided channel.|
|Microsoft.DevTestLab/schedules/delete|Delete schedules.|
|Microsoft.DevTestLab/schedules/read|Read schedules.|
|Microsoft.DevTestLab/schedules/write|Add or modify schedules.|
|Microsoft.DevTestLab/schedules/Execute/action|Execute a schedule.|
|Microsoft.DevTestLab/schedules/Retarget/action|Updates a schedule's target resource Id.|
|Microsoft.DevTestLab/locations/operations/read|Read operations.|

## Microsoft.DocumentDB

| Operation | Description |
|---|---|
|Microsoft.DocumentDB/databaseAccountNames/read|Checks for name availability.|
|Microsoft.DocumentDB/databaseAccounts/read|Reads a database account.|
|Microsoft.DocumentDB/databaseAccounts/write|Update a database accounts.|
|Microsoft.DocumentDB/databaseAccounts/listKeys/action|List keys of a database account|
|Microsoft.DocumentDB/databaseAccounts/regenerateKey/action|Rotate keys of a database account|
|Microsoft.DocumentDB/databaseAccounts/listConnectionStrings/action|Get the connection strings for a database account|
|Microsoft.DocumentDB/databaseAccounts/changeResourceGroup/action|Change resource group of a database account|
|Microsoft.DocumentDB/databaseAccounts/failoverPriorityChange/action|Change failover priorities of regions of a database account. This is used to perform manual failover operation|
|Microsoft.DocumentDB/databaseAccounts/delete|Deletes the database accounts.|
|Microsoft.DocumentDB/databaseAccounts/metricDefinitions/read|Reads the database account metrics definitions.|
|Microsoft.DocumentDB/databaseAccounts/metrics/read|Reads the database account metrics.|
|Microsoft.DocumentDB/databaseAccounts/usages/read|Reads the database account usages.|
|Microsoft.DocumentDB/databaseAccounts/databases/collections/metricDefinitions/read|Reads the collection metric definitions.|
|Microsoft.DocumentDB/databaseAccounts/databases/collections/metrics/read|Reads the collection metrics.|
|Microsoft.DocumentDB/databaseAccounts/databases/collections/usages/read|Reads the collection usages.|
|Microsoft.DocumentDB/databaseAccounts/databases/metricDefinitions/read|Reads the database metric definitions|
|Microsoft.DocumentDB/databaseAccounts/databases/metrics/read|Reads the database metrics.|
|Microsoft.DocumentDB/databaseAccounts/databases/usages/read|Reads the database usages.|
|Microsoft.DocumentDB/databaseAccounts/readonlykeys/read|Reads the database account readonly keys.|

## Microsoft.DomainRegistration

| Operation | Description |
|---|---|
|Microsoft.DomainRegistration/generateSsoRequest/Action|Generate a request for signing into domain control center.|
|Microsoft.DomainRegistration/validateDomainRegistrationInformation/Action|Validate domain purchase object without submitting it|
|Microsoft.DomainRegistration/checkDomainAvailability/Action|Check if a domain is available for purchase|
|Microsoft.DomainRegistration/listDomainRecommendations/Action|Retrieve the list domain recommendations based on keywords|
|Microsoft.DomainRegistration/register/action|Register the Microsoft Domains resource provider for the subscription|
|Microsoft.DomainRegistration/domains/Read|Get the list of domains|
|Microsoft.DomainRegistration/domains/Write|Add a new Domain or update an existing one|
|Microsoft.DomainRegistration/domains/Delete|Delete an existing domain.|
|Microsoft.DomainRegistration/domains/operationresults/Read|Get a domain operation|

## Microsoft.DynamicsLcs

| Operation | Description |
|---|---|
|Microsoft.DynamicsLcs/lcsprojects/read|Display Microsoft Dynamics Lifecycle Services projects that belong to a user|
|Microsoft.DynamicsLcs/lcsprojects/write|Create and update Microsoft Dynamics Lifecycle Services projects that belong to the user. Only the name and description properties can be updated. The subscription and location associated with the project cannot be updated after creation|
|Microsoft.DynamicsLcs/lcsprojects/delete|Delete Microsoft Dynamics Lifecycle Services projects that belong to the user|
|Microsoft.DynamicsLcs/lcsprojects/clouddeployments/read|Display Microsoft Dynamics AX 2012 R3 Evaluation deployments in a Microsoft Dynamics Lifecycle Services project that belong to a user|
|Microsoft.DynamicsLcs/lcsprojects/clouddeployments/write|Create Microsoft Dynamics AX 2012 R3 Evaluation deployment in a Microsoft Dynamics Lifecycle Services project that belong to a user. Deployments can be managed from Azure management portal|
|Microsoft.DynamicsLcs/lcsprojects/connectors/read|Read connectors that belong to a Microsoft Dynamics Lifecycle Services project|
|Microsoft.DynamicsLcs/lcsprojects/connectors/write|Create and update connectors that belong to a Microsoft Dynamics Lifecycle Services project|

## Microsoft.EventHub

| Operation | Description |
|---|---|
|Microsoft.EventHub/checkNameAvailability/action|Checks availability of namespace under given subscription.|
|Microsoft.EventHub/register/action|Registers the subscription for the EventHub resource provider and enables the creation of EventHub resources|
|Microsoft.EventHub/namespaces/write|Create a Namespace Resource and Update its properties. Tags and status of the Namespace are the properties which can be updated.|
|Microsoft.EventHub/namespaces/read|Get the list of Namespace Resource Description|
|Microsoft.EventHub/namespaces/Delete|Delete Namespace Resource|
|Microsoft.EventHub/namespaces/metricDefinitions/read|Get list of Namespace metrics Resource Descriptions|
|Microsoft.EventHub/namespaces/authorizationRules/read|Get the list of Namespaces Authorization Rules description.|
|Microsoft.EventHub/namespaces/authorizationRules/write|Create a Namespace level Authorization Rules and update its properties. The Authorization Rules Access Rights, the Primary and Secondary Keys can be updated.|
|Microsoft.EventHub/namespaces/authorizationRules/delete|Delete Namespace Authorization Rule. The Default Namespace Authorization Rule cannot be deleted. |
|Microsoft.EventHub/namespaces/authorizationRules/listkeys/action|Get the Connection String to the Namespace|
|Microsoft.EventHub/namespaces/authorizationRules/regenerateKeys/action|Regenerate the Primary or Secondary key to the Resource|
|Microsoft.EventHub/namespaces/eventhubs/write|Create or Update EventHub properties.|
|Microsoft.EventHub/namespaces/eventhubs/read|Get list of EventHub Resource Descriptions|
|Microsoft.EventHub/namespaces/eventhubs/Delete|Operation to delete EventHub Resource|
|Microsoft.EventHub/namespaces/eventHubs/consumergroups/write|Create or Update ConsumerGroup properties.|
|Microsoft.EventHub/namespaces/eventHubs/consumergroups/read|Get list of ConsumerGroup Resource Descriptions|
|Microsoft.EventHub/namespaces/eventHubs/consumergroups/Delete|Operation to delete ConsumerGroup Resource|
|Microsoft.EventHub/namespaces/eventhubs/authorizationRules/read| Get the list of EventHub Authorization Rules|
|Microsoft.EventHub/namespaces/eventhubs/authorizationRules/write|Create EventHub Authorization Rules and Update its properties. The Authorization Rules Access Rights, the Primary and Secondary Keys can be updated.|
|Microsoft.EventHub/namespaces/eventhubs/authorizationRules/delete|Operation to delete EventHub Authorization Rules|
|Microsoft.EventHub/namespaces/eventhubs/authorizationRules/listkeys/action|Get the Connection String to EventHub|
|Microsoft.EventHub/namespaces/eventhubs/authorizationRules/regenerateKeys/action|Regenerate the Primary or Secondary key to the Resource|
|Microsoft.EventHub/namespaces/diagnosticSettings/read|Get list of Namespace diagnostic settings Resource Descriptions|
|Microsoft.EventHub/namespaces/diagnosticSettings/write|Get list of Namespace diagnostic settings Resource Descriptions|
|Microsoft.EventHub/namespaces/logDefinitions/read|Get list of Namespace logs Resource Descriptions|

## Microsoft.Features

| Operation | Description |
|---|---|
|Microsoft.Features/providers/features/read|Gets the feature of a subscription in a given resource provider.|
|Microsoft.Features/providers/features/register/action|Registers the feature for a subscription in a given resource provider.|
|Microsoft.Features/features/read|Gets the features of a subscription.|

## Microsoft.HDInsight

| Operation | Description |
|---|---|
|Microsoft.HDInsight/clusters/write|Create or Update HDInsight Cluster|
|Microsoft.HDInsight/clusters/read|Get details about HDInsight Cluster|
|Microsoft.HDInsight/clusters/delete|Delete a HDInsight Cluster|
|Microsoft.HDInsight/clusters/changerdpsetting/action|Change RDP setting for HDInsight Cluster|
|Microsoft.HDInsight/clusters/configurations/action|Update HDInsight Cluster Configuration|
|Microsoft.HDInsight/clusters/configurations/read|Get HDInsight Cluster Configurations|
|Microsoft.HDInsight/clusters/roles/resize/action|Resize a HDInsight Cluster|
|Microsoft.HDInsight/locations/capabilities/read|Get Subscription Capabilities|
|Microsoft.HDInsight/locations/checkNameAvailability/read|Check Name Availability|

## Microsoft.ImportExport

| Operation | Description |
|---|---|
|Microsoft.ImportExport/register/action|Registers the subscription for the import/export resource provider and enables the creation of import/export jobs.|
|Microsoft.ImportExport/jobs/write|Creates a job with the specified parameters or update the properties or tags for the specified job.|
|Microsoft.ImportExport/jobs/read|Gets the properties for the specified job or returns the list of jobs.|
|Microsoft.ImportExport/jobs/listBitLockerKeys/action|Gets the BitLocker keys for the specified job.|
|Microsoft.ImportExport/jobs/delete|Deletes an existing job.|
|Microsoft.ImportExport/locations/read|Gets the properties for the specified location or returns the list of locations.|

## Microsoft.Insights

| Operation | Description |
|---|---|
|Microsoft.Insights/Register/Action|Register the microsoft insights provider|
|Microsoft.Insights/AlertRules/Write|Writing to an alert rule configuration|
|Microsoft.Insights/AlertRules/Delete|Deleting an alert rule configuration|
|Microsoft.Insights/AlertRules/Read|Reading an alert rule configuration|
|Microsoft.Insights/AlertRules/Activated/Action|Alert Rule activated|
|Microsoft.Insights/AlertRules/Resolved/Action|Alert Rule resolved|
|Microsoft.Insights/AlertRules/Throttled/Action|Alert rule is throttled|
|Microsoft.Insights/AlertRules/Incidents/Read|Reading an alert rule incident configuration|
|Microsoft.Insights/MetricDefinitions/Read|Read metric definitions|
|Microsoft.Insights/eventtypes/values/Read|Read management event type values|
|Microsoft.Insights/eventtypes/digestevents/Read|Read management event type digest|
|Microsoft.Insights/Metrics/Read|Read metrics|
|Microsoft.Insights/LogProfiles/Write|Writing to a log profile configuration|
|Microsoft.Insights/LogProfiles/Delete|Delete log profiles configuration|
|Microsoft.Insights/LogProfiles/Read|Read log profiles|
|Microsoft.Insights/AutoscaleSettings/Write|Writing to an autoscale setting configuration|
|Microsoft.Insights/AutoscaleSettings/Delete|Deleting an autoscale setting configuration|
|Microsoft.Insights/AutoscaleSettings/Read|Reading an autoscale setting configuration|
|Microsoft.Insights/AutoscaleSettings/Scaleup/Action|Autoscale scale up operation|
|Microsoft.Insights/AutoscaleSettings/Scaledown/Action|Autoscale scale down operation|
|Microsoft.Insights/AutoscaleSettings/providers/Microsoft.Insights/MetricDefinitions/Read|Read metric definitions|
|Microsoft.Insights/ActivityLogAlerts/Activated/Action|Triggered the Activity Log Alert|
|Microsoft.Insights/DiagnosticSettings/Write|Writing to diagnostic settings configuration|
|Microsoft.Insights/DiagnosticSettings/Delete|Deleting diagnostic settings configuration|
|Microsoft.Insights/DiagnosticSettings/Read|Reading a diagnostic settings configuration|
|Microsoft.Insights/LogDefinitions/Read|Read log definitions|
|Microsoft.Insights/ExtendedDiagnosticSettings/Write|Writing to extended diagnostic settings configuration|
|Microsoft.Insights/ExtendedDiagnosticSettings/Delete|Deleting extended diagnostic settings configuration|
|Microsoft.Insights/ExtendedDiagnosticSettings/Read|Reading a extended diagnostic settings configuration|

## Microsoft.KeyVault

| Operation | Description |
|---|---|
|Microsoft.KeyVault/register/action|Registers a subscription|
|Microsoft.KeyVault/checkNameAvailability/read|Checks that a key vault name is valid and is not in use|
|Microsoft.KeyVault/vaults/read|View the properties of a key vault|
|Microsoft.KeyVault/vaults/write|Create a new key vault or update the properties of an existing key vault|
|Microsoft.KeyVault/vaults/delete|Delete a key vault|
|Microsoft.KeyVault/vaults/deploy/action|Enables access to secrets in a key vault when deploying Azure resources|
|Microsoft.KeyVault/vaults/secrets/read|View the properties of a secret, but not its value|
|Microsoft.KeyVault/vaults/secrets/write|Create a new secret or update the value of an existing secret|
|Microsoft.KeyVault/vaults/accessPolicies/write|Update an existing access policy by merging or replacing, or add a new access policy to a vault.|
|Microsoft.KeyVault/deletedVaults/read|View the properties of soft deleted key vaults|
|Microsoft.KeyVault/locations/operationResults/read|Check the result of a long run operation|
|Microsoft.KeyVault/locations/deletedVaults/read|View the properties of a soft deleted key vault|
|Microsoft.KeyVault/locations/deletedVaults/purge/action|Purge a soft deleted key vault|

## Microsoft.Logic

| Operation | Description |
|---|---|
|Microsoft.Logic/workflows/read|Reads the workflow.|
|Microsoft.Logic/workflows/write|Creates or updates the workflow.|
|Microsoft.Logic/workflows/delete|Deletes the workflow.|
|Microsoft.Logic/workflows/run/action|Starts a run of the workflow.|
|Microsoft.Logic/workflows/disable/action|Disables the workflow.|
|Microsoft.Logic/workflows/enable/action|Enables the workflow.|
|Microsoft.Logic/workflows/validate/action|Validates the workflow.|
|Microsoft.Logic/workflows/move/action|Moves Workflow from its existing subscription id, resource group, and/or name to a different subscription id, resource group, and/or name.|
|Microsoft.Logic/workflows/listSwagger/action|Gets the workflow swagger definitions.|
|Microsoft.Logic/workflows/regenerateAccessKey/action|Regenerates the access key secrets.|
|Microsoft.Logic/workflows/listCallbackUrl/action|Gets the callback URL for workflow.|
|Microsoft.Logic/workflows/versions/read|Reads the workflow version.|
|Microsoft.Logic/workflows/versions/triggers/listCallbackUrl/action|Gets the callback URL for trigger.|
|Microsoft.Logic/workflows/runs/read|Reads the workflow run.|
|Microsoft.Logic/workflows/runs/cancel/action|Cancels the run of a workflow.|
|Microsoft.Logic/workflows/runs/actions/read|Reads the workflow run action.|
|Microsoft.Logic/workflows/runs/operations/read|Reads the workflow run operation status.|
|Microsoft.Logic/workflows/triggers/read|Reads the trigger.|
|Microsoft.Logic/workflows/triggers/run/action|Executes the trigger.|
|Microsoft.Logic/workflows/triggers/listCallbackUrl/action|Gets the callback URL for trigger.|
|Microsoft.Logic/workflows/triggers/histories/read|Reads the trigger histories.|
|Microsoft.Logic/workflows/triggers/histories/resubmit/action|Resubmits the workflow trigger.|
|Microsoft.Logic/workflows/accessKeys/read|Reads the access key.|
|Microsoft.Logic/workflows/accessKeys/write|Creates or updates the access key.|
|Microsoft.Logic/workflows/accessKeys/delete|Deletes the access key.|
|Microsoft.Logic/workflows/accessKeys/list/action|Lists the access key secrets.|
|Microsoft.Logic/workflows/accessKeys/regenerate/action|Regenerates the access key secrets.|
|Microsoft.Logic/locations/workflows/validate/action|Validates the workflow.|

## Microsoft.MachineLearning

| Operation | Description |
|---|---|
|Microsoft.MachineLearning/register/action|Registers the subscription for the machine learning web service resource provider and enables the creation of web services.|
|Microsoft.MachineLearning/webServices/action|Create regional Web Service Properties for supported regions|
|Microsoft.MachineLearning/commitmentPlans/read|Read any Machine Learning Commitment Plan|
|Microsoft.MachineLearning/commitmentPlans/write|Create or Update any Machine Learning Commitment Plan|
|Microsoft.MachineLearning/commitmentPlans/delete|Delete any Machine Learning Commitment Plan|
|Microsoft.MachineLearning/commitmentPlans/join/action|Join any Machine Learning Commitment Plan|
|Microsoft.MachineLearning/commitmentPlans/commitmentAssociations/read|Read any Machine Learning Commitment Plan Association|
|Microsoft.MachineLearning/commitmentPlans/commitmentAssociations/move/action|Move any Machine Learning Commitment Plan Association|
|Microsoft.MachineLearning/Workspaces/read|Read any Machine Learning Workspace|
|Microsoft.MachineLearning/Workspaces/write|Create or Update any Machine Learning Workspace|
|Microsoft.MachineLearning/Workspaces/delete|Delete any Machine Learning Workspace|
|Microsoft.MachineLearning/Workspaces/listworkspacekeys/action|List keys for a Machine Learning Workspace|
|Microsoft.MachineLearning/Workspaces/resyncstoragekeys/action|Resync keys of storage account configured for a Machine Learning Workspace|
|Microsoft.MachineLearning/webServices/read|Read any Machine Learning Web Service|
|Microsoft.MachineLearning/webServices/write|Create or Update any Machine Learning Web Service|
|Microsoft.MachineLearning/webServices/delete|Delete any Machine Learning Web Service|

## Microsoft.MarketplaceOrdering

| Operation | Description |
|---|---|
|Microsoft.MarketplaceOrdering/agreements/offers/plans/read|Return an agreement for a given marketplace item|
|Microsoft.MarketplaceOrdering/agreements/offers/plans/sign/action|Sign an agreement for a given marketplace item|
|Microsoft.MarketplaceOrdering/agreements/offers/plans/cancel/action|Cancel an agreement for a given marketplace item|

## Microsoft.Media

| Operation | Description |
|---|---|
|Microsoft.Media/mediaservices/read||
|Microsoft.Media/mediaservices/write||
|Microsoft.Media/mediaservices/delete||
|Microsoft.Media/mediaservices/regenerateKey/action||
|Microsoft.Media/mediaservices/listKeys/action||
|Microsoft.Media/mediaservices/syncStorageKeys/action||

## Microsoft.Network

| Operation | Description |
|---|---|
|Microsoft.Network/register/action|Registers the subscription|
|Microsoft.Network/unregister/action|Unregisters the subscription|
|Microsoft.Network/checkTrafficManagerNameAvailability/action|Checks the availability of a Traffic Manager Relative DNS name.|
|Microsoft.Network/dnszones/read|Get the DNS zone, in JSON format. The zone properties include tags, etag, numberOfRecordSets, and maxNumberOfRecordSets. Note that this command does not retrieve the record sets contained within the zone.|
|Microsoft.Network/dnszones/write|Create or update a DNS zone within a resource group.  Used to update the tags on a DNS zone resource. Note that this command can not be used to create or update record sets within the zone.|
|Microsoft.Network/dnszones/delete|Delete the DNS zone, in JSON format. The zone properties include tags, etag, numberOfRecordSets, and maxNumberOfRecordSets.|
|Microsoft.Network/dnszones/MX/read|Get the record set of type ‘MX’, in JSON format. The record set contains a list of records as well as the TTL, tags, and etag.|
|Microsoft.Network/dnszones/MX/write|Create or update a record set of type ‘MX’ within a DNS zone. The records specified will replace the current records in the record set.|
|Microsoft.Network/dnszones/MX/delete|Remove the record set of a given name and type ‘MX’ from a DNS zone.|
|Microsoft.Network/dnszones/NS/read|Gets DNS record set of type NS|
|Microsoft.Network/dnszones/NS/write|Creates or updates DNS record set of type NS|
|Microsoft.Network/dnszones/NS/delete|Deletes the DNS record set of type NS|
|Microsoft.Network/dnszones/AAAA/read|Get the record set of type ‘AAAA’, in JSON format. The record set contains a list of records as well as the TTL, tags, and etag.|
|Microsoft.Network/dnszones/AAAA/write|Create or update a record set of type ‘AAAA’ within a DNS zone. The records specified will replace the current records in the record set.|
|Microsoft.Network/dnszones/AAAA/delete|Remove the record set of a given name and type ‘AAAA’ from a DNS zone.|
|Microsoft.Network/dnszones/CNAME/read|Get the record set of type ‘CNAME’, in JSON format. The record set contains the TTL, tags, and etag.|
|Microsoft.Network/dnszones/CNAME/write|Create or update a record set of type ‘CNAME’ within a DNS zone. The records specified will replace the current records in the record set.|
|Microsoft.Network/dnszones/CNAME/delete|Remove the record set of a given name and type ‘CNAME’ from a DNS zone.|
|Microsoft.Network/dnszones/SOA/read|Gets DNS record set of type SOA|
|Microsoft.Network/dnszones/SOA/write|Creates or updates DNS record set of type SOA|
|Microsoft.Network/dnszones/SRV/read|Get the record set of type ‘SRV’, in JSON format. The record set contains a list of records as well as the TTL, tags, and etag.|
|Microsoft.Network/dnszones/SRV/write|Create or update record set of type SRV|
|Microsoft.Network/dnszones/SRV/delete|Remove the record set of a given name and type ‘SRV’ from a DNS zone.|
|Microsoft.Network/dnszones/PTR/read|Get the record set of type ‘PTR’, in JSON format. The record set contains a list of records as well as the TTL, tags, and etag.|
|Microsoft.Network/dnszones/PTR/write|Create or update a record set of type ‘PTR’ within a DNS zone. The records specified will replace the current records in the record set.|
|Microsoft.Network/dnszones/PTR/delete|Remove the record set of a given name and type ‘PTR’ from a DNS zone.|
|Microsoft.Network/dnszones/A/read|Get the record set of type ‘A’, in JSON format. The record set contains a list of records as well as the TTL, tags, and etag.|
|Microsoft.Network/dnszones/A/write|Create or update a record set of type ‘A’ within a DNS zone. The records specified will replace the current records in the record set.|
|Microsoft.Network/dnszones/A/delete|Remove the record set of a given name and type ‘A’ from a DNS zone.|
|Microsoft.Network/dnszones/TXT/read|Get the record set of type ‘TXT’, in JSON format. The record set contains a list of records as well as the TTL, tags, and etag.|
|Microsoft.Network/dnszones/TXT/write|Create or update a record set of type ‘TXT’ within a DNS zone. The records specified will replace the current records in the record set.|
|Microsoft.Network/dnszones/TXT/delete|Remove the record set of a given name and type ‘TXT’ from a DNS zone.|
|Microsoft.Network/dnszones/recordsets/read|Gets DNS record sets across types|
|Microsoft.Network/networkInterfaces/read|Gets a network interface definition. |
|Microsoft.Network/networkInterfaces/write|Creates a network interface or updates an existing network interface. |
|Microsoft.Network/networkInterfaces/join/action|Joins a Virtual Machine to a network interface|
|Microsoft.Network/networkInterfaces/delete|Deletes a network interface|
|Microsoft.Network/networkInterfaces/effectiveRouteTable/action|Get Route Table configured On Network Interface Of The Vm|
|Microsoft.Network/networkInterfaces/effectiveNetworkSecurityGroups/action|Get Network Security Groups configured On Network Interface Of The Vm|
|Microsoft.Network/networkInterfaces/loadBalancers/read|Gets all the load balancers that the network interface is part of|
|Microsoft.Network/networkInterfaces/ipconfigurations/read|Gets a network interface ip configuration definition. |
|Microsoft.Network/publicIPAddresses/read|Gets a public ip address definition.|
|Microsoft.Network/publicIPAddresses/write|Creates a public Ip address or updates an existing public Ip address. |
|Microsoft.Network/publicIPAddresses/delete|Deletes a public Ip address.|
|Microsoft.Network/publicIPAddresses/join/action|Joins a public ip address|
|Microsoft.Network/routeFilters/read|Gets a route filter definition|
|Microsoft.Network/routeFilters/join/action|Joins a route filter|
|Microsoft.Network/routeFilters/delete|Deletes a route filter definition|
|Microsoft.Network/routeFilters/write|Creates a route filter or Updates an existing rotue filter|
|Microsoft.Network/routeFilters/rules/read|Gets a route filter rule definition|
|Microsoft.Network/routeFilters/rules/write|Creates a route filter rule or Updates an existing route filter rule|
|Microsoft.Network/routeFilters/rules/delete|Deletes a route filter rule definition|
|Microsoft.Network/networkWatchers/read|Get the network watcher definition|
|Microsoft.Network/networkWatchers/write|Creates a network watcher or updates an existing network watcher|
|Microsoft.Network/networkWatchers/delete|Deletes a network watcher|
|Microsoft.Network/networkWatchers/configureFlowLog/action|Configures flow logging for a target resource.|
|Microsoft.Network/networkWatchers/ipFlowVerify/action|Returns whether the packet is allowed or denied to or from a particular destination.|
|Microsoft.Network/networkWatchers/nextHop/action|For a specified target and destination IP address, return the next hop type and next hope IP address.|
|Microsoft.Network/networkWatchers/queryFlowLogStatus/action|Gets the status of flow logging on a resource.|
|Microsoft.Network/networkWatchers/queryTroubleshootResult/action|Gets the troubleshooting result from the previously run or currently running troubleshooting operation.|
|Microsoft.Network/networkWatchers/securityGroupView/action|View the configured and effective network security group rules applied on a VM.|
|Microsoft.Network/networkWatchers/topology/action|Gets a network level view of resources and their relationships in a resource group.|
|Microsoft.Network/networkWatchers/troubleshoot/action|Starts troubleshooting on a Networking resource in Azure.|
|Microsoft.Network/networkWatchers/packetCaptures/queryStatus/action|Gets information about properties and status of a packet capture resource.|
|Microsoft.Network/networkWatchers/packetCaptures/stop/action|Stop the running packet capture session.|
|Microsoft.Network/networkWatchers/packetCaptures/read|Get the packet capture definition|
|Microsoft.Network/networkWatchers/packetCaptures/write|Creates a packet capture|
|Microsoft.Network/networkWatchers/packetCaptures/delete|Deletes a packet capture|
|Microsoft.Network/loadBalancers/read|Gets a load balancer definition|
|Microsoft.Network/loadBalancers/write|Creates a load balancer or updates an existing load balancer|
|Microsoft.Network/loadBalancers/delete|Deletes a load balancer|
|Microsoft.Network/loadBalancers/networkInterfaces/read|Gets references to all the network interfaces under a load balancer|
|Microsoft.Network/loadBalancers/loadBalancingRules/read|Gets a load balancer load balancing rule definition|
|Microsoft.Network/loadBalancers/backendAddressPools/read|Gets a load balancer backend address pool definition|
|Microsoft.Network/loadBalancers/backendAddressPools/join/action|Joins a load balancer backend address pool|
|Microsoft.Network/loadBalancers/inboundNatPools/read|Gets a load balancer inbound nat pool definition|
|Microsoft.Network/loadBalancers/inboundNatPools/join/action|Joins a load balancer inbound nat pool|
|Microsoft.Network/loadBalancers/inboundNatRules/read|Gets a load balancer inbound nat rule definition|
|Microsoft.Network/loadBalancers/inboundNatRules/write|Creates a load balancer inbound nat rule or updates an existing load balancer inbound nat rule|
|Microsoft.Network/loadBalancers/inboundNatRules/delete|Deletes a load balancer inbound nat rule|
|Microsoft.Network/loadBalancers/inboundNatRules/join/action|Joins a load balancer inbound nat rule|
|Microsoft.Network/loadBalancers/outboundNatRules/read|Gets a load balancer outbound nat rule definition|
|Microsoft.Network/loadBalancers/probes/read|Gets a load balancer probe|
|Microsoft.Network/loadBalancers/virtualMachines/read|Gets references to all the virtual machines under a load balancer|
|Microsoft.Network/loadBalancers/frontendIPConfigurations/read|Gets a load balancer frontend IP configuration definition|
|Microsoft.Network/trafficManagerGeographicHierarchies/read|Gets the Traffic Manager Geographic Hierarchy containing regions which can be used with the Geographic traffic routing method|
|Microsoft.Network/bgpServiceCommunities/read|Get Bgp Service Communities|
|Microsoft.Network/applicationGatewayAvailableWafRuleSets/read|Gets Application Gateway Available Waf Rule Sets|
|Microsoft.Network/virtualNetworks/read|Get the virtual network definition|
|Microsoft.Network/virtualNetworks/write|Creates a virtual network or updates an existing virtual network|
|Microsoft.Network/virtualNetworks/delete|Deletes a virtual network|
|Microsoft.Network/virtualNetworks/peer/action|Peers a virtual network with another virtual network|
|Microsoft.Network/virtualNetworks/virtualNetworkPeerings/read|Gets a virtual network peering definition|
|Microsoft.Network/virtualNetworks/virtualNetworkPeerings/write|Creates a virtual network peering or updates an existing virtual network peering|
|Microsoft.Network/virtualNetworks/virtualNetworkPeerings/delete|Deletes a virtual network peering|
|Microsoft.Network/virtualNetworks/subnets/read|Gets a virtual network subnet definition|
|Microsoft.Network/virtualNetworks/subnets/write|Creates a virtual network subnet or updates an existing virtual network subnet|
|Microsoft.Network/virtualNetworks/subnets/delete|Deletes a virtual network subnet|
|Microsoft.Network/virtualNetworks/subnets/join/action|Joins a virtual network|
|Microsoft.Network/virtualNetworks/subnets/joinViaServiceTunnel/action|Joins resource such as storage account or SQL database to a Service Tunneling enabled subnet.|
|Microsoft.Network/virtualNetworks/subnets/virtualMachines/read|Gets references to all the virtual machines in a virtual network subnet|
|Microsoft.Network/virtualNetworks/checkIpAddressAvailability/read|Check if Ip Address is available at the specified virtual network|
|Microsoft.Network/virtualNetworks/virtualMachines/read|Gets references to all the virtual machines in a virtual network|
|Microsoft.Network/expressRouteServiceProviders/read|Gets Express Route Service Providers|
|Microsoft.Network/dnsoperationresults/read|Gets results of a DNS operation|
|Microsoft.Network/localnetworkgateways/read|Gets LocalNetworkGateway|
|Microsoft.Network/localnetworkgateways/write|Creates or updates an existing LocalNetworkGateway|
|Microsoft.Network/localnetworkgateways/delete|Deletes LocalNetworkGateway|
|Microsoft.Network/trafficManagerProfiles/read|Get the Traffic Manager profile configuration. This includes DNS settings, traffic routing settings, endpoint monitoring settings, and the list of endpoints routed by this Traffic Manager profile.|
|Microsoft.Network/trafficManagerProfiles/write|Create a Traffic Manager profile, or modify the configuration of an existing Traffic Manager profile. This includes enabling or disabling a profile and modifying DNS settings, traffic routing settings, or endpoint monitoring settings. Endpoints routed by the Traffic Manager profile can be added, removed, enabled or disabled.|
|Microsoft.Network/trafficManagerProfiles/delete|Delete the Traffic Manager profile. All settings associated with the Traffic Manager profile will be lost, and the profile can no longer be used to route traffic.|
|Microsoft.Network/dnsoperationstatuses/read|Gets status of a DNS operation |
|Microsoft.Network/operations/read|Get Available Operations|
|Microsoft.Network/expressRouteCircuits/read|Get an ExpressRouteCircuit|
|Microsoft.Network/expressRouteCircuits/write|Creates or updates an existing ExpressRouteCircuit|
|Microsoft.Network/expressRouteCircuits/delete|Deletes an ExpressRouteCircuit|
|Microsoft.Network/expressRouteCircuits/stats/read|Gets an ExpressRouteCircuit Stat|
|Microsoft.Network/expressRouteCircuits/peerings/read|Gets an ExpressRouteCircuit Peering|
|Microsoft.Network/expressRouteCircuits/peerings/write|Creates or updates an existing ExpressRouteCircuit Peering|
|Microsoft.Network/expressRouteCircuits/peerings/delete|Deletes an ExpressRouteCircuit Peering|
|Microsoft.Network/expressRouteCircuits/peerings/arpTables/action|Gets an ExpressRouteCircuit Peering ArpTable|
|Microsoft.Network/expressRouteCircuits/peerings/routeTables/action|Gets an ExpressRouteCircuit Peering RouteTable|
|Microsoft.Network/expressRouteCircuits/peerings/routeTablesSummary/action|Gets an ExpressRouteCircuit Peering RouteTable Summary|
|Microsoft.Network/expressRouteCircuits/peerings/stats/read|Gets an ExpressRouteCircuit Peering Stat|
|Microsoft.Network/expressRouteCircuits/authorizations/read|Gets an ExpressRouteCircuit Authorization|
|Microsoft.Network/expressRouteCircuits/authorizations/write|Creates or updates an existing ExpressRouteCircuit Authorization|
|Microsoft.Network/expressRouteCircuits/authorizations/delete|Deletes an ExpressRouteCircuit Authorization|
|Microsoft.Network/connections/read|Gets VirtualNetworkGatewayConnection|
|Microsoft.Network/connections/write|Creates or updates an existing VirtualNetworkGatewayConnection|
|Microsoft.Network/connections/delete|Deletes VirtualNetworkGatewayConnection|
|Microsoft.Network/connections/sharedKey/read|Gets VirtualNetworkGatewayConnection SharedKey|
|Microsoft.Network/connections/sharedKey/write|Creates or updates an existing VirtualNetworkGatewayConnection SharedKey|
|Microsoft.Network/networkSecurityGroups/read|Gets a network security group definition|
|Microsoft.Network/networkSecurityGroups/write|Creates a network security group or updates an existing network security group|
|Microsoft.Network/networkSecurityGroups/delete|Deletes a network security group|
|Microsoft.Network/networkSecurityGroups/join/action|Joins a network security group|
|Microsoft.Network/networkSecurityGroups/defaultSecurityRules/read|Gets a default security rule definition|
|Microsoft.Network/networkSecurityGroups/securityRules/read|Gets a security rule definition|
|Microsoft.Network/networkSecurityGroups/securityRules/write|Creates a security rule or updates an existing security rule|
|Microsoft.Network/networkSecurityGroups/securityRules/delete|Deletes a security rule|
|Microsoft.Network/applicationGateways/read|Gets an application gateway|
|Microsoft.Network/applicationGateways/write|Creates an application gateway or updates an application gateway|
|Microsoft.Network/applicationGateways/delete|Deletes an application gateway|
|Microsoft.Network/applicationGateways/backendhealth/action|Gets an application gateway backend health|
|Microsoft.Network/applicationGateways/start/action|Starts an application gateway|
|Microsoft.Network/applicationGateways/stop/action|Stops an application gateway|
|Microsoft.Network/applicationGateways/backendAddressPools/join/action|Joins an application gateway backend address pool|
|Microsoft.Network/routeTables/read|Gets a route table definition|
|Microsoft.Network/routeTables/write|Creates a route table or Updates an existing rotue table|
|Microsoft.Network/routeTables/delete|Deletes a route table definition|
|Microsoft.Network/routeTables/join/action|Joins a route table|
|Microsoft.Network/routeTables/routes/read|Gets a route definition|
|Microsoft.Network/routeTables/routes/write|Creates a route or Updates an existing route|
|Microsoft.Network/routeTables/routes/delete|Deletes a route definition|
|Microsoft.Network/locations/operationResults/read|Gets operation result of an async POST or DELETE operation|
|Microsoft.Network/locations/checkDnsNameAvailability/read|Checks if dns label is available at the specified location|
|Microsoft.Network/locations/usages/read|Gets the resources usage metrics|
|Microsoft.Network/locations/operations/read|Gets operation resource that represents status of an asynchronous operation|

## Microsoft.NotificationHubs

| Operation | Description |
|---|---|
|Microsoft.NotificationHubs/register/action|Registers the subscription for the NotifciationHubs resource provider and enables the creation of Namespaces and NotificationHubs|
|Microsoft.NotificationHubs/CheckNamespaceAvailability/action|Checks whether or not a given Namespace resource name is available within the NotificationHub service.|
|Microsoft.NotificationHubs/Namespaces/write|Create a Namespace Resource and Update its properties. Tags and status of the Namespace are the properties which can be updated.|
|Microsoft.NotificationHubs/Namespaces/read|Get the list of Namespace Resource Description|
|Microsoft.NotificationHubs/Namespaces/Delete|Delete Namespace Resource|
|Microsoft.NotificationHubs/Namespaces/authorizationRules/action|Get the list of Namespaces Authorization Rules description.|
|Microsoft.NotificationHubs/Namespaces/CheckNotificationHubAvailability/action|Checks whether or not a given NotificationHub name is available inside a Namespace.|
|Microsoft.NotificationHubs/Namespaces/authorizationRules/write|Create a Namespace level Authorization Rules and update its properties. The Authorization Rules Access Rights, the Primary and Secondary Keys can be updated.|
|Microsoft.NotificationHubs/Namespaces/authorizationRules/read|Get the list of Namespaces Authorization Rules description.|
|Microsoft.NotificationHubs/Namespaces/authorizationRules/delete|Delete Namespace Authorization Rule. The Default Namespace Authorization Rule cannot be deleted. |
|Microsoft.NotificationHubs/Namespaces/authorizationRules/listkeys/action|Get the Connection String to the Namespace|
|Microsoft.NotificationHubs/Namespaces/authorizationRules/regenerateKeys/action|Namespace Authorization Rule Regenerate Primary/SecondaryKey, Specify the Key that needs to be regenerated|
|Microsoft.NotificationHubs/Namespaces/NotificationHubs/write|Create a Notification Hub and Update its properties. Its properties mainly include PNS Credentials. Authorization Rules and TTL|
|Microsoft.NotificationHubs/Namespaces/NotificationHubs/read|Get list of Notification Hub Resource Descriptions|
|Microsoft.NotificationHubs/Namespaces/NotificationHubs/Delete|Delete Notification Hub Resource|
|Microsoft.NotificationHubs/Namespaces/NotificationHubs/authorizationRules/action|Get the list of Notification Hub Authorization Rules|
|Microsoft.NotificationHubs/Namespaces/NotificationHubs/pnsCredentials/action|Get All Notification Hub PNS Credentials. This includes, WNS, MPNS, APNS, GCM and Baidu credentials|
|Microsoft.NotificationHubs/Namespaces/NotificationHubs/debugSend/action|Send a test push notification.|
|Microsoft.NotificationHubs/Namespaces/NotificationHubs/metricDefinitions/read|Get list of Namespace metrics Resource Descriptions|
|Microsoft.NotificationHubs/Namespaces/NotificationHubs/authorizationRules/write|Create Notification Hub Authorization Rules and Update its properties. The Authorization Rules Access Rights, the Primary and Secondary Keys can be updated.|
|Microsoft.NotificationHubs/Namespaces/NotificationHubs/authorizationRules/read|Get the list of Notification Hub Authorization Rules|
|Microsoft.NotificationHubs/Namespaces/NotificationHubs/authorizationRules/delete|Delete Notification Hub Authorization Rules|
|Microsoft.NotificationHubs/Namespaces/NotificationHubs/authorizationRules/listkeys/action|Get the Connection String to the Notification Hub|
|Microsoft.NotificationHubs/Namespaces/NotificationHubs/authorizationRules/regenerateKeys/action|Notification Hub Authorization Rule Regenerate Primary/SecondaryKey, Specify the Key that needs to be regenerated|

## Microsoft.OperationalInsights

| Operation | Description |
|---|---|
|Microsoft.OperationalInsights/register/action|Register a subscription to a resource provider.|
|Microsoft.OperationalInsights/linkTargets/read|Lists existing accounts that are not associated with an Azure subscription. To link this Azure subscription to a workspace, use a customer id returned by this operation in the customer id property of the Create Workspace operation.|
|Microsoft.OperationalInsights/workspaces/write|Creates a new workspace or links to an existing workspace by providing the customer id from the existing workspace.|
|Microsoft.OperationalInsights/workspaces/read|Gets an existing workspace|
|Microsoft.OperationalInsights/workspaces/delete|Deletes a workspace. If the workspace was linked to an existing workspace at creation time then the workspace it was linked to is not deleted.|
|Microsoft.OperationalInsights/workspaces/generateregistrationcertificate/action|Generates Registration Certificate for the workspace. This Certificate is used to connect Microsoft System Center Operation Manager to the workspace.|
|Microsoft.OperationalInsights/workspaces/sharedKeys/action|Retrieves the shared keys for the workspace. These keys are used to connect Microsoft Operational Insights agents to the workspace.|
|Microsoft.OperationalInsights/workspaces/search/action|Executes a search query|
|Microsoft.OperationalInsights/workspaces/datasources/read|Get datasources under a workspace.|
|Microsoft.OperationalInsights/workspaces/datasources/write|Create/Update datasources under a workspace.|
|Microsoft.OperationalInsights/workspaces/datasources/delete|Delete datasources under a workspace.|
|Microsoft.OperationalInsights/workspaces/managementGroups/read|Gets the names and metadata for System Center Operations Manager management groups connected to this workspace.|
|Microsoft.OperationalInsights/workspaces/schema/read|Gets the search schema for the workspace.  Search schema includes the exposed fields and their types.|
|Microsoft.OperationalInsights/workspaces/usages/read|Gets usage data for a workspace including the amount of data read by the workspace.|
|Microsoft.OperationalInsights/workspaces/intelligencepacks/read|Lists all intelligence packs that are visible for a given worksapce and also lists whether the pack is enabled or disabled for that workspace.|
|Microsoft.OperationalInsights/workspaces/intelligencepacks/enable/action|Enables an intelligence pack for a given workspace.|
|Microsoft.OperationalInsights/workspaces/intelligencepacks/disable/action|Disables an intelligence pack for a given workspace.|
|Microsoft.OperationalInsights/workspaces/sharedKeys/read|Retrieves the shared keys for the workspace. These keys are used to connect Microsoft Operational Insights agents to the workspace.|
|Microsoft.OperationalInsights/workspaces/savedSearches/read|Gets a saved search query|
|Microsoft.OperationalInsights/workspaces/savedSearches/write|Creates a saved search query|
|Microsoft.OperationalInsights/workspaces/savedSearches/delete|Deletes a saved search query|
|Microsoft.OperationalInsights/workspaces/storageinsightconfigs/write|Creates a new storage configuration. These configurations are used to pull data from a location in an existing storage account.|
|Microsoft.OperationalInsights/workspaces/storageinsightconfigs/read|Gets a storage configuration.|
|Microsoft.OperationalInsights/workspaces/storageinsightconfigs/delete|Deletes a storage configuration. This will stop Microsoft Operational Insights from reading data from the storage account.|
|Microsoft.OperationalInsights/workspaces/configurationScopes/read|Get Configuration Scope|
|Microsoft.OperationalInsights/workspaces/configurationScopes/write|Set Configuration Scope|
|Microsoft.OperationalInsights/workspaces/configurationScopes/delete|Delete Configuration Scope|

## Microsoft.OperationsManagement

| Operation | Description |
|---|---|
|Microsoft.OperationsManagement/register/action|Register a subscription to a resource provider.|
|Microsoft.OperationsManagement/solutions/write|Create new OMS solution|
|Microsoft.OperationsManagement/solutions/read|Get exiting OMS solution|
|Microsoft.OperationsManagement/solutions/delete|Delete existing OMS solution|

## Microsoft.RecoveryServices

| Operation | Description |
|---|---|
|Microsoft.RecoveryServices/Vaults/backupJobsExport/action|Export Jobs|
|Microsoft.RecoveryServices/Vaults/write|Create Vault operation creates an Azure resource of type 'vault'|
|Microsoft.RecoveryServices/Vaults/read|The Get Vault operation gets an object representing the Azure resource of type 'vault'|
|Microsoft.RecoveryServices/Vaults/delete|The Delete Vault operation deletes the specified Azure resource of type 'vault'|
|Microsoft.RecoveryServices/Vaults/refreshContainers/read|Refreshes the container list|
|Microsoft.RecoveryServices/Vaults/backupJobsExport/operationResults/read|Returns the Result of Export Job Operation.|
|Microsoft.RecoveryServices/Vaults/backupOperationResults/read|Returns Backup Operation Result for Recovery Services Vault.|
|Microsoft.RecoveryServices/Vaults/monitoringAlerts/read|Gets the alerts for the Recovery services vault.|
|Microsoft.RecoveryServices/Vaults/monitoringAlerts/{uniqueAlertId}/read|Gets the details of the alert.|
|Microsoft.RecoveryServices/Vaults/backupSecurityPIN/read|Returns Security PIN Information for Recovery Services Vault.|
|Microsoft.RecoveryServices/vaults/replicationEvents/read|Read Any Events|
|Microsoft.RecoveryServices/Vaults/backupProtectableItems/read|Returns list of all Protectable Items.|
|Microsoft.RecoveryServices/vaults/replicationFabrics/read|Read Any Fabrics|
|Microsoft.RecoveryServices/vaults/replicationFabrics/write|Create or Update Any Fabrics|
|Microsoft.RecoveryServices/vaults/replicationFabrics/remove/action|Remove Fabric|
|Microsoft.RecoveryServices/vaults/replicationFabrics/checkConsistency/action|Checks Consistency of the Fabric|
|Microsoft.RecoveryServices/vaults/replicationFabrics/delete|Delete Any Fabrics|
|Microsoft.RecoveryServices/vaults/replicationFabrics/renewcertificate/action||
|Microsoft.RecoveryServices/vaults/replicationFabrics/deployProcessServerImage/action|Deploy Process Server Image|
|Microsoft.RecoveryServices/vaults/replicationFabrics/reassociateGateway/action|Reassociate Gateway|
|Microsoft.RecoveryServices/vaults/replicationFabrics/replicationRecoveryServicesProviders/read|Read Any Recovery Services Providers|
|Microsoft.RecoveryServices/vaults/replicationFabrics/replicationRecoveryServicesProviders/remove/action|Remove Recovery Services Provider|
|Microsoft.RecoveryServices/vaults/replicationFabrics/replicationRecoveryServicesProviders/delete|Delete Any Recovery Services Providers|
|Microsoft.RecoveryServices/vaults/replicationFabrics/replicationRecoveryServicesProviders/refreshProvider/action|Refresh Provider|
|Microsoft.RecoveryServices/vaults/replicationFabrics/replicationStorageClassifications/read|Read Any Storage Classifications|
|Microsoft.RecoveryServices/vaults/replicationFabrics/replicationStorageClassifications/replicationStorageClassificationMappings/read|Read Any Storage Classification Mappings|
|Microsoft.RecoveryServices/vaults/replicationFabrics/replicationStorageClassifications/replicationStorageClassificationMappings/write|Create or Update Any Storage Classification Mappings|
|Microsoft.RecoveryServices/vaults/replicationFabrics/replicationStorageClassifications/replicationStorageClassificationMappings/delete|Delete Any Storage Classification Mappings|
|Microsoft.RecoveryServices/vaults/replicationFabrics/replicationvCenters/read|Read Any Jobs|
|Microsoft.RecoveryServices/vaults/replicationFabrics/replicationvCenters/write|Create or Update Any Jobs|
|Microsoft.RecoveryServices/vaults/replicationFabrics/replicationvCenters/delete|Delete Any Jobs|
|Microsoft.RecoveryServices/vaults/replicationFabrics/replicationNetworks/read|Read Any Networks|
|Microsoft.RecoveryServices/vaults/replicationFabrics/replicationNetworks/replicationNetworkMappings/read|Read Any Network Mappings|
|Microsoft.RecoveryServices/vaults/replicationFabrics/replicationNetworks/replicationNetworkMappings/write|Create or Update Any Network Mappings|
|Microsoft.RecoveryServices/vaults/replicationFabrics/replicationNetworks/replicationNetworkMappings/delete|Delete Any Network Mappings|
|Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/read|Read Any Protection Containers|
|Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/discoverProtectableItem/action|Discover Protectable Item|
|Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/write|Create or Update Any Protection Containers|
|Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/remove/action|Remove Protection Container|
|Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/switchprotection/action|Switch Protection Container|
|Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/replicationProtectableItems/read|Read Any Protectable Items|
|Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/replicationProtectionContainerMappings/read|Read Any Protection Container Mappings|
|Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/replicationProtectionContainerMappings/write|Create or Update Any Protection Container Mappings|
|Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/replicationProtectionContainerMappings/remove/action|Remove Protection Container Mapping|
|Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/replicationProtectionContainerMappings/delete|Delete Any Protection Container Mappings|
|Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/replicationProtectedItems/read|Read Any Protected Items|
|Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/replicationProtectedItems/write|Create or Update Any Protected Items|
|Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/replicationProtectedItems/delete|Delete Any Protected Items|
|Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/replicationProtectedItems/remove/action|Remove Protected Item|
|Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/replicationProtectedItems/plannedFailover/action|Planned Failover|
|Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/replicationProtectedItems/unplannedFailover/action|Failover|
|Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/replicationProtectedItems/testFailover/action|Test Failover|
|Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/replicationProtectedItems/testFailoverCleanup/action|Test Failover Cleanup|
|Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/replicationProtectedItems/failoverCommit/action|Failover Commit|
|Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/replicationProtectedItems/reProtect/action|ReProtect Protected Item|
|Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/replicationProtectedItems/updateMobilityService/action|Update Mobility Service|
|Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/replicationProtectedItems/repairReplication/action|Repair replication|
|Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/replicationProtectedItems/applyRecoveryPoint/action|Apply Recovery Point|
|Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/replicationProtectedItems/recoveryPoints/read|Read Any Replication Recovery Points|
|Microsoft.RecoveryServices/vaults/replicationPolicies/read|Read Any Policies|
|Microsoft.RecoveryServices/vaults/replicationPolicies/write|Create or Update Any Policies|
|Microsoft.RecoveryServices/vaults/replicationPolicies/delete|Delete Any Policies|
|Microsoft.RecoveryServices/vaults/replicationRecoveryPlans/read|Read Any Recovery Plans|
|Microsoft.RecoveryServices/vaults/replicationRecoveryPlans/write|Create or Update Any Recovery Plans|
|Microsoft.RecoveryServices/vaults/replicationRecoveryPlans/delete|Delete Any Recovery Plans|
|Microsoft.RecoveryServices/vaults/replicationRecoveryPlans/plannedFailover/action|Planned Failover Recovery Plan|
|Microsoft.RecoveryServices/vaults/replicationRecoveryPlans/unplannedFailover/action|Failover Recovery Plan|
|Microsoft.RecoveryServices/vaults/replicationRecoveryPlans/testFailover/action|Test Failover Recovery Plan|
|Microsoft.RecoveryServices/vaults/replicationRecoveryPlans/testFailoverCleanup/action|Test Failover Cleanup Recovery Plan|
|Microsoft.RecoveryServices/vaults/replicationRecoveryPlans/failoverCommit/action|Failover Commit Recovery Plan|
|Microsoft.RecoveryServices/vaults/replicationRecoveryPlans/reProtect/action|ReProtect Recovery Plan|
|Microsoft.RecoveryServices/Vaults/extendedInformation/read|The Get Extended Info operation gets an object's Extended Info representing the Azure resource of type ?vault?|
|Microsoft.RecoveryServices/Vaults/extendedInformation/write|The Get Extended Info operation gets an object's Extended Info representing the Azure resource of type ?vault?|
|Microsoft.RecoveryServices/Vaults/extendedInformation/delete|The Get Extended Info operation gets an object's Extended Info representing the Azure resource of type ?vault?|
|Microsoft.RecoveryServices/Vaults/backupManagementMetaData/read|Returns Backup Management Metadata for Recovery Services Vault.|
|Microsoft.RecoveryServices/Vaults/backupProtectionContainers/read|Returns all containers belonging to the subscription|
|Microsoft.RecoveryServices/Vaults/backupFabrics/operationResults/read|Returns status of the operation|
|Microsoft.RecoveryServices/Vaults/backupFabrics/protectionContainers/read|Returns all registered containers|
|Microsoft.RecoveryServices/Vaults/backupFabrics/protectionContainers/operationResults/read|Gets result of Operation performed on Protection Container.|
|Microsoft.RecoveryServices/Vaults/backupFabrics/protectionContainers/protectedItems/read|Returns object details of the Protected Item|
|Microsoft.RecoveryServices/Vaults/backupFabrics/protectionContainers/protectedItems/write|Create a backup Protected Item|
|Microsoft.RecoveryServices/Vaults/backupFabrics/protectionContainers/protectedItems/delete|Deletes Protected Item|
|Microsoft.RecoveryServices/Vaults/backupFabrics/protectionContainers/protectedItems/backup/action|Performs Backup for Protected Item.|
|Microsoft.RecoveryServices/Vaults/backupFabrics/protectionContainers/protectedItems/operationResults/read|Gets Result of Operation Performed on Protected Items.|
|Microsoft.RecoveryServices/Vaults/backupFabrics/protectionContainers/protectedItems/operationStatus/read|Returns the status of Operation performed on Protected Items.|
|Microsoft.RecoveryServices/Vaults/backupFabrics/protectionContainers/protectedItems/recoveryPoints/read|Get Recovery Points for Protected Items.|
|Microsoft.RecoveryServices/Vaults/backupFabrics/protectionContainers/protectedItems/recoveryPoints/restore/action|Restore Recovery Points for Protected Items.|
|Microsoft.RecoveryServices/Vaults/backupFabrics/protectionContainers/protectedItems/recoveryPoints/provisionInstantItemRecovery/action|Provision Instant Item Recovery for Protected Item|
|Microsoft.RecoveryServices/Vaults/backupFabrics/protectionContainers/protectedItems/recoveryPoints/revokeInstantItemRecovery/action|Revoke Instant Item Recovery for Protected Item|
|Microsoft.RecoveryServices/Vaults/usages/read|Returns usage details for a Recovery Services Vault.|
|Microsoft.RecoveryServices/vaults/usages/read|Read Any Vault Usages|
|Microsoft.RecoveryServices/Vaults/certificates/write|The Update Resource Certificate operation updates the resource/vault credential certificate.|
|Microsoft.RecoveryServices/Vaults/tokenInfo/read|Returns token information for Recovery Services Vault.|
|Microsoft.RecoveryServices/vaults/replicationAlertSettings/read|Read Any Alerts Settings|
|Microsoft.RecoveryServices/vaults/replicationAlertSettings/write|Create or Update Any Alerts Settings|
|Microsoft.RecoveryServices/Vaults/backupOperations/read|Returns Backup Operation Status for Recovery Services Vault.|
|Microsoft.RecoveryServices/Vaults/storageConfig/read|Returns Storage Configuration for Recovery Services Vault.|
|Microsoft.RecoveryServices/Vaults/storageConfig/write|Updates Storage Configuration for Recovery Services Vault.|
|Microsoft.RecoveryServices/Vaults/backupUsageSummaries/read|Returns summaries for Protected Items and Protected Servers for a Recovery Services .|
|Microsoft.RecoveryServices/Vaults/backupProtectedItems/read|Returns the list of all Protected Items.|
|Microsoft.RecoveryServices/Vaults/backupconfig/vaultconfig/read|Returns Configuration for Recovery Services Vault.|
|Microsoft.RecoveryServices/Vaults/backupconfig/vaultconfig/write|Updates Configuration for Recovery Services Vault.|
|Microsoft.RecoveryServices/Vaults/registeredIdentities/write|The Register Service Container operation can be used to register a container with Recovery Service.|
|Microsoft.RecoveryServices/Vaults/registeredIdentities/read|The Get Containers operation can be used get the containers registered for a resource.|
|Microsoft.RecoveryServices/Vaults/registeredIdentities/delete|The UnRegister Container operation can be used to unregister a container.|
|Microsoft.RecoveryServices/Vaults/registeredIdentities/operationResults/read|The Get Operation Results operation can be used get the operation status and result for the asynchronously submitted operation|
|Microsoft.RecoveryServices/vaults/replicationJobs/read|Read Any Jobs|
|Microsoft.RecoveryServices/vaults/replicationJobs/cancel/action|Cancel Job|
|Microsoft.RecoveryServices/vaults/replicationJobs/restart/action|Restart job|
|Microsoft.RecoveryServices/vaults/replicationJobs/resume/action|Resume Job|
|Microsoft.RecoveryServices/Vaults/backupPolicies/read|Returns all Protection Policies|
|Microsoft.RecoveryServices/Vaults/backupPolicies/write|Creates Protection Policy|
|Microsoft.RecoveryServices/Vaults/backupPolicies/delete|Delete a Protection Policy|
|Microsoft.RecoveryServices/Vaults/backupPolicies/operationResults/read|Get Results of Policy Operation.|
|Microsoft.RecoveryServices/Vaults/backupPolicies/operationStatus/read|Get Status of Policy Operation.|
|Microsoft.RecoveryServices/Vaults/vaultTokens/read|The Vault Token operation can be used to get Vault Token for vault level backend operations.|
|Microsoft.RecoveryServices/Vaults/monitoringConfigurations/notificationConfiguration/read|Gets the Recovery services vault notification configuration.|
|Microsoft.RecoveryServices/Vaults/backupJobs/read|Returns all Job Objects|
|Microsoft.RecoveryServices/Vaults/backupJobs/cancel/action|Cancel the Job|
|Microsoft.RecoveryServices/Vaults/backupJobs/operationResults/read|Returns the Result of Job Operation.|
|Microsoft.RecoveryServices/locations/allocateStamp/action|AllocateStamp is internal operation used by service|
|Microsoft.RecoveryServices/locations/allocatedStamp/read|GetAllocatedStamp is internal operation used by service|

## Microsoft.Relay

| Operation | Description |
|---|---|
|Microsoft.Relay/checkNamespaceAvailability/action|Checks availability of namespace under given subscription.|
|Microsoft.Relay/register/action|Registers the subscription for the Relay resource provider and enables the creation of Relay resources|
|Microsoft.Relay/namespaces/write|Create a Namespace Resource and Update its properties. Tags and status of the Namespace are the properties which can be updated.|
|Microsoft.Relay/namespaces/read|Get the list of Namespace Resource Description|
|Microsoft.Relay/namespaces/Delete|Delete Namespace Resource|
|Microsoft.Relay/namespaces/authorizationRules/write|Create a Namespace level Authorization Rules and update its properties. The Authorization Rules Access Rights, the Primary and Secondary Keys can be updated.|
|Microsoft.Relay/namespaces/authorizationRules/delete|Delete Namespace Authorization Rule. The Default Namespace Authorization Rule cannot be deleted. |
|Microsoft.Relay/namespaces/authorizationRules/listkeys/action|Get the Connection String to the Namespace|
|Microsoft.Relay/namespaces/HybridConnections/write|Create or Update HybridConnection properties.|
|Microsoft.Relay/namespaces/HybridConnections/read|Get list of HybridConnection Resource Descriptions|
|Microsoft.Relay/namespaces/HybridConnections/Delete|Operation to delete HybridConnection Resource|
|Microsoft.Relay/namespaces/HybridConnections/authorizationRules/write|Create HybridConnection Authorization Rules and Update its properties. The Authorization Rules Access Rights, the Primary and Secondary Keys can be updated.|
|Microsoft.Relay/namespaces/HybridConnections/authorizationRules/delete|Operation to delete HybridConnection Authorization Rules|
|Microsoft.Relay/namespaces/HybridConnections/authorizationRules/listkeys/action|Get the Connection String to HybridConnection|
|Microsoft.Relay/namespaces/WcfRelays/write|Create or Update WcfRelay properties.|
|Microsoft.Relay/namespaces/WcfRelays/read|Get list of WcfRelay Resource Descriptions|
|Microsoft.Relay/namespaces/WcfRelays/Delete|Operation to delete WcfRelay Resource|
|Microsoft.Relay/namespaces/WcfRelays/authorizationRules/write|Create WcfRelay Authorization Rules and Update its properties. The Authorization Rules Access Rights, the Primary and Secondary Keys can be updated.|
|Microsoft.Relay/namespaces/WcfRelays/authorizationRules/delete|Operation to delete WcfRelay Authorization Rules|
|Microsoft.Relay/namespaces/WcfRelays/authorizationRules/listkeys/action|Get the Connection String to WcfRelay|

## Microsoft.ResourceHealth

| Operation | Description |
|---|---|
|Microsoft.ResourceHealth/AvailabilityStatuses/read|Gets the availability statuses for all resources in the specified scope|
|Microsoft.ResourceHealth/AvailabilityStatuses/current/read|Gets the availability status for the specified resource|

## Microsoft.Resources

| Operation | Description |
|---|---|
|Microsoft.Resources/checkResourceName/action|Check the resource name for validity.|
|Microsoft.Resources/providers/read|Get the list of providers.|
|Microsoft.Resources/subscriptions/read|Gets the list of subscriptions.|
|Microsoft.Resources/subscriptions/operationresults/read|Get the subscription operation results.|
|Microsoft.Resources/subscriptions/providers/read|Gets or lists resource providers.|
|Microsoft.Resources/subscriptions/tagNames/read|Gets or lists subscription tags.|
|Microsoft.Resources/subscriptions/tagNames/write|Adds a subscription tag.|
|Microsoft.Resources/subscriptions/tagNames/delete|Deletes a subscription tag.|
|Microsoft.Resources/subscriptions/tagNames/tagValues/read|Gets or lists subscription tag values.|
|Microsoft.Resources/subscriptions/tagNames/tagValues/write|Adds a subscription tag value.|
|Microsoft.Resources/subscriptions/tagNames/tagValues/delete|Deletes a subscription tag value.|
|Microsoft.Resources/subscriptions/resources/read|Gets resources of a subscription.|
|Microsoft.Resources/subscriptions/resourceGroups/read|Gets or lists resource groups.|
|Microsoft.Resources/subscriptions/resourceGroups/write|Creates or updates a resource group.|
|Microsoft.Resources/subscriptions/resourceGroups/delete|Deletes a resource group and all its resources.|
|Microsoft.Resources/subscriptions/resourceGroups/moveResources/action|Moves resources from one resource group to another.|
|Microsoft.Resources/subscriptions/resourceGroups/validateMoveResources/action|Validate move of resources from one resource group to another.|
|Microsoft.Resources/subscriptions/resourcegroups/resources/read|Gets the resources for the resource group.|
|Microsoft.Resources/subscriptions/resourcegroups/deployments/read|Gets or lists deployments.|
|Microsoft.Resources/subscriptions/resourcegroups/deployments/write|Creates or updates an deployment.|
|Microsoft.Resources/subscriptions/resourcegroups/deployments/operationstatuses/read|Gets or lists deployment operation statuses.|
|Microsoft.Resources/subscriptions/resourcegroups/deployments/operations/read|Gets or lists deployment operations.|
|Microsoft.Resources/subscriptions/locations/read|Gets the list of locations supported.|
|Microsoft.Resources/links/read|Gets or lists resource links.|
|Microsoft.Resources/links/write|Creates or updates a resource link.|
|Microsoft.Resources/links/delete|Deletes a resource link.|
|Microsoft.Resources/tenants/read|Gets the list of tenants.|
|Microsoft.Resources/resources/read|Get the list of resources based upon filters.|
|Microsoft.Resources/deployments/read|Gets or lists deployments.|
|Microsoft.Resources/deployments/write|Creates or updates an deployment.|
|Microsoft.Resources/deployments/delete|Deletes a deployment.|
|Microsoft.Resources/deployments/cancel/action|Cancels a deployment.|
|Microsoft.Resources/deployments/validate/action|Validates an deployment.|
|Microsoft.Resources/deployments/operations/read|Gets or lists deployment operations.|

## Microsoft.Scheduler

| Operation | Description |
|---|---|
|Microsoft.Scheduler/jobcollections/read|Get Job Collection|
|Microsoft.Scheduler/jobcollections/write|Creates or updates job collection.|
|Microsoft.Scheduler/jobcollections/delete|Deletes job collection.|
|Microsoft.Scheduler/jobcollections/enable/action|Enables job collection.|
|Microsoft.Scheduler/jobcollections/disable/action|Disables job collection.|
|Microsoft.Scheduler/jobcollections/jobs/read|Gets job.|
|Microsoft.Scheduler/jobcollections/jobs/write|Creates or updates job.|
|Microsoft.Scheduler/jobcollections/jobs/delete|Deletes job.|
|Microsoft.Scheduler/jobcollections/jobs/run/action|Runs job.|
|Microsoft.Scheduler/jobcollections/jobs/generateLogicAppDefinition/action|Generates Logic App definition based on a Scheduler Job.|
|Microsoft.Scheduler/jobcollections/jobs/jobhistories/read|Gets job history.|

## Microsoft.Search

| Operation | Description |
|---|---|
|Microsoft.Search/register/action|Registers the subscription for the search resource provider and enables the creation of search services.|
|Microsoft.Search/checkNameAvailability/action|Checks availability of the service name.|
|Microsoft.Search/searchServices/write|Creates or updates the search service.|
|Microsoft.Search/searchServices/read|Reads the search service.|
|Microsoft.Search/searchServices/delete|Deletes the search service.|
|Microsoft.Search/searchServices/start/action|Starts the search service.|
|Microsoft.Search/searchServices/stop/action|Stops the search service.|
|Microsoft.Search/searchServices/listAdminKeys/action|Reads the admin keys.|
|Microsoft.Search/searchServices/regenerateAdminKey/action|Regenerates the admin key.|
|Microsoft.Search/searchServices/createQueryKey/action|Creates the query key.|
|Microsoft.Search/searchServices/queryKey/read|Reads the query keys.|
|Microsoft.Search/searchServices/queryKey/delete|Deletes the query key.|

## Microsoft.Security

| Operation | Description |
|---|---|
|Microsoft.Security/jitNetworkAccessPolicies/read|Gets the just-in-time network access policies|
|Microsoft.Security/jitNetworkAccessPolicies/write|Creates a new just-in-time network access policy or updates an existing one|
|Microsoft.Security/jitNetworkAccessPolicies/initiate/action|Initiates a just-in-time network access policy|
|Microsoft.Security/securitySolutionsReferenceData/read|Gets the security solutions reference data|
|Microsoft.Security/securityStatuses/read|Gets the security health statuses for Azure resources|
|Microsoft.Security/webApplicationFirewalls/read|Gets the web application firewalls|
|Microsoft.Security/webApplicationFirewalls/write|Creates a new web application firewall or updates an existing one|
|Microsoft.Security/webApplicationFirewalls/delete|Deletes a web application firewall|
|Microsoft.Security/securitySolutions/read|Gets the security solutions|
|Microsoft.Security/securitySolutions/write|Creates a new security solution or updates an existing one|
|Microsoft.Security/securitySolutions/delete|Deletes a security solution|
|Microsoft.Security/tasks/read|Gets all available security recommendations|
|Microsoft.Security/tasks/dismiss/action|Dismiss a security recommendation|
|Microsoft.Security/tasks/activate/action|Activate a security recommendation|
|Microsoft.Security/policies/read|Gets the security policy|
|Microsoft.Security/policies/write|Updates the security policy|
|Microsoft.Security/applicationWhitelistings/read|Gets the application whitelistings|
|Microsoft.Security/applicationWhitelistings/write|Creates a new application whitelisting or updates an existing one|

## Microsoft.ServerManagement

| Operation | Description |
|---|---|
|Microsoft.ServerManagement/subscriptions/write|Creates or updates a subscription|
|Microsoft.ServerManagement/gateways/write|Creates or updates a gateway|
|Microsoft.ServerManagement/gateways/delete|Deletes a gateway|
|Microsoft.ServerManagement/gateways/read|Gets a gateway|
|Microsoft.ServerManagement/gateways/regenerateprofile/action|Regenerates the gateway profile|
|Microsoft.ServerManagement/gateways/upgradetolatest/action|Upgrades the gateway to the latest version|
|Microsoft.ServerManagement/nodes/write|creates or updates a node|
|Microsoft.ServerManagement/nodes/delete|Deletes a node|
|Microsoft.ServerManagement/nodes/read|Gets a node|
|Microsoft.ServerManagement/sessions/write|Creates or updates a session|
|Microsoft.ServerManagement/sessions/read|Gets a session|
|Microsoft.ServerManagement/sessions/delete|Deletes a sesssion|

## Microsoft.ServiceBus

| Operation | Description |
|---|---|
|Microsoft.ServiceBus/checkNameAvailability/action|Checks availability of namespace under given subscription.|
|Microsoft.ServiceBus/register/action|Registers the subscription for the ServiceBus resource provider and enables the creation of ServiceBus resources|
|Microsoft.ServiceBus/namespaces/write|Create a Namespace Resource and Update its properties. Tags and status of the Namespace are the properties which can be updated.|
|Microsoft.ServiceBus/namespaces/read|Get the list of Namespace Resource Description|
|Microsoft.ServiceBus/namespaces/Delete|Delete Namespace Resource|
|Microsoft.ServiceBus/namespaces/metricDefinitions/read|Get list of Namespace metrics Resource Descriptions|
|Microsoft.ServiceBus/namespaces/authorizationRules/write|Create a Namespace level Authorization Rules and update its properties. The Authorization Rules Access Rights, the Primary and Secondary Keys can be updated.|
|Microsoft.ServiceBus/namespaces/authorizationRules/read|Get the list of Namespaces Authorization Rules description.|
|Microsoft.ServiceBus/namespaces/authorizationRules/delete|Delete Namespace Authorization Rule. The Default Namespace Authorization Rule cannot be deleted. |
|Microsoft.ServiceBus/namespaces/authorizationRules/listkeys/action|Get the Connection String to the Namespace|
|Microsoft.ServiceBus/namespaces/authorizationRules/regenerateKeys/action|Regenerate the Primary or Secondary key to the Resource|
|Microsoft.ServiceBus/namespaces/diagnosticSettings/read|Get list of Namespace diagnostic settings Resource Descriptions|
|Microsoft.ServiceBus/namespaces/diagnosticSettings/write|Get list of Namespace diagnostic settings Resource Descriptions|
|Microsoft.ServiceBus/namespaces/queues/write|Create or Update Queue properties.|
|Microsoft.ServiceBus/namespaces/queues/read|Get list of Queue Resource Descriptions|
|Microsoft.ServiceBus/namespaces/queues/Delete|Operation to delete Queue Resource|
|Microsoft.ServiceBus/namespaces/queues/authorizationRules/write|Create Queue Authorization Rules and Update its properties. The Authorization Rules Access Rights, the Primary and Secondary Keys can be updated.|
|Microsoft.ServiceBus/namespaces/queues/authorizationRules/read| Get the list of Queue Authorization Rules|
|Microsoft.ServiceBus/namespaces/queues/authorizationRules/delete|Operation to delete Queue Authorization Rules|
|Microsoft.ServiceBus/namespaces/queues/authorizationRules/listkeys/action|Get the Connection String to Queue|
|Microsoft.ServiceBus/namespaces/queues/authorizationRules/regenerateKeys/action|Regenerate the Primary or Secondary key to the Resource|
|Microsoft.ServiceBus/namespaces/logDefinitions/read|Get list of Namespace logs Resource Descriptions|
|Microsoft.ServiceBus/namespaces/topics/write|Create or Update Topic properties.|
|Microsoft.ServiceBus/namespaces/topics/read|Get list of Topic Resource Descriptions|
|Microsoft.ServiceBus/namespaces/topics/Delete|Operation to delete Topic Resource|
|Microsoft.ServiceBus/namespaces/topics/authorizationRules/write|Create Topic Authorization Rules and Update its properties. The Authorization Rules Access Rights, the Primary and Secondary Keys can be updated.|
|Microsoft.ServiceBus/namespaces/topics/authorizationRules/read| Get the list of Topic Authorization Rules|
|Microsoft.ServiceBus/namespaces/topics/authorizationRules/delete|Operation to delete Topic Authorization Rules|
|Microsoft.ServiceBus/namespaces/topics/authorizationRules/listkeys/action|Get the Connection String to Topic|
|Microsoft.ServiceBus/namespaces/topics/authorizationRules/regenerateKeys/action|Regenerate the Primary or Secondary key to the Resource|
|Microsoft.ServiceBus/namespaces/topics/subscriptions/write|Create or Update TopicSubscription properties.|
|Microsoft.ServiceBus/namespaces/topics/subscriptions/read|Get list of TopicSubscription Resource Descriptions|
|Microsoft.ServiceBus/namespaces/topics/subscriptions/Delete|Operation to delete TopicSubscription Resource|
|Microsoft.ServiceBus/namespaces/topics/subscriptions/rules/write|Create or Update Rule properties.|
|Microsoft.ServiceBus/namespaces/topics/subscriptions/rules/read|Get list of Rule Resource Descriptions|
|Microsoft.ServiceBus/namespaces/topics/subscriptions/rules/Delete|Operation to delete Rule Resource|

## Microsoft.Sql

| Operation | Description |
|---|---|
|Microsoft.Sql/servers/read|Return a list of servers in a resource group on a subscription|
|Microsoft.Sql/servers/write|Create a new server or modify properties of existing server in a resource group on a subscription|
|Microsoft.Sql/servers/delete|Delete a server and all contained databases and elastic pools|
|Microsoft.Sql/servers/import/action|Create a new database on the server and deploy schema and data from a DacPac package|
|Microsoft.Sql/servers/upgrade/action|Enable new functionality available on the latest version of server and specify databases edition conversion map|
|Microsoft.Sql/servers/VulnerabilityAssessmentScans/action|Execute vulnerability assessment server scan|
|Microsoft.Sql/servers/operationResults/read|Operation is used to track progress of server upgrade from lower version to higher|
|Microsoft.Sql/servers/operationResults/delete|Abort server version upgrade in progress|
|Microsoft.Sql/servers/securityAlertPolicies/read|Retrieve details of the server threat detection policy configured on a given server|
|Microsoft.Sql/servers/securityAlertPolicies/write|Change the server threat detection for a given server|
|Microsoft.Sql/servers/securityAlertPolicies/operationResults/read|Retrieve results of the server Threat Detection policy Set operation|
|Microsoft.Sql/servers/administrators/read|Retrieve server administrator details|
|Microsoft.Sql/servers/administrators/write|Create or update server administrator|
|Microsoft.Sql/servers/administrators/delete|Delete server administrator from the server|
|Microsoft.Sql/servers/recoverableDatabases/read|This operation is used for disaster recovery of live database to restore database to last-known good backup point. It returns information about the last good backup but it doesn't actually restore the database.|
|Microsoft.Sql/servers/serviceObjectives/read|Retrieve list of service level objectives (also known as performance tiers) available on a given server|
|Microsoft.Sql/servers/firewallRules/read|Retrieve server firewall rule details|
|Microsoft.Sql/servers/firewallRules/write|Create or update server firewall rule that controls IP address range allowed to connect to the server|
|Microsoft.Sql/servers/firewallRules/delete|Delete firewall rule from the server|
|Microsoft.Sql/servers/administratorOperationResults/read|Retrieve server administrator operation results|
|Microsoft.Sql/servers/recommendedElasticPools/read|Retrieve recommendation for elastic database pools to reduce cost or improve performance based on historica resource utilization|
|Microsoft.Sql/servers/recommendedElasticPools/metrics/read|Retrieve metrics for recommended elastic database pools for a given server|
|Microsoft.Sql/servers/recommendedElasticPools/databases/read|Retrieve databases that should be added into recommended elastic database pools for a given server|
|Microsoft.Sql/servers/elasticPools/read|Retrieve details of elastic database pool on a given server|
|Microsoft.Sql/servers/elasticPools/write|Create a new or change properties of existing elastic database pool|
|Microsoft.Sql/servers/elasticPools/delete|Delete existing elastic database pool|
|Microsoft.Sql/servers/elasticPools/operationResults/read|Retrieve details on a given elastic database pool operation|
|Microsoft.Sql/servers/elasticPools/providers/Microsoft.Insights/metricDefinitions/read|Return types of metrics that are available for elastic database pools|
|Microsoft.Sql/servers/elasticPools/providers/Microsoft.Insights/diagnosticSettings/read|Gets the diagnostic setting for the resource|
|Microsoft.Sql/servers/elasticPools/providers/Microsoft.Insights/diagnosticSettings/write|Creates or updates the diagnostic setting for the resource|
|Microsoft.Sql/servers/elasticPools/metrics/read|Return elastic database pool resource utilization metrics|
|Microsoft.Sql/servers/elasticPools/elasticPoolDatabaseActivity/read|Retrieve activities and details on a given database that is part of elastic database pool|
|Microsoft.Sql/servers/elasticPools/advisors/read|Returns list of advisors available for the elastic pool|
|Microsoft.Sql/servers/elasticPools/advisors/write|Update auto-execute status of an advisor on elastic pool level.|
|Microsoft.Sql/servers/elasticPools/advisors/recommendedActions/read|Returns list of recommended actions of specified advisor for the elastic pool|
|Microsoft.Sql/servers/elasticPools/advisors/recommendedActions/write|Apply the recommended action on the elastic pool|
|Microsoft.Sql/servers/elasticPools/elasticPoolActivity/read|Retrieve activities and details on a given elastic database pool|
|Microsoft.Sql/servers/elasticPools/databases/read|Retrieve list and details of databases that are part of elastic database pool on a given server|
|Microsoft.Sql/servers/auditingPolicies/read|Retrieve details of the default server table auditing policy configured on a given server|
|Microsoft.Sql/servers/auditingPolicies/write|Change the default server table auditing for a given server|
|Microsoft.Sql/servers/disasterRecoveryConfiguration/operationResults/read|Get Disaster Recovery Configuration Operation Results|
|Microsoft.Sql/servers/advisors/read|Returns list of advisors available for the server|
|Microsoft.Sql/servers/advisors/write|Updates auto-execute status of an advisor on server level.|
|Microsoft.Sql/servers/advisors/recommendedActions/read|Returns list of recommended actions of specified advisor for the server|
|Microsoft.Sql/servers/advisors/recommendedActions/write|Apply the recommended action on the server|
|Microsoft.Sql/servers/usages/read|Return server DTU quota and current DTU consuption by all databases within the server|
|Microsoft.Sql/servers/elasticPoolEstimates/read|Returns list of elastic pool estimates already created for this server|
|Microsoft.Sql/servers/elasticPoolEstimates/write|Creates new elastic pool estimate for list of databases provided|
|Microsoft.Sql/servers/auditingSettings/read|Retrieve details of the server blob auditing policy configured on a given server|
|Microsoft.Sql/servers/auditingSettings/write|Change the server blob auditing for a given server|
|Microsoft.Sql/servers/auditingSettings/operationResults/read|Retrieve result of the server blob auditing policy Set operation|
|Microsoft.Sql/servers/backupLongTermRetentionVaults/read|This operation is used to get a backup long term retention vault. It returns information about the vault registered to this server.|
|Microsoft.Sql/servers/backupLongTermRetentionVaults/write|Register a backup long term retention vault|
|Microsoft.Sql/servers/restorableDroppedDatabases/read|Retrieve a list of databases that were dropped on a given server that are still within retention policy. This operation returns a list of databases and associated metadata, like date of deletion.|
|Microsoft.Sql/servers/databases/read|Return a list of servers in a resource group on a subscription|
|Microsoft.Sql/servers/databases/write|Create a new server or modify properties of existing server in a resource group on a subscription|
|Microsoft.Sql/servers/databases/delete|Delete a server and all contained databases and elastic pools|
|Microsoft.Sql/servers/databases/export/action|Create a new database on the server and deploy schema and data from a DacPac package|
|Microsoft.Sql/servers/databases/VulnerabilityAssessmentScans/action|Execute vulnerability assessment database scan.|
|Microsoft.Sql/servers/databases/pause/action|Pause a DataWarehouse edition database|
|Microsoft.Sql/servers/databases/resume/action|Resume a DataWarehouse edition database|
|Microsoft.Sql/servers/databases/operationResults/read|Operation is used to track progress of long running database operation, such as scale.|
|Microsoft.Sql/servers/databases/replicationLinks/read|Return details about replication links established for a particular database|
|Microsoft.Sql/servers/databases/replicationLinks/delete|Terminate the replication relationship forcefully and with potential data loss|
|Microsoft.Sql/servers/databases/replicationLinks/unlink/action|Terminate the replication relationship forcefully or after synchronizing with the partner|
|Microsoft.Sql/servers/databases/replicationLinks/failover/action|Failover after synchronizing all changes from the primary, making this database into the replication relationship's primary and making the remote primary into a secondary|
|Microsoft.Sql/servers/databases/replicationLinks/forceFailoverAllowDataLoss/action|Failover immediately with potential data loss, making this database into the replication relationship's primary and making the remote primary into a secondary|
|Microsoft.Sql/servers/databases/replicationLinks/updateReplicationMode/action|Update replication mode for link to synchronous or asynchronous mode|
|Microsoft.Sql/servers/databases/replicationLinks/operationResults/read|Get status of long-running operations on database replication links|
|Microsoft.Sql/servers/databases/dataMaskingPolicies/read|Retrieve details of the data masking policy configured on a given database|
|Microsoft.Sql/servers/databases/dataMaskingPolicies/write|Change data masking policy for a given database|
|Microsoft.Sql/servers/databases/dataMaskingPolicies/rules/read|Retrieve details of the data masking policy rule configured on a given database|
|Microsoft.Sql/servers/databases/dataMaskingPolicies/rules/write|Change data masking policy rule for a given database|
|Microsoft.Sql/servers/databases/securityAlertPolicies/read|Retrieve details of the threat detection policy configured on a given database|
|Microsoft.Sql/servers/databases/securityAlertPolicies/write|Change the threat detection policy for a given database|
|Microsoft.Sql/servers/databases/providers/Microsoft.Insights/metricDefinitions/read|Return types of metrics that are available for databases|
|Microsoft.Sql/servers/databases/providers/Microsoft.Insights/diagnosticSettings/read|Gets the diagnostic setting for the resource|
|Microsoft.Sql/servers/databases/providers/Microsoft.Insights/diagnosticSettings/write|Creates or updates the diagnostic setting for the resource|
|Microsoft.Sql/servers/databases/providers/Microsoft.Insights/logDefinitions/read|Gets the available logs for databases|
|Microsoft.Sql/servers/databases/topQueries/read|Returns aggregated runtime statistics for selected query in selected time period|
|Microsoft.Sql/servers/databases/topQueries/queryText/read|Returns the Transact-SQL text for selected query ID|
|Microsoft.Sql/servers/databases/topQueries/statistics/read|Returns aggregated runtime statistics for selected query in selected time period|
|Microsoft.Sql/servers/databases/connectionPolicies/read|Retrieve details of the connection policy configured on a given database|
|Microsoft.Sql/servers/databases/connectionPolicies/write|Change connection policy for a given database|
|Microsoft.Sql/servers/databases/metrics/read|Return database resource utilization metrics|
|Microsoft.Sql/servers/databases/auditRecords/read|Retrieve the database blob audit records|
|Microsoft.Sql/servers/databases/transparentDataEncryption/read|Retrieve status and details of transparent data encryption security feature for a given database|
|Microsoft.Sql/servers/databases/transparentDataEncryption/write|Enable or disable transparent data encryption for a given database|
|Microsoft.Sql/servers/databases/transparentDataEncryption/operationResults/read|Retrieve status and details of transparent data encryption security feature for a given database|
|Microsoft.Sql/servers/databases/auditingPolicies/read|Retrieve details of the table auditing policy configured on a given database|
|Microsoft.Sql/servers/databases/auditingPolicies/write|Change the table auditing policy for a given database|
|Microsoft.Sql/servers/databases/dataWarehouseQueries/read|Returns the data warehouse distribution query information for selected query ID|
|Microsoft.Sql/servers/databases/dataWarehouseQueries/dataWarehouseQuerySteps/read|Returns the distributed query step information of data warehouse query for selected step ID|
|Microsoft.Sql/servers/databases/serviceTierAdvisors/read|Return suggestion about scaling database up or down based on query execution statistics to improve performance or reduce cost|
|Microsoft.Sql/servers/databases/advisors/read|Returns list of advisors available for the database|
|Microsoft.Sql/servers/databases/advisors/write|Update auto-execute status of an advisor on database level.|
|Microsoft.Sql/servers/databases/advisors/recommendedActions/read|Returns list of recommended actions of specified advisor for the database|
|Microsoft.Sql/servers/databases/advisors/recommendedActions/write|Apply the recommended action on the database|
|Microsoft.Sql/servers/databases/usages/read|Return database maxiumum size that can be reached and current size occupied by data|
|Microsoft.Sql/servers/databases/queryStore/read|Returns current values of Query Store settings for the database|
|Microsoft.Sql/servers/databases/queryStore/write|Updates Query Store setting for the database|
|Microsoft.Sql/servers/databases/auditingSettings/read|Retrieve details of the blob auditing policy configured on a given database|
|Microsoft.Sql/servers/databases/auditingSettings/write|Change the blob auditing policy for a given database|
|Microsoft.Sql/servers/databases/schemas/tables/recommendedIndexes/read|Retrieve list of index recommendations on a database|
|Microsoft.Sql/servers/databases/schemas/tables/recommendedIndexes/write|Apply index recommendation|
|Microsoft.Sql/servers/databases/schemas/tables/columns/read|Retrieve list of columns of a table|
|Microsoft.Sql/servers/databases/missingindexes/read|Return suggestions about database indexes to create, modify or delete in order to improve query performance|
|Microsoft.Sql/servers/databases/missingindexes/write|Use database index recommendation in a particular database|
|Microsoft.Sql/servers/databases/importExportOperationResults/read|Return details about database import or export operation from DacPac located in storage account|
|Microsoft.Sql/servers/importExportOperationResults/read|Return the list with details for database import operations from storage account on a given server|

## Microsoft.Storage

| Operation | Description |
|---|---|
|Microsoft.Storage/register/action|Registers the subscription for the storage resource provider and enables the creation of storage accounts.|
|Microsoft.Storage/checknameavailability/read|Checks that account name is valid and is not in use.|
|Microsoft.Storage/storageAccounts/write|Creates a storage account with the specified parameters or update the properties or tags or adds custom domain for the specified storage account.|
|Microsoft.Storage/storageAccounts/delete|Deletes an existing storage account.|
|Microsoft.Storage/storageAccounts/listkeys/action|Returns the access keys for the specified storage account.|
|Microsoft.Storage/storageAccounts/regeneratekey/action|Regenerates the access keys for the specified storage account.|
|Microsoft.Storage/storageAccounts/read|Returns the list of storage accounts or gets the properties for the specified storage account.|
|Microsoft.Storage/storageAccounts/listAccountSas/action|Returns the Account SAS token for the specified storage account.|
|Microsoft.Storage/storageAccounts/listServiceSas/action|Storage Service SAS Token|
|Microsoft.Storage/storageAccounts/services/diagnosticSettings/write|Create/Update storage account diagnostic settings.|
|Microsoft.Storage/skus/read|Lists the Skus supported by Microsoft.Storage.|
|Microsoft.Storage/usages/read|Returns the limit and the current usage count for resources in the specified subscription|
|Microsoft.Storage/operations/read|Polls the status of an asynchronous operation.|
|Microsoft.Storage/locations/deleteVirtualNetworkOrSubnets/action|Notifies Microsoft.Storage that virtual network or subnet is being deleted|

## Microsoft.StorSimple

| Operation | Description |
|---|---|
|Microsoft.StorSimple/managers/clearAlerts/action|Clear all the alerts associated with the device manager.|
|Microsoft.StorSimple/managers/getActivationKey/action|Get activation key for the device manager.|
|Microsoft.StorSimple/managers/regenerateActivationKey/action|Regenerate activation key for the device manager.|
|Microsoft.StorSimple/managers/regenarateRegistationCertificate/action|Regenerate registration certificate for the device managers.|
|Microsoft.StorSimple/managers/getEncryptionKey/action|Get encryption key for the device manager.|
|Microsoft.StorSimple/managers/read|Lists or gets the Device Managers|
|Microsoft.StorSimple/managers/delete|Deletes the Device Managers|
|Microsoft.StorSimple/managers/write|Create or update the Device Managers|
|Microsoft.StorSimple/managers/configureDevice/action|Configures a device|
|Microsoft.StorSimple/managers/listActivationKey/action|Gets the activation key of the StorSimple Device Manager.|
|Microsoft.StorSimple/managers/listPublicEncryptionKey/action|List public encryption keys of a StorSimple Device Manager.|
|Microsoft.StorSimple/managers/listPrivateEncryptionKey/action|Gets private encryption key for a StorSimple Device Manager.|
|Microsoft.StorSimple/managers/provisionCloudAppliance/action|Create a new cloud appliance.|
|Microsoft.StorSimple/Managers/write|Create Vault operation creates an Azure resource of type 'vault'|
|Microsoft.StorSimple/Managers/read|The Get Vault operation gets an object representing the Azure resource of type 'vault'|
|Microsoft.StorSimple/Managers/delete|The Delete Vault operation deletes the specified Azure resource of type 'vault'|
|Microsoft.StorSimple/managers/storageAccountCredentials/write|Create or update the Storage Account Credentials|
|Microsoft.StorSimple/managers/storageAccountCredentials/read|Lists or gets the Storage Account Credentials|
|Microsoft.StorSimple/managers/storageAccountCredentials/delete|Deletes the Storage Account Credentials|
|Microsoft.StorSimple/managers/storageAccountCredentials/listAccessKey/action|List access keys of Storage Account Credentials|
|Microsoft.StorSimple/managers/accessControlRecords/read|Lists or gets the Access Control Records|
|Microsoft.StorSimple/managers/accessControlRecords/write|Create or update the Access Control Records|
|Microsoft.StorSimple/managers/accessControlRecords/delete|Deletes the Access Control Records|
|Microsoft.StorSimple/managers/metrics/read|Lists or gets the Metrics|
|Microsoft.StorSimple/managers/bandwidthSettings/read|List the Bandwidth Settings (8000 Series Only)|
|Microsoft.StorSimple/managers/bandwidthSettings/write|Creates a new or updates Bandwidth Settings (8000 Series Only)|
|Microsoft.StorSimple/managers/bandwidthSettings/delete|Deletes an existing Bandwidth Settings (8000 Series Only)|
|Microsoft.StorSimple/Managers/extendedInformation/read|The Get Extended Info operation gets an object's Extended Info representing the Azure resource of type ?vault?|
|Microsoft.StorSimple/Managers/extendedInformation/write|The Get Extended Info operation gets an object's Extended Info representing the Azure resource of type ?vault?|
|Microsoft.StorSimple/Managers/extendedInformation/delete|The Get Extended Info operation gets an object's Extended Info representing the Azure resource of type ?vault?|
|Microsoft.StorSimple/managers/alerts/read|Lists or gets the Alerts|
|Microsoft.StorSimple/managers/storageDomains/read|Lists or gets the Storage Domains|
|Microsoft.StorSimple/managers/storageDomains/write|Create or update the Storage Domains|
|Microsoft.StorSimple/managers/storageDomains/delete|Deletes the Storage Domains|
|Microsoft.StorSimple/managers/devices/scanForUpdates/action|Scan for updates in a device.|
|Microsoft.StorSimple/managers/devices/download/action|Dowload updates for a device.|
|Microsoft.StorSimple/managers/devices/install/action|Install updates on a device.|
|Microsoft.StorSimple/managers/devices/read|Lists or gets the Devices|
|Microsoft.StorSimple/managers/devices/write|Create or update the Devices|
|Microsoft.StorSimple/managers/devices/delete|Deletes the Devices|
|Microsoft.StorSimple/managers/devices/deactivate/action|Deactivates a device.|
|Microsoft.StorSimple/managers/devices/publishSupportPackage/action|Publish support package of a device for Microsoft Support troubleshooting.|
|Microsoft.StorSimple/managers/devices/failover/action|Failover of the device.|
|Microsoft.StorSimple/managers/devices/sendTestAlertEmail/action|Send test alert email to configured email recipients.|
|Microsoft.StorSimple/managers/devices/installUpdates/action|Installs updates on the devices|
|Microsoft.StorSimple/managers/devices/listFailoverSets/action|List the failover sets for an existing device.|
|Microsoft.StorSimple/managers/devices/listFailoverTargets/action|List failover targets of the devices|
|Microsoft.StorSimple/managers/devices/publicEncryptionKey/action|List public encryption key of the device manager|
|Microsoft.StorSimple/managers/devices/hardwareComponentGroups/read|List the Hardware Component Groups|
|Microsoft.StorSimple/managers/devices/hardwareComponentGroups/changeControllerPowerState/action|Change controller power state of hardware component groups|
|Microsoft.StorSimple/managers/devices/metrics/read|Lists or gets the Metrics|
|Microsoft.StorSimple/managers/devices/chapSettings/write|Create or update the Chap Settings|
|Microsoft.StorSimple/managers/devices/chapSettings/read|Lists or gets the Chap Settings|
|Microsoft.StorSimple/managers/devices/chapSettings/delete|Deletes the Chap Settings|
|Microsoft.StorSimple/managers/devices/backupScheduleGroups/read|Lists or gets the Backup Schedule Groups|
|Microsoft.StorSimple/managers/devices/backupScheduleGroups/write|Create or update the Backup Schedule Groups|
|Microsoft.StorSimple/managers/devices/backupScheduleGroups/delete|Deletes the Backup Schedule Groups|
|Microsoft.StorSimple/managers/devices/updateSummary/read|Lists or gets the Update Summary|
|Microsoft.StorSimple/managers/devices/migrationSourceConfigurations/import/action|Import source configurations for migration|
|Microsoft.StorSimple/managers/devices/migrationSourceConfigurations/startMigrationEstimate/action|Start a job to estimate the duration of the migration process.|
|Microsoft.StorSimple/managers/devices/migrationSourceConfigurations/startMigration/action|Start migration using source configurations|
|Microsoft.StorSimple/managers/devices/migrationSourceConfigurations/confirmMigration/action|Confirms a successful migration and commit it.|
|Microsoft.StorSimple/managers/devices/migrationSourceConfigurations/fetchMigrationEstimate/action|Fetch the status for the migration estimation job.|
|Microsoft.StorSimple/managers/devices/migrationSourceConfigurations/fetchMigrationStatus/action|Fetch the status for the migration.|
|Microsoft.StorSimple/managers/devices/migrationSourceConfigurations/fetchConfirmMigrationStatus/action|Fetch the confirm status of migration.|
|Microsoft.StorSimple/managers/devices/alertSettings/read|Lists or gets the Alert Settings|
|Microsoft.StorSimple/managers/devices/alertSettings/write|Create or update the Alert Settings|
|Microsoft.StorSimple/managers/devices/networkSettings/read|Lists or gets the Network Settings|
|Microsoft.StorSimple/managers/devices/networkSettings/write|Creates a new or updates Network Settings|
|Microsoft.StorSimple/managers/devices/jobs/read|Lists or gets the Jobs|
|Microsoft.StorSimple/managers/devices/jobs/cancel/action|Cancel a running job|
|Microsoft.StorSimple/managers/devices/metricsDefinitions/read|Lists or gets the Metrics Definitions|
|Microsoft.StorSimple/managers/devices/volumeContainers/write|Creates a new or updates Volume Containers (8000 Series Only)|
|Microsoft.StorSimple/managers/devices/volumeContainers/read|List the Volume Containers (8000 Series Only)|
|Microsoft.StorSimple/managers/devices/volumeContainers/delete|Deletes an existing Volume Containers (8000 Series Only)|
|Microsoft.StorSimple/managers/devices/volumeContainers/listEncryptionKeys/action|List encryption keys of Volume Containers|
|Microsoft.StorSimple/managers/devices/volumeContainers/rolloverEncryptionKey/action|Rollover encryption keys of Volume Containers|
|Microsoft.StorSimple/managers/devices/volumeContainers/metrics/read|List the Metrics|
|Microsoft.StorSimple/managers/devices/volumeContainers/volumes/read|List the Volumes|
|Microsoft.StorSimple/managers/devices/volumeContainers/volumes/write|Creates a new or updates Volumes|
|Microsoft.StorSimple/managers/devices/volumeContainers/volumes/delete|Deletes an existing Volumes|
|Microsoft.StorSimple/managers/devices/volumeContainers/volumes/metrics/read|List the Metrics|
|Microsoft.StorSimple/managers/devices/volumeContainers/volumes/metricsDefinitions/read|List the Metrics Definitions|
|Microsoft.StorSimple/managers/devices/volumeContainers/metricsDefinitions/read|List the Metrics Definitions|
|Microsoft.StorSimple/managers/devices/iscsiservers/read|Lists or gets the iSCSI Servers|
|Microsoft.StorSimple/managers/devices/iscsiservers/write|Create or update the iSCSI Servers|
|Microsoft.StorSimple/managers/devices/iscsiservers/delete|Deletes the iSCSI Servers|
|Microsoft.StorSimple/managers/devices/iscsiservers/backup/action|Take backup of an iSCSI server.|
|Microsoft.StorSimple/managers/devices/iscsiservers/metrics/read|Lists or gets the Metrics|
|Microsoft.StorSimple/managers/devices/iscsiservers/disks/read|Lists or gets the Disks|
|Microsoft.StorSimple/managers/devices/iscsiservers/disks/write|Create or update the Disks|
|Microsoft.StorSimple/managers/devices/iscsiservers/disks/delete|Deletes the Disks|
|Microsoft.StorSimple/managers/devices/iscsiservers/disks/metrics/read|Lists or gets the Metrics|
|Microsoft.StorSimple/managers/devices/iscsiservers/disks/metricsDefinitions/read|Lists or gets the Metrics Definitions|
|Microsoft.StorSimple/managers/devices/iscsiservers/metricsDefinitions/read|Lists or gets the Metrics Definitions|
|Microsoft.StorSimple/managers/devices/backups/read|Lists or gets the Backup Set|
|Microsoft.StorSimple/managers/devices/backups/delete|Deletes the Backup Set|
|Microsoft.StorSimple/managers/devices/backups/restore/action|Restore all the volumes from a backup set.|
|Microsoft.StorSimple/managers/devices/backups/elements/clone/action|Clone a share or volume using a backup element.|
|Microsoft.StorSimple/managers/devices/backupPolicies/write|Creates a new or updates Backup Polices (8000 Series Only)|
|Microsoft.StorSimple/managers/devices/backupPolicies/read|List the Backup Polices (8000 Series Only)|
|Microsoft.StorSimple/managers/devices/backupPolicies/delete|Deletes an existing Backup Polices (8000 Series Only)|
|Microsoft.StorSimple/managers/devices/backupPolicies/backup/action|Take a manual backup to create an on-demand backup of all the volumes protected by the policy.|
|Microsoft.StorSimple/managers/devices/backupPolicies/schedules/write|Creates a new or updates Schedules|
|Microsoft.StorSimple/managers/devices/backupPolicies/schedules/read|List the Schedules|
|Microsoft.StorSimple/managers/devices/backupPolicies/schedules/delete|Deletes an existing Schedules|
|Microsoft.StorSimple/managers/devices/securitySettings/update/action|Update the security settings.|
|Microsoft.StorSimple/managers/devices/securitySettings/read|List the Security Settings|
|Microsoft.StorSimple/managers/devices/securitySettings/syncRemoteManagementCertificate/action|Synchronize the remote management certificate for a device.|
|Microsoft.StorSimple/managers/devices/securitySettings/write|Creates a new or updates Security Settings|
|Microsoft.StorSimple/managers/devices/fileservers/read|Lists or gets the File Servers|
|Microsoft.StorSimple/managers/devices/fileservers/write|Create or update the File Servers|
|Microsoft.StorSimple/managers/devices/fileservers/delete|Deletes the File Servers|
|Microsoft.StorSimple/managers/devices/fileservers/backup/action|Take backup of an File Server.|
|Microsoft.StorSimple/managers/devices/fileservers/metrics/read|Lists or gets the Metrics|
|Microsoft.StorSimple/managers/devices/fileservers/shares/write|Create or update the Shares|
|Microsoft.StorSimple/managers/devices/fileservers/shares/read|Lists or gets the Shares|
|Microsoft.StorSimple/managers/devices/fileservers/shares/delete|Deletes the Shares|
|Microsoft.StorSimple/managers/devices/fileservers/shares/metrics/read|Lists or gets the Metrics|
|Microsoft.StorSimple/managers/devices/fileservers/shares/metricsDefinitions/read|Lists or gets the Metrics Definitions|
|Microsoft.StorSimple/managers/devices/fileservers/metricsDefinitions/read|Lists or gets the Metrics Definitions|
|Microsoft.StorSimple/managers/devices/timeSettings/read|Lists or gets the Time Settings|
|Microsoft.StorSimple/managers/devices/timeSettings/write|Creates a new or updates Time Settings|
|Microsoft.StorSimple/Managers/certificates/write|The Update Resource Certificate operation updates the resource/vault credential certificate.|
|Microsoft.StorSimple/managers/cloudApplianceConfigurations/read|List the Cloud Appliance Supported Configurations|
|Microsoft.StorSimple/managers/metricsDefinitions/read|Lists or gets the Metrics Definitions|
|Microsoft.StorSimple/managers/encryptionSettings/read|Lists or gets the Encryption Settings|

## Microsoft.StreamAnalytics

| Operation | Description |
|---|---|
|Microsoft.StreamAnalytics/streamingjobs/Start/action|Start Stream Analytics Job|
|Microsoft.StreamAnalytics/streamingjobs/Stop/action|Stop Stream Analytics Job|
|Microsoft.StreamAnalytics/streamingjobs/Read|Read Stream Analytics Job|
|Microsoft.StreamAnalytics/streamingjobs/Write|Write Stream Analytics Job|
|Microsoft.StreamAnalytics/streamingjobs/Delete|Delete Stream Analytics Job|
|Microsoft.StreamAnalytics/streamingjobs/providers/Microsoft.Insights/metricDefinitions/read|Gets the available metrics for streamingjobs|
|Microsoft.StreamAnalytics/streamingjobs/providers/Microsoft.Insights/diagnosticSettings/read|Read diagnostic setting.|
|Microsoft.StreamAnalytics/streamingjobs/providers/Microsoft.Insights/diagnosticSettings/write|Write diagnostic setting.|
|Microsoft.StreamAnalytics/streamingjobs/providers/Microsoft.Insights/logDefinitions/read|Gets the available logs for streamingjobs|
|Microsoft.StreamAnalytics/streamingjobs/transformations/Read|Read Stream Analytics Job Transformation|
|Microsoft.StreamAnalytics/streamingjobs/transformations/Write|Write Stream Analytics Job Transformation|
|Microsoft.StreamAnalytics/streamingjobs/transformations/Delete|Delete Stream Analytics Job Transformation|
|Microsoft.StreamAnalytics/streamingjobs/inputs/Read|Read Stream Analytics Job Input|
|Microsoft.StreamAnalytics/streamingjobs/inputs/Write|Write Stream Analytics Job Input|
|Microsoft.StreamAnalytics/streamingjobs/inputs/Delete|Delete Stream Analytics Job Input|
|Microsoft.StreamAnalytics/streamingjobs/outputs/Read|Read Stream Analytics Job Output|
|Microsoft.StreamAnalytics/streamingjobs/outputs/Write|Write Stream Analytics Job Output|
|Microsoft.StreamAnalytics/streamingjobs/outputs/Delete|Delete Stream Analytics Job Output|

## Microsoft.Support

| Operation | Description |
|---|---|
|Microsoft.Support/register/action|Registers to Support Resource Provider|
|Microsoft.Support/supportTickets/read|Gets Support Ticket details (including status, severity, contact details and communications) or gets the list of Support Tickets across subscriptions.|
|Microsoft.Support/supportTickets/write|Creates or Updates a Support Ticket. You can create a Support Ticket for Technical, Billing, Quotas or Subscription Management related issues. You can update severity, contact details and communications for existing support tickets.|

## Microsoft.Web

| Operation | Description |
|---|---|
|microsoft.web/unregister/action|Unregister Microsoft.Web resource provider for the subscription.|
|microsoft.web/validate/action|Validate .|
|microsoft.web/register/action|Register Microsoft.Web resource provider for the subscription.|
|Microsoft.Web/hostingEnvironments/Read|Get the properties of an App Service Environment|
|Microsoft.Web/hostingEnvironments/Write|Create a new App Service Environment or update existing one|
|Microsoft.Web/hostingEnvironments/Delete|Delete an App Service Environment|
|Microsoft.Web/hostingEnvironments/reboot/Action|Reboot all machines in an App Service Environment|
|microsoft.web/hostingenvironments/resume/action|Resume Hosting Environments.|
|microsoft.web/hostingenvironments/suspend/action|Suspend Hosting Environments.|
|microsoft.web/hostingenvironments/metricdefinitions/read|Get Hosting Environments Metric Definitions.|
|Microsoft.Web/hostingEnvironments/workerPools/Read|Get the properties of a Worker Pool in an App Service Environment|
|Microsoft.Web/hostingEnvironments/workerPools/Write|Create a new Worker Pool in an App Service Environment or update an existing one|
|microsoft.web/hostingenvironments/workerpools/metricdefinitions/read|Get Hosting Environments Workerpools Metric Definitions.|
|microsoft.web/hostingenvironments/workerpools/metrics/read|Get Hosting Environments Workerpools Metrics.|
|microsoft.web/hostingenvironments/workerpools/skus/read|Get Hosting Environments Workerpools SKUs.|
|microsoft.web/hostingenvironments/workerpools/usages/read|Get Hosting Environments Workerpools Usages.|
|microsoft.web/hostingenvironments/sites/read|Get Hosting Environments Web Apps.|
|microsoft.web/hostingenvironments/serverfarms/read|Get Hosting Environments App Service Plans.|
|microsoft.web/hostingenvironments/usages/read|Get Hosting Environments Usages.|
|microsoft.web/hostingenvironments/capacities/read|Get Hosting Environments Capacities.|
|microsoft.web/hostingenvironments/operations/read|Get Hosting Environments Operations.|
|Microsoft.Web/hostingEnvironments/multiRolePools/Read|Get the properties of a FrontEnd Pool in an App Service Environment|
|Microsoft.Web/hostingEnvironments/multiRolePools/Write|Create a new FrontEnd Pool in an App Service Environment or update an existing one|
|microsoft.web/hostingenvironments/multirolepools/metricdefinitions/read|Get Hosting Environments MultiRole Pools Metric Definitions.|
|microsoft.web/hostingenvironments/multirolepools/metrics/read|Get Hosting Environments MultiRole Pools Metrics.|
|microsoft.web/hostingenvironments/multirolepools/skus/read|Get Hosting Environments MultiRole Pools SKUs.|
|microsoft.web/hostingenvironments/multirolepools/usages/read|Get Hosting Environments MultiRole Pools Usages.|
|microsoft.web/hostingenvironments/diagnostics/read|Get Hosting Environments Diagnostics.|
|microsoft.web/publishingusers/read|Get Publishing Users.|
|microsoft.web/publishingusers/write|Update Publishing Users.|
|microsoft.web/checknameavailability/read|Check if resource name is available.|
|Microsoft.Web/geoRegions/Read|Get the list of Geo regions.|
|Microsoft.Web/sites/Read|Get the properties of a Web App|
|Microsoft.Web/sites/Write|Create a new Web App or update an existing one|
|Microsoft.Web/sites/Delete|Delete an existing Web App|
|Microsoft.Web/sites/backup/Action|Create a new web app backup|
|Microsoft.Web/sites/publishxml/Action|Get publishing profile xml for a Web App|
|Microsoft.Web/sites/publish/Action|Publish a Web App|
|Microsoft.Web/sites/restart/Action|Restart a Web App|
|Microsoft.Web/sites/start/Action|Start a Web App|
|Microsoft.Web/sites/stop/Action|Stop a Web App|
|Microsoft.Web/sites/slotsswap/Action|Swap Web App deployment slots|
|Microsoft.Web/sites/slotsdiffs/Action|Get differences in configuration between web app and slots|
|Microsoft.Web/sites/applySlotConfig/Action|Apply web app slot configuration from target slot to the current web app|
|Microsoft.Web/sites/resetSlotConfig/Action|Reset web app configuration|
|microsoft.web/sites/functions/action|Functions Web Apps.|
|microsoft.web/sites/listsyncfunctiontriggerstatus/action|List Sync Function Trigger Status Web Apps.|
|microsoft.web/sites/networktrace/action|Network Trace Web Apps.|
|microsoft.web/sites/newpassword/action|Newpassword Web Apps.|
|microsoft.web/sites/sync/action|Sync Web Apps.|
|microsoft.web/sites/operationresults/read|Get Web Apps Operation Results.|
|microsoft.web/sites/webjobs/read|Get Web Apps WebJobs.|
|microsoft.web/sites/backup/read|Get Web Apps Backup.|
|microsoft.web/sites/backup/write|Update Web Apps Backup.|
|microsoft.web/sites/metricdefinitions/read|Get Web Apps Metric Definitions.|
|microsoft.web/sites/metrics/read|Get Web Apps Metrics.|
|microsoft.web/sites/continuouswebjobs/delete|Delete Web Apps Continuous Web Jobs.|
|microsoft.web/sites/continuouswebjobs/read|Get Web Apps Continuous Web Jobs.|
|microsoft.web/sites/continuouswebjobs/start/action|Start Web Apps Continuous Web Jobs.|
|microsoft.web/sites/continuouswebjobs/stop/action|Stop Web Apps Continuous Web Jobs.|
|microsoft.web/sites/domainownershipidentifiers/read|Get Web Apps Domain Ownership Identifiers.|
|microsoft.web/sites/domainownershipidentifiers/write|Update Web Apps Domain Ownership Identifiers.|
|microsoft.web/sites/premieraddons/delete|Delete Web Apps Premier Addons.|
|microsoft.web/sites/premieraddons/read|Get Web Apps Premier Addons.|
|microsoft.web/sites/premieraddons/write|Update Web Apps Premier Addons.|
|microsoft.web/sites/triggeredwebjobs/delete|Delete Web Apps Triggered WebJobs.|
|microsoft.web/sites/triggeredwebjobs/read|Get Web Apps Triggered WebJobs.|
|microsoft.web/sites/triggeredwebjobs/run/action|Run Web Apps Triggered WebJobs.|
|microsoft.web/sites/hostnamebindings/delete|Delete Web Apps Hostname Bindings.|
|microsoft.web/sites/hostnamebindings/read|Get Web Apps Hostname Bindings.|
|microsoft.web/sites/hostnamebindings/write|Update Web Apps Hostname Bindings.|
|microsoft.web/sites/virtualnetworkconnections/delete|Delete Web Apps Virtual Network Connections.|
|microsoft.web/sites/virtualnetworkconnections/read|Get Web Apps Virtual Network Connections.|
|microsoft.web/sites/virtualnetworkconnections/write|Update Web Apps Virtual Network Connections.|
|microsoft.web/sites/virtualnetworkconnections/gateways/read|Get Web Apps Virtual Network Connections Gateways.|
|microsoft.web/sites/virtualnetworkconnections/gateways/write|Update Web Apps Virtual Network Connections Gateways.|
|microsoft.web/sites/publishxml/read|Get Web Apps Publishing XML.|
|microsoft.web/sites/hybridconnectionrelays/read|Get Web Apps Hybrid Connection Relays.|
|microsoft.web/sites/perfcounters/read|Get Web Apps Performance Counters.|
|microsoft.web/sites/usages/read|Get Web Apps Usages.|
|Microsoft.Web/sites/slots/Write|Create a new Web App Slot or update an existing one|
|Microsoft.Web/sites/slots/Delete|Delete an existing Web App Slot|
|Microsoft.Web/sites/slots/backup/Action|Create new Web App Slot backup.|
|Microsoft.Web/sites/slots/publishxml/Action|Get publishing profile xml for Web App Slot|
|Microsoft.Web/sites/slots/publish/Action|Publish a Web App Slot|
|Microsoft.Web/sites/slots/restart/Action|Restart a Web App Slot|
|Microsoft.Web/sites/slots/start/Action|Start a Web App Slot|
|Microsoft.Web/sites/slots/stop/Action|Stop a Web App Slot|
|Microsoft.Web/sites/slots/slotsswap/Action|Swap Web App deployment slots|
|Microsoft.Web/sites/slots/slotsdiffs/Action|Get differences in configuration between web app and slots|
|Microsoft.Web/sites/slots/applySlotConfig/Action|Apply web app slot configuration from target slot to the current slot.|
|Microsoft.Web/sites/slots/resetSlotConfig/Action|Reset web app slot configuration|
|Microsoft.Web/sites/slots/Read|Get the properties of a Web App deployment slot|
|microsoft.web/sites/slots/newpassword/action|Newpassword Web Apps Slots.|
|microsoft.web/sites/slots/sync/action|Sync Web Apps Slots.|
|microsoft.web/sites/slots/operationresults/read|Get Web Apps Slots Operation Results.|
|microsoft.web/sites/slots/webjobs/read|Get Web Apps Slots WebJobs.|
|microsoft.web/sites/slots/backup/write|Update Web Apps Slots Backup.|
|microsoft.web/sites/slots/metricdefinitions/read|Get Web Apps Slots Metric Definitions.|
|microsoft.web/sites/slots/metrics/read|Get Web Apps Slots Metrics.|
|microsoft.web/sites/slots/continuouswebjobs/delete|Delete Web Apps Slots Continuous Web Jobs.|
|microsoft.web/sites/slots/continuouswebjobs/read|Get Web Apps Slots Continuous Web Jobs.|
|microsoft.web/sites/slots/continuouswebjobs/start/action|Start Web Apps Slots Continuous Web Jobs.|
|microsoft.web/sites/slots/continuouswebjobs/stop/action|Stop Web Apps Slots Continuous Web Jobs.|
|microsoft.web/sites/slots/premieraddons/delete|Delete Web Apps Slots Premier Addons.|
|microsoft.web/sites/slots/premieraddons/read|Get Web Apps Slots Premier Addons.|
|microsoft.web/sites/slots/premieraddons/write|Update Web Apps Slots Premier Addons.|
|microsoft.web/sites/slots/triggeredwebjobs/delete|Delete Web Apps Slots Triggered WebJobs.|
|microsoft.web/sites/slots/triggeredwebjobs/read|Get Web Apps Slots Triggered WebJobs.|
|microsoft.web/sites/slots/triggeredwebjobs/run/action|Run Web Apps Slots Triggered WebJobs.|
|microsoft.web/sites/slots/hostnamebindings/delete|Delete Web Apps Slots Hostname Bindings.|
|microsoft.web/sites/slots/hostnamebindings/read|Get Web Apps Slots Hostname Bindings.|
|microsoft.web/sites/slots/hostnamebindings/write|Update Web Apps Slots Hostname Bindings.|
|microsoft.web/sites/slots/phplogging/read|Get Web Apps Slots Phplogging.|
|microsoft.web/sites/slots/virtualnetworkconnections/delete|Delete Web Apps Slots Virtual Network Connections.|
|microsoft.web/sites/slots/virtualnetworkconnections/read|Get Web Apps Slots Virtual Network Connections.|
|microsoft.web/sites/slots/virtualnetworkconnections/write|Update Web Apps Slots Virtual Network Connections.|
|microsoft.web/sites/slots/virtualnetworkconnections/gateways/write|Update Web Apps Slots Virtual Network Connections Gateways.|
|microsoft.web/sites/slots/usages/read|Get Web Apps Slots Usages.|
|microsoft.web/sites/slots/hybridconnection/delete|Delete Web Apps Slots Hybrid Connection.|
|microsoft.web/sites/slots/hybridconnection/read|Get Web Apps Slots Hybrid Connection.|
|microsoft.web/sites/slots/hybridconnection/write|Update Web Apps Slots Hybrid Connection.|
|Microsoft.Web/sites/slots/config/Read|Get Web App Slot's configuration settings|
|Microsoft.Web/sites/slots/config/list/Action|List Web App Slot's security sensitive settings, such as publishing credentials, app settings and connection strings|
|Microsoft.Web/sites/slots/config/Write|Update Web App Slot's configuration settings|
|microsoft.web/sites/slots/config/delete|Delete Web Apps Slots Config.|
|microsoft.web/sites/slots/instances/read|Get Web Apps Slots Instances.|
|microsoft.web/sites/slots/instances/processes/read|Get Web Apps Slots Instances Processes.|
|microsoft.web/sites/slots/instances/deployments/read|Get Web Apps Slots Instances Deployments.|
|Microsoft.Web/sites/slots/sourcecontrols/Read|Get Web App Slot's source control configuration settings|
|Microsoft.Web/sites/slots/sourcecontrols/Write|Update Web App Slot's source control configuration settings|
|Microsoft.Web/sites/slots/sourcecontrols/Delete|Delete Web App Slot's source control configuration settings|
|microsoft.web/sites/slots/restore/read|Get Web Apps Slots Restore.|
|microsoft.web/sites/slots/analyzecustomhostname/read|Get Web Apps Slots Analyze Custom Hostname.|
|Microsoft.Web/sites/slots/backups/Read|Get the properties of a web app slots' backup|
|microsoft.web/sites/slots/backups/list/action|List Web Apps Slots Backups.|
|microsoft.web/sites/slots/backups/restore/action|Restore Web Apps Slots Backups.|
|microsoft.web/sites/slots/deployments/delete|Delete Web Apps Slots Deployments.|
|microsoft.web/sites/slots/deployments/read|Get Web Apps Slots Deployments.|
|microsoft.web/sites/slots/deployments/write|Update Web Apps Slots Deployments.|
|microsoft.web/sites/slots/deployments/log/read|Get Web Apps Slots Deployments Log.|
|microsoft.web/sites/hybridconnection/delete|Delete Web Apps Hybrid Connection.|
|microsoft.web/sites/hybridconnection/read|Get Web Apps Hybrid Connection.|
|microsoft.web/sites/hybridconnection/write|Update Web Apps Hybrid Connection.|
|microsoft.web/sites/recommendationhistory/read|Get Web Apps Recommendation History.|
|Microsoft.Web/sites/recommendations/Read|Get the list of recommendations for web app.|
|microsoft.web/sites/recommendations/disable/action|Disable Web Apps Recommendations.|
|Microsoft.Web/sites/config/Read|Get Web App configuration settings|
|Microsoft.Web/sites/config/list/Action|List Web App's security sensitive settings, such as publishing credentials, app settings and connection strings|
|Microsoft.Web/sites/config/Write|Update Web App's configuration settings|
|microsoft.web/sites/config/delete|Delete Web Apps Config.|
|microsoft.web/sites/instances/read|Get Web Apps Instances.|
|microsoft.web/sites/instances/processes/delete|Delete Web Apps Instances Processes.|
|microsoft.web/sites/instances/processes/read|Get Web Apps Instances Processes.|
|microsoft.web/sites/instances/deployments/read|Get Web Apps Instances Deployments.|
|Microsoft.Web/sites/sourcecontrols/Read|Get Web App's source control configuration settings|
|Microsoft.Web/sites/sourcecontrols/Write|Update Web App's source control configuration settings|
|Microsoft.Web/sites/sourcecontrols/Delete|Delete Web App's source control configuration settings|
|microsoft.web/sites/restore/read|Get Web Apps Restore.|
|microsoft.web/sites/analyzecustomhostname/read|Analyze Custom Hostname.|
|Microsoft.Web/sites/backups/Read|Get the properties of a web app's backup|
|microsoft.web/sites/backups/list/action|List Web Apps Backups.|
|microsoft.web/sites/backups/restore/action|Restore Web Apps Backups.|
|microsoft.web/sites/snapshots/read|Get Web Apps Snapshots.|
|microsoft.web/sites/functions/delete|Delete Web Apps Functions.|
|microsoft.web/sites/functions/listsecrets/action|List Secrets Web Apps Functions.|
|microsoft.web/sites/functions/read|Get Web Apps Functions.|
|microsoft.web/sites/functions/write|Update Web Apps Functions.|
|microsoft.web/sites/deployments/delete|Delete Web Apps Deployments.|
|microsoft.web/sites/deployments/read|Get Web Apps Deployments.|
|microsoft.web/sites/deployments/write|Update Web Apps Deployments.|
|microsoft.web/sites/deployments/log/read|Get Web Apps Deployments Log.|
|microsoft.web/sites/diagnostics/read|Get Web Apps Diagnostics.|
|microsoft.web/sites/diagnostics/workerprocessrecycle/read|Get Web Apps Diagnostics Worker Process Recycle.|
|microsoft.web/sites/diagnostics/workeravailability/read|Get Web Apps Diagnostics Workeravailability.|
|microsoft.web/sites/diagnostics/runtimeavailability/read|Get Web Apps Diagnostics Runtime Availability.|
|microsoft.web/sites/diagnostics/cpuanalysis/read|Get Web Apps Diagnostics Cpuanalysis.|
|microsoft.web/sites/diagnostics/servicehealth/read|Get Web Apps Diagnostics Service Health.|
|microsoft.web/sites/diagnostics/frebanalysis/read|Get Web Apps Diagnostics FREB Analysis.|
|microsoft.web/availablestacks/read|Get Available Stacks.|
|microsoft.web/isusernameavailable/read|Check if Username is available.|
|Microsoft.Web/Microsoft.Web/apiManagementAccounts/apis/Read|Get the list of Apis.|
|Microsoft.Web/Microsoft.Web/apiManagementAccounts/apis/Write|Add a new Api or update existing one.|
|Microsoft.Web/Microsoft.Web/apiManagementAccounts/apis/Delete|Delete an existing Api.|
|Microsoft.Web/Microsoft.Web/apiManagementAccounts/apis/connections/Read|Get the list of Connections.|
|Microsoft.Web/Microsoft.Web/apiManagementAccounts/apis/connections/Write|Save a new Connection or update an existing one.|
|Microsoft.Web/Microsoft.Web/apiManagementAccounts/apis/connections/Delete|Delete an existing Connection.|
|Microsoft.Web/Microsoft.Web/apiManagementAccounts/apis/connections/connectionAcls/Read|Read ConnectionAcls|
|Microsoft.Web/Microsoft.Web/apiManagementAccounts/apis/connections/connectionAcls/Write|Add or update ConnectionAcl|
|Microsoft.Web/Microsoft.Web/apiManagementAccounts/apis/connections/connectionAcls/Delete|Delete ConnectionAcl|
|Microsoft.Web/Microsoft.Web/apiManagementAccounts/apis/connectionAcls/Read|Read ConnectionAcls for Api|
|Microsoft.Web/Microsoft.Web/apiManagementAccounts/apis/apiAcls/Read|Read ConnectionAcls|
|Microsoft.Web/Microsoft.Web/apiManagementAccounts/apis/apiAcls/Write|Create or update Api Acls|
|Microsoft.Web/Microsoft.Web/apiManagementAccounts/apis/apiAcls/Delete|Delete Api Acls|
|Microsoft.Web/serverfarms/Read|Get the properties on an App Service Plan|
|Microsoft.Web/serverfarms/Write|Create a new App Service Plan or update an existing one|
|Microsoft.Web/serverfarms/Delete|Delete an existing App Service Plan|
|Microsoft.Web/serverfarms/restartSites/Action|Restart all Web Apps in an App Service Plan|
|microsoft.web/serverfarms/operationresults/read|Get App Service Plans Operation Results.|
|microsoft.web/serverfarms/capabilities/read|Get App Service Plans Capabilities.|
|microsoft.web/serverfarms/metricdefinitions/read|Get App Service Plans Metric Definitions.|
|microsoft.web/serverfarms/metrics/read|Get App Service Plans Metrics.|
|microsoft.web/serverfarms/hybridconnectionplanlimits/read|Get App Service Plans Hybrid Connection Plan Limits.|
|microsoft.web/serverfarms/virtualnetworkconnections/read|Get App Service Plans Virtual Network Connections.|
|microsoft.web/serverfarms/virtualnetworkconnections/routes/delete|Delete App Service Plans Virtual Network Connections Routes.|
|microsoft.web/serverfarms/virtualnetworkconnections/routes/read|Get App Service Plans Virtual Network Connections Routes.|
|microsoft.web/serverfarms/virtualnetworkconnections/routes/write|Update App Service Plans Virtual Network Connections Routes.|
|microsoft.web/serverfarms/virtualnetworkconnections/gateways/write|Update App Service Plans Virtual Network Connections Gateways.|
|microsoft.web/serverfarms/firstpartyapps/settings/delete|Delete App Service Plans First Party Apps Settings.|
|microsoft.web/serverfarms/firstpartyapps/settings/read|Get App Service Plans First Party Apps Settings.|
|microsoft.web/serverfarms/firstpartyapps/settings/write|Update App Service Plans First Party Apps Settings.|
|microsoft.web/serverfarms/sites/read|Get App Service Plans Web Apps.|
|microsoft.web/serverfarms/workers/reboot/action|Reboot App Service Plans Workers.|
|microsoft.web/serverfarms/hybridconnectionrelays/read|Get App Service Plans Hybrid Connection Relays.|
|microsoft.web/serverfarms/skus/read|Get App Service Plans SKUs.|
|microsoft.web/serverfarms/usages/read|Get App Service Plans Usages.|
|microsoft.web/serverfarms/hybridconnectionnamespaces/relays/sites/read|Get App Service Plans Hybrid Connection Namespaces Relays Web Apps.|
|microsoft.web/ishostnameavailable/read|Check if Hostname is Available.|
|Microsoft.Web/connectionGateways/Read|Get the list of Connection Gateways.|
|Microsoft.Web/connectionGateways/Write|Creates or updates a Connection Gateway.|
|Microsoft.Web/connectionGateways/Delete|Deletes a Connection Gateway.|
|Microsoft.Web/connectionGateways/Join/Action|Joins a Connection Gateway.|
|microsoft.web/classicmobileservices/read|Get Classic Mobile Services.|
|microsoft.web/skus/read|Get SKUs.|
|Microsoft.Web/certificates/Read|Get the list of certificates.|
|Microsoft.Web/certificates/Write|Add a new certificate or update an existing one.|
|Microsoft.Web/certificates/Delete|Delete an existing certificate.|
|microsoft.web/operations/read|Get Operations.|
|Microsoft.Web/recommendations/Read|Get the list of recommendations for subscriptions.|
|microsoft.web/ishostingenvironmentnameavailable/read|Get if Hosting Environment Name is available.|
|Microsoft.Web/apiManagementAccounts/Read|Get the list of ApiManagementAccounts.|
|Microsoft.Web/apiManagementAccounts/Write|Add a new ApiManagementAccount or update an existing one|
|Microsoft.Web/apiManagementAccounts/Delete|Delete an existing ApiManagementAccount|
|Microsoft.Web/apiManagementAccounts/connectionAcls/Read|Get the list of Connection Acls.|
|Microsoft.Web/apiManagementAccounts/apiAcls/Read|Read ConnectionAcls|
|Microsoft.Web/connections/Read|Get the list of Connections.|
|Microsoft.Web/connections/Write|Creates or updates a Connection.|
|Microsoft.Web/connections/Delete|Deletes a Connection.|
|Microsoft.Web/connections/Join/Action|Joins a Connection.|
|microsoft.web/connections/confirmconsentcode/action|Confirm Connections Consent Code.|
|microsoft.web/connections/listconsentlinks/action|List Consent Links for Connections.|
|microsoft.web/deploymentlocations/read|Get Deployment Locations.|
|microsoft.web/sourcecontrols/read|Get Source Controls.|
|microsoft.web/sourcecontrols/write|Update Source Controls.|
|microsoft.web/managedhostingenvironments/read|Get Managed Hosting Environments.|
|microsoft.web/managedhostingenvironments/sites/read|Get Managed Hosting Environments Web Apps.|
|microsoft.web/managedhostingenvironments/serverfarms/read|Get Managed Hosting Environments App Service Plans.|
|microsoft.web/locations/managedapis/read|Get Locations Managed APIs.|
|microsoft.web/locations/apioperations/read|Get Locations API Operations.|
|microsoft.web/locations/connectiongatewayinstallations/read|Get Locations Connection Gateway Installations.|
|Microsoft.Web/listSitesAssignedToHostName/Read|Get names of sites assigned to hostname.|

## Next steps

- Learn how to [create a custom role](role-based-access-control-custom-roles.md).

- Review the [built in RBAC roles](role-based-access-built-in-roles.md).

- Learn how to manage access assignments [by user](role-based-access-control-manage-assignments.md) or [by resource](role-based-access-control-configure.md) 

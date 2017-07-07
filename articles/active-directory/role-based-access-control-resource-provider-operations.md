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
ms.date: 04/28/2017
ms.author: jaboes

---
# Azure Resource Manager Resource Provider operations

This document lists the operations available for each Microsoft Azure Resource Manager resource provider. These can be used in custom roles to provide granular Role-Based Access Control (RBAC) permissions to resources in Azure. Please note this is not a comprehensive list and operations may be added or removed as each provider is updated. Operation strings follow the format of `Microsoft.<ProviderName>/<ChildResourceType>/<action>`. For a comprehensive and current list please use `Get-AzureRmProviderOperation` (in PowerShell) or `azure provider operations show` (in Azure CLI) to list operations of Azure resource providers.

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
|/suppressions/action|Creates/updates suppressions|
|/register/action|Registers the subscription for the Microsoft Advisor|
|/generateRecommendations/read|Gets generate recommendations status|
|/recommendations/read|Reads recommendations|
|/suppressions/read|Gets suppressions|
|/suppressions/delete|Deletes suppression|

## Microsoft.AnalysisServices

| Operation | Description |
|---|---|
|/servers/read|Retrieves the information of the specified Analysis Server.|
|/servers/write|Creates or updates the specified Analysis Server.|
|/servers/delete|Deletes the Analysis Server.|
|/servers/suspend/action|Suspends the Analysis Server.|
|/servers/resume/action|Resumes the Analysis Server.|
|/servers/checkNameAvailability<br>/action|Checks that given Analysis Server name is valid and not in use.|

## Microsoft.ApiManagement

| Operation | Description |
|---|---|
|/checkNameAvailability/action|Checks if provided service name is available|
|/register/action|Register subscription for Microsoft.ApiManagement resource provider|
|/unregister/action|Un-register subscription for Microsoft.ApiManagement resource provider|
|/service/write|Create a new instance of API Management Service|
|/service/read|Read metadata for an API Management Service instance|
|/service/delete|Delete API Management Service instance|
|/service/updatehostname/action|Setup, update or remove custom domain names for an API Management Service|
|/service/uploadcertificate/action|Upload SSL certificate for an API Management Service|
|/service/backup/action|Backup API Management Service to the specified container in a user provided storage account|
|/service/restore/action|Restore API Management Service from the specified container in a user provided storage account|
|/service/managedeployments/action|Change SKU/units, add/remove regional deployments of API Management Service|
|/service/getssotoken/action|Gets SSO token that can be used to login into API Management Service Legacy portal as an administrator|
|/service/applynetworkconfigurationupdates/action|Updates the Microsoft.ApiManagement resources running in Virtual Network to pick updated Network Settings.|
|/service/operationresults/read|Gets current status of long running operation|
|/service/networkStatus/read|Gets the network access status of resources.|
|/service/loggers/read|Get list of loggers or Get details of logger|
|/service/loggers/write|Add new logger or Update existing logger details|
|/service/loggers/delete|Remove existing logger|
|/service/users/read|Get a list of registered users or Get account details of a user|
|/service/users/write|Register a new user or Update account details of an existing user|
|/service/users/delete|Remove user account|
|/service/users/generateSsoUrl/action|Generate SSO URL. The URL can be used to access admin portal|
|/service/users/subscriptions/read|Get list of user subscriptions|
|/service/users/keys/read|Get list of user keys|
|/service/users/groups/read|Get list of user groups|
|/service/tenant/operationResults/read|Get list of operation results or Get result of a specific operation|
|/service/tenant/policy/read|Get policy configuration for the tenant|
|/service/tenant/policy/write|Set policy configuration for the tenant|
|/service/tenant/policy/delete|Remove policy configuration for the tenant|
|/service/tenant/configuration/save/action|Creates commit with configuration snapshot to the specified branch in the repository|
|/service/tenant/configuration/deploy/action|Runs a deployment task to apply changes from the specified git branch to the configuration in database.|
|/service/tenant/configuration/validate/action|Validates changes from the specified git branch|
|/service/tenant/configuration/operationResults/read|Get list of operation results or Get result of a specific operation|
|/service/tenant/configuration/syncState/read|Get status of last git synchronization|
|/service/tenant/access/read|Get tenant access information details|
|/service/tenant/access/write|Update tenant access information details|
|/service/tenant/access/regeneratePrimaryKey/action|Regenerate primary access key|
|/service/tenant/access/regenerateSecondaryKey/action|Regenerate secondary access key|
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
|/service/apis/read|Get list of all registered APIs or Get details of API|
|/service/apis/write|Create new API or Update existing API details|
|/service/apis/delete|Remove existing API|
|/service/apis/policy/read|Get policy configuration details for API|
|/service/apis/policy/write|Set policy configuration details for API|
|/service/apis/policy/delete|Remove policy configuration from API|
|/service/apis/operations/read|Get list of existing API operations or Get details of API operation|
|/service/apis/operations/write|Create new API operation or Update existing API operation|
|/service/apis/operations/delete|Remove existing API operation|
|/service/apis/operations/policy/read|Get policy configuration details for operation|
|/service/apis/operations/policy/write|Set policy configuration details for operation|
|/service/apis/operations/policy/delete|Remove policy configuration from operation|
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
|/service/products/groups/read|Get list of developer groups associated with product|
|/service/products/groups/write|Associate existing developer group with existing product|
|/service/products/groups/delete|Delete association of existing developer group with existing product|
|/service/openidConnectProviders/read|Get list of OpenID Connect providers or Get details of OpenID Connect Provider|
|/service/openidConnectProviders/write|Create a new OpenID Connect Provider or Update details of an existing OpenID Connect Provider|
|/service/openidConnectProviders/delete|Remove existing OpenID Connect Provider|
|/service/certificates/read|Get list of certificates or Get details of certificate|
|/service/certificates/write|Add new certificate|
|/service/certificates/delete|Remove existing certificate|
|/service/properties/read|Gets list of all properties or Gets details of specified property|
|/service/properties/write|Creates a new property or Updates value for specified property|
|/service/properties/delete|Removes existing property|
|/service/groups/read|Get list of groups or Gets details of a group|
|/service/groups/write|Create new group or Update existing group details|
|/service/groups/delete|Remove existing group|
|/service/groups/users/read|Get list of group users|
|/service/groups/users/write|Add existing user to existing group|
|/service/groups/users/delete|Remove existing user from existing group|
|/service/authorizationServers/read|Get list of authorization servers or Get details of authorization server|
|/service/authorizationServers/write|Create a new authorization server or Update details of an existing authorization server|
|/service/authorizationServers/delete|Remove existing authorization server|
|/service/reports/bySubscription/read|Get report aggregated by subscription.|
|/service/reports/byRequest/read|Get requests reporting data|
|/service/reports/byOperation/read|Get report aggregated by operations|
|/service/reports/byGeo/read|Get report aggregated by geographical region|
|/service/reports/byUser/read|Get report aggregated by developers.|
|/service/reports/byTime/read|Get report aggregated by time periods|
|/service/reports/byApi/read|Get report aggregated by APIs|
|/service/reports/byProduct/read|Get report aggregated by products.|

## Microsoft.AppService

| Operation | Description |
|---|---|
|/appidentities/Read|Returns the resource (web site) registered with the Gateway.|
|/appidentities/Write|Creates a new App Identity.|
|/appidentities/Delete|Deletes an existing App Identity.|
|/deploymenttemplates/listMetadata/Action|Lists UI Metadata associated with the API App package.|
|/deploymenttemplates/generate/Action|Returns a Deployment Template to provision API App instance(s).|
|/gateways/Read|Returns the Gateway instance.|
|/gateways/Write|Creates a new Gateway or updates existing one.|
|/gateways/Delete|Deletes an existing Gateway instance.|
|/gateways/listLoginUris/Action|Populates token store and returns OAuth login URIs.|
|/gateways/listKeys/Action|Returns Gateway secrets.|
|/gateways/tokens/Write|Creates a new Zumo Token with the given name.|
|/gateways/registrations/Read|Returns the resource (web site) registered with the Gateway.|
|/gateways/registrations/Write|Registers a resource (web site) with the Gateway.|
|/gateways/registrations/Delete|Unregisters a resource (web site) from the Gateway.|
|/apiapps/Read|Returns the API App instance.|
|/apiapps/Write|Creates a new API App or updates existing one.|
|/apiapps/Delete|Deletes an existing API App instance.|
|/apiapps/listStatus/Action|Returns API App status.|
|/apiapps/listKeys/Action|Returns API App secrets.|
|/apiapps/apidefinitions/Read|Returns API App's API definition.|

## Microsoft.Authorization

| Operation | Description |
|---|---|
|/elevateAccess/action|Grants the caller User Access Administrator access at the tenant scope|
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

## Microsoft.Automation

| Operation | Description |
|---|---|
|/automationAccounts/read|Gets an Azure Automation account|
|/automationAccounts/write|Creates or updates an Azure Automation account|
|/automationAccounts/delete|Deletes an Azure Automation account|
|/automationAccounts/configurations/readContent/action|Gets an Azure Automation DSC's content|
|/automationAccounts/hybridRunbookWorkerGroups/read|Reads Hybrid Runbook Worker Resources|
|/automationAccounts/hybridRunbookWorkerGroups/delete|Deletes Hybrid Runbook Worker Resources|
|/automationAccounts/jobSchedules/read|Gets an Azure Automation job schedule|
|/automationAccounts/jobSchedules/write|Creates an Azure Automation job schedule|
|/automationAccounts/jobSchedules/delete|Deletes an Azure Automation job schedule|
|/automationAccounts/connectionTypes/read|Gets an Azure Automation connection type asset|
|/automationAccounts/connectionTypes/write|Creates an Azure Automation connection type asset|
|/automationAccounts/connectionTypes/delete|Deletes an Azure Automation connection type asset|
|/automationAccounts/modules/read|Gets an Azure Automation module|
|/automationAccounts/modules/write|Creates or updates an Azure Automation module|
|/automationAccounts/modules/delete|Deletes an Azure Automation module|
|/automationAccounts/credentials/read|Gets an Azure Automation credential asset|
|/automationAccounts/credentials/write|Creates or updates an Azure Automation credential asset|
|/automationAccounts/credentials/delete|Deletes an Azure Automation credential asset|
|/automationAccounts/certificates/read|Gets an Azure Automation certificate asset|
|/automationAccounts/certificates/write|Creates or updates an Azure Automation certificate asset|
|/automationAccounts/certificates/delete|Deletes an Azure Automation certificate asset|
|/automationAccounts/schedules/read|Gets an Azure Automation schedule asset|
|/automationAccounts/schedules/write|Creates or updates an Azure Automation schedule asset|
|/automationAccounts/schedules/delete|Deletes an Azure Automation schedule asset|
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
|/automationAccounts/connections/read|Gets an Azure Automation connection asset|
|/automationAccounts/connections/write|Creates or updates an Azure Automation connection asset|
|/automationAccounts/connections/delete|Deletes an Azure Automation connection asset|
|/automationAccounts/variables/read|Reads an Azure Automation variable asset|
|/automationAccounts/variables/write|Creates or updates an Azure Automation variable asset|
|/automationAccounts/variables/delete|Deletes an Azure Automation variable asset|
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

This provider is not a full ARM provider and does not provide any ARM operations.

## Microsoft.Batch

| Operation | Description |
|---|---|
|/register/action|Registers the subscription for the Batch Resource Provider and enables the creation of Batch accounts|
|/batchAccounts/write|Creates a new Batch account or updates an existing Batch account|
|/batchAccounts/read|Lists Batch accounts or gets the properties of a Batch account|
|/batchAccounts/delete|Deletes a Batch account|
|/batchAccounts/listkeys/action|Lists access keys for a Batch account|
|/batchAccounts/regeneratekeys/action|Regenerates access keys for a Batch account|
|/batchAccounts/syncAutoStorageKeys/action|Synchronizes access keys for the auto storage account configured for a Batch account|
|/batchAccounts/applications/read|Lists applications or gets the properties of an application|
|/batchAccounts/applications/write|Creates a new application or updates an existing application|
|/batchAccounts/applications/delete|Deletes an application|
|/batchAccounts/applications/versions/read|Gets the properties of an application package|
|/batchAccounts/applications/versions/write|Creates a new application package or updates an existing application package|
|/batchAccounts/applications/versions/activate/action|Activates an application package|
|/batchAccounts/applications/versions/delete|Deletes an application package|
|/locations/quotas/read|Gets Batch quotas of the specified subscription at the specified Azure region|

## Microsoft.Billing

| Operation | Description |
|---|---|
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

## Microsoft.ClassicCompute

| Operation | Description |
|---|---|
|/register/action|Register to Classic Compute|
|/checkDomainNameAvailability/action|Checks the availability of a given domain name.|
|/moveSubscriptionResources/action|Move all classic resources to a different subscription.|
|/validateSubscriptionMoveAvailability/action|Validate the subscription's availability for classic move operation.|
|/operatingSystemFamilies/read|Lists the guest operating system families available in Microsoft Azure, and also lists the operating system versions available for each f
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
|/domainNames/slots/roles/extensionReferences/read|Returns the extension reference for the deployment slot role.|
|/domainNames/slots/roles/extensionReferences/write|Add or modify the extension reference for the deployment slot role.|
|/domainNames/slots/roles/extensionReferences/delete|Remove the extension reference for the deployment slot role.|
|/domainNames/slots/roles/extensionReferences/operationStatuses/read|Reads the operation status for the domain names slots roles extension references.|
|/domainNames/slots/roles/roleInstances/read|Get the role instance.|
|/domainNames/slots/roles/roleInstances/restart/action|Restarts role instances.|
|/domainNames/slots/roles/roleInstances/reimage/action|Reimages the role instance.|
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
|/virtualMachines/restart/action|Restarts virtual machines.|
|/virtualMachines/stop/action|Stops the virtual machine.|
|/virtualMachines/shutdown/action|Shutdown the virtual machine.|
|/virtualMachines/attachDisk/action|Attaches a data disk to a virtual machine.|
|/virtualMachines/detachDisk/action|Detaches a data disk from virtual machine.|
|/virtualMachines/downloadRemoteDesktopConnectionFile/action|Downloads the RDP file for virtual machine.|
|/virtualMachines/networkInterfaces/<br>associatedNetworkSecurityGroups/read|Gets the network security group associated with the network interface.|
|/virtualMachines/networkInterfaces/<br>associatedNetworkSecurityGroups/write|Adds a network security group associated with the network interface.|
|/virtualMachines/networkInterfaces/<br>associatedNetworkSecurityGroups/delete|Deletes the network security group associated with the network interface.|
|/virtualMachines/networkInterfaces/<br>associatedNetworkSecurityGroups/operationStatuses/read|Reads the operation status for the virtual machines associated network security groups.|
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
|/virtualNetworks/subnets/<br>associatedNetworkSecurityGroups/read|Gets the network security group associated with the subnet.|
|/virtualNetworks/subnets/<br>associatedNetworkSecurityGroups/write|Adds a network security group associated with the subnet.|
|/virtualNetworks/subnets/<br>associatedNetworkSecurityGroups/delete|Deletes the network security group associated with the subnet.|
|/virtualNetworks/subnets/<br>associatedNetworkSecurityGroups/operationStatuses/read|Reads the operation status for the virtual network subnet associeted network security group.|
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
|/accounts/read|Reads API accounts.|
|/accounts/write|Writes API Accounts.|
|/accounts/delete|Deletes API accounts|
|/accounts/listKeys/action|List Keys|
|/accounts/regenerateKey/action|Regenerate Key|
|/accounts/skus/read|Reads available SKUs for an existing resource.|
|/accounts/usages/read|Get the quota usage for an existing resource.|
|/Operations/read|Description of the operation.|

## Microsoft.Commerce

| Operation | Description |
|---|---|
|/RateCard/read|Returns offer data, resource/meter metadata and rates for the given subscription.|
|/UsageAggregates/read|Retrieves Microsoft Azure’s consumption  by a subscription. The result contains aggregates usage data, subscription and resource related information, on a particular time range.|

## Microsoft.Compute

| Operation | Description |
|---|---|
|/register/action|Registers Subscription with Microsoft.Compute resource provider|
|/restorePointCollections/read|Get the properties of a restore point collection|
|/restorePointCollections/write|Creates a new restore point collection or updates an existing one|
|/restorePointCollections/delete|Deletes the restore point collection and contained restore points|
|/restorePointCollections/restorePoints/read|Get the properties of a restore point|
|/restorePointCollections/restorePoints/write|Creates a new restore point|
|/restorePointCollections/restorePoints/delete|Deletes the restore point|
|/restorePointCollections/restorePoints/retrieveSasUris/action|Get the properties of a restore point along with blob SAS URIs|
|/virtualMachineScaleSets/read|Get the properties of a virtual machine scale set|
|/virtualMachineScaleSets/write|Creates a new virtual machine scale set or updates an existing one|
|/virtualMachineScaleSets/delete|Deletes the virtual machine scale set|
|/virtualMachineScaleSets/start/action|Starts the instances of the virtual machine scale set|
|/virtualMachineScaleSets/powerOff/action|Powers off the instances of the virtual machine scale set|
|/virtualMachineScaleSets/restart/action|Restarts the instances of the virtual machine scale set|
|/virtualMachineScaleSets/deallocate/action|Powers off and releases the compute resources for the instances of the virtual machine scale set |
|/virtualMachineScaleSets/manualUpgrade/action|Manually updates instances to latest model of the virtual machine scale set|
|/virtualMachineScaleSets/scale/action|Scale In/Scale Out instance count of an existing virtual machine scale set|
|/virtualMachineScaleSets/instanceView/read|Gets the instance view of the virtual machine scale set|
|/virtualMachineScaleSets/skus/read|Lists the valid SKUs for an existing virtual machine scale set|
|/virtualMachineScaleSets/virtualMachines/read|Retrieves the properties of a Virtual Machine in a VM Scale Set|
|/virtualMachineScaleSets/virtualMachines/delete|Delete a specific Virtual Machine in a VM Scale Set.|
|/virtualMachineScaleSets/virtualMachines/start/action|Starts a Virtual Machine instance in a VM Scale Set.|
|/virtualMachineScaleSets/virtualMachines/powerOff/action|Powers Off a Virtual Machine instance in a VM Scale Set.|
|/virtualMachineScaleSets/virtualMachines/restart/action|Restarts a Virtual Machine instance in a VM Scale Set.|
|/virtualMachineScaleSets/virtualMachines/deallocate/action|Powers off and releases the compute resources for a Virtual Machine in a VM Scale Set.|
|/virtualMachineScaleSets/virtualMachines/instanceView/read|Retrieves the instance view of a Virtual Machine in a VM Scale Set.|
|/images/read|Get the properties of the Image|
|/images/write|Creates a new Image or updates an existing one|
|/images/delete|Deletes the image|
|/operations/read|Lists operations available on Microsoft.Compute resource provider|
|/disks/read|Get the properties of a Disk|
|/disks/write|Creates a new Disk or updates an existing one|
|/disks/delete|Deletes the Disk|
|/disks/beginGetAccess/action|Get the SAS URI of the Disk for blob access|
|/disks/endGetAccess/action|Revoke the SAS URI of the Disk|
|/snapshots/read|Get the properties of a Snapshot|
|/snapshots/write|Create a new Snapshot or update an existing one|
|/snapshots/delete|Delete a Snapshot|
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
|/virtualMachines/convertToManagedDisks/action|Converts the blob based disks of the virtual machine to managed disks|
|/virtualMachines/vmSizes/read|Lists available sizes the virtual machine can be updated to|
|/virtualMachines/instanceView/read|Gets the detailed runtime status of the virtual machine and its resources|
|/virtualMachines/extensions/read|Get the properties of a virtual machine extension|
|/virtualMachines/extensions/write|Creates a new virtual machine extension or updates an existing one|
|/virtualMachines/extensions/delete|Deletes the virtual machine extension|
|/locations/vmSizes/read|Lists available virtual machine sizes in a location|
|/locations/usages/read|Gets service limits and current usage quantities for the subscription's compute resources in a location|
|/locations/operations/read|Gets the status of an asynchronous operation|

## Microsoft.ContainerRegistry

| Operation | Description |
|---|---|
|/register/action|Registers the subscription for the container registry resource provider and enables the creation of container registries.|
|/checknameavailability/read|Checks that registry name is valid and is not in use.|
|/registries/read|Returns the list of container registries or gets the properties for the specified container registry.|
|/registries/write|Creates a container registry with the specified parameters or update the properties or tags for the specified container registry.|
|/registries/delete|Deletes an existing container registry.|
|/registries/listCredentials/action|Lists the login credentials for the specified container registry.|
|/registries/regenerateCredential/action|Regenerates the login credentials for the specified container registry.|

## Microsoft.ContainerService

| Operation | Description |
|---|---|
|/containerServices/subscriptions/read|Get the specified Container Services based on Subscription|
|/containerServices/resourceGroups/read|Get the specified Container Services based on Resource Group|
|/containerServices/resourceGroups/ContainerServiceName/read|Gets the specified Container Service|
|/containerServices/resourceGroups/ContainerServiceName/write|Puts or Updates the specified Container Service|
|/containerServices/resourceGroups/ContainerServiceName/delete|Deletes the specified Container Service|

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
|/hubs/read|Read any Azure Customer Insights Hub|
|/hubs/write|Create or Update any Azure Customer Insights Hub|
|/hubs/delete|Delete any Azure Customer Insights Hub|
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
|/hubs/kpi/read|Read any Azure Customer Insights Key Performance Indicator|
|/hubs/kpi/write|Create or Update any Azure Customer Insights Key Performance Indicator|
|/hubs/kpi/delete|Delete any Azure Customer Insights Key Performance Indicator|
|/hubs/views/read|Read any Azure Customer Insights App View|
|/hubs/views/write|Create or Update any Azure Customer Insights App View|
|/hubs/views/delete|Delete any Azure Customer Insights App View|
|/hubs/interactions/read|Read any Azure Customer Insights Interaction|
|/hubs/interactions/write|Create or Update any Azure Customer Insights Interaction|
|/hubs/roleAssignments/read|Read any Azure Customer Insights Rbac Assignment|
|/hubs/roleAssignments/write|Create or Update any Azure Customer Insights Rbac Assignment|
|/hubs/roleAssignments/delete|Delete any Azure Customer Insights Rbac Assignment|
|/hubs/connectors/read|Read any Azure Customer Insights Connector|
|/hubs/connectors/write|Create or Update any Azure Customer Insights Connector|
|/hubs/connectors/delete|Delete any Azure Customer Insights Connector|
|/hubs/connectors/mappings/read|Read any Azure Customer Insights Connector Mapping|
|/hubs/connectors/mappings/write|Create or Update any Azure Customer Insights Connector Mapping|
|/hubs/connectors/mappings/delete|Delete any Azure Customer Insights Connector Mapping|

## Microsoft.DataCatalog

| Operation | Description |
|---|---|
|/checkNameAvailability/action|Checks catalog name availability for tenant.|
|/catalogs/read|Get properties for catalog or catalogs under subscription or resource group.|
|/catalogs/write|Creates catalog or updates the tags and properties for the catalog.|
|/catalogs/delete|Deletes the catalog.|

## Microsoft.DataFactory

| Operation | Description |
|---|---|
|/datafactories/read|Reads Data Factory.|
|/datafactories/write|Create or Update Data Factory|
|/datafactories/delete|Deletes Data Factory.|
|/datafactories/datapipelines/read|Reads Pipeline.|
|/datafactories/datapipelines/delete|Deletes Pipeline.|
|/datafactories/datapipelines/pause/action|Pauses Pipeline.|
|/datafactories/datapipelines/resume/action|Resumes Pipeline.|
|/datafactories/datapipelines/update/action|Updates Pipeline.|
|/datafactories/datapipelines/write|Create or Update Pipeline|
|/datafactories/linkedServices/read|Reads Linked service.|
|/datafactories/linkedServices/delete|Deletes Linked service.|
|/datafactories/linkedServices/write|Create or Update Linked service|
|/datafactories/tables/read|Reads Table.|
|/datafactories/tables/delete|Deletes Table.|
|/datafactories/tables/write|Create or Update Table|

## Microsoft.DataLakeAnalytics

| Operation | Description |
|---|---|
|/accounts/read|Get information about the DataLakeAnalytics account.|
|/accounts/write|Create or update the DataLakeAnalytics account.|
|/accounts/delete|Delete the DataLakeAnalytics account.|
|/accounts/firewallRules/read|Get information about a firewall rule.|
|/accounts/firewallRules/write|Create or update a firewall rule.|
|/accounts/firewallRules/delete|Delete a firewall rule.|
|/accounts/storageAccounts/read|Get linked Storage account for the DataLakeAnalytics account.|
|/accounts/storageAccounts/write|Link a Storage account to the DataLakeAnalytics account.|
|/accounts/storageAccounts/delete|Unlink a Storage account from the DataLakeAnalytics account.|
|/accounts/storageAccounts/Containers/read|Get Containers under the Storage account|
|/accounts/storageAccounts/Containers/listSasTokens/action|List SAS Tokens for the Storage container|
|/accounts/dataLakeStoreAccounts/read|Get linked DataLakeStore account for the DataLakeAnalytics account.|
|/accounts/dataLakeStoreAccounts/write|Link a DataLakeStore account to the DataLakeAnalytics account.|
|/accounts/dataLakeStoreAccounts/delete|Unlink a DataLakeStore account from the DataLakeAnalytics account.|

## Microsoft.DataLakeStore

| Operation | Description |
|---|---|
|/accounts/read|Get information about an existed DataLakeStore account.|
|/accounts/write|Create a new DataLakeStore account, or Update an existed DataLakeStore account.|
|/accounts/delete|Delete an existed DataLakeStore account.|
|/accounts/firewallRules/read|Get information about a firewall rule.|
|/accounts/firewallRules/write|Create or update a firewall rule.|
|/accounts/firewallRules/delete|Delete a firewall rule.|
|/accounts/trustedIdProviders/read|Get information about a trusted identity provider.|
|/accounts/trustedIdProviders/write|Create or update a trusted identity provider.|
|/accounts/trustedIdProviders/delete|Delete a trusted identity provider.|

## Microsoft.Devices

| Operation | Description |
|---|---|
|/register/action|Register the subscription for the IotHub resource provider and enables the creation of IotHub resources|
|/checkNameAvailability/Action|Check If IotHub name is available|
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
|/iotHubs/routing/routes/$testall/Action|Test a message against all existing Routes|
|/iotHubs/routing/routes/$testnew/Action|Test a message against a provided test Route|
|/IotHubs/diagnosticSettings/read|Gets the diagnostic setting for the resource|
|/IotHubs/diagnosticSettings/write|Creates or updates the diagnostic setting for the resource|
|/iotHubs/skus/Read|Get valid IotHub Skus|
|/iotHubs/jobs/Read|Get Job(s) details submitted on given IotHub|
|/iotHubs/routingEndpointsHealth/Read|Gets the health of all routing Endpoints for an IotHub|

## Microsoft.DevTestLab

| Operation | Description |
|---|---|
|/Subscription/register/action|Registers the subscription|
|/labs/delete|Delete labs.|
|/labs/read|Read labs.|
|/labs/write|Add or modify labs.|
|/labs/ListVhds/action|List disk images available for custom image creation.|
|/labs/GenerateUploadUri/action|Generate a URI for uploading custom disk images to a Lab.|
|/labs/CreateEnvironment/action|Create virtual machines in a lab.|
|/labs/ClaimAnyVm/action|Claim a random claimable virtual machine in the lab.|
|/labs/ExportResourceUsage/action|Exports the lab resource usage into a storage account|
|/labs/users/delete|Delete user profiles.|
|/labs/users/read|Read user profiles.|
|/labs/users/write|Add or modify user profiles.|
|/labs/users/secrets/delete|Delete secrets.|
|/labs/users/secrets/read|Read secrets.|
|/labs/users/secrets/write|Add or modify secrets.|
|/labs/users/environments/delete|Delete environments.|
|/labs/users/environments/read|Read environments.|
|/labs/users/environments/write|Add or modify environments.|
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
|/labs/virtualMachines/ApplyArtifacts/action|Apply artifacts to virtual machine.|
|/labs/virtualMachines/AddDataDisk/action|Attach a new or existing data disk to virtual machine.|
|/labs/virtualMachines/DetachDataDisk/action|Detach the specified disk from the virtual machine.|
|/labs/virtualMachines/Claim/action|Take ownership of an existing virtual machine|
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
|/locations/operations/read|Read operations.|

## Microsoft.DocumentDB

| Operation | Description |
|---|---|
|/databaseAccountNames/read|Checks for name availability.|
|/databaseAccounts/read|Reads a database account.|
|/databaseAccounts/write|Update a database accounts.|
|/databaseAccounts/listKeys/action|List keys of a database account|
|/databaseAccounts/regenerateKey/action|Rotate keys of a database account|
|/databaseAccounts/listConnectionStrings/action|Get the connection strings for a database account|
|/databaseAccounts/changeResourceGroup/action|Change resource group of a database account|
|/databaseAccounts/failoverPriorityChange/action|Change failover priorities of regions of a database account. This is used to perform manual failover operation|
|/databaseAccounts/delete|Deletes the database accounts.|
|/databaseAccounts/metricDefinitions/read|Reads the database account metrics definitions.|
|/databaseAccounts/metrics/read|Reads the database account metrics.|
|/databaseAccounts/usages/read|Reads the database account usages.|
|/databaseAccounts/databases/collections/metricDefinitions/read|Reads the collection metric definitions.|
|/databaseAccounts/databases/collections/metrics/read|Reads the collection metrics.|
|/databaseAccounts/databases/collections/usages/read|Reads the collection usages.|
|/databaseAccounts/databases/metricDefinitions/read|Reads the database metric definitions|
|/databaseAccounts/databases/metrics/read|Reads the database metrics.|
|/databaseAccounts/databases/usages/read|Reads the database usages.|
|/databaseAccounts/readonlykeys/read|Reads the database account readonly keys.|

## Microsoft.DomainRegistration

| Operation | Description |
|---|---|
|/generateSsoRequest/Action|Generate a request for signing into domain control center.|
|/validateDomainRegistrationInformation/Action|Validate domain purchase object without submitting it|
|/checkDomainAvailability/Action|Check if a domain is available for purchase|
|/listDomainRecommendations/Action|Retrieve the list domain recommendations based on keywords|
|/register/action|Register the Microsoft Domains resource provider for the subscription|
|/domains/Read|Get the list of domains|
|/domains/Write|Add a new Domain or update an existing one|
|/domains/Delete|Delete an existing domain.|
|/domains/operationresults/Read|Get a domain operation|

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

## Microsoft.EventHub

| Operation | Description |
|---|---|
|/checkNameAvailability/action|Checks availability of namespace under given subscription.|
|/register/action|Registers the subscription for the EventHub resource provider and enables the creation of EventHub resources|
|/namespaces/write|Create a Namespace Resource and Update its properties. Tags and status of the Namespace are the properties which can be updated.|
|/namespaces/read|Get the list of Namespace Resource Description|
|/namespaces/Delete|Delete Namespace Resource|
|/namespaces/metricDefinitions/read|Get list of Namespace metrics Resource Descriptions|
|/namespaces/authorizationRules/read|Get the list of Namespaces Authorization Rules description.|
|/namespaces/authorizationRules/write|Create a Namespace level Authorization Rules and update its properties. The Authorization Rules Access Rights, the Primary and Secondary Keys can be updated.|
|/namespaces/authorizationRules/delete|Delete Namespace Authorization Rule. The Default Namespace Authorization Rule cannot be deleted. |
|/namespaces/authorizationRules/listkeys/action|Get the Connection String to the Namespace|
|/namespaces/authorizationRules/regenerateKeys/action|Regenerate the Primary or Secondary key to the Resource|
|/namespaces/eventhubs/write|Create or Update EventHub properties.|
|/namespaces/eventhubs/read|Get list of EventHub Resource Descriptions|
|/namespaces/eventhubs/Delete|Operation to delete EventHub Resource|
|/namespaces/eventHubs/consumergroups/write|Create or Update ConsumerGroup properties.|
|/namespaces/eventHubs/consumergroups/read|Get list of ConsumerGroup Resource Descriptions|
|/namespaces/eventHubs/consumergroups/Delete|Operation to delete ConsumerGroup Resource|
|/namespaces/eventhubs/authorizationRules/read| Get the list of EventHub Authorization Rules|
|/namespaces/eventhubs/authorizationRules/write|Create EventHub Authorization Rules and Update its properties. The Authorization Rules Access Rights, the Primary and Secondary Keys can be updated.|
|/namespaces/eventhubs/authorizationRules/delete|Operation to delete EventHub Authorization Rules|
|/namespaces/eventhubs/authorizationRules/listkeys/action|Get the Connection String to EventHub|
|/namespaces/eventhubs/authorizationRules/regenerateKeys/action|Regenerate the Primary or Secondary key to the Resource|
|/namespaces/diagnosticSettings/read|Get list of Namespace diagnostic settings Resource Descriptions|
|/namespaces/diagnosticSettings/write|Get list of Namespace diagnostic settings Resource Descriptions|
|/namespaces/logDefinitions/read|Get list of Namespace logs Resource Descriptions|

## Microsoft.Features

| Operation | Description |
|---|---|
|/providers/features/read|Gets the feature of a subscription in a given resource provider.|
|/providers/features/register/action|Registers the feature for a subscription in a given resource provider.|
|/features/read|Gets the features of a subscription.|

## Microsoft.HDInsight

| Operation | Description |
|---|---|
|/clusters/write|Create or Update HDInsight Cluster|
|/clusters/read|Get details about HDInsight Cluster|
|/clusters/delete|Delete a HDInsight Cluster|
|/clusters/changerdpsetting/action|Change RDP setting for HDInsight Cluster|
|/clusters/configurations/action|Update HDInsight Cluster Configuration|
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
|/AlertRules/Write|Writing to an alert rule configuration|
|/AlertRules/Delete|Deleting an alert rule configuration|
|/AlertRules/Read|Reading an alert rule configuration|
|/AlertRules/Activated/Action|Alert Rule activated|
|/AlertRules/Resolved/Action|Alert Rule resolved|
|/AlertRules/Throttled/Action|Alert rule is throttled|
|/AlertRules/Incidents/Read|Reading an alert rule incident configuration|
|/MetricDefinitions/Read|Read metric definitions|
|/eventtypes/values/Read|Read management event type values|
|/eventtypes/digestevents/Read|Read management event type digest|
|/Metrics/Read|Read metrics|
|/LogProfiles/Write|Writing to a log profile configuration|
|/LogProfiles/Delete|Delete log profiles configuration|
|/LogProfiles/Read|Read log profiles|
|/AutoscaleSettings/Write|Writing to an autoscale setting configuration|
|/AutoscaleSettings/Delete|Deleting an autoscale setting configuration|
|/AutoscaleSettings/Read|Reading an autoscale setting configuration|
|/AutoscaleSettings/Scaleup/Action|Autoscale scale up operation|
|/AutoscaleSettings/Scaledown/Action|Autoscale scale down operation|
|/AutoscaleSettings/providers/Microsoft.Insights/MetricDefinitions/Read|Read metric definitions|
|/ActivityLogAlerts/Activated/Action|Triggered the Activity Log Alert|
|/DiagnosticSettings/Write|Writing to diagnostic settings configuration|
|/DiagnosticSettings/Delete|Deleting diagnostic settings configuration|
|/DiagnosticSettings/Read|Reading a diagnostic settings configuration|
|/LogDefinitions/Read|Read log definitions|
|/ExtendedDiagnosticSettings/Write|Writing to extended diagnostic settings configuration|
|/ExtendedDiagnosticSettings/Delete|Deleting extended diagnostic settings configuration|
|/ExtendedDiagnosticSettings/Read|Reading a extended diagnostic settings configuration|

## Microsoft.KeyVault

| Operation | Description |
|---|---|
|/register/action|Registers a subscription|
|/checkNameAvailability/read|Checks that a key vault name is valid and is not in use|
|/vaults/read|View the properties of a key vault|
|/vaults/write|Create a new key vault or update the properties of an existing key vault|
|/vaults/delete|Delete a key vault|
|/vaults/deploy/action|Enables access to secrets in a key vault when deploying Azure resources|
|/vaults/secrets/read|View the properties of a secret, but not its value|
|/vaults/secrets/write|Create a new secret or update the value of an existing secret|
|/vaults/accessPolicies/write|Update an existing access policy by merging or replacing, or add a new access policy to a vault.|
|/deletedVaults/read|View the properties of soft deleted key vaults|
|/locations/operationResults/read|Check the result of a long run operation|
|/locations/deletedVaults/read|View the properties of a soft deleted key vault|
|/locations/deletedVaults/purge/action|Purge a soft deleted key vault|

## Microsoft.Logic

| Operation | Description |
|---|---|
|/workflows/read|Reads the workflow.|
|/workflows/write|Creates or updates the workflow.|
|/workflows/delete|Deletes the workflow.|
|/workflows/run/action|Starts a run of the workflow.|
|/workflows/disable/action|Disables the workflow.|
|/workflows/enable/action|Enables the workflow.|
|/workflows/validate/action|Validates the workflow.|
|/workflows/move/action|Moves Workflow from its existing subscription id, resource group, and/or name to a different subscription id, resource group, and/or name.|
|/workflows/listSwagger/action|Gets the workflow swagger definitions.|
|/workflows/regenerateAccessKey/action|Regenerates the access key secrets.|
|/workflows/listCallbackUrl/action|Gets the callback URL for workflow.|
|/workflows/versions/read|Reads the workflow version.|
|/workflows/versions/triggers/listCallbackUrl/action|Gets the callback URL for trigger.|
|/workflows/runs/read|Reads the workflow run.|
|/workflows/runs/cancel/action|Cancels the run of a workflow.|
|/workflows/runs/actions/read|Reads the workflow run action.|
|/workflows/runs/operations/read|Reads the workflow run operation status.|
|/workflows/triggers/read|Reads the trigger.|
|/workflows/triggers/run/action|Executes the trigger.|
|/workflows/triggers/listCallbackUrl/action|Gets the callback URL for trigger.|
|/workflows/triggers/histories/read|Reads the trigger histories.|
|/workflows/triggers/histories/resubmit/action|Resubmits the workflow trigger.|
|/workflows/accessKeys/read|Reads the access key.|
|/workflows/accessKeys/write|Creates or updates the access key.|
|/workflows/accessKeys/delete|Deletes the access key.|
|/workflows/accessKeys/list/action|Lists the access key secrets.|
|/workflows/accessKeys/regenerate/action|Regenerates the access key secrets.|
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
|/Workspaces/read|Read any Machine Learning Workspace|
|/Workspaces/write|Create or Update any Machine Learning Workspace|
|/Workspaces/delete|Delete any Machine Learning Workspace|
|/Workspaces/listworkspacekeys/action|List keys for a Machine Learning Workspace|
|/Workspaces/resyncstoragekeys/action|Resync keys of storage account configured for a Machine Learning Workspace|
|/webServices/read|Read any Machine Learning Web Service|
|/webServices/write|Create or Update any Machine Learning Web Service|
|/webServices/delete|Delete any Machine Learning Web Service|

## Microsoft.MarketplaceOrdering

| Operation | Description |
|---|---|
|/agreements/offers/plans/read|Return an agreement for a given marketplace item|
|/agreements/offers/plans/sign/action|Sign an agreement for a given marketplace item|
|/agreements/offers/plans/cancel/action|Cancel an agreement for a given marketplace item|

## Microsoft.Media

| Operation | Description |
|---|---|
|/mediaservices/read||
|/mediaservices/write||
|/mediaservices/delete||
|/mediaservices/regenerateKey/action||
|/mediaservices/listKeys/action||
|/mediaservices/syncStorageKeys/action||

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
|/dnszones/recordsets/read|Gets DNS record sets across types|
|/networkInterfaces/read|Gets a network interface definition. |
|/networkInterfaces/write|Creates a network interface or updates an existing network interface. |
|/networkInterfaces/join/action|Joins a Virtual Machine to a network interface|
|/networkInterfaces/delete|Deletes a network interface|
|/networkInterfaces/effectiveRouteTable/action|Get Route Table configured On Network Interface Of The Vm|
|/networkInterfaces/effectiveNetworkSecurityGroups/action|Get Network Security Groups configured On Network Interface Of The Vm|
|/networkInterfaces/loadBalancers/read|Gets all the load balancers that the network interface is part of|
|/networkInterfaces/ipconfigurations/read|Gets a network interface ip configuration definition. |
|/publicIPAddresses/read|Gets a public ip address definition.|
|/publicIPAddresses/write|Creates a public Ip address or updates an existing public Ip address. |
|/publicIPAddresses/delete|Deletes a public Ip address.|
|/publicIPAddresses/join/action|Joins a public ip address|
|/routeFilters/read|Gets a route filter definition|
|/routeFilters/join/action|Joins a route filter|
|/routeFilters/delete|Deletes a route filter definition|
|/routeFilters/write|Creates a route filter or Updates an existing rotue filter|
|/routeFilters/rules/read|Gets a route filter rule definition|
|/routeFilters/rules/write|Creates a route filter rule or Updates an existing route filter rule|
|/routeFilters/rules/delete|Deletes a route filter rule definition|
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
|/networkWatchers/packetCaptures/queryStatus/action|Gets information about properties and status of a packet capture resource.|
|/networkWatchers/packetCaptures/stop/action|Stop the running packet capture session.|
|/networkWatchers/packetCaptures/read|Get the packet capture definition|
|/networkWatchers/packetCaptures/write|Creates a packet capture|
|/networkWatchers/packetCaptures/delete|Deletes a packet capture|
|/loadBalancers/read|Gets a load balancer definition|
|/loadBalancers/write|Creates a load balancer or updates an existing load balancer|
|/loadBalancers/delete|Deletes a load balancer|
|/loadBalancers/networkInterfaces/read|Gets references to all the network interfaces under a load balancer|
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
|/loadBalancers/virtualMachines/read|Gets references to all the virtual machines under a load balancer|
|/loadBalancers/frontendIPConfigurations/read|Gets a load balancer frontend IP configuration definition|
|/trafficManagerGeographicHierarchies/read|Gets the Traffic Manager Geographic Hierarchy containing regions which can be used with the Geographic traffic routing method|
|/bgpServiceCommunities/read|Get Bgp Service Communities|
|/applicationGatewayAvailableWafRuleSets/read|Gets Application Gateway Available Waf Rule Sets|
|/virtualNetworks/read|Get the virtual network definition|
|/virtualNetworks/write|Creates a virtual network or updates an existing virtual network|
|/virtualNetworks/delete|Deletes a virtual network|
|/virtualNetworks/peer/action|Peers a virtual network with another virtual network|
|/virtualNetworks/virtualNetworkPeerings/read|Gets a virtual network peering definition|
|/virtualNetworks/virtualNetworkPeerings/write|Creates a virtual network peering or updates an existing virtual network peering|
|/virtualNetworks/virtualNetworkPeerings/delete|Deletes a virtual network peering|
|/virtualNetworks/subnets/read|Gets a virtual network subnet definition|
|/virtualNetworks/subnets/write|Creates a virtual network subnet or updates an existing virtual network subnet|
|/virtualNetworks/subnets/delete|Deletes a virtual network subnet|
|/virtualNetworks/subnets/join/action|Joins a virtual network|
|/virtualNetworks/subnets/joinViaServiceTunnel/action|Joins resource such as storage account or SQL database to a Service Tunneling enabled subnet.|
|/virtualNetworks/subnets/virtualMachines/read|Gets references to all the virtual machines in a virtual network subnet|
|/virtualNetworks/checkIpAddressAvailability/read|Check if Ip Address is available at the specified virtual network|
|/virtualNetworks/virtualMachines/read|Gets references to all the virtual machines in a virtual network|
|/expressRouteServiceProviders/read|Gets Express Route Service Providers|
|/dnsoperationresults/read|Gets results of a DNS operation|
|/localnetworkgateways/read|Gets LocalNetworkGateway|
|/localnetworkgateways/write|Creates or updates an existing LocalNetworkGateway|
|/localnetworkgateways/delete|Deletes LocalNetworkGateway|
|/trafficManagerProfiles/read|Get the Traffic Manager profile configuration. This includes DNS settings, traffic routing settings, endpoint monitoring settings, and the list of endpoints routed by this Traffic Manager profile.|
|/trafficManagerProfiles/write|Create a Traffic Manager profile, or modify the configuration of an existing Traffic Manager profile. This includes enabling or disabling a profile and modifying DNS settings, traffic routing settings, or endpoint monitoring settings. Endpoints routed by the Traffic Manager profile can be added, removed, enabled or disabled.|
|/trafficManagerProfiles/delete|Delete the Traffic Manager profile. All settings associated with the Traffic Manager profile will be lost, and the profile can no longer be used to route traffic.|
|/dnsoperationstatuses/read|Gets status of a DNS operation |
|/operations/read|Get Available Operations|
|/expressRouteCircuits/read|Get an ExpressRouteCircuit|
|/expressRouteCircuits/write|Creates or updates an existing ExpressRouteCircuit|
|/expressRouteCircuits/delete|Deletes an ExpressRouteCircuit|
|/expressRouteCircuits/stats/read|Gets an ExpressRouteCircuit Stat|
|/expressRouteCircuits/peerings/read|Gets an ExpressRouteCircuit Peering|
|/expressRouteCircuits/peerings/write|Creates or updates an existing ExpressRouteCircuit Peering|
|/expressRouteCircuits/peerings/delete|Deletes an ExpressRouteCircuit Peering|
|/expressRouteCircuits/peerings/arpTables/action|Gets an ExpressRouteCircuit Peering ArpTable|
|/expressRouteCircuits/peerings/routeTables/action|Gets an ExpressRouteCircuit Peering RouteTable|
|/expressRouteCircuits/peerings/<br>routeTablesSummary/action|Gets an ExpressRouteCircuit Peering RouteTable Summary|
|/expressRouteCircuits/peerings/stats/read|Gets an ExpressRouteCircuit Peering Stat|
|/expressRouteCircuits/authorizations/read|Gets an ExpressRouteCircuit Authorization|
|/expressRouteCircuits/authorizations/write|Creates or updates an existing ExpressRouteCircuit Authorization|
|/expressRouteCircuits/authorizations/delete|Deletes an ExpressRouteCircuit Authorization|
|/connections/read|Gets VirtualNetworkGatewayConnection|
|/connections/write|Creates or updates an existing VirtualNetworkGatewayConnection|
|/connections/delete|Deletes VirtualNetworkGatewayConnection|
|/connections/sharedKey/read|Gets VirtualNetworkGatewayConnection SharedKey|
|/connections/sharedKey/write|Creates or updates an existing VirtualNetworkGatewayConnection SharedKey|
|/networkSecurityGroups/read|Gets a network security group definition|
|/networkSecurityGroups/write|Creates a network security group or updates an existing network security group|
|/networkSecurityGroups/delete|Deletes a network security group|
|/networkSecurityGroups/join/action|Joins a network security group|
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
|/applicationGateways/backendAddressPools/join/action|Joins an application gateway backend address pool|
|/routeTables/read|Gets a route table definition|
|/routeTables/write|Creates a route table or Updates an existing rotue table|
|/routeTables/delete|Deletes a route table definition|
|/routeTables/join/action|Joins a route table|
|/routeTables/routes/read|Gets a route definition|
|/routeTables/routes/write|Creates a route or Updates an existing route|
|/routeTables/routes/delete|Deletes a route definition|
|/locations/operationResults/read|Gets operation result of an async POST or DELETE operation|
|/locations/checkDnsNameAvailability/read|Checks if dns label is available at the specified location|
|/locations/usages/read|Gets the resources usage metrics|
|/locations/operations/read|Gets operation resource that represents status of an asynchronous operation|

## Microsoft.NotificationHubs

| Operation | Description |
|---|---|
|/register/action|Registers the subscription for the NotifciationHubs resource provider and enables the creation of Namespaces and NotificationHubs|
|/CheckNamespaceAvailability/action|Checks whether or not a given Namespace resource name is available within the NotificationHub service.|
|/Namespaces/write|Create a Namespace Resource and Update its properties. Tags and status of the Namespace are the properties which can be updated.|
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
|/Namespaces/NotificationHubs/<br>authorizationRules/write|Create Notification Hub Authorization Rules and Update its properties. The Authorization Rules Access Rights, the Primary and Secondary Keys can be updated.|
|/Namespaces/NotificationHubs/<br>authorizationRules/read|Get the list of Notification Hub Authorization Rules|
|/Namespaces/NotificationHubs/<br>authorizationRules/delete|Delete Notification Hub Authorization Rules|
|/Namespaces/NotificationHubs/<br>authorizationRules/listkeys/action|Get the Connection String to the Notification Hub|
|/Namespaces/NotificationHubs/<br>authorizationRules/regenerateKeys/action|Notification Hub Authorization Rule Regenerate Primary/SecondaryKey, Specify the Key that needs to be regenerated|

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
|/workspaces/search/action|Executes a search query|
|/workspaces/datasources/read|Get datasources under a workspace.|
|/workspaces/datasources/write|Create/Update datasources under a workspace.|
|/workspaces/datasources/delete|Delete datasources under a workspace.|
|/workspaces/managementGroups/read|Gets the names and metadata for System Center Operations Manager management groups connected to this workspace.|
|/workspaces/schema/read|Gets the search schema for the workspace.  Search schema includes the exposed fields and their types.|
|/workspaces/usages/read|Gets usage data for a workspace including the amount of data read by the workspace.|
|/workspaces/intelligencepacks/read|Lists all intelligence packs that are visible for a given worksapce and also lists whether the pack is enabled or disabled for that workspace.|
|/workspaces/intelligencepacks/enable/action|Enables an intelligence pack for a given workspace.|
|/workspaces/intelligencepacks/disable/action|Disables an intelligence pack for a given workspace.|
|/workspaces/sharedKeys/read|Retrieves the shared keys for the workspace. These keys are used to connect Microsoft Operational Insights agents to the workspace.|
|/workspaces/savedSearches/read|Gets a saved search query|
|/workspaces/savedSearches/write|Creates a saved search query|
|/workspaces/savedSearches/delete|Deletes a saved search query|
|/workspaces/storageinsightconfigs/write|Creates a new storage configuration. These configurations are used to pull data from a location in an existing storage account.|
|/workspaces/storageinsightconfigs/read|Gets a storage configuration.|
|/workspaces/storageinsightconfigs/delete|Deletes a storage configuration. This will stop Microsoft Operational Insights from reading data from the storage account.|
|/workspaces/configurationScopes/read|Get Configuration Scope|
|/workspaces/configurationScopes/write|Set Configuration Scope|
|/workspaces/configurationScopes/delete|Delete Configuration Scope|

## Microsoft.OperationsManagement

| Operation | Description |
|---|---|
|/register/action|Register a subscription to a resource provider.|
|/solutions/write|Create new OMS solution|
|/solutions/read|Get exiting OMS solution|
|/solutions/delete|Delete existing OMS solution|

## Microsoft.RecoveryServices

| Operation | Description |
|---|---|
|/Vaults/backupJobsExport/action|Export Jobs|
|/Vaults/write|Create Vault operation creates an Azure resource of type 'vault'|
|/Vaults/read|The Get Vault operation gets an object representing the Azure resource of type 'vault'|
|/Vaults/delete|The Delete Vault operation deletes the specified Azure resource of type 'vault'|
|/Vaults/refreshContainers/read|Refreshes the container list|
|/Vaults/backupJobsExport/operationResults/read|Returns the Result of Export Job Operation.|
|/Vaults/backupOperationResults/read|Returns Backup Operation Result for Recovery Services Vault.|
|/Vaults/monitoringAlerts/read|Gets the alerts for the Recovery services vault.|
|/Vaults/monitoringAlerts/{uniqueAlertId}/read|Gets the details of the alert.|
|/Vaults/backupSecurityPIN/read|Returns Security PIN Information for Recovery Services Vault.|
|/vaults/replicationEvents/read|Read Any Events|
|/Vaults/backupProtectableItems/read|Returns list of all Protectable Items.|
|/vaults/replicationFabrics/read|Read Any Fabrics|
|/vaults/replicationFabrics/write|Create or Update Any Fabrics|
|/vaults/replicationFabrics/remove/action|Remove Fabric|
|/vaults/replicationFabrics/checkConsistency/action|Checks Consistency of the Fabric|
|/vaults/replicationFabrics/delete|Delete Any Fabrics|
|/vaults/replicationFabrics/renewcertificate/action||
|/vaults/replicationFabrics/deployProcessServerImage/action|Deploy Process Server Image|
|/vaults/replicationFabrics/reassociateGateway/action|Reassociate Gateway|
|/vaults/replicationFabrics/replicationRecoveryServicesProviders/<br>read|Read Any Recovery Services Providers|
|/vaults/replicationFabrics/replicationRecoveryServicesProviders/<br>remove/action|Remove Recovery Services Provider|
|/vaults/replicationFabrics/replicationRecoveryServicesProviders/<br>delete|Delete Any Recovery Services Providers|
|/vaults/replicationFabrics/replicationRecoveryServicesProviders/<br>refreshProvider/action|Refresh Provider|
|/vaults/replicationFabrics/replicationStorageClassifications/read|Read Any Storage Classifications|
|/vaults/replicationFabrics/replicationStorageClassifications/<br>replicationStorageClassificationMappings/read|Read Any Storage Classification Mappings|
|/vaults/replicationFabrics/replicationStorageClassifications/<br>replicationStorageClassificationMappings/write|Create or Update Any Storage Classification Mappings|
|/vaults/replicationFabrics/replicationStorageClassifications/<br>replicationStorageClassificationMappings/delete|Delete Any Storage Classification Mappings|
|/vaults/replicationFabrics/replicationvCenters/read|Read Any Jobs|
|/vaults/replicationFabrics/replicationvCenters/write|Create or Update Any Jobs|
|/vaults/replicationFabrics/replicationvCenters/delete|Delete Any Jobs|
|/vaults/replicationFabrics/replicationNetworks/read|Read Any Networks|
|/vaults/replicationFabrics/replicationNetworks/<br>replicationNetworkMappings/read|Read Any Network Mappings|
|/vaults/replicationFabrics/replicationNetworks/<br>replicationNetworkMappings/write|Create or Update Any Network Mappings|
|/vaults/replicationFabrics/replicationNetworks/<br>replicationNetworkMappings/delete|Delete Any Network Mappings|
|/vaults/replicationFabrics/replicationProtectionContainers/<br>read|Read Any Protection Containers|
|/vaults/replicationFabrics/replicationProtectionContainers/<br>discoverProtectableItem/action|Discover Protectable Item|
|/vaults/replicationFabrics/replicationProtectionContainers/<br>write|Create or Update Any Protection Containers|
|/vaults/replicationFabrics/replicationProtectionContainers/<br>remove/action|Remove Protection Container|
|/vaults/replicationFabrics/replicationProtectionContainers/<br>switchprotection/action|Switch Protection Container|
|/vaults/replicationFabrics/replicationProtectionContainers/<br>replicationProtectableItems/read|Read Any Protectable Items|
|/vaults/replicationFabrics/replicationProtectionContainers/<br>replicationProtectionContainerMappings/read|Read Any Protection Container Mappings|
|/vaults/replicationFabrics/replicationProtectionContainers/<br>replicationProtectionContainerMappings/write|Create or Update Any Protection Container Mappings|
|/vaults/replicationFabrics/replicationProtectionContainers/<br>replicationProtectionContainerMappings/remove/action|Remove Protection Container Mapping|
|/vaults/replicationFabrics/replicationProtectionContainers/<br>replicationProtectionContainerMappings/delete|Delete Any Protection Container Mappings|
|/vaults/replicationFabrics/replicationProtectionContainers/<br>replicationProtectedItems/read|Read Any Protected Items|
|/vaults/replicationFabrics/replicationProtectionContainers/<br>replicationProtectedItems/write|Create or Update Any Protected Items|
|/vaults/replicationFabrics/replicationProtectionContainers/<br>replicationProtectedItems/delete|Delete Any Protected Items|
|/vaults/replicationFabrics/replicationProtectionContainers/<br>replicationProtectedItems/remove/action|Remove Protected Item|
|/vaults/replicationFabrics/replicationProtectionContainers/<br>replicationProtectedItems/plannedFailover/action|Planned Failover|
|/vaults/replicationFabrics/replicationProtectionContainers/<br>replicationProtectedItems/unplannedFailover/action|Failover|
|/vaults/replicationFabrics/replicationProtectionContainers/<br>replicationProtectedItems/testFailover/action|Test Failover|
|/vaults/replicationFabrics/replicationProtectionContainers/<br>replicationProtectedItems/testFailoverCleanup/action|Test Failover Cleanup|
|/vaults/replicationFabrics/replicationProtectionContainers/<br>replicationProtectedItems/failoverCommit/action|Failover Commit|
|/vaults/replicationFabrics/replicationProtectionContainers/<br>replicationProtectedItems/reProtect/action|ReProtect Protected Item|
|/vaults/replicationFabrics/replicationProtectionContainers/<br>replicationProtectedItems/updateMobilityService/action|Update Mobility Service|
|/vaults/replicationFabrics/replicationProtectionContainers/<br>replicationProtectedItems/repairReplication/action|Repair replication|
|/vaults/replicationFabrics/replicationProtectionContainers/<br>replicationProtectedItems/applyRecoveryPoint/action|Apply Recovery Point|
|/vaults/replicationFabrics/replicationProtectionContainers/<br>replicationProtectedItems/recoveryPoints/read|Read Any Replication Recovery Points|
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
|/Vaults/backupFabrics/operationResults/read|Returns status of the operation|
|/Vaults/backupFabrics/protectionContainers/read|Returns all registered containers|
|/Vaults/backupFabrics/protectionContainers/<br>operationResults/read|Gets result of Operation performed on Protection Container.|
|/Vaults/backupFabrics/protectionContainers/<br>protectedItems/read|Returns object details of the Protected Item|
|/Vaults/backupFabrics/protectionContainers/<br>protectedItems/write|Create a backup Protected Item|
|/Vaults/backupFabrics/protectionContainers/<br>protectedItems/delete|Deletes Protected Item|
|/Vaults/backupFabrics/protectionContainers/<br>protectedItems/backup/action|Performs Backup for Protected Item.|
|/Vaults/backupFabrics/protectionContainers/<br>protectedItems/operationResults/read|Gets Result of Operation Performed on Protected Items.|
|/Vaults/backupFabrics/protectionContainers/<br>protectedItems/operationStatus/read|Returns the status of Operation performed on Protected Items.|
|/Vaults/backupFabrics/protectionContainers/<br>protectedItems/recoveryPoints/read|Get Recovery Points for Protected Items.|
|/Vaults/backupFabrics/protectionContainers/<br>protectedItems/recoveryPoints/<br>restore/action|Restore Recovery Points for Protected Items.|
|/Vaults/backupFabrics/protectionContainers/<br>protectedItems/recoveryPoints/<br>provisionInstantItemRecovery/action|Provision Instant Item Recovery for Protected Item|
|/Vaults/backupFabrics/protectionContainers/<br>protectedItems/recoveryPoints/<br>revokeInstantItemRecovery/action|Revoke Instant Item Recovery for Protected Item|
|/Vaults/usages/read|Returns usage details for a Recovery Services Vault.|
|/vaults/usages/read|Read Any Vault Usages|
|/Vaults/certificates/write|The Update Resource Certificate operation updates the resource/vault credential certificate.|
|/Vaults/tokenInfo/read|Returns token information for Recovery Services Vault.|
|/vaults/replicationAlertSettings/read|Read Any Alerts Settings|
|/vaults/replicationAlertSettings/write|Create or Update Any Alerts Settings|
|/Vaults/backupOperations/read|Returns Backup Operation Status for Recovery Services Vault.|
|/Vaults/storageConfig/read|Returns Storage Configuration for Recovery Services Vault.|
|/Vaults/storageConfig/write|Updates Storage Configuration for Recovery Services Vault.|
|/Vaults/backupUsageSummaries/read|Returns summaries for Protected Items and Protected Servers for a Recovery Services .|
|/Vaults/backupProtectedItems/read|Returns the list of all Protected Items.|
|/Vaults/backupconfig/vaultconfig/read|Returns Configuration for Recovery Services Vault.|
|/Vaults/backupconfig/vaultconfig/write|Updates Configuration for Recovery Services Vault.|
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
|/Vaults/backupPolicies/operationStatus/read|Get Status of Policy Operation.|
|/Vaults/vaultTokens/read|The Vault Token operation can be used to get Vault Token for vault level backend operations.|
|/Vaults/monitoringConfigurations/notificationConfiguration/read|Gets the Recovery services vault notification configuration.|
|/Vaults/backupJobs/read|Returns all Job Objects|
|/Vaults/backupJobs/cancel/action|Cancel the Job|
|/Vaults/backupJobs/operationResults/read|Returns the Result of Job Operation.|
|/locations/allocateStamp/action|AllocateStamp is internal operation used by service|
|/locations/allocatedStamp/read|GetAllocatedStamp is internal operation used by service|

## Microsoft.Relay

| Operation | Description |
|---|---|
|/checkNamespaceAvailability/action|Checks availability of namespace under given subscription.|
|/register/action|Registers the subscription for the Relay resource provider and enables the creation of Relay resources|
|/namespaces/write|Create a Namespace Resource and Update its properties. Tags and status of the Namespace are the properties which can be updated.|
|/namespaces/read|Get the list of Namespace Resource Description|
|/namespaces/Delete|Delete Namespace Resource|
|/namespaces/authorizationRules/write|Create a Namespace level Authorization Rules and update its properties. The Authorization Rules Access Rights, the Primary and Secondary Keys can be updated.|
|/namespaces/authorizationRules/delete|Delete Namespace Authorization Rule. The Default Namespace Authorization Rule cannot be deleted. |
|/namespaces/authorizationRules/listkeys/action|Get the Connection String to the Namespace|
|/namespaces/HybridConnections/write|Create or Update HybridConnection properties.|
|/namespaces/HybridConnections/read|Get list of HybridConnection Resource Descriptions|
|/namespaces/HybridConnections/Delete|Operation to delete HybridConnection Resource|
|/namespaces/HybridConnections/authorizationRules/write|Create HybridConnection Authorization Rules and Update its properties. The Authorization Rules Access Rights, the Primary and Secondary Keys can be updated.|
|/namespaces/HybridConnections/authorizationRules/delete|Operation to delete HybridConnection Authorization Rules|
|/namespaces/HybridConnections/authorizationRules/listkeys/action|Get the Connection String to HybridConnection|
|/namespaces/WcfRelays/write|Create or Update WcfRelay properties.|
|/namespaces/WcfRelays/read|Get list of WcfRelay Resource Descriptions|
|/namespaces/WcfRelays/Delete|Operation to delete WcfRelay Resource|
|/namespaces/WcfRelays/authorizationRules/write|Create WcfRelay Authorization Rules and Update its properties. The Authorization Rules Access Rights, the Primary and Secondary Keys can be updated.|
|/namespaces/WcfRelays/authorizationRules/delete|Operation to delete WcfRelay Authorization Rules|
|/namespaces/WcfRelays/authorizationRules/listkeys/action|Get the Connection String to WcfRelay|

## Microsoft.ResourceHealth

| Operation | Description |
|---|---|
|/AvailabilityStatuses/read|Gets the availability statuses for all resources in the specified scope|
|/AvailabilityStatuses/current/read|Gets the availability status for the specified resource|

## Microsoft.Resources

| Operation | Description |
|---|---|
|/checkResourceName/action|Check the resource name for validity.|
|/providers/read|Get the list of providers.|
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
|/searchServices/queryKey/read|Reads the query keys.|
|/searchServices/queryKey/delete|Deletes the query key.|

## Microsoft.Security

| Operation | Description |
|---|---|
|/jitNetworkAccessPolicies/read|Gets the just-in-time network access policies|
|/jitNetworkAccessPolicies/write|Creates a new just-in-time network access policy or updates an existing one|
|/jitNetworkAccessPolicies/initiate/action|Initiates a just-in-time network access policy|
|/securitySolutionsReferenceData/read|Gets the security solutions reference data|
|/securityStatuses/read|Gets the security health statuses for Azure resources|
|/webApplicationFirewalls/read|Gets the web application firewalls|
|/webApplicationFirewalls/write|Creates a new web application firewall or updates an existing one|
|/webApplicationFirewalls/delete|Deletes a web application firewall|
|/securitySolutions/read|Gets the security solutions|
|/securitySolutions/write|Creates a new security solution or updates an existing one|
|/securitySolutions/delete|Deletes a security solution|
|/tasks/read|Gets all available security recommendations|
|/tasks/dismiss/action|Dismiss a security recommendation|
|/tasks/activate/action|Activate a security recommendation|
|/policies/read|Gets the security policy|
|/policies/write|Updates the security policy|
|/applicationWhitelistings/read|Gets the application whitelistings|
|/applicationWhitelistings/write|Creates a new application whitelisting or updates an existing one|

## Microsoft.ServerManagement

| Operation | Description |
|---|---|
|/subscriptions/write|Creates or updates a subscription|
|/gateways/write|Creates or updates a gateway|
|/gateways/delete|Deletes a gateway|
|/gateways/read|Gets a gateway|
|/gateways/regenerateprofile/action|Regenerates the gateway profile|
|/gateways/upgradetolatest/action|Upgrades the gateway to the latest version|
|/nodes/write|creates or updates a node|
|/nodes/delete|Deletes a node|
|/nodes/read|Gets a node|
|/sessions/write|Creates or updates a session|
|/sessions/read|Gets a session|
|/sessions/delete|Deletes a sesssion|

## Microsoft.ServiceBus

| Operation | Description |
|---|---|
|/checkNameAvailability/action|Checks availability of namespace under given subscription.|
|/register/action|Registers the subscription for the ServiceBus resource provider and enables the creation of ServiceBus resources|
|/namespaces/write|Create a Namespace Resource and Update its properties. Tags and status of the Namespace are the properties which can be updated.|
|/namespaces/read|Get the list of Namespace Resource Description|
|/namespaces/Delete|Delete Namespace Resource|
|/namespaces/metricDefinitions/read|Get list of Namespace metrics Resource Descriptions|
|/namespaces/authorizationRules/write|Create a Namespace level Authorization Rules and update its properties. The Authorization Rules Access Rights, the Primary and Secondary Keys can be updated.|
|/namespaces/authorizationRules/read|Get the list of Namespaces Authorization Rules description.|
|/namespaces/authorizationRules/delete|Delete Namespace Authorization Rule. The Default Namespace Authorization Rule cannot be deleted. |
|/namespaces/authorizationRules/listkeys/action|Get the Connection String to the Namespace|
|/namespaces/authorizationRules/regenerateKeys/action|Regenerate the Primary or Secondary key to the Resource|
|/namespaces/diagnosticSettings/read|Get list of Namespace diagnostic settings Resource Descriptions|
|/namespaces/diagnosticSettings/write|Get list of Namespace diagnostic settings Resource Descriptions|
|/namespaces/queues/write|Create or Update Queue properties.|
|/namespaces/queues/read|Get list of Queue Resource Descriptions|
|/namespaces/queues/Delete|Operation to delete Queue Resource|
|/namespaces/queues/authorizationRules/write|Create Queue Authorization Rules and Update its properties. The Authorization Rules Access Rights, the Primary and Secondary Keys can be updated.|
|/namespaces/queues/authorizationRules/read| Get the list of Queue Authorization Rules|
|/namespaces/queues/authorizationRules/delete|Operation to delete Queue Authorization Rules|
|/namespaces/queues/authorizationRules/listkeys/action|Get the Connection String to Queue|
|/namespaces/queues/authorizationRules/regenerateKeys/action|Regenerate the Primary or Secondary key to the Resource|
|/namespaces/logDefinitions/read|Get list of Namespace logs Resource Descriptions|
|/namespaces/topics/write|Create or Update Topic properties.|
|/namespaces/topics/read|Get list of Topic Resource Descriptions|
|/namespaces/topics/Delete|Operation to delete Topic Resource|
|/namespaces/topics/authorizationRules/write|Create Topic Authorization Rules and Update its properties. The Authorization Rules Access Rights, the Primary and Secondary Keys can be updated.|
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

## Microsoft.Sql

| Operation | Description |
|---|---|
|/servers/read|Return a list of servers in a resource group on a subscription|
|/servers/write|Create a new server or modify properties of existing server in a resource group on a subscription|
|/servers/delete|Delete a server and all contained databases and elastic pools|
|/servers/import/action|Create a new database on the server and deploy schema and data from a DacPac package|
|/servers/upgrade/action|Enable new functionality available on the latest version of server and specify databases edition conversion map|
|/servers/VulnerabilityAssessmentScans/action|Execute vulnerability assessment server scan|
|/servers/operationResults/read|Operation is used to track progress of server upgrade from lower version to higher|
|/servers/operationResults/delete|Abort server version upgrade in progress|
|/servers/securityAlertPolicies/read|Retrieve details of the server threat detection policy configured on a given server|
|/servers/securityAlertPolicies/write|Change the server threat detection for a given server|
|/servers/securityAlertPolicies/operationResults/read|Retrieve results of the server Threat Detection policy Set operation|
|/servers/administrators/read|Retrieve server administrator details|
|/servers/administrators/write|Create or update server administrator|
|/servers/administrators/delete|Delete server administrator from the server|
|/servers/recoverableDatabases/read|This operation is used for disaster recovery of live database to restore database to last-known good backup point. It returns information about the last good backup but it doesn't actually restore the database.|
|/servers/serviceObjectives/read|Retrieve list of service level objectives (also known as performance tiers) available on a given server|
|/servers/firewallRules/read|Retrieve server firewall rule details|
|/servers/firewallRules/write|Create or update server firewall rule that controls IP address range allowed to connect to the server|
|/servers/firewallRules/delete|Delete firewall rule from the server|
|/servers/administratorOperationResults/read|Retrieve server administrator operation results|
|/servers/recommendedElasticPools/read|Retrieve recommendation for elastic database pools to reduce cost or improve performance based on historica resource utilization|
|/servers/recommendedElasticPools/metrics/read|Retrieve metrics for recommended elastic database pools for a given server|
|/servers/recommendedElasticPools/databases/read|Retrieve databases that should be added into recommended elastic database pools for a given server|
|/servers/elasticPools/read|Retrieve details of elastic database pool on a given server|
|/servers/elasticPools/write|Create a new or change properties of existing elastic database pool|
|/servers/elasticPools/delete|Delete existing elastic database pool|
|/servers/elasticPools/operationResults/read|Retrieve details on a given elastic database pool operation|
|/servers/elasticPools/providers/Microsoft.Insights/<br>metricDefinitions/read|Return types of metrics that are available for elastic database pools|
|/servers/elasticPools/providers/Microsoft.Insights/<br>diagnosticSettings/read|Gets the diagnostic setting for the resource|
|/servers/elasticPools/providers/Microsoft.Insights/<br>diagnosticSettings/write|Creates or updates the diagnostic setting for the resource|
|/servers/elasticPools/metrics/read|Return elastic database pool resource utilization metrics|
|/servers/elasticPools/elasticPoolDatabaseActivity/read|Retrieve activities and details on a given database that is part of elastic database pool|
|/servers/elasticPools/advisors/read|Returns list of advisors available for the elastic pool|
|/servers/elasticPools/advisors/write|Update auto-execute status of an advisor on elastic pool level.|
|/servers/elasticPools/advisors/recommendedActions/read|Returns list of recommended actions of specified advisor for the elastic pool|
|/servers/elasticPools/advisors/recommendedActions/write|Apply the recommended action on the elastic pool|
|/servers/elasticPools/elasticPoolActivity/read|Retrieve activities and details on a given elastic database pool|
|/servers/elasticPools/databases/read|Retrieve list and details of databases that are part of elastic database pool on a given server|
|/servers/auditingPolicies/read|Retrieve details of the default server table auditing policy configured on a given server|
|/servers/auditingPolicies/write|Change the default server table auditing for a given server|
|/servers/disasterRecoveryConfiguration/operationResults/read|Get Disaster Recovery Configuration Operation Results|
|/servers/advisors/read|Returns list of advisors available for the server|
|/servers/advisors/write|Updates auto-execute status of an advisor on server level.|
|/servers/advisors/recommendedActions/read|Returns list of recommended actions of specified advisor for the server|
|/servers/advisors/recommendedActions/write|Apply the recommended action on the server|
|/servers/usages/read|Return server DTU quota and current DTU consuption by all databases within the server|
|/servers/elasticPoolEstimates/read|Returns list of elastic pool estimates already created for this server|
|/servers/elasticPoolEstimates/write|Creates new elastic pool estimate for list of databases provided|
|/servers/auditingSettings/read|Retrieve details of the server blob auditing policy configured on a given server|
|/servers/auditingSettings/write|Change the server blob auditing for a given server|
|/servers/auditingSettings/operationResults/read|Retrieve result of the server blob auditing policy Set operation|
|/servers/backupLongTermRetentionVaults/read|This operation is used to get a backup long term retention vault. It returns information about the vault registered to this server.|
|/servers/backupLongTermRetentionVaults/write|Register a backup long term retention vault|
|/servers/restorableDroppedDatabases/read|Retrieve a list of databases that were dropped on a given server that are still within retention policy. This operation returns a list of databases and associated metadata, like date of deletion.|
|/servers/databases/read|Return a list of servers in a resource group on a subscription|
|/servers/databases/write|Create a new server or modify properties of existing server in a resource group on a subscription|
|/servers/databases/delete|Delete a server and all contained databases and elastic pools|
|/servers/databases/export/action|Create a new database on the server and deploy schema and data from a DacPac package|
|/servers/databases/VulnerabilityAssessmentScans/action|Execute vulnerability assessment database scan.|
|/servers/databases/pause/action|Pause a DataWarehouse edition database|
|/servers/databases/resume/action|Resume a DataWarehouse edition database|
|/servers/databases/operationResults/read|Operation is used to track progress of long running database operation, such as scale.|
|/servers/databases/replicationLinks/read|Return details about replication links established for a particular database|
|/servers/databases/replicationLinks/delete|Terminate the replication relationship forcefully and with potential data loss|
|/servers/databases/replicationLinks/unlink/action|Terminate the replication relationship forcefully or after synchronizing with the partner|
|/servers/databases/replicationLinks/failover/action|Failover after synchronizing all changes from the primary, making this database into the replication relationship's primary and making the remote primary into a secondary|
|/servers/databases/replicationLinks/forceFailoverAllowDataLoss/action|Failover immediately with potential data loss, making this database into the replication relationship's primary and making the remote primary into a secondary|
|/servers/databases/replicationLinks/updateReplicationMode/action|Update replication mode for link to synchronous or asynchronous mode|
|/servers/databases/replicationLinks/operationResults/read|Get status of long-running operations on database replication links|
|/servers/databases/dataMaskingPolicies/read|Retrieve details of the data masking policy configured on a given database|
|/servers/databases/dataMaskingPolicies/write|Change data masking policy for a given database|
|/servers/databases/dataMaskingPolicies/rules/read|Retrieve details of the data masking policy rule configured on a given database|
|/servers/databases/dataMaskingPolicies/rules/write|Change data masking policy rule for a given database|
|/servers/databases/securityAlertPolicies/read|Retrieve details of the threat detection policy configured on a given database|
|/servers/databases/securityAlertPolicies/write|Change the threat detection policy for a given database|
|/servers/databases/providers/Microsoft.Insights/<br>metricDefinitions/read|Return types of metrics that are available for databases|
|/servers/databases/providers/Microsoft.Insights/<br>diagnosticSettings/read|Gets the diagnostic setting for the resource|
|/servers/databases/providers/Microsoft.Insights/<br>diagnosticSettings/write|Creates or updates the diagnostic setting for the resource|
|/servers/databases/providers/Microsoft.Insights/<br>logDefinitions/read|Gets the available logs for databases|
|/servers/databases/topQueries/read|Returns aggregated runtime statistics for selected query in selected time period|
|/servers/databases/topQueries/queryText/read|Returns the Transact-SQL text for selected query ID|
|/servers/databases/topQueries/statistics/read|Returns aggregated runtime statistics for selected query in selected time period|
|/servers/databases/connectionPolicies/read|Retrieve details of the connection policy configured on a given database|
|/servers/databases/connectionPolicies/write|Change connection policy for a given database|
|/servers/databases/metrics/read|Return database resource utilization metrics|
|/servers/databases/auditRecords/read|Retrieve the database blob audit records|
|/servers/databases/transparentDataEncryption/read|Retrieve status and details of transparent data encryption security feature for a given database|
|/servers/databases/transparentDataEncryption/write|Enable or disable transparent data encryption for a given database|
|/servers/databases/transparentDataEncryption/operationResults/read|Retrieve status and details of transparent data encryption security feature for a given database|
|/servers/databases/auditingPolicies/read|Retrieve details of the table auditing policy configured on a given database|
|/servers/databases/auditingPolicies/write|Change the table auditing policy for a given database|
|/servers/databases/dataWarehouseQueries/read|Returns the data warehouse distribution query information for selected query ID|
|/servers/databases/dataWarehouseQueries/<br>dataWarehouseQuerySteps/read|Returns the distributed query step information of data warehouse query for selected step ID|
|/servers/databases/serviceTierAdvisors/read|Return suggestion about scaling database up or down based on query execution statistics to improve performance or reduce cost|
|/servers/databases/advisors/read|Returns list of advisors available for the database|
|/servers/databases/advisors/write|Update auto-execute status of an advisor on database level.|
|/servers/databases/advisors/recommendedActions/read|Returns list of recommended actions of specified advisor for the database|
|/servers/databases/advisors/recommendedActions/write|Apply the recommended action on the database|
|/servers/databases/usages/read|Return database maxiumum size that can be reached and current size occupied by data|
|/servers/databases/queryStore/read|Returns current values of Query Store settings for the database|
|/servers/databases/queryStore/write|Updates Query Store setting for the database|
|/servers/databases/auditingSettings/read|Retrieve details of the blob auditing policy configured on a given database|
|/servers/databases/auditingSettings/write|Change the blob auditing policy for a given database|
|/servers/databases/schemas/tables/recommendedIndexes/read|Retrieve list of index recommendations on a database|
|/servers/databases/schemas/tables/recommendedIndexes/write|Apply index recommendation|
|/servers/databases/schemas/tables/columns/read|Retrieve list of columns of a table|
|/servers/databases/missingindexes/read|Return suggestions about database indexes to create, modify or delete in order to improve query performance|
|/servers/databases/missingindexes/write|Use database index recommendation in a particular database|
|/servers/databases/importExportOperationResults/read|Return details about database import or export operation from DacPac located in storage account|
|/servers/importExportOperationResults/read|Return the list with details for database import operations from storage account on a given server|

## Microsoft.Storage

| Operation | Description |
|---|---|
|/register/action|Registers the subscription for the storage resource provider and enables the creation of storage accounts.|
|/checknameavailability/read|Checks that account name is valid and is not in use.|
|/storageAccounts/write|Creates a storage account with the specified parameters or update the properties or tags or adds custom domain for the specified storage account.|
|/storageAccounts/delete|Deletes an existing storage account.|
|/storageAccounts/listkeys/action|Returns the access keys for the specified storage account.|
|/storageAccounts/regeneratekey/action|Regenerates the access keys for the specified storage account.|
|/storageAccounts/read|Returns the list of storage accounts or gets the properties for the specified storage account.|
|/storageAccounts/listAccountSas/action|Returns the Account SAS token for the specified storage account.|
|/storageAccounts/listServiceSas/action|Storage Service SAS Token|
|/storageAccounts/services/diagnosticSettings/write|Create/Update storage account diagnostic settings.|
|/skus/read|Lists the Skus supported by Microsoft.Storage.|
|/usages/read|Returns the limit and the current usage count for resources in the specified subscription|
|/operations/read|Polls the status of an asynchronous operation.|
|/locations/deleteVirtualNetworkOrSubnets/action|Notifies Microsoft.Storage that virtual network or subnet is being deleted|

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
|/managers/devices/hardwareComponentGroups/<br>read|List the Hardware Component Groups|
|/managers/devices/hardwareComponentGroups/<br>changeControllerPowerState/action|Change controller power state of hardware component groups|
|/managers/devices/metrics/read|Lists or gets the Metrics|
|/managers/devices/chapSettings/write|Create or update the Chap Settings|
|/managers/devices/chapSettings/read|Lists or gets the Chap Settings|
|/managers/devices/chapSettings/delete|Deletes the Chap Settings|
|/managers/devices/backupScheduleGroups/read|Lists or gets the Backup Schedule Groups|
|/managers/devices/backupScheduleGroups/write|Create or update the Backup Schedule Groups|
|/managers/devices/backupScheduleGroups/delete|Deletes the Backup Schedule Groups|
|/managers/devices/updateSummary/read|Lists or gets the Update Summary|
|/managers/devices/migrationSourceConfigurations/<br>import/action|Import source configurations for migration|
|/managers/devices/migrationSourceConfigurations/<br>startMigrationEstimate/action|Start a job to estimate the duration of the migration process.|
|/managers/devices/migrationSourceConfigurations/<br>startMigration/action|Start migration using source configurations|
|/managers/devices/migrationSourceConfigurations/<br>confirmMigration/action|Confirms a successful migration and commit it.|
|/managers/devices/migrationSourceConfigurations/<br>fetchMigrationEstimate/action|Fetch the status for the migration estimation job.|
|/managers/devices/migrationSourceConfigurations/<br>fetchMigrationStatus/action|Fetch the status for the migration.|
|/managers/devices/migrationSourceConfigurations/<br>fetchConfirmMigrationStatus/action|Fetch the confirm status of migration.|
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
|/managers/devices/securitySettings/<br>syncRemoteManagementCertificate/action|Synchronize the remote management certificate for a device.|
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
|/streamingjobs/Start/action|Start Stream Analytics Job|
|/streamingjobs/Stop/action|Stop Stream Analytics Job|
|/streamingjobs/Read|Read Stream Analytics Job|
|/streamingjobs/Write|Write Stream Analytics Job|
|/streamingjobs/Delete|Delete Stream Analytics Job|
|/streamingjobs/providers/Microsoft.Insights/metricDefinitions/read|Gets the available metrics for streamingjobs|
|/streamingjobs/providers/Microsoft.Insights/diagnosticSettings/read|Read diagnostic setting.|
|/streamingjobs/providers/Microsoft.Insights/diagnosticSettings/write|Write diagnostic setting.|
|/streamingjobs/providers/Microsoft.Insights/logDefinitions/read|Gets the available logs for streamingjobs|
|/streamingjobs/transformations/Read|Read Stream Analytics Job Transformation|
|/streamingjobs/transformations/Write|Write Stream Analytics Job Transformation|
|/streamingjobs/transformations/Delete|Delete Stream Analytics Job Transformation|
|/streamingjobs/inputs/Read|Read Stream Analytics Job Input|
|/streamingjobs/inputs/Write|Write Stream Analytics Job Input|
|/streamingjobs/inputs/Delete|Delete Stream Analytics Job Input|
|/streamingjobs/outputs/Read|Read Stream Analytics Job Output|
|/streamingjobs/outputs/Write|Write Stream Analytics Job Output|
|/streamingjobs/outputs/Delete|Delete Stream Analytics Job Output|

## Microsoft.Support

| Operation | Description |
|---|---|
|/register/action|Registers to Support Resource Provider|
|/supportTickets/read|Gets Support Ticket details (including status, severity, contact details and communications) or gets the list of Support Tickets across subscriptions.|
|/supportTickets/write|Creates or Updates a Support Ticket. You can create a Support Ticket for Technical, Billing, Quotas or Subscription Management related issues. You can update severity, contact details and communications for existing support tickets.|

## Microsoft.Web

| Operation | Description |
|---|---|
|/unregister/action|Unregister Microsoft.Web resource provider for the subscription.|
|/validate/action|Validate .|
|/register/action|Register Microsoft.Web resource provider for the subscription.|
|/hostingEnvironments/Read|Get the properties of an App Service Environment|
|/hostingEnvironments/Write|Create a new App Service Environment or update existing one|
|/hostingEnvironments/Delete|Delete an App Service Environment|
|/hostingEnvironments/reboot/Action|Reboot all machines in an App Service Environment|
|/hostingenvironments/resume/action|Resume Hosting Environments.|
|/hostingenvironments/suspend/action|Suspend Hosting Environments.|
|/hostingenvironments/metricdefinitions/read|Get Hosting Environments Metric Definitions.|
|/hostingEnvironments/workerPools/Read|Get the properties of a Worker Pool in an App Service Environment|
|/hostingEnvironments/workerPools/Write|Create a new Worker Pool in an App Service Environment or update an existing one|
|/hostingenvironments/workerpools/metricdefinitions/read|Get Hosting Environments Workerpools Metric Definitions.|
|/hostingenvironments/workerpools/metrics/read|Get Hosting Environments Workerpools Metrics.|
|/hostingenvironments/workerpools/skus/read|Get Hosting Environments Workerpools SKUs.|
|/hostingenvironments/workerpools/usages/read|Get Hosting Environments Workerpools Usages.|
|/hostingenvironments/sites/read|Get Hosting Environments Web Apps.|
|/hostingenvironments/serverfarms/read|Get Hosting Environments App Service Plans.|
|/hostingenvironments/usages/read|Get Hosting Environments Usages.|
|/hostingenvironments/capacities/read|Get Hosting Environments Capacities.|
|/hostingenvironments/operations/read|Get Hosting Environments Operations.|
|/hostingEnvironments/multiRolePools/Read|Get the properties of a FrontEnd Pool in an App Service Environment|
|/hostingEnvironments/multiRolePools/Write|Create a new FrontEnd Pool in an App Service Environment or update an existing one|
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
|/sites/operationresults/read|Get Web Apps Operation Results.|
|/sites/webjobs/read|Get Web Apps WebJobs.|
|/sites/backup/read|Get Web Apps Backup.|
|/sites/backup/write|Update Web Apps Backup.|
|/sites/metricdefinitions/read|Get Web Apps Metric Definitions.|
|/sites/metrics/read|Get Web Apps Metrics.|
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
|/sites/hostnamebindings/delete|Delete Web Apps Hostname Bindings.|
|/sites/hostnamebindings/read|Get Web Apps Hostname Bindings.|
|/sites/hostnamebindings/write|Update Web Apps Hostname Bindings.|
|/sites/virtualnetworkconnections/delete|Delete Web Apps Virtual Network Connections.|
|/sites/virtualnetworkconnections/read|Get Web Apps Virtual Network Connections.|
|/sites/virtualnetworkconnections/write|Update Web Apps Virtual Network Connections.|
|/sites/virtualnetworkconnections/gateways/read|Get Web Apps Virtual Network Connections Gateways.|
|/sites/virtualnetworkconnections/gateways/write|Update Web Apps Virtual Network Connections Gateways.|
|/sites/publishxml/read|Get Web Apps Publishing XML.|
|/sites/hybridconnectionrelays/read|Get Web Apps Hybrid Connection Relays.|
|/sites/perfcounters/read|Get Web Apps Performance Counters.|
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
|/sites/slots/operationresults/read|Get Web Apps Slots Operation Results.|
|/sites/slots/webjobs/read|Get Web Apps Slots WebJobs.|
|/sites/slots/backup/write|Update Web Apps Slots Backup.|
|/sites/slots/metricdefinitions/read|Get Web Apps Slots Metric Definitions.|
|/sites/slots/metrics/read|Get Web Apps Slots Metrics.|
|/sites/slots/continuouswebjobs/delete|Delete Web Apps Slots Continuous Web Jobs.|
|/sites/slots/continuouswebjobs/read|Get Web Apps Slots Continuous Web Jobs.|
|/sites/slots/continuouswebjobs/start/action|Start Web Apps Slots Continuous Web Jobs.|
|/sites/slots/continuouswebjobs/stop/action|Stop Web Apps Slots Continuous Web Jobs.|
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
|/sites/slots/usages/read|Get Web Apps Slots Usages.|
|/sites/slots/hybridconnection/delete|Delete Web Apps Slots Hybrid Connection.|
|/sites/slots/hybridconnection/read|Get Web Apps Slots Hybrid Connection.|
|/sites/slots/hybridconnection/write|Update Web Apps Slots Hybrid Connection.|
|/sites/slots/config/Read|Get Web App Slot's configuration settings|
|/sites/slots/config/list/Action|List Web App Slot's security sensitive settings, such as publishing credentials, app settings and connection strings|
|/sites/slots/config/Write|Update Web App Slot's configuration settings|
|/sites/slots/config/delete|Delete Web Apps Slots Config.|
|/sites/slots/instances/read|Get Web Apps Slots Instances.|
|/sites/slots/instances/processes/read|Get Web Apps Slots Instances Processes.|
|/sites/slots/instances/deployments/read|Get Web Apps Slots Instances Deployments.|
|/sites/slots/sourcecontrols/Read|Get Web App Slot's source control configuration settings|
|/sites/slots/sourcecontrols/Write|Update Web App Slot's source control configuration settings|
|/sites/slots/sourcecontrols/Delete|Delete Web App Slot's source control configuration settings|
|/sites/slots/restore/read|Get Web Apps Slots Restore.|
|/sites/slots/analyzecustomhostname/read|Get Web Apps Slots Analyze Custom Hostname.|
|/sites/slots/backups/Read|Get the properties of a web app slots' backup|
|/sites/slots/backups/list/action|List Web Apps Slots Backups.|
|/sites/slots/backups/restore/action|Restore Web Apps Slots Backups.|
|/sites/slots/deployments/delete|Delete Web Apps Slots Deployments.|
|/sites/slots/deployments/read|Get Web Apps Slots Deployments.|
|/sites/slots/deployments/write|Update Web Apps Slots Deployments.|
|/sites/slots/deployments/log/read|Get Web Apps Slots Deployments Log.|
|/sites/hybridconnection/delete|Delete Web Apps Hybrid Connection.|
|/sites/hybridconnection/read|Get Web Apps Hybrid Connection.|
|/sites/hybridconnection/write|Update Web Apps Hybrid Connection.|
|/sites/recommendationhistory/read|Get Web Apps Recommendation History.|
|/sites/recommendations/Read|Get the list of recommendations for web app.|
|/sites/recommendations/disable/action|Disable Web Apps Recommendations.|
|/sites/config/Read|Get Web App configuration settings|
|/sites/config/list/Action|List Web App's security sensitive settings, such as publishing credentials, app settings and connection strings|
|/sites/config/Write|Update Web App's configuration settings|
|/sites/config/delete|Delete Web Apps Config.|
|/sites/instances/read|Get Web Apps Instances.|
|/sites/instances/processes/delete|Delete Web Apps Instances Processes.|
|/sites/instances/processes/read|Get Web Apps Instances Processes.|
|/sites/instances/deployments/read|Get Web Apps Instances Deployments.|
|/sites/sourcecontrols/Read|Get Web App's source control configuration settings|
|/sites/sourcecontrols/Write|Update Web App's source control configuration settings|
|/sites/sourcecontrols/Delete|Delete Web App's source control configuration settings|
|/sites/restore/read|Get Web Apps Restore.|
|/sites/analyzecustomhostname/read|Analyze Custom Hostname.|
|/sites/backups/Read|Get the properties of a web app's backup|
|/sites/backups/list/action|List Web Apps Backups.|
|/sites/backups/restore/action|Restore Web Apps Backups.|
|/sites/snapshots/read|Get Web Apps Snapshots.|
|/sites/functions/delete|Delete Web Apps Functions.|
|/sites/functions/listsecrets/action|List Secrets Web Apps Functions.|
|/sites/functions/read|Get Web Apps Functions.|
|/sites/functions/write|Update Web Apps Functions.|
|/sites/deployments/delete|Delete Web Apps Deployments.|
|/sites/deployments/read|Get Web Apps Deployments.|
|/sites/deployments/write|Update Web Apps Deployments.|
|/sites/deployments/log/read|Get Web Apps Deployments Log.|
|/sites/diagnostics/read|Get Web Apps Diagnostics.|
|/sites/diagnostics/workerprocessrecycle/read|Get Web Apps Diagnostics Worker Process Recycle.|
|/sites/diagnostics/workeravailability/read|Get Web Apps Diagnostics Workeravailability.|
|/sites/diagnostics/runtimeavailability/read|Get Web Apps Diagnostics Runtime Availability.|
|/sites/diagnostics/cpuanalysis/read|Get Web Apps Diagnostics Cpuanalysis.|
|/sites/diagnostics/servicehealth/read|Get Web Apps Diagnostics Service Health.|
|/sites/diagnostics/frebanalysis/read|Get Web Apps Diagnostics FREB Analysis.|
|/availablestacks/read|Get Available Stacks.|
|/isusernameavailable/read|Check if Username is available.|
|/Microsoft.Web/apiManagementAccounts/<br>apis/Read|Get the list of Apis.|
|/Microsoft.Web/apiManagementAccounts/<br>apis/Write|Add a new Api or update existing one.|
|/Microsoft.Web/apiManagementAccounts/<br>apis/Delete|Delete an existing Api.|
|/Microsoft.Web/apiManagementAccounts/<br>apis/connections/Read|Get the list of Connections.|
|/Microsoft.Web/apiManagementAccounts/<br>apis/connections/Write|Save a new Connection or update an existing one.|
|/Microsoft.Web/apiManagementAccounts/<br>apis/connections/Delete|Delete an existing Connection.|
|/Microsoft.Web/apiManagementAccounts/<br>apis/connections/connectionAcls/Read|Read ConnectionAcls|
|/Microsoft.Web/apiManagementAccounts/<br>apis/connections/connectionAcls/Write|Add or update ConnectionAcl|
|/Microsoft.Web/apiManagementAccounts/<br>apis/connections/connectionAcls/Delete|Delete ConnectionAcl|
|/Microsoft.Web/apiManagementAccounts/<br>apis/connectionAcls/Read|Read ConnectionAcls for Api|
|/Microsoft.Web/apiManagementAccounts/<br>apis/apiAcls/Read|Read ConnectionAcls|
|/Microsoft.Web/apiManagementAccounts/<br>apis/apiAcls/Write|Create or update Api Acls|
|/Microsoft.Web/apiManagementAccounts/<br>apis/apiAcls/Delete|Delete Api Acls|
|/serverfarms/Read|Get the properties on an App Service Plan|
|/serverfarms/Write|Create a new App Service Plan or update an existing one|
|/serverfarms/Delete|Delete an existing App Service Plan|
|/serverfarms/restartSites/Action|Restart all Web Apps in an App Service Plan|
|/serverfarms/operationresults/read|Get App Service Plans Operation Results.|
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
|/serverfarms/hybridconnectionnamespaces/relays/sites/read|Get App Service Plans Hybrid Connection Namespaces Relays Web Apps.|
|/ishostnameavailable/read|Check if Hostname is Available.|
|/connectionGateways/Read|Get the list of Connection Gateways.|
|/connectionGateways/Write|Creates or updates a Connection Gateway.|
|/connectionGateways/Delete|Deletes a Connection Gateway.|
|/connectionGateways/Join/Action|Joins a Connection Gateway.|
|/classicmobileservices/read|Get Classic Mobile Services.|
|/skus/read|Get SKUs.|
|/certificates/Read|Get the list of certificates.|
|/certificates/Write|Add a new certificate or update an existing one.|
|/certificates/Delete|Delete an existing certificate.|
|/operations/read|Get Operations.|
|/recommendations/Read|Get the list of recommendations for subscriptions.|
|/ishostingenvironmentnameavailable/read|Get if Hosting Environment Name is available.|
|/apiManagementAccounts/Read|Get the list of ApiManagementAccounts.|
|/apiManagementAccounts/Write|Add a new ApiManagementAccount or update an existing one|
|/apiManagementAccounts/Delete|Delete an existing ApiManagementAccount|
|/apiManagementAccounts/connectionAcls/Read|Get the list of Connection Acls.|
|/apiManagementAccounts/apiAcls/Read|Read ConnectionAcls|
|/connections/Read|Get the list of Connections.|
|/connections/Write|Creates or updates a Connection.|
|/connections/Delete|Deletes a Connection.|
|/connections/Join/Action|Joins a Connection.|
|/connections/confirmconsentcode/action|Confirm Connections Consent Code.|
|/connections/listconsentlinks/action|List Consent Links for Connections.|
|/deploymentlocations/read|Get Deployment Locations.|
|/sourcecontrols/read|Get Source Controls.|
|/sourcecontrols/write|Update Source Controls.|
|/managedhostingenvironments/read|Get Managed Hosting Environments.|
|/managedhostingenvironments/sites/read|Get Managed Hosting Environments Web Apps.|
|/managedhostingenvironments/serverfarms/read|Get Managed Hosting Environments App Service Plans.|
|/locations/managedapis/read|Get Locations Managed APIs.|
|/locations/apioperations/read|Get Locations API Operations.|
|/locations/connectiongatewayinstallations/read|Get Locations Connection Gateway Installations.|
|/listSitesAssignedToHostName/Read|Get names of sites assigned to hostname.|

## Next steps

- Learn how to [create a custom role](role-based-access-control-custom-roles.md).

- Review the [built in RBAC roles](role-based-access-built-in-roles.md).

- Learn how to manage access assignments [by user](role-based-access-control-manage-assignments.md) or [by resource](role-based-access-control-configure.md) 

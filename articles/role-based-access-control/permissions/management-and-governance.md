---
title: Azure permissions for Management and governance - Azure RBAC
description: Lists the permissions for the Azure resource providers in the Management and governance category.
ms.service: role-based-access-control
ms.topic: reference
author: rolyon
manager: amycolannino
ms.author: rolyon
ms.date: 01/25/2025
ms.custom: generated
---

# Azure permissions for Management and governance

This article lists the permissions for the Azure resource providers in the Management and governance category. You can use these permissions in your own [Azure custom roles](/azure/role-based-access-control/custom-roles) to provide granular access control to resources in Azure. Permission strings have the following format: `{Company}.{ProviderName}/{resourceType}/{action}`


## Microsoft.Advisor

Your personalized Azure best practices recommendation engine.

Azure service: [Azure Advisor](/azure/advisor/)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.Advisor/generateRecommendations/action | Gets generate recommendations status |
> | Microsoft.Advisor/register/action | Registers the subscription for the Microsoft Advisor |
> | Microsoft.Advisor/unregister/action | Unregisters the subscription for the Microsoft Advisor |
> | Microsoft.Advisor/advisorScore/read | Gets the score data for given subscription |
> | Microsoft.Advisor/assessments/read | Read assessments |
> | Microsoft.Advisor/assessments/write | Write assessments |
> | Microsoft.Advisor/assessmentTypes/read | Read assessmentTypes |
> | Microsoft.Advisor/configurations/read | Get configurations |
> | Microsoft.Advisor/configurations/write | Creates/updates configuration |
> | Microsoft.Advisor/generateRecommendations/read | Gets generate recommendations status |
> | Microsoft.Advisor/metadata/read | Get Metadata |
> | Microsoft.Advisor/operations/read | Gets the operations for the Microsoft Advisor |
> | Microsoft.Advisor/recommendations/read | Reads recommendations |
> | Microsoft.Advisor/recommendations/write | Writes recommendations |
> | Microsoft.Advisor/recommendations/available/action | New recommendation is available in Microsoft Advisor |
> | Microsoft.Advisor/recommendations/suppressions/read | Gets suppressions |
> | Microsoft.Advisor/recommendations/suppressions/write | Creates/updates suppressions |
> | Microsoft.Advisor/recommendations/suppressions/delete | Deletes suppression |
> | Microsoft.Advisor/resiliencyReviews/read | Read resiliencyReviews |
> | Microsoft.Advisor/suppressions/read | Gets suppressions |
> | Microsoft.Advisor/suppressions/write | Creates/updates suppressions |
> | Microsoft.Advisor/suppressions/delete | Deletes suppression |
> | Microsoft.Advisor/triageRecommendations/read | Read triageRecommendations |
> | Microsoft.Advisor/triageRecommendations/approve/action | Approve triageRecommendations |
> | Microsoft.Advisor/triageRecommendations/reject/action | Reject triageRecommendations |
> | Microsoft.Advisor/triageRecommendations/reset/action | Reset triageRecommendations |
> | Microsoft.Advisor/workloads/read | Read workloads |

## Microsoft.Authorization

Azure service: [Azure Policy](/azure/governance/policy/overview), [Azure RBAC](/azure/role-based-access-control/overview), [Azure Resource Manager](/azure/azure-resource-manager/)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.Authorization/elevateAccess/action | Grants the caller User Access Administrator access at the tenant scope |
> | Microsoft.Authorization/classicAdministrators/read | Reads the administrators for the subscription. Does not have an effect if used as a NotAction in a custom role. |
> | Microsoft.Authorization/classicAdministrators/write | Add or modify administrator to a subscription. |
> | Microsoft.Authorization/classicAdministrators/delete | Removes the administrator from the subscription. |
> | Microsoft.Authorization/classicAdministrators/operationstatuses/read | Gets the administrator operation statuses of the subscription. |
> | Microsoft.Authorization/denyAssignments/read | Get information about a deny assignment. |
> | Microsoft.Authorization/denyAssignments/write | Create a deny assignment at the specified scope. |
> | Microsoft.Authorization/denyAssignments/delete | Delete a deny assignment at the specified scope. |
> | Microsoft.Authorization/diagnosticSettings/read | Read the information about diagnostics settings |
> | Microsoft.Authorization/diagnosticSettings/write | Create or update the information of diagnostics settings |
> | Microsoft.Authorization/diagnosticSettings/delete | Delete diagnostics settings |
> | Microsoft.Authorization/diagnosticSettingsCategories/read | Get the information about diagnostic settings categories |
> | Microsoft.Authorization/locks/read | Gets locks at the specified scope. |
> | Microsoft.Authorization/locks/write | Add locks at the specified scope. |
> | Microsoft.Authorization/locks/delete | Delete locks at the specified scope. |
> | Microsoft.Authorization/operations/read | Gets the list of operations |
> | Microsoft.Authorization/permissions/read | Lists all the permissions the caller has at a given scope. |
> | Microsoft.Authorization/policies/audit/action | Action taken as a result of evaluation of Azure Policy with 'audit' effect |
> | Microsoft.Authorization/policies/auditIfNotExists/action | Action taken as a result of evaluation of Azure Policy with 'auditIfNotExists' effect |
> | Microsoft.Authorization/policies/deny/action | Action taken as a result of evaluation of Azure Policy with 'deny' effect |
> | Microsoft.Authorization/policies/deployIfNotExists/action | Action taken as a result of evaluation of Azure Policy with 'deployIfNotExists' effect |
> | Microsoft.Authorization/policyAssignments/read | Get information about a policy assignment. |
> | Microsoft.Authorization/policyAssignments/write | Create a policy assignment at the specified scope. |
> | Microsoft.Authorization/policyAssignments/delete | Delete a policy assignment at the specified scope. |
> | Microsoft.Authorization/policyAssignments/exempt/action | Exempt a policy assignment at the specified scope. |
> | Microsoft.Authorization/policyAssignments/privateLinkAssociations/read | Get information about private link association. |
> | Microsoft.Authorization/policyAssignments/privateLinkAssociations/write | Creates or updates a private link association. |
> | Microsoft.Authorization/policyAssignments/privateLinkAssociations/delete | Deletes a private link association. |
> | Microsoft.Authorization/policyAssignments/resourceManagementPrivateLinks/read | Get information about resource management private link. |
> | Microsoft.Authorization/policyAssignments/resourceManagementPrivateLinks/write | Creates or updates a resource management private link. |
> | Microsoft.Authorization/policyAssignments/resourceManagementPrivateLinks/delete | Deletes a resource management private link. |
> | Microsoft.Authorization/policyAssignments/resourceManagementPrivateLinks/privateEndpointConnectionProxies/read | Get information about private endpoint connection proxy. |
> | Microsoft.Authorization/policyAssignments/resourceManagementPrivateLinks/privateEndpointConnectionProxies/write | Creates or updates a private endpoint connection proxy. |
> | Microsoft.Authorization/policyAssignments/resourceManagementPrivateLinks/privateEndpointConnectionProxies/delete | Deletes a private endpoint connection proxy. |
> | Microsoft.Authorization/policyAssignments/resourceManagementPrivateLinks/privateEndpointConnectionProxies/validate/action | Validates a private endpoint connection proxy. |
> | Microsoft.Authorization/policyAssignments/resourceManagementPrivateLinks/privateEndpointConnections/read | Get information about private endpoint connection. |
> | Microsoft.Authorization/policyAssignments/resourceManagementPrivateLinks/privateEndpointConnections/write | Creates or updates a private endpoint connection. |
> | Microsoft.Authorization/policyAssignments/resourceManagementPrivateLinks/privateEndpointConnections/delete | Deletes a private endpoint connection. |
> | Microsoft.Authorization/policyDefinitions/read | Get information about a policy definition. |
> | Microsoft.Authorization/policyDefinitions/write | Create a custom policy definition. |
> | Microsoft.Authorization/policyDefinitions/delete | Delete a policy definition. |
> | Microsoft.Authorization/policyDefinitions/versions/read | Get information about a policy definition version. |
> | Microsoft.Authorization/policyDefinitions/versions/write | Create a custom policy definition version. |
> | Microsoft.Authorization/policyDefinitions/versions/delete | Delete a policy definition version. |
> | Microsoft.Authorization/policyExemptions/read | Get information about a policy exemption. |
> | Microsoft.Authorization/policyExemptions/write | Create a policy exemption at the specified scope. |
> | Microsoft.Authorization/policyExemptions/delete | Delete a policy exemption at the specified scope. |
> | Microsoft.Authorization/policySetDefinitions/read | Get information about a policy set definition. |
> | Microsoft.Authorization/policySetDefinitions/write | Create a custom policy set definition. |
> | Microsoft.Authorization/policySetDefinitions/delete | Delete a policy set definition. |
> | Microsoft.Authorization/policySetDefinitions/versions/read | Get information about a policy set definition version. |
> | Microsoft.Authorization/policySetDefinitions/versions/write | Create a custom policy set definition version. |
> | Microsoft.Authorization/policySetDefinitions/versions/delete | Delete a policy set definition version. |
> | Microsoft.Authorization/providerOperations/read | Get operations for all resource providers which can be used in role definitions. |
> | Microsoft.Authorization/roleAssignments/read | Get information about a role assignment. |
> | Microsoft.Authorization/roleAssignments/write | Create a role assignment at the specified scope. |
> | Microsoft.Authorization/roleAssignments/delete | Delete a role assignment at the specified scope. |
> | Microsoft.Authorization/roleAssignmentScheduleInstances/read | Gets the role assignment schedule instances at given scope. |
> | Microsoft.Authorization/roleAssignmentScheduleRequests/read | Gets the role assignment schedule requests at given scope. |
> | Microsoft.Authorization/roleAssignmentScheduleRequests/write | Creates a role assignment schedule request at given scope. |
> | Microsoft.Authorization/roleAssignmentScheduleRequests/cancel/action | Cancels a pending role assignment schedule request. |
> | Microsoft.Authorization/roleAssignmentSchedules/read | Gets the role assignment schedules at given scope. |
> | Microsoft.Authorization/roleDefinitions/read | Get information about a role definition. |
> | Microsoft.Authorization/roleDefinitions/write | Create or update a custom role definition with specified permissions and assignable scopes. |
> | Microsoft.Authorization/roleDefinitions/delete | Delete the specified custom role definition. |
> | Microsoft.Authorization/roleEligibilityScheduleInstances/read | Gets the role eligibility schedule instances at given scope. |
> | Microsoft.Authorization/roleEligibilityScheduleRequests/read | Gets the role eligibility schedule requests at given scope. |
> | Microsoft.Authorization/roleEligibilityScheduleRequests/write | Creates a role eligibility schedule request at given scope. |
> | Microsoft.Authorization/roleEligibilityScheduleRequests/cancel/action | Cancels a pending role eligibility schedule request. |
> | Microsoft.Authorization/roleEligibilitySchedules/read | Gets the role eligibility schedules at given scope. |
> | Microsoft.Authorization/roleManagementPolicies/read | Get Role management policies |
> | Microsoft.Authorization/roleManagementPolicies/write | Update a role management policy |
> | Microsoft.Authorization/roleManagementPolicyAssignments/read | Get role management policy assignments |

## Microsoft.Automation

Simplify cloud management with process automation.

Azure service: [Automation](/azure/automation/)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.Automation/register/action | Registers the subscription to Azure Automation |
> | Microsoft.Automation/automationAccounts/convertGraphRunbookContent/action | Convert Graph Runbook Content to its raw serialized format and vice-versa |
> | Microsoft.Automation/automationAccounts/read | Gets an Azure Automation account |
> | Microsoft.Automation/automationAccounts/write | Creates or updates an Azure Automation account |
> | Microsoft.Automation/automationAccounts/listKeys/action | Reads the Keys for the automation account |
> | Microsoft.Automation/automationAccounts/delete | Deletes an Azure Automation account |
> | Microsoft.Automation/automationAccounts/agentRegistrationInformation/read | Read an Azure Automation DSC's registration information |
> | Microsoft.Automation/automationAccounts/agentRegistrationInformation/regenerateKey/action | Writes a request to regenerate Azure Automation DSC keys |
> | Microsoft.Automation/automationAccounts/certificates/getCount/action | Reads the count of certificates |
> | Microsoft.Automation/automationAccounts/certificates/read | Gets an Azure Automation certificate asset |
> | Microsoft.Automation/automationAccounts/certificates/write | Creates or updates an Azure Automation certificate asset |
> | Microsoft.Automation/automationAccounts/certificates/delete | Deletes an Azure Automation certificate asset |
> | Microsoft.Automation/automationAccounts/compilationjobs/write | Writes an Azure Automation DSC's Compilation |
> | Microsoft.Automation/automationAccounts/compilationjobs/read | Reads an Azure Automation DSC's Compilation |
> | Microsoft.Automation/automationAccounts/configurations/read | Gets an Azure Automation DSC's content |
> | Microsoft.Automation/automationAccounts/configurations/getCount/action | Reads the count of an Azure Automation DSC's content |
> | Microsoft.Automation/automationAccounts/configurations/write | Writes an Azure Automation DSC's content |
> | Microsoft.Automation/automationAccounts/configurations/delete | Deletes an Azure Automation DSC's content |
> | Microsoft.Automation/automationAccounts/configurations/content/read | Reads the configuration media content |
> | Microsoft.Automation/automationAccounts/connections/read | Gets an Azure Automation connection asset |
> | Microsoft.Automation/automationAccounts/connections/getCount/action | Reads the count of connections |
> | Microsoft.Automation/automationAccounts/connections/write | Creates or updates an Azure Automation connection asset |
> | Microsoft.Automation/automationAccounts/connections/delete | Deletes an Azure Automation connection asset |
> | Microsoft.Automation/automationAccounts/connectionTypes/read | Gets an Azure Automation connection type asset |
> | Microsoft.Automation/automationAccounts/connectionTypes/write | Creates an Azure Automation connection type asset |
> | Microsoft.Automation/automationAccounts/connectionTypes/delete | Deletes an Azure Automation connection type asset |
> | Microsoft.Automation/automationAccounts/credentials/read | Gets an Azure Automation credential asset |
> | Microsoft.Automation/automationAccounts/credentials/getCount/action | Reads the count of credentials |
> | Microsoft.Automation/automationAccounts/credentials/write | Creates or updates an Azure Automation credential asset |
> | Microsoft.Automation/automationAccounts/credentials/delete | Deletes an Azure Automation credential asset |
> | Microsoft.Automation/automationAccounts/diagnosticSettings/read | Gets the diagnostic setting for the resource |
> | Microsoft.Automation/automationAccounts/diagnosticSettings/write | Sets the diagnostic setting for the resource |
> | Microsoft.Automation/automationAccounts/hybridRunbookWorkerGroups/read | Reads a Hybrid Runbook Worker Group |
> | Microsoft.Automation/automationAccounts/hybridRunbookWorkerGroups/write | Creates a Hybrid Runbook Worker Group |
> | Microsoft.Automation/automationAccounts/hybridRunbookWorkerGroups/delete | Deletes a Hybrid Runbook Worker Group |
> | Microsoft.Automation/automationAccounts/hybridRunbookWorkerGroups/hybridRunbookWorkers/read | Reads a Hybrid Runbook Worker |
> | Microsoft.Automation/automationAccounts/hybridRunbookWorkerGroups/hybridRunbookWorkers/write | Creates a Hybrid Runbook Worker |
> | Microsoft.Automation/automationAccounts/hybridRunbookWorkerGroups/hybridRunbookWorkers/move/action | Moves Hybrid Runbook Worker from one Worker Group to another |
> | Microsoft.Automation/automationAccounts/hybridRunbookWorkerGroups/hybridRunbookWorkers/delete | Deletes a Hybrid Runbook Worker |
> | Microsoft.Automation/automationAccounts/jobs/runbookContent/action | Gets the content of the Azure Automation runbook at the time of the job execution |
> | Microsoft.Automation/automationAccounts/jobs/read | Gets an Azure Automation job |
> | Microsoft.Automation/automationAccounts/jobs/write | Creates an Azure Automation job |
> | Microsoft.Automation/automationAccounts/jobs/stop/action | Stops an Azure Automation job |
> | Microsoft.Automation/automationAccounts/jobs/suspend/action | Suspends an Azure Automation job |
> | Microsoft.Automation/automationAccounts/jobs/resume/action | Resumes an Azure Automation job |
> | Microsoft.Automation/automationAccounts/jobs/output/read | Gets the output of a job |
> | Microsoft.Automation/automationAccounts/jobs/streams/read | Gets an Azure Automation job stream |
> | Microsoft.Automation/automationAccounts/jobSchedules/read | Gets an Azure Automation job schedule |
> | Microsoft.Automation/automationAccounts/jobSchedules/write | Creates an Azure Automation job schedule |
> | Microsoft.Automation/automationAccounts/jobSchedules/delete | Deletes an Azure Automation job schedule |
> | Microsoft.Automation/automationAccounts/linkedWorkspace/read | Gets the workspace linked to the automation account |
> | Microsoft.Automation/automationAccounts/logDefinitions/read | Gets the available logs for the automation account |
> | Microsoft.Automation/automationAccounts/modules/read | Gets an Azure Automation Powershell module |
> | Microsoft.Automation/automationAccounts/modules/getCount/action | Gets the count of Powershell modules within the Automation Account |
> | Microsoft.Automation/automationAccounts/modules/write | Creates or updates an Azure Automation Powershell module |
> | Microsoft.Automation/automationAccounts/modules/delete | Deletes an Azure Automation Powershell module |
> | Microsoft.Automation/automationAccounts/modules/activities/read | Gets Azure Automation Activities |
> | Microsoft.Automation/automationAccounts/nodeConfigurations/rawContent/action | Reads an Azure Automation DSC's node configuration content |
> | Microsoft.Automation/automationAccounts/nodeConfigurations/read | Reads an Azure Automation DSC's node configuration |
> | Microsoft.Automation/automationAccounts/nodeConfigurations/write | Writes an Azure Automation DSC's node configuration |
> | Microsoft.Automation/automationAccounts/nodeConfigurations/delete | Deletes an Azure Automation DSC's node configuration |
> | Microsoft.Automation/automationAccounts/nodecounts/read | Reads node count summary for the specified type |
> | Microsoft.Automation/automationAccounts/nodes/read | Reads Azure Automation DSC nodes |
> | Microsoft.Automation/automationAccounts/nodes/write | Creates or updates Azure Automation DSC nodes |
> | Microsoft.Automation/automationAccounts/nodes/delete | Deletes Azure Automation DSC nodes |
> | Microsoft.Automation/automationAccounts/nodes/reports/read | Reads Azure Automation DSC reports |
> | Microsoft.Automation/automationAccounts/nodes/reports/content/read | Reads Azure Automation DSC report contents |
> | Microsoft.Automation/automationAccounts/objectDataTypes/fields/read | Gets Azure Automation TypeFields |
> | Microsoft.Automation/automationAccounts/privateEndpointConnectionProxies/read | Reads Azure Automation Private Endpoint Connection Proxy |
> | Microsoft.Automation/automationAccounts/privateEndpointConnectionProxies/write | Creates an Azure Automation Private Endpoint Connection Proxy |
> | Microsoft.Automation/automationAccounts/privateEndpointConnectionProxies/validate/action | Validate a Private endpoint connection request (groupId Validation) |
> | Microsoft.Automation/automationAccounts/privateEndpointConnectionProxies/delete | Delete an Azure Automation Private Endpoint Connection Proxy |
> | Microsoft.Automation/automationAccounts/privateEndpointConnectionProxies/operationResults/read | Get Azure Automation private endpoint proxy operation results. |
> | Microsoft.Automation/automationAccounts/privateEndpointConnections/read | Get Azure Automation Private Endpoint Connection status |
> | Microsoft.Automation/automationAccounts/privateEndpointConnections/write | Approve or reject an Azure Automation Private Endpoint Connection |
> | Microsoft.Automation/automationAccounts/privateEndpointConnections/delete | Delete an Azure Automation Private Endpoint Connection |
> | Microsoft.Automation/automationAccounts/privateLinkResources/read | Reads Group Information for private endpoints |
> | Microsoft.Automation/automationAccounts/providers/Microsoft.Insights/metricDefinitions/read | Gets Automation Metric Definitions |
> | Microsoft.Automation/automationAccounts/python2Packages/read | Gets an Azure Automation Python 2 package |
> | Microsoft.Automation/automationAccounts/python2Packages/write | Creates or updates an Azure Automation Python 2 package |
> | Microsoft.Automation/automationAccounts/python2Packages/delete | Deletes an Azure Automation Python 2 package |
> | Microsoft.Automation/automationAccounts/python3Packages/read | Gets an Azure Automation Python 3 package |
> | Microsoft.Automation/automationAccounts/python3Packages/write | Creates or updates an Azure Automation Python 3 package |
> | Microsoft.Automation/automationAccounts/python3Packages/delete | Deletes an Azure Automation Python 3 package |
> | Microsoft.Automation/automationAccounts/runbooks/read | Gets an Azure Automation runbook |
> | Microsoft.Automation/automationAccounts/runbooks/getCount/action | Gets the count of Azure Automation runbooks |
> | Microsoft.Automation/automationAccounts/runbooks/write | Creates or updates an Azure Automation runbook |
> | Microsoft.Automation/automationAccounts/runbooks/delete | Deletes an Azure Automation runbook |
> | Microsoft.Automation/automationAccounts/runbooks/publish/action | Publishes an Azure Automation runbook draft |
> | Microsoft.Automation/automationAccounts/runbooks/content/read | Gets the content of an Azure Automation runbook |
> | Microsoft.Automation/automationAccounts/runbooks/draft/read | Gets an Azure Automation runbook draft |
> | Microsoft.Automation/automationAccounts/runbooks/draft/undoEdit/action | Undo edits to an Azure Automation runbook draft |
> | Microsoft.Automation/automationAccounts/runbooks/draft/write | Creates an Azure Automation runbook draft |
> | Microsoft.Automation/automationAccounts/runbooks/draft/content/write | Creates the content of an Azure Automation runbook draft |
> | Microsoft.Automation/automationAccounts/runbooks/draft/operationResults/read | Gets Azure Automation runbook draft operation results |
> | Microsoft.Automation/automationAccounts/runbooks/draft/testJob/read | Gets an Azure Automation runbook draft test job |
> | Microsoft.Automation/automationAccounts/runbooks/draft/testJob/write | Creates an Azure Automation runbook draft test job |
> | Microsoft.Automation/automationAccounts/runbooks/draft/testJob/stop/action | Stops an Azure Automation runbook draft test job |
> | Microsoft.Automation/automationAccounts/runbooks/draft/testJob/suspend/action | Suspends an Azure Automation runbook draft test job |
> | Microsoft.Automation/automationAccounts/runbooks/draft/testJob/resume/action | Resumes an Azure Automation runbook draft test job |
> | Microsoft.Automation/automationAccounts/runbooks/operationResults/read | Gets Azure Automation runbook operation results |
> | Microsoft.Automation/automationAccounts/schedules/read | Gets an Azure Automation schedule asset |
> | Microsoft.Automation/automationAccounts/schedules/getCount/action | Gets the count of Azure Automation schedules |
> | Microsoft.Automation/automationAccounts/schedules/write | Creates or updates an Azure Automation schedule asset |
> | Microsoft.Automation/automationAccounts/schedules/delete | Deletes an Azure Automation schedule asset |
> | Microsoft.Automation/automationAccounts/softwareUpdateConfigurationMachineRuns/read | Gets an Azure Automation Software Update Configuration Machine Run |
> | Microsoft.Automation/automationAccounts/softwareUpdateConfigurationRuns/read | Gets an Azure Automation Software Update Configuration Run |
> | Microsoft.Automation/automationAccounts/softwareUpdateConfigurations/write | Creates or updates Azure Automation Software Update Configuration |
> | Microsoft.Automation/automationAccounts/softwareUpdateConfigurations/read | Gets an Azure Automation Software Update Configuration |
> | Microsoft.Automation/automationAccounts/softwareUpdateConfigurations/delete | Deletes an Azure Automation Software Update Configuration |
> | Microsoft.Automation/automationAccounts/statistics/read | Gets Azure Automation Statistics |
> | Microsoft.Automation/automationAccounts/updateDeploymentMachineRuns/read | Get an Azure Automation update deployment machine |
> | Microsoft.Automation/automationAccounts/updateManagementPatchJob/read | Gets an Azure Automation update management patch job |
> | Microsoft.Automation/automationAccounts/usages/read | Gets Azure Automation Usage |
> | Microsoft.Automation/automationAccounts/variables/read | Reads an Azure Automation variable asset |
> | Microsoft.Automation/automationAccounts/variables/write | Creates or updates an Azure Automation variable asset |
> | Microsoft.Automation/automationAccounts/variables/delete | Deletes an Azure Automation variable asset |
> | Microsoft.Automation/automationAccounts/watchers/write | Creates an Azure Automation watcher job |
> | Microsoft.Automation/automationAccounts/watchers/read | Gets an Azure Automation watcher job |
> | Microsoft.Automation/automationAccounts/watchers/delete | Delete an Azure Automation watcher job |
> | Microsoft.Automation/automationAccounts/watchers/start/action | Start an Azure Automation watcher job |
> | Microsoft.Automation/automationAccounts/watchers/stop/action | Stop an Azure Automation watcher job |
> | Microsoft.Automation/automationAccounts/watchers/streams/read | Gets an Azure Automation watcher job stream |
> | Microsoft.Automation/automationAccounts/watchers/watcherActions/write | Create an Azure Automation watcher job actions |
> | Microsoft.Automation/automationAccounts/watchers/watcherActions/read | Gets an Azure Automation watcher job actions |
> | Microsoft.Automation/automationAccounts/watchers/watcherActions/delete | Delete an Azure Automation watcher job actions |
> | Microsoft.Automation/automationAccounts/webhooks/read | Reads an Azure Automation webhook |
> | Microsoft.Automation/automationAccounts/webhooks/write | Creates or updates an Azure Automation webhook |
> | Microsoft.Automation/automationAccounts/webhooks/delete | Deletes an Azure Automation webhook  |
> | Microsoft.Automation/deletedAutomationAccounts/read | Gets an Azure Automation deleted account  |
> | Microsoft.Automation/operations/read | Gets Available Operations for Azure Automation resources |

## Microsoft.Billing

Manage your subscriptions and see usage and billing.

Azure service: [Cost Management + Billing](/azure/cost-management-billing/)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.Billing/validateAddress/action | Validates an address. Use the operation to validate an address before using it as soldTo or a billTo address. |
> | Microsoft.Billing/register/action |  |
> | Microsoft.Billing/billingAccounts/read | Lists the billing accounts that a user has access to. |
> | Microsoft.Billing/billingAccounts/write | Updates the properties of a billing account.<br>Currently, displayName and address can be updated for billing accounts with agreement type Microsoft Customer Agreement.<br>Currently address and notification email address can be updated for billing accounts with agreement type Microsoft Online Services Agreement.<br>Currently, purchase order number can be edited for billing accounts with agreement type Enterprise Agreement. |
> | Microsoft.Billing/billingAccounts/listInvoiceSectionsWithCreateSubscriptionPermission/action | Lists the invoice sections for which the user has permission to create Azure subscriptions. The operation is supported only for billing accounts with agreement type Microsoft Customer Agreement. |
> | Microsoft.Billing/billingAccounts/confirmTransition/action |  |
> | Microsoft.Billing/billingAccounts/billingProfiles/action |  |
> | Microsoft.Billing/billingAccounts/addPaymentTerms/action | Adds payment terms to all the billing profiles under the billing account.<br>Currently, payment terms can be added only on billing accounts that have Agreement Type as 'Microsoft Customer Agreement' and AccountType as 'Enterprise'.<br>This action needs pre-authorization and only Field Sellers are authorized to add the payment terms and is not a self-serve action. |
> | Microsoft.Billing/billingAccounts/cancelPaymentTerms/action | Cancels all the payment terms on billing account that falls after the cancellation date in the request. Currently, cancel payment terms is only served by admin actions and is not a self-serve action. |
> | Microsoft.Billing/billingAccounts/validatePaymentTerms/action | Validates payment terms on a billing account with agreement type 'Microsoft Customer Agreement' and account type 'Enterprise'. |
> | Microsoft.Billing/billingAccounts/addDailyInvoicingOverrideTerms/write |  |
> | Microsoft.Billing/billingAccounts/addDepartment/write |  |
> | Microsoft.Billing/billingAccounts/addEnrollmentAccount/write |  |
> | Microsoft.Billing/billingAccounts/addPaymentTerms/write |  |
> | Microsoft.Billing/billingAccounts/agreements/read | Lists the agreements for a billing account. |
> | Microsoft.Billing/billingAccounts/alertPreferences/write | Creates or updates an AlertPreference for the specifed Billing Account. |
> | Microsoft.Billing/billingAccounts/alertPreferences/read | Gets the AlertPreference with the given Id. |
> | Microsoft.Billing/billingAccounts/alerts/read | Gets the alert definition by an Id. |
> | Microsoft.Billing/billingAccounts/associatedTenants/read | Lists the associated tenants that can collaborate with the billing account on commerce activities like viewing and downloading invoices, managing payments, making purchases, and managing or provisioning licenses. |
> | Microsoft.Billing/billingAccounts/associatedTenants/write | Create or update an associated tenant for the billing account. |
> | Microsoft.Billing/billingAccounts/availableBalance/read | The Available Credit or Payment on Account Balance for a billing account.<br>The credit balance can be used to settle due or past due invoices and is supported for billing accounts with agreement type Microsoft Customer Agreement.<br>The payment on account balance is supported for billing accounts with agreement type Microsoft Customer Agreement or Microsoft Online Services Program. |
> | Microsoft.Billing/billingAccounts/billingPeriods/read | Lists the valid Billing Periods for a Billing Account. The operation is supported only for billing accounts with agreement type Enterprise Agreement. |
> | Microsoft.Billing/billingAccounts/billingPermissions/read | Lists the billing permissions the caller has on a billing account. |
> | Microsoft.Billing/billingAccounts/billingProfiles/read | Lists the billing profiles that a user has access to. The operation is supported for billing accounts with agreement of type Microsoft Customer Agreement and Microsoft Partner Agreement. |
> | Microsoft.Billing/billingAccounts/billingProfiles/write | Creates or updates a billing profile.<br>The operation is supported for billing accounts with agreement type Microsoft Customer Agreement, Microsoft Partner Agreement and Enterprise Agreement.<br>If you are a MCA Individual (Pay-as-you-go) customer, then please use the Azure portal experience to create the billing profile. |
> | Microsoft.Billing/billingAccounts/billingProfiles/purchaseProduct/action |  |
> | Microsoft.Billing/billingAccounts/billingProfiles/priceProduct/action |  |
> | Microsoft.Billing/billingAccounts/billingProfiles/invoiceSections/action |  |
> | Microsoft.Billing/billingAccounts/billingProfiles/alerts/read | Lists the alerts for a billing profile. The operation is supported for billing accounts with agreement type Microsoft Customer Agreement and Microsoft Partner Agreement. |
> | Microsoft.Billing/billingAccounts/billingProfiles/availableBalance/read | The Available Credit or Payment on Account Balance for a billing profile.<br>The credit balance can be used to settle due or past due invoices and is supported for billing accounts with agreement type Microsoft Customer Agreement.<br>The payment on account balance is supported for billing accounts with agreement type Microsoft Customer Agreement. |
> | Microsoft.Billing/billingAccounts/billingProfiles/billingPeriods/read | Lists the valid Billing Periods for a Billing Profile. The operation is supported only for billing accounts with agreement type Enterprise Agreement. |
> | Microsoft.Billing/billingAccounts/billingProfiles/billingPermissions/read | Lists the billing permissions the caller has on a billing profile. |
> | Microsoft.Billing/billingAccounts/billingProfiles/billingProviders/register/write | Registers a resource provider with Microsoft.Billing at billing profile scope. |
> | Microsoft.Billing/billingAccounts/billingProfiles/billingProviders/unregister/write | Unregisters a resource provider with Microsoft.Billing at billing profile scope. |
> | Microsoft.Billing/billingAccounts/billingProfiles/billingRequests/read | The list of billing requests submitted for the billing profile. |
> | Microsoft.Billing/billingAccounts/billingProfiles/billingRoleAssignments/read | Gets a role assignment for the caller on a billing profile. The operation is supported for billing accounts with agreement type Microsoft Partner Agreement or Microsoft Customer Agreement. |
> | Microsoft.Billing/billingAccounts/billingProfiles/billingRoleAssignments/write | Deletes a role assignment on a billing profile. The operation is supported for billing accounts with agreement type Microsoft Partner Agreement or Microsoft Customer Agreement. |
> | Microsoft.Billing/billingAccounts/billingProfiles/billingRoleDefinitions/read | Gets the definition for a role on a billing profile. The operation is supported for billing accounts with agreement type Microsoft Partner Agreement or Microsoft Customer Agreement. |
> | Microsoft.Billing/billingAccounts/billingProfiles/billingSubscriptions/read | Gets a subscription by its billing profile and ID. The operation is supported for billing accounts with agreement type Enterprise Agreement. |
> | Microsoft.Billing/billingAccounts/billingProfiles/checkAccess/write | Provides a list of check access response objects for a billing profile. |
> | Microsoft.Billing/billingAccounts/billingProfiles/createBillingRoleAssignment/write | Adds a role assignment on a billing profile. The operation is supported for billing accounts with agreement type Microsoft Partner Agreement or Microsoft Customer Agreement. |
> | Microsoft.Billing/billingAccounts/billingProfiles/customers/read | Lists the customers that are billed to a billing profile. The operation is supported only for billing accounts with agreement type Microsoft Partner Agreement. |
> | Microsoft.Billing/billingAccounts/billingProfiles/customers/billingPermissions/read | Lists the billing permissions the caller has for a customer. |
> | Microsoft.Billing/billingAccounts/billingProfiles/customers/billingRequests/read | The list of billing requests submitted for the customer. |
> | Microsoft.Billing/billingAccounts/billingProfiles/customers/billingRoleAssignments/read | Gets a role assignment for the caller on a customer. The operation is supported for billing accounts with agreement type Microsoft Partner Agreement. |
> | Microsoft.Billing/billingAccounts/billingProfiles/customers/billingRoleAssignments/write | Deletes a role assignment on a customer. The operation is supported for billing accounts with agreement type Microsoft Partner Agreement. |
> | Microsoft.Billing/billingAccounts/billingProfiles/customers/billingRoleDefinitions/read | Gets the definition for a role on a customer. The operation is supported only for billing accounts with agreement type Microsoft Partner Agreement. |
> | Microsoft.Billing/billingAccounts/billingProfiles/customers/billingSubscriptions/read | Lists the subscriptions for a customer. The operation is supported only for billing accounts with agreement type Microsoft Partner Agreement. |
> | Microsoft.Billing/billingAccounts/billingProfiles/customers/checkAccess/write | Provides a list of check access response objects for a customer. |
> | Microsoft.Billing/billingAccounts/billingProfiles/customers/createBillingRoleAssignment/write | Adds a role assignment on a customer. The operation is supported for billing accounts with agreement type Microsoft Partner Agreement. |
> | Microsoft.Billing/billingAccounts/billingProfiles/customers/policies/read | Lists the policies for a customer. This operation is supported only for billing accounts with agreement type Microsoft Partner Agreement. |
> | Microsoft.Billing/billingAccounts/billingProfiles/customers/policies/write | Updates the policies for a customer. This operation is supported only for billing accounts with agreement type Microsoft Partner Agreement. |
> | Microsoft.Billing/billingAccounts/billingProfiles/customers/resolveBillingRoleAssignments/write | Lists the role assignments for the caller on a customer while fetching user info for each role assignment. The operation is supported for billing accounts with agreement type Microsoft Partner Agreement. |
> | Microsoft.Billing/billingAccounts/billingProfiles/customers/transactions/read | Lists the billed or unbilled transactions by customer id for given start date and end date.<br>Transactions include purchases, refunds and Azure usage charges.<br>Unbilled transactions are listed under pending invoice Id and do not include tax.<br>Tax is added to the amount once an invoice is generated. |
> | Microsoft.Billing/billingAccounts/billingProfiles/departments/read | Lists the departments that a user has access to. The operation is supported only for billing accounts with agreement type Enterprise Agreement. |
> | Microsoft.Billing/billingAccounts/billingProfiles/departments/billingPeriods/read | Lists the valid Billing Periods  by billing profile ID and department name. The operation is supported only for Departments under billing profiles with agreement type Enterprise Agreement. |
> | Microsoft.Billing/billingAccounts/billingProfiles/departments/billingPermissions/read |  |
> | Microsoft.Billing/billingAccounts/billingProfiles/departments/billingRoleDefinitions/read | Gets the definition for a role on a department. The operation is supported for billing profiles with agreement type Enterprise Agreement. |
> | Microsoft.Billing/billingAccounts/billingProfiles/departments/billingSubscriptions/read | List billing subscriptions by billing profile ID and department name. This operation is supported only for billing accounts of type Enterprise Agreement. |
> | Microsoft.Billing/billingAccounts/billingProfiles/departments/enrollmentAccounts/read | Get list of enrollment accounts using billing |
> | Microsoft.Billing/billingAccounts/billingProfiles/departments/enrollmentAccounts/billingPeriods/read | Lists the valid Billing Periods for an Enrollment Account under Department under Billing Profile. The operation is supported only for enrollment profiles under billing accounts with agreement type Enterprise Agreement. |
> | Microsoft.Billing/billingAccounts/billingProfiles/enrollmentAccounts/read | Lists the enrollment accounts for a specific billing account and a billing profile belonging to it. |
> | Microsoft.Billing/billingAccounts/billingProfiles/enrollmentAccounts/billingPeriods/read | Lists the valid Billing Periods for an Enrollment Account under Billing Profile. The operation is supported only for billing profiles under billing accounts with agreement type Enterprise Agreement. |
> | Microsoft.Billing/billingAccounts/billingProfiles/enrollmentAccounts/billingPermissions/read |  |
> | Microsoft.Billing/billingAccounts/billingProfiles/enrollmentAccounts/billingSubscriptions/read | List billing subscriptions by billing profile ID and enrollment account name. This operation is supported only for billing accounts of type Enterprise Agreement. |
> | Microsoft.Billing/billingAccounts/billingProfiles/invoices/download/action |  |
> | Microsoft.Billing/billingAccounts/billingProfiles/invoices/read | Lists the invoices for a billing profile for a given start date and end date. The operation is supported for billing accounts with agreement type Microsoft Partner Agreement or Microsoft Customer Agreement. |
> | Microsoft.Billing/billingAccounts/billingProfiles/invoices/paynow/write | Initiates a pay now operation for an invoice. |
> | Microsoft.Billing/billingAccounts/billingProfiles/invoices/pricesheet/download/action |  |
> | Microsoft.Billing/billingAccounts/billingProfiles/invoices/validateRefundEligibility/write |  |
> | Microsoft.Billing/billingAccounts/billingProfiles/invoiceSections/read | Lists the invoice sections that a user has access to. The operation is supported only for billing accounts with agreement type Microsoft Customer Agreement. |
> | Microsoft.Billing/billingAccounts/billingProfiles/invoiceSections/write | Creates or updates an invoice section. The operation is supported only for billing accounts with agreement type Microsoft Customer Agreement. |
> | Microsoft.Billing/billingAccounts/billingProfiles/invoiceSections/billingPermissions/read | Lists the billing permissions the caller has for an invoice section. |
> | Microsoft.Billing/billingAccounts/billingProfiles/invoiceSections/billingRequests/read | The list of billing requests submitted for the invoice section. |
> | Microsoft.Billing/billingAccounts/billingProfiles/invoiceSections/billingRoleAssignments/read | Gets a role assignment for the caller on an invoice section. The operation is supported for billing accounts with agreement type Microsoft Customer Agreement. |
> | Microsoft.Billing/billingAccounts/billingProfiles/invoiceSections/billingRoleAssignments/write | Deletes a role assignment on an invoice section. The operation is supported for billing accounts with agreement type Microsoft Customer Agreement. |
> | Microsoft.Billing/billingAccounts/billingProfiles/invoiceSections/billingRoleDefinitions/read | Gets the definition for a role on an invoice section. The operation is supported only for billing accounts with agreement type Microsoft Customer Agreement. |
> | Microsoft.Billing/billingAccounts/billingProfiles/invoiceSections/billingSubscriptions/transfer/action |  |
> | Microsoft.Billing/billingAccounts/billingProfiles/invoiceSections/billingSubscriptions/move/action |  |
> | Microsoft.Billing/billingAccounts/billingProfiles/invoiceSections/billingSubscriptions/validateMoveEligibility/action |  |
> | Microsoft.Billing/billingAccounts/billingProfiles/invoiceSections/billingSubscriptions/write |  |
> | Microsoft.Billing/billingAccounts/billingProfiles/invoiceSections/billingSubscriptions/read | Lists the subscriptions that are billed to an invoice section. The operation is supported only for billing accounts with agreement type Microsoft Customer Agreement. |
> | Microsoft.Billing/billingAccounts/billingProfiles/invoiceSections/checkAccess/write | Provides a list of check access response objects for an invoice section. |
> | Microsoft.Billing/billingAccounts/billingProfiles/invoiceSections/createBillingRoleAssignment/write | Adds a role assignment on an invoice section. The operation is supported for billing accounts with agreement type Microsoft Customer Agreement. |
> | Microsoft.Billing/billingAccounts/billingProfiles/invoiceSections/products/transfer/action |  |
> | Microsoft.Billing/billingAccounts/billingProfiles/invoiceSections/products/move/action |  |
> | Microsoft.Billing/billingAccounts/billingProfiles/invoiceSections/products/validateMoveEligibility/action |  |
> | Microsoft.Billing/billingAccounts/billingProfiles/invoiceSections/products/read | Lists the products for an invoice section. These don't include products billed based on usage. The operation is supported only for billing accounts with agreement type Microsoft Customer Agreement. |
> | Microsoft.Billing/billingAccounts/billingProfiles/invoiceSections/resolveBillingRoleAssignments/write | Lists the role assignments for the caller on an invoice section while fetching user info for each role assignment. The operation is supported for billing accounts with agreement type Microsoft Customer Agreement. |
> | Microsoft.Billing/billingAccounts/billingProfiles/invoiceSections/transactions/read | Lists the billed or unbilled transactions by invoice section name for given start date and end date.<br>Transactions include purchases, refunds and Azure usage charges.<br>Unbilled transactions are listed under pending invoice Id and do not include tax.<br>Tax is added to the amount once an invoice is generated. |
> | Microsoft.Billing/billingAccounts/billingProfiles/invoiceSections/validateDeleteEligibility/write | Validates if the invoice section can be deleted. The operation is supported for billing accounts with agreement type Microsoft Customer Agreement. |
> | Microsoft.Billing/billingAccounts/billingProfiles/invoiceSections/validateDeleteInvoiceSectionEligibility/write |  |
> | Microsoft.Billing/billingAccounts/billingProfiles/notificationContacts/read | Lists the NotificationContacts for the given billing profile. The operation is supported only for billing profiles with agreement type Enterprise Agreement. |
> | Microsoft.Billing/billingAccounts/billingProfiles/policies/read | Lists the policies for a billing profile. This operation is supported only for billing accounts with agreement type Microsoft Customer Agreement. |
> | Microsoft.Billing/billingAccounts/billingProfiles/policies/write | Updates the policies for a billing profile. This operation is supported only for billing accounts with agreement type Microsoft Customer Agreement. |
> | Microsoft.Billing/billingAccounts/billingProfiles/pricesheet/download/action |  |
> | Microsoft.Billing/billingAccounts/billingProfiles/products/read | Lists the products for a billing profile. These don't include products billed based on usage. The operation is supported for billing accounts with agreement type Microsoft Customer Agreement or Microsoft Partner Agreement. |
> | Microsoft.Billing/billingAccounts/billingProfiles/resolveBillingRoleAssignments/write | Lists the role assignments for the caller on an billing profile while fetching user info for each role assignment. The operation is supported for billing accounts with agreement type Microsoft Partner Agreement or Microsoft Customer Agreement. |
> | Microsoft.Billing/billingAccounts/billingProfiles/transactions/read | Lists the billed or unbilled transactions by billing profile name for given start and end date.<br>Transactions include purchases, refunds and Azure usage charges.<br>Unbilled transactions are listed under pending invoice Id and do not include tax.<br>Tax is added to the amount once an invoice is generated. |
> | Microsoft.Billing/billingAccounts/billingProfiles/validateDeleteBillingProfileEligibility/write |  |
> | Microsoft.Billing/billingAccounts/billingProfiles/validateDeleteEligibility/write | Validates if the billing profile can be deleted. The operation is supported for billing accounts with agreement type Microsoft Customer Agreement and Microsoft Partner Agreement. |
> | Microsoft.Billing/billingAccounts/billingProfiles/validateRefundEligibility/write | Validates whether the billing profile has any invoices eligible for an expedited refund. The operation is supported for billing accounts with the agreement type Microsoft Customer Agreement and the account type Individual. |
> | Microsoft.Billing/billingAccounts/billingProfilesSummaries/read | Gets the summary of billing profiles under a billing account. The operation is supported for billing accounts with agreement type Enterprise Agreement. |
> | Microsoft.Billing/billingAccounts/billingProviders/register/write | Registers a resource provider with Microsoft.Billing at billing account scope. |
> | Microsoft.Billing/billingAccounts/billingProviders/unregister/write | Unregisters a resource provider with Microsoft.Billing at billing account scope. |
> | Microsoft.Billing/billingAccounts/billingRequests/read | The list of billing requests submitted for the billing account. |
> | Microsoft.Billing/billingAccounts/billingRoleAssignments/write | Create or update a billing role assignment. The operation is supported only for billing accounts with agreement type Enterprise Agreement. |
> | Microsoft.Billing/billingAccounts/billingRoleAssignments/read | Gets a role assignment for the caller on a billing account. The operation is supported for billing accounts with agreement type Microsoft Partner Agreement, Microsoft Customer Agreement or Enterprise Agreement. |
> | Microsoft.Billing/billingAccounts/billingRoleDefinitions/read | Gets the definition for a role on a billing account. The operation is supported for billing accounts with agreement type Microsoft Partner Agreement, Microsoft Customer Agreement or Enterprise Agreement. |
> | Microsoft.Billing/billingAccounts/billingSubscriptionAliases/read | Gets a subscription by its alias ID.  The operation is supported for seat based billing subscriptions. |
> | Microsoft.Billing/billingAccounts/billingSubscriptionAliases/write | Creates or updates a billing subscription by its alias ID.  The operation is supported for seat based billing subscriptions. |
> | Microsoft.Billing/billingAccounts/billingSubscriptions/read | Lists the subscriptions for a billing account. |
> | Microsoft.Billing/billingAccounts/billingSubscriptions/downloadDocuments/action | Download invoice using download link from list |
> | Microsoft.Billing/billingAccounts/billingSubscriptions/move/action |  |
> | Microsoft.Billing/billingAccounts/billingSubscriptions/validateMoveEligibility/action |  |
> | Microsoft.Billing/billingAccounts/billingSubscriptions/write | Updates the properties of a billing subscription. |
> | Microsoft.Billing/billingAccounts/billingSubscriptions/cancel/write | Cancels a usage-based subscription. This operation is supported only for billing accounts of type Microsoft Partner Agreement. |
> | Microsoft.Billing/billingAccounts/billingSubscriptions/downloadDocuments/write | Gets a URL to download multiple invoice documents (invoice pdf, tax receipts, credit notes) as a zip file. |
> | Microsoft.Billing/billingAccounts/billingSubscriptions/enable/write | Enable an azure billing subscription. |
> | Microsoft.Billing/billingAccounts/billingSubscriptions/extendTrial/write | Extends the end date of subscription's term for a trial product by one month. |
> | Microsoft.Billing/billingAccounts/billingSubscriptions/invoices/read | Lists the invoices for a subscription. |
> | Microsoft.Billing/billingAccounts/billingSubscriptions/invoices/download/write | Gets a URL to download an invoice by billing subscription. |
> | Microsoft.Billing/billingAccounts/billingSubscriptions/merge/write | Merges the billing subscription provided in the request with a target billing subscription. |
> | Microsoft.Billing/billingAccounts/billingSubscriptions/move/write | Moves charges for a subscription to a new invoice section. The new invoice section must belong to the same billing profile as the existing invoice section. This operation is supported for billing accounts with agreement type Microsoft Customer Agreement. |
> | Microsoft.Billing/billingAccounts/billingSubscriptions/split/write | Splits a subscription into a new subscription with quantity less than current subscription quantity and not equal to 0. |
> | Microsoft.Billing/billingAccounts/billingSubscriptions/validateMoveEligibility/write | Validates if charges for a subscription can be moved to a new invoice section. This operation is supported for billing accounts with agreement type Microsoft Customer Agreement. |
> | Microsoft.Billing/billingAccounts/cancelDailyInvoicingOverrideTerms/write |  |
> | Microsoft.Billing/billingAccounts/cancelPaymentTerms/write |  |
> | Microsoft.Billing/billingAccounts/checkAccess/write | Provides a list of check access response objects for a billing account. |
> | Microsoft.Billing/billingAccounts/confirmTransition/write | Gets the transition details for a billing account that has transitioned from agreement type Microsoft Online Services Program to agreement type Microsoft Customer Agreement. |
> | Microsoft.Billing/billingAccounts/createBillingRoleAssignment/write | Adds a role assignment on a billing account. The operation is supported for billing accounts with agreement type Microsoft Partner Agreement or Microsoft Customer Agreement. |
> | Microsoft.Billing/billingAccounts/customers/read | Lists the customers that are billed to a billing account. The operation is supported only for billing accounts with agreement type Microsoft Partner Agreement. |
> | Microsoft.Billing/billingAccounts/customers/initiateTransfer/action |  |
> | Microsoft.Billing/billingAccounts/customers/billingPermissions/read | Lists the billing permissions the caller has for a customer at billing account level. |
> | Microsoft.Billing/billingAccounts/customers/billingSubscriptions/read | Lists the subscriptions for a customer at billing account level. The operation is supported only for billing accounts with agreement type Microsoft Partner Agreement. |
> | Microsoft.Billing/billingAccounts/customers/checkAccess/write |  |
> | Microsoft.Billing/billingAccounts/customers/policies/read | Lists the policies for a customer at billing account scope. This operation is supported only for billing accounts with agreement type Microsoft Partner Agreement. |
> | Microsoft.Billing/billingAccounts/customers/policies/write | Updates the policies for a customer at billing account scope. This operation is supported only for billing accounts with agreement type Microsoft Partner Agreement. |
> | Microsoft.Billing/billingAccounts/customers/products/read | Lists the products for a customer. These don't include products billed based on usage.The operation is supported only for billing accounts with agreement type Microsoft Partner Agreement. |
> | Microsoft.Billing/billingAccounts/customers/resolveBillingRoleAssignments/write |  |
> | Microsoft.Billing/billingAccounts/customers/transfers/write |  |
> | Microsoft.Billing/billingAccounts/customers/transfers/read |  |
> | Microsoft.Billing/billingAccounts/departments/read | Lists the departments that a user has access to. The operation is supported only for billing accounts with agreement type Enterprise Agreement. |
> | Microsoft.Billing/billingAccounts/departments/write |  |
> | Microsoft.Billing/billingAccounts/departments/addEnrollmentAccount/write |  |
> | Microsoft.Billing/billingAccounts/departments/billingPeriods/read | Lists the valid Billing Periods for a Department. The operation is supported only for Departments under billing accounts with agreement type Enterprise Agreement. |
> | Microsoft.Billing/billingAccounts/departments/billingPermissions/read | Lists the billing permissions the caller has for a department. |
> | Microsoft.Billing/billingAccounts/departments/billingRoleAssignments/write | Create or update a billing role assignment. The operation is supported only for billing accounts with agreement type Enterprise Agreement. |
> | Microsoft.Billing/billingAccounts/departments/billingRoleAssignments/read | Gets a role assignment for the caller on a department. The operation is supported only for billing accounts with agreement type Enterprise Agreement. |
> | Microsoft.Billing/billingAccounts/departments/billingRoleDefinitions/read | Gets the definition for a role on a department. The operation is supported for billing accounts with agreement type Enterprise Agreement. |
> | Microsoft.Billing/billingAccounts/departments/billingSubscriptions/read | Lists the subscriptions for a department. The operation is supported for billing accounts with agreement type Enterprise Agreement. |
> | Microsoft.Billing/billingAccounts/departments/checkAccess/write | Provides a list of check access response objects for a department. |
> | Microsoft.Billing/billingAccounts/departments/enrollmentAccounts/read | Lists the enrollment accounts for a department. The operation is supported only for billing accounts with agreement type Enterprise Agreement. |
> | Microsoft.Billing/billingAccounts/departments/enrollmentAccounts/write |  |
> | Microsoft.Billing/billingAccounts/departments/enrollmentAccounts/billingPeriods/read | Lists the valid Billing Periods for an Enrollment Account under Department. The operation is supported only for enrollment accounts under billing accounts with agreement type Enterprise Agreement. |
> | Microsoft.Billing/billingAccounts/departments/enrollmentAccounts/remove/write |  |
> | Microsoft.Billing/billingAccounts/downloadDocuments/write | Gets a URL to download multiple invoice documents (invoice pdf, tax receipts, credit notes) as a zip file. The operation is supported for billing accounts with agreement type Microsoft Partner Agreement or Microsoft Customer Agreement. |
> | Microsoft.Billing/billingAccounts/enrollmentAccounts/read | Lists the enrollment accounts for a billing account. The operation is supported only for billing accounts with agreement type Enterprise Agreement. |
> | Microsoft.Billing/billingAccounts/enrollmentAccounts/write |  |
> | Microsoft.Billing/billingAccounts/enrollmentAccounts/activate/write |  |
> | Microsoft.Billing/billingAccounts/enrollmentAccounts/activationStatus/read |  |
> | Microsoft.Billing/billingAccounts/enrollmentAccounts/billingPeriods/read | Lists the valid Billing Periods for an Enrollment Account. The operation is supported only for enrollment accounts under billing accounts with agreement type Enterprise Agreement. |
> | Microsoft.Billing/billingAccounts/enrollmentAccounts/billingPermissions/read | Lists the billing permissions the caller has for an enrollment account. |
> | Microsoft.Billing/billingAccounts/enrollmentAccounts/billingRoleAssignments/write | Create or update a billing role assignment. The operation is supported only for billing accounts with agreement type Enterprise Agreement. |
> | Microsoft.Billing/billingAccounts/enrollmentAccounts/billingRoleAssignments/read | Gets a role assignment for the caller on a enrollment Account. The operation is supported only for billing accounts with agreement type Enterprise Agreement. |
> | Microsoft.Billing/billingAccounts/enrollmentAccounts/billingRoleDefinitions/read | Gets the definition for a role on an enrollment account. The operation is supported for billing accounts with agreement type Enterprise Agreement. |
> | Microsoft.Billing/billingAccounts/enrollmentAccounts/billingSubscriptions/write |  |
> | Microsoft.Billing/billingAccounts/enrollmentAccounts/billingSubscriptions/read | Lists the subscriptions for an enrollment account. The operation is supported for billing accounts with agreement type Enterprise Agreement. |
> | Microsoft.Billing/billingAccounts/enrollmentAccounts/checkAccess/write | Provides a list of check access response objects for an enrollment account. |
> | Microsoft.Billing/billingAccounts/enrollmentAccounts/transferBillingSubscriptions/write |  |
> | Microsoft.Billing/billingAccounts/invoices/download/action |  |
> | Microsoft.Billing/billingAccounts/invoices/read | Lists the invoices for a billing account for a given start date and end date. The operation is supported for billing accounts with agreement type Microsoft Partner Agreement, Microsoft Customer Agreement, or Microsoft Online Services Program. |
> | Microsoft.Billing/billingAccounts/invoices/amend/write | Regenerate an invoice by billing account name and invoice name. The operation is supported for billing accounts with agreement type Microsoft Customer Agreement. |
> | Microsoft.Billing/billingAccounts/invoices/download/write | Gets a URL to download an invoice document. The operation is supported for billing accounts with agreement type Microsoft Partner Agreement, Microsoft Customer Agreement or Enterprise Agreement. |
> | Microsoft.Billing/billingAccounts/invoices/downloadSummary/write | Gets a URL to download the summary document for an invoice. The operation is supported for billing accounts with agreement type Enterprise Agreement. |
> | Microsoft.Billing/billingAccounts/invoices/pricesheet/download/action |  |
> | Microsoft.Billing/billingAccounts/invoices/transactions/read | Lists the transactions for an invoice. Transactions include purchases, refunds and Azure usage charges. |
> | Microsoft.Billing/billingAccounts/invoices/transactionsDownload/write | Gets a URL to download the transactions document for an invoice. The operation is supported for billing accounts with agreement type Enterprise Agreement. |
> | Microsoft.Billing/billingAccounts/invoices/transactionSummary/read | Gets the transaction summary for an invoice. Transactions include purchases, refunds and Azure usage charges. |
> | Microsoft.Billing/billingAccounts/invoiceSections/write |  |
> | Microsoft.Billing/billingAccounts/invoiceSections/elevate/action |  |
> | Microsoft.Billing/billingAccounts/invoiceSections/read |  |
> | Microsoft.Billing/billingAccounts/licenseReservations/read | Lists the license reservations for VL Online Services. This operation is supported for billing accounts of type Enterprise Agreement to list license reservations under Volume Licensing (VL). |
> | Microsoft.Billing/billingAccounts/licenseReservations/write | Creates the license reservation for VL Online Services. This operation is supported for billing accounts of type Enterprise Agreement to create license reservations under Volume Licensing (VL). |
> | Microsoft.Billing/billingAccounts/listBillingProfilesWithViewPricesheetPermissions/read |  |
> | Microsoft.Billing/billingAccounts/listProductRecommendations/write | Lists ProductIds or offerIds recommended for purchase on an account. Please specify the type of the cohort for the billing account in the 'x-ms-recommendations-cohort-type' header as a required string parameter. |
> | Microsoft.Billing/billingAccounts/notificationContacts/read | Lists the NotificationContacts for the given billing account. The operation is supported only for billing accounts with agreement type Enterprise Agreement. |
> | Microsoft.Billing/billingAccounts/notificationContacts/write | Update a notification contact by ID. The operation is supported only for billing accounts with agreement type Enterprise Agreement. |
> | Microsoft.Billing/billingAccounts/operationResults/read |  |
> | Microsoft.Billing/billingAccounts/policies/read | Get the policies for a billing account of Enterprise Agreement type. |
> | Microsoft.Billing/billingAccounts/policies/write | Update the policies for a billing account of Enterprise Agreement type. |
> | Microsoft.Billing/billingAccounts/products/read | Lists the products for a billing account. These don't include products billed based on usage. The operation is supported for billing accounts with agreement type Microsoft Customer Agreement or Microsoft Partner Agreement. |
> | Microsoft.Billing/billingAccounts/products/move/action | Moves a product's charges to a new invoice section. The new invoice section must belong to the same billing profile as the existing invoice section. This operation is supported only for products that are purchased with a recurring charge and for billing accounts with agreement type Microsoft Customer Agreement. |
> | Microsoft.Billing/billingAccounts/products/validateMoveEligibility/action | Validates if a product's charges can be moved to a new invoice section. This operation is supported only for products that are purchased with a recurring charge and for billing accounts with agreement type Microsoft Customer Agreement. |
> | Microsoft.Billing/billingAccounts/products/write | Updates the properties of a Product. Currently, auto renew can be updated. The operation is supported only for billing accounts with agreement type Microsoft Customer Agreement. |
> | Microsoft.Billing/billingAccounts/purchaseProduct/write |  |
> | Microsoft.Billing/billingAccounts/resolveBillingRoleAssignments/write | Lists the role assignments for the caller on a billing account while fetching user info for each role assignment. The operation is supported for billing accounts with agreement type Microsoft Partner Agreement, Microsoft Customer Agreement or Enterprise Agreement. |
> | Microsoft.Billing/billingAccounts/validateDailyInvoicingOverrideTerms/write |  |
> | Microsoft.Billing/billingAccounts/validatePaymentTerms/write |  |
> | Microsoft.Billing/billingPeriods/read |  |
> | Microsoft.Billing/billingProperty/read | Gets the billing properties for a subscription |
> | Microsoft.Billing/billingProperty/write | Updates the billing property of a subscription. Currently, cost center can be updated for billing accounts with agreement type Microsoft Customer Agreement and subscription service usage address can be updated for billing accounts with agreement type Microsoft Online Service Program. |
> | Microsoft.Billing/billingRequests/read | The list of billing requests submitted by a user. |
> | Microsoft.Billing/billingRequests/write | Create or update a billing request. |
> | Microsoft.Billing/departments/read |  |
> | Microsoft.Billing/enrollmentAccounts/read |  |
> | Microsoft.Billing/invoices/read |  |
> | Microsoft.Billing/invoices/download/action | Download invoice using download link from list |
> | Microsoft.Billing/operations/read | List of operations supported by provider. |
> | Microsoft.Billing/paymentMethods/read | Lists the payment methods owned by the caller. |
> | Microsoft.Billing/paymentMethods/write | Deletes a payment method owned by the caller. |
> | Microsoft.Billing/policies/read | Lists the policies that are managed by the Billing Admin for the defined subscriptions. This is supported for Microsoft Online Services Program, Microsoft Customer Agreement and Microsoft Partner Agreement. |
> | Microsoft.Billing/promotions/read | List or get promotions |
> | Microsoft.Billing/validateAddress/write |  |

## Microsoft.BillingBenefits

Azure service: [Azure savings plans](/azure/cost-management-billing/savings-plan/savings-plan-compute-overview)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.BillingBenefits/savingsPlanOrders/action | Update a Savings plan order |
> | Microsoft.BillingBenefits/register/action | Registers the BillingBenefits resource provider and enables the creation of BillingBenefits resources. |
> | Microsoft.BillingBenefits/credits/read | Read all Credits |
> | Microsoft.BillingBenefits/credits/write | Create or update a Credit |
> | Microsoft.BillingBenefits/credits/delete | Delete a Credit |
> | Microsoft.BillingBenefits/credits/cancel/action | Cancel a Credit |
> | Microsoft.BillingBenefits/credits/sources/read | Read all Sources |
> | Microsoft.BillingBenefits/credits/sources/write | Create or update a Source |
> | Microsoft.BillingBenefits/credits/sources/delete | Delete a Source |
> | Microsoft.BillingBenefits/maccs/read | Read all MACCs |
> | Microsoft.BillingBenefits/maccs/write | Create a MACC |
> | Microsoft.BillingBenefits/maccs/delete | Delete a MACC |
> | Microsoft.BillingBenefits/maccs/cancel/action | Cancel a MACC |
> | Microsoft.BillingBenefits/maccs/chargeShortfall/action | Charge shortfall on MACC |
> | Microsoft.BillingBenefits/maccs/contributors/read | Get all Contributors |
> | Microsoft.BillingBenefits/savingsPlanOrderAliases/read | Read all savings plan order aliases |
> | Microsoft.BillingBenefits/savingsPlanOrderAliases/write | Create a Savings plan order alias |
> | Microsoft.BillingBenefits/savingsPlanOrders/read | Read all savings plan orders |
> | Microsoft.BillingBenefits/savingsPlanOrders/write | Create a savings plan orders |
> | Microsoft.BillingBenefits/savingsPlanOrders/savingsPlans/read | Read All SavingsPlans |
> | Microsoft.BillingBenefits/savingsPlanOrders/savingsPlans/write | Patch an existing Savings plan |

## Microsoft.Blueprint

Enabling quick, repeatable creation of governed environments.

Azure service: [Azure Blueprints](/azure/governance/blueprints/)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.Blueprint/register/action | Registers the Azure Blueprints Resource Provider |
> | Microsoft.Blueprint/blueprintAssignments/read | Read any blueprint artifacts |
> | Microsoft.Blueprint/blueprintAssignments/write | Create or update any blueprint artifacts |
> | Microsoft.Blueprint/blueprintAssignments/delete | Delete any blueprint artifacts |
> | Microsoft.Blueprint/blueprintAssignments/whoisblueprint/action | Get Azure Blueprints service principal object Id. |
> | Microsoft.Blueprint/blueprintAssignments/assignmentOperations/read | Read any blueprint artifacts |
> | Microsoft.Blueprint/blueprints/read | Read any blueprints |
> | Microsoft.Blueprint/blueprints/write | Create or update any blueprints |
> | Microsoft.Blueprint/blueprints/delete | Delete any blueprints |
> | Microsoft.Blueprint/blueprints/artifacts/read | Read any blueprint artifacts |
> | Microsoft.Blueprint/blueprints/artifacts/write | Create or update any blueprint artifacts |
> | Microsoft.Blueprint/blueprints/artifacts/delete | Delete any blueprint artifacts |
> | Microsoft.Blueprint/blueprints/versions/read | Read any blueprints |
> | Microsoft.Blueprint/blueprints/versions/write | Create or update any blueprints |
> | Microsoft.Blueprint/blueprints/versions/delete | Delete any blueprints |
> | Microsoft.Blueprint/blueprints/versions/artifacts/read | Read any blueprint artifacts |

## Microsoft.Carbon

Azure service: [Azure carbon optimization](/azure/carbon-optimization/overview)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.Carbon/carbonEmissionReports/action | API for Carbon Emissions Reports |
> | Microsoft.Carbon/queryCarbonEmissionDataAvailableDateRange/action | API for query carbon emission data available date range |
> | Microsoft.Carbon/register/action | Register the subscription for Microsoft.Carbon |
> | Microsoft.Carbon/unregister/action | Unregister the subscription for Microsoft.Carbon |
> | Microsoft.Carbon/carbonEmissionReports/read | API for Carbon Emissions Reports |
> | Microsoft.Carbon/Operations/read | read Operations |

## Microsoft.Consumption

Programmatic access to cost and usage data for your Azure resources.

Azure service: [Cost Management](/azure/cost-management-billing/)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.Consumption/register/action | Register to Consumption RP |
> | Microsoft.Consumption/aggregatedcost/read | List AggregatedCost for management group. |
> | Microsoft.Consumption/balances/read | List the utilization summary for a billing period for a management group. |
> | Microsoft.Consumption/budgets/read | List the budgets by a subscription or a management group. |
> | Microsoft.Consumption/budgets/write | Creates and update the budgets by a subscription or a management group. |
> | Microsoft.Consumption/budgets/delete | Delete the budgets by a subscription or a management group. |
> | Microsoft.Consumption/charges/read | List charges |
> | Microsoft.Consumption/credits/read | List credits |
> | Microsoft.Consumption/events/read | List events |
> | Microsoft.Consumption/externalBillingAccounts/tags/read | List tags for EA and subscriptions. |
> | Microsoft.Consumption/externalSubscriptions/tags/read | List tags for EA and subscriptions. |
> | Microsoft.Consumption/forecasts/read | List forecasts |
> | Microsoft.Consumption/lots/read | List lots |
> | Microsoft.Consumption/marketplaces/read | List the marketplace resource usage details for a scope for EA and WebDirect subscriptions. |
> | Microsoft.Consumption/operationresults/read | List operationresults |
> | Microsoft.Consumption/operations/read | List all supported operations by Microsoft.Consumption resource provider. |
> | Microsoft.Consumption/operationstatus/read | List operationstatus |
> | Microsoft.Consumption/pricesheets/read | List the Pricesheets data for a subscription or a management group. |
> | Microsoft.Consumption/reservationDetails/read | List the utilization details for reserved instances by reservation order or management groups. The details data is per instance per day level. |
> | Microsoft.Consumption/reservationRecommendationDetails/read | List Reservation Recommendation Details |
> | Microsoft.Consumption/reservationRecommendations/read | List single or shared recommendations for Reserved instances for a subscription. |
> | Microsoft.Consumption/reservationSummaries/read | List the utilization summary for reserved instances by reservation order or management groups. The summary data is either at monthly or daily level. |
> | Microsoft.Consumption/reservationTransactions/read | List the transaction history for reserved instances by management groups. |
> | Microsoft.Consumption/tags/read | List tags for EA and subscriptions. |
> | Microsoft.Consumption/tenants/register/action | Register action for scope of Microsoft.Consumption by a tenant. |
> | Microsoft.Consumption/tenants/read | List tenants |
> | Microsoft.Consumption/terms/read | List the terms for a subscription or a management group. |
> | Microsoft.Consumption/usageDetails/read | List the usage details for a scope for EA and WebDirect subscriptions. |

## Microsoft.CostManagement

Optimize what you spend on the cloud, while maximizing cloud potential.

Azure service: [Cost Management](/azure/cost-management-billing/)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.CostManagement/generateBenefitUtilizationSummariesReport/action | List Microsoft benefit utilization summaries in storage. |
> | Microsoft.CostManagement/generateReservationDetailsReport/action | List Microsoft Reserved Instances utilization details in storage. |
> | Microsoft.CostManagement/query/action | Query usage data by a scope. |
> | Microsoft.CostManagement/reports/action | Schedule reports on usage data by a scope. |
> | Microsoft.CostManagement/exports/action | Run the specified export. |
> | Microsoft.CostManagement/register/action | Register action for scope of Microsoft.CostManagement by a subscription. |
> | Microsoft.CostManagement/views/action | Create view. |
> | Microsoft.CostManagement/forecast/action | Forecast usage data by a scope. |
> | Microsoft.CostManagement/calculateCost/action | Calculate cost for provided product codes. |
> | Microsoft.CostManagement/scheduledActions/action | Run scheduled action. |
> | Microsoft.CostManagement/alerts/write | Update alerts. |
> | Microsoft.CostManagement/alerts/read | List alerts. |
> | Microsoft.CostManagement/benefitRecommendations/read | List  single or shared recommendations for Microsoft benefits. |
> | Microsoft.CostManagement/benefitUtilizationSummaries/read | List benefit utilization summaries. |
> | Microsoft.CostManagement/benefitUtilizationSummariesOperationResults/read | Gets Microsoft benefit utilization summaries asynchronous operation results. |
> | Microsoft.CostManagement/budgets/read | List the budgets by a subscription or a management group. |
> | Microsoft.CostManagement/cloudConnectors/read | List the cloudConnectors for the authenticated user. |
> | Microsoft.CostManagement/cloudConnectors/write | Create or update the specified cloudConnector. |
> | Microsoft.CostManagement/cloudConnectors/delete | Delete the specified cloudConnector. |
> | Microsoft.CostManagement/dimensions/read | List all supported dimensions by a scope. |
> | Microsoft.CostManagement/exports/read | List the exports by scope. |
> | Microsoft.CostManagement/exports/write | Create or update the specified export. |
> | Microsoft.CostManagement/exports/delete | Delete the specified export. |
> | Microsoft.CostManagement/exports/run/action | Run exports. |
> | Microsoft.CostManagement/externalBillingAccounts/read | List the externalBillingAccounts for the authenticated user. |
> | Microsoft.CostManagement/externalBillingAccounts/query/action | Query usage data for external BillingAccounts. |
> | Microsoft.CostManagement/externalBillingAccounts/forecast/action | Forecast usage data for external BillingAccounts. |
> | Microsoft.CostManagement/externalBillingAccounts/dimensions/read | List all supported dimensions for external BillingAccounts. |
> | Microsoft.CostManagement/externalBillingAccounts/externalSubscriptions/read | List the externalSubscriptions within an externalBillingAccount for the authenticated user. |
> | Microsoft.CostManagement/externalBillingAccounts/forecast/read | Forecast usage data for external BillingAccounts. |
> | Microsoft.CostManagement/externalBillingAccounts/query/read | Query usage data for external BillingAccounts. |
> | Microsoft.CostManagement/externalSubscriptions/read | List the externalSubscriptions for the authenticated user. |
> | Microsoft.CostManagement/externalSubscriptions/write | Update associated management group of externalSubscription |
> | Microsoft.CostManagement/externalSubscriptions/query/action | Query usage data for external subscription. |
> | Microsoft.CostManagement/externalSubscriptions/forecast/action | Forecast usage data for external BillingAccounts. |
> | Microsoft.CostManagement/externalSubscriptions/dimensions/read | List all supported dimensions for external subscription. |
> | Microsoft.CostManagement/externalSubscriptions/forecast/read | Forecast usage data for external BillingAccounts. |
> | Microsoft.CostManagement/externalSubscriptions/query/read | Query usage data for external subscription. |
> | Microsoft.CostManagement/forecast/read | Forecast usage data by a scope. |
> | Microsoft.CostManagement/operations/read | List all supported operations by Microsoft.CostManagement resource provider. |
> | Microsoft.CostManagement/query/read | Query usage data by a scope. |
> | Microsoft.CostManagement/reports/read | Schedule reports on usage data by a scope. |
> | Microsoft.CostManagement/reservationDetailsOperationResults/read | Gets Microsoft Reserved Instances utilization summaries asynchronous operation results. |
> | Microsoft.CostManagement/scheduledActions/read | List all scheduled actions. |
> | Microsoft.CostManagement/scheduledActions/delete | Delete scheduled action. |
> | Microsoft.CostManagement/scheduledActions/write | Create or update scheduled action. |
> | Microsoft.CostManagement/scheduledActions/execute/action | Run scheduled action. |
> | Microsoft.CostManagement/tenants/register/action | Register action for scope of Microsoft.CostManagement by a tenant. |
> | Microsoft.CostManagement/views/read | List all saved views. |
> | Microsoft.CostManagement/views/delete | Delete saved views. |
> | Microsoft.CostManagement/views/write | Update view. |

## Microsoft.CustomerLockbox

Interface for customers to review and approve or reject customer data access requests.

Azure service: [Customer Lockbox for Microsoft Azure](/azure/security/fundamentals/customer-lockbox-overview)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.CustomerLockbox/register/action | Register Provider Microsoft.CustomerLockbox |
> | Microsoft.CustomerLockbox/operations/read | Read Lockbox Operations |
> | Microsoft.CustomerLockbox/requests/UpdateApproval/action | Update Approval Microsoft.CustomerLockbox |
> | Microsoft.CustomerLockbox/requests/read | Read Lockbox Request |
> | Microsoft.CustomerLockbox/requests/activitylog/CreateLockboxRequest/action | Create Lockbox Request |
> | Microsoft.CustomerLockbox/requests/activitylog/ApproveLockboxRequest/action | Approve Lockbox Request |
> | Microsoft.CustomerLockbox/requests/activitylog/DenyLockboxRequest/action | Deny Lockbox Request |
> | Microsoft.CustomerLockbox/requests/activitylog/ExpireLockboxRequest/action | Expire Lockbox Request |
> | Microsoft.CustomerLockbox/requests/activitylog/CancelLockboxRequest/action | Cancel Lockbox Request |
> | Microsoft.CustomerLockbox/requests/activitylog/AutoApproveLockboxRequest/action | AutoApprove Lockbox Request |
> | Microsoft.CustomerLockbox/requests/activitylog/AutoDenyLockboxRequest/action | AutoDeny Lockbox Request |

## Microsoft.Features

Azure service: [Azure Resource Manager](/azure/azure-resource-manager/)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.Features/register/action | Registers the feature of a subscription. |
> | Microsoft.Features/featureProviders/subscriptionFeatureRegistrations/read | Gets the feature registration of a subscription in a given resource provider. |
> | Microsoft.Features/featureProviders/subscriptionFeatureRegistrations/write | Adds the feature registration of a subscription in a given resource provider. |
> | Microsoft.Features/featureProviders/subscriptionFeatureRegistrations/delete | Deletes the feature registration of a subscription in a given resource provider. |
> | Microsoft.Features/features/read | Gets the features of a subscription. |
> | Microsoft.Features/operations/read | Gets the list of operations. |
> | Microsoft.Features/providers/features/read | Gets the feature of a subscription in a given resource provider. |
> | Microsoft.Features/providers/features/register/action | Registers the feature for a subscription in a given resource provider. |
> | Microsoft.Features/providers/features/unregister/action | Unregisters the feature for a subscription in a given resource provider. |
> | Microsoft.Features/subscriptionFeatureRegistrations/read | Gets the feature registration of a subscription. |

## Microsoft.GuestConfiguration

Audit settings inside a machine using Azure Policy.

Azure service: [Azure Policy](/azure/governance/policy/)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.GuestConfiguration/register/action | Registers the subscription for the Microsoft.GuestConfiguration resource provider. |
> | Microsoft.GuestConfiguration/guestConfigurationAssignments/write | Create new guest configuration assignment. |
> | Microsoft.GuestConfiguration/guestConfigurationAssignments/read | Get guest configuration assignment. |
> | Microsoft.GuestConfiguration/guestConfigurationAssignments/delete | Delete guest configuration assignment. |
> | Microsoft.GuestConfiguration/guestConfigurationAssignments/healthcheck/action | Get guest configuration assignment. |
> | Microsoft.GuestConfiguration/guestConfigurationAssignments/reports/read | Get guest configuration assignment report. |
> | Microsoft.GuestConfiguration/operations/read | Gets the operations for the Microsoft.GuestConfiguration resource provider |

## Microsoft.Intune

Enable your workforce to be productive on all their devices, while keeping your organization's information protected.

Azure service: Microsoft Monitoring Insights

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.Intune/diagnosticsettings/write | Writing a diagnostic setting |
> | Microsoft.Intune/diagnosticsettings/read | Reading a diagnostic setting |
> | Microsoft.Intune/diagnosticsettings/delete | Deleting a diagnostic setting |
> | Microsoft.Intune/diagnosticsettingscategories/read | Reading a diagnostic setting categories |

## Microsoft.Maintenance

Azure service: [Azure Maintenance](/azure/virtual-machines/maintenance-configurations), [Azure Update Manager](/azure/update-manager/overview)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.Maintenance/applyUpdates/write | Write apply updates to a resource. |
> | Microsoft.Maintenance/applyUpdates/read | Read apply updates to a resource. |
> | Microsoft.Maintenance/configurationAssignments/write | Create or update maintenance configuration assignment. |
> | Microsoft.Maintenance/configurationAssignments/read | Read maintenance configuration assignment. |
> | Microsoft.Maintenance/configurationAssignments/delete | Delete maintenance configuration assignment. |
> | Microsoft.Maintenance/configurationAssignments/maintenanceScope/InGuestPatch/write | Create or update a maintenance configuration assignment for InGuestPatch maintenance scope. |
> | Microsoft.Maintenance/configurationAssignments/maintenanceScope/InGuestPatch/read | Read maintenance configuration assignment for InGuestPatch maintenance scope. |
> | Microsoft.Maintenance/configurationAssignments/maintenanceScope/InGuestPatch/delete | Delete maintenance configuration assignment for InGuestPatch maintenance scope. |
> | Microsoft.Maintenance/maintenanceConfigurations/write | Create or update maintenance configuration. |
> | Microsoft.Maintenance/maintenanceConfigurations/read | Read maintenance configuration. |
> | Microsoft.Maintenance/maintenanceConfigurations/delete | Delete maintenance configuration. |
> | Microsoft.Maintenance/maintenanceConfigurations/eventGridFilters/delete | Notifies Microsoft.Maintenance that an EventGrid Subscription for Maintenance Configuration is being deleted. |
> | Microsoft.Maintenance/maintenanceConfigurations/eventGridFilters/read | Notifies Microsoft.Maintenance that an EventGrid Subscription for Maintenance Configuration is being viewed. |
> | Microsoft.Maintenance/maintenanceConfigurations/eventGridFilters/write | Notifies Microsoft.Maintenance that a new EventGrid Subscription for Maintenance Configuration is being created. |
> | Microsoft.Maintenance/maintenanceConfigurations/maintenanceScope/InGuestPatch/write | Create or update a maintenance configuration for InGuestPatch maintenance scope. |
> | Microsoft.Maintenance/maintenanceConfigurations/maintenanceScope/InGuestPatch/read | Read maintenance configuration for InGuestPatch maintenance scope. |
> | Microsoft.Maintenance/maintenanceConfigurations/maintenanceScope/InGuestPatch/delete | Delete maintenance configuration for InGuestPatch maintenance scope. |
> | Microsoft.Maintenance/scheduledevents/acknowledge/action | Acknowledge scheduled event of the resource |
> | Microsoft.Maintenance/updates/read | Read updates to a resource. |

## Microsoft.ManagedServices

Azure service: [Azure Lighthouse](/azure/lighthouse/)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.ManagedServices/register/action | Register to Managed Services. |
> | Microsoft.ManagedServices/unregister/action | Unregister from Managed Services. |
> | Microsoft.ManagedServices/marketplaceRegistrationDefinitions/read | Retrieves a list of Managed Services registration definitions. |
> | Microsoft.ManagedServices/operations/read | Retrieves a list of Managed Services operations. |
> | Microsoft.ManagedServices/operationStatuses/read | Reads the operation status for the resource. |
> | Microsoft.ManagedServices/registrationAssignments/read | Retrieves a list of Managed Services registration assignments. |
> | Microsoft.ManagedServices/registrationAssignments/write | Add or modify Managed Services registration assignment. |
> | Microsoft.ManagedServices/registrationAssignments/delete | Removes Managed Services registration assignment. |
> | Microsoft.ManagedServices/registrationDefinitions/read | Retrieves a list of Managed Services registration definitions. |
> | Microsoft.ManagedServices/registrationDefinitions/write | Add or modify Managed Services registration definition. |
> | Microsoft.ManagedServices/registrationDefinitions/delete | Removes Managed Services registration definition. |

## Microsoft.Management

Use management groups to efficiently apply governance controls and manage groups of Azure subscriptions.

Azure service: [Management Groups](/azure/governance/management-groups/)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.Management/checkNameAvailability/action | Checks if the specified management group name is valid and unique. |
> | Microsoft.Management/getEntities/action | List all entities (Management Groups, Subscriptions, etc.) for the authenticated user. |
> | Microsoft.Management/register/action | Register the specified subscription with Microsoft.Management |
> | Microsoft.Management/managementGroups/read | List management groups for the authenticated user. |
> | Microsoft.Management/managementGroups/write | Create or update a management group. |
> | Microsoft.Management/managementGroups/delete | Delete management group. |
> | Microsoft.Management/managementGroups/descendants/read | Gets all the descendants (Management Groups, Subscriptions) of a Management Group. |
> | Microsoft.Management/managementGroups/settings/read | Lists existing management group hierarchy settings. |
> | Microsoft.Management/managementGroups/settings/write | Creates or updates management group hierarchy settings. |
> | Microsoft.Management/managementGroups/settings/delete | Deletes management group hierarchy settings. |
> | Microsoft.Management/managementGroups/subscriptions/read | Lists subscription under the given management group. |
> | Microsoft.Management/managementGroups/subscriptions/write | Associates existing subscription with the management group. |
> | Microsoft.Management/managementGroups/subscriptions/delete | De-associates subscription from the management group. |
> | Microsoft.Management/serviceGroups/write | Create or Update a Service Group |
> | Microsoft.Management/serviceGroups/read | Read a Service Group |
> | Microsoft.Management/serviceGroups/delete | Delete a Service Group |

## Microsoft.PolicyInsights

Summarize policy states for the subscription level policy definition.

Azure service: [Azure Policy](/azure/governance/policy/)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.PolicyInsights/register/action | Registers the Microsoft Policy Insights resource provider and enables actions on it. |
> | Microsoft.PolicyInsights/unregister/action | Unregisters the Microsoft Policy Insights resource provider. |
> | Microsoft.PolicyInsights/asyncOperationResults/read | Gets the async operation result. |
> | Microsoft.PolicyInsights/attestations/read | Get compliance state attestations. |
> | Microsoft.PolicyInsights/attestations/write | Create or update compliance state attestations. |
> | Microsoft.PolicyInsights/attestations/delete | Delete compliance state attestations. |
> | Microsoft.PolicyInsights/checkPolicyRestrictions/read | Get details about the restrictions that policy will enforce on a resource. |
> | Microsoft.PolicyInsights/componentPolicyStates/queryResults/read | Query information about component policy states. |
> | Microsoft.PolicyInsights/eventGridFilters/read | Get Event Grid filters used to track which scopes to publish state change notifications for. |
> | Microsoft.PolicyInsights/eventGridFilters/write | Create or update Event Grid filters. |
> | Microsoft.PolicyInsights/eventGridFilters/delete | Delete Event Grid filters. |
> | Microsoft.PolicyInsights/operations/read | Gets supported operations on Microsoft.PolicyInsights namespace |
> | Microsoft.PolicyInsights/policyEvents/queryResults/action | Query information about policy events. |
> | Microsoft.PolicyInsights/policyEvents/queryResults/read | Query information about policy events. |
> | Microsoft.PolicyInsights/policyMetadata/read | Get Policy Metadata resources. |
> | Microsoft.PolicyInsights/policyStates/queryResults/action | Query information about policy states. |
> | Microsoft.PolicyInsights/policyStates/summarize/action | Query summary information about policy latest states. |
> | Microsoft.PolicyInsights/policyStates/triggerEvaluation/action | Triggers a new compliance evaluation for the selected scope. |
> | Microsoft.PolicyInsights/policyStates/queryResults/read | Query information about policy states. |
> | Microsoft.PolicyInsights/policyStates/summarize/read | Query summary information about policy latest states. |
> | Microsoft.PolicyInsights/policyTrackedResources/queryResults/read | Query information about resources required by DeployIfNotExists policies. |
> | Microsoft.PolicyInsights/remediations/read | Get policy remediations. |
> | Microsoft.PolicyInsights/remediations/write | Create or update Microsoft Policy remediations. |
> | Microsoft.PolicyInsights/remediations/delete | Delete policy remediations. |
> | Microsoft.PolicyInsights/remediations/cancel/action | Cancel in-progress Microsoft Policy remediations. |
> | Microsoft.PolicyInsights/remediations/listDeployments/read | Lists the deployments required by a policy remediation. |
> | **DataAction** | **Description** |
> | Microsoft.PolicyInsights/checkDataPolicyCompliance/action | Check the compliance status of a given component against data policies. |
> | Microsoft.PolicyInsights/policyEvents/logDataEvents/action | Log the resource component policy events. |

## Microsoft.Portal

Build, manage, and monitor all Azure products in a single, unified console.

Azure service: [Azure portal](/azure/azure-portal/)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.Portal/register/action | Register to Portal |
> | Microsoft.Portal/consoles/delete | Removes the Cloud Shell instance. |
> | Microsoft.Portal/consoles/write | Create or update a Cloud Shell instance. |
> | Microsoft.Portal/consoles/read | Reads the Cloud Shell instance. |
> | Microsoft.Portal/dashboards/read | Reads the dashboards for the subscription. |
> | Microsoft.Portal/dashboards/write | Add or modify dashboard to a subscription. |
> | Microsoft.Portal/dashboards/delete | Removes the dashboard from the subscription. |
> | Microsoft.Portal/tenantConfigurations/read | Reads Tenant configuration |
> | Microsoft.Portal/tenantConfigurations/write | Adds or updates Tenant configuration. User has to be a Tenant Admin for this operation. |
> | Microsoft.Portal/tenantConfigurations/delete | Removes Tenant configuration. User has to be a Tenant Admin for this operation. |
> | Microsoft.Portal/usersettings/delete | Removes the Cloud Shell user settings. |
> | Microsoft.Portal/usersettings/write | Create or update Cloud Shell user setting. |
> | Microsoft.Portal/usersettings/read | Reads the Cloud Shell user settings. |

## Microsoft.RecoveryServices

Hold and organize backup data for various Azure services such as IaaS VMs (Linux or Windows) and Azure SQL databases.

Azure service: [Site Recovery](/azure/site-recovery/)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.RecoveryServices/register/action | Registers subscription for given Resource Provider |
> | Microsoft.RecoveryServices/unregister/action | Unregisters subscription for given Resource Provider |
> | Microsoft.RecoveryServices/Locations/backupCrossRegionRestore/action | Trigger Cross region restore. |
> | Microsoft.RecoveryServices/Locations/backupCrrJob/action | Get Cross Region Restore Job Details in the secondary region for Recovery Services Vault. |
> | Microsoft.RecoveryServices/Locations/backupCrrJobCancel/action | Get Cross Region Restore Job Details in the secondary region for Recovery Services Vault. |
> | Microsoft.RecoveryServices/Locations/backupCrrJobs/action | List Cross Region Restore Jobs in the secondary region for Recovery Services Vault. |
> | Microsoft.RecoveryServices/Locations/backupPreValidateProtection/action |  |
> | Microsoft.RecoveryServices/Locations/backupStatus/action | Check Backup Status for Recovery Services Vaults |
> | Microsoft.RecoveryServices/Locations/backupValidateFeatures/action | Validate Features |
> | Microsoft.RecoveryServices/locations/allocateStamp/action | AllocateStamp is internal operation used by service |
> | Microsoft.RecoveryServices/locations/checkNameAvailability/action | Check Resource Name Availability is an API to check if resource name is available |
> | Microsoft.RecoveryServices/locations/capabilities/action | List capabilities at a given location. |
> | Microsoft.RecoveryServices/locations/allocatedStamp/read | GetAllocatedStamp is internal operation used by service |
> | Microsoft.RecoveryServices/Locations/backupAadProperties/read | Get AAD Properties for authentication in the third region for Cross Region Restore. |
> | Microsoft.RecoveryServices/Locations/backupCrrOperationResults/read | Returns CRR Operation Result for Recovery Services Vault. |
> | Microsoft.RecoveryServices/Locations/backupCrrOperationsStatus/read | Returns CRR Operation Status for Recovery Services Vault. |
> | Microsoft.RecoveryServices/Locations/backupProtectedItem/write | Create a backup Protected Item |
> | Microsoft.RecoveryServices/Locations/backupProtectedItems/read | Returns the list of all Protected Items. |
> | Microsoft.RecoveryServices/locations/deletedVaults/read | The Get DeletedVault operation gets an object representing the Azure resource of type 'DeletedVault' |
> | Microsoft.RecoveryServices/locations/deletedVaults/undelete/action | Undelete DeletedVault operation re-creates an Azure resource of type 'vault'. |
> | Microsoft.RecoveryServices/locations/deletedVaults/operations/read | Gets operation status for a given DeletedVault operation |
> | Microsoft.RecoveryServices/locations/operationStatus/read | Gets Operation Status for a given Operation |
> | Microsoft.RecoveryServices/operations/read | Operation returns the list of Operations for a Resource Provider |
> | Microsoft.RecoveryServices/Vaults/backupJobsExport/action | Export Jobs |
> | Microsoft.RecoveryServices/Vaults/backupSecurityPIN/action | Returns Security PIN Information for Recovery Services Vault. |
> | Microsoft.RecoveryServices/Vaults/backupTriggerValidateOperation/action | Validate Operation on Protected Item |
> | Microsoft.RecoveryServices/Vaults/backupValidateOperation/action | Validate Operation on Protected Item |
> | Microsoft.RecoveryServices/Vaults/write | Create Vault operation creates an Azure resource of type 'vault' |
> | Microsoft.RecoveryServices/Vaults/read | The Get Vault operation gets an object representing the Azure resource of type 'vault' |
> | Microsoft.RecoveryServices/Vaults/delete | The Delete Vault operation deletes the specified Azure resource of type 'vault' |
> | Microsoft.RecoveryServices/Vaults/PrivateEndpointConnectionsApproval/action | Approve the Private Endpoint Connection. |
> | Microsoft.RecoveryServices/Vaults/backupconfig/read | Returns Configuration for Recovery Services Vault. |
> | Microsoft.RecoveryServices/Vaults/backupconfig/write | Updates Configuration for Recovery Services Vault. |
> | Microsoft.RecoveryServices/Vaults/backupDeletedProtectionContainers/read | Returns all containers belonging to the subscription |
> | Microsoft.RecoveryServices/Vaults/backupEncryptionConfigs/read | Gets Backup Resource Encryption Configuration. |
> | Microsoft.RecoveryServices/Vaults/backupEncryptionConfigs/write | Updates Backup Resource Encryption Configuration |
> | Microsoft.RecoveryServices/Vaults/backupEngines/read | Returns all the backup management servers registered with vault. |
> | Microsoft.RecoveryServices/Vaults/backupFabrics/refreshContainers/action | Refreshes the container list |
> | Microsoft.RecoveryServices/Vaults/backupFabrics/backupProtectionIntent/delete | Delete a backup Protection Intent |
> | Microsoft.RecoveryServices/Vaults/backupFabrics/backupProtectionIntent/read | Get a backup Protection Intent |
> | Microsoft.RecoveryServices/Vaults/backupFabrics/backupProtectionIntent/write | Create a backup Protection Intent |
> | Microsoft.RecoveryServices/Vaults/backupFabrics/operationResults/read | Returns status of the operation |
> | Microsoft.RecoveryServices/Vaults/backupFabrics/operationsStatus/read | Returns status of the operation |
> | Microsoft.RecoveryServices/Vaults/backupFabrics/protectableContainers/read | Get all protectable containers |
> | Microsoft.RecoveryServices/Vaults/backupFabrics/protectionContainers/delete | Deletes the registered Container |
> | Microsoft.RecoveryServices/Vaults/backupFabrics/protectionContainers/inquire/action | Do inquiry for workloads within a container |
> | Microsoft.RecoveryServices/Vaults/backupFabrics/protectionContainers/read | Returns all registered containers |
> | Microsoft.RecoveryServices/Vaults/backupFabrics/protectionContainers/write | Creates a registered container |
> | Microsoft.RecoveryServices/Vaults/backupFabrics/protectionContainers/items/read | Get all items in a container |
> | Microsoft.RecoveryServices/Vaults/backupFabrics/protectionContainers/operationResults/read | Gets result of Operation performed on Protection Container. |
> | Microsoft.RecoveryServices/Vaults/backupFabrics/protectionContainers/operationsStatus/read | Gets status of Operation performed on Protection Container. |
> | Microsoft.RecoveryServices/Vaults/backupFabrics/protectionContainers/protectedItems/backup/action | Performs Backup for Protected Item. |
> | Microsoft.RecoveryServices/Vaults/backupFabrics/protectionContainers/protectedItems/delete | Deletes Protected Item |
> | Microsoft.RecoveryServices/Vaults/backupFabrics/protectionContainers/protectedItems/read | Returns object details of the Protected Item |
> | Microsoft.RecoveryServices/Vaults/backupFabrics/protectionContainers/protectedItems/recoveryPointsRecommendedForMove/action | Get Recovery points recommended for move to another tier |
> | Microsoft.RecoveryServices/Vaults/backupFabrics/protectionContainers/protectedItems/write | Create a backup Protected Item |
> | Microsoft.RecoveryServices/Vaults/backupFabrics/protectionContainers/protectedItems/operationResults/read | Gets Result of Operation Performed on Protected Items. |
> | Microsoft.RecoveryServices/Vaults/backupFabrics/protectionContainers/protectedItems/operationsStatus/read | Returns the status of Operation performed on Protected Items. |
> | Microsoft.RecoveryServices/Vaults/backupFabrics/protectionContainers/protectedItems/recoveryPoints/accessToken/action | Get AccessToken for Cross Region Restore. |
> | Microsoft.RecoveryServices/Vaults/backupFabrics/protectionContainers/protectedItems/recoveryPoints/move/action | Move Recovery point to another tier |
> | Microsoft.RecoveryServices/Vaults/backupFabrics/protectionContainers/protectedItems/recoveryPoints/provisionInstantItemRecovery/action | Provision Instant Item Recovery for Protected Item |
> | Microsoft.RecoveryServices/Vaults/backupFabrics/protectionContainers/protectedItems/recoveryPoints/read | Get Recovery Points for Protected Items. |
> | Microsoft.RecoveryServices/Vaults/backupFabrics/protectionContainers/protectedItems/recoveryPoints/restore/action | Restore Recovery Points for Protected Items. |
> | Microsoft.RecoveryServices/Vaults/backupFabrics/protectionContainers/protectedItems/recoveryPoints/revokeInstantItemRecovery/action | Revoke Instant Item Recovery for Protected Item |
> | Microsoft.RecoveryServices/Vaults/backupFabrics/protectionContainers/protectedItems/recoveryPoints/write | Update Recovery Point for Protected Item. |
> | Microsoft.RecoveryServices/Vaults/backupJobs/cancel/action | Cancel the Job |
> | Microsoft.RecoveryServices/Vaults/backupJobs/read | Returns all Job Objects |
> | Microsoft.RecoveryServices/Vaults/backupJobs/retry/action | Retry the Job |
> | Microsoft.RecoveryServices/Vaults/backupJobs/backupChildJobs/read | Returns all Job Objects |
> | Microsoft.RecoveryServices/Vaults/backupJobs/operationResults/read | Returns the Result of Job Operation. |
> | Microsoft.RecoveryServices/Vaults/backupJobs/operationsStatus/read | Returns the status of Job Operation. |
> | Microsoft.RecoveryServices/Vaults/backupOperationResults/read | Returns Backup Operation Result for Recovery Services Vault. |
> | Microsoft.RecoveryServices/Vaults/backupOperations/read | Returns Backup Operation Status for Recovery Services Vault. |
> | Microsoft.RecoveryServices/Vaults/backupPolicies/delete | Delete a Protection Policy |
> | Microsoft.RecoveryServices/Vaults/backupPolicies/read | Returns all Protection Policies |
> | Microsoft.RecoveryServices/Vaults/backupPolicies/write | Creates Protection Policy |
> | Microsoft.RecoveryServices/Vaults/backupPolicies/operationResults/read | Get Results of Policy Operation. |
> | Microsoft.RecoveryServices/Vaults/backupPolicies/operations/read | Get Status of Policy Operation. |
> | Microsoft.RecoveryServices/Vaults/backupProtectableItems/read | Returns list of all Protectable Items. |
> | Microsoft.RecoveryServices/Vaults/backupProtectedItems/read | Returns the list of all Protected Items. |
> | Microsoft.RecoveryServices/Vaults/backupProtectionContainers/read | Returns all containers belonging to the subscription |
> | Microsoft.RecoveryServices/Vaults/backupProtectionIntents/read | List all backup Protection Intents |
> | Microsoft.RecoveryServices/Vaults/backupResourceGuardProxies/delete | The Delete ResourceGuard proxy operation deletes the specified Azure resource of type 'ResourceGuard proxy' |
> | Microsoft.RecoveryServices/Vaults/backupResourceGuardProxies/read | Get ResourceGuard proxy operation gets an object representing the Azure resource of type 'ResourceGuard proxy' |
> | Microsoft.RecoveryServices/Vaults/backupResourceGuardProxies/read | Get the list of ResourceGuard proxies for a resource |
> | Microsoft.RecoveryServices/Vaults/backupResourceGuardProxies/unlockDelete/action | Unlock delete ResourceGuard proxy operation unlocks the next delete critical operation |
> | Microsoft.RecoveryServices/Vaults/backupResourceGuardProxies/write | Create ResourceGuard proxy operation creates an Azure resource of type 'ResourceGuard Proxy' |
> | Microsoft.RecoveryServices/Vaults/backupstorageconfig/read | Returns Storage Configuration for Recovery Services Vault. |
> | Microsoft.RecoveryServices/Vaults/backupstorageconfig/write | Updates Storage Configuration for Recovery Services Vault. |
> | Microsoft.RecoveryServices/Vaults/backupTieringCost/fetchTieringCost/action | Returns the tiering related cost info. |
> | Microsoft.RecoveryServices/Vaults/backupTieringCost/operationResults/read | Returns the result of Operation performed for tiering costs |
> | Microsoft.RecoveryServices/Vaults/backupTieringCost/operationsStatus/read | Returns the status of Operation performed for tiering cost |
> | Microsoft.RecoveryServices/Vaults/backupUsageSummaries/read | Returns summaries for Protected Items and Protected Servers for a Recovery Services . |
> | Microsoft.RecoveryServices/Vaults/backupValidateOperationResults/read | Validate Operation on Protected Item |
> | Microsoft.RecoveryServices/Vaults/backupValidateOperationsStatuses/read | Validate Operation on Protected Item |
> | Microsoft.RecoveryServices/Vaults/certificates/write | The Update Resource Certificate operation updates the resource/vault credential certificate. |
> | Microsoft.RecoveryServices/Vaults/extendedInformation/read | The Get Extended Info operation gets an object's Extended Info representing the Azure resource of type ?vault? |
> | Microsoft.RecoveryServices/Vaults/extendedInformation/write | The Get Extended Info operation gets an object's Extended Info representing the Azure resource of type ?vault? |
> | Microsoft.RecoveryServices/Vaults/extendedInformation/delete | The Get Extended Info operation gets an object's Extended Info representing the Azure resource of type ?vault? |
> | Microsoft.RecoveryServices/Vaults/monitoringAlerts/read | Gets the alerts for the Recovery services vault. |
> | Microsoft.RecoveryServices/Vaults/monitoringAlerts/write | Resolves the alert. |
> | Microsoft.RecoveryServices/Vaults/monitoringConfigurations/read | Gets the Recovery services vault notification configuration. |
> | Microsoft.RecoveryServices/Vaults/monitoringConfigurations/write | Configures e-mail notifications to Recovery services vault. |
> | Microsoft.RecoveryServices/Vaults/operationResults/read | The Get Operation Results operation can be used get the operation status and result for the asynchronously submitted operation |
> | Microsoft.RecoveryServices/Vaults/operationStatus/read | Gets Operation Status for a given Operation |
> | Microsoft.RecoveryServices/Vaults/privateEndpointConnectionProxies/delete | Wait for a few minutes and then try the operation again. If the issue persists, please contact Microsoft support. |
> | Microsoft.RecoveryServices/Vaults/privateEndpointConnectionProxies/read | Get all protectable containers |
> | Microsoft.RecoveryServices/Vaults/privateEndpointConnectionProxies/validate/action | Get all protectable containers |
> | Microsoft.RecoveryServices/Vaults/privateEndpointConnectionProxies/write | Get all protectable containers |
> | Microsoft.RecoveryServices/Vaults/privateEndpointConnectionProxies/operationsStatus/read | Get all protectable containers |
> | Microsoft.RecoveryServices/Vaults/privateEndpointConnections/delete | Delete Private Endpoint requests. This call is made by Backup Admin. |
> | Microsoft.RecoveryServices/Vaults/privateEndpointConnections/write | Approve or Reject Private Endpoint requests. This call is made by Backup Admin. |
> | Microsoft.RecoveryServices/Vaults/privateEndpointConnections/read | Returns all the private endpoint connections. |
> | Microsoft.RecoveryServices/Vaults/privateEndpointConnections/operationsStatus/read | Returns the operation status for a private endpoint connection. |
> | Microsoft.RecoveryServices/Vaults/privateLinkResources/read | Returns all the private link resources. |
> | Microsoft.RecoveryServices/Vaults/providers/Microsoft.Insights/diagnosticSettings/read | Azure Backup Diagnostics |
> | Microsoft.RecoveryServices/Vaults/providers/Microsoft.Insights/diagnosticSettings/write | Azure Backup Diagnostics |
> | Microsoft.RecoveryServices/Vaults/providers/Microsoft.Insights/logDefinitions/read | Azure Backup Logs |
> | Microsoft.RecoveryServices/Vaults/providers/Microsoft.Insights/metricDefinitions/read | Azure Backup Metrics |
> | Microsoft.RecoveryServices/Vaults/registeredIdentities/write | The Register Service Container operation can be used to register a container with Recovery Service. |
> | Microsoft.RecoveryServices/Vaults/registeredIdentities/read | The Get Containers operation can be used get the containers registered for a resource. |
> | Microsoft.RecoveryServices/Vaults/registeredIdentities/delete | The UnRegister Container operation can be used to unregister a container. |
> | Microsoft.RecoveryServices/Vaults/registeredIdentities/operationResults/read | The Get Operation Results operation can be used get the operation status and result for the asynchronously submitted operation |
> | Microsoft.RecoveryServices/vaults/replicationAlertSettings/read | Read any Alerts Settings |
> | Microsoft.RecoveryServices/vaults/replicationAlertSettings/write | Create or Update any Alerts Settings |
> | Microsoft.RecoveryServices/vaults/replicationEvents/read | Read any Events |
> | Microsoft.RecoveryServices/vaults/replicationFabrics/read | Read any Fabrics |
> | Microsoft.RecoveryServices/vaults/replicationFabrics/write | Create or Update any Fabrics |
> | Microsoft.RecoveryServices/vaults/replicationFabrics/remove/action | Remove Fabric |
> | Microsoft.RecoveryServices/vaults/replicationFabrics/checkConsistency/action | Checks Consistency of the Fabric |
> | Microsoft.RecoveryServices/vaults/replicationFabrics/delete | Delete any Fabrics |
> | Microsoft.RecoveryServices/vaults/replicationFabrics/renewcertificate/action | Renew Certificate for Fabric |
> | Microsoft.RecoveryServices/vaults/replicationFabrics/deployProcessServerImage/action | Deploy Process Server Image |
> | Microsoft.RecoveryServices/vaults/replicationFabrics/reassociateGateway/action | Reassociate Gateway |
> | Microsoft.RecoveryServices/vaults/replicationFabrics/migratetoaad/action | Migrate Fabric To AAD |
> | Microsoft.RecoveryServices/vaults/replicationFabrics/moveWebApp/action | Move WebApp |
> | Microsoft.RecoveryServices/vaults/replicationFabrics/removeInfra/action |  |
> | Microsoft.RecoveryServices/vaults/replicationFabrics/operationresults/read | Track the results of an asynchronous operation on the resource Fabrics |
> | Microsoft.RecoveryServices/vaults/replicationFabrics/replicationLogicalNetworks/read | Read any Logical Networks |
> | Microsoft.RecoveryServices/vaults/replicationFabrics/replicationNetworks/read | Read any Networks |
> | Microsoft.RecoveryServices/vaults/replicationFabrics/replicationNetworks/replicationNetworkMappings/read | Read any Network Mappings |
> | Microsoft.RecoveryServices/vaults/replicationFabrics/replicationNetworks/replicationNetworkMappings/write | Create or Update any Network Mappings |
> | Microsoft.RecoveryServices/vaults/replicationFabrics/replicationNetworks/replicationNetworkMappings/delete | Delete any Network Mappings |
> | Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/read | Read any Protection Containers |
> | Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/discoverProtectableItem/action | Discover Protectable Item |
> | Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/write | Create or Update any Protection Containers |
> | Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/remove/action | Remove Protection Container |
> | Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/switchprotection/action | Switch Protection Container |
> | Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/switchClusterProtection/action |  |
> | Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/operationresults/read | Track the results of an asynchronous operation on the resource Protection Containers |
> | Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/replicationMigrationItems/read | Read any Migration Items |
> | Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/replicationMigrationItems/write | Create or Update any Migration Items |
> | Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/replicationMigrationItems/delete | Delete any Migration Items |
> | Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/replicationMigrationItems/resync/action | Resynchronize |
> | Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/replicationMigrationItems/migrate/action | Migrate Item |
> | Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/replicationMigrationItems/testMigrate/action | Test Migrate |
> | Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/replicationMigrationItems/testMigrateCleanup/action | Test Migrate Cleanup |
> | Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/replicationMigrationItems/pauseReplication/action |  |
> | Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/replicationMigrationItems/resumeReplication/action |  |
> | Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/replicationMigrationItems/migrationRecoveryPoints/read | Read any Migration Recovery Points |
> | Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/replicationMigrationItems/operationresults/read | Track the results of an asynchronous operation on the resource Migration Items |
> | Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/replicationProtectableItems/read | Read any Protectable Items |
> | Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/replicationProtectedItems/read | Read any Protected Items |
> | Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/replicationProtectedItems/write | Create or Update any Protected Items |
> | Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/replicationProtectedItems/delete | Delete any Protected Items |
> | Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/replicationProtectedItems/remove/action | Remove Protected Item |
> | Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/replicationProtectedItems/plannedFailover/action | Planned Failover |
> | Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/replicationProtectedItems/unplannedFailover/action | Failover |
> | Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/replicationProtectedItems/testFailover/action | Test Failover |
> | Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/replicationProtectedItems/testFailoverCleanup/action | Test Failover Cleanup |
> | Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/replicationProtectedItems/failoverCommit/action | Failover Commit |
> | Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/replicationProtectedItems/reProtect/action | ReProtect Protected Item |
> | Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/replicationProtectedItems/updateMobilityService/action | Update Mobility Service |
> | Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/replicationProtectedItems/repairReplication/action | Repair replication |
> | Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/replicationProtectedItems/applyRecoveryPoint/action | Apply Recovery Point |
> | Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/replicationProtectedItems/submitFeedback/action | Submit Feedback |
> | Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/replicationProtectedItems/addDisks/action | Add disks |
> | Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/replicationProtectedItems/removeDisks/action | Remove disks |
> | Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/replicationProtectedItems/ResolveHealthErrors/action |  |
> | Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/replicationProtectedItems/failoverCancel/action | Failover Cancel |
> | Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/replicationProtectedItems/updateAppliance/action |  |
> | Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/replicationProtectedItems/operationresults/read | Track the results of an asynchronous operation on the resource Protected Items |
> | Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/replicationProtectedItems/recoveryPoints/read | Read any Replication Recovery Points |
> | Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/replicationProtectedItems/targetComputeSizes/read | Read any Target Compute Sizes |
> | Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/replicationProtectionClusters/read | Read any  |
> | Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/replicationProtectionClusters/delete | Delete any  |
> | Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/replicationProtectionClusters/unplannedFailover/action |  |
> | Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/replicationProtectionClusters/testFailover/action |  |
> | Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/replicationProtectionClusters/testFailoverCleanup/action |  |
> | Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/replicationProtectionClusters/applyRecoveryPoint/action |  |
> | Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/replicationProtectionClusters/failoverCommit/action |  |
> | Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/replicationProtectionClusters/repairReplication/action |  |
> | Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/replicationProtectionClusters/operationresults/read | Track the results of an asynchronous operation on the resource  |
> | Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/replicationProtectionContainerMappings/read | Read any Protection Container Mappings |
> | Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/replicationProtectionContainerMappings/write | Create or Update any Protection Container Mappings |
> | Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/replicationProtectionContainerMappings/remove/action | Remove Protection Container Mapping |
> | Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/replicationProtectionContainerMappings/delete | Delete any Protection Container Mappings |
> | Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/replicationProtectionContainerMappings/operationresults/read | Track the results of an asynchronous operation on the resource Protection Container Mappings |
> | Microsoft.RecoveryServices/vaults/replicationFabrics/replicationRecoveryServicesProviders/read | Read any Recovery Services Providers |
> | Microsoft.RecoveryServices/vaults/replicationFabrics/replicationRecoveryServicesProviders/write | Create or Update any Recovery Services Providers |
> | Microsoft.RecoveryServices/vaults/replicationFabrics/replicationRecoveryServicesProviders/remove/action | Remove Recovery Services Provider |
> | Microsoft.RecoveryServices/vaults/replicationFabrics/replicationRecoveryServicesProviders/delete | Delete any Recovery Services Providers |
> | Microsoft.RecoveryServices/vaults/replicationFabrics/replicationRecoveryServicesProviders/refreshProvider/action | Refresh Provider |
> | Microsoft.RecoveryServices/vaults/replicationFabrics/replicationRecoveryServicesProviders/operationresults/read | Track the results of an asynchronous operation on the resource Recovery Services Providers |
> | Microsoft.RecoveryServices/vaults/replicationFabrics/replicationStorageClassifications/read | Read any Storage Classifications |
> | Microsoft.RecoveryServices/vaults/replicationFabrics/replicationStorageClassifications/replicationStorageClassificationMappings/read | Read any Storage Classification Mappings |
> | Microsoft.RecoveryServices/vaults/replicationFabrics/replicationStorageClassifications/replicationStorageClassificationMappings/write | Create or Update any Storage Classification Mappings |
> | Microsoft.RecoveryServices/vaults/replicationFabrics/replicationStorageClassifications/replicationStorageClassificationMappings/delete | Delete any Storage Classification Mappings |
> | Microsoft.RecoveryServices/vaults/replicationFabrics/replicationStorageClassifications/replicationStorageClassificationMappings/operationresults/read | Track the results of an asynchronous operation on the resource Storage Classification Mappings |
> | Microsoft.RecoveryServices/vaults/replicationFabrics/replicationvCenters/read | Read any vCenters |
> | Microsoft.RecoveryServices/vaults/replicationFabrics/replicationvCenters/write | Create or Update any vCenters |
> | Microsoft.RecoveryServices/vaults/replicationFabrics/replicationvCenters/delete | Delete any vCenters |
> | Microsoft.RecoveryServices/vaults/replicationFabrics/replicationvCenters/operationresults/read | Track the results of an asynchronous operation on the resource vCenters |
> | Microsoft.RecoveryServices/vaults/replicationJobs/read | Read any Jobs |
> | Microsoft.RecoveryServices/vaults/replicationJobs/cancel/action | Cancel Job |
> | Microsoft.RecoveryServices/vaults/replicationJobs/restart/action | Restart job |
> | Microsoft.RecoveryServices/vaults/replicationJobs/resume/action | Resume Job |
> | Microsoft.RecoveryServices/vaults/replicationJobs/operationresults/read | Track the results of an asynchronous operation on the resource Jobs |
> | Microsoft.RecoveryServices/vaults/replicationMigrationItems/read | Read any Migration Items |
> | Microsoft.RecoveryServices/vaults/replicationNetworkMappings/read | Read any Network Mappings |
> | Microsoft.RecoveryServices/vaults/replicationNetworks/read | Read any Networks |
> | Microsoft.RecoveryServices/vaults/replicationOperationStatus/read | Read any Vault Replication Operation Status |
> | Microsoft.RecoveryServices/vaults/replicationPolicies/read | Read any Policies |
> | Microsoft.RecoveryServices/vaults/replicationPolicies/write | Create or Update any Policies |
> | Microsoft.RecoveryServices/vaults/replicationPolicies/delete | Delete any Policies |
> | Microsoft.RecoveryServices/vaults/replicationPolicies/operationresults/read | Track the results of an asynchronous operation on the resource Policies |
> | Microsoft.RecoveryServices/vaults/replicationProtectedItems/read | Read any Protected Items |
> | Microsoft.RecoveryServices/vaults/replicationProtectionContainerMappings/read | Read any Protection Container Mappings |
> | Microsoft.RecoveryServices/vaults/replicationProtectionContainers/read | Read any Protection Containers |
> | Microsoft.RecoveryServices/vaults/replicationProtectionIntents/read | Read any  |
> | Microsoft.RecoveryServices/vaults/replicationProtectionIntents/write | Create or Update any  |
> | Microsoft.RecoveryServices/vaults/replicationRecoveryPlans/read | Read any Recovery Plans |
> | Microsoft.RecoveryServices/vaults/replicationRecoveryPlans/write | Create or Update any Recovery Plans |
> | Microsoft.RecoveryServices/vaults/replicationRecoveryPlans/delete | Delete any Recovery Plans |
> | Microsoft.RecoveryServices/vaults/replicationRecoveryPlans/plannedFailover/action | Planned Failover Recovery Plan |
> | Microsoft.RecoveryServices/vaults/replicationRecoveryPlans/unplannedFailover/action | Failover Recovery Plan |
> | Microsoft.RecoveryServices/vaults/replicationRecoveryPlans/testFailover/action | Test Failover Recovery Plan |
> | Microsoft.RecoveryServices/vaults/replicationRecoveryPlans/testFailoverCleanup/action | Test Failover Cleanup Recovery Plan |
> | Microsoft.RecoveryServices/vaults/replicationRecoveryPlans/failoverCommit/action | Failover Commit Recovery Plan |
> | Microsoft.RecoveryServices/vaults/replicationRecoveryPlans/reProtect/action | ReProtect Recovery Plan |
> | Microsoft.RecoveryServices/vaults/replicationRecoveryPlans/failoverCancel/action | Cancel Failover Recovery Plan |
> | Microsoft.RecoveryServices/vaults/replicationRecoveryPlans/operationresults/read | Track the results of an asynchronous operation on the resource Recovery Plans |
> | Microsoft.RecoveryServices/vaults/replicationRecoveryServicesProviders/read | Read any Recovery Services Providers |
> | Microsoft.RecoveryServices/vaults/replicationStorageClassificationMappings/read | Read any Storage Classification Mappings |
> | Microsoft.RecoveryServices/vaults/replicationStorageClassifications/read | Read any Storage Classifications |
> | Microsoft.RecoveryServices/vaults/replicationSupportedOperatingSystems/read | Read any  |
> | Microsoft.RecoveryServices/vaults/replicationSupportedRegionMappings/read | Read any  |
> | Microsoft.RecoveryServices/vaults/replicationUsages/read | Read any Vault Replication Usages |
> | Microsoft.RecoveryServices/vaults/replicationVaultHealth/read | Read any Vault Replication Health |
> | Microsoft.RecoveryServices/vaults/replicationVaultHealth/refresh/action | Refresh Vault Health |
> | Microsoft.RecoveryServices/vaults/replicationVaultHealth/operationresults/read | Track the results of an asynchronous operation on the resource Vault Replication Health |
> | Microsoft.RecoveryServices/vaults/replicationVaultSettings/read | Read any  |
> | Microsoft.RecoveryServices/vaults/replicationVaultSettings/write | Create or Update any  |
> | Microsoft.RecoveryServices/vaults/replicationvCenters/read | Read any vCenters |
> | Microsoft.RecoveryServices/Vaults/usages/read | Returns usage details for a Recovery Services Vault. |
> | Microsoft.RecoveryServices/vaults/usages/read | Read any Vault Usages |
> | Microsoft.RecoveryServices/Vaults/vaultTokens/read | The Vault Token operation can be used to get Vault Token for vault level backend operations. |

## Microsoft.ResourceGraph

Powerful tool to query, explore, and analyze your cloud resources at scale.

Azure service: [Azure Resource Graph](/azure/governance/resource-graph/)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.ResourceGraph/operations/read | Gets the list of supported operations |
> | Microsoft.ResourceGraph/queries/read | Gets the specified graph query |
> | Microsoft.ResourceGraph/queries/delete | Deletes the specified graph query |
> | Microsoft.ResourceGraph/queries/write | Creates/Updates the specified graph query |
> | Microsoft.ResourceGraph/resourceChangeDetails/read | Gets the details of the specified resource change |
> | Microsoft.ResourceGraph/resourceChanges/read | Lists changes to a resource for a given time interval |
> | Microsoft.ResourceGraph/resources/read | Submits a query on resources within specified subscriptions, management groups or tenant scope |
> | Microsoft.ResourceGraph/resourcesHistory/read | List all snapshots of resources history within specified subscriptions, management groups or tenant scope |

## Microsoft.ResourceHealth

Diagnose and get support for service problems that affect your Azure resources.

Azure service: [Azure Service Health](/azure/service-health/)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.ResourceHealth/events/action | Endpoint to fetch details for event |
> | Microsoft.ResourceHealth/register/action | Registers the subscription for the Microsoft ResourceHealth |
> | Microsoft.ResourceHealth/unregister/action | Unregisters the subscription for the Microsoft ResourceHealth |
> | Microsoft.Resourcehealth/healthevent/action | Denotes the change in health state for the specified resource |
> | Microsoft.ResourceHealth/AvailabilityStatuses/read | Gets the availability statuses for all resources in the specified scope |
> | Microsoft.ResourceHealth/AvailabilityStatuses/current/read | Gets the availability status for the specified resource |
> | Microsoft.ResourceHealth/emergingissues/read | Get Azure services' emerging issues |
> | Microsoft.ResourceHealth/events/read | Get Service Health Events for given subscription |
> | Microsoft.ResourceHealth/events/fetchEventDetails/action | Endpoint to fetch details for event |
> | Microsoft.ResourceHealth/events/listSecurityAdvisoryImpactedResources/action | Get Impacted Resources for a given event of type SecurityAdvisory |
> | Microsoft.ResourceHealth/events/impactedResources/read | Get Impacted Resources for a given event |
> | Microsoft.Resourcehealth/healthevent/Activated/action | Denotes the change in health state for the specified resource |
> | Microsoft.Resourcehealth/healthevent/Updated/action | Denotes the change in health state for the specified resource |
> | Microsoft.Resourcehealth/healthevent/Resolved/action | Denotes the change in health state for the specified resource |
> | Microsoft.Resourcehealth/healthevent/InProgress/action | Denotes the change in health state for the specified resource |
> | Microsoft.Resourcehealth/healthevent/Pending/action | Denotes the change in health state for the specified resource |
> | Microsoft.ResourceHealth/impactedResources/read | Get Impacted Resources for given subscription |
> | Microsoft.ResourceHealth/metadata/read | Gets Metadata |
> | Microsoft.ResourceHealth/Notifications/read | Receives Azure Resource Manager notifications |
> | Microsoft.ResourceHealth/Operations/read | Get the operations available for the Microsoft ResourceHealth |
> | Microsoft.ResourceHealth/potentialoutages/read | Get Potential Outages for given subscription |

## Microsoft.Resources

Deployment and management service for Azure that enables you to create, update, and delete resources in your Azure subscription.

Azure service: [Azure Resource Manager](/azure/azure-resource-manager/)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.Resources/checkResourceName/action | Check the resource name for validity. |
> | Microsoft.Resources/calculateTemplateHash/action | Calculate the hash of provided template. |
> | Microsoft.Resources/checkZonePeers/action | Check Zone Peers |
> | Microsoft.Resources/changes/read | Gets or lists changes |
> | Microsoft.Resources/checkPolicyCompliance/read | Check the compliance status of a given resource against resource policies. |
> | Microsoft.Resources/deployments/read | Gets or lists deployments. |
> | Microsoft.Resources/deployments/write | Creates or updates an deployment. |
> | Microsoft.Resources/deployments/delete | Deletes a deployment. |
> | Microsoft.Resources/deployments/cancel/action | Cancels a deployment. |
> | Microsoft.Resources/deployments/validate/action | Validates an deployment. |
> | Microsoft.Resources/deployments/whatIf/action | Predicts template deployment changes. |
> | Microsoft.Resources/deployments/exportTemplate/action | Export template for a deployment |
> | Microsoft.Resources/deployments/operations/read | Gets or lists deployment operations. |
> | Microsoft.Resources/deployments/operationstatuses/read | Gets or lists deployment operation statuses. |
> | Microsoft.Resources/deploymentScripts/read | Gets or lists deployment scripts |
> | Microsoft.Resources/deploymentScripts/write | Creates or updates a deployment script |
> | Microsoft.Resources/deploymentScripts/delete | Deletes a deployment script |
> | Microsoft.Resources/deploymentScripts/logs/read | Gets or lists deployment script logs |
> | Microsoft.Resources/deploymentStacks/read | Gets or lists deployment stacks |
> | Microsoft.Resources/deploymentStacks/write | Creates or updates a deployment stack |
> | Microsoft.Resources/deploymentStacks/delete | Deletes a deployment stack |
> | Microsoft.Resources/deploymentStacks/manageDenySetting/action | Manage the denySettings property of a deployment stack. |
> | Microsoft.Resources/links/read | Gets or lists resource links. |
> | Microsoft.Resources/links/write | Creates or updates a resource link. |
> | Microsoft.Resources/links/delete | Deletes a resource link. |
> | Microsoft.Resources/locations/moboOperationStatuses/read | Reads the Mobo Service Operation Status for the resource. |
> | Microsoft.Resources/marketplace/purchase/action | Purchases a resource from the marketplace. |
> | Microsoft.Resources/moboBrokers/read | Gets or lists mobo brokers |
> | Microsoft.Resources/moboBrokers/write | Creates or updates a mobo broker |
> | Microsoft.Resources/moboBrokers/delete | Deletes a mobo broker |
> | Microsoft.Resources/providers/read | Get the list of providers. |
> | Microsoft.Resources/resources/read | Get the list of resources based upon filters. |
> | Microsoft.Resources/subscriptionRegistrations/read | Get Subscription Registration for a resource provider namespace. |
> | Microsoft.Resources/subscriptions/read | Gets the list of subscriptions. |
> | Microsoft.Resources/subscriptions/locations/read | Gets the list of locations supported. |
> | Microsoft.Resources/subscriptions/operationresults/read | Get the subscription operation results. |
> | Microsoft.Resources/subscriptions/providers/read | Gets or lists resource providers. |
> | Microsoft.Resources/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | Microsoft.Resources/subscriptions/resourceGroups/write | Creates or updates a resource group. |
> | Microsoft.Resources/subscriptions/resourceGroups/delete | Deletes a resource group and all its resources. |
> | Microsoft.Resources/subscriptions/resourceGroups/moveResources/action | Moves resources from one resource group to another. |
> | Microsoft.Resources/subscriptions/resourceGroups/validateMoveResources/action | Validate move of resources from one resource group to another. |
> | Microsoft.Resources/subscriptions/resourcegroups/deployments/read | Gets or lists deployments. |
> | Microsoft.Resources/subscriptions/resourcegroups/deployments/write | Creates or updates an deployment. |
> | Microsoft.Resources/subscriptions/resourcegroups/deployments/operations/read | Gets or lists deployment operations. |
> | Microsoft.Resources/subscriptions/resourcegroups/deployments/operationstatuses/read | Gets or lists deployment operation statuses. |
> | Microsoft.Resources/subscriptions/resourcegroups/resources/read | Gets the resources for the resource group. |
> | Microsoft.Resources/subscriptions/resources/read | Gets resources of a subscription. |
> | Microsoft.Resources/subscriptions/tagNames/read | Gets or lists subscription tags. |
> | Microsoft.Resources/subscriptions/tagNames/write | Adds a subscription tag. |
> | Microsoft.Resources/subscriptions/tagNames/delete | Deletes a subscription tag. |
> | Microsoft.Resources/subscriptions/tagNames/tagValues/read | Gets or lists subscription tag values. |
> | Microsoft.Resources/subscriptions/tagNames/tagValues/write | Adds a subscription tag value. |
> | Microsoft.Resources/subscriptions/tagNames/tagValues/delete | Deletes a subscription tag value. |
> | Microsoft.Resources/tags/read | Gets all the tags on a resource. |
> | Microsoft.Resources/tags/write | Updates the tags on a resource by replacing or merging existing tags with a new set of tags, or removing existing tags. |
> | Microsoft.Resources/tags/delete | Removes all the tags on a resource. |
> | Microsoft.Resources/templateSpecs/read | Gets or lists template specs |
> | Microsoft.Resources/templateSpecs/write | Creates or updates a template spec |
> | Microsoft.Resources/templateSpecs/delete | Deletes a template spec |
> | Microsoft.Resources/templateSpecs/versions/read | Gets or lists template specs |
> | Microsoft.Resources/templateSpecs/versions/write | Creates or updates a template spec version |
> | Microsoft.Resources/templateSpecs/versions/delete | Deletes a template spec version |
> | Microsoft.Resources/tenants/read | Gets the list of tenants. |

## Microsoft.Solutions

Find the solution to meet the needs of your application or business.

Azure service: [Azure Managed Applications](/azure/azure-resource-manager/managed-applications/)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.Solutions/register/action | Register the subscription for Microsoft.Solutions |
> | Microsoft.Solutions/unregister/action | Unregister the subscription for Microsoft.Solutions |
> | Microsoft.Solutions/portalRegistryPackage/action | Generates the registry package links for Managed Applications and Solution Templates. |
> | Microsoft.Solutions/applicationDefinitions/read | Gets the managed application definition. |
> | Microsoft.Solutions/applicationDefinitions/write | Creates or updates a managed application definition. |
> | Microsoft.Solutions/applicationDefinitions/delete | Deletes the managed application definition. |
> | Microsoft.Solutions/applicationDefinitions/write | Updates the managed application definition. |
> | Microsoft.Solutions/applicationDefinitions/read | Lists the managed application definitions in a resource group. |
> | Microsoft.Solutions/applicationDefinitions/read | Lists all the application definitions within a subscription. |
> | Microsoft.Solutions/applications/read | Gets the managed application. |
> | Microsoft.Solutions/applications/write | Creates or updates a managed application. |
> | Microsoft.Solutions/applications/delete | Deletes the managed application. |
> | Microsoft.Solutions/applications/write | Updates an existing managed application. |
> | Microsoft.Solutions/applications/read | Lists all the applications within a resource group. |
> | Microsoft.Solutions/applications/read | Lists all the applications within a subscription. |
> | Microsoft.Solutions/applications/refreshPermissions/action | Refresh Permissions for application. |
> | Microsoft.Solutions/applications/listAllowedUpgradePlans/action | List allowed upgrade plans for application. |
> | Microsoft.Solutions/applications/updateAccess/action | Update access for application. |
> | Microsoft.Solutions/applications/listTokens/action | List tokens for application. |
> | Microsoft.Solutions/jitRequests/read | Gets the JIT request. |
> | Microsoft.Solutions/jitRequests/write | Creates or updates the JIT request. |
> | Microsoft.Solutions/jitRequests/delete | Deletes the JIT request. |
> | Microsoft.Solutions/jitRequests/write | Updates the JIT request. |
> | Microsoft.Solutions/jitRequests/read | Lists all JIT requests within the subscription. |
> | Microsoft.Solutions/jitRequests/read | Lists all JIT requests within the resource group. |
> | Microsoft.Solutions/locations/operationstatuses/read | read operationstatuses |
> | Microsoft.Solutions/locations/operationstatuses/write | write operationstatuses |
> | Microsoft.Solutions/operations/read | read operations |

## Microsoft.Workloads

Azure service: [SAP on Azure](/azure/sap/)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.Workloads/register/action | Register the subscription for Microsoft.Workloads |
> | Microsoft.Workloads/unregister/action | Unregister the subscription for Microsoft.Workloads |
> | Microsoft.Workloads/connectors/read | Gets a connector resource |
> | Microsoft.Workloads/connectors/write | Creates a connector resource |
> | Microsoft.Workloads/connectors/delete | Deletes a connector resource and its child resources, which are the associated connection resources. All the child resources have to be deleted before deleting the connector resource. |
> | Microsoft.Workloads/connectors/write | Updates a connector resource |
> | Microsoft.Workloads/connectors/read | Gets all connector resources in a Resource Group. |
> | Microsoft.Workloads/connectors/read | Gets all connector resources in a Subscription. |
> | Microsoft.Workloads/connectors/acssBackups/read | Gets the backup connection resource of virtual instance for SAP. |
> | Microsoft.Workloads/connectors/acssBackups/write | Creates the backup connection resource of virtual instance for SAP. |
> | Microsoft.Workloads/connectors/acssBackups/delete | Deletes the backup connection resource of virtual instance for SAP. |
> | Microsoft.Workloads/connectors/acssBackups/write | Updates the backup connection resource of virtual instance for SAP. <br><br>This can be used to update tags on the resource. |
> | Microsoft.Workloads/connectors/acssBackups/read | Lists the backup connection resources of virtual instance for SAP under the given connector resource. |
> | Microsoft.Workloads/connectors/sapVirtualInstanceMonitors/read | Gets the monitor connection resource of virtual instance for SAP. |
> | Microsoft.Workloads/connectors/sapVirtualInstanceMonitors/write | Creates the monitor connection resource of virtual instance for SAP. |
> | Microsoft.Workloads/connectors/sapVirtualInstanceMonitors/delete | Deletes the monitor connection resource of virtual instance for SAP. |
> | Microsoft.Workloads/connectors/sapVirtualInstanceMonitors/write | Updates the monitor connection resource of virtual instance for SAP. <br><br>This can be used to update tags on the resource. |
> | Microsoft.Workloads/connectors/sapVirtualInstanceMonitors/read | Lists the monitor connection resources of virtual instance for SAP under the given connector resource. |
> | Microsoft.Workloads/insights/read | Gets properties of Workloads Insights instance for the specified subscription, resource group and instance name. |
> | Microsoft.Workloads/insights/read | Gets a list of Workloads Insight instances in the specified subscription and resource group. The operations returns various properties of each instance. |
> | Microsoft.Workloads/insights/read | Gets a list of Workloads Insight instances in the specified subscription. The operations returns various properties of each instance. |
> | Microsoft.Workloads/insights/write | Creates a Workloads Insights instance for the specified subscription, resource group, and instance name. |
> | Microsoft.Workloads/insights/delete | Deletes a Workloads Insights instance for the specified subscription, resource group and instance name. |
> | Microsoft.Workloads/insights/write | Patches the Workload Insights instance for the specified subscription, resource group, and instance name. |
> | Microsoft.Workloads/instanceGroupMonitors/read | Gets a Instance Group Monitor. |
> | Microsoft.Workloads/instanceGroupMonitors/write | Creates a Instance Group Monitor. |
> | Microsoft.Workloads/instanceGroupMonitors/delete | Deletes a Instance Group Monitor. |
> | Microsoft.Workloads/instanceGroupMonitors/write | Updates a Instance Group Monitor. |
> | Microsoft.Workloads/instanceGroupMonitors/read | Gets all Instance Group Monitors in a resource group. |
> | Microsoft.Workloads/instanceGroupMonitors/read | Gets all Instance Group Monitors in a subscription. |
> | Microsoft.Workloads/instanceHealthDefinitions/read | Gets a Instance Health Definition. |
> | Microsoft.Workloads/instanceHealthDefinitions/write | Creates a Instance Health Definition. |
> | Microsoft.Workloads/instanceHealthDefinitions/delete | Deletes a Instance Health Definition. |
> | Microsoft.Workloads/instanceHealthDefinitions/write | Updates a Instance Health Definition. |
> | Microsoft.Workloads/instanceHealthDefinitions/read | Gets all Instance Health Definitions in a resource group. |
> | Microsoft.Workloads/instanceHealthDefinitions/read | Gets all Instance Health Definitions in a subscription. |
> | Microsoft.Workloads/instanceHealthDefinitions/signalDefinitions/read | Gets a Signal Definition. |
> | Microsoft.Workloads/instanceHealthDefinitions/signalDefinitions/write | Creates a Instance Health Definition. |
> | Microsoft.Workloads/instanceHealthDefinitions/signalDefinitions/delete | Deletes a Signal Definition. |
> | Microsoft.Workloads/instanceHealthDefinitions/signalDefinitions/write | Updates a Signal Definition. |
> | Microsoft.Workloads/instanceHealthDefinitions/signalDefinitions/read | Gets all Signal Definitions under a Health Definition. |
> | Microsoft.Workloads/instanceMonitors/read | Gets a Instance Monitor. |
> | Microsoft.Workloads/instanceMonitors/write | Creates a Instance Monitor. |
> | Microsoft.Workloads/instanceMonitors/delete | Deletes a Instance Monitor. |
> | Microsoft.Workloads/instanceMonitors/write | Updates a Instance Monitor. |
> | Microsoft.Workloads/instanceMonitors/read | Gets all Instance Monitors in a resource group. |
> | Microsoft.Workloads/instanceMonitors/read | Gets all Instance Monitors in a subscription. |
> | Microsoft.Workloads/Locations/OperationStatuses/read | read OperationStatuses |
> | Microsoft.Workloads/Locations/OperationStatuses/write | write OperationStatuses |
> | Microsoft.Workloads/locations/sapVirtualInstanceMetadata/getSizingRecommendations/action | Get SAP sizing recommendations. |
> | Microsoft.Workloads/locations/sapVirtualInstanceMetadata/getSapSupportedSku/action | Get SAP supported SKUs. |
> | Microsoft.Workloads/locations/sapVirtualInstanceMetadata/getDiskConfigurations/action | Get SAP Disk Configurations. |
> | Microsoft.Workloads/locations/sapVirtualInstanceMetadata/getAvailabilityZoneDetails/action | Get SAP Availability Zone Details. |
> | Microsoft.Workloads/monitors/read | Gets a list of SAP monitors in the specified subscription. The operations returns various properties of each SAP monitor. |
> | Microsoft.Workloads/monitors/read | Gets a list of SAP monitors in the specified resource group. |
> | Microsoft.Workloads/monitors/read | Gets properties of a SAP monitor for the specified subscription, resource group, and resource name. |
> | Microsoft.Workloads/monitors/write | Creates a SAP monitor for the specified subscription, resource group, and resource name. |
> | Microsoft.Workloads/monitors/delete | Deletes a SAP monitor with the specified subscription, resource group, and monitor name. |
> | Microsoft.Workloads/monitors/write | Patches the Tags field of a SAP monitor for the specified subscription, resource group, and monitor name. |
> | Microsoft.Workloads/monitors/alerts/read | Gets a list of alert instances in the specified SAP monitor. The operations returns various properties of each provider instances. |
> | Microsoft.Workloads/monitors/alerts/read | Gets properties of a alert for the specified subscription, resource group, Monitor name, and resource name. |
> | Microsoft.Workloads/monitors/alerts/write | Creates a alert for the specified subscription, resource group, Monitor name, and resource name. |
> | Microsoft.Workloads/monitors/alerts/delete | Deletes a alert for the specified subscription, resource group, Monitor name, and resource name. |
> | Microsoft.Workloads/monitors/alertTemplates/read | Gets properties of an alert template for the specified subscription, resource group, SAP monitor name, and resource name. |
> | Microsoft.Workloads/monitors/alertTemplates/read | Gets properties of a alert for the specified subscription, resource group, Monitor name, and resource name. |
> | Microsoft.Workloads/monitors/providerInstances/read | Gets a list of provider instances in the specified SAP monitor. The operations returns various properties of each provider instances. |
> | Microsoft.Workloads/monitors/providerInstances/read | Gets properties of a provider instance for the specified subscription, resource group, Monitor name, and resource name. |
> | Microsoft.Workloads/monitors/providerInstances/write | Creates a provider instance for the specified subscription, resource group, Monitor name, and resource name. |
> | Microsoft.Workloads/monitors/providerInstances/delete | Deletes a provider instance for the specified subscription, resource group, Monitor name, and resource name. |
> | Microsoft.Workloads/monitors/sapLandscapeMonitor/read | Gets a list of properties of a SAP Landscape monitor configuration for the specified subscription, resource group, and resource name. |
> | Microsoft.Workloads/monitors/sapLandscapeMonitor/read | Gets properties of a SAP Landscape monitor configuration for the specified subscription, resource group, and resource name. |
> | Microsoft.Workloads/monitors/sapLandscapeMonitor/write | Creates a SAP Landscape monitor configuration for the specified subscription, resource group, and resource name. |
> | Microsoft.Workloads/monitors/sapLandscapeMonitor/delete | Deletes a SAP Landscape monitor configuration with the specified subscription, resource group, and monitor name. |
> | Microsoft.Workloads/Operations/read | read Operations |
> | Microsoft.Workloads/phpWorkloads/read | Lists phpWorkload resources in a subscription |
> | Microsoft.Workloads/phpWorkloads/read | Lists phpWorkload resources in a resource group |
> | Microsoft.Workloads/phpWorkloads/read | Gets a phpWorkload resource |
> | Microsoft.Workloads/phpWorkloads/write | Create or updated phpWorkloads resource |
> | Microsoft.Workloads/phpWorkloads/delete | Delete phpWorkloads resource |
> | Microsoft.Workloads/phpWorkloads/write | Update PHP workload resource. |
> | Microsoft.Workloads/phpWorkloads/wordpressInstances/read | Lists WordpressInstances resources under a phpWorkload resource |
> | Microsoft.Workloads/phpWorkloads/wordpressInstances/read | Gets a WordpressInstances resource |
> | Microsoft.Workloads/phpWorkloads/wordpressInstances/write | Create or updated WordpressInstances resource |
> | Microsoft.Workloads/phpWorkloads/wordpressInstances/delete | Delete WordpressInstances resource |
> | Microsoft.Workloads/RegisteredSubscriptions/read | Reads registered subscriptions |
> | Microsoft.Workloads/sapDiscoverySites/read | Gets a SAP Migration discovery site resource. |
> | Microsoft.Workloads/sapDiscoverySites/write | Creates a discovery site for SAP Migration. |
> | Microsoft.Workloads/sapDiscoverySites/delete | Deletes a SAP Migration discovery site resource and its child resources, that is the associated SAP Instances and Server Instances. |
> | Microsoft.Workloads/sapDiscoverySites/write | SAPDiscoverySites_Update. |
> | Microsoft.Workloads/sapDiscoverySites/read | Gets all SAP Migration discovery site resources in a Resource Group. |
> | Microsoft.Workloads/sapDiscoverySites/read | Gets all SAP Migration discovery site resources in a Subscription. |
> | Microsoft.Workloads/sapDiscoverySites/importEntities/action | Import a SAP Migration discovery site resource and it's child resources, that is the SAP instances and Server instances. |
> | Microsoft.Workloads/sapDiscoverySites/sapInstances/read | Gets the SAP Instance resource. |
> | Microsoft.Workloads/sapDiscoverySites/sapInstances/write | Creates the SAP Instance resource. <br><br>This will be used by service only. PUT operation on this resource by end user will return a Bad Request error. |
> | Microsoft.Workloads/sapDiscoverySites/sapInstances/delete | Deletes the SAP Instance resource. <br><br>This will be used by service only. Delete operation on this resource by end user will return a Bad Request error. You can delete the parent resource, which is the SAP Migration discovery site resource, using the delete operation on it. |
> | Microsoft.Workloads/sapDiscoverySites/sapInstances/write | Updates the SAP Instance resource. |
> | Microsoft.Workloads/sapDiscoverySites/sapInstances/read | Lists the SAP Instance resources for the given SAP Migration discovery site resource. |
> | Microsoft.Workloads/sapDiscoverySites/sapInstances/serverInstances/read | Gets the Server Instance resource. |
> | Microsoft.Workloads/sapDiscoverySites/sapInstances/serverInstances/write | Creates the Server Instance resource. <br><br>This will be used by service only. PUT operation on this resource by end user will return a Bad Request error. |
> | Microsoft.Workloads/sapDiscoverySites/sapInstances/serverInstances/delete | Deletes the Server Instance resource. <br><br>This will be used by service only. Delete operation on this resource by end user will return a Bad Request error. You can delete the parent resource, which is the SAP Migration discovery site resource, using the delete operation on it. |
> | Microsoft.Workloads/sapDiscoverySites/sapInstances/serverInstances/write | Updates the Server Instance resource. This operation on a resource by end user will return a Bad Request error. |
> | Microsoft.Workloads/sapDiscoverySites/sapInstances/serverInstances/read | Lists the Server Instance resources for the given SAP Instance resource. |
> | Microsoft.Workloads/sapVirtualInstances/read | Gets an SAP Virtual Instance. |
> | Microsoft.Workloads/sapVirtualInstances/write | Creates an SAP Virtual Instance. |
> | Microsoft.Workloads/sapVirtualInstances/delete | Deletes an SAP Virtual Instance. |
> | Microsoft.Workloads/sapVirtualInstances/write | Updates an SAP Virtual Instance. |
> | Microsoft.Workloads/sapVirtualInstances/read | Gets all SAP Virtual Instances in a resource group. |
> | Microsoft.Workloads/sapVirtualInstances/read | Gets all SAP Virtual Instances in the subscription. |
> | Microsoft.Workloads/sapVirtualInstances/start/action | Starts the SAP System. |
> | Microsoft.Workloads/sapVirtualInstances/stop/action | Stops the SAP System. |
> | Microsoft.Workloads/sapVirtualInstances/applicationInstances/read | Gets the SAP Application Server Instance. |
> | Microsoft.Workloads/sapVirtualInstances/applicationInstances/write | Puts the SAP Application Server Instance. |
> | Microsoft.Workloads/sapVirtualInstances/applicationInstances/delete | Deletes the SAP Application Server Instance. <br><br>This operation will be used by service only. Delete by end user will return a Bad Request error. |
> | Microsoft.Workloads/sapVirtualInstances/applicationInstances/write | Puts the SAP Application Server Instance. |
> | Microsoft.Workloads/sapVirtualInstances/applicationInstances/read | Lists the SAP Application server Instances in an SVI. |
> | Microsoft.Workloads/sapVirtualInstances/applicationInstances/start/action | Starts the SAP Application server Instance in an SVI. |
> | Microsoft.Workloads/sapVirtualInstances/applicationInstances/stop/action | Stops the SAP Application server Instance in an SVI. |
> | Microsoft.Workloads/sapVirtualInstances/centralInstances/read | Gets the SAP Central Instance. |
> | Microsoft.Workloads/sapVirtualInstances/centralInstances/write | Puts the SAP Central Instance. <br><br>This will be used by service only. PUT by end user will return a Bad Request error. |
> | Microsoft.Workloads/sapVirtualInstances/centralInstances/delete | Deletes the SAP Central Instance. <br><br>This will be used by service only. Delete by end user will return a Bad Request error. |
> | Microsoft.Workloads/sapVirtualInstances/centralInstances/write | Updates the SAP Central Instance. <br><br>This can be used to update tags. |
> | Microsoft.Workloads/sapVirtualInstances/centralInstances/read | Lists the SAP Central Instances in an SVI. |
> | Microsoft.Workloads/sapVirtualInstances/centralInstances/start/action | Starts the SAP Central server Instance in an SVI. |
> | Microsoft.Workloads/sapVirtualInstances/centralInstances/stop/action | Stops the SAP Central server Instance in an SVI. |
> | Microsoft.Workloads/sapVirtualInstances/databaseInstances/read | Gets the SAP Database Instance. |
> | Microsoft.Workloads/sapVirtualInstances/databaseInstances/write | Puts the SAP Database Instance. |
> | Microsoft.Workloads/sapVirtualInstances/databaseInstances/delete | Deletes the SAP Database Instance. <br><br>This will be used by service only. Delete by end user will return a Bad Request error. |
> | Microsoft.Workloads/sapVirtualInstances/databaseInstances/write | Puts the SAP Database Instance. |
> | Microsoft.Workloads/sapVirtualInstances/databaseInstances/read | Lists the SAP Database Instances in an SVI. |
> | Microsoft.Workloads/sapVirtualInstances/databaseInstances/start/action | Starts the database instance of the SAP system. |
> | Microsoft.Workloads/sapVirtualInstances/databaseInstances/stop/action | Stops the database instance of the SAP system. |
> | Microsoft.Workloads/skus/read | Gets the list of Microsoft.Workloads SKUs available for your Subscription |
> | Microsoft.Workloads/virtualInstances/read | Gets a Virtual Instance. |
> | Microsoft.Workloads/virtualInstances/write | Creates a Virtual Instance. |
> | Microsoft.Workloads/virtualInstances/delete | Deletes a Virtual Instance. |
> | Microsoft.Workloads/virtualInstances/write | Updates a Virtual Instance. |
> | Microsoft.Workloads/virtualInstances/read | Gets all Virtual Instances in a resource group. |
> | Microsoft.Workloads/virtualInstances/read | Gets all Virtual Instances in a subscription. |
> | Microsoft.Workloads/virtualInstances/components/read | Gets a Workload Component. |
> | Microsoft.Workloads/virtualInstances/components/write | Creates a Workload Component. |
> | Microsoft.Workloads/virtualInstances/components/delete | Deletes a Workload Component. |
> | Microsoft.Workloads/virtualInstances/components/write | Updates a Workload Component. |
> | Microsoft.Workloads/virtualInstances/components/read | Gets all Workload Components in a Virtual Instance. |

## Next steps

- [Azure resource providers and types](/azure/azure-resource-manager/management/resource-providers-and-types)
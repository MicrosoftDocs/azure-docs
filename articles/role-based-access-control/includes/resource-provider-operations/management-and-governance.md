---
title: Management and governance resource provider operations include file
description: Management and governance resource provider operations include file
author: rolyon
manager: amycolannino
ms.service: role-based-access-control
ms.workload: identity
ms.topic: include
ms.date: 06/01/2023
ms.author: rolyon
ms.custom: generated
---

### Microsoft.Advisor

Azure service: [Azure Advisor](../../../advisor/index.yml)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.Advisor/generateRecommendations/action | Gets generate recommendations status |
> | Microsoft.Advisor/register/action | Registers the subscription for the Microsoft Advisor |
> | Microsoft.Advisor/unregister/action | Unregisters the subscription for the Microsoft Advisor |
> | Microsoft.Advisor/advisorScore/read | Gets the score data for given subscription |
> | Microsoft.Advisor/configurations/read | Get configurations |
> | Microsoft.Advisor/configurations/write | Creates/updates configuration |
> | Microsoft.Advisor/generateRecommendations/read | Gets generate recommendations status |
> | Microsoft.Advisor/metadata/read | Get Metadata |
> | Microsoft.Advisor/operations/read | Gets the operations for the Microsoft Advisor |
> | Microsoft.Advisor/recommendations/read | Reads recommendations |
> | Microsoft.Advisor/recommendations/available/action | New recommendation is available in Microsoft Advisor |
> | Microsoft.Advisor/recommendations/suppressions/read | Gets suppressions |
> | Microsoft.Advisor/recommendations/suppressions/write | Creates/updates suppressions |
> | Microsoft.Advisor/recommendations/suppressions/delete | Deletes suppression |
> | Microsoft.Advisor/suppressions/read | Gets suppressions |
> | Microsoft.Advisor/suppressions/write | Creates/updates suppressions |
> | Microsoft.Advisor/suppressions/delete | Deletes suppression |

### Microsoft.Authorization

Azure service: [Azure Policy](../../../governance/policy/overview.md), [Azure RBAC](../../overview.md), [Azure Resource Manager](../../../azure-resource-manager/index.yml)

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
> | Microsoft.Authorization/policyExemptions/read | Get information about a policy exemption. |
> | Microsoft.Authorization/policyExemptions/write | Create a policy exemption at the specified scope. |
> | Microsoft.Authorization/policyExemptions/delete | Delete a policy exemption at the specified scope. |
> | Microsoft.Authorization/policySetDefinitions/read | Get information about a policy set definition. |
> | Microsoft.Authorization/policySetDefinitions/write | Create a custom policy set definition. |
> | Microsoft.Authorization/policySetDefinitions/delete | Delete a policy set definition. |
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

### Microsoft.Automation

Azure service: [Automation](../../../automation/index.yml)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.Automation/register/action | Registers the subscription to Azure Automation |
> | Microsoft.Automation/automationAccounts/convertGraphRunbookContent/action | Convert Graph Runbook Content to its raw serialized format and vice-versa |
> | Microsoft.Automation/automationAccounts/webhooks/action | Generates a URI for an Azure Automation webhook |
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

### Microsoft.Batch

Azure service: [Batch](../../../batch/index.yml)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.Batch/register/action | Registers the subscription for the Batch Resource Provider and enables the creation of Batch accounts |
> | Microsoft.Batch/unregister/action | Unregisters the subscription for the Batch Resource Provider preventing the creation of Batch accounts |
> | Microsoft.Batch/batchAccounts/read | Lists Batch accounts or gets the properties of a Batch account |
> | Microsoft.Batch/batchAccounts/write | Creates a new Batch account or updates an existing Batch account |
> | Microsoft.Batch/batchAccounts/delete | Deletes a Batch account |
> | Microsoft.Batch/batchAccounts/listkeys/action | Lists access keys for a Batch account |
> | Microsoft.Batch/batchAccounts/regeneratekeys/action | Regenerates access keys for a Batch account |
> | Microsoft.Batch/batchAccounts/syncAutoStorageKeys/action | Synchronizes access keys for the auto storage account configured for a Batch account |
> | Microsoft.Batch/batchAccounts/applications/read | Lists applications or gets the properties of an application |
> | Microsoft.Batch/batchAccounts/applications/write | Creates a new application or updates an existing application |
> | Microsoft.Batch/batchAccounts/applications/delete | Deletes an application |
> | Microsoft.Batch/batchAccounts/applications/versions/read | Gets the properties of an application package |
> | Microsoft.Batch/batchAccounts/applications/versions/write | Creates a new application package or updates an existing application package |
> | Microsoft.Batch/batchAccounts/applications/versions/delete | Deletes an application package |
> | Microsoft.Batch/batchAccounts/applications/versions/activate/action | Activates an application package |
> | Microsoft.Batch/batchAccounts/certificateOperationResults/read | Gets the results of a long running certificate operation on a Batch account |
> | Microsoft.Batch/batchAccounts/certificates/read | Lists certificates on a Batch account or gets the properties of a certificate |
> | Microsoft.Batch/batchAccounts/certificates/write | Creates a new certificate on a Batch account or updates an existing certificate |
> | Microsoft.Batch/batchAccounts/certificates/delete | Deletes a certificate from a Batch account |
> | Microsoft.Batch/batchAccounts/certificates/cancelDelete/action | Cancels the failed deletion of a certificate on a Batch account |
> | Microsoft.Batch/batchAccounts/detectors/read | Gets AppLens Detector or Lists AppLens Detectors on a Batch account |
> | Microsoft.Batch/batchAccounts/operationResults/read | Gets the results of a long running Batch account operation |
> | Microsoft.Batch/batchAccounts/outboundNetworkDependenciesEndpoints/read | Lists the outbound network dependency endpoints for a Batch account |
> | Microsoft.Batch/batchAccounts/poolOperationResults/read | Gets the results of a long running pool operation on a Batch account |
> | Microsoft.Batch/batchAccounts/pools/read | Lists pools on a Batch account or gets the properties of a pool |
> | Microsoft.Batch/batchAccounts/pools/write | Creates a new pool on a Batch account or updates an existing pool |
> | Microsoft.Batch/batchAccounts/pools/delete | Deletes a pool from a Batch account |
> | Microsoft.Batch/batchAccounts/pools/stopResize/action | Stops an ongoing resize operation on a Batch account pool |
> | Microsoft.Batch/batchAccounts/pools/disableAutoscale/action | Disables automatic scaling for a Batch account pool |
> | Microsoft.Batch/batchAccounts/privateEndpointConnectionProxies/validate/action | Validates a Private endpoint connection proxy on a Batch account |
> | Microsoft.Batch/batchAccounts/privateEndpointConnectionProxies/write | Create a new Private endpoint connection proxy on a Batch account |
> | Microsoft.Batch/batchAccounts/privateEndpointConnectionProxies/read | Gets Private endpoint connection proxy on a Batch account |
> | Microsoft.Batch/batchAccounts/privateEndpointConnectionProxies/delete | Delete a Private endpoint connection proxy on a Batch account |
> | Microsoft.Batch/batchAccounts/privateEndpointConnectionProxyResults/read | Gets the results of a long running Batch account private endpoint connection proxy operation |
> | Microsoft.Batch/batchAccounts/privateEndpointConnectionResults/read | Gets the results of a long running Batch account private endpoint connection operation |
> | Microsoft.Batch/batchAccounts/privateEndpointConnections/write | Update an existing Private endpoint connection on a Batch account |
> | Microsoft.Batch/batchAccounts/privateEndpointConnections/read | Gets Private endpoint connection or Lists Private endpoint connections on a Batch account |
> | Microsoft.Batch/batchAccounts/privateEndpointConnections/delete | Delete a Private endpoint connection on a Batch account |
> | Microsoft.Batch/batchAccounts/privateLinkResources/read | Gets the properties of a Private link resource or Lists Private link resources on a Batch account |
> | Microsoft.Batch/batchAccounts/providers/Microsoft.Insights/diagnosticSettings/read | Gets the diagnostic setting for the resource |
> | Microsoft.Batch/batchAccounts/providers/Microsoft.Insights/diagnosticSettings/write | Creates or updates the diagnostic setting for the resource |
> | Microsoft.Batch/batchAccounts/providers/Microsoft.Insights/logDefinitions/read | Gets the available logs for the Batch service |
> | Microsoft.Batch/batchAccounts/providers/Microsoft.Insights/metricDefinitions/read | Gets the available metrics for the Batch service |
> | Microsoft.Batch/locations/checkNameAvailability/action | Checks that the account name is valid and not in use. |
> | Microsoft.Batch/locations/accountOperationResults/read | Gets the results of a long running Batch account operation |
> | Microsoft.Batch/locations/cloudServiceSkus/read | Lists available Batch supported Cloud Service VM sizes at the given location |
> | Microsoft.Batch/locations/quotas/read | Gets Batch quotas of the specified subscription at the specified Azure region |
> | Microsoft.Batch/locations/virtualMachineSkus/read | Lists available Batch supported Virtual Machine VM sizes at the given location |
> | Microsoft.Batch/operations/read | Lists operations available on Microsoft.Batch resource provider |
> | **DataAction** | **Description** |
> | Microsoft.Batch/batchAccounts/jobs/read | Lists jobs on a Batch account or gets the properties of a job |
> | Microsoft.Batch/batchAccounts/jobs/write | Creates a new job on a Batch account or updates an existing job |
> | Microsoft.Batch/batchAccounts/jobs/delete | Deletes a job from a Batch account |
> | Microsoft.Batch/batchAccounts/jobSchedules/read | Lists job schedules on a Batch account or gets the properties of a job schedule |
> | Microsoft.Batch/batchAccounts/jobSchedules/write | Creates a new job schedule on a Batch account or updates an existing job schedule |
> | Microsoft.Batch/batchAccounts/jobSchedules/delete | Deletes a job schedule from a Batch account |

### Microsoft.Billing

Azure service: [Cost Management + Billing](../../../cost-management-billing/index.yml)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.Billing/validateAddress/action |  |
> | Microsoft.Billing/register/action |  |
> | Microsoft.Billing/billingAccounts/read |  |
> | Microsoft.Billing/billingAccounts/write |  |
> | Microsoft.Billing/billingAccounts/listInvoiceSectionsWithCreateSubscriptionPermission/action |  |
> | Microsoft.Billing/billingAccounts/confirmTransition/action |  |
> | Microsoft.Billing/billingAccounts/billingProfiles/action |  |
> | Microsoft.Billing/billingAccounts/listRecommendations/action |  |
> | Microsoft.Billing/billingAccounts/addDepartment/write |  |
> | Microsoft.Billing/billingAccounts/addEnrollmentAccount/write |  |
> | Microsoft.Billing/billingAccounts/agreements/read |  |
> | Microsoft.Billing/billingAccounts/associatedTenants/read | Lists the tenants that can collaborate with the billing account on commerce activities like viewing and downloading invoices, managing payments, making purchases, and managing licenses. |
> | Microsoft.Billing/billingAccounts/associatedTenants/write | Create or update an associated tenant for the billing account. |
> | Microsoft.Billing/billingAccounts/billingPermissions/read |  |
> | Microsoft.Billing/billingAccounts/billingProfiles/read |  |
> | Microsoft.Billing/billingAccounts/billingProfiles/write |  |
> | Microsoft.Billing/billingAccounts/billingProfiles/purchaseProduct/action |  |
> | Microsoft.Billing/billingAccounts/billingProfiles/priceProduct/action |  |
> | Microsoft.Billing/billingAccounts/billingProfiles/invoiceSections/action |  |
> | Microsoft.Billing/billingAccounts/billingProfiles/billingPermissions/read |  |
> | Microsoft.Billing/billingAccounts/billingProfiles/billingRoleDefinitions/read | Gets the definition for a role on a billing profile. The operation is supported for billing accounts with agreement type Microsoft Partner Agreement or Microsoft Customer Agreement. |
> | Microsoft.Billing/billingAccounts/billingProfiles/billingSubscriptions/read | Get a billing subscription by billing profile ID and billing subscription ID. This operation is supported only for billing accounts of type Enterprise Agreement. |
> | Microsoft.Billing/billingAccounts/billingProfiles/checkAccess/write |  |
> | Microsoft.Billing/billingAccounts/billingProfiles/customers/read |  |
> | Microsoft.Billing/billingAccounts/billingProfiles/customers/billingPermissions/read |  |
> | Microsoft.Billing/billingAccounts/billingProfiles/customers/checkAccess/write |  |
> | Microsoft.Billing/billingAccounts/billingProfiles/customers/resolveBillingRoleAssignments/write |  |
> | Microsoft.Billing/billingAccounts/billingProfiles/departments/read | Lists the departments that a user has access to. The operation is supported only for billing accounts with agreement type Enterprise Agreement. |
> | Microsoft.Billing/billingAccounts/billingProfiles/departments/billingPermissions/read |  |
> | Microsoft.Billing/billingAccounts/billingProfiles/departments/billingRoleDefinitions/read | Gets the definition for a role on a department. The operation is supported for billing profiles with agreement type Enterprise Agreement. |
> | Microsoft.Billing/billingAccounts/billingProfiles/departments/billingSubscriptions/read | List billing subscriptions by billing profile ID and department name. This operation is supported only for billing accounts of type Enterprise Agreement. |
> | Microsoft.Billing/billingAccounts/billingProfiles/departments/enrollmentAccounts/read | Get list of enrollment accounts using billing profile ID and department ID |
> | Microsoft.Billing/billingAccounts/billingProfiles/enrollmentAccounts/read | Lists the enrollment accounts for a specific billing account and a billing profile belonging to it. |
> | Microsoft.Billing/billingAccounts/billingProfiles/enrollmentAccounts/billingPermissions/read |  |
> | Microsoft.Billing/billingAccounts/billingProfiles/enrollmentAccounts/billingSubscriptions/read | List billing subscriptions by billing profile ID and enrollment account name. This operation is supported only for billing accounts of type Enterprise Agreement. |
> | Microsoft.Billing/billingAccounts/billingProfiles/invoices/download/action |  |
> | Microsoft.Billing/billingAccounts/billingProfiles/invoices/pricesheet/download/action |  |
> | Microsoft.Billing/billingAccounts/billingProfiles/invoices/validateRefundEligibility/write |  |
> | Microsoft.Billing/billingAccounts/billingProfiles/invoiceSections/read | Lists the invoice sections that a user has access to. The operation is supported only for billing accounts with agreement type Microsoft Customer Agreement. |
> | Microsoft.Billing/billingAccounts/billingProfiles/invoiceSections/write | Creates or updates an invoice section. The operation is supported only for billing accounts with agreement type Microsoft Customer Agreement. |
> | Microsoft.Billing/billingAccounts/billingProfiles/invoiceSections/billingPermissions/read |  |
> | Microsoft.Billing/billingAccounts/billingProfiles/invoiceSections/billingRoleDefinitions/read | Gets the definition for a role on an invoice section. The operation is supported only for billing accounts with agreement type Microsoft Customer Agreement. |
> | Microsoft.Billing/billingAccounts/billingProfiles/invoiceSections/billingSubscriptions/transfer/action |  |
> | Microsoft.Billing/billingAccounts/billingProfiles/invoiceSections/billingSubscriptions/move/action |  |
> | Microsoft.Billing/billingAccounts/billingProfiles/invoiceSections/billingSubscriptions/validateMoveEligibility/action |  |
> | Microsoft.Billing/billingAccounts/billingProfiles/invoiceSections/billingSubscriptions/write |  |
> | Microsoft.Billing/billingAccounts/billingProfiles/invoiceSections/billingSubscriptions/read | Lists the subscriptions that are billed to an invoice section. The operation is supported only for billing accounts with agreement type Microsoft Customer Agreement. |
> | Microsoft.Billing/billingAccounts/billingProfiles/invoiceSections/checkAccess/write |  |
> | Microsoft.Billing/billingAccounts/billingProfiles/invoiceSections/products/transfer/action |  |
> | Microsoft.Billing/billingAccounts/billingProfiles/invoiceSections/products/move/action |  |
> | Microsoft.Billing/billingAccounts/billingProfiles/invoiceSections/products/validateMoveEligibility/action |  |
> | Microsoft.Billing/billingAccounts/billingProfiles/invoiceSections/resolveBillingRoleAssignments/write |  |
> | Microsoft.Billing/billingAccounts/billingProfiles/invoiceSections/validateDeleteEligibility/write | Validates if the invoice section can be deleted. The operation is supported for billing accounts with agreement type Microsoft Customer Agreement. |
> | Microsoft.Billing/billingAccounts/billingProfiles/invoiceSections/validateDeleteInvoiceSectionEligibility/write |  |
> | Microsoft.Billing/billingAccounts/billingProfiles/notificationContacts/read | Lists the NotificationContacts for the given billing profile. The operation is supported only for billing profiles with agreement type Enterprise Agreement. |
> | Microsoft.Billing/billingAccounts/billingProfiles/policies/read | Lists the policies for a billing profile. This operation is supported only for billing accounts with agreement type Microsoft Customer Agreement. |
> | Microsoft.Billing/billingAccounts/billingProfiles/policies/write | Updates the policies for a billing profile. This operation is supported only for billing accounts with agreement type Microsoft Customer Agreement. |
> | Microsoft.Billing/billingAccounts/billingProfiles/pricesheet/download/action |  |
> | Microsoft.Billing/billingAccounts/billingProfiles/products/read |  |
> | Microsoft.Billing/billingAccounts/billingProfiles/resolveBillingRoleAssignments/write |  |
> | Microsoft.Billing/billingAccounts/billingProfiles/validateDeleteBillingProfileEligibility/write |  |
> | Microsoft.Billing/billingAccounts/billingRoleAssignments/write |  |
> | Microsoft.Billing/billingAccounts/billingRoleDefinitions/read | Gets the definition for a role on a billing account. The operation is supported for billing accounts with agreement type Microsoft Partner Agreement, Microsoft Customer Agreement or Enterprise Agreement. |
> | Microsoft.Billing/billingAccounts/billingSubscriptionAliases/read |  |
> | Microsoft.Billing/billingAccounts/billingSubscriptionAliases/write |  |
> | Microsoft.Billing/billingAccounts/billingSubscriptions/read | Lists the subscriptions for a billing account. The operation is supported for billing accounts with agreement type Microsoft Customer Agreement, Microsoft Partner Agreement or Enterprise Agreement. |
> | Microsoft.Billing/billingAccounts/billingSubscriptions/downloadDocuments/action | Download invoice using download link from list |
> | Microsoft.Billing/billingAccounts/billingSubscriptions/move/action |  |
> | Microsoft.Billing/billingAccounts/billingSubscriptions/validateMoveEligibility/action |  |
> | Microsoft.Billing/billingAccounts/billingSubscriptions/write | Updates the properties of a billing subscription. Cost center can only be updated for billing accounts with agreement type Microsoft Customer Agreement. |
> | Microsoft.Billing/billingAccounts/billingSubscriptions/cancel/write |  |
> | Microsoft.Billing/billingAccounts/billingSubscriptions/merge/write |  |
> | Microsoft.Billing/billingAccounts/billingSubscriptions/move/write | Moves a subscription's charges to a new invoice section. The new invoice section must belong to the same billing profile as the existing invoice section. This operation is supported for billing accounts with agreement type Microsoft Customer Agreement. |
> | Microsoft.Billing/billingAccounts/billingSubscriptions/split/write |  |
> | Microsoft.Billing/billingAccounts/billingSubscriptions/validateMoveEligibility/write | Validates if a subscription's charges can be moved to a new invoice section. This operation is supported for billing accounts with agreement type Microsoft Customer Agreement. |
> | Microsoft.Billing/billingAccounts/checkAccess/write |  |
> | Microsoft.Billing/billingAccounts/customers/read |  |
> | Microsoft.Billing/billingAccounts/customers/initiateTransfer/action |  |
> | Microsoft.Billing/billingAccounts/customers/billingPermissions/read |  |
> | Microsoft.Billing/billingAccounts/customers/billingRoleDefinitions/read | Gets the definition for a role on a customer. The operation is supported only for billing accounts with agreement type Microsoft Partner Agreement. |
> | Microsoft.Billing/billingAccounts/customers/billingSubscriptions/read | Lists the subscriptions for a customer. The operation is supported only for billing accounts with agreement type Microsoft Partner Agreement. |
> | Microsoft.Billing/billingAccounts/customers/checkAccess/write |  |
> | Microsoft.Billing/billingAccounts/customers/policies/read | Lists the policies for a customer. This operation is supported only for billing accounts with agreement type Microsoft Partner Agreement. |
> | Microsoft.Billing/billingAccounts/customers/policies/write | Updates the policies for a customer. This operation is supported only for billing accounts with agreement type Microsoft Partner Agreement. |
> | Microsoft.Billing/billingAccounts/customers/resolveBillingRoleAssignments/write |  |
> | Microsoft.Billing/billingAccounts/customers/transfers/write |  |
> | Microsoft.Billing/billingAccounts/customers/transfers/read |  |
> | Microsoft.Billing/billingAccounts/departments/read | Lists the departments that a user has access to. The operation is supported only for billing accounts with agreement type Enterprise Agreement. |
> | Microsoft.Billing/billingAccounts/departments/write |  |
> | Microsoft.Billing/billingAccounts/departments/addEnrollmentAccount/write |  |
> | Microsoft.Billing/billingAccounts/departments/billingPermissions/read |  |
> | Microsoft.Billing/billingAccounts/departments/billingRoleAssignments/write |  |
> | Microsoft.Billing/billingAccounts/departments/billingRoleDefinitions/read | Gets the definition for a role on a department. The operation is supported for billing accounts with agreement type Enterprise Agreement. |
> | Microsoft.Billing/billingAccounts/departments/billingSubscriptions/read | Lists the subscriptions for a department. The operation is supported for billing accounts with agreement type Enterprise Agreement. |
> | Microsoft.Billing/billingAccounts/departments/checkAccess/write |  |
> | Microsoft.Billing/billingAccounts/departments/enrollmentAccounts/read | Lists the enrollment accounts for a department. The operation is supported only for billing accounts with agreement type Enterprise Agreement. |
> | Microsoft.Billing/billingAccounts/departments/enrollmentAccounts/write |  |
> | Microsoft.Billing/billingAccounts/departments/enrollmentAccounts/remove/write |  |
> | Microsoft.Billing/billingAccounts/enrollmentAccounts/read | Lists the enrollment accounts for a billing account. The operation is supported only for billing accounts with agreement type Enterprise Agreement. |
> | Microsoft.Billing/billingAccounts/enrollmentAccounts/write |  |
> | Microsoft.Billing/billingAccounts/enrollmentAccounts/activate/write |  |
> | Microsoft.Billing/billingAccounts/enrollmentAccounts/activationStatus/read |  |
> | Microsoft.Billing/billingAccounts/enrollmentAccounts/billingPermissions/read |  |
> | Microsoft.Billing/billingAccounts/enrollmentAccounts/billingRoleAssignments/write |  |
> | Microsoft.Billing/billingAccounts/enrollmentAccounts/billingRoleDefinitions/read | Gets the definition for a role on a enrollment account. The operation is supported for billing accounts with agreement type Enterprise Agreement. |
> | Microsoft.Billing/billingAccounts/enrollmentAccounts/billingSubscriptions/write |  |
> | Microsoft.Billing/billingAccounts/enrollmentAccounts/billingSubscriptions/read | Lists the subscriptions for an enrollment account. The operation is supported for billing accounts with agreement type Enterprise Agreement. |
> | Microsoft.Billing/billingAccounts/enrollmentAccounts/checkAccess/write |  |
> | Microsoft.Billing/billingAccounts/enrollmentAccounts/transferBillingSubscriptions/write |  |
> | Microsoft.Billing/billingAccounts/invoices/download/action |  |
> | Microsoft.Billing/billingAccounts/invoices/pricesheet/download/action |  |
> | Microsoft.Billing/billingAccounts/invoiceSections/write |  |
> | Microsoft.Billing/billingAccounts/invoiceSections/elevate/action |  |
> | Microsoft.Billing/billingAccounts/invoiceSections/read |  |
> | Microsoft.Billing/billingAccounts/listBillingProfilesWithViewPricesheetPermissions/read |  |
> | Microsoft.Billing/billingAccounts/notificationContacts/read | Lists the NotificationContacts for the given billing account. The operation is supported only for billing accounts with agreement type Enterprise Agreement. |
> | Microsoft.Billing/billingAccounts/notificationContacts/write | Update a notification contact by ID. The operation is supported only for billing accounts with agreement type Enterprise Agreement. |
> | Microsoft.Billing/billingAccounts/operationResults/read |  |
> | Microsoft.Billing/billingAccounts/policies/read | Get the policies for a billing account of Enterprise Agreement type. |
> | Microsoft.Billing/billingAccounts/policies/write | Update the policies for a billing account of Enterprise Agreement type. |
> | Microsoft.Billing/billingAccounts/products/read |  |
> | Microsoft.Billing/billingAccounts/products/move/action |  |
> | Microsoft.Billing/billingAccounts/products/validateMoveEligibility/action |  |
> | Microsoft.Billing/billingAccounts/purchaseProduct/write |  |
> | Microsoft.Billing/billingAccounts/resolveBillingRoleAssignments/write |  |
> | Microsoft.Billing/billingPeriods/read |  |
> | Microsoft.Billing/billingProperty/read |  |
> | Microsoft.Billing/billingProperty/write |  |
> | Microsoft.Billing/departments/read |  |
> | Microsoft.Billing/enrollmentAccounts/read |  |
> | Microsoft.Billing/invoices/read |  |
> | Microsoft.Billing/invoices/download/action | Download invoice using download link from list |
> | Microsoft.Billing/operations/read | List of operations supported by provider. |
> | Microsoft.Billing/validateAddress/write |  |

### Microsoft.Blueprint

Azure service: [Azure Blueprints](../../../governance/blueprints/index.yml)

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

### Microsoft.Capacity

Azure service: core

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.Capacity/calculateprice/action | Calculate any Reservation Price |
> | Microsoft.Capacity/checkoffers/action | Check any Subscription Offers |
> | Microsoft.Capacity/checkscopes/action | Check any Subscription |
> | Microsoft.Capacity/validatereservationorder/action | Validate any Reservation |
> | Microsoft.Capacity/reservationorders/action | Update any Reservation |
> | Microsoft.Capacity/register/action | Registers the Capacity resource provider and enables the creation of Capacity resources. |
> | Microsoft.Capacity/unregister/action | Unregister any Tenant |
> | Microsoft.Capacity/calculateexchange/action | Computes the exchange amount and price of new purchase and returns policy Errors. |
> | Microsoft.Capacity/exchange/action | Exchange any Reservation |
> | Microsoft.Capacity/listSkus/action | Lists SKUs with filters and without any restrictions |
> | Microsoft.Capacity/appliedreservations/read | Read All Reservations |
> | Microsoft.Capacity/catalogs/read | Read catalog of Reservation |
> | Microsoft.Capacity/commercialreservationorders/read | Get Reservation Orders created in any Tenant |
> | Microsoft.Capacity/operations/read | Read any Operation |
> | Microsoft.Capacity/reservationorders/changedirectory/action | Change directory of any reservation |
> | Microsoft.Capacity/reservationorders/availablescopes/action | Find any Available Scope |
> | Microsoft.Capacity/reservationorders/read | Read All Reservations |
> | Microsoft.Capacity/reservationorders/write | Create any Reservation |
> | Microsoft.Capacity/reservationorders/delete | Delete any Reservation |
> | Microsoft.Capacity/reservationorders/reservations/action | Update any Reservation |
> | Microsoft.Capacity/reservationorders/return/action | Return any Reservation |
> | Microsoft.Capacity/reservationorders/swap/action | Swap any Reservation |
> | Microsoft.Capacity/reservationorders/split/action | Split any Reservation |
> | Microsoft.Capacity/reservationorders/changeBilling/action | Reservation billing change |
> | Microsoft.Capacity/reservationorders/merge/action | Merge any Reservation |
> | Microsoft.Capacity/reservationorders/calculaterefund/action | Computes the refund amount and price of new purchase and returns policy Errors. |
> | Microsoft.Capacity/reservationorders/changebillingoperationresults/read | Poll any Reservation billing change operation |
> | Microsoft.Capacity/reservationorders/mergeoperationresults/read | Poll any merge operation |
> | Microsoft.Capacity/reservationorders/reservations/availablescopes/action | Find any Available Scope |
> | Microsoft.Capacity/reservationorders/reservations/read | Read All Reservations |
> | Microsoft.Capacity/reservationorders/reservations/write | Create any Reservation |
> | Microsoft.Capacity/reservationorders/reservations/delete | Delete any Reservation |
> | Microsoft.Capacity/reservationorders/reservations/archive/action | Archive a reservation which is in a terminal state like Expired, Split etc. |
> | Microsoft.Capacity/reservationorders/reservations/unarchive/action | Unarchive a Reservation which was previously archived |
> | Microsoft.Capacity/reservationorders/reservations/revisions/read | Read All Reservations |
> | Microsoft.Capacity/reservationorders/splitoperationresults/read | Poll any split operation |
> | Microsoft.Capacity/resourceProviders/locations/serviceLimits/read | Get the current service limit or quota of the specified resource and location |
> | Microsoft.Capacity/resourceProviders/locations/serviceLimits/write | Create service limit or quota for the specified resource and location |
> | Microsoft.Capacity/resourceProviders/locations/serviceLimitsRequests/read | Get any service limit request for the specified resource and location |
> | Microsoft.Capacity/tenants/register/action | Register any Tenant |

### Microsoft.Commerce

Azure service: core

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.Commerce/register/action | Register Subscription for Microsoft Commerce UsageAggregate |
> | Microsoft.Commerce/unregister/action | Unregister Subscription for Microsoft Commerce UsageAggregate |
> | Microsoft.Commerce/RateCard/read | Returns offer data, resource/meter metadata and rates for the given subscription. |
> | Microsoft.Commerce/UsageAggregates/read | Retrieves Microsoft Azure's consumption  by a subscription. The result contains aggregates usage data, subscription and resource related information, on a particular time range. |

### Microsoft.Consumption

Azure service: [Cost Management](../../../cost-management-billing/index.yml)

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

### Microsoft.CostManagement

Azure service: [Cost Management](../../../cost-management-billing/index.yml)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.CostManagement/query/action | Query usage data by a scope. |
> | Microsoft.CostManagement/reports/action | Schedule reports on usage data by a scope. |
> | Microsoft.CostManagement/exports/action | Run the specified export. |
> | Microsoft.CostManagement/register/action | Register action for scope of Microsoft.CostManagement by a subscription. |
> | Microsoft.CostManagement/views/action | Create view. |
> | Microsoft.CostManagement/forecast/action | Forecast usage data by a scope. |
> | Microsoft.CostManagement/alerts/write | Update alerts. |
> | Microsoft.CostManagement/alerts/read | List alerts. |
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
> | Microsoft.CostManagement/tenants/register/action | Register action for scope of Microsoft.CostManagement by a tenant. |
> | Microsoft.CostManagement/views/read | List all saved views. |
> | Microsoft.CostManagement/views/delete | Delete saved views. |
> | Microsoft.CostManagement/views/write | Update view. |

### Microsoft.DataProtection

Azure service: Microsoft.DataProtection

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.DataProtection/backupVaults/write | Create BackupVault operation creates an Azure resource of type 'Backup Vault' |
> | Microsoft.DataProtection/backupVaults/write | Update BackupVault operation updates an Azure resource of type 'Backup Vault' |
> | Microsoft.DataProtection/backupVaults/read | The Get Backup Vault operation gets an object representing the Azure resource of type 'Backup Vault' |
> | Microsoft.DataProtection/backupVaults/read | Gets list of Backup Vaults in a Subscription |
> | Microsoft.DataProtection/backupVaults/read | Gets list of Backup Vaults in a Resource Group |
> | Microsoft.DataProtection/backupVaults/delete | The Delete Vault operation deletes the specified Azure resource of type 'Backup Vault' |
> | Microsoft.DataProtection/backupVaults/validateForBackup/action | Validates for backup of Backup Instance |
> | Microsoft.DataProtection/backupVaults/backupInstances/write | Creates a Backup Instance |
> | Microsoft.DataProtection/backupVaults/backupInstances/delete | Deletes the Backup Instance |
> | Microsoft.DataProtection/backupVaults/backupInstances/read | Returns details of the Backup Instance |
> | Microsoft.DataProtection/backupVaults/backupInstances/read | Returns all Backup Instances |
> | Microsoft.DataProtection/backupVaults/backupInstances/backup/action | Performs Backup on the Backup Instance |
> | Microsoft.DataProtection/backupVaults/backupInstances/sync/action | Sync operation retries last failed operation on backup instance to bring it to a valid state. |
> | Microsoft.DataProtection/backupVaults/backupInstances/stopProtection/action | Stop Protection operation stops both backup and retention schedules of backup instance. Existing data will be retained forever. |
> | Microsoft.DataProtection/backupVaults/backupInstances/suspendBackups/action | Suspend Backups operation stops only backups of backup instance. Retention activities will continue and hence data will be ratained as per policy. |
> | Microsoft.DataProtection/backupVaults/backupInstances/resumeProtection/action | Resume protection of a ProtectionStopped BI. |
> | Microsoft.DataProtection/backupVaults/backupInstances/resumeBackups/action | Resume Backups for a BackupsSuspended BI. |
> | Microsoft.DataProtection/backupVaults/backupInstances/validateRestore/action | Validates for Restore of the Backup Instance |
> | Microsoft.DataProtection/backupVaults/backupInstances/restore/action | Triggers restore on the Backup Instance |
> | Microsoft.DataProtection/backupVaults/backupInstances/findRestorableTimeRanges/action | Finds Restorable Time Ranges |
> | Microsoft.DataProtection/backupVaults/backupInstances/operationResults/read | Returns Backup Operation Result for Backup Vault. |
> | Microsoft.DataProtection/backupVaults/backupInstances/recoveryPoints/read | Returns details of the Recovery Point |
> | Microsoft.DataProtection/backupVaults/backupInstances/recoveryPoints/read | Returns all Recovery Points |
> | Microsoft.DataProtection/backupVaults/backupJobs/enableProgress/action | Get Job details |
> | Microsoft.DataProtection/backupVaults/backupPolicies/write | Creates Backup Policy |
> | Microsoft.DataProtection/backupVaults/backupPolicies/delete | Deletes the Backup Policy |
> | Microsoft.DataProtection/backupVaults/backupPolicies/read | Returns details of the Backup Policy |
> | Microsoft.DataProtection/backupVaults/backupPolicies/read | Returns all Backup Policies |
> | Microsoft.DataProtection/backupVaults/backupResourceGuardProxies/read | Get the list of ResourceGuard proxies for a resource |
> | Microsoft.DataProtection/backupVaults/backupResourceGuardProxies/read | Get ResourceGuard proxy operation gets an object representing the Azure resource of type 'ResourceGuard proxy' |
> | Microsoft.DataProtection/backupVaults/backupResourceGuardProxies/write | Create ResourceGuard proxy operation creates an Azure resource of type 'ResourceGuard Proxy' |
> | Microsoft.DataProtection/backupVaults/backupResourceGuardProxies/delete | The Delete ResourceGuard proxy operation deletes the specified Azure resource of type 'ResourceGuard proxy' |
> | Microsoft.DataProtection/backupVaults/backupResourceGuardProxies/unlockDelete/action | Unlock delete ResourceGuard proxy operation unlocks the next delete critical operation |
> | Microsoft.DataProtection/backupVaults/deletedBackupInstances/undelete/action | Perform undelete of soft-deleted Backup Instance. Backup Instance moves from SoftDeleted to ProtectionStopped state. |
> | Microsoft.DataProtection/backupVaults/deletedBackupInstances/read | Get soft-deleted Backup Instance in a Backup Vault by name |
> | Microsoft.DataProtection/backupVaults/deletedBackupInstances/read | List soft-deleted Backup Instances in a Backup Vault. |
> | Microsoft.DataProtection/backupVaults/operationResults/read | Gets Operation Result of a Patch Operation for a Backup Vault |
> | Microsoft.DataProtection/backupVaults/operationStatus/read | Returns Backup Operation Status for Backup Vault. |
> | Microsoft.DataProtection/locations/checkNameAvailability/action | Checks if the requested BackupVault Name is Available |
> | Microsoft.DataProtection/locations/getBackupStatus/action | Check Backup Status for Recovery Services Vaults |
> | Microsoft.DataProtection/locations/checkFeatureSupport/action | Validates if a feature is supported |
> | Microsoft.DataProtection/locations/operationResults/read | Returns Backup Operation Result for Backup Vault. |
> | Microsoft.DataProtection/locations/operationStatus/read | Returns Backup Operation Status for Backup Vault. |
> | Microsoft.DataProtection/operations/read | Operation returns the list of Operations for a Resource Provider |
> | Microsoft.DataProtection/subscriptions/providers/resourceGuards/read | Gets list of ResourceGuards in a Subscription |
> | Microsoft.DataProtection/subscriptions/resourceGroups/providers/locations/operationStatus/read | Returns Backup Operation Status for Backup Vault. |
> | Microsoft.DataProtection/subscriptions/resourceGroups/providers/resourceGuards/write | Create ResourceGuard operation creates an Azure resource of type 'ResourceGuard' |
> | Microsoft.DataProtection/subscriptions/resourceGroups/providers/resourceGuards/read | The Get ResourceGuard operation gets an object representing the Azure resource of type 'ResourceGuard' |
> | Microsoft.DataProtection/subscriptions/resourceGroups/providers/resourceGuards/delete | The Delete ResourceGuard operation deletes the specified Azure resource of type 'ResourceGuard' |
> | Microsoft.DataProtection/subscriptions/resourceGroups/providers/resourceGuards/read | Gets list of ResourceGuards in a Resource Group |
> | Microsoft.DataProtection/subscriptions/resourceGroups/providers/resourceGuards/write | Update ResouceGuard operation updates an Azure resource of type 'ResourceGuard' |
> | Microsoft.DataProtection/subscriptions/resourceGroups/providers/resourceGuards/{operationName}/read | Gets ResourceGuard operation request info |
> | Microsoft.DataProtection/subscriptions/resourceGroups/providers/resourceGuards/{operationName}/read | Gets ResourceGuard default operation request info |

### Microsoft.Features

Azure service: [Azure Resource Manager](../../../azure-resource-manager/index.yml)

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

### Microsoft.GuestConfiguration

Azure service: [Azure Policy](../../../governance/policy/index.yml)

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

### Microsoft.HybridCompute

Azure service: [Azure Arc](../../../azure-arc/index.yml)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.HybridCompute/register/action | Registers the subscription for the Microsoft.HybridCompute Resource Provider |
> | Microsoft.HybridCompute/unregister/action | Unregisters the subscription for Microsoft.HybridCompute Resource Provider |
> | Microsoft.HybridCompute/batch/action | Batch deletes Azure Arc machines |
> | Microsoft.HybridCompute/locations/operationresults/read | Reads the status of an operation on Microsoft.HybridCompute Resource Provider |
> | Microsoft.HybridCompute/locations/operationstatus/read | Reads the status of an operation on Microsoft.HybridCompute Resource Provider |
> | Microsoft.HybridCompute/locations/privateLinkScopes/read | Reads the full details of any Azure Arc privateLinkScopes |
> | Microsoft.HybridCompute/locations/updateCenterOperationResults/read | Reads the status of an update center operation on machines |
> | Microsoft.HybridCompute/machines/read | Read any Azure Arc machines |
> | Microsoft.HybridCompute/machines/write | Writes an Azure Arc machines |
> | Microsoft.HybridCompute/machines/delete | Deletes an Azure Arc machines |
> | Microsoft.HybridCompute/machines/UpgradeExtensions/action | Upgrades Extensions on Azure Arc machines |
> | Microsoft.HybridCompute/machines/assessPatches/action | Assesses any Azure Arc machines to get missing software patches |
> | Microsoft.HybridCompute/machines/installPatches/action | Installs patches on any Azure Arc machines |
> | Microsoft.HybridCompute/machines/extensions/read | Reads any Azure Arc extensions |
> | Microsoft.HybridCompute/machines/extensions/write | Installs or Updates an Azure Arc extensions |
> | Microsoft.HybridCompute/machines/extensions/delete | Deletes an Azure Arc extensions |
> | Microsoft.HybridCompute/machines/patchAssessmentResults/read | Reads any Azure Arc patchAssessmentResults |
> | Microsoft.HybridCompute/machines/patchAssessmentResults/softwarePatches/read | Reads any Azure Arc patchAssessmentResults/softwarePatches |
> | Microsoft.HybridCompute/machines/patchInstallationResults/read | Reads any Azure Arc patchInstallationResults |
> | Microsoft.HybridCompute/machines/patchInstallationResults/softwarePatches/read | Reads any Azure Arc patchInstallationResults/softwarePatches |
> | Microsoft.HybridCompute/operations/read | Read all Operations for Azure Arc for Servers |
> | Microsoft.HybridCompute/privateLinkScopes/read | Read any Azure Arc privateLinkScopes |
> | Microsoft.HybridCompute/privateLinkScopes/write | Writes an Azure Arc privateLinkScopes |
> | Microsoft.HybridCompute/privateLinkScopes/delete | Deletes an Azure Arc privateLinkScopes |
> | Microsoft.HybridCompute/privateLinkScopes/privateEndpointConnectionProxies/read | Read any Azure Arc privateEndpointConnectionProxies |
> | Microsoft.HybridCompute/privateLinkScopes/privateEndpointConnectionProxies/write | Writes an Azure Arc privateEndpointConnectionProxies |
> | Microsoft.HybridCompute/privateLinkScopes/privateEndpointConnectionProxies/delete | Deletes an Azure Arc privateEndpointConnectionProxies |
> | Microsoft.HybridCompute/privateLinkScopes/privateEndpointConnectionProxies/validate/action | Validates an Azure Arc privateEndpointConnectionProxies |
> | Microsoft.HybridCompute/privateLinkScopes/privateEndpointConnectionProxies/updatePrivateEndpointProperties/action | Updates an Azure Arc privateEndpointConnectionProxies with updated Private Endpoint details |
> | Microsoft.HybridCompute/privateLinkScopes/privateEndpointConnections/read | Read any Azure Arc privateEndpointConnections |
> | Microsoft.HybridCompute/privateLinkScopes/privateEndpointConnections/write | Writes an Azure Arc privateEndpointConnections |
> | Microsoft.HybridCompute/privateLinkScopes/privateEndpointConnections/delete | Deletes an Azure Arc privateEndpointConnections |
> | **DataAction** | **Description** |
> | Microsoft.HybridCompute/locations/publishers/extensionTypes/versions/read | Returns a list of versions for extensionMetadata based on query parameters. |
> | Microsoft.HybridCompute/machines/login/action | Log in to a Azure Arc machine as a regular user |
> | Microsoft.HybridCompute/machines/loginAsAdmin/action | Log in to a Azure Arc machine with Windows administrator or Linux root user privilege |
> | Microsoft.HybridCompute/machines/WACloginAsAdmin/action | Lets you manage the OS of your resource via Windows Admin Center as an administrator. |

### Microsoft.Kubernetes

Azure service: [Azure Arc-enabled Kubernetes](../../../azure-arc/kubernetes/overview.md)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.Kubernetes/register/action | Registers Subscription with Microsoft.Kubernetes resource provider |
> | Microsoft.Kubernetes/unregister/action | Un-Registers Subscription with Microsoft.Kubernetes resource provider |
> | Microsoft.Kubernetes/connectedClusters/Read | Read connectedClusters |
> | Microsoft.Kubernetes/connectedClusters/Write | Writes connectedClusters |
> | Microsoft.Kubernetes/connectedClusters/Delete | Deletes connectedClusters |
> | Microsoft.Kubernetes/connectedClusters/listClusterUserCredentials/action | List clusterUser credential(preview) |
> | Microsoft.Kubernetes/connectedClusters/listClusterUserCredential/action | List clusterUser credential |
> | Microsoft.Kubernetes/locations/operationstatuses/read | Read Operation Statuses |
> | Microsoft.Kubernetes/locations/operationstatuses/write | Write Operation Statuses |
> | Microsoft.Kubernetes/operations/read | Lists operations available on Microsoft.Kubernetes resource provider |
> | Microsoft.Kubernetes/RegisteredSubscriptions/read | Reads registered subscriptions |
> | **DataAction** | **Description** |
> | Microsoft.Kubernetes/connectedClusters/admissionregistration.k8s.io/initializerconfigurations/read | Reads initializerconfigurations |
> | Microsoft.Kubernetes/connectedClusters/admissionregistration.k8s.io/initializerconfigurations/write | Writes initializerconfigurations |
> | Microsoft.Kubernetes/connectedClusters/admissionregistration.k8s.io/initializerconfigurations/delete | Deletes initializerconfigurations |
> | Microsoft.Kubernetes/connectedClusters/admissionregistration.k8s.io/mutatingwebhookconfigurations/read | Reads mutatingwebhookconfigurations |
> | Microsoft.Kubernetes/connectedClusters/admissionregistration.k8s.io/mutatingwebhookconfigurations/write | Writes mutatingwebhookconfigurations |
> | Microsoft.Kubernetes/connectedClusters/admissionregistration.k8s.io/mutatingwebhookconfigurations/delete | Deletes mutatingwebhookconfigurations |
> | Microsoft.Kubernetes/connectedClusters/admissionregistration.k8s.io/validatingwebhookconfigurations/read | Reads validatingwebhookconfigurations |
> | Microsoft.Kubernetes/connectedClusters/admissionregistration.k8s.io/validatingwebhookconfigurations/write | Writes validatingwebhookconfigurations |
> | Microsoft.Kubernetes/connectedClusters/admissionregistration.k8s.io/validatingwebhookconfigurations/delete | Deletes validatingwebhookconfigurations |
> | Microsoft.Kubernetes/connectedClusters/api/read | Reads api |
> | Microsoft.Kubernetes/connectedClusters/api/v1/read | Reads api/v1 |
> | Microsoft.Kubernetes/connectedClusters/apiextensions.k8s.io/customresourcedefinitions/read | Reads customresourcedefinitions |
> | Microsoft.Kubernetes/connectedClusters/apiextensions.k8s.io/customresourcedefinitions/write | Writes customresourcedefinitions |
> | Microsoft.Kubernetes/connectedClusters/apiextensions.k8s.io/customresourcedefinitions/delete | Deletes customresourcedefinitions |
> | Microsoft.Kubernetes/connectedClusters/apiregistration.k8s.io/apiservices/read | Reads apiservices |
> | Microsoft.Kubernetes/connectedClusters/apiregistration.k8s.io/apiservices/write | Writes apiservices |
> | Microsoft.Kubernetes/connectedClusters/apiregistration.k8s.io/apiservices/delete | Deletes apiservices |
> | Microsoft.Kubernetes/connectedClusters/apis/read | Reads apis |
> | Microsoft.Kubernetes/connectedClusters/apis/admissionregistration.k8s.io/read | Reads admissionregistration.k8s.io |
> | Microsoft.Kubernetes/connectedClusters/apis/admissionregistration.k8s.io/v1/read | Reads admissionregistration.k8s.io/v1 |
> | Microsoft.Kubernetes/connectedClusters/apis/admissionregistration.k8s.io/v1beta1/read | Reads admissionregistration.k8s.io/v1beta1 |
> | Microsoft.Kubernetes/connectedClusters/apis/apiextensions.k8s.io/read | Reads apiextensions.k8s.io |
> | Microsoft.Kubernetes/connectedClusters/apis/apiextensions.k8s.io/v1/read | Reads apiextensions.k8s.io/v1 |
> | Microsoft.Kubernetes/connectedClusters/apis/apiextensions.k8s.io/v1beta1/read | Reads apiextensions.k8s.io/v1beta1 |
> | Microsoft.Kubernetes/connectedClusters/apis/apiregistration.k8s.io/read | Reads apiregistration.k8s.io |
> | Microsoft.Kubernetes/connectedClusters/apis/apiregistration.k8s.io/v1/read | Reads apiregistration.k8s.io/v1 |
> | Microsoft.Kubernetes/connectedClusters/apis/apiregistration.k8s.io/v1beta1/read | Reads apiregistration.k8s.io/v1beta1 |
> | Microsoft.Kubernetes/connectedClusters/apis/apps/read | Reads apps |
> | Microsoft.Kubernetes/connectedClusters/apis/apps/v1beta1/read | Reads apps/v1beta1 |
> | Microsoft.Kubernetes/connectedClusters/apis/apps/v1beta2/read | Reads v1beta2 |
> | Microsoft.Kubernetes/connectedClusters/apis/authentication.k8s.io/read | Reads authentication.k8s.io |
> | Microsoft.Kubernetes/connectedClusters/apis/authentication.k8s.io/v1/read | Reads authentication.k8s.io/v1 |
> | Microsoft.Kubernetes/connectedClusters/apis/authentication.k8s.io/v1beta1/read | Reads authentication.k8s.io/v1beta1 |
> | Microsoft.Kubernetes/connectedClusters/apis/authorization.k8s.io/read | Reads authorization.k8s.io |
> | Microsoft.Kubernetes/connectedClusters/apis/authorization.k8s.io/v1/read | Reads authorization.k8s.io/v1 |
> | Microsoft.Kubernetes/connectedClusters/apis/authorization.k8s.io/v1beta1/read | Reads authorization.k8s.io/v1beta1 |
> | Microsoft.Kubernetes/connectedClusters/apis/autoscaling/read | Reads autoscaling |
> | Microsoft.Kubernetes/connectedClusters/apis/autoscaling/v1/read | Reads autoscaling/v1 |
> | Microsoft.Kubernetes/connectedClusters/apis/autoscaling/v2beta1/read | Reads autoscaling/v2beta1 |
> | Microsoft.Kubernetes/connectedClusters/apis/autoscaling/v2beta2/read | Reads autoscaling/v2beta2 |
> | Microsoft.Kubernetes/connectedClusters/apis/batch/read | Reads batch |
> | Microsoft.Kubernetes/connectedClusters/apis/batch/v1/read | Reads batch/v1 |
> | Microsoft.Kubernetes/connectedClusters/apis/batch/v1beta1/read | Reads batch/v1beta1 |
> | Microsoft.Kubernetes/connectedClusters/apis/certificates.k8s.io/read | Reads certificates.k8s.io |
> | Microsoft.Kubernetes/connectedClusters/apis/certificates.k8s.io/v1beta1/read | Reads certificates.k8s.io/v1beta1 |
> | Microsoft.Kubernetes/connectedClusters/apis/coordination.k8s.io/read | Reads coordination.k8s.io |
> | Microsoft.Kubernetes/connectedClusters/apis/coordination.k8s.io/v1/read | Reads coordination/v1 |
> | Microsoft.Kubernetes/connectedClusters/apis/coordination.k8s.io/v1beta1/read | Reads coordination.k8s.io/v1beta1 |
> | Microsoft.Kubernetes/connectedClusters/apis/events.k8s.io/read | Reads events.k8s.io |
> | Microsoft.Kubernetes/connectedClusters/apis/events.k8s.io/v1beta1/read | Reads events.k8s.io/v1beta1 |
> | Microsoft.Kubernetes/connectedClusters/apis/extensions/read | Reads extensions |
> | Microsoft.Kubernetes/connectedClusters/apis/extensions/v1beta1/read | Reads extensions/v1beta1 |
> | Microsoft.Kubernetes/connectedClusters/apis/metrics.k8s.io/read | Reads metrics.k8s.io |
> | Microsoft.Kubernetes/connectedClusters/apis/metrics.k8s.io/v1beta1/read | Reads metrics.k8s.io/v1beta1 |
> | Microsoft.Kubernetes/connectedClusters/apis/networking.k8s.io/read | Reads networking.k8s.io |
> | Microsoft.Kubernetes/connectedClusters/apis/networking.k8s.io/v1/read | Reads networking/v1 |
> | Microsoft.Kubernetes/connectedClusters/apis/networking.k8s.io/v1beta1/read | Reads networking.k8s.io/v1beta1 |
> | Microsoft.Kubernetes/connectedClusters/apis/node.k8s.io/read | Reads node.k8s.io |
> | Microsoft.Kubernetes/connectedClusters/apis/node.k8s.io/v1beta1/read | Reads node.k8s.io/v1beta1 |
> | Microsoft.Kubernetes/connectedClusters/apis/policy/read | Reads policy |
> | Microsoft.Kubernetes/connectedClusters/apis/policy/v1beta1/read | Reads policy/v1beta1 |
> | Microsoft.Kubernetes/connectedClusters/apis/rbac.authorization.k8s.io/read | Reads rbac.authorization.k8s.io |
> | Microsoft.Kubernetes/connectedClusters/apis/rbac.authorization.k8s.io/v1/read | Reads rbac.authorization/v1 |
> | Microsoft.Kubernetes/connectedClusters/apis/rbac.authorization.k8s.io/v1beta1/read | Reads rbac.authorization.k8s.io/v1beta1 |
> | Microsoft.Kubernetes/connectedClusters/apis/scheduling.k8s.io/read | Reads scheduling.k8s.io |
> | Microsoft.Kubernetes/connectedClusters/apis/scheduling.k8s.io/v1/read | Reads scheduling/v1 |
> | Microsoft.Kubernetes/connectedClusters/apis/scheduling.k8s.io/v1beta1/read | Reads scheduling.k8s.io/v1beta1 |
> | Microsoft.Kubernetes/connectedClusters/apis/storage.k8s.io/read | Reads storage.k8s.io |
> | Microsoft.Kubernetes/connectedClusters/apis/storage.k8s.io/v1/read | Reads storage/v1 |
> | Microsoft.Kubernetes/connectedClusters/apis/storage.k8s.io/v1beta1/read | Reads storage.k8s.io/v1beta1 |
> | Microsoft.Kubernetes/connectedClusters/apps/controllerrevisions/read | Reads controllerrevisions |
> | Microsoft.Kubernetes/connectedClusters/apps/controllerrevisions/write | Writes controllerrevisions |
> | Microsoft.Kubernetes/connectedClusters/apps/controllerrevisions/delete | Deletes controllerrevisions |
> | Microsoft.Kubernetes/connectedClusters/apps/daemonsets/read | Reads daemonsets |
> | Microsoft.Kubernetes/connectedClusters/apps/daemonsets/write | Writes daemonsets |
> | Microsoft.Kubernetes/connectedClusters/apps/daemonsets/delete | Deletes daemonsets |
> | Microsoft.Kubernetes/connectedClusters/apps/deployments/read | Reads deployments |
> | Microsoft.Kubernetes/connectedClusters/apps/deployments/write | Writes deployments |
> | Microsoft.Kubernetes/connectedClusters/apps/deployments/delete | Deletes deployments |
> | Microsoft.Kubernetes/connectedClusters/apps/replicasets/read | Reads replicasets |
> | Microsoft.Kubernetes/connectedClusters/apps/replicasets/write | Writes replicasets |
> | Microsoft.Kubernetes/connectedClusters/apps/replicasets/delete | Deletes replicasets |
> | Microsoft.Kubernetes/connectedClusters/apps/statefulsets/read | Reads statefulsets |
> | Microsoft.Kubernetes/connectedClusters/apps/statefulsets/write | Writes statefulsets |
> | Microsoft.Kubernetes/connectedClusters/apps/statefulsets/delete | Deletes statefulsets |
> | Microsoft.Kubernetes/connectedClusters/authentication.k8s.io/tokenreviews/write | Writes tokenreviews |
> | Microsoft.Kubernetes/connectedClusters/authentication.k8s.io/userextras/impersonate/action | Impersonate userextras |
> | Microsoft.Kubernetes/connectedClusters/authorization.k8s.io/localsubjectaccessreviews/write | Writes localsubjectaccessreviews |
> | Microsoft.Kubernetes/connectedClusters/authorization.k8s.io/selfsubjectaccessreviews/write | Writes selfsubjectaccessreviews |
> | Microsoft.Kubernetes/connectedClusters/authorization.k8s.io/selfsubjectrulesreviews/write | Writes selfsubjectrulesreviews |
> | Microsoft.Kubernetes/connectedClusters/authorization.k8s.io/subjectaccessreviews/write | Writes subjectaccessreviews |
> | Microsoft.Kubernetes/connectedClusters/autoscaling/horizontalpodautoscalers/read | Reads horizontalpodautoscalers |
> | Microsoft.Kubernetes/connectedClusters/autoscaling/horizontalpodautoscalers/write | Writes horizontalpodautoscalers |
> | Microsoft.Kubernetes/connectedClusters/autoscaling/horizontalpodautoscalers/delete | Deletes horizontalpodautoscalers |
> | Microsoft.Kubernetes/connectedClusters/batch/cronjobs/read | Reads cronjobs |
> | Microsoft.Kubernetes/connectedClusters/batch/cronjobs/write | Writes cronjobs |
> | Microsoft.Kubernetes/connectedClusters/batch/cronjobs/delete | Deletes cronjobs |
> | Microsoft.Kubernetes/connectedClusters/batch/jobs/read | Reads jobs |
> | Microsoft.Kubernetes/connectedClusters/batch/jobs/write | Writes jobs |
> | Microsoft.Kubernetes/connectedClusters/batch/jobs/delete | Deletes jobs |
> | Microsoft.Kubernetes/connectedClusters/bindings/write | Writes bindings |
> | Microsoft.Kubernetes/connectedClusters/certificates.k8s.io/certificatesigningrequests/read | Reads certificatesigningrequests |
> | Microsoft.Kubernetes/connectedClusters/certificates.k8s.io/certificatesigningrequests/write | Writes certificatesigningrequests |
> | Microsoft.Kubernetes/connectedClusters/certificates.k8s.io/certificatesigningrequests/delete | Deletes certificatesigningrequests |
> | Microsoft.Kubernetes/connectedClusters/componentstatuses/read | Reads componentstatuses |
> | Microsoft.Kubernetes/connectedClusters/componentstatuses/write | Writes componentstatuses |
> | Microsoft.Kubernetes/connectedClusters/componentstatuses/delete | Deletes componentstatuses |
> | Microsoft.Kubernetes/connectedClusters/configmaps/read | Reads configmaps |
> | Microsoft.Kubernetes/connectedClusters/configmaps/write | Writes configmaps |
> | Microsoft.Kubernetes/connectedClusters/configmaps/delete | Deletes configmaps |
> | Microsoft.Kubernetes/connectedClusters/coordination.k8s.io/leases/read | Reads leases |
> | Microsoft.Kubernetes/connectedClusters/coordination.k8s.io/leases/write | Writes leases |
> | Microsoft.Kubernetes/connectedClusters/coordination.k8s.io/leases/delete | Deletes leases |
> | Microsoft.Kubernetes/connectedClusters/discovery.k8s.io/endpointslices/read | Reads endpointslices |
> | Microsoft.Kubernetes/connectedClusters/discovery.k8s.io/endpointslices/write | Writes endpointslices |
> | Microsoft.Kubernetes/connectedClusters/discovery.k8s.io/endpointslices/delete | Deletes endpointslices |
> | Microsoft.Kubernetes/connectedClusters/endpoints/read | Reads endpoints |
> | Microsoft.Kubernetes/connectedClusters/endpoints/write | Writes endpoints |
> | Microsoft.Kubernetes/connectedClusters/endpoints/delete | Deletes endpoints |
> | Microsoft.Kubernetes/connectedClusters/events/read | Reads events |
> | Microsoft.Kubernetes/connectedClusters/events/write | Writes events |
> | Microsoft.Kubernetes/connectedClusters/events/delete | Deletes events |
> | Microsoft.Kubernetes/connectedClusters/events.k8s.io/events/read | Reads events |
> | Microsoft.Kubernetes/connectedClusters/events.k8s.io/events/write | Writes events |
> | Microsoft.Kubernetes/connectedClusters/events.k8s.io/events/delete | Deletes events |
> | Microsoft.Kubernetes/connectedClusters/extensions/daemonsets/read | Reads daemonsets |
> | Microsoft.Kubernetes/connectedClusters/extensions/daemonsets/write | Writes daemonsets |
> | Microsoft.Kubernetes/connectedClusters/extensions/daemonsets/delete | Deletes daemonsets |
> | Microsoft.Kubernetes/connectedClusters/extensions/deployments/read | Reads deployments |
> | Microsoft.Kubernetes/connectedClusters/extensions/deployments/write | Writes deployments |
> | Microsoft.Kubernetes/connectedClusters/extensions/deployments/delete | Deletes deployments |
> | Microsoft.Kubernetes/connectedClusters/extensions/ingresses/read | Reads ingresses |
> | Microsoft.Kubernetes/connectedClusters/extensions/ingresses/write | Writes ingresses |
> | Microsoft.Kubernetes/connectedClusters/extensions/ingresses/delete | Deletes ingresses |
> | Microsoft.Kubernetes/connectedClusters/extensions/networkpolicies/read | Reads networkpolicies |
> | Microsoft.Kubernetes/connectedClusters/extensions/networkpolicies/write | Writes networkpolicies |
> | Microsoft.Kubernetes/connectedClusters/extensions/networkpolicies/delete | Deletes networkpolicies |
> | Microsoft.Kubernetes/connectedClusters/extensions/podsecuritypolicies/read | Reads podsecuritypolicies |
> | Microsoft.Kubernetes/connectedClusters/extensions/podsecuritypolicies/write | Writes podsecuritypolicies |
> | Microsoft.Kubernetes/connectedClusters/extensions/podsecuritypolicies/delete | Deletes podsecuritypolicies |
> | Microsoft.Kubernetes/connectedClusters/extensions/replicasets/read | Reads replicasets |
> | Microsoft.Kubernetes/connectedClusters/extensions/replicasets/write | Writes replicasets |
> | Microsoft.Kubernetes/connectedClusters/extensions/replicasets/delete | Deletes replicasets |
> | Microsoft.Kubernetes/connectedClusters/flowcontrol.apiserver.k8s.io/flowschemas/read | Reads flowschemas |
> | Microsoft.Kubernetes/connectedClusters/flowcontrol.apiserver.k8s.io/flowschemas/write | Writes flowschemas |
> | Microsoft.Kubernetes/connectedClusters/flowcontrol.apiserver.k8s.io/flowschemas/delete | Deletes flowschemas |
> | Microsoft.Kubernetes/connectedClusters/flowcontrol.apiserver.k8s.io/prioritylevelconfigurations/read | Reads prioritylevelconfigurations |
> | Microsoft.Kubernetes/connectedClusters/flowcontrol.apiserver.k8s.io/prioritylevelconfigurations/write | Writes prioritylevelconfigurations |
> | Microsoft.Kubernetes/connectedClusters/flowcontrol.apiserver.k8s.io/prioritylevelconfigurations/delete | Deletes prioritylevelconfigurations |
> | Microsoft.Kubernetes/connectedClusters/groups/impersonate/action | Impersonate groups |
> | Microsoft.Kubernetes/connectedClusters/healthz/read | Reads healthz |
> | Microsoft.Kubernetes/connectedClusters/healthz/autoregister-completion/read | Reads autoregister-completion |
> | Microsoft.Kubernetes/connectedClusters/healthz/etcd/read | Reads etcd |
> | Microsoft.Kubernetes/connectedClusters/healthz/log/read | Reads log |
> | Microsoft.Kubernetes/connectedClusters/healthz/ping/read | Reads ping |
> | Microsoft.Kubernetes/connectedClusters/healthz/poststarthook/apiservice-openapi-controller/read | Reads apiservice-openapi-controller |
> | Microsoft.Kubernetes/connectedClusters/healthz/poststarthook/apiservice-registration-controller/read | Reads apiservice-registration-controller |
> | Microsoft.Kubernetes/connectedClusters/healthz/poststarthook/apiservice-status-available-controller/read | Reads apiservice-status-available-controller |
> | Microsoft.Kubernetes/connectedClusters/healthz/poststarthook/bootstrap-controller/read | Reads bootstrap-controller |
> | Microsoft.Kubernetes/connectedClusters/healthz/poststarthook/ca-registration/read | Reads ca-registration |
> | Microsoft.Kubernetes/connectedClusters/healthz/poststarthook/crd-informer-synced/read | Reads crd-informer-synced |
> | Microsoft.Kubernetes/connectedClusters/healthz/poststarthook/generic-apiserver-start-informers/read | Reads generic-apiserver-start-informers |
> | Microsoft.Kubernetes/connectedClusters/healthz/poststarthook/kube-apiserver-autoregistration/read | Reads kube-apiserver-autoregistration |
> | Microsoft.Kubernetes/connectedClusters/healthz/poststarthook/rbac/bootstrap-roles/read | Reads bootstrap-roles |
> | Microsoft.Kubernetes/connectedClusters/healthz/poststarthook/scheduling/bootstrap-system-priority-classes/read | Reads bootstrap-system-priority-classes |
> | Microsoft.Kubernetes/connectedClusters/healthz/poststarthook/start-apiextensions-controllers/read | Reads start-apiextensions-controllers |
> | Microsoft.Kubernetes/connectedClusters/healthz/poststarthook/start-apiextensions-informers/read | Reads start-apiextensions-informers |
> | Microsoft.Kubernetes/connectedClusters/healthz/poststarthook/start-kube-aggregator-informers/read | Reads start-kube-aggregator-informers |
> | Microsoft.Kubernetes/connectedClusters/healthz/poststarthook/start-kube-apiserver-admission-initializer/read | Reads start-kube-apiserver-admission-initializer |
> | Microsoft.Kubernetes/connectedClusters/limitranges/read | Reads limitranges |
> | Microsoft.Kubernetes/connectedClusters/limitranges/write | Writes limitranges |
> | Microsoft.Kubernetes/connectedClusters/limitranges/delete | Deletes limitranges |
> | Microsoft.Kubernetes/connectedClusters/livez/read | Reads livez |
> | Microsoft.Kubernetes/connectedClusters/livez/autoregister-completion/read | Reads autoregister-completion |
> | Microsoft.Kubernetes/connectedClusters/livez/etcd/read | Reads etcd |
> | Microsoft.Kubernetes/connectedClusters/livez/log/read | Reads log |
> | Microsoft.Kubernetes/connectedClusters/livez/ping/read | Reads ping |
> | Microsoft.Kubernetes/connectedClusters/livez/poststarthook/apiservice-openapi-controller/read | Reads apiservice-openapi-controller |
> | Microsoft.Kubernetes/connectedClusters/livez/poststarthook/apiservice-registration-controller/read | Reads apiservice-registration-controller |
> | Microsoft.Kubernetes/connectedClusters/livez/poststarthook/apiservice-status-available-controller/read | Reads apiservice-status-available-controller |
> | Microsoft.Kubernetes/connectedClusters/livez/poststarthook/bootstrap-controller/read | Reads bootstrap-controller |
> | Microsoft.Kubernetes/connectedClusters/livez/poststarthook/ca-registration/read | Reads ca-registration |
> | Microsoft.Kubernetes/connectedClusters/livez/poststarthook/crd-informer-synced/read | Reads crd-informer-synced |
> | Microsoft.Kubernetes/connectedClusters/livez/poststarthook/generic-apiserver-start-informers/read | Reads generic-apiserver-start-informers |
> | Microsoft.Kubernetes/connectedClusters/livez/poststarthook/kube-apiserver-autoregistration/read | Reads kube-apiserver-autoregistration |
> | Microsoft.Kubernetes/connectedClusters/livez/poststarthook/rbac/bootstrap-roles/read | Reads bootstrap-roles |
> | Microsoft.Kubernetes/connectedClusters/livez/poststarthook/scheduling/bootstrap-system-priority-classes/read | Reads bootstrap-system-priority-classes |
> | Microsoft.Kubernetes/connectedClusters/livez/poststarthook/start-apiextensions-controllers/read | Reads start-apiextensions-controllers |
> | Microsoft.Kubernetes/connectedClusters/livez/poststarthook/start-apiextensions-informers/read | Reads start-apiextensions-informers |
> | Microsoft.Kubernetes/connectedClusters/livez/poststarthook/start-kube-aggregator-informers/read | Reads start-kube-aggregator-informers |
> | Microsoft.Kubernetes/connectedClusters/livez/poststarthook/start-kube-apiserver-admission-initializer/read | Reads start-kube-apiserver-admission-initializer |
> | Microsoft.Kubernetes/connectedClusters/logs/read | Reads logs |
> | Microsoft.Kubernetes/connectedClusters/metrics/read | Reads metrics |
> | Microsoft.Kubernetes/connectedClusters/metrics.k8s.io/nodes/read | Reads nodes |
> | Microsoft.Kubernetes/connectedClusters/metrics.k8s.io/pods/read | Reads pods |
> | Microsoft.Kubernetes/connectedClusters/namespaces/read | Reads namespaces |
> | Microsoft.Kubernetes/connectedClusters/namespaces/write | Writes namespaces |
> | Microsoft.Kubernetes/connectedClusters/namespaces/delete | Deletes namespaces |
> | Microsoft.Kubernetes/connectedClusters/networking.k8s.io/ingressclasses/read | Reads ingressclasses |
> | Microsoft.Kubernetes/connectedClusters/networking.k8s.io/ingressclasses/write | Writes ingressclasses |
> | Microsoft.Kubernetes/connectedClusters/networking.k8s.io/ingressclasses/delete | Deletes ingressclasses |
> | Microsoft.Kubernetes/connectedClusters/networking.k8s.io/ingresses/read | Reads ingresses |
> | Microsoft.Kubernetes/connectedClusters/networking.k8s.io/ingresses/write | Writes ingresses |
> | Microsoft.Kubernetes/connectedClusters/networking.k8s.io/ingresses/delete | Deletes ingresses |
> | Microsoft.Kubernetes/connectedClusters/networking.k8s.io/networkpolicies/read | Reads networkpolicies |
> | Microsoft.Kubernetes/connectedClusters/networking.k8s.io/networkpolicies/write | Writes networkpolicies |
> | Microsoft.Kubernetes/connectedClusters/networking.k8s.io/networkpolicies/delete | Deletes networkpolicies |
> | Microsoft.Kubernetes/connectedClusters/node.k8s.io/runtimeclasses/read | Reads runtimeclasses |
> | Microsoft.Kubernetes/connectedClusters/node.k8s.io/runtimeclasses/write | Writes runtimeclasses |
> | Microsoft.Kubernetes/connectedClusters/node.k8s.io/runtimeclasses/delete | Deletes runtimeclasses |
> | Microsoft.Kubernetes/connectedClusters/nodes/read | Reads nodes |
> | Microsoft.Kubernetes/connectedClusters/nodes/write | Writes nodes |
> | Microsoft.Kubernetes/connectedClusters/nodes/delete | Deletes nodes |
> | Microsoft.Kubernetes/connectedClusters/openapi/v2/read | Reads v2 |
> | Microsoft.Kubernetes/connectedClusters/persistentvolumeclaims/read | Reads persistentvolumeclaims |
> | Microsoft.Kubernetes/connectedClusters/persistentvolumeclaims/write | Writes persistentvolumeclaims |
> | Microsoft.Kubernetes/connectedClusters/persistentvolumeclaims/delete | Deletes persistentvolumeclaims |
> | Microsoft.Kubernetes/connectedClusters/persistentvolumes/read | Reads persistentvolumes |
> | Microsoft.Kubernetes/connectedClusters/persistentvolumes/write | Writes persistentvolumes |
> | Microsoft.Kubernetes/connectedClusters/persistentvolumes/delete | Deletes persistentvolumes |
> | Microsoft.Kubernetes/connectedClusters/pods/read | Reads pods |
> | Microsoft.Kubernetes/connectedClusters/pods/write | Writes pods |
> | Microsoft.Kubernetes/connectedClusters/pods/delete | Deletes pods |
> | Microsoft.Kubernetes/connectedClusters/pods/exec/action | Exec into a pod |
> | Microsoft.Kubernetes/connectedClusters/podtemplates/read | Reads podtemplates |
> | Microsoft.Kubernetes/connectedClusters/podtemplates/write | Writes podtemplates |
> | Microsoft.Kubernetes/connectedClusters/podtemplates/delete | Deletes podtemplates |
> | Microsoft.Kubernetes/connectedClusters/policy/poddisruptionbudgets/read | Reads poddisruptionbudgets |
> | Microsoft.Kubernetes/connectedClusters/policy/poddisruptionbudgets/write | Writes poddisruptionbudgets |
> | Microsoft.Kubernetes/connectedClusters/policy/poddisruptionbudgets/delete | Deletes poddisruptionbudgets |
> | Microsoft.Kubernetes/connectedClusters/policy/podsecuritypolicies/read | Reads podsecuritypolicies |
> | Microsoft.Kubernetes/connectedClusters/policy/podsecuritypolicies/write | Writes podsecuritypolicies |
> | Microsoft.Kubernetes/connectedClusters/policy/podsecuritypolicies/delete | Deletes podsecuritypolicies |
> | Microsoft.Kubernetes/connectedClusters/policy/podsecuritypolicies/use/action | Use action on podsecuritypolicies |
> | Microsoft.Kubernetes/connectedClusters/rbac.authorization.k8s.io/clusterrolebindings/read | Reads clusterrolebindings |
> | Microsoft.Kubernetes/connectedClusters/rbac.authorization.k8s.io/clusterrolebindings/write | Writes clusterrolebindings |
> | Microsoft.Kubernetes/connectedClusters/rbac.authorization.k8s.io/clusterrolebindings/delete | Deletes clusterrolebindings |
> | Microsoft.Kubernetes/connectedClusters/rbac.authorization.k8s.io/clusterroles/read | Reads clusterroles |
> | Microsoft.Kubernetes/connectedClusters/rbac.authorization.k8s.io/clusterroles/write | Writes clusterroles |
> | Microsoft.Kubernetes/connectedClusters/rbac.authorization.k8s.io/clusterroles/delete | Deletes clusterroles |
> | Microsoft.Kubernetes/connectedClusters/rbac.authorization.k8s.io/clusterroles/bind/action | Binds clusterroles |
> | Microsoft.Kubernetes/connectedClusters/rbac.authorization.k8s.io/clusterroles/escalate/action | Escalates |
> | Microsoft.Kubernetes/connectedClusters/rbac.authorization.k8s.io/rolebindings/read | Reads rolebindings |
> | Microsoft.Kubernetes/connectedClusters/rbac.authorization.k8s.io/rolebindings/write | Writes rolebindings |
> | Microsoft.Kubernetes/connectedClusters/rbac.authorization.k8s.io/rolebindings/delete | Deletes rolebindings |
> | Microsoft.Kubernetes/connectedClusters/rbac.authorization.k8s.io/roles/read | Reads roles |
> | Microsoft.Kubernetes/connectedClusters/rbac.authorization.k8s.io/roles/write | Writes roles |
> | Microsoft.Kubernetes/connectedClusters/rbac.authorization.k8s.io/roles/delete | Deletes roles |
> | Microsoft.Kubernetes/connectedClusters/rbac.authorization.k8s.io/roles/bind/action | Binds roles |
> | Microsoft.Kubernetes/connectedClusters/rbac.authorization.k8s.io/roles/escalate/action | Escalates roles |
> | Microsoft.Kubernetes/connectedClusters/readyz/read | Reads readyz |
> | Microsoft.Kubernetes/connectedClusters/readyz/autoregister-completion/read | Reads autoregister-completion |
> | Microsoft.Kubernetes/connectedClusters/readyz/etcd/read | Reads etcd |
> | Microsoft.Kubernetes/connectedClusters/readyz/log/read | Reads log |
> | Microsoft.Kubernetes/connectedClusters/readyz/ping/read | Reads ping |
> | Microsoft.Kubernetes/connectedClusters/readyz/poststarthook/apiservice-openapi-controller/read | Reads apiservice-openapi-controller |
> | Microsoft.Kubernetes/connectedClusters/readyz/poststarthook/apiservice-registration-controller/read | Reads apiservice-registration-controller |
> | Microsoft.Kubernetes/connectedClusters/readyz/poststarthook/apiservice-status-available-controller/read | Reads apiservice-status-available-controller |
> | Microsoft.Kubernetes/connectedClusters/readyz/poststarthook/bootstrap-controller/read | Reads bootstrap-controller |
> | Microsoft.Kubernetes/connectedClusters/readyz/poststarthook/ca-registration/read | Reads ca-registration |
> | Microsoft.Kubernetes/connectedClusters/readyz/poststarthook/crd-informer-synced/read | Reads crd-informer-synced |
> | Microsoft.Kubernetes/connectedClusters/readyz/poststarthook/generic-apiserver-start-informers/read | Reads generic-apiserver-start-informers |
> | Microsoft.Kubernetes/connectedClusters/readyz/poststarthook/kube-apiserver-autoregistration/read | Reads kube-apiserver-autoregistration |
> | Microsoft.Kubernetes/connectedClusters/readyz/poststarthook/rbac/bootstrap-roles/read | Reads bootstrap-roles |
> | Microsoft.Kubernetes/connectedClusters/readyz/poststarthook/scheduling/bootstrap-system-priority-classes/read | Reads bootstrap-system-priority-classes |
> | Microsoft.Kubernetes/connectedClusters/readyz/poststarthook/start-apiextensions-controllers/read | Reads start-apiextensions-controllers |
> | Microsoft.Kubernetes/connectedClusters/readyz/poststarthook/start-apiextensions-informers/read | Reads start-apiextensions-informers |
> | Microsoft.Kubernetes/connectedClusters/readyz/poststarthook/start-kube-aggregator-informers/read | Reads start-kube-aggregator-informers |
> | Microsoft.Kubernetes/connectedClusters/readyz/poststarthook/start-kube-apiserver-admission-initializer/read | Reads start-kube-apiserver-admission-initializer |
> | Microsoft.Kubernetes/connectedClusters/readyz/shutdown/read | Reads shutdown |
> | Microsoft.Kubernetes/connectedClusters/replicationcontrollers/read | Reads replicationcontrollers |
> | Microsoft.Kubernetes/connectedClusters/replicationcontrollers/write | Writes replicationcontrollers |
> | Microsoft.Kubernetes/connectedClusters/replicationcontrollers/delete | Deletes replicationcontrollers |
> | Microsoft.Kubernetes/connectedClusters/resetMetrics/read | Reads resetMetrics |
> | Microsoft.Kubernetes/connectedClusters/resourcequotas/read | Reads resourcequotas |
> | Microsoft.Kubernetes/connectedClusters/resourcequotas/write | Writes resourcequotas |
> | Microsoft.Kubernetes/connectedClusters/resourcequotas/delete | Deletes resourcequotas |
> | Microsoft.Kubernetes/connectedClusters/scheduling.k8s.io/priorityclasses/read | Reads priorityclasses |
> | Microsoft.Kubernetes/connectedClusters/scheduling.k8s.io/priorityclasses/write | Writes priorityclasses |
> | Microsoft.Kubernetes/connectedClusters/scheduling.k8s.io/priorityclasses/delete | Deletes priorityclasses |
> | Microsoft.Kubernetes/connectedClusters/secrets/read | Reads secrets |
> | Microsoft.Kubernetes/connectedClusters/secrets/write | Writes secrets |
> | Microsoft.Kubernetes/connectedClusters/secrets/delete | Deletes secrets |
> | Microsoft.Kubernetes/connectedClusters/serviceaccounts/read | Reads serviceaccounts |
> | Microsoft.Kubernetes/connectedClusters/serviceaccounts/write | Writes serviceaccounts |
> | Microsoft.Kubernetes/connectedClusters/serviceaccounts/delete | Deletes serviceaccounts |
> | Microsoft.Kubernetes/connectedClusters/serviceaccounts/impersonate/action | Impersonate serviceaccounts |
> | Microsoft.Kubernetes/connectedClusters/services/read | Reads services |
> | Microsoft.Kubernetes/connectedClusters/services/write | Writes services |
> | Microsoft.Kubernetes/connectedClusters/services/delete | Deletes services |
> | Microsoft.Kubernetes/connectedClusters/storage.k8s.io/csidrivers/read | Reads csidrivers |
> | Microsoft.Kubernetes/connectedClusters/storage.k8s.io/csidrivers/write | Writes csidrivers |
> | Microsoft.Kubernetes/connectedClusters/storage.k8s.io/csidrivers/delete | Deletes csidrivers |
> | Microsoft.Kubernetes/connectedClusters/storage.k8s.io/csinodes/read | Reads csinodes |
> | Microsoft.Kubernetes/connectedClusters/storage.k8s.io/csinodes/write | Writes csinodes |
> | Microsoft.Kubernetes/connectedClusters/storage.k8s.io/csinodes/delete | Deletes csinodes |
> | Microsoft.Kubernetes/connectedClusters/storage.k8s.io/csistoragecapacities/read | Reads csistoragecapacities |
> | Microsoft.Kubernetes/connectedClusters/storage.k8s.io/csistoragecapacities/write | Writes csistoragecapacities |
> | Microsoft.Kubernetes/connectedClusters/storage.k8s.io/csistoragecapacities/delete | Deletes csistoragecapacities |
> | Microsoft.Kubernetes/connectedClusters/storage.k8s.io/storageclasses/read | Reads storageclasses |
> | Microsoft.Kubernetes/connectedClusters/storage.k8s.io/storageclasses/write | Writes storageclasses |
> | Microsoft.Kubernetes/connectedClusters/storage.k8s.io/storageclasses/delete | Deletes storageclasses |
> | Microsoft.Kubernetes/connectedClusters/storage.k8s.io/volumeattachments/read | Reads volumeattachments |
> | Microsoft.Kubernetes/connectedClusters/storage.k8s.io/volumeattachments/write | Writes volumeattachments |
> | Microsoft.Kubernetes/connectedClusters/storage.k8s.io/volumeattachments/delete | Deletes volumeattachments |
> | Microsoft.Kubernetes/connectedClusters/swagger-api/read | Reads swagger-api |
> | Microsoft.Kubernetes/connectedClusters/swagger-ui/read | Reads swagger-ui |
> | Microsoft.Kubernetes/connectedClusters/ui/read | Reads ui |
> | Microsoft.Kubernetes/connectedClusters/users/impersonate/action | Impersonate users |
> | Microsoft.Kubernetes/connectedClusters/version/read | Reads version |

### Microsoft.KubernetesConfiguration

Azure service: [Azure Kubernetes Service (AKS)](/azure/aks/)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.KubernetesConfiguration/register/action | Registers subscription to Microsoft.KubernetesConfiguration resource provider. |
> | Microsoft.KubernetesConfiguration/unregister/action | Unregisters subscription from Microsoft.KubernetesConfiguration resource provider. |
> | Microsoft.KubernetesConfiguration/extensions/write | Creates or updates extension resource. |
> | Microsoft.KubernetesConfiguration/extensions/read | Gets extension instance resource. |
> | Microsoft.KubernetesConfiguration/extensions/delete | Deletes extension instance resource. |
> | Microsoft.KubernetesConfiguration/extensions/operations/read | Gets Async Operation status. |
> | Microsoft.KubernetesConfiguration/extensionTypes/read | Gets extension type. |
> | Microsoft.KubernetesConfiguration/fluxConfigurations/write | Creates or updates flux configuration. |
> | Microsoft.KubernetesConfiguration/fluxConfigurations/read | Gets flux configuration. |
> | Microsoft.KubernetesConfiguration/fluxConfigurations/delete | Deletes flux configuration. |
> | Microsoft.KubernetesConfiguration/fluxConfigurations/operations/read | Gets Async Operation status for flux configuration. |
> | Microsoft.KubernetesConfiguration/namespaces/read | Get Namespace Resource |
> | Microsoft.KubernetesConfiguration/namespaces/listUserCredential/action | Get User Credentials for the parent cluster of the namespace resource. |
> | Microsoft.KubernetesConfiguration/operations/read | Gets available operations of the Microsoft.KubernetesConfiguration resource provider. |
> | Microsoft.KubernetesConfiguration/privateLinkScopes/write | Creates or updates private link scope. |
> | Microsoft.KubernetesConfiguration/privateLinkScopes/delete | Deletes private link scope. |
> | Microsoft.KubernetesConfiguration/privateLinkScopes/read | Gets private link scope |
> | Microsoft.KubernetesConfiguration/privateLinkScopes/privateEndpointConnectionProxies/write | Creates or updates private endpoint connection proxy. |
> | Microsoft.KubernetesConfiguration/privateLinkScopes/privateEndpointConnectionProxies/delete | Deletes private endpoint connection proxy |
> | Microsoft.KubernetesConfiguration/privateLinkScopes/privateEndpointConnectionProxies/read | Gets private endpoint connection proxy. |
> | Microsoft.KubernetesConfiguration/privateLinkScopes/privateEndpointConnectionProxies/validate/action | Validates private endpoint connection proxy object. |
> | Microsoft.KubernetesConfiguration/privateLinkScopes/privateEndpointConnectionProxies/updatePrivateEndpointProperties/action | Updates patch on private endpoint connection proxy. |
> | Microsoft.KubernetesConfiguration/privateLinkScopes/privateEndpointConnectionProxies/operations/read | Gets private endpoint connection proxies operation. |
> | Microsoft.KubernetesConfiguration/privateLinkScopes/privateEndpointConnections/write | Creates or updates private endpoint connection. |
> | Microsoft.KubernetesConfiguration/privateLinkScopes/privateEndpointConnections/delete | Deletes private endpoint connection. |
> | Microsoft.KubernetesConfiguration/privateLinkScopes/privateEndpointConnections/read | Gets private endpoint connection. |
> | Microsoft.KubernetesConfiguration/sourceControlConfigurations/write | Creates or updates source control configuration. |
> | Microsoft.KubernetesConfiguration/sourceControlConfigurations/read | Gets source control configuration. |
> | Microsoft.KubernetesConfiguration/sourceControlConfigurations/delete | Deletes source control configuration. |

### Microsoft.ManagedServices

Azure service: [Azure Lighthouse](../../../lighthouse/index.yml)

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

### Microsoft.Management

Azure service: [Management Groups](../../../governance/management-groups/index.yml)

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

### Microsoft.PolicyInsights

Azure service: [Azure Policy](../../../governance/policy/index.yml)

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

### Microsoft.Portal

Azure service: [Azure portal](../../../azure-portal/index.yml)

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

### Microsoft.Purview

Azure service: [Microsoft Purview](/purview/)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.Purview/register/action | Register the subscription for Microsoft Purview provider. |
> | Microsoft.Purview/unregister/action | Unregister the subscription for Microsoft Purview provider. |
> | Microsoft.Purview/setDefaultAccount/action | Sets the default account for the scope. |
> | Microsoft.Purview/removeDefaultAccount/action | Removes the default account for the scope. |
> | Microsoft.Purview/accounts/read | Read account resource for Microsoft Purview provider. |
> | Microsoft.Purview/accounts/write | Write account resource for Microsoft Purview provider. |
> | Microsoft.Purview/accounts/delete | Delete account resource for Microsoft Purview provider. |
> | Microsoft.Purview/accounts/listkeys/action | List keys on the account resource for Microsoft Purview provider. |
> | Microsoft.Purview/accounts/addrootcollectionadmin/action | Add root collection admin to account resource for Microsoft Purview provider. |
> | Microsoft.Purview/accounts/move/action | Move account resource for Microsoft Purview provider. |
> | Microsoft.Purview/accounts/PrivateEndpointConnectionsApproval/action | Approve Private Endpoint Connection. |
> | Microsoft.Purview/accounts/kafkaConfigurations/read | Read Kafka Configurations. |
> | Microsoft.Purview/accounts/kafkaConfigurations/write | Create or update Kafka Configurations. |
> | Microsoft.Purview/accounts/kafkaConfigurations/delete | Delete Kafka Configurations. |
> | Microsoft.Purview/accounts/operationresults/read | Read the operation status on the account resource for Microsoft Purview provider. |
> | Microsoft.Purview/accounts/privateEndpointConnectionProxies/read | Read Account Private Endpoint Connection Proxy. |
> | Microsoft.Purview/accounts/privateEndpointConnectionProxies/write | Write Account Private Endpoint Connection Proxy. |
> | Microsoft.Purview/accounts/privateEndpointConnectionProxies/delete | Delete Account Private Endpoint Connection Proxy. |
> | Microsoft.Purview/accounts/privateEndpointConnectionProxies/validate/action | Validate Account Private Endpoint Connection Proxy. |
> | Microsoft.Purview/accounts/privateEndpointConnectionProxies/operationResults/read | Monitor Private Endpoint Connection Proxy async operations. |
> | Microsoft.Purview/accounts/privateEndpointConnections/read | Read Private Endpoint Connection. |
> | Microsoft.Purview/accounts/privateEndpointConnections/write | Create or update Private Endpoint Connection. |
> | Microsoft.Purview/accounts/privateEndpointConnections/delete | Delete Private Endpoint Connection. |
> | Microsoft.Purview/accounts/privatelinkresources/read | Read Account Link Resources. |
> | Microsoft.Purview/accounts/providers/Microsoft.Insights/diagnosticSettings/read | Gets the diagnostic setting for the resource. |
> | Microsoft.Purview/accounts/providers/Microsoft.Insights/diagnosticSettings/write | Creates or updates the diagnostic setting for the resource. |
> | Microsoft.Purview/accounts/providers/Microsoft.Insights/logDefinitions/read | Gets the available logs for the catalog. |
> | Microsoft.Purview/accounts/providers/Microsoft.Insights/metricDefinitions/read | Gets the available metrics for the catalog. |
> | Microsoft.Purview/checkConsent/read | Resolve the scope the Consent is granted. |
> | Microsoft.Purview/checknameavailability/read | Check if name of purview account resource is available for Microsoft Purview provider. |
> | Microsoft.Purview/consents/read | Read Consent Resource. |
> | Microsoft.Purview/consents/write | Create or Update a Consent Resource. |
> | Microsoft.Purview/consents/delete | Delete the Consent Resource. |
> | Microsoft.Purview/getDefaultAccount/read | Gets the default account for the scope. |
> | Microsoft.Purview/locations/operationResults/read | Monitor async operations. |
> | Microsoft.Purview/operations/read | Reads all available operations for Microsoft Purview provider. |
> | Microsoft.Purview/policies/read | Read Policy Resource. |
> | **DataAction** | **Description** |
> | Microsoft.Purview/accounts/data/read | Permission is deprecated. |
> | Microsoft.Purview/accounts/data/write | Permission is deprecated. |
> | Microsoft.Purview/accounts/scan/read | Permission is deprecated. |
> | Microsoft.Purview/accounts/scan/write | Permission is deprecated. |
> | Microsoft.Purview/attributeBlobs/read | Read Attribute Blob. |
> | Microsoft.Purview/attributeBlobs/write | Write Attribute Blob. |
> | Microsoft.Purview/policyElements/read | Read Policy Element. |
> | Microsoft.Purview/policyElements/write | Create or update Policy Element. |
> | Microsoft.Purview/policyElements/delete | Delete Policy Element. |
> | Microsoft.Purview/purviewAccountBindings/read | Read Account Binding. |
> | Microsoft.Purview/purviewAccountBindings/write | Create or update Account Binding. |
> | Microsoft.Purview/purviewAccountBindings/delete | Delete Account Binding. |

### Microsoft.RecoveryServices

Azure service: [Site Recovery](../../../site-recovery/index.yml)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.RecoveryServices/register/action | Registers subscription for given Resource Provider |
> | Microsoft.RecoveryServices/unregister/action | Unregisters subscription for given Resource Provider |
> | Microsoft.RecoveryServices/Locations/backupCrossRegionRestore/action | Trigger Cross region restore. |
> | Microsoft.RecoveryServices/Locations/backupCrrJob/action | Get Cross Region Restore Job Details in the secondary region for Recovery Services Vault. |
> | Microsoft.RecoveryServices/Locations/backupCrrJobs/action | List Cross Region Restore Jobs in the secondary region for Recovery Services Vault. |
> | Microsoft.RecoveryServices/Locations/backupPreValidateProtection/action |  |
> | Microsoft.RecoveryServices/Locations/backupStatus/action | Check Backup Status for Recovery Services Vaults |
> | Microsoft.RecoveryServices/Locations/backupValidateFeatures/action | Validate Features |
> | Microsoft.RecoveryServices/locations/allocateStamp/action | AllocateStamp is internal operation used by service |
> | Microsoft.RecoveryServices/locations/checkNameAvailability/action | Check Resource Name Availability is an API to check if resource name is available |
> | Microsoft.RecoveryServices/locations/allocatedStamp/read | GetAllocatedStamp is internal operation used by service |
> | Microsoft.RecoveryServices/Locations/backupAadProperties/read | Get AAD Properties for authentication in the third region for Cross Region Restore. |
> | Microsoft.RecoveryServices/Locations/backupCrrOperationResults/read | Returns CRR Operation Result for Recovery Services Vault. |
> | Microsoft.RecoveryServices/Locations/backupCrrOperationsStatus/read | Returns CRR Operation Status for Recovery Services Vault. |
> | Microsoft.RecoveryServices/Locations/backupProtectedItem/write | Create a backup Protected Item |
> | Microsoft.RecoveryServices/Locations/backupProtectedItems/read | Returns the list of all Protected Items. |
> | Microsoft.RecoveryServices/locations/operationStatus/read | Gets Operation Status for a given Operation |
> | Microsoft.RecoveryServices/operations/read | Operation returns the list of Operations for a Resource Provider |
> | Microsoft.RecoveryServices/Vaults/backupJobsExport/action | Export Jobs |
> | Microsoft.RecoveryServices/Vaults/backupSecurityPIN/action | Returns Security PIN Information for Recovery Services Vault. |
> | Microsoft.RecoveryServices/Vaults/backupTriggerValidateOperation/action | Validate Operation on Protected Item |
> | Microsoft.RecoveryServices/Vaults/backupValidateOperation/action | Validate Operation on Protected Item |
> | Microsoft.RecoveryServices/Vaults/write | Create Vault operation creates an Azure resource of type 'vault' |
> | Microsoft.RecoveryServices/Vaults/read | The Get Vault operation gets an object representing the Azure resource of type 'vault' |
> | Microsoft.RecoveryServices/Vaults/delete | The Delete Vault operation deletes the specified Azure resource of type 'vault' |
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
> | Microsoft.RecoveryServices/Vaults/backupJobs/cancel/action | Cancel the Job |
> | Microsoft.RecoveryServices/Vaults/backupJobs/read | Returns all Job Objects |
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
> | Microsoft.RecoveryServices/Vaults/backupResourceGuardProxies/read | Get the list of ResourceGuard proxies for a resource |
> | Microsoft.RecoveryServices/Vaults/backupResourceGuardProxies/read | Get ResourceGuard proxy operation gets an object representing the Azure resource of type 'ResourceGuard proxy' |
> | Microsoft.RecoveryServices/Vaults/backupResourceGuardProxies/unlockDelete/action | Unlock delete ResourceGuard proxy operation unlocks the next delete critical operation |
> | Microsoft.RecoveryServices/Vaults/backupResourceGuardProxies/write | Create ResourceGuard proxy operation creates an Azure resource of type 'ResourceGuard Proxy' |
> | Microsoft.RecoveryServices/Vaults/backupstorageconfig/read | Returns Storage Configuration for Recovery Services Vault. |
> | Microsoft.RecoveryServices/Vaults/backupstorageconfig/write | Updates Storage Configuration for Recovery Services Vault. |
> | Microsoft.RecoveryServices/Vaults/backupUsageSummaries/read | Returns summaries for Protected Items and Protected Servers for a Recovery Services . |
> | Microsoft.RecoveryServices/Vaults/backupValidateOperationResults/read | Validate Operation on Protected Item |
> | Microsoft.RecoveryServices/Vaults/backupValidateOperationsStatuses/read | Validate Operation on Protected Item |
> | Microsoft.RecoveryServices/Vaults/certificates/write | The Update Resource Certificate operation updates the resource/vault credential certificate. |
> | Microsoft.RecoveryServices/Vaults/extendedInformation/read | The Get Extended Info operation gets an object's Extended Info representing the Azure resource of type ?vault? |
> | Microsoft.RecoveryServices/Vaults/extendedInformation/write | The Get Extended Info operation gets an object's Extended Info representing the Azure resource of type ?vault? |
> | Microsoft.RecoveryServices/Vaults/extendedInformation/delete | The Get Extended Info operation gets an object's Extended Info representing the Azure resource of type ?vault? |
> | Microsoft.RecoveryServices/Vaults/locations/capabilities/action | List capabilities at a given location. |
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

### Microsoft.ResourceGraph

Azure service: [Azure Resource Graph](../../../governance/resource-graph/index.yml)

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

### Microsoft.Resources

Azure service: [Azure Resource Manager](../../../azure-resource-manager/index.yml)

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
> | Microsoft.Resources/links/read | Gets or lists resource links. |
> | Microsoft.Resources/links/write | Creates or updates a resource link. |
> | Microsoft.Resources/links/delete | Deletes a resource link. |
> | Microsoft.Resources/marketplace/purchase/action | Purchases a resource from the marketplace. |
> | Microsoft.Resources/providers/read | Get the list of providers. |
> | Microsoft.Resources/resources/read | Get the list of resources based upon filters. |
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

### Microsoft.Solutions

Azure service: [Azure Managed Applications](../../../azure-resource-manager/managed-applications/index.yml)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.Solutions/register/action | Register to Solutions. |
> | Microsoft.Solutions/unregister/action | Unregisters from Solutions. |
> | Microsoft.Solutions/applicationDefinitions/read | Retrieves a list of application definitions. |
> | Microsoft.Solutions/applicationDefinitions/write | Add or modify an application definition. |
> | Microsoft.Solutions/applicationDefinitions/delete | Removes an application definition. |
> | Microsoft.Solutions/applicationDefinitions/applicationArtifacts/read | Lists application artifacts of application definition. |
> | Microsoft.Solutions/applications/read | Retrieves a list of applications. |
> | Microsoft.Solutions/applications/write | Creates an application. |
> | Microsoft.Solutions/applications/delete | Removes an application. |
> | Microsoft.Solutions/applications/refreshPermissions/action | Refreshes application permission(s). |
> | Microsoft.Solutions/applications/updateAccess/action | Updates application access. |
> | Microsoft.Solutions/applications/applicationArtifacts/read | Lists application artifacts. |
> | Microsoft.Solutions/jitRequests/read | Retrieves a list of JitRequests |
> | Microsoft.Solutions/jitRequests/write | Creates a JitRequest |
> | Microsoft.Solutions/jitRequests/delete | Remove a JitRequest |
> | Microsoft.Solutions/locations/operationStatuses/read | Reads the operation status for the resource. |
> | Microsoft.Solutions/locations/operationStatuses/write | Writes the operation status for the resource. |
> | Microsoft.Solutions/operations/read | Gets the list of operations. |

### Microsoft.Subscription

Azure service: core

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.Subscription/cancel/action | Cancels the Subscription |
> | Microsoft.Subscription/rename/action | Renames the Subscription |
> | Microsoft.Subscription/enable/action | Reactivates the Subscription |
> | Microsoft.Subscription/aliases/write | Create subscription alias |
> | Microsoft.Subscription/aliases/read | Get subscription alias |
> | Microsoft.Subscription/aliases/delete | Delete subscription alias |
> | Microsoft.Subscription/Policies/write | Create tenant policy |
> | Microsoft.Subscription/Policies/default/read | Get tenant policy |
> | Microsoft.Subscription/subscriptions/acceptOwnership/action | Accept ownership of Subscription |
> | Microsoft.Subscription/subscriptions/acceptOwnershipStatus/read | Get the status of accepting ownership of Subscription |

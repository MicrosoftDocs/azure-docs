---
title: Containers resource provider operations include file
description: Containers resource provider operations include file
author: rolyon
manager: amycolannino
ms.service: role-based-access-control
ms.workload: identity
ms.topic: include
ms.date: 09/13/2023
ms.author: rolyon
ms.custom: generated
---

### Microsoft.ContainerInstance

Azure service: [Container Instances](../../../container-instances/index.yml)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.ContainerInstance/register/action | Registers the subscription for the container instance resource provider and enables the creation of container groups. |
> | Microsoft.ContainerInstance/containerGroupProfiles/read | Get all container goup profiles. |
> | Microsoft.ContainerInstance/containerGroupProfiles/write | Create or update a specific container group profile. |
> | Microsoft.ContainerInstance/containerGroupProfiles/delete | Delete the specific container group profile. |
> | Microsoft.ContainerInstance/containerGroupProfiles/revisions/read | Get container group profile revisions |
> | Microsoft.ContainerInstance/containerGroupProfiles/revisions/deregister/action | Deregister container group profile revision. |
> | Microsoft.ContainerInstance/containerGroups/read | Get all container groups. |
> | Microsoft.ContainerInstance/containerGroups/write | Create or update a specific container group. |
> | Microsoft.ContainerInstance/containerGroups/delete | Delete the specific container group. |
> | Microsoft.ContainerInstance/containerGroups/restart/action | Restarts a specific container group. |
> | Microsoft.ContainerInstance/containerGroups/stop/action | Stops a specific container group. Compute resources will be deallocated and billing will stop. |
> | Microsoft.ContainerInstance/containerGroups/refreshDelegatedResourceIdentity/action | Refresh delegated resource identity for a specific container group. |
> | Microsoft.ContainerInstance/containerGroups/start/action | Starts a specific container group. |
> | Microsoft.ContainerInstance/containerGroups/containers/exec/action | Exec into a specific container. |
> | Microsoft.ContainerInstance/containerGroups/containers/attach/action | Attach to the output stream of a container. |
> | Microsoft.ContainerInstance/containerGroups/containers/buildlogs/read | Get build logs for a specific container. |
> | Microsoft.ContainerInstance/containerGroups/containers/logs/read | Get logs for a specific container. |
> | Microsoft.ContainerInstance/containerGroups/detectors/read | List Container Group Detectors |
> | Microsoft.ContainerInstance/containerGroups/operationResults/read | Get async operation result |
> | Microsoft.ContainerInstance/containerGroups/outboundNetworkDependenciesEndpoints/read | List Container Group Detectors |
> | Microsoft.ContainerInstance/containerGroups/providers/Microsoft.Insights/diagnosticSettings/read | Gets the diagnostic setting for the container group. |
> | Microsoft.ContainerInstance/containerGroups/providers/Microsoft.Insights/diagnosticSettings/write | Creates or updates the diagnostic setting for the container group. |
> | Microsoft.ContainerInstance/containerGroups/providers/Microsoft.Insights/metricDefinitions/read | Gets the available metrics for container group. |
> | Microsoft.ContainerInstance/containerScaleSets/read | Get details of a container scale set. |
> | Microsoft.ContainerInstance/containerScaleSets/write | Create or update a specific container scale set. |
> | Microsoft.ContainerInstance/containerScaleSets/delete | Delete Container Scale Set |
> | Microsoft.ContainerInstance/containerScaleSets/containerGroups/restart/action | Restart specific container groups in a container scale set. |
> | Microsoft.ContainerInstance/containerScaleSets/containerGroups/start/action | Start specific container groups in a container scale set. |
> | Microsoft.ContainerInstance/containerScaleSets/containerGroups/stop/action | Stop specific container groups in a container scale set. |
> | Microsoft.ContainerInstance/containerScaleSets/containerGroups/delete/action | Delete specific container groups in a container scale set. |
> | Microsoft.ContainerInstance/locations/validateDeleteVirtualNetworkOrSubnets/action | Notifies Microsoft.ContainerInstance that virtual network or subnet is being deleted. |
> | Microsoft.ContainerInstance/locations/deleteVirtualNetworkOrSubnets/action | Notifies Microsoft.ContainerInstance that virtual network or subnet is being deleted. |
> | Microsoft.ContainerInstance/locations/cachedImages/read | Gets the cached images for the subscription in a region. |
> | Microsoft.ContainerInstance/locations/capabilities/read | Get the capabilities for a region. |
> | Microsoft.ContainerInstance/locations/operationResults/read | Get async operation result |
> | Microsoft.ContainerInstance/locations/operations/read | List the operations for Azure Container Instance service. |
> | Microsoft.ContainerInstance/locations/usages/read | Get the usage for a specific region. |
> | Microsoft.ContainerInstance/operations/read | List the operations for Azure Container Instance service. |
> | Microsoft.ContainerInstance/serviceassociationlinks/delete | Delete the service association link created by azure container instance resource provider on a subnet. |

### Microsoft.ContainerRegistry

Azure service: [Container Registry](../../../container-registry/index.yml)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.ContainerRegistry/register/action | Registers the subscription for the container registry resource provider and enables the creation of container registries. |
> | Microsoft.ContainerRegistry/unregister/action | Unregisters the subscription for the container registry resource provider. |
> | Microsoft.ContainerRegistry/checkNameAvailability/read | Checks whether the container registry name is available for use. |
> | Microsoft.ContainerRegistry/locations/deleteVirtualNetworkOrSubnets/action | Notifies Microsoft.ContainerRegistry that virtual network or subnet is being deleted |
> | Microsoft.ContainerRegistry/locations/operationResults/read | Gets an async operation result |
> | Microsoft.ContainerRegistry/operations/read | Lists all of the available Azure Container Registry REST API operations |
> | Microsoft.ContainerRegistry/registries/read | Gets the properties of the specified container registry or lists all the container registries under the specified resource group or subscription. |
> | Microsoft.ContainerRegistry/registries/write | Creates or updates a container registry with the specified parameters. |
> | Microsoft.ContainerRegistry/registries/delete | Deletes a container registry. |
> | Microsoft.ContainerRegistry/registries/listCredentials/action | Lists the login credentials for the specified container registry. |
> | Microsoft.ContainerRegistry/registries/regenerateCredential/action | Regenerates one of the login credentials for the specified container registry. |
> | Microsoft.ContainerRegistry/registries/generateCredentials/action | Generate keys for a token of a specified container registry. |
> | Microsoft.ContainerRegistry/registries/importImage/action | Import Image to container registry with the specified parameters. |
> | Microsoft.ContainerRegistry/registries/getBuildSourceUploadUrl/action | Gets the upload location for the user to be able to upload the source. |
> | Microsoft.ContainerRegistry/registries/queueBuild/action | Creates a new build based on the request parameters and add it to the build queue. |
> | Microsoft.ContainerRegistry/registries/listBuildSourceUploadUrl/action | Get source upload url location for a container registry. |
> | Microsoft.ContainerRegistry/registries/scheduleRun/action | Schedule a run against a container registry. |
> | Microsoft.ContainerRegistry/registries/privateEndpointConnectionsApproval/action | Auto Approves a Private Endpoint Connection |
> | Microsoft.ContainerRegistry/registries/agentpools/read | Get a agentpool for a container registry or list all agentpools. |
> | Microsoft.ContainerRegistry/registries/agentpools/write | Create or Update an agentpool for a container registry. |
> | Microsoft.ContainerRegistry/registries/agentpools/delete | Delete an agentpool for a container registry. |
> | Microsoft.ContainerRegistry/registries/agentpools/listQueueStatus/action | List all queue status of an agentpool for a container registry. |
> | Microsoft.ContainerRegistry/registries/agentpools/operationResults/status/read | Gets an agentpool async operation result status |
> | Microsoft.ContainerRegistry/registries/agentpools/operationStatuses/read | Gets an agentpool async operation status |
> | Microsoft.ContainerRegistry/registries/artifacts/delete | Delete artifact in a container registry. |
> | Microsoft.ContainerRegistry/registries/builds/read | Gets the properties of the specified build or lists all the builds for the specified container registry. |
> | Microsoft.ContainerRegistry/registries/builds/write | Updates a build for a container registry with the specified parameters. |
> | Microsoft.ContainerRegistry/registries/builds/getLogLink/action | Gets a link to download the build logs. |
> | Microsoft.ContainerRegistry/registries/builds/cancel/action | Cancels an existing build. |
> | Microsoft.ContainerRegistry/registries/buildTasks/read | Gets the properties of the specified build task or lists all the build tasks for the specified container registry. |
> | Microsoft.ContainerRegistry/registries/buildTasks/write | Creates or updates a build task for a container registry with the specified parameters. |
> | Microsoft.ContainerRegistry/registries/buildTasks/delete | Deletes a build task from a container registry. |
> | Microsoft.ContainerRegistry/registries/buildTasks/listSourceRepositoryProperties/action | Lists the source control properties for a build task. |
> | Microsoft.ContainerRegistry/registries/buildTasks/steps/read | Gets the properties of the specified build step or lists all the build steps for the specified build task. |
> | Microsoft.ContainerRegistry/registries/buildTasks/steps/write | Creates or updates a build step for a build task with the specified parameters. |
> | Microsoft.ContainerRegistry/registries/buildTasks/steps/delete | Deletes a build step from a build task. |
> | Microsoft.ContainerRegistry/registries/buildTasks/steps/listBuildArguments/action | Lists the build arguments for a build step including the secret arguments. |
> | Microsoft.ContainerRegistry/registries/cacheRules/read | Gets the properties of the specified cache rule or lists all the cache rules for the specified container registry |
> | Microsoft.ContainerRegistry/registries/cacheRules/write | Creates or updates a cache rule for a container registry with the specified parameters |
> | Microsoft.ContainerRegistry/registries/cacheRules/delete | Deletes a cache rule from a container registry |
> | Microsoft.ContainerRegistry/registries/cacheRules/operationStatuses/read | Gets a cache rule async operation status |
> | Microsoft.ContainerRegistry/registries/connectedRegistries/read | Gets the properties of the specified connected registry or lists all the connected registries for the specified container registry. |
> | Microsoft.ContainerRegistry/registries/connectedRegistries/write | Creates or updates a connected registry for a container registry with the specified parameters. |
> | Microsoft.ContainerRegistry/registries/connectedRegistries/delete | Deletes a connected registry from a container registry. |
> | Microsoft.ContainerRegistry/registries/connectedRegistries/deactivate/action | Deactivates a connected registry for a container registry |
> | Microsoft.ContainerRegistry/registries/credentialSets/read | Gets the properties of the specified credential set or lists all the credential sets for the specified container registry |
> | Microsoft.ContainerRegistry/registries/credentialSets/write | Creates or updates a credential set for a container registry with the specified parameters |
> | Microsoft.ContainerRegistry/registries/credentialSets/delete | Deletes a credential set from a container registry |
> | Microsoft.ContainerRegistry/registries/credentialSets/operationStatuses/read | Gets a credential set async operation status |
> | Microsoft.ContainerRegistry/registries/deleted/read | Gets the deleted artifacts in a container registry |
> | Microsoft.ContainerRegistry/registries/deleted/restore/action | Restores deleted artifacts in a container registry |
> | Microsoft.ContainerRegistry/registries/eventGridFilters/read | Gets the properties of the specified event grid filter or lists all the event grid filters for the specified container registry. |
> | Microsoft.ContainerRegistry/registries/eventGridFilters/write | Creates or updates an event grid filter for a container registry with the specified parameters. |
> | Microsoft.ContainerRegistry/registries/eventGridFilters/delete | Deletes an event grid filter from a container registry. |
> | Microsoft.ContainerRegistry/registries/exportPipelines/read | Gets the properties of the specified export pipeline or lists all the export pipelines for the specified container registry. |
> | Microsoft.ContainerRegistry/registries/exportPipelines/write | Creates or updates an export pipeline for a container registry with the specified parameters. |
> | Microsoft.ContainerRegistry/registries/exportPipelines/delete | Deletes an export pipeline from a container registry. |
> | Microsoft.ContainerRegistry/registries/importPipelines/read | Gets the properties of the specified import pipeline or lists all the import pipelines for the specified container registry. |
> | Microsoft.ContainerRegistry/registries/importPipelines/write | Creates or updates an import pipeline for a container registry with the specified parameters. |
> | Microsoft.ContainerRegistry/registries/importPipelines/delete | Deletes an import pipeline from a container registry. |
> | Microsoft.ContainerRegistry/registries/listPolicies/read | Lists the policies for the specified container registry |
> | Microsoft.ContainerRegistry/registries/listUsages/read | Lists the quota usages for the specified container registry. |
> | Microsoft.ContainerRegistry/registries/metadata/read | Gets the metadata of a specific repository for a container registry |
> | Microsoft.ContainerRegistry/registries/metadata/write | Updates the metadata of a repository for a container registry |
> | Microsoft.ContainerRegistry/registries/operationStatuses/read | Gets a registry async operation status |
> | Microsoft.ContainerRegistry/registries/packages/archives/read | Get all the properties of Archive |
> | Microsoft.ContainerRegistry/registries/packages/archives/write | Creates or updates a Archive for a container registry with the specified parameters |
> | Microsoft.ContainerRegistry/registries/packages/archives/delete | Delete an Archive from a container registry |
> | Microsoft.ContainerRegistry/registries/packages/archives/versions/read | Get all the properties of Archive version |
> | Microsoft.ContainerRegistry/registries/packages/archives/versions/write | Creates or updates a Archive version for an Archive with the specified parameter |
> | Microsoft.ContainerRegistry/registries/packages/archives/versions/delete | Delete an Archive version from an Archive |
> | Microsoft.ContainerRegistry/registries/packages/archives/versions/operationStatuses/read | Get Archive version async Operation Status |
> | Microsoft.ContainerRegistry/registries/pipelineRuns/read | Gets the properties of the specified pipeline run or lists all the pipeline runs for the specified container registry. |
> | Microsoft.ContainerRegistry/registries/pipelineRuns/write | Creates or updates a pipeline run for a container registry with the specified parameters. |
> | Microsoft.ContainerRegistry/registries/pipelineRuns/delete | Deletes a pipeline run from a container registry. |
> | Microsoft.ContainerRegistry/registries/pipelineRuns/operationStatuses/read | Gets a pipeline run async operation status. |
> | Microsoft.ContainerRegistry/registries/privateEndpointConnectionProxies/validate/action | Validate the Private Endpoint Connection Proxy (NRP only) |
> | Microsoft.ContainerRegistry/registries/privateEndpointConnectionProxies/read | Get the Private Endpoint Connection Proxy (NRP only) |
> | Microsoft.ContainerRegistry/registries/privateEndpointConnectionProxies/write | Create the Private Endpoint Connection Proxy (NRP only) |
> | Microsoft.ContainerRegistry/registries/privateEndpointConnectionProxies/delete | Delete the Private Endpoint Connection Proxy (NRP only) |
> | Microsoft.ContainerRegistry/registries/privateEndpointConnectionProxies/operationStatuses/read | Get Private Endpoint Connection Proxy Async Operation Status |
> | Microsoft.ContainerRegistry/registries/privateEndpointConnections/read | Gets the properties of private endpoint connection or list all the private endpoint connections for the specified container registry |
> | Microsoft.ContainerRegistry/registries/privateEndpointConnections/write | Approves/Rejects the private endpoint connection |
> | Microsoft.ContainerRegistry/registries/privateEndpointConnections/delete | Deletes the private endpoint connection |
> | Microsoft.ContainerRegistry/registries/privateEndpointConnections/operationStatuses/read | Get Private Endpoint Connection Async Operation Status |
> | Microsoft.ContainerRegistry/registries/providers/Microsoft.Insights/diagnosticSettings/read | Gets the diagnostic setting for the resource |
> | Microsoft.ContainerRegistry/registries/providers/Microsoft.Insights/diagnosticSettings/write | Creates or updates the diagnostic setting for the resource |
> | Microsoft.ContainerRegistry/registries/providers/Microsoft.Insights/logDefinitions/read | Gets the available logs for Microsoft ContainerRegistry |
> | Microsoft.ContainerRegistry/registries/providers/Microsoft.Insights/metricDefinitions/read | Gets the available metrics for Microsoft ContainerRegistry |
> | Microsoft.ContainerRegistry/registries/pull/read | Pull or Get images from a container registry. |
> | Microsoft.ContainerRegistry/registries/push/write | Push or Write images to a container registry. |
> | Microsoft.ContainerRegistry/registries/quarantine/read | Pull or Get quarantined images from container registry |
> | Microsoft.ContainerRegistry/registries/quarantine/write | Write/Modify quarantine state of quarantined images |
> | Microsoft.ContainerRegistry/registries/replications/read | Gets the properties of the specified replication or lists all the replications for the specified container registry. |
> | Microsoft.ContainerRegistry/registries/replications/write | Creates or updates a replication for a container registry with the specified parameters. |
> | Microsoft.ContainerRegistry/registries/replications/delete | Deletes a replication from a container registry. |
> | Microsoft.ContainerRegistry/registries/replications/operationStatuses/read | Gets a replication async operation status |
> | Microsoft.ContainerRegistry/registries/runs/read | Gets the properties of a run against a container registry or list runs. |
> | Microsoft.ContainerRegistry/registries/runs/write | Updates a run. |
> | Microsoft.ContainerRegistry/registries/runs/listLogSasUrl/action | Gets the log SAS URL for a run. |
> | Microsoft.ContainerRegistry/registries/runs/cancel/action | Cancel an existing run. |
> | Microsoft.ContainerRegistry/registries/scopeMaps/read | Gets the properties of the specified scope map or lists all the scope maps for the specified container registry. |
> | Microsoft.ContainerRegistry/registries/scopeMaps/write | Creates or updates a scope map for a container registry with the specified parameters. |
> | Microsoft.ContainerRegistry/registries/scopeMaps/delete | Deletes a scope map from a container registry. |
> | Microsoft.ContainerRegistry/registries/scopeMaps/operationStatuses/read | Gets a scope map async operation status. |
> | Microsoft.ContainerRegistry/registries/sign/write | Push/Pull content trust metadata for a container registry. |
> | Microsoft.ContainerRegistry/registries/taskruns/read | Get a taskrun for a container registry or list all taskruns. |
> | Microsoft.ContainerRegistry/registries/taskruns/write | Create or Update a taskrun for a container registry. |
> | Microsoft.ContainerRegistry/registries/taskruns/delete | Delete a taskrun for a container registry. |
> | Microsoft.ContainerRegistry/registries/taskruns/listDetails/action | List all details of a taskrun for a container registry. |
> | Microsoft.ContainerRegistry/registries/taskruns/operationStatuses/read | Gets a taskrun async operation status |
> | Microsoft.ContainerRegistry/registries/tasks/read | Gets a task for a container registry or list all tasks. |
> | Microsoft.ContainerRegistry/registries/tasks/write | Creates or Updates a task for a container registry. |
> | Microsoft.ContainerRegistry/registries/tasks/delete | Deletes a task for a container registry. |
> | Microsoft.ContainerRegistry/registries/tasks/listDetails/action | List all details of a task for a container registry. |
> | Microsoft.ContainerRegistry/registries/tokens/read | Gets the properties of the specified token or lists all the tokens for the specified container registry. |
> | Microsoft.ContainerRegistry/registries/tokens/write | Creates or updates a token for a container registry with the specified parameters. |
> | Microsoft.ContainerRegistry/registries/tokens/delete | Deletes a token from a container registry. |
> | Microsoft.ContainerRegistry/registries/tokens/operationStatuses/read | Gets a token async operation status. |
> | Microsoft.ContainerRegistry/registries/updatePolicies/write | Updates the policies for the specified container registry |
> | Microsoft.ContainerRegistry/registries/webhooks/read | Gets the properties of the specified webhook or lists all the webhooks for the specified container registry. |
> | Microsoft.ContainerRegistry/registries/webhooks/write | Creates or updates a webhook for a container registry with the specified parameters. |
> | Microsoft.ContainerRegistry/registries/webhooks/delete | Deletes a webhook from a container registry. |
> | Microsoft.ContainerRegistry/registries/webhooks/getCallbackConfig/action | Gets the configuration of service URI and custom headers for the webhook. |
> | Microsoft.ContainerRegistry/registries/webhooks/ping/action | Triggers a ping event to be sent to the webhook. |
> | Microsoft.ContainerRegistry/registries/webhooks/listEvents/action | Lists recent events for the specified webhook. |
> | Microsoft.ContainerRegistry/registries/webhooks/operationStatuses/read | Gets a webhook async operation status |
> | **DataAction** | **Description** |
> | Microsoft.ContainerRegistry/registries/quarantinedArtifacts/read | Allows pull or get of the quarantined artifacts from container registry. This is similar to Microsoft.ContainerRegistry/registries/quarantine/read except that it is a data action |
> | Microsoft.ContainerRegistry/registries/quarantinedArtifacts/write | Allows write or update of the quarantine state of quarantined artifacts. This is similar to Microsoft.ContainerRegistry/registries/quarantine/write action except that it is a data action |
> | Microsoft.ContainerRegistry/registries/trustedCollections/write | Allows push or publish of trusted collections of container registry content. This is similar to Microsoft.ContainerRegistry/registries/sign/write action except that this is a data action |

### Microsoft.ContainerService

Azure service: [Azure Kubernetes Service (AKS)](../../../aks/index.yml)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.ContainerService/register/action | Registers Subscription with Microsoft.ContainerService resource provider |
> | Microsoft.ContainerService/unregister/action | Unregisters Subscription with Microsoft.ContainerService resource provider |
> | Microsoft.ContainerService/containerServices/read | Get a container service |
> | Microsoft.ContainerService/containerServices/write | Creates a new container service or updates an existing one |
> | Microsoft.ContainerService/containerServices/delete | Deletes a container service |
> | Microsoft.ContainerService/fleetMemberships/read | Get a fleet membership extension |
> | Microsoft.ContainerService/fleetMemberships/write | Create or Update a fleet membership extension |
> | Microsoft.ContainerService/fleetMemberships/delete | Delete a fleet membership extension |
> | Microsoft.ContainerService/fleets/read | Get fleet |
> | Microsoft.ContainerService/fleets/write | Create or Update a fleet |
> | Microsoft.ContainerService/fleets/delete | Delete a fleet |
> | Microsoft.ContainerService/fleets/listCredentials/action | List fleet credentials |
> | Microsoft.ContainerService/fleets/members/read | Get a fleet member |
> | Microsoft.ContainerService/fleets/members/write | Create or Update a fleet member |
> | Microsoft.ContainerService/fleets/members/delete | Delete a fleet member |
> | Microsoft.ContainerService/fleets/updateRuns/read | Get a fleet update run |
> | Microsoft.ContainerService/fleets/updateRuns/write | Create or Update a fleet update run |
> | Microsoft.ContainerService/fleets/updateRuns/delete | Delete a fleet update run |
> | Microsoft.ContainerService/fleets/updateRuns/start/action | Starts a fleet update run |
> | Microsoft.ContainerService/fleets/updateRuns/stop/action | Stops a fleet update run |
> | Microsoft.ContainerService/locations/guardrailsVersions/read | Get Guardrails Versions |
> | Microsoft.ContainerService/locations/meshRevisionProfiles/read | Read service mesh revision profiles in a location |
> | Microsoft.ContainerService/locations/operationresults/read | Gets the status of an asynchronous operation result |
> | Microsoft.ContainerService/locations/operations/read | Gets the status of an asynchronous operation |
> | Microsoft.ContainerService/locations/orchestrators/read | Lists the supported orchestrators |
> | Microsoft.ContainerService/locations/osOptions/read | Gets OS options |
> | Microsoft.ContainerService/managedClusters/read | Get a managed cluster |
> | Microsoft.ContainerService/managedClusters/write | Creates a new managed cluster or updates an existing one |
> | Microsoft.ContainerService/managedClusters/delete | Deletes a managed cluster |
> | Microsoft.ContainerService/managedClusters/start/action | Starts a managed cluster |
> | Microsoft.ContainerService/managedClusters/stop/action | Stops a managed cluster |
> | Microsoft.ContainerService/managedClusters/abort/action | Latest ongoing operation on managed cluster gets aborted |
> | Microsoft.ContainerService/managedClusters/listClusterAdminCredential/action | List the clusterAdmin credential of a managed cluster |
> | Microsoft.ContainerService/managedClusters/listClusterUserCredential/action | List the clusterUser credential of a managed cluster |
> | Microsoft.ContainerService/managedClusters/listClusterMonitoringUserCredential/action | List the clusterMonitoringUser credential of a managed cluster |
> | Microsoft.ContainerService/managedClusters/resetServicePrincipalProfile/action | Reset the service principal profile of a managed cluster |
> | Microsoft.ContainerService/managedClusters/unpinManagedCluster/action | Unpin a managed cluster |
> | Microsoft.ContainerService/managedClusters/resolvePrivateLinkServiceId/action | Resolve the private link service id of a managed cluster |
> | Microsoft.ContainerService/managedClusters/resetAADProfile/action | Reset the AAD profile of a managed cluster |
> | Microsoft.ContainerService/managedClusters/rotateClusterCertificates/action | Rotate certificates of a managed cluster |
> | Microsoft.ContainerService/managedClusters/runCommand/action | Run user issued command against managed kubernetes server. |
> | Microsoft.ContainerService/managedClusters/privateEndpointConnectionsApproval/action | Determines if user is allowed to approve a private endpoint connection |
> | Microsoft.ContainerService/managedClusters/accessProfiles/read | Get a managed cluster access profile by role name |
> | Microsoft.ContainerService/managedClusters/accessProfiles/listCredential/action | Get a managed cluster access profile by role name using list credential |
> | Microsoft.ContainerService/managedClusters/agentPools/read | Gets an agent pool |
> | Microsoft.ContainerService/managedClusters/agentPools/write | Creates a new agent pool or updates an existing one |
> | Microsoft.ContainerService/managedClusters/agentPools/delete | Deletes an agent pool |
> | Microsoft.ContainerService/managedClusters/agentPools/upgradeNodeImageVersion/action | Upgrade the node image version of agent pool |
> | Microsoft.ContainerService/managedClusters/agentPools/abort/action | Latest ongoing operation on agent pool gets aborted |
> | Microsoft.ContainerService/managedClusters/agentPools/upgradeNodeImageVersion/write | Upgrade the node image version of agent pool |
> | Microsoft.ContainerService/managedClusters/agentPools/upgradeProfiles/read | Gets the upgrade profile of the Agent Pool |
> | Microsoft.ContainerService/managedClusters/availableAgentPoolVersions/read | Gets the available agent pool versions of the cluster |
> | Microsoft.ContainerService/managedClusters/commandResults/read | Retrieve result from previous issued command. |
> | Microsoft.ContainerService/managedClusters/detectors/read | Get Managed Cluster Detector |
> | Microsoft.ContainerService/managedClusters/diagnosticsState/read | Gets the diagnostics state of the cluster |
> | Microsoft.ContainerService/managedClusters/eventGridFilters/read | Get eventgrid filter |
> | Microsoft.ContainerService/managedClusters/eventGridFilters/write | Create or Update eventgrid filter |
> | Microsoft.ContainerService/managedClusters/eventGridFilters/delete | Delete an eventgrid filter |
> | Microsoft.ContainerService/managedClusters/extensionaddons/read | Gets an extension addon |
> | Microsoft.ContainerService/managedClusters/extensionaddons/write | Creates a new extension addon or updates an existing one |
> | Microsoft.ContainerService/managedClusters/extensionaddons/delete | Deletes an extension addon |
> | Microsoft.ContainerService/managedClusters/maintenanceConfigurations/read | Gets a maintenance configuration |
> | Microsoft.ContainerService/managedClusters/maintenanceConfigurations/write | Creates a new MaintenanceConfiguration or updates an existing one |
> | Microsoft.ContainerService/managedClusters/maintenanceConfigurations/delete | Deletes a maintenance configuration |
> | Microsoft.ContainerService/managedClusters/meshUpgradeProfiles/read | Read service mesh upgrade profiles for a managed cluster |
> | Microsoft.ContainerService/managedClusters/networkSecurityPerimeterAssociationProxies/read | Get ManagedCluster NetworkSecurityPerimeter Association |
> | Microsoft.ContainerService/managedClusters/networkSecurityPerimeterAssociationProxies/write | Create or update ManagedCluster NetworkSecurityPerimeter Association |
> | Microsoft.ContainerService/managedClusters/networkSecurityPerimeterAssociationProxies/delete | Delete ManagedCluster NetworkSecurityPerimeter Association |
> | Microsoft.ContainerService/managedClusters/networkSecurityPerimeterConfigurations/read | Get ManagedCluster NetworkSecurityPerimeter Association |
> | Microsoft.ContainerService/managedClusters/privateEndpointConnections/read | Get private endpoint connection |
> | Microsoft.ContainerService/managedClusters/privateEndpointConnections/write | Approve or Reject a private endpoint connection |
> | Microsoft.ContainerService/managedClusters/privateEndpointConnections/delete | Delete private endpoint connection |
> | Microsoft.ContainerService/managedClusters/providers/Microsoft.Insights/diagnosticSettings/read | Get the diagnostic setting for a managed cluster resource |
> | Microsoft.ContainerService/managedClusters/providers/Microsoft.Insights/diagnosticSettings/write | Creates or updates the diagnostic setting for a managed cluster resource |
> | Microsoft.ContainerService/managedClusters/providers/Microsoft.Insights/logDefinitions/read | Gets the available logs for Managed Cluster |
> | Microsoft.ContainerService/managedClusters/providers/Microsoft.Insights/metricDefinitions/read | Gets the available metrics for Managed Cluster |
> | Microsoft.ContainerService/managedClusters/trustedAccessRoleBindings/read | Get trusted access role bindings for managed cluster |
> | Microsoft.ContainerService/managedClusters/trustedAccessRoleBindings/write | Create or update trusted access role bindings for managed cluster |
> | Microsoft.ContainerService/managedClusters/trustedAccessRoleBindings/delete | Delete trusted access role bindings for managed cluster |
> | Microsoft.ContainerService/managedClusters/upgradeProfiles/read | Gets the upgrade profile of the cluster |
> | Microsoft.ContainerService/managedclustersnapshots/read | Get a managed cluster snapshot |
> | Microsoft.ContainerService/managedclustersnapshots/write | Creates a new managed cluster snapshot |
> | Microsoft.ContainerService/managedclustersnapshots/delete | Deletes a managed cluster snapshot |
> | Microsoft.ContainerService/openShiftClusters/read | Get an Open Shift Cluster |
> | Microsoft.ContainerService/openShiftClusters/write | Creates a new Open Shift Cluster or updates an existing one |
> | Microsoft.ContainerService/openShiftClusters/delete | Delete an Open Shift Cluster |
> | Microsoft.ContainerService/openShiftManagedClusters/read | Get an Open Shift Managed Cluster |
> | Microsoft.ContainerService/openShiftManagedClusters/write | Creates a new Open Shift Managed Cluster or updates an existing one |
> | Microsoft.ContainerService/openShiftManagedClusters/delete | Delete an Open Shift Managed Cluster |
> | Microsoft.ContainerService/operations/read | Lists operations available on Microsoft.ContainerService resource provider |
> | Microsoft.ContainerService/snapshots/read | Get a snapshot |
> | Microsoft.ContainerService/snapshots/write | Creates a new snapshot |
> | Microsoft.ContainerService/snapshots/delete | Deletes a snapshot |
> | **DataAction** | **Description** |
> | Microsoft.ContainerService/fleets/admissionregistration.k8s.io/initializerconfigurations/read | Reads initializerconfigurations |
> | Microsoft.ContainerService/fleets/admissionregistration.k8s.io/initializerconfigurations/write | Writes initializerconfigurations |
> | Microsoft.ContainerService/fleets/admissionregistration.k8s.io/initializerconfigurations/delete | Deletes/DeletesCollection initializerconfigurations resource |
> | Microsoft.ContainerService/fleets/admissionregistration.k8s.io/mutatingwebhookconfigurations/read | Reads mutatingwebhookconfigurations |
> | Microsoft.ContainerService/fleets/admissionregistration.k8s.io/mutatingwebhookconfigurations/write | Writes mutatingwebhookconfigurations |
> | Microsoft.ContainerService/fleets/admissionregistration.k8s.io/mutatingwebhookconfigurations/delete | Deletes mutatingwebhookconfigurations |
> | Microsoft.ContainerService/fleets/admissionregistration.k8s.io/validatingwebhookconfigurations/read | Reads validatingwebhookconfigurations |
> | Microsoft.ContainerService/fleets/admissionregistration.k8s.io/validatingwebhookconfigurations/write | Writes validatingwebhookconfigurations |
> | Microsoft.ContainerService/fleets/admissionregistration.k8s.io/validatingwebhookconfigurations/delete | Deletes validatingwebhookconfigurations |
> | Microsoft.ContainerService/fleets/api/read | Reads api |
> | Microsoft.ContainerService/fleets/api/v1/read | Reads api/v1 |
> | Microsoft.ContainerService/fleets/apiextensions.k8s.io/customresourcedefinitions/read | Reads customresourcedefinitions |
> | Microsoft.ContainerService/fleets/apiextensions.k8s.io/customresourcedefinitions/write | Writes customresourcedefinitions |
> | Microsoft.ContainerService/fleets/apiextensions.k8s.io/customresourcedefinitions/delete | Deletes customresourcedefinitions |
> | Microsoft.ContainerService/fleets/apiregistration.k8s.io/apiservices/read | Reads apiservices |
> | Microsoft.ContainerService/fleets/apiregistration.k8s.io/apiservices/write | Writes apiservices |
> | Microsoft.ContainerService/fleets/apiregistration.k8s.io/apiservices/delete | Deletes apiservices |
> | Microsoft.ContainerService/fleets/apis/read | Reads apis |
> | Microsoft.ContainerService/fleets/apis/admissionregistration.k8s.io/read | Reads admissionregistration.k8s.io |
> | Microsoft.ContainerService/fleets/apis/admissionregistration.k8s.io/v1/read | Reads admissionregistration.k8s.io/v1 |
> | Microsoft.ContainerService/fleets/apis/admissionregistration.k8s.io/v1beta1/read | Reads admissionregistration.k8s.io/v1beta1 |
> | Microsoft.ContainerService/fleets/apis/apiextensions.k8s.io/read | Reads apiextensions.k8s.io |
> | Microsoft.ContainerService/fleets/apis/apiextensions.k8s.io/v1/read | Reads apiextensions.k8s.io/v1 |
> | Microsoft.ContainerService/fleets/apis/apiextensions.k8s.io/v1beta1/read | Reads apiextensions.k8s.io/v1beta1 |
> | Microsoft.ContainerService/fleets/apis/apiregistration.k8s.io/read | Reads apiregistration.k8s.io |
> | Microsoft.ContainerService/fleets/apis/apiregistration.k8s.io/v1/read | Reads apiregistration.k8s.io/v1 |
> | Microsoft.ContainerService/fleets/apis/apiregistration.k8s.io/v1beta1/read | Reads apiregistration.k8s.io/v1beta1 |
> | Microsoft.ContainerService/fleets/apis/apps/read | Reads apps |
> | Microsoft.ContainerService/fleets/apis/apps/v1/read | Reads apps/v1 |
> | Microsoft.ContainerService/fleets/apis/apps/v1beta1/read | Reads apps/v1beta1 |
> | Microsoft.ContainerService/fleets/apis/apps/v1beta2/read | Reads apps/v1beta2 |
> | Microsoft.ContainerService/fleets/apis/authentication.k8s.io/read | Reads authentication.k8s.io |
> | Microsoft.ContainerService/fleets/apis/authentication.k8s.io/v1/read | Reads authentication.k8s.io/v1 |
> | Microsoft.ContainerService/fleets/apis/authentication.k8s.io/v1beta1/read | Reads authentication.k8s.io/v1beta1 |
> | Microsoft.ContainerService/fleets/apis/authorization.k8s.io/read | Reads authorization.k8s.io |
> | Microsoft.ContainerService/fleets/apis/authorization.k8s.io/v1/read | Reads authorization.k8s.io/v1 |
> | Microsoft.ContainerService/fleets/apis/authorization.k8s.io/v1beta1/read | Reads authorization.k8s.io/v1beta1 |
> | Microsoft.ContainerService/fleets/apis/autoscaling/read | Reads autoscaling |
> | Microsoft.ContainerService/fleets/apis/autoscaling/v1/read | Reads autoscaling/v1 |
> | Microsoft.ContainerService/fleets/apis/autoscaling/v2beta1/read | Reads autoscaling/v2beta1 |
> | Microsoft.ContainerService/fleets/apis/autoscaling/v2beta2/read | Reads autoscaling/v2beta2 |
> | Microsoft.ContainerService/fleets/apis/batch/read | Reads batch |
> | Microsoft.ContainerService/fleets/apis/batch/v1/read | Reads batch/v1 |
> | Microsoft.ContainerService/fleets/apis/batch/v1beta1/read | Reads batch/v1beta1 |
> | Microsoft.ContainerService/fleets/apis/certificates.k8s.io/read | Reads certificates.k8s.io |
> | Microsoft.ContainerService/fleets/apis/certificates.k8s.io/v1beta1/read | Reads certificates.k8s.io/v1beta1 |
> | Microsoft.ContainerService/fleets/apis/coordination.k8s.io/read | Reads coordination.k8s.io |
> | Microsoft.ContainerService/fleets/apis/coordination.k8s.io/v1/read | Reads coordination/v1 |
> | Microsoft.ContainerService/fleets/apis/coordination.k8s.io/v1beta1/read | Reads coordination.k8s.io/v1beta1 |
> | Microsoft.ContainerService/fleets/apis/events.k8s.io/read | Reads events.k8s.io |
> | Microsoft.ContainerService/fleets/apis/events.k8s.io/v1beta1/read | Reads events.k8s.io/v1beta1 |
> | Microsoft.ContainerService/fleets/apis/extensions/read | Reads extensions |
> | Microsoft.ContainerService/fleets/apis/extensions/v1beta1/read | Reads extensions/v1beta1 |
> | Microsoft.ContainerService/fleets/apis/metrics.k8s.io/read | Reads metrics.k8s.io |
> | Microsoft.ContainerService/fleets/apis/metrics.k8s.io/v1beta1/read | Reads metrics.k8s.io/v1beta1 |
> | Microsoft.ContainerService/fleets/apis/networking.k8s.io/read | Reads networking.k8s.io |
> | Microsoft.ContainerService/fleets/apis/networking.k8s.io/v1/read | Reads networking/v1 |
> | Microsoft.ContainerService/fleets/apis/networking.k8s.io/v1beta1/read | Reads networking.k8s.io/v1beta1 |
> | Microsoft.ContainerService/fleets/apis/node.k8s.io/read | Reads node.k8s.io |
> | Microsoft.ContainerService/fleets/apis/node.k8s.io/v1beta1/read | Reads node.k8s.io/v1beta1 |
> | Microsoft.ContainerService/fleets/apis/policy/read | Reads policy |
> | Microsoft.ContainerService/fleets/apis/policy/v1beta1/read | Reads policy/v1beta1 |
> | Microsoft.ContainerService/fleets/apis/rbac.authorization.k8s.io/read | Reads rbac.authorization.k8s.io |
> | Microsoft.ContainerService/fleets/apis/rbac.authorization.k8s.io/v1/read | Reads rbac.authorization/v1 |
> | Microsoft.ContainerService/fleets/apis/rbac.authorization.k8s.io/v1beta1/read | Reads rbac.authorization.k8s.io/v1beta1 |
> | Microsoft.ContainerService/fleets/apis/scheduling.k8s.io/read | Reads scheduling.k8s.io |
> | Microsoft.ContainerService/fleets/apis/scheduling.k8s.io/v1/read | Reads scheduling/v1 |
> | Microsoft.ContainerService/fleets/apis/scheduling.k8s.io/v1beta1/read | Reads scheduling.k8s.io/v1beta1 |
> | Microsoft.ContainerService/fleets/apis/storage.k8s.io/read | Reads storage.k8s.io |
> | Microsoft.ContainerService/fleets/apis/storage.k8s.io/v1/read | Reads storage/v1 |
> | Microsoft.ContainerService/fleets/apis/storage.k8s.io/v1beta1/read | Reads storage.k8s.io/v1beta1 |
> | Microsoft.ContainerService/fleets/apps/controllerrevisions/read | Reads controllerrevisions |
> | Microsoft.ContainerService/fleets/apps/controllerrevisions/write | Writes controllerrevisions |
> | Microsoft.ContainerService/fleets/apps/controllerrevisions/delete | Deletes controllerrevisions |
> | Microsoft.ContainerService/fleets/apps/daemonsets/read | Reads daemonsets |
> | Microsoft.ContainerService/fleets/apps/daemonsets/write | Writes daemonsets |
> | Microsoft.ContainerService/fleets/apps/daemonsets/delete | Deletes daemonsets |
> | Microsoft.ContainerService/fleets/apps/deployments/read | Reads deployments |
> | Microsoft.ContainerService/fleets/apps/deployments/write | Writes deployments |
> | Microsoft.ContainerService/fleets/apps/deployments/delete | Deletes deployments |
> | Microsoft.ContainerService/fleets/apps/statefulsets/read | Reads statefulsets |
> | Microsoft.ContainerService/fleets/apps/statefulsets/write | Writes statefulsets |
> | Microsoft.ContainerService/fleets/apps/statefulsets/delete | Deletes statefulsets |
> | Microsoft.ContainerService/fleets/authentication.k8s.io/tokenreviews/write | Writes tokenreviews |
> | Microsoft.ContainerService/fleets/authentication.k8s.io/userextras/impersonate/action | Impersonate userextras |
> | Microsoft.ContainerService/fleets/authorization.k8s.io/localsubjectaccessreviews/write | Writes localsubjectaccessreviews |
> | Microsoft.ContainerService/fleets/authorization.k8s.io/selfsubjectaccessreviews/write | Writes selfsubjectaccessreviews |
> | Microsoft.ContainerService/fleets/authorization.k8s.io/selfsubjectrulesreviews/write | Writes selfsubjectrulesreviews |
> | Microsoft.ContainerService/fleets/authorization.k8s.io/subjectaccessreviews/write | Writes subjectaccessreviews |
> | Microsoft.ContainerService/fleets/autoscaling/horizontalpodautoscalers/read | Reads horizontalpodautoscalers |
> | Microsoft.ContainerService/fleets/autoscaling/horizontalpodautoscalers/write | Writes horizontalpodautoscalers |
> | Microsoft.ContainerService/fleets/autoscaling/horizontalpodautoscalers/delete | Deletes horizontalpodautoscalers |
> | Microsoft.ContainerService/fleets/batch/cronjobs/read | Reads cronjobs |
> | Microsoft.ContainerService/fleets/batch/cronjobs/write | Writes cronjobs |
> | Microsoft.ContainerService/fleets/batch/cronjobs/delete | Deletes cronjobs |
> | Microsoft.ContainerService/fleets/batch/jobs/read | Reads jobs |
> | Microsoft.ContainerService/fleets/batch/jobs/write | Writes jobs |
> | Microsoft.ContainerService/fleets/batch/jobs/delete | Deletes jobs |
> | Microsoft.ContainerService/fleets/bindings/write | Writes bindings |
> | Microsoft.ContainerService/fleets/certificates.k8s.io/certificatesigningrequests/read | Reads certificatesigningrequests |
> | Microsoft.ContainerService/fleets/certificates.k8s.io/certificatesigningrequests/write | Writes certificatesigningrequests |
> | Microsoft.ContainerService/fleets/certificates.k8s.io/certificatesigningrequests/delete | Deletes certificatesigningrequests |
> | Microsoft.ContainerService/fleets/componentstatuses/read | Reads componentstatuses |
> | Microsoft.ContainerService/fleets/componentstatuses/write | Writes componentstatuses |
> | Microsoft.ContainerService/fleets/componentstatuses/delete | Deletes componentstatuses |
> | Microsoft.ContainerService/fleets/configmaps/read | Reads configmaps |
> | Microsoft.ContainerService/fleets/configmaps/write | Writes configmaps |
> | Microsoft.ContainerService/fleets/configmaps/delete | Deletes configmaps |
> | Microsoft.ContainerService/fleets/coordination.k8s.io/leases/read | Reads leases |
> | Microsoft.ContainerService/fleets/coordination.k8s.io/leases/write | Writes leases |
> | Microsoft.ContainerService/fleets/coordination.k8s.io/leases/delete | Deletes leases |
> | Microsoft.ContainerService/fleets/endpoints/read | Reads endpoints |
> | Microsoft.ContainerService/fleets/endpoints/write | Writes endpoints |
> | Microsoft.ContainerService/fleets/endpoints/delete | Deletes endpoints |
> | Microsoft.ContainerService/fleets/events/read | Reads events |
> | Microsoft.ContainerService/fleets/events/write | Writes events |
> | Microsoft.ContainerService/fleets/events/delete | Deletes events |
> | Microsoft.ContainerService/fleets/events.k8s.io/events/read | Reads events |
> | Microsoft.ContainerService/fleets/events.k8s.io/events/write | Writes events |
> | Microsoft.ContainerService/fleets/events.k8s.io/events/delete | Deletes events |
> | Microsoft.ContainerService/fleets/extensions/daemonsets/read | Reads daemonsets |
> | Microsoft.ContainerService/fleets/extensions/daemonsets/write | Writes daemonsets |
> | Microsoft.ContainerService/fleets/extensions/daemonsets/delete | Deletes daemonsets |
> | Microsoft.ContainerService/fleets/extensions/deployments/read | Reads deployments |
> | Microsoft.ContainerService/fleets/extensions/deployments/write | Writes deployments |
> | Microsoft.ContainerService/fleets/extensions/deployments/delete | Deletes deployments |
> | Microsoft.ContainerService/fleets/extensions/ingresses/read | Reads ingresses |
> | Microsoft.ContainerService/fleets/extensions/ingresses/write | Writes ingresses |
> | Microsoft.ContainerService/fleets/extensions/ingresses/delete | Deletes ingresses |
> | Microsoft.ContainerService/fleets/extensions/networkpolicies/read | Reads networkpolicies |
> | Microsoft.ContainerService/fleets/extensions/networkpolicies/write | Writes networkpolicies |
> | Microsoft.ContainerService/fleets/extensions/networkpolicies/delete | Deletes networkpolicies |
> | Microsoft.ContainerService/fleets/extensions/podsecuritypolicies/read | Reads podsecuritypolicies |
> | Microsoft.ContainerService/fleets/extensions/podsecuritypolicies/write | Writes podsecuritypolicies |
> | Microsoft.ContainerService/fleets/extensions/podsecuritypolicies/delete | Deletes podsecuritypolicies |
> | Microsoft.ContainerService/fleets/groups/impersonate/action | Impersonate groups |
> | Microsoft.ContainerService/fleets/healthz/read | Reads healthz |
> | Microsoft.ContainerService/fleets/healthz/autoregister-completion/read | Reads autoregister-completion |
> | Microsoft.ContainerService/fleets/healthz/etcd/read | Reads etcd |
> | Microsoft.ContainerService/fleets/healthz/log/read | Reads log |
> | Microsoft.ContainerService/fleets/healthz/ping/read | Reads ping |
> | Microsoft.ContainerService/fleets/healthz/poststarthook/apiservice-openapi-controller/read | Reads apiservice-openapi-controller |
> | Microsoft.ContainerService/fleets/healthz/poststarthook/apiservice-registration-controller/read | Reads apiservice-registration-controller |
> | Microsoft.ContainerService/fleets/healthz/poststarthook/apiservice-status-available-controller/read | Reads apiservice-status-available-controller |
> | Microsoft.ContainerService/fleets/healthz/poststarthook/bootstrap-controller/read | Reads bootstrap-controller |
> | Microsoft.ContainerService/fleets/healthz/poststarthook/ca-registration/read | Reads ca-registration |
> | Microsoft.ContainerService/fleets/healthz/poststarthook/crd-informer-synced/read | Reads crd-informer-synced |
> | Microsoft.ContainerService/fleets/healthz/poststarthook/generic-apiserver-start-informers/read | Reads generic-apiserver-start-informers |
> | Microsoft.ContainerService/fleets/healthz/poststarthook/kube-apiserver-autoregistration/read | Reads kube-apiserver-autoregistration |
> | Microsoft.ContainerService/fleets/healthz/poststarthook/rbac/bootstrap-roles/read | Reads bootstrap-roles |
> | Microsoft.ContainerService/fleets/healthz/poststarthook/scheduling/bootstrap-system-priority-classes/read | Reads bootstrap-system-priority-classes |
> | Microsoft.ContainerService/fleets/healthz/poststarthook/start-apiextensions-controllers/read | Reads start-apiextensions-controllers |
> | Microsoft.ContainerService/fleets/healthz/poststarthook/start-apiextensions-informers/read | Reads start-apiextensions-informers |
> | Microsoft.ContainerService/fleets/healthz/poststarthook/start-kube-aggregator-informers/read | Reads start-kube-aggregator-informers |
> | Microsoft.ContainerService/fleets/healthz/poststarthook/start-kube-apiserver-admission-initializer/read | Reads start-kube-apiserver-admission-initializer |
> | Microsoft.ContainerService/fleets/limitranges/read | Reads limitranges |
> | Microsoft.ContainerService/fleets/limitranges/write | Writes limitranges |
> | Microsoft.ContainerService/fleets/limitranges/delete | Deletes limitranges |
> | Microsoft.ContainerService/fleets/livez/read | Reads livez |
> | Microsoft.ContainerService/fleets/livez/autoregister-completion/read | Reads autoregister-completion |
> | Microsoft.ContainerService/fleets/livez/etcd/read | Reads etcd |
> | Microsoft.ContainerService/fleets/livez/log/read | Reads log |
> | Microsoft.ContainerService/fleets/livez/ping/read | Reads ping |
> | Microsoft.ContainerService/fleets/livez/poststarthook/apiservice-openapi-controller/read | Reads apiservice-openapi-controller |
> | Microsoft.ContainerService/fleets/livez/poststarthook/apiservice-registration-controller/read | Reads apiservice-registration-controller |
> | Microsoft.ContainerService/fleets/livez/poststarthook/apiservice-status-available-controller/read | Reads apiservice-status-available-controller |
> | Microsoft.ContainerService/fleets/livez/poststarthook/bootstrap-controller/read | Reads bootstrap-controller |
> | Microsoft.ContainerService/fleets/livez/poststarthook/ca-registration/read | Reads ca-registration |
> | Microsoft.ContainerService/fleets/livez/poststarthook/crd-informer-synced/read | Reads crd-informer-synced |
> | Microsoft.ContainerService/fleets/livez/poststarthook/generic-apiserver-start-informers/read | Reads generic-apiserver-start-informers |
> | Microsoft.ContainerService/fleets/livez/poststarthook/kube-apiserver-autoregistration/read | Reads kube-apiserver-autoregistration |
> | Microsoft.ContainerService/fleets/livez/poststarthook/rbac/bootstrap-roles/read | Reads bootstrap-roles |
> | Microsoft.ContainerService/fleets/livez/poststarthook/scheduling/bootstrap-system-priority-classes/read | Reads bootstrap-system-priority-classes |
> | Microsoft.ContainerService/fleets/livez/poststarthook/start-apiextensions-controllers/read | Reads start-apiextensions-controllers |
> | Microsoft.ContainerService/fleets/livez/poststarthook/start-apiextensions-informers/read | Reads start-apiextensions-informers |
> | Microsoft.ContainerService/fleets/livez/poststarthook/start-kube-aggregator-informers/read | Reads start-kube-aggregator-informers |
> | Microsoft.ContainerService/fleets/livez/poststarthook/start-kube-apiserver-admission-initializer/read | Reads start-kube-apiserver-admission-initializer |
> | Microsoft.ContainerService/fleets/logs/read | Reads logs |
> | Microsoft.ContainerService/fleets/metrics/read | Reads metrics |
> | Microsoft.ContainerService/fleets/metrics.k8s.io/nodes/read | Reads nodes |
> | Microsoft.ContainerService/fleets/metrics.k8s.io/pods/read | Reads pods |
> | Microsoft.ContainerService/fleets/namespaces/read | Reads namespaces |
> | Microsoft.ContainerService/fleets/namespaces/write | Writes namespaces |
> | Microsoft.ContainerService/fleets/namespaces/delete | Deletes namespaces |
> | Microsoft.ContainerService/fleets/networking.k8s.io/ingresses/read | Reads ingresses |
> | Microsoft.ContainerService/fleets/networking.k8s.io/ingresses/write | Writes ingresses |
> | Microsoft.ContainerService/fleets/networking.k8s.io/ingresses/delete | Deletes ingresses |
> | Microsoft.ContainerService/fleets/networking.k8s.io/networkpolicies/read | Reads networkpolicies |
> | Microsoft.ContainerService/fleets/networking.k8s.io/networkpolicies/write | Writes networkpolicies |
> | Microsoft.ContainerService/fleets/networking.k8s.io/networkpolicies/delete | Deletes networkpolicies |
> | Microsoft.ContainerService/fleets/node.k8s.io/runtimeclasses/read | Reads runtimeclasses |
> | Microsoft.ContainerService/fleets/node.k8s.io/runtimeclasses/write | Writes runtimeclasses |
> | Microsoft.ContainerService/fleets/node.k8s.io/runtimeclasses/delete | Deletes runtimeclasses |
> | Microsoft.ContainerService/fleets/nodes/read | Reads nodes |
> | Microsoft.ContainerService/fleets/nodes/write | Writes nodes |
> | Microsoft.ContainerService/fleets/nodes/delete | Deletes nodes |
> | Microsoft.ContainerService/fleets/openapi/v2/read | Reads v2 |
> | Microsoft.ContainerService/fleets/persistentvolumeclaims/read | Reads persistentvolumeclaims |
> | Microsoft.ContainerService/fleets/persistentvolumeclaims/write | Writes persistentvolumeclaims |
> | Microsoft.ContainerService/fleets/persistentvolumeclaims/delete | Deletes persistentvolumeclaims |
> | Microsoft.ContainerService/fleets/persistentvolumes/read | Reads persistentvolumes |
> | Microsoft.ContainerService/fleets/persistentvolumes/write | Writes persistentvolumes |
> | Microsoft.ContainerService/fleets/persistentvolumes/delete | Deletes persistentvolumes |
> | Microsoft.ContainerService/fleets/podtemplates/read | Reads podtemplates |
> | Microsoft.ContainerService/fleets/podtemplates/write | Writes podtemplates |
> | Microsoft.ContainerService/fleets/podtemplates/delete | Deletes podtemplates |
> | Microsoft.ContainerService/fleets/policy/poddisruptionbudgets/read | Reads poddisruptionbudgets |
> | Microsoft.ContainerService/fleets/policy/poddisruptionbudgets/write | Writes poddisruptionbudgets |
> | Microsoft.ContainerService/fleets/policy/poddisruptionbudgets/delete | Deletes poddisruptionbudgets |
> | Microsoft.ContainerService/fleets/policy/podsecuritypolicies/read | Reads podsecuritypolicies |
> | Microsoft.ContainerService/fleets/policy/podsecuritypolicies/write | Writes podsecuritypolicies |
> | Microsoft.ContainerService/fleets/policy/podsecuritypolicies/delete | Deletes podsecuritypolicies |
> | Microsoft.ContainerService/fleets/policy/podsecuritypolicies/use/action | Use action on podsecuritypolicies |
> | Microsoft.ContainerService/fleets/rbac.authorization.k8s.io/clusterrolebindings/read | Reads clusterrolebindings |
> | Microsoft.ContainerService/fleets/rbac.authorization.k8s.io/clusterrolebindings/write | Writes clusterrolebindings |
> | Microsoft.ContainerService/fleets/rbac.authorization.k8s.io/clusterrolebindings/delete | Deletes clusterrolebindings |
> | Microsoft.ContainerService/fleets/rbac.authorization.k8s.io/clusterroles/read | Reads clusterroles |
> | Microsoft.ContainerService/fleets/rbac.authorization.k8s.io/clusterroles/write | Writes clusterroles |
> | Microsoft.ContainerService/fleets/rbac.authorization.k8s.io/clusterroles/delete | Deletes clusterroles |
> | Microsoft.ContainerService/fleets/rbac.authorization.k8s.io/clusterroles/bind/action | Binds clusterroles |
> | Microsoft.ContainerService/fleets/rbac.authorization.k8s.io/clusterroles/escalate/action | Escalates |
> | Microsoft.ContainerService/fleets/rbac.authorization.k8s.io/rolebindings/read | Reads rolebindings |
> | Microsoft.ContainerService/fleets/rbac.authorization.k8s.io/rolebindings/write | Writes rolebindings |
> | Microsoft.ContainerService/fleets/rbac.authorization.k8s.io/rolebindings/delete | Deletes rolebindings |
> | Microsoft.ContainerService/fleets/rbac.authorization.k8s.io/roles/read | Reads roles |
> | Microsoft.ContainerService/fleets/rbac.authorization.k8s.io/roles/write | Writes roles |
> | Microsoft.ContainerService/fleets/rbac.authorization.k8s.io/roles/delete | Deletes roles |
> | Microsoft.ContainerService/fleets/rbac.authorization.k8s.io/roles/bind/action | Binds roles |
> | Microsoft.ContainerService/fleets/rbac.authorization.k8s.io/roles/escalate/action | Escalates roles |
> | Microsoft.ContainerService/fleets/readyz/read | Reads readyz |
> | Microsoft.ContainerService/fleets/readyz/autoregister-completion/read | Reads autoregister-completion |
> | Microsoft.ContainerService/fleets/readyz/etcd/read | Reads etcd |
> | Microsoft.ContainerService/fleets/readyz/log/read | Reads log |
> | Microsoft.ContainerService/fleets/readyz/ping/read | Reads ping |
> | Microsoft.ContainerService/fleets/readyz/poststarthook/apiservice-openapi-controller/read | Reads apiservice-openapi-controller |
> | Microsoft.ContainerService/fleets/readyz/poststarthook/apiservice-registration-controller/read | Reads apiservice-registration-controller |
> | Microsoft.ContainerService/fleets/readyz/poststarthook/apiservice-status-available-controller/read | Reads apiservice-status-available-controller |
> | Microsoft.ContainerService/fleets/readyz/poststarthook/bootstrap-controller/read | Reads bootstrap-controller |
> | Microsoft.ContainerService/fleets/readyz/poststarthook/ca-registration/read | Reads ca-registration |
> | Microsoft.ContainerService/fleets/readyz/poststarthook/crd-informer-synced/read | Reads crd-informer-synced |
> | Microsoft.ContainerService/fleets/readyz/poststarthook/generic-apiserver-start-informers/read | Reads generic-apiserver-start-informers |
> | Microsoft.ContainerService/fleets/readyz/poststarthook/kube-apiserver-autoregistration/read | Reads kube-apiserver-autoregistration |
> | Microsoft.ContainerService/fleets/readyz/poststarthook/rbac/bootstrap-roles/read | Reads bootstrap-roles |
> | Microsoft.ContainerService/fleets/readyz/poststarthook/scheduling/bootstrap-system-priority-classes/read | Reads bootstrap-system-priority-classes |
> | Microsoft.ContainerService/fleets/readyz/poststarthook/start-apiextensions-controllers/read | Reads start-apiextensions-controllers |
> | Microsoft.ContainerService/fleets/readyz/poststarthook/start-apiextensions-informers/read | Reads start-apiextensions-informers |
> | Microsoft.ContainerService/fleets/readyz/poststarthook/start-kube-aggregator-informers/read | Reads start-kube-aggregator-informers |
> | Microsoft.ContainerService/fleets/readyz/poststarthook/start-kube-apiserver-admission-initializer/read | Reads start-kube-apiserver-admission-initializer |
> | Microsoft.ContainerService/fleets/readyz/shutdown/read | Reads shutdown |
> | Microsoft.ContainerService/fleets/replicationcontrollers/read | Reads replicationcontrollers |
> | Microsoft.ContainerService/fleets/replicationcontrollers/write | Writes replicationcontrollers |
> | Microsoft.ContainerService/fleets/replicationcontrollers/delete | Deletes replicationcontrollers |
> | Microsoft.ContainerService/fleets/resetMetrics/read | Reads resetMetrics |
> | Microsoft.ContainerService/fleets/resourcequotas/read | Reads resourcequotas |
> | Microsoft.ContainerService/fleets/resourcequotas/write | Writes resourcequotas |
> | Microsoft.ContainerService/fleets/resourcequotas/delete | Deletes resourcequotas |
> | Microsoft.ContainerService/fleets/scheduling.k8s.io/priorityclasses/read | Reads priorityclasses |
> | Microsoft.ContainerService/fleets/scheduling.k8s.io/priorityclasses/write | Writes priorityclasses |
> | Microsoft.ContainerService/fleets/scheduling.k8s.io/priorityclasses/delete | Deletes priorityclasses |
> | Microsoft.ContainerService/fleets/secrets/read | Reads secrets |
> | Microsoft.ContainerService/fleets/secrets/write | Writes secrets |
> | Microsoft.ContainerService/fleets/secrets/delete | Deletes secrets |
> | Microsoft.ContainerService/fleets/serviceaccounts/read | Reads serviceaccounts |
> | Microsoft.ContainerService/fleets/serviceaccounts/write | Writes serviceaccounts |
> | Microsoft.ContainerService/fleets/serviceaccounts/delete | Deletes serviceaccounts |
> | Microsoft.ContainerService/fleets/serviceaccounts/impersonate/action | Impersonate serviceaccounts |
> | Microsoft.ContainerService/fleets/services/read | Reads services |
> | Microsoft.ContainerService/fleets/services/write | Writes services |
> | Microsoft.ContainerService/fleets/services/delete | Deletes services |
> | Microsoft.ContainerService/fleets/storage.k8s.io/csidrivers/read | Reads csidrivers |
> | Microsoft.ContainerService/fleets/storage.k8s.io/csidrivers/write | Writes csidrivers |
> | Microsoft.ContainerService/fleets/storage.k8s.io/csidrivers/delete | Deletes csidrivers |
> | Microsoft.ContainerService/fleets/storage.k8s.io/csinodes/read | Reads csinodes |
> | Microsoft.ContainerService/fleets/storage.k8s.io/csinodes/write | Writes csinodes |
> | Microsoft.ContainerService/fleets/storage.k8s.io/csinodes/delete | Deletes csinodes |
> | Microsoft.ContainerService/fleets/storage.k8s.io/storageclasses/read | Reads storageclasses |
> | Microsoft.ContainerService/fleets/storage.k8s.io/storageclasses/write | Writes storageclasses |
> | Microsoft.ContainerService/fleets/storage.k8s.io/storageclasses/delete | Deletes storageclasses |
> | Microsoft.ContainerService/fleets/storage.k8s.io/volumeattachments/read | Reads volumeattachments |
> | Microsoft.ContainerService/fleets/storage.k8s.io/volumeattachments/write | Writes volumeattachments |
> | Microsoft.ContainerService/fleets/storage.k8s.io/volumeattachments/delete | Deletes volumeattachments |
> | Microsoft.ContainerService/fleets/swagger-api/read | Reads swagger-api |
> | Microsoft.ContainerService/fleets/swagger-ui/read | Reads swagger-ui |
> | Microsoft.ContainerService/fleets/ui/read | Reads ui |
> | Microsoft.ContainerService/fleets/users/impersonate/action | Impersonate users |
> | Microsoft.ContainerService/fleets/version/read | Reads version |
> | Microsoft.ContainerService/managedClusters/admissionregistration.k8s.io/initializerconfigurations/read | Reads initializerconfigurations |
> | Microsoft.ContainerService/managedClusters/admissionregistration.k8s.io/initializerconfigurations/write | Writes initializerconfigurations |
> | Microsoft.ContainerService/managedClusters/admissionregistration.k8s.io/initializerconfigurations/delete | Deletes/DeletesCollection initializerconfigurations resource |
> | Microsoft.ContainerService/managedClusters/admissionregistration.k8s.io/mutatingwebhookconfigurations/read | Reads mutatingwebhookconfigurations |
> | Microsoft.ContainerService/managedClusters/admissionregistration.k8s.io/mutatingwebhookconfigurations/write | Writes mutatingwebhookconfigurations |
> | Microsoft.ContainerService/managedClusters/admissionregistration.k8s.io/mutatingwebhookconfigurations/delete | Deletes mutatingwebhookconfigurations |
> | Microsoft.ContainerService/managedClusters/admissionregistration.k8s.io/validatingwebhookconfigurations/read | Reads validatingwebhookconfigurations |
> | Microsoft.ContainerService/managedClusters/admissionregistration.k8s.io/validatingwebhookconfigurations/write | Writes validatingwebhookconfigurations |
> | Microsoft.ContainerService/managedClusters/admissionregistration.k8s.io/validatingwebhookconfigurations/delete | Deletes validatingwebhookconfigurations |
> | Microsoft.ContainerService/managedClusters/api/read | Reads api |
> | Microsoft.ContainerService/managedClusters/api/v1/read | Reads api/v1 |
> | Microsoft.ContainerService/managedClusters/apiextensions.k8s.io/customresourcedefinitions/read | Reads customresourcedefinitions |
> | Microsoft.ContainerService/managedClusters/apiextensions.k8s.io/customresourcedefinitions/write | Writes customresourcedefinitions |
> | Microsoft.ContainerService/managedClusters/apiextensions.k8s.io/customresourcedefinitions/delete | Deletes customresourcedefinitions |
> | Microsoft.ContainerService/managedClusters/apiregistration.k8s.io/apiservices/read | Reads apiservices |
> | Microsoft.ContainerService/managedClusters/apiregistration.k8s.io/apiservices/write | Writes apiservices |
> | Microsoft.ContainerService/managedClusters/apiregistration.k8s.io/apiservices/delete | Deletes apiservices |
> | Microsoft.ContainerService/managedClusters/apis/read | Reads apis |
> | Microsoft.ContainerService/managedClusters/apis/admissionregistration.k8s.io/read | Reads admissionregistration.k8s.io |
> | Microsoft.ContainerService/managedClusters/apis/admissionregistration.k8s.io/v1/read | Reads admissionregistration.k8s.io/v1 |
> | Microsoft.ContainerService/managedClusters/apis/admissionregistration.k8s.io/v1beta1/read | Reads admissionregistration.k8s.io/v1beta1 |
> | Microsoft.ContainerService/managedClusters/apis/apiextensions.k8s.io/read | Reads apiextensions.k8s.io |
> | Microsoft.ContainerService/managedClusters/apis/apiextensions.k8s.io/v1/read | Reads apiextensions.k8s.io/v1 |
> | Microsoft.ContainerService/managedClusters/apis/apiextensions.k8s.io/v1beta1/read | Reads apiextensions.k8s.io/v1beta1 |
> | Microsoft.ContainerService/managedClusters/apis/apiregistration.k8s.io/read | Reads apiregistration.k8s.io |
> | Microsoft.ContainerService/managedClusters/apis/apiregistration.k8s.io/v1/read | Reads apiregistration.k8s.io/v1 |
> | Microsoft.ContainerService/managedClusters/apis/apiregistration.k8s.io/v1beta1/read | Reads apiregistration.k8s.io/v1beta1 |
> | Microsoft.ContainerService/managedClusters/apis/apps/read | Reads apps |
> | Microsoft.ContainerService/managedClusters/apis/apps/v1/read | Reads apps/v1 |
> | Microsoft.ContainerService/managedClusters/apis/apps/v1beta1/read | Reads apps/v1beta1 |
> | Microsoft.ContainerService/managedClusters/apis/apps/v1beta2/read | Reads apps/v1beta2 |
> | Microsoft.ContainerService/managedClusters/apis/authentication.k8s.io/read | Reads authentication.k8s.io |
> | Microsoft.ContainerService/managedClusters/apis/authentication.k8s.io/v1/read | Reads authentication.k8s.io/v1 |
> | Microsoft.ContainerService/managedClusters/apis/authentication.k8s.io/v1beta1/read | Reads authentication.k8s.io/v1beta1 |
> | Microsoft.ContainerService/managedClusters/apis/authorization.k8s.io/read | Reads authorization.k8s.io |
> | Microsoft.ContainerService/managedClusters/apis/authorization.k8s.io/v1/read | Reads authorization.k8s.io/v1 |
> | Microsoft.ContainerService/managedClusters/apis/authorization.k8s.io/v1beta1/read | Reads authorization.k8s.io/v1beta1 |
> | Microsoft.ContainerService/managedClusters/apis/autoscaling/read | Reads autoscaling |
> | Microsoft.ContainerService/managedClusters/apis/autoscaling/v1/read | Reads autoscaling/v1 |
> | Microsoft.ContainerService/managedClusters/apis/autoscaling/v2beta1/read | Reads autoscaling/v2beta1 |
> | Microsoft.ContainerService/managedClusters/apis/autoscaling/v2beta2/read | Reads autoscaling/v2beta2 |
> | Microsoft.ContainerService/managedClusters/apis/batch/read | Reads batch |
> | Microsoft.ContainerService/managedClusters/apis/batch/v1/read | Reads batch/v1 |
> | Microsoft.ContainerService/managedClusters/apis/batch/v1beta1/read | Reads batch/v1beta1 |
> | Microsoft.ContainerService/managedClusters/apis/certificates.k8s.io/read | Reads certificates.k8s.io |
> | Microsoft.ContainerService/managedClusters/apis/certificates.k8s.io/v1beta1/read | Reads certificates.k8s.io/v1beta1 |
> | Microsoft.ContainerService/managedClusters/apis/coordination.k8s.io/read | Reads coordination.k8s.io |
> | Microsoft.ContainerService/managedClusters/apis/coordination.k8s.io/v1/read | Reads coordination/v1 |
> | Microsoft.ContainerService/managedClusters/apis/coordination.k8s.io/v1beta1/read | Reads coordination.k8s.io/v1beta1 |
> | Microsoft.ContainerService/managedClusters/apis/events.k8s.io/read | Reads events.k8s.io |
> | Microsoft.ContainerService/managedClusters/apis/events.k8s.io/v1beta1/read | Reads events.k8s.io/v1beta1 |
> | Microsoft.ContainerService/managedClusters/apis/extensions/read | Reads extensions |
> | Microsoft.ContainerService/managedClusters/apis/extensions/v1beta1/read | Reads extensions/v1beta1 |
> | Microsoft.ContainerService/managedClusters/apis/metrics.k8s.io/read | Reads metrics.k8s.io |
> | Microsoft.ContainerService/managedClusters/apis/metrics.k8s.io/v1beta1/read | Reads metrics.k8s.io/v1beta1 |
> | Microsoft.ContainerService/managedClusters/apis/networking.k8s.io/read | Reads networking.k8s.io |
> | Microsoft.ContainerService/managedClusters/apis/networking.k8s.io/v1/read | Reads networking/v1 |
> | Microsoft.ContainerService/managedClusters/apis/networking.k8s.io/v1beta1/read | Reads networking.k8s.io/v1beta1 |
> | Microsoft.ContainerService/managedClusters/apis/node.k8s.io/read | Reads node.k8s.io |
> | Microsoft.ContainerService/managedClusters/apis/node.k8s.io/v1beta1/read | Reads node.k8s.io/v1beta1 |
> | Microsoft.ContainerService/managedClusters/apis/policy/read | Reads policy |
> | Microsoft.ContainerService/managedClusters/apis/policy/v1beta1/read | Reads policy/v1beta1 |
> | Microsoft.ContainerService/managedClusters/apis/rbac.authorization.k8s.io/read | Reads rbac.authorization.k8s.io |
> | Microsoft.ContainerService/managedClusters/apis/rbac.authorization.k8s.io/v1/read | Reads rbac.authorization/v1 |
> | Microsoft.ContainerService/managedClusters/apis/rbac.authorization.k8s.io/v1beta1/read | Reads rbac.authorization.k8s.io/v1beta1 |
> | Microsoft.ContainerService/managedClusters/apis/scheduling.k8s.io/read | Reads scheduling.k8s.io |
> | Microsoft.ContainerService/managedClusters/apis/scheduling.k8s.io/v1/read | Reads scheduling/v1 |
> | Microsoft.ContainerService/managedClusters/apis/scheduling.k8s.io/v1beta1/read | Reads scheduling.k8s.io/v1beta1 |
> | Microsoft.ContainerService/managedClusters/apis/storage.k8s.io/read | Reads storage.k8s.io |
> | Microsoft.ContainerService/managedClusters/apis/storage.k8s.io/v1/read | Reads storage/v1 |
> | Microsoft.ContainerService/managedClusters/apis/storage.k8s.io/v1beta1/read | Reads storage.k8s.io/v1beta1 |
> | Microsoft.ContainerService/managedClusters/apps/controllerrevisions/read | Reads controllerrevisions |
> | Microsoft.ContainerService/managedClusters/apps/controllerrevisions/write | Writes controllerrevisions |
> | Microsoft.ContainerService/managedClusters/apps/controllerrevisions/delete | Deletes controllerrevisions |
> | Microsoft.ContainerService/managedClusters/apps/daemonsets/read | Reads daemonsets |
> | Microsoft.ContainerService/managedClusters/apps/daemonsets/write | Writes daemonsets |
> | Microsoft.ContainerService/managedClusters/apps/daemonsets/delete | Deletes daemonsets |
> | Microsoft.ContainerService/managedClusters/apps/deployments/read | Reads deployments |
> | Microsoft.ContainerService/managedClusters/apps/deployments/write | Writes deployments |
> | Microsoft.ContainerService/managedClusters/apps/deployments/delete | Deletes deployments |
> | Microsoft.ContainerService/managedClusters/apps/replicasets/read | Reads replicasets |
> | Microsoft.ContainerService/managedClusters/apps/replicasets/write | Writes replicasets |
> | Microsoft.ContainerService/managedClusters/apps/replicasets/delete | Deletes replicasets |
> | Microsoft.ContainerService/managedClusters/apps/statefulsets/read | Reads statefulsets |
> | Microsoft.ContainerService/managedClusters/apps/statefulsets/write | Writes statefulsets |
> | Microsoft.ContainerService/managedClusters/apps/statefulsets/delete | Deletes statefulsets |
> | Microsoft.ContainerService/managedClusters/authentication.k8s.io/tokenreviews/write | Writes tokenreviews |
> | Microsoft.ContainerService/managedClusters/authentication.k8s.io/userextras/impersonate/action | Impersonate userextras |
> | Microsoft.ContainerService/managedClusters/authorization.k8s.io/localsubjectaccessreviews/write | Writes localsubjectaccessreviews |
> | Microsoft.ContainerService/managedClusters/authorization.k8s.io/selfsubjectaccessreviews/write | Writes selfsubjectaccessreviews |
> | Microsoft.ContainerService/managedClusters/authorization.k8s.io/selfsubjectrulesreviews/write | Writes selfsubjectrulesreviews |
> | Microsoft.ContainerService/managedClusters/authorization.k8s.io/subjectaccessreviews/write | Writes subjectaccessreviews |
> | Microsoft.ContainerService/managedClusters/autoscaling/horizontalpodautoscalers/read | Reads horizontalpodautoscalers |
> | Microsoft.ContainerService/managedClusters/autoscaling/horizontalpodautoscalers/write | Writes horizontalpodautoscalers |
> | Microsoft.ContainerService/managedClusters/autoscaling/horizontalpodautoscalers/delete | Deletes horizontalpodautoscalers |
> | Microsoft.ContainerService/managedClusters/batch/cronjobs/read | Reads cronjobs |
> | Microsoft.ContainerService/managedClusters/batch/cronjobs/write | Writes cronjobs |
> | Microsoft.ContainerService/managedClusters/batch/cronjobs/delete | Deletes cronjobs |
> | Microsoft.ContainerService/managedClusters/batch/jobs/read | Reads jobs |
> | Microsoft.ContainerService/managedClusters/batch/jobs/write | Writes jobs |
> | Microsoft.ContainerService/managedClusters/batch/jobs/delete | Deletes jobs |
> | Microsoft.ContainerService/managedClusters/bindings/write | Writes bindings |
> | Microsoft.ContainerService/managedClusters/certificates.k8s.io/certificatesigningrequests/read | Reads certificatesigningrequests |
> | Microsoft.ContainerService/managedClusters/certificates.k8s.io/certificatesigningrequests/write | Writes certificatesigningrequests |
> | Microsoft.ContainerService/managedClusters/certificates.k8s.io/certificatesigningrequests/delete | Deletes certificatesigningrequests |
> | Microsoft.ContainerService/managedClusters/componentstatuses/read | Reads componentstatuses |
> | Microsoft.ContainerService/managedClusters/componentstatuses/write | Writes componentstatuses |
> | Microsoft.ContainerService/managedClusters/componentstatuses/delete | Deletes componentstatuses |
> | Microsoft.ContainerService/managedClusters/configmaps/read | Reads configmaps |
> | Microsoft.ContainerService/managedClusters/configmaps/write | Writes configmaps |
> | Microsoft.ContainerService/managedClusters/configmaps/delete | Deletes configmaps |
> | Microsoft.ContainerService/managedClusters/coordination.k8s.io/leases/read | Reads leases |
> | Microsoft.ContainerService/managedClusters/coordination.k8s.io/leases/write | Writes leases |
> | Microsoft.ContainerService/managedClusters/coordination.k8s.io/leases/delete | Deletes leases |
> | Microsoft.ContainerService/managedClusters/discovery.k8s.io/endpointslices/read | Reads endpointslices |
> | Microsoft.ContainerService/managedClusters/discovery.k8s.io/endpointslices/write | Writes endpointslices |
> | Microsoft.ContainerService/managedClusters/discovery.k8s.io/endpointslices/delete | Deletes endpointslices |
> | Microsoft.ContainerService/managedClusters/endpoints/read | Reads endpoints |
> | Microsoft.ContainerService/managedClusters/endpoints/write | Writes endpoints |
> | Microsoft.ContainerService/managedClusters/endpoints/delete | Deletes endpoints |
> | Microsoft.ContainerService/managedClusters/events/read | Reads events |
> | Microsoft.ContainerService/managedClusters/events/write | Writes events |
> | Microsoft.ContainerService/managedClusters/events/delete | Deletes events |
> | Microsoft.ContainerService/managedClusters/events.k8s.io/events/read | Reads events |
> | Microsoft.ContainerService/managedClusters/events.k8s.io/events/write | Writes events |
> | Microsoft.ContainerService/managedClusters/events.k8s.io/events/delete | Deletes events |
> | Microsoft.ContainerService/managedClusters/extensions/daemonsets/read | Reads daemonsets |
> | Microsoft.ContainerService/managedClusters/extensions/daemonsets/write | Writes daemonsets |
> | Microsoft.ContainerService/managedClusters/extensions/daemonsets/delete | Deletes daemonsets |
> | Microsoft.ContainerService/managedClusters/extensions/deployments/read | Reads deployments |
> | Microsoft.ContainerService/managedClusters/extensions/deployments/write | Writes deployments |
> | Microsoft.ContainerService/managedClusters/extensions/deployments/delete | Deletes deployments |
> | Microsoft.ContainerService/managedClusters/extensions/ingresses/read | Reads ingresses |
> | Microsoft.ContainerService/managedClusters/extensions/ingresses/write | Writes ingresses |
> | Microsoft.ContainerService/managedClusters/extensions/ingresses/delete | Deletes ingresses |
> | Microsoft.ContainerService/managedClusters/extensions/networkpolicies/read | Reads networkpolicies |
> | Microsoft.ContainerService/managedClusters/extensions/networkpolicies/write | Writes networkpolicies |
> | Microsoft.ContainerService/managedClusters/extensions/networkpolicies/delete | Deletes networkpolicies |
> | Microsoft.ContainerService/managedClusters/extensions/podsecuritypolicies/read | Reads podsecuritypolicies |
> | Microsoft.ContainerService/managedClusters/extensions/podsecuritypolicies/write | Writes podsecuritypolicies |
> | Microsoft.ContainerService/managedClusters/extensions/podsecuritypolicies/delete | Deletes podsecuritypolicies |
> | Microsoft.ContainerService/managedClusters/extensions/replicasets/read | Reads replicasets |
> | Microsoft.ContainerService/managedClusters/extensions/replicasets/write | Writes replicasets |
> | Microsoft.ContainerService/managedClusters/extensions/replicasets/delete | Deletes replicasets |
> | Microsoft.ContainerService/managedClusters/flowcontrol.apiserver.k8s.io/flowschemas/read | Reads flowschemas |
> | Microsoft.ContainerService/managedClusters/flowcontrol.apiserver.k8s.io/flowschemas/write | Writes flowschemas |
> | Microsoft.ContainerService/managedClusters/flowcontrol.apiserver.k8s.io/flowschemas/delete | Deletes flowschemas |
> | Microsoft.ContainerService/managedClusters/flowcontrol.apiserver.k8s.io/prioritylevelconfigurations/read | Reads prioritylevelconfigurations |
> | Microsoft.ContainerService/managedClusters/flowcontrol.apiserver.k8s.io/prioritylevelconfigurations/write | Writes prioritylevelconfigurations |
> | Microsoft.ContainerService/managedClusters/flowcontrol.apiserver.k8s.io/prioritylevelconfigurations/delete | Deletes prioritylevelconfigurations |
> | Microsoft.ContainerService/managedClusters/groups/impersonate/action | Impersonate groups |
> | Microsoft.ContainerService/managedClusters/healthz/read | Reads healthz |
> | Microsoft.ContainerService/managedClusters/healthz/autoregister-completion/read | Reads autoregister-completion |
> | Microsoft.ContainerService/managedClusters/healthz/etcd/read | Reads etcd |
> | Microsoft.ContainerService/managedClusters/healthz/log/read | Reads log |
> | Microsoft.ContainerService/managedClusters/healthz/ping/read | Reads ping |
> | Microsoft.ContainerService/managedClusters/healthz/poststarthook/apiservice-openapi-controller/read | Reads apiservice-openapi-controller |
> | Microsoft.ContainerService/managedClusters/healthz/poststarthook/apiservice-registration-controller/read | Reads apiservice-registration-controller |
> | Microsoft.ContainerService/managedClusters/healthz/poststarthook/apiservice-status-available-controller/read | Reads apiservice-status-available-controller |
> | Microsoft.ContainerService/managedClusters/healthz/poststarthook/bootstrap-controller/read | Reads bootstrap-controller |
> | Microsoft.ContainerService/managedClusters/healthz/poststarthook/ca-registration/read | Reads ca-registration |
> | Microsoft.ContainerService/managedClusters/healthz/poststarthook/crd-informer-synced/read | Reads crd-informer-synced |
> | Microsoft.ContainerService/managedClusters/healthz/poststarthook/generic-apiserver-start-informers/read | Reads generic-apiserver-start-informers |
> | Microsoft.ContainerService/managedClusters/healthz/poststarthook/kube-apiserver-autoregistration/read | Reads kube-apiserver-autoregistration |
> | Microsoft.ContainerService/managedClusters/healthz/poststarthook/rbac/bootstrap-roles/read | Reads bootstrap-roles |
> | Microsoft.ContainerService/managedClusters/healthz/poststarthook/scheduling/bootstrap-system-priority-classes/read | Reads bootstrap-system-priority-classes |
> | Microsoft.ContainerService/managedClusters/healthz/poststarthook/start-apiextensions-controllers/read | Reads start-apiextensions-controllers |
> | Microsoft.ContainerService/managedClusters/healthz/poststarthook/start-apiextensions-informers/read | Reads start-apiextensions-informers |
> | Microsoft.ContainerService/managedClusters/healthz/poststarthook/start-kube-aggregator-informers/read | Reads start-kube-aggregator-informers |
> | Microsoft.ContainerService/managedClusters/healthz/poststarthook/start-kube-apiserver-admission-initializer/read | Reads start-kube-apiserver-admission-initializer |
> | Microsoft.ContainerService/managedClusters/limitranges/read | Reads limitranges |
> | Microsoft.ContainerService/managedClusters/limitranges/write | Writes limitranges |
> | Microsoft.ContainerService/managedClusters/limitranges/delete | Deletes limitranges |
> | Microsoft.ContainerService/managedClusters/livez/read | Reads livez |
> | Microsoft.ContainerService/managedClusters/livez/autoregister-completion/read | Reads autoregister-completion |
> | Microsoft.ContainerService/managedClusters/livez/etcd/read | Reads etcd |
> | Microsoft.ContainerService/managedClusters/livez/log/read | Reads log |
> | Microsoft.ContainerService/managedClusters/livez/ping/read | Reads ping |
> | Microsoft.ContainerService/managedClusters/livez/poststarthook/apiservice-openapi-controller/read | Reads apiservice-openapi-controller |
> | Microsoft.ContainerService/managedClusters/livez/poststarthook/apiservice-registration-controller/read | Reads apiservice-registration-controller |
> | Microsoft.ContainerService/managedClusters/livez/poststarthook/apiservice-status-available-controller/read | Reads apiservice-status-available-controller |
> | Microsoft.ContainerService/managedClusters/livez/poststarthook/bootstrap-controller/read | Reads bootstrap-controller |
> | Microsoft.ContainerService/managedClusters/livez/poststarthook/ca-registration/read | Reads ca-registration |
> | Microsoft.ContainerService/managedClusters/livez/poststarthook/crd-informer-synced/read | Reads crd-informer-synced |
> | Microsoft.ContainerService/managedClusters/livez/poststarthook/generic-apiserver-start-informers/read | Reads generic-apiserver-start-informers |
> | Microsoft.ContainerService/managedClusters/livez/poststarthook/kube-apiserver-autoregistration/read | Reads kube-apiserver-autoregistration |
> | Microsoft.ContainerService/managedClusters/livez/poststarthook/rbac/bootstrap-roles/read | Reads bootstrap-roles |
> | Microsoft.ContainerService/managedClusters/livez/poststarthook/scheduling/bootstrap-system-priority-classes/read | Reads bootstrap-system-priority-classes |
> | Microsoft.ContainerService/managedClusters/livez/poststarthook/start-apiextensions-controllers/read | Reads start-apiextensions-controllers |
> | Microsoft.ContainerService/managedClusters/livez/poststarthook/start-apiextensions-informers/read | Reads start-apiextensions-informers |
> | Microsoft.ContainerService/managedClusters/livez/poststarthook/start-kube-aggregator-informers/read | Reads start-kube-aggregator-informers |
> | Microsoft.ContainerService/managedClusters/livez/poststarthook/start-kube-apiserver-admission-initializer/read | Reads start-kube-apiserver-admission-initializer |
> | Microsoft.ContainerService/managedClusters/logs/read | Reads logs |
> | Microsoft.ContainerService/managedClusters/metrics/read | Reads metrics |
> | Microsoft.ContainerService/managedClusters/metrics.k8s.io/nodes/read | Reads nodes |
> | Microsoft.ContainerService/managedClusters/metrics.k8s.io/pods/read | Reads pods |
> | Microsoft.ContainerService/managedClusters/namespaces/read | Reads namespaces |
> | Microsoft.ContainerService/managedClusters/namespaces/write | Writes namespaces |
> | Microsoft.ContainerService/managedClusters/namespaces/delete | Deletes namespaces |
> | Microsoft.ContainerService/managedClusters/networking.k8s.io/ingressclasses/read | Reads ingressclasses |
> | Microsoft.ContainerService/managedClusters/networking.k8s.io/ingressclasses/write | Writes ingressclasses |
> | Microsoft.ContainerService/managedClusters/networking.k8s.io/ingressclasses/delete | Deletes ingressclasses |
> | Microsoft.ContainerService/managedClusters/networking.k8s.io/ingresses/read | Reads ingresses |
> | Microsoft.ContainerService/managedClusters/networking.k8s.io/ingresses/write | Writes ingresses |
> | Microsoft.ContainerService/managedClusters/networking.k8s.io/ingresses/delete | Deletes ingresses |
> | Microsoft.ContainerService/managedClusters/networking.k8s.io/networkpolicies/read | Reads networkpolicies |
> | Microsoft.ContainerService/managedClusters/networking.k8s.io/networkpolicies/write | Writes networkpolicies |
> | Microsoft.ContainerService/managedClusters/networking.k8s.io/networkpolicies/delete | Deletes networkpolicies |
> | Microsoft.ContainerService/managedClusters/node.k8s.io/runtimeclasses/read | Reads runtimeclasses |
> | Microsoft.ContainerService/managedClusters/node.k8s.io/runtimeclasses/write | Writes runtimeclasses |
> | Microsoft.ContainerService/managedClusters/node.k8s.io/runtimeclasses/delete | Deletes runtimeclasses |
> | Microsoft.ContainerService/managedClusters/nodes/read | Reads nodes |
> | Microsoft.ContainerService/managedClusters/nodes/write | Writes nodes |
> | Microsoft.ContainerService/managedClusters/nodes/delete | Deletes nodes |
> | Microsoft.ContainerService/managedClusters/openapi/v2/read | Reads v2 |
> | Microsoft.ContainerService/managedClusters/persistentvolumeclaims/read | Reads persistentvolumeclaims |
> | Microsoft.ContainerService/managedClusters/persistentvolumeclaims/write | Writes persistentvolumeclaims |
> | Microsoft.ContainerService/managedClusters/persistentvolumeclaims/delete | Deletes persistentvolumeclaims |
> | Microsoft.ContainerService/managedClusters/persistentvolumes/read | Reads persistentvolumes |
> | Microsoft.ContainerService/managedClusters/persistentvolumes/write | Writes persistentvolumes |
> | Microsoft.ContainerService/managedClusters/persistentvolumes/delete | Deletes persistentvolumes |
> | Microsoft.ContainerService/managedClusters/pods/read | Reads pods |
> | Microsoft.ContainerService/managedClusters/pods/write | Writes pods |
> | Microsoft.ContainerService/managedClusters/pods/delete | Deletes pods |
> | Microsoft.ContainerService/managedClusters/pods/exec/action | Exec into pods resource |
> | Microsoft.ContainerService/managedClusters/podtemplates/read | Reads podtemplates |
> | Microsoft.ContainerService/managedClusters/podtemplates/write | Writes podtemplates |
> | Microsoft.ContainerService/managedClusters/podtemplates/delete | Deletes podtemplates |
> | Microsoft.ContainerService/managedClusters/policy/poddisruptionbudgets/read | Reads poddisruptionbudgets |
> | Microsoft.ContainerService/managedClusters/policy/poddisruptionbudgets/write | Writes poddisruptionbudgets |
> | Microsoft.ContainerService/managedClusters/policy/poddisruptionbudgets/delete | Deletes poddisruptionbudgets |
> | Microsoft.ContainerService/managedClusters/policy/podsecuritypolicies/read | Reads podsecuritypolicies |
> | Microsoft.ContainerService/managedClusters/policy/podsecuritypolicies/write | Writes podsecuritypolicies |
> | Microsoft.ContainerService/managedClusters/policy/podsecuritypolicies/delete | Deletes podsecuritypolicies |
> | Microsoft.ContainerService/managedClusters/policy/podsecuritypolicies/use/action | Use action on podsecuritypolicies |
> | Microsoft.ContainerService/managedClusters/rbac.authorization.k8s.io/clusterrolebindings/read | Reads clusterrolebindings |
> | Microsoft.ContainerService/managedClusters/rbac.authorization.k8s.io/clusterrolebindings/write | Writes clusterrolebindings |
> | Microsoft.ContainerService/managedClusters/rbac.authorization.k8s.io/clusterrolebindings/delete | Deletes clusterrolebindings |
> | Microsoft.ContainerService/managedClusters/rbac.authorization.k8s.io/clusterroles/read | Reads clusterroles |
> | Microsoft.ContainerService/managedClusters/rbac.authorization.k8s.io/clusterroles/write | Writes clusterroles |
> | Microsoft.ContainerService/managedClusters/rbac.authorization.k8s.io/clusterroles/delete | Deletes clusterroles |
> | Microsoft.ContainerService/managedClusters/rbac.authorization.k8s.io/clusterroles/bind/action | Binds clusterroles |
> | Microsoft.ContainerService/managedClusters/rbac.authorization.k8s.io/clusterroles/escalate/action | Escalates |
> | Microsoft.ContainerService/managedClusters/rbac.authorization.k8s.io/rolebindings/read | Reads rolebindings |
> | Microsoft.ContainerService/managedClusters/rbac.authorization.k8s.io/rolebindings/write | Writes rolebindings |
> | Microsoft.ContainerService/managedClusters/rbac.authorization.k8s.io/rolebindings/delete | Deletes rolebindings |
> | Microsoft.ContainerService/managedClusters/rbac.authorization.k8s.io/roles/read | Reads roles |
> | Microsoft.ContainerService/managedClusters/rbac.authorization.k8s.io/roles/write | Writes roles |
> | Microsoft.ContainerService/managedClusters/rbac.authorization.k8s.io/roles/delete | Deletes roles |
> | Microsoft.ContainerService/managedClusters/rbac.authorization.k8s.io/roles/bind/action | Binds roles |
> | Microsoft.ContainerService/managedClusters/rbac.authorization.k8s.io/roles/escalate/action | Escalates roles |
> | Microsoft.ContainerService/managedClusters/readyz/read | Reads readyz |
> | Microsoft.ContainerService/managedClusters/readyz/autoregister-completion/read | Reads autoregister-completion |
> | Microsoft.ContainerService/managedClusters/readyz/etcd/read | Reads etcd |
> | Microsoft.ContainerService/managedClusters/readyz/log/read | Reads log |
> | Microsoft.ContainerService/managedClusters/readyz/ping/read | Reads ping |
> | Microsoft.ContainerService/managedClusters/readyz/poststarthook/apiservice-openapi-controller/read | Reads apiservice-openapi-controller |
> | Microsoft.ContainerService/managedClusters/readyz/poststarthook/apiservice-registration-controller/read | Reads apiservice-registration-controller |
> | Microsoft.ContainerService/managedClusters/readyz/poststarthook/apiservice-status-available-controller/read | Reads apiservice-status-available-controller |
> | Microsoft.ContainerService/managedClusters/readyz/poststarthook/bootstrap-controller/read | Reads bootstrap-controller |
> | Microsoft.ContainerService/managedClusters/readyz/poststarthook/ca-registration/read | Reads ca-registration |
> | Microsoft.ContainerService/managedClusters/readyz/poststarthook/crd-informer-synced/read | Reads crd-informer-synced |
> | Microsoft.ContainerService/managedClusters/readyz/poststarthook/generic-apiserver-start-informers/read | Reads generic-apiserver-start-informers |
> | Microsoft.ContainerService/managedClusters/readyz/poststarthook/kube-apiserver-autoregistration/read | Reads kube-apiserver-autoregistration |
> | Microsoft.ContainerService/managedClusters/readyz/poststarthook/rbac/bootstrap-roles/read | Reads bootstrap-roles |
> | Microsoft.ContainerService/managedClusters/readyz/poststarthook/scheduling/bootstrap-system-priority-classes/read | Reads bootstrap-system-priority-classes |
> | Microsoft.ContainerService/managedClusters/readyz/poststarthook/start-apiextensions-controllers/read | Reads start-apiextensions-controllers |
> | Microsoft.ContainerService/managedClusters/readyz/poststarthook/start-apiextensions-informers/read | Reads start-apiextensions-informers |
> | Microsoft.ContainerService/managedClusters/readyz/poststarthook/start-kube-aggregator-informers/read | Reads start-kube-aggregator-informers |
> | Microsoft.ContainerService/managedClusters/readyz/poststarthook/start-kube-apiserver-admission-initializer/read | Reads start-kube-apiserver-admission-initializer |
> | Microsoft.ContainerService/managedClusters/readyz/shutdown/read | Reads shutdown |
> | Microsoft.ContainerService/managedClusters/replicationcontrollers/read | Reads replicationcontrollers |
> | Microsoft.ContainerService/managedClusters/replicationcontrollers/write | Writes replicationcontrollers |
> | Microsoft.ContainerService/managedClusters/replicationcontrollers/delete | Deletes replicationcontrollers |
> | Microsoft.ContainerService/managedClusters/resetMetrics/read | Reads resetMetrics |
> | Microsoft.ContainerService/managedClusters/resourcequotas/read | Reads resourcequotas |
> | Microsoft.ContainerService/managedClusters/resourcequotas/write | Writes resourcequotas |
> | Microsoft.ContainerService/managedClusters/resourcequotas/delete | Deletes resourcequotas |
> | Microsoft.ContainerService/managedClusters/scheduling.k8s.io/priorityclasses/read | Reads priorityclasses |
> | Microsoft.ContainerService/managedClusters/scheduling.k8s.io/priorityclasses/write | Writes priorityclasses |
> | Microsoft.ContainerService/managedClusters/scheduling.k8s.io/priorityclasses/delete | Deletes priorityclasses |
> | Microsoft.ContainerService/managedClusters/secrets/read | Reads secrets |
> | Microsoft.ContainerService/managedClusters/secrets/write | Writes secrets |
> | Microsoft.ContainerService/managedClusters/secrets/delete | Deletes secrets |
> | Microsoft.ContainerService/managedClusters/serviceaccounts/read | Reads serviceaccounts |
> | Microsoft.ContainerService/managedClusters/serviceaccounts/write | Writes serviceaccounts |
> | Microsoft.ContainerService/managedClusters/serviceaccounts/delete | Deletes serviceaccounts |
> | Microsoft.ContainerService/managedClusters/serviceaccounts/impersonate/action | Impersonate serviceaccounts |
> | Microsoft.ContainerService/managedClusters/services/read | Reads services |
> | Microsoft.ContainerService/managedClusters/services/write | Writes services |
> | Microsoft.ContainerService/managedClusters/services/delete | Deletes services |
> | Microsoft.ContainerService/managedClusters/storage.k8s.io/csidrivers/read | Reads csidrivers |
> | Microsoft.ContainerService/managedClusters/storage.k8s.io/csidrivers/write | Writes csidrivers |
> | Microsoft.ContainerService/managedClusters/storage.k8s.io/csidrivers/delete | Deletes csidrivers |
> | Microsoft.ContainerService/managedClusters/storage.k8s.io/csinodes/read | Reads csinodes |
> | Microsoft.ContainerService/managedClusters/storage.k8s.io/csinodes/write | Writes csinodes |
> | Microsoft.ContainerService/managedClusters/storage.k8s.io/csinodes/delete | Deletes csinodes |
> | Microsoft.ContainerService/managedClusters/storage.k8s.io/csistoragecapacities/read | Reads csistoragecapacities |
> | Microsoft.ContainerService/managedClusters/storage.k8s.io/csistoragecapacities/write | Writes csistoragecapacities |
> | Microsoft.ContainerService/managedClusters/storage.k8s.io/csistoragecapacities/delete | Deletes csistoragecapacities |
> | Microsoft.ContainerService/managedClusters/storage.k8s.io/storageclasses/read | Reads storageclasses |
> | Microsoft.ContainerService/managedClusters/storage.k8s.io/storageclasses/write | Writes storageclasses |
> | Microsoft.ContainerService/managedClusters/storage.k8s.io/storageclasses/delete | Deletes storageclasses |
> | Microsoft.ContainerService/managedClusters/storage.k8s.io/volumeattachments/read | Reads volumeattachments |
> | Microsoft.ContainerService/managedClusters/storage.k8s.io/volumeattachments/write | Writes volumeattachments |
> | Microsoft.ContainerService/managedClusters/storage.k8s.io/volumeattachments/delete | Deletes volumeattachments |
> | Microsoft.ContainerService/managedClusters/swagger-api/read | Reads swagger-api |
> | Microsoft.ContainerService/managedClusters/swagger-ui/read | Reads swagger-ui |
> | Microsoft.ContainerService/managedClusters/ui/read | Reads ui |
> | Microsoft.ContainerService/managedClusters/users/impersonate/action | Impersonate users |
> | Microsoft.ContainerService/managedClusters/version/read | Reads version |

### Microsoft.RedHatOpenShift

Azure service: [Azure Red Hat OpenShift](../../../openshift/index.yml)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.RedHatOpenShift/locations/listInstallVersions/read |  |
> | Microsoft.RedHatOpenShift/locations/operationresults/read |  |
> | Microsoft.RedHatOpenShift/locations/operationsstatus/read |  |
> | Microsoft.RedHatOpenShift/openShiftClusters/read |  |
> | Microsoft.RedHatOpenShift/openShiftClusters/write |  |
> | Microsoft.RedHatOpenShift/openShiftClusters/delete |  |
> | Microsoft.RedHatOpenShift/openShiftClusters/listCredentials/action |  |
> | Microsoft.RedHatOpenShift/openShiftClusters/listAdminCredentials/action |  |
> | Microsoft.RedHatOpenShift/openShiftClusters/detectors/read |  |
> | Microsoft.RedHatOpenShift/openShiftClusters/machinePools/read |  |
> | Microsoft.RedHatOpenShift/openShiftClusters/machinePools/write |  |
> | Microsoft.RedHatOpenShift/openShiftClusters/machinePools/delete |  |
> | Microsoft.RedHatOpenShift/openShiftClusters/syncIdentityProviders/read |  |
> | Microsoft.RedHatOpenShift/openShiftClusters/syncIdentityProviders/write |  |
> | Microsoft.RedHatOpenShift/openShiftClusters/syncIdentityProviders/delete |  |
> | Microsoft.RedHatOpenShift/openShiftClusters/syncSets/read |  |
> | Microsoft.RedHatOpenShift/openShiftClusters/syncSets/write |  |
> | Microsoft.RedHatOpenShift/openShiftClusters/syncSets/delete |  |
> | Microsoft.RedHatOpenShift/operations/read |  |

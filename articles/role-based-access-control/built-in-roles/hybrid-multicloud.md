---
title: Azure built-in roles for Hybrid + multicloud - Azure RBAC
description: This article lists the Azure built-in roles for Azure role-based access control (Azure RBAC) in the Hybrid + multicloud category. It lists Actions, NotActions, DataActions, and NotDataActions.
ms.service: role-based-access-control
ms.topic: reference
ms.workload: identity
author: rolyon
manager: amycolannino
ms.author: rolyon
ms.date: 04/25/2024
ms.custom: generated
---

# Azure built-in roles for Hybrid + multicloud

This article lists the Azure built-in roles in the Hybrid + multicloud category.


## Azure Resource Bridge Deployment Role

Azure Resource Bridge Deployment Role

[Learn more](/azure-stack/hci/deploy/deployment-azure-resource-manager-template)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/roleassignments/read | Get information about a role assignment. |
> | [Microsoft.AzureStackHCI](../permissions/hybrid-multicloud.md#microsoftazurestackhci)/Register/Action | Registers the subscription for the Azure Stack HCI resource provider and enables the creation of Azure Stack HCI resources. |
> | [Microsoft.ResourceConnector](../permissions/hybrid-multicloud.md#microsoftresourceconnector)/register/action | Registers the subscription for Appliances resource provider and enables the creation of Appliance. |
> | [Microsoft.ResourceConnector](../permissions/hybrid-multicloud.md#microsoftresourceconnector)/appliances/read | Gets an Appliance resource |
> | [Microsoft.ResourceConnector](../permissions/hybrid-multicloud.md#microsoftresourceconnector)/appliances/write | Creates or Updates Appliance resource |
> | [Microsoft.ResourceConnector](../permissions/hybrid-multicloud.md#microsoftresourceconnector)/appliances/delete | Deletes Appliance resource |
> | [Microsoft.ResourceConnector](../permissions/hybrid-multicloud.md#microsoftresourceconnector)/locations/operationresults/read | Get result of Appliance operation |
> | [Microsoft.ResourceConnector](../permissions/hybrid-multicloud.md#microsoftresourceconnector)/locations/operationsstatus/read | Get result of Appliance operation |
> | [Microsoft.ResourceConnector](../permissions/hybrid-multicloud.md#microsoftresourceconnector)/appliances/listClusterUserCredential/action | Get an appliance cluster user credential |
> | [Microsoft.ResourceConnector](../permissions/hybrid-multicloud.md#microsoftresourceconnector)/appliances/listKeys/action | Get an appliance cluster customer user keys |
> | [Microsoft.ResourceConnector](../permissions/hybrid-multicloud.md#microsoftresourceconnector)/appliances/upgradeGraphs/read | Gets the upgrade graph of Appliance cluster |
> | [Microsoft.ResourceConnector](../permissions/hybrid-multicloud.md#microsoftresourceconnector)/telemetryconfig/read | Get Appliances telemetry config utilized by Appliances CLI |
> | [Microsoft.ResourceConnector](../permissions/hybrid-multicloud.md#microsoftresourceconnector)/operations/read | Gets list of Available Operations for Appliances |
> | [Microsoft.ExtendedLocation](../permissions/hybrid-multicloud.md#microsoftextendedlocation)/register/action | Registers the subscription for Custom Location resource provider and enables the creation of Custom Location. |
> | [Microsoft.ExtendedLocation](../permissions/hybrid-multicloud.md#microsoftextendedlocation)/customLocations/deploy/action | Deploy permissions to a Custom Location resource |
> | [Microsoft.ExtendedLocation](../permissions/hybrid-multicloud.md#microsoftextendedlocation)/customLocations/read | Gets an Custom Location resource |
> | [Microsoft.ExtendedLocation](../permissions/hybrid-multicloud.md#microsoftextendedlocation)/customLocations/write | Creates or Updates Custom Location resource |
> | [Microsoft.ExtendedLocation](../permissions/hybrid-multicloud.md#microsoftextendedlocation)/customLocations/delete | Deletes Custom Location resource |
> | [Microsoft.HybridConnectivity](../permissions/hybrid-multicloud.md#microsofthybridconnectivity)/register/action | Register the subscription for Microsoft.HybridConnectivity |
> | [Microsoft.Kubernetes](../permissions/hybrid-multicloud.md#microsoftkubernetes)/register/action | Registers Subscription with Microsoft.Kubernetes resource provider |
> | [Microsoft.KubernetesConfiguration](../permissions/hybrid-multicloud.md#microsoftkubernetesconfiguration)/register/action | Registers subscription to Microsoft.KubernetesConfiguration resource provider. |
> | [Microsoft.KubernetesConfiguration](../permissions/hybrid-multicloud.md#microsoftkubernetesconfiguration)/extensions/write | Creates or updates extension resource. |
> | [Microsoft.KubernetesConfiguration](../permissions/hybrid-multicloud.md#microsoftkubernetesconfiguration)/extensions/read | Gets extension instance resource. |
> | [Microsoft.KubernetesConfiguration](../permissions/hybrid-multicloud.md#microsoftkubernetesconfiguration)/extensions/delete | Deletes extension instance resource. |
> | [Microsoft.KubernetesConfiguration](../permissions/hybrid-multicloud.md#microsoftkubernetesconfiguration)/extensions/operations/read | Gets Async Operation status. |
> | [Microsoft.KubernetesConfiguration](../permissions/hybrid-multicloud.md#microsoftkubernetesconfiguration)/namespaces/read | Get Namespace Resource |
> | [Microsoft.KubernetesConfiguration](../permissions/hybrid-multicloud.md#microsoftkubernetesconfiguration)/operations/read | Gets available operations of the Microsoft.KubernetesConfiguration resource provider. |
> | [Microsoft.GuestConfiguration](../permissions/management-and-governance.md#microsoftguestconfiguration)/guestConfigurationAssignments/read | Get guest configuration assignment. |
> | [Microsoft.HybridContainerService](../permissions/hybrid-multicloud.md#microsofthybridcontainerservice)/register/action | Register the subscription for Microsoft.HybridContainerService |
> | [Microsoft.HybridContainerService](../permissions/hybrid-multicloud.md#microsofthybridcontainerservice)/kubernetesVersions/read | Lists the supported kubernetes versions from the underlying custom location |
> | [Microsoft.HybridContainerService](../permissions/hybrid-multicloud.md#microsofthybridcontainerservice)/kubernetesVersions/write | Puts the kubernetes version resource type |
> | [Microsoft.HybridContainerService](../permissions/hybrid-multicloud.md#microsofthybridcontainerservice)/skus/read | Lists the supported VM SKUs from the underlying custom location |
> | [Microsoft.HybridContainerService](../permissions/hybrid-multicloud.md#microsofthybridcontainerservice)/skus/write | Puts the VM SKUs resource type |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | [Microsoft.AzureStackHCI](../permissions/hybrid-multicloud.md#microsoftazurestackhci)/StorageContainers/Write | Creates/Updates storage containers resource |
> | [Microsoft.AzureStackHCI](../permissions/hybrid-multicloud.md#microsoftazurestackhci)/StorageContainers/Read | Gets/Lists storage containers resource |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Azure Resource Bridge Deployment Role",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/7b1f81f9-4196-4058-8aae-762e593270df",
  "name": "7b1f81f9-4196-4058-8aae-762e593270df",
  "permissions": [
    {
      "actions": [
        "Microsoft.Authorization/roleassignments/read",
        "Microsoft.AzureStackHCI/Register/Action",
        "Microsoft.ResourceConnector/register/action",
        "Microsoft.ResourceConnector/appliances/read",
        "Microsoft.ResourceConnector/appliances/write",
        "Microsoft.ResourceConnector/appliances/delete",
        "Microsoft.ResourceConnector/locations/operationresults/read",
        "Microsoft.ResourceConnector/locations/operationsstatus/read",
        "Microsoft.ResourceConnector/appliances/listClusterUserCredential/action",
        "Microsoft.ResourceConnector/appliances/listKeys/action",
        "Microsoft.ResourceConnector/appliances/upgradeGraphs/read",
        "Microsoft.ResourceConnector/telemetryconfig/read",
        "Microsoft.ResourceConnector/operations/read",
        "Microsoft.ExtendedLocation/register/action",
        "Microsoft.ExtendedLocation/customLocations/deploy/action",
        "Microsoft.ExtendedLocation/customLocations/read",
        "Microsoft.ExtendedLocation/customLocations/write",
        "Microsoft.ExtendedLocation/customLocations/delete",
        "Microsoft.HybridConnectivity/register/action",
        "Microsoft.Kubernetes/register/action",
        "Microsoft.KubernetesConfiguration/register/action",
        "Microsoft.KubernetesConfiguration/extensions/write",
        "Microsoft.KubernetesConfiguration/extensions/read",
        "Microsoft.KubernetesConfiguration/extensions/delete",
        "Microsoft.KubernetesConfiguration/extensions/operations/read",
        "Microsoft.KubernetesConfiguration/namespaces/read",
        "Microsoft.KubernetesConfiguration/operations/read",
        "Microsoft.GuestConfiguration/guestConfigurationAssignments/read",
        "Microsoft.HybridContainerService/register/action",
        "Microsoft.HybridContainerService/kubernetesVersions/read",
        "Microsoft.HybridContainerService/kubernetesVersions/write",
        "Microsoft.HybridContainerService/skus/read",
        "Microsoft.HybridContainerService/skus/write",
        "Microsoft.Resources/subscriptions/resourceGroups/read",
        "Microsoft.AzureStackHCI/StorageContainers/Write",
        "Microsoft.AzureStackHCI/StorageContainers/Read"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Azure Resource Bridge Deployment Role",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Azure Stack HCI Administrator

Grants full access to the cluster and its resources, including the ability to register Azure Stack HCI and assign others as Azure Arc HCI VM Contributor and/or Azure Arc HCI VM Reader

[Learn more](/azure-stack/hci/manage/assign-vm-rbac-roles)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.AzureStackHCI](../permissions/hybrid-multicloud.md#microsoftazurestackhci)/register/action | Registers the subscription for the Azure Stack HCI resource provider and enables the creation of Azure Stack HCI resources. |
> | [Microsoft.AzureStackHCI](../permissions/hybrid-multicloud.md#microsoftazurestackhci)/Unregister/Action | Unregisters the subscription for the Azure Stack HCI resource provider. |
> | [Microsoft.AzureStackHCI](../permissions/hybrid-multicloud.md#microsoftazurestackhci)/clusters/* |  |
> | [Microsoft.HybridCompute](../permissions/hybrid-multicloud.md#microsofthybridcompute)/register/action | Registers the subscription for the Microsoft.HybridCompute Resource Provider |
> | [Microsoft.GuestConfiguration](../permissions/management-and-governance.md#microsoftguestconfiguration)/register/action | Registers the subscription for the Microsoft.GuestConfiguration resource provider. |
> | [Microsoft.GuestConfiguration](../permissions/management-and-governance.md#microsoftguestconfiguration)/guestConfigurationAssignments/read | Get guest configuration assignment. |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/resourceGroups/write | Creates or updates a resource group. |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/resourceGroups/delete | Deletes a resource group and all its resources. |
> | [Microsoft.HybridConnectivity](../permissions/hybrid-multicloud.md#microsofthybridconnectivity)/register/action | Register the subscription for Microsoft.HybridConnectivity |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/roleAssignments/write | Create a role assignment at the specified scope. |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/roleAssignments/delete | Delete a role assignment at the specified scope. |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/*/read | Read roles and role assignments |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/deployments/* | Create and manage a deployment |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/read | Gets the list of subscriptions. |
> | [Microsoft.Management](../permissions/management-and-governance.md#microsoftmanagement)/managementGroups/read | List management groups for the authenticated user. |
> | [Microsoft.Support](../permissions/general.md#microsoftsupport)/* | Create and update a support ticket |
> | [Microsoft.AzureStackHCI](../permissions/hybrid-multicloud.md#microsoftazurestackhci)/* |  |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/AlertRules/Write | Create or update a classic metric alert |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/AlertRules/Delete | Delete a classic metric alert |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/AlertRules/Read | Read a classic metric alert |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/AlertRules/Activated/Action | Classic metric alert activated |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/AlertRules/Resolved/Action | Classic metric alert resolved |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/AlertRules/Throttled/Action | Classic metric alert rule throttled |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/AlertRules/Incidents/Read | Read a classic metric alert incident |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/resourcegroups/deployments/read | Gets or lists deployments. |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/resourcegroups/deployments/write | Creates or updates an deployment. |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/resourcegroups/deployments/operations/read | Gets or lists deployment operations. |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/resourcegroups/deployments/operationstatuses/read | Gets or lists deployment operation statuses. |
> | [Microsoft.ResourceHealth](../permissions/management-and-governance.md#microsoftresourcehealth)/availabilityStatuses/read | Gets the availability statuses for all resources in the specified scope |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/read | Gets the list of subscriptions. |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/operationresults/read | Get the subscription operation results. |
> | [Microsoft.HybridCompute](../permissions/hybrid-multicloud.md#microsofthybridcompute)/machines/read | Read any Azure Arc machines |
> | [Microsoft.HybridCompute](../permissions/hybrid-multicloud.md#microsofthybridcompute)/machines/write | Writes an Azure Arc machines |
> | [Microsoft.HybridCompute](../permissions/hybrid-multicloud.md#microsofthybridcompute)/machines/delete | Deletes an Azure Arc machines |
> | [Microsoft.HybridCompute](../permissions/hybrid-multicloud.md#microsofthybridcompute)/machines/UpgradeExtensions/action | Upgrades Extensions on Azure Arc machines |
> | [Microsoft.HybridCompute](../permissions/hybrid-multicloud.md#microsofthybridcompute)/machines/assessPatches/action | Assesses any Azure Arc machines to get missing software patches |
> | [Microsoft.HybridCompute](../permissions/hybrid-multicloud.md#microsofthybridcompute)/machines/installPatches/action | Installs patches on any Azure Arc machines |
> | [Microsoft.HybridCompute](../permissions/hybrid-multicloud.md#microsofthybridcompute)/machines/extensions/read | Reads any Azure Arc extensions |
> | [Microsoft.HybridCompute](../permissions/hybrid-multicloud.md#microsofthybridcompute)/machines/extensions/write | Installs or Updates an Azure Arc extensions |
> | [Microsoft.HybridCompute](../permissions/hybrid-multicloud.md#microsofthybridcompute)/machines/extensions/delete | Deletes an Azure Arc extensions |
> | [Microsoft.HybridCompute](../permissions/hybrid-multicloud.md#microsofthybridcompute)/operations/read | Read all Operations for Azure Arc for Servers |
> | [Microsoft.HybridCompute](../permissions/hybrid-multicloud.md#microsofthybridcompute)/locations/operationresults/read | Reads the status of an operation on Microsoft.HybridCompute Resource Provider |
> | [Microsoft.HybridCompute](../permissions/hybrid-multicloud.md#microsofthybridcompute)/locations/operationstatus/read | Reads the status of an operation on Microsoft.HybridCompute Resource Provider |
> | [Microsoft.HybridCompute](../permissions/hybrid-multicloud.md#microsofthybridcompute)/machines/patchAssessmentResults/read | Reads any Azure Arc patchAssessmentResults |
> | [Microsoft.HybridCompute](../permissions/hybrid-multicloud.md#microsofthybridcompute)/machines/patchAssessmentResults/softwarePatches/read | Reads any Azure Arc patchAssessmentResults/softwarePatches |
> | [Microsoft.HybridCompute](../permissions/hybrid-multicloud.md#microsofthybridcompute)/machines/patchInstallationResults/read | Reads any Azure Arc patchInstallationResults |
> | [Microsoft.HybridCompute](../permissions/hybrid-multicloud.md#microsofthybridcompute)/machines/patchInstallationResults/softwarePatches/read | Reads any Azure Arc patchInstallationResults/softwarePatches |
> | [Microsoft.HybridCompute](../permissions/hybrid-multicloud.md#microsofthybridcompute)/locations/updateCenterOperationResults/read | Reads the status of an update center operation on machines |
> | [Microsoft.HybridCompute](../permissions/hybrid-multicloud.md#microsofthybridcompute)/machines/hybridIdentityMetadata/read | Read any Azure Arc machines's Hybrid Identity Metadata |
> | [Microsoft.HybridCompute](../permissions/hybrid-multicloud.md#microsofthybridcompute)/osType/agentVersions/read | Read all Azure Connected Machine Agent versions available |
> | [Microsoft.HybridCompute](../permissions/hybrid-multicloud.md#microsofthybridcompute)/osType/agentVersions/latest/read | Read the latest Azure Connected Machine Agent version |
> | [Microsoft.HybridCompute](../permissions/hybrid-multicloud.md#microsofthybridcompute)/machines/runcommands/read | Reads any Azure Arc runcommands |
> | [Microsoft.HybridCompute](../permissions/hybrid-multicloud.md#microsofthybridcompute)/machines/runcommands/write | Installs or Updates an Azure Arc runcommands |
> | [Microsoft.HybridCompute](../permissions/hybrid-multicloud.md#microsofthybridcompute)/machines/runcommands/delete | Deletes an Azure Arc runcommands |
> | [Microsoft.HybridCompute](../permissions/hybrid-multicloud.md#microsofthybridcompute)/machines/licenseProfiles/read | Reads any Azure Arc licenseProfiles |
> | [Microsoft.HybridCompute](../permissions/hybrid-multicloud.md#microsofthybridcompute)/machines/licenseProfiles/write | Installs or Updates an Azure Arc licenseProfiles |
> | [Microsoft.HybridCompute](../permissions/hybrid-multicloud.md#microsofthybridcompute)/machines/licenseProfiles/delete | Deletes an Azure Arc licenseProfiles |
> | [Microsoft.HybridCompute](../permissions/hybrid-multicloud.md#microsofthybridcompute)/licenses/read | Reads any Azure Arc licenses |
> | [Microsoft.HybridCompute](../permissions/hybrid-multicloud.md#microsofthybridcompute)/licenses/write | Installs or Updates an Azure Arc licenses |
> | [Microsoft.HybridCompute](../permissions/hybrid-multicloud.md#microsofthybridcompute)/licenses/delete | Deletes an Azure Arc licenses |
> | [Microsoft.ResourceConnector](../permissions/hybrid-multicloud.md#microsoftresourceconnector)/register/action | Registers the subscription for Appliances resource provider and enables the creation of Appliance. |
> | [Microsoft.ResourceConnector](../permissions/hybrid-multicloud.md#microsoftresourceconnector)/appliances/read | Gets an Appliance resource |
> | [Microsoft.ResourceConnector](../permissions/hybrid-multicloud.md#microsoftresourceconnector)/appliances/write | Creates or Updates Appliance resource |
> | [Microsoft.ResourceConnector](../permissions/hybrid-multicloud.md#microsoftresourceconnector)/appliances/delete | Deletes Appliance resource |
> | [Microsoft.ResourceConnector](../permissions/hybrid-multicloud.md#microsoftresourceconnector)/locations/operationresults/read | Get result of Appliance operation |
> | [Microsoft.ResourceConnector](../permissions/hybrid-multicloud.md#microsoftresourceconnector)/locations/operationsstatus/read | Get result of Appliance operation |
> | [Microsoft.ResourceConnector](../permissions/hybrid-multicloud.md#microsoftresourceconnector)/appliances/listClusterUserCredential/action | Get an appliance cluster user credential |
> | [Microsoft.ResourceConnector](../permissions/hybrid-multicloud.md#microsoftresourceconnector)/appliances/listKeys/action | Get an appliance cluster customer user keys |
> | [Microsoft.ResourceConnector](../permissions/hybrid-multicloud.md#microsoftresourceconnector)/operations/read | Gets list of Available Operations for Appliances |
> | [Microsoft.ExtendedLocation](../permissions/hybrid-multicloud.md#microsoftextendedlocation)/register/action | Registers the subscription for Custom Location resource provider and enables the creation of Custom Location. |
> | [Microsoft.ExtendedLocation](../permissions/hybrid-multicloud.md#microsoftextendedlocation)/customLocations/read | Gets an Custom Location resource |
> | [Microsoft.ExtendedLocation](../permissions/hybrid-multicloud.md#microsoftextendedlocation)/customLocations/deploy/action | Deploy permissions to a Custom Location resource |
> | [Microsoft.ExtendedLocation](../permissions/hybrid-multicloud.md#microsoftextendedlocation)/customLocations/write | Creates or Updates Custom Location resource |
> | [Microsoft.ExtendedLocation](../permissions/hybrid-multicloud.md#microsoftextendedlocation)/customLocations/delete | Deletes Custom Location resource |
> | Microsoft.EdgeMarketplace/offers/read | Get a Offer |
> | Microsoft.EdgeMarketplace/publishers/read | Get a Publisher |
> | [Microsoft.Kubernetes](../permissions/hybrid-multicloud.md#microsoftkubernetes)/register/action | Registers Subscription with Microsoft.Kubernetes resource provider |
> | [Microsoft.KubernetesConfiguration](../permissions/hybrid-multicloud.md#microsoftkubernetesconfiguration)/register/action | Registers subscription to Microsoft.KubernetesConfiguration resource provider. |
> | [Microsoft.KubernetesConfiguration](../permissions/hybrid-multicloud.md#microsoftkubernetesconfiguration)/extensions/write | Creates or updates extension resource. |
> | [Microsoft.KubernetesConfiguration](../permissions/hybrid-multicloud.md#microsoftkubernetesconfiguration)/extensions/read | Gets extension instance resource. |
> | [Microsoft.KubernetesConfiguration](../permissions/hybrid-multicloud.md#microsoftkubernetesconfiguration)/extensions/delete | Deletes extension instance resource. |
> | [Microsoft.KubernetesConfiguration](../permissions/hybrid-multicloud.md#microsoftkubernetesconfiguration)/extensions/operations/read | Gets Async Operation status. |
> | [Microsoft.KubernetesConfiguration](../permissions/hybrid-multicloud.md#microsoftkubernetesconfiguration)/namespaces/read | Get Namespace Resource |
> | [Microsoft.KubernetesConfiguration](../permissions/hybrid-multicloud.md#microsoftkubernetesconfiguration)/operations/read | Gets available operations of the Microsoft.KubernetesConfiguration resource provider. |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | [Microsoft.AzureStackHCI](../permissions/hybrid-multicloud.md#microsoftazurestackhci)/StorageContainers/Write | Creates/Updates storage containers resource |
> | [Microsoft.AzureStackHCI](../permissions/hybrid-multicloud.md#microsoftazurestackhci)/StorageContainers/Read | Gets/Lists storage containers resource |
> | [Microsoft.HybridContainerService](../permissions/hybrid-multicloud.md#microsofthybridcontainerservice)/register/action | Register the subscription for Microsoft.HybridContainerService |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |
> | **Condition** |  |
> | ((!(ActionMatches{'Microsoft.Authorization/roleAssignments/write'})) OR (@Request[Microsoft.Authorization/roleAssignments:RoleDefinitionId] ForAnyOfAnyValues:GuidEquals{f5819b54-e033-4d82-ac66-4fec3cbf3f4c, cd570a14-e51a-42ad-bac8-bafd67325302, b64e21ea-ac4e-4cdf-9dc9-5b892992bee7, 4b3fe76c-f777-4d24-a2d7-b027b0f7b273, 874d1c73-6003-4e60-a13a-cb31ea190a85,865ae368-6a45-4bd1-8fbf-0d5151f56fc1,7b1f81f9-4196-4058-8aae-762e593270df,4633458b-17de-408a-b874-0445c86b69e6})) AND ((!(ActionMatches{'Microsoft.Authorization/roleAssignments/delete'})) OR (@Resource[Microsoft.Authorization/roleAssignments:RoleDefinitionId] ForAnyOfAnyValues:GuidEquals{f5819b54-e033-4d82-ac66-4fec3cbf3f4c, cd570a14-e51a-42ad-bac8-bafd67325302, b64e21ea-ac4e-4cdf-9dc9-5b892992bee7, 4b3fe76c-f777-4d24-a2d7-b027b0f7b273, 874d1c73-6003-4e60-a13a-cb31ea190a85,865ae368-6a45-4bd1-8fbf-0d5151f56fc1,7b1f81f9-4196-4058-8aae-762e593270df,4633458b-17de-408a-b874-0445c86b69e6})) | Add or remove role assignments for the following roles:<br/>Azure Connected Machine Resource Manager<br/>Azure Connected Machine Resource Administrator<br/>Azure Connected Machine Onboarding<br/>Azure Stack HCI VM Reader<br/>Azure Stack HCI VM Contributor<br/>Azure Stack HCI Device Management Role<br/>Azure Resource Bridge Deployment Role<br/>Key Vault Secrets User |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Grants full access to the cluster and its resources, including the ability to register Azure Stack HCI and assign others as Azure Arc HCI VM Contributor and/or Azure Arc HCI VM Reader",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/bda0d508-adf1-4af0-9c28-88919fc3ae06",
  "name": "bda0d508-adf1-4af0-9c28-88919fc3ae06",
  "permissions": [
    {
      "actions": [
        "Microsoft.AzureStackHCI/register/action",
        "Microsoft.AzureStackHCI/Unregister/Action",
        "Microsoft.AzureStackHCI/clusters/*",
        "Microsoft.HybridCompute/register/action",
        "Microsoft.GuestConfiguration/register/action",
        "Microsoft.GuestConfiguration/guestConfigurationAssignments/read",
        "Microsoft.Resources/subscriptions/resourceGroups/write",
        "Microsoft.Resources/subscriptions/resourceGroups/delete",
        "Microsoft.HybridConnectivity/register/action",
        "Microsoft.Authorization/roleAssignments/write",
        "Microsoft.Authorization/roleAssignments/delete",
        "Microsoft.Authorization/*/read",
        "Microsoft.Resources/deployments/*",
        "Microsoft.Resources/subscriptions/resourceGroups/read",
        "Microsoft.Resources/subscriptions/read",
        "Microsoft.Management/managementGroups/read",
        "Microsoft.Support/*",
        "Microsoft.AzureStackHCI/*",
        "Microsoft.Insights/AlertRules/Write",
        "Microsoft.Insights/AlertRules/Delete",
        "Microsoft.Insights/AlertRules/Read",
        "Microsoft.Insights/AlertRules/Activated/Action",
        "Microsoft.Insights/AlertRules/Resolved/Action",
        "Microsoft.Insights/AlertRules/Throttled/Action",
        "Microsoft.Insights/AlertRules/Incidents/Read",
        "Microsoft.Resources/subscriptions/resourcegroups/deployments/read",
        "Microsoft.Resources/subscriptions/resourcegroups/deployments/write",
        "Microsoft.Resources/subscriptions/resourcegroups/deployments/operations/read",
        "Microsoft.Resources/subscriptions/resourcegroups/deployments/operationstatuses/read",
        "Microsoft.ResourceHealth/availabilityStatuses/read",
        "Microsoft.Resources/subscriptions/read",
        "Microsoft.Resources/subscriptions/operationresults/read",
        "Microsoft.HybridCompute/machines/read",
        "Microsoft.HybridCompute/machines/write",
        "Microsoft.HybridCompute/machines/delete",
        "Microsoft.HybridCompute/machines/UpgradeExtensions/action",
        "Microsoft.HybridCompute/machines/assessPatches/action",
        "Microsoft.HybridCompute/machines/installPatches/action",
        "Microsoft.HybridCompute/machines/extensions/read",
        "Microsoft.HybridCompute/machines/extensions/write",
        "Microsoft.HybridCompute/machines/extensions/delete",
        "Microsoft.HybridCompute/operations/read",
        "Microsoft.HybridCompute/locations/operationresults/read",
        "Microsoft.HybridCompute/locations/operationstatus/read",
        "Microsoft.HybridCompute/machines/patchAssessmentResults/read",
        "Microsoft.HybridCompute/machines/patchAssessmentResults/softwarePatches/read",
        "Microsoft.HybridCompute/machines/patchInstallationResults/read",
        "Microsoft.HybridCompute/machines/patchInstallationResults/softwarePatches/read",
        "Microsoft.HybridCompute/locations/updateCenterOperationResults/read",
        "Microsoft.HybridCompute/machines/hybridIdentityMetadata/read",
        "Microsoft.HybridCompute/osType/agentVersions/read",
        "Microsoft.HybridCompute/osType/agentVersions/latest/read",
        "Microsoft.HybridCompute/machines/runcommands/read",
        "Microsoft.HybridCompute/machines/runcommands/write",
        "Microsoft.HybridCompute/machines/runcommands/delete",
        "Microsoft.HybridCompute/machines/licenseProfiles/read",
        "Microsoft.HybridCompute/machines/licenseProfiles/write",
        "Microsoft.HybridCompute/machines/licenseProfiles/delete",
        "Microsoft.HybridCompute/licenses/read",
        "Microsoft.HybridCompute/licenses/write",
        "Microsoft.HybridCompute/licenses/delete",
        "Microsoft.ResourceConnector/register/action",
        "Microsoft.ResourceConnector/appliances/read",
        "Microsoft.ResourceConnector/appliances/write",
        "Microsoft.ResourceConnector/appliances/delete",
        "Microsoft.ResourceConnector/locations/operationresults/read",
        "Microsoft.ResourceConnector/locations/operationsstatus/read",
        "Microsoft.ResourceConnector/appliances/listClusterUserCredential/action",
        "Microsoft.ResourceConnector/appliances/listKeys/action",
        "Microsoft.ResourceConnector/operations/read",
        "Microsoft.ExtendedLocation/register/action",
        "Microsoft.ExtendedLocation/customLocations/read",
        "Microsoft.ExtendedLocation/customLocations/deploy/action",
        "Microsoft.ExtendedLocation/customLocations/write",
        "Microsoft.ExtendedLocation/customLocations/delete",
        "Microsoft.EdgeMarketplace/offers/read",
        "Microsoft.EdgeMarketplace/publishers/read",
        "Microsoft.Kubernetes/register/action",
        "Microsoft.KubernetesConfiguration/register/action",
        "Microsoft.KubernetesConfiguration/extensions/write",
        "Microsoft.KubernetesConfiguration/extensions/read",
        "Microsoft.KubernetesConfiguration/extensions/delete",
        "Microsoft.KubernetesConfiguration/extensions/operations/read",
        "Microsoft.KubernetesConfiguration/namespaces/read",
        "Microsoft.KubernetesConfiguration/operations/read",
        "Microsoft.Resources/subscriptions/resourceGroups/read",
        "Microsoft.AzureStackHCI/StorageContainers/Write",
        "Microsoft.AzureStackHCI/StorageContainers/Read",
        "Microsoft.HybridContainerService/register/action"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": [],
      "conditionVersion": "2.0",
      "condition": "((!(ActionMatches{'Microsoft.Authorization/roleAssignments/write'})) OR (@Request[Microsoft.Authorization/roleAssignments:RoleDefinitionId] ForAnyOfAnyValues:GuidEquals{f5819b54-e033-4d82-ac66-4fec3cbf3f4c, cd570a14-e51a-42ad-bac8-bafd67325302, b64e21ea-ac4e-4cdf-9dc9-5b892992bee7, 4b3fe76c-f777-4d24-a2d7-b027b0f7b273, 874d1c73-6003-4e60-a13a-cb31ea190a85,865ae368-6a45-4bd1-8fbf-0d5151f56fc1,7b1f81f9-4196-4058-8aae-762e593270df,4633458b-17de-408a-b874-0445c86b69e6})) AND ((!(ActionMatches{'Microsoft.Authorization/roleAssignments/delete'})) OR (@Resource[Microsoft.Authorization/roleAssignments:RoleDefinitionId] ForAnyOfAnyValues:GuidEquals{f5819b54-e033-4d82-ac66-4fec3cbf3f4c, cd570a14-e51a-42ad-bac8-bafd67325302, b64e21ea-ac4e-4cdf-9dc9-5b892992bee7, 4b3fe76c-f777-4d24-a2d7-b027b0f7b273, 874d1c73-6003-4e60-a13a-cb31ea190a85,865ae368-6a45-4bd1-8fbf-0d5151f56fc1,7b1f81f9-4196-4058-8aae-762e593270df,4633458b-17de-408a-b874-0445c86b69e6}))"
    }
  ],
  "roleName": "Azure Stack HCI Administrator",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Azure Stack HCI Device Management Role

Microsoft.AzureStackHCI Device Management Role

[Learn more](/azure-stack/hci/deploy/deployment-azure-resource-manager-template)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.AzureStackHCI](../permissions/hybrid-multicloud.md#microsoftazurestackhci)/Clusters/* |  |
> | [Microsoft.AzureStackHCI](../permissions/hybrid-multicloud.md#microsoftazurestackhci)/EdgeDevices/* |  |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Microsoft.AzureStackHCI Device Management Role",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/865ae368-6a45-4bd1-8fbf-0d5151f56fc1",
  "name": "865ae368-6a45-4bd1-8fbf-0d5151f56fc1",
  "permissions": [
    {
      "actions": [
        "Microsoft.AzureStackHCI/Clusters/*",
        "Microsoft.AzureStackHCI/EdgeDevices/*",
        "Microsoft.Resources/subscriptions/resourceGroups/read"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Azure Stack HCI Device Management Role",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Azure Stack HCI VM Contributor

Grants permissions to perform all VM actions

[Learn more](/azure-stack/hci/manage/assign-vm-rbac-roles)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.AzureStackHCI](../permissions/hybrid-multicloud.md#microsoftazurestackhci)/VirtualMachines/* |  |
> | [Microsoft.AzureStackHCI](../permissions/hybrid-multicloud.md#microsoftazurestackhci)/virtualMachineInstances/* |  |
> | [Microsoft.AzureStackHCI](../permissions/hybrid-multicloud.md#microsoftazurestackhci)/NetworkInterfaces/* |  |
> | [Microsoft.AzureStackHCI](../permissions/hybrid-multicloud.md#microsoftazurestackhci)/VirtualHardDisks/* |  |
> | [Microsoft.AzureStackHCI](../permissions/hybrid-multicloud.md#microsoftazurestackhci)/VirtualNetworks/Read | Gets/Lists virtual networks resource |
> | [Microsoft.AzureStackHCI](../permissions/hybrid-multicloud.md#microsoftazurestackhci)/VirtualNetworks/join/action | Joins virtual networks resource |
> | [Microsoft.AzureStackHCI](../permissions/hybrid-multicloud.md#microsoftazurestackhci)/LogicalNetworks/Read | Gets/Lists logical networks resource |
> | [Microsoft.AzureStackHCI](../permissions/hybrid-multicloud.md#microsoftazurestackhci)/LogicalNetworks/join/action | Joins logical networks resource |
> | [Microsoft.AzureStackHCI](../permissions/hybrid-multicloud.md#microsoftazurestackhci)/GalleryImages/Read | Gets/Lists gallery images resource |
> | [Microsoft.AzureStackHCI](../permissions/hybrid-multicloud.md#microsoftazurestackhci)/GalleryImages/deploy/action | Deploys gallery images resource |
> | [Microsoft.AzureStackHCI](../permissions/hybrid-multicloud.md#microsoftazurestackhci)/StorageContainers/Read | Gets/Lists storage containers resource |
> | [Microsoft.AzureStackHCI](../permissions/hybrid-multicloud.md#microsoftazurestackhci)/StorageContainers/deploy/action | Deploys storage containers resource |
> | [Microsoft.AzureStackHCI](../permissions/hybrid-multicloud.md#microsoftazurestackhci)/MarketplaceGalleryImages/Read | Gets/Lists market place gallery images resource |
> | [Microsoft.AzureStackHCI](../permissions/hybrid-multicloud.md#microsoftazurestackhci)/MarketPlaceGalleryImages/deploy/action | Deploys market place gallery images resource |
> | [Microsoft.AzureStackHCI](../permissions/hybrid-multicloud.md#microsoftazurestackhci)/Clusters/Read | Gets clusters |
> | [Microsoft.AzureStackHCI](../permissions/hybrid-multicloud.md#microsoftazurestackhci)/Clusters/ArcSettings/Read | Gets arc resource of HCI cluster |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/AlertRules/Write | Create or update a classic metric alert |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/AlertRules/Delete | Delete a classic metric alert |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/AlertRules/Read | Read a classic metric alert |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/AlertRules/Activated/Action | Classic metric alert activated |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/AlertRules/Resolved/Action | Classic metric alert resolved |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/AlertRules/Throttled/Action | Classic metric alert rule throttled |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/AlertRules/Incidents/Read | Read a classic metric alert incident |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/deployments/read | Gets or lists deployments. |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/deployments/write | Creates or updates an deployment. |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/deployments/delete | Deletes a deployment. |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/deployments/cancel/action | Cancels a deployment. |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/deployments/validate/action | Validates an deployment. |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/deployments/whatIf/action | Predicts template deployment changes. |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/deployments/exportTemplate/action | Export template for a deployment |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/deployments/operations/read | Gets or lists deployment operations. |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/deployments/operationstatuses/read | Gets or lists deployment operation statuses. |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/resourcegroups/deployments/read | Gets or lists deployments. |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/resourcegroups/deployments/write | Creates or updates an deployment. |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/resourcegroups/deployments/operations/read | Gets or lists deployment operations. |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/resourcegroups/deployments/operationstatuses/read | Gets or lists deployment operation statuses. |
> | [Microsoft.ResourceHealth](../permissions/management-and-governance.md#microsoftresourcehealth)/availabilityStatuses/read | Gets the availability statuses for all resources in the specified scope |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/*/read | Read roles and role assignments |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/read | Gets the list of subscriptions. |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/operationresults/read | Get the subscription operation results. |
> | [Microsoft.HybridCompute](../permissions/hybrid-multicloud.md#microsofthybridcompute)/machines/read | Read any Azure Arc machines |
> | [Microsoft.HybridCompute](../permissions/hybrid-multicloud.md#microsofthybridcompute)/machines/write | Writes an Azure Arc machines |
> | [Microsoft.HybridCompute](../permissions/hybrid-multicloud.md#microsofthybridcompute)/machines/delete | Deletes an Azure Arc machines |
> | [Microsoft.HybridCompute](../permissions/hybrid-multicloud.md#microsofthybridcompute)/machines/UpgradeExtensions/action | Upgrades Extensions on Azure Arc machines |
> | [Microsoft.HybridCompute](../permissions/hybrid-multicloud.md#microsofthybridcompute)/machines/assessPatches/action | Assesses any Azure Arc machines to get missing software patches |
> | [Microsoft.HybridCompute](../permissions/hybrid-multicloud.md#microsofthybridcompute)/machines/installPatches/action | Installs patches on any Azure Arc machines |
> | [Microsoft.HybridCompute](../permissions/hybrid-multicloud.md#microsofthybridcompute)/machines/extensions/read | Reads any Azure Arc extensions |
> | [Microsoft.HybridCompute](../permissions/hybrid-multicloud.md#microsofthybridcompute)/machines/extensions/write | Installs or Updates an Azure Arc extensions |
> | [Microsoft.HybridCompute](../permissions/hybrid-multicloud.md#microsofthybridcompute)/machines/extensions/delete | Deletes an Azure Arc extensions |
> | [Microsoft.HybridCompute](../permissions/hybrid-multicloud.md#microsofthybridcompute)/operations/read | Read all Operations for Azure Arc for Servers |
> | [Microsoft.HybridCompute](../permissions/hybrid-multicloud.md#microsofthybridcompute)/locations/operationresults/read | Reads the status of an operation on Microsoft.HybridCompute Resource Provider |
> | [Microsoft.HybridCompute](../permissions/hybrid-multicloud.md#microsofthybridcompute)/locations/operationstatus/read | Reads the status of an operation on Microsoft.HybridCompute Resource Provider |
> | [Microsoft.HybridCompute](../permissions/hybrid-multicloud.md#microsofthybridcompute)/machines/patchAssessmentResults/read | Reads any Azure Arc patchAssessmentResults |
> | [Microsoft.HybridCompute](../permissions/hybrid-multicloud.md#microsofthybridcompute)/machines/patchAssessmentResults/softwarePatches/read | Reads any Azure Arc patchAssessmentResults/softwarePatches |
> | [Microsoft.HybridCompute](../permissions/hybrid-multicloud.md#microsofthybridcompute)/machines/patchInstallationResults/read | Reads any Azure Arc patchInstallationResults |
> | [Microsoft.HybridCompute](../permissions/hybrid-multicloud.md#microsofthybridcompute)/machines/patchInstallationResults/softwarePatches/read | Reads any Azure Arc patchInstallationResults/softwarePatches |
> | [Microsoft.HybridCompute](../permissions/hybrid-multicloud.md#microsofthybridcompute)/locations/updateCenterOperationResults/read | Reads the status of an update center operation on machines |
> | [Microsoft.HybridCompute](../permissions/hybrid-multicloud.md#microsofthybridcompute)/machines/hybridIdentityMetadata/read | Read any Azure Arc machines's Hybrid Identity Metadata |
> | [Microsoft.HybridCompute](../permissions/hybrid-multicloud.md#microsofthybridcompute)/osType/agentVersions/read | Read all Azure Connected Machine Agent versions available |
> | [Microsoft.HybridCompute](../permissions/hybrid-multicloud.md#microsofthybridcompute)/osType/agentVersions/latest/read | Read the latest Azure Connected Machine Agent version |
> | [Microsoft.HybridCompute](../permissions/hybrid-multicloud.md#microsofthybridcompute)/machines/runcommands/read | Reads any Azure Arc runcommands |
> | [Microsoft.HybridCompute](../permissions/hybrid-multicloud.md#microsofthybridcompute)/machines/runcommands/write | Installs or Updates an Azure Arc runcommands |
> | [Microsoft.HybridCompute](../permissions/hybrid-multicloud.md#microsofthybridcompute)/machines/runcommands/delete | Deletes an Azure Arc runcommands |
> | [Microsoft.HybridCompute](../permissions/hybrid-multicloud.md#microsofthybridcompute)/machines/licenseProfiles/read | Reads any Azure Arc licenseProfiles |
> | [Microsoft.HybridCompute](../permissions/hybrid-multicloud.md#microsofthybridcompute)/machines/licenseProfiles/write | Installs or Updates an Azure Arc licenseProfiles |
> | [Microsoft.HybridCompute](../permissions/hybrid-multicloud.md#microsofthybridcompute)/machines/licenseProfiles/delete | Deletes an Azure Arc licenseProfiles |
> | [Microsoft.HybridCompute](../permissions/hybrid-multicloud.md#microsofthybridcompute)/licenses/read | Reads any Azure Arc licenses |
> | [Microsoft.HybridCompute](../permissions/hybrid-multicloud.md#microsofthybridcompute)/licenses/write | Installs or Updates an Azure Arc licenses |
> | [Microsoft.HybridCompute](../permissions/hybrid-multicloud.md#microsofthybridcompute)/licenses/delete | Deletes an Azure Arc licenses |
> | [Microsoft.ExtendedLocation](../permissions/hybrid-multicloud.md#microsoftextendedlocation)/customLocations/Read | Gets an Custom Location resource |
> | [Microsoft.ExtendedLocation](../permissions/hybrid-multicloud.md#microsoftextendedlocation)/customLocations/deploy/action | Deploy permissions to a Custom Location resource |
> | [Microsoft.KubernetesConfiguration](../permissions/hybrid-multicloud.md#microsoftkubernetesconfiguration)/extensions/read | Gets extension instance resource. |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Grants permissions to perform all VM actions",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/874d1c73-6003-4e60-a13a-cb31ea190a85",
  "name": "874d1c73-6003-4e60-a13a-cb31ea190a85",
  "permissions": [
    {
      "actions": [
        "Microsoft.AzureStackHCI/VirtualMachines/*",
        "Microsoft.AzureStackHCI/virtualMachineInstances/*",
        "Microsoft.AzureStackHCI/NetworkInterfaces/*",
        "Microsoft.AzureStackHCI/VirtualHardDisks/*",
        "Microsoft.AzureStackHCI/VirtualNetworks/Read",
        "Microsoft.AzureStackHCI/VirtualNetworks/join/action",
        "Microsoft.AzureStackHCI/LogicalNetworks/Read",
        "Microsoft.AzureStackHCI/LogicalNetworks/join/action",
        "Microsoft.AzureStackHCI/GalleryImages/Read",
        "Microsoft.AzureStackHCI/GalleryImages/deploy/action",
        "Microsoft.AzureStackHCI/StorageContainers/Read",
        "Microsoft.AzureStackHCI/StorageContainers/deploy/action",
        "Microsoft.AzureStackHCI/MarketplaceGalleryImages/Read",
        "Microsoft.AzureStackHCI/MarketPlaceGalleryImages/deploy/action",
        "Microsoft.AzureStackHCI/Clusters/Read",
        "Microsoft.AzureStackHCI/Clusters/ArcSettings/Read",
        "Microsoft.Insights/AlertRules/Write",
        "Microsoft.Insights/AlertRules/Delete",
        "Microsoft.Insights/AlertRules/Read",
        "Microsoft.Insights/AlertRules/Activated/Action",
        "Microsoft.Insights/AlertRules/Resolved/Action",
        "Microsoft.Insights/AlertRules/Throttled/Action",
        "Microsoft.Insights/AlertRules/Incidents/Read",
        "Microsoft.Resources/deployments/read",
        "Microsoft.Resources/deployments/write",
        "Microsoft.Resources/deployments/delete",
        "Microsoft.Resources/deployments/cancel/action",
        "Microsoft.Resources/deployments/validate/action",
        "Microsoft.Resources/deployments/whatIf/action",
        "Microsoft.Resources/deployments/exportTemplate/action",
        "Microsoft.Resources/deployments/operations/read",
        "Microsoft.Resources/deployments/operationstatuses/read",
        "Microsoft.Resources/subscriptions/resourcegroups/deployments/read",
        "Microsoft.Resources/subscriptions/resourcegroups/deployments/write",
        "Microsoft.Resources/subscriptions/resourcegroups/deployments/operations/read",
        "Microsoft.Resources/subscriptions/resourcegroups/deployments/operationstatuses/read",
        "Microsoft.ResourceHealth/availabilityStatuses/read",
        "Microsoft.Authorization/*/read",
        "Microsoft.Resources/subscriptions/read",
        "Microsoft.Resources/subscriptions/resourceGroups/read",
        "Microsoft.Resources/subscriptions/operationresults/read",
        "Microsoft.HybridCompute/machines/read",
        "Microsoft.HybridCompute/machines/write",
        "Microsoft.HybridCompute/machines/delete",
        "Microsoft.HybridCompute/machines/UpgradeExtensions/action",
        "Microsoft.HybridCompute/machines/assessPatches/action",
        "Microsoft.HybridCompute/machines/installPatches/action",
        "Microsoft.HybridCompute/machines/extensions/read",
        "Microsoft.HybridCompute/machines/extensions/write",
        "Microsoft.HybridCompute/machines/extensions/delete",
        "Microsoft.HybridCompute/operations/read",
        "Microsoft.HybridCompute/locations/operationresults/read",
        "Microsoft.HybridCompute/locations/operationstatus/read",
        "Microsoft.HybridCompute/machines/patchAssessmentResults/read",
        "Microsoft.HybridCompute/machines/patchAssessmentResults/softwarePatches/read",
        "Microsoft.HybridCompute/machines/patchInstallationResults/read",
        "Microsoft.HybridCompute/machines/patchInstallationResults/softwarePatches/read",
        "Microsoft.HybridCompute/locations/updateCenterOperationResults/read",
        "Microsoft.HybridCompute/machines/hybridIdentityMetadata/read",
        "Microsoft.HybridCompute/osType/agentVersions/read",
        "Microsoft.HybridCompute/osType/agentVersions/latest/read",
        "Microsoft.HybridCompute/machines/runcommands/read",
        "Microsoft.HybridCompute/machines/runcommands/write",
        "Microsoft.HybridCompute/machines/runcommands/delete",
        "Microsoft.HybridCompute/machines/licenseProfiles/read",
        "Microsoft.HybridCompute/machines/licenseProfiles/write",
        "Microsoft.HybridCompute/machines/licenseProfiles/delete",
        "Microsoft.HybridCompute/licenses/read",
        "Microsoft.HybridCompute/licenses/write",
        "Microsoft.HybridCompute/licenses/delete",
        "Microsoft.ExtendedLocation/customLocations/Read",
        "Microsoft.ExtendedLocation/customLocations/deploy/action",
        "Microsoft.KubernetesConfiguration/extensions/read"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Azure Stack HCI VM Contributor",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Azure Stack HCI VM Reader

Grants permissions to view VMs

[Learn more](/azure-stack/hci/manage/assign-vm-rbac-roles)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.AzureStackHCI](../permissions/hybrid-multicloud.md#microsoftazurestackhci)/VirtualMachines/Read | Gets/Lists virtual machine resource |
> | [Microsoft.AzureStackHCI](../permissions/hybrid-multicloud.md#microsoftazurestackhci)/virtualMachineInstances/Read | Gets/Lists virtual machine instance resource |
> | [Microsoft.AzureStackHCI](../permissions/hybrid-multicloud.md#microsoftazurestackhci)/VirtualMachines/Extensions/Read | Gets/Lists virtual machine extensions resource |
> | [Microsoft.AzureStackHCI](../permissions/hybrid-multicloud.md#microsoftazurestackhci)/VirtualNetworks/Read | Gets/Lists virtual networks resource |
> | [Microsoft.AzureStackHCI](../permissions/hybrid-multicloud.md#microsoftazurestackhci)/LogicalNetworks/Read | Gets/Lists logical networks resource |
> | [Microsoft.AzureStackHCI](../permissions/hybrid-multicloud.md#microsoftazurestackhci)/NetworkInterfaces/Read | Gets/Lists network interfaces resource |
> | [Microsoft.AzureStackHCI](../permissions/hybrid-multicloud.md#microsoftazurestackhci)/VirtualHardDisks/Read | Gets/Lists virtual hard disk resource |
> | [Microsoft.AzureStackHCI](../permissions/hybrid-multicloud.md#microsoftazurestackhci)/StorageContainers/Read | Gets/Lists storage containers resource |
> | [Microsoft.AzureStackHCI](../permissions/hybrid-multicloud.md#microsoftazurestackhci)/GalleryImages/Read | Gets/Lists gallery images resource |
> | [Microsoft.AzureStackHCI](../permissions/hybrid-multicloud.md#microsoftazurestackhci)/MarketplaceGalleryImages/Read | Gets/Lists market place gallery images resource |
> | [Microsoft.HybridCompute](../permissions/hybrid-multicloud.md#microsofthybridcompute)/licenses/read | Reads any Azure Arc licenses |
> | [Microsoft.HybridCompute](../permissions/hybrid-multicloud.md#microsofthybridcompute)/machines/extensions/read | Reads any Azure Arc extensions |
> | [Microsoft.HybridCompute](../permissions/hybrid-multicloud.md#microsofthybridcompute)/machines/licenseProfiles/read | Reads any Azure Arc licenseProfiles |
> | [Microsoft.HybridCompute](../permissions/hybrid-multicloud.md#microsofthybridcompute)/machines/patchAssessmentResults/read | Reads any Azure Arc patchAssessmentResults |
> | [Microsoft.HybridCompute](../permissions/hybrid-multicloud.md#microsofthybridcompute)/machines/patchAssessmentResults/softwarePatches/read | Reads any Azure Arc patchAssessmentResults/softwarePatches |
> | [Microsoft.HybridCompute](../permissions/hybrid-multicloud.md#microsofthybridcompute)/machines/patchInstallationResults/read | Reads any Azure Arc patchInstallationResults |
> | [Microsoft.HybridCompute](../permissions/hybrid-multicloud.md#microsofthybridcompute)/machines/patchInstallationResults/softwarePatches/read | Reads any Azure Arc patchInstallationResults/softwarePatches |
> | [Microsoft.HybridCompute](../permissions/hybrid-multicloud.md#microsofthybridcompute)/machines/read | Read any Azure Arc machines |
> | [Microsoft.HybridCompute](../permissions/hybrid-multicloud.md#microsofthybridcompute)/privateLinkScopes/networkSecurityPerimeterConfigurations/read | Reads any Azure Arc networkSecurityPerimeterConfigurations |
> | [Microsoft.HybridCompute](../permissions/hybrid-multicloud.md#microsofthybridcompute)/privateLinkScopes/privateEndpointConnections/read | Read any Azure Arc privateEndpointConnections |
> | [Microsoft.HybridCompute](../permissions/hybrid-multicloud.md#microsofthybridcompute)/privateLinkScopes/read | Read any Azure Arc privateLinkScopes |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/AlertRules/Write | Create or update a classic metric alert |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/AlertRules/Delete | Delete a classic metric alert |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/AlertRules/Read | Read a classic metric alert |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/AlertRules/Activated/Action | Classic metric alert activated |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/AlertRules/Resolved/Action | Classic metric alert resolved |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/AlertRules/Throttled/Action | Classic metric alert rule throttled |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/AlertRules/Incidents/Read | Read a classic metric alert incident |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/deployments/read | Gets or lists deployments. |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/deployments/exportTemplate/action | Export template for a deployment |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/deployments/operations/read | Gets or lists deployment operations. |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/deployments/operationstatuses/read | Gets or lists deployment operation statuses. |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/resourcegroups/deployments/read | Gets or lists deployments. |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/resourcegroups/deployments/operations/read | Gets or lists deployment operations. |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/resourcegroups/deployments/operationstatuses/read | Gets or lists deployment operation statuses. |
> | [Microsoft.ResourceHealth](../permissions/management-and-governance.md#microsoftresourcehealth)/availabilityStatuses/read | Gets the availability statuses for all resources in the specified scope |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/*/read | Read roles and role assignments |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/read | Gets the list of subscriptions. |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/operationresults/read | Get the subscription operation results. |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Grants permissions to view VMs",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/4b3fe76c-f777-4d24-a2d7-b027b0f7b273",
  "name": "4b3fe76c-f777-4d24-a2d7-b027b0f7b273",
  "permissions": [
    {
      "actions": [
        "Microsoft.AzureStackHCI/VirtualMachines/Read",
        "Microsoft.AzureStackHCI/virtualMachineInstances/Read",
        "Microsoft.AzureStackHCI/VirtualMachines/Extensions/Read",
        "Microsoft.AzureStackHCI/VirtualNetworks/Read",
        "Microsoft.AzureStackHCI/LogicalNetworks/Read",
        "Microsoft.AzureStackHCI/NetworkInterfaces/Read",
        "Microsoft.AzureStackHCI/VirtualHardDisks/Read",
        "Microsoft.AzureStackHCI/StorageContainers/Read",
        "Microsoft.AzureStackHCI/GalleryImages/Read",
        "Microsoft.AzureStackHCI/MarketplaceGalleryImages/Read",
        "Microsoft.HybridCompute/licenses/read",
        "Microsoft.HybridCompute/machines/extensions/read",
        "Microsoft.HybridCompute/machines/licenseProfiles/read",
        "Microsoft.HybridCompute/machines/patchAssessmentResults/read",
        "Microsoft.HybridCompute/machines/patchAssessmentResults/softwarePatches/read",
        "Microsoft.HybridCompute/machines/patchInstallationResults/read",
        "Microsoft.HybridCompute/machines/patchInstallationResults/softwarePatches/read",
        "Microsoft.HybridCompute/machines/read",
        "Microsoft.HybridCompute/privateLinkScopes/networkSecurityPerimeterConfigurations/read",
        "Microsoft.HybridCompute/privateLinkScopes/privateEndpointConnections/read",
        "Microsoft.HybridCompute/privateLinkScopes/read",
        "Microsoft.Insights/AlertRules/Write",
        "Microsoft.Insights/AlertRules/Delete",
        "Microsoft.Insights/AlertRules/Read",
        "Microsoft.Insights/AlertRules/Activated/Action",
        "Microsoft.Insights/AlertRules/Resolved/Action",
        "Microsoft.Insights/AlertRules/Throttled/Action",
        "Microsoft.Insights/AlertRules/Incidents/Read",
        "Microsoft.Resources/deployments/read",
        "Microsoft.Resources/deployments/exportTemplate/action",
        "Microsoft.Resources/deployments/operations/read",
        "Microsoft.Resources/deployments/operationstatuses/read",
        "Microsoft.Resources/subscriptions/resourcegroups/deployments/read",
        "Microsoft.Resources/subscriptions/resourcegroups/deployments/operations/read",
        "Microsoft.Resources/subscriptions/resourcegroups/deployments/operationstatuses/read",
        "Microsoft.ResourceHealth/availabilityStatuses/read",
        "Microsoft.Authorization/*/read",
        "Microsoft.Resources/subscriptions/read",
        "Microsoft.Resources/subscriptions/resourceGroups/read",
        "Microsoft.Resources/subscriptions/operationresults/read"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Azure Stack HCI VM Reader",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Azure Stack Registration Owner

Lets you manage Azure Stack registrations.

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.AzureStack](../permissions/hybrid-multicloud.md#microsoftazurestack)/edgeSubscriptions/read |  |
> | [Microsoft.AzureStack](../permissions/hybrid-multicloud.md#microsoftazurestack)/registrations/products/*/action |  |
> | [Microsoft.AzureStack](../permissions/hybrid-multicloud.md#microsoftazurestack)/registrations/products/read | Gets the properties of an Azure Stack Marketplace product |
> | [Microsoft.AzureStack](../permissions/hybrid-multicloud.md#microsoftazurestack)/registrations/read | Gets the properties of an Azure Stack registration |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Lets you manage Azure Stack registrations.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/6f12a6df-dd06-4f3e-bcb1-ce8be600526a",
  "name": "6f12a6df-dd06-4f3e-bcb1-ce8be600526a",
  "permissions": [
    {
      "actions": [
        "Microsoft.AzureStack/edgeSubscriptions/read",
        "Microsoft.AzureStack/registrations/products/*/action",
        "Microsoft.AzureStack/registrations/products/read",
        "Microsoft.AzureStack/registrations/read"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Azure Stack Registration Owner",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Next steps

- [Assign Azure roles using the Azure portal](/azure/role-based-access-control/role-assignments-portal)
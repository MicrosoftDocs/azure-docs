---
title: Azure permissions for Hybrid + multicloud - Azure RBAC
description: Lists the permissions for the Azure resource providers in the Hybrid + multicloud category.
ms.service: role-based-access-control
ms.topic: reference
author: rolyon
manager: amycolannino
ms.author: rolyon
ms.date: 04/25/2024
ms.custom: generated
---

# Azure permissions for Hybrid + multicloud

This article lists the permissions for the Azure resource providers in the Hybrid + multicloud category. You can use these permissions in your own [Azure custom roles](/azure/role-based-access-control/custom-roles) to provide granular access control to resources in Azure. Permission strings have the following format: `{Company}.{ProviderName}/{resourceType}/{action}`


## Microsoft.AzureStack

Build and run innovative hybrid applications across cloud boundaries.

Azure service: [Azure Stack](/azure-stack/)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.AzureStack/register/action | Subscription Registration Action |
> | Microsoft.AzureStack/register/action | Registers Subscription with Microsoft.AzureStack resource provider |
> | Microsoft.AzureStack/generateDeploymentLicense/action | Generates a temporary license to deploy an Azure Stack device. |
> | Microsoft.AzureStack/cloudManifestFiles/read | Gets the Cloud Manifest File |
> | Microsoft.AzureStack/linkedSubscriptions/read | Get the properties of an Azure Stack Linked Subscription |
> | Microsoft.AzureStack/linkedSubscriptions/write | Create or updates an linked subscription |
> | Microsoft.AzureStack/linkedSubscriptions/delete | Delete a Linked Subscription |
> | Microsoft.AzureStack/linkedSubscriptions/linkedResourceGroups/action | Reads or Writes to a projected linked resource under the linked resource group |
> | Microsoft.AzureStack/linkedSubscriptions/linkedProviders/action | Reads or Writes to a projected linked resource under the given linked resource provider namespace |
> | Microsoft.AzureStack/linkedSubscriptions/operations/action | Get or list statuses of async operations on projected linked resources |
> | Microsoft.AzureStack/linkedSubscriptions/linkedResourceGroups/linkedProviders/virtualNetworks/read | Get or list virtual network |
> | Microsoft.AzureStack/Operations/read | Gets the properties of a resource provider operation |
> | Microsoft.AzureStack/registrations/read | Gets the properties of an Azure Stack registration |
> | Microsoft.AzureStack/registrations/write | Creates or updates an Azure Stack registration |
> | Microsoft.AzureStack/registrations/delete | Deletes an Azure Stack registration |
> | Microsoft.AzureStack/registrations/getActivationKey/action | Gets the latest Azure Stack activation key |
> | Microsoft.AzureStack/registrations/enableRemoteManagement/action | Enable RemoteManagement for Azure Stack registration |
> | Microsoft.AzureStack/registrations/customerSubscriptions/read | Gets the properties of an Azure Stack Customer Subscription |
> | Microsoft.AzureStack/registrations/customerSubscriptions/write | Creates or updates an Azure Stack Customer Subscription |
> | Microsoft.AzureStack/registrations/customerSubscriptions/delete | Deletes an Azure Stack Customer Subscription |
> | Microsoft.AzureStack/registrations/products/read | Gets the properties of an Azure Stack Marketplace product |
> | Microsoft.AzureStack/registrations/products/listDetails/action | Retrieves extended details for an Azure Stack Marketplace product |
> | Microsoft.AzureStack/registrations/products/getProducts/action | Retrieves a list of Azure Stack Marketplace products |
> | Microsoft.AzureStack/registrations/products/getProduct/action | Retrieves Azure Stack Marketplace product |
> | Microsoft.AzureStack/registrations/products/uploadProductLog/action | Record Azure Stack Marketplace product operation status and timestamp |

## Microsoft.AzureStackHCI

Azure service: [Azure Stack HCI](/azure-stack/hci/)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.AzureStackHCI/Register/Action | Registers the subscription for the Azure Stack HCI resource provider and enables the creation of Azure Stack HCI resources. |
> | Microsoft.AzureStackHCI/Unregister/Action | Unregisters the subscription for the Azure Stack HCI resource provider. |
> | Microsoft.AzureStackHCI/Clusters/Read | Gets clusters |
> | Microsoft.AzureStackHCI/Clusters/Write | Creates or updates a cluster |
> | Microsoft.AzureStackHCI/Clusters/Delete | Deletes cluster resource |
> | Microsoft.AzureStackHCI/Clusters/AddNodes/Action | Adds Arc Nodes to the cluster |
> | Microsoft.AzureStackHCI/Clusters/CreateClusterIdentity/Action | Create cluster identity |
> | Microsoft.AzureStackHCI/Clusters/UploadCertificate/Action | Upload cluster certificate |
> | Microsoft.AzureStackHCI/Clusters/ArcSettings/Read | Gets arc resource of HCI cluster |
> | Microsoft.AzureStackHCI/Clusters/ArcSettings/Write | Create or updates arc resource of HCI cluster |
> | Microsoft.AzureStackHCI/Clusters/ArcSettings/Delete | Delete arc resource of HCI cluster |
> | Microsoft.AzureStackHCI/Clusters/ArcSettings/GeneratePassword/Action | Generate password for Arc settings identity |
> | Microsoft.AzureStackHCI/Clusters/ArcSettings/CreateArcIdentity/Action | Create Arc settings identity |
> | Microsoft.AzureStackHCI/Clusters/ArcSettings/ConsentAndInstallDefaultExtensions/Action | Updates Consent Time and Installs default extensions |
> | Microsoft.AzureStackHCI/Clusters/ArcSettings/InitializeDisableProcess/Action | Initializes disable process for arc settings resource |
> | Microsoft.AzureStackHCI/Clusters/ArcSettings/Extensions/Read | Gets extension resource of HCI cluster |
> | Microsoft.AzureStackHCI/Clusters/ArcSettings/Extensions/Write | Create or update extension resource of HCI cluster |
> | Microsoft.AzureStackHCI/Clusters/ArcSettings/Extensions/Delete | Delete extension resources of HCI cluster |
> | Microsoft.AzureStackHCI/Clusters/ArcSettings/Extensions/Upgrade/Action | Upgrade extension resources of HCI cluster |
> | Microsoft.AzureStackHCI/Clusters/DeploymentSettings/Read | Gets DeploymentSettings |
> | Microsoft.AzureStackHCI/Clusters/DeploymentSettings/Write | Creates or updates DeploymentSettings resource |
> | Microsoft.AzureStackHCI/Clusters/DeploymentSettings/Delete | Deletes DeploymentSettings resource |
> | Microsoft.AzureStackHCI/Clusters/SecuritySettings/Read | Gets SecuritySettings of HCI cluster |
> | Microsoft.AzureStackHCI/Clusters/SecuritySettings/Write | Create or updates SecuritySettings resource of HCI cluster |
> | Microsoft.AzureStackHCI/Clusters/SecuritySettings/Delete | Delete SecuritySettings resource of HCI cluster |
> | Microsoft.AzureStackHCI/EdgeDevices/Read | Gets EdgeDevices resources |
> | Microsoft.AzureStackHCI/EdgeDevices/Write | Creates or updates EdgeDevice resource |
> | Microsoft.AzureStackHCI/EdgeDevices/Delete | Deletes EdgeDevice resource |
> | Microsoft.AzureStackHCI/EdgeDevices/Validate/Action | Validates EdgeDevice Resources for deployment |
> | Microsoft.AzureStackHCI/GalleryImages/Delete | Deletes gallery images resource |
> | Microsoft.AzureStackHCI/GalleryImages/Write | Creates/Updates gallery images resource |
> | Microsoft.AzureStackHCI/GalleryImages/Read | Gets/Lists gallery images resource |
> | Microsoft.AzureStackHCI/GalleryImages/deploy/action | Deploys gallery images resource |
> | Microsoft.AzureStackHCI/LogicalNetworks/Delete | Deletes logical networks resource |
> | Microsoft.AzureStackHCI/LogicalNetworks/Write | Creates/Updates logical networks resource |
> | Microsoft.AzureStackHCI/LogicalNetworks/Read | Gets/Lists logical networks resource |
> | Microsoft.AzureStackHCI/LogicalNetworks/join/action | Joins logical networks resource |
> | Microsoft.AzureStackHCI/MarketPlaceGalleryImages/Delete | Deletes market place gallery images resource |
> | Microsoft.AzureStackHCI/MarketPlaceGalleryImages/Write | Creates/Updates market place gallery images resource |
> | Microsoft.AzureStackHCI/MarketPlaceGalleryImages/Read | Gets/Lists market place gallery images resource |
> | Microsoft.AzureStackHCI/MarketPlaceGalleryImages/deploy/action | Deploys market place gallery images resource |
> | Microsoft.AzureStackHCI/NetworkInterfaces/Delete | Deletes network interfaces resource |
> | Microsoft.AzureStackHCI/NetworkInterfaces/Write | Creates/Updates network interfaces resource |
> | Microsoft.AzureStackHCI/NetworkInterfaces/Read | Gets/Lists network interfaces resource |
> | Microsoft.AzureStackHCI/NetworkSecurityGroups/Delete | Deletes a network security group resource |
> | Microsoft.AzureStackHCI/NetworkSecurityGroups/Write | Creates/Updates a network security group resource |
> | Microsoft.AzureStackHCI/NetworkSecurityGroups/Read | Gets/Lists a network security group resource |
> | Microsoft.AzureStackHCI/NetworkSecurityGroups/SecurityRules/Delete | Deletes a security rule resource |
> | Microsoft.AzureStackHCI/NetworkSecurityGroups/SecurityRules/Write | Creates/Updates security rule resource |
> | Microsoft.AzureStackHCI/NetworkSecurityGroups/SecurityRules/Read | Gets/Lists security rule resource |
> | Microsoft.AzureStackHCI/Operations/Read | Gets operations |
> | Microsoft.AzureStackHCI/RegisteredSubscriptions/read | Reads registered subscriptions |
> | Microsoft.AzureStackHCI/StorageContainers/Delete | Deletes storage containers resource |
> | Microsoft.AzureStackHCI/StorageContainers/Write | Creates/Updates storage containers resource |
> | Microsoft.AzureStackHCI/StorageContainers/Read | Gets/Lists storage containers resource |
> | Microsoft.AzureStackHCI/StorageContainers/deploy/action | Deploys storage containers resource |
> | Microsoft.AzureStackHCI/VirtualHardDisks/Delete | Deletes virtual hard disk resource |
> | Microsoft.AzureStackHCI/VirtualHardDisks/Write | Creates/Updates virtual hard disk resource |
> | Microsoft.AzureStackHCI/VirtualHardDisks/Read | Gets/Lists virtual hard disk resource |
> | Microsoft.AzureStackHCI/VirtualMachineInstances/Restart/Action | Restarts virtual machine instance resource |
> | Microsoft.AzureStackHCI/VirtualMachineInstances/Start/Action | Starts virtual machine instance resource |
> | Microsoft.AzureStackHCI/VirtualMachineInstances/Stop/Action | Stops virtual machine instance resource |
> | Microsoft.AzureStackHCI/VirtualMachineInstances/Pause/Action | Pauses virtual machine instance resource |
> | Microsoft.AzureStackHCI/VirtualMachineInstances/Save/Action | Saves virtual machine instance resource |
> | Microsoft.AzureStackHCI/VirtualMachineInstances/Delete | Deletes virtual machine instance resource |
> | Microsoft.AzureStackHCI/VirtualMachineInstances/Write | Creates/Updates virtual machine instance resource |
> | Microsoft.AzureStackHCI/VirtualMachineInstances/Read | Gets/Lists virtual machine instance resource |
> | Microsoft.AzureStackHCI/VirtualMachineInstances/attestationStatus/read | Gets/Lists virtual machine instance's attestation status |
> | Microsoft.AzureStackHCI/VirtualMachineInstances/HybridIdentityMetadata/Read | Gets/Lists virtual machine instance hybrid identity metadata proxy resource |
> | Microsoft.AzureStackHCI/VirtualMachines/Restart/Action | Restarts virtual machine resource |
> | Microsoft.AzureStackHCI/VirtualMachines/Start/Action | Starts virtual machine resource |
> | Microsoft.AzureStackHCI/VirtualMachines/Stop/Action | Stops virtual machine resource |
> | Microsoft.AzureStackHCI/VirtualMachines/Delete | Deletes virtual machine resource |
> | Microsoft.AzureStackHCI/VirtualMachines/Write | Creates/Updates virtual machine resource |
> | Microsoft.AzureStackHCI/VirtualMachines/Read | Gets/Lists virtual machine resource |
> | Microsoft.AzureStackHCI/VirtualMachines/Extensions/Read | Gets/Lists virtual machine extensions resource |
> | Microsoft.AzureStackHCI/VirtualMachines/Extensions/Write | Creates/Updates virtual machine extensions resource |
> | Microsoft.AzureStackHCI/VirtualMachines/Extensions/Delete | Deletes virtual machine extensions resource |
> | Microsoft.AzureStackHCI/VirtualMachines/HybridIdentityMetadata/Read | Gets/Lists virtual machine hybrid identity metadata proxy resource |
> | Microsoft.AzureStackHCI/VirtualNetworks/Delete | Deletes virtual networks resource |
> | Microsoft.AzureStackHCI/VirtualNetworks/Write | Creates/Updates virtual networks resource |
> | Microsoft.AzureStackHCI/VirtualNetworks/Read | Gets/Lists virtual networks resource |
> | Microsoft.AzureStackHCI/VirtualNetworks/join/action | Joins virtual networks resource |
> | **DataAction** | **Description** |
> | Microsoft.AzureStackHCI/Clusters/WACloginAsAdmin/Action | Manage OS of HCI resource via Windows Admin Center as an administrator |
> | Microsoft.AzureStackHCI/VirtualMachineInstances/WACloginAsAdmin/Action | Manage ARC enabled VM resources on HCI via Windows Admin Center as an administrator |
> | Microsoft.AzureStackHCI/virtualMachines/WACloginAsAdmin/Action | Manage ARC enabled VM resources on HCI via Windows Admin Center as an administrator |

## Microsoft.ExtendedLocation

Azure service: [Custom locations](/azure/azure-arc/platform/conceptual-custom-locations)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.ExtendedLocation/register/action | Registers the subscription for Custom Location resource provider and enables the creation of Custom Location. |
> | Microsoft.ExtendedLocation/unregister/action | UnRegisters the subscription for Custom Location resource provider and disables the creation of Custom Location. |
> | Microsoft.ExtendedLocation/customLocations/read | Gets an Custom Location resource |
> | Microsoft.ExtendedLocation/customLocations/write | Creates or Updates Custom Location resource |
> | Microsoft.ExtendedLocation/customLocations/deploy/action | Deploy permissions to a Custom Location resource |
> | Microsoft.ExtendedLocation/customLocations/delete | Deletes Custom Location resource |
> | Microsoft.ExtendedLocation/customLocations/findTargetResourceGroup/action | Evaluate Labels Against Resource Sync Rules to Get Resource Group for Resource Sync |
> | Microsoft.ExtendedLocation/customLocations/enabledresourcetypes/read | Gets EnabledResourceTypes for a Custom Location resource |
> | Microsoft.ExtendedLocation/customLocations/resourceSyncRules/read | Gets a Resource Sync Rule resource |
> | Microsoft.ExtendedLocation/customLocations/resourceSyncRules/write | Creates or Updates a Resource Sync Rule resource |
> | Microsoft.ExtendedLocation/customLocations/resourceSyncRules/delete | Deletes Resource Sync Rule resource |
> | Microsoft.ExtendedLocation/locations/operationresults/read | Get result of Custom Location operation |
> | Microsoft.ExtendedLocation/locations/operationsstatus/read | Get result of Custom Location operation |
> | Microsoft.ExtendedLocation/operations/read | Gets list of Available Operations for Custom Locations |

## Microsoft.HybridCompute

Azure service: [Azure Arc](/azure/azure-arc/)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.HybridCompute/register/action | Registers the subscription for the Microsoft.HybridCompute Resource Provider |
> | Microsoft.HybridCompute/unregister/action | Unregisters the subscription for Microsoft.HybridCompute Resource Provider |
> | Microsoft.HybridCompute/batch/action | Batch deletes Azure Arc machines |
> | Microsoft.HybridCompute/validateLicense/action | Validates the provided license data and returns what would be created on a PUT to Microsoft.HybridCompute/licenses |
> | Microsoft.HybridCompute/licenses/read | Reads any Azure Arc licenses |
> | Microsoft.HybridCompute/licenses/write | Installs or Updates an Azure Arc licenses |
> | Microsoft.HybridCompute/licenses/delete | Deletes an Azure Arc licenses |
> | Microsoft.HybridCompute/locations/notifyNetworkSecurityPerimeterUpdatesAvailable/action | Updates Network Security Perimeter Profiles |
> | Microsoft.HybridCompute/locations/notifyExtension/action | Notifies Microsoft.HybridCompute about extensions updates |
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
> | Microsoft.HybridCompute/machines/hybridIdentityMetadata/read | Read any Azure Arc machines's Hybrid Identity Metadata |
> | Microsoft.HybridCompute/machines/licenseProfiles/read | Reads any Azure Arc licenseProfiles |
> | Microsoft.HybridCompute/machines/licenseProfiles/write | Installs or Updates an Azure Arc licenseProfiles |
> | Microsoft.HybridCompute/machines/licenseProfiles/delete | Deletes an Azure Arc licenseProfiles |
> | Microsoft.HybridCompute/machines/patchAssessmentResults/read | Reads any Azure Arc patchAssessmentResults |
> | Microsoft.HybridCompute/machines/patchAssessmentResults/softwarePatches/read | Reads any Azure Arc patchAssessmentResults/softwarePatches |
> | Microsoft.HybridCompute/machines/patchInstallationResults/read | Reads any Azure Arc patchInstallationResults |
> | Microsoft.HybridCompute/machines/patchInstallationResults/softwarePatches/read | Reads any Azure Arc patchInstallationResults/softwarePatches |
> | Microsoft.HybridCompute/machines/runcommands/read | Reads any Azure Arc runcommands |
> | Microsoft.HybridCompute/machines/runcommands/write | Installs or Updates an Azure Arc runcommands |
> | Microsoft.HybridCompute/machines/runcommands/delete | Deletes an Azure Arc runcommands |
> | Microsoft.HybridCompute/networkConfigurations/read | Reads any Azure Arc networkConfigurations |
> | Microsoft.HybridCompute/networkConfigurations/write | Writes an Azure Arc networkConfigurations |
> | Microsoft.HybridCompute/operations/read | Read all Operations for Azure Arc for Servers |
> | Microsoft.HybridCompute/osType/agentVersions/read | Read all Azure Connected Machine Agent versions available |
> | Microsoft.HybridCompute/osType/agentVersions/latest/read | Read the latest Azure Connected Machine Agent version |
> | Microsoft.HybridCompute/privateLinkScopes/read | Read any Azure Arc privateLinkScopes |
> | Microsoft.HybridCompute/privateLinkScopes/write | Writes an Azure Arc privateLinkScopes |
> | Microsoft.HybridCompute/privateLinkScopes/delete | Deletes an Azure Arc privateLinkScopes |
> | Microsoft.HybridCompute/privateLinkScopes/networkSecurityPerimeterAssociationProxies/read | Reads any Azure Arc networkSecurityPerimeterAssociationProxies |
> | Microsoft.HybridCompute/privateLinkScopes/networkSecurityPerimeterAssociationProxies/write | Writes an Azure Arc networkSecurityPerimeterAssociationProxies |
> | Microsoft.HybridCompute/privateLinkScopes/networkSecurityPerimeterAssociationProxies/delete | Deletes an Azure Arc networkSecurityPerimeterAssociationProxies |
> | Microsoft.HybridCompute/privateLinkScopes/networkSecurityPerimeterConfigurations/read | Reads any Azure Arc networkSecurityPerimeterConfigurations |
> | Microsoft.HybridCompute/privateLinkScopes/networkSecurityPerimeterConfigurations/reconcile/action | Forces the networkSecurityPerimeterConfigurations resource to refresh |
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
> | Microsoft.HybridCompute/machines/login/action | Log in to an Azure Arc machine as a regular user |
> | Microsoft.HybridCompute/machines/loginAsAdmin/action | Log in to an Azure Arc machine with Windows administrator or Linux root user privilege |
> | Microsoft.HybridCompute/machines/WACloginAsAdmin/action | Lets you manage the OS of your resource via Windows Admin Center as an administrator. |

## Microsoft.HybridConnectivity

Azure service: Microsoft.HybridConnectivity

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.HybridConnectivity/generateAwsTemplate/action | Retrieve AWS Cloud Formation template |
> | Microsoft.HybridConnectivity/register/action | Register the subscription for Microsoft.HybridConnectivity |
> | Microsoft.HybridConnectivity/unregister/action | Unregister the subscription for Microsoft.HybridConnectivity |
> | Microsoft.HybridConnectivity/endpoints/read | List of endpoints to the target resource. |
> | Microsoft.HybridConnectivity/endpoints/read | Gets the endpoint to the resource. |
> | Microsoft.HybridConnectivity/endpoints/write | Create or update the endpoint to the target resource. |
> | Microsoft.HybridConnectivity/endpoints/delete | Deletes the endpoint access to the target resource. |
> | Microsoft.HybridConnectivity/endpoints/write | Update the endpoint to the target resource. |
> | Microsoft.HybridConnectivity/endpoints/listCredentials/action | Gets the endpoint access credentials to the resource. |
> | Microsoft.HybridConnectivity/endpoints/listIngressGatewayCredentials/action | Gets the ingress gateway endpoint credentials  |
> | Microsoft.HybridConnectivity/endpoints/listManagedProxyDetails/action | Fetches the managed proxy details  |
> | Microsoft.HybridConnectivity/endpoints/serviceConfigurations/read | API to enumerate registered services in service configurations under a Endpoint Resource |
> | Microsoft.HybridConnectivity/endpoints/serviceConfigurations/read | Gets the details about the service to the resource. |
> | Microsoft.HybridConnectivity/endpoints/serviceConfigurations/write | Create or update a service in serviceConfiguration for the endpoint resource. |
> | Microsoft.HybridConnectivity/endpoints/serviceConfigurations/delete | Deletes the service details to the target resource. |
> | Microsoft.HybridConnectivity/endpoints/serviceConfigurations/write | Update the service details in the service configurations of the target resource. |
> | Microsoft.HybridConnectivity/Locations/OperationStatuses/read | read OperationStatuses |
> | Microsoft.HybridConnectivity/Locations/OperationStatuses/write | write OperationStatuses |
> | Microsoft.HybridConnectivity/Operations/read | read Operations |
> | Microsoft.HybridConnectivity/publicCloudConnectors/read | Gets the public cloud connectors in the subscription. |
> | Microsoft.HybridConnectivity/publicCloudConnectors/read | Gets the publicCloudConnector in the resource group. |
> | Microsoft.HybridConnectivity/publicCloudConnectors/read | Gets the public cloud connectors. |
> | Microsoft.HybridConnectivity/publicCloudConnectors/write | Creates public cloud connectors resource. |
> | Microsoft.HybridConnectivity/publicCloudConnectors/delete | Deletes the public cloud connectors resource. |
> | Microsoft.HybridConnectivity/publicCloudConnectors/write | Update the public cloud connectors resource. |
> | Microsoft.HybridConnectivity/solutionConfigurations/read | Retrieve the List of solution configuration resources. |
> | Microsoft.HybridConnectivity/solutionConfigurations/read | Retrieve the solution configuration identified by solution name. |
> | Microsoft.HybridConnectivity/solutionConfigurations/write | Creates solution configuration with provided solution name |
> | Microsoft.HybridConnectivity/solutionConfigurations/delete | Deletes the solution configuration with provided solution name. |
> | Microsoft.HybridConnectivity/solutionConfigurations/write | Updates the solution configuration for solution name. |
> | Microsoft.HybridConnectivity/solutionConfigurations/inventory/read | Retrieve the inventory identified by inventory id. |
> | Microsoft.HybridConnectivity/solutionConfigurations/inventory/read | Retrieve a list of inventory by solution name. |
> | Microsoft.HybridConnectivity/solutionTypes/read | Retrieve the list of available solution types. |
> | Microsoft.HybridConnectivity/solutionTypes/read | Retrieve the solution type by provided solution type. |

## Microsoft.HybridContainerService

Azure service: Microsoft.HybridContainerService

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.HybridContainerService/register/action | Register the subscription for Microsoft.HybridContainerService |
> | Microsoft.HybridContainerService/unregister/action | Unregister the subscription for Microsoft.HybridContainerService |
> | Microsoft.HybridContainerService/kubernetesVersions/read | Gets the supported kubernetes versions from the underlying custom location |
> | Microsoft.HybridContainerService/kubernetesVersions/write | Puts the kubernetes version resource type |
> | Microsoft.HybridContainerService/kubernetesVersions/delete | Delete the kubernetes versions resource type |
> | Microsoft.HybridContainerService/kubernetesVersions/read | Lists the supported kubernetes versions from the underlying custom location |
> | Microsoft.HybridContainerService/Locations/operationStatuses/read | read operationStatuses |
> | Microsoft.HybridContainerService/Locations/operationStatuses/write | write operationStatuses |
> | Microsoft.HybridContainerService/Operations/read | read Operations |
> | Microsoft.HybridContainerService/provisionedClusterInstances/read | Gets the Hybrid AKS provisioned cluster instance |
> | Microsoft.HybridContainerService/provisionedClusterInstances/write | Creates the Hybrid AKS provisioned cluster instance |
> | Microsoft.HybridContainerService/provisionedClusterInstances/delete | Deletes the Hybrid AKS provisioned cluster instance |
> | Microsoft.HybridContainerService/provisionedClusterInstances/read | Gets the Hybrid AKS provisioned cluster instances associated with the connected cluster |
> | Microsoft.HybridContainerService/provisionedClusterInstances/listUserKubeconfig/action | Lists the AAD user credentials of a provisioned cluster instance used only in direct mode. |
> | Microsoft.HybridContainerService/provisionedClusterInstances/listAdminKubeconfig/action | Lists the admin credentials of a provisioned cluster instance used only in direct mode. |
> | Microsoft.HybridContainerService/provisionedClusterInstances/agentPools/read | Gets the agent pool in the Hybrid AKS provisioned cluster instance |
> | Microsoft.HybridContainerService/provisionedClusterInstances/agentPools/write | Creates the agent pool in the Hybrid AKS provisioned cluster instance |
> | Microsoft.HybridContainerService/provisionedClusterInstances/agentPools/delete | Deletes the agent pool in the Hybrid AKS provisioned cluster instance |
> | Microsoft.HybridContainerService/provisionedClusterInstances/agentPools/write | Updates the agent pool in the Hybrid AKS provisioned cluster instance |
> | Microsoft.HybridContainerService/provisionedClusterInstances/agentPools/read | Gets the agent pools in the Hybrid AKS provisioned cluster instance |
> | Microsoft.HybridContainerService/provisionedClusterInstances/hybridIdentityMetadata/read | Get the hybrid identity metadata proxy resource. |
> | Microsoft.HybridContainerService/provisionedClusterInstances/hybridIdentityMetadata/write | Creates the hybrid identity metadata proxy resource that facilitates the managed identity provisioning. |
> | Microsoft.HybridContainerService/provisionedClusterInstances/hybridIdentityMetadata/delete | Deletes the hybrid identity metadata proxy resource. |
> | Microsoft.HybridContainerService/provisionedClusterInstances/hybridIdentityMetadata/read | Lists the hybrid identity metadata proxy resource in a provisioned cluster instance. |
> | Microsoft.HybridContainerService/provisionedClusterInstances/upgradeProfiles/read | read upgradeProfiles |
> | Microsoft.HybridContainerService/provisionedClusters/read | Gets the Hybrid AKS provisioned cluster |
> | Microsoft.HybridContainerService/provisionedClusters/write | Creates the Hybrid AKS provisioned cluster |
> | Microsoft.HybridContainerService/provisionedClusters/delete | Deletes the Hybrid AKS provisioned cluster |
> | Microsoft.HybridContainerService/provisionedClusters/write | Updates the Hybrid AKS provisioned cluster |
> | Microsoft.HybridContainerService/provisionedClusters/read | Gets the Hybrid AKS provisioned cluster in a resource group |
> | Microsoft.HybridContainerService/provisionedClusters/read | Gets the Hybrid AKS provisioned cluster in a subscription |
> | Microsoft.HybridContainerService/provisionedClusters/upgradeNodeImageVersionForEntireCluster/action | Upgrading the node image version of a cluster applies the newest OS and runtime updates to the nodes. |
> | Microsoft.HybridContainerService/provisionedClusters/listClusterUserCredential/action | Lists the AAD user credentials of a provisioned cluster used only in direct mode. |
> | Microsoft.HybridContainerService/provisionedClusters/listClusterAdminCredential/action | Lists the admin credentials of a provisioned cluster used only in direct mode. |
> | Microsoft.HybridContainerService/provisionedClusters/agentPools/read | Gets the agent pool in the Hybrid AKS provisioned cluster |
> | Microsoft.HybridContainerService/provisionedClusters/agentPools/write | Creates the agent pool in the Hybrid AKS provisioned cluster |
> | Microsoft.HybridContainerService/provisionedClusters/agentPools/delete | Deletes the agent pool in the Hybrid AKS provisioned cluster |
> | Microsoft.HybridContainerService/provisionedClusters/agentPools/write | Updates the agent pool in the Hybrid AKS provisioned cluster |
> | Microsoft.HybridContainerService/provisionedClusters/agentPools/read | Gets the agent pools in the Hybrid AKS provisioned cluster |
> | Microsoft.HybridContainerService/provisionedClusters/hybridIdentityMetadata/read | Get the hybrid identity metadata proxy resource. |
> | Microsoft.HybridContainerService/provisionedClusters/hybridIdentityMetadata/write | Creates the hybrid identity metadata proxy resource that facilitates the managed identity provisioning. |
> | Microsoft.HybridContainerService/provisionedClusters/hybridIdentityMetadata/delete | Deletes the hybrid identity metadata proxy resource. |
> | Microsoft.HybridContainerService/provisionedClusters/hybridIdentityMetadata/read | Lists the hybrid identity metadata proxy resource in a cluster. |
> | Microsoft.HybridContainerService/provisionedClusters/upgradeProfiles/read | read upgradeProfiles |
> | Microsoft.HybridContainerService/skus/read | Gets the supported VM skus from the underlying custom location |
> | Microsoft.HybridContainerService/skus/write | Puts the VM SKUs resource type |
> | Microsoft.HybridContainerService/skus/delete | Deletes the Vm Sku resource type |
> | Microsoft.HybridContainerService/skus/read | Lists the supported VM SKUs from the underlying custom location |
> | Microsoft.HybridContainerService/storageSpaces/read | Gets the Hybrid AKS storage space object |
> | Microsoft.HybridContainerService/storageSpaces/write | Puts the Hybrid AKS storage object |
> | Microsoft.HybridContainerService/storageSpaces/delete | Deletes the Hybrid AKS storage object |
> | Microsoft.HybridContainerService/storageSpaces/write | Patches the Hybrid AKS storage object |
> | Microsoft.HybridContainerService/storageSpaces/read | List the Hybrid AKS storage object by resource group |
> | Microsoft.HybridContainerService/storageSpaces/read | List the Hybrid AKS storage object by subscription |
> | Microsoft.HybridContainerService/virtualNetworks/read | Gets the Hybrid AKS virtual network |
> | Microsoft.HybridContainerService/virtualNetworks/write | Puts the Hybrid AKS virtual network |
> | Microsoft.HybridContainerService/virtualNetworks/delete | Deletes the Hybrid AKS virtual network |
> | Microsoft.HybridContainerService/virtualNetworks/write | Patches the Hybrid AKS virtual network |
> | Microsoft.HybridContainerService/virtualNetworks/read | Lists the Hybrid AKS virtual networks by resource group |
> | Microsoft.HybridContainerService/virtualNetworks/read | Lists the Hybrid AKS virtual networks by subscription |

## Microsoft.Kubernetes

Azure service: [Azure Arc-enabled Kubernetes](/azure/azure-arc/kubernetes/overview)

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

## Microsoft.KubernetesConfiguration

Azure service: [Azure Arc-enabled Kubernetes](/azure/azure-arc/kubernetes/overview)

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

## Microsoft.ResourceConnector

Azure service: Microsoft ResourceConnector

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.ResourceConnector/register/action | Registers the subscription for Appliances resource provider and enables the creation of Appliance. |
> | Microsoft.ResourceConnector/unregister/action | Unregisters the subscription for Appliances resource provider and disables the creation of Appliance. |
> | Microsoft.ResourceConnector/appliances/read | Gets an Appliance resource |
> | Microsoft.ResourceConnector/appliances/write | Creates or Updates Appliance resource |
> | Microsoft.ResourceConnector/appliances/delete | Deletes Appliance resource |
> | Microsoft.ResourceConnector/appliances/listClusterUserCredential/action | Get an appliance cluster user credential |
> | Microsoft.ResourceConnector/appliances/listKeys/action | Get an appliance cluster customer user keys |
> | Microsoft.ResourceConnector/appliances/upgradeGraphs/read | Gets the upgrade graph of Appliance cluster |
> | Microsoft.ResourceConnector/locations/operationresults/read | Get result of Appliance operation |
> | Microsoft.ResourceConnector/locations/operationsstatus/read | Get result of Appliance operation |
> | Microsoft.ResourceConnector/operations/read | Gets list of Available Operations for Appliances |
> | Microsoft.ResourceConnector/telemetryconfig/read | Get Appliances telemetry config utilized by Appliances CLI |

## Next steps

- [Azure resource providers and types](/azure/azure-resource-manager/management/resource-providers-and-types)
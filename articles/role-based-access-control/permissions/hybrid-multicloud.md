---
title: Azure permissions for Hybrid + multicloud - Azure RBAC
description: Lists the permissions for the Azure resource providers in the Hybrid + multicloud category.
ms.service: role-based-access-control
ms.topic: reference
author: rolyon
manager: amycolannino
ms.author: rolyon
ms.date: 02/07/2024
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
> | Microsoft.AzureStackHCI/VirtualMachineInstances/Delete | Deletes virtual machine instance resource |
> | Microsoft.AzureStackHCI/VirtualMachineInstances/Write | Creates/Updates virtual machine instance resource |
> | Microsoft.AzureStackHCI/VirtualMachineInstances/Read | Gets/Lists virtual machine instance resource |
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
> | Microsoft.HybridCompute/locations/machines/extensions/notifyExtension/action | Notifies Microsoft.HybridCompute about extensions updates |
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

## Next steps

- [Azure resource providers and types](/azure/azure-resource-manager/management/resource-providers-and-types)
---
title: Azure permissions for Internet of Things - Azure RBAC
description: Lists the permissions for the Azure resource providers in the Internet of Things category.
ms.service: role-based-access-control
ms.topic: generated-reference
author: rolyon
manager: pmwongera
ms.author: rolyon
ms.date: 02/23/2026
ms.custom: generated
---

# Azure permissions for Internet of Things

This article lists the permissions for the Azure resource providers in the Internet of Things category. You can use these permissions in your own [Azure custom roles](/azure/role-based-access-control/custom-roles) to provide granular access control to resources in Azure. Permission strings have the following format: `{Company}.{ProviderName}/{resourceType}/{action}`


## Microsoft.AzureSphere

Azure service: [Azure Sphere](/azure-sphere/product-overview/what-is-azure-sphere)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.AzureSphere/register/action | Register the subscription for Microsoft.AzureSphere |
> | Microsoft.AzureSphere/unregister/action | Unregister the subscription for Microsoft.AzureSphere |
> | Microsoft.AzureSphere/catalogs/countDevices/action | Counts devices in catalog. |
> | Microsoft.AzureSphere/catalogs/listDeployments/action | Lists deployments for catalog. |
> | Microsoft.AzureSphere/catalogs/listDeviceGroups/action | List the device groups for the catalog. |
> | Microsoft.AzureSphere/catalogs/listDeviceInsights/action | Lists device insights for catalog. |
> | Microsoft.AzureSphere/catalogs/listDevices/action | Lists devices for catalog. |
> | Microsoft.AzureSphere/catalogs/read | List Catalog resources by subscription ID |
> | Microsoft.AzureSphere/catalogs/read | List Catalog resources by resource group |
> | Microsoft.AzureSphere/catalogs/read | Get a Catalog |
> | Microsoft.AzureSphere/catalogs/write | Create a Catalog |
> | Microsoft.AzureSphere/catalogs/delete | Delete a Catalog |
> | Microsoft.AzureSphere/catalogs/write | Update a Catalog |
> | Microsoft.AzureSphere/catalogs/uploadImage/action | Creates an image. Use this action when the image ID is unknown. |
> | Microsoft.AzureSphere/catalogs/certificates/read | List Certificate resources by Catalog |
> | Microsoft.AzureSphere/catalogs/certificates/read | Get a Certificate |
> | Microsoft.AzureSphere/catalogs/certificates/retrieveCertChain/action | Retrieves cert chain. |
> | Microsoft.AzureSphere/catalogs/certificates/retrieveProofOfPossessionNonce/action | Gets the proof of possession nonce. |
> | Microsoft.AzureSphere/catalogs/images/read | List Image resources by Catalog |
> | Microsoft.AzureSphere/catalogs/images/read | Get a Image |
> | Microsoft.AzureSphere/catalogs/images/write | Create a Image |
> | Microsoft.AzureSphere/catalogs/images/delete | Delete a Image |
> | Microsoft.AzureSphere/catalogs/products/read | List Product resources by Catalog |
> | Microsoft.AzureSphere/catalogs/products/read | Get a Product. '.default' and '.unassigned' are system defined values and cannot be used for product name. |
> | Microsoft.AzureSphere/catalogs/products/write | Create a Product. '.default' and '.unassigned' are system defined values and cannot be used for product name. |
> | Microsoft.AzureSphere/catalogs/products/delete | Delete a Product. '.default' and '.unassigned' are system defined values and cannot be used for product name' |
> | Microsoft.AzureSphere/catalogs/products/write | Update a Product. '.default' and '.unassigned' are system defined values and cannot be used for product name. |
> | Microsoft.AzureSphere/catalogs/products/countDevices/action | Counts devices in product. '.default' and '.unassigned' are system defined values and cannot be used for product name. |
> | Microsoft.AzureSphere/catalogs/products/generateDefaultDeviceGroups/action | Generates default device groups for the product. '.default' and '.unassigned' are system defined values and cannot be used for product name. |
> | Microsoft.AzureSphere/catalogs/products/deviceGroups/read | List DeviceGroup resources by Product. '.default' and '.unassigned' are system defined values and cannot be used for product name. |
> | Microsoft.AzureSphere/catalogs/products/deviceGroups/read | Get a DeviceGroup. '.default' and '.unassigned' are system defined values and cannot be used for product or device group name. |
> | Microsoft.AzureSphere/catalogs/products/deviceGroups/write | Create a DeviceGroup. '.default' and '.unassigned' are system defined values and cannot be used for product or device group name. |
> | Microsoft.AzureSphere/catalogs/products/deviceGroups/delete | Delete a DeviceGroup. '.default' and '.unassigned' are system defined values and cannot be used for product or device group name. |
> | Microsoft.AzureSphere/catalogs/products/deviceGroups/write | Update a DeviceGroup. '.default' and '.unassigned' are system defined values and cannot be used for product or device group name. |
> | Microsoft.AzureSphere/catalogs/products/deviceGroups/claimDevices/action | Bulk claims the devices. Use '.unassigned' or '.default' for the device group and product names when bulk claiming devices to a catalog only. |
> | Microsoft.AzureSphere/catalogs/products/deviceGroups/countDevices/action | Counts devices in device group. '.default' and '.unassigned' are system defined values and cannot be used for product or device group name. |
> | Microsoft.AzureSphere/catalogs/products/deviceGroups/deployments/read | List Deployment resources by DeviceGroup. '.default' and '.unassigned' are system defined values and cannot be used for product or device group name. |
> | Microsoft.AzureSphere/catalogs/products/deviceGroups/deployments/read | Get a Deployment. '.default' and '.unassigned' are system defined values and cannot be used for product or device group name. |
> | Microsoft.AzureSphere/catalogs/products/deviceGroups/deployments/write | Create a Deployment. '.default' and '.unassigned' are system defined values and cannot be used for product or device group name. |
> | Microsoft.AzureSphere/catalogs/products/deviceGroups/deployments/delete | Delete a Deployment. '.default' and '.unassigned' are system defined values and cannot be used for product or device group name. |
> | Microsoft.AzureSphere/catalogs/products/deviceGroups/devices/read | List Device resources by DeviceGroup. '.default' and '.unassigned' are system defined values and cannot be used for product or device group name. |
> | Microsoft.AzureSphere/catalogs/products/deviceGroups/devices/read | Get a Device. Use '.unassigned' or '.default' for the device group and product names when a device does not belong to a device group and product. |
> | Microsoft.AzureSphere/catalogs/products/deviceGroups/devices/write | Create a Device. Use '.unassigned' or '.default' for the device group and product names to claim a device to the catalog only. |
> | Microsoft.AzureSphere/catalogs/products/deviceGroups/devices/delete | Delete a Device |
> | Microsoft.AzureSphere/catalogs/products/deviceGroups/devices/write | Update a Device. Use '.unassigned' or '.default' for the device group and product names to move a device to the catalog level. |
> | Microsoft.AzureSphere/catalogs/products/deviceGroups/devices/generateCapabilityImage/action | Generates the capability image for the device. Use '.unassigned' or '.default' for the device group and product names to generate the image for a device that does not belong to a specific device group and product. |
> | Microsoft.AzureSphere/locations/operationStatuses/read | read operationStatuses |
> | Microsoft.AzureSphere/locations/operationStatuses/write | write operationStatuses |
> | Microsoft.AzureSphere/operations/read | read operations |

## Microsoft.Devices

Ensure that your users are accessing your resources from devices that meet your standards for security and compliance.

Azure service: [IoT Hub](/azure/iot-hub/), [IoT Hub Device Provisioning Service](/azure/iot-dps/)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.Devices/register/action | Register the subscription for the IotHub resource provider and enables the creation of IotHub resources |
> | Microsoft.Devices/checkNameAvailability/Action | Check If IotHub name is available |
> | Microsoft.Devices/iotHubs/Read | Gets the IotHub resource(s) |
> | Microsoft.Devices/iotHubs/Write | Create or update IotHub Resource |
> | Microsoft.Devices/iotHubs/Delete | Delete IotHub Resource |
> | Microsoft.Devices/iotHubs/listkeys/Action | Get all IotHub Keys |
> | Microsoft.Devices/iotHubs/exportDevices/Action | Export Devices |
> | Microsoft.Devices/iotHubs/importDevices/Action | Import Devices |
> | Microsoft.Devices/iotHubs/notifyNetworkSecurityPerimeterUpdatesAvailable/Action | Notify RP that an associated NSP has profile updates. |
> | Microsoft.Devices/iotHubs/privateEndpointConnectionsApproval/Action | Approve or reject a private endpoint connection |
> | Microsoft.Devices/iotHubs/networkSecurityPerimeterConfigurations/Action | Reconcile NSP configuration profile from NSP RP |
> | Microsoft.Devices/iotHubs/certificates/Read | Gets the Certificate |
> | Microsoft.Devices/iotHubs/certificates/Write | Create or Update Certificate |
> | Microsoft.Devices/iotHubs/certificates/Delete | Deletes Certificate |
> | Microsoft.Devices/iotHubs/certificates/generateVerificationCode/Action | Generate Verification code |
> | Microsoft.Devices/iotHubs/certificates/verify/Action | Verify Certificate resource |
> | Microsoft.Devices/IotHubs/diagnosticSettings/read | Gets the diagnostic setting for the resource |
> | Microsoft.Devices/IotHubs/diagnosticSettings/write | Creates or updates the diagnostic setting for the resource |
> | Microsoft.Devices/iotHubs/eventGridFilters/Write | Create new or Update existing Event Grid filter |
> | Microsoft.Devices/iotHubs/eventGridFilters/Read | Gets the Event Grid filter |
> | Microsoft.Devices/iotHubs/eventGridFilters/Delete | Deletes the Event Grid filter |
> | Microsoft.Devices/iotHubs/eventHubEndpoints/consumerGroups/Write | Create EventHub Consumer Group |
> | Microsoft.Devices/iotHubs/eventHubEndpoints/consumerGroups/Read | Get EventHub Consumer Group(s) |
> | Microsoft.Devices/iotHubs/eventHubEndpoints/consumerGroups/Delete | Delete EventHub Consumer Group |
> | Microsoft.Devices/iotHubs/iotHubKeys/listkeys/Action | Get IotHub Key for the given name |
> | Microsoft.Devices/iotHubs/iotHubStats/Read | Get IotHub Statistics |
> | Microsoft.Devices/iotHubs/jobs/Read | Get Job(s) details submitted on given IotHub |
> | Microsoft.Devices/IotHubs/logDefinitions/read | Gets the available log definitions for the IotHub Service |
> | Microsoft.Devices/IotHubs/metricDefinitions/read | Gets the available metrics for the IotHub service |
> | Microsoft.Devices/iotHubs/networkSecurityPerimeterAssociationProxies/Read | List all NSP association proxies associated with the IotHub |
> | Microsoft.Devices/iotHubs/networkSecurityPerimeterAssociationProxies/Write | Put an NSP association proxy on the IotHub to associate the resource with the NSP |
> | Microsoft.Devices/iotHubs/networkSecurityPerimeterAssociationProxies/Delete | Delete an NSP association proxy to disassociate the IotHub resource from the NSP |
> | Microsoft.Devices/iotHubs/networkSecurityPerimeterConfigurations/Read | List all NSP configurations associated with the IotHub |
> | Microsoft.Devices/iotHubs/operationresults/Read | Get Operation Result (Obsolete API) |
> | Microsoft.Devices/iotHubs/privateEndpointConnectionProxies/validate/Action | Validates private endpoint connection proxy input during create |
> | Microsoft.Devices/iotHubs/privateEndpointConnectionProxies/Read | Gets properties for specified private endpoint connection proxy |
> | Microsoft.Devices/iotHubs/privateEndpointConnectionProxies/Write | Creates or updates a private endpoint connection proxy |
> | Microsoft.Devices/iotHubs/privateEndpointConnectionProxies/Delete | Deletes an existing private endpoint connection proxy |
> | Microsoft.Devices/iotHubs/privateEndpointConnectionProxies/operationResults/Read | Get the result of an async operation on a private endpoint connection proxy |
> | Microsoft.Devices/iotHubs/privateEndpointConnections/Read | Gets all the private endpoint connections for the specified iot hub |
> | Microsoft.Devices/iotHubs/privateEndpointConnections/Delete | Deletes an existing private endpoint connection |
> | Microsoft.Devices/iotHubs/privateEndpointConnections/Write | Creates or updates a private endpoint connection |
> | Microsoft.Devices/iotHubs/privateEndpointConnections/operationResults/Read | Get the result of an async operation on a private endpoint connection |
> | Microsoft.Devices/iotHubs/privateLinkResources/Read | Gets private link resources for IotHub |
> | Microsoft.Devices/iotHubs/quotaMetrics/Read | Get Quota Metrics |
> | Microsoft.Devices/iotHubs/routing/$testall/Action | Test a message against all existing Routes |
> | Microsoft.Devices/iotHubs/routing/$testnew/Action | Test a message against a provided test Route |
> | Microsoft.Devices/iotHubs/routingEndpointsHealth/Read | Gets the health of all routing Endpoints for an IotHub |
> | Microsoft.Devices/iotHubs/securitySettings/Write | Update the Azure Security Center settings on Iot Hub |
> | Microsoft.Devices/iotHubs/securitySettings/Read | Get the Azure Security Center settings on Iot Hub |
> | Microsoft.Devices/iotHubs/securitySettings/operationResults/Read | Get the result of the Async Put operation for Iot Hub SecuritySettings |
> | Microsoft.Devices/iotHubs/skus/Read | Get valid IotHub Skus |
> | Microsoft.Devices/locations/operationresults/Read | Get Location based Operation Result |
> | Microsoft.Devices/operationresults/Read | Get Operation Result |
> | Microsoft.Devices/operations/Read | Get All ResourceProvider Operations |
> | Microsoft.Devices/provisioningServices/Read | Get IotDps resource |
> | Microsoft.Devices/provisioningServices/Write | Create IotDps resource |
> | Microsoft.Devices/provisioningServices/Delete | Delete IotDps resource |
> | Microsoft.Devices/provisioningServices/listkeys/Action | Get all IotDps keys |
> | Microsoft.Devices/provisioningServices/privateEndpointConnectionsApproval/Action | Approve or reject a private endpoint connection |
> | Microsoft.Devices/provisioningServices/certificates/Read | Gets the Certificate |
> | Microsoft.Devices/provisioningServices/certificates/Write | Create or Update Certificate |
> | Microsoft.Devices/provisioningServices/certificates/Delete | Deletes Certificate |
> | Microsoft.Devices/provisioningServices/certificates/generateVerificationCode/Action | Generate Verification code |
> | Microsoft.Devices/provisioningServices/certificates/verify/Action | Verify Certificate resource |
> | Microsoft.Devices/provisioningServices/diagnosticSettings/read | Gets the diagnostic setting for the resource |
> | Microsoft.Devices/provisioningServices/diagnosticSettings/write | Creates or updates the diagnostic setting for the resource |
> | Microsoft.Devices/provisioningServices/keys/listkeys/Action | Get IotDps Keys for key name |
> | Microsoft.Devices/provisioningServices/logDefinitions/read | Gets the available log definitions for the provisioning Service |
> | Microsoft.Devices/provisioningServices/metricDefinitions/read | Gets the available metrics for the provisioning service |
> | Microsoft.Devices/provisioningServices/operationresults/Read | Get DPS Operation Result |
> | Microsoft.Devices/provisioningServices/privateEndpointConnectionProxies/validate/Action | Validates private endpoint connection proxy input during create |
> | Microsoft.Devices/provisioningServices/privateEndpointConnectionProxies/Read | Gets properties for specified private endpoint connection proxy |
> | Microsoft.Devices/provisioningServices/privateEndpointConnectionProxies/Write | Creates or updates a private endpoint connection proxy |
> | Microsoft.Devices/provisioningServices/privateEndpointConnectionProxies/Delete | Deletes an existing private endpoint connection proxy |
> | Microsoft.Devices/provisioningServices/privateEndpointConnectionProxies/operationResults/Read | Get the result of an async operation on a private endpoint connection proxy |
> | Microsoft.Devices/provisioningServices/privateEndpointConnections/Read | Gets all the private endpoint connections for the specified iot hub |
> | Microsoft.Devices/provisioningServices/privateEndpointConnections/Delete | Deletes an existing private endpoint connection |
> | Microsoft.Devices/provisioningServices/privateEndpointConnections/Write | Creates or updates a private endpoint connection |
> | Microsoft.Devices/provisioningServices/privateEndpointConnections/operationResults/Read | Get the result of an async operation on a private endpoint connection |
> | Microsoft.Devices/provisioningServices/privateLinkResources/Read | Gets private link resources for IotHub |
> | Microsoft.Devices/provisioningServices/skus/Read | Get valid IotDps Skus |
> | Microsoft.Devices/usages/Read | Get subscription usage details for this provider. |
> | **DataAction** | **Description** |
> | Microsoft.Devices/IotHubs/cloudToDeviceMessages/send/action | Send cloud-to-device message to any device  |
> | Microsoft.Devices/IotHubs/cloudToDeviceMessages/feedback/action | Receive, complete, or abandon cloud-to-device message feedback notification |
> | Microsoft.Devices/IotHubs/cloudToDeviceMessages/queue/purge/action | Deletes all the pending commands for a device |
> | Microsoft.Devices/IotHubs/configurations/read | Read device management configurations |
> | Microsoft.Devices/IotHubs/configurations/write | Create or update device management configurations |
> | Microsoft.Devices/IotHubs/configurations/delete | Delete any device management configuration |
> | Microsoft.Devices/IotHubs/configurations/applyToEdgeDevice/action | Applies the configuration content to an edge device |
> | Microsoft.Devices/IotHubs/configurations/testQueries/action | Validates target condition and custom metric queries for a configuration |
> | Microsoft.Devices/IotHubs/devices/read | Read any device or module identity |
> | Microsoft.Devices/IotHubs/devices/write | Create or update any device or module identity |
> | Microsoft.Devices/IotHubs/devices/delete | Delete any device or module identity |
> | Microsoft.Devices/IotHubs/directMethods/invoke/action | Invokes a direct method on a device |
> | Microsoft.Devices/IotHubs/fileUpload/notifications/action | Receive, complete, or abandon file upload notifications |
> | Microsoft.Devices/IotHubs/jobs/read | Return a list of jobs |
> | Microsoft.Devices/IotHubs/jobs/write | Create or update any job |
> | Microsoft.Devices/IotHubs/jobs/delete | Delete any job |
> | Microsoft.Devices/IotHubs/statistics/read | Read device and service statistics |
> | Microsoft.Devices/IotHubs/twins/read | Read any device or module twin |
> | Microsoft.Devices/IotHubs/twins/write | Write any device or module twin |
> | Microsoft.Devices/provisioningServices/attestationmechanism/details/action | Fetch Attestation Mechanism Details |
> | Microsoft.Devices/provisioningServices/enrollmentGroups/read | Read Enrollment Groups |
> | Microsoft.Devices/provisioningServices/enrollmentGroups/write | Write Enrollment Groups |
> | Microsoft.Devices/provisioningServices/enrollmentGroups/delete | Delete Enrollment Groups |
> | Microsoft.Devices/provisioningServices/enrollments/read | Read Enrollments |
> | Microsoft.Devices/provisioningServices/enrollments/write | Write Enrollments |
> | Microsoft.Devices/provisioningServices/enrollments/delete | Delete Enrollments |
> | Microsoft.Devices/provisioningServices/registrationStates/read | Read Registration States |
> | Microsoft.Devices/provisioningServices/registrationStates/delete | Delete Registration States |

## Microsoft.DeviceUpdate

Azure service: [Device Update for IoT Hub](/azure/iot-hub-device-update/)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.DeviceUpdate/checkNameAvailability/action | Checks Name Availability |
> | Microsoft.DeviceUpdate/register/action | Registers Device Update |
> | Microsoft.DeviceUpdate/unregister/action | Unregisters Device Update |
> | Microsoft.DeviceUpdate/accounts/read | Returns the list of Device Update Accounts |
> | Microsoft.DeviceUpdate/accounts/write | Creates or updates a Device Update Account |
> | Microsoft.DeviceUpdate/accounts/delete | Deletes a Device Update Account |
> | Microsoft.DeviceUpdate/accounts/agents/read | Returns the list of Device Update Agents |
> | Microsoft.DeviceUpdate/accounts/agents/write | Creates or updates a Device Update Agent |
> | Microsoft.DeviceUpdate/accounts/agents/delete | Deletes a Device Update Agent |
> | Microsoft.DeviceUpdate/accounts/instances/read | Returns the list of Device Update Instances |
> | Microsoft.DeviceUpdate/accounts/instances/write | Creates or updates a Device Update Instance |
> | Microsoft.DeviceUpdate/accounts/instances/delete | Deletes a Device Update Instance |
> | Microsoft.DeviceUpdate/accounts/privateEndpointConnectionProxies/read | Returns the list of Device Update Private Endpoint Connection Proxies |
> | Microsoft.DeviceUpdate/accounts/privateEndpointConnectionProxies/write | Creates or updates a Device Update Private Endpoint Connection Proxy |
> | Microsoft.DeviceUpdate/accounts/privateEndpointConnectionProxies/delete | Deletes a Device Update Private Endpoint Connection Proxy |
> | Microsoft.DeviceUpdate/accounts/privateEndpointConnectionProxies/validate/action | Validates a Device Update Private Endpoint Connection Proxy |
> | Microsoft.DeviceUpdate/accounts/privateEndpointConnections/read | Returns the list of Device Update Private Endpoint Connections |
> | Microsoft.DeviceUpdate/accounts/privateEndpointConnections/write | Creates or updates a Device Update Private Endpoint Connection |
> | Microsoft.DeviceUpdate/accounts/privateEndpointConnections/delete | Deletes a Device Update Private Endpoint Connection |
> | Microsoft.DeviceUpdate/accounts/privateLinkResources/read | Returns the list of Device Update Private Link Resources |
> | Microsoft.DeviceUpdate/locations/operationStatuses/read | Gets an Operation Status |
> | Microsoft.DeviceUpdate/locations/operationStatuses/write | Updates an Operation Status |
> | Microsoft.DeviceUpdate/operations/read | Lists Device Update Operations |
> | Microsoft.DeviceUpdate/registeredSubscriptions/read | Reads registered subscriptions |
> | **DataAction** | **Description** |
> | Microsoft.DeviceUpdate/accounts/instances/management/read | Performs a read operation related to management |
> | Microsoft.DeviceUpdate/accounts/instances/management/write | Performs a write operation related to management |
> | Microsoft.DeviceUpdate/accounts/instances/management/delete | Performs a delete operation related to management |
> | Microsoft.DeviceUpdate/accounts/instances/updates/read | Performs a read operation related to updates |
> | Microsoft.DeviceUpdate/accounts/instances/updates/write | Performs a write operation related to updates |
> | Microsoft.DeviceUpdate/accounts/instances/updates/delete | Performs a delete operation related to updates |
> | Microsoft.DeviceUpdate/updateAccounts/agents/requestUpdate/action | Perform all operations related to agent updating (i.e. request updates & report update results) |

## Microsoft.DigitalTwins

Azure service: [Azure Digital Twins](/azure/digital-twins/)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.DigitalTwins/register/action | Register the Subscription for the Digital Twins resource provider and enable the creation of Digital Twins instances. |
> | Microsoft.DigitalTwins/unregister/action | Unregister the subscription for the Digital Twins Resource Provider |
> | Microsoft.DigitalTwins/digitalTwinsInstances/read | Read any Microsoft.DigitalTwins/digitalTwinsInstances resource |
> | Microsoft.DigitalTwins/digitalTwinsInstances/write | Create or update any Microsoft.DigitalTwins/digitalTwinsInstances resource |
> | Microsoft.DigitalTwins/digitalTwinsInstances/delete | Delete a Microsoft.DigitalTwins/digitalTwinsInstances resource |
> | Microsoft.DigitalTwins/digitalTwinsInstances/PrivateEndpointConnectionsApproval/action | Approve PrivateEndpointConnection resource |
> | Microsoft.DigitalTwins/digitalTwinsInstances/diagnosticSettings/read | Gets the diagnostic settings for the resource |
> | Microsoft.DigitalTwins/digitalTwinsInstances/diagnosticSettings/write | Sets the diagnostic settings for the resource |
> | Microsoft.DigitalTwins/digitalTwinsInstances/endpoints/delete | Delete any Endpoint of a Digital Twins resource |
> | Microsoft.DigitalTwins/digitalTwinsInstances/endpoints/read | Read any Endpoint of a Digital Twins resource |
> | Microsoft.DigitalTwins/digitalTwinsInstances/endpoints/write | Create or Update any Endpoint of a Digital Twins resource |
> | Microsoft.DigitalTwins/digitalTwinsInstances/logDefinitions/read | Gets the log settings for the resource's Azure Monitor |
> | Microsoft.DigitalTwins/digitalTwinsInstances/metricDefinitions/read | Gets the metric settings for the resource's Azure Monitor |
> | Microsoft.DigitalTwins/digitalTwinsInstances/operationResults/read | Read any Operation Result |
> | Microsoft.DigitalTwins/digitalTwinsInstances/privateEndpointConnectionProxies/validate/action | Validate PrivateEndpointConnectionProxies resource |
> | Microsoft.DigitalTwins/digitalTwinsInstances/privateEndpointConnectionProxies/read | Read PrivateEndpointConnectionProxies resource |
> | Microsoft.DigitalTwins/digitalTwinsInstances/privateEndpointConnectionProxies/write | Write PrivateEndpointConnectionProxies resource |
> | Microsoft.DigitalTwins/digitalTwinsInstances/privateEndpointConnectionProxies/delete | Delete PrivateEndpointConnectionProxies resource |
> | Microsoft.DigitalTwins/digitalTwinsInstances/privateEndpointConnectionProxies/operationResults/read | Get the result of an async operation on a private endpoint connection proxy |
> | Microsoft.DigitalTwins/digitalTwinsInstances/privateEndpointConnections/read | Read PrivateEndpointConnection resource |
> | Microsoft.DigitalTwins/digitalTwinsInstances/privateEndpointConnections/write | Write PrivateEndpointConnection resource |
> | Microsoft.DigitalTwins/digitalTwinsInstances/privateEndpointConnections/delete | Delete PrivateEndpointConnection resource |
> | Microsoft.DigitalTwins/digitalTwinsInstances/privateEndpointConnections/operationResults/read | Get the result of an async operation on a private endpoint connection |
> | Microsoft.DigitalTwins/digitalTwinsInstances/privateLinkResources/read | Reads PrivateLinkResources for Digital Twins |
> | Microsoft.DigitalTwins/digitalTwinsInstances/timeSeriesDatabaseConnections/delete | Delete any time series database connection of a Digital Twins resource |
> | Microsoft.DigitalTwins/digitalTwinsInstances/timeSeriesDatabaseConnections/read | Read any time series database connection of a Digital Twins resource |
> | Microsoft.DigitalTwins/digitalTwinsInstances/timeSeriesDatabaseConnections/write | Create any time series database connection of a Digital Twins resource |
> | Microsoft.DigitalTwins/locations/checkNameAvailability/action | Check Name Availability of a resource in the Digital Twins Resource Provider |
> | Microsoft.DigitalTwins/locations/operationResults/read | Read any Operation Result |
> | Microsoft.DigitalTwins/locations/operationsStatuses/read | Read any Operation Status |
> | Microsoft.DigitalTwins/operations/read | Read all Operations |
> | **DataAction** | **Description** |
> | Microsoft.DigitalTwins/query/action | Query any Digital Twins Graph |
> | Microsoft.DigitalTwins/digitaltwins/read | Read any Digital Twin |
> | Microsoft.DigitalTwins/digitaltwins/write | Create or Update any Digital Twin |
> | Microsoft.DigitalTwins/digitaltwins/delete | Delete any Digital Twin |
> | Microsoft.DigitalTwins/digitaltwins/commands/action | Invoke any Command on a Digital Twin |
> | Microsoft.DigitalTwins/digitaltwins/relationships/read | Read any Digital Twin Relationship |
> | Microsoft.DigitalTwins/digitaltwins/relationships/write | Create or Update any Digital Twin Relationship |
> | Microsoft.DigitalTwins/digitaltwins/relationships/delete | Delete any Digital Twin Relationship |
> | Microsoft.DigitalTwins/eventroutes/read | Read any Event Route |
> | Microsoft.DigitalTwins/eventroutes/delete | Delete any Event Route |
> | Microsoft.DigitalTwins/eventroutes/write | Create or Update any Event Route |
> | Microsoft.DigitalTwins/jobs/delete/read | Read any Bulk Delete Job |
> | Microsoft.DigitalTwins/jobs/delete/write | Create any Bulk Delete Job |
> | Microsoft.DigitalTwins/jobs/deletions/read | Read any Bulk Delete Job |
> | Microsoft.DigitalTwins/jobs/deletions/write | Create any Bulk Delete Job |
> | Microsoft.DigitalTwins/jobs/import/read | Read any Bulk Import Job |
> | Microsoft.DigitalTwins/jobs/imports/read | Read any Bulk Import Job |
> | Microsoft.DigitalTwins/jobs/imports/write | Create any Bulk Import Job |
> | Microsoft.DigitalTwins/jobs/imports/delete | Delete any Bulk Import Job |
> | Microsoft.DigitalTwins/jobs/imports/cancel/action | Cancel any Bulk Import Job |
> | Microsoft.DigitalTwins/models/read | Read any Model |
> | Microsoft.DigitalTwins/models/write | Create or Update any Model |
> | Microsoft.DigitalTwins/models/delete | Delete any Model |

## Microsoft.Edge

Azure service: Microsoft.Edge

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.Edge/register/action | Register the subscription for Microsoft.Edge |
> | Microsoft.Edge/unregister/action | Unregister the subscription for Microsoft.Edge |
> | Microsoft.Edge/capabilityLists/read | List by subscription |
> | Microsoft.Edge/capabilityLists/read | List by specified resource group |
> | Microsoft.Edge/capabilityLists/read | Get a Capability List Resource |
> | Microsoft.Edge/capabilityLists/write | Create or update a Capability List Resource |
> | Microsoft.Edge/capabilityLists/delete | Delete a Capability List Resource |
> | Microsoft.Edge/capabilityLists/write | update a Capability List Resource |
> | Microsoft.Edge/configTemplates/createVersion/action | Create or update a Config Template Version Resource with the specified UpdateType |
> | Microsoft.Edge/configTemplates/removeVersion/action | Remove Config Template Version Resource |
> | Microsoft.Edge/configTemplates/write | update a Config Template Resource |
> | Microsoft.Edge/configTemplates/delete | Delete a Config Template Resource |
> | Microsoft.Edge/configTemplates/write | Create or update a Config Template Resource |
> | Microsoft.Edge/configTemplates/read | Get a Config Template Resource |
> | Microsoft.Edge/configTemplates/read | List by specified resource group |
> | Microsoft.Edge/configTemplates/read | List by subscription |
> | Microsoft.Edge/configTemplates/linkToHierarchies/action | Apply a Config Template to a particular hierarchy node |
> | Microsoft.Edge/configTemplates/unLinkFromHierarchies/action | Remove a Config Template from a particular hierarchy node |
> | Microsoft.Edge/configTemplates/configTemplateMetadatas/read | List by ConfigTemplate |
> | Microsoft.Edge/configTemplates/configTemplateMetadatas/read | Get a ConfigTemplateMetadata Resource |
> | Microsoft.Edge/configTemplates/versions/read | List Config Template Version Resources |
> | Microsoft.Edge/configTemplates/versions/read | Get a Config Template Version Resource |
> | Microsoft.Edge/configTemplates/versions/configTemplateSchemas/read | List by ConfigTemplateVersion |
> | Microsoft.Edge/configTemplates/versions/configTemplateSchemas/read | Get a ConfigTemplateSchema Resource |
> | Microsoft.Edge/configurationReferences/read | List ConfigurationReference resources by parent |
> | Microsoft.Edge/configurationReferences/read | Get a ConfigurationReference |
> | Microsoft.Edge/configurationReferences/write | Create a ConfigurationReference |
> | Microsoft.Edge/configurationReferences/delete | Delete a ConfigurationReference |
> | Microsoft.Edge/configurationReferences/write | Update a ConfigurationReference |
> | Microsoft.Edge/configurations/read | List by subscription |
> | Microsoft.Edge/configurations/read | List by specified resource group |
> | Microsoft.Edge/configurations/read | Get a Configuration Resource |
> | Microsoft.Edge/configurations/write | Create or update a Configuration Resource |
> | Microsoft.Edge/configurations/delete | Delete a Configuration Resource |
> | Microsoft.Edge/configurations/write | Update a Configuration Resource |
> | Microsoft.Edge/configurations/arcGatewayConfigurations/read | List ArcGatewayConfiguration resources by Configuration |
> | Microsoft.Edge/configurations/arcGatewayConfigurations/read | Get a ArcGatewayConfiguration |
> | Microsoft.Edge/configurations/arcGatewayConfigurations/write | Create a ArcGatewayConfiguration |
> | Microsoft.Edge/configurations/arcGatewayConfigurations/delete | Delete a ArcGatewayConfiguration |
> | Microsoft.Edge/configurations/arcGatewayConfigurations/write | Update a ArcGatewayConfiguration |
> | Microsoft.Edge/configurations/connectivityConfigurations/read | List ConnectivityConfiguration resources by Configuration |
> | Microsoft.Edge/configurations/connectivityConfigurations/read | Get a ConnectivityConfiguration |
> | Microsoft.Edge/configurations/connectivityConfigurations/write | Create a ConnectivityConfiguration |
> | Microsoft.Edge/configurations/connectivityConfigurations/delete | Delete a ConnectivityConfiguration |
> | Microsoft.Edge/configurations/connectivityConfigurations/write | Update a ConnectivityConfiguration |
> | Microsoft.Edge/configurations/dynamicConfigurations/read | List Dynamic Configuration Resources |
> | Microsoft.Edge/configurations/dynamicConfigurations/read | Get a Dynamic Configuration Resource |
> | Microsoft.Edge/configurations/dynamicConfigurations/write | Create or update a Dynamic Configuration Resource |
> | Microsoft.Edge/configurations/dynamicConfigurations/delete | Delete a Dynamic Configuration Resource |
> | Microsoft.Edge/configurations/dynamicConfigurations/write | Update a Dynamic Configuration Resource |
> | Microsoft.Edge/configurations/dynamicConfigurations/versions/read | List Dynamic Configuration Version Resource |
> | Microsoft.Edge/configurations/dynamicConfigurations/versions/read | Get a Dynamic Configuration Version Resource |
> | Microsoft.Edge/configurations/dynamicConfigurations/versions/write | Create or update a Dynamic Configuration Version Resource |
> | Microsoft.Edge/configurations/dynamicConfigurations/versions/delete | Delete a Dynamic Configuration Version Resource |
> | Microsoft.Edge/configurations/dynamicConfigurations/versions/write | update a Dynamic Configuration Version Resource |
> | Microsoft.Edge/configurations/networkConfigurations/read | List NetworkConfiguration resources by Configuration |
> | Microsoft.Edge/configurations/networkConfigurations/read | Get a NetworkConfiguration |
> | Microsoft.Edge/configurations/networkConfigurations/write | Create a NetworkConfiguration |
> | Microsoft.Edge/configurations/networkConfigurations/delete | Delete a NetworkConfiguration |
> | Microsoft.Edge/configurations/networkConfigurations/write | Update a NetworkConfiguration |
> | Microsoft.Edge/configurations/provisioningConfigurations/read | List ProvisioningConfiguration resources by Configuration |
> | Microsoft.Edge/configurations/provisioningConfigurations/read | Get a ProvisioningConfiguration |
> | Microsoft.Edge/configurations/provisioningConfigurations/write | Create a ProvisioningConfiguration |
> | Microsoft.Edge/configurations/provisioningConfigurations/delete | Delete a ProvisioningConfiguration |
> | Microsoft.Edge/configurations/provisioningConfigurations/write | Update a ProvisioningConfiguration |
> | Microsoft.Edge/configurations/securityConfigurations/read | List SecurityConfiguration resources by Configuration |
> | Microsoft.Edge/configurations/securityConfigurations/read | Get a SecurityConfiguration |
> | Microsoft.Edge/configurations/securityConfigurations/write | Create a SecurityConfiguration |
> | Microsoft.Edge/configurations/securityConfigurations/delete | Delete a SecurityConfiguration |
> | Microsoft.Edge/configurations/securityConfigurations/write | Update a SecurityConfiguration |
> | Microsoft.Edge/configurations/timeServerConfigurations/read | List TimeServerConfiguration resources by Configuration |
> | Microsoft.Edge/configurations/timeServerConfigurations/read | Get a TimeServerConfiguration |
> | Microsoft.Edge/configurations/timeServerConfigurations/write | Create a TimeServerConfiguration |
> | Microsoft.Edge/configurations/timeServerConfigurations/delete | Delete a TimeServerConfiguration |
> | Microsoft.Edge/configurations/timeServerConfigurations/write | Update a TimeServerConfiguration |
> | Microsoft.Edge/configurationTemplates/createVersion/action | Create or update a Configuration Template Version Resource with the specified UpdateType |
> | Microsoft.Edge/configurationTemplates/removeVersion/action | Remove Configuration Template Version Resource |
> | Microsoft.Edge/configurationTemplates/read | List by subscription |
> | Microsoft.Edge/configurationTemplates/read | List by specified resource group |
> | Microsoft.Edge/configurationTemplates/read | Get a Configuration Template Resource |
> | Microsoft.Edge/configurationTemplates/write | Create or update a Configuration Template Resource |
> | Microsoft.Edge/configurationTemplates/delete | Delete a Configuration Template Resource |
> | Microsoft.Edge/configurationTemplates/write | update a Configuration Template Resource |
> | Microsoft.Edge/configurationTemplates/versions/read | List Configuration Template Version Resources |
> | Microsoft.Edge/configurationTemplates/versions/read | Get a Configuration Template Version Resource |
> | Microsoft.Edge/connectivityStatuses/read | List ConnectivityStatus resources by parent |
> | Microsoft.Edge/connectivityStatuses/read | Get a ConnectivityStatus |
> | Microsoft.Edge/connectivityStatuses/write | Create a ConnectivityStatus |
> | Microsoft.Edge/connectivityStatuses/delete | Delete a ConnectivityStatus |
> | Microsoft.Edge/connectivityStatuses/write | Update a ConnectivityStatus |
> | Microsoft.Edge/contexts/read | List by subscription |
> | Microsoft.Edge/contexts/read | List by specified resource group |
> | Microsoft.Edge/contexts/read | Get Context Resource |
> | Microsoft.Edge/contexts/write | Create or update Context Resource |
> | Microsoft.Edge/contexts/delete | Delete Context Resource |
> | Microsoft.Edge/contexts/write | update an Context Resource |
> | Microsoft.Edge/contexts/execute/action | Post request to execute |
> | Microsoft.Edge/contexts/publish/action | Post request to publish |
> | Microsoft.Edge/contexts/resolve/action | Post request to resolve configuration |
> | Microsoft.Edge/contexts/review/action | Post request to review configuration |
> | Microsoft.Edge/contexts/eventGridFilters/read | List Event Grid Filter Resources |
> | Microsoft.Edge/contexts/eventGridFilters/read | Get Event Grid Filter Resource |
> | Microsoft.Edge/contexts/eventGridFilters/write | Create or Update Event Grid Filter Resource |
> | Microsoft.Edge/contexts/eventGridFilters/delete | Delete Event Grid Filter Resource |
> | Microsoft.Edge/contexts/eventGridFilters/write | Update Event Grid Filter Resource |
> | Microsoft.Edge/contexts/siteReferences/read | List Site Reference Resources |
> | Microsoft.Edge/contexts/siteReferences/read | Get Site Reference Resource |
> | Microsoft.Edge/contexts/siteReferences/write | Get Site Reference Resource |
> | Microsoft.Edge/contexts/siteReferences/delete | Get Site Reference Resource |
> | Microsoft.Edge/contexts/siteReferences/write | Get Site Reference Resource |
> | Microsoft.Edge/contexts/workflows/read | List Workflow resources |
> | Microsoft.Edge/contexts/workflows/read | Get a Workflow resource |
> | Microsoft.Edge/contexts/workflows/write | Create or update a Workflow resource |
> | Microsoft.Edge/contexts/workflows/delete | Delete a Workflow resource |
> | Microsoft.Edge/contexts/workflows/write | update a Workflow resource |
> | Microsoft.Edge/contexts/workflows/versions/read | List Workflow Version Resources |
> | Microsoft.Edge/contexts/workflows/versions/read | Get a Workflow Version Resource |
> | Microsoft.Edge/contexts/workflows/versions/write | Create or update a Workflow Version Resource |
> | Microsoft.Edge/contexts/workflows/versions/delete | Delete a Workflow Version Resource |
> | Microsoft.Edge/contexts/workflows/versions/write | update an WorkflowVersion Resource |
> | Microsoft.Edge/contexts/workflows/versions/executions/read | List Execution Resources |
> | Microsoft.Edge/contexts/workflows/versions/executions/read | Get Execution Resource |
> | Microsoft.Edge/contexts/workflows/versions/executions/write | Create or update Execution Resource |
> | Microsoft.Edge/contexts/workflows/versions/executions/delete | Delete Execution Resource |
> | Microsoft.Edge/contexts/workflows/versions/executions/write | update an Execution Resource |
> | Microsoft.Edge/deploymentTargets/read | List by subscription |
> | Microsoft.Edge/deploymentTargets/read | List by specified resource group |
> | Microsoft.Edge/deploymentTargets/read | Get a Deployment Target Resource |
> | Microsoft.Edge/deploymentTargets/write | Create or update a Deployment Target Resource |
> | Microsoft.Edge/deploymentTargets/delete | Delete a Deployment Target Resource |
> | Microsoft.Edge/deploymentTargets/write | update a Deployment Target Resource |
> | Microsoft.Edge/diagnostics/read | Lists Diagnostics resources within an Azure subscription. |
> | Microsoft.Edge/diagnostics/read | Returns a collection of Diagnostic resources within the resource group. |
> | Microsoft.Edge/diagnostics/read | Returns details of specified Diagnostic resource. |
> | Microsoft.Edge/diagnostics/write | Creates new or updates existing Diagnostic resource. |
> | Microsoft.Edge/diagnostics/delete | Deletes specified Diagnostic resource. |
> | Microsoft.Edge/diagnostics/write | Updates existing Diagnostic resource. |
> | Microsoft.Edge/disconnectedOperations/read | List DisconnectedOperation resources by subscription ID |
> | Microsoft.Edge/disconnectedOperations/read | List DisconnectedOperation resources by resource group |
> | Microsoft.Edge/disconnectedOperations/read | Get a DisconnectedOperation |
> | Microsoft.Edge/disconnectedOperations/write | Create a DisconnectedOperation |
> | Microsoft.Edge/disconnectedOperations/delete | Delete a DisconnectedOperation |
> | Microsoft.Edge/disconnectedOperations/write | Update a DisconnectedOperation |
> | Microsoft.Edge/disconnectedOperations/listDeploymentManifest/action | get deployment manifest. |
> | Microsoft.Edge/disconnectedOperations/hardwareSettings/read | List by parent |
> | Microsoft.Edge/disconnectedOperations/hardwareSettings/read | Get the hardware settings resource |
> | Microsoft.Edge/disconnectedOperations/hardwareSettings/write | Create or update hardware settings |
> | Microsoft.Edge/disconnectedOperations/hardwareSettings/delete | Delete hardware settings |
> | Microsoft.Edge/disconnectedOperations/images/listDownloadUri/action | get deployment manifest. |
> | Microsoft.Edge/disconnectedOperations/images/read | List by parent |
> | Microsoft.Edge/disconnectedOperations/images/read | Get the resource |
> | Microsoft.Edge/disconnectedOperations/images/artifacts/read | List by parent |
> | Microsoft.Edge/disconnectedOperations/images/artifacts/read | Get the resource |
> | Microsoft.Edge/disconnectedOperations/images/artifacts/listDownloadUri/action | get artifact download link. |
> | Microsoft.Edge/hierarchyLists/read | List by subscription |
> | Microsoft.Edge/hierarchyLists/read | List by specified resource group |
> | Microsoft.Edge/hierarchyLists/read | Get a Hierarchy List Resource |
> | Microsoft.Edge/hierarchyLists/write | Create or update a Hierarchy List Resource |
> | Microsoft.Edge/hierarchyLists/delete | Delete a Hierarchy List Resource |
> | Microsoft.Edge/hierarchyLists/write | update a Hierarchy List Resource |
> | Microsoft.Edge/jobs/read | List Jobs by parent resource |
> | Microsoft.Edge/jobs/read | Get a Job resource |
> | Microsoft.Edge/locations/operationStatuses/read | read operationStatuses |
> | Microsoft.Edge/locations/operationStatuses/write | write operationStatuses |
> | Microsoft.Edge/operations/read | read operations |
> | Microsoft.Edge/registeredSubscriptions/read | read registeredSubscriptions |
> | Microsoft.Edge/resourceInsights/read | List all ResourceInsight resources |
> | Microsoft.Edge/resourceInsights/read | Get ResourceInsight resource by name |
> | Microsoft.Edge/schemaReferences/read | Get a Schema Reference Resource |
> | Microsoft.Edge/schemaReferences/read | List by specified resource group |
> | Microsoft.Edge/schemaReferences/write | Create or update a Schema Reference Resource |
> | Microsoft.Edge/schemaReferences/delete | Delete a Schema Reference Resource |
> | Microsoft.Edge/schemaReferences/write | update a Schema Reference Resource |
> | Microsoft.Edge/schemas/read | List by subscription |
> | Microsoft.Edge/schemas/read | List by specified resource group |
> | Microsoft.Edge/schemas/read | Get a Schema Resource |
> | Microsoft.Edge/schemas/write | Create or update a Schema Resource |
> | Microsoft.Edge/schemas/delete | Delete a Schema Resource |
> | Microsoft.Edge/schemas/write | update a Schema Resource |
> | Microsoft.Edge/schemas/createVersion/action | Create a Schema Version Resource |
> | Microsoft.Edge/schemas/removeVersion/action | Remove Schema Version Resource |
> | Microsoft.Edge/schemas/dynamicSchemas/read | List by Schema |
> | Microsoft.Edge/schemas/dynamicSchemas/read | Get a DynamicSchema Resource |
> | Microsoft.Edge/schemas/dynamicSchemas/write | Create or update a DynamicSchema Resource |
> | Microsoft.Edge/schemas/dynamicSchemas/delete | Delete a DynamicSchema Resource |
> | Microsoft.Edge/schemas/dynamicSchemas/write | update a DynamicSchema Resource |
> | Microsoft.Edge/schemas/dynamicSchemas/versions/read | List by Dynamic Schema |
> | Microsoft.Edge/schemas/dynamicSchemas/versions/read | Get a Dynamic Schema Version Resource |
> | Microsoft.Edge/schemas/dynamicSchemas/versions/write | Create or update a Dynamic Schema Version Resource |
> | Microsoft.Edge/schemas/dynamicSchemas/versions/delete | Delete a Dynamic Schema Version Resource |
> | Microsoft.Edge/schemas/dynamicSchemas/versions/write | update a Dynamic Schema Version Resource |
> | Microsoft.Edge/schemas/versions/read | List by specified resource group |
> | Microsoft.Edge/schemas/versions/read | Get a Schema Version Resource |
> | Microsoft.Edge/schemas/versions/write | Create or update a Schema Version Resource |
> | Microsoft.Edge/schemas/versions/delete | Delete a Schema Version Resource |
> | Microsoft.Edge/schemas/versions/write | update a Schema Version Resource |
> | Microsoft.Edge/siteAwareResourceTypes/read | List Singleton SiteAwareResourceTypes Object. |
> | Microsoft.Edge/siteAwareResourceTypes/read | Get Site Aware Resource Types |
> | Microsoft.Edge/sites/write | Update a Site |
> | Microsoft.Edge/sites/delete | Delete a Site |
> | Microsoft.Edge/sites/write | Create a Site |
> | Microsoft.Edge/sites/read | Get a Site |
> | Microsoft.Edge/sites/read | List Site resources by scope |
> | Microsoft.Edge/sites/write | Update a Site |
> | Microsoft.Edge/sites/delete | Delete a Site |
> | Microsoft.Edge/sites/write | Create a Site |
> | Microsoft.Edge/sites/read | Get a Site |
> | Microsoft.Edge/sites/read | List Site resources by scope |
> | Microsoft.Edge/sites/write | Update a Site |
> | Microsoft.Edge/sites/delete | Delete a Site |
> | Microsoft.Edge/sites/write | Create a Site |
> | Microsoft.Edge/sites/read | Get a Site |
> | Microsoft.Edge/sites/read | List Site resources by scope |
> | Microsoft.Edge/solutionBindings/deploy/action | Post request to deploy |
> | Microsoft.Edge/solutionBindings/publish/action | Post request to publish |
> | Microsoft.Edge/solutionBindings/resolveConfiguration/action | Post request to resolve configuration |
> | Microsoft.Edge/solutionBindings/read | List by subscription |
> | Microsoft.Edge/solutionBindings/read | List by specified resource group |
> | Microsoft.Edge/solutionBindings/read | Get a Solution Binding Resource |
> | Microsoft.Edge/solutionBindings/write | Create or update a Solution Binding Resource |
> | Microsoft.Edge/solutionBindings/delete | Delete a Solution Binding Resource |
> | Microsoft.Edge/solutionBindings/write | update a Solution Binding Resource |
> | Microsoft.Edge/solutionBindings/solutionBindingConfigurations/read | List Solution Binding Configuration resource |
> | Microsoft.Edge/solutionBindings/solutionBindingConfigurations/read | Get a Solution Binding Configuration Resource |
> | Microsoft.Edge/solutionBindings/solutionBindingConfigurations/write | Create or update a Solution Binding Configuration Resource |
> | Microsoft.Edge/solutionBindings/solutionBindingConfigurations/delete | Delete a Solution Binding Configuration Resource |
> | Microsoft.Edge/solutionBindings/solutionBindingConfigurations/write | update a Solution Binding Configuration Resource |
> | Microsoft.Edge/solutionBindings/solutionInstances/read | List Solution Instance Resources |
> | Microsoft.Edge/solutionBindings/solutionInstances/read | Get a Solution Instance Resource |
> | Microsoft.Edge/solutionBindings/solutionInstances/write | Create or update a Solution Instance Resource |
> | Microsoft.Edge/solutionBindings/solutionInstances/delete | Delete a Solution Instance Resource |
> | Microsoft.Edge/solutionBindings/solutionInstances/write | update a Solution Instance Resource |
> | Microsoft.Edge/solutions/read | List by subscription |
> | Microsoft.Edge/solutions/read | List by specified resource group |
> | Microsoft.Edge/solutions/read | Get a Solution resource |
> | Microsoft.Edge/solutions/write | Create or update a Solution resource |
> | Microsoft.Edge/solutions/delete | Delete a Solution resource |
> | Microsoft.Edge/solutions/write | update a Solution resource |
> | Microsoft.Edge/solutions/versions/read | List Solution Version Resources |
> | Microsoft.Edge/solutions/versions/read | Get a Solution Version Resource |
> | Microsoft.Edge/solutions/versions/write | Create or update a Solution Version Resource |
> | Microsoft.Edge/solutions/versions/delete | Delete a Solution Version Resource |
> | Microsoft.Edge/solutionTemplates/createVersion/action | Create a Solution Template Version Resource |
> | Microsoft.Edge/solutionTemplates/deprecate/action | Deprecate resource |
> | Microsoft.Edge/solutionTemplates/removeVersion/action | Remove Solution Template Version Resource |
> | Microsoft.Edge/solutionTemplates/read | List by subscription |
> | Microsoft.Edge/solutionTemplates/read | List by specified resource group |
> | Microsoft.Edge/solutionTemplates/read | Get a Solution Template Resource |
> | Microsoft.Edge/solutionTemplates/write | Create or update a Solution Template Resource |
> | Microsoft.Edge/solutionTemplates/delete | Delete a Solution Template Resource |
> | Microsoft.Edge/solutionTemplates/write | update a Solution Template Resource |
> | Microsoft.Edge/solutionTemplates/versions/deprecate/action | Deprecate resource |
> | Microsoft.Edge/solutionTemplates/versions/bulkDeploySolution/action | Post request for bulk deploy |
> | Microsoft.Edge/solutionTemplates/versions/bulkPublishSolution/action | Post request for bulk publish |
> | Microsoft.Edge/solutionTemplates/versions/read | List Solution Template Version Resources |
> | Microsoft.Edge/solutionTemplates/versions/read | Get a Solution Template Version Resource |
> | Microsoft.Edge/solutionTemplates/versions/bulkReviewSolution/action | Post request for bulk review |
> | Microsoft.Edge/solutionTemplates/versions/solutionSchemas/read | List by SolutionTemplateVersion |
> | Microsoft.Edge/solutionTemplates/versions/solutionSchemas/read | Get a SolutionSchema Resource |
> | Microsoft.Edge/targets/deploy/action | Post request to deploy |
> | Microsoft.Edge/targets/deprecate/action | Deprecate resource |
> | Microsoft.Edge/targets/publish/action | Post request to publish |
> | Microsoft.Edge/targets/resolve/action | Post request to resolve configuration |
> | Microsoft.Edge/targets/review/action | Post request to review configuration |
> | Microsoft.Edge/targets/installSolution/action | Post request to deploy |
> | Microsoft.Edge/targets/publishSolutionVersion/action | Post request to publish |
> | Microsoft.Edge/targets/removeRevision/action | Post request to remove solution version revision |
> | Microsoft.Edge/targets/resolveConfiguration/action | Post request to resolve configuration |
> | Microsoft.Edge/targets/reviewSolutionVersion/action | Post request to review configuration |
> | Microsoft.Edge/targets/uninstallSolution/action | Post request to uninstall |
> | Microsoft.Edge/targets/updateExternalValidationStatus/action | Post request to update external validation status |
> | Microsoft.Edge/targets/read | List by subscription |
> | Microsoft.Edge/targets/read | List by specified resource group |
> | Microsoft.Edge/targets/read | Get a Target Resource |
> | Microsoft.Edge/targets/write | Create or update a Target Resource |
> | Microsoft.Edge/targets/delete | Delete a Target Resource |
> | Microsoft.Edge/targets/write | update a Target Resource |
> | Microsoft.Edge/targets/unstageSolutionVersion/action | Post request to unstage solution version |
> | Microsoft.Edge/targets/solutions/read | List Solution resources |
> | Microsoft.Edge/targets/solutions/read | Get a Solution resource |
> | Microsoft.Edge/targets/solutions/write | Create or update a Solution Resource |
> | Microsoft.Edge/targets/solutions/delete | Delete a Solution Resource |
> | Microsoft.Edge/targets/solutions/write | Update a Solution Resource |
> | Microsoft.Edge/targets/solutions/instances/read | List Instance Resources |
> | Microsoft.Edge/targets/solutions/instances/read | Get Instance Resource |
> | Microsoft.Edge/targets/solutions/instances/write | Create or update Instance Resource |
> | Microsoft.Edge/targets/solutions/instances/delete | Delete Instance Resource |
> | Microsoft.Edge/targets/solutions/instances/write | Update an Instance Resource |
> | Microsoft.Edge/targets/solutions/instances/histories/read | List InstanceHistory Resources |
> | Microsoft.Edge/targets/solutions/instances/histories/read | Get InstanceHistory Resource |
> | Microsoft.Edge/targets/solutions/versions/read | List Solution Version Resources |
> | Microsoft.Edge/targets/solutions/versions/read | Get a Solution Version Resource |
> | Microsoft.Edge/targets/solutions/versions/write | Create or update a Solution Version Resource |
> | Microsoft.Edge/targets/solutions/versions/delete | Delete a Solution Version Resource |
> | Microsoft.Edge/targets/solutions/versions/write | Update a Solution Version Resource |
> | Microsoft.Edge/targetTemplates/read | List by subscription |
> | Microsoft.Edge/targetTemplates/read | List by specified resource group |
> | Microsoft.Edge/targetTemplates/read | Get a Target Template Resource |
> | Microsoft.Edge/targetTemplates/write | Create or update a Target Template Resource |
> | Microsoft.Edge/targetTemplates/delete | Delete a Target Template Resource |
> | Microsoft.Edge/targetTemplates/write | update a Target Template Resource |
> | Microsoft.Edge/updates/read | List Update resources by parent |
> | Microsoft.Edge/updates/read | Get a Update |
> | Microsoft.Edge/updates/write | Create an Update |
> | Microsoft.Edge/updates/delete | Delete an Update |
> | Microsoft.Edge/updates/write | Update a Update |
> | Microsoft.Edge/winfields/listDeploymentManifest/action | get deployment manifest. |
> | Microsoft.Edge/winfields/read | List Winfield resources by subscription ID |
> | Microsoft.Edge/winfields/read | List Winfield resources by resource group |
> | Microsoft.Edge/winfields/read | Get a Winfield |
> | Microsoft.Edge/winfields/write | Create a Winfield |
> | Microsoft.Edge/winfields/delete | Delete a Winfield |
> | Microsoft.Edge/winfields/write | Update a Winfield |
> | Microsoft.Edge/winfields/images/read | List by parent |
> | Microsoft.Edge/winfields/images/read | Get the resource |
> | Microsoft.Edge/winfields/images/listDownloadUri/action | get deployment manifest. |
> | Microsoft.Edge/workflows/read | List by subscription |
> | Microsoft.Edge/workflows/read | List by specified resource group |
> | Microsoft.Edge/workflows/read | Get a Workflow resource |
> | Microsoft.Edge/workflows/write | Create or update a Workflow resource |
> | Microsoft.Edge/workflows/delete | Delete a Workflow resource |
> | Microsoft.Edge/workflows/write | update a Workflow resource |
> | Microsoft.Edge/workflows/versions/read | List Workflow Version Resources |
> | Microsoft.Edge/workflows/versions/read | Get a Workflow Version Resource |
> | Microsoft.Edge/workflows/versions/write | Create or update a Workflow Version Resource |
> | Microsoft.Edge/workflows/versions/delete | Delete a Workflow Version Resource |
> | Microsoft.Edge/workflows/versions/write | update an WorkflowVersionV2 Resource |
> | Microsoft.Edge/workflows/versions/executions/read | List ExecutionV2 Resources |
> | Microsoft.Edge/workflows/versions/executions/read | Get ExecutionV2 Resource |
> | Microsoft.Edge/workflows/versions/executions/write | Create or update ExecutionV2 Resource |
> | Microsoft.Edge/workflows/versions/executions/delete | Delete ExecutionV2 Resource |
> | Microsoft.Edge/workflows/versions/executions/write | update an ExecutionV2 Resource |
> | Microsoft.Edge/workflowTemplates/read | List by subscription |
> | Microsoft.Edge/workflowTemplates/read | List by specified resource group |
> | Microsoft.Edge/workflowTemplates/read | Get a Workflow Template Resource |
> | Microsoft.Edge/workflowTemplates/write | Create or update a Workflow Template Resource |
> | Microsoft.Edge/workflowTemplates/delete | Delete a Workflow Template Resource |
> | Microsoft.Edge/workflowTemplates/write | update a Workflow Template Resource |
> | Microsoft.Edge/workflowTemplates/versions/read | List Workflow Template Version Resources |
> | Microsoft.Edge/workflowTemplates/versions/read | Get a Workflow Template Version Resource |
> | Microsoft.Edge/workflowTemplates/versions/write | Create or update a Workflow Template Version Resource |
> | Microsoft.Edge/workflowTemplates/versions/delete | Delete a Workflow Template Version Resource |
> | Microsoft.Edge/workflowTemplates/versions/write | update a Workflow Template Version Resource |

## Microsoft.EdgeMarketPlace

Azure service: Microsoft.EdgeMarketplace

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.EdgeMarketPlace/register/action | Register the subscription for Microsoft.EdgeMarketPlace |
> | Microsoft.EdgeMarketPlace/unregister/action | Unregister the subscription for Microsoft.EdgeMarketPlace |
> | Microsoft.EdgeMarketplace/locations/operationStatuses/read | read operationStatuses |
> | Microsoft.EdgeMarketplace/locations/operationStatuses/write | write operationStatuses |
> | Microsoft.EdgeMarketPlace/offers/getAccessToken/action | A long-running resource action. |
> | Microsoft.EdgeMarketPlace/offers/generateAccessToken/action | A long-running resource action. |
> | Microsoft.EdgeMarketPlace/offers/getAccessToken/action | get access token. |
> | Microsoft.EdgeMarketplace/offers/read | List Offer resources by subscription ID |
> | Microsoft.EdgeMarketplace/offers/read | Get a Offer |
> | Microsoft.EdgeMarketplace/offers/read | List Offer resources by parent |
> | Microsoft.EdgeMarketplace/operations/read | read operations |
> | Microsoft.EdgeMarketplace/publishers/read | List Publisher resources by parent |
> | Microsoft.EdgeMarketplace/publishers/read | List Publisher resources in subscription |
> | Microsoft.EdgeMarketplace/publishers/read | Get a Publisher |

## Microsoft.IoTCentral

Experience the simplicity of SaaS for IoT, with no cloud expertise required.

Azure service: [IoT Central](/azure/iot-central/)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.IoTCentral/checkNameAvailability/action | Checks if a IoTApp resource name is available |
> | Microsoft.IoTCentral/checkSubdomainAvailability/action | Check if a IoTApp resource subdomain is available |
> | Microsoft.IoTCentral/appTemplates/action | Lists application templates for IoTApps resources. |
> | Microsoft.IoTCentral/register/action | Register the subscription for the IoTCentral resource provider |
> | Microsoft.IoTCentral/IoTApps/read | Read IoTApp resources |
> | Microsoft.IoTCentral/IoTApps/write | Create or update a IoTApp resource |
> | Microsoft.IoTCentral/IoTApps/delete | Delete IoTApp resource |
> | Microsoft.IoTCentral/IoTApps/privateEndpointConnectionProxies/validate/action | Validate private endpoint connection proxies during Create/Update/Patch |
> | Microsoft.IoTCentral/IoTApps/privateEndpointConnectionProxies/read | Read private endpoint connection proxies |
> | Microsoft.IoTCentral/IoTApps/privateEndpointConnectionProxies/write | Create/Update/Patch private endpoint connection proxies |
> | Microsoft.IoTCentral/IoTApps/privateEndpointConnectionProxies/delete | Deletes private endpoint connection proxies |
> | Microsoft.IoTCentral/IoTApps/privateEndpointConnections/write | Approve/reject/disconnect private endpoint connections |
> | Microsoft.IoTCentral/IoTApps/privateEndpointConnections/read | Read private endpoint connections |
> | Microsoft.IoTCentral/IoTApps/privateEndpointConnections/delete | Delete private endpoint connections |
> | Microsoft.IoTCentral/IoTApps/privateLinkResources/read | Read private link resources |
> | Microsoft.IoTCentral/IoTApps/providers/Microsoft.Insights/diagnosticSettings/read | Get/List all the diagnostic settings for the resource |
> | Microsoft.IoTCentral/IoTApps/providers/Microsoft.Insights/diagnosticSettings/write | Set diagnostic settings for the resource |
> | Microsoft.IoTCentral/IoTApps/providers/Microsoft.Insights/metricDefinitions/read | Read all the available metric definitions for IoT Central |
> | Microsoft.IoTCentral/locations/operationResults/read | Get async operation results for IoT Central |
> | Microsoft.IoTCentral/locations/operationStatuses/read | Get async operation status for IoT Central |
> | Microsoft.IoTCentral/operations/read | Get/List all the available operations for IoT Central |

## Microsoft.IoTFirmwareDefense

Azure service: [Microsoft Defender for IoT](/azure/defender-for-iot/device-builders/overview)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.IoTFirmwareDefense/register/action | Register the subscription for Microsoft.IoTFirmwareDefense |
> | Microsoft.IoTFirmwareDefense/unregister/action | Unregister the subscription for Microsoft.IoTFirmwareDefense |
> | Microsoft.IoTFirmwareDefense/firmwareGroups/read | Get firmware group. |
> | Microsoft.IoTFirmwareDefense/firmwareGroups/write | The operation to create or update a firmwareGroups resource. |
> | Microsoft.IoTFirmwareDefense/firmwareGroups/delete | The operation to delete a firmware group. |
> | Microsoft.IoTFirmwareDefense/firmwareGroups/write | The operation to update a firmware groups. |
> | Microsoft.IoTFirmwareDefense/firmwareGroups/generateUploadUrl/action | The operation to get a url for file upload. |
> | Microsoft.IoTFirmwareDefense/firmwareGroups/read | Lists all of firmwareGroups in the specified subscription. |
> | Microsoft.IoTFirmwareDefense/firmwareGroups/firmwares/read | Get firmware. |
> | Microsoft.IoTFirmwareDefense/firmwareGroups/firmwares/write | The operation to create a firmware. |
> | Microsoft.IoTFirmwareDefense/firmwareGroups/firmwares/delete | The operation to delete a firmware. |
> | Microsoft.IoTFirmwareDefense/firmwareGroups/firmwares/write | The operation to update firmware. |
> | Microsoft.IoTFirmwareDefense/firmwareGroups/firmwares/read | Lists all of firmwares inside firmware group. |
> | Microsoft.IoTFirmwareDefense/firmwareGroups/firmwares/getUploadUrl/action | The operation to a url for file upload. |
> | Microsoft.IoTFirmwareDefense/firmwareGroups/firmwares/generateDownloadUrl/action | The operation to a url for file download. |
> | Microsoft.IoTFirmwareDefense/firmwareGroups/firmwares/generateFilesystemDownloadUrl/action | The operation to a url for tar file download. |
> | Microsoft.IoTFirmwareDefense/firmwareGroups/firmwares/generateSummary/action | The operation to get a scan summary. |
> | Microsoft.IoTFirmwareDefense/firmwareGroups/firmwares/generateComponentList/action | The operation to list all components result for a firmware. |
> | Microsoft.IoTFirmwareDefense/firmwareGroups/firmwares/generateComponentDetails/action | The operation to get component details for a firmware. |
> | Microsoft.IoTFirmwareDefense/firmwareGroups/firmwares/generateBinaryHardeningList/action | The operation to list all binary hardening result for a firmware. |
> | Microsoft.IoTFirmwareDefense/firmwareGroups/firmwares/generateBinaryHardeningSummary/action | The operation to list the binary hardening summary percentages for a firmware. |
> | Microsoft.IoTFirmwareDefense/firmwareGroups/firmwares/generateBinaryHardeningDetails/action | The operation to get binary hardening details for a firmware. |
> | Microsoft.IoTFirmwareDefense/firmwareGroups/firmwares/generatePasswordHashList/action | The operation to list all password hashes for a firmware. |
> | Microsoft.IoTFirmwareDefense/firmwareGroups/firmwares/generateCveList/action | The operation to list all cve results for a firmware. |
> | Microsoft.IoTFirmwareDefense/firmwareGroups/firmwares/generateCveSummary/action | The operation to provide a high level summary of the CVEs reported for the firmware image. |
> | Microsoft.IoTFirmwareDefense/locations/operationStatuses/read | read operationStatuses |
> | Microsoft.IoTFirmwareDefense/locations/operationStatuses/write | write operationStatuses |
> | Microsoft.IoTFirmwareDefense/operations/read | read operations |
> | Microsoft.IoTFirmwareDefense/workspaces/generateUploadUrl/action | The operation to get a url for file upload. |
> | Microsoft.IoTFirmwareDefense/workspaces/read | Lists all of the firmware analysis workspaces in the specified subscription. |
> | Microsoft.IoTFirmwareDefense/workspaces/read | Lists all of the firmware analysis workspaces in the specified resource group. |
> | Microsoft.IoTFirmwareDefense/workspaces/read | Get firmware analysis workspace. |
> | Microsoft.IoTFirmwareDefense/workspaces/write | The operation to create or update a firmware analysis workspace. |
> | Microsoft.IoTFirmwareDefense/workspaces/delete | The operation to delete a firmware analysis workspace. |
> | Microsoft.IoTFirmwareDefense/workspaces/write | The operation to update a firmware analysis workspaces. |
> | Microsoft.IoTFirmwareDefense/workspaces/generateUploadUrl/action | Generate a URL for uploading a firmware image. |
> | Microsoft.IoTFirmwareDefense/workspaces/firmwares/generateDownloadUrl/action | The operation to a url for file download. |
> | Microsoft.IoTFirmwareDefense/workspaces/firmwares/generateFilesystemDownloadUrl/action | The operation to a url for tar file download. |
> | Microsoft.IoTFirmwareDefense/workspaces/firmwares/generateSummary/action | The operation to get a scan summary. |
> | Microsoft.IoTFirmwareDefense/workspaces/firmwares/generateComponentList/action | The operation to list all components result for a firmware. |
> | Microsoft.IoTFirmwareDefense/workspaces/firmwares/generateComponentDetails/action | The operation to get component details for a firmware. |
> | Microsoft.IoTFirmwareDefense/workspaces/firmwares/generateBinaryHardeningList/action | The operation to list all binary hardening result for a firmware. |
> | Microsoft.IoTFirmwareDefense/workspaces/firmwares/generateBinaryHardeningSummary/action | The operation to list the binary hardening summary percentages for a firmware. |
> | Microsoft.IoTFirmwareDefense/workspaces/firmwares/generateBinaryHardeningDetails/action | The operation to get binary hardening details for a firmware. |
> | Microsoft.IoTFirmwareDefense/workspaces/firmwares/generatePasswordHashList/action | The operation to list all password hashes for a firmware. |
> | Microsoft.IoTFirmwareDefense/workspaces/firmwares/generateCveList/action | The operation to list all cve results for a firmware. |
> | Microsoft.IoTFirmwareDefense/workspaces/firmwares/generateCveSummary/action | The operation to provide a high level summary of the CVEs reported for the firmware image. |
> | Microsoft.IoTFirmwareDefense/workspaces/firmwares/generateCryptoCertificateSummary/action | The operation to provide a high level summary of the discovered cryptographic certificates reported for the firmware image. |
> | Microsoft.IoTFirmwareDefense/workspaces/firmwares/generateCryptoKeySummary/action | The operation to provide a high level summary of the discovered cryptographic keys reported for the firmware image. |
> | Microsoft.IoTFirmwareDefense/workspaces/firmwares/generateCryptoCertificateList/action | The operation to list all crypto certificates for a firmware. |
> | Microsoft.IoTFirmwareDefense/workspaces/firmwares/generateCryptoKeyList/action | The operation to list all crypto keys for a firmware. |
> | Microsoft.IoTFirmwareDefense/workspaces/firmwares/read | Lists all of firmwares inside a workspace. |
> | Microsoft.IoTFirmwareDefense/workspaces/firmwares/read | Get firmware. |
> | Microsoft.IoTFirmwareDefense/workspaces/firmwares/write | The operation to create a firmware. |
> | Microsoft.IoTFirmwareDefense/workspaces/firmwares/delete | The operation to delete a firmware. |
> | Microsoft.IoTFirmwareDefense/workspaces/firmwares/write | The operation to update firmware. |
> | Microsoft.IoTFirmwareDefense/workspaces/firmwares/generateDownloadUrl/action | The operation to a url for file download. |
> | Microsoft.IoTFirmwareDefense/workspaces/firmwares/generateFilesystemDownloadUrl/action | The operation to a url for tar file download. |
> | Microsoft.IoTFirmwareDefense/workspaces/firmwares/binaryHardeningResults/read | Lists binary hardening analysis results of a firmware. |
> | Microsoft.IoTFirmwareDefense/workspaces/firmwares/cryptoCertificates/read | Lists crypto certificate analysis results of a firmware. |
> | Microsoft.IoTFirmwareDefense/workspaces/firmwares/cryptoKeys/read | Lists crypto key analysis results of a firmware. |
> | Microsoft.IoTFirmwareDefense/workspaces/firmwares/cves/read | Lists CVE analysis results of a firmware. |
> | Microsoft.IoTFirmwareDefense/workspaces/firmwares/passwordHashes/read | Lists password hash analysis results of a firmware. |
> | Microsoft.IoTFirmwareDefense/workspaces/firmwares/sbomComponents/read | Lists sbom analysis results of a firmware. |
> | Microsoft.IoTFirmwareDefense/workspaces/firmwares/summaries/read | Lists analysis result summary names of a firmware. To fetch the full summary data, get that summary by name. |
> | Microsoft.IoTFirmwareDefense/workspaces/firmwares/summaries/read | Get an analysis result summary of a firmware by name. |
> | Microsoft.IoTFirmwareDefense/workspaces/usageMetrics/read | Lists monthly usage information for a workspace. |
> | Microsoft.IoTFirmwareDefense/workspaces/usageMetrics/read | Gets monthly usage information for a workspace. |

## Microsoft.IoTSecurity

Azure service: [IoT security](/azure/iot/iot-security-architecture)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.IoTSecurity/unregister/action | Unregisters the subscription for Azure Defender for IoT |
> | Microsoft.IoTSecurity/register/action | Registers the subscription for Azure Defender for IoT |
> | Microsoft.IoTSecurity/defenderSettings/read | Gets IoT Defender Settings |
> | Microsoft.IoTSecurity/defenderSettings/write | Creates or updates IoT Defender Settings |
> | Microsoft.IoTSecurity/defenderSettings/delete | Deletes IoT Defender Settings |
> | Microsoft.IoTSecurity/defenderSettings/packageDownloads/action | Gets downloadable IoT Defender packages information |
> | Microsoft.IoTSecurity/defenderSettings/downloadManagerActivation/action | Download manager activation file |
> | Microsoft.IoTSecurity/endpoints/read | Download sensor endpoints in location |
> | Microsoft.IoTSecurity/locations/read | Gets location |
> | Microsoft.IoTSecurity/locations/alertSuppressionRules/read | Gets alert suppression rule |
> | Microsoft.IoTSecurity/locations/alertSuppressionRules/write | Creates alert suppression rule |
> | Microsoft.IoTSecurity/locations/alertSuppressionRules/delete | Deletes alert suppression rule |
> | Microsoft.IoTSecurity/locations/deviceGroups/read | Gets device group |
> | Microsoft.IoTSecurity/locations/deviceGroups/alerts/read | Gets IoT Alerts |
> | Microsoft.IoTSecurity/locations/deviceGroups/alerts/write | Updates IoT Alert properties |
> | Microsoft.IoTSecurity/locations/deviceGroups/alerts/learn/write | Learn and close the alert |
> | Microsoft.IoTSecurity/locations/deviceGroups/alerts/pcaps/write | Request related PCAP file for alert |
> | Microsoft.IoTSecurity/locations/deviceGroups/devices/read | Get devices |
> | Microsoft.IoTSecurity/locations/deviceGroups/devices/write | Updates device properties |
> | Microsoft.IoTSecurity/locations/deviceGroups/devices/delete | Deletes device |
> | Microsoft.IoTSecurity/locations/deviceGroups/recommendations/read | Gets IoT Recommendations |
> | Microsoft.IoTSecurity/locations/deviceGroups/recommendations/write | Updates IoT Recommendation properties |
> | Microsoft.IoTSecurity/locations/deviceGroups/vulnerabilities/read | Gets device vulnerabilities |
> | Microsoft.IoTSecurity/locations/remoteConfigurations/read | Gets remote configuration |
> | Microsoft.IoTSecurity/locations/remoteConfigurations/write | Creates remote configuration |
> | Microsoft.IoTSecurity/locations/remoteConfigurations/delete | Deletes remote configuration |
> | Microsoft.IoTSecurity/locations/sensors/read | Gets IoT Sensors |
> | Microsoft.IoTSecurity/locations/sites/read | Gets IoT site |
> | Microsoft.IoTSecurity/locations/sites/write | Creates IoT site |
> | Microsoft.IoTSecurity/locations/sites/delete | Deletes IoT site |
> | Microsoft.IoTSecurity/locations/sites/sensors/read | Gets IoT Sensors |
> | Microsoft.IoTSecurity/locations/sites/sensors/write | Creates or updates IoT Sensors |
> | Microsoft.IoTSecurity/locations/sites/sensors/delete | Deletes IoT Sensors |
> | Microsoft.IoTSecurity/locations/sites/sensors/downloadActivation/action | Downloads activation file for IoT Sensors |
> | Microsoft.IoTSecurity/locations/sites/sensors/triggerTiPackageUpdate/action | Triggers threat intelligence package update |
> | Microsoft.IoTSecurity/locations/sites/sensors/downloadResetPassword/action | Downloads reset password file for IoT Sensors |
> | Microsoft.IoTSecurity/locations/sites/sensors/updateSoftwareVersion/action | Trigger sensor update |
> | Microsoft.IoTSecurity/locations/sites/sensors/backups/read | Gets remote backup |
> | Microsoft.IoTSecurity/locations/sites/sensors/backups/delete | Deletes remote backup |
> | Microsoft.IoTSecurity/onPremiseSensors/read | Gets on-premise IoT Sensors |
> | Microsoft.IoTSecurity/onPremiseSensors/write | Creates or updates on-premise IoT Sensors |
> | Microsoft.IoTSecurity/onPremiseSensors/delete | Deletes on-premise IoT Sensors |
> | Microsoft.IoTSecurity/onPremiseSensors/downloadActivation/action | Gets on-premise IoT Sensor Activation File |
> | Microsoft.IoTSecurity/onPremiseSensors/downloadResetPassword/action | Downloads file for reset password of the on-premise IoT Sensor |
> | Microsoft.IoTSecurity/sensors/read | Gets IoT Sensors |

## Microsoft.StreamAnalytics

Real-time data stream processing from millions of IoT devices.

Azure service: [Stream Analytics](/azure/stream-analytics/)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.StreamAnalytics/Register/action | Register subscription with Stream Analytics Resource Provider |
> | Microsoft.StreamAnalytics/clusters/Delete | Delete Stream Analytics Cluster |
> | Microsoft.StreamAnalytics/clusters/ListStreamingJobs/action | List streaming jobs for Stream Analytics Cluster |
> | Microsoft.StreamAnalytics/clusters/Read | Read Stream Analytics Cluster |
> | Microsoft.StreamAnalytics/clusters/Write | Write Stream Analytics Cluster |
> | Microsoft.StreamAnalytics/clusters/operationresults/Read | Read operation results for Stream Analytics Cluster |
> | Microsoft.StreamAnalytics/clusters/privateEndpoints/Delete | Delete Stream Analytics Cluster Private Endpoint |
> | Microsoft.StreamAnalytics/clusters/privateEndpoints/Read | Read Stream Analytics Cluster Private Endpoint |
> | Microsoft.StreamAnalytics/clusters/privateEndpoints/Write | Write Stream Analytics Cluster Private Endpoint |
> | Microsoft.StreamAnalytics/clusters/privateEndpoints/operationresults/Read | Read operation results for Stream Analytics Cluster Private Endpoint |
> | Microsoft.StreamAnalytics/locations/CompileQuery/action | Compile Query for Stream Analytics Resource Provider |
> | Microsoft.StreamAnalytics/locations/SampleInput/action | Sample Input for Stream Analytics Resource Provider |
> | Microsoft.StreamAnalytics/locations/TestInput/action | Test Input for Stream Analytics Resource Provider |
> | Microsoft.StreamAnalytics/locations/TestOutput/action | Test Output for Stream Analytics Resource Provider |
> | Microsoft.StreamAnalytics/locations/TestQuery/action | Test Query for Stream Analytics Resource Provider |
> | Microsoft.StreamAnalytics/locations/operationresults/Read | Read Stream Analytics Operation Result |
> | Microsoft.StreamAnalytics/locations/quotas/Read | Read Stream Analytics Subscription Quota |
> | Microsoft.StreamAnalytics/operations/Read | Read Stream Analytics Operations |
> | Microsoft.StreamAnalytics/streamingjobs/CompileQuery/action | Compile Query for Stream Analytics Job |
> | Microsoft.StreamAnalytics/streamingjobs/Delete | Delete Stream Analytics Job |
> | Microsoft.StreamAnalytics/streamingjobs/DownloadDiagram/action | Download job diagrams for Stream Analytics Job |
> | Microsoft.StreamAnalytics/streamingjobs/GenerateTopologies/action | Generate topologies for Stream Analytics Job |
> | Microsoft.StreamAnalytics/streamingjobs/PublishEdgePackage/action | Publish edge package for Stream Analytics Job |
> | Microsoft.StreamAnalytics/streamingjobs/Read | Read Stream Analytics Job |
> | Microsoft.StreamAnalytics/streamingjobs/Scale/action | Scale Stream Analytics Job |
> | Microsoft.StreamAnalytics/streamingjobs/Start/action | Start Stream Analytics Job |
> | Microsoft.StreamAnalytics/streamingjobs/Stop/action | Stop Stream Analytics Job |
> | Microsoft.StreamAnalytics/streamingjobs/TestQuery/action | Test Query for Stream Analytics Job |
> | Microsoft.StreamAnalytics/streamingjobs/Write | Write Stream Analytics Job |
> | Microsoft.StreamAnalytics/streamingjobs/functions/Delete | Delete Stream Analytics Job Function |
> | Microsoft.StreamAnalytics/streamingjobs/functions/Read | Read Stream Analytics Job Function |
> | Microsoft.StreamAnalytics/streamingjobs/functions/RetrieveDefaultDefinition/action | Retrieve Default Definition of a Stream Analytics Job Function |
> | Microsoft.StreamAnalytics/streamingjobs/functions/Test/action | Test Stream Analytics Job Function |
> | Microsoft.StreamAnalytics/streamingjobs/functions/Write | Write Stream Analytics Job Function |
> | Microsoft.StreamAnalytics/streamingjobs/functions/operationresults/Read | Read operation results for Stream Analytics Job Function |
> | Microsoft.StreamAnalytics/streamingjobs/inputs/Delete | Delete Stream Analytics Job Input |
> | Microsoft.StreamAnalytics/streamingjobs/inputs/Read | Read Stream Analytics Job Input |
> | Microsoft.StreamAnalytics/streamingjobs/inputs/Sample/action | Sample Stream Analytics Job Input |
> | Microsoft.StreamAnalytics/streamingjobs/inputs/Test/action | Test Stream Analytics Job Input |
> | Microsoft.StreamAnalytics/streamingjobs/inputs/Write | Write Stream Analytics Job Input |
> | Microsoft.StreamAnalytics/streamingjobs/inputs/operationresults/Read | Read operation results for Stream Analytics Job Input |
> | Microsoft.StreamAnalytics/streamingjobs/metricdefinitions/Read | Read Metric Definitions |
> | Microsoft.StreamAnalytics/streamingjobs/operationresults/Read | Read operation results for Stream Analytics Job |
> | Microsoft.StreamAnalytics/streamingjobs/outputs/Delete | Delete Stream Analytics Job Output |
> | Microsoft.StreamAnalytics/streamingjobs/outputs/Read | Read Stream Analytics Job Output |
> | Microsoft.StreamAnalytics/streamingjobs/outputs/Test/action | Test Stream Analytics Job Output |
> | Microsoft.StreamAnalytics/streamingjobs/outputs/Write | Write Stream Analytics Job Output |
> | Microsoft.StreamAnalytics/streamingjobs/outputs/operationresults/Read | Read operation results for Stream Analytics Job Output |
> | Microsoft.StreamAnalytics/streamingjobs/providers/Microsoft.Insights/diagnosticSettings/read | Read diagnostic setting. |
> | Microsoft.StreamAnalytics/streamingjobs/providers/Microsoft.Insights/diagnosticSettings/write | Write diagnostic setting. |
> | Microsoft.StreamAnalytics/streamingjobs/providers/Microsoft.Insights/logDefinitions/read | Gets the available logs for streamingjobs |
> | Microsoft.StreamAnalytics/streamingjobs/providers/Microsoft.Insights/metricDefinitions/read | Gets the available metrics for streamingjobs |
> | Microsoft.StreamAnalytics/streamingjobs/Skus/Read | Read Stream Analytics Job SKUs |
> | Microsoft.StreamAnalytics/streamingjobs/transformations/Delete | Delete Stream Analytics Job Transformation |
> | Microsoft.StreamAnalytics/streamingjobs/transformations/Read | Read Stream Analytics Job Transformation |
> | Microsoft.StreamAnalytics/streamingjobs/transformations/Write | Write Stream Analytics Job Transformation |

## Next steps

- [Azure resource providers and types](/azure/azure-resource-manager/management/resource-providers-and-types)
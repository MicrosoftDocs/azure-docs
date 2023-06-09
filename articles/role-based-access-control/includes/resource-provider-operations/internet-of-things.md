---
title: Internet of things resource provider operations include file
description: Internet of things resource provider operations include file
author: rolyon
manager: amycolannino
ms.service: role-based-access-control
ms.workload: identity
ms.topic: include
ms.date: 06/01/2023
ms.author: rolyon
ms.custom: generated
---

### Microsoft.Devices

Azure service: [IoT Hub](../../../iot-hub/index.yml), [IoT Hub Device Provisioning Service](../../../iot-dps/index.yml)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.Devices/register/action | Register the subscription for the IotHub resource provider and enables the creation of IotHub resources |
> | Microsoft.Devices/checkNameAvailability/Action | Check If IotHub name is available |
> | Microsoft.Devices/checkProvisioningServiceNameAvailability/Action | Check If Provisioning service name is available |
> | Microsoft.Devices/iotHubs/Read | Gets the IotHub resource(s) |
> | Microsoft.Devices/iotHubs/Write | Create or update IotHub Resource |
> | Microsoft.Devices/iotHubs/Delete | Delete IotHub Resource |
> | Microsoft.Devices/iotHubs/listkeys/Action | Get all IotHub Keys |
> | Microsoft.Devices/iotHubs/exportDevices/Action | Export Devices |
> | Microsoft.Devices/iotHubs/importDevices/Action | Import Devices |
> | Microsoft.Devices/iotHubs/privateEndpointConnectionsApproval/Action | Approve or reject a private endpoint connection |
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
> | Microsoft.Devices/locations/provisioningserviceoperationresults/Read | Get Location Based Provisioning Service Operation Result |
> | Microsoft.Devices/operationresults/Read | Get Operation Result |
> | Microsoft.Devices/operations/Read | Get All ResourceProvider Operations |
> | Microsoft.Devices/provisioningserviceoperationresults/Read | Get Provisioning Service Operation Result |
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

### Microsoft.DeviceUpdate

Azure service: [Device Update for IoT Hub](../../../iot-hub-device-update/index.yml)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.DeviceUpdate/checkNameAvailability/action | Checks Name Availability |
> | Microsoft.DeviceUpdate/register/action | Registers Device Update |
> | Microsoft.DeviceUpdate/unregister/action | Unregisters Device Update |
> | Microsoft.DeviceUpdate/accounts/read | Returns the list of Device Update Accounts |
> | Microsoft.DeviceUpdate/accounts/write | Creates or updates a Device Update Account |
> | Microsoft.DeviceUpdate/accounts/delete | Deletes a Device Update Account |
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

### Microsoft.IoTCentral

Azure service: [IoT Central](../../../iot-central/index.yml)

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

### Microsoft.IoTSecurity

Azure service: [IoT security](../../../iot/iot-security-architecture.md)

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
> | Microsoft.IoTSecurity/locations/read | Gets location |
> | Microsoft.IoTSecurity/locations/alertSuppressionRules/read | Gets alert suppression rule |
> | Microsoft.IoTSecurity/locations/alertSuppressionRules/write | Creates alert suppression rule |
> | Microsoft.IoTSecurity/locations/alertSuppressionRules/delete | Deletes alert suppression rule |
> | Microsoft.IoTSecurity/locations/deviceGroups/read | Gets device group |
> | Microsoft.IoTSecurity/locations/deviceGroups/alerts/read | Gets IoT Alerts |
> | Microsoft.IoTSecurity/locations/deviceGroups/alerts/write | Updates IoT Alert properties |
> | Microsoft.IoTSecurity/locations/deviceGroups/alerts/learn/action | Learn and close the alert |
> | Microsoft.IoTSecurity/locations/deviceGroups/alerts/pcapAvailability/action | Get alert PCAP file aviability |
> | Microsoft.IoTSecurity/locations/deviceGroups/alerts/pcapRequest/action | Request related PCAP file for alert |
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
> | Microsoft.IoTSecurity/onPremiseSensors/read | Gets on-premise IoT Sensors |
> | Microsoft.IoTSecurity/onPremiseSensors/write | Creates or updates on-premise IoT Sensors |
> | Microsoft.IoTSecurity/onPremiseSensors/delete | Deletes on-premise IoT Sensors |
> | Microsoft.IoTSecurity/onPremiseSensors/downloadActivation/action | Gets on-premise IoT Sensor Activation File |
> | Microsoft.IoTSecurity/onPremiseSensors/downloadResetPassword/action | Downloads file for reset password of the on-premise IoT Sensor |
> | Microsoft.IoTSecurity/onPremiseSensors/listDiagnosticsUploadDetails/action | Get details required to upload sensor diagnostics data |
> | Microsoft.IoTSecurity/sensors/read | Gets IoT Sensors |
> | Microsoft.IoTSecurity/sensors/write | Creates or updates IoT Sensors |
> | Microsoft.IoTSecurity/sensors/delete | Deletes IoT Sensors |
> | Microsoft.IoTSecurity/sensors/downloadActivation/action | Downloads activation file for IoT Sensors |
> | Microsoft.IoTSecurity/sensors/triggerTiPackageUpdate/action | Triggers threat intelligence package update |
> | Microsoft.IoTSecurity/sensors/downloadResetPassword/action | Downloads reset password file for IoT Sensors |

### Microsoft.NotificationHubs

Azure service: [Notification Hubs](../../../notification-hubs/index.yml)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.NotificationHubs/register/action | Registers the subscription for the NotificationHubs resource provider and enables the creation of Namespaces and NotificationHubs |
> | Microsoft.NotificationHubs/unregister/action | Unregisters the subscription for the NotificationHubs resource provider and enables the creation of Namespaces and NotificationHubs |
> | Microsoft.NotificationHubs/CheckNamespaceAvailability/action | Checks whether or not a given Namespace resource name is available within the NotificationHub service. |
> | Microsoft.NotificationHubs/Namespaces/write | Create a Namespace Resource and Update its properties. Tags and Capacity of the Namespace are the properties which can be updated. |
> | Microsoft.NotificationHubs/Namespaces/read | Get the list of Namespace Resource Description |
> | Microsoft.NotificationHubs/Namespaces/delete | Delete Namespace Resource |
> | Microsoft.NotificationHubs/Namespaces/authorizationRules/action | Get the list of Namespaces Authorization Rules description. |
> | Microsoft.NotificationHubs/Namespaces/CheckNotificationHubAvailability/action | Checks whether or not a given NotificationHub name is available inside a Namespace. |
> | Microsoft.NotificationHubs/namespaces/privateEndpointConnectionsApproval/action | Approve Private Endpoint Connection |
> | Microsoft.NotificationHubs/Namespaces/authorizationRules/write | Create a Namespace level Authorization Rules and update its properties. The Authorization Rules Access Rights, the Primary and Secondary Keys can be updated. |
> | Microsoft.NotificationHubs/Namespaces/authorizationRules/read | Get the list of Namespaces Authorization Rules description. |
> | Microsoft.NotificationHubs/Namespaces/authorizationRules/delete | Delete Namespace Authorization Rule. The Default Namespace Authorization Rule cannot be deleted. |
> | Microsoft.NotificationHubs/Namespaces/authorizationRules/listkeys/action | Get the Connection String to the Namespace |
> | Microsoft.NotificationHubs/Namespaces/authorizationRules/regenerateKeys/action | Namespace Authorization Rule Regenerate Primary/SecondaryKey, Specify the Key that needs to be regenerated |
> | Microsoft.NotificationHubs/Namespaces/NotificationHubs/write | Create a Notification Hub and Update its properties. Its properties mainly include PNS Credentials. Authorization Rules and TTL |
> | Microsoft.NotificationHubs/Namespaces/NotificationHubs/read | Get list of Notification Hub Resource Descriptions |
> | Microsoft.NotificationHubs/Namespaces/NotificationHubs/delete | Delete Notification Hub Resource |
> | Microsoft.NotificationHubs/Namespaces/NotificationHubs/authorizationRules/action | Get the list of Notification Hub Authorization Rules |
> | Microsoft.NotificationHubs/Namespaces/NotificationHubs/pnsCredentials/action | Get All Notification Hub PNS Credentials. This includes, WNS, MPNS, APNS, GCM and Baidu credentials |
> | Microsoft.NotificationHubs/Namespaces/NotificationHubs/debugSend/action | Send a test push notification to 10 matched devices. |
> | Microsoft.NotificationHubs/Namespaces/NotificationHubs/authorizationRules/write | Create Notification Hub Authorization Rules and Update its properties. The Authorization Rules Access Rights, the Primary and Secondary Keys can be updated. |
> | Microsoft.NotificationHubs/Namespaces/NotificationHubs/authorizationRules/read | Get the list of Notification Hub Authorization Rules |
> | Microsoft.NotificationHubs/Namespaces/NotificationHubs/authorizationRules/delete | Delete Notification Hub Authorization Rules |
> | Microsoft.NotificationHubs/Namespaces/NotificationHubs/authorizationRules/listkeys/action | Get the Connection String to the Notification Hub |
> | Microsoft.NotificationHubs/Namespaces/NotificationHubs/authorizationRules/regenerateKeys/action | Notification Hub Authorization Rule Regenerate Primary/SecondaryKey, Specify the Key that needs to be regenerated |
> | Microsoft.NotificationHubs/Namespaces/NotificationHubs/metricDefinitions/read | Get list of Namespace metrics Resource Descriptions |
> | Microsoft.NotificationHubs/Namespaces/NotificationHubs/vapidkeys/read | Get new pair of VAPID keys for a Notification Hub |
> | Microsoft.NotificationHubs/namespaces/privateEndpointConnectionProxies/validate/action | Validate Private Endpoint Connection Proxy |
> | Microsoft.NotificationHubs/namespaces/privateEndpointConnectionProxies/read | Get Private Endpoint Connection Proxy |
> | Microsoft.NotificationHubs/namespaces/privateEndpointConnectionProxies/write | Create Private Endpoint Connection Proxy |
> | Microsoft.NotificationHubs/namespaces/privateEndpointConnectionProxies/delete | Delete Private Endpoint Connection Proxy |
> | Microsoft.NotificationHubs/namespaces/privateEndpointConnectionProxies/operationstatus/read | Get the status of an asynchronous private endpoint operation |
> | Microsoft.NotificationHubs/namespaces/privateEndpointConnections/read | Get Private Endpoint Connection |
> | Microsoft.NotificationHubs/namespaces/privateEndpointConnections/write | Create or Update Private Endpoint Connection |
> | Microsoft.NotificationHubs/namespaces/privateEndpointConnections/delete | Removes Private Endpoint Connection |
> | Microsoft.NotificationHubs/namespaces/privateEndpointConnections/operationstatus/read | Removes Private Endpoint Connection |
> | Microsoft.NotificationHubs/namespaces/providers/Microsoft.Insights/diagnosticSettings/read | Get Namespace diagnostic settings |
> | Microsoft.NotificationHubs/namespaces/providers/Microsoft.Insights/diagnosticSettings/write | Create or Update Namespace diagnostic settings |
> | Microsoft.NotificationHubs/namespaces/providers/Microsoft.Insights/logDefinitions/read | Gets the available logs for Namespace |
> | Microsoft.NotificationHubs/operationResults/read | Returns operation results for Notification Hubs provider |
> | Microsoft.NotificationHubs/operations/read | Returns a list of supported operations for Notification Hubs provider |

### Microsoft.TimeSeriesInsights

Azure service: [Time Series Insights](../../../time-series-insights/index.yml)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.TimeSeriesInsights/register/action | Registers the subscription for the Time Series Insights resource provider and enables the creation of Time Series Insights environments. |
> | Microsoft.TimeSeriesInsights/environments/read | Get the properties of an environment. |
> | Microsoft.TimeSeriesInsights/environments/write | Creates a new environment, or updates an existing environment. |
> | Microsoft.TimeSeriesInsights/environments/delete | Deletes the environment. |
> | Microsoft.TimeSeriesInsights/environments/accesspolicies/read | Get the properties of an access policy. |
> | Microsoft.TimeSeriesInsights/environments/accesspolicies/write | Creates a new access policy for an environment, or updates an existing access policy. |
> | Microsoft.TimeSeriesInsights/environments/accesspolicies/delete | Deletes the access policy. |
> | Microsoft.TimeSeriesInsights/environments/eventsources/read | Get the properties of an event source. |
> | Microsoft.TimeSeriesInsights/environments/eventsources/write | Creates a new event source for an environment, or updates an existing event source. |
> | Microsoft.TimeSeriesInsights/environments/eventsources/delete | Deletes the event source. |
> | Microsoft.TimeSeriesInsights/environments/eventsources/providers/Microsoft.Insights/diagnosticSettings/read | Gets the diagnostic setting for the resource |
> | Microsoft.TimeSeriesInsights/environments/eventsources/providers/Microsoft.Insights/diagnosticSettings/write | Creates or updates the diagnostic setting for the resource |
> | Microsoft.TimeSeriesInsights/environments/eventsources/providers/Microsoft.Insights/logDefinitions/read | Gets the available logs for the event source |
> | Microsoft.TimeSeriesInsights/environments/eventsources/providers/Microsoft.Insights/metricDefinitions/read | Gets the available metrics for eventsources |
> | Microsoft.TimeSeriesInsights/environments/privateEndpointConnectionProxies/read | Get the properties of a private endpoint connection proxy. |
> | Microsoft.TimeSeriesInsights/environments/privateEndpointConnectionProxies/write | Creates a new private endpoint connection proxy for an environment, or updates an existing connection proxy. |
> | Microsoft.TimeSeriesInsights/environments/privateEndpointConnectionProxies/delete | Deletes the private endpoint connection proxy. |
> | Microsoft.TimeSeriesInsights/environments/privateEndpointConnectionProxies/validate/action | Validate the private endpoint connection proxy object before creation. |
> | Microsoft.TimeSeriesInsights/environments/privateEndpointConnectionProxies/operationresults/read | Validate the private endpoint connection proxy operation status. |
> | Microsoft.TimeSeriesInsights/environments/privateendpointConnections/read | Get the properties of a private endpoint connection. |
> | Microsoft.TimeSeriesInsights/environments/privateendpointConnections/write | Creates a new private endpoint connection for an environment, or updates an existing connection. |
> | Microsoft.TimeSeriesInsights/environments/privateendpointConnections/delete | Deletes the private endpoint connection. |
> | Microsoft.TimeSeriesInsights/environments/providers/Microsoft.Insights/diagnosticSettings/read | Gets the diagnostic setting for the resource |
> | Microsoft.TimeSeriesInsights/environments/providers/Microsoft.Insights/diagnosticSettings/write | Creates or updates the diagnostic setting for the resource |
> | Microsoft.TimeSeriesInsights/environments/providers/Microsoft.Insights/logDefinitions/read | Gets the available logs for environments |
> | Microsoft.TimeSeriesInsights/environments/providers/Microsoft.Insights/metricDefinitions/read | Gets the available metrics for environments |
> | Microsoft.TimeSeriesInsights/environments/referencedatasets/read | Get the properties of a reference data set. |
> | Microsoft.TimeSeriesInsights/environments/referencedatasets/write | Creates a new reference data set for an environment, or updates an existing reference data set. |
> | Microsoft.TimeSeriesInsights/environments/referencedatasets/delete | Deletes the reference data set. |
> | Microsoft.TimeSeriesInsights/environments/status/read | Get the status of the environment, state of its associated operations like ingress. |


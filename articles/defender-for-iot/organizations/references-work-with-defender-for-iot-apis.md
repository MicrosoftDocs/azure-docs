---
title: Work with Defender for IoT APIs
description: Use an external REST API to access the data discovered by sensors and management consoles and perform actions with that data.
ms.date: 06/13/2022
ms.topic: reference
---

# Defender for IoT API reference

This section describes the public APIs supported by Microsoft Defender for IoT.  Defender for IoT APIs are governed by [Microsoft API License and Terms of use](/legal/microsoft-apis/terms-of-use).

Use Defender for IoT APIs to access data discovered by sensors and on-premises management consoles and perform actions with that data.

API connections are secured over SSL.

## Generate an API access token

Many Defender for IoT APIs require an access token. Access tokens are *not* required for authentication APIs.

**To generate a token**:

1. In the **System Settings** window, select **Integrations** > **Access Tokens**.

1. Select **Generate token**.

1. In **Description**, describe what the new token is for, and select **Generate**.

1. The access token appears. Copy it, because it won't be displayed again.

1. Select **Finish**.

    - The tokens that you create appear in the **Access Tokens** dialog box. The **Used** indicates the last time an external call with this token was received.

    - **N/A** in the **Used** field indicates that the connection between the sensor and the connected server isn't working.

After generating the token, add an HTTP header titled **Authorization** to your request, and set its value to the token that you generated.

## Sensor API version reference

<!--alphabetize these tables-->

missing v1
- devices
- vulnerabilities mitigation

what are these for? is there a reason why they're not documented? P2
- serial
- database
- endpoints
- address mapping
- traffic

nothing missing in v2

|Version  |Supported APIs  |
|---------|---------|
|**No version**     |  - [validation (Validate user credentials)](sensor-api-reference.md#validation-validate-user-credentials) <br>- [set_password (Change your password)](sensor-api-reference.md#set_password-change-your-password) <br>- [set_password_by_admin (Update a user password by admin)](sensor-api-reference.md#set_password_by_admin-update-a-user-password-by-admin)     |
|**New in version 1**     |  - [connections (Retrieve device connection information)](sensor-api-reference.md#connections-retrieve-device-connection-information) <br>- [cves (Retrieve information on CVEs](sensor-api-reference.md#cves-retrieve-information-on-cves)<br>- [alerts (Retrieve alert information)](sensor-api-reference.md#alerts-retrieve-alert-information)<br>- [events (Retrieve timeline events)](sensor-api-reference.md#events-retrieve-timeline-events)<br>- [vulnerabilities (Retrieve vulnerability information)](sensor-api-reference.md#vulnerabilities-retrieve-vulnerability-information)<br>- [security (Retrieve security vulnerabilities)](sensor-api-reference.md#security-retrieve-security-vulnerabilities)<br>- [operational (Retrieve operational vulnerabilities)](sensor-api-reference.md#operational-retrieve-operational-vulnerabilities)  |
|**New in version 2**     |   -  [pcap (Retrieve alert PCAP)](sensor-api-reference.md#pcap-retrieve-alert-pcap) <br>- Updates to [alerts (Retrieve alert information)](sensor-api-reference.md#alerts-retrieve-alert-information) |


## On-premises management console API version reference

MISSING v1 - appliances

Difference between regular APIs and integration APIs is that the integration APIs is meant to run continuously. they all have a time stamp - what's new in the last 5 minutes. no time stamp by default on the regular APIs.

when you want to query data, use the regular, non-integration APIs. when you want to build an integration, use the integration APIs to create a constantly running stream of data.
for example - a customer can create an integration that constantly asks what's happened in the last 5 minutes.

|Version  |APIs  |
|---------|---------|
|**No version**     |  - [set_password (Change password)](management-api-reference.md#set_password-change-password)<br>- [set_password_by_admin (User password update by system admin)](management-api-reference.md#set_password_by_admin-user-password-update-by-system-admin) <br>- [validation (Authenticate user credentials)](management-api-reference.md#validation-authenticate-user-credentials)   |
|**New in version 1**     |   - [devices (Retrieve all device information)](management-api-reference.md#devices-retrieve-all-device-information) <br>- [alerts (Retrieve alert information)](management-api-reference.md#alerts-retrieve-alert-information) <br> - [maintenanceWindow (Create alert exclusions)](management-api-reference.md#maintenancewindow-create-alert-exclusions)      |
|**New in version 2**     |  - [pcap (Request alert PCAP)](management-api-reference.md#pcap-request-alert-pcap) <br>- Updates to  [alerts (Retrieve alert information)](management-api-reference.md#alerts-retrieve-alert-information)      |
|**New in version 3**     | **Integration APIs**: <br> - [devices (Create and update devices)](servicenow-api-reference.md#devices-create-and-update-devices)  <br>- [connections (Get device connections)](servicenow-api-reference.md#connections-get-device-connections) <br>- [device (Get details for a device)](servicenow-api-reference.md#device-get-details-for-a-device) <br>- [deleteddevices (Get deleted devices)](servicenow-api-reference.md#deleteddevices-get-deleted-devices) <br>- [sensors (Get sensors)](servicenow-api-reference.md#sensors-get-sensors) <br>- [devicecves (Get device CVEs)](servicenow-api-reference.md#devicecves-get-device-cves)  |


## Next steps

For more information, see:

- [OT monitoring sensor APIs](sensor-api-reference.md)
- [On-premises management console API reference](management-api-reference.md)
- [ServiceNow integration API reference (Public preview)](servicenow-api-reference.md)
- [Investigate sensor detections in a device inventory](how-to-investigate-sensor-detections-in-a-device-inventory.md)
- [Investigate all sensor detections in a device inventory](how-to-investigate-all-enterprise-sensor-detections-in-a-device-inventory.md)

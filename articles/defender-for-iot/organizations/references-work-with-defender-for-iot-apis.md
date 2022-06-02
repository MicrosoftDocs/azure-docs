---
title: Work with Defender for IoT APIs
description: Use an external REST API to access the data discovered by sensors and management consoles and perform actions with that data.
ms.date: 05/25/2022
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

|Version  |Supported APIs  |
|---------|---------|
|**No version**     |  - [validation (Validate user credentials)](sensor-api-reference.md#validation-validate-user-credentials) <br> <br>- [set_password (Change your password)](sensor-api-reference.md#set_password-change-your-password) <br><br>- [set_password_by_admin (Update a user password by admin)](sensor-api-reference.md#set_password_by_admin-update-a-user-password-by-admin)     |
|**Version 1**     |  [connections (Retrieve device connection information)](sensor-api-reference.md#connections-retrieve-device-connection-information) <br><br>[cves (Retrieve information on CVEs](sensor-api-reference.md#cves-retrieve-information-on-cves)<br><br>- [alerts (Retrieve alert information)](sensor-api-reference.md#alerts-retrieve-alert-information)<br><br>- [events (Retrieve timeline events)](sensor-api-reference.md#events-retrieve-timeline-events)[vulnerabilities (Retrieve vulnerability information)](sensor-api-reference.md#vulnerabilities-retrieve-vulnerability-information)<br><br>- [security (Retrieve security vulnerabilities)](sensor-api-reference.md#security-retrieve-security-vulnerabilities)<br><br>- [operational (Retrieve operational vulnerabilities)](sensor-api-reference.md#operational-retrieve-operational-vulnerabilities)  |
|**Version 2**     |   -  [pcap (Retrieve alert PCAP)](sensor-api-reference.md#pcap-retrieve-alert-pcap)  |


## On-premises management console API version reference

|Version  |APIs  |
|---------|---------|
|**No version**     |  - [maintenanceWindow (Create alert exclusions)](management-api-reference.md#maintenancewindow-create-alert-exclusions) <br><br>- [set_password (Change password)](management-api-reference.md#set_password-change-password)<br> <br>- [set_password_by_admin (User password update by system admin)](management-api-reference.md#set_password_by_admin-user-password-update-by-system-admin) <br><br>- [QRadar alerts](management-api-reference.md#qradar-alerts) <br><br>- [validation (Authenticate user credentials)](#validation-authenticate-user-credentials)   |
|**Version 1**     |  <br><br> - [devices (Retrieve all device information)](management-api-reference.md#devices-retrieve-all-device-information) <br><br>  - [alerts (Retrieve alert information)](management-api-reference.md#alerts-retrieve-alert-information)<br> <br> - [maintenanceWindow (Create alert exclusions)](management-api-reference.md#maintenancewindow-create-alert-exclusions)      |
|**Version 2**     |  - [pcap (Request alert PCAP)](management-api-reference.md#pcap-request-alert-pcap)       |
|**Version 3**     |  - [devices (Create and update devices)](servicenow-api-reference.md#devices-create-and-update-devices)  <br><br>- [connections (Get device connections)](servicenow-api-reference.md#connections-get-device-connections) <br><br>- [device (Get details for a device)](servicenow-api-reference.md#device-get-details-for-a-device) <br><br>- [deleteddevices (Get deleted devices)](servicenow-api-reference.md#deleteddevices-get-deleted-devices) <br><br>- [sensors (Get sensors)](servicenow-api-reference.md#sensors-get-sensors) <br><br>- [devicecves (Get device CVEs)](servicenow-api-reference.md#devicecves-get-device-cves)  |


## Next steps

For more information, see:

- [OT monitoring sensor APIs](sensor-api-reference.md)
- [On-premises management console API reference](management-api-reference.md)
- [ServiceNow integration API reference (Public preview)](servicenow-api-reference.md)
- [Investigate sensor detections in a device inventory](how-to-investigate-sensor-detections-in-a-device-inventory.md)
- [Investigate all sensor detections in a device inventory](how-to-investigate-all-enterprise-sensor-detections-in-a-device-inventory.md)

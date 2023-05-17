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

|Version  |Supported APIs  |
|---------|---------|
|**No version**     | **Authentication and password management**: <br>- [set_password (Change your password)](api/sensor-auth-apis.md#set_password-change-your-password) <br>- [set_password_by_admin (Update a user password by admin)](api/sensor-auth-apis.md#set_password_by_admin-update-a-user-password-by-admin)  <br> - [validation (Validate user credentials)](api/sensor-auth-apis.md#validation-validate-user-credentials)    |
|**New in version 1**     | **Inventory**: <br> - [connections (Retrieve device connection information)](api/sensor-inventory-apis.md#connections-retrieve-device-connection-information) <br>- [cves (Retrieve information on CVEs)](api/sensor-inventory-apis.md#cves-retrieve-information-on-cves)<br>- [devices (Retrieve device information)](api/sensor-inventory-apis.md#devices-retrieve-device-information)<br><br>**Alerts**: <br>- [alerts (Retrieve alert information)](api/sensor-alert-apis.md#alerts-retrieve-alert-information)<br>- [events (Retrieve timeline events)](api/sensor-alert-apis.md#events-retrieve-timeline-events)<br><br>**Vulnerabilities**: <br>- [operational (Retrieve operational vulnerabilities)](api/sensor-vulnerability-apis.md#operational-retrieve-operational-vulnerabilities)<br>- [devices (Retrieve device vulnerability information)](api/sensor-vulnerability-apis.md#devices-retrieve-device-vulnerability-information)<br>- [mitigation (Retrieve mitigation steps)](api/sensor-vulnerability-apis.md#mitigation-retrieve-mitigation-steps) <br>- [security (Retrieve security vulnerabilities)](api/sensor-vulnerability-apis.md#security-retrieve-security-vulnerabilities) |
|**New in version 2**     | **Alerts**: <br>- Updates to [alerts (Retrieve alert information)](api/sensor-alert-apis.md#alerts-retrieve-alert-information) |


## On-premises management console API version reference


|Version  |APIs  |
|---------|---------|
|**No version**     |**Authentication and password management**: <br>  - [set_password (Change password)](api/management-auth-apis.md#set_password-change-password)<br>- [set_password_by_admin (User password update by system admin)](api/management-auth-apis.md#set_password_by_admin-user-password-update-by-system-admin) <br>- [validation (Authenticate user credentials)](api/management-auth-apis.md#validation-authenticate-user-credentials)   |
|**New in version 1**     |  **Sites** <br>- [appliances (Manage OT sensor appliances)](api/management-appliances-apis.md)<br> **Inventory**:  <br>- [devices (Retrieve all device information)](api/management-inventory-apis.md#devices-retrieve-all-device-information) <br><br>**Alerts**: <br>- [alerts (Retrieve alert information)](api/management-alert-apis.md#alerts-retrieve-alert-information) <br> - [maintenanceWindow (Create alert exclusions)](api/management-alert-apis.md#maintenancewindow-create-alert-exclusions)      |
|**New in version 2**     | **Alerts**: <br>- Updates to  [alerts (Retrieve alert information)](api/management-alert-apis.md#alerts-retrieve-alert-information)<br> - [pcap (Request alert PCAP)](api/management-alert-apis.md#pcap-request-alert-pcap)       |
|**New in version 3**     | **Integration APIs**: <br>- [connections (Get device connections)](api/management-integration-apis.md#connections-get-device-connections)<br>- [device (Get details for a device)](api/management-integration-apis.md#device-get-details-for-a-device)<br>- [devicecves (Get device CVEs)](api/management-integration-apis.md#devicecves-get-device-cves)<br> - [devices (Create and update devices)](api/management-integration-apis.md#devices-create-and-update-devices)    <br>- [deleteddevices (Get deleted devices)](api/management-integration-apis.md#deleteddevices-get-deleted-devices) <br>- [sensors (Get sensors)](api/management-integration-apis.md#sensors-get-sensors)   |

> [!NOTE]
> Integration APIs are meant to run continuously and create a constantly running data stream, such as to query for new data from the last five minutes. Integration APIs return data with a timestamp.
>
> To simply query data, use the regular, non-integration APIs instead, for either an on-premises management console to query all devices, or for a specific sensor to query devices from that sensor only.


## Epoch time

In all Defender for IoT timestamp values, **Epoch time** is equal to **1/1/1970**.

## Next steps

For more information, see:

- [Manage your device inventory from the Azure portal](how-to-manage-device-inventory-for-organizations.md)
- [Manage your OT device inventory from a sensor console](how-to-investigate-sensor-detections-in-a-device-inventory.md)
- [Manage your OT device inventory from an on-premises management console](how-to-investigate-all-enterprise-sensor-detections-in-a-device-inventory.md)
- [View and manage alerts from the Azure portal](how-to-manage-cloud-alerts.md)
- [View alerts on your sensor](how-to-view-alerts.md)
- [Work with alerts on the on-premises management console](how-to-work-with-alerts-on-premises-management-console.md)

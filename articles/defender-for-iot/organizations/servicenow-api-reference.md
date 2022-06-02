---
title: OT monitoring ServiceNow integration API reference - Microsoft Defender for IoT
description: Learn about the REST APIs supported for the Microsoft Defender for IoT integration with ServiceNow.
ms.date: 05/25/2022
ms.topic: reference
---

# ServiceNow integration API reference (Public preview)

This article lists API supported with the Microsoft Defender for IoT integration with ServiceNow, via the ServiceNow Service Graph Connector for Defender for IoT.

For more information, see [Tutorial: Integrate ServiceNow with Microsoft Defender for IoT](tutorial-servicenow.md).

**URL**: `/external/v3/integration/`


## devices (Create and update devices)

**URL**: /devices/{timestamp}

**URL parameters**:


|Name  |Description  |
|---------|---------|
|**timestamp**     |   The start time from which results are returned.     |

### GET

# [Request](#tab/devices-request)

**Query parameters**:

|Name  |Description  |
|---------|---------|
|**sensorId**     |   Return only devices seen by a specific sensor. Use the ID value from the results of the [sensors (Get sensors)](#sensors-get-sensors) API. |
|**notificationType**     | Determines the types of devices to return. Supported values include: <br>- `0`: Both updated and new devices (default). <br>- `1`: Only new devices. <br>`2`: Only updated devices.        |
|**page**     | Defines the number where the result page numbering begins. For example, `0`= first page is **0**. <br>Default = `0`|
|**size**     |Defines the page sizing. Default = `50`         |


# [Response](#tab/devices-response)

**Type**: JSON

**Response fields**:

|Name  |Description  |
|---------|---------|
|**u_count**    |  The number of objects in the full result set, including all pages.       |
|**u_devices**    |  An array of device objects, as defined by the [device (Get details for a device)](#device-get-details-for-a-device) API.   |

---

## connections (Get device connections)

**URL**: `/connections/{timestamp}`

**URL parameters**:

|Name  |Description  |
|---------|---------|
|**timestamp**     |   The start time from which results are returned.     |

### GET

# [Request](#tab/connections-request)

**Query parameters**:

|Name  |Description  |
|---------|---------|
|**page**     | Defines the number where the result page numbering begins. For example, `1`= first page is **1**. <br>Default = `1`|
|**size**     |Defines the page sizing. Default = `50`         |


# [Response](#tab/connections-response)

**Type**: JSON

**Response fields**:


|Name  |Description  |
|---------|---------|
|**u_count**     |  Defines the number of objects in the full result set, including all pages.       |
|**u_connections**     |    An array of the following values: <br><br>- **u_src_device_id**: The source device ID <br>- **u_dest_device_id**:  The destination device ID. <br>- **u_connection_type**: The connection type: `One Way`, `Two Way`, `Multicast`    |


---

## device (Get details for a device)

### GET

# [Request](#tab/device-request)


**URL**: `/device/{deviceId}`

**URL parameters**:

|Name  |Description  |
|---------|---------|
|**deviceId**     |   The ID of the requested device     |


# [Response](#tab/device-response)

**Type**: JSON

**Response fields**:

|Name  |Description  |
|---------|---------|
| **u_id**” | The device's internal ID. |
| **u_vendor**”  | The device's vendor name. |
| **u_mac_address_objects**” | An array of **u_mac_address** values, listing the device's MAC addresses |
| **u_ip_address_objects**” - array of **u_ip_address**, values, defining the devices IP addresses |
| **u_guessed_mac_addresses**” - array of **u_mac_address** values, defining the guessed MAC address. <!--what are guessed?-->
| **u_name** | Defines the name of the device. |
| **u_last_activity**”  | Defines the timestamp of the last time the device was active.
    - “**u_first_discovered**” - timestamp of the discovery time of the device.
    - “**u_last_update**” - timestamp of the last update time of the device.
    - “**u_vlans**” - array of
        - “**u_vlan**” - vlan in which the device is in.
    - “**u_device_type**” -
        - “**u_name**” - the device type
        - “**u_purdue_layer**” - the default purdue layer for this device type.
        - “**u_category**” - will be one of the following:
            - “**IT**”
            - “**ICS**”
            - “**IoT**”
            - “**Network**”
    - “**u_operating_system**” - the device operating system.
    - “**u_protocol_objects**” - array of
        - “**u_protocol**” - protocol the device uses.
    - “**u_purdue_layer**” - the purdue layer that was manually set by the user.
    - “**u_sensor_ids**” - array of
        - “**u_sensor_id**” - the ID of the sensor that saw the device.
    - “**u_device_urls**” - array of
        - “**u_device_url**” the URL to view the device in the sensor.
    - “**u_firmwares**” - array of
        - “**u_address**”
        - “**u_module_address**”
        - “**u_serial**”
        - “**u_model**”
        - “**u_version**”
        - “**u_additional_data**"

---

## deleteddevices (Get deleted devices)

### GET

# [Request](#tab/deleteddevices-request)


**URL**: `/deleteddevices/{timestamp}`

**URL parameters**:

|Name  |Description  |
|---------|---------|
|**timestamp**     |   The start time from which results are returned.     |


# [Response](#tab/deleteddevices-response)

**Type**: JSON

**Response fields**:

|Name  |Description  |
|---------|---------|
| **u_id** | Array of device IDs for deleted devices. |

---

## sensors (Get sensors)

### GET

# [Request](#tab/sensors-request)


**URL**: `/sensors`


# [Response](#tab/sensors-response)

**Type**: JSON

**Response fields**:

|Name  |Description  |
|---------|---------|

    - Array of
        - “**u_id**” - internal sensor ID, to be used in the devices API.
        - “**u_name**” - the name of the appliance.
        - “**u_connection_state**” - connectivity with the CM state. One of the following:
            - “**SYNCED**” - Connection is successful.
            - “**OUT_OF_SYNC**” - Management console cannot process data received from Sensor.
            - “**TIME_DIFF_OFFSET**” - Time drift detected. management console has been disconnected from Sensor.
            - “**DISCONNECTED**” - Sensor not communicating with management console. Check network connectivity.
        - “**u_interface_address**” - the network address of the appliance.
        - “**u_version**” - string representation of the sensor’s version.
        - “**u_alert_count**” - number of alerts found by the sensor.
        - “**u_device_count**” - number of devices discovered by the sensor.
        - “**u_unhandled_alert_count**” - number of unhandled alerts in the sensor.
        - “**u_is_activated**” - is the alert activated.
        - “**u_data_intelligence_version**” - string representation of the data intelligence installed in the sensor.
        - “**u_remote_upgrade_stage**” - the state of the remote upgrade. One of the following:
            - "**UPLOADING**"
            - "**PREPARE_TO_INSTALL**"
            - "**STOPPING_PROCESSES**"
            - "**BACKING_UP_DATA**"
            - "**TAKING_SNAPSHOT**"
            - "**UPDATING_CONFIGURATION**"
            - "**UPDATING_DEPENDENCIES**"
            - "**UPDATING_LIBRARIES**"
            - "**PATCHING_DATABASES**"
            - "**STARTING_PROCESSES**"
            - "**VALIDATING_SYSTEM_SANITY**"
            - "**VALIDATION_SUCCEEDED_REBOOTING**"
            - "**SUCCESS**"
            - "**FAILURE**"
            - "**UPGRADE_STARTED**"
            - "**STARTING_INSTALLATION**"
            - "**INSTALLING_OPERATING_SYSTEM**"
        - “**u_uid**” - globally unique identifier of the sensor

---

## devicecves (Get device CVEs)


**URL**: `/devicecves/{timestamp}`

**URL parameters**:

|Name  |Description  |
|---------|---------|
|**timestamp**     |   The start time from which results are returned.     |

### GET

# [Request](#tab/devicecves-request)

**Query parameters**:

|Name  |Description  |
|---------|---------|
|**page**     | Defines the number where the result page numbering begins. For example, `0`= first page is **0**. <br>Default = `0`|
|**size**     |Defines the page sizing. Default = `50`         |


# [Response](#tab/devicecves-response)

**Type**: JSON

**Response fields**:

|Name  |Description  |
|---------|---------|

    - “**u_count**” - amount of object in the full result sets, including all pages.
    - “**u_id**” - the same as in the specific device API.
    - “**u_name**” - the same as in the specific device API.
    - “**u_ip_address_objects**” - the same as in the specific device API.
    - “**u_mac_address_objects**” - the same as in the specific device API.
    - “**u_last_activity**” - the same as in the specific device API.
    - “**u_last_update**” - the same as in the specific device API.
    - “**u_cves**” - an array of CVEs:
        - “**u_ip_address**” - the IP address of the specific interface with the specific firmware on which the CVE was detected.
        - “**u_cve_id**”- the ID of the CVE
        - “**u_score**”- the risk score of the CVE
        - “**u_attack_vector**” - one of the following:
            - "**ADJACENT_NETWORK**"
            - "**LOCAL**"
            - "**NETWORK**"
        - “**u_description**” - description about the CVE.

---

## Next steps

For more information, see:

- [Defender for IoT sensor and management console APIs](references-work-with-defender-for-iot-apis.md)
- [OT monitoring sensor APIs](sensor-api-reference.md)
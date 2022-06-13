---
title: OT monitoring management integration API reference - Microsoft Defender for IoT
description: Learn about the REST APIs supported for the Microsoft Defender for IoT integration with ServiceNow.
ms.date: 05/25/2022
ms.topic: reference
---

<!--no nullable values-->

# Integration API reference (Public preview)

This article lists the APIs supported for integrating Microsoft Defender for IoT with partner services.

For example, this API is currently implemented with ServiceNow, via the ServiceNow Service Graph Connector for Defender for IoT.

For more information, see [Tutorial: Integrate ServiceNow with Microsoft Defender for IoT](tutorial-servicenow.md).

**URI**: `/external/v3/integration/`


## devices (Create and update devices)

**URI**: /devices/{timestamp}

**URI parameters**:


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

**URI**: `/connections/{timestamp}`

**URI parameters**:

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


**URI**: `/device/{deviceId}`

**URI parameters**:

|Name  |Description  |
|---------|---------|
|**deviceId**     |   The ID of the requested device     |


# [Response](#tab/device-response)

**Type**: JSON

**Response fields**:

|Name  |Description  |
|---------|---------|
| **u_id** | The device's internal ID. |
| **u_vendor**  | The device's vendor name. |
| **u_mac_address_objects** | An array of **u_mac_address** values, listing the device's MAC addresses |
| **u_ip_address_objects** - array of **u_ip_address**, values, defining the devices IP addresses |
| **u_guessed_mac_addresses** - array of **u_mac_address** values, defining the guessed MAC address. <!--what are guessed?-->
| **u_name** | Defines the name of the device. |
| **u_last_activity**  | Defines the timestamp of the last time the device was active. |
| **u_first_discovered** | Defines the timestamp of the device's discovery time. |
| **u_last_update**  | Defines the timestamp of the device's last update time. |
| **u_vlans** | An array of **u_vlan** values, which defines the device's VLAN. |
| **u_device_type** | Defines the device type. |
| **u_name** | Defines the device name. |
| **u_purdue_layer** |Defines the default [Purdue layer](plan-network-monitoring.md#purdue-reference-model-and-defender-for-iot) for this device type. |
| **u_category**  | Defines the device category as one of the following: <br><br>- **IT** <br>- **ICS** <br>- **IoT** <br>- **Network** |
| **u_operating_system** | Defines the device operating system.|
| **u_protocol_objects** | An array of **u_protocol** values, which defines the protocols used by the device. |
| **u_purdue_layer** | Defines the device's [Purdue layer](plan-network-monitoring.md#purdue-reference-model-and-defender-for-iot) layer, as manually defined by the user.|
| **u_sensor_ids**| An array of **u_sensor_id** values, which defines the sensor IDs for any sensor that detected the device. |
| **u_device_urls** | An array of **u_device_url** values, which defines the URLs used to view the device in the sensor. |
| **u_firmwares** |An array of the following values: <!--do we define what these are?--><br><br>- **u_address** <br>- **u_module_address** <br>- **u_serial** <br>- **u_model** <br>- **u_version** <br>- **u_additional_data** |

---

## deleteddevices (Get deleted devices)

### GET

# [Request](#tab/deleteddevices-request)


**URI**: `/deleteddevices/{timestamp}`

**URI parameters**:

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


**URI**: `/sensors`


# [Response](#tab/sensors-response)

**Type**: JSON

**Response fields**:

An array of the following fields:

|Name  |Description  |
|---------|---------|
|**u_id** | Defines the internal sensor ID, to be used in the [devices (Create and update devices)](#devices-create-and-update-devices) API.|
| **u_name** |Defines the sensor appliance's name. |
|**u_connection_state** | Defines the connection state with an on-premises management console, using one of the following values: <br><br>- **SYNCED**: Connection is successful. <br>- **OUT_OF_SYNC**: On-premises management console cannot process data received from the sensor. <br>- **TIME_DIFF_OFFSET**: Time drift detected. On-premises management console has been disconnected from the sensor. <br>**DISCONNECTED**: Sensor not communicating with management console. Check network connectivity. |
| **u_interface_address** | Defines the sensor appliance's network address.|
|**u_version** | A string representation of the sensor's software version. |
| **u_alert_count** | The number of alerts triggered by the sensor. <!--since when?-->|
| **u_device_count** |The number of devices detected by the sensor. |
| **u_unhandled_alert_count** |The number of currently unhandled alerts on the sensor.  |
| **u_is_activated** | Defines whether the alert is activated. <!--which alert-->|
| **u_data_intelligence_version**  |A string representation of the threat intelligence version installed on the sensor. |
| **u_remote_upgrade_stage** |Defines a current stage in a version update process as one of the following:  - **UPLOADING** <br>-  **PREPARE_TO_INSTALL** <br>- **STOPPING_PROCESSES** <br>- **BACKING_UP_DATA** <br>- **TAKING_SNAPSHOT** <br>- **UPDATING_CONFIGURATION** <br>- **UPDATING_DEPENDENCIES** <br>- **UPDATING_LIBRARIES** <br>- **PATCHING_DATABASES** <br>- **STARTING_PROCESSES** <br>- **VALIDATING_SYSTEM_SANITY** <br>- **VALIDATION_SUCCEEDED_REBOOTING** <br>- **SUCCESS** <br>- **FAILURE** <br>- **UPGRADE_STARTED** <br>- **STARTING_INSTALLATION** <br>- **INSTALLING_OPERATING_SYSTEM**|
| **u_uid** | Defines the sensor's globally unique identifier. |

---

## devicecves (Get device CVEs)


**URI**: `/devicecves/{timestamp}`

**URI parameters**:

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
|**u_count** | Defines the number of objects in the full result set, including all pages. |
| **u_id** | The device's internal ID. |
| **u_name** | Defines the name of the device. |
| **u_ip_address_objects** - array of **u_ip_address**, values, defining the devices IP addresses |
| **u_mac_address_objects** | An array of **u_mac_address** values, listing the device's MAC addresses |
| **u_last_activity**  | Defines the timestamp of the last time the device was active. |
| **u_last_update**  | Defines the timestamp of the device's last update time. |
|**u_cves** | An array of CVEs, including: <br>- **u_ip_address**: Defines the IP address of the specific interface, with the specific firmware where the CVE was detected. <br>- **u_cve_id**: Defines the CVE ID <br>- **u_score**: Defines the CVE risk score <br>- **u_attack_vector**: Defines the attack vector as one of the following: **ADJACENT_NETWORK**, **LOCAL**, **NETWORK** <br>- **u_description**: Defines the CVE description |

---


## Next steps

For more information, see:

- [Defender for IoT API reference](references-work-with-defender-for-iot-apis.md)
- [OT monitoring sensor APIs](sensor-api-reference.md)
- [On-premises management console API reference](management-api-reference.md)

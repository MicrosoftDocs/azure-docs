---
title: Integration API reference for on-premises management consoles - Microsoft Defender for IoT
description: Learn about the APIs supported for integrating Microsoft Defender for IoT with partner services, such as ServiceNow.
ms.date: 05/25/2022
ms.topic: reference
---

# Integration API reference for on-premises management consoles (Public preview)

This article lists the APIs supported for integrating Microsoft Defender for IoT with partner services.

For example, this API is currently implemented with [Tutorial: Integrate ServiceNow with Microsoft Defender for IoT](../tutorial-servicenow.md), via the ServiceNow Service Graph Connector for Defender for IoT.

> [!NOTE]
> Integration APIs are meant to run continuously and create a constantly running data stream, such as to query for new data from the last five minutes. Integration APIs return data with a timestamp.
>
> To simply query data, use the regular, non-integration APIs instead, for either an on-premises management console to query all devices, or for a specific sensor to query devices from that sensor only. For more information, see [Defender for IoT API reference](../references-work-with-defender-for-iot-apis.md).


**URI**: `/external/v3/integration/`

## devices (Create and update devices)

This API returns data about all devices that were updated after the given timestamp.

**URI**: `/external/v3/integration/devices/{timestamp}`

**URI parameters**:

|Name  |Description  |Example  | Required / Optional |
|---------|---------|---------|---------|
|**timestamp**     |   The start time from which results are returned, in milliseconds from Epoch time and in UTC timezone.     | `/external/v3/integration/devices/timestamp=<epoch>` | Required |

### GET

# [Request](#tab/devices-request)

**Query parameters**:

|Name  |Description  |Example  | Required / Optional |
|---------|---------|---------|---------|
|**sensorId**     |   Return only devices seen by a specific sensor. Use the ID value from the results of the [sensors (Get sensors)](#sensors-get-sensors) API. | `1` | Optional |
|**notificationType**     | Determines the types of devices to return. Supported values include: <br>- `0`: Both updated and new devices (default). <br>- `1`: Only new devices. <br>`2`: Only updated devices.        | `2` | Optional |
|**page**     | Defines the number where the result page numbering begins. For example, `0`= first page is **0**. <br>Default = `0`| `0` | Optional |
|**size**     |Defines the page sizing. Default = `50`         | `75` | Optional |


# [Response](#tab/devices-response)

**Type**: JSON

**Response fields**:

| Name | Type | Nullable / Not nullable | List of values |
|--|--|--|--|
|**u_count**    | Integer | Not nullable | The number of objects in the full result set, including all pages.       |
|**u_devices**    |JSON array of device objects   |Not nullable  | An array of device objects, as defined by the [device (Get details for a device)](#device-get-details-for-a-device) API.   |

#### Response example

<!--TBD-->

```rest
{
```

# [Curl](#tab/devices-curl)

<!--TBD-->
---

## connections (Get device connections)

This API returns data about all device connections that were updated after the given timestamp.

**URI**: `/external/v3/integration/connections/{timestamp}`

**URI parameters**:

|Name  |Description  |Example  | Required / Optional |
|---------|---------|---------|---------|
|**timestamp**     |   The start time from which results are returned, in milliseconds from Epoch time and in UTC timezone.     | `/external/v3/integration/devices/timestamp=<epoch>` | Required |

### GET

# [Request](#tab/connections-request)

**Query parameters**:

|Name  |Description  |Example  | Required / Optional |
|---------|---------|---------|---------|
|**page**     | Defines the number where the result page numbering begins. For example, `0`= first page is **0**. <br>Default = `0`| `0` | Optional |
|**size**     |Defines the page sizing. Default = `50`         | `75` | Optional |


# [Response](#tab/connections-response)

**Type**: JSON

**Response fields**:

| Name | Type | Nullable / Not nullable | List of values |
|--|--|--|--|
|**u_count**    | Integer | Not nullable | The number of objects in the full result set, including all pages.       |
|**u_connections**    |JSON array of connection objects   |Not nullable  | An array of [connection](#connections-fields) objects|

### connections fields


| Name | Type | Nullable / Not nullable | List of values |
|--|--|--|--|
| **u_appliance** | String | Not nullable  | The name of the sensor that discovered the connection. |
| **u_src_device_id** |Integer  | Not nullable | The ID of the connection's source device. |
| **u_src_device_name** | String | Not nullable | The name of the connection's source device. |
| **u_dest_device_id** |Integer  | Not nullable | The ID of the connection's destination device. |
| **u_dest_device_name** | String | Not nullable | The name of the connection's destination device. |
| **u_connection_type** | String | Not nullable | One of the following: `One Way`, `Two Way`, `Multicast` |


#### Response example

<!--TBD-->

```rest
{
```

# [Curl](#tab/connections-curl)

<!--TBD-->
---

## device (Get details for a device)

This API returns data about a specific device per a given device ID.

**URI**: `/external/v3/integration/device/{deviceId}`

### GET

# [Request](#tab/device-request)


**Query parameters**:

|Name  |Description  |Example  | Required / Optional |
|---------|---------|---------|---------|
|**deviceId**     |   The ID of the requested device on the on-premises management console    | `1` |Required |


# [Response](#tab/device-response)

**Type**: JSON

**Response fields**:

| Name | Type | Nullable / Not nullable | List of values |
|--|--|--|--|
| **u_id** | Long integer | Not nullable | The device's ID on the on-premises management console. |
| **u_vendor**   |String  | Nullable | The device's vendor name. |
| **u_appliance** | String | Not nullable | The name of the sensor that detected the device. |
| **u_mac_address_objects**  |JSON array of strings | Not nullable | An array of **u_mac_address** values, listing the device's MAC addresses.  |
| **u_groups** | JSON array of strings | Not nullable | An array of the groups that contains the device. |
| **u_site** | String | Not nullable | The name of the device's site. |
| **u_zone** | String | Not nullable | The name of the device's site. |
| **u_last_activity**  | DateTime |Not nullable  | The timestamp of the last time the device was active. |
| **u_first_discovered** | DateTime| Not nullable | Rhe timestamp of the device's discovery time. |
| **u_device_type**  |String |Not nullable  | The device [type](sensor-inventory-apis.md#supported-type-values) |
| **u_name**  | String| Not nullable| Defines the device name. |
| **u_ip_address_objects**  |JSON array of IP addresses | Not nullable | Array of [IP address](#ip_address_object-fields) objects  |
| **u_mac_address_objects** |JSON array of MAC addresses | Not nullable | Array of [MAC address](#mac_address_object-fields) objects  |
| **u_protocol_objects** | JSON array of protocols | Not nullable  | An array of [protocol](#protocol_object-fields) objects  |
| **u_vlans**  |JSON array of VLAN objects | Not nullable | An array of [VLAN](#vlan_object-fields) objects  |
| **u_purdue_layer**  | String | Not nullable |Defines the default [Purdue layer](../plan-network-monitoring.md#purdue-reference-model-and-defender-for-iot) for this device type. |
| **u_sensor_ids** |JSON array of sensor ID objects |Not nullable | An array of [sensor ID](#sensor_id_object-fields) objects  |
| **u_cm_device_url** |String |Not nullable  | The URL used to access the device on the on-premises management console. |
| **u_device_urls** |JSON array of URL objects |Not nullable  | An array of [device URL](#device_url_object-fields) objects |
| **u_last_update**   | Long integer  |Not nullable | Defines the timestamp of the device's last update time. |
| **u_firmwares**  |JSON array of firmware objects | Not nullable | An array of [firmware](#firmware_object-fields) objects|

### ip_address_object fields

| Name | Type | Nullable / Not nullable | List of values |
|--|--|--|--|
| **u_ip_address** | String | Not nullable | One of the device's IP addresses |
| **u_guessed_mac_address** | String | Not nullable | The guessed MAC addresses associated with the IP address  |

### mac_address_object fields

| Name | Type | Nullable / Not nullable | List of values |
|--|--|--|--|
| **u_mac_address** | String | Not nullable | One of the device's MAC addresses. |


### protocol_object fields

| Name | Type | Nullable / Not nullable | List of values |
|--|--|--|--|
| **u_protocol** | String | Not nullable | One of the protocols used by the device. |

### vlan_object fields

| Name | Type | Nullable / Not nullable | List of values |
|--|--|--|--|
| **u_vlan** | String | Not nullable | One of the VLANs where the device is found. |

### sensor_id_object fields

| Name | Type | Nullable / Not nullable | List of values |
|--|--|--|--|
| **u_sensor_id** | String | Not nullable | The ID of the sensor that detected the device.|


### device_url_object fields

| Name | Type | Nullable / Not nullable | List of values |
|--|--|--|--|
| **u_device_url** | String | Not nullable | The URLs used to view the device on the on-premises management console.|

### firmware_object fields

| Name | Type | Nullable / Not nullable | List of values |
|--|--|--|--|
| **u_appliance** | String | Not nullable | The name of the on-premises management console that manages the device. |
| **u_id** | Long integer | Not nullable | The ID of the device on the on-premises management console |
| **u_asset** | String | Not nullable | The name of the device |
| **u_address** | String | Not nullable | The device's firmware address |
| **u_module_address** | String | Nullable | The device's firmware module address |
| **u_serial** | String | Nullable | The device's firmware serial number |
| **u_model** | String | Nullable | The device's firmware model |
| **u_version** | String | Nullable | The device's firmware version |
| **u_additional_data** | String | Nullable | The device's firmware vendor-specific additional data |


#### Response example

<!--TBD-->

```rest
{
```

# [Curl](#tab/device-curl)

<!--TBD-->
---

## deleteddevices (Get deleted devices)

This API returns a list of IDs of recently deleted devices, from the supplied timestamp.

**URI**: `/external/v3/integration/deleteddevices/`

### GET

# [Request](#tab/deleteddevices-request)


**URI parameters**:

|Name  |Description  |Example  | Required / Optional |
|---------|---------|---------|---------|
|**timestamp**     |   The start time from which results are returned, in milliseconds from Epoch time and in UTC timezone.     | `/external/v3/integration/deleteddevices/timestamp=<epoch>` | Required |


# [Response](#tab/deleteddevices-response)

**Type**: JSON array of deleted devices

**Deleted device fields**:

| Name | Type | Nullable / Not nullable | List of values |
|--|--|--|--|
| **u_id** | Long integer | Not nullable | An ID of a deleted device |


#### Response example

<!--TBD-->

```rest
{
```

# [Curl](#tab/deleteddevices-curl)

<!--TBD-->
---
## sensors (Get sensors)

This API returns a list of sensor objects for connected OT network sensors.

**URI**: `/external/v3/integration/sensors/`

### GET

# [Request](#tab/sensors-request)


**URI**: `/sensors`

No query parameters

# [Response](#tab/sensors-response)

**Type**: JSON

**Response fields**:

An array of the following fields:

| Name | Type | Nullable / Not nullable | List of values |
|--|--|--|--|
|**u_id** | Long integer | Not nullable | Defines the internal sensor ID, to be used in the [devices (Create and update devices)](#devices-create-and-update-devices) API.|
| **u_name** | String | Not nullable | Defines the sensor appliance's name. |
| **u_interface_address** | String | Not nullable | Defines the sensor appliance's network address.|
|**u_connection_state** |String |Not nullable | Defines the device's connection state with an on-premises management console, using one of the following values: <br><br>- **SYNCED**: Connection is successful. <br>- **OUT_OF_SYNC**: On-premises management console cannot process data received from the sensor. <br>- **TIME_DIFF_OFFSET**: Time drift detected. On-premises management console has been disconnected from the sensor. <br>**DISCONNECTED**: Sensor not communicating with management console. Check network connectivity. |
|**u_version** | String | Not nullable | A string representation of the sensor's software version. |
| **u_alert_count** | Long integer | Not nullable | The current number of alerts triggered by the sensor. |
| **u_device_count** | Long integer | Not nullable | The current number of devices detected by the sensor. |
| **u_unhandled_alert_count** |Long integer | Not nullable | The current number of currently unhandled alerts on the sensor.  |
| **u_is_activated** | Boolean | Not nullable | Defines whether the sensor is activated. |
| **u_data_intelligence_version** |String | Not nullable |A string representation of the threat intelligence version installed on the sensor. |
| **u_uid** |String | Not nullable | Defines the sensor's globally unique identifier. |
| **u_zone_id** | Long integer | Nullable | Define's the device's zone. |
| **u_is_in_learning_mode** | Boolean | Not nullable  | Determines whether the sensor is in learning mode. |
| **u_remote_upgrade_stage** | String |Nullable |Defines a current stage in a version update process as one of the following:  - **UPLOADING** <br>-  **PREPARE_TO_INSTALL** <br>- **STOPPING_PROCESSES** <br>- **BACKING_UP_DATA** <br>- **TAKING_SNAPSHOT** <br>- **UPDATING_CONFIGURATION** <br>- **UPDATING_DEPENDENCIES** <br>- **UPDATING_LIBRARIES** <br>- **PATCHING_DATABASES** <br>- **STARTING_PROCESSES** <br>- **VALIDATING_SYSTEM_SANITY** <br>- **VALIDATION_SUCCEEDED_REBOOTING** <br>- **SUCCESS** <br>- **FAILURE** <br>- **UPGRADE_STARTED** <br>- **STARTING_INSTALLATION** <br>- **INSTALLING_OPERATING_SYSTEM**|



#### Response example

<!--TBD-->

```rest
{
```

# [Curl](#tab/sensors-curl)

<!--TBD-->
---
## devicecves (Get device CVEs)

This API returns a list of active CVEs for all devices that were updated since the supplied timestamp.

**URI**: `/external/v3/integration/devicecves/`

### GET

# [Request](#tab/devicecves-request)

**URI**: `/devicecves/{timestamp}`

#### URI parameters

|Name  |Description  |Example  | Required / Optional |
|---------|---------|---------|---------|
|**timestamp**     |   The start time from which results are returned, in milliseconds from Epoch time and in UTC timezone.     | `/external/v3/integration/devicecves/timestamp=<epoch>` | Required |

#### Query parameters

|Name  |Description  |Example  | Required / Optional |
|---------|---------|---------|---------|
|**page**     | Defines the number where the result page numbering begins. | `0`= first page is **0**. <br>Default = `0`| Optional |
|**size**     |Defines the page sizing.         | Default = `50` | Optional |
|**sensorId** | Shows results from a specific sensor, as defined by the given sensor ID. | `1` | Optional |
| **score** | Determines a minimum CVE score to be retrieved. All results will have a CVE score equal to or greater than the given value. | Default = `0`. | Optional |
| **deviceIds** | A comma-separated list of device IDs from which you want to show results. | For example: `1232,34,2,456` | Optional |



# [Response](#tab/devicecves-response)

**Type**: Count and JSON array of device CVEs

#### Response fields

| Name | Type | Nullable / Not nullable | List of values |
|--|--|--|--|
|**u_count** | Integer | Not nullable | The number of objects in the full result set, including all pages. |
| **u_device_cves** | JSON array of device CVE objects | Not nullable | An array of [device CVE objects](#device-cve-fields)|

#### Device CVE fields

| Name | Type | Nullable / Not nullable | List of values |
|--|--|--|--|
| **u_id** | Integer | Not nullable | The device's ID in the on-premises management console. |
| **u_name** | String | Not nullable | The device's name.|
| **u_ip_address_objects** | JSON array of IP address objects | Not nullable | Array of [u_ip_address](#u_ip_address_objects-fields) values, defining the devices IP addresses.  |
| **u_mac_address_objects** | JSON array of MAC address objects | Not nullable | An array of [u_mac_address](#u_mac_address_objects-fields) values, listing the device's MAC addresses.   |
| **u_last_activity**  | Integer | Not nullable | Timestamp of the last time traffic was seen from or to the device.  |
| **u_last_update** | Integer | Not nullable | The timestamp of the last time a property was changed on the device, including both user changes and automated system changes. |
|**u_cves** | JSON array of CVEs | Not nullable | An array of [CVE details](#u_cves-fields) objects |

> [!NOTE]
> If Defender for IoT can confidently identify the MAC address of one of its IP addresses, the MAC address is returned in the **u_mac_address_objects** field directly.
>
> If Defender for IoT is not entirely confident about a MAC address, such as if the traffic has been routed via a router, the MAC address is returned in the **u_guessed_mac_address** field instead, as part of the JSON array of IP addresses.

#### u_ip_address_objects fields

| Name | Type | Nullable / Not nullable | List of values |
|--|--|--|--|
| **u_ip_address** | String | Not nullable | One of the device's IP addresses |
| **u_guessed_mac_address** | JSON array of MAC address objects | Not nullable | JSON array of [MAC addresses](#u_mac_address_objects-fields) |

#### u_mac_address_objects fields

| Name | Type | Nullable / Not nullable | List of values |
|--|--|--|--|
| **u_mac_address** | String | Not nullable | One of the device's MAC addresses |

#### u_cves fields

| Name | Type | Nullable / Not nullable | List of values |
|--|--|--|--|
|**u_address** |String | Not nullable | Address of the specific interface, with the specific firmware where the CVE was detected. |
| **u_cve_id**| String| Not nullable | Defines the CVE ID |
|**u_score** | String| Not nullable | Defines the CVE risk score |
| **u_attack_vector**|String | Not nullable | Defines the attack vector as one of the following: **ADJACENT_NETWORK**, **LOCAL**, **NETWORK** |
| **u_description**| String| Not nullable | Defines the CVE description|


#### Response example

<!--TBD-->

```rest
{
```

# [Curl](#tab/devicecves-curl)

<!--TBD-->
---


## Next steps

For more information, see:

- [Defender for IoT API reference overview](../references-work-with-defender-for-iot-apis.md)
- [Tutorial: Integrate ServiceNow with Microsoft Defender for IoT](../tutorial-servicenow.md)

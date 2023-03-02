---
title: Inventory management API reference for OT monitoring sensors - Microsoft Defender for IoT
description: Learn about the device management REST APIs supported for Microsoft Defender for IoT OT monitoring sensors.
ms.date: 06/27/2022
ms.topic: reference
---

# Inventory management API reference for OT monitoring sensors

This article lists the device inventory management APIs supported for Defender for IoT OT sensors.


## connections (Retrieve device connection information)

Use this API to request a list of all device connections.

**URI**: `/api/v1/devices/connections`

### GET

# [Request](#tab/connections-request)

#### Query parameters

Define any of the following query parameters to filter the results returned. If you don't set query parameters, all device connections are returned.

|Name  |Description  |Example  | Required / Optional |
|---------|---------|---------|---------|
|**discoveredBefore**     | Numeric. Filter results that were detected before a given time, where the given time is defined in milliseconds from [Epoch time](../references-work-with-defender-for-iot-apis.md#epoch-time), and in UTC timezone.        |   `/api/v1/devices/2/connections?discoveredBefore=<epoch>`      | Optional |
|**discoveredAfter**     | Numeric. Filter results that were detected after a given time, where the given time is defined in milliseconds from [Epoch time](../references-work-with-defender-for-iot-apis.md#epoch-time), and in UTC timezone.          | `/api/v1/devices/2/connections?discoveredAfter=<epoch>`        | Optional |
|**lastActiveInMinutes**     | Numeric. Filter results by a given time frame during which connections were active. Defined backwards, in minutes, from the current time.        |   `/api/v1/devices/2/connections?lastActiveInMinutes=20`      | Optional |

# [Response](#tab/connections-response)

**Response type**: JSON

Array of JSON objects that represent device connections, or the following failure message:

|Message  |Description  |
|---------|---------|
|**Failure – error**     |     Operation failed   |


#### Success response fields

| Name | Type | Nullable / Not nullable | List of values |
|--|--|--|--|
| **firstDeviceId** | Numeric |  Not nullable | - |
| **secondDeviceId** | Numeric |  Not nullable | - |
| **lastSeen** | Numeric |  Not nullable | Epoch (UTC) |
| **discovered** | Numeric |  Not nullable | Epoch (UTC) |
| **ports** | Number array | Nullable | - |
| **protocols** | JSON array | Nullable | Protocol field |

#### Protocol fields

| Name | Type | Nullable / Not nullable |
|--|--|--|
| **name** | String | Not nullable |
| **commands** | String array | Nullable |

#### Response example

```rest
[
    {
        "firstDeviceId": 171,
        "secondDeviceId": 22,
        "lastSeen": 1511281457933,
        "discovered": 1511872830000,
        "ports": [
            502
        ],
        "protocols": [
        {
            name: "modbus",
            commands: [
                "Read Coils"
            ]
        },
        {
            name: "ams",
            commands: [
                "AMS Write"
            ]
        },
        {
            name: "http",
            commands: [
            ]
        }
    ]
    },
    {
        "firstDeviceId": 171,
        "secondDeviceId": 23,
        "lastSeen": 1511281457933,
        "discovered": 1511872830000,
        "ports": [
            502
        ],
        "protocols": [
            {
                name: "s7comm",
                commands: [
                    "Download block",
                    "Upload"
                ]
            }
        ]
    }
]
```

# [cURL command](#tab/connections-curl)

**Type**: GET

**APIs**:

```rest
curl -k -H "Authorization: <AUTH_TOKEN>" https://<IP_ADDRESS>/api/v1/devices/connections
```


**Examples**:

```rest
curl -k -H "Authorization: 1234b734a9244d54ab8d40aedddcabcd" https://127.0.0.1/api/v1/devices/connections
```

---

## connections per device (Retrieve specific device connection information )

Use this API to request a list of all the connections per device.

**URI**: `/api/v1/devices/<deviceID>/connections`

### GET

# [Request](#tab/connections-device-request)

#### Path parameter

|Name  |Description  |Example  | Required / Optional |
|---------|---------|---------|---------|
|**deviceId**     |  Get connections for the given device.       | `/api/v1/devices/<deviceId>/connections`        | Required |

#### Query parameters

|Name  |Description  |Example  | Required / Optional |
|---------|---------|---------|---------|
|**discoveredBefore**     | Numeric. Filter results that were detected before a given time, where the given time is defined in milliseconds from [Epoch time](../references-work-with-defender-for-iot-apis.md#epoch-time), and in UTC timezone.        |   `/api/v1/devices/2/connections?discoveredBefore=<epoch>`      | Optional |
|**discoveredAfter**     | Numeric. Filter results that were detected after a given time, where the given time is defined in milliseconds from [Epoch time](../references-work-with-defender-for-iot-apis.md#epoch-time), and in UTC timezone.          | `/api/v1/devices/2/connections?discoveredAfter=<epoch>`        | Optional |
|**lastActiveInMinutes**     | Numeric. Filter results by a given time frame during which connections were active. Defined backwards, in minutes, from the current time.        |   `/api/v1/devices/2/connections?lastActiveInMinutes=20`      | Optional |

# [Response](#tab/connections-device-response)

**Response type**: JSON

Array of JSON objects that represent device connections, or the following failure message:

|Message  |Description  |
|---------|---------|
|**Failure – error**     |     Operation failed   |

#### Success response fields

| Name | Type | Nullable / Not nullable | List of values |
|--|--|--|--|
| **firstDeviceId** | Numeric |  Not nullable | - |
| **secondDeviceId** | Numeric |  Not nullable | - |
| **lastSeen** | Numeric |  Not nullable | Epoch (UTC) |
| **discovered** | Numeric |  Not nullable | Epoch (UTC) |
| **ports** | Number array | Nullable | - |
| **protocols** | JSON array | Nullable | Protocol field |

#### Protocol fields

| Name | Type | Nullable / Not nullable |
|--|--|--|
| **name** | String | Not nullable |
| **commands** | String array | Nullable |

#### Response example

```rest
[
    {
        "firstDeviceId": 171,
        "secondDeviceId": 22,
        "lastSeen": 1511281457933,
        "discovered": 1511872830000,
        "ports": [
            502
        ],
        "protocols": [
        {
            name: "modbus",
            commands: [
                "Read Coils"
            ]
        },
        {
            name: "ams",
            commands: [
                "AMS Write"
            ]
        },
        {
            name: "http",
            commands: [
            ]
        }
    ]
    },
    {
        "firstDeviceId": 171,
        "secondDeviceId": 23,
        "lastSeen": 1511281457933,
        "discovered": 1511872830000,
        "ports": [
            502
        ],
        "protocols": [
            {
                name: "s7comm",
                commands: [
                    "Download block",
                    "Upload"
                ]
            }
        ]
    }
]
```

# [cURL command](#tab/connections-device-curl)

**Type**: GET

**APIs**:


```rest
curl -k -H "Authorization: <AUTH_TOKEN>" 'https://<IP_ADDRESS>/api/v1/devices/<deviceId>/connections?lastActiveInMinutes=&discoveredBefore=&discoveredAfter=
```

**Examples**:

With given query parameters:

```rest
curl -k -H "Authorization: 1234b734a9244d54ab8d40aedddcabcd" 'https://127.0.0.1/api/v1/devices/2/connections?lastActiveInMinutes=20&discoveredBefore=1594550986000&discoveredAfter=1594550986000
```

---

## cves (Retrieve information on CVEs)

Use this API to request a list of all known CVEs discovered on devices in the network, sorted by descending CVE score.

**URI**:  `/api/v1/devices/cves`

### GET

# [Request](#tab/cves-request)

**Example**: `/api/v1/devices/cves`

Define any of the following query parameters to filter the results returned.


|Name  |Description  |Example  | Required / Optional |
|---------|---------|---------|---------|
|**top**     |   Numeric.  Determine how many top-scored CVEs to get for each device IP address.     |     `/api/v1/devices/cves?top=50` <br><br>  `/api/v1/devices/<ipAddress>/cves?top=50`      | Optional. Default = `100` |

# [Response](#tab/cves-response)

**Type**: JSON

JSON array of device CVE objects, or the following failure message:

|Message  |Description  |
|---------|---------|
|**Failure – error**     |     Operation failed   |


#### Success response fields

| Name | Type | Nullable / Not nullable | List of values |
|--|--|--|--|
| **cveId** | String | Not nullable | A canonical, industry-standard ID for the given CVE. |
| **ipAddress** | String | Not nullable | IP addresses |
| **score** | String | Not nullable | A CVE score, between 0.0 - 10.0 |
| **attackVector** | String | Not nullable | `Network`, `Adjacent Network`, `Local`, or `Physical` |
| **description** | String | Not nullable | - |

#### Response example

```rest
[
    {

        "cveId": "CVE-2007-0099",
        "score": "9.3",
        "ipAddress": "10.35.1.51",
        "attackVector": "NETWORK",
        "description": "Race condition in the msxml3 module in Microsoft XML Core
        Services 3.0, as used in Internet Explorer 6 and other
        applications, allows remote attackers to execute arbitrary
        code or cause a denial of service (application crash) via many
        nested tags in an XML document in an IFRAME, when synchronous
        document rendering is frequently disrupted with asynchronous
        events, as demonstrated using a JavaScript timer, which can
        trigger NULL pointer dereferences or memory corruption, aka
        \"MSXML Memory Corruption Vulnerability.\""
    },
    {
        "cveId": "CVE-2009-1547",
        "score": "9.3",
        "ipAddress": "10.35.1.51",
        "attackVector": "NETWORK",
        "description": "Unspecified vulnerability in Microsoft Internet Explorer 5.01
        SP4, 6, 6 SP1, and 7 allows remote attackers to execute
        arbitrary code via a crafted data stream header that triggers
        memory corruption, aka \"Data Stream Header Corruption
        Vulnerability.\""
    }
]
```

# [cURL command](#tab/cves-curl)

**Type**: GET

**APIs**:

```rest
curl -k -H "Authorization: <AUTH_TOKEN>" https://<IP_ADDRESS>/api/v1/devices/cves
```

**Examples**:

```rest
curl -k -H "Authorization: 1234b734a9244d54ab8d40aedddcabcd" https://127.0.0.1/api/v1/devices/cves
```
---

## cves per IP address (Retrieve specific information on CVEs)

Use this API to request a list of all known CVEs discovered on devices in the network for a specific IP address.

**URI**:  `/api/v1/devices/cves`

### GET

# [Request](#tab/cves-ip-request)

**Example**: `/api/v1/devices/cves`

#### Path parameter

|Name  |Description  |Example  | Required / Optional |
|---------|---------|---------|---------|
|**ipAddress**     |  Get CVEs for the given IP address.       |  `/api/v1/devices/<ipAddress>/cves`       | Required |

Define the following query parameter to filter the results returned.

|Name  |Description  |Example  | Required / Optional |
|---------|---------|---------|---------|
|**top**     |   Numeric.  Determine how many top-scored CVEs to get for each device IP address.     |     `/api/v1/devices/cves?top=50` <br><br>  `/api/v1/devices/<ipAddress>/cves?top=50`      | Optional. Default = `100` |

# [Response](#tab/cves-ip-response)

**Type**: JSON

JSON array of device CVE objects, or the following failure message:

|Message  |Description  |
|---------|---------|
|**Failure – error**     |     Operation failed   |


#### Success response fields

| Name | Type | Nullable / Not nullable | List of values |
|--|--|--|--|
| **cveId** | String | Not nullable | A canonical, industry-standard ID for the given CVE. |
| **ipAddress** | String | Not nullable | IP addresses |
| **score** | String | Not nullable | A CVE score, between 0.0 - 10.0 |
| **attackVector** | String | Not nullable | `Network`, `Adjacent Network`, `Local`, or `Physical` |
| **description** | String | Not nullable | - |

#### Response example

```rest
[
    {

        "cveId": "CVE-2007-0099",
        "score": "9.3",
        "ipAddress": "10.35.1.51",
        "attackVector": "NETWORK",
        "description": "Race condition in the msxml3 module in Microsoft XML Core
        Services 3.0, as used in Internet Explorer 6 and other
        applications, allows remote attackers to execute arbitrary
        code or cause a denial of service (application crash) via many
        nested tags in an XML document in an IFRAME, when synchronous
        document rendering is frequently disrupted with asynchronous
        events, as demonstrated using a JavaScript timer, which can
        trigger NULL pointer dereferences or memory corruption, aka
        \"MSXML Memory Corruption Vulnerability.\""
    },
    {
        "cveId": "CVE-2009-1547",
        "score": "9.3",
        "ipAddress": "10.35.1.51",
        "attackVector": "NETWORK",
        "description": "Unspecified vulnerability in Microsoft Internet Explorer 5.01
        SP4, 6, 6 SP1, and 7 allows remote attackers to execute
        arbitrary code via a crafted data stream header that triggers
        memory corruption, aka \"Data Stream Header Corruption
        Vulnerability.\""
    }
]
```

# [cURL command](#tab/cves-ip-curl)

**Type**: GET

**APIs**:

```rest
curl -k -H "Authorization: <AUTH_TOKEN>" https://<IP_ADDRESS>/api/v1/devices/<deviceIpAddress>/cves?top=
```

**Examples**:


With given query parameters:

```rest
curl -k -H "Authorization: 1234b734a9244d54ab8d40aedddcabcd" https://127.0.0.1/api/v1/devices/10.10.10.15/cves?top=50
```

---

## devices (Retrieve device information)

Use this API to request a list of all devices detected by this sensor.

**URI**: `api/v1/devices/`

### GET

# [Request](#tab/devices-request)

#### Query parameter

Define the following query parameter to filter the results returned. If you don't set query parameters, all device connections are returned.

|Name  |Description  |Example  | Required / Optional |
|---------|---------|---------|---------|
|**authorized**     |  Boolean: <br><br>- `true`: Filter for data on authorized devices only. <br>- `false`: Filter for data on unauthorized devices only.      |   `/api/v1/devices/`      | Optional |


# [Response](#tab/devices-response)

**Response type**: JSON

Array of JSON objects that represent device objects, or the following failure message:

|Message  |Description  |
|---------|---------|
|**Failure – error**     |     Operation failed   |

#### Success response fields

| Name | Type | Nullable / Not nullable | List of values |
|--|--|--|--|
| **id** | Numeric. Defines the device ID. |  Not nullable | - |
|**ipAddresses** | JSON array of strings. |Nullable | - |
|**name** |String. Defines the device name. |Not nullable |- |
|**vendor** |String. Defines the device's vendor. |Nullable |- |
| **<a name="operatingsystem"></a>operatingSystem** | Enum. Defines the device's operating system. |Nullable | For more information, see [Supported operatingSystem values](#supported-operatingsystem-values). |
| **macAddresses** | JSON array of strings. |Nullable | - |
| <a name="type"></a>**type** |String. Defines the device type. |Not nullable |Can be `Unknown`. For more information, see [Supported type values](#supported-type-values). |
| **engineeringStation** | Boolean. Defines whether the device is defined as an engineering station or not. |Not nullable | - `true`: Device is an engineering station <br>- `false`: Device is not an engineering station. |
|**authorized**  |Boolean. Defines whether the device is defined as an engineering station or not. |Not nullable | - `true`: Device is an engineering station <br>- `false`: Device is not an engineering station|
|**scanner** |Boolean. Defines whether the device is authorized or not.|Not nullable | - `true`: Device is authorized <br>- `false`: Device is not authorized |
| <a name="protocol"></a>**protocols** |Object that contains the device's protocol details. |Nullable | For more information, see [Microsoft Defender for IoT - supported IoT, OT, ICS, and SCADA protocols](../concept-supported-protocols.md). |
|<a name="firmware"></a>**firmware** | JSON array of a `firmware` object that defies the device's firmware. |Not nullable | For more information, see [Supported firmware fields](#supported-firmware-fields).|
|**hasDynamicAddress** | Boolean. Defines whether the device has a dynamic address or not.  |Not nullable| - `true`: Device has a dynamic address <br>- `false`: Device does not have a dynamic address |


#### Supported `operatingSystem` values

This section lists the supported values for the [operatingSystem](#operatingsystem) response field.

:::row:::
   :::column span="":::
- `Windows 10`
- `Windows 10 32`
- `Windows 10 64`
- `Windows 2000`
- `Windows 7`
- `Windows 7 32`
- `Windows 7 64`
- `Windows 8`
- `Windows 8 32`
- `Windows 8 64`
- `Windows 8.1`
- `Windows 8.1 32`
   :::column-end:::
   :::column span="":::
- `Windows 8.1 64`
- `Windows NT`
- `Windows Server 2003`
- `Windows Server 2003 R2`
- `Windows Server 2008`
- `Windows Server 2008 32`
- `Windows Server 2008 64`
- `Windows Server 2008 R2`
- `Windows Server 2012`
- `Windows Server 2012 R2`
- `Windows Server 2016`
- `Windows Vista`
   :::column-end:::
   :::column span="":::
- `Windows Vista 32`
- `Windows Vista 64`
- `Windows XP`
- `Mac OS`
- `Mac OS X`
- `Linux`
- `Windows Server 2019`
- `HP UX`
- `Windows 11`
- `Windows 11 32`
- `Windows 11 64`
   :::column-end:::
:::row-end:::



#### Supported `type` values

This section lists the supported values for the [type](#type) response field.

:::row:::
   :::column span="":::
- `Engineering Station`
- `PLC`
- `Historian`
- `HMI`
- `Domain Controller`
- `DB Server`
- `Wireless Access Point`
- `Router`
- `Switch`
- `Workstation`
- `Server`
- `IP Camera`
- `Printer`
- `Multicast/Broadcast`
- `Internet`
- `Firewall`
- `Terminal Station`
- `VPN Gateway`
- `Group`
   :::column-end:::
   :::column span="":::
- `IED`
- `DCS Controller`
- `RTU`
- `NTP Server`
- `Storage`
- `Industrial Packaging System`
- `Industrial Scale`
- `Industrial Robot`
- `Slot`
- `Punch Clock`
- `ATM`
- `Smart TV`
- `Game console`
- `DVR`
- `Door Control Panel`
- `HVAC`
- `Thermostat`
- `Fire Alarm`
- `Smart Light`
   :::column-end:::
   :::column span="":::
- `Smart Switch`
- `Fire Detector`
- `IP Telephone`
- `Alarm System`
- `Alarm Siren`
- `Smart Phone`
- `Tablet`
- `Wifi Pineapple`
- `Motion Detector`
- `Elevator`
- `Humidity Sensor`
- `Physical Location`
- `Backup Server`
- `Meter`
- `Barcode Scanner`
- `Uninterruptable Power Supply`
   :::column-end:::
   :::column span="":::
- `Variable Frequency Drive`
- `Robot Controller`
- `Servo Drive`
- `Pneumatic Device`
- `Marquee`
- `People Counter System`
- `Intercom`
- `Turnstile`
- `I/O Adapter`
- `Protocol Converter`
- `KVM`
- `Web Guiding System`
- `Turbine`
- `External Management`
- `Embedded Device`
- `Unknown`
   :::column-end:::
:::row-end:::


#### Supported fields for  the `protocols` object and protocol `name` values

This section lists the supported fields for the [protocols](#protocol) object in the `protocols` response field.

| Name | Type | Nullable / Not nullable | List of values |
|--|--|--|--|
| **id** | Numeric. Defines the protocol's internal ID. |  Not nullable | - |
|<a name="protocol-name"></a>**name** |String. Defines the device name. |Not nullable | For more information, see below. <br><br>**Note**: To extend Defender for IoT support to proprietary protocols, create a Horizon plugin. For more information, see [Extend support to proprietary protocols](../overview.md#extend-support-to-proprietary-ot-protocols).|
|**ipAddresses** | JSON array of strings of protocol IP addresses. |Not nullable | - |

The following values are supported as [protocol names](#protocol-name) out-of-the-box:

:::row:::
   :::column span="":::
- `Unknown`
- `DNP3`
- `MODBUS`
- `C37.118`
- `SSH`
- `HTTP`
- `SYSLOG`
- `GENERIC`
- `ICMP`
- `DNS`
- `GOOSE`
- `MMS`
- `MALFORMED`
- `IEC-60870`
- `OPC UA`
- `Siemens S7`
- `ARP`
- `Sampled Values`
- `EtherNet/IP`
   :::column-end:::
   :::column span="":::
- `Siemens S7 Plus`
- `Motorola MDLC`
- `Netbios Name Service`
- `Netbios Datagram Service`
- `Lightweight Access Point`
- `CAPWAP`
- `SNMP`
- `DTLS`
- `TNS`
- `Database`
- `SRTP`
- `RPC`
- `OPC`
- `DF-1`
- `DH-485`
- `TDS`
- `SMB`
- `Suitelink`
- `ControlNet`
   :::column-end:::
   :::column span="":::
- `FTP`
- `CDP`
- `Profinet DCP`
- `Profinet Real-Time`
- `LLDP`
- `Telnet`
- `DeltaV`
- `BACNet`
- `AMS`
- `TwinCAT`
- `Ovation ADMD`
- `Ovation SSRPC`
- `Ovation DPUSTAT`
- `Port Map`
- `STP`
- `Telvent OASyS Tags`
- `Mitsubishi MELSEC`
- `Honeywell Control Data Access`
   :::column-end:::
   :::column span="":::
- `ARP`
- `Yokogawa HIS Equalize`
- `Emerson OpenBSI`
- `Siemens SICAM`
- `Omron FINS`
- `Toshiba Computer Link`
- `Foxboro I/A`
- `Yokogawa VNet/IP`
- `Emerson ROC`
- `ABB Totalflow`
- `Siemens Process Historian Discovery`
- `Siemens WinCC Agent`
- `LonTalk`
- `Common ASCII Message`
- `CodeSys`
- `SAIA S-Bus`
- `MDNS`
- `Bently Nevada`
   :::column-end:::
:::row-end:::



#### Supported firmware fields
This section lists the supported fields for the [firmware](#operatingsystem) object in the `firmware` response field.


| Name | Type | Nullable / Not nullable | List of values |
|--|--|--|--|
|**address**  |String. Defines the firmware IP address. |Not nullable   | -  |
| **moduleAddress** |String. Defines the firmware's module address. | Not nullable.  | - |
| **serial** |String. Defines the firmware's serial number. | Nullable  | - |
|**model**  | String. Defines the firmware model. | Nullable  | -  |
| **firmwareVersion** |String. Defines the firmware version. | Nullable | - |
|**additionalData**  | String. Defines additional data for the firmware. | Nullable | - |
|**rack**  |String. Defines the firmware rack. | Nullable  | - |
|**slot**  |String. Defines the firmware slot. | Nullable  | - |

# [cURL command](#tab/devices-curl)

**Type**: GET

```rest
curl -k -H "Authorization: <AUTH_TOKEN>" 'https://<IP_ADDRESS>/api/v1/devices/'
```
---
## Next steps

For more information, see the [Defender for IoT API reference overview](../references-work-with-defender-for-iot-apis.md).

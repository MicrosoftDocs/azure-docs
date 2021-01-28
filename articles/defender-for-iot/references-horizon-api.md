---
title: Horizon API
description: This guide describes commonly used Horizon methods.
author: shhazam-ms
manager: rkarlin
ms.author: shhazam
ms.date: 1/5/2021
ms.topic: article
ms.service: azure
---

# Horizon API 

This guide describes commonly used Horizon methods.

### Getting more information

For more information about working with Horizon and the Defender for IoT platform, see the following information:

- For the Horizon Open Development Environment (ODE) SDK, contact your Defender for IoT representative.
- For support and troubleshooting information, contact <support@cyberx-labs.com>.

- To access the Defender for IoT user guide from the Defender for IoT console, select :::image type="icon" source="media/references-horizon-api/profile.png"::: and then select **Download User Guide**.


## `horizon::protocol::BaseParser`

Abstract for all plugins. This consists of two methods:

- For processing plugin filters defined above you. This way Horizon knows how to communicate with the parser.
- For processing the actual data.

## `std::shared_ptr<horizon::protocol::BaseParser> create_parser()`

The first function that is called for your plugin creates an instance of the parser for Horizon to recognize it and register it.

### Parameters 

None.

### Return value

shared_ptr to your parser instance.

## `std::vector<uint64_t> horizon::protocol::BaseParser::processDissectAs(const std::map<std::string, std::vector<std::string>> &) const`

This function will get called for each plugin registered above. 

In most cases, this will be empty. Throw an exception for Horizon to know something bad happened.

### Parameters 

- A map containing the structure of dissect_as, as defined in the config.json of another plugin that wants to register over you.

### Return value 

An array of uint64_t, which is the registration processed into a kind of uint64_t. This means in the map, you'll have a list of ports, whose values will be the uin64_t.

## `horizon::protocol::ParserResult horizon::protocol::BaseParser::processLayer(horizon::protocol::management::IProcessingUtils &,horizon::general::IDataBuffer &)`

The main function. Specifically, the logic of the plugin, each time a new packet reaches your parser. This function will be called, everything related for packet processing should be done here.

### Considerations

Your plugin should be thread safe, as this function may be called from different threads. A good approach would be to define everything on the stack.

### Parameters

- The SDK control unit responsible for storing the data and creating SDK-related objects, such as ILayer, and fields.
- A helper for reading the data of the raw packet. It is already set with the byte order you defined in the config.json.

### Return value 

The result of the processing. This can be either *Success*, *Malformed*, or *Sanity*.

## `horizon::protocol::SanityFailureResult: public horizon::protocol::ParserResult`

Marks the processing as sanitation failure, meaning the packet isn't recognized by the current protocol, and Horizon should pass it to other parser, if any registered on same filters.

## `horizon::protocol::SanityFailureResult::SanityFailureResult(uint64_t)`

Constructor

### Parameters 

- Defines the error code used by the Horizon for logging, as defined in the config.json.

## `horizon::protocol::MalformedResult: public horizon::protocol::ParserResult`

Malformed result, indicated we already recognized the packet as our protocol, but some validation went wrong (reserved bits are on, or some field is missing).

## `horizon::protocol::MalformedResult::MalformedResult(uint64_t)`

Constructor

### Parameters  

- Error code, as defined in config.json.

## `horizon::protocol::SuccessResult: public horizon::protocol::ParserResult`

Notifies Horizon of successful processing. When successful, the packet was accepted, the data belongs to us, and all data was extracted.

## `horizon::protocol::SuccessResult()`

Constructor. Created a basic successful result. This means we don't know the direction or any other metadata regarding the packet.

## `horizon::protocol::SuccessResult(horizon::protocol::ParserResultDirection)`

Constructor.

### Parameters 

- The direction of packet, if identified. Values can be *REQUEST*, or *RESPONSE*.

## `horizon::protocol::SuccessResult(horizon::protocol::ParserResultDirection, const std::vector<uint64_t> &)`

Constructor.

### Parameters

- The direction of packet, if we've identified it, can be *REQUEST*, *RESPONSE*.
- Warnings. These events won’t be failed, but Horizon will be notified.

## `horizon::protocol::SuccessResult(const std::vector<uint64_t> &)`

Constructor.

### Parameters 

-  Warnings. These events won’t be failed, but Horizon will be notified.

## `HorizonID HORIZON_FIELD(const std::string_view &)`

Converts a string-based reference to a field name (for example, function_code) to HorizonID.

### Parameters 

- String to convert.

### Return value

- HorizonID created from the string.

## `horizon::protocol::ILayer &horizon::protocol::management::IProcessingUtils::createNewLayer()`

Creates a new layer so Horizon will know the plugin wants to store some data. This is the base storage unit you should use.

### Return value

A reference to a created layer, so you could add data to it.

## `horizon::protocol::management::IFieldManagement &horizon::protocol::management::IProcessingUtils::getFieldsManager()`

Gets the field management object, which is responsible for creating fields on different objects, for example, on ILayer.

### Return value

A reference to the manager.

## `void horizon::protocol::management::IFieldManagement::create(horizon::protocol::ILayer &, HorizonID, uint64_t)`

Creates a new numeric field of 64 bits on the layer with the requested ID.

### Parameters 

- The layer you created earlier.
- HorizonID created by the **HORIZON_FIELD** macro.
- The raw value you want to store.

## `void horizon::protocol::management::IFieldManagement::create(horizon::protocol::ILayer &, HorizonID, std::string)`

Creates a new string field of on the layer with the requested ID. The memory will be moved, so be careful. You won't be able to use this value again.

### Parameters  

- The layer you created earlier.
- HorizonID created by the **HORIZON_FIELD** macro.
- The raw value you want to store.

## `void horizon::protocol::management::IFieldManagement::create(horizon::protocol::ILayer &, HorizonID, std::vector<char> &)`

Creates a new raw value (array of bytes) field of on the layer, with the requested ID. The memory will be move, so be caution, you won't be able to use this value again.

### Parameters

- The layer you created earlier.
- HorizonID created by the **HORIZON_FIELD** macro.
- The raw value you want to store.

## `horizon::protocol::IFieldValueArray &horizon::protocol::management::IFieldManagement::create(horizon::protocol::ILayer &, HorizonID, horizon::protocol::FieldValueType)`

Creates an array value (array) field on the layer of the specified type with the requested ID.

### Parameters

- The layer you created earlier.
- HorizonID created by the **HORIZON_FIELD** macro.
- The type of values that will be stored inside the array.

### Return value

Reference to an array that you should append values to.

## `void horizon::protocol::management::IFieldManagement::create(horizon::protocol::IFieldValueArray &, uint64_t)`

Appends a new integer value to the array created earlier.

### Parameters

- The array created earlier.
- The raw value to be stored in the array.

## `void horizon::protocol::management::IFieldManagement::create(horizon::protocol::IFieldValueArray &, std::string)`

Appends a new string value to the array created earlier. The memory will be move, so be caution, you won't be able to use this value again.

### Parameters

- The array created earlier.
- Raw value to be stored in the array.

## `void horizon::protocol::management::IFieldManagement::create(horizon::protocol::IFieldValueArray &, std::vector<char> &)`

Appends a new raw value to the array created earlier. The memory will be move, so be caution, you won't be able to use this value again.

### Parameters

- The array created earlier.
- Raw value to be stored in the array.

## `bool horizon::general::IDataBuffer::validateRemainingSize(size_t)`

Checks that the buffer contains at least X bytes.

### Parameters

The number of bytes that should exist.

### Return value

True if the buffer contains at least X bytes. Otherwise, it is `False`.

## `uint8_t horizon::general::IDataBuffer::readUInt8()`

Reads uint8 value (1 byte), from the buffer, according to the byte order.

### Return value

The value read from the buffer.

## `uint16_t horizon::general::IDataBuffer::readUInt16()`

Reads uint16 value (2 bytes), from the buffer, according to the byte order.

### Return value

The value read from the buffer.

## `uint32_t horizon::general::IDataBuffer::readUInt32()`

Reads uint32 value (4 bytes) from the buffer according to the byte order.

### Return value

The value read from the buffer.

## `uint64_t horizon::general::IDataBuffer::readUInt64()`

Reads uint64 value (8 bytes), from the buffer, according to the byte order.

### Return value

The value read from the buffer.

## `void horizon::general::IDataBuffer::readIntoRawData(void *, size_t)`

Reads into pre-allocated memory, of a specified size, will actually copy the data into your memory region.

### Parameters 

- The memory region to copy the data into.
- Size of the memory region, this parameter also defined how many bytes will be copied.

## `std::string_view horizon::general::IDataBuffer::readString(size_t)`

Reads into a string from the buffer.

### Parameters 

- The number of bytes that should be read.

### Return value

The reference to the memory region of the string.

## `size_t horizon::general::IDataBuffer::getRemainingData()`

Tells you how many bytes are left in the buffer.

### Return value

Remaining size of the buffer.

## `void horizon::general::IDataBuffer::skip(size_t)`

Skips X bytes in the buffer.

### Parameters

- Number of bytes to skip.

## Curl commands

### Sensor API curl commands

#### /api/v1/devices

| Type | APIs | Example |
|--|--|--|
| GET | curl -k -H "Authorization: <AUTH_TOKEN>" https://<IP_ADDRESS>/api/v1/devices | curl -k -H "Authorization: 1234b734a9244d54ab8d40aedddcabcd" https:<span>//127<span>.0.0.1/api/v1/devices?authorized=true |

#### /api/v1/devices/connections

> [!div class="mx-tdBreakAll"]
> | Type | APIs | Example |
> |--|--|--|
> | GET | curl -k -H "Authorization: <AUTH_TOKEN>" https://<IP_ADDRESS>/api/v1/devices/connections | curl -k -H "Authorization: 1234b734a9244d54ab8d40aedddcabcd" https:/<span>/127.0.0.1/api/v1/devices/connections |
> | GET | curl -k -H "Authorization: <AUTH_TOKEN>" 'https://<IP_ADDRESS>/api/v1/devices/<deviceId>/connections?lastActiveInMinutes=&discoveredBefore=&discoveredAfter=' | curl -k -H "Authorization: 1234b734a9244d54ab8d40aedddcabcd" 'https:/<span>/127.0.0.1/api/v1/devices/2/connections?lastActiveInMinutes=20&discoveredBefore=1594550986000&discoveredAfter=1594550986000' |

#### /api/v1/devices/cves

| Type | APIs | Example |
|--|--|--|
| GET | curl -k -H "Authorization: <AUTH_TOKEN>" https://<IP_ADDRESS>/api/v1/devices/cves | curl -k -H "Authorization: 1234b734a9244d54ab8d40aedddcabcd" https:/<span>/127.0.0.1/api/v1/devices/cves |
| GET | curl -k -H "Authorization: <AUTH_TOKEN>" https://<IP_ADDRESS>/api/v1/devices/<deviceIpAddress>/cves?top= | curl -k -H "Authorization: 1234b734a9244d54ab8d40aedddcabcd" https:/<span>/127.0.0.1/api/v1/devices/10.10.10.15/cves?top=50 |

#### /api/v1/alerts

> [!div class="mx-tdBreakAll"]
> | Type | APIs | Example |
> |--|--|--|
> | GET | curl -k -H "Authorization: <AUTH_TOKEN>" 'https://<IP_ADDRESS>/api/v1/alerts?state=&fromTime=&toTime=&type=' | curl -k -H "Authorization: 1234b734a9244d54ab8d40aedddcabcd" 'https:/<span>/127.0.0.1/api/v1/alerts?state=unhandled&fromTime=1594550986000&toTime=1594550986001&type=disconnections' |

#### /api/v1/events

| Type | APIs | Example |
|--|--|--|
| GET | curl -k -H "Authorization: <AUTH_TOKEN>" 'https://<IP_ADDRESS>/api/v1/events?minutesTimeFrame=&type=' | curl -k -H "Authorization: 1234b734a9244d54ab8d40aedddcabcd" 'https:/<span>/127.0.0.1/api/v1/events?minutesTimeFrame=20&type=DEVICE_CONNECTION_CREATED' |

#### /api/v1/reports/vulnerabilities/devices

| Type | APIs | Example |
|--|--|--|
| GET | curl -k -H "Authorization: <AUTH_TOKEN>" https://<IP_ADDRESS>/api/v1/reports/vulnerabilities/devices | curl -k -H "Authorization: 1234b734a9244d54ab8d40aedddcabcd" https:/<span>/127.0.0.1/api/v1/reports/vulnerabilities/devices |

#### /api/v1/reports/vulnerabilities/security

| Type | APIs | Example |
|--|--|--|
| GET | curl -k -H "Authorization: <AUTH_TOKEN>" https://<IP_ADDRESS>/api/v1/reports/vulnerabilities/security | curl -k -H "Authorization: 1234b734a9244d54ab8d40aedddcabcd" https:/<span>/127.0.0.1/api/v1/reports/vulnerabilities/security |

#### /api/v1/reports/vulnerabilities/operational

| Type | APIs | Example |
|--|--|--|
| GET | curl -k -H "Authorization: <AUTH_TOKEN>" https://<IP_ADDRESS>/api/v1/reports/vulnerabilities/operational | curl -k -H "Authorization: 1234b734a9244d54ab8d40aedddcabcd" https:/<span>/127.0.0.1/api/v1/reports/vulnerabilities/operational |

#### /api/external/authentication/validation

| Type | APIs | Example |
|--|--|--|
| GET | curl -k -H "Authorization: <AUTH_TOKEN>" https://<IP_ADDRESS>/api/external/authentication/validation | curl -k -H "Authorization: 1234b734a9244d54ab8d40aedddcabcd" https:/<span>/127.0.0.1/api/external/authentication/validation |

#### /external/authentication/set_password

| Type | APIs | Example |
|--|--|--|
| POST | curl -k -d '{"username": "<USER_NAME>","password": "<CURRENT_PASSWORD>","new_password": "<NEW_PASSWORD>"}' -H 'Content-Type: application/json'  https://<IP_ADDRESS>/api/external/authentication/set_password | curl -k -d '{"username": "myUser","password": "1234@abcd","new_password": "abcd@1234"}' -H 'Content-Type: application/json'  https:/<span>/127.0.0.1/api/external/authentication/set_password |

#### /external/authentication/set_password_by_admin

> [!div class="mx-tdBreakAll"]
> | Type | APIs | Example |
> |--|--|--|
> | POST | curl -k -d '{"admin_username":"<ADMIN_USERNAME>","admin_password":"<ADMIN_PASSWORD>","username": "<USER_NAME>","new_password": "<NEW_PASSWORD>"}' -H 'Content-Type: application/json'  https://<IP_ADDRESS>/api/external/authentication/set_password_by_admin | curl -k -d '{"admin_user":"adminUser","admin_password": "1234@abcd","username": "myUser","new_password": "abcd@1234"}' -H 'Content-Type: application/json'  https:/<span>/127.0.0.1/api/external/authentication/set_password_by_admin |

### On-premises management console API curl commands

#### /external/v1/alerts/<UUID>

| Type | APIs | Example |
|--|--|--|
| PUT | curl -k -X PUT -d '{"action": "<ACTION>"}' -H "Authorization: <AUTH_TOKEN>" https://<IP_ADDRESS>/external/v1/alerts/<UUID> | curl -k -X PUT -d '{"action": "handle"}' -H "Authorization: 1234b734a9244d54ab8d40aedddcabcd" https:/<span>/127.0.0.1/external/v1/alerts/1-1594550943000 |

#### /external/v1/maintenanceWindow

| Type | APIs | Example |
|--|--|--|
| POST | curl -k -X POST -d '{"ticketId": "<TICKET_ID>",ttl": <TIME_TO_LIVE>,"engines": [<ENGINE1, ENGINE2...ENGINEn>],"sensorIds": [<SENSOR_ID1, SENSOR_ID2...SENSOR_IDn>],"subnets": [<SUBNET1, SUBNET2....SUBNETn>]}' -H "Authorization: <AUTH_TOKEN>" https:/<span>/127.0.0.1/external/v1/maintenanceWindow | curl -k -X POST -d '{"ticketId": "a5fe99c-d914-4bda-9332-307384fe40bf","ttl": "20","engines": ["ANOMALY"],"sensorIds": ["5","3"],"subnets": ["10.0.0.3"]}' -H "Authorization: 1234b734a9244d54ab8d40aedddcabcd" https:/<span>/127.0.0.1/external/v1/maintenanceWindow |
| PUT | curl -k -X PUT -d '{"ticketId": "<TICKET_ID>",ttl": "<TIME_TO_LIVE>"}' -H "Authorization: <AUTH_TOKEN>" https:/<span>/127.0.0.1/external/v1/maintenanceWindow | curl -k -X PUT -d '{"ticketId": "a5fe99c-d914-4bda-9332-307384fe40bf","ttl": "20"}' -H "Authorization: 1234b734a9244d54ab8d40aedddcabcd" https:/<span>/127.0.0.1/external/v1/maintenanceWindow |
| DELETE | curl -k -X DELETE -d '{"ticketId": "<TICKET_ID>"}' -H "Authorization: <AUTH_TOKEN>" https:/<span>/127.0.0.1/external/v1/maintenanceWindow | curl -k -X DELETE -d '{"ticketId": "a5fe99c-d914-4bda-9332-307384fe40bf"}' -H "Authorization: 1234b734a9244d54ab8d40aedddcabcd" https:/<span>/127.0.0.1/external/v1/maintenanceWindow |
| GET | curl -k -H "Authorization: <AUTH_TOKEN>" 'https://<IP_ADDRESS>/external/v1/maintenanceWindow?fromDate=&toDate=&ticketId=&tokenName=' | curl -k -H "Authorization: 1234b734a9244d54ab8d40aedddcabcd" 'https:/<span>/127.0.0.1/external/v1/maintenanceWindow?fromDate=2020-01-01&toDate=2020-07-14&ticketId=a5fe99c-d914-4bda-9332-307384fe40bf&tokenName=a' |

#### /external/authentication/validation

| Type | APIs | Example |
|--|--|--|
| POST | curl -k -d '{"username":"<USER_NAME>","password":"PASSWORD"}' 'https://<IP_ADDRESS>/external/authentication/validation' | curl -k -d '{"username":"myUser","password":"1234@abcd"}' 'https:/<span>/127.0.0.1/external/authentication/validation' |

#### /external/authentication/set_password

| Type | APIs | Example |
|--|--|--|
| POST | curl -k -d '{"username": "<USER_NAME>","password": "<CURRENT_PASSWORD>","new_password": "<NEW_PASSWORD>"}' -H 'Content-Type: application/json'  https://<IP_ADDRESS>/external/authentication/set_password | curl -k -d '{"username": "myUser","password": "1234@abcd","new_password": "abcd@1234"}' -H 'Content-Type: application/json'  https:/<span>/127.0.0.1/external/authentication/set_password |

#### /external/authentication/set_password_by_admin

> [!div class="mx-tdBreakAll"]
> | Type | APIs | Example |
> |--|--|--|
> | POST | curl -k -d '{"admin_username":"<ADMIN_USERNAME>","admin_password":"<ADMIN_PASSWORD>","username": "<USER_NAME>","new_password": "<NEW_PASSWORD>"}' -H 'Content-Type: application/json'  https://<IP_ADDRESS>/external/authentication/set_password_by_admin | curl -k -d '{"admin_user":"adminUser","admin_password": "1234@abcd","username": "myUser","new_password": "abcd@1234"}' -H 'Content-Type: application/json'  https:/<span>/127.0.0.1/external/authentication/set_password_by_admin |

#### /external/v1/alerts

> [!div class="mx-tdBreakAll"]
> | Type | APIs | Example |
> |--|--|--|
> | GET | curl -k -H "Authorization: <AUTH_TOKEN>" 'https://<>IP_ADDRESS>/external/v1/alerts?state=&zoneId=&fromTime=&toTime=&siteId=&sensor=' | curl -k -H "Authorization: 1234b734a9244d54ab8d40aedddcabcd" 'https:/<span>/127.0.0.1/external/v1/alerts?state=unhandled&zoneId=1&fromTime=0&toTime=1594551777000&siteId=1&sensor=1' |

#### /external/v1/devices

| Type | APIs | Example |
|--|--|--|
| GET | curl -k -H "Authorization: <AUTH_TOKEN>" 'https://<>IP_ADDRESS>/external/v1/devices?siteId=&zoneId=&sensorId=&authorized=' | curl -k -H "Authorization: 1234b734a9244d54ab8d40aedddcabcd" 'https:/<span>/127.0.0.1/external/v1/devices?siteId=1&zoneId=2&sensorId=5&authorized=true' |

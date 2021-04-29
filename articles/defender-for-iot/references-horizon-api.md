---
title: Horizon API
description: This guide describes commonly used Horizon methods.
ms.date: 1/5/2021
ms.topic: article
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

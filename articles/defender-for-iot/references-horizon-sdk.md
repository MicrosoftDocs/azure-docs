---
title: Horizon SDK 
description: The Horizon SDK lets Azure Defender for IoT developers design dissector plugins that decode network traffic so it can be processed by automated Defender for IoT network analysis programs.
ms.date: 1/13/2021
ms.topic: article
---

# Horizon proprietary protocol dissector

Horizon is an Open Development Environment (ODE) used to secure IoT and ICS devices running proprietary protocols.

This environment provides the following solutions for customers and technology partners:

- Unlimited, full support for common, proprietary, custom protocols or protocols that deviate from any standard. 

- A new level of flexibility and scope for DPI development.

- A tool that exponentially expands OT visibility and control, without the need to upgrade Defender for IoT platform versions.

- The security of allowing proprietary development without divulging sensitive information.

The Horizon SDK lets Azure Defender for IoT developers design dissector plugins that decode network traffic so it can be processed by automated Defender for IoT network analysis programs.

Protocol dissectors are developed as external plugins and are integrated with an extensive range of Defender for IoT services. For example,  services that provide monitoring, alerting and reporting capabilities.

## Secure development environment 

The Horizon ODE enables development of custom or proprietary protocols that cannot be shared outside an organization. For example, because of legal regulations or corporate policies.

Develop dissector plugins without: 

- revealing any proprietary information about how your protocols are defined.

- sharing any of your sensitive PCAPs.

- violating compliance regulations.

## Customization and localization  

The SDK supports various customization options, including:

  - Text for function codes. 

  - Full localization text for alerts, events, and protocol parameters. For more information, see [Create mapping files (JSON)](#create-mapping-files-json).

  :::image type="content" source="media/references-horizon-sdk/localization.png" alt-text="View fully localized alerts.":::

## Horizon architecture

The architectural model includes three product layers.

:::image type="content" source="media/references-horizon-sdk/architecture.png" alt-text="https://lh6.googleusercontent.com/YFePqJv_6jbI_oy3lCQv-hHB1Qly9a3QQ05uMnI8UdTwhOuxpNAedj_55wseYEQQG2lue8egZS-mlnQZPWfFU1dF4wzGQSJIlUqeXEHg9CG4M7ASCZroKgbghv-OaNoxr3AIZtIh":::

## Defender for IoT platform layer

Enables immediate integration and real-time monitoring of custom dissector plugins in the Defender for IoT platform, without the need to upgrade the Defender for IoT platform version.

## Defender for IoT services layer

Each service is designed as a pipeline, decoupled from a specific protocol, enabling more efficient, independent development.

Each service is designed as a pipeline, decoupled from a specific protocol. Services listens for traffic on the pipeline. They interact with the plugin data and the traffic captured by the sensors to index deployed protocols and analyze the traffic payload, and enable a more efficient and independent development.

## Custom dissector layer 

Enables creation of plugins using the Defender for IoT proprietary SDK (including C++ implementation and JSON configuration) to: 

- Define how to identify the protocol

- Define how to map the fields you want to extract from the traffic, and extract them 

- Define how to integrate with the Defender for IoT services

  :::image type="content" source="media/references-horizon-sdk/layers.png" alt-text="The built-in layers.":::

Defender for IoT provides basic dissectors for common protocols. You can build your dissectors on top of these protocols.

## Before you begin

## What this SDK contains 

This kit contains the header files needed for development. The development process requires basic steps and optional advanced steps, described in this SDK.

Contact <support@cyberx-labs.com> for information on receiving header files and other resources.

## About the environment and setup 

### Requirements 

- The preferred development environment is Linux. If you are developing in a Windows environment, consider using a VM with a Linux System.

- For the compilation process, use GCC 7.4.0 or higher. Use any standard class from stdlib that is supported under C++17.

- Defender for IoT version 3.0 and above.

### Process

1. [Download](https://www.eclipse.org/) the Eclipse IDE for C/C++ Developers. You can use any other IDE you prefer. This document guides you through configuration using Eclipse IDE.

1. After launching Eclipse IDE and configuring the workspace (where your projects will be stored), press **Ctrl + n**, and create it as a C++ project.

1. On the next screen, set the name to the protocol you want to develop and select the project type as `Shared Library` and `AND Linux GCC`.

1. Edit the project properties, under **C/C++ Build** > **Settings** > **Tool Settings** > **GCC C++ Compiler** > **Miscellaneous** > **Tick Position Independent Code**.

1. Paste the example codes that you received with the SDK and compile it.

1. Add the artifacts (library, config.json, and metadata) to a tar.gz file, and change the file extension to \<XXX>.hdp, where is \<XXX> is the name of the plugin.

### Research 

Before you begin, verify that you:

- Read the protocol specification, if available.

- Know which protocol fields you plan to extract.

- Have planned your mapping objectives.

## About plugin files 

Three files are defined during the development process.

### JSON configuration file (required) 

This file should define the dissector ID and declarations, dependencies, integration requirements, validation parameters, and mapping definitions to translate values to names, numbers to text. For more information, see  the following links:

- [Prepare the configuration file (JSON)](#prepare-the-configuration-file-json)

- [Prepare implementation code validations](#prepare-implementation-code-validations)

- [Extract device metadata](#extract-device-metadata)

- [Connect to an indexing service (Baseline)](#connect-to-an-indexing-service-baseline)

### Implementation code: C++ (required)

The Implementation Code (CPP) parses raw traffic, and maps it to values such as services, classes, and function codes. It extracts the layer fields and maps them to their index names from the JSON configuration files. The fields to extract from CPP are defined in config file. for more information, see [Prepare the implementation code (C++)](#prepare-the-implementation-code-c).

### Mapping files (optional)

You can customize plugin output text to meet the needs of your enterprise environment.

:::image type="content" source="media/references-horizon-sdk/localization.png" alt-text="migration":::

You can define and update mapping files to update text without changing the code. Each file can map one or many fields:

  - Mapping of field values to names, for example, 1:Reset, 2:Start, 3:Stop.

  - Mapping text to support multiple languages.

For more information, see [Create mapping files (JSON)](#create-mapping-files-json).

## Create a dissector plugin (overview)

1. Review the [About the environment and setup](#about-the-environment-and-setup) section.

2.  [Prepare the implementation code (C++)](#prepare-the-implementation-code-c). Copy the **template.json** file and edit it to meet your needs. Do not change the keys. 

3. [Prepare the configuration file (JSON)](#prepare-the-configuration-file-json). Copy the **template.cpp** file and implement an override method. For more information, see [horizon::protocol::BaseParser](#horizonprotocolbaseparser) for details.

4. [Prepare implementation code validations](#prepare-implementation-code-validations).

## Prepare the implementation code (C++)

The CPP file is a parser responsible for:

- Validating the packet header and payload (for example header length, or payload structure).

- Extracting data from the header and payload into defined fields.

- Implementing configured fields extraction by the JSON file.

### What to do

Copy the template **.cpp** file and implement an override method. For more information, see [horizon::protocol::BaseParser](#horizonprotocolbaseparser).

### Basic C++ template sample 

This section provides the basic protocol template, with standard functions for a sample Defender for IoT Horizon Protocol.

```C++
#include “plugin/plugin.h”
namespace {
 class CyberxHorizonSDK: public horizon::protocol::BaseParser
  public:
   std::vector<uint64_t> processDissectAs(const std::map<std::string,
                                                         std::vector<std::string>> &filters) const override {
     return std::vector<uint64_t>();
   }
   horizon::protocol::ParserResult processLayer(horizon::protocol::management::IProcessingUtils &ctx,
                                                horizon::general::IDataBuffer &data) override {
     return horizon::protocol::ParserResult();
   }
 };
}

extern "C" {
  std::shared_ptr<horizon::protocol::BaseParser> create_parser() {
    return std::make_shared<CyberxHorizonSDK>();
  }
}

```

### Basic C++ template description  

This section provides the basic protocol template, with a description of standard functions for a sample Defender for IoT Horizon Protocol. 

### #include “plugin/plugin.h”

The definition the plugin uses. The header file contains everything needed to complete development.

### horizon::protocol::BaseParser

The communication interface between the Horizon infrastructure and the Plugin layer. For more information, see [Horizon architecture](#horizon-architecture) for an overview on the layers.

The processLayer is the method used to process data.

- The first parameter in the function code is the processing utility used for retrieving data previously processed, creating new fields, and layers.

- The second parameter in the function code is the current data passed from the previous parser.

```C++
horizon::protocol::ParserResult processLayer(horizon::protocol::management::IProcessingUtils &ctx,
                                               horizon::general::IDataBuffer &data) override {

```

### create_parser

Use to create the instance of your parser.

:::image type="content" source="media/references-horizon-sdk/code.png" alt-text="https://lh5.googleusercontent.com/bRNtyLpBA3LvDXttSPbxdBK7sHiHXzGXGhLiX3hJ7zCuFhbVsbBhgJlKI6Fd_yniueQqWbClg5EojDwEZSZ219X1Z7osoa849iE9X8enHnUb5to5dzOx2bQ612XOpWh5xqg0c4vR":::

## Protocol function code sample 

This section provides an example of how the code number (2 bytes) and the message length (4 bytes) are extracted.

This is done according to the endianness supplied in the JSON configuration file, which means if the protocol is *little endianness*, and the sensor runs on a machine with little endianness, it will be converted.

A layer is also created to store data. Use the *fieldsManager* from the processing utils to create new fields. A field can have only one of the following types: *STRING*, *NUMBER*, *RAW DATA*, *ARRAY* (of specific type), or *COMPLEX*. This layer may contain a number, raw, or string with ID.

In the sample below, the following two fields are extracted:

- `function_code_number`

- `headerLength`

A new layer is created, and the extracted field is copied into it.

The sample below describes a specific function, which is the main logic implemented for plugin processing.

```C++
namespace {
 class CyberxHorizonProtocol: public horizon::protocol::BaseParser {
  public:
   
   horizon::protocol::ParserResult processLayer(horizon::protocol::management::IProcessingUtils &ctx,
                                                horizon::general::IDataBuffer &data) override {
     uint16_t codeNumber = data.readUInt16();
     uint32_t headerLength = data.readUInt32();
 
     auto &layer = ctx.createNewLayer();
 
     ctx.getFieldsManager().create(layer,HORIZON_FIELD("code_number"),codeNumber;    
     ctx.getFieldsManager().create(layer,HORIZON_FIELD("header_length"),headerLength);     
     return horizon::protocol::SuccessResult();
   }
 

```

### Related JSON field 

:::image type="content" source="media/references-horizon-sdk/json.png" alt-text="The related json field.":::

## Prepare the configuration file (JSON)

The Horizon SDK uses standard JavaScript Object Notation (JSON), a lightweight format for storing and transporting data and does not require proprietary scripting languages.

This section describes minimal JSON configuration declarations, the related structure and provides a sample config file that defines a protocol. This protocol is automatically integrated with the device discovery service.

## File structure

The sample below describes the file structure.

:::image type="content" source="media/references-horizon-sdk/structure.png" alt-text="The sample of the file structure.":::

### What to do

Copy the template `config.json` file and edit it to meet your needs. Do not change the key. Keys are marked in red in the [Sample JSON configuration file](#sample-json-configuration-file). 

### File naming requirements 

The JSON Configuration file must be saved as `config.json`.

### JSON Configuration file fields

This section describes the JSON configuration fields you will be defining. Do not change the fields *labels*.

### Basic parameters

This section describes basic parameters.

| Parameter Label | Description | Type |
|--|--|--|
| **ID** | The name of the protocol. Delete the default and add the name of your protocol as it appears. | String |
| **endianess** | Defines how the multi byte data is encoded. Use the term “little” or “big” only. Taken from the protocol specification or traffic recording | String |
| **sanity_failure_codes** | These are the codes returned from the parser when there is a sanity conflict regarding the identity of the code. See magic number validation in the C++ section. | String |
| **malformed_codes** | These are codes that have been properly identified, but an error is detected. For example, if the field length is too short or long, or a value is invalid. | String |
| **dissect_as** | An array defining where the specific protocol traffic should arrive. | TCP/UDP, port etc. |
| **fields** | The declaration of which fields will be extracted from the traffic. Each field has its own ID (name), and type (numeric, string, raw, array, complex). For example, the field [function](https://docs.google.com/document/d/14nm8cyoGiaE0ODOYQd_xjULxVz9U_bjfPKkcDhOFr5Q/edit#bookmark=id.6s1zcxa9184k) that is extracted in the Implementation Parser file. The fields written in the config file are the only ones that can be added to the layer. |  |

### Other advanced fields 

This section describes other fields.

| Parameter Label | Description |
|-----------------|--------|
| **allow lists** | You can index the protocol values and display them in Data Mining Reports. These reports reflect your network baseline. :::image type="content" source="media/references-horizon-sdk/data-mining.png" alt-text="A sample of the data mining view."::: <br /> For more information, see [Connect to an indexing service (Baseline)](#connect-to-an-indexing-service-baseline) for details. |
| **firmware** | You can extract firmware information, define index values, and trigger firmware alerts for the plugin protocol. For more information, see [Extract firmware data](#extract-firmware-data) for details. |
| **value_mapping** | You can customize plugin output text to meet the needs of your enterprise environment by defining and updating mapping files. For example, map to language files. Changes can easily be implemented to text without changing or impacting the code. For more information, see [Create mapping files (JSON)](#create-mapping-files-json) for details. |

## Sample JSON configuration file

```json
{
  "id":"CyberX Horizon Protocol",
  "endianess": "big",
  "sanity_failure_codes": {
    "wrong magic": 0
  },
  "malformed_codes": {
    "not enough bytes": 0
  },
  "exports_dissect_as": {
  },
  "dissect_as": {
    "UDP": {
      "port": ["12345"]
    }
  },
  "fields": [
{
      "id": "function",
      "type": "numeric"
    },
    {
      "id": "sub_function",
      "type": "numeric"
    },
    {
      "id": "name",
      "type": "string"
    },
    {
      "id": "model",
      "type": "string"
    },
    {
      "id": "version",
      "type": "numeric"
    }
  ]
}


```

## Prepare implementation code validations

This section describes implementation C++ code validation functions and provides sample code. Two layers of validation are available:

- Sanity.

- Malformed Code.

You don’t need to create validation code in order to build a functioning plugin. If you don’t prepare validation code, you can review sensor Data Mining reports as an indication of successful processing.

Field values can be mapped to the text in mapping files and seamlessly updated without impacting processing.

## Sanity code validations 

This validates that the packet transmitted matches the validation parameters of the protocol, which helps you identify the protocol within the traffic.

For example, use the first 8 bytes as the *magic number*. If the sanity fails, a sanity failure response is returned.

For example:

```C++
  horizon::protocol::ParserResult 
processLayer(horizon::protocol::management::IProcessingUtils &ctx,
                                               horizon::general::IDataBuffer 
&data) override {

    uint64_t magic = data.readUInt64();

    if (magic != 0xBEEFFEEB) {

      return horizon::protocol::SanityFailureResult(0);

    }
```

If other relevant plugins have been deployed, the packet will be validated against them.

## Malformed code validations 

Malformed validations are used after the protocol has been positively validated.

If there is a failure to process the packets based on the protocol, a failure response is returned.

:::image type="content" source="media/references-horizon-sdk/failure.png" alt-text="malformed code":::

## C++ sample with validations

According to the function, the process is carried out, as shown in the example below.

### Function 20 

- It is processed as firmware.

- The fields are read according to the function.

- The fields are added to the layer.

### Function 10 

- The function contains another sub function, which is a more specific operation

- The subfunction is read and added to the layer.

Once this is done, processing is finished. The return value indicates if the dissector layer was successfully processed. If it was, the layer becomes usable.

```C++
#include "plugin/plugin.h"

#define FUNCTION_FIRMWARE_RESPONSE 20

#define FUNCTION_SUBFUNCTION_REQUEST 10

namespace {

class CyberxHorizonSDK: public horizon::protocol::BaseParser {

 public:

  std::vector<uint64_t> processDissectAs(const std::map<std::string,

                                                        std::vector<std::string>> &filters) const override {

    return std::vector<uint64_t>();

  }

  horizon::protocol::ParserResult processLayer(horizon::protocol::management::IProcessingUtils &ctx,

                                               horizon::general::IDataBuffer &data) override {

    uint64_t magic = data.readUInt64();

    if (magic != 0xBEEFFEEB) {

      return horizon::protocol::SanityFailureResult(0);

    }

    uint16_t function = data.readUInt16();

    uint32_t length = data.readUInt32();

    if (length > data.getRemaningData()) {

      return horizon::protocol::MalformedResult(0);

    }

    auto &layer = ctx.createNewLayer();

    ctx.getFieldsManager().create(layer, HORIZON_FIELD("function"), function);

    switch (function) {

      case FUNCTION_FIRMWARE_RESPONSE: {

        uint8_t modelLength = data.readUInt8();

        std::string model = data.readString(modelLength);

        uint16_t firmwareVersion = data.readUInt16();

        uint8_t nameLength = data.readUInt8();

        std::string name = data.readString(nameLength);

        ctx.getFieldsManager().create(layer, HORIZON_FIELD("model"), model);

        ctx.getFieldsManager().create(layer, HORIZON_FIELD("version"), firmwareVersion);

        ctx.getFieldsManager().create(layer, HORIZON_FIELD("name"), name);

      }

      break;

      case FUNCTION_SUBFUNCTION_REQUEST: {

       uint8_t subFunction = data.readUInt8();

       ctx.getFieldsManager().create(layer, HORIZON_FIELD("sub_function"), subFunction);

      }

      break;

    }

    return horizon::protocol::SuccessResult();

  }

};

}

extern "C" {

 std::shared_ptr<horizon::protocol::BaseParser> create_parser() {

   return std::make_shared<CyberxHorizonSDK>();

 }

}
```

## Extract device metadata

You can extract the following metadata on assets:

  - `Is_distributed_control_system` - Indicates if the protocol is part of Distributed Control System. (example: SCADA protocol should be false)

  - `Has_protocol_address` – Indicates if there is a protocol address; the specific address for the current protocol, for example MODBUS unit identifier

  - `Is_scada_protocol` - Indicates if the protocol is specific to OT networks

  - `Is_router_potential` - Indicates if the protocol is used mainly by routers. For example, LLDP, CDP, or STP.

In order to achieve this, the JSON configuration file needs to be updated using the metadata property.

## JSON sample with metadata 

```json

{
 "id":"CyberX Horizon Protocol",
 "endianess": "big",
 "metadata": {
   "is_distributed_control_system": false,
   "has_protocol_address": false,
   "is_scada_protocol": true,
   "is_router_potenial": false
 },
 "sanity_failure_codes": {
   "wrong magic": 0
 },
 "malformed_codes": {
   "not enough bytes": 0
 },
 "exports_dissect_as": {
 },
 "dissect_as": {
   "UDP": {
     "port": ["12345"]
   }
 },
 "fields": [
   {
     "id": "function",
     "type": "numeric"
},
   {
     "id": "sub_function",
     "type": "numeric"
   },
   {
     "id": "name",
     "type": "string"
   },
   {
     "id": "model",
     "type": "string"
   },
   {
     "id": "version",
     "type": "numeric"
   }
 ],
}

```

## Extract programming code 

When programming event occurs, you can extract the code content. The extracted content lets you:

- Compare code file content in different programming events.

- Trigger an alert on unauthorized programming.  

- Trigger an event for receiving programming code file.

  :::image type="content" source="media/references-horizon-sdk/change.png" alt-text="The programming change log.":::

  :::image type="content" source="media/references-horizon-sdk/view.png" alt-text="View the programming by clicking the button.":::

  :::image type="content" source="media/references-horizon-sdk/unauthorized.png" alt-text="The unauthorized PLC programming alert.":::

In order to achieve this, the JSON configuration file needs to be updated using the `code_extraction` property. 

### JSON configuration fields 

This section describes the JSON configuration fields. 

- **method**

  Indicates the way that programming event files are received. 

  ALL (each programming action will cause all the code files to be received even if there are files without changes).

- **file_type**  

  Indicates the code content type.  

  TEXT (each code file contains textual information).

- **code_data_field**
  
  Indicates the implementation field to use in order to provide the code content.

  FIELD.

- **code_name_field**

  Indicates the implementation field to use in order to provide the name of the coding file.

  FIELD.

- **size_limit**

  Indicates the size limit of each coding file content in BYTES, if a code file exceeds the set limit it will be dropped. If this field is not specified, the default value will be 15,000,000 that is 15 MB.

  Number.

- **metadata**

  Indicates additional information for a code file.

  Array containing objects with two properties:

    - name (String) -Indicates the metadata key XSense currently supports only the username key.
 
    - value (Field) - Indicates the implementation field to use in order to provide the metadata data.

## JSON sample with programming code

```json
{
  "id":"CyberXHorizonProtocol",
  "endianess": "big",
  "metadata": {
    "is_distributed_control_system": false,
    "has_protocol_address": false,
    "is_scada_protocol": true,
    "is_router_potenial": false
  },
  "sanity_failure_codes": {
    "wrong magic": 0
  },
  "malformed_codes": {
    "not enough bytes": 0
  },
  "exports_dissect_as": {
  },
  "dissect_as": {
    "UDP": {
      "port": ["12345"]
    }
  },
  "fields": [
    {
      "id": "function",
      "type": "numeric"
    },
    {
      "id": "sub_function",
      "type": "numeric"
    },
    {
      "id": "name",
      "type": "string"
    },
    {
      "id": "model",
      "type": "string"
    },
    {
      "id": "version",
      "type": "numeric"
    },
    {
      "id": "script",
      "type": "string"
    },
    {
      "id": "script_name",
      "type": "string"
    }, 
      "id": "username",
      "type": "string"
    }
  ],
"whitelists": [
    {
      "name": "Functions",
      "alert_title": "New Activity Detected - CyberX Horizon 
                                                Protocol Function",
      "alert_text": "There was an attempt by the source to 
                        invoke a new function on the destination",
       "fields": [
        {
          "name": "Source",
          "value": "IPv4.src"
        },
        {
          "name": "Destination",
          "value": "IPv4.dst"
        },
        {
          "name": "Function",
          "value": "CyberXHorizonProtocol.function"
        }
      ]
    },
"firmware": {
    "alert_text": "Firmware was changed on a network asset. 
                  This may be a planned activity, 
                  for example an authorized maintenance procedure",
    "index_by": [
      {
        "name": "Device",
        "value": "IPv4.src",
        "owner": true
      }
    ],
    "firmware_fields": [,
      {
        "name": "Model",
        "value": "CyberXHorizonProtocol.model",
        "firmware_index": "model"
      },
      {
        "name": "Revision",
        "value": "CyberXHorizonProtocol.version",
        “Firmware_index”: “firmware_version”
      },
      {
        "name": "Name",
        "value": "CyberXHorizonProtocol.name"
      }
    ]
  },
"code_extraction": {
    "method": "ALL",
    "file_type": "TEXT",
    "code_data_field": "script",
    "code_name_field": "script_name",
    "size_limit": 15000000,
    "metadata": [
      {
        "name": "username",
        "value": "username"
      }
    ]
  }
}

```
## Custom horizon alerts

Some protocols function code might indicate an error. For example, if the protocol controls a container with a specific chemical that must be stored always at a specific temperature. In this case, there may be function code indicating an error in the thermometer. For example, if the function code is 25, you can trigger an alert in the Web Console that indicates there is a problem with the container. In such case, you can define deep packet alerts.

Add the **alerts** parameter to the `config.json` of the plugin.

```json
“alerts”: [{
	“id”: 1,
	“message”: “Problem with thermometer at station {IPv4.src}”,
	“title”: “Thermometer problem”,
	“expression”: “{CyberXHorizonProtocol.function} == 25”
}]

```

## JSON configuration fields

This section describes the JSON configuration fields. 

| Field name | Description | Possible values |
|--|--|--|
| **ID** | Represents a single alert ID. It must be unique in this context. | Numeric value 0 - 10000 |
| **message** | Information displayed to the user. This field allows to you use different fields. | Use any field from your protocol, or any lower layer protocol. |
| **title** | The alert title |  |
| **expression** | When you want this alert to pop up. | Use any numeric field found in lower layers, or the current layer.</br></br> Each field should be wrapper with `{}`, in order for the SDK to detect it as a field, the supported logical operators are</br> == - Equal</br> <= - Less than or equal</br> >= - More than or equal</br> > - More than</br> < - Less than</br> ~= - Not equal |

## More about expressions

Every time the Horizon SDK invokes the expression and it becomes *true*, an alert will be triggered in the sensor.

Multiple expressions can be included under the same alert. For example,

`{CyberXHorizonProtocol.function} == 25 and {IPv4.src} == 269488144`.

This expression validates the function code only when the packet ipv4 src is 10.10.10.10. Which is a raw representation of the IP address in numeric representation.

You can use `and`, or `or` in order to connect expressions.

## JSON sample custom horizon alerts

```json
 "id":"CyberX Horizon Protocol",
 "endianess": "big",
 "metadata": {
   "is_distributed_control_system": false,
   "has_protocol_address": false,
   "is_scada_protocol": true,
   "is_router_potenial": false
 },
 "sanity_failure_codes": {
   "wrong magic": 0
 },
 "malformed_codes": {
   "not enough bytes": 0
 },
 "exports_dissect_as": {
 },
 "dissect_as": {
   "UDP": {
     "port": ["12345"]
   }
 },
 …………………………………….
 “alerts”: [{
“id”: 1,
“message”: “Problem with thermometer at station {IPv4.src}”,
“title”: “Thermometer problem”,
“expression”: “{CyberXHorizonProtocol.function} == 25”

```

## Connect to an indexing service (Baseline)

You can index the protocol values and display them in Data Mining reports.

:::image type="content" source="media/references-horizon-sdk/data-mining.png" alt-text="A view of the data mining option.":::

These values can later be mapped to specific texts, for example-mapping numbers as texts or adding information, in any language.

:::image type="content" source="media/references-horizon-sdk/localization.png" alt-text="migration":::

For more information, see [Create mapping files (JSON)](#create-mapping-files-json) for details.

You can also use values from protocols previously parsed to extract additional information.

For example, for the value, which is based on TCP, you can use the values from IPv4 layer. From this layer you can extract values such as the source of the packet, and the destination.

In order to achieve this, the JSON configuration file needs to be updated using the `whitelists` property.

## Allow list (data mining) fields

The following allow list fields are available:

- name – The name used for indexing.

- alert_title – A short, unique title that explains the event.

- alert_text – Additional information

Multiple allow lists can be added, allowing complete flexibility in indexing.

## JSON sample with indexing 

```json
{
  "id":"CyberXHorizonProtocol",
  "endianess": "big",
  "metadata": {
    "is_distributed_control_system": false,
    "has_protocol_address": false,
    "is_scada_protocol": true,
    "is_router_potenial": false
  },
  "sanity_failure_codes": {
    "wrong magic": 0
  },
  "malformed_codes": {
    "not enough bytes": 0
  },
  "exports_dissect_as": {
  },
  "dissect_as": {
    "UDP": {
      "port": ["12345"]
    }
  },
  "fields": [
    {
      "id": "function",
      "type": "numeric"
    },
    {
      "id": "sub_function",
      "type": "numeric"
    },
    {
      "id": "name",
      "type": "string"
    },
    {
      "id": "model",
      "type": "string"
    },
    {
      "id": "version",
      "type": "numeric"
    }
  ],
"whitelists": [
    {
      "name": "Functions",
      "alert_title": "New Activity Detected - CyberX Horizon Protocol Function",
      "alert_text": "There was an attempt by the source to invoke a new function on the destination",
       "fields": [
        {
          "name": "Source",
          "value": "IPv4.src"
        },
        {
          "name": "Destination",
          "value": "IPv4.dst"
        },
        {
          "name": "Function",
          "value": "CyberXHorizonProtocol.function"
        }
      ]
    }

```
## Extract firmware data

You can extract firmware information, define index values, and trigger firmware alerts for the plugin protocol. For example,

- Extract the firmware model or version. This information can be further utilized to identify CVEs.

- Trigger an alert when a new firmware version is detected.

In order to achieve this, the JSON configuration file needs to be updated using the firmware property.

## Firmware fields

This section describes the JSON firmware configuration fields.

- **name**
  
  Indicates how the field is presented in the sensor console.

- **value**

 Indicates the implementation field to use in order to provide the data. 

- **firmware_index:**

  Select one:  
  - **model**: The device model. Enables detection of CVEs.
  - **serial**: The device serial number. The serial number is not always available for all protocols. This value is unique per device.
  - **rack**: Indicates the rack identifier, if the device is part of a rack.
  - **slot**: The slot identifier, if the device is part of a rack.  
  - **module_address**: Use to present a hierarchy if the module can be presented behind another device. Applicable instead if a rack slot combination, which is a simpler presentation.  
  - **firmware_version**: Indicates the device version. Enables detection of CVEs.
  - **alert_text**: Indicates text describing firmware deviations, for example, version changes.  
  - **index_by**: Indicates the fields used to identify and index the device. In the example below the device is identified by its IP address. In certain protocols, a more complex index can be used. For example, if another device connected, and you know how to extract its internal path. For example, the MODBUS Unit ID, can be used as part of the index, as a different combination of IP address and the Unit Identifier.
  - **firmware_fields**: Indicates which fields are device metadata fields. In this example, the following are used: model, revision, and name. Each protocol can define its own firmware data.

## JSON sample with firmware 

```json
{
  "id":"CyberXHorizonProtocol",
  "endianess": "big",
  "metadata": {
    "is_distributed_control_system": false,
    "has_protocol_address": false,
    "is_scada_protocol": true,
    "is_router_potenial": false
  },
  "sanity_failure_codes": {
    "wrong magic": 0
  },
  "malformed_codes": {
    "not enough bytes": 0
  },
  "exports_dissect_as": {
  },
  "dissect_as": {
    "UDP": {
      "port": ["12345"]
    }
  },
  "fields": [
    {
      "id": "function",
      "type": "numeric"
    },
    {
      "id": "sub_function",
      "type": "numeric"
    },
    {
      "id": "name",
      "type": "string"
    },
    {
      "id": "model",
      "type": "string"
    },
    {
      "id": "version",
      "type": "numeric"
    }
  ],
"whitelists": [
    {
      "name": "Functions",
      "alert_title": "New Activity Detected - CyberX Horizon Protocol Function",
      "alert_text": "There was an attempt by the source to invoke a new function on the destination",
       "fields": [
        {
          "name": "Source",
          "value": "IPv4.src"
        },
        {
          "name": "Destination",
          "value": "IPv4.dst"
        },
        {
          "name": "Function",
          "value": "CyberXHorizonProtocol.function"
        }
      ]
    },
"firmware": {
    "alert_text": "Firmware was changed on a network asset.   
                  This may be a planned activity, for example an authorized maintenance procedure",
    "index_by": [
      {
        "name": "Device",
        "value": "IPv4.src",
        "owner": true
      }
    ],
    "firmware_fields": [,
      {
        "name": "Model",
        "value": "CyberXHorizonProtocol.model",
        "firmware_index": "model"
      },
      {
        "name": "Revision",
        "value": "CyberXHorizonProtocol.version",
        “Firmware_index”: “firmware_version”
      },
      {
        "name": "Name",
        "value": "CyberXHorizonProtocol.name"
      }
    ]
  }
}

```
## Extract device attributes 

You can enhance device the information available in the Device in Inventory, Data Mining, and other reports.

- Name

- Type

- Vendor

- Operating System

In order to achieve this, the JSON configuration file needs to be updated using the **Properties** property. 

You can do this after writing the basic plugin and extracting required fields.

## Properties fields

This section describes the JSON properties configuration fields. 

**config_file** 

Contains the file name that defines how to process each key in the `key` fields. The config file itself should be in JSON format and be included as part of the plugin protocol folder.

Each key in the JSON defines the set of action that should be done when you extract this key from a packet.

Each key can have:

- **Packet Data** - Indicates the properties that would be updated based on the data extracted from the packet (the implementation field used to provide that data).

- **Static Data** - Indicates predefined set of `property-value` actions that should be updated.

The properties that can be configured in this file are: 

- **Name** - Indicates the device name.

- **Type** - Indicates the device type.

- **Vendor** - Indicates device vendor.

- **Description** - Indicates the device firmware model (lower priority than “model”).

- **operatingSystem** - Indicates the device operating system.

### Fields

| Field | Description |
|--|--|
| key | Indicates the key. |
| value | Indicates the implementation field to use in order to provide the data. |
| is_static_key | Indicates whether the `key` field is derived as a value from the packet or is it a predefined value. |

### Working with static keys only

If you are working with static keys, then you don't have to configure the `config.file`. You can configure the JSON file only.

## JSON sample with properties 

```json
{
  "id":"CyberXHorizonProtocol",
  "endianess": "big",
  "metadata": {
    "is_distributed_control_system": false,
    "has_protocol_address": false,
    "is_scada_protocol": true,
    "is_router_potenial": false
  },
  "sanity_failure_codes": {
    "wrong magic": 0
  },
  "malformed_codes": {
    "not enough bytes": 0
  },
  "exports_dissect_as": {
  },
  "dissect_as": {
    "UDP": {
      "port": ["12345"]
    }
  },
  "fields": [
    {
      "id": "function",
      "type": "numeric"
    },
  
      "id": "sub_function",
      "type": "numeric"
    },
    {
      "id": "name",
      "type": "string"
    },
    {
      "id": "model",
      "type": "string"
    },
    {
      "id": "version",
      "type": "numeric"
    },
    {
      "id": "vendor",
      "type": "string"
    }
  ],
"whitelists": [
    {
      "name": "Functions",
      "alert_title": "New Activity Detected - CyberX Horizon Protocol Function",
      "alert_text": "There was an attempt by the source to invoke a new function on the destination",
       "fields": [
        {
          "name": "Source",
          "value": "IPv4.src"
        },
        {
          "name": "Destination",
          "value": "IPv4.dst"
        },
        {
          "name": "Function",
          "value": "CyberXHorizonProtocol.function"
        }
      ]
    },
"firmware": {
    "alert_text": "Firmware was changed on a network asset. 
                  This may be a planned activity, for example an authorized maintenance procedure",
    "index_by": [
      {
        "name": "Device",
        "value": "IPv4.src",
        "owner": true
      }
    ],
    "firmware_fields": [,
      {
        "name": "Model",
        "value": "CyberXHorizonProtocol.model",
        "firmware_index": "model"
      },
      {
        "name": "Revision",
        "value": "CyberXHorizonProtocol.version",
        “Firmware_index”: “firmware_version”
      },
      {
        "name": "Name",
        "value": "CyberXHorizonProtocol.name"
      }
    ]
  }
"properties": {
    "config_file": "config_file_example",
"fields": [
  {
    "key": "vendor",
    "value": "CyberXHorizonProtocol.vendor",
    "is_static_key": true
  },
{
    "key": "name",
    "value": "CyberXHorizonProtocol.vendor",
    "is_static_key": true
  },

]
  }
}

```

## CONFIG_FILE_EXAPMLE JSON 

```json
{
"someKey": {
  "staticData": {
    "model": "FlashSystem", 
    "vendor": "IBM", 
    "type": "Storage"}
  }
  "packetData": [
    "name”  
  ]
}

```

## Create mapping files (JSON)

You can customize plugin output text to meet the needs of your enterprise environment by defining and update-mapping files. Changes can easily be implemented to text without changing or impacting the code. Each file can map one or many fields.

- Mapping of field values to names, for example 1:Reset, 2:Start, 3:Stop.

- Mapping text to support multiple languages.

Two types of mapping files can be defined.

  - [Simple mapping file](#simple-mapping-file).

  - [Dependency mapping file](#dependency-mapping-file).

    :::image type="content" source="media/references-horizon-sdk/localization.png" alt-text="ether net":::

    :::image type="content" source="media/references-horizon-sdk/unhandled.png" alt-text="A view of the unhandled alerts.":::

    :::image type="content" source="media/references-horizon-sdk/policy-violation.png" alt-text="A list of known policy violations.":::

## File naming and storage requirements 

Mapping files should be saved under the metadata folder.

The name of the file should match the JSON config file ID.

:::image type="content" source="media/references-horizon-sdk/json-config.png" alt-text="A sample of a JSON config file.":::

## Simple mapping file 

The following sample presents a basic JSON file as a key value.

When you create an allow list, and it contains one or more of the mapped fields. The value will be converted from a number, string, or any type, in to formatted text presented in the mapping file.

```json
{
  “10”: “Read”,
  “20”: “Firmware Data”,
  “3”: “Write”
}

```

## Dependency-mapping file 

To indicate that the file is a dependency file, add the keyword `dependency` to the mapping configuration.

```json
dependency": { "field": "CyberXHorizonProtocol.function"  }}]
  }],
  "firmware": {
    "alert_text": "Firmware was changed on a network asset. This may be a planned activity, for example an authorized maintenance procedure",
    "index_by": [{ "name": "Device", "value": "IPv4.src", "owner": true }],
    "firmware_fields": [{ "name": "Model", "value":

```

The file contains a mapping between the dependency field and the function field. For example, between the function, and sub function. The sub function changes according to the function supplied.

In the allow list previously configured, there is no dependency configuration, as shown below.

```json
"whitelists": [
{
"name": "Functions",
"alert_title": "New Activity Detected - CyberX Horizon Protocol Function",
"alert_text": "There was an attempt by the source to invoke a new function on the destination",
"fields": [
{
"name": "Source",
"value": "IPv4.src"
},
{
"name": "Destination",
"value": "IPv4.dst"
},
{
"name": "Function",
"value": "CyberXHorizonProtocol.function"
}
]
}

```

The dependency can be based on a specific value or a field. In the example below, it is based on a field. If you base it on a value, define the extract value to be read from the mapping file.

In the example below, the dependency as follow for same value of the field.

For example, in the sub function five, the meaning is changed based on the function.

  - If it is a read function, then five means Read Memory.

  - If it is a write function, the same value is used to read from a file.

    ```json
    {
      “10”: {
         “5”:  “Memory”,
         “6”: “File”,
         “7” “Register”
       },
      “3”: {
       “5”: “File”,
       “7”: “Memory”,
       “6”, “Register”
      }
    }

    ```

### Sample file

```json
{
  "id":"CyberXHorizonProtocol",
  "endianess": "big",
  "metadata": {"is_distributed_control_system": false, "has_protocol_address": false, "is_scada_protocol": true, "is_router_potenial": false},
  "sanity_failure_codes": { "wrong magic": 0 },
  "malformed_codes": { "not enough bytes": 0  },
  "exports_dissect_as": {  },
  "dissect_as": { "UDP": { "port": ["12345"] }},
  "fields": [{ "id": "function", "type": "numeric" }, { "id": "sub_function", "type": "numeric" },
     {"id": "name", "type": "string" }, { "id": "model", "type": "string" }, { "id": "version", "type": "numeric" }],
  "whitelists": [{
      "name": "Functions",
      "alert_title": "New Activity Detected - CyberX Horizon Protocol Function",
      "alert_text": "There was an attempt by the source to invoke a new function on the destination",
      "fields": [{ "name": "Source", "value": "IPv4.src" }, { "name": "Destination", "value": "IPv4.dst" },
        { "name": "Function", "value": "CyberXHorizonProtocol.function" },
        { "name": "Sub function", "value": "CyberXHorizonProtocol.sub_function", "dependency": { "field": "CyberXHorizonProtocol.function"  }}]
  }],
  "firmware": {
    "alert_text": "Firmware was changed on a network asset. This may be a planned activity, for example an authorized maintenance procedure",
    "index_by": [{ "name": "Device", "value": "IPv4.src", "owner": true }],
    "firmware_fields": [{ "name": "Model", "value": "CyberXHorizonProtocol.model", "firmware_index": "model" },
       { "name": "Revision", "value": "CyberXHorizonProtocol.version", "firmware_index": "firmware_version" },
       { "name": "Name", "value": "CyberXHorizonProtocol.name" }]
  },
  "value_mapping": {
      "CyberXHorizonProtocol.function": {
        "file": "function-mapping"
      },
      "CyberXHorizonProtocol.sub_function": {
        "dependency": true,
        "file": "sub_function-mapping"
      }
  }
}

```

## JSON sample with mapping

```json
{
  "id":"CyberXHorizonProtocol",
  "endianess": "big",
  "metadata": {
    "is_distributed_control_system": false,
    "has_protocol_address": false,
    "is_scada_protocol": true,
    "is_router_potenial": false
  },
  "sanity_failure_codes": {
    "wrong magic": 0
  },
  "malformed_codes": {
    "not enough bytes": 0
  },
  "exports_dissect_as": {
  },
  "dissect_as": {
    "UDP": {
      "port": ["12345"]
    }
  },
  "fields": [
    {
      "id": "function",
      "type": "numeric"
    },
    {
      "id": "sub_function",
      "type": "numeric"
    },
    {
      "id": "name",
      "type": "string"
    },
    {
      "id": "model",
      "type": "string"
    },
    {
      "id": "version",
      "type": "numeric"
    }
  ],
"whitelists": [
    {
      "name": "Functions",
      "alert_title": "New Activity Detected - CyberX Horizon Protocol Function",
      "alert_text": "There was an attempt by the source to invoke a new function on the destination",
       "fields": [
        {
          "name": "Source",
          "value": "IPv4.src"
        },
        {
          "name": "Destination",
          "value": "IPv4.dst"
        },
        {
          "name": "Function",
          "value": "CyberXHorizonProtocol.function"
        },
        {
          “name”: “Sub function”,
          “value”: “CyberXHorizonProtocol.sub_function”,
          “dependency”: {
              “field”: “CyberXHorizonProtocol.function”
        }
      ]
    },
"firmware": {
    "alert_text": "Firmware was changed on a network asset. This may be a planned activity, for example an authorized maintenance procedure",
    "index_by": [
      {
        "name": "Device",
        "value": "IPv4.src",
        "owner": true
      }
    ],
    "firmware_fields": [,
      {
        "name": "Model",
        "value": "CyberXHorizonProtocol.model",
        "firmware_index": "model"
      },
      {
        "name": "Revision",
        "value": "CyberXHorizonProtocol.version",
        “Firmware_index”: “firmware_version”
      },
      {
        "name": "Name",
        "value": "CyberXHorizonProtocol.name"
      }
    ]
  },
"value_mapping": {
    "CyberXHorizonProtocol.function": {
      "file": "function-mapping"
    },
    "CyberXHorizonProtocol.sub_function": {
      "dependency": true,
      "file": "sub_function-mapping"
    }
}

```
## Package, upload, and monitor the plugin 

This section describes how to

  - Package your plugin.

  - Upload your plugin.

  - Monitor and debug the plugin to evaluate how well it is performing.

To package the plugin:

1. Add the **artifact** (can be, library, config.json, or metadata) to a `tar.gz` file.

1. Change the file extension to \<XXX.hdp>, where is \<XXX> is the name of the plugin.

To sign in to the Horizon Console:

1.  Sign in your sensor CLI as an administrator, CyberX, or Support user.

2.  In the file: `/var/cyberx/properties/horizon.properties` change the **ui.enabled** property to **true** (`horizon.properties:ui.enabled=true`).

3.  Sign in to the sensor console.

4.  Select the **Horizon** option from the main menu.

    :::image type="content" source="media/references-horizon-sdk/horizon.png" alt-text="Select the horizon option from the left side pane.":::

    The Horizon Console opens.

    :::image type="content" source="media/references-horizon-sdk/plugins.png" alt-text="A view of the Horizon console and all of its plugins.":::

## Plugins pane

The plugin pane lists:

  - Infrastructure plugins: Infrastructure plugins installed by default with Defender for IoT.

  - Application plugins: Application plugins installed by default with Defender for IoT and other plugins developed by Defender for IoT, or external developers.
    
Enable and disable plugins that have been uploaded using the toggle.

:::image type="content" source="media/references-horizon-sdk/toggle.png" alt-text="The CIP toggle.":::

### Uploading a plugin

After creating and packaging your plugin, you can upload it to the Defender for IoT sensor. To achieve full coverage of your network, you should upload the plugin to each sensor in your organization.

To upload:

1.  Sign in to your sensor.


2. Select **Upload**.

    :::image type="content" source="media/references-horizon-sdk/upload.png" alt-text="Upload your plugins.":::

3. Browse to your plugin and drag it to the plugin dialog box. Verify that the prefix is `.hdp`. The plugin loads.

## Plugin status overview 

The Horizon console **Overview** window provides information about the plugin you uploaded and lets you disable and enable them.

:::image type="content" source="media/references-horizon-sdk/overview.png" alt-text="The overview of the Horizon console.":::

| Field | Description |
|--|--|
| Application | The name of the plugin you uploaded. |
| :::image type="content" source="media/references-horizon-sdk/switch.png" alt-text="The on and off switch."::: | Toggle **On** or **Off** the plugin. Defender for IoT will not handle protocol traffic defined in the plugin when you toggle off the plugin. |
| Time | The time the data was last analyzed. Updated every 5 seconds. |
| PPS | The number of packets per second. |
| Bandwidth | The average bandwidth detected within the last 5 seconds. |
| Malforms | Malformed validations are used after the protocol has been positively validated. If there is a failure to process the packets based on the protocol, a failure response is returned.   <br><br>This column indicates the number of malform errors in the past 5 seconds. For more information, see [Malformed code validations](#malformed-code-validations) for details. |
| Warnings | Packets match the structure and specification but there is unexpected behavior based on the plugin warning configuration. |
| Errors | The number of packets that failed basic protocol validations. Validates that the packet matches the protocol definitions. The Number displayed here indicates that number of errors detected in the past 5 seconds. For more information, see [Sanity code validations](#sanity-code-validations) for details. |
| :::image type="content" source="media/references-horizon-sdk/monitor.png" alt-text="The monitor icon."::: | Review details about malform and warnings detected for your plugin. |

## Plugin details

You can monitor real-time plugin behavior by analyzing the number of *Malform* and *Warnings* detected for your plugin. An option is available to freeze the screen and export for further investigation

:::image type="content" source="media/references-horizon-sdk/snmp.png" alt-text="The SNMP monitor screen.":::

To Monitor:

Select the Monitor button for your plugin from the Overview.

Next Steps

Set up your [Horizon API](references-horizon-api.md)

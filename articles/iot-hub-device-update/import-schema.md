---
title: Import manifest schema for Azure Device Update for IoT Hub
description: Understand the schema used to create the required import manifest for importing updates into Azure Device Update for IoT Hub.
author: andrewbrownmsft
ms.author: andbrown
ms.date: 01/09/2025
ms.topic: concept-article
ms.service: azure-iot-hub
ms.subservice: device-update
---

# Azure Device Update for IoT Hub import manifest schema

When you import an update into Azure Device Update for Iot Hub, you also submit an associated JSON import manifest file that defines important information about the update. This article describes the schema used to create the JSON import manifest file.

To learn more about import manifest concepts and file structure, see [Azure Device Update for IoT Hub import manifest](import-concepts.md). To learn how to create the file, see [Prepare an update to import into Device Update for IoT Hub](import-update.md).

## Schema

The import manifest JSON schema is hosted at [SchemaStore.org](https://json.schemastore.org/azure-deviceupdate-import-manifest-5.0.json) and consists of the following properties. No other properties are allowed.


|Property|Type|Description|Required|
|---|---|---|---|
|**$schema**|`string`|JSON schema reference.|No|
|**updateId**|`updateId`|Unique update identifier.|Yes|
|**description**|`string`|Optional update description. Maximum length 512 characters.|No|
|**compatibility**|`compatibility`|List of device property sets this update is compatible with.|Yes|
|**instructions**|`instructions`|Update installation instructions.|Yes|
|**files**|`file` `[0-10]`|List of update payload files. Sum of all file sizes can't exceed 2 GB. Can be empty or null if all instruction steps are reference steps.|No|
|**manifestVersion**|`string`|Import manifest schema version. Must be 5.0.|Yes|
|**createdDateTime**|`string`|Import manifest creation date and time in ISO 8601 format, for example `"2020-10-02T22:18:04.9446744Z"`.|Yes|

### Update object

The `updateID` object is a unique identifier for each update.

|Property|Type|Description|Required|
|---|---|---|---|
|**provider**|`string`|Entity who is creating or directly responsible for the update. The **provider** can be a company name.<br>Pattern: `^[a-zA-Z0-9.-]+$`<br>Maximum length: 64 characters|Yes|
|**name**|`string`|Identifier for a class of update. The **name** can be a device class or model name.<br>Pattern: `^[a-zA-Z0-9.-]+$`<br>Maximum length: 64 characters|Yes|
|**version**|`string`|Two- to four-part dot-separated numerical version numbers. Each part must be a number between 0 and 2147483647, and leading zeroes are dropped.<br>Pattern: `^\d+(?:\.\d+)+$`<br>Examples: `"1.0"`, `"2021.11.8"`|Yes|

No other properties are allowed.

For example:

```json
{
  "updateId": {
    "provider": "Contoso",
    "name": "Toaster",
    "version": "1.0"
  }
}
```

### Compatibility object

The `compatibility` object describes 1-5 properties of a device that this update is compatible with. Each property is a `string` type name-value pair. The name must be 1-32 characters long and the value must be 1-64 characters long. You can't use the same exact set of compatibility properties with more than one update provider and name combination.

For example:

```json
{
  "compatibility": [
    {
      "manufacturer": "Contoso",
      "model": "Toaster"
    }
  ]
}
```

### Instructions object

The `instructions` object provides the update installation instructions. The instructions object contains a list of `steps` to be performed. No other properties are allowed.

Steps can either be code to execute or pointers to other updates. A step object defaults to `inline` if no `type` value is provided.

|Property|Type|Description|Required|
|---|---|---|---|
|**steps**|`array[1-10]`|Each element in the `steps` array must be either an [inline step object](#inline-step-object) or a [reference step object](#reference-step-object).|Yes|

For example:

```json
{
  "instructions": {
    "steps": [
      {
        "type": "inline",
        ...
      },
      {
        "type": "reference",
        ...
      }
    ]
  }
}
```

#### Inline step object

An `inline` step object is an installation instruction step that performs code execution.

|Property|Type|Description|Required|
|---|---|---|---|
|**type**|`string`|Instruction step type that performs code execution. Must be `inline`. Defaults to `inline` if no value is provided.|No|
|**description**|`string`|Optional instruction step description. Maximum length: 64 characters.|No|
|**handler**|`string`|Identity of the handler on the device that can execute this step.<br>Pattern: `^\S+/\S+:\d{1,5}$`<br>Minimum length: Five characters<br>Maximum length: 32 characters<br>Examples: `microsoft/script:1`, `microsoft/swupdate:1`, `microsoft/apt:1` |Yes|
|**files**|`string` `[1-10]`| Names of update files defined as [file objects](#files-object) that the agent passes to the handler. Each element length must be 1-255 characters. |Yes|
|**handlerProperties**|`inlineStepHandlerProperties`|JSON objects that the agent passes to the handler as arguments.|No|

No other properties are allowed.

For example:

```json
{
  "steps": [
    {
      "description": "pre-install script",
      "handler": "microsoft/script:1",
      "handlerProperties": {
        "arguments": "--pre-install"
      },
      "files": [
        "configure.sh"
      ]
    }
  ]
}
```

#### Reference step object

A `reference` step object is an installation instruction step to install another update.

|Property|Type|Description|Required|
|---|---|---|---|
|**type**|`referenceStepType`|Instruction step type that installs another update. Must be `reference`.|Yes|
|**description**|`stepDescription`|Optional instruction step description. Maximum length: 64 characters. |No|
|**updateId**|`updateId`|Unique update identifier.|Yes|

No other properties are allowed.

For example:

```json
{
  "steps": [
    {
      "type": "reference",
      "updateId": {
        "provider": "Contoso",
        "name": "Toaster.HeatingElement",
        "version": "1.0"
      }
    }
  ]
}
```

### Files object

Each `files` object is an update payload file, such as a binary, firmware, or script file, that must be unique within an update.

|Property|Type|Description|Required|
|---|---|---|---|
|**filename**|`string`|Update payload file name. Maximum length: 255 characters|Yes|
|**sizeInBytes**|`number`|File size in number of bytes. Maximum size: 2147483648 bytes|Yes|
|**hashes**|`fileHashes`|Base64-encoded file hashes with algorithm name as key. At least SHA-256 algorithm must be specified, and additional algorithms may be specified if supported by agent. See [Hashes object](#hashes-object) for details on how to calculate the hash.|Yes|
|**relatedFiles**|`relatedFile[0-4]`|Collection of files related to one or more primary payload files. For more information, see [relatedFiles object](#relatedfiles-object).|No|
|**downloadHandler**|`downloadHandler`|Specifies how to process any related files. |Yes, if using `relatedFiles`. For more information, see [downloadHandler object](#downloadhandler-object).|

No other properties are allowed.

For example:

```json
{
  "files": [
    {  
      "fileName": "full-image-file-name",
      "sizeInBytes": 12345,
      "hashes": {...},
      "relatedFiles": [
        {
          "fileName": "delta-from-v1-file-name",
          "sizeInBytes": 1234,
          "hashes": {
            "SHA256": "delta-from-v1-file-hash"
          },
          "properties": {...}
        }  
      ],
      "downloadHandler": {
        "id": "microsoft/delta:1"
        }
    }
  ]
}
```

#### Hashes object

The `hashes` object contains base64-encoded file hashes with the algorithm names as keys. At least the SHA-256 algorithm must be specified, and other algorithms may be specified if supported by the agent. For an example of how to calculate the hash correctly, see the `Get-AduFileHashes` function in the [AduUpdate.psm1 script](https://github.com/Azure/iot-hub-device-update/blob/main/tools/AduCmdlets/AduUpdate.psm1).

|Property|Type|Description|Required|
|---|---|---|---|
|**sha256**|`string`|Base64-encoded file hash value using SHA-256 algorithm.|Yes|

Other properties are allowed.

For example:

```json
{
  "hashes": {
    "sha256": "/CD7Sn6fiknWa3NgcFjGlJ+ccA81s1QAXX4oo5GHiFA="
  }
}
```

#### relatedFiles object

The `relatedFiles` object contains a collection of files that are related to one or more primary payload files. For more information, see [Use the related files feature to reference multiple update files](related-files.md).


|Property|Type|Description|Required|
|---|---|---|---|
|**filename**|`string`|List of related files associated with a primary payload file.|Yes|
|**sizeInBytes**|`number`|File size in number of bytes. Maximum size: 2147483648 bytes.|Yes|
|**hashes**|`fileHashes`|Base64-encoded file hashes with algorithm name as key. For more information, see [Hashes object](#hashes-object). |Yes|
|**properties**|`relatedFilesProperties` `[0-5]`|Up to five key-value pairs, where the key is limited to 64 ASCII characters and the value is a JObject with up to 256 ASCII characters. |No|

Other properties are allowed.

For example:

```json
"relatedFiles": [
  {
    "filename": "in1_in2_deltaupdate.dat",
    "sizeInBytes": 102910752,
    "hashes": {
      "sha256": "2MIldV8LkdKenjJasgTHuYi+apgtNQ9FeL2xsV3ikHY="
    },
    "properties": {
      "microsoft.sourceFileHashAlgorithm": "sha256",
      "microsoft.sourceFileHash": "YmFYwnEUddq2nZsBAn5v7gCRKdHx+TUntMz5tLwU+24="
    }
  }
],
```

#### downloadHandler object

The `downloadHandler` object specifies how to process any related files.

|Property|Type|Description|Required|
|---|---|---|---|
|**id**|`string`|Identifier for `downloadHandler`. Limit of 64 ASCII characters.|Yes, if using `relatedFiles`|

No other properties are allowed.

For example:

```json
"downloadHandler": {
  "id": "microsoft/delta:1"
}
```

## Related content

- [Import concepts and manifest](./import-concepts.md)
- [Prepare an update to import](create-update.md)
- [Import an update](import-update.md)

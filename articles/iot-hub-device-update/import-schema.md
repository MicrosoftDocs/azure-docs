---
title: Importing updates into Device Update for IoT Hub - import manifest schema
description: Schema used to create the import manifest required to import updates into Device Update for IoT Hub.
author: andrewbrownmsft
ms.author: andbrown
ms.date: 09/9/2022
ms.topic: concept-article
ms.service: iot-hub-device-update
---

# Importing updates into Device Update for IoT Hub: schema and other information

If you want to import an update into Device Update for IoT Hub, be sure you've reviewed the [concepts](import-concepts.md) and [how-to guide](import-update.md) first. If you're interested in the details of the import manifest schema itself, see below.

The import manifest JSON schema is hosted at [SchemaStore.org](https://json.schemastore.org/azure-deviceupdate-import-manifest-5.0.json).

## Schema

|Property|Type|Description|Required|
|---|---|---|---|
|**$schema**|`string`|JSON schema reference.|No|
|**updateId**|`updateId`|Unique update identifier.|Yes|
|**description**|`string`|Optional update description.<br><br>Maximum length: 512 characters|No|
|**compatibility**|`compatibility`|List of device property sets this update is compatible with.|Yes|
|**instructions**|`instructions`|Update installation instructions.|Yes|
|**files**|`file` `[0-10]`|List of update payload files. Sum of all file sizes may not exceed 2 GB. May be empty or null if all instruction steps are reference steps.|No|
|**manifestVersion**|`string`|Import manifest schema version. Must be 5.0.|Yes|
|**createdDateTime**|`string`|Date & time import manifest was created in ISO 8601 format.<br><br>Example: `"2020-10-02T22:18:04.9446744Z"`|Yes|

Additional properties aren't allowed.

## updateId object

The *updateID* object is a unique identifier for each update.

|Property|Type|Description|Required|
|---|---|---|---|
|**provider**|`string`|Entity who is creating or directly responsible for the update. It can be a company name.<br><br>Pattern: `^[a-zA-Z0-9.-]+$`<br>Maximum length: 64 characters|Yes|
|**name**|`string`|Identifier for a class of update. It can be a device class or model name.<br><br>Pattern: `^[a-zA-Z0-9.-]+$`<br>Maximum length: 64 characters|Yes|
|**version**|`string`|Two- to four-part dot-separated numerical version numbers. Each part must be a number between 0 and 2147483647 and leading zeroes will be dropped.<br><br>Pattern: `^\d+(?:\.\d+)+$`<br>Examples: `"1.0"`, `"2021.11.8"`|Yes|

Additional properties aren't allowed.

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

## compatibility object

The *compatibility* object describes the properties of a device that this update is compatible with.

* **Type**: `object`
* **Minimum Properties**: `1`
* **Maximum Properties**: `5`

Each property is a name-value pair of type string.

* **Minimum Property Name Length**: `1`
* **Maximum Property Name Length**: `32`
* **Minimum Property Value Length**: `1`
* **Maximum Property Value Length**: `64`

The same exact set of compatibility properties can't be used with more than one update provider and name combination.

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

## instructions object

The *instructions* object provides the update installation instructions. The instructions object contains a list of steps to be performed. Steps can either be code to execute or a pointer to another update.

|Property|Type|Description|Required|
|---|---|---|---|
|**steps**|`array[1-10]`|Each element in the array must be either an [inlineStep object](#inlinestep-object) or a [referenceStep object](#referencestep-object).|Yes|

Additional properties aren't allowed.

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

## inlineStep object

An *inline* step object is an installation instruction step that performs code execution.

|Property|Type|Description|Required|
|---|---|---|---|
|**type**|`string`|Instruction step type that performs code execution. Must be `inline`.<br><br>Defaults to `inline` if no value is provided.|No|
|**description**|`string`|Optional instruction step description.<br><br>Maximum length: 64 characters|No|
|**handler**|`string`|Identity of the handler on the device that can execute this step.<br><br>Pattern: `^\S+/\S+:\d{1,5}$`<br>Minimum length: 5 characters<br>Maximum length: 32 characters<br>Examples: `microsoft/script:1`, `microsoft/swupdate:1`, `microsoft/apt:1` |Yes|
|**files**|`string` `[1-10]`| Names of update files defined as [file objects](#file-object) that the agent will pass to the handler. Each element in the array must have length between 1 and 255 characters. |Yes|
|**handlerProperties**|`inlineStepHandlerProperties`|JSON object that agent will pass to handler as arguments.|No|

Additional properties aren't allowed.

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

## referenceStep object

A *reference* step object is an installation instruction step that installs another update.

|Property|Type|Description|Required|
|---|---|---|---|
|**type**|`referenceStepType`|Instruction step type that installs another update. Must be `reference`.|Yes|
|**description**|`stepDescription`|Optional instruction step description.<br><br>Maximum length: 64 characters |No|
|**updateId**|`updateId`|Unique update identifier.|Yes|

Additional properties aren't allowed.

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

## file object

A *file* object is an update payload file, for example, binary, firmware, script, etc. Each file object must be unique within an update.

|Property|Type|Description|Required|
|---|---|---|---|
|**filename**|`string`|Update payload file name.<br><br>Maximum length: 255 characters|Yes|
|**sizeInBytes**|`number`|File size in number of bytes.<br><br>Maximum size: 2147483648 bytes|Yes|
|**hashes**|`fileHashes`|Base64-encoded file hashes with algorithm name as key. At least SHA-256 algorithm must be specified, and additional algorithm may be specified if supported by agent. See below for details on how to calculate the hash. |Yes|
|**relatedFiles**|`relatedFile[0-4]`|Collection of related files to one or more of your primary payload files. |No|
|**downloadHandler**|`downloadHandler`|Specifies how to process any related files. |Yes only if using relatedFiles|

Additional properties aren't allowed.

For example:

```json
{
  "files": [
    {
      "filename": "configure.sh",
      "sizeInBytes": 7558,
      "hashes": {...}
    }
  ]
}
```

## fileHashes object

Base64-encoded file hashes with the algorithm name as key. At least the SHA-256 algorithm must be specified, and other algorithms may be specified if supported by the agent. For an example of how to calculate the hash correctly, see the Get-AduFileHashes function in [AduUpdate.psm1 script](https://github.com/Azure/iot-hub-device-update/blob/main/tools/AduCmdlets/AduUpdate.psm1).

|Property|Type|Description|Required|
|---|---|---|---|
|**sha256**|`string`|Base64-encoded file hash value using SHA-256 algorithm.|Yes|

Additional properties are allowed.

For example:

```json
{
  "hashes": {
    "sha256": "/CD7Sn6fiknWa3NgcFjGlJ+ccA81s1QAXX4oo5GHiFA="
  }
}
```

## relatedFiles object

Collection of related files to one or more of your primary payload files.

|Property|Type|Description|Required|
|---|---|---|---|
|**filename**|`string`|List of related files associated with a primary payload file.|Yes|
|**sizeInBytes**|`number`|File size in number of bytes.<br><br>Maximum size: 2147483648 bytes|Yes|
|**hashes**|`fileHashes`|Base64-encoded file hashes with algorithm name as key. At least SHA-256 algorithm must be specified, and additional algorithm may be specified if supported by agent. See below for details on how to calculate the hash. |Yes|
|**properties**|`relatedFilesProperties` `[0-5]`|Limit of 5 key-value pairs, where key is limited to 64 ASCII characters and value is JObject (with up to 256 ASCII characters). |No|

Additional properties are allowed.

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

For more information, see [Use the related files feature to reference multiple update files](related-files.md).

## downloadHandler object

Specifies how to process any related files.

|Property|Type|Description|Required|
|---|---|---|---|
|**id**|`string`|Identifier for downloadHandler. Limit of 64 ASCII characters.|Yes|

Additional properties are not allowed.

For example:

```json
"downloadHandler": {
  "id": "microsoft/delta:1"
}
```

## Next steps

Learn more about [import concepts](./import-concepts.md).

If you're ready, try out the [Import How-To guide](./import-update.md), which will walk you through the import process step by step.

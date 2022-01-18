---
title: Importing updates into Device Update for IoT Hub - schema and other information | Microsoft Docs
description: Schema and other related information (including objects) that is used when importing updates into Device Update for IoT Hub.
author: andrewbrownmsft
ms.author: andbrown
ms.date: 2/25/2021
ms.topic: conceptual
ms.service: iot-hub-device-update
---

# Importing updates into Device Update for IoT Hub - schema and other information
If you want to import an update into Device Update for IoT Hub, be sure you've reviewed the [concepts](import-concepts.md) and [How-To guide](import-update.md) first. If you're interested in the details of import manifest schema, or information about API permissions, see below.

## Import manifest JSON schema version 4.0

### Schema

**Properties**

|Name|Type|Description|Required|
|---|---|---|---|
|**$schema**|`string`|JSON schema reference.|No|
|**updateId**|`updateId`|Unique update identifier.|Yes|
|**description**|`string`|Optional update description.|No|
|**compatibility**|`compatibility`|List of device property sets this update is compatible with.|Yes|
|**instructions**|`instructions`|Update installation instructions.|Yes|
|**files**|`file` `[0-10]`|List of update payload files. Sum of all file sizes may not exceed 2 GB. May be empty or null if all instruction steps are reference steps.|No|
|**manifestVersion**|`string`|Import manifest schema version. Must be 4.0.|Yes|
|**createdDateTime**|`string`|Date & time import manifest was created in ISO 8601 format.|Yes|

Additional properties are not allowed.

#### $schema

JSON schema reference.

* **Type**: `string`
* **Required**: No

#### updateId

Unique update identifier.

* **Type**: `updateId`
* **Required**: Yes

#### description

Optional update description.

* **Type**: `string`
* **Required**: No
* **Minimum Length**: `>= 1`
* **Maximum Length**: `<= 512`

#### compatibility

List of device property sets this update is compatible with.

* **Type**: `compatibility`
* **Required**: Yes

#### instructions

Update installation instructions.

* **Type**: `instructions`
* **Required**: Yes

#### files

List of update payload files. Sum of all file sizes may not exceed 2 GB. May be empty or null if all instruction steps are reference steps.

* **Type**: `file` `[0-10]`
* **Required**: No

#### manifestVersion

Import manifest schema version. Must be `4.0`.

* **Type**: `string`
* **Required**: Yes

#### createdDateTime

Date & time import manifest was created in ISO 8601 format.

* **Type**: `string`
* **Required**: Yes
* **Examples**:
    * `"2020-10-02T22:18:04.9446744Z"`

### updateId object

Unique update identifier.

**`Update identity` Properties**

|Name|Type|Description|Required|
|---|---|---|---|
|**provider**|`string`|Entity who is creating or directly responsible for the update. It can be a company name.|Yes|
|**name**|`string`|Identifier for a class of update. It can be a device class or model name.|Yes|
|**version**|`string`|Two to four part dot separated numerical version numbers. Each part must be a number between 0 and 2147483647 and leading zeroes will be dropped.|Yes|

Additional properties are not allowed.

#### updateId.provider

Entity who is creating or directly responsible for the update. It can be a company name.

* **Type**: `string`
* **Required**: Yes
* **Pattern**: `^[a-zA-Z0-9.-]+$`
* **Minimum Length**: `>= 1`
* **Maximum Length**: `<= 64`

#### updateId.name

Identifier for a class of update. It can be a device class or model name.

* **Type**: `string`
* **Required**: Yes
* **Pattern**: `^[a-zA-Z0-9.-]+$`
* **Minimum Length**: `>= 1`
* **Maximum Length**: `<= 64`

#### updateId.version

Two to four part dot separated numerical version numbers. Each part must be a number between 0 and 2147483647 and leading zeroes will be dropped.

* **Type**: `string`
* **Required**: Yes
* **Pattern**: `^\d+(?:\.\d+)+$`
* **Examples**:
    * `"1.0"`
    * `"2021.11.8"`

### compabilityInfo object

Properties of a device this update is compatible with.

* **Type**: `object`
* **Minimum Properties**: `1`
* **Maximum Properties**: `5`

Each property is a name-value pair of type string.

* **Minimum Property Name Length**: `1`
* **Maximum Property Name Length**: `32`
* **Minimum Property Value Length**: `1`
* **Maximum Property Value Length**: `64`

### instructions object

Update installation instructions.

**Properties**

|Name|Type|Description|Required|
|---|---|---|---|
|**steps**|`array[1-10]`||Yes|

Additional properties are not allowed.

#### instructions.steps

* **Type**: `array[1-10]`
    * Each element in the array must be one of the following values:
        * `inlineStep` object
        * `referenceStep` object
* **Required**: Yes

### inlineStep object

Installation instruction step that performs code execution.

**Properties**

|Name|Type|Description|Required|
|---|---|---|---|
|**type**|`string`|Instruction step type that performs code execution.|No|
|**description**|`string`|Optional instruction step description.|No|
|**handler**|`string`|Identity of handler on device that can execute this step.|Yes|
|**files**|`string` `[1-10]`|Names of update files that agent will pass to handler.|Yes|
|**handlerProperties**|`inlineStepHandlerProperties`|JSON object that agent will pass to handler as arguments.|No|

Additional properties are not allowed.

#### inlineStep.type

Instruction step type that performs code execution. Must be `inline`.

* **Type**: `string`
* **Required**: No

#### inlineStep.description

Optional instruction step description.

* **Type**: `string`
* **Required**: No
* **Minimum Length**: `>= 1`
* **Maximum Length**: `<= 64`

#### inlineStep.handler

Identity of handler on device that can execute this step.

* **Type**: `string`
* **Required**: Yes
* **Pattern**: `^\S+/\S+:\d{1,5}$`
* **Minimum Length**: `>= 5`
* **Maximum Length**: `<= 32`
* **Examples**:
    * `microsoft/script:1`
    * `microsoft/swupdate:1`
    * `microsoft/apt:1`

#### inlineStep.files

Names of update files that agent will pass to handler.

* **Type**: `string` `[1-10]`
    * Each element in the array must have length between `1` and `255`.
* **Required**: Yes

#### inlineStep.handlerProperties

JSON object that agent will pass to handler as arguments.

* **Type**: `object`
* **Required**: No

### referenceStep object

Installation instruction step that installs another update.

**Properties**

|Name|Type|Description|Required|
|---|---|---|---|
|**type**|`referenceStepType`|Instruction step type that installs another update.|Yes|
|**description**|`stepDescription`|Optional instruction step description.|No|
|**updateId**|`updateId`|Unique update identifier.|Yes|

Additional properties are not allowed.

#### referenceStep.type

Instruction step type that installs another update. Must be `reference`.

* **Type**: `string`
* **Required**: Yes

#### referenceStep.description

Optional instruction step description.

* **Type**: `string`
* **Required**: No
* **Minimum Length**: `>= 1`
* **Maximum Length**: `<= 64`

#### referenceStep.updateId

Unique update identifier.

* **Type**: `updateId`
* **Required**: Yes

### file object

Update payload file, e.g. binary, firmware, script, etc. Must be unique within update.

**Properties**

|Name|Type|Description|Required|
|---|---|---|---|
|**filename**|`string`|Update payload file name.|Yes|
|**sizeInBytes**|`number`|File size in number of bytes.|Yes|
|**hashes**|`fileHashes`|Base64-encoded file hashes with algorithm name as key. At least SHA-256 algorithm must be specified, and additional algorithm may be specified if supported by agent.|Yes|

Additional properties are not allowed.

#### file.filename

Update payload file name.

* **Type**: `string`
* **Required**: Yes
* **Minimum Length**: `>= 1`
* **Maximum Length**: `<= 255`

#### file.sizeInBytes

File size in number of bytes.

* **Type**: `number`
* **Required**: Yes
* **Minimum**: ` >= 1`
* **Maximum**: ` <= 2147483648`

#### file.hashes

File hashes.

* **Type**: `fileHashes`
* **Required**: Yes
* **Type of each property**: `string`

### fileHashes object

Base64-encoded file hashes with algorithm name as key. At least SHA-256 algorithm must be specified, and additional algorithm may be specified if supported by agent.

**Properties**

|Name|Type|Description|Required|
|---|---|---|---|
|**sha256**|`string`|Base64-encoded file hash value using SHA-256 algorithm.|Yes|

Additional properties are allowed.

#### fileHashes.sha256

Base64-encoded file hash value using SHA-256 algorithm.

* **Type**: `string`
* **Required**: Yes

## Example import update API request body

If you are using the sample import manifest output from [How to add a new update](./import-update.md#review-the-generated-import-manifest), and want to call the Device Update [REST API](/rest/api/deviceupdate/updates) directly to perform the import, the corresponding request body should look like this:

```json
[
  {
    "importManifest": {
      "url": "http://<your Azure Storage location file path>/importManifest.json",
      "sizeInBytes": <size of import manifest file>,
      "hashes": {
        "sha256": "<hash of import manifest file>"
      }
    },
    "files": [
      {
        "filename": "file1.json",
        "url": "http://<your Azure Storage location file path>/file1.json"
      },
      {
        "filename": "file2.zip",
        "url": "http://<your Azure Storage location file path>/file2.zip"
      }
    ]
  }
]
```

## OAuth authorization when calling Device Update APIs

Device Update for IoT Hub REST API requires OAuth 2.0 authorization token. It accepts tokens acquired using any of the Azure Active Directory supported flows for users, applications, or managed identities.

### Resource details

* **Resource**: https://api.adu.microsoft.com
* **Authorization URL**: https://login.microsoftonline.com/common/oauth2/authorize
* **Scopes**:

    | Name | Description |
    | --- | --- |
    | `https://api.adu.microsoft.com/user_impersonation` | Impersonate your user account |
    | `https://api.adu.microsoft.com/.default`  | Client credential flows |

### Permissions

You will need to add permissions to your Azure AD app in the API permissions tab in Azure AD Application view - request API permission to Azure Device Update (located in *APIs my organization uses*) and grant the delegated `user_impersonation` permission.

Notes:
* If an Azure AD application is used to sign the user in, the scope must have `/user_impersonation`.
* Some authorization flows require extra Azure AD application setup:
    * For public client flow, enable *mobile and desktop* flow.
    * For implicit flow, add *Web platform* and select *Access tokens* for the authorization endpoint.

### Examples

**Acquiring a token using Azure CLI:**

```azurecli
az login
az account get-access-token --resource 'https://api.adu.microsoft.com/'
```

**Acquiring a token using PowerShell MSAL library:**

_Using user credentials_

```powershell
$clientId = '<app_id>’
$tenantId = '<tenant_id>’
$authority = "https://login.microsoftonline.com/$tenantId/v2.0"
$Scope = 'https://api.adu.microsoft.com/user_impersonation'

Get-MsalToken -ClientId $clientId -TenantId $tenantId -Authority $authority -Scopes $Scope
```

_Using user credentials with device code_

```powershell
$clientId = '<app_id>’
$tenantId = '<tenant_id>’
$authority = "https://login.microsoftonline.com/$tenantId/v2.0"
$Scope = 'https://api.adu.microsoft.com/user_impersonation'

Get-MsalToken -ClientId $clientId -TenantId $tenantId -Authority $authority -Scopes $Scope -Interactive -DeviceCode
```

_Using app credentials_

```powershell
$clientId = '<app_id>’
$tenantId = '<tenant_id>’
$cert = '<client_certificate>'
$authority = "https://login.microsoftonline.com/$tenantId/v2.0"
$Scope = 'https://api.adu.microsoft.com/.default'

Get-MsalToken -ClientId $clientId -TenantId $tenantId -Authority $authority -Scopes $Scope -ClientCertificate $cert
```

## Next steps

Learn more about [import concepts](./import-concepts.md).

If you're ready, try out the [Import How-To guide](./import-update.md), which will walk you through the import process step by step.

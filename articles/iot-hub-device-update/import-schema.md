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
If you want to import an update into Device Update for IoT Hub, be sure you've reviewed the [concepts](import-concepts.md) and [How-To guide](import-update.md) first. If you're interested in the details of the schema used when constructing an import manifest, or information about related objects, see below.

## Import manifest schema

| Name | Type | Description | Restrictions |
| --------- | --------- | --------- | --------- |
| UpdateId | `UpdateId` object | Update identity. |
| UpdateType | string | Update type: <br/><br/> * Specify `microsoft/apt:1` when performing a package-based update using reference agent.<br/> * Specify `microsoft/swupdate:1` when performing an image-based update using reference agent.<br/> * Specify `microsoft/simulator:1` when using sample agent simulator.<br/> * Specify a custom type if developing a custom agent. | Format: <br/> `{provider}/{type}:{typeVersion}`<br/><br/> Maximum of 32 characters total |
| InstalledCriteria | string | String interpreted by the agent to determine whether the update was applied successfully:  <br/> * Specify **value** of SWVersion for update type `microsoft/swupdate:1`.<br/> * Specify `{name}-{version}` for update type `microsoft/apt:1`, of which name and version are obtained from the APT file.<br/> * Specify a custom string if developing a custom agent.<br/> | Maximum of 64 characters |
| Compatibility | Array of `CompatibilityInfo` [objects](#compatibilityinfo-object) | Compatibility information of device compatible with this update. | Maximum of 10 items |
| CreatedDateTime | date/time | Date and time at which the update was created. | Delimited ISO 8601 date and time format, in UTC |
| ManifestVersion | string | Import manifest schema version. Specify `2.0`, which will be compatible with `urn:azureiot:AzureDeviceUpdateCore:1` interface and `urn:azureiot:AzureDeviceUpdateCore:4` interface. | Must be `2.0` |
| Files | Array of `File` objects | Update payload files | Maximum of five files |

## UpdateId Object

| Name | Type | Description | Restrictions |
| --------- | --------- | --------- | --------- |
| Provider | string | Provider part of the update identity. | 1-64 characters, alphanumeric, dot, and dash. |
| Name | string | Name part of the update identity. | 1-64 characters, alphanumeric, dot, and dash. |
| Version | version | Version part of the update identity. | 2 to 4 part, dot-separated version number. The total number of _each_ dot-separated part can be between 0 and 2147483647. Leading zeroes are not supported.

## File Object

| Name | Type | Description | Restrictions |
| --------- | --------- | --------- | --------- |
| Filename | string | Name of file | Must be no more than 255 characters. Must be unique within an update |
| SizeInBytes | Int64 | Size of file in bytes. | See [Device Update limits](./device-update-limits.md) for maximum size per individual file and collectively per update |
| Hashes | `Hashes` object | JSON object containing hash(es) of the file |

## CompatibilityInfo Object

| Name | Type | Description | Restrictions |
| --- | --- | --- | --- |
| DeviceManufacturer | string | Manufacturer of the device the update is compatible with. | 1-64 characters, alphanumeric, dot and dash. |
| DeviceModel | string | Model of the device the update is compatible with. | 1-64 characters, alphanumeric, dot and dash. |

## Hashes Object

| Name | Required | Type | Description |
| --------- | --------- | --------- | --------- |
| Sha256 | True | string | Base64-encoded hash of the file using the SHA-256 algorithm. See the relevant sections of the import manifest generation [PowerShell](https://github.com/Azure/iot-hub-device-update/blob/release/2021-q2/tools/AduCmdlets/AduUpdate.psm1#L81) and [bash](https://github.com/Azure/iot-hub-device-update/blob/release/2021-q2/tools/AduCmdlets/create-adu-import-manifest.sh#L266) scripts.|

## Example import request body

If you are using the sample import manifest output from the [How to add a new update](./import-update.md#review-the-generated-import-manifest) page, and want to call the Device Update [REST API](/rest/api/deviceupdate/updates) directly to perform the import, the corresponding request body should look like this:

```json
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
    },
  ]
}
```

## OAuth authorization when calling Device Update APIs

**azure_auth**

Azure Active Directory OAuth2 Flow
Type: oauth2
Flow: any 

Authorization URL: https://login.microsoftonline.com/common/oauth2/authorize

**Scopes**

| Name | Description |
| --- | --- |
| `https://api.adu.microsoft.com/user_impersonation` | Impersonate your user account |
| `https://api.adu.microsoft.com/.default`  | Client credential flows |


**Permissions**

If an Azure AD application is used to sign the user in, the scope needs to have /user_impersonation. 

You will need to add permissions to your Azure AD app (in the API permissions tab in Azure AD Application view) to use Azure Device Update API. Request API permission to Azure Device Update (located in "APIs my organization uses") and grant the delegated user_impersonation permission.

ADU accepts tokens acquiring tokens using any of the Azure AD supported flows for users, applications, or managed identities. However, some of the flows require extra Azure AD application setup: 

* For public client flows, make sure to enable mobile and desktop flows.
* For implicit flows make, sure to add a Web platform and select "Access tokens" for the authorization endpoint.

**Example using Azure CLI:**

```azurecli
az login

az account get-access-token --resource 'https://api.adu.microsoft.com/'
```

**Examples to acquire a token using PowerShell MSAL library:**

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

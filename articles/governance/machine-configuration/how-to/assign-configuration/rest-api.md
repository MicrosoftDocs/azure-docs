---
title: How to create a machine configuration assignment using the Azure Rest API
description: Learn how to deploy configurations to machines with the Azure Rest API.
ms.date: 03/26/2025
ms.topic:  how-to
ms.custom: devx-track-arm-rest-api
---

# How to create a Machine Configuration Assignment using the Azure Rest API

This article shows examples for deploying built-in configurations and can be performed using `cUrl`
or any http client of your choice.

In each of the following sections, the example includes a **type** property where the name starts
with `Microsoft.Compute/virtualMachines`. The guest configuration resource provider
`Microsoft.GuestConfiguration` is an [extension resource][01] that must reference a parent type.

To modify the example for other resource types such as [Arc-enabled servers][02], change the parent
type to the name of the resource provider. For Arc-enabled servers, the resource provider is
`Microsoft.HybridCompute/machines`.

Replace the following `<>` fields with values specific to your environment:

- `<base_url>` - The same for all requests, but be certain to update the provider to specify
  between `Microsoft.Compute/virtualMachines` or `Microsoft.HybridCompute/machines` as appropriate:

  ```text
  https://management.azure.com/subscriptions/<vm_Subscription>/resourceGroups/<vm_ResourceGroup>/providers/<providerType>
  ```
- `<vm_name>` - Specify the name of the Machine Resource for this assignment
- `<configuration_name>` - Specify the name of the configuration to apply.
- `<api_version>` - Select the appropriate API-version. The latest version is `2022-01-25`.

## Assign a built-in configuration

The following example assigns the `AuditSecureServer` built-in configuration.

```http
HTTP PUT https://<baseUrl>/<vm_name>/providers/Microsoft.GuestConfiguration/guestConfigurationAssignments/<configuration_Name>?api-version=2022-01-25
```

This request requires authentication in the format of an authorization header. You can use the
[Get-AzAccessToken][03] cmdlet to retrieve an Azure Access Token.

```json
Authorization Bearer <yourTokenHere>
```

A request is composed of the following properties, which together make up a Machine Configuration
Assignment.

### Azure Resource properties

These fields are the top level of properties as depicted in the sample request, and is made of the
following properties.

- `Name` - The name of the Built-In Machine Configuration Package
- `Location` - The location of the Hybrid Compute or Virtual Machine Resource
- `Guest Configuration Parameters` - A JSON Object of additional parameters specific to Guest
  Configuration.

These parameters represent most of a Machine Configuration Assignment and are defined in the
following list:

- `Name` - The name of the Built-In Machine Configuration Package
- `Version` - The version of the package to use. You can use `"1.*"` to always deploy the newest
  version of a package.
- `ContentUri` - Required when assigning a custom package, this property defines the URI of an
  accessible location containing the package content.
- `ContentHash` - Required when assigning a custom package.
- `ContentType` - `BuiltIn` or `Custom`. The service sets this value automatically.
- `AssignmentType` - Assigns one of the [Assignment Types](#assignment-type).
- `ConfigurationParameters` - An array of parameters to pass in to the assignment. These differ per
  package.
- `ConfigurationSettings` - Defines other configuration options for the assignment. For more
  information, see [Configuration Setting](#configuration-setting)

### Assignment type

An assignment type defines how the Guest Configuration agent should process the assignment. Valid
values are:

- `Audit` -  Only assess compliance with an assignment. Don't make any changes.
- `ApplyAndAutoCorrect` - Continuously audit and autocorrect for compliance.
- `ApplyAndMonitor` - Apply the settings once, then monitor for compliance but don't correct
  settings.
- `ApplyOnce` - Apply the settings once.

### Configuration parameter

An array of key-value pairs to pass into the Machine Configuration Assignment. For each pair:

- The key defines the name of the parameter to configure.
- The value defines the desired value to set or audit for the assignment.

### Configuration setting

These properties represent other configurable settings presented by Machine Configuration.


- `ConfigurationMode` - Valid values are the same as [Assignment type](#assignment-type). This
  value must be the same as the value for `Assignment Type`.
- `ActionAfterReboot` - Controls the action of the Machine Configuration Agent after applying a
  reboot.
- `RebootIfNeeded` - If supported by the module, allows for suppressing of restarts if a reboot is
  needed.

### Example request

```
let baseUrl = https://management.azure.com
let subscription = /subscriptions/<yourSubscription>
let resourceGroup = resourceGroups/<yourResourceGroup>
let provider = providers/Microsoft.Compute
let vm = <yourVm>

curl --request PUT \
  --url '$baseUrl/$subscription/$resourceGroup$/$providers/$vm/providers/Microsoft.GuestConfiguration/guestConfigurationAssignments/AuditSecureProtocol?api-version=2022-01-25' \
  --header 'authorization: Bearer yourKeyHere \
  --header 'content-type: application/json' \
  --data '{
  "properties": {
    "guestConfiguration": {
      "kind": "Machine Configuration",
      "name": "AuditSecureProtocol",
      "version": "1.*",
      "contentType": "Builtin",
      "assignmentType": "Audit",
      "configurationParameter": [
        {
          "name": "[SecureWebServer]s1;MinimumTLSVersion",
          "value": "1.2"
        }
      ],
      "configurationProtectedParameter": [],
      "configurationSetting": {
        "configurationMode": "Audit",
        "allowModuleOverwrite": false,
        "actionAfterReboot": "",
        "refreshFrequencyMins": 5,
        "rebootIfNeeded": true,
        "configurationModeFrequencyMins": 15
      }
    },
    "complianceStatus": "Compliant",
    "assignmentHash": null,
    "provisioningState": "Succeeded",
    "resourceType": null,
    "vmssVMList": null
  },
  "name": "AuditSecureProtocol",
  "location": "westus2"
}'
```

### Response

The response contains the created assignment. The response automatically defines every required
parameter.

```json
{
  "properties": {
    "name": "AuditSecureProtocol",
    "location": "<vmLocation",
    "guestConfiguration": {
      "name": "AuditSecureProtocol",
      "version": "1.*",
      "contentType": "Builtin",
      "assignmentType": null,
      "configurationParameter": [
        {
          "name": "[SecureWebServer]s1;MinimumTLSVersion",
          "value": "1.2"
        }
      ],
      "configurationSetting": {
        "configurationMode": "MonitorOnly",
        "allowModuleOverwrite": false,
        "actionAfterReboot": "",
        "refreshFrequencyMins": 5,
        "rebootIfNeeded": true,
        "configurationModeFrequencyMins": 15
      }
    }
  },
  "name": "AuditSecureProtocol",
  "location": "westus2"
}
```

<!-- Link reference definitions -->
[01]: /azure/azure-resource-manager/management/extension-resource-types
[02]: /azure/azure-arc/servers/overview
[03]: /powershell/module/az.accounts/get-azaccesstoken

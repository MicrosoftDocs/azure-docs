---
title: How to create a machine configuration assignment using the Azure Rest API
description: >-
  Learn how to deploy configurations to machines with the Azure Rest API.
ms.date: 03/11/2025
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

```
HTTP PUT https://<baseUrl>/<vm_name>/providers/Microsoft.GuestConfiguration/guestConfigurationAssignments/<configuration_Name>?api-version=2022-01-25
```

This request requires Authentication, in the format of an Authorization header.  You can follow these steps to [retrieve an Azure Access Token][03].

```json
Authorization Bearer <yourTokenHere>
```

A request is composed of the following properties, which together make up a Machine Configuration Assignment.


### Azure Resource Properties

These fields comprise the top level of properties as depicted in the sample request, and is made of the following properties.


```yaml
Name: Name of the Built-In Machine Configuration Package
Location: Location of the Hybrid Compute or Virtual Machine Resource
Guest Configuration Parameters: Contains a JSON Object of additional parameters specific to Guest Configuration.
```

### Guest Configuration parameters
These parameters represent most of a Machine Configuration Assignment and are defined as follows.

```yaml
Name: Name of the Built-In Machine Configuration Package
Version: Version of the Package to use. (You can use `"1.*"` to always deploy the newest version of a package)
ContentUri: Required when assigning a custom Package, contains the URI of an accessible location containing the package content
ContentHash: Required when assigning a custom Package
ContentType: BuiltIn or Custom, automatically set by the service
AssignmentType: Assigns one of the AssignmentTypes defined below
ConfigurationParameters: Contains an array of parameters to pass in to the assignment.  These differ per package
ConfigurationSettings: Contains other configuration options for the assignment.
```

### Assignment Type
Instructions to the Guest Configuration agent as to how it should process the assignment.

```yaml
Audit:  Will only assess compliance with an assignment, will not attempt to make any changes
ApplyAndAutoCorrect: Will continuously audit and auto-correct for compliance
ApplyAndMonitor: Will apply the settings once and monitor for compliance but will not attempt to correct settings a second time
ApplyOnce: Will apply the settings once but will not monitor or check for compliance thereafter
```

### Configuration Parameter
An array of key-value pairs to pass into the Machine Configuration Assignment.

```yaml
Name: The name of the parameter to configure
Value: The desired value to set or audit for the assignment.
```

### Configuration Setting
These properties represent other configurable settings presented by Machine Configuration.
```yaml
ConfigurationMode: See "AssignmentType" above, supports same parameters.  Must match.
ActionAfterReboot: Controls the action of the Machine Configuration Agent after applying a reboot.
RebootIfNeeded: If supported by the module, allows for suppressing of Restarts if a Reboot is determined to be needed
```

### Example Request

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

The response contains the created assignment, and any additional needed parameters are automatically completed in for you.

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
articles/app-service/configure-authentication-oauth-tokens.md
[01]: /azure/azure-resource-manager/management/extension-resource-types
[02]: /azure/azure-arc/servers/overview
[03]: /powershell/module/az.accounts/get-azaccesstoken

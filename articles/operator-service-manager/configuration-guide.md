---
title: Configuration Group Best Practices for Azure Operator Service Manager
description: Learn about best practices for configuration groups when you're using Azure Operator Service Manager.
author: msftadam
ms.author: adamdor
ms.date: 03/09/2026
ms.topic: best-practice
ms.service: azure-operator-service-manager
---

# Best practices for configuration groups

This article provides Azure Operator Service Manager guidelines to optimize the design of configuration group schemas (CGSs) and the operation of configuration group values (CGVs). Network function (NF) vendors, telco operators, and their partners should keep these practices in mind when onboarding and deploying NFs.

## Configurarion group approach

Consider the following meta-schema guidelines when you're designing configuration resources:

* First, choose which parameters to expose to the operator.
  * A rule of thumb is to expose parameters backed by direct operation, such as a helm value.
  * Suppress parameters backed by another agent, such as `cloudinit` `userdata`.
* Sort the parameters into site-specific, instance-specific, and security-specific sets. 
  * Ensure that parameters don't overlap between CGS resources.
* Define required versus optional parameters.
* For optional parameters, define a reasonable default value.

## One-CGS approach

The original recommendation was to use only a single CGS for the entire NF. This approach consolidated site-specific, instance-specific, and security-specific parameters into a single set of configuration group resources. This approach avoided multiple resource sets, except for rare cases where a service had multiple components. Many partners successfully onboarded services using this approach, and it remains supported. However, this approach doesn't obscure secrets. All configuration values are stored in resources as plain-text.

## Three-CGS approach

We now recommend that you use at least three CGSs for the entire NF, by organizing parameters into these sets of configuration resource groups:

* Site-specific parameters
  * Examples include IP addresses and unique names.
  * Uses CGS without secrets.
  * Stores values in plain-text during deployments.
    
* Instance-specific parameters
  * Examples include timeouts and debug levels.
  * Uses CGS without secrets.
  * Stores values in plain-text during deployment.
    
* Security-specific parameters
  * Examples include passwords and certificates. 
  * Uses CGS with secrets.
  * Store values in Azure Key Vault to obscure during deployments.

## CGS without secrets

This example shows a sample CGS payload defining `abc`, `xyz`, and `qwe` as exposed parameters. Two of the parameters have default values and one is required.

```json
{ 
  "type": "object", 
  "properties": {
    "abc": { 
      "type": "integer", 
      "default": 30
    }, 
    "xyz": { 
      "type": "integer", 
      "default": 40
    },
    "qwe": {
      "type": "integer"
    }
   }
   "required": "qwe"
}
```

## CGV without secrets

This example shows a corresponding CGV input that an operator uses with the prior CGS:

```json
{
"qwe": 20
}
```

This example shows the resulting CGV resource that Azure Operator Service Manager generates:

```json
{
"abc": 30,
"xyz": 40,
"qwe": 20
}
```

## CGS with secrets
Other then seperating secrets into a unique CGS, no special CGS requirements exist for secret support.

## CGV with secrets
Considering the following configuration reqiurements to properly obscure secret values:
* Use `configurationType: 'Secret'` in the resource properties.
 * Once a CGV is deployed, this prevents the display of the resource in most Azure methods.
* Use a reference to Azure Key Vault (AKV) in place of the plain-text secret.
 * This obscures the display of the secret in the CGV deployment template.

The following example shows how to include an AKF reference in an ARM template: 
```json
  "password": {
      "reference": {
        "keyVault": {
            "id": "/subscriptions/xxx/resourceGroups/yyy/providers/Microsoft.KeyVault/vaults/zz"
        },
        "secretName": "passwd"
      }
```

To further secure resources restrict access to the following RBAC scope: `Microsoft.Resources/deployments/exportTemplate/action` 

## Overview of JSON Schema

JSON Schema is an Internet Engineering Task Force (IETF) standard that provides a format for what JSON data is required for an application and how to interact with it. Applying such standards for a JSON document helps you enforce consistency and data validity across JSON data.

### Where is JSON Schema used?

* Azure Operator Service Manager uses JSON Schema notation as a meta-schema within `schemaDefinition` properties for the CGS `ConfigurationGroupSchemaPropertiesFormat` object.
* Azure Operator Service Manager allows the designer and publisher to specify JSON Schema when the operator must provide data (JSON values) during instantiation of a site network service (SNS) or NF.
* Azure Operator Service Manager allows the meta-schema properties to be optional or required. Where a property is marked `required`, it must be specified in the JSON values.  

### What JSON keywords are supported?

For the CGS meta-schema, Azure Operator Service Manager implements support for JSON standard keywords on a type-by-type basis:

* For object types, keyword support is limited by filter policy. See  [object](https://json-schema.org/understanding-json-schema/reference/object) in the JSON Schema reference.
* For string types, keyword support isn't limited or filtered. See [string](https://json-schema.org/understanding-json-schema/reference/string) in the JSON Schema reference.
* For numeric types, keyword support isn't limited or filtered. See [Numeric types](https://json-schema.org/understanding-json-schema/reference/numeric) in the JSON Schema reference.

## Optional and required fields

You declare a property as optional by including a `required` keyword, which omits the optional property. If you don't specify the `required` keyword, all properties are considered required. You need at least one required property type to support an optional property type.

```json
{
"type": "object",
"properties": {
  "abc": {
    "type": "integer",
     "default": 30
  },
  "xyz": {
    "type": "string",
    "default": "abc123"
  }
 }
"required":  ["abc"]
} 
```

## Default values in JSON Schema

For optional properties, Azure Operator Service Manager implements a custom method of handling default values. When a default value is defined in CGS meta-schema, Azure Operator Service Manager uses that value where the property is missing or undefined in the input CGV data. Azure Operator Service Manager validator logic essentially hydrates the CGV value with the default value when the operator doesn't provide a value.

### How to define defaults

Defaults must be specified either inside properties or inside items of an array. The following example demonstrates defaults with integer and string property types:

```json
{
"type": "object",
"properties": {
  "abc": {
    "type": "integer",
     "default": 30
  },
  "xyz": {
    "type": "string",
    "default": "abc123"
  }
 }
} 
```

### Rules for defining defaults

The following rules are applied when you're validating a default value. Consider these rules when you're using default values to ensure expected outcomes.

* A default value shouldn't be applied to a required property.
* A default value is evaluated in top-down order from where the keyword first appears.
* Where a property value exists in the input CGV, only children of those properties are evaluated for defaults.
* Where a property value doesn't exist in the input CGV, a default is evaluated, along with any children.
* Where a property value is the `object` type, and its key doesn't exist in the input CGV, no defaults for the object are evaluated.

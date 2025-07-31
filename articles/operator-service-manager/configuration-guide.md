---
title: Configuration Group Best Practices for Azure Operator Service Manager
description: Learn about best practices for configuration groups when you're using Azure Operator Service Manager.
author: msftadam
ms.author: adamdor
ms.date: 06/24/2025
ms.topic: best-practice
ms.service: azure-operator-service-manager
---

# Azure Operator Service Manager best practices for configuration groups

This article provides Azure Operator Service Manager guidelines to optimize the design of configuration group schemas (CGSs) and the operation of configuration group values (CGVs). Network function (NF) vendors, telco operators, and their partners should keep these practices in mind when onboarding and deploying NFs.

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
* Where a property value doesn't exist in the input CGV, it's evaluated for a default, along with any children.
* Where a property value is the `object` type, and neither it nor its key exists in the input CGV, no defaults for the object are evaluated.

## CGS considerations

Over time, the recommended approach to best design CGSs changed.

### One-CGS approach

The original recommendation was to use only a single CGS for the entire NF. This approach consolidated site-specific, instance-specific, and security-specific parameters into a single set of configuration group objects. This approach avoided multiple object sets, except for rare cases where a service had multiple components. Many partners successfully onboarded services by using this approach, and it remains supported.

### Three-CGS approach

We now recommend that you use at least three CGSs for the entire NF, by organizing parameters into these sets of configuration groups:

* **Site-specific parameters**: Examples include IP addresses and unique names.
* **Instance-specific parameters**: Examples include timeouts and debug levels.
* **Security-specific parameters**: Examples include passwords and certificates. With security-specific parameters, you use Azure Key Vault to store secure values.

### Designing three-CGS object sets

Consider the following meta-schema guidelines when you're designing three-CGS objects:

* Choose which parameters to expose.
  
  A rule of thumb is to expose those parameters by using a direct operation, such as a compute tier or Helm value. Use this approach as opposed to a parameter that another agent acts on, such as `cloudinit` user data.
* Sort the parameters into site-specific, instance-specific, and security-specific sets.
* Define required versus optional parameters. For optional parameters, define a reasonable default value.
* Ensure that parameters don't overlap between CGS objects.

This example shows a sample CGS payload:

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

This example shows a corresponding CGV payload that the operator passes:

```json
{
"qwe": 20
}
```

This example shows the resulting CGV payload that Azure Operator Service Manager generates:

```json
{
"abc": 30,
"xyz": 40,
"qwe": 20
}
```

## CGV considerations

Before you submit the CGV resource creation, you can validate that the schema and values of the underlying YAML or JSON file match what the corresponding CGS expects. To accomplish that validation, one option is to use the YAML extension for Visual Studio Code.

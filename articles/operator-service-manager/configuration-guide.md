---
title: Configuration Group Best Practices for Azure Operator Service Manager
description: Learn about configuration group best practices when using Azure Operator Service Manager.
author: msftadam
ms.author: adamdor
ms.date: 06/24/2025
ms.topic: best-practice
ms.service: azure-operator-service-manager
---

# Workload configuration management
This article provides Azure Operator Service Manager (AOSM) guidelines to optimize the design of configuration group schemas (CGS) and the operation of configuration group values (CGV). Network function (NF) vendors, telco operators, and their partners should keep these practices in mind when onboarding and deploying NFs.

## What is JSON schema?
JSON Schema is an Internet Engineering Task Force (IETF) standard providing a format for what JSON data is required for a given application and how to interact with it. Applying such standards for a JSON document lets you enforce consistency and data validity across JSON data

### Where is JSON schema used?
* AOSM uses JSON schema notation as a meta-schema within CGS `ConfigurationGroupSchemaPropertiesFormat` object `schemaDefinition` properties.
* AOSM allows the designer and publisher to specify the JSON schema where operator must provide data (JSON Values) when instantiating an SNS/NF.
* AOSM allows the meta-schema properties be optional or required. Where a property is marked required, it must be specified in the values Json.  

### What JSON keywords are supported?
For the CGS meta-schema, AOSM implements supports for JSON standard keywords on a type by type basis.
 
* For object types, keyword supported is limited by filter policy. See JSON Schema - [object](https://json-schema.org/understanding-json-schema/reference/object)
* For string types, keyword support isn't limited or filtered. See JSON Schema - [string](https://json-schema.org/understanding-json-schema/reference/string)
* For numeric types, keyword support isn't limited or filtered. See JSON Schema - [numeric](https://json-schema.org/understanding-json-schema/reference/numeric)

## Optional and Required fields
A property is declared optional by including a `required` keyword, which omits the optional property. If the `required` keyword isn't specified, then all properties are considered required. At least one required property type is needed to support an optional property type.

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

## Defaults Values in JSON Schema
For optional properties, AOSM implements a custom method of default value handling. When a default value is defined in CGS meta-schema, AOSM uses that value where the property is missing or undefined in the input CGV data. AOSM validator logic essentially hydrates the CGV value with the default value when no value is provided by operator.

### How to define defaults
Defaults must be specified either inside properties or inside items of array. The following example demonstrates defaults with integer and trying property types.

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
The following rules are applied when validating a default value. Consider these rules when using default values to ensure expected outcomes:

* A default value shouldn't be applied to a required property.
* A default value is evaluated in top-down order, from where the keyword is first seen.
* Where a property value exists in the input CGV, only children of those properties are evaluated for defaults.
* Where a property value doesn't exist in the input CGV, it's evaluated for a default, along with any children.
* Where a property value is type object, and neither it or it's key exist in the input CGV, then no defaults for the object are evaluated.

## CGS considerations
Overtime, the recommended approach to best design configuration group schemas changed. While the original 1-CGS approach remains supported, for all new projects we now recommend the 3-CGS approach. Further details on converting from 1-CGS to 3-CGS can be requested.

### 1-CGS approach
Originally it was recommended to use only a single CGS for the entire NF. This consolidated site-specific, instance-specific, and security-specific parameters into a single set of configuration group objects. Multiple object sets were avoided, except for rare cases where a service was composed of multiple components. Many partners successfully onboarded services using this approach and it remains supported.

### 3-CGS approach
More recently, it's now recommended to use at least three CGS for the entire NF, organizing parameters into site-specific, instance-specific, and security-specific configuration group sets. Examples of site-specific parameters are ip addresses or unique names. Examples of instance-spccific parameters are timeouts or debug levels. Examples of security-specific parameters would be passwords or certificates. With security-specific parameters, Azure Keyvault is used to store secure values.

### Designing 3-CGS object sets 
Consider the following meta-schema guidelines when designing 3-CGS objects;
- Choose which parameters to expose.
  - A rule of thumb is to expose those parameters set using a direct operation, such as a compute SKU or helm value.
  - As opposed to a parameter that is acted on by another agent, such as `cloudinit` user-data.
- Sort the parameters into site-specific, instance-specific, and security-specific sets.
- Define required versus optional parameters.
  - For optional parameters, define a reasonable default value.
- Ensure no overlapping parameters between CGS objects.

The following example shows a sample CGS and corresponding CGV payloads.

CGS payload:

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

Corresponding CGV payload passed by the operator:

```json
{
"qwe": 20
}
```

Resulting CGV payload generated by Azure Operator Service Manager:

```json
{
"abc": 30,
"xyz": 40,
"qwe": 20
}
```

## Configuration Group Values considerations

Before you submit the CGV resource creation, you can validate that the schema and values of the underlying YAML or JSON file match what the corresponding CGS expects. To accomplish that, one option is to use the YAML extension for Visual Studio Code.

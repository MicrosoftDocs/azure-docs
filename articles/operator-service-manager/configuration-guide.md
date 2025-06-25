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
This article provides Azure Operator Service Manager (AOSM) guidelines to optimize the design of configuration group schemas (CGS) and the operation of configuration group values (CGV). NF vendors, telco operators, and their partners should keep these practices in mind when onboarding and deploying NFs.

## What is JSON schema
JSON Schema is an Internet Engineering Task Force (IETF) standard providing a format for what JSON data is required for a given application and how to interact with it. Applying such standards for a JSON document lets you enforce consistency and data validity across JSON data

### Where is JSON schema used
* AOSM service uses JSON schema notation as a meta-schema within CGS `ConfigurationGroupSchemaPropertiesFormat` object `schemaDefinition` properties. For more information on CGS, see the [swagger documentation](https://learn.microsoft.com/en-us/rest/api/hybridnetwork/configuration-group-schemas/create-or-update).
* AOSM service allows the designer and publisher to specify the JSON schema where operator must provide data (JSON Values) when instantiating an SNS/NF.
* AOSM service allows the meta-schema properties be optional or required. Where a property is marked required, it must be specified in the values Json.  

### What JSON keywords are supported
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

## Configuration Group Schema considerations
We recommend that you always start with a single CGS for the entire NF. If there are site-specific or instance-specific parameters, we still recommend that you keep them in a single CGS. We recommend splitting into multiple CGSs when there are multiple components (rarely NFs, more commonly, infrastructure) or configurations that are shared across multiple NFs. The number of CGSs defines the number of CGVs.

### Scenario

- FluentD, Kibana, and Splunk (common third-party components) are always deployed for all NFs within a network service design (NSD). We recommend grouping these components into a single network function design group (NFDG).
- NSD has multiple NFs that all share a few configurations (deployment location, publisher name, and a few chart configurations).

In this scenario, we recommend that you use a single global CGS to expose the common NF and third-party component configurations. You can define NF-specific CGS as needed.

### Choose parameters to expose

- CGS should only have parameters that are used by NFs (day 0/N configuration) or shared components.
- Parameters that are rarely configured should have default values defined.
- If multiple CGSs are used, we recommend little to no overlap between the parameters. If overlap is required, make sure the parameter names are clearly distinguishable between the CGSs.
- What can be defined via API (Azure Operator Nexus, Azure Operator Service Manager) should be considered for CGS. As opposed to, for example, defining those configuration values via CloudInit files.
- When unsure, a good starting point is to expose the parameter and have a reasonable default specified in the CGS. The following example shows the sample CGS and corresponding CGV payloads.
- A single user-assigned managed identity should be used in all the NF ARM templates and should be exposed via CGS.

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

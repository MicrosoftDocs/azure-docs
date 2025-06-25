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
This article provides guidelines that NF vendors, telco operators, and their partners can follow to optimize the design of configuration group schemes and the operation of configuration group values. Keep these practices in mind when you onboard and deploy your NFs.

## What is JSON schema
JSON Schema is an IETF standard providing a format for what JSON data is required for a given application and how to interact with it. Applying such standards for a JSON document lets you enforce consistency and data validity across JSON data

### Where is JSON schema used
* AOSM service uses JSON schema notation as a meta-schema within CGS `ConfigurationGroupSchemaPropertiesFormat` object `schemaDefinition` properties. For more information on CG schema see the [swagger documentation](https://learn.microsoft.com/en-us/rest/api/hybridnetwork/configuration-group-schemas/create-or-update?view=rest-hybridnetwork-2023-09-01&tabs=HTTP#configurationgroupschemapropertiesformat).
* AOSM service allows the designer and publisher to specify the JSON schema where operator must provide data (JSON Values) when instantiating an SNS/NF.
* AOSM service allows the meta-schema properties be optional or required. Where a property is marked required, it must be specified in the values Json.  

### What JSON keywords are supported
For the CG meta-schema, AOSM implements supports for JSON standard keywoards on a type by type basis.
 
* For object types, keyword supported is limited by filter policy. See JSON Schema - [object](https://json-schema.org/understanding-json-schema/reference/object)
* For string types, keyword support is not limited or filtered. See JSON Schema - [string](https://json-schema.org/understanding-json-schema/reference/string)
* For numeric types, keyword support is not limited or filtered. See JSON Schema - [numeric](https://json-schema.org/understanding-json-schema/reference/numeric)

## Optional and Required fields
A property can be declared as an optional field if publisher/designer explicitly provides a required section and the required section does not contain the property that needs to be optional. An optional property can also have defaults to it. A property is required if the designer/publisher has not specified the required section and the property does not have defaults.

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
AOSM service implements a custom method of default value handling, which can be provided for optional properties. When the publisher or designer define default values in CG meta-schema, AOSM uses these value for properties that are missing or undefined in the input CG values data. AOSM service validator logic essemtially hydrates the CG value input with default where no optional value has been provided by operator.

### How to define defaults
Defaults must be specified either inside properties or inside items of array. The following example demonstrates defaults with integer and strying property types.

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
A field which has a “default” should not be defined in the required section of the schema. During the validation process (CGV creation and NF creation), if a property is missing or undefined in the input data, the validator will assign values from default keyword in the schemas of properties and items (when it is the array of schemas) to the missing properties and items.

Defaults are evaluated in top-down order from where the property is seen. If a property exists in input Json, only its child properties will be evaluated for defaults. If the property does not exist in input Json, then its default will be evaluated along with any child properties which do not exist in the defaults of the property.

If default for an object is not specified and the input json does not contain the object key, then no defaults which are provided under the properties of the object are evaluated.

## Configuration Group Schema considerations
We recommend that you always start with a single CGS for the entire NF. If there are site-specific or instance-specific parameters, we still recommend that you keep them in a single CGS. We recommend splitting into multiple CGSs when there are multiple components (rarely NFs, more commonly, infrastructure) or configurations that are shared across multiple NFs. The number of CGSs defines the number of CGVs.

### Scenario

- FluentD, Kibana, and Splunk (common third-party components) are always deployed for all NFs within an NSD. We recommend grouping these components into a single NFDG.
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

<pre>
{ 
  "type": "object", 
  "properties": { 
    "abc": { 
    "type": "integer", 
    <b>"default": 30</b>
    }, 
    "xyz": { 
    "type": "integer", 
    <b>"default": 40</b>
    },
    "qwe": {
    "type": "integer" //doesn't have defaults
    }
  }
  "required": "qwe"
}
</pre>

Corresponding CGV payload passed by the operator:

<pre>
{
"qwe": 20
}
</pre>

Resulting CGV payload generated by Azure Operator Service Manager:

<pre>
{
"abc": 30,
"xyz": 40,
"qwe": 20
}
</pre>

## Configuration Group Values considerations

Before you submit the CGV resource creation, you can validate that the schema and values of the underlying YAML or JSON file match what the corresponding CGS expects. To accomplish that, one option is to use the YAML extension for Visual Studio Code.

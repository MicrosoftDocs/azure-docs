---
title: Configuration Group Best Practices for Azure Operator Service Manager
description: Learn about best practices for configuration groups when you're using Azure Operator Service Manager.
author: msftadam
ms.author: adamdor
ms.date: 03/09/2026
ms.topic: best-practice
ms.service: azure-operator-service-manager
---

# Configuration best practices

This article provides guidelines to best manage network function configuration requirements using Azure Operator Service Manager. This includes designing optimal configuration group schemas (CGSs), configuration group values (CGVs) and networkFunctions (NFs) resource templates. Keep these practices in mind when onboarding and deploying NFs.

## Configuration approach

Consider the following meta-schema guidelines when you're designing configuration resources:

* First, choose which parameters to expose to the operator.
  * A rule of thumb is to expose parameters backed by direct operation, such as a `helm value`.
  * Suppress parameters backed by another agent, such as `cloudinit userdata`.
* Sort the parameters into site-specific, instance-specific, and security-specific sets. 
  * Ensure that parameters don't overlap between sets.
* Define required versus optional parameters.
  * For optional parameters, define a reasonable default value.
* To prevent exposing secrets, ensure proper configuration of security-specific parameters.

## One-CGS approach

The original recommendation was to use only a single CGS/CGV set for the entire NF. This approach consolidated site-specific, instance-specific, and security-specific parameters together. Only in rare cases, where a service had multiple NFs, were multiple sets used. Many partners successfully onboarded using this approach, and it remains supported. However, this approach doesn't obscure secrets. All configuration values are stored in plain-text and are displayable via most Azure methods.

## Three-CGS approach

We now recommend that you use at least three CGS/CGV sets, organizing parameters as follows:

* Site-specific parameters
  * Examples include IP addresses and unique names.
  * Uses CGS/CGV without secrets.
  * Stores values in plain-text during deployments.
    
* Instance-specific parameters
  * Examples include timeouts and debug levels.
  * Uses CGS/CGV without secrets.
  * Stores values in plain-text during deployment.
    
* Security-specific parameters
  * Examples include passwords and certificates. 
  * Uses CGS/CGV with secrets.
  * Store values in Azure Key Vault (AKV) to obscure during deployments.

> [!WARNING]
> * When using secrets, consider restricting access to the role based access control (RBAC) scope `Microsoft.Resources/deployments/exportTemplate/action`.

## CGS without secrets

This example shows a CGS exposing `abc`, `xyz`, and `qwe` parameters. Two of the parameters have default values and one is marked required.

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

This example shows the CGV input provided by the operator during CGV deployment to satisfy the prior CGS.

```json
{
"qwe": 20
}
```

This example shows the rendered CGV resource created after the CGV deployment completes.

```json
{
"abc": 30,
"xyz": 40,
"qwe": 20
}
```

## CGV with secrets without AKV

Where AKV isn't being used, consider the following Azure Resource Manager (ARM) template requirements to properly obscure secret values throughout CGV resource lifecycle.

* To contain all secrets, define an object parameter with `"type": "secureObject"`.
  * This configuration obscures the display of secrets as template parameters.

This example shows how to define an object parameter `secretCgvContent`.

```json
"parameters": {
   "secretCgvContent": {
     "type": "SecureObject"
    }
}
```

> [!NOTE]
> * Don't hydrate `secretCgvContent` using the bicep loadJsonContent() function.

* Under CGV resource properties, use `configurationType: 'Secret'` and `"secretConfigurationValue": "[string(parameters('secretCgvContent'))]"`.
  * This configuration prevents displaying the secret data via most Azure user interfaces.

This example shows how to pass all secrets in the object `secretCgvContent` to the CGV resource.

```json
{
  "type": "Microsoft.HybridNetwork/configurationGroupValues",
  "properties": {
    "configurationType": "Secret"
    "secretDeploymentValues": "[string(parameters('secretCgvContent'))]"
  }
}
```

## CGV with secrets with AKV

Where AKV is being used, consider the following ARM template requirements to properly obscure secret values throughout CGV resource lifecycle.

* Define a string `parameter` for each secret and one object `variable` to collect all secret values.
  * The object variable contains only a reference to the parameter string.   

This example shows how to define a parameter `secretPassword1` contained within the object variable `secretVal.configurationValue`. 

```json
"parameters": {
   "secretPassword1": {
     "type": "string"
    }
}
"variables": {
    "configurationValue": {
     "secretVal": {
        "elastic_passwd": "secretPassword1"
      }
    }
}
```

* Use a template reference to AKV in place of the plain-text secret.
  * This configuration obscures the display of the secrets as template variables.

This example shows how to hydrate the secret `secretPassword1` using AKV secret and key.

```json
  "secretPassword1": {
      "reference": {
        "keyVault": {
            "id": "/subscriptions/xxx/resourceGroups/yyy/providers/Microsoft.KeyVault/vaults/zz"
        },
        "secretPassword1": "<akv-secret-key>"
      }
}
```

* Under CGV resource properties, use `configurationType: 'Secret'` and `"secretConfigurationValue": "string(secretVal.configurationValue)"`.
  * This configuration prevents displaying the secret data via most Azure user interfaces.

This example shows how to pass all secrets in the object `secretVal.configurationValue` to the new CGV.

```json
{
"resources": [ {
  "type": "Microsoft.HybridNetwork/configurationGroupValues",
    "properties": {
      "configurationType": "Secret"
      "secretConfigurationValue": "string(secretVal.configurationValue)"
      }
   }
]
```

## networkFunctions with secrets

Consider the following ARM template requirements to properly obscure secret values throughout networkFunctions resource lifecycle.

* Use `"type": "secureObject"` in the template for the `secretValues` and `config` parameter
  * This configuration obscures the display of the secrets as template parameters.
 
```json
"parameters": {
   "siteSpecificValues": {
     "type": "object"
   },
   "secretValues": {
     "type": "secureObject"
    },
    "nfValues": {
     "type": "object"
    },
    "config": {
      "type": "secureObject",
      "defaultValue": "[union(parameters('nfValues'),parameters('siteSpecificValues'), parameters('secretValues'))]"
    }
}
```

> [!NOTE]
> * Don't hydrate `secretValues` using the bicep loadJsonContent() function.

* Under networkFunctions resource properties, use `configurationType: 'Secret'` and `"secretDeploymentValues": "[string(parameters('config'))]"`.
  * Once a network function is deployed, this configuration prevents displaying the secret data via most Azure user interfaces. 

```json
"resources": [
  {
    "type": "Microsoft.HybridNetwork/networkFunctions",
      "configurationType": "Secret",
      "secretDeploymentValues": "[string(variables('config'))]",
  }
]
```

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

### Optional and required fields

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

### Default values in JSON Schema

For optional properties, Azure Operator Service Manager implements a custom method of handling default values. When a default value is defined in CGS meta-schema, Azure Operator Service Manager uses that value where the property is missing or undefined in the input CGV data. Azure Operator Service Manager validator logic essentially hydrates the CGV value with the default value when the operator doesn't provide a value.

#### How to define defaults

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

#### Rules for defining defaults

The following rules are applied when you're validating a default value. Consider these rules when you're using default values to ensure expected outcomes.

* A default value shouldn't be applied to a required property.
* A default value is evaluated in top-down order from where the keyword first appears.
* Where a property value exists in the input CGV, only children of those properties are evaluated for defaults.
* Where a property value doesn't exist in the input CGV, a default is evaluated, along with any children.
* Where a property value is the `object` type, and its key doesn't exist in the input CGV, no defaults for the object are evaluated.

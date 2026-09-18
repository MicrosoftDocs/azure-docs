---
title: Extendable parameter files in Bicep
description: This article describes how to extend your parameter file.
ms.topic: article
ms.date: 06/12/2026
---

# Extendable parameter files in Bicep

By using extendable Bicep parameter files, you can define parameters once in a **base** parameter file and reuse them across multiple **derived** parameter files. This approach significantly improves parameter reusability and ensures consistency across your deployments. Bicep CLI version 0.44.1 and later supports extendable parameter files, along with the `extends` and `base` keywords.

A derived parameter file can extend only one base parameter file. It can contain only one `extends` statement. However, you can create nested parameter files by chaining extensions across multiple files. For more information, see [Nested parameter files](#nested-parameter-files).

The `extends` statement inherits only parameter assignments.

- You can define [variables](./variables.md) in the base parameter file to calculate its parameter values, but those variables aren't exposed to derived parameter files.
- You can define [user-defined types](./user-defined-data-types.md) in parameter files. You can also [import](./bicep-import.md#import-variables-types-and-functions) user-defined types defined in a Bicep file. However, these user-defined types aren't exposed to derived parameter files.
- You can't declare [user-defined functions](./user-defined-functions.md) directly in a parameter file. However, you can [import](./bicep-import.md#import-variables-types-and-functions) them into a parameter file. These functions aren't exposed to derived parameter files.

## Extend parameter file

By default, parameters you define in a derived parameter file completely overwrite those in the base parameter file. To merge instead of overwrite, use the `base` keyword with object or array spread syntax. For more information, see [Access parent parameters](#access-parent-parameters).

Use the [`using none`](./bicep-using.md#the-using-none-statement) statement in base parameter files to instruct the compiler not to bind or validate them against any specific Bicep file.

The following example demonstrates how extendable parameter files work in Bicep.

Your primary Bicep template, `main.bicep`, defines the parameters your deployment accepts.

```bicep
param namePrefix string
param location string
param tags object
```

A base parameter file, `base.bicepparam`, that you can reuse across multiple deployments and environments.

```bicep
using none
// Notice that the first line of this .bicepparam file declares `using none` which tells the compiler not to validate this against any particular .bicep file.

param namePrefix = 'Prod'
param location = 'westus'
param tags = {
  environment: 'dev'
  owner: 'platform'
}
```

An extended parameter file, `derived.bicepparam`, that builds upon the base parameter file. It references both the Bicep file and the base parameter file. Values you define here override previous ones.

```bicep
using 'main.bicep'

extends 'base.bicepparam'

param namePrefix = 'Dev'
param tags = {
  ...base.tags        // inherit the object from the base file
  environment: 'prod' // override a single property
  region: 'westus2'   // add new data
}
```

In this example, parameter values are applied in layers with a clear order of precedence. The `main.bicep` file declares parameters and can provide default values. A **derived** `.bicepparam` file can override values defined in a **base** `.bicepparam` file, and the final assigned parameter values take precedence over any defaults defined in the target template. The resolved values are:

| Parameter | Value |
| -- | -- |
| namePrefix | `'Dev'` |
| location | `'westus'` |
| tags | `{ environment: 'prod', owner: 'platform', region: 'westus2' }` |

## Access parent parameters

To use the `base` keyword, your derived parameter file must include an `extends` clause. This clause unlocks `base` as an identifier, so you can access all parent parameters as properties. If you try to use `base` without an `extends` clause, you get an error.

You can combine the [spread operator (...)](./operator-spread.md) with `base` to cleanly extend or merge complex data types. This approach lets you copy existing array or object values from the parent file and modify them without retyping the entire data structure. The spread operator is strictly limited to objects and arrays. If you try to spread a primitive value, such as a string, integer, or boolean, you cause a compilation failure.

All overridden values must match the exact data type expected by the target parameter. Supplying an incompatible type results in a type error during compilation.

The Bicep file **main.bicep**:

```bicep
param app object
param locations array
param fullName string
```

The base parameter file **base.bicepparam**:

```bicep
using none

param app = {
  name: 'demo'
  tags: {
    owner: 'platform'
    environment: 'dev'
  }
}
param locations = ['westus', 'eastus']
```

The derived parameter file **derived.bicepparam**:

```bicep
using './main.bicep'
extends './base.bicepparam'

// Merge objects
param app = {
  ...base.app
  tags: {
    ...base.app.tags
    environment: 'prod'
    costCenter: '1234'
  }
}

// Merge arrays
param locations = [...base.locations, 'centralus']

// Use base in expressions or variables
var suffix = '-api'
param fullName = '${base.app.name}${suffix}'
```

The resolved values are:

| Parameter | Value |
| -- | -- |
| app | `{"name":"demo","tags":{"owner":"platform","environment":"prod","costCenter":"1234"}}` |
| locations | `["westus","eastus","centralus"]` |
| fullName | `demo-api` |

## Nested parameter files

While a derived parameters file can only feature a single `extends` statement, Bicep allows you to build multilevel hierarchies by chaining parameter files sequentially (Parameter File A $\rightarrow$ Parameter File B $\rightarrow$ Parameter File C).

This structure is useful for organizing enterprise deployments. You can define global defaults at the root, override environment-wide settings in the middle tier, and specify localized, resource-specific configurations at the leaf level.

When you build a chain, any intermediate or root parameter file in the sequence must include the [`using none`](./bicep-using.md#the-using-none-statement) statement. This statement signals to the Bicep compiler that the file acts strictly as a configuration layer and doesn't directly bind to a specific `.bicep` deployment template.

The following example shows how you can set up a three-tier chain to configure an Azure resource layout, moving from global organization settings down to a specific localized development environment.

**The Bicep file (`compute.bicep`)**

```bicep
param primaryLocation string

param globalTags object 
param environmentTags object
param resourceTags object

param skuName string
param vmSku string
param vmName string
...
```

**The root tier: global defaults (`global.bicepparam`)** establishes the baseline properties used across the entire organization. It uses `using none` because it's purely a configuration base.

```bicep
using none

// Global baseline tags applied to every single resource
param globalTags = {
  BillingUnit: 'Enterprise-IT'
  DataClassification: 'Confidential'
}

// Default regional pair
param primaryLocation = 'eastus'
```

**The intermediate tier: environment settings (`dev-defaults.bicepparam`)** inherits the global properties, overrides the environment type, and appends environment-specific configurations. Because it's an intermediate layer, it also uses `using none`.

```bicep
using none
extends './global.bicepparam'

// Inherit global tags and inject the environment designation
param environmentTags = {
  ...base.globalTags
  Environment: 'Development'
}

// Override region for low-cost development testing
param primaryLocation = 'westus'

// Tier-specific infrastructure sizes
param skuName = 'Standard_D2s_v5'
```

**The leaf tier: targeted deployment (`compute.dev.bicepparam`)** targets a specific workload deployment. It connects directly to the actual Bicep infrastructure template via the standard `using` statement, inheriting the entire combined state of the chain.

```bicep
extends './dev-defaults.bicepparam'
using './compute.bicep' // Binds the final resolved values to the template

// Combine all inherited layers into the final parameters expected by compute.bicep
param resourceTags = {
  ...base.environmentTags
  Workload: 'Web-FrontEnd'
}

// Use inherited environment SKU directly, or override it if needed
param vmSku = base.skuName

// Explicit deployment property
param vmName = 'vm-web-dev-01'
```

## Related content

- To learn about Bicep parameter files, see [Bicep parameter file](./parameter-files.md).
- To learn about `using` and `using none`, see [Using and using none statements](./bicep-using.md).
- To learn about the spread operator, see [Spread operator](./operator-spread.md).

---
title: environment.yaml schema
description: Learn how to use environment.yaml to define parameters in your environment definition.
author: RoseHJM
ms.author: rosemalcolm
ms.service: azure-deployment-environments
ms.topic: concept-article
ms.date: 03/20/2025

# Customer intent: As a developer, I want to know the properties and parameters that I can use in environment.yaml.

---

# Properties and parameters in environment.yaml

Azure Deployment Environments environment definitions are infrastructure as code (IaC) that are written in Bicep or Terraform and stored in repositories. You can modify and adapt environment definitions for your requirements and then use them to create a deployment environment on Azure. The environment.yaml schema defines and describes the types of Azure resources included in environment definitions.


## What is environment.yaml?

The environment.yaml file acts as a manifest, describing the resources used and the template location for the environment definition.

### Sample environment.yaml

The following script is an example of the environment.yaml that's required for your environment definition.

```yml
name: WebApp
version: 1.0.0
summary: Azure Web App Environment
description: Deploys a web app in Azure without a datastore
runner: ARM
templatePath: azuredeploy.json
```

### Definitions

The following table describes the properties that you can use in environment.yaml.

| Property | Type | Description   | Required?|Example|
| ------------ | -------- |------- | ------------ | ---------------- |
| `name`         | string   | The display name of the catalog item.              | Yes          |         WebApp                                        |
| `version`      | string   | The version of the catalog item.                   |         No     | 1.0.0                                           |
| `summary`      | string   | A short string that summarizes the catalog item.     |           No   |          Azure Web App Environment                                       |
| `description`  | string   | A description of the catalog item.    |   No           |          Deploys a web app in Azure without a datastore |
| `runner`       | string   | The container image to use when running actions. |          No    | ARM template </br> Terraform                             |
| `templatePath` | string   | The relative path of the entry template file.      | Yes          | main.tf </br> main.bicep </br> azuredeploy.json |
| `parameters`   | array    | Input parameters to use when creating the environment and running actions. |      No        | #/definitions/Parameter               |

## Parameters in environment.yaml

Parameters enable you to reuse an environment definition in different scenarios. For example, you might want developers in different regions to deploy the same environment. You can define a location parameter to prompt developers to enter the desired location as they create their environments. 

### Sample environment.yaml with parameters

The following script is an example of a environment.yaml file that includes two parameters: `location` and `name`.

```yml
name: WebApp
summary: Azure Web App Environment
description: Deploys a web app in Azure without a datastore
runner: ARM
templatePath: azuredeploy.json
parameters:
- id: "location"
  name: "location"
  description: "Location to deploy the environment resources"
  default: "[resourceGroup().location]"
  type: "string"
  required: false
- id: "name"
  name: "name"
  description: "Name of the Web App "
  default: ""
  type: "string"
  required: false
```

### Parameter definitions

The following table describes the data types that you can use in environment.yaml. The data type names used in the environment.yaml manifest file differ from the ones used in ARM templates.

Each parameter can use any of the following properties:

| Parameter| Type| Description   | Additional settings   |
| ----| --- |---------------------- |-------------------- |
| `id `            | string         | A unique ID of the parameter.                     |                                        |
| `name`           | string         | A display name for the parameter.                  |                                        |
| `description`    | string         | A description of the parameter.                   |                                        |
| `default` | array </br> boolean </br> integer </br> number </br> object </br> string | The default value of the parameter. |                                        |
| `type`| array </br> boolean </br> integer </br> number </br> object </br> string | The data type of the parameter.  This data type must match the parameter data type that has the corresponding parameter name in the ARM template, Bicep file, or Terraform file. | **Default type:** string |
| `readOnly`| boolean  | Whether the parameter is read-only.     |            |
| `required`       | boolean        | Whether the parameter is required.  |   |
| `allowed`  | array  | An array of allowed values.  | "items": { </br> "type": "string" </br> }, </br> "minItems": 1, </br> "uniqueItems": true, |

## YAML schema

There's a defined schema for Azure Deployment Environments environment.yaml files. It can make editing these files a little easier. You can add the schema definition to the beginning of your environment.yaml file:

```yml
# yaml-language-server: $schema=https://github.com/Azure/deployment-environments/releases/download/2022-11-11-preview/manifest.schema.json
```
 
Here's an example environment definition that uses the schema:

```yml
# yaml-language-server: $schema=https://github.com/Azure/deployment-environments/releases/download/2022-11-11-preview/manifest.schema.json
name: FunctionApp
version: 1.0.0
summary: Azure Function App Environment
description: Deploys an Azure Function App, Storage Account, and Application Insights
runner: ARM
templatePath: azuredeploy.json

parameters:
  - id: name
    name: Name
    description: 'Name of the Function App.'
    type: string
    required: true

  - id: supportsHttpsTrafficOnly
    name: 'Supports HTTPS Traffic Only'
    description: 'Allows https traffic only to Storage Account and Functions App if set to true.'
    type: boolean

  - id: runtime
    name: Runtime
    description: 'The language worker runtime to load in the function app.'
    type: string
    allowed:
      - 'dotnet'
      - 'dotnet-isolated'
      - 'java'
      - 'node'
      - 'powershell'
      - 'python'
    default: 'dotnet-isolated'
```

## Related resources

- [Add and configure an environment definition in Azure Deployment Environments](configure-environment-definition.md)
- [Parameters in ARM templates](../azure-resource-manager/templates/parameters.md)
- [Data types in ARM templates](../azure-resource-manager/templates/data-types.md)
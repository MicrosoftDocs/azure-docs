---
title: environment.yaml schema
description: Learn how to use environment.yaml to define parameters in your environment definition.
author: RoseHJM
ms.author: rosemalcolm
ms.service: dev-box
ms.topic: concept-article
ms.date: 11/17/2023

#customer intent: As a developer, I want to know which parameters I can assign for parameters in environment.yaml.

---

# Parameters and data types in environment.yaml

ADE environment definitions are infrastructure as code (IaC), written in Bicep or Terraform, stored in repositories. Environment definitions can be modified and adapted for your specific requirements and then used to create a deployment environment on Azure. The environment.yaml schema defines and describes the types of Azure resources included in environment definitions.


## What is environment.yaml?

The environment.yaml file acts as a manifest, describing the resources used and the template location for the environment definition.

### Sample environment.yaml
The following script is a generic example of an environment.yaml required for your environment definition.

```yml
name: WebApp
version: 1.0.0
summary: Azure Web App Environment
description: Deploys a web app in Azure without a datastore
runner: ARM
templatePath: azuredeploy.json
```

| **Property** | **Type** | **Description**                                    | **Required** | **Examples**                                    |
| ------------ | -------- | -------------------------------------------------- | ------------ | ----------------------------------------------- |
| name         | string   | The display name of the catalog item.              | Yes          |                                                 |
| version      | string   | The version of the catalog item.                   |              | 1.0.0                                           |
| summary      | string   | A short summary string about the catalog item.     |              |                                                 |
| description  | string   | A description of the catalog item.                 |              |                                                 |
| runner       | string   | The container image to use when executing actions. |              | ARM template </br> Terraform                             |
| templatePath | string   | The relative path of the entry template file.      | Yes          | main.tf </br> main.bicep </br> azuredeploy.json |
| parameters   | array    | Input parameters to use when creating the environment and executing actions. |              | #/definitions/Parameter               |

## Parameters in environment.yaml

Parameters enable you to reuse an environment definition in different scenarios. For example, you might want developers in different regions to deploy the same environment. You can define a location parameter to prompt the developer to enter the desired location as they create their environment. 

### Sample environment.yaml with parameters

The following script is an example of a environment.yaml file that includes two parameters; `location` and `name`:

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

The following table describes the data types that you can use in environment.yaml. The data type names used in the environment.yaml manifest file differ from those used in ARM templates.

Each parameter can use any of the following properties:

| **Properties** | **Type**       | **Description**                                 | **Further Settings**                   |
| -------------- | -------------- |------------------------------------------------ |--------------------------------------- |
| ID             | string         | Unique ID of the parameter.                     |                                        |
| name           | string         | Display name of the parameter.                  |                                        |
| description    | string         | Description of the parameter.                   |                                        |
| default        | array </br> boolean </br> integer </br> null </br> number </br> object </br> string | The default value of the parameter. |                                        |
| type           | array </br> boolean </br> integer </br> null </br> number </br> object </br> string | The data type of the parameter.  This data type must match the parameter data type in the ARM template, BICEP file, or Terraform file with the corresponding parameter name. | **Default type:** string |
| readOnly       | boolean        | Whether or not this parameter is read-only.     |                                        |
| required       | boolean        | Whether or not this parameter is required.      |                                        |
| allowed        | array          | An array of allowed values.                     | "items": { </br> "type": "string" </br> }, </br> "minItems": 1, </br> "uniqueItems": true, |

## Related content

- [Add and configure an environment definition in Azure Deployment Environments](configure-environment-definition.md)
- [Parameters in ARM templates](../azure-resource-manager/templates/parameters.md)
- [Data types in ARM templates](../azure-resource-manager/templates/data-types.md)

<!-- Optional: Related content - H2

Consider including a "Related content" H2 section that 
lists links to 1 to 3 articles the user might find helpful.

-->

<!--

Remove all comments except the customer intent
before you sign off or merge to the main branch.

-->
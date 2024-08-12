---
title: Create and publish workflow templates
description: How to create workflow templates for use in Azure Logic Apps and share templates with others through the template gallery in GitHub.
services: azure-logic-apps
ms.suite: integration
ms.reviewer: estfan, azla
ms.topic: how-to
ms.date: 08/23/2024
#Customer intent: As a developer, I want to create and share workflow templates for use with Azure Logic Apps.
---

# Create and publish workflow templates for Azure Logic Apps (Preview)

> [!IMPORTANT]
> This capability is in preview and is subject to the 
> [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

[!INCLUDE [logic-apps-sku-standard](../../includes/logic-apps-sku-standard.md)]

Azure Logic Apps provides prebuilt integration workflow templates that you can use to accelerate the process of building integration applications. These templates follow commonly used patterns and help developers streamline development by providing a starting point or baseline with predefined business logic and configurations. You can include artifacts such as schemas, maps, and assemblies with the workflow templates that you create.

## Prerequisites




## Limitations

- Workflow templates currently support Standard logic apps and single workflows. 

## What templates to build?

The following list provides some example ideas:

## What does a template package include?

Every template includes the following files:

| File name | Required | Description |
|-----------|----------|-------------|
| **workflow.json** | Yes | The workflow definition in JSON format. |
| **manifest.json** | Yes | |
| **snapshot-light.png** | Yes | |
| **snapshot-dark.png** | Yes | |
| **<*map-name*>.json**, **.xml**, or **.xslt** | No | |
| **<*custom-assembly*>.dll** | No | |
| **readme.md** | No | |

You can also include any other files to maintain your template, for example, files that contain test or sample data.

## Create a workflow template

Create the workflow for which you want to create the template. Your workflow likely will have references to Service Providers, API connections or libraries. In this section, we’ll explain how to templatize your entire solution.

### Create a workflow.json file

Workflow.json is the workflow definition. You can simply copy the workflow definition from the code view and save it as workflow.json. Here is an example -  

To include the folder name for your template, you must update this [manifest.json file in the template gallery's GitHub repository](https://github.com/Azure/LogicAppsTemplates/blob/main/manifest.json).

## Create a workflow overview image

In the overview page of the templates, we intend to show the read only view of the workflow. You can take a screenshot of your workflow and provide that image file. You can name it anything  - just make sure to use that name in the manifest.json in the images section 

## Create a manifest.json file

Until we have the tooling available, creating this file will be a manual process. The information that goes in this file describes the workflow and its related components. You can use the manifest.json from one of the existing templates here instead of starting from scratch. 

| Attribute name | Required | Value | Description |
|----------------|----------|-------|-------------|
| **`title`** | Yes | <*template-title*> | The title that appears in the templates gallery, which opens when you add a workflow from a template in the Azure portal. |
| **`description`** | Yes | <*template-description*> | The template description, which appears on the template's overview pane in the template gallery. |
| **`sku`** | Yes | **`standard`**, **`consumption`** | The logic app workflow type supported by the template. If you're not sure, use **`standard`**. |
| **`prerequisites`** | No | <*template-prerequisites*> | Any prerequisites to meet for using the template. Appears in the template's overview pane. You can link to other documents from this section. |
| **`kinds`** | No | **`stateful`**, **`stateless`** | The workflow mode, which determines whether run history and operation states are stored. <br><br>By default, all workflows are available in both stateful and stateless mode. If your workflow only runs in stateful mode, use this attribute to make this requirement explicit. |
| **`tags`** | No | <*template-tags-array*> | The template tags to use for searching or filtering templates. |
| **`details`** | No | See description. | Template information to use for filtering the templates gallery. <br><br>- **`By`**: The template publisher, for example, **`Microsoft`**. <br><br>- **`Type`**: **`Workflow`** <br><br>- **`Trigger`**: The trigger type, for example, **`Recurrence`**, **`Event`**, or **`Request`**. |
| **`artifacts`** | No | <*artifacts-array*> | All the relevant files in the template package and includes the following attributes: <br><br>- **`type`**: The file type, which determines the appropriate location for where to copy the file, for example **`workflow`**. <br><br>- **`file`**: The file name and extension. | 
| **`images`** | Yes | **`snapshot-light.png`**, **`snapshot-dark.png`** | The workflow screenshots for light and dark browser themes. Don't include a lot of whitespace around the workflow. |
| **`parameters`** | Yes | <*workflow-parameters-array*> | The parameters to use for workflow creation. For each parameter, you need to specify the following properties: <br><br>- **`name`**: The parameter name must have the suffix, **`_#workflowname#`**, use only alphanumeric characters and underscores, and follow this format: <br><br>**`<parameter_name>_#workflowname#`** <br><br>- **`displayName`**: The parameter's friendly display name. See [Names and style conventions](#names-style-conventions). <br><br>- **`type`**: The parameter's data type, for example **`String`** or **`Int`**. <br><br>- **`default`**: The parameter's default value, if any. If none, leave this value as an empty string. <br><br>- **`description`** The parameter's details and other important or helpful information. <br><br>- **`required`**: **`true`** or **`false`** |
| **`connections`** | Yes, but can be empty if no connections exist. | <*workflow-connections-array*> | The connections to use in workflow creation. Each connection has the following key properties: <br><br>-**`connectorId`**: <br><br>- **`kind`**: The connection's runtime host, which is either **`inapp`** (built-in or native), **`shared`** (Azure) | 

To get the connector ID, go to the Connections page of your Logic App. In the Connections page, go to JSON View tab. You can copy the ID of the connection from here. For shared connections, strip the private information such as subscription ID, Resource Group Name 

Requirement: Key must be followed by _#workflowname# (i.e. “AI_search” => “AI_search _#workflowname#). This must be reflected in workflow.json when referring connections 

Requirement:  

Name must be followed by _#workflowname#  

i.e. “AI_search” => “AI_search _#workflowname#” 

Name with _#workflowname# must be reflected in workflow.json when referring to connections 

i.e. “referenceName” : “AI_search _#workflowname#” 

i.e. “connectionName”: “AI_search _#workflowname#” 




### Parameter references in workflow.jon

When you reference parameters in the **workflow.json** file, you must reflect names that use the suffix **_#workflowname#** in the following way:

**`@parameters("<parameter_name>_#workflowname#")`**

FeaturedConnections 

The gallery view of templates shows the icons for connectors used in the template. By default, we would show the icons for Service Providers (In App) and Managed Connectors (Shared). If you would like to include icons for any other actions, you can use the Featured Connections property 

This is an array and you can specify the operation type and operation kind. You can get these values from the workflow definition file. For example, for below workflow, highlighted properties should be used 

 ## Names and style conventions

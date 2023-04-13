---
title: Create maps for data transformation
description: Create maps to transform data between schemas in Azure Logic Apps using Visual Studio Code.
services: logic-apps
ms.service: logic-apps
ms.suite: integration
ms.reviewer: estfan, kewear, alexzuniga, azla
ms.topic: how-to
ms.date: 04/17/2023
# As a developer, I want to transform data in Azure Logic Apps by creating a map between schemas with Visual Studio Code.
---

# Create maps to transform data in Azure Logic Apps with Visual Studio Code (preview)

> [!IMPORTANT]
> This capability is in preview and is subject to the 
> [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

[!INCLUDE [logic-apps-sku-standard](../../includes/logic-apps-sku-standard.md)]

To exchange messages that have different XML or JSON formats in an Azure Logic Apps workflow, you have to transform the data from one format to another, especially if you have gaps between the source and target schema structures. Data transformation helps you bridge those gaps. For this task, you need to create a map that defines the relationships between the source schema and target schema.

To visually create and edit a map, you can use Visual Studio Code with the Data Mapper extension within the context of a Standard logic app project. The Data Mapper tool provides a unified experience for XSLT mapping and transformation using drag and drop gestures, a prebuilt functions library for creating expressions, and a way to manually test the maps that you create and use in your workflows.

After you create your map, you can directly call that map from workflows in your logic app project. For this task, add the **Data Mapper Operations** action named **Transform using Data Mapper XSLT** to your workflow. This action is also available in the Azure portal, but you have to add the map to either of the following resources:

- An integration account for a Consumption or Standard logic app resource
- The Standard logic app resource itself

## Limitations

- The Data Mapper extension currently works only in Visual Studio Code running on Windows operating systems.

- The Data Mapper tool is currently available only in Visual Studio Code, not the Azure portal, and only from within Standard logic app projects, not Consumption logic app projects.

- Unless your map transforms XML to XML, you can use maps created in Data Mapper only with the **Data Mapper Operations** action named **Transform using Data Mapper XSLT**, not the **XML Operations** action named **Transform XML**. Specifically, this limitation applies to maps that transform XML to JSON, JSON to XML, or JSON to JSON. For maps that transform XML to XML, you can use the **Transform XML** action.

- The Data Mapper tool's **Code view** pane is currently read only.

## Known issues

The Data Mapper extension currently works only with schemas in flat folder-structured projects.

## Prerequisites

- [Same prerequisites for using Visual Studio Code and the Azure Logic Apps (Standard) extension](create-single-tenant-workflows-visual-studio-code.md#prerequisites) to create Standard logic app workflows.

- The latest Data Mapper extension for Visual Studio Code

- The source and target schema files that describe the data to transform. These files can have either the following formats:

  - An XML schema definition file with the .xsd file extension
  - A JavaScript Object Notation file with the .json file extension

- A Standard logic app project that includes a stateful workflow with at least a trigger. If you don't have a project, follow these steps in Visual Studio Code:

  1. [Connect to your Azure account](create-single-tenant-workflows-visual-studio-code.md#connect-azure-account), if you haven't already.

  1. [Create a local folder, a local Standard logic app project, and a stateful workflow](create-single-tenant-workflows-visual-studio-code.md#create-project). During workflow creation, select **Open in current window**.

- Sample input data if you want to test the map and check that the transformation works as you expect.

## Add source and target schemas to your project folder

1. Go to your local project folder, and expand the **Artifacts** > **Schemas** folder.

1. Add your source and target schema files to the **Schemas** folder.

   In Visual Studio Code, these schema files now also appear in your logic app project.

## Create a data map

1. On the Visual Studio Code left menu, select the **Azure** icon.

1. In the **Azure** pane, under the **Data Mapper** section, select **Create new data map**.

1. Provide a name for your data map.

1. Specify your source schema:

   1. On the map surface, select **Add a source schema**.
   1. On the **Configure** pane that opens, select **Select existing**, if not already selected.
   1. From the source schema list, select your source schema, and then select **Add**.

   The map surface now shows the data fields from the source schema.

1. Specify your target schema:

   1. On the map surface, select **Add a target schema**.
   1. On the **Configure** pane that opens, select **Select existing**, if not already selected.
   1. From the target schema list, select your target schema, and then select **Add**.

   The map surface now shows data fields from the target schema.

## Navigate the map 

To move around the map, you have the following options:

- To pan around, drag your pointer around the map surface. Or, press the mouse wheel.
- In the lower left map corner, on the navigation bar, select the option you want:

  | Option | Alternative gesture |
  |--------|---------------------|
  | **Zoom in** | On the map surface, double select. |
  | **Zoom out** | On the map surface, press SHIFT + double select. |
  | **Zoom to fit** | |
  | **Show (Hide) mini-map** | |

- To move up one level on the map, on the breadcrumb path, select a previous level.

<a name="create-basic-mapping"></a>

## Create a basic mapping relationship

For a direct and simple mapping between visible child elements, follow these steps:

1. On the map surface, in the target schema area, expand the element that you want to map.

1. In the source schema area, select **Select element**. From the element list, select one or more source elements to show them on the map. When you're done, close the source schema window.

   To add more source elements later, on the map, in the upper left corner, select **Show source schema** (node tree).

1. Move your pointer over the source element so that both a circle and a plus sign (**+**) appear.

1. Drag a line to the target element and connect the circle that appears.

   You now have a basic mapping between both elements.

<a name="create-complex-mapping"></a>

## Create a complex mapping relationship

For a more complex transformation, you can create a mapping that uses a function.

1. [Follow the steps to create a basic mapping relationship](#create-basic-mapping).

1. Select the line for the mapping that you created.

1. On the map, in the upper left corner, select **Show functions** (function sign).

1. Move your pointer over the selected connection, and select **Insert function** when the plus sign (**+**) appears.

1. From the **Function** list, select the function that you want to use.

   The function now appears connected to the selected mapping relationship.

   > [!NOTE]
   >
   > If no mapping line is selected when you select a function, the function appears on the map, 
   > but disconnected from any elements or other functions. To connect the function, you can drag 
   > and draw connections between the unmapped function and other items.

1. After the function appears on the map, select the function so that the information window appears. 

1. On the function's **Properties** tab, select the data fields to use as the input and scope for the transformation.

## Save your map

On the map toolbar, select **Save**.

Visual Studio Code saves your map as the following artifacts:

- A **<*your-map-name*>.yml** file in the **Artifacts** > **MapDefinitions** project folder
- An **<*your-map-name*>.xslt** file in the **Artifacts** > **Maps** project folder

## Test your map

To confirm that the transformation works as you expect, you'll need sample input data.

1. On your map toolbar, select **Test**.

1. On the **Test map** pane, in the **Input** window, paste your sample input data, and then select **Test**.

   The test pane switches to the **Output** tab and shows the test's status code and response body.

## Call your map from your workflow

1. On the Visual Studio Code left menu, select **Explorer** (files icon) to view your logic app project structure.

1. Expand the folder that has your workflow name. From the **workflow.json** file's shortcut menu, select **Open Designer**.

1. On the workflow designer, either after the step or between the steps where you want to perform the transformation, select the plus sign (**+**) > **Add an action**.

1. On the **Add an action** pane, in the search box, enter **data mapper**. Select the **Data Mapper Operations** action named **Transform using Data Mapper XSLT**.

1. In the action information box, specify the **Content** value, and leave **Map Source** set to **Logic App**. From the **Map Name** list, select the map file (.xslt) that you want to use.

## Next steps

- For maps that transform XML to XML, see [Transform XML in workflows with Azure Logic Apps](logic-apps-enterprise-integration-transform.md)
- For data transformations using B2B operations in Azure Logic Apps, see [Add maps for transformations in workflows with Azure Logic Apps](logic-apps-enterprise-integration-maps.md)
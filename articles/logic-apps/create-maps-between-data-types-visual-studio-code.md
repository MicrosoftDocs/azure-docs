---
title: Create maps between data types
description: Create maps between data types for Azure Logic Apps with Visual Studio Code.
services: logic-apps
ms.service: logic-apps
ms.suite: integration
ms.reviewer: estfan, kewear, alexzuniga, azla
ms.topic: how-to
ms.date: 04/12/2023
# As a developer, I want to create a mapping between data types in Azure Logic Apps using Visual Studio Code.
---

# Create maps between data types for Azure Logic Apps using Visual Studio Code (preview)


## Limitations



## Prerequisites

- [Same prerequisites for creating Standard logic app workflows with Visual Studio Code and the Azure Logic Apps (Standard) extension](create-single-tenant-workflows-visual-studio-code.md#prerequisites)

- Data Mapper extension 2.0.21 for Visual Studio Code

- Your source schema (.xsd) file, which is in XML schema definition (XSD) format 

- Your target schema (.json) file, which is in JavaScript Object Notation (JSON) format

- 

## Create a Standard logic app project

1. In Visual Studio Code, [follow these steps to connect to your Azure account](create-single-tenant-workflows-visual-studio-code.md#connect-azure-account), if you haven't already.

1. [Follow these steps to create a local folder, a local logic app project, and a stateful workflow](create-single-tenant-workflows-visual-studio-code.md#create-project). During workflow creation, select **Open in current window**.

## Add source and target schemas to your project folder

1. In your local project folder, expand the **Artifacts** > **Schemas** folder.

1. Add your source schema (.xsd) file and target schema (.json) file to the **Schemas** folder.

   In Visual Studio Code, these schema files now also appear in your logic app project.

   This example continues with a source schema named **SQLProductionVV.xsd** and a target schema named **DestinationSchema.json**.

## Create a data map

1. On the Visual Studio Code left menu, select the **Azure** icon.

1. In the **Azure** pane, under the **Data Mapper** section, select **Create new data map**.

1. Provide a name for your data map.

1. Specify your source schema:

   1. On the map surface, select **Add a source schema**.
   1. On the **Configure** pane that opens, select **Select existing**, if not already selected.
   1. From the source schema list, select your source schema, and then select **Add**.

   The map surface now shows fields from the source schema.

1. Specify your target schema:

   1. On the map surface, select **Add a target schema**.
   1. On the **Configure** pane that opens, select **Select existing**, if not already selected.
   1. From the target schema list, select your target schema, and then select **Add**.

   The map surface now shows fields from the target schema.

## Create mappings between data types

1. On the map toolbar, select **Overview**.

1. In the source schema column, move your mouse over the field that you want to start mapping.

   To navigate around the map, you have the following options:

   | Action | Step |
   |--------|------|
   | Zoom in | Double click on the map |
   | Zoom out | SHIFT + double click on the map |
   | Pan around | Drag the map |

## Save your map


## Test your map




## Known issues



## Next steps

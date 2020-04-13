---
# Mandatory fields.
title: Build a basic Azure Digital Twins solution
titleSuffix: Azure Digital Twins
description: Tutorial to set up models, digital twins, and a twin graph in Azure Digital Twins.
author: baanders
ms.author: baanders # Microsoft employees only
ms.date: 4/13/2020
ms.topic: tutorial
ms.service: digital-twins

# Optional fields. Don't forget to remove # if you need a field.
# ms.custom: can-be-multiple-comma-separated
# ms.reviewer: MSFT-alias-of-reviewer
# manager: MSFT-alias-of-manager-or-PM-counterpart
---

# Azure Digital Twins basics

This tutorial shows you how to set up and work with three major Azure Digital Twins concepts: models, digital twins, and the twin graph.

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

## Prerequisites

Before you start, install [Visual Studio 2019](https://visualstudio.microsoft.com/downloads/) version 16.5.1XXX or later on your development machine. If you have an older version installed already, open the *Visual Studio Installer* app on your machine and follow the prompts to update your installation.

This tutorial uses the Azure Digital Twins instance and configured sample project from the [quickstart](quickstart.md) for creating and configuring Azure Digital Twins. You will need to complete the quickstart before building on it in this tutorial.

## Model a physical environment with DTDL

The first step in crafting an Azure Digital Twins solution is concepting and defining twin [**models**](concepts-models.md) for your environment. Models are similar to classes in object-oriented programming languages; they provide user-defined templates for digital twins to follow and instantiate later. They are written in a JSON-like language called Digital Twins Definition Language (DTDL).

You can see sample models in */DigitalTwinsMetadata/DigitalTwinsSample/Models*. Open *Floor.json* and *Room.json* and try making one of the following changes:
* Update existing models (*Floor.json* or *Room.json*)
  - Start by changing the `@id` value to `urn:example:<model-name>:2`. The "2" is the version number, so doing this will indicates that you are providing a more-updated version of this model. Any number greater than the current version number will also work.
  - Then play around with adding/changing properties or relationships.
* Create your own models
  - Use the existing model examples to create your own models in the */DigitalTwinsMetadata/DigitalTwinsSample/Models* folder, and upload them using the process described earlier.

Once you are satisfied with the models, upload a model to your Azure Digital Twins instance by starting (![Visual Studio start button](media/tutorial-build/start-button.jpg)) the **DigitalTwinsSample** project in Visual Studio. A console window will open, carry out device authentication, and present action options.

Run the following command to upload the models for *Floor* and *Room*.

 ```cmd
 addModels Floor Room
 ```

Afterwards, you can verify the models were created with the `listModels` command. 

## Create digital twins

Now that you have uploaded some models to your Azure Digital Twins instance, you can create **digital twins** based on the model definitions. Digital twins represent the entities within your business environment, and can be things like sensors on a farm, rooms in a building, or lights in a car. 

To create a twin, you reference the model that the twin is based on, and define values for any properties in the model.

Run this code to create several twins based on the *Floor* and *Room* models. Recall that *Room* has two properties, so creating a twin of this type requires you to provide arguments with the initial values.

```csharp
addTwin urn:example:Floor:1 floor0
addTwin urn:example:Room:1 room0 Temperature double 100 Humidity double 60
addTwin urn:example:Room:1 room1 Temperature double 200 Humidity double 30
```

Verify that the twins were created by querying your Azure Digital Twins instance with `queryTwins`.

   * Notice that `queryTwins` allows you to input SQL-like queries as an argument, but leaving it blank executes a `SELECT * FROM DIGITALTWINS` query.

## Create a graph by adding relationships

Next, we'll connect these twins using **relationships** to form a **twin graph** of your entire environment. The following example adds a "contains" edge from the *Floor* twin to each of the *Room* twins.

  ```csharp
  addEdge floor0 contains room0 edge0
  addEdge floor0 contains room1 edge1
  ```

Verify the edges were created by running either of the following commands:

  ```csharp
  listEdges floor0
  ```
  or
  ```csharp
  getEdgeById floor0 contains edge0
  getEdgeById floor0 contains edge1
  ```

In this tutorial, you set up twins and relationships to form this graph:

![A graph with a "Floor" node connected to two different "Room" nodes via "contains" relationships](media/tutorial-build/sample-graph.jpg)
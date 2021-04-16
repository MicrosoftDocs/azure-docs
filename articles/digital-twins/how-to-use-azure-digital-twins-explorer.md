---
# Mandatory fields.
title: Use Azure Digital Twins Explorer
titleSuffix: Azure Digital Twins
description: Understand how to use the features of Azure Digital Twins Explorer
author: baanders
ms.author: baanders # Microsoft employees only
ms.date: 4/16/2021
ms.topic: how-to
ms.service: digital-twins

# Optional fields. Don't forget to remove # if you need a field.
# ms.custom: can-be-multiple-comma-separated
# ms.reviewer: MSFT-alias-of-reviewer
# manager: MSFT-alias-of-manager-or-PM-counterpart
---

# Azure Digital Twins Explorer

<intro>

## Set up

<how to access it in the portal>
<any other setup steps>

## Upload/download models

Azure Digital Twins needs to be configured with models representing the entities that are important to your business. If you are using a fresh Azure Digital Twins instance, you should upload some models to the service first.

To upload, browse and delete models, use the model view panel docked on the left side of the screen.

<img src="https://raw.githubusercontent.com/Azure-Samples/digital-twins-explorer/main/media/model-view.png" alt="model view panel" width="250"/>
 
The panel will automatically show all available models in your environment on first connection; however, to trigger it explicitly, click on the *Download models* button.

### Import models

To upload a model, click on the *Upload a model* button and select one more JSON-formatted model files when prompted.

For each model, you can:
1. **Delete**: remove the definition from your Azure Digital Twins environment.
1. **Upload Model Image**: upload a custom twin image to be displayed in the graph view.
    >**NOTE:** To bulk upload model images, you can click the **Upload Model Images** icon in the nav bar in the model view panel. The name of your image file should match the model ID however replace ":" with "_" and ";" with "-". 
1. **View**: see the raw JSON definition of the model.
1. **Create a new twin**: create a new instance of the model as a twin in the Azure Digital Twins environment. No properties are set as part of this process (aside from name).

### Export models

### Support for uploading large model sets

## Model graph viewer

### Add and delete models

### Filtering and highlighting

## Twin graph viewer

### Create twins and relationships

You can create twins and relationships in digital-twins-explorer. To create more than a few individual twins and relationships, you will probably want to use the **import** feature described below.

* To create a twin instance, use the (+) button in any of the model items in the model list. A dialog will open, prompting you for the desired name of the new instance. The name must be unique.

<img src="https://raw.githubusercontent.com/Azure-Samples/digital-twins-explorer/main/media/create-twin.png" alt="create twin" width="250"/>

* To create a relationship: 
  * You need to have at least two twins in your graph. An appropriate relationship must be defined in the model definition (in other words, the relationship you are trying to create must be allowed in the DTDL of the source twin). 
  * Select the source twin first by clicking on it, then hold the shift key and click the target twin.
  * Click the "Create Relationship" button in the graph viewer command bar

<img src="https://raw.githubusercontent.com/Azure-Samples/digital-twins-explorer/main/media/create-rel.png" alt="create relationship" width="400"/>


  * Pick the desired relationship type (if any is available) from the popup menu in the relationship dialog

<img src="https://raw.githubusercontent.com/Azure-Samples/digital-twins-explorer/main/media/create-rel-diag.png" alt="create relationship dialog" width="250"/>

#### Twin instantiation

### Edit twins and relationships

Selecting a node in the *Graph View* shows its properties in the *Property Explorer*. This includes default values for properties that have not yet been set.

To edit writeable properties, update their values inline and click the Save button at the top of the view. The resulting patch operation on the API is then shown in a modal.

Selecting two nodes allows for the creation of relationships. Multi-selection is enabled by holding down CTRL/CMD keys. Ensure twins are selected in the order of the relationship direction (i.e the first twin selected will be the source). Once two twins are selected, click on the `Create Relationship` button and select the type of relationship.

Multi-select is also enabled for twin deletion.

#### Filtering and highlighting

#### Show and edit twin properties

<improved property editing for twins and complex properties>

#### Show and edit relationship properties

#### Tooltips for twins and relationships

### Query

Queries can be issued from the *Query Explorer* panel.

To save a query, click on the Save icon next to the *Run Query* button. This query will then be saved locally and be available in the *Saved Queries* drop down to the left of the query text box. To delete a saved query, click on the *X* icon next to the name of the query when the *Saved Queries* drop down is open.

For large graphs, it's suggested to query only a limited subset and then load the remainder as required. More specifically, you can double click on twins in the graph view to retrieve additional related nodes.

To the right side of the *Query Explorer* toolbar, there are a number of controls to change the layout of the graph. Four different layout algorithms are available alongside options to center, fit to screen, and re-run layout.

### Import/Export

From the *Graph View*, import/export functionality is available.

Export serializes the most recent query results to a JSON-based format, including models, twins, and relationships.

Import deserializes from either a custom Excel-based format (see the [examples](https://github.com/Azure-Samples/digital-twins-explorer/tree/main/client/examples) folder for example files) or the JSON-based format generated on export. Before import is executed, a preview of the graph is presented for validation.

The excel import format is based on the following columns:
* ModelId: The complete dtmi for the model that should be instantiated.
* ID: The unique ID for the twin to be created
* Relationship: A twin id with an outgoing relationship to the new twin
* Relationship name: The name for the outgoing relationship from the twin in the previous column
* Init data: A JSON string that contains Property settings for the twins to be created

A few notes for relationships in the excel file. The following row

`dtmi:example:test;1, twin01, twin02, relatesTo, {"Capacity":5}`  

creates a twin instance of type `dtmi:example:test;1` with the id `twin01` and a `Capacity` property set to 5. It will also create a `relatesTo` relationship from a twin instance with the id twin02 to twin01.

In this example, the model `dtmi:example:test;1` actually must define a property named `Capacity` of a numeric data type, and the model type of `twin02` must have a defined relationship `relatesTo`.
  
It is also possible to create multiple relationships to a twin that is being created. To just create a relationship (not a twin instance) simply leave the modelId column empty. 

#### Query overlay mode

## Import/export graph

## Advanced settings

Clicking the settings cog in the top right corner allows the configuration of the following advanced features:
1. Eager Loading: in the case the twins returned by a query have relationships to twins *not* returned by the query, this feature will load these missing twins before rendering the graph.
1. Caching: this keeps a local cache of relationships and models in memory to improve query performance. These caches are cleared on any write operations on the relevant components (or on browser refresh).
1. Console & Output windows: these are hidden by default. The console window enables the use of simple shell functions for working with the graph. The output window shows a diagnostic trace of operations.
1. Number of layers to expand: when double clicking on a node, this number indicates how many layers of relationships to fetch.
1. Expansion direction: when double clicking on a node, this indicates which kinds of relationships to follow when expanding.

## Known limitations

* digital-twins-explorer does not currently handle complex properties or components defined in twins well. You can create or visualize twins using these features, but you may not be able to view or edit their properties
* The display of patches in the property inspector is not always correct if you perform multiple patches in a sequence. The changes should be correctly applied to th service twin, though

## Next steps 

Learn about writing queries for the Azure Digital Twins twin graph: 
* [*Concepts: Query language*](concepts-query-language.md)
* [*How-to: Query the twin graph*](how-to-query-graph.md)
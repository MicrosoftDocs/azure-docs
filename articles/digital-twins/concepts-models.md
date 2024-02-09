---
# Mandatory fields.
title: DTDL models
titleSuffix: Azure Digital Twins
description: Learn how Azure Digital Twins uses custom models to describe entities in your environment and how to define these models using the Digital Twin Definition Language (DTDL).
author: baanders
ms.author: baanders # Microsoft employees only
ms.date: 10/3/2023
ms.topic: conceptual
ms.service: digital-twins

# Optional fields. Don't forget to remove # if you need a field.
# ms.custom: can-be-multiple-comma-separated
# ms.reviewer: MSFT-alias-of-reviewer
# manager: MSFT-alias-of-manager-or-PM-counterpart

ms.custom: fasttrack-edit
---

# Learn about twin models and how to define them in Azure Digital Twins

A key characteristic of Azure Digital Twins is the ability to define your own vocabulary and build your twin graph in the self-defined terms of your business. This capability is provided through user-provided *models*. You can think of models as the nouns in a description of your world. Azure Digital Twins models are represented in the JSON-LD-based *Digital Twin Definition Language (DTDL)*. 

A model is similar to a *class* in an object-oriented programming language, defining a data shape for one particular concept in your real work environment. Models have names (such as Room or TemperatureSensor), and contain elements such as properties, telemetry, and relationships that describe what this type of entity in your environment does. Later, you'll use these models to create [digital twins](concepts-twins-graph.md) that represent specific entities that meet this type description.

## Digital Twin Definition Language (DTDL) for models

Models for Azure Digital Twins are defined using the Digital Twins Definition Language (DTDL). 

You can view the full language description for DTDL v3 in GitHub: [DTDL Version 3 Language Description](https://github.com/Azure/opendigitaltwins-dtdl/blob/master/DTDL/v3/DTDL.v3.md). This page includes DTDL reference details and examples to help you get started writing your own DTDL models.

DTDL is based on JSON-LD and is programming-language independent. DTDL isn't exclusive to Azure Digital Twins. It is also used to represent device data in other IoT services such as [IoT Plug and Play](../iot-develop/overview-iot-plug-and-play.md).

The rest of this article summarizes how the language is used in Azure Digital Twins.

### Supported DTDL versions

Azure Digital Twins supports DTDL versions 2 and 3 (shortened in the documentation to v2 and v3, respectively). V3 is the recommended choice for modeling in Azure Digital Twins based on its expanded capabilities, including:
* [DTMI version](#model-overview) relaxation
* [Array support for properties](#schema)
* Increased limits for [model inheritance](#model-inheritance)
* [Feature extensions](#dtdl-v3-feature-extensions)
    * The ability to decorate [custom interface schemas](https://github.com/Azure/opendigitaltwins-dtdl/blob/master/DTDL/v3/DTDL.v3.md#interface-schemas) with semantic types (provided with the [QuantitativeTypes extension](#quantitativetypes-extension))

Where these features are discussed in the documentation, they're accompanied by a note that they're only available in DTDL v3. For a complete list of differences between DTDL v2 and v3, see [DTDL v3 Language Description: Changes from Version 2](https://github.com/Azure/opendigitaltwins-dtdl/blob/master/DTDL/v3/DTDL.v3.md#changes-from-version-2).

Azure Digital Twins also supports using a mix of v2 and v3 models within the same instance. When using models of both versions together, keep in mind the following restrictions:
*	A v2 interface cannot [extend](#model-inheritance) a v3 interface, or have a [component](#components) with a v3 interface as its schema. 
*	Conversely, a v3 interface **can** extend a v2 interface, and a v3 interface **can** have a component with a v2 interface as its schema.
*	[Relationships](#relationships) can point in either direction, from a v2 model source to a v3 model target, or vice-versa from a v3 model source to a v2 model target.

You can also migrate existing v2 models to v3. For instructions on how to do this, see [Convert v2 models to v3](how-to-manage-model.md#convert-v2-models-to-v3).

## Model overview

Twin type models can be written in any text editor. The DTDL language follows JSON syntax, so you should store models with the extension *.json*. Using the JSON extension will enable many programming text editors to provide basic syntax checking and highlighting for your DTDL documents. There's also a [DTDL extension](https://marketplace.visualstudio.com/items?itemName=vsciot-vscode.vscode-dtdl) available for [Visual Studio Code](https://code.visualstudio.com/).

Here are the fields within a model interface:

| Field | Description |
| --- | --- |
| `@id` | A [Digital Twin Model Identifier (DTMI)](https://github.com/Azure/opendigitaltwins-dtdl/blob/master/DTDL/v3/DTDL.v3.md#digital-twin-model-identifier) for the model, in the format `dtmi:<domain>:<unique-model-identifier>;<model-version-number>`. In DTDL v3, the version number can be omitted, or structured as a two-part (`<major>.<minor>`) version number. |
| `@type` | Identifies the kind of information being described. For an interface, the type is `Interface`. |
| `@context` | Sets the [context](https://niem.github.io/json/reference/json-ld/context/) for the JSON document. Models should use `dtmi:dtdl:context;2` for DTDL v2, or `dtmi:dtdl:context;3` for DTDL v3. DTDL v3 models can also name additional [feature extensions](#dtdl-v3-feature-extensions) in this field. |
| `displayName` | [optional] Gives you the option to define a friendly name for the model. If you don't use this field, the model will use its full DTMI value.|
| `contents` | All remaining interface data is placed here, as an array of attribute definitions. Each attribute must provide a `@type` (`Property`, `Telemetry`, `Relationship`, or `Component`) to identify the sort of interface information it describes, and then a set of properties that define the actual attribute. The next section describes the [model attributes](#model-attributes) in detail. |

Here's an example of a basic DTDL model. This model describes a Home, with one property for an ID. The Home model also defines a relationship to a Floor model, which can be used to indicate that a Home twin is connected to certain Floor twins.

:::code language="json" source="~/digital-twins-docs-samples-getting-started/models/basic-home-example/IHome.json":::

### Model attributes

The main information about a model is given by its attributes, which are defined within the `contents` section of the model interface. Here are the attributes available in DTDL. A DTDL model interface may contain zero, one, or many of each of the following fields:
* *Property* - Properties are data fields that represent the state of an entity (like the properties in many object-oriented programming languages). Properties have backing storage and can be read at any time. For more information, see [Properties and telemetry](#properties-and-telemetry) below.
* *Telemetry* - Telemetry fields represent measurements or events, and are often used to describe device sensor readings. Unlike properties, telemetry isn't stored on a digital twin; it's a series of time-bound data events that need to be handled as they occur. For more information, see [Properties and telemetry](#properties-and-telemetry) below.
* *Relationship* - Relationships let you represent how a digital twin can be involved with other digital twins. Relationships can represent different semantic meanings, such as `contains` ("floor contains room"), `cools` ("hvac cools room"), `isBilledTo` ("compressor is billed to user"), and so on. Relationships allow the solution to provide a graph of interrelated entities. Relationships can also have properties of their own. For more information, see [Relationships](#relationships) below.
* *Component* - Components allow you to build your model interface as an assembly of other interfaces, if you want. An example of a component is a frontCamera interface (and another component interface backCamera) that's used in defining a model for a phone. First define an interface for frontCamera as though it were its own model, and then reference it when defining Phone.

    Use a component to describe something that is an integral part of your solution but doesn't need a separate identity, and doesn't need to be created, deleted, or rearranged in the twin graph independently. If you want entities to have independent existences in the twin graph, represent them as separate digital twins of different models, connected by relationships.
    
    >[!TIP] 
    >Components can also be used for organization, to group sets of related properties within a model interface. In this situation, you can think of each component as a namespace or "folder" inside the interface.

    For more information, see [Components](#components) below.

> [!NOTE]
> The [DTDL v3 Language Description](https://github.com/Azure/opendigitaltwins-dtdl/blob/master/DTDL/v3/DTDL.v3.md) also defines *Commands*, which are methods that can be executed on a digital twin (like a reset command, or a command to switch a fan on or off). However, commands are not currently supported in Azure Digital Twins.

## Properties and telemetry

This section goes into more detail about *properties* and *telemetry* in DTDL models.

For comprehensive information about the fields that may appear as part of a property, see [Property in the DTDL v3 Language Description](https://github.com/Azure/opendigitaltwins-dtdl/blob/master/DTDL/v3/DTDL.v3.md#property). For comprehensive information about the fields that may appear as part of telemetry, see [Telemetry in the DTDL v3 Language Description](https://github.com/Azure/opendigitaltwins-dtdl/blob/master/DTDL/v3/DTDL.v3.md#telemetry).

> [!NOTE]
> The `writable` DTDL attribute for properties is not currently supported in Azure Digital Twins. It can be added to the model, but Azure Digital Twins will not enforce it. For more information, see [Service-specific DTDL notes](#service-specific-dtdl-notes).

### Difference between properties and telemetry

Here's some guidance on conceptually distinguishing between DTDL properties and telemetry in Azure Digital Twins.
* *Properties* are expected to have backing storage, which means that you can read a property at any time and retrieve its value. If the property is writable, you can also store a value in the property.  
* *Telemetry* is more like a stream of events; it's a set of data messages that have short lifespans. If you don't set up listening for the event and actions to take when it happens, there's no trace of the event at a later time. You can't come back to it and read it later. 
  - In C# terms, telemetry is like a C# event. 
  - In IoT terms, telemetry is typically a single measurement sent by a device.

Telemetry is often used with IoT devices, because many devices either can't, or aren't interested in, storing the measurement values they generate. Instead, they send them out as a stream of "telemetry" events. In this case, you can't query the device at any time for the latest value of the telemetry field. You'll need to listen to the messages from the device and take actions as the messages arrive. 

As a result, when designing a model in Azure Digital Twins, you'll probably use properties in most cases to model your twins. Doing so allows you to have the backing storage and the ability to read and query the data fields.

Telemetry and properties often work together to handle data ingress from devices. You'll often use an ingress function to read telemetry or property events from devices, and set a property in Azure Digital Twins in response. 

You can also publish a telemetry event from the Azure Digital Twins API. Telemetry is a short-lived event that requires a listener to handle.

### Schema

As per DTDL, the schema for property and telemetry attributes can be of standard primitive types—`integer`, `double`, `string`, and `boolean`—and other types such as `dateTime` and `duration`. 

In addition to primitive types, property and telemetry fields can have these [complex types](#complex-object-type-example):
* `Object`
* `Map`
* `Enum`
* `Array`, depending on DTDL version
    - For properties, `Array` type is not supported in DTDL v2, only DTDL v3. For telemetry, `Array` type is supported in both DTDL v2 and v3. 

They can also be semantic types, which allow you to annotate values with units. In [DTDL v2, semantic types](#dtdl-v2-semantic-type-example) are natively supported; in DTDL v3, you can include them with a [feature extension](#dtdl-v3-feature-extensions).

### Basic property and telemetry examples

Here's a basic example of a property on a DTDL model. This example shows the ID property of a Home.

:::code language="json" source="~/digital-twins-docs-samples-getting-started/models/basic-home-example/IHome.json" highlight="7-11":::

Here's a basic example of a telemetry field on a DTDL model. This example shows Temperature telemetry on a Sensor.

:::code language="json" source="~/digital-twins-docs-samples-getting-started/models/basic-home-example/ISensor.json" highlight="7-11":::

### Complex Object type example

Properties and telemetry can be of complex types, including an `Object` type.

The following example shows another version of the Home model, with a property for its address. `address` is an object, with its own fields for street, city, state, and zip.

:::code language="json" source="~/digital-twins-docs-samples-getting-started/models/advanced-home-example/IHome.json" highlight="8-31":::

### DTDL v2 semantic type example

Semantic types are for expressing a value with a unit. Properties and telemetry for Azure Digital Twins can use any of the semantic types that are supported by DTDL. 

In DTDL v2, semantic types are natively supported. For more information on semantic types in DTDL v2, see [Semantic types in the DTDL v2 Language Description](https://github.com/Azure/opendigitaltwins-dtdl/blob/master/DTDL/v2/DTDL.v2.md#semantic-type). To learn about semantic types in DTDL v3, see [the QuantitativeTypes DTDL v3 feature extension](#quantitativetypes-extension).

The following example shows a DTDL v2 Sensor model with a semantic type telemetry for Temperature, and a semantic type property for Humidity. 

:::code language="json" source="~/digital-twins-docs-samples-getting-started/models/advanced-home-example/ISensor-DTDL-v2.json" highlight="7-18":::

> [!NOTE]
> *"Property"* or *"Telemetry"* must be the first element of the `@type` array, followed by the semantic type. Otherwise, the field may not be visible in [Azure Digital Twins Explorer](concepts-azure-digital-twins-explorer.md).

## Relationships

This section goes into more detail about *relationships* in DTDL models.

For a comprehensive list of the fields that may appear as part of a relationship, see [Relationship in the DTDL v3 Language Description](https://github.com/Azure/opendigitaltwins-dtdl/blob/master/DTDL/v3/DTDL.v3.md#relationship).

> [!NOTE]
> The `writable`, `minMultiplicity`, and `maxMultiplicity` DTDL attributes for relationships are not currently supported in Azure Digital Twins. They can be added to the model, but Azure Digital Twins will not enforce them. For more information, see [Service-specific DTDL notes](#service-specific-dtdl-notes).

### Basic relationship example

Here's a basic example of a relationship on a DTDL model. This example shows a relationship on a Home model that allows it to connect to a Floor model.

:::code language="json" source="~/digital-twins-docs-samples-getting-started/models/basic-home-example/IHome.json" highlight="12-18":::

>[!NOTE]
>For relationships, `@id` is an optional field. If no `@id` is provided, the digital twin interface processor will assign one.

### Targeted and non-targeted relationships

Relationships can be defined with or without a *target*. A target specifies which types of twin the relationship can reach. For example, you might include a target to specify that a Home model can only have a `rel_has_floors` relationship with twins that are Floor twins. 

Sometimes, you might want to define a relationship without a specific target, so that the relationship can connect to many different types of twins.

Here's an example of a relationship on a DTDL model that doesn't have a target. In this example, the relationship is for defining what sensors a Room might have, and the relationship can connect to any type.

:::code language="json" source="~/digital-twins-docs-samples-getting-started/models/advanced-home-example/IRoom.json" range="2-27" highlight="20-25":::

### Properties of relationships

DTDL also allows for relationships to have properties of their own. When you define a relationship within a DTDL model, the relationship can have its own `properties` field where you can define custom properties to describe relationship-specific state.

The following example shows another version of the Home model, where the `rel_has_floors` relationship has a property representing when the related Floor was last occupied.

:::code language="json" source="~/digital-twins-docs-samples-getting-started/models/advanced-home-example/IHome.json" highlight="39-45":::

## Components

This section goes into more detail about *components* in DTDL models.

For a comprehensive list of the fields that may appear as part of a component, see [Component in the DTDL v3 Language Description](https://github.com/Azure/opendigitaltwins-dtdl/blob/master/DTDL/v3/DTDL.v3.md#component).

### Basic component example

Here's a basic example of a component on a DTDL model. This example shows a Room model that makes use of a thermostat model as a component.

:::code language="json" source="~/digital-twins-docs-samples-getting-started/models/advanced-home-example/IRoom.json" highlight="15-19, 28-41":::

If other models in this solution should also contain a thermostat, they can reference the same thermostat model as a component in their own definitions, just like Room does.

> [!IMPORTANT]
> The component interface (thermostat in the example above) must be defined in the same array as any interfaces that use it (Room in the example above) in order for the component reference to be found.

## Model inheritance

Sometimes, you may want to specialize a model further. For example, it might be useful to have a generic model Room, and specialized variants ConferenceRoom and Gym. To express specialization, DTDL supports *inheritance*. Interfaces can inherit from one or more other interfaces. You can do so by adding an `extends` field to the model.

The `extends` section is an interface name, or an array of interface names (allowing the extending interface to inherit from multiple parent models). A single parent can serve as the base model for multiple extending interfaces.

>[!NOTE]
>In DTDL v2, each `extends` can have at most two interfaces listed for it. In DTDL v3, there is no limit on the number of immediate values for an `extends`.
>
>In both DTDL v2 and v3, the total depth limit for an `extends` hierarchy is 10.

The following example re-imagines the Home model from the earlier DTDL example as a subtype of a larger "core" model. The parent model (Core) is defined first, and then the child model (Home) builds on it by using `extends`.

:::code language="json" source="~/digital-twins-docs-samples-getting-started/models/advanced-home-example/ICore.json":::

:::code language="json" source="~/digital-twins-docs-samples-getting-started/models/advanced-home-example/IHome.json" range="1-8" highlight="6":::

In this case, Core contributes an ID and name to Home. Other models can also extend the Core model to get these properties as well. Here's a Room model extending the same parent interface:

:::code language="json" source="~/digital-twins-docs-samples-getting-started/models/advanced-home-example/IRoom.json" range="2-9" highlight="6":::

Once inheritance is applied, the extending interface exposes all properties from the entire inheritance chain.

The extending interface can't change any of the definitions of the parent interfaces; it can only add to them. It also can't redefine a capability already defined in any of its parent interfaces (even if the capabilities are defined to be the same). For example, if a parent interface defines a `double` property `mass`, the extending interface can't contain a declaration of `mass`, even if it's also a `double`.

## DTDL v3 feature extensions

DTDL v3 enables language extensions that define additional metamodel classes, which you can use to write richer models. This section describes the *feature extension* classes that you can use to add non-core features to your DTDL v3 models.

Each feature extension is identified by its *context specifier*, which is a unique [Digital Twin Model Identifier (DTMI)](https://github.com/Azure/opendigitaltwins-dtdl/blob/master/DTDL/v3/DTDL.v3.md#digital-twin-model-identifier) value. To enable a feature extension in a model, add the extension's context specifier to the model's `@context` field (alongside the general DTDL context specifier of `dtmi:dtdl:context;3`). You can add multiple feature extensions to the same model.

Here's an example of what that `@context` field might look like with feature extensions. The following excerpt is from a model that uses both the [QuantitativeTypes extension](#quantitativetypes-extension) and the [Annotation extension](#annotation-extension).

```json
  "@context": [
      "dtmi:dtdl:context;3",
      "dtmi:dtdl:extension:quantitativeTypes;1",
      "dtmi:dtdl:extension:annotation;1"
  ]
```

After you've added a feature extension to a model, you'll have access to that extension's *adjunct types* within the model. You can add adjunct types to the `@type` field of a DTDL element, to give the element additional capabilities. The adjunct type may add additional properties to the element.

For example, here's an excerpt from a model that's using the [Annotation extension](#annotation-extension). This extension has an adjunct type called `ValueAnnotation`, which is added in the example below to a Telemetry element. Adding this adjunct type to the Telemetry element allows the element to have an additional `annotates` field, which is used to indicate another Property or Telemetry that is annotated by this element. 

```json
{
  "@type": [ "Telemetry", "ValueAnnotation" ],
  "name": "currentTempAccuracy",
  "annotates": "currentTemp",
  "schema": "double"
  },
```

The rest of this section explains the Annotation extension and other DTDL v3 feature extensions in more detail.

### Annotation extension

The *Annotation extension* is used to add custom metadata to a property or telemetry element in a DTDL v3 model. Its context specifier is `dtmi:dtdl:extension:annotation;1`. 

This extension includes the `ValueAnnotation` adjunct type, which can be added to a DTDL Property or Telemetry element. The `ValueAnnotation` type adds one field to the element, `annotates`, which allows you to name another property or telemetry that is annotated by the current element.

For more details and examples of this extension, see [Annotation extension in the DTDL v3 Language Description](https://github.com/Azure/opendigitaltwins-dtdl/blob/master/DTDL/v3/DTDL.annotation.v1.md).

### Historization extension

The *Historization extension* is used to designate a Property or Telemetry in a DTDL v3 model as something that should be historized (meaning the historical sequence of its values should be recorded, along with times at which the values change). Its context specifier is `dtmi:dtdl:extension:historization;1`.

This extension includes the `Historized` adjunct type, which can be added as a co-type to a DTDL Property or Telemetry element to indicate that the service should persist the element's historical values and make them available for querying and analytics. The `Historized` adjunct type doesn't add any fields to the element. 

For more details and examples of this extension, see [Historization extension in the DTDL v3 Language Description](https://github.com/Azure/opendigitaltwins-dtdl/blob/master/DTDL/v3/DTDL.historization.v1.md).

### Overriding extension

The *overriding extension* is used to override a property in a DTDL V3 model with an instance value. It's used in combination with the [annotation extension](#annotation-extension), and its context specifier is `dtmi:dtdl:extension:overriding;1`.

This extension includes the `Override` adjunct type, which can be added to a DTDL Property that is *also* co-typed with `ValueAnnotation` (from the annotation extension). The `Override` type adds one field to the element, `overrides`, which allows you to name a field on the annotated element to be overridden by the current element's value.

For more details and examples of this extension, see [Overriding extension in the DTDL v3 Language Description](https://github.com/Azure/opendigitaltwins-dtdl/blob/master/DTDL/v3/DTDL.overriding.v1.md).


### QuantitativeTypes extension

The *QuantitativeTypes extension* is used to enable semantic types, unit types, and units in a DTDL v3 model. Its context specifier is `dtmi:dtdl:extension:quantitativeTypes;1`. 

This extension enables the use of many semantic types as adjunct types, which can be added to a CommandRequest, a Field, a MapValue, a Property, or a Telemetry in DTDL v3. Semantic types add one field to the element, `unit`, which accepts a valid unit that corresponds to the semantic type.

For more details about the extension, including examples and a full list of supported semantic types and units, see [QuantitativeTypes extension in the DTDL v3 Language Description](https://github.com/Azure/opendigitaltwins-dtdl/blob/master/DTDL/v3/DTDL.quantitativeTypes.v1.md).

## Service-specific DTDL notes

Not all services that use DTDL implement the exact same features of DTDL. There are some DTDL features that Azure Digital Twins doesn't currently support, including:
* DTDL commands
* The `writable` attribute on properties or relationships. Although this attribute can be set as per DTDL specifications, the value isn't used by Azure Digital Twins. Instead, these attributes are always treated as writable by external clients that have general write permissions to the Azure Digital Twins service.
* The `minMultiplicity` and `maxMultiplicity` properties on relationships. Although these attributes can be set as per DTDL specifications, the values aren't enforced by Azure Digital Twins.

For a DTDL model to be compatible with Azure Digital Twins, it must also meet these requirements:

* All top-level DTDL elements in a model must be of type `Interface`. The reason for this requirement is that Azure Digital Twins model APIs can receive JSON objects that represent either an interface or an array of interfaces. As a result, no other DTDL element types are allowed at the top level.
* DTDL for Azure Digital Twins must not define any commands.
* Azure Digital Twins only allows a single level of component nesting, meaning that an interface that's being used as a component can't have any components itself. 
* Interfaces can't be defined inline within other DTDL interfaces; they must be defined as separate top-level entities with their own IDs. Then, when another interface wants to include that interface as a component or through inheritance, it can reference its ID.

## Modeling tools and best practices

This section describes additional considerations and recommendations for modeling.

### Use existing industry-standard ontologies

An *ontology* is a set of models that comprehensively describe a given domain, like manufacturing, building structures, IoT systems, smart cities, energy grids, web content, and more.

If your solution is for a certain industry that uses any sort of modeling standard, consider starting with a pre-existing set of models designed for your industry instead of designing your models from scratch. Microsoft has partnered with domain experts to create DTDL model ontologies based on industry standards, to help minimize reinvention and encourage consistency and simplicity across industry solutions. You can read more about these ontologies, including how to use them and what ontologies are available now, in [What is an ontology?](concepts-ontologies.md).

### Consider query implications

While designing models to reflect the entities in your environment, it can be useful to look ahead and consider the [query](concepts-query-language.md) implications of your design. You may want to design properties in a way that will avoid large result sets from graph traversal. You may also want to model relationships that will need to be answered in a single query as single-level relationships.

### Validate models

[!INCLUDE [Azure Digital Twins: validate models info](../../includes/digital-twins-validate.md)]

### Upload and delete models in bulk

Once you're finished creating, extending, or selecting your models, you need to upload them to your Azure Digital Twins instance to make them available for use in your solution. 

You can upload many models in a single API call using the [Import Jobs API](concepts-apis-sdks.md#bulk-import-with-the-import-jobs-api). The API can simultaneously accept up to the [Azure Digital Twins limit for number of models in an instance](reference-service-limits.md), and it automatically reorders models if needed to resolve dependencies between them. For detailed instructions and examples that use this API, see [bulk import instructions for models](how-to-manage-model.md#upload-large-model-sets-with-the-import-jobs-api). 

An alternative to the Import Jobs API is the [Model uploader sample](https://github.com/Azure/opendigitaltwins-tools/tree/main/ADTTools#uploadmodels), which uses the individual model APIs to upload multiple model files at once. The sample also implements automatic reordering to resolve model dependencies. It currently only works with [version 2 of DTDL](concepts-models.md#supported-dtdl-versions).

If you need to delete all models in an Azure Digital Twins instance at once, you can use the [Model Deleter sample](https://github.com/Azure/opendigitaltwins-tools/tree/main/ADTTools#deletemodels). This is a project that contains recursive logic to handle model dependencies through the deletion process. It currently only works with [version 2 of DTDL](concepts-models.md#supported-dtdl-versions).

Or, if you want to clear out the data in an instance by deleting all the models **along with** all twins and relationships, you can use the [Delete Jobs API](concepts-apis-sdks.md#bulk-delete-with-the-delete-jobs-api).

### Visualize models

Once you have uploaded models into your Azure Digital Twins instance, you can use [Azure Digital Twins Explorer](https://explorer.digitaltwins.azure.net/) to view them. The explorer contains a list of all models in the instance, as well as a **model graph** that illustrates how they relate to each other, including any inheritance and model relationships.

[!INCLUDE [digital-twins-explorer-dtdl](../../includes/digital-twins-explorer-dtdl.md)]

Here's an example of what a model graph might look like:

:::image type="content" source="media/how-to-use-azure-digital-twins-explorer/model-graph-panel.png" alt-text="Screenshot of Azure Digital Twins Explorer. The Model Graph panel is highlighted." lightbox="media/how-to-use-azure-digital-twins-explorer/model-graph-panel.png":::

For more information about the model experience in Azure Digital Twins Explorer, see [Explore models and the Model Graph](how-to-use-azure-digital-twins-explorer.md#explore-models-and-the-model-graph).

## Next steps

* Learn about creating models based on industry-standard ontologies: [What is an ontology?](concepts-ontologies.md)

* Dive deeper into managing models with API operations: [Manage DTDL models](how-to-manage-model.md)

* Learn about how models are used to create digital twins: [Digital twins and the twin graph](concepts-twins-graph.md)


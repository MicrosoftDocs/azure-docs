---
# Mandatory fields.
title: Modeling objects
description: Understand how Azure Digital Twins uses user-defined models to describe objects within the graph.
author: philmea
ms.author: philmea # Microsoft employees only
ms.date: 2/12/2020
ms.topic: conceptual
ms.service: digital-twins

# Optional fields. Don't forget to remove # if you need a field.
# ms.custom: can-be-multiple-comma-separated
# ms.reviewer: MSFT-alias-of-reviewer
# manager: MSFT-alias-of-manager-or-PM-counterpart
---
# Understand object modeling in Azure Digital Twins

## Here is an info dump.

Modeling
The first step towards the solution is to model the twin types used to represent the hospital. Models for ADT are written in DTDL, a JSON-LD-based, programming language agnostic type description. For example, a patient room, for the purposes of this solution, might be described as:
{
  "@id": "urn:example:PatientRoom:1",
  "@type": "Interface",
  "displayName": "Patient Room",
  "contents": [
    {
      "@type": "Property",
      "name": "visitorCount",
      "schema": "double"
    },
    {
      "@type": "Property",
      "name": "handWashCount",
      "schema": "double"
    },
    {
      "@type": "Property",
      "name": "handWashPercentage",
      "schema": "double"
    },

    {
      "@type": "Relationship",
      "name": "hasDevices"
    }
  ],
  "@context": "http://azure.com/v3/contexts/Model.json"
}
This description defines a name and a unique id for the patient room, a few properties to represent handwash status (counters that will be updated from motion sensors and soap dispensers, as well as a computed “handwash percentage” property). The type also defines a relationship “hasDevices” that will be used to connect to the actual devices.
In a similar manner, types for the hospital itself, as well as hospital wards or zones can be defined.

- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

Interfaces
Model descriptions in DTDL are called interfaces. An interface describes a model in terms of:
	Properties. Properties are data fields that represent the state of an entity, just like in most object-oriented languages. Unlike telemetry, which is just a data event, properties have backing storage and can be read at any time.
	Telemetry. Telemetry fields represent measurements or events. Measurement are typically used for the equivalent of sensor readings. Telemetry is not stored on a twin – it is effectively sent as a stream of data events.
	Commands. Commands represent methods can be executed on the digital twin. An example would be a reset command, or a command to switch a fan on or off. Command descriptions include command parameters and return values.
	Relationships. Relationships lets you model how a given twin is related to other twins. Relationships can represent different semantic meanings, such as “floor contains room”, “hvac cools rooms”, “Compressor is-billed-to user” etc. Using relationships, digital twins solutions construct a graph of interrelated twins. 
	Components. A component lets you build your model as an assembly of other interfaces. Use a component to describe something that is an integral part of your model, and that does not need to be created, deleted or re-arranged in your topology of twins independently. 
In contrast, use independent twins connected by a relationship when you want both parts to have an independent existence in the graph.
Example that shows how to think about relationships versus components
A simple example model: [TBA – should probably be a model that exposes a command too]
{
    "@id": "dtmi:com:example:Planet",
    "@type": "Interface",
    "contents": [
        {
            "@type": "Property",
            "name": "name",
            "schema": "string"
        },
        {
            "@type": "Property"
            "name": "mass",
            "schema": "double"
        },
        {
            "@type": "Relationship",
            "name": "satellites",
            "target": "dtmi:com:example:Moon"
        },
        {
            "@type": "Telemetry",
            "name": "locationOfCenterOfMass",
            "schema": "ex:CelestialCoordinate"
        }
    ]
}
As the example shows, all content of an interface is described in the “contents” section of the DTDL file as an array of attribute definitions, where each attribute has a type (telemetry, property, relationship, etc.) and a set of properties that define the actual attribute (e.g. name and schema to define a property).

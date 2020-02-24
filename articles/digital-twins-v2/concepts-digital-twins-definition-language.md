---
# Mandatory fields.
title: DTDL modeling language
titleSuffix: Azure Digital Twins
description: Learn more details about DTDL, the language used by Azure Digital Twins to define object models.
author: baanders
ms.author: baanders # Microsoft employees only
ms.date: 2/21/2020
ms.topic: conceptual
ms.service: digital-twins

# Optional fields. Don't forget to remove # if you need a field.
# ms.custom: can-be-multiple-comma-separated
# ms.reviewer: MSFT-alias-of-reviewer
# manager: MSFT-alias-of-manager-or-PM-counterpart
---

# Digital Twin Definition Language (DTDL) for modeling

Digital twin models for Azure Digital Twins are defined using the **Digital Twin Definition Language (DTDL)**. DTDL is written in JSON-LD and is programming language independent.

## DTDL in IoT Plug and Play

DTDL is also used as part of [Azure IoT Plug and Play](../iot-pnp/overview-iot-plug-and-play.md). Developers of Plug and Play (PnP) devices use a subset of the same description language used for twins. The DTDL version used for PnP is semantically a subset of DTDL for Azure Digital Twins: Every CapabilityModel as defined by PnP is also a valid interface for use in Azure Digital Twins. 

For more information about pure DTDL, see its [reference documentation](https://github.com/Azure/IoTPlugandPlay/tree/master/DTDL).

The remainder of this article describes DTDL as used in Azure Digital Twins.

## Writing in DTDL

DTDL models can be created in any text editor. They can be stored with the extension *.json*. As DTDL uses JSON syntax, using the *.json* extension will enable most programming text editors to automatically provide basic syntax checking and highlighting for DTDL. 
A richer DTDL editing experience will be available in Visual Studio Code and Visual Studio.

DTDL constraints while in preview:
* While the DTDL language specification allows for inline definitions of interfaces, this is not supported in the current version of the Azure Digital Twins service.
* Azure Digital Twins does not support complex type definitions in separate documents, or as inline definitions. Complex types must be defined in a `schemas` section within an interface document. The definitions are only valid within the interface they are part of.
* Azure Digital Twins currently only allows a single level of component nesting. That is, interfaces used as components must not themselves use components. 
* Azure Digital Twins does not currently support the execution of commands on twins you model and instantiate. You can, however, execute commands on devices.
* Azure Digital Twins does not support stand-alone relationships (that is, relationships defined as independent types). All relationships must be defined inline in a model type.

## DTDL data types

Property and telemetry values can be of standard primitive types — `integer`, `double`, `string`, and `Boolean` — and others such as `DateTime` and `Duration`. 

In addition to primitive types, property and telemetry fields can have the following four complex types:
* `Object`
* `Array`
* `Map`
* `Enum`

## Next steps

Learn more about how DTDL models represent objects:
* [Model an object](concepts-models.md)

Or, see how a model is managed with Model Management APIs:
* [Manage an object model](how-to-manage-model.md)
---
# Mandatory fields.
title: DTDL modeling language
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

Digital twin models for Azure Digital Twins (ADT) are defined using the **Digital Twin Definition Language (DTDL)**. DTDL is written in JSON-LD and is programming language independent.

### DTDL in ADT versus DTDL in IoT Plug and Play

DTDL is also used as part of [Azure IoT Plug and Play](../iot-pnp/overview-iot-plug-and-play.md). Developers of Plug and Play (PnP) devices use a subset of the same description language used for twins. This article describes DTDL as used in ADT.

> [!NOTE]
> please see Add reference to PnP DTDL specs.

The DTDL version used for PnP is semantically a subset of DTDL for ADT: Every CapabilityModel as defined by PnP is also a valid interface for use in ADT.  

## Writing in DTDL

DTDL models can be created in any text editor. They can be stored with the extension *.json*. As DTDL uses JSON syntax, using the *.json* extension will enable most programming text editors to automatically provide basic syntax checking and highlighting for DTDL. 
A richer DTDL editing experience will be available in Visual Studio Code and Visual Studio.

DTDL constraints while in preview:
* While the DTDL language specification allows for inline definitions of interfaces, this is not supported in the current version of the ADT service.
* ADT does not support complex type definitions in separate documents, or as inline definitions. Complex types must be defined in a `schemas` section within an interface document. The definitions are only valid within the interface they are part of.
* ADT currently only allows a single level of component nesting. That is, interfaces used as components must not themselves use components. 
* ADT does not yet support the execution of commands on twins you model and instantiate. You can, however, execute commands on devices.
* ADT does not support stand-alone relationships (that is, relationships defined as independent types). All relationships must be defined inline in a model type.

## DTDL Data Types

Property and telemetry values can be of standard primitive types — `integer`, `double`, `string`, and `Boolean` — and others such as `DateTime` and `Duration`. 

> [!NOTE]
> Insert Reference to DTDL documentation for complete information.

> [!NOTE]
> Add information on mandatory versus optional properties

In addition to primitive types, property and telemetry fields can have the following four complex types:
* `Object`
* `Array`
* `Map`
* `Enum`



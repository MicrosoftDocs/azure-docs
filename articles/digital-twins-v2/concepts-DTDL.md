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

# Digital Twins Definition Language (DTDL) for modeling

Digital Twin models for ADT are defined using the Digital Twin Description Language (DTDL). DTDL is written in JSON-LD and programming language independent.  
This section provides conceptual information on DTDL. 

> [!WARNING]
> Please see the DTDL reference [Add Link to DTDL specification] for more details on DTDL. 

### DTDL in ADT versus DTDL in Plug and Play

DTDL is also used as part of Azure IoT Plug and Play. Developers of Plug and Play devices use a subset of the same description language used for twins. This document describes DTDL as used in ADT, please see Add reference to PnP DTDL specs.
The DTDL version used for Plug and Play is semantically a subset of DTDL for ADT: Every CapabilityModel as defined by PnP is also a valid interface for use in ADT.  

## Writing in DTDL

DTDL models can be created in any text editor. They can be stored with the extension .json. As DTDL uses JSON syntax, using the .json extension will enable most programming text editors to automatically provide basic syntax checking and highlighting for DTDL. 
A richer DTDL editing experience will be available in Visual Studio Code and Visual Studio.

DTDL constraints in the current release
* While the DTDL language specification allows for inline definitions of interfaces, this is not supported in this version of the ADT service.
* ADT does not support complex type definitions in separate documents, or as inline definitions. Complex types must be defined in a “schemas” section within an interface document (see the DTDL reference documentation [TBD] for more information). The definitions are only valid within the interface they are placed in.
* ADT currently only allows a single level of component nesting. That is, interfaces used as components must not themselves use components. 
* ADT does not yet support the execution of commands on twins you model and instantiate. You can, however, execute commands on devices.
* ADT does not support stand-alone relationships (i.e. relationships defined as independent types). All relationships have to be defined inline in a model type.

## DTMI (public preview)

DTDL models are identified using a custom IRI/URI scheme registered with the IANA. A DTMI has three components: scheme, path, and version. Scheme and path are separated by a colon; path and version are separated by a semicolon:
`<scheme> : <path> ; <version>`

The scheme is the string literal “dtmi” in lowercase. The path is a sequence of one or more segments, separated by colons. The version is a sequence of one or more digits.
All path components that begin with an underscore (“_”) are reserved system namespaces. You must not use the underscore character to begin the path or any segment of it. 
We strongly recommend using reverse internet addresses as namespaces in DTMI. For example, any dtmi published by Contoso Corp, which has the domain name *www.contosocorp.com*, should start with *dtmi:com:contosocorp:*. For example, `dtmi:com:contosocorp:IoT:devices:X500;1`

## DTDL Data Types

Property and telemetry values can be of standard primitive types – integer, double, string and Boolean and others, such as DateTime and Duration. 

> [!WARNING]
> See Reference to DTDL documentation for complete information.

> [!NOTE]
> Add information on mandatory versus optional properties

In addition to primitive types, property and telemetry fields can have the following four complex types:
* Object
* Array
* Map
* Enum



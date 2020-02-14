---
# Mandatory fields.
title: Using the Azure Digital Twins graph
description: Understand the graph aspect of Azure Digital Twins, and how to query the graph for information.
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
# Understand how to use the Azure Digital Twins graph

## Here is an info dump.

Digital Twins Graph
As discussed above, at the heart of Digital Twins is a graph constructed from twins and relationships. Every twin in the graph is an instance of a model. Think of a model as a template that describes the characteristics of a particular type of twin in terms of properties, telemetry/events, commands etc. 
Twins are connected via relationships, forming a graph. The model definition for each twin declares which relationships are possible between twins. For example, a Floor twin might have a “contains” relationship that allows it to connect to several instances of Room. A cooling device might have a “cools” relationship with a motor.  

- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

Creating a Graph
Once we have a set of types, we can create a graph representing a complete hospital. For a small hospital, this graph might look like this:
#picture

*Would probably be useful to have a sample scenario and show what the graph would look like.

*Mention there's no built-in visualization right now
 
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

*Details of the query language
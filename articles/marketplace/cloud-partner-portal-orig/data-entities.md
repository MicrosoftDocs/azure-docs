---
title: Data Entities 
description: An overview of data entities.
services: Azure, Marketplace, Cloud Partner Portal, 

author: pbutlerm
manager: Ricardo.Villalobos  



ms.service: marketplace



ms.topic: conceptual
ms.date: 09/13/2018
ms.author: pabutler
---

# Data Entities

This article defines and provides an overview of data entities. It includes information about the capabilities of data entities, the
scenarios that they support, the categories that are used for them, and the methods for creating them.

## Overview

A data entity is an abstraction from the physical implementation of
database tables. For example, in normalized tables, much of the data
for each customer might be stored in a customer table, and then the rest might be spread across a small set of related tables. In this case, the data entity for the customer concept appears as one de-normalized view, in which each row contains all the data from the customer table and its related tables. A data entity encapsulates a business concept into a format that makes development and integration easier. The abstracted nature of a data entity can simplify application development and customization. Later, the abstraction also insulates application code from the inevitable churn of the physical tables between versions.

To summarize: Data entity provides conceptual abstraction and encapsulation (de-normalized view) of underlying table schemas to represent key data concepts and functionalities.

## Capabilities

A data entity has the following capabilities:

- It replaces diverging and fragmented concepts of AXD, Data
    Import/Export Framework (DIXF) entities, and aggregate queries with
    single concept.
- It provides a single stack to capture business logic, and to enable
    scenarios such as import/export, integration, and programmability.
- It becomes the primary mechanism for exporting and importing data
    packages for Application Lifecycle Management (ALM) and demo data
    scenarios.
- It can be exposed as OData services, and then used in tabular-style
    synchronous integration scenarios and Microsoft Office integrations.

See [Data Entities](https://docs.microsoft.com/dynamics365/operations/dev-itpro/data-entities/data-entities) for more info.

---
# Mandatory fields.
title: Use the Azure Digital Twins APIs
titleSuffix: Azure Digital Twins
description: Understand details of the Azure Digital Twins API surface
author: baanders
ms.author: baanders # Microsoft employees only
ms.date: 3/12/2020
ms.topic: how-to
ms.service: digital-twins

# Optional fields. Don't forget to remove # if you need a field.
# ms.custom: can-be-multiple-comma-separated
# ms.reviewer: MSFT-alias-of-reviewer
# manager: MSFT-alias-of-manager-or-PM-counterpart
---

# Developer overview of Azure Digital Twins APIs

This article gives a brief overview of the API surface of Azure Digital Twins. 
The Azure Digital Twins API surface can be broadly divided into the following categories: 

* **Model Management APIs** - The Model Management APIs are used to manage the [twin types](concepts-models.md) in an Azure Digital Twins instance. Management activities include upload, validation, and retrieval of twin types authored in DTDL.
* **Twin APIs** - The Twin APIs let developers create, modify, and delete [digital twins](concepts-twins-graph.md) and their relationships in an Azure Digital Twins instance.
* **Query APIs** - The Query APIs let developers [find sets of digital twins in the twin graph](concepts-query-graph.md) across relationships, by applying filters.
* **Event and Routing APIs** - The Event APIs let developers [wire up event flow](concepts-route-events.md) through the system, as well as to downstream services.

## Azure Digital Twins SDKs (preview)

During preview, to generate an SDK for the language of your choice, use [AutoRest](https://github.com/Azure/autorest) with the Azure Digital Twins [Swagger](https://msazure.visualstudio.com/One/_git/Azure-IoT-DigitalTwins-Main?path=%2Fproducts%2Fswagger%2Fexternal-data-plane%2Fpreview%2F2020-03-01-preview%2Fdigitaltwins.json&version=GBmaster&_a=contents).

## Next steps

See how to use the APIs to manage twin types, digital twins, and twin graphs:
* [Manage a twin type](how-to-manage-model.md)
* [Manage an individual digital twin](how-to-manage-twin.md)
* [Manage a twin graph](how-to-manage-graph.md)
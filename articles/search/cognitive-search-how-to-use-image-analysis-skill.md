---
title: Image analysis skills
titleSuffix: Azure Cognitive Search
description: Use the Image Analysis skill in an enrichment pipeline to create searchable text from images.

author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.topic: how-to
ms.date: 12/14/2021
---

# Use image analysis in a skillset

TBD

Billable

## Prerequisites

Image files or embedded images in a supported data source. The data source used by the indexer provides the connection string.

Cognitive Services

## Configure indexer parameters

imageaction

Blob indexer -> "parsingMode": "default"

## Add an image analysis skill

## Add fields

## Add output field mappings

Now that you have defined skill outputs and search fields, specify the mapping in the "outputFieldMappings" section of the indexer definition

## Run the indexer

## Evaluate results

1. Check indexer execution history. "Could not execute skill" messages appear when files do not contain images, or images do not contain text.

1. Check content by using Search Explorer or another client to query the search index for the following fields:

## See also



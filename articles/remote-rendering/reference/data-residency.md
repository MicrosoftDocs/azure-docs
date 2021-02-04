---
title: Data Residency
description: Describes data residency when using Azure Remote Rendering
author: rapete
ms.author: rapete
ms.date: 02/04/2021
ms.topic: reference
---

# Azure Remote Rendering Data Residency 
This article explains the concept of data residency and how it applies to Azure Remote Rendering. 

## Data Residency 
Azure Remote Rendering uses user provided Azure Blob containers for model storage. When the model is not in use, it stays in the user provided Azure Blob Storage region. When the model is used for rendering, the data is copied to the region the user chooses when starting the rendering session.

## Next Steps
If you want to learn how to setup an Azure Blob Storage container for Azure Remote Rendering, check out [Convert a model for rendering](../quickstarts/convert-model.md).

---
title: Data Residency
description: Describes data residency when using Azure Remote Rendering
author: rapete
ms.author: rapete
ms.date: 02/03/2021
ms.topic: reference
---
# Data Residency
Azure Remote Rendering uses user provided Azure Blob containers for model storage. When the model is not in use, it stays in the user provided Azure Blob Storage region. When the model is used for rendering, the data is copied to the region the user chooses when starting the rendering session.

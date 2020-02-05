---
title: The model conversion REST API
description: Describes how to convert a model via the REST API
author: FlorianBorn71
ms.author: flborn
ms.date: 02/04/2020
ms.topic: how-to
---

# The model conversion REST API

The [model conversion](model-conversion.md) service is controlled through a [REST API](https://en.wikipedia.org/wiki/Representational_state_transfer). This article describes the conversion service API details.

## Environments

The following environments are available:

| Environment | Base URL |
|-----------|:-----------|
| Production West US 2 | `https://remoterendering.westus2.mixedreality.azure.com` |
| Production West Europe | `https://remoterendering.westeurope.mixedreality.azure.com` |

## Common headers

### Common request headers

These headers must be specified for all requests:

- The **Authorization** header must have the value of "Bearer [*TOKEN*]", where [*TOKEN*] is a [service access token](../tokens.md).

### Common response headers

All responses contain these headers:

- The **MS-CV** header contains a unique string that can be used to trace the call within the service.

## Endpoints

The conversion service provides two REST API endpoints to:

- start model conversion
- poll the conversion progress

### Start conversion

| Endpoint | Method |
|-----------|:-----------|
| /v1/accounts/**accountID**/models/create | POST |

Returns the ID of the created model, wrapped in a JSON document. The field name is "modelId".

#### Request body

- **modelName** (*string*): Path to the model in the input container
- **modelUrl** (*string*): Input container SAS url
- **assetContainerUrl** (*string*): Output container SAS url

### Poll conversion status

| Endpoint | Method |
|-----------|:-----------|
| /v1/accounts/**accountID**/models/**modelId**/status | GET |

Returns a JSON document with a "status" field that can have the following values:

- "Running"
- "Success"
- "Failure"

## Next steps

- [Using Azure Blob Storage for model conversion](blob-storage.md)
- [Model conversion](model-conversion.md)

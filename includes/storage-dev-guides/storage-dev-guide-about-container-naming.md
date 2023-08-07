---
title: "include file"
description: "include file"
services: storage
author: pauljewellmsft
ms.service: azure-storage
ms.topic: include
ms.date: 08/03/2023
ms.author: pauljewell
ms.custom: include file
---

## About container naming

A container name must be a valid DNS name, as it forms part of the unique URI used to address the container or its blobs. Follow these rules when naming a container:

- Container names can be between 3 and 63 characters long.
- Container names must start with a letter or number, and can contain only lowercase letters, numbers, and the dash (-) character.
- Consecutive dash characters aren't permitted in container names.

The URI for a container resource is formatted as follows:

`https://my-account-name.blob.core.windows.net/my-container-name`
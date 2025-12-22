---
title: Include file
description: Include file
author: dominicbetts
ms.topic: include
ms.date: 10/28/2025
ms.author: dobett
---

A deployed instance of Azure IoT Operations with resource sync rules enabled. To enable resource sync rules run the following command on your Azure IoT Operations instance. This command also sets the required permissions on the custom location:

```bash
az iot ops enable-rsync -n <my instance> -g <my resource group>
```

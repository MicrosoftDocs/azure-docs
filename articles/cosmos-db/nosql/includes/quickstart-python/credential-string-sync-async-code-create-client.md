---
title: "include file"
description: "include file"
services: cosmosdb
author: diberry
ms.service: cosmosdb
ms.topic: include
ms.date: 01/23/2023
ms.author: diberry
ms.custom: include file
---

#### [Sync](#tab/sync)

:::code language="python" source="~/cosmos-db-nosql-python-samples/001-quickstart/app_cred.py" id="create_client":::

#### [Async](#tab/async)

> [!IMPORTANT]
> Put the client instance in a coroutine function named `manage_cosmos`. Within the coroutine function, define the new client with the `async with` keywords. Outside of the coroutine function, use the `asyncio.run` function to execute the coroutine asynchronously.

:::code language="python" source="~/cosmos-db-nosql-python-samples/002-quickstart-async/app_cred.py" range="25-27":::

:::code language="python" source="~/cosmos-db-nosql-python-samples/002-quickstart-async/app_cred.py" range="67":::

---

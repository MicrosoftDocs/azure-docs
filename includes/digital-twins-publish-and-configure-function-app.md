---
author: baanders
description: include file to publish and configure the function app
ms.service: digital-twins
ms.topic: include
ms.date: 03/15/2021
ms.author: baanders
---

For instructions on how to do this, see the section [**Publish the function app to Azure**](../articles/digital-twins/how-to-create-azure-function.md#publish-the-function-app-to-azure) of the *How-to: Set up a function for processing data* article.

> [!IMPORTANT]
> When creating the function app for the first time in the [Prerequisites](#prerequisites) section, you may have already assigned an access role for the function and configured the application settings for it to access your Azure Digital Twins instance. These need to be done once for the entire function app, so verify they've been completed in your app before continuing. You can find instructions in the [**Set up security access for the function app**](../articles/digital-twins/how-to-create-azure-function.md#set-up-security-access-for-the-function-app) of the *How to: Ingest IoT hub data article.*
---
author: dominicbetts
ms.author: dobett
ms.service: iot-central
ms.topic: include
ms.date: 05/22/2023
---

Managed identities are more secure because:

- You don't store the credentials for your resource in a connection string in your IoT Central application.
- The credentials are automatically tied to the lifetime of your IoT Central application.
- Managed identities automatically rotate their security keys regularly.

IoT Central currently uses [system-assigned managed identities](../articles/active-directory/managed-identities-azure-resources/overview.md#managed-identity-types).

When you configure a managed identity, the configuration includes a *scope* and a *role*:

- The scope defines where you can use the managed identity. For example, you can use an Azure resource group as the scope. In this case, both the IoT Central application and the destination must be in the same resource group.
- The role defines what permissions the IoT Central application is granted in the destination service. For example, for an IoT Central application to send data to an event hub, the managed identity needs the **Azure Event Hubs Data Sender** role assignment.

The following video provides more information about system assigned managed identities:

> [!VIDEO https://aka.ms/docs/player?id=f095aa41-1f78-4807-807d-baf5555365eb]

> [!CAUTION]
> To export to blob storage, don't use the **Storage Account Contributor** as shown in the video. Use the **Storage Blob Data Contributor** role instead.

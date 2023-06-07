---
author: baanders
description: include file describing a code solution to the cross-tenant limitation with Azure Digital Twins
ms.service: digital-twins
ms.topic: include
ms.date: 12/07/2022
ms.author: baanders
---

The following example shows how to set a sample tenant ID value for `InteractiveBrowserTenantId` in the `DefaultAzureCredential` options:

:::code language="csharp" source="~/digital-twins-docs-samples/sdks/csharp/authentication.cs" id="DefaultAzureCredential_options":::

There are similar options available to set a tenant for authentication with Visual Studio and Visual Studio Code. For more information on the options available, see the [DefaultAzureCredentialOptions documentation](/dotnet/api/azure.identity.defaultazurecredentialoptions?view=azure-dotnet&preserve-view=true).
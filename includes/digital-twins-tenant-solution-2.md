---
author: baanders
description: include file describing a code solution to the cross-tenant limitation with Azure Digital Twins
ms.service: digital-twins
ms.topic: include
ms.date: 4/13/2021
ms.author: baanders
---

The following example shows how to set a tenant ID value for `InteractiveBrowserTenantId` in the `DefaultAzureCredential` options:

:::image type="content" source="../articles/digital-twins/media/troubleshoot-error-404/defaultazurecredentialoptions.png" alt-text="Screenshot of code showing the DefaultAzureCredentialOptions method. The value of InteractiveBrowserTenantId is set to a sample tenant ID value.":::

There are similar options available to set a tenant for authentication with Visual Studio and Visual Studio Code. For more information on the options available, see the [DefaultAzureCredentialOptions documentation](/dotnet/api/azure.identity.defaultazurecredentialoptions?view=azure-dotnet&preserve-view=true).
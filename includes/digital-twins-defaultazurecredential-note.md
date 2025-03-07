---
author: baanders
description: include file for adding a note about the known issue with DefaultAzureCredential
ms.service: azure-digital-twins
ms.topic: include
ms.date: 03/04/2025
ms.author: baanders
---

>[!NOTE]
>There's currently a known issue affecting the `DefaultAzureCredential` wrapper class that might result in an error while authenticating. If you encounter this issue, you can try instantiating `DefaultAzureCredential` with the following optional parameter to resolve it: `new DefaultAzureCredential(new DefaultAzureCredentialOptions { ExcludeSharedTokenCacheCredential = true });`
>
>For more information about this issue, see [Azure Digital Twins known issues](../articles/digital-twins/troubleshoot-known-issues.md#issue-with-default-azure-credential-authentication-on-azureidentity-130).

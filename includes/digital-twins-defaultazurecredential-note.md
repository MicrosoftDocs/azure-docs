---
author: baanders
description: include file for adding a note about the known issue with DefaultAzureCredential
ms.service: digital-twins
ms.topic: include
ms.date: 2/21/2022
ms.author: baanders
---

>    [!NOTE]
>    There's currently a known issue with the `DefaultAzureCredential` wrapper class. This wrapper contains several methods of authentication that are tried in order. Once the wrapper reaches the `SharedTokenCacheCredential` method, it may throw an error. For more information about this issue, see [troubleshooting known issues](../articles/digital-twins/troubleshoot-known-issues.md#issue-with-default-azure-credential-authentication-on-azureidentity-130).
>
>    A possible workaround is to exclude the `SharedTokenCacheCredential` method from getting triggered when using the `DefaultAzureCredential` wrapper class by instantiating it with the following optional parameter:
>
>    `new DefaultAzureCredential(new DefaultAzureCredentialOptions { ExcludeSharedTokenCacheCredential = true });`
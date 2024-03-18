---
author: pgrandhi
ms.service: azure-communication-services
ms.custom:
ms.topic: include
ms.date: 01/27/2024
ms.author: pgrandhi
---

## Register the Event Grid resource provider

This article describes how to register the Event Grid Resource Provider. If you used Event Grid before in the same subscription, skip to the next section.

1. Run the following command:

```PowerShell
Register-AzResourceProvider -ProviderNamespace Microsoft.EventGrid
```

2. It may take a moment for the registration to finish. To check the status, run:

```PowerShell
Get-AzResourceProvider -ProviderNamespace Microsoft.EventGrid
```

When `RegistrationStatus` is `Registered`, you're ready to continue.

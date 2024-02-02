---
author: pgrandhi
ms.service: azure-communication-services
ms.custom: devx-track-azurepowershell
ms.topic: include
ms.date: 01/27/2024
ms.author: pgrandhi
---

## Register the event grid resource provider

If you have not previously used Event Grid in your Azure subscription, you may need to register the Event Grid resource provider. Run the following command:

```PowerShell
Register-AzResourceProvider -ProviderNamespace Microsoft.EventGrid
```

It may take a moment for the registration to finish. To check the status, run:

```PowerShell
Get-AzResourceProvider -ProviderNamespace Microsoft.EventGrid
```

When `RegistrationStatus` is `Registered`, you're ready to continue.

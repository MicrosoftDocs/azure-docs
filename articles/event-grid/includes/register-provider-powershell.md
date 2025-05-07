---
 title: include file
 description: include file
 author: spelluru
 ms.service: azure-event-grid
 ms.topic: include
 ms.date: 07/05/2018
 ms.author: spelluru
ms.custom: include file
---

## Enable Event Grid resource provider

If you haven't previously used Event Grid in your Azure subscription, you may need to register the Event Grid resource provider. Run the following command:

```azurepowershell-interactive
Register-AzResourceProvider -ProviderNamespace Microsoft.EventGrid
```

It may take a moment for the registration to finish. To check the status, run:

```azurepowershell-interactive
Get-AzResourceProvider -ProviderNamespace Microsoft.EventGrid
```

When `RegistrationStatus` is `Registered`, you're ready to continue.

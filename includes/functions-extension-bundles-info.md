---
author: ggailey777
ms.service: azure-functions
ms.topic: include
ms.date: 02/09/2020
ms.author: glenga
---

::: zone pivot="programming-language-python,programming-language-javascript,programming-language-powershell,programming-language-typescript"  
> [!TIP]
> During startup, the host downloads and installs the [Storage binding extension](../articles/azure-functions/functions-bindings-storage-queue.md#functions-2x-and-higher) and other Microsoft binding extensions. This installation happens because binding extensions are enabled by default in the *host.json* file with the following properties:
>
> ```json
> {
>     "version": "2.0",
>     "extensionBundle": {
>         "id": "Microsoft.Azure.Functions.ExtensionBundle",
>         "version": "[1.*, 2.0.0)"
>     }
> }
> ```
>
> If you encounter any errors related to binding extensions, check that the above properties are present in *host.json*.
::: zone-end  
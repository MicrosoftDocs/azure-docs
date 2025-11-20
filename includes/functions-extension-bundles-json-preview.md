---
author: ggailey777
ms.service: azure-functions
ms.topic: include
ms.date: 09/01/2025
ms.author: glenga
---
## Install bundle

To be able to use this preview binding extension in your app, you must reference a preview extension bundle that includes it. 

Add or replace the following code in your `host.json` file, which specifically targets the latest [preview version of the 4.x bundle](https://github.com/Azure/azure-functions-extension-bundles/releases?q=preview+NOT+experimental&expanded=true):

```json
{
  "version": "2.0",
  "extensionBundle": {
    "id": "Microsoft.Azure.Functions.ExtensionBundle.Preview",
    "version": "[4.0.0, 5.0.0)"
  }
}
``` 

Select the previous link to verify that the latest preview bundle version does contain the preview extension.  
---
author: ggailey777
ms.service: azure-functions
ms.topic: include
ms.date: 11/14/2019
ms.author: glenga
---

```json
{
    "version": "2.0",
    "extensionBundle": {
        "id": "Microsoft.Azure.Functions.ExtensionBundle",
        "version": "[1.*, 2.0.0)"
    }
}
```

The following properties are available in `extensionBundle`:

| Property | Description |
| -------- | ----------- |
| id | The namespace for Microsoft Azure Functions extension bundles. |
| version | The version of the bundle to install. The Functions runtime always picks the maximum permissible version defined by the version range or interval. The version value above allows all bundle versions from 1.0.0 up to but not including 2.0.0. For more information, see the [interval notation for specifying version ranges](/nuget/reference/package-versioning#version-ranges). |

Bundle versions increment as packages in the bundle change. Major version changes occur when packages in the bundle increment by a major version. Major version changes in the bundle usually coincide with a change in the major version of the Functions runtime.  

The current set of extensions installed by the default bundle is enumerated in this [extensions.json file](https://github.com/Azure/azure-functions-extension-bundles/blob/dev/src/Microsoft.Azure.Functions.ExtensionBundle/extensions.json).

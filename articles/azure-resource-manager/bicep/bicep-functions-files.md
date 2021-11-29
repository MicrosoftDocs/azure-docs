---
title: Bicep functions - files
description: Describes the functions to use in a Bicep file to load content from a file.
ms.topic: conceptual
ms.date: 09/30/2021
---

# File functions for Bicep

This article describes the Bicep functions for loading content from external files.

## loadFileAsBase64

`loadFileAsBase64(filePath)`

Loads the file as a base64 string.

Namespace: [sys](bicep-functions.md#namespaces-for-functions).

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| filePath | Yes | string | The path to the file to load. The path is relative to the deployed Bicep file. |

### Remarks

Use this function when you have binary content you would like to include in deployment. Rather than manually encoding the file to a base64 string and adding it to your Bicep file, load the file with this function. The file is loaded when the Bicep file is compiled to a JSON template. During deployment, the JSON template contains the contents of the file as a hard-coded string.

This function requires **Bicep version 0.4.412 or later**. 

The maximum allowed size of the file is **96 Kb**.

### Return value

The file as a base64 string.

## loadTextContent

`loadTextContent(filePath, [encoding])`

Loads the content of the specified file as a string. 

Namespace: [sys](bicep-functions.md#namespaces-for-functions).

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| filePath | Yes | string | The path to the file to load. The path is relative to the deployed Bicep file. |
| encoding | No | string | The file encoding. The default value is `utf-8`. The available options are: `iso-8859-1`, `us-ascii`, `utf-16`, `utf-16BE`, or `utf-8`.  |

### Remarks

Use this function when you have content that is more stored in a separate file. Rather than duplicating the content in your Bicep file, load the content with this function. For example, you can load a deployment script from a file. The file is loaded when the Bicep file is compiled to the JSON template. During deployment, the JSON template contains the contents of the file as a hard-coded string.

When loading a JSON file, you can use the [json](bicep-functions-object.md#json) function with the loadTextContent function to create a JSON object. In VS Code, the properties of the loaded object are available intellisense. For example, you can create a file with values to share across many Bicep files. An example is shown in this article.

This function requires **Bicep version 0.4.412 or later**.

The maximum allowed size of the file is **131,072 characters**, including line endings.

### Return value

The contents of the file as a string.

### Examples

The following example loads a script from a file and uses it for a deployment script.

::: code language="bicep" source="~/azure-docs-bicep-samples/syntax-samples/functions/loadTextContent/loaddeploymentscript.bicep" highlight="13" :::

In the next example, you create a JSON file that contains values you want to use for a network security group.

::: code language="json" source="~/azure-docs-bicep-samples/syntax-samples/functions/loadTextContent/nsg-security-rules.json" :::

You load that file and convert it to a JSON object. You use the object to assign values to the resource.

::: code language="bicep" source="~/azure-docs-bicep-samples/syntax-samples/functions/loadTextContent/loadsharedrules.bicep" highlight="3,13-21" :::

You can reuse the file of values in other Bicep files that deploy a network security group.

## Next steps

* For a description of the sections in a Bicep file, see [Understand the structure and syntax of Bicep files](./file.md).

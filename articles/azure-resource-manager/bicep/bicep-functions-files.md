---
title: Bicep functions - files
description: Describes the functions to use in a Bicep file to load content from a file.
ms.topic: conceptual
ms.custom: devx-track-bicep
ms.date: 11/03/2023
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
| filePath | Yes | string | The path to the file to load. The path is relative to the deployed Bicep file. It can't include variables. |

### Remarks

Use this function when you have binary content you would like to include in deployment. Rather than manually encoding the file to a base64 string and adding it to your Bicep file, load the file with this function. The file is loaded when the Bicep file is compiled to a JSON template. You can't use variables in the file path because they haven't been resolved when compiling to the template. During deployment, the JSON template contains the contents of the file as a hard-coded string.

This function requires [Bicep CLI version 0.4.X or higher](./install.md).

The maximum allowed size of the file is **96 Kb**.

### Return value

The file as a base64 string.

## loadJsonContent

`loadJsonContent(filePath, [jsonPath], [encoding])`

Loads the specified JSON file as an Any object.

Namespace: [sys](bicep-functions.md#namespaces-for-functions).

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| filePath | Yes | string | The path to the file to load. The path is relative to the deployed Bicep file. It can't include variables. |
| jsonPath | No | string | JSONPath expression to specify that only part of the file is loaded. |
| encoding | No | string | The file encoding. The default value is `utf-8`. The available options are: `iso-8859-1`, `us-ascii`, `utf-16`, `utf-16BE`, or `utf-8`.  |

### Remarks

Use this function when you have JSON content or minified JSON content that is stored in a separate file. Rather than duplicating the JSON content in your Bicep file, load the content with this function. You can load a part of a JSON file by specifying a JSON path. The file is loaded when the Bicep file is compiled to the JSON template. You can't include variables in the file path because they haven't been resolved when compiling to the template. During deployment, the JSON template contains the contents of the file as a hard-coded string.

In VS Code, the properties of the loaded object are available intellisense. For example, you can create a file with values to share across many Bicep files. An example is shown in this article.

This function requires [Bicep CLI version 0.7.X or higher](./install.md).

The maximum allowed size of the file is **1,048,576 characters**, including line endings.

### Return value

The contents of the file as an Any object.

### Examples

The following example creates a JSON file that contains values for a network security group.

::: code language="json" source="~/azure-docs-bicep-samples/syntax-samples/functions/loadJsonContent/nsg-security-rules.json" :::

You load that file and convert it to a JSON object. You use the object to assign values to the resource.

::: code language="bicep" source="~/azure-docs-bicep-samples/syntax-samples/functions/loadJsonContent/loadsharedrules.bicep" highlight="3,12" :::

You can reuse the file of values in other Bicep files that deploy a network security group.

## loadYamlContent

`loadYamlContent(filePath, [pathFilter], [encoding])`

Loads the specified YAML file as an Any object.

Namespace: [sys](bicep-functions.md#namespaces-for-functions).

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| filePath | Yes | string | The path to the file to load. The path is relative to the deployed Bicep file. It can't include variables. |
| pathFilter | No | string | The path filter is a JSONPath expression to specify that only part of the file is loaded. |
| encoding | No | string | The file encoding. The default value is `utf-8`. The available options are: `iso-8859-1`, `us-ascii`, `utf-16`, `utf-16BE`, or `utf-8`.  |

### Remarks

Use this function when you have YAML content or minified YAML content that is stored in a separate file. Rather than duplicating the YAML content in your Bicep file, load the content with this function. You can load a part of a YAML file by specifying a path filer. The file is loaded when the Bicep file is compiled to the YAML template. You can't include variables in the file path because they haven't been resolved when compiling to the template. During deployment, the YAML template contains the contents of the file as a hard-coded string.

In VS Code, the properties of the loaded object are available intellisense. For example, you can create a file with values to share across many Bicep files. An example is shown in this article.

This function requires [Bicep CLI version 0.16.X or higher](./install.md).

The maximum allowed size of the file is **1,048,576 characters**, including line endings.

### Return value

The contents of the file as an Any object.

### Examples

The following example creates a YAML file that contains values for a network security group.

::: code language="yml" source="~/azure-docs-bicep-samples/syntax-samples/functions/loadYamlContent/nsg-security-rules.yaml" :::

You load that file and convert it to a JSON object. You use the object to assign values to the resource.

::: code language="bicep" source="~/azure-docs-bicep-samples/syntax-samples/functions/loadYamlContent/loadsharedrules.bicep" highlight="3,12" :::

You can reuse the file of values in other Bicep files that deploy a network security group.

## loadTextContent

`loadTextContent(filePath, [encoding])`

Loads the content of the specified file as a string.

Namespace: [sys](bicep-functions.md#namespaces-for-functions).

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| filePath | Yes | string | The path to the file to load. The path is relative to the deployed Bicep file. It can't contain variables. |
| encoding | No | string | The file encoding. The default value is `utf-8`. The available options are: `iso-8859-1`, `us-ascii`, `utf-16`, `utf-16BE`, or `utf-8`.  |

### Remarks

Use this function when you have content that is stored in a separate file. You can load the content rather than duplicating it in your Bicep file. For example, you can load a deployment script from a file. The file is loaded when the Bicep file is compiled to the JSON template. You can't include any variables in the file path because they haven't been resolved when compiling to the template. During deployment, the JSON template contains the contents of the file as a hard-coded string.

Use the [`loadJsonContent()`](#loadjsoncontent) function to load JSON files.

This function requires [Bicep CLI version 0.4.X or higher](./install.md).

The maximum allowed size of the file is **131,072 characters**, including line endings.

### Return value

The contents of the file as a string.

### Examples

The following example loads a script from a file and uses it for a deployment script.

::: code language="bicep" source="~/azure-docs-bicep-samples/syntax-samples/functions/loadTextContent/loaddeploymentscript.bicep" highlight="13" :::

## Next steps

* For a description of the sections in a Bicep file, see [Understand the structure and syntax of Bicep files](./file.md).

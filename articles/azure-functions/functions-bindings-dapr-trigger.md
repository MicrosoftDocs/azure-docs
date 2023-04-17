---
title: Dapr trigger for Azure Functions
description: Learn how to run an Azure Function as Dapr data changes.
ms.topic: reference
ms.date: 04/17/2023
ms.devlang: csharp, java, javascript, powershell, python
ms.custom: "devx-track-csharp, devx-track-python"
zone_pivot_groups: programming-languages-set-functions-lang-workers
---

# Dapr trigger for Azure Functions

<!--Intro info goes here-->
## Example

::: zone pivot="programming-language-csharp"

<!--Optional intro text goes here, followed by the C# modes include.-->
[!INCLUDE functions-bindings-csharp-intro]

# [In-process](#tab/in-process)

<!--Content and samples from the C# tab in ##Examples go here.-->

 
# [Isolated process](#tab/isolated-process)

<!--add a link to the extension-specific code example in this repo: https://github.com/Azure/azure-functions-dotnet-worker/blob/main/samples/Extensions/ as in the following example: :::code language="csharp" source="~/azure-functions-dotnet-worker/samples/Extensions/EventGrid/EventGridFunction.cs" range="35-49"::: -->

---

::: zone-end 

::: zone pivot="programming-language-java"

<!--Content and samples from the Java tab in ##Examples go here.-->
::: zone-end
::: zone pivot="programming-language-javascript"

<!--Content and samples from the JavaScript tab in ##Examples go here.-->
::: zone-end
::: zone pivot="programming-language-powershell"

<!--Content and samples from the PowerShell tab in ##Examples go here.-->
::: zone-end
::: zone pivot="programming-language-python"

<!--Content and samples from the Python tab in ##Examples go here.-->
::: zone-end
::: zone pivot="programming-language-csharp"

## Attributes
Both in-process and isolated process C# libraries use the <!--attribute API here--> attribute to define the function. C# script instead uses a function.json configuration file.

<!-- If the attribute's constructor takes parameters, you'll need to include a table like this, where the values are from the original table in the Configuration section: The attribute's constructor takes the following parameters: |Parameter | Description| |---------|----------------------| |**Parameter1** |Description 1| |**Parameter2** | Description 2| -->

# [In-process](#tab/in-process)

<!--C# attribute information for the trigger from ## Attributes and annotations goes here, with intro sentence.-->
 
# [Isolated process](#tab/isolated-process)

<!-- C# attribute information for the trigger goes here with an intro sentence. Use a code link like the following to show the method definition: :::code language="csharp" source="~/azure-functions-dotnet-worker/samples/Extensions/EventGrid/EventGridFunction.cs" range="13-16"::: -->

---

::: zone-end
::: zone pivot="programming-language-java"

<!--## Annotations Content from the Java tab under ## Attributes and annotations. -->
::: zone-end
::: zone pivot="programming-language-javascript,programming-language-powershell,programming-language-python"

## Configuration
The following table explains the binding configuration properties that you set in the function.json file.

<!-- suggestion |function.json property |Description| |---------|---------| | **type** | Required - must be set to `eventGridTrigger`. | | **direction** | Required - must be set to `in`. | | **name** | Required - the variable name used in function code for the parameter that receives the event data. | -->
::: zone-end

See the Example section for complete examples.

## Usage
::: zone pivot="programming-language-csharp"
The parameter type supported by the Event Grid trigger depends on the Functions runtime version, the extension package version, and the C# modality used.

# [In-process](#tab/in-process)

<!--Any usage information from the C# tab in ## Usage. -->
 
# [Isolated process](#tab/isolated-process)

<!--If available, call out any usage information from the linked example in the worker repo. -->

---

::: zone-end

<!--Any of the below pivots can be combined if the usage info is identical.-->
::: zone pivot="programming-language-java"

<!--Any usage information from the Java tab in ## Usage. -->
::: zone-end
::: zone pivot="programming-language-javascript"

<!--Any usage information from the JavaScript tab in ## Usage. -->
::: zone-end
::: zone pivot="programming-language-powershell"

<!--Any usage information from the PowerShell tab in ## Usage. -->
::: zone-end
::: zone pivot="programming-language-python"

<!--Any usage information from the Python tab in ## Usage. -->
::: zone-end

<!---## Extra sections Put any sections with content that doesn't fit into the above section headings down here. This will likely get moved to another article after the refactor. -->
## host.json settings
<!-- Some bindings don't have this section. If yours doesn't, please remove this section. -->
## Next steps
<!--Use the next step links from the original article.-->
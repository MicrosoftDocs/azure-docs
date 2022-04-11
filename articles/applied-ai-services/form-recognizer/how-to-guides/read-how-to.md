# Use the Read Model

 In this how-to guide, you'll learn to use Azure Form Recognizer's [Read model](../concept-read.md) to extract printed and handwritten text lines, words, locations, and detected languages, in a programming language of your choice, or the REST API. We recommend that you use the free service when you're learning the technology. Remember that the number of free pages is limited to 500 per month.

 Read model is the core of all the other Form Recognizer models. Layout, General Document, Custom Models and our Prebuilt Models all utilize the Read model as a basis for extracting texts from documents.

>[!NOTE]
> Form Recognizer v3.0 is currently in public preview. Some features may not be supported or have limited capabilities.
The current API version is ```2022-01-30-preview```.

::: zone pivot="programming-language-csharp"

[!INCLUDE [C# SDK](../includes/how-to-guides/csharp-read.md)]

::: zone-end

::: zone pivot="programming-language-java"

[!INCLUDE [Java SDK](../includes/how-to-guides/java-read.md)]

::: zone-end

::: zone pivot="programming-language-javascript"

[!INCLUDE [NodeJS SDK](../includes/how-to-guides/javascript-read.md)]

::: zone-end

::: zone pivot="programming-language-python"

[!INCLUDE [Python SDK](../includes/how-to-guides/python-read.md)]

::: zone-end

::: zone pivot="programming-language-rest-api"

[!INCLUDE [REST API](../includes/how-to-guides/rest-api-read.md)]

::: zone-end

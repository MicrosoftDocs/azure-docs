[Metadata goes here]

zone_pivot_groups: programming-languages-set-functions-lang-workers
[H1 title goes here]
<!--Intro info goes here. -->
::: zone pivot="programming-language-csharp"

Install extension
The extension NuGet package you install depends on the C# mode you're using in your function app:

In-process
Functions execute in the same process as the Functions host. To learn more, see Develop C# class library functions using Azure Functions.

Isolated process
Functions execute in an isolated C# worker process. To learn more, see Guide for running C# Azure Functions in an isolated process.

::: zone-end

::: zone pivot="programming-language-javascript,programming-language-python,programming-language-java,programming-language-powershell"

Install bundle
<!-- Do either the [extension bundle] install here or manual func install extension if needed. -->
::: zone-end

<!--## Requirements Include any requirements that apply to using the entire extension. See the [Kafka reference](https://learn.microsoft.com/azure/azure-functions/functions-bindings-kafka#enable-runtime-scaling) for an example. -->
host.json settings
<!-- Some bindings don't have this section. If yours doesn't, please remove this section. -->
Next steps
<!--Use the next step links from the original article.-->
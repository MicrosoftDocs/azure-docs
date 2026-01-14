---
title: Azure Functions language stack support policy
description: Learn about the support policy for the various language stacks that Azure Functions supports.
ms.topic: conceptual
ms.date: 09/03/2025
zone_pivot_groups: programming-languages-set-functions
---

# Azure Functions language stack support policy

This article explains the support policy for the language stacks supported by Azure Functions. Guidance is language-specific. Make sure to choose your preferred development language at the [top of the article](#top).

## Retirement process

The Functions runtime includes the Functions host and programming language-specific workers. To maintain full-support coverage when running your functions in Azure, Functions support aligns with end-of-life support for a given language. To help you keep your apps up-to-date and supported, Functions implements a phased reduction in support as language stack versions reach their end-of-life dates. Support ends on the earlier of: the community end-of-support date for the language or the end-of-support date for the underlying base operating system. Retirement dates are published at general availability (GA) to allow time for upgrade planning and testing.

+ **Notification phase**: 

    The Functions team sends you notification emails about upcoming language version retirements that affect your function apps. When you receive this notification, you should prepare to upgrade these apps to use to a supported version.

+ **Retirement phase**:

    After the language end-of-life date, function apps that use retired language versions can still be created and deployed, and they continue to run on the platform. However, these apps aren't eligible for new features, security patches, and performance optimizations until after you upgrade them to a supported language version. Further, if required, in certain cases we will limit the number of instances allocated to these apps including limit scaling to 1 instance.

    > [!IMPORTANT]
    >If you're running function apps using an unsupported runtime or language version, you might encounter issues and performance implications and are required to upgrade before receiving support for your function app. As such, you're highly encouraged to upgrade the language version of such an app to a supported version. TO learn how, see [Update language stack versions in Azure Functions](./update-language-versions.md).

## Retirement policy exceptions

Any Functions-supported exceptions to language-specific retirement policies are documented here:  

> There are currently no exceptions to the general retirement policy.

## Language support-related resources

Use these resources to better understand and plan for language support-related changes in your function apps.
::: zone pivot="programming-language-csharp" 
 
| Resource | Details  |
| --- | --- |
| **Supported versions** | [Currently supported stack versions](supported-languages.md?pivots=programming-language-csharp#languages-by-runtime-version) | 
| **Language version support timelines** | [.NET support policy page](https://dotnet.microsoft.com/platform/support/policy/dotnet-core)|
| **Configuring language versions** | [Isolated worker model](./dotnet-isolated-process-guide.md#supported-versions)<br/>[In-process model](./functions-dotnet-class-library.md#supported-versions)|

::: zone-end  
::: zone pivot="programming-language-typescript" 

| Resource | Details  |
| --- | --- |
| **Supported versions** | [Currently supported stack versions](supported-languages.md?pivots=programming-language-typescript#languages-by-runtime-version) | 
| **Language version support timelines** | [Node.js release page on GitHub](https://github.com/nodejs/Release#release-schedule)|
| **Configuring language versions** | [Setting the Node version](./functions-reference-node.md#setting-the-node-version)|

::: zone-end  
::: zone pivot="programming-language-javascript" 

| Resource | Details  |
| --- | --- |
| **Supported versions** | [Currently supported stack versions](supported-languages.md?pivots=programming-language-javascript#languages-by-runtime-version) | 
| **Language version support timelines** | [Node.js release page on GitHub](https://github.com/nodejs/Release#release-schedule)|
| **Configuring language versions** | [Setting the Node version](./functions-reference-node.md#setting-the-node-version)|

::: zone-end  
::: zone pivot="programming-language-java" 

| Resource | Details  |
| --- | --- |
| **Supported versions** | [Currently supported stack versions](supported-languages.md?pivots=programming-language-java#languages-by-runtime-version) | 
| **Language version support timelines** | [Java support on Azure and Azure Stack](/azure/developer/java/fundamentals/java-support-on-azure)|
| **Configuring language versions** | [Update the stack configuration](./update-language-versions.md#update-the-stack-configuration)|

::: zone-end  
::: zone pivot="programming-language-powershell"  

| Resource | Details  |
| --- | --- |
| **Supported versions** | [Currently supported stack versions](supported-languages.md?pivots=programming-language-powershell#languages-by-runtime-version) | 
| **Language version support timelines** | [PowerShell Support Lifecycle](/powershell/scripting/powershell-support-lifecycle#powershell-end-of-support-dates)|
| **Configuring language versions** | [Changing the PowerShell version](./functions-reference-python.md#python-version)|

::: zone-end  
::: zone pivot="programming-language-python" 

| Resource | Details  |
| --- | --- |
| **Supported versions** | [Currently supported stack versions](supported-languages.md?pivots=programming-language-python#languages-by-runtime-version) | 
| **Language version support timelines** | [Python developer's guide](https://devguide.python.org/#status-of-python-branches)|
| **Configuring language versions** | [Changing Python version](functions-reference-python.md#changing-python-version)|

::: zone-end  

## Frequently asked questions

This section provides you with answers to questions that are frequently asked about language support policies.

### Which versions of my preferred language does Functions currently support? 

For the up-to-date list of supported language stack versions, see [Supported languages in Azure Functions](supported-languages.md#languages-by-runtime-version). 

### How long will Functions continue to support my language version?

Support ends on the earlier of: the community end-of-support date for the language or the end-of-support date for the underlying base operating system. Retirement dates are published at general availability (GA) to allow time for upgrade planning and testing. For the expected end-of-life dates of currently supported versions, see [Supported languages in Azure Functions](supported-languages.md#languages-by-runtime-version).

### What happens when my runtime version reaches the end of support?

After a previously supported Functions runtime version reaches its end-of-support, Microsoft no longer provides bug fixes, security updates, or patches. Apps using retired versions may also face performance degradation. You must upgrade to a supported version to maintain security and stability. 

### Can I continue to use an unsupported language stack or runtime version?

You can continue to use previously supported language stacks and Functions runtime versions beyond the end-of-support date. However, you must take into account that unsupported runtime versions don't receive updates, security patches, or official support from Microsoft. Your apps might also face performance degradation when using retired runtime versions. 

### How do I upgrade my function app to a newer supported language stack or runtime version? 

To make sure that your app is compatible with both the latest supported Functions runtime version and the latest version of your language stack, see [Update language stack versions in Azure Functions](update-language-versions.md) 

### How do I check which language stack and runtime version is being used by my function app? 

Azure provides these methods to check the current runtime version used by your function app:

+ [Using the Azure portal](set-runtime-version.md?tabs=azure-portal#view-the-current-runtime-version) 
+ [Using the Azure CLI](set-runtime-version.md?tabs=azure-cli#view-the-current-runtime-version) 
+ [Using Azure PowerShell](set-runtime-version.md?tabs=azure-powershell#view-the-current-runtime-version)

The language stack used by your function app is determined based on the value of the `FUNCTIONS_WORKER_RUNTIME` application setting. For more information, see [Work with application settings](functions-how-to-use-azure-function-app-settings.md#settings).  

## Related articles

To learn more about how to upgrade your function app's language version, see these articles:


+ [Update language stack versions](./update-language-versions.md)
+ [Currently supported language versions](./supported-languages.md#languages-by-runtime-version)

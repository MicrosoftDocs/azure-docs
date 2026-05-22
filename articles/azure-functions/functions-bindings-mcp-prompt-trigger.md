---
title: MCP prompt trigger for Azure Functions
description: Learn how you can use a trigger endpoint to expose functions as model context protocol (MCP) server prompts in Azure Functions.
ms.topic: reference
ms.date: 04/30/2026
ms.update-cycle: 180-days
ai-usage: ai-assisted
ms.collection: 
  - ce-skilling-ai-copilot
zone_pivot_groups: programming-languages-set-functions
---

# MCP prompt trigger for Azure Functions (public preview)

Use the MCP prompt trigger to define prompt endpoints in a [Model Context Protocol (MCP)](https://github.com/modelcontextprotocol) server. Clients can use prompts to generate structured messages and instructions when interacting with language models. Prompts are user-controlled, meaning they're exposed from servers to clients so users can select them for use. 

For information on setup and configuration details, see the [overview](functions-bindings-mcp.md).

## Example

::: zone pivot="programming-language-csharp"  
>[!NOTE]  
> For C#, the Azure Functions MCP extension supports only the [isolated worker model](dotnet-isolated-process-guide.md). 

This code creates an endpoint to expose a code review prompt: 

```csharp
[Function(nameof(CodeReviewChecklist))]
public string CodeReviewChecklist(
    [McpPromptTrigger(CodeReviewPromptName, Description = CodeReviewPromptDescription)]
        PromptInvocationContext context)
{
    logger.LogInformation("Code review checklist prompt invoked.");

    return """
        You are a senior software engineer performing a code review.
        Use the following checklist to evaluate the code:

        1. **Correctness** — Does the code do what it's supposed to?
        2. **Error Handling** — Are edge cases and failures handled?
        3. **Security** — Are there any vulnerabilities (injection, auth, secrets)?
        4. **Performance** — Are there obvious inefficiencies?
        5. **Readability** — Is the code clear and well-named?
        6. **Tests** — Are there adequate tests for the changes?

        Provide your feedback in a structured format with a severity level
        (critical, warning, suggestion) for each finding.
        """;
}
```

This code creates an endpoint to expose a summarize prompt that takes two arguments, `topic` and `audience`: 

```csharp
[Function(nameof(SummarizeContent))]
public string SummarizeContent(
    [McpPromptTrigger(SummarizePromptName, Description = SummarizePromptDescription)]
        PromptInvocationContext context,
    [McpPromptArgument("topic", "The topic or content to summarize.", isRequired: true)]
        string topic,
    [McpPromptArgument("audience", "Target audience (e.g., 'executive', 'developer', 'beginner').")]
        string? audience)
{
    logger.LogInformation("Summarize prompt invoked for topic: {Topic}", topic);

    var audienceInstruction = audience is not null
        ? $"Tailor the summary for a **{audience}** audience."
        : "Write the summary for a general technical audience.";

    return $"""
        Summarize the following topic concisely and accurately:

        **Topic:** {topic}

        {audienceInstruction}

        Guidelines:
        - Start with a one-sentence overview.
        - Include 3–5 key points as bullet items.
        - End with a brief conclusion or recommendation.
        - Keep the total length under 300 words.
        """;
}
```

The prompt arguments for the prompt can also be configured in `Program.cs` by using the `ConfigureMcpPrompt` builder:

```csharp
var builder = FunctionsApplication.CreateBuilder(args);

builder.ConfigureFunctionsWebApplication();

builder
    .ConfigureMcpPrompt(SummarizePromptName)
    .WithArgument("topic", "The topic or content to summarize.", required: true)
    .WithArgument("audience", "Target audience (e.g., 'executive', 'developer', 'beginner').");

builder.Build().Run();
```

For the complete code example, see [FunctionsMcpPrompts](https://github.com/Azure-Samples/remote-mcp-functions-dotnet/tree/main/src/FunctionsMcpPrompts) sample on GitHub.  


> [!TIP]
> The example above uses literal strings for things like the name of the "code_review" prompt in both `Program.cs` and the function. Consider instead using shared constant strings to keep things in sync across your project.

::: zone-end
::: zone pivot="programming-language-java"

This code creates an endpoint to expose a code review prompt with multiple arguments (one required, one optional):

```java
@FunctionName("CodeReviewPrompt")
public String codeReviewPrompt(
        @McpPromptTrigger(
                name = "code_review",
                description = "Generates a code review prompt for the given code snippet",
                title = "Code Review")
        String context,
        @McpPromptArgument(
                name = "code",
                description = "The code to review",
                isRequired = true)
        String code,
        @McpPromptArgument(
                name = "language",
                description = "The programming language")
        String language,
        final ExecutionContext executionContext) {

    executionContext.getLogger().info("Generating code review prompt");

    String lang = (language != null && !language.isEmpty()) ? language : "unknown";
    String snippet = (code != null && !code.isEmpty()) ? code : "// no code provided";

    return "Please review the following " + lang + " code and suggest improvements:\n\n```"
            + lang + "\n" + snippet + "\n```";
}
```

This code creates an endpoint to expose a summarize prompt with a single required argument:

```java
@FunctionName("SummarizePrompt")
public String summarizePrompt(
        @McpPromptTrigger(
                name = "summarize",
                description = "Summarizes the provided text",
                title = "Summarize Text")
        String context,
        @McpPromptArgument(
                name = "text",
                description = "The text to summarize",
                isRequired = true)
        String text,
        final ExecutionContext executionContext) {

    executionContext.getLogger().info("Generating summarize prompt");

    String input = (text != null && !text.isEmpty()) ? text : "No text provided";
    return "Please provide a concise summary of the following text:\n\n" + input;
}
```

For the complete code example, see [PromptExamples.java](https://github.com/Azure-Samples/remote-mcp-functions-java/blob/main/samples/FunctionsMcpTool/src/main/java/com/function/PromptExamples.java) sample on GitHub.

> [!NOTE]
> MCP prompt support requires `azure-functions-java-library` version 3.3.0 or later and `azure-functions-maven-plugin` version 1.42.0 or later. Update your `pom.xml` to use the preview extension bundle:
>
> ```xml
> <extensionBundle>
>   <id>Microsoft.Azure.Functions.ExtensionBundle.Preview</id>
>   <version>[4.41, 5.0.0)</version>
> </extensionBundle>
> ```

::: zone-end  
::: zone pivot="programming-language-javascript"  
Example code for JavaScript isn't currently available. See the TypeScript examples for general guidance using Node.js.
::: zone-end  
::: zone pivot="programming-language-typescript"

This code creates an endpoint to expose a code review prompt: 

```typescript
app.mcpPrompt('CodeReviewChecklist', {
    promptName: CodeReviewPromptName,
    description: CodeReviewPromptDescription,
    handler: async (_ctx: PromptInvocationContext, context: InvocationContext) => {
        context.log('Code review checklist prompt invoked.');

        return [
            "You are a senior software engineer performing a code review.",
            'Use the following checklist to evaluate the code:',
            '',
            "1. **Correctness** \u2014 Does the code do what it's supposed to?",
            '2. **Error Handling** \u2014 Are edge cases and failures handled?',
            '3. **Security** \u2014 Are there any vulnerabilities (injection, auth, secrets)?',
            '4. **Performance** \u2014 Are there obvious inefficiencies?',
            '5. **Readability** \u2014 Is the code clear and well-named?',
            '6. **Tests** \u2014 Are there adequate tests for the changes?',
            '',
            'Provide your feedback in a structured format with a severity level',
            '(critical, warning, suggestion) for each finding.',
        ].join('\n');
    },
});
```

This code creates an endpoint to expose a document generation prompt with arguments: 

```typescript
app.mcpPrompt('GenerateDocumentation', {
    promptName: GenerateDocsPromptName,
    description: GenerateDocsPromptDescription,
    promptArguments: {
        function_name: promptArg.describe("The function to document.").isRequired(),
        style: promptArg.describe("Documentation style (e.g., 'concise', 'verbose')."),
    },
    handler: async (ctx: PromptInvocationContext, context: InvocationContext) => {
        const functionName = ctx.arguments.function_name ?? '(unknown)';
        const style = ctx.arguments.style ?? 'concise';

        context.log(`Generate docs prompt invoked for function: ${functionName}`);

        return [
            `Generate API documentation for the function named **${functionName}**.`,
            '',
            `Documentation style: **${style}**`,
            '',
            'Include the following sections:',
            '- **Description** \u2014 What the function does.',
            '- **Parameters** \u2014 List each parameter with its type and purpose.',
            '- **Return Value** \u2014 What the function returns.',
            '- **Example Usage** \u2014 A short code example showing how to call it.',
        ].join('\n');
    },
});
```

For the complete code example, see [mcp-prompts](https://github.com/Azure-Samples/remote-mcp-functions-typescript/tree/main/src/mcp-prompts) sample on GitHub.

> [!NOTE]
> MCP prompt support requires the preview extension bundle and `@azure/functions` version 4.14.0 or later. Update your `host.json` to use the preview bundle:
>
> ```json
> "extensionBundle": {
>   "id": "Microsoft.Azure.Functions.ExtensionBundle.Preview",
>   "version": "[4.41, 5.0.0)"
> }
> ```
>
> And ensure your `package.json` references `"@azure/functions": "^4.14.0"`.

::: zone-end  
::: zone pivot="programming-language-python"

This code uses the `mcp_prompt_trigger` decorator to create an endpoint to expose a prompt named `code_review_checklist`: 

```python
@app.mcp_prompt_trigger(
    arg_name="context",
    prompt_name="code_review_checklist",
    description="Returns a structured code review checklist prompt for evaluating code changes."
)
def code_review_checklist(context: func.PromptInvocationContext) -> str:
    logging.info("Code review checklist prompt invoked.")
    
    return """You are a senior software engineer performing a code review.
Use the following checklist to evaluate the code:

1. **Correctness** — Does the code do what it's supposed to?
2. **Error Handling** — Are edge cases and failures handled?
3. **Security** — Are there any vulnerabilities (injection, auth, secrets)?
4. **Performance** — Are there obvious inefficiencies?
5. **Readability** — Is the code clear and well-named?
6. **Tests** — Are there adequate tests for the changes?

Provide your feedback in a structured format with a severity level
(critical, warning, suggestion) for each finding."""
```

This code creates an endpoint to expose a prompt with arguments for generating API documentation: 

```python
@app.mcp_prompt_trigger(
    arg_name="context",
    prompt_name="generate_documentation",
    prompt_arguments=[
        func.PromptArgument("function_name", "The name of the function to document.", required=False),
        func.PromptArgument("style", "Documentation style: 'concise', 'detailed', or 'tutorial'.", required=False)
    ],
    description="Generates API documentation for a function. Arguments are configured in Program.cs."
)
def generate_documentation(context: func.PromptInvocationContext) -> str:
    function_name = context.arguments.get("function_name", "(unknown)")
    style = context.arguments.get("style", "concise")
    
    logging.info(f"Generate docs prompt invoked for function: {function_name}")
    
    return f"""Generate API documentation for the function named **{function_name}**.

Documentation style: **{style}**

Include the following sections:
- **Description** — What the function does.
- **Parameters** — List each parameter with its type and purpose.
- **Return Value** — What the function returns.
- **Example Usage** — A short code example showing how to call it."""
```

For the complete code example, see [FunctionsMcpPrompts](https://github.com/Azure-Samples/remote-mcp-functions-python/tree/main/src/FunctionsMcpPrompts) sample on GitHub.  

> [!NOTE]
> MCP prompt support requires the preview extension bundle and `azure-functions` version 2.2.0b2 or later. Update your `host.json` to use the preview bundle:
>
> ```json
> "extensionBundle": {
>   "id": "Microsoft.Azure.Functions.ExtensionBundle.Preview",
>   "version": "[4.41, 5.0.0)"
> }
> ```
>
> And ensure your `requirements.txt` includes `azure-functions>=2.2.0b2`.

::: zone-end  
[!INCLUDE [functions-mcp-extension-powershell-note](../../includes/functions-mcp-extension-powershell-note.md)]  
::: zone pivot="programming-language-csharp"  
## Attributes

C# libraries use `McpPromptTriggerAttribute` to define the function trigger. 

The attribute's constructor takes the following parameters:

| Parameter | Description |
|---------|----------------------|
| **PromptName** | (Required) The name of the prompt that the MCP trigger endpoint exposes. |

The attribute also supports the following named properties:

| Property | Description |
|---------|----------------------|
| **Title** | (Optional) A human-readable title for display purposes in MCP client interfaces. |
| **Description** | (Optional) A friendly description of the prompt endpoint for clients. |
| **PromptArguments** | (Optional) A JSON-serialized string representation of the prompt arguments schema. You can also use the `McpPromptArgument` attribute as an alternative way to provide arguments. |
| **Metadata** | (Optional) A JSON-serialized string of metadata for the prompt. |
| **Icons** | (Optional) A JSON-serialized string of icon definitions for display in client interfaces. |

See [Usage](#usage) to learn how to define arguments of the prompt as input parameters.

::: zone-end  
::: zone pivot="programming-language-java"  

## Annotations

Use the `@McpPromptTrigger` annotation to create a function that exposes a prompt endpoint in your remote MCP server.

The annotation supports the following configuration options:

| Parameter | Description |
|---------|----------------------|
| **name** | (Required) The binding parameter name and unique prompt identifier. |
| **description** | (Optional) A friendly description of the prompt endpoint for clients. |
| **title** | (Optional) A human-readable title for display purposes in MCP client interfaces. |
| **promptArguments** | (Optional) An inline JSON array of argument definitions as an alternative to `McpPromptArgument` annotations. |
| **metadata** | (Optional) A JSON-serialized string of metadata for the prompt. |
| **icons** | (Optional) A JSON-serialized string of icon definitions for display in client interfaces. |

Use the `@McpPromptArgument` annotation to define individual prompt arguments. Annotate each argument parameter in your function with this annotation.

The `@McpPromptArgument` annotation supports the following configuration options:

| Parameter | Description |
|---------|----------------------|
| **name** | (Required) The argument name used as both the binding parameter name and the MCP protocol argument identifier. |
| **description** | (Optional) A description of what the argument represents. |
| **isRequired** | (Optional) If set to `true`, the argument is required when invoking the prompt. Defaults to `false`. |

::: zone-end  

::: zone pivot="programming-language-python"
## Decorators

_Applies only to the Python v2 programming model._

The following MCP prompt trigger properties are supported on `mcp_prompt_trigger`:

| Property    | Description |
|-------------|-----------------------------|
| **arg_name** | The variable name (usually `context`) used in function code to access the prompt invocation context. |
| **prompt_name** | (Required) The name of the MCP server prompt exposed by the function endpoint. |
| **description** | A description of the MCP server prompt that the function endpoint exposes. |
| **title** | An optional title for display purposes in MCP client interfaces. |
| **prompt_arguments** | A list of `PromptArgument` objects that define arguments the prompt accepts from clients. |

::: zone-end
::: zone pivot="programming-language-javascript,programming-language-typescript"  
## Configuration

Define the trigger's binding options in your code. The following table describes each option: 

| Option | Description |
|-----------------------|-------------|
| **type** | Set to `mcpPromptTrigger`. Use only with generic definitions. |
| **promptName** | (Required) The name of the MCP server prompt that the function endpoint exposes. |
| **description** | A description of the MCP server prompt that the function endpoint exposes. |
| **promptArguments** | An object that defines prompt arguments using `promptArg` helpers. Each key is the argument name, and the value describes and configures the argument. |
| **handler** | The method that contains the actual function code. | 

::: zone-end

::: zone pivot="programming-language-csharp,programming-language-java,programming-language-python,programming-language-javascript,programming-language-typescript"

For complete examples, see the [Example section](#example).

::: zone-end

## Usage

::: zone pivot="programming-language-csharp"  

The MCP prompt trigger can bind to the following types:

| Type | Description |
| --- | --- |
| [PromptInvocationContext] | An object representing the prompt invocation, including the prompt name, arguments, session ID, and transport information. |

[PromptInvocationContext]: https://github.com/Azure/azure-functions-mcp-extension/blob/main/src/Microsoft.Azure.Functions.Worker.Extensions.Mcp/Abstractions/PromptInvocationContext.cs

The `PromptInvocationContext` type provides the following properties:

| Property | Type | Description |
| --- | --- | --- |
| **Name** | `string` | The name of the prompt being invoked. |
| **Arguments** | `Dictionary<string, string>?` | The arguments provided for the prompt invocation. |
| **SessionId** | `string?` | The session ID associated with the current prompt invocation. |
| **Transport** | `Transport?` | Transport information for the current invocation. |

::: zone-end

::: zone pivot="programming-language-java"

The `@McpPromptTrigger` annotation binds to a `String` parameter that contains the prompt invocation context as a JSON string. The trigger function receives argument values through parameters annotated with `@McpPromptArgument`.

::: zone-end

::: zone pivot="programming-language-python"

::: zone-end

::: zone pivot="programming-language-javascript,programming-language-typescript"

The prompt handler function has two parameters: 

| Parameter | Type | Description |
| --- | --- | --- |
| **ctx** | `PromptInvocationContext` | The prompt invocation context, which includes the prompt `name`, `arguments`, `sessionId`, and `transport` information. |
| **context** | `InvocationContext` | The Azure Functions invocation context, which provides logging and other runtime information. |

::: zone-end

::: zone pivot="programming-language-csharp,programming-language-java,programming-language-python,programming-language-javascript,programming-language-typescript"

### Prompt arguments

MCP clients invoke prompts with arguments to provide data and context for generating the prompt message. Clients know how to collect and pass these arguments based on the argument definitions that the prompt advertises as part of the protocol. You define arguments for the prompt in your function code.

When you define a prompt argument, make it optional by default. The client can omit it when invoking the prompt. Explicitly mark arguments as required if the prompt can't operate without them.

::: zone-end

::: zone pivot="programming-language-csharp"  

In C#, you can define arguments for your prompts in several ways. Which approach you use is a matter of code style preference. The options are:

- Your function takes input parameters by using the `McpPromptArgument` attribute.
- You use the `FunctionsApplicationBuilder` to define arguments in your `Program.cs` file.

#### [`McpPromptArgument` attribute](#tab/attribute)

Define one or more prompt arguments by applying the `McpPromptArgument` attribute to input binding-style parameters in your function.  

The `McpPromptArgumentAttribute` type supports these properties:

| Property | Description |
| ---- | ----- |
| **ArgumentName** | Name of the prompt argument that gets exposed to clients. |
| **Description** | Description of what the argument represents. |
| **IsRequired** | (Optional) If set to `true`, the prompt argument is required when invoking the prompt. Defaults to `false`. |

You can see these attributes used in the `CodeReviewPrompt` in the [Examples](#example).

#### [`FunctionsApplicationBuilder`](#tab/builder)

Define one or more prompt arguments in your entry point (`Program.cs`) file by using an `McpPromptBuilder` returned by the `ConfigureMcpPrompt()` method on `FunctionsApplicationBuilder`. This example calls the `WithArgument` method on the builder for the `code_review` prompt to set the arguments:

```csharp
var builder = FunctionsApplication.CreateBuilder(args);

builder.ConfigureFunctionsWebApplication();

builder
    .ConfigureMcpPrompt("code_review")
    .WithArgument("code", "The code to review", required: true)
    .WithArgument("language", "The programming language");

// other configuration

builder.Build().Run();
```

You can call the `WithArgument()` method multiple times to define multiple arguments for the prompt.

---

::: zone-end
::: zone pivot="programming-language-python"
You can configure prompt arguments in the trigger definition's `prompt_arguments` field, which is a list of `PromptArgument` objects.

A `PromptArgument` is constructed as:

```python
func.PromptArgument("argument_name", "Description of the argument", required=True)
```

The fields of a `PromptArgument` are:

| Property | Description |
| ---- | ----- |
| **name** | Name of the prompt argument that you expose to clients. |
| **description** | Description of what the argument represents. |
| **required** | (Optional) If set to `True`, the argument is required when invoking the prompt. Defaults to `False`. |

::: zone-end  
::: zone pivot="programming-language-java"
In Java, define prompt arguments by using the `@McpPromptArgument` annotation on individual function parameters. Annotate each parameter that represents a prompt argument with this annotation. Specify the argument name, description, and whether it's required.

You can see these annotations used in the [Examples](#example).
::: zone-end  

::: zone pivot="programming-language-javascript,programming-language-typescript"

```typescript
  promptArguments: {
    code: promptArg.describe("The code to review").isRequired(),
    language: promptArg.describe("The programming language"),
  }
```

::: zone-end

::: zone pivot="programming-language-csharp,programming-language-java,programming-language-python,programming-language-javascript,programming-language-typescript"

### Return types

::: zone-end

::: zone pivot="programming-language-csharp"

The MCP prompt trigger supports the following return types:

| Type | Description |
| --- | --- |
| `string` | Returned as a single user-role text message in the MCP `GetPromptResult`. |

::: zone-end

::: zone pivot="programming-language-java"

The MCP prompt trigger supports the following return types:

| Type | Description |
| --- | --- |
| `String` | Returned as a single user-role text message in the MCP `GetPromptResult`. |

::: zone-end

::: zone pivot="programming-language-python"

The MCP prompt trigger supports the following return types:

| Type | Description |
| --- | --- |
| `str` | Returned as a single user-role text message in the MCP `GetPromptResult`. |

::: zone-end

::: zone pivot="programming-language-javascript,programming-language-typescript"

The function should return a `string` containing the prompt message text. The string is wrapped as a single user-role text message in the MCP `GetPromptResult`.

::: zone-end
::: zone pivot="programming-language-csharp,programming-language-java,programming-language-python,programming-language-javascript,programming-language-typescript"

### Prompt discovery

When a function app starts, it registers all prompt trigger functions with the MCP server. Clients discover available prompts by calling the MCP `prompts/list` method. This method returns each prompt's name, title, description, arguments, icons, and metadata (through the `meta` field). Clients invoke a prompt by calling `prompts/get` with the prompt name and arguments.

::: zone-end

::: zone pivot="programming-language-csharp"

### Sessions

The `SessionId` property on `PromptInvocationContext` identifies the MCP session making the request. Use this property to maintain per-session state or apply session-specific logic when generating prompts.

::: zone-end

::: zone pivot="programming-language-csharp,programming-language-java,programming-language-python,programming-language-typescript"

## host.json settings

The host.json file contains settings that control MCP trigger behaviors. See the [host.json settings](functions-bindings-mcp.md#hostjson-settings) section for details regarding available settings.

::: zone-end

## Related articles

[MCP tool trigger for Azure Functions](functions-bindings-mcp-tool-trigger.md)  
[MCP resource trigger for Azure Functions](functions-bindings-mcp-resource-trigger.md)

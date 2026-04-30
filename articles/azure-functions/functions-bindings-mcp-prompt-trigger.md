---
title: MCP prompt trigger for Azure Functions
description: Learn how you can use a trigger endpoint to expose functions as model context protocol (MCP) server prompts in Azure Functions.
ms.topic: reference
ms.date: 02/18/2026
ms.update-cycle: 180-days
ai-usage: ai-assisted
ms.collection: 
  - ce-skilling-ai-copilot
zone_pivot_groups: programming-languages-set-functions
---

# MCP prompt trigger for Azure Functions

Use the MCP prompt trigger to define prompt endpoints in a [Model Context Protocol (MCP)](https://github.com/modelcontextprotocol) server. Clients can use prompts to generate structured messages and instructions when interacting with language models. Prompts are user-controlled, meaning they're exposed from servers to clients so users can select them for use. 

For information on setup and configuration details, see the [overview](functions-bindings-mcp.md).

## Example

::: zone pivot="programming-language-csharp"  
>[!NOTE]  
> For C#, the Azure Functions MCP extension supports only the [isolated worker model](dotnet-isolated-process-guide.md). 

This code creates an endpoint to expose a prompt named `code_review` that generates a code review message for a given code snippet. The prompt accepts `code` and `language` arguments.

```csharp
[Function(nameof(CodeReviewPrompt))]
public string CodeReviewPrompt(
    [McpPromptTrigger(
        "code_review",
        Title = "Code Review",
        Description = "Generates a code review prompt for the given code snippet")]
    PromptInvocationContext context,
    [McpPromptArgument("code", "The code to review", isRequired: true)] string? code,
    [McpPromptArgument("language", "The programming language")] string? language)
{
    code ??= "// no code provided";
    language ??= "unknown";

    return $"Please review the following {language} code and suggest improvements:\n\n```{language}\n{code}\n```";
}
```

This code creates an endpoint to expose a prompt named `summarize` that returns a summarization request for provided text.

```csharp
[Function(nameof(SummarizePrompt))]
public string SummarizePrompt(
    [McpPromptTrigger(
        "summarize",
        Title = "Summarize Text",
        Description = "Summarizes the provided text")]
    PromptInvocationContext context,
    [McpPromptArgument("text", "The text to summarize", isRequired: true)] string? text)
{
    text ??= "No text provided";
    return $"Please provide a concise summary of the following text:\n\n{text}";
}
```

The prompt arguments for the `code_review` prompt can also be configured in `Program.cs` by using the `ConfigureMcpPrompt` builder:

```csharp
var builder = FunctionsApplication.CreateBuilder(args);

builder.ConfigureFunctionsWebApplication();

builder
    .ConfigureMcpPrompt("code_review")
    .WithArgument("code", "The code to review", required: true)
    .WithArgument("language", "The programming language");

builder.Build().Run();
```

> [!TIP]
> The example above uses literal strings for things like the name of the "code_review" prompt in both `Program.cs` and the function. Consider instead using shared constant strings to keep things in sync across your project.

::: zone-end
::: zone pivot="programming-language-java"

This code creates an endpoint to expose a prompt named `code_review` that generates a code review message for a given code snippet.

```java
@FunctionName("CodeReviewPrompt")
public String codeReview(
        @McpPromptTrigger(
                name = "code_review",
                description = "Generates a code review prompt for the given code snippet",
                title = "Code Review"
        )
        String context,
        @McpPromptArgument(
                name = "code",
                description = "The code to review",
                isRequired = true
        )
        String code,
        @McpPromptArgument(
                name = "language",
                description = "The programming language"
        )
        String language,
        final ExecutionContext executionContext
) {
    executionContext.getLogger().info("Generating code review prompt");

    if (code == null || code.isEmpty()) {
        code = "// no code provided";
    }
    if (language == null || language.isEmpty()) {
        language = "unknown";
    }

    return "Please review the following " + language + " code and suggest improvements:\n\n```"
            + language + "\n" + code + "\n```";
}
```

::: zone-end  
::: zone pivot="programming-language-javascript"  
Example code for JavaScript isn't currently available. See the TypeScript examples for general guidance using Node.js.
::: zone-end  
::: zone pivot="programming-language-typescript"

This code creates an endpoint to expose a prompt named `code_review` that generates a code review message for a given code snippet.

```typescript
import { app, InvocationContext, promptArg, PromptInvocationContext } from "@azure/functions";

const CodeReviewPromptName = "code_review";
const CodeReviewPromptDescription = "Generates a code review prompt for the given code snippet";

app.mcpPrompt("CodeReviewPrompt", {
  promptName: CodeReviewPromptName,
  description: CodeReviewPromptDescription,
  promptArguments: {
    code: promptArg.describe("The code to review").isRequired(),
    language: promptArg.describe("The programming language"),
  },
  handler: async (ctx: PromptInvocationContext, context: InvocationContext) => {
    const code = ctx.arguments.code ?? "// no code provided";
    const language = ctx.arguments.language ?? "unknown";
    return `Please review the following ${language} code and suggest improvements:\n\n\`\`\`${language}\n${code}\n\`\`\``;
  },
});
```

::: zone-end  
::: zone pivot="programming-language-python"

This code uses the `mcp_prompt_trigger` decorator to create an endpoint to expose a prompt named `code_review` that generates a code review message for a given code snippet.

```python
@app.mcp_prompt_trigger(
    arg_name="context",
    prompt_name="code_review",
    prompt_arguments=[
        func.PromptArgument("code", "The code to review", required=True),
        func.PromptArgument("language", "The programming language", required=False)
    ],
    title="Code Review",
    description="Generates a code review prompt for the given code snippet"
)
def code_review_prompt(context: func.PromptInvocationContext) -> str:
    code = context.arguments.get("code", "// no code provided")
    language = context.arguments.get("language", "unknown")
    return f"Please review the following {language} code:\n\n```{language}\n{code}\n```"
```

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
| **name** | (Required) The name of the prompt that the MCP trigger endpoint exposes. |
| **description** | (Optional) A friendly description of the prompt endpoint for clients. |
| **title** | (Optional) A human-readable title for display purposes. |

Use the `@McpPromptArgument` annotation to define individual arguments for your prompts. Annotate each argument parameter in your function with this annotation.

The `@McpPromptArgument` annotation supports the following configuration options:

| Parameter | Description |
|---------|----------------------|
| **name** | (Required) The name of the prompt argument that clients see. |
| **description** | (Optional) A description of what the argument represents. |
| **isRequired** | (Optional) If set to `true`, the prompt argument is required when invoking the prompt. Defaults to `false`. |

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

::: zone pivot="programming-language-python"

The `mcp_prompt_trigger` decorator binds to a context parameter that represents the prompt request from the MCP client. The trigger binds to a `PromptInvocationContext` type, which provides access to the prompt arguments through the `arguments` property.

::: zone-end

::: zone pivot="programming-language-javascript,programming-language-typescript"

The prompt handler function has two parameters: 

| Parameter | Type | Description |
| --- | --- | --- |
| **ctx** | `PromptInvocationContext` | The prompt invocation context, which includes the prompt `name`, `arguments`, `sessionId`, and `transport` information. |
| **context** | `InvocationContext` | The Azure Functions invocation context, which provides logging and other runtime information. |

::: zone-end

::: zone pivot="programming-language-java"

The MCP prompt trigger binds the prompt invocation context to a function parameter. The trigger can bind to `String` type, which receives the serialized JSON of the prompt invocation context.

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
::: zone pivot="programming-language-java"
In Java, define prompt arguments by using the `@McpPromptArgument` annotation on individual function parameters. Annotate each parameter that represents a prompt argument with this annotation. Specify the argument name, description, and whether it's required.

You can see these annotations used in the [Examples](#example).
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

::: zone pivot="programming-language-javascript,programming-language-typescript"

You provide the `promptArguments` field as an object where each key is the argument name, and the value uses the `promptArg` helpers from `@azure/functions` to define the argument:

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
| `GetPromptResult` (JSON) | When you return a JSON-serialized `GetPromptResult`, it's deserialized and returned directly. This allows you to return multiple messages with different roles. |

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

::: zone pivot="programming-language-java"

The MCP prompt trigger supports the following return types:

| Type | Description |
| --- | --- |
| `String` | Returned as a single user-role text message in the MCP `GetPromptResult`. |

::: zone-end

::: zone pivot="programming-language-csharp,programming-language-java,programming-language-python,programming-language-javascript,programming-language-typescript"

### Prompt discovery

When a function app starts, it registers all prompt trigger functions with the MCP server. Clients discover available prompts by calling the MCP `prompts/list` method. This method returns each prompt's name, title, description, arguments, icons, and metadata (through the `meta` field). Clients invoke a prompt by calling `prompts/get` with the prompt name and arguments.

::: zone-end

::: zone pivot="programming-language-csharp"

### Sessions

The `SessionId` property on `PromptInvocationContext` identifies the MCP session making the request. Use this property to maintain per-session state or apply session-specific logic when generating prompts.

::: zone-end

::: zone pivot="programming-language-csharp,programming-language-python,programming-language-typescript"

For more information, see [Examples](#example).

## host.json settings

The host.json file contains settings that control MCP trigger behaviors. See the [host.json settings](functions-bindings-mcp.md#hostjson-settings) section for details regarding available settings.

::: zone-end

## Related articles

[MCP tool trigger for Azure Functions](functions-bindings-mcp-tool-trigger.md)  
[MCP resource trigger for Azure Functions](functions-bindings-mcp-resource-trigger.md)

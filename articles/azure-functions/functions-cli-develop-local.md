---
title: Develop Azure Functions locally using the Azure Functions CLI (preview)
description: Learn how to develop and test Azure Functions projects locally using the Azure Functions CLI (v5), which uses a workload-based architecture for modular stack-specific tooling.
ms.topic: how-to
ms.date: 05/29/2026
ms.custom:
  - build-2026
zone_pivot_groups: programming-languages-set-functions
#customer intent: As an Azure Functions developer, I want to set up and use the Azure Functions CLI (v5) locally so that I can develop and test functions using the workload-based model.
---

# Develop Azure Functions locally using the Azure Functions CLI (preview)

The Azure Functions CLI is the next major version (v5) of the local development runtime and tooling for Azure Functions. This version of func.exe features a workload-based architecture, so you only download what you need for the stack you develop on.

[!INCLUDE [functions-cli-v5-preview-note](../../includes/functions-cli-v5-preview-note.md)]

[!INCLUDE [functions-cli-version-comparison](../../includes/functions-cli-version-comparison.md)]

For the command reference, see [Azure Functions CLI reference](functions-core-tools-reference.md).

## Install the Azure Functions CLI

The Azure Functions CLI is distributed as a small base install plus workloads that you add for the stacks you develop in. Installer packages are published for Windows, macOS, and Linux. After installation, the `func` binary is on your `PATH`.

> [!NOTE]
> While the Azure Functions CLI is in preview, install the latest preview build from the [Azure Functions Core Tools releases page](https://github.com/Azure/azure-functions-core-tools/releases). Final installation guidance is published with the general availability release.

Verify the install:

```command
func --version
```

After the base CLI is installed, install the workloads for your stack. The fastest way is [`func setup`](functions-core-tools-reference.md#func-setup), which installs the host, the language worker, the extension bundles (when needed), the stack workload, and the templates workload in one step. For example:

::: zone pivot="programming-language-csharp"

```command
func setup --features dotnet
```

::: zone-end

::: zone pivot="programming-language-java"

> [!NOTE]
> Java isn't currently supported in the Azure Functions CLI (v5). Continue using [Core Tools (v4)](functions-run-local.md) for Java development.

::: zone-end

::: zone pivot="programming-language-javascript"

```command
func setup --features node
```

::: zone-end

::: zone pivot="programming-language-typescript"

```command
func setup --features node
```

::: zone-end

::: zone pivot="programming-language-powershell"

> [!NOTE]
> PowerShell isn't currently supported in the Azure Functions CLI (v5). Continue using [Core Tools (v4)](functions-run-local.md) for PowerShell development.

::: zone-end

::: zone pivot="programming-language-python"

```command
func setup --features python
```

::: zone-end

You can also install workloads individually with [`func workload install`](functions-core-tools-reference.md#func-workload-install). Either way, the first time you run `func init`, `func new`, or `func run` without the necessary workloads installed, the CLI prompts you to install them.

## Workloads

The Azure Functions CLI is built around a **workload model**. The base `func` install is small and language-agnostic. Stack-specific tooling, the Functions host, language workers, extension bundles, and templates all come from **workloads** that you install on demand.

Workloads fall into these categories:

- **Host**: The Azure Functions host runtime used by `func run`.
- **Bundles**: Pre-built extension bundle artifacts so triggers and bindings work out of the box (required for non-.NET stacks).
- **Stack**: Language-specific project tooling (for example, `python`, `node`, `dotnet`).
- **Worker**: The language worker the host uses at run time (for example, `python-worker`, `node-worker`).
- **Templates**: Function templates surfaced by `func new` (for example, `python-templates`, `node-templates`).

For the full list of available workloads and their descriptions, see [Available workloads](functions-core-tools-reference.md#available-workloads) in the CLI reference.

### First-run experience

The first time you run `func init`, `func new`, or `func run`, the CLI checks whether the workloads required for your scenario are installed. If they aren't, the CLI prompts you to install them. Accepting the prompt installs the recommended set for the stack you chose. You can decline the prompt and install workloads manually with `func workload install`, or run [`func setup`](functions-core-tools-reference.md#func-setup) to provision the standard set non-interactively.

### Workload updates

Not all Functions language stacks are currently available as workloads. Java and PowerShell stacks aren't currently supported in the Azure Functions CLI. Run `func workload search` periodically to check for newly available workloads. Continue using [Core Tools (v4)](functions-run-local.md) for these unsupported stacks or when you need specific GA features of Core Tools.

## Create a local project

To create a new Functions project, use [`func init`](functions-core-tools-reference.md#func-init):

::: zone pivot="programming-language-csharp"

```command
func init MyProjFolder --stack dotnet
```

::: zone-end

::: zone pivot="programming-language-java"

> [!NOTE]
> Java isn't currently supported in the Azure Functions CLI (v5). Continue using [Core Tools (v4)](functions-run-local.md) for Java development.

::: zone-end

::: zone pivot="programming-language-javascript"

```command
func init MyProjFolder --stack node --language javascript
```

::: zone-end

::: zone pivot="programming-language-typescript"

```command
func init MyProjFolder --stack node --language typescript
```

::: zone-end

::: zone pivot="programming-language-powershell"

> [!NOTE]
> PowerShell isn't currently supported in the Azure Functions CLI (v5). Continue using [Core Tools (v4)](functions-run-local.md) for PowerShell development.

::: zone-end

::: zone pivot="programming-language-python"

```command
func init MyProjFolder --stack python
```

::: zone-end

The `--stack` option specifies which language stack to use. The scaffolding is contributed by the installed workload for that stack.

## Create a function

To add a function from a template, use [`func new`](functions-core-tools-reference.md#func-new):

```command
func new --template "HTTP trigger" --name MyHttpTrigger
```

> [!NOTE]
> `func new` is currently a preview stub until a templates workload is installed for the project's stack. Template-specific options are hydrated dynamically from template metadata.

## Run functions locally

To start the Functions host and run your project, use [`func run`](functions-core-tools-reference.md#func-run):

```command
func run
```

`func start` is preserved as a backward-compatible alias. The host automatically manages Azurite (local storage emulator) unless you pass `--no-azurite`.

## Scaffold from quickstart templates

To browse and scaffold complete sample apps (HTTP APIs, queue workers, Durable Functions orchestrations), use [`func quickstart`](functions-core-tools-reference.md#func-quickstart):

::: zone pivot="programming-language-csharp"

```command
func quickstart --stack dotnet --resource http
```

::: zone-end

::: zone pivot="programming-language-java"

> [!NOTE]
> Java isn't currently supported in the Azure Functions CLI (v5). Continue using [Core Tools (v4)](functions-run-local.md) for Java development.

::: zone-end

::: zone pivot="programming-language-javascript,programming-language-typescript"

```command
func quickstart --stack node --resource http
```

::: zone-end

::: zone pivot="programming-language-powershell"

> [!NOTE]
> PowerShell isn't currently supported in the Azure Functions CLI (v5). Continue using [Core Tools (v4)](functions-run-local.md) for PowerShell development.

::: zone-end

::: zone pivot="programming-language-python"

```command
func quickstart --stack python --resource http
```

::: zone-end

## Manage workloads

Use `func workload` to install, update, and remove workloads. For the full list of subcommands and options, see [`func workload`](functions-core-tools-reference.md#func-workload) in the CLI reference.

## Profiles

Profiles encode version constraints for the host, extension bundles, and workers. Apply a profile at runtime with `func run --profile <name>`. For the full list of subcommands and options, see [`func profile`](functions-core-tools-reference.md#func-profile) in the CLI reference.

## Related content

- [Azure Functions CLI reference](functions-core-tools-reference.md)
- [Develop Azure Functions locally by using Core Tools](functions-run-local.md)
- [Azure Functions Core Tools on GitHub](https://github.com/azure/azure-functions-cli)

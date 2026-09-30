---
title: Create and run dynamic workflows with Azure Functions hosted skills
description: "Enable dynamic workflows for Azure Functions hosted skills, create workflow-safe tools, run a workflow locally, and use the Durable Task Scheduler emulator."
ms.topic: how-to
ms.date: 09/02/2026
ms.update-cycle: 180-days
ai-usage: ai-assisted
ms.collection:
  - ce-skilling-ai-copilot
#Customer intent: As a developer, I want to create and run a dynamic workflow so that my hosted skill can execute durable multistep tool plans.
---

# Create and run dynamic workflows with Azure Functions hosted skills

In this article, you enable [dynamic workflows](functions-hosted-skills-dynamic-workflows.md) for an Azure Functions hosted skill, create workflow-safe Python tools, and run a workflow locally. You can use the default Azure Storage backend or the recommended Durable Task Scheduler (DTS) backend.

[!INCLUDE [functions-hosted-skills-preview](../../includes/functions-hosted-skills-preview.md)]

## Prerequisites

Before you begin, you need:

+ An existing [Azure Functions hosted skills](functions-hosted-skills.md) project that uses Python and has `main.agent.md`. If you don't have one, see [Build an event-driven AI app with Azure Functions hosted skills](scenario-hosted-skills.md).
+ The `azurefunctions-agents-runtime` package in `requirements.txt`.
+ [Azure Functions Core Tools](functions-run-local.md).
+ A model provider configured for the hosted skills runtime.

You also need a storage backend for the workflow runtime. Choose the backend that fits your environment:

### [Azure Storage (default)](#tab/azure-storage)

+ [Azurite](/azure/storage/common/storage-use-azurite) running locally, with `AzureWebJobsStorage` set to `UseDevelopmentStorage=true` in `local.settings.json`. You can instead use a connection string to an Azure Storage account.

No extra configuration is needed. The default Functions extension bundle includes the Durable Task extension.

### [Durable Task Scheduler](#tab/dts)

+ [Azurite](/azure/storage/common/storage-use-azurite) or an Azure Storage account for `AzureWebJobsStorage`, which the Functions host always requires.
+ [Docker Desktop](https://www.docker.com/products/docker-desktop/) for the local [DTS emulator](/azure/durable-task/scheduler/develop-with-durable-task-scheduler). To avoid Docker, you can provision an Azure DTS instance instead. For a quickstart that creates a DTS instance with `azd`, see [Build a serverless workflow using Durable Functions](scenario-build-serverless-workflow.md). 

DTS provides a dashboard with per-instance task state, retry history, and controls for in-flight work.

---

For a complete project that demonstrates this workflow, see the [workflow incident triage sample](https://github.com/Azure/azure-functions-agents-runtime/tree/main/samples/workflow-incident-triage).

## Enable workflows on the hosted skill

Add `workflows.enabled: true` to the front matter of the `.agent.md` file where you want to use dynamic workflows. The following example shows a hosted skill with workflows enabled:

```markdown
---
name: Incident Triage Assistant
description: Investigates incidents by gathering evidence from multiple sources in parallel, correlating findings, and producing a written report.
builtin_endpoints: true
workflows:
  enabled: true
---

You are an incident-triage assistant. When a user describes a production incident, gather evidence from logs, metrics, and deployment history. When the work involves multiple evidence sources or a settling delay, run it as a workflow and summarize the final result for the user.
```

When you set `workflows.enabled` to `true`, the runtime adds the workflow-management tools described in the [dynamic workflows overview](functions-hosted-skills-dynamic-workflows.md#workflow-management-tools).

## Create workflow-safe tools

Dynamic workflows must only call tools that meet these requirements:

+ Run synchronously (not async).
+ Accept a single `dict` argument.
+ Return a JSON-serializable value.
+ Be [idempotent](functions-idempotent.md), because a worker failure can cause the tool to run more than once.

Mark a function as workflow-safe by decorating it with `@workflow_tool` and placing it in the `tools/` folder. If you also want the function available as a normal chat tool, add the `@tool` decorator alongside `@workflow_tool`.

The following example defines three workflow-safe tools. Two tools gather evidence, and one tool summarizes the results:

```python
from typing import Any

from azure_functions_agents import workflow_tool


@workflow_tool(description="Fetch recent log lines for a service.")
def fetch_logs(args: dict[str, Any]) -> dict[str, Any]:
    service = args["service"]
    return {
        "service": service,
        "lines": [
            f"[ERROR] {service}: upstream timeout",
            f"[WARN] {service}: latency above SLO",
        ],
        "errors": 1,
        "warnings": 1,
    }


@workflow_tool(description="Fetch recent service metrics.")
def fetch_metrics(args: dict[str, Any]) -> dict[str, Any]:
    service = args["service"]
    return {
        "service": service,
        "cpu_p99": 86.2,
        "latency_p99_ms": 1420,
        "saturation": "high",
    }


@workflow_tool(description="Summarize logs and metrics into an incident finding.")
def summarize_findings(args: dict[str, Any]) -> dict[str, Any]:
    logs = args["logs"]
    metrics = args["metrics"]
    return {
        "service": logs["service"],
        "likely_cause": "resource pressure is correlated with elevated latency",
        "evidence": [
            f"{logs['errors']} error log entries found",
            f"p99 latency is {metrics['latency_p99_ms']} ms",
        ],
        "recommended_action": "scale out the service and review recent dependency timeouts",
    }
```

## Understand the workflow plan

The model authors the plan that gets passed to `start_workflow`. The following simplified plan gathers logs and metrics in parallel, waits 30 seconds, and then summarizes the results:

```json
{
  "tasks": [
    {
      "id": "logs",
      "type": "tool",
      "tool": "fetch_logs",
      "args": {
        "service": "orders-api"
      }
    },
    {
      "id": "metrics",
      "type": "tool",
      "tool": "fetch_metrics",
      "args": {
        "service": "orders-api"
      }
    },
    {
      "id": "settle",
      "type": "wait",
      "duration": "PT30S",
      "depends_on": [
        "logs",
        "metrics"
      ]
    },
    {
      "id": "summary",
      "type": "tool",
      "tool": "summarize_findings",
      "args": {
        "logs": "${logs.result}",
        "metrics": "${metrics.result}"
      },
      "depends_on": [
        "settle"
      ]
    }
  ]
}
```

>[!TIP]  
>You don't add this plan to the project as a static workflow definition. The model generates it at run time based on the hosted skill instructions, available workflow-safe tools, and the user's request.

In the generated plan, `${task_id.result}` references the full JSON output from an upstream task. For example, `${logs.result}` passes the entire return value of the `logs` task to `summarize_findings`. The model can also reference a specific field with `${task_id.result.path.to.field}`.

## Run locally

Start the Functions host and run a workflow by using the storage backend you chose in the prerequisites.

### [Azure Storage (default)](#tab/azure-storage)

Azure Storage is the default backend. The default Functions extension bundle includes the Durable Task extension, so you don't need extra settings in `host.json`.

1. Start Azurite.

1. From the function app project root, start the Functions host.

    ```console
    func start
    ```

1. Open the built-in chat UI shown in the Core Tools output.

1. Ask the hosted skill to perform work that uses multiple evidence sources. For example:

    ```text
    Investigate latency spikes and intermittent 502 responses on orders-api.
    Gather recent logs and metrics in parallel, wait 30 seconds, and summarize
    the likely cause and recommended action.
    ```

The hosted skill starts a workflow and returns its workflow ID. The chat UI displays live progress and notifies the hosted skill when the workflow completes. The hosted skill then retrieves and summarizes the final result.

### [Durable Task Scheduler](#tab/dts)

DTS is the recommended backend for production-style validation and operator-facing demos. The following steps use the local [DTS emulator](/azure/durable-task/scheduler/develop-with-durable-task-scheduler). If you provisioned an Azure DTS instance instead, skip the `docker run` step and use the connection string from the Azure portal in place of the emulator endpoint.

1. Start the DTS emulator with fixed ports for the scheduler endpoint and dashboard:

    ```bash
    docker run --name dts-emulator -d \
      -p 8080:8080 \
      -p 8082:8082 \
      -e DTS_TASK_HUB_NAMES=default \
      mcr.microsoft.com/dts/dts-emulator:latest
    ```

    The scheduler endpoint is `http://localhost:8080`. Open `http://localhost:8082` to use the dashboard.

1. Add these settings to the `Values` object in `local.settings.json`:

    ```json
    {
      "DURABLE_TASK_SCHEDULER_CONNECTION_STRING": "Endpoint=http://localhost:8080;Authentication=None",
      "TASKHUB_NAME": "default"
    }
    ```

    Keep `AzureWebJobsStorage` configured and keep Azurite running. The Functions host still requires its storage connection even when orchestration state is stored in DTS.

1. Configure the Durable Functions storage provider in `host.json`:

    ```json
    {
      "version": "2.0",
      "extensions": {
        "http": {
          "routePrefix": ""
        },
        "durableTask": {
          "hubName": "%TASKHUB_NAME%",
          "storageProvider": {
            "type": "azureManaged",
            "connectionStringName": "DURABLE_TASK_SCHEDULER_CONNECTION_STRING"
          }
        }
      },
      "extensionBundle": {
        "id": "Microsoft.Azure.Functions.ExtensionBundle",
        "version": "[4.32.0, 5.0.0)"
      }
    }
    ```

    The `azureManaged` provider requires extension bundle version 4.32.0 or later.

1. Start the Functions host:

    ```console
    func start
    ```

1. Open the built-in chat UI and start a workflow.

The workflow uses the local DTS emulator. Use the dashboard at `http://localhost:8082` to inspect workflow instances and task progress.

---

## Related content

+ [Dynamic workflows overview](functions-hosted-skills-dynamic-workflows.md)
+ [Workflow incident triage sample](https://github.com/Azure/azure-functions-agents-runtime/tree/main/samples/workflow-incident-triage)
+ [Workflow subagents sample](https://github.com/Azure/azure-functions-agents-runtime/tree/main/samples/workflow-subagents-preview)
+ [Develop with Durable Task Scheduler](/azure/durable-task/scheduler/develop-with-durable-task-scheduler)
+ [Durable Functions overview](/azure/azure-functions/durable/durable-functions-overview)

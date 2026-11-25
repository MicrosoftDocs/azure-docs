---
title: "Run LangGraph Workflows with Durable Task (Preview)"
description: Attach a LangGraph workflow to Durable Task Scheduler, run an offline graph locally, and configure an authenticated Azure scheduler connection.
author: tamirdresher
ms.author: tamirdresher
ms.topic: how-to
ms.service: durable-task
ms.subservice: durable-task-sdks
ms.date: 11/10/2026
ai-usage: ai-assisted
---

# Run LangGraph workflows with Durable Task (Preview)

The [`langchain_azure_compute.graph` integration](https://github.com/langchain-ai/langchain-azure/tree/main/samples/langgraph-durabletask) attaches a compiled LangGraph graph to Durable Task Scheduler. It registers the orchestrator and activities on a Durable Task worker and provides a client for starting and observing graph runs.

This guide builds a small deterministic graph without a model provider. It demonstrates registration, execution, and result retrieval without model charges or API keys.

> [!IMPORTANT]
> This integration is in **public preview**. Use the `durabletask` extra to install the LangGraph, checkpoint, and Durable Task dependencies required by the integration. The adapter doesn't promise compatibility with every LangGraph feature or future release.

## Prerequisites

- Python 3.11 or later.
- Docker with Linux containers enabled.
- A terminal with access to Python and Docker. The setup commands in this guide use PowerShell.

## Install the packages

Create a working directory and an isolated Python environment, then install the integration:

```powershell
mkdir langgraph-durable
cd langgraph-durable
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install "langchain-azure-compute[durabletask]"
```

## Start the emulator

In another terminal, run:

```powershell
docker run --rm --name dts-langgraph -p 127.0.0.1:8080:8080 -p 127.0.0.1:8082:8082 mcr.microsoft.com/dts/dts-emulator:v0.0.9
```

Keep the container running. This guide uses the emulator's task hub `default` and dashboard at `http://localhost:8082`. If you already have the emulator running for another guide, use that instance instead of binding the same ports twice.

## Create and run a graph

Save the following complete program as `hello_graph.py` in your working directory:

```python
from typing import TypedDict

from durabletask.azuremanaged.client import DurableTaskSchedulerClient
from durabletask.azuremanaged.worker import DurableTaskSchedulerWorker
from langgraph.graph import END, START, StateGraph
from langchain_azure_compute.graph import attach_durability, sdk_options


class HelloState(TypedDict):
    text: str


def normalize(state: HelloState) -> HelloState:
    return {"text": state["text"].strip().lower()}


def greet(state: HelloState) -> HelloState:
    return {"text": f"Hello, {state['text']}!"}


def main():
    builder = StateGraph(HelloState)
    builder.add_node("normalize", normalize)
    builder.add_node("greet", greet)
    builder.add_edge(START, "normalize")
    builder.add_edge("normalize", "greet")
    builder.add_edge("greet", END)

    registration = attach_durability(builder.compile(), name="hello_graph")
    options = sdk_options("127.0.0.1:8080", taskhub="default")
    worker = DurableTaskSchedulerWorker(**options)
    sdk = DurableTaskSchedulerClient(**options)
    registration.register(worker)
    try:
        worker.start()
        client = registration.client(sdk)
        run = client.start({"text": " World "})
        print(run.wait_result(timeout=60))
    finally:
        worker.stop()
        sdk.close()


if __name__ == "__main__":
    main()
```

Run the program from the activated environment:

```powershell
python hello_graph.py
```

Expected output, in addition to SDK logging:

```output
{'text': 'Hello, world!'}
```

Open the emulator dashboard and select task hub `default` to inspect the graph orchestration and activities. Each call to `client.start` without an instance ID creates a new run.

For conditional branches, tool execution, human approval, and worker crash recovery examples, use the [upstream sample catalog](https://github.com/langchain-ai/langchain-azure/tree/main/samples/langgraph-durabletask). Those examples exercise different capabilities; this introductory graph doesn't demonstrate all of them.

## Connect to Azure Durable Task Scheduler

Follow the [Durable Task SDKs Container Apps quickstart](./quickstart-container-apps-durable-task-sdk.md) for scheduler and task hub provisioning, identity configuration, and Azure role assignments. Container Apps is one hosting option, not a requirement of the adapter.

Grant the worker and client identities **Durable Task Data Contributor** access at the appropriate scheduler or task hub scope. Use `az login` for local Azure development, or configure a managed identity on the Azure compute host. See [scheduler managed identity and role assignments](../scheduler/durable-task-scheduler-identity.md).

Set `DTS_ENDPOINT` to your scheduler endpoint, such as `https://<scheduler>.<region>.durabletask.io`, and `DTS_TASKHUB` to the provisioned hub name. Add these imports to `hello_graph.py`:

```python
import os

from azure.identity import DefaultAzureCredential
```

Replace the emulator `options = sdk_options(...)` line with:

```python
options = sdk_options(
    os.environ["DTS_ENDPOINT"],
    taskhub=os.environ["DTS_TASKHUB"],
    token_credential=DefaultAzureCredential(),
)
```

The remaining graph registration, worker, and client code stays the same. `sdk_options` resolves TLS and authentication settings for the Azure endpoint. Don't force an insecure channel for Azure. Use the same endpoint and hub for workers and clients, and use a separate hub per environment.

## Execution and compatibility constraints

- **Understand the activity boundary.** The adapter runs graph steps in activities. By default, supported `ToolNode` tools run as isolated activities, but ordinary graph nodes aren't individually isolated. To give regular nodes their own activity boundary, use the upstream `durable_node` API or the `durable_nodes` option. Don't assume every Python function call is a durable step.
- **Make external effects idempotent.** A step or tool activity can execute more than once after failure. Calls inside a step can be repeated if that step didn't complete durably. Recording a completed result doesn't provide exactly-once external effects.
- **Keep orchestration control flow deterministic.** The adapter supplies the Durable Task orchestrator; graph work runs in its activities. If you add your own Durable Task orchestrator around the graph, follow [orchestrator code constraints](../common/durable-task-code-constraints.md) and don't call external services directly from replayed orchestrator code.
- **Know where checkpoints live.** With `builder.compile()` and no checkpointer override, the adapter attaches an in-memory saver and includes checkpoint bundles in Durable Task payloads. This setup isn't equivalent to having only process-local checkpoints. If you configure a persistent checkpointer, manage that store's availability and access separately.
- **Preserve graph definitions for in-flight work.** Keep graph names and registered handlers stable while runs are active. Use the upstream versioning and migration sample before changing a running graph's topology.
- **Use supported, bounded state.** This example uses a small JSON-compatible dictionary. For custom state types, large payloads, streaming, or advanced LangGraph behavior, check the pinned integration's documented limits and samples rather than assuming general LangGraph compatibility.
- **Distinguish worker recovery from storage lifetime.** Workers sharing a hub can recover pending work with compatible registrations. Removing the disposable emulator can discard local state. This guide's single-process example doesn't simulate worker failure.

## Clean up

Stop the foreground emulator with Ctrl+C when you're finished. Remove Azure resources created solely for testing when they're no longer needed to avoid ongoing charges.

## Next steps

- [LangGraph integration source](https://github.com/langchain-ai/langchain-azure/tree/main/libs/azure-compute/langchain_azure_compute/graph)
- [Agentic application patterns](./durable-agents-patterns.md)
- [Run Pydantic AI agents with Durable Task](./durable-agents-pydantic-ai.md)
- [Monitor Durable Task Scheduler](../scheduler/durable-task-scheduler-dashboard.md)

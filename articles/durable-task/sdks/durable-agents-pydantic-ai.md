---
title: "Run Pydantic AI Agents with Durable Task"
description: Run a Pydantic AI agent with the Durable Task Scheduler emulator, then configure an Azure scheduler connection with Microsoft Entra authentication.
author: tamirdresher
ms.author: tamirdresher
ms.topic: how-to
ms.service: durable-task
ms.subservice: durable-task-sdks
ms.date: 11/10/2026
ai-usage: ai-assisted
---

# Run Pydantic AI agents with Durable Task

The [Pydantic AI Harness Azure Durable Task integration](https://pydantic.dev/docs/ai/harness/azure-durable-task/) runs model requests, tool calls, and durable capability operations as Durable Task activities. Your application supplies a generator-based orchestrator. Completed activity results are recorded in orchestration history and replayed when the orchestrator resumes.

This guide uses Pydantic AI's deterministic `TestModel` so you can run the complete integration locally without an API key, an Azure subscription, or model charges.

This guide uses the standalone Durable Task Python SDK. For Pydantic AI Harness API compatibility and upgrade guidance, see its [version policy](https://pydantic.dev/docs/ai/harness/#version-policy).

## Prerequisites

- Python 3.11 or later.
- Docker with Linux containers enabled.
- A terminal with access to Python and Docker. The setup commands in this guide use PowerShell.

## Install the packages

Create a working directory and an isolated Python environment:

```powershell
mkdir pydantic-durable
cd pydantic-durable
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install "pydantic-ai-harness[azure-durable-task]==0.66.0" "pydantic-ai-slim==2.66.0"
```

The `azure-durable-task` extra installs the Durable Task SDK, its Azure-managed client and worker, and Azure Identity. The offline example doesn't require a provider extra.

## Start the emulator

In another terminal, run:

```powershell
docker run --rm --name dts-pydantic -p 127.0.0.1:8080:8080 -p 127.0.0.1:8082:8082 mcr.microsoft.com/dts/dts-emulator:v0.0.9
```

Keep the container running. The emulator exposes a task hub named `default`. Its dashboard is at `http://localhost:8082`. If those ports are in use, stop your other emulator or adjust both the published ports and the Python connection settings.

## Create and run the agent

Save the following complete program as `agent.py`:

```python
from durabletask import task
from durabletask.client import TaskHubGrpcClient
from durabletask.worker import TaskHubGrpcWorker
from pydantic_ai import Agent
from pydantic_ai.models.test import TestModel
from pydantic_ai_harness.azure_durable_task import (
    AzureDurableTaskDurability,
    run_durable,
)

agent = Agent(
    TestModel(custom_output_text="Hello from a durable Pydantic AI agent!"),
    name="hello_agent",
    capabilities=[AzureDurableTaskDurability()],
)


def hello(ctx: task.OrchestrationContext, prompt: str):
    result = yield from run_durable(ctx, lambda: agent.run(prompt))
    return result.output


def main():
    worker = TaskHubGrpcWorker(
        host_address="localhost:8080",
        metadata=[("taskhub", "default")],
        secure_channel=False,
    )
    worker.add_orchestrator(hello)
    durability = AzureDurableTaskDurability.from_agent(agent)
    assert durability is not None

    with durability.register(worker), worker, TaskHubGrpcClient(
        host_address="localhost:8080",
        metadata=[("taskhub", "default")],
        secure_channel=False,
    ) as client:
        worker.start()
        instance_id = client.schedule_new_orchestration(hello, input="Say hello.")
        state = client.wait_for_orchestration_completion(instance_id, timeout=60)
        if state is None:
            raise TimeoutError(f"Orchestration {instance_id} did not complete.")
        state.raise_if_failed()
        print(state.get_output())


if __name__ == "__main__":
    main()
```

Run the program from the activated environment:

```powershell
python agent.py
```

Expected output, in addition to SDK logging:

```output
Hello from a durable Pydantic AI agent!
```

Open the emulator dashboard and select task hub `default` to inspect the completed `hello` orchestration and its activity history. Running the program again starts a new orchestration; it doesn't resume the previous instance.

`Agent` binds a copy of each capability. Retrieve that bound instance with `from_agent`, and enter its `register(worker)` context before starting the worker. Keep the context open until the worker stops. Calling `agent.run` without `run_durable` doesn't make a run durable.

### Use a real model

When you're ready to call a provider, install its extra:

```powershell
python -m pip install "pydantic-ai-slim[openai]==2.66.0"
```

Set `OPENAI_API_KEY` through your shell or secret-management system. Don't put the key in source control. Replace the `agent` construction in `agent.py` with:

```python
agent = Agent(
    "openai:gpt-4o-mini",
    name="hello_agent",
    capabilities=[AzureDurableTaskDurability()],
)
```

Use a model available to your provider account. This change makes billable model requests and produces model-generated text instead of the fixed test response.

## Connect to Azure Durable Task Scheduler

For managed storage, follow the [Durable Task SDKs Container Apps quickstart](./quickstart-container-apps-durable-task-sdk.md) for scheduler and task hub provisioning, identity configuration, and Azure role assignments. You can use another compute host; these Python APIs don't require Container Apps.

Grant the worker and client identities the **Durable Task Data Contributor** role at the appropriate scheduler or task hub scope. For local Azure development, sign in with `az login`. For an Azure-hosted worker, configure a managed identity that `DefaultAzureCredential` can use. See [scheduler managed identity and role assignments](../scheduler/durable-task-scheduler-identity.md).

Set `DTS_ENDPOINT` to the scheduler's hostname, such as `<scheduler>.<region>.durabletask.io`, and `DTS_TASKHUB` to the provisioned hub name. These aren't API keys. Replace `main` in the program with the following implementation and add these imports:

```python
import os

from azure.identity import DefaultAzureCredential
from durabletask.azuremanaged.client import DurableTaskSchedulerClient
from durabletask.azuremanaged.worker import DurableTaskSchedulerWorker


def main():
    with DefaultAzureCredential() as credential:
        worker = DurableTaskSchedulerWorker(
            host_address=os.environ["DTS_ENDPOINT"],
            taskhub=os.environ["DTS_TASKHUB"],
            token_credential=credential,
        )
        worker.add_orchestrator(hello)
        durability = AzureDurableTaskDurability.from_agent(agent)
        assert durability is not None
        with durability.register(worker), worker, DurableTaskSchedulerClient(
            host_address=os.environ["DTS_ENDPOINT"],
            taskhub=os.environ["DTS_TASKHUB"],
            token_credential=credential,
        ) as client:
            worker.start()
            instance_id = client.schedule_new_orchestration(hello, input="Say hello.")
            state = client.wait_for_orchestration_completion(instance_id, timeout=60)
            if state is None:
                raise TimeoutError(f"Orchestration {instance_id} did not complete.")
            state.raise_if_failed()
            print(state.get_output())
```

Place the imports and replacement function before the existing `if __name__ == "__main__":` block. Don't carry the emulator's `secure_channel=False` setting into an Azure connection. Use the same endpoint and hub for the client and worker, and separate hubs for separate environments. The model provider's credentials are independent of scheduler authentication.

## Replay and operational constraints

- **Keep orchestrator-side code deterministic.** Instruction functions, hooks, output validators, and tools explicitly configured to run inline can execute during replay. Don't perform network, file, or other side effects there. Put external work in activity-backed tools or durable capability operations. See [orchestrator code constraints](../common/durable-task-code-constraints.md).
- **Make side effects idempotent.** Activities can execute more than once if a worker fails after performing external work but before recording completion. Persisted results avoid repeating completed activities during replay, but don't provide exactly-once external effects.
- **Preserve persisted names.** Agent and tool names contribute to activity names. Don't rename them while affected orchestrations are running.
- **Use serializable data.** Dependencies must be JSON-serializable and match `deps_type`. Create connections inside the tools that need them. Return JSON-compatible orchestration output; for a Pydantic model, use `result.output.model_dump(mode="json")`.
- **Don't expect live client streaming.** Model streams are buffered within activities. This adapter doesn't forward a live token stream to the orchestration client.
- **Plan worker recovery separately from emulator persistence.** A replacement worker needs the same registrations and task hub to process pending work. The disposable emulator in this guide isn't a production state store, and the sample doesn't simulate a crash.

## Clean up

Stop the foreground emulator with Ctrl+C when you're finished. Provisioned Azure schedulers and compute resources can incur charges; remove resources created solely for testing when you no longer need them.

## Next steps

- [Pydantic AI integration source and upstream examples](https://github.com/pydantic/pydantic-ai/tree/main/src/pydantic_ai_harness/pydantic_ai_harness/azure_durable_task)
- [Agentic application patterns](./durable-agents-patterns.md)
- [Run LangGraph workflows with Durable Task](./durable-agents-langgraph.md)
- [Monitor Durable Task Scheduler](../scheduler/durable-task-scheduler-dashboard.md)

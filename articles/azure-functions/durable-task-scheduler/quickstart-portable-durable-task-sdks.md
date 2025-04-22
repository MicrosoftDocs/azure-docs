---
title: "Quickstart: Set a portable Durable Task SDK in your application to use Azure Functions Durable Task Scheduler (preview)"
description: Learn how to configure an existing app for the Azure Functions Durable Task Scheduler using the portable Durable Task SDKs.
ms.topic: how-to
ms.date: 04/10/2025
zone_pivot_groups: df-languages
---

# Quickstart: Set a portable Durable Task SDK in your application to use Azure Functions Durable Task Scheduler (preview)

This sample demonstrates how to use the Durable Task SDK, also known as the Portable SDK, with the Durable Task Scheduler to create orchestrations. These orchestrations not only spin off child orchestrations but also perform parallel processing by leveraging the fan-out/fan-in application pattern.

The scenario showcases an order processing system where orders are processed in batches.

Checklist of what to expect in this quickstart

Diagram?

::: zone pivot="csharp,python"

## Prerequisites

::: zone-end

::: zone pivot="csharp"



::: zone-end


::: zone pivot="python"

Before you begin:

- Install [Docker](https://docs.docker.com/engine/install/).
- Clone the [Durable Task Scheduler GitHub repository](https://github.com/Azure-Samples/Durable-Task-Scheduler) to use the quickstart sample.
    
::: zone-end

::: zone pivot="csharp,python"

## Set up the Durable Task Scheduler emulator

::: zone-end

::: zone pivot="csharp"



::: zone-end


::: zone pivot="python"

1. From the `Azure-Samples/Durable-Task-Scheduler` root directory, navigate to the Python SDK sample dirctory. 

     # [Bash](#tab/bash)
     
     ```bash
     cd samples/portable-sdks/python/sub-orchestrations-with-fan-out-fan-in
     ```
     
     # [PowerShell](#tab/powershel)
     
     ```powershell
     cd samples/portable-sdks/python/sub-orchestrations-with-fan-out-fan-in
     ```
     
     ---

1. Pull the Docker image for the emulator.

     # [Bash](#tab/bash)
     
     ```bash
     docker pull mcr.microsoft.com/dts/dts-emulator:v0.0.6
     ```
     
     # [PowerShell](#tab/powershel)
     
     ```powershell
     docker pull mcr.microsoft.com/dts/dts-emulator:v0.0.6
     ```
     
     ---

1. Run the emulator. The container may take a few seconds to be ready.

     # [Bash](#tab/bash)
     
     ```bash
     docker run --name dtsemulator -d -p 8080:8080 mcr.microsoft.com/dts/dts-emulator:v0.0.6
     ```
     
     # [PowerShell](#tab/powershel)
     
     ```powershell
     docker run --name dtsemulator -d -p 8080:8080 mcr.microsoft.com/dts/dts-emulator:v0.0.6
     ```
     
     ---

1. Set the environment variables.

     # [Bash](#tab/bash)
     
     ```bash
     export TASKHUB=<taskhubname>
     export ENDPOINT=<taskhubEndpoint>
     ```
     
     # [PowerShell](#tab/powershel)
     
     ```powershell
     $env:TASKHUB = "<taskhubname>"
     $env:ENDPOINT = "<taskhubEndpoint>"
     ```
     
     ---

::: zone-end

::: zone pivot="csharp,python"

## Update the orchestration and worker applications

::: zone-end

::: zone pivot="csharp"



::: zone-end


::: zone pivot="python"

1. Open the sample in your preferred code editor and select the `worker.py` application.

1. Change the `token_credential` input value for `DurableTaskSchedulerWorker` to `None`.

     ```python
     # ...

     with DurableTaskSchedulerWorker(host_address=endpoint, secure_channel=True,
                                taskhub=taskhub_name, token_credential=None) as w:

     # ...
     ```
     
1. Save `worker.py`.
1. Open the `orchestrator.py` application.
1. Change the `token_credential` input value for `DurableTaskSchedulerClient` to `None`.

     ```python
     # ...

     c = DurableTaskSchedulerClient(host_address=endpoint, secure_channel=True,
                               taskhub=taskhub_name, token_credential=None)

     # ...
     ```

1. Save `orchestrator.py`.

::: zone-end

::: zone pivot="csharp,python"

## Run the applications

::: zone-end

::: zone pivot="csharp"



::: zone-end

::: zone pivot="python"


1. Start the worker. Ensure the `TASKHUB` and `ENDPOINT` environment variables are set in your shell. 

     # [Bash](#tab/bash)
     
     ```bash
     python3 ./worker.py
     ```
     
     # [PowerShell](#tab/powershel)
     
     ```powershell
     python3 ./worker.py
     ```
     
     ---

1. Start the orchestrator. Ensure the `TASKHUB` and `ENDPOINT` environment variables are set in your shell. 

     # [Bash](#tab/bash)
     
     ```bash
     python3 ./orchestrator.py
     ```
     
     # [PowerShell](#tab/powershel)
     
     ```powershell
     python3 ./orchestrator.py
     ```
     
     ---

> [!NOTE]
> Python3.exe is not defined in Windows. If you receive an error when running `python3`, try `python` instead.

::: zone-end

::: zone pivot="csharp,python"

## View orchestration status and history

You can view the orchestration status and history via the [Durable Task Scheduler dashboard](./durable-task-scheduler-dashboard.md). By default, the dashboard runs on port 8082. 

1. Navigate to `http://localhost:8082`.
1. Click on the default taskhub.

::: zone-end

## What happened?

::: zone pivot="csharp"



::: zone-end


::: zone pivot="python"

When you started the worker and orchestrator, 
    
::: zone-end





::: zone pivot="javascript"

::: zone-end

::: zone pivot="java"

::: zone-end

::: zone pivot="powershell"

::: zone-end

## Next steps
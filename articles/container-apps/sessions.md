---
title: Dynamic sessions in Azure Container Apps
description: Learn about dynamic sessions in Azure Container Apps.
services: container-apps
author: craigshoemaker
ms.service: azure-container-apps
ms.topic: concept-article
ms.date: 04/07/2025
ms.author: cshoe
ms.custom: references_regions, ignite-2024
---

# Dynamic sessions in Azure Container Apps

Azure Container Apps dynamic sessions provide fast access to secure sandboxed environments that are ideal for running code or applications that require strong isolation from other workloads.

Dynamic sessions offer prewarmed environments through a [session pools](./session-pool.md) that starts the container in milliseconds, scales on demand, and maintains strong isolation. This makes them ideal for interactive workloads, running LLM generated scripts, and secure execution of custom code.


## Benefits
With sessions, you get:

- **Secure isolation**: Hyper-V isolation and optional network controls protect your environment. Sessions are isolated from each other and from the host environment, providing enterprise-grade security and isolation.  
- **Sandboxed environments**: Each session runs in its own isolated environment, ensuring that workloads don't interfere with each other.
- **Instant Startup**: Prewarmed pools enable subsecond launch times for interactive workloads. New sessions are allocated in milliseconds thanks to pools of ready but unallocated sessions.  
- **Scalable by Design**: Handle hundreds or thousands of concurrent sessions without manual intervention. 
- **Managed lifecycle**: Sessions are automatically deprovisioned after use or after a configurable cooldown period, ensuring efficient resource usage. 


## Common Scenarios
Dynamic sessions are useful in a variety of situations, including:
- **AI/LLM Workflows**: Safely execute AI-generated code in isolated environments without risking your production systems.
- **Interactive Development**: Provide developers with fast, disposable environments for testing scripts or prototypes without provisioning full apps.
- **Secure Code Execution**: Run untrusted or user-submitted code in a sandboxed environment with strong isolation.
- **Custom Compute Tasks**: Execute short-lived jobs that require custom dependencies or runtime environments without long startup times.
- **Burst Workloads**: Handle unpredictable spikes in demand by scaling sessions up and down automatically.


## Key Concepts
- **Session Pool**: A session pool is the foundation for dynamic sessions. It contains a set of prewarmed, ready-to-use sessions that enable near instant startup. When a request comes in, the system allocates a session from the pool instead of creating one from scratch, which dramatically reduces latency.  

- **Session**: A session is the actual execution environment where your code or container runs. Sessions are ephemeral and isolated, designed for short-lived tasks. When you create a session, it's allocated from the session pool, ensuring fast startup. After the task completes or the cooldown period expires, the session is destroyed and resources are cleaned up.  

- **Session lifecycle**: When your application sends a request with a session identifier, the session pool allocates a session automatically. The session stays active as long as requests continue. Once the cooldown period expires with no activity, the session is destroyed and its resources are cleaned up automatically.

- **Request routing and identifiers**: Sessions are accessed through the session pool management endpoint. Requests include an `identifier` query parameter, and the pool routes the request to an existing session or allocates a new one if needed. The request path after the management endpoint is forwarded to the session container.

- **Session pool types**
  - **Code interpreter session pools**: These use platform built-in containers that provide preconfigured environments for running code, including AI-generated scripts. Ideal for scenarios like LLM-driven workflows or secure code execution.
  - **Custom container session pools**: Bring-your-own-container for custom workloads that require specific dependencies or runtime environments.


#### Session pool types comparison

| | **Code interpreter session pool** | **Custom container session pool** |
|---------------|------------------------------|------------------------------|
| **Best for** | Running AI‑generated code, user-submitted scripts, or quick secure code execution without managing a runtime environment. | Workloads requiring a custom runtime, libraries, binaries, or specialized tools not supported by built-in interpreters. |
| **Environment** | Preconfigured with common runtimes and tools; no container build or image publishing required. | Fully customizable container image with your own dependencies, packages, and configuration. |
| **When to choose** | Choose this for simplicity, fastest startup, and minimal setup. | Choose this when you need full control over the execution environment or rely on custom dependencies. |
| **Ideal use cases** | LLM workflows, code interpretation, educational/sandbox scenarios, safe execution of user code. | Custom compute tasks, proprietary interpreters, specialized environments, or workloads with specific OS/library requirements. |
| **Language and protocol** | Limited to the built-in runtimes and the REST API surface provided by the code interpreter. | Any language or stack supported by your container, with any TCP protocol you choose to expose. |
| **Image requirement** | None—uses platform built‑in interpreter environments. | Required—supply your own container image URI. |

For more information, see [Usage](./sessions-usage.md).


## Supported regions

Dynamic sessions are available in the following regions. Both code interpreter and custom container sessions are supported in all listed regions.

| Americas | Europe | Asia Pacific | Middle East & Africa |
|----------|--------|--------------|----------------------|
| Brazil South | France Central | Australia East | South Africa North |
| Canada Central | France South | Australia Southeast | UAE North |
| Canada East | Germany West Central | Central India | |
| Central US | Italy North | East Asia | |
| East US | North Europe | Japan East | |
| East US 2 | Norway East | Japan West | |
| North Central US | Poland Central | Jio India West | |
| West Central US | Spain Central | Korea Central | |
| West US | Sweden Central | South India | |
| West US 2 | Switzerland North | Southeast Asia | |
| West US 3 | Switzerland West | | |
| | UK South | | |
| | UK West | | |
| | West Europe | | |

> [!NOTE]
> Regional availability may change. To verify current availability, check the **Location** dropdown when creating a session pool in the Azure portal.

## Security
Dynamic sessions are designed to run untrusted code in isolated environments. For information about securing your sessions, see [Security](./sessions-usage.md#security).


## Billing
Custom container sessions are billed based on the resources consumed by the session pool. For more information, see [Azure Container Apps billing](./billing.md#dynamic-sessions).


## Next steps
- Learn how to configure [session pools](./session-pool.md) 
- Learn how to use [dynamic sessions](./sessions-usage.md), including security and best practices


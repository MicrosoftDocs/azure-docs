---
title: Python Tools in Azure SRE Agent
description: Extend your agent to reach internal systems, multicloud platforms, and custom business logic by creating Python tools.
ms.topic: how-to
ms.service: azure-sre-agent
ms.date: 03/09/2026
author: craigshoemaker
ms.author: cshoe
ms.ai-usage: ai-assisted
ms.custom: python, custom tools, extensibility, hybrid, multicloud, custom logic
#customer intent: As an SRE builder, I want to create Python tools for my agent so that I can extend its capabilities to reach internal systems and apply custom business logic.
---

# Python tools in Azure SRE Agent
Python tools extend your Azure SRE Agent beyond built-in Azure capabilities. Create custom tools that connect to internal APIs, on-premises databases, multicloud platforms, and proprietary systems using Python code. Describe what you need in plain English, paste existing scripts, or wrap HTTP endpoints, then test and deploy without a restart.

> [!TIP]
> - Extend your agent to reach systems it doesn't have built-in support for.
> - Connect to internal APIs, on-premises databases, and multicloud platforms.
> - Encode custom business logic (SLA calculations, cost models, compliance rules).

## The problem

Your agent has powerful built-in tools for Azure, including Kusto queries, Azure Monitor, and ARM operations. But your organization doesn't live entirely in Azure:

- **Internal systems**: CMDB databases, custom ticketing systems, and internal APIs that only your organization uses.
- **Multicloud**: Datadog dashboards, Splunk logs, and AWS CloudWatch metrics alongside Azure.
- **Legacy infrastructure**: On-premises databases, proprietary protocols, and systems without modern APIs.
- **Custom business logic**: SLA calculations specific to your contracts, cost allocation formulas, and capacity planning models.

The agent can diagnose Azure problems, but it can't reach your internal systems or apply your organization's unique logic unless you extend it.

## How Python tools work

Python tools let you teach your agent new capabilities. Describe what you need, generate the code, test it, and deploy. Your agent can then reach systems and apply logic that weren't possible before.

:::image type="content" source="media/common/python-tool-generate.png" alt-text="Screenshot of the Python tool dialog.":::

The generated code follows a consistent pattern:

- A `main()` function that accepts typed parameters.
- JSON-serializable return values.
- Descriptive docstrings that explain the logic.

Before creating the tool, test it with real inputs in the playground. Enter parameter values, select **Test**, and see actual results, not just syntax validation.

:::image type="content" source="media/common/python-tool-test-result.png" alt-text="Screenshot of test playground showing successful execution with SLA calculation result.":::

After you test the tool, select **Create tool**. Your agent can immediately use it with no restart and no deployment pipeline.

## Python tools vs. MCP connectors

For third-party platforms, you have two options.

| Approach | Best for | Examples |
|---|---|---|
| [MCP connectors](connectors.md) | Popular platforms with standard APIs | Datadog, Splunk, ServiceNow, GitHub |
| Python tools | Internal systems, custom logic, platforms without MCP | Your CMDB, proprietary APIs, custom calculations |

**Use MCP connectors when** a connector exists for your platform. MCP provides structured schemas, authentication management, and consistent behavior.

**Use Python tools when** you need to reach internal systems, encode custom business logic, or connect to platforms without MCP support.

## What makes this different

The following table compares agent capabilities with and without Python tools.

| Without Python tools | With Python tools |
|---|---|
| Agent can only use built-in capabilities | Agent reaches any system Python can call |
| Internal APIs require separate workflows | Internal systems become agent tools |
| Custom logic lives in external scripts | Business rules execute within agent conversations |
| On-premises systems are disconnected from the agent | Hybrid environments are fully accessible |

Python tools turn your agent from an Azure-native assistant into an extensible platform that works with your entire infrastructure.

## Before and after

| Before | After |
|---|---|
| "Our CMDB is on-premises, agent can't see it" | Python tool with network access queries internal systems |
| "We have custom SLA formulas nobody has automated" | Encode your formulas as a tool; the agent applies them automatically |
| "Compliance reports need specific PDF formatting" | Generate reports with ReportLab, served through the agent |

## Prerequisites

- Builder access to an Azure SRE Agent.
- For HTTP endpoints: URL and authentication credentials for your target systems.

## Create a Python tool

You can create Python tools by using three approaches.

| Approach | You provide | Agent does | Best for |
|---|---|---|---|
| **Describe in plain English** | "Calculate SLA from uptime and downtime" | Generates complete Python code | Quick custom logic, no coding needed |
| **Paste existing code** | Your Python function | Wraps it as a tool | Migrating existing scripts, complex logic |
| **Call HTTP endpoints** | Endpoint URL and auth | Calls your API via HTTP | Azure Functions, Lambda, internal APIs, webhooks |

### Option 1: Let AI write the code

Describe what you need in the dialog and select **Generate**. AI creates a working Python function with typed parameters, error handling, and docstrings.

**You describe:** "Calculate SLA compliance from uptime and downtime minutes, return whether it meets 99.9% threshold"

**Agent generates:** A complete `main()` function ready to test and deploy.

### Option 2: Bring your own code

Paste existing Python into the **Code** tab. The function must follow this pattern:

```python
def main(param1: str, param2: int) -> dict:
    # Your logic here
    return {"result": "value"}
```

### Option 3: Call HTTP endpoints

Wrap any HTTP endpoint (Azure Functions, AWS Lambda, internal APIs, or webhooks) as a Python tool:

```python
def main(input_data: str) -> dict:
    import requests

    # Azure Function with function key
    response = requests.post(
        "https://<FUNCTION_APP_NAME>.azurewebsites.net/api/<ENDPOINT>?code=<FUNCTION_KEY>",
        json={"data": input_data}
    )

    # Or internal API with bearer token
    # response = requests.get(
    #     "https://internal-api.corp/resource",
    #     headers={"Authorization": "Bearer <API_TOKEN>"}
    # )

    return response.json()
```

> [!NOTE]
> Python tools have outbound network access. You can call any HTTP endpoint your network allows. For authenticated endpoints, include API keys or tokens in headers or query parameters.

## Example scenarios

The following examples demonstrate common use cases for Python tools.

**Internal CMDB query:**

```python
def main(server_name: str) -> dict:
    """Query internal CMDB for server configuration."""
    import requests
    response = requests.get(f"https://cmdb.internal.corp/api/servers/{server_name}")
    return response.json()
```

**Custom SLA calculation:**

```python
def main(uptime_minutes: int, downtime_minutes: int) -> dict:
    """Calculate SLA using your organization's formula."""
    total = uptime_minutes + downtime_minutes
    sla = (uptime_minutes / total) * 100 if total > 0 else 100.0
    return {"sla_percent": round(sla, 4), "meets_target": sla >= 99.9}
```

**Compliance report generation:**

```python
def main(incidents: list, month: str) -> dict:
    """Generate PDF compliance report."""
    from reportlab.platypus import SimpleDocTemplate
    doc = SimpleDocTemplate(f"/mnt/data/compliance-{month}.pdf")
    # Build report...
    return {"report_path": f"/api/files/compliance-{month}.pdf"}
```

## Verify your tool works

After you create the tool, test it in a new chat:

```text
Calculate SLA for 43185 minutes uptime and 15 minutes downtime
```

Your agent should recognize that the task matches your tool and call it automatically.

## Execution environment

The following table describes the execution environment for Python tools.

| Property | Value |
|---|---|
| **Timeout** | 5 to 900 seconds (default: 120) |
| **Isolation** | Fresh container per execution |
| **File system** | `/mnt/data` for temporary files |
| **Network** | Outbound connectivity enabled |
| **Packages** | 700+ preinstalled (pandas, requests, azure-identity, reportlab, and more) |
| **State** | No persistence between calls |

## Authentication for Azure resources

Python tools can authenticate to Azure resources by using managed identity with preset scopes.

| Scope | Access |
|---|---|
| **ARM** | Azure Resource Manager (`management.azure.com`) |
| **Key Vault** | Secrets, keys, certificates (`vault.azure.net`) |
| **Storage** | Blob, queue, table storage (`storage.azure.com`) |

Enable authentication in the **Identity** tab when creating a tool.

## Limitations

- **No persistent state**: Each execution starts fresh. Store results externally if needed.
- **Timeout maximum**: 900 seconds (15 minutes) for long-running operations.
- **No GPU**: CPU-only execution environment.
- **JSON output required**: Return values must be JSON-serializable.

## Next step

> [!div class="nextstepaction"]
> [Create a Python tool](./create-python-tool.md)

## Related content

- [Tools overview](./tools.md)
- [Connectors](./connectors.md)

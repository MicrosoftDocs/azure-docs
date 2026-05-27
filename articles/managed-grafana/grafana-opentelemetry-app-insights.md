---
title: Monitor AI coding agents with Grafana
description: Monitor cost, adoption, and reliability for GitHub Copilot, Claude Code, Codex, OpenClaw, OpenCode, and Gemini CLI with Grafana dashboards built on OpenTelemetry and Application Insights.
#customer intent: As a developer or platform engineer, I want to monitor my AI coding agents (GitHub Copilot, Claude Code, Codex, OpenClaw, OpenCode, Gemini CLI) so that I can track cost, adoption, reliability, and security across my engineering organization.
author: weng5e
ms.author: wuweng
ms.reviewer: malev
ms.service: azure-managed-grafana
ms.topic: how-to
ms.collection: ce-skilling-ai-copilot
ms.date: 05/26/2026
---

# Monitor AI coding agents with Grafana

AI coding agents — GitHub Copilot, Claude Code, Codex, OpenClaw, OpenCode, Gemini CLI, and others — are quickly becoming part of how engineering teams ship software. Adoption is the easy part. The harder questions follow soon after:

- **How much are we spending?** Which models, which teams, and which tasks drive the cost?
- **Who is actually using which agent, and for what?** Are tools being invoked the way you expect?
- **Is the experience reliable?** Where do agents stall, error out, or leave sessions stuck?
- **Can we audit what the agents did?** Prompts, tool calls, and model choices for security and compliance review.

Grafana gives you a single pane of glass for these questions across multiple coding agents. This guide walks through the setup end-to-end: standing up the telemetry pipeline, pointing each agent at it, and importing the ready-made dashboards.

> [!NOTE]
> The OpenTelemetry Collector (including the `contrib` distribution) and the [Azure Monitor Exporter](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/exporter/azuremonitorexporter) are open-source components. Support for these components is provided exclusively through community channels. To submit bug reports, request new features, or report other issues, create a new issue in the [opentelemetry-collector-contrib](https://github.com/open-telemetry/opentelemetry-collector-contrib/issues) repository. Microsoft Azure Support covers the Azure services in this pipeline: Application Insights, Log Analytics, and Grafana.

## What you'll see

Purpose-built Grafana dashboards visualize the signals that matter for AI coding agents — cost, token consumption, sessions, model usage, tool invocations, latency, and errors:

| Dashboard | What it shows | Link |
| --- | --- | --- |
| [GitHub Copilot](https://aka.ms/amg/dash/gh-copilot) | Operations, input/output tokens, chat sessions, tool calls, response time and time to first token (TTFT) by model | [aka.ms/amg/dash/gh-copilot](https://aka.ms/amg/dash/gh-copilot) |
| [Claude Code](https://aka.ms/amg/dash/claude-code) | Cost, sessions, user prompts, API requests/errors, daily cost and token trends, per-model breakdown, tool usage analytics | [aka.ms/amg/dash/claude-code](https://aka.ms/amg/dash/claude-code) |
| [Codex](https://aka.ms/amg/dash/codex) | Sessions, turns, token usage by type and model, turn/TTFT latency percentiles, tool reliability and latency, sandbox/approval activity, sessions by client | [aka.ms/amg/dash/codex](https://aka.ms/amg/dash/codex) |
| [OpenClaw](https://aka.ms/amg/dash/openclaw) | Messages, unique chats, response time, LLM calls, token usage, cache reads, stuck sessions, model usage breakdown | [aka.ms/amg/dash/openclaw](https://aka.ms/amg/dash/openclaw) |
| [OpenCode](https://aka.ms/amg/dash/opencode) | Sessions, prompts, LLM calls, token usage, tool executions, p95 prompt latency, cache hit ratio, per-model/provider breakdown | [aka.ms/amg/dash/opencode](https://aka.ms/amg/dash/opencode) |
| [Gemini CLI](https://aka.ms/amg/dash/geminicli) | Traces, prompts, tool calls, and session context | [aka.ms/amg/dash/geminicli](https://aka.ms/amg/dash/geminicli) |

:::image type="content" source="media/grafana-opentelemetry-app-insights/claude-code-main.png" alt-text="Screenshot of the Claude Code dashboard in Grafana, showing cost, sessions, daily cost and token trends, per-model breakdown, and tool usage analytics." lightbox="media/grafana-opentelemetry-app-insights/claude-code-main.png":::

## Who this guide is for

The same dashboards serve different audiences:

- **Platform and developer experience teams** — track adoption trends, spend by team and model, and surface inefficient usage patterns.
- **Engineering leaders** — correlate agent activity with delivery and answer "is this investment paying off?"
- **Security and governance teams** — review prompts, tool invocations, and model choices for compliance and risk.
- **Individual developers and on-call engineers** — debug agent behavior, slow tool calls, or stuck sessions.

## How it works

:::image type="content" source="media/grafana-opentelemetry-app-insights/grafana-coding-agent-diagram.png" alt-text="Diagram explaining the agent flow.":::

- Each **AI coding agent** (GitHub Copilot, Claude Code, Codex, OpenClaw, OpenCode, or Gemini CLI) emits OpenTelemetry traces, metrics, and logs to a configured OTLP endpoint.
- An **OpenTelemetry Collector** terminates OTLP at that endpoint and forwards the data to Application Insights using the Azure Monitor Exporter.
- **Grafana** queries Application Insights via the Azure Monitor data source (Log Analytics / KQL) to render the dashboards.

The OpenTelemetry Collector and the Application Insights pipeline are infrastructure — a one-time setup. The rest of this guide walks through it.

## Prerequisites

- An Application Insights resource. If you don't have one yet, [create one and attach it to a Log Analytics workspace](/azure/azure-monitor/app/create-workspace-resource).
- [Docker installed.](https://docs.docker.com/engine/install/)
- Grafana 11.6 or later (for example, [Azure Managed Grafana](/azure/managed-grafana/)) with an Azure Monitor data source that can read your Application Insights resource.

## Step 1: Run the OpenTelemetry Collector

Deploy an [OpenTelemetry Collector](https://opentelemetry.io/docs/collector/) (the `contrib` distribution) configured with the [Azure Monitor Exporter](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/exporter/azuremonitorexporter). The collector bridges OTLP from each agent to the Application Insights ingestion API.

> [!NOTE]
> Azure Monitor also supports native OTLP ingestion as an alternative to the path shown in this guide. The dashboards work with either path because data lands in the same Application Insights / Log Analytics tables. For more information, see [Ingest OTLP data into Azure Monitor with the OpenTelemetry Collector (Preview)](/azure/azure-monitor/containers/opentelemetry-protocol-ingestion).

### Get the Application Insights connection string

The collector needs an Application Insights **connection string** to export telemetry. To retrieve it from the Azure portal:

1. Sign in to the [Azure portal](https://portal.azure.com/).
1. Navigate to your **Application Insights** resource.
1. In the left menu, select **Overview**.
1. Locate the **Connection String** field in the Essentials panel and select the copy icon next to it.

The value looks like:

```
InstrumentationKey=00000000-0000-0000-0000-000000000000;IngestionEndpoint=https://<region>.in.applicationinsights.azure.com/;LiveEndpoint=https://<region>.livediagnostics.monitor.azure.com/;ApplicationId=00000000-0000-0000-0000-000000000000
```

> [!IMPORTANT]
> Treat the connection string as a secret. Anyone with access to it can send data to your Application Insights resource.

### Create the collector configuration

Save the following as `otel-collector-config.yaml`, replacing the `<YOUR-KEY>` and `<region>` placeholders with values from your connection string:

```yaml
receivers:
  otlp:
    protocols:
      http:
        endpoint: 0.0.0.0:4318
      grpc:
        endpoint: 0.0.0.0:4317

exporters:
  azuremonitor:
    connection_string: "InstrumentationKey=<YOUR-KEY>;IngestionEndpoint=https://<region>.in.applicationinsights.azure.com/;LiveEndpoint=https://<region>.livediagnostics.monitor.azure.com/"

service:
  pipelines:
    traces:
      receivers: [otlp]
      exporters: [azuremonitor]
    metrics:
      receivers: [otlp]
      exporters: [azuremonitor]
    logs:
      receivers: [otlp]
      exporters: [azuremonitor]
```

### Run the collector with Docker

Start the collector with the `contrib` image, which includes the Azure Monitor exporter:

```bash
docker run -d --name otel-collector --restart unless-stopped -p 4318:4318 -p 4317:4317 -v $(pwd)/otel-collector-config.yaml:/etc/otelcol-contrib/config.yaml otel/opentelemetry-collector-contrib:latest
```

The examples in the next section assume the collector is running locally and reachable at `http://localhost:4318`. The OTLP/HTTP receiver listens on port `4318` by default, and all agents in this guide use OTLP/HTTP. For a shared or remote collector, substitute your own endpoint.

> [!TIP]
> Use `--restart unless-stopped` so the collector starts automatically after Docker Desktop or machine restarts. Without it, the container stays stopped until you start it manually.

## Step 2: Point each AI coding agent at the collector

Each agent has its own way to enable OpenTelemetry export. The shared target is the collector's OTLP/HTTP endpoint.

### GitHub Copilot

:::image type="content" source="media/grafana-opentelemetry-app-insights/github-copilot-main.png" alt-text="Screenshot of the GitHub Copilot dashboard in Grafana, showing operations, tokens, sessions, tool calls, and per-model latency." lightbox="media/grafana-opentelemetry-app-insights/github-copilot-main.png":::

GitHub Copilot emits OpenTelemetry signals when configured through Visual Studio Code settings. For more information, see [Monitoring GitHub Copilot agents](https://code.visualstudio.com/docs/copilot/guides/monitoring-agents).

Add the following to Visual Studio Code `settings.json`:

```json
{
    "github.copilot.chat.otel.enabled": true,
    "github.copilot.chat.otel.exporterType": "otlp-http",
    "github.copilot.chat.otel.otlpEndpoint": "http://localhost:4318",
    "github.copilot.chat.otel.captureContent": true
}
```

The GitHub Copilot dashboard surfaces total operations, input/output tokens, chat sessions, tool calls, and per-model latency (average duration and P50/P90 TTFT) — useful for spotting model-mix drift and slow tools.

### Claude Code

:::image type="content" source="media/grafana-opentelemetry-app-insights/claude-code-main.png" alt-text="Screenshot of the Claude Code dashboard in Grafana, showing cost, sessions, daily cost and token trends, per-model breakdown, and tool usage analytics." lightbox="media/grafana-opentelemetry-app-insights/claude-code-main.png":::

Claude Code reads telemetry configuration from environment variables. For more information, see [Monitoring Claude Code usage](https://code.claude.com/docs/en/monitoring-usage).

Add the following to the Claude Code `settings.json`:

```json
{
  "env": {
    "CLAUDE_CODE_ENABLE_TELEMETRY": "1",
    "OTEL_METRICS_EXPORTER": "otlp",
    "OTEL_LOGS_EXPORTER": "otlp",
    "OTEL_EXPORTER_OTLP_PROTOCOL": "http/protobuf",
    "OTEL_EXPORTER_OTLP_ENDPOINT": "http://localhost:4318",
    "OTEL_LOG_USER_PROMPTS": "1",
    "OTEL_LOG_TOOL_DETAILS": "1",
    "OTEL_METRICS_INCLUDE_VERSION": "true"
  }
}
```

> [!TIP]
> `OTEL_LOG_USER_PROMPTS` and `OTEL_LOG_TOOL_DETAILS` enrich the dashboard's per-user and tool-usage panels. Omit them if you prefer not to capture prompt text — for example, in regulated environments where prompts may contain sensitive content.

The Claude Code dashboard breaks down daily cost and token usage by model, surfaces API errors, and ranks the most-invoked tools — useful for managing spend and catching tool-call regressions.

### Codex

:::image type="content" source="media/grafana-opentelemetry-app-insights/codex-main.png" alt-text="Screenshot of the Codex dashboard in Grafana, showing sessions, turns, token usage by type and model, latency percentiles, tool reliability, and sandbox/approval activity." lightbox="media/grafana-opentelemetry-app-insights/codex-main.png":::

Codex emits OpenTelemetry signals when configured through the global Codex `config.toml`. Codex Desktop and App Server currently rely on the user-level config for global onboarding, so configure `~/.codex/config.toml` rather than a project-scoped `.codex/config.toml`. On Windows, the default path is `C:\Users\<user>\.codex\config.toml`.

Add the following to the global Codex `config.toml`:

```toml
[otel]
environment = "devbox"
log_user_prompt = true
exporter = "otlp-http"
trace_exporter = "otlp-http"
metrics_exporter = "otlp-http"

[otel.exporter."otlp-http"]
endpoint = "http://localhost:4318/v1/logs"
protocol = "binary"

[otel.trace_exporter."otlp-http"]
endpoint = "http://localhost:4318/v1/traces"
protocol = "binary"

[otel.metrics_exporter."otlp-http"]
endpoint = "http://localhost:4318/v1/metrics"
protocol = "binary"
```

Restart Codex after saving the file so the Codex app server or CLI process reloads the global configuration.

> [!TIP]
> `log_user_prompt = true` emits the most complete data, including raw user prompts. Set it to `false` if prompts might contain sensitive content or if your organization doesn't permit prompt capture.

Codex telemetry includes agent activity such as model and API calls, tool invocations, prompt-related events when enabled, token usage, latency, errors, and session context. This data is useful for auditing agent behavior, understanding tool usage, and tracking cost and reliability across Codex sessions.

### OpenClaw

:::image type="content" source="media/grafana-opentelemetry-app-insights/openclaw-main.png" alt-text="Screenshot of the OpenClaw dashboard in Grafana, showing messages, unique chats, response time, LLM calls, token usage, and cache reads." lightbox="media/grafana-opentelemetry-app-insights/openclaw-main.png":::

The OpenClaw gateway publishes OpenTelemetry signals via its diagnostics config. For more information, see [OpenClaw - OpenTelemetry export](https://docs.openclaw.ai/gateway/opentelemetry).

Add the following to the gateway's telemetry configuration, nested under `diagnostics.otel`:

```json
{
  "diagnostics": {
    "enabled": true,
    "otel": {
      "enabled": true,
      "endpoint": "http://localhost:4318",
      "protocol": "http/protobuf",
      "serviceName": "openclaw-gateway",
      "traces": true,
      "metrics": true,
      "logs": true,
      "sampleRate": 1,
      "flushIntervalMs": 5000
    }
  }
}
```

> [!IMPORTANT]
> `serviceName` must be `openclaw-gateway`. The OpenClaw dashboard filters by `cloud_RoleName == "openclaw-gateway"`, which is derived from this field.

> [!NOTE]
> `protocol` currently only honors `http/protobuf`. gRPC is ignored.

The OpenClaw dashboard tracks messages by channel, response-time percentiles, cache-read tokens, and stuck sessions — useful for chat-style deployments where session health and cache efficiency drive both cost and user experience.

### OpenCode

:::image type="content" source="media/grafana-opentelemetry-app-insights/opencode-main.png" alt-text="Screenshot of the OpenCode dashboard in Grafana, showing sessions, prompts, LLM calls, token usage, tool executions, prompt latency, cache hit ratio, and per-model breakdowns." lightbox="media/grafana-opentelemetry-app-insights/opencode-main.png":::

[OpenCode](https://opencode.ai) emits OpenTelemetry signals through the [`@devtheops/opencode-plugin-otel`](https://github.com/DEVtheOPS/opencode-plugin-otel) plugin.

Add the plugin to `~/.config/opencode/opencode.json`:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "plugin": ["@devtheops/opencode-plugin-otel"]
}
```

Then export these environment variables before starting OpenCode:

```bash
export OPENCODE_ENABLE_TELEMETRY=1
export OPENCODE_OTLP_ENDPOINT=http://localhost:4318
export OPENCODE_OTLP_PROTOCOL=http/protobuf
export OPENCODE_RESOURCE_ATTRIBUTES="service.name=opencode"
```

> [!IMPORTANT]
> `service.name` must be `opencode`. The OpenCode dashboard filters by `cloud_RoleName == "opencode"`, which is derived from this attribute.

The OpenCode dashboard surfaces sessions, prompts, LLM calls, token usage (input/output/cache), tool executions and failures, p95 prompt latency, cache hit ratio, and per-model and per-provider breakdowns — useful for cost control, debugging stuck tools, and reviewing prompt and tool behavior across sessions.

### Gemini CLI

Gemini CLI reads telemetry configuration from settings or environment variables.

#### Option 1: Settings file (global or project)

Enable telemetry globally for all projects or per project.

**Global user settings:**

- **Windows:** `%USERPROFILE%\.gemini\settings.json`
- **macOS/Linux:** `~/.gemini/settings.json`

**Project settings:**

- `.gemini/settings.json` in your project root.

Add the following configuration:

```json
{
  "telemetry": {
    "enabled": true,
    "target": "local",
    "useCollector": true,
    "otlpEndpoint": "http://localhost:4318",
    "otlpProtocol": "http",
    "logPrompts": true
  }
}
```

#### Option 2: Environment variables

Environment variables override settings in the JSON files and are useful for transient or machine-specific setups:

```bash
# Enable telemetry and route to local collector
export GEMINI_TELEMETRY_ENABLED=true
export GEMINI_TELEMETRY_TARGET=local
export GEMINI_TELEMETRY_USE_COLLECTOR=true
export GEMINI_TELEMETRY_OTLP_ENDPOINT=http://localhost:4318
export GEMINI_TELEMETRY_OTLP_PROTOCOL=http
export GEMINI_TELEMETRY_LOG_PROMPTS=true
```

> [!TIP]
> `logPrompts: true` (or `GEMINI_TELEMETRY_LOG_PROMPTS=true`) captures user prompt text in telemetry events, which is useful for auditing and debugging. Set it to `false` if prompts might contain sensitive content.

## Step 3: Verify data is reaching Application Insights

After the agents and the collector are running, confirm that telemetry is arriving before importing the dashboards.

1. In the Azure portal, go to your Application Insights resource and select **Logs**.
1. Run a KQL check for each source:

   ```kusto
   // GitHub Copilot
   dependencies
   | where timestamp > ago(1h)
   | where cloud_RoleName == "copilot-chat"
   | take 50
   ```

   ```kusto
   // Claude Code
   customMetrics
   | where timestamp > ago(1h)
   | where name startswith "claude_code"
   | take 50
   ```

   ```kusto
   // Codex
   union isfuzzy=true traces, customEvents, dependencies, customMetrics
   | where timestamp > ago(1h)
   | where cloud_RoleName contains "codex"
      or tostring(customDimensions["service.name"]) contains "codex"
      or name contains "codex"
      or message contains "codex"
   | take 50
   ```

   ```kusto
   // OpenClaw
   dependencies
   | where timestamp > ago(1h)
   | where cloud_RoleName == "openclaw-gateway"
   | take 50
   ```

   ```kusto
   // OpenCode
   union isfuzzy=true traces, dependencies, exceptions
   | where timestamp > ago(1h)
   | where cloud_RoleName == "opencode"
   | take 50
   ```

   ```kusto
   // Gemini CLI
   traces
   | where timestamp > ago(1h)
   | where customDimensions["service.name"] == "gemini-cli"
   | take 50
   ```

If rows come back, the pipeline is working. If not, check the collector logs for export errors. Typical culprits are an incorrect connection string, blocked egress to the Application Insights ingestion endpoint, or a firewalled OTLP receiver port.

## Step 4: Import the dashboards into Grafana or access them in Azure portal

Each dashboard has its own import flow and variables reference:

- [GitHub Copilot](https://aka.ms/amg/dash/gh-copilot)
- [Claude Code](https://aka.ms/amg/dash/claude-code)
- [Codex](https://aka.ms/amg/dash/codex)
- [OpenClaw](https://aka.ms/amg/dash/openclaw)
- [OpenCode](https://aka.ms/amg/dash/opencode)
- [Gemini CLI](https://aka.ms/amg/dash/geminicli)

All dashboards require **Grafana 11.6 or later** with an **Azure Monitor data source** that has access to the subscription containing your Application Insights resource.

> [!TIP]
> These dashboards are also available natively in the Azure portal as Azure Monitor dashboards with Grafana, with no separate Grafana instance required. For more information, see [Use Azure Monitor dashboards with Grafana](/azure/azure-monitor/visualize/visualize-use-grafana-dashboards).

## Where to go from here

- **Add more agents.** The same collector handles any OTLP-emitting tool. As your team adopts new coding agents, point them at the same endpoint and contribute or build a dashboard.
- **Set alerts.** Use [Application Insights alert rules](/azure/azure-monitor/alerts/alerts-overview) or Grafana alerting against the same data — for example, on daily cost above a threshold, sustained API error rate, or stuck-session count.
- **Share with stakeholders.** Pin the dashboards to a Grafana playlist or embed selected panels in your team's status pages so adoption, cost, and reliability stay visible to leadership.

## Related content

- [OpenTelemetry Collector](https://opentelemetry.io/docs/collector/)
- [Azure Monitor Exporter for the OpenTelemetry Collector](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/exporter/azuremonitorexporter)
- [Ingest OTLP data into Azure Monitor with the OpenTelemetry Collector (Preview)](/azure/azure-monitor/containers/opentelemetry-protocol-ingestion)
- [Use Azure Monitor dashboards with Grafana](/azure/azure-monitor/visualize/visualize-use-grafana-dashboards)
- [Application Insights connection strings](/azure/azure-monitor/app/sdk-connection-string)
- [Monitoring GitHub Copilot agents](https://code.visualstudio.com/docs/copilot/guides/monitoring-agents)
- [Monitoring Claude Code usage](https://code.claude.com/docs/en/monitoring-usage)
- [Codex configuration reference](https://developers.openai.com/codex/config-reference)
- [Codex sample configuration](https://developers.openai.com/codex/config-sample)
- [OpenClaw - OpenTelemetry export](https://docs.openclaw.ai/gateway/opentelemetry)
- [OpenCode OpenTelemetry plugin (`@devtheops/opencode-plugin-otel`)](https://github.com/DEVtheOPS/opencode-plugin-otel)
- [Gemini CLI - Observability with OpenTelemetry](https://google-gemini.github.io/gemini-cli/docs/cli/telemetry.html)

---
title: Evaluate Hosted Skills with Vally
description: "Evaluate Azure Functions hosted skill responses and tool use with the hosted skills evaluator npm package and Vally. Run a sample locally and connect to an Azure-hosted app."
ms.topic: how-to
ms.date: 10/19/2026
ms.update-cycle: 180-days
ai-usage: ai-assisted
ms.collection:
  - ce-skilling-ai-copilot
#Customer intent: As a developer, I want to evaluate my hosted skill's responses and tool use so that I can detect behavioral regressions.
---

# Evaluate Hosted Skill behaviors

Use evaluations to check that your Hosted Skill returns expected responses, calls the right tools,
and maintains context across a conversation. The `@azure/functions-hosted-skills-evaluator` package
provides a custom executor built on top of [Vally](https://microsoft.github.io/vally/), so you can use Vally's evaluation format and
graders to test your Hosted Skill locally or against a staging Function App. The evaluator executes
your Hosted Skill and captures responses and tool calls; Vally's graders assess that behavior.

The executor connects to your app's existing synchronous chat endpoint and captures responses and
tool calls for grading. These evaluations focus on your Hosted Skill's responses and tool use, rather than Functions
availability, scaling, or trigger delivery. For guidance on designing evaluations and choosing
graders, see the [Vally documentation](https://microsoft.github.io/vally/). Review the
[Hosted Skill evaluation sample](https://github.com/Azure/azure-functions-agents-runtime/tree/main/samples/agent-evaluation)
for a runnable receipt Hosted Skill and deterministic eval specification.

## Prerequisites

- Node.js 22.12 or later, including npm
- a Hosted Skill with `builtin_endpoints.chat_api: true`. To create one, follow the [Hosted Skills quickstart](scenario-hosted-skills.md).
- a Function App running under Core Tools or deployed to staging

## Install the evaluator

In a terminal, navigate to your Function App's root directory and install the published
[`@azure/functions-hosted-skills-evaluator`](https://www.npmjs.com/package/@azure/functions-hosted-skills-evaluator)
package and Vally CLI from npm.

Install the evaluation tools as development dependencies:

```powershell
npm install --save-dev @azure/functions-hosted-skills-evaluator @microsoft/vally-cli
```


## Write an eval specification

Create `eval.yaml` in your Function App's root directory using Vally's native format. Include the
following executor configuration under `defaults` to connect Vally to your Hosted Skill:

```yaml
defaults:
  executor:
    name: azure-functions-hosted-skill
    config:
      endpointUrlEnv: AGENT_EVAL_TARGET_URL
      auth:
        type: anonymous
```

- `defaults.executor.name`: Set to `azure-functions-hosted-skill`, the executor registered by the
  evaluator npm package.
- `defaults.executor.config.endpointUrlEnv`: The name of an environment variable that contains your
  Hosted Skill's complete synchronous chat endpoint URL, not the URL itself. In this example, the
  executor reads the URL from `AGENT_EVAL_TARGET_URL` in the environment where the Vally CLI runs.
  Set that variable before running evaluations. You can use the same specification for local and
  staging targets by changing the variable's value.
- `defaults.executor.config.auth`: How the executor authenticates to the endpoint. Use `anonymous`
  for an endpoint that doesn't require authentication. For protected endpoints, see
  [Authenticate a staging target](#authenticate-a-staging-target).

Add your evaluation's stimuli (test inputs) and graders (checks) as described in Vally's
[Writing Eval Specs](https://microsoft.github.io/vally/guides/writing-eval-specs/) and
[Choose a Grader](https://microsoft.github.io/vally/guides/choosing-graders/) guides.
For a complete specification with test inputs, graders, and expected outputs, see Vally's
[expanded example](https://microsoft.github.io/vally/guides/writing-eval-specs/#expanded-example) and the
[Hosted Skill sample evaluation specification](https://github.com/Azure/azure-functions-agents-runtime/blob/main/samples/agent-evaluation/eval.yaml).

### Handle external dependencies

Evaluations use the tools, connectors, and MCP servers configured in the target Function App.
If your Hosted Skill calls an external service, that call reaches the configured service during
evaluation; the evaluator doesn't automatically mock external dependencies.

For repeatable tests, configure your test app to use deterministic tool implementations or mock MCP
servers that return fixed data, as the [Hosted Skill evaluation sample](https://github.com/Azure/azure-functions-agents-runtime/tree/main/samples/agent-evaluation)
does with its receipt tool. Configure these dependencies in the Function App, not in Vally's
`agent_environment` settings, which don't reconfigure the target app. To test real integrations,
use sandbox services or dedicated test accounts to avoid changing production data.

## Run locally

Start the Function App, set its complete chat URL, and invoke the locally installed CLI from a second terminal in your Function App's root directory:

```powershell
$env:AGENT_EVAL_TARGET_URL = "http://localhost:7071/agents/receipt/chat"
npx vally eval `
  --eval-spec eval.yaml `
  --executor-plugin @azure/functions-hosted-skills-evaluator `
  --require-pass `
  --junit `
  --output-dir artifacts/agent-evaluation
```

The `--executor-plugin` option loads the installed npm package by name.
`--require-pass` is essential for CI: without it, a completed evaluation with failing grader verdicts exits successfully. Configuration, execution, and tooling failures still exit nonzero. `--junit` writes CI-compatible test output alongside Vally's result artifacts.

For example pass/fail results and grader evidence, see Vally's
[Understanding the output](https://microsoft.github.io/vally/get-started/run-your-first-eval/#understanding-the-output).
For help investigating unexpected results, see [Debugging Evals](https://microsoft.github.io/vally/guides/debugging-evals/).

## Authenticate a staging target

Don't put keys or bearer tokens in an eval specification. The executor supports three fail-closed
authentication configurations.

Anonymous endpoints need no extra fields:

```yaml
auth:
  type: anonymous
```

For a Functions or host key, reference an environment variable:

```yaml
auth:
  type: function-key
  keyEnv: AGENT_EVAL_FUNCTION_KEY
```

```powershell
$env:AGENT_EVAL_FUNCTION_KEY = "<CI secret>"
```

For Microsoft Entra authentication, provide the accepted API scope directly or through `scopeEnv`:

```yaml
auth:
  type: entra
  scopeEnv: AGENT_EVAL_ENTRA_SCOPE
```

```powershell
$env:AGENT_EVAL_ENTRA_SCOPE = "api://<application-id>/.default"
```

Entra authentication uses `DefaultAzureCredential`. Use managed identity in Azure-hosted CI where
possible. Literal function keys, arbitrary headers, bearer tokens, and endpoint query strings are
rejected by configuration validation.

## Runtime evidence and failure semantics

The executor captures conversation turns, session and model IDs, tool calls and results, parallel-tool
batches, and elapsed time. It doesn't report token usage, cost, reasoning, skill activation, subagent,
or workspace evidence.

Transport errors, authentication failures, timeouts, malformed responses, and session ID mismatches
are execution failures, not low quality scores. A tool result marked `success` can still contain an
unsuccessful plain-text response, so use graders to check important result content.

Don't run concurrent turns with the same explicit session ID; the runtime doesn't coordinate their
ordering across workers.






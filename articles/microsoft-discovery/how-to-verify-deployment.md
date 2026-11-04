---
title: Verify a Microsoft Discovery onboarding deployment
description: Run the Discovery onboarding Q&A smoke test, review response and state files, and understand private access, storage checks, and cleanup responsibilities.
author: yousefi
ms.author: yousefi
ms.service: azure
ms.topic: how-to
ms.date: 10/24/2026
# Customer intent: As a scientist or administrator, I want to exercise a deployed workspace so that I can verify a bounded Q&A scenario before handoff.
---

# Verify a Microsoft Discovery onboarding deployment

Run Stage 5 to exercise the deployed workspace with a scientific Q&A prompt. It creates a Discovery agent, investigation, and conversation, sends a model request, and verifies a completed, nonempty response. These steps involve Azure/data-plane writes and can incur model and storage costs.

The tool labels its result "certification." That label applies only to its implemented checks. It isn't scientific validation, a security assessment, or compliance certification.

## Prerequisites

- A [deployed core platform](how-to-deploy-platform.md) and current `config.json`.
- The full **Scientist persona** role set at the documented scopes, including active required Foundry access. One Discovery role alone isn't sufficient.
- A runner that can reach the workspace data plane, including private connectivity when `publicNetworkAccess=Disabled`.
- Azure CLI signed into the intended subscription and a PowerShell 7 prompt in `utilities\onboarding-tool\scripts`.
- Approval to create test objects and send the selected prompt to the configured model.

See [Stage 5 permissions](reference-deployment-permissions.md#stage-5-scenario-verification) for access details.

## Run the Q&A verification

1. Confirm the intended workspace, project, and chat model in `config.json`.
1. Run:

   ```powershell
   .\stage5-scenario-enablement\stage5_enable.ps1 `
     -ConfigPath .\config.json `
     -JsonPath .\out\stage5.json
   ```

1. If you need a different approved question, supply `-Prompt`:

   ```powershell
   .\stage5-scenario-enablement\stage5_enable.ps1 `
     -ConfigPath .\config.json `
     -Prompt "Explain the difference between a hypothesis and an observation." `
     -JsonPath .\out\stage5.json
   ```

   Use a prompt that doesn't expose confidential research. The script also supports `-ResourceGroup`, `-Workspace`, `-Project`, and `-ChatModel` target overrides. Review their IDs and access deliberately; an override doesn't prepare or deploy the target.

The stage first probes workspace data-plane access from the runner. If the probe fails, the script skips subsequent agent steps. For a private workspace, move execution to an approved VNet-connected runner rather than enabling public access just to make the test pass.

## Review the response and created objects

1. Open `.\out\stage5.md` and review all failed, skipped, or warning checks.
1. Locate `stage5-response-<timestamp>.json` and `stage5-state-<timestamp>.json` in the output folder. The report's `extra` object identifies these paths.
1. Confirm the response completed and contains nonempty text. Read the answer yourself; nonempty output isn't proof that the answer is correct.
1. Record the agent, investigation, and conversation used by the test. The agent is named `scientistQnAAgent`; no tool is bound to it. Use the report together with the state file to identify what was actually created.

A successful test doesn't validate Bookshelf retrieval, a tool invocation, a GPU workload, or every production investigation.

## Review project-storage checks

Project storage is checked even when Bookshelf isn't in scope.

- With `storage.access=privateEndpoint`, the verification inspects the blob private endpoint's approval and provisioning and associated private DNS configuration, including the VNet link.
- With `storage.access=serviceEndpoint`, the private-endpoint check is skipped.

These checks inspect configuration; they don't replace in-VNet DNS or HTTPS tests or browser access testing. A user opening output blobs needs their own permitted network path and permissions.

If a check fails, follow the reported remediation and [onboarding troubleshooting](troubleshoot-deployment-tool.md). Don't infer complete network health from a Q&A answer.

## Retain evidence and clean up safely

Keep the tool revision, reviewed configuration, stage report, and approved response and state files in customer-controlled storage. They can contain scientific text and environment identifiers.

The reviewed tool revision doesn't automatically delete the test objects. Before cleanup, identify the exact agent, investigation, and conversation from the reports and confirm they aren't reused or shared. Use supported Discovery Studio and resource-specific deletion controls and obtain owner approval. Don't delete the project, workspace, storage account, or resource group to clean up a smoke test.

For a full environment teardown instead, follow [Delete Discovery resources](how-to-delete-discovery-resources.md) and its dependency order.

## Related content

- [Run your first agent and investigation interactively](quickstart-agents-studio.md)
- [Onboarding reports and artifacts](reference-deployment-reports.md)
- [Troubleshoot onboarding](troubleshoot-deployment-tool.md)

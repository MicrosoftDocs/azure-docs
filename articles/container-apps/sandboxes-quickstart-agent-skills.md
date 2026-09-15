---
title: 'Quickstart: Install the Azure Container Apps Sandboxes agent skill (preview)'
description: Install the Azure Container Apps Sandboxes agent skill so your coding agent can manage sandboxes using natural language.
author: craigshoemaker
ms.author: cshoe
ms.reviewer: cshoe
ms.service: azure-container-apps
ms.topic: quickstart
ms.date: 08/21/2026
# customer intent: As a developer, I want to install the Azure Container Apps Sandboxes agent skill so that my coding agent can create and manage sandboxes using natural language.
---

# Quickstart: Install the Azure Container Apps Sandboxes agent skill (preview)

In this quickstart, you install the Azure Container Apps Sandboxes agent skill so your coding agent can manage sandboxes by using natural language. The skill teaches coding agents to use Azure Container Apps Sandboxes as infrastructure: boot disposable Linux VMs, run untrusted code in isolation, lock down egress, snapshot state, and run `aca` CLI commands.

> [!IMPORTANT]
> Azure Container Apps Sandboxes are currently in preview. Sandboxes created during preview might not be compatible with future releases and might need to be recreated.

## Install the agent skill

Use one of the following options to install the Azure Container Apps Sandboxes agent skill.

#### [GitHub Copilot CLI](#tab/copilot)

```bash
/plugin marketplace add microsoft/azure-container-apps
/plugin install sandboxes@Azure-Container-Apps
```

#### [Claude Code](#tab/claude)

```bash
claude plugin add microsoft/azure-container-apps
```

#### [Any agent](#tab/any)

```bash
git clone --depth 1 --filter=blob:none --sparse \
  https://github.com/microsoft/azure-container-apps.git /tmp/aca
cd /tmp/aca && git sparse-checkout set plugin

mkdir -p .claude/skills/aca-sandboxes
cp -r /tmp/aca/plugin/skills/aca-sandboxes/* .claude/skills/aca-sandboxes/
```

Use `~/.claude/skills/aca-sandboxes/` (or your agent's global skills directory) to install the skill everywhere.

---

## Triggers

The skill activates automatically when you ask the agent to:

- Create or manage **sandbox groups** and **sandboxes**.
- Execute commands or open a shell inside a sandbox.
- Set **egress** policies or network controls.
- **Snapshot**, stop, resume, or commit sandbox state.
- Mount **volumes**, manage disk images, configure **secrets** or managed identity.
- Apply YAML sandbox specifications.

Source: [Azure Container Apps Sandboxes agent skill source](https://github.com/microsoft/azure-container-apps/tree/main/plugin)

## Next steps

> [!div class="nextstepaction"]
> [Snapshots and state management](sandboxes-snapshots-state-management.md)


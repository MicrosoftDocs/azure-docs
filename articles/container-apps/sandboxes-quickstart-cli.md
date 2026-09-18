---
title: 'Quickstart: Create your first Azure Container Apps sandbox using the aca CLI (preview)'
description: Install the aca CLI, create a sandbox group, and run your first Azure Container Apps sandbox from a shell.
author: craigshoemaker
ms.author: cshoe
ms.reviewer: cshoe
ms.service: azure-container-apps
ms.topic: quickstart
ms.date: 08/21/2026
# customer intent: As a developer, I want to create an Azure Container Apps sandbox from the command line so that I can start using an isolated environment without using the portal.
---

# Quickstart: Create your first Azure Container Apps sandbox using the aca CLI (preview)

In this quickstart, you install the `aca` CLI, provision a sandbox group, launch a sandbox, run a command, and tear it all down.


> [!IMPORTANT]
> Azure Container Apps Sandboxes are currently in preview. Sandboxes created during preview might not be compatible with future releases and might need to be recreated.

## Prerequisites

- An Azure subscription with permission to create resource groups.
- Azure CLI (`az`) installed. `aca` delegates auth to `az login`.
- A shell: Bash on Linux/macOS, PowerShell on Windows. WSL and Git Bash also work.

## Install the `aca` CLI

> [!NOTE]
> These commands download and run an installation script. If your environment requires it, review the script contents at the URL before running it.

#### [Bash](#tab/bash)

```bash
curl -fsSL https://aka.ms/aca-cli-install | sh
```

#### [PowerShell](#tab/powershell)

```powershell
irm https://aka.ms/aca-cli-install-ps | iex
```

---

Verify the installation:

#### [Bash](#tab/bash)

```bash
aca --version
# aca 1.0.0-preview.1
```

#### [PowerShell](#tab/powershell)

```powershell
aca --version
# aca 1.0.0-preview.1
```

---

## Sign in to Azure

Run `az login` once per shell. Subsequent commands reuse the same Azure CLI session.

#### [Bash](#tab/bash)

```bash
az login
```

#### [PowerShell](#tab/powershell)

```powershell
az login
```

---

## Provision the resource group and sandbox group

#### [Bash](#tab/bash)

```bash
SUBSCRIPTION_ID=$(az account show --query id -o tsv)

az group create \
  --name my-rg \
  --location westus2

aca sandboxgroup create \
  -g my-rg \
  --name my-sandbox-group \
  --location westus2 \
  -s "$SUBSCRIPTION_ID" \
  --set-config
```

#### [PowerShell](#tab/powershell)

```powershell
$SubscriptionId = az account show --query id -o tsv

az group create `
  --name my-rg `
  --location westus2

aca sandboxgroup create `
  -g my-rg `
  --name my-sandbox-group `
  --location westus2 `
  -s $SubscriptionId `
  --set-config
```

---

> [!NOTE]
> The `--set-config` parameter writes the group, subscription, and region into `aca` config so you don't have to pass them on every subsequent command.

## Verify with `aca doctor`

#### [Bash](#tab/bash)

```bash
aca doctor
```

#### [PowerShell](#tab/powershell)

```powershell
aca doctor
```

---

## Create and run a sandbox

Tag the sandbox with a label when you create it, and then use `-l` (label selector) to target it from `exec` and `delete` commands. You don't need to capture the ID.

#### [Bash](#tab/bash)

```bash
aca sandbox create \
  --disk ubuntu \
  --label name=my-first-sandbox

aca sandbox exec -l name=my-first-sandbox -c "echo 'Hello from an Azure Container Apps sandbox.'"

aca sandbox delete -l name=my-first-sandbox --yes
```

#### [PowerShell](#tab/powershell)

```powershell
aca sandbox create `
  --disk ubuntu `
  --label name=my-first-sandbox

aca sandbox exec -l name=my-first-sandbox -c "echo 'Hello from an Azure Container Apps sandbox.'"

aca sandbox delete -l name=my-first-sandbox --yes
```

---

## Clean up resources

Delete the sandbox group and the resource group:

#### [Bash](#tab/bash)

```bash
aca sandboxgroup delete -g my-rg --name my-sandbox-group --yes
az group delete --name my-rg --yes --no-wait
```

#### [PowerShell](#tab/powershell)

```powershell
aca sandboxgroup delete -g my-rg --name my-sandbox-group --yes
az group delete --name my-rg --yes --no-wait
```

---

## Next steps

> [!div class="nextstepaction"]
> [Sandboxes lifecycle](sandboxes-snapshots-state-management.md)

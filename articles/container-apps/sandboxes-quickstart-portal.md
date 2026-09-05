---
title: 'Quickstart: Create your first Azure Container Apps sandbox using the portal (preview)'
description: Create a sandbox group and run your first Azure Container Apps sandbox from the Sandboxes portal.
author: craigshoemaker
ms.author: cshoe
ms.reviewer: cshoe
ms.service: azure-container-apps
ms.topic: quickstart
ms.date: 08/21/2026
# customer intent: As a developer, I want to create an Azure Container Apps sandbox in the portal so that I can start using an isolated environment without writing code.
---

# Quickstart: Create your first Azure Container Apps sandbox using the portal (preview)

In this quickstart, you create a sandbox group, start your first Azure Container Apps sandbox, and open an interactive shell in the Sandboxes portal.

> [!IMPORTANT]
> Azure Container Apps Sandboxes are currently in preview. Sandboxes created during preview might not be compatible with future releases and might need to be recreated.

## Prerequisites

- An Azure account with an active subscription. If you don't already have one, [create an account for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).
- A Microsoft Entra ID account. Personal Microsoft accounts aren't supported.
- To create sandboxes, you need the **Container Apps SandboxGroup Data Owner** role at a scope that covers the sandbox group, or permission for the portal to grant it during group creation.

## Create a sandbox group

Go to [sandboxes.azure.com](https://sandboxes.azure.com) and sign in with your Azure account. The portal opens directly to the Sandboxes experience, so you don't need to search for the service.

A sandbox group is the regional Azure resource that holds your sandboxes. You can have one or more sandbox groups per subscription, resource group, and region. Create one sandbox group and reuse it for the rest of this quickstart.

1. In the top toolbar, select **Create**.
1. Select a **Subscription** and **Resource group**. If you don't have a resource group, create one.
1. Enter a **Name** and select a **Region** for the sandbox group. For example, select **West US 3**.
1. Select **Create**.
1. In the **Review** drawer, review your configuration, and then select **Create** to confirm.

When provisioning finishes, the portal opens the sandbox group's overview page.

## Create and run a sandbox

From the sandbox group's overview page, create a sandbox.

1. Select **+ Create sandbox**.
1. For **Disk image**, select **Ubuntu**.
1. Leave **CPU** and **Memory** at the defaults of 1 vCPU and 2 GiB.
1. Select **Create**.

The sandbox appears in the **Sandboxes** list with a status of **Running**.

Select the sandbox name to open it. A terminal opens in the browser and attaches to the running sandbox. Run the following commands:

```bash
whoami
uname -a
cat /etc/os-release
```

You're now inside a new, isolated Ubuntu environment with outbound internet access.

## Clean up resources

When you're finished, you can stop or delete the sandbox from the sandbox toolbar.

- **Stop** the sandbox to preserve disk state for later use.
- **Delete** the sandbox to permanently remove it.

## Next steps

> [!div class="nextstepaction"]
> [Snapshots and state management for Azure Container Apps Sandboxes](sandboxes-snapshots-state-management.md)

- [Configure egress policies and network controls](sandboxes-egress-policies.md)
- [Azure Container Apps Sandboxes overview](sandboxes-overview.md)

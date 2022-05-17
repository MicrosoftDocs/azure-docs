---
author: ElazarK
ms.author: elkrieger
ms.service: defender-for-cloud
ms.topic: include
ms.date: 05/12/2022
---

## FAQ

- [How can I use my existing Log Analytics workspace?](#how-can-i-use-my-existing-log-analytics-workspace)
- [Can I delete the default workspaces created by Defender for Cloud?](#can-i-delete-the-default-workspaces-created-by-defender-for-cloud)
- [I deleted my default workspace, how can I get it back?](#i-deleted-my-default-workspace-how-can-i-get-it-back)
- [Where is the default Log Analytics workspace located?](#where-is-the-default-log-analytics-workspace-located)

### How can I use my existing Log Analytics workspace?

You can use your existing Log Analytics workspace by following the steps in the [Assign a custom workspace](../defender-for-containers-enable.md?tabs=aks-deploy-portal%2Ck8s-deploy-asc%2Ck8s-verify-asc%2Ck8s-remove-arc%2Caks-removeprofile-api&pivots=defender-for-container-aks#assign-a-custom-workspace) workspace section of this article.

### Can I delete the default workspaces created by Defender for Cloud? 

We do not recommend deleting the default workspace. Defender for Containers uses the default workspaces to collect security data from your clusters. Defender for Containers will be unable to collect data, and some security recommendations and alerts, will become unavailable if you delete the default workspace. 

### I deleted my default workspace, how can I get it back?

To recover your default workspace, you need to remove the Defender profile/extension, and reinstall the agent. Reinstalling the Defender profile/extension creates a new default workspace.

### Where is the default Log Analytics workspace located?

Depending on your region the default Log Analytics workspace located will be located in various locations. To check your region see [Where is the default Log Analytics workspace created?](../faq-data-collection-agents.yml)

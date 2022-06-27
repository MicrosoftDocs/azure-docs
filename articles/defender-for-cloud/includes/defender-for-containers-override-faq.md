---
author: ElazarK
ms.author: elkrieger
ms.service: defender-for-cloud
ms.topic: include
ms.date: 06/27/2022
---

## FAQ

- [How can I use my existing Log Analytics workspace?](#how-can-i-use-my-existing-log-analytics-workspace)
- [Can I delete the default workspaces created by Defender for Cloud?](#can-i-delete-the-default-workspaces-created-by-defender-for-cloud)
- [I deleted my default workspace, how can I get it back?](#i-deleted-my-default-workspace-how-can-i-get-it-back)
- [Where is the default Log Analytics workspace located?](#where-is-the-default-log-analytics-workspace-located)
- [Why did auto provisioning fail?](#why-did-auto-provisioning-fail)

### How can I use my existing Log Analytics workspace?

You can use your existing Log Analytics workspace by following the steps in the [Assign a custom workspace](../defender-for-containers-enable.md?pivots=defender-for-container-aks&tabs=aks-deploy-portal%2ck8s-deploy-asc%2ck8s-verify-asc%2ck8s-remove-arc%2caks-removeprofile-api#assign-a-custom-workspace) workspace section of this article.

### Can I delete the default workspaces created by Defender for Cloud? 

We do not recommend deleting the default workspace. Defender for Containers uses the default workspaces to collect security data from your clusters. Defender for Containers will be unable to collect data, and some security recommendations and alerts, will become unavailable if you delete the default workspace. 

### I deleted my default workspace, how can I get it back?

To recover your default workspace, you need to remove the Defender profile/extension, and reinstall the agent. Reinstalling the Defender profile/extension creates a new default workspace.

### Where is the default Log Analytics workspace located?

Depending on your region the default Log Analytics workspace located will be located in various locations. To check your region see [Where is the default Log Analytics workspace created?](../faq-data-collection-agents.yml)

### Why did auto provisioning fail?

If you have an Organizational policy for resource tagging in place, auto provisioning may fail. If this happened to you, you will need to set [assign a custom workspace](/azure/defender-for-cloud/defender-for-containers-enable?branch=main&tabs=aks-deploy-portal%2Ck8s-deploy-asc%2Ck8s-verify-asc%2Ck8s-remove-arc%2Caks-removeprofile-api&pivots=defender-for-container-aks)  or exclude the following from your `Resource TaggingOrg` policy:
- The resource group should be called `DefaultResourceGroup-<RegionShortCode>`
- The Workspace should be labeled `DefaultWorkspace-<sub-id>-<RegionShortCode>` where the RegionShortCode is 2-4 letters string.

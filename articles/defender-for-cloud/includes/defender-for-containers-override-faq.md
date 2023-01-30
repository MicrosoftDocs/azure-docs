---
ms.author: benmansheim
author: bmansheim
ms.service: defender-for-cloud
ms.custom: ignite-2022
ms.topic: include
ms.date: 07/14/2022
---

## FAQ

- [How can I use my existing Log Analytics workspace?](#how-can-i-use-my-existing-log-analytics-workspace)
- [Can I delete the default workspaces created by Defender for Cloud?](#can-i-delete-the-default-workspaces-created-by-defender-for-cloud)
- [I deleted my default workspace, how can I get it back?](#i-deleted-my-default-workspace-how-can-i-get-it-back)
- [Where is the default Log Analytics workspace located?](#where-is-the-default-log-analytics-workspace-located)
- [My organization requires me to tag my resources, and required extension didn't get installed, what went wrong?](#my-organization-requires-me-to-tag-my-resources-and-required-extension-didnt-get-installed-what-went-wrong)

### How can I use my existing Log Analytics workspace?

You can use your existing Log Analytics workspace by following the steps in the [Assign a custom workspace](../defender-for-containers-enable.md?pivots=defender-for-container-aks&tabs=aks-deploy-portal%2ck8s-deploy-asc%2ck8s-verify-asc%2ck8s-remove-arc%2caks-removeprofile-api#assign-a-custom-workspace) workspace section of this article.

### Can I delete the default workspaces created by Defender for Cloud? 

We don't recommend deleting the default workspace. Defender for Containers uses the default workspaces to collect security data from your clusters. Defender for Containers will be unable to collect data, and some security recommendations and alerts, will become unavailable if you delete the default workspace. 

### I deleted my default workspace, how can I get it back?

To recover your default workspace, you need to remove the Defender profile/extension, and reinstall the agent. Reinstalling the Defender profile/extension creates a new default workspace.

### Where is the default Log Analytics workspace located?

Depending on your region, the default Log Analytics workspace located will be located in various locations. To check your region see [Where is the default Log Analytics workspace created?](../faq-data-collection-agents.yml)

### My organization requires me to tag my resources, and required extension didn't get installed, what went wrong?

The Defender agent uses the Log analytics workspace to send data from your Kubernetes clusters to Defender for Cloud. The Defender for Cloud adds the Log analytic workspace and the resource group as a parameter for the agent to use.

However, if your organization has a policy that requires a specific tag on your resources, it may cause the extension installation to fail during the resource group or the default workspace creation stage. If it fails, you can either:

- [Assign a custom workspace](../defender-for-containers-enable.md?pivots=defender-for-container-aks&tabs=aks-deploy-portal%2ck8s-deploy-asc%2ck8s-verify-asc%2ck8s-remove-arc%2caks-removeprofile-api#assign-a-custom-workspace) and add any tag your organization requires.

    or 

- If your company requires you to tag your resource, you should navigate to that policy and exclude the following resources:
    1. The resource group `DefaultResourceGroup-<RegionShortCode>`
    1. The Workspace  `DefaultWorkspace-<sub-id>-<RegionShortCode>` 

    RegionShortCode is a 2-4 letters string.
    

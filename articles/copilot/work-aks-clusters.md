---
title:  Work with AKS clusters efficiently using Microsoft Copilot in Azure
description: Learn how Microsoft Copilot in Azure can help you be more efficient when working with Azure Kubernetes Service (AKS).
ms.date: 05/28/2024
ms.topic: conceptual
ms.service: copilot-for-azure
ms.custom:
  - build-2024
ms.author: jenhayes
author: JnHs
---

# Work with AKS clusters efficiently using Microsoft Copilot in Azure

Microsoft Copilot in Azure (preview) can help you work more efficiently with [Azure Kubernetes Service (AKS)](/azure/aks/intro-kubernetes) clusters.

When you ask Microsoft Copilot in Azure for help with AKS, it automatically pulls context when possible, based on the current conversation or on the page you're viewing in the Azure portal. If the context isn't clear, you'll be prompted to specify a cluster.

[!INCLUDE [scenario-note](includes/scenario-note.md)]

[!INCLUDE [preview-note](includes/preview-note.md)]

## Run cluster commands

You can use Microsoft Copilot in Azure to run kubectl commands based on your prompts. When you make a request that can be achieved by a kubectl command, you'll see the command along with the option to execute it directly in the **Run command** pane. This pane lets you [run commands on your cluster through the Azure API](/azure/aks/access-private-cluster?tabs=azure-portal), without directly connecting to the cluster. You can also copy the generated command and run it directly.

### Cluster command sample prompts

Here are a few examples of the kinds of prompts you can use to run kubectl commands on an AKS cluster. Modify these prompts based on your real-life scenarios, or try additional prompts to get different kinds of information.

- "List all of my failed pods in this cluster"
- "Check the rollout status for deployment `aksdeployment`"
- "Get all pods that are in pending states in all namespaces"
- "Can you delete my deployment named `my-deployment` in namespace `my-namespace`?"
- "Scale the number of replicas of my deployment `my-deployment` to 5"

### Cluster command example

You can say **"List all namespaces in my cluster."** If you're not already working with a cluster, you'll be prompted to select one. Microsoft Copilot in Azure shows you the kubectl command to perform your request, and ask if you'd like to execute the command. When you confirm, the **Run command** pane opens with the generated command included.

:::image type="content" source="media/work-aks-clusters/aks-kubectl-command.png" alt-text="Screenshot of a prompt for Microsoft Copilot in Azure to run a kubectl command.":::

## Enable IP address authorization

Use Microsoft Copilot in Azure to quickly make changes to the IP addresses that are allowed to access an AKS cluster. When you reference your own IP address, Microsoft Copilot in Azure can add it to the authorized IP ranges, without your providing the exact address. If you want to include alternative IP addresses, Microsoft Copilot in Azure asks if you want to open the **Networking** pane for your AKS cluster and helps you edit the relevant field.

### IP address sample prompts

Here are a few examples of the kinds of prompts you can use to manage the IP addresses that can access an AKS cluster. Modify these prompts based on your real-life scenarios, or try additional prompts to get different kinds of information.

- "Allow my IP to access my AKS cluster"
- "Add my IP address to the allowlist of my AKS cluster's network policies"
- "Add my IP address to the authorized IP ranges of AKS cluster's networking configuration"
- "Add IP CIDR to my AKS cluster’s authorized IP ranges"
- "Update my AKS cluster's authorized IP ranges"

## Manage cluster backups

Microsoft Copilot in Azure can help streamlines the process of installing the Azure [Backup extension](/azure/backup/azure-kubernetes-service-backup-overview) to an AKS cluster. On clusters where the extension is already installed, it helps you [configure backups](/azure/backup/azure-kubernetes-service-cluster-backup#configure-backups) and view existing backups.

When you ask for help with backups, you'll be prompted to select a cluster. From there, Microsoft Copilot in Azure prompts you to open the **Backup** pane for that cluster, where you can proceed with installing the extension, configuring backups, or viewing existing backups.

### Backup sample prompts

Here are a few examples of the kinds of prompts you can use to manage AKS cluster backups.  Modify these prompts based on your real-life scenarios, or try additional prompts to get different kinds of information.

- "Install backup extension on my AKS cluster"
- "Configure AKS backup"
- "Manage backup extension on my AKS cluster"
- "I want to view the backups on my AKS cluster"

### Backup example

You can say **"Install AKS backup"** to start the process of installing the AKS backup extension. After you select a cluster, you'll be prompted to open its **Backup** pane. From there, select **Launch install backup** to open the experience. After reviewing the prerequisites for the extension, you can step through the installation process.

:::image type="content" source="media/work-aks-clusters/aks-backup.png" alt-text="Screenshot showing Microsoft Copilot in Azure starting the backup extension install process for an AKS cluster.":::

## Update AKS pricing tier

Use Microsoft Copilot in Azure to make changes to your [AKS pricing tier](/azure/aks/free-standard-pricing-tiers). When you request an update to your pricing tier, you're prompted to confirm, and then Microsoft Copilot in Azure makes the change for you.

You can also get information about different pricing tiers, helping you to make informed decisions before changing your clusters' pricing tier.

### Pricing tier sample prompts

Here are a few examples of the kinds of prompts you can use to manage your AKS pricing tier.  Modify these prompts based on your real-life scenarios, or try additional prompts to make different kinds of changes.

- "What is my AKS pricing tier?"
- "Update my AKS cluster pricing tier"
- "Upgrade AKS cluster pricing tier to Standard"
- "Downgrade AKS cluster pricing tier to Free"
- "What are the limitations of the Free pricing tier?"
- "What do you get with the Premium AKS pricing tier?"

## Work with Kubernetes YAML files

Microsoft Copilot in Azure can help you create [Kubernetes YAML files](/azure/aks/concepts-clusters-workloads#deployments-and-yaml-manifests) to apply to AKS clusters.

For more information, see [Create Kubernetes YAML files using Microsoft Copilot in Azure](generate-kubernetes-yaml.md).

## Next steps

- Explore [capabilities](capabilities.md) of Microsoft Copilot in Azure.
- Learn more about [Azure Kubernetes Service (AKS)](/azure/aks/intro-kubernetes).

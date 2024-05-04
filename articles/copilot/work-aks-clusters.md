---
title:  Work with AKS clusters efficiently using Microsoft Copilot for Azure (preview)
description: Learn how Microsoft Copilot for Azure (preview) can help you be more efficient when working with Azure Kubernetes Service (AKS).
ms.date: 05/21/2024
ms.topic: conceptual
ms.service: copilot-for-azure
ms.author: jenhayes
author: JnHs
---

# Work with AKS clusters efficiently using Microsoft Copilot for Azure (preview)

Microsoft Copilot for Azure (preview) can help you work more efficiently with [Azure Kubernetes Service (AKS)](/azure/aks/intro-kubernetes) clusters.

When you ask Microsoft Copilot for Azure (preview) for help with AKS, it automatically pulls context when possible, based on the current conversation or on the page you're viewing in the Azure portal. If the context isn't clear, you'll be prompted to specify a cluster.

[!INCLUDE [scenario-note](includes/scenario-note.md)]

[!INCLUDE [preview-note](includes/preview-note.md)]

## Run cluster commands

You can use Microsoft Copilot for Azure (preview) to run kubectl commands based on your prompts. When you make a request that can be achieved by a kubectl command, you'll see the command along with the option to execute it directly in the **Run command** pane. This pane lets you [run commands on your cluster through the Azure API](/azure/aks/access-private-cluster?tabs=azure-portal), without directly connecting to the cluster. You can also copy the generated command and run it directly.

### Sample prompts

Here are a few examples of the kinds of prompts you can use to run kubectl commands on an AKS cluster. Modify these prompts based on your real-life scenarios, or try additional prompts to get different kinds of information.

- "List all of my failed pods in this cluster"
- "Check the rollout status for deployment `aksdeployment`"
- "Get all pods which are in pending states in all namespaces"
- "Can you delete my deployment named `my-deployment` in namespace `my-namespace`?"
- "Scale the number of replicas of my deployment `my-deployment` to 5"

### Example

You can say **"List all namespaces in my cluster."** If you're not already working with a cluster, you'll be prompted to select one. Microsoft Copilot for Azure (preview) will show you the kubectl command to perform your request, and ask if you'd like to execute the command. When you confirm, the **Run command** pane opens with the generated command included.

:::image type="content" source="media/work-aks-clusters/aks-kubectl-command.png" alt-text="Screenshot of a prompt for Microsoft Copilot for Azure (preview) to run a kubectl command.":::

## Enable IP address authorization

Use Microsoft Copilot for Azure (preview) to quickly make changes to the IP addresses that are allowed to access an AKS cluster. When you reference your own IP address, Microsoft Copilot for Azure can add it to the authorized IP ranges, without your having to enter the exact address. If you want to include alternative IP addresses, Microsoft Copilot for Azure asks if you want to open the **Networking** pane for your AKS cluster and helps you edit the relevant field.

## Sample prompts

Here are a few examples of the kinds of prompts you can use to manage the IP addresses that can access an AKS cluster. Modify these prompts based on your real-life scenarios, or try additional prompts to get different kinds of information.

- "Allow my IP to access my AKS cluster"
- "Add my IP address to the allow list of my AKS cluster's network policies"
- "Add my IP address to the authorized IP ranges of AKS cluster's networking configuration"
- "Add IP CIDR to my AKS cluster’s authorized IP ranges"
- "Update my AKS cluster's authorized IP ranges"

## Manage cluster backups

Microsoft Copilot for Azure can help streamlines the process of installing the Azure [Backup extension](/azure/backup/azure-kubernetes-service-backup-overview) to an AKS cluster. On clustesr where the extension has already been installed, it helps you [configure backups](/azure/backup/azure-kubernetes-service-cluster-backup#configure-backups) and view existing backups.

When you ask for help with backups, you'll be prompted to select a cluster. From there, Microsoft Copilot for Azure will prompt you to open the **Backup** pane for that cluster, where you can proceed with installing the extension, configuring backups, or viewing existing backups.

## Sample prompts

Here are a few examples of the kinds of prompts you can use to manage AKS cluster backups.  Modify these prompts based on your real-life scenarios, or try additional prompts to get different kinds of information.

- "Install backup extension on my AKS cluster"
- "Configure AKS backup"
- "Manage backup extension on my AKS cluster"
- "I want to view the backups on my AKS cluster"

## Example

You can say **"Install AKS backup"** to start the process of installing the AKS backup extension. After you select a cluster, you'll be prompted to open its **Backup** pane. From there, select **Launch install backup** to open the experience. You'll see the prerequisites for the extension and can then step through the installation process.

:::image type="content" source="media/work-aks-clusters/aks-backup.png" alt-text="Screenshot showing MIcrosoft Copilot for Azure (preview) starting the backup extension install process for an AKS cluster.":::

## Update AKS pricing tier

## Work with Kubernetes YAML files

Microsoft Copilot for Azure (preview) can help you create [Kubernetes YAML files](/azure/aks/concepts-clusters-workloads#deployments-and-yaml-manifests) to apply to AKS clusters.

For more information, see [Create Kubernetes YAML files using Microsoft Copilot for Azure (preview)](generate-kubernetes-yaml.md).

## Next steps

- Explore [capabilities](capabilities.md) of Microsoft Copilot for Azure (preview).
- Learn more about [Azure Kubernetes Service (AKS)](/azure/aks/intro-kubernetes).
- [Request access](https://aka.ms/MSCopilotforAzurePreview) to Microsoft Copilot for Azure (preview).

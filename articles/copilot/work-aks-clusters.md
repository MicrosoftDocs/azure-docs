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

- **List all of my failed pods in this cluster** 
- **Check the rollout status for deployment `aksdeployment`**
- **Get all pods which are in pending states in all namespaces**
- **Can you delete my deployment named `my-deployment` in namespace `my-namespace`?**
- **Scale the number of replicas of my deployment `my-deployment` to 5**

### Example

You can say **"List all namespaces in my cluster."** If you're not already working with a cluster, you'll be prompted to select one. Microsoft Copilot for Azure (preview) will show you the kubectl command to perform your request, and ask if you'd like to execute the command. When you confirm, the **Run command** pane opens with the generated command included.

:::image type="content" source="media/work-aks-clusters/aks-kubectl-command.png" alt-text="Screenshot of a prompt for Microsoft Copilot for Azure (preview) to run a kubectl command.":::

## Enable IP address authorization

## Manage cluster backups

## Update AKS pricing tier

## Work with Kubernetes YAML files

Microsoft Copilot for Azure (preview) can help you create [Kubernetes YAML files](/azure/aks/concepts-clusters-workloads#deployments-and-yaml-manifests) to apply to AKS clusters.

For more information, see [Create Kubernetes YAML files using Microsoft Copilot for Azure (preview)](generate-kubernetes-yaml.md).

## Next steps

- Explore [capabilities](capabilities.md) of Microsoft Copilot for Azure (preview).
- Learn more about [Azure Kubernetes Service (AKS)](/azure/aks/intro-kubernetes).
- [Request access](https://aka.ms/MSCopilotforAzurePreview) to Microsoft Copilot for Azure (preview).

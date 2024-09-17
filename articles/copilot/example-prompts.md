---
title: Example prompts for Microsoft Copilot in Azure
description: View example prompts that you can try out with Microsoft Copilot in Azure.
ms.date: 07/30/2024
ms.topic: conceptual
ms.service: copilot-for-azure
ms.author: jenhayes
author: JnHs
---

# Example prompts for Microsoft Copilot in Azure

Prompts are how you can interact with Microsoft Copilot in Azure (preview) to get help working with your Azure environment. This article shows a list of skills and example prompts that you can try out to see how Copilot in Azure can help with different scenarios and Azure services.

[!INCLUDE [scenario-note](includes/scenario-note.md)]

To learn more about the ways that you can use Copilot for Azure, see [Capabilities of Microsoft Copilot for Azure](capabilities.md). For tips on creating your own prompts, see [Write effective prompts for Microsoft Copilot in Azure](write-effective-prompts.md).

[!INCLUDE [preview-note](includes/preview-note.md)]

## Prompt library

To get started with Copilot for Azure, try a few prompts from this list. Feel free to experiment and make changes, or create your own prompts based on your current tasks and interests.

| Scenario | Outcome | Example prompt to try |
|----------|-------------------|-----------------------|
| [Azure portal](capabilities.md#manage-portal-settings) | Changes Azure portal theme. | "Change my theme to dark mode." |
| [Learn](capabilities.md#get-information) | Explains documentation and purposes of Azure services. | "What are the benefits and applications of Azure API Management?" |
| [Learn](capabilities.md#get-information) | Explains how to implement Azure services. | "How can I process real-time events in my application with Azure?" |
| [Learn](capabilities.md#get-information) | Outlines steps for performing tasks. | "Outline steps to secure Azure Blob Storage with private endpoints and Azure Private Link." |
| [Learn](capabilities.md#get-information) | Generates code from documentation. | "How to upload a storage container with JavaScript." |
| [Learn](capabilities.md#get-information) | Creates guides from multiple documentation sources. | "I want to use Azure functions to build an OpenAI application." |
| [Azure Resource Graph](get-information-resource-graph.md) | Lists the number of critical alerts. | "How many critical alerts do I have?" |
| [Azure Resource Graph](get-information-resource-graph.md) | Retrieves live resource information. | "Which VMs are running right now? Please restart them." |
| [Azure Resource Graph](get-information-resource-graph.md) | Identifies states of resources. | "Which resources are non-compliant?" |
| [Azure Resource Graph](get-information-resource-graph.md) | Lists resources created or modified in the last 24 hours. | "List resources that have been created or modified in the last 24 hours." |
| [Cost Management](analyze-cost-management.md) | Compares the current month's cost to the previous month's cost. | "How does our cost this month compare to last month's." |
| [Cost Management](analyze-cost-management.md) | Forecasts cost for the next 3 months. | "Forecast my cost for the next 3 months." |
| [Cost Management](analyze-cost-management.md) | Shows Azure credits balance. | "What's our Azure credits balance?" |
| [Azure CLI](generate-cli-scripts.md) | Generates a cheatsheet for managing resources with CLI. | "Generate a cheatsheet for managing VMs with CLI." |
| [Azure CLI](generate-cli-scripts.md) | Lists all resources of a certain kind using Azure CLI. | "How do I list all my VMs using Azure CLI?" |
| [Azure CLI](generate-cli-scripts.md) | Creates resources with CLI. | "Create a virtual network with two subnets using the address space of 10.0.0.0/16 using az cli." |
| [Azure CLI](generate-cli-scripts.md) | Deploys resources with CLI. | "I want to use Azure CLI to deploy and manage AKS using a private service endpoint." |
| [PowerShell](generate-powershell-scripts.md) | Create resources with PowerShell. | "How can I create a new resource group using PowerShell?" |
| [PowerShell](generate-powershell-scripts.md) | Deploy multiple resources with PowerShell. | "Help me write a PS script where after creating VM, deploy an AKS cluster on it." |
| [PowerShell](generate-powershell-scripts.md) | Manage resources with PowerShell. | "How to back up an Azure SQL single database to an Azure storage container using Azure PowerShell?" |
| [Interactive deployments](use-guided-deployments.md) | Provides a detailed guide on deploying an AKS cluster on Azure. | "Provide me with a detailed guide on deploying an AKS cluster on Azure." |
| [Interactive deployments](use-guided-deployments.md) | Explains steps to create a Linux VM on Azure and SSH into it. | "What are the steps to create a Linux VM on Azure and how do I SSH into it?" |
| [Azure Monitor](get-monitoring-information.md) | Detects anomalies in a specific resource. | "Is there any anomaly in my AKS resource?" |
| [Azure Monitor](get-monitoring-information.md) | Performs root cause analysis. | "Why is this resource not working properly?" |
| [Azure Monitor](get-monitoring-information.md) | Provides charts on platform metrics for a specific resource. | "Give me a chart of OS disk latency statistics for the last week." |
| [Azure Monitor](get-monitoring-information.md) | Queries logs using natural language | "Show me container logs that include word 'error' for the last day for namespace 'xyz'." |
| [Azure Monitor](get-monitoring-information.md) | Runs an investigation on a specific resource. | "Had an alert in my HCI at 8 am this morning, run an anomaly investigation for me." |
| [Azure Monitor](get-monitoring-information.md) | Lists alerts using natural language. | "Show me all alerts triggered during the last 24 hours." |
| [Azure Monitor](get-monitoring-information.md) | Provides a summary of alerts, including the number of critical alerts. | "Tell me more about these alerts. How many critical alerts are there?" |
| [Azure App Service](troubleshoot-app-service.md) | Analyzes performance issues with an app. | "Troubleshoot performance issues with my app." |
| [Azure App Service](troubleshoot-app-service.md) | Diagnoses high CPU usage issues. | "It seems like there's a high CPU issue with my web app." |
| [Azure App Service](troubleshoot-app-service.md) | Enables auto-heal for web apps. | "Enable auto heal on my web app." |
| [Azure App Service](troubleshoot-app-service.md) | Explains an error related to deployed web apps. | "What does this error mean for my Azure web app?" |
| [Azure App Service](troubleshoot-app-service.md) | Provides assistance with slow-running app code. | "Why is my web app slow?" |
| [Azure App Service](troubleshoot-app-service.md) | Summarizes diagnostics. | "Give me a summary of these diagnostics." |
| [Azure App Service](troubleshoot-app-service.md) | Takes a memory dump of the app. | "Take a memory dump." |
| [Azure App Service](troubleshoot-app-service.md) | Tracks uptime and downtime of a web app. | "Can I track uptime and downtime of my web app over a specific time period?" |
| [Azure Kubernetes Service](work-aks-clusters.md) | Adds the user's IP address to the allowlist. | "Add my IP address to the allowlist of my AKS cluster's network policies." |
| [Azure Kubernetes Service](work-aks-clusters.md) | Configures AKS backups. | "Configure AKS backup." |
| [Azure Kubernetes Service](work-aks-clusters.md) | Scales the number of replicas of a deployment. | "Scale the number of replicas of my deployment my-deployment to 5." |
| [Azure Kubernetes Service](work-aks-clusters.md) | Updates the authorized IP ranges. | "Update my AKS cluster's authorized IP ranges." |
| [Azure Kubernetes Service](work-aks-clusters.md) | Shows existing backups. | "I want to view the backups on my AKS cluster." |
| [Azure Kubernetes Service](work-aks-clusters.md) | Manages the backup extension. | "Manage backup extension on my AKS cluster." |
| [Azure Kubernetes Service](work-aks-clusters.md) | Upgrades the AKS pricing tier. | "Upgrade AKS cluster pricing tier to Standard." |
| [Azure SQL Databases](https://aka.ms/sqlcopilot) | Use natural language to manage Azure SQL Databases | "I want to automate Azure SQL Database scaling based on performance metrics using Azure Functions." |
| [Azure Storage](improve-storage-accounts.md) | Checks if a storage account follows security best practices. | "Does this storage account follow security best practices?" |
| [Azure Storage](improve-storage-accounts.md) | Provides recommendations to make a storage account more secure. | "How can I make this storage account more secure?" |
| [Azure Storage](improve-storage-accounts.md) | Checks for vulnerabilities in a storage account. | "Is this storage account vulnerable?" |
| [Azure Storage](improve-storage-accounts.md) | Prevents deletion of a storage account. | "How can I prevent this storage account from being deleted?" |
| [Azure Storage](improve-storage-accounts.md) | Protects data from loss or theft. | "How do I protect this storage account's data from data loss or theft?" |
| [Azure Virtual Machines](deploy-vms-effectively.md) | Creates a cost-efficient virtual machine configuration. | "Help me create a cost-efficient virtual machine." |
| [Execute commands](capabilities.md)| Restarts VMs with the tag 'env' | "Restart my VMs that have the tag 'env'" |
| [Service health](understand-service-health.md) | Checks for any outage impacting the user. | "Is there any outage impacting me?" |

## Next steps

- Learn more about [things you can do with Copilot in Azure](capabilities.md).
- Get tips on [writing effective prompts](write-effective-prompts.md) for Copilot in Azure.
- Review our [Responsible AI FAQ for Microsoft Copilot in Azure](responsible-ai-faq.md).

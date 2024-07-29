---
title: Example prompts for Microsoft Copilot in Azure
description: View example prompts that you can try out with Microsoft Copilot in Azure.
ms.date: 04/16/2024
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

## Skill and prompt library

To get started with Copilot for Azure, try a few prompts from this list. You can change prompts as needed, or create your own based on your current tasks and interests.

| Scenario | Skill description | Example prompt to try |
|----------|-------------------|-----------------------|
| Azure App Service | Analyzes performance issues with an app. | "Troubleshoot performance issues with my app." |
| Azure App Service | Diagnoses high CPU usage issues. | "It seems like there's a high CPU issue with my web app." |
| Azure App Service | Enables auto-heal for web apps. | "Enable auto heal on my web app." |
| Azure App Service | Explains an error related to deployed web apps. | "What does this error mean for my Azure web app?" |
| Azure App Service | Provides assistance with slow-running app code. | "Why is my web app slow?" |
| Azure App Service | Summarizes diagnostics. | "Give me a summary of these diagnostics." |
| Azure App Service | Takes a memory dump of the app. | "Take a memory dump." |
| Azure App Service | Tracks uptime and downtime of a web app. | "Can I track uptime and downtime of my web app over a specific time period?" |
| Azure CLI & PowerShell | Generates a cheatsheet for managing resources with CLI. | "Generate a cheatsheet for managing VMs with CLI." |
| Azure CLI & PowerShell | Lists all resources of a certain kind using Azure CLI. | "How do I list all my VMs using Azure CLI?" |
| Azure CLI & PowerShell | Creates resources with CLI. | "Create a virtual network with two subnets using the address space of 10.0.0.0/16 using az cli." |
| Azure CLI & PowerShell | Deploys resources with CLI. | "I want to use Azure CLI to deploy and manage AKS using a private service endpoint." |
| Azure Kubernetes Service | Adds the user's IP address to the allowlist. | "Add my IP address to the allowlist of my AKS cluster's network policies." |
| Azure Kubernetes Service | Configures AKS backups. | "Configure AKS backup." |
| Azure Kubernetes Service | Scales the number of replicas of a deployment. | "Scale the number of replicas of my deployment my-deployment to 5." |
| Azure Kubernetes Service | Updates the authorized IP ranges. | "Update my AKS cluster's authorized IP ranges." |
| Azure Kubernetes Service | Shows existing backups. | "I want to view the backups on my AKS cluster." |
| Azure Kubernetes Service | Manages the backup extension. | "Manage backup extension on my AKS cluster." |
| Azure Kubernetes Service | Upgrades the AKS pricing tier. | "Upgrade AKS cluster pricing tier to Standard." |
| Azure Monitor | Lists alerts using natural language. | "Show me all alerts triggered during the last 24 hours." |
| Azure Monitor | Provides a summary of alerts, including the number of critical alerts. | "Tell me more about these alerts. How many critical alerts are there?" |
| Azure Monitor | Detects anomalies in a specific resource. | "Is there any anomaly in my AKS resource?" |
| Azure Monitor | Performs root cause analysis. | "Why is this resource not working properly?" |
| Azure Monitor | Provides charts on platform metrics for a specific resource. | "Give me a chart of OS disk latency statistics for the last week." |
| Azure Monitor | Queries logs using natural language | "Show me container logs that include word 'error' for the last day for namespace 'xyz'." |
| Azure Monitor | Runs an investigation on a specific resource. | "Had an alert in my HCI at 8 am this morning, run an anomaly investigation for me." |
| Azure Portal | Changes Azure Portal theme. | "Change my theme to dark mode." |
| Azure Resource Graph | Lists the number of critical alerts. | "How many critical alerts do I have?" |
| Azure Resource Graph | Retrieves live resource information. | "Which VMs are running right now? Please restart them." |
| Azure Resource Graph  | Identifies states of resources. | "Which resources are non-compliant?" |
| Azure Resource Graph  | Lists resources created or modified in the last 24 hours. | "List resources that have been created or modified in the last 24 hours." |
| Azure SQL Databases | Use natural language to manage Azure SQL Databases | "I want to automate Azure SQL Database scaling based on performance metrics using Azure Functions." |
| Azure Storage | Checks if a storage account follows security best practices. | "Does this storage account follow security best practices?" |
| Azure Storage | Provides recommendations to make a storage account more secure. | "How can I make this storage account more secure?" |
| Azure Storage | Checks for vulnerabilities in a storage account. | "Is this storage account vulnerable?" |
| Azure Storage | Prevents deletion of a storage account. | "How can I prevent this storage account from being deleted?" |
| Azure Storage | Protects data from loss or theft. | "How do I protect this storage account's data from data loss or theft?" |
| Azure Virtual Machines | Creates a cost-efficient virtual machine configuration. | "Help me create a cost-efficient virtual machine." |
| Cost Management | Compares the current month's cost to the previous month's cost. | "How does our cost this month compare to last month's." |
| Cost Management | Forecasts cost for the next 3 months. | "Forecast my cost for the next 3 months." |
| Cost Management | Shows Azure credits balance. | "What's our Azure credits balance?" |
| Execute Commands | Restarts VMs with the tag 'env' | "Restart my VMs that have the tag 'env'" |
| Guided Deployments | Provides a detailed guide on deploying an AKS cluster on Azure. | "Provide me a detailed guide on deploying an AKS cluster on Azure." |
| Guided Deployments | Explains steps to create a Linux VM on Azure and SSH into it. | "What are the steps to create a Linux VM on Azure and how do I SSH into it?" |
| Learn | Explains documentation and purposes of Azure services. | "What are the benefits and applications of Azure API Management?" |
| Learn | Explains how to implement Azure services. | "How can I process real-time events in my application with Azure?" |
| Learn | Outlines steps for performing tasks. | "Outline steps to secure Azure Blob Storage with private endpoints and Azure Private Link." |
| Learn | Generates code from documentation. | "How to upload a storage container with JavaScript." |
| Learn | Creates guides from multiple documentation sources. | "I want to use Azure functions to build an OpenAI application." |
| Service health | Checks for any outage impacting the user. | "Is there any outage impacting me?" |

## Next steps

- Learn about [some of the things you can do with Microsoft Copilot in Azure](capabilities.md).
- Review our [Responsible AI FAQ for Microsoft Copilot in Azure](responsible-ai-faq.md).

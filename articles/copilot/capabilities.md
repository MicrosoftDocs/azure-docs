---
title:  Microsoft Copilot in Azure capabilities
description: Learn about the things you can do with Microsoft Copilot in Azure.
ms.date: 05/28/2024
ms.topic: conceptual
ms.service: copilot-for-azure
ms.custom:
  - ignite-2023
  - ignite-2023-copilotinAzure
  - build-2024
ms.author: jenhayes
author: JnHs
---

# Microsoft Copilot in Azure capabilities

Microsoft Copilot in Azure (preview) amplifies your impact with AI-enhanced operations. 

[!INCLUDE [preview-note](includes/preview-note.md)]

## Perform tasks

Use Microsoft Copilot in Azure to perform many basic tasks in the Azure portal or [in the Azure mobile app](../azure-portal/mobile-app/microsoft-copilot-in-azure.md). There are many things you can do! Take a look at these articles to learn about some of the scenarios in which Microsoft Copilot in Azure can be especially helpful.

- Understand your Azure environment:
  - [Get resource information through Azure Resource Graph queries](get-information-resource-graph.md)
  - [Understand service health events and status](understand-service-health.md)
  - [Analyze, estimate, and optimize costs](analyze-cost-management.md)
  - [Query your attack surface](query-attack-surface.md)
- Work smarter with Azure services:
  - [Deploy virtual machines effectively](deploy-vms-effectively.md)
  - [Build infrastructure and deploy workloads](build-infrastructure-deploy-workloads.md)
  - [Create resources using guided deployments](use-guided-deployments.md)
  - [Work with AKS clusters efficiently](work-aks-clusters.md)
  - [Get information about Azure Monitor metrics and logs](get-monitoring-information.md)
  - [Work smarter with Azure Stack HCI](work-smarter-edge.md)
  - [Secure and protect storage accounts](improve-storage-accounts.md)
  - [Improve Azure SQL Database-driven applications](/azure/azure-sql/copilot/copilot-azure-sql-overview#microsoft-copilot-for-azure-enhanced-scenarios)
- Write and optimize code:
  - [Generate Azure CLI scripts](generate-cli-scripts.md)
  - [Generate PowerShell scripts](generate-powershell-scripts.md)
  - [Discover performance recommendations with Code Optimizations](optimize-code-application-insights.md)
  - [Author API Management policies](author-api-management-policies.md)
  - [Create Kubernetes YAML files](generate-kubernetes-yaml.md)
  - [Troubleshoot apps faster with App Service](troubleshoot-app-service.md)

> [!NOTE]
> Microsoft Copilot in Azure (preview) includes access to Copilot in Azure SQL Database (preview). This offering can help you streamline the design, operation, optimization, and health of Azure SQL Database-driven applications. It improves productivity in the Azure portal by offering natural language to SQL conversion and self-help for database administration. For more information, see [Copilot in Azure SQL Database (preview)](https://aka.ms/sqlcopilot).

## Get information

From anywhere in the Azure portal, you can ask Microsoft Copilot in Azure to explain more about Azure concepts, services, or offerings. You can ask questions to learn how a feature works, or which configurations best meet your budgets, security, and scale requirements. Copilot can guide you to the right user experience or even author scripts and other artifacts that you can use to deploy your solutions. Answers are grounded in the latest Azure documentation, so you can get up-to-date guidance just by asking a question.

Asking questions to understand more can be especially helpful when you're troubleshooting problems. Describe the problem, and Microsoft Copilot in Azure will provide some suggestions on how you might be able to resolve the issue. For example, you can say things like "Cluster stuck in upgrading state while performing update operation" or "Azure database unable to connect from Power BI". You'll see information about the problem and possible resolution options.

Microsoft Copilot in Azure can also help you understand more about information presented in Azure. This can be especially helpful when looking at diagnostic details. For example, when viewing diagnostics for a resource, you can say "Give me a summary of this page" or "What's the issue with my app?" You can ask what an error means, or ask what the next steps would be to implement a recommended solution.

## Find recommended services

Ask questions to learn which services are best suited for your workloads, or get ideas about additional services that might help support your objectives. For instance, you can ask "What service would you recommend to implement distributed caching?" or "What are popular services used with Azure Container Apps?" Where applicable, Microsoft Copilot in Azure provides links to start working with the service or learn more. In some cases, you'll also see metrics about how often a service is used. You can also ask additional questions to find out more about the service and whether it's right for your needs.

## Navigation

Rather than searching for a service to open, simply ask Microsoft Copilot in Azure to open the service for you. If you can't remember the exact name, you'll see some suggestions and can choose the right one, or ask Microsoft Copilot in Azure to explain more.

## Manage portal settings

Use Microsoft Copilot in Azure to confirm your settings selection or change options, without having to open the **Settings** pane. For example, you can ask Copilot which Azure themes are available, then have it apply the one you choose.

## Current limitations

While Microsoft Copilot in Azure can perform many types of tasks, it's important to understand what not to expect. In some cases, Microsoft Copilot in Azure might not be able to complete your request. In these cases, you'll generally see an explanation along with more information about how you can carry out the intended action.

Keep in mind these current limitations:

- Any action taken on more than 10 resources must be performed outside of Microsoft Copilot in Azure.

- You can only make 15 requests during any given chat, and you only have 10 chats in a 24 hour period.

- Some responses that display lists will be limited to the top five items.
- For some tasks and queries, using a resource's name will not work, and the Azure resource ID must be provided.
- Microsoft Copilot in Azure is currently available in English only.

## Next steps

- [Get tips for writing effective prompts](write-effective-prompts.md) to use with Microsoft Copilot in Azure.
- Learn about [managing access to Copilot in Azure](manage-access.md) in your organization.

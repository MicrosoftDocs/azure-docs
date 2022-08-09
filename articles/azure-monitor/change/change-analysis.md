---
title: Use Change Analysis in Azure Monitor to find web-app issues | Microsoft Docs
description: Use Change Analysis in Azure Monitor to troubleshoot issues on live sites.
ms.topic: conceptual
ms.author: hannahhunter
author: hhunter-ms
ms.contributor: cawa
ms.date: 06/29/2022 
ms.subservice: change-analysis
ms.custom: devx-track-azurepowershell

---

# Use Change Analysis in Azure Monitor (preview)

While standard monitoring solutions might alert you to a live site issue, outage, or component failure, they often don't explain the cause. For example, your site worked five minutes ago, and now it's broken. What changed in the last five minutes? 

We've designed Change Analysis to answer that question in Azure Monitor.

Building on the power of [Azure Resource Graph](../../governance/resource-graph/overview.md), Change Analysis:
- Provides insights into your Azure application changes.
- Increases observability.
- Reduces mean time to repair (MTTR).

> [!IMPORTANT]
> Change Analysis is currently in preview. This version:
>
> - Is provided without a service-level agreement. 
> - Is not recommended for production workloads. 
> - Includes unsupported features and might have constrained capabilities. 
>
> For more information, see [Supplemental terms of use for Microsoft Azure previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

> [!NOTE]
> Change Analysis is currently only available in Public Azure Cloud.

## Change Analysis architecture 

Change Analysis detects various types of changes, from the infrastructure layer through application deployment. Change Analysis is a subscription-level Azure resource provider that:
- Checks resource changes in the subscription. 
- Provides data for various diagnostic tools to help users understand what changes might have caused issues.

The following diagram illustrates the architecture of Change Analysis:

![Architecture diagram of how Change Analysis gets change data and provides it to client tools](./media/change-analysis/overview.png)

## Supported resource types

Azure Monitor Change Analysis service supports resource property level changes in all Azure resource types, including common resources like:
- Virtual Machine
- Virtual machine scale set
- App Service
- Azure Kubernetes Service (AKS)
- Azure Function
- Networking resources: 
    - Network Security Group
    - Virtual Network
    - Application Gateway, etc.
- Data services: 
    - Storage
    - SQL
    - Redis Cache
    - Cosmos DB, etc.

## Data sources

Azure Monitor's Change Analysis queries for:
- Azure Resource Manager tracked properties.
- Proxied configurations.
- Web app in-guest changes. 

Change Analysis also tracks resource dependency changes to diagnose and monitor an application end-to-end.

### Azure Resource Manager tracked properties changes

Using [Azure Resource Graph](../../governance/resource-graph/overview.md), Change Analysis provides a historical record of how the Azure resources that host your application have changed over time. The following tracked settings can be detected:
- Managed identities
- Platform OS upgrade
- Hostnames

### Azure Resource Manager proxied setting changes

Unlike Azure Resource Graph, Change Analysis securely queries and computes IP Configuration rules, TLS settings, and extension versions to provide more change details in the app.

### Changes in web app deployment and configuration (in-guest changes)

Every 30 minutes, Change Analysis captures the deployment and configuration state of an application. For example, it can detect changes in the application environment variables. The tool computes the differences and presents the changes. 

Unlike Azure Resource Manager changes, code deployment change information might not be available immediately in the Change Analysis tool. To view the latest changes in Change Analysis, select **Refresh**.

:::image type="content" source="./media/change-analysis/scan-changes.png" alt-text="Screenshot of the Scan changes now button":::   

If you don't see changes within 30 minutes, refer to [our troubleshooting guide](./change-analysis-troubleshoot.md#cannot-see-in-guest-changes-for-newly-enabled-web-app). 

Currently, all text-based files under site root **wwwroot** with the following extensions are supported:
- *.json
- *.xml
- *.ini
- *.yml
- *.config
- *.properties
- *.html
- *.cshtml
- *.js
- requirements.txt
- Gemfile
- Gemfile.lock
- config.gemspec

### Dependency changes

Changes to resource dependencies can also cause issues in a resource. For example, if a web app calls into a Redis cache, the Redis cache SKU could affect the web app performance. 

As another example, if port 22 was closed in a virtual machine's Network Security Group, it will cause connectivity errors.

#### Web App diagnose and solve problems navigator (Preview)

To detect changes in dependencies, Change Analysis checks the web app's DNS record. In this way, it identifies changes in all app components that could cause issues.

Currently the following dependencies are supported in **Web App Diagnose and solve problems | Navigator (Preview)**:

- Web Apps
- Azure Storage
- Azure SQL

#### Related resources

Change Analysis detects related resources. Common examples are:

- Network Security Group
- Virtual Network
- Azure Monitor Gateway
- Load Balancer related to a Virtual Machine.

Network resources are usually provisioned in the same resource group as the resources using it. Filter the changes by resource group to show all changes for the virtual machine and its related networking resources.

:::image type="content" source="./media/change-analysis/network-changes.png" alt-text="Screenshot of Networking changes":::   

## Next steps

- Learn about [enabling Change Analysis](change-analysis-enable.md)
- Learn about [visualizations in Change Analysis](change-analysis-visualizations.md)
- Learn how to [troubleshoot problems in Change Analysis](change-analysis-troubleshoot.md)
- Enable Application Insights for [Azure App Services apps](../../azure-monitor/app/azure-web-apps.md).
- Enable Application Insights for [Azure VM and Azure virtual machine scale set IIS-hosted apps](../../azure-monitor/app/azure-vm-vmss-apps.md).

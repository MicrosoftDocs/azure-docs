---
title: Workspace architecture best practices for Azure Sentinel
description: Learn about best practices for designing your Azure Sentinel workspace.
services: sentinel
author: batamig
ms.author: bagol
ms.service: azure-sentinel
ms.subservice: azure-sentinel
ms.topic: conceptual
ms.date: 07/13/2021
---

## Azure Sentinel workspace architecture best practices

When planning your Azure Sentinel workspace deployment, you must also design your Log Analytics workspace architecture. Decisions about the workspace architecture are typically driven by business and technical requirements. This article reviews key decision factors to help you determine the right workspace architecture for your organizations, including:

- Whether you'll use a single tenant or multiple tenants
- Any compliance requirements you have for data collection and storage
- How to control access to Azure Sentinel data
- Cost implications for different scenarios

For more information, see [Sample workspace designs](sample-workspace-designs.md) for common scenarios, and [Pre-deployment activities and prerequisites for deploying Azure Sentinel](prerequisites.md).

## Tenancy considerations

While fewer workspaces are simpler to manage, you may have specific needs for multiple tenants and workspaces. For example, many organizations have a cloud environment that contains multiple [Azure Active Directory (Azure AD) tenants](/azure/active-directory/develop/quickstart-create-new-tenant), resulting from mergers and acquisitions or due to identity separation requirements.

When determining how many tenants and workspaces to use, consider that most Azure Sentinel features operate by using a single workspace or Azure Sentinel instance, and Azure Sentinel ingests all logs housed within the workspace.

Therefore, for example, if you have both security-related and non-security logs, or logs that should not be ingested by Azure Sentinel, you may want to create an additional workspace to store the non-Azure Sentinel logs and avoid unwanted costs.

The following image shows an architecture where security and non-security logs go to separate workspaces, with Azure Sentinel ingesting only the security-related logs.

:::image type="content" source="media/best-practices/separate-workspaces-for-different-logs.png" alt-text="Separate workspaces for security-related logs and non-security logs.":::

### Working with multiple tenants

If you have multiple tenants, such as if you're a managed security service provider (MSSP), we recommend that you create at least one workspace for each Azure AD tenant to support built-in, [service to service data connectors](connect-data-sources.md#service-to-service-integration) that work only within their own Azure AD tenant.

Some examples of such data connectors include:

- [Office 365](connect-office-365.md)
- [Azure Azure AD](connect-azure-active-directory.md)
- [Azure Defender for IoT](connect-asc-iot.md)
- [Azure AD Identity Protection](connect-azure-ad-identity-protection.md)
- [Microsoft 365 Defender](connect-microsoft-365-defender.md)

For example, the following image shows a recommended architecture for a customer that has two Azure AD tenants, and needs to connect data sources that include Office 365, Azure AD, Azure Firewall, and an on-premises Palo Alto Firewall.

:::image type="content" source="media/best-practices/architecture-multiple-tenants.png" alt-text="Sample architecture for multiple tenants":::

In this example:

- Resources that are attached to an Azure AD tenant send their logs to a local Azure Sentinel workspace located in the same Azure AD tenant.
- Partner resources based on API or agent integration, such as the Palo Alto Firewall, can connect to any of the workspaces in the environment.

Use [Azure Lighthouse](/azure/lighthouse/how-to/onboard-customer) to help manage multiple Azure Sentinel instances in different tenants. 

> [!NOTE]
> [Partner data connectors](partner-data-connectors.md) are typically based on API or agent collections, and therefore are not attached to a specific Azure AD tenant.
>

### Working with multiple workspaces

If you are working with multiple workspaces, simplify your incident management and investigation by [condensing and listing all incidents from each Azure Sentinel instance in a single location](multiple-workspace-view.md).

To reference data that's held in other Azure Sentinel workspaces, such as in [cross-workspace workbooks](extend-sentinel-across-workspaces-tenants.md#cross-workspace-workbooks), use [cross-workspace queries](extend-sentinel-across-workspaces-tenants.md).

The best time to use cross-workspace queries is when valuable information is stored in a different workspace, subscription or tenant, and can provide value to your current action. For example, the following code shows a sample cross-workspace query:

```Kusto
union Update, workspace("contosoretail-it").Update, workspace("WORKSPACE ID").Update
| where TimeGenerated >= ago(1h)
| where UpdateState == "Needed"
| summarize dcount(Computer) by Classification
```

For more information, see [Protecting MSSP intellectual property in Azure Sentinel](mssp-protect-intellectual-property.md).


## Compliance considerations

After your data is collected, stored, and processed, compliance can become an important design requirement, with a significant impact on your Azure Sentinel architecture. Having the ability to validate and prove who has access to what data under all conditions is a critical data sovereignty requirement in many countries and regions, and assessing risks and getting insights in Azure Sentinel workflows is a priority for many customers.

In Azure Sentinel, data is mostly stored and processed in the same geography or region, with some exceptions, such as when using detection rules that leverage Microsoft's Machine learning. In such cases, data may be copied outside your workspace geography for processing.

For more information, see:

- [Geographical availability and data residency](quickstart-onboard.md#geographical-availability-and-data-residency)
- [Data residency in Azure](https://azure.microsoft.com/en-us/global-infrastructure/data-residency/)
- [Storing and processing EU data in the EU - EU policy blog](https://blogs.microsoft.com/eupolicy/2021/05/06/eu-data-boundary/)

To start validating your compliance, assess your data sources, and how and where they send data.

> [!NOTE]
> The [Log Analytics agent](connect-windows-security-events.md) supports TLS 1.2 to ensure data security in transit between the agent and the Log Analytics service, as well as the FIPS 140 standard. 
>
> If you are sending data to a geography or region that is different from your Azure Sentinel workspace, regardless of whether or not the sending resource resides in Azure, consider using a workspace in the same geography or region.
>

## Region considerations

Use separate Azure Sentinel instances for each region. While Azure Sentinel can be used in multiple regions, you may have requirements to separate data by team, region, or site, or regulations and controls that make multi-region models impossible or more complex than needed. Using separate instances and workspaces for each region helps to avoid bandwidth / egress costs for moving data across regions.

Consider the following when working with multiple regions:

- Egress costs generally apply when the [Log Analytics or Azure Monitor agent](connect-windows-security-events.md) is required to collect logs, such as on virtual machines.

- Internet egress is also charged, which may not affect you unless you export data outside your Log Analytics workspace. For example, you may incur internet egress charges if you export your Log Analytics data to an on-premises server.

- Bandwidth costs vary depending on the source and destination region and collection method. For more information, see:

    - [Bandwidth pricing](https://azure.microsoft.com/en-us/pricing/details/bandwidth/)
    - [Data transfers charges using Log Analytics ](/azure/azure-monitor/logs/manage-cost-storage).

- Use templates for your analytics rules, custom queries, workbooks, and other resources to make your deployments more efficient. Deploy the templates instead of manually deploying each resource in each region.

For example, if you decide to collect logs from Virtual Machines in East US and send them to an Azure Sentinel workspace in West US, you'll be charged ingress costs for the data transfer. Since the Log Analytics agent compresses the data in transit, the size charged for the bandwidth may be lower than the size of the logs in Azure Sentinel.

If you're collecting Syslog and CEF logs from multiple sources around the world, you may want to set up a Syslog collector in the same region as your Azure Sentinel workspace to avoid bandwidth costs, provided that compliance is not a concern.

Understanding whether bandwidth costs justify separate Azure Sentinel workspaces depend on the volume of data you need to transfer between regions. Use the [Azure Pricing Calculator](https://azure.microsoft.com/en-us/pricing/details/bandwidth/) to estimate your costs.

For more information, see [Data residency in Azure](https://azure.microsoft.com/en-us/global-infrastructure/data-residency/).

<!--	-	There are no bandwidth costs when the logs are collected using Diagnostics settings, like Azure AD, Azure Activity, Azure SQL, or Azure Firewall as stated here. At the time of writing this article, where bandwidth costs apply, the first 5GB/month are free. Summary of Connectors-->

## Access considerations

You may have situations planned where different teams will need access to the same data. For example, your SOC team must have access to all Azure Sentinel data, while operations and applications teams will need access to only specific parts. Independent security teams may also need to access Azure Sentinel features, but with varying sets of data.

Combine [resource-context RBAC](resource-context-rbac.md) and [table-level RBAC](/azure/azure-monitor/logs/manage-access#table-level-azure-rbac) to provide your teams with a wide range of access options that should support most use cases.

### Resource-context RBAC

The following image shows a simplified version of a workspace architecture where security and operations teams need access to different sets of data, and resource-context RBAC is used to provide the required permissions.

:::image type="content" source="media/resource-context-rbac/resource-context-rbac-sample.png" alt-text="Sample architecture for resource-context RBAC.":::

In this image, the Azure Sentinel workspace is placed in a separate subscription to better isolate permissions.

> [!NOTE]
> Another option would be to place Azure Sentinel under a separate management group that's dedicated to security, which would ensure that only minimal permission assignments are inherited. Within the security team, several groups are assigned permissions according to their functions. Because these teams have access to the entire workspace, they'll have access to the full Azure Sentinel experience, restricted only by the Azure Sentinel roles they're assigned. For more information, see [Permissions in Azure Sentinel](roles.md).
>

In addition to the security subscription, a separate subscription is used for the applications teams to host their workloads. The applications teams are granted access to their respective resource groups, where they can manage their resources. This separate subscription and resource-context RBAC allows these teams to view logs generated by any resources they have access to, even when the logs are stored in an workspace where they *don't* have direct access. The applications teams can access their logs via the **Logs** area of the Azure portal, to show logs for a specific resource, or via Azure Monitor, to show all of the logs they can access at the same time.

Azure resources have built-in support for resource-context RBAC, but may require additional fine-tuning when working with non-Azure resources. For more information, see [Explicitly configure resource-context RBAC](resource-context-rbac.md#explicitly-configure-resource-context-rbac).

### Table-level RBAC

Table-level RBAC enables you to define specific data types (tables) to be accessible only to a specified set of users.

For example, consider if the organization whose architecture is described in the image above must also grant access to Office 365 logs to an internal audit team. In this case, they might use table-level RBAC to grant the audit team with access to the entire **OfficeActivity** table, without granting permissions to any other table.

### Access considerations with multiple workspaces

If you have different entities, subsidiaries, or geographies within your organization, each with their own security teams that need access to Azure Sentinel, use separate workspaces for each entity or subsidiary. Implement the separate workspaces within a single Azure AD tenant, or across multiple tenants using Azure Lighthouse. 

Your central SOC team may also use an additional, optional Azure Sentinel workspace to manage centralized artifacts such as analytics rules or workbooks.

For more information, see [Working with multiple workspaces](#working-with-multiple-workspaces).

## Technical best practices for creating your workspace

Use the following best practice guidance when creating the Log Analytics workspace you'll use for Azure Sentinel:

- **When naming your workspace**, include *Azure Sentinel* or some other indicator in the name, so that it's easily identified among your other workspaces.

- **Use the same workspace for both Azure Sentinel and Azure Security Center**, so that all logs collected by Azure Security Center can also be ingested and used by Azure Sentinel. The default workspace created by Azure Security Center will not appear as an available workspace for Azure Sentinel.

- **Use a dedicated workspace cluster if your projected data ingestion is around or more than 1 TB per day**. A [dedicated cluster](/azure/azure-monitor/logs/logs-dedicated-clusters) enables you to secure resources for your Azure Sentinel data, which enables better query performance for large data sets. Dedicated clusters also provide the option for more encryption and control of your organization's keys.







<!-- make sure this info is in roles>
| Security Analysts                                                                                                                                                                                                                            |                  |                                      |                                      |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------- | ------------------------------------ | ------------------------------------ |
| Azure Sentinel Responder                                                                                                                                                                                                                    |                  |                                      |                                      |
| Azure Sentinel’s Resource Group	View data                                                                                                                                                                                                   | incidents       | workbooks                           | and other Azure Sentinel resources. |
| Manage incidents (assign                                                                                                                                                                                                                     | dismiss         | etc.)                               |                                      |
| Logic Apps Contributor	Azure Sentinel’s Resource Group                                                                                                                                                                                      |                  |                                      |                                      |
| (or RG where Playbooks are stored)	Attach Playbooks to Analytics Rules and Automation Rules. Run Playbooks. NOTE: this will also allow playbook modification by analysts                                                                     |                  |                                      |                                      |
| Security Engineers                                                                                                                                                                                                                           |                  |                                      |                                      |
| Azure Sentinel Contributor	Sentinel’s Resource Group	View data                                                                                                                                                                              | incidents       | workbooks                           | and other Azure Sentinel resources. |
| Manage incidents (assign                                                                                                                                                                                                                     | dismiss         | etc.).                              |                                      |
| Create and edit workbooks                                                                                                                                                                                                                    | analytics rules | and other Azure Sentinel resources. |                                      |
| Logic Apps Contributor	Azure Sentinel’s Resource Group (or RG where Playbooks are stored)	Attach Playbooks to Analytics Rules and Automation Rules. Run and Modify Playbooks. NOTE: this will also allow playbook modification by analysts. |                  |                                      |                                      |
| Service Principal	Azure Sentinel Contributor	Azure Sentinel’s Resource Group	Automated configuration management tasks                                                                                                                        |                  |                                      |                                      |
•	When designating permissions for Azure Sentinel usage, Azure Sentinel Responder, Azure Sentinel Reader, Azure Sentinel Contributor will be needed by the users depending on their role within the product. Additional roles related to Azure services outside of Azure Sentinel, Azure Monitor, and Azure Log Analytics may be needed if ingesting data or monitoring those services. Azure AD roles may be required, such as global admin or security admin, when setting up data connectors for services in other Microsoft portals.
</--> 



## Next steps

> [!div class="nextstepaction"]
>[On-board Azure Sentinel](quickstart-onboard.md)

> [!div class="nextstepaction"]
>[Get visibility into alerts](quickstart-get-visibility.md)

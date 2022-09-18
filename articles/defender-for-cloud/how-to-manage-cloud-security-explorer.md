---
title: Build queries with Cloud Security Explorer
description: Learn how to build queries in Cloud Security Explorer to find vulnerabilities that exist on your multicloud environment.
ms.topic: how-to
ms.date: 09/18/2022
---

# Cloud Security Explorer

Defender for Cloud's contextual security capabilities assists security teams in the reduction of the risk of impactful breaches. Defender for Cloud uses environmental context to perform a risk assessment of your security issues, and identifies the biggest security risks and distinguishes them from less risky issues.

The Cloud Security Explorer allows you to proactively identify security risks in your cloud environment by running graph-based queries on the Cloud Security Graph, which is Defender for Cloud's context engine. You can prioritize your security team's concerns, while taking your organization's specific context and conventions into account.  

With the Cloud Security Explorer, you can query all of your security issues and environment context such as assets inventory, exposure to internet, permissions, lateral movement between resources and more. 

## Availability

| Aspect | Details |
|--|--|
| Required plans | - Defender CSPM P1 enabled |
| Required roles and permissions: | - **Security Reader** <br> - **Security Admin** <br> - **Reader** <br> - **Contributor** <br> - **Owner** |
| Clouds: | :::image type="icon" source="./media/icons/yes-icon.png"::: Commercial clouds (Azure, AWS) <br>:::image type="icon" source="./media/icons/no-icon.png"::: Commercial clouds (GCP) <br>:::image type="icon" source="./media/icons/no-icon.png"::: National (Azure Government, Azure China 21Vianet) |

## Build a query with the Cloud Security Explorer

You can use the Cloud Security Explorer to build queries that can proactively hunt for security risks in your environments. 

**To build a query**:

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Navigate to **Microsoft Defender for Cloud** > **Cloud Security Explorer**.

    :::image type="content" source="media/concept-cloud-map/cloud-security-explorer.png" alt-text="Screenshot of the Cloud Security Explorer page." lightbox="media/concept-cloud-map/cloud-security-explorer.png":::

1. Select a resource from the drop-down menu.

    :::image type="content" source="media/how-to-manage-cloud-security/select-resource.png" alt-text="Screenshot of the resource drop-down menu.":::

1. Select **+** to add other filters to your query. For each filter selected you can add more subfilters as needed.

1. Select **Search**.

    :::image type="content" source="media/how-to-manage-cloud-security/search-query.png" alt-text="Screenshot that shows a full query and where to select on the screen to perform the search.":::

The results will populate on the bottom of the page.

## Query templates

You can select an existing query template from the bottom of the page by selecting **Open query**.

:::image type="content" source="media/how-to-manage-cloud-security/query-template.png" alt-text="Screenshot that shows you where the query templates are located.":::

You can alter any template to search for specific results by changing the query and selecting search.

## Query options

The following information can be queried in the Cloud Security Explorer:

- **Recommendations** - All Defender for Cloud security recommendations.

- **Vulnerabilities** - All vulnerabilities found by Defender for Cloud.

- **Insights** - Contextual data about your cloud resources.

    | Insight | Description |
    |--|--|
    | **Exposed to the internet** | - Indicates if a resource is exposed to the internet. <br> - - Supports the following resource types: Azure virtual machine, AWS EC2, Azure storage account, Azure SQL server, Azure Cosmos DB, AWS S3, Kubernetes pod. <br> - Supports port filtering. |
    | **Contains sensitive data** | - Indicates if a resource contains sensitive data based on Azure Purview scan and applicable only if Azure Purview is enabled. <br> - Supports the following resources: Azure SQL Server, Azure Storage Account, AWS S3 bucket. |
    | **Has tags** | - Allows you to filter Azure and AWS resources based on resource tags. This supports all Azure and AWS resources. |
    | **Installed software** | - Allows you to filter Azure VMs based on software that is installed on the machine. This is applicable only for VMs that have [Threat and vulnerability management integration with Defender for Cloud](deploy-vulnerability-assessment-tvm.md) enabled and are connected to Defender for Cloud. |        
        
- **Connections** - Connections that are identified between cloud resources in your environment.

    | Connection | Description |
    |--|--|
    | **Can authenticate as** | - Indicates that an Azure resource can authenticate to an Identity and use its privileges. <br> - Supported resources: Azure VM, Azure virtual machine scale set, Azure Storage Account, Azure App Services, SQL Servers. <br> - Supported identity types: Azure AD managed identity. |
    | **Has permission to** | - Indicating that an Identity has permissions to an Azure and AWS resource. <br> - Supporting Identities: Azure AD user or service principal, Azure AD managed identity, AWS IAM user. <br> - Supporting resources: All Azure and AWS resources. |
    | **Contains** | - Indicating that an Azure subscription/RG or an AWS account contains an Azure and AWS resource. <br> - Supported: All resources. |

## Next steps


---
title: Build queries with Cloud Security Explorer
description: Learn how to build queries in Cloud Security Explorer to find vulnerabilities that exist on your multicloud environment.
ms.topic: how-to
ms.date: 08/21/2022
---

# Cloud Security Explorer

Defender for Cloud provides cloud security capabilities that help organizations assess their risks to their environments that are exposed. Organizations can do this while taking into account the structure of their cloud environment and its unique circumstances. Such as Internet exposure, permissions, connection between resources and more, which can affect the overall level of risk.

Cloud Security Explorer provides you the ability to perform proactive hunting and search for these security risks within your organization by running graph-based path-finding queries on top the contextual security data already provided by Defender for Cloud. Such as, cloud misconfigurations, vulnerabilities, resource context, lateral movement possibilities between resources and more.

## Availability

| Aspect | Details |
|--|--|
| Required plans | - Defender for SQL enabled <br> - Defender for Servers enabled <br> - Defender for Containers enabled <br> - [Threat and vulnerability management integration with Defender for Cloud](deploy-vulnerability-assessment-tvm.md) enabled |
| Required roles and permissions: | - **Security Reader** <br> - **Security Admin** <br> - **Reader** <br> - **Contributor** <br> - **Owner** |
| Clouds: | :::image type="icon" source="./media/icons/yes-icon.png"::: Commercial clouds (Azure, AWS) <br>:::image type="icon" source="./media/icons/no-icon.png"::: Commercial clouds (GCP) <br>:::image type="icon" source="./media/icons/no-icon.png"::: National (Azure Government, Azure China 21Vianet) |

## Build queries with Cloud Security Explorer

You can use the Cloud Security Explorer to build queries that can proactively hunt for security risks in your environments. 

**To build a query**:

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Navigate to **Microsoft Defender for Cloud** > **Cloud Security Explorer**.

    :::image type="content" source="media/concept-cloud-map/cloud-security-explorer.png" alt-text="Screenshot of the Cloud Security Explorer page." lightbox="media/concept-cloud-map/cloud-security-explorer.png":::

1. Select a resource from the drop down menu.

    :::image type="content" source="media/how-to-manage-cloud-security/select-resource.png" alt-text="Screenshot of the resource drop down menu.":::

1. Select **+** to add other filters to your query. For each filter selected you can add any additional filters as needed.

1. Select **Search**.

    :::image type="content" source="media/how-to-manage-cloud-security/search-query.png" alt-text="Screenshot that shows a full query and where to select on the screen to perform the search.":::

The results will populate on the bottom of the page.

## Search a query from a template

You can select a saved query template from the bottom of the page by selecting **Open query**.

:::image type="content" source="media/how-to-manage-cloud-security/query-template.png" alt-text="Screenshot that shows you where the query templates are located.":::

If you have already built a query and searched for the results, you can select the **Templates** tab.

:::image type="content" source="media/how-to-manage-cloud-security/query-templates.png" alt-text="Screenshots that show where to locate the query templates tab.":::

## Query options

The following information can be queried in Cloud Security Explorer:

- **Recommendations** - All recommendations found by Defender for Cloud.

- **Vulnerabilities** - All vulnerabilities found by Defender for Cloud.

- **Insights** - Context about your cloud resources that important for security teams.

    - **Exposed to internet**:
        - Indicating if resource was detected as exposed to the internet.
        - Supports port filtering (search for exposure on specific port).
        
    - **Contains sensitive data**
        - Indicating if resource contains sensitive data. Based on Azure Purview scan and applicable only if Azure Purview is enabled.
        - Supported for the following resources: Azure SQL Server, Azure Storage Account, AWS S3 bucket.
        
    - **Has tags**:
        - Allows you to filter Azure and AWS resources based on resource tags. This supports all Azure and AWS resources.
        
    - **Installed software**:
        - Allows you to filter Azure VMs based on software that is installed on the machine. This is applicable only for VMs that have [Threat and vulnerability management integration with Defender for Cloud](deploy-vulnerability-assessment-tvm.md) enabled and are connected to Defender for Cloud.
        
- **Connections** - Connections that are identified between cloud resources in your environment.

    - **Can authenticate as**:
        - Indicates that an Azure resource can authenticate to an Identity and use its privileges.
        - Supported resources: Azure VM, Azure VMSS, Azure Storage Account, Azure App Services, SQL Servers
        - Supported identity types: Managed Identity, Service Principal.

    - **Has permission to**:
        - Indicating that an Identity has permissions to an Azure and AWS resource.
        - Supporting Identities: AAD user or service principal, AAD managed identity, AWS IAM user.
        - Supporting resources: All Azure and AWS resources.

    - **Contains**:
        - Indicating that an Azure subscription/RG or an AWS account contains an Azure and AWS resource.
        - Supported: All resources.

## Next steps


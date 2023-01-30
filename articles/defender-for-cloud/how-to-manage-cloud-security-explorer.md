---
title: Build queries with cloud security explorer
titleSuffix: Defender for Cloud
description: Learn how to build queries in cloud security explorer to find vulnerabilities that exist on your multicloud environment.
ms.topic: how-to
ms.custom: ignite-2022
ms.date: 01/29/2023
---

# Cloud security explorer

Defender for Cloud's contextual security capabilities assists security teams in the reduction of the risk of impactful breaches. Defender for Cloud uses environmental context to perform a risk assessment of your security issues, and identifies the biggest security risks and distinguishes them from less risky issues.

By using the cloud security explorer, you can proactively identify security risks in your cloud environment by running graph-based queries on the cloud security graph, which is Defender for Cloud's context engine. You can prioritize your security team's concerns, while taking your organization's specific context and conventions into account.  

With the cloud security explorer, you can query all of your security issues and environment context such as assets inventory, exposure to internet, permissions, lateral movement between resources and more, including the ability to query multiple issues across multiple clouds (Azure and AWS EC2).

Learn more about [the cloud security graph, attack path analysis, and the cloud security explorer?](concept-attack-path.md).

## Availability

| Aspect | Details |
|--|--|
| Release state | General Availability (GA) |

## Prerequisites

- [Enable agentless scanning](enable-vulnerability-assessment-agentless.md) 
- [Enable Defender for CSPM](enable-enhanced-security.md) 
- [Enable Defender for Containers](defender-for-containers-enable.md), and install the relevant agents in order to view attack paths that are related to containers. This will also give you the ability to [query](how-to-manage-cloud-security-explorer.md#build-a-query-with-the-cloud-security-explorer) containers data plane workloads in security explorer. 
- Required plan: Defender Cloud Security Posture Management (CSPM) plan enabled 
- Required roles and permissions: 
    - Security Reader
    - Security Admin
    - Reader
    - Contributor
    - Owner

- Clouds: 
    -  :::image type="icon" source="./media/icons/yes-icon.png"::: Commercial clouds (Azure, AWS) 
    - :::image type="icon" source="./media/icons/no-icon.png"::: Commercial clouds (GCP) 
    - :::image type="icon" source="./media/icons/no-icon.png"::: National (Azure Government, Azure China 21Vianet) |

## Build a query with the cloud security explorer

You can use the cloud security explorer to build queries that can proactively hunt for security risks in your environments. The cloud security explorer uses dynamic and efficient search features including:

- **Multi-clouds and multi-resource queries** - The entities selection control allows you to filter your search across cloud environments and across resources simultaneously  
- **Entities Selection** - Filters are logically combined into control categories
- **Search box**- You can use a free text search to conduct a search of any filter existing in the entities selection control.

**To build a query**:

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Navigate to **Microsoft Defender for Cloud** > **Cloud Security Explorer**.

    :::image type="content" source="media/concept-cloud-map/cloud-security-explorer-main-page.png" alt-text="Screenshot of the cloud security explorer page." lightbox="media/concept-cloud-map/cloud-security-explorer-main-page.png":::

1. Do one of the following:
    - Select a resource from the drop-down menu. 
    - Use the main dropdown to search for filters. 
 
        :::image type="content" source="media/how-to-manage-cloud-security/cloud-security-explorer-select-resource.png" alt-text="Screenshot of the resource drop-down menu." lightbox="media/how-to-manage-cloud-security/cloud-security-explorer-select-resource.png":::

1. Select **+** to add other filters to your query. For each filter selected you can add more subfilters as needed.

1. After you finish building your query, select **Search** to run the query.The results will populate on the bottom of the page.

    :::image type="content" source="media/how-to-manage-cloud-security/cloud-security-explorer-query-search.png" alt-text="Screenshot that shows a full query and where to select on the screen to perform the search." lightbox="media/how-to-manage-cloud-security/cloud-security-explorer-query-search.png":::


## Query templates

Query templates are pre-formatted searches using commonly-used filters. You can use one of the existing query templates from the bottom of the page by selecting **Open query**.

:::image type="content" source="media/how-to-manage-cloud-security/cloud-security-explorer-query-templates.png" alt-text="Screenshot that shows you where the query templates are located." lightbox="media/how-to-manage-cloud-security/cloud-security-explorer-query-templates.png":::

You can alter any template to search for specific results by changing the query and selecting **Search**.

## Query options

The following information can be queried in the cloud security explorer:

- **Recommendations** - All Defender for Cloud security recommendations.

- **Vulnerabilities** - All vulnerabilities found by Defender for Cloud.

- **Insights** - Contextual data about your cloud resources.  
        
- **Connections** - Connections that are identified between cloud resources in your environment.

You can review the [full list of recommendations, insights and connections](attack-path-reference.md). 

## Share a query

Use the query link to share a query with other people. After creating a query, select **Share query link**. The link is copied to your clipboard.

:::image type="content" source="media/how-to-manage-cloud-security/cloud-security-explorer-share-query.png" alt-text="Screenshot showing the Share Query Link icon." lightbox="media/how-to-manage-cloud-security/cloud-security-explorer-share-query.png":::

## Next steps

View the [reference list of attack paths and cloud security graph components](attack-path-reference.md).

Learn about the [Defender CSPM plan options](concept-cloud-security-posture-management.md#defender-cspm-plan-options).

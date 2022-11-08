---
title: Build queries with cloud security explorer
titleSuffix: Defender for Cloud
description: Learn how to build queries in cloud security explorer to find vulnerabilities that exist on your multicloud environment.
ms.topic: how-to
ms.custom: ignite-2022
ms.date: 10/03/2022
---

# Cloud security explorer

Defender for Cloud's contextual security capabilities assists security teams in the reduction of the risk of impactful breaches. Defender for Cloud uses environmental context to perform a risk assessment of your security issues, and identifies the biggest security risks and distinguishes them from less risky issues.

By using the cloud security explorer, you can proactively identify security risks in your cloud environment by running graph-based queries on the cloud security graph, which is Defender for Cloud's context engine. You can prioritize your security team's concerns, while taking your organization's specific context and conventions into account.  

With the cloud security explorer, you can query all of your security issues and environment context such as assets inventory, exposure to internet, permissions, lateral movement between resources and more. 

## Availability

| Aspect | Details |
|--|--|
| Release state | Preview |
| Required plans | - Defender Cloud Security Posture Management (CSPM) enabled |
| Required roles and permissions: | - **Security Reader** <br> - **Security Admin** <br> - **Reader** <br> - **Contributor** <br> - **Owner** |
| Clouds: | :::image type="icon" source="./media/icons/yes-icon.png"::: Commercial clouds (Azure, AWS) <br>:::image type="icon" source="./media/icons/no-icon.png"::: Commercial clouds (GCP) <br>:::image type="icon" source="./media/icons/no-icon.png"::: National (Azure Government, Azure China 21Vianet) |

## Build a query with the cloud security explorer

You can use the cloud security explorer to build queries that can proactively hunt for security risks in your environments. 

**To build a query**:

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Navigate to **Microsoft Defender for Cloud** > **Cloud Security Explorer**.

    :::image type="content" source="media/concept-cloud-map/cloud-security-explorer.png" alt-text="Screenshot of the cloud security explorer page." lightbox="media/concept-cloud-map/cloud-security-explorer.png":::

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

The following information can be queried in the cloud security explorer:

- **Recommendations** - All Defender for Cloud security recommendations.

- **Vulnerabilities** - All vulnerabilities found by Defender for Cloud.

- **Insights** - Contextual data about your cloud resources.  
        
- **Connections** - Connections that are identified between cloud resources in your environment.

You can review the [full list of recommendations, insights and connections](attack-path-reference.md). 

## Next steps

[Create custom security initiatives and policies](custom-security-policies.md)

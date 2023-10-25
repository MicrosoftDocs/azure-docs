---
title: Build queries with cloud security explorer

description: Learn how to build queries in cloud security explorer to find vulnerabilities that exist on your multicloud environment.
ms.topic: how-to
ms.custom: ignite-2022
ms.date: 08/16/2023
---

# Build queries with cloud security explorer

Defender for Cloud's contextual security capabilities assists security teams in reducing the risk of impactful breaches. Defender for Cloud uses environmental context to perform a risk assessment of your security issues, identifies the biggest security risks, and distinguishes them from less risky issues.

Use the cloud security explorer, to proactively identify security risks in your cloud environment by running graph-based queries on the cloud security graph, which is Defender for Cloud's context engine. You can prioritize your security team's concerns, while taking your organization's specific context and conventions into account.  

With the cloud security explorer, you can query all of your security issues and environment context such as assets inventory, exposure to internet, permissions, and lateral movement between resources and across multiple clouds (Azure AWS, and GCP).

Learn more about [the cloud security graph, attack path analysis, and the cloud security explorer](concept-attack-path.md).

## Availability

| Aspect | Details |
|--|--|
| Release state | GA (General Availability) |
| Required plans | - Defender Cloud Security Posture Management (CSPM) enabled<br>- Defender for Servers P2 customers can use the explorer UI to query for keys and secrets, but must have Defender CSPM enabled to get the full value of the Explorer. |
| Required roles and permissions: | - **Security Reader** <br> - **Security Admin** <br> - **Reader** <br> - **Contributor** <br> - **Owner** |
| Clouds: | :::image type="icon" source="./media/icons/yes-icon.png"::: Commercial clouds (Azure, AWS) <br>:::image type="icon" source="./media/icons/yes-icon.png"::: Commercial clouds - GCP (Preview) <br>:::image type="icon" source="./media/icons/no-icon.png"::: National (Azure Government, Microsoft Azure operated by 21Vianet) |

## Prerequisites

- You must [enable Defender CSPM](enable-enhanced-security.md).
  - For agentless container posture, you must enable the following extensions:
    - Agentless discovery for Kubernetes (preview)
    - Container registries vulnerability assessments (preview)

- You must [enable agentless scanning](enable-vulnerability-assessment-agentless.md).

- Required roles and permissions:
  - Security Reader
  - Security Admin
  - Reader
  - Contributor
  - Owner

Check the [cloud availability tables](supported-machines-endpoint-solutions-clouds-servers.md) to see which government and cloud environments are supported.

## Build a query with the cloud security explorer

The cloud security explorer allows you to build queries that can proactively hunt for security risks in your environments with dynamic and efficient features such as:

- **Multi-cloud and multi-resource queries** - The entity selection control filters are grouped and combined into logical control categories to assist you in building queries across cloud environments and across resources simultaneously.

- **Custom Search** - Use the dropdown menus to apply filters to build your query.

- **Query templates** -  Use any of the available prebuilt query templates to more efficiently build your query.

- **Share query link** - Copy and share a link of your query with other people.

**To build a query**:

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Navigate to **Microsoft Defender for Cloud** > **Cloud Security Explorer**.

    :::image type="content" source="media/concept-cloud-map/cloud-security-explorer-main-page.png" alt-text="Screenshot of the cloud security explorer page." lightbox="media/concept-cloud-map/cloud-security-explorer-main-page.png":::

1. Search for and select a resource from the drop-down menu. 

      :::image type="content" source="media/how-to-manage-cloud-security/cloud-security-explorer-select-resource.png" alt-text="Screenshot of the resource drop-down menu." lightbox="media/how-to-manage-cloud-security/cloud-security-explorer-select-resource.png":::

1. Select **+** to add other filters to your query.
    
    :::image type="content" source="media/how-to-manage-cloud-security/cloud-security-explorer-query-search.png" alt-text="Screenshot that shows a full query and where to select on the screen to perform the search." lightbox="media/how-to-manage-cloud-security/cloud-security-explorer-query-search.png":::

1. Add subfilters as needed.

1. After building your query, select **Search** to run the query.

    :::image type="content" source="media/how-to-manage-cloud-security/cloud-security-explorer-query-search-populated.png" alt-text="Screenshot that shows where to select search to run the query and results populated." lightbox="media/how-to-manage-cloud-security/cloud-security-explorer-query-search-populated.png":::

If you want to save a copy of your results locally, you can select the **Download CSV report** button to save a copy of your search results as a CSV file.

:::image type="content" source="media/how-to-manage-cloud-security/download-csv-report.png" alt-text="Screenshot that shows where the download CSV report button is located on the screen.":::

## Query templates

Query templates are preformatted searches using commonly used filters. Use one of the existing query templates from the bottom of the page by selecting **Open query**.

:::image type="content" source="media/how-to-manage-cloud-security/cloud-security-explorer-query-templates.png" alt-text="Screenshot that shows you the location of the query templates." lightbox="media/how-to-manage-cloud-security/cloud-security-explorer-query-templates.png":::

You can modify any template to search for specific results by changing the query and selecting **Search**.

## Share a query

Use the query link to share a query with other people. After creating a query, select **Share query link**. The link is copied to your clipboard.

:::image type="content" source="media/how-to-manage-cloud-security/cloud-security-explorer-share-query.png" alt-text="Screenshot showing the Share Query Link icon." lightbox="media/how-to-manage-cloud-security/cloud-security-explorer-share-query.png":::

## Next steps

View the [reference list of attack paths and cloud security graph components](attack-path-reference.md).

Learn about the [Defender CSPM plan options](concept-cloud-security-posture-management.md#defender-cspm-plan-options).

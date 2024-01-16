---
title: Create custom security standards and recommendations for AWS/GCP resources in Microsoft Defender for Cloud
description: Learn how to create custom security standards and recommendations for AWS/GCP resources in Microsoft Defender for Cloud
ms.topic: how-to
author: AlizaBernstein
ms.date: 03/26/2023
---

# Create custom security standards and recommendations (AWS/GCP)

[Security recommendations](security-policy-concept.md) in Microsoft Defender for Cloud help you to improve and harden your security posture. Recommendations are based on assessments against [security standards](security-policy-concept.md) defined for Azure subscriptions, AWS accounts, and GCP projects that have Defender for Cloud enabled.




This article describes how to:

- Create custom recommendations for AWS accounts and GCP projects with a KQL query.
- Assign custom recommendations to a custom security standard.


## Before you start

- Defender for Cloud currently supports creating custom recommendations for AWS accounts and GCP projects only.
- You need Owner permissions on the subscription to create a new security standard.
- You need Security Admin permissions to create custom recommendations
- To create custom recommendations, you must have the [Defender CSPM plan](concept-cloud-security-posture-management.md) enabled.
- [Review support in Azure clouds](support-matrix-cloud-environment.md) for custom recommendations.


We recommend watching this episode of [Defender for Cloud in the field](https://techcommunity.microsoft.com/t5/microsoft-defender-for-cloud/creating-custom-recommendations-amp-standards-for-aws-gcp/ba-p/3810248) to learn more about the feature, and dig into creating KQL queries.



Watch this episode of [Defender for Cloud in the field](https://techcommunity.microsoft.com/t5/microsoft-defender-for-cloud/creating-custom-recommendations-amp-standards-for-aws-gcp/ba-p/3810248) to learn more about the feature, and dig into creating KQL queries.


## Create a custom recommendation 

Create custom recommendations, including steps for remediation, severity, and the standards to which the recommendation should be assigned. You add recommendation logic with KQL. You can use a simple query editor with built-in query templated that you can tweak as needed, or you can write your KQL query from scratch.

1. In the Defender for Cloud portal > **Environment settings**, select the relevant AWS account or GCP project.

1. Select **Security policies** > **+ Create** > **Custom recommendation**.

1. In **Recommendation details**, fill in the recommendation details (for example: name, severity) and select the standards you want to apply the recommendation to.

    :::image type="content" source="./media/create-custom-recommendations/fill-info-recommendation.png" alt-text="Screenshot showing where to fill in description details of recommendation." lightbox="./media/create-custom-recommendations/fill-info-recommendation.png":::

1. Select **Next**.
1. In **Recommendation query**, write a KQL query, or select **Open query editor** to structure your query. If you want to use the query editor, follow the instructions below.
1. After the query is ready, select **Next**.
1. In **Standards**, select the custom standards to which you want to add the custom recommendation.
1. and in **Review and create**, review the recommendations details. 
    
    :::image type="content" source="./media/create-custom-recommendations/review-recommendation.png" alt-text="Screenshot showing where to review the recommendation details." lightbox="./media/create-custom-recommendations/review-recommendation.png":::

### Use the query editor

We recommend using the query editor to create a recommendation query.

- Using the editor helps you to build and test your query before you start using it.
- Select **How to** to get help on structuring the query, and additional instructions and links.
- The editor contains examples of built-in recommendations queries, that you can use to help build your own query. The data appears in the same structure as in the API. 

1. in the query editor, select **New query** to create a query
1. Use the example query template with its instructions, or select an example built-in recommendation query to get started.


    :::image type="content" source="./media/create-custom-recommendations/query-editor.png" alt-text="Screenshot showing how to use the query editor." lightbox="./media/create-custom-recommendations/query-editor.png":::

1. Select **Run query** to test the query you've created.
1. When the query is ready, cut and paste it from the editor into the **Recommendations query** pane.

## Create a custom standard

Custom recommendations can be assigned to one or more custom standards. 

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. Navigate to **Microsoft Defender for Cloud** > **Environment settings**.

1. Select the relevant AWS account.

1. Select **Security policies** > **+ Create** > **Standard**.

1. In **Create new standard**, enter a name, description and select recommendations from the drop-down menu.

    :::image type="content" source="media/create-custom-recommendations/create-standard-aws.png" alt-text="Screenshot of the window for creating a new standard.":::

1. Select **Create**.

## Next steps

You can use the following links to learn more about Kusto queries:

- [KQL Quick Reference](/azure/data-explorer/kql-quick-reference) 
- [Kusto Query Language (KQL) overview](/azure/data-explorer/kusto/query/)
- [Must Learn KQL Part 1: Tools and Resources](https://rodtrent.substack.com/p/must-learn-kql-part-1-tools-and-resources) 
- [What are security policies, initiatives, and recommendations?](security-policy-concept.md)



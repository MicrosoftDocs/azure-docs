---
title: Create Custom Recommendations
description: This article explains how to create custom recommendations in Microsoft Defender for Cloud to secure your environment based on your organization's internal needs and requirements.
ms.topic: how-to
author: AlizaBernstein
ms.date: 03/26/2023
---

# Create custom recommendations and security standards

Recommendations give you suggestions on how to better secure your resources. 

Security standards contain comprehensive sets of security recommendations to help secure your cloud environments. 

Security teams can use the readily available recommendations and regulatory standards and also can create their own custom recommendations and standards to meet specific internal requirements in their organization.   

Microsoft Defender for Cloud provides the option of creating custom recommendations and standards for AWS and GCP using KQL queries. You can use a query editor to build and test queries over your data.  

There are three elements involved when creating and managing custom recommendations: 

- **Recommendation** – contains: 
    - Recommendation details (name, description, severity, remediation logic, etc.) 
    - Recommendation logic in KQL. 
    - The standard it belongs to. 
- **Standard** – defines a set of recommendations. 
- **Standard assignment** – defines the scope that the standard evaluates (for example, specific AWS accounts). 

## Prerequisites

|Aspect|Details|
|----|:----|
|Required/preferred environmental requirements| This preview includes only AWS and GCP recommendations. <br> This feature will be part of the Defender CSPM plan in the future. |
| Required roles & permissions | Security Admin |
|Clouds:| :::image type="icon" source="./media/icons/yes-icon.png"::: National (Azure Government, Microsoft Azure operated by 21Vianet) Commercial clouds<br>:::image type="icon" source="./media/icons/no-icon.png"::: National (Azure Government, Microsoft Azure operated by 21Vianet) |

## Create a custom recommendation 

1. In Microsoft Defender for Cloud, select **Environment Settings**. 

1. Select the relevant account / project. 

1. Select **Standards**.

1. Select **Create** and then select **Recommendation**.

    :::image type="content" source="./media/create-custom-recommendations/select-create-recommendation.png" alt-text="Screenshot showing where to select Create and then Recommendation." lightbox="./media/create-custom-recommendations/select-create-recommendation.png":::

1. Fill in the recommendation details (for example: name, severity) and select the standard/s you'd like to add this recommendation to. 

    :::image type="content" source="./media/create-custom-recommendations/fill-info-recommendation.png" alt-text="Screenshot showing where to fill in description details of recommendation." lightbox="./media/create-custom-recommendations/fill-info-recommendation.png":::

1. Write a KQL query that defines the recommendation logic. You can write the query in the "recommendation query" text box or [use the query editor](#create-new-queries-using-the-query-editor).
    
    :::image type="content" source="./media/create-custom-recommendations/open-query-editor.png" alt-text="Screenshot showing where to open the query editor." lightbox="./media/create-custom-recommendations/open-query-editor.png":::

1. Select Next and review the recommendations details. 
    
    :::image type="content" source="./media/create-custom-recommendations/review-recommendation.png" alt-text="Screenshot showing where to review the recommendation details." lightbox="./media/create-custom-recommendations/review-recommendation.png":::

1. Select Save. 
 
## Create a custom standard

1. In Microsoft Defender for Cloud, select Environment Settings. 

1. Select the relevant account / project. 

1. Select Standards.

1. Select Add and then select Standard.

    :::image type="content" source="./media/create-custom-recommendations/select-add-standard.png" alt-text="Screenshot showing where to select Add and then Standard." lightbox="./media/create-custom-recommendations/select-add-standard.png":::

1. Fill in a name and description and select the recommendation you want to be included in this standard.
    
    :::image type="content" source="./media/create-custom-recommendations/fill-name-description.png" alt-text="Screenshot showing where to fill in your custom recommendation's name and description." lightbox="./media/create-custom-recommendations/fill-name-description.png":::

1. Select Save; the new standard will now be assigned to the account/project you've created it in. You can assign the same standard to other accounts / projects that you have Contributor and up access to. 

## Create new queries using the query editor

In the query editor you have the ability to run your queries over your raw data (native API calls).
To create a new query using the query editor, select the 'open query editor' button. The editor will contain data on all the native APIs we support to help build the queries. The data appears in the same structure as in the API.  You can view the results of your query in the Results pane. The [**How to**](#steps-for-building-a-query) tab gives you step by step instructions for building your query.

:::image type="content" source="./media/create-custom-recommendations/query-editor.png" alt-text="Screenshot showing how to use the query editor." lightbox="./media/create-custom-recommendations/query-editor.png":::

### Steps for building a query

1. The first row of the query should include the environment and resource type. For example: | where Environment == 'AWS' and Identifiers.Type == 'ec2.instance'
1. The query must contain an "iff" statement that defines the healthy or unhealthy conditions. Use this template and edit only the "condition": "| extend HealthStatus = iff(condition, 'UNHEALTHY','HEALTHY')".
1. The last row should return all the original columns: "| project Id, Name, Environment, Identifiers, AdditionalData, Record, HealthStatus".

    >[!Note]
    >The Record field contains the data structure as it is returned from the AWS / GCP API. Use this field to define conditions which will determine if the resource is healthy or unhealthy. <br> You can access internal properties of the Record field using a dot notation. <br>
    For example: | extend EncryptionType = Record.Encryption.Type.

#### Additional instructions

- No need to filter records by Timespan. The assessment service filters the most recent records on each run.
- No need to filter by resource ARN, unless intended. The assessment service will run the query on assigned resources.
- If a specific scope is filtered in the assessment query (for example: specific account ID), it will apply on all resources assigned to this query.
- Currently it is not possible to create one recommendation for multiple environments.

## Next steps

You can use the following links to learn more about Kusto queries:

- [KQL Quick Reference](/azure/data-explorer/kql-quick-reference) 
- [Kusto Query Language (KQL) overview](/azure/data-explorer/kusto/query/)
- [Must Learn KQL Part 1: Tools and Resources](https://rodtrent.substack.com/p/must-learn-kql-part-1-tools-and-resources) 
- [What are security policies, initiatives, and recommendations?](security-policy-concept.md)



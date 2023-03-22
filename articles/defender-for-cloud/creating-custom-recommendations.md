---
title: Create Custom Recommendations in Microsoft Defender for Cloud
description: This article explains how to create custom recommendations in Microsoft Defender for Cloud to secure your environment based on your organization’s internal needs and requirements.
ms.topic: how-to
ms.author: alizabernstein
author: alizabernstein
ms.date: 03/22/2022
---
# Create custom recommendations and security standards in Microsoft Defender for Cloud

Recommendations give you suggestions on how to better secure your resources. 

Security standards contain comprehensive sets of security recommendations to help secure your cloud environments. 

Security teams can use the readily available recommendations and regulatory standards and also can create their own custom recommendations and standards to meet specific internal requirements in their organization.   

Microsoft Defender for Cloud provides the option of creating custom recommendations and standards for AWS and GCP using KQL queries. You can use a query editor to build and test queries over your data.  

There are three types of resources to create and manage custom recommendations: 

1. **Recommendations** – contains: 
    1. Recommendation details (name, description, severity, remediation logic, etc.) 
    1. Recommendation logic in KQL. 
    1. The standard it belongs to. 
1.  **Standard** – defines a set of recommendations. 
1.  **Standard assignment** – defines the scope which the standard evaluates (for example, specific AWS accounts). 

## Prerequisites

|Aspect|Details|
|----|:----|
|Required/Preferred Environmental Requirements| This private preview includes only AWS and GCP recommendations. <br> Please note that this feature is going to be part of the CSPM premium bundle in the future. |
| Required Roles & Permissions | Subscription Owner / Contributor |
|Clouds:| :::image type="icon" source="./media/icons/yes-icon.png"::: National (Azure Government, Azure China 21Vianet) Commercial clouds<br>:::image type="icon" source="./media/icons/no-icon.png"::: National (Azure Government, Azure China 21Vianet) |

## Create a custom recommendation 

1. In Microsoft Defender for Cloud, select Environment Settings. 

1. Select the relevant account / project. 

1. Select Standards.

1. Select Create and then select Recommendation.

    :::image type="content" source="./media/create-custom-recommendations/select-create-recommendation.png" alt-text="Screenshot showing where to select Create and then Recommendation." lightbox="./media/create-custom-recommendations/select-create-recommendation.png":::

1. Fill in the recommendation details (e.g., name, severity) and select the standard/s you’d like to add this recommendation to. 

    :::image type="content" source="./media/create-custom-recommendations/fill-info-recommendation.png" alt-text="Screenshot showing where to fill in description details of recommendation." lightbox="./media/create-custom-recommendations/fill-info-recommendation.png":::

1. Write a KQL query that will define the recommendation logic. You can write the query in the “recommendation query” text box or use the query editor and then copy and paste the query from the editor. 
    
    :::image type="content" source="./media/create-custom-recommendations/open-query-editor.png" alt-text="Screenshot showing where to open the query editor." lightbox="./media/create-custom-recommendations/open-query-editor.png":::

   > [!TIP]
   > If you’d like to create a new query, click the ‘open   query editor’ button. The editor will contain data on all the native APIs we support, to assist in constructing the queries. The data will appear in the same structure as contracted in the API.  

1. Click Next and review the recommendations details. 
    
    :::image type="content" source="./media/create-custom-recommendations/review-recommendation.png" alt-text="Screenshot showing where to review the recommendation details." lightbox="./media/create-custom-recommendations/review-recommendation.png":::

1. Select Save. 
 
## Create a custom standard

1. In Microsoft Defender for Cloud, select Environment Settings. 

1. Select the relevant account / project. 

1. Select Standards 

1. Select Add and then select Standard.

    :::image type="content" source="./media/create-custom-recommendations/select-add-standard.png" alt-text="Screenshot showing where to select Add and then Standard." lightbox="./media/create-custom-recommendations/select-add-standard.png":::

1. Fill in a name and description and select the recommendation you want to be included in this standard.
    :::image type="content" source="./media/create-custom-recommendations/fill-name-description.png" alt-text="Screenshot showing where to fill in your custom recommendation's name and description." lightbox="./media/create-custom-recommendations/fill-name-description.png":::

1. Select Save; the new standard will now be assigned to the account/project you’ve created it in. You can assign the same standard to other accounts / projects that you have Contributor and up access to. 


## Next steps

Read these docs to learn and understand more on Kusto queries:   

- [KQL Quick Reference](https://docs.microsoft.com/azure/data-explorer/kql-quick-reference) 
- [Kusto Query Language (KQL) overview](https://docs.microsoft.com/azure/data-explorer/kusto/query/)
- [Must Learn KQL Part 1: Tools and Resources](https://azurecloudai.blog/2021/11/17/must-learn-kql-part-1-tools-and-resources/) 
- [What are security policies, initiatives, and recommendations?](security-policy-concept.md)

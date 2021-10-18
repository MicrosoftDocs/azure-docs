---
title:  Industry AI Solutions 
description: Industry AI solutions in Azure Synapse Analytics

services: synapse-analytics 
ms.service: synapse-analytics 
ms.subservice: machine-learning
ms.topic: overview 
ms.reviewer: garye

ms.date: 11/02/2021
author: nelgson
ms.author: negust
---

# Industry AI Solutions

Every industry has common industry specific problems to solve. This article will cover the industry solutions available in Azure Synapse Workspaces for quickly getting started solving common industry problems. At this time, the AI solution offered is a Retail solution for product recommendation. You can find more details below on how to use this solution as a retailer, in order to get started.

## Target User

The recommendation solution targets existing data scientists and emerging data scientists who are comfortable with code and are familiar with machine learning concepts. This solution is meant to accelerate the productivity of these users for solving a specific problem in the Retail domain.

## Retail Product Recommendation

The Retail Recommendation Solution provides a robust and scalable recommendation engine for out-of-the-box development in Synapse. When using this solution, you will get a Notebook training a machine learning model for product recommendation.

You may need to customize the pre-configured Notebook to ensure it meets your unique business requirements.

This Retail Recommendation Solution can be deployed in two different modes. You can try it out with sample data, or use a database modeled according to the Retail Database Template in Synapse.

The Retail Recommendation Solution provides recommendation pipeline for content-based filtering recommendations. The content-based filtering pipeline uses the LightGBM algorithm to train a model for predicting the user preferences based on user and item features. The features can be static features like user profile and item profile, as well as dynamic features like the aggregated user behavior patterns. The content-based filtering typed recommendation system is often used for recommendations such as "personalized recommendation" or "new products you may like".

### Get started with Retail Product Recommendation in Synapse

1. Open your Synapse workspace
1. From your Home screen, select **Knowledge center** in the **Discover more** section
1. In the Knowledge center, select **Browse gallery**
1. In the Gallery, select the **Lake Database Templates** tab, scroll down to the **AI solutions** section, and select the "Retail - Product recommendations" solution. Click **Continue**.

   :::image type="content" source="media\quickstart-industry-ai-solutions\retail-product-reco1.png" alt-text="Retail AI solution for product recommendation" border="false":::

You can choose to open a version of the solution notebook based on sample data or your own database modeled with the Retail Lake Database template.

**Note: If you choose your own database, you need to customize the Notebook to use your own table names.**

## Next steps

* [Get started with Azure Synapse Analytics](../get-started.md)
* [Create a workspace](../get-started-create-workspace.md)

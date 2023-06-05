---
title: Industry AI solutions
description: Industry AI solutions in Azure Synapse Analytics
ms.service: synapse-analytics
ms.subservice: machine-learning
ms.topic: overview
ms.reviewer: garye
ms.date: 11/02/2021
author: nelgson
ms.author: negust
ms.custom: ignite-fall-2021
---

# Industry AI solutions

Every industry has common industry specific problems to solve. This article will cover the industry solutions available in Azure Synapse Workspaces for quickly getting started solving common industry problems. At this time, the AI solution offered is a Retail solution for product recommendation. You can find more details below on how to use this solution as a retailer, in order to get started.

## Target user

The recommendation solution targets existing data scientists and emerging data scientists who are comfortable with code and are familiar with machine learning concepts. This solution is meant to accelerate the productivity of these users for solving a specific problem in the Retail domain.

## Retail product recommendation solution

The **Retail - Product recommendations** solution provides a robust and scalable recommendation engine for out-of-the-box development in Synapse. When using this solution, you will get a Notebook training a machine learning model for product recommendation.

You may need to customize the pre-configured Notebook to ensure it meets your unique business requirements.

This Retail recommendation solution can be deployed in two different modes. You can try it out with sample data, or use a database modeled using the Database Template for Retail in Synapse.

The **Retail - Product recommendations** solution provides a recommendation pipeline for content-based filtering recommendations. The content-based filtering pipeline uses the LightGBM algorithm to train a model for predicting the user preferences based on user and item features. The features can be static features like user profile and item profile, as well as dynamic features like the aggregated user behavior patterns. The content-based filtering typed recommendation system is often used for recommendations such as "personalized recommendation" or "new products you may like".

## Get started

1. Open your Synapse workspace
1. From your Home screen, select **Knowledge center** in the **Discover more** section
1. In the Knowledge center, select **Browse gallery**
1. In the Gallery, select the **Database Templates** tab, scroll down to the **AI solutions** section, and select the "Retail - Product recommendations" solution. Click **Continue**.
1. You can choose between two options:
   * "Use sample data" 
   * "Use my own data from a workspace database". This option can for example be a database modeled with the Retail Database template.
   
    Clicking **Deploy** will open a Notebook in your Synapse workspace.

1. A Notebook will now be opened in your workspace. You can attach this Notebook to a Spark pool and start exploring it. Please be aware that this Notebook is meant to be customized to your specific needs.

> [!NOTE]
> If you choose your own database, you need to customize the Notebook to use your own table and column names.

## Next steps

* [Get started with Azure Synapse Analytics](../get-started.md)
* [Create a workspace](../get-started-create-workspace.md)

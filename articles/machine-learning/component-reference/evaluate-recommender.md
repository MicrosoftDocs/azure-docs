---
title: "Evaluate Recommender: Component reference"
titleSuffix: Azure Machine Learning
description: Learn how to use the Evaluate Recommender component in Azure Machine Learning to evaluate the accuracy of recommender model predictions.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: reference

author: likebupt
ms.author: keli19
ms.date: 10/10/2019
---
# Evaluate Recommender

This article describes how to use the Evaluate Recommender component in Azure Machine Learning designer. The goal is to measure the accuracy of predictions that a recommendation model has made. By using this component, you can evaluate different kinds of recommendations:  
  
-   Ratings predicted for a user and an item    
-   Items recommended for a user  
  
When you create predictions by using a recommendation model, slightly different results are returned for each of these supported prediction types. The Evaluate Recommender component deduces the kind of prediction from the column format of the scored dataset. For example, the scored dataset might contain:

- User-item-rating triples
- Users and their recommended items

The component also applies the appropriate performance metrics, based on the type of prediction being made. 

  
## How to configure Evaluate Recommender

The Evaluate Recommender component compares the prediction output by using a recommendation model with the corresponding "ground truth" data. For example, the [Score SVD Recommender](score-svd-recommender.md) component produces scored datasets that you can analyze by using Evaluate Recommender.

### Requirements

Evaluate Recommender requires the following datasets as input. 
  
#### Test dataset

The test dataset contains the "ground truth" data in the form of user-item-rating triples.  

#### Scored dataset

The scored dataset contains the predictions that the recommendation model generated.  
  
The columns in this second dataset depend on the kind of prediction that you performed during the scoring process. For example, the scored dataset might contain either of the following:

- Users, items, and the ratings that the user would likely give for the item
- A list of users and items recommended for them 

### Metrics

Performance metrics for the model are generated based on the type of input. The following sections give details.

## Evaluate predicted ratings  

When you're evaluating predicted ratings, the scored dataset (the second input to Evaluate Recommender) must contain user-item-rating triples that meet these requirements:
  
-   The first column of the dataset contains the user identifiers.    
-   The second column contains the item identifiers.  
-   The third column contains the corresponding user-item ratings.  
  
> [!IMPORTANT] 
> For evaluation to succeed, the column names must be `User`, `Item`, and `Rating`, respectively.  
  
Evaluate Recommender compares the ratings in the "ground truth" dataset to the predicted ratings of the scored dataset. It then computes the mean absolute error (MAE) and the root mean squared error (RMSE).



## Evaluate item recommendations

When you're evaluating item recommendations, use a scored dataset that includes the recommended items for each user:
  
-   The first column of the dataset must contain the user identifier.    
-   All subsequent columns should contain the corresponding recommended item identifiers, ordered by how relevant an item is to the user. 

Before you connect this dataset, we recommend that you sort the dataset so that the most relevant items come first.  

> [!IMPORTANT] 
> For Evaluate Recommender to work, the column names must be `User`, `Item 1`, `Item 2`, `Item 3` and so forth.  
  
Evaluate Recommender computes the average normalized discounted cumulative gain (NDCG) and returns it in the output dataset.  
  
Because it's impossible to know the actual "ground truth" for the recommended items, Evaluate Recommender uses the user-item ratings in the test dataset as gains in the computation of the NDCG. To evaluate, the recommender scoring component must only produce recommendations for items with "ground truth" ratings (in the test dataset).  
  

## Next steps

See the [set of components available](component-reference.md) to Azure Machine Learning. 

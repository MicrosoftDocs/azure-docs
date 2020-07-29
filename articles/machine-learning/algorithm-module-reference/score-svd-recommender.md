---
title: "Score SVD Recommender: Module reference"
titleSuffix: Azure Machine Learning
description: Learn how to use the Score SVD Recommender module in Azure Machine Learning to score recommendation predictions for a dataset.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: reference

author: likebupt
ms.author: keli19
ms.date: 02/10/2020
---
# Score SVD Recommender

This article describes how to use the Score SVD Recommender module in Azure Machine Learning designer (preview). Use this module to create predictions by using a trained recommendation model based on the Single Value Decomposition (SVD) algorithm.

The SVD recommender can generate two different kinds of predictions:

- [Predict ratings for a given user and item](#prediction-of-ratings)
- [Recommend items to a user](#recommendations-for-users)

When you're creating the second type of predictions, you can operate in one of these modes:

- **Production mode** considers all users or items. It's typically used in a web service.

  You can create scores for new users, not just users seen during training. For more information, see the [technical notes](#technical-notes). 

- **Evaluation mode** operates on a reduced set of users or items that can be evaluated. It's typically used during pipeline operations.

For more information on the SVD recommender algorithm, see the research paper [Matrix factorization techniques for recommender systems](https://datajobs.com/data-science-repo/Recommender-Systems-[Netflix].pdf).

## How to configure Score SVD Recommender

This module supports two types of predictions, each with different requirements. 

###  Prediction of ratings

When you predict ratings, the model calculates how a user will react to a particular item, given the training data. The input data for scoring must provide both a user and the item to rate.

1. Add a trained recommendation model to your pipeline, and connect it to **Trained SVD recommender**. You must create the model by using the [Train SVD Recommender](train-SVD-recommender.md) module.

2. For **Recommender prediction kind**, select **Rating Prediction**. No other parameters are required.

3. Add the data for which you want to make predictions, and connect it to **Dataset to score**.

   For the model to predict ratings, the input dataset must contain user-item pairs.

   The dataset can contain an optional third column of ratings for the user-item pair in the first and second columns. But the third column will be ignored during prediction.

4. Submit the pipeline.

### Results for rating predictions 

The output dataset contains three columns: users, items, and the predicted rating for each input user and item.

###  Recommendations for users 

To recommend items for users, you provide a list of users and items as input. From this data, the model uses its knowledge about existing items and users to generate a list of items with probable appeal to each user. You can customize the number of recommendations returned. And you can set a threshold for the number of previous recommendations that are required to generate a recommendation.

1. Add a trained recommendation model to your pipeline, and connect it to **Trained SVD recommender**.  You must create the model by using the [Train SVD Recommender](train-svd-recommender.md) module.

2. To recommend items for a list of users, set **Recommender prediction kind** to **Item Recommendation**.

3. For **Recommended item selection**, indicate whether you're using the scoring module in production or for model evaluation. Choose one of these values:

    - **From All Items**: Select this option if you're setting up a pipeline to use in a web service or in production.  This option enables *production mode*. The module makes recommendations from all items seen during training.

    - **From Rated Items (for model evaluation)**: Select this option if you're developing or testing a model. This option enables *evaluation mode*. The module makes recommendations only from those items in the input dataset that have been rated.
    
    - **From Unrated Items (to suggest new items to users)**: Select this option if you want the module to make recommendations only from those items in the training dataset that have not been rated. 

4. Add the dataset for which you want to make predictions, and connect it to **Dataset to score**.

    - For **From All Items**, the input dataset should consist of one column. It contains the identifiers of users for which to make recommendations.

      The dataset can include an extra two columns of item identifiers and ratings, but these two columns are ignored. 

    - For **From Rated Items (for model evaluation)**, the input dataset should consist of user-item pairs. The first column should contain the user identifier. The second column should contain the corresponding item identifiers.

      The dataset can include a third column of user-item ratings, but this column is ignored.

    - For **From Unrated Items (to suggest new items to users)**, the input dataset should consist of user-item pairs. The first column should contain the user identifier. The second column should contain the corresponding item identifiers.

     The dataset can include a third column of user-item ratings, but this column is ignored.

5. **Maximum number of items to recommend to a user**: Enter the number of items to return for each user. By default, the module recommends five items.

6. **Minimum size of the recommendation pool per user**: Enter a value that indicates how many prior recommendations are required. By default, this parameter is set to 2, meaning at least two other users have recommended the item.

   Use this option only if you're scoring in evaluation mode. The option is not available if you select **From All Items** or **From Unrated Items (to suggest new items to users)**.

7.  For **From Unrated Items (to suggest new items to users)**, use the third input port, named **Training Data**, to remove items that have already been rated from the prediction results.

    To apply this filter, connect the original training dataset to the input port.

8. Submit the pipeline.

### Results of item recommendation

The scored dataset returned by Score SVD Recommender lists the recommended items for each user:

- The first column contains the user identifiers.
- A number of additional columns are generated, depending on the value that you set for **Maximum number of items to recommend to a user**. Each column contains a recommended item (by identifier). The recommendations are ordered by user-item affinity. The item with highest affinity is put in column **Item 1**.

> [!WARNING]
> You can't evaluate this scored dataset by using the [Evaluate Recommender](evaluate-recommender.md) module.


##  Technical notes

If you have a pipeline with the SVD recommender, and you move the model to production, be aware that there are key differences between using the recommender in evaluation mode and using it in production mode.

Evaluation, by definition, requires predictions that can be verified against the *ground truth* in a test set. When you evaluate the recommender, it must predict only items that have been rated in the test set. This restricts the possible values that are predicted.

When you operationalize the model, you typically change the prediction mode to make recommendations based on all possible items, in order to get the best predictions. For many of these predictions, there's no corresponding ground truth. So the accuracy of the recommendation can't be verified in the same way as during pipeline operations.


## Next steps

See the [set of modules available](module-reference.md) to Azure Machine Learning. 

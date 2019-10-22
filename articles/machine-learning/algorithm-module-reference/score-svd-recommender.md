---
title: "Score SVD Recommender: Module Reference"
titleSuffix: Azure Machine Learning service
description: Learn how to use the Score SVD Recommender module in Azure Machine Learning service to score recommendation predictions for a dataset.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: reference

author: likebupt
ms.author: keli19
ms.date: 10/10/2019
---
# Score SVD Recommender

This article describes how to use the **Score SVD Recommender** module in Azure Machine Learning designer (preview). Use this module to create predictions using a trained recommendation model based on the SVD (Single Value Decomposition) algorithm.

The SVD recommender can generate two different kinds of predictions:

- [Predict ratings for a given user and item](#predict-ratings)

- [Recommend items to a given user](#recommend)

When creating the second type of predictions, you can operate in either *production mode* or *evaluation mode*.

- **Production mode** considers all users or items, and is typically used in a web service.

    You can create scores for new users, not just users seen during training. For more information, see [this section](#technical-notes). 

- **Evaluation mode** operates on a reduced set of users or items that can be evaluated, and is typically used during pipelineation.

For more information on the SVD recommender algorithm, see the research paper: [Matrix factorization techniques for recommender systems](https://datajobs.com/data-science-repo/Recommender-Systems-[Netflix].pdf).

																																	


## How to configure Score SVD Recommender

This module supports different types of recommendations, each with different requirements. Click the link for the type of data you have and the type of recommendation you want to create.

+ [Predict ratings](#predict-ratings)
+ [Recommend items](#recommend)

###  Predict ratings

When you predict ratings, the model calculates how a given user will react to a particular item, given the training data. Therefore, the input data for scoring must provide both a user and the item to rate.

1. Add a trained recommendation model to your pipeline, and connect it to **Trained SVD recommender**.  You must create the model by using [Train SVD Recommender](train-SVD-recommender.md).

2. **Recommender prediction kind**: Select **Rating Prediction**. No further parameters are required.

3. Add the data for which you wish to make predictions, and connect it to **Dataset to score**.

    To predict ratings, the input dataset must contain user-item pairs.

    The dataset can contain an optional third column of ratings for the user-item pair in the first and second columns, but the third column will be ignored during prediction.

4. Run the pipeline.

### Results for rating predictions 

The output dataset contains three columns, containing the user, the item, and the predicted rating for each input user and item.

###  Recommend 

To recommend items for users, you provide a list of users and items as input. From this data, the model uses its knowledge about existing items and users to generate a list of items with probable appeal to each user. You can customize the number of recommendations returned, and set a threshold for the number of previous recommendations that are required in order to generate a recommendation.

1. Add a trained recommendation model to your pipeline, and connect it to **Trained SVD recommender**.  You must create the model by using [Train SVD Recommender](train-svd-recommender.md).

2. To recommend items for a given list of users, set **Recommender prediction kind** to **Item Recommendation**.

3. **Recommended item selection**: Indicate whether you are using the scoring module in production or for model evaluation, by choosing one of these values:

    - **From All Items**: Select this option if you are setting up a pipeline to use in a Web service or production.  This option enables **production mode**, and the module makes recommendations from all items seen during training.

    - **From Rated Items (for model evaluation)**: Select this option if you are developing or testing a model. This option enables **evaluation mode**, and the module makes recommendations only from those items in the input dataset that have been rated.
    
    - **From Unrated Items (to suggest new items to users)**: Select this option and the module makes recommendations only from those items in the training dataset that have not been rated. 

4. Add the dataset for which you want to make predictions, and connect it to **Dataset to score**.

    - For **From All Items**, the input dataset should consist of one column, containing the identifiers of users for which to make recommendations.

        The dataset can include extra two columns of item identifiers and ratings, but these two columns are ignored. 

    - For **From Rated Items (for model evaluation)**, the input dataset should consist of **user-item pairs**. The first column should contain the **user** identifier. The second column should contain the corresponding **item** identifiers.

        The dataset can include a third column of user-item ratings, but this column is ignored.

    - For **From Unrated Items (to suggest new items to users)**, the input dataset should consist of **user-item pairs**. The first column should contain the **user** identifier. The second column should contain the corresponding **item** identifiers.

        The dataset can include a third column of user-item ratings, but this column is ignored.

5. **Maximum number of items to recommend to a user**: Type the number of items to return for each user. By default, five items are recommended.

6. **Minimum size of the recommendation pool per user**: Type  a value that indicates how many prior recommendations are required.  By default, this parameter is set to 2, meaning the item must have been recommended by at least two other users.

    This option should be used only if you are scoring in evaluation mode. The option is not available if you select **From All Items** or **From Unrated Items (to suggest new items to users)**.

7.  For **From Unrated Items (to suggest new items to users)**, use the third input port, named **Training Data**, to remove items that have already been rated from the prediction results.

    To apply this filter, connect the original training dataset to the input port.

8. Run the pipeline.

### Results of item recommendation

The scored dataset returned by **Score SVD Recommender** lists the recommended items for each user.

- The first column contains the user identifiers.
- A number of additional columns are generated, depending on the value you set for **Maximum number of items to recommend to a user**. Each column contains a recommended item (by identifier). The recommendations are ordered by user-item affinity, with the item with highest affinity put in column, **Item 1**.

> [!WARNING]
> This scored dataset cannot be evaluated using the [Evaluate Recommender](evaluate-recommender.md) module.


##  Technical notes

This section contains answers to some common questions about using the recommender to create predictions.  

###  Production use of the SVD recommender

If you have a pipeline with the SVD recommender, and move the model to production, be aware of these key differences when using the recommender in evaluation mode and in production mode:

- Evaluation, by definition, requires predictions that can be verified against the *ground truth* in a test set. Therefore, when you evaluate the recommender, it must predict only items that have been rated in the test set. This necessarily restricts the possible values that are predicted.

    However, when you operationalize the model, you typically change the prediction mode to make recommendations based on all possible items, in order to get the best predictions. For many of these predictions, there is no corresponding ground truth, so the accuracy of the recommendation cannot be verified in the same way as during pipelineation.


## Next steps

See the [set of modules available](module-reference.md) to Azure Machine Learning service. 

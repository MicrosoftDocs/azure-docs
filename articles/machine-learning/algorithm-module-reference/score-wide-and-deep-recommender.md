---
title: "Score Image Model"
titleSuffix: Azure Machine Learning
description: Learn how to use the Score Wide & Deep Recommender module in Azure Machine Learning to score recommendation predictions for a dataset.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: reference

author: likebupt
ms.author: keli19
ms.date: 06/12/2020
---
# Score Wide and Deep Recommender

This article describes how to use the **Score Wide and Deep Recommender** module in Azure Machine Learning designer (preview), to create predictions based on a trained recommendation model, based on the Wide & Deep learning from Google.

The Wide and Deep recommender can generate two different kinds of predictions:

- [Predict ratings for a given user and item](#predict-ratings)

- [Recommend items to a given user](#recommend-items)


When creating the latter kind of predictions, you can operate in either *production mode* or *evaluation mode*.

- **Production mode** considers all users or items, and is typically used in a web service. You can create scores for new users, not just users seen during training. 

- **Evaluation mode** operates on a reduced set of users or items that can be evaluated, and is typically used during experimentation.

More details on the Wide and Deep recommender and its underlying theory can be found in the relevant research paper:  [Wide & Deep Learning for Recommender Systems](https://arxiv.org/pdf/1606.07792.pdf).  

## How to configure Score Wide and Deep Recommender

This module supports different types of recommendations, each with different requirements. Click the link for the type of data you have and the type of recommendation you want to create.

+ [Predict ratings](#predict-ratings)
+ [Recommend items](#recommend-items)

### Predict ratings

When you predict ratings, the model calculates how a given user will react to a particular item, given the training data. Therefore, the input data for scoring must provide both a user and the item to rate.

1. Add a trained Wide & Deep recommendation model to your experiment, and connect it to **Trained Wide and Deep recommendation model**.  You must create the model by using [Train Wide and Deep Recommender](train-wide-and-deep-recommender.md).

2. **Recommender prediction kind**: Select **Rating Prediction**. No further parameters are required.

3. Add the data for which you wish to make predictions, and connect it to **Dataset to score**.

    To predict ratings, the input dataset must contain user-item pairs.

    The dataset can contain an optional third column of ratings for the user-item pair in the first and second columns, but the third column will be ignored during prediction.

4.  (Optional). If you have a dataset of user features, connect it to **User features**.

    The dataset of user features should contain the user identifier in the first column. The remaining columns should contain values that characterize the users, such as their gender, preferences, location, etc.
  
    Features of users who have rated items in the training dataset are ignored by **Score Wide and Deep Recommender**, because they have already been learned during training. Therefore,  filter your dataset in advance to include only *cold-start users*, or users who have not rated any items.

    > [!WARNING]
    > If the model was trained without using user features, you cannot introduce user features during scoring.

5. If you have a dataset of item features, you can connect it to **Item features**.

    The item features dataset must contain an item identifier in the first column. The remaining columns should contain values that characterize the items.

    Features of rated items in the training dataset are ignored by **Score Wide and Deep Recommender** as they have already been learned during training. Therefore, restrict your scoring dataset to *cold-start items*, or items that have not been rated by any users.

    > [!WARNING]
    > If the model was trained without using item features, you cannot introduce item features during scoring.

7. Run the experiment.

### Results for rating predictions 

The output dataset contains three columns, containing the user, the item, and the predicted rating for each input user and item.

Additionally, the following changes are applied during scoring:

-  For a numeric user or item feature column, missing values are automatically replaced with the **mean** of its non-missing training set values. For categorical feature, missing values are replaced with the same categorical value other than any possible values of this feature.
-  No translation is applied to the feature values, to maintain their sparsity.

### Recommend items

To recommend items for users, you provide a list of users and items as input. From this data, the model uses its knowledge about existing items and users to generate a list of items with probable appeal to each user. You can customize the number of recommendations returned, and set a threshold for the number of previous recommendations that are required in order to generate a recommendation.

1. Add a trained Wide and Deep recommendation model to your experiment, and connect it to **Trained Wide and Deep recommendation model**.  You must create the model by using [Train Wide and Deep Recommender](train-wide-and-deep-recommender.md).

2. To recommend items for a given list of users, set **Recommender prediction kind** to **Item Recommendation**.

3. **Recommended item selection**: Indicate whether you are using the scoring module in production or for model evaluation, by choosing one of these values:

    - **From Rated Items (for model evaluation)**: Select this option if you are developing or testing a model. This option enables **evaluation mode**, and the module makes recommendations only from those items in the input dataset that have been rated.
    - **From All Items**: Select this option if you are setting up an experiment to use in a Web service or production.  This option enables **production mode**, and the module makes recommendations from all items seen during training.
    - **From Unrated Items (to suggest new items to users)**: Select this option if you want the module to make recommendations only from those items in the training dataset that have not been rated. 
4. Add the dataset for which you want to make predictions, and connect it to **Dataset to score**.

    - If you choose the option, **From All Items**, the input dataset should consist of one and only one column, containing the identifiers of users for which to make recommendations.

        The dataset can include an extra two columns of item identifiers and ratings, but these two columns are ignored. 

    - If you choose the option, **From Rated Items (for model evaluation)**, the input dataset should consist of **user-item pairs**. The first column should contain the **user** identifier. The second column should contain the corresponding **item** identifiers.

        The dataset can include a third column of user-item ratings, but this column is ignored.
        
    - For **From Unrated Items (to suggest new items to users)**, the input dataset should consist of user-item pairs. The first column should contain the user identifier. The second column should contain the corresponding item identifiers.

        The dataset can include a third column of user-item ratings, but this column is ignored.

5. (Optional). If you have a dataset of **user features**, connect it to **User features**.

    The first column in the user features dataset should contain the user identifier. The remaining columns should contain values that characterize the user, such as their gender, preferences, location, etc.

    Features of users who have rated items are ignored by **Score Wide and Deep Recommender**, because these features have already been learned during training. Therefore, you can filter your dataset in advance to include only *cold-start users*, or users who have not rated any items.

    > [!WARNING]
    >  If the model was trained without using user features, you cannot use apply features during scoring.

6. (Optional) If you have a dataset of **item features**, you can connect it to **Item features**.

    The first column in the item features dataset must contain the item identifier. The remaining columns should contain values that characterize the items.

    Features of rated items are ignored by **Score Wide and Deep Recommender**, because these features have already been learned during training. Therefore, you can restrict your scoring dataset to *cold-start items*, or items that have not been rated by any users.

    > [!WARNING]
    >  If the model was trained without using item features, do not use item features when scoring.  

7. **Maximum number of items to recommend to a user**: Type the number of items to return for each user. By default, 5 items are recommended.

8. **Minimum size of the recommendation pool per user**: Type  a value that indicates how many prior recommendations are required.  By default, this parameter is set to 2, meaning the item must have been recommended by at least two other users.

    This option should be used only if you are scoring in evaluation mode. The option is not available if you select **From All Items** or **From Unrated Items (to suggest new items to users)**.

9. For **From Unrated Items (to suggest new items to users)**, use the third input port, named **Training Data**, to remove items that have already been rated from the prediction results.

    To apply this filter, connect the original training dataset to the input port.

10. Run the experiment.
### Results of item recommendation

The scored dataset returned by **Score Wide and Deep Recommender** lists the recommended items for each user.

- The first column contains the user identifiers.
- A number of additional columns are generated, depending on the value you set for **Maximum number of items to recommend to a user**. Each column contains a recommended item (by identifier). The recommendations are ordered by user-item affinity, with the item with highest affinity put in column, **Item 1**.

> [!WARNING]
> This scored dataset cannot be evaluated using the [Evaluate Recommender](evaluate-recommender.md) module.

##  Technical notes

This section contains answers to some common questions about using the Wide & Deep recommender to create predictions.  

###  Cold-start users and recommendations

Typically, to create recommendations, the **Score Wide and Deep Recommender** module requires the same inputs that you used when training the model, including a user ID. That is because the algorithm needs to know if it has learned something about this user during training. 

However, for new users, you might not have a user ID, only some user features such as age, gender, and so forth.

You can still create recommendations for users who are new to your system, by handling them as *cold-start users*. For such users, the recommendation algorithm does not use past history or previous ratings, only user features.

For purposes of prediction, a cold-start user is defined as a user with an ID that has not been used for training. To ensure that IDs do not match IDs used in training, you can create new identifiers. For example, you might generate random IDs within a specified range, or allocate a series of IDs in advance for cold-start users.

However, if you do not have any collaborative filtering data, such as a vector of user features, you are better of using a classification or regression learner.

###  Production use of the Wide and Deep recommender

If you have experimented with the Wide and Deep recommender and then move the model to production, be aware of these key differences when using the recommender in evaluation mode and in production mode:

- Evaluation, by definition, requires predictions that can be verified against the *ground truth* in a test set. Therefore, when you evaluate the recommender, it must predict only items that have been rated in the test set. This necessarily restricts the possible values that are predicted.

    However, when you operationalize the model, you typically change the prediction mode to make recommendations based on all possible items, in order to get the best predictions. For many of these predictions, there is no corresponding ground truth, so the accuracy of the recommendation cannot be verified in the same way as during experimentation.

- If you do not provide a user ID in production, and provide only a feature vector, you might get as response a list of all recommendations for all possible users. Be sure to provide a user ID.

    To limit the number of recommendations that are returned, you can also specify the maximum number of items returned per user. 



## Next steps

See the [set of modules available](module-reference.md) of Azure Machine Learning. 

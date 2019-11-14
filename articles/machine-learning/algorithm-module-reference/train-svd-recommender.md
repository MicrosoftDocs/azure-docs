---
title: "Train SVD Recommender: Module Reference"
titleSuffix: Azure Machine Learning service
description: Learn how to use the Train SVD Recommender module in Azure Machine Learning service to train a Bayesian recommender using the SVD algorithm.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: reference

author: likebupt
ms.author: keli19
ms.date: 10/10/2019
---

# Train SVD Recommender

This article describes how to use the **Train SVD Recommender** module in Azure Machine Learning designer (preview). Use this module to train a recommendation model based on the **SVD** (Single Value Decomposition) algorithm.  

The **Train SVD Recommender** module reads a dataset of user-item-rating triples. It returns a trained SVD recommender. You can then use the trained model to predict ratings or generate recommendations, by using the [Score SVD Recommender](score-svd-recommender.md) module.  


  
## More about recommendation models and the SVD recommender  

The main aim of a recommendation system is to recommend one or more *items* to *users* of the system. Examples of an item could be a movie, restaurant, book, or song. A user could be a person, group of persons, or other entity with item preferences.  

There are two principal approaches to recommender systems. 

+ The first is the **content-based** approach, which makes use of features for both users and items. Users may be described by properties such as age and gender, and items may be described by properties such as author and manufacturer. Typical examples of content-based recommendation systems can be found on social matchmaking sites. 
+ The second approach is **collaborative filtering**, which uses only identifiers of the users and the items and obtains implicit information about these entities from a (sparse) matrix of ratings given by the users to the items. We can learn about a user from the items they have rated and from other users who have rated the same items.  

The SVD recommender uses identifiers of the users and the items, and a matrix of ratings given by the users to the items. It is a **collaborative recommender**. 

For more information about the SVD recommender, see the relevant research paper: [Matrix factorization techniques for recommender systems](https://datajobs.com/data-science-repo/Recommender-Systems-[Netflix].pdf).


## How to configure Train SVD Recommender  

+ [Prepare the training data](#prepare-data)
+ [Train the model](#train-the-model)

### Prepare data

Before trying to use the module, it is essential that your data be in the format expected by the recommendation model. A training data set of **user-item-rating triples** is required.

#### Required dataset of user-item-ratings

It is important that the input data used for training contain the right type of data in the correct format: 

+ The first column must contain user identifiers.
+ The second column must contain item identifiers.
+ The third column contains the rating for the user-item pair. Rating values must be numeric type.  

																																																		   

The **Restaurant ratings** dataset in Azure Machine Learning designer (click **Saved Datasets** and then **Samples**) demonstrates the expected format:

|userID|placeID|rating|
|------------|-------------|------------|
|U1077|135085|2|
|U1077|135038|2|

From this sample, you can see that a single user has rated two separate restaurants. 

### Train the model

1.  Add the **Train SVD Recommender** module to your pipeline in the designer, and connect it to the training data.  
   
2.  For **Number of factors**, type the number specifying the number of factors to use with recommender.  
    
    Each factor measures how much the user is related with the item. The number of factors is also the dimensionality of latent factor space. With the number of users and item increasing, it is better to set a larger number of factors. However, if the number is too large, the performance maybe reduce.
    
3.  **Number of recommendation algorithm iterations**, indicates how many times the algorithm should process the input data. The higher this number, the more accurate the predictions; however, training is slower. The default value is 30.

4.  For **Learning rate**, type a number between 0.0 and 2.0 that defines the step size while learning.

    The learning rate determines the size of the step taken at each iteration. If the step size is too large, you might overshoot the optimal solution. If the step size is too small, training takes longer to converge on the best solution. 
  
5.  Run the pipeline.  


## Next steps

See the [set of modules available](module-reference.md) to Azure Machine Learning service. 

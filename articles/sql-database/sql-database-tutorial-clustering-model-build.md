---
title: "Tutorial: Build a clustering model in R"
titleSuffix: Azure SQL Database Machine Learning Services (preview)
description: In part two of this three-part tutorial series, you'll build a K-Means model to perform clustering in R with Azure SQL Database Machine Learning Services (preview).
services: sql-database
ms.service: sql-database
ms.subservice: machine-learning
ms.custom:
ms.devlang: r
ms.topic: tutorial
author: garyericson
ms.author: garye
ms.reviewer: davidph
manager: cgronlun
ms.date: 05/17/2019
---

# Tutorial: Build a clustering model in R with Azure SQL Database Machine Learning Services (preview)

In part two of this three-part tutorial series, you'll build a K-Means model to perform clustering in R with Azure SQL Database Machine Learning Services (preview).

In this article, you'll learn how to:

> [!div class="checklist"]
> * Define the number of clusters for a K-Means algorithm
> * Perform clustering
> * Analyze the results

In [part one](sql-database-tutorial-clustering-model-prepare-data.md), you learned how to prepare the data from an Azure SQL database to perform clustering in R.

In [part three](sql-database-tutorial-clustering-model-deploy.md), you'll learn how to create a stored procedure in an Azure SQL database that can perform clustering based on new data.

[!INCLUDE[ml-preview-note](../../includes/sql-database-ml-preview-note.md)]

## Prerequisites

* Part two of this tutorial assumes you have completed [**part one**](sql-database-tutorial-clustering-model-prepare-data.md) and its prerequisites.

## Define the number of clusters

To cluster your customer data, you'll use the **K-Means** clustering algorithm, one of the simplest and most well-known ways of grouping data.
You can read more about K-Means in [A complete guide to K-means clustering algorithm](https://www.kdnuggets.com/2019/05/guide-k-means-clustering-algorithm.html).

The algorithm accepts two inputs: The data itself, and a predefined number "*k*" representing the number of clusters to generate.
The output is *k* clusters with the input data partitioned among the clusters.

To determine the number of clusters for the algorithm to use, use a plot of the within groups sum of squares, by number of clusters extracted. The appropriate number of clusters to use is at the bend or "elbow" of the plot.

```r
# Determine number of clusters by using a plot of the within groups sum of squares,
# by number of clusters extracted. 
wss <- (nrow(customer_data) - 1) * sum(apply(customer_data, 2, var))
for (i in 2:20)
    wss[i] <- sum(kmeans(customer_data, centers = i)$withinss)
plot(1:20, wss, type = "b", xlab = "Number of Clusters", ylab = "Within groups sum of squares")
```

![Elbow graph](./media/sql-database-tutorial-clustering-model-build/elbow-graph.png)

Based on the graph, it looks like *k = 4* would be a good value to try. That *k* value will group the customers into four clusters.

## Perform clustering

In the following R script, you'll use the function **rxKmeans**, which is the K-Means function in the RevoScaleR package.

```r
# Output table to hold the customer group mappings.
# This is a table where the cluster mappings will be saved in the database.
return_cluster = RxSqlServerData(table = "return_cluster", connectionString = connStr);
# Set the seed for the random number generator for predictability
set.seed(10);
# Generate clusters using rxKmeans and output key / cluster to a table in SQL database
# called return_cluster
clust <- rxKmeans( ~ orderRatio + itemsRatio + monetaryRatio + frequency,
                   customer_returns,
                   numClusters=4,
                   outFile=return_cluster,
                   outColName="cluster",
                   extraVarsToWrite=c("customer"),
                   overwrite=TRUE);

# Read the customer returns cluster table from the database
customer_cluster <- rxDataStep(return_cluster);
```

## Analyze the results

Now that you've done the clustering using K-Means, the next step is to analyze the result and see if you can find any actionable information.

The **clust** object contains the results from the K-Means clustering.

```r
#Look at the clustering details to analyze results
clust
```

```results
Call:
rxKmeans(formula = ~orderRatio + itemsRatio + monetaryRatio + 
    frequency, data = customer_returns, outFile = return_cluster, 
    outColName = "cluster", extraVarsToWrite = c("customer"), 
    overwrite = TRUE, numClusters = 4)
Data: customer_returns
Number of valid observations: 37336
Number of missing observations: 0 
Clustering algorithm:  

K-means clustering with 4 clusters of sizes 31675, 671, 2851, 2139
Cluster means:
   orderRatio   itemsRatio monetaryRatio frequency
1 0.000000000 0.0000000000    0.00000000  0.000000
2 0.007451565 0.0000000000    0.04449653  4.271237
3 1.008067345 0.2707821817    0.49515232  1.031568
4 0.000000000 0.0004675082    0.10858272  1.186068
Within cluster sum of squares by cluster:
         1          2          3          4
    0.0000  1329.0160 18561.3157   363.2188
```

The four cluster means are given using the variables defined in [part one](sql-database-tutorial-clustering-model-prepare-data.md#separate-customers):

* *orderRatio* = return order ratio (total number of orders partially or fully returned versus the total number of orders)
* *itemsRatio* = return item ratio (total number of items returned versus the number of items purchased)
* *monetaryRatio* = return amount ratio (total monetary amount of items returned versus the amount purchased)
* *frequency* = return frequency

Data mining using K-Means often requires further analysis of the results, and further steps to better understand each cluster, but it can provide some good leads.
Here are a couple ways you could interpret these results:

* Cluster 1 (the largest cluster) seems to be a group of customers that are not active (all values are zero).
* Cluster 3 seems to be a group that stands out in terms of return behavior.

## Clean up resources

***If you're not going to continue with this tutorial***, delete the tpcxbb_1gb database from your Azure SQL Database server.

From the Azure portal, follow these steps:

1. From the left-hand menu in the Azure portal, select **All resources** or **SQL databases**.
1. In the **Filter by name...** field, enter **tpcxbb_1gb**, and select your subscription.
1. Select your **tpcxbb_1gb** database.
1. On the **Overview** page, select **Delete**.

## Next steps

In part two of this tutorial series, you completed these steps:

* Define the number of clusters for a K-Means algorithm
* Perform clustering
* Analyze the results

To deploy the machine learning model you've created, follow part three of this tutorial series:

> [!div class="nextstepaction"]
> [Tutorial: Deploy a clustering model in R with Azure SQL Database Machine Learning Services (preview)](sql-database-tutorial-clustering-model-deploy.md)
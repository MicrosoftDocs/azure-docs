---
title: Example designer pipelines & datasets
titleSuffix: Azure Machine Learning
description: Use samples in Azure Machine Learning designer to jumps-start your machine learning pipelines.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: sample

author: peterclu
ms.author: peterlu
ms.date: 03/29/2020
ms.custom: designer
---
# Example pipelines & datasets for Azure Machine Learning Designer

Use the built-in examples in Azure Machine Learning designer to quickly get started building your own machine learning pipelines. The Azure Machine Learning designer [GitHub repository](https://github.com/Azure/MachineLearningDesigner) contains detailed documentation to help you understand some common  machine learning scenarios.

## Prerequisites

* An Azure subscription. If you don't have an Azure subscription, create a [free account](https://aka.ms/AMLFree).
* An Azure Machine Learning workspace with the Enterprise SKU.

## Use sample pipelines

The designer saves a copy of the sample pipelines to your studio workspace. You can edit the pipeline to adapt it to your needs and save it as your own. Use them as a starting point to jumpstart your projects.

Here's how to use a designer sample:

1. Sign in to <a href="https://ml.azure.com?tabs=jre" target="_blank">ml.azure.com</a>, and select the workspace you want to work with.

1. Select **Designer**.

1. Select a sample pipeline under the **New pipeline** section.

    Select **Show more samples** for a complete list of samples.

1. To run a pipeline, you first have to set default compute target to run the pipeline on.

   1. In the **Settings** pane to the right of the canvas, select **Select compute target**.

   1. In the dialog that appears, select an existing compute target or create a new one. Select **Save**.

   1. Select **Submit** at the top of the canvas to submit a pipeline run.

   Depending on the sample pipeline and compute settings, runs may take some time to complete. The default compute settings have a minimum node size of 0, which means that the designer must allocate resources after being idle. Repeated pipeline runs will take less time since the compute resources are already allocated. Additionally, the designer uses cached results for each module to further improve efficiency.


1. After the pipeline finishes running, you can review the pipeline and view the output for each module to learn more. Use the following steps to view module outputs:

   1. Select a module in the canvas.

   1. In the module details pane to the right of the canvas, select **Outputs + logs**. Select the graph icon ![visualize icon](./media/tutorial-designer-automobile-price-train-score/visualize-icon.png) to see the results of each module. 

   Use the samples as starting points for some of the most common machine learning scenarios.

## Regression

Explore these built-in regression samples.

| Sample title | Description | 
| --- | --- |
| [Sample 1: Regression - Automobile Price Prediction (Basic)](https://github.com/Azure/MachineLearningDesigner/blob/master/articles/samples/how-to-designer-sample-regression-automobile-price-basic.md) | Predict car prices using linear regression. |
| [Sample 2: Regression - Automobile Price Prediction (Advanced)](https://github.com/Azure/MachineLearningDesigner/blob/master/articles/samples/how-to-designer-sample-regression-automobile-price-compare-algorithms.md) | Predict car prices using decision forest and boosted decision tree regressors. Compare models to find the best algorithm.

## Classification

Explore these built-in classification samples. You can learn more about the samples without documentation links by opening the samples and viewing the module comments instead.

| Sample title | Description | 
| --- | --- |
| [Sample 3: Binary Classification with Feature Selection - Income Prediction](https://github.com/Azure/MachineLearningDesigner/blob/master/articles/samples/how-to-designer-sample-classification-predict-income.md) | Predict income as high or low, using a two-class boosted decision tree. Use Pearson correlation to select features.
| [Sample 4: Binary Classification with custom Python script - Credit Risk Prediction](https://github.com/Azure/MachineLearningDesigner/blob/master/articles/samples/how-to-designer-sample-classification-credit-risk-cost-sensitive.md) | Classify credit applications as high or low risk. Use the Execute Python Script module to weight your data.
| [Sample 5: Binary Classification - Customer Relationship Prediction](https://github.com/Azure/MachineLearningDesigner/blob/master/articles/samples/how-to-designer-sample-classification-churn.md) | Predict customer churn using two-class boosted decision trees. Use SMOTE to sample biased data.
| [Sample 7: Text Classification - Wikipedia SP 500 Dataset](https://github.com/Azure/MachineLearningDesigner/blob/master/articles/samples/how-to-designer-sample-text-classification.md) | Classify company types from Wikipedia articles with multiclass logistic regression. |
| Sample 12: Multiclass Classification - Letter Recognition | Create an ensemble of binary classifiers to classify written letters. |

## Recommender

Explore these built-in recommender samples. You can learn more about the samples without documentation links by opening the samples and viewing the module comments instead.

| Sample title | Description | 
| --- | --- |
| Sample 10: Recommendation - Movie Rating Tweets | Build a movie recommender engine from movie titles and rating. |

## Utility

Learn more about the samples that demonstrate machine learning utilities and features. You can learn more about the samples without documentation links by opening the samples and viewing the module comments instead.

| Sample title | Description | 
| --- | --- |
| [Sample 6: Use custom R script - Flight Delay Prediction](https://github.com/Azure/MachineLearningDesigner/blob/master/articles/samples/how-to-designer-sample-classification-flight-delay.md) |
| Sample 8: Cross Validation for Binary Classification - Adult Income Prediction | Use cross validation to build a binary classifier for adult income.
| Sample 9: Permutation Feature Importance | Use permutation feature importance to compute importance scores for the test dataset. 
| Sample 11: Tune Parameters for Binary Classification - Adult Income Prediction | Use Tune Model Hyperparameters to find optimal hyperparameters to build a binary classifier. |

## Datasets

When you create a new pipeline in Azure Machine Learning designer, a number of sample datasets are included by default. These sample datasets are used by the sample pipelines in the designer homepage. 

The sample datasets are available under **Datasets**-**Samples** category. You can find this in the module palette to the left of the canvas in the designer. You can use any of these datasets in your own pipeline by dragging it to the canvas.

| Dataset&nbsp;name&nbsp;&nbsp;&nbsp;&nbsp;| Dataset description |
|-------------|:--------------------|
| Adult Census Income Binary Classification dataset | A subset of the 1994 Census database, using working adults over the age of 16 with an adjusted income index of > 100.<br/>**Usage**: Classify people using demographics to predict whether a person earns over 50K a year.<br/> **Related Research**: Kohavi, R., Becker, B., (1996). [UCI Machine Learning Repository](https://archive.ics.uci.edu/ml). Irvine, CA: University of California, School of Information and Computer Science|
|Automobile price data (Raw)|Information about automobiles by make and model, including the price, features such as the number of cylinders and MPG, as well as an insurance risk score.<br/> The risk score is initially associated with auto price. It is then adjusted for actual risk in a process known to actuaries as symboling. A value of +3 indicates that the auto is risky, and a value of -3 that it is probably safe.<br/>**Usage**:</b> Predict the risk score by features, using regression or multivariate classification.<br/>**Related Research**:</b> Schlimmer, J.C. (1987). [UCI Machine Learning Repository](https://archive.ics.uci.edu/ml). Irvine, CA: University of California, School of Information and Computer Science. |
| CRM Appetency Labels Shared |Labels from the KDD Cup 2009 customer relationship prediction challenge ([orange_small_train_appetency.labels](http://www.sigkdd.org/site/2009/files/orange_small_train_appetency.labels)).|
|CRM Churn Labels Shared|Labels from the KDD Cup 2009 customer relationship prediction challenge ([orange_small_train_churn.labels](http://www.sigkdd.org/site/2009/files/orange_small_train_churn.labels)).|
|CRM Dataset Shared | This data comes from the KDD Cup 2009 customer relationship prediction challenge ([orange_small_train.data.zip](http://www.sigkdd.org/site/2009/files/orange_small_train.data.zip)). <br/>The dataset contains 50K customers from the French Telecom company Orange. Each customer has 230 anonymized features, 190 of which are numeric and 40 are categorical. The features are very sparse. |
|CRM Upselling Labels Shared|Labels from the KDD Cup 2009 customer relationship prediction challenge ([orange_large_train_upselling.labels](http://www.sigkdd.org/site/2009/files/orange_large_train_upselling.labels)|
|Flight Delays Data|Passenger flight on-time performance data taken from the TranStats data collection of the U.S. Department of Transportation ([On-Time](https://www.transtats.bts.gov/DL_SelectFields.asp?Table_ID=236&DB_Short_Name=On-Time)).<br/>The dataset covers the time period April-October 2013. Before uploading to the designer, the dataset was processed as follows: <br/>-    The dataset was filtered to cover only the 70 busiest airports in the continental US <br/>- Canceled flights were labeled as delayed by more than 15 minutes <br/>- Diverted flights were filtered out <br/>- The following columns were selected: Year, Month, DayofMonth, DayOfWeek, Carrier, OriginAirportID, DestAirportID, CRSDepTime, DepDelay, DepDel15, CRSArrTime, ArrDelay, ArrDel15, Canceled|
|German Credit Card UCI dataset|The UCI Statlog (German Credit Card) dataset ([Statlog+German+Credit+Data](https://archive.ics.uci.edu/ml/datasets/Statlog+(German+Credit+Data))), using the german.data file.<br/>The dataset classifies people, described by a set of attributes, as low or high credit risks. Each example represents a person. There are 20 features, both numerical and categorical, and a binary label (the credit risk value). High credit risk entries have label = 2, low credit risk entries have label = 1. The cost of misclassifying a low risk example as high is 1, whereas the cost of misclassifying a high risk example as low is 5.|
|IMDB Movie Titles|The dataset contains information about movies that were rated in Twitter tweets: IMDB movie ID, movie name, genre, and production year. There are 17K movies in the dataset. The dataset was introduced in the paper "S. Dooms, T. De Pessemier and L. Martens. MovieTweetings: a Movie Rating Dataset Collected From Twitter. Workshop on Crowdsourcing and Human Computation for Recommender Systems, CrowdRec at RecSys 2013."|
|Movie Ratings|The dataset is an extended version of the Movie Tweetings dataset. The dataset has 170K ratings for movies, extracted from well-structured tweets on Twitter. Each instance represents a tweet and is a tuple: user ID, IMDB movie ID, rating, timestamp, number of favorites for this tweet, and number of retweets of this tweet. The dataset was made available by A. Said, S. Dooms, B. Loni and D. Tikk for Recommender Systems Challenge 2014.|
|Weather Dataset|Hourly land-based weather observations from NOAA ([merged data from 201304 to 201310](https://az754797.vo.msecnd.net/data/WeatherDataset.csv)).<br/>The weather data covers observations made from airport weather stations, covering the time period April-October 2013. Before uploading to the designer, the dataset was processed as follows:    <br/> -    Weather station IDs were mapped to corresponding airport IDs    <br/> -    Weather stations not associated with the 70 busiest airports were filtered out    <br/> -    The Date column was split into separate Year, Month, and Day columns    <br/> - The following columns were selected: AirportID, Year, Month, Day, Time, TimeZone, SkyCondition, Visibility, WeatherType, DryBulbFarenheit, DryBulbCelsius, WetBulbFarenheit, WetBulbCelsius, DewPointFarenheit, DewPointCelsius, RelativeHumidity, WindSpeed, WindDirection, ValueForWindCharacter, StationPressure, PressureTendency, PressureChange, SeaLevelPressure, RecordType, HourlyPrecip, Altimeter|
|Wikipedia SP 500 Dataset|Data is derived from Wikipedia (https://www.wikipedia.org/) based on articles of each S&P 500 company, stored as XML data.    <br/>Before uploading to the designer, the dataset was processed as follows:    <br/> - Extract text content for each specific company    <br/> -    Remove wiki formatting    <br/> -    Remove non-alphanumeric characters    <br/> -    Convert all text to lowercase    <br/> -    Known company categories were added    <br/>Note that for some companies an article could not be found, so the number of records is less than 500.|


## Clean up resources

[!INCLUDE [aml-ui-cleanup](../../includes/aml-ui-cleanup.md)]

## Next steps

Learn the basics of predictive analytics and machine learning with [Tutorial: Predict automobile price with the designer](tutorial-designer-automobile-price-train-score.md)


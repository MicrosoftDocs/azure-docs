---
title: Use sample datasets in Azure Machine Learning designer
titleSuffix: Azure Machine Learning
description: Learn more about the sample datasets included in Azure Machine Learning designer.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: sample

author: likebupt
ms.author: keli19
ms.date: 03/03/2020
---

# Use the sample datasets in Azure Machine Learning designer (preview)

When you create a new pipeline in Azure Machine Learning designer (preview), a number of sample datasets are included by default. These sample datasets are used by the sample pipelines in the designer homepage. 

The sample datasets are available under **Datasets**-**Samples** category. You can find this in the module palette to the left of the canvas in the designer. You can use any of these datasets in your own pipeline by dragging it to the canvas.

## Datasets


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

## Next steps

* Learn the basics of predictive analytics and machine learning with [Tutorial: Predict automobile price with the designer](tutorial-designer-automobile-price-train-score.md)

* Learn how to modify existing [designer samples](samples-designer.md) to adapt them to your needs.

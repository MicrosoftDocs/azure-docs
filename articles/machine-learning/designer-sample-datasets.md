---
title: Use the sample datasets
titleSuffix: Azure Machine Learning
description: Descriptions of the datasets used in sample models included in Machine Learning designer. You can use these sample datasets for your pipelines.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: conceptual

author: likebupt
ms.author: keli19
ms.date: 02/19/2020
---

# Use the sample datasets in Azure Machine Learning designer (preview)

When you create a new pipeline in Azure Machine Learning designer (preview), a number of sample datasets are included by default. Many of these sample datasets are used by the sample models in the designer homepage. Others are included as examples of various types of data typically used in machine learning.

Some of these datasets are available in Azure Blob storage. For these datasets, the following table provides a direct link. You can use these datasets in your pipelines by using the [Import Data](./algorithm-module-reference/import-data.md) module.

The rest of these sample datasets are available under **Datasets**-**Samples** category. You can find this in the module palette to the left of the canvas in the designer. You can use any of these datasets in your own pipeline by dragging it to the canvas.

## Datasets

<table>

<tr>
  <th>Dataset name</th>
  <th>Dataset description</th>
</tr>

<tr>
  <td>Adult Census Income Binary Classification dataset</td>
  <td>
A subset of the 1994 Census database, using working adults over the age of 16 with an adjusted income index of > 100.
<p></p>
<b>Usage:</b> Classify people using demographics to predict whether a person earns over 50K a year.
<p></p>
<b>Related Research:</b> Kohavi, R., Becker, B., (1996). UCI Machine Learning Repository <a href="https://archive.ics.uci.edu/ml">https://archive.ics.uci.edu/ml</a>. Irvine, CA: University of California, School of Information and Computer Science
  </td>
</tr>

<tr>
  <td>Automobile price data (Raw)</td>
  <td>
Information about automobiles by make and model, including the price, features such as the number of cylinders and MPG, as well as an insurance risk score.
<p></p>
The risk score is initially associated with auto price. It is then adjusted for actual risk in a process known to actuaries as symboling. A value of +3 indicates that the auto is risky, and a value of -3 that it is probably safe.
<p></p>
<b>Usage:</b> Predict the risk score by features, using regression or multivariate classification. 
<p></p>
<b>Related Research:</b> Schlimmer, J.C. (1987). UCI Machine Learning Repository <a href="https://archive.ics.uci.edu/ml">https://archive.ics.uci.edu/ml</a>. Irvine, CA: University of California, School of Information and Computer Science
  </td>
</tr>


<tr>
  <td>CRM Appetency Labels Shared</td>
  <td>
Labels from the KDD Cup 2009 customer relationship prediction challenge (<a href="http://www.sigkdd.org/site/2009/files/orange_small_train_appetency.labels">orange_small_train_appetency.labels</a>).
  </td>
</tr>

<tr>
  <td>CRM Churn Labels Shared</td>
  <td>
Labels from the KDD Cup 2009 customer relationship prediction challenge (<a href="http://www.sigkdd.org/site/2009/files/orange_small_train_churn.labels">orange_small_train_churn.labels</a>).
  </td>
</tr>

<tr>
  <td>CRM Dataset Shared</td>
  <td>
This data comes from the KDD Cup 2009 customer relationship prediction challenge (<a href="http://www.sigkdd.org/site/2009/files/orange_small_train.data.zip">orange_small_train.data.zip</a>).
<p></p>
The dataset contains 50K customers from the French Telecom company Orange. Each customer has 230 anonymized features, 190 of which are numeric and 40 are categorical. The features are very sparse.
  </td>
</tr>

<tr>
  <td>CRM Upselling Labels Shared</td>
  <td>
Labels from the KDD Cup 2009 customer relationship prediction challenge (<a href="http://www.sigkdd.org/site/2009/files/orange_large_train_upselling.labels">orange_large_train_upselling.labels</a>).
  </td>
</tr>

<tr>
  <td>Flight Delays Data</td>
  <td>
Passenger flight on-time performance data taken from the TranStats data collection of the U.S. Department of Transportation (<a href="https://www.transtats.bts.gov/DL_SelectFields.asp?Table_ID=236&DB_Short_Name=On-Time">On-Time</a>).
<p></p>
The dataset covers the time period April-October 2013. Before uploading to the designer, the dataset was processed as follows:
<ul>
  <li>The dataset was filtered to cover only the 70 busiest airports in the continental US</li>
  <li>Canceled flights were labeled as delayed by more than 15 minutes</li>
  <li>Diverted flights were filtered out</li>
  <li>The following columns were selected: Year, Month, DayofMonth, DayOfWeek, Carrier, OriginAirportID, DestAirportID, CRSDepTime, DepDelay, DepDel15, CRSArrTime, ArrDelay, ArrDel15, Canceled</li>
</ul>
</td>
</tr>

<tr>
  <td>German Credit Card UCI dataset</td>
  <td>
The UCI Statlog (German Credit Card) dataset (<a href="https://archive.ics.uci.edu/ml/datasets/Statlog+(German+Credit+Data)">Statlog+German+Credit+Data</a>), using the german.data file.
<p></p>
The dataset classifies people, described by a set of attributes, as low or high credit risks. Each example represents a person. There are 20 features, both numerical and categorical, and a binary label (the credit risk value). High credit risk entries have label = 2, low credit risk entries have label = 1. The cost of misclassifying a low risk example as high is 1, whereas the cost of misclassifying a high risk example as low is 5.
  </td>
</tr>

<tr>
  <td>IMDB Movie Titles</td>
  <td>
The dataset contains information about movies that were rated in Twitter tweets: IMDB movie ID, movie name, genre, and production year. There are 17K movies in the dataset. The dataset was introduced in the paper "S. Dooms, T. De Pessemier and L. Martens. MovieTweetings: a Movie Rating Dataset Collected From Twitter. Workshop on Crowdsourcing and Human Computation for Recommender Systems, CrowdRec at RecSys 2013."
  </td>
</tr>

<tr>
  <td>Movie Ratings</td>
  <td>
The dataset is an extended version of the Movie Tweetings dataset. The dataset has 170K ratings for movies, extracted from well-structured tweets on Twitter. Each instance represents a tweet and is a tuple: user ID, IMDB movie ID, rating, timestamp, number of favorites for this tweet, and number of retweets of this tweet. The dataset was made available by A. Said, S. Dooms, B. Loni and D. Tikk for Recommender Systems Challenge 2014.
  </td>
</tr>


<tr>
  <td>Weather Dataset</td>
  <td>
Hourly land-based weather observations from NOAA (<a href="https://az754797.vo.msecnd.net/data/WeatherDataset.csv">merged data from 201304 to 201310</a>).
<p></p>
The weather data covers observations made from airport weather stations, covering the time period April-October 2013. Before uploading to the designer, the dataset was processed as follows:
<ul>
  <li>Weather station IDs were mapped to corresponding airport IDs</li>
  <li>Weather stations not associated with the 70 busiest airports were filtered out</li>
  <li>The Date column was split into separate Year, Month, and Day columns</li>
  <li>The following columns were selected: AirportID, Year, Month, Day, Time, TimeZone, SkyCondition, Visibility, WeatherType, DryBulbFarenheit, DryBulbCelsius, WetBulbFarenheit, WetBulbCelsius, DewPointFarenheit, DewPointCelsius, RelativeHumidity, WindSpeed, WindDirection, ValueForWindCharacter, StationPressure, PressureTendency, PressureChange, SeaLevelPressure, RecordType, HourlyPrecip, Altimeter</li>
</ul>
  </td>
</tr>

<tr>
  <td>Wikipedia SP 500 Dataset</td>
  <td>
Data is derived from Wikipedia (<a href="https://www.wikipedia.org/">https://www.wikipedia.org/</a>) based on articles of each S&P 500 company, stored as XML data.
<p></p>
Before uploading to the designer, the dataset was processed as follows:
<ul>
  <li>Extract text content for each specific company</li>
  <li>Remove wiki formatting</li>
  <li>Remove non-alphanumeric characters</li>
  <li>Convert all text to lowercase</li>
  <li>Known company categories were added</li>
</ul>
<p></p>
Note that for some companies an article could not be found, so the number of records is less than 500.
  </td>
</tr>

</table>

## Next steps

* Learn the basics of predictive analytics and machine learning with [Tutorial: Predict automobile price with the designer](tutorial-designer-automobile-price-train-score.md)

* Use [Import Data](./algorithm-module-reference/import-data.md) module to import sample datasets

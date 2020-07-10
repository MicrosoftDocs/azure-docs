---
title: Use the sample datasets
titleSuffix: ML Studio (classic) - Azure
description: Descriptions of the datasets used in sample models included in Machine Learning Studio (classic). You can use these sample datasets for your experiments.
services: machine-learning
ms.service: machine-learning
ms.subservice: studio
ms.topic: sample

author: likebupt
ms.author: keli19
ms.custom: previous-author=heatherbshapiro, previous-ms.author=hshapiro
ms.date: 01/19/2018
---
# Use the sample datasets in Azure Machine Learning Studio (classic)

[top]: #machine-learning-sample-datasets

When you create a new workspace in Azure Machine Learning Studio (classic), a number of sample datasets and experiments are included by default. Many of these sample datasets are used by the sample models in the [Azure AI Gallery](https://gallery.azure.ai/). Others are included as examples of various types of data typically used in machine learning.

Some of these datasets are available in Azure Blob storage. For these datasets, the following table provides a direct link. You can use these datasets in your experiments by using the [Import Data][import-data] module.

The rest of these sample datasets are available in your workspace under **Saved Datasets**. You can find this in the module palette to the left of the experiment canvas in Machine Learning Studio (classic).
You can use any of these datasets in your own experiment by dragging it to your experiment canvas.

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
  <td>Airport Codes Dataset</td>
  <td>
U.S. airport codes.
<p></p>
This dataset contains one row for each U.S. airport, providing the airport ID number and name along with the location city and state.
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
  <td>Bike Rental UCI dataset</td>
  <td>
UCI Bike Rental dataset that is based on real data from Capital Bikeshare company that maintains a bike rental network in Washington DC.
<p></p>
The dataset has one row for each hour of each day in 2011 and 2012, for a total of 17,379 rows. The range of hourly bike rentals is from 1 to 977.

  </td>
</tr>

<tr>
  <td>Bill Gates RGB Image</td>
  <td>
Publicly available image file converted to CSV data.
<p></p>
The code for converting the image is provided in the <strong>Color quantization using K-Means clustering</strong> model detail page.
  </td>
</tr>

<tr>
  <td>Blood donation data</td>
  <td>
A subset of data from the blood donor database of the Blood Transfusion Service Center of Hsin-Chu City, Taiwan.
<p></p>
Donor data includes the months since last donation), and frequency, or the total number of donations, time since last donation, and amount of blood donated.
<p></p>
<b>Usage:</b> The goal is to predict via classification whether the donor donated blood in March 2007, where 1 indicates a donor during the target period, and 0 a non-donor. 
<p></p>
<b>Related Research:</b> Yeh, I.C., (2008). UCI Machine Learning Repository <a href="https://archive.ics.uci.edu/ml">https://archive.ics.uci.edu/ml</a>. Irvine, CA: University of California, School of Information and Computer Science 
<p></p>
Yeh, I-Cheng, Yang, King-Jang, and Ting, Tao-Ming, "Knowledge discovery on RFM model using Bernoulli sequence, "Expert Systems with Applications, 2008, <a href="https://dx.doi.org/10.1016/j.eswa.2008.07.018">https://dx.doi.org/10.1016/j.eswa.2008.07.018</a>
  </td>
</tr>

<tr>
  <td>Breast cancer data</td>
  <td>
One of three cancer-related datasets provided by the Oncology Institute that appears frequently in machine learning literature. Combines diagnostic information with features from laboratory analysis of about 300 tissue samples.
<p></p>
<b>Usage:</b> Classify the type of cancer, based on 9 attributes, some of which are linear and some are categorical. 
<p></p>
<b>Related Research:</b> Wohlberg, W.H., Street, W.N., & Mangasarian, O.L. (1995). UCI Machine Learning Repository <a href="https://archive.ics.uci.edu/ml">https://archive.ics.uci.edu/ml</a>. Irvine, CA: University of California, School of Information and Computer Science
  </td>
</tr>

<tr>
  <td>Breast Cancer Features
  <td>
The dataset contains information for 102K suspicious regions (candidates) of X-ray images, each described by 117 features. The features are proprietary and their meaning is not revealed by the dataset creators (Siemens Healthcare). 
  </td>
</tr>

<tr>
  <td>Breast Cancer Info</td>
  <td>
The dataset contains additional information for each suspicious region of X-ray image. Each example provides information (for example, label, patient ID, coordinates of patch relative to the whole image) about the corresponding row number in the Breast Cancer Features dataset. Each patient has a number of examples. For patients who have a cancer, some examples are positive and some are negative. For patients who don't have a cancer, all examples are negative. The dataset has 102K examples. The dataset is biased, 0.6% of the points are positive, the rest are negative. The dataset was made available by Siemens Healthcare.
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
  <td>Energy-Efficiency Regression data</td>
  <td>
A collection of simulated energy profiles, based on 12 different building shapes. The buildings are differentiated by eight features. This includes glazing area, the glazing area distribution, and orientation.
<p></p>
<b>Usage:</b> Use either regression or classification to predict the energy-efficiency rating based as one of two real valued responses. For multi-class classification, is round the response variable to the nearest integer. 
<p></p>
<b>Related Research:</b> Xifara, A. & Tsanas, A. (2012). UCI Machine Learning Repository <a href="https://archive.ics.uci.edu/ml">https://archive.ics.uci.edu/ml</a>. Irvine, CA: University of California, School of Information and Computer Science
  </td>
</tr>

<tr>
  <td>Flight Delays Data</td>
  <td>
Passenger flight on-time performance data taken from the TranStats data collection of the U.S. Department of Transportation (<a href="https://www.transtats.bts.gov/DL_SelectFields.asp?Table_ID=236&DB_Short_Name=On-Time">On-Time</a>).
<p></p>
The dataset covers the time period April-October 2013. Before uploading to Azure Machine Learning Studio (classic), the dataset was processed as follows:
<ul>
  <li>The dataset was filtered to cover only the 70 busiest airports in the continental US</li>
  <li>Canceled flights were labeled as delayed by more than 15 minutes</li>
  <li>Diverted flights were filtered out</li>
  <li>The following columns were selected: Year, Month, DayofMonth, DayOfWeek, Carrier, OriginAirportID, DestAirportID, CRSDepTime, DepDelay, DepDel15, CRSArrTime, ArrDelay, ArrDel15, Canceled</li>
</ul>
</td>
</tr>

<tr>
  <td>Flight on-time performance (Raw)</td>
  <td>
Records of airplane flight arrivals and departures within United States from October 2011.
<p></p>
<b>Usage:</b> Predict flight delays. 
<p></p>
<b>Related Research:</b> From US Dept. of Transportation <a href="https://www.transtats.bts.gov/DL_SelectFields.asp?Table_ID=236&DB_Short_Name=On-Time">https://www.transtats.bts.gov/DL_SelectFields.asp?Table_ID=236&DB_Short_Name=On-Time</a>.
  </td>
</tr>

<tr>
  <td>Forest fires data</td>
  <td>
Contains weather data, such as temperature and humidity indices and wind speed. The data is taken from an area of northeast Portugal, combined with records of forest fires.
<p></p>
<b>Usage:</b> This is a difficult regression task, where the aim is to predict the burned area of forest fires. 
<p></p>
<b>Related Research:</b> Cortez, P., & Morais, A. (2008). UCI Machine Learning Repository <a href="https://archive.ics.uci.edu/ml">https://archive.ics.uci.edu/ml</a>. Irvine, CA: University of California, School of Information and Computer Science 
<p></p>
[Cortez and Morais, 2007] P. Cortez and A. Morais. A Data Mining Approach to Predict Forest Fires using Meteorological Data. In J. Neves, M. F. Santos and J. Machado Eds., New Trends in Artificial Intelligence, Proceedings of the 13th EPIA 2007 - Portuguese Conference on Artificial Intelligence, December, Guimarães, Portugal, pp. 512-523, 2007. APPIA, ISBN-13 978-989-95618-0-9. Available at: <a href="http://www.dsi.uminho.pt/~pcortez/fires.pdf">http://www.dsi.uminho.pt/~pcortez/fires.pdf</a>.
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
  <td>Iris two class data</td>
  <td>
This is perhaps the best known database to be found in the pattern recognition literature. The dataset is relatively small, containing 50 examples each of petal measurements from three iris varieties.
<p></p>
<b>Usage:</b> Predict the iris type from the measurements.  
<p></p>
<b>Related Research:</b> Fisher, R.A. (1988). UCI Machine Learning Repository <a href="https://archive.ics.uci.edu/ml">https://archive.ics.uci.edu/ml</a>. Irvine, CA: University of California, School of Information and Computer Science
  </td>
</tr>

<tr>
  <td>Movie Tweets</td>
  <td>
The dataset is an extended version of the Movie Tweetings dataset. The dataset has 170K ratings for movies, extracted from well-structured tweets on Twitter. Each instance represents a tweet and is a tuple: user ID, IMDB movie ID, rating, timestamp, number of favorites for this tweet, and number of retweets of this tweet. The dataset was made available by A. Said, S. Dooms, B. Loni and D. Tikk for Recommender Systems Challenge 2014.
  </td>
</tr>

<tr>
  <td>MPG data for various automobiles</td>
  <td>
This dataset is a slightly modified version of the dataset provided by the StatLib library of Carnegie Mellon University. The dataset was used in the 1983 American Statistical Association Exposition.
<p></p>
The data lists fuel consumption for various automobiles in miles per gallon. It also includes information such as the number of cylinders, engine displacement, horsepower, total weight, and acceleration.
<p></p>
<b>Usage:</b> Predict fuel economy based on three multivalued discrete attributes and five continuous attributes. 
<p></p>
<b>Related Research:</b> StatLib, Carnegie Mellon University, (1993). UCI Machine Learning Repository <a href="https://archive.ics.uci.edu/ml">https://archive.ics.uci.edu/ml</a>. Irvine, CA: University of California, School of Information and Computer Science
  </td>
</tr>

<tr>
  <td>Pima Indians Diabetes Binary Classification dataset</td>
  <td>
A subset of data from the National Institute of Diabetes and Digestive and Kidney Diseases database. The dataset was filtered to focus on female patients of Pima Indian heritage. The data includes medical data such as glucose and insulin levels, as well as lifestyle factors.
<p></p>
<b>Usage:</b> Predict whether the subject has diabetes (binary classification). 
<p></p>
<b>Related Research:</b> Sigillito, V. (1990). UCI Machine Learning Repository <a href="https://archive.ics.uci.edu/ml">https://archive.ics.uci.edu/ml"</a>. Irvine, CA: University of California, School of Information and Computer Science
  </td>
</tr>

<tr>
  <td>Restaurant customer data</td>
  <td>
A set of metadata about customers, including demographics and preferences.
<p></p>
<b>Usage:</b> Use this dataset, in combination with the other two restaurant datasets, to train and test a recommender system. 
<p></p>
<b>Related Research:</b> Bache, K. and Lichman, M. (2013). UCI Machine Learning Repository <a href="https://archive.ics.uci.edu/ml">https://archive.ics.uci.edu/ml</a>. Irvine, CA: University of California, School of Information and Computer Science.
  </td>
</tr>

<tr>
  <td>Restaurant feature data</td>
  <td>
A set of metadata about restaurants and their features, such as food type, dining style, and location.
<p></p>
<b>Usage:</b> Use this dataset, in combination with the other two restaurant datasets, to train and test a recommender system. 
<p></p>
<b>Related Research:</b> Bache, K. and Lichman, M. (2013). UCI Machine Learning Repository <a href="https://archive.ics.uci.edu/ml">https://archive.ics.uci.edu/ml</a>. Irvine, CA: University of California, School of Information and Computer Science.
  </td>
</tr>

<tr>
  <td>Restaurant ratings</td>
  <td>
Contains ratings given by users to restaurants on a scale from 0 to 2.
<p></p>
<b>Usage:</b> Use this dataset, in combination with the other two restaurant datasets, to train and test a recommender system. 
<p></p>
<b>Related Research:</b> Bache, K. and Lichman, M. (2013). UCI Machine Learning Repository <a href="https://archive.ics.uci.edu/ml">https://archive.ics.uci.edu/ml</a>. Irvine, CA: University of California, School of Information and Computer Science.
  </td>
</tr>

<tr>
  <td>Steel Annealing multi-class dataset</td>
  <td>
This dataset contains a series of records from steel annealing trials. It contains the physical attributes (width, thickness, type (coil, sheet, etc.) of the resulting steel types.
<p></p>
<b>Usage:</b> Predict any of two numeric class attributes; hardness or strength. You might also analyze correlations among attributes.
<p></p>
Steel grades follow a set standard, defined by SAE and other organizations. You are looking for a specific 'grade' (the class variable) and want to understand the values needed. 
<p></p>
<b>Related Research:</b> Sterling, D. & Buntine, W. (NA). UCI Machine Learning Repository <a href="https://archive.ics.uci.edu/ml">https://archive.ics.uci.edu/ml</a>. Irvine, CA: University of California, School of Information and Computer Science 
<p></p>
A useful guide to steel grades can be found here: <a href="https://www.steamforum.com/pictures/Outokumpu-steel-grades-properties-global-standards.pdf">https://www.steamforum.com/pictures/Outokumpu-steel-grades-properties-global-standards.pdf</a>
  </td>
</tr>

<tr>
  <td>Telescope data</td>
  <td>
Record of high energy gamma particle bursts along with background noise, both simulated using a Monte Carlo process.
<p></p>
The intent of the simulation was to improve the accuracy of ground-based atmospheric Cherenkov gamma telescopes. This is done by using statistical methods to differentiate between the desired signal (Cherenkov radiation showers) and background noise (hadronic showers initiated by cosmic rays in the upper atmosphere).
<p></p>
The data has been pre-processed to create an elongated cluster with the long axis is oriented towards the camera center. The characteristics of this ellipse (often called Hillas parameters) are among the image parameters that can be used for discrimination.
<p></p>
<b>Usage:</b> Predict whether image of a shower represents signal or background noise.
<p></p>
<b>Notes:</b> Simple classification accuracy is not meaningful for this data, since classifying a background event as signal is worse than classifying a signal event as background. For comparison of different classifiers, the ROC graph should be used. The probability of accepting a background event as signal must be below one of the following thresholds: 0.01, 0.02, 0.05, 0.1, or 0.2.
<p></p>
Also, note that the number of background events (h, for hadronic showers) is underestimated. In real measurements, the h or noise class represents the majority of events. 
<p></p>
<b>Related Research:</b> Bock, R.K. (1995). UCI Machine Learning Repository <a href="https://archive.ics.uci.edu/ml">https://archive.ics.uci.edu/ml</a>. Irvine, CA: University of California, School of Information
  </td>
</tr>

<tr>
  <td>Weather Dataset</td>
  <td>
Hourly land-based weather observations from NOAA (<a href="https://az754797.vo.msecnd.net/data/WeatherDataset.csv">merged data from 201304 to 201310</a>).
<p></p>
The weather data covers observations made from airport weather stations, covering the time period April-October 2013. Before uploading to Azure Machine Learning Studio (classic), the dataset was processed as follows:
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
Before uploading to Azure Machine Learning Studio (classic), the dataset was processed as follows:
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

<tr>
  <td><a href="https://azuremlsampleexperiments.blob.core.windows.net/datasets/direct_marketing.csv">direct_marketing.csv</a></td>
  <td>
The dataset contains customer data and indications about their response to a direct mailing campaign. Each row represents a customer. The dataset contains nine features about user demographics and past behavior, and three label columns (visit, conversion, and spend).  Visit is a binary column that indicates that a customer visited after the marketing campaign. Conversion indicates a customer purchased something. Spend is the amount that was spent.  The dataset was made available by Kevin Hillstrom for MineThatData E-Mail Analytics And Data Mining Challenge.
  </td>
</tr>

<tr>
  <td><a href="https://azuremlsampleexperiments.blob.core.windows.net/datasets/lyrl2004_tokens_test.csv">lyrl2004_tokens_test.csv</a></td>
  <td>
Features of test examples in the RCV1-V2 Reuters news dataset. The dataset has 781K news articles along with their IDs (first column of the dataset). Each article is tokenized, stopworded, and stemmed. The dataset was made available by David. D. Lewis.
  </td>
</tr>

<tr>
  <td><a href="https://azuremlsampleexperiments.blob.core.windows.net/datasets/lyrl2004_tokens_train.csv">lyrl2004_tokens_train.csv</a></td>
  <td>
Features of training examples in the RCV1-V2 Reuters news dataset. The dataset has 23K news articles along with their IDs (first column of the dataset). Each article is tokenized, stopworded, and stemmed. The dataset was made available by David. D. Lewis.
  </td>
</tr>

<tr>
  <td><a href="https://azuremlsampleexperiments.blob.core.windows.net/datasets/network_intrusion_detection.csv">network_intrusion_detection.csv</a><br></td>
  <td>
Dataset from the KDD Cup 1999 Knowledge Discovery and Data Mining Tools Competition (<a href="https://kdd.ics.uci.edu/databases/kddcup99/kddcup99.html">kddcup99.html</a>).
<p></p>
The dataset was downloaded and stored in Azure Blob storage (<a href="https://azuremlsampleexperiments.blob.core.windows.net/datasets/network_intrusion_detection.csv">network_intrusion_detection.csv</a>) and includes both training and testing datasets. The training dataset has approximately 126K rows and 43 columns, including the labels. Three columns are part of the label information, and 40 columns, consisting of numeric and string/categorical features, are available for training the model. The test data has approximately 22.5K test examples with the same 43 columns as in the training data.
  </td>
</tr>

<tr>
  <td><a href="https://azuremlsampleexperiments.blob.core.windows.net/datasets/rcv1-v2.topics.qrels.csv">rcv1-v2.topics.qrels.csv</a></td>
  <td>
Topic assignments for news articles in the RCV1-V2 Reuters news dataset. A news article can be assigned to several topics. The format of each row is "&lt;topic name&gt; &lt;document id&gt; 1". The dataset contains 2.6M topic assignments. The dataset was made available by David. D. Lewis.
  </td>
</tr>

<tr>
  <td><a href="https://azuremlsampleexperiments.blob.core.windows.net/datasets/student_performance.txt">student_performance.txt</a></td>
  <td>
This data comes from the KDD Cup 2010 Student performance evaluation challenge (<a href="https://www.kdd.org/kdd-cup/view/kdd-cup-2010-student-performance-evaluation">student performance evaluation</a>). The data used is the Algebra_2008_2009 training set (Stamper, J., Niculescu-Mizil, A., Ritter, S., Gordon, G.J., & Koedinger, K.R. (2010). Algebra I 2008-2009. Challenge dataset from KDD Cup 2010 Educational Data Mining Challenge. Find it at <a href="https://pslcdatashop.web.cmu.edu/KDDCup/downloads.jsp">downloads.jsp</a>.
<p></p>
The dataset was downloaded and stored in Azure Blob storage (<a href="https://azuremlsampleexperiments.blob.core.windows.net/datasets/student_performance.txt">student_performance.txt</a>) and contains log files from a student tutoring system. The supplied features include problem ID and its brief description, student ID, timestamp, and how many attempts the student made before solving the problem in the right way. The original dataset has 8.9M records; this dataset has been down-sampled to the first 100K rows. The dataset has 23 tab-separated columns of various types: numeric, categorical, and timestamp.
  </td>
</tr>

</table>

## Next steps

> [!div class="nextstepaction"]
> [Kickstart your experiments with examples](sample-experiments.md)

<!-- Module References -->
[import-data]: https://msdn.microsoft.com/library/azure/4e1b0fe6-aded-4b3f-a36f-39b8862b9004/

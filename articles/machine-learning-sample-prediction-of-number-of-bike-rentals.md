<properties title="" pageTitle="Machine Learning Sample: Prediction of bike rentals | Azure" description="A sample Azure Machine Learning experiment to develop a regression model that predicts the number of bike rentals hourly." metaKeywords="" services="machine-learning" solutions="" documentationCenter="" authors="Garyericson" manager="paulettm" editor="cgronlun" videoId="" scriptId=""/>

<tags ms.service="machine-learning" ms.workload="data-services" ms.tgt_pltfrm="na" ms.devlang="na" ms.topic="article" ms.date="12/10/2014" ms.author="garye" />


# Azure Machine Learning sample: Prediction of the number of bike rentals

>[AZURE.NOTE]
>The [Sample Experiment] and [Sample Dataset] associated with this model are available in ML Studio. See below for more details.
[Sample Experiment]: #sample-experiment
[Sample Dataset]: #sample-dataset


## Problem Description ##
Prediction of the number of bikes that will be rented at each hour today, given previous rental history, hourly measured weather, indication if today is a holiday/weekday/weekend. The predictions are different for each hour (for example
 there are lots of rentals in the morning and almost no rentals in the night). 

## Data ##
UCI Bike Rental dataset that is based on the real data from Capital Bikeshare company that maintain bike rental network in Washington DC. The dataset has one row per each hour of each day in 2011 and 2012, overall 17379 rows. The range of hourly bike rentals is from 1 to 977.

## Model ##
We used 2011 data as a training set and 2012 data as a test set. We compared 4 sets of features:

1. weather + holiday + weekday + weekend features for the predicted day
1. number of bikes that were rented in each of the previous 12 hours
1. number of bikes that were rented in each of the previous 12 days at the same hour
1. number of bikes that were rented in each of the previous 12 weeks at the same hour and the same day

Features B capture very recent demand for the bikes. Features C capture demand for bikes at particular hour. Features D capture demand for bikes at particular hour and particular day of the week.

Since the label (number of rentals) is real-valued we have regression setting. Also, since the number of features is relatively small (less than 100) and they are not sparse, the decision boundary is probably nonlinear. Based on this, we decided to use boosted decision tree regression algorithm.

## Results ##

<table border="1">
<tr><th>Features</th><th>Mean Absolute Error</th> <th>Root Mean Square Error</th> </tr>
<tr style="background-color: #fff"><td>A</td> <td> 89.7</td> <td>124.9 </td> </tr>
<tr style="background-color: #fff"><td>A+B</td><td>51.2 </td> <td>86.7 </td></tr>
<tr style="background-color: #fff"><td>A+B+C</td><td> 48.5</td> <td> 83.7 </td></tr>
<tr style="background-color: #fff"><td>A+B+C+D</td><td> 48.8 </td> <td>83.2 </td></tr>
</table>

</table>

The best results are shown by features A+B+C and A+B+C+D. Surprisingly, features D don't give any significant improvement over A+B+C. 

## Sample Experiment

The following sample experiment associated with this model is available in ML Studio in the **EXPERIMENTS** section under the **SAMPLES** tab.

> **Sample Experiment - Demand Forecasting of Bikes**


## Sample Dataset

The following sample dataset used by this experiment is available in ML Studio in the module palette under **Saved Datasets**.

<ul>
<li><b>Bike Rental UCI dataset</b><p></p>
[AZURE.INCLUDE [machine-learning-sample-dataset-bike-rental-uci-dataset](../includes/machine-learning-sample-dataset-bike-rental-uci-dataset.md)]
<p></p></li>
</ul>


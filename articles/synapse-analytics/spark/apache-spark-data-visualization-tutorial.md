---
title: Visualize data with Apache Spark 
description: Create rich data visualizations using Apache Spark and Azure Synapse Analytics Notebooks
services: synapse-analytics
author: midesa
ms.service: synapse-analytics
ms.topic: conceptual
ms.subservice: machine-learning
ms.date: 10/20/2020
ms.author: midesa
---

# Analyze data with Apache Spark

In this tutorial, you will learn how to perform exploratory data analysis by using Azure Open Datasets and Apache Spark and then visualizing the results in an Azure Synapse Studio Notebook.

In particular, we will analyze the [New York City (NYC) Taxi](https://azure.microsoft.com/en-us/services/open-datasets/catalog/nyc-taxi-limousine-commission-yellow-taxi-trip-records/) dataset. The data is available through Azure Open Datasets. This subset of the dataset contains information about yellow taxi trips, including information about each trip, the start, and end time and locations, the cost, and other interesting attributes.
  
## Before you begin
- Create an Apache Spark Pool by following the [Create an Apache Spark pool tutorial](../articles/../quickstart-create-apache-spark-pool-studio.md) 

## Download and prepare the data
1. Create a notebook using the PySpark kernel. For instructions, see [Create a Notebook](https://docs.microsoft.com/azure/synapse-analytics/quickstart-apache-spark-notebook#create-a-notebook). 
   
> [!Note]
> 
> Because of the PySpark kernel, you do not need to create any contexts explicitly. The Spark context is automatically created for you when you run the first code cell.
>

2. In this tutorial, we will use several different libraries to help us visualize the dataset. To do this analysis, we will need to import the following libraries: 

```python
import matplotlib.pyplot as plt
import seaborn as sns
import pandas as pd
```

3. Because the raw data is in a Parquet format, you can use the Spark context to pull the file into memory as a dataframe directly. Create a Spark dataframe by retrieving the data via the Open Datasets API. Here, we will use the Spark dataframe *schema on read* properties to infer the datatypes and schema.

```python
from azureml.opendatasets import NycTlcYellow
from datetime import datetime
from dateutil import parser

end_date = parser.parse('2018-06-06')
start_date = parser.parse('2018-05-01')
nyc_tlc = NycTlcYellow(start_date=start_date, end_date=end_date)
df = nyc_tlc.to_spark_dataframe()
```

4. Once the data is read, we will want to do some initial filtering to clean the dataset. We may remove unneeded columns and add additional columns that extract important information. In addition, we will also filter out anomalies within the dataset.

```python
# Filter the dataset 
from pyspark.sql.functions import *

filtered_df = df.select('vendorID', 'passengerCount', 'tripDistance','paymentType', 'fareAmount', 'tipAmount'\
                                , date_format('tpepPickupDateTime', 'hh').alias('hour_of_day')\
                                , dayofweek('tpepPickupDateTime').alias('day_of_week')\
                                , dayofmonth(col('tpepPickupDateTime')).alias('day_of_month'))\
                            .filter((df.passengerCount > 0)\
                                & (df.tipAmount >= 0)\
                                & (df.fareAmount >= 1) & (df.fareAmount <= 250)\
                                & (df.tripDistance > 0) & (df.tripDistance <= 200))

filtered_df.createOrReplaceTempView("taxi_dataset")
```

## Analyze data
 As a data analyst, you have a wide range of tools available to help you extract insights from the data. In this part of the tutorial, we will walk through a few useful tools available within Azure Synapse Analytics Notebooks. In this analysis, we want to understand the factors that yield higher taxi tips for our selected period.

###  Apache Spark SQL Magic 
First, we will perform exploratory data analysis by Apache Spark SQL and magic commands with the Synapse Notebook. Once we have our query, we will then visualize the results using the built-in ```chart options``` capability. 

1. Within your notebook, create a new cell and copy the code below. Using this query, we want to understand how the average tip amounts have changed over period we have selected. This query will also help us identify other useful insights, including the minimum/maximum tip amount per day and the average fare amount.
   
```sql
%%sql
SELECT 
    day_of_month
    , MIN(tipAmount) AS minTipAmount
    , MAX(tipAmount) AS maxTipAmount
    , AVG(tipAmount) AS avgTipAmount
    , AVG(fareAmount) as fareAmount
FROM taxi_dataset 
GROUP BY day_of_month
ORDER BY day_of_month ASC
```

2. Once our query finishes running, we can visualize the results by switching to the **chart view**. In this example, we will create a **line chart** by specifying the ```day_of_month``` field as the **key** and ```avgTipAmount``` as the **value**. Once you have made the selections, click **Apply** to refresh your chart. 
   
## Visualize data
In addition to the built-in Notebook charting options, you can also use popular open-source libraries to create your own visualizations. In the following examples, we will use Seaborn and Matplotlib which are commonly used Python libraries for data visualization. 

> [!Note]
> 
> By default, every Azure Synapse Analytics Apache Spark pool contains a set of commonly used and default libraries. You can view the full list of libraries in  the [Azure Synapse Runtime](../spark/apache-spark-version-support.md). documentation. In addition, to make third party or locally-built code available to your applications, you can [install a library](../spark/apache-spark-azure-portal-add-libraries.md) onto one of your Spark Pools.
>

1. To make development easier and less expensive, we will down sample the dataset. We will use the built-in Apache Spark sampling capability. In addition, both Seaborn and Matplotlib require a Pandas dataframe or Numpy array. To get a Pandas dataframe, we will use the ```toPandas()``` command to convert our dataframe.

```python
# To make development easier, faster and less expensive down sample for now
sampled_taxi_df = filtered_df.sample(True, 0.001, seed=1234)

# The charting package needs a Pandas dataframe or numpy array do the conversion
sampled_taxi_pd_df = sampled_taxi_df.toPandas()
```

1. First, we  want to understand the distribution of tips in our dataset. We will use Matplotlib to create a histogram showing the distribution of tip amount and count. Based on the distribution, we can see that tips are skewed towards amounts less than or equal to $10.

```python
# Look at tips by count histogram using Matplotlib

ax1 = sampled_taxi_pd_df['tipAmount'].plot(kind='hist', bins=25, facecolor='lightblue')
ax1.set_title('Tip amount distribution')
ax1.set_xlabel('Tip Amount ($)')
ax1.set_ylabel('Counts')
plt.suptitle('')
plt.show()
```

![Histogram of Tips](./media/apache-spark-machine-learning-mllib-notebook/histogram.png)

1. Next, we want to understand the relationship between the tips for a given trip and the day of the week. We will use Seaborn to create a box plot summarizing the trends for each day of the week. 

```python
# View the distribution of tips by day of week using Seaborn
ax = sns.boxplot(x="day_of_week", y="tipAmount",data=sampled_taxi_pd_df, showfliers = False)
ax.set_title('Tip amount distribution per day')
ax.set_xlabel('Day of Week')
ax.set_ylabel('Tip Amount ($)')
plt.show()

```
![Distribution of tips per day](./media/apache-spark-data-viz/data-analyst-tutorial-per-day.png)

4. Now, another hypothesis that we have may be that there is a positive relationship between the number of passengers and the total taxi tip amount. To verify this relationship, we will run the following code to generate a box plot illustrating the distribution of tips for each passenger count. 
   
```python
# How many passengers tipped by various amounts 
ax2 = sampled_taxi_pd_df.boxplot(column=['tipAmount'], by=['passengerCount'])
ax2.set_title('Tip amount by Passenger count')
ax2.set_xlabel('Passenger count')
ax2.set_ylabel('Tip Amount ($)')
ax2.set_ylim(0,30)
plt.suptitle('')
plt.show()
```
![Box Whisker Plot](./media/apache-spark-machine-learning-mllib-notebook/box-whisker-plot.png)

1. Last, we want to understand the relationship between the fare amount tip amount. Based on the results, we can see that there are several observations where people do not tip. However, we also see a positive relationship between the overall fare and tip amounts.
   
```python
# Look at the relationship between fare and tip amounts

ax = sampled_taxi_pd_df.plot(kind='scatter', x= 'fareAmount', y = 'tipAmount', c='blue', alpha = 0.10, s=2.5*(sampled_taxi_pd_df['passengerCount']))
ax.set_title('Tip amount by Fare amount')
ax.set_xlabel('Fare Amount ($)')
ax.set_ylabel('Tip Amount ($)')
plt.axis([-2, 80, -2, 20])
plt.suptitle('')
plt.show()
```
![Scatter Plot](./media/apache-spark-machine-learning-mllib-notebook/scatter.png)

## Shut down the Spark instance

After you have finished running the application, shut down the notebook to release the resources by closing the tab or select **End Session** from the status panel at the bottom of the notebook.

## See also

- [Overview: Apache Spark on Azure Synapse Analytics](apache-spark-overview.md)
- [Build a machine learning model with Apache SparkML](../spark/apache-spark-machine-learning-mllib-notebook.md)

## Next steps

- [Azure Synapse Analytics](https://docs.microsoft.com/azure/synapse-analytics)
- [Apache Spark official documentation](https://spark.apache.org/docs/latest/)
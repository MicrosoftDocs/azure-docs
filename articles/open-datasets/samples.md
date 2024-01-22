---
title: Example Jupyter notebooks using NOAA data
description: Use example Jupyter notebooks for Azure Open Datasets to learn how to load open datasets and use them to enrich demo data. Techniques include use of Spark and Pandas to process data.
ms.service: open-datasets
ms.topic: sample
author: fbsolo-ms1
ms.author: franksolomon
ms.date: 05/06/2020
---

# Example Jupyter notebooks show how to enrich data with Open Datasets 
The example Jupyter notebooks for Azure Open Datasets show you how to load open datasets and use them to enrich demo data. Techniques include use of Apache Spark and Pandas to process data.

>[!IMPORTANT]
>When working in a non-Spark environment, Open Datasets allows downloading only one month of data at a time with certain classes in order to avoid MemoryError with large datasets.

## Load NOAA Integrated Surface Database (ISD) data 
|Notebook        | Description                                    |
|----------------|------------------------------------------------|
|[Load one recent month of weather data into a Pandas dataframe](https://github.com/Azure/OpenDatasetsNotebooks/blob/master/tutorials/data-access/02-weather-to-pandas-dataframe.ipynb) | Learn how to load historical weather data into your favorite Pandas dataframe. |
|[Load one recent month of weather data into a Spark dataframe](https://github.com/Azure/OpenDatasetsNotebooks/blob/master/tutorials/data-access/01-weather-to-spark-dataframe.ipynb) | Learn how to load historical weather data into your favorite Spark dataframe.  |

## Join demo data with NOAA ISD data 
|Notebook        | Description                                    |
|----------------|------------------------------------------------|
|[Join demo data with weather data - Pandas](https://github.com/Azure/OpenDatasetsNotebooks/blob/master/tutorials/data-join/02-weather-join-in-pandas.ipynb) | Join a 1-month demo dataset of sensor locations with weather readings in a Pandas dataframe.  |
|[Join demo data with weather data – Spark](https://github.com/Azure/OpenDatasetsNotebooks/blob/master/tutorials/data-join/01-weather-join-in-spark.ipynb) | Join a demo dataset of sensor locations with weather readings in a Spark dataframe. |

## Join NYC taxi data with NOAA ISD data 
|Notebook        | Description                                    |
|----------------|------------------------------------------------|
|[Taxi trip data enriched with weather data - Pandas](https://github.com/Azure/OpenDatasetsNotebooks/blob/master/tutorials/data-join/04-nyc-taxi-join-weather-in-pandas.ipynb) | Load NYC green taxi data (over 1 month) and enrich it with weather data in a Pandas dataframe. This example overrides the method `get_pandas_limit` and balances data load performance with the amount of data.|
|[Taxi trip data enriched with weather data – Spark](https://github.com/Azure/OpenDatasetsNotebooks/blob/master/tutorials/data-join/03-nyc-taxi-join-weather-in-spark.ipynb) | Load NYC green taxi data and enrich it with weather data, in Spark dataframe.  |

## Next steps

* [Tutorial: Regression modeling with automated machine learning and an open dataset](../machine-learning/tutorial-auto-train-models.md?context=azure%2fopen-datasets%2fcontext%2fopen-datasets-context)
* [Python SDK for Open Datasets](/python/api/azureml-opendatasets/azureml.opendatasets)
* [Azure Open Datasets catalog](https://azure.microsoft.com/services/open-datasets/catalog/)
* [Create Azure Machine Learning dataset from Open Dataset](how-to-create-azure-machine-learning-dataset-from-open-dataset.md)

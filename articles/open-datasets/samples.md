---
title: Example Jupyter notebooks using a NOAA open dataset
titleSuffix: Azure Open Datasets
description: Use example Jupyter notebooks for Azure Open Datasets to learn how to load open datasets and use them to enrich demo data. Techniques include use of Spark and Pandas to process data.
ms.service: open-datasets
ms.topic: sample
author: cjgronlund
ms.author: cgronlun
ms.date: 05/02/2019
---

# Example Jupyter notebooks show data enrichment from Open Datasets 
The example Jupyter notebooks for Azure Open Datasets show you how to load open datasets and use them to enrich demo data. Techniques include use of Apache Spark and Pandas to process data.

>Note
>When working in a non-Spark environment, Open Datasets allows downloading only one month of data at a time with certain classes in order to avoid MemoryError with large datasets.

## Load NOAA Integrated Surface Database (ISD) data 
|Notebook        | Description                                    |
|----------------|------------------------------------------------|
|[Demo data enriched with NOAA ISD data - Pandas ](https://github.com/Azure/OpenDatasetsNotebooks/blob/master/tutorials/enrich_demo_data.ipynb) | Enrich a demo dataset of sensor locations with weather readings.  |
|[Demo data enriched with NOAA ISD data - Apache Spark](https://github.com/Azure/OpenDatasetsNotebooks/blob/master/tutorials/enrich_demo_data_spark.ipynb) | Enrich a demo dataset of sensor locations with weather readings, and load it into a Spark dataframe. |
| [Demo data enriched with *n* months of NOAA ISD data - Pandas](https://github.com/Azure/OpenDatasetsNotebooks/blob/master/tutorials/enrich_demo_data-N-Months.ipynb) | In this notebook variation, data are limited to `n_months`, a number of months you specify.  |

## Enrich demo data with NOAA ISD data 
|Notebook        | Description                                    |
|----------------|------------------------------------------------|
|[Load one recent month of weather data - Pandas](https://github.com/Azure/OpenDatasetsNotebooks/blob/master/tutorials/NoaaIsdWeather.to_pandas_dataframe.ipynb) | Load NOAA ISD weather data from January 2018 using Pandas.   |
|[Load one recent month of weather data - Apache Spark](https://github.com/Azure/OpenDatasetsNotebooks/blob/master/tutorials/NoaaIsdWeather.to_spark_dataframe.ipynb) | Load NOAA ISD weather data from January 2018 into a Spark dataframe. |

## Enrich NYC taxi data with NOAA ISD data 
|Notebook        | Description                                    |
|----------------|------------------------------------------------|
|[Taxi trip data enriched with weather data ](https://github.com/Azure/OpenDatasetsNotebooks/blob/master/tutorials/Enrich_NycTlcGreen_with_NoaaIsdWeather.ipynb) | Load NYC green taxi data and enrich it with weather data. |
|[Taxi trip data enriched with weather data - *n* months](https://github.com/Azure/OpenDatasetsNotebooks/blob/master/tutorials/Enrich_NycTlcGreen_with_NoaaIsdWeather_Single_LatLong_For_N_Months.ipynb) | Load last *n* months of NYC green taxi data and enrich it with weather data. This example overrides the method `get_pandas_limit`, and balances data load performance with the amount of data. |


## Next steps

* [Tutorial: Regression modeling with automated machine learning and an open dataset](tutorial-opendatasets-automl.md)
* [Python SDK for Open Datasets](https://aka.ms/open-datasets-sdk)

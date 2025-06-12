---  
title: Introduction to machine learning in Microsoft Sentinel data lake (Preview)
titleSuffix: Microsoft Security  
description: Overview and introduction to machine learning using KQL and Jupyter notebooks in the Microsoft Sentinel data lake.
author: EdB-MSFT  
ms.service: microsoft-sentinel  
ms.topic: conceptual
ms.custom: sentinel-graph
ms.date: 06/11/2025
ms.author: edbaynash  

ms.collection: ms-security  
---  

# Introduction to machine learning in the Microsoft Sentinel data lake (Preview)

Machine Learning (ML), a subset of Artificial Intelligence, empowers systems to predict outcomes based solely on training data without explicit programming. This capability is particularly valuable in cybersecurity. ML can identify patterns and relationships in data that may not be immediately apparent to humans and could be challenging to code using conventional programming methods. Threat hunters, detection engineers, and data scientists looking to enhance their cybersecurity measures can leverage ML and the Microsoft Sentinel data lake for advanced analytics, to detect anomalies, predict threats, and enhance overall security measures.  

KQL (Kusto Query Language) and Jupyter notebooks in the Microsoft Sentinel data lake provide powerful tools for performing machine learning tasks, including anomaly detection and time series analysis. This article provides an overview of KQL and Notebooks functions for machine learning in the Microsoft Sentinel data lake.

## Anomaly Insights

Anomaly insights in cybersecurity involve identifying unusual patterns that may indicate a security threat. For example, using Python Notebooks with the VS Code Microsoft Sentinel security extension for anomaly insights, you can perform univariate and multivariate analysis. This method can process anomalies without the need for offline training of a model and online scoring. Similarly, KQL native functions for anomaly insights can perform univariate analysis based on improved seasonal trend composition models, processing anomalies of 50,000 time series in seconds. For example using the `series_decompose_anomalies` function in KQL, you can quickly detect unusual spikes in CPU usage that may indicate a potential security breach. For more information, see [series_decompose_anomalies](/kusto/query/series-decompose-anomalies-function?view=microsoft-sentinel)  

## Time Series Analysis

Time series analysis involves examining data points collected or recorded at specific time intervals to identify trends, cycles, and anomalies. In cybersecurity, time series analysis can be used to monitor network traffic, system performance, and user activity over time. Using the `make-series` operator and `series_fit_line function` in KQL, you can fit a line to a series of data points, analyze network traffic data to identify trends and predict future traffic patterns, helping to detect potential DDoS attacks. For more information, see [series_fit_line](/kusto/query/series-fit-line-function?view=microsoft-sentinel).

## Machine Learning Support in KQL and Notebooks

Microsoft Sentinel data lake provides a platform for creating KQL queries that apply native ML functions and plugins to enhance threat detection. These experiences include time series analysis and anomaly insights. The following native functions and plugins are supported in KQL for time series analysis and anomaly insights:
+ [series_outliers](/kusto/query/series-outliers-function?view=microsoft-sentinel): Detects outliers in time series data by comparing each point to the expected value based on the trend and seasonal components.
+ [series_fit_line](/kusto/query/series-fit-line-function): Fits a line to a series of data points to identify trends and patterns.
+ [series_decompose_anomalies](/kusto/query/series-decompose-anomalies-function): Identifies anomalies in time series data by analyzing its decomposed components.
+ [series_decompose](/kusto/query/series-decompose-function): Decomposes a time series into seasonal, trend, and residual components.

For more information on KQL ML functions, see the following articles:
+ [Anomaly diagnosis for root cause analysis](/kusto/query/anomaly-diagnosis?view=microsoft-sentinel)
+ [Anomaly detection and forecasting](/kusto/query/anomaly-detection?view=microsoft-sentinel)
+ [Time series analysis](/kusto/query/time-series-analysis?view=microsoft-sentinel)

Plugins are additional functions that extend the capabilities of KQL for machine learning tasks. The following plugins are available: 

+ [autocluster()](/kusto/query/autocluster-plugin): Automatically detects clusters in data. 
+ [basket()](/kusto/query/basket-plugin): Finds frequent patterns of attributes in the data and returns the patterns that pass a frequency threshold in that data.
+ [diffpatterns()](/kusto/query/diffpatterns-plugin): Compares two datasets of the same structure and finds patterns of discrete attributes (dimensions) that characterize differences between the two datasets.
+ [diffpatterns_text()](/kusto/query/diffpatterns-text-plugin): Compares two datasets of string values and finds text patterns that characterize differences between the two datasets.


The Jupyter notebook experience in the VS Code Microsoft Sentinel extension supports various Python-based ML libraries, including:

+ [synapseML 1.0.9 ](https://pypi.org/project/synapseml/1.0.9): SynapseML is a unified framework for large-scale machine learning that integrates with Apache Spark, enabling users to build and deploy ML models at scale.
+ [keras 2.15.0 ](https://pypi.org/project/keras/2.15.0 ): Keras is a deep learning API written in Python, running on top of the machine learning platform TensorFlow.
+ [lightgbm 4.2.0](https://pypi.org/project/lightgbm/4.2.0): LightGBM is a gradient boosting framework that uses tree-based learning algorithms, designed for distributed and efficient training of large datasets.
+ [pytorch 2.0.1](https://pypi.org/project/torch/2.0.1): PyTorch is an open-source machine learning library widely used for deep learning applications, providing a flexible and dynamic computational graph.
+ [scikit-learn 1.3.2](https://pypi.org/project/scikit-learn/1.3.2): Scikit-learn is a popular machine learning library in Python that provides simple and efficient tools for data mining and data analysis, built on NumPy, SciPy, and matplotlib.
+ [statsmodels 0.14](https://pypi.org/project/statsmodels/0.14): Statsmodels is a Python library that provides classes and functions for estimating and testing statistical models, including linear regression, time series analysis, and hypothesis testing.
+ [tensorflow 2.15.0](https://pypi.org/project/tensorflow/2.15.0): TensorFlow is an open-source machine learning framework originally developed by Google, widely used for building and deploying machine learning models, particularly in deep learning applications.
+ [xgboost 2.0.3](https://pypi.org/project/xgboost/2.0.3): XGBoost is an optimized gradient boosting library designed for speed and performance, widely used in machine learning competitions and real-world applications.



These libraries enable users to build and deploy machine learning models for advanced analytics, anomaly detection, and predictive modeling.

Machine Learning offers powerful tools for enhancing cybersecurity measures. By leveraging KQL and Notebooks, detection engineers, data scientists, and threat hunters can perform advanced analytics for anomaly detection, time series analysis, and more. These capabilities enable organizations to proactively identify and mitigate potential security threats, ensuring a safer digital environment.

# Project Anomaly Finder (Private)

This doc repository serves as a landing page for Project Anomaly Finder of Cognitive Service Private Preview and introduces the document hierarchy to help you better understand Anomaly Finder. Because of the nature of private preview, your Azure subscription needs to be manually whitelisted to create anomaly finder resource in Azure portal by us, please contact kenshoteam@microsoft.com for whitelisting if you have not done so.

## What is Anomaly Finder?

Anomaly Finder enables you to monitor data over time and detect anomalies with machine learning. Anomaly Finder adapts to your unique data by automatically applying the right statistical model regardless of industry, scenario, or data volume. Use a time series as input, the Anomaly Finder API returns whether a data point is an anomaly, determines the expected value, and upper and lower bounds for visualization. 

To get a high-level understanding, refer to [Overview](overview.md). 

## Quick demo

If you have 5 minutes and want to see a demo, we have a web hosted Jupyter notebook to let you run the sample code and see how the APIs work. Please click [https://notebooks.azure.com/AzureAnomalyDetection/projects/anomalyfinder](https://notebooks.azure.com/AzureAnomalyDetection/projects/anomalyfinder) and complete the following steps
1.	Sign in
2.	Clone
3.	In your cloned project space, click “Run on free compute”
4.	Open one of the notebook, for example, Anomaly Finder API Example Private Preview (Batch Method).ipynb
5.	Fill in the key in cell containing:  subscription_key = '' #Here you have to paste your primary key. You can get the key following the instructions on [obtaining a subscription key](How-to/get-subscription-key.md)
6.	In the Notebook main menu, Cell->run all


## Tutorials

Several example projects are also provided to help you try Anomaly Finder APIs. All the projects are available on GitHub, you can download them to your local box and start your exploration. 

* [python-app](tutorials/python-tutorial.md)
* [C# app](tutorials/csharp-tutorial.md)
* [Java app](tutorials/java-tutorial.md)
* [JavaScript app](tutorials/javascript-tutorial.md)


## Quick starts with Snippets

We have provided information and code samples in different programming languages to help you quickly get started using the Anomaly Finder API within 10 minutes. This makes the task of getting anomaly results of your time series data easy. 

### Detect anomalies in entire time series:
* [cURL](quickstarts/curl.md)
* [C#](quickstarts/csharp.md)
* [Java](quickstarts/java.md)
* [Python](quickstarts/python.md)
* [PHP](quickstarts/php.md)
* [Ruby](quickstarts/ruby.md)
* [Javascript](quickstarts/javascript.md)

### Detect anomalies for latest point:
* [cURL](quickstarts/curl-latest.md)
* [C#](quickstarts/csharp-latest.md)
* [Java](quickstarts/java-latest.md)
* [Python](quickstarts/python-latest.md)
* [PHP](quickstarts/php-latest.md)
* [Ruby](quickstarts/ruby-latest.md)
* [Javascript](quickstarts/javascript-latest.md)



## How-to Guide

A step-by-step guide to help you try Anomaly Finder, the How-to guide includes how to apply for an Azure account and creat an Anomaly Finder resource in your subscription. 

* [Obtain subscription key](How-to/get-subscription-key.md)


# Contributing

This project welcomes contributions and suggestions.  Most contributions require you to agree to a
Contributor License Agreement (CLA) declaring that you have the right to, and actually do, grant us
the rights to use your contribution. For details, visit https://cla.microsoft.com.

When you submit a pull request, a CLA-bot will automatically determine whether you need to provide
a CLA and decorate the PR appropriately (e.g., label, comment). Simply follow the instructions
provided by the bot. You will only need to do this once across all repos using our CLA.

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/).
For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or
contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.

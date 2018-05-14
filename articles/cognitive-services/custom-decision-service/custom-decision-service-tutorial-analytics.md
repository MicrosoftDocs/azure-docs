---
title: Offline Analytics - Azure Cognitive Services | Microsoft Docs
description: A tutorial for offline analytics in Azure Custom Decision Service, a cloud-based API for contextual decision-making.
services: cognitive-services
author: slivkins
manager: slivkins
ms.service: cognitive-services
ms.topic: article
ms.date: 05/08/2018
ms.author: slivkins;marcozo;alekh;marossi;rafah.aboul
---
# Offline Analytics

This tutorial addresses the offline analytics capability in Custom Decision Service. The tutorial starts with [setting up](#setting-up) your working environment and downloading the log file. Next, it visualizes the performance of your system on the [performance visualization dashboard](#performance-visualization). Then it uses your logged data to [optimize a policy for choosing actions](#offline-optimization) and [answer the "what if" questions](#counterfactual-evaluation).

## Setting up

You'll be working on your local machine. Set up your working environment as follows:

- Install [Vowpal Wabbit](https://github.com/JohnLangford/vowpal_wabbit/wiki) and add it to your path. Use the [msi installer](https://github.com/eisber/vowpal_wabbit/releases) under windows, [get the source code](https://github.com/JohnLangford/vowpal_wabbit/releases) on other platforms. 
- Install [Python 3](https://www.python.org/download/releases/3.0/) and add it to your path. We recommend the 64-bit version to handle large files.
  - Make sure [NumPy package](http://www.numpy.org/) is installed along with Python. Use a package manager of your choice.
  - Install the azure-storage-blob package from [Microsoft Azure Storage Library for Python](https://github.com/Azure/azure-storage-python). Use [installation option 1](https://github.com/Azure/azure-storage-python#option-1-via-pypi).
- Clone the open-source repo for the Custom Decision Service, [mwt-ds](https://github.com/Microsoft/mwt-ds) on GitHub.
  - Enter your Azure storage connection string in *mwt-ds/DataScience/ds.config*, using *AppID: ConnectionString* format. You can specify multiple AppIDs.

Download the logged data. Go to `mwt-ds/DataScience` and run `LogDownloader.py` with relevant arguments. For example, use this command to download all data for January 1-7, 2018, to folder `d:\data`.

```cmd 
python LogDownloader.py -a AppId -l d:\data -s 2018-01-01 -e 2018-01-07 -o 4 --create_gzip
```
The output is gzipped, which is required for the data analysis and visualization tools described next. Refer to the [LogDownloader reference](custom-decision-service-log-downloader-reference.md) for a detailed syntax.

>[!TIP]
>Logged data may be very large for a high-volume application. We recommend an end-to-end practice run with a small date range. Use `--dry_run` option to find out how much data would have been downloaded, without actually downloading it.

## Performance visualization

## Offline optimization

## Counterfactual evaluation

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

This tutorial addresses *offline analytics*: analyzing the logged data without additional (and potentially costly) online experiments. The tutorial explains how to use the provided tools to (i) [visualize the performance of your system](#performance-visualization), and (ii) [optimize a policy for choosing actions](#offline-optimization) and estimate its performance.

The logged data is fundamentally incomplete. Every time Custom Decision Service chooses an action, it can't record the reward/outcome for the other actions it could have chosen. Typically, these rewards/outcomes can't be deduced from the observations. This issue, known as "partial feedback", is an essential difficulty for policy optimization and performance estimation. See [this blog post](https://www.microsoft.com/en-us/research/blog/real-world-interactive-learning-cusp-enabling-new-class-applications/) and [this white paper](https://github.com/Microsoft/mwt-ds/raw/master/images/MWT-WhitePaper.pdf) for background on the underlying machine learning methodology.

## Setting up

You'll be working on your local machine. Set up your working environment as follows:

- Install [Vowpal Wabbit](https://github.com/JohnLangford/vowpal_wabbit/wiki) and add it to your path. Use the [msi installer](https://github.com/eisber/vowpal_wabbit/releases) under windows, [get the source code](https://github.com/JohnLangford/vowpal_wabbit/releases) on other platforms.
- Install [Python 3](https://www.python.org/download/releases/3.0/) and add it to your path. We recommend the 64-bit version to handle large files.
  - Make sure [NumPy package](http://www.numpy.org/) is installed along with Python. Use a package manager of your choice.
  - Install the azure-storage-blob package from [Microsoft Azure Storage Library for Python](https://github.com/Azure/azure-storage-python). Use [installation option 1](https://github.com/Azure/azure-storage-python#option-1-via-pypi).
- Clone the open-source repo for the Custom Decision Service, [mwt-ds](https://github.com/Microsoft/mwt-ds) on GitHub.
- Go to `mwt-ds\DataScience`
  - Enter your Azure storage connection string in `ds.config`, as `AppID:ConnectionString`. You can specify multiple AppIDs.
  - You will use three files in this folder: `LogDownloader.py`, `dashboard_utils.py`, and `index.html`.

Download the logged data using a python script `LogDownloader.py`. For example, use this command to download all data for January 1-7, 2018, in folder `d:\data`, overwriting if needed.

```cmd 
python LogDownloader.py -a AppId -l d:\data -s 2018-01-01 -e 2018-01-07 -o 2 --create_gzip
```

The script creates a single file, as long as the Custom Decision Service has been run with the same setting throughout the specified date range. The file is gzipped, which is required for the data analysis and visualization tools described next. See the [LogDownloader reference](custom-decision-service-log-downloader-reference.md) for a detailed syntax.

The script may create several files if the Custom Decision Service settings have been changed during the specified date range.

>[!TIP]
>Logged data may be very large for a high-volume application. We recommend an end-to-end practice run with a small date range. Use `--dry_run` option to find out which files you'd be downloading, and their sizes, without actually downloading them.

## Performance visualization

You can use HTML-based dashboard to visualize how the rewards of the Custom Decision Service evolve over time.

First, pre-process a raw log file into a `.dash` data file used by the dashboard.

```cmd
python dashboard_utils.py -f d:\data\raw_log.gz -o d:\dashboard\data.dash
```

Copy `index.html` from `mwt-ds\DataScience\` to the folder with the `.dash` file, and open it with any browser.

## Offline optimization

Optimize a policy for choosing actions using a python script `Experimentation.py`. The basic usage is

```cmd
python Experimentation.py -f D:\data\raw_log.gz
```

The script outputs the five best policies that it finds. It estimates the performance of each policy had this policy been deployed on the same time range as the logged data. The output is appended to file `mwt-ds\DataScience\experiments.csv`.

The script builds on machine learning algorithms from [Vowpal Wabbit](https://github.com/JohnLangford/vowpal_wabbit/wiki), and additionally attempts to optimize learning parameters and feature selection. See the [machine learning tutorial](#custom-decision-service-tutorial-ml) for background on feature specification in Custom Decision Service, and the [reference](#custom-decision-service-experimentation-reference) for a detailed description of the script and the options.
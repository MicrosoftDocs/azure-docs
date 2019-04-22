---
title: LogDownloader - Custom Decision Service
titlesuffix: Azure Cognitive Services
description: Download log files that are produced by Azure Custom Decision Service.
services: cognitive-services
author: marco-rossi29
manager: nitinme

ms.service: cognitive-services
ms.subservice: custom-decision-service
ms.topic: conceptual
ms.date: 05/09/2018
ms.author: marossi
---

# LogDownloader

Download log files that are produced by Azure Custom Decision Service and generate the *.gz* files that are used by Experimentation.

## Prerequisites

- Python 3: Installed and on your path. We recommend the 64-bit version to handle large files.
- The *Microsoft/mwt-ds* repository: [Clone the repo](https://github.com/Microsoft/mwt-ds).
- The *azure-storage-blob* package: For installation details, go to [Microsoft Azure Storage Library for Python](https://github.com/Azure/azure-storage-python#option-1-via-pypi).
- Enter your Azure storage connection string in *mwt-ds/DataScience/ds.config*: Follow the *my_app_id: my_connectionString* template. You can specify multiple `app_id`. When you run `LogDownloader.py`, if the input `app_id` is not found in `ds.config`, `LogDownloader.py` uses the `$Default` connection string.

## Usage

Go to `mwt-ds/DataScience` and run `LogDownloader.py` with the relevant arguments, as detailed in the following code:

```cmd
python LogDownloader.py [-h] -a APP_ID -l LOG_DIR [-s START_DATE]
                        [-e END_DATE] [-o OVERWRITE_MODE] [--dry_run]
                        [--create_gzip] [--delta_mod_t DELTA_MOD_T]
                        [--verbose] [-v VERSION]
```

### Parameters

| Input | Description | Default |
| --- | --- | --- |
| `-h`, `--help` | Show the help message and exit. | |
| `-a APP_ID`, `--app_id APP_ID` | The app ID (that is, the Azure Storage blob container name). | Required |
| `-l LOG_DIR`, `--log_dir LOG_DIR` | The base directory for downloading data (a subfolder is created).  | Required |
| `-s START_DATE`, `--start_date START_DATE` | The downloading start date (included), in *YYYY-MM-DD* format. | `None` |
| `-e END_DATE`, `--end_date END_DATE` | The downloading end date (included), in *YYYY-MM-DD* format. | `None` |
| `-o OVERWRITE_MODE`, `--overwrite_mode OVERWRITE_MODE` | The overwrite mode to use. | |
| | `0`: Never overwrite; ask the user whether blobs are currently used. | Default |
| | `1`: Ask the user how to proceed when the files have different sizes or when the blobs are currently being used. | |
| | `2`: Always overwrite; download currently used blobs. | |
| | `3`: Never overwrite, and append if the size is larger, without asking; download currently used blobs. | |
| | `4`: Never overwrite, and append if the size is larger, without asking; skip currently used blobs. | |
| `--dry_run` | Print which blobs would have been downloaded, without downloading. | `False` |
| `--create_gzip` | Create a *gzip* file for Vowpal Wabbit. | `False` |
| `--delta_mod_t DELTA_MOD_T` | The time window, in seconds, for detecting whether a file is currently in use. | `3600` sec (`1` hour) |
| `--verbose` | Print more details. | `False` |
| `-v VERSION`, `--version VERSION` | The log downloader version to use. | |
| | `1`: For uncooked logs (only for backward compatibility). | Deprecated |
| | `2`: For cooked logs. | Default |

### Examples

For a dry run of downloading all the data in your Azure Storage blob container, use the following code:
```cmd
python LogDownloader.py -a your_app_id -l d:\data --dry_run
```

To download only logs created since January 1, 2018 with `overwrite_mode=4`, use the following code:
```cmd
python LogDownloader.py -a your_app_id -l d:\data -s 2018-1-1 -o 4
```

To create a *gzip* file merging all the downloaded files, use the following code:
```cmd
python LogDownloader.py -a your_app_id -l d:\data -s 2018-1-1 -o 4 --create_gzip
```

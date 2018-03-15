---
title: Azure Custom Decision Service LogDownloader reference | Microsoft Docs
description: A guide for Azure Custom Decision Service LogDownloader.
services: cognitive-services
author: marco-rossi29
manager: marco-rossi29

ms.service: cognitive-services
ms.topic: article
ms.date: 01/18/2018
ms.author: marossi
---

# Custom Decision Service LogDownloader reference

LogDownloader is used to download log files produced by the Decision Service and to generate `.gz` files used by Experimentation.

## Prerequisites
- Python 3 (installed and on your path - 64-bit version is recommended to handle large files)
- `Microsoft/mwt-ds` repository (clone from [here](https://github.com/Microsoft/mwt-ds))
- `azure-storage-blob` package (installation details [here](https://github.com/Azure/azure-storage-python#option-1-via-pypi))
- Enter your Azure storage connection string in `mwt-ds/DataScience/ds.config` following the template `my_app_id: my_connectionString`. Multiple `app_id` can be specified. If the `app_id` is not found in the list, the `$Default` connection string is used.

## Usage
Navigate into `mwt-ds/DataScience` and run `LogDownloader.py` with the relevant arguments, as detailed in the following.

```cmd
python LogDownloader.py [-h] -a APP_ID -l LOG_DIR [-s START_DATE]
                        [-e END_DATE] [-o OVERWRITE_MODE] [--dry_run]
                        [--create_gzip] [--delta_mod_t DELTA_MOD_T]
                        [--verbose] [-v VERSION]
```

### Parameters
| Input | Description | Default |
| --- | --- | --- |
| `-h`, `--help` | show help message and exit | |
| `-a APP_ID`, `--app_id APP_ID` | app id (i.e., Azure storage blob container name) | Required |  
| `-l LOG_DIR`, `--log_dir LOG_DIR` | base dir to download data (a subfolder will be created)  | Required |  
| `-s START_DATE`, `--start_date START_DATE` | downloading start date (included) - format `YYYY-MM-DD` | `None` |  
| `-e END_DATE`, `--end_date END_DATE` | downloading end date (included) - format `YYYY-MM-DD` | `None` |  
| `-o OVERWRITE_MODE`, `--overwrite_mode OVERWRITE_MODE` | overwrite mode to use | |  
| | `0`: never overwrite - ask user if blobs are currently used | default | | 
| | `1`: ask user if files have different sizes and if blobs are currently used | |  
| | `2`: always overwrite - download currently used blobs | |  
| | `3`: never overwrite and append if larger size, without asking - download currently used blobs | |  
| | `4`: never overwrite and append if larger size, without asking - skip currently used blobs | |  
| `--dry_run` | print which blobs would have been downloaded, without downloading | `False` |  
| `--create_gzip` | create gzip file for Vowpal Wabbit | `False` |  
| `--delta_mod_t DELTA_MOD_T` | time window in sec to detect if a file is currently in use | `3600` sec (`1` hour) |  
| `--verbose` | print more details | `False` |  
| `-v VERSION`, `--version VERSION` | version of log downloader to use | |  
| | `1`: for uncooked logs (only for backward compatibility) | deprecated |  
| | `2`: for cooked logs | default |  


### Examples
For a dry run of downloading all the data in your Azure Storage Blob container use:
```cmd
python LogDownloader.py -a your_app_id -l d:\data --dry_run
```

To download only logs from Jan. 1 2018 and using `owerwrite_mode=4` use:
```cmd
python LogDownloader.py -a your_app_id -l d:\data -s 2018-1-1 -o 4
```

To create a gzip file for all the files downloaded:
```cmd
python LogDownloader.py -a your_app_id -l d:\data -s 2018-1-1 -o 4 --create_gzip
```


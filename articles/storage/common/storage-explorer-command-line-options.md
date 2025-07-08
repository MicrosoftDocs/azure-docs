---
title: Azure Storage Explorer command-line options
description: Documentation of Azure Storage Explorer start-up command-line options
services: storage
author: jinglouMSFT
ms.service: azure-storage
ms.subservice: storage-common-concepts
ms.topic: article
ms.date: 02/24/2021
ms.author: jinglou
ms.reviewer: cralvord,richardgao
# Customer intent: "As a developer troubleshooting Azure Storage Explorer, I want to start the application with specific command-line options, so that I can customize the environment and gather detailed debug information to resolve issues effectively."
---

# Azure Storage Explorer command-line options

Microsoft Azure Storage Explorer has a set of command-line options that can be added when starting the application. Most of the command-line options are for debugging or troubleshooting purposes.

## Command-line options

| Option                       | Description
|:-----------------------------|:-----------
|`--debug`<br/>`--prod`        | Start the application in debug or production mode. In debug mode, the local attachment data is stored in the application's local storage and isn't encrypted. Hidden properties are displayed in the Properties panel for selected resource nodes. Log verbosity level is set to print debug messages revealing Storage Explorer's internal setup logic. The default value is `--prod`.
|`--lang`                      | Start the application with a given language. For example, `--lang="zh-Hans"`.
|`--disable-gpu`               | Start the application without GPU acceleration.
|`--auto-open-dev-tools`       | Let the application open the developer tools window as soon as the browser window shows. This option is useful when you want to hit a break point at a line in the start-up code of the browser window.
|`--verbosity`                 | Set the verbosity level of Storage Explorer logging. Supported verbosity levels include `debug`, `verbose`, `info`, `warn`, `error`, and `silent`. For example, `--verbosity=verbose`. When in production mode, the default verbosity level is `info`. When in debug mode, the log verbosity level is `debug`.
|`--log-dir`                   | Set the directory to save log files. For example, `--log-dir=path_to_a_directory`.
|`--ignore-certificate-errors` | Ignore certificate errors. This flag can be useful when you need to work in a trusted proxy environment with nonpublic Certificate Authority. We recommend you to [use system proxy (preview)](./storage-explorer-network.md#use-system-proxy) in such proxy environments and only set this flag if the system proxy doesn't work.

An example of starting Storage Explorer with custom command-line options

```shell
./MicrosoftAzureStorageExplorer --lang=en --auto-open-dev-tools
```

> [!NOTE]
> These command line options might change in new Storage Explorer versions.

## When to use command-line options

Some command-line options can be used to customize Storage Explorer. For those options that have corresponding user settings, such as `--lang`. We recommend using the user settings instead of using the command-line option.

The other command-line options can be useful for debugging and troubleshooting. If you run into a problem in Storage Explorer, reproducing the problem in debug mode can help us get more detailed information to investigate.

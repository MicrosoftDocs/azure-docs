---
title: Using the Azure CLI on Windows | Microsoft Docs
description: Using the Azure CLI on Windows
services: virtual-machines-windows
documentationcenter: virtual-machines
author: neilpeterson
manager: timlt
editor: tysonn
tags: azure-service-management

ms.assetid:
ms.service: virtual-machines-windows
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: vm-windows
ms.workload: infrastructure
ms.date: 02/14/2017
ms.author: nepeters
---

# Using the Azure CLI on Windows

The Azure Command Line Interface (CLI) provides a command line and scripting environment for creating and managing Azure resources. The Azure CLI is available for macOS, Linux, and Windows operating systems. Across these operating systems, the CLI commands are identical, however operating system specific scripting syntax can differ.

This document details the ways that the Azure CLI can be installed and run on Windows and details syntactical considerations for each. For in-depth Azure CLI documentation see, [Azure CLI documentation]( https://docs.microsoft.com/en-us/cli/azure/overview).

## Windows Subsystem for Linux

The Windows Subsystem for Linux (WSL) provides an Ubuntu Linux environment on Windows 10 Anniversary and later editions. When enabled, WSL provides a native Bash experience, which can be used for creating and running Azure CLI scripts. Because WSL provides a native Bash experience, Azure CLI scripts can be shared between macOS, Linux, and Windows without modification.

To use the Azure CLI in WSL, complete the following.

|Task | Instructions |
|---|---|
| Enable WSL | [Install WSL documentation ](https://msdn.microsoft.com/en-us/commandline/wsl/install_guide) |
| Install the Azure CLI |[Install the CLI on WSL/Ubuntu 14.04](https://docs.microsoft.com/en-us/cli/azure/install-az-cli2#ubuntu)|

## PowerShell

The Azure CLI can be run natively in Windows. In this configuration, the Azure CLI package is installed on the Windows operating system, and commands can be run from PowerShell. In this configuration, Azure CLI commands and scripts can be run on any supported version of Windows, however platform specific scripting syntax is required. Because of this, scripts cannot necessarily be shared between macOS, Linux, and Windows without modification.

To use the Azure CLI on Windows, install the package using these instructions, [Install the CLI on Windows](https://docs.microsoft.com/en-us/cli/azure/install-az-cli2#windows).

## Docker Image

When using Docker for Windows, a Docker image can be started that includes the Azure CLI. This image is based off of Linux, and includes a native Bash experience.  When using Docker for Windows and the Azure CLI image, scripts to be shared between macOS, Linux, and Windows. 

To use the Azure CLI on Docker for Windows, ensure that Docker for Windows is running and run the following command.

```bash
docker run -it azuresdk/azure-cli-python:latest bash
```

Once completed, a Bash session will start that is preloaded with the Azure CLI tools.

## Next Steps

[CLI sample for Azure virtual machines](../linux/cli-samples.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)

[CLI samples for Azure Web Apps](../../app-service-web/app-service-cli-samples.md)

[CLI samples for Azure SQL](../../sql-database/sql-database-cli-samples.md)

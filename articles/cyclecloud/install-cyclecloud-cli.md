---
title: Install Azure CycleCloud Command Line Interface | Microsoft Docs
description: Install the Azure CycleCloud CLI
services: azure cyclecloud
author: KimliW
ms.prod: cyclecloud
ms.devlang: na
ms.topic: conceptual
ms.date: 08/01/2018
ms.author: adjohnso
---

# Install Azure CycleCloud CLI

The Azure CycleCloud Command Line Interface (CLI) provides console access to the CycleCloud application, making functions seen in the GUI available from the command line. It can be used to control CycleCloud and CycleCloud Clusters directly or via script. CycleCloud's [pogo tool](pogo-overview.md) is packaged with the CLI, and will be installed at the same time.

## Pre-Requisites

The CycleCloud CLI requires an existing installation of Python 2.7. While most Linux and Mac systems already have a valid Python 2.7 installation, you will need to [install it for Windows](https://docs.python-guide.org/en/latest/starting/install/win/).

## CycleCloud CLI Installer File

The CLI installer is distributed as part of the CycleCloud installation package and can be found in the `cycle_server/tools/` sub-directory. After installing CycleCloud, the CLI installer is also available in the `tools/` sub-directory of the CycleCloud installation directory, and from the About page.

## CycleCloud CLI Installation for Linux

Extract the contents of `cyclecloud-cli.zip` to a temporary directory:

```azurecli-interactive
cd /tmp
unzip /opt/cycle_server/tools/cyclecloud-cli.zip
```

This will create a sub-directory named `cyclecloud-cli-installer-<VERSION>`. To complete the installation, run the `install.sh` script within the directory:

``` script
cd /tmp/cyclecloud-cli-installer*
./install.sh
```

The CycleCloud CLI will be installed to `${HOME}/bin`. Optionally, after installing the CLI, add the `${HOME}/bin` directory to the PATH environment variable in your profile.

## CycleCloud CLI Installation for Windows

In Windows Explorer, copy the CLI installer zip file to a temporary directory such as `Downloads` or `$env:TMP`. Right click on the copy of `cyclecloud-cli.zip` and select **Extract All**. This will create a sub-folder named `cyclecloud-cli-installer-<VERSION>`.

Inside the `cyclecloud-cli-installer-<VERSION>` sub-folder, you will find a PowerShell script named `install.ps1`. Double click on the `install.ps1` script to complete the CLI installation.

The CycleCloud CLI should now be available in the system PATH for new PowerShell or Command Prompt sessions.

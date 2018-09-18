---
title: How to configure Azure Machine Learning Workbench to work with an IDE?  | Microsoft Docs
description: A guide to configuring Azure Machine Learning Workbench to work with your IDE.  
services: machine-learning
author: svankam
ms.author: svankam
manager: mwinkle
ms.reviewer: jmartens, jasonwhowell, mldocs
ms.service: machine-learning
ms.component: core
ms.workload: data-services
ms.topic: article
ms.date: 02/01/2018

ROBOTS: NOINDEX
---

# How to configure Azure Machine Learning Workbench to work with an IDE 

[!INCLUDE [workbench-deprecated](../../../includes/aml-deprecating-preview-2017.md)]

Azure Machine Learning Workbench can be configured to work with popular Python IDEs (Integrated Development Environment). It enables a smooth data science development experience moving between data preparation, code authoring, run tracking and operationalization. Currently the supported IDEs are:
- Microsoft Visual Studio Code 
- JetBrain PyCharm 

## Configure workbench
1. Click on the **File** menu in the top left corner of the app. 
2. Select the **Configure Project IDE** option from the flyout 
3. Type in `VS Code` or `PyCharm` in the **Name** field (the name is arbitrary)
4. Enter the location to the IDE executable (complete with the executable name and extension) in **Execution Path**

### Default install path for Visual Studio Code  

* Windows 32-bit - `C:\Program Files (x86)\Microsoft VS Code\Code.exe`
* Windows 64-bit - `C:\Program Files\Microsoft VS Code\Code.exe`
* macOS - select the .app path, for example `/Applications/Visual Studio Code.app`, and the app appends the rest of the path for you. The full path to the executable by default is `/Applications/Visual Studio Code.app/Contents/Resources/app/bin/code`. If you have executed the `Shell Command: Install 'code' command in PATH` command in VS Code, then you can also reference the VS Code script at `/usr/local/bin/code`

### Default install path for PyCharm 

* Windows 32-bit - `C:\Program Files (x86)\JetBrains\PyCharm Community Edition 2017.2.1\bin\pycharm.exe`. 
* Windows 64-bit - `C:\Program Files\JetBrains\PyCharm Community Edition 2017.2.1\bin\pycharm64.exe`.
* macOS - select the .app path, for example “/Applications/PyCharm CE.app”, and the app appends the rest of the path for you. The full path to the executable by default is `/Applications/PyCharm CE.app/Contents/MacOS/pycharm`. You may also find PyCharm at the bin folder, `/usr/local/bin/charm`

## Open project in IDE 
Once the configuration is complete, you can open an Azure Machine Learning project by opening the **File** menu in Azure Machine Learning Workbench, then click **Open Project (<IDE_Name>)**. This action opens the current active project in the configured IDE. _Note: If you are not in a project, the **Open Project (<IDE_Name>)** will be disabled._

## Configuring the integrated terminal in Visual Studio Code

### Windows 
We have overridden the default shell to be cmd instead of PowerShell. On clicking on **Open Project (<IDE_Name>)**, you see a prompt: 

_Do you allow shell: `C:\windows\System32\cmd.exe` (defined as a workspace setting) to be launched in the terminal?_

Answer `yes` to allow configuring the shell to work seamlessly with Azure ML Workbench command-line interface.

### Mac
To run an `az` command using Visual Studio Code's integrated terminal on Mac, you need to manually set the `PATH` to be the same value as `PATH` in the project's `.vscode/settings.json` file under the key `terminal.integrated.env.osx`. You can do so by running the following command in the terminal: `PATH=<PATH in .vscode/settings>`

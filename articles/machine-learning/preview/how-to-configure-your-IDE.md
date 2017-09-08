---
title: How to configure Azure Machine Learning Workbench to work with an IDE?  | Microsoft Docs
description: A guide to configuring Azure Machine Learning Workbench to work with your IDE.  
services: machine-learning
author: svankam
ms.author: svankam
manager: mwinkle
ms.reviewer: garyericson, jasonwhowell, mldocs
ms.service: machine-learning
ms.workload: data-services
ms.topic: article
ms.date: 09/05/2017
---

# How to configure Azure Machine Learning Workbench to work with an IDE? 

## Open Project in IDE
Azure Machine Learning Workbench can be configured to work with an IDE. This enables a seamless data science development experience moving between data prep, coding, run tracking and operationalization. Currently the supported IDEs are:
- Microsoft Visual Studio Code 
- JetBrain PyCharm 

## Steps to configure :  
1. Click on the **File** menu in the top left corner of the Azure Machine Learning Workbench app. 
2. Select the **Configure Project IDE** option from the flyout 
3. Type in `VS Code` or `PyCharm` in the **Name** field (the name is arbitrary)
4. Enter the location to the IDE executable (complete with the executable name and extension) in **Execution Path**

### Default Install Paths for Visual Studio Code  

* Windows 32bit - “C:\Program Files (x86)\Microsoft VS Code\Code.exe”. 
* Windows 64bit - “C:\Program Files\Microsoft VS Code\Code.exe”
* Mac - “/Applications/Visual Studio Code.app/Contents/Resources/app/bin/code”.If you have executed the “Shell Command: Install 'code' command in PATH” command in VS Code, then you can also reference the VS Code script at “/usr/local/bin/code”

### Default Install Paths for PyCharm 

* Windows 32bit - “C:\Program Files (x86)\JetBrains\PyCharm Community Edition 2017.2.1\bin\pycharm.exe”. 
* Windows 64bit - “C:\Program Files\JetBrains\PyCharm Community Edition 2017.2.1\bin\pycharm64.exe”.
* Mac - “/Applications/PyCharm CE.app/Contents/MacOS/pycharm”. You may also find PyCharm at the bin folder, “/usr/local/bin/charm”

## Open Project in IDE 
Once the configuration is complete, you can open a Azure Machine Learning Project in the IDE by opening the **File** menu, and selecting **Open Project (** *IDE_Name* **)**

>Note: Upon opening the embedded terminal, you will get a prompt _Do you allow shell: "C:\windows\System32\cmd.exe" (defined as a workspace setting) to be launched in the terminal?_. This is because we are configuring the shell to work seamlessly with Azure ML Workbench command line interface. 

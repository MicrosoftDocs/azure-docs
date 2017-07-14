---
title: Use the Azure Data Lake Tools to local run and local debug for Visual Studio Code | Microsoft Docs
description: 'Learn how to use the Azure Data Lake Tools for Visual Studio Code to create, test, and run U-SQL scripts. '
Keywords: VScode,Azure Data Lake Tools,Local run,Local debug,Local Debug,preview storage file,upload to storage path
services: data-lake-analytics
documentationcenter: ''
author: jejiang
manager: DJ
editor: jejiang

ms.assetid: dc9b21d8-c5f4-4f77-bcbc-eff458f48de2
ms.service: data-lake-analytics
ms.devlang: 
ms.topic: article
ms.tgt_pltfrm: 
ms.workload: big-data
ms.date: 07/14/2017
ms.author: jejiang
---

# Use the Azure Data Lake Tools to local run and local debug for Visual Studio Code
Learn how to use the Azure Data Lake Tools for Visual Studio Code (VSCode) to set up USQL localRun environment, local run, and local debug.

## Prerequisites
Install Azure Data Lake Tool and use the Azure Data Lake Tools for Visual Studio Code. See [Use the Azure Data Lake Tools for Visual Studio Code](data-lake-analytics-data-lake-tools-for-vscode.md)

## Set up USQL LocalRun Environment

1. Open the command palette by pressing **CTRL+SHIFT+P**, and enter **ADL: Download LocalRun Dependency** to download the packages.  

   ![DownloadLocalRun](./media/data-lake-analytics-data-lake-tools-for-vscode-local-run-and-debug/DownloadLocalRun.png)

2. Install Dependency Packages
- locate the Dependency packages by checking the log outputs, eg:  
`C:\Users\xxx\.vscode\extensions\usqlextpublisher.usql-vscode-ext-x.x.x\LocalRunDependency
`  
  ![LocateDependency](./media/data-lake-analytics-data-lake-tools-for-vscode-local-run-and-debug/LocateDependencyPath.png)

- Install BuildTools  

  ![InstallBuildTools](./media/data-lake-analytics-data-lake-tools-for-vscode-local-run-and-debug/InstallBuildTools.png)
- Install Win10SDK 10240  

  ![InstallWin10SDK](./media/data-lake-analytics-data-lake-tools-for-vscode-local-run-and-debug/InstallWin10SDK.png)
- Setup environment variable, Set the **SCOPE_CPP_SDK** environment variable to:  
`C:\Users\xxx\.vscode\extensions\usqlextpublisher.usql-vscode-ext-x.x.x\LocalRunDependency\CppSDK_3rdparty
`  
Make sure to restart OS to make the environment variable settings take effect.  

  ![ConfigSCOPE_CPP_SDK](./media/data-lake-analytics-data-lake-tools-for-vscode-local-run-and-debug/ConfigScopeCppSDk.png)

## Start Local Run Server and Submit USQL job to local run Server
If the first use local run, you need to set up Environment to **Download Localrun Dependency**.
1. Press CTRL+SHIFT+P to open Command Palette and enter **Start Local Run Service**.
2. The cmd console shows up. For first time users, you need to enter 3, then input a local folder path for your data input and output. For other options, you can simply use the default value. 

   ![Data Lake Tools for Visual Studio Code local run cmd](./media/data-lake-analytics-data-lake-tools-for-vscode-local-run-and-debug/data-lake-tools-for-vscode-local-run-cmd.png)
3. Press CTRL+SHIFT+P to open Command Palette and enter **Submit Job**.
4. Select **Local** to submit.
  ![Data Lake Tools for Visual Studio Code select local](./media/data-lake-analytics-data-lake-tools-for-vscode-local-run-and-debug/data-lake-tools-for-vscode-select-local.png)
5. After submitting a U-SQL job to local, submission information is shown in output window in VSCode. You can view the submission details by clicking jobUrl. The job submission status can be viewed in the CMD console. And enter 7 can also be got running status in CMD console.

   ![Data Lake Tools for Visual Studio Code local run output](./media/data-lake-analytics-data-lake-tools-for-vscode-local-run-and-debug/data-lake-tools-for-vscode-local-run-result.png)
   ![Data Lake Tools for Visual Studio Code local run cmd status](./media/data-lake-analytics-data-lake-tools-for-vscode-local-run-and-debug/data-lake-tools-for-vscode-localrun-cmd-status.png) 



## Debug USQL job on local Server
#### Prerequisites: 
- Before debugging, you need to install C# for Visual studio Code. Search it in **EXTENSIONS**.
- If the first use local run, you need to set up Environment to **Download Localrun Dependency**.

  ![Data Lake Tools for Visual Studio Code install vscodeCsharp](./media/data-lake-analytics-data-lake-tools-for-vscode-local-run-and-debug/data-lake-tools-for-vscode-install-ms-vscodecsharp.png)

1. Press CTRL+SHIFT+P to open Command Palette and enter **Start Local Run Service**.
2. The cmd window shows up. Make sure the **DataRoot** is set.
3. Set a breakpoint in code behind.
4. Back to script editor, press CTRL+SHIFT+P to open Command Palette and enter **Local Debug**.

When the program execution reaches the breaking point, you see a DEBUG CONSOLE in the bottom pane. You also see the view parameter and variable information, call stack in the left pane. Click the Step Over icon to proceed to the next line of code. Then you can further step through the code. 
![Data Lake Tools for Visual Studio Code local debug result](./media/data-lake-analytics-data-lake-tools-for-vscode-local-run-and-debug/data-lake-tools-for-vscode-local-debug-result.png)


## Next steps:
- For using the Azure Data Lake Tools for Visual Studio Code, see [Use the Azure Data Lake Tools for Visual Studio Code](data-lake-analytics-data-lake-tools-for-vscode.md)
- For the getting started information on Data Lake Analytics, see [Tutorial: get started with Azure Data Lake Analytics](data-lake-analytics-get-started-portal.md).
- For information on using Data Lake Tools for Visual Studio, see [Tutorial: develop U-SQL scripts using Data Lake Tools for Visual Studio](data-lake-analytics-data-lake-tools-get-started.md).
- For the information on developing assemblies, see [Develop U-SQL assemblies for Azure Data Lake Analytics jobs](data-lake-analytics-u-sql-develop-assemblies.md).
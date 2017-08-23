---
title: Azure Data Lake Tools - U-SQL Local Run and Local Debug with Visual Studio Code | Microsoft Docs
description: 'Learn how to use the Azure Data Lake Tools for Visual Studio Code to local run and local debug.'
Keywords: VScode,Azure Data Lake Tools,Local run,Local debug,Local Debug,preview storage file,upload to storage path
services: data-lake-analytics
documentationcenter: ''
author: jejiang
manager: DJ
editor: jejiang
tags: azure-portal

ms.assetid: dc9b21d8-c5f4-4f77-bcbc-eff458f48de2
ms.service: data-lake-analytics
ms.devlang: 
ms.topic: article
ms.tgt_pltfrm: 
ms.workload: big-data
ms.date: 07/14/2017
ms.author: jejiang
---

# U-SQL local run and local debug with Visual Studio Code

## Prerequisites
- Azure Data Lake Tool for Visual Studio Code. For instructions,  see [Use the Azure Data Lake Tools for Visual Studio Code](data-lake-analytics-data-lake-tools-for-vscode.md)
- C# for Visual Studio Code (if you want to perform U-SQL Local Debug).

   ![Data Lake Tools for Visual Studio Code install vscodeCsharp](./media/data-lake-analytics-data-lake-tools-for-vscode-local-run-and-debug/data-lake-tools-for-vscode-install-ms-vscodecsharp.png)
   
   > [!NOTE]
   > The U-SQL local run and debug features currently only support windows users. 


## Set up U-SQL local run environment

1. Open the command palette by pressing **CTRL+SHIFT+P**, and enter **ADL: Download LocalRun Dependency** to download the packages.  

   ![DownloadLocalRun](./media/data-lake-analytics-data-lake-tools-for-vscode-local-run-and-debug/DownloadLocalRun.png)

2. Locate the dependency packages from the path shown in the output panel below, then install BuildTools and install Win10SDK 10240. For example:  
`C:\Users\xxx\.vscode\extensions\usqlextpublisher.usql-vscode-ext-x.x.x\LocalRunDependency
`  
  ![LocateDependency](./media/data-lake-analytics-data-lake-tools-for-vscode-local-run-and-debug/LocateDependencyPath.png)

- Install BuildTools – Follow the wizard instructions to install.   

  ![InstallBuildTools](./media/data-lake-analytics-data-lake-tools-for-vscode-local-run-and-debug/InstallBuildTools.png)
- Install Win10SDK 10240 - Follow the installation instructions to install.  

  ![InstallWin10SDK](./media/data-lake-analytics-data-lake-tools-for-vscode-local-run-and-debug/InstallWin10SDK.png)
3. Setup environment variable, Set the **SCOPE_CPP_SDK** environment variable to:  
`C:\Users\xxx\.vscode\extensions\usqlextpublisher.usql-vscode-ext-x.x.x\LocalRunDependency\CppSDK_3rdparty
`  
Make sure to restart OS to make the environment variable settings take effect.  

   ![ConfigSCOPE_CPP_SDK](./media/data-lake-analytics-data-lake-tools-for-vscode-local-run-and-debug/ConfigScopeCppSDk.png)

## Start local run service and submit U-SQL job to local account 
For first time user, you are prompted to **ADL: Download Localrun Dependency** packages if not yet.
1. Press **CTRL+SHIFT+P** to open Command Palette and enter **ADL: Start Local Run Service**.
2. Accept the EULA for the first time. 

   ![Accept the EULA ](./media/data-lake-analytics-data-lake-tools-for-vscode-local-run-and-debug/AcceptEULA.png)   
3. The cmd console shows up. For first time users, you need to enter 3, then input a local folder path for your data input and output. For other options, you can simply use the default value. 

   ![Data Lake Tools for Visual Studio Code local run cmd](./media/data-lake-analytics-data-lake-tools-for-vscode-local-run-and-debug/data-lake-tools-for-vscode-local-run-cmd.png)
4. Press CTRL+SHIFT+P to open Command Palette and enter **ADL: Submit Job**, then select **Local** to submit job to your local account.

   ![Data Lake Tools for Visual Studio Code select local](./media/data-lake-analytics-data-lake-tools-for-vscode-local-run-and-debug/data-lake-tools-for-vscode-select-local.png)
5. After job submission, you can see the submission details by clicking jobUrl in the output window. You can also view the job submission status from the CMD console, enter 7 in the CMD console if you want to know more job details.

   ![Data Lake Tools for Visual Studio Code local run output](./media/data-lake-analytics-data-lake-tools-for-vscode-local-run-and-debug/data-lake-tools-for-vscode-local-run-result.png)
   ![Data Lake Tools for Visual Studio Code local run cmd status](./media/data-lake-analytics-data-lake-tools-for-vscode-local-run-and-debug/data-lake-tools-for-vscode-localrun-cmd-status.png) 



## Start local debug for U-SQL job  
For first time user, you are prompted to **ADL: Download Localrun Dependency** packages if not yet.
  
1. Press **CTRL+SHIFT+P** to open Command Palette and enter **ADL:Start Local Run Service**. The cmd window shows up. Make sure the **DataRoot** is set.
3. Set a breakpoint in your C# code behind.
4. Back to script editor, press **CTRL+SHIFT+P** to open Command Palette and enter **Local Debug** to start your local debug service.

![Data Lake Tools for Visual Studio Code local debug result](./media/data-lake-analytics-data-lake-tools-for-vscode-local-run-and-debug/data-lake-tools-for-vscode-local-debug-result.png)


## Next steps
- For using the Azure Data Lake Tools for Visual Studio Code, see [Use the Azure Data Lake Tools for Visual Studio Code](data-lake-analytics-data-lake-tools-for-vscode.md).
- For the getting started information on Data Lake Analytics, see [Tutorial: get started with Azure Data Lake Analytics](data-lake-analytics-get-started-portal.md).
- For information on using Data Lake Tools for Visual Studio, see [Tutorial: develop U-SQL scripts using Data Lake Tools for Visual Studio](data-lake-analytics-data-lake-tools-get-started.md).
- For the information on developing assemblies, see [Develop U-SQL assemblies for Azure Data Lake Analytics jobs](data-lake-analytics-u-sql-develop-assemblies.md).
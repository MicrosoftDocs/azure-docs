
---
title: 'Azure Data Lake Tools: U-SQL local run and local debug with Visual Studio Code | Microsoft Docs'
description: 'Learn how to use Azure Data Lake Tools for Visual Studio Code to local run and local debug.'
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

# U-SQL local run and local debug for Windows with Visual Studio Code
In this document, you learn how to run U-SQL jobs on a local development machine to speed up early coding phases or to debug code locally in Visual Studio Code. For instructions on Azure Data Lake Tool for Visual Studio Code, see [Use Azure Data Lake Tools for Visual Studio Code](data-lake-analytics-data-lake-tools-for-vscode.md). 


## Set up the U-SQL local run environment

1. Select Ctrl+Shift+P to open the command palette, and then enter **ADL: Download Local Run Dependency** to download the packages.  

   ![Download the ADL LocalRun Dependency packages](./media/data-lake-analytics-data-lake-tools-for-vscode-local-run-and-debug/DownloadLocalRun.png)

2. Locate the dependency packages from the path shown in the **Output** pane, and then install BuildTools and Win10SDK 10240. Here is an example path:  
`C:\Users\xxx\AppData\Roaming\LocalRunDependency` 

   ![Locate the dependency packages](./media/data-lake-analytics-data-lake-tools-for-vscode-local-run-and-debug/LocateDependencyPath.png)

   2.1 To install **BuildTools**, click visualcppbuildtools_full.exe in the LocalRunDependency folder, then follow the wizard instructions.   

    ![Install BuildTools](./media/data-lake-analytics-data-lake-tools-for-vscode-local-run-and-debug/InstallBuildTools.png)

   2.2 To install **Win10SDK 10240**, click sdksetup.exe in the LocalRunDependency/Win10SDK_10.0.10240_2 folder, then follow the wizard instructions.  

    ![Install Win10SDK 10240](./media/data-lake-analytics-data-lake-tools-for-vscode-local-run-and-debug/InstallWin10SDK.png)

3. Set up the environment variable. Set the **SCOPE_CPP_SDK** environment variable to:  
`C:\Users\XXX\AppData\Roaming\LocalRunDependency\CppSDK_3rdparty`  


## Start the local run service and submit the U-SQL job to a local account 
For the first-time user, use **ADL: Download Local Run Dependency** to download local run packages, if you have not [set up U-SQL local run environment](#set-up-the-u-sql-local-run-environment).

1. Select Ctrl+Shift+P to open the command palette, and then enter **ADL: Start Local Run Service**.   
2. Select **Accept** to accept the Microsoft Software License Terms for the first time. 

   ![Accept the Microsoft Software License Terms](./media/data-lake-analytics-data-lake-tools-for-vscode-local-run-and-debug/AcceptEULA.png)   
3. The cmd console opens. For first-time users, you need to enter **3**, and then locate the local folder path for your data input and output. For other options, you can use the default values. 

   ![Data Lake Tools for Visual Studio Code local run cmd](./media/data-lake-analytics-data-lake-tools-for-vscode-local-run-and-debug/data-lake-tools-for-vscode-local-run-cmd.png)
4. Select Ctrl+Shift+P to open the command palette, enter **ADL: Submit Job**, and then select **Local** to submit the job to your local account.

   ![Data Lake Tools for Visual Studio Code select local](./media/data-lake-analytics-data-lake-tools-for-vscode-local-run-and-debug/data-lake-tools-for-vscode-select-local.png)
5. After you submit the job, you can view the submission details. To view the submission details, select **jobUrl** in the **Output** window. You can also view the job submission status from the cmd console. Enter **7** in the cmd console if you want to know more job details.

   ![Data Lake Tools for Visual Studio Code local run output](./media/data-lake-analytics-data-lake-tools-for-vscode-local-run-and-debug/data-lake-tools-for-vscode-local-run-result.png)
   ![Data Lake Tools for Visual Studio Code local run cmd status](./media/data-lake-analytics-data-lake-tools-for-vscode-local-run-and-debug/data-lake-tools-for-vscode-localrun-cmd-status.png) 


## Start a local debug for the U-SQL job  
For the first-time user:

1. Use **ADL: Download Local Run Dependency** to download local run packages, if you have not [set up U-SQL local run environment](#set-up-the-u-sql-local-run-environment).
2. Install .NET Core SDK 2.0 as suggested in the message box, if not installed.
 
  ![reminder installs Dotnet](./media/data-lake-analytics-data-lake-tools-for-vscode-local-run-and-debug/remind-install-dotnet.png)
3. Install C# for Visual Studio Code as suggested in the message box if not installed. Click **Install** to continue, and then restart VSCode.

    ![Reminder to install C#](./media/data-lake-analytics-data-lake-tools-for-vscode-local-run-and-debug/install-csharp.png)

Follow steps below to perform local debug:
  
1. Select Ctrl+Shift+P to open the command palette, and then enter **ADL: Start Local Run Service**. The cmd console opens. Make sure that the **DataRoot** is set.
2. Set a breakpoint in your C# code-behind.
3. Back to script editor, right-click and select **ADL: Local Debug**.
    
   ![Data Lake Tools for Visual Studio Code local debug result](./media/data-lake-analytics-data-lake-tools-for-vscode-local-run-and-debug/data-lake-tools-for-vscode-local-debug-result.png)


## Next steps
- For using Azure Data Lake Tools for Visual Studio Code, see [Use Azure Data Lake Tools for Visual Studio Code](data-lake-analytics-data-lake-tools-for-vscode.md).
- For getting started information on Data Lake Analytics, see [Tutorial: Get started with Azure Data Lake Analytics](data-lake-analytics-get-started-portal.md).
- For information about Data Lake Tools for Visual Studio, see [Tutorial: Develop U-SQL scripts by using Data Lake Tools for Visual Studio](data-lake-analytics-data-lake-tools-get-started.md).
- For the information on developing assemblies, see [Develop U-SQL assemblies for Azure Data Lake Analytics jobs](data-lake-analytics-u-sql-develop-assemblies.md).

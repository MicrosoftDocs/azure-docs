---
title: Debug U-SQL jobs | Microsoft Docs
description: 'Learn how to debug a U-SQL failed vertex using Visual Studio.'
services: data-lake-analytics
documentationcenter: ''
author: saveenr
manager: jhubbard
editor: cgronlun

ms.assetid: bcd0b01e-1755-4112-8e8a-a5cabdca4df2
ms.service: data-lake-analytics
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: big-data
ms.date: 09/02/2016
ms.author: saveenr

---
# Debug user-defined C# code for failed U-SQL jobs

U-SQL provides an extensibility model using C#, so you can write your code to add functionality such as a custom extractor or reducer. To learn more, see [U-SQL programmability guide](https://docs.microsoft.com/en-us/azure/data-lake-analytics/data-lake-analytics-u-sql-programmability-guide#use-user-defined-functions-udf). In practice any code may need debugging, and big data systems may only provide limited runtime debugging information such as log files.

Azure Data Lake Tools for Visual Studio provides a feature called **Failed Vertex Debug**, which lets you clone a failed job from the cloud to your local machine for debugging. The local clone captures the entire cloud environment, including any input data and user code.

The following video demonstrates Failed Vertex Debug in Azure Data Lake Tools for Visual Studio.

> [!VIDEO https://e0d1.wpc.azureedge.net/80E0D1/OfficeMixProdMediaBlobStorage/asset-d3aeab42-6149-4ecc-b044-aa624901ab32/b0fc0373c8f94f1bb8cd39da1310adb8.mp4?sv=2012-02-12&sr=c&si=a91fad76-cfdd-4513-9668-483de39e739c&sig=K%2FR%2FdnIi9S6P%2FBlB3iLAEV5pYu6OJFBDlQy%2FQtZ7E7M%3D&se=2116-07-19T09:27:30Z&rscd=attachment%3B%20filename%3DDebugyourcustomcodeinUSQLADLA.mp4]
>

> [!NOTE]
> Visual Studio requires the following two updates, if they are not already installed: [Microsoft Visual C++ 2015 Redistributable Update 3](https://www.microsoft.com/en-us/download/details.aspx?id=53840) and the
> [Universal C Runtime for Windows](https://www.microsoft.com/download/details.aspx?id=50410).

## Download failed vertex to local machine

When you open a failed job in Azure Data Lake Tools for Visual Studio, you see a yellow alert bar with detailed error messages in the error tab.

1. Click **Download** to download all the required resources and input streams. If the download doesn't complete, click **Retry**.

2. Click **Open** after the download completes to generate a local debugging environment. A new Visual Studio instance with a debugging solution is automatically created and opened.

![Azure Data Lake Analytics U-SQL debug visual studio download vertex](./media/data-lake-analytics-debug-u-sql-jobs/data-lake-analytics-download-vertex.png)

Jobs may include code-behind source files or registered assemblies, and these two types have different debugging scenarios.

- [Debug a failed job with code-behind](#debug-job-failed-with-code-behind)
- [Debug a failed job with assemblies](#debug-job-failed-with-assemblies)


## Debug job failed with code-behind

If a U-SQL job fails, and the job includes user code (typically named `Script.usql.cs` in a U-SQL project), that source code is imported into the debugging solution.  From there you can use the Visual Studio debugging tools (watch, variables, etc.) to troubleshoot the problem.

> [!NOTE]
> Before debugging, be sure to check **Common Language Runtime Exceptions** in the Exception Settings window (**Ctrl + Alt + E**).

![Azure Data Lake Analytics U-SQL debug visual studio setting](./media/data-lake-analytics-debug-u-sql-jobs/data-lake-analytics-clr-exception-setting.png)

1. Press **F5** to run the code-behind code. It will run until it is stopped by an exception.

2. Open the `ADLTool_Codebehind.usql.cs` file and set breakpoints, then press **F5** to debug the code step by step.

    ![Azure Data Lake Analytics U-SQL debug exception](./media/data-lake-analytics-debug-u-sql-jobs/data-lake-analytics-debug-exception.png)

## Debug job failed with assemblies

If you use registered assemblies in your U-SQL script, the system can't get the source code automatically. In this case, manually add the assemblies' source code files to the solution.

### Configure the solution

1. Right-click **Solution 'VertexDebug' > Add > Existing Project...** to find the assemblies' source code and add the project to the debugging solution.

    ![Azure Data Lake Analytics U-SQL debug add project](./media/data-lake-analytics-debug-u-sql-jobs/data-lake-analytics-add-project-to-debug-solution.png)

2. Right-click **LocalVertexHost > Properties** in the solution and copy the **Working Directory** path.

3. Right-Click **assembly source code project > Properties**, select the **Build** tab at left, and paste the copied path as **Output > Output path**.

    ![Azure Data Lake Analytics U-SQL debug set pdb path](./media/data-lake-analytics-debug-u-sql-jobs/data-lake-analytics-set-pdb-path.png)

4. Press **Ctrl + Alt + E**, check **Common Language Runtime Exceptions** in Exception Settings window.

### Start debug

1. Right-click **assembly source code project > Rebuild** to output .pdb files to the `LocalVertexHost` working directory.

2. Press **F5** and the project will run until it is stopped by an exception. You may see the following warning message, which you can safely ignore. It can take up to a minute to get to the debug screen.

    ![Azure Data Lake Analytics U-SQL debug visual studio warning](./media/data-lake-analytics-debug-u-sql-jobs/data-lake-analytics-visual-studio-u-sql-debug-warning.png)

3. Open your source code and set breakpoints, then press **F5** to debug the code step by step.

You can also use the Visual Studio debugging tools (watch, variables, etc.) to troubleshoot the problem.

> [!NOTE]
> Rebuild the assembly source code project each time after you modify the code to generate updated .pdb files.

After debugging, if the project completes successfully the output window shows the following message:

```
The Program 'LocalVertexHost.exe' has exited with code 0 (0x0).
```

![Azure Data Lake Analytics U-SQL debug succeed](./media/data-lake-analytics-debug-u-sql-jobs/data-lake-analytics-debug-succeed.png)

## Resubmit the job

Once you have completed debugging, resubmit the failed job.

1. For jobs with code-behind solutions, copy your C# code into the code-behind source file (typically `Script.usql.cs`).
2. For jobs with assemblies, register the updated .dll assemblies into your ADLA database:
    1. From Server Explorer or Cloud Explorer, expand the **ADLA account > Databases** node.
    2. Right-click **Assemblies** and register your new .dll assemblies with the ADLA database:
    ![Azure Data Lake Analytics U-SQL debug register assembly](./media/data-lake-analytics-debug-u-sql-jobs/data-lake-analytics-register-assembly.png)
3. Resubmit your job.

## Next steps

- [U-SQL programmability guide](data-lake-analytics-u-sql-programmability-guide.md)
- [Develop U-SQL User-defined operators for Azure Data Lake Analytics jobs](data-lake-analytics-u-sql-develop-user-defined-operators.md)
- [Tutorial: develop U-SQL scripts using Data Lake Tools for Visual Studio](data-lake-analytics-data-lake-tools-get-started.md)

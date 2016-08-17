<properties 
   pageTitle="Debug U-SQL jobs | Microsoft Azure" 
   description="Learn how to debug U-SQL failed vertex using Visual Studio. " 
   services="data-lake-analytics" 
   documentationCenter="" 
   authors="mumian" 
   manager="paulettm" 
   editor="cgronlun"/>
 
<tags
   ms.service="data-lake-analytics"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="big-data" 
   ms.date="07/26/2016"
   ms.author="jgao"/>



#Debug U-SQL jobs 

Learn how to debug failed U-SQL jobs that are caused by bugs inside the user code using the Azure Data Lake Visual Studio tools. 
The Data Lake Visual Studio tool allows users to download compiled code and necessary vertex data from  cluster to trace and debug failed jobs .

>[AZURE.NOTE] Visual Studio may hang or crash if you don’t have the following two windows upgrades: [Microsoft Visual C++ 2015 Redistributable Update 2](https://www.microsoft.com/download/details.aspx?id=51682), 
[Universal C Runtime for Windows](https://www.microsoft.com/download/details.aspx?id=50410&wa=wsignin1.0).


##Prerequisites
-	Have gone through the [Get started](data-lake-analytics-data-lake-tools-get-started.md) article.

## Create and configure debug projects

When you open a failed job in Data Lake Visual Studio tool, you will get an alert. The detailed error info will be shown in the error tab and the yellow alert bar on the top of the window. 

![Azure Data Lake Analytics U-SQL debug visual studio download vertex](./media/data-lake-analytics-debug-u-sql-jobs/data-lake-analytics-download-vertex.png)

**To download vertex and create a debug solution**

1.	Open a failed U-SQL job in Visual Studio.
2.	Click **Download** to download all the required resources and input streams. Click **Retry** if the download failed.
3.	Click **Open** after the download is completed to create a local debug project. A new Visual Studio solution called **VertexDebug** with an empty project called **LocalVertexHost** will be created.

If user defined operators are used in U-SQL code behind (Script.usql.cs), you must create a Class Library C# project with the user defined operators code, and include the project in the VertexDebug Solution.
If you have registered .dll assemblies to your Data Lake Analytics database, you must add the source code of the assemblies to the VertexDebug Solution.
 

**To configure the project**

1.	From Solution explorer, right-click **LocalVertexHost**, and then click **Properties**.
2.	Set the Output path as LocalVertexHost project working directory path. You can get LocalVertexHost project Working Directory path through LocalVertexHost properties.
3.	Build your C# project in order to put the .pdb file into the LocalVertexHost project Working Directory, or you can copy the .pdb file to this folder manually.
4.	In **Exception Settings**, check Common Language Runtime Exceptions:

![Azure Data Lake Analytics U-SQL debug visual studio setting](./media/data-lake-analytics-debug-u-sql-jobs/data-lake-analytics-clr-exception-setting.png)
 
##Debug the job

After you have created a debug solution by downloading the vertex and have configured the environment, you can start debug your U-SQL code.

1.	From Solution Explorer, right-click the **LocalVertexHost** project, point to **Debug**, and then click **Start new instance**. The LocalVertexHost must be set as the Startup project. You may see the following message for the first time which you can ignore. It can take up to one minute to get to the debug screen.
 
    ![Azure Data Lake Analytics U-SQL debug visual studio warning](./media/data-lake-analytics-debug-u-sql-jobs/data-lake-analytics-visual-studio-u-sql-debug-warning.png)

4.	Use Visual Studio based debugging experience (watch, variables, etc.) to troubleshoot the problem. 
5.	After you have identified an issue, fix the code, and then rebuild the C# project before testing it again until all the problems are resolved. After the debug has been completed successfully, the output window showing the following message 

        The Program ‘LocalVertexHost.exe’ has exited with code 0 (0x0).
 
##Re-submit the job

After you have completed debugging your U-SQL code, you can resubmit the failed job.

1. Register new .dll assemblies to your ADLA database.

    1.	From Server Explorer/Cloud Explorer in Data Lake Visual Studio Tool, expand the **Databases** node 
    2.	Right-click Assemblies to Register assemblies. 
    3.	Register your new .dll assemblies to the ADLA database.
 
2.	Or copy your C# code to script.usql.cs--C# code behind file.
3.	Re-submit your job.

##Next Steps

- [Tutorial: Get started with Azure Data Lake Analytics U-SQL language](data-lake-analytics-u-sql-get-started.md)
- [Tutorial: develop U-SQL scripts using Data Lake Tools for Visual Studio](data-lake-analytics-data-lake-tools-get-started.md)
- [Develop U-SQL User defined operators for Azure Data Lake Analytics jobs](data-lake-analytics-u-sql-develop-user-defined-operators.md)

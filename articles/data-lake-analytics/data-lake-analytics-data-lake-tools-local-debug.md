---
title: Debug Azure Data Lake Analytics code locally
description: Learn how to use Azure Data Lake Tools for Visual Studio to debug U-SQL jobs on your local workstation.
ms.reviewer: whhender
ms.service: data-lake-analytics
ms.topic: how-to
ms.date: 01/27/2023
---
# Debug Azure Data Lake Analytics code locally

[!INCLUDE [retirement-flag](includes/retirement-flag.md)]

You can use Azure Data Lake Tools for Visual Studio to run and debug Azure Data Lake Analytics code on your local workstation, just as you can in the Azure Data Lake Analytics service.

Learn how to [run U-SQL script on your local machine](data-lake-analytics-data-lake-tools-local-run.md).

## Debug scripts and C# assemblies locally

You can debug C# assemblies without submitting and registering them to the Azure Data Lake Analytics service. You can set breakpoints in both the code-behind file and in a referenced C# project.

### Debug local code in a code-behind file

1. Set breakpoints in the code-behind file.
2. Select **F5** to debug the script locally.

> [!NOTE]
   > The following procedure works only in Visual Studio 2015. In older Visual Studio versions, you might need to manually add the **PDB** files.  
   >
   >

### Debug local code in a referenced C# project

1. Create a C# assembly project, and build it to generate the output **DLL** file.
2. Register the **DLL** file by using a U-SQL statement:

   ```sql
   CREATE ASSEMBLY assemblyname FROM @"..\..\path\to\output\.dll";
   ```
   
3. Set breakpoints in the C# code.
4. Select **F5** to debug the script by referencing the C# **DLL** file locally.


## Next steps

- For an example of a more complex query, see [Analyze website logs using Azure Data Lake Analytics](data-lake-analytics-analyze-weblogs.md).
- To view job details, see [Use Job Browser and Job View for Azure Data Lake Analytics jobs](data-lake-analytics-data-lake-tools-view-jobs.md).
- To use the vertex execution view, see [Use the Vertex Execution View in Data Lake Tools for Visual Studio](data-lake-analytics-data-lake-tools-use-vertex-execution-view.md).

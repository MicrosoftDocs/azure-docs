---
title: Debug Azure Data Lake Analytics code locally | Microsoft Docs
description: 'Learn how to use Azure Data Lake Tools for Visual Studio to debug U-SQL jobs on your local workstation.'
services: data-lake-analytics
documentationcenter: ''
author: yanancai
manager: jhubbard
editor: cgronlun

ms.assetid: 66dd58b1-0b28-46d1-aaae-43ee2739ae0a
ms.service: data-lake-analytics
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: big-data
ms.date: 07/03/2018
ms.author: yanacai

---
# Debug Azure Data Lake Analytics code locally

You can use Azure Data Lake Tools for Visual Studio to run and debug your Azure Data Lake Analytics code on your workstation, just as you can in the Azure Data Lake service.

Learn [how to run U-SQL script on your local machine](data-lake-analytics-data-lake-tools-local-run.md).

## Debug scripts and C# assemblies locally

You can debug C# assemblies without submitting and registering it to Azure Data Lake Analytics Service. You can set breakpoints in both the code behind file and in a referenced C# project.

### To debug local code in code behind file

1. Set breakpoints in the code behind file.
2. Press F5 to debug the script locally.

> [!NOTE]
   > The following procedure only works in Visual Studio 2015. In older Visual Studio you may need to manually add the pdb files.  
   >
   >

### To debug local code in a referenced C# project

1. Create a C# Assembly project, and build it to generate the output dll.
2. Register the dll using a U-SQL statement:

        CREATE ASSEMBLY assemblyname FROM @"..\..\path\to\output\.dll";
        
3. Set breakpoints in the C# code.
4. Press F5 to debug the script with referencing the C# dll locally.


## Next steps

- To see a more complex query, see [Analyze website logs using Azure Data Lake Analytics](data-lake-analytics-analyze-weblogs.md).
- To view job details, see [Use Job Browser and Job View for Azure Data Lake Analytics jobs](data-lake-analytics-data-lake-tools-view-jobs.md).
- To use the vertex execution view, see [Use the Vertex Execution View in Data Lake Tools for Visual Studio](data-lake-analytics-data-lake-tools-use-vertex-execution-view.md).

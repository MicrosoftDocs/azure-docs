---
title: Develop U-SQL assemblies for Azure Data Lake Analytics jobs | Microsoft Docs
description: 'Learn how to develop assemblies to be used and reused in Data Lake Analytics jobs. '
services: data-lake-analytics
documentationcenter: ''
author: jejiang
manager: jhubbard
editor: cgronlun

ms.service: data-lake-analytics
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: big-data
ms.date: 11/30/2016
ms.author: jejiang

---
# Develop U-SQL assemblies for Azure Data Lake Analytics jobs
Learn how to turn code-behind into assemblies to be used and reused in Data Lake Analytics jobs. 

U-SQL makes it easy to add your own custom code in .Net languages, such as C#, VB.Net or F#. You can even deploy your own runtime to support other languages.

The easiest way to use custom code is to use the Data Lake Tools for Visual Studio’s code-behind capabilities. For more information, see [Tutorial: develop U-SQL scripts using Data Lake Tools for Visual Studio](data-lake-analytics-data-lake-tools-get-started.md). There are a few drawbacks of using code-behind:

- The source code gets uploaded for every script submission.
- code-behind cannot be shared with other jobs.

To address these drawbacks, you can turn code-behind into assemblies, and register the assemblies to the Data Lake Analytics catalog.

## Prerequisites
* Visual Studio 2017, Visual Studio 2015, Visual Studio 2013 update 4, or Visual Studio 2012 with Visual C++ Installed
* Microsoft Azure SDK for .NET version 2.5 or above.  Install it using the Web platform installer or Visual Studio Installer
* A Data Lake Analytics account.  See [Get Started with Azure Data Lake Analytics using Azure portal](data-lake-analytics-get-started-portal.md).
* Go through the [Get started with Azure Data Lake Analytics U-SQL Studio](data-lake-analytics-u-sql-get-started.md) tutorial.
* Connect to Azure.
* Upload the source data, see [Get started with Azure Data Lake Analytics U-SQL Studio](data-lake-analytics-u-sql-get-started.md). 

## Develop assemblies for U-SQL

**To create and submit a U-SQL job**

1. From the **File** menu, click **New**, and then click **Project**.
2. Expand **Installed**, **Templates**, **Azure Data Lake**, **U-SQL(ADLA)**, select the **Class Library (For U-SQL Application)** template, and then click **OK**.
3. Write your code in Class1.cs.  The following is a code sample.

        using Microsoft.Analytics.Interfaces;

        namespace USQLApplication_codebehind
        {
            [SqlUserDefinedProcessor]
            public class MyProcessor : IProcessor
            {
                public override IRow Process(IRow input, IUpdatableRow output)
                {
                    output.Set(0, input.Get<string>(0));
                    output.Set(0, input.Get<string>(0));
                    return output.AsReadOnly();
                }
            }
        }
4. Click the **Build** menu, and then click **Build Solution** to create the dll.

## Register assemblies

See [Use Data Lake Analytics(U-SQL) catalog](data-lake-analytics-use-u-sql-catalog.md).


## Use the assemblies

See [Use the Azure Data Lake Tools for Visual Studio Code](data-lake-analytics-data-lake-tools-for-vscode.md).

## See also
* [Get started with Data Lake Analytics using PowerShell](data-lake-analytics-get-started-powershell.md)
* [Get started with Data Lake Analytics using the Azure portal](data-lake-analytics-get-started-portal.md)
* [Use Data Lake Tools for Visual Studio for developing U-SQL applications](data-lake-analytics-data-lake-tools-get-started.md)
* [Use Data Lake Analytics(U-SQL) catalog](data-lake-analytics-use-u-sql-catalog.md)
* [Use the Azure Data Lake Tools for Visual Studio Code](data-lake-analytics-data-lake-tools-for-vscode.md)
---
title: How to troubleshoot the U-SQL job failures because of .Net 4.7.2 changes
description: 'Troubleshoot U-SQL job failures because of the upgrade to .Net 4.7.2.'
services: data-lake-analytics
author: guyhay
ms.author: guyhay
ms.reviewer: jasonwhowell

ms.service: data-lake-analytics
ms.topic: conceptual
ms.workload: big-data
ms.date: 10/11/2019
---
# Test your Azure Data Lake Analytics code

Azure Data Lake Analytics is upgrading from .NET Framework v4.5.2 to .NET Framework v4.7.2 during the month of October 2019. This change has a small risk of introducing breaking changes if you use custom assemblies that use .NET libraries. 

The upgrade from .NET Framework 4.5.2 to version 4.7.2 means that the .NET Framework deployed in a U-SQL vertex will now always be 4.7.2.  There isn't a side-by-side option for .NET Framework versions. 

After the upgrade to .NET 4.7.2, the system’s managed code will run as version 4.7.2, user provided libraries such as the U-SQL assemblies will run in the backwards-compatible mode appropriate for the version the assembly has been generated for. This means that if your assembly DLLs was generated for version 4.5.2, the deployed framework will treat them as 4.5.2 libraries, providing (with a few exceptions) 4.5.2 semantics. It also means that you can use U-SQL custom assemblies that make use of version 4.7.2 features, if you target the .NET Framework 4.7.2.  

How to check for backwards-compatibility issues

In order to find out if you have a potential risk of backwards-compatibility breaking behavior, you can run the .NET compatibility checks on the .NET code of your U-SQL assemblies to find these potential breaking changes. 

Note: The tool does not detect actual breaking changes but only identifies called APIs that may, for certain inputs, cause issues. So if you get notified of an issue, your code may still be fine but you should now check in more details.

1.	Run the backwards-compatibility checker on your .NET DLLs either by
a.	Using the Visual Studio Extension at https://marketplace.visualstudio.com/items?itemName=ConnieYau.NETPortabilityAnalyzer, or by 
b.	Downloading and using the standalone tool from https://github.com/microsoft/dotnet-apiport. Instructions for running standalone tool are at https://github.com/microsoft/dotnet-apiport/blob/dev/docs/HowTo/BreakingChanges.md.  
c.	For 4.7.2. compatibility, please only read isRetargeting == True breaking changes.  
2.	If the tool indicates your code may be impacted by any of the possible backwards-incompatibilities (some common ones are listed below), you can further check by either 
a.	Analyzing the code and identifying if you are passing values to the impacted APIs that may have issues
b.	Perform a runtime check. 
The runtime deployment is not done side-by-side in ADLA. Thus, if you would like to perform a runtime check before the upgrade, you have to use VisualStudio’s local run with a local .NET Framework 4.7.2 against a representative data set. 
3.	If you indeed are impacted by a backwards-incompatibility, take the necessary steps to fix it (such as fixing your data or code logic). 

In most cases, you should not be impacted by backwards-incompatibility.

Timeline

We will start the rollout of the new runtime in early October using our staged region roll-out.

What if I cannot get my code reviewed or fixed in time?

While you can submit your job against the old runtime version (which is built targeting 4.5.2), due to the lack of .NET Framework side-by-side capabilities, it will still only run in 4.5.2 compatibility mode, thus you may still encounter some of the backwards-compatibility issues.


## Next steps

- [How to set up CI/CD pipeline for Azure Data Lake Analytics](data-lake-analytics-cicd-overview.md)
- [Run U-SQL script on your local machine](data-lake-analytics-data-lake-tools-local-run.md)
- [Use U-SQL database project to develop U-SQL database](data-lake-analytics-data-lake-tools-develop-usql-database.md)

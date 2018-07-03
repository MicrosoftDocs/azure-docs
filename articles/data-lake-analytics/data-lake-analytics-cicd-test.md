---
title: How to test your Azure Data Lake Analytics code | Microsoft Docs
description: 'Learn how to add test cases for your U-SQL and extended C# code for Azure Data Lake Analytics.'
services: data-lake-analytics
documentationcenter: ''
author: yanancai
manager:  
editor: 

ms.assetid: 66dd58b1-0b28-46d1-aaae-43ee2739ae0a
ms.service: data-lake-analytics
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: big-data
ms.date: 07/03/2018
ms.author: yanacai

---
# How to test your Azure Data Lake Analytics code

Azure Data Lake provides U-SQL as a language that combines declarative SQL with imperative C# to process data at any scale. In this document, you learn how to create test cases for your U-SQL and extended C# UDO (User Defined Operator) code.

## Test U-SQL scripts

When running U-SQL script, the script is compiled, optimized to executable code which distributed runs on multiple machines on cloud or your local machine. The compilation and optimization process treats the entire U-SQL script as a whole to execute, hence you cannot do traditional "unit test" for every statement. However, by leveraging U-SQL test SDK and local run SDK, you can perform script level tests.

### Create test cases for U-SQL script

Azure Data Lake Tools for Visual Studio provides good experience to help you create U-SQL script test cases.

1.	Right click a U-SQL script in Solution Explorer and choose **Create Unit Test**.
2.	Configure if you would like to create a new test project or insert the test case to an existing test project.

![Data Lake Tools for Visual Studio create u-sql test project](./media/data-lake-analytics-cicd-test/data-lake-tools-create-usql-test-projet.png) 

![Data Lake Tools for Visual Studio create u-sql test project configuration](./media/data-lake-analytics-cicd-test/data-lake-tools-create-usql-test-projet-configure.png) 

### Manage test data source

When test U-SQL scripts, test input files are needed. You can manage these test data by configuring **Test Data Source** in U-SQL project property. By calling the **Initialize()** interface in U-SQL test SDK, a temporary local Data Root folder will be created under test project working directory, and all files and sub-folders(and files under sub-folders) in the test data source folder will be copied to the temporary local data root folder before running U-SQL script test cases. You can configure multiple test data source folder by spitting test data folder path with semicolon.

![Data Lake Tools for Visual Studio configure project test data source](./media/data-lake-analytics-cicd-test/data-lake-tools-configure-project-test-data-source.png)

### Manage database environment for test

If your U-SQL scripts use or query with U-SQL database objects, like calling a stored procedure, referencing assemblies, etc., then you need to initialize the database environment before running U-SQL test cases. The **Initialize()** interface in U-SQL test SDK helps you deploy all databases referenced by the U-SQL project to the temporary local Data Root folder under test project working directory. 

Learn more about [how you can manage U-SQL database projects references for U-SQL project](dbproject.md).

### Verify test results

The **TestRunner()** interface returns job execution result, 0 means succeed, and 1 means failed. You can also use C# assert functions to verify the outputs. 

### Execute test cases in Visual Studio

U-SQL script test project is built on top of C# unit test framework. After building the U-SQL script test project, all test cases will be listed in **Test Explorer > Playlist**, you can run these test cases through Test Explorer or right click the .cs file and choose **Run Tests**.

## Test C# UDOs

### Create test cases for C# UDOs

You can use C# unit test framework to test your C# UDOs(User Defined Operator). When testing UDOs, you need to prepare corresponding **IRowset** object as inputs.

There are two ways to create IRowset:

1.	Load data from a file to create IRowset

    //Schema: "a:int, b:int"
    USqlColumn<int> col1 = new USqlColumn<int>("a");
    USqlColumn<int> col2 = new USqlColumn<int>("b");
    List<IColumn> columns = new List<IColumn> { col1, col2 };
    USqlSchema schema = new USqlSchema(columns);

    //Generate one row with default values
    IUpdatableRow output = new USqlRow(schema, null).AsUpdatable();
    
    //Get data from file
    IRowset rowset = UnitTestHelper.GetRowsetFromFile(@"processor.txt", schema, output.AsReadOnly(), discardAdditionalColumns: true, rowDelimiter: null, columnSeparator: '\t');

2.	Use data from data collection to create IRowset

    //Schema: "a:int, b:int"
    USqlSchema schema = new USqlSchema(
        new USqlColumn<int>("a"),
        new USqlColumn<int>("b")
    );
    
    IUpdatableRow output = new USqlRow(schema, null).AsUpdatable();
    
    //Generate Rowset with specified values
    List<object[]> values = new List<object[]>{
        new object[2] { 2, 3 },
        new object[2] { 10, 20 }
    };

    IEnumerable<IRow> rows = UnitTestHelper.CreateRowsFromValues(schema, values);
    IRowset rowset = UnitTestHelper.GetRowsetFromCollection(rows, output.AsReadOnly());

### Verify test results

After calling UDO functions, you can verify the result through schema and Rowset value verification using C# Assert functions. Sample code can be in U-SQL C# UDO Unit Test Sample Project through **File > New > Project** in Visual Studio.

### Execute test cases in Visual Studio

After building the test project, all test cases can be found in **Test Explorer > Playlist**, you can run these test cases through Test Explorer or right click the .cs file and choose **Run Tests**.

## Run test cases in Visual Studio Team Service

Both U-SQL script test project and C# UDO test project inherit C# unit test project, test cases can be run through **Visual Studio Test task** in Visual Studio Team Service. 

### Run U-SQL test cases in Visual Studio Team Service

For U-SQL test, make sure you load CPPSDK on your build machine and pass the CPPSDK path to USqlScriptTestRunner(cppSdkFolderFullPath: @"").

**What is CPPSDK?**

CPPSDK is a package includes Microsoft Visual C++ 14 and Windows SDK 10.0.10240.0, Which is the environment needed by U-SQL runtime. You can get this package under Azure Data Lake Tools for Visual Studio installation folder:

- For Visual Studio 2015, it is under C:\Program Files (x86)\Microsoft Visual Studio 14.0\Common7\IDE\Extensions\Microsoft\Microsoft Azure Data Lake Tools for Visual Studio 2015\X.X.XXXX.X\CppSDK
- For Visual Studio 2017, it is under C:\Program Files (x86)\Microsoft Visual Studio\2017\Enterprise\SDK\ScopeCppSDK

**How to prepare CPPSDK in Visual Studio Team Service build agent**

The common way for preparing this CPPSDK dependency in Visual Studio Team Service is:

1.	Zip the folder contains CPPSDK libraries.
2.	Check in the zip file to your source control system. (Zip file can make sure you check in all libraries under CPPSDK folder, or some files will be ignored by .gitignore.)
3.	Unzip the zip file in Build pipeline.
4.	Point USqlScriptTestRunner to this unzipped folder on the build machine.

### Run C# UDO test cases in Visual Studio Team Service

For C# UDO test, make sure you have referenced below assemblies which are needed for UDOs. If you reference them through [the Nuget package Microsoft.Azure.DataLake.USQL.Interfaces](https://www.nuget.org/packages/Microsoft.Azure.DataLake.USQL.Interfaces/), make sure you add a Nuget Restore task in your build pipeline.

* Microsoft.Analytics.Interfaces
* Microsoft.Analytics.Types
* Microsoft.Analytics.UnitTest

## Next Step

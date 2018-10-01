---
title: How to test your Azure Data Lake Analytics code
description: 'Learn how to add test cases for U-SQL and extended C# code for Azure Data Lake Analytics.'
services: data-lake-analytics
author: yanancai
ms.author: yanacai
ms.reviewer: jasonwhowell
ms.assetid: 66dd58b1-0b28-46d1-aaae-43ee2739ae0a
ms.service: data-lake-analytics
ms.topic: conceptual
ms.workload: big-data
ms.date: 07/03/2018
---
# Test your Azure Data Lake Analytics code

Azure Data Lake provides the U-SQL language, which combines declarative SQL with imperative C# to process data at any scale. In this document, you learn how to create test cases for U-SQL and extended C# UDO (user-defined operator) code.

## Test U-SQL scripts

The U-SQL script is compiled and optimized for executable code to run across machines on the cloud or on your local machine. The compilation and optimization process treats the entire U-SQL script as a whole. You can't do a traditional "unit test" for every statement. However, by using the U-SQL test SDK and the local run SDK, you can do script-level tests.

### Create test cases for U-SQL script

Azure Data Lake Tools for Visual Studio enables you to create U-SQL script test cases.

1.	Right-click a U-SQL script in Solution Explorer, and then select **Create Unit Test**.
2.	Create a new test project or insert the test case into an existing test project.

    ![Data Lake Tools for Visual Studio -- create a U-SQL test project](./media/data-lake-analytics-cicd-test/data-lake-tools-create-usql-test-project.png) 

    ![Data Lake Tools for Visual Studio -- create a U-SQL test project configuration](./media/data-lake-analytics-cicd-test/data-lake-tools-create-usql-test-project-configure.png) 

### Manage the test data source

When you test U-SQL scripts, you need test input files. You can manage the test data by configuring **Test Data Source** in the U-SQL project properties. 

When you call the `Initialize()` interface in the U-SQL test SDK, a temporary local data root folder is created under the working directory of the test project, and all files and subfolders (and files under subfolders) in the test data source folder are copied to the temporary local data root folder before you run the U-SQL script test cases. You can add more test data source folders by splitting the test data folder path with a semicolon.

![Data Lake Tools for Visual Studio -- configure project test data source](./media/data-lake-analytics-cicd-test/data-lake-tools-configure-project-test-data-source.png)

### Manage the database environment for testing

If your U-SQL scripts use or query with U-SQL database objects (for example, when calling stored procedures) then you need to initialize the database environment before running U-SQL test cases. The `Initialize()` interface in the U-SQL test SDK helps you deploy all databases that are referenced by the U-SQL project to the temporary local data root folder in the working directory of the test project. 

Learn more about [how to manage U-SQL database project references for a U-SQL project](data-lake-analytics-data-lake-tools-develop-usql-database.md#reference-a-u-sql-database-project).

### Verify test results

The `Run()` interface returns a job execution result. 0 means success, and 1 means failure. You can also use C# assert functions to verify the outputs. 

### Run test cases in Visual Studio

A U-SQL script test project is built on top of a C# unit test framework. After you build the project, you can run all test cases through **Test Explorer > Playlist**. Alternatively, right-click the .cs file, and then select **Run Tests**.

## Test C# UDOs

### Create test cases for C# UDOs

You can use a C# unit test framework to test your C# UDOs (user-defined operators). When testing UDOs, you need to prepare corresponding **IRowset** objects as inputs.

There are two ways to create an IRowset object:

- Load data from a file to create IRowset:

    ```csharp
    //Schema: "a:int, b:int"
    USqlColumn<int> col1 = new USqlColumn<int>("a");
    USqlColumn<int> col2 = new USqlColumn<int>("b");
    List<IColumn> columns = new List<IColumn> { col1, col2 };
    USqlSchema schema = new USqlSchema(columns);

    //Generate one row with default values
    IUpdatableRow output = new USqlRow(schema, null).AsUpdatable();

    //Get data from file
    IRowset rowset = UnitTestHelper.GetRowsetFromFile(@"processor.txt", schema, output.AsReadOnly(), discardAdditionalColumns: true, rowDelimiter: null, columnSeparator: '\t');
    ```

- Use data from a data collection to create IRowset:

    ```csharp
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
    ```

### Verify test results

After you call UDO functions, you can verify the results through the schema and Rowset value verification by using C# assert functions. You can use sample code in a U-SQL C# UDO unit test sample project through **File > New > Project** in Visual Studio.

### Run test cases in Visual Studio

After you build the test project, you can run all test cases though **Test Explorer > Playlist**, or right-click the .cs file and choose **Run Tests**.

## Run test cases in Azure DevOps

Both **U-SQL script test projects** and **C# UDO test projects** inherit C# unit test projects. The [Visual Studio test task](https://docs.microsoft.com/azure/devops/pipelines/test/getting-started-with-continuous-testing?view=vsts) in Azure DevOps can run these test cases. 

### Run U-SQL test cases in Azure DevOps

For a U-SQL test, make sure you load `CPPSDK` on your build machine, and then pass the `CPPSDK` path to USqlScriptTestRunner(cppSdkFolderFullPath: @"").

**What is CPPSDK?**

CPPSDK is a package that includes Microsoft Visual C++ 14 and Windows SDK 10.0.10240.0. This is the environment that's needed by the U-SQL runtime. You can get this package under the Azure Data Lake Tools for Visual Studio installation folder:

- For Visual Studio 2015, it is under `C:\Program Files (x86)\Microsoft Visual Studio 14.0\Common7\IDE\Extensions\Microsoft\Microsoft Azure Data Lake Tools for Visual Studio 2015\X.X.XXXX.X\CppSDK`
- For Visual Studio 2017, it is under `C:\Program Files (x86)\Microsoft Visual Studio\2017\Enterprise\SDK\ScopeCppSDK`

**Prepare CPPSDK in the Azure DevOps build agent**

The most common way to prepare the CPPSDK dependency in Azure DevOps is as follows:

1.	Zip the folder  that includes the CPPSDK libraries.
2.	Check in the .zip file to your source control system. (The .zip file ensures that you check in all libraries under the CPPSDK folder so that some files aren't ignored by ".gitignore".)   
3.	Unzip the .zip file in the build pipeline.
4.	Point `USqlScriptTestRunner` to this unzipped folder on the build machine.

### Run C# UDO test cases in Azure DevOps

For a C# UDO test, make sure to reference the following assemblies, which  are needed for UDOs. If you reference them through [the Nuget package Microsoft.Azure.DataLake.USQL.Interfaces](https://www.nuget.org/packages/Microsoft.Azure.DataLake.USQL.Interfaces/), make sure you add a NuGet Restore task in your build pipeline.

* Microsoft.Analytics.Interfaces
* Microsoft.Analytics.Types
* Microsoft.Analytics.UnitTest

## Next steps

- [How to set up CI/CD pipeline for Azure Data Lake Analytics](data-lake-analytics-cicd-overview.md)
- [Run U-SQL script on your local machine](data-lake-analytics-data-lake-tools-local-run.md)
- [Use U-SQL database project to develop U-SQL database](data-lake-analytics-data-lake-tools-develop-usql-database.md)


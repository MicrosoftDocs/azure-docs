---
title: How to test your Azure Data Lake Analytics code
description: 'Learn how to add test cases for U-SQL and extended C# code for Azure Data Lake Analytics.'
ms.service: data-lake-analytics
ms.topic: how-to
ms.date: 01/20/2023
---
# Test your Azure Data Lake Analytics code

Azure Data Lake provides the [U-SQL](data-lake-analytics-u-sql-get-started.md) language. U-SQL combines declarative SQL with imperative C# to process data at any scale. In this document, you learn how to create test cases for U-SQL and extended C# user-defined operator (UDO) code.

[!INCLUDE [retirement-flag](includes/retirement-flag.md)]

## Test U-SQL scripts

The U-SQL script is compiled and optimized for executable code to run in Azure or on your local computer. The compilation and optimization process treats the entire U-SQL script as a whole. You can't do a traditional unit test for every statement. However, by using the U-SQL test SDK and the local run SDK, you can do script-level tests.

### Create test cases for U-SQL script

Azure Data Lake Tools for Visual Studio enables you to create U-SQL script test cases.

1. Right-click a U-SQL script in Solution Explorer, and then select **Create Unit Test**.

1. Create a new test project or insert the test case into an existing test project.

   ![Data Lake Tools for Visual Studio -- create a U-SQL test project configuration](./media/data-lake-analytics-cicd-test/data-lake-tools-create-usql-test-project-configure.png)

### Manage the test data source

When you test U-SQL scripts, you need test input files. To manage the test data, in **Solution Explorer**, right-click the U-SQL project, and select **Properties**. You can enter a source in **Test Data Source**.

![Data Lake Tools for Visual Studio -- configure project test data source](./media/data-lake-analytics-cicd-test/data-lake-tools-configure-project-test-data-source.png)

When you call the `Initialize()` interface in the U-SQL test SDK, a temporary local data root folder is created under the working directory of the test project. All files and folders in the test data source folder are copied to the temporary local data root folder before you run the U-SQL script test cases. You can add more test data source folders by splitting the test data folder path with a semicolon.

### Manage the database environment for testing

If your U-SQL scripts use or query with U-SQL database objects, you need to initialize the database environment before you run U-SQL test cases. This approach can be necessary when calling stored procedures. The `Initialize()` interface in the U-SQL test SDK helps you deploy all databases that are referenced by the U-SQL project to the temporary local data root folder in the working directory of the test project.

For more information about how to manage U-SQL database project references for a U-SQL project, see [Reference a U-SQL database project](data-lake-analytics-data-lake-tools-develop-usql-database.md#reference-a-u-sql-database-project).

### Verify test results

The `Run()` interface returns a job execution result. *0* means success, and *1* means failure. You can also use C# assert functions to verify the outputs.

### Run test cases in Visual Studio

A U-SQL script test project is built on top of a C# unit test framework. After you build the project, select **Test** > **Windows** > **Test Explorer**. You can run test cases from **Test Explorer**. Alternatively, right-click the .cs file in your unit test and select **Run Tests**.

## Test C# UDOs

### Create test cases for C# UDOs

You can use a C# unit test framework to test your C# user-defined operators (UDOs). When testing UDOs, you need to prepare corresponding **IRowset** objects as inputs.

There are two ways to create an **IRowset** object:

- Load data from a file to create **IRowset**:

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

- Use data from a data collection to create **IRowset**:

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

After you call UDO functions, you can verify the results through the schema and Rowset value verification by using C# assert functions. You can add a **U-SQL C# UDO Unit Test Project** to your solution. To do so, select **File > New > Project** in Visual Studio.

### Run test cases in Visual Studio

After you build the project, select **Test** > **Windows** > **Test Explorer**. You can run test cases from **Test Explorer**. Alternatively, right-click the .cs file in your unit test and select **Run Tests**.

## Run test cases in Azure Pipelines<a name="run-test-cases-in-azure-devops"></a>

Both **U-SQL script test projects** and **C# UDO test projects** inherit C# unit test projects. The [Visual Studio test task](/azure/devops/pipelines/test/getting-started-with-continuous-testing) in Azure Pipelines can run these test cases.

### Run U-SQL test cases in Azure Pipelines

For a U-SQL test, make sure you load `CPPSDK` on your build computer, and then pass the `CPPSDK` path to `USqlScriptTestRunner(cppSdkFolderFullPath: @"")`.

#### What is CPPSDK?

CPPSDK is a package that includes Microsoft Visual C++ 14 and Windows SDK 10.0.10240.0. This package includes the environment that's needed by the U-SQL runtime. You can get this package under the Azure Data Lake Tools for Visual Studio installation folder:

- For Visual Studio 2015, it is under `C:\Program Files (x86)\Microsoft Visual Studio 14.0\Common7\IDE\Extensions\Microsoft\Microsoft Azure Data Lake Tools for Visual Studio 2015\X.X.XXXX.X\CppSDK`
- For Visual Studio 2017, it is under `C:\Program Files (x86)\Microsoft Visual Studio\2017\<Visual Studio Edition>\SDK\ScopeCppSDK`
- For Visual Studio 2019, it is under `C:\Program Files (x86)\Microsoft Visual Studio\2019\<Visual Studio Edition>\SDK\ScopeCppSDK`

#### Prepare CPPSDK in the Azure Pipelines build agent

The most common way to prepare the CPPSDK dependency in Azure Pipelines is as follows:

1. Zip the folder that includes the CPPSDK libraries.

1. Check in the .zip file to your source control system. The .zip file ensures that you check in all libraries under the CPPSDK folder so that files aren't ignored because of a `.gitignore` file.

1. Unzip the .zip file in the build pipeline.

1. Point `USqlScriptTestRunner` to this unzipped folder on the build computer.

### Run C# UDO test cases in Azure Pipelines

For a C# UDO test, make sure to reference the following assemblies, which are needed for UDOs.

- Microsoft.Analytics.Interfaces
- Microsoft.Analytics.Types
- Microsoft.Analytics.UnitTest

If you reference them through [the NuGet package Microsoft.Azure.DataLake.USQL.Interfaces](https://www.nuget.org/packages/Microsoft.Azure.DataLake.USQL.Interfaces/), make sure you add a NuGet Restore task in your build pipeline.

## Next steps

- [How to set up CI/CD pipeline for Azure Data Lake Analytics](data-lake-analytics-cicd-overview.md)
- [Run U-SQL script on your local machine](data-lake-analytics-data-lake-tools-local-run.md)
- [Use U-SQL database project to develop U-SQL database](data-lake-analytics-data-lake-tools-develop-usql-database.md)
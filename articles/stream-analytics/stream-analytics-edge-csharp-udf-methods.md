---
title: Develop .NET Standard functions for Azure Stream Analytics jobs (Preview)
description: Learn how to write C# user-defined functions for Stream Analytics jobs.
author: ajetasin
ms.author: ajetasi
ms.service: stream-analytics
ms.topic: conceptual
ms.date: 6/09/2021
ms.custom: seodec18, devx-track-csharp, devx-track-dotnet
---

# Develop .NET Standard user-defined functions for Azure Stream Analytics jobs (Preview)

Azure Stream Analytics offers a SQL-like query language for performing transformations and computations over streams of event data. There are many built-in functions, but some complex scenarios require additional flexibility. With .NET Standard user-defined functions (UDF), you can invoke your own functions written in any .NET standard language (C#, F#, etc.) to extend the Stream Analytics query language. UDFs allow you to perform complex math computations, import custom ML models using ML.NET, and use custom imputation logic for missing data. The UDF feature for Stream Analytics jobs is currently in preview and shouldn't be used in production workloads.

## Regions

The .NET user-defined-function feature is enable for cloud jobs that run on [Stream Analytics clusters](./cluster-overview.md). Jobs that run on the Standard multi-tenant SKU can leverage this feature in the following public regions:
* West Central US
* North Europe
* East US
* West US
* East US 2
* West Europe

If you are interested in using this feature in any another region, you can [request access](https://aka.ms/ccodereqregion).

## Package path

The format of any UDF package has the path `/UserCustomCode/CLR/*`. Dynamic Link Libraries (DLLs) and resources are copied under the `/UserCustomCode/CLR/*` folder, which helps isolate user DLLs from system and Azure Stream Analytics DLLs. This package path is used for all functions regardless of the method used to employ them.

## Supported types and mapping

For Azure Stream Analytics values to be used in C#, they need to be marshaled from one environment to the other. Marshaling happens for all input parameters of a UDF. Every Azure Stream Analytics type has a corresponding type in C# shown on the table below:

|**Azure Stream Analytics type** |**C# type** |
|---------|---------|
|bigint | long |
|float | double |
|nvarchar(max) | string |
|datetime | DateTime |
|Record | Dictionary\<string, object> |
|Array | Object[] |

The same is true when data needs to be marshaled from C# to Azure Stream Analytics, which happens on the output value of a UDF. The table below shows what types are supported:

|**C# type**  |**Azure Stream Analytics type**  |
|---------|---------|
|long  |  bigint   |
|double  |  float   |
|string  |  nvarchar(max)   |
|DateTime  |  dateTime   |
|struct  |  Record   |
|object  |  Record   |
|Object[]  |  Array   |
|Dictionary\<string, object>  |  Record   |

## Develop a UDF in Visual Studio Code

[Visual Studio Code tools for Azure Stream Analytics](quick-create-visual-studio-code.md) make it easy for you to write UDFs, test your jobs locally (even offline), and publish your Stream Analytics job to Azure.

There are two ways to implement .NET standard UDFs in Visual Studio Code tools.

* UDF from local DLLs
* UDF from a local project

### Local project

User-defined functions can be written in an assembly that is later referenced in an Azure Stream Analytics query. This is the recommended option for complex functions that require the full power of a .NET Standard language beyond its expression language, such as procedural logic or recursion. UDFs from a local project might also be used when you need to share the function logic across several Azure Stream Analytics queries. Adding UDFs to your local project gives you the ability to debug and test your functions locally.

To reference a local project:

1. Create a new .NET standard class library on your local machine.
2. Write the code in your class. Remember that the classes must be defined as *public* and objects must be defined as *static public*.
3. Add a new CSharp Function configuration file in your Azure Stream Analytics project and reference the CSharp class library project.
4. Configure the assembly path in the job configuration file, `JobConfig.json`, **CustomCodeStorage** section.This step is not needed for local testing.

### Local DLLs

You can also reference local DLLs that include the user-defined functions.

### Example

In this example, **CSharpUDFProject** is a C# class library project and **ASAUDFDemo** is the Azure Stream Analytics project, which will reference **CSharpUDFProject**.

:::image type="content" source="media/stream-analytics-edge-csharp-udf-methods/visual-studio-code-csharp-udf-demo.png" alt-text="Azure Stream Analytics project in Visual Studio Code":::

The following UDF has a function that multiplies an integer by itself to produce the square of the integer. The classes must be defined as *public* and objects must be defined as *static public*.

```csharp
using System;

namespace CSharpUDFProject
{
    // 
    public class Class1
    {
        public static Int64 SquareFunction(Int64 a)
        {
            return a * a;
        }
    }
}
```

The following steps show you how to add C# UDF function to your Stream Analytics project.

1. Right click on the **Functions** folder and choose **Add Item**.

   :::image type="content" source="media/stream-analytics-edge-csharp-udf-methods/visual-studio-code-csharp-udf-add-function.png" alt-text="Add new function in Azure Stream Analytics project":::

2. Add a C# function **SquareFunction** to your Azure Stream Analytics project.

   :::image type="content" source="media/stream-analytics-edge-csharp-udf-methods/visual-studio-code-csharp-udf-add-function-2.png" alt-text="Select CSharp function from Stream Analytics project in VS Code":::

   :::image type="content" source="media/stream-analytics-edge-csharp-udf-methods/visual-studio-code-csharp-udf-add-function-name.png" alt-text="Enter CSharp function name in VS Code":::

3. In the C# function configuration, select **Choose library project path** to choose your C# project from the dropdown list and select **Build project** to build your project. Then choose **Select class** and **Select method** to select the related class and method name from the dropdown list. To refer to the methods, types, and functions in the Stream Analytics query, the classes must be defined as *public* and the objects must be defined as *static public*.

   :::image type="content" source="media/stream-analytics-edge-csharp-udf-methods/visual-studio-code-csharp-udf-choose-project.png" alt-text="Stream Analytics C sharp function configuration VS Code":::

    If you want to use the C# UDF from a DLL, select **Choose library dll path** to choose the DLL. Then choose **Select class** and **Select method** to select the related class and method name from the dropdown list.

   :::image type="content" source="media/stream-analytics-edge-csharp-udf-methods/visual-studio-code-csharp-udf-choose-dll.png" alt-text="Stream Analytics C sharp function configuration":::

4. Invoke the UDF in your Azure Stream Analytics query.

   ```sql
    SELECT price, udf.SquareFunction(price)
    INTO Output
    FROM Input 
   ```

5. Before submitting the job to Azure, configure the package path in the job configuration file, `JobConfig.json`, **CustomCodeStorage** section. Use **Select from your subscription** in CodeLens to choose your Subscription and choose the storage account and container name from the dropdown list. Leave **Path** as default. This step is not needed for local testing.

   :::image type="content" source="media/stream-analytics-edge-csharp-udf-methods/visual-studio-code-csharp-udf-configure-storage-account.png" alt-text="Choose library path":::

## Develop a UDF in Visual Studio

There are three ways to implement UDFs in Visual Studio tools.

* CodeBehind files in an ASA project
* UDF from a local project
* An existing package from an Azure storage account

### CodeBehind

You can write user-defined functions in the **Script.asql** CodeBehind. Visual Studio tools will automatically compile the CodeBehind file into an assembly file. The assemblies are packaged as a zip file and uploaded to your storage account when you submit your job to Azure. You can learn how to write a C# UDF using CodeBehind by following the [C# UDF for Stream Analytics Edge jobs](stream-analytics-edge-csharp-udf.md) tutorial. 

### Local project

To reference a local project in Visual Studio:

1. Create a new .NET standard class library in your solution
2. Write the code in your class. Remember that the classes must be defined as *public* and objects must be defined as *static public*. 
3. Build your project. The tools will package all the artifacts in the bin folder to a zip file and upload the zip file to the storage account. For external references, use assembly reference instead of the NuGet package.
4. Reference the new class in your Azure Stream Analytics project.
5. Add a new function in your Azure Stream Analytics project.
6. Configure the assembly path in the job configuration file, `JobConfig.json`. Set the Assembly Path to **Local Project Reference or CodeBehind**.
7. Rebuild both the function project and the Azure Stream Analytics project.  

### Example

In this example, **UDFTest** is a C# class library project and **ASAUDFDemo** is the Azure Stream Analytics project, which will reference **UDFTest**.

:::image type="content" source="media/stream-analytics-edge-csharp-udf-methods/stream-analytics-edge-udf-demo.png" alt-text="Azure Stream Analytics IoT Edge project in Visual Studio":::

1. Build your C# project, which will enable you to add a reference to your C# UDF from the Azure Stream Analytics query.

   :::image type="content" source="media/stream-analytics-edge-csharp-udf-methods/stream-analytics-edge-udf-build-project.png" alt-text="Build an Azure Stream Analytics IoT Edge project in Visual Studio":::

2. Add the reference to the C# project in the ASA project. Right-click the References node and choose Add Reference.

   :::image type="content" source="media/stream-analytics-edge-csharp-udf-methods/stream-analytics-edge-udf-add-reference.png" alt-text="Add a reference to a C# project in Visual Studio":::

3. Choose the C# project name from the list.

   :::image type="content" source="media/stream-analytics-edge-csharp-udf-methods/stream-analytics-edge-udf-choose-project-name.png" alt-text="Choose your C# project name from the reference list":::

4. You should see the **UDFTest** listed under **References** in **Solution Explorer**.

   :::image type="content" source="media/stream-analytics-edge-csharp-udf-methods/stream-analytics-edge-udf-added-reference.png" alt-text="View the user defined function reference in solution explorer":::

5. Right click on the **Functions** folder and choose **New Item**.

   :::image type="content" source="media/stream-analytics-edge-csharp-udf-methods/stream-analytics-edge-udf-add-csharp-function.png" alt-text="Add new item to Functions in Azure Stream Analytics Edge solution":::

6. Add a C# function **SquareFunction.json** to your Azure Stream Analytics project.

   :::image type="content" source="media/stream-analytics-edge-csharp-udf-methods/stream-analytics-edge-udf-add-csharp-function-2.png" alt-text="Select CSharp function from Stream Analytics Edge items in Visual Studio":::

7. Double-click the function in **Solution Explorer** to open the configuration dialog.

   :::image type="content" source="media/stream-analytics-edge-csharp-udf-methods/stream-analytics-edge-udf-csharp-function-config.png" alt-text="C sharp function configuration in Visual Studio":::

8. In the C# function configuration, choose **Load from ASA Project Reference** and the related assembly, class, and method names from the dropdown list. To refer to the methods, types, and functions in the Stream Analytics query, the classes must be defined as *public* and the objects must be defined as *static public*.

   :::image type="content" source="media/stream-analytics-edge-csharp-udf-methods/stream-analytics-edge-udf-asa-csharp-function-config.png" alt-text="Stream Analytics C sharp function configuration Visual Studio":::

## Existing packages

You can author .NET Standard UDFs in any IDE of your choice and invoke them from your Azure Stream Analytics query. First compile your code and package all the DLLs. The format of the package has the path `/UserCustomCode/CLR/*`. Then, upload `UserCustomCode.zip` to the root of the container in your Azure storage account.

Once assembly zip packages have been uploaded to your Azure storage account, you can use the functions in Azure Stream Analytics queries. All you need to do is include the storage information in the Stream Analytics job configuration. You can't test the function locally with this option because Visual Studio tools will not download your package. The package path is parsed directly to the service. 

To configure the assembly path in the job configuration file, `JobConfig.json`:

Expand the **User-Defined Code Configuration** section, and fill out the configuration with the following suggested values:

   |**Setting**|**Suggested Value**|
   |-------|---------------|
   |Global Storage Settings Resource|Choose data source from current account|
   |Global Storage Settings Subscription| < your subscription >|
   |Global Storage Settings Storage Account| < your storage account >|
   |Custom Code Storage Settings Resource|Choose data source from current account|
   |Custom Code Storage Settings Storage Account|< your storage account >|
   |Custom Code Storage Settings Container|< your storage container >|
   |Custom Code Assembly Source|Existing assembly packages from the cloud|
   |Custom Code Assembly Source|UserCustomCode.zip|

## User logging

The logging mechanism allows you to capture custom information while a job is running. You can use log data to debug or assess the correctness of the custom code in real time.

The `StreamingContext` class lets you publish diagnostic information using the `StreamingDiagnostics.WriteError` function. The code below shows the interface exposed by Azure Stream Analytics.

```csharp
public abstract class StreamingContext
{
    public abstract StreamingDiagnostics Diagnostics { get; }
}

public abstract class StreamingDiagnostics
{
    public abstract void WriteError(string briefMessage, string detailedMessage);
}
```

`StreamingContext` is passed as an input parameter to the UDF method and can be used within the UDF to publish custom log information. In the example below, `MyUdfMethod` defines a **data** input, which is provided by the query, and a **context** input as the `StreamingContext`, provided by the runtime engine. 

```csharp
public static long MyUdfMethod(long data, StreamingContext context)
{
    // write log
    context.Diagnostics.WriteError("User Log", "This is a log message");
    
    return data;
}
```

The `StreamingContext` value doesn't need to be passed in by the SQL query. Azure Stream Analytics provides a context object automatically if an input parameter is present. The use of the `MyUdfMethod` does not change, as shown in the following query:

```sql
SELECT udf.MyUdfMethod(input.value) as udfValue FROM input
```

You can access log messages through the [diagnostic logs](data-errors.md).

## Limitations

The UDF preview currently has the following limitations:

* .NET Standard UDFs can only be authored in Visual Studio Code or Visual Studio and published to Azure. Read-only versions of .NET Standard UDFs can be viewed under **Functions** in the Azure portal. Authoring of .NET Standard functions is not supported in the Azure portal.

* The Azure portal query editor shows an error when using .NET Standard UDF in the portal. 

* Call out external REST endpoints, for example, doing reverse IP lookup or pulling reference data from an external source

* Because the custom code shares context with Azure Stream Analytics engine, custom code can't reference anything that has a conflicting namespace/dll_name with Azure Stream Analytics code. For example, you can't reference *Newtonsoft Json*.

* Supporting files included in the project are copied to the User Custom Code zip file that is used when you publish the job to the cloud. All files in subfolders are copied directly to the root of the User Custom Code folder in the cloud when unzipped. The zip is "flattened" when decompressed.

* User Custom Code doesn't support empty folders. Don't add empty folders to the supporting files in the project.

## Next steps

* [Tutorial: Write a C# user-defined function for an Azure Stream Analytics job (Preview)](stream-analytics-edge-csharp-udf.md)
* [Tutorial: Azure Stream Analytics JavaScript user-defined functions](stream-analytics-javascript-user-defined-functions.md)
* [Create an Azure Stream Analytics job in Visual Studio Code](quick-create-visual-studio-code.md)

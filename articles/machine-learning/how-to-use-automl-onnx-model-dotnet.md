---
title: Make predictions with AutoML ONNX Model in .NET
description: Learn how to make predictions using an AutoML ONNX model in .NET with ML.NET
titleSuffix: Azure Machine Learning
author: luisquintanilla
ms.author: luquinta
ms.date: 10/30/2020
ms.topic: how-to
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.custom: automl
---

# Make predictions with an AutoML ONNX model in .NET

In this article, you learn how to use an Automated ML (AutoML) Open Neural Network Exchange (ONNX) model to make predictions in a C# .NET Core console application with ML.NET.

[ML.NET](/dotnet/machine-learning/) is an open-source, cross-platform, machine learning framework for the .NET ecosystem that allows you to train and consume custom machine learning models using a code-first approach in C# or F# as well as through low-code tooling like [Model Builder](/dotnet/machine-learning/automate-training-with-model-builder) and the [ML.NET CLI](/dotnet/machine-learning/automate-training-with-cli). The framework is also extensible and allows you to leverage other popular machine learning frameworks like TensorFlow and ONNX.

ONNX is an open-source format for AI models. ONNX supports interoperability between frameworks. This means you can train a model in one of the many popular machine learning frameworks like PyTorch, convert it into ONNX format, and consume the ONNX model in a different framework like ML.NET. To learn more, visit the [ONNX website](https://onnx.ai/).

## Prerequisites

- [.NET Core SDK 3.1 or greater](https://dotnet.microsoft.com/download)
- Text Editor or IDE (such as [Visual Studio](https://visualstudio.microsoft.com/vs/) or [Visual Studio Code](https://code.visualstudio.com/Download))
- ONNX model. To learn how to train an AutoML ONNX model, see the following [bank marketing classification notebook](https://github.com/Azure/MachineLearningNotebooks/blob/master/how-to-use-azureml/automated-machine-learning/classification-bank-marketing-all-features/auto-ml-classification-bank-marketing-all-features.ipynb).
- [Netron](https://github.com/lutzroeder/netron) (optional)

## Create a C# console application

In this sample, you use the .NET Core CLI to build your application but you can do the same tasks using Visual Studio. Learn more about the [.NET Core CLI](/dotnet/core/tools/).

1. Open a terminal and create a new C# .NET Core console application. In this example, the name of the application is `AutoMLONNXConsoleApp`. A directory is created by that same name with the contents of your application.

    ```dotnetcli
    dotnet new console -o AutoMLONNXConsoleApp
    ```

1. In the terminal, navigate to the *AutoMLONNXConsoleApp* directory.

    ```bash
    cd AutoMLONNXConsoleApp
    ```

## Add software packages

1. Install the **Microsoft.ML**, **Microsoft.ML.OnnxRuntime**, and **Microsoft.ML.OnnxTransformer** NuGet packages using the .NET Core CLI.

    ```dotnetcli
    dotnet add package Microsoft.ML
    dotnet add package Microsoft.ML.OnnxRuntime
    dotnet add package Microsoft.ML.OnnxTransformer
    ```

    These packages contain the dependencies required to use an ONNX model in a .NET application. ML.NET provides an API that uses the [ONNX runtime](https://github.com/Microsoft/onnxruntime) for predictions.

1. Open the *Program.cs* file and add the following `using` statements at the top to reference the appropriate packages.

    ```csharp
    using System.Linq;
    using Microsoft.ML;
    using Microsoft.ML.Data;
    using Microsoft.ML.Transforms.Onnx;
    ```

## Add a reference to the ONNX model

A way for the console application to access the ONNX model is to add it to the build output directory.  To learn more about MSBuild common items, see the [MSBuild guide](/visualstudio/msbuild/common-msbuild-project-items).

Add a reference to your ONNX model file in your application

1. Copy your ONNX model to your application's *AutoMLONNXConsoleApp* root directory.
1. Open the *AutoMLONNXConsoleApp.csproj* file and add the following content inside the `Project` node.

    ```xml
    <ItemGroup>
        <None Include="automl-model.onnx">
            <CopyToOutputDirectory>PreserveNewest</CopyToOutputDirectory>
        </None>
    </ItemGroup>
    ```

    In this case, the name of the ONNX model file is *automl-model.onnx*.

1. Open the *Program.cs* file and add the following line inside the `Program` class.

    ```csharp
    static string ONNX_MODEL_PATH = "automl-model.onnx";
    ```

## Initialize MLContext

Inside the `Main` method of your `Program` class, create a new instance of [`MLContext`](xref:Microsoft.ML.MLContext).

```csharp
MLContext mlContext = new MLContext();
```

The [`MLContext`](xref:Microsoft.ML.MLContext) class is a starting point for all ML.NET operations, and initializing `mlContext` creates a new ML.NET environment that can be shared across the model lifecycle. It's similar, conceptually, to DbContext in Entity Framework.

## Define the model data schema

Your model expects your input and output data in a specific format. ML.NET allows you to define the format of your data via classes. Sometimes you may already know what that format looks like. In cases when you don't know the data format, you can use tools like Netron to inspect your ONNX model.

The model used in this sample uses data from the NYC TLC Taxi Trip dataset. A sample of the data can be seen below:

|vendor_id|rate_code|passenger_count|trip_time_in_secs|trip_distance|payment_type|fare_amount|
|---|---|---|---|---|---|---|
|VTS|1|1|1140|3.75|CRD|15.5|
|VTS|1|1|480|2.72|CRD|10.0|
|VTS|1|1|1680|7.8|CSH|26.5|

### Inspect the ONNX model (optional)

Use a tool like Netron to inspect your model's inputs and outputs.

1. Open Netron.
1. In the top menu bar, select **File > Open** and use the file browser to select your model.
1. Your model opens. For example, the structure of the *automl-model.onnx* model looks like the following:

    :::image type="content" source="media/how-to-use-automl-onnx-model-dotnet/netron-automl-onnx-model.png" alt-text="Netron AutoML ONNX Model":::

1. Select the last node at the bottom of the graph (`variable_out1` in this case) to display the model's metadata. The inputs and outputs on the sidebar show you the model's expected inputs, outputs, and data types. Use this information to define the input and output schema of your model.

### Define model input schema

Create a new class called `OnnxInput` with the following properties inside the *Program.cs* file.

```csharp
public class OnnxInput
{
    [ColumnName("vendor_id")]
    public string VendorId { get; set; }

    [ColumnName("rate_code"),OnnxMapType(typeof(Int64),typeof(Single))]
    public Int64 RateCode { get; set; }

    [ColumnName("passenger_count"), OnnxMapType(typeof(Int64), typeof(Single))]
    public Int64 PassengerCount { get; set; }

    [ColumnName("trip_time_in_secs"), OnnxMapType(typeof(Int64), typeof(Single))]
    public Int64 TripTimeInSecs { get; set; }

    [ColumnName("trip_distance")]
    public float TripDistance { get; set; }

    [ColumnName("payment_type")]
    public string PaymentType { get; set; }
}
```

Each of the properties maps to a column in the dataset. The properties are further annotated with attributes.

The [`ColumnName`](xref:Microsoft.ML.Data.ColumnNameAttribute) attribute lets you specify how ML.NET should reference the column when operating on the data. For example, although the `TripDistance` property follows standard .NET naming conventions, the model only knows of a column or feature known as `trip_distance`. To address this naming discrepancy, the [`ColumnName`](xref:Microsoft.ML.Data.ColumnNameAttribute) attribute maps the `TripDistance` property to a column or feature by the name `trip_distance`.
  
For numerical values, ML.NET only operates on [`Single`](xref:System.Single) value types. However, the original data type of some of the columns are integers. The [`OnnxMapType`](xref:Microsoft.ML.Transforms.Onnx.OnnxMapTypeAttribute) attribute maps types between ONNX and ML.NET.

To learn more about data attributes, see the [ML.NET load data guide](/dotnet/machine-learning/how-to-guides/load-data-ml-net).

### Define model output schema

Once the data is processed, it produces an output of a certain format. Define your data output schema. Create a new class called `OnnxOutput` with the following properties inside the *Program.cs* file.

```csharp
public class OnnxOutput
{
    [ColumnName("variable_out1")]
    public float[] PredictedFare { get; set; }
}
```

Similar to `OnnxInput`, use the [`ColumnName`](xref:Microsoft.ML.Data.ColumnNameAttribute) attribute to map the `variable_out1` output to a more descriptive name `PredictedFare`.

## Define a prediction pipeline

A pipeline in ML.NET is typically a series of chained transformations that operate on the input data to produce an output. To learn more about data transformations, see the [ML.NET data transformation guide](/dotnet/machine-learning/resources/transforms).

1. Create a new method called `GetPredictionPipeline` inside the `Program` class

    ```csharp
    static ITransformer GetPredictionPipeline(MLContext mlContext)
    {

    }
    ```

1. Define the name of the input and output columns. Add the following code inside the `GetPredictionPipeline` method.

    ```csharp
    var inputColumns = new string []
    {
        "vendor_id", "rate_code", "passenger_count", "trip_time_in_secs", "trip_distance", "payment_type"
    };

    var outputColumns = new string [] { "variable_out1" };
    ```

1. Define your pipeline. An [`IEstimator`](xref:Microsoft.ML.IEstimator%601) provides a blueprint of the operations, input, and output schemas of your pipeline.

    ```csharp
    var onnxPredictionPipeline =
        mlContext
            .Transforms
            .ApplyOnnxModel(
                outputColumnNames: outputColumns,
                inputColumnNames: inputColumns,
                ONNX_MODEL_PATH);
    ```

    In this case, [`ApplyOnnxModel`](xref:Microsoft.ML.OnnxCatalog.ApplyOnnxModel%2A) is the only transform in the pipeline, which takes in the names of the input and output columns as well as the path to the ONNX model file.

1. An [`IEstimator`](xref:Microsoft.ML.IEstimator%601) only defines the set of operations to apply to your data. What operates on your data is known as an [`ITransformer`](xref:Microsoft.ML.ITransformer). Use the `Fit` method to create one from your `onnxPredictionPipeline`.

    ```csharp
    var emptyDv = mlContext.Data.LoadFromEnumerable(new OnnxInput[] {});

    return onnxPredictionPipeline.Fit(emptyDv);
    ```

    The [`Fit`](xref:Microsoft.ML.IEstimator%601.Fit%2A) method expects an [`IDataView`](xref:Microsoft.ML.IDataView) as input to perform the operations on. An [`IDataView`](xref:Microsoft.ML.IDataView) is a way to represent data in ML.NET using a tabular format. Since in this case the pipeline is only used for predictions, you can provide an empty [`IDataView`](xref:Microsoft.ML.IDataView) to give the [`ITransformer`](xref:Microsoft.ML.ITransformer) the necessary input and output schema information. The fitted [`ITransformer`](xref:Microsoft.ML.ITransformer) is then returned for further use in your application.

    > [!TIP]
    > In this sample, the pipeline is defined and used within the same application. However, it is recommended that you use separate applications to define and use your pipeline to make predictions. In ML.NET your pipelines can be serialized and saved for further use in other .NET end-user applications. ML.NET supports various deployment targets such as desktop applications, web services, WebAssembly applications*, and many more. To learn more about saving pipelines, see the [ML.NET save and load trained models guide](/dotnet/machine-learning/how-to-guides/save-load-machine-learning-models-ml-net).
    >
    > *WebAssembly is only supported in .NET Core 5 or greater

1. Inside the `Main` method, call the `GetPredictionPipeline` method with the required parameters.

    ```csharp
    var onnxPredictionPipeline = GetPredictionPipeline(mlContext);
    ```

## Use the model to make predictions

Now that you have a pipeline, it's time to use it to make predictions. ML.NET provides a convenience API for making predictions on a single data instance called [`PredictionEngine`](xref:Microsoft.ML.PredictionEngine%602).

1. Inside the `Main` method, create a [`PredictionEngine`](xref:Microsoft.ML.PredictionEngine%602) by using the [`CreatePredictionEngine`](xref:Microsoft.ML.ModelOperationsCatalog.CreatePredictionEngine%2A) method.

    ```csharp
    var onnxPredictionEngine = mlContext.Model.CreatePredictionEngine<OnnxInput, OnnxOutput>(onnxPredictionPipeline);
    ```

1. Create a test data input.

    ```csharp
    var testInput = new OnnxInput
    {
        VendorId = "CMT",
        RateCode = 1,
        PassengerCount = 1,
        TripTimeInSecs = 1271,
        TripDistance = 3.8f,
        PaymentType = "CRD"
    };
    ```

1. Use the `predictionEngine` to make predictions based on the new `testInput` data using the [`Predict`](xref:Microsoft.ML.PredictionEngineBase%602.Predict%2A) method.

    ```csharp
    var prediction = onnxPredictionEngine.Predict(testInput);
    ```

1. Output the result of your prediction to the console.

    ```csharp
    Console.WriteLine($"Predicted Fare: {prediction.PredictedFare.First()}");
    ```

1. Use the .NET Core CLI to run your application.

    ```dotnetcli
    dotnet run
    ```

    The result should look as similar to the following output:

    ```text
    Predicted Fare: 15.621523
    ```

To learn more about making predictions in ML.NET, see the [use a model to make predictions guide](/dotnet/machine-learning/how-to-guides/machine-learning-model-predictions-ml-net).

## Next steps

- [Deploy your model as an ASP.NET Core Web API](/dotnet/machine-learning/how-to-guides/serve-model-web-api-ml-net)
- [Deploy your model as a serverless .NET Azure Function](/dotnet/machine-learning/how-to-guides/serve-model-serverless-azure-functions-ml-net)
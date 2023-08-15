---
title: Deploy and run MLflow models in Spark jobs
titleSuffix: Azure Machine Learning
description: Learn to deploy your MLflow model in Spark jobs to perform inference.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
author: santiagxf
ms.author: fasantia
ms.reviewer: mopeakande
ms.date: 12/30/2022
ms.topic: how-to
ms.custom: deploy, mlflow, devplatv2, no-code-deployment, devx-track-azurecli, cliv2, event-tier1-build-2022
---

# Deploy and run MLflow models in Spark jobs

In this article, learn how to deploy and run your [MLflow](https://www.mlflow.org) model in Spark jobs to perform inference over large amounts of data or as part of data wrangling jobs.


## About this example

This example shows how you can deploy an MLflow model registered in Azure Machine Learning to Spark jobs running in [managed Spark clusters (preview)](how-to-submit-spark-jobs.md), Azure Databricks, or Azure Synapse Analytics, to perform inference over large amounts of data. 

The model is based on the [UCI Heart Disease Data Set](https://archive.ics.uci.edu/ml/datasets/Heart+Disease). The database contains 76 attributes, but we are using a subset of 14 of them. The model tries to predict the presence of heart disease in a patient. It is integer valued from 0 (no presence) to 1 (presence). It has been trained using an `XGBBoost` classifier and all the required preprocessing has been packaged as a `scikit-learn` pipeline, making this model an end-to-end pipeline that goes from raw data to predictions.

The information in this article is based on code samples contained in the [azureml-examples](https://github.com/azure/azureml-examples) repository. To run the commands locally without having to copy/paste files, clone the repo, and then change directories to `sdk/using-mlflow/deploy`.

```azurecli
git clone https://github.com/Azure/azureml-examples --depth 1
cd sdk/python/using-mlflow/deploy
```

## Prerequisites

Before following the steps in this article, make sure you have the following prerequisites:

[!INCLUDE [mlflow-prereqs](includes/machine-learning-mlflow-prereqs.md)]

- You must have a MLflow model registered in your workspace. Particularly, this example will register a model trained for the [Diabetes dataset](https://www4.stat.ncsu.edu/~boos/var.select/diabetes.html).


### Connect to your workspace

First, let's connect to Azure Machine Learning workspace where your model is registered.

# [Azure Machine Learning compute](#tab/aml)

Tracking is already configured for you. Your default credentials will also be used when working with MLflow.

# [Remote compute](#tab/remote)

**Configure tracking URI**

[!INCLUDE [configure-mlflow-tracking](includes/machine-learning-mlflow-configure-tracking.md)]

**Configure authentication**

Once the tracking is configured, you'll also need to configure how the authentication needs to happen to the associated workspace. By default, the Azure Machine Learning plugin for MLflow will perform interactive authentication by opening the default browser to prompt for credentials. Refer to [Configure MLflow for Azure Machine Learning: Configure authentication](how-to-use-mlflow-configure-tracking.md#configure-authentication) to additional ways to configure authentication for MLflow in Azure Machine Learning workspaces.

[!INCLUDE [configure-mlflow-auth](includes/machine-learning-mlflow-configure-auth.md)]

---

### Registering the model

We need a model registered in the Azure Machine Learning registry to perform inference. In this case, we already have a local copy of the model in the repository, so we only need to publish the model to the registry in the workspace. You can skip this step if the model you are trying to deploy is already registered.
   
```python
model_name = 'heart-classifier'
model_local_path = "model"

registered_model = mlflow_client.create_model_version(
    name=model_name, source=f"file://{model_local_path}"
)
version = registered_model.version
```

Alternatively, if your model was logged inside of a run, you can register it directly.

> [!TIP]
> To register the model, you'll need to know the location where the model has been stored. If you are using `autolog` feature of MLflow, the path will depend on the type and framework of the model being used. We recommend to check the jobs output to identify which is the name of this folder. You can look for the folder that contains a file named `MLModel`. If you are logging your models manually using `log_model`, then the path is the argument you pass to such method. As an example, if you log the model using `mlflow.sklearn.log_model(my_model, "classifier")`, then the path where the model is stored is `classifier`.

```python
model_name = 'heart-classifier'

registered_model = mlflow_client.create_model_version(
    name=model_name, source=f"runs://{RUN_ID}/{MODEL_PATH}"
)
version = registered_model.version
```

> [!NOTE]
> The path `MODEL_PATH` is the location where the model has been stored in the run.

---

### Get input data to score

We'll need some input data to run or jobs on. In this example, we'll download sample data from internet and place it in a shared storage used by the Spark cluster.

```python
import urllib

urllib.request.urlretrieve("https://azuremlexampledata.blob.core.windows.net/data/heart-disease-uci/data/heart.csv", "/tmp/data")
```

Move the data to a mounted storage account available to the entire cluster.

```python
dbutils.fs.mv("file:/tmp/data", "dbfs:/")
```

> [!IMPORTANT]
> The previous code uses `dbutils`, which is a tool available in Azure Databricks cluster. Use the appropriate tool depending on the platform you are using.

The input data is then placed in the following folder:

```python
input_data_path = "dbfs:/data"
```

## Run the model in Spark clusters

The following section explains how to run MLflow models registered in Azure Machine Learning in Spark jobs.

1. Ensure the following libraries are installed in the cluster:

    :::code language="yaml" source="~/azureml-examples-main/sdk/python/using-mlflow/deploy/model/conda.yaml" range="7-10":::

1. We'll use a notebook to demonstrate how to create a scoring routine with an MLflow model registered in Azure Machine Learning. Create a notebook and use PySpark as the default language.

1. Import the required namespaces:

    ```python
    import mlflow
    import pyspark.sql.functions as f
    ```  

1. Configure the model URI. The following URI brings a model named `heart-classifier` in its latest version.

    ```python
    model_uri = "models:/heart-classifier/latest"
    ```

1. Load the model as an UDF function. A user-defined function (UDF) is a function defined by a user, allowing custom logic to be reused in the user environment.

    ```python
    predict_function = mlflow.pyfunc.spark_udf(spark, model_uri, result_type='double') 
    ```

    > [!TIP]
    > Use the argument `result_type` to control the type returned by the `predict()` function.

1. Read the data you want to score:

    ```python
    df = spark.read.option("header", "true").option("inferSchema", "true").csv(input_data_path).drop("target")
    ```

    In our case, the input data is on `CSV` format and placed in the folder `dbfs:/data/`. We're also dropping the column `target` as this dataset contains the target variable to predict. In production scenarios, your data won't have this column.

1. Run the function `predict_function` and place the predictions on a new column. In this case, we're placing the predictions in the column `predictions`.

    ```python
    df.withColumn("predictions", score_function(*df.columns))
    ```

    > [!TIP]
    > The `predict_function` receives as arguments the columns required. In our case, all the columns of the data frame are expected by the model and hence `df.columns` is used. If your model requires a subset of the columns, you can introduce them manually. If you model has a signature, types need to be compatible between inputs and expected types.

1. You can write your predictions back to storage:

    ```python
    scored_data_path = "dbfs:/scored-data"
    scored_data.to_csv(scored_data_path)
    ```

## Run the model in a standalone Spark job in Azure Machine Learning

 Azure Machine Learning supports creation of a standalone Spark job, and creation of a reusable Spark component that can be used in [Azure Machine Learning pipelines](concept-ml-pipelines.md). In this example, we'll deploy a scoring job that runs in Azure Machine Learning standalone Spark job and runs an MLflow model to perform inference.

> [!NOTE]
> To learn more about Spark jobs in Azure Machine Learning, see [Submit Spark jobs in Azure Machine Learning (preview)](how-to-submit-spark-jobs.md).

1. A Spark job requires a Python script that takes arguments. Create a scoring script:

    __score.py__

    ```python
    import argparse
    
    parser = argparse.ArgumentParser()
    parser.add_argument("--model")
    parser.add_argument("--input_data")
    parser.add_argument("--scored_data")
    
    args = parser.parse_args()
    print(args.model)
    print(args.input_data)
    
    # Load the model as an UDF function
    predict_function = mlflow.pyfunc.spark_udf(spark, args.model, env_manager="conda")
    
    # Read the data you want to score
    df = spark.read.option("header", "true").option("inferSchema", "true").csv(input_data).drop("target")
    
    # Run the function `predict_function` and place the predictions on a new column
    scored_data = df.withColumn("predictions", score_function(*df.columns))
    
    # Save the predictions
    scored_data.to_csv(args.scored_data)
    ```
    
    The above script takes three arguments `--model`, `--input_data` and `--scored_data`. The first two are inputs and represent the model we want to run and the input data, the last one is an output and it is the output folder where predictions will be placed.

    > [!TIP]
    > **Installation of Python packages:** The previous scoring script loads the MLflow model into an UDF function, but it indicates the parameter `env_manager="conda"`. When this parameter is set, MLflow will restore the required packages as specified in the model definition in an isolated environment where only the UDF function runs. For more details see [`mlflow.pyfunc.spark_udf`](https://mlflow.org/docs/latest/python_api/mlflow.pyfunc.html?highlight=env_manager#mlflow.pyfunc.spark_udf) documentation.

1. Create a job definition:

    __mlflow-score-spark-job.yml__

    ```yml
    $schema: http://azureml/sdk-2-0/SparkJob.json
    type: spark
    
    code: ./src
    entry:
      file: score.py
    
    conf:
      spark.driver.cores: 1
      spark.driver.memory: 2g
      spark.executor.cores: 2
      spark.executor.memory: 2g
      spark.executor.instances: 2
    
    inputs:
      model:
        type: mlflow_model
        path: azureml:heart-classifier@latest
      input_data:
        type: uri_file
        path: https://azuremlexampledata.blob.core.windows.net/data/heart-disease-uci/data/heart.csv
        mode: direct
    
    outputs:
      scored_data:
        type: uri_folder
    
    args: >-
      --model ${{inputs.model}}
      --input_data ${{inputs.input_data}}
      --scored_data ${{outputs.scored_data}}
    
    identity:
      type: user_identity
    
    resources:
      instance_type: standard_e4s_v3
      runtime_version: "3.2"
    ```

    > [!TIP]
    > To use an attached Synapse Spark pool, define `compute` property in the sample YAML specification file shown above instead of `resources` property.

1. The YAML files shown above can be used in the `az ml job create` command, with the `--file` parameter, to create a standalone Spark job as shown:

    ```azurecli
    az ml job create -f mlflow-score-spark-job.yml
    ```

## Next steps

- [Deploy MLflow models to batch endpoints](how-to-mlflow-batch.md)
- [Deploy MLflow models to online endpoint](how-to-deploy-mlflow-models-online-endpoints.md)
- [Using MLflow models for no-code deployment](how-to-log-mlflow-models.md)
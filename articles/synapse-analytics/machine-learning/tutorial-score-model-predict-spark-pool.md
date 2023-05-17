---
title: 'Tutorial: Score machine learning models with PREDICT in serverless Apache Spark pools'
description: Learn how to use PREDICT functionality in serverless Apache Spark pools for predicting scores through machine learning models.
ms.service: synapse-analytics
ms.subservice: machine-learning
ms.topic: tutorial
ms.reviewer: sngun, garye
ms.date: 11/02/2021
author: nelgson
ms.author: negust
ms.custom: ignite-fall-2021
---

# Tutorial: Score machine learning models with PREDICT in serverless Apache Spark pools

Learn how to use PREDICT functionality in serverless Apache Spark pools in Azure Synapse Analytics for score prediction. You can use a trained model registered in Azure Machine Learning (AML) or in the default Azure Data Lake Storage (ADLS) in your Synapse workspace.

PREDICT in a Synapse PySpark notebook provides you the capability to score machine learning models using the SQL language, user defined functions (UDF), or Transformers. With PREDICT, you can bring your existing machine learning models trained outside Synapse and registered in Azure Data Lake Storage Gen2 or Azure Machine Learning, to score historical data within the secure boundaries of Azure Synapse Analytics. The PREDICT function takes a model and data as inputs. This feature eliminates the step of moving valuable data outside of Synapse for scoring. The goal is to empower model consumers to easily infer machine learning models in Synapse as well as collaborate seamlessly with model producers working with the right framework for their task.


In this tutorial, you'll learn how to:

> [!div class="checklist"]
> - Predict scores for data in a serverless Apache Spark pool using machine learning models which are trained outside Synapse and registered in Azure Machine Learning or Azure Data Lake Storage Gen2.

If you don't have an Azure subscription, [create a free account before you begin](https://azure.microsoft.com/free/).

## Prerequisites

- [Azure Synapse Analytics workspace](../get-started-create-workspace.md) with an Azure Data Lake Storage Gen2 storage account configured as the default storage. You need to be the *Storage Blob Data Contributor* of the Data Lake Storage Gen2 file system that you work with.
- Serverless Apache Spark pool in your Azure Synapse Analytics workspace. For details, see [Create a Spark pool in Azure Synapse](../get-started-analyze-spark.md).
- Azure Machine Learning workspace is needed if you want to train or register model in Azure Machine Learning. For details, see [Manage Azure Machine Learning workspaces in the portal or with the Python SDK](../../machine-learning/how-to-manage-workspace.md).
- If your model is registered in Azure Machine Learning then you need a linked service. In Azure Synapse Analytics, a linked service defines your connection information to the service. In this tutorial, you'll add an Azure Synapse Analytics and Azure Machine Learning linked service. To learn more, see [Create a new Azure Machine Learning linked service in Synapse](quickstart-integrate-azure-machine-learning.md).
- The PREDICT functionality requires that you already have a trained model which is either registered in Azure Machine Learning or uploaded in Azure Data Lake Storage Gen2.

> [!NOTE]
> - PREDICT feature is supported on **Spark3** serverless Apache Spark pool in Azure Synapse Analytics. **Python 3.8** is recommended version for model creation and training. 
> - PREDICT supports most machine learning models packages in **MLflow** format: **TensorFlow, ONNX, PyTorch, SkLearn and pyfunc** are supported in this preview.
> - PREDICT supports **AML and ADLS** model source. Here ADLS account refers to **default Synapse workspace ADLS account**. 


## Sign in to the Azure portal

Sign in to the [Azure portal](https://portal.azure.com/).


## Use PREDICT for MLFLOW packaged models

Make sure all prerequisites are in place before following these steps for using PREDICT.

1. **Import libraries:** Import the following libraries to use PREDICT in spark session.

   ```python
   #Import libraries
   from pyspark.sql.functions import col, pandas_udf,udf,lit
   from azureml.core import Workspace
   from azureml.core.authentication import ServicePrincipalAuthentication
   import azure.synapse.ml.predict as pcontext
   import azure.synapse.ml.predict.utils._logger as synapse_predict_logger
   ```

2. **Set parameters using variables:** Synapse ADLS data path and model URI need to be set using input variables. You also need to define runtime which is "mlflow" and the data type of model output return. Please note that all data types which are supported in PySpark are supported through PREDICT also.

   > [!NOTE]
   > Before running this script, update it with the URI for ADLS Gen2 data file along with model output return data type and ADLS/AML URI for the model file.

   ```python
   #Set input data path
   DATA_FILE = "abfss://<filesystemname>@<account name>.dfs.core.windows.net/<file path>"

   #Set model URI
       #Set AML URI, if trained model is registered in AML
          AML_MODEL_URI = "<aml model uri>" #In URI ":x" signifies model version in AML. You can   choose which model version you want to run. If ":x" is not provided then by default   latest version will be picked.

       #Set ADLS URI, if trained model is uploaded in ADLS
          ADLS_MODEL_URI = "abfss://<filesystemname>@<account name>.dfs.core.windows.net/<model   mlflow folder path>"

   #Define model return type
   RETURN_TYPES = "<data_type>" # for ex: int, float etc. PySpark data types are supported

   #Define model runtime. This supports only mlflow
   RUNTIME = "mlflow"
   ```

3. **Ways to authenticate AML workspace:** If the model is stored in the default ADLS account of Synapse workspace, then you do not need any further authentication setup. If the model is registered in Azure Machine Learning, then you can choose either of the following two supported ways of authentication.

   > [!NOTE]
   > Update tenant, client, subscription, resource group, AML workspace and linked service details in this script before running it.

   - **Through service principal:** You can use service principal client ID and secret directly to authenticate to AML workspace. Service principal must have "Contributor" access to the AML workspace.

      ```python
      #AML workspace authentication using service principal
      AZURE_TENANT_ID = "<tenant_id>"
      AZURE_CLIENT_ID = "<client_id>"
      AZURE_CLIENT_SECRET = "<client_secret>"

      AML_SUBSCRIPTION_ID = "<subscription_id>"
      AML_RESOURCE_GROUP = "<resource_group_name>"
      AML_WORKSPACE_NAME = "<aml_workspace_name>"

      svc_pr = ServicePrincipalAuthentication( 
          tenant_id=AZURE_TENANT_ID,
          service_principal_id=AZURE_CLIENT_ID,
          service_principal_password=AZURE_CLIENT_SECRET
      )

      ws = Workspace(
          workspace_name = AML_WORKSPACE_NAME,
          subscription_id = AML_SUBSCRIPTION_ID,
          resource_group = AML_RESOURCE_GROUP,
          auth=svc_pr
      )
      ```

   - **Through linked service:** You can use linked service to authenticate to AML workspace. Linked service can use "service principal" or Synapse workspace's "Managed Service Identity (MSI)" for authentication. "Service principal" or "Managed Service Identity (MSI)" must have "Contributor" access to the AML workspace.

      ```python
      #AML workspace authentication using linked service
      from notebookutils.mssparkutils import azureML
      ws = azureML.getWorkspace("<linked_service_name>") #   "<linked_service_name>" is the linked service name, not AML workspace name. Also, linked   service supports MSI and service principal both
      ```

4. **Enable PREDICT in spark session:** Set the spark configuration `spark.synapse.ml.predict.enabled` to `true` to enable the library.

   ```python
   #Enable SynapseML predict
   spark.conf.set("spark.synapse.ml.predict.enabled","true")
   ```

5. **Bind model in spark session:** Bind model with required inputs so that the model can be referred in the spark session. Also define alias so that you can use same alias in the PREDICT call.

   > [!NOTE]
   > Update model alias and model uri in this script before running it.

   ```python
   #Bind model within Spark session
    model = pcontext.bind_model(
     return_types=RETURN_TYPES, 
     runtime=RUNTIME, 
     model_alias="<random_alias_name>", #This alias will be used in PREDICT call to refer  this   model
     model_uri=ADLS_MODEL_URI, #In case of AML, it will be AML_MODEL_URI
     aml_workspace=ws #This is only for AML. In case of ADLS, this parameter can be removed
     ).register()
   ```

6. **Read data from ADLS:** Read data from ADLS. Create spark dataframe and a view on top of data frame.

   > [!NOTE]
   > Update view name in this script before running it.

   ```python
   #Read data from ADLS
   df = spark.read \
    .format("csv") \
    .option("header", "true") \
    .csv(DATA_FILE,
        inferSchema=True)
   df.createOrReplaceTempView('<view_name>')
   ```

7. **Generate score using PREDICT:** You can call PREDICT three ways, using Spark SQL API, using User define function (UDF), and using Transformer API. Following are examples.

   > [!NOTE]
   > Update the model alias name, view name, and comma separated model input column name in this script before running it. Comma separated model input columns are the same as those used while training the model.

   ```python
   #Call PREDICT using Spark SQL API

   predictions = spark.sql(
                  """
                      SELECT PREDICT('<random_alias_name>',
                                <comma_separated_model_input_column_name>) AS predict 
                      FROM <view_name>
                  """
              ).show()
   ```

   ```python
   #Call PREDICT using user defined function (UDF)

   df = df[<comma_separated_model_input_column_name>] # for ex. df["empid","empname"]

   df.withColumn("PREDICT",model.udf(lit("<random_alias_name>"),*df.columns)).show()
   ```

   ```python
   #Call PREDICT using Transformer API

   columns = [<comma_separated_model_input_column_name>] # for ex. df["empid","empname"]

   tranformer = model.create_transformer().setInputCols(columns).setOutputCol("PREDICT")

   tranformer.transform(df).show()
   ```

## Sklearn example using PREDICT

1. Import libraries and read the training dataset from ADLS.

   ```python
   # Import libraries and read training dataset from ADLS

   import fsspec
   import pandas
   from fsspec.core import split_protocol

   adls_account_name = 'xyz' #Provide exact ADLS account name
   adls_account_key = 'xyz' #Provide exact ADLS account key

   fsspec_handle = fsspec.open('abfs[s]://<container>/<path-to-file>',      account_name=adls_account_name, account_key=adls_account_key)

   with fsspec_handle.open() as f:
       train_df = pandas.read_csv(f)
   ```

1. Train model and generate mlflow artifacts.

   ```python
   # Train model and generate mlflow artifacts

   import os
   import shutil
   import mlflow
   import json
   from mlflow.utils import model_utils
   import numpy as np
   import pandas as pd
   from sklearn.linear_model import LinearRegression


   class LinearRegressionModel():
     _ARGS_FILENAME = 'args.json'
     FEATURES_KEY = 'features'
     TARGETS_KEY = 'targets'
     TARGETS_PRED_KEY = 'targets_pred'

     def __init__(self, fit_intercept, nb_input_features=9, nb_output_features=1):
       self.fit_intercept = fit_intercept
       self.nb_input_features = nb_input_features
       self.nb_output_features = nb_output_features

     def get_args(self):
       args = {
           'nb_input_features': self.nb_input_features,
           'nb_output_features': self.nb_output_features,
           'fit_intercept': self.fit_intercept
       }
       return args

     def create_model(self):
       self.model = LinearRegression(fit_intercept=self.fit_intercept)

     def train(self, dataset):

       features = np.stack([sample for sample in iter(
           dataset[LinearRegressionModel.FEATURES_KEY])], axis=0)

       targets = np.stack([sample for sample in iter(
           dataset[LinearRegressionModel.TARGETS_KEY])], axis=0)


       self.model.fit(features, targets)

     def predict(self, dataset):
       features = np.stack([sample for sample in iter(
           dataset[LinearRegressionModel.FEATURES_KEY])], axis=0)
       targets_pred = self.model.predict(features)
       return targets_pred

     def save(self, path):
       if os.path.exists(path):
         shutil.rmtree(path)

       # save the sklearn model with mlflow
       mlflow.sklearn.save_model(self.model, path)

       # save args
       self._save_args(path)

     def _save_args(self, path):
       args_filename = os.path.join(path, LinearRegressionModel._ARGS_FILENAME)
       with open(args_filename, 'w') as f:
         args = self.get_args()
         json.dump(args, f)


   def train(train_df, output_model_path):
     print(f"Start to train LinearRegressionModel.")

     # Initialize input dataset
     dataset = train_df.to_numpy()
     datasets = {}
     datasets['targets'] = dataset[:, -1]
     datasets['features'] = dataset[:, :9]

     # Initialize model class obj
     model_class = LinearRegressionModel(fit_intercept=10)
     with mlflow.start_run(nested=True) as run:
       model_class.create_model()
       model_class.train(datasets)
       model_class.save(output_model_path)
       print(model_class.predict(datasets))


   train(train_df, './artifacts/output')
   ```

1. Store model MLFLOW artifacts in ADLS or register in AML.

   ```python
   # Store model MLFLOW artifacts in ADLS

   STORAGE_PATH = 'abfs[s]://<container>/<path-to-store-folder>'

   protocol, _ = split_protocol(STORAGE_PATH)
   print (protocol)

   storage_options = {
       'account_name': adls_account_name,
       'account_key': adls_account_key
   }
   fs = fsspec.filesystem(protocol, **storage_options)
   fs.put(
       './artifacts/output',
       STORAGE_PATH, 
       recursive=True, overwrite=True)
   ```

   ```python
   # Register model MLFLOW artifacts in AML

   from azureml.core import Workspace, Model
   from azureml.core.authentication import ServicePrincipalAuthentication

   AZURE_TENANT_ID = "xyz"
   AZURE_CLIENT_ID = "xyz"
   AZURE_CLIENT_SECRET = "xyz"

   AML_SUBSCRIPTION_ID = "xyz"
   AML_RESOURCE_GROUP = "xyz"
   AML_WORKSPACE_NAME = "xyz"

   svc_pr = ServicePrincipalAuthentication( 
       tenant_id=AZURE_TENANT_ID,
       service_principal_id=AZURE_CLIENT_ID,
       service_principal_password=AZURE_CLIENT_SECRET
   )

   ws = Workspace(
       workspace_name = AML_WORKSPACE_NAME,
       subscription_id = AML_SUBSCRIPTION_ID,
       resource_group = AML_RESOURCE_GROUP,
       auth=svc_pr
   )

   model = Model.register(
       model_path="./artifacts/output",
       model_name="xyz",
       workspace=ws,
   )
   ```

1. Set required parameters using variables.

   ```python
   # If using ADLS uploaded model

   import pandas as pd
   from pyspark.sql import SparkSession
   from pyspark.sql.functions import col, pandas_udf,udf,lit
   import azure.synapse.ml.predict as pcontext
   import azure.synapse.ml.predict.utils._logger as synapse_predict_logger

   DATA_FILE = "abfss://xyz@xyz.dfs.core.windows.net/xyz.csv"
   ADLS_MODEL_URI_SKLEARN = "abfss://xyz@xyz.dfs.core.windows.net/mlflow/sklearn/     e2e_linear_regression/"
   RETURN_TYPES = "INT"
   RUNTIME = "mlflow"
   ```

   ```python
   # If using AML registered model

   from pyspark.sql.functions import col, pandas_udf,udf,lit
   from azureml.core import Workspace
   from azureml.core.authentication import ServicePrincipalAuthentication
   import azure.synapse.ml.predict as pcontext
   import azure.synapse.ml.predict.utils._logger as synapse_predict_logger

   DATA_FILE = "abfss://xyz@xyz.dfs.core.windows.net/xyz.csv"
   AML_MODEL_URI_SKLEARN = "aml://xyz"
   RETURN_TYPES = "INT"
   RUNTIME = "mlflow"
   ```

1. Enable SynapseML PREDICT functionality in spark session.

   ```python
   spark.conf.set("spark.synapse.ml.predict.enabled","true")
   ```

1. Bind model in spark session.

   ```python
   # If using ADLS uploaded model

   model = pcontext.bind_model(
    return_types=RETURN_TYPES, 
    runtime=RUNTIME, 
    model_alias="sklearn_linear_regression",
    model_uri=ADLS_MODEL_URI_SKLEARN,
    ).register()
   ```

   ```python
   # If using AML registered model

   model = pcontext.bind_model(
    return_types=RETURN_TYPES, 
    runtime=RUNTIME, 
    model_alias="sklearn_linear_regression",
    model_uri=AML_MODEL_URI_SKLEARN,
    aml_workspace=ws
    ).register()
   ```

1. Load test data from ADLS.

   ```python
   # Load data from ADLS

   df = spark.read \
       .format("csv") \
       .option("header", "true") \
       .csv(DATA_FILE,
           inferSchema=True)
   df = df.select(df.columns[:9])
   df.createOrReplaceTempView('data')
   df.show(10)
   ```

1. Call PREDICT to generate the score.

   ```python
   # Call PREDICT

   predictions = spark.sql(
                     """
                         SELECT PREDICT('sklearn_linear_regression', *) AS predict FROM data
                     """
                 ).show()
   ```


## Next steps

- [Machine Learning capabilities in Azure Synapse Analytics](what-is-machine-learning.md)

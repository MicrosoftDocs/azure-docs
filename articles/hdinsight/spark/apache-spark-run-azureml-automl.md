---
title: Run Azure ML workloads with Auto ML on Apache Spark in Azure HDInsight
description: Learn how to run Azure ML workloads with AutoML on Apache Spark in Azure HDInsight.
services: hdinsight
author: hrasheed-msft
ms.author: hrasheed
ms.reviewer: jasonh
ms.service: hdinsight
ms.topic: howto
ms.date: 12/17/2018
---
# Run Azure ML workloads with AutoML on Apache Spark in Azure HDInsight

Azure Machine Learning (Azure ML) is a collaborative, drag-and-drop tool you can use to build, test, and deploy predictive analytics solutions on your data. Azure ML publishes models as web services that can easily be consumed by custom apps or BI tools such as Excel. AutoML helps create high-quality machine learning models using intelligent automation and optimization. AutoML decides the right algorithm and hyper parameters to use for specific problem types.

## Install AzureML on an HDInsight cluster

> [!Note]
> The Azure ML workspace is currently available in the following regions: eastus, eastus2 and westcentralus. The HDInsight cluster should also be created in one of these regions.

For general tutorials of Azure ML and AutoML, see [Tutorial: Create your first data science experiment in Azure Machine Learning Studio](../../machine-learning/studio/create-experiment) and [Tutorial: Use automated machine learning to build your regression model](../../machine-learning/service/tutorial-auto-train-models).
To install AzureML on your Azure HDInsight cluster, run the script action - [install_aml](https://commonartifacts.blob.core.windows.net/automl/install_aml.sh) - on head nodes and worker nodes of a HDInsight 3.6 Spark 2.3.0 cluster (recommended). This script action can be run either as part of the cluster creation process, or on an existing cluster through the Azure portal.

For more information about script actions, read [Customize Linux-based HDInsight clusters using script actions](../hdinsight-hadoop-customize-cluster-linux). Along with installing Azure ML packages and dependencies, the script also downloads a sample Jupyter Notebook (into path `HdiNotebooks/PySpark` of the default store) which demonstrates how to use Auto ML Classifier for a simple classification problem.

> [!Note]
> Azure ML packages are installed into Python3 conda environment. The installed Jupyter notebook should be run using the PySpark3 kernel.

## Authentication for workspace

Workspace creation and experiment submission require an authentication token. This token can be generated using an [Azure AD application](../../active-directory/develop/app-objects-and-service-principals). An [Azure AD user](https://docs.microsoft.com/en-us/python/azure/python-sdk-azure-authenticate?view=azure-python) can also be used to generate the required authentication token, if multi-factor authentication isn't enabled on the account.  

The following code snippet creates an authentication token using an **Azure AD application**.

```python
from azureml.core.authentication import ServicePrincipalAuthentication
auth_sp = ServicePrincipalAuthentication(
				tenant_id = '<Azure Tenant ID>',
				username = '<Azure AD Application ID>',
				password = '<Azure AD Application Key>'
				)
```
The following code snippet creates an authentication token using an **Azure AD user**.

```python
from azure.common.credentials import UserPassCredentials
credentials = UserPassCredentials('user@domain.com','my_smart_password')
```

## Loading dataset

AutoML on Spark uses **Dataflows**, which are lazily evaluated, immutable operations on data.  A Dataflow can load a dataset from a blob with public read access, or from a blob URL with a SAS token.

```python
import azureml.dataprep as dprep

dataflow_public = dprep.read_csv(path='https://commonartifacts.blob.core.windows.net/automl/UCI_Adult_train.csv')

dataflow_with_token = dprep.read_csv(path='https://dpreptestfiles.blob.core.windows.net/testfiles/read_csv_duplicate_headers.csv?st=2018-06-15T23%3A01%3A42Z&se=2019-06-16T23%3A01%3A00Z&sp=r&sv=2017-04-17&sr=b&sig=ugQQCmeC2eBamm6ynM7wnI%2BI3TTDTM6z9RPKj4a%2FU6g%3D')
```

You can also register the datastore with the workspace using a one-time registration.

## Experiment submission

In the AutoML configuration, the property `spark_context` should be set for AutoML to run on distributed mode. The property `concurrent_iterations`, which is the maximum number of iterations executed in parallel, should be set to a number less than the executor cores for the Spark app.

## Next Steps

For more information on the motivation behind AutoML, see [Release models at pace using Microsoft’s automated machine learning!](https://azure.microsoft.com/en-us/blog/release-models-at-pace-using-microsoft-s-automl/).
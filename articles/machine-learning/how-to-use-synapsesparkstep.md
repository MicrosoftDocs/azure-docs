---
title: Use Apache Spark in a machine learning pipeline
titleSuffix: Azure Machine Learning
description: Link your Synapse workspace to your Azure machine learning pipeline to use Spark for data manipulation.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.author: laobri
author: lobrien
ms.date: 02/25/2021
ms.topic: conceptual
ms.custom: how-to

# Customer intent: As a user of both Azure Machine Learning pipelines and Azure Synapse, I'd like to use Apache Spark for the data preparation of my pipeline

---

# How to use Apache Spark in your machine learning pipeline

In this article, you'll learn how to use Apache Spark pools backed by Synapse as the compute target for a data preparation step Azure Machine Learning pipeline. More intro tk. 

## Prerequisites

tk

## Create or retrieve the link between your Synapse workspace and your Azure Machine Learning workspace

You create and administer your Apache Spark pools in a Synapse workspace. To integrate a Spark pool with an Azure Machine Learning workspace, you must link the services. You may create the integration using Studio (see [Nina's article](tk)), or you may do it using the Python SDK. 

> [!Important]
> You must have **Owner** permission in the Synapse workspace in order to create a new integration. The integration itself must have {>> I don't understand this: there's a quote in the notebook that : 'Make sure you grant spark admin role of the synapse workspace to MSI in synapse studio before you submit job.' I need to Change this into declarative sentences with a single requirement. This section should contain all of the permission issues needed for creating a link. If permissions beyond the creation are necessary, I should have that in either prerequisites or a separate H2O on "confirming permissions" or something like that <<}

The following code creates a new linked service called `synapselink1` in your machine learning workspace:

```python
from azureml.core import Workspace, LinkedService, SynapseWorkspaceLinkedServiceConfiguration

ws = Workspace.from_config()

synapse_link_config = SynapseWorkspaceLinkedServiceConfiguration(
    subscription_id=ws.subscription_id,
    resource_group="myResourceGroup",
    name="mySynapseAnalyticsWorkspaceName"
)

linked_service = LinkedService.register(
    workspace=ws,
    name="synapselink1",
    linked_service_config=synapse_link_config)
```

First, `Workspace.from_config()` accesses your Azure Machine Learning workspace using the configuration in `config.json` (see [Tutorial: Get started with Azure Machine Learning in your development environment](tutorial-1st-experiment-sdk-setup-local.md)). Then, you link to your Synapse workspace by creating a `SynapseWorkspaceLinkedServiceConfiguration` object, passing your subscription ID, the name of the resource group in which the Synapse workspace exists, and the name of the Synapse workspace. Finally, you link the two services by calling `LinkedService.register()`.

You only need to register the linked service once in your Azure Machine Learning workspace. To retrieve all the linked services in your workspace, you can call `LinkedService.list(ws)`, or to retrieve a specific one: 

```python
linked_service = LinkedService.get(ws, 'synapselink1')
```

Retrieving and using an existing `LinkedService` does not require administrator permissions in the Synapse workspace, but it _does_ require **User** permission. {>> Check. <<}

## Attach your Synapse spark pool as a compute target for Azure Machine Learning

To use your Synapse spark pool to power a step in your machine learning pipeline, you must attach it as a `ComputeTarget` for the pipeline step, as shown in the following code.

```python
from azureml.core.compute import SynapseCompute, ComputeTarget

attach_config = SynapseCompute.attach_configuration(
        linked_service = linked_service,
        type="SynapseSpark",
        pool_name="spark01") # This name comes from your Synapse workspace

synapse_compute=ComputeTarget.attach(
        workspace=ws,
        name='link1-spark01',
        attach_configuration=attach_config)

synapse_compute.wait_for_completion()
```

The first step is to configure the `SynapseCompute`. The `linked_service` argument is the `LinkedService` object you created or retrieved in the previous step. The `type` argument must be `SynapseSpark`. The `pool_name` argument in `SynapseCompute.attach_configuration()` must match that of an existing pool in your Synapse workspace. For more information on creating an Apache spark pool in the Synapse workspace, see [appropriate article](tk). The type of `attach_config` is `ComputeTargetAttachConfiguration`.

Once the configuration is created, you create a machine learning `ComputeTarget` by passing in the `Workspace`, `ComputeTargetAttachConfiguration`, and the name by which you'd like to refer to the compute within the machine learning workspace. The call to `ComputeTarget.attach()` is asynchronous, so the sample blocks until the call completes.

## Create a `SynapseSparkStep` that uses the linked Apache spark pool

The sample notebook [tk notebook name](tk) defines a simple machine learning pipeline. First, the notebook defines a data preparation step powered by the `synapse_compute` defined in the previous step. Then,  the notebook defines a training step powered by a compute target better suited for training. The sample notebook uses the Titanic survival database to demonstrate data input and output, but does not actually attempt to clean the data or make a viable model. Since there's no real training in this sample, the training step uses inexpensive, CPU-based compute.

Data flows into a machine learning pipeline by way of `DatasetConsumptionConfig` objects, which can hold tabular data or sets of files. The data often originates in files stored in blob storage in a datastore associated with the machine learning workspace. The following code shows some typical code for creating input for a machine learning pipeline:

```python
from azureml.core import Dataset

datastore = ws.get_default_datastore()
file_name = 'Titanic.csv'

titanic_tabular_dataset = Dataset.Tabular.from_delimited_files(path=[(datastore, file_name)])
step1_input1 = titanic_tabular_dataset.as_named_input("tabular_input")

# Example only: it wouldn't make sense to duplicate input data, especially one as tabular and the other as files
titanic_file_dataset = Dataset.File.from_files(path=[(datastore, file_name)])
step1_input2 = titanic_file_dataset.as_named_input("file_input").as_hdfs()
```

The above code assumes that the file **Titanic.csv** is in blob storage. The code shows how to read the file as a `TabularDataset` and as a `FileDataset`. This code is for demonstration purposes only, as it would be confusing to duplicate inputs or to interpret a single data source as both a table-containing resource and just as a file.

When a step completes, you may choose to store output data using code similar to:

```python
from azureml.data import HDFSOutputDatasetConfig
step1_output = HDFSOutputDatasetConfig(destination=(datastore,"test")).register_on_complete(name="registered_dataset")
```

In this case, the data would be stored in the `datastore` in a file called **test** and would be available within the machine learning workspace as a `Dataset` with the name `registered_dataset`.

{>> Although the following block seems helpful, I don't think the sample notebook uses `run_config` in the pipeline. The sample NB seems to do the whole Spark configuration in the call to SynapseSparkStep <<}

~~In addition to data, a pipeline step may be configured to have per-step Python dependencies, use different compute resources, and so forth. This configuration is done using a `RunConfiguration` object, as shown in the following code:~~

```python
from azureml.core.environment import CondaDependencies
from azureml.core import RunConfiguration

conda = CondaDependencies.create(
    pip_indexurl='https://azuremlsdktestpypi.azureedge.net/sdk-release/master/588E708E0DF342C4A80BD954289657CF',
    pip_packages=['azureml-sdk<0.1.1', 'azureml-dataprep[fuse,pandas]>=1.1.19', 'azureml-telemetry'],
    pin_sdk_version=False
)

run_config = RunConfiguration(framework="pyspark")
run_config.target = 'link1-spark01'

run_config.spark.configuration["spark.driver.memory"] = "1g" 
run_config.spark.configuration["spark.driver.cores"] = 2 
run_config.spark.configuration["spark.executor.memory"] = "1g" 
run_config.spark.configuration["spark.executor.cores"] = 2 
run_config.spark.configuration["spark.executor.instances"] = 1 

run_config.environment.python.conda_dependencies = conda
```

~~{>> IMPORTANT: Is the `pip_indexurl` correct for public preview? Should I discuss it or does it go away? Also, the azureml-sdk<0.1.1 seems strange, since it seems like it's saying 'use an old version'. Should I address this in the article? <<}~~

~~The above code first creates a `CondaDependencies` object that specifies the dependencies upon which the Apache spark-based data preparation step relies (see [Use software environments](how-to-use-environments.md)). Then, the code creates a `RunConfiguration` object that is going to use the PySpark framework. ~~

{>> Cutting this short because, as mentioned above, I think this block is not used in the pipeline <<}

In addition to data, a pipeline step may have per-step Python dependencies. Individual `SynapseSparkStep` objects can specify their precise Synapse configuration, as well. 

```python
from azureml.core.environment import Environment
from azureml.pipeline.steps import SynapseSparkStep

env = Environment(name="myenv")
env.python.conda_dependencies.add_pip_package("azureml-core==1.20.0")

step_1 = SynapseSparkStep(name = 'synapse-spark',
                          file = 'dataprep.py',
                          source_directory="./code", 
                          inputs=[step1_input1, step1_input2],
                          outputs=[step1_output],
                          arguments = ["--tabular_input", step1_input1, 
                                       "--file_input", step1_input2,
                                       "--output_dir", step1_output],
                          compute_target = 'link1-spark01',
                          driver_memory = "7g",
                          driver_cores = 4,
                          executor_memory = "7g",
                          executor_cores = 2,
                          num_executors = 1,
                          environment = env)
```
{>> Question to devs: When I run this step, I receive warning Warning: Python dependency specified in environment conda dependencies is not supported in synapse spark pool. Could a different dependency be added? Either a workable azureml-core or even maybe a numpy or whatever? <<}

The above code specifies a single step in the Azure machine learning pipeline. This step's `environment` specifies a specific `azureml-core` version and could add other dependencies as necessary. 

The `SynapseSparkStep` will zip and upload from the local computer the subdirectory `./code`. That directory will be recreated on the compute server and the step will run the file **dataprep.py** from that directory. The `inputs` and `outputs` of that step are the `step1_input1`, `step1_input2`, and `step1_output` objects previously discussed. The easiest way to access those values within the **dataprep.py** script is to associate them with named `arguments`.

The next set of arguments to the `SynapseSparkStep` constructor control Apache spark. The `compute_target` is the `'link1-spark01'` that we attached as a compute target previously. The other parameters specify the memory and cores we'd like to use.

The sample notebook uses the following code for **dataprep.py**:

```python
import os
import sys
import azureml.core
from pyspark.sql import SparkSession
from azureml.core import Run, Dataset

print(azureml.core.VERSION)
print(os.environ)

import argparse
parser = argparse.ArgumentParser()
parser.add_argument("--tabular_input")
parser.add_argument("--file_input")
parser.add_argument("--output_dir")
args = parser.parse_args()

# use dataset sdk to read tabular dataset
run_context = Run.get_context()
dataset = Dataset.get_by_id(run_context.experiment.workspace,id=args.tabular_input)
sdf = dataset.to_spark_dataframe()
sdf.show()

# use hdfs path to read file dataset
spark= SparkSession.builder.getOrCreate()
sdf = spark.read.option("header", "true").csv(args.file_input)
sdf.show()

sdf.coalesce(1).write\
.option("header", "true")\
.mode("append")\
.csv(args.output_dir)
```

This 'data preparation' script doesn't do any real data transformation, but illustrates how to retrieve data, convert it to a spark dataframe, and how to do some basic spark manipulation. You can find the output in Azure Machine Learning Studio by opening the child run, choosing the **Outputs + logs** tab, and opening the **logs/azureml/driver/stdout** file, as shown in the following figure.

:::image type="content" source="media/how-to-use-synapsesparkstep/synapsesparkstep-stdout.png" alt-text="Screenshot of Studio showing stdout tab of child run":::

## Use the `SynapseSparkStep` in a pipeline

Other steps in the pipeline may have their own unique environments and run on different compute resources appropriate to the task at hand. The sample notebook runs the "training step" on a small CPU cluster:

```python
from azureml.core.compute import AmlCompute

cpu_cluster_name = "cpucluster"

if cpu_cluster_name in ws.compute_targets:
    cpu_cluster = ComputeTarget(workspace=ws, name=cpu_cluster_name)
    print('Found existing cluster, use it.')
else:
    compute_config = AmlCompute.provisioning_configuration(vm_size='STANDARD_D2_V2', max_nodes=1)
    cpu_cluster = ComputeTarget.create(ws, cpu_cluster_name, compute_config)
    print('Allocating new CPU compute cluster')

cpu_cluster.wait_for_completion(show_output=True)

step2_input = step1_output.as_input("step2_input").as_download()

step_2 = PythonScriptStep(script_name="train.py",
                          arguments=[step2_input],
                          inputs=[step2_input],
                          compute_target=cpu_cluster_name,
                          source_directory="./code",
                          allow_reuse=False)
```

The code above creates the new compute resource if necessary. Then, the `step1_output` result is converted to input for the training step. The `as_download()` option means that the data will be moved onto the compute resource, resulting in faster access. The `compute_target` of this second step is `'cpucluster'`, not the `'link1-spark01'` resource you used in the data preparation step. This step uses a simple program **train.py** instead of the **dataprep.py** you used in the previous step. You can see the details of **train.py** in the sample notebook.

Once you've defined all of your steps, you can create and run your pipeline. 

```
from azureml.pipeline.core import Pipeline

pipeline = Pipeline(workspace=ws, steps=[step_1, step_2])
pipeline_run = pipeline.submit('synapse-pipeline', regenerate_outputs=True)
```

The above code creates a pipeline consisting of the data preparation step powered by Synapse (`step_1`) and the training step (`step_2`). Azure calculates the execution graph by examining the data dependencies between the steps. In this case, there's only a straightforward dependency that `step2_input` necessarily requires `step1_output`.

The call to `pipeline.submit` creates, if necessary, an Experiment called `synapse-pipeline` and asynchronously begins a Run within it. Individual steps within the pipeline are run as Child Runs of this main run and can be monitored and reviewed in the Experiments page of Studio.

## Next steps

tk 
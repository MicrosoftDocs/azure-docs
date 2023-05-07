---
title: Build a feature retrieval component
titleSuffix: Azure Machine Learning
description: Learn about the feature retrieval function in Azure Machine Learning, and how that function allows features to easily be used in pipeline jobs
author: rsethur
ms.author: seramasu
ms.reviewer: franksolomon
ms.service: machine-learning
ms.subservice: mldata 
ms.topic: conceptual
ms.date: 05/23/2023 
---
# Build a feature retrieval component

[!INCLUDE [preview disclaimer](../../includes/machine-learning-preview-generic-disclaimer.md)]

Azure Machine Learning includes a built-in component to perform offline feature retrieval, so that the features can be used in an Azure Machine Learning pipeline job with the training and batch inference steps.

The feature retrieval operation runs a Spark job to:
- retrieve feature values from feature stores (according to the feature retrieval spec)
- join (point-in-time) the feature values to the observation data to form a training data (or batch inference data)
- output the data with the feature retrieval spec

The component expects the following inputs:

| Input | Type | Description | Supported value | Note |
|----|------|------|------|------|
| input_model | custom_model | The model that is trained using features from feature store. It's expected that the model artifact folder has the `feature_retrieval_spec.yaml` file that defines the feature dependency. The YAML file is used by this component to retrieve corresponding features from the feature store, which are used in a batch inference pipeline as a first step to prepare the batch inference data. | Azure Machine Learning model asset `azureml:<name>:<version>`, local path to the model folder, abfss:// wasbs:// or Azure Machine Learning:// path to the model folder  | only one of input_model and feature_retrieval_spec inputs are required |
| feature_retrieval_spec | uri_file | The URI path to a `feature_retrieval_spec.yaml` file. The YAML file is used by this component to retrieve corresponding features from the feature stores. This is used in a training pipeline as a first step to prepare the training data | Azure Machine Learning data asset `azureml:<name>:<version>`, local path to the file, abfss:// wasbs:// or azureml:// path to the file | only one of `input_model` and `feature_retrieval_spec` inputs is required |
| observation_data | uri_folder | The observation data to which the features are joined. |  Azure Machine Learning data asset `azureml:<name>:<version>`, local path to the data folder, abfss:// wasbs:// or azureml:// path to the data folder | | 
| observation_data_format | enum | The feature retrieval job reads the observation data according to the format. | parquet, csv, delta | |
| timestamp_column| string | Name of the timestamp column in the observation data. The column is used by the point-at-time join on the observation data side | | | 


The component has one output, `output_data`. The output data is a uri_folder data asset. It always has the following folder structure:

`<output folder name>`/<BR>
├── data/<BR>
│   ├── xxxxx.parquet<BR>
│   └── xxxxx.parquet<BR>
└── feature_retrieval_spec.yaml


You can use the component either by referencing its component ID in a pipeline job YAML file, or by dragging and dropping the component in pipeline designer to create the pipeline. 

## Example: drag and drop the component in Designer UI

![](./imgs/feature_retrieval_component.png)

### Example: reference the component in pipeline job YAML

```yaml
description: training pipeline
display_name: training
experiment_name: training on fraud model
type: pipeline

inputs:
  feature_retrieval_spec: 
    mode: ro_mount
    path: ../feature_retrieval_spec.yaml
    type: uri_file
  observation_data: 
    mode: ro_mount
    path: wasbs://data@azuremlexampledata.blob.core.windows.net/feature-store-prp/observation_data/train/*.parquet
    type: uri_folder
  timestamp_column: timestamp 
  model_name: fraud_model 

jobs:
  feature_retrieval_step:
    component: azureml://registries/azureml-preview/components/feature_retrieval/versions/0.0.1
    inputs:
      feature_retrieval_spec:
        path: ${{parent.inputs.feature_retrieval_spec}}
      observation_data:
        path: ${{parent.inputs.observation_data}}
      timestamp_column:
        path: ${{parent.inputs.timestamp_column}}
      observation_data_format: parquet
    resources:
      instance_type: standard_e4s_v3
      runtime_version: "3.2"
    outputs:
      output_data:
    conf:
      spark.driver.cores: 4
      spark.driver.memory: 28g
      spark.executor.cores: 4
      spark.executor.memory: 28g
      spark.executor.instances: 2
    type: spark

  training_step:
    type: command
    compute: azureml:cpu-cluster
    code: ../train/src
    environment:
      image: mcr.microsoft.com/azureml/openmpi4.1.0-ubuntu20.04
      conda_file: ../../env/conda.yml
    inputs:
      training_data: 
        path: ${{parent.jobs.feature_retrieval_step.outputs.output_data}}
        mode: ro_mount
    outputs:
      model_output:
        type: custom_model
      run_id_output:
        type: uri_file
    command: >-
      python train.py
      --training_data ${{inputs.training_data}}
      --model_output ${{outputs.model_output}}
      --run_id_output ${{outputs.run_id_output}}
```


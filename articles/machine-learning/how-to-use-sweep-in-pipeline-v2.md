# How to do hyperparameter sweep in pipeline (V2)

In this artilce, you will learn how to do hyperparameter sweep in Azure Machine Learning pipeline.

## Prerequisite
1. Understand what is hyperparameter sweep, and how to do sweep in Azure Machine Learning start form a single step job. **[to-do](link to single-step sweep doc)** It's highly suggested to go through the single step sweep example to understand how sweep works in Azure Machine Learning, before using it in a pipeline. 
2. Understand what is Azure Machine Learning pipeline and how to build your first pipeline. [to-do](link to pipeline concept article.) 
3. Build a command commponent following [this atcile] (link to how to create component article). 

## How to use sweep in Azure Machine Learning pipeline

This sections explains how to use sweep to do hyperparameter tuning in Azure Machine Learning piepline using CLI and Python SDK. All the approaches share the same prerquisite: you already have a command component created and the command component takes hyperparameters as inputs. If you don't have a command component yet. Please follow [this article](link to Blanca's article) to create a command component first. 

## CLI 

Assume you already have a command component defined in `train.yaml`. A two step pipeline job YAML looks like below. 

**to-do: remove the hard code YAML. refenrce to azureml-example after merge to main**
:::code language="yaml" source"~/azureml-examples-main/cli/jobs/pipelines-with-components/pipeline_with_hyperparameter_sweep/pipeline.yml":::

```yaml
$schema: https://azuremlschemas.azureedge.net/latest/pipelineJob.schema.json
type: pipeline
display_name: pipeline_with_hyperparameter_sweep
description: Tune hyperparameters using TF component
settings:
    default_compute: azureml:cpu-cluster
jobs:
  sweep_step:
    type: sweep
    inputs:
      data: 
        type: uri_file
        path: wasbs://datasets@azuremlexamples.blob.core.windows.net/iris.csv
      degree: 3
      gamma: "scale"
      shrinking: False
      probability: False
      tol: 0.001
      cache_size: 1024
      verbose: False
      max_iter: -1
      decision_function_shape: "ovr"
      break_ties: False
      random_state: 42
    outputs:
      model_output:
      test_data:
    sampling_algorithm: random
    trial: file:./train.yml
    search_space:
      c_value:
        type: uniform
        min_value: 0.5
        max_value: 0.9
      kernel:
        type: choice
        values: ["rbf", "linear", "poly"]
      coef0:
        type: uniform
        min_value: 0.1
        max_value: 1
    objective:
      goal: minimize
      primary_metric: training_f1_score
    limits:
      max_total_trials: 5
      max_concurrent_trials: 3
      timeout: 7200

  predict_step:
    type: command
    inputs:
      model: ${{parent.jobs.sweep_step.outputs.model_output}}
      test_data: ${{parent.jobs.sweep_step.outputs.test_data}}
    outputs:
      predict_result:
    component: file:./predict.yml
```

The `sweep_step` is the step for hyperparameter sweep. Step type needs to be `sweep`.  And `trial` refers to the `train.yaml`. After submit this pipeline job, Azure Machine Learning will run the trial componenet multiple times to sweep over hypermaters based on the search space and terminate policy you defined in `sweep_step`. Check [sweep job YAML schema](https://docs.microsoft.com/en-us/azure/machine-learning/reference-yaml-job-sweep) for full schema of sweep job. 



And below is the trial component (`train.yml`) defination. It takes the hyperparamter as input. 

```yaml
$schema: https://azuremlschemas.azureedge.net/latest/commandComponent.schema.json
type: command

name: train_model
display_name: train_model
version: 1

inputs: 
  data:
    type: uri_folder
  c_value:
    type: number
    default: 1.0
  kernel:
    type: string
    default: rbf
  degree:
    type: integer
    default: 3
  gamma:
    type: string
    default: scale
  coef0: 
    type: number
    default: 0
  shrinking:
    type: boolean
    default: false
  probability:
    type: boolean
    default: false
  tol:
    type: number
    default: 1e-3
  cache_size:
    type: number
    default: 1024
  verbose:
    type: boolean
    default: false
  max_iter:
    type: integer
    default: -1
  decision_function_shape:
    type: string
    default: ovr
  break_ties:
    type: boolean
    default: false
  random_state:
    type: integer
    default: 42

outputs:
  model_output:
    type: mlflow_model
  test_data:
    type: uri_folder
  
code: ./train-src

environment: azureml:AzureML-sklearn-0.24-ubuntu18.04-py37-cpu@latest

command: >-
  python train.py 
    --data ${{inputs.data}}
    --C ${{inputs.c_value}}
    --kernel ${{inputs.kernel}}
    --degree ${{inputs.degree}}
    --gamma ${{inputs.gamma}}
    --coef0 ${{inputs.coef0}}
    --shrinking ${{inputs.shrinking}}
    --probability ${{inputs.probability}}
    --tol ${{inputs.tol}}
    --cache_size ${{inputs.cache_size}}
    --verbose ${{inputs.verbose}}
    --max_iter ${{inputs.max_iter}}
    --decision_function_shape ${{inputs.decision_function_shape}}
    --break_ties ${{inputs.break_ties}}
    --random_state ${{inputs.random_state}}
    --model_output ${{outputs.model_output}}
    --test_data ${{outputs.test_data}}
```

Below code snippet shows the source code of `train.py`. Make sure in your training script, you log the metric with exactly the same name as `primary_metric` value in pipeline YAML. In this example we use `mlflow.autolog()`. We suggest to use mlflow to track and monitorning your training.  

```python
# imports
import os
import mlflow
import argparse

import pandas as pd
from pathlib import Path

from sklearn.svm import SVC
from sklearn.model_selection import train_test_split

# define functions
def main(args):
    # enable auto logging
    mlflow.autolog()

    # setup parameters
    params = {
        "C": args.C,
        "kernel": args.kernel,
        "degree": args.degree,
        "gamma": args.gamma,
        "coef0": args.coef0,
        "shrinking": args.shrinking,
        "probability": args.probability,
        "tol": args.tol,
        "cache_size": args.cache_size,
        "class_weight": args.class_weight,
        "verbose": args.verbose,
        "max_iter": args.max_iter,
        "decision_function_shape": args.decision_function_shape,
        "break_ties": args.break_ties,
        "random_state": args.random_state,
    }

    # read in data
    df = pd.read_csv(args.data)

    # process data
    X_train, X_test, y_train, y_test = process_data(df, args.random_state)

    # train model
    model = train_model(params, X_train, X_test, y_train, y_test)
    # Output the model and test data
    # mlflow model can't write to existed folder, fix is in the mlflow master branch
    # write to local folder first, then copy to output folder

    # mlflow.sklearn.save_model(model, args.model_output + '/model')
    mlflow.sklearn.save_model(model, 'model')

    from distutils.dir_util import copy_tree

    # copy subdirectory example
    from_directory = "model"
    to_directory = args.model_output

    copy_tree(from_directory, to_directory)
    # mlflow.sklearn.save_model(model, args.model_output)
    
    X_test.to_csv(Path(args.test_data) / 'X_test.csv', index=False)
    y_test.to_csv(Path(args.test_data) / 'y_test.csv', index=False)



def process_data(df, random_state):
    # split dataframe into X and y
    X = df.drop(["species"], axis=1)
    y = df["species"]

    # train/test split
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=random_state
    )

    # return split data
    return X_train, X_test, y_train, y_test


def train_model(params, X_train, X_test, y_train, y_test):
    # train model
    model = SVC(**params)
    model = model.fit(X_train, y_train)


    # return model
    return model


def parse_args():
    # setup arg parser
    parser = argparse.ArgumentParser()

    # add arguments
    parser.add_argument("--data", type=str)
    parser.add_argument("--C", type=float, default=1.0)
    parser.add_argument("--kernel", type=str, default="rbf")
    parser.add_argument("--degree", type=int, default=3)
    parser.add_argument("--gamma", type=str, default="scale")
    parser.add_argument("--coef0", type=float, default=0)
    parser.add_argument("--shrinking", type=bool, default=False)
    parser.add_argument("--probability", type=bool, default=False)
    parser.add_argument("--tol", type=float, default=1e-3)
    parser.add_argument("--cache_size", type=float, default=1024)
    parser.add_argument("--class_weight", type=dict, default=None)
    parser.add_argument("--verbose", type=bool, default=False)
    parser.add_argument("--max_iter", type=int, default=-1)
    parser.add_argument("--decision_function_shape", type=str, default="ovr")
    parser.add_argument("--break_ties", type=bool, default=False)
    parser.add_argument("--random_state", type=int, default=42)
    parser.add_argument("--model_output", type=str, help="Path of output model")
    parser.add_argument("--test_data", type=str, help="Path of output model")

    # parse args
    args = parser.parse_args()

    # return args
    return args


# run script
if __name__ == "__main__":
    # parse args
    args = parse_args()

    # run main function
    main(args)
```


### Python SDK

In Azure Machine Learning Python SDK, sweep is a method of command component class. You can enable sweep for any command component by calling the .sweep() method of a command component instance. 

Below code snipe shows how to enable sweep for command component "train". It assumes you already define the "train" component that takes 15 inputs. Now let's enable hyperparameter sweep for `c_value`, `kernel` and `coef0`.



```Python
from azure.ml import dsl
from azure.ml.entities import load_component
from azure.ml.entities import (
    BanditPolicy, 
    Choice,
    Randint,
    QUniform,
    QLogNormal,
    QLogUniform,
    QNormal,
    LogNormal,
    LogUniform,
    Normal,
    Uniform,
)

train_component_func = load_component(yaml_file="./train.yml")
score_component_func = load_component(yaml_file="./predict.yml")

# define a pipeline with dsl component
@dsl.pipeline(
    description="Tune hyperparameters using sample components",
    default_compute="cpu-cluster",
)
def pipeline_with_hyperparameter_sweep():
    train_model = train_component_func(
        data=JobInput(type="uri_file", path="wasbs://datasets@azuremlexamples.blob.core.windows.net/iris.csv"),
        c_value=Uniform(min_value=0.5, max_value=0.9),
        kernel=Choice(["rbf", "linear", "poly"]),
        coef0=Uniform(min_value=0.1, max_value=1),
        degree=3,
        gamma="scale",
        shrinking=False,
        probability=False,
        tol=0.001,
        cache_size=1024,
        verbose=False,
        max_iter=-1,
        decision_function_shape="ovr",
        break_ties=False,
        random_state=42
    )
    sweep_step = train_model.sweep(
        primary_metric="training_f1_score",
        goal="minimize",
        sampling_algorithm="random",
        compute="cpu-cluster",
    )
    sweep_step.set_limits(max_total_trials=20, max_concurrent_trials=10, timeout=7200)

    score_data = score_component_func(
        model=sweep_step.outputs.model_output, 
        test_data=sweep_step.outputs.test_data
    )
    

pipeline = pipeline_with_hyperparameter_sweep()
```



<!-- 
### UI will release post //build. comment out for now

Assume you already have defined a command component. You can enable sweep easily in designer, the pipeline authoring GUI experience. 

Similarly to CLI and SDK, the prerequest to enable sweep in UI is to have a command component already defined. And the command component need to take sweepable parameter as input. 

If you build your command component using CLI or SDK. clone the pipeline in pipeline page. it will lead you to designer, the UI authoring page of pipeline. then right click the command component you want to sweep. 

1. clone the pipeline. it will link you to designer, the pipeline authoring GUI in where you can eanble sweep in UI.
![clone the pipeline run](./zhanxia-temp-media/clone-pipeline.png)

2. enable sweep
![enable sweep](./zhanxia-temp-media/enable-sweep.png)

3. Add a parameter to search space.  and set sweep settings.
![sweep setting](./zhanxia-temp-media/sweep-right-panel.png)


**[to-do]call out the settings are in which section in the right panel**

If you build your pipeline using designer directly. Select the component-
**[to-do] add screenshot of find component in designer**

then enable sweep for the command that do the training, set the sweep related settings in right panel. The last two step is the same as above.  -->


## Debug pipeline job with sweep node in Studio

After submit a pipeline job, the SDK or CLI widget will give you a web view link to Studio.The link will guide you to the pipeline graph view by default. To check details of the sweep step, double click the sweep node and navigate to the **child run** tab in the panel on the left.

![pipeline-view](./zhanxia-temp-media/pipeline-view.png)


This will link you to the sweep job detail like below. Navigate to **child run** tab, here you can see the metrics of all child runs and list of all child runs. 

![sweep-job](./zhanxia-temp-media/sweep-job.png)

If a child run failed, click the name of that child run. The useful debug information is under **Outputs + Logs**.

![child-run](./zhanxia-temp-media/childrun.png)



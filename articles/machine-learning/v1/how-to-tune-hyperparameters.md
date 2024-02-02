---
title: Hyperparameter tuning a model (v1)
titleSuffix: Azure Machine Learning
description: Automate hyperparameter tuning for deep learning and machine learning models using Azure Machine Learning.(v1)
ms.author: joburges
author: ssalgadodev
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.date: 05/02/2022
ms.topic: how-to
ms.custom: UpdateFrequency5, contperf-fy21q1, event-tier1-build-2022
---

# Hyperparameter tuning a model with Azure Machine Learning (v1)

[!INCLUDE [cli v1](../includes/machine-learning-cli-v1.md)]
     
[!INCLUDE [cli-version-info](../includes/machine-learning-cli-v1-deprecation.md)]

Automate efficient hyperparameter tuning by using Azure Machine Learning (v1) [HyperDrive package](/python/api/azureml-train-core/azureml.train.hyperdrive). Learn how to complete the steps required to tune hyperparameters with the [Azure Machine Learning SDK](/python/api/overview/azure/ml/):

1. Define the parameter search space
1. Specify a primary metric to optimize  
1. Specify early termination policy for low-performing runs
1. Create and assign resources
1. Launch an experiment with the defined configuration
1. Visualize the training runs
1. Select the best configuration for your model

## What is hyperparameter tuning?

**Hyperparameters** are adjustable parameters that let you control the model training process. For example, with neural networks, you decide the number of hidden layers and the number of nodes in each layer. Model performance depends heavily on hyperparameters.

 **Hyperparameter tuning**, also called **hyperparameter optimization**, is the process of finding the configuration of hyperparameters that results in the best performance. The process is typically computationally expensive and manual.

Azure Machine Learning lets you automate hyperparameter tuning and run experiments in parallel to efficiently optimize hyperparameters.


## Define the search space

Tune hyperparameters by exploring the range of values defined for each hyperparameter.

Hyperparameters can be discrete or continuous, and has a distribution of values described by a
[parameter expression](/python/api/azureml-train-core/azureml.train.hyperdrive.parameter_expressions).

### Discrete hyperparameters

Discrete hyperparameters are specified as a `choice` among discrete values. `choice` can be:

* one or more comma-separated values
* a `range` object
* any arbitrary `list` object


```Python
    {
        "batch_size": choice(16, 32, 64, 128)
        "number_of_hidden_layers": choice(range(1,5))
    }
```

In this case, `batch_size` one of the values [16, 32, 64, 128] and `number_of_hidden_layers` takes one of the values [1, 2, 3, 4].

The following advanced discrete hyperparameters can also be specified using a distribution:

* `quniform(low, high, q)` - Returns a value like round(uniform(low, high) / q) * q
* `qloguniform(low, high, q)` - Returns a value like round(exp(uniform(low, high)) / q) * q
* `qnormal(mu, sigma, q)` - Returns a value like round(normal(mu, sigma) / q) * q
* `qlognormal(mu, sigma, q)` - Returns a value like round(exp(normal(mu, sigma)) / q) * q

### Continuous hyperparameters 

The Continuous hyperparameters are specified as a distribution over a continuous range of values:

* `uniform(low, high)` - Returns a value uniformly distributed between low and high
* `loguniform(low, high)` - Returns a value drawn according to exp(uniform(low, high)) so that the logarithm of the return value is uniformly distributed
* `normal(mu, sigma)` - Returns a real value that's normally distributed with mean mu and standard deviation sigma
* `lognormal(mu, sigma)` - Returns a value drawn according to exp(normal(mu, sigma)) so that the logarithm of the return value is normally distributed

An example of a parameter space definition:

```Python
    {    
        "learning_rate": normal(10, 3),
        "keep_probability": uniform(0.05, 0.1)
    }
```

This code defines a search space with two parameters - `learning_rate` and `keep_probability`. `learning_rate` has a normal distribution with mean value 10 and a standard deviation of 3. `keep_probability` has a uniform distribution with a minimum value of 0.05 and a maximum value of 0.1.

### Sampling the hyperparameter space

Specify the parameter sampling method to use over the hyperparameter space. Azure Machine Learning supports the following methods:

* Random sampling
* Grid sampling
* Bayesian sampling

#### Random sampling

[Random sampling](/python/api/azureml-train-core/azureml.train.hyperdrive.randomparametersampling) supports discrete and continuous hyperparameters. It supports early termination of low-performance runs. Some users do an initial search with random sampling and then refine the search space to improve results.

In random sampling, hyperparameter values are randomly selected from the defined search space. 

```Python
from azureml.train.hyperdrive import RandomParameterSampling
from azureml.train.hyperdrive import normal, uniform, choice
param_sampling = RandomParameterSampling( {
        "learning_rate": normal(10, 3),
        "keep_probability": uniform(0.05, 0.1),
        "batch_size": choice(16, 32, 64, 128)
    }
)
```

#### Grid sampling

[Grid sampling](/python/api/azureml-train-core/azureml.train.hyperdrive.gridparametersampling) supports discrete hyperparameters. Use grid sampling if you can budget to exhaustively search over the search space. Supports early termination of low-performance runs.

Grid sampling does a simple grid search over all possible values. Grid sampling can only be used with `choice` hyperparameters. For example, the following space has six samples:

```Python
from azureml.train.hyperdrive import GridParameterSampling
from azureml.train.hyperdrive import choice
param_sampling = GridParameterSampling( {
        "num_hidden_layers": choice(1, 2, 3),
        "batch_size": choice(16, 32)
    }
)
```

#### Bayesian sampling

[Bayesian sampling](/python/api/azureml-train-core/azureml.train.hyperdrive.bayesianparametersampling) is based on the Bayesian optimization algorithm. It picks samples based on how previous samples did, so that new samples improve the primary metric.

Bayesian sampling is recommended if you have enough budget to explore the hyperparameter space. For best results, we recommend a maximum number of runs greater than or equal to 20 times the number of hyperparameters being tuned. 

The number of concurrent runs has an impact on the effectiveness of the tuning process. A smaller number of concurrent runs may lead to better sampling convergence, since the smaller degree of parallelism increases the number of runs that benefit from previously completed runs.

Bayesian sampling only supports `choice`, `uniform`, and `quniform` distributions over the search space.

```Python
from azureml.train.hyperdrive import BayesianParameterSampling
from azureml.train.hyperdrive import uniform, choice
param_sampling = BayesianParameterSampling( {
        "learning_rate": uniform(0.05, 0.1),
        "batch_size": choice(16, 32, 64, 128)
    }
)
```



## <a name="specify-primary-metric-to-optimize"></a> Specify primary metric

Specify the [primary metric](/python/api/azureml-train-core/azureml.train.hyperdrive.primarymetricgoal) you want hyperparameter tuning to optimize. Each training run is evaluated for the primary metric. The early termination policy uses the primary metric to identify low-performance runs.

Specify the following attributes for your primary metric:

* `primary_metric_name`: The name of the primary metric needs to exactly match the name of the metric logged by the training script
* `primary_metric_goal`: It can be either `PrimaryMetricGoal.MAXIMIZE` or `PrimaryMetricGoal.MINIMIZE` and determines whether the primary metric will be maximized or minimized when evaluating the runs. 

```Python
primary_metric_name="accuracy",
primary_metric_goal=PrimaryMetricGoal.MAXIMIZE
```

This sample maximizes "accuracy".

### <a name="log-metrics-for-hyperparameter-tuning"></a>Log metrics for hyperparameter tuning

The training script for your model **must** log the primary metric during model training so that HyperDrive can access it for hyperparameter tuning.

Log the primary metric in your training script with the following sample snippet:

```Python
from azureml.core.run import Run
run_logger = Run.get_context()
run_logger.log("accuracy", float(val_accuracy))
```

The training script calculates the `val_accuracy` and logs it as the primary metric "accuracy". Each time the metric is logged, it's received by the hyperparameter tuning service. It's up to you to determine the frequency of reporting.

For more information on logging values in model training runs, see [Enable logging in Azure Machine Learning training runs](../how-to-log-view-metrics.md).

## <a name="early-termination"></a> Specify early termination policy

Automatically end poorly performing runs with an early termination policy. Early termination improves computational efficiency.

You can configure the following parameters that control when a policy is applied:

* `evaluation_interval`: the frequency of applying the policy. Each time the training script logs the primary metric counts as one interval. An `evaluation_interval` of 1 will apply the policy every time the training script reports the primary metric. An `evaluation_interval` of 2 will apply the policy every other time. If not specified, `evaluation_interval` is set to 1 by default.
* `delay_evaluation`: delays the first policy evaluation for a specified number of intervals. This is an optional parameter that avoids premature termination of training runs by allowing all configurations to run for a minimum number of intervals. If specified, the policy applies every multiple of evaluation_interval that is greater than or equal to delay_evaluation.

Azure Machine Learning supports the following early termination policies:
* [Bandit policy](#bandit-policy)
* [Median stopping policy](#median-stopping-policy)
* [Truncation selection policy](#truncation-selection-policy)
* [No termination policy](#no-termination-policy-default)


### Bandit policy

[Bandit policy](/python/api/azureml-train-core/azureml.train.hyperdrive.banditpolicy#definition) is based on slack factor/slack amount and evaluation interval. Bandit ends runs when the primary metric isn't within the specified slack factor/slack amount of the most successful run.

> [!NOTE]
> Bayesian sampling does not support early termination. When using Bayesian sampling, set `early_termination_policy = None`.

Specify the following configuration parameters:

* `slack_factor` or `slack_amount`: the slack allowed with respect to the best performing training run. `slack_factor` specifies the allowable slack as a ratio. `slack_amount` specifies the allowable slack as an absolute amount, instead of a ratio.

    For example,  consider a Bandit policy applied at interval 10. Assume that the best performing run at interval 10 reported a primary metric is 0.8 with a goal to maximize the primary metric. If the policy specifies a `slack_factor` of 0.2, any training runs whose best metric at interval 10 is less than 0.66 (0.8/(1+`slack_factor`)) will be terminated.
* `evaluation_interval`: (optional) the frequency for applying the policy
* `delay_evaluation`: (optional) delays the first policy evaluation for a specified number of intervals



```Python
from azureml.train.hyperdrive import BanditPolicy
early_termination_policy = BanditPolicy(slack_factor = 0.1, evaluation_interval=1, delay_evaluation=5)
```

In this example, the early termination policy is applied at every interval when metrics are reported, starting at evaluation interval 5. Any run whose best metric is less than (1/(1+0.1) or 91% of the best performing run will be terminated.

### Median stopping policy

[Median stopping](/python/api/azureml-train-core/azureml.train.hyperdrive.medianstoppingpolicy) is an early termination policy based on running averages of primary metrics reported by the runs. This policy computes running averages across all training runs and stops runs whose primary metric value is worse than the median of the averages.

This policy takes the following configuration parameters:
* `evaluation_interval`: the frequency for applying the policy (optional parameter).
* `delay_evaluation`: delays the first policy evaluation for a specified number of intervals (optional parameter).


```Python
from azureml.train.hyperdrive import MedianStoppingPolicy
early_termination_policy = MedianStoppingPolicy(evaluation_interval=1, delay_evaluation=5)
```

In this example, the early termination policy is applied at every interval starting at evaluation interval 5. A run is stopped at interval 5 if its best primary metric is worse than the median of the running averages over intervals 1:5 across all training runs.

### Truncation selection policy

[Truncation selection](/python/api/azureml-train-core/azureml.train.hyperdrive.truncationselectionpolicy) cancels a percentage of lowest performing runs at each evaluation interval. Runs are compared using the primary metric. 

This policy takes the following configuration parameters:

* `truncation_percentage`: the percentage of lowest performing runs to terminate at each evaluation interval. An integer value between 1 and 99.
* `evaluation_interval`: (optional) the frequency for applying the policy
* `delay_evaluation`: (optional) delays the first policy evaluation for a specified number of intervals
* `exclude_finished_jobs`: specifies whether to exclude finished jobs when applying the policy


```Python
from azureml.train.hyperdrive import TruncationSelectionPolicy
early_termination_policy = TruncationSelectionPolicy(evaluation_interval=1, truncation_percentage=20, delay_evaluation=5, exclude_finished_jobs=true)
```

In this example, the early termination policy is applied at every interval starting at evaluation interval 5. A run terminates at interval 5 if its performance at interval 5 is in the lowest 20% of performance of all runs at interval 5 and will exclude finished jobs when applying the policy.

### No termination policy (default)

If no policy is specified, the hyperparameter tuning service will let all training runs execute to completion.

```Python
policy=None
```

### Picking an early termination policy

* For a conservative policy that provides savings without terminating promising jobs, consider a Median Stopping Policy with `evaluation_interval` 1 and `delay_evaluation` 5. These are conservative settings, that can provide approximately 25%-35% savings with no loss on primary metric (based on our evaluation data).
* For more aggressive savings, use Bandit Policy with a smaller allowable slack or Truncation Selection Policy with a larger truncation percentage.

## Create and assign resources

Control your resource budget by specifying the maximum number of training runs.

* `max_total_runs`: Maximum number of training runs. Must be an integer between 1 and 1000.
* `max_duration_minutes`: (optional) Maximum duration, in minutes, of the hyperparameter tuning experiment. Runs after this duration are canceled.

>[!NOTE] 
>If both `max_total_runs` and `max_duration_minutes` are specified, the hyperparameter tuning experiment terminates when the first of these two thresholds is reached.

Additionally, specify the maximum number of training runs to run concurrently during your hyperparameter tuning search.

* `max_concurrent_runs`: (optional) Maximum number of runs that can run concurrently. If not specified, all runs launch in parallel. If specified, must be an integer between 1 and 100.

>[!NOTE] 
>The number of concurrent runs is gated on the resources available in the specified compute target. Ensure that the compute target has the available resources for the desired concurrency.

```Python
max_total_runs=20,
max_concurrent_runs=4
```

This code configures the hyperparameter tuning experiment to use a maximum of 20 total runs, running four configurations at a time.

## Configure hyperparameter tuning experiment

To [configure your hyperparameter tuning](/python/api/azureml-train-core/azureml.train.hyperdrive.hyperdriverunconfig) experiment, provide the following:
* The defined hyperparameter search space
* Your early termination policy
* The primary metric
* Resource allocation settings
* ScriptRunConfig `script_run_config`

The ScriptRunConfig is the training script that will run with the sampled hyperparameters. It defines the resources per job (single or multi-node), and the compute target to use.

> [!NOTE]
>The compute target used in `script_run_config` must have enough resources to satisfy your concurrency level. For more information on ScriptRunConfig, see [Configure training runs](how-to-set-up-training-targets.md).

Configure your hyperparameter tuning experiment:

```Python
from azureml.train.hyperdrive import HyperDriveConfig
from azureml.train.hyperdrive import RandomParameterSampling, BanditPolicy, uniform, PrimaryMetricGoal

param_sampling = RandomParameterSampling( {
        'learning_rate': uniform(0.0005, 0.005),
        'momentum': uniform(0.9, 0.99)
    }
)

early_termination_policy = BanditPolicy(slack_factor=0.15, evaluation_interval=1, delay_evaluation=10)

hd_config = HyperDriveConfig(run_config=script_run_config,
                             hyperparameter_sampling=param_sampling,
                             policy=early_termination_policy,
                             primary_metric_name="accuracy",
                             primary_metric_goal=PrimaryMetricGoal.MAXIMIZE,
                             max_total_runs=100,
                             max_concurrent_runs=4)
```

The `HyperDriveConfig` sets the parameters passed to the `ScriptRunConfig script_run_config`. The `script_run_config`, in turn, passes parameters to the training script. The above code snippet is taken from the sample notebook [Train, hyperparameter tune, and deploy with PyTorch](https://github.com/Azure/MachineLearningNotebooks/tree/master/how-to-use-azureml/ml-frameworks/pytorch/train-hyperparameter-tune-deploy-with-pytorch). In this sample, the `learning_rate` and `momentum` parameters will be tuned. Early stopping of runs will be determined by a `BanditPolicy`, which stops a run whose primary metric falls outside the `slack_factor` (see [BanditPolicy class reference](/python/api/azureml-train-core/azureml.train.hyperdrive.banditpolicy)). 

The following code from the sample shows how the being-tuned values are received, parsed, and passed to the training script's `fine_tune_model` function:

```python
# from pytorch_train.py
def main():
    print("Torch version:", torch.__version__)

    # get command-line arguments
    parser = argparse.ArgumentParser()
    parser.add_argument('--num_epochs', type=int, default=25,
                        help='number of epochs to train')
    parser.add_argument('--output_dir', type=str, help='output directory')
    parser.add_argument('--learning_rate', type=float,
                        default=0.001, help='learning rate')
    parser.add_argument('--momentum', type=float, default=0.9, help='momentum')
    args = parser.parse_args()

    data_dir = download_data()
    print("data directory is: " + data_dir)
    model = fine_tune_model(args.num_epochs, data_dir,
                            args.learning_rate, args.momentum)
    os.makedirs(args.output_dir, exist_ok=True)
    torch.save(model, os.path.join(args.output_dir, 'model.pt'))
```

> [!Important]
> Every hyperparameter run restarts the training from scratch, including rebuilding the model and _all the data loaders_. You can minimize 
> this cost by using an Azure Machine Learning pipeline or manual process to do as much data preparation as possible prior to your training runs. 

## Submit hyperparameter tuning experiment

After you define your hyperparameter tuning configuration, [submit the experiment](/python/api/azureml-core/azureml.core.experiment%28class%29#submit-config--tags-none----kwargs-):

```Python
from azureml.core.experiment import Experiment
experiment = Experiment(workspace, experiment_name)
hyperdrive_run = experiment.submit(hd_config)
```

## Warm start hyperparameter tuning (optional)

Finding the best hyperparameter values for your model can be an iterative process. You can reuse knowledge from the five previous runs to accelerate hyperparameter tuning.

Warm starting is handled differently depending on the sampling method:
- **Bayesian sampling**: Trials from the previous run are used as prior knowledge to pick new samples, and to improve the primary metric.
- **Random sampling** or **grid sampling**:  Early termination uses knowledge from previous runs to determine poorly performing runs. 

Specify the list of parent runs you want to warm start from.

```Python
from azureml.train.hyperdrive import HyperDriveRun

warmstart_parent_1 = HyperDriveRun(experiment, "warmstart_parent_run_ID_1")
warmstart_parent_2 = HyperDriveRun(experiment, "warmstart_parent_run_ID_2")
warmstart_parents_to_resume_from = [warmstart_parent_1, warmstart_parent_2]
```

If a hyperparameter tuning experiment is canceled, you can resume training runs from the last checkpoint. However, your training script must handle checkpoint logic.

The training run must use the same hyperparameter configuration and mounted the outputs folders. The training script must accept the `resume-from` argument, which contains the checkpoint or model files from which to resume the training run. You can resume individual training runs using the following snippet:

```Python
from azureml.core.run import Run

resume_child_run_1 = Run(experiment, "resume_child_run_ID_1")
resume_child_run_2 = Run(experiment, "resume_child_run_ID_2")
child_runs_to_resume = [resume_child_run_1, resume_child_run_2]
```

You can configure your hyperparameter tuning experiment to warm start from a previous experiment or resume individual training runs using the optional parameters `resume_from` and `resume_child_runs` in the config:

```Python
from azureml.train.hyperdrive import HyperDriveConfig

hd_config = HyperDriveConfig(run_config=script_run_config,
                             hyperparameter_sampling=param_sampling,
                             policy=early_termination_policy,
                             resume_from=warmstart_parents_to_resume_from,
                             resume_child_runs=child_runs_to_resume,
                             primary_metric_name="accuracy",
                             primary_metric_goal=PrimaryMetricGoal.MAXIMIZE,
                             max_total_runs=100,
                             max_concurrent_runs=4)
```

## Visualize hyperparameter tuning runs

You can visualize your hyperparameter tuning runs in the Azure Machine Learning studio, or you can use a notebook widget.

### Studio

You can visualize all of your hyperparameter tuning runs in the [Azure Machine Learning studio](https://ml.azure.com). For more information on how to view an experiment in the portal, see [View run records in the studio](../how-to-log-view-metrics.md#view-the-experiment-in-the-web-portal).

- **Metrics chart**: This visualization tracks the metrics logged for each hyperdrive child run over the duration of hyperparameter tuning. Each line represents a child run, and each point measures the primary metric value at that iteration of runtime.  

    :::image type="content" source="../media/how-to-tune-hyperparameters/hyperparameter-tuning-metrics.png" alt-text="Hyperparameter tuning metrics chart":::

- **Parallel Coordinates Chart**: This visualization shows the correlation between primary metric performance and individual hyperparameter values. The chart is interactive via movement of axes (click and drag by the axis label), and by highlighting values across a single axis (click and drag vertically along a single axis to highlight a range of desired values). The parallel coordinates chart includes an axis on the right most portion of the chart that plots the best metric value corresponding to the hyperparameters set for that run instance. This axis is provided in order to project the chart gradient legend onto the data in a more readable fashion.

    :::image type="content" source="../media/how-to-tune-hyperparameters/hyperparameter-tuning-parallel-coordinates.png" alt-text="Hyperparameter tuning parallel coordinates chart":::

- **2-Dimensional Scatter Chart**: This visualization shows the correlation between any two individual hyperparameters along with their associated primary metric value.

    :::image type="content" source="../media/how-to-tune-hyperparameters/hyperparameter-tuning-2-dimensional-scatter.png" alt-text="Hyparameter tuning 2-dimensional scatter chart":::

- **3-Dimensional Scatter Chart**: This visualization is the same as 2D but allows for three hyperparameter dimensions of correlation with the primary metric value. You can also click and drag to reorient the chart to view different correlations in 3D space.

    :::image type="content" source="../media/how-to-tune-hyperparameters/hyperparameter-tuning-3-dimensional-scatter.png" alt-text="Hyparameter tuning 3-dimensional scatter chart":::

### Notebook widget

Use the [Notebook widget](/python/api/azureml-widgets/azureml.widgets.rundetails) to visualize the progress of your training runs. The following snippet visualizes all your hyperparameter tuning runs in one place in a Jupyter notebook:

```Python
from azureml.widgets import RunDetails
RunDetails(hyperdrive_run).show()
```

This code displays a table with details about the training runs for each of the hyperparameter configurations.

:::image type="content" source="../media/how-to-tune-hyperparameters/hyperparameter-tuning-table.png" alt-text="Hyperparameter tuning table":::

You can also visualize the performance of each of the runs as training progresses.

## Find the best model

Once all of the hyperparameter tuning runs have completed, identify the best performing configuration and hyperparameter values:

```Python
best_run = hyperdrive_run.get_best_run_by_primary_metric()
best_run_metrics = best_run.get_metrics()
parameter_values = best_run.get_details()['runDefinition']['arguments']

print('Best Run Id: ', best_run.id)
print('\n Accuracy:', best_run_metrics['accuracy'])
print('\n learning rate:',parameter_values[3])
print('\n keep probability:',parameter_values[5])
print('\n batch size:',parameter_values[7])
```

## Sample notebook

Refer to train-hyperparameter-* notebooks in this folder:
* [how-to-use-azureml/ml-frameworks](https://github.com/Azure/MachineLearningNotebooks/tree/master/how-to-use-azureml/ml-frameworks)

[!INCLUDE [aml-clone-in-azure-notebook](../includes/aml-clone-for-examples.md)]

## Next steps
* [Track an experiment](../how-to-log-view-metrics.md)
* [Deploy a trained model](../v1/how-to-deploy-and-where.md)

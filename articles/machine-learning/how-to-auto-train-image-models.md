---
title: Set up AutoML for images 
titleSuffix: Azure Machine Learning
description: Set up Azure Machine Learning automated ML to train computer vision models with the Azure Machine Learning Python SDK.
services: machine-learning
author: nibaccam
ms.author: nibaccam
ms.service: machine-learning
ms.subservice: core
ms.topic: how-to
ms.custom:  automl
ms.date: 
---

# Set up AutoML to train an image model with Python 
In this article, you learn how to train computer vision models on image data using Azure Machine Learning Automated ML in the [Azure Machine Learning Python SDK](/python/api/overview/azure/ml/).

To do so, you will 
<ul>
<li>Select the task type</li>
<li>Specify the training and validation data</li>
<li>Learn about data augmentations for image tasks</li>
<li>Choose your compute target</li>
<li>Configure model algorithms and hyperparameters</li>
<li>Optionally, perform a hyperparameter sweep to optimize model performance</li>
<li>Run an AutoML experiment to train an image model</li>
<li>Explore model metrics</li>
<li>Register and deploy model</li>
</ul>

## What is AutoML for Images?
AutoML for Images supports computer vision tasks such as Image Classification, Object Detection and Instance Segmentation.

![Computer Vision Tasks](ComputerVisionTasks.jpg)

[Image from: http://cs231n.stanford.edu/slides/2021/lecture_15.pdf]

With AutoML support for vision tasks, customers can easily build models trained on image data, without writing any training code. They can seamlessly integrate with Azure ML's Data Labeling capability and use this labeled data for generating image models. They can optimize model perfromance by specifying the model algorithm and tuning the hyperparameters. The resulting model can then be downloaded or deployed as a web service in Azure ML and can be operationalized at scale, leveraging AzureML [MLOps](concept-model-management-and-deployment.md) and [ML Pipelines](concept-ml-pipelines.md) capabilities. 

Authoring AutoML models for vision tasks is currently supported via the Azure ML Python SDK. The resulting experimentation runs, models and outputs will be accessible from the Azure ML Studio UI.

## Target audience
This feature is targeted to data scientists with ML knowledge in the Computer Vision space, looking to build ML models using image data in Azure Machine Learning. It targets to boost data scientist productivity, while allowing full control of the model algorithm, hyperparameters and training and deployment environments.

## Prerequisites <!--TODO - verify that these steps work once the final public preview package is ready--> 
For this article you need,

* An Azure Machine Learning workspace. To create the workspace, see [Create an Azure Machine Learning workspace](how-to-manage-workspace.md).

* The Azure Machine Learning Python SDK installed.
    To install the SDK you can either, 
    * Create a compute instance, which automatically installs the SDK and is pre-configured for ML workflows. See [Create and manage an Azure Machine Learning compute instance](how-to-create-manage-compute-instance.md) for more information. 

    * [Install the `automl` package yourself](https://github.com/Azure/MachineLearningNotebooks/blob/master/how-to-use-azureml/automated-machine-learning/README.md#setup-using-a-local-conda-environment), which includes the [default installation](/python/api/overview/azure/ml/install#default-install) of the SDK.
    
    > [!NOTE]
    > Only Python 3.7 is compatible with `Automl for Images`. 

## How to use AutoML to build models for computer vision tasks?
AutoML allows you to easily train models for Image Classification, Object Detection & Instance Segmentation on your image data. You can control the model algorithm to be used, specify hyperparameter values for your model as well as perform a sweep across the hyperparameter space to generate an optimal model. Parameters for configuring your AutoML run for image related tasks are specified using the 'AutoMLImageConfig' in the Python SDK.

### Select your task type
AutoML for Images supports the following task types:
<ul>
<li>image-classification</li>
<li>image-multi-labeling</li>
<li>image-object-detection</li>
<li>image-instance-segmentation</li>
</ul>

This task type is a required parameter and is passed in using the `task` parameter in the AutoMLImageConfig. For example:

```python
from azureml.train.automl import AutoMLImageConfig
automl_image_config = AutoMLImageConfig(task='image-object-detection')
```

### Training and Validation data <!--TODO - update this section to use Tabular datasets once this piece is verified--> 
In order to generate Vision models, you will need to bring in labeled image data as input for model training in the form of an AzureML [Tabular Dataset](/python/api/azureml-core/azureml.data.tabulardataset). You can either use a `Tabular Dataset` that you have exported from a Data Labeling project (using the Export as Azure ML Dataset option), or create a new `Tabular Dataset` with your labeled training data.

The structure of the tabular dataset depends upon the task at hand. For Image task types, it consists of the following fields:
<ul>
<li>image_url: contains filepath as a StreamInfo object</li>
<li>image_details: image metatadata information consist of height, width and format. This field is optional and hence may or may not exist. This restriction might become mandatory in the future.</li>
<li>label: a json representation of the image label, based on the task type</li>
</ul>

Creation of tabular datasets is supported from data in JSONL format.

#### JSONL sample schema for each task type
Here is a sample JSONL file for Image classfication:
```python
{
      "image_url": "AmlDatastore://image_data/Image_01.png",
      "image_details":
      {
          "format": "png",
          "width": "2230px",
          "height": "4356px"
      },
      "label": "cat"
  }
  {
      "image_url": "AmlDatastore://image_data/Image_02.jpeg",
      "image_details":
      {
          "format": "jpeg",
          "width": "3456px",
          "height": "3467px"
      },
      "label": "dog"
  }
  ```

  And here is a sample JSONL file for Object Detection:
  ```python
  {
      "image_url": "AmlDatastore://image_data/Image_01.png",
      "image_details":
      {
          "format": "png",
          "width": "2230px",
          "height": "4356px"
      },
      "label":
      {
          "label": "cat",
          "topX": "1",
          "topY": "0",
          "bottomX": "0",
          "bottomY": "1",
          "isCrowd": "true",
      }
  }
  {
      "image_url": "AmlDatastore://image_data/Image_02.png",
      "image_details":
      {
          "format": "jpeg",
          "width": "1230px",
          "height": "2356px"
      },
      "label":
      {
          "label": "dog",
          "topX": "0",
          "topY": "1",
          "bottomX": "0",
          "bottomY": "1",
          "isCrowd": "false",
      }
  }
  ```


If your training data is in a different format (e.g. pascal VOC or COCO), you can leverage the helper scripts included with the sample notebooks to convert the data to JSONL. Once your data is in JSONL format, you can create a tabular dataset using this snippet:

```python
from azureml.core import Dataset

training_dataset = Dataset.Tabular.from_json_lines_files(
        path=ds.path('odFridgeObjects/odFridgeObjects.jsonl'),
        set_column_types={'image_url': DataType.to_stream(ds.workspace)})
training_dataset = training_dataset.register(workspace=ws, name=training_dataset_name)
```

You can optionally specify another tabular dataset as a validation dataset to be used for your model. If no validation dataset is specified, 20% of your training data will be used for validation by default, unless you pass `split_ratio` argument with a different value.

Training data is a required parameter and is passed in using the `training_data` parameter. Validation data is optional and is passed in using the `validation_data` parameter of the AutoMLImageConfig. For example:

```python
from azureml.train.automl import AutoMLImageConfig
automl_image_config = AutoMLImageConfig(training_data=training_dataset)
```

### Data augmentations 
<!--TODO - add a section on data augmentations for OD and IC-->

### Compute to run experiment
You will need to provide a [Compute Target](concept-azure-machine-learning-architecture#compute-target) that will be used for your AutoML model training. AutoML models for computer vision tasks require GPU SKUs and support NC and ND families. We recommend using the NCsv3-series (with v100 GPUs) for faster training. Using a compute target with a multi-GPU VM SKU will leverage the multiple GPUs to speed up training. Additionally, setting up a compute target with multiple nodes will allow for faster model training by leveraging parallelism, when tuning hyperparameters for your model.

The compute target is a required parameter and is passed in using the `compute_target` parameter of the AutoMLImageConfig. For example:

```python
from azureml.train.automl import AutoMLImageConfig
automl_image_config = AutoMLImageConfig(compute_target=compute_target)
```

### Configure model algorithms and hyperparameters
When using AutoML to build computer vision models, users can control the model algorithm and sweep hyperparameters. These model algorithms and hyperparameters are passed in as the parameter space for the sweep.

The model algorithm is required and is passed in via `model_name` parameter. You can either specify a single model_name or choose between multiple.

#### Currently supported model algorithms:
<ul>
<li><b>Image Classification (multi-class and multi-label):</b> 'resnet18', 'resnet34', 'resnet50', 'mobilenetv2', 'seresnext'</li>
<li><b>Object Detection (OD): </b>'yolov5', 'fasterrcnn_resnet50_fpn', 'fasterrcnn_resnet34_fpn', 'fasterrcnn_resnet18_fpn', 'retinanet_resnet50_fpn'</li>
<li><b>Instance segmentation (IS): </b>'maskrcnn_resnet50_fpn'</li>
</ul>

#### Hyperparameters for model training

In addition to controlling the model algorthm used, you can also tune hyperparameters used for model training. While many of the hyperparameters exposed are model-agnostic, some are task-specific and a few are model-specific.

The following tables list out the details of the hyperparameters  and their default values for each:

<b>Model-agnostic hyperparameters</b>

| Parameter Name       | Description           | Default  |
| ------------- |-------------| -----|
| number_of_epochs | Number of training epochs <br> `Optional, Positive Integer` |  all (except yolov5) : 15 <br>yolov5: 30 |
| training_batch_size | Training batch size <br> *Note: the defaults are largest batch size <br>which can be used on 12GiB GPU memory* <br> `Optional, Positive Integer` | multi-class / multi-label: 78 <br>OD (except yolov5) / IS: 2 <br>yolov5: 16 |
| validation_batch_size | Validation batch size <br> *Note: the defaults are largest batch size <br>which can be used on 12GiB GPU memory*  <br> `Optional, Positive Integer` | multi-class / multi-label: 78 <br>OD (except yolov5) / IS: 2 <br>yolov5: 16  |
| early_stopping | Enable early stopping logic during training <br> `Optional, 0 or 1`| 1 |
| early_stopping_patience | Min num of epochs/validation evaluations <br>with no primary metric improvement <br>before the run is stopped <br> `Optional, Positive Integer` | 5 |
| early_stopping_delay | Min num of epochs/validation evaluations <br>to wait before primary metric improvement <br>is tracked for early stopping <br> `Optional, Positive Integer` | 5 |
| learning_rate | Initial learning rate <br> `Optional, float in [0, 1]` | multi-class: 0.01 <br>multi-label: 0.035 <br>OD (except yolov5) / IS: 0.05  <br>yolov5: 0.01  |
| lr_scheduler | Type of learning rate scheduler <br> `Optional, one of {warmup_cosine, step}` | warmup_cosine |
| step_lr_gamma | Value of gamma <br>for the learning rate scheduler<br>if it is of type step <br> `Optional, float in [0, 1]` | 0.5 |
| step_lr_step_size | Value of step_size <br>for the learning rate scheduler<br>if it is of type step <br> `Optional, Positive Integer` | 5 |
| warmup_cosine_lr_cycles | Value of cosine cycle <br>for the learning rate scheduler<br>if it is of type warmup_cosine <br> `Optional, float in [0, 1]` | 0.45 |
| warmup_cosine_lr_warmup_epochs | Value of warmup epochs <br>for the learning rate scheduler<br>if it is of type warmup_cosine <br> `Optional, Positive Integer` | 2 |
| optimizer | Type of optimizer <br> `Optional, one of {sgd, adam, adamw}`  | sgd |
| momentum | Value of momentum for the optimizer<br>if it is of type sgd <br> `Optional, float in [0, 1]` | 0.9 |
| weight_decay | Value of weight_decay for the optimizer<br>if it is of type sgd or adam or adamw <br> `Optional, float in [0, 1]` | 1e-4 |
| nesterov | Enable nesterov for the optimizer<br>if it is of type sgd <br> `Optional, 0 or 1`| 1 |
| beta1 | Value of beta1 for the optimizer<br>if it is of type adam or adamw <br> `Optional, float in [0, 1]` | 0.9 |
| beta2 | Value of beta2 for the optimizer<br>if it is of type adam or adamw <br> `Optional, float in [0, 1]` | 0.999 |
| amsgrad | Enable amsgrad for the optimizer<br>if it is of type adam or adamw <br> `Optional, 0 or 1` | 0 |
| evaluation_frequency | Frequency to evaluate validation dataset<br>to get metric scores <br> `Optional, Positive Integer` | 1 |
| split_ratio | Validation split ratio when splitting train<br>data into random train and validation<br>subsets if validation data is not defined <br> `Optional, float in [0, 1]` | 0.2 |
| checkpoint_frequency | Frequency to store model checkpoints.<br>By default, we save checkpoint at the<br>epoch which has the best primary metric<br>on validation <br> `Optional, Positive Integer` | no default value <br> (checkpoint at epoch <br>with best primary metric)  |
| layers_to_freeze | How many layers to freeze for your model.<br>Available freezable layers for each model <br>are [here](constants.py). For instance, passing 2 <br>as value for seresnext means freezing layer0 <br>and layer1. <br> `Optional, Positive Integer` | no default value |

<br>
<b>Task-specific hyperparameters</b>
<br>
<br>
<b> For Image Classifcation (Multi-class and Multi-label):</b>

| Parameter Name       | Description           | Default  |
| ------------- |-------------| -----|
| weighted_loss | 0 for no weighted loss<br>1 for weighted loss with sqrt(class_weights),<br>and 2 for weighted loss with class_weights <br> `Optional, 0 or 1 or 2` | 0 |
| resize_size | Image size to which to resize before cropping for validation dataset <br> *Note: unlike others, seresnext doesn't take an arbitary size <br> Note: training run may get into CUDA OOM if the size is too big* <br> `Optional, Positive Integer` | 256  |
| crop_size | Image crop size which is input to your neural network <br> *Note: unlike others, seresnext doesn't take an arbitary size <br> Note: training run may get into CUDA OOM if the size is too big* <br> `Optional, Positive Integer` | 224 |

<br>
<b>For Object Detection (except yolov5) and Instance Segmentation: </b>

| Parameter Name       | Description           | Default  |
| ------------- |-------------| -----|
| validation_metric_type | Metric computation method to use for validation metrics  <br> `Optional, one of {none, coco, voc, coco_voc}` | voc |
| min_size | Minimum size of the image to be rescaled before feeding it to the backbone <br> *Note: training run may get into CUDA OOM if the size is too big* <br> `Optional, Positive Integer` | 600 |
| max_size | Maximum size of the image to be rescaled before feeding it to the backbone <br> *Note: training run may get into CUDA OOM if the size is too big* <br> `Optional, Positive Integer` | 1333 |
| box_score_thresh | During inference, only return proposals with a classification score<br> greater than box_score_thresh <br> `Optional, float in [0, 1]` | 0.3 |
| box_nms_thresh | NMS threshold for the prediction head. Used during inference <br> `Optional, float in [0, 1]` | 0.5 |
| box_detections_per_img | Maximum number of detections per image, for all classes <br> `Optional, Positive Integer` | 100 |

<br>
<b>Model-specific hyperparameters</b>
<br>

<b>For yolov5: </b>
| Parameter Name       | Description           | Default  |
| ------------- |-------------| -----|
| validation_metric_type | Metric computation method to use for validation metrics  <br> `Optional, one of {none, coco, voc, coco_voc}` | voc |
| img_size | Image size for train and validation <br> *Note: training run may get into CUDA OOM if the size is too big* <br> `Optional, Positive Integer` | 640 |
| model_size | Model size <br> *Note: training run may get into CUDA OOM if the model size is too big* <br> `Optional, one of {small, medium, large, xlarge}` | medium |
| multi_scale | Enable multi-scale image by varying image size by +/- 50% <br> *Note: training run may get into CUDA OOM if no sufficient GPU memory* <br> `Optional, 0 or 1` | 0 |
| box_score_thresh | During inference, only return proposals with a score<br> greater than box_score_thresh. The score is the multiplication of<br> the objectness score and classification probability <br> `Optional, float in [0, 1]` | 0.1 |
| box_iou_thresh | IoU threshold used during inference in nms post processing <br> `Optional, float in [0, 1]` | 0.5 |
<br>

### Sweeping hyperparameters for your model
When training vision models, model performance depends heavily on the hyperparameter values selected. Often times, you might want to tune the hyperparameters to get optimal performance.
AutoML for Images allows you to sweep hyperparameters to find the optimal settings for your model. It leverages the hyperparameter tuning capabilities in Azure Machine Learning - you can learn more [here](how-to-tune-hyperparameters).

#### Define the parameter search space
You can define the model algorithms and hyperparameters to sweep in the parameter space. See [Configure model algorithms and hyperparameters](#Configure-model-algorithms-and-hyperparameters) for the list of supported model algorithms and hyperparameters for each task type. Details on supported distributions for discrete and continuous hyperparameters can be found [here](how-to-tune-hyperparameters#define-the-search-space).

#### Sampling methods for the sweep
When sweeping hyperparameters, you need to specify the sampling method to use for sweeping over the defined parameter space. AutoML for Images supports the following sampling methods using the `hyperparameter_sampling` parameter:
<ul>
<li>Random Sampling</li>
<li>Grid Sampling (not supported yet for conditional spaces)</li>
<li>Bayesian Sampling (not supported yet for conditional spaces)</li>
</ul>

You can learn more about each of these sampling methods [here](how-to-tune-hyperparameters#sampling-the-hyperparameter-space).

#### Early termination policies
When using AutoML to sweep hyperparameters for your vision models, you can automatically end poorly performing runs with an early termination policy. Early termination improves computational efficiency, saving compute resources that would have been otherwise spent on less promising configurations. AutoML for Images supports the following early termination policies using the `policy` parameter -
<ul>
<li>Bandit Policy</li>
<li>Median Stopping Policy</li>
<li>Truncation Selection Policy</li>
</ul>

If no termination policy is specified, all configurations are run to completion.
You can learn more about configuring the early termination policy for your hyperparameter sweep [here](how-to-tune-hyperparameters#early-termination).

#### Resources for the sweep
You can control the resources spent on your hyperparameter sweep by specifying the `iterations` and the `max_concurrent_iterations` for the sweep.
<ul>
<li>iterations (required when sweeping): Maximum number of configurations to sweep. Must be an integer between 1 and 1000. </li>
<li>max_concurrent_iterations: (optional) Maximum number of runs that can run concurrently. If not specified, all runs launch in parallel. If specified, must be an integer between 1 and 100.  (NOTE: The number of concurrent runs is gated on the resources available in the specified compute target. Ensure that the compute target has the available resources for the desired concurrency.)</li>
</ul>

### Optimization metric
You can specify the metric to be used for model optimization and hyperparameter tuning using the optional `primary_metric` parameter. Default values depend on the task type -
<ul>
<li>'accuracy' for image-classification</li>
<li>'iou' for image-multi-labeling</li>
<li>'mean_average_precision' for image-object-detection</li>
<li>'mean_average_precision' for image-instance-segmentation</li>
</ul>

### Experiment budget
You can optionally specify the maximum time budget for your AutoML Vison experiment using `experiment_timeout_hours` - the amount of time in hours before the experiment terminates. If none specified, default experiment timeout is 6 days.

<!---
### Early stopping
You can optionally enable early stopping for your AutoML Vision experiment using `enable_early_stopping` parameter.
| Parameter Name       | Description           | Default  |
| ------------- |-------------| -----|
| early_stopping | Enable early stopping logic during training | 1 |
| early_stopping_patience | Minimum number of epochs/validation evaluations<br> with no primary metric score improvement before the run is stopped | 5 |
| early_stopping_delay | Minimum number of epochs/validation evaluations<br> to wait before primary metric score improvement is tracked for early stopping | 5 |
<br>
-->
### Arguments
You can pass fixed settings or parameters that don't change during the parameter space sweep as arguments. Arguments are passed in name-value pairs and the name must be prefixed by a double dash. For example:

```python
from azureml.train.automl import AutoMLImageConfig
arguments = ["--early_stopping", 1, "--evaluation_frequency", 2]
automl_image_config = AutoMLImageConfig(arguments=arguments)
```

### Configure your experiment settings
Before doing a large sweep to search for the optimal models and hyperparameters, we recommend trying the default values to get a first baseline. Next, you can explore multiple hyperparameters for the same model before sweeping over multiple models and their parameters. This is for employing a more iterative approach, because with multiple models and multiple hyperparameters for each (as we showcase in the next section), the search space grows exponentially and you need more iterations to find optimal configurations.

If you wish to use the default hyperparameter values for a given algorithm (say yolov5), you can specify the config for your AutoML Image runs as follows:

```python
from azureml.train.automl import AutoMLImageConfig
from azureml.train.hyperdrive import GridParameterSampling, choice

automl_image_config_yolov5 = AutoMLImageConfig(task='image-object-detection',
                                        compute_target=compute_target,
                                        training_data=training_dataset,
                                        validation_data=validation_dataset,
                                        hyperparameter_sampling=GridParameterSampling({'model_name': choice('yolov5')}))
```

Once you've built a baseline model using AutoML for Images, you might want to optimize model perfromance in order to sweep over the model algorithm and hyperparamter space. You can use the following sample config to sweep over the hyperparameters for each algorithm, choosing from a range of values for learning_rate, optimizer, lr_scheduler, etc, to generate a model with the optimal primary metric. If hyperparameter values are not specified, then default values are used for the specified algorithm.

```python
from azureml.train.automl import AutoMLImageConfig
from azureml.train.hyperdrive import GridParameterSampling, RandomParameterSampling, BayesianParameterSampling
from azureml.train.hyperdrive import BanditPolicy, HyperDriveConfig, PrimaryMetricGoal
from azureml.train.hyperdrive import choice, uniform

parameter_space = {
    'model': choice(
        {
            'model_name': choice('yolov5'),
            'learning_rate': uniform(0.0001, 0.01),
            #'model_size': choice('small', 'medium'), # model-specific
            'img_size': choice(640, 704, 768), # model-specific
        },
        {
            'model_name': choice('fasterrcnn_resnet50_fpn'),
            'learning_rate': uniform(0.0001, 0.001),
            #'warmup_cosine_lr_warmup_epochs': choice(0, 3),
            'optimizer': choice('sgd', 'adam', 'adamw'),
            'min_size': choice(600, 800), # model-specific
        }
    )
}

tuning_settings = {
    'iterations': 20, 
    'max_concurrent_iterations': 4, 
    'hyperparameter_sampling': RandomParameterSampling(parameter_space),  
    'policy': BanditPolicy(evaluation_interval=2, slack_factor=0.2, delay_evaluation=6)
}


automl_image_config = AutoMLImageConfig(task='image-object-detection',
                                        compute_target=compute_target,
                                        training_data=training_dataset,
                                        validation_data=validation_dataset,
                                        primary_metric='mean_average_precision',
                                        **tuning_settings)
```

### Run an AutoML experiment to train an image model
When you have your 'AutoMLImageConfig' object ready, you can submit the experiment.
```python
ws = Workspace.from_config()
experiment = Experiment(ws, "Tutorial-automl-image-object-detection")
automl_image_run = experiment.submit(automl_image_config)
```

### Register and deploy model
Once the run completes, we can register the model that was created from the best run (configuration that resulted in the best primary metric)
```Python
best_child_run = automl_image_run.get_best_child()
model_name = best_child_run.properties['model_name']
model = best_child_run.register_model(model_name = model_name, model_path='outputs/model.pt')
```
Once you have your trained model, you can deploy the model on Azure. You can deploy your trained model as a web service on Azure Container Instances (ACI) or Azure Kubernetes Service (AKS). ACI is the perfect option for testing deployments, while AKS is better suited for for high-scale, production usage.

This example deploys the model as a web service in AKS. You will need to first create an AKS compute cluster, or use an existing AKS cluster. You can use either GPU or CPU VM SKUs for your deployment cluster
```python

from azureml.core.compute import ComputeTarget, AksCompute
from azureml.exceptions import ComputeTargetException

# Choose a name for your cluster
aks_name = "cluster-aks-gpu"

# Check to see if the cluster already exists
try:
    aks_target = ComputeTarget(workspace=ws, name=aks_name)
    print('Found existing compute target')
except ComputeTargetException:
    print('Creating a new compute target...')
    # Provision AKS cluster with GPU machine
    prov_config = AksCompute.provisioning_configuration(vm_size="STANDARD_NC6", 
                                                        location="eastus2")
    # Create the cluster
    aks_target = ComputeTarget.create(workspace=ws, 
                                      name=aks_name, 
                                      provisioning_configuration=prov_config)
    aks_target.wait_for_completion(show_output=True)
```

Next, you will need to define the inference configuration, that describes how to set up the web-service containing your model. You can use the scoring script and the environment from the training run in your inference config.

```python
from azureml.core.model import InferenceConfig

best_child_run.download_file('outputs/scoring_file_v_1_0_0.py', output_file_path='score.py')
environment = best_child_run.get_environment()
inference_config = InferenceConfig(entry_script='score.py', environment=environment)
```

You can then deploy the model as an AKS web service.

```python
# Deploy the model from the best run as an AKS web service
from azureml.core.webservice import AksWebservice
from azureml.core.webservice import Webservice
from azureml.core.model import Model
from azureml.core.environment import Environment

aks_config = AksWebservice.deploy_configuration(autoscale_enabled=True,                                                    
                                                cpu_cores=1,
                                                memory_gb=50,
                                                enable_app_insights=True)

aks_service = Model.deploy(ws,
                           models=[model],
                           inference_config=inference_config,
                           deployment_config=aks_config,
                           deployment_target=aks_target,
                           name='automl-image-test',
                           overwrite=True)
aks_service.wait_for_deployment(show_output=True)
print(aks_service.state)
```

## Example notebooks
<!--  example link to notebook syntax -->
[example object detection notebook](https://github.com/swatig007/automlForImages/blob/main/ObjectDetection/AutoMLImage_ObjectDetection_SampleNotebook.ipynb)


## Next steps

<!-- What are some logical next steps. We typically link to other docs that would help users -->

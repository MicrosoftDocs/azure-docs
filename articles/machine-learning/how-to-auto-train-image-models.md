---
title: Set up AutoML for computer vision 
titleSuffix: Azure Machine Learning
description: Set up Azure Machine Learning automated ML to train computer vision models  with the Azure Machine Learning Python SDK (preview).
services: machine-learning
author: swatig007
ms.author: swatig
ms.service: machine-learning
ms.subservice: core
ms.topic: how-to
ms.custom: automl
ms.date: 10/06/2021

# Customer intent: I'm a data scientist with ML knowledge in the computer vision space, looking to build ML models using image data in Azure Machine Learning with full control of the model algorithm, hyperparameters, and training and deployment environments.

---

# Set up AutoML to train computer vision models with Python (preview)

> [!IMPORTANT]
> This feature is currently in public preview. This preview version is provided without a service-level agreement. Certain features might not be supported or might have constrained capabilities. For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

In this article, you learn how to train computer vision models on image data with automated ML in the [Azure Machine Learning Python SDK](/python/api/overview/azure/ml/).

Automated ML supports model training for computer vision tasks like image classification, object detection, and instance segmentation. Authoring AutoML models for computer vision tasks is currently supported via the Azure Machine Learning Python SDK. The resulting experimentation runs, models, and outputs are accessible from the Azure Machine Learning studio UI. [Learn more about automated ml for computer vision tasks on image data](concept-automated-ml.md).

> [!NOTE]
> Automated ML for computer vision tasks is only available via the Azure Machine Learning Python SDK. 

## Prerequisites

* An Azure Machine Learning workspace. To create the workspace, see [Create an Azure Machine Learning workspace](how-to-manage-workspace.md).

* The Azure Machine Learning Python SDK installed.
    To install the SDK you can either, 
    * Create a compute instance, which automatically installs the SDK and is pre-configured for ML workflows. For more information, see [Create and manage an Azure Machine Learning compute instance](how-to-create-manage-compute-instance.md).

    * [Install the `automl` package yourself](https://github.com/Azure/MachineLearningNotebooks/blob/master/how-to-use-azureml/automated-machine-learning/README.md#setup-using-a-local-conda-environment), which includes the [default installation](/python/api/overview/azure/ml/install#default-install) of the SDK.
    
    > [!NOTE]
    > Only Python 3.6 and 3.7 are compatible with automated ML support for computer vision tasks. 

## Select your task type
Automated ML for images supports the following task types:


Task type | AutoMLImage config syntax
---|---
 image classification | `ImageTask.IMAGE_CLASSIFICATION`
image classification multi-label | `ImageTask.IMAGE_CLASSIFICATION_MULTILABEL`
image object detection | `ImageTask.IMAGE_OBJECT_DETECTION`
image instance segmentation| `ImageTask.IMAGE_INSTANCE_SEGMENTATION`

This task type is a required parameter and is passed in using the `task` parameter in the `AutoMLImageConfig`. 
For example:

```python
from azureml.train.automl import AutoMLImageConfig
from azureml.automl.core.shared.constants import ImageTask
automl_image_config = AutoMLImageConfig(task=ImageTask.IMAGE_OBJECT_DETECTION)
```

## Training and validation data

In order to generate computer vision models, you need to bring labeled image data as input for model training in the form of an Azure Machine Learning [TabularDataset](/python/api/azureml-core/azureml.data.tabulardataset). You can either use a `TabularDataset` that you have [exported from a data labeling project](how-to-create-labeling-projects.md#export-the-labels), or create a new `TabularDataset` with your labeled training data. 

If your training data is in a different format (like, pascal VOC or COCO), you can apply the helper scripts included with the sample notebooks to convert the data to JSONL. Learn more about how to [prepare data for computer vision tasks with automated ML](how-to-prepare-datasets-for-automl-images.md). 

> [!Warning]
> Creation of TabularDatasets is only supported using the SDK to create datasets from data in JSONL format for this capability. Creating the dataset via UI is not supported at this time.


### JSONL schema samples

The structure of the TabularDataset depends upon the task at hand. For computer vision task types, it consists of the following fields:

Field| Description
---|---
`image_url`| Contains filepath as a StreamInfo object
`image_details`|Image metadata information consists of height, width, and format. This field is optional and hence may or may not exist.
`label`| A json representation of the image label, based on the task type.

The following is a sample JSONL file for image classification:

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

  The following code is a sample JSONL file for object detection:

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


### Consume data

Once your data is in JSONL format, you can create a TabularDataset with the following code:

```python
from azureml.core import Dataset

training_dataset = Dataset.Tabular.from_json_lines_files(
        path=ds.path('odFridgeObjects/odFridgeObjects.jsonl'),
        set_column_types={'image_url': DataType.to_stream(ds.workspace)})
training_dataset = training_dataset.register(workspace=ws, name=training_dataset_name)
```

Automated ML does not impose any constraints on training or validation data size for computer vision tasks. Maximum dataset size is only limited by the storage layer behind the dataset (i.e. blob store). There is no minimum number of images or labels. However, we recommend to start with a minimum of 10-15 samples per label to ensure the output model is sufficiently trained. The higher the total number of labels/classes, the more samples you need per label.



Training data is a required and is passed in using the `training_data` parameter. You can optionally specify another TabularDataset as a validation dataset to be used for your model with the `validation_data` parameter of the AutoMLImageConfig. If no validation dataset is specified, 20% of your training data will be used for validation by default, unless you pass `split_ratio` argument with a different value.

For example:

```python
from azureml.train.automl import AutoMLImageConfig
automl_image_config = AutoMLImageConfig(training_data=training_dataset)
```

## Compute to run experiment

Provide a [compute target](concept-azure-machine-learning-architecture.md#compute-targets) for automated ML to conduct model training. Automated ML models for computer vision tasks require GPU SKUs and support NC and ND families. We recommend the NCsv3-series (with v100 GPUs) for faster training. A compute target with a multi-GPU VM SKU leverages multiple GPUs to also speed up training. Additionally, when you set up a compute target with multiple nodes you can conduct faster model training through parallelism when tuning hyperparameters for your model.

The compute target is a required parameter and is passed in using the `compute_target` parameter of the `AutoMLImageConfig`. For example:

```python
from azureml.train.automl import AutoMLImageConfig
automl_image_config = AutoMLImageConfig(compute_target=compute_target)
```

## Configure model algorithms and hyperparameters

With support for computer vision tasks, you can control the model algorithm and sweep hyperparameters. These model algorithms and hyperparameters are passed in as the parameter space for the sweep.

The model algorithm is required and is passed in via `model_name` parameter. You can either specify a single `model_name` or choose between multiple. In addition to controlling the model algorithm, you can also tune hyperparameters used for model training. While many of the hyperparameters exposed are model-agnostic, there are instances where hyperparameters are task-specific or model-specific.

### Supported model algorithms

The following table summarizes the supported models for each computer vision task. 

Task |  Model algorithms | String literal syntax<br> ***`default_model`\**** denoted with \*
---|----------|----------
Image classification<br> (multi-class and multi-label)| **MobileNet**: Light-weighted models for mobile applications <br> **ResNet**: Residual networks<br> **ResNeSt**: Split attention networks<br> **SE-ResNeXt50**: Squeeze-and-Excitation networks<br> **ViT**: Vision transformer networks| `mobilenetv2`   <br>`resnet18` <br>`resnet34` <br> `resnet50`  <br> `resnet101` <br> `resnet152`    <br> `resnest50` <br> `resnest101`  <br> `seresnext`  <br> `vits16r224` (small) <br> ***`vitb16r224`\**** (base) <br>`vitl16r224` (large)|
Object detection | **YOLOv5**: One stage object detection model   <br>  **Faster RCNN ResNet FPN**: Two stage object detection models  <br> **RetinaNet ResNet FPN**: address class imbalance with Focal Loss <br> <br>*Note: Refer to [`model_size` hyperparameter](#model-specific-hyperparameters) for YOLOv5 model sizes.*| ***`yolov5`\**** <br> `fasterrcnn_resnet18_fpn` <br> `fasterrcnn_resnet34_fpn` <br> `fasterrcnn_resnet50_fpn` <br> `fasterrcnn_resnet101_fpn` <br> `fasterrcnn_resnet152_fpn` <br> `retinanet_resnet50_fpn` 
Instance segmentation | **MaskRCNN ResNet FPN**| `maskrcnn_resnet18_fpn` <br> `maskrcnn_resnet34_fpn` <br> ***`maskrcnn_resnet50_fpn`\****  <br> `maskrcnn_resnet101_fpn` <br> `maskrcnn_resnet152_fpn` <br>`maskrcnn_resnet50_fpn`


### Model agnostic hyperparameters

The following table describes the hyperparameters that are model agnostic.

| Parameter name | Description | Default|
| ------------ | ------------- | ------------ |
| `number_of_epochs` | Number of training epochs. <br>Must be a positive integer. |  15 <br> (except `yolov5`: 30) |
| `training_batch_size` | Training batch size.<br> Must be a positive integer.  | Multi-class/multi-label: 78 <br>(except *vit-variants*: <br> `vits16r224`: 128 <br>`vitb16r224`: 48 <br>`vitl16r224`:10)<br><br>Object detection: 2 <br>(except `yolov5`: 16) <br><br> Instance segmentation: 2  <br> <br> *Note: The defaults are largest batch size that can be used on 12 GiB GPU memory*.|
| `validation_batch_size` | Validation batch size.<br> Must be a positive integer. | Multi-class/multi-label: 78 <br>(except *vit-variants*: <br> `vits16r224`: 128 <br>`vitb16r224`: 48 <br>`vitl16r224`:10)<br><br>Object detection: 1 <br>(except `yolov5`: 16) <br><br> Instance segmentation: 1  <br> <br> *Note: The defaults are largest batch size that can be used on 12 GiB GPU memory*.|
| `grad_accumulation_step` | Gradient accumulation means running a configured number of `grad_accumulation_step` without updating the model weights while accumulating the gradients of those steps, and then using the accumulated gradients to compute the weight updates. <br> Must be a positive integer. | 1 |
| `early_stopping` | Enable early stopping logic during training. <br> Must be 0 or 1.| 1 |
| `early_stopping_patience` | Minimum number of epochs or validation evaluations with<br>no primary metric improvement before the run is stopped.<br> Must be a positive integer. | 5 |
| `early_stopping_delay` | Minimum number of epochs or validation evaluations to wait<br>before primary metric improvement is tracked for early stopping.<br> Must be a positive integer. | 5 |
| `learning_rate` | Initial learning rate. <br>Must be a float in the range [0, 1]. | Multi-class: 0.01 <br>(except *vit-variants*: <br> `vits16r224`: 0.0125<br>`vitb16r224`: 0.0125<br>`vitl16r224`: 0.001) <br><br> Multi-label: 0.035 <br>(except *vit-variants*:<br>`vits16r224`: 0.025<br>`vitb16r224`: 0.025 <br>`vitl16r224`: 0.002) <br><br> Object detection: 0.005 <br>(except `yolov5`: 0.01) <br><br> Instance segmentation: 0.005  |
| `lr_scheduler` | Type of learning rate scheduler. <br> Must be `warmup_cosine` or `step`. | `warmup_cosine` |
| `step_lr_gamma` | Value of gamma when learning rate scheduler is `step`.<br> Must be a float in the range [0, 1]. | 0.5 |
| `step_lr_step_size` | Value of step size when learning rate scheduler is `step`.<br> Must be a positive integer. | 5 |
| `warmup_cosine_lr_cycles` | Value of cosine cycle when learning rate scheduler is `warmup_cosine`. <br> Must be a float in the range [0, 1]. | 0.45 |
| `warmup_cosine_lr_warmup_epochs` | Value of warmup epochs when learning rate scheduler is `warmup_cosine`. <br> Must be a positive integer. | 2 |
| `optimizer` | Type of optimizer. <br> Must be either `sgd`, `adam`, `adamw`.  | `sgd` |
| `momentum` | Value of momentum when optimizer is `sgd`. <br> Must be a float in the range [0, 1]. | 0.9 |
| `weight_decay` | Value of weight decay when optimizer is `sgd`, `adam`, or `adamw`. <br> Must be a float in the range [0, 1]. | 1e-4 |
|`nesterov`| Enable `nesterov` when optimizer is `sgd`. <br> Must be 0 or 1.| 1 |
|`beta1` | Value of `beta1` when optimizer is `adam` or `adamw`. <br> Must be a float in the range [0, 1]. | 0.9 |
|`beta2` | Value of `beta2` when optimizer is `adam` or `adamw`.<br> Must be a float in the range [0, 1]. | 0.999 |
|`amsgrad` | Enable `amsgrad` when optimizer is `adam` or `adamw`.<br> Must be 0 or 1. | 0 |
|`evaluation_frequency`| Frequency to evaluate validation dataset to get metric scores. <br> Must be a positive integer. | 1 |
|`split_ratio`| If validation data is not defined, this specifies the split ratio for splitting train data into random train and validation subsets. <br> Must be a float in the range [0, 1].| 0.2 |
|`checkpoint_frequency`| Frequency to store model checkpoints. <br> Must be a positive integer. | Checkpoint at epoch with best primary metric on validation.|
|`layers_to_freeze`| How many layers to freeze for your model. For instance, passing 2 as value for `seresnext` means freezing layer0 and layer1 referring to the below supported model layer info. <br> Must be a positive integer. <br><br>`'resnet': [('conv1.', 'bn1.'), 'layer1.', 'layer2.', 'layer3.', 'layer4.'],`<br>`'mobilenetv2': ['features.0.', 'features.1.', 'features.2.', 'features.3.', 'features.4.', 'features.5.', 'features.6.', 'features.7.', 'features.8.', 'features.9.', 'features.10.', 'features.11.', 'features.12.', 'features.13.', 'features.14.', 'features.15.', 'features.16.', 'features.17.', 'features.18.'],`<br>`'seresnext': ['layer0.', 'layer1.', 'layer2.', 'layer3.', 'layer4.'],`<br>`'vit': ['patch_embed', 'blocks.0.', 'blocks.1.', 'blocks.2.', 'blocks.3.', 'blocks.4.', 'blocks.5.', 'blocks.6.','blocks.7.', 'blocks.8.', 'blocks.9.', 'blocks.10.', 'blocks.11.'],`<br>`'yolov5_backbone': ['model.0.', 'model.1.', 'model.2.', 'model.3.', 'model.4.','model.5.', 'model.6.', 'model.7.', 'model.8.', 'model.9.'],`<br>`'resnet_backbone': ['backbone.body.conv1.', 'backbone.body.layer1.', 'backbone.body.layer2.','backbone.body.layer3.', 'backbone.body.layer4.']` | no default  |


### Task-specific hyperparameters

The following table summarizes hyperparmeters for image classification (multi-class and multi-label) tasks.


| Parameter name       | Description           | Default  |
| ------------- |-------------|-----|
| `weighted_loss` | 0 for no weighted loss.<br>1 for weighted loss with sqrt.(class_weights) <br> 2 for weighted loss with class_weights. <br> Must be 0 or 1 or 2. | 0 |
| `valid_resize_size` | Image size to which to resize before cropping for validation dataset. <br> Must be a positive integer. <br> <br> *Notes: <li> `seresnext` doesn't take an arbitrary size. <li> Training run may get into CUDA OOM if the size is too big*.  | 256  |
| `valid_crop_size` | Image crop size that's input to your neural network for validation dataset.  <br> Must be a positive integer. <br> <br> *Notes: <li> `seresnext` doesn't take an arbitrary size. <li> *ViT-variants* should have the same `valid_crop_size` and `train_crop_size`. <li> Training run may get into CUDA OOM if the size is too big*. | 224 |
| `train_crop_size` | Image crop size that's input to your neural network for train dataset.  <br> Must be a positive integer. <br> <br> *Notes: <li> `seresnext` doesn't take an arbitrary size. <li> *ViT-variants* should have the same `valid_crop_size` and `train_crop_size`. <li> Training run may get into CUDA OOM if the size is too big*. | 224 |


The following hyperparameters are for object detection and instance segmentation tasks.

> [!Warning]
> These parameters are not supported with the `yolov5` algorithm.

| Parameter name       | Description           | Default  |
| ------------- |-------------|-----|
| `validation_metric_type` | Metric computation method to use for validation metrics.  <br> Must be `none`, `coco`, `voc`, or `coco_voc`. | `voc` |
| `min_size` | Minimum size of the image to be rescaled before feeding it to the backbone. <br> Must be a positive integer. <br> <br> *Note: training run may get into CUDA OOM if the size is too big*.| 600 |
| `max_size` | Maximum size of the image to be rescaled before feeding it to the backbone. <br> Must be a positive integer.<br> <br> *Note: training run may get into CUDA OOM if the size is too big*. | 1333 |
| `box_score_thresh` | During inference, only return proposals with a classification score greater than `box_score_thresh`. <br> Must be a float in the range [0, 1].| 0.3 |
| `box_nms_thresh` | Non-maximum suppression (NMS) threshold for the prediction head. Used during inference.  <br>Must be a float in the range [0, 1]. | 0.5 |
| `box_detections_per_img` | Maximum number of detections per image, for all classes. <br> Must be a positive integer.| 100 |
| `tile_grid_size` | The grid size to use for tiling each image. <br>*Note: tile_grid_size must not be None to enable [small object detection](how-to-use-automl-small-object-detect.md) logic*<br> A tuple of two integers passed as a string. Example: --tile_grid_size "(3, 2)" | No Default |
| `tile_overlap_ratio` | Overlap ratio between adjacent tiles in each dimension. <br> Must be float in the range of [0, 1) | 0.25 |
| `tile_predictions_nms_thresh` | The IOU threshold to use to perform NMS while merging predictions from tiles and image. Used in validation/ inference. <br> Must be float in the range of [0, 1] | 0.25 |

### Model-specific hyperparameters

This table summarizes hyperparameters specific to the `yolov5` algorithm.

| Parameter name       | Description           | Default  |
| ------------- |-------------|----|
| `validation_metric_type` | Metric computation method to use for validation metrics.  <br> Must be `none`, `coco`, `voc`, or `coco_voc`. | `voc` |
| `img_size` | Image size for train and validation. <br> Must be a positive integer. <br> <br> *Note: training run may get into CUDA OOM if the size is too big*. | 640 |
| `model_size` | Model size. <br> Must be `small`, `medium`, `large`, or `xlarge`. <br><br> *Note: training run may get into CUDA OOM if the model size is too big*.  | `medium` |
| `multi_scale` | Enable multi-scale image by varying image size by +/- 50% <br> Must be 0 or 1. <br> <br> *Note: training run may get into CUDA OOM if no sufficient GPU memory*. | 0 |
| `box_score_thresh` | During inference, only return proposals with a score greater than `box_score_thresh`. The score is the multiplication of the objectness score and classification probability. <br> Must be a float in the range [0, 1]. | 0.1 |
| `box_iou_thresh` | IoU threshold used during inference in non-maximum suppression post processing. <br> Must be a float in the range [0, 1]. | 0.5 |


### Data augmentation 

In general, deep learning model performance can often improve with more data. Data augmentation is a practical technique to amplify the data size and variability of a dataset which helps to prevent overfitting and improve the model’s generalization ability on unseen data. Automated ML applies different data augmentation techniques based on the computer vision task, before feeding input images to the model. Currently, there is no exposed hyperparameter to control data augmentations. 

|Task | Impacted dataset | Data augmentation technique(s) applied |
|-------|----------|---------|
|Image classification (multi-class and multi-label) | Training <br><br><br> Validation & Test| Random resize and crop, horizontal flip, color jitter (brightness, contrast, saturation, and hue), normalization using channel-wise ImageNet’s mean and standard deviation <br><br><br>Resize, center crop, normalization |
|Object detection, instance segmentation| Training <br><br> Validation & Test |Random crop around bounding boxes, expand, horizontal flip, normalization, resize <br><br><br>Normalization, resize
|Object detection using yolov5| Training <br><br> Validation & Test  |Mosaic, random affine (rotation, translation, scale, shear), horizontal flip <br><br><br> Letterbox resizing|

## Configure your experiment settings

Before doing a large sweep to search for the optimal models and hyperparameters, we recommend trying the default values to get a first baseline. Next, you can explore multiple hyperparameters for the same model before sweeping over multiple models and their parameters. This way, you can employ a more iterative approach, because with multiple models and multiple hyperparameters for each, the search space grows exponentially and you need more iterations to find optimal configurations.

If you wish to use the default hyperparameter values for a given algorithm (say yolov5), you can specify the config for your AutoML Image runs as follows:

```python
from azureml.train.automl import AutoMLImageConfig
from azureml.train.hyperdrive import GridParameterSampling, choice
from azureml.automl.core.shared.constants import ImageTask

automl_image_config_yolov5 = AutoMLImageConfig(task=ImageTask.IMAGE_OBJECT_DETECTION,
                                               compute_target=compute_target,
                                               training_data=training_dataset,
                                               validation_data=validation_dataset,
                                               hyperparameter_sampling=GridParameterSampling({'model_name': choice('yolov5')}),
                                               iterations=1)
```

Once you've built a baseline model, you might want to optimize model performance in order to sweep over the model algorithm and hyperparameter space. You can use the following sample config to sweep over the hyperparameters for each algorithm, choosing from a range of values for learning_rate, optimizer, lr_scheduler, etc., to generate a model with the optimal primary metric. If hyperparameter values are not specified, then default values are used for the specified algorithm.

### Primary metric

The primary metric used for model optimization and hyperparameter tuning depends on the task type. Using other primary metric values is currently not supported. 

* `accuracy` for IMAGE_CLASSIFICATION
* `iou` for IMAGE_CLASSIFICATION_MULTILABEL
* `mean_average_precision` for IMAGE_OBJECT_DETECTION
* `mean_average_precision` for IMAGE_INSTANCE_SEGMENTATION
    
### Experiment budget

You can optionally specify the maximum time budget for your AutoML Vision experiment using `experiment_timeout_hours` - the amount of time in hours before the experiment terminates. If none specified, default experiment timeout is seven days (maximum 60 days).

## Sweeping hyperparameters for your model

When training computer vision models, model performance depends heavily on the hyperparameter values selected. Often, you might want to tune the hyperparameters to get optimal performance.
With support for computer vision tasks in automated ML, you can sweep hyperparameters to find the optimal settings for your model. This feature applies the hyperparameter tuning capabilities in Azure Machine Learning. [Learn how to tune hyperparameters](how-to-tune-hyperparameters.md).

### Define the parameter search space

You can define the model algorithms and hyperparameters to sweep in the parameter space. See [Configure model algorithms and hyperparameters](#configure-model-algorithms-and-hyperparameters) for the list of supported model algorithms and hyperparameters for each task type. See [details on supported distributions for discrete and continuous hyperparameters](how-to-tune-hyperparameters.md#define-the-search-space).


### Sampling methods for the sweep

When sweeping hyperparameters, you need to specify the sampling method to use for sweeping over the defined parameter space. Currently, the following sampling methods are supported with the `hyperparameter_sampling` parameter:

* [Random sampling](how-to-tune-hyperparameters.md#random-sampling)
* [Grid sampling](how-to-tune-hyperparameters.md#grid-sampling) 
* [Bayesian sampling](how-to-tune-hyperparameters.md#bayesian-sampling) 
    
It should be noted that currently only random sampling supports conditional hyperparameter spaces


### Early termination policies

You can automatically end poorly performing runs with an early termination policy. Early termination improves computational efficiency, saving compute resources that would have been otherwise spent on less promising configurations. Automated ML for images supports the following early termination policies using the `early_termination_policy` parameter. If no termination policy is specified, all configurations are run to completion.

* [Bandit policy](how-to-tune-hyperparameters.md#bandit-policy)
* [Median stopping policy](how-to-tune-hyperparameters.md#median-stopping-policy)
* [Truncation selection policy](how-to-tune-hyperparameters.md#truncation-selection-policy)

Learn more about [how to configure the early termination policy for your hyperparameter sweep](how-to-tune-hyperparameters.md#early-termination).

### Resources for the sweep

You can control the resources spent on your hyperparameter sweep by specifying the `iterations` and the `max_concurrent_iterations` for the sweep.

Parameter | Detail
-----|----
`iterations` |  Required parameter for maximum number of configurations to sweep. Must be an integer between 1 and 1000. When exploring just the default hyperparameters for a given model algorithm, set this parameter to 1.
`max_concurrent_iterations`| Maximum number of runs that can run concurrently. If not specified, all runs launch in parallel. If specified, must be an integer between 1 and 100.  <br><br> **NOTE:** The number of concurrent runs is gated on the resources available in the specified compute target. Ensure that the compute target has the available resources for the desired concurrency.


> [!NOTE]
> For a complete sweep configuration sample, please refer to this [tutorial](tutorial-auto-train-image-models.md#hyperparameter-sweeping-for-image-tasks).

### Arguments

You can pass fixed settings or parameters that don't change during the parameter space sweep as arguments. Arguments are passed in name-value pairs and the name must be prefixed by a double dash. 

```python
from azureml.train.automl import AutoMLImageConfig
arguments = ["--early_stopping", 1, "--evaluation_frequency", 2]
automl_image_config = AutoMLImageConfig(arguments=arguments)
```

## Submit the run

When you have your `AutoMLImageConfig` object ready, you can submit the experiment.

```python
ws = Workspace.from_config()
experiment = Experiment(ws, "Tutorial-automl-image-object-detection")
automl_image_run = experiment.submit(automl_image_config)
```
## Outputs and evaluation metrics

The automl training runs generates output model files, evaluation metrics, logs and deployment artifacts like the scoring file and the environment file which can be viewed from the outputs and logs and metrics tab of the child runs.

> [!TIP]
> Check how to navigate to the run results from the  [View run results](how-to-understand-automated-ml.md#view-run-results) section.

For definitions and examples of the performance charts and metrics provided for each run, see [Evaluate automated machine learning experiment results](how-to-understand-automated-ml.md#metrics-for-image-models-preview)

## Register and deploy model

Once the run completes, you can register the model that was created from the best run (configuration that resulted in the best primary metric)

```Python
best_child_run = automl_image_run.get_best_child()
model_name = best_child_run.properties['model_name']
model = best_child_run.register_model(model_name = model_name, model_path='outputs/model.pt')
```

After you register the model you want to use, you can deploy it as a web service on [Azure Container Instances (ACI)](how-to-deploy-azure-container-instance.md) or [Azure Kubernetes Service (AKS)](how-to-deploy-azure-kubernetes-service.md). ACI is the perfect option for testing deployments, while AKS is better suited for high-scale, production usage.

This example deploys the model as a web service in AKS. To deploy in AKS, first create an AKS compute cluster or use an existing AKS cluster. You can use either GPU or CPU VM SKUs for your deployment cluster. 

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

Next, you can define the inference configuration, that describes how to set up the web-service containing your model. You can use the scoring script and the environment from the training run in your inference config.

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

Alternatively, you can deploy the model from the [Azure Machine Learning studio UI](https://ml.azure.com/). 
Navigate to the model you wish to deploy in the **Models** tab of the automated ML run and select the **Deploy**.  

![Select model from the automl runs in studio UI  ](./media/how-to-auto-train-image-models/select-model.png)

You can configure the model deployment endpoint name and the inferencing cluster to use for your model deployment in the **Deploy a model** pane.

![Deploy configuration](./media/how-to-auto-train-image-models/deploy-image-model.png)

### Update inference configuration

In the previous step, we downloaded the scoring file `outputs/scoring_file_v_1_0_0.py` from the best model into a local `score.py` file and we used it to create an `InferenceConfig` object. This script can be modified to change the model specific inference settings if needed after it has been downloaded and before creating the `InferenceConfig`. For instance, this is the code section that initializes the model in the scoring file:
    
```
...
def init():
    ...
    try:
        logger.info("Loading model from path: {}.".format(model_path))
        model_settings = {...}
        model = load_model(TASK_TYPE, model_path, **model_settings)
        logger.info("Loading successful.")
    except Exception as e:
        logging_utilities.log_traceback(e, logger)
        raise
...
```

Each of the tasks (and some models) have a set of parameters in the `model_settings` dictionary. By default, we use the same values for the parameters that were used during the training and validation. Depending on the behavior that we need when using the model for inference, we can change these parameters. Below you can find a list of parameters for each task type and model.  

| Task | Parameter name | Default  |
|--------- |------------- | --------- |
|Image classification (multi-class and multi-label) | `valid_resize_size`<br>`valid_crop_size` | 256<br>224 |
|Object detection, instance segmentation| `min_size`<br>`max_size`<br>`box_score_thresh`<br>`box_nms_thresh`<br>`box_detections_per_img` | 600<br>1333<br>0.3<br>0.5<br>100 |
|Object detection using `yolov5`| `img_size`<br>`model_size`<br>`box_score_thresh`<br>`box_iou_thresh` | 640<br>medium<br>0.1<br>0.5 |

For a detailed description on these parameters, please refer to the above section on [task specific hyperparameters](#task-specific-hyperparameters).
    
If you want to use tiling, and want to control tiling behavior, the following parameters are available: `tile_grid_size`, `tile_overlap_ratio` and `tile_predictions_nms_thresh`. For more details on these parameters please check [Train a small object detection model using AutoML](how-to-use-automl-small-object-detect.md).

## Example notebooks
Review detailed code examples and use cases in the [GitHub notebook repository for automated machine learning samples](https://github.com/Azure/azureml-examples/tree/main/python-sdk/tutorials/automl-with-azureml). Please check the folders with 'image-' prefix for samples specific to building computer vision models.


## Next steps

* [Tutorial: Train an object detection model (preview) with AutoML and Python](tutorial-auto-train-image-models.md).
* [Troubleshoot automated ML experiments](how-to-troubleshoot-auto-ml.md). 

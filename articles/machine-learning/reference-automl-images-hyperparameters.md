---
title: Hyperparameter for AutoML computer vision tasks
titleSuffix: Azure Machine Learning
description: Learn which hyperparameters are available for computer vision tasks with automated ML.
services: machine-learning
ms.service: machine-learning
ms.subservice: automl
ms.custom: ignite-2022
ms.topic: reference
ms.reviewer: ssalgado
author: swatig007
ms.author: swatig
ms.date: 01/18/2022
---

# Hyperparameters for computer vision tasks in automated machine learning

[!INCLUDE [dev v2](includes/machine-learning-dev-v2.md)]

Learn which hyperparameters are available specifically for computer vision tasks in automated ML experiments.

With support for computer vision tasks, you can control the model architecture and sweep hyperparameters. These model architectures and hyperparameters are passed in as the parameter space for the sweep. While many of the hyperparameters exposed are model-agnostic, there are instances where hyperparameters are model-specific or task-specific.

## Model-specific hyperparameters

This table summarizes hyperparameters specific to the `yolov5` architecture.

| Parameter name       | Description           | Default  |
| ------------- |-------------|----|
| `validation_metric_type` | Metric computation method to use for validation metrics.  <br> Must be `none`, `coco`, `voc`, or `coco_voc`. | `voc` |
| `validation_iou_threshold` | IOU threshold for box matching when computing validation metrics.  <br>Must be a float in the range [0.1, 1]. | 0.5 |
| `image_size` | Image size for train and validation. <br> Must be a positive integer. <br> <br> *Note: training run may get into CUDA OOM if the size is too big*. | 640 |
| `model_size` | Model size. <br> Must be `small`, `medium`, `large`, or `extra_large`. <br><br> *Note: training run may get into CUDA OOM if the model size is too big*.  | `medium` |
| `multi_scale` | Enable multi-scale image by varying image size by +/- 50% <br> Must be 0 or 1. <br> <br> *Note: training run may get into CUDA OOM if no sufficient GPU memory*. | 0 |
| `box_score_threshold` | During inference, only return proposals with a score greater than `box_score_threshold`. The score is the multiplication of the objectness score and classification probability. <br> Must be a float in the range [0, 1]. | 0.1 |
| `nms_iou_threshold` | IOU threshold used during inference in non-maximum suppression post processing. <br> Must be a float in the range [0, 1]. | 0.5 |
| `tile_grid_size` | The grid size to use for tiling each image. <br>*Note: tile_grid_size must not be None to enable [small object detection](how-to-use-automl-small-object-detect.md) logic*<br> Should be passed as a string in '3x2' format. Example: --tile_grid_size '3x2' | No Default |
| `tile_overlap_ratio` | Overlap ratio between adjacent tiles in each dimension. <br> Must be float in the range of [0, 1) | 0.25 |
| `tile_predictions_nms_threshold` | The IOU threshold to use to perform NMS while merging predictions from tiles and image. Used in validation/ inference. <br> Must be float in the range of [0, 1] | 0.25 |

This table summarizes hyperparameters specific to the `maskrcnn_*` for instance segmentation during inference.

| Parameter name       | Description           | Default  |
| ------------- |-------------|----|
| `mask_pixel_score_threshold` | Score cutoff for considering a pixel as part of the mask of an object. | 0.5 |
| `max_number_of_polygon_points` | Maximum number of (x, y) coordinate pairs in polygon after converting from a mask. | 100 |
| `export_as_image` | Export masks as images. | False |
| `image_type` | Type of image to export mask as (options are jpg, png, bmp).  | JPG |

## Model agnostic hyperparameters

The following table describes the hyperparameters that are model agnostic.

| Parameter name | Description | Default|
| ------------ | ------------- | ------------ |
| `number_of_epochs` | Number of training epochs. <br>Must be a positive integer. |  15 <br> (except `yolov5`: 30) |
| `training_batch_size` | Training batch size.<br> Must be a positive integer.  | Multi-class/multi-label: 78 <br>(except *vit-variants*: <br> `vits16r224`: 128 <br>`vitb16r224`: 48 <br>`vitl16r224`:10)<br><br>Object detection: 2 <br>(except `yolov5`: 16) <br><br> Instance segmentation: 2  <br> <br> *Note: The defaults are largest batch size that can be used on 12 GiB GPU memory*.|
| `validation_batch_size` | Validation batch size.<br> Must be a positive integer. | Multi-class/multi-label: 78 <br>(except *vit-variants*: <br> `vits16r224`: 128 <br>`vitb16r224`: 48 <br>`vitl16r224`:10)<br><br>Object detection: 1 <br>(except `yolov5`: 16) <br><br> Instance segmentation: 1  <br> <br> *Note: The defaults are largest batch size that can be used on 12 GiB GPU memory*.|
| `gradient_accumulation_step` | Gradient accumulation means running a configured number of `gradient_accumulation_step` without updating the model weights while accumulating the gradients of those steps, and then using the accumulated gradients to compute the weight updates. <br> Must be a positive integer. | 1 |
| `early_stopping` | Enable early stopping logic during training. <br> Must be 0 or 1.| 1 |
| `early_stopping_patience` | Minimum number of epochs or validation evaluations with<br>no primary metric improvement before the run is stopped.<br> Must be a positive integer. | 5 |
| `early_stopping_delay` | Minimum number of epochs or validation evaluations to wait<br>before primary metric improvement is tracked for early stopping.<br> Must be a positive integer. | 5 |
| `learning_rate` | Initial learning rate. <br>Must be a float in the range [0, 1]. | Multi-class: 0.01 <br>(except *vit-variants*: <br> `vits16r224`: 0.0125<br>`vitb16r224`: 0.0125<br>`vitl16r224`: 0.001) <br><br> Multi-label: 0.035 <br>(except *vit-variants*:<br>`vits16r224`: 0.025<br>`vitb16r224`: 0.025 <br>`vitl16r224`: 0.002) <br><br> Object detection: 0.005 <br>(except `yolov5`: 0.01) <br><br> Instance segmentation: 0.005  |
| `learning_rate_scheduler` | Type of learning rate scheduler. <br> Must be `warmup_cosine` or `step`. | `warmup_cosine` |
| `step_lr_gamma` | Value of gamma when learning rate scheduler is `step`.<br> Must be a float in the range [0, 1]. | 0.5 |
| `step_lr_step_size` | Value of step size when learning rate scheduler is `step`.<br> Must be a positive integer. | 5 |
| `warmup_cosine_lr_cycles` | Value of cosine cycle when learning rate scheduler is `warmup_cosine`. <br> Must be a float in the range [0, 1]. | 0.45 |
| `warmup_cosine_lr_warmup_epochs` | Value of warmup epochs when learning rate scheduler is `warmup_cosine`. <br> Must be a positive integer. | 2 |
| `optimizer` | Type of optimizer. <br> Must be either `sgd`, `adam`, `adamw`.  | `sgd` |
| `momentum` | Value of momentum when optimizer is `sgd`. <br> Must be a float in the range [0, 1]. | 0.9 |
| `weight_decay` | Value of weight decay when optimizer is `sgd`, `adam`, or `adamw`. <br> Must be a float in the range [0, 1]. | 1e-4 |
|`nesterov`| Enable `nesterov` when optimizer is `sgd`. <br> Must be 0 or 1.| 1 |
|`beta1` | Value of `beta1` when optimizer is `adam` or `adamw`. <br> Must be a float in the range [0, 1]. | 0.9 |
|`beta2` | Value of `beta2` when optimizer is `adam` or `adamw`.<br> Must be a float in the range [0, 1]. | 0.999 |
|`ams_gradient` | Enable `ams_gradient` when optimizer is `adam` or `adamw`.<br> Must be 0 or 1. | 0 |
|`evaluation_frequency`| Frequency to evaluate validation dataset to get metric scores. <br> Must be a positive integer. | 1 |
|`checkpoint_frequency`| Frequency to store model checkpoints. <br> Must be a positive integer. | Checkpoint at epoch with best primary metric on validation.|
|`checkpoint_run_id`| The run ID of the experiment that has a pretrained checkpoint for incremental training.| no default  |
|`layers_to_freeze`| How many layers to freeze for your model. For instance, passing 2 as value for `seresnext` means freezing layer0 and layer1 referring to the below supported model layer info. <br> Must be a positive integer. <br><br> - `'resnet'`: `[('conv1.', 'bn1.'), 'layer1.', 'layer2.', 'layer3.', 'layer4.']` <br> - `'mobilenetv2'`: `['features.0.', 'features.1.', 'features.2.', 'features.3.', 'features.4.', 'features.5.', 'features.6.', 'features.7.', 'features.8.', 'features.9.', 'features.10.', 'features.11.', 'features.12.', 'features.13.', 'features.14.', 'features.15.', 'features.16.', 'features.17.', 'features.18.']` <br> - `'seresnext'`: `['layer0.', 'layer1.', 'layer2.', 'layer3.', 'layer4.']` * `'vit'`: `['patch_embed', 'blocks.0.', 'blocks.1.', 'blocks.2.', 'blocks.3.', 'blocks.4.', 'blocks.5.', 'blocks.6.','blocks.7.', 'blocks.8.', 'blocks.9.', 'blocks.10.', 'blocks.11.']` * `'yolov5_backbone'`: `['model.0.', 'model.1.', 'model.2.', 'model.3.', 'model.4.','model.5.', 'model.6.', 'model.7.', 'model.8.', 'model.9.']` <br> - `'resnet_backbone'`: `['backbone.body.conv1.', 'backbone.body.layer1.', 'backbone.body.layer2.','backbone.body.layer3.', 'backbone.body.layer4.']` | no default  |

## Image classification (multi-class and multi-label) specific hyperparameters

The following table summarizes hyperparmeters for image classification (multi-class and multi-label) tasks.

| Parameter name       | Description           | Default  |
| ------------- |-------------|-----|
| `model_name` | Model name to be used for image classification task at hand. <br> <br> Must be one of `mobilenetv2`, `resnet18`, `resnet34`, `resnet50`, `resnet101`, `resnet152`, `resnest50`, `resnest101`, `seresnext`, `vits16r224`, `vitb16r224`, `vitl16r224`. | `seresnext` |
| `weighted_loss` | - 0 for no weighted loss. <br> - 1 for weighted loss with sqrt.(class_weights) <br> - 2 for weighted loss with class_weights. <br> - Must be 0 or 1 or 2. | 0 |
| `validation_resize_size` | - Image size to which to resize before cropping for validation dataset. <br> - Must be a positive integer. <br> <br> *Notes: <br> - `seresnext` doesn't take an arbitrary size. <br> - Training run may get into CUDA OOM if the size is too big*.  | 256  |
| `validation_crop_size` | - Image crop size that's input to your neural network for validation dataset.  <br> - Must be a positive integer. <br> <br> *Notes: <br> - `seresnext` doesn't take an arbitrary size. <br> - *ViT-variants* should have the same `validation_crop_size` and `training_crop_size`. <br> - Training run may get into CUDA OOM if the size is too big*. | 224 |
| `training_crop_size` | - Image crop size that's input to your neural network for train dataset.  <br> - Must be a positive integer. <br> <br> *Notes: <br> - `seresnext` doesn't take an arbitrary size. <br> - *ViT-variants* should have the same `validation_crop_size` and `training_crop_size`. <br> - Training run may get into CUDA OOM if the size is too big*. | 224 |

## Object detection and instance segmentation task specific hyperparameters

The following hyperparameters are for object detection and instance segmentation tasks.

> [!WARNING]
> These parameters are not supported with the `yolov5` architecture. See the [model specific hyperparameters](#model-specific-hyperparameters) section for `yolov5` supported hyperparmeters.

| Parameter name       | Description           | Default  |
| ------------- |-------------|-----|
| `model_name` | Model name to be used for image classification task at hand. <br> - For object detection task, must be one of `yolov5`, `fasterrcnn_resnet18_fpn`, `fasterrcnn_resnet34_fpn`, `fasterrcnn_resnet50_fpn`, `fasterrcnn_resnet101_fpn`, `fasterrcnn_resnet152_fpn`, `retinanet_resnet50_fpn`. <br> - For instance segmentation task, must be one of `maskrcnn_resnet18_fpn`, `maskrcnn_resnet34_fpn`, `maskrcnn_resnet50_fpn`, `maskrcnn_resnet101_fpn`, `maskrcnn_resnet152_fpn` | - For object detection task, `fasterrcnn_resnet50_fpn` <br> - For instance segmentation task, `maskrcnn_resnet50_fpn` |
| `validation_metric_type` | Metric computation method to use for validation metrics.  <br> Must be `none`, `coco`, `voc`, or `coco_voc`. | `voc` |
| `validation_iou_threshold` | IOU threshold for box matching when computing validation metrics.  <br>Must be a float in the range [0.1, 1]. | 0.5 |
| `min_size` | Minimum size of the image to be rescaled before feeding it to the backbone. <br> Must be a positive integer. <br> <br> *Note: training run may get into CUDA OOM if the size is too big*.| 600 |
| `max_size` | Maximum size of the image to be rescaled before feeding it to the backbone. <br> Must be a positive integer.<br> <br> *Note: training run may get into CUDA OOM if the size is too big*. | 1333 |
| `box_score_threshold` | During inference, only return proposals with a classification score greater than `box_score_threshold`. <br> Must be a float in the range [0, 1].| 0.3 |
| `nms_iou_threshold` | IOU (intersection over union) threshold used in non-maximum suppression (NMS) for the prediction head. Used during inference.  <br>Must be a float in the range [0, 1]. | 0.5 |
| `box_detections_per_image` | Maximum number of detections per image, for all classes. <br> Must be a positive integer.| 100 |
| `tile_grid_size` | The grid size to use for tiling each image. <br>*- `tile_grid_size` must not be None to enable [small object detection](how-to-use-automl-small-object-detect.md) logic.*<br>*- `tile_grid_size` is not supported for instance segmentation tasks.*<br> Should be passed as a string in '3x2' format. Example: --tile_grid_size '3x2' | No Default |
| `tile_overlap_ratio` | Overlap ratio between adjacent tiles in each dimension. <br> Must be float in the range of [0, 1) | 0.25 |
| `tile_predictions_nms_threshold` | The IOU threshold to use to perform NMS while merging predictions from tiles and image. Used in validation/ inference. <br> Must be float in the range of [0, 1] | 0.25 |

## Next steps

* Learn how to [Set up AutoML to train computer vision models with Python](how-to-auto-train-image-models.md).

* [Tutorial: Train an object detection model with AutoML and Python](tutorial-auto-train-image-models.md).

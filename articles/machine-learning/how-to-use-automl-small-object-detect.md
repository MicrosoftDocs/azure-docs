---
title: Use AutoML to detect small objects in images
titleSuffix: Azure Machine Learning
description: Set up Azure Machine Learning automated ML to train small object detection models with the CLI v2 and Python SDK v2.
author: PhaniShekhar
ms.author: phmantri
ms.reviewer: ssalgado
ms.service: machine-learning
ms.subservice: automl
ms.topic: how-to
ms.date: 10/13/2021
ms.custom: sdkv2, event-tier1-build-2022, ignite-2022, devx-track-python
---

# Train a small object detection model with AutoML

[!INCLUDE [dev v2](includes/machine-learning-dev-v2.md)]


In this article, you'll learn how to train an object detection model to detect small objects in high-resolution images with [automated ML](concept-automated-ml.md) in Azure Machine Learning.

Typically, computer vision models for object detection work well for datasets with relatively large objects. However, due to memory and computational constraints, these models tend to under-perform when tasked to detect small objects in high-resolution images. Because high-resolution images are typically large, they are resized before input into the model, which limits their capability to detect smaller objects--relative to the initial image size.

To help with this problem, automated ML supports tiling as part of the computer vision capabilities. The tiling capability in automated ML is based on the concepts in [The Power of Tiling for Small Object Detection](https://openaccess.thecvf.com/content_CVPRW_2019/papers/UAVision/Unel_The_Power_of_Tiling_for_Small_Object_Detection_CVPRW_2019_paper.pdf).

When tiling, each image is divided into a grid of tiles. Adjacent tiles overlap with each other in width and height dimensions. The tiles are cropped from the original as shown in the following image.

:::image type="content" source="./media/how-to-use-automl-small-object-detect/tiles-generation.png" alt-text="Diagram that shows an image being divided into a grid of overlapping tiles.":::

## Prerequisites

* An Azure Machine Learning workspace. To create the workspace, see [Create workspace resources](quickstart-create-resources.md).

* This article assumes some familiarity with how to configure an [automated machine learning experiment for computer vision tasks](how-to-auto-train-image-models.md).

## Supported models

Small object detection using tiling is supported for all models supported by Automated ML for images for object detection task.

## Enable tiling during training

To enable tiling, you can set the `tile_grid_size` parameter to a value like '3x2'; where 3 is the number of tiles along the width dimension and 2 is the number of tiles along the height dimension. When this parameter is set to '3x2', each image is split into a grid of 3 x 2 tiles. Each tile overlaps with the adjacent tiles, so that any objects that fall on the tile border are included completely in one of the tiles. This overlap can be controlled by the `tile_overlap_ratio` parameter, which defaults to 25%.

When tiling is enabled, the entire image and the tiles generated from it are passed through the model. These images and tiles are resized according to the `min_size` and `max_size` parameters before feeding to the model. The computation time increases proportionally because of processing this extra data.

For example, when the `tile_grid_size` parameter is '3x2', the computation time would be approximately seven times higher than without tiling.

You can specify the value for `tile_grid_size` in your training parameters as a string.

# [CLI v2](#tab/CLI-v2)

[!INCLUDE [cli v2](includes/machine-learning-cli-v2.md)]

```yaml
training_parameters:
  tile_grid_size: '3x2'
```

# [Python SDK v2](#tab/SDK-v2)

```python
image_object_detection_job.set_training_parameters(
    tile_grid_size='3x2'
)
```
---

The value for `tile_grid_size` parameter depends on the image dimensions and size of objects within the image. For example, larger number of tiles would be helpful when there are smaller objects in the images.

To choose the optimal value for this parameter for your dataset, you can use hyperparameter search. To do so, you can specify a choice of values for this parameter in your hyperparameter space.

# [CLI v2](#tab/CLI-v2)

[!INCLUDE [cli v2](includes/machine-learning-cli-v2.md)]

```yaml
search_space:
  - model_name:
      type: choice
      values: ['fasterrcnn_resnet50_fpn']
    tile_grid_size:
      type: choice
      values: ['2x1', '3x2', '5x3']
```

# [Python SDK v2](#tab/SDK-v2)

```python
image_object_detection_job.extend_search_space(
    SearchSpace(
        model_name=Choice(['fasterrcnn_resnet50_fpn']),
        tile_grid_size=Choice(['2x1', '3x2', '5x3'])
    )
)
```
---

## Tiling during inference

When a model trained with tiling is deployed, tiling also occurs during inference. Automated ML uses the `tile_grid_size` value from training to generate the tiles during inference. The entire image and corresponding tiles are passed through the model, and the object proposals from them are merged to output final predictions, like in the following image.

:::image type="content" source="./media/how-to-use-automl-small-object-detect/tiles-merge.png" alt-text="Diagram that shows object proposals from image and tiles being merged to form the final predictions.":::

> [!NOTE]
> It's possible that the same object is detected from multiple tiles, duplication detection is done to remove such duplicates.
>
> Duplicate detection is done by running NMS on the proposals from the tiles and the image. When multiple proposals overlap, the one with the highest score is picked and others are discarded as duplicates.Two proposals are considered to be overlapping when the intersection over union (iou) between them is greater than the `tile_predictions_nms_thresh` parameter.

You also have the option to enable tiling only during inference without enabling it in training. To do so, set the `tile_grid_size` parameter only during inference, not for training.

Doing so, may improve performance for some datasets, and won't incur the extra cost that comes with tiling at training time.

## Tiling hyperparameters

The following are the parameters you can use to control the tiling feature.

| Parameter Name    | Description    | Default |
| --------------- |-------------| -------|
| `tile_grid_size` |  The grid size to use for tiling each image. Available for use during training, validation, and inference.<br><br>Should be passed as a string in `'3x2'` format.<br><br> *Note: Setting this parameter increases the computation time proportionally, since all tiles and images are processed by the model.*| no default value |
| `tile_overlap_ratio` | Controls the overlap ratio between adjacent tiles in each dimension. When the objects that fall on the tile boundary are too large to fit completely in one of the tiles, increase the value of this parameter so that the objects fit in at least one of the tiles completely.<br> <br>  Must be a float in [0, 1).| 0.25 |
| `tile_predictions_nms_thresh` | The intersection over union  threshold to use to do non-maximum suppression (nms) while merging predictions from tiles and image. Available during validation and inference. Change this parameter if there are multiple boxes detected per object in the final predictions.  <br><br> Must be float in [0, 1]. | 0.25 |


## Example notebooks

See the [object detection sample notebook](https://github.com/Azure/azureml-examples/tree/main/sdk/python/jobs/automl-standalone-jobs/automl-image-object-detection-task-fridge-items/automl-image-object-detection-task-fridge-items.ipynb) for detailed code examples of setting up and training an object detection model.

>[!NOTE]
> All images in this article are made available in accordance with the permitted use section of the [MIT licensing agreement](https://choosealicense.com/licenses/mit/).
> Copyright &copy; 2020 Roboflow, Inc.

## Next steps

* Learn more about [how and where to deploy a model](./how-to-deploy-online-endpoints.md).
* For definitions and examples of the performance charts and metrics provided for each job, see [Evaluate automated machine learning experiment results](how-to-understand-automated-ml.md).
* [Tutorial: Train an object detection model with AutoML and Python](tutorial-auto-train-image-models.md).
* See [what hyperparameters are available for computer vision tasks](reference-automl-images-hyperparameters.md).
* [Make predictions with ONNX on computer vision models from AutoML](how-to-inference-onnx-automl-image-models.md)

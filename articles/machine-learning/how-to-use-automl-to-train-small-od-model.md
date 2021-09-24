---
title: Set up AutoML for images to train small object detection model
description: Set up Azure Machine Learning automated ML to train computer vision models to perform small object detection.
author: PhaniShekhar
ms.author: phmantri
ms.service: machine-learning
ms.topic: how-to
ms.date: 09/23/2021
ms.custom: template-how-to
---

# Train a small object detection model using Auto ML for Images

In this article, you will learn how to train an object detection model to detect small objects in high resolution images using Azure Machine Learning Automated ML.

## Prerequisites

This article assumes that you already know how to configure an automated ML experiment for Object detection.
For information about configuration, see the following articles:

- TODO: Add links to how to guide for AutoML for Images

## Small Object detection

While CNN based models work well for object detection on datasets with large objects, they do not perform well in detecting small objects in high resolution images. High resolution images cannot be processed by the model in original dimensions due to memory and computational constraints. Hence, images are resized before passing through the model. In addition, images are down-sampled within CNNs. These factors affect the capability of small object detection with such models.

To help with this problem, AutoML for Images exposes the functionality of tiling.

When tiling is enabled, each image is divided into a grid of tiles, that are cropped from the original image as shown in the image below. Adjacent tiles overlap with each other in width and height dimensions.

![Tiles generation](./media/how-to-use-automl-to-train-small-od-model/tiles_generation.jpg)

During training, the generated tiles and the entire image are passed through the model, along with the corresponding ground truth bounding boxes. During validation/inference, the tiles and entire image are passed through the model as well. The object proposals from the entire image and all the tiles are merged to output final predictions as shown in the image below.

![Object proposals merge](./media/how-to-use-automl-to-train-small-od-model/tiles_merge.jpg)

## How to train a small object detection model with AutoML for Images?

### Enable tiling

To enable this feature, you can start by setting the tile_grid_size parameter to a value like (3, 2). When this parameter is set to (3, 2), each image is split into a grid of 3 * 2 tiles, as shown in the above image. Each tile has an overlap of 25% with the adjacent tiles so that any objects which fall on the tile border are included in either one or the other tile.

To use a single value of tile_grid_size in your AutoML for Image runs, you can specify a value for this parameter in your hyperparameter space as shown below. Please note that you need to specify this parameter as a string.

```python
parameter_space = {
	'model_name': choice('fasterrcnn_resnet50_fpn'),
	'tile_grid_size': choice('(3, 2)'),
	...
}
```

The value for tile_grid_size parameter depends on the image dimensions and size of objects within the image. To choose the optimal value for this parameter, you can use hyperparameter search. To do so, you can specify a choice of values for this parameter in your hyperparameter space as shown below.

```python
parameter_space = {
	'model_name': choice('fasterrcnn_resnet50_fpn'),
	'tile_grid_size': choice('(2, 1)', '(3, 2)', '(5, 3)'),
	...
}
```

### Hyperparameters

The following are the parameters you can use to control the tiling feature.

| Parameter Name	| Description	| Default |
| --------------- |-------------| -------|
| tile_grid_size | The grid size to use for tiling each image. Should be a tuple of two integers passed as a string. Example: --tile_grid_size "(3, 2)"| no default value |
| tile_overlap_ratio | Overlap ratio between adjacent tiles in each dimension <br> `Optional, float in [0, 1)` | 0.25 |
| tile_predictions_nms_thresh | The iou threshold to use to perform NMS while merging predictions from tiles and image. Used in validation/inference. <br> `Optional, float in [0, 1]` | 0.25 |

- tile_grid_size
    - The grid size to use for tiling each image.
    - This parameter is used in training, validation and inference phases.

- tile_overlap_ratio
	- This parameter is used to control the overlap ratio between adjacent tiles in width and height dimensions.
	- For your dataset, if you observe that the objects which fall on tile boundary are large enough to not fit completely in either of the tiles, you can change this parameter. In such cases, you can increase the value of this parameter so that the objects fit in at least one of the tiles completely.

- tile_predictions_nms_thresh
	- This parameter is used in validation/inference phase.
	- While merging the object proposals from the tiles and the image, it might be possible that the same object is detected from multiple tiles. So, it is essential to perform duplicate detection to remove the duplicates.
	- Duplicate detection is done by performing NMS (non-maximal suppression) on the proposals from the tiles and the image. When multiple proposals overlap, the one with the highest score is picked and others are discarded as duplicates.
	- Two proposals are considered to be overlapping when the iou (intersection over union) between them is greater than tile_predictions_nms_thresh parameter.

### Supported models

Small object detection using tiling is currently supported for the following models:

- fasterrcnn_resnet50_fpn, fasterrcnn_resnet34_fpn, fasterrcnn_resnet18_fpn, retinanet_resnet50_fpn

## Example notebooks

See the [object detection sample notebook](https://github.com/swatig007/automlForImages/blob/main/ObjectDetection/AutoMLImage_ObjectDetection_SampleNotebook.ipynb) for detailed code examples of setting up and training a small object detection model.

## Next steps
- TODO: Add next steps

---
title: Better accuracy of computer vision & classification models in Azure Machine Learning
description: Learn how to improve the accuracy of your computer vision image classification, object detection, and image similarity models using the Azure Machine Learning Package for Computer Vision. 
services: machine-learning
ms.service: machine-learning
ms.component: core
ms.topic: conceptual
ms.reviewer: jmartens
ms.author: netahw
author: nhaiby
ms.date: 04/23/2018
---

# Improve the accuracy of computer vision models

[!INCLUDE [workbench-deprecated](../../../includes/aml-deprecating-preview-2017.md)] 

With the **Azure Machine Learning Package for Computer Vision**, you can build and deploy image classification, object detection, and image similarity models. Learn more about this package and how to install it.

In this article, you learn how to fine-tune these models to increase their accuracy. 

## Accuracy of image classification models

The Computer Vision Package is shown to give good results for a wide variety of datasets. However, as is true for most machine learning projects, getting the best possible results for a new dataset requires careful parameter tuning, as well as evaluating different design decisions. The following sections provide guidance on how to improve accuracy on a given dataset, that is, what parameters are most promising to optimize first, what values for these parameters one should try, and what pitfalls to avoid.

Generally speaking, training Deep Learning models comes with a trade-off between training time versus model accuracy. The Computer Vision Package has pre-set default parameters (see first row in the table below) which focus on fast training speed while typically producing high accuracy models. This accuracy can often be improved further using, for example,  higher image resolution or deeper models, however at the cost of increasing training time by a factor of 10x or more.

It is recommended that you first work with the default parameters, train a model, inspect the results, correct ground truth annotations as needed, and only then try parameters that slow down training time (see table below suggested parameter values). An understanding of these parameters while technically not necessary is however recommended.


### Best practices and tips

* Data quality: the training and test sets should be of high quality. That is, the images are annotated correctly, ambiguous images removed (for example where it is unclear to a human eye if the image shows a tennis ball or a lemon), and the attributes are mutually exclusive (that is, each image belongs to exactly one attribute).

* Before refining the DNN, an SVM classifier should be trained using a pre-trained and fixed DNN as featurizer. This is supported in Computer Vision Package and does not require long to train since the DNN itself is not modified. Even this simple approach often achieves good accuracies and hence represents a strong baseline. The next step is then to refine the DNN that should give better accuracy.

* If the object-of-interest is small in the image, then Image classification approaches are known to not work well. In such cases, consider using an object detection approach such as Computer Vision Package's Faster R-CNN based on Tensorflow.

* The more training data the better. As a rule-of-thumb, one should have at least 100 examples for each class, that is, 100 images for "dog", 100 images for "cat", etc. Training a model with fewer images is possible but might not produce good results.

* The training images need to reside locally on the machine with the GPU, and be on an SSD drive (not an HDD). Otherwise, latency from image reading can drastically reduce training speed (by even a factor of 100x).


### Parameters to optimize

Finding optimal values for these parameters is important and can often improve accuracy significantly:
* Learning rate (`lr_per_mb`): The arguably most important parameter to get right. If the accuracy on the training set after DNN refinement is above ~5%, then most likely the learning rate is either too high, or the number of training epochs too low. Especially with small datasets, the DNN tends to over-fit on the training data, however in practice this will lead to good models on the test set. We typically use 15 epochs where the initial learning rate is reduced twice; training using more epochs can in some cases improve performance.

* Input resolution (`image_dims`): The default image resolution is 224x224 pixels. Using higher image resolution of, for example, 500x500 pixels or 1000x1000 pixels can significantly improve accuracy but slows down DNN refinement. The Computer Vision Package expects the input resolution to be a tuple of (color-channels, image-width, image-height), for example (3, 224, 224), where the number of color channels has to be set to 3 (the Red-Green-Blue bands).

* Model architecture(`base_model_name`): Try using deeper DNNs such as ResNet-34 or ResNet-50 instead of the default ResNet-18 model. The Resnet-50 model is not only deeper, but its output of the penultimate layer is of size 2048 floats (vs. 512 floats of the ResNet-18 and ResNet-34 models). This increased dimensionality can be especially beneficial when keeping the DNN fixed and instead training an SVM classifier.

* Minibatch size (`mb_size`): High minibatch sizes will lead to faster training time however at the expense of an increased DNN memory consumption. Hence, when selecting deeper models (for example, ResNet-50 versus ResNet-18) and/or higher image resolution (500\*500 pixels versus 224\*224 pixels), one typically has to reduce the minibatch size to avoid out-of-memory errors. When changing the minibatch size, often also the learning rate needs to be adjusted as can be seen in the table below.
* Drop-out rate (`dropout_rate`) and L2-regularizer (`l2_reg_weight`): DNN over-fitting can be reduced by using a dropout rate of 0.5 (default is 0.5 in Computer Vision Package) or more, and by increasing the regularizer weight (default is 0.0005 in Computer Vision Package). Note though that especially with small datasets DNN over-fitting is hard and often impossible to avoid.


### Parameter definitions

- **Learning rate**: step size used during gradient descent learning. If set too low then the model will take many epochs to train, if set too high then the model will not converge to a good solution. Typically a schedule is used where the learning rate is reduced after a certain number of epochs. E.For example the learning rate schedule `[0.05]*7 + [0.005]*7 + [0.0005]` corresponds to using an initial learning rate of 0.05 for the first seven epochs, followed by a 10x reduced learning rate of 0.005 for another seven epochs, and finally fine-tuning the model for a single epoch with a 100x reduced learning rate of 0.0005.

- **Minibatch size**: GPUs can process multiple images in parallel to speed up computation. These parallel processed images are also referred as a minibatch. The higher the minibatch size the faster training will be, however at the expense of an increased DNN memory consumption.

### Recommended parameter values

The table below provides different parameter sets that were shown to produce high accuracy models on a wide variety of image classification tasks. The optimal parameters depend on the specific dataset and on the exact GPU used, hence the table should be seen as a guideline only. After trying these parameters, consider also image resolutions of more than 500x500 pixels, or deeper models such as Resnet-101 or Resnet-152.

The first row in the table corresponds to the default parameters that are set inside Computer Vision Package. All other rows take longer to train (indicated in the first column) however at the benefit of increased accuracy (see the second column for the average accuracy over three internal datasets). For example, the parameters in the last row take 5-15x longer to train, however resulted in increased (averaged) accuracy on three internal test sets from 82.6% to 92.8%.

Deeper models and higher input resolution take up more DNN memory, and hence the minibatch size needs to be reduced with increased model complexity to avoid out-of-memory-errors. As can be seen in the table below, it is beneficial to decrease the learning rate by a factor of two whenever decreasing the minibatch size by the same multiplier. The minibatch size might need to get reduced further on GPUs with smaller amounts of memory.

| Training time (rough estimate) | Example accuracy | Minibatch size (*mb_size*) | Learning rate (*lr_per_mb*) | Image resolution (*image_dims*) | DNN architecture (*base_model_name*) |
|------------- |:-------------:|:-------------:|:-----:|:-----:|:---:|
| 1x (reference) | 82.6% | 32 | [0.05]\*7  + [0.005]\*7  + [0.0005]  | (3, 224, 224) | ResNet18_ImageNet_CNTK |
| 2-5x    | 90.2% | 16 | [0.025]\*7 + [0.0025]\*7 + [0.00025] | (3, 500, 500) | ResNet18_ImageNet_CNTK |
| 2-5x    | 87.5% | 16 | [0.025]\*7 + [0.0025]\*7 + [0.00025] | (3, 224, 224) | ResNet50_ImageNet_CNTK |
| 5-15x        | 92.8% |  8 | [0.01]\*7  + [0.001]\*7  + [0.0001]  | (3, 500, 500) | ResNet50_ImageNet_CNTK |


## Next steps

For information about the Azure Machine Learning Package for Computer Vision:
+ Check out the reference documentation

+ Learn about [other Python packages for Azure Machine Learning](reference-python-package-overview.md)
---
title: Model customization concepts - Image Analysis 4.0
titleSuffix: Azure Cognitive Services
description: Concepts related to the custom model feature of the Image Analysis 4.0 API.
services: cognitive-services
author: PatrickFarley
manager: nitinme

ms.service: cognitive-services
ms.subservice: computer-vision
ms.topic: conceptual
ms.date: 02/06/2023
ms.author: pafarley
---

# Model customization

## Scenario components


## FAQ

### Why does my training takes longer/shorter than my specified budget?

The specified training budget is caliberated **compute time** instead of **wall-clock time**. Some common reasons for the difference are listed below:

#### Longer than specified budget

- UVS experiences a high training traffic, and GPU resources might be tight and your job might stay in queue or be on hold during training
- Training in our backend run into un/expected failures, which results in retrying logic. As the failed runs do not consume your budget, this can lead to longer training time in general

#### Shorter than specified budget

- UVS sometimes trains with multi-GPU depending on your data, which 
- UVS sometimes training mutiple exploration trials on multiple GPUs at the same time
- UVS sometimes uses premier/faster GPU skus to train

Those three speed up training at the cost of using more budget in certain wall-clock time.

### Why does my training fail and what I should do?

Some common failures:

- **Training diverged**: It means the training cannot learn meaningful things from your data. Some common causes are
  - Data is not enough: provide more data should help
  - Data is of bad quality: check if your images are of very low resolution, aspect ratio being very extreme, or annotations are wrong
- **Budget not enough**: it means your specified budget is not enough for the size of your dataset and model kind you are training. Specify more budget please 
- **Dataset corrupt**: Usually this is due to the fact your provided images are not accessible or annotation file is of wrong format. For annotation check, you can check `tutorial.ipynb` for annotation format documentation and run `check_coco_annotations.py` for a quick check
- **Unknown**: It could be our system's issue, please reach out to us for investigation

### Why does the evaluation run fail for my object detection model?

Evaluation API for object detection model is on-going effort.

### Can I controll the hyper-parameters or use my own models in training?

No, UVS model customization service a low-code AutoML training system that takes care of the hyper-param search and base model selection in the backend.

### Can I export my model after training?

Not for now, currently only cloud inference via prediction API is supported (see `tutorial.ipynb` for example). We have the plan of supporting container export for future.

### What are the metrics used for evaluating the models?

`https://github.com/microsoft/vision-evaluation` contains the metrics code we use for model evaluation.

### How many images are required for a reasonble/good/best model quality?

Short answer is the more the better. 

Although Florence models have great few-shot capability, i.e. achieving great model performance under limited data availability, in general more data makes your trained model better and more robust. Moreover, some problem is easy requiring little data (classify an apple against a banana), while some problem is hard requiring more data (detecting 200 kinds of insects in a rain forest.), which makes it hard for us to give a universal recommendation here.

If data labeling budget is under constraints, our recommended workflow is to repeat the following steps:

1. Collect $N$ images per class, where $N$ images per class are quite easy for you to collect, e.g., $N=3$
2. Train a model, and test on your evaluation set
3. If the model performance is
    -  **Good enough** (performance is better than your expectation or performance close to your previous experiment with less data collected): Stop here and use this model.
    - **Not good** (performance is still below your expectation or better than your previous experiment with less data collected at a reasonable margin): Collect $N+\delta$ images, and go back to Step 2.

### How much training budget should I specify

Short answer is to specify the upper limit of budget you are willing to consume. We have an AutoML system in our backend to try out different models/training recipes to find the best model for your problem/data. The more budget given, the higher chance of finding a better model. 

Our AutoML system also stops automatically, if it thinks there is no need to try more, even if there is still remaining budget, i.e., it does not always exhaust your specified budget. You are guanranteed not to be billed over your specified budget as well.

We are adding a budget suggestion API to help you pick the right budget, which will come later.

## Next steps

* [Get started creating and training a custom model](./how-to/model-customization.md)

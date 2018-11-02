---
title: "Quickstart: Create an image classification project with the Custom Vision SDK for Python"
titlesuffix: Azure Cognitive Services
description: Create a project, add tags, upload images, train your project, and make a prediction using the Python SDK.
services: cognitive-services
author: areddish
manager: cgronlun

ms.service: cognitive-services
ms.component: custom-vision
ms.topic: quickstart
ms.date: 11/2/2018
ms.author: areddish
---

# Quickstart: Create an image classification project with the Custom Vision Python SDK

This article provides information and sample code to help you get started using the Custom Vision SDK with Python to build an image classification model. After it's created, you can add tags, upload images, train the project, obtain the project's default prediction endpoint URL, and use the endpoint to programmatically test an image. Use this example as a template for building your own .NET application. If you wish to go through the process of building and using a classification model _without_ code, see the [browser-based guidance](getting-started-build-a-classifier.md) instead.

## Prerequisites

- [Python 2.7+ or 3.5+](https://www.python.org/downloads/)
- [pip](https://pip.pypa.io/en/stable/installing/) tool

## Install the Custom Vision SDK

To install the Custom Vision service SDK for Python, run the following command in PowerShell:

```PowerShell
pip install azure-cognitiveservices-vision-customvision
```

## Get the training and prediction keys

The project needs a valid set of subscription keys in order to interact with the service. To get a set of free trial keys, go to the [Custom Vision website](https://customvision.ai) and sign in with a Microsoft account. Select the __gear icon__ in the upper right. In the __Accounts__ section, see the values in the __Training Key__ and __Prediction Key__ fields. You will need these later. 

![Image of the keys UI](./media/csharp-tutorial/training-prediction-keys.png)

## Get the sample images

This example uses the images from the **Samples/Images** directory of the [Cognitive-CustomVision-Windows](https://github.com/Microsoft/Cognitive-CustomVision-Windows/tree/master/Samples/Images) project on GitHub. Clone or download this repository to your development environment.

## Create the Custom Vision service project

To create a new Custom Vision service project, create new file named *sample.py* and add the following contents. Insert your subscription keys in the appropriate definitions.

```Python
from azure.cognitiveservices.vision.customvision.training import training_api
from azure.cognitiveservices.vision.customvision.training.models import ImageUrlCreateEntry

# Replace with a valid key
training_key = "<your training key>"
prediction_key = "<your prediction key>"

trainer = training_api.TrainingApi(training_key)

# Create a new project
print ("Creating project...")
project = trainer.create_project("My New Project")
```

### Create tags in the project

To create classification tags to your project, add the following code to the end of *sample.py*:

```Python
# Make two tags in the new project
hemlock_tag = trainer.create_tag(project.id, "Hemlock")
cherry_tag = trainer.create_tag(project.id, "Japanese Cherry")
```

### Upload and tag images

To add the sample images to the project, insert the following code after the tag creation. This code uploads each image with its corresponding tag. You will need to enter the base image URL path, based on where you downloaded the Cognitive-CustomVision-Windows project.

> [!IMPORTANT]
>
> Change path to the images based on where you downloaded the Cognitive-CustomVision-Windows project earlier.

```Python
base_image_url = "<path to CustomVision-Windows project>"

print ("Adding images...")
for image_num in range(1,10):
    image_url = base_image_url + "Images/Hemlock/hemlock_{}.jpg".format(image_num)
    trainer.create_images_from_urls(project.id, [ ImageUrlCreateEntry(url=image_url, tag_ids=[ hemlock_tag.id ] ) ])

for image_num in range(1,10):
    image_url = base_image_url + "Images/Japanese Cherry/japanese_cherry_{}.jpg".format(image_num)
    trainer.create_images_from_urls(project.id, [ ImageUrlCreateEntry(url=image_url, tag_ids=[ cherry_tag.id ] ) ])
```

### Train the classifier

This code creates the first iteration in the project and marks it as the default iteration. The default iteration reflects the version of the model that will respond to prediction requests. You should update this each time you retrain the model.

```Python
import time

print ("Training...")
iteration = trainer.train_project(project.id)
while (iteration.status != "Completed"):
    iteration = trainer.get_iteration(project.id, iteration.id)
    print ("Training status: " + iteration.status)
    time.sleep(1)

# The iteration is now trained. Make it the default project endpoint
trainer.update_iteration(project.id, iteration.id, is_default=True)
print ("Done!")
```

## Get and use the default prediction endpoint

To send an image to the prediction endpoint and retrieve the prediction, add the following code to the end of the file:

```python
from azure.cognitiveservices.vision.customvision.prediction import prediction_endpoint
from azure.cognitiveservices.vision.customvision.prediction.prediction_endpoint import models

# Now there is a trained endpoint that can be used to make a prediction

predictor = prediction_endpoint.PredictionEndpoint(prediction_key)

test_img_url = base_image_url + "Images/Test/test_image.jpg"
results = predictor.predict_image_url(project.id, iteration.id, url=test_img_url)

# Display the results.
for prediction in results.predictions:
    print ("\t" + prediction.tag_name + ": {0:.2f}%".format(prediction.probability * 100))
```

## Run the application

Run *sample.py*.

```PowerShell
python sample.py
```

The output of the application should be similar to the following text:

```
Creating project...
Adding images...
Training...
Training status: Training
Training status: Completed
Done!
        Hemlock: 93.53%
        Japanese Cherry: 0.01%
```

You can then verify that the test image (found in **<base_image_url>/Images/Test/**) is tagged appropriately. You can also go back to the [Custom Vision website](https://customvision.ai) and see the current state of your newly created project.

## Clean up resources
If you wish to implement your own image classification project (or try an [object detection](csharp-tutorial-od.md) project instead), you may want to delete the tree identification project from this example. A free trial allows for two Custom Vision projects.

On the [Custom Vision website](https://customvision.ai), navigate to **Projects** and select the trash can under My New Project.

![Screenshot of a panel labelled My New Project with a trash can icon](media/csharp-tutorial/delete_project.png)

## Next steps

Now you have seen how every step of the image classification process can be done in code. This sample executes a single training iteration, but often you will need to train and test your model multiple times in order to make it more accurate.

> [!div class="nextstepaction"]
> [Test and retrain a model](test-your-model.md)
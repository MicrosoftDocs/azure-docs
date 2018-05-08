---
title: Object detection with Python and Custom Vision API - Azure Cognitive Services | Microsoft Docs
description: Explore a basic Windows app that uses the Custom Vision API in Microsoft Cognitive Services. Create a project, add tags, upload images, train your project, and make a prediction using the default endpoint.
services: cognitive-services
author: areddish
manager: chbuehle
ms.service: cognitive-services
ms.component: custom-vision
ms.topic: article
ms.date: 05/03/2018
ms.author: areddish
---

# Use Custom Vision API to build an object detection project with Python

Explore a basic Python script that uses the Computer Vision API to create an object detection project. After it's created, you can add tagged regions, upload images, train the project, obtain the project's default prediction endpoint URL, and use the endpoint to programmatically test an image. Use this open-source example as a template for building your own app by using the Custom Vision API.

## Prerequisites

To use the tutorial, you need to do the following:

- Install either Python 2.7+ or Python 3.5+.
- Install pip.

### Platform requirements
This example has been developed for Python.

### Get the Custom Vision SDK

To build this example, you need to install the Python SDK for the Custom Vision API:

```
pip install azure-cognitiveservices-vision-customvision
```

You can download the images with the [Python Samples](https://github.com/Azure-Samples/cognitive-services-python-sdk-samples).

## Step 1: Prepare the keys and images needed for the example

You can find Custom Vision Service on the [Custom Vision site](https://customvision.ai).

Obtain your training and prediction key by signing in to Custom Vision Service and going to your account settings.

This example uses the images from [this sample](https://github.com/Microsoft/Cognitive-CustomVision-Windows/tree/master/Samples/Images). 


## Step 2: Create a Custom Vision Service project

To create a new Custom Vision Service project, create a sample.py script file and add the following contents. Note the difference between creating an object detection and image classification project is the domain that is specified to the create_project call.

```Python
from azure.cognitiveservices.vision.customvision.training import training_api
from azure.cognitiveservices.vision.customvision.training.models import ImageFileCreateEntry, Region

# Replace with a valid key
training_key = "<your training key>"
prediction_key = "<your prediction key>"

trainer = training_api.TrainingApi(training_key)

# Find the object detection domain
obj_detection_domain = next(domain for domain in trainer.get_domains() if domain.type == "ObjectDetection")

# Create a new project
print ("Creating project...")
project = trainer.create_project("My Detection Project", domain_id=obj_detection_domain.id)
```

## Step 3: Add tags to your project

To add tags to your project, insert the following code to create two tags:

```Python
# Make two tags in the new project
fork_tag = trainer.create_tag(project.id, "fork")
scissors_tag = trainer.create_tag(project.id, "scissors")
```

## Step 4: Upload images to the project

For object detection project you need to upload image, regions, and tags. The region is in normalized coordiantes and specifies the location of the tagged object.

To add the images, region, and tags to the project, insert the following code after the tag creation. Note that for this tutorial the regions are hardcoded inline with the code.

```Python

fork_image_regions = {
    "fork_1": [ 0.219362751, 0.141781077, 0.5919118, 0.6683006],
    "fork_2": [ 0.115196079, 0.341127485, 0.819852948, 0.222222224],
    "fork_3": [ 0.107843138, 0.128709182, 0.727941155, 0.71405226],
    "fork_4": [ 0.148284316, 0.318251669, 0.7879902, 0.3970588],
    "fork_5": [ 0.08210784, 0.07805559, 0.759803951, 0.593137264],
    "fork_6": [ 0.2977941, 0.220212445, 0.5355392, 0.6013072 ],
    "fork_7": [ 0.143382356, 0.346029431, 0.590686262, 0.256535947],
    "fork_8": [ 0.294117659, 0.216944471, 0.49142158, 0.5980392],
    "fork_9": [ 0.240196079, 0.1385131, 0.5955882, 0.643790841],
    "fork_10": [ 0.25, 0.149951011, 0.534313738, 0.642156839 ],
    "fork_11": [ 0.234068632, 0.445702642, 0.6127451, 0.344771236],
    "fork_12": [ 0.180147052, 0.239820287, 0.6887255, 0.235294119],
    "fork_13": [ 0.140931368, 0.480016381, 0.6838235, 0.240196079],
    "fork_14": [ 0.186274514, 0.0633497, 0.579656839, 0.8611111],
    "fork_15": [ 0.243872553, 0.212042511, 0.470588237, 0.6683006],
    "fork_16": [ 0.143382356, 0.218578458, 0.7977941, 0.295751631],
    "fork_17": [ 0.3345588, 0.07315363, 0.375, 0.9150327 ],
    "fork_18": [ 0.05759804, 0.0894935, 0.9007353, 0.3251634 ],
    "fork_19": [ 0.05269608, 0.282303959, 0.8088235, 0.452614367],
    "fork_20": [ 0.18259804, 0.2136765, 0.6335784, 0.643790841] }

scissors_image_regions = {
    "scissors_1": [ 0.169117644, 0.3378595, 0.780637264, 0.393790841],
    "scissors_2": [ 0.145833328, 0.06661768, 0.6838235, 0.8153595],
    "scissors_3": [ 0.3125, 0.09766343, 0.435049027, 0.71405226],
    "scissors_4": [ 0.432598025, 0.177728787, 0.18259804, 0.576797366],
    "scissors_5": [ 0.354166657, 0.210408524, 0.305147052, 0.625817],
    "scissors_6": [ 0.368872553, 0.234918326, 0.3394608, 0.5833333],
    "scissors_7": [ 0.4007353, 0.184264734, 0.2720588, 0.6862745],
    "scissors_8": [ 0.319852948, 0.0339379422, 0.455882341, 0.843137264],
    "scissors_9": [ 0.295343131, 0.259428144, 0.403186262, 0.421568632],
    "scissors_10": [ 0.341911763, 0.0894935, 0.351715684, 0.828431368],
    "scissors_11": [ 0.2720588, 0.131977156, 0.4987745, 0.6911765],
    "scissors_12": [ 0.186274514, 0.14504905, 0.7022059, 0.748366],
    "scissors_13": [ 0.05759804, 0.05027781, 0.75, 0.882352948],
    "scissors_14": [ 0.181372553, 0.112369314, 0.629901946, 0.71405226],
    "scissors_15": [ 0.256127447, 0.190800682, 0.441176474, 0.6862745],
    "scissors_16": [ 0.261029422, 0.153218985, 0.513480365, 0.6388889],
    "scissors_17": [ 0.113970585, 0.2643301, 0.6666667, 0.504901946],
    "scissors_18": [ 0.05514706, 0.159754932, 0.799019635, 0.730392158],
    "scissors_19": [ 0.204656869, 0.120539248, 0.5245098, 0.743464053],
    "scissors_20": [ 0.231617644, 0.08459154, 0.504901946, 0.8480392] }


# Go through the data table above and create the images
print ("Adding images...")
tagged_images_with_regions = []

for file_name in fork_image_regions.keys():
    x,y,w,h = fork_image_regions[file_name]
    regions = [ Region(tag_id=fork_tag.id, left=x,top=y,width=w,height=h) ]

    with open("images/fork/" + file_name, mode="rb") as image_contents:
        tagged_images_with_regions.append(ImageFileCreateEntry(name=file_name, contents=image_contents.read(), regions=regions))

for file_name in scissors_image_regions.keys():
    x,y,w,h = scissors_image_regions[file_name]
    regions = [ Region(tag_id=scissors_tag.id, left=x,top=y,width=w,height=h) ]

    with open("images/scissors/" + file_name, mode="rb") as image_contents:
        tagged_images_with_regions.append(ImageFileCreateEntry(name=file_name, contents=image_contents.read(), regions=regions))


trainer.create_images_from_files(project.id, images=tagged_images_with_regions)
```

## Step 5: Train the project

Now that you've added tags and images to the project, you can train it: 

1. Insert the following code. This creates the first iteration in the project. 
2. Mark this iteration as the default iteration.

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

## Step 6: Get and use the default prediction endpoint

You're now ready to use the model for prediction: 

1. Obtain the endpoint associated with the default iteration. 
2. Send a test image to the project using that endpoint.

```Python
from azure.cognitiveservices.vision.customvision.prediction import prediction_endpoint
from azure.cognitiveservices.vision.customvision.prediction.prediction_endpoint import models

# Now there is a trained endpoint that can be used to make a prediction

predictor = prediction_endpoint.PredictionEndpoint(prediction_key)

# Open the sample image and get back the prediction results.
with open("images/test/test_image.jpg", mode="rb") as test_data:
    results = predictor.predict_image(project.id, test_data, iteration.id)

# Display the results.
for prediction in results.predictions:
    print ("\t" + prediction.tag_name + ": {0:.2f}%".format(prediction.probability * 100), prediction.bounding_box.left, prediction.bounding_box.top, prediction.bounding_box.width, prediction.bounding_box.height)
```

## Step 7: Run the example

Run the solution. The prediction results appear on the console.

```
python sample.py
```

---
title: Run TensorFlow model in Python - Custom Vision Service - Azure Cognitive Services | Microsoft Docs
description: Run TensorFlow model in Python
services: cognitive-services
author: areddish
manager: chbuehle
ms.service: cognitive-services
ms.component: custom-vision
ms.topic: article
ms.date: 05/03/2018
ms.author: areddish
---
 
# Run TensorFlow model in Python

After you have [exported your TensorFlow model](https://docs.microsoft.com/azure/cognitive-services/custom-vision-service/export-your-model) from the Custom Vision Service, this quickstart will show you how to use this model locally to classify images.

## Install required components

### Prerequisites

To use the tutorial, you need to do the following:

- Install either Python 2.7+ or Python 3.5+.
- Install pip.

Also you will need to install the following packages:

```
pip install tensorflow
pip install pillow
pip install numpy
```

## Load your model and tags

The downloaded zip file contains a model.pb and a labels.txt. These files represent the trained model and the classification labels. The first step is to load the model into your project.

```Python
import tensorflow as tf
import os  

graph_def = tf.GraphDef()
labels = []

# Import the TF graph
with tf.gfile.FastGFile(filename, 'rb') as f:
    graph_def.ParseFromString(f.read())
    tf.import_graph_def(graph_def, name='')

# Create a list of labels.
with open(labels_filename, 'rt') as lf:
    for l in lf:
        labels.append(l.strip())
```

## Prepare an image for prediction

There are a few steps for preparing the image so that it's the right shape for prediction. These steps mimic the image manipulation performed during training:

### Open the file and create an image

```Python
# Load from a file
imageFile = "<path to your image file>"
image = Image.open(imageFile)
```

### Deal with images with a dimension >1600

```Python
w,h = image.size

# If the image has either w or h greater than 1600 we resize it down respecting
# aspect ratio such that the largest dimension is 1600
image = resize_down_to_1600_max_dim(image)
```

### Crop the largest center square

```Python
# We next get the largest center square
w,h = image.size
min_dim = min(w,h)
max_square_image = crop_center(image, min_dim, min_dim)
```

### Resize down to 256x256

```Python
# Resize that square down to 256x256
augmented_image = resize_to_256_square(max_square_image)
```


### Crop the center for the specific input size for the model

```Python
# The compact models have a network size of 227x227, the model requires this size.
network_input_size = 227

# Crop the center for the specified network_input_Size
augmented_image = crop_center(augmented_image, network_input_size, network_input_size)

```

### Color space conversion to BGR

```Python
# RGB -> BGR
r,g,b = np.array(augmented_image).T
bgr_image = np.array([b,g,r]).transpose()
```

The steps above use the following helper functions:

```Python
def crop_center(img,cropx,cropy):
    w,h = img.size
    startx = w//2-(cropx//2)
    starty = h//2-(cropy//2)
    return img.crop((startx, starty, startx+cropx, starty+cropy))

def resize_down_to_1600_max_dim(image):
    w,h = image.size
    if (h < 1600 and w < 1600):
        return image

    new_size = (1600 * w // h, 1600) if (h > w) else (1600, 1600 * h // w)
    return image.resize(new_size, Image.BILINEAR)   

def resize_to_256_square(image):    
    w,h = image.size
    return image.resize((256, 256), Image.BILINEAR)  
```

## Predict an image

Once the image is prepared as a tensor we can send it through the model for a prediction:

```Python

# These names are part of the model and cannot be changed.
output_layer = 'loss:0'
input_node = 'Placeholder:0'

with tf.Session() as sess:
    prob_tensor = sess.graph.get_tensor_by_name(output_layer)
    predictions, = sess.run(prob_tensor, {input_node: [bgr_image] })
```

## View the results

The results of running the image tensor through the model will then need to be mapped back to the labels.

```Python
    # Print the highest probability label
    highest_probability_index = np.argmax(predictions)
    print('Classified as: ' + labels[highest_probability_index])
    print()

    # Or you can print out all of the results mapping labels to probabilities.
    label_index = 0
    for p in predictions:
        truncated_probablity = np.float64(round(p,8))
        print (labels[label_index], truncated_probablity)
        label_index += 1
```
## Next steps

You can also wrap the model into a mobile application:
* [Use your exported Tensorflow model in an Android application](https://github.com/Azure-Samples/cognitive-services-android-customvision-sample)
* [Use your exported CoreML model in an Swift iOS application](https://go.microsoft.com/fwlink/?linkid=857726)
* [Use your exported CoreML model in an iOS application with Xamarin](https://github.com/xamarin/ios-samples/tree/master/ios11/CoreMLAzureModel)


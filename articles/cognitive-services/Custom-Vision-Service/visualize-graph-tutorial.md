---
title: "Visualize a deep learning model trained with Custom Vision API"
titlesuffix: Azure Cognitive Services
description: Create a project, add tags, upload images, train your project, visualize a model
services: cognitive-services
author: Alibek Jakupov
manager: 

ms.service: cognitive-services
ms.subservice: custom-vision
ms.topic: tutorial
ms.date: 09/04/2019
ms.author: 
---
# Visualize a deep learning model trained with Custom Vision AP

Azure Custom Vision API offers an awesome possibility to train your own classifier using only several images, due to the transfer learning, that allows us to build upon the features and concept that were learned during the training of the base model. In other words we cut off the final dense layer that is responsible for predicting the class labels of the original base model and replace it by a new dense layer that will predict the class labels of our new task at hand. However, one may be interested in what is happening inside. So let us satisfy our curiosity and have a look on internal structure of your exported model.
This article provides information and sample code to help you visualize a pre-trained model generated with Azure Custom Vision api to get a brief overview of input/output nodes of the model. After it's created, you can navigate your model, analyse all the nodes and input weights. You may use this example as a template for your future projects.

## Prerequisites

- Python 3.6
- Any IDE

## Why visualize your model?

According to the information provided on Custom Vision welcome page (https://www.customvision.ai/) : 
>Easily customize your own state-of-the-art computer vision models for your unique use case. Just upload a few labeled images and let Custom Vision Service do the hard work. With just one click, you can export trained models to be run on device or as Docker containers. 

However, what if we wanted to go beyond the scope of simple usage and dive a little bit deeper, say inspect the model? Fortunately there is a way to do that using TensorBoard. According to the official information (https://www.tensorflow.org/tensorboard/r1/summaries)
>The computations you'll use TensorFlow for - like training a massive deep neural network - can be complex and confusing. To make it easier to understand, debug, and optimize TensorFlow programs, we've included a suite of visualization tools called TensorBoard. You can use TensorBoard to visualize your TensorFlow graph, plot quantitative metrics about the execution of your graph, and show additional data like images that pass through it.
So, the idea is quite simple:
1. Train your image classifier (Important : use Compact model to able to export it to your machine)
2. Generate tensor flow model
3. Use TensorBoard 


### Train image classifier

At this stage there should be no problem. Simply upload your images, tag them and launch the training. Important: before starting your project be sure to make it ‘exportable’, i.e. select compact option.
![alt text](https://static.wixstatic.com/media/749f52_3a10d568cd2343dcbd28ce0836bae0fd~mv2.png/v1/fill/w_469,h_1024,al_c,lg_1,q_90/749f52_3a10d568cd2343dcbd28ce0836bae0fd~mv2.webp)

This will download 2 files on your computer: model.pb which is the trained model itself and labels.txt that is the list of your classes.

### Use TensorBoard 
It’s high time to start coding! Create a python script and add the following code:

```python
# coding: utf-8
import cv2
import os
import tensorflow as tf
import numpy as np
from PIL import Image

def resize_to_227_square(image):
    return cv2.resize(image, (227, 227), interpolation = cv2.INTER_LINEAR)

# graph of operations to upload trained model
graph_def = tf.GraphDef()
# list of classes
labels = []
# N.B. Azure Custom vision allows export trained model in the form of 2 files
# model.pb: a tensor flow graph and labels.txt: a list of classes
# import tensor flow graph, r+b mode is open the binary file in read or write mode
with tf.gfile.FastGFile(name='model.pb', mode='rb') as f:
    graph_def.ParseFromString(f.read())
    tf.import_graph_def(graph_def=graph_def, name='')
# read labels, add to labels array and create a folder for each class
# it refers to the text mode. There is no difference between r and rt or w and wt since text mode is the default.
with open(file='labels.txt', mode='rt') as labels_file:
    for label in labels_file:
        label = label.strip()
        # append to the labels array (trimmed)
        labels.append(label)
# These names are part of the model and cannot be changed.
output_layer = 'loss:0'
input_node = 'Placeholder:0'
# read test image
image = cv2.imread('1.png')
# get the largest center square
#  The compact models have a network size of 227x227, the model requires this size.
augmented_image = resize_to_227_square(image)
predicted_tag = 'Predicted Tag'
with tf.Session() as sess:
    # difine a directory where the FileWriter serialized its data
    writer = tf.summary.FileWriter('log')
    writer.add_graph(sess.graph)
    prob_tensor = sess.graph.get_tensor_by_name(output_layer)
    predictions = sess.run(prob_tensor, {input_node: [augmented_image]})
    # get the highest probability label
    highest_probability_index = np.argmax(predictions)
    predicted_tag = labels[highest_probability_index]
    print(predicted_tag)
    writer.close()
```
What is crucial to understand is the fact that we used File Writer object. Quote from TensorBoard’s page:
>The FileWriter class provides a mechanism to create an event file in a given directory and add summaries and events to it. The class updates the file contents asynchronously. This allows a training program to call methods to add data to the file directly from the training loop, without slowing down training.
>When constructed with a tf.Session parameter, a FileWriter instead forms a compatibility layer over new graph-based summaries (tf.contrib.summary) to facilitate the use of new summary writing with pre-existing code that expects a FileWriter instance.

So we have obtained our graph info using `sess.graph` and serialized it with the help of `FileWriter` and saved it to the newly created ‘log’ directory.  
And here we go, the most important part of our manipulation, graph visualization. If you have installed tensor flow using pip then tensor board is already installed on your machine. If not just run 
```
pip install tensorboard
```
Once you have tensorboard installed go the directory where you have your python script, open command prompt and run the following command:
```
tensorboard --logdir=log
```
where log = name of the log directory.

If everything is alright you will see the following message.
```
TensorBoard 1.11.0 at http://<computer_name>:6006 (Press CTRL+C to quit)
```
Right now you should open your browser and go to localhost:6006

![alt text](https://static.wixstatic.com/media/749f52_1c77f3d50ed04de2bd8a5121d85a7feb~mv2.png/v1/fill/w_937,h_886,al_c,q_90/749f52_1c77f3d50ed04de2bd8a5121d85a7feb~mv2.webp)

Voilà! We have our graph visualized. It’s now up to you to navigate and analyze all the nodes of your model. You can even download your graph to png to share it with your teammates. 

## Next steps

Now you have seen how to visualize your model created with Custom Vision Service. This sample just exports a graph to png but often you may need to analyse it directly via browser to have a better understanding of your deep learning model.

---
title: 'Intro to deep learning and machine learning'
titleSuffix: Azure Machine Learning service
description: Learn how deep learning relates to machine learning and how both concepts relate to artificial intelligence. Learn how how deep learning applies to scenarios such as fraud detection, voice and facial recognition, sentiment analytics, and time series forecasting.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: conceptual
ms.author: lazzeri
author: FrancescaLazzeri
ms.date: 08/07/2019
---

# Introduction to deep learning and machine learning

This article helps you understand the relationship between deep learning and machine learning. You'll learn how the two concepts compare and how they fit into the broader category of artificial intelligence. The article also describes how deep learning can be applied to real-world scenarios such as fraud detection, voice and facial recognition, sentiment analytics, and time series forecasting.

## Deep learning, machine learning, and AI

![Diagram showing that deep learning is a subset of machine learning, which in turn is a subset of AI](./media/concept-deep-learning-vs-machine-learning/ai-vs-machine-learning-vs-deep-learning.png)

Deep learning, machine learning, and AI are related fields of study:

- **Deep learning** is a subset of machine learning that's based on artificial neural networks. Neural networks allow a machine to train itself. The _learning process_ is _deep_ because the structure of artificial neural networks consists of multiple input, output, and hidden layers. Each layer contains units that transform the input data into information that the next layer can use to do a certain predictive task. Thanks to this structure, a machine can learn through its own data processing.

- **Machine learning** is a subset of artificial intelligence that uses techniques (such as deep learning) that enable machines to use experience to improve at tasks. The _learning process_ is based on the following steps:

   1. Feed data into an algorithm by providing it with more information (for example, by performing feature extraction).
   2. Use this data to train a model.
   3. Test and deploy the model.
   4. Consume the deployed model to do an automated predictive task.

- **Artificial intelligence (AI)** is a technique that enables computers to mimic human intelligence. It includes machine learning. 
 
It's important to understand the relationship among AI, machine learning, and deep learning. Machine learning is a way to achieve artificial intelligence. By using machine learning and deep learning techniques, you can build computer systems and applications that do tasks commonly associated with human intelligence. These tasks include visual perception, speech recognition, decision-making, and language translation.

## Deep learning vs. machine learning

Now that you have the overview of machine learning and deep learning, compare the two techniques. In machine learning, the algorithm needs to be told how to make an accurate prediction by consuming more information. By contrast, in deep learning, the algorithm can learn how to make an accurate prediction through its own data processing, thanks to the artificial neural network structure.

The following table compares the two techniques in more detail:

| |All machine learning |Only deep learning|
|---|---|---|
|  **Number of data points** | Can use small data amounts provided by users. | Requires a large amount of training data to make concise conclusions. |
|  **Hardware dependencies** | Can work on low-end machines. It doesn't need a large amount of computational power. | Depends on high-end machines. It inherently does a large number of matrix multiplication operations. A GPU can efficiently optimize these operations. |
|  **Featurization process** | Requires features to be accurately identified and created by users. | Learns high-level features from data and creates new features by itself. |
|  **Learning approach** | Divides tasks into small pieces and then combines received results into one conclusion. | Solves the problem on an end-to-end basis. |
|  **Execution time** | Takes comparatively little time to train, ranging from a few seconds to a few hours. | Takes an unusually long time to train because a deep learning algorithm involves many parameters. |
|  **Output** | The output is usually a numerical value, like a score or a classification. | The output can be text, a score, an element, or a sound. |

## Deep learning use cases

Because of the artificial neural network structure, deep learning excels at identifying patterns in unstructured data such as images, sound, video, and text. For this reason, deep learning is rapidly transforming many industries, including healthcare, energy, finance, and transportation. These industries are rethinking traditional business processes. 

Some of the most common applications for deep learning are described in the following paragraphs.

### Named-entity recognition

One use of deep-learning networks is named-entity recognition, which is a way to extract, from unstructured and unlabeled data, certain types of information. This information could be people, places, companies, or things. The information can then be stored in a structured schema to build a list of addresses or serve as a benchmark for an identity validation engine.

### Object detection

Deep learning has been applied in many object detection use cases. Object detection is actually a two-part process: image classification and then image localization. Image _classification_ determines what the objects in the image are, like a car or a person. Image _localization_ provides the specific location of these objects. 

Object detection is already used in industries such as gaming, retail, tourism, and self-driving cars.

### Image caption generation

Similar to the image recognition task, in image captioning, for a given image, the system must generate a caption that describes the contents of the image. When you can detect and label objects in photographs, the next step is to turn those labels into descriptive, coherent sentences. Generally, image captioning systems use very large convolutional neural networks to detect objects in the photographs and then use a recurrent neural network (RNN) to turn the labels into coherent sentences.

### Machine translation

Machine translation takes words, phrases, or sentences from one language and automatically translates them into another language. Automatic machine translation has been around for a long time, but deep learning achieves impressive results in two specific areas: automatic translation of text (and translation of speech to text) and automatic translation of images. With the proper data transformation, a deep network can understand text, audio, and visual signals. Machine translation can be used to identify snippets of sound in larger audio files and transcribe the spoken word or image as text.

### Text analytics

One important task that deep learning can perform is e-discovery. Companies use text analytics that are based on deep learning to detect insider trading and compliance with government regulations. Hedge funds use text analytics to drill down into massive document repositories to get insights into future investment performance and market sentiment. The use case for text analytics based on deep learning revolves around its ability to parse massive amounts of text data and perform analytics or yield aggregations.

## Artificial neural networks

Artificial neural networks are formed by layers of connected nodes. Deep learning models use neural networks that have a very large number of layers. 

The following sections explore most popular artificial neural network typologies.

### Feedforward neural network

The feedforward neural network is the most basic type of artificial neural network. In this type of network, information travels in only one direction from input layer to output layer. Feedforward neural networks transform an input by putting it through a series of hidden layers. Every layer is made up of a set of neurons, and each layer is fully connected to all neurons in the layer before. The last fully connected layer (the output layer) represents the generated predictions.

### Recurrent neural network

Recurrent neural networks are a more widely used type of artificial neural network. These networks save the output of a layer and feed it back to the input layer to help predict the layer's outcome. Recurrent neural networks have great learning abilities and are widely used for complex tasks such as learning handwriting and recognizing language.

### Convolutional neural networks

A convolutional neural network is a particularly effective type of artificial neural network, and it presents a unique architecture. Layers are organized in three dimensions: width, height, and depth. The neurons in one layer connect not to all the neurons in the next layer, but only to a small region of the layer's neurons. The final output is reduced to a single vector of probability scores, organized along the depth dimension. 

Convolutional neural networks have been used in areas such as image recognition and classification.

## Next steps

The following articles show you how to use deep learning technology in the [Azure Machine Learning service](/azure/machine-learning/service/):

- [Classify handwritten digits by using a TensorFlow model](how-to-train-tensorflow.md)
- [Classify handwritten digits by using a TensorFlow estimator and Keras](how-to-train-keras.md)
- [Classify images by using a Pytorch model](how-to-train-pytorch.md)
- [Classify handwritten digits by using a Chainer model](how-to-train-pytorch.md)

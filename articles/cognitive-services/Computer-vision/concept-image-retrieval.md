---
title: Image Retrieval concepts - Image Analysis 4.0
titleSuffix: Azure Cognitive Services
description: Concepts related to image vectorization using the Image Analysis 4.0 API.
services: cognitive-services
author: PatrickFarley
manager: nitinme

ms.service: cognitive-services
ms.subservice: computer-vision
ms.topic: conceptual
ms.date: 03/06/2023
ms.author: pafarley
---

# Image Retrieval

Image Retrieval is a process of searching a large collection of images to find those that are most similar to a given query image. Image retrieval systems traditionally have used features extracted from the images, such as content labels, tags, image descriptors, to compare images and rank them by similarity. However, vector similarity search is gaining more popularity due to a no. of benefits over traditional keyword based search and is becoming a vital component in popular content search services.

## What’s the difference between Vector search and Keyword based search? 

Keyword search is the most basic and traditional method of information retrieval. In this approach, the search engine looks for the exact match of the keywords or phrases entered by the user in the search query and compares with labels and tags provided for the images. The search engine then returns images that contain those exact keywords as content tags and image labels. Keyword search relies heavily on the user's ability to input relevant and specific search terms. 

Vector search, on the other hand, searches large collections of vectors in high-dimensional space to find vectors that are similar to a given query. Vector search looks for semantic similarities by capturing the context and meaning of the search query. This approach is often more efficient than traditional image retrieval techniques, as it can reduce search space and improve the accuracy of the results 

## Business Applications: 

Image retrieval has a variety of applications in different fields, including: 

- Digital asset management: Image retrieval can be used to manage large collections of digital images, such as in museums, archives, or online galleries. Users can search for images based on visual features and retrieve the images that match their criteria.
- Medical image retrieval: Image retrieval can be used in medical imaging to search for images based on their diagnostic features or disease patterns. This can help doctors or researchers to identify similar cases or track disease progression.
- Security and surveillance: Image retrieval can be used in security and surveillance systems to search for images based on specific features or patterns, such as in, people & object tracking, or threat detection. 
- Forensic image retrieval: Image retrieval can be used in forensic investigations to search for images based on their visual content or metadata, such as in cases of cybercrime.
- E-commerce: Image retrieval can be used in online shopping applications to search for similar products based on their features or descriptions or provide recommendations based on the previous.
- Fashion and design: Image retrieval can be used in fashion and design to search for images based on their visual features, such as color, pattern, or texture. This can help designers or retailers to identify similar products or trends.

## What are Vector Embeddings? 

Vector embeddings are a way of representing content – text or images, as vectors of real numbers in a high-dimensional space. Vector embeddings are often learned from large amounts of textual and visual data using machine learning algorithms, such as neural networks. Each dimension of the vector corresponds to a different feature or attribute of the content, such as its semantic meaning, syntactic role, or context in which it commonly appears. 

> [!NOTE]
> Vector embeddings can only be meaningfully compared if they are from the same model type. 

## How does it work? 

(image tbd)

- Vectorize Images & Text: Image Retrieval APIs (add reference link) - VectorizeImage and VectorizeText, can be used to extract feature vectors out of an image or text respectively. The APIs return a single feature vector representing the entire input.  
- Measure similarity: Vector search systems typically use distance metrics, such as cosine distance or Euclidean distance, to compare vectors and rank them by similarity. Vision studio (link) demo uses cosine distance (link to quick start code) to measure similarity.  
- Retrieve Images: Use the top N vectors similar to the search query and retrieve images corresponding to those vectors from your Photo library to  provide as the final result.

## Next steps

Enable image retrieval for your search service and follow the steps (add quick start link) to generate vector embeddings for text and images.  
* [Call the Analyze Image API](./how-to/image-retrieval.md)

* Creating an Image Retrieval system at scale is challenging and if you’re interested in developing end-to-end image retrieval service with Azure AI for high volume data or have feedback to share, please reach out us at (add email)  

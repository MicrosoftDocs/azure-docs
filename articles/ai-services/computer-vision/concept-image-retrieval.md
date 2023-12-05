---
title: Multi-modal embeddings concepts - Image Analysis 4.0
titleSuffix: Azure AI services
description: Concepts related to image vectorization using the Image Analysis 4.0 API.
#services: cognitive-services
author: PatrickFarley
manager: nitinme

ms.service: azure-ai-vision
ms.topic: conceptual
ms.date: 03/06/2023
ms.author: pafarley
---

# Multi-modal embeddings (version 4.0 preview)

Multi-modal embedding is the process of generating a numerical representation of an image that captures its features and characteristics in a vector format. These vectors encode the content and context of an image in a way that is compatible with text search over the same vector space.

Image retrieval systems have traditionally used features extracted from the images, such as content labels, tags, and image descriptors, to compare images and rank them by similarity. However, vector similarity search is gaining more popularity due to a number of benefits over traditional keyword-based search and is becoming a vital component in popular content search services.

## What's the difference between vector search and keyword-based search? 

Keyword search is the most basic and traditional method of information retrieval. In this approach, the search engine looks for the exact match of the keywords or phrases entered by the user in the search query and compares with labels and tags provided for the images. The search engine then returns images that contain those exact keywords as content tags and image labels. Keyword search relies heavily on the user's ability to input relevant and specific search terms.

Vector search, on the other hand, searches large collections of vectors in high-dimensional space to find vectors that are similar to a given query. Vector search looks for semantic similarities by capturing the context and meaning of the search query. This approach is often more efficient than traditional image retrieval techniques, as it can reduce search space and improve the accuracy of the results.

## Business applications

Multi-modal embedding has a variety of applications in different fields, including: 

- Digital asset management: Multi-modal embedding can be used to manage large collections of digital images, such as in museums, archives, or online galleries. Users can search for images based on visual features and retrieve the images that match their criteria.
- Security and surveillance: Vectorization can be used in security and surveillance systems to search for images based on specific features or patterns, such as in, people & object tracking, or threat detection. 
- Forensic image retrieval: Vectorization can be used in forensic investigations to search for images based on their visual content or metadata, such as in cases of cyber-crime.
- E-commerce: Vectorization can be used in online shopping applications to search for similar products based on their features or descriptions or provide recommendations based on previous purchases.
- Fashion and design: Vectorization can be used in fashion and design to search for images based on their visual features, such as color, pattern, or texture. This can help designers or retailers to identify similar products or trends.

> [!CAUTION]
> Multi-modal embedding is not designed analyze medical images for diagnostic features or disease patterns. Please do not use Multi-modal embedding for medical purposes.

## What are vector embeddings? 

Vector embeddings are a way of representing content&mdash;text or images&mdash;as vectors of real numbers in a high-dimensional space. Vector embeddings are often learned from large amounts of textual and visual data using machine learning algorithms, such as neural networks. Each dimension of the vector corresponds to a different feature or attribute of the content, such as its semantic meaning, syntactic role, or context in which it commonly appears. 

> [!NOTE]
> Vector embeddings can only be meaningfully compared if they are from the same model type.

## How does it work? 

:::image type="content" source="media/image-retrieval.png" alt-text="Diagram of image retrieval process.":::

1. Vectorize Images and Text: the Multi-modal embeddings APIs, **VectorizeImage** and **VectorizeText**, can be used to extract feature vectors out of an image or text respectively. The APIs return a single feature vector representing the entire input.
   > [!NOTE]
   > Multi-modal embedding does not do any biometric processing of human faces. For face detection and identification, see the [Azure AI Face service](./overview-identity.md).

1. Measure similarity: Vector search systems typically use distance metrics, such as cosine distance or Euclidean distance, to compare vectors and rank them by similarity. The [Vision studio](https://portal.vision.cognitive.azure.com/) demo uses [cosine distance](./how-to/image-retrieval.md#calculate-vector-similarity) to measure similarity.  
1. Retrieve Images: Use the top _N_ vectors similar to the search query and retrieve images corresponding to those vectors from your photo library to  provide as the final result.

### Relevance score 

The image and video retrieval services return a field called "relevance." The term "relevance" denotes a measure of similarity score between a query and image or video frame embeddings. The relevance score is comprised of two components:
1. The cosine similarity (that falls in the range of [0,1]) between the query and image or video frame embeddings.
1. A metadata score, which reflects the similarity between the query and the metadata associated with the image or video frame.

> [!IMPORTANT]
> The relevance score is a good measure to rank results such as images or video frames with respect to a single query. However, the relevance score cannot be accurately compared across queries. Therefore, it's not possible to easily map the relevance score to a confidence level. It's also not possible to trivially create a threshold algorithm to eliminate irrelevant results based solely on the relevance score. 

## Next steps

Enable Multi-modal embeddings for your search service and follow the steps to generate vector embeddings for text and images.  
* [Call the Multi-modal embeddings APIs](./how-to/image-retrieval.md)


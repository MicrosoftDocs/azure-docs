---
title: Vector embeddings
description: Vector embeddings overview.
author: wmwxwa
ms.author: wangwilliam
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 07/01/2024
---

# What are vector embeddings?

Vectors, also known as embeddings or vector embeddings, are mathematical representations of data in a high-dimensional space. They represent various types of information — text, images, audio — a format that machine learning models can process. When an AI model receives text input, it first tokenizes the text into tokens. Each token is then converted into its corresponding embedding. The model processes these embeddings through multiple layers, capturing complex patterns and relationships within the text. The output embeddings can then be converted back into tokens if needed, generating readable text.

Each embedding is a vector of floating-point numbers, such that the distance between two embeddings in the vector space is correlated with semantic similarity between two inputs in the original format. For example, if two texts are similar, then their vector representations should also be similar. These high-dimensional representations capture semantic meaning, making it easier to perform tasks like searching, clustering, and classifying.

Here are two examples of texts represented as vectors:

:::image type="content" source="../media/gen-ai/concepts/vector-examples.png" lightbox="../media/gen-ai/concepts/vector-examples.png" alt-text="Screenshot of vector examples.":::
Image source: [OpenAI](https://openai.com/index/introducing-text-and-code-embeddings/)

Each box containing floating-point numbers corresponds to a dimension, and each dimension corresponds to a feature or attribute that may or may not be comprehensible to humans. Large language model text embeddings typically have a few thousand dimensions, while more complex data models may have tens of thousands of dimensions.

Between the two vectors in the above example, some dimensions are similar while other dimensions are different, which are due to the similarities and differences in the meaning of the two phrases.

This image shows the spatial closeness of vectors that are similar, constrasting vectors that are drastically different:

:::image type="content" source="../media/gen-ai/concepts/vector-closeness.png" lightbox="../media/gen-ai/concepts/vector-closeness.png" alt-text="Screenshot of vector closeness.":::
Image source: [OpenAI](https://openai.com/index/introducing-text-and-code-embeddings/)

You can see more examples in this [interactive visualization](https://openai.com/index/introducing-text-and-code-embeddings/#_1Vr7cWWEATucFxVXbW465e) that transforms data into a three-dimensional space.

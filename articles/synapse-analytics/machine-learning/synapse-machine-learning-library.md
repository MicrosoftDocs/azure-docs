---
title: SynapseML and its use in Azure Synapse analytics.
description: Learn about the SynapseML library and how it simplifies the creation of massively scalable machine learning (ML) pipelines in Azure Synapse analytics.
author: SnehaGunda
ms.service: synapse-analytics
ms.topic: conceptual
ms.subservice: machine-learning
ms.date: 08/19/2022
ms.author: sngun
---

# What is SynapseML?

SynapseML (previously known as MMLSpark), is an open-source library that simplifies the creation of massively scalable machine learning (ML) pipelines. It's an ecosystem of tools used to expand the Apache Spark framework in several new directions. SynapseML unifies several existing machine learning frameworks and new Microsoft algorithms into a single, scalable API that is usable across Python, R, Scala, and Java. Using this library, developers can focus on the high-level structure of their data and tasks, and the library takes care of the machine learning implementation details.

SynapseML adds many deep learning and data science tools to the Spark ecosystem, including seamless integration of Spark Machine Learning pipelines with Microsoft Cognitive Toolkit (CNTK), LightGBM and OpenCV. These tools enable powerful and highly scalable predictive and analytical models for various datasources. It also brings new networking capabilities to the Spark Ecosystem. SynapseML requires Scala 2.12, Spark 3.0+, and Python 3.6+.

With SynapseML, you can build scalable and intelligent systems to solve challenges in domains such as Anomaly detection, Computer vision, Deep learning, Text analytics etc. It can train and evaluate models on single-node, multi-node, and elastically resizable clusters of computers, so you can scale your work without wasting resources. In addition to its availability in several different programming languages, the API abstracts over a wide variety of databases, file systems, and cloud data stores to simplify experiments no matter where data is located.

To get started and build machine learning models in different languages, see the [Installation guide.](https://microsoft.github.io/SynapseML/docs/getting_started/installation/)

## Key features of SynapseML

### Simplifies distributed machine learning

SynapseML offers a unified API that simplifies developing fault-tolerant distributed programs. This library unifies different machine learning frameworks into a single API that is scalable, data and language agnostic. It works for batch, streaming, and serving applications.

A unified API standardizes many tools, frameworks, algorithms and streamlines the distributed machine learning experience. It enables developers to quickly compose disparate machine learning frameworks. It's helpful for use cases that require more than one framework, such as web-supervised learning, search engine creation, and many others. It can train and evaluate models on single-node, multi-node, and elastically resizable clusters of computers. You can scale up your work without wasting resources.

The SynapseML API abstracts over a wide variety of databases, file systems, and cloud data stores to simplify experiments no matter where the data is located.

### Enterprise support on Azure Synapse Analytics

SynapseML is generally available on Azure Synapse Analytics with enterprise support. You can now build large-scale machine learning pipelines using Azure Cognitive Services, LightGBM, ONNX, and other [selected SynapseML features](https://techcommunity.microsoft.com/t5/azure-synapse-analytics-blog/streamline-collaboration-and-insights-with-simplified-machine/ba-p/2924707). It even includes templates to quickly prototype distributed machine learning systems, such as visual search engines, predictive maintenance pipelines, document translation, and more.

### Pre-built intelligent models

Many tools in SynapseML don't require a large labeled training dataset. Instead, SynapseML provides simple APIs for pre-built intelligent services, such as Azure Cognitive Services, to quickly solve large-scale AI challenges related to both business and research. SynapseML enables developers to embed over 45 different state-of-the-art ML services directly into their systems and databases. The latest release includes added support for distributed form recognition, conversation transcription, and translation. These ready-to-use algorithms can parse a wide variety of documents, transcribe multi-speaker conversations in real time, and translate text to over 100 different languages.

To make SynapseML's integration with Azure Cognitive Services fast and efficient, several new tools are available within Apache Spark. In particular, SynapseML automatically parses common throttling responses to ensure that jobs don’t overwhelm backend services. Additionally, it uses exponential back-offs to handle unreliable network connections and failed responses. Finally, Spark’s worker machines stay busy with new asynchronous parallelism primitive to Spark. This allows worker machines to send requests while waiting on a response from the server, which can yield a tenfold increase in throughput.

### Broad ecosystem compatibility with ONNX

SynapseML enables developers to use models from many different ML ecosystems through the Open Neural Network Exchange (ONNX) framework. With this integration, you can execute a wide variety of classical and deep learning models at scale with only a few lines of code. This integration between ONNX and Spark automatically handles distributing ONNX models to worker nodes, batching and buffering input data for high throughput, and scheduling work on hardware accelerators.

Bringing ONNX to Spark not only helps developers scale deep learning models, it also enables distributed inference across a wide variety of ML ecosystems. In particular, ONNXMLTools converts models from TensorFlow, scikit-learn, Core ML, LightGBM, XGBoost, H2O, and PyTorch to ONNX for accelerated and distributed inference using SynapseML.

## Building responsible AI systems with SynapseML

After building a model, it’s imperative that researchers and engineers understand its limitations and behavior before deployment. SynapseML helps developers and researchers build responsible AI systems by introducing new tools that reveal why models make certain predictions and how to improve the training dataset to eliminate biases. More specifically, SynapseML includes distributed implementations of Shapley Additive Explanations (SHAP) and Locally Interpretable Model-Agnostic Explanations (LIME) to explain the predictions of vision, text, and tabular models. SynapseML dramatically speeds the process of understanding a user’s trained model by enabling developers to distribute computation across hundreds of machines.

## Next steps

* To learn more about SynapseML, see the [blog post.](https://www.microsoft.com/en-us/research/blog/synapseml-a-simple-multilingual-and-massively-parallel-machine-learning-library/)

* [Install SynapseML and get started with examples.](https://microsoft.github.io/SynapseML/docs/getting_started/installation/)

* [SynapseML GitHub repository.](https://github.com/microsoft/SynapseML)
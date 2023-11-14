---
title: SynapseML and its use in Azure Synapse Analytics.
description: Learn about the SynapseML library and how it simplifies the creation of massively scalable machine learning (ML) pipelines in Azure Synapse Analytics.
author: SnehaGunda
ms.service: synapse-analytics
ms.topic: conceptual
ms.subservice: machine-learning
ms.date: 08/31/2022
ms.author: sngun
---

# What is SynapseML?

SynapseML (previously known as MMLSpark), is an open-source library that simplifies the creation of massively scalable machine learning (ML) pipelines. SynapseML provides simple, composable, and distributed APIs for a wide variety of different machine learning tasks such as text analytics, vision, anomaly detection, and many others. SynapseML is built on the [Apache Spark distributed computing framework](https://spark.apache.org/) and shares the same API as the [SparkML/MLLib library](https://spark.apache.org/mllib/), allowing you to seamlessly embed SynapseML models into existing Apache Spark workflows.

With SynapseML, you can build scalable and intelligent systems to solve challenges in domains such as anomaly detection, computer vision, deep learning, text analytics, and others. SynapseML can train and evaluate models on single-node, multi-node, and elastically resizable clusters of computers. This lets you scale your work without wasting resources. SynapseML is usable across Python, R, Scala, Java, and .NET. Furthermore, its API abstracts over a wide variety of databases, file systems, and cloud data stores to simplify experiments no matter where data is located.

SynapseML requires Scala 2.12, Spark 3.0+, and Python 3.6+.

## Key features of SynapseML

### A unified API for creating, training, and scoring models

SynapseML offers a unified API that simplifies developing fault-tolerant distributed programs. In particular, SynapseML exposes many different machine learning frameworks under a single API that is scalable, data and language agnostic, and works for batch, streaming, and serving applications.

A unified API standardizes many tools, frameworks, algorithms and streamlines the distributed machine learning experience. It enables developers to quickly compose disparate machine learning frameworks, keeps code clean, and enables workflows that require more than one framework. For example, workflows such as web-supervised learning or search-engine creation require multiple services and frameworks. SynapseML shields users from this extra complexity.


### Use pre-built intelligent models

Many tools in SynapseML don't require a large labeled training dataset. Instead, SynapseML provides simple APIs for pre-built intelligent services, such as Azure AI services, to quickly solve large-scale AI challenges related to both business and research. SynapseML enables developers to embed over 50 different state-of-the-art ML services directly into their systems and databases. These ready-to-use algorithms can parse a wide variety of documents, transcribe multi-speaker conversations in real time, and translate text to over 100 different languages. For more examples of how to use pre-built AI to solve tasks quickly, see [the SynapseML "cognitive" examples](https://microsoft.github.io/SynapseML/docs/Get%20Started/Set%20up%20Cognitive%20Services/).

To make SynapseML's integration with Azure AI services fast and efficient SynapseML introduces many optimizations for service-oriented workflows. In particular, SynapseML automatically parses common throttling responses to ensure that jobs don't overwhelm backend services. Additionally, it uses exponential back-offs to handle unreliable network connections and failed responses. Finally, Spark's worker machines stay busy with new asynchronous parallelism primitives for Spark. Asynchronous parallelism allows worker machines to send requests while waiting on a response from the server and can yield a tenfold increase in throughput.

### Broad ecosystem compatibility with ONNX

SynapseML enables developers to use models from many different ML ecosystems through the Open Neural Network Exchange (ONNX) framework. With this integration, you can execute a wide variety of classical and deep learning models at scale with only a few lines of code. SynapseML automatically handles distributing ONNX models to worker nodes, batching and buffering input data for high throughput, and scheduling work on hardware accelerators.

Bringing ONNX to Spark not only helps developers scale deep learning models, it also enables distributed inference across a wide variety of ML ecosystems. In particular, ONNXMLTools converts models from TensorFlow, scikit-learn, Core ML, LightGBM, XGBoost, H2O, and PyTorch to ONNX for accelerated and distributed inference using SynapseML.

### Build responsible AI systems

After building a model, it's imperative that researchers and engineers understand its limitations and behavior before deployment. SynapseML helps developers and researchers build responsible AI systems by introducing new tools that reveal why models make certain predictions and how to improve the training dataset to eliminate biases. SynapseML dramatically speeds the process of understanding a user's trained model by enabling developers to distribute computation across hundreds of machines. More specifically, SynapseML includes distributed implementations of Shapley Additive Explanations (SHAP) and Locally Interpretable Model-Agnostic Explanations (LIME) to explain the predictions of vision, text, and tabular models. It also includes tools such as Individual Conditional Expectation (ICE) and partial dependence analysis to recognized biased datasets.

## Enterprise support on Azure Synapse Analytics

SynapseML is generally available on Azure Synapse Analytics with enterprise support. You can build large-scale machine learning pipelines using Azure AI services, LightGBM, ONNX, and other [selected SynapseML features](https://techcommunity.microsoft.com/t5/azure-synapse-analytics-blog/streamline-collaboration-and-insights-with-simplified-machine/ba-p/2924707). It even includes templates to quickly prototype distributed machine learning systems, such as visual search engines, predictive maintenance pipelines, document translation, and more.

## Next steps

* To learn more about SynapseML, see the [blog post.](https://www.microsoft.com/en-us/research/blog/synapseml-a-simple-multilingual-and-massively-parallel-machine-learning-library/)

* [Install SynapseML and get started with examples.](https://microsoft.github.io/SynapseML/docs/Get%20Started/Install%20SynapseML/)

* [SynapseML GitHub repository.](https://github.com/microsoft/SynapseML)

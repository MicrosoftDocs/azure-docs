---
title: Twitter sentiment classification with Azure Machine Learning (AML) package for text analytics (AMLPTA) and Team Data Science Process (TDSP) | Microsoft Docs
description: Describes use of TDSP (Team Data Science Process) and AMLPTA for sentiment classification
services: machine-learning, team-data-science-process
documentationcenter: ''
author: deguhath
manager: deguhath
editor: cgronlun

ms.assetid: b8fbef77-3e80-4911-8e84-23dbf42c9bee
ms.service: machine-learning
ms.workload: data-services
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 06/20/2018
ms.author: deguhath
---
# Twitter sentiment classification with Azure Machine Learning (AML) package for text analytics (AMLPTA) and Team Data Science Process (TDSP)

## Introduction
Standardization of the structure and documentation of data science projects, that is anchored to an established [data science lifecycle](https://github.com/Azure/Microsoft-TDSP/blob/master/Docs/lifecycle-detail.md), is key to facilitating effective collaboration in data science teams.

We had previously released a [GitHub repository for the TDSP project structure and templates](https://github.com/Azure/Azure-TDSP-ProjectTemplate). We have now enabled creation of Azure Machine Learning projects that are instantiated with [TDSP structure and documentation templates for Azure Machine Learning](https://github.com/amlsamples/tdsp). Instructions on how to use TDSP structure and templates in Azure Machine Learning is provided [here](https://docs.microsoft.com/azure/machine-learning/preview/how-to-use-tdsp-in-azure-ml). 

In this sample, we are going to demonstrate the usage Azure Machine Learning Package for Text Analytics and TDSP to develop and deploy predictive models for Twitter sentiment classification.


## Use case
### Twitter sentiment polarity sample
This article uses a sample to show you how to instantiate and execute a Machine Learning project. The sample uses the TDSP structure and templates in Azure Machine Learning Workbench. The complete sample is provided in this walkthrough. The modeling task predicts sentiment polarity (positive or negative) by using the text from tweets. This article outlines the data-modeling tasks that are described in the walkthrough. The walkthrough covers the following tasks:

1. Data exploration, training, and deployment of a machine learning model that address the prediction problem that's described in the use case overview. Twitter sentiment data is used for these tasks.
2. Execution of the project by using the TDSP template from Azure Machine Learning for this project. For project execution and reporting, the TDSP lifecycle is used.
3. Operationalization of the solution directly from Azure Machine Learning in Azure Container Service.

The project highlights the use of Text Analytics Package for Azure Machine Learning.


## Link to GitHub repository
Link to the GitHub repository is [here](https://github.com/Azure/MachineLearningSamples-AMLTextPackage-TwitterSentimentPrediction). 

### Purpose
The primary purpose of this sample is to show how to instantiate and execute a machine learning project using the Team Data Science Process (TDSP) structure and templates in Azure Machine Learning Work Bench. For this purpose, we use [Twitter Sentiment data](http://cs.stanford.edu/people/alecmgo/trainingandtestdata.zip). The modeling task is to predict sentiment polarity (positive or negative) using the text from tweets.

### Scope
- Data exploration, training, and deployment of a machine learning model which address the prediction problem described in the Use Case Overview.
- Execution of the project in Azure Machine Learning using the Team Data Science Process (TDSP) template from Azure Machine Learning for this project. For project execution and reporting, we're going to use the TDSP lifecycle.
- Operationalization of the solution directly from Azure Machine Learning in Azure Container Services.

The project highlights several features of Azure Machine Learning, such TDSP structure instantiation and use, execution of code in Azure Machine Learning Work Bench, and easy operationalization in Azure Container Services using Docker and Kubernetes.

## Team Data Science Process (TDS)
We use the TDSP project structure and documentation templates to execute this sample. It follows the [TDSP lifecycle](https://docs.microsoft.com/azure/machine-learning/team-data-science-process/lifecycle). The project is created based on the instructions provided [here](https://github.com/amlsamples/tdsp/blob/master/docs/how-to-use-tdsp-in-azure-ml.md).


<img src="./media/predict-twitter-sentiment-amltextpackage/tdsp-lifecycle2.png" alt="tdsp-lifecycle" width="800" height="600">


## Use case overview
The task is to predict each twitter's sentiment binary polarity using word embeddings features extracted from twitter text. For detailed description, please refer to this [repository](https://github.com/Azure/MachineLearningSamples-AMLTextPackage-TwitterSentimentPrediction).

### [Data acquisition and understanding](https://github.com/Azure/MachineLearningSamples-AMLTextPackage-TwitterSentimentPrediction/tree/master/code/01_data_acquisition_and_understanding)
The first step in this sample is to download the sentiment140 dataset and divide it into train and test datasets. Sentiment140 dataset contains the actual content of the tweet (with emoticons removed) along with the polarity of each of the tweet (negative=0, positive=4) as well, with neutral tweets removed. The resulting training data has 1.3 million rows and testing data has 320k rows.

### [Modeling](https://github.com/Azure/MachineLearningSamples-AMLTextPackage-TwitterSentimentPrediction/tree/master/code/02_modeling)
This part of the sample is further divided into three subparts: 
- **Feature Engineering** corresponds to the generation of features using different word embedding algorithm, namely Word2Vec. 
- **Model Creation** deals with the training of different models like _logistic regression_ and _gradient boosting_ to predict sentiment of the input text. 
- **Model Evaluation** applies the trained model over the testing data.

#### Feature engineering
We use <b>Word2Vec</b> to generate word embeddings. First we use the Word2Vec algorithm in the Skipgram mode as explained in the paper [Mikolov, Tomas, et al. Distributed representations of words and phrases and their compositionality. Advances in neural information processing systems. 2013.](https://arxiv.org/abs/1310.4546) to generate word embeddings.

Skip-gram is a shallow neural network taking the target word encoded as a one hot vector as input and using it to predict nearby words. If V is the size of the vocabulary, then the size of the output layer would be __C*V__ where C is the size of the context window. The skip-gram based architecture is shown in the following figure.
 
<table class="image" align="center">
<caption align="bottom">Skip-gram model</caption>
<tr><td><img src="https://s3-ap-south-1.amazonaws.com/av-blog-media/wp-content/uploads/2017/06/05000515/Capture2-276x300.png" alt="Skip-gram model"/></td></tr>
</table>

The details of the Word2Vec algorithm and skip-gram model are beyond the scope of this sample and the interested readers are requested to go through the following links for more details. The code 02_A_Word2Vec.py referenced [tensorflow examples](https://github.com/tensorflow/tensorflow/blob/master/tensorflow/examples/tutorials/word2vec/word2vec_basic.py)

* [Vector Representation of Words](https://www.tensorflow.org/tutorials/word2vec)
* [How exactly does word2vec work?](http://www.1-4-5.net/~dmm/ml/how_does_word2vec_work.pdf)
* [Notes on Noise Contrastive Estimation and Negative Sampling](http://demo.clab.cs.cmu.edu/cdyer/nce_notes.pdf)

After the training process is done, two embedding files in the format of TSV are generated for the modeling stage.

#### Model training
Once the word vectors have been generated using either of the SSWE or Word2vec algorithm, the next step is to train the classification models to predict actual sentiment polarity. We apply the two types of features: Word2Vec and SSWE into two models: Logistic regression and Convolutional Neural Networks (CNN). 

#### Model evaluation
We provide code on how to load and evaluate multiple trained models on test data set.


### [Deployment](https://github.com/Azure/MachineLearningSamples-AMLTextPackage-TwitterSentimentPrediction/tree/master/code/03_deployment)
This part we provide pointers to instructions on how to operationalize a pre-trained sentiment prediction model to a web service on a cluster in the Azure Container Service (AKS). The operationalization environment provisions Docker and Kubernetes in the cluster to manage the web-service deployment. You can find further information on the operationalization process [here](https://docs.microsoft.com/azure/machine-learning/preview/model-management-service-deploy).

## Conclusion
We went through the details on how to train a word embedding model using Word2Vec and then use the extracted embeddings as features to train two different models to predict the sentiment score of Twitter text data. One of these models is deployed in Azure Container Services (AKS). 

## Next steps
Read further documentation on [Azure Machine Learning Package for Text Analytics (AMLPTA)](https://docs.microsoft.com/python/api/overview/azure-machine-learning/textanalytics?view=azure-ml-py-latest) and [Team Data Science Process (TDSP)](https://aka.ms/tdsp) to get started.

## References
* [Team Data Science Process](https://docs.microsoft.com/azure/machine-learning/team-data-science-process/overview) 
* [How to use Team Data Science Process (TDSP) in Azure Machine Learning](https://aka.ms/how-to-use-tdsp-in-aml)
* [TDSP project template for Azure Machine Learning](https://aka.ms/tdspamlgithubrepo)
* [Azure ML Work Bench](https://docs.microsoft.com/azure/machine-learning/preview/)
* [Mikolov, Tomas, et al. Distributed representations of words and phrases and their compositionality. Advances in neural information processing systems. 2013.](https://arxiv.org/abs/1310.4546)

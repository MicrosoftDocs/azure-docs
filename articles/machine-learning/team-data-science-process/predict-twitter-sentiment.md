---
title: Predict Twitter sentiment with word embeddings using the Team Data Science Process - Azure | Microsoft Docs
description: The steps needed to execute your data-science projects
services: machine-learning
documentationcenter: ''
author: bradsev
manager: cgronlun
editor: cgronlun

ms.assetid: 
ms.service: machine-learning
ms.workload: data-services
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 12/15/2017
ms.author: bradsev;

---

# Predict Twitter sentiment with word embeddings using the Team Data Science Process

This article shows how to collaborate effectively when using the **Word2Vec** word embedding algorithm and the **Sentiment Specific Word Embedding (SSWE) Algorithm** to predict Twitter sentiment with the [Azure Machine Learning](../preview/index.yml). For additional details on the task of predicting twitter sentiment polarity, see [repository](https://github.com/Azure/MachineLearningSamples-TwitterSentimentPrediction). The key to facilitating effective team collaboration on data science projects is to standardize the structure and documentation of the projects with an established data science lifecycle. The [Team Data Science Process (TDSP)](overview.md) provides just such a structured [lifecycle](lifecycle.md). 

Creating data science projects with the **TDSP template** provides this standardized framework for Azure Machine Learning projects. Previously, the TDSP team had released a [GitHub repository for the TDSP project structure and templates](https://github.com/Azure/Azure-TDSP-ProjectTemplate). Now the creation of Azure Machine Learning projects that are instantiated with [TDSP structure and documentation templates for Azure Machine Learning](https://github.com/amlsamples/tdsp) has been enabled. For instructions on how to use TDSP structure and templates in Azure Machine Learning, see [Structure projects with the Team Data Science Process template](../preview/how-to-use-tdsp-in-azure-ml.md). 


## The sentiment polarity sample

A sample that shows you how to instantiate and execute a machine learning project using the Team Data Science Process structure and templates in the Azure Machine Learning Work Bench has been provided in this [walkthrough](https://github.com/Azure/MachineLearningSamples-TwitterSentimentPrediction/blob/master/docs/deliverable_docs/Step_By_Step_Tutorial.md). The modeling task is to predict sentiment polarity (positive or negative) using the text from tweets. This article outline the data modeling tasks covered in the walkthrough. The walkthrough covers the following tasks:

- Data exploration, training, and deployment of a machine learning model which address the prediction problem described in the Use Case Overview. For this purpose, [Twitter Sentiment data](http://cs.stanford.edu/people/alecmgo/trainingandtestdata.zip) is used.
- Execution of the project in Azure Machine Learning using the Team Data Science Process (TDSP) template from Azure Machine Learning for this project. For project execution and reporting, the TDSP lifecycle is used.
- Operationalization of the solution directly from Azure Machine Learning in Azure Container Services.

The project highlights several features of Azure Machine Learning, such TDSP structure instantiation and use, execution of code in Azure Machine Learning Work Bench, and easy operationalization in Azure Container Services using Docker and Kubernetes.

## Team Data Science Process
You use the TDSP project structure and documentation templates to execute this sample. It follows the [TDSP lifecycle]((https://github.com/Azure/Microsoft-TDSP/blob/master/Docs/lifecycle-detail.md)). The project is created based on the instructions provided [here](https://github.com/amlsamples/tdsp/blob/master/docs/how-to-use-tdsp-in-azure-ml.md).

![TDSP lifecycle](./media/predict-twitter-sentiment/tdsp-lifecycle.PNG)

![Instantiate TDSP](./media/predict-twitter-sentiment/tdsp-instantiation.PNG) 


## [Data acquisition and understanding](https://github.com/Azure/MachineLearningSamples-TwitterSentimentPrediction/tree/master/code/01_data_acquisition_and_understanding)
The first step in this sample is to download the sentiment140 dataset and divide it into training and testing datasets. The sentiment140 dataset contains the actual content of the tweet (with emoticons removed) along with the polarity of each of the tweet (negative=0, positive=4), with neutral tweets removed. When divided, the resulting training data has 1.3 million rows and testing data has 320k rows.


## [Modeling](https://github.com/Azure/MachineLearningSamples-TwitterSentimentPrediction/tree/master/code/02_modeling)

This part of the sample is further divided into three parts:
 
- **Feature Engineering** corresponds to the generation of features using different word embedding algorithms. 
- **Model Creation** deals with the training of different models like _logistic regression_ and _gradient boosting_ to predict sentiment of the input text. 
- **Model Evaluation** applies the trained model over the testing data.


### [Feature Engineering](https://github.com/Azure/MachineLearningSamples-TwitterSentimentPrediction/tree/master/code/02_modeling/01_FeatureEngineering)

Word2Vec and SSWE are the word embedding algorithms used here to generate word embeddings. 


#### Word2Vec

The Word2Vec algorithm is used in the Skipgram mode. This way of generating word embeddings is explained in the paper by Tomas Mikolov et al.: [Distributed Representations of Words and Phrases and their Compositionality. Advances in neural information processing systems. 2013.](https://arxiv.org/abs/1310.4546).

Skip-gram is a shallow neural network. Its input is the target word encoded as a one hot vector, which is uses to predict nearby words. If **V** is the size of the vocabulary, then the size of the output layer would be __C*V__ where C is the size of the context window. The skip-gram based architecture is shown in the following figure:

![Skip-gram Model](./media/predict-twitter-sentiment/skip-gram-model.PNG)

***Skip-gram model***

The detailed mechanics of the word2vec algorithm and skip-gram model are beyond the scope of this sample. Readers are interested in more details about its workings can consult the following references:

- [The code 02_A_Word2Vec.py referenced TensorFlow examples](https://github.com/tensorflow/tensorflow/blob/master/tensorflow/examples/tutorials/word2vec/word2vec_basic.py)
- [Vector Representation of Words](https://www.tensorflow.org/tutorials/word2vec)
- [How exactly does word2vec work?](http://www.1-4-5.net/~dmm/ml/how_does_word2vec_work.pdf)
- [Notes on Noise Contrastive Estimation and Negative Sampling](http://demo.clab.cs.cmu.edu/cdyer/nce_notes.pdf)


#### SSWE
The **Sentiment Specific Word Embedding (SSWE) Algorithm** tries to overcome a weakness of Word2vec algorithm that the words with similar contexts and opposite polarity can have similar word vectors. This similarity means that Word2vec may not perform accurately for the tasks like sentiment analysis. The SSWE algorithm tries to handle this weakness by incorporating both the sentence polarity and the word's context into its loss function.

This sample uses a variant of SSWE. The SSWE uses both the original ngram and corrupted ngram as input and it uses a ranking style hinge loss function for both the syntactic loss and the semantic loss. Ultimate loss function is the weighted combination of both the syntactic loss and semantic loss. For the purpose of simplicity, only the semantic cross entropy is used as the loss function. As you see later on, even with this simpler loss function the performance of the SSWE embedding is better than the Word2Vec embedding.

The SSWE inspired neural network model that you use in this sample is shown in the following figure:

![ROC Model Comparison](./media/predict-twitter-sentiment/embedding-model-2.PNG)

***Convolutional model to generate sentiment-specific word embedding.***


After the training process is done, two embedding files in the TSV format are generated for the modeling stage.

For more information about the SSWE algorithms, see the paper by Duyu Tang et al.: [Learning Sentiment-Specific Word Embedding for Twitter Sentiment Classification. ACL (1). 2014.](http://www.aclweb.org/anthology/P14-1146) 


### [Model Creation](https://github.com/Azure/MachineLearningSamples-TwitterSentimentPrediction/tree/master/code/02_modeling/02_ModelCreation)
Once the word vectors have been generated using either of the SSWE or Word2vec algorithms, the next step is to train the classification models to predict actual sentiment polarity. Two types of features, Word2Vec and SSWE, are being applied to two models, the GBM model and Logistic regression model. So  four different models are being trained.


### [Model Evaluation](https://github.com/Azure/MachineLearningSamples-TwitterSentimentPrediction/tree/master/code/02_modeling/03_ModelEvaluation)
Now you use the four models trained in previous step in testing data to evaluate the model's performance. 

1. Gradient Boosting over SSWE embedding
2. Logistic Regression over SSWE embedding
3. Gradient Boosting over Word2Vec embedding
4. Logistic Regression over Word2Vec embedding

![ROC Model Comparison](./media/predict-twitter-sentiment/roc-model-comparison.PNG)

The GBM model with SSWE features is the best one using the AUC metric.


## [Deployment](https://github.com/Azure/MachineLearningSamples-TwitterSentimentPrediction/tree/master/code/03_deployment)

This part deploys the trained sentiment prediction model (SSWE embedding + GBM model) to a web service on a cluster in the Azure Container Service (ACS). The operationalization environment provisions Docker and Kubernetes in the cluster to manage the web-service deployment. You can find further information on the operationalization process [here](https://docs.microsoft.com/en-us/azure/machine-learning/preview/model-management-service-deploy).

![kubenetes_dashboard](./media/predict-twitter-sentiment/kubernetes-dashboard.PNG)


## Conclusion

The details on how to train a word-embedding model using the Word2Vec and SSWE algorithms were explained and the extracted embeddings were used as features to train several models to predict sentiment scores for Twitter text data. The Sentiment Specific Wording Embeddings(SSWE) feature with Gradient Boosted Tree model gave the best performance. This model was then deployed as a real-time web service in Azure Container Services using Azure Machine Learning Work Bench.


## References

* [Team Data Science Process](https://docs.microsoft.com/en-us/azure/machine-learning/team-data-science-process/overview) 
* [How to use Team Data Science Process (TDSP) in Azure Machine Learning](https://aka.ms/how-to-use-tdsp-in-aml)
* [TDSP project template for Azure Machine Learning](https://aka.ms/tdspamlgithubrepo)
* [Azure ML Work Bench](https://docs.microsoft.com/en-us/azure/machine-learning/preview/)
* [US Income data-set from UCI ML repository](https://archive.ics.uci.edu/ml/datasets/adult)
* [Biomedical Entity Recognition using TDSP Template](https://docs.microsoft.com/en-us/azure/machine-learning/preview/scenario-tdsp-biomedical-recognition)
* [Mikolov, Tomas, et al. Distributed representations of words and phrases and their compositionality. Advances in neural information processing systems. 2013.](https://arxiv.org/abs/1310.4546)
* [Tang, Duyu, et al. "Learning Sentiment-Specific Word Embedding for Twitter Sentiment Classification." ACL (1). 2014.](http://www.aclweb.org/anthology/P14-1146)
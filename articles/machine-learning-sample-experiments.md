<properties title="Azure Machine Learning Sample Experiments" pageTitle="Machine Learning Sample Experiments | Azure" description="Sample experiments included with Azure Machine Learning Studio." metaKeywords="" services="machine-learning" solutions="" documentationCenter="" authors="garye" manager="paulettm" editor="cgronlun"  videoId="" scriptId="" />

<tags ms.service="machine-learning" ms.workload="data-services" ms.tgt_pltfrm="na" ms.devlang="na" ms.topic="article" ms.date="10/23/2014" ms.author="garye" />


# Machine Learning Sample Experiments

[top]: #machine-learning-sample-experiments

When you create a new workspace in Azure Machine Learning, a number of sample experiments and datasets are included by default.
Many of the sample experimen are associated with sample models in the [Azure Machine Learning Model Gallery](http://azure.microsoft.com/en-us/documentation/services/machine-learning/models/), and others are included as examples of typical models used in machine learning. 

You can find all of these sample experiments in the **Samples** tab of the **Experiments** page in ML Studio.
To make a copy of an experiment that you can edit, open the experiment in ML Studio and click **Save As**.

For a list of all the sample datasets available in ML Studio, see [Machine Learning Sample Datasets][sample-datasets].

[sample-datasets]: ../machine-learning-sample-datasets/


- [Experiments associated with sample models]
- [Miscellaneous sample experiments]

[Experiments associated with sample models]: #experiments-associated-with-sample-models
[Miscellaneous sample experiments]: #miscellaneous-sample-experiments

## Experiments associated with sample models

The following experiments are associated with sample models in the [Azure Machine Learning Model Gallery](http://azure.microsoft.com/en-us/documentation/services/machine-learning/models/).
For more information about an experiment and its associated datasets, see the model details.


| Experiment name | Associated model | Associated datasets |
|:--------------- |:---------------- |:------------------- |
| **Sample Experiment - Color Based Image Compression using K-Means Clustering - Development** | [Color quantization using K-Means clustering](http://azure.microsoft.com/en-us/documentation/articles/machine-learning-sample-color-quantization-using-k-means-clustering/) | Bil Gates RGB Image |
| **Sample Experiments - CRM - Development** | [CRM task](http://azure.microsoft.com/en-us/documentation/articles/machine-learning-sample-crm-task/) | CRM Dataset Shared <p> CRM Appetency Labels Shared <p> CRM Churn Labels Shared <p> CRM Upselling Labels Shared |
| **Sample Experiment - Demand Forecasting of Bikes** | [Prediction of the number of bike rentals](http://azure.microsoft.com/en-us/documentation/articles/machine-learning-sample-prediction-of-number-of-bike-rentals/) | Bike Rental UCI dataset |
| **Sample Experiment - Flight Delay Prediction - Development** | [Flight delay prediction](http://azure.microsoft.com/en-us/documentation/articles/machine-learning-sample-flight-delay-prediction/) | Airport Codes Dataset <p> Flight Delays Data <p> Weather Dataset |
| **Sample Experiment - German Credit - Development** | [Credit risk prediction](http://azure.microsoft.com/en-us/documentation/articles/machine-learning-sample-credit-risk-prediction/) | German Credit Card UCI dataset |
| **Sample Experiment - Network Intrusion Detection - Development** | [Network intrusion detection](http://azure.microsoft.com/en-us/documentation/articles/machine-learning-sample-network-intrusion-detection/) | network_intrusion_detection.csv |
| **Sample Experiment - S & P 500 Company Clustering - Development** | [Finding similar companies](http://azure.microsoft.com/en-us/documentation/articles/machine-learning-sample-finding-similar-companies/) | Wikipedia SP 500 Dataset |
| **Sample Experiment - Sentiment Classification - Development** | [Sentiment analysis](http://azure.microsoft.com/en-us/documentation/articles/machine-learning-sample-sentiment-analysis/) | Book Reviews from Amazon |
| **Sample Experiment - Student Performance - Development** | [Prediction of student performance](http://azure.microsoft.com/en-us/documentation/articles/machine-learning-sample-prediction-of-student-performance/) | student_performance.txt |



## Miscellaneous sample experiments

The following additional sample experiments are examples of common machine learning models.
For more information about the dataset associated with an experiment, see [Machine Learning Sample Datasets][sample-datasets].

###Sample 1: Download dataset from UCI: Adult 2 class dataset
This is a simple experiment that reads .csv data from a website (the [University of California Irvine’s Machine Learning Repository](http://archive.ics.uci.edu/ml/machine-learning-databases/adult/adult.data)) and uses the Descriptive Statistics module to examine the result. The data is the Adult dataset (U.S. Census data) that will be used in other sample experiments for classification problems. 

Dataset used: 

- **[http://archive.ics.uci.edu/ml/machine-learning-databases/adult/adult.data](http://archive.ics.uci.edu/ml/machine-learning-databases/adult/adult.data)**
 
###Sample 2: Dataset Processing and Analysis: Auto Imports Regression Dataset 
In this sample, the Auto Imports dataset is read from a website, then cleaned. The data, straight from the web, contains no column headers and a number of entries are missing. Since no header information was provided with the data file, columns have the default names Col0, Col1, etc. The first task is to use the **Metadata Editor** module to give meaningful names to some of the important columns. Next the experiment splits into three branches to demonstrate the application of three different methods for handling missing data: simple replacement, replace with mode, and replace with mean. **Descriptive Statistics** are produced for each branch. Finally, the **Linear Correlation** module is used to compute correlations between features, both to detect redundancy between features and compute predictive power in features that are correlated with price. The data is used in other sample experiments to illustrate regression models. 

Dataset used: 

- **[http://archive.ics.uci.edu/ml/machine-learning-databases/autos/imports-85.data](http://archive.ics.uci.edu/ml/machine-learning-databases/autos/imports-85.data)**

###Sample 3: Cross Validation for Binary Classification: Adult Dataset
This sample experiment trains a binary classifier using cross validation on the Adult dataset, predicting whether an individual’s income is greater or less than $50,000. After cleaning up missing entries in the dataset, the experiment splits into four branches. A different algorithm is used to train a classifier along each branch using the **Cross Validate Model** module. Cross validation is a technique for reducing bias due to use of a single training set. Instead of simply splitting the dataset into training and test sets, cross validation partitions the entire dataset and cyclically holds out one of the resulting subsets for testing while training on the remaining subsets. The Evaluation results by fold output reports error measurements for each iteration. This information reveals the sensitivity of the model to the training set, and it provides you with a better indication of the model’s ability to generalize to new data. Sample experiment 4 is very similar, but addresses regression instead of classification. 

Dataset used: 

- **Adult Census Income Binary Classification dataset**

###Sample 4: Cross Validation for Regression: Auto Imports Dataset
This sample experiment trains a regression model using cross validation on the Auto Imports data that was addressed in **Sample Experiment 2** to predict the price of a car based on its specifications. After cleaning up missing entries in the dataset, the experiment splits into three branches. A different algorithm is used to train a regressor along each branch using the **Cross Validate Model** module. Cross validation is a training technique for reducing bias due to use of a single training set. Instead of simply splitting the dataset into training and test sets, cross validation partitions the entire dataset and cyclically holds out one of the resulting subsets for testing while training on the remaining subsets. The **Evaluation** results by fold output reports error measurements for each iteration. This information reveals the sensitivity of the model to the training set, and it provides you with a better indication of the model’s ability to generalize to new data. **Sample Experiment 3** is very similar, but addresses classification instead of regression. 

Dataset used: 

- **Automobile price data (Raw)**

###Sample 5: Train, Test, Evaluate for Binary Classification: Adult Dataset 
This sample experiment trains a binary classifier on the Adult dataset, predicting whether an individual’s income is greater or less than $50,000. After cleaning up missing entries, and removing string features from the dataset, the dataset is randomly split into a training set and a test set. The training set is used to train a classifier (a Boosted Decision Tree), then the resulting model is applied independently to both the training data and the test data. Visualizations created by the **Evaluate Model** display a number of metrics by which model quality can be determined. Applying the model to training data indicates whether the model is useful at all (in this case, Yes!), but this gives us an overoptimistic view of the model’s performance. In an operational setting the model will not have the advantage of knowing the answer as it does during training. By applying the model to the held-out test set we gain a more realistic view of the model’s ability to generalize to new datasets. **Sample Experiment 6** is very similar, but creates and measures a regression model instead of classification. 

Dataset used: 

- **Adult Census Income Binary Classification dataset**

###Sample 6: Train, Test, Evaluate for Regression: Auto Imports Dataset
This sample experiment trains a regression model on the Auto Imports dataset to predict the price of a car based on its specifications. After cleaning up missing entries, and removing string features from the dataset, the dataset is randomly split into a training set and a test set. The training set is used to train a regressor (a Poisson regressor), then the resulting model is applied independently to both the training data and the test data. Model quality metrics created by the **Evaluate Model** module yield a number of metrics by which model quality can be determined. Applying the model to training data indicates whether the model is useful at all, but this gives us an overoptimistic view of the model’s performance. In an operational setting the model will not have the advantage of knowing the answer as it does during training. By applying the model to the held-out test set we gain a more realistic view of the model’s ability to generalize to new datasets. **Sample Experiment 5** is very similar, but addressed classification instead of regression. 

Dataset used: 

- **Automobile price data (Raw)**

###Sample 7: Train, Test, Evaluate for Multiclass Classification: Letter Recognition Dataset 
This is a sample description of this experiment. Had this been an actual description of this experiment, it would have gone into details about what the experiment is all about, what it hopes to do, what data it uses, and some of the specifics about the modules and parameters used. But since this is just a sample description (because the actual description has not been written yet, or at least I can't find it), this is really just a lot of text to take up space with no realy intention of explaining anything about this experiment. Once the real description is written, it can be put here in place of this sample text. 

Dataset used: 

- [http://archive.ics.uci.edu/ml/machine-learning-databases/letter-recognition/letter-recognition.data](http://archive.ics.uci.edu/ml/machine-learning-databases/letter-recognition/letter-recognition.data)

### Sample Experiment - Breast Cancer - Development 
This is a sample description of this experiment. Had this been an actual description of this experiment, it would have gone into details about what the experiment is all about, what it hopes to do, what data it uses, and some of the specifics about the modules and parameters used. But since this is just a sample description (because the actual description has not been written yet, or at least I can't find it), this is really just a lot of text to take up space with no realy intention of explaining anything about this experiment. Once the real description is written, it can be put here in place of this sample text. 

Datasets used:

- **Breast Cancer Features**
- **Breast Cancer Info**

### Sample Experiment - Direct Marketing - Development - Training 
This is a sample description of this experiment. Had this been an actual description of this experiment, it would have gone into details about what the experiment is all about, what it hopes to do, what data it uses, and some of the specifics about the modules and parameters used. But since this is just a sample description (because the actual description has not been written yet, or at least I can't find it), this is really just a lot of text to take up space with no realy intention of explaining anything about this experiment. Once the real description is written, it can be put here in place of this sample text. 

Dataset used: 

- [https://azuremlsampleexperiments.blob.core.windows.net/datasets/direct_marketing.csv](https://azuremlsampleexperiments.blob.core.windows.net/datasets/direct_marketing.csv)

### Sample Experiment - Movie Recommender - Development 
This is a sample description of this experiment. Had this been an actual description of this experiment, it would have gone into details about what the experiment is all about, what it hopes to do, what data it uses, and some of the specifics about the modules and parameters used. But since this is just a sample description (because the actual description has not been written yet, or at least I can't find it), this is really just a lot of text to take up space with no realy intention of explaining anything about this experiment. Once the real description is written, it can be put here in place of this sample text. 

Datasets used:

- **IMDB Movie Titles**
- **Movie Ratings**

### Sample Experiment - News Categorization - Development 
This is a sample description of this experiment. Had this been an actual description of this experiment, it would have gone into details about what the experiment is all about, what it hopes to do, what data it uses, and some of the specifics about the modules and parameters used. But since this is just a sample description (because the actual description has not been written yet, or at least I can't find it), this is really just a lot of text to take up space with no realy intention of explaining anything about this experiment. Once the real description is written, it can be put here in place of this sample text. 

Datasets used:

- [https://azuremlsampleexperiments.blob.core.windows.net/datasets/lyrl2004_tokens_train.csv](https://azuremlsampleexperiments.blob.core.windows.net/datasets/lyrl2004_tokens_train.csv)
- [https://azuremlsampleexperiments.blob.core.windows.net/datasets/rcv1-v2.topics.qrels.csv](https://azuremlsampleexperiments.blob.core.windows.net/datasets/rcv1-v2.topics.qrels.csv)
- [https://azuremlsampleexperiments.blob.core.windows.net/datasets/lyrl2004_tokens_test.csv](https://azuremlsampleexperiments.blob.core.windows.net/datasets/lyrl2004_tokens_test.csv)


### Sample Experiment - Ranking of Movie Tweets According to their Future Popularity - Development 
This is a sample description of this experiment. Had this been an actual description of this experiment, it would have gone into details about what the experiment is all about, what it hopes to do, what data it uses, and some of the specifics about the modules and parameters used. But since this is just a sample description (because the actual description has not been written yet, or at least I can't find it), this is really just a lot of text to take up space with no realy intention of explaining anything about this experiment. Once the real description is written, it can be put here in place of this sample text. 

Dataset used: 

- **Movie Tweets**

### Sample Experiment: Named Entity Recognition 
This is a sample description of this experiment. Had this been an actual description of this experiment, it would have gone into details about what the experiment is all about, what it hopes to do, what data it uses, and some of the specifics about the modules and parameters used. But since this is just a sample description (because the actual description has not been written yet, or at least I can't find it), this is really just a lot of text to take up space with no realy intention of explaining anything about this experiment. Once the real description is written, it can be put here in place of this sample text. 

Dataset used: 

- **Named Entity Recognition Sample Articles**

### Sample Experiment: Recommender System 
This is a sample description of this experiment. Had this been an actual description of this experiment, it would have gone into details about what the experiment is all about, what it hopes to do, what data it uses, and some of the specifics about the modules and parameters used. But since this is just a sample description (because the actual description has not been written yet, or at least I can't find it), this is really just a lot of text to take up space with no realy intention of explaining anything about this experiment. Once the real description is written, it can be put here in place of this sample text. 

Datasets used:

- **Restaurant customer data**
- **Restaurant feature data**
- **Restaurant ratings**

### Sample Experiment: Split, Partition and Sample System 
This is a sample description of this experiment. Had this been an actual description of this experiment, it would have gone into details about what the experiment is all about, what it hopes to do, what data it uses, and some of the specifics about the modules and parameters used. But since this is just a sample description (because the actual description has not been written yet, or at least I can't find it), this is really just a lot of text to take up space with no realy intention of explaining anything about this experiment. Once the real description is written, it can be put here in place of this sample text. 

Dataset used: 

- **Adult Census Income Binary Classification dataset**

### Time Series Forecasting - Development 
This is a sample description of this experiment. Had this been an actual description of this experiment, it would have gone into details about what the experiment is all about, what it hopes to do, what data it uses, and some of the specifics about the modules and parameters used. But since this is just a sample description (because the actual description has not been written yet, or at least I can't find it), this is really just a lot of text to take up space with no realy intention of explaining anything about this experiment. Once the real description is written, it can be put here in place of this sample text. 

Dataset used: 

- **Time Series Dataset**



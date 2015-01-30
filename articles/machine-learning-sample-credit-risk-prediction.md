<properties 
	pageTitle="Machine Learning Sample: Credit risk prediction | Azure" 
	description="A sample Azure Machine Learning experiment to develop a binary classification model that predicts if an applicant is a low credit risk or a high credit risk." 
	services="machine-learning" 
	documentationCenter="" 
	authors="garyericson" 
	manager="paulettm" 
	editor="cgronlun"/>

<tags 
	ms.service="machine-learning" 
	ms.workload="data-services" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="12/10/2014" 
	ms.author="garye"/>


# Azure Machine Learning Sample: Credit risk prediction 

>[AZURE.NOTE]
>The [Sample Experiment] and [Sample Dataset] associated with this model are available in ML Studio. See below for more details.
[Sample Experiment]: #sample-experiment
[Sample Dataset]: #sample-dataset

*For a detailed walkthrough of how to create and use a simplified version of this experiment, see [Develop a predictive solution with Azure Machine Learning](http://azure.microsoft.com/en-us/documentation/articles/machine-learning-walkthrough-develop-predictive-solution/).*

The purpose of this experiment is to predict credit risk based on information given on a credit application. The prediction is a binary value: low risk or high risk. 


<!-- Removed until the Training and Scoring parts are fixed
This example is divided into 3 sample experiments:

- Development Experiment – for experimenting with different models
- Training Experiment – to train the one chosen model
- Scoring Experiment – to set up a web service using the trained model
-->

<!-- Removed because we added a section at the bottom describing the dataset
##Dataset Description

The experiment uses the UCI Statlog (German Credit Card) dataset which can be found here: 
<a href="http://archive.ics.uci.edu/ml/datasets/Statlog+(German+Credit+Data)">http://archive.ics.uci.edu/ml/datasets/Statlog+(German+Credit+Data)</a>. 
We are using the german.data file from this website.

The dataset classifies people, described by a set of attributes, as low or high credit risks. Each example represents a person. There are 20 features, both numerical and categorical, and a binary label (the credit risk value). High credit risk entries have label = 2, low credit risk entries have label = 1. The cost of misclassifying a low risk example as high is 1, whereas the cost of misclassifying a high risk example as low is 5.
-->

##Development Experiment

The original dataset has a white space-separated format. We transformed the dataset into CSV format and uploaded it into ML Studio. This transformation can be done using Powershell: 

	cat dataset.txt | %{$_ -replace " ",","} | sc german.csv

Or using the Unix sed command:

	sed 's/ /,/g' german.data > german.csv

We start by using the **Metadata Editor** to add column names to replace the default column names of the dataset with more meaningful names that were taken from the dataset description at the UCI site. The new column names are comma-separated in the **New column name** field of **Metadata Editor**.

Next, we generate training and test sets that will be used for developing the risk prediction model. We split the original dataset into training and test sets of the same size using the **Split** module with **Ratio of first output rows to input** set to 0.5.
 
Since the cost of misclassifying a high risk example as low is 5 times larger than the cost of misclassifying a low risk as high, we generate a new dataset that reflects this cost function. In the new dataset each high risk example is replicated 5 times, whereas low risk examples are kept as-is. The split of training and test datasets is done before this replication to prevent the same example from being in both the training and test sets. 

This replication is done by the following R code that is run using the **Execute R Script** module:

	dataset1 <- maml.mapInputPort(1)
	data.set<-dataset1[dataset1[,21]==1,]
	pos<-dataset1[dataset1[,21]==2,]
	for (i in 1:5) data.set<-rbind(data.set,pos)
	maml.mapOutputPort("data.set")

In our experiment we compare two approaches for generating models: training over the original dataset and training over the replicated dataset. In both approaches, to be aligned with the cost function of the problem, we test on the test set with replication. The final workflow for splitting and replication is depicted below. In this workflow the left output of the **Split** module is a training set and the right output is a test set. Note that the training set is subsequently used both with and without **Execute R Script** - that is, with and without replication.

![Splitting training and test data][screen1]
 
In addition to checking the effect of replication of examples in the training set, we also compare performance of two algorithms: Support Vector Machine (SVM) and boosted decision tree. In this way we effectively generate 4 models:

- SVM, trained with original data
- SVM, trained with replicated data
- Boosted Decision Tree, trained with original data
- Boosted Decision Tree, trained with replicated data

Boosted decision trees work well with features of any type. However, since the SVM module generates a linear classifier, the model that it generates has the best test error when all features have the same scale. To convert all features to the same scale we use the **Normalize Data** module with a tanh transformation. This transformation transforms all numeric features to [0,1] range. Note that string features are converted by the SVM module to categorical features and then to binary 0/1 features, so we don't need to manually transform string features. 

We initialize the learning algorithm using the **Two-Class Support Vector Machine** module or the **Two-Class Boosted Decision Tree** module and then use the **Train Model** module to create the actual model. These models are used by **Score Model** modules to produce scores of test examples. An example workflow that combines these modules and uses SVM and the replicated training set is depicted below. Note that **Train Model** is connected to the training set, whereas **Score Model** is connected to the test set.

![Training and scoring a model][screen2]

In the evaluation stage of the experiment we compute the accuracy of each of the above 4 models. For this purpose we use the **Evaluate Model** module. Note that this module only computes accuracy when all examples have the same misclassification cost. But since previously we replicated the positive examples, the accuracy computed by **Evaluate Model** is cost-sensitive and is 

![Accuracy computation][formula]

where *n+* and *n-* are the numbers of positive and negative examples in the original dataset, and *e+* and *e-* are the numbers of misclassified positive and negative examples in the original dataset.

The **Evaluate Model** module compares 2 scored models, so we use one **Evaluate Model** module to compare the 2 SVM models, and one to compare the 2 boosted decision tree models. We'll combine these into a table to view all 4 results. **Evaluate Model** produces a table with a single row that contains various metrics. We use the **Add Rows** module to combine all the results into a single table. We then annotate the table with the accuracies of the 4 modules using an R script in the **Execute R Script** module, where we manually enter the names of the rows of the final table. Finally we remove the columns with non-relevant metrics using the **Project Columns** module. 

The final results of the experiment, obtained by right-clicking the **Results dataset** output of **Project Columns** are:

![Results][results] 

where the first column is the name of the machine learning algorithm used to generate a model, the second column indicates the type of the training set, and the third column is a cost-sensitive accuracy. In this experiment, the SVM model, working with the replicated training dataset, provides the best accuracy.

<!-- Removed until the Training and Scoring parts are fixed
##Training Experiment

The sample training experiment is a simplified version of the larger experiment using just the chosen SVM training model. 

Notice that unlike the development experiment, in the training experiment we chose to load the dataset from Azure blob storage using the **Reader** module. Having the dataset stored in Azure is very common when it is generated by other programs. By reading the dataset directly from Azure we skip the step of manually uploading the dataset into ML Studio. The parameters of the **Reader** module are shown below. In this example, the storage account name is “datascience” and the dataset file “german.csv” is placed in container “sampleexperiments”. The account key is an access key of an Azure storage account. This key can be retrieved from your account in the Azure management portal.

![Azure storage parameters][screen3] 

##Scoring Experiment

The purpose of the sample scoring experiment is to set up a REST API web service that will score test examples. The trained model in this experiment (“Credit Risk model”) was created from the training experiment by right-clicking the Train Model module and selecting **Save as Trained Model**. In this scoring experiment we load test examples, normalize them, and perform scoring using this saved trained model. 

After running this experiment and verifying that it generates the right scores we prepare to publish it as a web service by defining the service input and output. We define the web service input as the input port to the **Normalize Data** module by right-clicking the port and selecting **Set as Publish Input**. The web service output is set to the output of the **Score Model** module by right-clicking the output of **Score Model** and selecting **Set as Publish Output**. 

After setting up the service input and output we need to rerun the experiment and then click **Publish Web Service**. This publishes the web service to the staging environment and takes us to the ML Studio **WEB SERVICES** page. Here we can configure and test the service with sample data.

When the service is ready to go live, go to the **CONFIGURATION** tab on the **WEB SERVICES** page and click **READY FOR PRODUCTION?**. A request will be sent to the IT administrator for Machine Learning who can promote the service to the production environment.

![Web service ready for production][screen4] 
-->

## Sample Experiment

The following sample experiment associated with this model is available in ML Studio in the **EXPERIMENTS** section under the **SAMPLES** tab.

> **Sample Experiment - German Credit - Development**


## Sample Dataset

The following sample dataset used by this experiment is available in ML Studio in the module palette under **Saved Datasets**.

<ul>
<li><b>German Credit Card UCI dataset</b><p></p>
[AZURE.INCLUDE [machine-learning-sample-dataset-german-credit-card-uci-dataset](../includes/machine-learning-sample-dataset-german-credit-card-uci-dataset.md)]
<p></p></li>
</ul>


[screen1]:./media/machine-learning-sample-credit-risk-prediction/screen1.jpg
[screen2]:./media/machine-learning-sample-credit-risk-prediction/screen2.jpg
[formula]:./media/machine-learning-sample-credit-risk-prediction/formula.jpg
[results]:./media/machine-learning-sample-credit-risk-prediction/results.jpg
[screen3]:./media/machine-learning-sample-credit-risk-prediction/screen3.jpg
[screen4]:./media/machine-learning-sample-credit-risk-prediction/screen4.jpg

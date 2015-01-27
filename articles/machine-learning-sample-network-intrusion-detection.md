<properties 
	pageTitle="Machine Learning Sample: Network intrusion detection | Azure" 
	description="A sample Azure Machine Learning experiment that uses a classification model to determine which network activities are a part of network intrusion." 
	services="machine-learning" 
	documentationCenter="" 
	authors="Garyericson" 
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



# Azure Machine Learning sample: Network intrusion detection

>[AZURE.NOTE]
>The [Sample Experiment] and [Sample Dataset] associated with this model are available in ML Studio. See below for more details.
[Sample Experiment]: #sample-experiment
[Sample Dataset]: #sample-dataset


## Problem description ##

The demo uses various network features to detect which network activities are part of an intrusion/attack. This binary classification problem is not too difficult as the features are quite predictive of a class and the classes are fairly balanced.  As several features are part of the label, it is important to remove any parts of the label prior to training a classifier. 

## Data ##

1. The data, from KDD cup 1999, include both training and testing datasets.  Classification accuracies on the training dataset are historically higher than the test dataset as new network intrusions are introduced to the test set.  The training dataset has approximately 126K rows and 43 columns, including the labels.  As three columns are part of the label information, there are 40 columns available for training the model.  Those 40 columns are mostly numeric with a few string/categorical features. The test data has approximately 22.5K test examples (with same 43 columns in training data). 
1. The data was uploaded to a public blob for easy access. AzureML provides reader modules for reading data from different storage like blobs using few simple clicks, without having the need to write any code. 

## Model ##

1. The first step in the model is to condition the data for later classification.  The "Class" column contains the labels to predict.  These labels are either "normal" (no intrusion) or the name of an attack.  Some attacks do not have many examples in the training data and there are new attacks in the test dataset, so we convert these multiclass labels into binary class labels to make the problem feasible.  The studio provides built-in module to ease this pre-processing step. The indicator value module is used to binarize the class labels and then the project column module is used to select this binarized class label column (excluding the original class label column).  
1. As part of the development of this experiment, we see through feature selection/correlation that many features are highly correlated with the label. This is common in synthetic datasets.  Cloud ML provides this visualization in few simple clicks, to do this select visualize option on the project module output and click on the header for any of the features to start the visualizer and then select the class label in the compare to drop-down.
1. Since a small number of features are highly correlated with the label, we will test combinations of linear and nonlinear classifiers with and without feature selection to determine which model is the best.  This comparison is achieve through the evaluate model module.    

## Results ##

1. The nonlinear classifier (boosted decision tree) performs slightly better than the linear classifier (logistic regression): 

![][1]


Now we want to compare to a boosted decision tree with feature selection. The classification performance is quite similar, but the boosted decision tree on all features is slightly better, and will be used for the scoring workflow.  Note this high classification AUC is typical for this dataset. 


![][2]

<!-- Removed until this part is fixed
## Operationalization ##


We wanted to see our model in action, to do this we wanted a request-response service around the model we just learned. Doing this is straightforward and can be achieved in few simple clicks in studio: 

1. First step is to save the learned model (by right clicking on the classifier module output) 
1. Now create a new experiment and search for saved model and drop it in the panel for new experiment 
1. Then we need to replicate the steps we did for pre-process, again we can just select the modules from experiment we need and copy and paste to the new experiment 
1. The last step is to plug in the test data and run the experiment, once the run is finished we can define the input and output points for the service 
1. Again, using one click we can publish the service end points that is deployed right away and can be tested using a friendly user interface - all within studio   
-->


## Sample Experiment

The following sample experiment associated with this model is available in ML Studio in the **EXPERIMENTS** section under the **SAMPLES** tab.

> **Sample Experiment - Network Intrusion Detection - Development**


## Sample Dataset

The following sample dataset used by this experiment is available in Azure BLOB storage.

<ul>
<li><b><a href="https://azuremlsampleexperiments.blob.core.windows.net/datasets/network_intrusion_detection.csv">network_intrusion_detection.csv</a></b><p></p>
[AZURE.INCLUDE [machine-learning-sample-dataset-network-intrusion](../includes/machine-learning-sample-dataset-network-intrusion.md)]
<p></p></li>
</ul>


[1]: ./media/machine-learning-sample-network-intrusion-detection/network-intrusion-detection-1.png
[2]: ./media/machine-learning-sample-network-intrusion-detection/network-intrusion-detection-2.png

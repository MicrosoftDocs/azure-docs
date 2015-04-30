<properties 
	pageTitle="Convert a Machine Learning training experiment to a scoring experiment | Azure" 
	description="How to convert a Machine Learning training experiment, used for training your predictive analytics model, to a scoring experiment which can be published as a web service." 
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
	ms.date="04/21/2015" 
	ms.author="garye"/>

#Convert a Machine Learning training experiment to a scoring experiment

Azure Machine Learning enables you to build, test, and deploy predictive analytics solutions. 

Once you've created and iterated on a *training experiment* to train your predictive analytics model, and you're ready to use it to score new data, you need to prepare and streamline your experiment for scoring. You can then publish this *scoring experiment* as an Azure web service so that users can send data to your model and receive your model's predictions.

By converting to a scoring experiment, you're getting your trained model ready to be published as a scoring web service. Users of the web service will send input data to your model and your model will send back the prediction results. So as you convert to a scoring experiment you will want to keep in mind how you expect your model to be used by others.

[AZURE.INCLUDE [machine-learning-free-trial](../includes/machine-learning-free-trial.md)]

The process of converting a training experiment to a scoring experiment involves three steps:

1.	Save the machine learning model that you've trained, and then replace the machine learning algorithm and [Train Model][train-model] modules with your saved trained model.
2.	Trim the experiment to only those modules that are needed for scoring. A training experiment includes a number of modules that are necessary for training but are not needed once the model is trained and ready to use for scoring.
3.	Define where in your experiment you will accept data from the web service user, and what data will be returned.

##Create Scoring Experiment button

The **Create Scoring Experiment** button at the bottom of the experiment canvas will perform for you the three steps of converting your training experiment to a scoring experiment:

1.	It saves your trained model as a module in the **Trained Models** section of the module palette (to the left of the experiment canvas), then replaces the machine learning algorithm and [Train Model][train-model] modules with the saved trained model. 
2.	It removes modules that are clearly not needed. In our example, this includes the [Split][split], 2nd [Score Model][score-model], and [Evaluate Model][evaluate-model] modules.
3.	It creates Web service input and output modules and adds them in default locations in your experiment.

For example, the following experiment trains a two-class boosted decision tree model using sample census data:

![Training experiment][figure1]

The modules in this experiment perform basically four different functions:

![Module functions][figure2]

When you convert this training experiment to a scoring experiment, some of these modules are no longer needed or they have a different purpose:

- **Data** - The data in this sample dataset is not used during scoring - the user of the web service will supply the data to be scored. However, the metadata from this dataset, such as data types, is used by the trained model. So you need to keep the dataset in the scoring experiment so that it can provide this metadata.

- **Prep** - Depending on the data that will be submitted for scoring, these modules may or may not be necessary to process the incoming data. 

	For instance, in this example the sample dataset may have missing values and it includes columns that are not needed to train the model. So a **Clean Missing Data** module was included to deal with missing values, and a [Project Columns][project-columns] module was included to exclude those extra columns from the data flow. If you know that the data that will be submitted for scoring through the web service will not have missing values, then you can remove the **Clean Missing Data** module. However, since the [Project Columns][project-columns] module helps define the set of features being scored, that module needs to remain.

- **Train** - Once the model has been successfully trained, you save it as a single trained model module. You then replace these individual modules with the saved trained model.

- **Score** - In this example, the Split module is used to divide the data stream into a set of test data and training data. In the scoring experiment this is not needed and can be removed. Similarly, the 2nd [Score Model][score-model] module and the [Evaluate Model][evaluate-model] module are used to compare results from the test data, so these modules are also not needed in the scoring experiment. The remaining [Score Model][score-model] module, however, is needed to return a score result through the web service.

Here is how our example looks after clicking **Create Scoring Experiment**:	

![Converted scoring experiment][figure3]

This may be sufficient to prepare your experiment to be published as a web service. However, you may want to do some additional work specific to your experiment.

###Adjust input and output modules

In your training experiment, you used a set of training data and then did some processing to get the data in a form that the machine learning algorithm needed. If the data you expect to receive through the web service will not need this processing, you can move the **Web service input module** to a different node in your experiment.

For example, by default **Create Scoring Experiment** puts the **Web service input** module at the top of your data flow, as in the figure above. However, if the input data will not need this processing, then you can manually position the **Web service input** past the data processing modules:

![Moving the web service input][figure4]

The input data provided through the web service will now pass directly into the Score Model module without any preprocessing.

Similarly, by default **Create Scoring Experiment** puts the Web service output module at the bottom of your data flow. In this example, the web service will return to the user the output of the [Score Model][score-model] module which includes the complete input data vector plus the scoring results.

However, if you would prefer to return something different - for example, only the scoring results and not the entire vector of input data - then you can insert a [Project Columns][project-columns] module to exclude all columns except the scoring results. You then move the **Web service output** module to the output of the [Project Columns][project-columns] module:

![Moving the web service output][figure5]

###Add or remove additional data processing modules

If there are more modules in your experiment that you know will not be needed during scoring, these can be removed. For example, because we have moved the **Web service input** module to a point after the data processing modules, we can remove the [Clean Missing Data][clean-missing-data] module from the scoring experiment. 

Our scoring experiment now looks like this:

![Removing additional module][figure6]

###Add optional Web Service Parameters

In some cases, you may want to allow the user of your web service to change the behavior of modules when the service is accessed. *Web Service Parameters* allow you to do this.

A common example is setting up the [Reader][reader] module so that the user of the published web service can specify a different data source when the web service is accessed. Or configuring the [Writer][writer] module so that a different destination can be specified. 

You can define Web Service Parameters and associate them with one or more module parameters, and you can specify whether they are required or optional. The user of the web service can then provide values for these parameters when the service is accessed and the module actions will be modified accordingly.

For more information about Web Service Parameters, see [Using Azure Machine Learning Web Service Parameters
][webserviceparameters].

[webserviceparameters]: machine-learning-web-service-parameters.md


##Publish the scoring experiment as a web service

Now that the scoring experiment has been sufficiently prepared, you can publish it as an Azure web service. Using the web service, users can send data to your model and the model will return its predictions.

For more information on the complete publishing process, see [Publish an Azure Machine Learning web service][publish]

[publish]: machine-learning-publish-a-machine-learning-web-service.md


<!-- Images -->
[figure1]:./media/machine-learning-convert-training-experiment-to-scoring-experiment/figure1.png
[figure2]:./media/machine-learning-convert-training-experiment-to-scoring-experiment/figure2.png
[figure3]:./media/machine-learning-convert-training-experiment-to-scoring-experiment/figure3.png
[figure4]:./media/machine-learning-convert-training-experiment-to-scoring-experiment/figure4.png
[figure5]:./media/machine-learning-convert-training-experiment-to-scoring-experiment/figure5.png
[figure6]:./media/machine-learning-convert-training-experiment-to-scoring-experiment/figure6.png


<!-- Module References -->
[clean-missing-data]: https://msdn.microsoft.com/library/azure/d2c5ca2f-7323-41a3-9b7e-da917c99f0c4/
[evaluate-model]: https://msdn.microsoft.com/library/azure/927d65ac-3b50-4694-9903-20f6c1672089/
[project-columns]: https://msdn.microsoft.com/library/azure/1ec722fa-b623-4e26-a44e-a50c6d726223/
[reader]: https://msdn.microsoft.com/library/azure/4e1b0fe6-aded-4b3f-a36f-39b8862b9004/
[score-model]: https://msdn.microsoft.com/library/azure/401b4f92-e724-4d5a-be81-d5b0ff9bdb33/
[split]: https://msdn.microsoft.com/library/azure/70530644-c97a-4ab6-85f7-88bf30a8be5f/
[train-model]: https://msdn.microsoft.com/library/azure/5cc7053e-aa30-450d-96c0-dae4be720977/
[writer]: https://msdn.microsoft.com/library/azure/7a391181-b6a7-4ad4-b82d-e419c0d6522c/

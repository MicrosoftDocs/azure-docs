<properties
	pageTitle="Step 4: Train and evaluate the predictive analytic models | Microsoft Azure"
	description="Step 4 of the Develop a predictive solution walkthrough: Train, score, and evaluate multiple models in Azure Machine Learning Studio."
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
	ms.date="07/06/2016"
	ms.author="garye"/>


# Walkthrough Step 4: Train and evaluate the predictive analytic models

This is the fourth step of the walkthrough, [Develop a predictive analytics solution in Azure Machine Learning](machine-learning-walkthrough-develop-predictive-solution.md)


1.	[Create a Machine Learning workspace](machine-learning-walkthrough-1-create-ml-workspace.md)
2.	[Upload existing data](machine-learning-walkthrough-2-upload-data.md)
3.	[Create a new experiment](machine-learning-walkthrough-3-create-new-experiment.md)
4.	**Train and evaluate the models**
5.	[Deploy the web service](machine-learning-walkthrough-5-publish-web-service.md)
6.	[Access the web service](machine-learning-walkthrough-6-access-web-service.md)

----------

One of the benefits of using Azure Machine Learning Studio for creating machine learning models is the ability to try more than one type of model at a time in an experiment and compare the results. This type of experimentation helps you find the best solution for your problem.

In the experiment we're developing in this walkthrough, we'll create two different types of models and then compare their scoring results to decide which algorithm we want to use in our final experiment.  

There are a number of models we could choose from. To see the models available, expand the **Machine Learning** node in the module palette, and then expand **Initialize Model** and the nodes beneath it. For the purposes of this experiment, we'll select the Support Vector Machine (SVM) and the Two-Class Boosted Decision Trees modules.    

> [AZURE.TIP] To get help deciding which Machine Learning algorithm best suits the particular problem you're trying to solve, see [How to choose algorithms for Microsoft Azure Machine Learning](machine-learning-algorithm-choice.md).

##Train the models
First, let's set up the boosted decision tree model:  

1.	Find the [Two-Class Boosted Decision Tree][two-class-boosted-decision-tree] module in the module palette and drag it onto the canvas.
2.	Find the [Train Model][train-model] module, drag it onto the canvas, and then connect the output of the boosted decision tree module to the left input port ("Untrained model") of the [Train Model][train-model] module.
    
    The [Two-Class Boosted Decision Tree][two-class-boosted-decision-tree] module initializes the generic model, and [Train Model][train-model] uses training data to train the model. 
     
3.	Connect the left output ("Result Dataset") of the left [Execute R Script][execute-r-script] module to the right input port ("Dataset") of the [Train Model][train-model] module.

	> [AZURE.TIP] We don't need two of the inputs and one of the outputs of the [Execute R Script][execute-r-script] module for this experiment, so we'll just leave them unattached. This is not uncommon for some modules.

4.	Select the [Train Model][train-model] module. In the **Properties** pane, click **Launch column selector**, select **Include** in the first dropdown, select **column names** in the second dropdown, and enter "Credit risk" in the text field (you can also select **column indices** and enter "21"). This identifies column 21, the credit risk value, as the column for the model to predict.


This portion of the experiment now looks something like this:  

![Training a model][1]

Next, we'll set up the SVM model.  

First, a little explanation about SVM. Boosted decision trees work well with features of any type. However, since the SVM module generates a linear classifier, the model that it generates has the best test error when all numeric features have the same scale. So to convert all numeric features to the same scale, we'll use a "Tanh" transformation (with the [Normalize Data][normalize-data] module) which will transform our numbers into the [0,1] range (string features are converted by the SVM module to categorical features and then to binary 0/1 features, so we don't need to manually transform string features). Also, we don't want to transform the Credit Risk column (column 21) - it's numeric, but it's the value we're training the model to predict, so we need to leave it alone.  

To set up the SVM model, do the following:

1.	Find the [Two-Class Support Vector Machine][two-class-support-vector-machine] module in the module palette and drag it onto the canvas.
2.	Right-click the [Train Model][train-model] module, select **Copy**, and then right-click the canvas and select **Paste**. Note that the copy of the [Train Model][train-model] module has the same column selection as the original.
3.	Connect the output of the SVM module to the left input port ("Untrained model") of the second [Train Model][train-model] module.
4.	Find the [Normalize Data][normalize-data] module and drag it onto the canvas.
5.	Connect the input of this module to the left output of the left [Execute R Script][execute-r-script] module (note that the output port of a module may be connected to more than one other module).
6.	Connect the left output port ("Transformed Dataset") of the [Normalize Data][normalize-data] module to the right input port ("Dataset") of the second [Train Model][train-model] module.
7.	In the **Properties** pane for the [Normalize Data][normalize-data] module, select **Tanh** for the **Transformation method** parameter.
8.	Click **Launch column selector**, select "No columns" for **Begin With**, select **Include** in the first dropdown, select **column type** in the second dropdown, and select **Numeric** in the third dropdown. This specifies that all the numeric columns (and only numeric) will be transformed.
9.	Click the plus sign (+) to the right of this row - this creates a new row of dropdowns. Select **Exclude** in the first dropdown, select **column names** in the second dropdown, and click the text field and select "Credit risk" from the list of columns. This specifies that the Credit Risk column should be ignored (we need to do this because this column is numeric and so would otherwise be transformed).
10.	Click **OK**.  


The [Normalize Data][normalize-data] module is now set to perform a Tanh transformation on all numeric columns except for the Credit Risk column.  

This portion of our experiment should now look something like this:  

![Training the second model][2]  

##Score and evaluate the models
We'll use the testing data that was separated out by the [Split Data][split] module to score our trained models. We can then compare the results of the two models to see which generated better results.  

1.	Find the [Score Model][score-model] module and drag it onto the canvas.
2.	Connect the left input port of this module to the boosted decision tree model (that is, connect it to the output port of the [Train Model][train-model] module that's connected to the [Two-Class Boosted Decision Tree][two-class-boosted-decision-tree] module).
3.	Connect the right input port of the [Score Model][score-model] module to the left output of the right [Execute R Script][execute-r-script] module.

    The [Score Model][score-model] module now can now take the credit information from the testing data, run it through the model, and compare the predictions the model generates with the actual credit risk column in the testing data.

4.	Copy and paste the [Score Model][score-model] module to create a second copy, or drag a new module onto the canvas.
5.	Connect the left input port of this module to the SVM model (that is, connect to the output port of the [Train Model][train-model] module that's connected to the [Two-Class Support Vector Machine][two-class-support-vector-machine] module).
6.	For the SVM model, we have to do the same transformation to the test data as we did to the training data. So copy and paste the [Normalize Data][normalize-data] module to create a second copy and connect it to the left output of the right [Execute R Script][execute-r-script] module.
7.	Connect the right input port of the [Score Model][score-model] module to the left output of the [Normalize Data][normalize-data] module.  

To evaluate the two scoring results we'll use the [Evaluate Model][evaluate-model] module.  

1.	Find the [Evaluate Model][evaluate-model] module and drag it onto the canvas.
2.	Connect the left input port to the output port of the [Score Model][score-model] module associated with the boosted decision tree model.
3.	Connect the right input port to the other [Score Model][score-model] module.  

Click the **RUN** button below the canvas to run the experiment. It may take a few minutes. You'll see a spinning indicator on each module to indicate that it's running, and then a green check mark when the module is finished. When all the modules have a check mark, the experiment has finished running.

The experiment should now look something like this:  

![Evaluating both models][3]

To check the results, click the output port of the [Evaluate Model][evaluate-model] module and select **Visualize**.  

The [Evaluate Model][evaluate-model] module produces a pair of curves and metrics that allow you to compare the results of the two scored models. You can view the results as Receiver Operator Characteristic (ROC) curves, Precision/Recall curves, or Lift curves. Additional data displayed includes a confusion matrix, cumulative values for the area under the curve (AUC), and other metrics. You can change the threshold value by moving the slider left or right and see how it affects the set of metrics.  

To the right of the graph, click **Scored dataset** or **Scored dataset to compare** to highlight the associated curve and to display the associated metrics below. In the legend for the curves, "Scored dataset" corresponds to the left input port of the [Evaluate Model][evaluate-model] module - in our case, this is the boosted decision tree model. "Scored dataset to compare" corresponds to the right input port - the SVM model in our case. When you click one of these labels you will highlight the curve for that model and display the corresponding metrics below.  

![ROC curves for models][4]

By examining these values you can decide which model is closest to giving you the results you're looking for. You can go back and iterate on your experiment by changing values in the different models. 

> [AZURE.TIP] Each time you run the experiment a record of that iteration is kept in the Run History. You can view these iterations, and return to any of them, by clicking **VIEW RUN HISTORY** below the canvas. You can also click **Prior Run** in the **Properties** pane to return to the iteration immediately preceding the one you have open.
You can make a copy of any iteration of your experiment by clicking **SAVE AS** below the canvas. 
Use the experiment's **Summary** and **Description** properties to keep a record of what you've tried in your experiment iterations.

>  For more details, see [Manage experiment iterations in Azure Machine Learning Studio](machine-learning-manage-experiment-iterations.md).  


----------

**Next: [Deploy the web service](machine-learning-walkthrough-5-publish-web-service.md)**

[1]: ./media/machine-learning-walkthrough-4-train-and-evaluate-models/train1.png
[2]: ./media/machine-learning-walkthrough-4-train-and-evaluate-models/train2.png
[3]: ./media/machine-learning-walkthrough-4-train-and-evaluate-models/train3.png
[4]: ./media/machine-learning-walkthrough-4-train-and-evaluate-models/train4.png


<!-- Module References -->
[evaluate-model]: https://msdn.microsoft.com/library/azure/927d65ac-3b50-4694-9903-20f6c1672089/
[execute-r-script]: https://msdn.microsoft.com/library/azure/30806023-392b-42e0-94d6-6b775a6e0fd5/
[normalize-data]: https://msdn.microsoft.com/library/azure/986df333-6748-4b85-923d-871df70d6aaf/
[score-model]: https://msdn.microsoft.com/library/azure/401b4f92-e724-4d5a-be81-d5b0ff9bdb33/
[train-model]: https://msdn.microsoft.com/library/azure/5cc7053e-aa30-450d-96c0-dae4be720977/
[two-class-boosted-decision-tree]: https://msdn.microsoft.com/library/azure/e3c522f8-53d9-4829-8ea4-5c6a6b75330c/
[two-class-support-vector-machine]: https://msdn.microsoft.com/library/azure/12d8479b-74b4-4e67-b8de-d32867380e20/
[split]: https://msdn.microsoft.com/library/azure/70530644-c97a-4ab6-85f7-88bf30a8be5f/

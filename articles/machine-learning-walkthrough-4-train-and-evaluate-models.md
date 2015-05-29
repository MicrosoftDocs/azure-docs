<properties 
	pageTitle="Step 4: Train and evaluate the predictive analytic models | Azure" 
	description="Solution walkthrough step 4: Train, score, and evaluate multiple models in Azure Machine Learning Studio" 
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
	ms.date="04/22/2015" 
	ms.author="garye"/>


# Walkthrough Step 4: Train and evaluate the predictive analytic models

This is the fourth step of the walkthrough, [Developing a Predictive Solution with Azure ML](machine-learning-walkthrough-develop-predictive-solution.md)


1.	[Create a Machine Learning workspace](machine-learning-walkthrough-1-create-ml-workspace.md)
2.	[Upload existing data](machine-learning-walkthrough-2-upload-data.md)
3.	[Create a new experiment](machine-learning-walkthrough-3-create-new-experiment.md)
4.	**Train and evaluate the models**
5.	[Publish the web service](machine-learning-walkthrough-5-publish-web-service.md)
6.	[Access the web service](machine-learning-walkthrough-6-access-web-service.md)

----------

In this experiment we want to try different algorithms for our predictive model. We'll create two different types of models and then compare their scoring results to decide which algorithm we want to use in our final experiment.  

There are a number of models we could choose from. To see the models available, expand the **Machine Learning** node in the module palette, and then expand **Initialize Model** and the nodes beneath it. For the purposes of this experiment, we'll select the Support Vector Machine (SVM) and the Two-Class Boosted Decision Trees modules. We'll use the appropriate modules to initialize the learning algorithms and use [Train Model][train-model] modules to train the models.   

##Train the models
First, let's set up the boosted decision tree model:  

1.	Find the [Two-Class Boosted Decision Tree][two-class-boosted-decision-tree] module in the module palette and drag it onto the canvas.
2.	Find the [Train Model][train-model] module, drag it onto the canvas, and then connect the output of the boosted decision tree module to the left input port ("Untrained model") of the [Train Model][train-model] module.
3.	Connect the output of the left [Execute R Script][execute-r-script] module to the right input port ("Dataset") of the [Train Model][train-model] module.

	> [AZURE.TIP] We don't need two of the inputs and one of the outputs of the [Execute R Script][execute-r-script] module for this experiment, so we'll just leave them unattached. This is not uncommon for some modules.


4.	Select the [Train Model][train-model] module. In the **Properties** pane, click **Launch column selector**, select **Include** in the first dropdown, select **column indices** in the second dropdown, and enter "21" in the text field (you can also select **Column name** and enter "Credit Risk"). This identifies column 21, the credit risk value, as the column for the model to predict.


This portion of the experiment now looks something like this:  

![Training a model][1]
 
Next, we'll set up the SVM model.  

Boosted decision trees work well with features of any type. However, since the SVM module generates a linear classifier, the model that it generates has the best test error when all numeric features have the same scale. To convert all numeric features to the same scale, we use the [Normalize Data][normalize-data] module with a Tanh transformation, which transforms features into the [0,1] range. Note that string features are converted by the SVM module to categorical features and then to binary 0/1 features, so we don't need to manually transform string features. Also, we don't want to transform the Credit Risk column (column 21) - it's numeric, but it's the value we're training the model to predict, so we need to leave it alone.  

1.	Find the [Two-Class Support Vector Machine][two-class-support-vector-machine] module in the module palette and drag it onto the canvas.
2.	Right-click the [Train Model][train-model] module, select **Copy**, and then right-click the canvas and select **Paste**. Note that the copy of the [Train Model][train-model] module has the same column selection as the original.
3.	Connect the output of the SVM module to the left input port ("Untrained model") of the [Train Model][train-model] module.
4.	Find the [Normalize Data][normalize-data] module and drag it onto the canvas.
5.	Connect the input of this transform module to the output of the left [Execute R Script][execute-r-script] module.
6.	Connect the left output port ("Transformed Dataset") of the transform module to the right input port ("Dataset") of the [Train Model][train-model] module.
7.	In the **Properties** pane for the transform module, select **Tanh** for the **Transformation method** parameter.
8.	Click **Launch column selector**, select **Include** in the first dropdown, select **column type** in the second dropdown, and select **Numeric** in the third dropdown. This specifies that all the numeric columns (and only numeric) will be transformed.
9.	Click the plus sign (+), which creates a new row of dropdowns. Select **Exclude** in the first dropdown, select **column indices** in the second dropdown, and enter "21" in the text field. This specifies that column 21 (the Credit Risk column) will be ignored.
10.	Click **OK**.  


The [Normalize Data][normalize-data] module is now set to perform a Tanh transformation on all numeric columns except for the Credit Risk column.  

This portion of our experiment should now look something like this:  

![Training the second model][2]  

##Score and evaluate the models
We'll use the scoring data that was separated out by the **Split** module to score our trained models. We can then compare the results of the two models to see which generated better results.  

1.	Find the [Score Model][score-model] module and drag it onto the canvas.
2.	Connect the left input port of this module to the boosted decision tree model (that is, connect it to the output port of the [Train Model][train-model] module that's connected to the [Two-Class Boosted Decision Tree][two-class-boosted-decision-tree] module).
3.	Connect the right input port of the [Score Model][score-model] module to the output of the right [Execute R Script][execute-r-script] module. Note that it's okay to have the output of a module go to multiple places.
4.	Copy and paste the [Score Model][score-model] module to create a second copy, or drag a new module onto the canvas.
5.	Connect the left input port of this module to the SVM model (that is, connect to the output port of the [Train Model][train-model] module that's connected to the [Two-Class Support Vector Machine][two-class-support-vector-machine] module).
6.	For the SVM model, we have to do the same transformation to the test data as we did to the training data. So copy and paste the [Normalize Data][normalize-data] module to create a second copy and connect it to the output of the right [Execute R Script][execute-r-script] module.
7.	Connect the right input port of the [Score Model][score-model] module to the output of the [Normalize Data][normalize-data] module.  

To evaluate the two scoring results we'll use the [Evaluate Model][evaluate-model] module.  

1.	Find the [Evaluate Model][evaluate-model] module and drag it onto the canvas.
2.	Connect the left input port to the output port of the [Score Model][score-model] module associated with the boosted decision tree model.
3.	Connect the right input port to the other [Score Model][score-model] module.  

The experiment should now look something like this:  

![Evaluating both models][3]
 
Click the **RUN** button below the canvas to run the experiment. It may take a few minutes. You'll see a spinning indicator on each module to indicate that it's running, and then a green check mark when the module is finished.   

When all the modules have a check mark, the experiment has finished running. To check the results, right-click the output port of the [Evaluate Model][evaluate-model] module and select **Visualize**.  

The [Evaluate Model][evaluate-model] module produces a pair of curves and metrics that allow you to compare the results of the two scored models. You can view the results as Receiver Operator Characteristic (ROC) curves, Precision/Recall curves, or Lift curves. Additional data displayed includes a confusion matrix, cumulative values for the area under the curve (AUC), and other metrics. You can change the threshold value by moving the slider left or right and see how it affects the set of metrics.  

Click **Scored dataset** or **Scored dataset to compare** to highlight the associated curve and to display the associated metrics below. In the legend for the curves, "Scored dataset" corresponds to the left input port of the [Evaluate Model][evaluate-model] module - in our case, this is the boosted decision tree model. "Scored dataset to compare" corresponds to the right input port - the SVM model in our case. When you click one of these labels you will highlight the curve for that model and display the corresponding metrics below.  

![ROC curves for models][4]
 
By examining these values you can decide which model is closest to giving you the results you're looking for. You can go back and iterate on your experiment by changing values in the different models.  

> [AZURE.TIP] Each time you run the experiment a record of that iteration is kept in the Run History. You can view these iterations, and return to any of them, by clicking **VIEW RUN HISTORY** below the canvas. You can also click **Prior Run** in the **Properties** pane to return to the iteration immediately preceding the one you have open. For more information, see [Manage experiment iterations in Azure Machine Learning Studio](machine-learning-manage-experiment-iterations.md).

You can also make a copy of any iteration of your experiment by clicking **SAVE AS** below the canvas. This makes a duplicate of the experiment, creating a new Run History to track your iterations of this version. The new copy is displayed in the **EXPERIMENTS** list alongside the original. This can be helpful if you want to start a new branch of experiment iterations.  

As an additional help to track the changes you make to module parameters, you can add comments to any module on the experiment canvas. Just double-click the module or right-click and select **Edit Comment**. These comments are saved with the experiment iterations and can help you annotate your work.


----------

**Next: [Publish the web service](machine-learning-walkthrough-5-publish-web-service.md)**

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

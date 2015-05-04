<properties 
	pageTitle="Step 3: Create a new Machine Learning experiment | Azure" 
	description="Solution walkthrough step 3: Create a new training experiment in Azure Machine Learning Studio" 
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


# Walkthrough Step 3: Create a new Azure Machine Learning experiment

This is the third step of the walkthrough, [Developing a Predictive Solution with Azure ML](machine-learning-walkthrough-develop-predictive-solution.md)


1.	[Create a Machine Learning workspace](machine-learning-walkthrough-1-create-ml-workspace.md)
2.	[Upload existing data](machine-learning-walkthrough-2-upload-data.md)
3.	**Create a new experiment**
4.	[Train and evaluate the models](machine-learning-walkthrough-4-train-and-evaluate-models.md)
5.	[Publish the web service](machine-learning-walkthrough-5-publish-web-service.md)
6.	[Access the web service](machine-learning-walkthrough-6-access-web-service.md)

----------

We need to create a new experiment in ML Studio that uses the dataset we uploaded.  

1.	In ML Studio, click **+NEW** at the bottom of the window.
2.	Select **EXPERIMENT**, and then select "Blank Experiment". Select the default experiment name at the top of the canvas and rename it to something meaningful
3.	In the module palette to the left of the experiment canvas, expand **Saved Datasets**.
4.	Find the dataset you created and drag it onto the canvas. You can also find the dataset by entering the name in the **Search** box above the palette.  

##Prepare the data
You can view the first 100 rows of the data and some statistical information for the whole dataset by right-clicking the output port of the dataset and selecting **Visualize**. Notice that ML Studio has already identified the data type for each column. It has also given generic headings to the columns because the data file did not come with column headings.  

Column headings are not essential, but they will make it easier to work with the data in the model. Also, when we eventually publish this model in a web service, the headings will help identify the columns to the user of the service.  

We can add column headings using the [Metadata Editor][metadata-editor] module.
The [Metadata Editor][metadata-editor] module is used to change the metadata associated with a dataset. In this case, it can provide more friendly names for column headings. To do this, we'll direct [Metadata Editor][metadata-editor] to act on all columns and then provide a list of names to be added to the columns.

1.	In the module palette, type "metadata" in the **Search** box. You'll see [Metadata Editor][metadata-editor] in the module list.
2.	Click and drag the [Metadata Editor][metadata-editor] module onto the canvas and drop it below the dataset.
3.	Connect the dataset to the [Metadata Editor][metadata-editor]: click the output port of the dataset, drag to the input port of [Metadata Editor][metadata-editor], then release the mouse button. The dataset and module will remain connected even if you move either around on the canvas.
4.	With the [Metadata Editor][metadata-editor] still selected, in the **Properties** pane to the right of the canvas, click **Launch column selector**.
5.	In the **Select columns** dialog, set the **Begin With** field to "All columns".
6.	The row beneath **Begin With** allows you to include or exclude specific columns for the [Metadata Editor][metadata-editor] to modify. Since we want to modify all columns, delete this row by clicking the minus sign ("-") to the right of the row. The dialog should look like this:
    ![Column Selector with all columns selected][4]
7.	Click the **OK** checkmark. 
8.	Back in the **Properties** pane, look for the **New column name** parameter. In this field, enter a list of names for the 21 columns in the dataset, separated by commas and in column order. You can obtain the columns names from the dataset documentation on the UCI website, or for convenience you can copy and paste the following:  

		Status of checking account, Duration in months, Credit history, Purpose, Credit amount, Savings account/bond, Present employment since, Installment rate in percentage of disposable income, Personal status and sex, Other debtors, Present residence since, Property, Age in years, Other installment plans, Housing, Number of existing credits, Job, Number of people providing maintenance for, Telephone, Foreign worker, Credit risk  

The Properties pane will look like this:

![Properties for Metadata Editor][1] 

> [AZURE.TIP] If you want to verify the column headings, run the experiment (click **RUN** below the experiment canvas), right-click the output port of the [Metadata Editor][metadata-editor] module, and select **Visualize**. You can view the output of any module in the same way to view the progress of the data through the experiment.

The experiment should now look something like this:  

![Adding Metadata Editor][2]
 
##Create training and test datasets
The next step of the experiment is to generate separate datasets that will be used for training and testing our model. To do this, we use the [Split][split] module.  

1.	Find the [Split][split] module, drag it onto the canvas, and connect it to the last [Metadata Editor][metadata-editor] module.
2.	By default, the split ratio is 0.5 and the **Randomized split** parameter is set. This means that a random half of the data will be output through one port of the [Split][split] module, and half out the other. You can adjust these, as well as the **Random seed** parameter, to change the split between training and scoring data. For this example we'll leave them as-is.
	> [AZURE.TIP] The split ratio essentially determines how much of the data is output through the left output port. For instance, if you set the ratio to 0.7, then 70% of the data is output through the left port and 30% through the right port.  
	
We can use the outputs of the [Split][split] module however we like, but let's choose to use the left output as training data and the right output as scoring data.  

As mentioned on the UCI website, the cost of misclassifying a high credit risk as low is 5 times larger than the cost of misclassifying a low credit risk as high. To account for this, we'll generate a new dataset that reflects this cost function. In the new dataset, each high example is replicated 5 times, while each low example is not replicated.   

We can do this replication using R code:  

1.	Find and drag the [Execute R Script][execute-r-script] module onto the experiment canvas and connect it to the left output port of the [Split][split] module.
2.	In the **Properties** pane, delete the default text in the **Script** parameter and enter this script: 

		dataset1 <- maml.mapInputPort(1)
		data.set<-dataset1[dataset1[,21]==1,]
		pos<-dataset1[dataset1[,21]==2,]
		for (i in 1:5) data.set<-rbind(data.set,pos)
		maml.mapOutputPort("data.set")


We need to do this same replication operation for each output of the [Split][split] module so that the training and scoring data have the same cost adjustment.

1.	Right-click the [Execute R Script][execute-r-script] module and select **Copy**.
2.	Right-click the experiment canvas and select **Paste**.
3.	Connect this [Execute R Script][execute-r-script] module to the right output port of the [Split][split] module.  

> [AZURE.TIP] The copy of the Execute R Script module contains the same script as the original module. When you copy and paste a module on the canvas, the copy retains all the properties of the original.  
>
Our experiment now looks something like this:
 
![Adding Split module and R scripts][3]

For more information on using R scripts in your experiments, see [Extend your experiment with R](machine-learning-extend-your-experiment-with-r.md).

**Next: [Train and evaluate the models](machine-learning-walkthrough-4-train-and-evaluate-models.md)**


[1]: ./media/machine-learning-walkthrough-3-create-new-experiment/create1.png
[2]: ./media/machine-learning-walkthrough-3-create-new-experiment/create2.png
[3]: ./media/machine-learning-walkthrough-3-create-new-experiment/create3.png
[4]: ./media/machine-learning-walkthrough-3-create-new-experiment/columnselector.png


<!-- Module References -->
[execute-r-script]: https://msdn.microsoft.com/library/azure/30806023-392b-42e0-94d6-6b775a6e0fd5/
[metadata-editor]: https://msdn.microsoft.com/library/azure/370b6676-c11c-486f-bf73-35349f842a66/
[split]: https://msdn.microsoft.com/library/azure/70530644-c97a-4ab6-85f7-88bf30a8be5f/

---
title: 'Step 3: Create a new Machine Learning experiment | Microsoft Docs'
description: 'Step 3 of the Develop a predictive solution walkthrough: Create a new training experiment in Azure Machine Learning Studio.'
services: machine-learning
documentationcenter: ''
author: garyericson
manager: jhubbard
editor: cgronlun

ms.assetid: 660e3c27-55ef-4c33-a4e9-dff4d1224630
ms.service: machine-learning
ms.workload: data-services
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 03/23/2017
ms.author: garye

---
# Walkthrough Step 3: Create a new Azure Machine Learning experiment
This is the third step of the walkthrough, [Develop a predictive analytics solution in Azure Machine Learning](machine-learning-walkthrough-develop-predictive-solution.md)

1. [Create a Machine Learning workspace](machine-learning-walkthrough-1-create-ml-workspace.md)
2. [Upload existing data](machine-learning-walkthrough-2-upload-data.md)
3. **Create a new experiment**
4. [Train and evaluate the models](machine-learning-walkthrough-4-train-and-evaluate-models.md)
5. [Deploy the Web service](machine-learning-walkthrough-5-publish-web-service.md)
6. [Access the Web service](machine-learning-walkthrough-6-access-web-service.md)

- - -
The next step in this walkthrough is to create an experiment in Machine Learning Studio that uses the dataset we uploaded.  

1. In Studio, click **+NEW** at the bottom of the window.
2. Select **EXPERIMENT**, and then select "Blank Experiment". 

    ![Create a new experiment][0]

2. Select the default experiment name at the top of the canvas and rename it to something meaningful.

    ![Rename experiment][5]
   
   > [!TIP]
   > It's a good practice to fill in **Summary** and **Description** for the experiment in the **Properties** pane. These properties give you the chance to document the experiment so that anyone who looks at it later will understand your goals and methodology.
   > 
   > ![Experiment properties][6]
   > 
3. In the module palette to the left of the experiment canvas, expand **Saved Datasets**.
4. Find the dataset you created under **My Datasets** and drag it onto the canvas. You can also find the dataset by entering the name in the **Search** box above the palette.  

    ![Add the dataset to the experiment][7]

## Prepare the data
You can view the first 100 rows of the data and some statistical information for the whole dataset: Click the output port of the dataset (the small circle at the bottom) and select **Visualize**.  

Because the data file didn't come with column headings, Studio has provided generic headings (Col1, Col2, *etc.*). Good headings aren't essential to creating a model, but they make it easier to work with the data in the experiment. Also, when we eventually publish this model in a web service, the headings help identify the columns to the user of the service.  

We can add column headings using the [Edit Metadata][edit-metadata] module.
You use the [Edit Metadata][edit-metadata] module to change metadata associated with a dataset. In this case, we use it to provide more friendly names for column headings. 

To use [Edit Metadata][edit-metadata], you first specify which columns to modify (in this case, all of them.) Next, you specify the action to be performed on those columns (in this case, changing column headings.)

1. In the module palette, type "metadata" in the **Search** box. The [Edit Metadata][edit-metadata] appears in the module list.

2. Click and drag the [Edit Metadata][edit-metadata] module onto the canvas and drop it below the dataset we added earlier.

3. Connect the dataset to the [Edit Metadata][edit-metadata]: click the output port of the dataset (the small circle at the bottom of the dataset), drag to the input port of [Edit Metadata][edit-metadata] (the small circle at the top of the module), then release the mouse button. The dataset and module remain connected even if you move either around on the canvas.
   
   The experiment should now look something like this:  
   
   ![Adding Edit Metadata][1]
   
   The red exclamation mark indicates that we haven't set the properties for this module yet. We'll do that next.
   
   > [!TIP]
   > You can add a comment to a module by double-clicking the module and entering text. This can help you see at a glance what the module is doing in your experiment. In this case, double-click the [Edit Metadata][edit-metadata] module and type the comment "Add column headings". Click anywhere else on the canvas to close the text box. To display the comment, click the down-arrow on the module.
   > 
   > ![Edit Metadata module with comment added][8]
   > 
4. Select [Edit Metadata][edit-metadata], and in the **Properties** pane to the right of the canvas, click **Launch column selector**.

5. In the **Select columns** dialog, select all the rows in **Available Columns** and click > to move them to **Selected Columns**.
   The dialog should look like this:

   ![Column Selector with all columns selected][2]

6. Click the **OK** check mark.

7. Back in the **Properties** pane, look for the **New column names** parameter. In this field, enter a list of names for the 21 columns in the dataset, separated by commas and in column order. You can obtain the columns names from the dataset documentation on the UCI website, or for convenience you can copy and paste the following list:  
   
       Status of checking account, Duration in months, Credit history, Purpose, Credit amount, Savings account/bond, Present employment since, Installment rate in percentage of disposable income, Personal status and sex, Other debtors, Present residence since, Property, Age in years, Other installment plans, Housing, Number of existing credits, Job, Number of people providing maintenance for, Telephone, Foreign worker, Credit risk  
   
   The Properties pane looks like this:
   
   ![Properties for Edit Metadata][3]

> [!TIP]
> If you want to verify the column headings, run the experiment (click **RUN** below the experiment canvas). When it finishes running (a green check mark appears on [Edit Metadata][edit-metadata]), click the output port of the [Edit Metadata][edit-metadata] module, and select **Visualize**. You can view the output of any module in the same way to view the progress of the data through the experiment.
> 
> 

## Create training and test datasets
We need some data to train the model and some to test it.
So in the next step of the experiment, we split the dataset into two separate datasets: one for training our model and one for testing it.

To do this, we use the [Split Data][split] module.  

1. Find the [Split Data][split] module, drag it onto the canvas, and connect it to the [Edit Metadata][edit-metadata] module.

2. By default, the split ratio is 0.5 and the **Randomized split** parameter is set. This means that a random half of the data is output through one port of the [Split Data][split] module, and half through the other. You can adjust these parameters, as well as the **Random seed** parameter, to change the split between training and testing data. For this example, we leave them as-is.
   
   > [!TIP]
   > The property **Fraction of rows in the first output dataset** determines how much of the data is output through the *left* output port. For instance, if you set the ratio to 0.7, then 70% of the data is output through the left port and 30% through the right port.  
   > 
   > 

3. Double-click the [Split Data][split] module and enter the comment, "Training/testing data split 50%". 

We can use the outputs of the [Split Data][split] module however we like, but let's choose to use the left output as training data and the right output as testing data.  

As mentioned in the [previous step](machine-learning-walkthrough-2-upload-data.md), the cost of misclassifying a high credit risk as low is five times higher than the cost of misclassifying a low credit risk as high. To account for this, we generate a new dataset that reflects this cost function. In the new dataset, each high risk example is replicated five times, while each low risk example is not replicated.   

We can do this replication using R code:  

1. Find and drag the [Execute R Script][execute-r-script] module onto the experiment canvas. 

2. Connect the left output port of the [Split Data][split] module to the first input port ("Dataset1") of the [Execute R Script][execute-r-script] module.

3. Double-click the [Execute R Script][execute-r-script] module and enter the comment, "Set cost adjustment".

4. In the **Properties** pane, delete the default text in the **R Script** parameter and enter this script:
   
       dataset1 <- maml.mapInputPort(1)
       data.set<-dataset1[dataset1[,21]==1,]
       pos<-dataset1[dataset1[,21]==2,]
       for (i in 1:5) data.set<-rbind(data.set,pos)
       maml.mapOutputPort("data.set")

    ![R script in the Execute R Script module][9]

We need to do this same replication operation for each output of the [Split Data][split] module so that the training and testing data have the same cost adjustment. The easiest way to do this is by duplicating the [Execute R Script][execute-r-script] module we just made and connecting it to the other output port of the [Split Data][split] module.

1. Right-click the [Execute R Script][execute-r-script] module and select **Copy**.

2. Right-click the experiment canvas and select **Paste**.

3. Drag the new module into position, and then connect the right output port of the [Split Data][split] module to the first input port of this new [Execute R Script][execute-r-script] module. 

4. At the bottom of the canvas, click **Run**. 

> [!TIP]
> The copy of the Execute R Script module contains the same script as the original module. When you copy and paste a module on the canvas, the copy retains all the properties of the original.  
> 
> 

Our experiment now looks something like this:

![Adding Split module and R scripts][4]

For more information on using R scripts in your experiments, see [Extend your experiment with R](machine-learning-extend-your-experiment-with-r.md).

**Next: [Train and evaluate the models](machine-learning-walkthrough-4-train-and-evaluate-models.md)**

[0]: ./media/machine-learning-walkthrough-3-create-new-experiment/create-new-experiment.png
[5]: ./media/machine-learning-walkthrough-3-create-new-experiment/rename-experiment.png
[6]: ./media/machine-learning-walkthrough-3-create-new-experiment/experiment-properties.png
[7]: ./media/machine-learning-walkthrough-3-create-new-experiment/add-dataset-to-experiment.png
[8]: ./media/machine-learning-walkthrough-3-create-new-experiment/edit-metadata-with-comment.png
[9]: ./media/machine-learning-walkthrough-3-create-new-experiment/execute-r-script.png
[1]: ./media/machine-learning-walkthrough-3-create-new-experiment/experiment-with-edit-metadata-module.png
[2]: ./media/machine-learning-walkthrough-3-create-new-experiment/select-columns.png
[3]: ./media/machine-learning-walkthrough-3-create-new-experiment/edit-metadata-properties.png
[4]: ./media/machine-learning-walkthrough-3-create-new-experiment/experiment.png


<!-- Module References -->
[execute-r-script]: https://msdn.microsoft.com/library/azure/30806023-392b-42e0-94d6-6b775a6e0fd5/
[edit-metadata]: https://msdn.microsoft.com/library/azure/370b6676-c11c-486f-bf73-35349f842a66/
[split]: https://msdn.microsoft.com/library/azure/70530644-c97a-4ab6-85f7-88bf30a8be5f/

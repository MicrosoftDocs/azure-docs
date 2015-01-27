<properties 
	pageTitle="Step 5: Publish the Machine Learning web service | Azure" 
	description="Step 5: Publish a scoring experiment in Azure Machine Learning Studio as an ML API web service" 
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
	ms.date="08/06/2014" 
	ms.author="garye"/>


This is the fifth step of the walkthrough, [Developing a Predictive Solution with Azure ML][develop]:

[develop]: ../machine-learning-walkthrough-develop-predictive-solution/


1.	[Create an ML workspace][create-workspace]
2.	[Upload existing data][upload-data]
3.	[Create a new experiment][create-new]
4.	[Train and evaluate the models][train-models]
5.	**Publish the web service**
6.	[Access the web service][access-ws]

[create-workspace]: ../machine-learning-walkthrough-1-create-ml-workspace/
[upload-data]: ../machine-learning-walkthrough-2-upload-data/
[create-new]: ../machine-learning-walkthrough-3-create-new-experiment/
[train-models]: ../machine-learning-walkthrough-4-train-and-evaluate-models/
[publish]: ../machine-learning-walkthrough-5-publish-web-service/
[access-ws]: ../machine-learning-walkthrough-6-access-web-service/

----------

# Step 5: Publish the Azure Machine Learning web service

To make this predictive model useful to others, we'll publish it as a web service on Azure. A user will be able to send the service a set of credit application data and the service will return the prediction of credit risk.  

To do this, we need to:  

-	Prepare the experiment so that it's ready to be published
-	Publish it to a staging server where we can test it
-	Promote it to the live server once we think it's ready  

Before going further, you should create a copy of this experiment to edit. That way you can return to your training experiment any time you need to do further work with your models.  

1.	Click **Save As** below the canvas.
2.	Give the experiment copy a helpful name. The default is to append "- Copy" to the original experiment name. In our case, let's call this "Credit Risk Prediction - Scoring Experiment".
3.	Click **OK**.  


You can now see both the original experiment and the copy listed in the EXPERIMENTS list of ML Studio.  

![Experiments list][1]
 
##Prepare the scoring experiment
We need to do two things to get our model ready to be published as a web service.  

First, we need to convert the experiment from a *training experiment* to a *scoring experiment*. Up to this point we have been experimenting with training our model. But the published service is no longer going to do training - it will be scoring the user's input. So we'll save a copy of the model that we've trained and then eliminate all the components of our experiment that were devoted to training.  

Second, the Azure ML web service will accept input from the user and return a result, so we need to identify those input and output points in our experiment.  

###Convert from a training experiment to a scoring experiment
Let's say we've decided that the boosted tree model was the better model to use. So the first thing to do is remove the SVM training modules.  

1.	Delete the **Two-Class Support Vector Machine**
2.	Delete the **Train Model** and **Score Model** modules that were connected to it
3.	Delete the **Normalize Data** module  

Now we'll save the boosted tree model that we've trained. We can then remove the remaining modules in the experiment that we used for training and replace them with the trained model.  

1.	Right-click the output port of the remaining **Train Model** module and select **Save as Trained Model**.
2.	Enter a name and a description for the trained model. For this example we'll call it "Credit Risk Prediction".

	>**Note**: Once we save this trained model, it appears in the module palette and is available to be used in other experiments.

3.	Find this model in the module palette by typing "credit risk" In the **Search** box, then drag the **Credit Risk Prediction** trained model onto the experiment canvas.
4.	Delete the **Two-Class Boosted Decision** Tree and the **Train Model** modules.
5.	Connect the output of the **Credit Risk Prediction** model to the left input of the **Score Model** module.   

We now have the saved, trained version of the model in our experiment in place of the original training modules.  

There are more components in the experiment that we added just for training and for evaluating our two model  algorithms. We can remove them as well:  

-	**Split**
-	Both **Execute R Script** modules
-	**Evaluate Model**  

One more thing: The original credit card data included the Credit Risk column. We passed this column through to the **Train Model** module so that it could train the model to predict those values. But now that the model has been trained, we don't want to continue to pass that column along - the trained model will predict that value for us. To remove that column from the flow of data, we use the **Project Column** module.  

1.	Find and drag the **Project Column** module onto the canvas.
2.	Connect this module to the output of the **Metadata Editor** module (now that the **Split** and **Execute R Script** modules have been removed)
3.	Select the **Project Columns** module and click **Launch column selector**.
4.	Leave "All columns" in the dropdown.
5.	Click the plus sign (+) to create a new dropdown row.
6.	In this new dropdown, select "Exclude column names" and enter "Credit risk" in the text field (you could also specify the column by its column number, 21).
7.	Click **OK**.

	>Tip - The column selector follows the logic of the dropdowns in the sequence they appear. In this case, we've directed the **Project Columns** module to "pass through all columns except the 'Credit risk' column." If we had left out the first dropdown, the module would pass no columns through at all.

8.	Connect the output of the **Project Columns** module to the right input of the **Score Model** module.  

Our experiment should now look like this:  

![Scoring the trained model][2]  

###Select the service input and output
In the original model, the data to be scored was passed into the right input port ("Dataset") of the **Score Model** module, and the scored result appeared at the output port ("Scored Dataset"). When the service is running, we want the user's data and the results to use these same ports.  

1.	Right-click the right input port of the **Score Model** module and select **Set as Publish Input**. The user's data will need to include all the data of the feature vector.

	>**Tip** - If you have to perform any manipulation of the user's data before passing it to the scoring module (such as the way we used a **Normalize Data** module to prepare data for the SVM model), just leave the module in the web service and set the service input to the input port of that module.

2.	Right-click the output port and select **Set as Publish Output**. The output of the Score Model module will be returned by the service. This includes the feature vector, plus the credit risk prediction and the scoring probability value.

	>**Tip** - If you want the web service to return only part of this data - for instance, you don't want to return the whole feature vector - you can add a **Project Columns** module after the **Score Model** module, configure it to exclude columns you don't want, and then set the output of the **Project Columns** module to be the web service output.  
  

>**Note** - You may be wondering why we left the UCI German Credit Card Data dataset and its associated modules connected to the **Score Model** module. The service is going to use the user's data, not the original dataset, so why leave them connected?

It's true that the service doesn't need the original credit card data. But it does need the schema for that data, which includes information such as how many columns there are and which columns are numeric. This schema information is necessary in order to interpret the user's data. We leave these components connected so that the scoring module will have the dataset schema when the service is running. The data isn't used, just the schema.  

Run the experiment one last time (click **RUN**). If you want to verify that the model is still working, right-click the output of the **Score Model** module and select **Visualize**. You'll see that the original data is displayed, along with the credit risk value ("Scored Labels") and the scoring probability value ("Scored Probabilities").  

##Publish the web service
To publish a web service derived from our experiment, click **PUBLISH WEB SERVICE** below the canvas and click **YES** when prompted. ML Studio publishes the experiment as a web service on the ML staging server, and takes you to the service dashboard.   

>**Tip** - You can update the web service after you've published it. For example, if you want to change your model, just edit the training experiment you saved earlier, tweak the model parameters, and save the trained model (overwriting the one you saved before). When you open the scoring experiment again you'll see a notice telling you that something has changed (that will be your trained model) and you can update the experiment. When you publish the experiment again, it will replace the web service, now using your updated model.  

You can configure the service by clicking the **CONFIGURATION** tab. Here you can modify the service name (it's given the experiment name by default) and give it a description. You can also give more friendly labels for the input and output columns.  

We'll deal with the **READY FOR PRODUCTION?** switch a little later.  

##Test the web service
On the **DASHBOARD** page, click the **Test** link under **Staging Services**. A dialog will pop up that asks you for the input data for the service. These are the same columns that appeared in the original German credit risk dataset.  

Enter a set of data and then click **OK**.  

The results generated by the web service are displayed at the bottom of the dashboard. The way we have the service configured, the results you see are generated by the scoring module.   

##Promote the web service to the live server
So far the service has been running on the ML staging server. When you're ready for it to go live, you can request that it be promoted to the live server.  

On the **CONFIGURATION** tab, click "YES" next to **READY FOR PRODUCTION?** This sends a notice to your IT administrator that this web service is ready to go live. The administrator can then promote it to the live server.

![Promoting the service to the live environment][3]  

----------

**Next: [Access the web service][access-ws]**

[1]: ./media/machine-learning-walkthrough-5-publish-web-service/publish1.png
[2]: ./media/machine-learning-walkthrough-5-publish-web-service/publish2.png
[3]: ./media/machine-learning-walkthrough-5-publish-web-service/publish3.png
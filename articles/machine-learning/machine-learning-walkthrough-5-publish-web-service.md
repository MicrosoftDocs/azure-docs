<properties
	pageTitle="Step 5: Deploy the Machine Learning Web service | Microsoft Azure"
	description="Step 5 of the Develop a predictive solution walkthrough: Deploy a predictive experiment in Machine Learning Studio as a Web service."
	services="machine-learning"
	documentationCenter=""
	authors="garyericson"
	manager="jhubbard"
	editor="cgronlun"/>

<tags
	ms.service="machine-learning"
	ms.workload="data-services"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="10/05/2016"
	ms.author="garye"/>


# Walkthrough Step 5: Deploy the Azure Machine Learning Web service

This is the fifth step of the walkthrough, [Develop a predictive analytics solution in Azure Machine Learning](machine-learning-walkthrough-develop-predictive-solution.md)


1.	[Create a Machine Learning workspace](machine-learning-walkthrough-1-create-ml-workspace.md)
2.	[Upload existing data](machine-learning-walkthrough-2-upload-data.md)
3.	[Create a new experiment](machine-learning-walkthrough-3-create-new-experiment.md)
4.	[Train and evaluate the models](machine-learning-walkthrough-4-train-and-evaluate-models.md)
5.	**Deploy the Web service**
6.	[Access the Web service](machine-learning-walkthrough-6-access-web-service.md)

----------

To give others a chance to use the predictive model we've developed in this walkthrough, we deploy it as a Web service on Azure.

Up to this point we've been experimenting with training our model. But the deployed service is no longer going to do training - it generates predictions by scoring the user's input based on our model. So we're going to do some preparation to convert this experiment from a ***training*** experiment to a ***predictive*** experiment. 

This is a two-step process:  

1. Convert the *training experiment* we've created into a *predictive experiment*
2. Deploy the predictive experiment as a Web service

But first, we need to trim this experiment down a little. We currently have two different models in the experiment, but we only want one model when we deploy this as a Web service.  

Let's say we've decided that the boosted tree model was the better model to use. So the first thing to do is remove the [Two-Class Support Vector Machine][two-class-support-vector-machine] module and the modules that were used for training it. You may want to make a copy of the experiment first by clicking **Save As** at the bottom of the experiment canvas.

We need to delete the following modules:  

- [Two-Class Support Vector Machine][two-class-support-vector-machine]
- [Train Model][train-model] and [Score Model][score-model] modules that were connected to it
- [Normalize Data][normalize-data] (both of them)
- [Evaluate Model][evaluate-model]

Select the module and press the Delete key, or right-click the module and select **Delete**.

Now we're ready to deploy this model using the [Two-Class Boosted Decision Tree][two-class-boosted-decision-tree].

## Convert the training experiment to a predictive experiment

Converting to a predictive experiment involves three steps:

1. Save the model we've trained and then replace our training modules
2. Trim the experiment to remove modules that were only needed for training
3. Define where the Web service will accept input and where it generates the output

Fortunately, all three steps can be accomplished by clicking **Set Up Web service** at the bottom of the experiment canvas (select the **Predictive Web service** option).

When you click **Set Up Web service**, several things happen:

- The trained model is saved as a single **Trained Model** module into the module palette to the left of the experiment canvas (you can find it under **Trained Models**).
- Modules that were used for training are removed. Specifically:
  - [Two-Class Boosted Decision Tree][two-class-boosted-decision-tree]
  - [Train Model][train-model]
  - [Split Data][split]
  - the second [Execute R Script][execute-r-script] module that was used for test data
- The saved trained model is added back into the experiment.
- **Web service input** and **Web service output** modules are added.

> [AZURE.NOTE] The experiment has been saved in two parts under tabs that have been added at the top of the experiment canvas: the original training experiment is under the tab **Training experiment**, and the newly created predictive experiment is under **Predictive experiment**.

We need to take one additional step with this particular experiment.
We added two [Execute R Script][execute-r-script] modules to provide a weighting function to the data for training and testing. We don't need to do that in the final model.

Machine Learning Studio removed one [Execute R Script][execute-r-script] module when it removed the [Split][split] module. Now we can now remove the other and connect [Metadata Editor][metadata-editor] directly to [Score Model][score-model].    

Our experiment should now look like this:  

![Scoring the trained model][4]  

> [AZURE.NOTE] You may be wondering why we left the UCI German Credit Card Data dataset in the predictive experiment. The service is going to use the user's data, not the original dataset, so why leave the original dataset in the model?
>
>It's true that the service doesn't need the original credit card data. But it does need the schema for that data, which includes information such as how many columns there are and which columns are numeric. This schema information is necessary to interpret the user's data. We leave these components connected so that the scoring module has the dataset schema when the service is running. The data isn't used, just the schema.  

Run the experiment one last time (click **Run**.) If you want to verify that the model is still working, click the output of the [Score Model][score-model] module and select **View Results**. You'll see that the original data is displayed, along with the credit risk value ("Scored Labels") and the scoring probability value ("Scored Probabilities".) 

## Deploy the Web service

You can deploy the experiment as either a classic Web service or a new Web service based on Azure Resource Manager.

### Deploy as a classic Web service ###

To deploy a classic Web service derived from our experiment, click **Deploy Web Service** below the canvas and select **Deploy Web Service [Classic]**. Machine Learning Studio deploys the experiment as a Web service and takes you to the dashboard for that Web service. From here, you can return to the experiment (**View snapshot** or **View latest**) and run a simple test of the Web service (See **Test the Web service** below). There is also information here for creating applications that can access the Web service (more on that in the next step of this walkthrough).

![Web service dashboard][6]

You can configure the service by clicking the **CONFIGURATION** tab. Here you can modify the service name (it's given the experiment name by default) and give it a description. You can also give more friendly labels for the input and output columns.  

![Configure the Web service][5]  

### Deploy as a New Web service

To deploy a New Web service derived from our experiment, click **Deploy Web Service** below the canvas and **Deploy Web Service [New]**. Machine Learning Studio transfers you to the Azure Machine Learning Web services Deploy Experiment page.

Enter a name for the Web service and select a pricing plan. If you have an existing pricing plan you can select it, otherwise you must create a new price plan for the service. 

1.	In the **Price Plan** dropdown, select an existing plan or select the **Select new plan** option.
2.	In **Plan Name**, type a name that identifies the plan on your bill.
3.	Select one of the **Monthly Plan Tiers**. The plan tiers default to the plans for your default region and your Web service is deployed to that region.

Click **Deploy** and the **Quickstart** page for your Web service opens.

You can configure the service by clicking the **Configure** menu option. Here you can modify the service name (it's given the experiment name by default) and give it a description. 

To test the Web service select, click the **Test** menu option (see **Test the Web service** below). For information on creating applications that can access the Web service, click the **Consume** menu option (more on that in the next step of this walkthrough).

> [AZURE.TIP] You can update the Web service after you've deployed it. For example, if you want to change your model, edit the training experiment, tweak the model parameters, and click **Deploy Web Service**. Then select **Deploy Web Service [Classic]** or **Deploy Web Service [New]**. When you deploy the experiment again, it replaces the Web service, now using your updated model.  

## Test the Web service

### Test a classic Web service

You can test the service in Machine Learning Studio or in the Azure Machine Learning Web Services portal. Testing in the Azure Machine Learning Web Services portal has the advantage of allowing you to enable 

**Test in Machine Learning Studio**

On the **DASHBOARD** page, click the **Test** button under **Default Endpoint**. A dialog will pop up and ask you for the input data for the service. These are the same columns that appeared in the original German credit risk dataset.  

Enter a set of data and then click **OK**. 

**Test in the Azure Machine Learning Web Services portal**

On the **DASHBOARD** page, click the **Test** preview link under **Default Endpoint**. The test page in the Azure Machine Learning Web Services portal for the Web service endpoint opens and asks you for the input data for the service. These are the same columns that appeared in the original German credit risk dataset.

Click **Test Request-Response**. 

In the Web service, the data enters through the **Web service input** module, through the [Metadata Editor][metadata-editor] module, and to the [Score Model][score-model] module where it's scored. The results are then output from the Web service through the **Web service output**.

**Test a new Web service**

In the Azure Machine Learning Web services portal, click **Test** at the top of the page. The **Test** page opens and you can input data for the service. The input fields displayed correspond to the columns that appeared in the original German credit risk dataset. 

Enter a set of data and then click **Test Request-Response**.

The results of the test will display on the right hand side of the page in the output column. 

When testing in the Azure Machine Learning Web Services portal, you can enable sample data that you can use to test the Request-Response service. If you created the Web service in Machine Learning Studio, the sample data is taken from the data your used to train your model.

> [AZURE.TIP] The way we have the predictive experiment configured, the entire results from the [Score Model][score-model] module are returned. This includes all the input data plus the credit risk value and the scoring probability. If you wanted to return something different - for example, only the credit risk value - then you could insert a [Project Columns][project-columns] module between [Score Model][score-model] and the **Web service output** to eliminate columns you don't want the Web service to return. 

## Manage the Web service

**Manage a Classic Web service**

Once you've deployed your Classic Web service, you can manage it from the [Azure classic portal](https://manage.windowsazure.com).

1. Sign in to the [Azure classic portal](https://manage.windowsazure.com).
2. In the Microsoft Azure services panel, click **MACHINE LEARNING**.
3. Click your workspace.
4. Click the **Web serviceS** tab.
5. Click the Web service we created.
6. Click the "default" endpoint.

From here, you can do things like monitor how the Web service is doing and make performance tweaks by changing how many concurrent calls the service can handle.
You can even publish your Web service in the Azure Marketplace.

For more details, see:

- [Creating Endpoints](machine-learning-create-endpoint.md)
- [Scaling Web service](machine-learning-scaling-webservice.md)
- [Publish Azure Machine Learning Web service to the Azure Marketplace](machine-learning-publish-web-service-to-azure-marketplace.md)

**Manage a Web service in the Azure Machine Learning Web Services portal**

Once you've deployed your Web service, Classic or New, you can manage it from the [Azure Machine Learning Web services portal](https://servics.azureml.net).

To monitor the performance of your Web service:

1. Sign in to the [Azure Machine Learning Web services portal](https://servics.azureml.net).
2. Click **Web services**.
3. Click your Web service.
4. Click the **Dashboard**.

----------

**Next: [Access the Web service](machine-learning-walkthrough-6-access-web-service.md)**

[1]: ./media/machine-learning-walkthrough-5-publish-web-service/publish1.png
[2]: ./media/machine-learning-walkthrough-5-publish-web-service/publish2.png
[3]: ./media/machine-learning-walkthrough-5-publish-web-service/publish3.png
[4]: ./media/machine-learning-walkthrough-5-publish-web-service/publish4.png
[5]: ./media/machine-learning-walkthrough-5-publish-web-service/publish5.png
[6]: ./media/machine-learning-walkthrough-5-publish-web-service/publish6.png


<!-- Module References -->
[evaluate-model]: https://msdn.microsoft.com/library/azure/927d65ac-3b50-4694-9903-20f6c1672089/
[execute-r-script]: https://msdn.microsoft.com/library/azure/30806023-392b-42e0-94d6-6b775a6e0fd5/
[metadata-editor]: https://msdn.microsoft.com/library/azure/370b6676-c11c-486f-bf73-35349f842a66/
[normalize-data]: https://msdn.microsoft.com/library/azure/986df333-6748-4b85-923d-871df70d6aaf/
[score-model]: https://msdn.microsoft.com/library/azure/401b4f92-e724-4d5a-be81-d5b0ff9bdb33/
[split]: https://msdn.microsoft.com/library/azure/70530644-c97a-4ab6-85f7-88bf30a8be5f/
[train-model]: https://msdn.microsoft.com/library/azure/5cc7053e-aa30-450d-96c0-dae4be720977/
[two-class-boosted-decision-tree]: https://msdn.microsoft.com/library/azure/e3c522f8-53d9-4829-8ea4-5c6a6b75330c/
[two-class-support-vector-machine]: https://msdn.microsoft.com/library/azure/12d8479b-74b4-4e67-b8de-d32867380e20/
[project-columns]: https://msdn.microsoft.com/en-us/library/azure/1ec722fa-b623-4e26-a44e-a50c6d726223/
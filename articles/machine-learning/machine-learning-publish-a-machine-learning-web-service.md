<properties
	pageTitle="Deploy a Machine Learning web service | Microsoft Azure"
	description="How to convert a training experiment to a predictive experiment, prepare it for deployment, then deploy it as an Azure Machine Learning web service."
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

# Deploy an Azure Machine Learning web service

Azure Machine Learning enables you to build, test, and deploy predictive analytics solutions.

From a high-level point-of-view, this is done in three steps:

- **[Create a training experiment]** - Azure Machine Learning Studio is a collaborative visual development environment that you use to train and test a predictive analytics model using training data that you supply.
- **[Convert it to a predictive experiment]** - Once your model has been trained with existing data and you're ready to use it to score new data, you prepare and streamline your experiment for predictions.
- **Deploy it as a web service** - You can deploy your predictive experiment as a [new] or [classic] Azure web service. Users can send data to your model and receive your model's predictions.

[AZURE.INCLUDE [machine-learning-free-trial](../../includes/machine-learning-free-trial.md)]

## Create a training experiment

To train a predictive analytics model, you use Azure Machine Learning Studio to create a training experiment where you include various modules to load training data, prepare the data as necessary, apply machine learning algorithms, and evaluate the results. You can iterate on an experiment and try different machine learning algorithms to compare and evaluate the results.

The process of creating and managing training experiments is covered more thoroughly elsewhere - see these articles for more information and examples:

- [Create a simple experiment in Azure Machine Learning Studio](machine-learning-create-experiment.md)
- [Develop a predictive solution with Azure Machine Learning](machine-learning-walkthrough-develop-predictive-solution.md)
- [Import your training data into Azure Machine Learning Studio](machine-learning-data-science-import-data.md)
- [Manage experiment iterations in Azure Machine Learning Studio](machine-learning-manage-experiment-iterations.md)

## Convert the training experiment to a predictive experiment

Once you've trained your model, you're ready to use it to score new data. To do this, you convert your training experiment into a predictive experiment.

By converting to a predictive experiment, you're getting your trained model ready to be deployed as a scoring web service. Users of the web service will send input data to your model and your model will send back the prediction results. So as you convert to a predictive experiment you will want to keep in mind how you expect your model to be used by others.

To convert your training experiment to a predictive experiment, click **Run** at the bottom of the experiment canvas, click **Set Up Web Service**, then select **Predictive Web Service**.

![Convert to scoring experiment](./media/machine-learning-publish-a-machine-learning-web-service/figure-1.png)

For more details on how to perform this conversion, see [Convert a Machine Learning training experiment to a predictive experiment](machine-learning-convert-training-experiment-to-scoring-experiment.md).

The following steps show how to deploy your predictive experiment as new new

The following steps describe deploying a predictive experiment as a [new] web web service. You can also deploy the experiment as [classic] web service.

## Deploy the predictive experiment as a new web service

Now that the predictive experiment has been sufficiently prepared, you can deploy it as an Azure web service. Using the web service, users can send data to your model and the model will return its predictions.

To deploy your predictive experiment, click **Run** at the bottom of the experiment canvas. Once the experiment has finished running, click **Deploy Web Service** and select **Deploy Web Service [New]**.  The deployment page of the Machine Learning Web Service portal will open. 

### Machine Learning Web Service Portal Deploy Experiment Page
On the Deploy Experiment page, enter a name for the web service.
Select a pricing plan. If you have an existing pricing plan you can select it, otherwise you must create a new price plan for the service. 

1.	In the **Price Plan** drop down, select an existing plan or select the **Select new plan** option.
2.	In **Plan Name**, type a name that will identify the plan on your bill.
3.	Select one of the **Monthly Plan Tiers**. Note that the plan tiers default to the plans for your default region and your web service is deployed to that region.

Click **Deploy** and the **Quickstart** page for your web service opens.

The web service Quickstart page gives you access and guidance on the most common tasks you will perform after creating a new web service. From here you can easily access both the Test page and Consume page.

<!-- ![Deploy the web service](./media/machine-learning-publish-a-machine-learning-web-service/figure-2.png)-->

### Testing your web service

To test your new web service, click **Test web service** under common tasks. On the Test page you can test your web service as a Request-Response Service (RRS) or a Batch Execution service (BES). 

The RRS test page displays the inputs, outputs, and any global parameters that you have defined for the experiment. To test the web service you can manually enter appropriate values for the inputs or supply a comma separated value  (CSV) formatted file containing the test values. 

To test using RRS, from the list view mode, enter appropriate values for the inputs and click **Test Request-Response**. Your prediction results will display in the output column to the left.

![Deploy the web service](./media/machine-learning-publish-a-machine-learning-web-service/figure-5-test-request-response.png)

To test your BES, click **Batch**. On the Batch test page, click Browse under your input and select a CSV file containing appropriate sample values. If you don't have a CSV files, and you have created your predictive experiment using Machine Learning Studio, you can download the data set for your predictive experiment and use it.

To download the data set, open Machine Learning Studio. Open your predictive experiment and right click on the input for your experiment. From the context menu, select **dataset** and then select **Download**. 

![Deploy the web service](./media/machine-learning-publish-a-machine-learning-web-service/figure-7-mls-download.png)

Click **Test**. The status of your Batch Execution job will display to the right under **Test Batch Jobs**.

![Deploy the web service](./media/machine-learning-publish-a-machine-learning-web-service/figure-6-test-batch-execution.png)

<!--![Test the web service](./media/machine-learning-publish-a-machine-learning-web-service/figure-3.png)-->

On the **CONFIGURATION** page you can change the description, title, update the storage account key, and enable sample data for your web service.

![Configure the web service](./media/machine-learning-publish-a-machine-learning-web-service/figure-8-arm-configure.png)

Once you've deployed the web service, you can:

- **Access** it through the web service API.
- **Manage** it through Azure Machine Learning web services portal or the Azure classic portal. 
- **Update** it if your model changes.

### Access the web service

Once you deploy your web service from Machine Learning Studio, you can send data to the service and receive responses programmatically.

The **Consume** page provides all the information you need to access your web service. For example, the API key is provided to allow authorized access to the service. 

For more information about accessing a Machine Learning web service, see [How to consume a deployed Azure Machine Learning web service](machine-learning-consume-web-services.md).

### Manage your new web service

You can manage your classic web services Machine Learning Web Services portal. From the [main portal page](https://services.azureml-test.net/) click **Web Services**. From the web services page, you can delete or copy a service. To monitor a specific service, click the service and then click **Dashboard**. To monitor batch jobs associated with the web service, click **Batch Request Log**.

## Deploy the predictive experiment as a classic web service

Now that the predictive experiment has been sufficiently prepared, you can deploy it as an Azure web service. Using the web service, users can send data to your model and the model will return its predictions.

To deploy your predictive experiment, click **Run** at the bottom of the experiment canvas and then click **Deploy Web Service**. The web service is set up and you are placed in the web service dashboard.

![Deploy the web service](./media/machine-learning-publish-a-machine-learning-web-service/figure-2.png)

To test the web service, click the **Test** link in the web service dashboard. A dialog pops up to ask you for the input data for the service. These are the columns expected by the scoring experiment. Enter a set of data and then click **OK**. The results generated by the web service are displayed at the bottom of the dashboard.

![Test the web service](./media/machine-learning-publish-a-machine-learning-web-service/figure-3.png)

On the **CONFIGURATION** tab you can change the display name of the service and give it a description. The name and description is displayed in the [Azure classic portal](http://manage.windowsazure.com/) where you manage your web services.

You can provide a description for your input data, output data, and web service parameters by entering a string for each column under **INPUT SCHEMA**, **OUTPUT SCHEMA**, and **WEB SERVICE PARAMETER**. These descriptions are used in the sample code documentation provided for the web service.
You can also enable logging to diagnose any failures that you're seeing when your web service is accessed.

For more information, see [Enable logging for Machine Learning web services](machine-learning-web-services-logging.md).

![Configure the web service](./media/machine-learning-publish-a-machine-learning-web-service/figure-4.png)

### Access the web service

Once you deploy your web service from Machine Learning Studio, you can send data to the service and receive responses programmatically.

The dashboard provides all the information you need to access your web service. For example, the API key is provided to allow authorized access to the service, and API help pages are provided to help you get started writing your code.

For more information about accessing a Machine Learning web service, see [How to consume a deployed Azure Machine Learning web service](machine-learning-consume-web-services.md).

### Manage the web service in the Azure classic portal

In the [Azure classic portal](http://manage.windowsazure.com/), you can manage your web services by clicking the **Machine Learning** service, opening your Machine Learning work space, and then opening the web service from the **WEB SERVICES** tab. From this page you can monitor the web service, update it, and delete it. You can also add a second endpoint for your web service in addition to the default endpoint that is created when you deploy it.

For more information, see [Manage an Azure Machine Learning workspace](machine-learning-manage-workspace.md).
<!-- When this article gets published, fix the link and uncomment
For more information on how to manage Azure Machine Learning web service endpoints using the REST API, see **Azure machine learning web service endpoints**.
-->

## Update the web service

You can make changes to your web service, such as updating the model with additional training data, and deploy it again, overwriting the original web service.

To update the web service, open the original predictive experiment you used to deploy the  web service and make an editable copy by clicking **SAVE AS**. Make your changes and then click **Deploy Web Service**. 

Because you've deployed this experiment before, you are asked if you want to overwrite (Classic Web Service) or update (New web service) the existing service. Clicking **YES** or **Update** stops the existing web service and deploys the new predictive experiment is deployed in its place.

> [AZURE.NOTE] If you made configuration changes in the original web service, for example, entering a new display name or description, you will need to enter those values again.

One option for updating your web service is to retrain the model programmatically. For more information, see [Retrain Machine Learning models programmatically](machine-learning-retrain-models-programmatically.md).


<!-- internal links -->
[Create a training experiment]: #create-a-training-experiment
[Convert it to a predictive experiment]: #convert-the-training-experiment-to-a-predictive-experiment
[new]: #deploy-the-predictive-experiment-as-a-new-web-service
[classic]: #deploy-the-predictive-experiment-as-a-new-web-service
[Access]: #access-the-web-service
[Manage]: #manage-the-web-service-in-the-azure-management-portal
[Update]: #update-the-web-service

---
title: Deploy a Machine Learning Studio web service
titleSuffix: Azure Machine Learning Studio
description: How to convert a training experiment to a predictive experiment, prepare it for deployment, then deploy it as an Azure Machine Learning Studio web service.
services: machine-learning
ms.service: machine-learning
ms.subservice: studio
ms.topic: conceptual

author: xiaoharper
ms.author: amlstudiodocs
ms.custom: previous-ms.author=yahajiza, previous-author=YasinMSFT
ms.date: 01/06/2017
---
# Deploy an Azure Machine Learning Studio web service

Azure Machine Learning Studio enables you to build and test a predictive analytic solution. Then you can deploy the solution as a web service.

Machine Learning Studio web services provide an interface between an application and a Machine Learning Studio workflow scoring model. An external application can communicate with a Machine Learning Studio workflow scoring model in real time. A call to a Machine Learning Studio web service returns prediction results to an external application. To make a call to a web service, you pass an API key that was created when you deployed the web service. A Machine Learning Studio web service is based on REST, a popular architecture choice for web programming projects.

Azure Machine Learning Studio has two types of web services:

* Request-Response Service (RRS): A low latency, highly scalable service that scores a single data record.
* Batch Execution Service (BES): An asynchronous service that scores a batch of data records.

The input for BES is like data input that RRS uses. The main difference is that BES reads a block of records from a variety of sources, such as Azure Blob storage, Azure Table storage, Azure SQL Database, HDInsight (hive query), and HTTP sources.

From a high-level point-of-view, you deploy your model in three steps:

* **[Create a training experiment]** - In Studio, you can train and test a predictive analytics model using training data that you supply, using a large set of built-in machine learning algorithms.
* **[Convert it to a predictive experiment]** - Once your model has been trained with existing data and you're ready to use it to score new data, you prepare and streamline your experiment for predictions.
* **Deploy** it as a **[New web service]** or a **[Classic web service]** - When you deploy your predictive experiment as an Azure web service, users can send data to your model and receive your model's predictions.

## Create a training experiment

To train a predictive analytics model, you use Azure Machine Learning Studio to create a training experiment where you include various modules to load training data, prepare the data as necessary, apply machine learning algorithms, and evaluate the results. You can iterate on an experiment and try different machine learning algorithms to compare and evaluate the results.

The process of creating and managing training experiments is covered more thoroughly elsewhere. For more information, see these articles:

* [Create a simple experiment in Azure Machine Learning Studio](create-experiment.md)
* [Develop a predictive solution with Azure Machine Learning Studio](tutorial-part1-credit-risk.md)
* [Import your training data into Azure Machine Learning Studio](import-data.md)
* [Manage experiment iterations in Azure Machine Learning Studio](manage-experiment-iterations.md)

## Convert the training experiment to a predictive experiment

Once you've trained your model, you're ready to convert your training experiment into a predictive experiment to score new data.

By converting to a predictive experiment, you're getting your trained model ready to be deployed as a scoring web service. Users of the web service can send input data to your model and your model will send back the prediction results. As you convert to a predictive experiment, keep in mind how you expect your model to be used by others.

To convert your training experiment to a predictive experiment, click **Run** at the bottom of the experiment canvas, click **Set Up Web Service**, then select **Predictive Web Service**.

![Convert to scoring experiment](./media/publish-a-machine-learning-web-service/figure-1.png)

For more information on how to perform this conversion, see [How to prepare your model for deployment in Azure Machine Learning Studio](convert-training-experiment-to-scoring-experiment.md).

The following steps describe deploying a predictive experiment as a New web service. You can also deploy the experiment as Classic web service.

## Deploy it as a New web service

Now that the predictive experiment has been prepared, you can deploy it as a new (Resource Manager-based) Azure web service. Using the web service, users can send data to your model and the model will return its predictions.

To deploy your predictive experiment, click **Run** at the bottom of the experiment canvas. Once the experiment has finished running, click **Deploy Web Service** and select **Deploy Web Service [New]**.  The deployment page of the Machine Learning Studio Web Service portal opens.

> [!NOTE] 
> To deploy a New web service you must have sufficient permissions in the subscription to which you deploying the web service. For more information see, [Manage a Web service using the Azure Machine Learning Web Services portal](manage-new-webservice.md). 

### Machine Learning Studio Web Service portal Deploy Experiment Page

On the Deploy Experiment page, enter a name for the web service.
Select a pricing plan. If you have an existing pricing plan you can select it, otherwise you must create a new price plan for the service.

1. In the **Price Plan** drop down, select an existing plan or select the **Select new plan** option.
2. In **Plan Name**, type a name that will identify the plan on your bill.
3. Select one of the **Monthly Plan Tiers**. The plan tiers default to the plans for your default region and your web service is deployed to that region.

Click **Deploy** and the **Quickstart** page for your web service opens.

The web service Quickstart page gives you access and guidance on the most common tasks you will perform after creating a web service. From here, you can easily access both the Test page and Consume page.

<!-- ![Deploy the web service](./media/publish-a-machine-learning-web-service/figure-2.png)-->

### Test your New web service

To test your new web service, click **Test web service** under common tasks. On the Test page, you can test your web service as a Request-Response Service (RRS) or a Batch Execution service (BES).

The RRS test page displays the inputs, outputs, and any global parameters that you have defined for the experiment. To test the web service, you can manually enter appropriate values for the inputs or supply a comma separated value (CSV) formatted file containing the test values.

To test using RRS, from the list view mode, enter appropriate values for the inputs and click **Test Request-Response**. Your prediction results  display in the output column to the left.

![Enter appropriate values to test your web service](./media/publish-a-machine-learning-web-service/figure-5-test-request-response.png)

To test your BES, click **Batch**. On the Batch test page, click Browse under your input and select a CSV file containing appropriate sample values. If you don't have a CSV file, and you created your predictive experiment using Machine Learning Studio, you can download the data set for your predictive experiment and use it.

To download the data set, open Machine Learning Studio. Open your predictive experiment and right click the input for your experiment. From the context menu, select **dataset** and then select **Download**.

![Download your data set from the Studio canvas](./media/publish-a-machine-learning-web-service/figure-7-mls-download.png)

Click **Test**. The status of your Batch Execution job displays to the right under **Test Batch Jobs**.

![Test your Batch Execution job with the web service portal](./media/publish-a-machine-learning-web-service/figure-6-test-batch-execution.png)

<!--![Test the web service](./media/publish-a-machine-learning-web-service/figure-3.png)-->

On the **CONFIGURATION** page, you can change the description, title, update the storage account key, and enable sample data for your web service.

![Configure your web service](./media/publish-a-machine-learning-web-service/figure-8-arm-configure.png)

### Access your New web service

Once you deploy your web service from Machine Learning Studio, you can send data to the service and receive responses programmatically.

The **Consume** page provides all the information you need to access your web service. For example, the API key is provided to allow authorized access to the service.

For more information about accessing a Machine Learning Studio web service, see [How to consume an Azure Machine Learning Studio Web service](consume-web-services.md).

### Manage your New web service

You can manage your New web services Machine Learning Studio Web Services portal. From the [main portal page](https://services.azureml-test.net/), click **Web Services**. From the web services page, you can delete or copy a service. To monitor a specific service, click the service and then click **Dashboard**. To monitor batch jobs associated with the web service, click **Batch Request Log**.

### <a id="multi-region"></a> Deploy your New web service to multiple regions

You can easily deploy a New web service to multiple regions without needing multiple subscriptions or workspaces.

Pricing is region specific, so you need to define a billing plan for each region in which you will deploy the web service.

#### Create a plan in another region

1. Sign in to [Microsoft Azure Machine Learning Web Services](https://services.azureml.net/).
2. Click the **Plans** menu option.
3. On the Plans over view page, click **New**.
4. From the **Subscription** dropdown, select the subscription in which the new plan will reside.
5. From the **Region** dropdown, select a region for the new plan. The Plan Options for the selected region will display in the **Plan Options** section of the page.
6. From the **Resource Group** dropdown, select a resource group for the plan. From more information on resource groups, see [Azure Resource Manager overview](../../azure-resource-manager/resource-group-overview.md).
7. In **Plan Name** type the name of the plan.
8. Under **Plan Options**, click the billing level for the new plan.
9. Click **Create**.

#### Deploy the web service to another region

1. On the Microsoft Azure Machine Learning Web Services page, click the **Web Services** menu option.
2. Select the Web Service you are deploying to a new region.
3. Click **Copy**.
4. In **Web Service Name**, type a new name for the web service.
5. In **Web service description**, type a description for the web service.
6. From the **Subscription** dropdown, select the subscription in which the new web service will reside.
7. From the **Resource Group** dropdown, select a resource group for the web service. From more information on resource groups, see [Azure Resource Manager overview](../../azure-resource-manager/resource-group-overview.md).
8. From the **Region** dropdown, select the region in which to deploy the web service.
9. From the **Storage account** dropdown, select a storage account in which to store the web service.
10. From the **Price Plan** dropdown, select a plan in the region you selected in step 8.
11. Click **Copy**.

## Deploy it as a Classic web service

Now that the predictive experiment has been sufficiently prepared, you can deploy it as a Classic Azure web service. Using the web service, users can send data to your model and the model will return its predictions.

To deploy your predictive experiment, click **Run** at the bottom of the experiment canvas and then click **Deploy Web Service**. The web service is set up and you are placed in the web service dashboard.

![Deploy your web service from Studio](./media/publish-a-machine-learning-web-service/figure-2.png)

### Test your Classic web service

You can test the web service in either the Machine Learning Studio Web Services portal or Machine Learning Studio.

To test the Request Response web service, click the **Test** button in the web service dashboard. A dialog pops up to ask you for the input data for the service. These are the columns expected by the scoring experiment. Enter a set of data and then click **OK**. The results generated by the web service are displayed at the bottom of the dashboard.

You can click the **Test** preview link to test your service in the Azure Machine Learning Studio Web Services portal as shown previously in the New web service section.

To test the Batch Execution Service, click **Test** preview link . On the Batch test page, click Browse under your input and select a CSV file containing appropriate sample values. If you don't have a CSV file, and you created your predictive experiment using Machine Learning Studio, you can download the data set for your predictive experiment and use it.

![Test the web service](./media/publish-a-machine-learning-web-service/figure-3.png)

On the **CONFIGURATION** page, you can change the display name of the service and give it a description. The name and description is displayed in the [Azure portal](https://portal.azure.com/) where you manage your web services.

You can provide a description for your input data, output data, and web service parameters by entering a string for each column under **INPUT SCHEMA**, **OUTPUT SCHEMA**, and **Web SERVICE PARAMETER**. These descriptions are used in the sample code documentation provided for the web service.

You can enable logging to diagnose any failures that you're seeing when your web service is accessed. For more information, see [Enable logging for Machine Learning Studio web services](web-services-logging.md).

![Enable logging in the web services portal](./media/publish-a-machine-learning-web-service/figure-4.png)

You can also configure the endpoints for the web service in the Azure Machine Learning Web Services portal similar to the procedure shown previously in the New web service section. The options are different, you can add or change the service description, enable logging, and enable sample data for testing.

### Access your Classic web service

Once you deploy your web service from Machine Learning Studio, you can send data to the service and receive responses programmatically.

The dashboard provides all the information you need to access your web service. For example, the API key is provided to allow authorized access to the service, and API help pages are provided to help you get started writing your code.

For more information about accessing a Machine Learning Studio web service, see [How to consume an Azure Machine Learning Studio Web service](consume-web-services.md).

### Manage your Classic web service

There are various of actions you can perform to monitor a web service. You can update it, and delete it. You can also add additional endpoints to a Classic web service in addition to the default endpoint that is created when you deploy it.

For more information, see [Manage an Azure Machine Learning Studio workspace](manage-workspace.md) and [Manage a web service using the Azure Machine Learning Studio Web Services portal](manage-new-webservice.md).

## Update the web service
You can make changes to your web service, such as updating the model with additional training data, and deploy it again, overwriting the original web service.

To update the web service, open the original predictive experiment you used to deploy the web service and make an editable copy by clicking **SAVE AS**. Make your changes and then click **Deploy Web Service**.

Because you've deployed this experiment before, you are asked if you want to overwrite (Classic Web Service) or update (New web service) the existing service. Clicking **YES** or **Update** stops the existing web service and deploys the new predictive experiment is deployed in its place.

> [!NOTE]
> If you made configuration changes in the original web service, for example, entering a new display name or description, you will need to enter those values again.

One option for updating your web service is to retrain the model programmatically. For more information, see [Retrain Machine Learning Studio models programmatically](/azure/machine-learning/studio/retrain-machine-learning-model).

## Next steps

* For more technical details on how deployment works, see [How a Machine Learning Studio model progresses from an experiment to an operationalized Web service](model-progression-experiment-to-web-service.md).

* For details on how to get your model ready to deploy, see [How to prepare your model for deployment in Azure Machine Learning Studio](convert-training-experiment-to-scoring-experiment.md).

* There are several ways to consume the REST API and access the web service. See [How to consume an Azure Machine Learning Studio web service](consume-web-services.md).

<!-- internal links -->
[Create a training experiment]: #create-a-training-experiment
[Convert it to a predictive experiment]: #convert-the-training-experiment-to-a-predictive-experiment
[New web service]: #deploy-it-as-a-new-web-service
[Classic web service]: #deploy-it-as-a-classic-web-service
[new]: #deploy-it-as-a-new-web-service
[classic]: #deploy-the-predictive-experiment-as-a-classic-web-service
[Access]: #access-the-Web-service
[Manage]: #manage-the-Web-service-in-the-azure-management-portal
[Update]: #update-the-Web-service

<properties
	pageTitle="Manage a New Machine Learning Web Service | Microsoft Azure"
	description="Manage access to Azure Machine Learning workspaces, and deploy and manage ML API web services"
	services="machine-learning"
	documentationCenter=""
	authors="vDonGlover"
	manager="paulettm"
	editor="cgronlun"/>

<tags
	ms.service="machine-learning"
	ms.workload="data-services"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="07/06/2016"
	ms.author="v-donglo"/>


# Manage a New Machine Learning Web Service

> [AZURE.NOTE] The procedures in this article are relevant to Azure Machine Learning new web services. For information on managing classic web services, see [Manage an Azure Machine Learning workspace](machine-learning-manage-workspace.md).

Using the Microsoft Azure Machine Learning Web Services portal, you can manage your New Machine Learning web services. You can:

- Monitor how the web service is being used.
- Configure the description, update the keys for the web service, update your storage account key, and enable or disable sample data.
- Delete the web service.
- Create, delete, or update billing plans.

[AZURE.INCLUDE [machine-learning-free-trial](../../includes/machine-learning-free-trial.md)]

> [AZURE.TIP] In Azure Machine Learning Studio, on the **WEB SERVICES** tab, you can add, update, or delete a Machine Learning web service.

To manage your web services:

1.	Sign-in to the [Microsoft Azure Machine Learning Web Service portal](https://services.azureml.net/quickstart) using your Microsoft Azure account - use the account that's associated with the Azure subscription.
2.	On the menu, click **Web Services**.

This displays a list of deployed web services for your subscription.
To manage a web service, click the name in the list to open the web service page.

From the Web Services page you can:

- Click on the web service to manage it.
- Click on the Billing Plan for the web service to update it.
- Delete a web service.
- Copy a web service to another region.
- Copy a web service and deploy it to another region.

When you click on a web service, the web service Quickstart page opens. The web service Quickstart page has two menu option that allow you to manage your web service:

- **DASHBOARD** - Allows you to view web service usage.
- **CONFIGURE** - Allows you to add descriptive text, turn error logging on and off, update the key for the storage account associated with the web service, and enable and disable sample data.

## Monitoring how the web service is being used

Click the **DASHBOARD** tab.

From the dashboard you can view overall usage of your web service over a period of time. You can select the period to view from the Period dropdown menu in the upper right of the usage charts. The dashboard shows the following information:

- **Requests Over Time** displays a step graph of the number of requests over the selected time period. It can help identify if you are experiencing spikes in usage.
- **Request-Response Requests** displays the total number of Request-Response calls the service has received over the selected time period and how many of them failed.
- **Average Request-Response Compute Time** displays an average of the time  needed to execute the received requests.
- **Batch Requests** displays the total number of Batch Requests the service has received over the selected time period and how many of them failed.
- **Average Job Latency** displays an average of the time needed to execute the received requests.
- **Errors** displays the aggregate number of errors that have occurred on calls to the the web service.
- **Services Costs** displays the charges for the billing plan associated with the service.

## Configuring the web service ##

Click the **CONFIGURE** menu option.

You can update the following properties:

* **Description** allows you to enter a description for the web service.
* **Title** allows you to enter a title for the web service
* **Keys** allows you to rotate your primary and secondary API keys.
* **Storage account key** allows you to update the key for the storage account associated with the web service changes. 
* **Enable Sample data** allows you to provide sample data that you can use to test the your Request-Response service. If you created the web service in Machine Learning Studio, the sample data is taken from the data your used to train your model. If you created the service programatically, the data is taken from the example data you provided as part of the JSON package.

## Managing billing plans

Click the **Plans** menu option from the web services Quickstart page. You can also click the plan associated with specific web service to manage that plan.

* **New** allows you to create a new plan.
* **Add/Remove Plan instance** allows you to "scale out" an existing plan to add capacity.
* **Upgrade/DownGrade** allows you to "scale up" an existing plan to add capacity.
* **Delete** allows you to delete a plan.

Click on a plan to view its dashboard. The dashboard gives you snapshot or plan usage over a selected period of time. Click the **Period** dropdown at the upper right of dashboard information to select the time period.

The plan dashboard provides the following information:

* **Plan Description** displays information about the costs and capacity associated with the plan.
* **Plan Usage** displays the number of transactions and compute hours that have been charged against the plan.
* **Web Services** displays the number of web services that are using this plan.
* **Top Web Service By Calls** displays the the top four web services that are making calls that are charged against the plan.
* **Top Web Services by Compute Hrs** displays the the top four web services that are using compute resources that are charged against the plan.

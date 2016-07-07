<properties
	pageTitle="How to deploy a Web Service to multiple regions | Microsoft Azure"
	description="Steps to deploy (Copy) a New Web Service to other regions."
	services="machine-learning"
	documentationCenter=""
	authors="vDonGlover"
	manager="raymondl"
	editor="cgronlun"/>

<tags
	ms.service="machine-learning"
	ms.workload="data-services"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="07/06/2016"
	ms.author="v-donglo"/>

# How to deploy a Web Service to multiple regions

The New Azure Web Services allow you to easily deploy a web service to multiple regions without needing multiple subscriptions or workspaces. 

Pricing is region specific, therefore you must define a billing plan for each region in which you will deploy the web service.

## To create a plan in another region

1. Sign into [Microsoft Azure Machine Learning Web Services](https://services.azureml.net/).
2. Click the **Plans** menu option.
3. On the Plans over view page, click **New**.
4. From the **Subscription** dropdown, select the subscription in which the new plan will reside.
5. From the **Region** dropdown, select a region for the new plan. The Plan Options for the selected region will display in the **Plan Options** section of the page.
6. From the **Resource Group** dropdown, select a resource group for the plan. From more information on resource groups, see [Manage Azure resources through portal](../azure-portal/resource-group-portal.md).
7. In **Plan Name** type the name of the plan.
8. Under **Plan Options**, click the billing level for the new plan.
9. Click **Create**.


## Deploying the web service to another region

1. Click the **Web Services** menu option.
2. Select the Web Service you are deploying to a new region.
3. Click **Copy**.
4. In **Web Service Name**, type a new name for the web service.
5. In **Web service description**, type a description for the web service.
6. From the **Subscription** dropdown, select the subscription in which the new web service will reside.
7. From the **Resource Group** dropdown, select a resource group for the web service. From more information on resource groups, see [Manage Azure resources through portal](../azure-portal/resource-group-portal.md).
8. From the **Region** dropdown, select the region in which to deploy the web service.
9. From the **Storage account** dropdown, select a storage account in which to store the web service.
10. From the **Price Plan** dropdown, select a plan in the region you selected in step 8.
11. Click **Copy**.


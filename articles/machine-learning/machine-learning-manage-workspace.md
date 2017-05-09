---
title: Manage a Machine Learning workspace | Microsoft Docs
description: Manage access to Azure Machine Learning workspaces, and deploy and manage ML API web services
services: machine-learning
documentationcenter: ''
author: garyericson
manager: jhubbard
editor: cgronlun

ms.assetid: daf3d413-7a77-4beb-9a7a-6b4bdf717719
ms.service: machine-learning
ms.workload: data-services
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 02/27/2017
ms.author: garye

---
# Manage an Azure Machine Learning workspace

> [!NOTE]
> For information on managing Web services in the Machine Learning Web Services portal, see [Manage a Web service using the Azure Machine Learning Web Services portal](machine-learning-manage-new-webservice.md).
> 
> 

You can manage Machine Learning workspaces in either the Azure portal or the Azure classic portal.

[!INCLUDE [machine-learning-free-trial](../../includes/machine-learning-free-trial.md)]

## Use the Azure portal

To manage a workspace in the Azure portal:

1. Sign in to the [Azure portal](https://portal.azure.com/) using an Azure subscription administrator account.
2. In the search box at the top of the page, enter "machine learning workspaces" and then select **Machine Learning Workspaces**.
3. Click the workspace you want to manage.

In addition to the standard resource management information and options available, you can:

- View **Properties** - This page displays the workspace and resource information, and you can change the subscription and resource group that this workspace is connected with.
- **Resync Storage Keys** - The workspace maintains keys to the storage account. If the storage account changes keys, then you can click **Resync keys** to synchronize the keys with the workspace.

To manage the web services associated with this workspace, use the Machine Learning Web Services portal. See [Manage a Web service using the Azure Machine Learning Web Services portal](machine-learning-manage-new-webservice.md) for complete information.

> [!NOTE]
> To deploy or manage New web services you must be assigned a contributor or administrator role on the subscription to which the web service is deployed. If you invite another user to a machine learning workspace, you must assign them to a contributor or administrator role on the subscription before they can deploy or manage web services. 
> 
>For more information on setting access permissions, see [View access assignments for users and groups in the Azure portal - Public preview](../active-directory/role-based-access-control-manage-assignments.md).

## Use the Azure classic portal

Using the Azure classic portal, you can manage your Machine Learning workspaces to:

* Monitor how the workspace is being used
* Configure the workspace to allow or deny access
* Manage Web services created in the workspace
* Delete the workspace

In addition, the dashboard tab provides an overview of your workspace usage and a quick glance of your workspace information.  

> [!TIP]
> In Azure Machine Learning Studio, on the **WEB SERVICES** tab, you can add, update, or delete a Machine Learning Web service.
> 
> 

To manage a workspace in the Azure classic portal:

1. Sign in to the [Azure classic portal](https://manage.windowsazure.com/) using your Microsoft Azure account - use the account that's associated with the Azure subscription.
2. In the Microsoft Azure services panel, click **MACHINE LEARNING**.
3. Click the workspace you want to manage.

The workspace page has three tabs:

* **DASHBOARD** - Allows you to view workspace usage and information
* **CONFIGURE** - Allows you to manage access to the workspace
* **WEB SERVICES** - Allows you to manage Web services that have been published from this workspace

### To monitor how the workspace is being used
Click the **DASHBOARD** tab.

From the dashboard, you can view overall usage of your workspace and get a quick glance of workspace information.

* The **COMPUTE** chart shows the compute resources being used by the workspace. You can change the view to display relative or absolute values, and you can change the timeframe displayed in the chart.
* **Usage overview** displays Azure storage being used by the workspace.
* **Quick glance** provides a summary of workspace information and useful links.

> [!NOTE]
> The **Sign-in to ML Studio** link opens Machine Learning Studio using the Microsoft Account you are currently signed into. The Microsoft Account you used to sign in to the Azure classic portal to create a workspace does not automatically have permission to open that workspace. To open a workspace, you must be signed in to the Microsoft Account that was defined as the owner of the workspace, or you need to receive an invitation from the owner to join the workspace.
> 
> 

### To grant or suspend access for users
Click the **CONFIGURE** tab.

From the configuration tab you can:

* Suspend access to the Machine Learning workspace by clicking DENY. Users will no longer be able to open the workspace in Machine Learning Studio. To restore access, click ALLOW.

To manage additional accounts who have access to the workspace in Machine Learning Studio, click **Sign-in to ML Studio** in the **DASHBOARD** tab (see the preceeding note regarding **Sign-in to ML Studio**). This opens the workspace in Machine Learning Studio. From here, click the **SETTINGS** tab and then **USERS**. You can click **INVITE MORE USERS** to give users access to the workspace, or select a user and click **REMOVE**.

### To manage web services in this workspace
Click the **WEB SERVICES** tab.

This displays a list of web services published from this workspace.
To manage a web service, click the name in the list to open the Web service page.

A Web service may have one or more endpoints defined.

* You can define more endpoints in addition to the "Default" endpoint. To add the endpoint, click **Manage Endpoints** at the bottom of the dashboard to open the Azure Machine Learning Web Services portal.
* To delete an endpoint (you cannot delete the "Default" endpoint), click the check box at the beginning of the endpoint row, and click **DELETE**. This removes the endpoint from the Web service.
  
  > [!NOTE]
  > If an application is using the web service endpoint when the endpoint is deleted, the application will receive an error the next time it tries to access the service.
  > 
  > 

Click the name of a Web service endpoint to open it. 

From the dashboard, you can view overall usage of your Web service over a period of time. You can select the period to view from the Period dropdown menu in the upper right of the usage charts. The dashboard shows the following information:

* **Requests Over Time** displays a step graph of the number of requests over the selected time period. It can help identify if you are experiencing spikes in usage.
* **Request-Response Requests** displays the total number of Request-Response calls the service has received over the selected time period and how many of them failed.
* **Average Request-Response Compute Time** displays an average of the time needed to execute the received requests.
* **Batch Requests** displays the total number of Batch Requests the service has received over the selected time period and how many of them failed.
* **Average Job Latency** displays an average of the time needed to execute the received requests.
* **Errors** displays the aggregate number of errors that have occurred on calls to the web service.
* **Services Costs** displays the charges for the billing plan associated with the service.

From the Configure page, you can update the following properties:

* **Description** allows you to enter a description for the Web service. Description is a required field.
* **Logging** allows you to enable or disable error logging on the endpoint. For more information on Logging, see Enable [logging for Machine Learning web services](machine-learning-web-services-logging.md).
* **Enable Sample data** allows you to provide sample data that you can use to test the Request-Response service. If you created the web service in Machine Learning Studio, the sample data is taken from the data your used to train your model. If you created the service programmatically, the data is taken from the example data you provided as part of the JSON package.


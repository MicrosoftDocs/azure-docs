---
title: Use the Azure Machine Learning Web Services portal | Microsoft Docs
description: Manage access to Azure Machine Learning workspaces, and deploy and manage ML API web services
services: machine-learning
documentationcenter: ''
author: vDonGlover
manager: jhubbard
editor: cgronlun

ms.assetid: b62cf2ca-dd2a-4a83-bb54-469f948fb026
ms.service: machine-learning
ms.workload: data-services
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 02/28/2017
ms.author: v-donglo

---
# Manage a Web service using the Azure Machine Learning Web Services portal
You can manage your Machine Learning New and Classic Web services using the Microsoft Azure Machine Learning Web Services portal. Since Classic Web services and New Web services are based on different underlying technologies, you have slightly different management capabilities for each of them.

In the Machine Learning Web Services portal you can:

* Monitor how the web service is being used.
* Configure the description, update the keys for the web service (New only), update your storage account key (New only), enable logging, and enable or disable sample data.
* Delete the web service.
* Create, delete, or update billing plans (New only).
* Add and delete endpoints (Classic only)

[!INCLUDE [machine-learning-free-trial](../../includes/machine-learning-free-trial.md)]

## Permissions to manage New Resources Manager based web services

New web services are deployed as Azure resources. As such, you must have the correct permissions to deploy and manage New web services.  To deploy or manage New web services you must be assigned a contributor or administrator role on the subscription to which the web service is deployed. If you invite another user to a machine learning workspace, you must assign them to a contributor or administrator role on the subscription before they can deploy or manage web services. 

If the user does not have the correct permissions to access resources in the Azure Machine Learning Web Services portal, they will receive the following error when trying to deploy a web service:

*Web Service deployment failed. This account does not have sufficient access to the Azure subscription that contains the Workspace. In order to deploy a Web Service to Azure, the same account must be invited to the Workspace and be given access to the Azure subscription that contains the Workspace.*

For more information on creating a workspace, see [Create and share an Azure Machine Learning workspace](machine-learning-create-workspace.md).

For more information on setting access permissions, see [View access assignments for users and groups in the Azure portal - Public preview](../active-directory/role-based-access-control-manage-assignments.md).


## Manage New Web services
To manage your New Web services:

1. Sign in to the [Microsoft Azure Machine Learning Web Services](https://services.azureml.net/quickstart) portal using your Microsoft Azure account - use the account that's associated with the Azure subscription.
2. On the menu, click **Web Services**.

This displays a list of deployed Web services for your subscription. 

To manage a Web service, click Web Services. From the Web Services page you can:

* Click the web service to manage it.
* Click the Billing Plan for the web service to update it.
* Delete a web service.
* Copy a web service and deploy it to another region.

When you click a web service, the web service Quickstart page opens. The web service Quickstart page has two menu options that allow you to manage your web service:

* **DASHBOARD** - Allows you to view Web service usage.
* **CONFIGURE** - Allows you to add descriptive text, update the key for the storage account associated with the Web service, and enable or disable sample data.

### Monitoring how the web service is being used
Click the **DASHBOARD** tab.

From the dashboard, you can view overall usage of your Web service over a period of time. You can select the period to view from the Period dropdown menu in the upper right of the usage charts. The dashboard shows the following information:

* **Requests Over Time** displays a step graph of the number of requests over the selected time period. It can help identify if you are experiencing spikes in usage.
* **Request-Response Requests** displays the total number of Request-Response calls the service has received over the selected time period and how many of them failed.
* **Average Request-Response Compute Time** displays an average of the time needed to execute the received requests.
* **Batch Requests** displays the total number of Batch Requests the service has received over the selected time period and how many of them failed.
* **Average Job Latency** displays an average of the time needed to execute the received requests.
* **Errors** displays the aggregate number of errors that have occurred on calls to the web service.
* **Services Costs** displays the charges for the billing plan associated with the service.

### Configuring the web service
Click the **CONFIGURE** menu option.

You can update the following properties:

* **Description** allows you to enter a description for the Web service.
* **Title** allows you to enter a title for the Web service
* **Keys** allows you to rotate your primary and secondary API keys.
* **Storage account key** allows you to update the key for the storage account associated with the Web service changes. 
* **Enable Sample data** allows you to provide sample data that you can use to test the Request-Response service. If you created the web service in Machine Learning Studio, the sample data is taken from the data your used to train your model. If you created the service programmatically, the data is taken from the example data you provided as part of the JSON package.

### Managing billing plans
Click the **Plans** menu option from the web services Quickstart page. You can also click the plan associated with specific Web service to manage that plan.

* **New** allows you to create a new plan.
* **Add/Remove Plan instance** allows you to "scale out" an existing plan to add capacity.
* **Upgrade/DownGrade** allows you to "scale up" an existing plan to add capacity.
* **Delete** allows you to delete a plan.

Click a plan to view its dashboard. The dashboard gives you snapshot or plan usage over a selected period of time. To select the time period to view, click the **Period** dropdown at the upper right of dashboard. 

The plan dashboard provides the following information:

* **Plan Description** displays information about the costs and capacity associated with the plan.
* **Plan Usage** displays the number of transactions and compute hours that have been charged against the plan.
* **Web Services** displays the number of Web services that are using this plan.
* **Top Web Service By Calls** displays the top four Web services that are making calls that are charged against the plan.
* **Top Web Services by Compute Hrs** displays the top four Web services that are using compute resources that are charged against the plan.

## Manage Classic Web Services
> [!NOTE]
> The procedures in this section are relevant to managing Classic web services through the Azure Machine Learning Web Services portal. For information on managing Classic Web services through the Machine Learning Studio and the Azure classic portal, see [Manage an Azure Machine Learning workspace](machine-learning-manage-workspace.md).
> 
> 

To manage your Classic Web services:

1. Sign in to the [Microsoft Azure Machine Learning Web Services](https://services.azureml.net/quickstart) portal using your Microsoft Azure account - use the account that's associated with the Azure subscription.
2. On the menu, click **Classic Web Services**.

To manage a Classic Web Service, click **Classic Web Services**. From the Classic Web Services page you can:

* Click the web service to view the associated endpoints.
* Delete a web service.

When you manage a Classic Web service, you manage each of the endpoints separately. When you click a web service in the Web Services page, the list of endpoints associated with the service opens. 

On the Classic Web Service endpoint page, you can add and delete endpoints on the service. For more information on adding endpoints, see [Creating Endpoints](machine-learning-create-endpoint.md).

Click one of the endpoints to open the web service Quickstart page. On the Quickstart page, there are two menu options that allow you to manage your web service:

* **DASHBOARD** - Allows you to view Web service usage.
* **CONFIGURE** - Allows you to add descriptive text, turn error logging on and off, update the key for the storage account associated with the Web service, and enable and disable sample data.

### Monitoring how the web service is being used
Click the **DASHBOARD** tab.

From the dashboard, you can view overall usage of your Web service over a period of time. You can select the period to view from the Period dropdown menu in the upper right of the usage charts. The dashboard shows the following information:

* **Requests Over Time** displays a step graph of the number of requests over the selected time period. It can help identify if you are experiencing spikes in usage.
* **Request-Response Requests** displays the total number of Request-Response calls the service has received over the selected time period and how many of them failed.
* **Average Request-Response Compute Time** displays an average of the time needed to execute the received requests.
* **Batch Requests** displays the total number of Batch Requests the service has received over the selected time period and how many of them failed.
* **Average Job Latency** displays an average of the time needed to execute the received requests.
* **Errors** displays the aggregate number of errors that have occurred on calls to the web service.
* **Services Costs** displays the charges for the billing plan associated with the service.

### Configuring the web service
Click the **CONFIGURE** menu option.

You can update the following properties:

* **Description** allows you to enter a description for the Web service. Description is a required field.
* **Logging** allows you to enable or disable error logging on the endpoint. For more information on Logging, see Enable [logging for Machine Learning web services](machine-learning-web-services-logging.md).
* **Enable Sample data** allows you to provide sample data that you can use to test the Request-Response service. If you created the web service in Machine Learning Studio, the sample data is taken from the data your used to train your model. If you created the service programmatically, the data is taken from the example data you provided as part of the JSON package.

## Grant or suspend access to Web services for users in the portal
Using the Azure classic portal, you can allow or deny access to specific users.

### Access for users of New Web services
To enable other users to work with your Web services in the Azure Machine Learning Web Services portal, you must add them as co-adminstrators on your Azure subscription.

Sign in to the [Azure classic portal](https://manage.windowsazure.com/) using your Microsoft Azure account - use the account that's associated with the Azure subscription.

1. In the navigation pane, click **Settings**, then click **Administrators**.
2. At the bottom of the window, click **Add**. 
3. In the ADD A CO-ADMINISTRATOR dialog, type the email address of the person you want to add as Co-administrator and then select the subscription that you want the Co-administrator to access.
4. Click **Save**.

### Access for users of Classic Web services
To manage a workspace:

Sign in to the [Azure classic portal](https://manage.windowsazure.com/) using your Microsoft Azure account - use the account that's associated with the Azure subscription.

1. In the Microsoft Azure services panel, click **MACHINE LEARNING**.
2. Click the workspace you want to manage.
3. Click the **CONFIGURE** tab.

From the configuration tab, you can suspend access to the Machine Learning workspace by clicking **DENY**. Users will no longer be able to open the workspace in Machine Learning Studio. To restore access, click **ALLOW**.

To specific users:

To manage additional accounts who have access to the workspace in Machine Learning Studio, click **Sign-in to ML Studio** in the **DASHBOARD** tab. This opens the workspace in Machine Learning Studio. From here, click the **SETTINGS** tab and then **USERS**. You can click **INVITE MORE USERS** to give users access to the workspace, or select a user and click **REMOVE**.

> [!NOTE]
> The **Sign-in to ML Studio** link opens Machine Learning Studio using the Microsoft Account you are currently signed into. The Microsoft Account you used to sign in to the Azure classic portal to create a workspace does not automatically have permission to open that workspace. To open a workspace, you must be signed in to the Microsoft Account that was defined as the owner of the workspace, or you need to receive an invitation from the owner to join the workspace.
> 
> 


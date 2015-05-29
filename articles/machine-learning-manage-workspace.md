<properties 
	pageTitle="Manage a Machine Learning workspace | Azure" 
	description="Manage access to Azure Machine Learning workspaces, and deploy and manage ML API web services" 
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
	ms.date="04/29/2015" 
	ms.author="garye"/>


# Manage an Azure Machine Learning workspace 
Using the Azure management portal, you can manage your Machine Learning workspaces to:

- Monitor how the workspace is being used
- Configure the workspace to allow or deny access
- Manage web services created in the workspace
- Delete the workspace

[AZURE.INCLUDE [machine-learning-free-trial](../includes/machine-learning-free-trial.md)]

In addition, the dashboard tab provides an overview of your workspace usage and a quick glance of your workspace information.  

> [AZURE.TIP] In Azure Machine Learning Studio, on the **WEB SERVICES** tab, you can add, update, or delete a Machine Learning web service.

To manage a workspace:

1.	Sign-in to your Microsoft Azure account - use the account that's associated with the Azure subscription.
2.	In the [Azure management portal](https://manage.windowsazure.com/), in the Microsoft Azure services panel, click **MACHINE LEARNING**.
3.	Click the workspace you want to manage.

The workspace page has three tabs:

- **DASHBOARD** - Allows you to view workspace usage and information
- **CONFIGURE** - Allows you to manage access to the workspace
- **WEB SERVICES** - Allows you to manage web services that have been published from this workspace

  
## To monitor how the workspace is being used

Click the **DASHBOARD** tab.

From the dashboard you can view overall usage of your workspace and get a quick glance of workspace information.

- The **COMPUTE** chart shows the compute resources being used by the workspace. You can change the view to display relative or absolute values, and you can change the timeframe displayed in the chart.
- **Usage overview** displays Azure storage being used by the workspace.
Note: Storage monitoring is unavailable during the Azure Machine Learning public preview.
- **Quick glance** provides a summary of workspace information and useful links.

> [AZURE.NOTE] The **OPEN IN STUDIO** link opens Machine Learning Studio using the Microsoft Account you are currently signed into. The Microsoft Account you used to sign in to the Azure portal to create a workspace does not automatically have permission to open that workspace. To open a workspace, you must be signed in to the Microsoft Account that was defined as the owner of the workspace, or you need to receive an invitation from the owner to join the workspace. 


## To grant or suspend access for users ##

Click the **CONFIGURE** tab.

From the configuration tab you can
 
- Suspend access to the Machine Learning workspace by clicking DENY. Users will no longer be able to open the workspace in Machine Learning Studio. To restore access, click ALLOW.
- Change the workspace owner by specifying a different Microsoft Account. 

To manage who has access to the workspace in Machine Learning Studio, click **OPEN IN STUDIO** (see note above regarding **OPEN IN STUDIO**). This opens the workspace in Machine Learning Studio. From here, click the **SETTINGS** tab and then **USERS**. You can click **INVITE MORE USERS** to give users access to the workspace, or select a user and click **REMOVE**.


## To manage web services in this workspace

Click the **WEB SERVICES** tab.

This displays a list of web services published from this workspace.
To manage a web service, click the name in the list to open the web service page.

A web service may have one or more endpoints defined. 

- You can define additional endpoints in addition to the "Default" endpoint. To add the endpoint, click **ADD ENDPOINT** at the bottom of the page.

- To delete an endpoint (you cannot delete the "Default" endpoint), click anywhere on the endpoint row except the name, and click **DELETE ENDPOINT** at the bottom of the page. This removes the endpoint from the web service.
 
    > [AZURE.NOTE] If an application is using the web service endpoint when the endpoint is deleted, the application will receive an error the next time it tries to access the service.

Click the name of a web service endpoint to open it. The usage chart shows the compute and prediction resources being used by the web service endpoint. You can change the view to display relative or absolute values, and you can change the timeframe displayed in the chart.

This page also gives you the information you need to be able to access the endpoint using the web service REST API. For more information, see [How to consume an Azure Machine Learning web service][consume]. 

You can also publish the web service to the Azure data marketplace from this page. For more information, see [Publish Azure Machine Learning Web Service to the Azure Marketplace][marketplace].

[consume]: machine-learning-consume-web-services.md
[marketplace]: machine-learning-publish-web-service-to-azure-marketplace.md


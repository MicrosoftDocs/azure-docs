---
title: Web service logging - Azure Machine Learning Studio | Microsoft Docs
description: Learn how to enable logging for Machine Learning Studio web services. Logging provides additional information to help troubleshoot the APIs.
services: machine-learning
documentationcenter: ''
author: xiaoharper
ms.custom: seodec18
ms.author: amlstudiodocs

editor: cgronlun
ms.assetid: c54d41e1-0300-46ef-bbfc-d6f7dca85086
ms.service: machine-learning
ms.subservice: studio
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: big-data
ms.date: 06/15/2017
---
# Enable logging for Azure Machine Learning Studio web services
This document provides information on the logging capability of Machine Learning Studio web services. Logging provides additional information, beyond just an error number and a message, that can help you troubleshoot your calls to the Machine Learning Studio APIs.  

## How to enable logging for a Web service

You enable logging from the [Azure Machine Learning Studio Web Services](https://services.azureml.net) portal. 

1. Sign in to the Azure Machine Learning Studio Web Services portal at [https://services.azureml.net](https://services.azureml.net). For a Classic web service, you can also get to the portal by clicking **New Web Services Experience** on the Machine Learning Studio Web Services page in Machine Learning Studio.

   ![New Web Services Experience link](./media/web-services-logging/new-web-services-experience-link.png)

2. On the top menu bar, click **Web Services** for a New web service, or click **Classic Web Services** for a Classic web service.

   ![Select New or Classic web services](./media/web-services-logging/select-web-service.png)

3. For a New web service, click the web service name. For a Classic web service, click the web service name and then on the next page click the appropriate endpoint.

4. On the top menu bar, click **Configure**.

5. Set the **Enable Logging** option to *Error* (to log only errors) or *All* (for full logging).

   ![Select logging level](./media/web-services-logging/enable-logging.png)

6. Click **Save**.

7. For Classic web services, create the **ml-diagnostics** container.

   All web service logs are kept in a blob container named **ml-diagnostics** in the storage account associated with the web service. For New web services, this container is created the first time you access the web service. For Classic web services, you need to create the container if it doesn't already exist. 

   1. In the [Azure portal](https://portal.azure.com), go to the storage account associated with the web service.

   2. Under **Blob Service**, click **Containers**.

   3. If the container **ml-diagnostics** doesn't exist, click **+Container**, give the container the name "ml-diagnostics", and select the **Access type** as "Blob". Click **OK**.

      ![Create a new container to store your diagnostic logs](./media/web-services-logging/create-ml-diagnostics-container.png)

> [!TIP]
>
> For a Classic web service, the Web Services Dashboard in Machine Learning Studio also has a switch to enable logging. However, because logging is now managed through the Web Services portal, you need to enable logging through the portal as described in this article. If you already enabled logging in Studio, then in the Web Services Portal, disable logging and enable it again.


## The effects of enabling logging
When logging is enabled, the diagnostics and errors from the web service endpoint are logged in the **ml-diagnostics** blob container in the Azure Storage Account linked with the user’s workspace. 
This container holds all the diagnostics information for all the web service endpoints for all the workspaces associated with this storage account.

The logs can be viewed using any of the several tools available to explore an Azure Storage Account. The easiest may be to navigate to the storage account in the Azure portal, click **Containers**, and then click the container **ml-diagnostics**.  

## Log blob detail information
Each blob in the container holds the diagnostics information for exactly one of the following actions:

* An execution of the Batch-Execution method  
* An execution of the Request-Response method  
* Initialization of a Request-Response container

The name of each blob has a prefix of the following form: 


`{Workspace Id}-{Web service Id}-{Endpoint Id}/{Log type}`


Where _Log type_ is one of the following values:  

* batch  
* score/requests  
* score/init  


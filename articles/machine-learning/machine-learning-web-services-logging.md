---
title: Logging for Machine Learning web services | Microsoft Docs
description: Learn how to enable logging for Machine Learning web services. Logging provides additional information to help troubleshoot the APIs.
services: machine-learning
documentationcenter: ''
author: raymondlaghaeian
manager: jhubbard
editor: cgronlun

ms.assetid: c54d41e1-0300-46ef-bbfc-d6f7dca85086
ms.service: machine-learning
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: big-data
ms.date: 01/12/2017
ms.author: raymondl;garye

---
# Enable logging for Machine Learning web services
This document provides information on the logging capability of Classic Web services. Enabling logging in Web services provides additional information, beyond just an error number and a message, that can help you troubleshoot your calls to the Machine Learning APIs.  

To enable logging in Web Services in the Azure classic portal:   

1. Sign in to [Azure classic portal](https://manage.windowsazure.com/)
2. In the left features column, click **MACHINE LEARNING**.
3. Click your workspace, then **WEB SERVICES**.
4. In the Web services list, click the name of the Web service.
5. In the endpoints list, click the endpoint name.
6. Click **CONFIGURE**.
7. Set **DIAGNOSTICS TRACE LEVEL** to *Error* or *All*, then click **SAVE**.

To enable logging in the Azure Machine Learning Web Services portal.

1. Sign into the [Azure Machine Learning Web Services](https://services.azureml.net) portal.
2. Click Classic Web Services.
3. In the Web services list, click the name of the Web service.
4. In the endpoints list, click the endpoint name.
5. Click **Configure**.
6. Set **Logging** to *Error* or *All*, then click **SAVE**.

## The effects of enabling logging
When logging is enabled, all the diagnostics and errors from the selected endpoint are logged to the Azure Storage Account linked with the user’s workspace. You can see this storage account in the Azure classic portal Dashboard view (bottom of the Quick Glance section) of their workspace.  

The logs can be viewed using any of the several tools available to 'explore' an Azure Storage Account. The easiest may be to simply navigate to the Storage Account in the Azure classic portal and then click **CONTAINERS**. You would then see a Container named **ml-diagnostics**. This container holds all the diagnostics information for all the web service endpoints for all the workspaces associated with this Storage account. 

## Log blob detail information
Each blob in the container holds the diagnostics info for exactly one of the following:

* An execution of the Batch-Execution method  
* An execution of the Request-Response method  
* Initialization of a Request-Response container

The name of each blob has a prefix of the following form: 

{Workspace Id}-{Web service Id}-{Endpoint Id}/{Log type}  

Where Log type is one of the following values:  

* batch  
* score/requests  
* score/init  


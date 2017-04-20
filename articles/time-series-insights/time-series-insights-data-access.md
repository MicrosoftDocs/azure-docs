---
title: Data access policies in Azure Time Series Insights | Microsoft Docs
description: In this tutorial, you learn to manage data access policies in Time Series Insights
keywords: 
services: time-series-insights
documentationcenter: 
author: op-ravi
manager: santoshb
editor: cgronlun

ms.assetid: 
ms.service: time-series-insights
ms.devlang: na
ms.topic: get-started-article
ms.tgt_pltfrm: na
ms.workload: big-data
ms.date: 04/20/2017
ms.author: omravi
---

# Grant data access to a Time Series Insights environment using Azure portal

Time Series Insights environments have two independent kinds of access policies:

* Management access policies (“Access control (IAM)” tab on the environment blade)
* Data access policies

## Management of the Time Series Insights environment

Both kinds of policies grant Azure Active Directory principals (users and apps) various permissions. Management access policies grant permissions related to the configuration of the environment (creation and deletion of the environment, event sources, reference data sets, etc.). Data access polies grant permissions to issue data queries and manipulate reference data rows. The two kinds of the policies allow clear separation between access to the management of an environment access to the data inside the environment. For example, it is possible to setup an environment such that even the owner/creator of the environment is removed from the data access. As well as users and service that are allowed to read data may have absolutely no access to the configuration of the environment.

Both kinds of policies operate over principals (users and apps) defined in the Active Directory (or “Azure tenant”) associated with the subscription containing the environment.

The following steps show how to grant data access for a user principal:

1.	Sign in to the [Azure portal](https://portal.azure.com).
2.	Click “All resources” in the menu on the left side of the Azure portal.
3.	Select your Time Series Insights environment.
  
  ![Manage the Time Series Insights source - environment](media/data-access/getstarted-grant-data-access1.png)

4.	Select “Data Plane Access”, click “Add”
  
  ![Manage the Time Series Insights source - add](media/data-access/getstarted-grant-data-access2.png)
  
5.	Click “Select user”.
6.	Search and select user by the email.
7.	Click “Select” in “Select User” blade.
  
  ![Manage the Time Series Insights source - select user](media/data-access/getstarted-grant-data-access3.png)
  
8.	Click “Select role”.
9.	Select “Contributor” if you want to allow user to change reference data and share saved queries and perspectives with other users of the environment. Otherwise select “Reader” to allow user query data in the environment and save personal (not shared) queries in the environment.
10.	Click “Ok” in the “Select Role” blade.
  
  ![Manage the Time Series Insights source - select role](media/data-access/getstarted-grant-data-access4.png)
  
11.	Click “Ok” in the “Select User Role” blade.
12.	You should see:
  
  ![Manage the Time Series Insights source - results](media/data-access/getstarted-grant-data-access5.png)
  

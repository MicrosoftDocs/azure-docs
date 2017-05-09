---
title: Azure Functions Runtime Overview | Microsoft Docs
description: Overview of the Azure Functions Runtime Preview
services: functions
documentationcenter: ''
author: apwestgarth
manager: stefsch
editor: ''

ms.assetid:
ms.service: functions
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: multiple
ms.topic: article
ms.date: 05/08/2017
ms.author: anwestg

---

# Azure Functions Runtime Overview

The Azure Functions Runtime provides a new way for customers to take advantage of the simplicity and flexibility of the Azure Functions programming model on-premises. Built on the same open source roots that the Azure Functions service is built on, Azure Functions Runtime can be deployed on-premises and provides a near similar development experience as the cloud service.

![Azure Functions Runtime Preview Portal][1]

The Azure Functions Runtime provides a way for customers to experience Azure Functions before committing to the cloud and the code assets that are built can then be taken with them to the cloud when they move.  The runtime also opens up new options for customers to perform tasks such as harnessing the spare compute power of on-premises PCs to run batch processes overnight, leveraging devices within their organisation to conditionally send data to other systems on-premises and in the cloud.

The Azure Functions Runtime consists of two pieces:
* Azure Functions Runtime Management Role
* Azure Functions Runtime Worker Role

## Azure Functions Management Role

The Azure Functions Management Role provides a host for the management of your Functions on-premise:
* Hosting of the Azure Functions Management Portal, the same Functions Portal as in Azure, in which you can develop your functions in the same way as in Azure
* Responsible for distributing Functions across multiple Functions workers.
* By providing a publishin endpoint, you can publish your Functions direct from Microsoft Visual Studio.

## Azure Functions Worker Role

The Azure Functions Worker Role(s) are deployed in Windows Containers and this is where your Function code executes.  You can deploy multiple Woker Roles throughout your organization and is a key way in which customers can make use of spare compute power.


## Minimum Requirements

To get started with the Azure Functions Runtime you must have a machine with **Windows Server 2016 or Windows 10 Creators Update** with access to a **SQL Server** instance.


<!--Image references-->
[1]: ./media/functions-runtime-overview/AzureFunctionsRuntime_Portal.png

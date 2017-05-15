---
title: What's new in Azure Machine Learning | Microsoft Docs
description: New features that are available in Azure Machine Learning.
services: machine-learning
documentationcenter: ''
author: vDonGlover
manager: raymondl
editor: ''

ms.assetid: ddc716ed-2615-4806-bf27-6c9a5662a7f2
ms.service: machine-learning
ms.workload: data-services
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 03/28/2017
ms.author: v-donglo

---
# What's New in Azure Machine Learning

### The March 2017 release of Microsoft Azure Machine Learning updates provides the following feature:



* Dedicated Capacity for Azure Machine Learning BES Jobs

	Machine Learning Batch Pool processing uses the [Azure Batch](../batch/batch-technical-overview.md) service to provide customer-managed scale for the Azure Machine Learning Batch Execution Service. Batch Pool processing allows you to create Azure Batch pools on which you can submit batch jobs and have them execute in a predictable manner.

	For more information, see [Azure Batch service for Machine Learning jobs](machine-learning-dedicated-capacity-for-bes-jobs.md).


### The August 2016 release of Microsoft Azure Machine Learning updates provide the following features:
* Classic Web services can now be managed in the new [Microsoft Azure Machine Learning Web Services](https://services.azureml.net/) portal that provides one place to manage all aspects of your Web service.    
  * Which provides web service [usage statistics](machine-learning-manage-new-webservice.md).
  * Simplifies testing of Azure Machine Learning Remote-Request calls using sample data.
  * Provides a new Batch Execution Service test page with sample data and job submission history.
  * Provides easier endpoint management.

### The July 2016 release of Microsoft Azure Machine Learning updates provide the following features:
* Web services are now managed as Azure resources managed through [Azure Resource Manager](../azure-resource-manager/resource-group-overview.md) interfaces, allowing for the following enhancements:
  * There are new [REST APIs](https://msdn.microsoft.com/library/azure/Dn950030.aspx) to deploy and manage your Resource Manager based Web services.
  * There is a new [Microsoft Azure Machine Learning Web Services](https://services.azureml.net/) portal that provides one place to manage all aspects of your Web service.
* Incorporates a new subscription-based, multi-region web service deployment model using Resource Manager based APIs leveraging the Resource Manager Resource Provider for Web Services.
* Introduces new [pricing plans](https://azure.microsoft.com/pricing/details/machine-learning/) and plan management capabilities using the new Resource Manager RP for Billing.
  * You can now [deploy your web service to multiple regions](machine-learning-how-to-deploy-to-multiple-regions.md) without needing to create a subscription in each region.
* Provides web service [usage statistics](machine-learning-manage-new-webservice.md).
* Simplifies testing of Azure Machine Learning Remote-Request calls using sample data.
* Provides a new Batch Execution Service test page with sample data and job submission history.

In addition, the Machine Learning Studio has been updated to allow you to deploy to the new Web service model or continue to deploy to the classic Web service model. 


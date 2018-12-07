---
title: What's new - Azure Machine Learning Studio | Microsoft Docs
description: New features that are available in Azure Machine Learning Studio.
services: machine-learning
documentationcenter: ''
author: ericlicoding
ms.custom: seodec18
ms.author: amlstudiodocs
manager: hjerez
editor: cgronlun
ms.assetid: ddc716ed-2615-4806-bf27-6c9a5662a7f2
ms.service: machine-learning
ms.component: studio
ms.workload: data-services
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 10/28/2018
---
# What's New in Azure Machine Learning Studio?

## October 2018

The R language engine in the [Execute R Script](https://docs.microsoft.com/azure/machine-learning/studio-module-reference/execute-r-script) module has added a new R runtime version -- Microsoft R Open (MRO) 3.4.4. MRO 3.4.4 is based on open-source CRAN R 3.4.4 and is therefore compatible with packages that works with that version of R.  Learn more about the supported R packages in the article, "[R Packages supported by Azure Machine Learning Studio](https://docs.microsoft.com/azure/machine-learning/studio-module-reference/r-packages-supported-by-azure-machine-learning#bkmk_List)".

## March 2017 
This release of Microsoft Azure Machine Learning updates provides the following feature:

* Dedicated Capacity for Azure Machine Learning BES Jobs

	Machine Learning Batch Pool processing uses the [Azure Batch](../../batch/batch-technical-overview.md) service to provide customer-managed scale for the Azure Machine Learning Batch Execution Service. Batch Pool processing allows you to create Azure Batch pools on which you can submit batch jobs and have them execute in a predictable manner.

	For more information, see [Azure Batch service for Machine Learning jobs](dedicated-capacity-for-bes-jobs.md).


## August 2016 
This release of Microsoft Azure Machine Learning updates provide the following features:
* Classic Web services can now be managed in the new [Microsoft Azure Machine Learning Web Services](https://services.azureml.net/) portal that provides one place to manage all aspects of your Web service.    
  * Which provides web service [usage statistics](manage-new-webservice.md).
  * Simplifies testing of Azure Machine Learning Remote-Request calls using sample data.
  * Provides a new Batch Execution Service test page with sample data and job submission history.
  * Provides easier endpoint management.

## July 2016 
This release of Microsoft Azure Machine Learning updates provide the following features:
* Web services are now managed as Azure resources managed through [Azure Resource Manager](../../azure-resource-manager/resource-group-overview.md) interfaces, allowing for the following enhancements:
  * There are new [REST APIs](https://msdn.microsoft.com/library/azure/Dn950030.aspx) to deploy and manage your Resource Manager based Web services.
  * There is a new [Microsoft Azure Machine Learning Web Services](https://services.azureml.net/) portal that provides one place to manage all aspects of your Web service.
* Incorporates a new subscription-based, multi-region web service deployment model using Resource Manager based APIs leveraging the Resource Manager Resource Provider for Web Services.
* Introduces new [pricing plans](https://azure.microsoft.com/pricing/details/machine-learning/) and plan management capabilities using the new Resource Manager RP for Billing.
  * You can now [deploy your web service to multiple regions](how-to-deploy-to-multiple-regions.md) without needing to create a subscription in each region.
* Provides web service [usage statistics](manage-new-webservice.md).
* Simplifies testing of Azure Machine Learning Remote-Request calls using sample data.
* Provides a new Batch Execution Service test page with sample data and job submission history.

In addition, the Machine Learning Studio has been updated to allow you to deploy to the new Web service model or continue to deploy to the classic Web service model. 


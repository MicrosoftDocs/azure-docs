<properties
	pageTitle="Title | Microsoft Azure"
	description="This provides a comparision of features and guidance on developing applications for Azure Government"
	services=""
	documentationCenter=""
	authors="ryansoc"
	manager=""
	editor=""/>

<tags
	ms.service="multiple"
	ms.devlang="na"
	ms.topic="article"
	ms.tgt_pltfrm="na"
	ms.workload="azure-government"
	ms.date="10/29/2015"
	ms.author="ryansoc"/>

#  Azure Government Technical Documentation

## <a name="Overview"></a>Overview

Azure Government is enabling U.S. Government & their partners to transform their mission-critical workloads to a trusted hyper-scale cloud.  

Azure Government is designed to meet the higher level security and compliance needs for sensitive and dedicated customer workloads found in regulations and authorization programs such as FedRAMP, Department of Defense Enterprise Cloud Computing Security Requirements Guide (SRG), Criminal Justice Information Services (CJIS) Security Policy, and Health Insurance Portability and Accountability Act (HIPAA).

Azure Government provides a physically isolated instance of Azure, with access limited to screened US persons. Azure Government operations provide assurances on the infrastructure and operational components, demonstrated through rigorous compliance audits and continuous monitoring. However, customers are ultimately responsible for the protection and architecture of their applications within the environment.

Azure Government is designed to meet the needs of customers and commercial partners who handle regulated/controlled information through the following security and screening features:

* The Azure Government service infrastructure is hosted in US datacenters, and all customer-managed ITAR-controlled data is stored within the Continental United States (CONUS). Customer-managed ITAR-controlled data is, however, the responsibility of the customer.   

* Azure Government runs on dedicated service hardware that is managed to FedRAMP high-compliant standards.  

* The Azure Government environment is a separate instance from the Microsoft Azure public service and is restricted to qualified US government organizations and solution providers.


Microsoft provides a number of tools to create and deploy cloud applications to Microsoft’s global Azure service (“Global Service”) and Microsoft Azure Government services.

When creating and deploying applications to the Azure Government Services, as opposed to the Global Service, developers need to know the key differences of the two services.  Specifically around setting up and configuring their programming environment, configuring endpoints, writing applications, and deploying them as services to Azure Government.

The information accessible from this site summarizes those differences and supplements the information available on the [Azure Government](http://www.azure.com/gov "Azure Government") site and the [Microsoft Azure Technical Library](http://msdn.microsoft.com/cloud-app-development-msdn "MSDN") on MSDN. Official information may also be available in many other locations such as the [Microsoft Azure Trust Center](https://azure.microsoft.com/support/trust-center/ "Microsoft Azure Trust Center"/), [Azure Documentation Center](https://azure.microsoft.com/documentation/) and in [Azure Blogs](https://azure.microsoft.com/blog/ "Azure Blogs"/).

This content is intended for customers, partners and developers who are deploying to Microsoft Azure Government.

## <a name="Guidance"></a> General Guidance for Customers
Most of the technical content that is available currently assumes that applications are being developed for the Global Service rather than for Microsoft Azure Government, it’s important for you to ensure that developers are aware of key differences for applications developed to be hosted in Azure Government.

- First, there are services and feature differences, this means that certain features that are in specific regions of the Global Service may not be available in Azure Government.

- Second, for features that are offered in Azure Government, there are configuration differences from the Global Service.  Therefore, you should review your sample code, configurations and steps to ensure that you are building and executing within the Azure Government Cloud Services environment.

- Third, you should refer to the Azure Government Technical services documentation available from this site for information that identifies the Azure Government boundary and customer regulated/controlled data guidance and best practices.

Add image gallery here or create its own page?  https://github.com/zakramer/azure-content-pr/blob/zakramerScreening/articles/azure-government-image-gallery.md

For supplemental information and updates please subscribe to the
<a href="https://blogs.msdn.microsoft.com/azuregov/">Microsoft Azure Government Blog. </a>

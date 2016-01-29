<properties
	pageTitle="Overview: Microsoft Azure Stack"
	description="Overview: Microsoft Azure Stack "
	services="azure-stack"
	documentationCenter=""
	authors="ErikjeMS"
	manager="v-kiwhit"
	editor=""/>

<tags
	ms.service="azure-stack"
	ms.workload="na"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="01/29/2016"
	ms.author="erikje"/>

# Introduction to Azure Stack

Azure Stack extends the Azure vision by bringing the cloud model of computing to every datacenter. Azure Stack is a new hybrid cloud platform product that enables organizations to deliver Azure services from their own datacenter in a way that is consistent with Azure.  In this way customers can focus on business innovation rather than spend time building their own cloud computing platform.   

Organizations can create these Azure services from datacenter resources - enabling developers and IT professionals to quickly provision and scale services using the same self-service experience found in Azure.  The product also enables IT organizations to leverage the same management and automation tools used with Azure to customize the service delivery experience to the business units they serve.  

This all adds up to an environment in which application developers can maximize their productivity using a ‘write once, deploy to Azure or Azure Stack’ approach, because the Azure APIs are consistent regardless of where the resources are provisioned - Azure Stack is simply an extension of Azure. Part of the value of this approach is bringing the large ecosystem of operating systems, frameworks, languages, tools, and applications we are building in Azure to individual datacenters. Developers can create applications based on a variety of technologies such as Windows, Linux, .NET, PHP, Ruby or Java that can be deployed and operated the same way on-premises or in Microsoft Azure datacenters. They are also able to leverage the rich Azure ecosystem of templates, tools, and applications to jumpstart their Azure Stack development and operational efforts.   

>[AZURE.NOTE] The first release of Azure Stack is Technical Preview 1. Some of the features described will come at different times during the preview cycle.

## Developer and IT professional experiences

Developers and IT pros have an experience with Azure Stack that is consistent to that which they experience in Azure.  This is fundamentally made possible because the Azure Stack portal environment is the same code as Azure.  However, the real innovation of Azure Stack is the implementation of an identical cloud API as Azure, so there is a consistent developer experience across clouds. Simply connecting to a portal to choose from preconfigured patterns is not enough; the definition of self-service has evolved to include programmatic access to the cloud API for the creation, deployment and operations of workloads in a cloud.  

A consistent API surface area between Azure and Azure Stack is the path to a set of experiences, tools, application patterns, automation capabilities, deployment and configuration, and operations that work across clouds.  

- Experiences: The first engagement with Azure and Azure Stack usually comes through the portal which provides a web-accessible conduit into the system. The portal is a graphical expression of the cloud API.  

- Tools: Cloud developers and IT can use the tools they use in Azure and know they will work in Azure Stack. They can focus on solving business problems, rather than constant tooling and deployment transitions.  

- Application Patterns: Programmatic and abundant access to Cloud Services is changing the way that applications are being designed, developed and operated. You can work with the resources in your application as a group – mixing resources across IaaS and PaaS services.  

- Automation Capabilities: Having a consistent API means that developers and IT can invest in automating development, deployment and operational activities knowing that they will not have to be rewritten to be used with a cloud supplier that offers Azure services.

- Deployment and Configuration:  Deploy, update or delete all of the resources for your application in a single, coordinated operation. This can be done from the portal or programmatically through the SDK as code.  

- Operations: Templated deployments work for different environments such as testing, staging and production. Role based access control, usage and audit capabilities are standardized across all cloud resources in the deployment.  Updates made to application resources can be performed in an incremental and non-destructive manner.

These are all examples of the breadth of impact enabled by this hybrid cloud platform. In each area Azure customers should be confident that their investments in people, processes and technologies will be transferable between Azure and Azure Stack.  


## Next steps

[What is Azure Stack Technical Preview 1?](azure-stack-poc.md)

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

#  Isolation to Restrict Data Access

Isolation is all about using boundaries, segmentation, and containers to limit data access to only authorized users, services, and applications. For example, the separation between tenants is an essential security mechanism for multitenant cloud platforms such as Microsoft Azure. Logical isolation helps prevent one tenant from interfering with the operations of any other tenant.

## <a name="Overview"></a>Environment Isolation
The Azure Government environment is a physical and network-isolated instance that is separate from the rest of Microsoft's network. Isolation is achieved through a series of physical and logical controls that include the following:
* Securing of physical barriers using biometric devices and cameras.
* Use of specific credentials and multifactor authentication by Microsoft personnel requiring logical access to the production environment.
* All service infrastructure for Azure Government is located within the United States.

### <a name="Overview"></a>Per-Customer Isolation
Azure implements network access control and segregation through VLAN isolation, ACLs, load balancers and IP filters

Customers can further isolate their resources across subscriptions, resource groups, virtual networks, and subnets.

For more information on isolation in Microsoft Azure, go to https://azure.microsoft.com/en-us/documentation/articles/azure-security-getting-started/#isolation.

For supplemental information and updates please subscribe to the
<a href="https://blogs.msdn.microsoft.com/azuregov/">Microsoft Azure Government Blog. </a>

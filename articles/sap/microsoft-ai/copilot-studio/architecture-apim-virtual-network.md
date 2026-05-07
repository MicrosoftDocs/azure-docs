---
title: SAP with Microsoft AI Architecture - Azure API Management with virtual network peering
description: Copilot Studio integration with SAP using Azure API Management and virtual network peering for SAP systems running on Azure.
author: hobru
ms.service: sap-on-azure
ms.subservice: center-sap-solutions
ms.topic: overview
ms.custom: microsoft-ai
ms.date: 05/03/2026
ms.author: hobruche
---

# Leverage Azure API Management and virtual network peering (for example, SAP S/4HANA Private Cloud or Native)

> [!Important]
> When consuming SAP APIs and interfaces, always ensure your usage complies with [SAP's API Policy](https://help.sap.com/doc/sap-api-policy/latest/en-US/API_Policy_latest.pdf). Please check with your SAP contact or account team if you have questions about permitted API usage in your specific scenario.


## Why would you use this scenario?
Many customers are running their SAP Systems on Azure, either operating it by themselves or in a RISE / SAP S/4HANA Private Cloud Edition setup. 

In both cases, the fact that the SAP system is running in an Azure virtual network, enables other Azure services to connect to the SAP system without the need to go over the internet. Different virtual networks can be connected / peered so that internal IP addresses of the SAP system can be exposed to other Azure services

> [!Note]
> It is important to point out that the setup also works if you SAP system is not running on Azure. In this case you can still use Azure API Management, but virtual network peering is obviously not possible. In case you need to combine this setup with a proxy like the [on-premises data gateway](./architecture-on-premises-data-gateway.md)

Some of the Azure services frequently used are Logic Apps and Azure API Management. Especially Azure API Management enables SAP customer not only to expose their APIs in a secure and managed way, but also expose them as MCP servers (currently in preview). In addition, sophisticated authentication flows to enable single sign-on / Principal propagation are also documented and tested with lots of customers. 



* [Set up Microsoft Entra ID, Azure API Management, and SAP for SSO from SAP OData connector](/power-platform/sap/connect/entra-id-apim-oauth)

![Diagram showing the Azure virtual network peering architecture.](../media/azure-apim-virtual-network.jpg)



## Setup and configuration
In order to use Azure API Management with a peered virtual network where your SAP System is running, you need to deploy ("inject") your API Management instance in a subnet in a non-internet-routable network to which you control access. This network has to be peered with the network your SAP system is running. 


* [Quickstart: Create a new Azure API Management instance by using the Azure portal](/azure/api-management/get-started-create-service-instance)
* [Use a virtual network to secure inbound or outbound traffic for Azure API Management](/azure/api-management/virtual-network-concepts#virtual-network-injection-classic-tiers)
* [Azure virtual network peering](/azure/virtual-network/virtual-network-peering-overview)
* [Connectivity with SAP RISE](/azure/sap/workloads/rise-integration-network)

### Agent and Copilot development 
The connectivity via Azure API Management allows you to consume any HTTP based services from the SAP system. Most likely these services are (SAP) OData Services, which can be consumed by the SAP OData Connector in Copilot Studio, and also via pro-code solutions (for example, Microsoft 365 Agent Toolkit in Visual Studio Code)

* [Get started with the SAP OData Connector](/power-platform/sap/connect/sap-odata-connector)
* [Microsoft 365 Agents Toolkit - Add cloud resources and API connection](/microsoftteams/platform/toolkit/add-resource)

### Integration and connectivity infrastructure
You have to define the APIs, which should be exposed via Azure API Management from the SAP System first. This can be done manually, or also using OData or OpenAPI specifications.

* [Define APIs](/azure/api-management/add-api-manually)

In addition to that you can apply Policies that enable single sign-on / Principal Propagation to the SAP backend system. 

* [Policy for Azure API Management for SSO](https://github.com/Azure/api-management-policy-snippets/blob/master/examples/Request%20OAuth2%20access%20token%20from%20SAP%20using%20AAD%20JWT%20token.xml)
* [Setup SSO End-to-End](https://github.com/hobru/Single-Sign-On-with-Power-Platform-and-SAP)


### Proxy / connectivity
One of the main benefits of this setup is, that you don't need an extra proxy. Azure API Management acts as this proxy and ensures that you SAP system is protected behind a firewall in a private Network. 


### Backend systems and data sources
For available SAP OData and REST APIs, check the SAP Business Accelerator Hub. 
If no fitting APIs are available, you can create your own services using the RESTful Application Programming Model or use the SAP Gateway Service Builder.  

* [SAP Business Accelerator Hub](https://api.sap.com/)
* [ABAP RESTful Application Programming Model - Creating an OData Service](https://help.sap.com/docs/abap-cloud/abap-rap/creating-odata-service)

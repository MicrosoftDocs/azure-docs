---
title: SAP with Microsoft AI Architecture - SAP BTP with API Management and Cloud Connector
description: Copilot Studio integration with SAP using SAP Business Technology Platform, SAP API Management, and SAP Cloud Connector.
author: hobru
ms.service: sap-on-azure
ms.subservice: center-sap-solutions
ms.topic: overview
ms.custom: microsoft-ai
ms.date: 05/03/2026
ms.author: hobruche
---

# Use SAP Business Technology Platform (with SAP API Management and SAP Cloud Connector)

> [!Important]
> When consuming SAP APIs and interfaces, always ensure your usage complies with [SAP's API Policy](https://help.sap.com/doc/sap-api-policy/latest/en-US/API_Policy_latest.pdf). Please check with your SAP contact or account team if you have questions about permitted API usage in your specific scenario.

## Why would you use this scenario?
Many customers that want to build a Copilot connected to SAP, already have the SAP Business Technology Platform in place. The huge benefit here is, that integrations to the SAP Backend system -- often on-premises -- are already established using SAP Cloud Connector. 

Whether you're using Microsoft Copilot Studio, Azure AI Foundry or the Microsoft 365 Agent AI Toolkit, the connectivity to the services from your SAP backend system, are exposed via SAP BTP services like SAP API Management, SAP Integration Suite or a custom developed SAP App Proxy. 

This combination enables the SAP team (managing SAP BTP and the access to the SAP System) at the customer to work together with the Microsoft team (building the Copilot Agent). 

In most cases the Copilot would call a REST based API (OData, REST, SOAP). This API is exposed and protected via services on the SAP Business Technology Platform. Here also the authentication can happen (so that true SSO / Principal propagation scenarios can be used). 

SAP BTP then forwards the request via the SAP Cloud Connector to the SAP Backend System. 

![Diagram showing the SAP Business Technology Platform API management architecture.](../media/apim-cloud-connector-business-process-api-management.jpg)

This architecture only depicts one path; you can use multiple variations for the connection.

## Setup and configuration
In this scenario in most cases the SAP Business Technology platform is in place and also the SAP Cloud Connector is already installed.

### Agent and Copilot development 
In Copilot Studio, use the SAP OData Connector or the HTTP Connector to connect to the service exposed on BTP. You can either use the connectors directly from Copilot Studio, or use a Power Automate flow to add extra logic before / after calling the API. 
Using the SAP OData Connector you can also implement single sign-on from Entra ID to the SAP Business Technology Platform.

* [Get started with the SAP OData Connector](/power-platform/sap/connect/sap-odata-connector)
* [What is Microsoft Power Platform integration with SAP?](/power-platform/sap/explore/power-platform-and-sap-integration)
* [Power Platform + SAP: Updates via SAP OData services](https://youtu.be/mez5qIZmrfM?si=b22hyxSTlspy-HR_)

### Authentication
In most cases the expectation from users using Copilot is that there's a principal propagation in place. This means that  the user that is logged on to Copilot, is also the user that is authenticated in the SAP backend system. The use of principal propagation not only ensures that auditing and activity traces in the SAP system are tracked in the user context, but also that the user only has access to the data that they're allowed to have. 

For all integration scenarios via the SAP Business Technology Platform Principal Propagation flows are documented.  

* [Principal propagation in a multicloud solution between Microsoft Azure and SAP, Part IV: SSO with a Copilot Studio  Chatbot and on-premises Data Gateway](https://community.sap.com/t5/technology-blog-posts-by-members/principal-propagation-in-a-multi-cloud-solution-between-microsoft-azure-and/ba-p/13519225)
* [Power Platform + SAP OData - single sign-on - Happy path](https://youtu.be/NSE--fVLdUg?si=eYnXYX5DLuyMwuY3)

### Integration and connectivity infrastructure
The easiest way to expose APIs from your SAP backend system is via the SAP Integration Suite. In this example, we're using the SAP API Management. The policy of the API Proxy can also be enhanced to support the Principal Propagation Flow to enable single sign-on from the Copilot Agent to the SAP backend system. 

* [Principal Propagation via Entra Id](https://api.sap.com/policytemplate/Principal_Propagation_via_Entra_ID)
* [SuccessFactors Principal Propagation via Entra ID](https://api.sap.com/policytemplate/SuccessFactors_Principal_Propagation_via_Entra_Id)

### Proxy / connectivity
When connecting to a public facing SAP System (for example, SAP SuccessFactors, SAP S/4HANA Cloud, Public Edition), the SAP API Management solution can connect directly to the backend system. 
If the SAP System is behind a firewall (for example, running on-premises), then the SAP Cloud Connector can be used to link your on-premises system with SAP API Management

* [Cloud Connector](https://help.sap.com/docs/connectivity/sap-btp-connectivity-cf/cloud-connector)


### Backend systems and data sources
For available SAP OData and REST APIs, check the SAP Business Accelerator Hub. 
If no fitting APIs are available, you can create your own services using the RESTful Application Programming Model or use the SAP Gateway Service Builder.  

* [SAP Business Accelerator Hub](https://api.sap.com/)
* [ABAP RESTful Application Programming Model - Creating an OData Service](https://help.sap.com/docs/abap-cloud/abap-rap/creating-odata-service)

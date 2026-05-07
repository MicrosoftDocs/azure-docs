---
title: SAP with Microsoft AI Architecture - Demo Scenario (Public SAP System)
description: Quick-start architecture for SAP with Microsoft AI connecting Microsoft Copilot Studio and SAP integration using a publicly available SAP system for demo purposes.
author: hobru
ms.service: sap-on-azure
ms.subservice: center-sap-solutions
ms.topic: overview
ms.custom: microsoft-ai
ms.date: 05/03/2026
ms.author: hobruche
---

# SAP System publically available (most likely a demo scenario)

> [!Important]
> When consuming SAP APIs and interfaces, always ensure your usage complies with [SAP's API Policy](https://help.sap.com/doc/sap-api-policy/latest/en-US/API_Policy_latest.pdf). Please check with your SAP contact or account team if you have questions about permitted API usage in your specific scenario.

Unlike the other architectures described here, this is your Quick-Start architecture. The goal is to quickly show you how to get started and see the Copilot Studio and SAP integration in action. For production ready scenarios, please look at the other architectures as well.  

## Why would you use this scenario?
The assumption is that you have already an SAP OData Service, that's accessible from the internet. In most cases, this is probably not the case or you have other means of protecting your endpoints already in place. 

In the following steps, we'll use the public SAP Gateway Development system. This is a public hosted system from SAP that exposes the Enterprise Procurement Model (EPM) via the GWSAMPLE_BASIC OData service. If you don't have access yet, you can register for the [SAP Gateway Demo System here](https://developers.sap.com/tutorials/gateway-demo-signup.html)

> [!Note]
> Since the SAP Gateway Development system is being [decommissioned](https://community.sap.com/t5/technology-blog-posts-by-sap/sap-gateway-demo-system-will-be-de-commissioned/ba-p/13353480) the recommendation for now is just to use any other public OData service (e.g. https://services.odata.org/v4/TripPinServiceRW). An alternative is to use the SAP Business Accelerator Hub, register and use an OData service for Read-only scenarios. 

## Setup and configuration
Make sure to register for the SAP Gateway Demo System. You should be able to access the data with your P- or S-User in a browser, for example, 
````URL
https://<servername>/sap/opu/odata/iwbep/GWSAMPLE_BASIC/
```` 
 A list of five Products can be retrieved via, 
 ````URL
 https://<servername>/sap/opu/odata/iwbep/GWSAMPLE_BASIC/ProductSet?$top=5
```` 

### Agent and Copilot development 
The easiest way to get started is with Copilot Studio. You can start a free trial at [Microsoft Copilot Studio](https://www.microsoft.com/en-us/microsoft-365-copilot/microsoft-copilot-studio). Then you can use the SAP OData Connector to connect to the public endpoint of the GWSAMPLE_BASIC Service. 

The [Microsoft 365 Agents Toolkit](/microsoft-365/developer/overview-m365-agents-toolkit) also enables you to access external APIs, like the GWSAMPLE_BASIC OData service, via [API Plugins](/microsoft-365-copilot/extensibility/overview-api-plugins). Since there's no native OData support, you might need to convert the OData specification into an OpenAPI specification. You can follow the instructions of the online tool [here](https://convert.odata-openapi.net/) to do that. Then you can use the instruction [here](/microsoft-365-copilot/extensibility/build-api-plugins-existing-api) using the OpenAPI specification. 

### Integration and connectivity infrastructure
In this scenario, the OData services are accessible directly from the internet. Because of this no extra integration layer is required. In a productive environment, you would probably use an API Management solution (like [SAP API Management](./architecture-business-technology-platform-api.md) or [Azure API Management](./architecture-apim-virtual-network.md) solution)

### Backend systems and data sources
In our case, the SAP Gateway Demo system is an SAP ECC System. However, you can also access SAP S/4HANA Systems, for example the Sandbox systems provided via the [SAP Business Accelerator Hub](https://hub.sap.com/) 

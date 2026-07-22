---
title: "SAP with Microsoft AI Architecture: Demo Scenario (Public SAP System)"
description: Learn about an architecture that demonstrates integration of Microsoft Copilot Studio with SAP by using a publicly available SAP system.
author: hobru
ms.service: sap-on-azure
ms.subservice: center-sap-solutions
ms.topic: overview
ms.custom: microsoft-ai
ms.date: 05/03/2026
ms.author: hobruche
---

# Publicly available SAP system (demo scenario)

> [!IMPORTANT]
> When you're consuming SAP APIs and interfaces, always ensure that your usage complies with [SAP's API policy](https://help.sap.com/doc/sap-api-policy/latest/en-US/API_Policy_latest.pdf). If you have questions about permitted API usage in your specific scenario, check with your SAP contact or account team.

The goal of this architecture is to quickly get started and see the integration of Microsoft Copilot Studio with SAP in action. This architecture is for demonstration purposes and isn't for a production-ready scenario.

The assumption is that you have already an SAP OData service that's accessible from the internet. In most cases, you don't have this setup or you have other means of protecting your endpoints already in place.

## Setup and configuration

For this configuration, use a public OData service (such as [this example](https://services.odata.org/v4/TripPinServiceRW)). An alternative is to use the SAP Business Accelerator Hub to register and use an OData service for read-only scenarios.

Access the data by using your P-User or S-User in a browser. For example:

````URL
https://<servername>/sap/opu/odata/iwbep/GWSAMPLE_BASIC/
````

Retrieve a list of five products via:

````URL
 https://<servername>/sap/opu/odata/iwbep/GWSAMPLE_BASIC/ProductSet?$top=5
````

### Agent and Copilot development

The easiest way to get started is with Copilot Studio. You can start a free trial on the [Copilot Studio home page](https://www.microsoft.com/en-us/microsoft-365-copilot/microsoft-copilot-studio). Then you can use the SAP OData connector to connect to the public endpoint of the `GWSAMPLE_BASIC` service.

You can also use the [Microsoft 365 Agents Toolkit](/microsoft-365/developer/overview-m365-agents-toolkit) to access external APIs like the `GWSAMPLE_BASIC` OData service, via [API plugins](/microsoft-365-copilot/extensibility/overview-api-plugins). Because there's no native OData support, you might need to convert the OData specification into an OpenAPI specification by following the instructions in the [online tool](https://convert.odata-openapi.net/). Then you can use [these instructions](/microsoft-365-copilot/extensibility/build-api-plugins-existing-api) for using the OpenAPI specification.

### Integration and connectivity infrastructure

In this scenario, the OData services are accessible directly from the internet. No extra integration layer is required. In a production environment, you would probably use an API management solution like [SAP API Management](./architecture-business-technology-platform-api.md) or [Azure API Management](./architecture-apim-virtual-network.md).

### Back-end systems and data sources

The example in this article uses an SAP ECC system. However, you can also access SAP S/4HANA systems, such as the sandbox systems provided via the [SAP Business Accelerator Hub](https://hub.sap.com/).

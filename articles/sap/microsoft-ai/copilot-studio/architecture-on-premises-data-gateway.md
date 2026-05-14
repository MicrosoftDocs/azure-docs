---
title: "SAP with Microsoft AI Architecture: On-Premises Data Gateway"
description: Learn about Copilot Studio integration with SAP via the on-premises data gateway for BAPI, RFC, and OData access.
author: hobru
ms.service: sap-on-azure
ms.subservice: center-sap-solutions
ms.topic: overview
ms.custom: microsoft-ai
ms.date: 05/03/2026
ms.author: hobruche
---

# On-premises data gateway with access to BAPIs, RFCs, and OData services

> [!IMPORTANT]
> When you're consuming SAP APIs and interfaces, always ensure that your usage complies with [SAP's API policy](https://help.sap.com/doc/sap-api-policy/latest/en-US/API_Policy_latest.pdf). If you have questions about permitted API usage in your specific scenario, check with your SAP contact or account team.

Many customers come from the Microsoft Power Platform and SAP integration and already created Power BI reports, Power Apps flows, and Power Automate flows that connect to SAP systems.

Often, customers use BAPIs and RFCs to fetch and update information in the SAP system. To do that, they must use the on-premises data gateway together with the SAP .NET Connector.

Like the SAP Cloud Connector, the on-premises data gateway enables access to the SAP system from Power Platform and Microsoft Copilot Studio, even if firewalls are in place.

You can use this setup if you want to connect to BAPIs or RFCs, or if you're using another SAP integration from Power Platform.

![Diagram that shows the on-premises data gateway architecture.](../media/apim-cloud-connector-on-premises.jpg)

## Setup and configuration

To enable access to the SAP back-end system, [download](https://www.microsoft.com/en-us/download/details.aspx?id=53127&msockid=08f9467b101a6a152949535411a26b2f) and install the on-premises data gateway on a Windows server that has access to your SAP system. This server could be your client on which the SAP GUI is also running (which we don't recommend for production use) or a dedicated machine that's connected to the SAP system.

![Screenshot of the on-premises data gateway installed next to the SAP GUI.](../media/on-premises-data-gateway-installed.jpg)

During the installation, you have to log in as a user from your Power Platform environment to establish the trust and connection with this environment. Afterward, the gateway and connection status appears in your environment.

![Screenshot of the connectivity status of the on-premises data gateway in the Power Platform environment.](../media/registered-gateway.jpg)

In addition to the on-premises data gateway, you need to install the SAP .NET Connector if you want to integrate with BAPIs and RFCs. The SAP .NET Connector translates the incoming HTTP requests in the DIAG protocol that SAP proprietary APIs use.

![Screenshot of the SAP .NET Connector installation.](../media/sap-net-connector.jpg)

### Agent and Copilot development

For this setup, Copilot agents are most likely developed via Copilot Studio. Copilot Studio has access to the on-premises data gateway. It also comes with several SAP ERP connectors that provide access to the BAPIs and RFCs that the SAP system exposes.

![Screenshot of SAP ERP connectors in Copilot Studio.](../media/sap-erp-connectors.jpg)

Although organizations mainly use SAP and the on-premises data gateway for BAPIs and RFCs, you can also use them to expose SAP OData services.

![Screenshot of the SAP OData connector in Copilot Studio.](../media/sap-odata-connector.jpg)

### Authentication

With BAPIs and RFCs, an authentication that uses Kerberos and X.509 certificates is possible. Users can authenticate to Copilot Studio with their regular Microsoft Entra ID credentials and then access their SAP system with the propagated user credentials.

For more information, see:

* [Set up Microsoft Entra ID with Kerberos for SSO](/power-platform/sap/connect/entra-id-kerberos)
* [Set up Microsoft Entra ID with certificates for SSO](/power-platform/sap/connect/entra-id-certs)

### Integration and connectivity infrastructure

Typically, SAP systems have BAPIs and RFCs enabled by default. You can test the APIs by using transaction SE37 in the SAP GUI. No other exposure is typically required.  

### Proxy and connectivity

As outlined earlier, you must configure the on-premises data gateway together with the SAP .NET Connector. Make sure that the gateway is connected to the correct region and environment in Power Platform.

### Back-end systems and data sources

Because BAPIs and RFCs have existed for a long time, almost all SAP ERP systems can be connected.

Newer SAP systems, like SAP SuccessFactors, SAP Ariba, SAP Concur, and SAP S/4HANA Cloud Public Edition, don't support BAPIs and RFCs. For these systems, SAP OData services or other REST-based integrations are more suitable.

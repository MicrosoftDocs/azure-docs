---
title: SAP with Microsoft AI Architecture - SAP MCP Gateway on SAP Integration Suite
description: Copilot Studio integration with SAP using the SAP MCP Gateway on SAP Integration Suite over the Model Context Protocol.
author: hobru
ms.service: sap-on-azure
ms.subservice: center-sap-solutions
ms.topic: overview
ms.custom: microsoft-ai
ms.date: 08/03/2026
ms.author: hobruche
---

# Use the SAP MCP Gateway on SAP Integration Suite

> [!NOTE]
> This integration is a documented and approved SAP reference architecture. For SAP's guidance on consuming SAP data and processes from AI agents through the Model Context Protocol, and specifically on connecting Microsoft Copilot Studio to the SAP MCP Gateway, see the SAP Architecture Center reference architectures [Third-Party MCP Access to SAP Solutions](https://architecture.learning.sap.com/docs/ref-arch/137800) and [Microsoft Copilot Studio and the MCP Gateway in SAP Integration Suite](https://architecture.learning.sap.com/docs/ref-arch/d2e34e).

## Why use this scenario?
The [Model Context Protocol (MCP)](https://modelcontextprotocol.io) is the standard way for AI agents to discover and call tools. Instead of wiring a Copilot to one fixed API at a time, an MCP based integration lets the agent dynamically discover the available SAP tools, understand their inputs and outputs, and build the correct request to retrieve or update data in the SAP system.

By using the **SAP MCP Gateway** - a capability of the **SAP Integration Suite** (running on the Integration Suite's edge / Integration Cell runtime) - SAP provides a **governed, SAP-managed MCP endpoint**. The MCP Gateway turns existing SAP APIs, integration flows, and OpenAPI specifications into MCP tools, without you having to build and host your own MCP server.

This scenario is a good fit if you:

* Already use (or plan to use) the SAP Integration Suite to expose SAP data and processes.
* Want a single, governed MCP entry point that mixes SAP and non-SAP APIs as tools.
* Need enterprise controls - authentication, rate limiting, payload protection, observability, and tool lifecycle management - managed by SAP rather than in custom code.
* Want every tool call to run **as the signed-in user** so that SAP authorizations, auditing, and data visibility are respected (see [Authentication](#authentication)).

:::image type="content" source="../media/mcp-gateway-integration-suite.png" alt-text="Diagram showing Copilot Studio connecting to the SAP MCP Gateway on SAP Integration Suite." lightbox="../media/mcp-gateway-integration-suite.png":::

This architecture depicts one common path. You can use multiple variations depending on your backend and connectivity.

## Setup and configuration
On the SAP side, SAP Integration Suite provisions the SAP MCP Gateway. You select the SAP APIs, integration flows, or OpenAPI specifications you want to expose and choose which operations become MCP tools. The MCP Gateway then exposes those tools over the **Streamable HTTP** transport (the Server-Sent Events transport is deprecated) and enforces the configured authentication and governance policies.

On the Microsoft side, Copilot Studio acts as the **MCP client**. You register the MCP server (the SAP MCP Gateway endpoint) in Copilot Studio, and the agent gains access to the exposed SAP tools.

A complete, end-to-end walkthrough - from building an MCP server on the Integration Suite, to adding OAuth, to running as a real SAP user with principal propagation - is available in this step-by-step guide:

* [SAP MCP Gateway with Microsoft Copilot Studio (setup guide and samples)](https://github.com/hobru/sap-mcp-gateway-copilot-studio)
* [SAP MCP Gateway with Microsoft Copilot Studio (video series)](https://www.youtube.com/watch?v=jE-qlg2vZ6I&list=PLNdLCaIOFtdA)

### Agent and Copilot development
In Copilot Studio, add the SAP MCP Gateway as an MCP server. Copilot Studio discovers the exposed tools and lets the agent call them as part of a conversation or an autonomous flow. Because the MCP server describes the tools, the agent can reason about which tool to call and how to build the payload, without a hand-crafted connector per operation.

* [Extend your agent with Model Context Protocol in Copilot Studio](/microsoft-copilot-studio/agent-extend-action-mcp)
* [Connect your agent to an existing MCP server](/microsoft-copilot-studio/mcp-add-existing-server-to-agent)

### Authentication
The SAP MCP Gateway uses the **OAuth 2.0 authorization code flow**, so every tool call carries the identity of the signed-in Copilot user. **Microsoft Entra ID** is federated with **SAP Cloud Identity Services (SAP IAS)**, and the gateway validates the SAP IAS-issued token. This approach keeps the integration future-proof as SAP moves to SAP Cloud Identity Services and the Authorization Management Service (AMS).

Because this identity flow is the same for any Copilot Studio integration that fronts SAP with SAP Cloud Identity Services, it's documented once as a reusable pattern:

* [Single sign-on from Copilot Studio to SAP with Microsoft Entra ID and SAP Cloud Identity Services](sso-entra-id-sap-cloud-identity-services.md)

### Integration and connectivity infrastructure
The SAP Integration Suite is the integration and connectivity layer in this scenario. The MCP Gateway builds on Integration Suite capabilities so that you get, out of the box:

* OAuth and OpenID Connect enforcement on every request.
* Rate limiting and quota handling aligned with the backend.
* Payload protection and observability.
* Tool lifecycle management and shielding of consumers from backend specification changes.
* The ability to combine SAP and non-SAP APIs behind one governed MCP endpoint.

* [SAP Integration Suite](https://help.sap.com/docs/integration-suite)
* [SAP Integration Suite -- edge integration cell](https://help.sap.com/docs/integration-suite/sap-integration-suite/what-is-edge-integration-cell)

### Proxy and connectivity
When the SAP MCP Gateway connects to a public-facing SAP system (for example, SAP S/4HANA Cloud, Public Edition, or SAP SuccessFactors), it can reach the backend directly. When the target SAP system runs behind a firewall (for example, on-premises or in a private cloud), the **SAP Cloud Connector** bridges the connection. Combined with a BTP destination configured for **principal propagation**, the Cloud Connector also propagates the signed-in user's identity all the way into the SAP backend as a real ABAP user (see the [single sign-on](sso-entra-id-sap-cloud-identity-services.md) page).

* [Cloud Connector](https://help.sap.com/docs/connectivity/sap-btp-connectivity-cf/cloud-connector)

### Backend systems and data sources
Any SAP data or process that you can expose through the SAP Integration Suite can become an MCP tool - OData and REST APIs, SOAP services, or integration flows. For available SAP APIs, check the SAP Business Accelerator Hub. If no fitting API exists, you can create your own service with the ABAP RESTful Application Programming Model.

* [SAP Business Accelerator Hub](https://api.sap.com/)
* [ABAP RESTful Application Programming Model - Creating an OData Service](https://help.sap.com/docs/abap-cloud/abap-rap/creating-odata-service)

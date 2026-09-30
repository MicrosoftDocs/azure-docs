---
title: SAP with Microsoft AI - SSO with Microsoft Entra ID and SAP Cloud Identity Services
description: Reusable single sign-on and principal propagation pattern from Copilot Studio to SAP using Microsoft Entra ID, SAP Cloud Identity Services, and SAP Cloud Connector.
author: hobru
ms.service: sap-on-azure
ms.subservice: center-sap-solutions
ms.topic: concept-article
ms.custom: microsoft-ai
ms.date: 08/03/2026
ms.author: hobruche
---

# Single sign-on from Copilot Studio to SAP with Microsoft Entra ID and SAP Cloud Identity Services

When a user talks to a Copilot Studio agent that reaches into SAP, the expectation is a true **single sign-on (SSO)** experience: the person signed in to the agent is the same user that's authenticated in the SAP backend. This approach ensures that SAP authorizations are respected, users only see the data they're allowed to see, and every action is audited in the correct user context.

This article describes the **reusable identity pattern** that applies to any Copilot Studio (or Power Platform) integration that fronts SAP with **SAP Cloud Identity Services**. For example, the pattern is used by the [SAP MCP Gateway on SAP Integration Suite](architecture-mcp-gateway-integration-suite.md) scenario, but the same building blocks apply whenever SAP Cloud Identity Services brokers identity into SAP.

## The identity chain
You achieve single sign-on into SAP in two stages:

1. **Front door (identity brokering)** -- Microsoft Entra ID authenticates the user and exchanges the token for an SAP Cloud Identity Services token that SAP services trust.
1. **Last mile (principal propagation)** -- The user's identity is propagated from SAP Business Technology Platform (BTP) through the SAP Cloud Connector into the on-premises SAP backend, where it's mapped to a real SAP (ABAP) user.

:::image type="content" source="../media/mcp-gateway-principal-propagation-flow.png" alt-text="Diagram showing the principal propagation flow from Microsoft Entra ID through SAP Cloud Identity Services and SAP Cloud Connector into the SAP backend." lightbox="../media/mcp-gateway-principal-propagation-flow.png":::

## Front door: Microsoft Entra ID federated with SAP Cloud Identity Services
**SAP Cloud Identity Services** (the identity authentication service, formerly SAP IAS) acts as the identity provider in front of SAP. Microsoft Entra ID is federated **into** SAP Cloud Identity Services over OpenID Connect, so users sign in with their normal Entra ID credentials while SAP services receive a token issued by SAP Cloud Identity Services.

Using SAP Cloud Identity Services as the front door is the future-proof choice: SAP is standardizing on SAP Cloud Identity Services together with the Authorization Management Service (AMS), which is replacing the classic XSUAA-based model.

A typical setup uses **two application registrations**:

* An **application registration in Microsoft Entra ID** that represents the trust from SAP Cloud Identity Services into Entra ID. Here, SAP Cloud Identity Services is the client that federates with Entra ID.
* An **application in SAP Cloud Identity Services** that represents Copilot Studio as the client. SAP Cloud Identity Services is the identity provider, and the token it issues (with the correct audience) is what the SAP endpoint -- for example, the SAP MCP Gateway -- validates.

Because SAP Cloud Identity Services doesn't use custom OAuth scopes the way XSUAA does, the receiving SAP endpoint typically validates the token's **audience** and **issuer** rather than a scope, and relies on a stable user claim (such as the user's email) to identify the person.

The **OAuth 2.0 authorization code flow** is used so that the signed-in user's identity - not a static service identity - travels with every request.

## Last mile: principal propagation into the SAP backend
When the SAP backend is a public cloud system, the SAP Cloud Identity Services token is often enough to authenticate the user directly. When the backend is an **on-premises (or private cloud) SAP system**, you need to carry the identity through the SAP Cloud Connector using **principal propagation**:

1. On SAP BTP, configure a **destination** with `Authentication = PrincipalPropagation` that points to the on-premises system through the **SAP Cloud Connector**.
1. The **SAP Cloud Connector** creates a short-lived **X.509 certificate** for the request, with the common name (CN) set to the user's identity (for example, their email address), signed by the Cloud Connector's principal propagation certificate authority.
1. The Cloud Connector establishes mutual TLS to the SAP backend's Internet Communication Manager (ICM).
1. In the SAP backend, a certificate rule (**CERTRULE** / transaction `CERTRULE`) maps the certificate's common name to a real SAP (`SU01`) ABAP user.

From that point on, the request executes under the real SAP user, so all SAP authorization checks, auditing, and traces apply in the correct user context.

## Related patterns for Power Platform and Copilot Studio
The same "Entra ID to SAP" identity principles are documented for a range of connectors and protocols. Depending on the connector and backend you use, one of the following patterns might apply:

* [Set up Microsoft Entra ID and Azure API Management with OAuth for SSO](/power-platform/sap/connect/entra-id-apim-oauth)
* [Set up Microsoft Entra ID single sign-on with SAP SuccessFactors](/power-platform/sap/connect/entra-id-using-successfactors)
* [Set up Microsoft Entra ID with Kerberos for SSO](/power-platform/sap/connect/entra-id-kerberos)
* [Set up Microsoft Entra ID with certificates for SSO](/power-platform/sap/connect/entra-id-certs)
* [Get started with the SAP OData Connector](/power-platform/sap/connect/sap-odata-connector)

## Reference implementation
A complete, hands-on walkthrough of this identity chain - Microsoft Entra ID, SAP Cloud Identity Services, and principal propagation through the SAP Cloud Connector to an on-premises SAP system - is available here:

* [SAP MCP Gateway with Microsoft Copilot Studio (SSO and principal propagation guide)](https://github.com/hobru/sap-mcp-gateway-copilot-studio)

## Related resources
* [Principal propagation with the SAP Cloud Connector](https://help.sap.com/docs/connectivity/sap-btp-connectivity-cf/configure-principal-propagation)
* [SAP Cloud Identity Services](https://help.sap.com/docs/cloud-identity-services)
* [Cloud Connector](https://help.sap.com/docs/connectivity/sap-btp-connectivity-cf/cloud-connector)

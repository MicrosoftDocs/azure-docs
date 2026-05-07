---
title: SAP with Microsoft AI SAP Joule & Microsoft 365 Copilot Integration
description: How SAP Joule and Microsoft 365 Copilot integrate bi-directionally, including setup, architecture, and troubleshooting.
author: hobru
ms.service: sap-on-azure
ms.subservice: center-sap-solutions
ms.topic: overview
ms.custom: microsoft-ai
ms.date: 05/03/2026
ms.author: hobruche
---

# Joule and Microsoft 365 Copilot integration

SAP Joule and Microsoft 365 Copilot provide a bi-directional integration that allows end-users to access SAP capabilities directly from within Microsoft 365 Copilot and Microsoft Teams — without the need to build a custom agent. This page covers what the integration does, how to set it up, and how to troubleshoot it.

> [!Note]
> This integration is a managed SAP & Microsoft feature. It is different from building custom Copilot agents with Copilot Studio or Azure AI Foundry that access SAP data. For custom agent scenarios, see the [Copilots with SAP](../copilot-studio/copilot-with-sap-overview.md) documentation.

## What is the Joule ↔ Copilot integration?

The Joule integration brings SAP's digital assistant, Joule, into the Microsoft 365 Copilot experience. Through this integration:

- **Users in Microsoft 365 Copilot or Teams** can ask SAP-related questions (for example "@Joule Show me open purchase orders that are past their expected delivery dates") and the request is routed to SAP Joule for processing.
- **Users in SAP Joule** can use Microsoft 365 context when using Joule (for example, Find all 2026 emails from Vendor ACME Corp).

The integration is based on a trust relationship between SAP Cloud Identity Services and Microsoft Entra ID. SAP handles the natural language processing for SAP-specific tasks, while Microsoft handles the Copilot/Teams user experience.

## Key scenarios and use cases

| Scenario | Example |
| --- | --- |
| **HR Self-Service** | Copilot "@Joule What is my remaining leave balance?" → routed to Joule → answered from SAP SuccessFactors |
| **Procurement** | Copilot “@Joule What is the estimated delivery date for PO 4500005674”→ Joule retrieves data from SAP S/4HANA Cloud |
| **Finance** | Copilot "@Joule What is the status of invoice 4500001234?" → answered from SAP S/4HANA Cloud |
| **Sales** | Joule “Find emails for product Rocket8000 from  WilyC@AcmeCorp.com”
| **Finance** | Joule “Find all emails from customers about late payments” |
| **Supply Chain** | Joule “Find Teams chats about inbound delivery delays to plant 2300 related to the recent hurricane” |

> [!Important]
> The Joule ↔ Copilot integration currently supports standard scenarios provided by SAP Joule and Microsoft 365 Copilot. It does **not** yet extend to custom-built agents (e.g. agents built in Copilot Studio).

## Supported SAP applications

The following SAP applications support the Joule integration with Microsoft 365 Copilot (check [SAP's documentation](https://help.sap.com/docs/joule/integrating-joule-with-sap/integrating-joule-with-microsoft-365-copilot) for the latest list):

- SAP S/4HANA Cloud, private cloud edition
- SAP S/4HANA Cloud, public edition
- SAP SuccessFactors
- SAP Ariba (selected scenarios)
- Other SAP cloud applications as supported by Joule

## Prerequisites

Before setting up the integration, ensure you have:

- **Microsoft 365 Copilot** license for end-users and the corresponding SAP licenses for Joule
- **SAP BTP** account with SAP Cloud Identity Services (IAS) configured
- **SAP Joule** enabled for your SAP applications
- **Microsoft Entra ID** (Azure AD) tenant with admin access
- Network connectivity between SAP BTP and Microsoft Entra ID (typically over the internet)

## Architecture overview

The integration follows a trust-based architecture:

![Diagram showing the Joule and Copilot architecture.](../media/joule-copilot-architecture.png)


### Key components

* **Microsoft Entra ID** — authenticates the Microsoft 365 user and establishes trust with SAP Cloud Identity Services
* **SAP Cloud Identity Services (IAS)** — acts as the identity proxy on the SAP side; maps the Microsoft user to an SAP user
* **SAP Joule (on BTP)** — Joule as the user interface routes the user request to Copilot and receives the result back in Joule
* **Microsoft 365 Copilot / Teams** — Copilot as the user interface routes SAP-related requests (using the prompt tag “@Joule”) to the Joule agent and receives the result back in Copilot

### Identity flow

1. User asks an SAP-related question in Microsoft 365 Copilot or Teams using the “@Joule” tag (for example “@Joule Show me open sales orders for Acme Corp”)
2. The user's identity is federated from Microsoft Entra ID → SAP Cloud Identity Services
3. SAP Cloud Identity Services maps the user to the corresponding SAP user
4. Joule processes the request against the SAP backend application
5. The response is returned to the user in Copilot / Teams

## Setup and configuration

### Step 1: Configure SAP Cloud Identity Services

1. Set up SAP Cloud Identity Services (IAS) as the identity provider for your SAP BTP subaccount
2. Establish a trust relationship between SAP IAS and Microsoft Entra ID
3. Configure user mapping (Microsoft Entra ID user ↔ SAP user)

👉 Detailed guide: [Configuring SAP Cloud Identity Services and Microsoft Entra ID for Joule](https://community.sap.com/t5/technology-blog-posts-by-sap/configuring-sap-cloud-identity-services-and-microsoft-entra-id-for-joule/ba-p/14105743)

### Step 2: Configure Microsoft Entra ID

1. Register the SAP Joule application in Microsoft Entra ID
2. Configure the necessary API permissions and consent
3. Set up the enterprise application for single sign-on

### Step 3: Enable Joule Agent in Copilot / Teams

1. Enable the Joule agent in the Microsoft 365 Admin Center or Teams Admin Center
2. Assign the agent to the relevant users or groups
3. Test the integration by asking an SAP-related question in Copilot or Teams

👉 Detailed guide: [Enable Microsoft Copilot and Teams to Pass Requests to Joule](https://community.sap.com/t5/technology-blog-posts-by-sap/enable-microsoft-copilot-and-teams-to-pass-requests-to-joule/ba-p/14109137)

👉 End-to-end walkthrough: [Integrate Joule and Microsoft 365 Copilot - SAP Discovery Center Mission](https://discovery-center.cloud.sap/missiondetail/4741/5025/)

## Limitations and known issues

- The integration is limited to **SAP Joule's built-in capabilities** — custom skills or agents built in Copilot Studio aren't routed through this integration. Check out the [SAP Joule capabilities](https://help.sap.com/doc/1b82af8383e2443eaa95a034a70beb1b/CLOUD/en-US/c0bb884c3e27438695f4750b547aac77.pdf) for a full list. 
- User mapping between Microsoft Entra ID and SAP must be correctly configured; mismatches will result in authentication errors
- Accessible Joule capabilities depend on the SAP applications and Joule skills enabled in your landscape
- Check [SAP Note 3722273](https://me.sap.com/notes/3722273) for the latest known issues and fixes
- Run the [Joule-Copilot Integration Validation Tool](https://github.com/microsoft/joule-copilot-integration-validation-tool) to troubleshoot your configuration

## Troubleshooting

| Symptom | Possible Cause | Resolution |
| --- | --- | --- |
| Joule agent not visible in Copilot/Teams | Agent not enabled in admin center | Enable via Microsoft 365 or Teams Admin Center |
| Authentication error when routing to Joule | Trust relationship misconfigured | Verify IAS ↔ Entra ID trust and user mapping |
| "No SAP data found" response | User not mapped to SAP user | Check user provisioning in SAP Cloud Identity Services |
| Timeout or no response | Network/connectivity issue | Check BTP connectivity and service health |

👉 SAP troubleshooting guide: [Joule - Monitoring and Troubleshooting](http://help.sap.com/docs/joule/serviceguide/troubleshooting)

## Links and resources

* [Integrating Joule with Microsoft 365 Copilot - Official Documentation](https://help.sap.com/docs/joule/integrating-joule-with-sap/integrating-joule-with-microsoft-365-copilot)
* [Configuring SAP Cloud Identity Services and Microsoft Entra ID for Joule](https://community.sap.com/t5/technology-blog-posts-by-sap/configuring-sap-cloud-identity-services-and-microsoft-entra-id-for-joule/ba-p/14105743)
* [Enable Microsoft Copilot and Teams to Pass Requests to Joule](https://community.sap.com/t5/technology-blog-posts-by-sap/enable-microsoft-copilot-and-teams-to-pass-requests-to-joule/ba-p/14109137)
* [Integrate Joule and Microsoft 365 Copilot - SAP Discovery Center](https://discovery-center.cloud.sap/missiondetail/4741/5025/)
* [Get help - SAP Note 3722273 - Joule and MS Copilot Integration](https://me.sap.com/notes/3722273)
* [Joule - Monitoring and Troubleshooting](http://help.sap.com/docs/joule/serviceguide/troubleshooting)

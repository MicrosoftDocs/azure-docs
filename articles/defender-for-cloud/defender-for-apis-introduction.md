---
title: Microsoft Defender for APIs overview
description: Learn about the benefits and features of Microsoft Defender for APIs
ms.date: 04/05/2023
author: elazark
ms.author: elkrieger
ms.topic: overview
---

# Overview of Microsoft Defender for APIs

Microsoft Defender for APIs is a plan provided by Microsoft Defender for Cloud that offers lifecycle protection, detection, and response coverage for APIs.

Defender for APIs helps you to gain visibility into business-critical APIs. You can analyze your API security posture, identify risks and vulnerabilities, detect active runtime threats, and prioritize remediation.

In a single console you can see security insights, recommendations, and alerts, making it easier to manage your API inventory, and prioritize remediation efforts.

> [!IMPORTANT]
> Defender for APIs is currently in PREVIEW.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

Defender for APIs currently provides security for APIs published in Azure API Management. I

## What can I do with Defender for APIs?

- **Inventory**: Get an aggregated view of all managed APIs.  
- **Insights**: Analyze APIs for security insights. Identify external, unused, and unauthenticated APIs, and get recommendations to harden at-risk surfaces. 
- **OWASP Top 10**: Ingest API traffic and monitor it. Detect exploitation of the [OWASP Top 10](https://owasp.org/www-project-top-ten/) critical security threats with runtime anomaly detection on traffic, using machine-learning and rule-based analytics. 
- **Threat response**: Integrate or export detection alerts into SIEM systems for investigation by existing threat response workflows. 
- **Defender for Cloud integration**: Integrate with Cloud Security Graph provided by the [Defender Cloud Security Posture Management (CSPM)](concept-cloud-security-posture-management.md) plan, for asset visibility and risk assessment across your clouds.


## Viewing your API inventory information

In the Defender for Cloud portal, you can view information about API collections and endpoints onboarded to Defender for APIs.

**Information** | **Details**
--- | ---
Endpoint name | The name of API endpoint/operation as defined in Azure API Management.
Endpoint | The URL path of the API endpoints, and the HTTPS method. 
Last called data (UTC) | The date when API traffic was last observed going to/from API endpoints (in UTC time zone). 
30 days unused | Shows whether API endpoints have received any API call traffic in the last 30 days. APIs that haven't received any traffic in the last 30 days are marked as Inactive. 
Authentication | Shows when a monitored API endpoint has no authentication. <br/><br/> Defender for APIs assess the authentication state using the subscription keys, JSON web token (JWT, and client certificate configured in Azure API Management. If none of these authentication mechanisms are present or executed, the API is marked as "unauthenticated".
External traffic observed date | The date when external API traffic was observed going to/from the API endpoint. 
Data classification | Classifies API request and response bodies based for supported data types. 

> [!NOTE]
> API endpoints that haven't received any traffic since onboarding to Defender for APIs display the status *Awaiting data* in the API dashboard.

## Hardening configurations and remediating risk

To identify and harden API configurations, you can apply API gateway security controls that support for monitoring controls against best practices. In addition, you can use Defender for Cloud's security recommendations to further identify critical API risks, and mitigate by risk priority.

## Detecting runtime threats

Defender for APIs monitors runtime traffic and threat intelligence feeds to provide threat detection capabilities with security alerts. API alerts detect the top 10 OWASP threats, data exfiltration, volumetric attacks, anomalous and suspicious API usage patterns.

Defender for APIs integrates with popular SIEM solutions to enable SOC teams with faster and more efficient remediation efforts.

## Investigating security risks

[Cloud Security Graph](concept-attack-path.md) in the Defender CSPM plan collects multicloud data to provide a map of assets and connections across your organization, to expose risks, vulnerabilities, and lateral movement possibilities. 

When Defender for APIs is enabled together with the Defender CSPM plan, you can query your organization's Cloud Security Graph using Cloud Security Explorer. Cloud Security Explorer provides you with improved visibility into your API resources, and the ability to proactively and efficiently query, navigate and locate API security issues and risks.

## Next steps

[Review support and prerequisites](defender-for-apis-prepare.md) for Defender for APIs deployment.

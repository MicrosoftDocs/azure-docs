---
title: Microsoft Defender for APIs overview
description: Learn about the benefits and features of Microsoft Defender for APIs
ms.date: 04/05/2023
author: elazark
ms.author: elkrieger
ms.topic: overview
---

# Overview of Microsoft Defender for APIs

Microsoft Defender for APIs is a plan provided by [Microsoft Defender for Cloud](defender-for-cloud-introduction) that offers security protection for APIs.

Defender for APIs helps you to gain visibility into business-critical APIs. You can analyze your API security posture, identify risks and vulnerabilities, detect real-time threats, and prioritize remediation.


> [!IMPORTANT]
> Defender for APIs is currently in PREVIEW.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

Defender for APIs currently provides security for APIs published in Azure API Management.

## What can I do with Defender for APIs?

- **Inventory and insights**: In a single dashboard, get an aggregated view of all managed APIs. Review security insights, identify misconfigurations, and detect threats.
- **Security posture**: Review and implement security recommendations to improve API security posture, and harden at-risk surfaces.
- **Real time threat detection**: Ingest API traffic and monitor it with runtime anomaly detection, using machine-learning and rule-based analytics, to detect API security threats, including the [OWASP Top 10](https://owasp.org/www-project-top-ten/) critical threats.
- **Defender for CSPM integration**: Integrate with Cloud Security Graph in [Defender Cloud Security Posture Management (CSPM)](concept-cloud-security-posture-management.md) for API visibility and risk assessment across your security graph.


## Reviewing inventory and insights

Get security insights on onboarded APIs in the API Security dashboard. The dashboard provides information about API collections and endpoints, as well as security posture recommendations, and security alerts.


**Dashboard information** | **Details**
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

## Reviewing security recommendations

API recommendations include recommendations for onboarding APIs to Defender for APIs, disabling and removing unused APIs, and security, authentication, access control best practices.

[Review the recommendations reference](recommendations-reference.md).


## Hardening API configuration

To identify and harden API configurations, you can apply API gateway security controls that support for monitoring controls against best practices. In addition, you can use Defender for Cloud's security recommendations to further identify critical API risks, and mitigate by risk priority.

## Detecting runtime threats

Defender for APIs monitors runtime traffic and threat intelligence feeds and issues threat detection alerts. API alerts detect the top 10 OWASP threats, data exfiltration, volumetric attacks, anomalous and suspicious API parameters, traffic, IP access, and usage patterns.

[Review the security alerts reference](alerts-reference.md).

## Responding to threats

Act on recommendations and alerts to mitigate threats. Defender for Cloud alerts and recommendations can be exported into SIEM systems such as Microsoft Sentinel, for investigation within existing threat response workflows for fast and efficient remediation. [Learn more](export-to-siem.md).

## Investigating security risks

[Cloud Security Graph](concept-attack-path.md) in the Defender CSPM plan collects multicloud data and presents a map (graph) of assets and connections across your organization, to expose risks, vulnerabilities, and possible lateral movement paths. 

When Defender for APIs is enabled together with the Defender CSPM plan, you can use Cloud Security Explorer to proactive and efficiently query your organizational security graph to navigate, identify, and remediate API assets, security issues, and risks.

## Next steps

[Review support and prerequisites](defender-for-apis-prepare.md) for Defender for APIs deployment.

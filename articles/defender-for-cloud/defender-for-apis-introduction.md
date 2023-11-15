---
title: Overview of the Microsoft Defender for APIs plan
description: Learn about the benefits of the Microsoft Defender for APIs plan in Microsoft Defender for Cloud
ms.date: 11/02/2023
author: dcurwin
ms.author: dacurwin
ms.topic: overview
---

# About Microsoft Defender for APIs

Microsoft Defender for APIs is a plan provided by [Microsoft Defender for Cloud](defender-for-cloud-introduction.md) that offers full lifecycle protection, detection, and response coverage for APIs.

Defender for APIs helps you to gain visibility into business-critical APIs. You can investigate and improve your API security posture, prioritize vulnerability fixes, and quickly detect active real-time threats.

> [!IMPORTANT]
> Defender for APIs is currently in PREVIEW.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

Defender for APIs currently provides security for APIs published in Azure API Management. Defender for APIs can be onboarded in the Defender for Cloud portal, or within the API Management instance in the Azure portal.

## What can I do with Defender for APIs?

- **Inventory**: In a single dashboard, get an aggregated view of all managed APIs.
- **Security findings**: Analyze API security findings, including information about external, unused, or unauthenticated APIs.
- **Security posture**: Review and implement security recommendations to improve API security posture, and harden at-risk surfaces.
- **API data classification**: Classify APIs that receive or respond with sensitive data, to support risk prioritization.
- **Threat detection**: Ingest API traffic and monitor it with runtime anomaly detection, using machine-learning and rule-based analytics, to detect API security threats, including the [OWASP API Top 10](https://owasp.org/www-project-api-security/) critical threats.
- **Defender CSPM integration**: Integrate with Cloud Security Graph in [Defender Cloud Security Posture Management (CSPM)](concept-cloud-security-posture-management.md) for API visibility and risk assessment across your organization.
- **Azure API Management integration**: With the Defender for APIs plan enabled, you can receive API security recommendations and alerts in the Azure API Management portal.
- **SIEM integration**: Integrate with security information and event management (SIEM) systems, making it easier for security teams to investigate with existing threat response workflows. [Learn more](tutorial-security-incident.md).

## Reviewing API security findings

Review the inventory and security findings for onboarded APIs in the Defender for Cloud API Security dashboard. The dashboard shows the number of onboarded devices, broken down by API collections, endpoints, and Azure API Management services:

:::image type="content" source="media/defender-for-apis-introduction/inventory.png" alt-text="Screenshot that shows the onboarded API inventory." lightbox="media/defender-for-apis-introduction/inventory.png":::

You can drill down into the API collection to review security findings for onboarded API endpoints:

:::image type="content" source="media/defender-for-apis-introduction/endpoint-details.png" alt-text="Screenshot for reviewing the API endpoint details." lightbox="media/defender-for-apis-introduction/endpoint-details.png":::

API endpoint information includes:

- **Endpoint name**: The name of API endpoint/operation as defined in Azure API Management.
- **Endpoint**: The URL path of the API endpoints, and the HTTP method.
Last called data (UTC): The date when API traffic was last observed going to/from API endpoints (in UTC time zone).
- **30 days unused**: Shows whether API endpoints have received any API call traffic in the last 30 days. APIs that haven't received any traffic in the last 30 days are marked as *Inactive*.
- **Authentication**: Shows when a monitored API endpoint has no authentication. Defender for APIs assesses the authentication state using the subscription keys, JSON web token (JWT), and client certificate configured in Azure API Management. If none of these authentication mechanisms are present or executed, the API is marked as *unauthenticated*.
- **External traffic observed date**: The date when external API traffic was observed going to/from the API endpoint.
- **Data classification**: Classifies API request and response bodies based on supported data types.

> [!NOTE]
> API endpoints that haven't received any traffic since onboarding to Defender for APIs display the status **Awaiting data** in the API dashboard.

## Investigating API recommendations

Use recommendations to improve your security posture, harden API configurations, identify critical API risks, and mitigate issues by risk priority.

Defender for API provides a number of recommendations, including recommendations to onboard APIs to the Defender for API plan, disable and remove unused APIs, and best practice recommendations for security, authentication, and access control.

[Review the recommendations reference](recommendations-reference.md).

## Detecting threats

Defender for APIs monitors runtime traffic and threat intelligence feeds, and issues threat detection alerts. API alerts detect the top 10 OWASP API threats, data exfiltration, volumetric attacks, anomalous and suspicious API parameters, traffic and IP access anomalies, and usage patterns.

[Review the security alerts reference](alerts-reference.md).

## Responding to threats

Act on alerts to mitigate threats and risk. Defender for Cloud alerts and recommendations can be exported into SIEM systems such as Microsoft Sentinel, for investigation within existing threat response workflows for fast and efficient remediation. [Learn more here](export-to-siem.md).

## Investigating Cloud Security Graph insights

[Cloud Security Graph](concept-attack-path.md) in the Defender CSPM plan analyses assets and connections across your organization, to expose risks, vulnerabilities, and possible lateral movement paths.

When Defender for APIs is enabled together with the Defender CSPM plan, you can use Cloud Security Explorer to proactively and efficiently query your organizational information to locate, identify, and remediate API assets, security issues, and risks:

:::image type="content" source="media/defender-for-apis-introduction/cloud-security-explorer.png" alt-text="Screenshot that shows the cloud security explorer." lightbox="media/defender-for-apis-introduction/cloud-security-explorer.png":::

### Query templates

There are two built-in query templates available for identifying your risky API assets, that you can use to search with a single click:

:::image type="content" source="media/defender-for-apis-introduction/templates-example.png" alt-text="Screenshot showing example query templates." lightbox="media/defender-for-apis-introduction/templates-example.png":::

## Next steps

[Review support and prerequisites](defender-for-apis-prepare.md) for Defender for APIs deployment.

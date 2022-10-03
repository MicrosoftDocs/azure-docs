---
title: Defender for Cloud planning multicloud security automate connector deployment guidance
description: Learn about automating connector deployment when planning multicloud deployment with Microsoft Defender for Cloud.
ms.topic: how-to
ms.date: 10/03/2022
---
# Automate connector deployment

This article is part of a series providing guidance as you design a cloud security posture management (CSPM) and cloud workload protection (CWP) solution across multicloud resources with Microsoft Defender for Cloud.

## Goal

Connect AWS accounts and/or GCP projects programmatically.

## Get started

As an alternative to creating connectors in the Defender for Cloud portal, you can create them programmatically by using the Defender for Cloud REST API.
Review the [Security Connectors - REST API](/rest/api/defenderforcloud/security-connectors).
:::image type="content" source="media/planning-multicloud-security/security-connectors.png" alt-text="screenshot that shows a table of security connector operations." lightbox="media/planning-multicloud-security/security-connectors.png":::

- When you use REST API to create the connector, you also need the CloudFormation template, or Cloud Shell script, depending on the environment that you’re onboarding to Defender for Cloud.
- The easiest way to get this script is to download it from the Defender for Cloud portal.
- Note that the template/script changes depending on the plans you’re enabling.

## Next steps

In this article, you've learned that as an alternative to creating connectors in the Defender for Cloud portal, you can create them programmatically by using the Defender for Cloud REST API. For more information, see [other resources](plan-multicloud-security-other-resources.md#).

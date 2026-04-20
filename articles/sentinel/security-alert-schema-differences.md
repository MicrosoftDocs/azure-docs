---
title: Microsoft Sentinel alert schema differences between standalone and XDR connectors
description: Learn how alert schema, field mappings, and ingestion behavior differ between standalone connectors and the XDR connector in Microsoft Sentinel.
author: guywi-ms
ms.author: guywild
ms.topic: reference
ms.date: 01/27/2026

# customer intent: As a security analyst, I want to understand how alerts differ when ingested through the XDR connector so that I can update my queries, analytic rules, and workbooks accordingly.
---

# Alert schema differences: Standalone vs. XDR connector

This article explains the differences between alerts ingested through standalone connectors and alerts ingested through the Extended Detection and Response (XDR) connector in Microsoft Sentinel.

Standalone connectors ingest alerts directly from the original security products, whereas the XDR connector ingests alerts through the Microsoft Defender XDR pipeline. This includes connectors such as Microsoft Defender for Office 365, Microsoft Defender for Endpoint, Microsoft Defender for Identity, Information Rights Management (IRM), Data Loss Prevention (DLP), Microsoft Defender for Cloud (MDC), and Microsoft Defender for Cloud Apps (MDA).

These differences can affect field mappings, derived field behavior, schema structure, and alert ingestion, which might impact your existing queries, analytic rules, and workbooks. Review these differences before migrating to the XDR connector.

For the full alert schema, see the [Security alert schema reference](security-alert-schema.md).

## CompromisedEntity behavior

The CompromisedEntity field is handled differently across products when alerts are ingested through the XDR connector.

| Product | CompromisedEntity equivalent value in XDR alerts |
|---------|----------------------------------------|
| Microsoft Defender for Endpoint (MDE) | The device where `"LeadingHost": true` in the alert entities JSON |
| Microsoft Entra ID (Identity Protection) | Always set to the user’s UPN |
| Microsoft Defender for Identity (MDI) | Fixed string `"CompromisedEntity"` |

> [!NOTE]
> In MDE alerts, CompromisedEntity is derived from the device where `"LeadingHost": true`. In some alerts, this field might not be populated.

In MDI alerts, CompromisedEntity doesn't represent a host or user and is always the literal string `"CompromisedEntity"`.

## Field mapping changes

Some fields are renamed or use different value sets in alerts from the XDR connector.

| Product | Legacy field/property | XDR behavior |
|---------|-----------------------|--------------|
| MDE | ExtendedProperties.MicrosoftDefenderAtp.Category | Mapped to `ExtendedProperties.Category` |
| Microsoft Defender for Office (MDO) | ExtendedProperties.Status | Uses a different value set from legacy |
| Microsoft Defender for Office (MDO) | ExtendedProperties.InvestigationName | Not available |

## Structural schema transformations (MDI)

The standalone Microsoft Defender for Identity (MDI) connector sometimes used placeholder entities to store additional information. In the XDR connector, this information is folded into properties under the `resourceAccessEvents` collection.

| Legacy entity/property | XDR representation |
|------------------------|-------------------|
| ResourceAccessInfo.Time | `resourceAccessEvents[].AccessDateTime` |
| ResourceAccessInfo.IpAddress | `resourceAccessEvents[].IpAddress` |
| ResourceAccessInfo.ResourceIdentifier.AccountId | `resourceAccessEvents[].AccountId` |
| ResourceAccessInfo.ResourceIdentifier.ResourceName | `resourceAccessEvents[].ResourceIdentifier` |
| DomainResourceIdentifier | `resourceAccessEvents[].ResourceIdentifier` |

ResourceAccessInfo.ComputerId is no longer required because it's 'identical to the Host entity that ResourceAccessInfo is defined in.

## Alert ingestion filtering

Some alerts available through standalone connectors aren't ingested through the XDR connector.

| Product | Filtering behavior |
|---------|--------------------|
| Microsoft Defender for Cloud (MDC) | Informational severity alerts aren't ingested |
| Microsoft Entra ID | By default, alerts below High severity aren't ingested; customers can configure ingestion to include all severities |

## Scoping behavior (Microsoft Defender for Cloud)

Microsoft Defender for Cloud alerts use different scoping when ingested through the XDR connector.

| Standalone connector scope | XDR connector scope |
|------------------------|---------------------|
| Subscription level | Tenant level |

> [!NOTE]
> All MDC alerts are available in the primary workspace for the tenant. Alerts are scoped according to MDC subscription scopes within Defender XDR.

## Next steps

- [Create and manage analytic rules](create-analytics-rules.md)
- [Use workbooks in Microsoft Sentinel](monitor-your-data.md)
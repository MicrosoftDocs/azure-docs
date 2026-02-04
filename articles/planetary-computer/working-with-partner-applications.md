---
title: Working with partner applications in Microsoft Planetary Computer Pro
description: Learn how to work with third-party geospatial data and service provider applications to read and deliver data to your Microsoft Planetary Computer Pro GeoCatalogs.
author: aloverro
ms.author: adamloverro
ms.service: planetary-computer-pro
ms.topic: overview
ms.date: 01/13/2026

#customer intent: As a Microsoft Planetary Computer Pro user, I want to understand how I can work with third party application providers so that they can make use of my existing geospatial data, and so that I can receive delivery of new geospatial data, directly from and to my Microsoft Planetary Computer Pro GeoCatalogs.
ms.custom:
  - build-2025
---

# Working with partner applications in Microsoft Planetary Computer Pro

Microsoft Planetary Computer Pro enables organizations to work directly with third-party geospatial data and service providers through cross-tenant application integration. Partner applications can read existing data from your GeoCatalogs for processing and analysis, and deliver new geospatial data products directly to your GeoCatalogs—eliminating the need for complex data pipelines and intermediate storage.

This article explains how partner application integration works, the scenarios it enables, and the roles and responsibilities for both customers and partners.

## Partner application scenarios

Microsoft Planetary Computer Pro supports two primary partner integration scenarios:

### Geospatial Data Providers (GDP)

Geospatial Data Providers supply geospatial data products such as satellite imagery, aerial photography, and derived datasets. With partner application integration, GDPs can deliver ordered data directly to a customer's GeoCatalog.

**Benefits over traditional delivery methods:**

| Traditional approach | Partner application approach |
| --------------------- | ------------------------------ |
| Download to local machine, then upload to cloud storage | Direct delivery to GeoCatalog |
| Configure separate ingestion pipelines | Automatic STAC catalog population |
| Multiple interfaces for different vendors | Single STAC/Data API interface |
| Manual data organization and cataloging | Immediate search and discovery |

### Geospatial Service Providers (GSP)

Geospatial Service Providers offer processing, analytics, and insight generation services. With partner application integration, GSPs can read source data from a customer's GeoCatalog, process it, and deliver results back to the same GeoCatalog.

**Example workflow:**

1. Customer grants GSP read access to specific collections
1. GSP retrieves source imagery via STAC API
1. GSP performs analysis (for example, change detection, object identification)
1. GSP delivers analytics results back to customer's GeoCatalog
1. Customer visualizes results in Explorer UI or queries via API

## Partner Application Integration Architecture

Partner application integration uses Microsoft Entra ID's multitenant application model. This architecture enables partners to manage a single application while serving multiple customers, with each customer maintaining control over access to their resources.

[ ![Diagram showing multitenant architecture with partner app registration connecting to multiple customer tenants.](media/partner-application-integration-architecture.png) ](media/partner-application-integration-architecture.png#lightbox)

**Key architecture benefits:**

- **Centralized management**: Partners maintain one application registration
- **Customer control**: Each customer controls access through their own tenant
- **Data isolation**: Customer data remains in customer-controlled storage
- **Scalable onboarding**: Adding customers doesn't require changes to the partner application
- **Enterprise security**: Leverages Microsoft Entra ID features like conditional access and MFA

## End-to-end workflow

The following diagram illustrates the complete workflow from partner onboarding to data delivery.

[ ![Sequence diagram showing the three phases of partner integration: partner setup, customer authorization, and data operations.](media/partner-application-user-flow.png) ](media/partner-application-user-flow.png#lightbox)

## Security considerations

Partner application integration follows Azure security best practices:

- **Principle of least privilege**: Grant only the permissions required for the partner's operations
- **Scoped access**: Assign roles at the GeoCatalog resource level, not subscription level
- **Audit logging**: All partner operations are logged for compliance and troubleshooting
- **Revocable access**: Customers can remove access at any time by deleting the role assignment or service principal

## Related content

- [Authorize cross-tenant partner applications](./authorize-cross-tenant-partner-applications.md)
- [Configure a cross-tenant application](./configure-cross-tenant-application.md)
- [Configure application authentication for Microsoft Planetary Computer Pro](./application-authentication.md)
- [Manage access for Microsoft Planetary Computer Pro](./manage-access.md)

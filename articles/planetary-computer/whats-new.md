---
title: New Features in Microsoft Planetary Computer Pro
description: "Updates to users on new features in Microsoft Planetary Computer Pro."
author: norazhan
ms.author: jiozhan
ms.service: planetary-computer-pro
ms.topic: whats-new #Don't change.
ms.date: 06/02/2026

#customer intent: As a user of Microsoft Planetary Computer Pro, I want to know what the new features of the release.
ms.custom:
  - build-2025
---

# What's new in Microsoft Planetary Computer Pro

Microsoft Planetary Computer Pro is continuously evolving with new features and enhancements designed to improve geospatial data management, processing, and visualization. These updates expand the platform's capabilities to support new data types, enhance security, improve performance, and add new management and integration options. Stay up-to-date with the latest improvements to maximize the value of your geospatial data and workflows in Microsoft Planetary Computer Pro.

## Updates summary

- June 2026 General Availability Release

| Feature | Details |
| --- | --- |
| **Zarr V2 and V3 support** | [Data cube support](./data-cube-overview.md) in Microsoft Planetary Computer Pro now includes both Zarr V2 and Zarr V3 formats, broadening compatibility for multi-dimensional geospatial datasets and enabling seamless ingestion and analysis of modern Zarr-based data stores. |

- May 2025 Preview Release

| Feature | Details |
| --- | --- |
| **Data Cube Support** | Microsoft Planetary Computer Pro now supports [data cubes for multi-dimensional geospatial data analysis](./data-cube-quickstart.md). This feature enables users to efficiently analyze and visualize time-series data across multiple variables and dimensions, making it easier to identify patterns and trends in complex environmental datasets. |
| **Managed Identity Ingestion** | The new [Managed Identity Ingestion capability](./assign-managed-identity-geocatalog-resource.md) allows secure authentication for data ingestion workflows without storing credentials. This Microsoft Entra integration simplifies the process of moving data into Microsoft Planetary Computer Pro while maintaining enterprise-grade security standards and compliance requirements. |

## Preview features

The following features are available in preview. To request access or learn more, contact Microsoft Support.

> [!NOTE]  
> Features currently in preview are available under [supplemental terms of use](https://azure.microsoft.com/support/legal/preview-supplemental-terms/), review for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability. Microsoft Planetary Computer Pro provides preview access to give you a chance to evaluate and [share feedback with the product group](https://feedback.azure.com/d365community/forum/ef2b2b38-2f25-ec11-b6e6-000d3a4f0f84) on features before they become generally available (GA).

| Feature | Details |
| --- | --- |
| **Vector data support** | Ingest, manage, and visualize vector geospatial data in Microsoft Planetary Computer Pro. For more information, see the [vector data overview](https://github.com/Azure/microsoft-planetary-computer-pro/blob/private-preview-feature-documentation/private_preview_features/vector_data/docs/vector-data-overview.md) and the [vector tiles API specification](https://github.com/Azure/microsoft-planetary-computer-pro/blob/private-preview-feature-documentation/private_preview_features/vector_data/spec/vector-tiles-api.html). |
| **Private Link support** | Secure access to Microsoft Planetary Computer Pro by using Azure Private Link to keep traffic on the Microsoft backbone network. For more information, see the [Private Link overview](https://github.com/Azure/microsoft-planetary-computer-pro/blob/private-preview-feature-documentation/private_preview_features/private_link/docs/private-link-overview.md), [configure a private endpoint for the data plane](https://github.com/Azure/microsoft-planetary-computer-pro/blob/private-preview-feature-documentation/private_preview_features/private_link/docs/configure-private-endpoint-data-plane.md), [configure a private endpoint for managed storage](https://github.com/Azure/microsoft-planetary-computer-pro/blob/private-preview-feature-documentation/private_preview_features/private_link/docs/configure-private-endpoint-managed-storage.md), and [configure trusted services for customer storage](https://github.com/Azure/microsoft-planetary-computer-pro/blob/private-preview-feature-documentation/private_preview_features/private_link/docs/configure-trusted-services-customer-storage.md). |

## Next steps

- [Get Started with Microsoft Planetary Computer Pro](./get-started-planetary-computer.md)

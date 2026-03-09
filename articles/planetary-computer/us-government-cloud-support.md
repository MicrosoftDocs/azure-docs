---
title: Azure US Government cloud support for Microsoft Planetary Computer Pro
description: Learn about the differences between Azure Public cloud and Azure US Government cloud when using Microsoft Planetary Computer Pro, including endpoint mappings and configuration changes.
author: aloverro
ms.author: adamloverro
ms.service: planetary-computer-pro
ms.topic: conceptual
ms.date: 02/03/2026

#customer intent: As a developer or IT administrator, I want to understand the differences between Azure Public and US Government clouds so that I can correctly configure Microsoft Planetary Computer Pro in the US Government environment.

---

# Azure US Government cloud support for Microsoft Planetary Computer Pro

Microsoft Planetary Computer Pro is available in both Azure Public cloud and Azure US Government cloud environments. This article provides a comprehensive reference for the endpoint and configuration differences between these two cloud environments, organized by the documentation articles they affect.

When deploying or developing applications for Microsoft Planetary Computer Pro in Azure US Government, you need to update various endpoints, authentication URLs, and API scopes to use the US Government cloud equivalents.

> [!NOTE]
> The [Open Planetary Computer](https://planetarycomputer.microsoft.com) public data catalog (`planetarycomputer.microsoft.com`) works identically in both Azure Public and Azure US Government cloud environments. No changes are required when accessing Open Planetary Computer data from either environment.

## Supported regions

Microsoft Planetary Computer Pro is currently available in the following US Government Cloud Regions:
- US Gov Virginia

## Endpoint mapping reference

The following table provides a quick reference for mapping Azure Public cloud endpoints to their Azure US Government equivalents:

| Service                      | Azure Public cloud                               | Azure US Government cloud                         |
|------------------------------|--------------------------------------------------|---------------------------------------------------|
| Microsoft Entra ID (sign in)   | `login.microsoftonline.com`                      | `login.microsoftonline.us`                        |
| GeoCatalog API scope         | `https://geocatalog.spatio.azure.com/.default`   | `https://geocatalog.spatio.azure.us/.default`     |
| GeoCatalog instance URL      | `{name}.{region}.geocatalog.spatio.azure.com`    | `{name}.{region}.geocatalog.spatio.azure.us`      |
| Azure Storage scope          | `https://storage.azure.com/.default`             | `https://storage.usgovcloudapi.net/.default`      |
| Azure Blob Storage           | `*.blob.core.windows.net`                        | `*.blob.core.usgovcloudapi.net`                   |
| Azure Resource Manager       | `management.azure.com`                           | `management.usgovcloudapi.net`                    |
| Azure portal                 | `portal.azure.com`                               | `portal.azure.us`                                 |
| Microsoft Entra admin center | `entra.microsoft.com`                            | `entra.microsoft.us`                              |

## Configuration differences by documentation article

The following sections detail the specific configuration changes required for each documentation article when working in the Azure US Government cloud environment.

### Application authentication

**Article:** [Application authentication](application-authentication.md)

When configuring application authentication for US Government cloud:

| Configuration                | Public cloud                          | US Government cloud                   |
|------------------------------|---------------------------------------|---------------------------------------|
| Token acquisition scope      | `https://geocatalog.spatio.azure.com/`| `https://geocatalog.spatio.azure.us/` |
| Microsoft Entra admin center | `https://entra.microsoft.com/`        | `https://entra.microsoft.us/`         |

### Build a web application

**Article:** [Build a web application](build-web-application.md)

When building web applications with Microsoft Authentication Library (MSAL) authentication:

| Configuration          | Public cloud                                          | US Government cloud                                      |
|------------------------|-------------------------------------------------------|----------------------------------------------------------|
| MSAL authority URL     | `https://login.microsoftonline.com/YOUR_TENANT_ID`    | `https://login.microsoftonline.us/YOUR_TENANT_ID`        |
| GeoCatalog API scope   | `https://geocatalog.spatio.azure.com/.default`        | `https://geocatalog.spatio.azure.us/.default`            |
| GeoCatalog catalog URL | `https://{name}.{region}.geocatalog.spatio.azure.com` | `https://{name}.{region}.geocatalog.spatio.azure.us`     |

**Example MSAL configuration for US Government cloud:**

```javascript
const msalConfig = {
    auth: {
        clientId: "YOUR_CLIENT_ID",
        authority: "https://login.microsoftonline.us/YOUR_TENANT_ID",
        redirectUri: "http://localhost:3000"
    }
};

const tokenRequest = {
    scopes: ["https://geocatalog.spatio.azure.us/.default"]
};
```

### Connect to ArcGIS Pro

**Article:** [Connect to ArcGIS Pro](create-connection-arc-gis-pro.md)

> [!NOTE]
> This article already includes dedicated instructions for both Public and US Government cloud configurations. 

When using ArcGIS Pro with US Government cloud:

| Configuration      | Public cloud                                   | US Government cloud                                          |
|--------------------|------------------------------------------------|--------------------------------------------------------------|
| Storage scope      | `https://storage.azure.com/.default`           | `https://storage.usgovcloudapi.net/.default`                 |
| GeoCatalog scope   | `https://geocatalog.spatio.azure.com/.default` | `https://geocatalog.spatio.azure.us/.default`                |
| OAuth redirect URI | Standard redirect                              | `https://login.microsoftonline.us/common/oauth2/nativeclient`|

### Azure Batch integration

**Article:** [Azure Batch and Microsoft Planetary Computer Pro](azure-batch.md)

When running Azure Batch jobs:

| Configuration         | Public cloud                                          | US Government cloud                                             |
|-----------------------|-------------------------------------------------------|-----------------------------------------------------------------|
| `MPCPRO_APP_ID` scope | `https://geocatalog.spatio.azure.com`                 | `https://geocatalog.spatio.azure.us`                            |
| Blob storage URLs     | `https://{account}.blob.core.windows.net/{container}` | `https://{account}.blob.core.usgovcloudapi.net/{container}`     |

### Assign managed identity to GeoCatalog

**Article:** [Assign a user-assigned managed identity to a GeoCatalog resource](assign-managed-identity-geocatalog-resource.md)

When using Azure Resource Manager REST API:

| Configuration             | Public cloud                                     | US Government cloud                                       |
|---------------------------|--------------------------------------------------|-----------------------------------------------------------|
| Resource Manager endpoint | `https://management.azure.com/subscriptions/...` | `https://management.usgovcloudapi.net/subscriptions/...`  |

### Data cube operations

**Affected articles:** [Data cube overview](data-cube-overview.md), [Get started with data cubes](data-cube-quickstart.md)

When working with data cubes:

| Configuration           | Public cloud                          | US Government cloud                   |
|-------------------------|---------------------------------------|---------------------------------------|
| Token acquisition scope | `https://geocatalog.spatio.azure.com` | `https://geocatalog.spatio.azure.us`  |

### Get collection SAS token

**Article:** [Get a collection SAS token](get-collection-sas-token.md)

When acquiring SAS tokens:

| Configuration         | Public cloud                          | US Government cloud                  |
|-----------------------|---------------------------------------|--------------------------------------|
| `MPCPRO_APP_ID` scope | `https://geocatalog.spatio.azure.com` | `https://geocatalog.spatio.azure.us` |

### Get started with Planetary Computer Pro

**Article:** [Get started with Microsoft Planetary Computer Pro](get-started-planetary-computer.md)

When setting up your environment:

| Configuration         | Public cloud                          | US Government cloud                  |
|-----------------------|---------------------------------------|--------------------------------------|
| `MPCPRO_APP_ID` scope | `https://geocatalog.spatio.azure.com` | `https://geocatalog.spatio.azure.us` |

### Ingest data via web interface

**Article:** [Ingest data using the web interface](ingest-via-web-interface.md)

When configuring ingestion sources with storage URLs:

| Configuration           | Public cloud                                          | US Government cloud                                         |
|-------------------------|-------------------------------------------------------|-------------------------------------------------------------|
| Blob storage URL format | `https://{account}.blob.core.windows.net/{container}` | `https://{account}.blob.core.usgovcloudapi.net/{container}` |

### Azure portal references

**Affected articles:** [Deploy a GeoCatalog resource](deploy-geocatalog-resource.md), [Manage access](manage-access.md), [Delete a GeoCatalog resource](delete-geocatalog-resource.md)

When accessing the Azure portal:

| Configuration | Public cloud                | US Government cloud        |
|---------------|-----------------------------|----------------------------|
| Portal URL    | `https://portal.azure.com/` | `https://portal.azure.us/` |

## Limitations

- Feature availability in Azure US Government cloud may be delayed compared to Azure Public cloud. Check the [Azure Government services availability](../azure-government/compare-azure-government-global-azure.md) documentation for the latest information.
- Ensure your Azure subscription is enabled for Azure US Government before deploying Microsoft Planetary Computer Pro resources.

## Related content

- [What is Microsoft Planetary Computer Pro?](microsoft-planetary-computer-pro-overview.md)
- [Get started with Microsoft Planetary Computer Pro](get-started-planetary-computer.md)
- [Application authentication](application-authentication.md)
- [Azure Government documentation](../azure-government/documentation-government-welcome.md)
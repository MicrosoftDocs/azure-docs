---
ms.service: azure-arc
ms.topic: include
ms.date: 02/16/2024
---

If you're using Azure Arc-enabled servers only for Extended Security Updates for either or both of the following products:

- Windows Server 2012
- SQL Server 2012

You can enable the following subset of endpoints:

#### [Azure Cloud](#tab/azure-cloud)

| Agent resource | Description | When required| Endpoint used with private link |
|---------|---------|--------|---------|
|`aka.ms`|Used to resolve the download script during installation|At installation time, only| Public |
|`download.microsoft.com`|Used to download the Windows installation package|At installation time, only| Public |
|`login.windows.net`|Microsoft Entra ID|Always| Public |
|`login.microsoftonline.com`|Microsoft Entra ID|Always| Public |
|`management.azure.com`|Azure Resource Manager - to create or delete the Arc server resource|When connecting or disconnecting a server, only| Public, unless a [resource management private link](../../../azure-resource-manager/management/create-private-link-access-portal.md) is also configured |
|`*.his.arc.azure.com`|Metadata and hybrid identity services|Always| Private |
|`*.guestconfiguration.azure.com`| Extension management and guest configuration services |Always| Private |
|`www.microsoft.com/pkiops/certs`| Intermediate certificate updates for ESUs (note: uses HTTP/TCP 80 and HTTPS/TCP 443) | Always for automatic updates, or temporarily if downloading certificates manually. | Public |
|`*.<region>.arcdataservices.com`| Azure Arc data processing service and service telemetry.| SQL Server ESUs | Public|

#### [Azure Government](#tab/azure-government)

| Agent resource | Description | When required| Endpoint used with private link |
|---------|---------|--------|---------|
|`aka.ms`|Used to resolve the download script during installation|At installation time, only| Public |
|`download.microsoft.com`|Used to download the Windows installation package|At installation time, only| Public |
|`login.microsoftonline.us`|Microsoft Entra ID|Always| Public |
|`management.usgovcloudapi.net`|Azure Resource Manager - to create or delete the Arc server resource|When connecting or disconnecting a server, only| Public, unless a [resource management private link](../../../azure-resource-manager/management/create-private-link-access-portal.md) is also configured |
|`*.his.arc.azure.us`|Metadata and hybrid identity services|Always| Private |
|`*.guestconfiguration.azure.us`| Extension management and guest configuration services |Always| Private |
|`www.microsoft.com/pkiops/certs`| Intermediate certificate updates for ESUs (note: uses HTTP/TCP 80 and HTTPS/TCP 443) | Always for automatic updates, or temporarily if downloading certificates manually. | Public |

#### [Microsoft Azure operated by 21Vianet](#tab/azure-china)

> [!NOTE]
> Azure Arc-enabled servers used for Extended Security Updates for Windows Server 2012 is not available in Microsoft Azure operated by 21Vianet regions at this time.

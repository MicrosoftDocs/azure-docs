---
ms.service: azure-arc
ms.topic: include
ms.date: 10/05/2023
---

If you are using Azure Arc-enabled servers only for the purpose of Extended Security Updates for Windows Server 2012, you can enable the following subset of endpoints:

| Agent resource | Description | When required| Endpoint used with private link |
|---------|---------|--------|---------|
|`aka.ms`|Used to resolve the download script during installation|At installation time, only| Public |
|`download.microsoft.com`|Used to download the Windows installation package|At installation time, only| Public |
|`login.windows.net`|Azure Active Directory|Always| Public |
|`login.microsoftonline.com`|Azure Active Directory|Always| Public |
|`aadcdn.msftauth.net`|Azure portal authentication|Always| Public |
|`management.azure.com`|Azure Resource Manager - to create or delete the Arc server resource|When connecting or disconnecting a server, only| Public, unless a [resource management private link](../../../azure-resource-manager/management/create-private-link-access-portal.md) is also configured |
|`*.his.arc.azure.com`|Metadata and hybrid identity services|Always| Private |
|`*.guestconfiguration.azure.com`| Extension management and guest configuration services |Always| Private |

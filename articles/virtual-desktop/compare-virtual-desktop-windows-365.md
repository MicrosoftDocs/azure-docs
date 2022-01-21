---
title: Comparing Azure Virtual Desktop and Windows 365 - Azure
description: Comparing technical features between Azure virtual Desktop and Windows 365.
author: Heidilohr
ms.topic: conceptual
ms.date: 01/21/2022
ms.author: helohr
manager: femila
---

# Comparing Azure Virtual Desktop and Windows 365

Azure Virtual Desktop and Windows 365 are both great solutions for customers who want to have a seamless Windows experience while accessing their virtual desktop and apps remotely. In this article, we'll compare technical features between the two services.

## Technical features

The following table describes high-level differences in the technical features between Azure Virtual Desktop and Windows 365.

| Feature | Azure Virtual Desktop (single-session)| Azure Virtual Desktop (multisession)| Windows 365 Enterprise | Windows 365 Business |
|-------|--------|--------|--------|--------|
|Design|Designed to be flexible.|Designed to be flexible.|Designed to be simple and easy to use.|Designed to be simple and easy to use.|
|Type of desktop|Personal desktop|Pooled (single and multi-session) desktop|Personal desktop|Personal desktop|
|Pricing model|Based on your own resource usage|Based on your own resource usage|Fixed per-user pricing ([Windows 365 pricing](https://www.microsoft.com/windows-365/enterprise/compare-plans-pricing-b))|Fixed per-user pricing ([Windows 365 pricing](https://www.microsoft.com/windows-365/enterprise/compare-plans-pricing-b))|
|Subscription|Customer-managed|Customer-managed|Microsoft-managed (except networking)|Fully Microsoft-managed|
|VM stock-keeping units (SKUs)|Any Azure virtual machine (VM) including graphics processing unit (GPU)-enabled SKUs|Any Azure VM including GPU-enabled SKUs|Multiple optimized options for a range of use cases|Multiple optimized options for a range of use cases|
|Backup|Azure backup services|Azure backup services|Local redundant storage for disaster recovery|Local redundant storage for disaster recovery|
|Networking|Customer-managed|Microsoft-managed|Customer-managed|Microsoft-managed|
|Identity|Domain join with Active Directory Domain Services (AD DS) or Azure AD DS, Hybrid Azure AD join, or Azure AD join |Domain join with AD DS or Azure AD DS, Hybrid Azure AD join, or Azure AD join |Hybrid Join, Azure AD join |Azure AD join (can't use AD DS)|
|User profiles|Azure Files, Azure NetApp Files, or VM-based storage for FSLogix for pooled host pools, and an option for local profiles for personal desktops|Azure Files, Azure NetApp Files, VM-based storage for FSLogix for pooled host pools, and an option for local profiles for personal desktops|Local profiles, offered as software-as-a-service (SaaS)|Local profiles (offered as SaaS)|
|Operating systems|Windows 10 Enterprise and Windows 11 Enterprise (single session and multi-session) <br>Windows Server 2012 R2, 2016, 2019 (single session and multi-session)<br>Windows 7 Enterprise (single session)|Windows 10 Enterprise and Windows 11 Enterprise (single session and multi-session) <br>Windows Server 2012 R2, 2016, 2019 (single session and multi-session)<br>Windows 7 Enterprise (single session)|Windows 10 Enterprise and Windows 11 Enterprise (single session)|Windows 10 Enterprise and Windows 11 Enterprise (single session)|
|Base image|Custom and Microsoft-provided|Custom and Microsoft-provided|Custom and Microsoft-provided|Microsoft-provided only|
|VM location|[Any Azure region](data-locations.md)|[Any Azure region](data-locations.md)|[Most geographies](/windows-365/enterprise/requirements#supported-azure-regions-for-cloud-pc-provisioning)|[Most geographies](/windows-365/enterprise/requirements#supported-azure-regions-for-cloud-pc-provisioning)|
|Remote app streaming|Supported|Supported|Not supported|Not supported|

## Deployment and management

The following table describes differences when deploying and managing Azure Virtual Desktop and Windows 365.

| Feature | Azure Virtual Desktop (single-session)| Azure Virtual Desktop (multisession)| Windows 365 Enterprise | Windows 365 Business |
|-------|--------|--------|--------|---------|
|Hybrid (on-premises) or multi-cloud support|Supported with Azure Stack HCI (public preview), Citrix, and VMware|Supported with Azure Stack HCI (public preview), Citrix, and VMware|Unavailable|Unavailable|
|On-premises connection|Supported by ExpressRoute, VPN, Azure Gateway, and SD-WAN|Supported by ExpressRoute, VPN, Azure Gateway, and SD-WAN|Supported by ExpressRoute, VPN, Azure Gateway, and SD-WAN|Supported by ExpressRoute, VPN, Azure Gateway, and SD-WAN|
|Management portal|Azure portal (deploy and manage), Microsoft Endpoint Manager (manage only)|Azure portal (deploy and manage), Microsoft Endpoint Manager (manage only)|Microsoft Endpoint Manager|End-user portal|
|Image management|Custom images and Microsoft-managed image management|Custom images and Microsoft-managed image management|Custom images and Microsoft-managed image management| Microsoft-managed image management only|
|Screen capture protection|Yes (feature currently in preview)|Yes (feature currently in preview)|Yes (feature currently in preview)|Yes (feature currently in preview)|
|Updating and patching process|Similar to physical PC|Similar to physical PC|Similar to physical PC|Similar to physical PC|
|Autoscaling|N/A|Supported with the Autoscaling tool (preview)|N/A|N/A|
|Application delivery|Microsoft Endpoint Manager, MSIX app attach, custom images, or Microsoft-approved partner solutions|Microsoft Endpoint Manager, MSIX app attach, custom images, or Microsoft-approved partner solutions|Same as physical PC|Same as physical PC|
|Monitoring|Azure Virtual Desktop Insights, powered by Azure Monitor|Azure Virtual Desktop Insights, powered by Azure Monitor|Similar to physical PC|Similar to physical PC|
|Environment validation|[Required URL check tool](safe-url-list.md)|[Required URL check tool](safe-url-list.md)|Offered as SaaS|Offered as SaaS|
|App lifecycle management|MEM, SCCM, MSI, EXE, MSIX, App-V, and others with MSIX app attach or partner solutions|MEM, SCCM, MSI, EXE, MSIX, App-V, and others with MSIX app attach or partner solutions|Same as physical PC (MEM, SSCM, MSI, EXE, MSIX, App-V, and so on)|Same as physical PC (MEM, SSCM, MSI, EXE, MSIX, App-V, and so on)|

## User experience

The following table compares user experience when using Azure Virtual Desktop and Windows 365.

| Feature | Azure Virtual Desktop (single-session)| Azure Virtual Desktop (multisession)| Windows 365 Enterprise | Windows 365 Business |
|-------|--------|--------|--------|---------|
|Client|Windows, Mac, iOS, Android, HTML, Linux SDK|Windows, Mac, iOS, Android, HTML, Linux SDK|Windows, Mac, iOS, Android, HTML, Linux SDK|Windows, Mac, iOS, Android, HTML, Linux SDK|
|Printing|Universal Print and print redirection support, network printers|Universal Print and print redirection support, network printers|Universal print and print redirection support|Universal print and print redirection support|
|Protocol|Remote Desktop Protocol (RDP)|RDP|RDP|RDP|
|End-user portal capabilities|IT uses the Azure portal to manage deployments|IT uses the Azure portal to manage deployments|User sign in, start VM, troubleshooting, restart, rename and profile reset, VM and disk resizing, OS choice|User sign in, start VM, troubleshooting, restart, rename and profile reset, VM and disk resizing, OS choice|

## Licensing and pricing

The following table describes the difference in licensing and pricing costs for both Azure Virtual Desktop and Windows 365.

| Feature | Azure Virtual Desktop (single-session)| Azure Virtual Desktop (multisession)| Windows 365 Enterprise | Windows 365 Business |
|-------|--------|--------|--------|---------|
|License costs|Use existing internal license (internal users only) or use monthly per-user access pricing (for commercial remote app streaming to external users only)|Use existing internal license (internal users only) or use monthly per-user access pricing (for commercial remote app streaming to external users only)|Monthly per-user pricing|Monthly per-user pricing|
|Infrastructure costs|Based on consumption|Based on consumption|Included except for egress charges over base quota|Included|
|Microsoft Endpoint Manager|Optional|Optional|Required|Optional|

## Next steps

- To learn more about Azure Virtual Desktop pricing, see [Azure Virtual Desktop pricing](https://azure.microsoft.com/pricing/details/virtual-desktop/).
- To learn more about Windows 365 pricing, see [Windows 365 plans and pricing](https://www.microsoft.com/windows-365/all-pricing).

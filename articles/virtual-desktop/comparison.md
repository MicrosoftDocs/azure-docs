---
title: Comparing Azure Virtual Desktop and Microsoft 365 comparison - Azure
description: A comparison of the technical features in Microsoft 365 and Azure Virtual Desktop.
author: Heidilohr
ms.topic: conceptual
ms.date: 11/09/2021
ms.author: helohr
manager: femila
---

# Comparing Azure Virtual Desktop and Microsoft 365 features

Intro text goes here!

## Technical architecture

| Feature | Azure Virtual Desktop (personal)| Azure Virtual Desktop (pooled)| Windows 365 Enterprise | Windows 365 Business |
|-------|--------|--------|--------|---------|
|Design|Designed to be flexible.|Designed to be flexible.|Designed to be simple and easy to use.|Designed to be simple and easy to use.|
|Type of desktop||Pooled (single and multi-session) desktop|Pooled (single and multi-session) desktop|Personal desktop|Personal desktop|
|Management|Customer-managed|Customer-managed|Microsoft-managed (except networking)|Fully Microsoft-managed|
|VM SKUs|Any Azure virtual machine (VM)|Any Azure VM|Multiple optimized options for a range of use cases|Multiple optimized options for a range of use cases|
|Backup|Azure backup services|Azure backup services|Local redundant storage for disaster recovery|Local redundant storage for disaster recovery|
|Networking|Customer-managed|Microsoft-managed|Customer-managed|Customer-managed|
|Identity|Hybrid join, Azure Active Directory (AD) join (preview)|Azure AD join (preview)|Domain join with Active Directory Domain Services (AD DS) or Azure AD DS, Hybrid Azure AD join or Azure AD join (preview)|Domain join (AD DS or Azure AD DS), Hybrid Azure AD join or Azure AD join (preview)|
|User profiles|Local redundant storage for user profiles|Local redundant storage for user profiles|Local redundant storage for user profiles, or FSLogix profiles that can be stored locally in Azure Files or Azure NetApp Files|Local redundant storage for user profiles, or FSLogix profiles that can be stored locally in Azure Files or Azure NetApp Files|
|Operating systems|Windows 10 Enterprise (single session and multi-session) <br>Windows Server 2012 R2, 2016, 2019 (single session and multi-session)<br>Windows 7 Enterprise (single session)|Windows 10 Enterprise (single session and multi-session) <br>Windows Server 2012 R2, 2016, 2019 (single session and multi-session)<br>Windows 7 Enterprise (single session)|Windows 10 Enterprise (single session)|Windows 10 Enterprise (single session)|
|Base image|Custom and Microsoft-provided|Custom and Microsoft-provided|Custom and Microsoft-provided|Microsoft-provided only|
|VM location|[Any Azure region](data-locations.md)|[Any Azure region](data-locations.md)|Most geographies|Most geographies|
|Remote app streaming|Supported|Supported|Not supported|Not supported|

## Deployment and management

Intro text goes here!

| Feature | Azure Virtual Desktop (personal)| Azure Virtual Desktop (pooled)| Windows 365 Enterprise | Windows 365 Business |
|-------|--------|--------|--------|---------|
|Hybrid (on-premises) or multi-cloud support|Supported with Citrix and VMware cloud integration|Supported with Citrix and VMware cloud integration|Not supported|Not supported|
|Management portal|Azure portal (deploy and manage), Microsoft Endpoint Manager (manage only)|Azure portal (deploy and manage), Microsoft Endpoint Manager (manage only)|Microsoft Endpoint Manager|End-user portal|
|Image management|Custom images and Microsoft-managed image management|Custom images and Microsoft-managed image management|Custom images and Microsoft-managed image management| Microsoft-managed image management only|
|Screen capture protection|Yes (feature currently in preview)|Yes (feature currently in preview)|Yes (feature currently in preview)|Yes (feature currently in preview)|
|Patches|Other Microsoft solutions|Other Microsoft solutions|Microsoft Endpoint Manager|Microsoft Endpoint Manager|
|Autoscaling|Supported with Azure Logic Apps|Supported with Azure Logic Apps|Not required due to fixed monthly cost|Not required due to fixed monthly cost|
|Application delivery|Microsoft Endpoint Manager, MSIX app attach, custom images, or Microsoft-approved partner solutions|Microsoft Endpoint Manager, MSIX app attach, custom images, or Microsoft-approved partner solutions|Microsoft Endpoint Manager or custom images|Microsoft Endpoint Manager or custom images|
|Monitoring|Azure Monitor|Azure Monitor|Endpoint Analytics|Endpoint Analytics|
|Environment validation|Configured manually with Azure Advisor|Configured manually with Azure Advisor|Built-in network configuration watchdog service|Built-in network configuration watchdog service|
|App lifecycle management|Same as physical PC (MEM, SCCM, MSI, EXE, MSIX, App-V, and so on) with MSIX app attach or partner solutions|Same as physical PC (MEM, SCCM, MSI, EXE, MSIX, App-V, and so on) with MSIX app attach or partner solutions|Same as physical PC (MEM, SSCM, MSI, EXE, MSIX, App-V, and so on)|Same as physical PC (MEM, SSCM, MSI, EXE, MSIX, App-V, and so on)|

## User experience

Intro text goes here.

| Feature | Azure Virtual Desktop (personal)| Azure Virtual Desktop (pooled)| Windows 365 Enterprise | Windows 365 Business |
|-------|--------|--------|--------|---------|
|Client|Windows, Mac, iOS, Android, HTML, Linux SDK|Windows, Mac, iOS, Android, HTML, Linux SDK|Windows, Mac, iOS, Android, HTML, Linux SDK|Windows, Mac, iOS, Android, HTML, Linux SDK|
|Printing|Universal print and print redirection support|Print redirection only|Universal print and print redirection support|Universal print and print redirection support|
|Protocol|RDP|RDP|RDP|RDP|
|End-user portal capabilities|IT uses the Azure portal to manage deployments|IT uses the Azure portal to manage deployments|User sign in, start VM, troubleshooting, restart, rename and profile reset, VM and disk resizing, OS choice|User sign in, start VM, troubleshooting, restart, rename and profile reset, VM and disk resizing, OS choice|

## Licensing and pricing

Intro text goes here.

| Feature | Azure Virtual Desktop (personal)| Azure Virtual Desktop (pooled)| Windows 365 Enterprise | Windows 365 Business |
|-------|--------|--------|--------|---------|
|License costs|Use existing internal license (internal users only) or use monthly per-user access pricing (for commercial remote app streaming to external users only)|Use existing internal license (internal users only) or use monthly per-user access pricing (for commercial remote app streaming to external users only)|Monthly per-user pricing|Monthly per-user pricing|
|Infrastructure costs|Based on consumption|Based on consumption|Included except for egress charges over base quota|Included|
|Microsoft Endpoint Manager|Optional|Optional|Required|Optional|

## Next steps

- To learn more about Azure Virtual Desktop pricing, see [Azure Virtual Desktop pricing](https://azure.microsoft.com/pricing/details/virtual-desktop/).
- To learn more about Windows 365 pricing, see [Windows 365 plans and pricing](https://www.microsoft.com/windows-365/all-pricing).

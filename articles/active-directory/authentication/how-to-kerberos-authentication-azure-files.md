---
title: How to deploy Azure AD Kerberos authentication for Azure Files (Preview)
description: Learn how to deploy Azure AD Kerberos authentication for Azure Files 

services: active-directory
ms.service: active-directory
ms.subservice: authentication
ms.topic: conceptual
ms.date: 10/19/2021

ms.author: justinha
author: justinha
manager: daveba
ms.reviewer: rhicock

ms.collection: M365-identity-device-management
ms.custom: contperf-fy20q4
---
# How to deploy Azure AD Kerberos authentication for Azure Files (Preview)

Azure Files offers fully managed file shares in the cloud that are accessible via the industry standard SMB protocol. With this preview, Azure AD supports Kerberos authentication so you can use SMB to access Azure Files using Azure AD credentials from devices and VMs joined to Azure AD or hybrid Azure AD / Azure AD joined devices or VMs. An Azure AD user can now access a file share in cloud that requires Kerberos authentication. 

Enterprises can move their traditional services that require Kerberos authentication to the cloud maintaining the seamless user experience and without making any changes to the authentication stack of the file servers. This does not require the customers to depDAFloy new on premises infrastructure or manage the overhead of setting up Domain services. The end users can access Azure files or traditional file servers over the internet i.e. sitting in a coffee shop without requiring a line of sight to Domain Controllers. 

Azure AD Kerberos authentication for Azure Files is supported as part of a public preview. For more information about previews, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).
---
title: 'Azure AD Connect: Device options | Microsoft Docs'
description: This document details device options available in Azure AD Connect
services: active-directory
documentationcenter: ''
author: billmath
manager: samueld
editor: billmath

ms.assetid: c0ff679c-7ed5-4d6e-ac6c-b2b6392e7892
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 05/08/2018
ms.component: hybrid
ms.author: billmath

---

#Azure AD Connect: Device options

The following documentation provides information about the various device options available in Azure AD Connect. You can use Azure AD Connect to configure the following two operations: 
* **Hybrid Azure AD join**: If your environment has an on-premises AD footprint and you also want benefit from the capabilities provided by Azure Active Directory, you can implement hybrid Azure AD joined devices. These are devices that are both, joined to your on-premises Active Directory and your Azure Active Directory.
* **Device writeback**: Device writeback is used to enable conditional access based on devices to AD FS (2012 R2 or higher) protected devices

## Configure device options in Azure AD Connect

1.	Run Azure AD Connect. In the **Additional tasks** page, select **Configure device options**.
    ![Configure device options](./media/active-directory-aadconnect-device-options/deviceoptions.png) 

    On clicking Next, an **Overview** page is displayed, which details the operations that can be performed.
    ![Overview](./media/active-directory-aadconnect-device-options/deviceoverview.png)

    >[!NOTE]
    > The new Configure device options is available only in version 1.1.819.0 and newer.

2.	After providing the credentials for Azure AD, you can chose the operation to be performed on the Device options page.
    ![Device operations](./media/active-directory-aadconnect-device-options/deviceoptionsselection.png)

## Next steps

* [Configure Hybrid Azure AD join](../device-management-hybrid-azuread-joined-devices-setup.md)
* [Configure / Disable device writeback](./active-directory-aadconnect-feature-device-writeback.md)


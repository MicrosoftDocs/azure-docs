---
title: 'ECMA Connector Host installation'
description: This article describes the ECMA connector host for use with Azure AD.
services: active-directory
author: billmath
manager: daveba
ms.service: active-directory
ms.workload: identity
ms.topic: how-to
ms.date: 03/17/2021
ms.subservice: hybrid
ms.author: billmath
ms.collection: M365-identity-device-management
---

# Installation of the ECMA connector host
The provisioning agent and ECMA host are two separate windows services that are installed using one installer, deployed on the same machine. They should have connectivity to the target application that you are looking to provision users into.The following document describes how to download and install the ECMA connector host

## Download and Install
Use the following steps to download and install the ECMA host.

1. Sign into the Azure Portal
2. Navigate to enterprise applications > Add a new application
3. Search for the provisioning private preview test application and add it to your tenant
4. Navigate to the provisioning blade
5. Click on on-premises connectivity
6. Download the agent installer
7. Open the agent installer > agree to the terms of service > click install
  ![Install ECMA Connector Host](.\media\on-prem-ecma-install\install-1.png)

8. A shortcut should be created on your desktop to launch the Azure AD Connect Provisioning Agent Wizard.

## Next Steps

- App provisioning](user-provisioning.md)
- On-premises app provisioning architecture(on-prem-app-prov-arch.md)
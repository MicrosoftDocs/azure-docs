---
title: Connect to support session on Microsoft Azure Stack Edge device via the Windows PowerShell interface | Microsoft Docs
description: Describes how to connect to support session on Azure Stack Edge via the Windows PowerShell interface.
services: databox
author: alkohli

ms.service: databox
ms.subservice: edge
ms.topic: article
ms.date: 12/14/2019
ms.author: alkohli
---
# Connect to a Support session on an Azure Stack Edge device via Windows PowerShell

The Azure Stack Edge device provides the capability to log a new support request within the service summary blade. If you encounter any issues with your Azure Stack Edge solution, you will need to engage with the Microsoft Support team. In an online session with your support engineer, you may also need to start a support session on your Azure Stack Edge device. 

This article walks you through how to start a support session in the Windows PowerShell interface of your Azure Stack Edge device. To start a Support session, you need to:

- (Optionally) generate and install a Support session certificate.
- Get an encryption password for Support session.
- Decrypt the password using the Password Decrypt tool.
- Start the Support session.
- Exit Support session after the issues are resolved.

The following sections describe in details each of the following steps.

## (Optional) Create and install Support session certificate

## Get encryption password

## Decrypt the password

## Start the Support session

## Exit Support session


You can disable support access by running Disable-HcsSupportAccess. The StorSimple device will also attempt to disable support access 8 hours after the session was initiated. It is a best practice to change your StorSimple device credentials after initiating a support session.To exit the remote PowerShell session, close the PowerShell window.

## Next steps

- Deploy [Azure Stack Edge](azure-stack-edge-r-series-deploy-prep.md) in Azure portal.

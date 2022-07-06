---
title: Azure Monitor for SAP Solutions providers - IBM Db2 Provider | Microsoft Docs
description: This article provides details to configure IBM DB2 Provider for Azure monitor for SAP solutions.
author: sujaj
ms.service: virtual-machines-sap
ms.subservice: baremetal-sap
ms.topic: article
ms.date: 07/06/2022
ms.author: sujaj

---



# **IBM Db2 Provider**

> [!Note]
> This content would apply to only Azure Monitor for SAP solutions and not the classic version.


### Provider installation

1. Select Add provider from Azure Monitor for SAP solutions resource, and then:


<img width="491" alt="Provider" src="https://user-images.githubusercontent.com/33844181/167706257-2fa23564-cc41-4fc7-a0a2-4d6d0110f563.png">


2. For Type, select IBM Db2.

3. Configure providers for each instance of database by entering all required information.
4. Enter Ip address of hostname, database name and port.
5. For database user please use 'Db2<'SAP SID'>', example: if your SID is MO1, username will be db2MO1. Enter password for this user. 
    
    <img width="563" alt="Provider Details" src="https://user-images.githubusercontent.com/33844181/167953657-5519fafe-d201-4ead-a7d4-2dfb86a3f45e.png">

---
title: "include file"
description: "include file"
services: storage
author: khdownie
ms.service: azure-storage
ms.topic: "include"
ms.date: 10/18/2022
ms.author: kendownie
ms.custom: "include file"
---
Currently, only NFS version 4.1 is supported. NFS 4.1 shares are only supported within the **FileStorage** storage account type (premium file shares only).

NFS Azure file shares support most features from the 4.1 protocol specification. Some features such as delegations and callback of all kinds, Kerberos authentication, and encryption-in-transit aren't supported.

The nconnect mount option is currently in preview and isn't recommended for production use.

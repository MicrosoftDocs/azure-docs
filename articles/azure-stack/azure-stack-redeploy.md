---
title: Redeploy Azure Stack | Microsoft Docs
description: Redeploy Azure Stack.
services: azure-stack
documentationcenter: ''
author: jeffgilb
manager: femila
editor: ''

ms.assetid: 795af5ea-892d-40b1-a080-42e4472e4bba
ms.service: azure-stack
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 01/24/2018
ms.author: jeffgilb

---
# Redeploy Azure Stack
If you receive an error while deploying Azure Stack, you can re-run setup using the following PowerShell command: `.\InstallAzureStackpoc.ps1 -rerun`. This command will restart Azure Stack setup at the point that it failed previously without needing to start over from the beginning. If you receive the same setup error again, it might be necessary to perform a full redeployment to adress the issue. 

To redeploy Azure Stack, you must start over from scratch as described below.

## Steps to redeploy Azure Stack
1. On the development kit host, open an elevated PowerShell console > navigate to the asdk-installer.ps1 script > run it > click **Reboot**.
2. Select the base operating system (not **Azure Stack**) and click **Next**.
3. After the development kit host reboots, delete the CloudBuilder.vhdx file that was used as part of the previous deployment.
4. [Deploy the development kit](azure-stack-run-powershell-script.md).

## Next steps
[Connect to Azure Stack](azure-stack-connect-azure-stack.md)


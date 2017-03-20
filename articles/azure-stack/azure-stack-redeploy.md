---
title: Redeploy Azure Stack | Microsoft Docs
description: Redeploy Azure Stack.
services: azure-stack
documentationcenter: ''
author: ErikjeMS
manager: byronr
editor: ''

ms.assetid: 795af5ea-892d-40b1-a080-42e4472e4bba
ms.service: azure-stack
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 3/1/2017
ms.author: erikje

---
# Redeploy Azure Stack
To redeploy Azure Stack, you must start over from scratch as described below.

## Steps to redeploy Azure Stack
1. Reboot the host into the original operating system (installed to bare metal). This is not the default setting in the boot menu, so you must use KVM or local console to select it during the reboot (during setup, you named the “Boot from VHD” OS to “AzureStack”, this will help identify which OS is which).
   
    You don't need to remove the existing boot entry (the new support script “PrepareBootFromVHD.ps1” takes care of that for you.)
2. If you do not have KVM, or would like to choose the Boot OS before rebooting:
   
   1. Locate the script .\BootMenuNoKVM.ps1. This file is available with the other support scripts provided along with this build.
   2. Run the script with elevated privileges. Select the name of Original Host OS. This will boot the host into the original host OS without requiring KVM access.
   3. When the script is complete you will be asked to confirm the reboot.
   4. If there are other users logged in, this command will fail.
   5. Please just run the following command: Restart-Computer -force 
3. Delete the CloudBuilder.vhdx file that was used as part of the previous deployment.
   
    You don't need to delete the existing Storage Pool from the previous deployment. The deployment script detects and cleans up the existing, then creates new.
4. Redeploy from copying a new copy of the CloudBuilder.vhdx, boot to it, etc.

## Next steps
[Connect to Azure Stack](azure-stack-connect-azure-stack.md)


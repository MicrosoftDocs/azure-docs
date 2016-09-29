<properties
	pageTitle="Redeploy Azure Stack | Microsoft Azure"
	description="Redeploy Azure Stack from scratch."
	services="azure-stack"
	documentationCenter=""
	authors="ErikjeMS"
	manager="byronr"
	editor=""/>

<tags
	ms.service="azure-stack"
	ms.workload="na"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="09/26/2016"
	ms.author="erikje"/>


# Redeploying the Environment

To redeploy Azure Stack, you must start over from scratch as described below.

Azure Stack TP2 is a repave/start over process for redeployment. The following steps 
walk you through the repave/redeploy (and the benefits of this being a “boot from vhd” deployment):

1. Reboot the host into the original operating system (installed to bare metal). This is not the default setting in the boot menu, so you will need to use KVM or local console to select it during the reboot (during setup, you named the “Boot from VHD” OS to “AzureStack TP2”, this will help identify which OS is which).
2. 	If you do not have KVM, or would like to choose the Boot OS before rebooting:
o	Run the available script .\BootMenuNoKVM.ps1 with elevated privileges. Select the name of Original Host OS. This will boot the host into the original host OS without requiring KVM access.
o	When the script is complete you will be asked to confirm reboot
•	If there are other users logged in, this command will fail.
•	Please just run the following command: Restart-Computer -force 
o	Note     This file is available with the other support scripts provided along with this build
•	You no longer need to remove the existing boot entry (the new support script “PrepareBootFromVHD.ps1” takes care of that for you.)
•	Delete the CloudBuilder.vhdx file that was used as part of the previous deployment.
•	You do not need to delete the existing Storage Pool from the previous TP2 deployment. The deployment script detects and cleans up the existing, then creates new.
•	Redeploy from copying a new copy of the CloudBuilder.vhdx, boot to it, etc..

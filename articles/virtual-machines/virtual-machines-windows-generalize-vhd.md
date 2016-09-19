<properties
	pageTitle="Generalize a Windows VHD | Microsoft Azure"
	description="Learn to use Sysprep to generalize a Windows VHD to use with the Resource Manager deployment model."
	services="virtual-machines-windows"
	documentationCenter=""
	authors="cynthn"
	manager="timlt"
	editor="tysonn"
	tags="azure-resource-manager"/>

<tags
	ms.service="virtual-machines-windows"
	ms.workload="infrastructure-services"
	ms.tgt_pltfrm="vm-windows"
	ms.devlang="na"
	ms.topic="article"
	ms.date="09/19/2016"
	ms.author="cynthn"/>
	
	
	
	
# Generalize a Windows virtual machine using Sysprep


This section shows you how to generalize your Windows virtual machine for use as an image. Sysprep removes all your personal account information, among other things. For details about Sysprep, see [How to Use Sysprep: An Introduction](http://technet.microsoft.com/library/bb457073.aspx).

1. Sign in to the Windows virtual machine.

2. Open the Command Prompt window as an administrator. Change the directory to **%windir%\system32\sysprep**, and then run `sysprep.exe`.

3. In the **System Preparation Tool** dialog box, do the following:

	1. In **System Cleanup Action**, select **Enter System Out-of-Box Experience (OOBE)**, and make sure that the **Generalize** check box is selected.

	2. In **Shutdown Options**, select **Shutdown**.

	3. Click **OK**.

	![Start Sysprep](./media/virtual-machines-windows-upload-image/sysprepgeneral.png)

</br>
<properties
   pageTitle="Create a StorSimple support package | Microsoft Azure"
   description="Learn how to create, decrypt, and edit a support package for your StorSimple device."
   services="storsimple"
   documentationCenter=""
   authors="alkohli"
   manager="carmonm"
   editor="" />
<tags
   ms.service="storsimple"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="na"
   ms.date="05/09/2016"
   ms.author="alkohli" />


# Create and manage a StorSimple support package

## Overview

A StorSimple support package is an easy-to-use mechanism that collects all relevant logs to assist Microsoft Support with troubleshooting any StorSimple device issues. The collected logs are encrypted and compressed.

This tutorial includes step-by-step instructions to create and manage the support package.

## Create and upload a support package in the Azure classic portal

You can create and upload a support package to the Microsoft Support site through the **Maintenance** page of the service in the Azure classic portal.

> [AZURE.NOTE] The upload requires a support passkey. Your support engineer should provide this to you in an email.

An encrypted and compressed support package (.cab file) is created and uploaded to the Support site. The support engineer can then retrieve this package from the Support site for troubleshooting the issue.

Perform the following steps in the classic portal to create a support package.

#### To create a support package in the Azure classic portal

1. Select **Devices** > **Maintenance**.

2. In the **Support package** section, select **Create and upload support package**.

3. In the **Create and upload support package** dialog box, do the following:

	![Create support package](./media/storsimple-create-manage-support-package/IC740923.png)

	- In the **Support Passkey** text box, enter the passkey. Your Microsoft support engineer should send this passkey to you in email.

	- Select the check box to provide consent to automatically upload the support package to the Microsoft Support site.

	- Click the check icon ![Check icon](./media/storsimple-create-manage-support-package/IC740895.png).


## Manually create a support package

In some cases, you'll need to manually create the support package through Windows PowerShell for StorSimple. For example:

- If you need to remove sensitive information from your log files prior to sharing with Microsoft Support.

- If you are having difficulty uploading the package due to connectivity issues.

You can share your manually generated support package with Microsoft Support over email. Perform the following steps to create a support package in Windows PowerShell for StorSimple.

#### To create a support package in Windows PowerShell for StorSimple

1. To start a Windows PowerShell session as an administrator on the remote computer that's used to connect to your StorSimple device, enter the following command:

	`Start PowerShell`

2. In the Windows PowerShell session, connect to the SSAdmin Console of your device:

	- At the command prompt, enter:

		`$MS = New-PSSession -ComputerName <IP address for DATA 0> -Credential SSAdmin -ConfigurationName "SSAdminConsole"`

	1. In the dialog box that opens, enter your device administrator password. The default password is:

		`Password1`

		![PowerShell credential dialog box](./media/storsimple-create-manage-support-package/IC740962.png)

	2. Select **OK**.
	1. At the command prompt, enter:

		`Enter-PSSession $MS`

3. In the session that opens, enter the appropriate command.

	- For network shares that are password protected, enter:

		`Export-HcsSupportPackage –PackageTag "MySupportPackage" –Credential "Username" -Force`

		You'll be prompted for a password, a path to the network shared folder, and an encryption passphrase (because the support package is encrypted). A support package is then created in the specified folder.

	- For shares that are not password protected, you do not need the `-Credential` parameter. Enter the following:

		`Export-HcsSupportPackage –PackageTag "MySupportPackage" -Force`

		The support package is created for both controllers in the specified network shared folder. It's an encrypted, compressed file that can be sent to Microsoft Support for troubleshooting. For more information, see [Contact Microsoft Support](storsimple-contact-microsoft-support.md).


### The Export-HcsSupportPackage cmdlet parameters
You can use the following parameters with the Export-HcsSupportPackage cmdlet.

| Parameter            | Required/Optional | Description                                                                                                                                                             |
|----------------------|-------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `-Path`                 | Required          | Use to provide the location of the network shared folder in which the support package is placed.                                                                 |
| `-EncryptionPassphrase` | Required          | Use to provide a passphrase to help encrypt the support package.                                                                                                        |
| `-Credential`           | Optional          | Use to supply access credentials for the network shared folder.                                                                                        |
| `-Force`                | Optional          | Use to skip the encryption passphrase confirmation step.                                                                                                                |
| `-PackageTag`           | Optional          | Use to specify a directory under *Path* in which the support package is placed. The default is [device name]-[current date and time:yyyy-MM-dd-HH-mm-ss].       |
| `-Scope`                | Optional          | Specify as **Cluster** (default) to create a support package for both controllers. If you want to create a package only for the current controller, specify **Controller**. |


## Edit a support package

After you have generated a support package, you might need to edit the package to remove sensitive information. This can include volume names, device IP addresses, and backup names from the log files.

> [AZURE.IMPORTANT] You can only edit a support package that was generated through Windows PowerShell for StorSimple. You can't edit a package created in the Azure classic portal with StorSimple Manager service.

To edit a support package before uploading it on the Microsoft Support site, first decrypt the support package, edit the files, and then re-encrypt it. Perform the following steps.

#### To edit a support package in Windows PowerShell for StorSimple

1. Generate a support package as described earlier, in [To create a support package in Windows PowerShell for StorSimple](#to-create-a-support-package-in-windows-powershell-for-storsimple).

2. [Download the script](http://gallery.technet.microsoft.com/scriptcenter/Script-to-decrypt-a-a8d1ed65) locally on your client.

3. Import the Windows PowerShell module. Specify the path to the local folder in which you downloaded the script. To import the module, enter:

	`Import-module <Path to the folder that contains the Windows PowerShell script>`

4. All the files are *.aes* files that are compressed and encrypted. To decompress and decrypt files, enter:

	`Open-HcsSupportPackage <Path to the folder that contains support package files>`

	Note that the actual file extensions are now displayed for all the files.

	![Edit support package](./media/storsimple-create-manage-support-package/IC750706.png)

5. When you're prompted for the encryption passphrase, enter the passphrase that you used when the support package was created.

    	cmdlet Open-HcsSupportPackage at command pipeline position 1

    	Supply values for the following parameters:EncryptionPassphrase: ****

6. Browse to the folder that contains the log files. Because the log files are now decompressed and decrypted, these will have original file extensions. Modify these files to remove any customer-specific information, such as volume names and device IP addresses, and save the files.

7. Close the files to compress them with gzip and encrypt them with AES-256. This is for speed and security in transferring the support package over a network. To compress and encrypt files, enter the following:

	`Close-HcsSupportPackage <Path to the folder that contains support package files>`

	![Edit support package](./media/storsimple-create-manage-support-package/IC750707.png)

8. When prompted, provide an encryption passphrase for the modified support package.

	    cmdlet Close-HcsSupportPackage at command pipeline position 1
    	Supply values for the following parameters:EncryptionPassphrase: ****

9. Write down the new passphrase, so that you can share it with Microsoft Support when requested.


### Example: Editing files in a support package on a password-protected share

The following example shows how to decrypt, edit, and re-encrypt a support package.

    	PS C:\WINDOWS\system32> Import-module C:\Users\Default\StorSimple\SupportPackage\HCSSupportPackageTools.psm1

    	PS C:\WINDOWS\system32> Open-HcsSupportPackage \\hcsfs\Logs\TD48\TD48Logs\C0-A\etw

    	cmdlet Open-HcsSupportPackage at command pipeline position 1

    	Supply values for the following parameters:

    	EncryptionPassphrase: ****

    	PS C:\WINDOWS\system32> Close-HcsSupportPackage \\hcsfs\Logs\TD48\TD48Logs\C0-A\etw

    	cmdlet Close-HcsSupportPackage at command pipeline position 1

    	Supply values for the following parameters:

    	EncryptionPassphrase: ****

    	PS C:\WINDOWS\system32>

## Next steps

- Learn how to [use support packages and device logs to troubleshoot your device deployment](storsimple-troubleshoot-deployment.md#support-packages-and-device-logs-available-for-troubleshooting).

- Learn how to [use the StorSimple Manager service to administer your StorSimple device](storsimple-manager-service-administration.md).

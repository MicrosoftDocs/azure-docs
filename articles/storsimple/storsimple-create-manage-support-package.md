<properties 
   pageTitle="Create and manage a Support package"
   description="Learn how to start a support session to generate, decrypt and edit a support package"
   services="storsimple"
   documentationCenter=""
   authors="alkohli"
   manager="carolz"
   editor="tysonn" />
<tags 
   ms.service="storsimple"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="na"
   ms.date="07/23/2015"
   ms.author="alkohli" />


#Create and Manage a Support package
This tutorial describes the various tasks associated with creating and managing a Support package. A Support package includes all the relevant logs in an encrypted, compressed format and is used to assist the Microsoft Support team with troubleshooting any StorSimple device issues.

This tutorial includes step-by-step instructions to create and manage the Support package by using the:

- **Support package** section of the **Maintenance** page in the StorSimple Manager service
- Windows PowerShell for StorSimple

After reading this tutorial, you will be able to:

- Start a Support session
- Create a Support package
- Decrypt and edit a Support package

## Start a support session in Windows PowerShell for StorSimple

To troubleshoot any issues that you might experience with the StorSimple device, you will need to engage with the Microsoft Support team. Microsoft Support may need to use a support session to log on to your device. Perform the following steps to start a support session on the Windows PowerShell interface of your StorSimple device.

#### To start a support session

1. Access the device directly by using the serial console or through a telnet session from a remote computer. To do this, follow the steps in [Use PuTTY to connect to the device serial console](storsimple-deployment-walkthrough.md#step-3-configure-and-register-the-device-through-windows-powershell-for-storsimple).

1. In the session that opens, press the **Enter** key to get a command prompt.

1. In the serial console menu, select option 1, **Log in with full access**.

1. At the prompt, type the following password: 

	`*Password1*`

1. At the prompt, type the following command:

	`Enable-HcsSupportAccess`

1. An encrypted string will be presented to you. Copy this string into a text editor such as Notepad.

1. Save this string and send it in an email message to Microsoft Support. The Microsoft Support team will determine the appropriate next steps. For more information, see [Contact Microsoft Support](https://msdn.microsoft.com/library/azure/dn757750.aspx).

> [AZURE.IMPORTANT] You can disable support access by running `Disable-HcsSupportAccess`. The StorSimple device will also attempt to disable support access 8 hours after the session was initiated. It is a best practice to change your StorSimple device credentials after initiating a support session.

## Create a support package

A support package includes all the relevant logs that can assist the Microsoft Support team with troubleshooting any StorSimple device issues. You can generate an encrypted support package for your StorSimple device through 

- StorSimple Manager service in Azure Management Portal  
- Windows PowerShell for StorSimple


## Create a support package in Management Portal
To troubleshoot any issues that you may be experiencing with StorSimple Manager service, you can create and upload a support package to the Microsoft Support site through the **Maintenance** page of the service in  the Management Portal. You will need to provide a support pass key to allow the upload. The support pass key should be provided to you by your Support Engineer in an email. An unencrypted, compressed support package is created (.cab file). This package can then be retrieved by the Support Engineer from the Support site when the engineer supplies the pass key.

Perform the following steps in Management Portal to create a support package:

#### To create a Support package in Management Portal

1. Navigate to **Devices > Maintenance**.

1. In the **Support package** section, click **Create and upload Support package**.

	![Create Support Package](./media/storsimple-create-manage-support-package/IC740923.png)

1. In the **Create and upload support package** dialog box, do the following:
											
	1. Provide the **Support Passkey**. This key should be sent to you by your Microsoft Support Engineer in an email.
	
	1. Check the combo box to provide consent to **automatically upload the support package to the Microsoft Support site**.
	
	1. Click the check icon ![Check icon](./media/storsimple-create-manage-support-package/IC740895.png) .


## Create a Support package in Windows PowerShell for StorSimple
If you need to edit your log files prior to creating a package, you will need to create your package through the Windows PowerShell for StorSimple. Perform the following steps to create a Support package in Windows PowerShell for StorSimple.


#### To create a support package in Windows PowerShell for StorSimple

1. Type the following command to start a Windows PowerShell session as an administrator on the remote computer used to connect to your StorSimple device:

	`Start PowerShell`

1. In the Windows PowerShell session, connect to the SSAdmin Console runspace of your device by performing the following steps: 
	1. Type the following command at the command prompt:
		
		`$MS = New-PSSession -ComputerName <IP of DATA 0> -Credential SSAdmin -ConfigurationName "SSAdminConsole"`
		
		Where <IP of DATA 0> contains the IP address for DATA 0.


	1. In the dialog box that opens, type your device administrator password. The default password is:*Password1*.

		![PowerShell Session To SSAdminConsole Runspace](./media/storsimple-create-manage-support-package/IC740962.png)
	2. Click **OK**.
	1. At the command prompt, type the following command:
		
		`Enter-PSSession $MS`


1. In the session that opens, type the appropriate command. 


	- For network shares that are password protected, type:

		`Export-HcsSupportPackage –PackageTag "MySupportPackage" –Credential "Username" -Force`

		You will be prompted for a password, a path to the network shared folder, and an encryption passphrase (because the support package is encrypted). When these are provided, a support package will be created in the specified folder.
											

	- For open network shared folders (those that are not password protected), you do not need the -Credential parameter. Type the following: 

		`Export-HcsSupportPackage –PackageTag "MySupportPackage" -Force`

		The support package will be created for both controllers in the specified network shared folder. It is an encrypted, compressed file that can be sent to Microsoft Support for troubleshooting. For more information, see [Contact Microsoft Support](https://msdn.microsoft.com/en-us/library/dn757750.aspx).


### More information about the Export-HcsSupportPackage cmdlet

Required parameters for the Export-HcsSupportPackage cmdlet are:

- **Path** – Use to provide the location of the network shared folder in which the support package will be placed.

- **EncryptionPassphrase** – Use to provide a passphrase to help encrypt the support package.


Optional parameters for the Export-HcsSupportPackage cmdlet are:

- **Credential** – Use this parameter to supply access credentials for the network shared folder.

- **Force**  – Use to skip the encryption passphrase confirmation step.

- **PackageTag** – Use to specify a directory under Path in which the support package will be placed. The default is [device name]-[ current date and time:yyyy-MM-dd-HH-mm-ss].

- **Scope** – Specify as **Cluster** (default) to create a support package for both controllers. If you want to create a package only for the current controller, specify **Controller**.

## Edit a support package

Once you have generated a support package, you may need to edit the package to remove customer-specific information such as volume names, device IP addresses, backup names, and so on, from the log files. 

> [AZURE.IMPORTANT] You can only edit a support package that was generated through Windows PowerShell for StorSimple. You cannot edit a package created in the Management Portal with StorSimple Manager service. 

To edit a support package before uploading it on the Microsoft Support site, you will need to decrypt the support package, edit the files and then encrypt it again. Perform the following steps to edit a support package:

#### To edit a support package in Windows PowerShell for StorSimple

1. Use Windows PowerShell for StorSimple to generate a support package as described in [Generate a support package](https://msdn.microsoft.com/en-us/library/dn772348.aspx).

1. [Download the script](http://gallery.technet.microsoft.com/scriptcenter/Script-to-decrypt-a-a8d1ed65) locally on your client.


1. Import the Windows PowerShell module. You will need to specify the path to the local folder in which you downloaded the script. To import the module, type:
 
	`Import-module <Path to the folder that contains the Windows PowerShell script>`

1. Open the support package folder. Note that all the files are .aes files that are compressed and encrypted. Open the files. To open files, type:

	`Open-HcsSupportPackage <Path to the folder that contains support package files>`

	This will decompress and decrypt the files. You will note that the actual file extensions are now displayed for all the files.
	
	![Edit Support Package 3](./media/storsimple-create-manage-support-package/IC750706.png)


1. When prompted for the encryption passphrase, type the passphrase used when the support package was created.

    	cmdlet Open-HcsSupportPackage at command pipeline position 1
    
    	Supply values for the following parameters:EncryptionPassphrase: ****
	

1. Navigate to the folder that contains the log files. You will note that the files are now decompressed and decrypted. The original file extensions will now be displayed. Modify these files to remove any customer-specific information such as volume names, device IP addresses, and so on, and then save the files.

1. Close the files. Closing the files will compress them with Gzip and then encrypt them with AES-256. This is for security and speed when transferring the support package over a network. To close files, type:

	`Close-HcsSupportPackage <Path to the folder that contains support package files>`

	![Edit Support Package 2](./media/storsimple-create-manage-support-package/IC750707.png)

1. When prompted, provide an encryption passphrase for the modified support package.

	    cmdlet Close-HcsSupportPackage at command pipeline position 1
    	Supply values for the following parameters:EncryptionPassphrase: ****

1. Write down the new passphrase so that you can share it with Microsoft Support when requested.


### Example: Editing files in a support package on a password-protected share

An example demonstrating how to decrypt, edit and re-encrypt a support package is shown below.

![Edit Support Package1](./media/storsimple-create-manage-support-package/IC750708.png)

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

Troubleshoot your device deployment using Support package




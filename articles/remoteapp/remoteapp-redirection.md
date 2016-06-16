<properties
    pageTitle="Using redirection in Azure RemoteApp | Microsoft Azure"
    description="Learn how to configure and use redirection in RemoteApp"
    services="remoteapp"
    documentationCenter=""
    authors="lizap"
    manager="mbaldwin" />

<tags
    ms.service="remoteapp"
    ms.workload="compute"
    ms.tgt_pltfrm="na"
    ms.devlang="na"
    ms.topic="article"
    ms.date="05/13/2016"
    ms.author="elizapo" />

# Using redirection in Azure RemoteApp

Device redirection lets your users interact with remote apps using the devices attached to their local computer, phone, or tablet. For example, if you have provided Skype through Azure RemoteApp, your user needs the camera installed on their PC to work with Skype. This is also true for printers, speakers, monitors, and a range of USB-connected peripherals.

RemoteApp leverages the Remote Desktop Protocol (RDP) and RemoteFX to provide redirection.

## What redirection is enabled by default?
When you use RemoteApp, the following redirections are enabled by default. The information in parentheses show the RDP setting.

- Play sounds on the local computer (**Play on this computer**). (audiomode:i:0)
- Capture audio from the local computer and send to the remote computer (**Record from this computer**). (audiocapturemode:i:1)
- Print to local printers (redirectprinters:i:1)
- COM ports (redirectcomports:i:1)
- Smart card device (redirectsmartcards:i:1)
- Clipboard (ability to copy and paste) (redirectclipboard:i:1)
- Clear type font smoothing (allow font smoothing:i:1)
- Redirect all supported Plug and Play devices. (devicestoredirect:s:*)

## What other redirection is available?
Two redirection options are disabled by default:

- Drive redirection (drive mapping): Your local computer's drives become mapped drives in the remote session. This lets you save or open files from your local drives while you work in the remote session.
- USB redirection: You can use the USB devices attached to your local computer within the remote session.

## Change your redirection settings in RemoteApp
You can change the device redirection settings for a collection by using the Microsoft Azure PowerShell with SDK. After you install the new PowerShell and SDK, first configure it to manage your subscription as described in [How to install and configure Azure PowerShell](../powershell-install-configure.md).

Then use a command similar to the following to set the custom RDP properties:

	Set-AzureRemoteAppCollection -CollectionName <collection name>  -CustomRdpProperty "drivestoredirect:s:*`nusbdevicestoredirect:s:*"

(Note that *`n* is used as a delimiter between individual properties.)

To get a list of what custom RDP properties are configured, run the following cmdlet. Note that only custom properties are shown as output results and not the default properties:  

    Get-AzureRemoteAppCollection -CollectionName <collection name>

When you set custom properties you must specify all custom properties each time; otherwise the setting reverts to disabled.   

### Common examples
Use the following cmdlet to enable drive redirection:  

	Set-AzureRemoteAppCollection -CollectionName <collection name>  -CustomRdpProperty "drivestoredirect:s:*”

Use this cmdlet to enable both USB and Drive redirection:

	Set-AzureRemoteAppCollection -CollectionName <collection name>  -CustomRdpProperty "drivestoredirect:s:*`nusbdevicestoredirect:s:*"

Use this cmdlet to disable clipboard sharing:  

	Set-AzureRemoteAppCollection -CollectionName <collection name>  -CustomRdpProperty "redirectclipboard:i:0”

> [AZURE.IMPORTANT] Be sure to completely log off all users in the collection (and not just disconnect them) before you test the change. To ensure users are completely logged off, go to the **Sessions** tab in the collection in the Azure portal and log off any users who are disconnected or signed in. Sometimes it can take several seconds for the local drives to show in Explorer within the session.

## Change USB redirection settings on your Windows client

If you want to use USB redirection on a computer that connects to RemoteApp, there are 2 actions that need to happen. 1 - Your administrator needs to enable USB redirection at the collection level by using Azure PowerShell. 2 - On each device where you want to use USB redirection, you need to enable a group policy that permits it. This step will need to be done for each user that wants to use USB redirection.

> [AZURE.NOTE] USB redirection with Azure RemoteApp is only supported for Windows computers.

### Enable USB redirection for the RemoteApp collection
Use the following cmdlet to enable USB redirection at the collection level:

    Set-AzureRemoteAppCollection -CollectionName <collection_name> -CustomRdpProperty "nusbdevicestoredirect:s:*"

### Enable USB redirection for the client computer

To configure USB redirection settings on your computer:

1. Open the Local Group Policy Editor (GPEDIT.MSC). (Run gpedit.msc from a command prompt.)
2. Open **Computer Configuration\Policies\Administrative Templates\Windows Components\Remote Desktop Services\Remote Desktop Connection Client\RemoteFX USB Device Redirection**.
3. Double-click **Allow RDP redirection of other supported RemoteFX USB devices from this computer**.
4. Select **Enabled**, and then select **Administrators and Users in the RemoteFX USB Redirection Access Rights**.
5. Open a command prompt with administrative permissions, and run the following command:

		gpupdate /force
6. Restart the computer.

You can also use the Group Policy Management tool to create and apply the USB redirection policy for all computers in your domain:

1. Log into the domain controller as the domain administrator.
2. Open the Group Policy Management Console. (Click **Start > Administrative Tools > Group Policy Management**.)
3. Navigate to the domain or organizational unit for which you want to create the policy.
4. Right-click **Default Domain Policy**, and then click **Edit**.
5. Open **Computer Configuration\Policies\Administrative Templates\Windows Components\Remote Desktop Services\Remote Desktop Connection Client\RemoteFX USB Device Redirection**.
6. Double-click **Allow RDP redirection of other supported RemoteFX USB devices from this computer**.
7. Select **Enabled**, and then select **Administrators and Users in the RemoteFX USB Redirection Access Rights**.
8. Click **OK**.  

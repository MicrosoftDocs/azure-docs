---
title: Active Directory Windows Virtual Machines in Azure with External NTP Source
description: Active Directory Windows Virtual Machines in Azure with External NTP Source
author: NDVALPHA
ms.service: virtual-machines
ms.collection: windows
ms.topic: conceptual
ms.workload: infrastructure-services
ms.date: 08/05/2022
ms.author: ndelvillar
---

# Configure Active Directory Windows Virtual Machines in Azure with External NTP Source

**Applies to:** :heavy_check_mark: Windows Virtual Machines

Use this guide to learn how to setup time synchronization for your Azure Windows Virtual Machines that belong to an Active Directory Domain with an external NTP source.

## Time Sync for Active Directory Windows Virtual Machines in Azure with External NTP Source

Time synchronization in Active Directory should be managed by only allowing the PDC to access an external time source or NTP Server. All other Domain Controllers would then sync time against the PDC. If your PDC is an Azure Virtual Machine follow these steps:

>[!NOTE]
>Due to Azure Security configurations, the following settings must be applied on the PDC using the **Local Group Policy Editor**.

To check current time source in your **PDC**, from an elevated command prompt run *w32tm /query /source* and note the output for later comparison.

1. From *Start* run *gpedit.msc*
2. Navigate to the *Global Configuration Settings* policy under *Computer Configuration* -> *Administrative Templates* -> *System* -> *Windows Time Service*.
3. Set it to *Enabled* and configure the *AnnounceFlags* parameter to **5**.
4. Navigate to *Computer Settings* -> *Administrative Templates* -> *System* -> *Windows Time Service* -> *Time Providers*.
5. Double click the *Configure Windows NTP Client* policy and set it to *Enabled*, configure the parameter *NTPServer* to point to an IP address of a time server followed by `,0x9` for example: `131.107.13.100,0x9` and configure *Type* to NTP. For all the other parameters you can use the default values, or use custom ones according to your corporate needs.

>[!IMPORTANT]
>You must mark the VMIC provider as *Disabled* in the Local Registry. Remember that serious problems might occur if you modify the registry incorrectly. Therefore, make sure that you follow these steps carefully. For added protection, back up the registry before you modify it. Then, you can restore the registry if a problem occurs. For how to back up and restore the Windows Registry follow the steps below.

## Back up the registry manually

- Select Start, type regedit.exe in the search box, and then press Enter. If you are prompted for an administrator password or for confirmation, type the password or provide confirmation.
- In Registry Editor, locate and click the registry key or subkey that you want to back up.
- Select File -> Export.
- In the Export Registry File dialog box, select the location to which you want to save the backup copy, and then type a name for the backup file in the File name field.
- Select Save.

## Restore a manual backup

- Select Start, type regedit.exe, and then press Enter. If you are prompted for an administrator password or for confirmation, type the password or provide confirmation.
- In Registry Editor, click File -> Import.
- In the Import Registry File dialog box, select the location to which you saved the backup copy, select the backup file, and then click Open.

To mark the VMIC provider as *Disabled* from *Start* type *regedit.exe* -> In the *Registry Editor* navigate to *HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\w32time\TimeProviders* -> On key *VMICTimeProvider* set the value to **0**

>[!NOTE]
>It can take up to 15 minutes for these changes to reflect in the system.

From an elevated command prompt rerun *w32tm /query /source* and compare the output to the one you noted at the beginning of the configuration. Now it will be set to the NTP Server you chose.

## GPO for Clients

Configure the following Group Policy Object to enable your clients to synchronize time with any Domain Controller in your Domain:

To check current time source in your client, from an elevated command prompt run *w32tm /query /source* and note the output for later comparison.

1. From a Domain Controller go to *Start* run *gpmc.msc*
2. Browse to the Forest and Domain where you want to create the GPO.
3. Create a new GPO, for example *Clients Time Sync*, in the container *Group Policy Objects*.
4. Right-click on the newly created GPO and Edit.
5. In the *Group Policy Management Editor* navigate to the *Configure Windows NTP Client* policy under *Computer Configuration* -> *Administrative Templates* -> *System* -> *Windows Time Service* -> *Time Providers*
6. Set it to *Enabled*, configure the parameter *NTPServer* to point to a Domain Controller in your Domain followed by `,0x8` for example: `DC1.contoso.com,0x8` and configure *Type* to NT5DS. For all the other parameters you can use the default values, or use custom ones according to your corporate needs.
7. Link the GPO to the Organizational Unit where your clients are located.

>[!IMPORTANT]
>In the the parameter `NTPServer` you can specify a list with all the Domain Controllers in your domain, like this: `DC1.contoso.com,0x8 DC2.contoso.com,0x8 DC3.contoso.com,0x8`

From an elevated command prompt rerun *w32tm /query /source* and compare the output to the one you noted at the beginning of the configuration. Now it will be set to the Domain Controller that satisfied the client's authentication request.

## Next steps

Below are links to more details about the time sync:

- [Windows Time Service Tools and Settings](/windows-server/networking/windows-time-service/windows-time-service-tools-and-settings)
- [Windows Server 2016 Improvements
](/windows-server/networking/windows-time-service/windows-server-2016-improvements)
- [Accurate Time for Windows Server 2016](/windows-server/networking/windows-time-service/accurate-time)
- [Support boundary to configure the Windows Time service for high-accuracy environments](/windows-server/networking/windows-time-service/support-boundary)
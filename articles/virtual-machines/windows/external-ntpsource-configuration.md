---
title: Time mechanism for Active Directory Windows Virtual Machines in Azure
description: Time mechanism for Active Directory Windows Virtual Machines in Azure
author: NDVALPHA
ms.service: virtual-machines
ms.collection: windows
ms.topic: conceptual
ms.workload: infrastructure-services
ms.date: 08/05/2022
ms.author: ndelvillar
---

# Configure the time mechanism for Active Directory Windows Virtual Machines in Azure

**Applies to:** :heavy_check_mark: Windows Virtual Machines

Use this guide to learn how to set up time synchronization for your Azure Windows Virtual Machines that belong to an Active Directory Domain.

## Time sync hierarchy in Active Directory Domain Services

Time synchronization in Active Directory should be managed by only allowing the **PDC** to access an external time source or NTP Server.

All other Domain Controllers would then sync time against the PDC, and all other members will get their time from the Domain Controller that satisfied that member's authentication request.

If you have an Active Directory domain running on virtual machines hosted in Azure, follow these steps to properly set up Time Sync.

>[!NOTE]
>This guide focuses on using the **Group Policy Management** console to perform the configuration. You can achieve the same results by using the Command Prompt, PowerShell, or by manually modifying the Registry; however, those methods are not in scope in this article. 

## GPO to allow the PDC to synchronize with an External NTP Source

To check current time source in your **PDC**, from an elevated command prompt run *w32tm /query /source* and note the output for later comparison.

1. From *Start* run *gpmc.msc*.
2. Browse to the Forest and Domain where you want to create the GPO.
3. Create a new GPO, for example *PDC Time Sync*, in the container *Group Policy Objects*.
4. Right-click on the newly created GPO and Edit.
5. Navigate to the *Global Configuration Settings* policy under *Computer Configuration* -> *Administrative Templates* -> *System* -> *Windows Time Service*.
6. Set it to *Enabled* and configure the *AnnounceFlags* parameter to **5**.
7. Navigate to *Computer Configuration* -> *Administrative Templates* -> *System* -> *Windows Time Service* -> *Time Providers*.
8. Double click the *Configure Windows NTP Client* policy and set it to *Enabled*, configure the parameter *NTPServer* to point to an IP address or FQDN of a time server followed by `,0x9` for example: `131.107.13.100,0x9` and configure *Type* to **NTP**. For all the other parameters you can use the default values, or use custom ones according to your corporate needs.
9. Click the *Next Setting* button, set the *Enable Windows NTP Client* policy to *Enabled* and click *OK*
10. In the *Scope* tab of the newly created GPO navigate to **Security Filtering** and highlight the *Authenticated Users* group -> Click the *Remove* button -> *OK* -> *OK*
11. Create a WMI Filter to dynamically get the Domain Controller that holds the PDC role:
    - In the *Group Policy Management* console, navigate to *WMI Filters*, right-click on it and select *New*.
    - In the *New WMI Filter* window, give a name to the new filter, for example, *Get PDC Emulator* -> Fill out the *Description* field (optional) -> Click the *Add* button.
    - In the *WMI Query* window leave the *Namespace* as is, in the *Query* text box paste the following string `Select * from Win32_ComputerSystem where DomainRole = 5`, then click the *OK* button.
    - Back in the *New WMI Filter* window click the *Save* button.
12. In the *Scope* tab of the newly created GPO navigate to the **WMI Filtering** drop-down menu and select the previously created WMI filter then click *OK*.
13. In the *Scope* tab of the newly created GPO navigate to the **Security Filtering** click the *Add* button and browse for the *Domain Controllers* group, then click the *OK* button.
14. Link the GPO to the **Domain Controllers** Organizational Unit.

>[!NOTE]
>It can take up to 15 minutes for these changes to be reflected by the system.

From an elevated command prompt rerun *w32tm /query /source* and compare the output to the one you noted at the beginning of the configuration. Now it will be set to the NTP Server you chose.

>[!TIP]
>If you want to speed-up the process of changing the NTP source on your **PDC**, from an elevated command prompt run *gpupdate /force*, followed by *w32tm /resync /nowait*, then rerun *w32tm /query /source*; the output should be the NTP Server you used in the above GPO.

## GPO for Members

Usually, NTP in Active Directory Domain Services will follow the AD DS Time Hierarchy mentioned at the beginning of this article and no further configuration is required.

Nevertheless, virtual machines hosted in Azure have specific security settings applied to them directly by the Cloud platform.

For all other domain members that are not Domain Controllers, you will need to modify the registry and set the value to **0** in the key **Enabled** under **HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\W32Time\TimeProviders\VMICTimeProvider**

>[!IMPORTANT]
>Remember that serious problems might occur if you modify the registry incorrectly. Therefore, make sure that you follow these steps carefully and test them on a couple of test virtual machines to make sure you will get the expected outcome. For added protection, back up the registry before you modify it. Then, you can restore the registry if a problem occurs. For how to back up and restore the Windows Registry follow the steps below.

## Back up the Registry

1. From *Start* type *regedit.exe*, and then press `Enter`. If you are prompted for an administrator password or for confirmation, type the password or provide confirmation.
2. In the *Registry Editor* window, locate and click the registry key or subkey that you want to back up.
3. From the *File* menu select *Export*.
4. In the *Export Registry File* dialog box, select the location to which you want to save the backup copy, type a name for the backup file in the *File name* field, and then click *Save*.

## Restore a Registry backup

1. From *Start* type *regedit.exe*, and then press `Enter`. If you are prompted for an administrator password or for confirmation, type the password or provide confirmation.
2. In the *Registry Editor* window, from the *File* menu select *Import*.
3. In the *Import Registry File* dialog box, select the location to which you saved the backup copy, select the backup file, and then click *Open*.

## GPO to disable the VMICTimeProvider

Configure the following Group Policy Object to enable domain members to synchronize time with Domain Controllers in their corresponding Active Directory Site:

To check current time source, login to any domain member and from an elevated command prompt run *w32tm /query /source* and note the output for later comparison.

1. From a Domain Controller go to *Start* run *gpmc.msc*.
2. Browse to the Forest and Domain where you want to create the GPO.
3. Create a new GPO, for example *Clients Time Sync*, in the container *Group Policy Objects*.
4. Right-click on the newly created GPO and Edit.
5. Navigate to *Computer Configuration* -> *Preferences* -> Right-click on *Registry* -> *New* -> *Registry Item*
6. In the *New Registry Properties* window set the following values:
    - On **Action:** *Update*
    - On **Hive:** *HKEY_LOCAL_MACHINE*
    - On **Key Path**: browse to *SYSTEM\CurrentControlSet\Services\W32Time\TimeProviders\VMICTimeProvider*
    - On **Value Name** type *Enabled*
    - On **Value Type**: *REG_DWORD*
    - On **Value Data**: type *0*
7. For all the other parameters use the default values and click *OK*
8. Link the GPO to the Organizational Unit where your members are located.
9. Wait or manually force a *Group Policy Update* on the domain member.

Go back to the domain member and from an elevated command prompt rerun *w32tm /query /source* and compare the output to the one you noted at the beginning of the configuration. Now it will be set to the Domain Controller that satisfied the member's authentication request.

## Next steps

Below are links to more details about the time sync:

- [Windows Time Service Tools and Settings](/windows-server/networking/windows-time-service/windows-time-service-tools-and-settings)
- [Windows Server 2016 Improvements
](/windows-server/networking/windows-time-service/windows-server-2016-improvements)
- [Accurate Time for Windows Server 2016](/windows-server/networking/windows-time-service/accurate-time)
- [Support boundary to configure the Windows Time service for high-accuracy environments](/windows-server/networking/windows-time-service/support-boundary)

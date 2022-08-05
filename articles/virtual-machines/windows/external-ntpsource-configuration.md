---
title: Configure Azure Windows VMs with External NTP Source
description: Configure Azure Windows VMs with External NTP Source.
author: NDVALPHA
ms.service: virtual-machines
ms.collection: windows
ms.topic: conceptual
ms.workload: infrastructure-services
ms.date: 08/05/2022
ms.author: NDVALPHA
---

# Time sync for Windows VMs in Azure

**Applies to:** :heavy_check_mark: Windows VMs

Use this guide to learn how to setup time synchronization for your Azure Windows VMs with an external time source.

## Time configuration for Azure VMs

Time synchronization in Active Directory should be managed by only allowing the PDC to access an external time source or NTP Server. If your PDC is an Azure VM follow these steps:

>[!NOTE]
>Due to Azure Security configurations, the following settings must be applied on the PDC using the **Local Group Policy Editor**.

1. From *Start* run *gpedit.msc*
2. Navigate to the *Global Configuration Settings* policy under *Computer Configuration* -> *Administrative Templates* -> *System* -> *Windows Time Service*.
3. Set it to *Enabled* and configure the *AnnounceFlags* parameter to **5**.
4. Navigate to *Computer Settings* -> *Administrative Templates* -> *System* -> *Windows Time Service* -> *Time Providers*.
5. Double click the *Configure Windows NTP Client* policy and set it to *Enabled*, configure the parameter *NTPServer* to point to an IP address of a time server followed by ,0x9 for example: 131.107.13.100,0x9 and configure *Type* to NTP. For all the other parameters you can use the default values, or use custom ones according to you corporate needs.

>[!IMPORTANT]
>You must mark the VMIC provider as *Disabled* in the Local Registry. Remember that serious problems might occur if you modify the registry incorrectly. Therefore, make sure that you follow these steps carefully. For added protection, back up the registry before you modify it. Then, you can restore the registry if a problem occurs. For more information about how to back up and restore the registry, follow the [How to back up and restore the registry in Windows](https://support.microsoft.com/topic/how-to-back-up-and-restore-the-registry-in-windows-855140ad-e318-2a13-2829-d428a2ab0692) guide.

From *Start* type *regedit* -> In the *Registry Editor* navigate to *HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\w32time\TimeProviders* -> On key *VMICTimeProvider* set the value to **0**

>[NOTE]
>It can take up to 15 minutes for these changes to reflect in the system.

## GPO for Clients

Configure the following Group Policy Object to enable your clients to synchronize time with the Domain Controller:

1. From a Domain Controller go to *Start* run *gpmc.msc*
2. Browse to the Forest and Domain where you want to create the GPO.
3. Create a new GPO, for example *Clients Time Sync*, in the container *Group Policy Objects*.
4. Right-click on the newly created GPO and Edit.
5. In the *Group Policy Management Editor* navigate to the *Configure Windows NTP Client* policy under *Computer Configuration* -> *Administrative Templates* -> *System* -> *Windows Time Service* -> *Time Providers*
6. Set it to *Enabled*, configure the parameter *NTPServer* to point to a Domain Controller in your Domain followed by ,0x8 for example: DC1.contoso.com,0x8 and configure *Type* to NT5DS. For all the other paramenters you can use the default values, or use custom ones according to you corporate needs.
7. Link the GPO to the Organizational Unit where your clients are located.

>[!IMPORTANT]
>In the the parameter *NTPServer* you can specify a list with all the Domain Controllers in your domain, like this: DC1.contoso.com,0x8 DC2.contoso.com,0x8 DC3.contoso.com,0x8

## Next steps

Below are links to more details about the time sync:

- [Windows Time Service Tools and Settings](/windows-server/networking/windows-time-service/windows-time-service-tools-and-settings)
- [Windows Server 2016 Improvements
](/windows-server/networking/windows-time-service/windows-server-2016-improvements)
- [Accurate Time for Windows Server 2016](/windows-server/networking/windows-time-service/accurate-time)
- [Support boundary to configure the Windows Time service for high-accuracy environments](/windows-server/networking/windows-time-service/support-boundary)
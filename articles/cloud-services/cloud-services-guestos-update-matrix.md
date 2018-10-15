---
title: Learn about the latest Azure Guest OS Releases | Microsoft Docs
description: The latest release news and SDK compatibility for Azure Cloud Services Guest OS.
services: cloud-services
documentationcenter: na
author: raiye
editor: ''

ms.assetid: 6306cafe-1153-44c7-8554-623b03d59a34
ms.service: cloud-services
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: tbd
ms.date: 10/12/2018
ms.author: raiye

---
# Azure Guest OS releases and SDK compatibility matrix
Provides you with up-to-date information about the latest Azure Guest OS releases for Cloud Services. This information helps you plan your upgrade path before a Guest OS is disabled. If you configure your roles to use *automatic* Guest OS updates as described in [Azure Guest OS Update Settings][Azure Guest OS Update Settings], it is not vital that you read this page.

> [!IMPORTANT]
> This page applies to Cloud Services web and worker roles, which run on top of a Guest OS. It does **not apply** to IaaS Virtual Machines.
>
>


> [!TIP]
>  Subscribe to the [Guest OS Update RSS Feed] to receive the most timely notification on all Guest OS changes.
>
>

> [!IMPORTANT]
> Only the latest 2 versions of the Guest OS will be supported and available in the Azure portal.
>
>

Unsure about how to update your Guest OS? Check [this][cloud updates] out.

## News updates

###### **October 12, 2018**
The September Guest OS has released.

###### **September 12, 2018**
The August Guest OS has released.

###### **August 3, 2018**
The July Guest OS has released.

###### **July 3, 2018**
The June Guest OS has released.

###### **June 1, 2018**
The May Guest OS has released.

###### **May 4, 2018**
The April Guest OS has released.

###### **April 6, 2018**
The March Guest OS has released.

###### **March 19, 2018**
The February Guest OS has released.

###### **January 29, 2018**
The January Guest OS has been released for OS Families 2 (WA-GUEST-OS-2.70_201801-01) & 3 (WA-GUEST-OS-3.57_201801-01)

###### **January 4, 2018**
The January Guest OS has been released for OS Families 4 (WA-GUEST-OS-4.50_201801-01) & 5 (WA-GUEST-OS-5.15_201801-01) and contains important security patches.  

###### **January 4, 2018**
December Guest OS has released.

###### **December 14, 2017**
November Guest OS has released.

###### **November 8, 2017**
October Guest OS has released.



## Releases
## Family 5 releases
**Windows Server 2016**

.NET Framework Installed: 4.0, 4.5, 4.5.1, 4.5.2, 4.6, 4.6.1, 4.6.2

> [!NOTE]
> The RDP Password for OS Family 5 must be a minimum of 10 characters.
>

| Configuration String | Release date | Disable date |
| --- | --- | --- |
| WA-GUEST-OS-5.23_201809-01 |October 12, 2018 |Post 5.25 |
| WA-GUEST-OS-5.22_201808-01 |September 12, 2018 |Post 5.24 |
|~~WA-GUEST-OS-5.21_201807-02~~ |August 3, 2018 |October 12, 2018 |
|~~WA-GUEST-OS-5.20_201806-01~~ |July 3, 2018 |September 12, 2018 |
|~~WA-GUEST-OS-5.19_201805-01~~ |June 1, 2018 |August 3, 2018 |
|~~WA-GUEST-OS-5.18_201804-01~~ |May 4, 2018 |July 3, 2018 |
|~~WA-GUEST-OS-5.17_201803-01~~ |April 6, 2018 |June 1, 2018|
|~~WA-GUEST-OS-5.16_201802-01~~ |March 12, 2018 |May 4, 2018 |
|~~WA-GUEST-OS-5.15_201801-01~~ |January 4, 2018 |April 6, 2018 |
|~~WA-GUEST-OS-5.14_201712-01~~ |January 4, 2018 |March 12, 2018 |
|~~WA-GUEST-OS-5.13_201711-01~~ |December 14, 2017 |January 4, 2018|
|~~WA-GUEST-OS-5.12_201710-02~~ |November 8, 2017 |January 4, 2018 |


## Family 4 releases
**Windows Server 2012 R2**

.NET Framework Installed: 4.0, 4.5, 4.5.1, 4.5.2

| Configuration String | Release date | Disable date |
| --- | --- | --- |
| WA-GUEST-OS-4.58_201809-01 |October 12, 2018 |Post 4.60 |
| WA-GUEST-OS-4.57_201808-01 |September 12, 2018 |Post 4.59 |
|~~WA-GUEST-OS-4.56_201807-02~~ |August 3, 2018 |October 12, 2018 |
|~~WA-GUEST-OS-4.55_201806-01~~ |July 3, 2018 |September 12, 2018 |
|~~WA-GUEST-OS-4.54_201805-01~~ |June 1, 2018 |August 3, 2018 |
|~~WA-GUEST-OS-4.53_201804-01~~ |May 4, 2018 |July 3, 2018 |
|~~WA-GUEST-OS-4.52_201803-01~~ |April 6, 2018 |June 1, 2018 |
|~~WA-GUEST-OS-4.51_201802-01~~ |March 12, 2018 |May 4, 2018 |
|~~WA-GUEST-OS-4.50_201801-01~~ |January 4, 2018 |April 6, 2018 |
|~~WA-GUEST-OS-4.49_201712-01~~ |January 4, 2018 |March 12, 2018 |
|~~WA-GUEST-OS-4.48_201711-01~~ |December 14, 2017 |January 4, 2018 |
|~~WA-GUEST-OS-4.47_201710-02~~ |November 8, 2017 |January 4, 2018 |


## Family 3 releases
**Windows Server 2012**

.NET Framework Installed: 4.0, 4.5, 4.5.1, 4.5.2

| Configuration String | Release date | Disable date |
| --- | --- | --- |
| WA-GUEST-OS-3.65_201809-01 |October 12, 2018 |Post 3.67 |
| WA-GUEST-OS-3.64_201808-01 |September 12, 2018 |Post 3.66 |
|~~WA-GUEST-OS-3.63_201807-02~~ |August 3, 2018 |October 12, 2018 |
|~~WA-GUEST-OS-3.62_201806-01~~ |July 3, 2018 |September 12, 2018 |
|~~WA-GUEST-OS-3.61_201805-01~~ |June 1, 2018 |August 3, 2018 |
|~~WA-GUEST-OS-3.60_201804-01~~ |May 4, 2018 |July 3, 2018 |
|~~WA-GUEST-OS-3.59_201803-01~~ |April 6, 2018 |June 1, 2018 |
|~~WA-GUEST-OS-3.58_201802-01~~ |March 19, 2018 |May 4, 2018 |
|~~WA-GUEST-OS-3.57_201801-01~~ |January 29, 2018 |April 6, 2018 |
|~~WA-GUEST-OS-3.56_201712-01~~ |January 4, 2018 |March 19, 2018 |
|~~WA-GUEST-OS-3.55_201711-01~~ |December 14, 2017 |January 29, 2018 |
|~~WA-GUEST-OS-3.54_201710-02~~ |November 8, 2017 |January 4, 2018 |


## Family 2 releases
**Windows Server 2008 R2 SP1**

.NET Framework Installed: 3.5, 4.0, 4.5, 4.5.1, 4.5.2

| Configuration String | Release date | Disable date |
| --- | --- | --- |
| WA-GUEST-OS-2.78_201809-01 |October 12, 2018 |Post 2.80 |
| WA-GUEST-OS-2.77_201808-01 |September 12, 2018 |Post 2.79 |
|~~WA-GUEST-OS-2.76_201807-02~~ |August 3, 2018 |October 12, 2018 |
|~~WA-GUEST-OS-2.75_201806-01~~ |July 3, 2018 |September 12, 2018 |
|~~WA-GUEST-OS-2.74_201805-01~~ |June 1, 2018 |August 3, 2018|
|~~WA-GUEST-OS-2.73_201804-01~~ |May 4, 2018 |July 3, 2018 |
|~~WA-GUEST-OS-2.72_201803-01~~ |April 6, 2018 |June 1, 2018 |
|~~WA-GUEST-OS-2.71_201802-01~~ |March 12, 2018 |May 4, 2018 |
|~~WA-GUEST-OS-2.70_201801-01~~ |January 29, 2018 |April 6, 2018 |
|~~WA-GUEST-OS-2.69_201712-01~~ |January 4, 2018 |March 12, 2018 |
|~~WA-GUEST-OS-2.68_201711-01~~ |December 14, 2017 |January 29, 2018 |
|~~WA-GUEST-OS-2.67_201710-02~~ |November 8, 2017 |January 4, 2018 |
|~~WA-GUEST-OS-2.66_201709-01~~ |October 6, 2017 |December 14, 2017 |
|~~WA-GUEST-OS-2.65_201708-01~~ |August 24, 2017 |December 14, 2017 |


## MSRC patch updates
The list of patches that are included with each monthly Guest OS release is available [here][patches].

## SDK support
Even though the [retirement policy for the Azure SDK][retire policy sdk] indicates that only versions above 2.2 are supported, specific Guest OS families allow you to use earlier versions. You should always use the latest supported SDK.

| Guest OS Family | Compatible SDK Versions |
| --- | --- |
| 5 |Version 2.9.5.1+ |
| 4 |Version 2.1+ |
| 3 |Version 1.8+ |
| 2 |Version 1.3+ |
| 1 |Version 1.0+ |

## Guest OS Release Information
There are three dates that are important to Guest OS releases: **release** date, **disabled** date, and **expiration** date. A Guest OS is considered available when it is in the Portal and can be selected as the target Guest OS. When a Guest OS reaches the **disabled** date, it is removed from Azure. However, any Cloud Service targeting that Guest OS will still operate as normal.

The window between the **disabled** date and the **expiration** date provides you with a buffer to easily transition from one Guest OS to one newer. If you're using *automatic* as your Guest OS, you'll always be on the latest version and you don't have to worry about it expiring.

When the **expiration** date passes, any Cloud Service still using that Guest OS will be stopped, deleted, or forced to upgrade. You can read more about the retirement policy [here][retirepolicy].

## Guest OS Family-Version Explanation
The Guest OS families are based on released versions of Microsoft Windows Server. The Guest OS is the underlying operating system that Azure Cloud Services runs on. Each Guest OS has a family, version, and release number.

* **Guest OS family**  
  A Windows Server operating system release that a Guest OS is based on. For example, *family 3* is based on Windows Server 2012.
* **Guest OS version**  
  Specific to a Guest OS family image plus relevant [Microsoft Security Response Center (MSRC)][msrc] patches that are available at the date the new Guest OS version is produced. Not all patches may be included.

    Numbers start at 0 and increment by 1 each time a new set of updates is added. Trailing zeros are only shown if important. That is, version 2.10 is a different, much later version than version 2.1.
* **Guest OS release**  
  A rerelease of a Guest OS version. A rerelease occurs if Microsoft finds issues during testing; requiring changes. The latest release always supersedes any previous releases, public or not. The Azure portal will only allow users to pick the latest release for a given version. Deployments running on a previous release are usually not force upgraded depending on the severity of the bug.

In the example below, 2 is the family, 12 is the version and "rel2" is the release.

**Guest OS release** - 2.12 rel2

**Configuration string for this release** - WA-GUEST-OS-2.12_201208-02

The configuration string for a Guest OS has this same information embedded in it, along with a date showing which MSRC patches were considered for that release. In this example, MSRC patches produced for Windows Server 2008 R2 up to and including August 2012 were considered for inclusion. Only patches specifically applying to that version of Windows Server are included. For example, if an MSRC patch applies to Microsoft Office, it will not be included because that product is not part of the Windows Server base image.

## Guest OS System Update Process
This page includes information on upcoming Guest OS Releases. Customers have indicated that they want to know when a release occurs because their cloud service roles will reboot if they are set to "Automatic" update. Guest OS releases typically occur 2-3 weeks after the MSRC update release that occurs on the second Tuesday of every month. New releases include all the relevant MSRC patches for each Guest OS family.

Microsoft Azure is constantly releasing updates. The Guest OS is only one such update in the pipeline. A release can be affected by many factors too numerous to list here. In addition, Azure runs on literally hundreds of thousands of machines. This means that it's impossible to give an exact date and time when your role(s) will reboot. We are working on a plan to limit or time reboots.

When a new release of the Guest OS is published, it can take time to fully propagate across Azure. As services are updated to the new Guest OS, they are rebooted honoring update domains. Services set to use "Automatic" updates will get a release first. After the update, you’ll see the new Guest OS version listed for your service in the Azure portal. Rereleases may occur during this period. Some versions may be deployed over longer periods of time and automatic upgrade reboots may not occur for many weeks after the official release date. Once a Guest OS is available, you can then explicitly choose that version from the portal or in your configuration file.

For a great deal of valuable information on restarts and pointers to more information technical details of Guest and Host OS updates, see the MSDN blog post titled [Role Instance Restarts Due to OS Upgrades][restarts].

If you manually update your Guest OS, see the [Guest OS retirement policy][retirepolicy] for additional information.

## Guest OS Supportability and Retirement Policy
The Guest OS supportability and retirement policy is explained [here][retirepolicy].

[cloud updates]: https://docs.microsoft.com/azure/cloud-services/cloud-services-update-azure-service
[Guest OS Update RSS Feed]: https://raw.githubusercontent.com/MicrosoftDocs/azure-cloud-services-files/master/GuestOS/GuestOSFeed.xml
[Install .NET on a Cloud Service Role]: https://azure.microsoft.com/documentation/articles/cloud-services-dotnet-install-dotnet/?WT.mc_id=azurebg_email_Trans_963_RevisedNET_Update
[Azure Guest OS Update Settings]: cloud-services-how-to-configure-portal.md
[ssl3 announcement]: http://azure.microsoft.com/blog/2014/12/09/azure-security-ssl-3-0-update/
[Microsoft Security Advisory 3009008]: https://technet.microsoft.com/library/security/3009008.aspx
[ssl3-fixit]: http://go.microsoft.com/?linkid=9863266
[MS14-066]: https://technet.microsoft.com/library/security/ms14-066.aspx
[MS14-046]: https://technet.microsoft.com/library/security/ms14-046.aspx
[retire policy sdk]: https://msdn.microsoft.com/library/dn479282.aspx
[server and gos]: https://msdn.microsoft.com/library/dn775043.aspx
[azuresupport]: http://azure.microsoft.com/support/options/
[net install pkg]: http://www.microsoft.com/download/details.aspx?id=42643
[msrc]: https://technet.microsoft.com/security/dn440717.aspx
[update guest os portal]: https://msdn.microsoft.com/library/gg433101.aspx
[update guest os svc]: https://msdn.microsoft.com/library/gg456324.aspx
[restarts]: http://blogs.msdn.com/b/kwill/archive/2012/09/19/role-instance-restarts-due-to-os-upgrades.aspx
[patches]: cloud-services-guestos-msrc-releases.md
[retirepolicy]: cloud-services-guestos-retirement-policy.md
[fam1retire]: cloud-services-guestos-family1-retirement.md
[fix]: https://technet.microsoft.com/library/security/ms17-010.aspx

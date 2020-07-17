---
title: Learn about the latest Azure Guest OS Releases | Microsoft Docs
description: The latest release news and SDK compatibility for Azure Cloud Services Guest OS.
services: cloud-services
documentationcenter: na
author: yohaddad
editor: ''
ms.assetid: 6306cafe-1153-44c7-8554-623b03d59a34
ms.service: cloud-services
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: tbd
ms.date: 6/3/2020
ms.author: yohaddad
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

###### **June 2, 2020**
The May Guest OS has released. 

###### **May 4, 2020**
The April Guest OS has released. 

###### **April 2, 2020**
The March Guest OS has released. 

###### **March 5, 2020**
The February Guest OS has released. 

###### **January 24, 2020**
The January Guest OS has released. 

###### **January 8, 2020**
The December Guest OS has released.

###### **December 5, 2019**
The November Guest OS has released.

###### **November 1, 2019**
The October Guest OS has released.

###### **October 7, 2019**
The September Guest OS has released.

###### **September 4, 2019**
The August Guest OS has released.

###### **July 26, 2019**
The July Guest OS has released.

###### **July 8, 2019**
The June Guest OS has released.

###### **June 6, 2019**
The May Guest OS has released.

###### **May 7, 2019**
The April Guest OS has released.

###### **March 26, 2019**
The March Guest OS has released.

###### **March 12, 2019**
The February Guest OS has released.

###### **February 5, 2019**
The January Guest OS has released.

###### **January 24, 2019**
Family 6 Guest OS (Windows Server 2019) has released.

###### **January 7, 2019**
The December Guest OS has released.

###### **December 14, 2018**
The November Guest OS has released.

###### **November 8, 2018**
The October Guest OS has released.

###### **October 12, 2018**
The September Guest OS has released.

## Releases

## Family 6 releases
**Windows Server 2019**

.NET Framework installed: 3.5, 4.7.2

> [!NOTE]
> The Windows Azure SDK for .NET - 3.0 can be downloaded [here][Windows Azure SDK].
>
>Installation steps:
>1.	Please uninstall any older versions of MicrosoftAzureAuthoringTools*.msi
>2. Install the [Azure SDK for .NET - 3.0][Windows Azure SDK]
>3. Restart your machine
>4. Create a new Cloud Service project and add a single Worker Role
>5. Change the OS Family to 6 and build a package
>6. Deploy the package to Azure using the Azure portal or Visual Studio
>
>Guest OS Family 6 release enforces TLS 1.2 by explicitly disabling TLS 1.0 and 1.1 and defining a specific set of cipher suites. Learn [more].


| Configuration string | Release date | Disable date |
| --- | --- | --- |
|  WA-GUEST-OS-6.19_202005-02  |  June 2, 2020  |  Post 6.21  |  
|  WA-GUEST-OS-6.18_202004-01  |  May 4, 2020  |  Post 6.20  |  
|~~WA-GUEST-OS-6.17_202003-01~~|  April 2, 2020  |  June 2, 2020  |  
|~~WA-GUEST-OS-6.16_202002-01~~|  March 5, 2020  |  May 4, 2020  |  
|~~WA-GUEST-OS-6.15_202001-01~~|  January 24, 2020  |  April 2, 2020  |  
|~~WA-GUEST-OS-6.14_201912-01~~| January 8, 2020 | March 5, 2020 |  
|~~WA-GUEST-OS-6.13_201911-01~~| December 5, 2019 | January 24, 2020 |  
|~~WA-GUEST-OS-6.12_201910-01~~| November 1, 2019 | January 8, 2020 |  
|~~WA-GUEST-OS-6.11_201909-01~~| October 7, 2019 | December 5, 2019 |  
|~~WA-GUEST-OS-6.10_201908-01~~| August 4, 2019 | November 1, 2019  |  
|~~WA-GUEST-OS-6.9_201907-0~~|July 26, 2019 | October 7, 2019 |
|~~WA-GUEST-OS-6.8_201906-01~~|July 8, 2019 |August 4, 2019 |
|~~WA-GUEST-OS-6.7_201905-01~~ |June 6, 2019 |July 26, 2019 |
|~~WA-GUEST-OS-6.6_201904-01~~ |May 7, 2019 |July 8, 2019 |
|~~WA-GUEST-OS-6.5_201903-01~~ |March 26, 2019 |June 6, 2019 |
|~~WA-GUEST-OS-6.4_201902-01~~ |March 12, 2019 |May 7, 2019 |
|~~WA-GUEST-OS-6.3_201901-01~~ |February 5, 2019 |March 26, 2019 |
|~~WA-GUEST-OS-6.2_201812-01~~ |January 24, 2019 |March 12, 2019 |
|~~WA-GUEST-OS-6.1_201811-01~~ |January 24, 2019 |February 5, 2019 |

## Family 5 releases
**Windows Server 2016**

.NET Framework installed: 3.5, 4.6.2

> [!NOTE]
> The RDP password for OS family 5 must be a minimum of 10 characters.
>


| Configuration string | Release date | Disable date |
| --- | --- | --- |
|  WA-GUEST-OS-5.43_202005-02  |  June 2, 2020  |  Post 5.45  |  
|  WA-GUEST-OS-5.42_202004-01  |  May 4, 2020  |  Post 5.44  |  
|~~WA-GUEST-OS-5.41_202003-01~~|  April 2, 2020  |  June 2, 2020  |  
|~~WA-GUEST-OS-5.40_202002-01~~|  March 5, 2020  |  May 4, 2020  |  
|~~WA-GUEST-OS-5.39_202001-01~~|  January 24, 2020  |  April 2, 2020  |  
|~~WA-GUEST-OS-5.38_201912-01~~| January 8, 2020 | March 5, 2020 |  
|~~WA-GUEST-OS-5.37_201911-01~~| December 5, 2019 | January 24, 2020 |  
|~~WA-GUEST-OS-5.36_201910-01~~| November 1, 2019 | January 8, 2020 |  
|~~WA-GUEST-OS-5.35_201909-01~~| October 7, 2019 | December 5, 2019 |  
|~~WA-GUEST-OS-5.34_201908-01~~|  August 4, 2019  | November 1, 2019 |  
|~~WA-GUEST-OS-5.33_201907-01~~| July 26, 2019 | October 7, 2019 |  
|~~WA-GUEST-OS-5.32_201906-01~~|July 8, 2019 |August 4, 2019 |
|~~WA-GUEST-OS-5.31_201905-01~~ |June 6, 2019 |July 26, 2019 |
|~~WA-GUEST-OS-5.30_201904-01~~ |May 7, 2019 |July 8, 2019 |
|~~WA-GUEST-OS-5.29_201903-01~~ |March 26, 2019 |June 6, 2019 |
|~~WA-GUEST-OS-5.28_201902-01~~ |March 12, 2019 |May 7, 2019 |
|~~WA-GUEST-OS-5.27_201901-01~~ |February 5, 2019 |March 26, 2019 |
|~~WA-GUEST-OS-5.26_201812-01~~ |January 7, 2019 |March 12, 2019 |
|~~WA-GUEST-OS-5.25_201811-01~~ |December 14, 2018 |February 5, 2019 |
|~~WA-GUEST-OS-5.24_201810-01~~ |November 8, 2018 |January 7, 2019 |
|~~WA-GUEST-OS-5.23_201809-01~~ |October 12, 2018 |December 14, 2018 |

## Family 4 releases
**Windows Server 2012 R2**

.NET Framework installed: 3.5, 4.5.1, 4.5.2

| Configuration string | Release date | Disable date |
| --- | --- | --- |
|  WA-GUEST-OS-4.78_202005-02  |  June 2, 2020  |  Post 4.80  |  
|  WA-GUEST-OS-4.77_202004-01  |  May 4, 2020  |  Post 4.79  |  
|~~WA-GUEST-OS-4.76_202003-01~~|  April 2, 2020  |  June 2, 2020  |  
|~~WA-GUEST-OS-4.75_202002-01~~|  March 5, 2020  |  May 4, 2020  |  
|~~WA-GUEST-OS-4.74_202001-01~~|  January 24, 2020  |  April 2, 2020  |  
|~~WA-GUEST-OS-4.73_201912-01~~| January 8, 2020 | March 5, 2020 |  
|~~WA-GUEST-OS-4.72_201911-01~~| December 5, 2019 | January 24, 2020 |  
|~~WA-GUEST-OS-4.71_201910-01~~| November 1, 2019 | January 8, 2020 |  
|~~WA-GUEST-OS-4.70_201909-01~~| October 7, 2019 | December 5, 2019 |  
|~~WA-GUEST-OS-4.69_201908-01~~| August 4, 2019 | November 1, 2019 |  
|~~WA-GUEST-OS-4.68_201907-01~~| July 26, 2019  | October 7, 2019 |
|~~WA-GUEST-OS-4.67_201906-01~~| July 8, 2019 |August 4, 2019 |
|~~WA-GUEST-OS-4.66_201905-01~~ |June 6, 2019 |July 26, 2019 |
|~~WA-GUEST-OS-4.65_201904-01~~ |May 7, 2019 |July 8, 2019 |
|~~WA-GUEST-OS-4.64_201903-01~~ |March 26, 2019 |June 6, 2019 |
|~~WA-GUEST-OS-4.63_201902-01~~ |March 12, 2019 |May 7, 2019 |
|~~WA-GUEST-OS-4.62_201901-01~~ |February 5, 2019 |March 26, 2019 |
|~~WA-GUEST-OS-4.61_201812-01~~ |January 7, 2019 |March 12, 2019 |
|~~WA-GUEST-OS-4.60_201811-01~~ |December 14, 2018 |February 5, 2019 |
|~~WA-GUEST-OS-4.59_201810-01~~ |November 8, 2018 |January 7, 2019 |
|~~WA-GUEST-OS-4.58_201809-01~~ |October 12, 2018 |December 14, 2018 |

## Family 3 releases
**Windows Server 2012**

.NET Framework installed: 3.5, 4.5

| Configuration string | Release date | Disable date |
| --- | --- | --- |
|  WA-GUEST-OS-3.85_202005-02  |  June 2, 2020  |  Post 3.87  |  
|  WA-GUEST-OS-3.84_202004-01  |  May 4, 2020  |  Post 3.86  |  
|~~WA-GUEST-OS-3.83_202003-01~~|  April 2, 2020  |  June 2, 2020  |  
|~~WA-GUEST-OS-3.82_202002-01~~|  March 5, 2020  |  May 4, 2020  |  
|~~WA-GUEST-OS-3.81_202001-01~~|  January 24, 2020  |  April 2, 2020  |  
|~~WA-GUEST-OS-3.80_201912-01~~| January 8, 2020 | March 5, 2020 |  
|~~WA-GUEST-OS-3.79_201911-01~~| December 5, 2019 | January 24, 2020 |  
|~~WA-GUEST-OS-3.78_201910-01~~| November 1, 2019 | January 8, 2020 |  
|~~WA-GUEST-OS-3.77_201909-01~~| October 7, 2019 | December 5, 2019 |  
|~~WA-GUEST-OS-3.76_201908-01~~|  August 4, 2019  |  November 1, 2019  |  
|~~WA-GUEST-OS-3.75_201907-01~~| July 26, 2019 | October 7, 2019 |
|~~WA-GUEST-OS-3.74_201906-01~~| July 8, 2019 |August 4, 2019 |
|~~WA-GUEST-OS-3.73_201905-01~~ |June 6, 2019 |July 26, 2019 |
|~~WA-GUEST-OS-3.72_201904-01~~ |May 7, 2019 |July 8, 2019 |
|~~WA-GUEST-OS-3.71_201903-01~~ |March 26, 2019 |June 6, 2019 |
|~~WA-GUEST-OS-3.70_201902-01~~ |March 12, 2019 |May 7, 2019 |
|~~WA-GUEST-OS-3.69_201901-01~~ |February 5, 2019 |March 26, 2019 |
|~~WA-GUEST-OS-3.68_201812-01~~ |January 7, 2019 |March 12, 2019 |
|~~WA-GUEST-OS-3.67_201811-01~~ |December 14, 2018 |February 5, 2019 |
|~~WA-GUEST-OS-3.66_201810-01~~ |November 8, 2018 |January 7, 2019 |
|~~WA-GUEST-OS-3.65_201809-01~~ |October 12, 2018 |December 14, 2018 |

## Family 2 releases
**Windows Server 2008 R2 SP1**

.NET Framework installed: 3.5 (includes 2.0 and 3.0), 4.5

| Configuration string | Release date | Disable date |
| --- | --- | --- |
|  WA-GUEST-OS-2.98_202005-02  |  June 2, 2020  |  Post 2.100  |  
|  WA-GUEST-OS-2.97_202004-01  |  May 4, 2020  |  Post 2.99  |  
|~~WA-GUEST-OS-2.96_202003-01~~|  April 2, 2020  |  June 2, 2020  |  
|~~WA-GUEST-OS-2.95_202002-01~~|  March 5, 2020  |  May 4, 2020  |  
|~~WA-GUEST-OS-2.94_202001-01~~|  January 24, 2020  |  April 2, 2020  |  
|~~WA-GUEST-OS-2.93_201912-01~~| January 8, 2020 | March 5, 2020 |  
|~~WA-GUEST-OS-2.92_201911-01~~| December 5, 2019 | January 24, 2020 |  
|~~WA-GUEST-OS-2.91_201910-01~~| November 1, 2019 | January 8, 2020 |  
|~~WA-GUEST-OS-2.90_201909-01~~| October 7, 2019 | December 5, 2019 |  
|~~WA-GUEST-OS-2.89_201908-01~~| August 4, 2019 | November 1, 2019 |  
|~~WA-GUEST-OS-2.88_201907-01~~| July 26, 2019 | October 7, 2019 |
|~~WA-GUEST-OS-2.87_201906-01~~|July 8, 2019 | August 4, 2019 |
|~~WA-GUEST-OS-2.86_201905-01~~ |June 6, 2019 |July 26, 2019 |
|~~WA-GUEST-OS-2.85_201904-01~~ |May 7, 2019 |July 8, 2019 |
|~~WA-GUEST-OS-2.84_201903-01~~ |March 26, 2019 |June 6, 2019 |
|~~WA-GUEST-OS-2.83_201902-01~~ |March 12, 2019 |May 7, 2019 |
|~~WA-GUEST-OS-2.82_201901-01~~ |February 5, 2019 |March 26, 2019 |
|~~WA-GUEST-OS-2.81_201812-01~~ |January 7, 2019 |March 12, 2019 |
|~~WA-GUEST-OS-2.80_201811-01~~ |December 14, 2018 |February 5, 2019 |
|~~WA-GUEST-OS-2.79_201810-01~~ |November 8, 2018 |January 7, 2019 |
|~~WA-GUEST-OS-2.78_201809-01~~ |October 12, 2018 |December 14, 2018 |

## MSRC patch updates
The list of patches that are included with each monthly Guest OS release is available [here][patches].

## SDK support
Even though the [retirement policy for the Azure SDK][retire policy sdk] indicates that only versions above 2.2 are supported, specific Guest OS families allow you to use earlier versions. You should always use the latest supported SDK.

| Guest OS family | Compatible SDK versions |
| --- | --- |
| 6 |Version 2.9.6+ |
| 5 |Version 2.9.5.1+ |
| 4 |Version 2.1+ |
| 3 |Version 1.8+ |
| 2 |Version 1.3+ |
| 1 |Version 1.0+ |

## Guest OS release information
There are three dates that are important to Guest OS releases: **release** date, **disabled** date, and **expiration** date. A Guest OS is considered available when it is in the Portal and can be selected as the target Guest OS. When a Guest OS reaches the **disabled** date, it is removed from Azure. However, any Cloud Service targeting that Guest OS will still operate as normal.

The window between the **disabled** date and the **expiration** date provides you with a buffer to easily transition from one Guest OS to one newer. If you're using *automatic* as your Guest OS, you'll always be on the latest version and you don't have to worry about it expiring.

When the **expiration** date passes, any Cloud Service still using that Guest OS will be stopped, deleted, or forced to upgrade. You can read more about the retirement policy [here][retirepolicy].

## Guest OS family-version explanation
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

## Guest OS system update process
This page includes information on upcoming Guest OS Releases. Customers have indicated that they want to know when a release occurs because their cloud service roles will reboot if they are set to "Automatic" update. Guest OS releases typically occur 2-3 weeks after the MSRC update release that occurs on the second Tuesday of every month. New releases include all the relevant MSRC patches for each Guest OS family.

Microsoft Azure is constantly releasing updates. The Guest OS is only one such update in the pipeline. A release can be affected by many factors too numerous to list here. In addition, Azure runs on literally hundreds of thousands of machines. This means that it's impossible to give an exact date and time when your role(s) will reboot. We are working on a plan to limit or time reboots.

When a new release of the Guest OS is published, it can take time to fully propagate across Azure. As services are updated to the new Guest OS, they are rebooted honoring update domains. Services set to use "Automatic" updates will get a release first. After the update, you’ll see the new Guest OS version listed for your service in the Azure portal. Rereleases may occur during this period. Some versions may be deployed over longer periods of time and automatic upgrade reboots may not occur for many weeks after the official release date. Once a Guest OS is available, you can then explicitly choose that version from the portal or in your configuration file.

For a great deal of valuable information on restarts and pointers to more information technical details of Guest and Host OS updates, see the MSDN blog post titled [Role Instance Restarts Due to OS Upgrades][restarts].

If you manually update your Guest OS, see the [Guest OS retirement policy][retirepolicy] for additional information.

## Guest OS supportability and retirement policy
The Guest OS supportability and retirement policy is explained [here][retirepolicy].

[cloud updates]: https://docs.microsoft.com/azure/cloud-services/cloud-services-update-azure-service
[Guest OS Update RSS Feed]: https://raw.githubusercontent.com/MicrosoftDocs/azure-cloud-services-files/master/GuestOS/GuestOSFeed.xml
[Install .NET on a Cloud Service Role]: https://azure.microsoft.com/documentation/articles/cloud-services-dotnet-install-dotnet/?WT.mc_id=azurebg_email_Trans_963_RevisedNET_Update
[Azure Guest OS Update Settings]: cloud-services-how-to-configure-portal.md
[ssl3 announcement]: https://azure.microsoft.com/blog/2014/12/09/azure-security-ssl-3-0-update/
[Microsoft Security Advisory 3009008]: https://technet.microsoft.com/library/security/3009008.aspx
[ssl3-fixit]: https://go.microsoft.com/?linkid=9863266
[MS14-066]: https://technet.microsoft.com/library/security/ms14-066.aspx
[MS14-046]: https://technet.microsoft.com/library/security/ms14-046.aspx
[retire policy sdk]: https://msdn.microsoft.com/library/dn479282.aspx
[server and gos]: https://msdn.microsoft.com/library/dn775043.aspx
[azuresupport]: https://azure.microsoft.com/support/options/
[net install pkg]: https://www.microsoft.com/download/details.aspx?id=42643
[msrc]: https://technet.microsoft.com/security/dn440717.aspx
[update guest os portal]: https://msdn.microsoft.com/library/gg433101.aspx
[update guest os svc]: https://msdn.microsoft.com/library/gg456324.aspx
[restarts]: https://blogs.msdn.com/b/kwill/archive/2012/09/19/role-instance-restarts-due-to-os-upgrades.aspx
[patches]: cloud-services-guestos-msrc-releases.md
[retirepolicy]: cloud-services-guestos-retirement-policy.md
[fam1retire]: cloud-services-guestos-family1-retirement.md
[fix]: https://technet.microsoft.com/library/security/ms17-010.aspx
[Windows Azure SDK]: https://www.microsoft.com/en-us/download/details.aspx?id=54917
[more]: https://docs.microsoft.com/azure/cloud-services/applications-dont-support-tls-1-2  

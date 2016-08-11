<properties 
   pageTitle="Learn about the latest Azure Guest OS Releases | Microsoft Azure" 
   description="The latest release news and SDK compatibility for Azure Cloud Services Guest OS." 
   services="cloud-services" 
   documentationCenter="na" 
   authors="yuemlu" 
   manager="timlt" 
   editor=""/>

<tags
   ms.service="cloud-services"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="tbd" 
   ms.date="07/13/2016"
   ms.author="yuemlu"/>

# Azure Guest OS releases and SDK compatibility matrix
Provides you with up-to-date information about the latest Azure Guest OS releases for Cloud Services. This information will help you plan your upgrade path before a Guest OS is disabled. If you configure your roles to use *automatic* Guest OS updates as described in [Azure Guest OS Update Settings][], it is not vital that you read this page.

> [AZURE.IMPORTANT] This page applies to Cloud Services web and worker roles, which run on top of a Guest OS. It does **not apply** to IaaS Virtual Machines. 

<!-- -->

> [AZURE.TIP] Subscribe to the [Guest OS Update RSS Feed][rss] to receive the most timely notification on all Guest OS changes.

Unsure about what the Guest OS is or how the Guest OS releases work? Read [this](#how-it-works) section.

## News updates
###### **August 9 2016**
August Guest OS rollout is starting August 9 2016, and projected to be released on September 8 2016. 

###### **July 13 2016**
July Guest OS rollout is starting July 13 2016, and projected to be released on August 12 2016. 

###### **June 15 2016**
June Guest OS rollout is starting June 15 2016, and projected to be released on July 14 2016. 

###### **May 17 2016**
May Guest OS rollout is starting May 17 2016, and projected to be released on June 10 2016. 

###### **April 18 2016**
April Guest OS rollout is starting April 18 2016, and projected to be released on May 12 2016. 

###### **March 14 2016**
March Guest OS rollout is starting March 14 2016, and projected to be released on April 8 2016. 

###### **February 22 2016**
February Guest OS rollout is starting February 22 2016, and projected to be released on March 9 2016.

###### **January 18 2016**
January Guest OS rollout is starting January 18 2016, and projected to be released on February 12 2016.

###### **January 4 2016**
November 201511-02 Guest OS was released on January 4, 2016 for deployment. This OS version is not set as the default OS for automatic update, so the provisioning time of Guest OS deployment to November 201511-02 OS version would be slightly longer. 

## Releases

## Family 4 releases
**Windows Server 2012 R2**

Supports .NET 4.0, 4.5, 4.5.1, 4.5.2

>[AZURE.NOTE] Dates with a * are subject to change

| Configuration String           | Release date    | Disable date  | Expired date |
| ------------------------------ | --------------- | ------------- | ---- |
| WA-GUEST-OS-4.35_201608-01     | Sept 8 2016*    | Post 4.37     | TBD |
| WA-GUEST-OS-4.34_201607-01     | Aug 8 2016      | Post 4.36     | TBD |
| WA-GUEST-OS-4.33_201606-01     | July 13 2016    | Post 4.35     | TBD |
| WA-GUEST-OS-4.32_201605-01     | June 10 2016    | Sept 8 2016   | TBD |
| WA-GUEST-OS-4.31_201604-01     | May 2 2016      | Aug 13 2016   | TBD |
| WA-GUEST-OS-4.30_201603-01     | April 7 2016    | July 10 2016  | TBD |
| WA-GUEST-OS-4.29_201602-02     | March 12 2016   | June 2 2016   | TBD |
| WA-GUEST-OS-4.28_201601-01     | Feb 12 2016     | May 7 2016    | TBD | 
| WA-GUEST-OS-4.27_201512-01     | Jan 12 2016     | April 12 2016 | TBD |
| ~~WA-GUEST-OS-4.26_201511-02~~ | Jan 4 2016      | March 12 2016 | TBD |
| ~~WA-GUEST-OS-4.26_201511-01~~ | Dec 10 2015     | March 12 2016 | TBD |
| ~~WA-GUEST-OS-4.25_201510-01~~ | Nov 6 2015      | Feb 12 2016   | TBD |
| ~~WA-GUEST-OS-4.24_201509-01~~ | Oct 1 2015      | Jan 10 2016   | TBD |
| ~~WA-GUEST-OS-4.23_201508-02~~ | Sep 9 2015      | Dec 6 2015    | TBD |
| ~~WA-GUEST-OS-4.22_201507-02~~ | Aug 7 2015      | Nov 1 2015    | TBD |
| ~~WA-GUEST-OS-4.21_201506-01~~ | July 9 2015     | Oct 9 2015    | TBD |
| ~~WA-GUEST-OS-4.20_201505-02~~ | June 12 2015    | Sep 7 2015    | TBD |
| ~~WA-GUEST-OS-4.19_201504-01~~ | April 17 2015   | Aug 9 2015    | TBD |

## Family 3 releases

**Windows Server 2012**

Supports .NET 4.0, 4.5, 4.5.1, 4.5.2

>[AZURE.NOTE] Dates with a * are subject to change

| Configuration String           | Release date   | Disable date  | Expired date |
| ------------------------------ | -------------- | ------------- | --- |
| WA-GUEST-OS-3.42_201608-01     | Sept 8 2016*   | Post 3.44     | TBD |
| WA-GUEST-OS-3.41_201607-01     | Aug 8 2016     | Post 3.43     | TBD |
| WA-GUEST-OS-3.40_201606-01     | July 13 2016   | Post 3.42     | TBD |
| WA-GUEST-OS-3.39_201605-01     | June 10 2016   | Sept 8 2016   | TBD |
| WA-GUEST-OS-3.38_201604-01     | May 2 2016     | Aug 13 2016   | TBD |
| WA-GUEST-OS-3.37_201603-01     | April 7 2016   | July 10 2016  | TBD |
| WA-GUEST-OS-3.36_201602-02     | March 12 2016  | June 2 2016   | TBD |
| WA-GUEST-OS-3.35_201601-01     | Feb 12 2016    | May 7 2016    | TBD |
| WA-GUEST-OS-3.34_201512-01     | Jan 12 2016    | April 12 2016 | TBD |
| ~~WA-GUEST-OS-3.33_201511-02~~ | Jan 4 2016     | March 12 2016 | TBD |
| ~~WA-GUEST-OS-3.33_201511-01~~ | Dec 10 2015    | March 12 2016 | TBD |
| ~~WA-GUEST-OS-3.32_201510-01~~ | Nov 6 2015     | Feb 12 2016   | TBD |
| ~~WA-GUEST-OS-3.31_201509-01~~ | Oct 1 2015     | Jan 10 2016   | TBD |
| ~~WA-GUEST-OS-3.30_201508-02~~ | Sep 9 2015     | Dec 6 2015    | TBD |
| ~~WA-GUEST-OS-3.29_201507-02~~ | Aug 7 2015     | Nov 1 2015    | TBD |
| ~~WA-GUEST-OS-3.28_201506-01~~ | July 9 2015    | Oct 9 2015    | TBD |
| ~~WA-GUEST-OS-3.27_201505-02~~ | June 12 2015   | Sep 7 2015    | TBD |
| ~~WA-GUEST-OS-3.26_201504-01~~ | April 17 2015  | Aug 9 2015    | TBD |


## Family 2 releases

**Windows Server 2008 R2 SP1**

Supports .NET 3.5, 4.0, 4.5, 4.5.1, 4.5.2

>[AZURE.NOTE] Dates with a * are subject to change

| Configuration String           | Release date  | Disable date  | Expired date |
| ------------------------------ | ------------- | ------------  | --- |
| WA-GUEST-OS-2.54_201608-01     | Sept 8 2016*  | Post 2.56     | TBD |
| WA-GUEST-OS-2.53_201607-01     | Aug 8 2016    | Post 2.55     | TBD |
| WA-GUEST-OS-2.52_201606-01     | July 13 2016  | Post 2.54     | TBD |
| WA-GUEST-OS-2.51_201605-01     | June 10 2016  | Sept 8 2016   | TBD |
| WA-GUEST-OS-2.50_201604-01     | May 2 2016    | Aug 13 2016   | TBD |
| WA-GUEST-OS-2.49_201603-01     | April 7 2016  | July 10 2016  | TBD |
| WA-GUEST-OS-2.48_201602-02     | March 12 2016 | June 2 2016   | TBD |
| WA-GUEST-OS-2.47_201601-01     | Feb 12 2016   | May 7 2016    | TBD |
| WA-GUEST-OS-2.46_201512-01     | Jan 12 2016   | April 12 2016 | TBD |
| ~~WA-GUEST-OS-2.45_201511-02~~ | Jan 4 2016    | March 12 2016 | TBD |
| ~~WA-GUEST-OS-2.45_201511-01~~ | Dec 10 2015   | March 12 2016 | TBD |
| ~~WA-GUEST-OS-2.44_201510-01~~ | Nov 6 2015    | Feb 12 2016   | TBD |
| ~~WA-GUEST-OS-2.43_201509-01~~ | Oct 1 2015    | Jan 10 2016   | TBD |
| ~~WA-GUEST-OS-2.42_201508-02~~ | Sep 9 2015    | Dec 6 2015    | TBD |
| ~~WA-GUEST-OS-2.41_201507-02~~ | Aug 7 2015    | Nov 1 2015    | TBD |
| ~~WA-GUEST-OS-2.40_201506-01~~ | July 9 2015   | Oct 9 2015    | TBD |
| ~~WA-GUEST-OS-2.39_201505-02~~ | June 12 2015  | Sep 7 2015    | TBD |
| ~~WA-GUEST-OS-2.38_201504-01~~ | April 17 2015 | Aug 9 2015    | TBD |

## MSRC patch updates
The list of patches that are included with each monthly Guest OS release is available [here][patches].

## SDK support

Even though the [retirement policy for the Azure SDK][retire policy sdk] indicates that only versions above 2.2 are supported, specific Guest OS families allow you to use earlier versions. You should always use the latest supported SDK. 

| Guest OS Family | Compatible SDK Versions |
| --------------- | ----------------------- |
| 4               | Version 2.1+ |
| 3               | Version 1.8+ |
| 2               | Version 1.3+ |
| 1               | Version 1.0+ |

## Guest OS Release Information
There are three dates that are important to Guest OS releases: **release** date, **disabled** date, and **expiration** date. A Guest OS is considered available when it is in the Portal and can be selected as the target Guest OS. When a Guest OS hits the **disabled** date it is removed from Azure. However, any Cloud Service targetting that Guest OS will still operate as normal. 

The window between the **disabled** date and the **expiration** date provide you with a buffer to easily transition from one Guest OS to one newer. If you're using *automatic* as your Guest OS, you'll always be on the latest version and you don't have to worry about it expiring. 

When the **expiration** date passes and any Cloud Service still using that Guest OS will be stopped, deleted, or forced to upgrade. You can read more about the retirement policy [here][retirepolicy].

## Guest OS Family-Version Explanation
The Guest OS families are based on released versions of Microsoft Windows Server. The Guest OS is the underlying operating system that Azure Cloud Services run on. Each Guest OS has a family, version and release number. 

- **Guest OS family**  
A Windows Server operating system release that a Guest OS is based on. For example, *family 3* is based on Windows Server 2012.

- **Guest OS version**  
Specific to a Guest OS family image plus relevant [Microsoft Security Response Center (MSRC)][msrc] patches that are available at the date the new Guest OS version is produced. Not all patches may be included. 

    Numbers start at 0 and increment by 1 each time a new set of updates is added. Trailing zeros are only shown if important. That is, version 2.10 is a different, much later version than version 2.1.

- **Guest OS release**  
A rerelease of a Guest OS version. A rerelease occurs if Microsoft finds issues during testing; requiring changes. The latest release always supersedes any previous releases, public or not. The Azure classic portal will only allow users to pick the latest release for a given version. Deployments running on a previous release are usually not force upgraded depending on the severity of the bug. 

In the example below, 2 is the family, 12 is the version and "rel2" is the release.

**Guest OS release** - 2.12 rel2

**Configuration string for this release** - WA-GUEST-OS-2.12_201208-02

The configuration string for a Guest OS has this same information embedded in it, along with a date showing which MSRC patches were considered for that release. In this example, MSRC patches produced for Windows Server 2008 R2 up to and including August 2012 were considered for inclusion. Only patches specifically applying to that version of Windows Server are included. For example, if an MSRC patch applies to Microsoft Office, it will not be included because that product is not part of the Windows Server base image. 

## Guest OS System Update Process
This page includes information on upcoming Guest OS Releases. Customers have indicated that they want to know when a release occurs because their cloud service roles will reboot if they are set to "Automatic" update. Guest OS releases typically occur at least 5 days after the MSRC update release that occurs on the second Tuesday of every month. New releases include all the relevant MSRC patches for each Guest OS family. 

Microsoft Azure is constantly releasing updates. The Guest OS is only one such update in the pipeline. A release can be affected by a number of factors too numerous to list here. In addition, Azure runs on literally hundreds of thousands of machines. This means that it's impossible to give an exact date and time when your role(s) will reboot. We will update the [Guest OS Update RSS Feed][rss] with the latest information we have, but consider that time an approximate window. We are aware that this is problematic for customers and working on a plan to limit or time reboots. 

When a new release of the Guest OS is published, it can take time to fully propagate across Azure. As services are updated to the new Guest OS, they are rebooted honoring update domains. Services set to use "Automatic" updates will get a release first. After the update, you’ll see the new Guest OS version listed for your service in the Azure classic portal. Rereleases may occur during this period. Some versions may be deployed over longer periods of time and automatic upgrade reboots may not occur for many weeks after the official release date. Once a Guest OS is available, you can then explicitly choose that version from the portal or in your configuration file. 

For a great deal of valuable information on restarts and pointers to more information technical details of Guest and Host OS updates, see the MSDN blog post titled [Role Instance Restarts Due to OS Upgrades][restarts].

If you manually update your Guest OS, please read the [Guest OS retirement policy][retirepolicy].


## Guest OS Supportability and Retirement Policy
The Guest OS supportability and retirement policy is explained [here][retirepolicy].

[Install .NET on a Cloud Service Role]: https://azure.microsoft.com/en-us/documentation/articles/cloud-services-dotnet-install-dotnet/?WT.mc_id=azurebg_email_Trans_963_RevisedNET_Update
[Azure Guest OS Update Settings]: cloud-services-how-to-configure.md
[rss]: http://sxp.microsoft.com/feeds/3.0/msdntn/WindowsAzureOSUpdates
[ssl3 announcement]: http://azure.microsoft.com/blog/2014/12/09/azure-security-ssl-3-0-update/
[Microsoft Security Advisory 3009008]: https://technet.microsoft.com/library/security/3009008.aspx
[ssl3-fixit]: http://go.microsoft.com/?linkid=9863266
[MS14-066]: https://technet.microsoft.com/library/security/ms14-066.aspx
[MS14-046]: https://technet.microsoft.com/library/security/ms14-046.aspx
[retire policy sdk]: https://msdn.microsoft.com/library/dn479282.aspx
[server and gos]: https://msdn.microsoft.com/library/dn775043.aspx
[azuresupport]: http://azure.microsoft.com/support/options/
[net install pkg]: http://www.microsoft.com/download/details.aspx?id=42643
[msrc]: http://www.microsoft.com/security/msrc/default.aspx
[update guest os portal]: https://msdn.microsoft.com/library/gg433101.aspx
[update guest os svc]: https://msdn.microsoft.com/library/gg456324.aspx
[restarts]: http://blogs.msdn.com/b/kwill/archive/2012/09/19/role-instance-restarts-due-to-os-upgrades.aspx
[patches]: cloud-services-guestos-msrc-releases.md
[retirepolicy]: cloud-services-guestos-retirement-policy.md
[fam1retire]: cloud-services-guestos-family1-retirement.md
 

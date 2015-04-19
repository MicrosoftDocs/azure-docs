<properties 
   pageTitle="Learn about the latest Azure Guest OS Releases | Azure" 
   description="The latest release news and SDK compatibility for Azure Cloud Services Guest OS." 
   services="cloud-services" 
   documentationCenter="na" 
   authors="Thraka" 
   manager="timlt" 
   editor=""/>

<tags
   ms.service="cloud-services"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="tbd" 
   ms.date="04/17/2015"
   ms.author="adegeo"/>

# Azure Guest OS Releases and SDK Compatibility Matrix
Provides you with up-to-date information about the latest Azure Guest OS releases for Cloud Services. This information will help you plan your upgrade path before a a Guest OS is disabled.

> [AZURE.IMPORTANT] This page applies to Cloud Services web and worker roles, which run on top of a Guest OS. It does not apply to IaaS Virtual Machines. If you configure your roles to use automatic Guest OS updates as described in [Azure Guest OS Update Settings][], it is not vital that you read this page.

<!-- -->
<br />

> [AZURE.TIP] Subscribe to the [Guest OS Update RSS Feed][rss] to receive the most timely notification on all Guest OS changes. Changes mentioned on that feed will be integrated into this page approximately every week.


## News Updates

###### **April 17 2015**
Guest OS versions 4.19, 3.26, 2.38 were released today.

This release contains [MS15-034](https://technet.microsoft.com/library/security/MS15-034), a **critical** patch for Windows HTTP Servers.

Guest OS versions 4.17, 3.24, 2.36 will be disabled on May 17 2015.

###### **April 6 2015**
Guest OS versions 4.18, 3.25, 2.37 were released on April 2 2015.

Guest OS versions 4.16, 3.23, 2.35 will be disabled on May 2 2015.


###### **March 11 2015**
Guest OS versions 4.17, 3.24, and 2.36 were released on March 9 2015. 

Guest OS versions 4.15, 3.22, and 2.34 have had their disable date set to April 9 2015.


###### **Jan 29 2015**
Guest OS versions 4.14, 4.13, 3.21, 3.20, 2.33, 2.32 (released in November) have had their Disable Date pushed back. The Guest OS release matrix below has been updated.


###### **Jan 13 2015, Updated Jan 15 2015**
The December Guest OS was released on Jan 14 2015.


###### **Jan 13 2015**
The January Guest OS deployment is projected to start on or after Jan 19 2015 updating cloud services running on automatic update. The January Guest OS will be released for deployment sometime in February. It will disable SSL v3.0 by default as suggested in the January security update. This article will be updated when more information is available.

As [previously announced][ssl3 announcement], the January Security update to the PaaS Guest OS will disable SSL v3.0 support by default as recommended by [Microsoft Security Advisory 3009008][]. This change will come in addition to all other monthly security updates. PaaS customers with automatic Updates enabled can validate whether there is an application compatibility impact when SSL v3.0 is disabled by running this [Fix it script][ssl3-fixit] which will proactively disable SSL v3.0 support.

###### **Dec 16, 2014. Updated Jan 7 2015**
The December Guest OS release is projected to start on or after Jan 9 2015.


###### **Nov 11, 2014**

The November release (4.14, 3.21, and 2.33) was rolled out November 11th. This update was pushed earlier because it includes the MSRC update [Microsoft Security Bulletin MS14-066 - Critical][MS14-066]. Your web and worker roles on automatic update should reboot once over the next few days and receive this fix. 

###### **Nov 10, 2014**
The October release (4.13, 3.20, and 2.32) disable date has been updated based on customer feedback. The disable date will always be at least two months from the release date. 

###### **Nov 4, 2014**
The October release (4.13, 3.20, and 2.32) was rolled out Nov 4, 2014. It includes the MSRC patch which caused problems with the August and September releases. To get around this problem, the October release includes .NET 3.5 and 3.5.1 preinstalled, but disabled. Scripts attempting to install .NET 3.5 or 3.5.1 will effectively re-enable it and return a "success" for the .NET installation, but also avoid the full install problem created by the MSRC patch. 



## Guest OS Release Information

This section lists the currently supported Guest OS versions. Guest OS families and versions have a release date, a disabled date, and an expiration date. As of the release date, a Guest OS version can be manually selected in the management portal. A Guest OS is removed from the management portal on or after its "disabled" date. It is then "in transition" but is supported with limited ability to update a deployment. The expiration date is when a version or family is scheduled to be removed from the Azure system completely. Cloud services still running on a version when it expires will be stopped, deleted, or force upgraded to a newer version, as detailed in the [Azure Guest OS Supportability and Retirement Policy][retirepolicy]. 

Microsoft supports at least two recent versions of each supported Guest OS family. The disable date of an existing Guest OS version could move to a later date to ensure at least two released versions remain enabled for deployment.

> [AZURE.WARNING] The retirement of Guest OS family 1 began June 1, 2013 and is scheduled to complete soon. Do not create new installations and upgrade older ones using this Guest OS family. For more information see [Azure Guest OS Family 1 Retirement Information][fam1retire]

The Guest OS includes configuration different from the defaults of Windows Server. For more information see [Differences between Azure Guest OS and Default Windows Server][server and gos].

### Guest OS Family, Version, and Release Explanation
The Guest OS families are based on released versions of Microsoft Windows Server. The Guest OS is the underlying operating system that Azure Cloud Services run on. Each Guest OS has a family, version and release number. 

The **Guest OS family** corresponds to a Windows Server operating system release that a Guest OS is based on. For example, family 3 is based on Windows Server 2012. 

A **"Guest OS version"** is the family OS image plus relevant [Microsoft Security Response Center (MSRC)][msrc] patches available at the date the new Guest OS version is produced. Not all patches may be included. Numbers start at 0 and increment by 1 each time a new set of updates is added. Trailing zeros are only shown if important. That is, version 2.10 is a different, much later version than version 2.1. 

A **"Guest OS release"** refers to a rerelease of a Guest OS version. A rerelease occurs if Microsoft finds issues during testing requiring changes. The latest release always supersedes any previous releases, public or not. The management portal will only allow users to pick the latest release for a given version. Deployments running on a previous release are usually not force upgraded depending on the severity of the bug. 

In the example below, 2 is the family, 12 is the version and "rel2" is the release.

**Guest OS release** - 2.12 rel2

**Configuration string for this release** - WA-GUEST-OS-2.12_201208-02

The configuration string for a Guest OS has this same information embedded in it, along with a date showing which MSRC patches were considered for that release. In this example, MSRC patches produced for Windows Server 2008 R2 up to and including August 2012 were considered for inclusion. Only patches specifically applying to that version of Windows Server are included. For example, if an MSRC patch applies to Microsoft Office, it will not be included because that product is not part of the Windows Server base image. 

## Releases

## Family 4 Releases
**Windows Server 2012 R2**

Supports .NET 4.0, 4.5, 4.5.1, 4.5.2 (Note 2)

| Guest OS Version | Configuration String       | Release Date           | Disable Date | Expiration Date |
| ---------------- | -------------------------- | ---------------------- | ------------ | --- |
| 4.19             | WA-GUEST-OS-4.19_201504-01 | April 17 2015          | Will be updated when 4.21 is released | TBD |
| 4.18             | WA-GUEST-OS-4.18_201503-01 | April 2 2015           | Will be updated when 4.20 is released | TBD |
| 4.17             | WA-GUEST-OS-4.17_201502-01 | Mar 9 2015             | May 17 2015 | TBD |
| 4.16             | WA-GUEST-OS-4.16_201501-01 | Jan 29 2015            | May 2 2015 | TBD |
| 4.15             | WA-GUEST-OS-4.15_201412-01 | Jan 14 2015            | Apr 9 2015 | TBD |
| 4.14             | WA-GUEST-OS-4.14_201411-01 | Nov 11 2014            | Feb 28 2015  | TBD |
| 4.13             | WA-GUEST-OS-4.13_201410-01 | Nov 3 2014             | Feb 14 2015  | TBD |
| 4.12 (Note 1)    | WA-GUEST-OS-4.12_201409-02 | Oct 6 2014             | Oct 12 2014  | March 23 2015 |
| 4.11 (Note 1)    | WA-GUEST-OS-4.11_201408-02 | Aug 25 2014            | Sept 11 2014 | March 23 2015 |
| 4.10             | WA-GUEST-OS-4.10_201407-01 | July 18 2014           | Dec 1 2014   | March 23 2015 |
| 4.9              | WA-GUEST-OS-4.9_201406-01  | June 16 2014           | Nov 10 2014  | March 23 2015 |
| 4.8              | WA-GUEST-OS-4.8_201405-01  | June 1 2014            | Aug 1 2014   | March 23 2015 |

## Family 3 Releases

**Windows Server 2012**

Supports .NET 4.0, 4.5

| Guest OS Version | Configuration String       | Release Date           | Disable Date | Expiration Date |
| ---------------- | -------------------------- | ---------------------- | ------------ | --- |
| 3.26             | WA-GUEST-OS-3.26_201504-01 | April 17 2015           | Will be updated when 3.28 is released | TBD |
| 3.25             | WA-GUEST-OS-3.25_201503-01 | April 2 2015           | Will be updated when 3.27 is released | TBD |
| 3.24             | WA-GUEST-OS-3.24_201502-01 | Mar 9 2015             | May 17 2015 | TBD |
| 3.23             | WA-GUEST-OS-3.23_201501-01 | Jan 29 2015            | May 2 2015 | TBD |
| 3.22             | WA-GUEST-OS-3.22_201412-01 | Jan 14 2015            | Apr 9 2015 | TBD |
| 3.21             | WA-GUEST-OS-3.21_201411-01 | Nov 11 2014            | Feb 28 2015  | TBD |
| 3.20             | WA-GUEST-OS-3.20_201410-01 | Nov 3 2014             | Feb 14 2015  | TBD |
| 3.19 (Note 1)    | WA-GUEST-OS-3.19_201409-02 | Oct 6 2014             | Oct 12 2014  | March 23 2015 |
| 3.18 (Note 1)    | WA-GUEST-OS-3.18_201408-02 | Aug 25 2014            | Sept 11 2014 | March 23 2015 |
| 3.17             | WA-GUEST-OS-3.17_201407-01 | July 18 2014           | Dec 1 2014   | March 23 2015 |
| 3.16             | WA-GUEST-OS-3.16_201406-01 | June 16 2014           | Nov 10 2014  | March 23 2015 |
| 3.15             | WA-GUEST-OS-3.15_201405-01 | June 1 2014            | Aug 1 2014   | March 23 2015 |


## Family 2 Releases

**Windows Server 2008 R2 SP1**

Supports .NET 3.5, 4.0

| Guest OS Version | Configuration String       | Release Date           | Disable Date | Expiration Date |
| ---------------- | -------------------------- | ---------------------- | ------------ | --- |
| 2.38             | WA-GUEST-OS-2.38_201504-01 | April 17 2015          | Will be updated when 2.40 is released | TBD |
| 2.37             | WA-GUEST-OS-2.37_201503-01 | April 2 2015           | Will be updated when 2.39 is released | TBD |
| 2.36             | WA-GUEST-OS-2.36_201502-01 | Mar 9 2015             | May 17 2015 | TBD |
| 2.35             | WA-GUEST-OS-2.35_201501-01 | Jan 29 2015            | May 2 2015 | TBD |
| 2.34             | WA-GUEST-OS-2.34_201412-01 | Jan 14 2015            | Apr 9 2015 | TBD |
| 2.33             | WA-GUEST-OS-2.33_201411-01 | Nov 11 2014            | Feb 28 2015  | TBD |
| 2.32             | WA-GUEST-OS-2.32_201410-01 | Nov 3 2014             | Feb 14 2015  | TBD |
| 2.31 (Note 1)    | WA-GUEST-OS-2.31_201409-02 | Oct 6 2014             | Oct 12 2014  | March 23 2015 |
| 2.30 (Note 1)    | WA-GUEST-OS-2.30_201408-02 | Aug 25 2014            | Sept 11 2014 | March 23 2015 |
| 2.29             | WA-GUEST-OS-2.29_201407-01 | July 18 2014           | Dec 1 2014   | March 23 2015 |
| 2.28             | WA-GUEST-OS-2.28_201406-01 | June 16 2014           | Nov 10 2014  | March 23 2015 |
| 2.27             | WA-GUEST-OS-2.27_201405-01 | June 1 2014            | Aug 1 2014   | March 23 2015 |




### Family 1 Releases
**FAMILY 1** has been [retired][fam1retire].

#### Note 1
The August and September 2014 releases were partially rolled out due to issues found with an [MSRC patch][MS14-046] partway through release. The problem does not allow the manual install of .NET 3.5.1 on family 3 and 4. The release was disabled as a precaution so customers could not manually select it. 

#### Note 2
As of Sept 19, 2014, .NET 4.5.2 has not been specifically tested on the Azure Guest OS. But the Guest OS is essentially equivalent to Windows Server. The same compatibility rules that apply to the Windows Server product therefore apply to the equivalent Guest OS Families. If you encounter an exception to this policy, please contact [Azure support][azuresupport]. Microsoft will give a commercially reasonable effort to resolve your issue. [Manual install package for .NET 4.5.2][net install pkg].

### MSRC Updates Included in Guest OS
The list of patches that are included with each monthly Guest OS release is available [here][patches].

## SDK Support

This table shows which Guest OS family is compatible with which Azure SDK versions. For more information beyond this table, see [Support and Retirement Information for the Azure SDK for .NET and APIs][retire policy sdk]. Any information at this list supersedes the information below.

> [AZURE.IMPORTANT] To ensure that your service works as expected, you must deploy it to Guest OS release that is compatible with the version of the Azure SDK used to develop your service. If you do not, the deployed service may exhibit errors in the cloud that were not apparent in the development environment.

| Guest OS Family | SDK Versions Supported |
| --------------- | ---------------------- |
| 4               | Version 2.1 and later  |
| 3               | Version 1.8 and later  |
| 2               | Version 1.3 and later  |
| 1               | Version 1.0 and later  |


## Guest OS System Update Process
This page includes information on upcoming Guest OS Releases. Customers have indicated that they want to know when a release occurs because their cloud service roles will reboot if they are set to "Automatic" update. Guest OS releases typically occur at least 5 days after the MSRC update release that occurs on the second Tuesday of every month. New releases include all the relevant MSRC patches for each Guest OS family. 

Microsoft Azure is constantly releasing updates. The Guest OS is only one such update in the pipeline. A release can be affected by a number of factors too numerous to list here. In addition, Azure runs on literally hundreds of thousands of machines. This means that it's impossible to give an exact date and time when your role(s) will reboot. We will update the [Guest OS Update RSS Feed][rss] with the latest information we have, but consider that time an approximate window. We are aware that this is problematic for customers and working on a plan to limit or time reboots. 

When a new release of the Guest OS is published, it can take time to fully propagate across Azure. As services are updated to the new Guest OS, they are rebooted honoring update domains. Services set to use "Automatic" updates will get a release first. After the update, you’ll see the new Guest OS version listed for your service in the Azure Management Portal. Rereleases may occur during this period. Some versions may be deployed over longer periods of time and automatic upgrade reboots may not occur for many weeks after the official release date. Once a Guest OS is available, you can then explicitly choose that version from the portal or in your configuration file. For more information, see [Update the Azure Guest OS from the Management Portal][update guest os portal] and [Update the Azure Guest OS by Modifying the Service Configuration File][update guest os svc].

For a great deal of valuable information on restarts and pointers to more information technical details of Guest and Host OS updates, see the MSDN blog post titled [Role Instance Restarts Due to OS Upgrades][restarts].

If you manually update your Guest OS, please read the [Guest OS retirement policy][retirepolicy].


## Guest OS Supportability and Retirement Policy
The Guest OS supportability and retirement policy is explained [here][retirepolicy].
 
## News Archive

**Oct 20, 2014. Updated Nov 4, 2014** - The September release (4.12, 3.19, 2.31, and 1.39) partially rolled out due to the same [MSRC patch MS14-046][MS14-046] causing failures for those attempting to install .NET 3.5 or 3.5.1 on family 3 or 4. .NET 3.5.x is NOT officially supported on either family, but Microsoft is responding to the change in behavior because some customer's installations do rely on it and the change was unannounced. The disable dates of previous Guest OSes (June and July) will be delayed accordingly so that at least two fully released Guest OSes are supported and available. A solution for the .NET install problem appeared in the October 2014 release.

The October release includes .NET 3.5 and 3.5.1 preinstalled (but disabled), and also include the MSRC patch listed previously. Scripts attempting to install .NET 3.5 or 3.5.1 will effectively re-enable it and return a "success" for the .NET installation, but also avoid the install problem created by the MSRC patch. 

Because of the partial rollout of the last two releases, people on auto update or who have rolled out new installations may be on any of these Guest OS releases. The following table lists which Guest OS releases allow the installation of .NET 3.5 or 3.5.1 on family 3 and 4. Currently, if a release allows installation, that means it does NOT have MSRC patch MS14-046 installed. 

| OS Version | Can install .NET 3.5 | Includes MSRC patch [MS14-046][] |
| --- | --- | --- |
| All later Guest OS versions | Yes | Yes |
| WA-GUEST-OS-4.13_201410-01  | Yes | Yes |
| WA-GUEST-OS-4.12_201409-02  | No  | Yes |
| WA-GUEST-OS-4.12_201409-01  | No  | Yes |
| WA-GUEST-OS-4.11_201408-02  | Yes | No  |
| WA-GUEST-OS-4.11_201408-01  | No  | Yes |
| WA-GUEST-OS-4.10_201407-01  | Yes | No  |

**Oct 20, 2014** - Because August and September release were only partially rolled out, you should note the following: 

1. The cipher changes outlined in Differences between Azure Guest OS and Default Windows Server have not been rolled out across the entirety of Azure. Customers not on the August or September releases will receive these changes in the October release. 

2. The August and September Guest OSes have been disabled in the Management Portal. You cannot manually choose them. This is to protect against issues that could arise if you select this Guest OS version. 

3. The disabled dates of some earlier releases have been adjusted forward. This is to ensure continued availability in the portal and support for at least two released Guest OS versions in each family. 

## Release Archive

### Family 4

| Guest OS Version | Configuration String       | Release Date | Disable Date | Expiration Date |
| ---------------- | -------------------------- | ------------ | ------------ | --- |
| 4.7 | WA-GUEST-OS-4.7_201404-01 | May 2 2014 | July 2 2014 | Aug 18 2014 |
| 4.6 | WA-GUEST-OS-4.6_201403-01 | Mar 28 2014  | June 9 2014 | Aug 18 2014 |
| 4.5 | WA-GUEST-OS-4.5_201402-01 | Mar 21 2014 | May 21 2014 | Aug 18 2014 |
| 4.4 | WA-GUEST-OS-4.4_201401-01 | Feb 8 2014 | April 8, 2014 | May 14 2014 |
| 4.3 | WA-GUEST-OS-4.3_201312-01 | Jan 6 2014  | March 6, 2014 | May 14 2014 |
| 4.2 | WA-GUEST-OS-4.2_201311-01 | Dec 12 2013  | Feb 12 2014 | May 14 2014 |
| 4.1 | WA-GUEST-OS-4.1_201310-01 | Oct 29 2013 | N/A | May 14 2014 |
| 4.0 rel3 | WA-GUEST-OS-4.0_201309-03 | Oct 9 2013. Made public Oct 18. | N/A | May 14 2014 |
 


### Family 3

| Guest OS Version | Configuration String       | Release Date | Disable Date | Expiration Date |
| ---------------- | -------------------------- | ------------ | ------------ | --- |
| 3.14 | WA-GUEST-OS-3.14_201404-01 | May 2 2014 | July 2 2014 | Aug 18 2014 |
| 3.13 | WA-GUEST-OS-3.13_201403-01 | Mar 28 2014  | June 9 2014 | Aug 18 2014 |
| 3.12 | WA-GUEST-OS-3.12_201402-01 | Mar 21 2014 | May 21 2014 | Aug 18 2014 |
| 3.11 | WA-GUEST-OS-3.11_201401-01 | Feb 8 2014 | April 8, 2014 | May 14 2014 |
| 3.10 | WA-GUEST-OS-3.10_201312-01 | Jan 6 2014  | March 6, 2014 | May 14 2014 |
| 3.9 | WA-GUEST-OS-3.9_201311-01 | Dec 12 2013 | Feb 12 2014 | May 14 2014 |
| 3.8 | WA-GUEST-OS-3.8_201310-01 | Oct 29 2013 | N/A | May 14 2014 |
| 3.7 rel3 | WA-GUEST-OS-3.7_201309-03 | Oct 9 2013 | N/A | May 14 2014 |
| 3.7 rel1 | WA-GUEST-OS-3.7_201309-01 | Sept 23 2013 | N/A | May 14 2014 |

### Family 2

| Guest OS Version | Configuration String       | Release Date | Disable Date | Expiration Date |
| ---------------- | -------------------------- | ------------ | ------------ | --- |
| 2.26 | WA-GUEST-OS-2.26_201404-01 | May 2 2014 | July 2 2014 | Aug 18 2014 |
| 2.25 | WA-GUEST-OS-2.25_201403-01 | Mar 28 2014  | June 9 2014 | Aug 18 2014 |
| 2.24 | WA-GUEST-OS-2.24_201402-01 | Mar 21 2014 | May 21 2014 | Aug 18 2014 |
| 2.23 | WA-GUEST-OS-2.23_201401-01 | Feb 8 2014 | April 8, 2014 | May 14 2014 |
| 2.22 | WA-GUEST-OS-2.22_201312-01 | Jan 6 2014  | March 6, 2014 | May 14 2014 |
| 2.21 | WA-GUEST-OS-2.21_201311-01 | Dec 12, 2013 | Feb 12 2014 | May 14 2014 |
| 2.20 | WA-GUEST-OS-2.20_201310-01 | Oct 29 2013 | N/A | May 14 2014 |
| 2.19 rel3 | WA-GUEST-OS-2.19_201309-03 | Oct 9 2013 | N/A | May 14 2014 |
| 2.19 rel1 | WA-GUEST-OS-2.19_201309-01 | Sept 23 2013 | N/A | May 14 2014 |


[Azure Guest OS Update Settings]: https://msdn.microsoft.com/library/azure/ff729420.aspx
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

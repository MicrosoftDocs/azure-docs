---
title: Get started using Cloud App Discovery in Azure Active Directory | Microsoft Docs
description: Provides information about finding and managing applications with Cloud App Discovery, what are the benefits and how it works.
services: active-directory
keywords: cloud app discovery, managing applications
documentationcenter: ''
author: curtand
manager: femila

ms.assetid: db968bf5-22ae-489f-9c3e-14df6e1fef0a
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 09/22/2017
ms.author: curtand
ms.reviewer: nigu

---

# Get started using Cloud App Discovery in Azure AD

The public preview version of Cloud App Discovery enhancements in Azure AD is now available with an Azure Active Directory Premium P1 license. These enhancements are based on integration with Microsoft Cloud App Security. Cloud App Discovery compares your traffic logs to the Cloud App Security catalog of over 15,000 cloud apps to provide you with ongoing information on cloud use and shadow IT. 

## Prerequisites
Your organization must have an Azure AD Premium P1 license to use the product. For more information, see [Azure Active Directory pricing](https://azure.microsoft.com/pricing/details/active-directory/).

To set up Cloud App Discovery, you must be a Global Administrator or a Security Reader in Azure Active Directory. A user who is assigned an admin role has the same permissions across all of the cloud apps to which your organization has subscribed.

## Snapshot and continuous reports

There are two types of reports you can generate:

-   **Snapshot reports** provide ad-hoc visibility into a set of traffic logs you manually upload from your firewalls and proxies. Use them to make sure your logs provide usable infomation to Cloud App Discovery.

-   **Continuous reports** analyze all logs that are forwarded from your network using the Cloud App Security log collector. They provide improved visibility over all data, and automatically identify anomalous use using either the machine learning anomaly detection engine or by using custom policies that you define.

## Log process flow

It can take anywhere from a few minutes to several hours to generate reports depending on the amount of data. 

* **Upload**
  Web traffic logs from your network are uploaded to the portal.
* **Parse**
  Cloud App Security parses and extracts traffic data from the traffic logs with a dedicated parser for each data source.
* **Analyze** 
  Traffic data is analyzed against the Cloud App Security Catalog, which can identify more than 15,000 cloud apps. Active users and IP addresses are also identified as part of the analysis.
* **Generate report**
A report of the data extracted from log files is generated.

> [!NOTE]
> * Continuous report data is analyzed twice a day.
> * The log collector compresses data before it is uploaded. The outbound traffic on the log collector is 10% of the size of the traffic logs it receives.

## Using traffic logs for Cloud App Discovery

Cloud App Discovery uses the data in your traffic logs. The more detail you can add in your
log, the better visibility you get. Cloud App Discovery requires web-traffic data with the following attributes:

* Date of the transaction
* Source IP
* Source user **recommended**
* Destination IP address
* Destination URL **recommended** (URLs provide more accuracy for cloud app detection than IP addresses)
* Total amount of data
* Amount of uploaded or downloaded data, for insights about patterns of cloud app usage
* Action taken (allowed/blocked)

Cloud App Discovery cannot show or analyze attributes that are not included in your logs. For example, **Cisco ASA Firewall** standard log format does not contain the **Amount of uploaded bytes per transaction**, **Username**, or **Target URL** but only the destination IP address. So you have a bit less visibility into the cloud apps from this data source. For Cisco ASA firewalls, it is necessary to set the information level to 6.1

In order to successfully generate a Cloud App Discovery report, your traffic logs must meet the following conditions:

1.  Data source is supported (see list below).
2.  Log format matches the expected standard format (checked at upload time).
3.  Events are not more than 90 days old.
4.  The log file is valid and includes outbound traffic information.

## Supported firewalls and proxies

* Barracuda - Web App Firewall (W3C)
* Blue Coat Proxy SG - Access log (W3C)
* Check Point
* Cisco ASA Firewall (For Cisco ASA firewalls, set the information level to 6)
* Cisco IronPort WSA
* Cisco ScanSafe
* Cisco Meraki – URLs log
* Clavister NGFW (Syslog)
* Dell Sonicwall
* Fortinet Fortigate
* Juniper SRX
* Juniper SSG
* McAfee Secure Web Gateway
* Microsoft Forefront Threat Management Gateway (W3C)
* Palo Alto series Firewall
* Sophos SG
* Sophos Cyberoam
* Squid (Common)
* Squid (Native)
* We### bsense - Web Security Solutions - Investigative detail report (CSV)
* Websense - Web Security Solutions - Internet activity log (CEF)
* Zscaler

> [!NOTE]
> Cloud App Discovery supports both IPv4 and IPv6 addresses.

If your log is not supported, select **Other** as the **Data source** and
specify the appliance and log you are tr### ying to upload. Your log will be
reviewed by the Cloud App Security cloud analyst team and you will be notified
if support for your log type is added. Alternatively, you can define a custom
parser that matches your format. For more information see [Use a custom log
parser](https://docs.microsoft.com/en-us/cloud-app-security/custom-log-parser).

Data attributes (according to vendor documentation):

| Data source                                  | Target App URL | Target App IP | Username | Origin IP | Total traffic | Uploaded bytes |
|----------------------------------------------|----------------|---------------|----------|-----------|---------------|----------------|
| Barracuda                                    | **Yes**        | **Yes**       | **Yes**  | **Yes**   | No            | No             |
| Blue Coat                                    | **Yes**        | No            | **Yes**  | **Yes**   | **Yes**       | **Yes**        |
| Checkpoint                                   | No             | **Yes**       | No       | **Yes**   | No            | No             |
| Cisco ASA                                    | No             | **Yes**       | No       | **Yes**   | **Yes**       | No             |
| Cisco FWSM                                   | No             | **Yes**       | No       | **Yes**   | **Yes**       | No             |
| Cisco Ironport WSA                           | **Yes**        | **Yes**       | **Yes**  | **Yes**   | **Yes**       | **Yes**        |
| Cisco Meraki                                 | **Yes**        | **Yes**       | No       | **Yes**   | No            | No             |
| Clavister NGFW (Syslog)                      | **Yes**        | **Yes**       | **Yes**  | **Yes**   | **Yes**       | **Yes**        |
| Dell SonicWall                               | **Yes**        | **Yes**       | No       | **Yes**   | **Yes**       | **Yes**        |
| Fortigate                                    | No             | **Yes**       | No       | **Yes**   | **Yes**       | **Yes**        |
| Juniper SRX                                  | No             | **Yes**       | No       | **Yes**   | **Yes**       | **Yes**        |
| Juniper SSG                                  | No             | **Yes**       | No       | **Yes**   | **Yes**       | **Yes**        |
| McAfee SWG                                   | **Yes**        | No            | No       | **Yes**   | **Yes**       **Yes**        |
| MS TMG    ###                                    | **Yes**        | No            | **Yes**  | **Yes**   | **Yes**       | **Yes**        |
| Palo Alto Networks                           | **Yes**        | **Yes**       | **Yes**  | **Yes**   | **Yes**       | **Yes**        |
| Sophos                                       | **Yes**        | **Yes**       | **Yes**  | **Yes**   | **Yes**       | No             |
| Squid (Common)                               | **Yes**        | No            | **Yes**  | **Yes**   | No            | **Yes**        |
| Squid (Native)                               | **Yes**        | No            | **Yes**  | **Yes**   | No            | **Yes**        |
| Websense - Investigative detail report (CSV) | **Yes**        | **Yes**       | **Yes**  | **Yes**   | **Yes**       | **Yes**        |
| Websense - Internet activity log (CEF)       | **Yes**        | **Yes**       | **Yes**  | **Yes**   | **Yes**       | **Yes**        |
| Zscaler                                      | **Yes**        | **Yes**       | **Yes**  | **Yes**   | **Yes**       | **Yes**        |


## Next steps
Use the following links to continue to set up enhanced Cloud App Discovery in Azure AD.

* [Create snapshot Cloud App Discovery reports](cloudappdiscovery-set-up-snapshots.md)
* [Configure automatic log upload for continuous reporting](https://docs.microsoft.com/cloud-app-security/discovery-docker)
* [Use a custom log parser](https://docs.microsoft.comcommit/cloud-app-security/custom-log-parser)
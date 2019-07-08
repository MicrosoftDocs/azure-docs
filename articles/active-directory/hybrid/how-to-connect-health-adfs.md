---
title: Using Azure AD Connect Health with AD FS | Microsoft Docs
description: This is the Azure AD Connect Health page how to monitor your on-premises AD FS infrastructure.
services: active-directory
documentationcenter: ''
ms.reviewer: zhiweiwangmsft
author: billmath
manager: daveba
editor: curtand
ms.assetid: dc0e53d8-403e-462a-9543-164eaa7dd8b3
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.date: 02/26/2019
ms.author: billmath
ms.custom: H1Hack27Feb2017
ms.collection: M365-identity-device-management
---

# Monitor AD FS using Azure AD Connect Health
The following documentation is specific to monitoring your AD FS infrastructure with Azure AD Connect Health. For information on monitoring Azure AD Connect (Sync) with Azure AD Connect Health, see [Using Azure AD Connect Health for Sync](how-to-connect-health-sync.md). Additionally, for information on monitoring Active Directory Domain Services with Azure AD Connect Health, see [Using Azure AD Connect Health with AD DS](how-to-connect-health-adds.md).

## Alerts for AD FS
The Azure AD Connect Health Alerts section provides you the list of active alerts. Each alert includes relevant information, resolution steps, and links to related documentation.

You can double-click an active or resolved alert, to open a new blade with additional information, steps you can take to resolve the alert, and links to relevant documentation. You can also view historical data on alerts that were resolved in the past.

![Azure AD Connect Health Portal](./media/how-to-connect-health-adfs/alert2.png)

## Usage Analytics for AD FS
Azure AD Connect Health Usage Analytics analyzes the authentication traffic of your federation servers. You can double-click the usage analytics box, to open the usage analytics blade, which shows you several metrics and groupings.

> [!NOTE]
> To use Usage Analytics with AD FS, you must ensure that AD FS auditing is enabled. For more information, see [Enable Auditing for AD FS](how-to-connect-health-agent-install.md#enable-auditing-for-ad-fs).
>
>

![Azure AD Connect Health Portal](./media/how-to-connect-health-adfs/report1.png)

To select additional metrics, specify a time range, or to change the grouping, right-click on the usage analytics chart and select Edit Chart. Then you can specify the time range, select a different metric, and change the grouping. You can view the distribution of the authentication traffic based on different "metrics" and group each metric using relevant "group by" parameters described in the following section:

**Metric : Total Requests** - Total number of requests processed by AD FS servers.

|Group By | What the grouping means and why it's useful? |
| --- | --- |
| All | Shows the count of total number of requests processed by all AD FS servers.|
| Application | Groups the total requests based on the targeted relying party. This grouping is useful to understand which application is receiving how much percentage of the total traffic. |
|  Server |Groups the total requests based on the server that processed the request. This grouping is useful to understand the load distribution of the total traffic.
| Workplace Join |Groups the total requests based on whether they are coming from devices that are workplace joined (known). This grouping is useful to understand if your resources are accessed using devices that are unknown to the identity infrastructure. |
|  Authentication Method | Groups the total requests based on the authentication method used for authentication. This grouping is useful to understand the common authentication method that gets used for authentication. Following are the possible authentication methods <ol> <li>Windows Integrated Authentication (Windows)</li> <li>Forms Based Authentication (Forms)</li> <li>SSO (Single Sign On)</li> <li>X509 Certificate Authentication (Certificate)</li> <br>If the federation servers receive the request with an SSO Cookie, that request is counted as SSO (Single Sign On). In such cases, if the cookie is valid, the user is not asked to provide credentials and gets seamless access to the application. This behavior is common if you have multiple relying parties protected by the federation servers. |
| Network Location | Groups the total requests based on the network location of the user. It can be either intranet or extranet. This grouping is useful to know what percentage of the traffic is coming from the intranet versus extranet. |


**Metric: Total Failed Request** - The total number failed requests processed by the federation service. (This metric is only available on AD FS for Windows Server 2012 R2)

|Group By | What the grouping means and why it's useful? |
| --- | --- |
| Error Type | Shows the number of errors based on predefined error types. This grouping is useful to understand the common types of errors. <ul><li>Incorrect Username or Password: Errors due to incorrect username or password.</li> <li>"Extranet Lockout": Failures due to the requests received from a user that was locked out from extranet </li><li> "Expired Password": Failures due to users logging in with an expired password.</li><li>"Disabled Account": Failures due to users logging with a disabled account.</li><li>"Device Authentication": Failures due to users failing to authenticate using Device Authentication.</li><li>"User Certificate Authentication": Failures due to users failing to authenticate because of an invalid certificate.</li><li>"MFA": Failures due to user failing to authenticate using Multi-Factor Authentication.</li><li>"Other Credential": "Issuance Authorization": Failures due to authorization failures.</li><li>"Issuance Delegation": Failures due to issuance delegation errors.</li><li>"Token Acceptance": Failures due to ADFS rejecting the token from a third-party Identity Provider.</li><li>"Protocol": Failure due to protocol errors.</li><li>"Unknown": Catch all. Any other failures that do not fit into the defined categories.</li> |
| Server | Groups the errors based on the server. This grouping is useful to understand the error distribution across servers. Uneven distribution could be an indicator of a server in a faulty state. |
| Network Location | Groups the errors based on the network location of the requests (intranet vs extranet). This grouping is useful to understand the type of requests that are failing. |
|  Application | Groups the failures based on the targeted application (relying party). This grouping is useful to understand which targeted application is seeing most number of errors. |

**Metric : User Count** - Average number of unique users actively authenticating using AD FS

|Group By | What the grouping means and why it's useful? |
| --- | --- |
|All |This metric provides a count of average number of users using the federation service in the selected time slice. The users are not grouped. <br>The average depends on the time slice selected. |
| Application |Groups the average number of users based on the targeted application (relying party). This grouping is useful to understand how many users are using which application. |

## Performance Monitoring for AD FS
Azure AD Connect Health Performance Monitoring provides monitoring information on metrics. Selecting the Monitoring box, opens a new blade with detailed information on the metrics.

![Azure AD Connect Health Portal](./media/how-to-connect-health-adfs/perf1.png)

By selecting the Filter option at the top of the blade, you can filter by server to see an individual server’s metrics. To change metric, right-click on the monitoring chart under the monitoring blade and select Edit Chart (or select the Edit Chart button). From the new blade that opens up, you can select additional metrics from the drop-down and specify a time range for viewing the performance data.

## Top 50 Users with failed Username/Password logins
One of the common reasons for a failed authentication request on an AD FS server is a request with invalid credentials, that is, a wrong username or password. Usually happens to users due to complex passwords, forgotten passwords, or typos.

But there are other reasons that can result in an unexpected number of requests being handled by your AD FS servers, such as: An application that caches user credentials and the credentials expire or a malicious user attempting to sign into an account with a series of well-known passwords. These two examples are valid reasons that could lead to a surge in requests.

Azure AD Connect Health for ADFS provides a report about top 50 Users with failed login attempts due to invalid username or password. This report is achieved by processing the audit events generated by all the AD FS servers in the farms.

![Azure AD Connect Health Portal](./media/how-to-connect-health-adfs/report1a.png)

Within this report you have easy access to the following pieces of information:

* Total # of failed requests with wrong username/password in the last 30 days
* Average # of users that failed with a bad username/password login per day.

Clicking this part takes you to the main report blade that provides additional details. This blade includes a graph with trending information to help establish a baseline about requests with wrong username or password. Additionally, it provides the list of top 50 users with the number of failed attempts during the past week. Notice top 50 users from the past week could help identify bad password spikes.  

The graph provides the following information:

* The total # of failed logins due to a bad username/password on a per-day basis.
* The total # of unique users that failed logins on a per-day basis.
* Client IP address of for last request

![Azure AD Connect Health Portal](./media/how-to-connect-health-adfs/report3a.png)

The report provides the following information:

| Report Item | Description |
| --- | --- |
| User ID |Shows the user ID that was used. This value is what the user typed, which in some cases is the wrong user ID being used. |
| Failed Attempts |Shows the total # of failed attempts for that specific user ID. The table is sorted with the most number of failed attempts in descending order. |
| Last Failure |Shows the time stamp when the last failure occurred. |
| Last Failure IP |Shows the Client IP address from the latest bad request. If you see more than one IP addresses in this value, it may include forward client IP together with user's last attempt request IP.  |

> [!NOTE]
> This report is automatically updated after every 12 hours with the new information collected within that time. As a result, login attempts within the last 12 hours may not be included in the report.

## Related links
* [Azure AD Connect Health](whatis-hybrid-identity-health.md)
* [Azure AD Connect Health Agent Installation](how-to-connect-health-agent-install.md)
* [Risky IP report](how-to-connect-health-adfs-risky-ip.md)


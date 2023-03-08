---
title: Introduction to Active Directory service accounts
description: An introduction to the types of service accounts in Active Directory, and how to secure them.
services: active-directory
author: janicericketts
manager: martinco
ms.service: active-directory
ms.workload: identity
ms.subservice: fundamentals
ms.topic: conceptual
ms.date: 08/26/2022
ms.author: jricketts
ms.reviewer: ajburnle
ms.custom: "it-pro, seodec18"
ms.collection: M365-identity-device-management
---
# Securing on-premises service accounts

A service has a primary security identity that determines the access rights for local and network resources. The security context for a Microsoft Win32 service is determined by the service account that's used to start the service. You use a service account to:
* Identify and authenticate a service.
* Successfully start a service.
* Access or execute code or an application.
* Start a process. 

## Types of on-premises service accounts

Depending on your use case, you can use a managed service account (MSA), a computer account, or a user account to run a service. You must first test a service to confirm that it can use a managed service account. If the service can use an MSA, you should use one.

### Group managed service accounts

For services that run in your on-premises environment, use [group managed service accounts (gMSAs)](service-accounts-group-managed.md) whenever possible. gMSAs provide a single identity solution for services that run on a server farm or behind a network load balancer. gMSAs can also be used for services that run on a single server. For information about the requirements for gMSAs, see [Get started with group managed service accounts](/windows-server/security/group-managed-service-accounts/getting-started-with-group-managed-service-accounts).

### Standalone managed service accounts

If you can't use a gMSA, use a [standalone managed service account (sMSA)](service-accounts-standalone-managed.md). sMSAs require at least Windows Server 2008 R2. Unlike gMSAs, sMSAs run on only one server. They can be used for multiple services on that server.

### Computer accounts

If you can't use an MSA, consider using a [computer account](service-accounts-computer.md). The LocalSystem account is a predefined local account that has extensive permissions on the local computer and acts as the computer identity on the network.

Services that run as a LocalSystem account access network resources by using the credentials of the computer account in the format <domain_name>\\<computer_name>. Its predefined name is NT AUTHORITY\SYSTEM. You can use it to start a service and provide a security context for that service.

> [!NOTE]
> When you use a computer account, you can't determine which service on the computer is using that account. Consequently, you can't audit which service is making changes. 

### User accounts

If you can't use an MSA, consider using a [user account](service-accounts-user-on-premises.md). A user account can be a *domain* user account or a *local* user account.

A domain user account enables the service to take full advantage of the service security features of Windows and Microsoft Active Directory Domain Services. The service will have local and network permissions granted to the account. It will also have the permissions of any groups of which the account is a member. Domain service accounts support Kerberos mutual authentication.

A local user account (name format: *.\UserName*) exists only in the Security Account Manager database of the host computer. It doesn't have a user object in Active Directory Domain Services. A local account can't be authenticated by the domain. So, a service that runs in the security context of a local user account doesn't have access to network resources (except as an anonymous user). Services that run in the local user context can't support Kerberos mutual authentication in which the service is authenticated by its clients. For these reasons, local user accounts are ordinarily inappropriate for directory-enabled services.

> [!IMPORTANT]
> Service accounts shouldn't be members of any privileged groups, because privileged group membership confers permissions that might be a security risk. Each service should have its own service account for auditing and security purposes.

## Choose the right type of service account

| Criterion| gMSA| sMSA| Computer&nbsp;account| User&nbsp;account |
| - | - | - | - | - |
| App runs on a single server| Yes| Yes. Use a gMSA if possible.| Yes. Use an MSA if possible.| Yes. Use an MSA if possible. |
| App runs on multiple servers| Yes| No| No. Account is tied to the server.| Yes. Use an MSA if possible. |
| App runs behind a load balancer| Yes| No| No| Yes. Use only if you can't use a gMSA. |
| App runs on Windows Server 2008 R2| No| Yes| Yes. Use an MSA if possible.| Yes. Use an MSA if possible. |
| App runs on Windows Server 2012| Yes| Yes. Use a gMSA if possible.| Yes. Use an MSA if possible.| Yes. Use an MSA if possible. |
| Requirement to restrict service account to single server| No| Yes| Yes. Use an sMSA if possible.| No |
| | |

### Use server logs and PowerShell to investigate

You can use server logs to determine which servers, and how many servers, an application is running on.

To get a listing of the Windows Server version for all servers on your network, you can run the following PowerShell command: 

```PowerShell

Get-ADComputer -Filter 'operatingsystem -like "*server*" -and enabled -eq "true"' `

-Properties Name,Operatingsystem,OperatingSystemVersion,IPv4Address |

sort-Object -Property Operatingsystem |

Select-Object -Property Name,Operatingsystem,OperatingSystemVersion,IPv4Address |

Out-GridView

```

## Find on-premises service accounts

We recommend that you add a prefix such as “svc-” to all accounts that you use as service accounts. This naming convention will make the accounts easier to find and manage. Also consider using a description attribute for the service account and the owner of the service account. The description can be a team alias or security team owner.

Finding on-premises service accounts is key to ensuring their security. Doing so can be difficult for non-MSA accounts. We recommend that you review all the accounts that have access to your important on-premises resources, and that you determine which computer or user accounts might be acting as service accounts. 

To learn how to find a service account, see the article about that account type in the ["Next steps" section](#next-steps).

## Document service accounts

After you've found the service accounts in your on-premises environment, document the following information: 

* **Owner**: The person accountable for maintaining the account.

* **Purpose**: The application the account represents, or other purpose. 

* **Permission scopes**: The permissions it has or should have, and any groups it's a member of.

* **Risk profile**: The risk to your business if this account is compromised. If the risk is high, use an MSA.

* **Anticipated lifetime and periodic attestation**: How long you anticipate that this account will be live, and how often the owner should review and attest to its ongoing need.

* **Password security**: For user and local computer accounts, where the password is stored. Ensure that passwords are kept secure, and document who has access. Consider using [Privileged Identity Management](../privileged-identity-management/pim-configure.md) to secure stored passwords. 

## Next steps

To learn more about securing service accounts, see the following articles:

* [Secure group managed service accounts](service-accounts-group-managed.md)  
* [Secure standalone managed service accounts](service-accounts-standalone-managed.md)  
* [Secure computer accounts](service-accounts-computer.md)  
* [Secure user accounts](service-accounts-user-on-premises.md)  
* [Govern on-premises service accounts](service-accounts-govern-on-premises.md)

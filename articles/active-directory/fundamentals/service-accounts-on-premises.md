---
title: Introduction to Active Directory service accounts | Azure Active Directory
description: An introduction to the types of service accounts in Active Directory, and how to secure them.
services: active-directory
author: BarbaraSelden
manager: daveba
ms.service: active-directory
ms.workload: identity
ms.subservice: fundamentals
ms.topic: conceptual
ms.date: 2/15/2021
ms.author: baselden
ms.reviewer: ajburnle
ms.custom: "it-pro, seodec18"
ms.collection: M365-identity-device-management
---

# Introduction to Active Directory service accounts

A service has a primary security identity that determines the access rights for local and network resources. The security context for a Microsoft Win32 service is determined by the service account that is used to start the service. A service account is used to:
* identify and authenticate a service
* successfully start a service
* access or execute code or an application
* start a process. 

## Types of on-premises service accounts

Based on your use case, you can use a managed service account (MSA), a computer account, or a user account to run a service. Services must be tested to confirm they can use a managed service account. If they can, you should use one.

### Group MSA accounts

Use [group managed service accounts](service-accounts-group-managed.md) (gMSAs) whenever possible for services running in your on-premises environment. gMSAs provide a single identity solution for a service running on a server farm, or behind a network load balancer. They can also be used for a service running on a single server. [gMSAs have specific requirements that must be met](/windows-server/security/group-managed-service-accounts/getting-started-with-group-managed-service-accounts)

### Standalone MSA accounts

If you can't use a gMSA, use a [standalone managed service accounts](service-accounts-standalone-managed.md)(sMSA). sMSAs require at least Windows Server 2008R2. Unlike gMSAs, sMSAs run only on one server. They can be used for multiple services on that server.

### Computer account

If you can't use an MSA, investigate using a [computer accounts](service-accounts-computer.md). The LocalSystem account is a predefined local account that has extensive privileges on the local computer, and acts as the computer identity on the network.   
‎Services that run as a LocalSystem account access network resource by using the credentials of the computer account in the format 
<domain_name>\<computer_name>.

NT AUTHORITY\SYSTEM is the predefined name for the LocalSystem account. It can be used to start a service and provide the security context for that service.

> [!NOTE]
> When a computer account is used, you cannot tell which service on the computer is using that account, and therefore cannot audit which service is making changes. 

### User account

If you can't use an MSA, investigate using a [user accounts](service-accounts-user-on-premises.md). User accounts can be a domain user account or a local user account.

A domain user account enables the service to take full advantage of the service security features of Windows and Microsoft Active Directory Domain Services. The service will have the local and network access granted to the account. It will also have the permissions of any groups of which the account is a member. Domain service accounts support Kerberos mutual authentication.

A local user account (name format: ".\UserName") exists only in the SAM database of the host computer; it doesn't have a user object in Active Directory Domain Services. A local account can't be authenticated by the domain. So, a service that runs in the security context of a local user account doesn't have access to network resources (except as an anonymous user). Services running in the local user context can't support Kerberos mutual authentication in which the service is authenticated by its clients. For these reasons, local user accounts are typically inappropriate for directory-enabled services.

> [!IMPORTANT]
> Service accounts should not be members of any privileged groups, as privileged group membership confers permissions that may be a security risk. Each service should have its own service account for auditing and security purposes.

## Choose the right type of service account


| Criteria| gMSA| sMSA| Computer account| User account |
| - | - | - | - | - |
| App runs on single server| Yes| Yes. Use a gMSA if possible| Yes. Use an MSA if possible| Yes. Use MSA if possible. |
| App runs on multiple servers| Yes| No| No. Account is tied to the server| Yes. Use MSA if possible. |
| App runs behind load balancers| Yes| No| No| Yes. Use only if you can't use a gMSA |
| App runs on Windows Server 2008 R2| No| Yes| Yes. Use MSA if possible.| Yes. Use MSA if possible. |
| Runs on Windows server 2012| Yes| Yes. Use gMSA if possible| Yes. Use MSA if possible| Yes. Use MSA if possible. |
| Requirement to restrict service account to single server| No| Yes| Yes. Use sMSA if possible| No. |


 

### Use server logs and PowerShell to investigate

You can use server logs to determine which servers, and how many servers, an application is running on.

You can run the following PowerShell command to get a listing of the Windows Server version for all servers on your network. 

```PowerShell

Get-ADComputer -Filter 'operatingsystem -like "*server*" -and enabled -eq "true"' `

-Properties Name,Operatingsystem,OperatingSystemVersion,IPv4Address |

sort-Object -Property Operatingsystem |

Select-Object -Property Name,Operatingsystem,OperatingSystemVersion,IPv4Address |

Out-GridView

```

## Find on-premises service accounts

We recommend that you add a prefix such as “svc.” To all accounts used as service accounts. This naming convention will make them easier to find and manage. Also consider the use of a description attribute for the service account and the owner of the service account, this may be a team alias or security team owner.

Finding on-premises service accounts is key to ensuring their security. And, it can be difficult for non-MSA accounts. We recommend reviewing all the accounts that have access to your important on-premises resources, and determining which computer or user accounts may be acting as service accounts. You can also use the following methods to find accounts.

* The articles for each type of account have detailed steps for finding that account type. For links to these articles, see the Next steps section of this article.

## Document service accounts

Once you have found the service accounts in your on-premises environment, document the following information about each account. 

* The owner. The person accountable for maintaining the account.

* The purpose. The application the account represents, or other purpose. 

* Permission scopes. What permissions does it have, and should it have? What if any groups is it a member of?

* Risk profile. What is the risk to your business if this account is compromised? If high risk, use an MSA.

* Anticipated lifetime and periodic attestation. How long do you anticipate this account being live? How often must the owner review and attest to ongoing need?

* Password security. For user and local computer accounts, where the password is stored. Ensure passwords are kept secure, and document who has access. Consider using [Privileged Identity Management](../privileged-identity-management/pim-configure.md) to secure stored passwords. 

  

## Next steps

See the following articles on securing service accounts

* [Introduction to on-premises service accounts](service-accounts-on-premises.md)

* [Secure group managed service accounts](service-accounts-group-managed.md)

* [Secure standalone managed service accounts](service-accounts-standalone-managed.md)

* [Secure computer accounts](service-accounts-computer.md)

* [Secure user accounts](service-accounts-user-on-premises.md)

* [Govern on-premises service accounts](service-accounts-govern-on-premises.md)


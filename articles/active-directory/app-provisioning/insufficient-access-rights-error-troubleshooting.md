---
title: Troubleshoot Active Directory InsufficientAccessRights error
description: Learn how to troubleshoot an error with the Active Directory InsufficientAccessRights command
author: jfields
manager: amycolannino
ms.service: active-directory
ms.subservice: app-provisioning
ms.topic: troubleshooting
ms.workload: identity
ms.date: 06/23/2023
ms.author: jenniferf-skc
ms.reviewer: chmutali
---

# Troubleshoot Active Directory InsufficientAccessRights error

## Issue

Customer reports that HR to AD user provisioning is working as expected for most users. But for some users, the provisioning logs displays the following error:

```
ERROR: InsufficientAccessRights-SecErr: The user has insufficient access rights.. Access is denied. \nError Details: Problem 4003 - INSUFF_ACCESS_RIGHTS. 
OR

ERROR: {"Exceptions":[{"SerializedExceptionString":"{\"ClassName\":\"Microsoft.ActiveDirectory.SynchronizationAgent.Contract.SerializableDirectoryOperationException\",
\"Message\":\"The user has insufficient access rights.\",
\"Data\":null,\"InnerException\":null,\"HelpURL\":null,\"StackTraceString\":null,\"RemoteStackTraceString\":null,
\"RemoteStackIndex\":0,\"ExceptionMethod\":null,\"HResult\":-2146233088,\"Source\":null,\"WatsonBuckets\":null,
\"ResponseResultCode\":\"InsufficientAccessRights\",
\"ResponseErrorMessage\":\"00002098: SecErr: DSID-03150F94, problem 4003 (INSUFF_ACCESS_RIGHTS), data 0\",
\"SerializedException\":\"Details:\\r\\nType: System.DirectoryServices.Protocols.DirectoryOperationException\\r\\n
The user has insufficient access rights.

With error code:
HybridSynchronizationActiveDirectoryInsufficientAccessRights
```

## Cause
The Provisioning Agent GMSA account ```provAgentgMSA$``` by default has read/write permission to all user objects in the domain. There are two possible causes which may lead to the above error.

- Cause-1: The user object is part of an OU that does not inherit domain-level permissions.
- Cause-2: The user object belongs to a [protected Active Directory group](https://go.microsoft.com/fwlink/?linkid=2240442) . By design, such objects are governed by permissions associated with a special container called [```AdminSDHolder```](https://go.microsoft.com/fwlink/?linkid=2240377). This explains why the ```provAgentgMSA$``` account is unable to update these accounts belonging to protected Active Directory groups. The customer may try to override and explicitly provide the ```provAgentgMSA$``` account write access to such user accounts. But that won't work because, in order to secure privileged user accounts from a misuse of delegated permissions, there is a background process called [SDProp](https://go.microsoft.com/fwlink/?linkid=2240378)  that runs every 60 minutes and ensures that users belonging to protected group are always managed by permissions defined on the ```AdminSDHolder``` container. Even the approach of adding the ```provAgentgMSA$``` account to the Domain Admin group won't work.


## Resolution

First confirm what is causing the problem.
To check if Cause-1 is the source of the problem:
1.	Open the **Active Directory Users and Computers Management Console**.
2.	Select the OU associated with the user.
3.	Right click and navigate to **Properties -> Security -> Advanced**.
    If the **Enable Inheritance** button is shown, then it is confirmed that Cause-1 is the source of the problem.  
4.	Click on **Enable Inheritance** so that domain level permissions are applicable to this OU.
>[!NOTE:]
>Please remember to verify the whole hierarchy from domain level down to the OU holding the affected accounts. All Parent OUs/Containers must have inheritance enabled so the permissions applied at the domain level may cascade down to the final object.

If Cause-1 is not the source of the problem, then potentially Cause-2 is the source of the problem. There are two possible resolution options.

**Option 1: Remove affected user from protected AD group**
To find the list of users that are governed by this ```AdminSDHolder``` permissions, Cx can invoke the following command:

```Get-AdObject -filter {AdminCount -gt 0}```

Reference articles:
•	Here is an [example PowerShell script](https://notesbytom.wordpress.com/2017/12/01/clear-admincount-and-enable-inheritance-on-user/) that can be used to clear the AdminCount flag and re-enable inheritance on impacted users.
•	Use the steps documented in this [article - Find Orphaned Accounts](https://social.technet.microsoft.com/wiki/contents/articles/33307.active-directory-find-orphaned-objects.aspx)  to find orphaned accounts (accounts who are not part of a protected group, but still have AdminCount flag set to 1)

*Option 1 might not always work*

There is a process called The Security Descriptor Propagation (SDPROP) process that runs every hour on the domain controller holding the PDC emulator FSMO role. It's this process that sets the ```AdminCount``` attribute to 1. The main function of SDPROP is to protect highly-privileged Active Directory accounts, ensuring that they can’t be deleted or have rights modified, accidentally or intentionally, by users or processes with less privilege.

Reference articles that explain the reason in detail:

- [Five common questions about AdminHolder and SDProp](https://techcommunity.microsoft.com/t5/ask-the-directory-services-team/five-common-questions-about-adminsdholder-and-sdprop/ba-p/396293)
- [Understanding AdminSD Holder object](https://petri.com/active-directory-security-understanding-adminsdholder-object/)


**Option 2: Modify the default permissions of the AdminSDHolder container**

If option 1 is not feasible and doesn't work as expected, then ask Cx to check with their AD admin and security administrators, if they are allowed to modify the default permissions of the ```AdminSDHolder``` container. This [article](https://learn.microsoft.com/previous-versions/technet-magazine/ee361593(v=msdn.10)?redirectedfrom=MSDN) that explains the importance of the ```AdminSDHolder``` container. Once Cx gets internal approval to update the ```AdminSDHolder``` container permissions, there are two ways to update the permissions.

•	Using ```ADSIEdit``` as described in this [article](https://petri.com/active-directory-security-understanding-adminsdholder-object ).
•	Using ```DSACLS``` command-line script. Here is an example script that could be used as a starting point and Cx can tweak it as per their requirements.

```python

$dcFQDN = "<FQDN Of The Nearest RWDC Of Domain>"
$domainDN = "<Domain Distinguished Name>"
$domainNBT = "<Domain NetBIOS Name>"
$dsaclsCMD = "DSACLS '\\$dcFQDN\CN=AdminSDHolder,CN=System,$domainDN' /G '$domainNBT\provAgentgMSA$:RPWP;<Attribute To Write To>'"
Invoke-
Expression $dsaclsCMD | Out-Null
```

If the Cx needs more help on troubleshooting on-premises AD permissions, engage Windows Server Support team.
This article on [AdminSDHolder issues with AAD Connect](https://c7solutions.com/2017/03/administrators-aadconnect-and-adminsdholder-issues) has more examples on DSACLS usage.

**Option 3: Assign full controll to provAgentgMSA account**

Assign **Full Control** permissions to the ```provAgentGMSA``` account. We recommend this step if there are failures with user object move from one container OU to another and these users don't belong to a protected user group.

In this scenario, ask Cx to complete the following steps and re-test the move operation.
1.	Login to AD domain controller as admin.
2.	Open PowerShell command-line with run-as admin
3.	At the PowerShell prompt, run the following [DSACLS](https://learn.microsoft.com/previous-versions/windows/it-pro/windows-server-2012-r2-and-2012/cc771151(v=ws.11)) command that grants **Generic All/Full Control** to the provisioning agent GMSA account.
```dsacls "dc=contoso,dc=com" /I:T /G "CN=provAgentgMSA,CN=Managed Service Accounts,DC=contoso,DC=com:GA"```

Customer should replace the ```dc=contoso,dc=com``` with their root node or appropriate OU container. If Cx is using a custom GMSA, update the DN value for ```provAgentgMSA```.

**Option 4: Skip GMSA account and use manually created service account**
This option should only be used as a temporary workaround to unblock the customer till GMSA permission issue is investigated and resolved. Our recommended best practice is to use the GMSA account.
The customer can set the registry option to [skip GMSA configuration](https://learn.microsoft.com/azure/active-directory/hybrid/cloud-sync/how-to-manage-registry-options#skip-gmsa-configuration) and reconfigure the Azure AD Connect provisioning agent to use a manually created service account with the right permissions.

## Next steps

* [Learn more about the Inbound Provisioning API](application-provisioning-api-concepts.md)


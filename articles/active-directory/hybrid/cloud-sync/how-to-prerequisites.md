---
title: 'Prerequisites for Azure AD Connect cloud sync in Azure AD'
description: This article describes the prerequisites and hardware requirements you need for cloud sync.
services: active-directory
author: billmath
manager: amycolannino
ms.service: active-directory
ms.workload: identity
ms.topic: how-to
ms.date: 01/11/2023
ms.subservice: hybrid
ms.author: billmath
ms.collection: M365-identity-device-management
---

# Prerequisites for Azure AD Connect cloud sync
This article provides guidance on how to choose and use Azure Active Directory (Azure AD) Connect cloud sync as your identity solution.

## Cloud provisioning agent requirements
You need the following to use Azure AD Connect cloud sync:

- Domain Administrator or Enterprise Administrator credentials to create the Azure AD Connect Cloud Sync gMSA (group Managed Service Account) to run the agent service.	
- A hybrid identity administrator account for your Azure AD tenant that is not a guest user.
- An on-premises server for the provisioning agent with Windows 2016 or later.  This server should be a tier 0 server based on the [Active Directory administrative tier model](/windows-server/identity/securing-privileged-access/securing-privileged-access-reference-material).  Installing the agent on a domain controller is supported.
- High availability refers to the Azure AD Connect cloud sync's ability to operate continuously without failure for a long time.  By having multiple active agents installed and running, Azure AD Connect cloud sync can continue to function even if one agent should fail.  Microsoft recommends having 3 active agents installed for high availability.
- On-premises firewall configurations.

## Group Managed Service Accounts
A group Managed Service Account is a managed domain account that provides automatic password management, simplified service principal name (SPN) management, the ability to delegate the management to other administrators, and also extends this functionality over multiple servers.  Azure AD Connect Cloud Sync supports and uses a gMSA for running the agent.  You will be prompted for administrative credentials during setup, in order to create this account.  The account will appear as (domain\provAgentgMSA$).  For more information on a gMSA, see [group Managed Service Accounts](/windows-server/security/group-managed-service-accounts/group-managed-service-accounts-overview) 

### Prerequisites for gMSA:
1. The Active Directory schema in the gMSA domain's forest needs to be updated to Windows Server 2012 or later.
2. [PowerShell RSAT modules](/windows-server/remote/remote-server-administration-tools) on a domain controller
3. At least one domain controller in the domain must be running Windows Server 2012 or later.
4. A domain joined server where the agent is being installed needs to be either Windows Server 2016 or later.

### Custom gMSA account
If you are creating a custom gMSA account, you need to ensure that the account has the following permissions.

|Type |Name |Access |Applies To| 
|-----|-----|-----|-----|
|Allow |gMSA Account |Read all properties |Descendant device objects| 
|Allow |gMSA Account|Read all properties |Descendant InetOrgPerson objects| 
|Allow |gMSA Account |Read all properties |Descendant Computer objects| 
|Allow |gMSA Account |Read all properties |Descendant foreignSecurityPrincipal objects| 
|Allow |gMSA Account |Full control |Descendant Group objects| 
|Allow |gMSA Account |Read all properties |Descendant User objects| 
|Allow |gMSA Account |Read all properties |Descendant Contact objects| 
|Allow |gMSA Account |Create/delete User objects|This object and all descendant objects| 

For steps on how to upgrade an existing agent to use a gMSA account see [group Managed Service Accounts](how-to-install.md#group-managed-service-accounts).

For more information on how to prepare your Active Directory for group Managed Service Account, see [group Managed Service Accounts Overview](/windows-server/security/group-managed-service-accounts/group-managed-service-accounts-overview).

### In the Azure portal

1. Create a cloud-only hybrid identity administrator account on your Azure AD tenant. This way, you can manage the configuration of your tenant if your on-premises services fail or become unavailable. Learn about how to [add a cloud-only hybrid identity administrator account](../../fundamentals/add-users-azure-active-directory.md). Finishing this step is critical to ensure that you don't get locked out of your tenant.
1. Add one or more [custom domain names](../../fundamentals/add-custom-domain.md) to your Azure AD tenant. Your users can sign in with one of these domain names.

### In your directory in Active Directory

Run the [IdFix tool](/office365/enterprise/prepare-directory-attributes-for-synch-with-idfix) to prepare the directory attributes for synchronization.

### In your on-premises environment

1. Identify a domain-joined host server running Windows Server 2016 or greater with a minimum of 4-GB RAM and .NET 4.7.1+ runtime.

2. The PowerShell execution policy on the local server must be set to Undefined or RemoteSigned.

3. If there's a firewall between your servers and Azure AD, see [Firewall and proxy requirements](#firewall-and-proxy-requirements) below.  

>[!NOTE]
> Installing the cloud provisioning agent on Windows Server Core is not supported.

### Additional requirements

- [Microsoft .NET Framework 4.7.1](https://dotnet.microsoft.com/download/dotnet-framework/net471) 

#### TLS requirements

> [!NOTE]
> Transport Layer Security (TLS) is a protocol that provides for secure communications. Changing the TLS settings affects the entire forest. For more information, see [Update to enable TLS 1.1 and TLS 1.2 as default secure protocols in WinHTTP in Windows](https://support.microsoft.com/help/3140245/update-to-enable-tls-1-1-and-tls-1-2-as-default-secure-protocols-in-wi).

The Windows server that hosts the Azure AD Connect cloud provisioning agent must have TLS 1.2 enabled before you install it.

To enable TLS 1.2, follow these steps.

1. Set the following registry keys:

    ```
    [HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\SecurityProviders\SCHANNEL\Protocols\TLS 1.2]
    [HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\SecurityProviders\SCHANNEL\Protocols\TLS 1.2\Client] "DisabledByDefault"=dword:00000000 "Enabled"=dword:00000001
    [HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\SecurityProviders\SCHANNEL\Protocols\TLS 1.2\Server] "DisabledByDefault"=dword:00000000 "Enabled"=dword:00000001
    [HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\.NETFramework\v4.0.30319] "SchUseStrongCrypto"=dword:00000001
    ```

1. Restart the server.

## Firewall and Proxy requirements
If there's a firewall between your servers and Azure AD, configure the following items:

- Ensure that agents can make *outbound* requests to Azure AD over the following ports:

   | Port number | How it's used |
   | --- | --- |
   | **80** | Downloads the certificate revocation lists (CRLs) while validating the TLS/SSL certificate.  |
   | **443** | Handles all outbound communication with the service. |
   | **8080** (optional) | Agents report their status every 10 minutes over port 8080, if port 443 is unavailable. This status is displayed in the Azure portal. |
 
- If your firewall enforces rules according to the originating users, open these ports for traffic from Windows services that run as a network service.
- If your firewall or proxy allows you to specify safe suffixes, add connections: 

#### [Public Cloud](#tab/public-cloud)


  |URL |How it's used|
  |-----|-----|
  |&#42;.msappproxy.net</br>&#42;.servicebus.windows.net|The agent uses these URLs to communicate with the Azure AD cloud service. |
  |&#42;.microsoftonline.com</br>&#42;.microsoft.com</br>&#42;.msappproxy.com</br>&#42;.windowsazure.com|The agent uses these URLs to communicate with the Azure AD cloud service. |
   |`mscrl.microsoft.com:80` </br>`crl.microsoft.com:80` </br>`ocsp.msocsp.com:80` </br>`www.microsoft.com:80`| The agent uses these URLs to verify certificates.|
   |login.windows.net</br>|The agent uses these URLs during the registration process.



#### [U.S. Government Cloud](#tab/us-government-cloud)

 |URL |How it's used|
 |-----|-----|
 |&#42;.msappproxy.us</br>&#42;.servicebus.usgovcloudapi.net|The agent uses these URLs to communicate with the Azure AD cloud service. |
 |`mscrl.microsoft.us:80` </br>`crl.microsoft.us:80` </br>`ocsp.msocsp.us:80` </br>`www.microsoft.us:80`| The agent uses these URLs to verify certificates.|
 |login.windows.us </br>secure.aadcdn.microsoftonline-p.com </br>&#42;.microsoftonline.us </br>&#42;.microsoftonline-p.us </br>&#42;.msauth.net </br>&#42;.msauthimages.net </br>&#42;.msecnd.net</br>&#42;.msftauth.net </br>&#42;.msftauthimages.net</br>&#42;.phonefactor.net </br>enterpriseregistration.windows.net</br>management.azure.com </br>policykeyservice.dc.ad.msft.net</br>ctldl.windowsupdate.us:80 </br>aadcdn.msftauthimages.us </br>*.microsoft.us </br>msauthimages.us </br>mfstauthimages.us| The agent uses these URLs during the registration process.




- If you are unable to add connections, allow access to the [Azure datacenter IP ranges](https://www.microsoft.com/download/details.aspx?id=41653), which are updated weekly.

---
## NTLM requirement

You should not enable NTLM on the Windows Server that is running the Azure AD Connect Provisioning Agent and if it is enabled you should make sure you disable it. 

## Known limitations

The following are known limitations:

### Delta Synchronization

- Group scope filtering for delta sync does not support more than 50,000 members.
- When you delete a group that's used as part of a group scoping filter, users who are members of the group, don't get deleted. 
- When you rename the OU or group that's in scope, delta sync will not remove the users.

### Provisioning Logs
- Provisioning logs do not clearly differentiate between create and update operations.  You may see a create operation for an update and an update operation for a create.

### Group re-naming or OU re-naming
- If you rename a group or OU in AD that's in scope for a given configuration, the cloud sync job will not be able to recognize the name change in AD. The job won't go into quarantine and will remain healthy.

### Scoping filter
When using OU scoping filter
- You can only sync up to 59 separate OUs or Security Groups for a given configuration. 
- Nested OUs are supported (that is, you **can** sync an OU that has 130 nested OUs, but you **cannot** sync 60 separate OUs in the same configuration). 

### Password Hash Sync
- Using password hash sync with InetOrgPerson is not supported.


## Next steps 

- [What is provisioning?](../what-is-provisioning.md)
- [What is Azure AD Connect cloud sync?](what-is-cloud-sync.md)

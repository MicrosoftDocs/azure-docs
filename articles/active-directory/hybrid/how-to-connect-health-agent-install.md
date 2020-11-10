---
title: Install the Connect Health agents in Azure Active Directory
description: This Azure AD Connect Health page describes the agent installation for Active Directory Federation Services (AD FS) and for Sync.
services: active-directory
documentationcenter: ''
author: zhiweiwangmsft
manager: daveba
editor: curtand
ms.assetid: 1cc8ae90-607d-4925-9c30-6770a4bd1b4e
ms.service: active-directory
ms.subservice: hybrid
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.date: 10/20/2020
ms.topic: how-to
ms.author: billmath
ms.collection: M365-identity-device-management 
ms.custom: devx-track-azurepowershell
---
# Azure AD Connect Health agent installation

Learn how to install and configure the Azure Active Directory (Azure AD) Connect Health agents. To download the agents, see [these instructions](how-to-connect-install-roadmap.md#download-and-install-azure-ad-connect-health-agent).

## Requirements

The following table lists requirements for using Azure AD Connect Health.

| Requirement | Description |
| --- | --- |
| Azure AD Premium is installed. |Azure AD Connect Health is a feature of Azure AD Premium. For more information, see [Getting started with Azure AD Premium](../fundamentals/active-directory-get-started-premium.md). <br /><br />To start a free 30-day trial, see [Start a trial](https://azure.microsoft.com/trial/get-started-active-directory/). |
| You're a global administrator in Azure AD. |By default, only global administrators can install and configure the health agents, access the portal, and do any operations within Azure AD Connect Health. For more information, see [Administering your Azure AD directory](../fundamentals/active-directory-whatis.md). <br /><br /> By using Azure role-based access control (Azure RBAC), you can allow other users in your organization to access Azure AD Connect Health. For more information, see [Azure RBAC for Azure AD Connect Health](how-to-connect-health-operations.md#manage-access-with-azure-rbac). <br /><br />**Important**: You must use a work or school account to install the agents. You can't use a Microsoft account. For more information, see [Sign up for Azure as an organization](../fundamentals/sign-up-organization.md). |
| The Azure AD Connect Health agent is installed on each targeted server. | Health agents must be installed and configured on targeted servers so that they can receive data and provide monitoring and analytics capabilities. <br /><br />For example, to get data from your Active Directory Federation Services (AD FS) infrastructure, the agent must be installed on the AD FS server and Web Application Proxy server. Similarly, to get data from your on-premises AD DS infrastructure, the agent must be installed on the domain controllers. <br /><br /> |
| The Azure service endpoints have outbound connectivity. | During installation and runtime, the agent requires connectivity to Azure AD Connect Health service endpoints. If firewalls block outbound connectivity, add the [outbound connectivity endpoints](how-to-connect-health-agent-install.md#outbound-connectivity-to-the-azure-service-endpoints) to the allow list. |
|Outbound connectivity is based on IP addresses. | For information about firewall filtering based on IP addresses, see the [Azure IP ranges](https://www.microsoft.com/download/details.aspx?id=41653).|
| TLS inspection for outbound traffic is filtered or disabled. | The agent registration step or data upload operations might fail if there's TLS inspection or termination for outbound traffic at the network layer. For more information, see [Set up TLS inspection](/previous-versions/tn-archive/ee796230(v=technet.10)). |
| Firewall ports on the server are running the agent. |The agent requires the following firewall ports to be open so that it can communicate with the Azure AD Connect Health service endpoints: <br /><li>TCP port 443</li><li>TCP port 5671</li> <br />Port 5671 is no longer required for the latest version of the agent. Upgrade to the latest version so that only port 443 is required. For more information, see [Opening ports in the firewall](/previous-versions/sql/sql-server-2008/ms345310(v=sql.100)). |
| If Internet Explorer enhanced security is enabled, allow specified websites.  |If Internet Explorer enhanced security is enabled, then allow the following websites on the server where you install the agent:<br /><li>https:\//login.microsoftonline.com</li><li>https:\//secure.aadcdn.microsoftonline-p.com</li><li>https:\//login.windows.net</li><li>https:\//aadcdn.msftauth.net</li><li>The federation server for your organization trusted by Azure AD (for example, https:\//sts.contoso.com)</li> <br />For more information, see [How to configure Internet Explorer](https://support.microsoft.com/help/815141/internet-explorer-enhanced-security-configuration-changes-the-browsing). If you have a proxy in your network, then see the following note.|
| PowerShell version 4.0 or newer is installed. | <li>Windows Server 2012 includes PowerShell version 3.0. This version is insufficient for the agent.</li><li>Windows Server 2012 R2 and later include a sufficiently recent version of PowerShell.</li>|
|FIPS (Federal Information Processing Standard) is disabled.|FIPS isn't supported by Azure AD Connect Health agents.|

> [!IMPORTANT]
> On Windows Server Core, installing the Azure AD Connect Health agent isn't supported.


> [!NOTE]
> If you have a highly locked-down and restricted environment, you need to add more URLs than the ones the table lists for Internet Explorer enhanced security. Also add URLs that are listed in the table in the next section.  


### Outbound connectivity to the Azure service endpoints

During installation and runtime, the agent needs connectivity to Azure AD Connect Health service endpoints. If firewalls block outbound connectivity, make sure that the following URLs aren't blocked by default. Don't disable security monitoring or inspection of these URLs, but allow them as you would allow other internet traffic. These URLs allow communication with Azure AD Connect Health service endpoints. Later in this article, you'll learn how to [check outbound connectivity by using Test-AzureADConnectHealthConnectivity](#test-connectivity-to-azure-ad-connect-health-service).

| Domain environment | Required Azure service endpoints |
| --- | --- |
| General public | <li>&#42;.blob.core.windows.net </li><li>&#42;.aadconnecthealth.azure.com </li><li>&#42;.servicebus.windows.net - Port: 5671 (This isn't required in the latest version of the agent.)</li><li>&#42;.adhybridhealth.azure.com/</li><li>https:\//management.azure.com </li><li>https:\//policykeyservice.dc.ad.msft.net/</li><li>https:\//login.windows.net</li><li>https:\//login.microsoftonline.com</li><li>https:\//secure.aadcdn.microsoftonline-p.com </li><li>https:\//www.office.com *this endpoint is only used for discovery purposes during registration.</li> |
| Azure Germany | <li>&#42;.blob.core.cloudapi.de </li><li>&#42;.servicebus.cloudapi.de </li> <li>&#42;.aadconnecthealth.microsoftazure.de </li><li>https:\//management.microsoftazure.de </li><li>https:\//policykeyservice.aadcdi.microsoftazure.de </li><li>https:\//login.microsoftonline.de </li><li>https:\//secure.aadcdn.microsoftonline-p.de </li><li>https:\//www.office.de (This endpoint is used only for discovery purposes during registration.)</li> |
| Azure Government | <li>&#42;.blob.core.usgovcloudapi.net </li> <li>&#42;.servicebus.usgovcloudapi.net </li> <li>&#42;.aadconnecthealth.microsoftazure.us </li> <li>https:\//management.usgovcloudapi.net </li><li>https:\//policykeyservice.aadcdi.azure.us </li><li>https:\//login.microsoftonline.us </li><li>https:\//secure.aadcdn.microsoftonline-p.com </li><li>https:\//www.office.com (This endpoint is used only for discovery purposes during registration.)</li> |


## Install the Azure AD Connect Health agent

To download and install the Azure AD Connect health agent: 

* Make sure that you satisfy the [requirements](how-to-connect-health-agent-install.md#requirements) for Azure AD Connect Health.
* Get started using Azure AD Connect Health for AD FS:
    * [Download the Azure AD Connect Health agent for AD FS](https://go.microsoft.com/fwlink/?LinkID=518973).
    * See the [installation instructions](#installing-the-azure-ad-connect-health-agent-for-ad-fs).
* Get started using Azure AD Connect Health for sync:
    * [Download and install the latest version of Azure AD Connect](https://go.microsoft.com/fwlink/?linkid=615771). The health agent for sync is installed as part of the Azure AD Connect installation (version 1.0.9125.0 or later).
* Get started using Azure AD Connect Health for AD DS:
    * [Download the Azure AD Connect Health agent for AD DS](https://go.microsoft.com/fwlink/?LinkID=820540).
    * See the [installation instructions](#installing-the-azure-ad-connect-health-agent-for-ad-ds).

## Install the Azure AD Connect Health agent for AD FS

> [!NOTE]
> AD FS server should be different from your sync server. Don't install the AD FS agent on your sync server.
>

Before you install the agent, make sure your AD FS server host name is unique and is not present in the AD FS service.
To start the agent installation, double-click the *.exe* file that you downloaded. In the first window, select **Install**.

![Screenshot showing the installation window for the Azure AD Connect Health AD FS agent.](./media/how-to-connect-health-agent-install/install1.png)

After the installation finishes, select **Configure Now**.

![Screenshot showing the confirmation message for the Azure AD Connect Health AD FS agent installation.](./media/how-to-connect-health-agent-install/install2.png)

A PowerShell window opens to start the agent registration process. When you're prompted, sign in by using an Azure AD account that has permissions to register the agent. By default, the global admin account has permissions.

![Screenshot showing the sign-in window for Azure AD Connect Health AD FS.](./media/how-to-connect-health-agent-install/install3.png)

After you sign in, PowerShell continues. When it finishes, you can close PowerShell, and the configuration is complete.

At this point, the agent services should start automatically to allow the agent to securely upload the required data to the cloud service.

If you haven't met all of the prerequisites, warnings appear in the PowerShell window. Be sure to complete the [requirements](how-to-connect-health-agent-install.md#requirements) before you install the agent. The following screenshot is an example of these warnings.

![Screenshot showing the Azure AD Connect Health AD FS configure script.](./media/how-to-connect-health-agent-install/install4.png)

To verify that the agent was installed, look for the following services on the server. If you completed the configuration, they should already be running. Otherwise, they are stopped until the configuration is complete.

* Azure AD Connect Health AD FS Diagnostics Service
* Azure AD Connect Health AD FS Insights Service
* Azure AD Connect Health AD FS Monitoring Service

![Screenshot showing Azure AD Connect Health AD FS services.](./media/how-to-connect-health-agent-install/install5.png)


### Enable auditing for AD FS

> [!NOTE]
> This section applies only to AD FS servers. You don't have to follow these steps on the Web Application Proxy servers.
>

The Usage Analytics feature needs to gather and analyze data. So the Azure AD Connect Health agent needs the information in the AD FS audit logs. These logs aren't enabled by default. Use the following procedures to enable AD FS auditing and to locate the AD FS audit logs on your AD FS servers.

#### To enable auditing for AD FS on Windows Server 2012 R2

1. On the Start screen, open **Server Manager**, and then open **Local Security Policy**. Or on the taskbar, open **Server Manager**, and then select **Tools/Local Security Policy**.
2. Go to the *Security Settings\Local Policies\User Rights Assignment* folder. Then double-click **Generate security audits**.
3. On the **Local Security Setting** tab, verify that the AD FS service account is listed. If it's not listed, then select **Add User or Group**, and add it to the list. Then select **OK**.
4. To enable auditing, open a Command Prompt window with elevated privileges. Then run the following command: 
    
    ```auditpol.exe /set /subcategory:{0CCE9222-69AE-11D9-BED3-505054503030} /failure:enable /success:enable```
1. Close **Local Security Policy**.
    >[!Important]
    >The following steps are required only for primary AD FS servers. 
1. Open the **AD FS Management** snap-in. (In **Server Manager**, select **Tools** > **AD FS Management**.)
1. In the **Actions** pane, select **Edit Federation Service Properties**.
1. In the **Federation Service Properties** dialog box, select the **Events** tab.
1. Select the **Success audits and Failure audits** check boxes, and then select **OK**.
1. To enable verbose logging through PowerShell, use this command: `Set-AdfsProperties -LOGLevel Verbose`.

#### To enable auditing for AD FS on Windows Server 2016

1. On the Start screen, open **Server Manager**, and then open **Local Security Policy**. Or on the taskbar, open **Server Manager**, and then select **Tools/Local Security Policy**.
2. Go to the *Security Settings\Local Policies\User Rights Assignment* folder, and then double-click **Generate security audits**.
3. On the **Local Security Setting** tab, verify that the AD FS service account is listed. If it's not listed, then select **Add User or Group**, and add the AD FS service account to the list. Then select **OK**.
4. To enable auditing, open a Command Prompt window with elevated privileges. Then run the following command: 

    ```auditpol.exe /set /subcategory:{0CCE9222-69AE-11D9-BED3-505054503030} /failure:enable /success:enable```
1. Close **Local Security Policy**.
    >[!Important]
    >The following steps are required only for primary AD FS servers.
1. Open the **AD FS Management** snap-in. (In **Server Manager**, select **Tools** > **AD FS Management**.)
1. In the **Actions** pane, select **Edit Federation Service Properties**.
1. In the **Federation Service Properties** dialog box, select the **Events** tab.
1. Select the **Success audits and Failure audits** check boxes, and then select **OK**. Success audits and failure audits should be enabled by default.
1. Open a PowerShell window and run the following command: 

    ```Set-AdfsProperties -AuditLevel Verbose```.

The "basic" audit level is enabled by default. For more information, see [AD FS audit enhancement in Windows Server 2016](/windows-server/identity/ad-fs/technical-reference/auditing-enhancements-to-ad-fs-in-windows-server).


#### To locate the AD FS audit logs

1. Open **Event Viewer**.
2. Go to **Windows Logs**, and then select **Security**.
3. On the right, select **Filter Current Logs**.
4. For **Event sources**, select **AD FS Auditing**.

    For more information about audit logs, see [Operations questions](reference-connect-health-faq.md#operations-questions).

    ![Screenshot showing the Filter Current Log window. "AD FS auditing" is selected in the "Event sources" field.](./media/how-to-connect-health-agent-install/adfsaudit.png)

> [!WARNING]
> A group policy can disable AD FS auditing. If AD FS auditing is disabled, usage analytics about login activities are unavailable. Ensure that you have no group policy that disables AD FS auditing.
>


## Install the Azure AD Connect Health agent for Sync

The Azure AD Connect Health agent for Sync is installed automatically in the latest build of Azure AD Connect. To use Azure AD Connect for sync, you need to [download the latest version of Azure AD Connect](https://www.microsoft.com/download/details.aspx?id=47594) and install it.

To verify the agent has been installed, look for the following services on the server. If you completed the configuration, they should already be running. Otherwise, the services are stopped until the configuration is complete.

* Azure AD Connect Health Sync Insights Service
* Azure AD Connect Health Sync Monitoring Service

![Screenshot showing the running Azure AD Connect Health for Sync services on the server.](./media/how-to-connect-health-agent-install/services.png)

> [!NOTE]
> Remember that you must have Azure AD Premium to use Azure AD Connect Health. If you don't have Azure AD Premium, you can't complete the configuration in the Azure portal. For more information, see the [requirements](how-to-connect-health-agent-install.md#requirements).
>
>

## Manually register Azure AD Connect Health for Sync

If the Azure AD Connect Health for Sync agent registration fails after you successfully install Azure AD Connect, then you can use the following PowerShell command to manually register the agent.

> [!IMPORTANT]
> Use this PowerShell command only if the agent registration fails after you install Azure AD Connect.
>
>

The following PowerShell command is required ONLY when the health agent registration fails even after a successful installation and configuration of Azure AD Connect. The Azure AD Connect Health services will start after the agent has been successfully registered.

You can manually register the Azure AD Connect Health agent for sync using the following PowerShell command:

`Register-AzureADConnectHealthSyncAgent -AttributeFiltering $false -StagingMode $false`

The command takes following parameters:

* AttributeFiltering: $true (default) - if Azure AD Connect is not syncing the default attribute set and has been customized to use a filtered attribute set. $false otherwise.
* StagingMode: $false (default) - if the Azure AD Connect server is NOT in staging mode, $true if the server is configured to be in staging mode.

When prompted for authentication you should use the same global admin account (such as admin@domain.onmicrosoft.com) that was used for configuring Azure AD Connect.

## Install the Azure AD Connect Health agent for AD DS

To start the agent installation, double-click the .exe file that you downloaded. On the first screen, select Install.

![Azure AD Connect Health agent for AD DS install start](./media/how-to-connect-health-agent-install/aadconnect-health-adds-agent-install1.png)

Once the installation is finished, select Configure Now.

![Azure AD Connect Health agent for AD DS install finish](./media/how-to-connect-health-agent-install/aadconnect-health-adds-agent-install2.png)

A command prompt is launched, followed by some PowerShell that executes Register-AzureADConnectHealthADDSAgent. When prompted to sign in to Azure, go ahead and sign in.

![Azure AD Connect Health agent for AD DS configure sign in](./media/how-to-connect-health-agent-install/aadconnect-health-adds-agent-install3.png)

After signing in, PowerShell will continue. Once it completes, you can close PowerShell and the configuration is complete.

At this point, the services should be started automatically allowing the agent to monitor and gather data. If you have not met all the pre-requisites outlined in the previous sections, warnings appear in the PowerShell window. Be sure to complete the [requirements](how-to-connect-health-agent-install.md#requirements) before installing the agent. The following screenshot is an example of these errors.

![Azure AD Connect Health agent for AD DS configure script](./media/how-to-connect-health-agent-install/aadconnect-health-adds-agent-install4.png)

To verify the agent has been installed, look for the following services on the domain controller.

* Azure AD Connect Health AD DS Insights Service
* Azure AD Connect Health AD DS Monitoring Service

If you completed the configuration, these services should already be running. Otherwise, they are stopped until the configuration is complete.

![Azure AD Connect Health agent for AD DS services](./media/how-to-connect-health-agent-install/aadconnect-health-adds-agent-install5.png)

### Quick agent installation in multiple servers

1. Create a user account in Azure AD with a password.
2. Assign the **Owner** role for this local AAD account in Azure AD Connect Health via the portal. Follow the steps [here](how-to-connect-health-operations.md#manage-access-with-azure-rbac). Assign the role to all service instances. 
3. Download the .exe MSI file in local domain controller for installation.
4. Run the following script to registration. Replace the parameters with the new user account created and its password. 

```powershell
AdHealthAddsAgentSetup.exe /quiet
Start-Sleep 30
$userName = "NEWUSER@DOMAIN"
$secpasswd = ConvertTo-SecureString "PASSWORD" -AsPlainText -Force
$myCreds = New-Object System.Management.Automation.PSCredential ($userName, $secpasswd)
import-module "C:\Program Files\Azure Ad Connect Health Adds Agent\PowerShell\AdHealthAdds"
 
Register-AzureADConnectHealthADDSAgent -Credential $myCreds

```

1. Once you are done, you can remove access for the local account by doing one or more of the following: 
    * Remove the role assignment for the local account for AAD Connect Health
    * Rotate the password for the local account. 
    * Disable the AAD local account
    * Delete the AAD local account  

## Agent Registration using PowerShell

After installing the appropriate agent setup.exe, you can perform the agent registration step using the following PowerShell commands depending on the role. Open a PowerShell Window and execute the appropriate command:

```powershell
    Register-AzureADConnectHealthADFSAgent
    Register-AzureADConnectHealthADDSAgent
    Register-AzureADConnectHealthSyncAgent

```

These commands accept "Credential" as a parameter to complete the registration in a non-interactive manner or on a Server-Core machine.
* The Credential can be captured in a PowerShell variable that is passed as a parameter.
* You can provide any Azure AD Identity that has access to register the agents and does NOT have MFA enabled.
* By default Global Admins have access to perform agent registration. You can also allow other less privileged identities to perform this step. Read more about [Azure role-based access control (Azure RBAC)](how-to-connect-health-operations.md#manage-access-with-azure-rbac).

```powershell
    $cred = Get-Credential
    Register-AzureADConnectHealthADFSAgent -Credential $cred

```

## Configure Azure AD Connect Health Agents to use HTTP Proxy

You can configure Azure AD Connect Health Agents to work with an HTTP Proxy.

> [!NOTE]
> * Using “Netsh WinHttp set ProxyServerAddress” is not supported as the agent uses System.Net to make web requests instead of Microsoft Windows HTTP Services.
> * The configured Http Proxy address is used to pass-through encrypted Https messages.
> * Authenticated proxies (using HTTPBasic) are not supported.
>
>

### Change Health Agent Proxy Configuration

You have the following options to configure Azure AD Connect Health Agent to use an HTTP Proxy.

> [!NOTE]
> All Azure AD Connect Health Agent services must be restarted, in order for the proxy settings to be updated. Run the following command:<br />
> Restart-Service AzureADConnectHealth*
>
>

#### Import existing proxy Settings

##### Import from Internet Explorer

Internet Explorer HTTP proxy settings can be imported, to be used by the Azure AD Connect Health Agents. On each of the servers running the Health agent, execute the following PowerShell command:

```powershell
Set-AzureAdConnectHealthProxySettings -ImportFromInternetSettings
```

##### Import from WinHTTP

WinHTTP proxy settings can be imported, to be used by the Azure AD Connect Health Agents. On each of the servers running the Health agent, execute the following PowerShell command:

```powershell
Set-AzureAdConnectHealthProxySettings -ImportFromWinHttp
```

#### Specify Proxy addresses manually

You can manually specify a proxy server on each of the servers running the Health Agent, by executing the following PowerShell command:

```powershell
Set-AzureAdConnectHealthProxySettings -HttpsProxyAddress address:port
```

Example: *Set-AzureAdConnectHealthProxySettings -HttpsProxyAddress myproxyserver: 443*

* "address" can be a DNS resolvable server name or an IPv4 address
* "port" can be omitted. If omitted then 443 is chosen as default port.

#### Clear existing proxy configuration

You can clear the existing proxy configuration by running the following command:

```powershell
Set-AzureAdConnectHealthProxySettings -NoProxy
```

### Read current proxy settings

You can read the currently configured proxy settings by running the following command:

```powershell
Get-AzureAdConnectHealthProxySettings
```

## Test Connectivity to Azure AD Connect Health Service

It is possible that issues may arise that cause the Azure AD Connect Health agent to lose connectivity with the Azure AD Connect Health service. These include network issues, permission issues, or various other reasons.

If the agent is unable to send data to the Azure AD Connect Health service for longer than two hours, it is indicated with the following alert in the portal: "Health Service data is not up to date." You can confirm if the affected Azure AD Connect Health agent is able to upload data to the Azure AD Connect Health service by running the following PowerShell command:

```powershell
Test-AzureADConnectHealthConnectivity -Role ADFS
```

The role parameter currently takes the following values:

* ADFS
* Sync
* ADDS

> [!NOTE]
> To use the connectivity tool, you must first complete the agent registration. If you are not able to complete the agent registration, make sure that you have met all the [requirements](how-to-connect-health-agent-install.md#requirements) for Azure AD Connect Health. This connectivity test is performed by default during agent registration.
>
>

## Related links

* [Azure AD Connect Health](./whatis-azure-ad-connect.md)
* [Azure AD Connect Health Operations](how-to-connect-health-operations.md)
* [Using Azure AD Connect Health with AD FS](how-to-connect-health-adfs.md)
* [Using Azure AD Connect Health for sync](how-to-connect-health-sync.md)
* [Using Azure AD Connect Health with AD DS](how-to-connect-health-adds.md)
* [Azure AD Connect Health FAQ](reference-connect-health-faq.md)
* [Azure AD Connect Health Version History](reference-connect-health-version-history.md)

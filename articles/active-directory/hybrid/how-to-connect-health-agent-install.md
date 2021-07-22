---
title: Install the Connect Health agents in Azure Active Directory
description: This Azure AD Connect Health article describes agent installation for Active Directory Federation Services (AD FS) and for Sync.
services: active-directory
documentationcenter: ''
author: billmath
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

In this article, you'll learn how to install and configure the Azure Active Directory (Azure AD) Connect Health agents. To download the agents, see [these instructions](how-to-connect-install-roadmap.md#download-and-install-azure-ad-connect-health-agent).

## Requirements

The following table lists requirements for using Azure AD Connect Health.

| Requirement | Description |
| --- | --- |
| There is an Azure AD Premium (P1 or P2) Subsciption.  |Azure AD Connect Health is a feature of Azure AD Premium (P1 or P2). For more information, see [Sign up for Azure AD Premium](../fundamentals/active-directory-get-started-premium.md). <br /><br />To start a free 30-day trial, see [Start a trial](https://azure.microsoft.com/trial/get-started-active-directory/). |
| You're a global administrator in Azure AD. |By default, only global administrators can install and configure the health agents, access the portal, and do any operations within Azure AD Connect Health. For more information, see [Administering your Azure AD directory](../fundamentals/active-directory-whatis.md). <br /><br /> By using Azure role-based access control (Azure RBAC), you can allow other users in your organization to access Azure AD Connect Health. For more information, see [Azure RBAC for Azure AD Connect Health](how-to-connect-health-operations.md#manage-access-with-azure-rbac). <br /><br />**Important**: Use a work or school account to install the agents. You can't use a Microsoft account. For more information, see [Sign up for Azure as an organization](../fundamentals/sign-up-organization.md). |
| The Azure AD Connect Health agent is installed on each targeted server. | Health agents must be installed and configured on targeted servers so that they can receive data and provide monitoring and analytics capabilities. <br /><br />For example, to get data from your Active Directory Federation Services (AD FS) infrastructure, you must install the agent on the AD FS server and the Web Application Proxy server. Similarly, to get data from your on-premises Azure AD Domain Services (Azure AD DS) infrastructure, you must install the agent on the domain controllers.  |
| The Azure service endpoints have outbound connectivity. | During installation and runtime, the agent requires connectivity to Azure AD Connect Health service endpoints. If firewalls block outbound connectivity, add the [outbound connectivity endpoints](how-to-connect-health-agent-install.md#outbound-connectivity-to-the-azure-service-endpoints) to the allow list. |
|Outbound connectivity is based on IP addresses. | For information about firewall filtering based on IP addresses, see [Azure IP ranges](https://www.microsoft.com/download/details.aspx?id=56519).|
| TLS inspection for outbound traffic is filtered or disabled. | The agent registration step or data upload operations might fail if there's TLS inspection or termination for outbound traffic at the network layer. For more information, see [Set up TLS inspection](/previous-versions/tn-archive/ee796230(v=technet.10)). |
| Firewall ports on the server are running the agent. |The agent requires the following firewall ports to be open so that it can communicate with the Azure AD Connect Health service endpoints: <br /><li>TCP port 443</li><li>TCP port 5671</li> <br />The latest version of the agent doesn't require port 5671. Upgrade to the latest version so that only port 443 is required. For more information, see [Hybrid identity required ports and protocols](./reference-connect-ports.md). |
| If Internet Explorer enhanced security is enabled, allow specified websites.  |If Internet Explorer enhanced security is enabled, then allow the following websites on the server where you install the agent:<br /><li>https:\//login.microsoftonline.com</li><li>https:\//secure.aadcdn.microsoftonline-p.com</li><li>https:\//login.windows.net</li><li>https:\//aadcdn.msftauth.net</li><li>The federation server for your organization that's trusted by Azure AD (for example, https:\//sts.contoso.com)</li> <br />For more information, see [How to configure Internet Explorer](https://support.microsoft.com/help/815141/internet-explorer-enhanced-security-configuration-changes-the-browsing). If you have a proxy in your network, then see the note that appears at the end of this table.|
| PowerShell version 5.0 or newer is installed. | Windows Server 2016 includes PowerShell version 5.0. 
|FIPS (Federal Information Processing Standard) is disabled.|Azure AD Connect Health agents don't support FIPS.|

> [!IMPORTANT]
> Windows Server Core doesn't support installing the Azure AD Connect Health agent.


> [!NOTE]
> If you have a highly locked-down and restricted environment, you need to add more URLs than the ones the table lists for Internet Explorer enhanced security. Also add URLs that are listed in the table in the next section.  


### Outbound connectivity to the Azure service endpoints

During installation and runtime, the agent needs connectivity to Azure AD Connect Health service endpoints. If firewalls block outbound connectivity, make sure that the URLs in the following  table aren't blocked by default. 

Don't disable security monitoring or inspection of these URLs. Instead, allow them as you would allow other internet traffic. 

These URLs allow communication with Azure AD Connect Health service endpoints. Later in this article, you'll learn how to [check outbound connectivity](#test-connectivity-to-azure-ad-connect-health-service) by using `Test-AzureADConnectHealthConnectivity`.

| Domain environment | Required Azure service endpoints |
| --- | --- |
| General public | <li>&#42;.blob.core.windows.net </li><li>&#42;.aadconnecthealth.azure.com </li><li>&#42;.servicebus.windows.net - Port: 5671 (This endpoint isn't required in the latest version of the agent.)</li><li>&#42;.adhybridhealth.azure.com/</li><li>https:\//management.azure.com </li><li>https:\//policykeyservice.dc.ad.msft.net/</li><li>https:\//login.windows.net</li><li>https:\//login.microsoftonline.com</li><li>https:\//secure.aadcdn.microsoftonline-p.com </li><li>https:\//www.office.com (This endpoint is used only for discovery purposes during registration.)</li> <li>https://aadcdn.msftauth.net</li><li>https://aadcdn.msauth.net</li> |
| Azure Germany | <li>&#42;.blob.core.cloudapi.de </li><li>&#42;.servicebus.cloudapi.de </li> <li>&#42;.aadconnecthealth.microsoftazure.de </li><li>https:\//management.microsoftazure.de </li><li>https:\//policykeyservice.aadcdi.microsoftazure.de </li><li>https:\//login.microsoftonline.de </li><li>https:\//secure.aadcdn.microsoftonline-p.de </li><li>https:\//www.office.de (This endpoint is used only for discovery purposes during registration.)</li> <li>https://aadcdn.msftauth.net</li><li>https://aadcdn.msauth.net</li> |
| Azure Government | <li>&#42;.blob.core.usgovcloudapi.net </li> <li>&#42;.servicebus.usgovcloudapi.net </li> <li>&#42;.aadconnecthealth.microsoftazure.us </li> <li>https:\//management.usgovcloudapi.net </li><li>https:\//policykeyservice.aadcdi.azure.us </li><li>https:\//login.microsoftonline.us </li><li>https:\//secure.aadcdn.microsoftonline-p.com </li><li>https:\//www.office.com (This endpoint is used only for discovery purposes during registration.)</li> <li>https://aadcdn.msftauth.net</li><li>https://aadcdn.msauth.net</li> |


## Install the agent

To download and install the Azure AD Connect Health agent: 

* Make sure that you satisfy the [requirements](how-to-connect-health-agent-install.md#requirements) for Azure AD Connect Health.
* Get started using Azure AD Connect Health for AD FS:
    * [Download the Azure AD Connect Health agent for AD FS](https://go.microsoft.com/fwlink/?LinkID=518973).
    * See the [installation instructions](#install-the-agent-for-ad-fs).
* Get started using Azure AD Connect Health for Sync:
    * [Download and install the latest version of Azure AD Connect](https://go.microsoft.com/fwlink/?linkid=615771). The health agent for Sync is installed as part of the Azure AD Connect installation (version 1.0.9125.0 or later).
* Get started using Azure AD Connect Health for Azure AD DS:
    * [Download the Azure AD Connect Health agent for Azure AD DS](https://go.microsoft.com/fwlink/?LinkID=820540).
    * See the [installation instructions](#install-the-agent-for-azure-ad-ds).

## Install the agent for AD FS

> [!NOTE]
> Your AD FS server should be different from your Sync server. Don't install the AD FS agent on your Sync server.
>

Before you install the agent, make sure your AD FS server host name is unique and isn't present in the AD FS service.
To start the agent installation, double-click the *.exe* file that you downloaded. In the first window, select **Install**.

![Screenshot showing the installation window for the Azure AD Connect Health AD FS agent.](./media/how-to-connect-health-agent-install/install1.png)

After the installation finishes, select **Configure Now**.

![Screenshot showing the confirmation message for the Azure AD Connect Health AD FS agent installation.](./media/how-to-connect-health-agent-install/install2.png)

A PowerShell window opens to start the agent registration process. When you're prompted, sign in by using an Azure AD account that has permissions to register the agent. By default, the global admin account has permissions.

![Screenshot showing the sign-in window for Azure AD Connect Health AD FS.](./media/how-to-connect-health-agent-install/install3.png)

After you sign in, PowerShell continues. When it finishes, you can close PowerShell. The configuration is complete.

At this point, the agent services should start automatically to allow the agent to securely upload the required data to the cloud service.

If you haven't met all of the prerequisites, warnings appear in the PowerShell window. Be sure to complete the [requirements](how-to-connect-health-agent-install.md#requirements) before you install the agent. The following screenshot shows an example of these warnings.

![Screenshot showing the Azure AD Connect Health AD FS configure script.](./media/how-to-connect-health-agent-install/install4.png)

To verify that the agent was installed, look for the following services on the server. If you completed the configuration, they should already be running. Otherwise, they're stopped until the configuration is complete.

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
    
    `auditpol.exe /set /subcategory:{0CCE9222-69AE-11D9-BED3-505054503030} /failure:enable /success:enable`
1. Close **Local Security Policy**.
    >[!Important]
    >The following steps are required only for primary AD FS servers. 
1. Open the **AD FS Management** snap-in. (In **Server Manager**, select **Tools** > **AD FS Management**.)
1. In the **Actions** pane, select **Edit Federation Service Properties**.
1. In the **Federation Service Properties** dialog box, select the **Events** tab.
1. Select the **Success audits and Failure audits** check boxes, and then select **OK**.
1. To enable verbose logging through PowerShell, use the following command: 

    `Set-AdfsProperties -LOGLevel Verbose`

#### To enable auditing for AD FS on Windows Server 2016

1. On the Start screen, open **Server Manager**, and then open **Local Security Policy**. Or on the taskbar, open **Server Manager**, and then select **Tools/Local Security Policy**.
2. Go to the *Security Settings\Local Policies\User Rights Assignment* folder, and then double-click **Generate security audits**.
3. On the **Local Security Setting** tab, verify that the AD FS service account is listed. If it's not listed, then select **Add User or Group**, and add the AD FS service account to the list. Then select **OK**.
4. To enable auditing, open a Command Prompt window with elevated privileges. Then run the following command: 

    `auditpol.exe /set /subcategory:{0CCE9222-69AE-11D9-BED3-505054503030} /failure:enable /success:enable`
1. Close **Local Security Policy**.
    >[!Important]
    >The following steps are required only for primary AD FS servers.
1. Open the **AD FS Management** snap-in. (In **Server Manager**, select **Tools** > **AD FS Management**.)
1. In the **Actions** pane, select **Edit Federation Service Properties**.
1. In the **Federation Service Properties** dialog box, select the **Events** tab.
1. Select the **Success audits and Failure audits** check boxes, and then select **OK**. Success audits and failure audits should be enabled by default.
1. Open a PowerShell window and run the following command: 

    `Set-AdfsProperties -AuditLevel Verbose`

The "basic" audit level is enabled by default. For more information, see [AD FS audit enhancement in Windows Server 2016](/windows-server/identity/ad-fs/technical-reference/auditing-enhancements-to-ad-fs-in-windows-server).


#### To locate the AD FS audit logs

1. Open **Event Viewer**.
2. Go to **Windows Logs**, and then select **Security**.
3. On the right, select **Filter Current Logs**.
4. For **Event sources**, select **AD FS Auditing**.

    For more information about audit logs, see [Operations questions](/azure/active-directory/hybrid/reference-connect-health-faq#operations-questions).

    ![Screenshot showing the Filter Current Log window. In the "Event sources" field, "AD FS auditing" is selected.](./media/how-to-connect-health-agent-install/adfsaudit.png)

> [!WARNING]
> A group policy can disable AD FS auditing. If AD FS auditing is disabled, usage analytics about login activities are unavailable. Ensure that you have no group policy that disables AD FS auditing.
>


## Install the agent for Sync

The Azure AD Connect Health agent for Sync is installed automatically in the latest version of Azure AD Connect. To use Azure AD Connect for Sync, [download the latest version of Azure AD Connect](https://www.microsoft.com/download/details.aspx?id=47594) and install it.

To verify the agent has been installed, look for the following services on the server. If you completed the configuration, the services should already be running. Otherwise, the services are stopped until the configuration is complete.

* Azure AD Connect Health Sync Insights Service
* Azure AD Connect Health Sync Monitoring Service

![Screenshot showing the running Azure AD Connect Health for Sync services on the server.](./media/how-to-connect-health-agent-install/services.png)

> [!NOTE]
> Remember that you must have Azure AD Premium (P1 or P2) to use Azure AD Connect Health. If you don't have Azure AD Premium, you can't complete the configuration in the Azure portal. For more information, see the [requirements](how-to-connect-health-agent-install.md#requirements).
>
>

## Manually register Azure AD Connect Health for Sync

If the Azure AD Connect Health for Sync agent registration fails after you successfully install Azure AD Connect, then you can use a PowerShell command to manually register the agent.

> [!IMPORTANT]
> Use this PowerShell command only if the agent registration fails after you install Azure AD Connect.
>
>

Manually register the Azure AD Connect Health agent for Sync by using the following PowerShell command. The Azure AD Connect Health services will start after the agent has been successfully registered.

`Register-AzureADConnectHealthSyncAgent -AttributeFiltering $true -StagingMode $false`

The command takes following parameters:

* **AttributeFiltering**: `$true` (default) if Azure AD Connect isn't syncing the default attribute set and has been customized to use a filtered attribute set. Otherwise, use `$false`.
* **StagingMode**: `$false` (default) if the Azure AD Connect server is *not* in staging mode. If the server is configured to be in staging mode, use `$true`.

When you're prompted for authentication, use the same global admin account (such as admin@domain.onmicrosoft.com) that you used to configure Azure AD Connect.

## Install the agent for Azure AD DS

To start the agent installation, double-click the *.exe* file that you downloaded. In the first window, select **Install**.

![Screenshot showing the Azure AD Connect Health agent for AD DS installation window.](./media/how-to-connect-health-agent-install/aadconnect-health-adds-agent-install1.png)

When the installation finishes, select **Configure Now**.

![Screenshot showing the window that finishes the installation of the Azure AD Connect Health agent for Azure AD DS.](./media/how-to-connect-health-agent-install/aadconnect-health-adds-agent-install2.png)

A Command Prompt window opens. PowerShell runs `Register-AzureADConnectHealthADDSAgent`. When you're prompted, sign in to Azure.

![Screenshot showing the sign-in window for the Azure AD Connect Health agent for Azure AD DS.](./media/how-to-connect-health-agent-install/aadconnect-health-adds-agent-install3.png)

After you sign in, PowerShell continues. When it finishes, you can close PowerShell. The configuration is complete.

At this point, the services should be started automatically, allowing the agent to monitor and gather data. If you haven't met all of the prerequisites outlined in the previous sections, then warnings appear in the PowerShell window. Be sure to complete the [requirements](how-to-connect-health-agent-install.md#requirements) before you install the agent. The following screenshot shows an example of these warnings.

![Screenshot showing a warning for the Azure AD Connect Health agent for Azure AD DS configuration.](./media/how-to-connect-health-agent-install/aadconnect-health-adds-agent-install4.png)

To verify that the agent is installed, look for the following services on the domain controller:

* Azure AD Connect Health AD DS Insights Service
* Azure AD Connect Health AD DS Monitoring Service

If you completed the configuration, these services should already be running. Otherwise, they're stopped until the configuration finishes.

![Screenshot showing the running services on the domain controller.](./media/how-to-connect-health-agent-install/aadconnect-health-adds-agent-install5.png)

### Quickly install the agent on multiple servers

1. Create a user account in Azure AD. Secure it by using a password.
2. Assign the **Owner** role for this local Azure AD account in Azure AD Connect Health by using the portal. Follow [these steps](how-to-connect-health-operations.md#manage-access-with-azure-rbac). Assign the role to all service instances. 
3. Download the *.exe* MSI file in the local domain controller for the installation.
4. Run the following script. Replace the parameters with your new user account and its password. 

    ```powershell
    AdHealthAddsAgentSetup.exe /quiet
    Start-Sleep 30
    $userName = "NEWUSER@DOMAIN"
    $secpasswd = ConvertTo-SecureString "PASSWORD" -AsPlainText -Force
    $myCreds = New-Object System.Management.Automation.PSCredential ($userName, $secpasswd)
    import-module "C:\Program Files\Azure Ad Connect Health Adds Agent\PowerShell\AdHealthAdds"
     
    Register-AzureADConnectHealthADDSAgent -Credential $myCreds
    
    ```

When you finish, you can remove access for the local account by doing one or more of the following tasks: 
* Remove the role assignment for the local account for Azure AD Connect Health.
* Rotate the password for the local account. 
* Disable the Azure AD local account.
* Delete the Azure AD local account.  

## Register the agent by using PowerShell

After you install the appropriate agent *setup.exe* file, you can register the agent by using the following PowerShell commands, depending on the role. Open a PowerShell window and run the appropriate command:

```powershell
    Register-AzureADConnectHealthADFSAgent
    Register-AzureADConnectHealthADDSAgent
    Register-AzureADConnectHealthSyncAgent

```

> [!NOTE]
> To register against sovereign clouds, use the following command lines:
>
> ```powershell
> Register-AzureADConnectHealthADFSAgent -UserPrincipalName upn-of-the-user
> Register-AzureADConnectHealthADDSAgent -UserPrincipalName upn-of-the-user
> Register-AzureADConnectHealthSyncAgent -UserPrincipalName upn-of-the-user
> ```
>


These commands accept `Credential` as a parameter to complete the registration noninteractively or to complete the registration on a machine that runs Server Core. Keep in mind that:
* You can capture `Credential` in a PowerShell variable that's passed as a parameter.
* You can provide any Azure AD identity that has permissions to register the agents and that does *not* have multifactor authentication enabled.
* By default, global admins have permissions to register the agents. You can also allow less-privileged identities to do this step. For more information, see [Azure RBAC](how-to-connect-health-operations.md#manage-access-with-azure-rbac).

```powershell
    $cred = Get-Credential
    Register-AzureADConnectHealthADFSAgent -Credential $cred

```

## Configure Azure AD Connect Health agents to use HTTP proxy

You can configure Azure AD Connect Health agents to work with an HTTP proxy.

> [!NOTE]
> * `Netsh WinHttp set ProxyServerAddress` is not supported. The agent uses System.Net instead of Windows HTTP Services to make web requests.
> * The configured HTTP proxy address is used to pass-through encrypted HTTPS messages.
> * Authenticated proxies (using HTTPBasic) are not supported.
>
>

### Change the agent proxy configuration

To configure the Azure AD Connect Health agent to use an HTTP proxy, you can:
* Import existing proxy settings.
* Specify proxy addresses manually.
* Clear the existing proxy configuration.

> [!NOTE]
> To update the proxy settings, you must restart all Azure AD Connect Health agent services. Run the following command:
>
> `Restart-Service AzureADConnectHealth*`

#### Import existing proxy settings

You can import Internet Explorer HTTP proxy settings so that the Azure AD Connect Health agents can use the settings. On each of the servers that run the health agent, run the following PowerShell command:

```powershell
Set-AzureAdConnectHealthProxySettings -ImportFromInternetSettings
```

You can import WinHTTP proxy settings so that the Azure AD Connect Health agents can use them. On each of the servers that run the health agent, run the following PowerShell command:

```powershell
Set-AzureAdConnectHealthProxySettings -ImportFromWinHttp
```

#### Specify proxy addresses manually

You can manually specify a proxy server. On each of the servers that run the health agent, run the following PowerShell command:

```powershell
Set-AzureAdConnectHealthProxySettings -HttpsProxyAddress address:port
```

Here's an example: 

`Set-AzureAdConnectHealthProxySettings -HttpsProxyAddress myproxyserver: 443`

In this example:
* The `address` setting can be a DNS-resolvable server name or an IPv4 address.
* You can omit `port`. If you do, then 443 is the default port.

#### Clear the existing proxy configuration

You can clear the existing proxy configuration by running the following command:

```powershell
Set-AzureAdConnectHealthProxySettings -NoProxy
```

### Read current proxy settings

You can read the current proxy settings by running the following command:

```powershell
Get-AzureAdConnectHealthProxySettings
```

## Test connectivity to Azure AD Connect Health service

Occasionally, the Azure AD Connect Health agent can lose connectivity with the Azure AD Connect Health service. Causes of this connectivity loss can include network problems, permission problems, and various other problems.

If the agent can't send data to the Azure AD Connect Health service for longer than two hours, the following alert appears in the portal: "Health Service data is not up to date." 

You can find out whether the affected Azure AD Connect Health agent can upload data to the Azure AD Connect Health service by running the following PowerShell command:

```powershell
Test-AzureADConnectHealthConnectivity -Role ADFS
```

The role parameter currently takes the following values:

* ADFS
* Sync
* ADDS

> [!NOTE]
> To use the connectivity tool, you must first register the agent. If you can't complete the agent registration, make sure that you have met all of the [requirements](how-to-connect-health-agent-install.md#requirements) for Azure AD Connect Health. Connectivity is tested by default during agent registration.
>
>

## Next steps

Check out the following related articles:

* [Azure AD Connect Health](./whatis-azure-ad-connect.md)
* [Azure AD Connect Health operations](how-to-connect-health-operations.md)
* [Using Azure AD Connect Health with AD FS](how-to-connect-health-adfs.md)
* [Using Azure AD Connect Health for Sync](how-to-connect-health-sync.md)
* [Using Azure AD Connect Health with Azure AD DS](how-to-connect-health-adds.md)
* [Azure AD Connect Health FAQ](reference-connect-health-faq.yml)
* [Azure AD Connect Health version history](reference-connect-health-version-history.md)

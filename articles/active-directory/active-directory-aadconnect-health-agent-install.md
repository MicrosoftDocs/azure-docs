<properties
	pageTitle="Azure AD Connect Health Agent installation | Microsoft Azure"
	description="This is the Azure AD Connect Health page that describes the agent installation for AD FS and Sync."
	services="active-directory"
	documentationCenter=""
	authors="karavar"
	manager="stevenpo"
	editor="karavar"/>

<tags
	ms.service="active-directory"
	ms.workload="identity"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="get-started-article"
	ms.date="08/05/2016"
	ms.author="vakarand"/>


# Azure AD Connect Health Agent Installation

This document will walk you through installing and configuring the Azure AD Connect Health Agents. You can download the agents from [here](active-directory-aadconnect-health.md#download-and-install-azure-ad-connect-health-agent).

## 	Requirements
The following table is a list of requirements for using Azure AD Connect Health.

| Requirement | Description|
| ----------- | ---------- |
|Azure AD Premium| Azure AD Connect Health is an Azure AD Premium feature and requires Azure AD Premium. </br></br>For more information see [Getting started with Azure AD Premium](active-directory-get-started-premium.md) </br>To start a free 30 day trial see [Start a trial.](https://azure.microsoft.com/trial/get-started-active-directory/)|
|You must be a global administrator of your Azure AD to get started with Azure AD Connect Health|By default, only the global administrators can install and configure the health agents to get started, access the portal and perform any operations within Azure AD Connect Health. For additional information see [Administering your Azure AD directory](active-directory-administer.md). <br><br> Using Role Based Access Control you can allow access to Azure AD Connect Health to other users in your organization. For more information see [Role Based Access Control for Azure AD Connect Health.](active-directory-aadconnect-health-operations.md#manage-access-with-role-based-access-control) </br></br>**Important:** The account you use when installing the agents must be a work or school account and cannot be a Microsoft account. For more information see  [Sign up for Azure as an organization](sign-up-organization.md)
|The Azure AD Connect Health Agent is installed on each targeted server| Azure AD Connect Health requires that an agent be installed on targeted servers in order to provide the data that is viewed in the portal. </br></br>For example, in order to get data on your AD FS on-premises infrastructure, the agent must be installed on the AD FS servers, AD FS Proxy servers and Web Application Proxy servers. Similarly, to get data on your on-premises AD DS infrastructure, the agent must be installed on the domain controllers. </br></br>**Important:** The account you use when installing the agents must be a work or school account and cannot be a Microsoft account.   For more information see [Sign up for Azure as an organization](sign-up-organization.md)|
|Outbound connectivity to the Azure service endpoints|During installation and runtime, the agent requires connectivity to the Azure AD Connect Health service end points listed below. If you block outbound connectivity make sure that the following are added to the allowed list: </br></br><li>&#42;.blob.core.windows.net </li><li>&#42;.queue.core.windows.net</li><li>adhsprodwus.servicebus.windows.net - Port: 5671 </li><li>https://management.azure.com </li><li>https://s1.adhybridhealth.azure.com/</li><li>https://policykeyservice.dc.ad.msft.net/</li><li>https://login.windows.net</li><li>https://login.microsoftonline.com</li><li>https://secure.aadcdn.microsoftonline-p.com</li> |
|Firewall ports on the server running the agent.| The agent requires the following firewall ports to be open in order for the agent to communicate with the Azure AD Health service endpoints.</br></br><li>TCP/UDP port 443</li><li>TCP/UDP port 5671</li>
|Allow the following websites if IE Enhanced Security is enabled|The following websites need to be allowed if IE Enhanced Security is enabled on the server that is going to have the agent installed.</br></br><li>https://login.microsoftonline.com</li><li>https://secure.aadcdn.microsoftonline-p.com</li><li>https://login.windows.net</li><li>The federation server for your organization trusted by Azure Active Directory. For example: https://sts.contoso.com</li>




## Installing the  Azure AD Connect Health Agent for AD FS
To start the agent installation, double-click on the .exe file that you downloaded. On the first screen, click Install.

![Verify Azure AD Connect Health](./media/active-directory-aadconnect-health-requirements/install1.png)

Once the installation is finished, click Configure Now.

![Verify Azure AD Connect Health](./media/active-directory-aadconnect-health-requirements/install2.png)

This will launch a command prompt followed by some PowerShell that will execute Register-AzureADConnectHealthADFSAgent. You will be prompted to sign in to Azure. Go ahead and sign in.

![Verify Azure AD Connect Health](./media/active-directory-aadconnect-health-requirements/install3.png)


After signing in, PowerShell will continue. Once it completes you can close PowerShell and the configuration is complete.

At this point, the services should be started automatically and the agent will be now monitoring and gathering data.  Be aware that you will see warnings in the PowerShell window if you have not met all of the pre-requisites that were outlined in the previous sections. Be sure to complete the requirements [here](active-directory-aadconnect-health-agent-install.md#requirements) prior to installing the agent. The screenshot below is an example of these errors.

![Verify Azure AD Connect Health](./media/active-directory-aadconnect-health-requirements/install4.png)

To verify the agent has been installed, open services and look for the following. These services should be running if you completed the configuration. Otherwise, they will not start until the configuration is complete.

- Azure AD Connect Health AD FS Diagnostics Service
- Azure AD Connect Health AD FS Insights Service
- Azure AD Connect Health AD FS Monitoring Service

![Verify Azure AD Connect Health](./media/active-directory-aadconnect-health-requirements/install5.png)


### Agent installation on Windows Server 2008 R2 Servers

For Windows Server 2008 R2 servers do the following:

1. Ensure that the server is running at Service Pack 1 or higher.
1. Turn off IE ESC for agent installation:
1. Install Windows PowerShell 4.0 on each of the servers prior to installing the AD Health agent.  To install Windows PowerShell 4.0:
 - Install [Microsoft .NET Framework 4.5](https://www.microsoft.com/download/details.aspx?id=40779) using the following link to download the offline installer.
 - Install PowerShell ISE (From Windows Features)
 - Install the [Windows Management Framework 4.0.](https://www.microsoft.com/download/details.aspx?id=40855)
 - Install Internet Explorer version 10 or above on the server. This is required by the Health Service to authenticate you using your Azure Admin credentials.
1. For additional information on installing Windows PowerShell 4.0 on Windows Server 2008 R2 see the wiki article [here](http://social.technet.microsoft.com/wiki/contents/articles/20623.step-by-step-upgrading-the-powershell-version-4-on-2008-r2.aspx).

### Enable Auditing for AD FS

In order for the Usage Analytics feature to gather and analyze data, the Azure AD Connect Health agent needs the information in the AD FS Audit Logs. These logs are not enabled by default. This only applies to AD FS federation servers. You do not need to enable auditing on AD FS Proxy servers or Web Application Proxy servers. Use the following procedures to enable AD FS auditing and to locate the AD FS audit logs.

#### To enable auditing for AD FS 2.0

1. Click **Start**, point to **Programs**, point to **Administrative Tools**, and then click **Local Security Policy**.
2. Navigate to the **Security Settings\Local Policies\User Rights Management** folder, and then double-click Generate security audits.
3. On the **Local Security Setting** tab, verify that the AD FS 2.0 service account is listed. If it is not present, click **Add User or Group** and add it to the list, and then click **OK**.
4. Open a command prompt with elevated privileges and run the following command to enable auditing.<code>auditpol.exe /set /subcategory:"Application Generated" /failure:enable /success:enable</code>
5. Close Local Security Policy, and then open the Management snap-in.  To open the Management snap-in, click **Start**, point to **Programs**, point to **Administrative Tools**, and then click AD FS 2.0 Management.
6. In the Actions pane, click Edit Federation Service Properties.
7. In the **Federation Service Properties** dialog box, click the **Events** tab.
8. Select the **Success audits** and **Failure audits** check boxes.
9. Click **OK**.

#### To enable auditing for AD FS on Windows Server 2012 R2

1. Open **Local Security Policy** by opening **Server Manager** on the Start screen, or Server Manager in the taskbar on the desktop, then click **Tools/Local Security Policy**.
2. Navigate to the **Security Settings\Local Policies\User Rights Assignment** folder, and then double-click **Generate security audits**.
3. On the **Local Security Setting** tab, verify that the AD FS service account is listed. If it is not present, click **Add User or Group** and add it to the list, and then click **OK**.
4. Open a command prompt with elevated privileges and run the following command to enable auditing: <code>auditpol.exe /set /subcategory:"Application Generated" /failure:enable /success:enable.</code>
5. Close **Local Security Policy**, and then open the **AD FS Management** snap-in (in Server Manager, click Tools, and then select AD FS Management).
6. In the Actions pane, click **Edit Federation Service Properties**.
7. In the Federation Service Properties dialog box, click the **Events** tab.
8. Select the **Success audits and Failure audits** check boxes and then click **OK**.






#### To locate the AD FS audit logs


1. Open **Event Viewer**.
2. Go to Windows Logs and select **Security**.
3. On the right, click **Filter Current Logs**.
4. Under Event Source, select **AD FS Auditing**.

![AD FS audit logs](./media/active-directory-aadconnect-health-requirements/adfsaudit.png)

> [AZURE.WARNING] If you have a group policy that is disabling AD FS auditing then the Azure AD Connect Health Agent will not be able to collect information. Ensure that you don’t have a group policy that may be disabling auditing.

[//]: # (Start of Agent Proxy Configuration Section)

## Installing the Azure AD Connect Health agent for sync
The Azure AD Connect Health agent for sync is installed automatically in the latest build of Azure AD Connect.  To use Azure AD Connect for sync you will need to download the latest version of Azure AD Connect and install it.  You can download the latest version [here](http://www.microsoft.com/download/details.aspx?id=47594).

To verify the agent has been installed, open services and look for the following. These services should be running if you completed the configuration. Otherwise, they will not start until the configuration is complete.

- Azure AD Connect Health Sync Insights Service
- Azure AD Connect Health Sync Monitoring Service

![Verify Azure AD Connect Health for Sync](./media/active-directory-aadconnect-health-sync/services.png)

> [AZURE.NOTE] Remember that using Azure AD Connect Health requires Azure AD Premium.  If you do not have Azure AD Premium you will not be able to complete the configuration in the Azure portal.  For more information see the requirements [here](active-directory-aadconnect-health-agent-install.md#requirements).


## Manual Azure AD Connect Health for Sync registration
If the Azure AD Connect Health for Sync agent registration fails after successfully installing Azure AD Connect, you can use the following PowerShell command to manually register the agent.

>[AZURE.IMPORTANT] Using this PowerShell command is only required if the agent registration fails after installing Azure AD Connect.

The below PowerShell command is required ONLY when the health agent registration fails even after a successful installation and configuration of Azure AD Connect. In such cases Azure AD Connect Health services will NOT start until agent has been successfully registered.

You can manually register the Azure AD Connect Health agent for sync using the following PowerShell command:

`Register-AzureADConnectHealthSyncAgent -AttributeFiltering $false -StagingMode $false`

The command takes following parameters:

- AttributeFiltering : $true (default) - if Azure AD Connect is not syncing the default attribute set and has been customized to use a filtered attribute set. $false otherwise.
- StagingMode : $false (default) - if the Azure AD Connect server is NOT in staging mode, $true if the server is configured to be in staging mode.

When prompted for authentication you should use the same global admin account (such as admin@domain.onmicrosoft.com) that was used for configuring Azure AD Connect.

## Installing the  Azure AD Connect Health Agent for AD DS
To start the agent installation, double-click on the .exe file that you downloaded. On the first screen, click Install.

![Verify Azure AD Connect Health](./media/active-directory-aadconnect-health/aadconnect-health-adds-agent-install1.png)

Once the installation is finished, click Configure Now.

![Verify Azure AD Connect Health](./media/active-directory-aadconnect-health/aadconnect-health-adds-agent-install2.png)

This will launch a command prompt followed by some PowerShell that will execute Register-AzureADConnectHealthADDSAgent. You will be prompted to sign in to Azure. Go ahead and sign in.

![Verify Azure AD Connect Health](./media/active-directory-aadconnect-health/aadconnect-health-adds-agent-install3.png)

After signing in, PowerShell will continue. Once it completes you can close PowerShell and the configuration is complete.

At this point, the services should be started automatically and the agent will be now monitoring and gathering data. The screenshot below is an example of the output. Be aware that you will see warnings in the PowerShell window if you have not met all of the pre-requisites that were outlined in the previous sections. Be sure to complete the requirements [here](active-directory-aadconnect-health-agent-install.md#requirements) prior to installing the agent. 

![Verify Azure AD Connect Health for AD DS](./media/active-directory-aadconnect-health/aadconnect-health-adds-agent-install4.png)

To verify the agent has been installed, open services and look for the following:

- Azure AD Connect Health AD DS Insights Service
- Azure AD Connect Health AD DS Monitoring Service

These two services will not start until the configuration is complete.

![Verify Azure AD Connect Health](./media/active-directory-aadconnect-health/aadconnect-health-adds-agent-install5.png)

## Installing the Azure AD Connect Health Agent for AD DS on Server Core. 
After installing the .exe file, you can complete the registration process by using the following PowerShell command:

`Register-AzureADConnectHealthADDSAgent -Credentials $cred

## Configure Azure AD Connect Health Agents to use HTTP Proxy
You can configure Azure AD Connect Health Agents to work with an HTTP Proxy.

>[AZURE.NOTE]
- Using “Netsh WinHttp set ProxyServerAddress” will not work as the agent uses System.Net to make web requests instead of Microsoft Windows HTTP Services.
- The configured Http Proxy address will be used to pass-through encrypted Https messages.
- Authenticated proxies (using HTTPBasic) are not supported.

### Change Health Agent Proxy Configuration
You have the following options to configure Azure AD Connect Health Agent to use an HTTP Proxy.

>[AZURE.NOTE] You must restart all Azure AD Connect Health Agent services for the proxy settings to be updated. Run the following command:<br>
    Restart-Service AdHealth*

#### Import existing proxy Settings

##### Import from Internet Explorer
You can import your Internet Explorer HTTP proxy settings and use them for Azure AD Connect Health Agents by executing the following PowerShell command on each server running the Health Agent.

	Set-AzureAdConnectHealthProxySettings -ImportFromInternetSettings

##### Import from WinHTTP
You can import you WinHTTP proxy settings by executing the following PowerShell command on each server running the Health Agent.

	Set-AzureAdConnectHealthProxySettings -ImportFromWinHttp

#### Specify Proxy addresses manually
You can specify a proxy server manually by executing the following PowerShell command on each server running the Health Agent.

	Set-AzureAdConnectHealthProxySettings -HttpsProxyAddress address:port

Example: *Set-AzureAdConnectHealthProxySettings -HttpsProxyAddress myproxyserver:443*

- "address" can be a DNS resolvable server name or an IPv4 address
- "port" can be omitted. If omitted then 443 is chosen as default port.

#### Clear existing proxy configuration
You can clear the existing proxy configuration by running the following command.

	Set-AzureAdConnectHealthProxySettings -NoProxy


### Read current proxy settings
You can use the following command to read the currently configured proxy settings.

	Get-AzureAdConnectHealthProxySettings


## Test Connectivity to Azure AD Connect Health Service
It is possible that issues may arise that cause the Azure AD Connect Health agent to lose connectivity with the Azure AD Connect Health service.  These include network issues, permission issues, or various other reasons.

If the agent is unable to send data to the Azure AD Connect Health service for more than 2 hours, you will see an Alert indicating "Health Service data is not up to date."  Should this occur you can now test whether or not the Azure AD Connect Health agents are able to upload data to the Azure AD Connect Health service by running the following PowerShell command from the machine whose agent is having the issue.

    Test-AzureADConnectHealthConnectivity -Role Adfs

The role parameter currently takes the following values:

- Adfs
- Sync
- ADDS

You can use the -ShowResults flag in the command to view detailed logs.  Use the following example:

    Test-AzureADConnectHealthConnectivity -Role Sync -ShowResult

>[AZURE.NOTE]In order to use the connectivity tool, you must first complete the agent registration.  If you are not able to complete the agent registration, make sure that you have met all of the [requirements](active-directory-aadconnect-health-agent-install.md#requirements) for Azure AD Connect Health.  This connectivity test is performed by default during agent registration.



## Related links

* [Azure AD Connect Health](active-directory-aadconnect-health.md)
* [Azure AD Connect Health Operations](active-directory-aadconnect-health-operations.md)
* [Using Azure AD Connect Health with AD FS](active-directory-aadconnect-health-adfs.md)
* [Using Azure AD Connect Health for sync](active-directory-aadconnect-health-sync.md)
* [Using Azure AD Connect Health with AD DS](active-directory-aadconnect-health-adds.md)
* [Azure AD Connect Health FAQ](active-directory-aadconnect-health-faq.md)
* [Azure AD Connect Health Version History](active-directory-aadconnect-health-version-history.md)

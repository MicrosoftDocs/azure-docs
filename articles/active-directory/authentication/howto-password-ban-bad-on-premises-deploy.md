---
title: Deploy Azure AD password protection - Azure Active Directory
description: Deploy Azure AD password protection to ban bad passwords on-premises

services: active-directory
ms.service: active-directory
ms.subservice: authentication
ms.topic: article
ms.date: 02/01/2019

ms.author: joflore
author: MicrosoftGuyJFlo
manager: daveba
ms.reviewer: jsimmons
ms.collection: M365-identity-device-management
---

# Deploy Azure AD password protection

Now that you understand [how to enforce Azure AD password protection for Windows Server Active Directory](concept-password-ban-bad-on-premises.md), the next step is to plan and execute your deployment.

## Deployment strategy

We recommend that you start deployments in audit mode. Audit mode is the default initial setting, where passwords can continue to be set. Passwords that would be blocked are recorded in the event log. After you deploy the proxy servers and DC Agents in audit mode, you should monitor the impact that the password policy will have on users and the environment when the policy is enforced.

During the audit stage, many organizations find out that:

* They need to improve existing operational processes to use more secure passwords.
* Users often use unsecure passwords.
* They need to inform users about the upcoming change in security enforcement, possible impact on them, and how to choose more secure passwords.

It is also possible for stronger password validation to affect your existing Active Directory domain controller deployment automation. We recommend that at least one DC promotion and one DC demotion happen during the audit period evaluation in order to help uncover such issues in advance.  For more information, see:

* [Ntdsutil.exe is unable to set a weak Directory Services Repair Mode password](howto-password-ban-bad-on-premises-troubleshoot.md##ntdsutilexe-fails-to-set-a-weak-dsrm-password)
* [Domain controller replica promotion fails because of a weak Directory Services Repair Mode password](howto-password-ban-bad-on-premises-troubleshoot.md#domain-controller-replica-promotion-fails-because-of-a-weak-dsrm-password)
* [Domain controller demotion fails due to a weak local Administrator password](howto-password-ban-bad-on-premises-troubleshoot.md#domain-controller-demotion-fails-due-to-a-weak-local-administrator-password)

After the feature has been running in audit mode for a reasonable period, you can switch the configuration from *Audit* to *Enforce* to require more secure passwords. Focused monitoring during this time is a good idea.

## Deployment requirements

* Licensing requirements for Azure AD password protection can be found in the article [Eliminate bad passwords in your organization](concept-password-ban-bad.md#license-requirements).
* All machines where the Azure AD Password Protection DC Agent software will be installed must run Windows Server 2012 or later. This requirement does not imply that the Active Directory domain or forest must also be at Windows Server 2012 domain or forest functional level. As mentioned in [Design Principles](concept-password-ban-bad-on-premises.md#design-principles), there is no minimum DFL or FFL required for either the DC agent or proxy software to run.
* All machines that get the DC agent service installed must have .NET 4.5 installed.
* All machines where the Azure AD Password Protection Proxy service will be installed  must run Windows Server 2012 R2 or later.
   > [!NOTE]
   > Proxy service deployment is a mandatory requirement for deploying Azure AD password protection even though the domain controller may have outbound direct internet connectivity. 
   >
* All machines where the Azure AD Password Protection Proxy service will be installed must have .NET 4.7 installed.
  .NET 4.7 should already be installed on a fully updated Windows Server. If necessary, download and run the installer found at [The .NET Framework 4.7 offline installer for Windows](https://support.microsoft.com/help/3186497/the-net-framework-4-7-offline-installer-for-windows).
* All machines, including domain controllers, that have Azure AD password protection components installed must have the Universal C Runtime installed. You can get the runtime by making sure you have all updates from Windows Update. Or you can get it in an OS-specific update package. For more information, see [Update for Universal C Runtime in Windows](https://support.microsoft.com/help/2999226/update-for-uniersal-c-runtime-in-windows).
* Network connectivity must exist between at least one domain controller in each domain and at least one server that hosts the proxy service for password protection. This connectivity must allow the domain controller to access RPC endpoint mapper port 135 and the RPC server port on the proxy service. By default, the RPC server port is a dynamic RPC port, but it can be configured to [use a static port](#static).
* All machines where the Azure AD Password Protection Proxy service will be installed must have network access to the following endpoints:

    |**Endpoint**|**Purpose**|
    | --- | --- |
    |`https://login.microsoftonline.com`|Authentication requests|
    |`https://enterpriseregistration.windows.net`|Azure AD password protection functionality|
 
* Microsoft Azure AD Connect Agent Updater prerequisites

  The Microsoft Azure AD Connect Agent Updater service is installed side by side with the Azure AD Password Protection Proxy service. Additional configuration is required in order for the Microsoft Azure AD Connect Agent Updater service to be able to function:

  If your environment uses an http proxy server, you must follow the guidelines specified in [Work with existing on-premises proxy servers](https://docs.microsoft.com/azure/active-directory/manage-apps/application-proxy-configure-connectors-with-proxy-servers).

  The Microsoft Azure AD Connect Agent Updater service also requires the TLS 1.2 steps specified in [TLS requirements](https://docs.microsoft.com/azure/active-directory/manage-apps/application-proxy-add-on-premises-application#tls-requirements).

  Network access must be enabled for the set of ports and urls specified in the [Application Proxy environment setup procedures](https://docs.microsoft.com/azure/active-directory/manage-apps/application-proxy-add-on-premises-application#prepare-your-on-premises-environment).

  > [!WARNING]
  > Azure AD Password Protection Proxy and Application Proxy install different versions of the Microsoft Azure AD Connect Agent Updater service, which is why the instructions refer to Application Proxy content. These different versions are incompatible when installed side by side, so it is not recommended to install Azure AD Password Protection Proxy and Application Proxy side by side on the same machine.

* All machines that host the proxy service for password protection must be configured to grant domain controllers the ability to log on to the proxy service. This ability is controlled via the "Access this computer from the network" privilege assignment.
* All machines that host the proxy service for password protection must be configured to allow outbound TLS 1.2 HTTP traffic.
* A Global Administrator account to register the proxy service for password protection and forest with Azure AD.
* An account that has Active Directory domain administrator privileges in the forest root domain to register the Windows Server Active Directory forest with Azure AD.
* Any Active Directory domain that runs the DC Agent service software must use Distributed File System Replication (DFSR) for sysvol replication.

  If your domain is not already using DFSR, you MUST migrate it to use DFSR before installing Azure AD Password Protection. For more information, see the following link:

  [SYSVOL Replication Migration Guide: FRS to DFS Replication](https://docs.microsoft.com/previous-versions/windows/it-pro/windows-server-2008-R2-and-2008/dd640019(v=ws.10))

  > [!WARNING]
  > The Azure AD Password Protection DC Agent software will currently install on domain controllers in domains that are still using FRS (the predecessor technology to DFSR) for sysvol replication, but the software will NOT work properly in this environment. Additional negative side-effects include individual files failing to replicate, and sysvol restore procedures appearing to succeed but silently failing to replicate all files. You should migrate your domain to use DFSR as soon as possible, both for DFSR's inherent benefits and also to unblock the deployment of Azure AD Password Protection. Future versions of the software will be automatically disabled when running in a domain that is still using FRS.

* The Key Distribution Service must be enabled on all domain controllers in the domain that run Windows Server 2012. By default, this service is enabled via manual trigger start.

## Single-forest deployment

The following diagram shows how the basic components of Azure AD password protection work together in an on-premises Active Directory environment.

![How Azure AD password protection components work together](./media/concept-password-ban-bad-on-premises/azure-ad-password-protection.png)

It's a good idea to review how the software works before you deploy it. See [Conceptual overview of Azure AD password protection](concept-password-ban-bad-on-premises.md).

### Download the software

There are two required installers for Azure AD password protection. They're available from the [Microsoft Download Center](https://www.microsoft.com/download/details.aspx?id=57071).

### Install and configure the proxy service for password protection

1. Choose one or more servers to host the proxy service for password protection.
   * Each such service can only provide password policies for a single forest. The host machine must be joined to a domain in that forest. Root and child domains are both supported. You need network connectivity between at least one DC in each domain of the forest and the password protection machine.
   * You can run the proxy service on a domain controller for testing. But that domain controller then requires internet connectivity, which can be a security concern. We recommend this configuration for testing only.
   * We recommend at least two proxy servers for redundancy. See [High availability](howto-password-ban-bad-on-premises-deploy.md#high-availability).

1. Install the  Azure AD Password Protection Proxy service using the `AzureADPasswordProtectionProxySetup.exe` software installer.
   * The software installation does not require a reboot. The software installation may be automated using standard MSI procedures, for example:

      `AzureADPasswordProtectionProxySetup.exe /quiet`

      > [!NOTE]
      > The Windows Firewall service must be running before you install the AzureADPasswordProtectionProxySetup.msi package to avoid an installation error. If Windows Firewall is configured to not run, the workaround is to temporarily enable and run the Firewall service during the installation. The proxy software has no specific dependency on Windows Firewall after installation. If you're using a third-party firewall, it must still be configured to satisfy the deployment requirements. These include allowing inbound access to port 135 and the proxy RPC server port. See [Deployment requirements](howto-password-ban-bad-on-premises-deploy.md#deployment-requirements).

1. Open a PowerShell window as an administrator.
   * The password protection proxy software includes a new PowerShell module, *AzureADPasswordProtection*. The following steps run various cmdlets from this PowerShell module. Import the new module as follows:

      ```powershell
      Import-Module AzureADPasswordProtection
      ```

   * To check that the service is running, use the following PowerShell command:

      `Get-Service AzureADPasswordProtectionProxy | fl`.

     The result should show a **Status** of "Running."

1. Register the proxy.
   * After step 3 is completed, the proxy service is running on the machine. But the service doesn't yet have the necessary credentials to communicate with Azure AD. Registration with Azure AD is required:

     `Register-AzureADPasswordProtectionProxy`

     This cmdlet requires global administrator credentials for your Azure tenant. You also need on-premises Active Directory domain administrator privileges in the forest root domain. After this command succeeds once for a proxy service, additional invocations of it will succeed but are unnecessary.

      The `Register-AzureADPasswordProtectionProxy` cmdlet supports the following three authentication modes.

     * Interactive authentication mode:

        ```powershell
        Register-AzureADPasswordProtectionProxy -AccountUpn 'yourglobaladmin@yourtenant.onmicrosoft.com'
        ```

        > [!NOTE]
        > This mode doesn't work on Server Core operating systems. Instead, use one of the following authentication modes. Also, this mode might fail if Internet Explorer Enhanced Security Configuration is enabled. The workaround is to disable that Configuration, register the proxy, and then re-enable it.

     * Device-code authentication mode:

        ```powershell
        Register-AzureADPasswordProtectionProxy -AccountUpn 'yourglobaladmin@yourtenant.onmicrosoft.com' -AuthenticateUsingDeviceCode
        To sign in, use a web browser to open the page https://microsoft.com/devicelogin and enter the code XYZABC123 to authenticate.
        ```

        You then complete authentication by following the displayed instructions on a different device.

     * Silent (password-based) authentication mode:

        ```powershell
        $globalAdminCredentials = Get-Credential
        Register-AzureADPasswordProtectionProxy -AzureCredential $globalAdminCredentials
        ```

        > [!NOTE]
        > This mode fails if Azure Multi-Factor Authentication is required for your account. In that case, use one of the previous two authentication modes, or instead use a different account that does not require MFA.
        >
        > You may also see MFA required if Azure Device Registration (which is used under the covers by Azure AD Password Protection) has been configured to globally require MFA. To workaround this you may use a different account that supports MFA with one of the previous two authentication modes, or you may also temporarily relax the Azure Device Registration MFA requirement. To do this, go to the Azure management portal, then go to Azure Active Directory, then Devices, then Device Settings, then set "Require Multi-Factor Auth to join devices" to No. Be sure to reconfigure this setting back to Yes once registration is complete.
        >
        > We recommend that MFA requirements be bypassed for test purposes only.

       You don't currently have to specify the *-ForestCredential* parameter, which is reserved for future functionality.

   Registration of the proxy service for password protection is necessary only once in the lifetime of the service. After that, the proxy service will automatically perform any other necessary maintenance.

   > [!TIP]
   > There might be a noticeable delay before completion the first time that this cmdlet is run for a specific Azure tenant. Unless a failure is reported, don't worry about this delay.

1. Register the forest.
   * You must initialize the on-premises Active Directory forest with the necessary credentials to communicate with Azure by using the `Register-AzureADPasswordProtectionForest` PowerShell cmdlet. The cmdlet requires global administrator credentials for your Azure tenant. It also requires on-premises Active Directory Enterprise Administrator privileges. This step is run once per forest.

      The `Register-AzureADPasswordProtectionForest` cmdlet supports the following three authentication modes.

     * Interactive authentication mode:

        ```powershell
        Register-AzureADPasswordProtectionForest -AccountUpn 'yourglobaladmin@yourtenant.onmicrosoft.com'
        ```

        > [!NOTE]
        > This mode won't work on Server Core operating systems. Instead use one of the following two authentication modes. Also, this mode might fail if Internet Explorer Enhanced Security Configuration is enabled. The workaround is to disable that Configuration, register the forest, and then re-enable it.  

     * Device-code authentication mode:

        ```powershell
        Register-AzureADPasswordProtectionForest -AccountUpn 'yourglobaladmin@yourtenant.onmicrosoft.com' -AuthenticateUsingDeviceCode
        To sign in, use a web browser to open the page https://microsoft.com/devicelogin and enter the code XYZABC123 to authenticate.
        ```

        You then complete authentication by following the displayed instructions on a different device.

     * Silent (password-based) authentication mode:

        ```powershell
        $globalAdminCredentials = Get-Credential
        Register-AzureADPasswordProtectionForest -AzureCredential $globalAdminCredentials
        ```

        > [!NOTE]
        > This mode fails if Azure Multi-Factor Authentication is required for your account. In that case, use one of the previous two authentication modes, or instead use a different account that does not require MFA.
        >
        > You may also see MFA required if Azure Device Registration (which is used under the covers by Azure AD Password Protection) has been configured to globally require MFA. To workaround this you may use a different account that supports MFA with one of the previous two authentication modes, or you may also temporarily relax the Azure Device Registration MFA requirement. To do this, go to the Azure management portal, then go to Azure Active Directory, then Devices, then Device Settings, then set "Require Multi-Factor Auth to join devices" to No. Be sure to reconfigure this setting back to Yes once registration is complete.
        >
        > We recommend that MFA requirements be bypassed for test purposes only.

       These examples only succeed if the currently signed-in user is also an Active Directory domain administrator for the root domain. If this isn't the case, you can supply alternative domain credentials via the *-ForestCredential* parameter.

   > [!NOTE]
   > If multiple proxy servers are installed in your environment, it doesn't matter which proxy server you use to register the forest.
   >
   > [!TIP]
   > There might be a noticeable delay before completion the first time that this cmdlet is run for a specific Azure tenant. Unless a failure is reported, don't worry about this delay.

   Registration of the Active Directory forest is necessary only once in the lifetime of the forest. After that, the Domain Controller Agents in the forest will automatically perform any other necessary maintenance. After `Register-AzureADPasswordProtectionForest` runs successfully for a forest, additional invocations of the cmdlet succeed but are unnecessary.

   For `Register-AzureADPasswordProtectionForest` to succeed, at least one domain controller running Windows Server 2012 or later must be available in the proxy server's domain. The DC Agent software does not have to be installed on any domain controllers prior to this step.

1. Configure the proxy service for password protection to communicate through an HTTP proxy.

   If your environment requires the use of a specific HTTP proxy to communicate with Azure, use this method: Create a *AzureADPasswordProtectionProxy.exe.config* file in the %ProgramFiles%\Azure AD Password Protection Proxy\Service folder. Include the following content:

      ```xml
      <configuration>
        <system.net>
          <defaultProxy enabled="true">
           <proxy bypassonlocal="true"
               proxyaddress="http://yourhttpproxy.com:8080" />
          </defaultProxy>
        </system.net>
      </configuration>
      ```

   If your HTTP proxy requires authentication, add the *useDefaultCredentials* tag:

      ```xml
      <configuration>
        <system.net>
          <defaultProxy enabled="true" useDefaultCredentials="true">
           <proxy bypassonlocal="true"
               proxyaddress="http://yourhttpproxy.com:8080" />
          </defaultProxy>
        </system.net>
      </configuration>
      ```

   In both cases, replace `http://yourhttpproxy.com:8080` with the address and port of your specific HTTP proxy server.

   If your HTTP proxy is configured to use an authorization policy, you must grant access to the Active Directory computer account of the machine that hosts the proxy service for password protection.

   We recommend that you stop and restart the proxy service after you create or update the *AzureADPasswordProtectionProxy.exe.config* file.

   The proxy service doesn't support the use of specific credentials for connecting to an HTTP proxy.

1. Optional: Configure the proxy service for password protection to listen on a specific port.
   * The DC Agent software for password protection on the domain controllers uses RPC over TCP to communicate with the proxy service. By default, the proxy service listens on any available dynamic RPC endpoint. But you can configure the service to listen on a specific TCP port, if this is necessary because of networking topology or firewall requirements in your environment.
      * <a id="static" /></a>To configure the service to run under a static port, use the `Set-AzureADPasswordProtectionProxyConfiguration` cmdlet.

         ```powershell
         Set-AzureADPasswordProtectionProxyConfiguration –StaticPort <portnumber>
         ```

         > [!WARNING]
         > You must stop and restart the service for these changes to take effect.

      * To configure the service to run under a dynamic port, use the same procedure but set *StaticPort* back to zero:

         ```powershell
         Set-AzureADPasswordProtectionProxyConfiguration –StaticPort 0
         ```

         > [!WARNING]
         > You must stop and restart the service for these changes to take effect.

   > [!NOTE]
   > The proxy service for password protection requires a manual restart after any change in port configuration. But you don't have to restart the DC Agent service software on domain controllers after you make these configuration changes.

   * To query for the current configuration of the service, use the `Get-AzureADPasswordProtectionProxyConfiguration` cmdlet:

      ```powershell
      Get-AzureADPasswordProtectionProxyConfiguration | fl

      ServiceName : AzureADPasswordProtectionProxy
      DisplayName : Azure AD password protection Proxy
      StaticPort  : 0
      ```

### Install the DC Agent service

   Install the DC Agent service for password protection by using the `AzureADPasswordProtectionDCAgentSetup.msi` package.

   The software installation, or uninstallation, requires a restart. This requirement is because password filter DLLs are only loaded or unloaded by a restart.

   You can install the DC Agent service on a machine that's not yet a domain controller. In this case, the service will start and run but remain inactive until the machine is promoted to be a domain controller.

   You can automate the software installation by using standard MSI procedures. For example:

   `msiexec.exe /i AzureADPasswordProtectionDCAgentSetup.msi /quiet /qn /norestart`

   You may omit the `/norestart` flag if you prefer to have the installer automatically reboot the machine.

The installation is complete after the DC Agent software is installed on a domain controller, and that computer is rebooted. No other configuration is required or possible.

## Upgrading the Proxy agent

When a newer version of the Azure AD Password Protection Proxy software is available, the upgrade is accomplished by running the latest version of the `AzureADPasswordProtectionProxySetup.exe` software installer. The latest version of the software is available on the [Microsoft Download Center](https://www.microsoft.com/download/details.aspx?id=57071).

It is not required to uninstall the current version of the Proxy software - the installer will perform an in-place upgrade. No reboot should be required when upgrading the Proxy software. The software upgrade may be automated using standard MSI procedures, for example: `AzureADPasswordProtectionProxySetup.exe /quiet`.

The Proxy agent supports automatic upgrade. Automatic upgrade uses the Microsoft Azure AD Connect Agent Updater service, which is installed side by side with the Proxy service. Automatic upgrade is on by default, and may be enabled or disabled using the `Set-AzureADPasswordProtectionProxyConfiguration` cmdlet. The current setting can be queried using the `Get-AzureADPasswordProtectionProxyConfiguration` cmdlet. Microsoft recommends that the automatic upgrade setting always is enabled.

The `Get-AzureADPasswordProtectionProxy` cmdlet may be used to query the software version of all currently installed Proxy agents in a forest.

## Upgrading the DC agent

When a newer version of the Azure AD Password Protection DC Agent software is available, the upgrade is accomplished by running the latest version of the `AzureADPasswordProtectionDCAgentSetup.msi` software package. The latest version of the software is available on the [Microsoft Download Center](https://www.microsoft.com/download/details.aspx?id=57071).

It is not required to uninstall the current version of the DC agent software - the installer will perform an in-place upgrade. A reboot is always required when upgrading the DC agent software - this requirement is caused by core Windows behavior. 

The software upgrade may be automated using standard MSI procedures, for example: `msiexec.exe /i AzureADPasswordProtectionDCAgentSetup.msi /quiet /qn /norestart`.

You may omit the `/norestart` flag if you prefer to have the installer automatically reboot the machine.

The `Get-AzureADPasswordProtectionDCAgent` cmdlet may be used to query the software version of all currently installed DC agents in a forest.

## Multiple forest deployments

There are no additional requirements to deploy Azure AD password protection across multiple forests. Each forest is independently configured as described in the "Single-forest deployment" section. Each password protection proxy can only support domain controllers from the forest that it's joined to. The password protection software in any forest is unaware of password protection software that's deployed in other forests, regardless of Active Directory trust configurations.

## Read-only domain controllers

Password changes/sets are not processed and persisted on read-only domain controllers (RODCs). They are forwarded to writable domain controllers. So, you don't have to install the DC Agent software on RODCs.

## High availability

The main availability concern for password protection is the availability of proxy servers when the domain controllers in a forest try to download new policies or other data from Azure. Each DC Agent uses a simple round-robin-style algorithm when deciding which proxy server to call. The Agent skips proxy servers that aren't responding. For most fully connected Active Directory deployments that have healthy replication of both directory and sysvol folder state, two proxy servers is enough to ensure availability. This results in timely download of new policies and other data. But you can deploy additional proxy servers.

The design of the DC Agent software mitigates the usual problems that are associated with high availability. The DC Agent maintains a local cache of the most recently downloaded password policy. Even if all registered proxy servers become unavailable, the DC Agents continue to enforce their cached password policy. A reasonable update frequency for password policies in a large deployment is usually days, not hours or less. So, brief outages of the proxy servers don't significantly impact Azure AD password protection.

## Next steps

Now that you've installed the services that you need for Azure AD password protection on your on-premises servers, [perform post-install configuration and gather reporting information](howto-password-ban-bad-on-premises-operations.md) to complete your deployment.

[Conceptual overview of Azure AD password protection](concept-password-ban-bad-on-premises.md)

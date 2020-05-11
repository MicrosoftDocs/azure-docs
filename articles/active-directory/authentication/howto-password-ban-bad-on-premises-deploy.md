---
title: Deploy on-premises Azure AD Password Protection
description: Learn how to plan and deploy Azure AD Password Protection in an on-premises Active Directory Domain Services environment

services: active-directory
ms.service: active-directory
ms.subservice: authentication
ms.topic: how-to
ms.date: 03/05/2020

ms.author: iainfou
author: iainfoulds
manager: daveba
ms.reviewer: jsimmons

ms.collection: M365-identity-device-management
---
# Plan and deploy on-premises Azure Active Directory Password Protection

Users often create passwords that use common local words such as a school, sports team, or famous person. These passwords are easy to guess, and weak against dictionary-based attacks. To enforce strong passwords in your organization, Azure Active Directory (Azure AD) Password Protection provides a global and custom banned password list. A password change request fails if there's a match in these banned password list.

To protect your on-premises Active Directory Domain Services (AD DS) environment, you can install and configure Azure AD Password Protection to work with your on-prem DC. This article shows you how to install and register the Azure AD Password Protection proxy service and Azure AD Password Protection DC agent in your on-premises environment.

For more information on how Azure AD Password Protection works in an on-premises environment, see [How to enforce Azure AD Password Protection for Windows Server Active Directory](concept-password-ban-bad-on-premises.md).

## Deployment strategy

The following diagram shows how the basic components of Azure AD Password Protection work together in an on-premises Active Directory environment:

![How Azure AD Password Protection components work together](./media/concept-password-ban-bad-on-premises/azure-ad-password-protection.png)

It's a good idea to review how the software works before you deploy it. For more information, see [Conceptual overview of Azure AD Password Protection](concept-password-ban-bad-on-premises.md).

We recommend that you start deployments in *audit* mode. Audit mode is the default initial setting, where passwords can continue to be set. Passwords that would be blocked are recorded in the event log. After you deploy the proxy servers and DC agents in audit mode, monitor the impact that the password policy will have on users when the policy is enforced.

During the audit stage, many organizations find that the following situations apply:

* They need to improve existing operational processes to use more secure passwords.
* Users often use unsecure passwords.
* They need to inform users about the upcoming change in security enforcement, possible impact on them, and how to choose more secure passwords.

It's also possible for stronger password validation to affect your existing Active Directory domain controller deployment automation. We recommend that at least one DC promotion and one DC demotion happen during the audit period evaluation to help uncover such issues. For more information, see the following articles:

* [Ntdsutil.exe is unable to set a weak Directory Services Repair Mode password](howto-password-ban-bad-on-premises-troubleshoot.md#ntdsutilexe-fails-to-set-a-weak-dsrm-password)
* [Domain controller replica promotion fails because of a weak Directory Services Repair Mode password](howto-password-ban-bad-on-premises-troubleshoot.md#domain-controller-replica-promotion-fails-because-of-a-weak-dsrm-password)
* [Domain controller demotion fails due to a weak local Administrator password](howto-password-ban-bad-on-premises-troubleshoot.md#domain-controller-demotion-fails-due-to-a-weak-local-administrator-password)

After the feature has been running in audit mode for a reasonable period, you can switch the configuration from *Audit* to *Enforce* to require more secure passwords. Additional monitoring during this time is a good idea.

### Multiple forest considerations

There are no additional requirements to deploy Azure AD Password Protection across multiple forests.

Each forest is independently configured, as described in the following section to [deploy on-prem Azure AD Password Protection](#download-required-software). Each Azure AD Password Protection proxy can only support domain controllers from the forest that it's joined to.

The Azure AD Password Protection software in any forest is unaware of password protection software that's deployed in other forests, regardless of Active Directory trust configurations.

### Read-only domain controller considerations

Password change or set events aren't processed and persisted on read-only domain controllers (RODCs). Instead, they're forwarded to writable domain controllers. You don't have to install the Azure AD Password Protection DC agent software on RODCs.

Further, it's not supported to run the Azure AD Password Protection proxy service on a read-only domain controller.

### High availability considerations

The main concern for password protection is the availability of Azure AD Password Protection proxy servers when the DCs in a forest try to download new policies or other data from Azure. Each Azure AD Password Protection DC agent uses a simple round-robin-style algorithm when deciding which proxy server to call. The agent skips proxy servers that aren't responding.

For most fully connected Active Directory deployments that have healthy replication of both directory and sysvol folder state, two Azure AD Password Protection proxy servers is enough to ensure availability. This configuration results in timely download of new policies and other data. You can deploy additional Azure AD Password Protection proxy servers if desired.

The design of the Azure AD Password Protection DC agent software mitigates the usual problems that are associated with high availability. The Azure AD Password Protection DC agent maintains a local cache of the most recently downloaded password policy. Even if all registered proxy servers become unavailable, the Azure AD Password Protection DC agents continue to enforce their cached password policy.

A reasonable update frequency for password policies in a large deployment is usually days, not hours or less. So, brief outages of the proxy servers don't significantly impact Azure AD Password Protection.

## Deployment requirements

For information on licensing, see [Azure AD Password Protection licensing requirements](concept-password-ban-bad.md#license-requirements).

The following core requirements apply:

* All machines, including domain controllers, that have Azure AD Password Protection components installed must have the Universal C Runtime installed.
    * You can get the runtime by making sure you have all updates from Windows Update. Or you can get it in an OS-specific update package. For more information, see [Update for Universal C Runtime in Windows](https://support.microsoft.com/help/2999226/update-for-uniersal-c-runtime-in-windows).
* You need an account that has Active Directory domain administrator privileges in the forest root domain to register the Windows Server Active Directory forest with Azure AD.
* The Key Distribution Service must be enabled on all domain controllers in the domain that run Windows Server 2012. By default, this service is enabled via manual trigger start.
* Network connectivity must exist between at least one domain controller in each domain and at least one server that hosts the proxy service for Azure AD Password Protection. This connectivity must allow the domain controller to access RPC endpoint mapper port 135 and the RPC server port on the proxy service.
    * By default, the RPC server port is a dynamic RPC port, but it can be configured to [use a static port](#static).
* All machines where the Azure AD Password Protection Proxy service will be installed must have network access to the following endpoints:

    |**Endpoint**|**Purpose**|
    | --- | --- |
    |`https://login.microsoftonline.com`|Authentication requests|
    |`https://enterpriseregistration.windows.net`|Azure AD Password Protection functionality|

### Azure AD Password Protection DC agent

The following requirements apply to the Azure AD Password Protection DC agent:

* All machines where the Azure AD Password Protection DC agent software will be installed must run Windows Server 2012 or later.
    * The Active Directory domain or forest doesn't need to be at Windows Server 2012 domain functional level (DFL) or forest functional level (FFL). As mentioned in [Design Principles](concept-password-ban-bad-on-premises.md#design-principles), there's no minimum DFL or FFL required for either the DC agent or proxy software to run.
* All machines that run the Azure AD Password Protection DC agent must have .NET 4.5 installed.
* Any Active Directory domain that runs the Azure AD Password Protection DC agent service must use Distributed File System Replication (DFSR) for sysvol replication.
   * If your domain isn't already using DFSR, you must migrate before installing Azure AD Password Protection. For more information, see [SYSVOL Replication Migration Guide: FRS to DFS Replication](https://docs.microsoft.com/previous-versions/windows/it-pro/windows-server-2008-R2-and-2008/dd640019(v=ws.10))

    > [!WARNING]
    > The Azure AD Password Protection DC agent software will currently install on domain controllers in domains that are still using FRS (the predecessor technology to DFSR) for sysvol replication, but the software will NOT work properly in this environment.
    >
    > Additional negative side-effects include individual files failing to replicate, and sysvol restore procedures appearing to succeed but silently failing to replicate all files.
    >
    > Migrate your domain to use DFSR as soon as possible, both for DFSR's inherent benefits and to unblock the deployment of Azure AD Password Protection. Future versions of the software will be automatically disabled when running in a domain that's still using FRS.

### Azure AD Password Protection proxy service

The following requirements apply to the Azure AD Password Protection proxy service:

* All machines where the Azure AD Password Protection proxy service will be installed must run Windows Server 2012 R2 or later.

    > [!NOTE]
    > The Azure AD Password Protection proxy service deployment is a mandatory requirement for deploying Azure AD Password Protection even though the domain controller may have outbound direct internet connectivity.

* All machines where the Azure AD Password Protection proxy service will be installed must have .NET 4.7 installed.
    * .NET 4.7 should already be installed on a fully updated Windows Server. If necessary, download and run the installer found at [The .NET Framework 4.7 offline installer for Windows](https://support.microsoft.com/help/3186497/the-net-framework-4-7-offline-installer-for-windows).
* All machines that host the Azure AD Password Protection proxy service must be configured to grant domain controllers the ability to log on to the proxy service. This ability is controlled via the "Access this computer from the network" privilege assignment.
* All machines that host the Azure AD Password Protection proxy service must be configured to allow outbound TLS 1.2 HTTP traffic.
* A *Global Administrator* account to register the Azure AD Password Protection proxy service and forest with Azure AD.
* Network access must be enabled for the set of ports and URLs specified in the [Application Proxy environment setup procedures](https://docs.microsoft.com/azure/active-directory/manage-apps/application-proxy-add-on-premises-application#prepare-your-on-premises-environment).

### Microsoft Azure AD Connect Agent Updater prerequisites

The Microsoft Azure AD Connect Agent Updater service is installed side by side with the Azure AD Password Protection Proxy service. Additional configuration is required in order for the Microsoft Azure AD Connect Agent Updater service to be able to function:

* If your environment uses an HTTP proxy server, follow the guidelines specified in [Work with existing on-premises proxy servers](https://docs.microsoft.com/azure/active-directory/manage-apps/application-proxy-configure-connectors-with-proxy-servers).
* The Microsoft Azure AD Connect Agent Updater service also requires the TLS 1.2 steps specified in [TLS requirements](https://docs.microsoft.com/azure/active-directory/manage-apps/application-proxy-add-on-premises-application#tls-requirements).

> [!WARNING]
> Azure AD Password Protection proxy and Azure AD Application Proxy install different versions of the Microsoft Azure AD Connect Agent Updater service, which is why the instructions refer to Application Proxy content. These different versions are incompatible when installed side by side and doing so will prevent the Agent Updater service from contacting Azure for software updates, so you should never install Azure AD Password Protection Proxy and Application Proxy on the same machine.

## Download required software

There are two required installers for an on-premises Azure AD Password Protection deployment:

* Azure AD Password Protection DC agent (*AzureADPasswordProtectionDCAgentSetup.msi*)
* Azure AD Password Protection proxy (*AzureADPasswordProtectionProxySetup.exe*)

Download both installers from the [Microsoft Download Center](https://www.microsoft.com/download/details.aspx?id=57071).

## Install and configure the proxy service

The Azure AD Password Protection proxy service is typically on a member server in your on-premises AD DS environment. Once installed, the Azure AD Password Protection proxy service communicates with Azure AD to maintain a copy of the global and customer banned password lists for your Azure AD tenant.

In the next section, you install the Azure AD Password Protection DC agents on domain controllers in your on-premises AD DS environment. These DC agents communicate with the proxy service to get the latest banned password lists for use when processing password change events within the domain.

Choose one or more servers to host the Azure AD Password Protection proxy service. The following considerations apply for the server(s):

* Each such service can only provide password policies for a single forest. The host machine must be joined to a domain in that forest. Root and child domains are both supported. You need network connectivity between at least one DC in each domain of the forest and the password protection machine.
* You can run the Azure AD Password Protection proxy service on a domain controller for testing, but that domain controller then requires internet connectivity. This connectivity can be a security concern. We recommend this configuration for testing only.
* We recommend at least two Azure AD Password Protection proxy servers for redundancy, as noted in the previous section on [high availability considerations](#high-availability-considerations).
* It's not supported to run the Azure AD Password Protection proxy service on a read-only domain controller.

To install the Azure AD Password Protection proxy service, complete the following steps:

1. To install the  Azure AD Password Protection proxy service, run the `AzureADPasswordProtectionProxySetup.exe` software installer.

    The software installation doesn't require a reboot and may be automated using standard MSI procedures, as in the following example:
    
    ```console
    AzureADPasswordProtectionProxySetup.exe /quiet
    ```
    
    > [!NOTE]
    > The Windows Firewall service must be running before you install the `AzureADPasswordProtectionProxySetup.exe` package to avoid an installation error.
    >
    > If Windows Firewall is configured to not run, the workaround is to temporarily enable and run the Firewall service during the installation. The proxy software has no specific dependency on Windows Firewall after installation.
    >
    > If you're using a third-party firewall, it must still be configured to satisfy the deployment requirements. These include allowing inbound access to port 135 and the proxy RPC server port. For more information, see the previous section on [deployment requirements](#deployment-requirements).

1. The Azure AD Password Protection proxy software includes a new PowerShell module, `AzureADPasswordProtection`. The following steps run various cmdlets from this PowerShell module.

    To use this module, open a PowerShell window as an administrator and import the new module as follows:
    
    ```powershell
    Import-Module AzureADPasswordProtection
    ```

1. To check that the Azure AD Password Protection proxy service is running, use the following PowerShell command:

    ```powershell
    Get-Service AzureADPasswordProtectionProxy | fl
    ```

    The result should show a **Status** of *Running*.

1. The proxy service is running on the machine, but doesn't have credentials to communicate with Azure AD. Register the Azure AD Password Protection proxy server with Azure AD using the `Register-AzureADPasswordProtectionProxy` cmdlet.

    This cmdlet requires global administrator credentials for your Azure tenant. You also need on-premises Active Directory domain administrator privileges in the forest root domain. This cmdlet must also be run using an account with local administrator privileges:

    After this command succeeds once for a Azure AD Password Protection proxy service, additional invocations of it succeed, but are unnecessary.

    The `Register-AzureADPasswordProtectionProxy` cmdlet supports the following three authentication modes. The first two modes support Azure Multi-Factor Authentication but the third mode doesn't.

    > [!TIP]
    > There might be a noticeable delay before completion the first time that this cmdlet is run for a specific Azure tenant. Unless a failure is reported, don't worry about this delay.

     * Interactive authentication mode:

        ```powershell
        Register-AzureADPasswordProtectionProxy -AccountUpn 'yourglobaladmin@yourtenant.onmicrosoft.com'
        ```

        > [!NOTE]
        > This mode doesn't work on Server Core operating systems. Instead, use one of the following authentication modes. Also, this mode might fail if Internet Explorer Enhanced Security Configuration is enabled. The workaround is to disable that Configuration, register the proxy, and then re-enable it.

     * Device-code authentication mode:

        ```powershell
        Register-AzureADPasswordProtectionProxy -AccountUpn 'yourglobaladmin@yourtenant.onmicrosoft.com' -AuthenticateUsingDeviceCode
        ```

        When prompted, following the link to open a web browser and enter the authentication code.

     * Silent (password-based) authentication mode:

        ```powershell
        $globalAdminCredentials = Get-Credential
        Register-AzureADPasswordProtectionProxy -AzureCredential $globalAdminCredentials
        ```

        > [!NOTE]
        > This mode fails if Azure Multi-Factor Authentication is required for your account. In that case, use one of the previous two authentication modes, or instead use a different account that does not require MFA.
        >
        > You may also see MFA required if Azure Device Registration (which is used under the covers by Azure AD Password Protection) has been configured to globally require MFA. To workaround this requirement you may use a different account that supports MFA with one of the previous two authentication modes, or you may also temporarily relax the Azure Device Registration MFA requirement.
        >
        > To make this change, search for and select **Azure Active Directory** in the Azure portal, then select **Devices > Device Settings**. Set **Require Multi-Factor Auth to join devices** to *No*. Be sure to reconfigure this setting back to *Yes* once registration is complete.
        >
        > We recommend that MFA requirements be bypassed for test purposes only.

    You don't currently have to specify the *-ForestCredential* parameter, which is reserved for future functionality.

    Registration of the Azure AD Password Protection proxy service is necessary only once in the lifetime of the service. After that, the Azure AD Password Protection proxy service will automatically perform any other necessary maintenance.

1. Now register the on-premises Active Directory forest with the necessary credentials to communicate with Azure by using the `Register-AzureADPasswordProtectionForest` PowerShell cmdlet.

    > [!NOTE]
    > If multiple Azure AD Password Protection proxy servers are installed in your environment, it doesn't matter which proxy server you use to register the forest.

    The cmdlet requires global administrator credentials for your Azure tenant. You must also run this cmdlet using an account with local administrator privileges. It also requires on-premises Active Directory Enterprise Administrator privileges. This step is run once per forest.

    The `Register-AzureADPasswordProtectionForest` cmdlet supports the following three authentication modes. The first two modes support Azure Multi-Factor Authentication but the third mode doesn't.

    > [!TIP]
    > There might be a noticeable delay before completion the first time that this cmdlet is run for a specific Azure tenant. Unless a failure is reported, don't worry about this delay.

     * Interactive authentication mode:

        ```powershell
        Register-AzureADPasswordProtectionForest -AccountUpn 'yourglobaladmin@yourtenant.onmicrosoft.com'
        ```

        > [!NOTE]
        > This mode won't work on Server Core operating systems. Instead use one of the following two authentication modes. Also, this mode might fail if Internet Explorer Enhanced Security Configuration is enabled. The workaround is to disable that Configuration, register the forest, and then re-enable it.  

     * Device-code authentication mode:

        ```powershell
        Register-AzureADPasswordProtectionForest -AccountUpn 'yourglobaladmin@yourtenant.onmicrosoft.com' -AuthenticateUsingDeviceCode
        ```

        When prompted, following the link to open a web browser and enter the authentication code.

     * Silent (password-based) authentication mode:

        ```powershell
        $globalAdminCredentials = Get-Credential
        Register-AzureADPasswordProtectionForest -AzureCredential $globalAdminCredentials
        ```

        > [!NOTE]
        > This mode fails if Azure Multi-Factor Authentication is required for your account. In that case, use one of the previous two authentication modes, or instead use a different account that does not require MFA.
        >
        > You may also see MFA required if Azure Device Registration (which is used under the covers by Azure AD Password Protection) has been configured to globally require MFA. To workaround this requirement you may use a different account that supports MFA with one of the previous two authentication modes, or you may also temporarily relax the Azure Device Registration MFA requirement.
        >
        > To make this change, search for and select **Azure Active Directory** in the Azure portal, then select **Devices > Device Settings**. Set **Require Multi-Factor Auth to join devices** to *No*. Be sure to reconfigure this setting back to *Yes* once registration is complete.
        >
        > We recommend that MFA requirements be bypassed for test purposes only.

       These examples only succeed if the currently signed-in user is also an Active Directory domain administrator for the root domain. If this isn't the case, you can supply alternative domain credentials via the *-ForestCredential* parameter.

    Registration of the Active Directory forest is necessary only once in the lifetime of the forest. After that, the Azure AD Password Protection DC agents in the forest automatically perform any other necessary maintenance. After `Register-AzureADPasswordProtectionForest` runs successfully for a forest, additional invocations of the cmdlet succeed, but are unnecessary.
    
    For `Register-AzureADPasswordProtectionForest` to succeed, at least one DC running Windows Server 2012 or later must be available in the Azure AD Password Protection proxy server's domain. The Azure AD Password Protection DC agent software doesn't have to be installed on any domain controllers prior to this step.

### Configure the proxy service to communicate through an HTTP proxy

If your environment requires the use of a specific HTTP proxy to communicate with Azure, use the following steps to configure the Azure AD Password Protection service.

Create a *AzureADPasswordProtectionProxy.exe.config* file in the `%ProgramFiles%\Azure AD Password Protection Proxy\Service` folder. Include the following content:

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

We recommend that you stop and restart the Azure AD Password Protection proxy service after you create or update the *AzureADPasswordProtectionProxy.exe.config* file.

The proxy service doesn't support the use of specific credentials for connecting to an HTTP proxy.

### Configure the proxy service to listen on a specific port

The Azure AD Password Protection DC agent software uses RPC over TCP to communicate with the proxy service. By default, the Azure AD Password Protection proxy service listens on any available dynamic RPC endpoint. You can configure the service to listen on a specific TCP port, if necessary due to networking topology or firewall requirements in your environment.

<a id="static" /></a>To configure the service to run under a static port, use the `Set-AzureADPasswordProtectionProxyConfiguration` cmdlet as follows:

```powershell
Set-AzureADPasswordProtectionProxyConfiguration –StaticPort <portnumber>
```

> [!WARNING]
> You must stop and restart the Azure AD Password Protection proxy service for these changes to take effect.

To configure the service to run under a dynamic port, use the same procedure but set *StaticPort* back to zero:

```powershell
Set-AzureADPasswordProtectionProxyConfiguration –StaticPort 0
```

> [!WARNING]
> You must stop and restart the Azure AD Password Protection proxy service for these changes to take effect.

The Azure AD Password Protection proxy service requires a manual restart after any change in port configuration. You don't have to restart the Azure AD Password Protection DC agent service on domain controllers after you make these configuration changes.

To query for the current configuration of the service, use the `Get-AzureADPasswordProtectionProxyConfiguration` cmdlet as shown in the following example

```powershell
Get-AzureADPasswordProtectionProxyConfiguration | fl
```

The following example output shows that the Azure AD Password Protection proxy service is using a dynamic port:

```output
ServiceName : AzureADPasswordProtectionProxy
DisplayName : Azure AD password protection Proxy
StaticPort  : 0
```

## Install the DC agent service

To install the Azure AD Password Protection DC agent service, run the `AzureADPasswordProtectionDCAgentSetup.msi` package.

You can automate the software installation by using standard MSI procedures, as shown in the following example:

```console
msiexec.exe /i AzureADPasswordProtectionDCAgentSetup.msi /quiet /qn /norestart
```

The `/norestart` flag  can be omitted if you prefer to have the installer automatically reboot the machine.

The software installation, or uninstallation, requires a restart. This requirement is because password filter DLLs are only loaded or unloaded by a restart.

The installation of on-prem Azure AD Password Protection is complete after the DC agent software is installed on a domain controller, and that computer is rebooted. No other configuration is required or possible. Password change events against the on-prem DCs use the configured banned password lists from Azure AD.

To enable on-prem Azure AD Password Protection from the Azure portal or configure custom banned passwords, see [Enable on-premises Azure AD Password Protection](howto-password-ban-bad-on-premises-operations.md).

> [!TIP]
> You can install the Azure AD Password Protection DC agent on a machine that's not yet a domain controller. In this case, the service starts and runs but remain inactive until the machine is promoted to be a domain controller.

## Upgrading the proxy service

The Azure AD Password Protection proxy service supports automatic upgrade. Automatic upgrade uses the Microsoft Azure AD Connect Agent Updater service, which is installed side by side with the proxy service. Automatic upgrade is on by default, and may be enabled or disabled using the `Set-AzureADPasswordProtectionProxyConfiguration` cmdlet.

The current setting can be queried using the `Get-AzureADPasswordProtectionProxyConfiguration` cmdlet. We recommend that the automatic upgrade setting always is enabled.

The `Get-AzureADPasswordProtectionProxy` cmdlet may be used to query the software version of all currently installed Azure AD Password Protection proxy servers in a forest.

### Manual upgrade process

A manual upgrade is accomplished by running the latest version of the `AzureADPasswordProtectionProxySetup.exe` software installer. The latest version of the software is available on the [Microsoft Download Center](https://www.microsoft.com/download/details.aspx?id=57071).

It's not required to uninstall the current version of the Azure AD Password Protection proxy service - the installer performs an in-place upgrade. No reboot should be required when upgrading the proxy service. The software upgrade may be automated using standard MSI procedures, such as `AzureADPasswordProtectionProxySetup.exe /quiet`.

## Upgrading the DC agent

When a newer version of the Azure AD Password Protection DC agent software is available, the upgrade is accomplished by running the latest version of the `AzureADPasswordProtectionDCAgentSetup.msi` software package. The latest version of the software is available on the [Microsoft Download Center](https://www.microsoft.com/download/details.aspx?id=57071).

It's not required to uninstall the current version of the DC agent software - the installer performs an in-place upgrade. A reboot is always required when upgrading the DC agent software - this requirement is caused by core Windows behavior.

The software upgrade may be automated using standard MSI procedures, such as `msiexec.exe /i AzureADPasswordProtectionDCAgentSetup.msi /quiet /qn /norestart`.

You may omit the `/norestart` flag if you prefer to have the installer automatically reboot the machine.

The `Get-AzureADPasswordProtectionDCAgent` cmdlet may be used to query the software version of all currently installed Azure AD Password Protection DC agents in a forest.

## Next steps

Now that you've installed the services that you need for Azure AD Password Protection on your on-premises servers, [enable on-prem Azure AD Password Protection in the Azure portal](howto-password-ban-bad-on-premises-operations.md) to complete your deployment.

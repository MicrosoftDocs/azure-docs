---
title: Deploy Azure AD password protection preview
description: Deploy the Azure AD password protection preview to ban bad passwords on-premises

services: active-directory
ms.service: active-directory
ms.component: authentication
ms.topic: conceptual
ms.date: 07/25/2018

ms.author: joflore
author: MicrosoftGuyJFlo
manager: mtillman
ms.reviewer: jsimmons

---
# Preview: Deploy Azure AD password protection

|     |
| --- |
| Azure AD password protection and the custom banned password list are public preview features of Azure Active Directory. For more information about previews, see  [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/)|
|     |

Now that we have an understanding of [how to enforce Azure AD password protection for Windows Server Active Directory](concept-password-ban-bad-on-premises.md), the next step is to plan and execute the deployment.

## Deployment strategy

Microsoft suggests that any deployment start in audit mode. Audit mode is the default initial setting where passwords can continue to be set and any that would be blocked create entries in the event log. Once proxy server(s) and DC agents are fully deployed in audit mode, regular monitoring should be done in order to determine what impact password policy enforcement would have on users and the environment if the policy was enforced.

During the audit stage, many organizations find:

* They need to improve existing operational processes to use more secure passwords.
* Users are accustomed to regularly choosing unsecure passwords
* They need to inform users about the upcoming change in security enforcement, the impact it may have on them, and help them better understand how they can choose more secure passwords.

Once the feature has been running in audit mode for a reasonable time, the enforcement configuration can be flipped from **Audit** to **Enforce** thereby requiring more secure passwords. Focused monitoring during this time is a good idea.

## Known limitation

There is a known limitation in the preview version of the Azure AD password protection proxy. Use of tenant administrator accounts that require MFA is unsupported. A future update of the Azure AD password protection proxy will support proxy registration with administrator accounts that require MFA.

## Single forest deployment

The preview of Azure AD password protection is deployed with the proxy service on up to two servers, and the DC agent service can be incrementally deployed to all domain controllers in the Active Directory forest.

![How Azure AD password protection components work together](./media/concept-password-ban-bad-on-premises/azure-ad-password-protection.png)

### Download the software

There are two required installers for Azure AD password protection that can be downloaded from the [Microsoft download center](https://www.microsoft.com/download/details.aspx?id=57071)

### Install and configure the Azure AD password protection proxy service

1. Choose one or more servers to host the Azure AD password protection proxy service.
   * Each such service can only provide password policies for a single forest, and the host machine must be domain-joined to a domain (root and child are both equally supported) in that forest. For Azure AD password protection proxy service to fulfill its mission, there must exist network connectivity between at least one DC in each domain of the forest, and the Azure AD password protection Proxy host machine.
   * It is supported to install and run the Azure AD password protection proxy service on a domain controller for testing purposes but the domain controller then requires internet connectivity.

   > [!NOTE]
   > The public preview supports a maximum of two (2) proxy servers per forest.

2. Install the Password Policy Proxy Service software using the AzureADPasswordProtectionProxy.msi MSI package.
   * The software installation does not require a reboot. The software installation may be automated using standard MSI procedures, for example:
   `msiexec.exe /i AzureADPasswordProtectionProxy.msi /quiet /qn`

3. Open a PowerShell window as an Administrator.
   * The Azure AD password protection Proxy software includes a new PowerShell module named AzureADPasswordProtection. The following steps are based on running various cmdlets from this PowerShell module, and assume that you have opened a new PowerShell window and have imported the new module as follows:
      * `Import-Module AzureADPasswordProtection`

      > [!NOTE]
      > The installation software modifies the host machine’s PSModulePath environment variable. In order for this change to take effect so that the AzureADPasswordProtection powershell module can be imported and used, you may need to open a brand new PowerShell console window.

   * Check that the service is running using the following PowerShell command: `Get-Service AzureADPasswordProtectionProxy | fl`.
      * The result should produce a result with the **Status** returning a "Running" result.

4. Register the proxy.
   * Once step 3 has been completed the Azure AD password protection proxy service is running on the machine, but does not yet have the necessary credentials to communicate with Azure AD. Registration with Azure AD is required to enable that ability using the `Register-AzureADPasswordProtectionProxy` PowerShell cmdlet. The cmdlet requires global administrator credentials for your Azure tenant as well as on-premises Active Directory domain administrator privileges in the forest root domain. Once it has succeeded for a given proxy service, additional invocations of `Register-AzureADPasswordProtectionProxy` continue to succeed but are unnecessary.
      * The cmdlet may be run as follows:

         ```
         $tenantAdminCreds = Get-Credential
         Register-AzureADPasswordProtectionProxy -AzureCredential $tenantAdminCreds
         ```

         The example only works if the currently logged in user is also an Active Directory domain administrator for the root domain. An alternative is to supply the necessary domain credentials via the `-ForestCredential` parameter.

   > [!TIP]
   > There may be a considerable delay (many seconds) the first time this cmdlet is run for a given Azure tenant before the cmdlet completes execution. Unless a failure is reported this delay should not be considered alarming.

   > [!NOTE]
   > Registration of the Azure AD password protection proxy service is expected to be a one-time step in the lifetime of the service. The proxy service will automatically perform any other necessary maintainenance from this point onwards. Once it has succeeded for a given forest, additional invocations of 'Register-AzureADPasswordProtectionProxy' continue to succeed but are unnecessary.

5. Register the forest.
   * The on-premises Active Directory forest must be initialized with the necessary credentials to communicate with Azure using the `Register-AzureADPasswordProtectionForest` Powershell cmdlet. The cmdlet requires global administrator credentials for your Azure tenant as well as on-premises Active Directory domain administrator privileges in the forest root domain. This step is run once per forest.
      * The cmdlet may be run as follows:

         ```
         $tenantAdminCreds = Get-Credential
         Register-AzureADPasswordProtectionForest -AzureCredential $tenantAdminCreds
         ```

         The example only works if the currently logged in user is also an Active Directory domain administrator for the root domain. An alternative is to supply the necessary domain credentials via the -ForestCredential parameter.

         > [!NOTE]
         > If multiple proxy servers are installed in your environment, it does not matter which proxy server is specified in the procedure above.

         > [!TIP]
         > There may be a considerable delay (many seconds) the first time this cmdlet is run for a given Azure tenant before the cmdlet completes execution. Unless a failure is reported this delay should not be considered alarming.

   > [!NOTE]
   > Registration of the Active Directory forest is expected to be a one-time step in the lifetime of the forest. The domain controller agents running in the forest will automatically perform any other necessary maintainenance from this point onwards. Once it has succeeded for a given forest, additional invocations of `Register-AzureADPasswordProtectionForest` continue to succeed but are unnecessary.

   > [!NOTE]
   > In order for `Register-AzureADPasswordProtectionForest` to succeed at least one Windows Server 2012 or later domain controller must be available in the proxy server's domain. However there is no requirement that the DC agent software be installed on any domain controllers prior to this step.

6. Optional: Configure the Azure AD password protection proxy service to listen on a specific port.
   * RPC over TCP is used by the Azure AD password protection DC Agent software on the domain controllers to communicate with the Azure AD password protection proxy service. By default, the Azure AD password protection Password Policy Proxy service listens on any available dynamic RPC endpoint. If necessary due to networking topology or firewall requirements, the service may instead be configured to listen on a specific TCP port.
      * To configure the service to run under a static port, use the `Set-AzureADPasswordProtectionProxyConfiguration` cmdlet.
         ```
         Set-AzureADPasswordProtectionProxyConfiguration –StaticPort <portnumber>
         ```

         > [!WARNING]
         > You must stop and restart the service for these changes to take effect.

      * To configure the service to run under a dynamic port, use the same procedure but set StaticPort back to zero, like so:
         ```
         Set-AzureADPasswordProtectionProxyConfiguration –StaticPort 0
         ```

         > [!WARNING]
         > You must stop and restart the service for these changes to take effect.

   > [!NOTE]
   > The Azure AD password protection proxy service requires a manual restart after any change in port configuration. It is not necessary to restart the DC agent service software running on domain controllers after making configuration changes of this nature.

   * The current configuration of the service may be queried using the `Get-AzureADPasswordProtectionProxyConfiguration` cmdlet as the following example shows:

      ```
      Get-AzureADPasswordProtectionProxyConfiguration | fl

      ServiceName : AzureADPasswordProtectionProxy
      DisplayName : Azure AD password protection Proxy
      StaticPort  : 0 
      ```

### Install the Azure AD password protection DC agent service

* Install the Azure AD password protection DC agent service software using the `AzureADPasswordProtectionDCAgent.msi` MSI package:
   * The software installation does require a reboot on install and uninstall due to the operating system requirement that password filter dlls are only loaded or unloaded upon a reboot.
   * It is supported to install the DC agent service on a machine that is not yet a domain-controller. In this case, the service will start and run but will otherwise be inactive until after the machine is promoted to be a domain controller.

   The software installation may be automated using standard MSI procedures, for example:
   `msiexec.exe /i AzureADPasswordProtectionDCAgent.msi /quiet /qn`

   > [!WARNING]
   > The example msiexec command will result in an immediate reboot; this can be avoided by specifying the `/norestart` flag.

Once installed on a domain controller and rebooted, the Azure AD password protection DC Agent software installation is complete. No other configuration is required or possible.

## Multiple forest deployments

There are no additional requirements to deploy Azure AD password protection across multiple forests. Each forest is independently configured as described in the single forest deployment section. Each Azure AD password protection Proxy can only support domain controllers from the forest it is joined to. The Azure AD password protection software in a given forest is unaware of Azure AD password protection software deployed in another forest regardless of Active Directory trust configurations.

## Read-only domain controllers

Password changes\sets are never processed and persisted on read-only domain controllers (RODCs); instead, these are forwarded to writable domain controllers. Therefore there is no need to install the DC agent software on RODCs.

## High availability

The main concern with ensuring high availability of Azure AD password protection is the availability of the proxy servers, when domain controllers in a forest are attempting to download new policies or other data from Azure. The public preview supports a maximum of two proxy servers per forest. Each DC agent uses a simple round-robin style algorithm when deciding which proxy server to call, and skips over proxy servers that are not responding.
The usual problems associated with high availability are mitigated by the design of the DC agent software. The DC agent maintains a local cache of the most recently downloaded password policy. Even if all registered proxy servers become unavailable for any reason, the DC agent(s) continue to enforce their cached password policy. A reasonable update frequency for password policies in a large deployment is usually on the order of days, not hours or less.   Therefore brief outages of the proxy servers do not cause significant impact to the operation of the Azure AD password protection feature or its security benefits.

## Next steps

Now that you have installed the services required for Azure AD password protection on your on-premises servers complete the [post-install configuration and gather reporting information](howto-password-ban-bad-on-premises-operations.md) to complete your deployment.

[Conceptual overview of Azure AD password protection](concept-password-ban-bad-on-premises.md)

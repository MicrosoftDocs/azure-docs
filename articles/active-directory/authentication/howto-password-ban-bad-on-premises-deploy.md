---
title: Deploy Azure AD Password Protection preview
description: Deploy the Azure AD Password Protection preview to ban bad passwords on-premises

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

# Preview: Deploy Azure AD Password Protection

|     |
| --- |
| Azure AD Password Protection is a public preview feature of Azure Active Directory. For more information about previews, see  [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/)|
|     |

Now that we have an understanding of [how to enforce Azure AD Password Protection for Windows Server Active Directory](concept-password-ban-bad-on-premises.md), the next step is to plan and execute the deployment.

## Deployment strategy

Microsoft suggests that any deployment start in audit mode. Audit mode is the default initial setting where passwords can continue to be set and any that would be blocked create entries in the event log. Once proxy server(s) and DC agents are fully deployed in audit mode, regular monitoring should be done in order to determine what impact password policy enforcement would have on users and the environment if the policy was enforced.

During the audit stage, many organizations find:

* They need to improve existing operational processes to use more secure passwords.
* Users are accustomed to regularly choosing unsecure passwords
* They need to inform users about the upcoming change in security enforcement, the impact it may have on them, and help them better understand how they can choose more secure passwords.

Once the feature has been running in audit mode for a reasonable time, the enforcement configuration can be flipped from **Audit** to **Enforce** thereby requiring more secure passwords. Focused monitoring during this time is a good idea.

## Deployment requirements

* All domain controllers where the Azure AD Password Protection DC Agent service will be installed must be running Windows Server 2012 or later.
* All machines where the Azure AD Password Protection Proxy service will be installed must be running Windows Server 2012 R2 or later.
* All machines where Azure AD Password Protection components are installed including domain controllers must have the Universal C runtime installed.
This is preferably accomplished by fully patching the machine via Windows Update. Otherwise an appropriate OS-specific update package may be installed - see [Update for Universal C Runtime in Windows](https://support.microsoft.com/help/2999226/update-for-universal-c-runtime-in-windows)
* Network connectivity must exist between at least one domain controller in each domain and at least one server hosting the Azure AD Password Protection Proxy service. This connectivity must allow the domain controller to access the RPC endpoint mapper port (135) and the RPC server port on the proxy service. The RPC server port is by default a dynamic RPC port but can be configured (see below) to use a static port.
* All machines hosting the Azure AD Password Protection Proxy service must have network access to the following endpoints:

    |Endpoint |Purpose|
    | --- | --- |
    |`https://login.microsoftonline.com`|Authentication requests|
    |`https://enterpriseregistration.windows.net`|Azure AD Password Protection functionality|

* All machines hosting the Azure AD Password Protection Proxy service must be configured to allow outbound TLS 1.2 HTTP traffic.
* A global administrator account to register the Azure AD Password Protection Proxy service and forest with Azure AD.
* An account with Active Directory domain administrator privileges in the forest root domain to register the Windows Server Active Directory forest with Azure AD.
* Any Active Directory domain running the DC agent service software must use DFSR for sysvol replication.

## Single forest deployment

The following diagram shows how the basic components of Azure AD Password Protection work together in an on-premises Active Directory environment.

![How Azure AD Password Protection components work together](./media/concept-password-ban-bad-on-premises/azure-ad-password-protection.png)

Prior to deployment it is a good idea to review how the software works; please see [Conceptual overview of Azure AD password protection](concept-password-ban-bad-on-premises.md).

### Download the software

There are two required installers for Azure AD Password Protection that can be downloaded from the [Microsoft download center](https://www.microsoft.com/download/details.aspx?id=57071)

### Install and configure the Azure AD Password Protection proxy service

1. Choose one or more servers to host the Azure AD Password Protection Proxy service.
   * Each such service can only provide password policies for a single forest, and the host machine must be domain-joined to a domain (root and child domains are both supported) in that forest. In order for the Azure AD Password Protection Proxy service to fulfill its mission, there must exist network connectivity between at least one DC in each domain of the forest and the Azure AD Password Protection Proxy machine.
   * It is supported to install and run the Azure AD Password Protection Proxy service on a domain controller for testing purposes; the downside is that the domain controller then requires internet connectivity which can be a security concern. Microsoft recommends that this configuration only be used for testing purposes.
   * At least two proxy servers is recommended for redundancy purposes. [See High Availability](howto-password-ban-bad-on-premises-deploy.md#high-availability)

2. Install the  Azure AD Password Protection Proxy service using the AzureADPasswordProtectionProxySetup.msi MSI package.
   * The software installation does not require a reboot. The software installation may be automated using standard MSI procedures, for example:
   `msiexec.exe /i AzureADPasswordProtectionProxySetup.msi /quiet /qn`

      > [!NOTE]
      > The Windows Firewall service must be running before installing the AzureADPasswordProtectionProxySetup.msi MSI package or else an installation error will occur. If the Windows Firewall is configured to not run, the workaround is to temporarily enable and start the Windows Firewall service during the installation process. The Proxy software has no specific dependency on the Windows Firewall software after installation. If you are using a third-party firewall, it must still be configured to satisfy the deployment requirements (allow inbound access to port 135 and the proxy RPC server port whether dynamic or static). [See deployment requirements](howto-password-ban-bad-on-premises-deploy.md#deployment-requirements)

3. Open a PowerShell window as an Administrator.
   * The Azure AD Password Protection Proxy software includes a new PowerShell module named AzureADPasswordProtection. The following steps are based on running various cmdlets from this PowerShell module, and assume that you have opened a new PowerShell window and have imported the new module as follows:

      ```PowerShell
      Import-Module AzureADPasswordProtection
      ```

   * Check that the service is running using the following PowerShell command: `Get-Service AzureADPasswordProtectionProxy | fl`.
     The result should produce a result with the **Status** returning a "Running" result.

4. Register the proxy.
   * Once step 3 has been completed the Azure AD Password Protection Proxy service is running on the machine, but does not yet have the necessary credentials to communicate with Azure AD. Registration with Azure AD is required to enable that ability using the `Register-AzureADPasswordProtectionProxy` PowerShell cmdlet. The cmdlet requires global administrator credentials for your Azure tenant as well as on-premises Active Directory domain administrator privileges in the forest root domain. Once it has succeeded for a given proxy service, additional invocations of `Register-AzureADPasswordProtectionProxy` continue to succeed but are unnecessary.

      The Register-AzureADPasswordProtectionProxy cmdlet supports three different authentication modes as follows.

      * Interactive authentication mode:

         ```PowerShell
         Register-AzureADPasswordProtectionProxy -AccountUpn 'yourglobaladmin@yourtenant.onmicrosoft.com'
         ```
         > [!NOTE]
         > This mode will not work on Server Core operating systems. Instead use one of the alternative authentication modes as outlined below.

         > [!NOTE]
         > This mode may fail if Internet Explorer Enhanced Security Configuration is enabled. The workaround is to disable IESC, register the proxy, then re-enable IESC.

      * Device-code authentication mode:

         ```PowerShell
         Register-AzureADPasswordProtectionProxy -AccountUpn 'yourglobaladmin@yourtenant.onmicrosoft.com' -AuthenticateUsingDeviceCode
         To sign in, use a web browser to open the page https://microsoft.com/devicelogin and enter the code XYZABC123 to authenticate.
         ```

         You can then complete the authentication by following the displayed instructions on a different device.

      * Silent (password-based) authentication mode:

         ```PowerShell
         $globalAdminCredentials = Get-Credential
         Register-AzureADPasswordProtectionForest -AzureCredential $globalAdminCredentials
         ```

         > [!NOTE]
         > This mode will fail if the authentication requires MFA for any reason. If this is the case, please use one of the previous two modes to accomplish an MFA-based authentication.

      It is not currently required to specify the -ForestCredential parameter which is reserved for future functionality.

   > [!NOTE]
   > Registration of the Azure AD Password Protection proxy service is expected to be a one-time step in the lifetime of the service. The proxy service will automatically perform any other necessary maintenance from this point onwards. Once it has succeeded for a given proxy, additional invocations of 'Register-AzureADPasswordProtectionProxy' continue to succeed but are unnecessary.

   > [!TIP]
   > There may be a considerable delay (many seconds) the first time this cmdlet is run for a given Azure tenant before the cmdlet completes execution. Unless a failure is reported this delay should not be considered alarming.

5. Register the forest.
   * The on-premises Active Directory forest must be initialized with the necessary credentials to communicate with Azure using the `Register-AzureADPasswordProtectionForest` PowerShell cmdlet. The cmdlet requires global administrator credentials for your Azure tenant as well as on-premises Active Directory domain administrator privileges in the forest root domain. This step is run once per forest.

      The Register-AzureADPasswordProtectionForest cmdlet supports three different authentication modes as follows.

      * Interactive authentication mode:

         ```PowerShell
         Register-AzureADPasswordProtectionForest -AccountUpn 'yourglobaladmin@yourtenant.onmicrosoft.com'
         ```
         > [!NOTE]
         > This mode will not work on Server Core operating systems. Instead use one of the alternative authentication modes as outlined below.

         > [!NOTE]
         > This mode may fail if Internet Explorer Enhanced Security Configuration is enabled. The workaround is to disable IESC, register the proxy, then re-enable IESC.  

      * Device-code authentication mode:

         ```PowerShell
         Register-AzureADPasswordProtectionForest -AccountUpn 'yourglobaladmin@yourtenant.onmicrosoft.com' -AuthenticateUsingDeviceCode
         To sign in, use a web browser to open the page https://microsoft.com/devicelogin and enter the code XYZABC123 to authenticate.
         ```

         You can then complete the authentication by following the displayed instructions on a different device.

      * Silent (password-based) authentication mode:
         ```PowerShell
         $globalAdminCredentials = Get-Credential
         Register-AzureADPasswordProtectionForest -AzureCredential $globalAdminCredentials
         ```

         > [!NOTE]
         > This mode will fail if the authentication requires MFA. If this is the case, please use one of the previous two modes to accomplish an MFA-based authentication.

      The examples above will only succeed if the currently logged in user is also an Active Directory domain administrator for the root domain. If this is not the case, you may supply alternative domain credentials via the -ForestCredential parameter.

   > [!NOTE]
   > If multiple proxy servers are installed in your environment, it does not matter which proxy server is used to register the forest.

   > [!TIP]
   > There may be a considerable delay (many seconds) the first time this cmdlet is run for a given Azure tenant before the cmdlet completes execution. Unless a failure is reported this delay should not be considered alarming.

   > [!NOTE]
   > Registration of the Active Directory forest is expected to be a one-time step in the lifetime of the forest. The domain controller agents running in the forest will automatically perform any other necessary maintainenance from this point onwards. Once it has succeeded for a given forest, additional invocations of `Register-AzureADPasswordProtectionForest` continue to succeed but are unnecessary.

   > [!NOTE]
   > In order for `Register-AzureADPasswordProtectionForest` to succeed at least one Windows Server 2012 or later domain controller must be available in the proxy server's domain. However there is no requirement that the DC agent software be installed on any domain controllers prior to this step.

6. Configure the Azure AD Password Protection Proxy service to communicate through an HTTP proxy

   If your environment requires the use of a specific HTTP proxy to communicate with Azure, this can be accomplished as follows.

   Create a file named `proxyservice.exe.config` file in the `%ProgramFiles%\Azure AD Password Protection Proxy\Service` folder with the following contents:

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

   If your HTTP proxy requires authentication, add the useDefaultCredentials tag as follows:

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

   In both cases you would replace `http://yourhttpproxy.com:8080` with the address and port of your specific HTTP proxy server.

   If your HTTP proxy is configured with an authorization policy, access must be granted to the Active Directory computer account of the machine hosting the Azure AD Password Protection Proxy service.

   You should stop and restart the Azure AD Password Protection Proxy service after creating or updating the `proxyservice.exe.config` file.

   The Azure AD Password Protection Proxy service does not support the use of specific credentials for connecting to an HTTP proxy.

7. Optional: Configure the Azure AD Password Protection Proxy service to listen on a specific port.
   * RPC over TCP is used by the Azure AD Password Protection DC Agent software on the domain controllers to communicate with the Azure AD Password Protection Proxy service. By default, the Azure AD Password Protection Proxy service listens on any available dynamic RPC endpoint. If necessary due to networking topology or firewall requirements, the service may instead be configured to listen on a specific TCP port.
      * To configure the service to run under a static port, use the `Set-AzureADPasswordProtectionProxyConfiguration` cmdlet.
         ```PowerShell
         Set-AzureADPasswordProtectionProxyConfiguration –StaticPort <portnumber>
         ```

         > [!WARNING]
         > You must stop and restart the service for these changes to take effect.

      * To configure the service to run under a dynamic port, use the same procedure but set StaticPort back to zero, like so:
         ```PowerShell
         Set-AzureADPasswordProtectionProxyConfiguration –StaticPort 0
         ```

         > [!WARNING]
         > You must stop and restart the service for these changes to take effect.

   > [!NOTE]
   > The Azure AD Password Protection Proxy service requires a manual restart after any change in port configuration. It is not necessary to restart the DC agent service software running on domain controllers after making configuration changes of this nature.

   * The current configuration of the service may be queried using the `Get-AzureADPasswordProtectionProxyConfiguration` cmdlet as the following example shows:

      ```PowerShell
      Get-AzureADPasswordProtectionProxyConfiguration | fl

      ServiceName : AzureADPasswordProtectionProxy
      DisplayName : Azure AD password protection Proxy
      StaticPort  : 0
      ```

### Install the Azure AD Password Protection DC agent service

   Install the Azure AD Password Protection DC agent service software using the `AzureADPasswordProtectionDCAgent.msi` MSI package

   The software installation does require a reboot on install and uninstall due to the operating system requirement that password filter dlls are only loaded or unloaded upon a reboot.

   It is supported to install the DC agent service on a machine that is not yet a domain-controller. In this case, the service will start and run but will otherwise be inactive until after the machine is promoted to be a domain controller.

   The software installation may be automated using standard MSI procedures, for example:

   `msiexec.exe /i AzureADPasswordProtectionDCAgent.msi /quiet /qn`

   > [!WARNING]
   > The example msiexec command above will result in an immediate reboot; this can be avoided by specifying the `/norestart` flag.

Once installed on a domain controller and rebooted, the Azure AD Password Protection DC Agent software installation is complete. No other configuration is required or possible.

## Multiple forest deployments

There are no additional requirements to deploy Azure AD Password Protection across multiple forests. Each forest is independently configured as described in the single forest deployment section. Each Azure AD Password Protection Proxy can only support domain controllers from the forest it is joined to. The Azure AD Password Protection software in a given forest is unaware of Azure AD Password Protection software deployed in another forest regardless of Active Directory trust configurations.

## Read-only domain controllers

Password changes\sets are never processed and persisted on read-only domain controllers (RODCs); instead, these are forwarded to writable domain controllers. Therefore there is no need to install the DC agent software on RODCs.

## High availability

The main concern with ensuring high availability of Azure AD Password Protection is the availability of the proxy servers, when domain controllers in a forest are attempting to download new policies or other data from Azure. Each DC agent uses a simple round-robin style algorithm when deciding which proxy server to call, and skips over proxy servers that are not responding. For the majority of fully connected Active Directory deployments with healthy replication (of both directory and sysvol state), two (2) proxy servers should be sufficient to ensure availability and therefore timely downloads of new policies and other data. Additional proxy servers may be deployed as desired.

The usual problems associated with high availability are mitigated by the design of the DC agent software. The DC agent maintains a local cache of the most recently downloaded password policy. Even if all registered proxy servers become unavailable for any reason, the DC agent(s) continue to enforce their cached password policy. A reasonable update frequency for password policies in a large deployment is usually on the order of days, not hours or less. Therefore brief outages of the proxy servers do not cause significant impact to the operation of the Azure AD password protection feature or its security benefits.

## Next steps

Now that you have installed the services required for Azure AD Password Protection on your on-premises servers complete the [post-install configuration and gather reporting information](howto-password-ban-bad-on-premises-operations.md) to complete your deployment.

[Conceptual overview of Azure AD Password Protection](concept-password-ban-bad-on-premises.md)

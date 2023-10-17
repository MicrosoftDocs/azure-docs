---
title: Problem installing the Microsoft Entra application proxy Agent Connector
description: How to troubleshoot issues you might face when installing the Application Proxy Agent Connector for Microsoft Entra ID.
services: active-directory
author: kenwith
manager: amycolannino
ms.service: active-directory
ms.subservice: app-proxy
ms.workload: identity
ms.topic: troubleshooting
ms.date: 09/14/2023
ms.author: kenwith
ms.reviewer: ashishj
---

# Problem installing the Application Proxy Agent Connector

Microsoft Entra application proxy Connector is an internal domain component that uses outbound connections to establish the connectivity from the cloud available endpoint to the internal domain.

## General Problem Areas with Connector installation

When the installation of a connector fails, the root cause is usually one of the following areas. **As a precursor to any troubleshooting, be sure to reboot the connector.**

1.  **Connectivity** – to complete a successful installation, the new connector needs to register and establish future trust properties. This is done by connecting to the Microsoft Entra application proxy cloud service.

2.  **Trust Establishment** – the new connector creates a self-signed cert and registers to the cloud service.

3.  **Authentication of the admin** – during installation, the user must provide admin credentials to complete the Connector installation.

> [!NOTE]
> The Connector installation logs can be found in the %TEMP% folder and can help provide additional information on what is causing an installation failure.

## Verify connectivity to the Cloud Application Proxy service and Microsoft Login page

**Objective:** Verify that the connector machine can connect to the Application Proxy registration endpoint as well as Microsoft login page.

1.  On the connector server, run a port test by using [telnet](/windows-server/administration/windows-commands/telnet) or other port testing tool to verify that ports 443 and 80 are open.

2.  If any of those ports is not successful, verify that the Firewall or backend proxy has access to the required domains and ports see, [Prepare your on-premises environment](application-proxy-add-on-premises-application.md#prepare-your-on-premises-environment).

3.  Open a browser (separate tab) and go to the following web page: `https://login.microsoftonline.com`, make sure that you can login to that page.

## Verify Machine and backend components support for Application Proxy trust certificate

**Objective:** Verify that the connector machine, backend proxy and firewall can support the certificate created by the connector for future trust and that the certificate is valid.

>[!NOTE]
>The connector tries to create a SHA512 cert that is supported by TLS1.2. If the machine or the backend firewall and proxy does not support TLS1.2, the installation fails.
>
>

**Review the prerequisites required:**

1.  Verify the machine supports TLS1.2 – All Windows versions after 2012 R2 should support TLS 1.2. If your connector machine is from a version of 2012 R2 or prior, make sure that the [required updates](https://support.microsoft.com/help/2973337/sha512-is-disabled-in-windows-when-you-use-tls-1.2) are installed.

2.  Contact your network admin and ask to verify that the backend proxy and firewall do not block SHA512 for outgoing traffic.

**To verify the client certificate:**

Verify the thumbprint of the current client certificate. The certificate store can be found in `%ProgramData%\microsoft\Microsoft AAD Application Proxy Connector\Config\TrustSettings.xml`.

```
<?xml version="1.0" encoding="utf-8"?>
<ConnectorTrustSettingsFile xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <CloudProxyTrust>
    <Thumbprint>4905CC64B2D81BBED60962ECC5DCF63F643CCD55</Thumbprint>
    <IsInUserStore>false</IsInUserStore>
  </CloudProxyTrust>
</ConnectorTrustSettingsFile>
```

The possible **IsInUserStore** values are **true** and **false**. A value of **true** means the automatically renewed certificate is stored in the personal container in the user certificate store of the Network Service. A value of **false** means the client certificate was created during the installation or registration initiated by Register-AppProxyConnector command and it is stored in the personal container in the certificate store of the local machine.

If the value is **true**, follow these steps to verify the certificate:
1. Download [PsTools.zip](/sysinternals/downloads/pstools)
2. Extract [PsExec](/sysinternals/downloads/psexec) from the package and run **psexec -i -u "nt authority\network service" cmd.exe** from an elevated command prompt.
3. Run **certmgr.msc** in the newly appeared command prompt
4. In the management console expand the Personal container and click on Certificates
5. Locate the certificate issued by **connectorregistrationca.msappproxy.net**

If the value is **false**, follow these steps to verify the certificate:
1. Run **certlm.msc**
2. In the management console expand the Personal container and click on Certificates
3. Locate the certificate issued by **connectorregistrationca.msappproxy.net**

**To renew the client certificate:**

If a connector is not connected to the service for several months, its certificates may be outdated. The failure of the certificate renewal leads to an expired certificate. This makes the connector service to stop working. The event 1000 is recorded in the admin log of the connector:

"Connector re-registration failed: The Connector trust certificate expired. Run the PowerShell cmdlet Register-AppProxyConnector on the computer on which the Connector is running to re-register your Connector."

In this case, uninstall and reinstall the connector to trigger registration or you can run the following PowerShell commands:

```
Import-module AppProxyPSModule
Register-AppProxyConnector
```

To learn more about the Register-AppProxyConnector command, please see [Create an unattended installation script for the Microsoft Entra application proxy connector](./application-proxy-register-connector-powershell.md)

## Verify admin is used to install the connector

**Objective:** Verify that the user who tries to install the connector is an administrator with correct credentials. Currently, the user must be at least an application administrator for the installation to succeed.

**To verify the credentials are correct:**

Connect to `https://login.microsoftonline.com` and use the same credentials. Make sure the login is successful. You can check the user role by going to **Microsoft Entra ID** -&gt; **Users and Groups** -&gt; **All Users**. 

Select your user account, then "Directory Role" in the resulting menu. Verify that the selected role is "Application Administrator". If you are unable to access any of the pages along these steps, you do not have the required role.

## Next steps
[Understand Microsoft Entra application proxy connectors](application-proxy-connectors.md)

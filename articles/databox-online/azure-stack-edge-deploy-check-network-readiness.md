---
title: Check network readiness before deploying an Azure Stack Edge with GPU device
description: Pre-quality network before deploying Azure Stack Edge devices.
services: databox
author: v-dalc

ms.service: databox
ms.subservice: edge
ms.topic: how-to
ms.date: 03/29/2021
ms.author: alkohli

# Customer intent: As an IT admin, I want to save time and avoid Support calls during deployment of Azure Stack Edge devices by verifying network settings in advance.
---

# Check network readiness for Azure Stack Edge devices

[!INCLUDE [applies-to-GPU-and-pro-r-and-mini-r-skus](../../includes/azure-stack-edge-applies-to-gpu-pro-r-mini-r-sku.md)]

This article describes how to check your network for the most common issues in Azure Stack Edge deployments before you deploy an Azure Stack Edge device.<!--Verify ASE SKUs.-->

You'll use the Azure Stack Network Readiness Checker, a PowerShell tool that runs a series of tests to check mandatory and optional settings on the network where you deploy your Azure Stack Edge devices. You can run the tool from any computer on the network where you'll deploy the Azure Stack Edge devices.<!--OS requirements imposed by PowerShell 7.0?--> The tool returns Pass/Fail status for each test and saves a log file and report file with more detail.


## About the tool

The Azure Stack Network Readiness Checker can check whether a network meets the following prerequisites:

- The Domain Name System (DNS) server is available and functioning.

- The Network Time Protocol (NTP) server is available and functioning.
 
- Azure endpoints are available and respond on HTTP, with or without a proxy server.

- The Windows Update server - either the customer-provided Windows Server Update services (WSUS) server or the public Windows Update server - is available and functioning.

- There are no overlapping IP addresses for Edge Compute.<!--Is "Edge Compute" a thing? Should this be "Edge computing"? When is "Edge" used without "Azure Stack"?-->

- DNS resource records registration for Azure Stack Edge is functioning correctly.


<!--The Network Readiness Checker includes the following tests. You can choose which tests to run.

|Test               |Network checks| 
|-------------------|-------------|
|LinkLayer          |Verifies that a layer 2 network link is established on all applicable network interfaces.|
|IpConfig           |WHAT SPECIFICALLY DOES THE TEST VERIFY IN THE CONFIGURATION?|
|DnsServer          |Verifies that Domain Name System (DNS) server(s) are accessible and respond to DNS queries on UDP port 53.|
|TimeServer         |(Recommended) Verifies that Network Time Protocol (NTP) servers respond with system time on UDP port 123 and that the response message meets NTP requirements so that network clients can use the system time.|
|DuplicateIP        |Checks for IP address conflicts between the Azure Stack Edge device and other devices on the network, and for conflicts within the IP address pool that's used for Kubernetes in Azure Stack Edge.|
|Proxy              |(Optional) If you're using a proxy server, verifies that the web proxy server is accessible, that proxy server credentials work, and that the Secure Sockets Layer (SSL) tunnel isn't terminated at the proxy.|
|AzureEndpoint      |Tests endpoints for the Azure Resource Manager login, Azure Resource Manager, Blob storage, COMPUTE?, and the Windows Update server. |
|WindowsUpdateServer|(Optional) Verifies that the Windows Update Server or Windows Update for Business Server is accessible over HTTPS.|
|DnsRegistration    |WHICH DNS SETTINGS? - Endpoint certs match DNS name? DNS records?|-->

## Prerequisites

Before you begin, complete the following tasks:

- Review network requirements in the [Deployment checklist for your Azure Stack Edge Pro GPU device](azure-stack-edge-gpu-deploy-checklist.md). 

- Make sure you have access to a client computer that is running on the network where you'll deploy your Azure Stack Edge devices.

- Install PowerShell 7.0 on the client computer. For guidance, see [What's new in PowerShell 7.0](/powershell/scripting/whats-new/what-s-new-in-powershell-70.md?view=powershell-7.1&preserve-view=true).<!--CONDITIONAL: Tested in PowerShell 5.1.17763.1. Tool spec recommends PowerShell 7.0 to enable multi-platform testing in a Windows/Linux environment. May I install PowerShell 7.0 on the test machine side by side with PowerShell 5.1.17763.1, and run some tests? Ideal messaging: "Install PowerShell 5.1.17763.1 or later. To support multi-platform testing in a Windows-Linux environment, install PowerShell 7.0 or later." Can we verify that the tool runs in the current version of PowerShell 7?-->

- Install the Azure Stack Network Readiness Checker tool in PowerShell by following the steps in [Install Network Readiness Checker](#install-network-readiness-checker), below.


## Install Network Readiness Checker

To install the Azure Stack Network Readiness Checker (NRC) on the client computer, do these steps: 

1. Open PowerShell 7.0 on the client computer.

1. In a browser, go to [Microsoft.AzureStack.ReadinessChecker](https://www.powershellgallery.com/packages/Microsoft.AzureStack.ReadinessChecker/1.2100.1396.426) in the PowerShell Gallery. Version 1.2100.1396.426 of the Microsoft.AzureStack.ReadinessChecker module is displayed.

1. On the **Install Module** tab, select the Copy icon to copy the Install-Module command that installs version 1.2100.1396.426 of the Microsoft.AzureStack.ReadinessChecker.

    ![Click the Copy icon to copy the Install-Module command.](./media/azure-stack-edge-deploy-check-network-readiness/network-readiness-checker-install-tool.png)

1. Paste in the command at the PowerShell command prompt, and press Enter.

1. Press Y (Yes) or A (Yes to All) at the following prompt to install the module.

   ```powershell
   Untrusted repository
   You are installing the modules from an untrusted repository. If you trust this repository, change its InstallationPolicy value by running the Set-PSRepository cmdlet. Are you sure you want to install the modules from 'PSGallery'?
   [Y] Yes  [A] Yes to All  [N] No  [L] No to All  [S] Suspend  [?] Help (default is "N"):
   ```


## Run a network readiness check

When you run the Azure Stack Network Readiness Checker tool, you'll need to provide network and device information from the [Deployment checklist for your Azure Stack Edge Pro GPU device](azure-stack-edge-gpu-deploy-checklist.md).

To run a network readiness check, do these steps:

1. Open PowerShell 7.0 on a client computer running on the network where you'll deploy the Azure Stack Edge device.<!--PowerShell version to be verified.-->

1.  Run a network readiness check by entering the following command:

    ```powershell
    Invoke-AzsNetworkValidation -DnsServer <string[]> -DeviceFqdn <string> [-TimeServer <string[]>] [-Proxy <uri>] [-WindowsUpdateServer <uri[]>] [-SkipTests {LinkLayer | IPConfig | DnsServer | TimeServer | DuplicateIP | AzureEndpoint] |
    WindowsUpdateServer | DnsRegistration}] [-OutputPath <string>]
    ```
    
    Enter the following parameters. This set of parameters (all but `-SkipTests`) is needed to get meaningful Network Readiness Checker results that find key issues in your network setup>

    |Parameter|Description|
    |---------|-----------|
    `-DnsServer`|IP addresses of the DNS servers (for example, your primary and secondary DNS servers).|
    |`-DeviceFqdn`|Fully qualified domain name (FQDN) of the client computer that you're using for the test.| 
    |`-TimeServer`|FQDN of one or more Network Time Protocol (NTP) servers. (Recommended)|
    |`-Proxy`|URI for the proxy server, if you're using a proxy server. (Optional)|
    |`-WindowsUpdateServer`|URIs for one or more Windows Update Servers or Windows Update for Business Servers. (Optional)|
    |`-SkipTests`|Can be used to exclude tests. (Optional)<br> Separate test names with a comma. For a list of test names, see [Network tests](#about-the-tool), above.|
    |`-OutPath`|Tells where to store the log file and report from the tests. (Optional)<br>If you don't use this path, the files are stored in the following path: C:\Users\<username>\AppData\Local\Temp\1\AzsReadinessChecker\AzsReadinessChecker.logs <br>Each run of the Network Readiness Checker overwrites the log and report from the previous run.| 
 

## Sample output: Success

The following sample is the output from a successful run of the Azure Stack Network Readiness Checker tool, with this command:

   `Invoke-AzsNetworkValidation -DnsServer '10.50.10.50', '10.50.50.50' -DeviceFqdn 'aseclient.contoso.com' -TimeServer 'pool.ntp.org' -Proxy 'http://10.57.48.80:8080' -SkipTests DuplicateIP -WindowsUpdateServer "http://ase-prod.contoso.com" -OutputPath C:\ase-network-tests`

```powershell
PS C:\Users\Administrator> Invoke-AzsNetworkValidation -DnsServer '10.50.10.50', '10.50.50.50' -DeviceFqdn 'aseclient.contoso.com' -TimeServer 'pool.ntp.org' -Proxy 'http://10.57.48.80:8080' -SkipTests DuplicateIP -WindowsUpdateServer "http://ase-prod.contoso.com" -OutputPath C:\ase-network-tests

Invoke-AzsNetworkValidation v1.2100.1396.426 started.
The following tests will be executed: LinkLayer, IPConfig, DnsServer, TimeServer, AzureEndpoint, WindowsUpdateServer, DnsRegistration, Proxy
Validating input parameters
Validating Azure Stack Edge Network Readiness
        Link Layer: OK
        IP Configuration: OK
 Using network adapter name 'vEthernet (corp-1g-Static)', description 'Hyper-V Virtual Ethernet Adapter'
        DNS Server 10.50.10.50: OK
        DNS Server 10.50.50.50: OK
        Time Server pool.ntp.org: OK
        Proxy Server 10.57.48.80: OK
        Azure ARM Endpoint: OK
        Azure Graph Endpoint: OK
        Azure Login Endpoint: OK
        Azure ManagementService Endpoint: OK
        Windows Update Server ase-prod.contoso.com port 80: OK
        DNS Registration for aseclient.contoso.com: OK
        DNS Registration for login.aseclient.contoso.com: OK
        DNS Registration for management.aseclient.contoso.com: OK
        DNS Registration for *.blob.aseclient.contoso.com: OK
        DNS Registration for compute.aseclient.contoso.com: OK

Log location (contains PII): C:\ase-network-tests\AzsReadinessChecker.log
Report location (contains PII): C:\ase-network-tests\AzsReadinessCheckerReport.json
Invoke-AzsNetworkValidation Completed
```

## Sample output: Failed test

If a test fails, the Network Readiness Checker returns information to help you resolve the issue, as shown in the sample output below. 

```powershell
   TBD
```

For more information, you can review the log file that the tool saves to the output path. The following sample is the log file entry for the error that the sample command returned.<!--Assuming one exemplary error in the sample above. Will adjust code type in formatting.-->

```powershell
   TBD
```

And there's a report file that WHAT PURPOSE DOES THIS FILE SERVE? WHAT ADDITIONAL INFO? FORMAT DOES NOT LEND ITSELF TO A BRIEF EXCERPT, SO I WILL JUST BRIEFLY DESCRIBE.-->


## Next steps

- Learn how to [Connect to an Azure Stack Edge Pro device](azure-stack-edge-gpu-deploy-connect.md).



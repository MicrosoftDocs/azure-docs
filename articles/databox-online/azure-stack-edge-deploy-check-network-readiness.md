---
title: Check network readiness before deploying an Azure Stack Edge with GPU device
description: Pre-quality network before deploying Azure Stack Edge devices.
services: databox
author: v-dalc

ms.service: databox
ms.subservice: edge
ms.topic: how-to
ms.date: 03/23/2021
ms.author: alkohli

# Customer intent: As an IT admin, I want to save time and avoid Support calls during deployment of Azure Stack Edge devices by verifying network settings in advance.
---

# Check network readiness for Azure Stack Edge devices

[!INCLUDE [applies-to-GPU-and-pro-r-and-mini-r-skus](../../includes/azure-stack-edge-applies-to-gpu-pro-r-mini-r-sku.md)]

This article describes how to check your network for the most common issues in Azure Stack Edge deployments before you deploy an Azure Stack Edge device.<!--Verify ASE SKUs.-->

You'll use the Azure Stack Network Readiness Checker, a PowerShell tool that runs a series of tests to check mandatory and optional settings on the network where you deploy your Azure Stack Edge devices. You can run the tool from any computer on the network where you'll deploy the Azure Stack Edge devices.<!--OS requirements imposed by PowerShell 7.0?--> The tool returns Pass/Fail status for each test and saves a log file and report file with more detail.


## About the tool

The Network Readiness Checker includes the following tests. You can choose which tests to run.

|Test               |Network checks| 
|-------------------|-------------|
|LinkLayer          |Verifies that a layer 2 network link is established on all applicable network interfaces.|
|IpConfig           |WHAT SPECIFICALLY DOES THE TEST VERIFY IN THE CONFIGURATION?|
|DnsServer          |Verifies that Domain Name System (DNS) server(s) are accessible and respond to DNS queries on UDP port 53.|
|TimeServer         |(Recommended) Verifies that Network Time Protocol (NTP) servers respond with system time on UDP port 123 and that the response message meets NTP requirements so that network clients can use the system time.|
|DuplicateIP        |Checks for IP address conflicts between the Azure Stack Edge device and other devices on the network, and for conflicts within the IP address pool that's used for Kubernetes in Azure Stack Edge.|
|Proxy              |(Optional) If you're using a proxy server, verifies that the web proxy server is accessible, that proxy server credentials work, and that the Secure Sockets Layer (SSL) tunnel isn't terminated at the proxy.|
|AzureEndpoint      |Tests endpoints for the Azure Resource Manager login, Azure Resource Manager, Blob storage, COMPUTE?, and the Windows Update server.<!--Basing this on sample data below, correlated with endpoints shown in Device settings in the portal. Please revise as needed.--> |
|WindowsUpdateServer|(Optional) Verifies that the Windows Update Server or Windows Update for Business Server is accessible over HTTPS.|
|DnsRegistration    |WHICH DNS SETTINGS? - Endpoint certs match DNS name? DNS records?|

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

1.  Run a network readiness check by entering the following command:<!--Let's discuss "Required" vs. "Optional". Most of the parameters are optional, but the introduction should discuss what is required to get meaningful Network Readiness Checker results that finds key issues in the network setup.-->

    ```powershell
    Invoke-AzsNetworkValidation -DnsServer <string[]> -DeviceFqdn <string> [-TimeServer <string[]>] [-Proxy <uri>] [-WindowsUpdateServer <uri[]>] [-SkipTests {LinkLayer | IPConfig | DnsServer | TimeServer | DuplicateIP | AzureEndpoint] |
    WindowsUpdateServer | DnsRegistration}] [-OutputPath <string>]
    ```
    
    You'll enter the following parameters:

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

The following sample is the output from a successful run of the Azure Stack Network Readiness Check tool. The script completed, but the WindowsUpdateServer test and DnsRegistration test turned up issues in the network configuration.

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
        Windows Update Server ase-prod.contoso.com port 80: Fail
        DNS Registration for aseclient.contoso.com: OK
        DNS Registration for login.aseclient.contoso.com: Fail
        DNS Registration for management.aseclient.contoso.com: Fail
        DNS Registration for *.blob.aseclient.contoso.com: Fail
        DNS Registration for compute.aseclient.contoso.com: Fail

Log location (contains PII): C:\ase-network-tests\AzsReadinessChecker.log
Report location (contains PII): C:\ase-network-tests\AzsReadinessCheckerReport.json
Invoke-AzsNetworkValidation Completed
```

#### Troubleshooting errors

<!--Vibha: Can we make available more comprehensive troubleshooting for the most common errors in all of the tests?-->

The Invoke-AzsNetworkValidation script completed, but two of the tests failed to complete successfully:

- The Windows Update Server test failed.
- DNS Registration failed for all but the client computer that's being tested. There were DNS registration failures for the Windows Update server, Azure Resource Manager login, Azure Resource Manager, Blob storage, and XXX<!--What does "compute.aseclient.contoso.com" represent? Thanks.-->.

To get more information, you can look for errors in the log file, at C:\ase-network-tests\AzsReadinessChecker.log,as shown below.<!--I will add a snippet that demonstrates what an error looks like in the log after we settle on an exemplary failure to use in this sample.-->

```typescript
<logfile>
SNIPPET TO COME
```

The Readiness Checker report, at C:\ase-network-tests\AzsReadinessCheckerReport.json, offers additional detail.<!--Vibha: What type of additional info would they look for in the report?Thanks.-->  

## Sample output: Failure

The following sample is output from a Network Readiness Checker run that failed at the initial LinkLayer test. No network connection could be made, so all other tests did not run. The test status, on the final line, is `Failed`.

```powershell
PS C:\Users\Administrator> Invoke-AzsNetworkValidation -DnsServer '10.50.10.50', '10.50.50.50' -DeviceFqdn 'aseclient.contoso.com' -TimeServer 'pool.ntp.org' -Proxy 'http://10.57.48.80:8080' -WindowsUpdateServer "http://ase-prod.contoso.com" -SkipTests DuplicateIP -OutputPath C:\ase-network-tests
Invoke-AzsNetworkValidation v1.2100.1396.426 started.
The following tests will be executed: LinkLayer, IPConfig, DnsServer, TimeServer, AzureEndpoint, WindowsUpdateServer, DnsRegistration, Proxy
Validating input parameters
Validating Azure Stack Edge Network Readiness
        Link Layer: Fail
Test failed with error: No network connection

Log location (contains PII): C:\ase-network-tests\AzsReadinessChecker.log
Report location (contains PII): C:\ase-network-tests\AzsReadinessCheckerReport.json
Invoke-AzsNetworkValidation Completed

```
 
## Next steps

- Learn how to [Connect to an Azure Stack Edge Pro device](azure-stack-edge-gpu-deploy-connect.md).



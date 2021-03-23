---
title: Check network readiness before deploying an Azure Stack Edge with GPU device.<!--Verify SKUs.-->
description: Pre-quality network before deploying Azure Stack Edge devices.
services: databox
author: v-dalc

ms.service: databox
ms.subservice: edge
ms.topic: how-to
ms.date: 03/23/2021
ms.author: alkohli

# Customer intent: As an IT admin, I want to save time and avoid Support calls during deployment of Azure Stack devices by verifying the network settings in advance.
---

# Check network readiness for Azure Stack Edge devices

This article describes how to check your network for the most common issues in Azure Stack Edge or Azure Stack Hub before you deploy your devices.<!--Verify ASE SKUs. In Azure Stack Hub, they are deploying VMs, not devices?-->

You'll use the Azure Stack Network Readiness Checker (NRC), a PowerShell tool that runs a series of tests to check mandatory and optional settings on the network where you deploy Azure Stack devices. You can run the tool from any computer on the network.<!--OS requirements imposed by PowerShell 7.0?--> The tool returns Pass/Fail status for each connection and saves a log file and report file with more detail.

The Network Readiness Checker includes the following tests. You can choose which tests to run.

|Test               |Network checks| 
|-------------------|-------------|
|LinkLayer          |Verifies that a layer 2 network link is established on all applicable network interfaces.|
|IpConfig           |WHAT SPECIFICALLY DOES THE TEST VERIFY IN THE CONFIGURATION?|
|DnsServer          |Verifies that Domain Name System (DNS) server(s) are accessible and respond to DNS queries on UDP port 53.|
|TimeServer         |(Recommended) Verifies that Network Time Protocol (NTP) servers respond with system time on UDP port 123 and that the response message meets NTP requirements so that network clients can use the system time.|
|DuplicateIP        |Checks for IP conflicts between Azure Stack networks and existing customer networks, and for conflicts within the IP address pool that used for Kubernetes on Azure Stack.|
|Proxy              |(Optional) If you're using a proxy server, verifies that the web proxy server is accessible, that proxy server credentials work, and that the Secure Sockets Layer (SSL) tunnel isn't terminated at the proxy.<!--What does this mean (from spec)? "An SSL inspection is not supported by Azure Stack."-->|
|AzureEndpoint      |WHICH ENDPOINTS ARE CHECKED? |
|WindowsUpdateServer|(Optional) Verifies that the Windows Update Server or Windows Update for Business Server is accessible over HTTPS.|
|DnsRegistration    |WHICH DNS SETTINGS? - Endpoint certs match DNS name? DNS records?|

## Prerequisites

Before you begin, complete the following tasks:

- Prepare your network using [Deployment checklist for your Azure Stack Edge Pro GPU device](azure-stack-edge-gpu-deploy-checklist.md). 

- Make sure you have access to a client computer that is running on the network where you'll deploy your devices.

- Install PowerShell 7.0 on the client computer. For guidance, see [What's new in PowerShell 7.0](/powershell/scripting/whats-new/what-s-new-in-powershell-70.md?view=powershell-7.1&preserve-view=true).<!--Vibha to verify whether tool has been tested in PowerShell 7.0. PowerShell 7.0 enables multi-platform testing in a Windows/Linux environment.-->

- Install the Azure Stack Network Readiness Checker tool in PowerShell by following the steps in [Install Network Readiness Checker](#install-network-readiness-checker), below.


## Install Network Readiness Checker

To install the Azure Stack Network Readiness Checker (NRC) on the client computer, do these steps: 

1. Open PowerShell 7.0 on the client computer.<!--Do they need to open as Administrator?-->

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

When you run the Azure Stack Network Readiness Tool, you'll need to provide network and device information from the [Deployment checklist for your Azure Stack Edge Pro GPU device](azure-stack-edge-gpu-deploy-checklist.md).

To run a network readiness check, do the following steps:

1. Open PowerShell 7.0 on a client computer running on the network where you'll deploy the Azure Stack Edge device.

1.  Run a network readiness check by entering the following command:<!--1) I switched the order of -WindowsUpdateServer and -SkipTests so that all computer specs preceded the choice of tests. Shouldn't affect output. Test, and then update the sample command. 2) Revisit Required vs. Optional. In this context, should the time server be required? Windows Update servers are recommended but not required? Proxy server is needed if they are using one? Format line will need to be updated based on this.-->

    ```powershell
    Invoke-AzsNetworkValidation -DnsServer <string[]> -DeviceFqdn <string> [-TimeServer <string[]>] [-Proxy <uri>] [-WindowsUpdateServer <uri[]>] [-SkipTests {LinkLayer | IPConfig | DnsServer | TimeServer | DuplicateIP | AzureEndpoint] |
    WindowsUpdateServer | DnsRegistration}] -OutputPath <string>
    ```
    
    where:

    - `-DnsServer`: Provides the IP addresses of one or more DNS servers.
 
    - `-DeviceFqdn`: Provides the fully qualified domain name (FQDN) of the Azure Stack Edge or Azure Stack Hub device.<!--Is this the FQDN of the device they're running the test on or the Azure Stack Edge/Hub device? Do we assume they have installed the device, but not yet connected it? If so, add "Install the device" to the prerequisites?--> 
    
    - `-TimeServer`: Provides the FQDN of one or more Network Time Protocol (NTP) server(s). (Recommended)

    -  `-Proxy`: If you're using a proxy server, provide the URI for the proxy server. (Optional)
    
    - `-WindowsUpdateServer`: Provides the URIs for one or more Windows Update Server(s) or Windows Update for Business Server(s). (Optional)
  
    - `-SkipTests`: Can be used to exclude tests. Separate test names with a comma. (Optional)
   
    - `-OutPath`: Tells where to store the log file and report from the tests. DEFAULT PATH?
 

## Sample tool output

The following sample is the output from the Azure Stack Network Readiness Check (NRC) tool.<!--Discuss what failed. Anything else to note?-->

```powershell
PS C:\Users\Administrator> Invoke-AzsNetworkValidation -DnsServer '10.50.10.50', '10.50.50.50' -DeviceFqdn 'gusp-dtp.northamerica.corp.contoso.com' -TimeServer 'pool.ntp.org' -Proxy 'http://10.57.48.80:8080' -SkipTests DuplicateIP -WindowsUpdateServer "http://storsimpleprod.frontendprodmt.selfhost.corp.contoso.com" -OutputPath C:\gusp

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
        Windows Update Server storsimpleprod.frontendprodmt.selfhost.corp.contoso.com port 80: Fail
        DNS Registration for gusp-dtp.northamerica.corp.contoso.com: OK
        DNS Registration for login.gusp-dtp.northamerica.corp.contoso.com: Fail
        DNS Registration for management.gusp-dtp.northamerica.corp.contoso.com: Fail
        DNS Registration for *.blob.gusp-dtp.northamerica.corp.contoso.com: Fail
        DNS Registration for compute.gusp-dtp.northamerica.corp.contoso.com: Fail

Log location (contains PII): C:\gusp\AzsReadinessChecker.log
Report location (contains PII): C:\gusp\AzsReadinessCheckerReport.json
Invoke-AzsNetworkValidation Completed
```
 
## Next steps

- Learn how to [Connect to an Azure Stack Edge Pro device](azure-stack-edge-gpu-deploy-connect.md).




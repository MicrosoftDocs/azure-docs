---
title: Check network readiness before deploying an Azure Stack Edge with GPU device.<!--Verify SKUs.-->
description: Pre-quality network before deploying Azure Stack Edge devices.
services: databox
author: v-dalc

ms.service: databox
ms.subservice: edge
ms.topic: how-to
ms.date: 03/22/2021
ms.author: alkohli

# Customer intent: As an IT admin, I want to expedite deployment of Azure Stack devices by checking network settings in advance.
---

# Check network readiness for Azure Stack Edge devices

This article describes how to check your network for the most common deployment issues in Azure Stack Edge or Azure Stack Hub before deploying your devices.<!--Verify ASE SKUs. In Azure Stack Hub, they are deploying VMs, not devices?-->

You'll use the Azure Stack Network Readiness Checker (NRC), a PowerShell module that can be used to run a series of tests to check mandatory and optional settings on the network where you'll deploy an Azure Stack Edge device. You can run the tool from any computer on the network.<!--OS requirements imposed by PowerShell 7.0?--> The tool returns Pass/Fail status for each setting that it tests, and saves a log file and report file.

The Network Readiness Checker includes the following tests. You can choose which tests to run.

|Test               |Network checks| 
|-------------------|-------------|
|LinkLayer          |Verifies that a layer 2 network link is established on all applicable network interfaces.|
|IpConfig           |WHAT SPECIFICALLY DOES THE TEST VERIFY IN THE CONFIGURATION?|
|DnsServer          |Verifies that Domain Name System (DNS) server(s) are accessible and respond to DNS queries on UDP port 53.|      |
|TimeServer         |(Recommended) Verifies that Network Time Protocol (NTP) server(s) respond with system time on UDP port 123 and the response message meets NTP requirements, so network clients can use the system time.|
|DuplicateIP        |Checks for IP conflicts between Azure Stack networks and existing customer networks, and for conflicts within the IP address pool that used for Kubernetes on Azure Stack.|
|Proxy              |(Optional) If you're using a proxy server, verifies that the web proxy server is accessible, that proxy server credentials work correctly, and that the Secure Sockets Layer (SSL) tunnel isn't terminated at the proxy.<!--What does this mean (from spec)? "An SSL inspection is not supported by Azure Stack."-->|
|AzureEndpoint      |WHICH ENDPOINTS ARE CHECKED? |
|WindowsUpdateServer|(Optional) Verifies that the Windows Update Server or Windows Update for Business Server is accessible over HTTPS.|
|DnsRegistration    |WHICH DNS SETTINGS? - Endpoint certs match DNS name? DNS records?|

## Prerequisites

Before you begin, complete the following tasks:

- Prepare your network using [Deployment checklist for your Azure Stack Edge Pro GPU device](azure-stack-edge-gpu-deploy-checklist.md). 
- Make sure you have access to a client computer that is running on the network where you'll deploy your devices.
- Install PowerShell 7.0 on the client computer. For guidance, see [What's new in PowerShell 7.0](/powershell/scripting/whats-new/what-s-new-in-powershell-70.md?view=powershell-7.1&preserve-view=true).<!--Vibha to verify whether tool has been tested in PowerShell 7.0. PowerShell 7.0 enables multi-platform testing in a Windows/Linux environment.-->
- Install the Azure Stack Network Readiness Checker tool in PowerShell by following the steps in [Install Network Readiness Checker](azure-stack-edge-check-network=readiness.md#install-network-readiness-checker), below.

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

## Run a Network Readiness Check

1. Open PowerShell 7.0 on a client computer running on the network where you will deploy the Azure Stack Edge device.

1.  Run a network readiness check by entering the following command:<!--Would the full set of parameters not be described in a PowerShell module reference? This article should document the parameters to run to meet pre-qualification needs before deployment?-->

    ```powershell
    Invoke-AzsNetworkValidation [-RunTests {LinkLayer | IPConfig | DnsServer | TimeServer |
    DuplicateIP | Proxy | AzureEndpoint | WindowsUpdateServer | DnsRegistration}] [-SkipTests
    {LinkLayer | IPConfig | DnsServer | TimeServer | DuplicateIP | AzureEndpoint |
    WindowsUpdateServer | DnsRegistration}] [-DnsServer <string[]>] [-DnsName <string>]  [-DeviceFqdn
    <string>] [-TimeServer <string[]>] [-ComputeIPs <string[]>] [-AzureEnvironment {AzureCloud |
    AzureChinaCloud | AzureGermanCloud | AzureUSGovernment | CustomCloud}] [-CustomCloudArmEndpoint
    <uri>] [-Proxy <uri>] [-ProxyCredential <pscredential>] [-ExternalUri <uri>]
    [-WindowsUpdateServer <uri[]>] [-OutputPath <string>] [-CleanReport] [<CommonParameters>]
    ```

#### Usage notes
 
To test the network settings, customer needs to provide contextual info such as XXX. 

TWO SCENARIOS? Tool can be used to pre-qualify the network before deploying an Azure Stack device, or for diagnostics after deploying the device.

Do some parameters apply to Azure Stack Edge only and some to Azure Stack Hub only?

What's the baseline set of parameters needed to verify network settings pre-deployment? in Edge? in Hub?

#### Parameters

<!--1) Verify what is required and what is not. Format string suggests no parameter is required from the tool's perspective. 2) Strongly recommended parameters that are not required? 3) Some parameters are only available after the device is deployed (but before it's connected)? 4) Some parameters are dependent on others? Example: No need for proxy credentials if you don't specify a proxy server?-->

The Network Readiness Checker accepts the following parameters:

   - `-RunTests`: Is used to specify which tests to run. All tests run if you don't include the parameter. Separate test names with a comma. (Optional)
   
   - `-SkipTests`: Is used to specify tests to exclude. Separate test names with a comma. (Optional)
   
   - `-DnsServer`>: Provides the IP addresses of one or more DNS servers.
   
   -  `-DnsName`: Provides the name of the DNS server(s). (Optional)<!--Is this the friendly name of the DNS server? Sample output only includes the IP addresses of the DNS server? How is this used?--)
   
   -  `-DeviceFqdn`: Specifies the  the fully qualified domain name(s) (FQDNs) of the Stack Edge device.<!--Will they have deployed the device?--> 
   
   - `-TimeServer`: Specifies the FQDNs of the Network Time Protocol (NTP) server(s). This is a recommended option.
   
   - `-ComputeIps`: Specifies the IP addresses of the compute resources.<!--If they have deployed the device, where can they find this?-->
   
   - `-AzureEnvironment`: Specifies the Azure environment in which the Azure Stack Edge or Azure Stack Hub device will be deployed.<!--If they don't include this parameter, will the test run in the Azure Cloud? Only needed if they are in another environment?--> Enter one of the following values:<!--Where are these explained?-->
      |Value            |Environment |
      |-----------------|------------|
      |AzureCloud       |            |
      |AzureChinaCloud  |            |
      |AzureGermanCloud |            |
      |AzureUSGovernment|            |
      |CustomCloud      |            |
  
  - `-CustomCloudArmEndpoint`: Specifies the URI for XXX.
  
  - `-Proxy`: If you're using a proxy server, specifies the URI for the proxy server.
  
  - `-ProxyCredential`: Specifies credentials used for the proxy server.
  
  - `-ExternalUri`: Specifies the external URI for XXX.
  
  - `-WindowsUpdateServer`: (Optional) Specifies the URIs for one or more Windows Update Server(s) or Windows Update for Business Server(s).
  
  - `-OutPath`: Specifies where to store the log file and report from the tests. DEFAULT PATH?
  
  - `-CleanReport`: DOES WHAT?
  
  - `-<CommonParameters>`: WHAT COMMON PARAMETERS ARE AVAILABLE, AND WHAT DOES THIS GROUPING DO?

## Sample tool output

The following is sample output from the Azure Stack Network Readiness Check (NRC) tool.<!--Discuss what failed. Anything else to note?-->

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




---
title: Azure Stack telemetry | Microsoft Docs
description: Describes how to configure Azure Stack telemetry settings using PowerShell.
services: azure-stack
documentationcenter: ''
author: jeffgilb
manager: femila
editor: ''

ms.assetid: 
ms.service: azure-stack
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: get-started-article
ms.date: 10/15/2018
ms.author: jeffgilb
ms.reviewer: comartin
---
# Azure Stack telemetry

*Applies to: Azure Stack integrated systems and Azure Stack Development Kit*

Azure Stack telemetry automatically uploads system data to Microsoft via the Connected User Experience. Microsoft teams use the data that Azure Stack telemetry gathers to improve customer experiences. This data is also used for security, health, quality, and performance analysis.

For an Azure Stack operator, telemetry can provide valuable insights into enterprise deployments and gives you a voice that helps shape future versions of Azure Stack.

> [!NOTE]
> You can also configure Azure Stack to forward usage information to Azure for billing. This is required for Multi-Node Azure Stack customers who choose pay-as-you-use billing. Usage reporting is controlled independently from telemetry and is not required for Multi-Node customers who choose the capacity model or for Azure Stack Development Kit users. For these scenarios, usage reporting can be turned off [using the registration script](https://docs.microsoft.com/azure/azure-stack/azure-stack-usage-reporting).

Azure Stack telemetry is based on the Windows Server 2016 Connected User Experience and Telemetry component, which uses the [Event Tracing for Windows (ETW)](https://msdn.microsoft.com/library/dn904632(v=vs.85).aspx) TraceLogging technology to gather and store events and data. Azure Stack components use the same technology to publish events and data gathered by using public operating system event logging and tracing APIs. Examples of these Azure Stack components include these providers: Network Resource, Storage Resource, Monitoring Resource, and Update Resource. The Connected User Experience and Telemetry component encrypts data using SSL and uses certificate pinning to transmit data over HTTPS to the Microsoft Data Management service.

> [!IMPORTANT]
> To enable telemetry data flow, port 443 (HTTPS) must be open in your network. The Connected User Experience and Telemetry component connects to the Microsoft Data Management service at https://v10.vortex-win.data.microsoft.com. The Connected User Experience and Telemetry component also connects to https://settings-win.data.microsoft.com to download configuration information.

## Privacy considerations

The ETW service routes telemetry data back to protected cloud storage. The principle of least privilege guides access to telemetry data. Only Microsoft personnel with a valid business need are given access to the telemetry data. Microsoft doesn't share personal customer data with third parties, except at the customer’s discretion or for the limited purposes described in the [Microsoft Privacy Statement](https://privacy.microsoft.com/PrivacyStatement). Business reports that are shared with OEMs and partners include aggregated, anonymized data. Data sharing decisions are made by an internal Microsoft team including privacy, legal, and data management stakeholders.

Microsoft believes in, and practices information minimization. We strive to gather only the information that's needed, and store it for only as long as necessary to provide a service or for analysis. Much of the information about how the Azure Stack system and Azure services are functioning is deleted within six months. Summarized or aggregated data will be kept for a longer period.

We understand that the privacy and security of customer information is important.  Microsoft takes a thoughtful and comprehensive approach to customer privacy and the protection of customer data in Azure Stack. IT administrators have controls to customize features and privacy settings at any time. Our commitment to transparency and trust is clear:

- We're open with customers about the types of data we gather.
- We put enterprise customers in control — they can customize their own privacy settings.
- We put customer privacy and security first.
- We're transparent about how telemetry data gets used.
- We use telemetry data to improve customer experiences.

Microsoft doesn't intend to gather sensitive data, such as credit card numbers, usernames and passwords, email addresses, or similar sensitive information. If we determine that sensitive information has been inadvertently received, we delete it.

## Examples of how Microsoft uses the telemetry data

Telemetry plays an important role in helping to quickly identify and fix critical reliability issues in customer deployments and configurations. Insights from telemetry data can help identify issues with services or hardware configurations. Microsoft’s ability to get this data from customers and drive improvements to the ecosystem, raises the bar for the quality of integrated Azure Stack solutions.

Telemetry also helps Microsoft to better understand how customers deploy components, use features, and use services to achieve their business goals. These insights help prioritize engineering investments in areas that can directly impact customer experiences and workloads.

Some examples include customer use of containers, storage, and networking configurations that are associated with Azure Stack roles. We also use the insights to drive improvements and intelligence into Azure Stack management and monitoring solutions. These improvements make it easier for customers to diagnose issues and save money by making fewer support calls to Microsoft.

## Manage telemetry collection

We don't recommended turning off telemetry in your organization. However, in some scenarios this may be necessary.

In these scenarios, you can configure the telemetry level sent to Microsoft by using registry settings before you deploy Azure Stack, or by using the Telemetry Endpoints after you deploy Azure Stack.

### Telemetry levels and data collection

Before you change telemetry settings, you should understand the telemetry levels and what data is collected at each level.

The telemetry settings are grouped into four levels (0-3) that are cumulative and categorized as the follows:

**0 (Security)**</br>
Security data only. Information that’s required to keep the operating system secure. This includes data about the Connected User Experience and Telemetry component settings, and Windows Defender. No telemetry specific to Azure Stack is emitted at this level.

**1 (Basic)**</br>
Security data, and Basic Health and Quality data. Basic device information, including: quality-related data, app compatibility, app usage data, and data from the **Security** level. Setting your telemetry level to Basic enables Azure Stack telemetry. The data gathered at this level includes:

- *Basic device information* that provides an understanding about the types and configurations of native and virtual Windows Server 2016 instances in the ecosystem. This includes:

  - Machine attributes, such as the OEM, and model.
  - Networking attributes, such as the number of network adapters and their speed.
  - Processor and memory attributes, such as the number of cores, and amount of installed memory.
  - Storage attributes, such as the number of drives, type of drive, and drive size.

- *Telemetry functionality*, including the percentage of uploaded events, dropped events, and the last data upload time.
- *Quality-related information* that helps Microsoft develop a basic understanding of how Azure Stack is performing. For example, the count of critical alerts on a particular hardware configuration.
- *Compatibility data* that helps provide an understanding about which Resource Providers are installed on a system and a virtual machine. This identifies potential compatibility problems.

**2 (Enhanced)**</br>
Additional insights, including: how the operating system and Azure Stack services are used, how these services perform, advanced reliability data, and data from the **Security** and **Basic** levels.

> [!NOTE]
> This is the default telemetry setting.

**3 (Full)**</br>
All data necessary to identify and help to fix problems, plus data from the **Security**, **Basic**, and **Enhanced** levels.

> [!IMPORTANT]
> These telemetry levels only apply to Microsoft Azure Stack components. Non-Microsoft software components and services that are running in the Hardware Lifecycle Host from Azure Stack hardware partners may communicate with their cloud services outside of these telemetry levels. You should work with your Azure Stack hardware solution provider to understand their telemetry policy, and how you can opt in or opt out.

Turning off Windows and Azure Stack telemetry also disables SQL telemetry. For more information about the implications of the Windows Server telemetry settings, see the [Windows Telemetry Whitepaper](https://aka.ms/winservtelemetry).

### ASDK: set the telemetry level in the Windows registry

You can use the Windows Registry Editor to manually set the telemetry level on the physical host computer before you deploy Azure Stack. If a management policy already exists, such as Group Policy, it overrides this registry setting.

Before deploying Azure Stack on the development kit host, boot into CloudBuilder.vhdx and run the following script in an elevated PowerShell window:

```powershell
### Get current AllowTelmetry value on DVM Host
(Get-ItemProperty -Path "HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\DataCollection" `
-Name AllowTelemetry).AllowTelemetry
### Set & Get updated AllowTelemetry value for ASDK-Host
Set-ItemProperty -Path "HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\DataCollection" `
-Name "AllowTelemetry" -Value '0' # Set this value to 0,1,2,or3.  
(Get-ItemProperty -Path "HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\DataCollection" `
-Name AllowTelemetry).AllowTelemetry
```

### ASDK and Multi-Node: enable or disable telemetry after deployment

To enable or disable telemetry after deployment, you need to have access to the Privileged End Point (PEP) which is exposed on the ERCS VMs.

1. To Enable: `Set-Telemetry -Enable`
2. To Disable: `Set-Telemetry -Disable`

PARAMETER details:
> .PARAMETER Enable - Turn On telemetry data upload</br>
> .PARAMETER Disable - Turn Off telemetry data upload  

**Script to enable telemetry:**

```powershell
$ip = "<IP ADDRESS OF THE PEP VM>" # You can also use the machine name instead of IP here.
$pwd= ConvertTo-SecureString "<CLOUD ADMIN PASSWORD>" -AsPlainText -Force
$cred = New-Object System.Management.Automation.PSCredential ("<DOMAIN NAME>\CloudAdmin", $pwd)
$psSession = New-PSSession -ComputerName $ip -ConfigurationName PrivilegedEndpoint -Credential $cred
Invoke-Command -Session $psSession {Set-Telemetry -Enable}
if($psSession)
{
    Remove-PSSession $psSession
}
```

**Script to disable telemetry:**

```powershell
$ip = "<IP ADDRESS OF THE PEP VM>" # You can also use the machine name instead of IP here.
$pwd= ConvertTo-SecureString "<CLOUD ADMIN PASSWORD>" -AsPlainText -Force
$cred = New-Object System.Management.Automation.PSCredential ("<DOMAIN NAME>\CloudAdmin", $pwd)
$psSession = New-PSSession -ComputerName $ip -ConfigurationName PrivilegedEndpoint -Credential $cred
Invoke-Command -Session $psSession {Set-Telemetry -Disable}
if($psSession)
{
    Remove-PSSession $psSession
}
```

## Next steps

[Register Azure Stack with Azure](azure-stack-registration.md)
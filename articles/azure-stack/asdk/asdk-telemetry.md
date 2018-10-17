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
pms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 10/15/2018
ms.author: jeffgilb
ms.reviewer: misainat
---

# Azure Stack telemetry

Azure Stack system data, or telemetry, is automatically uploaded to Microsoft via the Connected User Experience. Data gathered from Azure Stack telemetry is used by Microsoft teams primarily to improve our customer experiences, and for security, health, quality, and performance analysis.

As an Azure Stack operator, telemetry can provide valuable insights into enterprise deployments and gives you a voice that helps shape future versions of Azure Stack.

> [!NOTE]
> Azure Stack can also be configured to forward usage information to Azure for billing. This is required for Multi-Node Azure Stack customers who choose pay-as-you-use billing. Usage reporting is controlled independently from telemetry and is not required for Multi-node customers who choose the capacity model or for Azure Stack Development Kit users. For these scenarios, usage reporting can be turned off [using the registration script](https://docs.microsoft.com/azure/azure-stack/azure-stack-usage-reporting).

Azure Stack telemetry is based on the Windows Server 2016 Connected User Experience and Telemetry component, which uses the [Event Tracing for Windows (ETW)](https://msdn.microsoft.com/library/dn904632(v=vs.85).aspx) trace logging technology to gather and store telemetry events and data. Azure Stack components use the same logging technology to publish events and data that are gathered by using public operating system event logging and tracing APIs. Examples of Azure Stack components include Network Resource Provider, Storage Resource Provider, Monitoring Resource Provider, and Update Resource Provider. The Connected User Experience and Telemetry component encrypts data using SSL and uses certificate pinning to transmit telemetry data over HTTPS to the Microsoft Data Management service.

> [!NOTE]
> To support telemetry data flow, port 443 (HTTPS) must be open in your network. The Connected User Experience and Telemetry component connects to the Microsoft Data Management service at https://v10.vortex-win.data.microsoft.com. The Connected User Experience and Telemetry component also connects to https://settings-win.data.microsoft.com to download configuration information.

## Privacy considerations
The ETW service routes telemetry data back to protected cloud storage. The principle of least privileged guides access to telemetry data. Only Microsoft personnel with a valid business need are permitted access to the telemetry data. Microsoft does not share personal data of our customers with third parties, except at the customer’s discretion or for the limited purposes described in the [Azure Stack Privacy Statement](https://privacy.microsoft.com/PrivacyStatement). We do share business reports with OEMs and partners that include aggregated, anonymized telemetry information. Data sharing decisions are made by an internal Microsoft team including privacy, legal, and data management stakeholders.

Microsoft believes in and practices information minimization. We strive to gather only the information that we need, and we store it for only as long as it’s needed to provide a service or for analysis. Much of the information about how the Azure Stack system and Azure services are functioning is deleted within six months. Summarized or aggregated data are kept for a longer period.

We understand that the privacy and security of our customers’ information is important. We have taken a thoughtful and comprehensive approach to customer privacy and the protection of customer data with Azure Stack. IT administrators have controls to customize features and privacy settings at any time. Our commitment to transparency and trust is clear:
- We are open with customers about the types of data we gather.
- We put enterprise customers in control—they can customize their own privacy settings.
- We put customer privacy and security first.
- We are transparent about how telemetry gets used.
- We use telemetry to improve customer experiences.

Microsoft does not intend to gather sensitive information, such as credit card numbers, usernames and passwords, email addresses, or other similarly sensitive information. If we determine that sensitive information has been inadvertently received, we delete it.

## Examples of how Microsoft uses the telemetry data
Telemetry plays an important role in helping us quickly identify and fix critical reliability issues in our customers’ deployments and configurations. Insights into the telemetry data that we gather help us quickly identify issues with services or hardware configurations. Microsoft’s ability to get this data from customers and drive improvements into the ecosystem helps raise the bar for the quality of our integrated Azure Stack solutions.

Telemetry also helps Microsoft to better understand how customers deploy components, use features, and use services to achieve their business goals. Getting insights from that data helps prioritize engineering investments in areas that can directly impact our customers’ experiences and workloads.

Some examples include customer usage of containers, storage, and networking configurations that are associated with Azure Stack roles. We also use the insights to drive improvements and intelligence into some of our management and monitoring solutions. This helps customers to diagnose quality issues and save money by making fewer support calls to Microsoft.

## Manage telemetry collection
We do not recommend that you turn off telemetry in your organization as telemetry provides data that drives improved product functionality and stability. We do recognize however, that in some scenarios this may be necessary.

In these instances, you can configure the telemetry level sent to Microsoft by using registry settings pre- deployment or using the Telemetry Endpoints post deployment.

### Set telemetry level in the Windows registry
The Windows Registry Editor is used to manually set the telemetry level on the physical host computer prior to deploying Azure Stack. If a management policy already exists, such as Group Policy, it overrides this registry setting.

Before deploying Azure Stack on the development kit host, boot into the CloudBuilder.vhdx and run the following script in an elevated PowerShell window:

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

The telemetry levels are cumulative and categorized into four levels (0-3):

**0 (Security)**. Security data only. Information that’s required to help keep the operating system secure, including data about the Connected User Experience and Telemetry component settings and Windows Defender. No Azure Stack specific telemetry is emitted at this level.

**1 (Basic)**. Security data, and Basic Health and Quality data. Basic device information, including: quality-related data, app compatibility, app usage data, and data from the Security level. Setting your telemetry level to Basic enables Azure Stack telemetry. The data gathered at this level includes:

- **Basic device information** that helps provide an understanding about the types and configurations of native and virtualized Windows Server 2016 instances in the ecosystem, including:
  - Machine attributes, such as the OEM, model,
  - Networking attributes, such as the number and speed of network adapters,
  - Processor and memory attributes, such as the number of cores, memory size,
  - Storage attributes, such as the number of drives, type, and size.
- **Telemetry Functionality**, including percent of uploaded events, dropped events, and the last upload time.
- **Quality-related information** that helps Microsoft develop a basic understanding of how Azure Stack is performing. An example is the count of critical alerts on a particular hardware configuration.
- **Compatibility data**, which helps provide an understanding about which Resource Providers are installed on a system and virtual machine and identifies potential compatibility problems.

**2 (Enhanced)**. Additional insights, including: how the operating system, and other Azure Stack services are used, how they perform, advanced reliability data, and data from both the Basic and Security levels.

**3 (Full)**. All data necessary to identify and help to fix problems, plus data from the **Security**, **Basic**, and **Enhanced** levels.

> [!NOTE]
> The default telemetry level value is 2 (enhanced).

Turning off Windows and Azure Stack telemetry disables SQL telemetry. For additional information about the implications of the Windows Server telemetry settings, reference the [Windows Telemetry Whitepaper](https://aka.ms/winservtelemetry).

> [!IMPORTANT]
> These telemetry levels only apply to Microsoft Azure Stack components. Non-Microsoft software components and services that are running in the Hardware Lifecycle Host from Azure Stack hardware partners may communicate with their cloud services outside of these telemetry levels. You should work with your Azure Stack hardware solution provider to understand their telemetry policy, and how you can opt in or opt out.

### Enable or disable telemetry after deployment

To enable or disable telemetry after deployment, you need to have access to the Privileged End Point (PEP) which is exposed on the ERCS VMs.
1.	To Enable: `Set-Telemetry -Enable`
2.	To Disable: `Set-Telemetry -Disable`

PARAMETER Detail:
> .PARAMETER Enable - Turn On telemetry data upload

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
[Start and stop the ASDK](asdk-start-stop.md)

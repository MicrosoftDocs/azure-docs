---
title: Using the Microsoft Defender for Endpoint license included with Azure Security Center
description: Learn about Microsoft Defender for Endpoint and deploying it from Azure Security Center.
services: security-center
documentationcenter: na
author: memildin
manager: rkarlin
ms.service: security-center
ms.devlang: na
ms.topic: how-to
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 10/20/2020
ms.author: memildin
---

# Protect your endpoints with Security Center's integrated EDR solution: Microsoft Defender for Endpoint

Microsoft Defender for Endpoint is a holistic, cloud delivered endpoint security solution. Its main features are:

- Risk-based vulnerability management and assessment 
- Attack surface reduction
- Behavioral based and cloud-powered protection
- Endpoint detection and response (EDR)
- Automatic investigation and remediation
- Managed hunting services

Defender for Endpoint is included at no additional cost with **Azure Defender for servers**. Alternatively, it can be purchased separately for 50 machines or more.

> [!TIP]
> Originally launched as **Windows Defender ATP**, this Endpoint Detection and Response (EDR) product was renamed in 2019 as **Microsoft Defender ATP**.
>
> At Ignite 2020, we launched the [Microsoft Defender XDR suite](https://www.microsoft.com/security/business/threat-protection) and this EDR component was renamed **Microsoft Defender for Endpoint**.


## Availability

| Aspect                          | Details                                                                                                                                                                                                                                                                                                       |
|---------------------------------|:--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Release state:                  | Generally available (GA)                                                                                                                                                                                                                                                                                      |
| Pricing:                        | Requires [Azure Defender for servers](security-center-pricing.md)                                                                                                                                                                                                                                             |
| Supported platforms:            | ![Yes](./media/icons/yes-icon.png) Azure machines running Windows<br>![Yes](./media/icons/yes-icon.png) Azure Arc machines running Windows<br>Microsoft Defender for Endpoint is built into Windows 10 1703 (and newer) and Windows Server 2019. It does not require any agents to be installed on these versions.<br>Security Center supports detection on Windows Server 2016, 2012 R2, and 2008 R2 SP1.<br>Server endpoint monitoring using this integration has been disabled for Office 365 GCC customers. |
| Required roles and permissions: | To enable/disable the integration: **Security admin** or **Owner**<br>To view MDATP alerts in Security Center: **Security reader**, **Reader**, **Resource Group Contributor**, **Resource Group Owner**, **Security admin**, **Subscription owner**, or **Subscription Contributor**                         |
| Clouds:                         | ![Yes](./media/icons/yes-icon.png) Commercial clouds.<br>![No](./media/icons/no-icon.png) GCC customers running workloads in global Azure clouds<br>![Yes](./media/icons/yes-icon.png) US Gov<br>![No](./media/icons/no-icon.png) China Gov, Other Gov                                                        |
|                                 |                                                                                                                                                                                                                                                                                                               |


## Microsoft Defender for Endpoint features in Security Center

Microsoft Defender for Endpoint provides:

- **Advanced post-breach detection sensors**. Defender for Endpoint's sensors for Windows machines collect a vast array of behavioral signals.

- **Analytics-based, cloud-powered, post-breach detection**. Defender for Endpoint quickly adapts to changing threats. It uses advanced analytics and big data. It's amplified by the power of the Intelligent Security Graph with signals across Windows, Azure, and Office to detect unknown threats. It provides actionable alerts and enables you to respond quickly.

- **Threat intelligence**. Defender for Endpoint generates alerts when it identifies attacker tools, techniques, and procedures. It uses data generated by Microsoft threat hunters and security teams, augmented by intelligence provided by partners.

By integrating Defender for Endpoint with Security Center, you'll benefit from the following additional capabilities:

- **Automated onboarding**. Security Center automatically enables the Microsoft Defender for Endpoint sensor for all Windows servers monitored by Security Center (unless they're running Windows Server 2019).

- **Single pane of glass**. The Security Center console displays Microsoft Defender for Endpoint alerts. To investigate further, use Microsoft Defender for Endpoint's own portal pages where you'll see additional information such as the alert process tree and the incident graph. You can also see a detailed machine timeline that shows every behavior for a historical period of up to six months.

    :::image type="content" source="./media/security-center-wdatp/microsoft-defender-security-center.png" alt-text="Microsoft Defender for Endpoint's own Security Center" lightbox="./media/security-center-wdatp/microsoft-defender-security-center.png":::

## Data storage location

When you use Azure Security Center to monitor your servers, a Microsoft Defender for Endpoint tenant is automatically created. Data collected by Defender for Endpoint is stored in the geo-location of the tenant as identified during provisioning. Customer data - in pseudonymized form - may also be stored in the central storage and processing systems in the United States. 

After you've configured the location, you can't change it. If you need to move your data to another location, contact Microsoft Support to reset the tenant.


## Enable Microsoft Defender for Endpoint to access Azure Security Center data

1. Enable **Azure Defender for servers**. See [Pricing of Azure Security Center](security-center-pricing.md#enable-azure-defender).

    > [!NOTE]
    > To protect your Azure-native VMs with Microsoft Defender for Endpoint, Azure Defender for servers on your **subscription**. To protect your Azure Arc enabled machines, you can enable Azure Defender at the workspace level.

1. If you've already deployed Microsoft Defender for Endpoints on your servers, remove it using the procedure described in [Offboard Windows servers](https://docs.microsoft.com/windows/security/threat-protection/microsoft-defender-atp/configure-server-endpoints#offboard-windows-servers).
1. From Security Center's menu, select **Pricing & settings**.
1. Select the subscription you want to change.
1. Select **Threat detection**.
1. Select **Allow Windows Defender ATP to access my data**, and select **Save**.

    :::image type="content" source="./media/security-center-wdatp/enable-integration-with-edr.png" alt-text="Enable the integration between Azure Security Center and Microsoft's EDR solution, Microsoft Defender for Endpoint":::

    Azure Security Center will automatically onboard your servers to Microsoft Defender for Endpoint. Onboarding might take up to 24 hours.


## Access the Microsoft Defender for Endpoint portal

1. Ensure the user account has the necessary permissions. [Learn more](https://docs.microsoft.com/windows/security/threat-protection/microsoft-defender-atp/assign-portal-access).

1. Check whether you have a proxy or firewall that is blocking anonymous traffic. The Defender for Endpoint sensor connects from the system context, so anonymous traffic must be permitted. To ensure unhindered access to the Defender for Endpoint portal, follow the instructions in [Enable access to service URLs in the proxy server](https://docs.microsoft.com/windows/security/threat-protection/microsoft-defender-atp/configure-proxy-internet#enable-access-to-microsoft-defender-atp-service-urls-in-the-proxy-server).

1. Open the [Microsoft Defender Security Center portal](https://securitycenter.windows.com/). Learn more about the portal's features and icons, in [Microsoft Defender Security Center portal overview](https://docs.microsoft.com/windows/security/threat-protection/microsoft-defender-atp/portal-overview). 

## Send a test alert

To generate a benign Microsoft Defender for Endpoint test alert:

1. Create a folder 'C:\test-MDATP-test'.
1. Use Remote Desktop to access either a Windows Server 2012 R2 VM or a Windows Server 2016 VM.
1. Open a command-line window.
1. At the prompt, copy and run the following command. The Command Prompt window will close automatically.

    ```powershell
    powershell.exe -NoExit -ExecutionPolicy Bypass -WindowStyle Hidden (New-Object System.Net.WebClient).DownloadFile('http://127.0.0.1/1.exe', 'C:\\test-MDATP-test\\invoice.exe'); Start-Process 'C:\\test-MDATP-test\\invoice.exe'
    ```
    :::image type="content" source="./media/security-center-wdatp/generate-edr-alert.png" alt-text="A command prompt window with the command to generate a test alert.":::

1. If the command is successful, you'll see a new alert on the Azure Security Center dashboard and the Microsoft Defender for Endpoint portal. This alert might take a few minutes to appear.
1. To review the alert in Security Center, go to **Security alerts** > **Suspicious PowerShell CommandLine**.
1. From the investigation window, select the link to go to the Microsoft Defender for Endpoint portal.

## Next steps

- [Platforms and features supported by Azure Security Center](security-center-os-coverage.md)
- [Setting security policies in Azure Security Center](tutorial-security-policy.md): Learn how to configure security policies for your Azure subscriptions and resource groups.
- [Managing security recommendations in Azure Security Center](security-center-recommendations.md): Learn how recommendations help you protect your Azure resources.
- [Security health monitoring in Azure Security Center](security-center-monitoring.md): Learn how to monitor the health of your Azure resources.
---
title: Manage endpoint protection issues with Azure Security Center | Microsoft Docs
description: Learn how to manage endpoint protection issues in Azure Security Center.
services: security-center
documentationcenter: na
author: rkarlin
manager: barbkess
editor: ''

ms.assetid: 1599ad5f-d810-421d-aafc-892e831b403f
ms.service: security-center
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 03/28/2019
ms.author: rkarlin

---
# Manage endpoint protection issues with Azure Security Center
Azure Security Center monitors the status of antimalware protection and reports this under the Endpoint protection issues blade. Security Center highlights issues, such as detected threats and insufficient protection, which can make your virtual machines (VMs) and computers vulnerable to antimalware threats. By using the information under **Endpoint protection issues**, you can identify a plan to address any issues identified.

Security Center reports the following endpoint protection issues:

- Endpoint protection not installed on Azure VMs – A supported antimalware solution is not installed on these Azure VMs.
- Endpoint protection not installed on non-Azure computers – A supported antimalware is not installed on these non-Azure computers.
- Endpoint protection health:

  - Signature out of date – An antimalware solution is installed on these VMs and computers, but the solution does not have the latest antimalware signatures.
  - No real time protection – An antimalware solution is installed on these VMs and computers, but it is not configured for real-time protection.   The service may be disabled or Security Center may be unable to obtain the status because the solution is not supported. See [partner integration](security-center-os-coverage.md#supported-endpoint-protection-solutions) for a list of supported solutions.
  - Not reporting – An antimalware solution is installed but not reporting data.
  - Unknown –  An antimalware solution is installed but its status is unknown or reporting an unknown error.

    > [!NOTE]
    > See [Integrate security solutions](security-center-os-coverage.md#supported-endpoint-protection-solutions) for a list of endpoint protection security solutions integrated with Security Center.
    >
    >

## Implement the recommendation
Endpoint protection issues is presented as a recommendation in Security Center.  If your environment is vulnerable to antimalware threats, this recommendation will be displayed under **Recommendations** and under **Compute**. To see the **Endpoint protection issues dashboard**, you need to follow the Compute workflow.

In this example, we will use **Compute**.  We will look at how to install antimalware on Azure VMs and on non-Azure computers.

## Install antimalware on Azure VMs

1. Select **Compute & apps** under the Security Center main menu or **Overview**.

   ![Select Compute][1]

2. Under **Compute**, select **Endpoint protection issues**. The **Endpoint protection issues** dashboard opens.

   ![Select Endpoint protection issues][2]

   The top of the dashboard provides:

   - Installed endpoint protection providers - Lists the different providers identified by Security Center.
   - Installed endpoint protection health state - Shows the health state of VMs and computers that have an endpoint protection solution installed. The chart shows the number of VMs and computers that are healthy and the number with insufficient protection.
   - Malware detected – Shows the number of VMs and computers where Security Center is reporting detected malware.
   - Attacked computers – Shows the number of VMs and computers where Security Center is reporting attacks by malware.

   At the bottom of the dashboard there is a list of endpoint protection issues which includes the following information:  

   - **TOTAL** -  The number of VMs and computers impacted by the issue.
   - A bar aggregating the number of VMs and computers impacted by the issue. The colors in the bar identify priority:

      - Red - High priority and should be addressed immediately
      - Orange - Medium priority and should be addressed as soon as possible

3. Select **Endpoint protection not installed on Azure VMs**.

   ![Select Endpoint protection not installed on Azure VMs][3]

4. Under **Endpoint protection not installed on Azure VMs** is a list of Azure VMs that do not have antimalware installed.  You can choose to install antimalware on all VMs in the list or select individual VMs to install antimalware on by clicking on the specific VM.
5. Under **Select Endpoint protection**, select the endpoint protection solution you want to use. In this example, select **Microsoft Antimalware**.
6. Additional information about the endpoint protection solution is displayed. Select **Create**.

## Install antimalware on non-Azure computers

1. Go back to **Endpoint protection issues** and select **Endpoint protection not installed on non-Azure computers**.

   ![Select Endpoint protection not installed on non-Azure computers][4]

2. Under **Endpoint protection not installed on non-Azure computers**, select a workspace. An Azure Monitor logs search query filtered to the workspace opens and lists computers missing antimalware. Select a computer from the list for more information.

   ![Azure Monitor logs search][5]

Another search result opens with information filtered only for that computer.

  ![Azure Monitor logs search][6]

> [!NOTE]
> We recommend that endpoint protection be provisioned for all VMs and computers to help identify and remove viruses, spyware, and other malicious software.
>
>

## Next steps
This article showed you how to implement the Security Center recommendation "Install Endpoint Protection." To learn more about enabling Microsoft Antimalware in Azure, see the following document:

* [Microsoft Antimalware for Cloud Services and Virtual Machines](../security/azure-security-antimalware.md) -- Learn how to deploy Microsoft Antimalware.

To learn more about Security Center, see the following documents:

* [Setting security policies in Azure Security Center](tutorial-security-policy.md) -- Learn how to configure security policies.
* [Managing security recommendations in Azure Security Center](security-center-recommendations.md) -- Learn how recommendations help you protect your Azure resources.
* [Security health monitoring in Azure Security Center](security-center-monitoring.md) -- Learn how to monitor the health of your Azure resources.
* [Managing and responding to security alerts in Azure Security Center](security-center-managing-and-responding-alerts.md) -- Learn how to manage and respond to security alerts.
* [Monitoring partner solutions with Azure Security Center](security-center-partner-solutions.md) -- Learn how to monitor the health status of your partner solutions.
* [Azure Security Center FAQ](security-center-faq.md) -- Find frequently asked questions about using the service.
* [Azure Security blog](https://blogs.msdn.com/b/azuresecurity/) -- Find blog posts about Azure security and compliance.

<!--Image references-->
[1]:./media/security-center-install-endpoint-protection/compute.png
[2]:./media/security-center-install-endpoint-protection/endpoint-protection-issues.png
[3]:./media/security-center-install-endpoint-protection/install-endpoint-protection.png
[4]:./media/security-center-install-endpoint-protection/endpoint-protection-issues-computers.png
[5]:./media/security-center-install-endpoint-protection/log-search.png
[6]:./media/security-center-install-endpoint-protection/info-filtered-to-computer.png

<properties
   pageTitle="Install Endpoint Protection in Azure Security Center | Microsoft Azure"
   description="This document shows you how to implement the Azure Security Center recommendation **Install Endpoint Protection**."
   services="security-center"
   documentationCenter="na"
   authors="TerryLanfear"
   manager="MBaldwin"
   editor=""/>

<tags
   ms.service="security-center"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="na"
   ms.date="07/15/2016"
   ms.author="terrylan"/>

# Install Endpoint Protection in Azure Security Center

Azure Security Center will recommend that you provision an antimalware program to your Azure virtual machines (VMs) if antimalware is not already enabled. This recommendation applies to Windows VMs only.

> [AZURE.NOTE] The information in this document applies to the preview release of Azure Security Center. This document introduces the service by using an example deployment.  This is not a step-by-step guide.

## Implement the recommendation

1. In the **Recommendations** blade, select **Install Endpoint Protection**.
![Select Install Endpoint Protection][1]

2. The **Install Endpoint Protection** blade opens displaying a list of VMs without antimalware enabled. Select from the list the VMs that you want to install antimalware on and click **Install on VMs**.
![Select VMs to install antimalware on][2]

3. The **Select Endpoint Protection** blade opens to allow you to select the antimalware solution you want to use. In this example, let's select **Microsoft Antimalware**.
![Select Endpoint Protection][3]

4. Additional information about the antimalware solution is displayed. Select **Create**.
![Create antimalware solution][4]

5. Enter the required configuration settings on the **Add Extension** blade, and then select **OK**. To learn more about the configuration settings, see [Default and Custom Antimalware Configuration](../azure-security-antimalware.md#default-and-custom-antimalware-configuration).

[Microsoft Antimalware](../azure-security-antimalware.md) is now active on the selected VMs.

## Next steps

This article showed you how to implement the Security Center recommendation "Install Endpoint Protection." To learn more about enabling an antimalware program in Azure, see the following:

- [Microsoft Antimalware for Cloud Services and Virtual Machines](../azure-security-antimalware.md) -- Learn how to deploy Microsoft antimalware.

To learn more about Security Center, see the following:

- [Setting security policies in Azure Security Center](security-center-policies.md) -- Learn how to configure security policies.
- [Managing security recommendations in Azure Security Center](security-center-recommendations.md) -- Learn how recommendations help you protect your Azure resources.
- [Security health monitoring in Azure Security Center](security-center-monitoring.md) -- Learn how to monitor the health of your Azure resources.
- [Managing and responding to security alerts in Azure Security Center](security-center-managing-and-responding-alerts.md) -- Learn how to manage and respond to security alerts.
- [Monitoring partner solutions with Azure Security Center](security-center-partner-solutions.md) -- Learn how to monitor the health status of your partner solutions.
- [Azure Security Center FAQ](security-center-faq.md) -- Find frequently asked questions about using the service.
- [Azure Security blog](http://blogs.msdn.com/b/azuresecurity/) -- Find blog posts about Azure security and compliance.

<!--Image references-->
[1]:./media/security-center-install-endpoint-protection/select-install-endpoint-protection.png
[2]:./media/security-center-install-endpoint-protection/install-endpoint-protection-blade.png
[3]:./media/security-center-install-endpoint-protection/select-endpoint-protection.png
[4]:./media/security-center-install-endpoint-protection/create-antimalware-solution.png

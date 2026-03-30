---
title: FQDN tags overview for Azure Firewall
description: An FQDN tag represents a group of fully qualified domain names (FQDNs) associated with well known Microsoft services.
author: duongau
ms.author: duau
ms.service: azure-firewall
ms.topic: concept-article
ms.date: 03/28/2026
# Customer intent: As a network administrator, I want to use FQDN tags in application rules for Azure Firewall, so that I can easily manage and allow outbound network traffic for essential Microsoft services without manually specifying each individual FQDN.
---

# FQDN tags overview

An FQDN tag represents a group of fully qualified domain names (FQDNs) associated with well-known Microsoft services. Use an FQDN tag in application rules to allow the required outbound network traffic through your firewall.

For example, to manually allow Windows Update network traffic through your firewall, you need to create multiple application rules according to the Microsoft documentation. By using FQDN tags, you can create one application rule, include the **Windows Updates** tag, and allow network traffic to Microsoft Windows Update endpoints through your firewall.

You can't create your own FQDN tags, nor can you specify which FQDNs are included within a tag. Microsoft manages the FQDNs encompassed by the FQDN tag, and updates the tag as FQDNs change.

The following table shows the current FQDN tags you can use. Microsoft maintains these tags and you can expect more tags to be added periodically.

## Current FQDN tags

|FQDN tag  |Description  |
|---------|---------|
|WindowsUpdate     |Allow outbound access to Microsoft Update as described in [How to Configure a Firewall for Software Updates](/mem/configmgr/sum/get-started/install-a-software-update-point).|
|WindowsDiagnostics|Allow outbound access to all [Windows Diagnostics endpoints](/windows/privacy/configure-windows-diagnostic-data-in-your-organization#endpoints).|
|MicrosoftActiveProtectionService (MAPS)|Allow outbound access to [MAPS](https://cloudblogs.microsoft.com/enterprisemobility/2016/05/31/important-changes-to-microsoft-active-protection-service-maps-endpoint/).|
|AppServiceEnvironment (ASE)|Allows outbound access to ASE platform traffic. This tag doesn't cover customer-specific Storage and SQL endpoints created by ASE. These endpoints should be enabled via [Service Endpoints](../virtual-network/tutorial-restrict-network-access-to-resources.md) or added manually.<br><br>For more information about integrating Azure Firewall with ASE, see [Locking down an App Service Environment](../app-service/environment/networking.md).|
|AzureBackup|Allows outbound access to the Azure Backup services.|
|AzureHDInsight|Allows outbound access for HDInsight platform traffic. This tag doesn't cover customer-specific Storage or SQL traffic from HDInsight. Enable these traffic types using [Service Endpoints](../virtual-network/tutorial-restrict-network-access-to-resources.md) or add them manually.|
|WindowsVirtualDesktop|Allows outbound Azure Virtual Desktop platform traffic. This tag doesn’t cover deployment-specific Storage and Service Bus endpoints created by Azure Virtual Desktop. Additionally, DNS and KMS network rules are required. For more information about integrating Azure Firewall with Azure Virtual Desktop, see [Use Azure Firewall to protect Azure Virtual Desktop deployments](protect-azure-virtual-desktop.md).|
|AzureKubernetesService (AKS)|Allows outbound access to AKS. For more information, see [Use Azure Firewall to protect Azure Kubernetes Service (AKS) Deployments](protect-azure-kubernetes-service.md).|
|Office365<br><br>For example: Office365.Skype.Optimize|Several Office 365 tags are available to allow outbound access by Office 365 product and category. For more information, see [Use Azure Firewall to protect Office 365](protect-office-365.md).|
|Windows365|Allows outbound communication to Windows 365, excluding network endpoints for Microsoft Intune. To allow outbound communication to port 5671, create a separated network rule. For more information, see Windows 365 [Network requirements](/windows-365/enterprise/requirements-network).|
|MicrosoftIntune|Allow access to [Microsoft Intune](/mem/intune/fundamentals/intune-endpoints) for managed devices.|
|citrixHdxPlusForWindows365|Required when using Citrix HDX Plus.|

> [!NOTE]
> When you select **FQDN Tag** in an application rule, set the protocol:port field to **https**.

## Next steps

To learn how to deploy an Azure Firewall, see [Tutorial: Deploy and configure Azure Firewall by using the Azure portal](tutorial-firewall-deploy-portal.md).

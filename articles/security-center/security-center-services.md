---
title: Azure Security Center's features according to OS, machine type, and cloud
description: Learn about the availability of Azure Security Center features according to OS, machine type, and cloud deployment.
author: memildin
manager: rkarlin
ms.service: security-center
ms.topic: overview
ms.date: 08/05/2021
ms.custom: references_regions
ms.author: memildin
---

# Feature coverage for machines

The two tabs below show the features of Azure Security Center that are available for Windows and Linux machines.

## Supported features for virtual machines and servers <a name="vm-server-features"></a>

### [**Windows machines**](#tab/features-windows)

|**Feature**|**Azure Virtual Machines**|**Azure Virtual Machine Scale Sets**|**Azure Arc-enabled machines**|**Azure Defender required**
|----|:----:|:----:|:----:|:----:|
|[Microsoft Defender for Endpoint integration](security-center-wdatp.md)|✔</br>(on supported versions)|✔</br>(on supported versions)|✔|Yes|
|[Virtual machine behavioral analytics (and security alerts)](alerts-reference.md)|✔|✔|✔|Yes|
|[Fileless security alerts](alerts-reference.md#alerts-windows)|✔|✔|✔|Yes|
|[Network-based security alerts](other-threat-protections.md#network-layer)|✔|✔|-|Yes|
|[Just-in-time VM access](security-center-just-in-time.md)|✔|-|-|Yes|
|[Native vulnerability assessment](deploy-vulnerability-assessment-vm.md#overview-of-the-integrated-vulnerability-scanner)|✔|-|✔|Yes|
|[File integrity monitoring](security-center-file-integrity-monitoring.md)|✔|✔|✔|Yes|
|[Adaptive application controls](security-center-adaptive-application.md)|✔|-|✔|Yes|
|[Network map](security-center-network-recommendations.md#network-map)|✔|✔|-|Yes|
|[Adaptive network hardening](security-center-adaptive-network-hardening.md)|✔|-|-|Yes|
|[Regulatory compliance dashboard & reports](security-center-compliance-dashboard.md)|✔|✔|✔|Yes|
|[Docker host hardening](./harden-docker-hosts.md)|-|-|-|Yes|
|Missing OS patches assessment|✔|✔|✔|Azure: No<br><br>Azure Arc-enabled: Yes|
|Security misconfigurations assessment|✔|✔|✔|Azure: No<br><br>Azure Arc-enabled: Yes|
|[Endpoint protection assessment](security-center-services.md#supported-endpoint-protection-solutions-)|✔|✔|✔|Azure: No<br><br>Azure Arc-enabled: Yes|
|Disk encryption assessment|✔</br>(for [supported scenarios](../virtual-machines/windows/disk-encryption-windows.md#unsupported-scenarios))|✔|-|No|
|Third-party vulnerability assessment|✔|-|✔|No|
|[Network security assessment](security-center-network-recommendations.md)|✔|✔|-|No|
||||||

### [**Linux machines**](#tab/features-linux)

| **Feature**                                                                                                               | **Azure Virtual Machines**                                                                                      | **Azure Virtual Machine Scale Sets** | **Azure Arc-enabled machines** | **Azure Defender required**       |
|---------------------------------------------------------------------------------------------------------------------------|:---------------------------------------------------------------------------------------------------------------:|:------------------------------------:|:------------------------------:|:---------------------------------:|
| [Microsoft Defender for Endpoint integration](security-center-wdatp.md)                                                   | ✔                                                                                                               | -                                    | ✔                              | Yes                              |
| [Virtual machine behavioral analytics (and security alerts)](./azure-defender.md)                                         | ✔</br>(on supported versions)                                                                                  | ✔</br>(on supported versions)        | ✔                             | Yes                               |
| [Fileless security alerts](alerts-reference.md#alerts-windows)                                                            | -                                                                                                               | -                                    | -                              | Yes                               |
| [Network-based security alerts](other-threat-protections.md#network-layer)                                                | ✔                                                                                                              | ✔                                    | -                              | Yes                               |
| [Just-in-time VM access](security-center-just-in-time.md)                                                                 | ✔                                                                                                              | -                                    | -                              | Yes                               |
| [Native vulnerability assessment](deploy-vulnerability-assessment-vm.md#overview-of-the-integrated-vulnerability-scanner) | ✔                                                                                                              | -                                    | ✔                             | Yes                               |
| [File integrity monitoring](security-center-file-integrity-monitoring.md)                                                 | ✔                                                                                                              | ✔                                    | ✔                             | Yes                               |
| [Adaptive application controls](security-center-adaptive-application.md)                                                  | ✔                                                                                                              | -                                    | ✔                             | Yes                               |
| [Network map](security-center-network-recommendations.md#network-map)                                                     | ✔                                                                                                              | ✔                                    | -                              | Yes                               |
| [Adaptive network hardening](security-center-adaptive-network-hardening.md)                                               | ✔                                                                                                              | -                                    | -                              | Yes                               |
| [Regulatory compliance dashboard & reports](security-center-compliance-dashboard.md)                                      | ✔                                                                                                              | ✔                                    | ✔                             | Yes                               |
| [Docker host hardening](./harden-docker-hosts.md)                                                                         | ✔                                                                                                              | ✔                                    | ✔                             | Yes                               |
| Missing OS patches assessment                                                                                             | ✔                                                                                                              | ✔                                    | ✔                             | Azure: No<br><br>Azure Arc-enabled: Yes |
| Security misconfigurations assessment                                                                                     | ✔                                                                                                              | ✔                                    | ✔                             | Azure: No<br><br>Azure Arc-enabled: Yes |
| [Endpoint protection assessment](security-center-services.md#supported-endpoint-protection-solutions-)                    | -                                                                                                               | -                                    | -                              | No                                |
| Disk encryption assessment                                                                                                | ✔</br>(for [supported scenarios](../virtual-machines/windows/disk-encryption-windows.md#unsupported-scenarios)) | ✔                                    | -                              | No                                |
| Third-party vulnerability assessment                                                                                      | ✔                                                                                                              | -                                    | ✔                             | No                                |
| [Network security assessment](security-center-network-recommendations.md)                                                 | ✔                                                                                                              | ✔                                    | -                              | No                                |
||||||

--- 


> [!TIP]
>To experiment with features that are only available with Azure Defender, you can enroll in a 30-day trial. For more information, see the [pricing page](https://azure.microsoft.com/pricing/details/security-center/).


## Supported endpoint protection solutions <a name="endpoint-supported"></a>

The following table provides a matrix of:

 - Whether you can use Azure Security Center to install each solution for you.
 - Which endpoint protection solutions Security Center can discover. If an endpoint protection solution from this list is discovered, Security Center won't recommend installing one.

For information about when recommendations are generated for each of these protections, see [Endpoint Protection Assessment and Recommendations](security-center-endpoint-protection.md).

| Solution                                                  | Supported platforms                                    | Security Center installation | Security Center discovery |
|-----------------------------------------------------------|--------------------------------------------------------|------------------------------|---------------------------|
| Microsoft Defender Antivirus                              | Windows Server 2016 or later                           | No (built into OS)           | Yes                       |
| System Center Endpoint Protection (Microsoft Antimalware) | Windows Server 2012 R2                                 | Via extension                | Yes                       |
| Trend Micro – Deep Security                               | Windows Server (all)                                   | No                           | Yes                       |
| Symantec v12.1.1100+                                      | Windows Server (all)                                   | No                           | Yes                       |
| McAfee v10+                                               | Windows Server (all)                                   | No                           | Yes                       |
| McAfee v10+                                               | Linux (preview)                                        | No                           | Yes                       |
| Sophos V9+                                                | Linux (preview)                                        | No                           | Yes                       |
|                                                           |                                                        |                              |                           |



## Feature support in government and sovereign clouds

| Feature/Service                                                                                                                                                             | Azure          | Azure Government               | Azure China 21Vianet   |
|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------|--------------------------------|---------------|
| **Security Center free features**                                                                                                                                           |                |                                |               |
| - [Continuous export](./continuous-export.md)                                                                                                                               | GA             | GA                             | GA            |
| - [Workflow automation](./continuous-export.md)                                                                                                                             | GA             | GA                             | GA            |
| - [Recommendation exemption rules](./exempt-resource.md)                                                                                                                    | Public Preview | Not Available                  | Not Available |
| - [Alert suppression rules](./alerts-suppression-rules.md)                                                                                                                  | GA             | GA                             | GA            |
| - [Email notifications for security alerts](./security-center-provide-security-contact-details.md)                                                                          | GA             | GA                             | GA            |
| - [Auto provisioning for agents and extensions](./security-center-enable-data-collection.md)                                                                                | GA             | GA                             | GA            |
| - [Asset inventory](./asset-inventory.md)                                                                                                                                   | GA             | GA                             | GA            |
| - [Azure Monitor Workbooks reports in Azure Security Center's workbooks gallery](./custom-dashboards-azure-workbooks.md)                                                    | GA             | GA                             | GA            |
| **Azure Defender plans and extensions**                                                                                                                                     |                |                                |               |
| - [Azure Defender for servers](/azure/security-center/defender-for-servers-introduction)                                                                                    | GA             | GA                             | GA            |
| - [Azure Defender for App Service](/azure/security-center/defender-for-app-service-introduction)                                                                            | GA             | Not Available                  | Not Available |
| - [Azure Defender for DNS](/azure/security-center/defender-for-dns-introduction)                                                                                            | GA             | Not Available                  | GA            |
| - [Azure Defender for container registries](/azure/security-center/defender-for-container-registries-introduction) <sup>[1](#footnote1)</sup>                               | GA             | GA  <sup>[2](#footnote2)</sup> | GA  <sup>[2](#footnote2)</sup> |
| - [Azure Defender for container registries scanning of images in CI/CD workflows](/azure/security-center/defender-for-container-registries-cicd) <sup>[3](#footnote3)</sup> | Public Preview | Not Available                  | Not Available |
| - [Azure Defender for Kubernetes](/azure/security-center/defender-for-kubernetes-introduction) <sup>[4](#footnote4)</sup>                                                   | GA             | GA                             | GA            |
| - [Azure Defender extension for Azure Arc-enabled Kubernetes clusters](/azure/security-center/defender-for-kubernetes-azure-arc) <sup>[5](#footnote5)</sup>                 | Public Preview | Not Available                  | Not Available |
| - [Azure Defender for Azure SQL database servers](/azure/security-center/defender-for-sql-introduction)                                                                     | GA             | GA                             | GA  <sup>[9](#footnote9)</sup> |
| - [Azure Defender for SQL servers on machines](/azure/security-center/defender-for-sql-introduction)                                                                        | GA             | GA                             | Not Available |
| - [Azure Defender for open-source relational databases](/azure/security-center/defender-for-databases-introduction)                                                         | GA             | Not Available                  | Not Available |
| - [Azure Defender for Key Vault](/azure/security-center/defender-for-key-vault-introduction)                                                                                | GA             | Not Available                  | Not Available |
| - [Azure Defender for Resource Manager](/azure/security-center/defender-for-resource-manager-introduction)                                                                  | GA             | GA                             | GA            |
| - [Azure Defender for Storage](/azure/security-center/defender-for-storage-introduction) <sup>[6](#footnote6)</sup>                                                         | GA             | GA                             | Not Available |
| - [Threat protection for Cosmos DB](/azure/security-center/other-threat-protections#threat-protection-for-azure-cosmos-db-preview)                                          | Public Preview | Not Available                  | Not Available |
| - [Kubernetes workload protection](/azure/security-center/kubernetes-workload-protections)                                                                                  | GA             | GA                             | GA            |
| **Azure Defender for servers features** <sup>[7](#footnote7)</sup>                                                                                                          |                |                                |               |
| - [Just-in-time VM access](./security-center-just-in-time.md)                                                                                             | GA             | GA                             | GA            |
| - [File integrity monitoring](./security-center-file-integrity-monitoring.md)                                                                             | GA             | GA                             | GA            |
| - [Adaptive application controls](./security-center-adaptive-application.md)                                                                              | GA             | GA                             | GA            |
| - [Adaptive network hardening](./security-center-adaptive-network-hardening.md)                                                                           | GA             | Not Available                  | Not Available |
| - [Docker host hardening](./harden-docker-hosts.md)                                                                                                       | GA             | GA                             | GA            |
| - [Integrated vulnerability assessment for machines](./deploy-vulnerability-assessment-vm.md)                                                             | GA             | Not Available                  | Not Available |
| - [Regulatory compliance dashboard & reports](./security-center-compliance-dashboard.md) <sup>[8](#footnote8)</sup>                                       | GA             | GA                             | GA            |
| - [Microsoft Defender for Endpoint deployment and integrated license](./security-center-wdatp.md)                                                         | GA             | GA                             | Not Available |
| - [Connect AWS account](./quickstart-onboard-aws.md)                                                                                                      | GA             | Not Available                  | Not Available |
| - [Connect GCP account](./quickstart-onboard-gcp.md)                                                                                                      | GA             | Not Available                  | Not Available |
|                                                                                                                                                                             |                |                                |

<sup><a name="footnote1" /></a>1</sup> Partially GA: The ability to disable specific findings from vulnerability scans is in public preview.

<sup><a name="footnote2" /></a>2</sup> Vulnerability scans of container registries on the Azure Government cloud can only be performed with the scan on push feature.

<sup><a name="footnote3" /></a>3</sup> Requires Azure Defender for container registries.

<sup><a name="footnote4" /></a>4</sup> Partially GA: Support for Azure Arc-enabled clusters is in public preview and not available on Azure Government.

<sup><a name="footnote5" /></a>5</sup> Requires Azure Defender for Kubernetes.

<sup><a name="footnote6" /></a>6</sup> Partially GA: Some of the threat protection alerts from Azure Defender for Storage are in public preview.

<sup><a name="footnote7" /></a>7</sup> These features all require [Azure Defender for servers](./defender-for-servers-introduction.md).

<sup><a name="footnote8" /></a>8</sup> There may be differences in the standards offered per cloud type.
 
<sup><a name="footnote9" /></a>9</sup> Partially GA: Subset of alerts and vulnerability assessment for SQL servers. Behavioral threat protections aren't available.

## Next steps

- Learn how [Security Center collects data using the Log Analytics Agent](security-center-enable-data-collection.md).
- Learn how [Security Center manages and safeguards data](security-center-data-security.md).
- Review the [platforms that support Security Center](security-center-os-coverage.md).

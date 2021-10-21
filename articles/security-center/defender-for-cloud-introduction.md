---
title: Microsoft Defender for Cloud - an introduction
description: Use Microsoft Defender for Cloud to protect your Azure, hybrid, and multi-cloud resources and workloads.
services: security-center
author: memildin
manager: rkarlin
ms.service: security-center
ms.topic: overview
ms.custom: mvc
ms.date: 10/17/2021
ms.author: memildin

---

# What is Microsoft Defender for Cloud?

Defender for Cloud is a unified infrastructure security management system. It strengthens the security posture of your cloud resources, and provides advanced threat protection across your hybrid and multi-cloud workloads.

Keeping your resources safe is a joint effort between your cloud provider, Azure, and you, the customer. You have to make sure your workloads are secure as you move to the cloud, and at the same time, when you move to IaaS (infrastructure as a service) there's more customer responsibility than there was in PaaS (platform as a service) and SaaS (software as a service). Defender for Cloud provides the tools needed to harden your resources, secure your PaaS services, and make sure you're tracking your security posture.

## How can Defender for Cloud help my organization?

Defender for Cloud fills three vital needs as you manage the security of your resources and workloads in the cloud and on-premises:

- **Continuous assessment** - Understand your current security posture.
- **Secure** - Harden all connected resources and services. Because it's natively integrated, deployment of Defender for Cloud is easy, providing you with simple auto provisioning to secure your resources by default.
- **Defend** - Detect and resolve threats to those resources and services.

:::image type="content" source="media/defender-for-cloud-introduction/defender-for-cloud-synopsis.png" alt-text="Understanding the core functionality of Microsoft Defender for Cloud.":::

## Posture management and workload protection

Microsoft Defender for Cloud's features cover the two broad pillars of cloud security: cloud security posture management and cloud workload protection.

### Cloud security posture management (CSPM)

Defender for Cloud's CSPM features include secure score, detection of security misconfigurations in your Azure machines, asset inventory, and more. Use these tools to identify and do the hardening tasks that are recommended as security best practices.

When you open Defender for Cloud for the first time, it will help you secure your environment as follows:

1. **Generate a secure score** for your subscriptions based on an assessment of your connected resources compared with the guidance in [Azure Security Benchmark](/security/benchmark/azure/overview). Use the score to understand your security posture, and the compliance dashboard to review your compliance with the built-in benchmark. When you've enabled the enhanced security features, you can customize the standards used to assess your compliance, and add standards such as NIST and Azure CIS.

1. **Provide hardening recommendations** based on any identified security misconfigurations and weaknesses. Use these security recommendations to strengthen the security posture of your organization's Azure, hybrid, and multi-cloud resources.


### Cloud workload protection (CWP)

Defender for Cloud offers security alerts that are powered by [Microsoft Threat Intelligence](https://go.microsoft.com/fwlink/?linkid=2128684). It also includes a range of advanced, intelligent, protections for your workloads. The workload protections are provided through Microsoft Defender plans specific to the types of resources in your subscriptions. For example, you can enable **Microsoft Defender for Storage** to get alerted about suspicious activities related to your Azure Storage accounts. 


## Azure, hybrid, and multi-cloud protections

Because Defender for Cloud is an Azure-native service, many Azure services are monitored and protected without necessitating any deployment.

When necessary, Defender for Cloud can auto provision a Log Analytics agent to gather security-related data. For Azure machines, provisioning is handled directly. For hybrid and multi-cloud environments, it's  done with the help of [Azure Arc](https://azure.microsoft.com/services/azure-arc/).


### Azure-native protections

Defender for Cloud helps you detect threats across:

- **Azure PaaS services** - Detect threats targeting Azure services including Azure App Service, Azure SQL, Azure Storage Account, and more data services. You can also take advantage of the native integration with Microsoft Defender for Cloud Apps (formerly known as Microsoft Cloud App Security)'s User and Entity Behavioral Analytics (UEBA) to perform anomaly detection on your Azure activity logs.

- **Azure data services** - Defender for Cloud includes capabilities that help you perform automatic classification of your data in Azure SQL. You can also get assessments for potential vulnerabilities across Azure SQL and Storage services, and recommendations for how to mitigate them.

- **Networks** - Defender for Cloud helps you limit exposure to brute force attacks. By reducing access to virtual machine ports, using the just-in-time VM access, you can harden your network by preventing unnecessary access. You can set secure access policies on selected ports, for only authorized users, allowed source IP address ranges or IP addresses, and for a limited amount of time. 


### Defend your hybrid resources
As well as defending your Azure environment, you can add Defender for Cloud capabilities to your hybrid cloud environment to protect your non-Azure servers. You'll get customized threat intelligence and prioritized alerts according to your specific environment so that you can focus on what matters the most​.

To extend protection to on-premises machines, deploy [Azure Arc](https://azure.microsoft.com/services/azure-arc/) and enable Defender for Cloud's enhanced security features. Learn more in [Add non-Azure machines with Azure Arc](quickstart-onboard-machines.md#add-non-azure-machines-with-azure-arc).


### Defend resources running on other clouds 

Defender for Cloud can protect resources in other clouds (such as AWS and GCP). 

Multi-cloud protection plans include:

- **CSPM** - Providing secure score and hardening recommendations for your resources on other cloud providers.
- **Microsoft Defender for Kubernetes** - Provides environment hardening, workload protection, and run-time protection for your Kubernetes clusters.
- **Microsoft Defender for servers** - Provides threat detection and advanced defenses for your Windows and Linux machines.


## Collecting security data from your resources 

The events collected from the agents and from Azure are correlated in the security analytics engine to provide you with:

- **Tailored recommendations** (hardening tasks), that you should follow to make sure your workloads are secure
- **Security alerts**, that you should investigate quickly to make sure malicious attacks aren't taking place on your workloads

## Vulnerability assessment and management

:::image type="content" source="media/defender-for-cloud-introduction/defender-for-cloud-expanded-assess.png" alt-text="Focus on the assessment features of Microsoft Defender for Cloud.":::

Defender for Cloud includes vulnerability assessment solutions for your virtual machines, container registries, and SQL servers as part of the enhanced security features. Some of the scanners are powered by Qualys. But you don't need a Qualys license, or even a Qualys account - everything's handled seamlessly inside Defender for Cloud.

If you've enabled the [integration with Microsoft Defender for Endpoint](integration-defender-for-endpoint.md) you'll have access to the vulnerability findings from **Microsoft threat and vulnerability management**. Learn more in [Investigate weaknesses with Microsoft Defender for Endpoint's threat and vulnerability management](deploy-vulnerability-assessment-tvm.md).

Review the findings from these vulnerability scanners and respond to them all from within Defender for Cloud. This brings Defender for Cloud closer to being the single pane of glass for all of your cloud security efforts.

Learn more on the following pages:

- [ Defender for Cloud's integrated Qualys scanner for Azure and hybrid machines](deploy-vulnerability-assessment-vm.md)
- [Identify vulnerabilities in images in Azure container registries](defender-for-container-registries-usage.md#identify-vulnerabilities-in-images-in-other-container-registries)



## Manage organization security policy and compliance

It's a security basic to know and make sure your workloads are secure, and it starts with having tailored security policies in place. Because all the policies in Defender for Cloud are built on top of Azure Policy controls, you're getting the full range and flexibility of a **world-class policy solution**. In Defender for Cloud, you can set your policies to run on management groups, across subscriptions, and even for a whole tenant.

When you enable Defender for Cloud, the Azure Security Benchmark initiative is reflected in Azure Policy as a built-in initiative under the "Security Center" category. The built-in initiative is automatically assigned to all Defender for Cloud registered subscriptions (regardless of whether or not they have enhanced security features enable). The built-in initiative contains only Audit policies. For more information about Defender for Cloud policies in Azure Policy, see [Working with security policies](tutorial-security-policy.md).

Defender for Cloud helps you **identify Shadow IT subscriptions**. By looking at subscriptions labeled **not covered** in your dashboard, you can know immediately when there are newly created subscriptions and make sure they are covered by your policies, and protected by Defender for Cloud.

:::image type="content" source="./media/defender-for-cloud-introduction/sc-policy-dashboard.png" alt-text="Defender for Cloud policy dashboard.":::


### Optimize and improve security by configuring recommended controls

:::image type="content" source="media/defender-for-cloud-introduction/defender-for-cloud-expanded-secure.png" alt-text="Focus on the 'secure' features of Microsoft Defender for Cloud.":::

The heart of Defender for Cloud's value lies in its recommendations. The recommendations are tailored to the particular security concerns identified on your workloads, and Defender for Cloud does the security admin work for you, by not only finding your vulnerabilities, but providing you with specific instructions for how to get rid of them.

In this way, Defender for Cloud enables you not just to set security policies, but to apply secure configuration standards across your resources.

The recommendations help you to reduce the attack surface across each of your resources.

:::image type="content" source="./media/defender-for-cloud-introduction/sc-recommendation-example.png" alt-text="Defender for Cloud recommendation example.":::

Defender for Cloud continuously discovers new resources that are being deployed across your workloads and assesses whether they are configured according to security best practices, if not, they're flagged and you get a prioritized list of recommendations for what you need to fix to protect your resources. This list of recommendations is enabled and supported by [Azure Security Benchmark](/security/benchmark/azure/introduction), the Microsoft-authored, Azure-specific, set of guidelines for security and compliance best practices based on common compliance frameworks. This widely respected benchmark builds on the controls from the [Center for Internet Security (CIS)](https://www.cisecurity.org/benchmark/azure/) and the [National Institute of Standards and Technology (NIST)](https://www.nist.gov/) with a focus on cloud-centric security.

To help you understand how important each recommendation is to your overall security posture, Defender for Cloud groups the recommendations into security controls and adds a **secure score** value to each control. This is crucial in enabling you to **prioritize your security work**.

:::image type="content" source="./media/defender-for-cloud-introduction/sc-secure-score.png" alt-text="Defender for Cloud secure score.":::


## Protect against threats

:::image type="content" source="media/defender-for-cloud-introduction/defender-for-cloud-expanded-defend.png" alt-text="Focus on the 'defend'' features of Microsoft Defender for Cloud.":::

Defender for Cloud provides:

- **Security alerts** - When Defender for Cloud detects a threat in any area of your environment, it generates a security alert. These alerts describe details of the affected resources, suggested remediation steps, and in some cases an option to trigger a logic app in response. Whether an alert is generated by Defender for Cloud, or received by Defender for Cloud from an integrated  security product, you can export it. To export your alerts to Microsoft Sentinel, any third-party SIEM, or any other external tool, follow the instructions in [Stream alerts to a SIEM, SOAR, or IT Service Management solution](export-to-siem.md).  Defender for Cloud's threat protection includes fusion kill-chain analysis, which automatically correlates alerts in your environment based on cyber kill-chain analysis, to help you better understand the full story of an attack campaign, where it started and what kind of impact it had on your resources.

- **Advanced threat protection features** for virtual machines, SQL databases, containers, web applications, your network, and more - Protections include securing the management ports of your VMs with just-in-time access and adaptive application controls to create allowlists for what apps should and shouldn't run on your machines.

The **Defender plans** page of Microsoft Defender for Cloud offers the following plans for comprehensive defenses for the compute, data, and service layers of your environment:

- [Microsoft Defender for servers](defender-for-servers-introduction.md)
- [Microsoft Defender for App Service](defender-for-app-service-introduction.md)
- [Microsoft Defender for Storage](defender-for-storage-introduction.md)
- [Microsoft Defender for SQL](defender-for-sql-introduction.md)
- [Microsoft Defender for Kubernetes](defender-for-kubernetes-introduction.md)
- [Microsoft Defender for container registries](defender-for-container-registries-introduction.md)
- [Microsoft Defender for Key Vault](defender-for-key-vault-introduction.md)
- [Microsoft Defender for Resource Manager](defender-for-resource-manager-introduction.md)
- [Microsoft Defender for DNS](defender-for-dns-introduction.md)
- [Microsoft Defender for open-source relational databases](defender-for-databases-introduction.md)

Use the advanced protection tiles in the workload protections dashboard to monitor and configure each of these protections. 

> [!TIP]
> Microsoft Defender for IoT (preview) is a separate product. You'll find all the details in [Introducing Microsoft Defender for IoT (Preview)](../defender-for-iot/overview.md). 

Microsoft Defender for servers includes automatic, native integration with Microsoft Defender for Endpoint. Learn more, [Protect your endpoints with Defender for Cloud's integrated EDR solution: Microsoft Defender for Endpoint](integration-defender-for-endpoint.md).

## Next steps

- To get started with Defender for Cloud, you need a subscription to Microsoft Azure. If you don't have a subscription, you can sign up for a [free trial](https://azure.microsoft.com/free/).

- Defender for Cloud's free plan is enabled on all your current Azure subscriptions once you visit the Defender for Cloud dashboard in the Azure portal for the first time, or if enabled programmatically via the REST API. To take advantage of advanced security management and threat detection capabilities, you must enable enhanced security features. For more information about a free 30 day trial, see the [pricing page](https://azure.microsoft.com/pricing/details/security-center/).

- If you're ready to enable enhanced security features now, [Quickstart: Enable enhanced security features](enable-enhanced-security.md) walks you through the steps.

> [!div class="nextstepaction"]
> [Enable Microsoft Defender plans](enable-enhanced-security.md)
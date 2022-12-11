---
title: What is Microsoft Defender for Cloud?
titleSuffix: Microsoft Defender for Cloud
description: Use Microsoft Defender for Cloud to protect your Azure, hybrid, and multicloud resources and workloads.
ms.topic: overview
ms.custom: mvc, ignite-2022
ms.date: 10/04/2022
---
# What is Microsoft Defender for Cloud?

Microsoft Defender for Cloud is a Cloud Security Posture Management (CSPM) and Cloud Workload Protection Platform (CWPP) for all of your Azure, on-premises, and multicloud (Amazon AWS and Google GCP) resources. Defender for Cloud fills three vital needs as you manage the security of your resources and workloads in the cloud and on-premises:

:::image type="content" source="media/defender-for-cloud-introduction/defender-for-cloud-synopsis.png" alt-text="Understanding the core functionality of Microsoft Defender for Cloud.":::

- [**Defender for Cloud secure score**](secure-score-security-controls.md) **continually assesses** your security posture so you can track new security opportunities and precisely report on the progress of your security efforts.
- [**Defender for Cloud recommendations**](security-policy-concept.md) **secures** your workloads with step-by-step actions that protect your workloads from known security risks.
- [**Defender for Cloud alerts**](alerts-overview.md) **defends** your workloads in real-time so you can react immediately and prevent security events from developing.

For a step-by-step walkthrough of Defender for Cloud, check out this [interactive tutorial](https://mslearn.cloudguides.com/en-us/guides/Protect%20your%20multi-cloud%20environment%20with%20Microsoft%20Defender%20for%20Cloud).

You can learn more about Defender for Cloud from a cybersecurity expert by watching [Lessons Learned from the Field](episode-six.md).

## Protect your resources and track your security progress

Microsoft Defender for Cloud's features covers the two broad pillars of cloud security: Cloud Workload Protection Platform (CWPP) and Cloud Security Posture Management (CSPM).

### CSPM - Remediate security issues and watch your security posture improve

In Defender for Cloud, the posture management features provide:

- **Hardening guidance** - to help you efficiently and effectively improve your security
- **Visibility** - to help you understand your current security situation

Defender for Cloud continually assesses your resources, subscriptions, and organization for security issues and shows your security posture in **secure score**, an aggregated score of the security findings that tells you, at a glance, your current security situation: the higher the score, the lower the identified risk level.

As soon as you open Defender for Cloud for the first time, Defender for Cloud:

- **Generates a secure score** for your subscriptions based on an assessment of your connected resources compared with the guidance in [Microsoft cloud security benchmark](/security/benchmark/azure/overview). Use the score to understand your security posture, and the compliance dashboard to review your compliance with the built-in benchmark. When you've enabled the enhanced security features, you can customize the standards used to assess your compliance, and add other regulations (such as NIST and Azure CIS) or organization-specific security requirements. You can also apply recommendations, and score based on the AWS Foundational Security Best practices standards.

    You can also [learn more about secure score](secure-score-security-controls.md).

- **Provides hardening recommendations** based on any identified security misconfigurations and weaknesses. Use these security recommendations to strengthen the security posture of your organization's Azure, hybrid, and multicloud resources.

- **Analyze and secure your attack paths** through the cloud security graph, which is a graph-based context engine that exists within Defender for Cloud. The cloud security graph collects data from your multicloud environment and other data sources. For example, the cloud assets inventory, connections and lateral movement possibilities between resources, exposure to internet, permissions, network connections, vulnerabilities and more. The data collected is then used to build a graph representing your multicloud environment. 

    Attack path analysis is a graph-based algorithm that scans the cloud security graph. The scans expose exploitable paths that attackers may use to breach your environment to reach your high-impact assets. Attack path analysis exposes those attack paths and suggests recommendations as to how best remediate the issues that will break the attack path and prevent successful breach.
    
    By taking your environment's contextual information into account such as, internet exposure, permissions, lateral movement, and more. Attack path analysis identifies issues that may lead to a breach on your environment, and helps you to remediate the highest risk ones first.

    Learn more about [attack path analysis](concept-attack-path.md#what-is-attack-path-analysis).

Defender CSPM offers two options to protect your environments and resources, a free option and a premium option. We recommend enabling the premium option to gain the full coverage and benefits of CSPM. You can learn more about the benefits offered by [Defender Cloud Security Posture Management (CSPM)](concept-cloud-security-posture-management.md) and [the differences between the two plans](concept-cloud-security-posture-management.md).

### CWP - Identify unique workload security requirements

Defender for Cloud offers security alerts that are powered by [Microsoft Threat Intelligence](https://go.microsoft.com/fwlink/?linkid=2128684). It also includes a range of advanced, intelligent, protections for your workloads. The workload protections are provided through Microsoft Defender plans specific to the types of resources in your subscriptions. For example, you can enable **Microsoft Defender for Storage** to get alerted about suspicious activities related to your storage resources.

## Protect all of your resources under one roof

Because Defender for Cloud is an Azure-native service, many Azure services are monitored and protected without needing any deployment, but you can also add resources the are on-premises or in other public clouds.

When necessary, Defender for Cloud can automatically deploy a Log Analytics agent to gather security-related data. For Azure machines, deployment is handled directly. For hybrid and multicloud environments, Microsoft Defender plans are extended to non Azure machines with the help of [Azure Arc](https://azure.microsoft.com/services/azure-arc/). CSPM features are extended to multicloud machines without the need for any agents (see [Defend resources running on other clouds](#defend-resources-running-on-other-clouds)).

### Defend your Azure-native resources

Defender for Cloud helps you detect threats across:

- **Azure PaaS services** - Detect threats targeting Azure services including Azure App Service, Azure SQL, Azure Storage Account, and more data services. You can also perform anomaly detection on your Azure activity logs using the native integration with Microsoft Defender for Cloud Apps (formerly known as Microsoft Cloud App Security).

- **Azure data services** - Defender for Cloud includes capabilities that help you automatically classify your data in Azure SQL. You can also get assessments for potential vulnerabilities across Azure SQL and Storage services, and recommendations for how to mitigate them.

- **Networks** - Defender for Cloud helps you limit exposure to brute force attacks. By reducing access to virtual machine ports, using the just-in-time VM access, you can harden your network by preventing unnecessary access. You can set secure access policies on selected ports, for only authorized users, allowed source IP address ranges or IP addresses, and for a limited amount of time.

### Defend your on-premises resources

In addition to defending your Azure environment, you can add Defender for Cloud capabilities to your hybrid cloud environment to protect your non-Azure servers. To help you focus on what matters the most​, you'll get customized threat intelligence and prioritized alerts according to your specific environment.

To extend protection to on-premises machines, deploy [Azure Arc](https://azure.microsoft.com/services/azure-arc/) and enable Defender for Cloud's enhanced security features. Learn more in [Add non-Azure machines with Azure Arc](quickstart-onboard-machines.md#add-non-azure-machines-with-azure-arc).

### Defend resources running on other clouds

Defender for Cloud can protect resources in other clouds (such as AWS and GCP).

For example, if you've [connected an Amazon Web Services (AWS) account](quickstart-onboard-aws.md) to an Azure subscription, you can enable any of these protections:

- **Defender for Cloud's CSPM features** extend to your AWS resources. This agentless plan assesses your AWS resources according to AWS-specific security recommendations and these are included in your secure score. The resources will also be assessed for compliance with built-in standards specific to AWS (AWS CIS, AWS PCI DSS, and AWS Foundational Security Best Practices). Defender for Cloud's [asset inventory page](asset-inventory.md) is a multicloud enabled feature helping you manage your AWS resources alongside your Azure resources.
- **Microsoft Defender for Kubernetes** extends its container threat detection and advanced defenses to your **Amazon EKS Linux clusters**.
- **Microsoft Defender for Servers** brings threat detection and advanced defenses to your Windows and Linux EC2 instances. This plan includes the integrated license for Microsoft Defender for Endpoint, security baselines and OS level assessments, vulnerability assessment scanning, adaptive application controls (AAC), file integrity monitoring (FIM), and more.

Learn more about connecting your [AWS](quickstart-onboard-aws.md) and [GCP](quickstart-onboard-gcp.md) accounts to Microsoft Defender for Cloud.

## Close vulnerabilities before they get exploited

:::image type="content" source="media/defender-for-cloud-introduction/defender-for-cloud-expanded-assess.png" alt-text="Focus on the assessment features of Microsoft Defender for Cloud.":::

Defender for Cloud includes vulnerability assessment solutions for your virtual machines, container registries, and SQL servers as part of the enhanced security features. Some of the scanners are powered by Qualys. But you don't need a Qualys license, or even a Qualys account - everything's handled seamlessly inside Defender for Cloud.

Microsoft Defender for Servers includes automatic, native integration with Microsoft Defender for Endpoint. Learn more, [Protect your endpoints with Defender for Cloud's integrated EDR solution: Microsoft Defender for Endpoint](integration-defender-for-endpoint.md). With this integration enabled, you'll have access to the vulnerability findings from **Microsoft threat and vulnerability management**. Learn more in [Investigate weaknesses with Microsoft Defender for Endpoint's threat and vulnerability management](deploy-vulnerability-assessment-tvm.md).

Review the findings from these vulnerability scanners and respond to them all from within Defender for Cloud. This broad approach brings Defender for Cloud closer to being the single pane of glass for all of your cloud security efforts.

Learn more on the following pages:

- [Defender for Cloud's integrated Qualys scanner for Azure and hybrid machines](deploy-vulnerability-assessment-vm.md)
- [Identify vulnerabilities in images in Azure container registries](defender-for-containers-va-acr.md#identify-vulnerabilities-in-images-in-other-container-registries)

## Enforce your security policy from the top down

:::image type="content" source="media/defender-for-cloud-introduction/defender-for-cloud-expanded-secure.png" alt-text="Focus on the 'secure' features of Microsoft Defender for Cloud.":::

It's a security basic to know and make sure your workloads are secure, and it starts with having tailored security policies in place. Because policies in Defender for Cloud are built on top of Azure Policy controls, you're getting the full range and flexibility of a **world-class policy solution**. In Defender for Cloud, you can set your policies to run on management groups, across subscriptions, and even for a whole tenant.

Defender for Cloud continuously discovers new resources that are being deployed across your workloads and assesses whether they're configured according to security best practices. If not, they're flagged and you get a prioritized list of recommendations for what you need to fix. Recommendations help you reduce the attack surface across each of your resources.

The list of recommendations is enabled and supported by the Microsoft cloud security benchmark. This Microsoft-authored benchmark, based on common compliance frameworks, began with Azure and now provides a set of guidelines for security and compliance best practices for multiple cloud environments. Learn more in [Microsoft cloud security benchmark introduction](/security/benchmark/azure/introduction).

In this way, Defender for Cloud enables you not just to set security policies, but to *apply secure configuration standards across your resources*.

:::image type="content" source="./media/defender-for-cloud-introduction/recommendation-example.png" alt-text="Defender for Cloud recommendation example.":::

To help you understand how important each recommendation is to your overall security posture, Defender for Cloud groups the recommendations into security controls and adds a **secure score** value to each control. This is crucial in enabling you to **prioritize your security work**.

:::image type="content" source="./media/defender-for-cloud-introduction/sc-secure-score.png" alt-text="Defender for Cloud secure score.":::

## Extend Defender for Cloud with Defender plans and external monitoring

:::image type="content" source="media/defender-for-cloud-introduction/defender-for-cloud-expanded-defend.png" alt-text="Focus on the 'defend'' features of Microsoft Defender for Cloud.":::

You can extend the Defender for Cloud protection with:

- **Advanced threat protection features** for virtual machines, SQL databases, containers, web applications, your network, and more - Protections include securing the management ports of your VMs with [just-in-time access](just-in-time-access-overview.md), and [adaptive application controls](adaptive-application-controls.md) to create allowlists for what apps should and shouldn't run on your machines.

The **Defender plans** of Microsoft Defender for Cloud offer comprehensive defenses for the compute, data, and service layers of your environment:

- [Microsoft Defender for Servers](defender-for-servers-introduction.md)
- [Microsoft Defender for Storage](defender-for-storage-introduction.md)
- [Microsoft Defender for SQL](defender-for-sql-introduction.md)
- [Microsoft Defender for Containers](defender-for-containers-introduction.md)
- [Microsoft Defender for App Service](defender-for-app-service-introduction.md)
- [Microsoft Defender for Key Vault](defender-for-key-vault-introduction.md)
- [Microsoft Defender for Resource Manager](defender-for-resource-manager-introduction.md)
- [Microsoft Defender for DNS](defender-for-dns-introduction.md)
- [Microsoft Defender for open-source relational databases](defender-for-databases-introduction.md)
- [Microsoft Defender for Azure Cosmos DB](concept-defender-for-cosmos.md)
- [Defender Cloud Security Posture Management (CSPM)](concept-cloud-security-posture-management.md)
    - [Security governance and regulatory compliance](concept-cloud-security-posture-management.md#security-governance-and-regulatory-compliance)
    - [Cloud security explorer](concept-cloud-security-posture-management.md#cloud-security-explorer)
    - [Attack path analysis](concept-cloud-security-posture-management.md#attack-path-analysis)
    - [Agentless scanning for machines](concept-cloud-security-posture-management.md#agentless-scanning-for-machines)
- [Defender for DevOps](defender-for-devops-introduction.md)


Use the advanced protection tiles in the [workload protections dashboard](workload-protections-dashboard.md) to monitor and configure each of these protections.

> [!TIP]
> Microsoft Defender for IoT is a separate product. You'll find all the details in [Introducing Microsoft Defender for IoT](../defender-for-iot/overview.md).

- **Security alerts** - When Defender for Cloud detects a threat in any area of your environment, it generates a security alert. These alerts describe details of the affected resources, suggested remediation steps, and in some cases an option to trigger a logic app in response. Whether an alert is generated by Defender for Cloud, or received by Defender for Cloud from an integrated  security product, you can export it. To export your alerts to Microsoft Sentinel, any third-party SIEM, or any other external tool, follow the instructions in [Stream alerts to a SIEM, SOAR, or IT Service Management solution](export-to-siem.md). Defender for Cloud's threat protection includes fusion kill-chain analysis, which automatically correlates alerts in your environment based on cyber kill-chain analysis, to help you better understand the full story of an attack campaign, where it started and what kind of impact it had on your resources. [Defender for Cloud's supported kill chain intents are based on version 9 of the MITRE ATT&CK matrix](alerts-reference.md#intentions).

## Learn More

You can also check out the following blogs:

- [A new name for multicloud security: Microsoft Defender for Cloud](https://techcommunity.microsoft.com/t5/microsoft-defender-for-cloud/a-new-name-for-multi-cloud-security-microsoft-defender-for-cloud/ba-p/2943020)
- [Microsoft Defender for Cloud - Use cases](https://techcommunity.microsoft.com/t5/microsoft-defender-for-cloud/microsoft-defender-for-cloud-use-cases/ba-p/2953619)
- [Microsoft Defender for Cloud PoC Series - Microsoft Defender for Containers](https://techcommunity.microsoft.com/t5/microsoft-defender-for-cloud/microsoft-defender-for-cloud-poc-series-microsoft-defender-for/ba-p/3064644)

## Next steps

- To get started with Defender for Cloud, you need a subscription to Microsoft Azure. If you don't have a subscription, [sign up for a free trial](https://azure.microsoft.com/free/).

- Defender for Cloud's free plan is enabled on all your current Azure subscriptions when you visit the Defender for Cloud pages in the Azure portal for the first time, or if enabled programmatically via the REST API. To take advantage of advanced security management and threat detection capabilities, you must enable the enhanced security features. These features are free for the first 30 days. [Learn more about the pricing](https://azure.microsoft.com/pricing/details/defender-for-cloud/).

- If you're ready to enable enhanced security features now, [Quickstart: Enable enhanced security features](enable-enhanced-security.md) walks you through the steps.

> [!div class="nextstepaction"]
> [Enable Microsoft Defender plans](enable-enhanced-security.md)

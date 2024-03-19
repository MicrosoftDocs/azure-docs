---
title: Defender for Cloud glossary
description: The glossary provides a brief description of important Defender for Cloud platform terms and concepts.
ms.date: 11/08/2023
ms.topic: article
---

# Defender for Cloud glossary

This glossary provides a brief description of important terms and concepts for the Microsoft Defender for Cloud platform. Select the **Learn more** links to go to related terms in the glossary. This glossary can help you to learn and use the product tools quickly and effectively.

## A

### **AAC**

Adaptive application controls are an intelligent and automated solution for defining allowlists of known-safe applications for your machines. See [Adaptive Application Controls](adaptive-application-controls.md).

<a name='aad'></a>

### **Microsoft Entra ID**

Microsoft Entra ID is a cloud-based identity and access management service. See [Adaptive Application Controls](../active-directory/fundamentals/active-directory-whatis.md).

### **ACR Tasks**

A suite of features within Azure container registry. See [Frequently asked questions - Azure Container Registry](../container-registry/container-registry-faq.yml).

### **Adaptive network hardening**

Adaptive network hardening provides recommendations to further harden the [network security groups (NSG)](../virtual-network/network-security-groups-overview.md) rules. See [What is Adaptive Network Hardening?](adaptive-network-hardening.md#what-is-adaptive-network-hardening).

### **ADO**

Azure DevOps provides developer services for allowing teams to plan work, collaborate on code development, and build and deploy applications. See [What is Azure DevOps?](/azure/devops/user-guide/what-is-azure-devops)

### **AKS**

Azure Kubernetes Service, Microsoft's managed service for developing, deploying, and managing containerized applications. See [Kubernetes concepts](/azure/aks/hybrid/kubernetes-concepts).

### **Alerts**

Alerts defend your workloads in real-time so you can react immediately and prevent security events from developing. See [Security alerts and incidents](alerts-overview.md).

### **ANH**

Adaptive network hardening. Learn how to [improve your network security posture with adaptive network hardening](adaptive-network-hardening.md).

### **APT**

Advanced Persistent Threats See the [video: Understanding APTs](/events/teched-2012/sia303).

### **Arc-enabled Kubernetes**

Azure Arc-enabled Kubernetes allows you to attach and configure Kubernetes clusters running anywhere. You can connect your clusters running on other public cloud providers or clusters running on your on-premises data center. See [What is Azure Arc-enabled Kubernetes](../azure-arc/kubernetes/overview.md).

### **ARG**

Azure Resource Graph-an Azure service designed to extend Azure Resource Management by providing resource exploration with the ability to query at scale across a given set of subscriptions so that you can effectively govern your environment. See [Azure Resource Graph Overview](../governance/resource-graph/overview.md).

### **ARM**

Azure Resource Manager-the deployment and management service for Azure. See [Azure Resource Manager overview](../azure-resource-manager/management/overview.md).

### **ASB**

Azure Security Benchmark provides recommendations on how you can secure your cloud solutions on Azure. See [Azure Security Benchmark](/security/benchmark/azure/baselines/security-center-security-baseline).

### **Attack Path Analysis**

A graph-based algorithm that scans the cloud security graph, exposes attack paths and suggests recommendations as to how best remediate issues that break the attack path and prevent successful breach. See [What is attack path analysis?](concept-attack-path.md#what-is-attack-path-analysis).

### **Auto-provisioning**

To make sure that your server resources are secure, Microsoft Defender for Cloud uses agents installed on your servers to send information about your servers to Microsoft Defender for Cloud for analysis. You can use auto provisioning to deploy the Azure Monitor Agent on your servers. Learn how to [configure auto provision](../iot-dps/quick-setup-auto-provision.md).

### Azure Policy for Kubernetes

A pod that extends the open-source [Gatekeeper v3](https://github.com/open-policy-agent/gatekeeper) and registers as a web hook to Kubernetes admission control making it possible to apply at-scale enforcements, and safeguards on your clusters in a centralized, consistent manner. It's deployed as an AKS add-on in AKS clusters and as an Arc extension in Arc enabled Kubernetes clusters. For more information, see [Protect your Kubernetes workloads](kubernetes-workload-protections.md) and [Understand Azure Policy for Kubernetes clusters](../governance/policy/concepts/policy-for-kubernetes.md).

## B

### **Bicep**

Bicep is a domain-specific language (DSL) that uses declarative syntax to deploy Azure resources. It provides concise syntax, reliable type safety, and support for code reuse. See [Bicep tutorial](../azure-resource-manager/bicep/quickstart-create-bicep-use-visual-studio-code.md).

### **Blob storage**

Azure Blob Storage is the high scale object storage service for Azure and a key building block for data storage in Azure. See [what is Azure blob storage?](../storage/blobs/storage-blobs-introduction.md).

## C

### **Cacls**

Change access control list, Microsoft Windows native command-line utility often used for modifying the security permission on folders and files. See [Access control lists](/windows/win32/secauthz/access-control-lists).

### **CIS Benchmark**

(Kubernetes) Center for Internet Security benchmark. See [CIS](../aks/cis-kubernetes.md).

### **Cloud security graph**

The cloud security graph is a graph-based context engine that exists within Defender for Cloud. The cloud security graph collects data from your multicloud environment and other data sources. See [What is the cloud security graph?](concept-attack-path.md#what-is-cloud-security-graph).

### **CORS**

Cross origin resource sharing, an HTTP feature that enables a web application running under one domain to access resources in another domain. See [CORS](/rest/api/storageservices/cross-origin-resource-sharing--cors--support-for-the-azure-storage-services).

### **CNAPP**

Cloud Native Application Protection Platform. See [Build cloud native applications in Azure](https://azure.microsoft.com/solutions/cloud-native-apps/).

### **CNCF**

Cloud Native Computing Foundation. Learn how to [build CNCF projects by using Azure Kubernetes service](/azure/architecture/example-scenario/apps/build-cncf-incubated-graduated-projects-aks).

### **CSPM**

Cloud Security Posture Management. See [Cloud Security Posture Management (CSPM)](concept-cloud-security-posture-management.md).

### **CWPP**

Cloud Workload Protection Platform. See [CWPP](./overview-page.md).

## D

### Data Aware Security Posture

Data-aware security posture automatically discovers datastores containing sensitive data, and helps reduce risk of data breaches. Learn about [data-aware security posture](concept-data-security-posture.md).

### Defender sensor

The DaemonSet that is deployed on each node, collects signals from hosts using eBPF technology, and provides runtime protection. The sensor is registered with a Log Analytics workspace, and used as a data pipeline. However, the audit log data isn't stored in the Log Analytics workspace. It's deployed under AKS Security profile in AKS clusters and as an Arc extension in Arc enabled Kubernetes clusters. For more information, see [Architecture for each Kubernetes environment](defender-for-containers-architecture.md#architecture-for-each-kubernetes-environment).

### **DDOS Attack**

Distributed denial-of-service, a type of attack where an attacker sends more requests to an application than the application is capable of handling. See [DDOS FAQs](../ddos-protection/ddos-faq.yml).

## E

### **EASM**

External Attack Surface Management. See [EASM Overview](concept-easm.md).

### **EDR**

Endpoint Detection and Response. See [Microsoft Defender for Endpoint](integration-defender-for-endpoint.md).

### **EKS**

Amazon Elastic Kubernetes Service, Amazon's managed service for running Kubernetes on AWS without needing to install, operate, and maintain your own Kubernetes control plane or nodes. See[EKS](https://aws.amazon.com/eks/).

### **eBPF**

Extended Berkley Packet Filter [What is eBPF?](https://ebpf.io/)

## F

### **FIM**

File Integrity Monitoring. Learn about ([file Integrity Monitoring in Microsoft Defender for Cloud](file-integrity-monitoring-overview.md).

### **FTP**

File Transfer Protocol. Learn how to  [Deploy content using FTP](../app-service/deploy-ftp.md).

## G

### **GCP**

Google Cloud Platform. Learn how to [onboard a GPC Project](../active-directory/cloud-infrastructure-entitlement-management/onboard-gcp.md).

### **GKE**

Google Kubernetes Engine, Google's managed environment for deploying, managing, and scaling applications using GCP infrastructure.|[Deploy a Kubernetes workload using GPU sharing on your Azure Stack Edge Pro](../databox-online/azure-stack-edge-gpu-deploy-kubernetes-gpu-sharing.md).

### **Governance**

A set of rules and policies adopted by companies that run services in the cloud. The goal of cloud governance is to enhance data security, manage risk, and enable the smooth operation of cloud systems.[Governance Overview](governance-rules.md).

## I

### **IaaS**

Infrastructure as a service, a type of cloud computing service that offers essential compute, storage, and networking resources on demand, on a pay-as-you-go basis. [What is IaaS?](https://azure.microsoft.com/resources/cloud-computing-dictionary/what-is-iaas/).

### **IAM**

Identity and Access management. [Introduction to IAM](https://www.microsoft.com/security/business/security-101/what-is-identity-access-management-iam).

## J

### **JIT**

Just-in-Time VM access. [Understanding just-in-time (JIT) VM access](just-in-time-access-overview.md).

## K

### **Kill Chain**

The series of steps that describe the progression of a cyberattack from reconnaissance to data exfiltration. Defender for Cloud's supported kill chain intents are based on the MITRE ATT&CK matrix. [MITRE Attack Matrix](https://attack.mitre.org/matrices/enterprise/).

### **KQL**

Kusto Query Language - a tool to explore your data and discover patterns, identify anomalies and outliers, create statistical modeling, and more. [KQL Overview](/azure/data-explorer/kusto/query/).

## L

### **LSA**

Local Security Authority. Learn about [secure and use policies on virtual machines in Azure](../virtual-machines/security-policy.md).

## M

### **MCSB**

Microsoft Cloud Security Benchmark. See [MCSB in Defender for Cloud](concept-regulatory-compliance.md#microsoft-cloud-security-benchmark-in-defender-for-cloud).

### **MDC**

Microsoft Defender for Cloud is a Cloud Security Posture Management (CSPM) and Cloud Workload Protection Platform (CWPP) for all of your Azure, on-premises, and multicloud (Amazon AWS and Google GCP) resources. [What is Microsoft Defender for Cloud?](defender-for-cloud-introduction.md).

### **MDE**

Microsoft Defender for Endpoint is an enterprise endpoint security platform designed to help enterprise networks prevent, detect, investigate, and respond to advanced threats. [Protect your endpoints with Defender for Cloud's integrated EDR solution: Microsoft Defender for Endpoint](integration-defender-for-endpoint.md).

### **MDVM**

Microsoft Defender Vulnerability Management. Learn how to [enable vulnerability scanning with Microsoft Defender Vulnerability Management](deploy-vulnerability-assessment-defender-vulnerability-management.md).

### **MFA**

Multifactor authentication, a process in which users are prompted during the sign-in process for an extra form of identification, such as a code on their cellphone or a fingerprint scan.[How it works: Azure multifactor authentication](../active-directory/authentication/concept-mfa-howitworks.md).

### **MITRE ATT&CK**

A globally accessible knowledge base of adversary tactics and techniques based on real-world observations. [MITRE ATT&CK](https://attack.mitre.org/).

### **MMA**

Microsoft Monitoring Agent, also known as Log Analytics Agent|[Log Analytics Agent Overview](../azure-monitor/agents/log-analytics-agent.md).

## N

### **NGAV**

Next Generation Anti-Virus

### **NIST**

National Institute of Standards and Technology. See [National Institute of Standards and Technology](https://www.nist.gov/).

### **NSG**

Network Security Group. Learn about [network security groups (NSGs)](../virtual-network/network-security-groups-overview.md).

## P

### **PaaS**

Platform as a service (PaaS) is a complete development and deployment environment in the cloud, with resources that enable you to deliver everything from simple cloud-based apps to sophisticated, cloud-enabled enterprise applications. [What is PaaS?](https://azure.microsoft.com/resources/cloud-computing-dictionary/what-is-paas/).

## R

### **RaMP**

Rapid Modernization Plan,  guidance based on initiatives, giving you a set of deployment paths to more quickly implement key layers of protection. Learn about [Zero Trust Rapid Modernization Plan](../security/fundamentals/zero-trust.md).

### **RBAC**

Azure role-based access control (Azure RBAC) helps you manage who has access to Azure resources, what they can do with those resources, and what areas they have access to. [RBAC Overview](../role-based-access-control/overview.md).

### **RDP**

Remote Desktop Protocol (RDP) is a sophisticated technology that uses various techniques to perfect the server's remote graphics' delivery to the client device. [RDP Bandwidth Requirements](../virtual-desktop/rdp-bandwidth.md).

### **Recommendations**

Recommendations secure your workloads with step-by-step actions that protect your workloads from known security risks. [What are security policies, initiatives, and recommendations?](security-policy-concept.md).

### **Regulatory Compliance**

Regulatory compliance refers to the discipline and process of ensuring that a company follows the laws enforced by governing bodies in their geography or rules required. [Regulatory Compliance Overview](/azure/cloud-adoption-framework/govern/policy-compliance/regulatory-compliance).

## S

### **SAS**

Shared access signature that provides secure delegated access to resources in your storage account.[Storage SAS Overview](../storage/common/storage-sas-overview.md).

### **SaaS**

Software as a service (SaaS) allows users to connect to and use cloud-based apps over the Internet. Common examples are email, calendaring, and office tools (such as Microsoft Office 365). SaaS provides a complete software solution that you purchase on a pay-as-you-go basis from a cloud service provider.[What is SaaS?](https://azure.microsoft.com/resources/cloud-computing-dictionary/what-is-saas/).

### **Secure Score**

Defender for Cloud continually assesses your cross-cloud resources for security issues. It then aggregates all the findings into a single score that represents your current security situation: the higher the score, the lower the identified risk level. Learn more about [security posture for Microsoft Defender for Cloud](secure-score-security-controls.md).

### **Security Alerts**

Security alerts are the notifications generated by Defender for Cloud and Defender for Cloud plans when threats are identified in your cloud, hybrid, or on-premises environment.[What are security alerts?](alerts-overview.md#what-are-security-alerts)

### **Security Initiative**

A collection of Azure Policy Definitions, or rules that are grouped together towards a specific goal or purpose. [What are security policies, initiatives, and recommendations?](security-policy-concept.md)

### **Security Policy**

An Azure rule about specific security conditions that you want controlled.[Understanding Security Policies](security-policy-concept.md).

### **SIEM**

Security Information and Event Management. [What is SIEM?](https://www.microsoft.com/security/business/security-101/what-is-siem?rtc=1)

### **SOAR**

Security Orchestration Automated Response, a collection of software tools designed to collect data about security threats from multiple sources and respond to low-level security events without human assistance. Learn more about [SOAR](../sentinel/automation.md).

## T

### **TVM**

Threat and Vulnerability Management, a built-in module in Microsoft Defender for Endpoint that can discover vulnerabilities and misconfigurations in near real time and prioritize vulnerabilities based on the threat landscape and detections in your organization.[Investigate weaknesses with Microsoft Defender for Endpoint's threat and vulnerability management](deploy-vulnerability-assessment-defender-vulnerability-management.md).

## W

### **WAF**

Web Application Firewall (WAF) provides centralized protection of your web applications from common exploits and vulnerabilities. Learn more about [WAF](../web-application-firewall/overview.md).

## Z

### **Zero-Trust**

A new security model that assumes breach and verifies each request as though it originated from an uncontrolled network. Learn more about [Zero-Trust Security](../security/fundamentals/zero-trust.md).

## Next steps

[Microsoft Defender for Cloud-overview](overview-page.md)

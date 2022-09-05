---
title: Attack path security
description: Learn how to prioritize remediation of cloud misconfigurations and vulnerabilities based on risk. 
titleSuffix: Defender for Cloud attack path.
ms.topic: conceptual
ms.date: 09/05/2022
---

# What are cloud security graph, Attack Path Analysis, and Cloud Security Explorer?

**Tal will add some lines on contextual security**

## What is cloud security graph <--CHECK TO SEE IF THIS GETS CAPs

Cloud map security allows businesses to prioritize how they organize and remediate their cloud misconfigurations and vulnerabilities based on the risk level. With cloud map security, you'll gain visibility into your cloud environments and allow your security team to hunt and explore all of your cloud risks.

Security teams in general have many cloud misconfigurations and vulnerabilities to resolve. For them, it's hard to quickly understand each security risk imposed by their security issues and prioritize them in a meaningful way in order to remediate the highest risk issues. By using cloud map's graph based context and risk assessment engines, security teams can focus on the small percent of security issues that matter the most. 

:::image type="content" source="media/concept-cloud-map/security-map.png" alt-text="Image of a conceptualized graph that shows the complexity of security graphing." lightbox="media/concept-cloud-map/security-map.png":::

## What is Attack Path Analysis

Defender for Cloud provides contextual security capabilities that help organizations assess risks that their multicloud environments may be exposed to while taking into account the structure of their cloud environment and 
their unique circumstances. For example, internet exposure, permissions, connections between resources.

[Attack path analysis](#attack-path-analysis) helps you address misconfigurations and vulnerabilities that pose immediate threats 
with the greatest potential of being exploited in your environment. Defender for Cloud analyzes which security issues are part of potential attack paths that attackers could use to breach your environment. It also highlights the security recommendations that need to be resolved in order to mitigate it.

You can also build queries to help you proactively hunt for vulnerabilities in your multicloud environments and mitigate and remediate them based on their priority.

## What is Cloud Security Explorer

Defender for Cloud provides cloud security capabilities that help organizations assess their risks to their environments that are exposed. Organizations can do this while taking into account the structure of their cloud environment and its unique circumstances. Such as Internet exposure, permissions, connection between resources and more, which can affect the overall level of risk.

Cloud Security Explorer provides you the ability to perform proactive hunting and search for these security risks within your organization by running graph-based path-finding queries on top the contextual security data already provided by Defender for Cloud. Such as, cloud misconfigurations, vulnerabilities, resource context, lateral movement possibilities between resources and more.

## Assessing risk THIS SECTION MAYBE TO REMOVE

Defender for Cloud offers three ways to assess your risk of security issues that exist in your cloud environments. 

- **Graph-based context engine**: <NEED A DESCRIPTION FOR THIS>

- **Attack path analysis**: Shows you the paths that potential attackers can use to breach your environment.

- **Graph-based queries**: Building a query allows you to proactively find security risks in your environment on top of the context engine.

When you assess your environments, certain scenarios will have lower risks, and others will have higher risk. It isn't always easy to differentiate which are which. Below are some clear example of situations that would be low, medium and high risk.

### High risk example

:::image type="content" source="media/concept-cloud-map/high-risk.png" alt-text="Image that shows a virtual machine that is exposed to the internet that could get infected and allow credit card information to be stolen.":::

In this scenario, the virtual machine (VM) is exposed to the internet and all internal networks. In this scenario, the VM is putting the company at further risk because it has access to customers credit card information.

### Medium risk example

:::image type="content" source="media/concept-cloud-map/medium-risk.png" alt-text="Image that shows a virtual machine that is exposed to the internet that could get infected.":::

In this scenario, we have a VM that is exposed to the internet and got infected but doesn't have access to any sensitive information. Since no sensitive information is exposed, this scenario should be mitigated, but doesn't require the highest level priority.

### Low risk scenario

:::image type="content" source="media/concept-cloud-map/low-risk.png" alt-text="Image that shows a lone virtual machine with no internet access and no exposure to sensitive information.":::

In this scenario, we have a VM that is isolated from internet and all internal devices in the virtual network. It has a low risk of being compromised by an attacker.

## Cloud security engine

Security teams are expected to prioritize risks and remediate them. Microsoft Defender for Cloud allows you to search for all your cloud workloads that are affected by CVEs. However, it could be that there are many VMs that are infected with CVEs (for example, running a Log4j infected version), how does a security team decide which VMs has the highest risk of being exploited.

Defender for Cloud's security engine gathers all of the relevant information from your environments and creates a model of the data as a graph of inter-connected cloud assets. Security teams can then use the attack path analysis to prioritize and remediate all of their security threats.

:::image type="content" source="media/concept-cloud-map/attack-path-analysis.png" alt-text="Screenshot that shows a sample scenario that has the attack path analysis displayed." lightbox="media/concept-cloud-map/attack-path-analysis.png":::

By providing the environmental security context, organizations can prioritize and mitigate their most critical risks in their hybrid cloud environments.

Defender for Cloud can protect your multicloud and hybrid workloads by using the following Defender for Cloud plans:

| Plan name | Description|
|--|--|
| Defender for DevOps | Removes the separation that exists between security teams and developers by embedding security in your developer workflows giving security teams a centralized visibility and policy control.|
| Defender for API | Focuses on threat protection for APIs that are built by organizations that provide cross-organizational visibility of the APIM API inventory, data classification and coverage to detect exploits of API risks. |
| Defender for Serverless | Supports Azure Functions and AWSLambda to help organizations protect their serverless resources. |
| Defender for Servers | Protects your Windows and Linux machines in Azure, AWS, GCP, and on-premises. |
| Defender for Containers | Secures your containers so you can improve, monitor, and maintain the security of your clusters, containers, and their applications. |
| Defender for Data | Offers discovery, posture management and protection for all of your cloud datastores. | 

## Features of the attack path overview page

The attack path homepage offers you an overview of your total attack paths. From here you can see all of your affected resources and a list of all active recommendations.

:::image type="content" source="media/concept-cloud-map/attack-path-homepage.png" alt-text="Screenshot of a sample attack path homepage.":::

On this page you can organize your recommendations based on name, environment, paths count, risk categories.

For each recommendation you can also see all of risk categories and affected resources.

The potential risk categories include Credentials exposure, Compute abuse, Data exposure, Subscription/account takeover.

The types of resources that can be infected include:

| Resource icon | Name |
|--|--|
| :::image type="icon" source="media/concept-cloud-map/keyvault-icon.png" border="false":::  | Key Vault |
| :::image type="icon" source="media/concept-cloud-map/managed-identity-icon.png" border="false"::: | Managed Identity |
| :::image type="icon" source="media/concept-cloud-map/public-ip-icon.png" border="false"::: | Public IP |
| :::image type="icon" source="media/concept-cloud-map/virtual-machine-icon.png" border="false"::: | Virtual Machine |
| :::image type="icon" source="media/concept-cloud-map/container-icon.png" border="false"::: | Container |
| :::image type="icon" source="media/concept-cloud-map/k8s-pods-icon.png" border="false"::: | Kubernetes pod |
| :::image type="icon" source="media/concept-cloud-map/virtual-machine-scale-set-icon.png" border="false"::: | Virtual Machine Scale Set |
| :::image type="icon" source="media/concept-cloud-map/k8s-namespace-icon.png" border="false"::: | Kubernetes namespace |
| :::image type="icon" source="media/concept-cloud-map/container-image-icon.png" border="false"::: | Container image |
| :::image type="icon" source="media/concept-cloud-map/k8s-service-icon.png" border="false"::: | Kubernetes service or ingress |
| :::image type="icon" source="media/concept-cloud-map/managed-cluster-icon.png" border="false"::: | Managed cluster |
| :::image type="icon" source="media/concept-cloud-map/subscription-icon.png" border="false"::: | Subscription |
| :::image type="icon" source="media/concept-cloud-map/storage-icon.png" border="false"::: | Storage |
| :::image type="icon" source="media/concept-cloud-map/resource-group-icon.png" border="false"::: | Resource group |
| :::image type="icon" source="media/concept-cloud-map/sql-database-icon.png" border="false"::: | Sql Database |
| :::image type="icon" source="media/concept-cloud-map/sql-server-icon.png" ::: | Sql Server |

## Next steps



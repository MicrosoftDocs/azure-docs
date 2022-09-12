---
title: What are the Cloud Security Graph, Attack Path Analysis, and the Cloud Security Explorer? 
description: Learn how to prioritize remediation of cloud misconfigurations and vulnerabilities based on risk. 
titleSuffix: Defender for Cloud attack path.
ms.topic: conceptual
ms.date: 09/12/2022
---

# What are the Cloud Security Graph, Attack Path Analysis, and the Cloud Security Explorer? 

One of the biggest challenges that security teams face today is the amount of security issues. There are always numerous security issues that need to be resolve and never enough resources to address them all. 

Defender for Cloud's contextual security capabilities assist security teams to assess the risk behind each security issue, and identify the highest risk issues that need to be resolved soonest. Defender for Cloud assists security teams to reduce the risk of an impactful breach to their environment in the most effective way. 

## What is Cloud Security Graph

The Cloud Security Graph is a graph-based context engine that exists within Defender for Cloud, that compares the risk-assessment of security issues. Cloud Security Graph collects data from your multi cloud environment and numerous amount of data sources, such as, The cloud assets inventory, connections and lateral movement possibilities between resources, exposure to internet, permissions, network connections, vulnerabilities and more, to build a graph representing your multi-cloud environment. 

Defender for Cloud then uses the generated graph to perform an attack path analysis and find the issues with the highest risk that exist within your environment. You can also query the graph using the explorer.  

:::image type="content" source="media/concept-cloud-map/security-map.png" alt-text="Image of a conceptualized graph that shows the complexity of security graphing." lightbox="media/concept-cloud-map/security-map.png":::

## What is Attack Path Analysis

Attack Path Analysis is a graph-based algorithm that scans the Cloud Security Graph and detects exploitable paths that attackers may use in order to breach your environment to reach your high-impact assets. Attack Path Analysis exposes those attack paths and suggests recommendations as to how best remediate the issues that will break the attack path and prevent successful breach. 

By taking your environment's contextual information into account such as, internet exposure, permissions, lateral movement, and more. Attack Path Analysis can identify the issues that can lead to an impactful breach on your environment, and help you to remediate those first. 

:::image type="content" source="media/concept-cloud-map/attack-path.png" alt-text="Image that shows a sample attack path from attacker to your sensitive data.":::

Learn how to use [Attack Path Analysis](how-to-manage-attack-path.md).

## What is Cloud Security Explorer

The Cloud Security Explorer allows you to proactively identify security risks in your multi cloud environment by running graph-based queries on the Cloud Security Graph. Your security team can use the query builder to search for and locate risks, while taking your organization's specific contextual and conventional information into account. 

Learn how to use the [Cloud Security Explorer](how-to-manage-cloud-security-explorer.md).

Defender for Cloud provides cloud security capabilities that help organizations assess their risks to their environments that are exposed. Organizations can do this while taking into account the structure of their cloud environment and its unique circumstances. Such as Internet exposure, permissions, connection between resources and more, which can affect the overall level of risk.

Cloud Security Explorer provides you the ability to perform proactive hunting and search for these security risks within your organization by running graph-based path-finding queries on top the contextual security data already provided by Defender for Cloud. Such as, cloud misconfigurations, vulnerabilities, resource context, lateral movement possibilities between resources and more.

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



---
title: Azure Security Control - Network Security
description: Azure Security Control Network Security
author: msmbaldwin
ms.service: security
ms.topic: conceptual
ms.date: 04/14/2020
ms.author: mbaldwin
ms.custom: security-benchmark

---

# Security Control: Network Security

Network security recommendations focus on specifying which network protocols, TCP/UDP ports, and network connected services are allowed or denied access to Azure services.

## 1.1: Protect Azure resources within virtual networks

| Azure ID | CIS IDs | Responsibility |
|--|--|--|
| 1.1 | 9.2, 9.4, 14.1, 14.2, 14.3 | Customer |

Ensure that all Virtual Network subnet deployments have a Network Security Group applied with network access controls specific to your application's trusted ports and sources. When available, use Private Endpoints with Private Link to secure your Azure service resources to your virtual network by extending VNet identity to the service. When Private Endpoints and Private Link not available, use Service Endpoints. For service specific requirements, please refer to the security recommendation for that specific service. 

Alternatively, if you have a specific use case, requirement may be met by implementing Azure Firewall.

- [Understand Virtual Network Service Endpoints](../../virtual-network/virtual-network-service-endpoints-overview.md)

- [Understand Azure Private Link](../../private-link/private-link-overview.md)

- [How to create a Virtual Network](../../virtual-network/quick-create-portal.md)

- [How to create an NSG with a security configuration](../../virtual-network/tutorial-filter-network-traffic.md)

- [How to deploy and configure Azure Firewall](../../firewall/tutorial-firewall-deploy-portal.md)

## 1.2: Monitor and log the configuration and traffic of virtual networks, subnets, and NICs

| Azure ID | CIS IDs | Responsibility |
|--|--|--|
| 1.2 | 9.3, 12.2, 12.8 | Customer |

Use Azure Security Center and follow network protection recommendations to help secure your network resources in Azure. Enable NSG flow logs and send logs into a Storage Account for traffic audit. You may also send NSG flow logs to a Log Analytics Workspace and use Traffic Analytics to provide insights into traffic flow in your Azure cloud. Some advantages of Traffic Analytics are the ability to visualize network activity and identify hot spots, identify security threats, understand traffic flow patterns, and pinpoint network misconfigurations.

- [How to Enable NSG Flow Logs](../../network-watcher/network-watcher-nsg-flow-logging-portal.md)

- [How to Enable and use Traffic Analytics](../../network-watcher/traffic-analytics.md)

- [Understand Network Security provided by Azure Security Center](../../security-center/security-center-network-recommendations.md)

## 1.3: Protect critical web applications

| Azure ID | CIS IDs | Responsibility |
|--|--|--|
| 1.3 | 9.5 | Customer |

Deploy Azure Web Application Firewall (WAF) in front of critical web applications for additional inspection of incoming traffic. Enable Diagnostic Setting for WAF and ingest logs into a Storage Account, Event Hub, or Log Analytics Workspace.

- [How to deploy Azure WAF](../../web-application-firewall/ag/create-waf-policy-ag.md)

## 1.4: Deny communications with known malicious IP addresses

| Azure ID | CIS IDs | Responsibility |
|--|--|--|
| 1.4 | 12.3 | Customer |

Enable DDoS Standard protection on your Azure Virtual Networks to guard against DDoS attacks. Use Azure Security Center Integrated Threat Intelligence to deny communications with known malicious IP addresses.

Deploy Azure Firewall at each of the organization's network boundaries with Threat Intelligence enabled and configured to "Alert and deny" for malicious network traffic.

Use Azure Security Center Just In Time Network access to configure NSGs to limit exposure of endpoints to approved IP addresses for a limited period.

Use Azure Security Center Adaptive Network Hardening to recommend NSG configurations that limit ports and source IPs based on actual traffic and threat intelligence.

- [How to configure DDoS protection](../../virtual-network/manage-ddos-protection.md)

- [How to deploy Azure Firewall](../../firewall/tutorial-firewall-deploy-portal.md)

- [Understand Azure Security Center Integrated Threat Intelligence](../../security-center/azure-defender.md)

- [Understand Azure Security Center Adaptive Network Hardening](../../security-center/security-center-adaptive-network-hardening.md)

- [Understand Azure Security Center Just In Time Network Access Control](../../security-center/security-center-just-in-time.md)

## 1.5: Record network packets

| Azure ID | CIS IDs | Responsibility |
|--|--|--|
| 1.5 | 12.5 | Customer |

Enable Network Watcher packet capture to investigate anomalous activities.

- [How to enable Network Watcher](../../network-watcher/network-watcher-create.md)

## 1.6: Deploy network based intrusion detection/intrusion prevention systems (IDS/IPS)

| Azure ID | CIS IDs | Responsibility |
|--|--|--|
| 1.6 | 12.6, 12.7 | Customer |

Select an offer from the Azure Marketplace that supports IDS/IPS functionality with payload inspection capabilities.  If intrusion detection and/or prevention based on payload inspection is not a requirement, Azure Firewall with Threat Intelligence can be used. Azure Firewall Threat intelligence-based filtering can alert and deny traffic to and from known malicious IP addresses and domains. The IP addresses and domains are sourced from the Microsoft Threat Intelligence feed.

Deploy the firewall solution of your choice at each of your organization's network boundaries to detect and/or deny malicious traffic.

- [Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/?term=Firewall)

- [How to deploy Azure Firewall](../../firewall/tutorial-firewall-deploy-portal.md)

- [How to configure alerts with Azure Firewall](../../firewall/threat-intel.md)

## 1.7: Manage traffic to web applications

| Azure ID | CIS IDs | Responsibility |
|--|--|--|
| 1.7 | 12.9, 12.10 | Customer |

Deploy Azure Application Gateway for web applications with HTTPS/TLS enabled for trusted certificates.

- [How to deploy Application Gateway](../../application-gateway/quick-create-portal.md)

- [How to configure Application Gateway to use HTTPS](../../application-gateway/create-ssl-portal.md)

- [Understand layer 7 load balancing with Azure web application gateways](../../application-gateway/overview.md)

## 1.8: Minimize complexity and administrative overhead of network security rules

| Azure ID | CIS IDs | Responsibility |
|--|--|--|
| 1.8 | 1.5 | Customer |

Use Virtual Network Service Tags to define network access controls on Network Security Groups or Azure Firewall. You can use service tags in place of specific IP addresses when creating security rules. By specifying the service tag name (e.g., ApiManagement) in the appropriate source or destination field of a rule, you can allow or deny the traffic for the corresponding service. Microsoft manages the address prefixes encompassed by the service tag and automatically updates the service tag as addresses change.

You may also use Application Security Groups to help simplify complex security configuration. Application security groups enable you to configure network security as a natural extension of an application's structure, allowing you to group virtual machines and define network security policies based on those groups.

- [Understand and use Service Tags](../../virtual-network/service-tags-overview.md)

- [Understand and use Application Security Groups](../../virtual-network/network-security-groups-overview.md#application-security-groups)

## 1.9: Maintain standard security configurations for network devices

| Azure ID | CIS IDs | Responsibility |
|--|--|--|
| 1.9 | 11.1 | Customer |

Define and implement standard security configurations for network resources with Azure Policy.

You may also use Azure Blueprints to simplify large scale Azure deployments by packaging key environment artifacts, such as Azure Resources Manager templates, RBAC controls, and policies, in a single blueprint definition. You can apply the blueprint to new subscriptions, and fine-tune control and management through versioning.

- [How to configure and manage Azure Policy](../../governance/policy/tutorials/create-and-manage.md)

- [Azure Policy samples for networking](../../governance/policy/samples/built-in-policies.md#network)

- [How to create an Azure Blueprint](../../governance/blueprints/create-blueprint-portal.md)

## 1.10: Document traffic configuration rules

| Azure ID | CIS IDs | Responsibility |
|--|--|--|
| 1.10 | 11.2 | Customer |

Use Tags for NSGs and other resources related to network security and traffic flow. For individual NSG rules, use the "Description" field to specify business need and/or duration (etc.) for any rules that allow traffic to/from a network.

Use any of the built-in Azure Policy definitions related to tagging, such as "Require tag and its value" to ensure that all resources are created with Tags and to notify you of existing untagged resources.

You may use Azure PowerShell or Azure CLI to look-up or perform actions on resources based on their Tags.

- [How to create and use Tags](../../azure-resource-manager/management/tag-resources.md)

- [How to create a Virtual Network](../../virtual-network/quick-create-portal.md)

- [How to create an NSG with a Security Config](../../virtual-network/tutorial-filter-network-traffic.md)

## 1.11: Use automated tools to monitor network resource configurations and detect changes

| Azure ID | CIS IDs | Responsibility |
|--|--|--|
| 1.11 | 11.3 | Customer |

Use Azure Activity Log to monitor resource configurations and detect changes to your Azure resources. Create alerts within Azure Monitor that will trigger when changes to critical resources take place.

- [How to view and retrieve Azure Activity Log events](../../azure-monitor/platform/activity-log.md#view-the-activity-log)

- [How to create alerts in Azure Monitor](../../azure-monitor/platform/alerts-activity-log.md)

## Next steps

- See the next Security Control: [Logging and Monitoring](security-control-logging-monitoring.md)
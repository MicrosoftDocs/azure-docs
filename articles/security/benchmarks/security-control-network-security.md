---
title: Azure Security Control - Network Security
description: Security Control Network Security
author: msmbaldwin
manager: rkarlin

ms.service: security
ms.topic: conceptual
ms.date: 12/30/2019
ms.author: mbaldwin
ms.custom: security-recommendations

---

# Security Control: Network Security

Network security recommendations focus on specifying which network protocols, TCP/UDP ports, and network connected services are allowed or denied access to Azure services.

## 1.1: Protect resources using Network Security Groups or Azure Firewall on your Virtual Network

| Azure ID | CIS IDs | Responsibility |
|--|--|--|
| 1.1 | 9.2, 9.4, 14.1-14.3 | Customer |

Ensure that all Virtual Network subnet deployments have a Network Security Group applied with network access controls specific to your application's trusted ports and sources. Use Azure Services with Private Link enabled, deploy the service inside your Vnet, or connect privately using Private Endpoints. For service specific requirements, please refer to the security recommendation for that specific service.

Alternatively, if you have a specific use case, requirements can be met by implementing Azure Firewall.

General Information on Private Link:

https://docs.microsoft.com/azure/private-link/private-link-overview

How to create a Virtual Network:

https://docs.microsoft.com/azure/virtual-network/quick-create-portal

How to create an NSG with a security configuration:

https://docs.microsoft.com/azure/virtual-network/tutorial-filter-network-traffic

How to deploy and configure Azure Firewall:

https://docs.microsoft.com/azure/firewall/tutorial-firewall-deploy-portal

## 1.2: Monitor and log the configuration and traffic of Vnets, Subnets, and NICs

| Azure ID | CIS IDs | Responsibility |
|--|--|--|
| 1.2 | 9.3, 12.2 | Customer |

Use Azure Security Center and follow network protection recommendations to help secure your network resources in Azure. Enable NSG flow logs and send logs into a Storage Account for traffic audit.

How to Enable NSG Flow Logs:

https://docs.microsoft.com/azure/network-watcher/network-watcher-nsg-flow-logging-portal

Understand Network Security provided by Azure Security Center:

https://docs.microsoft.com/azure/security-center/security-center-network-recommendations

## 1.3: Protect critical web applications

| Azure ID | CIS IDs | Responsibility |
|--|--|--|
| 1.3 | 9.5 | Customer |

Deploy Azure Web Application Firewall (WAF) in front of critical web applications for additional inspection of incoming traffic. Enable Diagnostic Setting for WAF and ingest logs into a Storage Account, Event Hub, or Log Analytics Workspace.

How to deploy Azure WAF:

https://docs.microsoft.com/azure/web-application-firewall/ag/create-waf-policy-ag

## 1.4: Deny communications with known malicious IP addresses

| Azure ID | CIS IDs | Responsibility |
|--|--|--|
| 1.4 | 12.3 | Customer |

Enable DDoS Standard protection on your Azure Virtual Networks to guard against DDoS attacks. Use Azure Security Center Integrated Threat Intelligence to deny communications with known malicious IP addresses.

Deploy Azure Firewall at each of the organization's network boundaries with Threat Intelligence enabled and configured to &quot;Alert and deny&quot; for malicious network traffic.

Use Azure Security Center Just In Time Network access to configure NSGs to limit exposure of endpoints to approved IP addresses for a limited period.

Use Azure Security Center Adaptive Network Hardening to recommend NSG configurations that limit ports and source IPs based on actual traffic and threat intelligence.

How to configure DDoS protection:

https://docs.microsoft.com/azure/virtual-network/manage-ddos-protection

How to deploy Azure Firewall:

https://docs.microsoft.com/azure/firewall/tutorial-firewall-deploy-portal

Understand Azure Security Center Integrated Threat Intelligence:

https://docs.microsoft.com/azure/security-center/security-center-alerts-service-layer

Understand Azure Security Center Adaptive Network Hardening:

https://docs.microsoft.com/azure/security-center/security-center-adaptive-network-hardening

Understand Azure Security Center Just In Time Network Access Control:

https://docs.microsoft.com/azure/security-center/security-center-just-in-time

## 1.5: Record network packets and flow logs

| Azure ID | CIS IDs | Responsibility |
|--|--|--|
| 1.5 | 12.5, 15.8 | Customer |

Record NSG flow logs into a storage account to generate flow records. If required for investigating anomalous activity, enable Network Watcher packet capture.

How to Enable NSG Flow Logs:

https://docs.microsoft.com/azure/network-watcher/network-watcher-nsg-flow-logging-portal

How to enable Network Watcher:

https://docs.microsoft.com/azure/network-watcher/network-watcher-create

## 1.6: Deploy network based intrusion detection/intrusion prevention systems (IDS/IPS)

| Azure ID | CIS IDs | Responsibility |
|--|--|--|
| 1.6 | 12.6, 12.7 | Customer |

Deploy Azure Firewall at each of the organization's network boundaries with Threat Intelligence enabled and configured to &quot;Alert and deny&quot; for malicious network traffic.

How to deploy Azure Firewall:
https://docs.microsoft.com/azure/firewall/tutorial-firewall-deploy-portal

How to configure alerts with Azure Firewall:
https://docs.microsoft.com/azure/firewall/threat-intel

## 1.7: Manage traffic to web applications

| Azure ID | CIS IDs | Responsibility |
|--|--|--|
| 1.7 | 12.9, 12.10 | Customer |

Deploy Azure Application Gateway for web applications with HTTPS/SSL enabled for trusted certificates.

How to deploy Application Gateway:

https://docs.microsoft.com/azure/application-gateway/quick-create-portal

How to configure Application Gateway to use HTTPS:

https://docs.microsoft.com/azure/application-gateway/create-ssl-portal

Understand layer 7 load balancing with Azure web application gateways:

https://docs.microsoft.com/azure/application-gateway/overview

## 1.8: Minimize complexity and administrative overhead of network security rules

| Azure ID | CIS IDs | Responsibility |
|--|--|--|
| 1.8 | 1.5 | Customer |

Use Virtual Network Service Tags to define network access controls on Network Security Groups or Azure Firewall. You can use service tags in place of specific IP addresses when creating security rules. By specifying the service tag name (e.g., ApiManagement) in the appropriate source or destination field of a rule, you can allow or deny the traffic for the corresponding service. Microsoft manages the address prefixes encompassed by the service tag and automatically updates the service tag as addresses change.

Understand and use Service Tags:

https://docs.microsoft.com/azure/virtual-network/service-tags-overview

## 1.9: Maintain standard security configurations for network devices

| Azure ID | CIS IDs | Responsibility |
|--|--|--|
| 1.9 | 11.1 | Customer |

Define and implement standard security configurations for network resources with Azure Policy.

You may also use Azure Blueprints to simplify large scale Azure deployments by packaging key environment artifacts, such as Azure Resource Manager templates, RBAC controls, and policies, in a single blueprint definition. You can apply the blueprint to new subscriptions and fine-tune control and management through versioning.

How to configure and manage Azure Policy:

https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage

Azure Policy samples for networking:

https://docs.microsoft.com/azure/governance/policy/samples/#network

How to create an Azure Blueprint:

https://docs.microsoft.com/azure/governance/blueprints/create-blueprint-portal

## 1.10: Document traffic configuration rules

| Azure ID | CIS IDs | Responsibility |
|--|--|--|
| 1.1 | 11.2 | Customer |

Use Tags for NSGs and other resources related to network security and traffic flow. For individual NSG rules, use the &quot;Description&quot; field to specify business need and/or duration (etc.) for any rules that allow traffic to/from a network.

How to create and use Tags:

https://docs.microsoft.com/azure/azure-resource-manager/resource-group-using-tags

How to create a Virtual Network:

https://docs.microsoft.com/azure/virtual-network/quick-create-portal

How to create an NSG with a Security Config:

https://docs.microsoft.com/azure/virtual-network/tutorial-filter-network-traffic

## 1.11: Use automated tools to monitor network resource configurations and detect changes

| Azure ID | CIS IDs | Responsibility |
|--|--|--|
| 1.11 | 11.3 | Customer |

Use Azure Policy to validate (and/or remediate) configuration for network resources.

How to configure and manage Azure Policy:

https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage

Azure Policy samples for networking:

https://docs.microsoft.com/azure/governance/policy/samples/#network

## Next steps

- See the next security control: [Logging and Monitoring](security-control-logging-monitoring.md)
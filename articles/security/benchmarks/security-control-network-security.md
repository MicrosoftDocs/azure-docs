---
title: Security Control - Network Security
description: Security Control Network Security
author: msmbaldwin
manager: rkarlin

ms.service: security
ms.topic: conceptual
ms.date: 12/17/2019
ms.author: mbaldwin
ms.custom: security-recommendations

---

# Security Control: Network Security

## 1.1: Protect resources using Network Security Groups or Azure Firewall on your Virtual Network

| Azure ID | CIS Control IDs | Responsibility |
|--|--|--|
| 1.1 | 9.2, 9.4, 14.1-14.3 | Customer |

Ensure that all Virtual Network subnet deployments have a Network Security Group applied with network access controls specific to your applications trusted ports and sources. Use Azure Services with Private Link enabled, deploy the service inside your VNet or connect privately using Private Endpoints. For service specific requirements, please refer to the security recommendation for that specific service.<br><br><div>You can also use the Azure Firewall together with Network Security Groups to further enhance network security.<br></div><br>How to create a Virtual Network:<br>https://docs.microsoft.com/en-us/azure/virtual-network/quick-create-portal<br><br>How to create an NSG with a Security Config:<br>https://docs.microsoft.com/en-us/azure/virtual-network/tutorial-filter-network-traffic<br><br>How to deploy and configure Azure Firewall:<br>https://docs.microsoft.com/en-us/azure/firewall/tutorial-firewall-deploy-portal

## 1.2: <div>Monitor and log <span style="display:inline !important;">Vnet, Subnet, and NIC&nbsp;</span>configuration and traffic</div>

| Azure ID | CIS Control IDs | Responsibility |
|--|--|--|
| 1.2 | 9.3, 12.2 | Customer |

<div>Use Azure Security Center and follow network protection recommendations to help secure your network resources in Azure. Enable NSG flow logs and send logs into a Storage Account for traffic audit.<br></div><br>How to Enable NSG Flow Logs:<br>https://docs.microsoft.com/en-us/azure/network-watcher/network-watcher-nsg-flow-logging-portal<br><br>Understanding Network Security provided by Azure Security Center:<br>https://docs.microsoft.com/en-us/azure/security-center/security-center-network-recommendations

## 1.3: Protect Critical Web Applications

| Azure ID | CIS Control IDs | Responsibility |
|--|--|--|
| 1.3 | 9.5 | Customer |

Deploy Azure Web Application Firewall (WAF) in front of critical web applications for additional inspection of incoming traffic. Enable Diagnostic Setting for WAF and ingest logs into a Storage Account, Event Hub, or Log Analytics Workspace.<br><br><br><br>How to deploy Azure WAF:<br><br>https://docs.microsoft.com/en-us/azure/web-application-firewall/ag/create-waf-policy-ag

## 1.4: Deny Communications with Known Malicious IP Addresses

| Azure ID | CIS Control IDs | Responsibility |
|--|--|--|
| 1.4 | 12.3 | Customer |

<div>Enable DDoS Standard protection on your Azure Virtual Networks for protections from DDoS attacks. Use Azure Security Center Integrated Threat Intelligence to deny communications with known malicious or unused Internet IP addresses.<br></div><br>Deploy Azure Firewall at each of the organization's network boundaries with Threat Intelligence enabled and configured to &quot;Alert and deny&quot; for malicious network traffic.<br><br>How to configure DDoS protection:<br>https://docs.microsoft.com/en-us/azure/virtual-network/manage-ddos-protection<br><br>How to deploy Azure Firewall:<br>https://docs.microsoft.com/en-us/azure/firewall/tutorial-firewall-deploy-portal<br><br>Understand Azure Security Center Integrated Threat Intelligence:<br>https://docs.microsoft.com/en-us/azure/security-center/security-center-alerts-service-layer

## 1.5: Record Network Packets and Flow Logs

| Azure ID | CIS Control IDs | Responsibility |
|--|--|--|
| 1.5 | 12.5, 15.8 | Customer |

Record NSG flow logs into a Storage Account to generate flow records. If required for investigating anomalous activity, enable Network Watcher packet capture.<br><br>How to Enable NSG Flow Logs:<br>https://docs.microsoft.com/en-us/azure/network-watcher/network-watcher-nsg-flow-logging-portal<br><br>How to enable Network Watcher:<br>https://docs.microsoft.com/en-us/azure/network-watcher/network-watcher-create

## 1.6: Deploy Network Based Intrusion Detection/Intrusion Prevention Systems

| Azure ID | CIS Control IDs | Responsibility |
|--|--|--|
| 1.6 | 12.6, 12.7 | Customer |

Deploy Azure Firewall at each of the organization's network boundaries with Threat Intelligence enabled and configured to &quot;Alert and deny&quot; for malicious network traffic.<br><br>How to deploy Azure Firewall:<br>https://docs.microsoft.com/en-us/azure/firewall/tutorial-firewall-deploy-portal<br><br>How to configure alert or alert and deny with Azure Firewall:<br>https://docs.microsoft.com/en-us/azure/firewall/threat-intel

## 1.7: Manage traffic to your web applications

| Azure ID | CIS Control IDs | Responsibility |
|--|--|--|
| 1.7 | 12.9, 12.10 | Customer |

Deploy Application Gateway for web applications with HTTPS/SSL enabled for trusted certificates.<br><br>How to deploy Application Gateway:<br>https://docs.microsoft.com/en-us/azure/application-gateway/quick-create-portal<br><br>How to configure Application Gateway to use HTTPS:<br>https://docs.microsoft.com/en-us/azure/application-gateway/create-ssl-portal<br><br>Understanding layer 7 load balancing with Azure web application gateways:<br>https://docs.microsoft.com/en-us/azure/application-gateway/overview

## 1.8: Minimize complexity and administrative overhead of network security rules

| Azure ID | CIS Control IDs | Responsibility |
|--|--|--|
| 1.8 | 1.5 | Customer |

<div>Use Virtual Network Service Tags &nbsp;to define network access controls on Network Security Groups or Azure Firewall. You can use service tags in place of specific IP addresses when creating security rules. By specifying the service tag name (e.g., ApiManagement) in the appropriate source or destination field of a rule, you can allow or deny the traffic for the corresponding service. Microsoft manages the address prefixes encompassed by the service tag and automatically updates the service tag as addresses change.<br></div><br>Understanding and using Service Tags:<br>https://docs.microsoft.com/en-us/azure/virtual-network/service-tags-overview

## 1.9: Maintain Standard Security Configurations for Network Devices

| Azure ID | CIS Control IDs | Responsibility |
|--|--|--|
| 1.9 | 11.1 | Customer |

<div>You should define and implement standard security configurations for network resources with Azure Policy.<br></div><br><div>You may also use Azure Blueprints to simplify large scale Azure deployments by packaging key environment artifacts, such as ARM templates, RBAC controls, and policies, in a single blueprint definition. You can apply the blueprint to new subscriptions and environments, and fine-tune control and management through versioning.<br></div><br>How to configure and manage Azure Policy:<br>https://docs.microsoft.com/en-us/azure/governance/policy/tutorials/create-and-manage<br><br>How to create an Azure Blueprint:<br>https://docs.microsoft.com/en-us/azure/governance/blueprints/create-blueprint-portal

## 1.1: Document Traffic Configuration Rules

| Azure ID | CIS Control IDs | Responsibility |
|--|--|--|
| 1.1 | 11.2 | Customer |

<div>Use Tags for NSGs and other resources related to network security and traffic flow. For individual NSG rules, use the &quot;Description&quot; field to specify business need and/or duration (etc.) for any rules that allow traffic to/from a network.<br></div><br>How to create and utilize Tags:<br>https://docs.microsoft.com/azure/azure-resource-manager/resource-group-using-tags<br><br>How to create a Virtual Network:<br>https://docs.microsoft.com/azure/virtual-network/quick-create-portal<br><br>How to create an NSG with a Security Config:<br>https://docs.microsoft.com/azure/virtual-network/tutorial-filter-network-traffic

## 1.11: Use Automated Tools to Monitor Network Resource Configurations and Detect Changes

| Azure ID | CIS Control IDs | Responsibility |
|--|--|--|
| 1.11 | 11.3 | Customer |

<div>Use Azure Policy to validate (and/or remediate) configuration for network resources.<br></div><br>How to configure and manage Azure Policy:<br>https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage


---
title: Secure your Azure Virtual Network deployment
description: Learn how to secure Azure Virtual Network, with best practices for network configuration, segmentation, monitoring, and access control.
author: msmbaldwin
ms.author: mbaldwin
ms.service: security
ms.topic: conceptual
ms.custom: horz-security
ms.date: 04/23/2025
---

# Secure your Azure Virtual Network deployment

Azure Virtual Network (VNet) is the fundamental building block for your private network in Azure. VNet enables many types of Azure resources, such as Azure Virtual Machines (VM), to securely communicate with each other, the internet, and on-premises networks. However, to maintain a strong security posture, you must implement proper configurations and controls for your virtual networks.

This article provides guidance on how to best secure your Azure Virtual Network deployment.

## Network security

Network security for Azure Virtual Networks involves establishing proper network segmentation, implementing traffic filtering through Network Security Groups, and ensuring that communication between resources follows the principle of least privilege. Proper network security configurations help minimize the attack surface and protect your workloads from unauthorized access.

- **Establish network segmentation boundaries using Network Security Groups**: Use Network Security Groups (NSGs) to control traffic flow to and from Azure resources in your virtual network. NSGs allow you to filter network traffic by source and destination IP address, port, and protocol, enabling you to implement security rules that follow the principle of least privilege. For more details, see [Restrict network access to resources](/azure/virtual-network/tutorial-restrict-network-access-to-resources).

- **Isolate and segment workloads using Virtual Networks (VNets)**: Create separate virtual networks or subnets for workloads with different security requirements. This segmentation helps contain security breaches and minimizes the potential impact of an attack by limiting lateral movement within your environment. Consider factors such as regulatory requirements, administrative boundaries, and workload risk levels when designing your segmentation strategy. For more details, see [Azure Virtual Network](/azure/virtual-network/).

- **Control traffic flow with Network Security Groups (NSGs)**: Apply NSGs to control inbound and outbound traffic for virtual machines and subnets within VNets. Use a "deny by default, permit by exception" approach to restrict traffic flow and protect sensitive resources. Regularly review and audit your NSG rules to ensure they remain aligned with your security requirements. For more details, see [Network Security Groups](/azure/virtual-network/network-security-groups-overview).

## Asset management

Effective asset management for Azure Virtual Networks involves maintaining visibility into your network resources, enforcing consistent configurations, and ensuring compliance with organizational policies. By implementing proper asset management practices, you can reduce configuration drift and maintain a strong security posture.

- **Use only approved services with Azure Policy**: Implement Azure Policy to audit and enforce configurations across your Azure Virtual Network resources. Azure Policy helps you maintain compliance with your organization's standards by evaluating your resources against defined rules. Use Microsoft Defender for Cloud to configure Azure Policy and create alerts when configuration deviations are detected. Implement [deny] and [deploy if not exists] policy effects to enforce secure configurations across your virtual network resources. For more details, see [Azure Policy built-in definitions for Azure Virtual Network](/azure/virtual-network/policy-reference).

## Logging and threat detection

Comprehensive logging and monitoring are essential for identifying potential security threats in your Azure Virtual Network. By capturing detailed activity logs and implementing proper monitoring, you can detect suspicious activities, troubleshoot issues, and maintain an audit trail for compliance purposes.

- **Enable logging for security investigation with Azure Resource Logs**: Configure Azure Resource Logs for your Virtual Network to capture detailed information about network traffic and security events. These logs provide valuable insights for security investigations and compliance reporting. Send the logs to Azure Monitor, a Log Analytics workspace, or a storage account for long-term retention and analysis. Implement log retention policies that align with your organization's compliance requirements. For more details, see [Azure Monitor resource logs](/azure/azure-monitor/platform/platform-logs-overview).

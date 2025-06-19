---
title: Troubleshoot managed private endpoint connection issues
description: Troubleshoot connecting a managed private endpoint to a private link service in Azure Managed Grafana.
author: maud-lv
ms.author: malev
ms.topic: troubleshooting
ms.service: azure-managed-grafana
ms.date: 04/25/2025
ai-usage: ai-assisted
---

# Troubleshoot connecting managed private endpoint to a private link service

This article guides you to troubleshoot and fix issues related to connecting Azure Managed Grafana to an AKS cluster via a private link service.

## Symptom

Grafana is unable to connect to a private link service that exposes a service running in an Azure Kubernetes Service (AKS) cluster.

## Possible causes

The issue may occur due to one or more of the following reasons:

- The managed private endpoint isn't approved.
- Network security group (NSG) rules are blocking the connection.
- The private link service isn't properly configured to accept connections from the managed private endpoint.
- The port configuration between the monitored service, the load balancer, and the private link service is inconsistent.

## Resolution

Follow these steps to resolve the issue:

### Step 1: Verify managed private endpoint approval

1. In the Azure portal, navigate to the **Setting** > **Networking** > **Managed Private Endpoint** section of your Azure Managed Grafana resource.
1. Check the state of the managed private endpoint. If it's "Pending", approve the connection.
1. Ensure the private endpoint is connected to the correct private link service.
1. Verify that the private link service owner has approved the connection request.

> [!NOTE]
> Two approvals are required: one by the person who created the managed private endpoint and one by the private link service owner. Ensure both approvals are completed.

### Step 2: Review Network Security Group (NSG) rules

1. Check the NSG rules applied to the subnet where the private link service is deployed.
1. Ensure there are no rules blocking inbound traffic from Azure Managed Grafana to the private link service.
1. Add an allow rule if necessary to permit traffic from Azure Managed Grafana.

### Step 3: Verify private link service configuration

1. Ensure the private link service is configured to accept connections from the managed private endpoint.
1. Check the private link service's settings to confirm it's correctly associated with the target resource.
1. Verify that the private link service is healthy and operational.

### Step 4: Analyze port configuration for AKS clusters

If you're working with an AKS cluster, ensure that the port configuration is consistent across the monitored service, the load balancer, and the private link service. Incorrect port configurations can lead to data source connection failures.

For example, for a self-managed Prometheus server running on an AKS cluster:

- The port configuration for the monitored service should follow the structure: access port + protocol + port name (target port). This can be verified in the **Services and ingresses** page of the AKS cluster in the Azure portal.

- The load balancer created for the service should have a matching port configuration: access port + protocol + port number (target port).

If the port configurations don't match:

1. Edit the YAML file for the load balancer to ensure the port configuration matches the monitored service.
1. Apply the updated configuration to the AKS cluster.
1. Test the Grafana data source connection to confirm it's successful.

## Related content

- [Troubleshoot common issues](troubleshoot-managed-grafana.md)
- [Find help or open a support ticket for Azure Managed Grafana](find-help-open-support-ticket.md)

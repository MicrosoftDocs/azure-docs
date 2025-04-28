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

This article guides you to troubleshoot and fix issues related to connecting a managed private endpoint to a private link service.

## Symptom

Connection from services running on an Azure Kubernetes Service (AKS) cluster to Azure Managed Grafana using a Managed Private Endpoint isn't working. Users may encounter errors such as **"504 Gateway Time-out"** when attempting to connect.

## Possible causes

The issue may occur due to one or more of the following reasons:

- The managed private endpoint isn't approved.
- The private DNS zone isn't configured correctly, leading to DNS resolution failures.
- Network security group (NSG) rules are blocking the connection.
- The AKS cluster doesn't have the correct outbound internet access configuration.
- The private link service isn't properly configured to accept connections from the managed private endpoint.

## Resolution

Follow these steps to resolve the issue:

### Step 1: Verify managed private endpoint approval

1. In the Azure portal, navigate to the **Setting** > **Networking** > **Managed Private Endpoint** section of your Azure Managed Grafana resource.
1. Check the state of the managed private endpoint. If it's "Pending", approve the connection.
1. Ensure the private endpoint is connected to the correct private link service.
1. Verify that the private link service owner has approved the connection request.

> [!NOTE]
> Two approvals are required: one by the person who created the managed private endpoint and one by the private link service owner. Ensure both approvals are completed.

### Step 2: check private DNS zone configuration

1. Verify that the private DNS zone is linked to the virtual network where the AKS cluster or other service is deployed.
1. Ensure the DNS zone contains the correct records for the private link service (for example, `privatelink.<service>.azure.com`).
1. Test DNS resolution from the AKS cluster or other service to confirm it resolves to the private IP address of the private link service.
1. For more information, see [Create and manage private DNS zones using the Azure portal](/azure/dns/private-dns-portal).

### Step 3: Review Network Security Group (NSG) rules

1. Check the NSG rules applied to the subnet where your resource (for example, AKS cluster or other service) is deployed.
1. Ensure there are no rules blocking outbound traffic to the private link service.
1. Add an allow rule if necessary to permit traffic to the private endpoint.

### Step 4: Validate outbound configuration

1. Confirm that your resource (for example, AKS cluster or other service) has outbound internet access configured correctly.
1. If using a custom route table, ensure it allows traffic to the private endpoint.
1. Test connectivity from your resource to the private endpoint using tools like `curl` or `ping`.

### Step 5: Verify private link service configuration

1. Ensure the private link service is configured to accept connections from the managed private endpoint.
1. Check the private link service's settings to confirm it's correctly associated with the target resource.
1. Verify that the private link service is healthy and operational.

### Step 6: Analyze Port Configuration for AKS Clusters

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

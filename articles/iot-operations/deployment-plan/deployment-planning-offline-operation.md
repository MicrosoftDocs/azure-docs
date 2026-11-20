---
title: Plan for offline operation and recovery in Azure IoT Operations
description: Plan for cloud connectivity outages, local data retention, and recovery in Azure IoT Operations.
author: david-emakenemi
ms.author: demakenemi
ms.topic: concept-article
ms.date: 11/19/2026
---

# Plan for offline operation and recovery in Azure IoT Operations

> [!IMPORTANT]
> Offline operation doesn't guarantee that all data is retained. Message retention depends on your storage capacity, queue limits, persistence configuration, and expiry settings.

Azure IoT Operations keeps processing data locally when your site loses its connection to Azure. Recovery after up to 45 days without cloud connectivity is validated in the [tested configurations](#tested-configurations). This article explains what to prepare before you disconnect, what keeps working while you're offline, and how to verify recovery afterward.

## Offline recovery window

Azure IoT Operations is validated to recover after up to 45 days without cloud connectivity, in the configurations listed in the following table. The recovery window describes reconnection and restoration of the workloads that were tested. It isn't a guarantee of uninterrupted operation, complete message retention, or zero data loss during an outage.

The managed-identity certificate on your Azure Arc-enabled cluster can limit how long you can stay offline. Check it before you disconnect. For more information, see [Certificates and authentication](#certificates-and-authentication).

### Tested configurations

The following results describe individual tests of different durations, not outcomes verified across the full recovery window.

| Area | Validated |
| --- | --- |
| Platform | Single-node K3s on virtual machines and a physical ARM64 device; clean install for each test |
| Offline recovery window | Up to 45 days without cloud connectivity |
| Local processing | MQTT broker, data flows, and local data capture kept running during a 7-day outage |
| Message delivery | New messages from selected sources reached Azure Event Hubs after reconnection. |

## Plan before you disconnect

Complete this checklist before a planned disconnection. For unplanned outages, complete it as part of your deployment.

- Check when the Arc managed-identity certificate expires, and plan for the outage to end before then.
- Check expiry dates for your production certificate issuer, external endpoint certificates, and authentication tokens.
- Confirm that the required Azure Key Vault secrets have synchronized to the cluster.
- Enable broker persistence and subscriber queue persistence for data that must survive a restart.
- Size storage for each storage location, and check whether your storage provider enforces capacity limits.
- Review message expiry, session expiry, and queue limit settings.
- Set up direct `kubectl` access to the cluster, with valid credentials that don't depend on Azure.
- Plan for pod restarts, node failures, and power loss separately from a network outage. Broker replication and persistence protect against different failures. For deployment requirements, see [Supported environments](../overview-support.md#supported-environments).
- Schedule changes to devices, assets, schemas, and Key Vault secrets while connected.
- Test a planned disconnection in a nonproduction environment that matches your production platform, workloads, and cloud destinations.

### Certificates and authentication

Renewal services that require unavailable network connections can't renew certificates or tokens while the site is offline. Verify that your Arc managed-identity certificate, workload certificates, and authentication tokens remain valid for the planned outage. For issuer configuration, see [Set up your own certificate issuer](../deploy-iot-ops/howto-bring-your-own-issuer.md).

Check the Arc managed-identity certificate's expiry date, and plan to reconnect before then:

```azurecli
az connectedk8s show -n <CLUSTER_NAME> -g <RESOURCE_GROUP> --query managedIdentityCertificateExpirationTime
```

> [!WARNING]
> If the Arc managed-identity certificate expires while disconnected, additional recovery steps might be required. Consult [How do I address expired Azure Arc-enabled Kubernetes resources?](/azure/azure-arc/kubernetes/faq#how-do-i-address-expired-azure-arc-enabled-kubernetes-resources) and contact Microsoft Support before deleting or recreating any resources.

### Secrets from Azure Key Vault

Confirm that every secret your workloads need has synced to the cluster before disconnecting. Synced secrets stay available while offline, but Key Vault changes reach the cluster only after connectivity returns. For secret management procedures, see [Manage secrets](../secure-iot-ops/howto-manage-secrets.md).

### Storage and retention

Size storage for the data you need to keep. Having a recovery window doesn't mean you have enough storage to buffer data for that whole period. As a starting point, multiply your message rate by average message size and the outage length you want to cover, then add headroom.

Broker buffering, broker persistence, and local storage endpoints can use different volumes. Plan capacity for each one separately. The minimum storage requirement for deployment isn't enough to cover an outage.

Don't assume that a persistent volume alone guarantees queued messages survive a broker restart. Review [broker persistence](../manage-mqtt-broker/howto-broker-persistence.md) and subscriber queue persistence settings separately from disk-backed buffering.

Messages can be lost when queues or storage fill up, or when messages or sessions expire. Review [expiry and queue settings](deployment-planning-mqtt-options.md) for your planned outage. For buffering and persistence configuration, see [Configure data buffering and disk persistence for data flows](../connect-to-cloud/howto-configure-disk-persistence.md).

## What works while disconnected

### Local processing

Azure IoT Operations supports local MQTT messaging and data flow processing while disconnected from Azure. Continued operation depends on valid credentials and certificates, available storage, and healthy cluster resources. Cloud destinations remain unavailable until connectivity returns.

To keep a local copy of data, configure a [local storage data flow endpoint](../connect-to-cloud/howto-configure-local-storage-endpoint.md) that writes to a persistent volume.

### Operations that require connectivity

These operations wait or fail until connectivity returns:

- Creating, updating, or deleting devices and assets
- Configuration changes made through Azure
- Syncing secret changes from Azure Key Vault
- Renewing the Arc managed-identity certificate
- Sending telemetry to Azure Monitor and viewing Azure-hosted Grafana dashboards
- Accessing the cluster through the Azure Arc cluster connect proxy

### Inspect workloads while disconnected

Use `kubectl` with direct access to the Kubernetes API and valid cluster credentials:

```bash
kubectl get pods -n azure-iot-operations
kubectl describe pod <POD_NAME> -n azure-iot-operations
kubectl logs <POD_NAME> -n azure-iot-operations
```

Use these commands to inspect only. Don't change Azure IoT Operations custom resources directly; make configuration changes through Azure after connectivity returns. Set up [broker diagnostics](deployment-planning-diagnostics.md) before deployment.

Monitor storage use during the outage with broker metrics and `kubectl`. If your storage provider doesn't enforce capacity limits, buffered data can fill the node disk and affect cluster health.

## Recover after reconnection

### Verify recovery

A Connected status in Azure doesn't confirm that all workloads recovered or that all buffered messages were delivered. After connectivity returns, check that:

1. Nodes are ready and Azure IoT Operations pods are running, with stable restart counts.
2. Arc agents are healthy and the cluster shows as Connected in Azure.
3. Data flows and endpoints are healthy.
4. New messages are arriving at cloud destinations.
5. Check for missing buffered messages from the outage. If you know how many messages your sources published, compare that count with what the destination received.
6. Failure counters in exported metrics stopped increasing.
7. Recent Key Vault secret changes synced to the cluster.

To investigate issues, use `az iot ops check` and component logs. To collect diagnostics, use `az iot ops support create-bundle`. For more information, see [Troubleshoot Azure IoT Operations](../troubleshoot/troubleshoot.md).

Then retry any device or asset create, update, or delete operations that failed while the cluster was disconnected.

### Buffered data recovery

For data flows sourced from the local MQTT broker or assets that publish to it, buffered delivery resumes after connectivity returns, subject to storage, queue limits, persistence settings, and message or session expiry. New messages arriving doesn't prove that all buffered messages arrived; compare message counts as described in [Verify recovery](#verify-recovery).

For retry behavior and persistence configuration, see [Configure data buffering and disk persistence for data flows](../connect-to-cloud/howto-configure-disk-persistence.md).

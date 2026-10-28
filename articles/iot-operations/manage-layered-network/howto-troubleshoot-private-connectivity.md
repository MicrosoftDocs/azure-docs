---
title: Troubleshoot private connectivity for Azure IoT Operations
description: Diagnose and resolve DNS, Private Endpoint, RBAC, and connectivity issues for Azure IoT Operations in private network deployments.
author: david-emakenemi
ms.author: demakenemi
ms.topic: troubleshooting
ms.date: 08/26/2026

#CustomerIntent: As an operator, I want to troubleshoot private connectivity issues for Azure IoT Operations so that I can restore healthy operation without exposing endpoints to the public internet.
ms.service: azure-iot-operations
---

# Troubleshoot private connectivity for Azure IoT Operations

This article helps you diagnose and resolve common issues when running Azure IoT Operations with private connectivity. For setup instructions, see [Deploy Azure IoT Operations with private connectivity](howto-private-connectivity.md).

## Verify Azure IoT Operations health after lockdown

After disabling public access on any Azure resource (Storage, Key Vault, Event Grid), verify that Azure IoT Operations is still healthy:

1. **Run the Azure IoT Operations health check:**

   ```azurecli
   az iot ops check
   ```

   All checks should pass. A warning about missing dataflows is expected if you didn't create any yet.

1. **Verify all pods are running:**

   ```bash
   kubectl get pods -n azure-iot-operations
   ```

   All pods should be in `Running` or `Completed` state. Pay special attention to the schema registry pods (`adr-schema-registry-*`) and the secret store pods.

1. **Verify secret sync:**

   ```bash
   kubectl get secretsync -n azure-iot-operations
   ```

   All resources should show `Synced` status.

1. **Verify schema registry connectivity:**

   ```bash
   kubectl logs -n azure-iot-operations -l app=adr-schema-registry --tail=50
   ```

   Look for successful storage connections. Errors like `AuthorizationFailure` or `connection refused` indicate DNS or Private Endpoint misconfiguration.

## DNS resolves to a public IP instead of a private IP

**Symptom:** `nslookup <service>.vault.azure.net` (or `.blob.core.windows.net`) returns a public IP.

**Cause:** You didn't link the Private DNS Zone to your VNet, or you didn't create the DNS zone group for the Private Endpoint.

**Fix:**
- Verify the Private DNS Zone exists: `az network private-dns zone list --resource-group <resource-group>`
- Verify the VNet link exists: `az network private-dns link vnet list --resource-group <resource-group> --zone-name <zone-name>`
- Verify the DNS zone group exists: `az network private-endpoint dns-zone-group list --resource-group <resource-group> --endpoint-name <pe-name>`
- If your cluster uses custom DNS (not Azure DNS), configure a DNS forwarder to `168.63.129.16` for the `privatelink.*` zones.

## SecretSync shows errors after disabling Key Vault public access

**Symptom:** `kubectl get secretsync -n azure-iot-operations` shows sync failures.

**Cause:** The Secret Store extension can't reach Key Vault because DNS doesn't resolve to the Private Endpoint IP, or the Private Endpoint connection isn't approved.

**Fix:**
- Verify DNS from inside the cluster: `kubectl run dns-test --image=busybox --rm -it --restart=Never -- nslookup <keyvault-name>.vault.azure.net`
- Check the Private Endpoint connection status in the Azure portal — it should show **Approved**.
- Verify the user-assigned managed identity still has the `Key Vault Secrets User` role on the Key Vault.

## Schema Registry can't reach storage after disabling public access

**Symptom:** Schema registry pods log `AuthorizationFailure` or connectivity errors. Schema operations fail.

**Cause:** The storage account's trusted service bypass isn't configured, the Private Endpoint DNS isn't resolving, or the managed identity lacks the `Storage Blob Data Contributor` role.

**Fix:**
- Verify the bypass is set: `az storage account show --name <account> --query networkRuleSet`
- Verify DNS resolves to a private IP from the cluster.
- Restart the schema registry pods after fixing: `kubectl delete pods -n azure-iot-operations -l app=adr-schema-registry`

## The operations experience can't load or manage secrets or schemas after enabling private endpoints

**Symptom:** In the [operations experience](https://iotoperations.azure.com) web UI, the **Secrets** or **Schemas** page fails to load, or returns an access or firewall error, after you enable private endpoints or firewall restrictions on Azure Key Vault or the schema registry storage account.

**Cause:** The operations experience accesses Key Vault and the schema registry storage account on your behalf from Microsoft-managed IP addresses. After you restrict access, those requests are blocked because the operations experience IP addresses aren't in the firewall allow list, or because public access on Key Vault or the Schema Registry backing storage account isn't set to **Selected networks and IP addresses**.

**Fix:**
- Confirm that public access on both Azure Key Vault and the Schema Registry backing storage account is set to **Selected networks and IP addresses**, and that every operations experience IP address is in each resource's firewall allow list. For the authoritative steps and the current regional IP values, see [Allow the operations experience to access your resources](howto-private-connectivity.md#allow-the-operations-experience-to-access-your-resources).
- Keep the trusted Azure services bypass enabled on the storage account so the schema registry can continue to reach storage.
- If public access and the firewall allow list are both correct but access is still blocked, check whether a Network Security Perimeter or a centrally enforced tenant network policy overrides the resource firewall. If either applies, add the same Data Orchestrator Engine IP exceptions (the operations experience IP addresses) to that policy. For the current regional IP values, see [Allow the operations experience to access your resources](howto-private-connectivity.md#allow-the-operations-experience-to-access-your-resources).

## Dataflow can't reach Event Grid after disabling public access

**Symptom:** Dataflow pod logs show connection refused or timeout errors to the Event Grid namespace.

**Cause:** DNS doesn't resolve the Event Grid FQDN to the Private Endpoint IP, or the Private Endpoint connection isn't approved.

**Fix:**
- Verify DNS from the cluster: `kubectl run dns-test --image=busybox --rm -it --restart=Never -- nslookup <namespace>.<region>-1.ts.eventgrid.azure.net`
- Check the Private Endpoint connection status in the Azure portal.
- Verify RBAC: the Azure IoT Operations managed identity needs the Event Grid role matching your dataflow direction (Publisher, Subscriber, or both). Ensure the role is assigned to the correct identity — see [Assign RBAC for Event Grid](howto-private-connectivity.md#step-2-assign-rbac-for-event-grid).
- Check dataflow pod logs: `kubectl logs -n azure-iot-operations -l app=dataflow`

## Dataflow messages don't arrive at Event Grid

**Symptom:** You publish MQTT messages but Event Grid metrics show no incoming messages.

**Fix:**
- Check the dataflow pod logs: `kubectl logs -n azure-iot-operations -l app=dataflow`
- Verify DNS resolution from within the cluster resolves to a private IP.
- Check the Private Endpoint connection status in the Azure portal — it should show **Approved**.
- Verify RBAC assignments: the managed identity needs the Event Grid role matching your dataflow direction (Publisher, Subscriber, or both). See [Assign RBAC for Event Grid](howto-private-connectivity.md#step-2-assign-rbac-for-event-grid).

## `az connectedk8s update` fails with "another operation is in progress"

**Symptom:** `az connectedk8s update` returns "UPGRADE FAILED: another operation (install/upgrade/rollback) is in progress".

**Cause:** A previous failed update (for example, due to missing firewall rules) left the Helm release in `pending-upgrade` state.

**Fix:**
1. Find the stuck release and identify the last successful revision:

   ```bash
   helm list -n azure-arc-release --all
   ```

   > [!NOTE]
   > Some environments use the `azure-arc` namespace instead of `azure-arc-release`. Run `helm list -A --filter azure-arc` if you don't see results.

1. Roll back to the last good revision:

   ```bash
   helm rollback azure-arc <last-good-revision> -n azure-arc-release
   ```

1. Retry the `az connectedk8s update` command.

## Related content

- [Deploy Azure IoT Operations with private connectivity](howto-private-connectivity.md)
- [Azure IoT Operations networking](overview-layered-network.md)
- [Azure Private DNS Zone values](/azure/private-link/private-endpoint-dns)
- [Simplify network configuration requirements with Azure Arc Gateway](/azure/azure-arc/kubernetes/arc-gateway-simplify-networking)

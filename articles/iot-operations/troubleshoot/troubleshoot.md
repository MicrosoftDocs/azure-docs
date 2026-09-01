---
title: Troubleshoot Azure IoT Operations
description: Troubleshoot your Azure IoT Operations deployment and configuration
author: dominicbetts
ms.author: dobett
ms.service: azure-iot-operations
ms.topic: troubleshooting-general
ms.custom:
  - ignite-2023
ms.date: 08/26/2026
---

# Troubleshoot Azure IoT Operations

This article contains troubleshooting tips for Azure IoT Operations.

The troubleshooting guidance helps you diagnose and resolve issues you might encounter when deploying, configuring, or running Azure IoT Operations by:

- Collecting diagnostic information from the Azure IoT Operations service and the Azure IoT Operations components running on your cluster.
- Providing solutions to common issues such as insufficient security permissions, missing secrets, or incorrect configuration settings.

For information about known issues and temporary workarounds, see [Known issues: Azure IoT Operations](known-issues.md).

## Set your environment variables

[!INCLUDE [set-environment-variables](../includes/set-environment-variables.md)]

This article also uses the `K8_BRIDGE_SP_OID` and `KEY_VAULT_NAME` environment variables. Set each one before you run the related commands.

## Use health status for troubleshooting

Azure IoT Operations provides [built-in health status reporting](../deploy-iot-ops/health-status-reporting.md) to help you understand the health of your edge workloads from the cloud. When a component reports **Degraded** or **Unavailable** health status, use the following approach to investigate and troubleshoot the issue:

1. **Check the reason code**: Each unhealthy resource includes a reason code (for example, `DataflowMqttSourceConnectionFailed`, `BrokerReplicaFailed`, `OpcUaConnectorInboundEndpointDisconnected`) and a human-readable message explaining the problem.
1. **Look up the recommended action**: Check the [health status reason codes](../reference/health-status-reason-codes.md) for detailed descriptions and recommended actions for every reason code.
1. **Check timestamps**: The `lastTransitionTime` shows when the issue started; `lastUpdateTime` shows the most recent status update.
1. **Investigate further**: Use `az iot ops check`, pod logs, and the Grafana dashboard metrics to correlate the health status with runtime behavior.

## Troubleshoot Azure IoT Operations deployment

For general deployment and configuration troubleshooting, use the Azure CLI IoT Operations `check` and `support` commands:

[!INCLUDE [prereq-azure-cli](../includes/prereq-azure-cli.md)]

- To evaluate Azure IoT Operations service deployment for health, configuration, and usability, use [az iot ops check](/cli/azure/iot/ops#az-iot-ops-check). The `check` command can help you find problems in your deployment and configuration.

- To collect logs and traces to help you diagnose problems, use [az iot ops support create-bundle](/cli/azure/iot/ops/support#az-iot-ops-support-create-bundle). The `support create-bundle` command creates a standard support bundle zip archive you can review or provide to Microsoft Support.

### You see an UnauthorizedNamespaceError error message

If you see the following error message, you either didn't enable the required Azure-arc custom locations feature, or you enabled the custom locations feature with an incorrect custom locations RP OID.

```output
Message: Microsoft.ExtendedLocation resource provider does not have the required permissions to create a namespace on the cluster.
```

To resolve the issue, follow [this guidance](/azure/azure-arc/kubernetes/custom-locations#enable-custom-locations-on-your-cluster) to enable the custom locations feature with the correct OID.

### You see a MissingResourceVersionOnHost error message

This error message indicates that the custom location resource associated with the deployment isn't properly configured. The custom location has the wrong the API version for the resources it's attempting to project to the cluster.

```output
Message: The resource {resource Id} extended location {custom location resource Id} does not support the resource type {IoT Operations resource type} or api version {IoT Operations ARM API}. Please check with the owner of the extended location to ensure the host has the CRD {custom resource name} with group {api group name}.iotoperations.azure.com, plural {custom resource plural name}, and versions [{api group version}] installed.
```

To resolve, delete any provisioned resources associated with prior deployments including custom locations. You can use `az iot ops delete` or alternative mechanism. Due to a potential caching issue, waiting a few minutes after deletion before redeploying Azure IoT Operations or choosing a custom location name via `az iot ops create --custom-location` is recommended. The custom location name has a maximum length of 63 characters.

### You see a LinkedAuthorizationFailed error message

If your deployment fails with the `"code":"LinkedAuthorizationFailed"` error, the message indicates that you don't have the required permissions on the resource group containing the cluster.

The following message indicates that the signed-in principal doesn't have the required permissions to deploy resources to the resource group specified in the resource sync resource ID.

```output
Message: The client {principal Id} with object id {principal object Id} has permission to perform action Microsoft.ExtendedLocation/customLocations/resourceSyncRules/write on scope {resource sync resource Id}; however, it does not have permission to perform action(s) Microsoft.Authorization/roleAssignments/write on the linked scope(s) {resource sync resource group} (respectively) or the linked scope(s) are invalid.
```

To enable resource sync, the signed-in principal must have the `Microsoft.Authorization/roleAssignments/write` permission against the resource group that resources are being deployed to. This security constraint is necessary because edge to cloud resource hydration creates new resources in the target resource group.

To resolve the issue elevate principal permissions.

> [!NOTE]
> Legacy Azure IoT Operations CLIs had an opt-out mechanism by using the `--disable-rsync-rules`.

### Deployment of MQTT broker fails

A deployment might fail if the cluster doesn't have sufficient resources for the specified MQTT broker cardinality and memory profile. To resolve this situation, adjust the replica count, workers, sharding, and memory profile settings to appropriate values for your cluster.

> [!WARNING]
> Setting the replica count to one can result in data loss in node failure scenarios.

> [!TIP]
> If you set lower values for sharding, workers, or memory profile, the broker's capacity to handle message load is reduced. Before you deploy to production, test your scenario with the MQTT broker configuration, to ensure the broker can handle the maximum expected load.

To learn more about how to choose suitable values for these parameters, see [Deployment planning](../deployment-plan/deployment-planning.md).

## Troubleshoot Azure IoT Operations uninstall

To uninstall Azure IoT Operations, always use `az iot ops delete`, which handles the proper sequencing automatically and avoids the following issues:

### Namespace stuck in "Terminating" status

If you try to delete the namespace directly, finalizers on Azure IoT Operations resources such as the `Instance` custom resource block the deletion. The namespace gets stuck in a permanent "Terminating" state, leaving the cluster in a deadlock that's difficult to recover from without manual intervention.

To resolve this issue, use `az iot ops delete` to delete an Azure IoT Operations instance.

### Orphaned cluster-scoped resources

If you force-delete the namespace by manually removing finalizers, cluster-scoped resources such as `ClusterRoles`, `ClusterRoleBindings`, `ValidatingWebhookConfigurations`, and `MutatingWebhookConfigurations` remain behind. These orphaned resources can block future Azure IoT Operations installations, requiring you to either clean up each resource manually or reset the entire cluster.

To resolve this issue, use `az iot ops delete` to delete an Azure IoT Operations instance.

### You see an "Instance must be deleted first" error message

If you try to delete the Arc extension directly using `az k8s-extension delete`, a validation blocks the operation with a message saying the `Instance` must be deleted first. Don't try to manually delete the `Instance` custom resource.

To resolve this issue, use `az iot ops delete` to delete an Azure IoT Operations instance and handle the proper sequencing automatically.

## Troubleshoot Azure Key Vault secret management

If you see the following error message related to secret management, update your Azure Key Vault contents:

```output
rpc error: code = Unknown desc = failed to mount objects, error: failed to get objectType:secret,
objectName:nbc-eventhub-secret, objectVersion:: GET https://aio-kv-888f27b078.vault.azure.net/secrets/nbc-eventhub-secret/--------------------------------------------------------------------------------
RESPONSE 404: 404 Not FoundERROR CODE: SecretNotFound--------------------------------------------------------------------------------{ "error": { "code": "SecretNotFound", "message": "A secret with (name/id) nbc-eventhub-secret was not found in this key vault.
If you recently deleted this secret you may be able to recover it using the correct recovery command.
For help resolving this issue, please see https://go.microsoft.com/fwlink/?linkid=2125182" }
```

This error occurs when Azure IoT Operations tries to synchronize a secret from Azure Key Vault that doesn't exist. To resolve this issue, add the secret in Azure Key Vault before you create resources such as a secret provider class.

## Troubleshoot permissions errors adding secrets or certificates

When you use the operations experience to add secrets or certificates, you might see permissions-related error messages if your Microsoft Entra ID account doesn't have the required permissions.

When you use the operations experience to add secrets or certificates, it adds them as secrets in your Azure Key Vault. Your Microsoft Entra ID account needs **Key Vault Secrets Officer** permissions at the resource level for the Azure Key Vault used by your Azure IoT Operations instance.

For more information about assigning the required permissions, see [Configure Azure Key Vault permissions](../secure-iot-ops/howto-manage-secrets.md#configure-azure-key-vault-permissions).

## Troubleshoot device and asset lifecycle operations

Create, update, and delete operations for devices and assets require a connected Azure Arc-enabled Kubernetes cluster. Azure Device Registry represents each device and asset as an Azure Resource Manager resource and synchronizes its configuration to the associated cluster. If Azure can't connect to the cluster when you run a lifecycle operation, the operation can fail with the error code `ClusterNetworkUnavailable` and reach the terminal provisioning state `Failed`.

When a device or asset create, update, or delete operation fails because the cluster is disconnected, you see an error similar to the following example:

```output
(ClusterNetworkUnavailable) Failed to establish a network connection with the kubernetes cluster '<connected-cluster-resource-id>'. Please make sure the underlying cluster is running and has network connectivity before retrying the operation.
Code: ClusterNetworkUnavailable
Message: Failed to establish a network connection with the kubernetes cluster '<connected-cluster-resource-id>'. Please make sure the underlying cluster is running and has network connectivity before retrying the operation.
```

The nested error indicates that Azure can't connect because no agent is connected in the target Azure Arc resource: `Cannot connect to the hybrid connection because no agent is connected in the target arc resource.`

To troubleshoot and recover a failed lifecycle operation, follow these steps:

1. Verify that the Azure Arc-enabled Kubernetes cluster exists and is connected. Run the following command and check the connectivity status in the output:

  ```azurecli
  az connectedk8s show -g <RESOURCE_GROUP> -n <CLUSTER_NAME>
  ```

1. Show the affected device or asset and inspect `properties.provisioningState` and `properties.lastTransitionTime`. A failed resource remains available to view with `provisioningState` set to `Failed` and a populated `lastTransitionTime`.

  To show a device:

  ```azurecli
  az iot ops ns device show --name <DEVICE_NAME> --instance <INSTANCE_NAME> --resource-group <RESOURCE_GROUP>
  ```

  To show an asset:

  ```azurecli
  az iot ops ns asset show --name <ASSET_NAME> --instance <INSTANCE_NAME> --resource-group <RESOURCE_GROUP>
  ```

1. Restore connectivity to the cluster and confirm that its Azure Arc agent is connected.

1. Rerun the same create, update, or delete operation. In the observed create case, the operation succeeded after the cluster reconnected, and the failed resource didn't need to be deleted before the create operation was retried. This cleanup detail applies only to the observed create case. Don't assume the same behavior for update or delete operations.

For more information about how lifecycle operations depend on cluster connectivity, see [Lifecycle operations and cluster connectivity](../discover-manage-assets/concept-assets-devices.md#lifecycle-operations-and-cluster-connectivity).

## Troubleshoot device and asset discovery

Akri discovery requires that resource sync rules are enabled on your cluster. To enable resource sync rules, follow these steps:

Run `enable-rsync` to enable resource sync rules on your Azure IoT Operations instance. This command also sets the required permissions on the custom location:

```bash
az iot ops enable-rsync -n $AIO_INSTANCE_NAME -g $RESOURCE_GROUP
```

If the signed-in CLI user doesn't have permission to look up the object ID (OID) of the K8 Bridge service principal, you can provide it explicitly using the `--k8-bridge-sp-oid` parameter:

```bash
az iot ops enable-rsync --k8-bridge-sp-oid $K8_BRIDGE_SP_OID
```

> [!NOTE]
> You can manually look up the OID by a signed-in CLI principal that has MS Graph app read permissions. Run the following command to get the OID:
> 
> ```bash
> az ad sp list --display-name "K8 Bridge" --query "[0].appId" -o tsv
> ```

## Troubleshoot OPC UA server connections

An OPC UA server connection fails with a `BadSecurityModeRejected` error if the connector tries to connect to a server that only exposes endpoints with no security. There are two options to resolve this issue:

- Overrule the restriction by explicitly setting the following values in the additional configuration for the device:

    | Property | Value |
    |----------|-------|
    | `securityMode` | `none` |
    | `securityPolicy` | `http://opcfoundation.org/UA/SecurityPolicy#None` |

- To establish the connection, add a secure endpoint to the OPC UA server and set up the certificate mutual trust.

### Data spike every 2.5 hours with some OPC UA simulators

Data values spike every 2.5 hours when using some non-Microsoft OPC UA simulators causing CPU and memory spikes. This issue isn't seen with OPC PLC simulator used in the quickstarts.

No data is lost, but you can see an increase in the volume of data published from the server to the MQTT broker.

## Troubleshoot OPC PLC simulator

### The OPC PLC simulator doesn't send data to the MQTT broker after you create a device for it

To work around this issue, update the device inbound endpoint in the operations experience to automatically accept untrusted server certificates:

:::image type="content" source="media/troubleshoot/auto-accept-certificate.png" alt-text="Screenshot that shows the option in the operations experience to automatically accept untrusted certificates.":::

You can use the `az iot ops ns device endpoint inbound add opcua` to add endpoints to the device that automatically accept untrusted server certificates.

> [!CAUTION]
> Don't use this configuration in production or preproduction environments. Exposing your cluster to the internet without proper authentication might lead to unauthorized access and even DDoS attacks.

## Troubleshoot access to the operations experience web UI

To sign in to the [operations experience](https://iotoperations.azure.com) web UI, you need a Microsoft Entra ID account with at least contributor permissions for the resource group that contains your **Kubernetes - Azure Arc** instance.

If you receive one of the following error messages:

- A problem occurred getting unassigned instances
- Message: The request is not authorized
- Code: PermissionDenied

To create a suitable Microsoft Entra ID account in your Azure tenant:

1. Sign in to the [Azure portal](https://portal.azure.com/) with the same tenant and user name that you used to deploy Azure IoT Operations.
1. In the Azure portal, go to the **Microsoft Entra ID** section, select **Users > +New user > Create new user**. Create a new user and make a note of the password, you need it to sign in later.
1. In the Azure portal, go to the resource group that contains your **Kubernetes - Azure Arc** instance. On the **Access control (IAM)** page, select **+Add > Add role assignment**.
1. On the **Add role assignment page**, select **Privileged administrator roles**. Then select **Contributor** and then select **Next**.
1. On the **Members** page, add your new user to the role.
1. Select **Review and assign** to complete setting up the new user.

You can now use the new user account to sign in to the [operations experience](https://iotoperations.azure.com) web UI.

## Troubleshoot data flows

### You see a "Global error: AllBrokersDown" error message

If you see a `Global error: AllBrokersDown` error message in the data flow logs, this means that the data flow hasn't processed any messages for about four or five minutes. Check that the data flow source is correctly configured and sending messages. For example, check that you're using the correct topic name from the MQTT broker.

---
title: Troubleshoot Azure IoT Operations
description: Troubleshoot your Azure IoT Operations deployment and configuration
author: dominicbetts
ms.author: dobett
ms.topic: troubleshooting-general
ms.custom:
  - ignite-2023
ms.date: 05/07/2025
---

# Troubleshoot Azure IoT Operations

This article contains troubleshooting tips for Azure IoT Operations.

The troubleshooting guidance helps you diagnose and resolve issues you might encounter when deploying, configuring, or running Azure IoT Operations by:

- Collecting diagnostic information from the Azure IoT Operations service and the Azure IoT Operations components running on your cluster.
- Providing solutions to common issues such as insufficient security permissions, missing secrets, or incorrect configuration settings.

For information about known issues and temporary workarounds, see [Known issues: Azure IoT Operations](known-issues.md).

## Troubleshoot Azure IoT Operations deployment

For general deployment and configuration troubleshooting, you can use the Azure CLI IoT Operations `check` and `support` commands.

[Azure CLI version 2.53.0 or higher](/cli/azure/install-azure-cli) is required and the [Azure IoT Operations extension](/cli/azure/iot/ops) installed.

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

To resolve, delete any provisioned resources associated with prior deployments including custom locations. You can use `az iot ops delete` or alternative mechanism. Due to a potential caching issue, waiting a few minutes after deletion before redeploying AIO or choosing a custom location name via `az iot ops create --custom-location` is recommended. The custom location name has a maximum length of 63 characters.

### You see a LinkedAuthorizationFailed error message

If your deployment fails with the `"code":"LinkedAuthorizationFailed"` error, the message indicates that you don't have the required permissions on the resource group containing the cluster.

The following message indicates that the logged-in principal doesn't have the required permissions to deploy resources to the resource group specified in the resource sync resource ID.

```output
Message: The client {principal Id} with object id {principal object Id} has permission to perform action Microsoft.ExtendedLocation/customLocations/resourceSyncRules/write on scope {resource sync resource Id}; however, it does not have permission to perform action(s) Microsoft.Authorization/roleAssignments/write on the linked scope(s) {resource sync resource group} (respectively) or the linked scope(s) are invalid.
```

To enable resource sync, the logged-in principal must have the `Microsoft.Authorization/roleAssignments/write` permission against the resource group that resources are being deployed to. This security constraint is necessary because edge to cloud resource hydration creates new resources in the target resource group.

To resolve the issue elevate principal permissions.

> [!NOTE]
> Legacy AIO CLIs had an opt-out mechanism by using the `--disable-rsync-rules`.

### Deployment of MQTT broker fails

A deployment might fail if the cluster doesn't have sufficient resources for the specified MQTT broker cardinality and memory profile. To resolve this situation, adjust the replica count, workers, sharding, and memory profile settings to appropriate values for your cluster.

> [!WARNING]
> Setting the replica count to one can result in data loss in node failure scenarios.

> [!TIP]
> If you set lower values for sharding, workers, or memory profile, the broker's capacity to handle message load is reduced. Before you deploy to production, test your scenario with the MQTT broker configuration, to ensure the broker can handle the maximum expected load.

To learn more about how to choose suitable values for these parameters, see [Configure broker settings for high availability, scaling, and memory usage](../manage-mqtt-broker/howto-configure-availability-scale.md).

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

## Troubleshoot device and asset discovery

Akri discovery requires that resource sync rules are enabled on your cluster. To enable resource sync rules, follow these steps:

Run `enable-rsync` to enable resource sync rules on your Azure IoT Operations instance. This command also sets the required permissions on the custom location:

```bash
az iot ops enable-rsync - n <my instance> -g <my resource group>
```

If the signed-in CLI user doesn't have permission to look up the object ID (OID) of the K8 Bridge service principal, you can provide it explicitly using the `--k8-bridge-sp-oid` parameter:

```bash
az iot ops enable-rsync --k8-bridge-sp-oid <k8 bridge service principal object ID>
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
> Don't use this configuration in production or preproduction environments. Exposing your cluster to the internet without proper authentication might lead to unauthorized access and even DDOS attacks.

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

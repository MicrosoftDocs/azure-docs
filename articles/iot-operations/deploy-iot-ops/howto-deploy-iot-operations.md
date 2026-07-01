---
title: Deploy Azure IoT Operations to a Production Cluster
description: Use the Azure portal to deploy Azure IoT Operations to an Arc-enabled Kubernetes cluster.
author: dominicbetts
ms.author: dobett
ms.service: azure-iot-operations
ms.topic: how-to
ms.custom: ignite-2023, devx-track-azurecli
ms.date: 11/18/2025
ai-usage: ai-assisted

#CustomerIntent: As an IT professional, I want to deploy Azure IoT Operations to a Kubernetes cluster.
---

# Deploy Azure IoT Operations to a production cluster

Learn how to deploy Azure IoT Operations to a Kubernetes cluster with secure settings for production using the Azure portal.

If you deployed a [test instance](./howto-deploy-iot-test-operations.md) of Azure IoT Operations to a cluster and you want to use the same cluster for production scenarios, follow the steps in [Enable secure settings on an existing Azure IoT Operations instance](../secure-iot-ops/howto-enable-secure-settings.md).

> [!TIP]
> For an automated deployment experience, see [Automated deployment of Azure IoT Operations](https://github.com/Azure-Samples/explore-iot-operations/blob/main/quickstart/readme.md).

## Before you begin

[!INCLUDE [deploy-iot-ops-deployments-instances](../includes/deploy-iot-ops-deployments-instances.md)]

## Prerequisites

Cloud resources:

[!INCLUDE [prereq-azure-subscription](../includes/prereq-azure-subscription.md)]

* Azure access permissions. For more information, see [Deployment overview > Required permissions](overview-deploy.md#required-permissions).

Development resources:

[!INCLUDE [prereq-azure-cli](../includes/prereq-azure-cli.md)]

A cluster host:

* Have an Azure Arc-enabled Kubernetes cluster with the custom location and workload identity features enabled. If you don't have one, follow the steps in [Prepare your Azure Arc-enabled Kubernetes cluster](./howto-prepare-cluster.md).

  If you deployed Azure IoT Operations to your cluster previously, uninstall those resources before continuing. For more information, see [Update Azure IoT Operations](../manage-iot-ops/howto-manage-update-uninstall.md#uninstall).

* (Recommended) Configure your own certificate authority issuer before deploying Azure IoT Operations: [Bring your own issuer](howto-bring-your-own-issuer.md#bring-your-own-issuer).

## Deploy in Azure portal

### Basics

[!INCLUDE [deploy-iot-ops-portal-basics](../includes/deploy-iot-ops-portal-basics.md)]

### Configuration

1. On the **Configuration** tab, provide the following information:

   | Parameter | Value |
   | --------- | ----- |
   | **Azure IoT Operations name** | *Optional*: Replace the default name for the Azure IoT Operations instance. |
   | **MQTT broker configuration** | *Optional*: Edit the default settings for the MQTT broker. In Azure portal it's possible to configure [cardinality](../deployment-plan/deployment-planning.md#understand-broker-cardinality) and [memory profile](../deployment-plan/deployment-planning.md#choose-your-memory-profile) settings. To configure other settings including [disk-backed message buffer](../deployment-plan/deployment-planning-disk-buffer.md), [persistence](../deployment-plan/deployment-planning-persistence.md), [diagnostics](../deployment-plan/deployment-planning-diagnostics.md), and [advanced MQTT client options](../deployment-plan/deployment-planning-mqtt-options.md), see [Azure CLI support for advanced MQTT broker configuration](https://aka.ms/aziotops-broker-config). |
   | **Data flow profile configuration** | *Optional*: Edit the default settings for data flows. For more information, see [Configure data flow profile](../connect-to-cloud/howto-configure-dataflow-profile.md). |

   :::image type="content" source="./media/howto-deploy-iot-operations/deploy-configuration.png" alt-text="A screenshot that shows the second tab for deploying Azure IoT Operations from the portal." lightbox="./media/howto-deploy-iot-operations/deploy-configuration.png":::

1. Select **Next: Dependency management**.

### Dependency management

[!INCLUDE [deploy-iot-ops-portal-dependency-management](../includes/deploy-iot-ops-portal-dependency-management.md)]

### Deployment options

1. On the **Dependency management** tab, select the **Secure settings** deployment option.

   :::image type="content" source="./media/howto-deploy-iot-operations/deploy-dependency-management-1.png" alt-text="A screenshot that shows selecting secure settings on the third tab for deploying Azure IoT Operations from the portal." lightbox="./media/howto-deploy-iot-operations/deploy-dependency-management-1.png":::

1. In the **Deployment options** section, provide the following information:

   | Parameter | Value |
   | --------- | ----- |
   | **Subscription** | Select the subscription that contains your Azure key vault. |
   | **Azure Key Vault** | Select an Azure key vault or select **Create new**.<br><br>Ensure that your key vault has **Azure role-based access control** as its permission model. To check this setting, select **Manage selected vault** > **Settings** > **Access configuration**. <br><br>Ensure to [give your user account permissions to manage secrets](/azure/key-vault/secrets/quick-create-cli#give-your-user-account-permissions-to-manage-secrets-in-key-vault) with the `Key Vault Secrets Officer` role.|
   | **User assigned managed identity for secrets** | Select an identity or select **Create new**. |
   | **User assigned managed identity for Azure IoT Operations components** | Select an identity or select **Create new**. Don't use the same managed identity as the one you selected for secrets. |

   :::image type="content" source="./media/howto-deploy-iot-operations/deploy-dependency-management-2.png" alt-text="A screenshot that shows configuring secure settings on the third tab for deploying Azure IoT Operations from the portal." lightbox="./media/howto-deploy-iot-operations/deploy-dependency-management-2.png":::

1. Select **Next: Automation**.

## Run Azure CLI commands

[!INCLUDE [deploy-iot-ops-cli-commands-intro](../includes/deploy-iot-ops-cli-commands-intro.md)]

1. Sign in to Azure CLI interactively with a browser even if you already signed in before. If you don't sign in interactively, you might get an error that says *Your device is required to be managed to access your resource* when you continue to the next step to deploy Azure IoT Operations.

   ```azurecli
   az login
   ```

1. Install the latest Azure IoT Operations CLI extension.

   ```azurecli
   az upgrade
   az extension add --upgrade --name azure-iot-ops
   ```

1. Copy and run the provided [az iot ops schema registry create](/cli/azure/iot/ops/schema/registry#az-iot-ops-schema-registry-create) command to create a schema registry which is used by Azure IoT Operations components. If you chose to use an existing schema registry, this command isn't displayed on the **Automation** tab.

   > [!NOTE]
   > This command requires that you have role assignment write permissions because it assigns a role to give schema registry access to the storage account. By default, the role is the built-in **Storage Blob Data Contributor** role, or you can create a custom role with restricted permissions to assign instead. For more information, see [az iot ops schema registry create](/cli/azure/iot/ops/schema/registry#az-iot-ops-schema-registry-create).

1. To prepare the cluster for Azure IoT Operations deployment, copy and run the provided [az iot ops init](/cli/azure/iot/ops#az-iot-ops-init) command.

   > [!TIP]
   > The `init` command only needs to be run once per cluster. If you're reusing a cluster that already had Azure IoT Operations version 0.8.0 deployed on it, you can skip this step.

   This command might take several minutes to complete. You can watch the progress in the deployment progress display in the terminal.

1. Deploy Azure IoT Operations. Copy and run the provided [az iot ops create](/cli/azure/iot/ops#az-iot-ops-create) command. This command might take several minutes to complete. You can watch the progress in the deployment progress display in the terminal.

   If you followed the optional prerequisites to set up your own certificate authority issuer, add the `--trust-settings` parameters to the `create` command:

   ```bash
   --trust-settings configMapName=<CONFIGMAP_NAME> configMapKey=<CONFIGMAP_KEY_WITH_PUBLICKEY_VALUE> issuerKind=<CLUSTERISSUER_OR_ISSUER> issuerName=<ISSUER_NAME>
   ```

1. Enable secret sync for the deployed Azure IoT Operations instance. Copy and run the provided [az iot ops secretsync enable](/cli/azure/iot/ops/secretsync#az-iot-ops-secretsync-enable) command. This command:

   * Creates a federated identity credential using the user-assigned managed identity.
   * Adds a role assignment to the user-assigned managed identity for access to the Azure Key Vault.
   * Adds a minimum secret provider class associated with the Azure IoT Operations instance.

1. Assign a user-assigned managed identity to the deployed Azure IoT Operations instance. Copy and run the provided [az iot ops identity assign](/cli/azure/iot/ops/identity#az-iot-ops-identity-assign) command. This command creates a federated identity credential using the OIDC issuer of the indicated connected cluster and the Azure IoT Operations service account.

   > [!IMPORTANT]
   > The default version of this command assigns an identity for data flows. If you plan to use data flow graphs, include the `--usage` parameter with the value `wasm-graph`.

1. Restart the schema registry pods to apply the new identity. 

   ```azurecli
   kubectl delete pods adr-schema-registry-0 adr-schema-registry-1 -n azure-iot-operations
   ```

1. Once all of the Azure CLI commands complete successfully, you can close the **Install Azure IoT Operations** wizard.

Once the `create` command completes successfully, you have a working Azure IoT Operations instance running on your cluster. At this point, your instance is configured for production scenarios.

## Verify deployment

[!INCLUDE [deploy-iot-ops-verify-deployment](../includes/deploy-iot-ops-verify-deployment.md)]

## Next steps

- [Configure observability](howto-configure-observability.md) to set up monitoring and dashboards.
- [Enable secure settings](../secure-iot-ops/howto-enable-secure-settings.md) to set up secrets management and managed identities.
- See these scripts in GitHub to automate a [production-ready deployment with secure settings](https://github.com/Azure-Samples/explore-iot-operations/blob/main/quickstart/readme.md).
- To upgrade your Azure IoT Operations deployment to a newer version, see [Upgrade Azure IoT Operations](../manage-iot-ops/howto-upgrade.md).

---
title: Create and manage connector template instances
description: Learn how an IT administrator creates and manages connector template instances in Azure IoT Operations so OT users can connect devices to built-in connectors.
author: dominicbetts
ms.author: dobett
ms.service: azure-iot-operations
ms.topic: how-to
ms.date: 05/28/2026
ai-usage: ai-assisted

#CustomerIntent: As an IT administrator, I want to create and manage connector template instances in my Azure IoT Operations instance so that OT users can use the built-in connectors to connect devices and assets.
---

# Create and manage connector template instances

In Azure IoT Operations, a connector template instance is a reusable configuration that lets the operations experience web UI expose a connector to OT users. Before an OT user can create a device that uses a built-in connector, such as the connectors for HTTP/REST, media, MQTT, ONVIF, or SSE, an IT administrator must add a connector template instance for that connector type.

This article shows you how to:

- Create a basic connector template instance for any built-in connector.
- Attach a persistent volume claim (PVC) to the media connector template so that the connector can save captured snapshots and video clips to storage.
- Reference secrets and trust bundles from a connector template instance for advanced authentication scenarios.
- Customize deployment parameters such as replica count and log level.
- List, view, update, and delete connector template instances.

Typically, an IT administrator creates and manages connector template instances. An OT administrator then uses the operations experience web UI to create devices and assets that reference those instances. For information about the OT tasks, see [Manage assets, devices, and connectors using the operations experience web UI](howto-use-operations-experience.md).

To create a template for a custom Akri connector that you build yourself, see [Build and deploy custom Akri connectors](../develop-edge-apps/howto-develop-akri-connectors.md).

## Prerequisites

[!INCLUDE [prereq-deployed-instance](../includes/prereq-deployed-instance.md)]

[!INCLUDE [prereq-azure-cli](../includes/prereq-azure-cli.md)]

[!INCLUDE [iot-operations-entra-id-setup](../includes/iot-operations-entra-id-setup.md)]

## Create a basic connector template instance

To make a built-in connector available to OT users, create a connector template instance from the connector's metadata artifact.

# [Azure portal](#tab/portal)

When you create a connector template instance in the Azure portal, the connector metadata is pre-populated based on the type and version you select. The wizard guides you through the remaining configuration steps, such as adding secrets or storage if your connector requires them.

1. In the [Azure portal](https://portal.azure.com/), go to your Azure IoT Operations instance, select **Connector templates**, and then select **Create connector template**:

    :::image type="content" source="media/howto-manage-connector-templates/portal-add-connector-template.png" alt-text="Screenshot of the Azure portal that shows how to add a connector template instance." lightbox="media/howto-manage-connector-templates/portal-add-connector-template.png":::

1. On the first page of the **Add an Akri connector template** wizard, select the type and version of connector template you want to add, such as **ONVIF**, **Media**, **HTTP/REST**, **SSE**, or **MQTT**. Then select **Metadata**.

    :::image type="content" source="media/howto-manage-connector-templates/select-connector-template-type.png" alt-text="Screenshot of the Azure portal that shows how to select the connector template instance type." lightbox="media/howto-manage-connector-templates/select-connector-template-type.png":::

1. On the **Metadata** page, accept the defaults, and then select **Device inbound endpoint type**.

1. On the **Device inbound endpoint type** page, accept the defaults, and then select **Diagnostics configurations**.

1. On the **Diagnostics configurations** page, accept the defaults, and then select **Runtime configuration**.

1. On the **Runtime configuration** page, accept the defaults, and then select **Review**.

    To configure storage, secrets, or trust settings on the same page, see [Configure a persistent volume claim for the media connector](#configure-a-persistent-volume-claim-for-the-media-connector), [Reference runtime secrets](#reference-runtime-secrets), and [Reference trust settings](#reference-trust-settings) later in this article.

1. On the **Review** page, review the details of the connector template instance, and then select **Create**.

# [Azure CLI](#tab/cli)

For Microsoft connectors, the metadata artifact is published to Microsoft Container Registry (MCR):

| Connector | Metadata artifact |
|--|--|
| HTTP/REST | `mcr.microsoft.com/azureiotoperations/akri-connectors/rest-metadata:VERSION` |
| Media | `mcr.microsoft.com/azureiotoperations/akri-connectors/media-metadata:VERSION` |
| MQTT | `mcr.microsoft.com/azureiotoperations/akri-connectors/mqtt-metadata:VERSION` |
| ONVIF | `mcr.microsoft.com/azureiotoperations/akri-connectors/onvif-metadata:VERSION` |
| SSE | `mcr.microsoft.com/azureiotoperations/akri-connectors/sse-metadata:VERSION` |

To list available versions for a Microsoft connector, run `curl https://mcr.microsoft.com/v2/azureiotoperations/akri-connectors/TYPE-metadata/tags/list`, where `TYPE` is `rest`, `media`, `mqtt`, `onvif`, or `sse`.

Use the [az iot ops connector template create](/cli/azure/iot/ops/connector/template#az-iot-ops-connector-template-create) command to create a connector template instance. The `--connector-metadata-ref` parameter points to the metadata artifact for the connector type.

The following example creates a template for the HTTP/REST connector:

```azurecli
az iot ops connector template create \
    --name my-rest-template \
    --resource-group <ResourceGroupName> \
    --instance <AioInstanceName> \
    --connector-metadata-ref mcr.microsoft.com/azureiotoperations/akri-connectors/rest-metadata:1.0.6
```

> [!TIP]
> The template name is the prefix of the connector pod name in the Kubernetes cluster. For example, `my-rest-template-80625de9-ss-`.

To verify that the connector template instance was created, run the [az iot ops connector template list](/cli/azure/iot/ops/connector/template#az-iot-ops-connector-template-list) command:

```azurecli
az iot ops connector template list \
    --resource-group <ResourceGroupName> \
    --instance <AioInstanceName> \
    --output table
```

---

An OT user can now use the operations experience web UI to create a device that uses an endpoint of the corresponding connector type.

## Configure a persistent volume claim for the media connector

The media connector can publish snapshots to the MQTT broker and can also save snapshots and video clips to storage. To enable file-based output, the connector template instance must mount a persistent volume claim (PVC) that the connector pod can write to.

Azure IoT Operations uses [Azure Container Storage enabled by Azure Arc (ACSA)](/azure/azure-arc/container-storage/overview) to transfer captured data to cloud storage destinations such as Azure Blob Storage. To learn how to create a suitable PVC, see [Cloud Ingest Edge Volumes configuration](/azure/azure-arc/container-storage/howto-configure-cloud-ingest-subvolumes). The same PVC can be shared between pods.

> [!IMPORTANT]
> Install [Azure Container Storage enabled by Azure Arc](/azure/azure-arc/container-storage/howto-install-edge-volumes) before you use it with the media connector template. The cloud ingest feature relies on [workload identity federation](../secure-iot-ops/howto-enable-secure-settings.md#enable-the-cluster-for-secure-settings), so your cluster must have secure settings enabled.

# [Azure portal](#tab/portal)

On the **Runtime configuration** page of the **Add an Akri connector template** wizard, select **Add a volume claim**, and then enter the name and mount path of the PVC you created previously:

:::image type="content" source="media/howto-manage-connector-templates/add-volume-claim.png" alt-text="Screenshot of the Azure portal that shows how to add a volume claim to a connector template instance." lightbox="media/howto-manage-connector-templates/add-volume-claim.png":::

# [Azure CLI](#tab/cli)

Use the `--storage-volumes` parameter to attach a PVC when you create or update a connector template instance. Each volume requires a `claimName` (the name of an existing PVC) and a `mountPath` (the path inside the connector container):

```azurecli
az iot ops connector template create \
    --name my-media-template \
    --resource-group <ResourceGroupName> \
    --instance <AioInstanceName> \
    --connector-metadata-ref mcr.microsoft.com/azureiotoperations/akri-connectors/media-metadata:1.0.6 \
    --storage-volumes claimName=media-pvc mountPath=/data
```

To attach a PVC to an existing template, use [az iot ops connector template update](/cli/azure/iot/ops/connector/template#az-iot-ops-connector-template-update) with the same `--storage-volumes` parameter.

---

## Reference runtime secrets

Some connector configurations need secrets that are scoped to all device endpoints that use the connector template, rather than to an individual device. For example, the media connector references runtime secrets when it authenticates to a northbound RTSPS media server.

Before you reference a secret from a connector template, add the secret to Azure Key Vault and create a synced secret on the cluster. To learn more, see [Manage secrets for your Azure IoT Operations deployment](../secure-iot-ops/howto-manage-secrets.md).

# [Azure portal](#tab/portal)

On the **Runtime configuration** page of the **Add an Akri connector template** wizard, add the secrets that the connector uses. Each secret requires a Kubernetes secret name, a key inside that secret, and an alias that the connector configuration references:

:::image type="content" source="media/howto-manage-connector-templates/add-secrets.png" alt-text="Screenshot of the Azure portal that shows how to add runtime secrets to a connector template instance." lightbox="media/howto-manage-connector-templates/add-secrets.png":::

# [Azure CLI](#tab/cli)

Use the `--secrets` parameter to add runtime secrets. Each secret requires `secretRef` (the name of the synced secret on the cluster), `secretKey` (the key inside the secret), and `secretAlias` (the alias that the connector configuration references):

```azurecli
az iot ops connector template update \
    --name my-media-template \
    --resource-group <ResourceGroupName> \
    --instance <AioInstanceName> \
    --secrets secretRef=rtsps-creds secretKey=password secretAlias=northboundPassword
```

Use the `--secrets` parameter multiple times in the same command to add multiple secrets. To remove all secrets, pass an empty string: `--secrets ''`.

---

## Reference trust settings

The connector template instance carries the trust bundle that the connector uses to validate TLS certificates that southbound endpoints present. Add a trust bundle to the connector template when a southbound endpoint uses a TLS certificate that's signed by a private or enterprise certificate authority (CA), or a self-signed certificate that the connector doesn't already trust.

The trust bundle is stored as a synced secret on the cluster. The connector template references the synced secret by name. For the full workflow, including portal and CLI steps to add a certificate to Azure Key Vault and sync it to the cluster, see [Manage certificates for external communications](../secure-iot-ops/howto-manage-certificates.md#manage-certificates-for-external-communications).

# [Azure portal](#tab/portal)

In the operations experience web UI, you can upload a certificate file or pick an existing secret from Azure Key Vault. The operations experience creates the synced secret on the cluster and wires it into the connector template's trust list for you. To learn more, see [Manage certificates for external communications](../secure-iot-ops/howto-manage-certificates.md#manage-certificates-for-external-communications).

# [Azure CLI](#tab/cli)

Use `az iot ops secretsync secret set` to create a synced secret on the cluster that references a Key Vault secret containing your trust bundle. Then use the `--trust-settings-secret-ref` parameter to add the synced secret to the connector template:

```azurecli
az iot ops connector template update \
    --name my-rest-template \
    --resource-group <ResourceGroupName> \
    --instance <AioInstanceName> \
    --trust-settings-secret-ref my-trust-bundle
```

---

## Customize deployment parameters

When you create or update a connector template instance, you can customize how Azure IoT Operations deploys the connector pods. The following table lists the most common Azure CLI parameters:

| Parameter | Description |
|--|--|
| `--replicas` | Number of connector pod replicas to deploy. The default is taken from the connector metadata. |
| `--log-level` | Log level for connector pods. Options: `trace`, `debug`, `info`, `warn`, `error`. The default is `info`. |
| `--image-pull-policy` | Kubernetes image pull policy. Options: `Always`, `IfNotPresent`, `Never`. |
| `--image-pull-secrets` | Space-separated list of Kubernetes secret names for pulling container images from a private registry. |
| `--connector-config` | Space-separated `key=value` pairs that override connector-specific configuration. |

For example, the following command creates a template with three replicas and debug logging:

```azurecli
az iot ops connector template create \
    --name my-rest-template \
    --resource-group <ResourceGroupName> \
    --instance <AioInstanceName> \
    --connector-metadata-ref mcr.microsoft.com/azureiotoperations/akri-connectors/rest-metadata:1.0.6 \
    --replicas 3 \
    --log-level debug
```

For the full list of parameters, see [az iot ops connector template create](/cli/azure/iot/ops/connector/template#az-iot-ops-connector-template-create) and [az iot ops connector template update](/cli/azure/iot/ops/connector/template#az-iot-ops-connector-template-update).

## Manage existing connector template instances

Use the following commands to inspect and update connector template instances in your Azure IoT Operations instance:

- List all templates:

  ```azurecli
  az iot ops connector template list \
      --resource-group <ResourceGroupName> \
      --instance <AioInstanceName> \
      --output table
  ```

- Show the full configuration of a template, including image, storage, and security settings:

  ```azurecli
  az iot ops connector template show \
      --name my-rest-template \
      --resource-group <ResourceGroupName> \
      --instance <AioInstanceName>
  ```

- Update a template. You can change deployment parameters such as `--replicas`, `--log-level`, `--secrets`, `--storage-volumes`, and `--trust-settings-secret-ref`. To upgrade a Microsoft connector to a newer patch or minor version, use `--connector-metadata-ref`:

  ```azurecli
  az iot ops connector template update \
      --name my-rest-template \
      --resource-group <ResourceGroupName> \
      --instance <AioInstanceName> \
      --connector-metadata-ref mcr.microsoft.com/azureiotoperations/akri-connectors/rest-metadata:1.0.7
  ```

  Major version upgrades require a new template.

- Delete a template. Azure IoT Operations validates whether the template is in use by deployed connectors and prompts for confirmation:

  ```azurecli
  az iot ops connector template delete \
      --name my-rest-template \
      --resource-group <ResourceGroupName> \
      --instance <AioInstanceName>
  ```

In the Azure portal, you can list, view, and delete connector template instances on the **Connector templates** page of your Azure IoT Operations instance.

## Related content

- [Configure the connector for HTTP/REST](howto-use-http-connector.md)
- [Configure the media connector](howto-use-media-connector.md)
- [Configure the MQTT connector](howto-use-mqtt-connector.md)
- [Configure the connector for ONVIF-compliant cameras](howto-use-onvif-connector.md)
- [Configure the connector for SSE endpoints](howto-use-sse-connector.md)
- [Build and deploy custom Akri connectors](../develop-edge-apps/howto-develop-akri-connectors.md)
- [Manage secrets for your Azure IoT Operations deployment](../secure-iot-ops/howto-manage-secrets.md)
- [Manage certificates for external communications](../secure-iot-ops/howto-manage-certificates.md)

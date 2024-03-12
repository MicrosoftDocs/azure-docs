---
title: Deploy extensions with Azure IoT Orchestrator
description: Use the Azure portal, Azure CLI, or GitHub Actions to deploy Azure IoT Operations extensions with the Azure IoT Orchestrator
author: kgremban
ms.author: kgremban
ms.subservice: orchestrator
ms.topic: how-to
ms.custom: ignite-2023, devx-track-azurecli
ms.date: 01/31/2024

#CustomerIntent: As an OT professional, I want to deploy Azure IoT Operations to a Kubernetes cluster.
---

# Deploy Azure IoT Operations Preview extensions to a Kubernetes cluster

[!INCLUDE [public-preview-note](../includes/public-preview-note.md)]

Deploy Azure IoT Operations Preview to a Kubernetes cluster using the Azure portal, Azure CLI, or GitHub actions. Once you have Azure IoT Operations deployed, then you can use the Azure IoT Orchestrator Preview service to manage and deploy additional workloads to your cluster.

## Prerequisites

Cloud resources: 

* An Azure subscription. If you don't have an Azure subscription, [create one for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

* Azure access permissions. At a minimum, have **Contributor** permissions in your Azure subscription. Depending on the deployment method and feature flag status you select, you may also need **Microsoft/Authorization/roleAssignments/write** permissions. If you *don't* have role assignment write permissions, take the following additional steps when deploying:

  * If deploying with an Azure Resource Manager template, set the `deployResourceSyncRules` parameter to `false`.
  * If deploying with the Azure CLI, include the `--disable-rsync-rules`.

* An [Azure Key Vault](../../key-vault/general/overview.md) that has the **Permission model** set to **Vault access policy**. You can check this setting in the **Access configuration** section of an existing key vault.

Development resources:

* Azure CLI installed on your development machine. For more information, see [How to install the Azure CLI](/cli/azure/install-azure-cli). This scenario requires Azure CLI version 2.46.0 or higher. Use `az --version` to check your version and `az upgrade` to update if necessary.

* The Azure IoT Operations extension for Azure CLI. Use the following command to add the extension or update it to the latest version:

  ```bash
  az extension add --upgrade --name azure-iot-ops
  ```

A cluster host:

* An Azure Arc-enabled Kubernetes cluster. If you don't have one, follow the steps in [Prepare your Azure Arc-enabled Kubernetes cluster](./howto-prepare-cluster.md?tabs=wsl-ubuntu). 

  If you've already deployed Azure IoT Operations to your cluster, uninstall those resources before continuing. For more information, see [Update a deployment](#update-a-deployment).

  Azure IoT Operations should work on any CNCF-conformant kubernetes cluster. Currently, Microsoft only supports K3s on Ubuntu Linux and WSL, or AKS Edge Essentials on Windows. Using Ubuntu in Windows Subsystem for Linux (WSL) is the simplest way to get a Kubernetes cluster for testing.

  Use the Azure IoT Operations extension for Azure CLI to verify that your cluster host is configured correctly for deployment by using the [verify-host](/cli/azure/iot/ops#az-iot-ops-verify-host) command on the cluster host:

  ```azurecli
  az iot ops verify-host
  ```


## Deploy extensions

### Azure CLI

Use the Azure CLI to deploy Azure IoT Operations components to your Arc-enabled Kubernetes cluster.

Sign in to Azure CLI. To prevent potential permission issues later, sign in interactively with a browser here even if you already logged in before.

```azurecli-interactive
az login
```

> [!NOTE]
> If you're using GitHub Codespaces in a browser, `az login` returns a localhost error in the browser window after logging in. To fix, either:
>
> * Open the codespace in VS Code desktop, and then run `az login` in the terminal. This opens a browser window where you can log in to Azure.
> * After you get the localhost error on the browser, copy the URL from the browser and use `curl <URL>` in a new terminal tab. You should see a JSON response with the message "You have logged into Microsoft Azure!".

Deploy Azure IoT Operations to your cluster. The [az iot ops init](/cli/azure/iot/ops#az-iot-ops-init) command does the following steps:

* Creates a key vault in your resource group.
* Sets up a service principal to give your cluster access to the key vault.
* Configures TLS certificates.
* Configures a secrets store on your cluster that connects to the key vault.
* Deploys the Azure IoT Operations resources.

```azurecli-interactive
az iot ops init --cluster <CLUSTER_NAME> -g <RESOURCE_GROUP> --kv-id $(az keyvault create -n <NEW_KEYVAULT_NAME> -g <RESOURCE_GROUP> -o tsv --query id)
```

>[!TIP]
>If you get an error that says *Your device is required to be managed to access your resource*, go back to the previous step and make sure that you signed in interactively.

If you don't have **Microsoft.Authorization/roleAssignment/write** permissions in your Azure subscription, include the `--disable-rsync-rules` feature flag.

If you encounter an issue with the KeyVault access policy and the Service Principal (SP) permissions, [pass service principal and KeyVault arguments](howto-manage-secrets.md#pass-service-principal-and-key-vault-arguments-to-azure-iot-operations-deployment).

Use optional flags to customize the `az iot ops init` command. To learn more, see [az iot ops init](/cli/azure/iot/ops#az-iot-ops-init).

> [!TIP]
> You can check the configurations of topic maps, QoS, message routes with the [CLI extension](/cli/azure/iot/ops#az-iot-ops-check-examples) `az iot ops check --detail-level 2`.

### Configure cluster network (AKS EE)

On AKS Edge Essentials clusters, enable inbound connections to Azure IoT MQ Preview broker and configure port forwarding:

1. Enable a firewall rule for port 8883:

    ```powershell
    New-NetFirewallRule -DisplayName "Azure IoT MQ" -Direction Inbound -Protocol TCP -LocalPort 8883 -Action Allow
    ```

1. Run the following command and make a note of the IP address for the service called `aio-mq-dmqtt-frontend`:

    ```cmd
    kubectl get svc aio-mq-dmqtt-frontend -n azure-iot-operations -o jsonpath='{.status.loadBalancer.ingress[0].ip}'
    ```

1. Enable port forwarding for port 8883. Replace `<aio-mq-dmqtt-frontend IP address>` with the IP address you noted in the previous step:

    ```cmd
    netsh interface portproxy add v4tov4 listenport=8883 listenaddress=0.0.0.0 connectport=8883 connectaddress=<aio-mq-dmqtt-frontend IP address>
    ```

## View resources in your cluster

While the deployment is in progress, you can watch the resources being applied to your cluster. You can use kubectl commands to observe changes on the cluster or, since the cluster is Arc-enabled, you can use the Azure portal.

To view the pods on your cluster, run the following command:

```bash
kubectl get pods -n azure-iot-operations
```

It can take several minutes for the deployment to complete. Continue running the `get pods` command to refresh your view.

To view your cluster on the Azure portal, use the following steps:

1. In the Azure portal, navigate to the resource group that contains your cluster.

1. From the **Overview** of the resource group, select the name of your cluster.

1. On your cluster, select **Extensions** from the menu.

   You can see that your cluster is running extensions of the type **microsoft.iotoperations.x**, which is the group name for all of the Azure IoT Operations components and the orchestration service.

   There's also an extension called **akvsecretsprovider**. This extension is the secrets provider that you configured and installed on your cluster with the `az iot ops init` command. You might delete and reinstall the Azure IoT Operations components during testing, but keep the secrets provider extension on your cluster.

> [!TIP]
> You can run `az iot ops check` to assess health and configurations of deployed AIO workloads. By default, MQ including cloud connectors are assessed and you can [specifiy the service](/cli/azure/iot/ops#az-iot-ops-check-examples) with `--ops-service --svc`.

## Update a deployment

Currently, there is no support for updating an existing Azure IoT Operations deployment. Instead, start with a clean cluster for a new deployment.

If you want to delete the Azure IoT Operations deployment on your cluster so that you can redeploy to it, navigate to your cluster on the Azure portal. Select the extensions of the type **microsoft.iotoperations.x** and **microsoft.deviceregistry.assets**, then select **Uninstall**. Keep the secrets provider on your cluster, as that is a prerequisite for deployment and not included in a fresh deployment. 

## Next steps

If your components need to connect to Azure endpoints like SQL or Fabric, learn how to [Manage secrets for your Azure IoT Operations Preview deployment](./howto-manage-secrets.md).

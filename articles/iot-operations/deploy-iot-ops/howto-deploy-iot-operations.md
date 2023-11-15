---
title: Deploy extensions - Azure IoT Orchestrator
description: Use the Azure portal, Azure CLI, or GitHub Actions to deploy Azure IoT Operations extensions with the Azure IoT Orchestrator
author: kgremban
ms.author: kgremban
# ms.subservice: orchestrator
ms.topic: how-to
ms.custom:
  - ignite-2023
ms.date: 11/07/2023

#CustomerIntent: As an OT professional, I want to deploy Azure IoT Operations to a Kubernetes cluster.
---

# Deploy Azure IoT Operations extensions to a Kubernetes cluster

Deploy Azure IoT Operations preview - enabled by Azure Arc to a Kubernetes cluster using the Azure portal, Azure CLI, or GitHub actions. Once you have Azure IoT Operations deployed, then you can use the Orchestrator service to manage and deploy additional workloads to your cluster.

## Prerequisites

* An Azure subscription. If you don't have an Azure subscription, [create one for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

* An Azure Arc-enabled Kubernetes cluster. If you don't have one, follow the steps in [Prepare your Azure Arc-enabled Kubernetes cluster](./howto-prepare-cluster.md?tabs=wsl-ubuntu). Using Ubuntu in Windows Subsystem for Linux (WSL) is the simplest way to get a Kubernetes cluster for testing.

  Azure IoT Operations should work on any CNCF-conformant kubernetes cluster. Currently, Microsoft only supports K3s on Ubuntu Linux and WSL, or AKS Edge Essentials on Windows.

* Azure CLI installed on your development machine. For more information, see [How to install the Azure CLI](/cli/azure/install-azure-cli).

* An [Azure Key Vault](../../key-vault/general/overview.md) that has the **Permission model** set to **Vault access policy**. You can check this setting in the **Access configuration** section of an existing key vault.

## Deploy extensions

#### [Azure portal](#tab/portal)

Use the Azure portal to deploy Azure IoT Operations components to your Arc-enabled Kubernetes cluster.

1. In the Azure portal search bar, search for and select **Azure Arc**.

1. Select **Azure IoT Operations (preview)** from the **Application services** section of the Azure Arc menu.

1. Select **Create**.

1. On the **Basics** tab of the **Install Azure IoT Operations Arc Extension** page, provide the following information:

   | Field | Value |
   | ----- | ----- |
   | **Subscription** | Select the subscription that contains your Arc-enabled Kubernetes cluster. |
   | **Resource group** | Select the resource group that contains your Arc-enabled Kubernetes cluster. |
   | **Cluster name** | Select your cluster. When you do, the **Custom location** and **Deployment details** sections autofill. |

1. Select **Next: Configuration**.

1. On the **Configuration** tab, provide the following information:

   | Field | Value |
   | ----- | ----- |
   | **Deploy a simulated PLC** | Switch this toggle to **Yes**. The simulated PLC creates demo telemetry data that you use in the following quickstarts. |
   | **Mode** | Set the MQ configuration mode to **Auto**. |

1. Select **Next: Automation**.

1. On the **Automation** tab, select **Pick or create an Azure Key Vault**.

1. Provide the following information to connect a key vault:

   | Field | Value |
   | ----- | ----- |
   | **Subscription** | Select the subscription that contains your Arc-enabled Kubernetes cluster. |
   | **Key vault** | Choose an existing key vault from the drop-down list or create a new one by selecting **Create new key vault**. |

1. Select **Select**.

1. On the **Automation** tab, the automation commands are populated based on your chosen cluster and key vault. Copy the **Required** CLI command.

   :::image type="content" source="../get-started/media/quickstart-deploy/install-extension-automation-2.png" alt-text="Screenshot of copying the CLI command from the automation tab for installing the Azure IoT Operations Arc extension in the Azure portal.":::

1. Sign in to Azure CLI on your development machine. To prevent potential permission issues later, sign in interactively with a browser here even if you've already logged in before.

   ```azurecli
   az login
   ```

   > [!NOTE]
   > If you're using Github Codespaces in a browser, `az login` returns a localhost error in the browser window after logging in. To fix, either:
   >
   > * Open the codespace in VS Code desktop, and then run `az login` again in the browser terminal.
   > * After you get the localhost error on the browser, copy the URL from the browser and run `curl "<URL>"` in a new terminal tab. You should see a JSON response with the message "You have logged into Microsoft Azure!."

1. Run the copied `az iot ops init` command on your development machine.

1. Return to the Azure portal and select **Review + Create**.

1. Wait for the validation to pass and then select **Create**.

#### [GitHub Actions](#tab/github)

Use GitHub Actions to deploy Azure IoT Operations components to your Arc-enabled Kubernetes cluster.

Before you begin deploying, use the `az iot ops init` command to configure your cluster with a secrets store and a service principal so that it can connect securely to cloud resources.

1. Sign in to Azure CLI on your development machine. To prevent potential permission issues later, sign in interactively with a browser here even if you already logged in before.

   ```azurecli
   az login
   ```

1. Run the `az iot ops init` command to do the following:

   * Create a key vault in your resource group.
   * Set up a service principal to give your cluster access to the key vault.
   * Configure TLS certificates.
   * Configure a secrets store on your cluster that connects to the key vault.

   ```azurecli-interactive
   az iot ops init --cluster <CLUSTER_NAME> -g <RESOURCE_GROUP> --kv-id $(az keyvault create -n <NEW_KEYVAULT_NAME> -g <RESOURCE_GROUP> -o tsv --query id) --no-deploy
   ```

Now, you can deploy Azure IoT Operations to your cluster.

1. On GitHub, fork the [azure-iot-operations repo](https://github.com/azure/azure-iot-operations).

   >[!IMPORTANT]
   >You're going to be adding secrets to the repo to run the deployment steps. It's important that you fork the repo and do all of the following steps in your own fork.

1. Review the [azure-iot-operations.json](https://github.com/Azure/azure-iot-operations/blob/main/release/azure-iot-operations.json) file in the repo. This template defines the Azure IoT Operations deployment.

1. Create a service principal for the repository to use when deploying to your cluster. Use the [az ad sp create-for-rbac](/cli/azure/ad/sp#az-ad-sp-create-for-rbac) command.

   ```azurecli
   az ad sp create-for-rbac --name <NEW_SERVICE_PRINCIPAL_NAME> \
                            --role owner \
                            --scopes /subscriptions/<YOUR_SUBSCRIPTION_ID>
                            --json-auth
   ```

1. Copy the JSON output from the service principal creation command.

1. On GitHub, navigate to your fork of the azure-iot-operations repo.

1. Select **Settings** > **Secrets and variables** > **Actions**.

1. Create a repository secret named `AZURE_CREDENTIALS` and paste the service principal JSON as the secret value.

1. Create a parameter file in your forked repo to specify the environment configuration for your Azure IoT Operations deployment. For example, `envrionments/parameters.json`.

1. Paste the following snippet into the parameters file, replacing the `clusterName` placeholder value with your own information:

   ```json
   {
     "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentParameters.json#",
     "contentVersion": "1.0.0.0",
     "parameters": {
       "clusterName": {
         "value": "<CLUSTER_NAME>"
       }
     }
   }
   ```

1. Add any of the following optional parameters as needed for your deployment:

   | Parameter | Type | Description |
   | --------- | ---- | ----------- |
   | `clusterLocation` | string | Specify the cluster's location if it's different than the resource group's location. Otherwise, this parameter defaults to the resource group's location. |
   | `location` | string | If the resource group's location isn't supported for Azure IoT Operations deployments, use this parameter to override the default and set the location for the Azure IoT Operations resources. |
   | `simulatePLC` | Boolean | Set to `true` if you want to include a simulated component to generate test data. |
   | `dataProcessorSecrets` | object | Pass a secret to an Azure IoT Data Processor resource. |
   | `mqSecrets` | object | Pass a secret to an Azure IoT MQ resource. |
   | `opcUaBrokerSecrets` | object | Pass a secret to an Azure OPC UA Broker resource. |

1. Save your changes to the parameters file.

1. On the GitHub repo, select **Actions** and confirm **I understand my workflows, go ahead and enable them.**

1. Run the **GitOps Deployment of Azure IoT Operations** action and provide the following information:

   | Parameter | Value |
   | --------- | ----- |
   | **Subscription** | Your Azure subscription ID. |
   | **Resource group** | The name of the resource group that contains your Arc-enabled cluster. |
   | **Environment parameters file** | The path to the parameters file that you created. |

#### [Azure CLI](#tab/cli)

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

Deploy Azure IoT Operations to your cluster. The `az iot ops init` command does the following steps:

* Creates a key vault in your resource group.
* Sets up a service principal to give your cluster access to the key vault.
* Configures TLS certificates.
* Configures a secrets store on your cluster that connects to the key vault.
* Deploys the Azure IoT Operations resources.

```azurecli-interactive
az iot ops init --cluster <CLUSTER_NAME> -g <RESOURCE_GROUP> --kv-id $(az keyvault create -n <NEW_KEYVAULT_NAME> -g <RESOURCE_GROUP> -o tsv --query id)
```

Use optional flags to customize the `az iot ops init` command. To learn more, see [`az iot ops init` reference](https://github.com/Azure/azure-edge-cli-extension/wiki/Azure-IoT-Ops-Reference#az-iot-ops-init). For example:

| Parameter | Description |
| --------- | ----------- |
| `--no-tls` | Disable TLS workflows. |
| `--no-deploy` | Disable Azure IoT Operations deployment workflows. |
| `--sp-app-id` | Provide an existing app registration ID to disable the command from creating an app registration. |

---

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

## Next steps

If your components need to connect to Azure endpoints like SQL or Fabric, learn how to [Manage secrets for your Azure IoT Operations deployment](./howto-manage-secrets.md).

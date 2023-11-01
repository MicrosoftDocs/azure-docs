---
title: "Quickstart: Deploy Azure IoT Operations"
description: "Quickstart: Use Azure IoT Orchestrator to deploy Azure IoT Operations to an Arc-enabled Kubernetes cluster."
author: kgremban
ms.author: kgremban
ms.topic: quickstart
ms.date: 10/30/2023

#CustomerIntent: As a < type of user >, I want < what? > so that < why? >.
---

# Quickstart: Deploy Azure IoT Operations to an Arc-enabled Kubernetes cluster

[!INCLUDE [public-preview-note](../includes/public-preview-note.md)]

In this quickstart, you will deploy a suite of IoT services to an Azure Arc-enabled Kubernetes cluster so that you can remotely manage your devices and workloads. Azure IoT Operations Preview is a digital operations suite of services that includes Azure IoT Orchestrator. This quickstart guides you through using Orchestrator to deploy these services to a Kubernetes cluster. At the end of the quickstart, you'll have a cluster that you can manage from the cloud that's generating sample telemetry data to use in the following quickstarts.

The services deployed in this quickstart include:

* [Azure IoT Orchestrator](../deploy/overview-deploy.md)
* [Azure IoT MQ](../manage-mqtt-connectivity/overview-iot-mq.md)
* [Azure IoT Data Processor](../process-data/overview-data-processor.md) with a demo pipeline to start routing the simulated data
* [Azure IoT Akri](../manage-devices-assets/overview-akri.md)
* [Azure Device Registry](../manage-devices-assets/overview-manage-assets.md#manage-assets-as-azure-resources-in-a-centralized-registry)
* [Azure IoT Layered Network Management](../manage-layered-network/overview-layered-network.md)
* A simulated thermostat asset to start generating data

<!--* [Observability](/docs/observability/)-->
<!-- * [Azure IoT OPC UA broker](../manage-devices-assets/concept-opcua-broker-overview.md) with simulated thermostat asset to start generating data -->

## Prerequisites

* An Azure subscription. If you don't have an Azure subscription, [create one for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

* An Azure Arc-enabled Kubernetes cluster. If you don't have one, follow the steps in [Prepare your Azure Arc-enabled Kubernetes cluster](../deploy/howto-prepare-cluster.md?tabs=codespaces). Using the Github codespace is the simplest way to get a new Kubernetes cluster, but you can use an existing environment like K3s or AKS Edge Essentials.

  > [!IMPORTANT]
  > Azure IoT Operations should work on any Kubernetes cluster that conforms to the Cloud Native Computing Foundation (CNCF) standards. However, the validated environments Microsoft supports for evaluation are K3s on Ubuntu Linux and WSL, or AKS Edge Essentials on Windows. The codespace option is intended for exploration only.

* Azure CLI installed on your development machine. For more information, see [How to install the Azure CLI](/cli/azure/install-azure-cli).

  This quickstart requires Azure CLI version 2.42.0 or higher. Use `az --version` to check your version.

<!-- TODO: Remove for Ignite -->
* Install the Azure IoT Operations extension for Azure CLI.

  * On Linux:

   ```bash
   az extension add --source $(curl -w "%{url_effective}\n" -I -L -s -S https://aka.ms/aziotopscli-latest -o /dev/null) -y
   ```

   * On Windows:

   ```powershell
   az extension add --source ([System.Net.HttpWebRequest]::Create('https://aka.ms/aziotopscli-latest').GetResponse().ResponseUri.AbsoluteUri) -y
   ```
  
## What problem will we solve?

Azure IoT Operations is a suite of data services that run on Arc-enabled Kubernetes clusters, and those services need to be managed remotely. Orchestrator is the service that helps you define, deploy, and manage these application workloads.

## Configure cluster and deploy Azure IoT Operations

# [Azure CLI](#tab/azure-cli)

Use the Azure CLI to deploy Azure IoT Operations components to your Arc-enabled Kubernetes cluster. Part of the deployment process is to configure your cluster so that it can communicate securely with your Azure IoT Operations components and key vault. The Azure CLI command `az iot ops init` does this for you.

1. Log in to Azure CLI. To prevent permission potential issues later, log in interactively with a browser here even if you've already logged in before.

   ```azurecli-interactive
   az login
   ```

   > [!NOTE]
   > When using a Github codespace in a browser, `az login` returns a localhost error in the browser window after logging in. To fix, either:
   >
   > * Open the codespace in VS Code desktop, and then run `az login` in the terminal. This opens a browser window where you can log in to Azure.
   > * After you get the localhost error on the browser, copy the URL from the browser and use `curl <URL>` in a new terminal tab. You should see a JSON response with the message "You have logged into Microsoft Azure!."

1. Deploy Azure IoT Operations to your cluster. The `az iot ops init` command does the following steps:

   * Creates a key vault in your resource group.
   * Sets up a service principal to give your cluster access to the key vault.
   * Configures TLS certificates.
   * Configures a secrets store on your cluster that connects to the key vault.
   * Deploys the Azure IoT Operations resources.

   Replace the placeholder parameters in the command with your own information:

   | Parameter | Value |
   | ----- | ----- |
   | **CLUSTER_NAME** | The name of your Arc-connected Kubernetes cluster. |
   | **RESOURCE_GROUP** | The resource group that also contains your Arc-enabled Kubernetes cluster. |
   | **KEYVAULT_NAME** | A globally unique name for your key vault. Key Vault names are  string of 3 to 24 characters that can contain only numbers (0-9), letters (a-z, A-Z), and hyphens (-). |

   ```azurecli-interactive
   az iot ops init --cluster <CLUSTER_NAME> -g <RESOURCE_GROUP> --kv-id $(az keyvault create -n <KEYVAULT-NAME> -g <RESOURCE_GROUP> -o tsv --query id) --simulate-plc
   ```

   > [!TIP]
   > The `az iot ops init` can be customized to perform individual deployment steps separately. To learn more, see [`az iot ops init` reference](https://github.com/Azure/azure-edge-cli-extension/wiki/Azure-IoT-Ops-Reference#az-iot-ops-init).

# [Portal](#tab/azure-portal)

Use the Azure portal to deploy Azure IoT Operations components to your Arc-enabled Kubernetes cluster.

<!-- TODO: change to normal link for Ignite -->
1. Open the [Azure portal](https://portal.azure.com).

1. In the Azure portal search bar, search for and select **Azure Arc**.

1. Select **Azure IoT Operations (preview)** from the **Application services** section of the Azure Arc menu.

1. Select **Create**.

1. On the **Basics** tab of the **Install Azure IoT Operations Arc Extension** page, provide the following information:

   | Field | Value |
   | ----- | ----- |
   | **Subscription** | Select the subscription that contains your Arc-enabled Kubernetes cluster. |
   | **Resource group** | Select the resource group that contains your Arc-enabled Kubernetes cluster. |
   | **Cluster name** | Select your cluster. When you do, the **Custom location** and **Deployment details** sections autofill. |
   | **Secrets** | Check the box confirming that you set up the secrets provider in your cluster by following the steps in the previous sections. |

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
   | **Key vault** | Choose an existing key vault from the drop-down list or select **Create new key vault**. |

1. Select **Select**.

1. On the **Automation** tab, the automation commands are populated based on your chosen cluster and key vault. Copy the **Required** CLI command and run it on your development machine.

1. After successfully running the `az iot ops init` command on your cluster, select **Review + Create**.

1. Wait for the validation to pass and then select **Create**.

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

## How did we solve the problem?

In this quickstart, you configured your Arc-enabled Kubernetes cluster so that it could communicate securely with your Azure IoT Operations components. Then, you deployed those components to your cluster. For this test scenario, you have a single Kubernetes cluster that's probably running locally on your machine. In a production scenario, however, you can use the same steps to deploy workloads to many clusters across many sites.

## Clean up resources

If you're continuing on to the next quickstart, keep all of your resources.

If you want to delete the Azure IoT Operations deployment but plan on reinstalling it on your cluster, be sure to keep the secrets provider on your cluster. In your cluster on the Azure portal, select the extensions of the type **microsoft.iotoperations.x** and **microsoft.deviceregistry.assets**, then select **Uninstall**.

If you want to delete all of the resources you created for this quickstart, delete the Kubernetes cluster that you deployed Azure IoT Operations to and remove the Azure resource group that contained the cluster.

## Next steps

> [!div class="nextstepaction"]
> [Quickstart: Add OPC UA assets to your Azure IoT Operations cluster](quickstart-add-assets.md)

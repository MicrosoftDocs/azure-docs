---
title: "Quickstart: Deploy Azure IoT Operations Preview"
description: "Quickstart: Use Azure IoT Orchestrator to deploy Azure IoT Operations to an Arc-enabled Kubernetes cluster."
author: kgremban
ms.author: kgremban
ms.subservice: orchestrator
ms.topic: quickstart
ms.custom: ignite-2023, devx-track-azurecli
ms.date: 01/31/2024

#CustomerIntent: As a < type of user >, I want < what? > so that < why? >.
---

# Quickstart: Deploy Azure IoT Operations Preview to an Arc-enabled Kubernetes cluster

[!INCLUDE [public-preview-note](../includes/public-preview-note.md)]

In this quickstart, you will deploy a suite of IoT services to an Azure Arc-enabled Kubernetes cluster so that you can remotely manage your devices and workloads. Azure IoT Operations Preview is a digital operations suite of services that includes Azure IoT Orchestrator Preview. This quickstart guides you through using Orchestrator to deploy these services to a Kubernetes cluster. At the end of the quickstart, you have a cluster that you can manage from the cloud that's generating sample data to use in the following quickstarts.

The services deployed in this quickstart include:

* [Azure IoT Orchestrator Preview](../deploy-custom/overview-orchestrator.md)
* [Azure IoT MQ Preview](../manage-mqtt-connectivity/overview-iot-mq.md)
* [Azure IoT OPC UA Broker Preview](../manage-devices-assets/overview-opcua-broker.md) with simulated thermostat asset to start generating data
* [Azure IoT Data Processor Preview](../process-data/overview-data-processor.md) with a demo pipeline to start routing the simulated data
* [Azure IoT Akri Preview](../manage-devices-assets/overview-akri.md)
* [Azure Device Registry Preview](../manage-devices-assets/overview-manage-assets.md#manage-assets-as-azure-resources-in-a-centralized-registry)
* [Azure IoT Layered Network Management Preview](../manage-layered-network/overview-layered-network.md)
* [Observability](../monitor/howto-configure-observability.md)

The following quickstarts in this series build on this one to define sample assets, data processing pipelines, and visualizations. If you want to deploy Azure IoT Operations to run your own workloads, see [Prepare your Azure Arc-enabled Kubernetes cluster](../deploy-iot-ops/howto-prepare-cluster.md) and [Deploy Azure IoT Operations Preview extensions to a Kubernetes cluster](../deploy-iot-ops/howto-deploy-iot-operations.md).

## Prerequisites

Review the prerequisites based on the environment you use to host the Kubernetes cluster.

For this quickstart, we recommend GitHub Codespaces as a quick way to get started in a virtual environment without installing new tools. Or, use Azure Kubernetes Service (AKS) Edge Essentials to create a cluster on Windows devices or K3s on Ubuntu Linux devices.

As part of this quickstart, you create a cluster in either Codespaces, AKS Edge Essentials, or Linux. If you want to reuse a cluster that you've deployed Azure IoT Operations to before, refer to the steps in [Clean up resources](#clean-up-resources) to uninstall Azure IoT Operations before continuing.

# [Virtual](#tab/codespaces)

* An Azure subscription. If you don't have an Azure subscription, [create one for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

* A [GitHub](https://github.com) account.

# [Windows](#tab/windows)

* You'll use the `AksEdgeQuickStartForAio.ps1` script to set up an AKS Edge Essentials single-machine K3S Linux-only cluster. Ensure that your machine has a minimum of 10 GB RAM, 4 vCPUs, and 40 GB free disk space. To learn more, see the [AKS Edge Essentials system requirements](/azure/aks/hybrid/aks-edge-system-requirements).

* An Azure subscription. If you don't have an Azure subscription, [create one for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

* Azure CLI installed on your development machine. For more information, see [How to install the Azure CLI](/cli/azure/install-azure-cli).

  This quickstart requires Azure CLI version 2.46.0 or higher. Use `az --version` to check your version and `az upgrade` to update if necessary.

* The Azure IoT Operations extension for Azure CLI. Use the following command to add the extension or update it to the latest version:

  ```bash
  az extension add --upgrade --name azure-iot-ops
  ```

# [Linux](#tab/linux)

* An Azure subscription. If you don't have an Azure subscription, [create one for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

* Azure CLI installed on your development machine. For more information, see [How to install the Azure CLI](/cli/azure/install-azure-cli).

  This quickstart requires Azure CLI version 2.46.0 or higher. Use `az --version` to check your version and `az upgrade` to update if necessary.

* The Azure IoT Operations extension for Azure CLI. Use the following command to add the extension or update it to the latest version:

  ```bash
  az extension add --upgrade --name azure-iot-ops
  ```

---
  
## What problem will we solve?

Azure IoT Operations is a suite of data services that run on Kubernetes clusters. You want these clusters to be managed remotely from the cloud, and able to securely communicate with cloud resources and endpoints. We address these concerns with the following tasks in this quickstart:

1. Connect a Kubernetes cluster to Azure Arc for remote management.
1. Create an Azure Key Vault to manage secrets for your cluster.
1. Configure your cluster with a secrets store and service principal to communicate with cloud resources.
1. Deploy Azure IoT Operations to your cluster.

## Connect a Kubernetes cluster to Azure Arc

Azure IoT Operations should work on any Kubernetes cluster that conforms to the Cloud Native Computing Foundation (CNCF) standards. For this quickstart, use GitHub Codespaces, AKS Edge Essentials on Windows, or K3s on Ubuntu Linux.

In this section, you create a new cluster and connect it to Azure Arc. If you want to reuse a cluster that you've deployed Azure IoT Operations to before, refer to the steps in [Clean up resources](#clean-up-resources) to uninstall Azure IoT Operations before continuing.

# [Virtual](#tab/codespaces)

[!INCLUDE [prepare-codespaces](../includes/prepare-codespaces.md)]

[!INCLUDE [connect-cluster](../includes/connect-cluster.md)]

# [Windows](#tab/windows)

On Windows devices, use AKS Edge Essentials to create a Kubernetes cluster.

Open an elevated PowerShell window, change the directory to a working folder, then run the following commands:

```powershell
$url = "https://raw.githubusercontent.com/Azure/AKS-Edge/main/tools/scripts/AksEdgeQuickStart/AksEdgeQuickStartForAio.ps1"
Invoke-WebRequest -Uri $url -OutFile .\AksEdgeQuickStartForAio.ps1
Unblock-File .\AksEdgeQuickStartForAio.ps1
Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process -Force
```

This script automates the following steps:

* Download the GitHub archive of Azure/AKS-Edge into the working folder and unzip it to a folder AKS-Edge-main (or AKS-Edge-\<tag>). By default, the script downloads the **main** branch.

* Validate that the correct az cli version is installed and ensure that az cli is logged into Azure.

* Download and install the AKS Edge Essentials MSI.

* Install required host OS features (Install-AksEdgeHostFeatures).

  >[!TIP]
  >Your machine might reboot when Hyper-V is enabled. If so, go back and run the setup commands again before running the quickstart script.

* Deploy a single machine cluster with internal switch (Linux node only).

* Create the Azure resource group in your Azure subscription to store all the resources.

* Connect the cluster to Azure Arc and registers the required Azure resource providers.

* Apply all the required configurations for Azure IoT Operations, including:

  * Enable a firewall rule and port forwarding for port 8883 to enable incoming connections to Azure IoT Operations MQ broker.

  * Install Storage local-path provisioner.

  * Enable node level metrics to be picked up by Azure Managed Prometheus.

In an elevated PowerShell prompt, run the AksEdgeQuickStartForAio.ps1 script. This script brings up a K3s cluster. Replace the placeholder parameters with your own information.

   | Placeholder | Value |
   | ----------- | ----- |
   | **SUBSCRIPTION_ID** | ID of the subscription where your resource group and Arc-enabled cluster will be created. |
   | **TENANT_ID** | ID of your Microsoft Entra tenant. |
   | **RESOURCE_GROUP_NAME** | A name for a new resource group. |
   | **LOCATION** | An Azure region close to you. The following regions are supported in public preview: East US2, West US 3, West Europe, East US, West US, West US 2, North Europe. |
   | **CLUSTER_NAME** | A name for the new connected cluster. |

   ```powerShell
   .\AksEdgeQuickStartForAio.ps1 -SubscriptionId "<SUBSCRIPTION_ID>" -TenantId "<TENANT_ID>" -ResourceGroupName "<RESOURCE_GROUP_NAME>"  -Location "<LOCATION>"  -ClusterName "<CLUSTER_NAME>"
   ```

When the script is completed, it brings up an Arc-enabled K3s cluster on your machine.

Run the following commands to check that the deployment was successful:

```powershell
Import-Module AksEdge
Get-AksEdgeDeploymentInfo
```

In the output of the `Get-AksEdgeDeploymentInfo` command, you should see that the cluster's Arc status is `Connected`.

# [Linux](#tab/linux)

On Ubuntu Linux, use K3s to create a Kubernetes cluster.

1. Run the K3s installation script:

   ```bash
   curl -sfL https://get.k3s.io | sh -
   ```

1. Create a K3s configuration yaml file in `.kube/config`:

   ```bash
   mkdir ~/.kube
   sudo KUBECONFIG=~/.kube/config:/etc/rancher/k3s/k3s.yaml kubectl config view --flatten > ~/.kube/merged
   mv ~/.kube/merged ~/.kube/config
   chmod  0600 ~/.kube/config
   export KUBECONFIG=~/.kube/config
   #switch to k3s context
   kubectl config use-context default
   ```

1. Run the following command to increase the [user watch/instance limits](https://www.suse.com/support/kb/doc/?id=000020048) and the file descriptor limit.

   ```bash
   echo fs.inotify.max_user_instances=8192 | sudo tee -a /etc/sysctl.conf
   echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
   echo fs.file-max = 100000 | sudo tee -a /etc/sysctl.conf

   sudo sysctl -p
   ```

[!INCLUDE [connect-cluster](../includes/connect-cluster.md)]

---

## Verify cluster

Use the Azure IoT Operations extension for Azure CLI to verify that your cluster host is configured correctly for deployment by using the [verify-host](/cli/azure/iot/ops#az-iot-ops-verify-host) command on the cluster host:

```azurecli
az iot ops verify-host
```

This helper command checks connectivity to Azure Resource Manager and Microsoft Container Registry endpoints.

## Configure cluster and deploy Azure IoT Operations Preview

Part of the deployment process is to configure your cluster so that it can communicate securely with your Azure IoT Operations components and key vault. The Azure CLI command `az iot ops init` does this for you. Once your cluster is configured, then you can deploy Azure IoT Operations.

Use the Azure CLI to create a key vault, build the `az iot ops init` command based on your resources, and then deploy Azure IoT Operations components to your Arc-enabled Kubernetes cluster.

### Create a key vault

You can use an existing key vault for your secrets, but verify that the **Permission model** is set to **Vault access policy**. You can check this setting in the Azure portal in the **Access configuration** section of an existing key vault. Or use the [az keyvault show](/cli/azure/keyvault#az-keyvault-show) command to check that `enableRbacAuthorization` is false.

To create a new key vault, use the following command:

```azurecli
az keyvault create --enable-rbac-authorization false --name "<your unique key vault name>" --resource-group "<the name of the resource group that contains your Kubernetes cluster>"
```

### Deploy Azure IoT Operations Preview

1. In the Azure portal search bar, search for and select **Azure Arc**.

1. Select **Azure IoT Operations (preview)** from the **Application Services** section of the Azure Arc menu.

   :::image type="content" source="./media/quickstart-deploy/arc-iot-operations.png" alt-text="Screenshot of selecting Azure IoT Operations from Azure Arc.":::

1. Select **Create**.

1. On the **Basic** tab of the **Install Azure IoT Operations Arc Extension** page, provide the following information:

   | Field | Value |
   | ----- | ----- |
   | **Subscription** | Select the subscription that contains your Arc-enabled Kubernetes cluster. |
   | **Resource group** | Select the resource group that contains your Arc-enabled Kubernetes cluster. |
   | **Cluster name** | Select your cluster. When you do, the **Custom location** and **Deployment details** sections autofill. |

   :::image type="content" source="./media/quickstart-deploy/install-extension-basics.png" alt-text="Screenshot of the basics tab for installing the Azure IoT Operations Arc extension in the Azure portal.":::

1. Select **Next: Configuration**.

1. On the **Configuration** tab, provide the following information:

   | Field | Value |
   | ----- | ----- |
   | **Deploy a simulated PLC** | Switch this toggle to **Yes**. The simulated PLC creates demo telemetry data that you use in the following quickstarts. |
   | **Mode** | Set the MQ configuration mode to **Auto**. |

   :::image type="content" source="./media/quickstart-deploy/install-extension-configuration.png" alt-text="Screenshot of the configuration tab for installing the Azure IoT Operations Arc extension in the Azure portal.":::

1. Select **Next: Automation**.

1. On the **Automation** tab, provide the following information:

   | Field | Value |
   | ----- | ----- |
   | **Subscription** | Select the subscription that contains your Arc-enabled Kubernetes cluster. |
   | **Azure Key Vault** | Use the **Select a key vault** drop-down menu to choose the key vault that you set up in the previous section. |

1. Once you select a key vault, the **Automation** tab uses all the information you've selected so far to populate an Azure CLI command that configures your cluster and deploys Azure IoT Operations. Copy the CLI command.

   :::image type="content" source="./media/quickstart-deploy/install-extension-automation.png" alt-text="Screenshot of copying the CLI command from the automation tab for installing the Azure IoT Operations Arc extension in the Azure portal.":::

1. Sign in to Azure CLI on your development machine or in your codespace terminal. To prevent potential permission issues later, sign in interactively with a browser here even if you've already logged in before.

   ```azurecli
   az login
   ```

   > [!NOTE]
   > When using a GitHub codespace in a browser, `az login` returns a localhost error in the browser window after logging in. To fix, either:
   >
   > * Open the codespace in VS Code desktop, and then run `az login` again in the browser terminal.
   > * After you get the localhost error on the browser, copy the URL from the browser and run `curl "<URL>"` in a new terminal tab. You should see a JSON response with the message "You have logged into Microsoft Azure!."

1. Run the copied `az iot ops init` command on your development machine or in your codespace terminal.

   >[!TIP]
   >If you get an error that says *Your device is required to be managed to access your resource*, go back to the previous step and make sure that you signed in interactively.

1. These quickstarts use the **OPC PLC simulator** to generate sample data. To configure the simulator for the quickstart scenario, run the following command:

    > [!IMPORTANT]
    > Don't use the following example in production, use it for simulation and test purposes only. The example lowers the security level for the OPC PLC so that it accepts connections from any client without an explicit peer certificate trust operation.

    ```azurecli
    az k8s-extension update --version 0.3.0-preview --name opc-ua-broker --release-train preview --cluster-name $CLUSTER_NAME --resource-group $RESOURCE_GROUP --cluster-type connectedClusters --auto-upgrade-minor-version false --config opcPlcSimulation.deploy=true --config opcPlcSimulation.autoAcceptUntrustedCertificates=true
    ```

## View resources in your cluster

While the deployment is in progress, you can watch the resources being applied to your cluster. You can use kubectl commands to observe changes on the cluster or, since the cluster is Arc-enabled, you can use the Azure portal.

To view the pods on your cluster, run the following command:

```console
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
> [Quickstart: Add OPC UA assets to your Azure IoT Operations Preview cluster](quickstart-add-assets.md)

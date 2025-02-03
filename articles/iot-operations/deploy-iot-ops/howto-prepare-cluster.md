---
title: Prepare your Kubernetes cluster
description: Prepare an Azure Arc-enabled Kubernetes cluster before you deploy Azure IoT Operations. This article includes guidance for both Ubuntu and Windows machines.
author: kgremban
ms.author: kgremban
ms.topic: how-to
ms.custom: ignite-2023, devx-track-azurecli
ms.date: 10/23/2024

#CustomerIntent: As an IT professional, I want prepare an Azure-Arc enabled Kubernetes cluster so that I can deploy Azure IoT Operations to it.
---

# Prepare your Azure Arc-enabled Kubernetes cluster

An Azure Arc-enabled Kubernetes cluster is a prerequisite for deploying Azure IoT Operations. This article describes how to prepare a cluster before you deploy Azure IoT Operations. This article includes guidance for both Ubuntu and Windows.

The steps in this article prepare your cluster for a secure settings deployment, which is a longer but production-ready process. If you want to deploy Azure IoT Operations quickly and run a sample workload with only test settings, see the [Quickstart: Run Azure IoT Operations in GitHub Codespaces with K3s](../get-started-end-to-end-sample/quickstart-deploy.md) instead. For more information about test settings and secure settings, see [Deployment details > Choose your features](./overview-deploy.md#choose-your-features).

## Prerequisites

Microsoft supports Azure Kubernetes Service (AKS) Edge Essentials for deployments on Windows and K3s for deployments on Ubuntu. If you want to deploy Azure IoT Operations to a multi-node solution, use K3s on Ubuntu.

### [Ubuntu](#tab/ubuntu)

To prepare an Azure Arc-enabled Kubernetes cluster, you need:

* An Azure subscription with either the Owner role or a combination of Contributor and User Access Administrator roles. You can check your access level by navigating to your subscription, selecting Access control (IAM) on the left-hand side of the Azure portal, and then selecting View my access. If you don't have an Azure subscription, [create one for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin. 

* An Azure resource group. Only one Azure IoT Operations instance is supported per resource group. To create a new resource group, use the [az group create](/cli/azure/group#az-group-create) command. For the list of currently supported Azure regions, see [Supported regions](../overview-iot-operations.md#supported-regions).

   ```azurecli
   az group create --location <REGION> --resource-group <RESOURCE_GROUP> --subscription <SUBSCRIPTION_ID>
   ```

* Azure CLI version 2.64.0 or newer installed on your cluster machine. Use `az --version` to check your version and `az upgrade` to update if necessary. For more information, see [How to install the Azure CLI](/cli/azure/install-azure-cli).

* The latest version of the **connectedk8s** extension for Azure CLI:

  ```bash
  az extension add --upgrade --name connectedk8s
  ```

* Hardware that meets the system requirements:

  * [Azure IoT Operations supported environments](./overview-deploy.md#supported-environments).
  * [Azure Arc-enabled Kubernetes system requirements](/azure/azure-arc/kubernetes/system-requirements).
  * [K3s requirements](https://docs.k3s.io/installation/requirements).

* If you're going to deploy Azure IoT Operations to a multi-node cluster with fault tolerance enabled, review the hardware and storage requirements in [Prepare Linux for Edge Volumes](/azure/azure-arc/container-storage/prepare-linux-edge-volumes).

### [AKS Edge Essentials](#tab/aks-edge-essentials)

To prepare an Azure Arc-enabled Kubernetes cluster, you need:

* An Azure subscription. If you don't have an Azure subscription, [create one for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

* Hardware that meets the system requirements:

  * [Azure IoT Operations supported environments](./overview-deploy.md#supported-environments).
  * [Azure Arc-enabled Kubernetes system requirements](/azure/azure-arc/kubernetes/system-requirements).
  * [AKS Edge Essentials requirements and support matrix](/azure/aks/hybrid/aks-edge-system-requirements).
  * [AKS Edge Essentials networking guidance](/azure/aks/hybrid/aks-edge-concept-networking).

### [AKS on Azure Local](#tab/azure-local)

To prepare an Azure Arc-enabled Kubernetes cluster, you need:

* An Azure subscription. If you don't have an Azure subscription, [create one for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

* An [Azure Local server or cluster](/azure-stack/hci/overview).

* Hardware that meets the system requirements:

  * [Azure IoT Operations supported environments](./overview-deploy.md#supported-environments).
  * [Azure Arc-enabled Kubernetes system requirements](/azure/azure-arc/kubernetes/system-requirements).

---

## Create and Arc-enable a cluster

This section provides steps to create clusters in validated environments on Linux and Windows.

### [Ubuntu](#tab/ubuntu)

To prepare a K3s Kubernetes cluster on Ubuntu:

1. Create a single-node or multi-node K3s cluster. For examples, see the [K3s quick-start guide](https://docs.k3s.io/quick-start) or [K3s related projects](https://docs.k3s.io/related-projects).

1. Check to see that kubectl was installed as part of K3s. If not, follow the instructions to [Install kubectl on Linux](https://kubernetes.io/docs/tasks/tools/install-kubectl-linux/).

   ```bash
   kubectl version --client
   ```

1. Follow the instructions to [Install Helm](https://helm.sh/docs/intro/install/).

1. Create a K3s configuration yaml file in `.kube/config`:

   ```bash
   mkdir ~/.kube
   sudo KUBECONFIG=~/.kube/config:/etc/rancher/k3s/k3s.yaml kubectl config view --flatten > ~/.kube/merged
   mv ~/.kube/merged ~/.kube/config
   chmod  0600 ~/.kube/config
   export KUBECONFIG=~/.kube/config
   #switch to k3s context
   kubectl config use-context default
   sudo chmod 644 /etc/rancher/k3s/k3s.yaml
   ```

1. Run the following command to increase the [user watch/instance limits](https://www.suse.com/support/kb/doc/?id=000020048).

   ```bash
   echo fs.inotify.max_user_instances=8192 | sudo tee -a /etc/sysctl.conf
   echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf

   sudo sysctl -p
   ```

1. For better performance, increase the file descriptor limit:

   ```bash
   echo fs.file-max = 100000 | sudo tee -a /etc/sysctl.conf

   sudo sysctl -p
   ```

### Arc-enable your cluster

Connect your cluster to Azure Arc so that it can be managed remotely.

1. On the machine where you deployed the Kubernetes cluster, sign into Azure CLI with your Microsoft Entra user account that has the required role(s) for the Azure subscription:

   ```azurecli
   az login
   ```

   If at any point you get an error that says *Your device is required to be managed to access your resource*, run `az login` again and make sure that you sign in interactively with a browser.

1. After you sign in, the Azure CLI displays all of your subscriptions and indicates your default subscription with an asterisk `*`. To continue with your default subscription, select `Enter`. Otherwise, type the number of the Azure subscription that you want to use.

1. Register the required resource providers in your subscription.

   >[!NOTE]
   >This step only needs to be run once per subscription. To register resource providers, you need permission to do the `/register/action` operation, which is included in subscription Contributor and Owner roles. For more information, see [Azure resource providers and types](../../azure-resource-manager/management/resource-providers-and-types.md).

   ```azurecli
   az provider register -n "Microsoft.ExtendedLocation"
   az provider register -n "Microsoft.Kubernetes"
   az provider register -n "Microsoft.KubernetesConfiguration"
   az provider register -n "Microsoft.IoTOperations"
   az provider register -n "Microsoft.DeviceRegistry"
   az provider register -n "Microsoft.SecretSyncController"
   ```

1. Use the [az connectedk8s connect](/cli/azure/connectedk8s#az-connectedk8s-connect) command to Arc-enable your Kubernetes cluster and manage it as part of your Azure resource group.

   ```azurecli
   az connectedk8s connect --name <CLUSTER_NAME> -l <REGION> --resource-group <RESOURCE_GROUP> --subscription <SUBSCRIPTION_ID> --enable-oidc-issuer --enable-workload-identity --disable-auto-upgrade
   ```

   To prevent unplanned updates to Azure Arc and the system Arc extensions that Azure IoT Operations uses as dependencies, this command disables autoupgrade. Instead, [manually upgrade agents](/azure/azure-arc/kubernetes/agent-upgrade#manually-upgrade-agents) as needed.

   >[!IMPORTANT]
   >If your environment uses a proxy server or Azure Arc Gateway, modify the `az connectedk8s connect` command with your proxy information:
   >
   >1. Follow the instructions in either [Connect using an outbound proxy server](/azure/azure-arc/kubernetes/quickstart-connect-cluster#connect-using-an-outbound-proxy-server) or [Onboard Kubernetes clusters to Azure Arc with Azure Arc Gateway](/azure/azure-arc/kubernetes/arc-gateway-simplify-networking#onboard-kubernetes-clusters-to-azure-arc-with-your-arc-gateway-resource).
   >1. Add `169.254.169.254` to the `--proxy-skip-range` parameter of the `az connectedk8s connect` command. [Azure Device Registry](../discover-manage-assets/overview-manage-assets.md#store-assets-as-azure-resources-in-a-centralized-registry) uses this local endpoint to get access tokens for authorization.
   >
   >Azure IoT Operations doesn't support proxy servers that require a trusted certificate.

1. Get the cluster's issuer URL.

   ```azurecli
   az connectedk8s show --resource-group <RESOURCE_GROUP> --name <CLUSTER_NAME> --query oidcIssuerProfile.issuerUrl --output tsv
   ```

   Save the output of this command to use in the next steps.

1. Create a k3s config file.

   ```bash
   sudo nano /etc/rancher/k3s/config.yaml
   ```

1. Add the following content to the `config.yaml` file, replacing the `<SERVICE_ACCOUNT_ISSUER>` placeholder with your cluster's issuer URL.

   ```yml
   kube-apiserver-arg:
    - service-account-issuer=<SERVICE_ACCOUNT_ISSUER>
    - service-account-max-token-expiration=24h
   ```

1. Save the file and exit the nano editor.

1. Prepare for enabling the Azure Arc service, custom location, on your Arc cluster by getting the custom location object ID and saving it as the environment variable, OBJECT_ID. You must be logged into Azure CLI with a Microsoft Entra user account to successfully run the command, not a service principal. Run the following command **exactly as written**, without changing the GUID value. 

   ```azurecli
   export OBJECT_ID=$(az ad sp show --id bc313c14-388c-4e7d-a58e-70017303ee3b --query id -o tsv)
   ```

> [!NOTE]
>If you receive the error: "Unable to fetch oid of 'custom-locations' app. Proceeding without enabling the feature. Insufficient privileges to complete the operation" then you may be using a service principal that lacks the necessary permissions to retrieve the object ID of the custom location. Log into Azure CLI with a Microsoft Entra user account that meets the prerequisites. Refer to: https://aka.ms/enable-cl-sp

1. Use the [az connectedk8s enable-features](/cli/azure/connectedk8s#az-connectedk8s-enable-features) command to enable the custom location feature on your Arc cluster. This command uses the OBJECT_ID environment variable saved from the previous step to set the value for the custom-locations-oid parameter. Run this command on the machine where you deployed the Kubernetes cluster: 

   ```azurecli
   az connectedk8s enable-features -n <CLUSTER_NAME> -g <RESOURCE_GROUP> --custom-locations-oid $OBJECT_ID --features cluster-connect custom-locations
   ```

1. Restart K3s.

   ```bash
   systemctl restart k3s
   ```

### Configure multi-node clusters for Azure Container Storage

On multi-node clusters with at least three nodes, you have the option of enabling fault tolerance for storage with [Azure Container Storage enabled by Azure Arc](/azure/azure-arc/container-storage/overview) when you deploy Azure IoT Operations. 

If you want to enable fault tolerance during deployment, configure your clusters by following the steps in [Prepare Linux for Edge Volumes using a multi-node Ubuntu cluster](/azure/azure-arc/container-storage/multi-node-cluster-edge-volumes?pivots=ubuntu).

### [AKS Edge Essentials](#tab/aks-edge-essentials)

[Azure Kubernetes Service Edge Essentials](/azure/aks/hybrid/aks-edge-overview) is an on-premises Kubernetes implementation of Azure Kubernetes Service (AKS) that automates running containerized applications at scale. AKS Edge Essentials includes a Microsoft-supported Kubernetes platform that includes a lightweight Kubernetes distribution with a small footprint and simple installation experience that supports PC-class or "light" edge hardware.

The [AksEdgeQuickStartForAio.ps1](https://github.com/Azure/AKS-Edge/blob/main/tools/scripts/AksEdgeQuickStart/AksEdgeQuickStartForAio.ps1) script automates the process of creating and connecting a cluster, and is the recommended path for deploying Azure IoT Operations on AKS Edge Essentials.

For instructions on running the script, see [Configure an AKS Edge Essentials cluster for Azure IoT Operations](/azure/aks/hybrid/aks-edge-howto-deploy-azure-iot).

### [AKS on Azure Local](#tab/azure-local)

* For instructions to create and Arc-enable an AKS cluster on Azure Local, see [Create Kubernetes clusters using Azure CLI](/azure/aks/hybrid/aks-create-clusters-cli).
* For instructions to deploy an AKS cluster on Azure Local with workload identity (preview) enabled for enhanced security, see [Deploy and configure workload identity on an AKS cluster](/azure/aks/aksarc/workload-identity). The workload identity feature can be enabled only during cluster creation. Running Azure IoT Operations with secure settings requires workload identity.

By default, a Kubernetes cluster is created with a node pool that can run Linux containers. If you add more node pools after creation, make sure the OS is set to Linux. Azure IoT Operations doesn't support deployment to Windows nodes.

Then, once you have an Azure Arc-enabled Kubernetes cluster, you can [deploy Azure IoT Operations](howto-deploy-iot-operations.md).

---

## Advanced configuration

At this point, when you have an Azure Arc-enabled Kubernetes cluster but before you deploy Azure IoT Operations to it, you might want to configure your cluster for advanced scenarios.

* If you want to enable observability features on the cluster, follow the steps in [Deploy observability resources and set up logs](../configure-observability-monitoring/howto-configure-observability.md).
* If you want to configure your own certificate issuer on the cluster, follow the steps in [Certificate management > Bring your own issuer](../secure-iot-ops/concept-default-root-ca.md#bring-your-own-issuer).

## Next steps

Now that you have an Azure Arc-enabled Kubernetes cluster, you can [deploy Azure IoT Operations](howto-deploy-iot-operations.md).

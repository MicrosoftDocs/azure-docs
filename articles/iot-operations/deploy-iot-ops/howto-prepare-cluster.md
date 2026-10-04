---
title: Prepare a cluster for Azure IoT Operations
description: Prepare an Azure Arc-enabled Kubernetes cluster before you deploy Azure IoT Operations, with guidance for Ubuntu, Windows, Azure Local, VKS, and OpenShift.
author: dominicbetts
ms.author: dobett
ms.service: azure-iot-operations
ms.topic: how-to
ms.custom: ignite-2023, devx-track-azurecli
ms.date: 09/24/2026
ai-usage: ai-assisted

#CustomerIntent: As an IT professional, I want to prepare an Azure Arc-enabled Kubernetes cluster so that I can deploy Azure IoT Operations to it.
---

# Prepare a cluster for Azure IoT Operations

You need an Azure Arc-enabled Kubernetes cluster to deploy Azure IoT Operations. This article explains how to prepare that cluster, with guidance for Ubuntu, Windows, Azure Local, vSphere Kubernetes Service (VKS), and Red Hat OpenShift Container Platform (OpenShift).

If you want to deploy Azure IoT Operations quickly and run a sample workload in a test environment, see the [Quickstart: Run Azure IoT Operations in GitHub Codespaces with K3s](../get-started-end-to-end-sample/quickstart-deploy.md).

## Prerequisites

For multi-node deployments, use K3s on Ubuntu, AKS on Azure Local, vSphere Kubernetes Service (VKS), or OpenShift. AKS Edge Essentials on Windows supports single-node deployments only.

### [Ubuntu](#tab/ubuntu)

To prepare an Azure Arc-enabled Kubernetes cluster, you need:

[!INCLUDE [Cluster prerequisites for Ubuntu and VKS](../includes/cluster-prerequisites.md)]

- Hardware that meets the system requirements:

  * [Azure IoT Operations supported environments](./overview-deploy.md#supported-environments).
  * [Azure Arc-enabled Kubernetes system requirements](/azure/azure-arc/kubernetes/system-requirements).
  * [K3s requirements](https://docs.k3s.io/installation/requirements).

- If you're going to deploy Azure IoT Operations to a multi-node cluster with fault tolerance enabled, review the hardware and storage requirements in [Prepare Linux for Edge Volumes](/azure/azure-arc/container-storage/howto-prepare-linux-edge-volumes).

### [AKS Edge Essentials](#tab/aks-edge-essentials)

To prepare an Azure Arc-enabled Kubernetes cluster, you need:

[!INCLUDE [prereq-azure-subscription](../includes/prereq-azure-subscription.md)]

- Hardware that meets the system requirements:

  * [Azure IoT Operations supported environments](./overview-deploy.md#supported-environments).
  * [Azure Arc-enabled Kubernetes system requirements](/azure/azure-arc/kubernetes/system-requirements).
  * [AKS Edge Essentials requirements and support matrix](/azure/aks-hybrid-edge/edge-essentials/aks-edge-system-requirements).
  * [AKS Edge Essentials networking guidance](/azure/aks-hybrid-edge/edge-essentials/aks-edge-concept-networking).

### [AKS on Azure Local](#tab/azure-local)

To prepare an Azure Arc-enabled Kubernetes cluster, you need:

[!INCLUDE [prereq-azure-subscription](../includes/prereq-azure-subscription.md)]

- An [Azure Local server or cluster](/azure-stack/hci/overview).

- Hardware that meets the system requirements:

  * [Azure IoT Operations supported environments](./overview-deploy.md#supported-environments).
  * [Azure Arc-enabled Kubernetes system requirements](/azure/azure-arc/kubernetes/system-requirements).
    
### [vSphere Kubernetes Service](#tab/vks)

To prepare a vSphere Kubernetes Service (VKS) workload cluster, you need:

[!INCLUDE [Cluster prerequisites for Ubuntu and VKS](../includes/cluster-prerequisites.md)]

- [Using the vSphere Kubernetes Service](https://techdocs.broadcom.com/us/en/vmware-cis/vcf/vcf-service-administration-and-development/9-0/managing-vsphere-kubernetes-service/installing-and-upgrading-the-tkg-service/using-the-tkg-serivce.html).

- Hardware that meets the system requirements:

  - [Azure IoT Operations supported environments](./overview-deploy.md#supported-environments).
  - [Azure Arc-enabled Kubernetes system requirements](/azure/azure-arc/kubernetes/system-requirements).

### [OpenShift](#tab/openshift)

To prepare an Azure Arc-enabled OpenShift cluster, you need:

[!INCLUDE [Cluster prerequisites for Ubuntu and VKS](../includes/cluster-prerequisites.md)]

- A Red Hat OpenShift cluster, version 4.20 or later.

- The [OpenShift CLI (`oc`)](https://docs.openshift.com/container-platform/latest/cli_reference/openshift_cli/getting-started-cli.html) installed on your development machine, signed in to your cluster with an account that has the `cluster-admin` role. Granting security context constraints requires `cluster-admin`.

- Hardware that meets the system requirements:
  - [Azure IoT Operations supported environments](./overview-deploy.md#supported-environments).
  - [Azure Arc-enabled Kubernetes system requirements](/azure/azure-arc/kubernetes/system-requirements).

---

[!INCLUDE [set-environment-variables](../includes/set-environment-variables.md)]

## Create and Arc-enable a cluster

This section provides steps to create clusters in validated environments on Ubuntu, Windows, Azure Local, vSphere Kubernetes Service (VKS), and OpenShift.

### [Ubuntu](#tab/ubuntu)

To prepare a K3s Kubernetes cluster on Ubuntu:

1. Create a single-node or multi-node K3s cluster. For examples, see the [K3s quick-start guide](https://docs.k3s.io/quick-start) or [K3s related projects](https://docs.k3s.io/related-projects).

1. Check that K3s installed `kubectl`. If not, follow the instructions to [Install kubectl on Linux](https://kubernetes.io/docs/tasks/tools/install-kubectl-linux/).

   ```bash
   kubectl version --client
   ```

1. Follow the instructions to [Install Helm](https://helm.sh/docs/intro/install/).

1. Create a K3s configuration YAML file in `.kube/config`:

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

### Arc-enable your K3s cluster

Connect your cluster to Azure Arc so that you can manage it remotely.

1. From a machine that has `kubectl` access to your cluster, sign in to Azure CLI with your Microsoft Entra user account that has the required roles for the Azure subscription:

   ```azurecli
   az login
   ```

   If at any point you get an error that says *Your device is required to be managed to access your resource*, run `az login` again and make sure that you sign in interactively by using a browser.

1. After you sign in, the Azure CLI shows all of your subscriptions and indicates your default subscription with an asterisk `*`. To continue with your default subscription, select `Enter`. Otherwise, type the number of the Azure subscription that you want to use.

1. Register the required resource providers in your subscription.

   > [!NOTE]
   > You need to run this step only once per subscription. To register resource providers, you need permission to do the `/register/action` operation, which subscription Contributor and Owner roles include. For more information, see [Azure resource providers and types](../../azure-resource-manager/management/resource-providers-and-types.md).

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
   az connectedk8s connect --name $CLUSTER_NAME -l $LOCATION --resource-group $RESOURCE_GROUP --subscription $SUBSCRIPTION_ID --enable-oidc-issuer --enable-workload-identity --disable-auto-upgrade
   ```

   To prevent unplanned updates to Azure Arc and the system Arc extensions that Azure IoT Operations uses as dependencies, this command disables autoupgrade. Instead, [manually upgrade agents](/azure/azure-arc/kubernetes/agent-upgrade#manually-upgrade-agents) as needed.

   > [!IMPORTANT]
   > If your environment uses a proxy server or Azure Arc Gateway, modify the `az connectedk8s connect` command with your proxy information:
   >
   > 1. Follow the instructions in either [Connect using an outbound proxy server](/azure/azure-arc/kubernetes/quickstart-connect-cluster#connect-using-an-outbound-proxy-server) or [Onboard Kubernetes clusters to Azure Arc with Azure Arc Gateway](/azure/azure-arc/kubernetes/arc-gateway-simplify-networking#onboard-kubernetes-clusters-to-azure-arc-with-your-arc-gateway-resource).
   > 1. Add `169.254.169.254` to the `--proxy-skip-range` parameter of the `az connectedk8s connect` command. [Azure Device Registry](../discover-manage-assets/overview-manage-assets.md#azure-device-registry) uses this local endpoint to get access tokens for authorization.
   >
   > Azure IoT Operations doesn't support proxy servers that require a trusted certificate.

1. Get the cluster's issuer URL.

   ```azurecli
   az connectedk8s show --resource-group $RESOURCE_GROUP --name $CLUSTER_NAME --query oidcIssuerProfile.issuerUrl --output tsv
   ```

   Save the output of this command to use in the next steps.

1. Create a K3s config file.

   ```bash
   sudo nano /etc/rancher/k3s/config.yaml
   ```

1. Add the following content to the `config.yaml` file, replacing the `<SERVICE_ACCOUNT_ISSUER>` placeholder with your cluster's issuer URL.

   ```yaml
   kube-apiserver-arg:
    - service-account-issuer=<SERVICE_ACCOUNT_ISSUER>
    - service-account-max-token-expiration=24h
   ```

1. Save the file and exit the nano editor.

1. Prepare for enabling the Azure Arc service, custom location, on your Arc cluster by getting the custom location object ID and saving it as the environment variable, OBJECT_ID. You must sign in to Azure CLI with a Microsoft Entra user account, not a service principal, to run the command successfully. Run the following command **exactly as written**, without changing the GUID value. 

   ```azurecli
   export OBJECT_ID=$(az ad sp show --id bc313c14-388c-4e7d-a58e-70017303ee3b --query id -o tsv)
   ```

   > [!NOTE]
   > If you receive the error: "Unable to fetch oid of 'custom-locations' app. Proceeding without enabling the feature. Insufficient privileges to complete the operation," then your service principal might lack the necessary permissions to retrieve the object ID of the custom location. Sign in to Azure CLI with a Microsoft Entra user account that meets the prerequisites. For more information, see [Create and manage custom locations](/azure/azure-arc/kubernetes/custom-locations).

1. Use the [az connectedk8s enable-features](/cli/azure/connectedk8s#az-connectedk8s-enable-features) command to enable the custom location feature on your Arc cluster. This command uses the OBJECT_ID environment variable that you saved in the previous step to set the value for the custom-locations-oid parameter. Run this command on the machine where you deployed the Kubernetes cluster: 

   ```azurecli
   az connectedk8s enable-features -n $CLUSTER_NAME -g $RESOURCE_GROUP --custom-locations-oid $OBJECT_ID --features cluster-connect custom-locations
   ```

1. Restart K3s.

   ```bash
   systemctl restart k3s
   ```

### [AKS Edge Essentials](#tab/aks-edge-essentials)

[Azure Kubernetes Service Edge Essentials](/azure/aks-hybrid-edge/edge-essentials/aks-edge-overview) is an on-premises Kubernetes implementation of Azure Kubernetes Service (AKS) that automates running containerized applications at scale. AKS Edge Essentials includes a Microsoft-supported Kubernetes platform that includes a lightweight Kubernetes distribution with a small footprint and simple installation experience that supports PC-class or "light" edge hardware.

The [AksEdgeQuickStartForAio.ps1](https://github.com/Azure/AKS-Edge/blob/main/tools/scripts/AksEdgeQuickStart/AksEdgeQuickStartForAio.ps1) script automates creating and connecting a cluster, and is the recommended path for deploying Azure IoT Operations on AKS Edge Essentials.

For instructions on running the script, see [Configure an AKS Edge Essentials cluster for Azure IoT Operations](/azure/aks-hybrid-edge/edge-essentials/aks-edge-howto-deploy-azure-iot).

### [AKS on Azure Local](#tab/azure-local)

- For instructions to create and Arc-enable an AKS cluster on Azure Local, see [Create Kubernetes clusters using Azure CLI](/azure/aks-hybrid-edge/local/aks-create-clusters-cli).
- For instructions to deploy an AKS cluster on Azure Local with workload identity (preview) enabled for enhanced security, see [Deploy and configure workload identity on an AKS cluster](/azure/aks/aksarc/workload-identity). You can enable the workload identity feature only during cluster creation. Running Azure IoT Operations with secure settings requires workload identity.

By default, a Kubernetes cluster includes a node pool that can run Linux containers. If you add more node pools after creation, make sure to set the OS to Linux. Azure IoT Operations doesn't support deployment to Windows nodes.

After you have an Azure Arc-enabled Kubernetes cluster, you can [deploy Azure IoT Operations](howto-deploy-iot-operations.md).

### [vSphere Kubernetes Service](#tab/vks)

To prepare a VKS workload cluster, you need a single-node or multi-node VKS workload cluster.

### Update pod security admission settings

Before deploying Azure IoT Operations, update the Pod Security Admission settings on your VKS cluster. Applying this file pre-creates namespace labels and sets pod security to `privileged`.

```azurecli
kubectl apply -f https://raw.githubusercontent.com/Azure-Samples/explore-iot-operations/main/samples/tanzu-config/psa.yaml
```

### Arc-enable your VKS cluster

Connect your cluster to Azure Arc so that you can manage it remotely.

1. On the machine where you deployed the Kubernetes cluster, sign in to Azure CLI with your Microsoft Entra user account that has the required roles for the Azure subscription:

   ```azurecli
   az login
   ```

1. After you sign in, the Azure CLI shows all of your subscriptions and indicates your default subscription with an asterisk `*`. To continue with your default subscription, select `Enter`. Otherwise, type the number of the Azure subscription that you want to use.

1. Register the required resource providers in your subscription.

   > [!NOTE]
   > You need to run this step only once per subscription. To register resource providers, you need permission to do the `/register/action` operation, which subscription Contributor and Owner roles include. For more information, see [Azure resource providers and types](../../azure-resource-manager/management/resource-providers-and-types.md).

   ```azurecli
   az provider register -n "Microsoft.ExtendedLocation"
   az provider register -n "Microsoft.Kubernetes"
   az provider register -n "Microsoft.KubernetesConfiguration"
   az provider register -n "Microsoft.IoTOperations"
   az provider register -n "Microsoft.DeviceRegistry"
   az provider register -n "Microsoft.SecretSyncController"
   ```

1. Use the [az connectedk8s connect](/cli/azure/connectedk8s) command to Arc-enable your Kubernetes cluster and manage it as part of your Azure resource group.

   ```azurecli
   az connectedk8s connect --name $CLUSTER_NAME -l $LOCATION --resource-group $RESOURCE_GROUP --subscription $SUBSCRIPTION_ID --enable-oidc-issuer --enable-workload-identity --disable-auto-upgrade
   ```
   
   To prevent unplanned updates to Azure Arc and the system Arc extensions that Azure IoT Operations uses as dependencies, this command disables autoupgrade. Instead, [manually upgrade agents](/azure/azure-arc/kubernetes/agent-upgrade) as needed. 
   
   > [!IMPORTANT]
   > If your environment uses a proxy server or Azure Arc Gateway, modify the `az connectedk8s connect` command with your proxy information:
   > 
   > 1. Follow the instructions in either [Connect using an outbound proxy server](/azure/azure-arc/kubernetes/quickstart-connect-cluster#connect-using-an-outbound-proxy-server) or [Onboard Kubernetes clusters to Azure Arc with Azure Arc Gateway](/azure/azure-arc/kubernetes/arc-gateway-simplify-networking#onboard-kubernetes-clusters-to-azure-arc-with-your-arc-gateway-resource).
   > 1. Add `169.254.169.254` to the `--proxy-skip-range` parameter of the `az connectedk8s connect` command. [Azure Device Registry](../discover-manage-assets/overview-manage-assets.md#azure-device-registry) uses this local endpoint to get access tokens for authorization.
   > 
   > Azure IoT Operations doesn't support proxy servers that require a trusted certificate.
   
1. Configure workload identity on your VKS cluster. For instructions, see [Deploy and configure workload identity on an AKS cluster](/azure/azure-arc/kubernetes/workload-identity). Running Azure IoT Operations with secure settings requires workload identity.

1. Prepare for enabling the Azure Arc service, custom location, on your Arc cluster by getting the custom location object ID and saving it as the environment variable, OBJECT_ID. You must sign in to Azure CLI with a Microsoft Entra user account, not a service principal, to run the command successfully. Run the following command **exactly as written**, without changing the GUID value. 

   ```azurecli
   export OBJECT_ID=$(az ad sp show --id bc313c14-388c-4e7d-a58e-70017303ee3b --query id -o tsv)
   ```

   > [!NOTE]
   > If you receive the error: "Unable to fetch oid of 'custom-locations' app. Proceeding without enabling the feature. Insufficient privileges to complete the operation," then your service principal might lack the necessary permissions to retrieve the object ID of the custom location. Sign in to Azure CLI with a Microsoft Entra user account that meets the prerequisites. For more information, see [Create and manage custom locations](/azure/azure-arc/kubernetes/custom-locations).

1. Use the [az connectedk8s enable-features](/cli/azure/connectedk8s) command to enable the custom location feature on your Arc cluster. This command uses the OBJECT_ID environment variable saved from the previous step to set the value for the custom-locations-oid parameter. Run this command on the machine where you deployed the Kubernetes cluster:

   ```azurecli
   az connectedk8s enable-features -n $CLUSTER_NAME -g $RESOURCE_GROUP --custom-locations-oid $OBJECT_ID --features cluster-connect custom-locations
   ```

### [OpenShift](#tab/openshift)

To prepare an OpenShift cluster, you need a single-node or multi-node OpenShift cluster, version
4.20 or later.

OpenShift enforces [security context constraints (SCCs)](https://docs.openshift.com/container-platform/latest/authentication/managing-security-context-constraints.html), which control the privileges that pods can request. By default, OpenShift assigns each project a UID range and admits pods under the `restricted-v2` constraint. Some Azure IoT Operations components request fixed user IDs outside that range, so you grant additional constraints before you deploy.

### Grant security context constraints

Before you deploy Azure IoT Operations, grant the security context constraints that its components require. The following command targets the service account group for the namespace, so it applies to every service account that the deployment creates later. You can run it before the namespace exists.

```bash
for scc in anyuid privileged hostnetwork-v2 hostaccess hostmount-anyuid nonroot-v2; do
  oc adm policy add-scc-to-group $scc system:serviceaccounts:azure-iot-operations
done
```

If you skip this step, deployment fails and the affected workloads report an admission error similar to the following:

```output
pods "aio-akri-operator-0" is forbidden: unable to validate against any security context
constraint: provider restricted-v2: .spec.securityContext.fsGroup: Invalid value:
[]int64{65532}: 65532 is not an allowed group
```

### Arc-enable your OpenShift cluster

Connect your cluster to Azure Arc so that you can manage it remotely.

1. Register the required resource providers in your subscription.

   > [!NOTE]
   > You need to run this step only once per subscription. To register resource providers, you need
   > permission to do the `/register/action` operation, which subscription Contributor and Owner
   > roles include. For more information, see [Azure resource providers and types](../../azure-resource-manager/management/resource-providers-and-types.md).

   ```azurecli
   az provider register -n "Microsoft.ExtendedLocation"
   az provider register -n "Microsoft.Kubernetes"
   az provider register -n "Microsoft.KubernetesConfiguration"
   az provider register -n "Microsoft.IoTOperations"
   az provider register -n "Microsoft.DeviceRegistry"
   az provider register -n "Microsoft.SecretSyncController"
   ```

1. Use the [az connectedk8s connect](/cli/azure/connectedk8s#az-connectedk8s-connect) command to Azure Arc-enable your Kubernetes cluster and manage it as part of your Azure resource group.

   ```azurecli
   az connectedk8s connect --name $CLUSTER_NAME -l $LOCATION --resource-group $RESOURCE_GROUP --subscription $SUBSCRIPTION_ID --enable-oidc-issuer --enable-workload-identity --disable-auto-upgrade
   ```

   To prevent unplanned updates to Azure Arc and the system Azure Arc extensions that Azure IoT Operations uses as dependencies, this command disables autoupgrade. Instead,  [manually upgrade agents](/azure/azure-arc/kubernetes/agent-upgrade#manually-upgrade-agents) as needed.

   The Azure Arc agents create the security context constraints that they need, so no extra OpenShift configuration is required for this step.

   > [!IMPORTANT]
   > If your environment uses a proxy server or Azure Arc Gateway, modify the
   > `az connectedk8s connect` command with your proxy information:
   >
   > 1. Follow the instructions in either [Connect using an outbound proxy server](/azure/azure-arc/kubernetes/quickstart-connect-cluster#connect-using-an-outbound-proxy-server) or [Onboard Kubernetes clusters to Azure Arc with Azure Arc Gateway](/azure/azure-arc/kubernetes/arc-gateway-simplify-networking#onboard-kubernetes-clusters-to-azure-arc-with-your-arc-gateway-resource).
   > 1. Add `169.254.169.254` to the `--proxy-skip-range` parameter of the `az connectedk8s connect` command. [Azure Device Registry](../discover-manage-assets/overview-manage-assets.md#azure-device-registry) uses this local endpoint to get access tokens for authorization.
   >
   > Azure IoT Operations doesn't support proxy servers that require a trusted certificate.

1. Get the cluster's issuer URL.

   ```azurecli
   az connectedk8s show --resource-group $RESOURCE_GROUP --name $CLUSTER_NAME --query oidcIssuerProfile.issuerUrl --output tsv
   ```

   Save the output of this command to use in the next step.

1. Configure the cluster to use the Azure Arc issuer as its service account issuer, replacing the `<SERVICE_ACCOUNT_ISSUER>` placeholder with the value from the previous step. Running Azure IoT Operations with secure settings requires workload identity.

   ```bash
   oc patch authentication cluster --type=merge \
     -p '{"spec":{"serviceAccountIssuer":"<SERVICE_ACCOUNT_ISSUER>"}}'
   ```

   Changing the service account issuer causes the `kube-apiserver` and `authentication`  cluster operators to roll out a new revision across the control plane. Wait for both to finish before you continue.

   ```bash
   oc wait --for=condition=Progressing=False --timeout=30m clusteroperator/kube-apiserver
   oc wait --for=condition=Progressing=False --timeout=30m clusteroperator/authentication
   ```

1. Prepare for enabling the Azure Arc service, custom location, on your Azure Arc cluster by getting the custom location object ID and saving it as the environment variable, OBJECT_ID. You must sign in to Azure CLI with a Microsoft Entra user account, not a service principal, to run the command successfully. Run the following command **exactly as written**, without changing the GUID value. 

   ```azurecli
   export OBJECT_ID=$(az ad sp show --id bc313c14-388c-4e7d-a58e-70017303ee3b --query id -o tsv)
   ```

   > [!NOTE]
   > If you receive the error: "Unable to fetch oid of 'custom-locations' app. Proceeding without enabling the feature. Insufficient privileges to complete the  operation," then your service principal might lack the necessary permissions to retrieve the object ID of the custom location. Sign in to Azure CLI with a Microsoft Entra user  account that meets the prerequisites. For more information, see [Create and manage  custom locations](/azure/azure-arc/kubernetes/custom-locations).

   > [!IMPORTANT]
   > Run this lookup while signed in to the same Microsoft Entra tenant that contains your Azure Arc resources. The object ID of the Custom Locations application is different in each tenant. Using an object ID from another tenant appears to succeed, but Azure IoT Operations deployment later fails with `"Microsoft.ExtendedLocation" resource provider does not have the required permissions to create a namespace on the cluster`.

1. Use the [az connectedk8s enable-features](/cli/azure/connectedk8s#az-connectedk8s-enable-features) command to enable the custom location feature on your Azure Arc cluster. This command uses the `OBJECT_ID` environment variable that you saved in the previous step to set the value for the `custom-locations-oid` parameter.

   ```azurecli
   az connectedk8s enable-features -n $CLUSTER_NAME -g $RESOURCE_GROUP --custom-locations-oid $OBJECT_ID --features cluster-connect custom-locations
   ```

### Deployment options required on OpenShift

When you deploy Azure IoT Operations to this cluster, include the following options.

- Disable cert-manager telemetry:

  ```azurecli
  az iot ops init --cluster $CLUSTER_NAME --resource-group $RESOURCE_GROUP --cm-config global.telemetry.enabled=false
  ```

  The cert-manager extension otherwise adds a diagnostics sidecar whose image is referenced by digest. The CRI-O container runtime that OpenShift uses can't pull an  image referenced by a digest that resolves to a multi-architecture manifest list, so the sidecar fails with `ImagePullBackOff` and cert-manager never becomes healthy.

- Disable the connector security context:

  ```azurecli
  az iot ops create --cluster $CLUSTER_NAME --resource-group $RESOURCE_GROUP --name <instance-name> --sr-resource-id <schema-registry-id> --ns-resource-id <namespace-id> --ops-config connectors.values.setSecurityContext=false
  ```

  The connector supervisor otherwise runs under an arbitrary UID assigned by OpenShift and can't read its own application files, so the connectors Helm release times out and the deployment is rolled back.

  > [!NOTE]
  > This option makes the connector pods run under the `anyuid` security context constraint rather than the OpenShift default. It's required today because the connector  image isn't readable by an arbitrary UID. All other Azure IoT Operations pods run under a more restrictive constraint.

---

## Configure Azure Container Storage enabled by Azure Arc

Features such as data flow local storage endpoints and the media connector optionally use [Azure Container Storage enabled by Azure Arc (ACSA)](/azure/azure-arc/container-storage/overview) to synchronize local data to the cloud. ACSA isn't installed as part of Azure IoT Operations, so you must install it separately.

To learn how to install ACSA on your Kubernetes cluster:

- Review [What is Azure Container Storage enabled by Azure Arc](/azure/azure-arc/container-storage/overview).
- Review [Prepare Linux for Edge Volumes](/azure/azure-arc/container-storage/howto-prepare-linux-edge-volumes).
- Follow the steps in [Install Azure Container Storage enabled by Azure Arc Edge Volumes](/azure/azure-arc/container-storage/howto-install-edge-volumes).

## Next steps

Now that you have an Azure Arc-enabled Kubernetes cluster, you can deploy Azure IoT Operations.

- [Bring your own issuer](howto-bring-your-own-issuer.md): If you want to configure your own certificate issuer on the cluster before deploying Azure IoT Operations.
- [Deploy to a test cluster](howto-deploy-iot-test-operations.md): For quick evaluation and testing before deploying in production.
- [Deploy to a production cluster](howto-deploy-iot-operations.md): For production-ready workloads with secure settings.

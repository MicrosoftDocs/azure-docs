---
title: Create an experiment that uses an AKS Chaos Mesh fault using Azure Chaos Studio with the Azure portal
description: Create an experiment that uses an AKS Chaos Mesh fault with the Azure portal
author: prasha-microsoft 
ms.topic: how-to
ms.date: 04/21/2022
ms.author: prashabora
ms.service: chaos-studio
ms.custom: template-how-to, ignite-fall-2021
---

# Create a chaos experiment that uses a Chaos Mesh fault to kill AKS pods with the Azure portal

You can use a chaos experiment to verify that your application is resilient to failures by causing those failures in a controlled environment. In this guide, you will cause periodic Azure Kubernetes Service pod failures on a namespace using a chaos experiment and Azure Chaos Studio. Running this experiment can help you defend against service unavailability when there are sporadic failures.

Azure Chaos Studio uses [Chaos Mesh](https://chaos-mesh.org/), a free, open-source chaos engineering platform for Kubernetes to inject faults into an AKS cluster. Chaos Mesh faults are [service-direct](chaos-studio-tutorial-aks-portal.md) faults that require Chaos Mesh to be installed on the AKS cluster. These same steps can be used to set up and run an experiment for any AKS Chaos Mesh fault.

## Prerequisites

- An Azure subscription. [!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)] 
- An AKS cluster with a Linux node pool. If you do not have an AKS cluster, see the AKS quickstart [using the Azure CLI](../aks/learn/quick-kubernetes-deploy-cli.md), [using Azure PowerShell](../aks/learn/quick-kubernetes-deploy-powershell.md), or [using the Azure portal](../aks/learn/quick-kubernetes-deploy-portal.md).

> [!WARNING]
> AKS Chaos Mesh faults are only supported on Linux node pools.

## Limitations

- Previously, Chaos Mesh faults didn't work with private clusters. You can now use Chaos Mesh faults with private clusters by configuring [VNet Injection in Chaos Studio](chaos-studio-private-networking.md).

## Set up Chaos Mesh on your AKS cluster

Before you can run Chaos Mesh faults in Chaos Studio, you need to install Chaos Mesh on your AKS cluster.

1. Run the following commands in an [Azure Cloud Shell](../cloud-shell/overview.md) window where you have the active subscription set to be the subscription where your AKS cluster is deployed. Replace `$RESOURCE_GROUP` and `$CLUSTER_NAME` with the resource group and name of your cluster resource.

```azurecli
az aks get-credentials -g $RESOURCE_GROUP -n $CLUSTER_NAME
```

```bash
helm repo add chaos-mesh https://charts.chaos-mesh.org
helm repo update
kubectl create ns chaos-testing
helm install chaos-mesh chaos-mesh/chaos-mesh --namespace=chaos-testing --set chaosDaemon.runtime=containerd --set chaosDaemon.socketPath=/run/containerd/containerd.sock
```

2. Verify that the Chaos Mesh pods are installed by running the following command:

```bash
kubectl get po -n chaos-testing
```

You should see output similar to the following (a chaos-controller-manager and one or more chaos-daemons):

```bash
NAME                                        READY   STATUS    RESTARTS   AGE
chaos-controller-manager-69fd5c46c8-xlqpc   1/1     Running   0          2d5h
chaos-daemon-jb8xh                          1/1     Running   0          2d5h
chaos-dashboard-98c4c5f97-tx5ds             1/1     Running   0          2d5h
```

You can also [use the installation instructions on the Chaos Mesh website](https://chaos-mesh.org/docs/production-installation-using-helm/).


## Enable Chaos Studio on your AKS cluster

Chaos Studio cannot inject faults against a resource unless that resource has been onboarded to Chaos Studio first. You onboard a resource to Chaos Studio by creating a [target and capabilities](chaos-studio-targets-capabilities.md) on the resource. AKS clusters only have one target type (service-direct), but other resources may have up to two target types - one for service-direct faults and one for agent-based faults. Each type of Chaos Mesh fault is represented as a capability (PodChaos, NetworkChaos, IOChaos, etc.).

1. Open the [Azure portal](https://portal.azure.com).
2. Search for **Chaos Studio (preview)** in the search bar.
3. Click on **Targets** and navigate to your AKS cluster.
![Targets view in the Azure portal](images/tutorial-aks-targets.png)
4. Check the box next to your AKS cluster and click **Enable targets** then **Enable service-direct targets** from the dropdown menu.
![Enabling targets in the Azure portal](images/tutorial-aks-targets-enable.png)
5. A notification will appear indicating that the resource(s) selected were successfully enabled.
![Notification showing target successfully enabled](images/tutorial-aks-targets-enable-confirm.png)

You have now successfully onboarded your AKS cluster to Chaos Studio. In the **Targets** view you can also manage the capabilities enabled on this resource. Clicking the **Manage actions** link next to a resource will display the capabilities enabled for that resource.

## Create an experiment
With your AKS cluster now onboarded, you can create your experiment. A chaos experiment defines the actions you want to take against target resources, organized into steps, which run sequentially, and branches, which run in parallel.

1. Click on the **Experiments** tab in the Chaos Studio navigation. In this view, you can see and manage all of your chaos experiments. Click on **Add an experiment**
![Experiments view in the Azure portal](images/tutorial-aks-add.png)
2. Fill in the **Subscription**, **Resource Group**, and **Location** where you want to deploy the chaos experiment. Give your experiment a **Name**. Click **Next : Experiment designer >**
![Adding basic experiment details](images/tutorial-aks-add-basics.png)
3. You are now in the Chaos Studio experiment designer. The experiment designer allows you to build your experiment by adding steps, branches, and faults. Give a friendly name to your **Step** and **Branch**, then click **Add fault**.
![Experiment designer](images/tutorial-aks-add-designer.png)
4. Select **AKS Chaos Mesh Pod Chaos** from the dropdown, then fill in the **Duration** with the number of minutes you want the failure to last and **jsonSpec** with the information below:

    To formulate your Chaos Mesh jsonSpec:
    1. Visit the Chaos Mesh documentation for a fault type, [for example, the PodChaos type](https://chaos-mesh.org/docs/simulate-pod-chaos-on-kubernetes/#create-experiments-using-yaml-configuration-files).
    2. Formulate the YAML configuration for that fault type using the Chaos Mesh documentation.

        ```yaml
        apiVersion: chaos-mesh.org/v1alpha1
        kind: PodChaos
        metadata:
          name: pod-failure-example
          namespace: chaos-testing
        spec:
          action: pod-failure
          mode: all
          duration: '600s'
          selector:
            namespaces:
              - default
        ```
    3. Remove any YAML outside of the `spec` (including the spec property name), and remove the indentation of the spec details.

        ```yaml
        action: pod-failure
        mode: all
        duration: '600s'
        selector:
          namespaces:
            - default
        ```
    4. Use a [YAML-to-JSON converter like this one](https://www.convertjson.com/yaml-to-json.htm) to convert the Chaos Mesh YAML to JSON and minimize it.

        ```json
        {"action":"pod-failure","mode":"all","duration":"600s","selector":{"namespaces":["default"]}}
        ```
    5. Paste the minimized JSON into the **jsonSpec** field in the portal.


Click **Next: Target resources >**
![Fault properties](images/tutorial-aks-add-fault.png)
5. Select your AKS cluster, and click **Next**
![Add a target](images/tutorial-aks-add-targets.png)
6. Verify that your experiment looks correct, then click **Review + create**, then **Create.**
![Review and create experiment](images/tutorial-aks-add-review.png)

## Give experiment permission to your AKS cluster
When you create a chaos experiment, Chaos Studio creates a system-assigned managed identity that executes faults against your target resources. This identity must be given [appropriate permissions](chaos-studio-fault-providers.md) to the target resource for the experiment to run successfully.

1. Navigate to your AKS cluster and click on **Access control (IAM)**.
![AKS overview page](images/tutorial-aks-access-resource.png)
2. Click **Add** then click **Add role assignment**.
![Access control overview](images/tutorial-aks-access-iam.png)
3. Search for **Azure Kubernetes Service Cluster Admin Role** and select the role. Click **Next**
![Assigning AKS Cluster Admin role](images/tutorial-aks-access-role.png)
4. Click **Select members** and search for your experiment name. Select your experiment and click **Select**. If there are multiple experiments in the same tenant with the same name, your experiment name will be truncated with random characters added.
![Adding experiment to role](images/tutorial-aks-access-experiment.png)
5. Click **Review + assign** then **Review + assign**.

## Run your experiment
You are now ready to run your experiment. To see the impact, we recommend opening your AKS cluster overview and going to **Insights** in a separate browser tab. Live data for the **Active Pod Count** will show the impact of running your experiment.

1. In the **Experiments** view, click on your experiment, and click **Start**, then click **OK**.
![Starting an experiment](images/tutorial-aks-start.png)
2. When the **Status** changes to **Running**, click **Details** for the latest run under **History** to see details for the running experiment.

## Next steps
Now that you have run an AKS Chaos Mesh service-direct experiment, you are ready to:
- [Create an experiment that uses agent-based faults](chaos-studio-tutorial-agent-based-portal.md)
- [Manage your experiment](chaos-studio-run-experiment.md)

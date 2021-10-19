---
title: Create an experiment that uses an AKS Chaos Mesh fault with Azure Chaos Studio
description: Create an experiment that uses an AKS Chaos Mesh fault
author: johnkemnetz
ms.topic: how-to
ms.date: 10/15/2021
ms.author: johnkem
ms.service: chaos-studio
ms.custom: template-how-to
---

# Create a chaos experiment that uses a Chaos Mesh fault to kill AKS pods

You can use a chaos experiment to verify that your application is resilient to failures by causing those failures in a controlled environment. In this guide, you will cause periodic Azure Kubernetes Service pod failures on a namespace using a chaos experiment and Azure Chaos Studio. Running this experiment can help you defend against service unavailability when there are sporadic failures.

Azure Chaos Studio leverages [Chaos Mesh](https://chaos-mesh.org/), a free, open-source chaos engineering platform for Kubernetes to inject faults into an AKS cluster. Chaos Mesh faults are [service-direct](chaos-studio-tutorial-aks.md) faults that require Chaos Mesh to be installed on the AKS cluster. These same steps can be used to set up and run an experiment for any AKS Chaos Mesh fault.

## Prerequisites

- An Azure subscription. [!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)] 
- An AKS cluster. If you do not have an AKS cluster, you can [follow these steps to create one](../aks/kubernetes-walkthrough-portal.md).

## Set up Chaos Mesh on your AKS cluster

Before you can run Chaos Mesh faults in Chaos Studio you need to install Chaos Mesh on your AKS cluster.

1. Run the following commands in an [Azure Cloud Shell](../cloud-shell/overview.md) window where you have the active subscription set to be the subscription where your AKS cluster is deployed. Replace `$RESOURCE_GROUP` and `$CLUSTER_NAME` with the resource group and name of your cluster resource.

```bash
az aks get-credentials -g $RESOURCE_GROUP -n $CLUSTER_NAME
helm repo add chaos-mesh https://charts.chaos-mesh.org
helm repo update
kubectl create ns chaos-testing
helm install chaos-mesh chaos-mesh/chaos-mesh --namespace=chaos-testing --version 2.0.3 --set chaosDaemon.runtime=containerd --set chaosDaemon.socketPath=/run/containerd/containerd.sock
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
          mode: one
          duration: '30s'
          selector:
            namespaces:
              - default
        ```
    3. Remove any YAML outside of the `spec` (including the spec property name), and remove the indentation of the spec details.

        ```yaml
        action: pod-failure
        mode: one
        duration: '30s'
        selector:
          namespaces:
            - default
        ```
    4. Use a [YAML-to-JSON converter like this one](https://www.convertjson.com/yaml-to-json.htm) to convert the Chaos Mesh YAML to JSON and minimize it.

        ```json
        {"action":"pod-failure","mode":"one","duration":"30s","selector":{"namespaces":["default"]}}
        ```
    5. Paste the minimized JSON into the **json** field in the portal.




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
- [Create an experiment that uses agent-based faults](chaos-studio-tutorial-agent-based.md)
- [Manage your experiment](chaos-studio-run-experiment.md)

































## Setup fault targets

To setup an AKS Chaos Mesh fault you need to create a provider configuration for AKS clusters. You can only have one provider configuration per type (in this case, ChaosMeshAKSChaos is the type) and you only need one provider configuration for all clusters in the subscription. A provider configuration must be created via REST API. In this example we use the `az rest` command to execute the REST API calls.

1. Save the following JSON as a file in the same location where you are running the Azure CLI (in Cloud Shell, you can drag-and-drop the JSON file to upload it).

    ```json
    {
      "properties": {
        "enabled": true,
        "providerConfiguration": {
          "type": "ChaosMeshAKSChaos"
        }
      }
    }
    ```

2. Create the provider configuration using the REST API. Replace `$SUBSCRIPTION_ID` with the subscription ID of the subscription where your target resources are deployed. Replace `providerConfig.json` with the name of the JSON file you created in the previous step.

    ```bash
    az rest --method put --url "https://management.azure.com/subscriptions/$SUBSCRIPTION_ID/providers/Microsoft.Chaos/chaosProviderConfigurations/ChaosMeshAKSChaos?api-version=2021-06-21-preview" --body @providerConfig.json
    ```

3. When complete, we recommend validating that the clusters in your subscription were successfully onboarded. Run the following command, replacing `$SUBSCRIPTION_ID` with the subscription ID where you created the provider configuration. This returns a JSON object with an array of all onboarded clusters and their status.

    ```bash
    az rest --method get --url "https://management.azure.com/subscriptions/$SUBSCRIPTION_ID/providers/Microsoft.Chaos/chaosTargets?api-version=2021-06-21-preview&chaosProviderType=ChaosMeshAKSChaos"
    ```

You are now ready to perform Chaos Mesh faults on your AKS clusters.

## Create a chaos experiment

### Use the Azure portal
The Azure portal is the easiest way to create and manage experiments. Follow the instructions below to create an experiment using the portal.

1. Open the Azure portal with the Chaos Studio feature flag:
    * If using an @microsoft.com account, [click this link](https://ms.portal.azure.com/?microsoft_azure_chaos_assettypeoptions={%22chaosStudio%22:{%22options%22:%22%22},%22chaosExperiment%22:{%22options%22:%22%22}}&microsoft_azure_chaos=true).
    * If using an external account, [click this link](https://portal.azure.com/?feature.customPortal=false&microsoft_azure_chaos_assettypeoptions={%22chaosStudio%22:{%22options%22:%22%22},%22chaosExperiment%22:{%22options%22:%22%22}}).

2. In the Search bar at the top of the page, search for "Chaos Experiments" and select the service.

    ![Search for Chaos Experiments in the portal](images/create-exp-service-search.png)

3. Click **Add an experiment**.

    ![Add an experiment in the portal](images/create-exp-service-add.png)

4. Fill in the subscription, resource group, and region where you want the experiment to be stored and give the experiment a name. Then click **Next : Experiment designer**.

    ![Experiment basics in the portal](images/create-exp-service-basics.png)

5. You are now in the Experiment Designer. By default, you see one step with one branch and no actions. Steps execute sequentially, branches execute in parallel within a step, and actions execute sequentially within a branch. The next step only begins once all actions in all branches in the previous step complete and actions within a branch only starts once the previous action has completed. Optionally, give your step and branch friendly names, then click **Add fault** to add a fault to your first branch.

    ![Experiment designer](images/create-exp-service-add-fault.png)

6. In the page that appears, select **AKS Chaos Mesh Pod Faults** fault from the fault dropdown and fill in the **Duration** and **Spec** properties. Descriptions and parameters for each fault are available in the [Fault Library](chaos-studio-fault-library.md). Click **Next : Target resources**.

    To formulate the **Spec** property:
    1. Visit the Chaos Mesh 1.1.4 documentation for a fault type, [e.g. the PodChaos type](https://chaos-mesh.org/docs/1.1.4/chaos_experiments/podchaos_experiment#pod-failure-configuration-file).
    2. Formulate the YAML configuration for that fault type using the Chaos Mesh documentation.

        ```yaml
        apiVersion: chaos-mesh.org/v1alpha1
        kind: PodChaos
        metadata:
          name: pod-failure-example
          namespace: chaos-testing
        spec:
          action: pod-failure
          mode: one
          value: ''
          duration: '30s'
          selector:
            labelSelectors:
              'app.kubernetes.io/component': 'tikv'
          scheduler:
            cron: '@every 2m'
        ```
    3. Remove any YAML outside of the `spec` (including the spec property name), and remove the indentation of the spec details.

        ```yaml
        action: pod-failure
        mode: one
        value: ''
        duration: '30s'
        selector:
          labelSelectors:
            'app.kubernetes.io/component': 'tikv'
        scheduler:
          cron: '@every 2m'
        ```
    4. Use a [YAML-to-JSON converter like this one](https://www.convertjson.com/yaml-to-json.htm) to convert the Chaos Mesh YAML to JSON and minify it.

        ```json
        {"action":"pod-failure","mode":"one","value":"","duration":"30s","selector":{"labelSelectors":{"app.kubernetes.io/component":"tikv"}},"scheduler":{"cron":"@every 2m"}}
        ```
    5. Paste the minified JSON into the **Spec** field in the portal.

    ![Define fault parameters](images/create-exp-aks-add-fault-details.png)

7. Pick the resources that the fault will target. Only resources that have been onboarded to Chaos Studio (those that have a provider configuration for their resource type) and only resource types for which the fault is applicable appear in the list. Select the AKS cluster(s) you would like to target and click **Add**.

    ![Select targets](images/create-exp-aks-add-fault-targets.png)

8. Continue to add steps, branches, and faults. When done click **Review + Create**.

    ![Final experiment](images/create-exp-aks-final.png)

9. Verify that the details of your experiment are correct, then click **Create**.

    ![Create experiment](images/create-exp-aks-create.png)

10. Before running your experiment you must grant the experiment permission to the target resource(s). Navigate to the AKS cluster(s) you are targeting for fault injection and click on **Access control (IAM)**.

    ![Resource view](images/create-exp-aks-resource.png)

11. Click **Add** and click **Add role assignment**.
    
    ![Add role assignment button](images/create-exp-aks-iam.png)

12. Under **Role** select "Azure Kubernetes Service Cluster User Role" and under **Select** search for the name of your experiment. When you create an experiment Chaos Studio creates a system-assigned managed identity for the experiment with the same name. This identity is used to inject faults against your resources. If an identity already exists with the experiment name, Chaos Studio truncates the experiment name and adds random characters to it. Select the identity for your experiment and click **Save**. Repeat this process for any resources targeted by your experiment.

    ![Add role assignment final view](images/create-exp-aks-add-role.png)

Congratulations! You've created your first chaos experiment and setup resources for fault injection!

Next, **[run your experiment](chaos-studio-run-experiment.md) >>**

### Use the Chaos Studio REST API
If you are using features that aren't available in the portal yet or if you prefer to use REST APIs, follow the instructions below to create an experiment that uses AKS Chaos Mesh faults.

1. Formulate your `spec` property. Visit the Chaos Mesh 1.1.4 documentation for a fault type, [e.g. the PodChaos type](https://chaos-mesh.org/docs/1.1.4/chaos_experiments/podchaos_experiment#pod-failure-configuration-file).
2. Formulate the YAML configuration for that fault type using the Chaos Mesh documentation.

    ```yaml
    apiVersion: chaos-mesh.org/v1alpha1
    kind: PodChaos
    metadata:
      name: pod-failure-example
      namespace: chaos-testing
    spec:
      action: pod-failure
      mode: one
      value: ''
      duration: '30s'
      selector:
        labelSelectors:
          'app.kubernetes.io/component': 'tikv'
      scheduler:
        cron: '@every 2m'
    ```
3. Remove any YAML outside of the `spec` (including the spec property name), and remove the indentation of the spec details.

    ```yaml
    action: pod-failure
    mode: one
    value: ''
    duration: '30s'
    selector:
      labelSelectors:
        'app.kubernetes.io/component': 'tikv'
    scheduler:
      cron: '@every 2m'
    ```
4. Use a [YAML-to-JSON converter like this one](https://www.convertjson.com/yaml-to-json.htm) to convert the Chaos Mesh YAML to JSON and minify it.

    ```json
    {"action":"pod-failure","mode":"one","value":"","duration":"30s","selector":{"labelSelectors":{"app.kubernetes.io/component":"tikv"}},"scheduler":{"cron":"@every 2m"}}
    ```
5. Use a [JSON string escape tool like this one](https://www.freeformatter.com/json-escape.html) to escape the JSON spec
    
    ```json
    {\"action\":\"pod-failure\",\"mode\":\"one\",\"value\":\"\",\"duration\":\"30s\",\"selector\":{\"labelSelectors\":{\"app.kubernetes.io\/component\":\"tikv\"}},\"scheduler\":{\"cron\":\"@every 2m\"}}
    ```

6. Formulate your experiment JSON starting with the sample below, using the [Create Experiment API](https://aka.ms/chaosrestapi) and the [Fault Library](chaos-studio-fault-library.md) for property definitions. Replace the `name` property with the URN for the correct kind of Chaos Mesh fault and replacing the contents of the `parameters` array with a key/value pair for the Chaos Mesh spec as shown below:

    ```json
    {
      "location": "eastus2euap",
      "identity": {
        "type": "SystemAssigned"
      },
      "properties": {
        "steps": [
          {
            "name": "AKS pod kill",
            "branches": [
              {
                "name": "AKS pod kill",
                "actions": [
                  {
                    "type": "continuous",
                    "selectorId": "Selector1",
                    "duration": "PT10M",
                    "parameters": [
                      {
                          "key": "spec",
                          "value": "{\"action\":\"pod-failure\",\"mode\":\"one\",\"value\":\"\",\"duration\":\"30s\",\"selector\":{\"labelSelectors\":{\"app.kubernetes.io\/component\":\"tikv\"}},\"scheduler\":{\"cron\":\"@every 2m\"}}"
                      }
                    ],
                    "name": "urn:provider:Azure-kubernetesClusterChaosMesh:ChaosMesh.PodChaos"
                  }
                ]
              }
            ]
          }
        ],
        "selectors": [
          {
            "id": "Selector1",
            "type": "List",
            "targets": [
              {
                "type": "ResourceId",
                "id": "/subscriptions/018bf144-3a6d-4c13-b1d3-d100a03adc6b/resourceGroups/chaosstudiodemo/providers/Microsoft.ContainerService/managedClusters/myAKSCluster"
              }
            ]
          }
        ]
      }
    }
    ```

7. Create the experiment using the Azure CLI, replacing `$SUBSCRIPTION_ID`, `$RESOURCE_GROUP`, and `$EXPERIMENT_NAME` with the properties for your experiment. Make sure you have saved and uploaded your experiment JSON, updating `experiment.json` with your JSON filename.

    ```bash
    az rest --method put --url "https://management.azure.com/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RESOURCE_GROUP/providers/Microsoft.Chaos/chaosExperiments/$EXPERIMENT_NAME?api-version=2021-06-21-preview" --body @experiment.json
    ```

    Each experiment creates a corresponding system-assigned managed identity. Note of the `principalId` for this identity in the response for the next step.
 
3. Give the experiment access to your resource(s) using the command below, replacing `$EXPERIMENT_PRINCIPAL_ID` with the principalId from the previous step and `$RESOURCE_ID` with the resource ID of the target resource (in this case, the AKS cluster resource ID). Change the role to the appropriate [built-in role for that resource type](chaos-studio-fault-providers.md). Run this command for each resource targeted in your experiment. 

    ```bash
    az role assignment create --role "Azure Kubernetes Cluster User Role" --assignee-object-id $EXPERIMENT_PRINCIPAL_ID --scope $RESOURCE_ID
    ```

Congratulations! You've created your first chaos experiment and setup resources for fault injection!

Next, **[run your experiment](chaos-studio-run-experiment.md) >>**

## Troubleshoot issues running AKS faults

* I am getting an error *{insert error here}*
  * The Chaos Studio integration with Chaos Mesh only supports Chaos Mesh versions **1.1.4 or older**. Verify you are running a supported version of Chaos Mesh.
* When creating the provider configuration, I receive an error:
  ```bash
  Unsupported Media Type({
    "error": {
      "code": "UnsupportedMediaType",
      "message": "Unknown error encountered.",
      "target": null,
      "details": null,
      "additionalInfo": null
    }
  })
  ```

  * Verify that the name of your chaos provider configuration matches the one listed in the `--body` property and modify the filename if it doesn't match.
  * Check that there are no special characters or unexpected characters in the provider configuration file.
  * Try manually typing out the CLI command rather than copy-pasting from documentation.

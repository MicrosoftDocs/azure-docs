# Using GitOps for cluster configuration

## Overview

This architecture uses a GitOps workflow to configure the cluster and deploy applications. Configuration is described declaratively and stored in Git. An agent watches the Git repo for changes and applies them.

The connection between your cluster and one ore more git repositories is tracked in Azure Resource Manager (ARM) as a `sourceControlConfiguration` extension resource. The `sourceControlConfiguration` resource properties represents where and how Kubernetes resources should flow from Git to your cluster.

The Azure Arc for Kubernetes `config-agent` running in your cluster is responsible for watching for new or updated `sourceControlConfiguration` resources and orchestrates adding, updating, or removing the git repo links automatically.

The same patterns can be used to manage a larger collection of clusters, which may be deployed across hetrogenous environments. For example, you may have one repository that defines baseline configuration for your organization and apply that to tens of Kubernetes clusters at once.

The git repository can contain any valid Kubernetes resources including Namespaces, ConfigMaps, Deployments, DaemonSets, etc. A common set of scenarios include defining a baseline configuration for your organization, which might include common RBAC roles and bindings, monitoring or logging agents, or cluster-wide services.

This getting started guide will walk you through applying a set of configurations with cluster-admin scope.

## Create a configuration

- Example repository: <https://github.com/slack/cluster-config>

The example repository is structured around the persona of a cluster operator who would like to provision a few namespaces, deploy a common workload, and provide some team-specific configuration. Using this repository creates the following resources on your cluster:

- **Namespaces:** `cluster-config`, `team-a`, `team-b`
- **Deployment:** `cluster-config/podinfo`
- **ConfigMap:** `team-a/endpoints`

### Using Azure CLI

Using the Azure CLI extension for `k8sconfiguration`, let's link our connected cluster to the example git repository. We will give this configuration a name `cluster-config`, instruct the agent to deploy the operator in the `cluster-config` namespace, and give the operator `cluster-admin` permissions.

```console
az k8sconfiguration create \
    --name cluster-config \
    --cluster-name AzureArcTest1 --resource-group AzureArcTest \
    --operator-instance-name cluster-config --operator-namespace cluster-config \
    --repository-url git://github.com/slack/cluster-config.git
```

**Output:**

```console
Command group 'k8sconfiguration' is in preview. It may be changed/removed in a future release.
{
  "complianceStatus": {
    "ComplianceStatus": 1,
    "clientAppliedTime": null,
    "level": 3,
    "message": "{\"OperatorMessage\":null,\"ClusterState\":null}"
  },
  "configKind": "Git",
  "configName": "cluster-config",
  "configOperator": {
    "operatorInstanceName": "cluster-config",
    "operatorNamespace": "cluster-config",
    "operatorParams": "--git-readonly",
    "operatorScope": "cluster",
    "operatorType": "flux"
  },
  "configType": "",
  "id": null,
  "name": null,
  "operatorInstanceName": null,
  "operatorNamespace": null,
  "operatorParams": null,
  "operatorScope": null,
  "operatorType": null,
  "providerName": "ConnectedClusters",
  "provisioningState": "Succeeded",
  "repositoryPublicKey": null,
  "repositoryUrl": null,
  "sourceControlConfiguration": {
    "repositoryPublicKey": "",
    "repositoryUrl": "git://github.com/slack/cluster-config.git"
  },
  "type": null
}
```

### Using ARM template

To automate the creation of `sourceControlConfiguration` in a connected cluster you can deploy the [example ARM template](../examples/Create-Src-Control-Configuration-on-Connected-Cluster-ARM-template.json).  To test, follow these steps in the Azure portal:
1. In the portal search box (top center), type "deployment".
2. In the search results Services section, click on "Deploy a custom template".
3. Click "Build your own template in the editor".
4. In the edit box, delete the default content and copy/paste the contents of [example ARM template](../examples/Create-Src-Control-Configuration-on-Connected-Cluster-ARM-template.json).
5. Click "Save".
6. You'll be presented with a form for entering parameter values; first select the "Resource Group" where the connected cluster is located.
7. Enter the Azure location and name of the `connectedCluster` where the `sourceControlConfiguration` will be created.
8. Enter the name for the `sourceControlConfiguration` (this will be the resource name in Azure).
9. Enter the operator instance name (this is the operator name in the cluster).
10. Enter the namespace where the operator will be deployed in the cluster.
11. Enter the scope of influence for the operator: `cluster` gives the operator permission to make changes throughout the cluster; `namespace` gives the operator permission to make changes only in the namespace.
12. The operator type currently is restricted to `flux`.
13. Enter any [parameters](https://docs.fluxcd.io/en/stable/tutorials/get-started.html) you want to pass through to the new `flux` instance.
14. Enter the URL of the Git repo that the operator will monitor for Kubernetes manifests.
15. Indicate if you want the `flux` Helm operator installed or not.
16. For the Helm operator indicate the [chart version](https://github.com/fluxcd/helm-operator/blob/master/chart/helm-operator/Chart.yaml) to use for installation (default is 0.3.0).
17. For the Helm operator indicate any [chart values](https://github.com/fluxcd/helm-operator/blob/master/chart/helm-operator/README.md) you want to pass through to the new instance.
18. Agree to the "Terms and Conditions", and click "Purchase" (it's free).
19. The template deployment will be started; when it completes you can navigate to the connected cluster resource and validate the new configuration.

After validating that the ARM templates works for you, you can start using it in your automated infrastructure deployments.

Note that you can also install a `sourceControlConfiguration` in an AKS cluster; use the [example ARM template for deploying configuration to AKS cluster](../examples/Create-Src-Control-Configuration-on-AKS-Cluster-ARM-template.json) and follow the steps above.

## Validate the sourceControlConfiguration

Using the Azure CLI validate that the `sourceControlConfiguration` was successfully created.

```console
az k8sconfiguration show --resource-group AzureArcTest \
    --name cluster-config \
    --cluster-name AzureArcTest1
```

Note that the `sourceControlConfiguration` resource is updated with compliance status, messages, and debugging information.

**Output:**

```console
Command group 'k8sconfiguration' is in preview. It may be changed/removed in a future release.
{
  "complianceStatus": {
    "complianceState": "Compliant",
    "lastConfigApplied": "2019-12-05T05:34:41.481000",
    "message": "...",
    "messageLevel": "3"
  },
  "id": "/subscriptions/57ac26cf-a9f0-4908-b300-9a4e9a0fb205/resourceGroups/AzureArcTest/providers/Microsoft.Kubernetes/connectedClusters/AzureArcTest1/providers/Microsoft.KubernetesConfiguration/sourceControlConfigurations/cluster-config",
  "name": "cluster-config",
  "operatorInstanceName": "cluster-config",
  "operatorNamespace": "cluster-config",
  "operatorParams": "--git-readonly",
  "operatorScope": "cluster",
  "operatorType": "Flux",
  "provisioningState": "Succeeded",
  "repositoryPublicKey": "...",
  "repositoryUrl": "git://github.com/slack/cluster-config.git",
  "resourceGroup": "AzureArcTest",
  "type": "Microsoft.KubernetesConfiguration/sourceControlConfigurations"
}
```

When the `sourceControlConfiguration` is created, a few things happen under the hood:

1. The Azure Arc `config-agent` monitors Azure Resource Manager (ARM) for new or updated configurations (`Microsoft.KubenretesConfiguration/sourceControlConfiguration`)
1. `config-agent` notices the new `Pending` configuration
1. `config-agent` reads the configuration properties and prepares to deploy a managed instance of `flux`
    1. `config-agent` creates the destination namespace
    1. `config-agent` prepares a Kubernetes Service Account with the appropriate permission (`cluster` or `namespace` scope)
    1. `config-agent` generates a deploy key
    1. `config-agent` deploys an instance of `flux`
1. `config-agent` reports status back to the `sourceControlConfiguration`

While the provisioning process happens, the `sourceControlConfiguration` will move through a few state changes. Monitor progress with the `az k8sconfiguration show ...` command above:

1. `complianceStatus` -> `Pending`: represents the initial and in-progress states
1. `complianceStatus` -> `Compliant`: `config-agent` was able to successfully configure the cluster and deploy `flux` without error
1. `complianceStatus` -> `Noncompliant`: `config-agent` encountered an error deploying `flux`, details should be available in `complianceStatus.message` response body

## Validate the Kubernetes configuration

After `config-agent` has installed the `flux` instance, resources held in the git repository should begin to flow to the cluster. Check to see that the namespaces, deployments, and resources have been created:

```console
kubectl get ns --show-labels
```

**Output:**

```console
NAME              STATUS   AGE    LABELS
azure-arc         Active   24h    <none>
cluster-config    Active   177m   <none>
default           Active   29h    <none>
itops             Active   177m   fluxcd.io/sync-gc-mark=sha256.9oYk8yEsRwWkR09n8eJCRNafckASgghAsUWgXWEQ9es,name=itops
kube-node-lease   Active   29h    <none>
kube-public       Active   29h    <none>
kube-system       Active   29h    <none>
team-a            Active   177m   fluxcd.io/sync-gc-mark=sha256.CS5boSi8kg_vyxfAeu7Das5harSy1i0gc2fodD7YDqA,name=team-a
team-b            Active   177m   fluxcd.io/sync-gc-mark=sha256.vF36thDIFnDDI2VEttBp5jgdxvEuaLmm7yT_cuA2UEw,name=team-b
```

We can see that `team-a`, `team-b`, `itops`, and `cluster-config` namespaces have been created.

The `flux` operator has been deployed to `cluster-config` namespace, as directed by our `sourceControlConfig`:

```console
kubectl -n cluster-config get deploy  -o wide
```

**Output:**

```console
NAME             READY   UP-TO-DATE   AVAILABLE   AGE   CONTAINERS   IMAGES                         SELECTOR
cluster-config   1/1     1            1           3h    flux         docker.io/fluxcd/flux:1.16.0   instanceName=cluster-config,name=flux
memcached        1/1     1            1           3h    memcached    memcached:1.5.15               name=memcached
```

## Further exploration

You can explore the other resources deployed as part of the configuration repository:

```console
kubectl -n team-a get cm -o yaml
kubectl -n itops get all
```

## Next

* Return to the [README](../README.md)
* [Use GitOps in an AKS cluster](./use-gitops-in-aks-cluster.md)
* [Use Azure Policy to govern cluster configuration](./use-azure-policy.md)

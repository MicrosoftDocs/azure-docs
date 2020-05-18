---
title: "Use GitOps for cluster configuration"
services: arc-kubernetes
ms.date: 02/20/2020
ms.topic: "Tutorial"
description: ""
keywords: "GitOps, Kubernetes, K8s, Azure, Arc, Azure Kubernetes Service, containers"
---

# Use GitOps for cluster configuration

## Overview

This architecture uses a GitOps workflow to configure the cluster and deploy applications. Configuration is described declaratively in .yaml files and stored in Git. An agent watches the Git repo for changes and applies them.  The same agent also periodically assures that the cluster state matches the state declared in the Git repo, and returns the cluster to the desired state if any unmanaged changes have occurred.

The connection between your cluster and one or more Git repositories is tracked in Azure Resource Manager (ARM) as a `sourceControlConfiguration` extension resource. The `sourceControlConfiguration` resource properties represent where and how Kubernetes resources should flow from Git to your cluster. The `sourceControlConfiguration` data is stored encrypted at rest in a CosmosDb database to ensure data confidentiality.

The Azure Arc enabled Kubernetes `config-agent` running in your cluster is responsible for watching for new or updated `sourceControlConfiguration` resources and orchestrates adding, updating, or removing the Git repo links automatically.

The same patterns can be used to manage a larger collection of clusters, which may be deployed across heterogenous environments. For example, you may have one repository that defines baseline configuration for your organization and apply that to tens of Kubernetes clusters at once.

The Git repository can contain any valid Kubernetes resources including Namespaces, ConfigMaps, Deployments, DaemonSets, etc.  It may also contain Helm charts for deploying applications. A common set of scenarios include defining a baseline configuration for your organization, which might include common RBAC roles and bindings, monitoring or logging agents, or cluster-wide services.

This getting started guide will walk you through applying a set of configurations with cluster-admin scope.

## Create a configuration

- Example repository: <https://github.com/slack/cluster-config>

The example repository is structured around the persona of a cluster operator who would like to provision a few namespaces, deploy a common workload, and provide some team-specific configuration. Using this repository creates the following resources on your cluster:

- **Namespaces:** `cluster-config`, `team-a`, `team-b`
- **Deployment:** `cluster-config/azure-vote`
- **ConfigMap:** `team-a/endpoints`

### Notes
- The `config-agent` polls Azure for new or updated `sourceControlConfiguration` every 30 seconds.  This is the maximum time it will take for the `config-agent` to pick up new or updated configuration.
- If you are associating a private repository, assure that you also complete the steps in [Apply configuration from a private git repository](https://github.com/Azure/azure-arc-kubernetes-preview/blob/master/docs/use-gitops-in-connected-cluster.md#apply-configuration-from-a-private-git-repository)

### Using Azure CLI

Using the Azure CLI extension for `k8sconfiguration`, let's link our connected cluster to the example git repository. We will give this configuration a name `cluster-config`, instruct the agent to deploy the operator in the `cluster-config` namespace, and give the operator `cluster-admin` permissions.

```console
az k8sconfiguration create \
    --name cluster-config \
    --cluster-name AzureArcTest1 --resource-group AzureArcTest \
    --operator-instance-name cluster-config --operator-namespace cluster-config \
    --repository-url git@github.com/Azure/arc-k8s-demo \
    --scope cluster --cluster-type connectedClusters
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
    "repositoryUrl": "git://github.com/Azure/arc-k8s-demo.git"
  },
  "type": null
}
```

#### --repository-url Parameter

Here are the supported scenarios for the value of --repository-url parameter.

| Scenario | Format | Description |
| ------------- | ------------- | ------------- |
| Private GitHub repo - SSH | git@github.com:username/repo | SSH keypair generated by Flux.  User must add the public key to the GitHub account as Deploy Key. |
| Public GitHub repo | http://github.com/username/repo or git://github.com/username/repo   |  |

These scenarios are supported by Flux but not by sourceControlConfiguration yet; let us know if any of these are important to you.
| Scenario | Format | Description |
| ------------- | ------------- | ------------- |
| Private GitHub repo - HTTPS | https://github.com/username/repo | Flux does not generate SSH keypair.  [Instructions](https://docs.fluxcd.io/en/1.17.0/guides/use-git-https.html) |
| Private Git host | user@githost:path/to/repo | [Instructions](https://docs.fluxcd.io/en/1.18.0/guides/use-private-git-host.html) |
| Private GitHub repo - SSH (bring your own key) | git@github.com:username/repo | [Use your own SSH keypair](https://docs.fluxcd.io/en/1.17.0/guides/provide-own-ssh-key.html) |


#### Additional Parameters

To customize the creation of configuration, here are a few additional parameters:

`--enable-helm-operator` : *Optional* switch to enable support for Helm chart deployments. By default this is disabled.

`--helm-operator-chart-values` : *Optional* chart values for Helm operator (if enabled).  For example, '--set helm.versions=v3'.

`--helm-operator-chart-version` : *Optional* chart version for Helm operator (if enabled). Default: '0.6.0'.

`--operator-namespace` : *Optional* name for the operator namespace. Default: 'default'

`--operator-params` : *Optional* parameters for operator. Must be given within single quotes. For example, ```--operator-params='--git-readonly --git-path=releases/prod' ```

Options supported in  --operator-params

| | Option | Description |
| ------------- | ------------- | ------------- |
| 1.  | --git-branch  | Branch of git repo to use for Kubernetes manifests. Default is 'master'. |
| 2.  | --git-path  | Relative path within the Git repo for Flux to locate Kubernetes manifests. |
| 3.  | --git-readonly | Git repo will be considered read-only; Flux will not attempt to write to it. |
| 4.  | --manifest-generation  | If enabled, Flux will look for .flux.yaml and run Kustomize or other manifest generators. |
| 5.  | --git-poll-interval  | Period at which to poll Git repo for new commits. Default is '5m' (5 minutes). |
| 6.  | --sync-garbage-collection  | If enabled, Flux will delete resources that it created, but are no longer present in Git. |
| 7.  | --git-label  | Label to keep track of sync progress, used to tag the Git branch.  Default is 'flux-sync'. |
| 8.  | --git-user  | Username to use as git committer. |
| 9.  | --git-email  | Email to use as git committer. |

Note: If '--git-user' or '--git-email' are not set (which means that you don't want Flux to write to the repo), then --git-readonly will automatically be set (if you have not already set it).

Note: If enableHelmOperator is true, then operatorInstanceName + operatorNamespace strings cannot exceed 47 characters combined.  If you fail to adhere to this limit then you will get this error:
```console
{"OperatorMessage":"Error: {failed to install chart from path [helm-operator] for release [<operatorInstanceName>-helm-<operatorNamespace>]: err [release name \"<operatorInstanceName>-helm-<operatorNamespace>\" exceeds max length of 53]} occurred while doing the operation : {Installing the operator} on the config","ClusterState":"Installing the operator"}
```

For more info see [Flux documentation](https://aka.ms/FluxcdReadme).

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

## Validate the sourceControlConfiguration

Using the Azure CLI validate that the `sourceControlConfiguration` was successfully created.

```console
az k8sconfiguration show --resource-group AzureArcTest --name cluster-config --cluster-name AzureArcTest1 --cluster-type connectedClusters
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
  "repositoryUrl": "git://github.com/Azure/arc-k8s-demo.git",
  "resourceGroup": "AzureArcTest",
  "type": "Microsoft.KubernetesConfiguration/sourceControlConfigurations"
}
```

When the `sourceControlConfiguration` is created, a few things happen under the hood:

1. The Azure Arc `config-agent` monitors Azure Resource Manager (ARM) for new or updated configurations (`Microsoft.KubernetesConfiguration/sourceControlConfiguration`)
1. `config-agent` notices the new `Pending` configuration
1. `config-agent` reads the configuration properties and prepares to deploy a managed instance of `flux`
    1. `config-agent` creates the destination namespace
    1. `config-agent` prepares a Kubernetes Service Account with the appropriate permission (`cluster` or `namespace` scope)
    1. `config-agent` deploys an instance of `flux`
    1. `flux` generates a SSH key and logs the public key
1. `config-agent` reports status back to the `sourceControlConfiguration`

While the provisioning process happens, the `sourceControlConfiguration` will move through a few state changes. Monitor progress with the `az k8sconfiguration show ...` command above:

1. `complianceStatus` -> `Pending`: represents the initial and in-progress states
1. `complianceStatus` -> `Compliant`: `config-agent` was able to successfully configure the cluster and deploy `flux` without error
1. `complianceStatus` -> `Noncompliant`: `config-agent` encountered an error deploying `flux`, details should be available in `complianceStatus.message` response body

## Apply configuration from a private git repository

If you are using a private git repo, then you need to perform one more task to close the loop: you need to add the public key that was generated by `flux` as a **Deploy key** in the repo.

**Get the public key using az cli**

```console
$ az k8sconfiguration show --resource-group <resource group name> --cluster-name <connected cluster name> --name <configuration name> --query 'repositoryPublicKey'
Command group 'k8sconfiguration' is in preview. It may be changed/removed in a future release.
"ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAREDACTED"
```

**Get the public key from the Azure portal**

1. In the Azure portal navigate to the connected cluster resource.
2. In the resource page select "Configurations" and see the list of configurations for this cluster.
3. Select the configuration that uses the private Git repository.
4. In the context window that opens, at the bottom of the window copy the **Repository public key**.

**Add the public key as a deploy key to the git repo**

1. Open GitHub, navigate to your fork, to **Settings**, then to **Deploy keys**
2. Click  **Add deploy key**
3. Supply a Title
4. Check **Allow write access**
5. Paste the public key (minus any surrounding quotation marks)
6. Click **Add key**

See the GitHub docs for more info on how to manage deploy keys.

**If you are using an Azure DevOps repository, add the key to your SSH keys**

1. Under **User Settings** in the top right (next to the profile image), click **SSH public keys**
1. Clickk **+ New Key**
1. Supply a name
1. Paste the public key without any surrounding quotes
1. Click **Add**

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

## Delete a configuration

You can delete a `sourceControlConfiguration` using the CLI or Azure portal.  After you initiate the delete command, the `sourceControlConfiguration` resource will be deleted immediately in Azure, but it can take up to 1 hour for full deletion of the associated objects from the cluster (we have a backlog item to shorten this). If the `sourceControlConfiguration` was created with namespace scope, that namespace will not be deleted from the cluster (to avoid breaking any other resources that may have been created in that namespace).

Note that any changes to the cluster that were the result of deployments from the tracked git repo are not deleted when the `sourceControlConfiguration` is deleted.

```console
az k8sconfiguration delete --name '<config name>' -g '<resource group name>' --cluster-name '<cluster name>' --cluster-type connectedClusters
```

**Output:**

```console
Command group 'k8sconfiguration' is in preview. It may be changed/removed in a future release.
```

## Next

- Return to the [README](../README.md)
- [Use GitOps with Helm for cluster configuration](./use-gitops-with-helm.md)
- [Use Azure Policy to govern cluster configuration](./use-azure-policy.md)

---
title: 'Tutorial: Deploy configurations using GitOps on an Azure Arc-enabled Kubernetes cluster'
description: This tutorial demonstrates applying configurations on an Azure Arc-enabled Kubernetes cluster.
ms.topic: tutorial 
ms.date: 05/08/2023
ms.custom: template-tutorial, devx-track-azurecli
---

# Tutorial: Deploy configurations using GitOps on an Azure Arc-enabled Kubernetes cluster 

> [!IMPORTANT]
> This tutorial is for GitOps with Flux v1.  GitOps with Flux v2 is now available for Azure Arc-enabled Kubernetes and Azure Kubernetes Service (AKS) clusters; [go to the tutorial for GitOps with Flux v2](./tutorial-use-gitops-flux2.md).  We recommend [migrating to Flux v2](conceptual-gitops-flux2.md#migrate-from-flux-v1) as soon as possible.
>
> Support for Flux v1-based cluster configuration resources created prior to January 1, 2024 will end on [May 24, 2025](https://azure.microsoft.com/updates/migrate-your-gitops-configurations-from-flux-v1-to-flux-v2-by-24-may-2025/). Starting on January 1, 2024, you won't be able to create new Flux v1-based cluster configuration resources.

In this tutorial, you will apply configurations using GitOps on an Azure Arc-enabled Kubernetes cluster. You'll learn how to:

> [!div class="checklist"]
> * Create a configuration on an Azure Arc-enabled Kubernetes cluster using an example Git repository.
> * Validate that the configuration was successfully created.
> * Apply configuration from a private Git repository.
> * Validate the Kubernetes configuration.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- An existing Azure Arc-enabled Kubernetes connected cluster.
    - If you haven't connected a cluster yet, walk through our [Connect an Azure Arc-enabled Kubernetes cluster quickstart](quickstart-connect-cluster.md).
- An understanding of the benefits and architecture of this feature. Read more in [Configurations and GitOps - Azure Arc-enabled Kubernetes article](conceptual-configurations.md).
- Install the `k8s-configuration` Azure CLI extension of version >= 1.0.0:
  
  ```azurecli
  az extension add --name k8s-configuration
  ```

    >[!TIP]
    > If the `k8s-configuration` extension is already installed, you can update it to the latest version using the following command - `az extension update --name k8s-configuration`

## Create a configuration

The [example repository](https://github.com/Azure/arc-k8s-demo) used in this article is structured around the persona of a cluster operator. The manifests in this repository provision a few namespaces, deploy workloads, and provide some team-specific configuration. Using this repository with GitOps creates the following resources on your cluster:

* Namespaces: `cluster-config`, `team-a`, `team-b`
* Deployment: `arc-k8s-demo`
* ConfigMap: `team-a/endpoints`

The `config-agent` polls Azure for new or updated configurations. This task will take up to 5 minutes.

If you are associating a private repository with the configuration, complete the steps below in [Apply configuration from a private Git repository](#apply-configuration-from-a-private-git-repository).

## Use Azure CLI
Use the Azure CLI extension for `k8s-configuration` to link a connected cluster to the [example Git repository](https://github.com/Azure/arc-k8s-demo). 
1. Name this configuration `cluster-config`.
1. Instruct the agent to deploy the operator in the `cluster-config` namespace.
1. Give the operator `cluster-admin` permissions.

    ```azurecli
    az k8s-configuration create --name cluster-config --cluster-name AzureArcTest1 --resource-group AzureArcTest --operator-instance-name cluster-config --operator-namespace cluster-config --repository-url https://github.com/Azure/arc-k8s-demo --scope cluster --cluster-type connectedClusters
    ```

    ```output
    {
      "complianceStatus": {
      "complianceState": "Pending",
      "lastConfigApplied": "0001-01-01T00:00:00",
      "message": "{\"OperatorMessage\":null,\"ClusterState\":null}",
      "messageLevel": "3"
      },
      "configurationProtectedSettings": {},
      "enableHelmOperator": false,
      "helmOperatorProperties": null,
      "id": "/subscriptions/<sub id>/resourceGroups/<group name>/providers/Microsoft.Kubernetes/connectedClusters/<cluster name>/providers/Microsoft.KubernetesConfiguration/sourceControlConfigurations/cluster-config",
      "name": "cluster-config",
      "operatorInstanceName": "cluster-config",
      "operatorNamespace": "cluster-config",
      "operatorParams": "--git-readonly",
      "operatorScope": "cluster",
      "operatorType": "Flux",
      "provisioningState": "Succeeded",
      "repositoryPublicKey": "",
      "repositoryUrl": "https://github.com/Azure/arc-k8s-demo",
      "resourceGroup": "MyRG",
      "sshKnownHostsContents": "",
      "systemData": {
        "createdAt": "2020-11-24T21:22:01.542801+00:00",
        "createdBy": null,
        "createdByType": null,
        "lastModifiedAt": "2020-11-24T21:22:01.542801+00:00",
        "lastModifiedBy": null,
        "lastModifiedByType": null
      },
      "type": "Microsoft.KubernetesConfiguration/sourceControlConfigurations"
    }
    ```

### Use a public Git repository

| Parameter | Format |
| ------------- | ------------- |
| `--repository-url` | http[s]://server/repo[.git]

### Use a private Git repository with SSH and Flux-created keys

Add the public key generated by Flux to the user account in your Git service provider. If the key is added to the repository instead of the user account, use `git@` in place of `user@` in the URL. 

Jump to the [Apply configuration from a private Git repository](#apply-configuration-from-a-private-git-repository) section for more details.


| Parameter | Format | Notes
| ------------- | ------------- | ------------- |
| `--repository-url` | ssh://user@server/repo[.git] or user@server:repo[.git] | `git@` may replace `user@`

### Use a private Git repository with SSH and user-provided keys

Provide your own private key directly or in a file. The key must be in [PEM format](https://aka.ms/PEMformat) and end with newline (\n). 

Add the associated public key to the user account in your Git service provider. If the key is added to the repository instead of the user account, use `git@` in place of `user@`. 

Jump to the [Apply configuration from a private Git repository](#apply-configuration-from-a-private-git-repository) section for more details.  

| Parameter | Format | Notes |
| ------------- | ------------- | ------------- |
| `--repository-url`  | ssh://user@server/repo[.git] or user@server:repo[.git] | `git@` may replace `user@` |
| `--ssh-private-key` | base64-encoded key in [PEM format](https://aka.ms/PEMformat) | Provide key directly |
| `--ssh-private-key-file` | full path to local file | Provide full path to local file that contains the PEM-format key

### Use a private Git host with SSH and user-provided known hosts

The Flux operator maintains a list of common Git hosts in its known hosts file to authenticate the Git repository before establishing the SSH connection. If you are using an *uncommon* Git repository or your own Git host, you can supply the host key so that Flux can identify your repo. 

Just like private keys, you can provide your known_hosts content directly or in a file. When providing your own content, use the [known_hosts content format specifications](https://aka.ms/KnownHostsFormat), along with either of the SSH key scenarios above.

| Parameter | Format | Notes |
| ------------- | ------------- | ------------- |
| `--repository-url`  | ssh://user@server/repo[.git] or user@server:repo[.git] | `git@` may replace `user@` |
| `--ssh-known-hosts` | base64-encoded | Provide known hosts content directly |
| `--ssh-known-hosts-file` | full path to local file | Provide known hosts content in a local file |

### Use a private Git repository with HTTPS

| Parameter | Format | Notes |
| ------------- | ------------- | ------------- |
| `--repository-url` | https://server/repo[.git] | HTTPS with basic auth |
| `--https-user` | raw or base64-encoded | HTTPS username |
| `--https-key` | raw or base64-encoded | HTTPS personal access token or password

>[!NOTE]
>* Helm operator chart version 1.2.0+ supports the HTTPS Helm release private auth.
>* HTTPS Helm release is not supported for AKS managed clusters.
>* If you need Flux to access the Git repository through your proxy, you will need to update the Azure Arc agents with the proxy settings. For more information, see [Connect using an outbound proxy server](./quickstart-connect-cluster.md#connect-using-an-outbound-proxy-server).


## Additional Parameters

Customize the configuration with the following optional parameters:

| Parameter | Description |
| ------------- | ------------- |
| `--enable-helm-operator`| Switch to enable support for Helm chart deployments. |
| `--helm-operator-params` | Chart values for Helm operator (if enabled). For example, `--set helm.versions=v3`. |
| `--helm-operator-chart-version` | Chart version for Helm operator (if enabled). Use version 1.2.0+. Default: '1.2.0'. |
| `--operator-namespace` | Name for the operator namespace. Default: 'default'. Max: 23 characters. |
| `--operator-params` | Parameters for operator. Must be given within single quotes. For example, ```--operator-params='--git-readonly --sync-garbage-collection --git-branch=main'``` 

### Options supported in  `--operator-params`:

| Option | Description |
| ------------- | ------------- |
| `--git-branch`  | Branch of Git repository to use for Kubernetes manifests. Default is 'master'. Newer repositories have root branch named `main`, in which case you need to set `--git-branch=main`. |
| `--git-path`  | Relative path within the Git repository for Flux to locate Kubernetes manifests. |
| `--git-readonly` | Git repository will be considered read-only. Flux will not attempt to write to it. |
| `--manifest-generation`  | If enabled, Flux will look for .flux.yaml and run Kustomize or other manifest generators. |
| `--git-poll-interval`  | Period at which to poll Git repository for new commits. Default is `5m` (5 minutes). |
| `--sync-garbage-collection`  | If enabled, Flux will delete resources that it created, but are no longer present in Git. |
| `--git-label`  | Label to keep track of sync progress. Used to tag the Git branch.  Default is `flux-sync`. |
| `--git-user`  | Username for Git commit. |
| `--git-email`  | Email to use for Git commit. 

If you don't want Flux to write to the repository and `--git-user` or `--git-email` aren't set, then `--git-readonly` will automatically be set.

For more information, see the [Flux documentation](https://aka.ms/FluxcdReadme).

>[!NOTE]
> Flux defaults to sync from the `master` branch of the git repo. However, newer git repositories have the root branch named `main`, in which case you need to set `--git-branch=main` in the --operator-params. 

> [!TIP]
> You can create a configuration in the Azure portal in the **GitOps** tab of the Azure Arc-enabled Kubernetes resource.

## Validate the configuration

Use the Azure CLI to validate that the configuration was successfully created.

```azurecli
az k8s-configuration show --name cluster-config --cluster-name AzureArcTest1 --resource-group AzureArcTest --cluster-type connectedClusters
```

The configuration resource will be updated with compliance status, messages, and debugging information.

```output
{
  "complianceStatus": {
    "complianceState": "Installed",
    "lastConfigApplied": "2020-12-10T18:26:52.801000+00:00",
    "message": "...",
    "messageLevel": "Information"
  },
  "configurationProtectedSettings": {},
  "enableHelmOperator": false,
  "helmOperatorProperties": {
    "chartValues": "",
    "chartVersion": ""
  },
  "id": "/subscriptions/<sub id>/resourceGroups/AzureArcTest/providers/Microsoft.Kubernetes/connectedClusters/AzureArcTest1/providers/Microsoft.KubernetesConfiguration/sourceControlConfigurations/cluster-config",
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
  "sshKnownHostsContents": null,
  "systemData": {
    "createdAt": "2020-12-01T03:58:56.175674+00:00",
    "createdBy": null,
    "createdByType": null,
    "lastModifiedAt": "2020-12-10T18:30:56.881219+00:00",
    "lastModifiedBy": null,
    "lastModifiedByType": null
},
  "type": "Microsoft.KubernetesConfiguration/sourceControlConfigurations"
}
```

When a configuration is created or updated, a few things happen:

1. The Azure Arc `config-agent` monitors Azure Resource Manager for new or updated configurations (`Microsoft.KubernetesConfiguration/sourceControlConfigurations`) and notices the new `Pending` configuration.
1. The `config-agent` reads the configuration properties and creates the destination namespace.
1. The Azure Arc `controller-manager` creates a Kubernetes service account and maps it to [ClusterRoleBinding or RoleBinding](https://kubernetes.io/docs/reference/access-authn-authz/rbac/) for the appropriate permissions (`cluster` or `namespace` scope). It then deploys an instance of `flux`.
1. If using the option of SSH with Flux-generated keys, `flux` generates an SSH key and logs the public key.
1. The `config-agent` reports status back to the configuration resource in Azure.

While the provisioning process happens, the configuration resource will move through a few state changes. Monitor progress with the `az k8s-configuration show ...` command above:

| Stage change | Description |
| ------------- | ------------- |
| `complianceStatus`-> `Pending` | Represents the initial and in-progress states. |
| `complianceStatus` -> `Installed`  | `config-agent` successfully configured the cluster and deployed `flux` without error. |
| `complianceStatus` -> `Failed` | `config-agent` ran into an error deploying `flux`. Details are provided in `complianceStatus.message` response body. |

## Apply configuration from a private Git repository

If you are using a private Git repository, you need to configure the SSH public key in your repository. Either you provide or Flux generates the SSH public key. You can configure the public key either on the specific Git repository or on the Git user that has access to the repository. 

### Get your own public key

If you generated your own SSH keys, then you already have the private and public keys.

#### Get the public key using Azure CLI 

Use the following in Azure CLI if Flux is generating the keys.

```azurecli
az k8s-configuration show --resource-group <resource group name> --cluster-name <connected cluster name> --name <configuration name> --cluster-type connectedClusters --query 'repositoryPublicKey' 
"ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAREDACTED"
```

#### Get the public key from the Azure portal

Walk through the following in Azure portal if Flux is generating the keys.

1. In the Azure portal, navigate to the connected cluster resource.
2. In the resource page, select "GitOps" and see the list of configurations for this cluster.
3. Select the configuration that uses the private Git repository.
4. In the context window that opens, at the bottom of the window, copy the **Repository public key**.

#### Add public key using GitHub

Use one of the following options:

* Option 1: Add the public key to your user account (applies to all repositories in your account):  
    1. Open GitHub and click on your profile icon at the top-right corner of the page.
    2. Click on **Settings**.
    3. Click on **SSH and GPG keys**.
    4. Click on **New SSH key**.
    5. Supply a Title.
    6. Paste the public key without any surrounding quotes.
    7. Click on **Add SSH key**.

* Option 2: Add the public key as a deploy key to the Git repository (applies to only this repository):  
    1. Open GitHub and navigate to your repository.
    1. Click on **Settings**.
    1. Click on **Deploy keys**.
    1. Click on **Add deploy key**.
    1. Supply a Title.
    1. Check **Allow write access**.
    1. Paste the public key without any surrounding quotes.
    1. Click on **Add key**.

#### Add public key using an Azure DevOps repository

Use the following steps to add the key to your SSH keys:

1. Under **User Settings** in the top right (next to the profile image), click **SSH public keys**.
1. Select  **+ New Key**.
1. Supply a name.
1. Paste the public key without any surrounding quotes.
1. Click **Add**.

## Validate the Kubernetes configuration

After `config-agent` has installed the `flux` instance, resources held in the Git repository should begin to flow to the cluster. Check to see that the namespaces, deployments, and resources have been created with the following command:

```console
kubectl get ns --show-labels
```

```output
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

The `flux` operator has been deployed to `cluster-config` namespace, as directed by the configuration resource:

```console
kubectl -n cluster-config get deploy  -o wide
```

```output
NAME             READY   UP-TO-DATE   AVAILABLE   AGE   CONTAINERS   IMAGES                         SELECTOR
cluster-config   1/1     1            1           3h    flux         docker.io/fluxcd/flux:1.16.0   instanceName=cluster-config,name=flux
memcached        1/1     1            1           3h    memcached    memcached:1.5.15               name=memcached
```

## Further exploration

You can explore the other resources deployed as part of the configuration repository using:

```console
kubectl -n team-a get cm -o yaml
kubectl -n itops get all
```
## Clean up resources

Delete a configuration using the Azure CLI or Azure portal. After you run the delete command, the configuration resource will be deleted immediately in Azure. Full deletion of the associated objects from the cluster should happen within 10 minutes. If the configuration is in a failed state when removed, the full deletion of associated objects can take up to an hour.

When a configuration with `namespace` scope is deleted, the namespace is not deleted by Azure Arc to avoid breaking existing workloads. If needed, you can delete this namespace manually using `kubectl`.

```azurecli
az k8s-configuration delete --name cluster-config --cluster-name AzureArcTest1 --resource-group AzureArcTest --cluster-type connectedClusters
```

> [!NOTE]
> Any changes to the cluster that were the result of deployments from the tracked Git repository are not deleted when the configuration is deleted.

## Next steps

Advance to the next tutorial to learn how to implement CI/CD with GitOps.
> [!div class="nextstepaction"]
> [Implement CI/CD with GitOps](./tutorial-gitops-ci-cd.md)

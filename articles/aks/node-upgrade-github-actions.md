---
title: Handle AKS node upgrades with GitHub Actions
titleSuffix: Azure Kubernetes Service
description: Learn how to schedule automatic node upgrades in Azure Kubernetes Service (AKS) using GitHub Actions.
ms.topic: article
ms.custom: devx-track-azurecli
ms.date: 10/05/2023
#Customer intent: As a cluster administrator, I want to know how to automatically apply Linux updates and reboot nodes in AKS for security and/or compliance
---

# Apply automatic security upgrades to Azure Kubernetes Service (AKS) nodes using GitHub Actions

Security updates are a key part of maintaining your AKS cluster's security and compliance with the latest fixes for the underlying OS. These updates include OS security fixes or kernel updates. Some updates require a node reboot to complete the process.

This article shows you how you can automate the update process of AKS nodes using GitHub Actions and Azure CLI to create an update task based on `cron` that runs automatically.

> [!NOTE]
> You can also perform node image upgrades automatically and schedule these upgrades using planned maintenance. For more information, see [Automatically upgrade node images][auto-upgrade-node-image].

## Before you begin

* This article assumes you have an existing AKS cluster. If you need an AKS cluster, create one using [Azure CLI][aks-quickstart-cli], [Azure PowerShell][aks-quickstart-powershell], or [the Azure portal][aks-quickstart-portal].
* This article also assumes you have a [GitHub account][github] and a [profile repository][profile-repository] to host your actions. If you don't have a repository, create one with the same name as your GitHub username.
* You need the Azure CLI version 2.0.59 or later installed and configured. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI][install-azure-cli].

## Update nodes with `az aks upgrade`

The `az aks upgrade` command gives you a zero downtime way to apply updates. The command performs the following actions:

1. Applies the latest updates to all your cluster's nodes.
2. Cordons (makes the node unavailable for the scheduling of new workloads) and drains (moves the existent workloads to other node) traffic to the nodes.
3. Restarts the nodes.
4. Enables the updated nodes to receive traffic again.

AKS doesn't automatically restart your nodes if you update them using a different method.

> [!NOTE]
> Running `az aks upgrade` with the `--node-image-only` flag only upgrades the node images. Running the command without the flag upgrades both the node images and the Kubernetes control plane version. For more information, see the [docs for managed upgrades on nodes][managed-node-upgrades-article] and the [docs for cluster upgrades][cluster-upgrades-article].

All Kubernetes nodes run in a standard Windows or Linux-based Azure virtual machine (VM). The Linux-based VMs use an Ubuntu image with the OS configured to automatically check for updates every night.

When you use the `az aks upgrade` command, Azure CLI creates a surge of new nodes with the latest security and kernel updates. These new nodes are initially cordoned to prevent any apps from being scheduled to them until the update completes. After the update completes, Azure cordons and drains the older nodes and uncordons the new ones, transferring all the scheduled applications to the new nodes.

This process is better than updating Linux-based kernels manually because Linux requires a reboot when a new kernel update is installed. If you update the OS manually, you also need to reboot the VM, manually cordoning and draining all the apps.

## Create a timed GitHub Action

`cron` is a utility that allows you to run a set of commands, or *jobs*, on an automated schedule. To create a job to update your AKS nodes on an automated schedule, you need a repository to host your actions. GitHub Actions are usually configured in the same repository as your application, but you can use any repository.

1. Navigate to your repository on GitHub.
2. Select **Actions**.
3. Select **New workflow** > **Set up a workflow yourself**.
4. Create a GitHub Action named *Upgrade cluster node images* with a schedule trigger to run every 15 days at 3am. Copy the following code into the YAML:

    ```yml
    name: Upgrade cluster node images
    on:
      schedule:
        - cron: '0 3 */15 * *'
    ```

5. Create a job named *upgrade-node* that runs on an Ubuntu agent and connects to your Azure CLI account to execute the node upgrade command. Copy the following code into the YAML under the `on` key:

    ```yml
    jobs:
      upgrade-node:
        runs-on: ubuntu-latest
    ```

## Set up the Azure CLI in the workflow

1. In the **Search Marketplace for Actions** bar, search for **Azure Login**.
2. Select **Azure Login**.

      :::image type="content" source="media/node-upgrade-github-actions/azure-login-search.png" alt-text="Search results showing two lines, the first action is called 'Azure Login' and the second 'Azure Container Registry Login'":::

3. Under **Installation**, select a version, such as *v1.4.6*, and copy the installation code snippet.
4. Add the `steps` key and the following information from the installation code snippet to the YAML:

      ```yml
      name: Upgrade cluster node images
      on:
        schedule:
          - cron: '0 3 */15 * *'
      jobs:
        upgrade-node:
          runs-on: ubuntu-latest
          steps:
            - name: Azure Login
              uses: Azure/login@v1.4.6
              with:
                creds: ${{ secrets.AZURE_CREDENTIALS }}
      ```

## Create credentials for the Azure CLI

1. In a new browser window, create a new service principal using the [`az ad sp create-for-rbac`][az-ad-sp-create-for-rbac] command. Make sure you replace `*{subscriptionID}*` with your own subscription ID.

    > [!NOTE]
    > This example creates the `Contributor` role at the *Subscription* scope. You can provide the role and scope that meets your needs. For more information, see [Azure built-in roles][azure-built-in-roles] and [Azure RBAC scope levels][azure-rbac-scope-levels].

    ```azurecli-interactive
    az ad sp create-for-rbac --role Contributor --scopes /subscriptions/{subscriptionID} -o json
    ```

    Your output should be similar to the following example output:

    ```output
    {
      "appId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
      "displayName": "xxxxx-xxx-xxxx-xx-xx-xx-xx-xx",
      "password": "xxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      "tenant": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
    }
    ```

2. Copy the output and navigate to your GitHub repository.
3. Select **Settings** > **Secrets and variables** > **Actions** > **New repository secret**.
4. For **Name**, enter `AZURE_CREDENTIALS`.
5. For **Secret**, copy in the contents of the output you received when you created the service principal.
6. Select **Add Secret**.

## Create the steps to execute the Azure CLI commands

1. Navigate to your window with the workflow YAML.
2. In the **Search Marketplace for Actions** bar, search for **Azure CLI Action**.
3. Select **Azure CLI Action**.

    :::image type="content" source="media/node-upgrade-github-actions/azure-cli-action.png" alt-text="Search result for 'Azure CLI Action' with first result being shown as made by Azure":::

4. Under **Installation**, select a version, such as *v1.0.8*, and copy the installation code snippet.
5. Paste the contents of the action into the YAML below the `*Azure Login*` step, similar to the following:

    ```yml
    name: Upgrade cluster node images
    on:
      schedule:
        - cron: '0 3 */15 * *'
    jobs:
      upgrade-node:
        runs-on: ubuntu-latest
        steps:
          - name: Azure Login
            uses: Azure/login@v1.4.6
            with:
              creds: ${{ secrets.AZURE_CREDENTIALS }}
          - name: Upgrade node images
            uses: Azure/cli@v1.0.8
            with:
              inlineScript: az aks upgrade -g {resourceGroupName} -n {aksClusterName} --node-image-only --yes
    ```

    > [!TIP]
    > You can decouple the `-g` and `-n` parameters from the command by creating new repository secrets like you did for `AZURE_CREDENTIALS`.
    >
    > If you create secrets for these parameters, you need to replace the `{resourceGroupName}` and `{aksClusterName}` placeholders with their secret counterparts. For example, `${{secrets.RESOURCE_GROUP_NAME}}` and `${{secrets.AKS_CLUSTER_NAME}}`

6. Rename the YAML to `upgrade-node-images.yml`.
7. Select **Commit changes...**, add a commit message, and then select **Commit changes**.

## Run the GitHub Action manually

You can run the workflow manually in addition to the scheduled run by adding a new `on` trigger called `workflow_dispatch`.

> [!NOTE]
> If you want to upgrade a single node pool instead of all node pools on the cluster, add the `--name` parameter to the `az aks nodepool upgrade` command to specify the node pool name. For example:
>
> ```azurecli-interactive
> az aks nodepool upgrade -g {resourceGroupName} --cluster-name {aksClusterName} --name {{nodePoolName}} --node-image-only
> ```

* Add the `workflow_dispatch` trigger to the `on` key:

    ```yml
    name: Upgrade cluster node images
    on:
      schedule:
        - cron: '0 3 */15 * *'
      workflow_dispatch:
    ```

    Your completed YAML should look similar to the following:

    ```yml
        name: Upgrade cluster node images
        on:
          schedule:
            - cron: '0 3 */15 * *'
          workflow_dispatch:
        jobs:
          upgrade-node:
            runs-on: ubuntu-latest
            steps:
              - name: Azure Login
                uses: Azure/login@v1.4.6
                with:
                  creds: ${{ secrets.AZURE_CREDENTIALS }}
              - name: Upgrade node images
                uses: Azure/cli@v1.0.8
                with:
                  inlineScript: az aks upgrade -g {resourceGroupName} -n {aksClusterName} --node-image-only --yes
              # Code for upgrading one or more node pools
    ```

## Next steps

For more information about AKS upgrades, see the following articles and resources:

* [AKS release notes](https://github.com/Azure/AKS/releases)
* [Upgrade an AKS cluster][cluster-upgrades-article]

<!-- LINKS - external -->
[github]: https://github.com
[profile-repository]: https://docs.github.com/en/free-pro-team@latest/github/setting-up-and-managing-your-github-profile/about-your-profile

<!-- LINKS - internal -->
[aks-quickstart-cli]: ./learn/quick-kubernetes-deploy-cli.md
[aks-quickstart-portal]: ./learn/quick-kubernetes-deploy-portal.md
[aks-quickstart-powershell]: ./learn/quick-kubernetes-deploy-powershell.md
[install-azure-cli]: /cli/azure/install-azure-cli
[managed-node-upgrades-article]: node-image-upgrade.md
[cluster-upgrades-article]: upgrade-cluster.md
[auto-upgrade-node-image]: auto-upgrade-node-image.md
[azure-built-in-roles]: ../role-based-access-control/built-in-roles.md
[azure-rbac-scope-levels]: ../role-based-access-control/scope-overview.md#scope-format
[az-ad-sp-create-for-rbac]: /cli/azure/ad/sp#az-ad-sp-create-for-rbac

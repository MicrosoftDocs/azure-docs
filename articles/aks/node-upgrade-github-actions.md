---
title: Handle AKS node upgrades with GitHub Actions
titleSuffix: Azure Kubernetes Service
description: Learn how to update AKS nodes using GitHub Actions
ms.topic: article
ms.custom: devx-track-azurecli
ms.date: 11/27/2020
#Customer intent: As a cluster administrator, I want to know how to automatically apply Linux updates and reboot nodes in AKS for security and/or compliance
---

# Apply security updates to Azure Kubernetes Service (AKS) nodes automatically using GitHub Actions

Security updates are a key part of maintaining your AKS cluster's security and compliance with the latest fixes for the underlying OS. These updates include OS security fixes or kernel updates. Some updates require a node reboot to complete the process.

Running `az aks upgrade` gives you a zero downtime way to apply updates. The command handles applying the latest updates to all your cluster's nodes, cordoning and draining traffic to the nodes, and restarting the nodes, then allowing traffic to the updated nodes. If you update your nodes using a different method, AKS will not automatically restart your nodes.

> [!NOTE]
> The main difference between `az aks upgrade` when used with the `--node-image-only` flag is that, when it's used, only the node images will be upgraded. If omitted, both the node images and the Kubernetes control plane version will be upgraded. You can check [the docs for managed upgrades on nodes][managed-node-upgrades-article] and [the docs for cluster upgrades][cluster-upgrades-article] for more in-depth information.

All Kubernetes' nodes run in a standard Azure virtual machine (VM). These VMs can be Windows or Linux-based. The Linux-based VMs use an Ubuntu image, with the OS configured to automatically check for updates every night.

When you use the `az aks upgrade` command, Azure CLI creates a surge of new nodes with the latest security and kernel updates, these nodes are initially cordoned to prevent any apps from being scheduled to them until the update is finished. After completion, Azure cordons (makes the node unavailable for scheduling of new workloads) and drains (moves the existent workloads to other node) the older nodes and uncordon the new ones, effectively transferring all the scheduled applications to the new nodes.

This process is better than updating Linux-based kernels manually because Linux requires a reboot when a new kernel update is installed. If you update the OS manually, you also need to reboot the VM, manually cordoning and draining all the apps.

This article shows you how you can automate the update process of AKS nodes. You'll use GitHub Actions and Azure CLI to create an update task based on `cron` that runs automatically.

Node image upgrades can also be performed automatically, and scheduled by using planned maintenance. For more details, see [Automatically upgrade node images][auto-upgrade-node-image].

## Before you begin

This article assumes that you have an existing AKS cluster. If you need an AKS cluster, see the AKS quickstart [using the Azure CLI][aks-quickstart-cli], [using Azure PowerShell][aks-quickstart-powershell], or [using the Azure portal][aks-quickstart-portal].

You also need the Azure CLI version 2.0.59 or later installed and configured. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI][install-azure-cli].

This article also assumes you have a [GitHub][github] account to create your actions in.

## Create a timed GitHub Action

`cron` is a utility that allows you to run a set of commands, or job, on an automated schedule. To create job to update your AKS nodes on an automated schedule, you'll need a repository to host your actions. Usually, GitHub actions are configured in the same repository as your application, but you can use any repository. For this article we'll be using your [profile repository][profile-repository]. If you don't have one, create a new repository with the same name as your GitHub username.

1. Navigate to your repository on GitHub
2. Select the **Actions** tab at the top of the page.
3. If you already set up a workflow in this repository, you'll be directed to the list of completed runs, in this case, select the **New Workflow** button. If this is your first workflow in the repository, GitHub will present you with some project templates, select the **Set up a workflow yourself** link below the description text.
4. Change the workflow `name` and `on` tags similar to the below. GitHub Actions use the same [POSIX cron syntax][cron-syntax] as any Linux-based system. In this schedule, we're telling the workflow to run every 15 days at 3am.

    ```yml
    name: Upgrade cluster node images
    on:
      schedule:
        - cron: '0 3 */15 * *'
    ```

5. Create a new job using the below. This job is named `upgrade-node`, runs on an Ubuntu agent, and will connect to your Azure CLI account to execute the needed steps to upgrade the nodes.

    ```yml
    name: Upgrade cluster node images

    on:
      schedule:
        - cron: '0 3 */15 * *'

    jobs:
      upgrade-node:
        runs-on: ubuntu-latest
    ```

## Set up the Azure CLI in the workflow

In the `steps` key, you'll define all the work the workflow will execute to upgrade the nodes.

Download and sign in to the Azure CLI.

1. On the right-hand side of the GitHub Actions screen, find the *marketplace search bar* and type **"Azure Login"**.
2. You'll get as a result, an Action called **Azure Login** published **by Azure**:

      :::image type="content" source="media/node-upgrade-github-actions/azure-login-search.png" alt-text="Search results showing two lines, the first action is called 'Azure Login' and the second 'Azure Container Registry Login'":::

3. Select **Azure Login**. On the next screen, select the **copy icon** in the top right of the code sample.

    :::image type="content" source="media/node-upgrade-github-actions/azure-login.png" alt-text="Azure Login action result pane with code sample below, red square around a copy icon highlights the select spot":::

4. Paste the following under the `steps` key:

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
              uses: Azure/login@v1.4.3
              with:
                creds: ${{ secrets.AZURE_CREDENTIALS }}
      ```

5. From the Azure CLI, run the following command to generate a new username and password.

    > [!NOTE]
    > This example creates the `Contributor` role at the *Subscription* scope. You may provide the role and scope that meets your needs. For more information, see [Azure built-in roles][azure-built-in-roles] and [Azure RBAC scope levels][azure-rbac-scope-levels].

    ```azurecli-interactive
    az ad sp create-for-rbac --role Contributor --scopes /subscriptions/{subscriptionID} -o json
    ```

    The output should be similar to the following json:

    ```output
    {
      "clientId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
      "clientSecret": "xXxXxXxXx",
      "subscriptionId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
      "tenantId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"      
      "activeDirectoryEndpointUrl": "https://login.microsoftonline.com",
      "resourceManagerEndpointUrl": "https://management.azure.com/",
      "activeDirectoryGraphResourceId": "https://graph.windows.net/",
      "sqlManagementEndpointUrl": "https://management.core.windows.net:8443/",
      "galleryEndpointUrl": "https://gallery.azure.com/",
      "managementEndpointUrl": "https://management.core.windows.net/"
    }
    ```

6. **In a new browser window** navigate to your GitHub repository and open the **Settings** tab of the repository. Select **Secrets** then, select **New Repository Secret**.
7. For *Name*, use `AZURE_CREDENTIALS`.
8. For *Value*, add the entire contents from the output of the previous step where you created a new username and password.

    :::image type="content" source="media/node-upgrade-github-actions/azure-credential-secret.png" alt-text="Form showing AZURE_CREDENTIALS as secret title, and the output of the executed command pasted as JSON":::

9. Select **Add Secret**.

The CLI used by your action will be logged to your Azure account and ready to run commands.

To create the steps to execute Azure CLI commands.

1. Navigate to the **search page** on *GitHub marketplace* on the right-hand side of the screen and search *Azure CLI Action*. Choose *Azure CLI Action by Azure*.

    :::image type="content" source="media/node-upgrade-github-actions/azure-cli-action.png" alt-text="Search result for 'Azure CLI Action' with first result being shown as made by Azure":::

1. Select the copy button on the *GitHub marketplace result* and paste the contents of the action in the main editor, below the *Azure Login* step, similar to the following:

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
            uses: Azure/login@v1.4.3
            with:
              creds: ${{ secrets.AZURE_CREDENTIALS }}
          - name: Upgrade node images
            uses: Azure/cli@v1.0.6
            with:
              inlineScript: az aks upgrade -g {resourceGroupName} -n {aksClusterName} --node-image-only --yes
    ```

    > [!TIP]
    > You can decouple the `-g` and `-n` parameters from the command by adding them to secrets similar to the previous steps. Replace the `{resourceGroupName}` and `{aksClusterName}` placeholders by their secret counterparts, for example `${{secrets.RESOURCE_GROUP_NAME}}` and `${{secrets.AKS_CLUSTER_NAME}}`

1. Rename the file to `upgrade-node-images`.
1. Select **Start Commit**, add a message title, and save the workflow.

Once you create the commit, the workflow will be saved and ready for execution.

> [!NOTE]
> To upgrade a single node pool instead of all node pools on the cluster, add the `--name` parameter to the `az aks nodepool upgrade` command to specify the node pool name. For example:
> ```azurecli-interactive
> az aks nodepool upgrade -g {resourceGroupName} --cluster-name {aksClusterName} --name {{nodePoolName}} --node-image-only
> ```

## Run the GitHub Action manually

You can run the workflow manually, in addition to the scheduled run, by adding a new `on` trigger called `workflow_dispatch`. The finished file should look like the YAML below:

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
        uses: Azure/login@v1.4.3
        with:
          creds: ${{ secrets.AZURE_CREDENTIALS }}

      # Code for upgrading one or more node pools
```

## Next steps

- See the [AKS release notes](https://github.com/Azure/AKS/releases) for information about the latest node images.
- Learn how to upgrade the Kubernetes version with [Upgrade an AKS cluster][cluster-upgrades-article].
- Learn more about multiple node pools with [Create multiple node pools][use-multiple-node-pools].
- Learn more about [system node pools][system-pools]
- To learn how to save costs using Spot instances, see [add a spot node pool to AKS][spot-pools]

<!-- LINKS - external -->
[github]: https://github.com
[profile-repository]: https://docs.github.com/en/free-pro-team@latest/github/setting-up-and-managing-your-github-profile/about-your-profile
[cron-syntax]: https://pubs.opengroup.org/onlinepubs/9699919799/utilities/crontab.html#tag_20_25_07

<!-- LINKS - internal -->
[aks-quickstart-cli]: ./learn/quick-kubernetes-deploy-cli.md
[aks-quickstart-portal]: ./learn/quick-kubernetes-deploy-portal.md
[aks-quickstart-powershell]: ./learn/quick-kubernetes-deploy-powershell.md
[install-azure-cli]: /cli/azure/install-azure-cli
[managed-node-upgrades-article]: node-image-upgrade.md
[cluster-upgrades-article]: upgrade-cluster.md
[system-pools]: use-system-pools.md
[spot-pools]: spot-node-pool.md
[use-multiple-node-pools]: create-node-pools.md
[auto-upgrade-node-image]: auto-upgrade-node-image.md
[azure-built-in-roles]: ../role-based-access-control/built-in-roles.md
[azure-rbac-scope-levels]: ../role-based-access-control/scope-overview.md#scope-format

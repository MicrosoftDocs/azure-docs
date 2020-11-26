---
title: Handle AKS node upgrades with GitHub Actions
titleSuffix: Azure Kubernetes Service
description: Learn how to update AKS nodes using GitHub Actions
services: container-service
ms.topic: article
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

## Before you begin

This article assumes that you have an existing AKS cluster. If you need an AKS cluster, see the AKS quickstart [using the Azure CLI][aks-quickstart-cli] or [using the Azure portal][aks-quickstart-portal].

You also need the Azure CLI version 2.0.59 or later installed and configured. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI][install-azure-cli].

This article also assumes you have a [GitHub][github] account to create your actions in.

## Create a timed GitHub Action

`cron` is a utility that allows you to run a set of commands, or job, on an automated schedule. To create job to update your AKS nodes on an automated schedule, you'll need a repository to host your actions. Usually, GitHub actions are configured in the same repository as your application, but you can use any repository. For this article we'll be using your [profile repository][profile-repository]. If you don't have one, create a new repository with the same name as your GitHub username.

1. Click on the **Actions** tab at the top of the page.
1. If you already set up a workflow in this repository, you'll be directed to the list of completed runs, in this case, click on the **New Workflow** button. If this is your first workflow in the repository, GitHub will present you with some project templates, click on the **Set up a workflow yourself** link below the description text.
1. Change the workflow `name` and `on` tags similar to the below. GH Actions use the same [POSIX cron syntax][cron-syntax] as any Linux-based system. In this schedule, we're telling the workflow to run every 15 days at 3am.

    To do that, you'll change the `name` and `on` tags to the following:

    ```yml
    name: Upgrade cluster node images
    on:
      schedule:
        - cron: '0 3 */15 * *'
    ```

    GH Actions use the same [POSIX cron syntax][cron-syntax] as any Linux-based system. In this schedule, we're telling the workflow to twice a month, at every 15 days at 3am.

1. Create a new job using the below. This job is named `upgrade-node`, runs on an Ubuntu agent, and will connect to your Azure CLI account to execute the needed steps to upgrade the nodes.

    Edit your file to look like the following YAML:

    ```yml
    name: Upgrade cluster node images

    on:
      schedule:
        - cron: '0 3 */15 * *'

    jobs:
      upgrade-node:
        runs-on: ubuntu-latest
    ```

## Sign in to Azure

In the `steps` key, you'll define all the work the workflow will execute to upgrade the nodes.

The first step is to download and sign in to the Azure CLI.

1. On the right-hand side of the screen, find the marketplace search bar and type **"Azure CLI"**.
1. There should be two main results published **by Azure**. One called **Azure CLI Action** and another one called **Azure Login**.

      :::image type="content" source="media/node-upgrade-github-actions/search-results.png" alt-text="Search results showing two lines, the first action is called 'Azure CLI Action' and the second 'Azure Login'":::

1. Click on **Azure Login**. Then, on the new screen that shows up, click the **copy icon** in the top right of the code sample.

    :::image type="content" source="media/node-upgrade-github-actions/azure-login.png" alt-text="Azure Login action result pane with code sample below, red square around a copy icon highlights the click spot":::

1. Paste the following under the `steps` key:

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
            uses: Azure/login@v1.1
            with:
              creds: ${{ secrets.AZURE_CREDENTIALS }}
    ```

1. **In a new tab** open the **Settings** tab of the repository and click on **Secrets**, once there, click on **New Repository Secret** name it `AZURE_CREDENTIALS`.
1. Run the following command on any Azure CLI logged terminal to generate a new username and password so the Action can log in using a Service Principal

    ```azurecli-interactive
    az ad sp create-for-rbac -o json
    ```

    The output should be similar to the following json:

    ```output
    {
      "appId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
      "displayName": "azure-cli-xxxx-xx-xx-xx-xx-xx",
      "name": "http://azure-cli-xxxx-xx-xx-xx-xx-xx",
      "password": "xXxXxXxXx",
      "tenant": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
    }
    ```
1. Add the entire contents from the output of the previous step where you created a new username and password.

    :::image type="content" source="media/node-upgrade-github-actions/azure-credential-secret.png" alt-text="Form showing AZURE_CREDENTIALS as secret title, and the output of the executed command pasted as JSON":::

1. Click **Add Secret**.

## Execute Azure Commands

Now that you added the login step, your CLI will be logged to your Azure account and ready to receive new commands. You'll create two steps to execute Azure CLI commands in sequence.

### Install preview extension

1. Go back to the marketplace **search page** on the right-hand side of the screen and type *"Azure CLI Action"*. And click on the first result made **by Azure**

    :::image type="content" source="media/node-upgrade-github-actions/azure-cli-action.png" alt-text="Search result for 'Azure CLI Action' with first result being shown as made by Azure":::

1. As you did with the previous steps, copy the contents of the action the main editor below the last step, you'll have a file similar to the file below.

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
            uses: Azure/login@v1.1
            with:
              creds: ${{ secrets.AZURE_CREDENTIALS }}
          - name: Install preview plugin
            uses: Azure/cli@v1.0.0
            with:
              inlineScript:
    ```

1. The first script you need to execute is the script to add the `aks-preview` plugin to the CLI.

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
            uses: Azure/login@v1.1
            with:
              creds: ${{ secrets.AZURE_CREDENTIALS }}
          - name: Install preview plugin
            uses: Azure/cli@v1.0.0
            with:
              inlineScript: az extension add --name aks-preview
    ```

### Upgrade All Node Pools

If you want to upgrade all node pools in a cluster at once, there's no need to specify the pool's name, just the AKS cluster name and resource group.

1. Now copy the last command and add a second command to upgrade the nodes.

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
            uses: Azure/login@v1.1
            with:
              creds: ${{ secrets.AZURE_CREDENTIALS }}
          - name: Install preview plugin
            uses: Azure/cli@v1.0.0
            with:
              inlineScript: az extension add --name aks-preview
          - name: Upgrade node images
            uses: Azure/cli@v1.0.0
            with:
              inlineScript: az aks upgrade -g {resourceGroupName} -n {aksClusterName} --node-image-only
    ```

    > [!TIP]
    > You can decouple the `-g` and `-n` parameters from the command by adding them to secrets like you did in the previous steps. If that's the case, replace the `{resourceGroupName}` and `{aksClusterName}` placeholders by their secret counterparts `${{secrets.RESOURCE_GROUP_NAME}}` and `${{secrets.AKS_CLUSTER_NAME}}`

1. Rename the file to a meaningful name by typing on the top text input next to the **Cancel** button.
1. Click **Start Commit**, add a message title, and save the workflow.

After the commit, the workflow will be saved and ready for execution.

### Upgrade a Single Node Pool

If you want to upgrade a single node pool in a cluster, you can specify the pool's name via the `az aks nodepool` command.

Specifying a node pool is useful when creating upgrades on production nodes that should take place on a different schedule than the rest of the cluster.

1. Copy the last command and add a second command to upgrade the nodes in the specific node pool.

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
            uses: Azure/login@v1.1
            with:
              creds: ${{ secrets.AZURE_CREDENTIALS }}
          - name: Install preview plugin
            uses: Azure/cli@v1.0.0
            with:
              inlineScript: az extension add --name aks-preview
          - name: Upgrade node images
            uses: Azure/cli@v1.0.0
            with:
              inlineScript: az aks nodepool upgrade -g {resourceGroupName} --cluster-name {aksClusterName} --name {{nodePoolName}} --node-image-only
    ```

    > [!TIP]
    > You can decouple the `-g`, `--cluster-name`, and `--name` parameters from the command by adding them to secrets like you did in the previous steps. If that's the case, replace the `{resourceGroupName}`, `{aksClusterName}`, and `{nodePoolName}` placeholders by their secret counterparts `${{secrets.RESOURCE_GROUP_NAME}}`, `${{secrets.AKS_CLUSTER_NAME}}`, and `${{secrets.NODE_POOL_NAME}}`

1. Rename the file to a meaningful name by typing on the top text input next to the **Cancel** button.
1. Click **Start Commit**, add a message title, and save the workflow.

After the commit, the workflow will be saved and ready for execution.

## Running manually

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
            uses: Azure/login@v1.1
            with:
              creds: ${{ secrets.AZURE_CREDENTIALS }}
          - name: Install preview plugin
            uses: Azure/cli@v1.0.0
            with:
              inlineScript: az extension add --name aks-preview

          # Code for upgrading one or more node pools
    ```

<!-- LINKS - external -->
[github]: https://github.com
[profile-repository]: https://docs.github.com/en/free-pro-team@latest/github/setting-up-and-managing-your-github-profile/about-your-profile
[cron-syntax]: https://pubs.opengroup.org/onlinepubs/9699919799/utilities/crontab.html#tag_20_25_07

<!-- LINKS - internal -->
[aks-quickstart-cli]: kubernetes-walkthrough.md
[aks-quickstart-portal]: kubernetes-walkthrough-portal.md
[install-azure-cli]: /cli/azure/install-azure-cli
[managed-node-upgrades-article]: node-image-upgrade.md
[cluster-upgrades-article]: upgrade-cluster.md

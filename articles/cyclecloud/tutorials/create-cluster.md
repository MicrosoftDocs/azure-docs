---
title: Tutorial - Create a cluster
description: In this tutorial, learn how to create a cluster using Azure CycleCloud. Select a cluster type, add new cluster settings and usage alerts, and start the cluster.
author: adriankjohnson
ms.date: 06/02/2020
ms.author: adjohnso
---

# Azure CycleCloud Tutorial 1: Create and Run a Simple HPC Cluster

In this tutorial, you will start a new cluster using PBS Pro as a scheduler and submit a simple example job that calculates pi.  create an alert for the cluster to notify you if it exceeds a monthly budget.

## Select a Cluster Type

Click on **Clusters** in the main menu, which will bring up the list of available cluster types. These default cluster types expose a limited number of parameters in order to simplify and standardize cluster creation.

> [!NOTE]
> Azure CycleCloud ships with a limited number of supported cluster types by default, but many others are maintained in [CycleCloud GitHub](https://github.com/Azure?q=cyclecloud) and can easily be imported into CycleCloud.

In this tutorial, you will create an HPC cluster configured with the [PBS Pro scheduler](~/pbspro.md). Click the PBS Professional OSS icon under **Schedulers** on the **New Cluster** page to bring up the cluster creation wizard.

::: moniker range="=cyclecloud-7"
:::image type="content" source="../images/version-7/new-pbspro-cluster.png" alt-text="Create New Cluster screen":::
::: moniker-end

::: moniker range=">=cyclecloud-8"
:::image type="content" source="../images/version-8/new-openpbs-cluster.png" alt-text="Create New Cluster screen":::
::: moniker-end

## New Cluster Settings

You will need to customize a few configuration settings. On the **About** page, enter a new cluster name such as "pbspro". Click **Next**.

::: moniker range="=cyclecloud-7"
:::image type="content" source="../images/version-7/new-cluster-name.png" alt-text="Cluster Creation Wizard screen":::
::: moniker-end

::: moniker range=">=cyclecloud-8"
:::image type="content" source="../images/version-8/new-cluster-name.png" alt-text="Cluster Creation Wizard screen":::
::: moniker-end

### Required Settings

Under **Virtual Machines**, use the dropdown to select your region. **Master VM Type** and **Execute VM Type** refer to the infrastructure used in your cluster, and should be automatically populated for you.

Azure CycleCloud will automatically scale your cluster if you choose to enable it on this screen. For this tutorial, ensure that **Autoscale** is selected, and that **Max Cores** has been set to 100.

Under **Networking**, select the subnet to use for the compute infrastructure. Use the default subnet you created in the quickstart, then click **Next**.

::: moniker range="=cyclecloud-7"
:::image type="content" source="../images/version-7/quickstart-required-settings.png" alt-text="New Cluster Required Settings screen":::
::: moniker-end

::: moniker range=">=cyclecloud-8"
:::image type="content" source="../images/version-8/quickstart-required-settings.png" alt-text="New Cluster Required Settings screen":::
::: moniker-end

### Advanced Settings

Your credentials were provided to CycleCloud when you deployed Azure CycleCloud into your subscription. They should be selected here for you.

The Software options allow you to select the operating system and any custom specifications you have. The default CycleCloud cluster template has selected the appropriate options for you, and do not need to be changed at this time.

The Advanced Networking options allow you to control access to and from your cluster. The default settings here are appropriate and do not need to be changed. Click **Save**.

::: moniker range="=cyclecloud-7"
:::image type="content" source="../images/version-7/quickstart-advanced-settings.png" alt-text="New Cluster Advanced Settings screen":::
::: moniker-end

::: moniker range=">=cyclecloud-8"
:::image type="content" source="../images/version-8/quickstart-advanced-settings.png" alt-text="New Cluster Advanced Settings screen":::
::: moniker-end

::: moniker range=">=cyclecloud-8"
### Network Attached Storage Settings

This section allows you to configure the network attached storage options for your cluster. 

:::image type="content" source="../images/version-8/quickstart-networkattachedstorage-settings.png" alt-text="New Cluster Network Attached Storage Settings screen":::

By default, the `/shared/` directory for the cluster is an NFS share, exported from the cluster headnode (The `Builtin` `NFS Type` option). This `/shared` export is created on a mounted Azure Managed Disk, and the `Size` option allows you to change the amount of space avaiable on that disk.

Alternatively, using the `NFS Type` dropdown to choose "External NFS", allows you to mount a different storage, such as Azure NetApp Files or the NFS endpoint on Azure Blob Storage.
::: moniker-end

## Usage Alert

Before you start your cluster, add an alert that will notify you if the accumulated usage cost has reached a specific limit. Click **Create New Alert** in the cluster summary window.

::: moniker range="=cyclecloud-7"
:::image type="content" source="../images/version-7/cluster-usage-alert.png" alt-text="Cluster Summary Window":::
::: moniker-end

::: moniker range=">=cyclecloud-8"
:::image type="content" source="../images/version-8/cluster-usage-alert.png" alt-text="Cluster Summary Window":::
::: moniker-end

Set the Budget to $100.00 per month. Enable the Notifications, and add your email address in the **Recipients** field. This will send you an email when the cost hits $100 within the selected timeframe. Click **Save** to activate this alert.

:::image type="content" source="../images/create-new-alert.png" alt-text="Cluster Usage Alert Window":::

## Start the Cluster

It's time to put your cluster to work. In the cluster summary window, click **Start** under the cluster name.

::: moniker range="=cyclecloud-7"
:::image type="content" source="../images/version-7/start-cluster.png" alt-text="Cluster Summary - Start":::
::: moniker-end

::: moniker range=">=cyclecloud-8"
:::image type="content" source="../images/version-8/start-cluster.png" alt-text="Cluster Summary - Start":::
::: moniker-end

Confirm that you want to start the cluster. Once the cluster is started, it will take several minutes to provision and orchestrate the VM for the cluster's master node, as well as install and configure the PBS Pro scheduler. You can monitor the progress in the Cluster VM Details tab, as well as in the Event Log.

Tutorial 1 ends here. You've used the GUI to configure your CycleCloud installation, set a budget alert of $100, and started your cluster.

> [!div class="nextstepaction"]
> [Continue to Tutorial 2](./submit-jobs.md)

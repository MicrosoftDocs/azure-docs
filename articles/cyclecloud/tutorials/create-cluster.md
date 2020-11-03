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

:::image type="content" source="../images/new-pbspro-cluster.png" alt-text="Create New Cluster screen":::

## New Cluster Settings

You will need to customize a few configuration settings. On the **About** page, enter a new cluster name such as "pbspro". Click **Next**.

:::image type="content" source="../images/new-cluster-name.png" alt-text="Cluster Creation Wizard screen":::

### Required Settings

Under **Virtual Machines**, use the dropdown to select your region. **Master VM Type** and **Execute VM Type** refer to the infrastructure used in your cluster, and should be automatically populated for you.

Azure CycleCloud will automatically scale your cluster if you choose to enable it on this screen. For this tutorial, ensure that **Autoscale** is selected, and that **Max Cores** has been set to 100.

Under **Networking**, select the subnet to use for the compute infrastructure. Use the default subnet you created in the quickstart, then click **Next**.

:::image type="content" source="../images/quickstart-required-settings.png" alt-text="New Cluster Required Settings screen":::

### Advanced Settings

Your credentials were provided to CycleCloud when you deployed Azure CycleCloud into your subscription. They should be selected here for you.

The Software options allow you to select the operating system and any custom specifications you have. The default CycleCloud cluster template has selected the appropriate options for you, and do not need to be changed at this time.

The Advanced Networking options allow you to control access to and from your cluster. The default settings here are appropriate and do not need to be changed. Click **Save**.

:::image type="content" source="../images/quickstart-advanced-settings.png" alt-text="New Cluster Advanced Settings screen":::

## Usage Alert

Before you start your cluster, add an alert that will notify you if the accumulated usage cost has reached a specific limit. Click **Create New Alert** in the cluster summary window.

:::image type="content" source="../images/cluster-usage-alert.png" alt-text="Cluster Summary Window":::

Set the Budget to $100.00 per month. Enable the Notifications, and add your email address in the **Recipients** field. This will send you an email when the cost hits $100 within the selected timeframe. Click **Save** to activate this alert.

:::image type="content" source="../images/create-new-alert.png" alt-text="Cluster Usage Alert Window":::

## Start the Cluster

It's time to put your cluster to work. In the cluster summary window, click **Start** under the cluster name.

:::image type="content" source="../images/start-cluster.png" alt-text="Cluster Summary - Start":::

Confirm that you want to start the cluster. Once the cluster is started, it will take several minutes to provision and orchestrate the VM for the cluster's master node, as well as install and configure the PBS Pro scheduler. You can monitor the progress in the Cluster VM Details tab, as well as in the Event Log.

Tutorial 1 ends here. You've used the GUI to configure your CycleCloud installation, set a budget alert of $100, and started your cluster.

> [!div class="nextstepaction"]
> [Continue to Tutorial 2](./submit-jobs.md)

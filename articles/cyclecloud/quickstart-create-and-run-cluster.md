---
title: Azure CycleCloud Quickstart - Create and Run a Cluster | Microsoft Docs
description: In this quickstart, you will create an HPC cluster
author: KimliW
ms.date: 08/01/2018
ms.author: adjohnso
---

# Azure CycleCloud Quickstart 2: Create and Run a Simple HPC Cluster

In this quickstart, you will start a new cluster using PBS Pro as a scheduler and LAMMPS as a solver, and create an alert for the cluster to notify you if it exceeds a monthly budget.

## Select a Cluster Type

Click on **Clusters** in the main menu, which will bring up the list of available cluster types. These default cluster types expose a limited number of parameters in order to simplify and standardize cluster creation.

> [!NOTE]
> Azure CycleCloud ships with a limited number of supported cluster types by default, but many others are maintained in [CycleCloud GitHub](https://github.com/Azure?q=cyclecloud) and can easily be imported into CycleCloud.

In this quickstart, you will create an HPC cluster configured with [LAMMPS](https://lammps.sandia.gov/). Click the LAMMPS icon under "Applications" on the **New Cluster** page to bring up the cluster creation wizard.

![Create New Cluster screen](~/images/new-lammps-cluster.png)

## New Cluster Settings

The ARM template set some of these settings for you, but others need to be set here. On the **About** page, enter a new cluster name such as "LammpsCluster". Click **Next**.

![Cluster Creation Wizard screen](~/images/new-cluster-name.png)

### Required Settings

Under **Virtual Machines**, use the dropdown to select your region. **Master VM Type** and **Execute VM Type** refer to the infrastructure used in your cluster, and should be automatically populated for you.

Azure CycleCloud will automatically scale your cluster if you choose to enable it on this screen. For this quickstart, ensure that Autoscale is selected, and that **Max Cores** has been set to 100.

Under **Networking**, select the subnet to use for the compute infrastructure. Use the subnet ID that ends in `-compute`, then click **Next**.

![New Cluster Required Settings screen](~/images/quickstart-required-settings.png)

### Advanced Settings

Your credentials were provided to CycleCloud when you deployed Azure CycleCloud into your subscription in the previous quickstart. They should be selected here for you.

The Software options allow you to select the operating system and any custom specifications you have. The default CycleCloud cluster template has selected the appropriate options for you, and do not need to be changed at this time.

The Advanced Networking options allow you to control access to and from your cluster. The default settings here are appropriate and do not need to be changed. Click **Save**.

![New Cluster Advanced Settings screen](~/images/quickstart-advanced-settings.png)

## Usage Alert

Before you start your cluster, add an alert that will notify you if the accumulated usage cost has reached a specific limit. Click **Create New Alert** in the cluster summary window.

![Cluster Summary Window](~/images/cluster-usage-alert.png)

Set the Budget to $100.00 per month. Enable the Notifications, and add your email address in the **Recipients** field. This will send you an email when the cost hits $100 within the selected timeframe. Click **Save** to activate this alert.

![Cluster Usage Alert Window](~/images/create-new-alert.png)

## Start the Cluster

It's time to put your cluster to work. In the cluster summary window, click **Start** under the cluster name.

![Cluster Summary - Start](~/images/start-cluster.png)

Confirm that you want to start the cluster. Once the cluster is started, it will take several minutes to provision and orchestrate the VM for the cluster's master node, as well as install and configure the Grid Engine job queue and scheduler. You can monitor the progress in the Cluster VM Details tab, as well as in the Event Log.

Quickstart 2 ends here. You've used the GUI to configure your CycleCloud installation, set a budget alert of $100, and started your cluster.

> [!div class="nextstepaction"]
> [Continue to Quickstart 3](quickstart-submit-jobs.md)

---
title: Deploy the remote monitoring solution - Azure | Microsoft Docs 
description: This tutorial shows you how to provision the remote monitoring preconfigured solution from azureiotsuite.com.
services: ''
suite: iot-suite
author: dominicbetts
manager: timlt
ms.author: dobett
ms.service: iot-suite
ms.date: 08/09/2017
ms.topic: article
ms.devlang: NA
ms.tgt_pltfrm: NA
ms.workload: NA
---

# Deploy the remote monitoring preconfigured solution

This tutorial shows you how to provision the remote monitoring preconfigured solution. You deploy the solution from azureiotsuite.com. You can also deploy the solution using the CLI, to learn about this option see [Deploy a preconfigured solution from the command line](https://github.com/Azure/azure-iot-pcs-remote-monitoring-dotnet/wiki/Developer-Reference-Guide#deploy-a-pcs-from-the-command-line).

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Configure the preconfigured solution
> * Deploy the preconfigured solution
> * Sign in to the preconfigured solution

## Prerequisites

To complete this tutorial, you need an active Azure subscription.

If you don’t have an account, you can create a free trial account in just a couple of minutes. For details, see [Azure Free Trial](http://azure.microsoft.com/pricing/free-trial/).

## Deploy the preconfigured solution

Before you deploy the preconfigured solution to your Azure subscription, you must choose some configuration options:

1. Log on to [azureiotsuite.com](https://www.azureiotsuite.com) using your Azure account credentials, and click **+** to create a new solution:

    ![Create a new solution](media/iot-suite-remote-monitoring-deploy/createnewsolution.png)

1. Click **Select** on the **Remote monitoring preview** tile.

    ![Choose remote monitoring](media/iot-suite-remote-monitoring-deploy/remotemonitoring.png)

1. On the **Create Remote Monitoring solution** page, enter a **Solution name** for your remote monitoring preconfigured solution.

1. Select a **Basic** or **Standard** deployment. If you are deploying the solution to learn how it works or to run a demonstration, choose the **Basic** option to minimize costs.

1. Choose either **Java** or **.NET** as the language. All the microservices are available as either Java or .NET implementations.

1. Review the **Solution details** panel for more information about your configuration choices.

1. Select the **Subscription** and **Region** you want to use to provision the solution.

1. Click **Create Solution** to begin the provisioning process. This process typically takes several minutes to run:

    ![Remote monitoring solution details](media/iot-suite-remote-monitoring-deploy/createform.png)

For troubleshooting information, see [What to do when a deployment fails](https://github.com/Azure/azure-iot-pcs-remote-monitoring-dotnet/wiki/Developer-Troubleshooting-Guide#what-to-do-when-a-deployment-fails) in the GitHub repository.

## Sign in to the preconfigured solution

When the provisioning process is complete, you can sign in to your remote monitoring preconfigured solution.

1. On the **Provisioned solutions** page, choose your new remote monitoring solution:

    ![Choose new solution](media/iot-suite-remote-monitoring-deploy/choosenew.png)

1. You can view information about your remote monitoring solution in the panel that appears. Choose **Solution dashboard** to connect to your remote monitoring solution.

    > [!NOTE]
    > You can delete your remote monitoring solution from this panel when you are finished with it.

    ![Solution panel](media/iot-suite-remote-monitoring-deploy/solutionpanel.png)

1. The remote monitoring solution dashboard displays in your browser.

## Next steps

In this tutorial, you learned how to:

> [!div class="checklist"]
> * Configure the preconfigured solution
> * Deploy the preconfigured solution
> * Sign in to the preconfigured solution

Now that you have deployed the remote monitoring solution, the next step is to [explore the capabilities of the solution dashboard](./iot-suite-remote-monitoring-explore.md).

<!-- Next tutorials in the sequence -->
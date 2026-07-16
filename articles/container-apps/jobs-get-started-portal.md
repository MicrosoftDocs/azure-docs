---
title: Create a job with Azure Container Apps using the Azure portal
description: Learn to create an on-demand or scheduled job in Azure Container Apps using the Azure portal
services: container-apps
author: craigshoemaker
ms.service: azure-container-apps
ms.custom: build-2023
ms.topic: quickstart
ms.date: 11/06/2025
ms.author: cshoe
---

# Create a job with Azure Container Apps using the Azure portal

Azure Container Apps [jobs](jobs.md) let you run containerized tasks that run for a limited time and then stop. You can start a job manually, set it to run on a schedule, or set it to run when certain events happen.

Jobs work well for tasks like data processing, machine learning, or any situation where you need processing on demand.

In this quickstart, you create a scheduled job. To learn how to create an event-driven job, see [Deploy an event-driven job with Azure Container Apps](tutorial-event-driven-jobs.md).

## Prerequisites

You need an Azure account with an active subscription. If you don't have one, you can [create an account for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn). Also, make sure the Resource Provider "Microsoft.App" is registered.

## Setup

Sign in to the [Azure portal](https://portal.azure.com).

## Create a container app

To create your Container Apps job, start at the Azure portal home page.

1. Search for **Container App Jobs** in the top search bar.
1. Select **Container App Jobs** in the search results.
1. Select the **Create** button.

### Basics tab

In the *Basics* tab, complete the following steps.

1. Enter the following values in the *Project details* section.

    | Setting | Action |
    |---|---|
    | Subscription | Select your Azure subscription. |
    | Resource group | Select **Create new** and enter **jobs-quickstart**. |
    | Container job name |  Enter **my-job**. |

#### Create an environment

Next, create an environment for your container app.

1. Select the appropriate region.

    | Setting | Value |
    |--|--|
    | Region | Select **Central US**. |

1. In the *Create Container Apps environment* field, select the **Create new** link.
1. In the *Create Container Apps Environment* page, on the *Basics* tab, enter the following values:

    | Setting | Value |
    |--|--|
    | Environment name | Enter **my-environment**. |
    | Type | Enter **Workload Profile**. |
    | Zone redundancy | Select **Disabled** |

1. Select the **Create** button at the bottom of the *Create Container App Environment* page.

### Deploy the job

1. In *Job details*, select **Scheduled** for the *Trigger type*.

    In the *Cron expression* field, enter `*/1 * * * *`.

    This expression starts the job every minute.

1. Select the **Next: Container** button at the bottom of the page.

1. In the *Container* tab, enter the following values:

    | Setting | Value |
    |--|--|
    | Name | Enter **main-container**. |
    | Image source | Select **Docker Hub or other registries**. |
    | Image type | Select **Public**. |
    | Registry login server | Enter **mcr.microsoft.com**. |
    | Image and tag | Enter **k8se/quickstart-jobs:latest**. |
    | Workload profile | Select **Consumption**. |
    | CPU and memory | Select **0.25** and **0.5Gi**. |

1. Select the **Review and create** button at the bottom of the page.  

    As the portal verifies the settings in the job, if no errors are found, it enables the *Create* button.  

    Any errors appear on a tab marked with a red dot. If you encounter errors, navigate to the appropriate tab and you find fields containing errors highlighted in red. Once you fix all errors, select **Review and create** again.

1. Select **Create**.

    A page with the message *Deployment is in progress* is displayed. Once the deployment is successful, you see the message: *Your deployment is complete*.

### Verify deployment

1. Select **Go to resource** to view your new Container Apps job.

1. Select the **Execution history** tab.

    The *Execution history* tab displays the status of each job execution. Select the **Refresh** button to update the list. Wait up to a minute for the scheduled job execution to start. Its status changes from *Pending* to *Running* to *Succeeded*.

1. Select **View logs**.

    The logs show the output of the job execution. It might take a few minutes for the logs to appear.

## Clean up resources

If you don't plan to continue using this application, you can delete the Azure Container Apps instance and all the associated services by removing the resource group.

1. Select the **jobs-quickstart** resource group from the *Overview* section.
1. Select the **Delete resource group** button at the top of the resource group *Overview*.
1. Enter the resource group name **jobs-quickstart** in the *Are you sure you want to delete "jobs-quickstart"* confirmation dialog.
1. Select **Delete**.  
    The process to delete the resource group might take a few minutes to complete.

> [!TIP]
> Having issues? Let us know on GitHub by opening an issue in the [Azure Container Apps repo](https://github.com/microsoft/azure-container-apps).

## Next steps

> [!div class="nextstepaction"]
> [Container Apps jobs](jobs.md)

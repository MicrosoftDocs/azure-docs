---
title: 'Tutorial: Troubleshoot an App using Azure SRE Agent (preview) in Azure App Service'
description: Learn how to use SRE Agent and Azure App Service to identify and fix app issues with AI-assisted troubleshooting.
author: msangapu-msft
ms.author: msangapu
ms.topic: tutorial
ms.date: 05/15/2025
---

# Troubleshoot an App Service app using SRE Agent (preview)

> [!NOTE]
> Site Reliability Engineering (SRE) Agent is in preview.

The Azure SRE (Site Reliability Engineering) Agent helps you manage and monitor Azure resources by using AI-enabled capabilities. Agents guide you in solving problems and aid in building resilient, self-healing systems on your behalf. The sample app includes code meant to exhaust memory and cause HTTP 500 errors, so you can diagnose and fix the problem using SRE Agent.

In this tutorial, you will:

> [!div class="checklist"]
> * Create an App Service app using the Azure portal.
> * Deploy a sample app from GitHub.
> * Configure the app with a startup command and enable logging.
> * Create a deployment slot to simulate failure.
> * Set up an Azure SRE Agent (preview) to monitor the app.
> * Trigger a failure by swapping to the broken slot.
> * Use AI-driven chat to diagnose and resolve the issue by rolling back the swap.

[!INCLUDE [quickstarts-free-trial-note](~/reusable-content/ce-skilling/azure/includes/quickstarts-free-trial-note.md)]

## Prerequisites

To complete this tutorial, you need an [Azure subscription](https://azure.microsoft.com/free/).

## Create an App Service app

Start by creating a web app that the SRE Agent will monitor.

1. Sign in to the https://portal.azure.com.
1. In the top search bar, search for **App Services**, then select it from the results.
1. Select **+ Create** and choose **Web App**.


### Configure the Basics tab

In the *Basics* tab, provide the following details:

**Project details**

| Setting         | Value                          |
|-----------------|--------------------------------|
| Subscription     | Your Azure subscription        |
| Resource group   | **Create new** → `my-app-service-group` |

**Instance details**

| Setting         | Value                          |
|-----------------|--------------------------------|
| Name            | `my-sre-app`                   |
| Publish         | **Code**                       |
| Runtime stack   | **PHP 8.4**                    |
| Region          | A region near you              |


1. Select the **Deployment** tab.

1. Under *Authentication settings*, enable **Basic authentication**.

> [!NOTE]
> This is used later for a one-time deployment from GitHub. In production, [disable Basic Auth](configure-basic-auth-disable.md?tabs=portal) and use secure deployment methods like GitHub Actions or Azure DevOps.

1. Select **Review and create**.

    - If validation passes, the **Create** button becomes active.
    - If there are errors, tabs with issues are marked with a red dot. Fix the highlighted fields and try again.

1. Select **Create** to deploy the app.

    Once deployment completes, you’ll see the message: *Your deployment is complete*.

### Deploy the sample app


Now that your App Service app is created, deploy the sample application from GitHub.

1. In the Azure portal, navigate to your newly created App Service by selecting **Go to resource**.

1. In the left-hand menu, under the *Deployment* section, select **Deployment Center**.

1. In the *Settings* tab, configure the following:

    | Property   | Value                                                              |
    |------------|--------------------------------------------------------------------|
    | Source     | **External Git**                                                   |
    | Repository | `https://github.com/Azure-Samples/App-Service-Agent-Tutorial`     | 
    | Branch     | `working`                                                          |


1. Select **Save** to apply the deployment settings.

## Configure the app

Next, configure your app with a startup command and enable logging to support diagnostics with the SRE Agent.

### Set the startup command

The sample app uses NGINX. The default NGINX configuration expects a `50x.html` file in the `/html` directory. The following startup command copies this file from the `wwwroot` directory to the expected location.

1. In the left menu, browse to the *Settings* section and select **Configuration**.


1. Under the *General settings* tab, locate the **Startup Command** field.

1. Enter the following command:

    ```bash
    /home/site/wwwroot/startup.sh
    ```

1. Select **Save** to apply the changes.

### Enable App Service logs

Enable logging so the SRE Agent can collect diagnostic data from your app.

1. In the left menu, browse to the *Monitoring* section and select **App Service logs**.

1. Configure the following settings:

    | Property               | Value           | Remarks                                |
    |------------------------|------------------|----------------------------------------|
    | Application logging    | **File System**  | Enables log collection for diagnostics |
    | Retention Period (Days)| `3`              | Retains logs for 3 days                |

1. Select **Save** to apply the logging configuration.

## Verify the sample app

After deployment and configuration, verify that the sample app is running correctly.

1. In the left menu of your App Service, select **Overview**.

1. Select **Browse** to open the app in a new browser tab.

    > It may take a minute to load as Azure App Service initializes the app on the first request.

1. Once the app loads, test its functionality:

    - Click **Tools** in the app’s navigation bar.
    - Select **Convert to PNG**.

    ![Click `Tools` and select `Convert to PNG`](./media/tutorial-azure-monitor/sample-monitor-app-tools-menu.png)

1. Select the first three images and select **Convert**.

    - The conversion should complete successfully.

    ![Select the first two images](./media/tutorial-azure-monitor/sample-monitor-app-convert-two-images.png)

## Create a deployment slot

To simulate a failure scenario, create a secondary deployment slot.

1. In the left menu of your App Service, under the *Deployment* section, select **Deployment slots**.

1. Select **Add slot**.

1. Enter the following values.


    | Property           | Value         | Remarks                          |
    |--------------------|---------------|----------------------------------|
    | Name               | `broken`      | Name of the slot to simulate failure |
    | Clone settings from| `my-sre-app`  | Copies configuration from the main app |


1. Scroll to the bottom of the dialog window and select **Add**.

    > The slot creation process may take a minute to complete.

### Configure the deployment slot

1. After the slot is created, select the **broken** slot from the list.

1. In the left menu, under the *Deployment* section, select **Deployment Center**.

In the *Settings* tab, configure the following:

    | Property   | Value                                                              |
    |------------|--------------------------------------------------------------------|
    | Source     | **External Git**                                                   |
    | Repository | `https://github.com/Azure-Samples/App-Service-Agent-Tutorial`      |
    | Branch     | `broken`                                                           |

1. Select **Save** to apply the deployment settings.

## Create an SRE Agent

Now, create an Azure SRE Agent to monitor your App Service app.

1. In the Azure portal, search for and select **SRE Agent**.

1. Select **+ Create**.

1. In the *Create agent* window, enter the following values:

    > During this step, you’ll create a new resource group for the agent. This group is separate from the one used for your app.

    | Property         | Value                     | Remarks                                                                 |
    |------------------|---------------------------|-------------------------------------------------------------------------|
    | Subscription     | Your Azure subscription   |                                                                         |
    | Resource group   | `my-sre-agent-group`      | New group for the SRE Agent                                             |
    | Name             | `my-app-service-sre-agent`|                                                                         |
    | Region           | **Sweden Central**        | Required during preview; can monitor resources in any Azure region     |
    | Choose role      | **Contributor**           | Grants the agent permission to take action on your behalf              |

1. Select **Select resource groups**.

1. In the *Select resource groups to monitor* window, search for and select `my-app-service-group`.

1. Select **Save**.

1. Back in the *Create agent* window, select **Create**.

    > The agent creation process may take a few minutes to complete.


## Chat with your agent

Once your SRE Agent is deployed and connected to your resource group, you can interact with it using natural language to monitor and troubleshoot your app.

1. In the Azure portal, search for and select **Azure SRE Agent**.

1. From the list of agents, select **my-app-service-sre-agent**.

1. Select **Chat with agent**.

1. In the chat box, enter the following command:

    ```text
    List my App Service apps
    ```

1. The agent will respond with a list of App Service apps deployed in the `my-app-service-group` resource group.

Now that the agent can see your app, you’re ready to simulate a failure and let the agent help you resolve it.



## Break the app

Now simulate a failure scenario by swapping to the broken deployment slot.

1. In your App Service, go to the *Deployment* section in the left-hand menu and select **Deployment slots**.

1. Select **Swap**.

1. In the *Swap* dialog, configure the following:

    | Property | Value             | Remarks                          |
    |----------|-------------------|----------------------------------|
    | Source   | `my-sre-app-broken` | The slot with the faulty version |
    | Target   | `my-sre-app`        | The production slot              |

1. Scroll to the bottom and select **Start Swap**.

    > The swap may take a minute to complete.

1. Once the swap is complete, browse to the app’s URL.

1. Attempt to convert five images using the app interface:

    ./media/tutorial-azure-monitor/sample-monitor-app-convert-five-images.png

1. The conversion should fail and return an HTTP 500 error:

    ./media/tutorial-azure-monitor/sample-monitor-app-http-500.png

1. Repeat the conversion step a few more times to generate additional HTTP 500 logs.

    > These logs will help the SRE Agent detect and diagnose the issue.


## Fix the app

Now that the app is experiencing failures, use the SRE Agent to diagnose and resolve the issue.

1. In the Azure portal, search for and select **Azure SRE Agent**.

1. From the list of agents, select **my-app-service-sre-agent**.

1. Select **Chat with agent**.

1. In the chat box, enter the following command:

    ```text
    What's wrong with my-sre-app?
    ```

1. The agent will begin analyzing the app’s health. You’ll see diagnostic messages related to availability, CPU and memory usage, and the recent slot swap.

    > Each session may vary, but you should see a message similar to:
    >
    > *“I will now perform mitigation for my-sre-app by swapping the slots back to recover the application to a healthy state. Please note that swapping slots back may not always immediately restore health. I will keep you updated on the progress.”*

1. After a short delay, the agent will prompt you to approve the rollback:

    > *Performing Slot Swap rollback to Restore Application Availability for my-sre-app*  
    > **[Approve]**   **[Deny]**

1. Select **Approve** to initiate the rollback.

1. Once the rollback is complete, the agent will confirm:

    > *The slot swap for my-sre-app has been completed successfully (timestamp). The production slot has been restored. I will now continue with post-mitigation steps:*
    >
    > *• I will ask you for the correct GitHub repo URL to raise an issue for the swap-related downtime.*  
    > *• I will monitor the app and provide an availability update in 5 minutes.*  
    >
    > *Please provide the GitHub repository URL where you want the issue to be raised.*


## Verify the fix

After the SRE Agent rolls back the slot swap, confirm that your app is functioning correctly.

1. Open your App Service app in a browser by selecting **Browse** from the **Overview** page.

1. In the app interface:

    - Click **Tools** in the navigation bar.
    - Select **Convert to PNG**.

    ![Click `Tools` and select `Convert to PNG`](./media/tutorial-azure-monitor/sample-monitor-app-tools-menu.png)

1. Select the first five images and click **Convert**.

    - The conversion should now complete successfully without HTTP 500 errors.

    ![Select the first five images](./media/tutorial-azure-monitor/sample-monitor-app-working.png)

## Clean up resources

If you no longer need the app and agent created in this tutorial, you can delete the associated resource groups to avoid incurring charges.

Repeat the following steps for both of these resource groups:

- `my-app-service-group`
- `my-sre-agent-group`

1. In the Azure portal, navigate to **Resource groups**.

1. Select the resource group you want to delete.

1. From the *Overview* tab, select **Delete resource group**.

1. In the confirmation dialog, enter the name of the resource group.

1. Select **Delete**.

    > Deletion may take a few minutes to complete.

## Next steps

* [Overview of Azure App Service](overview.md)
* [Use Azure Developer CLI for modern app development](/azure/developer/azure-developer-cli/overview)
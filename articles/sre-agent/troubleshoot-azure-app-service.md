---
title: 'Tutorial: Troubleshoot an App Using Azure SRE Agent and Azure App Service Preview'
description: Learn how to use Azure SRE Agent and Azure App Service to identify and fix app problems through AI-assisted troubleshooting.
author: craigshoemaker
ms.author: cshoe
ms.topic: tutorial
ms.date: 10/13/2025
ms.service: azure-sre-agent
---

# Tutorial: Troubleshoot an App Service app by using Azure SRE Agent Preview

> [!NOTE]
> Azure SRE Agent is in. By using SRE Agent, you consent to the product-specific [Supplemental Terms of Use for Microsoft Azures](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

Site reliability engineering (SRE) focuses on creating reliable, scalable systems through automation and proactive management. Azure SRE Agent brings these principles to your cloud environment by providing AI-powered monitoring, troubleshooting, and remediation capabilities.

SRE Agent automates routine operational tasks and provides reasoned insights to help you maintain application reliability while reducing manual intervention. SRE Agent is available as a chatbot, so you can ask questions and give natural language commands to maintain your applications and services. To ensure accuracy and control, any action that an agent takes on your behalf requires your approval.

The sample app in this tutorial demonstrates error detection by simulating HTTP 500 failures in a controlled way. You can safely test these scenarios by using Azure App Service *deployment slots* to run various app configurations side by side.

You enable error simulation by setting the **INJECT_ERROR** app setting to **1**. When this setting is enabled, the app throws an HTTP 500 error after you select the button a few times. You can then see how SRE Agent responds to application failures.

In this tutorial, you:

> [!div class="checklist"]
>
> * Create an App Service app by using the Azure portal.
> * Deploy a sample app from GitHub.
> * Configure the app with a startup command and enable logging.
> * Create a deployment slot to simulate failure.
> * Set up an agent to monitor the app.
> * Trigger a failure by swapping to the broken slot.
> * Use an AI-driven chat to diagnose and resolve the problem by rolling back the swap.

## Prerequisites

[!INCLUDE [prerequisites](includes/prerequisites.md)]

## 1. Create an App Service app

Start by creating a web app that SRE Agent can monitor:

1. Sign in to the [Azure portal](https://portal.azure.com).

1. On the search bar, search for **App Services**, and then select it in the results.

1. Select **+ Create** > **Web App**.

1. On the **Basics** tab, provide the following details.

   For **Project details**, enter these values:

   | Setting         | Value                          |
   |-----------------|--------------------------------|
   | **Subscription**    | Your Azure subscription       |
   | **Resource group**  | **Create new** > **my-app-service-group** |

   For **Instance details**, enter these values:

   | Setting         | Value                          |
   |-----------------|--------------------------------|
   | **Name**            | **my-sre-app**                  |
   | **Publish**         | **Code**                      |
   | **Runtime stack**   | **.NET 9 (STS)**                 |
   | **Operating System**| **Windows**                 |
   | **Region**          | A region near you             |

1. Select the **Deployment** tab.

1. Under **Authentication settings**, enable **Basic authentication**.

    > [!NOTE]
    > Basic authentication is used later for a one-time deployment from GitHub. [Disable basic authentication](/azure/app-service/configure-basic-auth-disable?tabs=portal) in production.

1. Select **Review and create**, and then select **Create** when validation passes.

   When deployment finishes, a **Your deployment is complete** message appears.

## 2. Deploy the sample app

Now that your App Service app is created, deploy the sample application from GitHub:

1. In the Azure portal, go to your newly created App Service app by selecting **Go to resource**.

1. On the left menu, in the **Deployment** section, select **Deployment Center**.

1. On the **Settings** tab, configure these values:

    | Property   | Value                                                        |
    |------------|--------------------------------------------------------------|
    | **Source**     | **External Git**                                             |
    | **Repository** | `https://github.com/Azure-Samples/app-service-dotnet-agent-tutorial`|
    | **Branch**     | **main**                                                    |

1. Select **Save** to apply the deployment settings.

## 3. Verify the sample app

After deployment, confirm that the sample app is running as expected:

1. On the left menu of your App Service app, select **Overview**.

1. Select **Browse** to open the app on a new browser tab. (It might take a minute to load.)

1. The app displays a large counter and two buttons.

    :::image type="content" source="media/troubleshoot-azure-app-service/verify-sample-primary-slot.png" alt-text="Screenshot of the .NET sample in the primary slot.":::

    Select the **Increment** button several times to observe the counter increase.

## 4. Set up a deployment slot for failure simulation

To simulate an app failure scenario, add a secondary deployment slot:

1. On the left menu of your App Service app, in the **Deployment** section, select **Deployment slots**.

1. Select **Add slot**.

1. Enter the following values:

    | Property            | Value        | Remarks                                                                                  |
    |---------------------|--------------|------------------------------------------------------------------------------------------|
    | **Name**                | **broken**     | The error scenario is triggered in this slot. |
    | **Clone settings from** | **my-sre-app** | This property copies configuration from the main app. |

1. Scroll to the bottom of the pane and select **Add**. Slot creation might take a minute to complete.

### Deploy the sample app to the slot

1. After the slot is created, select the **broken** slot in the list.

1. On the left menu, in the **Deployment** section, select **Deployment Center**.

1. On the **Settings** tab, configure these values:

    | Property   | Value                                                         |
    |------------|---------------------------------------------------------------|
    | **Source**     | **External Git**                                              |
    | **Repository** | `https://github.com/Azure-Samples/app-service-dotnet-agent-tutorial` |
    | **Branch**     | **main**                                                      |

1. Select **Save** to apply the deployment settings.

### Add an app setting to enable error simulation

To control error simulation, configure an app setting that your app checks at runtime:

1. On the left menu of your App Service app, in the **Settings** section, select **Environment variables**.

1. At the top, make sure that the correct slot is selected (for example, **broken**).

1. On the **App settings** tab, select **+ Add**.

1. Enter the following values:

    | Property   | Value         | Remarks                                                      |
    |------------|---------------|--------------------------------------------------------------|
    | **Name**       | **INJECT_ERROR**| Must be exactly **INJECT_ERROR** (all caps, no spaces)        |
    | **Value**      | **1**           | Enables error simulation in the app                         |

1. Make sure that the **Deployment slot setting** box is *not* selected.  

1. Select **Apply** to add the setting.

1. At the bottom of the **Environment variables** page, select **Apply** to apply the changes.

1. When you're prompted, select **Confirm** to confirm and restart the app in the selected slot.

## 5. Create an agent

Now, create an agent to monitor your App Service app:

1. Follow the link provided in your onboarding email to access SRE Agent in the Azure portal.

1. Select **+ Create**.

1. On the **Create agent** pane, enter these values:

    | Property | Value | Remarks |
    |--|--|--|
    | **Subscription** | Your Azure subscription |  |
    | **Resource group** | **my-sre-agent-group** | New group for the agent. |
    | **Name** | **my-sre-agent** |  |
    | **Region** | **East US 2** | |

1. Choose **Select resource groups**.

1. On the **Selected resource groups to monitor** pane, select the checkbox next to **my-app-service-group**.

1. Select **Save**.

1. Back on the **Create agent** pane, select **Create**. The agent creation process takes a few minutes to complete.

## 6. Chat with your agent

After your agent is deployed and connected to your resource group, you can interact with it by using natural language to monitor and troubleshoot your app:

1. In the Azure portal, search for and select **Azure SRE Agent**.

1. In the list of agents, select **my-app-service-sre-agent**.

1. Select **Chat with agent**.

1. In the chat box, enter the following command:

    ```text
    List my App Service apps
    ```

1. The agent responds with a list of App Service apps deployed in the **my-app-service-group** resource group.

Now that the agent can see your app, you're ready to simulate a failure and let the agent help you resolve it.

## 7. Break the app

Simulate a failure scenario by swapping to the broken deployment slot:

1. On the left menu of your App Service app, in the **Deployment** section, select **Deployment slots**.

1. Select **Swap**.

1. On the **Swap** pane, configure these values:

    | Property | Value               | Remarks                          |
    |----------|---------------------|----------------------------------|
    | **Source**   | **my-sre-app-broken** | The slot with the faulty version |
    | **Target**   | **my-sre-app**        | The production slot              |

1. Scroll to the bottom and select **Start Swap**. The swap operation might take a minute to complete.

1. After the swap is complete, browse to the app's URL.

    :::image type="content" source="media/troubleshoot-azure-app-service/verify-sample-broken-slot.png" alt-text="Screenshot of the .NET sample in the broken slot.":::

1. Select the **Increment** button six times.

1. The app should fail and return an HTTP 500 error.

1. Refresh the page (by pressing Command+R or F5) several times to generate more HTTP 500 errors. These errors help SRE Agent detect and diagnose the problem.

## 8. Fix the app

Now that the app is experiencing failures, use SRE Agent to diagnose and resolve the problem:

1. In the Azure portal, search for and select **Azure SRE Agent**.

1. In the list of agents, select **my-app-service-sre-agent**.

1. Select **Chat with agent**.

1. In the chat box, enter the following command:

    ```text
    What's wrong with my-sre-app?
    ```

1. The agent begins to analyze the app's health. You should see diagnostic messages related to availability, CPU and memory usage, and the recent slot swap.

    Each session can vary, but a message similar to the following example should appear:

    > *I will now perform mitigation for my-sre-app by swapping the slots back to recover the application to a healthy state. Please note that swapping slots back may not always immediately restore health. I will keep you updated on the progress.*

1. After a pause, the agent prompts you to approve the rollback:

    > *Performing Slot Swap rollback to Restore Application Availability for my-sre-app*
    >
    > **[Approve]**   **[Deny]**

1. Select **Approve** to initiate the rollback.

1. After the rollback is complete, the agent confirms:

    > *The slot swap for my-sre-app has been completed successfully (timestamp). The production slot has been restored. I will now continue with post-mitigation steps:*
    >
    > *I will ask you for the correct GitHub repo URL to raise an issue for the swap-related downtime.*
    > *I will monitor the app and provide an availability update in 5 minutes.*
    >
    > *Please provide the GitHub repository URL where you want the issue to be raised.*

## 9. Verify the fix

After SRE Agent rolls back the slot swap, confirm that your app is functioning correctly:

1. Open your App Service app in a browser by selecting **Browse** on the **Overview** page.

1. Notice that the text **ERROR INJECTION ENABLED** no longer appears, confirming that the app reverted to its original state.

1. Select the **Increment** button six times to ensure that no errors appear.

## Clean up resources

If you no longer need the app and agent that you created in this tutorial, you can delete the associated resource groups to avoid incurring charges.

You created the following resource groups in this tutorial:

* **my-app-service-group** (App Service resource group)
* **my-sre-agent-group** (SRE Agent resource group)

Use the following steps for each resource group:

1. In the Azure portal, go to **Resource groups**.

1. Select the resource group that you want to delete.

1. On the **Overview** tab, select **Delete resource group**.

1. In the confirmation dialog, enter the name of the resource group.

1. Select **Delete**. Deletion takes a few minutes to complete.

## Related content

* [Azure SRE Agent overview](./overview.md)
* [Azure SRE Agent usage](./usage.md)

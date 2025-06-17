---
title: 'Tutorial: Troubleshoot an app using Azure SRE Agent (preview) in Azure App Service'
description: Learn how to use Azure SRE Agent (preview) and Azure App Service to identify and fix app issues with AI-assisted troubleshooting.
author: craigshoemaker
ms.author: cshoe
ms.topic: tutorial
ms.date: 06/17/2025
ms.service: azure
---

# Troubleshoot an App Service app using Azure SRE Agent (preview)

> [!NOTE]
> Azure SRE Agent is in preview. By using SRE Agent, you consent the product-specific [Preview Terms of Use](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

Site Reliability Engineering (SRE) focuses on creating reliable, scalable systems through automation and proactive management. An SRE Agent brings these principles to your cloud environment by providing AI-powered monitoring, troubleshooting, and remediation capabilities. An SRE Agent automates routine operational tasks and provides reasoned insights to help you maintain application reliability while reducing manual intervention. Available as a chatbot, you can ask questions and give natural language commands to maintain your applications and services. To ensure accuracy and control, any agent action taken on your behalf requires your approval.

This sample app demonstrates error detection by simulating HTTP 500 failures in a controlled way. You can safely test these scenarios using Azure App Service **deployment slots**, which let you run different app configurations side by side.

You enable error simulation by setting the `INJECT_ERROR` app setting to `1`. When enabled, the app throws an HTTP 500 error after you select the button a few times, allowing you to see how the SRE Agent responds to application failures.

In this tutorial, you will:

> [!div class="checklist"]
> * Create an App Service app using the Azure portal.
> * Deploy a sample app from GitHub.
> * Configure the app with a startup command and enable logging.
> * Create a deployment slot to simulate failure.
> * Set up an Azure SRE Agent to monitor the app.
> * Trigger a failure by swapping to the broken slot.
> * Use AI-driven chat to diagnose and resolve the issue by rolling back the swap.

[!INCLUDE [quickstarts-free-trial-note](~/reusable-content/ce-skilling/azure/includes/quickstarts-free-trial-note.md)]

## Prerequisites

* **Azure account**: An Azure account with an active subscription is required. If you don't already have one, you can [create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

* **Security context**: Ensure your user account has the `Microsoft.Authorization/roleAssignments/write` permissions using either [Role Based Access Control Administrator](/azure/role-based-access-control/built-in-roles) or [User Access Administrator](/azure/role-based-access-control/built-in-roles).

* **Namespace**: Using the cloud shell in the Azure portal, run the following command:

    ```azurecli  
    az provider register --namespace "Microsoft.App"
    ```

## 1. Create an App Service app

Start by creating a web app that the SRE Agent can monitor.

1. Sign in to the https://portal.azure.com.

1. In the top search bar, search for **App Services**, then select it from the results.

1. Select **+ Create** and choose **Web App**.

### Configure the Basics tab

In the *Basics* tab, provide the following details:

**Project details**

| Setting         | Value                          |
|-----------------|--------------------------------|
| Subscription    | Your Azure subscription       |
| Resource group  | **Create new** → `my-app-service-group` |

**Instance details**

| Setting         | Value                          |
|-----------------|--------------------------------|
| Name            | `my-sre-app`                  |
| Publish         | **Code**                      |
| Runtime stack   | **.NET 9 (STS)**                 |
| Operating System| **Windows**                 |
| Region          | A region near you             |

1. Select the **Deployment** tab.

1. Under *Authentication settings*, enable **Basic authentication**.

    > [!NOTE]
    > Basic authentication is used later for a one-time deployment from GitHub. [Disable basic auth](/azure/app-service/configure-basic-auth-disable?tabs=portal) in production.
    >

1. Select **Review and create**, then **Create** when validation passes.

1. Once deployment completes, you see *Your deployment is complete*.

## 2. Deploy the sample app

Now that your App Service app is created, deploy the sample application from GitHub.

1. In the Azure portal, navigate to your newly created App Service by selecting **Go to resource**.

1. In the left-hand menu, under the *Deployment* section, select **Deployment Center**.

1. In the *Settings* tab, configure:

    | Property   | Value                                                        |
    |------------|--------------------------------------------------------------|
    | Source     | **External Git**                                             |
    | Repository | `https://github.com/Azure-Samples/app-service-dotnet-agent-tutorial`|
    | Branch     | `main`                                                    |

1. Select **Save** to apply the deployment settings.

## 3. Verify the sample app

After deployment, confirm that the sample app is running as expected.

1. In the left menu of your App Service, select **Overview**.

1. Select **Browse** to open the app in a new browser tab. (It might take a minute to load.)

1. The app displays a large counter and two buttons:

    :::image type="content" source="media/troubleshoot-azure-app-service/verify-sample-primary-slot.png" alt-text="Screenshot of the .NET sample in the primary slot.":::

1. Select the *Increment* button several times to observe the counter increase.

## 4. Set up a deployment slot for failure simulation

To simulate an app failure scenario, add a secondary deployment slot.

1. In the left menu of your App Service, under the *Deployment* section, select **Deployment slots**.

1. Select **Add slot**.

1. Enter the following values:

    | Property            | Value        | Remarks                                                                                  |
    |---------------------|--------------|------------------------------------------------------------------------------------------|
    | Name                | `broken`     | The error scenario is triggered in this slot. |
    | Clone settings from | `my-sre-app` | Copies configuration from the main app.                                                  |

1. Scroll to the bottom of the dialog window and select **Add**. Slot creation might take a minute to complete.

### Deploy the sample app to the slot

1. Once the slot is created, select the **broken** slot from the list.

1. In the left menu, under the *Deployment* section, select **Deployment Center**.

1. In the *Settings* tab, configure:

    | Property   | Value                                                         |
    |------------|---------------------------------------------------------------|
    | Source     | **External Git**                                              |
    | Repository | `https://github.com/Azure-Samples/app-service-dotnet-agent-tutorial` |
    | Branch     | `main`                                                      |

1. Select **Save** to apply the deployment settings.

### Add an app setting to enable error simulation

To control error simulation, configure an app setting your app checks at runtime.

1. In the left menu of your App Service, select **Environment variables** under the *Settings* section.

1. At the top, make sure you have the correct slot selected (for example, **broken**).

1. Under the **App settings** tab, select **+ Add**.

1. Enter the following values:

    | Property   | Value         | Remarks                                                      |
    |------------|---------------|--------------------------------------------------------------|
    | Name       | `INJECT_ERROR`| Must be exactly `INJECT_ERROR` (all caps, no spaces).        |
    | Value      | `1`           | Enables error simulation in the app.                         |

1. Make sure the **Deployment slot setting** box is **not** checked.  

1. Select **Apply** to add the setting.

1. At the bottom of the *Environment variables* page, select **Apply** to apply the changes.

1. When prompted, select **Confirm** to confirm and restart the app in the selected slot.

## 5. Create an Azure SRE Agent

Now, create an Azure SRE Agent to monitor your App Service app.

1. In the Azure portal, search for and select **Azure SRE Agent**.

1. Select **+ Create**.

1. In the *Create agent* window, enter the following values:

    | Property         | Value                     | Remarks                                                                 |
    |------------------|---------------------------|-------------------------------------------------------------------------|
    | Subscription     | Your Azure subscription   |                                                                         |
    | Resource group   | `my-sre-agent-group`      | New group for the Azure SRE Agent                                             |
    | Name             | `my-sre-agent`|                                                                         |
    | Region           | **Sweden Central**        | Required during preview; can monitor resources in any Azure region      |
    | Choose role      | **Contributor**           | Grants the agent permission to take action on your behalf               |

1. Select **Select resource groups**.

1. In the *Selected resource groups to monitor* window, search for and select `my-app-service-group`.

1. Select **Save**.

1. Back in the *Create agent* window, select **Create**. The agent creation process takes a few minutes to complete.

## 6. Chat with your agent

Once your SRE Agent is deployed and connected to your resource group, you can interact with it using natural language to monitor and troubleshoot your app.

1. In the Azure portal, search for and select **Azure SRE Agent**.

1. From the list of agents, select **my-app-service-sre-agent**.

1. Select **Chat with agent**.

1. In the chat box, enter the following command:

    ```text
    List my App Service apps
    ```

1. The agent responds with a list of App Service apps deployed in the `my-app-service-group` resource group.

Now that the agent can see your app, you’re ready to simulate a failure and let the agent help you resolve it.

## 7. Break the app

Now simulate a failure scenario by swapping to the broken deployment slot.

1. In your App Service, go to the *Deployment* section in the left-hand menu and select **Deployment slots**.

1. Select **Swap**.

1. In the *Swap* dialog, configure:

    | Property | Value               | Remarks                          |
    |----------|---------------------|----------------------------------|
    | Source   | `my-sre-app-broken` | The slot with the faulty version |
    | Target   | `my-sre-app`        | The production slot              |

1. Scroll to the bottom and select **Start Swap**. The swap operation might take a minute to complete.

1. Once the swap is complete, browse to the app’s URL.

    :::image type="content" source="media/troubleshoot-azure-app-service/verify-sample-broken-slot.png" alt-text="Screenshot of the .NET sample in the broken slot.":::

1. Select the "Increment" button six times.

1. You should see the app fail and return an HTTP 500 error.

1. Refresh the page (by pressing Command-R or F5) several times to generate more HTTP 500 errors, which help the SRE Agent detect and diagnose the issue.

## 8. Fix the app

Now that the app is experiencing failures, use the SRE Agent to diagnose and resolve the issue.

1. In the Azure portal, search for and select **Azure SRE Agent**.

1. From the list of agents, select **my-app-service-sre-agent**.

1. Select **Chat with agent**.

1. In the chat box, enter the following command:

    ```text
    What's wrong with my-sre-app?
    ```

1. The agent begins to analyze the app’s health. You should see diagnostic messages related to availability, CPU and memory usage, and the recent slot swap.

    > Each session may vary, but you should see a message similar to:
    > 
    > *“I will now perform mitigation for my-sre-app by swapping the slots back to recover the application to a healthy state. Please note that swapping slots back may not always immediately restore health. I will keep you updated on the progress.”*

1. After a pause, the agent prompts you to approve the rollback:

    > *Performing Slot Swap rollback to Restore Application Availability for my-sre-app*
    >
    > **[Approve]**   **[Deny]**

1. Select **Approve** to initiate the rollback.

1. Once the rollback is complete, the agent confirms:

    > *The slot swap for my-sre-app has been completed successfully (timestamp). The production slot has been restored. I will now continue with post-mitigation steps:*
    > 
    > *I will ask you for the correct GitHub repo URL to raise an issue for the swap-related downtime.*
    > *I will monitor the app and provide an availability update in 5 minutes.*
    > 
    > *Please provide the GitHub repository URL where you want the issue to be raised.*

## 9. Verify the fix

After the SRE Agent rolls back the slot swap, confirm that your app is functioning correctly.

1. Open your App Service app in a browser by selecting **Browse** from the **Overview** page.

1. Notice that the text "ERROR INJECTION ENABLED" no longer appears, confirming the app reverted to its original state.

1. Select the **Increment** button six times to ensure no errors take place.

## Clean up resources

If you no longer need the app and agent created in this tutorial, you can delete the associated resource groups to avoid incurring charges.

Repeat the following steps for both of these resource groups:

- `my-app-service-group` (App Service resource group)
- `my-sre-agent-group` (Azure SRE Agent resource group)

1. In the Azure portal, navigate to **Resource groups**.

1. Select the resource group you want to delete.

1. From the *Overview* tab, select **Delete resource group**.

1. In the confirmation dialog, enter the name of the resource group.

1. Select **Delete**. Deletion takes a few minutes to complete.

## Next steps

* [SRE Agent overview](./overview.md)
* [Azure SRE Agent usage](./usage.md)

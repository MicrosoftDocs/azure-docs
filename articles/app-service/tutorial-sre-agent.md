---
title: 'Tutorial: Troubleshoot an app using Azure SRE Agent (preview) in Azure App Service'
description: Learn how to use SRE Agent and Azure App Service to identify and fix app issues with AI-assisted troubleshooting.
author: msangapu-msft
ms.author: msangapu
ms.topic: tutorial
ms.custom: devx-track-azurecli
ms.date: 04/22/2025
---

# Tutorial: Troubleshoot an App Service app using SRE Agent

The Azure SRE (Site Reliability Engineering) Agent helps you manage and monitor Azure resources by using AI-enabled capabilities. Agents  guide you in solving problems and aids in build resilient, self-healing systems on your behalf. The sample app includes code meant to exhaust memory and cause HTTP 500 errors, so you can diagnose and fix the problem using SRE Agent. 

In this tutorial, you:

> [!div class="checklist"]
> * Create an App Service app using the Azure portal
> * Deploy a sample App Service app using the Azure portal
> * Enable App Service logs
> * Create an Azure SRE Agent to monitor the app
> * Cause the app to produce a HTTP 500 error
> * Use AI-driven prompts to troubleshoot and fix errors

[!INCLUDE [quickstarts-free-trial-note](~/reusable-content/ce-skilling/azure/includes/quickstarts-free-trial-note.md)]

## Prerequisites

To complete this tutorial, you need an [Azure subscription](https://azure.microsoft.com/free/).

## 1. Create an App Service app

Begin by creating an app for your agent to monitor.

1. Go to the [Azure portal](https://portal.azure.com) and search for **App Services** in the top search bar.

1. Select **App Services** in the search results.

1. Select the **Create** button and select **Web App**.

### Basics tab

In the *Basics* tab, do the following actions.

1. Enter the following values in the *Project details* section.

    | Setting | Action |
    |---|---|
    | Subscription | Select your Azure subscription. |
    | Resource group | Select **Create new** and enter **my-app-service-group**. |

1. Enter the following values in the *Instance details* section.

    | Setting | Action |
    |---|---|
    | Name app name |  Enter **my-sre-app**. |
    | Publish |  Select **Code**. |
    | Runtime stack|  Select **PHP 8.4**. |
    | Region | Select a region near you. |

1. Select the **Deployment** tab.

1. Enable **Basic authentication** in the *Authentication settings* section. This is used later for a one-time deployment from GitHub. In production, [disable Basic Auth](configure-basic-auth-disable.md?tabs=portal) and use secure deployment methods like GitHub Actions or Azure DevOps.

1. Select **Review and create** at the bottom of the page.  

    If no errors are found, the *Create* button is enabled.  

    If there are errors, any tab containing errors is marked with a red dot. Navigate to the appropriate tab. Fields containing an error are highlighted in red. Once all errors are fixed, select **Review and create** again.

1. Select **Create**.

    A page with the message *Deployment is in progress* is displayed. Once the deployment is successfully completed, you see the message: *Your deployment is complete*.

### Deploy the sample app

1. To view your new App Service, select **Go to resource**.

1. In the left menu, find the *Deployment* section and select **Deployment center**.

1. Enter the following values in the *Settings* tab.

    | Property | Value | Remarks |
    |---|---|---|
    | Source | Select **External Git**. |  |
    | Repository | Enter **https://github.com/Azure-Samples/App-Service-Agent-Tutorial**. |  |
    | Branch | Select **working**. |  |

1. Select **Save**.

## 2. Configure the app

These steps configure the sample app with a *Startup command* and enable App Service logs.

### Configure the startup command

The default NGINX configuration expects a 50x.html file in the root */html* directory. This startup command copies *50x.html* from the *wwwroot* directory into /*html*.

1. In the left menu, browse to the *Settings* section and select **Configuration**.

1. Copy-paste the startup command as shown:

    ```bash
    /home/site/wwwroot/startup.sh
    ```

1. Select **Save**.

### Enable App Service logs

This step configures application logs required by the SRE Agent to diagnose and troubleshoot the app.

1. In the left menu, browse to the *Monitoring* section and select **App Service logs**.

1. Enter the following values.

    | Property | Value | Remarks |
    |---|---|---|
    | Application logging | Select **File System**. |  |
    | Retention Period (Days) | Enter **3**. |  |

1. Select **Save**.

### Verify the sample app

1. Select **Overview** in the left menu.

1. Select **Browse** to verify the sample app. It may take a minute to load as Azure App Service initializes the web app instance during the first request.

1. To convert images, click `Tools` and select `Convert to PNG`.

    ![Click `Tools` and select `Convert to PNG`](./media/tutorial-azure-monitor/sample-monitor-app-tools-menu.png)

1. Select the first three images and click `convert`. This converts successfully.

    ![Select the first two images](./media/tutorial-azure-monitor/sample-monitor-app-convert-two-images.png)

## 3. Create a deployment slot

1. In the left menu, find the *Deployment* section and select **Deployment slots**.

1. Select **Add slot**.

1. Enter the following values.

    | Property | Value | Remarks |
    |---|---|---|
    | Name | Enter **broken**. |  |
    | Clone settings from: | Select **my-sre-app**. |  |

1. Scroll to the bottom of the dialog window and Select **Add**. The deployment slot takes a minute to complete.

### Configure the deployment slot

1. Select the **broken** deployment slot.

1. In the left menu, find the *Deployment* section and select **Deployment center**.

1. Enter the following values in the *Settings* tab.

    | Property | Value | Remarks |
    |---|---|---|
    | Source | Select **External Git**. |  |
    | Repository | Enter **https://github.com/Azure-Samples/App-Service-Agent-Tutorial**. |  |
    | Branch | Select **broken**. |  |

1. Select **Save**.

## 4. Create an agent

Next, create an agent to monitor the *my-aca-app-group* resource group.

1. Go to the Azure portal and search for and select **SRE Agent**.

1. Select **Create**. This can take a few minutes to complete.

1. Enter the following values in the *Create agent* window.

    During this step, you create a new resource group specifically for your agent which is independent of the group you create for your application.

    | Property | Value | Remarks |
    |---|---|---|
    | Subscription | Select your Azure subscription. |  |
    | Resource group | Enter **my-sre-agent-group**.  |  |
    | Name | Enter **my-app-service-sre-agent**. |  |
    | Region | Select **Sweden Central**. | During preview, SRE Agents are only available in the *Sweden Central* region, but they can monitor resources in any Azure region. |
    | Choose role | Select **Contributor role**. |  |

1. Select the **Select resource groups** button.

1. In the *Select resource groups to monitor* window, search for and select the **my-app-service-group** resource group.

1. Scroll to the bottom of the dialog window and select **Save**.

1. Select **Create**.

## 5. Chat with your agent

Your agent has access to any resource inside the resource groups associated with the agent. Use the chat feature to help you inquire about and resolve issues related to your resources.

1. Go to the Azure portal, search for and select **Azure SRE Agent**.

1. Select **my-app-service-agent** from the list.

1. Select **Chat with agent**.

1. In the chat box, give your agent the following command.

    ```text
    List my app service apps
    ```

1. The agent responds with details about the container app deployed in the *my-app-service-group* resource group.

Now that you have an agent that sees your App Service app, you can create an opportunity for the agent to make a fix on your behalf.

## 6. Break the app

1. In your App Service app page, find **Deployment* section in the left menu and select **Deployment slots**.
 
1. Select **Swap**.

1. Enter the following values in the *Swap* dialog window.

    | Property | Value | Remarks |
    |---|---|---|
    | Source | Select **my-sre-app-broken**. |  |
    | Target  | Select **my-sre-app**.  |  |

1. Scroll to the bottom of the dialog window and select **Start Swap**. The swap can take a minute to complete.

1. Now that the slot has been swapped, browse to the app's URL.

1. Try to convert 5 images.

    ![Convert first five images](./media/tutorial-azure-monitor/sample-monitor-app-convert-five-images.png)

1. This action fails and produces an error that wasn't tested during development.

    ![The convert will result in a HTTP 500 error](./media/tutorial-azure-monitor/sample-monitor-app-http-500.png)

## 7. Fix the app

1. Go to the Azure portal, search for and select **Azure SRE Agent**.

1. Select **my-app-service-agent** from the list.

1. Select **Chat with agent**.

1. In the chat box, give your agent the following command and wait for a response.

    ```text
    What's wrong with my-app-service-app?
    ```

    From here, the agent should recognize that the tag name is invalid.

    While every chat session is different, you should see a response that resembles the following response.

    > The container app my-container-app appears to be in a healthy state ("Succeeded"), but I did notice a potential issue:
    >
    > - The container image specified is mcr.microsoft.com/k8se/quickstart:latest1. The ":latest1" tag is unusual and might be a typo (the standard tag is usually ":latest"). If this is not intentional, it could cause image pull failures or unexpected container behavior.
    >
    > Other than that, there are no critical errors or warning states reported for my-container-app.
    >
    > Would you like me to investigate further for hidden issues such as image pull errors, app crashes, or logs? If yes, please specify what symptoms you're experiencing (e.g., app not responding, errors in logs, etc.).

1. In the chat box, give your agent the following command and wait for a response.

    ```text
    Rollback to the last working version.
    ```

    As your agent processes this command, it runs diagnostics and reports back status information. After the agent inspects the previous revisions, the agent's response will include with something that resembles the following message:

    > You have requested to roll back your container app to the last known working image. This action will cause a brief restart of your app. Proceeding with the rollback now.

1. As the agent concludes the rollback analysis, it asks you for approval to execute the rollback operation.

    To approve the action, reply with the following prompt:

    ```text
    approved
    ```

    After the rollback is successful, you should see a response similar to:

    > Rollback complete! Your container app has been reverted to the last known working image: mcr.microsoft.com/k8se/quickstart:latest. Please monitor your app to ensure it starts successfully.

## 8. Verify repair

Now you can prompt your agent to return your app's fully qualified domain name (FQDN) so you can verify a successful deployment.

1. In the chat box, enter the following prompt.

    ```text
    What is the FQDN for my-container-app?
    ```

1. To verify your container app is working properly, open the FQDN in a web browser.

## Next steps

* [Overview of Azure App Service](overview.md)
* [Use Azure Developer CLI for modern app development](/azure/developer/azure-developer-cli/overview)
* [Agent Space documentation](/azure/agent-space/overview)

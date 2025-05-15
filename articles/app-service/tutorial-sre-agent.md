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

The Azure SRE (Site Reliability Engineering) Agent helps you manage and monitor Azure resources by using AI-enabled capabilities. Agents  guide you in solving problems and aids in build resilient, self-healing systems on your behalf.

In this tutorial, you:

> [!div class="checklist"]
> * Deploy a sample container app using the Azure portal
> * Create an Azure SRE Agent to monitor the app
> * Intentionally misconfigure the container app
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

    | Name app name |  Enter **my-sre-app**. |
    | Publish |  Select **Code**. |
    | Runtime stack|  Select **PHP 8.4**. |
    | Region | Select a region near you. |

1. Select the **Deployment** tab.

1. Enable **Basic authentication** in the *Authentication settings* section.

1. Select **Review and create** at the bottom of the page.  

    If no errors are found, the *Create* button is enabled.  

    If there are errors, any tab containing errors is marked with a red dot. Navigate to the appropriate tab. Fields containing an error are highlighted in red. Once all errors are fixed, select **Review and create** again.

1. Select **Create**.

    A page with the message *Deployment is in progress* is displayed. Once the deployment is successfully completed, you see the message: *Your deployment is complete*.

### Deploy the sample app

1. To view your new App Service, select **Go to resource**.

1. Go to the [Azure portal](https://portal.azure.com) and search for **App Services** in the top search bar.

1. Select **App Services** in the search results.

1. Select **my-sre-app** from the list of App Services.

1. In the left menu, select **Deployment center** from the *Deployment* section.

1. Enter the following values in the *Settings* tab.

    | Property | Value | Remarks |
    |---|---|---|
    | Source | Select **External Git**. |  |
    | Repository | Enter **https://github.com/Azure-Samples/App-Service-Troubleshoot-Azure-Monitor**. |  |
    | Branch | Enter **master**. |  |

1. Select **Save**.

### Verify the sample app

1. Select **Overview** in the left menu.

1. Select **Browse** to verify the sample app.

1. The following message appears in your browser.

## 2. Create an agent

Next, create an agent to monitor the *my-aca-app-group* resource group.

1. Go to the Azure portal and search for and select **Azure SRE Agent**.

1. Select **Create**.

1. Enter the following values in the *Create agent* window.

    During this step, you create a new resource group specifically for your agent which is independent of the group you create for your application.

    | Property | Value | Remarks |
    |---|---|---|
    | Subscription | Select your Azure subscription. |  |
    | Resource group | Enter **my-sre-agent-group**.  |  |
    | Name | Enter **my-app-svc-sre-agent**. |  |
    | Region | Select **Sweden Central**. | During preview, SRE Agents are only available in the *Sweden Central* region, but they can monitor resources in any Azure region. |

1. Select the **Select resource groups** button.

1. In the *Select resource groups to monitor* window, search for and select the **my-aca-app-group** resource group.

1. Scroll to the bottom of the dialog window and select **Save**.

1. Select **Create**.

## 3. Chat with your agent

Your agent has access to any resource inside the resource groups associated with the agent. Use the chat feature to help you inquire about and resolve issues related to your resources.

1. Go to the Azure portal, search for and select **Azure SRE Agent**.

1. Select **my-app-svc-agent** from the list.

1. Select **Chat with agent**.

1. In the chat box, give your agent the following command.

    ```text
    List my app service apps
    ```

1. The agent responds with details about the container app deployed in the *my-aca-app-group* resource group.

Now that you have an agent that sees your container app, you can create an opportunity for the agent to make a repair on your behalf.

## 4. Break the app


## Next steps

* [Overview of Azure App Service](overview.md)
* [Use Azure Developer CLI for modern app development](https://learn.microsoft.com/azure/developer/azure-developer-cli/overview)
* [Agent Space documentation](https://learn.microsoft.com/azure/agent-space/overview)


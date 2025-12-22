---
title: 'Tutorial: Troubleshoot an App Using Azure SRE Agent and Azure Container Apps Preview'
description: Deploy an automated agent to help monitor and resolve problems by using Azure SRE Agent and Azure Container Apps.
author: craigshoemaker
ms.topic: tutorial
ms.date: 10/13/2025
ms.author: cshoe
ms.service: azure-sre-agent
---

# Tutorial: Troubleshoot a container app by using Azure SRE Agent Preview

[Azure SRE Agent](../app-service/sre-agent-overview.md) helps you manage and monitor Azure resources by using AI-enabled capabilities. Agents guide you in solving problems and building resilient, self-healing systems.

In this tutorial, you:

> [!div class="checklist"]
> * Deploy a sample app by using Azure Container Apps in the Azure portal.
> * Create an agent to monitor the container app.
> * Intentionally misconfigure the container app.
> * Use AI-driven prompts to troubleshoot and fix errors.

> [!IMPORTANT]
> This tutorial features an AI-enabled service powered by a language model. The procedural steps reflect how the model is expected to respond. However, the responses that you encounter in your agent might differ from the examples in this tutorial. Use the example prompts to help achieve your goals.

## Prerequisites

[!INCLUDE [prerequisites](includes/prerequisites.md)]

## 1. Create a container app

Begin by creating an app for your agent to monitor:

1. Sign in to the [Azure portal](https://portal.azure.com).

1. On the search bar, search for **Container Apps**, and then select it in the results.

1. Select **Create** > **Container App**.

1. On the **Basics** tab, take the following actions.

    In the **Project details** section, enter these values:

    | Setting | Action |
    |---|---|
    | **Subscription** | Select your Azure subscription. |
    | **Resource group** | Select **Create new** and enter **my-aca-app-group**. |
    | **Container app name** |  Enter **my-container-app**. |
    | **Deployment source** | Select **Container image**. |

    In the **Container Apps Environment** section, enter these values:

    | Setting | Action |
    |---|---|
    | **Region** | Select a region near you. |
    | **Container Apps Environment** | Use the default value. |

1. Select the **Container** tab.

1. Select the **Use quickstart image** checkbox.

### Deploy the container app

1. Select **Review and create**.  

    If Azure Container Apps finds no errors, the **Create** button is available.  

    If the service finds errors, any tab that contains errors is marked with a red dot. Go to the appropriate tab. Fields that contain an error are highlighted in red. After you fix all errors, select **Review and create** again.

1. Select **Create**.

    A dialog with the message **Deployment is in progress** appears. When the deployment is complete, the message **Your deployment is complete** appears.

### Verify deployment

To view your new container app in a browser:

1. Select **Go to resource**.

1. Select the link next to **Application URL**.

   A message about your app appears in your browser.

   :::image type="content" source="media/troubleshoot-azure-container-apps/azure-container-apps-quickstart.png" alt-text="Screenshot of an Azure Container Apps deployment.":::

## 2. Create an agent

Next, create an agent to monitor the **my-aca-app-group** resource group:

1. Follow the link provided in your onboarding email to access SRE Agent in the Azure portal.

1. Select **Create**.

1. On the **Create agent** pane, enter the following values. During this step, you create a new resource group specifically for your agent. It's independent of the resource group for your application.

    In the **Project details** section, enter these values:

    | Property | Value |
    |---|---|
    | **Subscription** | Select your Azure subscription. |
    | **Resource group** | Enter **my-sre-agent-group**. |

    In the **Agent details** section, enter these values:

    | Property | Value |
    |---|---|
    | **Agent name** | Enter **my-aca-sre-agent**. |
    | **Region** | Select **East US 2**. |

1. In the **Managed resource groups** section, choose the **Select resource groups** button.

1. On the **Select resource groups to monitor** pane, search for the resource group that you want to monitor.

    > [!NOTE]
    > Avoid selecting the resource group link.

    Select the checkbox next to the **my-aca-app-group** resource group.

1. Scroll to the bottom of the pane and select **Save**.

1. Select **Create**.

    A dialog with the message **Deployment is in progress** appears.

1. When the deployment is complete, select **Chat with agent**.

## 3. Chat with your agent

Your agent has access to any resource inside the resource group that's associated with the agent. Use the chat feature to inquire about and resolve problems related to your resources.

1. In the chat box, give your agent the following command:

    ```text
    List my container apps
    ```

1. The agent responds with details about the container app deployed in the **my-aca-app-group** resource group.

Now that you have an agent that sees your container app, you can create an opportunity for the agent to make a repair on your behalf.

## 4. Break the app

By introducing a typo into the container image tag, you bring the app down so that the agent can bring it back up:

1. In the Azure portal, go to your container app.

1. On the side menu, under **Application**, select **Revisions and replicas**.

1. Select **Create new revision**.

1. Select the container name that begins with **simple-hello-world**.

1. On the **Edit container** pane, append `1` to the value in the **Image and tag** box.

    The value should now read `k8se/quickstart:latest1`.

1. Select **Save** to close the **Edit container** pane.

1. Select **Create** to create the new revision.

    After you create the new revision, you return to the **Revisions and replicas** pane.

1. Select **Refresh** to see your new revision in the list.

1. Wait for the deployment to fail, as reported in the **Running status** column.

## 5. Roll back to fix your app

1. In the Azure portal, search for and select **SRE Agent**.

1. In the list, select **my-aca-sre-agent** to open a chat environment.

1. In the chat box, give your agent the following command and wait for a response:

    ```text
    What's wrong with my-container-app?
    ```

    From here, the agent recognizes that the tag name is invalid. Although every chat session is different, the response should resemble the following example:

    > ⚠️ I found a potential issue with crs-aca-app:
    >
    > * The container image specified is: `mcr.microsoft.com/k8se/quickstart:latest1`
    >
    > This image tag (`latest1`) looks unusual. The typical image tag is `latest`, not `latest1`. If this image does not exist in the registry, your container app will fail to pull and start the container, even though the provisioning state may show as "Succeeded" and the status as "Running" at the platform level.
    >
    > **Recommendation**:
    > Check and update the container image reference for **crs-aca-app** to use a valid tag (such as `latest`) if `latest1` is not intentional or does not exist.
    >
    > Would you like help correcting the image tag or need to investigate further into logs or events for this app?

1. In the chat box, respond with **yes** to approve the request to fix the problem.

    If your agent doesn't respond with a yes-or-no question, you can give your agent the following command and wait for a response:

    ```text
    Roll back to the last working version.
    ```

1. As the agent concludes the rollback analysis, it asks you for approval to execute the rollback operation.

    Select **Approve** to approve the action to fix your container app.

    :::image type="content" source="media/troubleshoot-azure-container-apps/azure-container-apps-agent-approve.png" alt-text="Screenshot of an agent requesting permission to fix a container app.":::

    After the rollback is successful, a response similar to this example should appear:

    > ✅ The container app my-container-app is now healthy! The image was successfully updated and the app is running with 1 ready replica.

## 6. Verify the repair

Now you can prompt your agent to return your app's fully qualified domain name (FQDN) so that you can verify a successful deployment:

1. In the chat box, enter the following prompt:

    ```text
    What is the FQDN for this container app?

    Format your response as a clickable link.
    ```

1. To verify that your container app is working properly, select the link to open your app in a web browser.

## Clean up resources

If you no longer need the container app that you created in this tutorial, you can delete it and all the associated services by removing their resource groups.

Use the following steps for both the **my-aca-app-group** and **my-sre-agent-group** resource groups:

1. In the Azure portal, go to the resource group.

1. In the **Overview** section, select **Delete resource group**.

1. In the confirmation dialog, enter the name of the resource group.

1. Select **Delete**.

    The process to delete the resource group can take a few minutes to complete.

## Related content

* [Azure SRE Agent overview](./overview.md)
* [Azure SRE Agent usage](./usage.md)

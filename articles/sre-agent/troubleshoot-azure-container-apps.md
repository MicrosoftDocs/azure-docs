---
title: 'Tutorial: Troubleshoot an app using an Azure SRE Agent (preview) in Azure Container Apps'
description: Deploy an automated agent to help monitor and resolve issues with an SRE Agent in Azure Container Apps.
author: craigshoemaker
ms.topic: tutorial
ms.date: 07/03/2025
ms.author: cshoe
ms.service: azure
---

# Tutorial: Troubleshoot an app using an Azure SRE Agent (preview) in Azure Container Apps

The [Azure SRE Agent](../app-service/sre-agent-overview.md) helps you manage and monitor Azure resources by using AI-enabled capabilities. Agents  guide you in solving problems and aids in build resilient, self-healing systems on your behalf.

In this tutorial, you:

> [!div class="checklist"]
> * Deploy a sample container app using the Azure portal
> * Create an Azure SRE Agent to monitor the app
> * Intentionally misconfigure the container app
> * Use AI-driven prompts to troubleshoot and fix errors

> [!IMPORTANT]
> The following tutorial features an AI-enabled service powered by a language model. The steps represented in this article reflect how the model is expected to respond. However, the responses you encounter from your agent differs from what you see listed here. Use the  sample prompts as examples to help you achieve your goals.

## Prerequisites

* **Azure account**: An Azure account with an active subscription is required. If you don't already have one, you can [create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

* **Security context**: Ensure your user account has the `Microsoft.Authorization/roleAssignments/write` permissions using either [Role Based Access Control Administrator](/azure/role-based-access-control/built-in-roles) or [User Access Administrator](/azure/role-based-access-control/built-in-roles).

* **Namespace**: Using the cloud shell in the Azure portal, run the following command:

    ```azurecli  
    az provider register --namespace "Microsoft.App"
    ```

* **Access to Sweden Central region**: During preview, the only allowed region for SRE Agent is Sweden Central. Make sure your user account has *owner* or *admin* permissions and permissions to create resources in the Sweden Central region.

## 1. Create a container app

Begin by creating an app for your agent to monitor.

1. Go to the [Azure portal](https://portal.azure.com) and search for **Container Apps** in the top search bar.

1. Select **Container Apps** in the search results.

1. Select the **Create** button.

### Basics tab

In the *Basics* tab, take the following actions.

1. Enter the following values in the *Project details* section.

    | Setting | Action |
    |---|---|
    | Subscription | Select your Azure subscription. |
    | Resource group | Select **Create new** and enter **my-aca-app-group**. |
    | Container app name |  Enter **my-container-app**. |
    | Deployment source | Select **Container image**. |

1. Enter the following values in the *Container Apps Environment* section.

    | Setting | Action |
    |---|---|
    | Region | Select a region near you. |
    | Container Apps Environment | Use the default value. |

1. Select the **Container** tab.

1. Select the checkbox next to **Use quickstart image**.

### Deploy the container app

1. Select **Review and create** at the bottom of the page.  

    If no errors are found, the *Create* button is enabled.  

    If there are errors, any tab containing errors is marked with a red dot. Navigate to the appropriate tab. Fields containing an error are highlighted in red. Once all errors are fixed, select **Review and create** again.

1. Select **Create**.

    A page with the message *Deployment is in progress* is displayed.

    Once the deployment is complete, you see the message: *Your deployment is complete*.

### Verify deployment

1. To view your new container app, select **Go to resource**.

1. To your application in a browser, select the link next to *Application URL*.

1. The following message appears in your browser.

    :::image type="content" source="media/troubleshoot-azure-container-apps/azure-container-apps-quickstart.png" alt-text="Screenshot of your first Azure Container Apps deployment.":::

## 2. Create an agent

Next, create an agent to monitor the *my-aca-app-group* resource group.

1. Go to the Azure portal and search for and select **SRE Agent**.

1. Select **Create**.

1. Enter the following values in the *Create agent* window.

    During this step, you create a new resource group specifically for your agent which is independent of the resource group used for your application.

    In the *Project details* section, enter the following values:

    | Property | Value |
    |---|---|
    | Subscription | Select your Azure subscription. |
    | Resource group | Enter **my-sre-agent-group**. |

    In the *Agent details* section, enter the following values:

    | Property | Value |
    |---|---|
    | Agent name | Enter **my-aca-sre-agent**. |
    | Region | Select **Sweden Central**.<br><br>During preview, the SRE Agent is only available in the *Sweden Central* region, but an agent can monitor resources in any Azure region. |
    | Run mode| Select **Review*.<br><br>When in *review mode*, the agent works on your behalf only with your approval. |

1. In the *Managed resource groups* section, select the **Select resource groups** button.

1. In the *Select resource groups to monitor* window, search for the resource group you want to monitor.

    **Avoid selecting the resource group name link.**

    To select a resource group, select the checkbox next to the **my-aca-app-group** resource group.

1. Scroll to the bottom of the dialog window and select **Save**.

1. Select **Create**.

    A page with the message *Deployment is in progress* is displayed.

    Once the deployment is complete, select **Chat with agent**.

## 3. Chat with your agent

Your agent has access to any resource inside the resource groups associated with the agent. Use the chat feature to help you inquire about and resolve issues related to your resources.

1. In the chat box, give your agent the following command.

    ```text
    List my container apps
    ```

1. The agent responds with details about the container app deployed in the *my-aca-app-group* resource group.

Now that you have an agent that sees your container app, you can create an opportunity for the agent to make a repair on your behalf.

## 4. Break the app

By introducing a typo into the container image tag, you bring the app down so the agent can bring it back up.

1. Go to your container app in the Azure portal.

1. From the side menu, under *Application*, select **Revisions and replicas**.

1. Select **Create new revision**.

1. Select the container name beginning with **simple-hello-world** which opens the *Edit container* window.

1. Append a `1` the value in the *Image and tag* box.

    The value should now read `k8se/quickstart:latest1`.

1. Select **Save** to exit the *Edit container* window.

1. Select **Create** to create the new revision.

    Once you create the new revision, you return back the *Revisions and replicas* window.

1. Select **Refresh** to see your new revision in the list.

1. Wait for the deployment to fail as reported by the *Running status* column.

## 5. Roll back to fix your app

1. Go to the Azure portal, search for and select **SRE Agent**.

1. Select **my-aca-sre-agent** from the list to open a chat environment.

1. In the chat box, give your agent the following command and wait for a response.

    ```text
    What's wrong with my-container-app?
    ```

    From here, the agent recognizes that the tag name is invalid.

    While every chat session is different, you should see a response that resembles the following response.

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

    If your agent doesn't respond with a "yes or no" question, you can give your agent the following command and wait for a response.

    ```text
    Rollback to the last working version.
    ```

1. As the agent concludes the rollback analysis, it asks you for approval to execute the rollback operation.

    Select **Approve** to approve the action to fix your  container app.

    :::image type="content" source="media/troubleshoot-azure-container-apps/azure-container-apps-agent-approve.png" alt-text="Screenshot of an SRE Agent requesting permission to fix a container app.":::

    After the rollback is successful, you should see a response similar to:

    > ✅ The container app my-container-app is now healthy! The image was successfully updated and the app is running with 1 ready replica.

## 6. Verify repair

Now you can prompt your agent to return your app's fully qualified domain name (FQDN) so you can verify a successful deployment.

1. In the chat box, enter the following prompt.

    ```text
    What is the FQDN for this container app?

    Format your response as a clickable link.
    ```

1. To verify your container app is working properly, select the link to open your app in a web browser.

## Clean up resources

If you're not going to continue to use this application, you can delete the container app and all the associated services by removing the resource groups created in this article.

Execute the following steps for both the *my-aca-app-group* and *my-sre-agent-group* resource groups.

1. Go to the resource group in the Azure portal.

1. From the *Overview* section, select **Delete resource group**.

1. Enter the resource group name in the confirmation dialog.

1. Select **Delete**.

    The process to delete the resource group can take a few minutes to complete.

## Related content

* [SRE Agent overview](./overview.md)
* [Azure SRE Agent usage](./usage.md)

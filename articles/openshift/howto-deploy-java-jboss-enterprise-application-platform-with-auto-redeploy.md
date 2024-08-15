---
title: Auto-redeploy JBoss EAP with Source-to-Image
titleExtension: Azure Red Hat OpenShift
description: Shows you how to quickly set up JBoss EAP on Azure Red Hat OpenShift (ARO) using the Azure portal and deploy an app with the Source-to-Image (S2I) feature.
author: KarlErickson
ms.author: zhihaoguo
ms.topic: quickstart
ms.date: 06/26/2024
ms.custom: devx-track-java, devx-track-extended-java, devx-track-javaee, devx-track-javaee-jbosseap, devx-track-javaee-jbosseap-aro, devx-track-azurecli
# customer intent: As a developer, I want to learn how to auto redeploy JBoss EAP on Azure Red Hat OpenShift using Source-to-Image (S2I) so that I can quickly deploy and update my application.
---

# Quickstart: Auto-redeploy JBoss EAP on Azure Red Hat OpenShift with Source-to-Image (S2I)

This article shows you how to quickly set up JBoss Enterprise Application Platform (EAP) on Azure Red Hat OpenShift (ARO) and deploy an app with the Source-to-Image (S2I) feature. The Source-to-Image feature enables you to build container images from source code without having to write Dockerfiles. The article uses a sample application that you can fork from GitHub and deploy to Azure Red Hat OpenShift. The article also shows you how to set up a webhook in GitHub to trigger a new build in OpenShift every time you push a change to the repository.

This article uses the Azure Marketplace offer for JBoss EAP to accelerate your journey to ARO. The offer automatically provisions resources including an ARO cluster with a built-in OpenShift Container Registry (OCR), the JBoss EAP Operator, and optionally a container image including JBoss EAP and your application using Source-to-Image (S2I). To see the offer, visit the [Azure portal](https://aka.ms/eap-aro-portal). If you prefer manual step-by-step guidance for running JBoss EAP on ARO that doesn't use the automation enabled by the offer, see [Deploy a Java application with Red Hat JBoss Enterprise Application Platform (JBoss EAP) on an Azure Red Hat OpenShift 4 cluster](/azure/developer/java/ee/jboss-eap-on-aro).

## Prerequisites

- An Azure subscription. [!INCLUDE [quickstarts-free-trial-note](~/reusable-content/ce-skilling/azure/includes/quickstarts-free-trial-note.md)]

- A Red Hat account with complete profile. If you don't have one, you can sign up for a free developer subscription through the [Red Hat Developer Subscription for Individuals](https://developers.redhat.com/register).

- A local developer command line with a UNIX-like command environment - for example, Ubuntu, macOS, or Windows Subsystem for Linux - and Azure CLI installed. To learn how to install the Azure CLI, see [How to install the Azure CLI](/cli/azure/install-azure-cli).

- An Azure identity that you use to sign in that has either the [Contributor](../role-based-access-control/built-in-roles.md#contributor) role and the [User Access Administrator](../role-based-access-control/built-in-roles.md#user-access-administrator) role or the [Owner](../role-based-access-control/built-in-roles.md#owner) role in the current subscription. For an overview of Azure roles, see [What is Azure role-based access control (Azure RBAC)?](../role-based-access-control/overview.md)

[!INCLUDE [jboss-eap-aro-minimum-cores.md](./includes/jboss-eap-aro-minimum-cores.md)]

[!INCLUDE [jboss-eap-aro-get-pullsecret.md](./includes/jboss-eap-aro-get-pullsecret.md)]

[!INCLUDE [jboss-eap-aro-redhat-registry-account.md](./includes/jboss-eap-aro-redhat-registry-account.md)]

## Create a Microsoft Entra service principal

Use the following steps to create a service principal:

1. Create a service principal by using the following command on your local terminal:

   ```bash
   az ad sp create-for-rbac --name "sp-aro-s2i-$(date +%s)"
   ```

   This command produces output similar to the following example:

   ```output
   {
     "appId": <app-ID>,
     "displayName": <display-Name>,
     "password": <password>,
     "tenant": <tenant>
   }
   ```

1. Copy the value of the `appId` and `password` fields. You use these values later in the deployment process.

## Fork the repository on GitHub

Use the following steps to fork the sample repo:

1. Open the repository <https://github.com/redhat-mw-demos/eap-on-aro-helloworld> in your browser.
1. Fork the repository to your GitHub account.
1. Copy the URL of the forked repository.

## Deploy JBoss EAP on Azure Red Hat OpenShift

This section shows you how to deploy JBoss EAP on Azure Red Hat OpenShift.

Use the following steps to find the offer and fill out the **Basics** pane:

1. In the search bar at the top of the Azure portal, enter *JBoss EAP*. In the search results, in the **Marketplace** section, select **JBoss EAP on Azure Red Hat OpenShift**, as shown in the following screenshot:

   :::image type="content" source="media/howto-deploy-java-jboss-enterprise-application-platform-app/marketplace-search-results.png" alt-text="Screenshot of the Azure portal that shows JBoss EAP on Azure Red Hat OpenShift in search results." lightbox="media/howto-deploy-java-jboss-enterprise-application-platform-app/marketplace-search-results.png":::

   You can also go directly to the [JBoss EAP on Azure Red Hat OpenShift offer](https://aka.ms/eap-aro-portal) on the Azure portal.

1. On the offer page, select **Create**.

1. On the **Basics** pane, ensure that the value shown in the **Subscription** field is the same one that has the roles listed in the prerequisites section.

1. You must deploy the offer in an empty resource group. In the **Resource group** field, select **Create new** and fill in a value for the resource group. Because resource groups must be unique within a subscription, pick a unique name. An easy way to have unique names is to use a combination of your initials, today's date, and some identifier. For example, *eaparo033123rg*.

1. Under **Instance details**, select the region for the deployment. For a list of Azure regions where OpenShift operates, see [Regions for Red Hat OpenShift 4.x on Azure](https://azure.microsoft.com/explore/global-infrastructure/products-by-region/?products=openshift&regions=all).

1. Select **Next: ARO**.

Use the following steps to fill out the **ARO** pane shown in the following screenshot:

:::image type="content" source="media/howto-deploy-java-jboss-enterprise-application-platform-app/configure-cluster.png" alt-text="Screenshot of the Azure portal that shows JBoss EAP on Azure Red Hat OpenShift ARO pane." lightbox="media/howto-deploy-java-jboss-enterprise-application-platform-app/configure-cluster.png":::

1. Under **Create a new cluster**, select **Yes**.

1. Under **Provide information to create a new cluster**, for **Red Hat pull secret**, use the Red Hat pull secret that you obtained in the [Get a Red Hat pull secret](#get-a-red-hat-pull-secret) section. Use the same value for **Confirm secret**.

1. For **Service principal client ID**, use the `appId` value that you obtained in the [Create a Microsoft Entra service principal](#create-a-microsoft-entra-service-principal) section.

1. For **Service principal client secret**, use the `password` value that you obtained in the [Create a Microsoft Entra service principal](#create-a-microsoft-entra-service-principal) section. Use the same value for **Confirm secret**.

1. Select **Next EAP Application**.

The following steps show you how to fill out the **EAP Application** pane shown in the following screenshot, and then start the deployment.

:::image type="content" source="media/howto-deploy-java-jboss-enterprise-application-platform-app/eap-application-source-to-image.png" alt-text="Screenshot of the Azure portal that shows JBoss EAP on Azure Red Hat OpenShift EAP Application pane." lightbox="media/howto-deploy-java-jboss-enterprise-application-platform-app/eap-application-source-to-image.png":::

1. Select **YES** for **Deploy an application to OpenShift using Source-to-Image (S2I)?**.
1. For **Deploy your own application or a sample application?**, select **Your own application**.
1. For **Application source code repository URL**, use the URL of the forked repository that you created in the [Fork repository from GitHub](#fork-the-repository-on-github) section.
1. For **Red Hat Container Registry Service account username**, use the username of the Red Hat Container Registry service account that you created in the [Create a Red Hat Container Registry service account](#create-a-red-hat-container-registry-service-account) section.
1. For **Red Hat Container Registry Service account password**, use the password of the Red Hat Container Registry service account that you created in the [Create a Red Hat Container Registry service account](#create-a-red-hat-container-registry-service-account) section.
1. For **Confirm password**, use the same value as in the previous step.
1. Leave other fields with default values.
1. Select **Next: Review + create**.
1. Select **Review + create**. Ensure that the green **Validation Passed** message appears at the top. If the message doesn't appear, fix any validation problems, and then select **Review + create** again.
1. Select **Create**.
1. Track the progress of the deployment on the **Deployment is in progress** page.

Depending on network conditions and other activity in your selected region, the deployment might take up to 40 minutes to complete.

## Verify the functionality of the deployment

This section shows you how to verify that the deployment completed successfully.

If you navigated away from the **Deployment is in progress** page, use the following steps to get back to that page. If you're still on the page that shows **Your deployment is complete**, you can skip to step 5.

1. In the corner of any Azure portal page, select the hamburger menu and then select **Resource groups**.

1. In the box with the text **Filter for any field**, enter the first few characters of the resource group you created previously. If you followed the recommended convention, enter your initials, then select the appropriate resource group.

1. In the navigation pane, in the **Settings** section, select **Deployments**. You see an ordered list of the deployments to this resource group, with the most recent one first.

1. Scroll to the oldest entry in this list. This entry corresponds to the deployment you started in the preceding section. Select the oldest deployment, as shown in the following screenshot.

   :::image type="content" source="media/howto-deploy-java-jboss-enterprise-application-platform-app/deployments.png" alt-text="Screenshot of the Azure portal that shows JBoss EAP on Azure Red Hat OpenShift deployments with the oldest deployment highlighted." lightbox="media/howto-deploy-java-jboss-enterprise-application-platform-app/deployments.png":::

1. In the navigation pane, select **Outputs**. This list shows the output values from the deployment, which includes some useful information like **cmdToGetKubeadminCredentials** and **consoleUrl**.

   :::image type="content" source="media/howto-deploy-java-jboss-enterprise-application-platform-app/deployment-outputs.png" alt-text="Screenshot of the Azure portal that shows JBoss EAP on Azure Red Hat OpenShift deployment outputs." lightbox="media/howto-deploy-java-jboss-enterprise-application-platform-app/deployment-outputs.png":::

1. Open your local terminal, paste the value from the **cmdToGetKubeadminCredentials** field, and execute it. You see the admin account and credential for signing in to the OpenShift cluster console portal. The following example shows an admin account:

   ```bash
   az aro list-credentials -g eaparo033123rg -n aro-cluster
   ```

   This command produces output similar to the following example:

   ```output
   {
     "kubeadminPassword": "xxxxx-xxxxx-xxxxx-xxxxx",
     "kubeadminUsername": "kubeadmin"
   }
   ```

1. Paste the value from the **consoleUrl** field into an Internet-connected web browser, and then press <kbd>Enter</kbd>.
1. Fill in the admin user name and password, then select **Log in**.
1. In the admin console of Azure Red Hat OpenShift, select **Operators** > **Installed Operators**, where you can find that the **JBoss EAP** operator is successfully installed, as shown in the following screenshot:

   :::image type="content" source="media/howto-deploy-java-jboss-enterprise-application-platform-app/red-hat-openshift-cluster-console-portal-operators.png" alt-text="Screenshot of the Red Hat OpenShift cluster console portal that shows the Installed operators page." lightbox="media/howto-deploy-java-jboss-enterprise-application-platform-app/red-hat-openshift-cluster-console-portal-operators.png":::

1. Paste the value from the **appEndpoint** field into an Internet-connected web browser, and then press <kbd>Enter</kbd>. You see the JBoss EAP application running on Azure Red Hat OpenShift, as shown in the following screenshot:

   :::image type="content" source="media/howto-deploy-java-jboss-enterprise-application-platform-app/jboss-eap-application.png" alt-text="Screenshot of the JBoss EAP application running on Azure Red Hat OpenShift." lightbox="media/howto-deploy-java-jboss-enterprise-application-platform-app/jboss-eap-application.png":::


## Set up webhooks with OpenShift

This section shows you how to set up and use GitHub webhooks with OpenShift.

### Get the GitHub webhook URL

Use the following steps to get the webhook URL:

1. Navigate to the **OpenShift Web Console** with the URL provided in the **consoleUrl** field.
1. Navigate to **Builds** > **BuildConfigs** > **eap-app-build-artifacts**.
1. Select **Copy URL with Secret**, as shown in the following screenshot:

   :::image type="content" source="media/howto-deploy-java-jboss-enterprise-application-platform-app/github-webhook-url.png" alt-text="Screenshot of the Red Hat OpenShift cluster console portal BuildConfig details page with the Copy URL with Secret link highlighted." lightbox="media/howto-deploy-java-jboss-enterprise-application-platform-app/github-webhook-url.png":::

### Configure GitHub webhooks

Use the following steps to configure webhooks:

1. Open the forked repository in your GitHub account.
1. Navigate to the **Settings** tab.
1. Navigate to the **Webhooks** tab.
1. Select **Add webhook**.
1. Paste the **URL with Secret** value into the **Payload URL** field.
1. Change the **Content type** value to **application/json**.
1. For **Which events would you like to trigger this webhook?**, select **Just the push event**.
1. Select **Add webhook**.

   :::image type="content" source="media/howto-deploy-java-jboss-enterprise-application-platform-app/github-webhook-settings.png" alt-text="Screenshot of GitHub that shows the Settings tab and Webhooks pane." lightbox="media/howto-deploy-java-jboss-enterprise-application-platform-app/github-webhook-settings.png":::

From now on, every time you push a change to the repository, the webhook triggers a new build in OpenShift.

### Test the GitHub webhooks

Use the following steps to test the webhooks:

1. Select the **Code** tab in the forked repository.
1. Navigate to the *src/main/webapp/index.html* file.
1. After you have the file on the screen, navigate to the **Edit** button.
1. Change the line 38 from `<h1 class="display-4">JBoss EAP on Azure Red Hat OpenShift</h1>` to `<h1 class="display-4">JBoss EAP on Azure Red Hat OpenShift - Updated - 01 </h1>`.
1. Select **Commit changes**.

After you commit the changes, the webhook triggers a new build in OpenShift. From the OpenShift Web Console, navigate to **Builds** > **Builds** to see a new build in **Running** status.

### Verify the update

Use the following steps to verify the update:

1. After the build completes, navigate to **Builds** > **Builds** to see two new builds in **Complete** status.
1. Open a new browser tab and navigate to the **appEndpoint** URL.

   You should see the updated message on the screen.

   :::image type="content" source="media/howto-deploy-java-jboss-enterprise-application-platform-app/jboss-eap-application-with-updated-info.png" alt-text="Screenshot of the JBoss EAP sample application with updated information." lightbox="media/howto-deploy-java-jboss-enterprise-application-platform-app/jboss-eap-application-with-updated-info.png":::

[!INCLUDE [jboss-eap-aro-cleanup](./includes/jboss-eap-aro-cleanup.md)]

[!INCLUDE [jboss-eap-aro-next-step](./includes/jboss-eap-aro-next-step.md)]

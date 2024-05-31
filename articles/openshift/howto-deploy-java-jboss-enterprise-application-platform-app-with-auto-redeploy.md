---
title: "Quickstart: Red Hat JBoss EAP on Azure Red Hat OpenShift"
description: Shows you how to quickly stand up Red Hat JBoss EAP on Azure Red Hat OpenShift.
author: KarlErickson
ms.author: zhihaoguo
ms.topic: quickstart
ms.date: 05/28/2024
ms.custom: devx-track-java, devx-track-extended-java, devx-track-javaee, devx-track-javaee-jbosseap, devx-track-javaee-jbosseap-aro, devx-track-azurecli
---

# Quickstart: Auto Redeploy JBoss EAP on Azure Red Hat OpenShift With Source-2-Image (S2I)

This article shows you how to quickly set up JBoss EAP on Azure Red Hat OpenShift (ARO) using the Azure portal and deploy an app with the Source-2-Image (S2I) feature. The Source-2-Image feature allows you to build container images from source code without having to write Dockerfiles. This quickstart uses a sample application that you can fork from GitHub and deploy to Azure Red Hat OpenShift. The quickstart also shows you how to set up a webhook in GitHub to trigger a new build in OpenShift every time you push a change to the repository.

This article uses the Azure Marketplace offer for JBoss EAP to accelerate your journey to ARO. The offer automatically provisions resources including an ARO cluster with a built-in OpenShift Container Registry (OCR), the JBoss EAP Operator, and optionally a container image including JBoss EAP and your application using Source-to-Image (S2I). To see the offer, visit the [Azure portal](https://aka.ms/eap-aro-portal). If you prefer manual step-by-step guidance for running JBoss EAP on ARO that doesn't utilize the automation enabled by the offer, see [Deploy a Java application with Red Hat JBoss Enterprise Application Platform (JBoss EAP) on an Azure Red Hat OpenShift 4 cluster](/azure/developer/java/ee/jboss-eap-on-aro).

## Prerequisites

- [!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

- A Red Hat account with complete profile. If you don't have one, you can sign up for a free developer subscription through the [Red Hat Developer Subscription for Individuals](https://developers.redhat.com/register).

- A local developer command line with a UNIX-like command environment - for example, Ubuntu, macOS, or Windows Subsystem for Linux - and Azure CLI installed. To learn how to install the Azure CLI, see [How to install the Azure CLI](/cli/azure/install-azure-cli).

- Ensure the Azure identity you use to sign in has either the [Contributor](/azure/role-based-access-control/built-in-roles#contributor) role and the [User Access Administrator](/azure/role-based-access-control/built-in-roles#user-access-administrator) role or the [Owner](/azure/role-based-access-control/built-in-roles#owner) role in the current subscription. For an overview of Azure roles, see [What is Azure role-based access control (Azure RBAC)?](/azure/role-based-access-control/overview)

> [!NOTE]
> Azure Red Hat OpenShift requires a minimum of 40 cores to create and run an OpenShift cluster. The default Azure resource quota for a new Azure subscription does not meet this requirement. To request an increase in your resource limit, see [Standard quota: Increase limits by VM series](/azure/azure-portal/supportability/per-vm-quota-requests). Note that the free trial subscription isn't eligible for a quota increase, [upgrade to a Pay-As-You-Go subscription](/azure/cost-management-billing/manage/upgrade-azure-subscription) before requesting a quota increase.

[!INCLUDE [jboss-eap-aro-get-pullsecret.md](./includes/jboss-eap-aro-get-pullsecret.md)]

[!INCLUDE [jboss-eap-aro-redhat-registry-account.md](./includes/jboss-eap-aro-redhat-registry-account.md)]

## Create a Microsoft Entra service principal
1. Open the Azure portal and navigate to the Azure Cloud Shell.
2. Create a service principal using the following Azure CLI command. 
    ````azure cli
    az ad sp create-for-rbac --sdk-auth
    ````
    :::image type="content" source="media/howto-deploy-java-enterprise-application-platform-app/create-service-principal-with-azure-cli.png " alt-text="Screenshot of Azure Cloud Shell showing how to create a service principal with Azure CLI." lightbox="media/howto-deploy-java-enterprise-application-platform-app/create-service-principal-with-azure-cli.png":::

3. Copy the value of the clientId and clientSecret fields. You will use these values later in the deployment process.

## Fork repository from GitHub
1. Open the repository https://github.com/redhat-mw-demos/eap-on-aro-helloworld in your browser. 
2. Fork the repository to your GitHub account.
3. Copy the URL of the forked repository.

## Deploy JBoss EAP on Azure Red Hat OpenShift

The steps in this section direct you to deploy JBoss EAP on Azure Red Hat OpenShift.

The following steps show you how to find the offer and fill out the **Basics** pane.

1. In the search bar at the top of the Azure portal, enter *JBoss EAP*. In the search results, in the **Marketplace** section, select **JBoss EAP on Azure Red Hat OpenShift**, as shown in the following screenshot.

   :::image type="content" source="media/howto-deploy-java-enterprise-application-platform-app/marketplace-search-results.png" alt-text="Screenshot of Azure portal showing JBoss EAP on Azure Red Hat OpenShift in search results." lightbox="media/howto-deploy-java-enterprise-application-platform-app/marketplace-search-results.png":::

   You can also go directly to the [JBoss EAP on Azure Red Hat OpenShift offer](https://aka.ms/eap-aro-portal) on the Azure portal.

1. On the offer page, select **Create**.

1. On the **Basics** pane, ensure that the value shown in the **Subscription** field is the same one that has the roles listed in the prerequisites section.

1. You must deploy the offer in an empty resource group. In the **Resource group** field, select **Create new** and fill in a value for the resource group. Because resource groups must be unique within a subscription, pick a unique name. An easy way to have unique names is to use a combination of your initials, today's date, and some identifier. For example, *eaparo033123rg*.

1. Under **Instance details**, select the region for the deployment. For a list of Azure regions where OpenShift operates, see [Regions for Red Hat OpenShift 4.x on Azure](https://azure.microsoft.com/explore/global-infrastructure/products-by-region/?products=openshift&regions=all).

1. Select **Next: ARO**.

The following steps show you how to fill out the **ARO** pane shown in the following screenshot:

:::image type="content" source="media/howto-deploy-java-enterprise-application-platform-app/configure-cluster.png" alt-text="Screenshot of Azure portal showing JBoss EAP on Azure Red Hat OpenShift ARO pane." lightbox="media/howto-deploy-java-enterprise-application-platform-app/configure-cluster.png":::

1. Under **Create a new cluster**, select **Yes**.

1. Under **Provide information to create a new cluster**, for **Red Hat pull secret**, fill in the Red Hat pull secret that you obtained in the [Get a Red Hat pull secret](#get-a-red-hat-pull-secret) section. Use the same value for **Confirm secret**.

1. Fill in **Service principal client ID** with the service principal Application (client) ID that you obtained in the [Create a Microsoft Entra service principal from the Azure portal](#create-an-azure-active-directory-service-principal-from-the-azure-portal) section.

1. Fill in **Service principal client secret** with the service principal Application secret that you obtained in the [Create a Microsoft Entra service principal from the Azure portal](#create-an-azure-active-directory-service-principal-from-the-azure-portal) section. Use the same value for **Confirm secret**.

1. Select **Next EAP Application**.

The following steps show you how to fill out the **EAP Application** pane shown in the following screenshot, and then start the deployment.

:::image type="content" source="media/howto-deploy-java-enterprise-application-platform-app/eap-application-s2i.png" alt-text="Screenshot of Azure portal showing JBoss EAP on Azure Red Hat OpenShift EAP Application pane." lightbox="media/howto-deploy-java-enterprise-application-platform-app/eap-application-s2i.png":::

1. Select **YES** for **Deploy an application to OpenShift using Source-to-Image (S2I)?**.
2. For "Deploy your own application or a sample application?" Select **Your own application**.
2. Fill in the **Application source code repository URL** with the URL of the forked repository that you created in the [Fork repository from GitHub](#fork-repository-from-github) section.
3. Fill in the **Red Hat Container Registry Service account username** with the username of the Red Hat Container Registry service account that you created in the [Create a Red Hat Container Registry service account](#create-a-red-hat-container-registry-service-account) section.
4. Fill in the **Red Hat Container Registry Service account password** with the password of the Red Hat Container Registry service account that you created in the [Create a Red Hat Container Registry service account](#create-a-red-hat-container-registry-service-account) section.
5. Fill in the **Confirm password** with the password of the Red Hat Container Registry service account that you created in the [Create a Red Hat Container Registry service account](#create-a-red-hat-container-registry-service-account) section.
6. Leave other fields with default values.
1. Select **Next: Review + create**.
1. Select **Review + create**. Ensure that the green **Validation Passed** message appears at the top. If the message doesn't appear, fix any validation problems, and then select **Review + create** again.
1. Select **Create**.

1. Track the progress of the deployment on the **Deployment is in progress** page.

Depending on network conditions and other activity in your selected region, the deployment may take up to 40 minutes to complete.

While you wait, you can set up the database.


## Verify the functionality of the deployment

The steps in this section show you how to verify that the deployment completes successfully.

If you navigated away from the **Deployment is in progress** page, the following steps show you how to get back to that page. If you're still on the page that shows **Your deployment is complete**, you can skip to step 5.

1. In the corner of any Azure portal page, select the hamburger menu and then select **Resource groups**.

1. In the box with the text **Filter for any field**, enter the first few characters of the resource group you created previously. If you followed the recommended convention, enter your initials, then select the appropriate resource group.

1. In the navigation pane, in the **Settings** section, select **Deployments**. You see an ordered list of the deployments to this resource group, with the most recent one first.

1. Scroll to the oldest entry in this list. This entry corresponds to the deployment you started in the preceding section. Select the oldest deployment, as shown in the following screenshot.

   :::image type="content" source="media/howto-deploy-java-enterprise-application-platform-app/deployments.png" alt-text="Screenshot of Azure portal showing JBoss EAP on Azure Red Hat OpenShift deployments with the oldest deployment highlighted." lightbox="media/howto-deploy-java-enterprise-application-platform-app/deployments.png":::

1. In the navigation pane, select **Outputs**. This list shows the output values from the deployment, which includes some useful information.

1. Open the Azure Cloud Shell, paste the value from the **cmdToGetKubeadminCredentials** field, and execute it. You see the admin account and credential for signing in to the OpenShift cluster console portal. The following example shows an admin account:

   ```azurecli
   az aro list-credentials -g eaparo033123rg -n aro-cluster
   ```

   This command produces output similar to the following example:

   ```output
   {
     "kubeadminPassword": "xxxxx-xxxxx-xxxxx-xxxxx",
     "kubeadminUsername": "kubeadmin"
   }
   ```

1. Paste the value from the **consoleUrl** field into an Internet-connected web browser, and then press <kbd>Enter</kbd>. Fill in the admin user name and password, then select **Log in**. In the admin console of Azure Red Hat OpenShift, select **Operators** > **Installed Operators**, where you can find that the **JBoss EAP** operator is successfully installed, as shown in the following screenshot.

   :::image type="content" source="media/howto-deploy-java-enterprise-application-platform-app/red-hat-openshift-cluster-console-portal-operators.png" alt-text="Screenshot of Red Hat OpenShift cluster console portal showing Installed operators page." lightbox="media/howto-deploy-java-enterprise-application-platform-app/red-hat-openshift-cluster-console-portal-operators.png":::

2. Paste the value from the **appEndpoint** field into an Internet-connected web browser, and then press <kbd>Enter</kbd>. You see the JBoss EAP application running on Azure Red Hat OpenShift, as shown in the following screenshot.

    :::image type="content" source="media/howto-deploy-java-enterprise-application-platform-app/jboss-eap-application.png" alt-text="Screenshot of JBoss EAP application running on Azure Red Hat OpenShift." lightbox="media/howto-deploy-java-enterprise-application-platform-app/jboss-eap-application.png":::


### Webhooks with OpenShift
1. Navigate to the OpenShift Web Console with the URL provided in the **consoleUrl** field.
1. Navigate to **Builds** > **BuildConfigs** > **eap-app-build-artifacts**.
1. Copy the Gihtub Webhook URL with Secret as shown in the following image.
    :::image type="content" source="media/howto-deploy-java-enterprise-application-platform-app/github-webhook-url.png" alt-text="Screenshot of how to copy the GitHub Webhook URL with Secret." lightbox="media/howto-deploy-java-enterprise-application-platform-app/github-webhook-url.png":::

### Configuring GitHub Web Hooks
1. Open the forked repository in your GitHub account.
2. Navigate to the **Settings** tab.
3. Navigate to the **Webhooks** tab.
4. From right corner, select **Add webhook**.
5. Paste the URL with Secret in the **Payload URL** field.
6. Change the **Content type** to **application/json**.
7. Select **Just the push event** in the **Which events would you like to trigger this webhook?** section.
8. Select **Add webhook**.

From now on, every time you push a change to the repository, the webhook triggers a new build in OpenShift.

### Test GitHub Web Hooks
1. Click the Code tab in the forked repository.
2. Navigate to the **src/main/webapp/index.html** file.
3. Once you have the file on the screen, navigate to the **Edit** button.
4. Change the line 38 from `<h1 class="display-4">JBoss EAP on Azure Red Hat OpenShift</h1>` to `<h1 class="display-4">JBoss EAP on Azure Red Hat OpenShift - Updated - 01 </h1>`.
5. Click the **Commit changes** button.

Once you commit the changes, the webhook triggers a new build in OpenShift. From Openshift Web Console, navigate to **Builds** > **Builds** and you will see a new build in Running status.

### Verify the application
1. Once the build is completed, navigate to **Builds** > **Builds** and you will see two new builds in Complete status.
1. Open a new browser tab and navigate to the **appEndpoint** URL.
2. You should see the updated message on the screen.
    :::image type="content" source="media/howto-deploy-java-enterprise-application-platform-app/jboss-eap-application-with-updated-info.png" alt-text="Screenshot of the application with updated information." lightbox="media/howto-deploy-java-enterprise-application-platform-app/jboss-eap-application-with-updated-info.png":::


[!INCLUDE [jboss-eap-aro-cleanup](./includes/jboss-eap-aro-cleanup.md)]

[!INCLUDE [jboss-eap-aro-next-step](./includes/jboss-eap-aro-next-step.md)]
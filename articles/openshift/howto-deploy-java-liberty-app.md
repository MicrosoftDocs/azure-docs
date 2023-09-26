---
title: "IBM WebSphere Liberty and Open Liberty on Azure Red Hat OpenShift"
description: Shows you how to quickly stand up IBM WebSphere Liberty and Open Liberty on Azure Red Hat OpenShift.
author: KarlErickson
ms.author: haiche
ms.topic: how-to
ms.date: 06/24/2023
ms.custom: template-overview, devx-track-java, devx-track-javaee, devx-track-javaee-liberty, devx-track-javaee-liberty-aro, devx-track-extended-java
---

# Deploy IBM WebSphere Liberty and Open Liberty on Azure Red Hat OpenShift

This article shows you how to quickly stand up IBM WebSphere Liberty and Open Liberty on Azure Red Hat OpenShift using the Azure portal.

For step-by-step guidance in setting up Liberty and Open Liberty on Azure Red Hat OpenShift, see [Deploy a Java application with Open Liberty/WebSphere Liberty on an Azure Red Hat OpenShift cluster](/azure/developer/java/ee/liberty-on-aro).

This article is intended to help you quickly get to deployment. Before going to production, you should explore [Tuning Liberty](https://www.ibm.com/docs/was-liberty/base?topic=tuning-liberty).

## Prerequisites

- [!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

- A Red Hat account with complete profile. If you don't have one, you can sign up for a free developer subscription through the [Red Hat Developer Subscription for Individuals](https://developers.redhat.com/register).

- Use [Azure Cloud Shell](/azure/cloud-shell/quickstart) using the Bash environment; make sure the Azure CLI version is 2.43.0 or higher.

  [![Image of button to launch Cloud Shell in a new window.](../../includes/media/cloud-shell-try-it/hdi-launch-cloud-shell.png)](https://shell.azure.com)

  > [!NOTE]
  > You can also execute this guidance from a local developer command line with the Azure CLI installed. To learn how to install the Azure CLI, see [How to install the Azure CLI](/cli/azure/install-azure-cli).

- Ensure the Azure identity you use to sign in has either the [Contributor](/azure/role-based-access-control/built-in-roles#contributor) role and the [User Access Administrator](/azure/role-based-access-control/built-in-roles#user-access-administrator) role or the [Owner](/azure/role-based-access-control/built-in-roles#owner) role in the current subscription. For an overview of Azure roles, see [What is Azure role-based access control (Azure RBAC)?](/azure/role-based-access-control/overview)

- Azure Red Hat OpenShift requires a minimum of 40 cores to create and run an OpenShift cluster. Ensure your subscription has sufficient quota.

## Get a Red Hat pull secret

The Azure Marketplace offer you're going to use in this article requires a Red Hat pull secret. This section shows you how to get a Red Hat pull secret for Azure Red Hat OpenShift. To learn about what a Red Hat pull secret is and why you need it, see the [Get a Red Hat pull secret](/azure/openshift/tutorial-create-cluster?WT.mc_id=Portal-fx#get-a-red-hat-pull-secret-optional) section of [Tutorial: Create an Azure Red Hat OpenShift 4 cluster](/azure/openshift/tutorial-create-cluster?WT.mc_id=Portal-fx). To get the pull secret for use, follow the steps in this section.

Use your Red Hat account to sign in to the OpenShift cluster manager portal, by visiting the [Red Hat OpenShift Hybrid Cloud Console](https://console.redhat.com/openshift/install/azure/aro-provisioned). You may need to accept more terms and update your account as shown in the following screenshot. Use the same password as when you created the account.

:::image type="content" source="media/howto-deploy-java-liberty-app/red-hat-account-complete-profile.png" alt-text="Screenshot of Red Hat Update Your Account page." lightbox="media/howto-deploy-java-liberty-app/red-hat-account-complete-profile.png":::

After you sign in, select **OpenShift** then **Downloads**. Select the **All categories** dropdown list and then select **Tokens**. Under **Pull secret**, select **Copy** or **Download** to get the value, as shown in the following screenshot.

:::image type="content" source="media/howto-deploy-java-liberty-app/red-hat-console-portal-pull-secret.png" alt-text="Screenshot of Red Hat console portal showing the pull secret." lightbox="media/howto-deploy-java-liberty-app/red-hat-console-portal-pull-secret.png":::

The following content is an example that was copied from the Red Hat console portal, with the auth codes replaced with `xxxx...xxx`.

```json
{"auths":{"cloud.openshift.com":{"auth":"xxxx...xxx","email":"contoso-user@contoso.com"},"quay.io":{"auth":"xxx...xxx","email":"contoso-user@test.com"},"registry.connect.redhat.com":{"auth":"xxxx...xxx","email":"contoso-user@contoso.com"},"registry.redhat.io":{"auth":"xxxx...xxx","email":"contoso-user@contoso.com"}}}
```

Save the secret to a file so you can use it later.

## Create an Azure Active Directory service principal from the Azure portal

The Azure Marketplace offer you're going to use in this article requires an Azure Active Directory (Azure AD) service principal to deploy your Azure Red Hat OpenShift cluster. The offer assigns the service principal with proper privileges during deployment time, with no role assignment needed. If you have a service principal ready to use, skip this section and move on to the next section, where you'll deploy the offer.

Use the following steps to deploy a service principal and get its Application (client) ID and secret from the Azure portal. For more information, see [Create and use a service principal to deploy an Azure Red Hat OpenShift cluster](/azure/openshift/howto-create-service-principal?pivots=aro-azureportal).

> [!NOTE]
> You must have sufficient permissions to register an application with your Azure AD tenant. If you run into a problem, check the required permissions to make sure your account can create the identity. For more information, see the [Permissions required for registering an app](/azure/active-directory/develop/howto-create-service-principal-portal#permissions-required-for-registering-an-app) section of [Use the portal to create an Azure AD application and service principal that can access resources](/azure/active-directory/develop/howto-create-service-principal-portal).

1. Sign in to your Azure account through the [Azure portal](https://portal.azure.com/).
1. Select **Azure Active Directory**.
1. Select **App registrations**.
1. Select **New registration**.
1. Name the application, for example "liberty-on-aro-app". Select a supported account type, which determines who can use the application. After setting the values, select **Register**, as shown in the following screenshot. It takes several seconds to provision the application. Wait for the deployment to complete before proceeding.

   :::image type="content" source="media/howto-deploy-java-liberty-app/azure-portal-create-service-principal.png" alt-text="Screenshot of Azure portal showing the Register an application page." lightbox="media/howto-deploy-java-liberty-app/azure-portal-create-service-principal.png":::

1. Save the Application (client) ID from the overview page, as shown in the following screenshot. Hover the pointer over the value (redacted in the screenshot) and select the copy icon that appears. The tooltip will say **Copy to clipboard**. Be careful to copy the correct value, since the other values in that section also have copy icons. Save the Application ID to a file so you can use it later.

   :::image type="content" source="media/howto-deploy-java-liberty-app/azure-portal-obtain-service-principal-client-id.png" alt-text="Screenshot of Azure portal showing service principal client ID." lightbox="media/howto-deploy-java-liberty-app/azure-portal-obtain-service-principal-client-id.png":::

1. Create a new client secret by following these steps:

   1. Select **Certificates & secrets**.
   1. Select **Client secrets**, then **New client secret**.
   1. Provide a description of the secret and a duration. When you're done, select **Add**.
   1. After the client secret is added, the value of the client secret is displayed. Copy this value because you won't be able to retrieve it later.

You've now created your Azure AD application, service principal, and client secret.

## Deploy IBM WebSphere Liberty or Open Liberty on Azure Red Hat OpenShift

The steps in this section direct you to deploy IBM WebSphere Liberty or Open Liberty on Azure Red Hat OpenShift.

The following steps show you how to find the offer and fill out the **Basics** pane.

1. In the search bar at the top of the Azure portal, enter *Liberty*. In the auto-suggested search results, in the **Marketplace** section, select **IBM WebSphere Liberty and Open Liberty on Azure Red Hat OpenShift**, as shown in the following screenshot.

   :::image type="content" source="media/howto-deploy-java-liberty-app/marketplace-search-results.png" alt-text="Screenshot of Azure portal showing IBM WebSphere Liberty and Open Liberty on Azure Red Hat OpenShift in search results." lightbox="media/howto-deploy-java-liberty-app/marketplace-search-results.png":::

   You can also go directly to the offer with this [portal link](https://aka.ms/liberty-aro).

1. On the offer page, select **Create**.

1. On the **Basics** pane, ensure that the value shown in the **Subscription** field is the same one that has the roles listed in the prerequisites section.

1. The offer must be deployed in an empty resource group. In the **Resource group** field, select **Create new** and fill in a value for the resource group. Because resource groups must be unique within a subscription, pick a unique name. An easy way to have unique names is to use a combination of your initials, today's date, and some identifier. For example, *abc1228rg*.

1. Under **Instance details**, select the region for the deployment. For a list of Azure regions where OpenShift operates, see [Regions for Red Hat OpenShift 4.x on Azure](https://azure.microsoft.com/explore/global-infrastructure/products-by-region/?products=openshift&regions=all).

The following steps show you how to fill out the **ARO** pane shown in the following screenshot:

:::image type="content" source="media/howto-deploy-java-liberty-app/azure-portal-liberty-on-aro-configure-cluster.png" alt-text="Screenshot of Azure portal showing IBM WebSphere Liberty and Open Liberty on Azure Red Hat OpenShift ARO pane." lightbox="media/howto-deploy-java-liberty-app/azure-portal-liberty-on-aro-configure-cluster.png":::

1. Under **Create a new cluster**, select **Yes**.

1. Under **Provide information to create a new cluster**, for **Red Hat pull secret**, fill in the Red Hat pull secret that you obtained in the [Get a Red Hat pull secret](#get-a-red-hat-pull-secret) section. Use the same value for **Confirm secret**.

1. Fill in **Service principal client ID** with the service principal Application (client) ID that you obtained in the [Create an Azure Active Directory Service Principal from the Azure portal](#create-an-azure-active-directory-service-principal-from-the-azure-portal) section.

1. Fill in **Service principal client secret** with the service principal Application secret that you obtained in the [Create an Azure Active Directory Service Principal from the Azure portal](#create-an-azure-active-directory-service-principal-from-the-azure-portal) section. Use the same value for **Confirm secret**.

The following steps show you how to fill out the **Operator and application** pane shown in the following screenshot, and start the deployment.

:::image type="content" source="media/howto-deploy-java-liberty-app/azure-portal-liberty-on-aro-operator-and-application.png" alt-text="Screenshot of Azure portal showing IBM WebSphere Liberty and Open Liberty on Azure Red Hat OpenShift Operator and application pane." lightbox="media/howto-deploy-java-liberty-app/azure-portal-liberty-on-aro-operator-and-application.png":::

1. Under **IBM supported?**, select **Yes**.

   > [!NOTE]
   > This quickstart deploys the IBM-supported WebSphere Liberty Operator, but you can select **No** to deploy the Open Liberty Operator instead.

1. Leave the default option of **No** for **Deploy an application?**.

   > [!NOTE]
   > This quickstart doesn't deploy an application, but you can select **Yes** for **Deploy an application?** if you prefer.

1. Select **Review + create**. Ensure that the green **Validation Passed** message appears at the top. If the message doesn't appear, fix any validation problems and then select **Review + create** again.

1. Select **Create**.

1. Track the progress of the deployment on the **Deployment is in progress** page.

Depending on network conditions and other activity in your selected region, the deployment may take up to 40 minutes to complete.

## Verify the functionality of the deployment

The steps in this section show you how to verify that the deployment has successfully completed.

If you navigated away from the **Deployment is in progress** page, the following steps will show you how to get back to that page. If you're still on the page that shows **Your deployment is complete**, you can skip to step 5.

1. In the upper left corner of any portal page, select the hamburger menu and then select **Resource groups**.

1. In the box with the text **Filter for any field**, enter the first few characters of the resource group you created previously. If you followed the recommended convention, enter your initials, then select the appropriate resource group.

1. In the navigation pane, in the **Settings** section, select **Deployments**. You'll see an ordered list of the deployments to this resource group, with the most recent one first.

1. Scroll to the oldest entry in this list. This entry corresponds to the deployment you started in the preceding section. Select the oldest deployment, as shown in the following screenshot.

   :::image type="content" source="media/howto-deploy-java-liberty-app/azure-portal-liberty-on-aro-deployments.png" alt-text="Screenshot of Azure portal showing IBM WebSphere Liberty and Open Liberty on Azure Red Hat OpenShift deployments with the oldest deployment highlighted." lightbox="media/howto-deploy-java-liberty-app/azure-portal-liberty-on-aro-deployments.png":::

1. In the navigation pane, select **Outputs**. This list shows the output values from the deployment, which includes some useful information.

1. Open Azure Cloud Shell and paste the value from the **cmdToGetKubeadminCredentials** field. You'll see the admin account and credential for logging in to the OpenShift cluster console portal. The following content is an example of an admin account.

   ```azurecli-interactive
   az aro list-credentials --resource-group abc1228rg --name clusterf9e8b9
   {
     "kubeadminPassword": "xxxxx-xxxxx-xxxxx-xxxxx",
     "kubeadminUsername": "kubeadmin"
   }
   ```

1. Paste the value from the **clusterConsoleUrl** field into an Internet-connected web browser, and then press <kbd>Enter</kbd>. Fill in the admin user name and password, which you can find in the list of installed IBM WebSphere Liberty operators, as shown in the following screenshot.

   :::image type="content" source="media/howto-deploy-java-liberty-app/red-hat-openshift-cluster-console-portal.png" alt-text="Screenshot of Red Hat OpenShift cluster console portal showing Installed Operators page." lightbox="media/howto-deploy-java-liberty-app/red-hat-openshift-cluster-console-portal.png":::

You can use the output commands to create an application or manage the cluster.

## Clean up resources

If you're not going to continue to use the OpenShift cluster, navigate back to your working resource group. At the top of the page, under the text **Resource group**, select the resource group. Then, select **Delete resource group**.

## Next steps

Learn more about deploying IBM WebSphere family on Azure by following these links:

> [!div class="nextstepaction"]
> [What are solutions to run the IBM WebSphere family of products on Azure?](/azure/developer/java/ee/websphere-family?toc=/azure/openshift/toc.json&bc=/azure/openshift/breadcrumb/toc.json)

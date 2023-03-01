---
title: Quickstart - Create an Azure Modeling and Simulation Workbench (preview) in the Azure portal
description: In this quickstart, you learn how to use the Azure portal to create an Azure Modeling and Simulation Workbench.
author: lynnar
ms.author: lynnar
ms.reviewer: yochu
ms.service: modeling-simulation-workbench
ms.date: 01/01/2023
ms.topic: quickstart
# Customer intent: As a Modeling and Simulation Workbench owner, I want to create and perform initial setup so that Modeling and Simulation Workbench chamber users can run EDA applications.
---

# Quickstart - Create an Azure Modeling and Simulation Workbench (preview) in the Azure portal

Get started with Azure Modeling and Simulation Workbench (preview) by using the Azure portal to run your design applications in a secure and managed environment on cloud. The Azure portal is a browser-based user interface to create Azure resources. This quickstart shows you how to use the Azure portal to deploy an Azure Modeling and Simulation Workbench (preview), and allow the efficient use of Modeling and Simulation Workbench chamber.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- The Azure account must have permission to manage resource providers and to manage resources for the subscription. The permission is included in the Contributor and Owner roles.

- The Azure account must have permission to manage applications in Azure Active Directory (Azure AD). Any of the following Azure AD roles include the required permissions:
  - [Application administrator](/azure/active-directory/roles/permissions-reference#application-administrator)
  - [Application developer](/azure/active-directory/roles/permissions-reference#application-developer)
  - [Cloud application administrator](/azure/active-directory/roles/permissions-reference#cloud-application-administrator)
  
- An Azure AD tenant.

- OpenText Exceed TurboX license key.

  > [!IMPORTANT]
  >
  > You need to buy the license for production environment.

## Sign in to Azure portal

Open your web browser, and go to the [Azure portal](https://portal.azure.com/). Enter your credentials to sign in to the portal.

## Create an application in Azure Active Directory

### Register an application

Registering your application establishes a trust relationship between Modeling and Simulation Workbench remote desktop authentication and the Microsoft identity platform. The trust is unidirectional: your app trusts the Microsoft identity platform, and not the other way around.

Follow these steps to create the app registration:

1. If you have access to multiple tenants, use the **Directories + subscriptions** filter ![img](/azure/active-directory/develop/media/common/portal-directory-subscription-filter.png) in the top menu to switch to the tenant in which you want to register the application.

1. Search for and select **Azure Active Directory**.

1. Under **Manage**, select **App registrations** > **New registration**.

1. Type *QuickstartModSimWorkbenchApp* for the **Name**.

1. Select **Accounts in this organizational directory only (Single tenant)** for the **Supported account types**.

1. Don't enter anything for **Redirect URI (optional)**. You'll configure a redirect URI in the next section.

1. Select **Register** to complete the initial app registration.

   :::image type="content" source="/azure/active-directory/develop/media/quickstart-register-app/portal-02-app-reg-01.png" alt-text="Screenshot of the Azure portal in a web browser, showing the Register an application pane.":::

Take note of the properties in the next steps:

- **Application (client) ID**: Microsoft identity platform unique identifier for the application. Make sure to save the **Application (client) ID** somewhere to be available to store in your Key Vault created in the next section.

   :::image type="content" source="/azure/active-directory/develop/media/quickstart-register-app/portal-03-app-reg-02.png" alt-text="Screenshot of the Azure portal in a web browser, showing the application overview pane.":::

### Add a client secret

Creating a client secret allows the Azure Modeling and Simulation Workbench to redirect Azure AD sign-in requests directly to your organization's Azure Active Directory, as the only identity provider. This integration provides a single sign-on experience for your design team. The secret's lifetime should last the workbench's lifetime. If the secret does expire, your design team would lose access to the chamber. To address an expired secret, you can create a new secret and update the Azure Modeling and Simulation Workbench with the new values.

1. In **App registrations**, select your application *QuickstartModSimWorkbenchApp*.
1. Select **Certificates & secrets** > **Client secrets** > **New client secret**.
1. Add a description for your client secret.
1. Select **Recommended: 6 months** for the **Expires**.
1. Select **Add**.

Take note of the properties in the next steps:

- **Client secret value**: This secret value is *never displayed again* after you leave this page. Make sure to save the **secret value** somewhere to be available to store in your Key Vault created in the next section.

### Create a vault

1. From the Azure portal menu, or from the **Home** page, select **Create a resource**.
1. In the Search box, enter **Key Vault**.
1. From the results list, choose **Key Vault**.
1. On the Key Vault section, select **Create**.
1. On the **Create key vault** section provide the following information:
   - **Name**: A unique name is required. For this quickstart, we use *QuickstartVault*-\<numbers\>.

   - **Subscription**: Choose a subscription.

   - Under **Resource Group**, select **Create new** to create a new resource group. Type *QuickstartCreateModSimWorkbench-rg* for the **Name**.

   - In the **Location** pull-down menu, choose a location.

   - In **Access policy**, select **Azure role-based access control** under **Permission model**.

      :::image type="content" source="/azure/key-vault/media/rbac/image-1.png" alt-text="Enable Azure RBAC permissions - new vault":::

   - Leave the other options to their defaults.
1. After providing the information as instructed, select **Create**.

   :::image type="content" source="/azure/key-vault/media/quick-create-portal/vault-properties.png" alt-text="Output after Key Vault creation completes":::

### Key Vault role assignment

1. Go to the Key Vault created in **Create a vault** step and select **Access control (IAM)**.

1. Select **Add** > **Add role assignment** to open the Add role assignment page.

   :::image type="content" source="./media/quickstart-create-portal/vault-iam01.png" alt-text="Add role assignment page in Azure portal.":::

1. Assign the following roles.

   | Setting          | Value                                   |
   | :--------------- | :-------------------------------------- |
   | Role             | Key Vault Secrets User                  |
   | Assign access to | User, group, or service principal       |
   | Members          | Azure Modeling and Simulation Workbench |

   | Setting          | Value                                   |
   | :--------------- | :-------------------------------------- |
   | Role             | Key Vault Secrets Officer               |
   | Assign access to | User, group, or service principal       |
   | Members          | \<your Azure account\>                  |

### Add secrets to Key Vault

1. Navigate to your key vault *QuickstartVault*-\<numbers\> in the Azure portal.
1. On the Key Vault settings pages, select **Secrets**.
1. Click on **Generate/Import**.
1. On the **Create a secret** screen choose the following values:
   - **Upload options**: Choose *Manual*.
   - **Name**: Type *QuickstartModSimWorkbenchAppClientId*
   - **Value**: Paste **Application (client) ID** recorded in **Register an application** step.
   - Leave the other values to their defaults. Select **Create**.
1. Create another secret with the following values:
   - **Upload options**: Choose *Manual*.
   - **Name**: Type *QuickstartModSimWorkbenchAppSecretValue*
   - **Value**: Paste **Client secret value** recorded in **Add a client secret** step.
   - Leave the other values to their defaults. Select **Create**.
1. Create another secret with the following values:
   - **Upload options**: Choose *Manual*.
   - **Name**: Type *QuickstartModSimWorkbenchDesktopLicenseKey*
   - **Value**: Paste the OpenText Exceed TurboX license key text.
   - Leave the other values to their defaults. Select **Create**.
1. Take note of the three secret identifiers.

## Register Azure Modeling and Simulation Workbench (preview) resource provider

1. On the Azure portal menu, search for **Subscriptions**. Select it from the available options.

   :::image type="content" source="/azure/azure-resource-manager/management/media/resource-providers-and-types/search-subscriptions.png" alt-text="search subscriptions":::

1. Select the subscription you want to view.

   :::image type="content" source="/azure/azure-resource-manager/management/media/resource-providers-and-types/select-subscription.png" alt-text="select subscriptions":::

1. On the left menu, under **Settings**, select **Resource providers**.

   :::image type="content" source="/azure/azure-resource-manager/management/media/resource-providers-and-types/select-resource-providers.png" alt-text="select resource providers":::

1. Select the *Microsoft.ModSimWorkbench* resource provider, and select **Register**.

   :::image type="content" source="./media/quickstart-create-portal/register-resource-provider.png" alt-text="register resource providers":::

> [!IMPORTANT]
>
> To maintain least privileges in your subscription, only register those resource providers that you're ready to use.
>
> Don't block the creation of resources for a resource provider that is in the **registering** state. By not blocking a resource provider in the registering state, your application can continue much sooner than waiting for all regions to complete.

## Create an Azure Modeling and Simulation Workbench (preview)

1. While you're signed in the Azure portal, go to https://*\<AzurePortalUrl\>*/#blade/HubsExtension/BrowseResource/resourceType/Microsoft.ModSimWorkbench%2Fworkbenches. For example, https://portal.azure.com/#blade/HubsExtension/BrowseResource/resourceType/Microsoft.ModSimWorkbench%2Fworkbenches for Azure public cloud.

1. Under the **Modeling and Simulation Workbenches (preview)** page, select **Create**. The **Create an Azure Modeling and Simulation Workbench** page opens.

   :::image type="content" source="./media/quickstart-create-portal/create01.png" alt-text="Screenshot of the Marketplace showing how to search Azure Modeling and Simulation Workbench":::

1. In the **Basics** tab, under **Project details**, choose your subscription for **Subscription** and choose *QuickstartCreateModSimWorkbench-rg* for **Resource group**.

1. Under **Workbench details**, choose the following values:

   - **Name**: Type *myModSimWorkbench*.
   - **Region**: Choose *East US 2*.
   - **Modeling and Simulation Workbench IP address space**: Type *10.10.0.0/16*.
   > [!NOTE]
   > IP address space should allow for all possible chambers and workloads
   - **Application (client) ID**: Paste the secret identifier of *QuickstartModSimWorkbenchAppClientId* recorded in **Add secrets to Key Vault** step.
   - **Client secret value**: Paste the secret identifier of *QuickstartModSimWorkbenchAppSecretValue* recorded in **Add secrets to Key Vault** step.

1. Select **Next : Chamber >** button at the bottom of the page.

:::image type="content" source="./media/quickstart-create-portal/create02.png" alt-text="Screenshot of the Workbench details section showing where you type and select the values":::

1. In the **Chamber** tab, under **Chamber**, choose the following values:

   - **Chamber name**: Type *myFirstChamber*.

1. Under **Chamber connector**, choose the following values:

   - **Connector name**: Type *myfirstconnector*.

   - **Connect on-premises network**: Choose *None*.

      > [!NOTE]
      > Choose **ExpressRoute** when you have Azure ExpressRoute connected, choose **VPN** when you have VPN gateway setup, choose **None** when you don't have or don't use ExpressRoute/VPN.

   - **Network ACLs**: Type your public IP address using CIDR notation (for example, 100.100.100.100/32).

      > [!NOTE]
      > If you have another **Chamber Admin** with 100.100.100.101 and 2 **Chamber Users** with 100.100.100.102, 100.100.100.103, **Network ACLs** value is *100.100.100.100/30*.

   - **License file URL**: Paste the secret identifier of *QuickstartModSimWorkbenchDesktopLicenseKey* recorded in **Add secrets to Key Vault** step.

1. Under **Chamber VM**, choose the following values:
   - **Chamber VM name**: Type *myFirstChamberWorkload*.
   - **Chamber VM size**: Choose *E2s_v5*.
   - **Chamber VM count**: Type *1*.

1. Select **Review + create** button at the bottom of the page.

1. On the **Review + create** page, you can see the details about the Azure Modeling and Simulation Workbench you're about to create. When you're ready, select **Create**.

## Allowing the use of your Modeling and Simulation Workbench chamber

1. Type *quickstart* in the global search and select **myFirstChamber**.

   :::image type="content" source="./media/quickstart-create-portal/chamber-iam01.png" alt-text="Screenshot of the global search to select myFirstChamber":::

1. Select **Access control (IAM)** from the left side menu of **myFirstChamber**.

1. Select **Add** > **Add role assignment**. If you don't have permissions to assign roles, the Add role assignment option is disabled.

   :::image type="content" source="./media/quickstart-create-portal/chamber-iam02.png" alt-text="Screenshot of the Role assignments page showing where you select the Add role assignment command":::

1. The **Add role assignment** pane opens. In the **Role** list, search or scroll to find the role **Chamber Admin**. Choose **Chamber Admin** for the **Role** and select **Next**.

   :::image type="content" source="./media/quickstart-create-portal/chamber-iam03.png" alt-text="Screenshot of the Add role assignment page showing where you select the Role":::

1. Leave the **Assign access to** default **User, group, or service principal**. Select **+ Select members**. In the **Select members** blade on the left side of the screen, search for your security principal by entering a string or scrolling through the list. Select your security principal. Select **Select** to save the selections.

   :::image type="content" source="./media/quickstart-create-portal/chamber-iam04.png" alt-text="Screenshot of the Add role assignment page showing where you select the security principal":::

1. Select **Review + assign** to assign the selected role.

1. Repeat 3-6 for other users who need to work on the chamber as **Chamber User** role.

## Update the application in Azure Active Directory

A *redirect URI* is the location where the Microsoft identity platform redirects a user's client and sends security tokens after authentication.

Follow these steps to get redirect URIs:

1. On the page for your new Modeling and Simulation Workbench workbench **myModSimWorkbench**, select the left side menu **Connector**, select **myfirstconnector** from the right side resource list.

1. On the **Overview** page, take note of the two connector properties. If these properties aren't visible, be sure to click the "See More" button on the page:
   - **Dashboard reply URL**: For example, https://<*dashboardFqdn*>/etx/oauth2/code
   - **Authentication reply URL**: For example, https://<*authenticationFqdn*>/otdsws/login?authhandler=AzureOIDC

   :::image type="content" source="./media/quickstart-create-portal/update-aadapp01.png" alt-text="Screenshot of the connector overview page showing where you select the reply URLs":::

Follow these steps to add redirect URIs:

1. In the Azure portal, in **Azure Active Directory** > **App registrations**, select your application created in **Register an application** step.

1. Under **Manage**, select **Authentication**.

1. Under **Platform configurations**, select **Add a platform**.

1. Under **Configure platforms**, select **Web** tile.

1. Under **Configure Web** pane, paste the property of **Dashboard reply URL** recorded in the previous step, select **Configure**.

1. Under **Platform configurations** > **Web** > **Redirect URIs**, select **Add URI**.

1. Paste the property of **Authentication reply URL** recorded in the previous step and select **Save**.

   :::image type="content" source="./media/quickstart-create-portal/update-aadapp02.png" alt-text="Screenshot of the Azure AD app Authentication page showing where you select the Redirect URIs":::

## Clean up resources

There are two methods to clean up resources created in this quick start. You can delete the Azure resource group, which includes all the resources in the resource group, or you can delete the Modeling and Simulation Workbench resources individually.

> [!TIP]
> Other quickstarts in this collection build upon this quickstart. If you plan to continue on to work with subsequent quickstarts, don't clean up the resources created here. If you don't plan to continue, use the following steps to delete resources created by this quickstart in the Azure portal.

To delete the entire resource group including the newly created Modeling and Simulation Workbench:

1. Locate your resource group in the Azure portal. From the left-hand menu in the Azure portal, select **Resource groups** and then select the name of your resource group, like our example *QuickstartCreateModSimWorkbench-rg*.

1. On your resource group page, select **Delete**. Then type the name of your resource group, like our example *QuickstartCreateModSimWorkbench-rg*, in the text box to confirm deletion, and then select **Delete**.

Or instead, to delete the newly created Modeling and Simulation Workbench resources:

1. Locate your Modeling and Simulation Workbench in the Azure portal, if you don't have it open. From the left-hand menu in Azure portal, select **All resources**, and then search for the Modeling and Simulation Workbench you created, like our example *myModSimWorkbench*.

1. You need to delete child resources before deleting their parents. First delete any Chamber VMs and Connectors. Then delete Storages. Then delete Chambers. Lastly delete Workbenches.

1. On the **Overview** page for each resource, select the **Delete** button on the top pane to delete.

## Next steps

In this quickstart, you deployed a Modeling and Simulation Workbench, and allowed use of your Modeling and Simulation Workbench chamber. To learn how to install an application in Modeling and Simulation Workbench chamber, continue to the next quickstart.

   > [!div class="nextstepaction"]
   > [How to Activate your licenses in a Modeling and Simulation Workbench chamber](./howtoguide-licenses.md)

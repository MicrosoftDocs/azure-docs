---
title: Deploy Azure Blockchain Workbench Preview
description: How to deploy Azure Blockchain Workbench Preview
ms.date: 01/08/2020
ms.topic: article
ms.reviewer: brendal
#Customer intent: As a developer, I want to deploy Azure Blockchain Workbench so that I can create a blockchain apps.
---
# Deploy Azure Blockchain Workbench Preview

Azure Blockchain Workbench Preview is deployed using a solution template in the Azure Marketplace. The template simplifies the deployment of components needed to create blockchain applications. Once deployed, Blockchain Workbench provides access to client apps to create and manage users and blockchain applications.

For more information about the components of Blockchain Workbench, see [Azure Blockchain Workbench architecture](architecture.md).

[!INCLUDE [Preview note](./includes/preview.md)]

## Prepare for deployment

Blockchain Workbench allows you to deploy a blockchain ledger along with a set of relevant Azure services most often used to build a blockchain-based application. Deploying Blockchain Workbench results in the following Azure services being provisioned within a resource group in your Azure subscription.

* App Service Plan (Standard)
* Application Insights
* Event Grid
* Azure Key Vault
* Service Bus
* SQL Database (Standard S0)
* Azure Storage account (Standard LRS)
* Virtual machine scale set with capacity of 1
* Virtual Network resource group (with Load Balancer, Network Security Group, Public IP Address, Virtual Network)
* Azure Blockchain Service. If you are using a previous Blockchain Workbench deployment, consider redeploying Azure Blockchain Workbench to use Azure Blockchain Service.

The following is an example deployment created in **myblockchain** resource group.

![Example deployment](media/deploy/example-deployment.png)

The cost of Blockchain Workbench is an aggregate of the cost of the underlying Azure services. Pricing information for Azure services can be calculated using the [pricing calculator](https://azure.microsoft.com/pricing/calculator/).

## Prerequisites

Azure Blockchain Workbench requires Azure AD configuration and application registrations. You can choose to do the Azure AD [configurations manually](#azure-ad-configuration) before deployment or run a script post deployment. If you are redeploying Blockchain Workbench, see [Azure AD configuration](#azure-ad-configuration) to verify your Azure AD configuration.

> [!IMPORTANT]
> Workbench does not have to be deployed in the same tenant as the one you are using to register an Azure AD application. Workbench must be deployed in a tenant where you have sufficient permissions to deploy resources. For more information on Azure AD tenants, see [How to get an Active Directory tenant](../../active-directory/develop/quickstart-create-new-tenant.md) and [Integrating applications with Azure Active Directory](../../active-directory/develop/quickstart-v1-integrate-apps-with-azure-ad.md).

## Deploy Blockchain Workbench

Once the prerequisite steps have been completed, you are ready to deploy the Blockchain Workbench. The following sections outline how to deploy the framework.

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Select your account in the top-right corner, and switch to the desired Azure AD tenant where you want to deploy Azure Blockchain Workbench.
1. Select **Create a resource** in the upper left-hand corner of the Azure portal.
1. Select **Blockchain** > **Azure Blockchain Workbench (preview)**.

    ![Create Azure Blockchain Workbench](media/deploy/blockchain-workbench-settings-basic.png)

    | Setting | Description  |
    |---------|--------------|
    | Resource prefix | Short unique identifier for your deployment. This value is used as a base for naming resources. |
    | VM user name | The user name is used as administrator for all virtual machines (VM). |
    | Authentication type | Select if you want to use a password or key for connecting to VMs. |
    | Password | The password is used for connecting to VMs. |
    | SSH | Use an RSA public key in the single-line format beginning  with **ssh-rsa** or use the multi-line PEM format. You can generate SSH keys using `ssh-keygen` on Linux and OS X, or by using PuTTYGen on Windows. More information on SSH keys, see [How to use SSH keys with Windows on Azure](../../virtual-machines/linux/ssh-from-windows.md). |
    | Database and Blockchain password | Specify the password to use for access to the database created as part of the deployment. The password must meet three of the following four requirements: length needs to be between 12 & 72 characters, 1 lower case character, 1 upper case character, 1 number, and 1 special character that is not number sign(#), percent(%), comma(,), star(*), back quote(\`), double quote("), single quote('), dash(-) and semicolumn(;) |
    | Deployment region | Specify where to deploy Blockchain Workbench resources. For best availability, this should match the **Location** setting. |
    | Subscription | Specify the Azure Subscription you wish to use for your deployment. |
    | Resource groups | Create a new Resource group by selecting **Create new** and specify a unique resource group name. |
    | Location | Specify the region you wish to deploy the framework. |

1. Select **OK** to finish the basic setting configuration section.

1. In **Advanced Settings**, choose if you want to create a new blockchain network or use an existing proof-of-authority blockchain network.

    For **Create new**:

    The *create new* option deploys an Azure Blockchain Service Quorum ledger with the default basic sku.

    ![Advanced settings for new blockchain network](media/deploy/advanced-blockchain-settings-new.png)

    | Setting | Description  |
    |---------|--------------|
    | Azure Blockchain Service pricing tier | Choose **Basic** or **Standard** Azure Blockchain Service tier that is used for Blockchain Workbench |
    | Azure Active Directory settings | Choose **Add Later**.</br>Note: If you chose to [pre-configure Azure AD](#azure-ad-configuration) or are redeploying, choose to *Add Now*. |
    | VM selection | Select preferred storage performance and VM size for your blockchain network. Choose a smaller VM size such as *Standard DS1 v2* if you are on a subscription with low service limits like Azure free tier. |

    For **Use existing**:

    The *use existing* option allows you to specify an Ethereum Proof-of-Authority (PoA) blockchain network. Endpoints have the following requirements.

   * The endpoint must be an Ethereum Proof-of-Authority (PoA) blockchain network.
   * The endpoint must be publicly accessible over the network.
   * The PoA blockchain network should be configured to have gas price set to zero.

     > [!NOTE]
     > Blockchain Workbench accounts are not funded. If funds are required, the transactions fail.

     ![Advanced settings for existing blockchain network](media/deploy/advanced-blockchain-settings-existing.png)

     | Setting | Description  |
     |---------|--------------|
     | Ethereum RPC Endpoint | Provide the RPC endpoint of an existing PoA blockchain network. The endpoint starts with https:// or http:// and ends with a port number. For example, `http<s>://<network-url>:<port>` |
     | Azure Active Directory settings | Choose **Add Later**.</br>Note: If you chose to [pre-configure Azure AD](#azure-ad-configuration) or are redeploying, choose to *Add Now*. |
     | VM selection | Select preferred storage performance and VM size for your blockchain network. Choose a smaller VM size such as *Standard DS1 v2* if you are on a subscription with low service limits like Azure free tier. |

1. Select **OK** to finish Advanced Settings.

1. Review the summary to verify your parameters are accurate.

    ![Summary](media/deploy/blockchain-workbench-summary.png)

1. Select **Create** to agree to the terms and deploy your Azure Blockchain Workbench.

The deployment can take up to 90 minutes. You can use the Azure portal to monitor progress. In the newly created resource group, select **Deployments > Overview** to see the status of the deployed artifacts.

> [!IMPORTANT]
> Post deployment, you need to complete Active Directory settings. If you chose **Add Later**, you need to run the [Azure AD configuration script](#azure-ad-configuration-script).  If you chose **Add now**, you need to [configure the Reply URL](#configuring-the-reply-url).

## Blockchain Workbench web URL

Once the deployment of the Blockchain Workbench has completed, a new resource group contains your Blockchain Workbench resources. Blockchain Workbench services are accessed through a web URL. The following steps show you how to retrieve the web URL of the deployed framework.

1. Sign in to the [Azure portal](https://portal.azure.com).
1. In the left-hand navigation pane, select **Resource groups**.
1. Choose the resource group name you specified when deploying Blockchain Workbench.
1. Select the **TYPE** column heading to sort the list alphabetically by type.
1. There are two resources with type **App Service**. Select the resource of type **App Service** *without* the "-api" suffix.

    ![App service list](media/deploy/resource-group-list.png)

1. In the App Service **Overview**, copy the **URL** value, which represents the web URL to your deployed Blockchain Workbench.

    ![App service essentials](media/deploy/app-service.png)

To associate a custom domain name with Blockchain Workbench, see [configuring a custom domain name for a web app in Azure App Service using Traffic Manager](../../app-service/configure-domain-traffic-manager.md).

## Azure AD configuration script

Azure AD must be configured to complete your Blockchain Workbench deployment. You'll use a PowerShell script to do the configuration.

1. In a browser, navigate to the [Blockchain Workbench Web URL](#blockchain-workbench-web-url).
1. You'll see instructions to set up Azure AD using Cloud Shell. Copy the command and launch Cloud Shell.

    ![Launch AAD script](media/deploy/launch-aad-script.png)

1. Choose the Azure AD tenant where you deployed Blockchain Workbench.
1. In Cloud Shell PowerShell environment, paste and run the command.
1. When prompted, enter the Azure AD tenant you want to use for Blockchain Workbench. This will be the tenant containing the users for Blockchain Workbench.

    > [!IMPORTANT]
    > The authenticated user requires permissions to create Azure AD application registrations and grant delegated application permissions in the tenant. You may need to ask an administrator of the tenant to run the Azure AD configuration script or create a new tenant.

    ![Enter Azure AD tenant](media/deploy/choose-tenant.png)

1. You'll be prompted to authenticate to the Azure AD tenant using a browser. Open the web URL in a browser, enter the code, and authenticate.

    ![Authenticate with code](media/deploy/authenticate.png)

1. The script outputs several status messages. You get a **SUCCESS** status message if the tenant was successfully provisioned.
1. Navigate to the Blockchain Workbench URL. You are asked to consent to grant read permissions to the directory. This allows the Blockchain Workbench web app access to the users in the tenant. If you are the tenant administrator, you can choose to consent for the entire organization. This option accepts consent for all users in the tenant. Otherwise, each user is prompted for consent on first use of the Blockchain Workbench web application.
1. Select **Accept** to consent.

     ![Consent to read users profiles](media/deploy/graph-permission-consent.png)

1. After consent, the Blockchain Workbench web app can be used.

You have completed your Azure Blockchain Workbench deployment. See [Next steps](#next-steps) for suggestions to get started using your deployment.

## Azure AD configuration

If you choose to manually configure or verify Azure AD settings prior to deployment, complete all steps in this section. If you prefer to automatically configure Azure AD settings, use [Azure AD configuration script](#azure-ad-configuration-script) after you deploy Blockchain Workbench.

### Blockchain Workbench API app registration

Blockchain Workbench deployment requires registration of an Azure AD application. You need an Azure Active Directory (Azure AD) tenant to register the app. You can use an existing tenant or create a new tenant. If you are using an existing Azure AD tenant, you need sufficient permissions to register applications, grant Graph API permissions, and allow guest access within an Azure AD tenant. If you do not have sufficient permissions in an existing Azure AD tenant, create a new tenant.

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Select your account in the top-right corner, and switch to the desired Azure AD tenant. The tenant should be the subscription admin's tenant of the subscription where Azure Blockchain Workbench is deployed and you have sufficient permissions to register applications.
1. In the left-hand navigation pane, select the **Azure Active Directory** service. Select **App registrations** > **New registration**.

    ![App registration](media/deploy/app-registration.png)

1. Provide a display **Name** and choose **Accounts in this organizational directory only**.

    ![Create app registration](media/deploy/app-registration-create.png)

1. Select **Register** to register the Azure AD application.

### Modify manifest

Next, you need to modify the manifest to use application roles within Azure AD to specify Blockchain Workbench administrators.  For more information about application manifests, see [Azure Active Directory application manifest](../../active-directory/develop/reference-app-manifest.md).

1. A GUID is required for the manifest. You can generate a GUID using the PowerShell command `[guid]::NewGuid()` or `New-GUID` cmdlet. Another option is to use a GUID generator website.
1. For the application you registered, select **Manifest** in the **Manage** section.
1. Next, update the **appRoles** section of the manifest. Replace `"appRoles": []` with the provided JSON. Be sure to replace the value for the `id` field with the GUID you generated.
    ![Edit manifest](media/deploy/edit-manifest.png)

    ``` json
    "appRoles": [
         {
           "allowedMemberTypes": [
             "User",
             "Application"
           ],
           "displayName": "Administrator",
           "id": "<A unique GUID>",
           "isEnabled": true,
           "description": "Blockchain Workbench administrator role allows creation of applications, user to role assignments, etc.",
           "value": "Administrator"
         }
       ],
    ```

    > [!IMPORTANT]
    > The value **Administrator** is needed to identify Blockchain Workbench administrators.

1. In the manifest, also change the **Oauth2AllowImplicitFlow** value to **true**.

    ``` json
    "oauth2AllowImplicitFlow": true,
    ```

1. Select **Save** to save the manifest changes.

### Add Graph API required permissions

The API application needs to request permission from the user to access the directory. Set the following required permission for the API application:

1. In the *Blockchain API* app registration, select **API permissions**. By default, the Graph API **User.Read** permission is added.
1. The Workbench application requires read access to users' basic profile information. In *Configured permissions*, select **Add a permission**. In **Microsoft APIs**, select **Microsoft Graph**.
1. Since the Workbench application uses the authenticated user credentials, select **Delegated permissions**.
1. In the *User* category, choose **User.ReadBasic.All** permission.

    ![Azure AD app registration configuration showing adding the Microsoft Graph User.ReadBasic.All delegated permission](media/deploy/add-graph-user-permission.png)

    Select **Add permissions**.

1. In *Configured permissions*, select **Grant admin consent** for the domain then select **Yes** for the verification prompt.

   ![Grant permissions](media/deploy/client-app-grant-permissions.png)

   Granting permission allows Blockchain Workbench to access users in the directory. The read permission is required to search and add members to Blockchain Workbench.

### Get application ID

The application ID and tenant information are required for deployment. Collect and store the information for use during deployment.

1. For the application you registered, select **Overview**.
1. Copy and store the **Application ID** value for later use during deployment.

    ![API app properties](media/deploy/app-properties.png)

    | Setting to store  | Use in deployment |
    |------------------|-------------------|
    | Application (client) ID | Azure Active Directory setup > Application ID |

### Get tenant domain name

Collect and store the Active Directory tenant domain name where the applications are registered.

In the left-hand navigation pane, select the **Azure Active Directory** service. Select **Custom domain names**. Copy and store the domain name.

![Domain name](media/deploy/domain-name.png)

### Guest user settings

If you have guest users in your Azure AD tenant, follow the additional steps to ensure Blockchain Workbench user assignment and management works properly.

1. Switch you your Azure AD tenant and select **Azure Active Directory > User settings > Manage external collaboration settings**.
1. Set **Guest user permissions are limited** to **No**.
    ![External collaboration settings](media/deploy/user-collaboration-settings.png)

## Configuring the reply URL

Once the Azure Blockchain Workbench has been deployed, you have to configure the Azure Active Directory (Azure AD) client application **Reply URL** of the deployed Blockchain Workbench web URL.

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Verify you are in the tenant where you registered the Azure AD client application.
1. In the left-hand navigation pane, select the **Azure Active Directory** service. Select **App registrations**.
1. Select the Azure AD client application you registered in the prerequisite section.
1. Select **Authentication**.
1. Specify the main web URL of the Azure Blockchain Workbench deployment you retrieved in the [Blockchain Workbench web URL](#blockchain-workbench-web-url) section. The Reply URL is prefixed with `https://`. For example, `https://myblockchain2-7v75.azurewebsites.net`

    ![Authentication reply URLs](media/deploy/configure-reply-url.png)

1. In the **Advanced setting** section, check **Access tokens** and **ID tokens**.

    ![Authentication advanced settings](media/deploy/authentication-advanced-settings.png)

1. Select **Save** to update the client registration.

## Remove a deployment

When a deployment is no longer needed, you can remove a deployment by deleting the Blockchain Workbench resource group.

1. In the Azure portal, navigate to **Resource group** in the left navigation pane and select the resource group you want to delete.
1. Select **Delete resource group**. Verify deletion by entering the resource group name and select **Delete**.

    ![Delete resource group](media/deploy/delete-resource-group.png)

## Next steps

In this how-to article, you deployed Azure Blockchain Workbench. To learn how to create a blockchain application, continue to the next how-to article.

> [!div class="nextstepaction"]
> [Create a blockchain application in Azure Blockchain Workbench](create-app.md)

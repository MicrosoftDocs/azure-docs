---
title: Deploy Azure Blockchain Workbench
description: How to deploy Azure Blockchain Workbench
services: azure-blockchain
keywords: 
author: PatAltimore
ms.author: patricka
ms.date: 10/1/2018
ms.topic: article
ms.service: azure-blockchain
ms.reviewer: zeyadr
manager: femila
#customer intent: As a developer, I want to deploy Azure Blockchain Workbench so that I can create a blockchain apps.
---
# Deploy Azure Blockchain Workbench

Azure Blockchain Workbench is deployed using a solution template in the Azure Marketplace. The template simplifies the deployment of components needed to create blockchain applications. Once deployed, Blockchain Workbench provides access to client apps to create and manage users and blockchain applications.

For more information about the components of Blockchain Workbench, see [Azure Blockchain Workbench architecture](architecture.md).

## Prepare for deployment

Blockchain Workbench allows you to deploy a blockchain ledger along with a set of relevant Azure services most often used to build a blockchain-based application. Deploying Blockchain Workbench results in the following Azure services being provisioned within a resource group in your Azure subscription.

* 1 Event Grid Topic
* 1 Service Bus Namespace
* 1 Application Insights
* 1 SQL Database (Standard S0)
* 2 App Services (Standard)
* 2 Azure Key Vaults
* 2 Azure Storage accounts (Standard LRS)
* 2 Virtual machine scale sets (for validator and worker nodes)
* 2 Virtual Networks (including load balancer, network security group, and public IP address for each virtual network)
* Optional: Azure Monitor

The following is an example deployment created in **myblockchain** resource group.

![Example deployment](media/deploy/example-deployment.png)

The cost of Blockchain Workbench is an aggregate of the cost of the underlying Azure services. Pricing information for Azure services can be calculated using the [pricing calculator](https://azure.microsoft.com/pricing/calculator/).

Azure Blockchain Workbench requires several prerequisites prior to the deployment. The prerequisites include Azure AD configuration and application registrations.

### Blockchain Workbench API app registration

Blockchain Workbench deployment requires registration of an Azure AD application. You need an Azure Active Directory (Azure AD) tenant to register the app. You can use an existing tenant or create a new tenant. If you are using an existing Azure AD tenant, you need sufficient permissions to register applications and grant Graph API permissions within an Azure AD tenant. If you do not have sufficient permissions in an existing Azure AD tenant create a new tenant. 

> [!IMPORTANT]
> Workbench does not have to be deployed in the same tenant as the one you are using to register an Azure AD application. Workbench must be deployed in a tenant where you have sufficient permissions to deploy resources. For more information on Azure AD tenants, see [How to get an Active Directory tenant](../../active-directory/develop/quickstart-create-new-tenant.md) and [Integrating applications with Azure Active Directory](../../active-directory/develop/quickstart-v1-integrate-apps-with-azure-ad.md).

1. Sign in to the [Azure portal](https://portal.azure.com).
2. Select your account in the top right corner, and switch to the desired Azure AD tenant. The tenant should be the subscription admin's tenant of the subscription where Workbench is deployed and you have sufficient permissions to register applications.
3. In the left-hand navigation pane, select the **Azure Active Directory** service. Select **App registrations** > **New application registration**.

    ![App registration](media/deploy/app-registration.png)

4. Provide a **Name** and **Sign-on URL** for the application. You can use placeholder values since the values are changed during the deployment. 

    ![Create app registration](media/deploy/app-registration-create.png)

    |Setting  | Value  |
    |---------|---------|
    |Name | `Blockchain API` |
    |Application type |Web app / API|
    |Sign-on URL | `https://blockchainapi` |

5. Select **Create** to register the Azure AD application.

### Modify application manifest

Next, you need to modify the application manifest to use application roles within Azure AD to specify Blockchain Workbench administrators.  For more information about application manifests, see [Azure Active Directory application manifest](../../active-directory/develop/reference-app-manifest.md).

1. For the application you registered, select **Manifest** in the registered application details pane.
2. Generate a GUID. You can generate a GUID using the PowerShell command [guid] :: NewGuid () or New-GUID cmdlet. Another option is to use a GUID generator website.
3. You are going to update the **appRoles** section of the manifest. In the Edit manifest pane, select **Edit** and replace `"appRoles": []` with the provided JSON. Be sure to replace the value for the **id** field with the GUID you generated. 

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

    ![Edit manifest](media/deploy/edit-manifest.png)

    > [!IMPORTANT]
    > The value **Administrator** is needed to identify Blockchain Workbench administrators.

4.  Click **Save** to save the application manifest changes.

### Add Graph API required permissions

The API application needs to request permission from the user to access the directory. Set the following required permission for the API application:

1. In the Blockchain API app registration, select **Settings > Required permissions > Select an API > Microsoft Graph**.

    ![Select an API](media/deploy/client-app-select-api.png)

    Click **Select**.

2. In **Enable Access** under **Application permissions**, choose **Read all users' full profiles**.

    ![Enable access](media/deploy/client-app-read-perms.png)

    Click **Select** then click **Done**.

3. In **Required permissions**, select **Grant Permissions** then select **Yes** for the verification prompt.

   ![Grant permissions](media/deploy/client-app-grant-permissions.png)

   Granting permission allows Blockchain Workbench to access users in the directory. The read permission is required to search and add members to Blockchain Workbench.

### Add Graph API key to application

Blockchain Workbench uses Azure AD as the main identity management system for users interacting with blockchain applications. In order for Blockchain Workbench to access Azure AD and retrieve user information, such as names and emails, you need to add an access key. Blockchain Workbench uses the key to authenticate with Azure AD.

1. For the application you registered, select **Settings** in the registered application details pane.
2. Select **Keys**.
3. Add a new key by specifying a key **description** and choosing **expires** duration value. 

    ![Create key](media/deploy/app-key-create.png)

    |Setting  | Value  |
    |---------|---------|
    | Description | `Service` |
    | Expires | Choose an expiration duration |

4. Select **Save**. 
5. Copy the value of the key and store it for later. You need it for deployment.

    > [!IMPORTANT]
    >  If you don't save the key for the deployment, you will need to generate a new key. You can't retrieve the key value from the portal later.

### Get application ID

The application ID and tenant information are required for deployment. Collect and store the information for use during deployment.

1. For the application you registered, select **Settings** > **Properties**.
2.  In the **Properties** pane, copy and store the following values for later use during deployment.

    ![API app properties](media/deploy/app-properties.png)

    | Setting to store  | Use in deployment |
    |------------------|-------------------|
    | Application ID | Azure Active Directory setup > Application ID |

### Get tenant domain name

Collect and store the Active Directory tenant domain name where the applications are registered. 

In the left-hand navigation pane, select the **Azure Active Directory** service. Select **Custom domain names**. Copy and store the domain name.

![Domain name](media/deploy/domain-name.png)

## Deploy Blockchain Workbench

Once the prerequisite steps have been completed, you are ready to deploy the Blockchain Workbench. The following sections outline how to deploy the framework.

1.  Sign in to the [Azure portal](https://portal.azure.com).
2.  Select your account in the top right corner, and switch to the desired Azure AD tenant where you want to deploy Azure Blockchain Workbench.
3.  In the left pane, select **Create a resource**. Search for `Azure Blockchain Workbench` in the **Search the Marketplace** search bar. 

    ![Marketplace search bar](media/deploy/marketplace-search-bar.png)

4.  Select **Azure Blockchain Workbench**.

    ![Marketplace search results](media/deploy/marketplace-search-results.png)

4.  Select **Create**.
5.  Complete the basic settings.

    ![Create Azure Blockchain Workbench](media/deploy/blockchain-workbench-settings-basic.png)

    | Setting | Description  |
    |---------|--------------|
    | Resource prefix | Short unique identifier for your deployment. This value is used as a base for naming resources. |
    | VM user name | The user name is used as administrator for all virtual machines (VM). |
    | Authentication type | Select if you want to use a password or key for connecting to VMs. |
    | Password | The password is used for connecting to VMs. |
    | SSH | Use an RSA public key in the single-line format beginning  with **ssh-rsa** or use the multi-line PEM format. You can generate SSH keys using `ssh-keygen` on Linux and OS X, or by using PuTTYGen on Windows. More information on SSH keys, see [How to use SSH keys with Windows on Azure](../../virtual-machines/linux/ssh-from-windows.md). |
    | Database password / Confirm database password | Specify the password to use for access to the database created as part of the deployment. |
    | Deployment region | Specify where to deploy Blockchain Workbench resources. For best availability, this should match the **Location** setting. |
    | Subscription | Specify the Azure Subscription you wish to use for your deployment. |
    | Resource groups | Create a new Resource group by selecting **Create new** and specify a unique resource group name. |
    | Location | Specify the region you wish to deploy the framework. |

6.  Select **OK** to finish the basic setting configuration section.

7.  Complete the **Azure Active Directory setup**.

    ![Azure AD Setup](media/deploy/blockchain-workbench-settings-aad.png)

    | Setting | Description  |
    |---------|--------------|
    | Domain Name | Use the Azure AD tenant collected in the [Get tenant domain name](#get-tenant-domain-name) prerequisite section. |
    | Application ID | Use the Application ID from the Blockchain client app registration collected in the [Get application ID](#get-application-id) prerequisite section. |
    | Application Key | Use the Application key from the Blockchain client app registration collected in the [Add Graph API key to application](#add-graph-api-key-to-application) prerequisite section. |


8.  Click **OK** to finish the Azure AD Parameters configuration section.

9.  In **Network Settings and Performance**, choose if you want to create a new blockchain network or use an existing proof-of-authority blockchain network.

    For **Create new**:

    The *create new* option creates a set of Ethereum Proof-of Authority (PoA) nodes within a single member’s subscription. 

    ![Network settings and performance](media/deploy/blockchain-workbench-settings-network-new.png)

    | Setting | Description  |
    |---------|--------------|
    | Number of blockchain nodes | Choose the number of Ethereum PoA validator nodes to be deployed in your network. |
    | Storage performance | Choose the preferred VM storage performance for your blockchain network. |
    | Virtual machine size | Choose the preferred VM size for your blockchain network. |

    For **Use existing**:

    The *use existing* option allows you to specify an Ethereum Proof-of-Authority (PoA) blockchain network. Endpoints have the following requirements.

    * The endpoint must be an Ethereum Proof-of-Authority (PoA) blockchain network.
    * The endpoint must be publicly accessible over the network.
    * The PoA blockchain network should be configured to have gas price set to zero (Note: Blockchain Workbench accounts are not funded. If funds are required, the transactions fail).

    ![Network settings and performance](media/deploy/blockchain-workbench-settings-network-existing.png)

    | Setting | Description  |
    |---------|--------------|
    | Ethereum RPC Endpoint | Provide the RPC endpoint of an existing PoA blockchain network. The endpoint starts with http:// and ends with a port number. For example, `http://contoso-chain.onmicrosoft.com:8545` |
    | Storage performance | Choose the preferred VM storage performance for your blockchain network. |
    | Virtual machine size | Choose the preferred VM size for your blockchain network. |

10. Select **OK** to finish network settings and performance.

11. Complete the **Azure Monitor** settings.

    ![Azure Monitor](media/deploy/blockchain-workbench-settings-oms.png)

    | Setting | Description  |
    |---------|--------------|
    | Monitoring | Choose whether you want to enable Azure Monitor to monitor your blockchain network |
    | Connect to existing Log Analytics instance | Choose whether you want to use an existing Log Analytics instance or create a new one. If using an existing instance, enter your workspace ID and primary key. |

12. Click **OK** to finish the Azure Monitor section.

13. Review the summary to verify your parameters are accurate.

    ![Summary](media/deploy/blockchain-workbench-summary.png)

14. Select **Create** to agree to the terms and deploy your Azure Blockchain Workbench.

The deployment can take up to 90 minutes. You can use the Azure portal to monitor progress. In the newly created resource group, select **Deployments > Overview** to see the status of the deployed artifacts.

## Blockchain Workbench Web URL

Once the deployment of the Blockchain Workbench has completed, a new resource group contains your Blockchain Workbench resources. Blockchain Workbench services are accessed through a web URL. The following steps show you how to retrieve the web URL of the deployed framework.

1. Sign in to the [Azure portal](https://portal.azure.com).
2. In the left-hand navigation pane, select **Resource groups**
3. Choose the resource group name you specified when deploying Blockchain Workbench.
4. Click the **TYPE** column heading to sort the list alphabetically by type.
5. There are two resources with type **App Service**. Select the resource of type **App Service** *without* the "-api" suffix.

    ![App service list](media/deploy/resource-group-list.png)

6.  In the App Service **Essentials** section, copy the **URL** value, which represents the web URL to your deployed Blockchain Workbench.

    ![App service essentials](media/deploy/app-service.png)

To associate a custom domain name with Blockchain Workbench, see [configuring a custom domain name for a web app in Azure App Service using Traffic Manager](../../app-service/web-sites-traffic-manager-custom-domain-name.md).

## Configuring the Reply URL

Once the Azure Blockchain Workbench has been deployed, the next step is to make sure the Azure Active Directory (Azure AD) client application is registered to the correct **Reply URL** of the deployed Blockchain Workbench web URL.

1. Sign in to the [Azure portal](https://portal.azure.com).
2. Verify you are in the tenant where you registered the Azure AD client application.
3. In the left-hand navigation pane, select the **Azure Active Directory** service. Select **App registrations**.
4. Select the Azure AD client application you registered in the prerequisite section.
5. Select **Settings > Reply URLs**.
6. Specify the main web URL of the Azure Blockchain Workbench deployment you retrieved in the **Get the Azure Blockchain Workbench Web URL** section. The Reply URL is prefixed with `https://`. For example, `https://myblockchain2-7v75.azurewebsites.net`

    ![Reply URLs](media/deploy/configure-reply-url.png)

7. Select **Save** to update the client registration.

## Remove a deployment

When a deployment is no longer needed, you can remove a deployment by deleting the Blockchain Workbench resource group.

1. In the Azure portal, navigate to **Resource group** in the left navigation pane and select the resource group you want to delete. 
2. Select **Delete resource group**. Verify deletion by entering the resource group name and select **Delete**.

    ![Delete resource group](media/deploy/delete-resource-group.png)

## Next steps

In this how-to article, you deployed Azure Blockchain Workbench. To learn how to create a blockchain application, continue to the next how-to article.

> [!div class="nextstepaction"]
> [Create a blockchain application in Azure Blockchain Workbench](create-app.md)

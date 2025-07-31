# Configure continuous deployment using Deployment Center

# Introduction

Deployment Center for Logic Apps Standard provides a streamlined and automated way to manage your application’s deployments by integrating your source code repository directly with your Logic App resource. By leveraging Deployment Center, you can set up continuous deployment (CD) to ensure that every change committed to your repository is automatically deployed to your Logic App in Azure. This enables teams to deliver new features, fix bugs, and respond to changes more rapidly, all while maintaining control and visibility over the deployment process. Deployment Center supports multiple source control providers and seamlessly fits into modern DevOps workflows, ensuring your Logic Apps remain up to date and production-ready.

# Pre-requisites

-   An Azure account and subscription. If you don't have an Azure subscription, [sign up for a free Azure account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
-   [Visual Studio Code with the Azure Logic Apps (Standard) extension installed and their prerequisites](https://learn.microsoft.com/en-us/azure/logic-apps/create-single-tenant-workflows-visual-studio-code#prerequisites).
-   The Standard logic app to setup continuous deployment on the Azure portal, with Basic SCM Authentication enabled.
-   An Azure Key Vault that will be used to store
-   A User-Assigned Managed Identity associated to the Logic Apps application, with the following role assignments:
    -   "Logic App Standard Contributor" role assigned on the Logic Apps’ resource group.
    -   “Key Vault Secrets User” role assigned on the Azure Key Vault instance.
-   A Visual Studio code Logic Apps Standard workspace created and connected to a source control repository.

# Walkthrough

Follow the steps below to configure and use Deployment Center with Logic Apps Standard.

## Create Deployment Center scripts in Visual Studio Code

1.  In Visual Studio Code, open your **Logic Apps project** context menu and select **Generate deployment scripts…**

![](media/generate-deployment-screen-menu-option.png)

2.  Follow the prompts to complete these steps:
    1.  Select the existing Azure subscription where your Logic Apps is deployed.
    2.  Select the existing resource group where your Logic App is deployed.
    3.  Select your Logic Apps where the project will be published.
    4.  Select the associated user managed identity that has the **Logic Apps Standard Contributor** permissions.

When you're done, Visual Studio Code creates the following resources:

| Folder Name                   | File Name           | Description                                                                                                                                                                                                                                                                                                                                                         |
|-------------------------------|---------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| \<Logic Apps project folder\> | cloud.settings.json | This file copies the keys required to deploy the Logic Apps application from the local.settings.json. The file will have associated values for any non-secret value, and a placeholder to include a keyvault reference for any secrets.                                                                                                                             |
| deployment                    | deploy.ps1          | This is the deployment script parameterized with the items you selected during the wizard. This script will deploy the logic app code and update the authentication required for any of the Azure managed connections defined in connections.json.  It will also deploy all the settings defined in the cloud.settings.json file created in the Logic Apps project. |
|                               | README.md           | The README.md file contains instructions on how to update cloud.settings.json to safely deploy application secrets, including: Connection strings required for Service Provider connections in the project. API Management keys Azure Function keys Any other customer defined secrets.                                                                             |

Once you review the files and update cloud.settings.json with the keyvault references, push your changes to your source control.

## Configure Azure Logic Apps Standard Deployment Center in the portal

To configure Azure Logic Apps Standard Deployment Center with a GitHub repository, follow these steps:

1.  In the [Azure portal](https://portal.azure.com/), go to your Standard logic app resource.
2.  On the logic app menu, under **Deployment**, select **Deployment Center.**
3.  Select GitHub as source repository.
4.  Change the provider to App Service Build Service.

    ![A screenshot of a computer AI-generated content may be incorrect.](media/select-build-provider.png)

5.  Sign in to Github, if you are not signed yet.
6.  Select your organization.
7.  Select your repository.
8.  Select your branch.

Scroll back to the top of the page and click **Save.**

To configure Azure Logic Apps Standard Deployment Center with a Azure Repo repository, follow these steps:

1.  In the [Azure portal](https://portal.azure.com/), go to your Standard logic app resource.
2.  On the logic app menu, under **Deployment**, select **Deployment Center.**
3.  Select Azure Repos as source repository.
4.  Change the provider to App Service Build Service.

    ![A screenshot of a computer AI-generated content may be incorrect.](media/select-build-provider.png)

5.  Select your organization
6.  Select your project
7.  Select your repository
8.  Select your branch

Scroll back to the top of the page and click **Save.**

Verify that you deployment worked correctly by checking the Logs tab and check if the deployment completed successfully.

![A screenshot of a computer AI-generated content may be incorrect.](media/deployment-center-logs.png)

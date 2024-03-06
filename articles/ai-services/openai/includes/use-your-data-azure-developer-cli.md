## Select and initialize the Azure Developer CLI template

The Azure Developer CLI (`azd`) is an open-source, command-line tool that streamlines provisioning and deploying resources to Azure using a template system. The template contains infrastructure files to provision the necessary Azure OpenAI resources and configurations and includes the completed sample app code. This automated approach is recommended if you want to explore the code as quickly as possible without going through the setup tasks. 

1. For the steps ahead, select and initialize the template for your desired language.

    [!INCLUDE [use-your-data-azure-developer-cli-tabs-init](use-your-data-azure-developer-cli-tabs-init.md)]
    
2. The `azd init` command prompts you for the following information:

    * Environment name: This value is used as a prefix for all Azure resources created by Azure Developer CLI. The name must be unique across all Azure subscriptions and must be between 3 and 24 characters long. The name can contain numbers and lowercase letters only.

## Use the template to deploy resources

1. Sign-in to Azure:

    ```bash
    azd auth login
    ```

1. Provision and deploy the OpenAI resource to Azure:

    ```bash
    azd up
    ```
    
    `azd` prompts you for the following information:
    
    * Subscription: The Azure subscription that your resources are deployed to.
    * Location: The Azure region where your resources are deployed.
    
    > [!NOTE]
    > The provisioning process may take several minutes to complete. Wait for the task to finish before you proceed to the next steps.
        
1. Click the link `azd` outputs to navigate to the new resource group in the Azure portal. You should see the following top level resources:
    
    * An Azure OpenAI service with a GPT-4 model deployed
    * An Azure Storage account you can use to upload your own data files
    * An Azure AI Search service configured with the proper indexes and data sources

## Upload data to the storage account

`azd` provisioned all of the required resources for you to chat with your own data, but you still need to upload the data files you want to make available to your AI service.

1. Navigate to the new storage account in the Azure portal.
1. On the left navigation, select **Storage browser**.
1. Select **Blob containers** and then navigate into the **File uploads** container.
1. Click the **Upload** button at the top of the screen. In the flyout menu that opens, upload the files you wish to make available to your OpenAI service.

## Run the app locally

The `azd` template includes a complete sample chat app in the `src` directory. When the `azd` template ran, it also created the necessary environment variables for the sample app to run locally. Complete the following steps to run the app locally:

[!INCLUDE [use-your-data-azure-developer-cli-tabs-run](use-your-data-azure-developer-cli-tabs-run.md)]

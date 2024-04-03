## Clone and initialize the Azure Developer CLI template

The Azure Developer CLI (`azd`) is an open-source, command-line tool that streamlines provisioning and deploying resources to Azure using a template system. The template contains infrastructure files to provision the necessary Azure OpenAI resources and configurations and includes the completed sample app code. This automated approach is recommended if you want to explore the code as quickly as possible without going through the setup tasks. 

1. For the steps ahead, clone and initialize the template.

    ```bash
    azd init --template openai-chat-your-own-data
    ```
    
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
    > The sample `azd` template uses the `gpt-35-turbo-16k` model. A recommended region for this template is East US, since different Azure regions support different OpenAI models. You can visit the [Azure OpenAI Service Models](/azure/ai-services/openai/concepts/models) support page for more details about model support by region.
    
    > [!NOTE]
    > The provisioning process may take several minutes to complete. Wait for the task to finish before you proceed to the next steps.
        
1. Click the link `azd` outputs to navigate to the new resource group in the Azure portal. You should see the following top level resources:
    
    * An Azure OpenAI service with a deployed model
    * An Azure Storage account you can use to upload your own data files
    * An Azure AI Search service configured with the proper indexes and data sources

## Upload data to the storage account

`azd` provisioned all of the required resources for you to chat with your own data, but you still need to upload the data files you want to make available to your AI service.

1. Navigate to the new storage account in the Azure portal.
1. On the left navigation, select **Storage browser**.
1. Select **Blob containers** and then navigate into the **File uploads** container.
1. Click the **Upload** button at the top of the screen. 
1. In the flyout menu that opens, upload _contoso_benefits_document_example.pdf_ file in the root `documents` folder of the example repo.
 
> [!NOTE]
> The search indexer is set to run every 5 minutes to index the data in the storage account. You can either wait a few minutes for the uploaded data to be indexed, or you can manually run the indexer from the search service page.

## Use Azure OpenAI On Your Data

After running the `azd` template and uploading your data, you're ready to start using Azure OpenAI on Your Data. Use the following links to find instructions on creating environment variables for your machine and running code in your preferred usage method:

* [Azure OpenAI Studio](../use-your-data-quickstart.md?pivots=programming-language-studio#chat-playground)
* [C#](../use-your-data-quickstart.md?pivots=programming-language-csharp#retrieve-required-variables)
* [JavaScript](../use-your-data-quickstart.md?pivots=programming-language-javascript#retrieve-required-variables)
* [Python](../use-your-data-quickstart.md?pivots=programming-language-python#retrieve-required-variables)
* [Spring](../use-your-data-quickstart.md?pivots=programming-language-spring#retrieve-required-variables)
* [Go](../use-your-data-quickstart.md?pivots=programming-language-go#retrieve-required-variables)
* [REST API](../use-your-data-quickstart.md?pivots=rest-api#retrieve-required-variables)
* [Powershell](../use-your-data-quickstart.md?programming-language-powershell#retrieve-required-variables)


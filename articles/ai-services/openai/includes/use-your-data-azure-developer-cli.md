## Select and initialize the Azure Developer CLI template

The Azure Developer CLI (`azd`) is an open-source, command-line tool that streamlines provisioning and deploying resources to Azure using a template system. The template contains infrastructure files to provision the necessary Azure OpenAI resources and configurations, as well as the completed sample app code. This automated approach is recommended if you want to explore the code as quickly as possible without going through the setup tasks. 

With `azd`, you can provision OpenAI resources and run the sample code with just a few commands. For the steps ahead, select and initialize the template for your desired language.

## [C#](#tab/csharp)

    ```bash
    azd init --template openai-your-own-data-csharp
    ```

## [Python](#tab/python)

    ```bash
    azd init --template openai-your-own-data-python
    ```

## [JavaScript](#tab/javascript)

    ```bash
    azd init --template openai-your-own-data-javascript
    ```
    
---

The `azd init` command prompts you for the following information:

* Environment name: This value is used as a prefix for all Azure resources created by Azure Developer CLI. The name must be unique across all Azure subscriptions and must be between 3 and 24 characters long. The name can contain numbers and lowercase letters only.

## Use the Azure Developer CLI template to deploy resources

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

## [C#](#tab/csharp)
    
Open a terminal in the `src` directory of the `azd` template and run the following command:

```bash
dotnet run
```

You should see the following response content in the output:

```output
Answer from assistant:
===
Azure Machine Learning is a cloud-based service that provides tools and services to build, train, and deploy machine learning models. It offers a collaborative environment for data scientists, developers, and domain experts to work together on machine learning projects. Azure Machine Learning supports various programming languages, frameworks, and libraries, including Python, R, TensorFlow, and PyTorch [^1^].
===
Context information (e.g. citations) from chat extensions:
===
tool: {
    "citations": [
    {
        "content": "...",
        "id": null,
        "title": "...",
        "filepath": "...",
        "url": "...",
        "metadata": {
        "chunking": "orignal document size=1011. Scores=3.6390076 and None.Org Highlight count=38."
        },
        "chunk_id": "2"
    },
    ...
    ],
    "intent": "[\u0022What are the differences between Azure Machine Learning and Azure AI services?\u0022]"
}
===
```

## [Python](#tab/python)

Open a terminal in the `src` directory of the `azd` template and run the following command:

tbd

## [JavaScript](#tab/javascript)

Open a terminal in the `src` directory of the `azd` template and run the following command:

tbd

---

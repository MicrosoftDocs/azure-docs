## Select and initialize the Azure Developer CLI template

The Azure Developer CLI (`azd`) is an open-source, command-line tool that streamlines provisioning and deploying resources to Azure using a template system. The template contains infrastructure files to provision the necessary Azure OpenAI resources and configurations and includes the completed sample app code. This automated approach is recommended if you want to explore the code as quickly as possible without going through the setup tasks. 

For the steps ahead, select and initialize the template for your desired language.

## [C#](#tab/azd-csharp)

1. Clone and initialize the template:    

```bash
azd init --template openai-chat-your-own-data
```

2. Navigate into the _dotnet_ directory:
    
```bash
cd dotnet
```

## [Python](#tab/azd-python)

1. Clone and initialize the template:    

```bash
azd init --template openai-chat-your-own-data
```

2. Navigate into the _python_ directory:
    
```bash
cd python
```

## [JavaScript](#tab/azd-javascript)

1. Clone and initialize the template:    

```bash
azd init --template openai-chat-your-own-data
```

2. Navigate into the _javascript_ directory:
    
```bash
cd javascript
```

---
    
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

## Run the app locally

The `azd` template includes a complete sample chat app in the `src` directory. When the `azd` template ran, it also created the necessary environment variables for the sample app to run locally. Complete the following steps to run the app locally:

## [C#](#tab/azd-csharp)
    
Open a terminal in the `dotnet/src` directory of the `azd` template and run the following command:

```bash
dotnet run
```

You should see an expanded version of the following response content in the output:

```output
Message from assistant:
===
You have two available health plans: Northwind Health Plus and Northwind Standard [doc1].

- Northwind Health Plus is a comprehensive plan that provides coverage for medical, vision, and dental services. It also includes prescription drug coverage, mental health and substance abuse coverage, and coverage for preventive care services. This plan offers a wide range of in-network providers, including primary care physicians, specialists, hospitals, and pharmacies. It also covers emergency services, both in-network and out-of-network [doc1].

- Northwind Standard is a basic plan that provides coverage for medical, vision, and dental services. It includes coverage for preventive care services and prescription drugs. However, it does not cover emergency services, mental health and substance abuse coverage, or out-of-network services [doc1].

Please note that the cost of the health insurance will be deducted from each paycheck, and the employee's portion of the cost will be calculated based on the selected health plan and the number of people covered by the insurance [doc1].
===
Context information (e.g. citations) from chat extensions:
===
```

## [Python](#tab/azd-python)
    
Open a terminal in the `python/src` directory of the `azd` template and run the following command:

```bash
python main.py
```

You should see an expanded version of the following response content in the output:

```output
Message from assistant:
===
You have two available health plans: Northwind Health Plus and Northwind Standard [doc1].

- Northwind Health Plus is a comprehensive plan that provides coverage for medical, vision, and dental services. It also includes prescription drug coverage, mental health and substance abuse coverage, and coverage for preventive care services. This plan offers a wide range of in-network providers, including primary care physicians, specialists, hospitals, and pharmacies. It also covers emergency services, both in-network and out-of-network [doc1].

- Northwind Standard is a basic plan that provides coverage for medical, vision, and dental services. It includes coverage for preventive care services and prescription drugs. However, it does not cover emergency services, mental health and substance abuse coverage, or out-of-network services [doc1].

Please note that the cost of the health insurance will be deducted from each paycheck, and the employee's portion of the cost will be calculated based on the selected health plan and the number of people covered by the insurance [doc1].
===
Context information (e.g. citations) from chat extensions:
===
```

## [JavaScript](#tab/azd-javascript)
    
Open a terminal in the `javascript/src` directory of the `azd` template and run the following command:

```bash
node ChatWithOwnData.js
```

You should see an expanded version of the following response content in the output:

```output
Message from assistant:
===
You have two available health plans: Northwind Health Plus and Northwind Standard [doc1].

- Northwind Health Plus is a comprehensive plan that provides coverage for medical, vision, and dental services. It also includes prescription drug coverage, mental health and substance abuse coverage, and coverage for preventive care services. This plan offers a wide range of in-network providers, including primary care physicians, specialists, hospitals, and pharmacies. It also covers emergency services, both in-network and out-of-network [doc1].

- Northwind Standard is a basic plan that provides coverage for medical, vision, and dental services. It includes coverage for preventive care services and prescription drugs. However, it does not cover emergency services, mental health and substance abuse coverage, or out-of-network services [doc1].

Please note that the cost of the health insurance will be deducted from each paycheck, and the employee's portion of the cost will be calculated based on the selected health plan and the number of people covered by the insurance [doc1].
===
Context information (e.g. citations) from chat extensions:
===

---

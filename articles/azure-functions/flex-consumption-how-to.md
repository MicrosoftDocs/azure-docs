---
title: Create and manage function apps in a Flex Consumption plan
description: "Learn how to create function apps hosted in the Flex Consumption plan in Azure Functions and how to modify specific settings for an existing function app."
ms.date: 05/21/2024
ms.topic: how-to
ms.custom:
  - build-2024
zone_pivot_groups: programming-languages-set-functions
#customer intent: As an Azure developer, I want learn how to create and manage function apps in the Flex Consumption plan so that I can take advantage of the beneficial features of this plan.
---

# Create and manage function apps in the Flex Consumption plan

This article shows you how to create function apps hosted in the [Flex Consumption plan](./flex-consumption-plan.md) in Azure Functions. It also shows you how to manage certain features of a Flex Consumption plan hosted app.

Function app resources are langauge-specific. Make sure to choose your preferred code development language at the beginning of the article.

[!INCLUDE [functions-flex-preview-note](../../includes/functions-flex-preview-note.md)]

## Prerequisites

+ An Azure account with an active subscription. If you don't already have one, you can [create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

+ **[Azure CLI](/cli/azure/install-azure-cli)**: used to create and manage resources in Azure. When using the Azure CLI on your local computer, make sure to use version 2.60.0, or a later version. You can also use [Azure Cloud Shell](../cloud-shell/overview.md), which has the correct Azure CLI version.  

+ **[Visual Studio Code](./functions-develop-vs-code.md)**: used to create and develop apps, create Azure resources, and deploy code projects to Azure. When using Visual Studio Code, make sure to also install the latest [Azure Functions extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions). You can also install the [Azure Tools extension pack](https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-node-azure-pack). 

+ While not required to create a Flex Consumption plan app, you need a code project to be able to deploy to and validate a new function app. Complete the first part of one of these quickstart articles, where you creat a code project with an HTTP triggered function:

    ::: zone pivot="programming-language-csharp"  
    + [Create an Azure Functions project from the command line](create-first-function-cli-csharp.md)   
    + [Create an Azure Functions project using Visual Studio Code](create-first-function-vs-code-csharp.md) 
    ::: zone-end   
    ::: zone pivot="programming-language-javascript"  
    + [Create an Azure Functions project from the command line](create-first-function-cli-node.md)  
    + [Create an Azure Functions project using Visual Studio Code](create-first-function-vs-code-node.md) 
    ::: zone-end  
    ::: zone pivot="programming-language-java" 
    + [Create an Azure Functions project from the command line](create-first-function-cli-java.md)  
    + [Create an Azure Functions project using Visual Studio Code](create-first-function-vs-code-java.md)
    
     To create an app in a new Flex Consumption plan during a Maven deployment, you must create your local app project and then update the project's pom.xml file. For more information, see [Create a Java Flex Consumption app using Maven](#create-and-deploy-your-app-using-maven)   
    ::: zone-end   
    ::: zone pivot="programming-language-typescript"  
    + [Create an Azure Functions project from the command line](create-first-function-cli-typescript.md)  
    + [Create an Azure Functions project using Visual Studio Code](create-first-function-vs-code-typescript.md) 
    ::: zone-end   
    ::: zone pivot="programming-language-python"  
    + [Create an Azure Functions project from the command line](create-first-function-cli-python.md)  
    + [Create an Azure Functions project using Visual Studio Code](create-first-function-vs-code-python.md) 
    ::: zone-end   
    ::: zone pivot="programming-language-powershell"  
    + [Create an Azure Functions project from the command line](create-first-function-cli-powershell.md)  
    + [Create an Azure Functions project using Visual Studio Code](create-first-function-vs-code-powershell.md) 
    ::: zone-end   

    Return to this article after you create and run the local project, but before you're asked to create Azure resources. You create the function app and other Azure resources in the next section.

## Create a Flex Consumption app

This section shows you how to create a function app in the Flex Consumption plan by using either the Azure CLI, Azure portal, or Visual Studio Code. For an example of creating an app in a Flex Consumption plan using Bicep/ARM templates, see the [Flex Consumption repository](https://github.com/Azure-Samples/azure-functions-flex-consumption-samples/blob/main/README.md#iac-samples-overview).
::: zone pivot="programming-language-java" 
You can skip this section if you choose to instead [create and deploy your app using Maven](#create-and-deploy-your-app-using-maven).   
::: zone-end  

To support your function code, you need to create three resources:

+ A [resource group](../azure-resource-manager/management/overview.md), which is a logical container for related resources.
+ A [Storage account](../storage/common/storage-account-create.md), which is used to maintain state and other information about your functions.
+ A function app in the Flex Consumption plan, which provides the environment for executing your function code. A function app maps to your local function project and lets you group functions as a logical unit for easier management, deployment, and sharing of resources in the Flex Consumption plan.

### [Azure CLI](#tab/azure-cli)

[!INCLUDE [functions-flex-supported-regions-cli](../../includes/functions-flex-supported-regions-cli.md)]

3. Create a resource group in one of the [currently supported regions](#view-currently-supported-regions):
    
    ```azurecli
    az group create --name <RESOURCE_GROUP> --location <REGION>
    ```
 
    In the above command, replace `<RESOURCE_GROUP>` with a value that's unique  in your subscription and `<REGION>` with one of the [currently supported regions](#view-currently-supported-regions). The [az group create](/cli/azure/group#az-group-create) command creates a resource group.  

4. Create a general-purpose storage account in your resource group and region:

    ```azurecli
    az storage account create --name <STORAGE_NAME> --location <REGION> --resource-group <RESOURCE_GROUP> --sku Standard_LRS --allow-blob-public-access false
    ``` 

    In the previous example, replace `<STORAGE_NAME>` with a name that is appropriate to you and unique in Azure Storage. Names must contain three to 24 characters numbers and lowercase letters only. `Standard_LRS` specifies a general-purpose account, which is [supported by Functions](storage-considerations.md#storage-account-requirements). The [az storage account create](/cli/azure/storage/account#az-storage-account-create) command creates the storage account.

    [!INCLUDE [functions-storage-access-note](../../includes/functions-storage-access-note.md)]    

5. Create the function app in Azure:
    ::: zone pivot="programming-language-csharp"  
    ```azurecli
    az functionapp create --resource-group <RESOURCE_GROUP> --name <APP_NAME> --storage-account <STORAGE_NAME> --flexconsumption-location <REGION> --runtime dotnet-isolated --runtime-version 8.0 
    ```
    
    [C# apps that run in-process](./functions-dotnet-class-library.md) aren't currently supported when running in a Flex Consumption plan.
    ::: zone-end   
    ::: zone pivot="programming-language-java"  
    ```azurecli
    az functionapp create --resource-group <RESOURCE_GROUP> --name <APP_NAME> --storage-account <STORAGE_NAME> --flexconsumption-location <REGION> --runtime java --runtime-version 17 
    ```     
    
    For Java apps, Java 11 is also currently supported.
    ::: zone-end
    ::: zone pivot="programming-language-javascript,programming-language-typescript"  
    ```azurecli
    az functionapp create --resource-group <RESOURCE_GROUP> --name <APP_NAME> --storage-account <STORAGE_NAME> --flexconsumption-location <REGION> --runtime node --runtime-version 20 
    ```     
    ::: zone-end  
    ::: zone pivot="programming-language-python"  
    ```azurecli
    az functionapp create --resource-group <RESOURCE_GROUP> --name <APP_NAME> --storage-account <STORAGE_NAME> --flexconsumption-location <REGION> --runtime python --runtime-version 3.11 
    ```     
    
    For Python apps, Python 3.10 is also currently supported.
    ::: zone-end 
    ::: zone pivot="programming-language-powershell"  
    ```azurecli
    az functionapp create --resource-group <RESOURCE_GROUP> --name <APP_NAME> --storage-account <STORAGE_NAME> --flexconsumption-location <REGION> --runtime powershell --runtime-version 7.4 
    ```
    ::: zone-end 
    In this example, replace both `<RESOURCE_GROUP>` and `<STORAGE_NAME>` with the resource group and the name of the account you used in the previous step, respectively. Also replace `<APP_NAME>` with a globally unique name appropriate to you. The `<APP_NAME>` is also the default domain name server (DNS) domain for the function app. The [`az functionapp create`] command creates the function app in Azure.

    This command creates a function app running in the Flex Consumption plan. The specific language runtime version used is one that is currently supported in the preview. 

    Because you created the app without specifying [always ready instances](#set-always-ready-instance-counts), your app only incurs costs when actively executing functions. The command also creates an associated Azure Application Insights instance in the same resource group, with which you can monitor your function app and view logs. For more information, see [Monitor Azure Functions](functions-monitoring.md).
    ```

### [Azure portal](#tab/azure-portal)

[!INCLUDE [functions-create-flex-consumption-app-portal](../../includes/functions-create-flex-consumption-app-portal.md)]

6. Select **Review + create** to review the app configuration you chose, and then select **Create** to provision and deploy the function app.

7. Select the **Notifications** icon in the upper-right corner of the portal and watch for the **Deployment succeeded** message.

8. Select **Go to resource** to view your new function app. You can also select **Pin to dashboard**. Pinning makes it easier to return to this function app resource from your dashboard.

### [Visual Studio Code](#tab/vs-code)

1.  Press F1, and in the command pallet enter **Azure Functions: Create function app in Azure...(Advanced)**.

1. If you're not signed in, you're prompted to **Sign in to Azure**. You can also **Create a free Azure account**. After signing in from the browser, go back to Visual Studio Code.

1. Following the prompts, provide this information:

    | Prompt |  Selection |
    | ------ |  ----------- |
    | Enter a globally unique name for the new function app. | Type a globally unique name that identifies your new function app and then select Enter. Valid characters for a function app name are `a-z`, `0-9`, and `-`. |
    | Select a hosting plan. | Choose **Flex Consumption (Preview)**. |
    | Select a runtime stack. | Choose one of the supported language stack versions. |
    | Select a resource group for new resources. | Choose **Create new resource group** and type a resource group name, like `myResourceGroup`, and then select enter. You can also select an existing resource group. |
    | Select a location for new resources. | Select a location in a supported [region](https://azure.microsoft.com/regions/) near you or near other services that your functions access. Unsupported regions aren't displayed. For more information, see [View currently supported regions](#view-currently-supported-regions).|
    | Select a storage account. | Choose **Create new storage account** and at the prompt provide a globally unique name for the new storage account used by your function app and then select Enter. Storage account names must be between 3 and 24 characters long and can contain only numbers and lowercase letters. You can also select an existing account. |
    | Select an Application Insights resource for your app. | Choose **Create new Application Insights resource** and at the prompt provide the name for the instance used to store runtime data from your functions.| 

    A notification appears after your function app is created. Select **View Output** in this notification to view the creation and deployment results, including the Azure resources that you created.

---

## Deploy your code project
::: zone pivot="programming-language-java" 
You can skip this section if you choose to instead [create and deploy your app using Maven](#create-and-deploy-your-app-using-maven).   
::: zone-end 

You can choose to deploy your project code to an existing function app using various tools:

### [Visual Studio Code](#tab/vs-code-publish)

[!INCLUDE [functions-deploy-project-vs-code](../../includes/functions-deploy-project-vs-code.md)]

### [Core Tools](#tab/core-tools)

[!INCLUDE [functions-publish-project-cli-clean](../../includes/functions-publish-project-cli-clean.md)]

---

::: zone pivot="programming-language-java" 
## Create and deploy your app using Maven

You can use Maven to create a Flex Consumption hosted function app and required resources during deployment by modifying the pom.xml file. 
 
1. Create a Java code project by completing the first part of one of these quickstart articles:
        
    + [Create an Azure Functions project from the command line](create-first-function-cli-java.md)  
    + [Create an Azure Functions project using Visual Studio Code](create-first-function-vs-code-java.md) 

1. In your Java code project, open the pom.xml file and make these changes to create your function app in the Flex Consumption plan: 

    + Change the value of `<properties>.<azure.functions.maven.plugin.version>` to `1.34.0`.

    + In the `<plugin>.<configuration>` section for the `azure-functions-maven-plugin`, add or uncomment the `<pricingTier>` element as follows:
        
        ```xml
        <pricingTier>Flex Consumption</pricingTier>
        ```

1. (Optional) Customize the Flex Consumption plan in your Maven deployment by also including these elements in the `<plugin>.<configuration>` section:             .

    + `<instanceSize>` - sets the [instance memory](./flex-consumption-plan.md#instance-memory) size for the function app. The default value is `2048`.  
    + `<maximumInstances>` - sets the highest value for the maximum instances count of the function app.  
    + `<alwaysReadyInstances>` - sets the [always ready instance counts](flex-consumption-plan.md#always-ready-instances) with child elements for HTTP trigger groups (`<http>`), Durable Functions groups (`<durable>`), and other specific triggers (`<my_function>`). When you set any instance count greater than zero, you're charged for these instances whether your functions execute or not. For more information, see [Billing](flex-consumption-plan.md#billing).  

1. Before you can deploy, sign in to your Azure subscription using the Azure CLI. 

    ```azurecli
    az login
    ```

    The [`az login`](/cli/azure/reference-index#az-login) command signs you into your Azure account.

1. Use the following command to deploy your code project to a new function app in Flex Consumption.

    ```console
    mvn azure-functions:deploy
    ```
    
    Maven uses settings in the pom.xml template to create your function app in a Flex Consumption plan in Azure, along with the other required resources. Should these resources already exist, the code is deployed to your function app, overwriting any existing code.
::: zone-end  

## Enable virtual network integration

You can enable [virtual network integration](functions-networking-options.md#virtual-network-integration) for your app in a Flex Consumption plan. The examples in this section assume that you already have [created a virtual network with subnet](../virtual-network/quick-create-cli.md#create-a-virtual-network-and-subnet) in your account. You can enable virtual network integration when you create your app or at a later time.

To enable virtual networking when you create your app:

### [Azure CLI](#tab/azure-cli)

You can enable virtual network integration by running the [`az functionapp create`] command and including the `--vnet` and `--subnet` parameters.

1. [Create the virtual network and subnet](../virtual-network/quick-create-cli.md#create-a-virtual-network-and-subnet), if you haven't already done so.

1. Complete steps 1-4 in [Create a Flex Consumption app](#create-a-flex-consumption-app) to create the resources required by your app.

1. Run the [`az functionapp create`] command, including the `--vnet` and `--subnet` parameters, as in this example:

    ```azurecli
    az functionapp create --resource-group <RESOURCE_GROUP> --name <APP_NAME> --storage-account <STORAGE_NAME> --flexconsumption-location <REGION> --runtime <RUNTIME_NAME> --runtime-version <RUNTIME_VERSION> --vnet <VNET_RESOURCE_ID> --subnet <SUBNET_NAME>
    ```

    The `<VNET_RESOURCE_ID>` value is the resource ID for the virtual network, which is in the format: `/subscriptions/<SUBSCRIPTION_ID>/resourceGroups/<RESOURCER_GROUP>/providers/Microsoft.Network/virtualNetworks/<VNET_NAME>`. You can use this command to get a list of virtual network IDs, filtered by `<RESOURCE_GROUP>`: `az network vnet list --resource-group <RESOURCE_GROUP> --output tsv --query "[]".id`. 

### [Azure portal](#tab/azure-portal)

Use these steps to create your function app with virtual network integration and related Azure resources. 

[!INCLUDE [functions-create-flex-consumption-app-portal](../../includes/functions-create-flex-consumption-app-portal.md)]

6. In the **Networking** tab, set **Enable public access** to **Off** and **Enable network injection** to **On**.

7. For **Virtual network**, select or create a virtual network that is in the same region as your app.

8. Set **Enable VNet integration** to **On** and select or create a subnet.

6. Select **Review + create** to review the app configuration you chose, and then select **Create** to provision and deploy the function app with virtual networking.

7. Select the **Notifications** icon in the upper-right corner of the portal and watch for the **Deployment succeeded** message.

8. Select **Go to resource** to view your new function app. You can also select **Pin to dashboard**. Pinning makes it easier to return to this function app resource from your dashboard.

### [Visual Studio Code](#tab/vs-code)

You can't currently enable virtual networking when you use Visual Studio Code to create your app.

---

For end-to-end examples of how to create apps in Flex Consumption with virtual network integration see these resources:

+ [Flex Consumption: HTTP to Event Hubs using VNET Integration](https://github.com/Azure-Samples/azure-functions-flex-consumption-samples/blob/main/E2E/HTTP-VNET-EH/README.md)
+ [Flex Consumption: triggered from Service Bus using VNET Integration](https://github.com/Azure-Samples/azure-functions-flex-consumption-samples/blob/main/E2E/SB-VNET/README.md)

To modify or delete virtual network integration in an existing app:

### [Azure CLI](#tab/azure-cli)

Use the [`az functionapp vnet-integration add`](/cli/azure/functionapp/vnet-integration#az-functionapp-vnet-integration-add) command to enable virtual network integration to an existing function app:

```azurecli
az functionapp vnet-integration add --resource-group <RESOURCE_GROUP> --name <APP_NAME> --vnet <VNET_RESOURCE_ID> --subnet <SUBNET_NAME>
```

Use the [`az functionapp vnet-integration remove`](/cli/azure/functionapp/vnet-integration#az-functionapp-vnet-integration-remove) command to disable virtual network integration in your app:

```azurecli
az functionapp vnet-integration remove --resource-group <RESOURCE_GROUP> --name <APP_NAME>
```

Use the [`az functionapp vnet-integration list`](/cli/azure/functionapp/vnet-integration#az-functionapp-vnet-integration-list) command to list the current virtual network integrations for your app:

```azurecli
az functionapp vnet-integration list --resource-group <RESOURCE_GROUP> --name <APP_NAME>
```

### [Azure portal](#tab/azure-portal)

You can integrate your existing app with an existing virtual network and subnet in the portal. 

1. In your function app page in the [Azure portal](https://portal.azure.com), expand **Settings** in the left menu and select **Networking**.

1. Under **Outbound traffic configuration**, select **Not configured**.

1. In the **Virtual Network Integration** page, select **Add virtual network integration**.

1. Select an existing **Virtual network** and **Subnet** and select **Connect**.

### [Visual Studio Code](#tab/vs-code)

You can't currently configure virtual networking in Visual Studio Code.

---

When choosing a subnet, these considerations apply:

+ The subnet you choose can't already be used for other purposes, such as with private endpoints or service endpoints, or be delegated to any other hosting plan or service. 
+ You can share the same subnet with more than one app running in a Flex Consumption plan. Because the networking resources are shared across all apps, one function app might impact the performance of others on the same subnet.
+ In a Flex Consumption plan, a single function app might use up to 40 IP addresses, even when the app scales beyond 40 instances. While this rule of thumb is helpful when estimating the subnet size you need, it's not strictly enforced.  

## Configure deployment settings

In the Flex Consumption plan, the deployment package that contains your app's code is maintained in an Azure Blob Storage container. By default, deployments use the same storage account (`AzureWebJobsStorage`) and connection string value used by the Functions runtime to maintain your app. The connection string is stored in the `DEPLOYMENT_STORAGE_CONNECTION_STRING` application setting. However, you can instead designate a blob container in a separate storage account as the deployment source for your code. You can also change the authentication method used to access the container. 

A customized deployment source should meet this criteria:

+ The storage account must already exist.
+ The container to use for deployments must also exist.
+ When more than one app uses the same storage account, each should have its own deployment container. Using a unique container for each app prevents the deployment packages from being overwritten, which would happen if apps shared the same container.

When configuring deployment storage authentication, keep these considerations in mind:

+ When you use a connection string to connect to the deployment storage account, the application setting that contains the connection string must already exist.
+ When you use a user-assigned managed identity, the provided identity gets linked to the function app. The `Storage Blob Data Contributor` role scoped to the deployment storage account also gets assigned to the identity.
+ When you use a system-assigned managed identity, an identity gets created when a valid system-assigned identity doesn't already exist in your app. When a system-assigned identity does exists, the `Storage Blob Data Contributor` role scoped to the deployment storage account also gets assigned to the identity.

To configure deployment settings when you create your function app in the Flex Consumption plan:

### [Azure CLI](#tab/azure-cli) 

Use the [`az functionapp create`] command and supply these additional options that customize deployment storage:  

| Parameter | Description |
|--|--|--|
| `--deployment-storage-name` | The name of the deployment storage account. | 
| `--deployment-storage-container-name` | The name of the container in the account to contain your app's deployment package. | 
| `--deployment-storage-auth-type`| The authentication type to use for connecting to the deployment storage account. Accepted values include `StorageAccountConnectionString`, `UserAssignedIdentity`, and `SystemAssignedIdentity`. |
| `--deployment-storage-auth-value` | When using  `StorageAccountConnectionString`, this parameter is set to the name of the application setting that contains the connection string to the deployment storage account. When using `UserAssignedIdentity`, this parameter is set to the name of the resource ID of the identity you want to use. |

This example creates a function app in the Flex Consumption plan with a separate deployment storage account and user assigned identity:

```azurecli
az functionapp create --resource-group <RESOURCE_GROUP> --name <APP_NAME> --storage <STORAGE_NAME> --runtime dotnet-isolated --runtime-version 8.0 --flexconsumption-location "<REGION>" --deployment-storage-name <DEPLOYMENT_ACCCOUNT_NAME> --deployment-storage-container-name <DEPLOYMENT_CONTAINER_NAME> --deployment-storage-auth-type UserAssignedIdentity --deployment-storage-auth-value <MI_RESOURCE_ID>
```

### [Azure portal](#tab/azure-portal)

You can't currently configure deployment storage when creating your app in the Azure portal. To configure deployment storage during app creation, instead use the Azure CLI to create your app. 

You can use the portal to modify the deployment settings of an existing app, as detailed in the next section.  

### [Visual Studio Code](#tab/vs-code)

You can't currently configure deployment storage when creating your app in Azure using Visual Studio Code. 

---

You can also modify the deployment storage configuration for an existing app.

### [Azure CLI](#tab/azure-cli)  

Use the [`az functionapp deployment config set`](/cli/azure/functionapp/deployment/config#az-functionapp-deployment-config-set) command to modify the deployment storage configuration: 

```azurecli
az functionapp deployment config set --resource-group <RESOURCE_GROUP> --name <APP_NAME> --deployment-storage-name <DEPLOYMENT_ACCCOUNT_NAME> --deployment-storage-container-name <DEPLOYMENT_CONTAINER_NAME>
```

### [Azure portal](#tab/azure-portal)

1. In your function app page in the [Azure portal](https://portal.azure.com), expand **Settings** in the left menu and select **Deployment settings**.

1. Under Application package location, select an existing **Storage account** and then select an existing empty **container** in the account.

1. Under Storage authentication, select your preferred authentication type 

    + If you selected **Connection string**, select the name of the app setting that contains the connection string for the deployment storage account.

    + If you selected **User assigned identity**, select the identity you would like to use.

1. Select **Save** to update the app.  


### [Visual Studio Code](#tab/vs-code)

You can't currently configure deployment storage for your app in Azure using Visual Studio Code.

---

## Configure instance memory

The instance memory size used by your Flex Consumption plan can be explicitly set when you create your app. For more information about supported sizes, see [Instance memory](flex-consumption-plan.md#instance-memory).  

To set an instance memory size that's different from the default when creating your app:

### [Azure CLI](#tab/azure-cli)

Specify the `--instance-memory` parameter in your [`az functionapp create`] command. This example creates a C# app with an instance size of `4096`:

```azurecli
az functionapp create --instance-memory 4096 --resource-group <RESOURCE_GROUP> --name <APP_NAME> --storage-account <STORAGE_NAME> --flexconsumption-location <REGION> --runtime dotnet-isolated --runtime-version 8.0
```

### [Azure portal](#tab/azure-portal)

When you create your app in a Flex Consumption plan in the Azure portal, you can choose your instance memory size in the **Instance size** field in the **Basics** tab. For more information, see [Create a Flex Consumption app](#create-a-flex-consumption-app).

### [Visual Studio Code](#tab/vs-code)

You can't currently control the instance memory size when you use Visual Studio Code to create your app. The default size is used.

---

At any point, you can change the instance memory size setting used by your app.

### [Azure CLI](#tab/azure-cli)

This example uses the [`az functionapp scale config set`](/cli/azure/functionapp/scale/config#az-functionapp-scale-config-set) command to change the instance memory size setting to 4,096 MB: 

```azurecli
az functionapp scale config set --resource-group <resourceGroup> --name <APP_NAME> --instance-memory 4096
```

### [Azure portal](#tab/azure-portal)

1. In your function app page in the [Azure portal](https://portal.azure.com), expand **Settings** in the left menu and select **Scale and concurrency**.

1. Select an **Instance memory** option and select **Save** to update the app.


### [Visual Studio Code](#tab/vs-code)

You can't currently change the instance memory size setting for your app using Visual Studio Code.

---

## Set always ready instance counts

When creating an app in a Flex Consumption plan, you can set the always ready instance count for specific groups (HTTP or Durable triggers) and triggers. For individual functions, use the format `function:<FUNCTION_NAME>=n`.

### [Azure CLI](#tab/azure-cli)

Use the `--always-ready-instances` parameter with the [`az functionapp create`] command to define one or more always ready instance designations. This example sets the always ready instance count for all HTTP triggered functions to `5`:

```azurecli
az functionapp create --resource-group <RESOURCE_GROUP> --name <APP_NAME> --storage <STORAGE_NAME> --runtime <LANGUAGE_RUNTIME> --runtime-version <RUNTIME_VERSION> --flexconsumption-location <REGION> --always-ready-instances http=10
```

This example sets the always ready instance count for all Durable trigger functions to `3` and sets the always ready instance count to `2` for a service bus triggered function named `function5`:

```azurecli
az functionapp create --resource-group <RESOURCE_GROUP> --name <APP_NAME> --storage <STORAGE_NAME> --runtime <LANGUAGE_RUNTIME> --runtime-version <RUNTIME_VERSION> --flexconsumption-location <REGION> --always-ready-instances durable=3 function:function5=2
```

### [Azure portal](#tab/azure-portal)

You can't currently define always ready instances when creating your app in the Azure portal. To define always ready instances during app creation, instead use the Azure CLI to create your app. 

You can use the portal to modify always ready instances on an existing app, as detailed in the next section.  

### [Visual Studio Code](#tab/vs-code)

You can't currently define always ready instances when creating your app in Azure using Visual Studio Code. 

---

You can also modify always ready instances on an existing app by adding or removing instance designations or by changing existing instance designation counts. 

### [Azure CLI](#tab/azure-cli)

This example uses the [`az functionapp scale config always-ready set`](/cli/azure/functionapp/scale/config/always-ready#az-functionapp-scale-config-always-ready-set) command to change the always ready instance count for the HTTP triggers group to `10`:

```azurecli
az functionapp scale config always-ready set --resource-group <RESOURCE_GROUP> --name <APP_NAME> --settings http=10
```

To remove always ready instances, use the [`az functionapp scale config always-ready delete`](/cli/azure/functionapp/scale/config/always-ready#az-functionapp-scale-config-always-ready-delete) command, as in this example that removes all always ready instances from both the HTTP triggers group and also a function named `hello_world`:

```azurecli
az functionapp scale config always-ready delete --resource-group <RESOURCE_GROUP> --name <APP_NAME> --setting-names http hello_world
```

### [Azure portal](#tab/azure-portal)

1. In your function app page in the [Azure portal](https://portal.azure.com), expand **Settings** in the left menu and select **Scale and concurrency**.

1. Under **Always-ready instance minimum** type `http`, `blob`, `durable`, or a specific function name in **Trigger** and type the **Number of always-ready instances**.

1. Select **Save** to update the app.

### [Visual Studio Code](#tab/vs-code)

You can't currently modify always ready instances using Visual Studio Code. 

---

## Set HTTP concurrency limits

Unless you set specific limits, HTTP concurrency defaults for Flex Consumption plan apps are determined based on your instance size setting. For more information, see [HTTP trigger concurrency](functions-concurrency.md#http-trigger-concurrency). 

Here's how you can set HTTP concurrency limits for an existing app:

### [Azure CLI](#tab/azure-cli)

Use the [`az functionapp scale config set`](/cli/azure/functionapp/scale/config#az-functionapp-scale-config-set) command to set specific HTTP concurrency limits for your app, regardless of instance size.

```azurecli
az functionapp scale config set -resource-group <RESOURCE_GROUP> -name <APP_NAME> --trigger-type http --trigger-settings perInstanceConcurrency=10
```

This example sets the HTTP trigger concurrency level to `10`. After you specifically set an HTTP concurrency value, that value is maintained despite any changes in your app's instance size setting. 

### [Azure portal](#tab/azure-portal)

1. In your function app page in the [Azure portal](https://portal.azure.com), expand **Settings** in the left menu and select **Scale and concurrency**.

1. Under **Concurrency per instance** select **Assign manually** and type a specific limit.

1. Select **Save** to update the app.

### [Visual Studio Code](#tab/vs-code)

You can't currently set HTTP concurrency limits using Visual Studio Code. 

---

## View currently supported regions

During the preview, you're only able to run on the Flex Consumption plan only in selected regions. To view the list of regions that currently support Flex Consumption plans: 

[!INCLUDE [functions-flex-supported-regions-cli](../../includes/functions-flex-supported-regions-cli.md)]

When you create an app in the [Azure portal](flex-consumption-how-to.md?tabs=azure-portal#create-a-flex-consumption-app) or by using [Visual Studio Code](flex-consumption-how-to.md?tabs=vs-code#create-a-flex-consumption-app), currently unsupported regions are filtered out of the region list.

## Related content

+ [Azure Functions Flex Consumption plan hosting](flex-consumption-plan.md)
+ [Azure Functions hosting options](functions-scale.md)

[`az functionapp create`]: /cli/azure/functionapp#az-functionapp-create

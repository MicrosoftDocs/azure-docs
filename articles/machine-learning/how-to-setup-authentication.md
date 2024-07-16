---
title: Set up authentication
titleSuffix: Azure Machine Learning
description: Learn how to set up and configure authentication for various resources and workflows in Azure Machine Learning.
services: machine-learning
author: Blackmist
ms.author: larryfr
ms.reviewer: meyetman
ms.service: machine-learning
ms.subservice: enterprise-readiness
ms.date: 01/05/2024
ms.topic: how-to
ms.custom: has-adal-ref, subject-rbac-steps, cliv2, sdkv2
---

# Set up authentication for Azure Machine Learning resources and workflows

[!INCLUDE [dev v2](includes/machine-learning-dev-v2.md)]
    

Learn how to set up authentication to your Azure Machine Learning workspace from the Azure CLI or Azure Machine Learning SDK v2. Authentication to your Azure Machine Learning workspace is based on __Microsoft Entra ID__ for most things. In general, there are four authentication workflows that you can use when connecting to the workspace:

* __Interactive__: You use your account in Microsoft Entra ID to either directly authenticate, or to get a token that is used for authentication. Interactive authentication is used during _experimentation and iterative development_. Interactive authentication enables you to control access to resources (such as a web service) on a per-user basis.

* __Service principal__: You create a service principal account in Microsoft Entra ID, and use it to authenticate or get a token. A service principal is used to _authenticate an automated process_ to the service without requiring user interaction. For example, a continuous integration and deployment script that trains and tests a model every time the training code changes.

* __Azure CLI session__: You use an active Azure CLI session to authenticate. The Azure CLI extension for Machine Learning (the `ml` extension or CLI v2) is a command line tool for working with Azure Machine Learning. You can sign in to Azure via the Azure CLI on your local workstation, without storing credentials in Python code or prompting the user to authenticate. Similarly, you can reuse the same scripts as part of continuous integration and deployment pipelines, while authenticating the Azure CLI with a service principal identity.

* __Managed identity__: When using the Azure Machine Learning SDK v2 _on a compute instance_ or _on an Azure Virtual Machine_, you can use a managed identity for Azure. This workflow allows the VM to connect to the workspace using the managed identity, without storing credentials in Python code or prompting the user to authenticate. Azure Machine Learning compute clusters can also be configured to use a managed identity to access the workspace when _training models_.

Regardless of the authentication workflow used, Azure role-based access control (Azure RBAC) is used to scope the level of access (authorization) allowed to the resources. For example, an admin or automation process might have access to create a compute instance, but not use it. While a data scientist could use it, but not delete or create it. For more information, see [Manage access to Azure Machine Learning workspace](how-to-assign-roles.md).

Microsoft Entra Conditional Access can be used to further control or restrict access to the workspace for each authentication workflow. For example, an admin can allow workspace access from managed devices only.

## Prerequisites

* Create an [Azure Machine Learning workspace](how-to-manage-workspace.md).
* [Configure your development environment](how-to-configure-environment.md) or use an [Azure Machine Learning compute instance](how-to-create-compute-instance.md) and install the [Azure Machine Learning SDK v2](https://aka.ms/sdk-v2-install).

* Install the [Azure CLI](/cli/azure/install-azure-cli).

<a name='azure-active-directory'></a>

## Microsoft Entra ID

All the authentication workflows for your workspace rely on Microsoft Entra ID. If you want users to authenticate using individual accounts, they must have accounts in your Microsoft Entra ID. If you want to use service principals, they must exist in your Microsoft Entra ID. Managed identities are also a feature of Microsoft Entra ID. 

For more on Microsoft Entra ID, see [What is Microsoft Entra authentication](..//active-directory/authentication/overview-authentication.md).

Once you create the Microsoft Entra accounts, see [Manage access to Azure Machine Learning workspace](how-to-assign-roles.md) for information on granting them access to the workspace and other operations in Azure Machine Learning.

## Use interactive authentication

# [Python SDK v2](#tab/sdk)

[!INCLUDE [sdk v2](includes/machine-learning-sdk-v2.md)]

Interactive authentication uses the [Azure Identity package for Python](/python/api/overview/azure/identity-readme). Most examples use `DefaultAzureCredential` to access your credentials. When a token is needed, it requests one using multiple identities (`EnvironmentCredential`, `ManagedIdentityCredential`, `SharedTokenCacheCredential`, `VisualStudioCodeCredential`, `AzureCliCredential`, `AzurePowerShellCredential`) in turn, stopping when one provides a token. For more information, see the [DefaultAzureCredential](/python/api/azure-identity/azure.identity.defaultazurecredential) class reference.

The following code is an example of using `DefaultAzureCredential` to authenticate. If authentication using `DefaultAzureCredential` fails, a fallback of authenticating through your web browser is used instead.

```python
from azure.identity import DefaultAzureCredential, InteractiveBrowserCredential

try:
    credential = DefaultAzureCredential()
    # Check if given credential can get token successfully.
    credential.get_token("https://management.azure.com/.default")
except Exception as ex:
    # Fall back to InteractiveBrowserCredential in case DefaultAzureCredential not work
    # This will open a browser page for
    credential = InteractiveBrowserCredential()
```

After the credential object is created, the [MLClient](/python/api/azure-ai-ml/azure.ai.ml.mlclient) class is used to connect to the workspace. For example, the following code uses the `from_config()` method to load connection information:

```python
from azure.ai.ml import MLClient
try:
    ml_client = MLClient.from_config(credential=credential)
except Exception as ex:
    # NOTE: Update following workspace information to contain
    #       your subscription ID, resource group name, and workspace name
    client_config = {
        "subscription_id": "<SUBSCRIPTION_ID>",
        "resource_group": "<RESOURCE_GROUP>",
        "workspace_name": "<AZUREML_WORKSPACE_NAME>",
    }

    # write and reload from config file
    import json, os

    config_path = "../.azureml/config.json"
    os.makedirs(os.path.dirname(config_path), exist_ok=True)
    with open(config_path, "w") as fo:
        fo.write(json.dumps(client_config))
    ml_client = MLClient.from_config(credential=credential, path=config_path)

print(ml_client)
```

# [Azure CLI](#tab/cli)

When you use the Azure CLI, the `az login` command is used to authenticate the CLI session. For more information, see [Get started with Azure CLI](/cli/azure/get-started-with-azure-cli).

---

## Configure a service principal

To use a service principal (SP), you must first create the SP. Then grant it access to your workspace. As mentioned earlier, Azure role-based access control (Azure RBAC) is used to control access, so you must also decide what access to grant the SP.

> [!IMPORTANT]
> When using a service principal, grant it the __minimum access required for the task__ it is used for. For example, you would not grant a service principal owner or contributor access if all it is used for is reading the access token for a web deployment.
>
> The reason for granting the least access is that a service principal uses a password to authenticate, and the password may be stored as part of an automation script. If the password is leaked, having the minimum access required for a specific tasks minimizes the malicious use of the SP.

The easiest way to create an SP and grant access to your workspace is by using the [Azure CLI](/cli/azure/install-azure-cli). To create a service principal and grant it access to your workspace, use the following steps:

> [!NOTE]
> You must be an admin on the subscription to perform all of these steps.

1. Authenticate to your Azure subscription:

    ```azurecli-interactive
    az login
    ```

    If the CLI can open your default browser, it does so and loads a sign-in page. Otherwise, you need to open a browser and follow the instructions on the command line. The instructions involve browsing to [https://aka.ms/devicelogin](https://aka.ms/devicelogin) and entering an authorization code.

    If you have multiple Azure subscriptions, you can use the `az account set -s <subscription name or ID>` command to set the subscription. For more information, see [Use multiple Azure subscriptions](/cli/azure/manage-azure-subscriptions-azure-cli).

    For other methods of authenticating, see [Sign in with Azure CLI](/cli/azure/authenticate-azure-cli).

1. Create the service principal. In the following example, an SP named **ml-auth** is created:

    ```azurecli-interactive
    az ad sp create-for-rbac --json-auth --name ml-auth --role Contributor --scopes /subscriptions/<subscription id>
    ```

    The parameter `--json-auth` is available in Azure CLI versions >= 2.51.0. Versions before this use `--sdk-auth`.

    The output is a JSON document similar to the following. Take note of the `clientId`, `clientSecret`, and `tenantId` fields, as you need them for other steps in this article.

    ```json
    {
        "clientId": "your-client-id",
        "clientSecret": "your-client-secret",
        "subscriptionId": "your-sub-id",
        "tenantId": "your-tenant-id",
        "activeDirectoryEndpointUrl": "https://login.microsoftonline.com",
        "resourceManagerEndpointUrl": "https://management.azure.com",
        "activeDirectoryGraphResourceId": "https://graph.windows.net",
        "sqlManagementEndpointUrl": "https://management.core.windows.net:5555",
        "galleryEndpointUrl": "https://gallery.azure.com/",
        "managementEndpointUrl": "https://management.core.windows.net"
    }
    ```

1. Retrieve the details for the service principal by using the `clientId` value returned in the previous step:

    ```azurecli-interactive
    az ad sp show --id your-client-id
    ```

    The following JSON is a simplified example of the output from the command. Take note of the `objectId` field, as you'll need its value for the next step.

    ```json
    {
        "accountEnabled": "True",
        "addIns": [],
        "appDisplayName": "ml-auth",
        ...
        ...
        ...
        "objectId": "your-sp-object-id",
        "objectType": "ServicePrincipal"
    }
    ```

1. To grant access to the workspace and other resources used by Azure Machine Learning, use the information in the following articles:
    * [How to assign roles and actions in Azure Machine Learning](how-to-assign-roles.md)
    * [How to assign roles in the CLI](../role-based-access-control/role-assignments-cli.md)

    > [!IMPORTANT]
    > Owner access allows the service principal to do virtually any operation in your workspace. It is used in this document to demonstrate how to grant access; in a production environment Microsoft recommends granting the service principal the minimum access needed to perform the role you intend it for. For information on creating a custom role with the access needed for your scenario, see [Manage access to Azure Machine Learning workspace](how-to-assign-roles.md).


## Configure a managed identity

> [!IMPORTANT]
> Managed identity is only supported when using the Azure Machine Learning SDK from an Azure Virtual Machine, an Azure Machine Learning compute cluster, or compute instance.

### Managed identity with a VM

1. Enable a [system-assigned managed identity for Azure resources on the VM](../active-directory/managed-identities-azure-resources/qs-configure-portal-windows-vm.md#system-assigned-managed-identity).

1. From the [Azure portal](https://portal.azure.com), select your workspace and then select __Access Control (IAM)__.
1. Select __Add__, __Add Role Assignment__ to open the __Add role assignment page__.
1. Select the role you want to assign the managed identity. For example, Reader. For detailed steps, see [Assign Azure roles using the Azure portal](../role-based-access-control/role-assignments-portal.yml).

### Managed identity with compute cluster

For more information, see [Set up managed identity for compute cluster](how-to-create-attach-compute-cluster.md#set-up-managed-identity).

### Managed identity with compute instance

For more information, see [Set up managed identity for compute instance](how-to-create-compute-instance.md#assign-managed-identity).

<a id="service-principal-authentication"></a>

## Use service principal authentication

# [Python SDK v2](#tab/sdk)

[!INCLUDE [sdk v2](includes/machine-learning-sdk-v2.md)]

Authenticating with a service principal uses the [Azure Identity package for Python](/python/api/overview/azure/identity-readme). The `DefaultAzureCredential` class looks for the following environment variables and uses the values when authenticating as the service principal:

* `AZURE_CLIENT_ID` - The client ID returned when you created the service principal.
* `AZURE_TENANT_ID` - The tenant ID returned when you created the service principal.
* `AZURE_CLIENT_SECRET` - The password/credential generated for the service principal.

> [!TIP]
> During development, consider using the [python-dotenv](https://pypi.org/project/python-dotenv/) package to set these environment variables. Python-dotenv loads environment variables from `.env` files. The standard `.gitignore` file for Python automatically excludes `.env` files, so they shouldn't be checked into any GitHub repos during development.

The following example demonstrates using python-dotenv to load the environment variables from a `.env` file and then using `DefaultAzureCredential` to create the credential object:

```python
from dotenv import load_dotenv

if ( os.environ['ENVIRONMENT'] == 'development'):
    print("Loading environment variables from .env file")
    load_dotenv(".env")

from azure.identity import DefaultAzureCredential

credential = DefaultAzureCredential()
# Check if given credential can get token successfully.
credential.get_token("https://management.azure.com/.default")
```

After the credential object is created, the [MLClient](/python/api/azure-ai-ml/azure.ai.ml.mlclient) class is used to connect to the workspace. For example, the following code uses the `from_config()` method to load connection information:

```python
try:
    ml_client = MLClient.from_config(credential=credential)
except Exception as ex:
    # NOTE: Update following workspace information to contain
    #       your subscription ID, resource group name, and workspace name
    client_config = {
        "subscription_id": "<SUBSCRIPTION_ID>",
        "resource_group": "<RESOURCE_GROUP>",
        "workspace_name": "<AZUREML_WORKSPACE_NAME>",
    }

    # write and reload from config file
    import json, os

    config_path = "../.azureml/config.json"
    os.makedirs(os.path.dirname(config_path), exist_ok=True)
    with open(config_path, "w") as fo:
        fo.write(json.dumps(client_config))
    ml_client = MLClient.from_config(credential=credential, path=config_path)

print(ml_client)
```

# [Azure CLI](#tab/cli)

You can use a service principal for Azure CLI commands. For more information, see [Sign in using a service principal](/cli/azure/create-an-azure-service-principal-azure-cli#sign-in-using-a-service-principal).

---

The service principal can also be used to authenticate to the Azure Machine Learning [REST API](/rest/api/azureml/). You use the Microsoft Entra ID [client credentials grant flow](../active-directory/develop/v2-oauth2-client-creds-grant-flow.md), which allow service-to-service calls for headless authentication in automated workflows. 

> [!IMPORTANT]
> If you are currently using Azure Active Directory Authentication Library (ADAL) to get credentials, we recommend that you [Migrate to the Microsoft Authentication Library (MSAL)](../active-directory/develop/msal-migration.md). ADAL support ended June 30, 2022.

For information and samples on authenticating with MSAL, see the following articles:

* JavaScript - [How to migrate a JavaScript app from ADAL.js to MSAL.js](../active-directory/develop/msal-compare-msal-js-and-adal-js.md).
* Node.js - [How to migrate a Node.js app from Microsoft Authentication Library to MSAL](../active-directory/develop/msal-node-migration.md).
* Python - [Microsoft Authentication Library to MSAL migration guide for Python](/entra/msal/python/advanced/migrate-python-adal-msal).

## Use managed identity authentication

[!INCLUDE [sdk v2](includes/machine-learning-sdk-v2.md)]

Authenticating with a managed identity uses the [Azure Identity package for Python](/python/api/overview/azure/identity-readme). To authenticate to the workspace from a VM or compute cluster that is configured with a managed identity, use the `DefaultAzureCredential` class. This class automatically detects if a managed identity is being used, and uses the managed identity to authenticate to Azure services.

The following example demonstrates using the `DefaultAzureCredential` class to create the credential object, then using the `MLClient` class to connect to the workspace:

```python
from azure.identity import DefaultAzureCredential

credential = DefaultAzureCredential()
# Check if given credential can get token successfully.
credential.get_token("https://management.azure.com/.default")

try:
    ml_client = MLClient.from_config(credential=credential)
except Exception as ex:
    # NOTE: Update following workspace information to contain
    #       your subscription ID, resource group name, and workspace name
    client_config = {
        "subscription_id": "<SUBSCRIPTION_ID>",
        "resource_group": "<RESOURCE_GROUP>",
        "workspace_name": "<AZUREML_WORKSPACE_NAME>",
    }

    # write and reload from config file
    import json, os

    config_path = "../.azureml/config.json"
    os.makedirs(os.path.dirname(config_path), exist_ok=True)
    with open(config_path, "w") as fo:
        fo.write(json.dumps(client_config))
    ml_client = MLClient.from_config(credential=credential, path=config_path)

print(ml_client)
```

## Use Conditional Access

As an administrator, you can enforce [Microsoft Entra Conditional Access policies](../active-directory/conditional-access/overview.md) for users signing in to the workspace. For example, you 
can require two-factor authentication, or allow sign in only from managed devices. The following are the app IDs to use for conditional access:

| Application ID | Name | Note |
| ----- | ----- | ----- |
| d7304df8-741f-47d3-9bc2-df0e24e2071f | Azure Machine Learning Workbench Web App | Azure Machine Learning studio |
| cb2ff863-7f30-4ced-ab89-a00194bcf6d9 | Azure AI Studio App | Azure AI Studio |

### Check for service principal

Before adding the conditional access policy, verify that the application ID is listed in the __Enterprise applications__ section of the [Azure portal](https://portal.azure.com):

> [!IMPORTANT]
> To perform the steps in this section, you must have __Microsoft Entra ID P2__. For more information, see [Microsoft Entra licensing](/entra/fundamentals/licensing).

1. Search for __Enterprise Applications__ in the search field at the top of the portal and select the enterprise application entry.

    :::image type="content" source="./media/how-to-setup-authentication/azure-portal-search.png" alt-text="Screenshot of the Azure portal search field with a search for 'Enterprise applications'." lightbox="./media/how-to-setup-authentication/azure-portal-search.png":::

1. From Enterprise Applications, use the __Search by application name or object ID__ field to search for the entry you want to use with conditional access. If an entry appears, a service principal already exists for the application ID. Skip the rest of the steps in this section and go to the [Add conditional access](#add-conditional-access) section.

    > [!IMPORTANT]
    > The only filter should be __Application ID starts with__. Remove any other filter that may be present.

    :::image type="content" source="./media/how-to-setup-authentication/no-application-found.png" alt-text="Screenshot of the Enterprise Applications search with no matching results." lightbox="./media/how-to-setup-authentication/no-application-found.png":::

1. If no entry appears, use the following [Azure PowerShell](/powershell/azure/install-azure-powershell) cmdlet to create a service principal for the application ID:

    ```azurepowershell-interactive
    New-AzAdServicePrincipal -ApplicationId "application-ID"
    ```

    For example, `New-AzADServicePrincipal -ApplicationId "d7304df8-741f-47d3-9bc2-df0e24e2071f"`.

1. After you create the service principal, return to __Enterprise applications__ and verify that you can now find the application ID. You can find the list of IDs in the [Use Conditional Access](#use-conditional-access) section.

### Add conditional access

To use Conditional Access, [assign the Conditional Access policy](../active-directory/conditional-access/concept-conditional-access-cloud-apps.md) to the application ID. If the application doesn't appear in Conditional Access, use the steps in the [Check for service principal](#check-for-service-principal) section.

## Next steps

* [How to use secrets in training](how-to-use-secrets-in-runs.md).
* [How to authenticate to online endpoints](how-to-authenticate-online-endpoint.md).

---
title: Set up authentication (v1)
titleSuffix: Azure Machine Learning
description: Learn how to set up and configure authentication for various resources and workflows in Azure Machine Learning SDK v1.
services: machine-learning
author: rastala
ms.author: roastala
ms.reviewer: larryfr
ms.service: machine-learning
ms.subservice: enterprise-readiness
ms.date: 07/18/2022
ms.topic: how-to
ms.custom: UpdateFrequency5, has-adal-ref, contperf-fy21q2, subject-rbac-steps, sdkv1
---

# Set up authentication for Azure Machine Learning resources and workflows using SDK v1

[!INCLUDE [sdk v1](../includes/machine-learning-sdk-v1.md)]
    

Learn how to set up authentication to your Azure Machine Learning workspace. Authentication to your Azure Machine Learning workspace is based on __Azure Active Directory__ (Azure AD) for most things. In general, there are four authentication workflows that you can use when connecting to the workspace:

* __Interactive__: You use your account in Azure Active Directory to either directly authenticate, or to get a token that is used for authentication. Interactive authentication is used during _experimentation and iterative development_. Interactive authentication enables you to control access to resources (such as a web service) on a per-user basis.

* __Service principal__: You create a service principal account in Azure Active Directory, and use it to authenticate or get a token. A service principal is used when you need an _automated process to authenticate_ to the service without requiring user interaction. For example, a continuous integration and deployment script that trains and tests a model every time the training code changes.

* __Azure CLI session__: You use an active Azure CLI session to authenticate. Azure CLI authentication is used during _experimentation and iterative development_, or when you need an _automated process to authenticate_ to the service using a pre-authenticated session. You can log in to Azure via the Azure CLI on your local workstation, without storing credentials in Python code or prompting the user to authenticate. Similarly, you can reuse the same scripts as part of continuous integration and deployment pipelines, while authenticating the Azure CLI with a service principal identity.

* __Managed identity__: When using the Azure Machine Learning SDK _on an Azure Virtual Machine_, you can use a managed identity for Azure. This workflow allows the VM to connect to the workspace using the managed identity, without storing credentials in Python code or prompting the user to authenticate. Azure Machine Learning compute clusters and compute instances can also be configured to use a managed identity to access the workspace when _training models_.

Regardless of the authentication workflow used, Azure role-based access control (Azure RBAC) is used to scope the level of access (authorization) allowed to the resources. For example, an admin or automation process might have access to create a compute instance, but not use it, while a data scientist could use it, but not delete or create it. For more information, see [Manage access to Azure Machine Learning workspace](../how-to-assign-roles.md).

Azure AD Conditional Access can be used to further control or restrict access to the workspace for each authentication workflow. For example, an admin can allow workspace access from managed devices only.

## Prerequisites

* Create an [Azure Machine Learning workspace](../how-to-manage-workspace.md).
* [Configure your development environment](how-to-configure-environment.md) to install the Azure Machine Learning SDK, or use a [Azure Machine Learning compute instance](concept-azure-machine-learning-architecture.md#computes) with the SDK already installed.

## Azure Active Directory

All the authentication workflows for your workspace rely on Azure Active Directory. If you want users to authenticate using individual accounts, they must have accounts in your Azure AD. If you want to use service principals, they must exist in your Azure AD. Managed identities are also a feature of Azure AD. 

For more on Azure AD, see [What is Azure Active Directory authentication](../../active-directory/authentication/overview-authentication.md).

Once you've created the Azure AD accounts, see [Manage access to Azure Machine Learning workspace](../how-to-assign-roles.md) for information on granting them access to the workspace and other operations in Azure Machine Learning.

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

    If the CLI can open your default browser, it will do so and load a sign-in page. Otherwise, you need to open a browser and follow the instructions on the command line. The instructions involve browsing to [https://aka.ms/devicelogin](https://aka.ms/devicelogin) and entering an authorization code.

    If you have multiple Azure subscriptions, you can use the `az account set -s <subscription name or ID>` command to set the subscription. For more information, see [Use multiple Azure subscriptions](/cli/azure/manage-azure-subscriptions-azure-cli).

    For other methods of authenticating, see [Sign in with Azure CLI](/cli/azure/authenticate-azure-cli).

1. Create the service principal. In the following example, an SP named **ml-auth** is created:

    ```azurecli-interactive
    az ad sp create-for-rbac --sdk-auth --name ml-auth --role Contributor --scopes /subscriptions/<subscription id>
    ```

    The output will be a JSON similar to the following. Take note of the `clientId`, `clientSecret`, and `tenantId` fields, as you'll need them for other steps in this article.

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
    * [How to assign roles and actions in Azure Machine Learning](../how-to-assign-roles.md)
    * [How to assign roles in the CLI](../../role-based-access-control/role-assignments-cli.md)

    > [!IMPORTANT]
    > Owner access allows the service principal to do virtually any operation in your workspace. It is used in this document to demonstrate how to grant access; in a production environment Microsoft recommends granting the service principal the minimum access needed to perform the role you intend it for. For information on creating a custom role with the access needed for your scenario, see [Manage access to Azure Machine Learning workspace](../how-to-assign-roles.md).


## Configure a managed identity

> [!IMPORTANT]
> Managed identity is only supported when using the Azure Machine Learning SDK from an Azure Virtual Machine or with an Azure Machine Learning compute cluster or compute instance.

### Managed identity with a VM

1. Enable a [system-assigned managed identity for Azure resources on the VM](../../active-directory/managed-identities-azure-resources/qs-configure-portal-windows-vm.md#system-assigned-managed-identity).

1. From the [Azure portal](https://portal.azure.com), select your workspace and then select __Access Control (IAM)__.
1. Select __Add__, __Add Role Assignment__ to open the __Add role assignment page__.
1. Assign the following role. For detailed steps, see [Assign Azure roles using the Azure portal](../../role-based-access-control/role-assignments-portal.md).

    | Setting | Value |
    | ----- | ----- |
    | Role | The role you want to assign. |
    | Assign access to | Managed Identity |
    | Members | The managed identity you created earlier |

    ![Add role assignment page in Azure portal.](../../../includes/role-based-access-control/media/add-role-assignment-page.png)

### Managed identity with compute cluster

For more information, see [Set up managed identity for compute cluster](../how-to-create-attach-compute-cluster.md#set-up-managed-identity).


## Use interactive authentication

> [!IMPORTANT]
> Interactive authentication uses your browser, and requires cookies (including 3rd party cookies). If you have disabled cookies, you may receive an error such as "we couldn't sign you in." This error may also occur if you have enabled [Azure AD Multi-Factor Authentication](../../active-directory/authentication/concept-mfa-howitworks.md).

Most examples in the documentation and samples use interactive authentication. For example, when using the SDK there are two function calls that will automatically prompt you with a UI-based authentication flow:

* Calling the `from_config()` function will issue the prompt.

    ```python
    from azureml.core import Workspace
    ws = Workspace.from_config()
    ```

    The `from_config()` function looks for a JSON file containing your workspace connection information.

* Using the `Workspace` constructor to provide subscription, resource group, and workspace information, will also prompt for interactive authentication.

    ```python
    ws = Workspace(subscription_id="your-sub-id",
                  resource_group="your-resource-group-id",
                  workspace_name="your-workspace-name"
                  )
    ```

> [!TIP]
> If you have access to multiple tenants, you may need to import the class and explicitly define what tenant you are targeting. Calling the constructor for `InteractiveLoginAuthentication` will also prompt you to login similar to the calls above.
>
> ```python
> from azureml.core.authentication import InteractiveLoginAuthentication
> interactive_auth = InteractiveLoginAuthentication(tenant_id="your-tenant-id")
> ```

When using the Azure CLI, the `az login` command is used to authenticate the CLI session. For more information, see [Get started with Azure CLI](/cli/azure/get-started-with-azure-cli).

> [!TIP]
> If you are using the SDK from an environment where you have previously authenticated interactively using the Azure CLI, you can use the `AzureCliAuthentication` class to authenticate to the workspace using the credentials cached by the CLI:
>
> ```python
> from azureml.core.authentication import AzureCliAuthentication
> cli_auth = AzureCliAuthentication()
> ws = Workspace(subscription_id="your-sub-id",
>                resource_group="your-resource-group-id",
>                workspace_name="your-workspace-name",
>                auth=cli_auth
>                )
> ```

<a id="service-principal-authentication"></a>

## Use service principal authentication

To authenticate to your workspace from the SDK, using a service principal, use the `ServicePrincipalAuthentication` class constructor. Use the values you got when creating the service provider as the parameters. The `tenant_id` parameter maps to `tenantId` from above, `service_principal_id` maps to `clientId`, and `service_principal_password` maps to `clientSecret`.

```python
from azureml.core.authentication import ServicePrincipalAuthentication

sp = ServicePrincipalAuthentication(tenant_id="your-tenant-id", # tenantID
                                    service_principal_id="your-client-id", # clientId
                                    service_principal_password="your-client-secret") # clientSecret
```

The `sp` variable now holds an authentication object that you use directly in the SDK. In general, it's a good idea to store the ids/secrets used above in environment variables as shown in the following code. Storing in environment variables prevents the information from being accidentally checked into a GitHub repo.

```python
import os

sp = ServicePrincipalAuthentication(tenant_id=os.environ['AML_TENANT_ID'],
                                    service_principal_id=os.environ['AML_PRINCIPAL_ID'],
                                    service_principal_password=os.environ['AML_PRINCIPAL_PASS'])
```

For automated workflows that run in Python and use the SDK primarily, you can use this object as-is in most cases for your authentication. The following code authenticates to your workspace using the auth object you created.

```python
from azureml.core import Workspace

ws = Workspace.get(name="ml-example",
                   auth=sp,
                   subscription_id="your-sub-id",
                   resource_group="your-rg-name")
ws.get_details()
```

## Use managed identity authentication

To authenticate to the workspace from a VM, compute cluster, or compute instance that is configured with a managed identity, use the `MsiAuthentication` class. The following example demonstrates how to use this class to authenticate to a workspace:

```python
from azureml.core.authentication import MsiAuthentication

msi_auth = MsiAuthentication()

ws = Workspace(subscription_id="your-sub-id",
                resource_group="your-resource-group-id",
                workspace_name="your-workspace-name",
                auth=msi_auth
                )
```

## Use Conditional Access

As an administrator, you can enforce [Azure AD Conditional Access policies](../../active-directory/conditional-access/overview.md) for users signing in to the workspace. For example, you 
can require two-factor authentication, or allow sign in only from managed devices. To use Conditional Access for Azure Machine Learning workspaces specifically, [assign the Conditional Access policy](../../active-directory/conditional-access/concept-conditional-access-cloud-apps.md) to the app named __Azure Machine Learning__. The app ID is __0736f41a-0425-bdb5-1563eff02385__. 

## Next steps

* [How to use secrets in training](how-to-use-secrets-in-runs.md).
* [How to configure authentication for models deployed as a web service](how-to-authenticate-web-service.md).
* [Consume an Azure Machine Learning model deployed as a web service](how-to-consume-web-service.md).

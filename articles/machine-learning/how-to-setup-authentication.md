---
title: Set up authentication
titleSuffix: Azure Machine Learning
description: Learn how to set up and configure authentication for various resources and workflows in Azure Machine Learning. There are multiple ways to configure and use authentication within the service, ranging from simple UI-based auth for development or testing purposes, to full Azure Active Directory service principal authentication.
services: machine-learning
author: larryfr
ms.author: larryfr
ms.reviewer: larryfr
ms.service: machine-learning
ms.subservice: core
ms.date: 06/17/2020
ms.topic: conceptual
ms.custom: how-to, has-adal-ref, devx-track-javascript
---

# Set up authentication for Azure Machine Learning resources and workflows
[!INCLUDE [applies-to-skus](../../includes/aml-applies-to-basic-enterprise-sku.md)]

Learn how to authenticate to your Azure Machine Learning workspace, and to models deployed as web services.

In general, there are two types of authentication that you can use with Azure Machine Learning:

* __Interactive__: You use your account in Azure Active Directory to either directly authenticate, or to get a token that is used for authentication. Interactive authentication is used during experimentation and iterative development. Or where you want to control access to resources (such as a web service) on a per-user basis.
* __Service principal__: You create a service principal account in Azure Active Directory, and use it to authenticate or get a token. A service principal is used when you need an automated process to authenticate to the service without requiring user interaction. For example, a continuous integration and deployment script that trains and tests a model every time the training code changes. You might also use a service principal to retrieve a token to authenticate to a web service, if you don't want to require the end user of the service to authenticate. Or where the end-user authentication isn't performed directly using Azure Active Directory.

Regardless of the authentication type used, role-based access control (RBAC) is used to scope the level of access allowed to the resources. For example, an account that is used to get the access token for a deployed model only needs read access to the workspace. For more information on RBAC, see [Manage access to Azure Machine Learning workspace](how-to-assign-roles.md).

## Prerequisites

* Create an [Azure Machine Learning workspace](how-to-manage-workspace.md).
* [Configure your development environment](how-to-configure-environment.md) to install the Azure Machine Learning SDK, or use a [Azure Machine Learning Notebook VM](concept-azure-machine-learning-architecture.md#compute-instance) with the SDK already installed.

## Interactive authentication

> [!IMPORTANT]
> Interactive authentication uses your browser, and requires cookies (including 3rd party cookies). If you have disabled cookies, you may receive an error such as "we couldn't sign you in." This error may also occur if you have enabled [Azure multi-factor authentication](/azure/active-directory/authentication/concept-mfa-howitworks).

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

## Service principal authentication

To use service principal (SP) authentication, you must first create the SP and grant it access to your workspace. As mentioned earlier, Azure role-based access control (Azure RBAC) is used to control access, so you must also decide what access to grant the SP.

> [!IMPORTANT]
> When using a service principal, grant it the __minimum access required for the task__ it is used for. For example, you would not grant a service principal owner or contributor access if all it is used for is reading the access token for a web deployment.
>
> The reason for granting the least access is that a service principal uses a password to authenticate, and the password may be stored as part of an automation script. If the password is leaked, having the minimum access required for a specific tasks minimizes the malicious use of the SP.

The easiest way to create an SP and grant access to your workspace is by using the [Azure CLI](https://docs.microsoft.com/cli/azure/install-azure-cli?view=azure-cli-latest). To create a service principal and grant it access to your workspace, use the following steps:

> [!NOTE]
> You must be an admin on the subscription to perform all of these steps.

1. Authenticate to your Azure subscription:

    ```azurecli-interactive
    az login
    ```

    If the CLI can open your default browser, it will do so and load a sign-in page. Otherwise, you need to open a browser and follow the instructions on the command line. The instructions involve browsing to [https://aka.ms/devicelogin](https://aka.ms/devicelogin) and entering an authorization code.

    [!INCLUDE [select-subscription](../../includes/machine-learning-cli-subscription.md)] 

    For other methods of authenticating, see [Sign in with Azure CLI](https://docs.microsoft.com/cli/azure/authenticate-azure-cli?view=azure-cli-latest).

1. Install the Azure Machine Learning extension:

    ```azurecli-interactive
    az extension add -n azure-cli-ml
    ```

1. Create the service principal. In the following example, an SP named **ml-auth** is created:

    ```azurecli-interactive
    az ad sp create-for-rbac --sdk-auth --name ml-auth
    ```

    The output will be a JSON similar to the following. Take note of the `clientId`, `clientSecret`, and `tenantId` fields, as you will need them for other steps in this article.

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

    The following JSON is a simplified example of the output from the command. Take note of the `objectId` field, as you will need its value for the next step.

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

1. Allow the SP to access your Azure Machine Learning workspace. You will need your workspace name, and its resource group name for the `-w` and `-g` parameters, respectively. For the `--user` parameter, use the `objectId` value from the previous step. The `--role` parameter allows you to set the access role for the service principal. In the following example, the SP is assigned to the **owner** role. 

    > [!IMPORTANT]
    > Owner access allows the service principal to do virtually any operation in your workspace. It is used in this document to demonstrate how to grant access; in a production environment Microsoft recommends granting the service principal the minimum access needed to perform the role you intend it for. For more information, see [Manage access to Azure Machine Learning workspace](how-to-assign-roles.md).

    ```azurecli-interactive
    az ml workspace share -w your-workspace-name -g your-resource-group-name --user your-sp-object-id --role owner
    ```

    This call does not produce any output on success.

### Use a service principal from the SDK

To authenticate to your workspace from the SDK, using the service principal, use the `ServicePrincipalAuthentication` class constructor. Use the values you got when creating the service provider as the parameters. The `tenant_id` parameter maps to `tenantId` from above, `service_principal_id` maps to `clientId`, and `service_principal_password` maps to `clientSecret`.

```python
from azureml.core.authentication import ServicePrincipalAuthentication

sp = ServicePrincipalAuthentication(tenant_id="your-tenant-id", # tenantID
                                    service_principal_id="your-client-id", # clientId
                                    service_principal_password="your-client-secret") # clientSecret
```

The `sp` variable now holds an authentication object that you use directly in the SDK. In general, it is a good idea to store the ids/secrets used above in environment variables as shown in the following code. Storing in environment variables prevents the information from being accidentally checked into a GitHub repo.

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
                   subscription_id="your-sub-id")
ws.get_details()
```

### Use a service principal from the Azure CLI

You can use a service principal for Azure CLI commands. For more information, see [Sign in using a service principal](https://docs.microsoft.com/cli/azure/create-an-azure-service-principal-azure-cli?view=azure-cli-latest#sign-in-using-a-service-principal).

### Use a service principal with the REST API (preview)

The service principal can also be used to authenticate to the Azure Machine Learning [REST API](https://docs.microsoft.com/rest/api/azureml/) (preview). You use the Azure Active Directory [client credentials grant flow](https://docs.microsoft.com/azure/active-directory/develop/v1-oauth2-client-creds-grant-flow), which allow service-to-service calls for headless authentication in automated workflows. The examples are implemented with the [ADAL library](https://docs.microsoft.com/azure/active-directory/develop/active-directory-authentication-libraries) in both Python and Node.js, but you can also use any open-source library that supports OpenID Connect 1.0.

> [!NOTE]
> MSAL.js is a newer library than ADAL, but you cannot do service-to-service authentication using client credentials with MSAL.js, since it is primarily a client-side library intended
> for interactive/UI authentication tied to a specific user. We recommend using ADAL as shown below to build automated workflows with the REST API.

#### Node.js

Use the following steps to generate an auth token using Node.js. In your environment, run `npm install adal-node`. Then, use your `tenantId`, `clientId`, and `clientSecret` from the service principal you created in the steps above as values for the matching variables in the following script.

```javascript
const adal = require('adal-node').AuthenticationContext;

const authorityHostUrl = 'https://login.microsoftonline.com/';
const tenantId = 'your-tenant-id';
const authorityUrl = authorityHostUrl + tenantId;
const clientId = 'your-client-id';
const clientSecret = 'your-client-secret';
const resource = 'https://management.azure.com/';

const context = new adal(authorityUrl);

context.acquireTokenWithClientCredentials(
  resource,
  clientId,
  clientSecret,
  (err, tokenResponse) => {
    if (err) {
      console.log(`Token generation failed due to ${err}`);
    } else {
      console.dir(tokenResponse, { depth: null, colors: true });
    }
  }
);
```

The variable `tokenResponse` is an object that includes the token and associated metadata such as expiration time. Tokens are valid for 1 hour, and can be refreshed by running the same call again to retrieve a new token. The following snippet is a sample response.

```javascript
{
    tokenType: 'Bearer',
    expiresIn: 3599,
    expiresOn: 2019-12-17T19:15:56.326Z,
    resource: 'https://management.azure.com/',
    accessToken: "random-oauth-token",
    isMRRT: true,
    _clientId: 'your-client-id',
    _authority: 'https://login.microsoftonline.com/your-tenant-id'
}
```

Use the `accessToken` property to fetch the auth token. See the [REST API documentation](https://github.com/microsoft/MLOps/tree/master/examples/AzureML-REST-API) for examples on how to use the token to make API calls.

#### Python

Use the following steps to generate an auth token using Python. In your environment, run `pip install adal`. Then, use your `tenantId`, `clientId`, and `clientSecret` from the service principal you created in the steps above as values for the appropriate variables in the following script.

```python
from adal import AuthenticationContext

client_id = "your-client-id"
client_secret = "your-client-secret"
resource_url = "https://login.microsoftonline.com"
tenant_id = "your-tenant-id"
authority = "{}/{}".format(resource_url, tenant_id)

auth_context = AuthenticationContext(authority)
token_response = auth_context.acquire_token_with_client_credentials("https://management.azure.com/", client_id, client_secret)
print(token_response)
```

The variable `token_response` is a dictionary that includes the token and associated metadata such as expiration time. Tokens are valid for 1 hour, and can be refreshed by running the same call again to retrieve a new token. The following snippet is a sample response.

```python
{
    'tokenType': 'Bearer',
    'expiresIn': 3599,
    'expiresOn': '2019-12-17 19:47:15.150205',
    'resource': 'https://management.azure.com/',
    'accessToken': 'random-oauth-token',
    'isMRRT': True,
    '_clientId': 'your-client-id',
    '_authority': 'https://login.microsoftonline.com/your-tenant-id'
}
```

Use `token_response["accessToken"]` to fetch the auth token. See the [REST API documentation](https://github.com/microsoft/MLOps/tree/master/examples/AzureML-REST-API) for examples on how to use the token to make API calls.

## Web-service authentication

The model deployments created by Azure Machine Learning provide two authentication methods:

* **key-based**: A static key is used to authenticate to the web service.
* **token-based**: A temporary token must be obtained from the workspace and used to authenticate to the web service. This token expires after a period of time, and must be refreshed to continue working with the web service.

    > [!NOTE]
    > Token-based authentication is only available when deploying to Azure Kubernetes Service.

### Key-based web service authentication

Web-services deployed on Azure Kubernetes Service (AKS) have key-based auth *enabled* by default. Azure Container Instances (ACI) deployed services have key-based auth *disabled* by default, but you can enable it by setting `auth_enabled=True`when creating the ACI web-service. The following code is an example of creating an ACI deployment configuration with key-based auth enabled.

```python
from azureml.core.webservice import AciWebservice

aci_config = AciWebservice.deploy_configuration(cpu_cores = 1,
                                                memory_gb = 1,
                                                auth_enabled=True)
```

Then you can use the custom ACI configuration in deployment using the `Model` class.

```python
from azureml.core.model import Model, InferenceConfig


inference_config = InferenceConfig(entry_script="score.py",
                                   environment=myenv)
aci_service = Model.deploy(workspace=ws,
                       name="aci_service_sample",
                       models=[model],
                       inference_config=inference_config,
                       deployment_config=aci_config)
aci_service.wait_for_deployment(True)
```

To fetch the auth keys, use `aci_service.get_keys()`. To regenerate a key, use the `regen_key()` function and pass either **Primary** or **Secondary**.

```python
aci_service.regen_key("Primary")
# or
aci_service.regen_key("Secondary")
```

For more information on authenticating to a deployed model, see [Create a client for a model deployed as a web service](how-to-consume-web-service.md).

### Token-based web-service authentication

When you enable token authentication for a web service, users must present an Azure Machine Learning JSON Web Token to the web service to access it. The token expires after a specified time-frame and needs to be refreshed to continue making calls.

* Token authentication is **disabled by default** when you deploy to Azure Kubernetes Service.
* Token authentication **isn't supported** when you deploy to Azure Container Instances.
* Token authentication **can't be used at the same time as key-based authentication**.

To control token authentication, use the `token_auth_enabled` parameter when you create or update a deployment:

```python
from azureml.core.webservice import AksWebservice
from azureml.core.model import Model, InferenceConfig

# Create the config
aks_config = AksWebservice.deploy_configuration()

#  Enable token auth and disable (key) auth on the webservice
aks_config = AksWebservice.deploy_configuration(token_auth_enabled=True, auth_enabled=False)

aks_service_name ='aks-service-1'

# deploy the model
aks_service = Model.deploy(workspace=ws,
                           name=aks_service_name,
                           models=[model],
                           inference_config=inference_config,
                           deployment_config=aks_config,
                           deployment_target=aks_target)

aks_service.wait_for_deployment(show_output = True)
```

If token authentication is enabled, you can use the `get_token` method to retrieve a JSON Web Token (JWT) and that token's expiration time:

> [!TIP]
> If you use a service principal to get the token, and want it to have the minimum required access to retrieve a token, assign it to the **reader** role for the workspace.

```python
token, refresh_by = aks_service.get_token()
print(token)
```

> [!IMPORTANT]
> You'll need to request a new token after the token's `refresh_by` time. If you need to refresh tokens outside of the Python SDK, one option is to use the REST API with service-principal authentication to periodically make the `service.get_token()` call, as discussed previously.
>
> We strongly recommend that you create your Azure Machine Learning workspace in the same region as your Azure Kubernetes Service cluster.
>
> To authenticate with a token, the web service will make a call to the region in which your Azure Machine Learning workspace is created. If your workspace's region is unavailable, you won't be able to fetch a token for your web service, even if your cluster is in a different region from your workspace. The result is that Azure AD Authentication is unavailable until your workspace's region is available again.
>
> Also, the greater the distance between your cluster's region and your workspace's region, the longer it will take to fetch a token.

## Next steps

* [How to use secrets in training](how-to-use-secrets-in-runs.md).
* [Train and deploy an image classification model](tutorial-train-models-with-aml.md).
* [Consume an Azure Machine Learning model deployed as a web service](how-to-consume-web-service.md).

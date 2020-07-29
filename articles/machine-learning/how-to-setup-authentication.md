---
title: Set up authentication
titleSuffix: Azure Machine Learning
description: Learn how to set up and configure authentication for various resources and workflows in Azure Machine Learning. There are multiple ways to configure and use authentication within the service, ranging from simple UI-based auth for development or testing purposes, to full Azure Active Directory service principal authentication.
services: machine-learning
author: trevorbye
ms.author: trbye
ms.reviewer: trbye
ms.service: machine-learning
ms.subservice: core
ms.topic: how-to
ms.date: 12/17/2019
ms.custom: has-adal-ref
---

# Set up authentication for Azure Machine Learning resources and workflows
[!INCLUDE [applies-to-skus](../../includes/aml-applies-to-basic-enterprise-sku.md)]

In this article, you learn how to set up and configure authentication for various resources and workflows in Azure Machine Learning. There are multiple ways to authenticate to the service, ranging from simple UI-based auth for development or testing purposes to full Azure Active Directory service principal authentication. This article also explains the differences in how web-service authentication works, as well as how to authenticate to the Azure Machine Learning REST API.

This how-to shows you how to do the following tasks:

* Use interactive UI authentication for testing/development
* Set up service principal authentication
* Authenticating to your workspace
* Get OAuth2.0 bearer-type tokens for Azure Machine Learning REST API
* Understand web-service authentication

See the [concept article](concept-enterprise-security.md) for a general overview of security and authentication within Azure Machine Learning.

## Prerequisites

* Create an [Azure Machine Learning workspace](how-to-manage-workspace.md).
* [Configure your development environment](how-to-configure-environment.md) to install the Azure Machine Learning SDK, or use a [Azure Machine Learning Notebook VM](concept-azure-machine-learning-architecture.md#compute-instance) with the SDK already installed.

## Interactive authentication

Most examples in the documentation for this service use interactive authentication in Jupyter notebooks as a simple method for testing and demonstration. This is a lightweight way to test what you're building. There are two function calls that will automatically prompt you with a UI-based authentication flow.

Calling the `from_config()` function will issue the prompt.

```python
from azureml.core import Workspace
ws = Workspace.from_config()
```

The `from_config()` function looks for a JSON file containing your workspace connection information. You can also specify the connection details explicitly by using the `Workspace` constructor, which will also prompt for interactive authentication. Both calls are equivalent.

```python
ws = Workspace(subscription_id="your-sub-id",
               resource_group="your-resource-group-id",
               workspace_name="your-workspace-name"
              )
```

If you have access to multiple tenants, you may need to import the class and explicitly define what tenant you are targeting. Calling the constructor for `InteractiveLoginAuthentication` will also prompt you to login similar to the calls above.

```python
from azureml.core.authentication import InteractiveLoginAuthentication
interactive_auth = InteractiveLoginAuthentication(tenant_id="your-tenant-id")
```

While useful for testing and learning, interactive authentication will not help you with building automated or headless workflows. Setting up service principal authentication is the best approach for automated processes that use the SDK.

## Set up service principal authentication

This process is necessary for enabling authentication that is decoupled from a specific user login, which allows you to authenticate to the Azure Machine Learning Python SDK in automated workflows. Service principal authentication will also allow you to [authenticate to the REST API](#azure-machine-learning-rest-api-auth).

> [!TIP]
> Service principals must have access to your workspace through [Azure role-based access control (RBAC)](../role-based-access-control/overview.md).
>
> Using the built-in roles of **owner** or **contributor** to your workspace enables the service principal to perform all activities such as training a model, deploying a model, etc. For more information on using roles, see [Manage access to an Azure Machine Learning workspace](how-to-assign-roles.md).

To set up service principal authentication, you first create an app registration in Azure Active Directory, and then assign a role to your app. The easiest way to complete this setup is through the [Azure Cloud Shell](https://azure.microsoft.com/features/cloud-shell/) in the Azure portal. After you login to the portal, click the `>_` icon in the top right of the page near your name to open the shell.

If you haven't used the Cloud Shell before in your Azure account, you will need to create a storage account resource for storing any files that are written. In general this storage account will incur a negligible monthly cost. Additionally, install the machine learning extension if you haven't used it previously with the following command.

```azurecli-interactive
az extension add -n azure-cli-ml
```

> [!NOTE]
> You must be an admin on the subscription to perform the following steps.

Next, run the following command to create the service principal. Give it a name, in this case **ml-auth**.

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

Next, run the following command to get the details on the service principal you just created, using the `clientId` value from above as the input to the `--id` parameter.

```azurecli-interactive
az ad sp show --id your-client-id
```

The following is a simplified example of the JSON output from the command. Take note of the `objectId` field, as you will need its value for the next step.

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

Next, use the following command to assign your service principal access to your machine learning workspace. You will need your workspace name, and its resource group name for the `-w` and `-g` parameters, respectively. For the `--user` parameter, use the `objectId` value from the previous step. The `--role` parameter allows you to set the access role for the service principal, and in general you will use either **owner** or **contributor**. Both have write access to existing resources like compute clusters and datastores, but only **owner** can provision these resources.

```azurecli-interactive
az ml workspace share -w your-workspace-name -g your-resource-group-name --user your-sp-object-id --role owner
```

This call does not produce any output, but you now have service principal authentication set up for your workspace.

## Authenticate to your workspace

Now that you have service principal auth enabled, you can authenticate to your workspace in the SDK without physically logging in as a user. Use the `ServicePrincipalAuthentication` class constructor, and use the values you got from the previous steps as the parameters. The `tenant_id` parameter maps to `tenantId` from above, `service_principal_id` maps to `clientId`, and `service_principal_password` maps to `clientSecret`.

```python
from azureml.core.authentication import ServicePrincipalAuthentication

sp = ServicePrincipalAuthentication(tenant_id="your-tenant-id", # tenantID
                                    service_principal_id="your-client-id", # clientId
                                    service_principal_password="your-client-secret") # clientSecret
```

The `sp` variable now holds an authentication object that you use directly in the SDK. In general, it is a good idea to store the ids/secrets used above in environment variables as shown in the following code.

```python
import os

sp = ServicePrincipalAuthentication(tenant_id=os.environ['AML_TENANT_ID'],
                                    service_principal_id=os.environ['AML_PRINCIPAL_ID'],
                                    service_principal_password=os.environ['AML_PRINCIPAL_PASS'])
```

For automated workflows that run in Python and use the SDK primarily, you can use this object as-is in most cases for your authentication. The following code authenticates to your workspace using the auth object you just created.

```python
from azureml.core import Workspace

ws = Workspace.get(name="ml-example",
                   auth=sp,
                   subscription_id="your-sub-id")
ws.get_details()
```

## Azure Machine Learning REST API auth

The service principal created in the steps above can also be used to authenticate to the Azure Machine Learning [REST API](https://docs.microsoft.com/rest/api/azureml/). You use the Azure Active Directory [client credentials grant flow](https://docs.microsoft.com/azure/active-directory/develop/v1-oauth2-client-creds-grant-flow), which allow service-to-service calls for headless authentication in automated workflows. The examples are implemented with the [ADAL library](https://docs.microsoft.com/azure/active-directory/develop/active-directory-authentication-libraries) in both Python and Node.js, but you can also use any open-source library that supports OpenID Connect 1.0.

> [!NOTE]
> MSAL.js is a newer library than ADAL, but you cannot do service-to-service authentication using client credentials with MSAL.js, since it is primarily a client-side library intended
> for interactive/UI authentication tied to a specific user. We recommend using ADAL as shown below to build automated workflows with the REST API.

### Node.js

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

The variable `tokenResponse` is an object that includes the token and associated metadata such as expiration time. Tokens are valid for 1 hour, and can be refreshed by running the same call again to retrieve a new token. The following is a sample response.

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

### Python

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

The variable `token_response` is a dictionary that includes the token and associated metadata such as expiration time. Tokens are valid for 1 hour, and can be refreshed by running the same call again to retrieve a new token. The following is a sample response.

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

Web-services in Azure Machine Learning use a different authentication pattern than what is described above. The easiest way to authenticate to deployed web-services is to use **key-based authentication**, which generates static bearer-type authentication keys that do not need to be refreshed. If you only need to authenticate to a deployed web-service, you do not need to set up service principle authentication as shown above.

Web-services deployed on Azure Kubernetes Service have key-based auth *enabled* by default. Azure Container Instances deployed services have key-based auth *disabled* by default, but you can enable it by setting `auth_enabled=True`when creating the ACI web-service. The following is an example of creating an ACI deployment configuration with key-based auth enabled.

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

Web-services also support token-based authentication, but only for Azure Kubernetes Service deployments. See the [how-to](how-to-consume-web-service.md) on consuming web-services for additional information on authenticating.

### Token-based web-service authentication

When you enable token authentication for a web service, users must present an Azure Machine Learning JSON Web Token to the web service to access it. The token expires after a specified time-frame and needs to be refreshed to continue making calls.

* Token authentication is **disabled by default** when you deploy to Azure Kubernetes Service.
* Token authentication **isn't supported** when you deploy to Azure Container Instances.

To control token authentication, use the `token_auth_enabled` parameter when you create or update a deployment.

If token authentication is enabled, you can use the `get_token` method to retrieve a JSON Web Token (JWT) and that token's expiration time:

> [!TIP]
> If you use a service principal to get the token, and want it to have the minimum required access to retrieve a token, assign it to the **reader** role for the workspace.

```python
token, refresh_by = service.get_token()
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

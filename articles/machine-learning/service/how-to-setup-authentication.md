---
title: Setup authentication
titleSuffix: Azure Machine Learning
description: 
services: machine-learning
author: trevorbye
ms.author: trbye
ms.reviewer: trbye
ms.service: machine-learning
ms.subservice: core
ms.topic: conceptual
ms.date: 12/09/2019
---

# Setup authentication for ML resources
[!INCLUDE [applies-to-skus](../../../includes/aml-applies-to-basic-enterprise-sku.md)]

In this article, you learn how to setup and configure authentication for various resources and workflows in Azure Machine Learning. There are multiple ways to setup and use authentication within the service, ranging from simple UI-based auth for development or testing purposes, to full Azure Active Directory service principal authentication. This article also explains the differences in how web-service authentication works, as well as how to authenticate to the Azure Machine Learning REST API.

This how-to shows you how to do the following tasks:

* Use interactive UI auth for testing/development
* Setup service principal auth
* Authenticating to your workspace
* Get OAuth2.0 bearer-type tokens for REST calls
* Authenticate to the Azure Machine Learning REST API

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
ws = Workspace(subscription_id="your_sub-id",
               resource_group="your-resource-group-id",
               workspace_name="your-workspace-name"
              )
```

If you have access to multiple tenants, you may need to import the class and explicitly define what tenant you are targeting. Calling the constructor for `InteractiveLoginAuthentication` will also prompt you to login similar to the calls above.

```python
from azureml.core.authentication import InteractiveLoginAuthentication
interactive_auth = InteractiveLoginAuthentication(tenant_id="your-tenant-id")
```

While useful for testing and learning, interactive authentication will not help you with building automated or headless workflows. Setting up service principal authentication is the best approach for automated requirements that use the SDK.

## Setup service principal authentication

This setup process is necessary for enabling authentication that is decoupled from a specific user login, which allows you to authenticate to the Azure Machine Learning Python SDK in automated workflows. Service principle authentication will also allow you to connect to the REST API.

To set up service principal authentication, you first create an app registration in Azure Active Directory, and then grant your app role-based access to your ML workspace. The easiest way to complete this setup is through the [Azure Cloud Shell](https://azure.microsoft.com/features/cloud-shell/) in the Azure Portal. After you login to the portal, click the `>_` icon in the top right of the page near your name to open the shell.

If you haven't used the cloud shell before in your Azure account, you will need to create a storage account resource for storing any files that are written. In general this storage account will incur a negligible monthly cost. Additionally, install the machine learning extension if you haven't used it previously with the following command.

```azurecli-interactive
az extension add -n azure-cli-ml
```

> [!NOTE]
> You must be an admin on the subscription to perform the following steps.

Next, run the following command to create the service principle. Give it a name, in this case **ml-auth**.

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

Next run the following command to get the details on the service principle you just created, using the `clientId` value from above as the input to the `--id` parameter.

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

Next, use the following command to assign your service principle access to your machine learning workspace. You will need your workspace name, and it's resource group name for the `-w` and `-g` parameters, respectively. For the `--user` parameter, use the `objectId` value from the previous step. The `--role` parameter allows you to set the access role for the service principle, and in general you will use either **owner** or **contributor**. Both have write access to existing resources like compute clusters and datastores, but only **owner** can provision these resources. 

```azurecli-interactive
az ml workspace share -w your-workspace-name -g your-resource-group-name --user your-sp-object-id --role owner
```

This call does not produce any output, but you now have service principal authentication set up for your workspace.

## Authenticate to your workspace

Now that you have service principal auth setup, you can authenticate to your workspace in the SDK without physical logging in as a user. Use the `ServicePrincipalAuthentication` class constructor, and use the values you got from the previous steps as the parameters. The `tenant_id` parameter maps to `tenantId` from above, `service_principal_id` maps to `clientId`, and `service_principal_password` maps to `clientSecret`.

```python
from azureml.core.authentication import ServicePrincipalAuthentication

sp = ServicePrincipalAuthentication(tenant_id="your-tenant-id", # tenantID
                                    service_principal_id="your-client-id", # clientId
                                    service_principal_password="your-client-secret") # clientSecret
```

The `sp` variable now holds an authentication object that you use directly in the SDK. In general, it is a good idea to store the ids/secrets used above in environment variables rather than embedding them as plain text. For automated workflows that run in Python and use the SDK primarily, you can use this object as-is in most cases for your authentication. The following code authenticates to your workspace using the auth object you just created.

```python
from azureml.core import Workspace

ws = Workspace.get(name="ml-example", 
                   auth=sp,
                   subscription_id="your-sub-id")
ws.get_details()
```

## Web-service authentication

Web-services in Azure Machine Learning use a different authentication pattern than what is described above. The easiest way to authenticate to deployed web-services is to use **key-based authentication**, which generates static bearer-type authentication keys. If you only need to authenticate to a deployed web-service, you do not need to setup service principle authentication as shown above.

Web-services deployed on Azure Kubernetes Service have key-based auth *enabled* by default. Azure Container Instances deployed services have key-based auth *disabled* by default, but you can enable it by setting `auth_enabled=True`when creating the ACI web-service. The following is an example of creating an ACI deployment configuration with key-based auth enabled.

```python
from azureml.core.webservice import AciWebservice

aci_config = AciWebservice.deploy_configuration(cpu_cores = 1,
                                                memory_gb = 1,
                                                auth_enable=True)
```

Then you can use the custom ACI configuration in deployment using the parent `WebService` class.

```python
from azureml.core.webservice import Webservice

aci_service = Webservice.deploy_from_image(deployment_config=aci_config,
                                           image=image,
                                           name="aci_service_sample",
                                           workspace=ws)
aci_service.wait_for_deployment(True)
```

To fetch the auth keys, use `aci_service.get_keys()`. To regenerate a key, use the `regen_key()` function and pass either **Primary** or **Secondary**.

```python
aci_service.regen_key("Primary")
# or
aci_service.regen_key("Secondary")
```

Web-services also support token-based authentication, but only for Azure Kubernetes Service deployments. See the [how-to](how-to-consume-web-service.md) on consuming web-services for more additional information on authenticating.

## Azure Machine Learning REST API auth
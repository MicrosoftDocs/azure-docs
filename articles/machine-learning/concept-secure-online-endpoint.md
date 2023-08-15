---
title: Network isolation with managed online endpoints
titleSuffix: Azure Machine Learning
description: Learn how private endpoints provide network isolation for Azure Machine Learning managed online endpoints.
services: machine-learning
ms.service: machine-learning
ms.subservice: inferencing
ms.topic: conceptual
author: dem108
ms.author: sehan
ms.reviewer: mopeakande
reviewer: msakande
ms.custom: devplatv2
ms.date: 08/02/2023
---

# Network isolation with managed online endpoints

[!INCLUDE [SDK/CLI v2](includes/machine-learning-dev-v2.md)]

When deploying a machine learning model to a managed online endpoint, you can secure communication with the online endpoint by using [private endpoints](../private-link/private-endpoint-overview.md). In this article, you'll learn how a private endpoint can be used to secure inbound communication to a managed online endpoint. You'll also learn how a workspace managed virtual network can be used to provide secure communication between deployments and resources.

You can secure inbound scoring requests from clients to an _online endpoint_ and secure outbound communications between a _deployment_, the Azure resources it uses, and private resources. Security for inbound and outbound communication are configured separately. For more information on endpoints and deployments, see [What are endpoints and deployments](concept-endpoints-online.md).

<!-- ## Security with managed workspace virtual network -->

The following architecture diagram shows how communications flow through private endpoints to the managed online endpoint. Incoming scoring requests from a client's virtual network (VNet) flow through the workspace's private endpoint to the managed online endpoint. Outbound communication from deployments to services is handled through private endpoints from the workspace's managed VNet to those service instances.

:::image type="content" source="media/concept-secure-online-endpoint/endpoint-network-isolation-with-workspace-managed-vnet.png" alt-text="Diagram showing inbound communication via a workspace private endpoint and outbound communication via private endpoints of a workspace managed VNet." lightbox="media/concept-secure-online-endpoint/endpoint-network-isolation-with-workspace-managed-vnet.png":::

## Limitations

- The `v1_legacy_mode` flag must be disabled (false) on your Azure Machine Learning workspace. If this flag is enabled, you won't be able to create a managed online endpoint. For more information, see [Network isolation with v2 API](how-to-configure-network-isolation-with-v2.md).

- If your Azure Machine Learning workspace has a private endpoint that was created before May 24, 2022, you must recreate the workspace's private endpoint before configuring your online endpoints to use a private endpoint. For more information on creating a private endpoint for your workspace, see [How to configure a private endpoint for Azure Machine Learning workspace](how-to-configure-private-link.md).

    > [!TIP]
    > To confirm when a workspace is created, you can check the workspace properties. In Studio, click `View all properties in Azure Portal` from `Directory + Subscription + Workspace` section (top right of the Studio), Click JSON View from top right of the Overview page, and choose the latest API Version. You can check the value of `properties.creationTime`. You can do the same by using `az ml workspace show` with [CLI](how-to-manage-workspace-cli.md#get-workspace-information), or `my_ml_client.workspace.get("my-workspace-name")` with [SDK](how-to-manage-workspace.md?tabs=python#find-a-workspace), or `curl` on workspace with [REST API](how-to-manage-rest.md#drill-down-into-workspaces-and-their-resources).

- When you use network isolation with a deployment, you can use resources (Azure Container Registry (ACR), Storage account, Key Vault, and Application Insights) from a different resource group or subscription than that of your workspace. However, these resources must belong to the same tenant as your workspace.

- Access from online deployments to Microsoft Container Registry (MCR) is allowed. However, because the _*.data.mcr.microsoft.com_ domain name is not included in the MCR service tag, you may have to add an FQDN outbound rule to _*.data.mcr.microsoft.com_ for certain Docker images. For more information on how to enable access to servers and services on the internet, see [Configure inbound and outbound network traffic](how-to-access-azureml-behind-firewall.md).

> [!NOTE]
> Requests to create, update, or retrieve the authentication keys are sent to the Azure Resource Manager over the public network.

## Secure inbound scoring requests

Secure inbound communication from a client to a managed online endpoint is possible by using a [private endpoint for the Azure Machine Learning workspace](./how-to-configure-private-link.md). This private endpoint on the client's VNet communicates with the workspace of the managed online endpoint and is the means by which the managed online endpoint can receive incoming scoring requests from the client.

To secure scoring requests to the online endpoint, so that a client can access it only through the workspace's private endpoint, set the `public_network_access` flag for the endpoint to `disabled`. After you've created the endpoint, you can update this setting to enable public network access if desired.

Set the endpoint's `public_network_access` flag to `disabled`:

# [Azure CLI](#tab/cli)

```azurecli
az ml online-endpoint create -f endpoint.yml --set public_network_access=disabled
```

# [Python](#tab/python)

```python
from azure.ai.ml.entities import ManagedOnlineEndpoint

endpoint = ManagedOnlineEndpoint(name='my-online-endpoint',  
                         description='this is a sample online endpoint', 
                         tags={'foo': 'bar'}, 
                         auth_mode="key", 
                         public_network_access="disabled" 
                         # public_network_access="enabled" 
)
```

# [Studio](#tab/azure-studio)

1. Go to the [Azure Machine Learning studio](https://ml.azure.com).
1. Select the **Workspaces** page from the left navigation bar.
1. Enter a workspace by clicking its name.
1. Select the **Endpoints** page from the left navigation bar.
1. Select **+ Create** to open the **Create deployment** setup wizard.
1. Disable the **Public network access** flag at the **Create endpoint** step.

    :::image type="content" source="media/how-to-secure-online-endpoint/endpoint-disable-public-network-access.png" alt-text="A screenshot of how to disable public network access for an endpoint." lightbox="media/how-to-secure-online-endpoint/endpoint-disable-public-network-access.png":::

---

When `public_network_access` is `disabled`, inbound scoring requests are received using the workspace's private endpoint, and the endpoint can't be reached from public networks.

Alternatively, if you set the `public_network_access` to `enabled`, the endpoint can receive inbound scoring requests from the internet.

## Secure outbound access with managed workspace VNet

To secure outbound communication from a deployment to services, you need to enable managed virtual network isolation for your Azure Machine Learning workspace so that Azure Machine Learning can create a managed VNet for the workspace. 
All managed online endpoints in the workspace (and managed compute resources for the workspace, such as compute clusters and compute instances) automatically use this workspace managed VNet, and the deployments in the endpoints share the managed VNet's private endpoints for communication with the workspace's resources.

For outbound communication with a workspace managed VNet, Azure Machine Learning:

- Creates private endpoints for the managed VNet to use for communication with Azure resources that are used by the workspace, such as Azure Storage, Azure Key Vault, and Azure Container Registry.
- Allows deployments to access the Microsoft Container Registry (MCR), which can be useful when you want to use curated environments or MLflow no-code deployment.
- Allows users to configure private endpoint outbound rules to private resources and configure outbound rules for service tags and FQDNs for public resources.

Furthermore, you have two configuration modes for outbound traffic from the managed VNet, namely:

- **Allow internet outbound**, to allow all internet outbound traffic from the managed VNet
- **Allow only approved outbound**, to control outbound traffic using private endpoints, FQDNs, and service tags.

For example, say your workspace's managed VNet contains two deployments of a managed online endpoint, both deployments can use the workspace's private endpoints to communicate with:

- The Azure Machine Learning workspace
- The Azure Storage blob that is associated with the workspace
- The Azure Container Registry for the workspace
- The Azure Key Vault
- (Optional) private endpoints for communicating with private resources.

To learn more about configurations for the workspace managed VNet, see [Managed virtual network architecture](how-to-managed-network.md#managed-virtual-network-architecture).

## Scenarios for network isolation configuration

Let's say you have an application that is deployed to an endpoint, you can decide what network isolation configuration to use as follows:

**For inbound communication**:

If you want your application to receive inbound scoring requests from the internet, then you should **enable** `public_network_access` for the endpoint.

On the other hand, say the application is private and should be accessed only within your organization. In this scenario, you'd want to prevent access from the internet, so you should **disable** the endpoint's `public_network_access`. Once the public network access is disabled, the application can receive inbound scoring requests only through your workspace's private endpoint.

**For outbound communication (deployment)**:

Now, suppose your deployed application doesn't need to access your workspace's private Azure resources (such as the Azure Storage blob, ACR, and Azure Key Vault), and you want your application to send outbound communication to the public internet. In this case, you should **disable** the _workspace's managed VNet_, as you won't need to use private endpoints for outbound communication.

However, if your application needs to access private resources, you'll need to use private endpoints. Therefore, you should **enable** the _workspace's managed VNet_.

When you **enable** the _workspace managed VNet_, you can configure it to **allow internet outbound** if you're fine with having your application access the public internet. This mode will not prevent data exfiltration.
On the other hand, if you're concerned about data exfiltration and want to prevent the unauthorized transfer of data or resources to non-approved destinations, you can configure your managed VNet to **allow only approved outbound**.

<!-- The following table lists the supported configurations for inbound and outbound communications for a managed online endpoint when using a workspace managed VNet:

| Configuration | Inbound </br> (Endpoint property) | Outbound </br> (Workspace managed VNet property) | Supported? |
| -------- | -------------------------------- | --------------------------------- | --------- |
| secure inbound with secure outbound | `public_network_access` is disabled |- Allow only approved outbound</br>- Access workspace's default Azure resources</br>- Access MCR  | Yes |
| secure inbound with public outbound | `public_network_access` is disabled | - Allow internet</br>- Access workspace's default Azure resources</br>- Access MCR  | Yes |
| public inbound with secure outbound | `public_network_access` is enabled | - Allow only approved outbound</br>- Access workspace's default Azure resources</br>- Access MCR  | Yes |
| public inbound with public outbound | `public_network_access` is enabled | - Allow internet</br>- Access workspace's default Azure resources</br>- Access MCR  | Yes | -->

## Appendix

### Secure outbound access with managed online endpoint VNet

For managed online endpoints, you can also secure outbound communication between deployments and resources by using an Azure Machine Learning VNet for each deployment in the endpoint. The secure outbound communication is also handled by using private endpoints to those service instances.

> [!NOTE]
> We strongly recommend that you use the approach described in [Secure outbound access with managed workspace VNet](#secure-outbound-access-with-managed-workspace-vnet) instead.

To restrict communication between a deployment and external resources, including the Azure resources it uses, you should ensure that:

- The deployment's `egress_public_network_access` flag is `disabled`. This flag ensures that the download of the model, code, and images needed by the deployment are secured with a private endpoint.
    > [!NOTE]
    > You cannot update (enable or disable) the `egress_public_network_access` flag after creating the deployment. Attempting to change the flag while updating the deployment will fail with an error.

- The workspace has a private link that allows access to Azure resources via a private endpoint. Because the workspace has a `public_network_access` flag that can be either enabled or disabled, if you plan on using a managed online deployment that uses __public outbound__, then you must also [configure the workspace to allow public access](how-to-configure-private-link.md#enable-public-access). This is because outbound communication from the online deployment is to the _workspace API_. When the deployment is configured to use __public outbound__, then the workspace must be able to accept that public communication (allow public access).

When you have multiple deployments, and you configure the `egress_public_network_access` to `disabled` for each deployment in a managed online endpoint, each deployment has its own independent Azure Machine Learning managed VNet. For each VNet, Azure Machine Learning creates three private endpoints for communication to the following services:

- The Azure Machine Learning workspace
- The Azure Storage blob that is associated with the workspace
- The Azure Container Registry for the workspace

For example, if you set the `egress_public_network_access` flag to `disabled` for two deployments of a managed online endpoint, a total of six private endpoints are created. Each deployment would have three private endpoints to communicate with the workspace, blob, and container registry.

> [!IMPORTANT]
> Azure Machine Learning does not support peering between a deployment's managed VNet and your client VNet. For secure access to resources needed by the deployment, we use private endpoints to communicate with the resources.

The following diagram shows incoming scoring requests from a client's virtual network flowing through the workspace's private endpoint to the managed online endpoint. The diagram also shows a deployment in an independent VNet that has three private endpoints for outbound communication with the Azure Machine Learning workspace, the Azure Storage blob associated with the workspace, and the Azure Container Registry for the workspace.

<!-- update the architecture diagram to include multiple deployments. Then update the explanation for the new diagram -->
:::image type="content" source="./media/how-to-secure-online-endpoint/endpoint-network-isolation-ingress-egress.png" alt-text="Diagram of overall ingress/egress communication.":::

To disable the `egress_public_network_access` and create the private endpoints:

# [Azure CLI](#tab/cli)

```azurecli
az ml online-deployment create -f deployment.yml --set egress_public_network_access=disabled
```

# [Python](#tab/python)

```python
blue_deployment = ManagedOnlineDeployment(name='blue', 
                                          endpoint_name='my-online-endpoint', 
                                          model=model, 
                                          code_configuration=CodeConfiguration(code_local_path='./model-1/onlinescoring/',
                                                                               scoring_script='score.py'),
                                          environment=env, 
                                          instance_type='Standard_DS2_v2', 
                                          instance_count=1, 
                                          egress_public_network_access="disabled"
                                          # egress_public_network_access="enabled" 
) 
                              
ml_client.begin_create_or_update(blue_deployment) 
```

# [Studio](#tab/azure-studio)

1. Follow the steps in the **Create deployment** setup wizard to the **Deployment** step.
1. Disable the **Egress public network access** flag.

    :::image type="content" source="media/how-to-secure-online-endpoint/deployment-disable-egress-public-network-access.png" alt-text="A screenshot of how to disable the egress public network access for a deployment." lightbox="media/how-to-secure-online-endpoint/deployment-disable-egress-public-network-access.png":::

---

To confirm the creation of the private endpoints, first check the storage account and container registry associated with the workspace (see [Download a configuration file](how-to-manage-workspace.md#download-a-configuration-file)), find each resource from the Azure portal, and check the `Private endpoint connections` tab under the `Networking` menu.

> [!IMPORTANT]
> - As mentioned earlier, outbound communication from managed online endpoint deployment is to the _workspace API_. When the endpoint is configured to use __public outbound__ (in other words, `public_network_access` flag for the endpoint is set to `enabled`), then the workspace must be able to accept that public communication (`public_network_access` flag for the workspace set to `enabled`).
> - When online deployments are created with `egress_public_network_access` flag set to `disabled`, they will have access to the secured resources (workspace, blob, and container registry) only. For instance, if the deployment uses model assets uploaded to other storage accounts, the model download will fail. Ensure model assets are on the storage account associated with the workspace.
> - When `egress_public_network_access` is set to `disabled`, the deployment can only access the workspace-associated resources secured in the virtual network. On the contrary, when `egress_public_network_access` is set to `enabled`, the deployment can only access the resources with public access, which means it cannot access the resources secured in the virtual network.

The following table lists the supported configurations when configuring inbound and outbound communications for an online endpoint:

| Configuration | Inbound </br> (Endpoint property) | Outbound </br> (Deployment property) | Supported? |
| -------- | -------------------------------- | --------------------------------- | --------- |
| secure inbound with secure outbound | `public_network_access` is disabled | `egress_public_network_access` is disabled   | Yes |
| secure inbound with public outbound | `public_network_access` is disabled | `egress_public_network_access` is enabled</br>The workspace must also allow public access as the deployment outbound is to the workspace API. | Yes |
| public inbound with secure outbound | `public_network_access` is enabled | `egress_public_network_access` is disabled    | Yes |
| public inbound with public outbound | `public_network_access` is enabled | `egress_public_network_access` is enabled</br>The workspace must also allow public access as the deployment outbound is to the workspace API. | Yes |

## Next steps

- [Workspace managed network isolation](how-to-managed-network.md)
- [How to secure managed online endpoints with network isolation](how-to-secure-online-endpoint.md)
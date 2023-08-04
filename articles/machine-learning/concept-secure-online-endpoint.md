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

When deploying a machine learning model to a managed online endpoint, you can secure communication with the online endpoint by using [private endpoints](../private-link/private-endpoint-overview.md).

You can secure the inbound scoring requests from clients to an _online endpoint_. You can also secure the outbound communications between a _deployment_ and the Azure resources it uses. Security for inbound and outbound communication are configured separately. For more information on endpoints and deployments, see [What are endpoints and deployments](concept-endpoints-online.md).

## Security for inbound scoring requests

Secure inbound communication from a client to a managed online endpoint is possible by using a private endpoint on the client's virtual network. This private endpoint communicates with the workspace of the managed online endpoint and is the means by which the managed online endpoint can receive incoming scoring requests from the client.

To secure scoring requests to the online endpoint, so that they can come only from a client's virtual network, set the `public_network_access` flag for the endpoint to `disabled`:

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

When `public_network_access` is `disabled`, inbound scoring requests are received using the [private endpoint of the Azure Machine Learning workspace](./how-to-configure-private-link.md), and the endpoint can't be reached from public networks.

> [!NOTE]
> You can update (enable or disable) the `public_network_access` flag of an online endpoint after creating it.

## Security for outbound access to resources

Secure outbound communication from a deployment to services is also handled through private endpoints to those service instances. To restrict communication between a managed online deployment and external resources, including the Azure resources it uses you should ensure that:

- The deployment's `egress_public_network_access` flag is `disabled`. This flag ensures that the download of the model, code, and images needed by the deployment are secured with a private endpoint.
    > [!NOTE]
    > You cannot update (enable or disable) the `egress_public_network_access` flag after creating the deployment. Attempting to change the flag while updating the deployment will fail with an error.

- The workspace has a private link that allows access to Azure resources via a private endpoint. Because the workspace has a `public_network_access` flag that can be either enabled or disabled, if you plan on using a managed online deployment that uses __public outbound__, then you must also [configure the workspace to allow public access](how-to-configure-private-link.md#enable-public-access). This is because outbound communication from a managed online deployment is to the _workspace API_. When the deployment is configured to use __public outbound__, then the workspace must be able to accept that public communication (allow public access).

When you have multiple managed online deployments, the private endpoints used for secure outbound communication can be unique for each deployment or shared by the deployments, depending on whether the managed online endpoint uses a [managed virtual network](how-to-managed-network.md#managed-virtual-network-architecture).

#### Security for outbound access with managed virtual network

When you enable managed virtual network isolation, Azure Machine Learning creates one managed VNet per workspace. All the managed online deployments (with `egress_public_network_access` disabled) and the managed compute resources (compute clusters and compute instances) for the workspace automatically share this managed VNet. The managed VNet can use private endpoints to communicate with Azure resources that are used by the workspace, such as Azure Storage, Azure Key Vault, and Azure Container Registry. The managed VNet also allows users to add outbound rules for more private endpoints (for private resources), and to configure outbound rules for service tags and FQDNs for public resources.

The following diagram shows incoming scoring requests from a client's virtual network flowing through the workspace's private endpoint to the managed online endpoint. The diagram also shows managed online deployments in a managed VNet sharing the managed VNet's private endpoints for communication with the workspace's Azure resources. Furthermore, the managed VNet has outbound rules configured for service tags and FQDNs for public resources.

<!-- Insert architecture diagram for network isolation with managed VNet -->

#### Security for outbound access without managed virtual network

When managed virtual network isolation isn't enabled for a workspace, each deployment (with `egress_public_network_access` disabled) in a managed online endpoint has its own independent Azure Machine Learning managed VNet.

Secure outbound communication creates three private endpoints per deployment. One to the Azure Blob storage, one to the Azure Container Registry, and one to your workspace.

> [!IMPORTANT]
> Azure Machine Learning does not support peering between a deployment's managed VNet and your client VNet. For secure access to resources needed by the deployment, we use private endpoints to communicate with the resources.

The following diagram shows incoming scoring requests from a client's virtual network flowing through the workspace's private endpoint to the managed online endpoint. The diagram also shows managed online deployments each in an independent VNet that has three private endpoints for outbound communication with the Azure Machine Learning workspace, the Azure Storage blob associated with the workspace, and the Azure Container Registry for the workspace.

<!-- update the architecture diagram for network isolation without managed VNet -->
:::image type="content" source="./media/how-to-secure-online-endpoint/endpoint-network-isolation-ingress-egress.png" alt-text="Diagram of overall ingress/egress communication.":::

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

Each deployment communicates with these resources over the private endpoints:

- The Azure Machine Learning workspace
- The Azure Storage blob that is associated with the workspace
- The Azure Container Registry for the workspace

When you configure the `egress_public_network_access` to `disabled`, a new private endpoint is created per deployment, per service. For example, if you set the flag to `disabled` for three deployments to an online endpoint, a total of nine private endpoints are created. Each deployment would have three private endpoints to communicate with the workspace, blob, and container registry. To confirm the creation of the private endpoints, first check the storage account and container registry associated with the workspace (see [Download a configuration file](how-to-manage-workspace.md#download-a-configuration-file)), find each resource from Azure portal, and check the `Private endpoint connections` tab under the `Networking` menu.

> [!IMPORTANT]
> - As mentioned earlier, outbound communication from managed online endpoint deployment is to the _workspace API_. When the endpoint is configured to use __public outbound__ (in other words, `public_network_access` flag for the endpoint is set to `enabled`), then the workspace must be able to accept that public communication (`public_network_access` flag for the workspace set to `enabled`).
> - When online deployments are created with `egress_public_network_access` flag set to `disabled`, they will have access to above secured resources only. For instance, if the deployment uses model assets uploaded to other storage accounts, the model download will fail. Ensure model assets are on the storage account associated with the workspace.
> - When `egress_public_network_access` is set to `disabled`, the deployment can only access the workspace-associated resources secured in the virtual network. On the contrary, when `egress_public_network_access` is set to `enabled`, the deployment can only access the resources with public access, which means it cannot access the resources secured in the virtual network.

The following table lists the supported configurations when configuring inbound and outbound communications for an online endpoint:

| Configuration | Inbound </br> (Endpoint property) | Outbound </br> (Deployment property) | Supported? |
| -------- | -------------------------------- | --------------------------------- | --------- |
| secure inbound with secure outbound | `public_network_access` is disabled | `egress_public_network_access` is disabled   | Yes |
| secure inbound with public outbound | `public_network_access` is disabled | `egress_public_network_access` is enabled</br>The workspace must also allow public access as the deployment outbound is to the workspace API. | Yes |
| public inbound with secure outbound | `public_network_access` is enabled | `egress_public_network_access` is disabled    | Yes |
| public inbound with public outbound | `public_network_access` is enabled | `egress_public_network_access` is enabled</br>The workspace must also allow public access as the deployment outbound is to the workspace API. | Yes |

## Next steps

- [How to secure managed online endpoints with network isolation](how-to-secure-online-endpoint.md)
- [Workspace managed network isolation (preview)](how-to-managed-network.md)
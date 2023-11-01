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
ms.custom: devplatv2, moe-wsvnet
ms.date: 09/27/2023
---

# Network isolation with managed online endpoints

[!INCLUDE [machine-learning-dev-v2](includes/machine-learning-dev-v2.md)]

When deploying a machine learning model to a managed online endpoint, you can secure communication with the online endpoint by using [private endpoints](../private-link/private-endpoint-overview.md). In this article, you'll learn how a private endpoint can be used to secure inbound communication to a managed online endpoint. You'll also learn how a workspace managed virtual network can be used to provide secure communication between deployments and resources.

You can secure inbound scoring requests from clients to an _online endpoint_ and secure outbound communications between a _deployment_, the Azure resources it uses, and private resources. Security for inbound and outbound communication are configured separately. For more information on endpoints and deployments, see [What are endpoints and deployments](concept-endpoints-online.md).

The following architecture diagram shows how communications flow through private endpoints to the managed online endpoint. Incoming scoring requests from a client's virtual network flow through the workspace's private endpoint to the managed online endpoint. Outbound communications from deployments to services are handled through private endpoints from the workspace's managed virtual network to those service instances.

:::image type="content" source="media/concept-secure-online-endpoint/endpoint-network-isolation-with-workspace-managed-vnet.png" alt-text="Diagram showing inbound communication via a workspace private endpoint and outbound communication via private endpoints of a workspace managed virtual network." lightbox="media/concept-secure-online-endpoint/endpoint-network-isolation-with-workspace-managed-vnet.png":::

> [!NOTE]
> This article focuses on network isolation using the workspace's managed virtual network. For a description of the legacy method for network isolation, in which Azure Machine Learning creates a managed virtual network for each deployment in an endpoint, see the [Appendix](#appendix).

## Limitations

[!INCLUDE [machine-learning-managed-vnet-online-endpoint-limitations](includes/machine-learning-managed-vnet-online-endpoint-limitations.md)]

## Secure inbound scoring requests

Secure inbound communication from a client to a managed online endpoint is possible by using a [private endpoint for the Azure Machine Learning workspace](./how-to-configure-private-link.md). This private endpoint on the client's virtual network communicates with the workspace of the managed online endpoint and is the means by which the managed online endpoint can receive incoming scoring requests from the client.

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

## Secure outbound access with workspace managed virtual network

To secure outbound communication from a deployment to services, you need to enable managed virtual network isolation for your Azure Machine Learning workspace so that Azure Machine Learning can create a managed virtual network for the workspace.
All managed online endpoints in the workspace (and managed compute resources for the workspace, such as compute clusters and compute instances) automatically use this workspace managed virtual network, and the deployments under the endpoints share the managed virtual network's private endpoints for communication with the workspace's resources.

When you secure your workspace with a managed virtual network, the `egress_public_access` flag for managed online deployments no longer applies. Avoid setting this flag when creating the managed online deployment.

For outbound communication with a workspace managed virtual network, Azure Machine Learning:

- Creates private endpoints for the managed virtual network to use for communication with Azure resources that are used by the workspace, such as Azure Storage, Azure Key Vault, and Azure Container Registry.
- Allows deployments to access the Microsoft Container Registry (MCR), which can be useful when you want to use curated environments or MLflow no-code deployment.
- Allows users to configure private endpoint outbound rules to private resources and configure outbound rules (service tag or FQDN) for public resources. For more information on how to manage outbound rules, see [Manage outbound rules](how-to-managed-network.md#manage-outbound-rules).

Furthermore, you can configure two isolation modes for outbound traffic from the workspace managed virtual network, namely:

- **Allow internet outbound**, to allow all internet outbound traffic from the managed virtual network
- **Allow only approved outbound**, to control outbound traffic using private endpoints, FQDN outbound rules, and service tag outbound rules.

For example, say your workspace's managed virtual network contains two deployments under a managed online endpoint, both deployments can use the workspace's private endpoints to communicate with:

- The Azure Machine Learning workspace
- The Azure Storage blob that is associated with the workspace
- The Azure Container Registry for the workspace
- The Azure Key Vault
- (Optional) additional private resources that support private endpoints.

To learn more about configurations for the workspace managed virtual network, see [Managed virtual network architecture](how-to-managed-network.md#managed-virtual-network-architecture).

## Scenarios for network isolation configuration

Suppose a managed online endpoint has a deployment that uses an AI model, and you want to use an app to send scoring requests to the endpoint. You can decide what network isolation configuration to use for the managed online endpoint as follows:

**For inbound communication**:

If the app is publicly available on the internet, then you need to **enable** `public_network_access` for the endpoint so that it can receive inbound scoring requests from the app.

However, say the app is private, such as an internal app within your organization. In this scenario, you want the AI model to be used only within your organization rather than expose it to the internet. Therefore, you need to **disable** the endpoint's `public_network_access` so that it can receive inbound scoring requests only through its workspace's private endpoint.

**For outbound communication (deployment)**:

Suppose your deployment needs to access private Azure resources (such as the Azure Storage blob, ACR, and Azure Key Vault), or it's unacceptable for the deployment to access the internet. In this case, you need to **enable** the _workspace's managed virtual network_ with the **allow only approved outbound** isolation mode. This isolation mode allows outbound communication from the deployment to approved destinations only, thereby protecting against data exfiltration. Furthermore, you can add outbound rules for the workspace, to allow access to more private or public resources. For more information, see [Configure a managed virtual network to allow only approved outbound](how-to-managed-network.md#configure-a-managed-virtual-network-to-allow-only-approved-outbound).

However, if you want your deployment to access the internet, you can use the workspace's managed virtual network with the **allow internet outbound** isolation mode. Apart from being able to access the internet, you'll be able to use the private endpoints of the managed virtual network to access private Azure resources that you need.

Finally, if your deployment doesn't need to access private Azure resources and you don't need to control access to the internet, then you don't need to use a workspace managed virtual network.

## Appendix

### Secure outbound access with legacy network isolation method

For managed online endpoints, you can also secure outbound communication between deployments and resources by using an Azure Machine Learning managed virtual network for each deployment in the endpoint. The secure outbound communication is also handled by using private endpoints to those service instances.

> [!NOTE]
> We strongly recommend that you use the approach described in [Secure outbound access with workspace managed virtual network](#secure-outbound-access-with-workspace-managed-virtual-network) instead of this legacy method.

To restrict communication between a deployment and external resources, including the Azure resources it uses, you should ensure that:

- The deployment's `egress_public_network_access` flag is `disabled`. This flag ensures that the download of the model, code, and images needed by the deployment are secured with a private endpoint. Once you've created the deployment, you can't update (enable or disable) the `egress_public_network_access` flag. Attempting to change the flag while updating the deployment fails with an error.

- The workspace has a private link that allows access to Azure resources via a private endpoint.

- The workspace has a `public_network_access` flag that can be enabled or disabled, if you plan on using a managed online deployment that uses __public outbound__, then you must also [configure the workspace to allow public access](how-to-configure-private-link.md#enable-public-access). This is because outbound communication from the online deployment is to the _workspace API_. When the deployment is configured to use __public outbound__, then the workspace must be able to accept that public communication (allow public access).

When you have multiple deployments, and you configure the `egress_public_network_access` to `disabled` for each deployment in a managed online endpoint, each deployment has its own independent Azure Machine Learning managed virtual network. For each virtual network, Azure Machine Learning creates three private endpoints for communication to the following services:

- The Azure Machine Learning workspace
- The Azure Storage blob that is associated with the workspace
- The Azure Container Registry for the workspace

For example, if you set the `egress_public_network_access` flag to `disabled` for two deployments of a managed online endpoint, a total of six private endpoints are created. Each deployment would use three private endpoints to communicate with the workspace, blob, and container registry.

> [!IMPORTANT]
> Azure Machine Learning does not support peering between a deployment's managed virtual network and your client's virtual network. For secure access to resources needed by the deployment, we use private endpoints to communicate with the resources.

The following diagram shows incoming scoring requests from a client's virtual network flowing through the workspace's private endpoint to the managed online endpoint. The diagram also shows two online deployments, each in its own Azure Machine Learning managed virtual network. Each deployment's virtual network has three private endpoints for outbound communication with the Azure Machine Learning workspace, the Azure Storage blob associated with the workspace, and the Azure Container Registry for the workspace.

:::image type="content" source="./media/concept-secure-online-endpoint/endpoint-network-isolation-legacy.png" alt-text="Diagram of overall network isolation with the legacy method." lightbox="media/concept-secure-online-endpoint/endpoint-network-isolation-legacy.png":::

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

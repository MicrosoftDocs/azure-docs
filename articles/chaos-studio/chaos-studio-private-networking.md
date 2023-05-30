---
title: Integration of VNet Injection with Chaos Studio
description: Learn how to use VNet injection with Chaos Studio
services: chaos-studio
author: prashabora
ms.topic: conceptual
ms.date: 10/26/2022
ms.author: prashabora
ms.service: chaos-studio
---
# VNet injection in Chaos Studio

Azure [Virtual Network](../virtual-network/virtual-networks-overview.md) (VNet) is the fundamental building block for your private network in Azure. VNet enables many types of Azure resources to securely communicate with each other, the internet, and on-premises networks. VNet is similar to a traditional network that you'd operate in your own data center, but brings with it other benefits of Azure's infrastructure such as scale, availability, and isolation.

VNet injection allows a Chaos resource provider to inject containerized workloads into your VNet so that resources without public endpoints can be accessed via a private IP address on the VNet. Once you've configured VNet injection for a resource in a VNet and enabled the resource as a target, you can use it in multiple experiments. An experiment can target a mix of private and non-private resources, as long as the private resources have been configured according to the instructions on this page. 

## Resource type support
Currently, you can only enable certain resource types for Chaos Studio VNet injection.
* **Azure Kubernetes Service** targets can be enabled with VNet injection through the **Azure portal** and **Azure CLI**. All AKS Chaos Mesh faults can be used.
* **Key Vault** targets can be enabled with VNet injection through the **Azure CLI**. The faults that can be used with VNet Injection are Disable Certificate, Increment Certificate Version, and Update Certificate Policy.

## Enabling VNet injection
To use Chaos Studio with VNet injection, you need to meet the following requirements. 
1. The `Microsoft.ContainerInstance` and `Microsoft.Relay` resource providers must be registered with your subscription.
1. The VNet where Chaos Studio resources will be injected must have two subnets: a container subnet, which is used for the Chaos Studio containers that will be injected into your private network, and a relay subnet, which is used to forward communication from Chaos Studio to the containers inside the private network.
    1. Both subnets need at least `/28` in address space. For example, an address prefix of `10.0.0.0/28` or `10.0.0.0/24`.
    1. The container subnet must be delegated to `Microsoft.ContainerInstance/containerGroups`.
    1. The subnets can be arbitrarily named, but we recommend `ChaosStudioContainerSubnet` and `ChaosStudioRelaySubnet`.
1. When enabling the desired resource as a target so you can use it in Chaos Studio experiments, the following properties must be set:
    1. Set `properties.subnets.containerSubnetId` to the ID for the container subnet.
    1. Set `properties.subnets.relaySubnetId` to the ID for the relay subnet.


If you're using the Azure portal to enable a private resource as a Chaos Studio target, Chaos Studio currently only recognizes subnets named `ChaosStudioContainerSubnet` and `ChaosStudioRelaySubnet`. If these subnets don't exist, the portal workflow can create them automatically.

If you're using the CLI, the container and relay subnets can have any name (subject to the resource naming guidelines). You just need to specify the appropriate IDs when enabling the resource as a target.

## Example: Use Chaos Studio with a private AKS cluster

This example shows how to configure a private AKS cluster to use with Chaos Studio. It assumes you already have a private AKS cluster within your Azure subscription. To create one, see: [Create a private Azure Kubernetes Service cluster](../aks/private-clusters.md)

### [Azure portal](#tab/azure-portal)

1. Within the Azure portal, navigate to **Subscriptions**, then **Resource providers** within your subscription. 
1. Register the `Microsoft.ContainerInstance` and `Microsoft.Relay` resource providers, if they aren't already registered, by selecting the provider and then the **Register** button. Additionally, re-register the `Microsoft.Chaos` resource provider.
:::image type="content" source="images/vnet-register-resource-provider.png" alt-text="Screenshot of how to register a resource provider." lightbox="images/vnet-register-resource-provider.png":::
1. Navigate to Azure Chaos Studio and select **Targets**. Find your desired AKS cluster and select **Enable targets**, then **Enable service-direct targets**.
:::image type="content" source="images/vnet-enable-targets.png" alt-text="Screenshot of how to enable targets in Chaos Studio." lightbox="images/vnet-enable-targets.png":::
1. Select the cluster's Virtual Network. If the VNet already includes subnets named `ChaosStudioContainerSubnet` and `ChaosStudioRelaySubnet`, select them. If they don't already exist, they'll be automatically created for you.
:::image type="content" source="images/vnet-select-subnets.png" alt-text="Screenshot of how to select the VNet and Subnets." lightbox="images/vnet-select-subnets.png":::
1. Select **Review + Enable** and **Enable**.
:::image type="content" source="images/vnet-review.png" alt-text="Screenshot of how to review the target enablement." lightbox="images/vnet-review.png":::

Now your private AKS cluster can be used with Chaos Studio! Use the following instructions to learn how to install Chaos Mesh and run the experiment: [Create a chaos experiment that uses a Chaos Mesh fault with the Azure portal](chaos-studio-tutorial-aks-portal.md).

### [Azure CLI](#tab/azure-cli)

1. Register the `Microsoft.ContainerInstance` and `Microsoft.Relay` resource providers with your subscription by running the following commands. If they're both already registered, you can skip this step. For more detail, see the [Register resource provider](../azure-resource-manager/management/resource-providers-and-types.md) instructions.

    ```azurecli
    az provider register --namespace 'Microsoft.ContainerInstance' --wait
    ```

    ```azurecli
    az provider register --namespace 'Microsoft.Relay' --wait
    ```

    Verify the registration by running the following commands:

    ```azurecli
    az provider show --namespace 'Microsoft.ContainerInstance' | grep registrationState
    ```

    ```azurecli
    az provider show --namespace 'Microsoft.Relay' | grep registrationState
    ```

    In the output, you should see something similar to:

    ```azurecli
    "registrationState": "Registered",
    ```

1. Re-register the `Microsoft.Chaos` resource provider with your subscription.

    ```azurecli
    az provider register --namespace 'Microsoft.Chaos' --wait
    ```

    Verify the registration by running the following command:

    ```azurecli
    az provider show --namespace 'Microsoft.Chaos' | grep registrationState
    ```

    In the output, you should see something similar to:

    ```azurecli
    "registrationState": "Registered",
    ```

1. Create two subnets in the VNet you want to inject Chaos Studio resources into (in this case, the private AKS cluster's VNet):

    - Container subnet (example name: `ChaosStudioContainerSubnet`)
        - Delegate the subnet to the `Microsoft.ContainerInstance/containerGroups` service.
        - This subnet must have at least /28 in address space.
    - Relay subnet (example name: `ChaosStudioRelaySubnet`)
        - This subnet must have at least /28 in address space.
        
    ```azurecli
    az network vnet subnet create -g MyResourceGroup --vnet-name MyVnetName --name ChaosStudioContainerSubnet --address-prefixes "10.0.0.0/28" --delegations "Microsoft.ContainerInstance/containerGroups"
    ```
    ```azurecli
    az network vnet subnet create -g MyResourceGroup --vnet-name MyVnetName --name ChaosStudioRelaySubnet --address-prefixes "10.0.0.0/28"
    ```

1. When enabling targets for the AKS cluster, so you can use it in Chaos Experiments, set the `properties.subnets.containerSubnetId` and `properties.subnets.relaySubnetId` properties using the new subnets you created in step 3.

    Replace `$SUBSCRIPTION_ID` with your Azure subscription ID, `$RESOURCE_GROUP` and `$AKS_CLUSTER` with the resource group name and your AKS cluster resource name. Also, replace `$AKS_INFRA_RESOURCE_GROUP` and `$AKS_VNET` with your AKS's infrastructure resource group name and VNet name. Replace `$URL` with the corresponding `https://management.azure.com/` URL used for onboarding the target.

    ```azurecli
    CONTAINER_SUBNET_ID=/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$AKS_INFRA_RESOURCE_GROUP/providers/Microsoft.Network/virtualNetworks/$AKS_VNET/subnets/ChaosStudioContainerSubnet
    RELAY_SUBNET_ID=/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$AKS_INFRA_RESOURCE_GROUP/providers/Microsoft.Network/virtualNetworks/$AKS_VNET/subnets/ChaosStudioRelaySubnet
    BODY="{ \"properties\": { \"subnets\": { \"containerSubnetId\": \"$CONTAINER_SUBNET_ID\", \"relaySubnetId\": \"$RELAY_SUBNET_ID\" } } }"
    az rest --method put --url $URL --body "$BODY"
    ```
    <!--
    After creating a Target resource with VNet injection enabled, the resource's properties will include:
    
    ```json
    {
      "properties": {
        "subnets": {
          "containerSubnetId": "/subscriptions/.../subnets/ChaosStudioContainerSubnet",
          "relaySubnetId": "/subscriptions/.../subnets/ChaosStudioRelaySubnet"
        }
      }
    }
    ```
    -->

Now your private AKS cluster can be used with Chaos Studio! Use the following instructions to learn how to install Chaos Mesh and run the experiment: [Create a chaos experiment that uses a Chaos Mesh fault with the Azure CLI](chaos-studio-tutorial-aks-cli.md).

---

## Limitations
* VNet injection is currently only possible in subscriptions/regions where Azure Container Instances and Azure Relay are available.
* When you create a Target resource that you'll enable with VNet injection, you need `Microsoft.Network/virtualNetworks/subnets/write` access to the virtual network. For example, if the AKS cluster is deployed to VNet_A, then you must have permissions to create subnets in VNet_A in order to enable VNet injection for the AKS cluster.

<!--
![Target resource with VNet Injection](images/chaos-studio-rp-vnet-injection.png)
-->

## Next steps
Now that you understand how VNet injection can be achieved for Chaos Studio, you're ready to:
- [Create and run your first experiment](chaos-studio-tutorial-service-direct-portal.md)
- [Create and run your first Azure Kubernetes Service experiment](chaos-studio-tutorial-aks-portal.md)

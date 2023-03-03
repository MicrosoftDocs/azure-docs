---
title: Integration of VNet Injection with Chaos Studio
description: Chaos Studio supports VNet Injections
services: chaos-studio
author: prashabora
ms.topic: conceptual
ms.date: 10/26/2022
ms.author: prashabora
ms.service: chaos-studio
---
# VNet Injection in Chaos Studio

VNet is the fundamental building block for your private network in Azure. VNet enables many Azure resources to securely communicate with each other, the internet, and on-premises networks. VNet is like a traditional network you would operate in your own data center. However, VNet also has the benefits of Azure infrastructure, scale, availability, and isolation.

## How VNet Injection works in Chaos Studio

VNet injection allows a Chaos resource provider to inject containerized workloads into your VNet so that resources without public endpoints can be accessed via a private IP address on the VNet. To configure VNet injection:

1. Register the `Microsoft.ContainerInstance` resource provider with your subscription (if applicable).

    ```bash
    az provider register --namespace 'Microsoft.ContainerInstance' --wait
    ```

    Verify the registration by running the following command:

    ```bash
    az provider show --namespace 'Microsoft.ContainerInstance' | grep registrationState
    ```

    In the output, you should see something similar to:

    ```bash
    "registrationState": "Registered",
    ```

1. Register the `Microsoft.Relay` resource provider with your subscription.

    ```bash
    az provider register --namespace 'Microsoft.Relay' --wait
    ```

    Verify the registration by running the following command:

    ```bash
    az provider show --namespace 'Microsoft.Relay' | grep registrationState
    ```

    In the output, you should see something similar to:

    ```bash
    "registrationState": "Registered",
    ```

1. Re-register the `Microsoft.Chaos` resource provider with your subscription.

    ```bash
    az provider register --namespace 'Microsoft.Chaos' --wait
    ```

    Verify the registration by running the following command:

    ```bash
    az provider show --namespace 'Microsoft.Chaos' | grep registrationState
    ```

    In the output, you should see something similar to:

    ```bash
    "registrationState": "Registered",
    ```

1. Create two subnets in the VNet you want to inject into:

    - `ChaosStudioContainerSubnet`
        - Delegate the subnet to `Microsoft.ContainerInstance/containerGroups` service.
        - This subnet must have at least /28 in address space
    - `ChaosStudioRelaySubnet`
        - This subnet must have at least /28 in address space

1. Set the `properties.subnets.containerSubnetId` and `properties.subnets.relaySubnetId` when you create or update the Target resource. The value should be the resource ID of the subnet created in step 3.

    Replace `$SUBSCRIPTION_ID` with your Azure subscription ID, `$RESOURCE_GROUP` and `$AKS_CLUSTER` with the resource group name and your AKS cluster resource name. Also, replace `$AKS_INFRA_RESOURCE_GROUP` and `$AKS_VNET` with your AKS's infrastructure resource group name and VNet name.

    ```bash
    CONTAINER_SUBNET_ID=/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$AKS_INFRA_RESOURCE_GROUP/providers/Microsoft.Network/virtualNetworks/$AKS_VNET/subnets/ChaosStudioContainerSubnet
    RELAY_SUBNET_ID=/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$AKS_INFRA_RESOURCE_GROUP/providers/Microsoft.Network/virtualNetworks/$AKS_VNET/subnets/ChaosStudioRelaySubnet
    BODY="{ \"properties\": { \"subnets\": { \"containerSubnetId\": \"$CONTAINER_SUBNET_ID\", \"relaySubnetId\": \"$RELAY_SUBNET_ID\" } } }"
    az rest --method put --url $URL --body "$BODY"
    ```

1. Start the experiment.

## Limitations
* VNet injection is currently only possible in subscriptions/regions where Azure Container Instances and Azure Relay are available. They're deployed to target regions.
* When you create a Target resource that you'll enable with VNet injection, you need Microsoft.Network/virtualNetworks/subnets/write access to the virtual network. For example, if the AKS cluster is deployed to VNet_A, then you must have permissions to create subnets in VNet_A in order to enable VNet injection for the AKS cluster. You have to specify a subnet (in VNet_A) that the container will be deployed to.

Request Body when created Target resource with VNet injection enabled:

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
<!--
![Target resource with VNet Injection](images/chaos-studio-rp-vnet-injection.png)
-->

## Next steps
Now that you understand how VNet Injection can be achieved for Chaos Studio, you're ready to:
- [Create and run your first experiment](chaos-studio-tutorial-service-direct-portal.md)
- [Create and run your first Azure Kubernetes Service experiment](chaos-studio-tutorial-aks-portal.md)

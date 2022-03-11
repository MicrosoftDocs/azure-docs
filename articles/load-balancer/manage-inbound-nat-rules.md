---
title: Manage inbound NAT rules for Azure Load Balancer
description: In this article, you'll learn how to add and remove and inbound NAT rule in the Azure portal.
author: asudbring
ms.author: allensu
ms.service: load-balancer
ms.topic: how-to
ms.date: 03/10/2022
ms.custom: template-how-to #Required; leave this attribute/value as-is.
---
# Manage inbound NAT rules for Azure Load Balancer using the Azure portal

An inbound NAT rule is used to forward traffic from a load balancer frontend to one or more instances in the backend pool. 

There are two types of inbound NAT rule:

* Single instance - An inbound NAT rule that targets a single machine in the backend pool of the load balancer

* Multiple instance - An inbound NAT rule that targets multiple virtual machines in the backend pool of the load balancer

In this article, you'll learn how to add and remove an inbound NAT rule for both types. You'll learn how to change the frontend port allocation in a multiple instance inbound NAT rule.

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment.md](../../includes/azure-cli-prepare-your-environment.md)]

- This quickstart requires version 2.0.28 or later of the Azure CLI. If using Azure Cloud Shell, the latest version is already installed.

- A standard public load balancer in your subscription. For more information on creating an Azure Load Balancer, see [Quickstart: Create a public load balancer to load balance VMs using the Azure portal](quickstart-load-balancer-standard-public-portal.md). The load balancer name for the examples in this article is **myLoadBalancer**.

## Add a single instance inbound NAT rule

# [**Portal**](#tab/inbound-nat-rule-portal)

In this example, you'll create an inbound NAT rule to forward port 500 to backend port 443.

1. Sign in to the [Azure portal](https://portal.azure.com).

2. In the search box at the top of the portal, enter **Load balancer**. Select **Load balancers** in the search results.

3. Select **myLoadBalancer** or your load balancer.

4. In the load balancer page, select **Inbound NAT rules** in **Settings**.

5. Select **+ Add** in **Inbound NAT rules** to add the rule.

    :::image type="content" source="./media/manage-inbound-nat-rules/add-rule.png" alt-text="Screenshot of the inbound NAT rules page for Azure Load Balancer":::

6. Enter or select the following information in **Add inbound NAT rule**.

    | Setting | Value |
    | ------- | ----- |
    | Name | Enter **myInboundNATrule**. |
    | Type | Select **Azure Virtual Machine**. |
    | Target virtual machine | Select the virtual machine that you wish to forward the port to. In this example, it's **myVM1**. |
    | Network IP configuration | Select the IP configuration of the virtual machine. In this example, it's **ipconfig1(10.1.0.4)**. |
    | Frontend IP address | Select **myFrontend**. |
    | Frontend Port | Enter **500**. |
    | Service Tag | Leave the default of **Custom**. |
    | Backend port | Enter **443**. |
    | Protocol | Select **TCP**. |

7. Leave the rest of the settings at the defaults and select **Add**.

    :::image type="content" source="./media/manage-inbound-nat-rules/add-single-instance-rule.png" alt-text="Screenshot of the create inbound NAT rule page":::

# [**CLI**](#tab/inbound-nat-rule-cli)

In this example, you'll create an inbound NAT rule to forward port 500 to backend port 443.

Use [az network lb inbound-nat-rule create](/cli/azure/network/lb/inbound-nat-rule#az-network-lb-inbound-nat-rule-create) to create the NAT rule.

```azurecli
    az network lb inbound-nat-rule create \
        --backend-port 443 \
        --lb-name myLoadBalancer \
        --name myInboundNATrule \
        --protocol Tcp \
        --resource-group myResourceGroup \
        --backend-pool-name myBackendPool \
        --frontend-ip-name myFrontend \
        --frontend-port 500
```
---

## Add a multiple instance inbound NAT rule

# [**Portal**](#tab/inbound-nat-rule-portal)

In this example, you'll create an inbound NAT rule to forward a range of ports starting at port 500 to backend port 443. 

1. Sign in to the [Azure portal](https://portal.azure.com).

2. In the search box at the top of the portal, enter **Load balancer**. Select **Load balancers** in the search results.

3. Select **myLoadBalancer** or your load balancer.

4. In the load balancer page, select **Inbound NAT rules** in **Settings**.

5. Select **+ Add** in **Inbound NAT rules** to add the rule.

    :::image type="content" source="./media/manage-inbound-nat-rules/add-rule.png" alt-text="Screenshot of the inbound NAT rules page for Azure Load Balancer":::

6. Enter or select the following information in **Add inbound NAT rule**.

    | Setting | Value |
    | ------- | ----- |
    | Name | Enter **myInboundNATrule**. |
    | Type | Select **Backend pool**. |
    | Target backend pool | Select your backend pool. In this example, it's **myBackendPool**. |
    | Frontend IP address | Select your frontend IP address. In this example, it's **myFrontend**. |
    | Frontend port range start | Enter **500**. |
    | Maximum number of machines in backend pool | Enter **1000**. |
    | Backend port | Enter **443**. |
    | Protocol | Select **TCP**. |

7. Leave the rest at the defaults and select **Add**.
    
    :::image type="content" source="./media/manage-inbound-nat-rules/add-inbound-nat-rule.png" alt-text="Screenshot of the add inbound NAT rules page":::

# [**CLI**](#tab/inbound-nat-rule-cli)

In this example, you'll create an inbound NAT rule to forward a range of ports starting at port 500 to backend port 443.

Use [az network lb inbound-nat-rule create](/cli/azure/network/lb/inbound-nat-rule#az-network-lb-inbound-nat-rule-create) to create the NAT rule.

```azurecli
    az network lb inbound-nat-rule create \
        --backend-port 443 \
        --lb-name myLoadBalancer \
        --name myInboundNATrule \
        --protocol Tcp \
        --resource-group myResourceGroup \
        --backend-pool-name myBackendPool \
        --frontend-ip-name myFrontend \
        --frontend-port-range-end 1000 \
        --frontend-port-range-start 500
        
```

---

## Change frontend port allocation

# [**Portal**](#tab/inbound-nat-rule-portal)

To accommodate more virtual machines in the backend pool in a multiple instance rule, change the frontend port allocation in the inbound NAT rule. In this example, you'll change the frontend port allocation from 500 to 1000.

1. Sign in to the [Azure portal](https://portal.azure.com).

2. In the search box at the top of the portal, enter **Load balancer**. Select **Load balancers** in the search results.

3. Select **myLoadBalancer** or your load balancer.

4. In the load balancer page, select **Inbound NAT rules** in **Settings**.

5. Select the inbound NAT rule you wish to change. In this example, it's **myInboundNATrule**.

    :::image type="content" source="./media/manage-inbound-nat-rules/select-inbound-nat-rule.png" alt-text="Screenshot of inbound NAT rule overview.":::

6. In the properties of the inbound NAT rule, change the value in **Frontend port range start** to **1000**.

7. Select **Save**.

    :::image type="content" source="./media/manage-inbound-nat-rules/change-frontend-ports.png" alt-text="Screenshot of inbound NAT rule properties page.":::

# [**CLI**](#tab/inbound-nat-rule-cli)

To accommodate more virtual machines in the backend pool, change the frontend port allocation in the inbound NAT rule. In this example, you'll change the frontend port allocation from 500 to 1000.

Use [az network lb inbound-nat-rule update](/cli/azure/network/lb/inbound-nat-rule#az-network-lb-inbound-nat-rule-update) to change the frontend port allocation.

```azurecli
    az network lb inbound-nat-rule update \
        --frontend-port-range-start 1000 \
        --lb-name myLoadBalancer \
        --name myInboundNATrule \
        --resource-group myResourceGroup
        
```

---

## Remove an inbound NAT rule

# [**Portal**](#tab/inbound-nat-rule-portal)

In this example, you'll remove an inbound NAT rule.

1. Sign in to the [Azure portal](https://portal.azure.com).

2. In the search box at the top of the portal, enter **Load balancer**. Select **Load balancers** in the search results.

3. Select **myLoadBalancer** or your load balancer.

4. In the load balancer page in, select **Inbound NAT rules** in **Settings**.

5. Select the three dots next to the rule you want to remove.

6. Select **Delete**.

    :::image type="content" source="./media/manage-inbound-nat-rules/remove-inbound-nat-rule.png" alt-text="Screenshot of inbound NAT rule removal.":::

# [**CLI**](#tab/inbound-nat-rule-cli)

In this example, you'll remove an inbound NAT rule.

Use [az network lb inbound-nat-rule delete](/cli/azure/network/lb/inbound-nat-rule#az-network-lb-inbound-nat-rule-delete) to remove the NAT rule.

```azurecli
    az network lb inbound-nat-rule delete \
        --lb-name myLoadBalancer \
        --name myInboundNATrule \
        --resource-group myResourceGroup
```

---

## Next steps

In this article, you learned how to manage inbound NAT rules for an Azure Load Balancer.

For more information about Azure Load Balancer, see:
- [What is Azure Load Balancer?](load-balancer-overview.md)
- [Frequently asked questions - Azure Load Balancer](load-balancer-faqs.yml)

---
title:  "Deploy Azure Spring Apps in a virtual network"
description: Deploy Azure Spring Apps in a virtual network (VNet injection).
author: KarlErickson
ms.author: karler
ms.service: spring-apps
ms.topic: how-to
ms.date: 07/21/2020
ms.custom: devx-track-java, devx-track-extended-java, devx-track-azurecli, subject-rbac-steps, event-tier1-build-2022
---

# Deploy Azure Spring Apps in a virtual network

> [!NOTE]
> Azure Spring Apps is the new name for the Azure Spring Cloud service. Although the service has a new name, you'll see the old name in some places for a while as we work to update assets such as screenshots, videos, and diagrams.

**This article applies to:** ✔️ Java ✔️ C#

**This article applies to:** ❌ Basic ✔️ Standard ✔️ Enterprise

This tutorial explains how to deploy an Azure Spring Apps instance in your virtual network. This deployment is sometimes called VNet injection.

The deployment enables:

* Isolation of Azure Spring Apps apps and service runtime from the internet on your corporate network.
* Azure Spring Apps interaction with systems in on-premises data centers or Azure services in other virtual networks.
* Empowerment of customers to control inbound and outbound network communications for Azure Spring Apps.

The following video describes how to secure Spring Boot applications using managed virtual networks.

<br>

> [!VIDEO https://www.youtube.com/embed/LbHD0jd8DTQ?list=PLPeZXlCR7ew8LlhnSH63KcM0XhMKxT1k_]

> [!NOTE]
> You can select your Azure virtual network only when you create a new Azure Spring Apps service instance. You can't change to use another virtual network after Azure Spring Apps has been created.

## Prerequisites

Register the Azure Spring Apps resource provider `Microsoft.AppPlatform` and `Microsoft.ContainerService` according to the instructions in [Register resource provider on Azure portal](../azure-resource-manager/management/resource-providers-and-types.md#azure-portal) or by running the following Azure CLI command:

```azurecli
az provider register --namespace Microsoft.AppPlatform
az provider register --namespace Microsoft.ContainerService
```

## Virtual network requirements

The virtual network to which you deploy your Azure Spring Apps instance must meet the following requirements:

* Location: The virtual network must reside in the same location as the Azure Spring Apps instance.
* Subscription: The virtual network must be in the same subscription as the Azure Spring Apps instance.
* Subnets: The virtual network must include two subnets dedicated to an Azure Spring Apps instance:
  * One for the service runtime.
  * One for your Spring applications.
  * There's a one-to-one relationship between these subnets and an Azure Spring Apps instance. Use a new subnet for each service instance you deploy. Each subnet can only include a single service instance.
* Address space: CIDR blocks up to */28* for both the service runtime subnet and the Spring applications subnet.
* Route table: By default the subnets don't need existing route tables associated. You can [bring your own route table](#bring-your-own-route-table).

Use the following steps to set up the virtual network to contain the Azure Spring Apps instance.

## Create a virtual network

### [Azure portal](#tab/azure-portal)

If you already have a virtual network to host an Azure Spring Apps instance, skip steps 1, 2, and 3. You can start from step 4 to prepare subnets for the virtual network.

1. On the Azure portal menu, select **Create a resource**. From Azure Marketplace, select **Networking** > **Virtual network**.

1. In the **Create virtual network** dialog box, enter or select the following information:

   | Setting         | Value                                            |
   |-----------------|--------------------------------------------------|
   | Subscription    | Select your subscription.                        |
   | Resource group  | Select your resource group, or create a new one. |
   | Name            | Enter *azure-spring-apps-vnet*.                  |
   | Location        | Select **East US**.                              |

1. Select **Next: IP Addresses**.

1. For the IPv4 address space, enter *10.1.0.0/16*.

1. Select **Add subnet**. Then enter *service-runtime-subnet* for **Subnet name** and enter *10.1.0.0/24* for **Subnet address range**. Then select **Add**.

1. Select **Add subnet** again, and then enter the subnet name and subnet address range. For example, enter *apps-subnet* and *10.1.1.0/24*. Then select **Add**.

1. Select **Review + create**. Leave the rest as defaults, and select **Create**.

### [Azure CLI](#tab/azure-CLI)

If you already have a virtual network to host an Azure Spring Apps instance, skip steps 1, 2, 3 and 4. You can start from step 5 to prepare subnets for the virtual network.

1. Use the following command to define variables for your subscription, resource group, and Azure Spring Apps instance. Customize the values based on your real environment.

   ```azurecli
   export SUBSCRIPTION='<subscription-id>'
   export RESOURCE_GROUP='<resource-group-name>'
   export LOCATION='eastus'
   export AZURE_SPRING_APPS_INSTANCE_NAME='<Azure-Spring-Apps-Instance-name>'
   export VIRTUAL_NETWORK_NAME='azure-spring-apps-vnet'
   ```

1. Use the following command to sign in to the Azure CLI and choose your active subscription.

   ```azurecli
   az login
   az account set --subscription ${SUBSCRIPTION}
   ```

1. Use the following command to create a resource group for your resources:

   ```azurecli
   az group create --name $RESOURCE_GROUP --location $LOCATION
   ```

1. Use the following command to create the virtual network:

   ```azurecli
   az network vnet create \
       --resource-group $RESOURCE_GROUP \
       --name $VIRTUAL_NETWORK_NAME \
       --location $LOCATION \
       --address-prefix 10.1.0.0/16
   ```

1. Use the following command to create two subnets in this virtual network:

   ```azurecli
   az network vnet subnet create \
       --resource-group $RESOURCE_GROUP \
       --vnet-name $VIRTUAL_NETWORK_NAME \
       --address-prefixes 10.1.0.0/24 \
       --name service-runtime-subnet 
   az network vnet subnet create \
       --resource-group $RESOURCE_GROUP \
       --vnet-name $VIRTUAL_NETWORK_NAME \
       --address-prefixes 10.1.1.0/24 \
       --name apps-subnet 
   ```

---

## Grant service permission to the virtual network

This section shows you to grant Azure Spring Apps the [Owner](../role-based-access-control/built-in-roles.md#owner) permission on your virtual network. This permission enables you to grant a dedicated and dynamic service principal on the virtual network for further deployment and maintenance.

> [!NOTE]
> The minimal required permissions are [User Access Administrator](../role-based-access-control/built-in-roles.md#user-access-administrator) and [Network Contributor](../role-based-access-control/built-in-roles.md#network-contributor). You can grant role assignments to both of them if you can't grant `Owner` permission.
>
> If you're using your own route table or a user defined route feature, you also need to grant Azure Spring Apps the same role assignments to your route tables. For more information, see the [Bring your own route table](#bring-your-own-route-table) section and [Control egress traffic for an Azure Spring Apps instance](how-to-create-user-defined-route-instance.md).

### [Azure portal](#tab/azure-portal)

Use the following steps to grant permission:

1. Select the virtual network `azure-spring-apps-vnet` you previously created.

1. Select **Access control (IAM)**, and then select **Add** > **Add role assignment**.

   :::image type="content" source="media/how-to-deploy-in-azure-virtual-network/access-control.png" alt-text="Screenshot of the Azure portal Access Control (IAM) page showing the Check access tab with the Add role assignment button highlighted." lightbox="media/how-to-deploy-in-azure-virtual-network/access-control.png":::

1. Assign the `Owner` role to the Azure Spring Apps Resource Provider. For more information, see [Assign Azure roles using the Azure portal](../role-based-access-control/role-assignments-portal.md).

   > [!NOTE]
   > If you don't find Azure Spring Apps Resource Provider, search for *Azure Spring Cloud Resource Provider*.

   :::image type="content" source="./media/how-to-deploy-in-azure-virtual-network/assign-owner-resource-provider.png" alt-text="Screenshot of the Azure portal showing the Access Control (IAM) page, with the Add Role Assignment pane open and search results displaying the Azure Spring Apps Resource Provider." lightbox="./media/how-to-deploy-in-azure-virtual-network/assign-owner-resource-provider.png":::

### [Azure CLI](#tab/azure-CLI)

Use the following commands to grant permission:

```azurecli
export VIRTUAL_NETWORK_RESOURCE_ID=$(az network vnet show \
    --resource-group $RESOURCE_GROUP \
    --name $VIRTUAL_NETWORK_NAME \
    --query "id" \
    --output tsv)

az role assignment create \
    --role "Owner" \
    --scope ${VIRTUAL_NETWORK_RESOURCE_ID} \
    --assignee e8de9221-a19c-4c81-b814-fd37c6caf9d2
```

The `--assignee` argument represents the service principal Azure Spring Apps uses to interact with the customer's virtual network.

---

## Deploy an Azure Spring Apps instance

### [Azure portal](#tab/azure-portal)

Use the following steps to deploy an Azure Spring Apps instance in the virtual network:

1. Open the [Azure portal](https://portal.azure.com).

1. In the top search box, search for **Azure Spring Apps**. Select **Azure Spring Apps** from the result.

1. On the **Azure Spring Apps** page, select **Add**.

1. Fill out the form on the Azure Spring Apps **Create** page.

1. Select the same resource group and region as the virtual network.

1. For **Name** under **Service Details**, select **azure-spring-apps-vnet**.

1. Select the **Networking** tab, and select the following values:

   | Setting                              | Value                               |
   |--------------------------------------|-------------------------------------|
   | Deploy in your own virtual network   | Select **Yes**.                     |
   | Virtual network                      | Select **azure-spring-apps-vnet**.  |
   | Service runtime subnet               | Select **service-runtime-subnet**.  |
   | Spring Boot microservice apps subnet | Select **apps-subnet**.             |

   :::image type="content" source="./media/how-to-deploy-in-azure-virtual-network/creation-blade-networking-tab.png" alt-text="Screenshot of the Azure portal Azure Spring Apps Create page showing the Networking tab.":::

1. Select **Review and create**.

1. Verify your specifications, and select **Create**.

   :::image type="content" source="./media/how-to-deploy-in-azure-virtual-network/verify-specifications.png" alt-text="Screenshot of the Azure portal Azure Spring Apps Create page showing the Networking section of the Review and create tab.":::

### [Azure CLI](#tab/azure-CLI)

To deploy an Azure Spring Apps instance in the virtual network:

Use the following command to create your Azure Spring Apps instance, specifying the virtual network and subnets you created previously:

```azurecli
az spring create  \
    --resource-group "$RESOURCE_GROUP" \
    --name "$AZURE_SPRING_APPS_INSTANCE_NAME" \
    --vnet $VIRTUAL_NETWORK_NAME \
    --service-runtime-subnet service-runtime-subnet \
    --app-subnet apps-subnet \
    --enable-java-agent \
    --sku standard \
    --location $LOCATION
```

---

After the deployment, two more resource groups are created in your subscription to host the network resources for the Azure Spring Apps instance. Go to **Home**, and then select **Resource groups** from the top menu items to find the following new resource groups.

The resource group named as `ap-svc-rt_{service instance name}_{service instance region}` contains network resources for the service runtime of the service instance.

:::image type="content" source="media/how-to-deploy-in-azure-virtual-network/service-runtime-resource-group.png" alt-text="Screenshot of the Azure portal showing the resources for the service runtime." lightbox="media/how-to-deploy-in-azure-virtual-network/service-runtime-resource-group.png":::

The resource group named as `ap-app_{service instance name}_{service instance region}` contains network resources for your Spring applications of the service instance.

:::image type="content" source="media/how-to-deploy-in-azure-virtual-network/apps-resource-group.png" alt-text="Screenshot of the Azure portal showing the resources for the Spring applications." lightbox="media/how-to-deploy-in-azure-virtual-network/apps-resource-group.png":::

Those network resources are connected to your virtual network created in the preceding image.

:::image type="content" source="./media/how-to-deploy-in-azure-virtual-network/vnet-with-connected-device.png" alt-text="Screenshot of the Azure portal showing the Connected devices page for a virtual network." lightbox="./media/how-to-deploy-in-azure-virtual-network/vnet-with-connected-device.png":::

> [!IMPORTANT]
> The resource groups are fully managed by the Azure Spring Apps service. Do *not* manually delete or modify any resource inside.

## Using smaller subnet ranges

This table shows the maximum number of app instances Azure Spring Apps supports using smaller subnet ranges.

| App subnet CIDR | Total IPs | Available IPs | Maximum app instances                                                                                                                                  |
|-----------------|-----------|---------------|--------------------------------------------------------------------------------------------------------------------------------------------------------|
| /28             | 16        | 8             | <p>App with 0.5 core:  192 <br/> App with one core:  96 <br/> App with two cores: 48<br/> App with three cores: 32<br/> App with four cores: 24</p>    |
| /27             | 32        | 24            | <p>App with 0.5 core:  456 <br/> App with one core:  228<br/> App with two cores: 144<br/> App with three cores: 96<br/> App with four cores: 72</p>   |
| /26             | 64        | 56            | <p>App with 0.5 core:  500 <br/> App with one core:  500<br/> App with two cores: 336<br/> App with three cores: 224<br/> App with four cores: 168</p> |
| /25             | 128       | 120           | <p>App with 0.5 core:  500 <br/> App with one core:  500<br/> App with two cores: 500<br/> App with three cores:  480<br> App with four cores: 360</p> |
| /24             | 256       | 248           | <p>App with 0.5 core:  500 <br/> App with one core:  500<br/> App with two cores: 500<br/> App with three cores: 500<br/> App with four cores: 500</p> |

For subnets, Azure reserves five IP addresses, and Azure Spring Apps requires at least three IP addresses. At least eight IP addresses are required, so /29 and /30 are nonoperational.

For a service runtime subnet, the minimum size is /28.

> [!NOTE]
> A small subnet range impacts the underlying resource you can use for system components like ingress controller. Azure Spring Apps uses an underlying ingress controller to handle application traffic management. The number of ingress controller instances automatically increases as application traffic increases. Reserve a larger virtual network subnet IP range if application traffic could increase in the future. You typically reserve one IP addresses for traffic of 10000 requests per second.

## Bring your own route table

Azure Spring Apps supports using existing subnets and route tables.

If your custom subnets don't contain route tables, Azure Spring Apps creates them for each of the subnets and adds rules to them throughout the instance lifecycle. If your custom subnets contain route tables, Azure Spring Apps acknowledges the existing route tables during instance operations and adds/updates and/or rules accordingly for operations.

> [!WARNING]
> Custom rules can be added to the custom route tables and updated. However, rules are added by Azure Spring Apps and these must not be updated or removed. Rules such as 0.0.0.0/0 must always exist on a given route table and map to the target of your internet gateway, such as an NVA or other egress gateway. Use caution when updating rules when only your custom rules are being modified.

### Route table requirements

The route tables to which your custom vnet is associated must meet the following requirements:

* You can associate your Azure route tables with your vnet only when you create a new Azure Spring Apps service instance. You can't change to use another route table after Azure Spring Apps has been created.
* Both the Spring application subnet and the service runtime subnet must associate with different route tables or neither of them.
* Permissions must be assigned before instance creation. Be sure to grant Azure Spring Apps Resource Provider the `Owner` permission (or `User Access Administrator` and `Network Contributor` permissions) on your route tables.
* You can't update the associated route table resource after cluster creation. While you can't update the route table resource, you can modify custom rules on the route table.
* You can't reuse a route table with multiple instances due to potential conflicting routing rules.

## Using Custom DNS Servers

Azure Spring Apps supports using custom DNS servers in your virtual network.

If you don't specify custom DNS servers in your DNS Server Virtual Network setting, Azure Spring Apps will, by default, use the Azure DNS to resolve IP addresses. If your virtual network is configured with custom DNS settings, add Azure DNS IP `168.63.129.16` as the upstream DNS server in the custom DNS server. Azure DNS can resolve IP addresses for all the public FQDNs mentioned in [Customer responsibilities running Azure Spring Apps in a virtual network](vnet-customer-responsibilities.md). It can also resolve IP address for `*.svc.private.azuremicroservices.io` in your virtual network.

If your custom DNS server can't add Azure DNS IP `168.63.129.16` as the upstream DNS server, use the following steps:

* Ensure that your custom DNS server can resolve IP addresses for all the public FQDNs. For more information, see [Customer responsibilities running Azure Spring Apps in a virtual network](vnet-customer-responsibilities.md).
* Add the DNS record `*.svc.private.azuremicroservices.io` to the IP of your application. For more information, see the [Find the IP for your application](access-app-virtual-network.md#find-the-ip-for-your-application) section of [Access an app in Azure Spring Apps in a virtual network](access-app-virtual-network.md).

## Next steps

* [Troubleshooting Azure Spring Apps in VNET](troubleshooting-vnet.md)
* [Customer Responsibilities for Running Azure Spring Apps in VNET](vnet-customer-responsibilities.md)

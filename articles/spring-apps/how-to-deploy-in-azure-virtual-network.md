---
title:  "Deploy Azure Spring Apps in a virtual network"
description: Deploy Azure Spring Apps in a virtual network (VNet injection).
author: karlerickson
ms.author: karler
ms.service: spring-apps
ms.topic: how-to
ms.date: 07/21/2020
ms.custom: devx-track-java, devx-track-azurecli, subject-rbac-steps, event-tier1-build-2022
---

# Deploy Azure Spring Apps in a virtual network

> [!NOTE]
> Azure Spring Apps is the new name for the Azure Spring Cloud service. Although the service has a new name, you'll see the old name in some places for a while as we work to update assets such as screenshots, videos, and diagrams.

**This article applies to:** ✔️ Java ✔️ C#

**This article applies to:** ✔️ Basic/Standard tier ✔️ Enterprise tier

This tutorial explains how to deploy an Azure Spring Apps instance in your virtual network. This deployment is sometimes called VNet injection.

The deployment enables:

* Isolation of Azure Spring Apps apps and service runtime from the internet on your corporate network.
* Azure Spring Apps interaction with systems in on-premises data centers or Azure services in other virtual networks.
* Empowerment of customers to control inbound and outbound network communications for Azure Spring Apps.

The following video describes how to secure Spring Boot applications using managed virtual networks.

<br>

> [!VIDEO https://www.youtube.com/embed/LbHD0jd8DTQ?list=PLPeZXlCR7ew8LlhnSH63KcM0XhMKxT1k_]

> [!Note]
> You can select your Azure virtual network only when you create a new Azure Spring Apps service instance. You cannot change to use another virtual network after Azure Spring Apps has been created.

## Prerequisites

Register the Azure Spring Apps resource provider **Microsoft.AppPlatform** and **Microsoft.ContainerService** according to the instructions in [Register resource provider on Azure portal](../azure-resource-manager/management/resource-providers-and-types.md#azure-portal) or by running the following Azure CLI command:

```azurecli
az provider register --namespace Microsoft.AppPlatform
az provider register --namespace Microsoft.ContainerService
```

## Virtual network requirements

The virtual network to which you deploy your Azure Spring Apps instance must meet the following requirements:

* **Location**: The virtual network must reside in the same location as the Azure Spring Apps instance.
* **Subscription**: The virtual network must be in the same subscription as the Azure Spring Apps instance.
* **Subnets**: The virtual network must include two subnets dedicated to an Azure Spring Apps instance:
  * One for the service runtime.
  * One for your Spring applications.
  * There's a one-to-one relationship between these subnets and an Azure Spring Apps instance. Use a new subnet for each service instance you deploy. Each subnet can only include a single service instance.
* **Address space**: CIDR blocks up to */28* for both the service runtime subnet and the Spring applications subnet.
* **Route table**: By default the subnets do not need existing route tables associated. You can [bring your own route table](#bring-your-own-route-table).

The following procedures describe setup of the virtual network to contain the instance of Azure Spring Apps.

## Create a virtual network

#### [Portal](#tab/azure-portal)

If you already have a virtual network to host an Azure Spring Apps instance, skip steps 1, 2, and 3. You can start from step 4 to prepare subnets for the virtual network.

1. On the Azure portal menu, select **Create a resource**. From Azure Marketplace, select **Networking** > **Virtual network**.

1. In the **Create virtual network** dialog box, enter or select the following information:

    | Setting         | Value                                            |
    |-----------------|--------------------------------------------------|
    | Subscription    | Select your subscription.                        |
    | Resource group  | Select your resource group, or create a new one. |
    | Name            | Enter **azure-spring-apps-vnet**.               |
    | Location        | Select **East US**.                              |

1. Select **Next: IP Addresses**.

1. For the IPv4 address space, enter **10.1.0.0/16**.

1. Select **Add subnet**. Then enter **service-runtime-subnet** for **Subnet name** and enter **10.1.0.0/24** for **Subnet address range**. Then select **Add**.

1. Select **Add subnet** again, and then enter **Subnet name** and **Subnet address range**. For example, enter **apps-subnet** and **10.1.1.0/24**. Then select **Add**.

1. Select **Review + create**. Leave the rest as defaults, and select **Create**.

#### [CLI](#tab/azure-CLI)

If you already have a virtual network to host an Azure Spring Apps instance, skip steps 1, 2, 3 and 4. You can start from step 5 to prepare subnets for the virtual network.

1. Define variables for your subscription, resource group, and Azure Spring Apps instance. Customize the values based on your real environment.

   ```azurecli
   SUBSCRIPTION='subscription-id'
   RESOURCE_GROUP='my-resource-group'
   LOCATION='eastus'
   SPRING_CLOUD_NAME='spring-cloud-name'
   VIRTUAL_NETWORK_NAME='azure-spring-apps-vnet'
   ```

1. Sign in to the Azure CLI and choose your active subscription.

   ```azurecli
   az login
   az account set --subscription ${SUBSCRIPTION}
   ```

1. Create a resource group for your resources.

   ```azurecli
   az group create --name $RESOURCE_GROUP --location $LOCATION
   ```

1. Create the virtual network.

   ```azurecli
   az network vnet create --resource-group $RESOURCE_GROUP \
       --name $VIRTUAL_NETWORK_NAME \
       --location $LOCATION \
       --address-prefix 10.1.0.0/16
   ```

1. Create 2 subnets in this virtual network. 

   ```azurecli
   az network vnet subnet create --resource-group $RESOURCE_GROUP \
       --vnet-name $VIRTUAL_NETWORK_NAME \
       --address-prefixes 10.1.0.0/24 \
       --name service-runtime-subnet 
   az network vnet subnet create --resource-group $RESOURCE_GROUP \
       --vnet-name $VIRTUAL_NETWORK_NAME \
       --address-prefixes 10.1.1.0/24 \
       --name apps-subnet 
   ```

---

## Grant service permission to the virtual network

Azure Spring Apps requires **Owner** permission to your virtual network, in order to grant a dedicated and dynamic service principal on the virtual network for further deployment and maintenance.

#### [Portal](#tab/azure-portal)

Select the virtual network **azure-spring-apps-vnet** you previously created.

1. Select **Access control (IAM)**, and then select **Add** > **Add role assignment**.

    ![Screenshot that shows the Access control screen.](./media/spring-cloud-v-net-injection/access-control.png)

1. Assign the *Owner* role to the **Azure Spring Cloud Resource Provider**. For detailed steps, see [Assign Azure roles using the Azure portal](../role-based-access-control/role-assignments-portal.md#step-2-open-the-add-role-assignment-page).

    ![Screenshot that shows owner assignment to resource provider.](./media/spring-cloud-v-net-injection/assign-owner-resource-provider.png)

    You can also do this step by running the following Azure CLI command:

    ```azurecli
    VIRTUAL_NETWORK_RESOURCE_ID=`az network vnet show \
        --name ${NAME_OF_VIRTUAL_NETWORK} \
        --resource-group ${RESOURCE_GROUP_OF_VIRTUAL_NETWORK} \
        --query "id" \
        --output tsv`

    az role assignment create \
        --role "Owner" \
        --scope ${VIRTUAL_NETWORK_RESOURCE_ID} \
        --assignee e8de9221-a19c-4c81-b814-fd37c6caf9d2
    ```

#### [CLI](#tab/azure-CLI)

```azurecli
VIRTUAL_NETWORK_RESOURCE_ID=`az network vnet show \
    --name $VIRTUAL_NETWORK_NAME \
    --resource-group $RESOURCE_GROUP \
    --query "id" \
    --output tsv`

az role assignment create \
    --role "Owner" \
    --scope ${VIRTUAL_NETWORK_RESOURCE_ID} \
    --assignee e8de9221-a19c-4c81-b814-fd37c6caf9d2
```

---

## Deploy an Azure Spring Apps instance

#### [Portal](#tab/azure-portal)

To deploy an Azure Spring Apps instance in the virtual network:

1. Open the [Azure portal](https://portal.azure.com).

1. In the top search box, search for **Azure Spring Apps**. Select **Azure Spring Apps** from the result.

1. On the **Azure Spring Apps** page, select **Add**.

1. Fill out the form on the Azure Spring Apps **Create** page.

1. Select the same resource group and region as the virtual network.

1. For **Name** under **Service Details**, select **azure-spring-apps-vnet**.

1. Select the **Networking** tab, and select the following values:

    | Setting                            | Value                               |
    |------------------------------------|-------------------------------------|
    | Deploy in your own virtual network | Select **Yes**.                     |
    | Virtual network                    | Select **azure-spring-apps-vnet**. |
    | Service runtime subnet             | Select **service-runtime-subnet**.  |
    | Spring apps subnet                 | Select **apps-subnet**.             |

    ![Screenshot that shows the Networking tab on the Azure Spring Apps Create page.](./media/spring-cloud-v-net-injection/creation-blade-networking-tab.png)

1. Select **Review and create**.

1. Verify your specifications, and select **Create**.

   ![Screenshot that shows verifying specifications.](./media/spring-cloud-v-net-injection/verify-specifications.png)

#### [CLI](#tab/azure-CLI)

To deploy an Azure Spring Apps instance in the virtual network:

Create your Azure Spring Apps instance by specifying the virtual network and subnets you just created,

   ```azurecli
   az spring create  \
       --resource-group "$RESOURCE_GROUP" \
       --name "$SPRING_CLOUD_NAME" \
       --vnet $VIRTUAL_NETWORK_NAME \
       --service-runtime-subnet service-runtime-subnet \
       --app-subnet apps-subnet \
       --enable-java-agent \
       --sku standard \
       --location $LOCATION
   ```

---

After the deployment, two additional resource groups will be created in your subscription to host the network resources for the Azure Spring Apps instance. Go to **Home**, and then select **Resource groups** from the top menu items to find the following new resource groups.

The resource group named as **ap-svc-rt_{service instance name}_{service instance region}** contains network resources for the service runtime of the service instance.

  ![Screenshot that shows the service runtime.](./media/spring-cloud-v-net-injection/service-runtime-resource-group.png)

The resource group named as **ap-app_{service instance name}_{service instance region}** contains network resources for your Spring applications of the service instance.

  ![Screenshot that shows apps resource group.](./media/spring-cloud-v-net-injection/apps-resource-group.png)

Those network resources are connected to your virtual network created in the preceding image.

  ![Screenshot that shows the virtual network with connected devices.](./media/spring-cloud-v-net-injection/vnet-with-connected-device.png)

   > [!Important]
   > The resource groups are fully managed by the Azure Spring Apps service. Do *not* manually delete or modify any resource inside.

## Using smaller subnet ranges

This table shows the maximum number of app instances Azure Spring Apps supports using smaller subnet ranges.

| App subnet CIDR | Total IPs | Available IPs | Maximum app instances                                        |
| --------------- | --------- | ------------- | ------------------------------------------------------------ |
| /28             | 16        | 8             | <p>App with 0.5 core:  192 <br/> App with one core:  96 <br/> App with two cores: 48<br/> App with three cores: 32<br/> App with four cores: 24</p> |
| /27             | 32        | 24            | <p>App with 0.5 core:  456 <br/> App with one core:  228<br/> App with two cores: 144<br/> App with three cores: 96<br/> App with four cores: 72</p> |
| /26             | 64        | 56            | <p>App with 0.5 core:  500 <br/> App with one core:  500<br/> App with two cores: 336<br/> App with three cores: 224<br/> App with four cores: 168</p> |
| /25             | 128       | 120           | <p>App with 0.5 core:  500 <br/> App with one core:  500<br/> App with two cores: 500<br/> App with three cores:  480<br> App with four cores: 360</p> |
| /24             | 256       | 248           | <p>App with 0.5 core:  500 <br/> App with one core:  500<br/> App with two cores: 500<br/> App with three cores: 500<br/> App with four cores: 500</p> |

For subnets, five IP addresses are reserved by Azure, and at least three IP addresses are required by Azure Spring Apps. At least eight IP addresses are required, so /29 and /30 are nonoperational.

For a service runtime subnet, the minimum size is /28. This size has no bearing on the number of app instances.

## Bring your own route table

Azure Spring Apps supports using existing subnets and route tables.

If your custom subnets do not contain route tables, Azure Spring Apps creates them for each of the subnets and adds rules to them throughout the instance lifecycle. If your custom subnets contain route tables, Azure Spring Apps acknowledges the existing route tables during instance operations and adds/updates and/or rules accordingly for operations.

> [!Warning]
> Custom rules can be added to the custom route tables and updated. However, rules are added by Azure Spring Apps and these must not be updated or removed. Rules such as 0.0.0.0/0 must always exist on a given route table and map to the target of your internet gateway, such as an NVA or other egress gateway. Use caution when updating rules when only your custom rules are being modified.

### Route table requirements

The route tables to which your custom vnet is associated must meet the following requirements:

* You can associate your Azure route tables with your vnet only when you create a new Azure Spring Apps service instance. You cannot change to use another route table after Azure Spring Apps has been created.
* Both the Spring application subnet and the service runtime subnet must associate with different route tables or neither of them.
* Permissions must be assigned before instance creation. Be sure to grant **Azure Spring Apps Resource Provider** the *Owner* permission to your route tables.
* The associated route table resource cannot be updated after cluster creation. While the route table resource cannot be updated, custom rules can be modified on the route table.
* You cannot reuse a route table with multiple instances due to potential conflicting routing rules.

## Next steps

* [Troubleshooting Azure Spring Apps in VNET](troubleshooting-vnet.md)
* [Customer Responsibilities for Running Azure Spring Apps in VNET](vnet-customer-responsibilities.md)

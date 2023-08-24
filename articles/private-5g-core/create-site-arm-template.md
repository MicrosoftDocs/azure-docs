---
title: Create a site - ARM template
titleSuffix: Azure Private 5G Core
description: This how-to guide shows how to create a site in your private mobile network using an Azure Resource Manager (ARM) template. 
author: robswain
ms.author: robswain
ms.service: private-5g-core
ms.topic: how-to
ms.date: 03/16/2022
ms.custom: template-how-to, devx-track-arm-template
zone_pivot_groups: ase-pro-version
---

# Create a site using an ARM template

Azure Private 5G Core private mobile networks include one or more *sites*. Each site represents a physical enterprise location (for example, Contoso Corporation's Chicago factory) containing an Azure Stack Edge device that hosts a packet core instance. In this how-to guide, you'll learn how to create a site in your private mobile network using an Azure Resource Manager template (ARM template).

[!INCLUDE [About Azure Resource Manager](../../includes/resource-manager-quickstart-introduction.md)]

If your environment meets the prerequisites and you're familiar with using ARM templates, select the **Deploy to Azure** button. The template will open in the Azure portal.

[![Deploy to Azure.](../media/template-deployments/deploy-to-azure.svg)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fquickstarts%2Fmicrosoft.mobilenetwork%2Fmobilenetwork-create-new-site%2Fazuredeploy.json)

## Prerequisites

- Carry out the steps in [Complete the prerequisite tasks for deploying a private mobile network](complete-private-mobile-network-prerequisites.md?pivots=ase-pro-gpu) for your new site.
:::zone pivot="ase-pro-gpu"
- Identify the names of the interfaces corresponding to ports 5 and 6 on your Azure Stack Edge Pro device.
:::zone-end
:::zone pivot="ase-pro-2"
- Identify the names of the interfaces corresponding to ports 3 and 4 on your Azure Stack Edge Pro device.
:::zone-end
- Collect all of the information in [Collect the required information for a site](collect-required-information-for-a-site.md?pivots=ase-pro-2).
- Ensure you can sign in to the Azure portal using an account with access to the active subscription you used to create your private mobile network. This account must have the built-in Contributor or Owner role at the subscription scope.
- If the new site will support 4G user equipment (UEs), you must have [created a network slice](create-manage-network-slices.md#create-a-network-slice) with slice/service type (SST) value of 1 and an empty slice differentiator (SD).

## Review the template

The template used in this how-to guide is from [Azure Quickstart Templates](/samples/azure/azure-quickstart-templates/mobilenetwork-create-new-site/).

:::code language="json" source="~/quickstart-templates/quickstarts/microsoft.mobilenetwork/mobilenetwork-create-new-site/azuredeploy.json":::

Four Azure resources are defined in the template.

- [**Microsoft.MobileNetwork/mobileNetworks/sites**](/azure/templates/microsoft.mobilenetwork/mobilenetworks/sites): a resource representing your site as a whole.
- [**Microsoft.MobileNetwork/packetCoreControlPlanes/packetCoreDataPlanes/attachedDataNetworks**](/azure/templates/microsoft.mobilenetwork/packetcorecontrolplanes/packetcoredataplanes/attacheddatanetworks): a resource providing configuration for the packet core instance's connection to a data network.
- [**Microsoft.MobileNetwork/packetCoreControlPlanes/packetCoreDataPlanes**](/azure/templates/microsoft.mobilenetwork/packetcorecontrolplanes/packetcoredataplanes): a resource providing configuration for the user plane network functions of the packet core instance, including IP configuration for the user plane interface on the access network.
- [**Microsoft.MobileNetwork/packetCoreControlPlanes**](/azure/templates/microsoft.mobilenetwork/packetcorecontrolplanes): a resource providing configuration for the control plane network functions of the packet core instance, including IP configuration for the control plane interface on the access network.

## Deploy the template

1. Select the following link to sign in to Azure and open a template.

    [![Deploy to Azure.](../media/template-deployments/deploy-to-azure.svg)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fquickstarts%2Fmicrosoft.mobilenetwork%2Fmobilenetwork-create-new-site%2Fazuredeploy.json)

:::zone pivot="ase-pro-gpu"
2. Select or enter the following values, using the information you retrieved in [Prerequisites](#prerequisites).

    | Field | Value |
    |--|--|
    | **Subscription** | Select the Azure subscription you used to create your private mobile network. |
    | **Resource group** | Select the resource group containing the mobile network resource representing your private mobile network. |
    | **Region** | Select the region in which you deployed the private mobile network. |
    | **Location** | Enter the [code name](region-code-names.md) of the region in which you deployed the private mobile network. |
    | **Existing Mobile Network Name** | Enter the name of the mobile network resource representing your private mobile network. |
    | **Existing Data Network Name** | Enter the name of the data network. This value must match the name you used when creating the data network. |
    | **Site Name** | Enter a name for your site.|
    | **Azure Stack Edge Device** | Enter the resource ID of the Azure Stack Edge resource in the site. |
    | **Control Plane Access Interface Name** | Enter the virtual network name on port 5 on your Azure Stack Edge Pro GPU device corresponding to the control plane interface on the access network. For 5G, this interface is the N2 interface; for 4G, it's the S1-MME interface. |
    | **Control Plane Access Ip Address** | Enter the IP address for the control plane interface on the access network. |
    | **User Plane Access Interface Name** | Enter the virtual network name on port 5 on your Azure Stack Edge Pro GPU device corresponding to the user plane interface on the access network. For 5G, this interface is the N3 interface; for 4G, it's the S1-U interface. |
    | **User Plane Data Interface Name** | Enter the virtual network name on port 6 on your Azure Stack Edge Pro GPU device corresponding to the user plane interface on the data network. For 5G, this interface is the N6 interface; for 4G, it's the SGi interface. |
    |**User Equipment Address Pool Prefix**  | Enter the network address of the subnet from which dynamic IP addresses must be allocated to UEs in CIDR notation. You can omit this if you don't want to support dynamic IP address allocation. |
    |**User Equipment Static Address Pool Prefix**  | Enter the network address of the subnet from which static IP addresses must be allocated to UEs in CIDR notation. You can omit this if you don't want to support static IP address allocation. |
    | **Core Network Technology** | Enter *5GC* for 5G, or *EPC* for 4G. |
    | **Napt Enabled** | Set this field depending on whether Network Address and Port Translation (NAPT) should be enabled for the data network. |
    | **Dns Addresses** | Enter the DNS server addresses. You should only omit this if you don't need the UEs to perform DNS resolution, or if all UEs in the network will use their own locally configured DNS servers. |
    | **Custom Location** | Enter the resource ID of the custom location that targets the Azure Kubernetes Service on Azure Stack HCI (AKS-HCI) cluster on the Azure Stack Edge Pro device in the site. |

:::zone-end
:::zone pivot="ase-pro-2"
2. Select or enter the following values, using the information you retrieved in [Prerequisites](#prerequisites).

    | Field | Value |
    |--|--|
    | **Subscription** | Select the Azure subscription you used to create your private mobile network. |
    | **Resource group** | Select the resource group containing the mobile network resource representing your private mobile network. |
    | **Region** | Select the region in which you deployed the private mobile network. |
    | **Location** | Enter the [code name](region-code-names.md) of the region in which you deployed the private mobile network. |
    | **Existing Mobile Network Name** | Enter the name of the mobile network resource representing your private mobile network. |
    | **Existing Data Network Name** | Enter the name of the data network. This value must match the name you used when creating the data network. |
    | **Site Name** | Enter a name for your site.|
    | **Azure Stack Edge Device** | Enter the resource ID of the Azure Stack Edge resource in the site. |
    | **Control Plane Access Interface Name** | Enter the virtual network name on port 3 on your Azure Stack Edge Pro 2 device corresponding to the control plane interface on the access network. For 5G, this interface is the N2 interface; for 4G, it's the S1-MME interface. |
    | **Control Plane Access Ip Address** | Enter the IP address for the control plane interface on the access network. |
    | **User Plane Access Interface Name** | Enter the virtual network name on port 3 on your Azure Stack Edge Pro 2 device corresponding to the user plane interface on the access network. For 5G, this interface is the N3 interface; for 4G, it's the S1-U interface. |
    | **User Plane Data Interface Name** | Enter the virtual network name on port 4 on your Azure Stack Edge Pro 2 device corresponding to the user plane interface on the data network. For 5G, this interface is the N6 interface; for 4G, it's the SGi interface. |
    |**User Equipment Address Pool Prefix**  | Enter the network address of the subnet from which dynamic IP addresses must be allocated to UEs in CIDR notation. You can omit this if you don't want to support dynamic IP address allocation. |
    |**User Equipment Static Address Pool Prefix**  | Enter the network address of the subnet from which static IP addresses must be allocated to UEs in CIDR notation. You can omit this if you don't want to support static IP address allocation. |
    | **Core Network Technology** | Enter *5GC* for 5G, or *EPC* for 4G. |
    | **Napt Enabled** | Set this field depending on whether Network Address and Port Translation (NAPT) should be enabled for the data network. |
    | **Dns Addresses** | Enter the DNS server addresses. You should only omit this if you don't need the UEs to perform DNS resolution, or if all UEs in the network will use their own locally configured DNS servers. |
    | **Custom Location** | Enter the resource ID of the custom location that targets the Azure Kubernetes Service on Azure Stack HCI (AKS-HCI) cluster on the Azure Stack Edge Pro device in the site. |

:::zone-end

3. Select **Review + create**.
4. Azure will now validate the configuration values you've entered. You should see a message indicating that your values have passed validation.

    If the validation fails, you'll see an error message and the **Configuration** tab(s) containing the invalid configuration will be flagged. Select the flagged tab(s) and use the error messages to correct invalid configuration before returning to the **Review + create** tab.

5. Once your configuration has been validated, you can select **Create** to create the site. The Azure portal will display a confirmation screen when the site has been created.

## Review deployed resources

1. On the confirmation screen, select **Go to resource group**.

    :::image type="content" source="media/template-deployment-confirmation.png" alt-text="Screenshot of the Azure portal showing a deployment confirmation for the ARM template.":::

1. Confirm that the resource group contains the following new resources:

    - A **Mobile Network Site** resource representing the site as a whole.
    - A **Packet Core Control Plane** resource representing the control plane function of the packet core instance in the site.
    - A **Packet Core Data Plane** resource representing the data plane function of the packet core instance in the site.
    - An **Attached Data Network** resource representing the site's view of the data network.

    :::image type="content" source="media/create-a-site/site-related-resources.png" alt-text="Screenshot of the Azure portal showing a resource group containing a site and its related resources." lightbox="media/create-a-site/site-related-resources.png":::

## Next steps

If you decided to set up Azure AD for local monitoring access, follow the steps in [Modify the local access configuration in a site](modify-local-access-configuration.md) and [Enable Azure Active Directory (Azure AD) for local monitoring tools](enable-azure-active-directory.md).

If you haven't already done so, you should now design the policy control configuration for your private mobile network. This allows you to customize how your packet core instances apply quality of service (QoS) characteristics to traffic. You can also block or limit certain flows. See [Policy control](policy-control.md) to learn more about designing the policy control configuration for your private mobile network.

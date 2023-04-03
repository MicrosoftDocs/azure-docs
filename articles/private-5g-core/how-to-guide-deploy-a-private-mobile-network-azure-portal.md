---
title: Deploy a private mobile network - Azure portal
titleSuffix: Azure Private 5G Core
description: This how-to guide shows how to deploy a private mobile network through Azure Private 5G Core using the Azure portal 
author: djrmetaswitch
ms.author: drichards
ms.service: private-5g-core
ms.topic: how-to
ms.date: 01/03/2022
ms.custom: template-how-to
---

# Deploy a private mobile network through Azure Private 5G Core - Azure portal

Private mobile networks provide high performance, low latency, and secure connectivity for 5G Internet of Things (IoT) devices. In this how-to guide, you'll use the Azure portal to deploy a private mobile network to match your enterprise's requirements.

## Prerequisites

- Complete all of the steps in [Complete the prerequisite tasks for deploying a private mobile network](complete-private-mobile-network-prerequisites.md) and [Commission the AKS cluster](commission-cluster.md).
- Ensure you can sign in to the Azure portal using an account with access to the active subscription you identified in [Complete the prerequisite tasks for deploying a private mobile network](complete-private-mobile-network-prerequisites.md). This account must have the built-in Contributor or Owner role at the subscription scope.
- Collect all of the information listed in [Collect the required information to deploy a private mobile network](collect-required-information-for-private-mobile-network.md). You may also need to take the following steps based on the decisions you made when collecting this information.

  - If you decided you want to provision SIMs using a JSON file, ensure you've prepared this file and made it available on the machine you'll use to access the Azure portal. For more information on the file format, see [JSON file format for provisioning SIMs](collect-required-information-for-private-mobile-network.md#json-file-format-for-provisioning-sims) or [Encrypted JSON file format for provisioning vendor provided SIMs](collect-required-information-for-private-mobile-network.md#encrypted-json-file-format-for-provisioning-vendor-provided-sims).
  - If you decided you want to use the default service and SIM policy, identify the name of the data network to which you want to assign the policy.

## Deploy your private mobile network

In this step, you'll create the Mobile Network resource representing your private mobile network as a whole. You can also provision one or more SIMs, and / or create the default service and SIM policy.

1. Sign in to the [Azure portal](https://portal.azure.com/).
1. In the **Search** bar, type *mobile networks* and then select the **Mobile Networks** service from the results that appear.

    :::image type="content" source="media/mobile-networks-search.png" alt-text="Screenshot of the Azure portal showing a search for the Mobile Networks service.":::

1. On the **Mobile Networks** page, select **Create**.

    :::image type="content" source="media/create-button-mobile-networks.png" alt-text="Screenshot of the Azure portal showing the Create button on the Mobile Networks page.":::

1. Use the information you collected in [Collect private mobile network resource values](collect-required-information-for-private-mobile-network.md#collect-mobile-network-resource-values) to fill out the fields on the **Basics** configuration tab. Once you've done this, select **Next : SIMs >**.

    :::image type="content" source="media/how-to-guide-deploy-a-private-mobile-network-azure-portal/create-private-mobile-network-basics-tab.png" alt-text="Screenshot of the Azure portal showing the Basics configuration tab.":::

1. On the **SIMs** configuration tab, select your chosen input method by selecting the appropriate option next to **How would you like to input the SIMs information?**. You can then input the information you collected in [Collect SIM and SIM Group values](collect-required-information-for-private-mobile-network.md#collect-sim-and-sim-group-values).
 
    - If you decided that you don't want to provision any SIMs at this point, select **Add SIMs later**.
    - If you select **Add manually**, a new **Add SIM** button will appear under **Enter SIM profile configurations**. Select it, fill out the fields with the correct settings for the first SIM you want to provision, and select **Add SIM**. Repeat this process for every additional SIM you want to provision.

    :::image type="content" source="media/add-sim-manually.png" alt-text="Screenshot of the Azure portal showing the Add SIM screen.":::

    - If you select **Upload JSON file**, the **Upload SIM profile configurations** field will appear. Use this field to upload your chosen JSON file.

    :::image type="content" source="media/how-to-guide-deploy-a-private-mobile-network-azure-portal/create-private-mobile-network-sims-tab.png" alt-text="Screenshot of the Azure portal showing the SIMs configuration tab.":::

    - If you select **Upload Encrypted JSON file**, the following notice will appear.

    :::image type="content" source="media/how-to-guide-deploy-a-private-mobile-network-azure-portal/create-private-mobile-network-vendor-sims-notice.png" alt-text="Screenshot of the Azure portal showing a notice on the SIMs configuration tab stating: At the moment, you will not be able to upload the encrypted SIMs under this SIM group. However, you will be able upload the encrypted SIMs under the SIM group section, once the above named SIM group gets created.":::

1. If you're provisioning SIMs at this point, you'll need to take the following additional steps.
   1. If you want to use the default service and SIM policy, set **Do you wish to create a basic, default SIM policy and assign it to these SIMs?** to **Yes**, and then enter the name of the data network into the **Data network name** field that appears. 
   1. Under **Enter SIM group information**, set **SIM group name** to your chosen name for the SIM group to which your SIMs will be added.
   1. Under **Enter encryption details for SIM group**, set **Encryption type** to your chosen encryption type. Once the SIM group is created, you cannot change the encryption type.
   1. If you selected **Customer-managed keys (CMK)**, set the **Key URI** and **User-assigned identity** to those the SIM group will use for encryption.
1. Select **Review + create**.
1. Azure will now validate the configuration values you've entered. You should see a message indicating that your values have passed validation.

    :::image type="content" source="media/how-to-guide-deploy-a-private-mobile-network-azure-portal/create-private-mobile-network-review-create-tab.png" alt-text="Screenshot of the Azure portal showing validated configuration for a private mobile network.":::

    If the validation fails, you'll see an error message and the configuration tab(s) containing the invalid configuration will be flagged with red dots. Select the flagged tab(s) and use the error messages to correct invalid configuration before returning to the **Review + create** tab.

1. Once the configuration has been validated, select **Create** to create the Mobile Network, slice, and any SIM resources.
1. The Azure portal will now deploy the resources into your chosen resource group. You'll see the following confirmation screen when your deployment is complete.

    :::image type="content" source="media/pmn-deployment-complete.png" alt-text="Screenshot of the Azure portal. It shows confirmation of the successful creation of a private mobile network.":::

1. Select **Go to resource group**, and then check that your new resource group contains the correct **Mobile Network** and **Slice** resources. It may also contain the following, depending on the choices you made during the procedure.

    - A **SIM group** resource (if you provisioned SIMs).
    - **Service**, **SIM Policy**, and **Data Network** resources (if you decided to use the default service and SIM policy).

    :::image type="content" source="media/pmn-deployment-resource-group.png" alt-text="Screenshot of the Azure portal showing a resource group containing Mobile Network, SIM, SIM group, Service, SIM policy, Data Network, and Slice resources.":::

## Next steps

You can begin designing policy control to determine how your private mobile network will handle traffic, create more network slices, or start adding sites to your private mobile network.

- [Learn more about designing the policy control configuration for your private mobile network](policy-control.md)
- [Create and manage network slices](create-manage-network-slices.md)
- [Collect the required information for a site](collect-required-information-for-a-site.md)

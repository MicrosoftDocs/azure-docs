---
author: alkohli
ms.service: databox  
ms.topic: include
ms.date: 06/29/2022
ms.author: alkohli
---

To create a management resource for a device ordered through the Azure Edge Hardware Center, do these steps:

1. Use your Microsoft Azure credentials to sign in to the Azure portal at this URL: [https://portal.azure.com](https://portal.azure.com).

1. There are two ways to get started creating a new management resource:

    - Through the Azure Edge Hardware Center: Search for and select **Azure Edge Hardware Center**. In the Hardware Center, display **All order items**. Select the item **Name**. In the item **Overview**, select **Configure hardware**.
    
       The **Configure hardware** option appears after a device is shipped. 

       ![Illustration showing 4 steps to start management resource creation from an order item in the Azure Edge Hardware Center.](media/azure-edge-hardware-center-create-management-resource/create-management-resource-01-a.png#lightbox) 
    
    - In Azure Stack Edge: Search for and select **Azure Stack Edge**. Select **+ Create**. Then select **Create management resource**.
    
       ![Illustration showing 3 steps to start management resource creation in Azure Stack Edge.](media/azure-edge-hardware-center-create-management-resource/create-management-resource-01-b.png#lightbox) 

    The **Create management resource** wizard opens.

1. On the **Basics** tab, enter the following settings:

    |Setting                                  |Value                                                                                       |
    |-----------------------------------------|--------------------------------------------------------------------------------------------|
    |**Select a subscription**<sup>1</sup>    |Select the subscription to use for the management resource.                                 |
    |**Resource group**<sup>1</sup>           |Select the resource group to use for the management resource. |
    |**Name**                                 |Provide a name for the management resource.                                                 |
    |**Deploy Azure resource in**             |Select the country or region where the metadata for the management resource will reside. The metadata can be stored in a different location than the physical device. |     

    <sup>1</sup> An organization may use different subscriptions and resource groups to order devices than they use to manage them.

    ![Screenshot of the Basics tab for Create Management Resource. The Basics tab, options, and Review Plus Create button are highlighted.](media/azure-edge-hardware-center-create-management-resource/create-management-resource-02.png)

    Select **Review + create** to continue.

1. On the **Review + create** tab, review basic settings for the management resource and the terms of use. Then select **Create**.

   If you started in Azure Stack Edge, instead of device order information, you'll see the device type listed in **Basics**. 

   ![Screenshot of Review Plus Create tab when an Azure Stack Edge management resource is started in Azure Stack Edge. The device type is highlighted in Basics.](media/azure-edge-hardware-center-create-management-resource/create-management-resource-04.png) 

    The **Create** button isn't available until all validation checks have passed.

1. When the process completes, the **Overview** pane for new resource opens.

    ![Screenshot showing a completed management resource in Azure Stack Edge.](media/azure-edge-hardware-center-create-management-resource/create-management-resource-05\.png) 

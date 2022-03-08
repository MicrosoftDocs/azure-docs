---
title: Create a zoned VMs with the Azure portal 
description: Create VMs in an availability zone with the Azure portal
author: mimckitt
ms.service: virtual-machines
ms.topic: how-to
ms.date: 03/01/2022
ms.author: mimckitt
ms.reviewer: cynthn
ms.custom: 
---

# Create virtual machines in an availability zone using the Azure portal

**Applies to:** :heavy_check_mark: Linux VMs :heavy_check_mark: Windows VMs

This article steps through using the Azure portal to create virtual machines in Azure availability zones. An [availability zone](../availability-zones/az-overview.md) is a physically separate zone in an Azure region. Use availability zones to protect your apps and data from an unlikely failure or loss of an entire datacenter.

To use availability zones, create your virtual machines in a [supported Azure region](../availability-zones/az-region.md).
### [Standard](#tab/standard)

1. Sign in to the Azure portal at https://portal.azure.com.

1. Click **Create a resource** > **Compute** > **Virtual machine**. 

3. Enter the virtual machine information. The user name and password or SSH key is used to sign in to the virtual machine.  

4. Choose a region such as East US 2 that supports availability zones. 

5. Under **Availability options**, select **Availability zone** dropdown. 

1. Under **Availability zone**, select a zone from the drop-down list.
        
4. Choose a size for the VM. Select a recommended size, or filter based on features. Confirm the size is available in the zone you want to use.

6. Finish filling in the information for your VM. When you are done, select **Review + create**.

7. Once the information is verified, select **Create**.

1. After the VM is created, you can see the availability zone listed in the **Essentials section** on the page for the VM.
---

### [Limited preview](#tab/preview)

1. Sign in to the Azure portal at https://portal.azure.com.

1. Click **Create a resource** > **Compute** > **Virtual machine**. 

1. In the **Virtual machines** page, select **Create** and then **Virtual machine**.  The **Create a virtual machine** page opens.

1. In the **Basics** tab, under **Project details**, make sure the correct subscription is selected and then choose a resource group or create a new one.

1. Under **Instance details**, type a name for the **Virtual machine name**.
1. For **Availability options**, select **Availability zone**.
1. For **Availability zone**, the drop-down defaults to *Zone 1*. If you choose multiple zones, a new VM will be created in each zone. For example, if you select all three zones, then three VMs will be created. The VM names are the original name you entered, with **-1**, **-2**, and **-3** appended to the name, depending on the zones you choose. If you want, you can edit each of the default VM names.

   :::image type="content" source="media/zones/3-vm-names.png" alt-text="Screenshot showing that there are now 3 virtual machines that will be created.":::

1. Complete the rest of the page as usual. If you want to create a load balancer, go to the **Networking** tab > **Load Balancing** > **Load balancing options**. You can choose either an Azure load balancer or an Application gateway.
   
   For a **Azure load balancer**:

   1. You can select an existing load balancer or select **Create a load balancer**.
   1. To create a new load balancer, for **Load balancer name** type a load balancer name.
   1. Select the **Type** of load balancer, either Public or Internal.
   1. Select the **Protocol**, either **TCP** or **UDP**.
   1. You can leave the default **Port** and **Backend port**, or change them if needed. The backend port you select will be opened up on the Network Security Group (NSG) of the VM.
   1. When you are done, select **Create**.
   
   For an **Application Gateway**:
   1. Select either an existing application gateway or **Create an application gateway**.
   1. To create a new gateway, type the name for the application gateway. The Application Gateway can load balance multiple applications. Consider naming the Application Gateway according to the workloads you wish to load balance, rather than specific to the virtual machine name.
   1. In **Routing rule**, type a rule name. The rule name should describe the workload you are load balancing.
   1. For HTTP load balancing, you can leave the defaults and then select **Create**. For HTTPS load balancing, you have two options:
            
        -	Upload a certificate and add the password (application gateway will manage certificate storage).For certificate name, type a friendly name for the certificate.
        - Use a key vault (application gateway will pull a defined certificate from a defined key vault). Select your **Managed identity**, **Key Vault**, and **Certificate**.
        > [!NOTE]
        > A separate subnet will be defined for Application Gateway upon creation. More details on subnet creation can be found here.

1. Leave the remaining defaults and then select the **Review + create** button at the bottom of the page.

1. On the **Create a virtual machine** page, you can see the details about the VM you are about to create. When you are ready, select **Create**.

1. If you are creating a Linux VM and the **Generate new key pair** window opens, select **Download private key and create resource**. Your key file will be download as **myKey.pem**.

1. When the deployment is finished, select **Go to resource**.
---

    
## Next steps

In this article, you learned how to create a VM in an availability zone. Learn more about [availability](availability.md) for Azure VMs.

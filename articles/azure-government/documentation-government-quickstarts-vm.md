---
title: Create a VM for Azure Government quickstart| Microsoft Docs
description: This provides a series of quickstarts for using Functions with Azure Government
services: azure-government
cloud: gov
documentationcenter: ''
author: yujhongmicrosoft
manager: zakramer

ms.assetid: fb11f60c-5a70-46a9-82a0-abb2a4f4239b
ms.service: azure-government
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: azure-government
ms.date: 10/11/2017
ms.author: yujhong

---
# Virtual Machines on Azure Government
This quickstart will help you get started using Virtual Machines on Azure Government. Using VMs with Azure Government is similar to using it with the Azure commercial platform, with a [few exceptions](documentation-government-compute.md#virtual-machines).

To learn more about Azure Virtual Machines, click [here](../virtual-machines/index.md).

## Part 1: Virtual Network

### Prerequisites
Before completing this section, you must have:

+ An active Azure Government subscription.
If you don't have an Azure Government subscription, create a [free account](https://azure.microsoft.com/overview/clouds/government/) before you begin.

### Create a new Virtual Network
1. Navigate to the [Azure Government portal](https://portal.azure.us) and login with your Azure Government credentials.
2. Click on the green + New in the upper left blade and click on Networking | Virtual Network. 

  ![createvn1](./media/documentation-government-quickstarts-vm1.png)
3. Make sure the deployment model is set to "Resource Manager" and click Create.
4. Fill out the following fields and click Create.

  >[!Note]
  > Your Subscription box will look different from below.
  >
  >

   ![createvn2](./media/documentation-government-quickstarts-vm2.png)
  
5. Navigate to "Virtual networks" from the menu on the left and click on the Virtual Network you just created. Under "Settings" click on "Subnets".

  ![createvn3](./media/documentation-government-quickstarts-vm3.png)
6. On the top left-hand corner of the page choose "Subnet" and fill out the following fields.

  ![createvn5](./media/documentation-government-quickstarts-vm5.png)
7. Click "Ok" when finished and navigate to the top left hand corner again. Click on "Gateway Subnet".

  ![createvn6](./media/documentation-government-quickstarts-vm7.png)
8. Enter the address range shown below ad click "Ok". You have now created a Virtual Network on Azure Government.

  ![createvn7](./media/documentation-government-quickstarts-vm8.png)
  
## Part 2: Virtual Machine

### Prerequisites
Before completing this section you must have:

+ An active Azure Government subscription.
If you don't have an Azure Government subscription, create a [free account](https://azure.microsoft.com/overview/clouds/government/) before you begin.
+ A Virtual Network running on Azure Government.
If you don't already have a Virtual Network, complete the "Create a new Virtual Network" section above.

### Create a new Virtual Machine

1. Navigate to the [Azure Government portal](https://portal.azure.us) and login with your Azure Government credentials.

2. Click on the green + New in the upper left corner and click on "Compute". 

3. Search for "Data science" and then click on "Data Science Virtual Machine - Windows 2016 CSP". 

  ![createvn8](./media/documentation-government-quickstarts-vm9.png)
4. Click on "Create". Then fill out the fields and click "Ok".

  >[!Note]
  > Choose a password that you will remember!
  >
  >

  ![createvn9](./media/documentation-government-quickstarts-vm10.png)
5. Open the Supported disk type dropdown box and select HDD. Click on "View All" in the options at the top right corner. Scroll down the A4_v2 size and select it. Click on Select.

  ![createvn10](./media/documentation-government-quickstarts-vm11.png)
6. On the left hand "Settings" box click on "Network" and select your Virtual Network.

  ![createvn11](./media/documentation-government-quickstarts-vm12.png)
7. Click on "Subnet" and choose the subnet that you just created. 

  ![createvn12](./media/documentation-government-quickstarts-vm13.png)
8. Click on "Public IP address" and then click on "Ok".

  ![createvn13](./media/documentation-government-quickstarts-vm14.png)
9. Now we can create the VM by clicking "Ok".

10. Once the validation step has completed click "Ok" and you should see the following screen.

  ![createvn14](./media/documentation-government-quickstarts-vm15.png)
  
The VM will now be provisioned. It will take several minutes to complete, but afterwards you will be able to connect to the VM with RDP using the public IP address.
## Next steps
For supplemental information and updates, subscribe to the [Microsoft Azure Government Blog](https://blogs.msdn.microsoft.com/azuregov/).

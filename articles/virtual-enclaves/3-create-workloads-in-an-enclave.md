---
title: Create Workloads in an Enclave on Azure Virtual Enclaves
description: Create Workloads in an Enclave on Azure Virtual Enclaves
author: aserfass-msft
ms.author: aserfass
# ms.service: Azure Virtual Enclaves
ms.topic: overview
ms.date: 01/31/2025
---

# Tutorial 3: Create Workloads in an Enclave on Azure Virtual Enclaves

Workloads are logical groups of Azure resources that you define to create and audit connections in Azure Virtual Enclaves (AVE). They also automatically inherit security posture and policies of their enclave.

In this tutorial, part three of eight, you deploy workloads into an enclave. You learn how to:

- ✅ Create several workloads in an enclave
- ✅ Provision Azure resources into workloads within enclaves
- ✅ View workloads in Azure portal

## Before you begin
In the previous [tutorial](./2-create-enclaves-within-a-community.md), you used Azure portal to create a simple enclave. If you haven't created the enclave yet, return to [Tutorial 2 - Create enclaves within a community](./2-create-enclaves-within-a-community.md).

## Create a workload using Azure Virtual Enclaves
Before creating your resources, you need to create the AVE Workload resource. Workloads are logical groups of Azure resources, similar to an Azure Resource Group, that you define to create and audit connections in Azure Virtual Enclaves.

> **Important**:
>
> This tutorial uses `myResourceGroup` as a placeholder for the resource group name. If you want to use a different name, replace `myResourceGroup` with your own resource group name.


1. In the `Azure Virtual Enclaves` page, select the `Enclaves` in the left menu.

2. On the fabrikam `Enclaves` page, select the `Enclave-WebApp` enclave that we created in [2 - Create enclaves within a community](./2-create-enclaves-within-a-community.md).

![image1.png](./media/fabrikam-enclaveBlade.png)

3. Go to the `Workloads` blade underneath the `Enclave resources` section in the left-hand menu.

4. On the Workloads page, select `Create`

![image2.png](./media/image-7019faba-4874-4063-bac7-51910ca589aa.png)

5. Enter the basic details for your Workload
   - **Enclave**: Select an existing Enclave. This value is automatically applied from `Enclave-WebApp` you were currently browsing.
   - **Workload name**: Name of the Workload for this tutorial `wl-webapp-ui`.
   - **Add**: Click to add a resource group
      - **Create new**: Click and enter the name `rg-webapp-ui` then select `Ok`
> Note:
>
> Organizations should choose a workload naming convention that makes sense for the organization. Learn more about [defining your naming convention](https://learn.microsoft.com/azure/cloud-adoption-framework/ready/azure-best-practices/resource-naming.md).

![image3.png](./media/image-f1db1ca2-2034-4b85-862e-a0f0c2649bc5.png)

6. Click `Review + create` (this skips optional resource tags), ensure the details for your Enclave are correct, and click `Create`.

7. Now, to create another workload. While the previous step is completing the deployment, open a new browser tab to the portal and **repeat Steps 4 through 6.** Once you are on the **Create a workload** page, enter these basic details for your second Workload:
   - **Enclave**: Select an existing Enclave. This value is automatically applied from `Enclave-WebApp` you were currently browsing.
   - **Workload name**: Name of the Workload for this tutorial `wl-webapp-backend`.
   - **Add**: Click to add a resource group
      - **Create new**: Click and enter the name `rg-webapp-backend` then select `Ok`

![image4.png](./media/image-5bc4c623-851f-499a-9c44-7d88402bf159.png)

8. After the two Workload resources have been created, you can view them in Azure portal.

![image5.png](./media/image-416e90f2-4e0c-4930-9de9-6269f46fb973.png)

## Clean up resources
If you need to delete your enclaves created after completing this tutorial, this can be also achieved from the Azure portal. It's best to wait until after you complete the full tutorial but if you need to, select each Workload resource `wl-webapp-ui` and `wl-webapp-backend` then select `Delete`

![image6.png](./media/image-c4f19835-8053-4f41-9fa1-00689dd251f4.png)


## Next steps
In this tutorial, you created sample workloads using Azure portal. In the [next tutorial](./4-use-service-catalog-to-create-azure-resources-in-workloads.md), you'll learn how to use the service catalog to deploy Azure resources and apps into your enclave workloads.

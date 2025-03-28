---
title: Deploy a Community on Azure Virtual Enclaves
description: Azure Virtual Enclaves Documentation
author: jadean-msft
ms.author: jadean
ms.service: Azure Virtual Enclaves
ms.topic: overview
ms.date: 01/31/2025
---

# Tutorial: Deploy a Community on Azure Virtual Enclaves

**Azure Virtual Enclaves is an Azure service that accelerates and streamlines the deployment and management of secure, isolated, and compliant cloud environments for the most sensitive mission workloads.**

Communities are isolated hub networks that can securely and logically group several Enclaves together for governance, management, and security purposes. A Community Owner can enable other Communities or on-premise networks to connect through Transit Hubs or Endpoints.

In this tutorial, part one of eight, you prepare a monitored and secure network cloud environment in the Azure Portal using Azure Virtual Enclaves. One [enclave](/docs/overview/what%20is%20an%20enclave) will contain web applications and will be made publicly accessible by routing traffic through a second DMZ Enclave with a Web Application Gateway, Web Application Firewall, and a Public IP address. This networking behavior will be made possible by creating an [Enclave Endpoint](/docs/overview/what%20is%20an%20enclave%20endpoint) for the Web App, and establishing an [Enclave Connection](/docs/overview/what%20is%20an%20enclave%20connection) between the Web App and DMZ enclaves.

You learn how to:
- ✅ Deploy a central community hub network
- ✅ Create several isolated enclave spoke networks
- ✅ Provision Azure resources into workloads within enclaves
- ✅ Utilize service catalog to quickly create apps in workloads
- ✅ Authorize and design complex business networking requirements across your community
- ✅ Monitor your community, enclaves, workloads, and other resources

## Create a community in Azure Virtual Enclaves
Before creating a community instance, you need a resource group. An Azure resource group is a logical container into which you deploy and manage Azure resources. Learn more about each of the settings of an [community](/docs/overview/what%20is%20a%20community) and [How-To Create a Community](docs/How%20To%20Guides/Create%20a%20Community%20in%20the%20Azure%20portal).

> Important
>
> This tutorial uses `myResourceGroup` as a placeholder for the resource group name. If you want to use a different name, replace `myResourceGroup` with your own resource group name.

Community deployments will take around 30-45 minutes to complete. Once it completes, open your Enclave and verify that the Status is **succeeded**.

1. In the **Azure Virtual Enclaves** page, select the **Communities** option in the left menu.

![image.png](/assets/image-1dd30188-2652-4711-bdea-c7c0e7036dc0.png)

2. On the **Communities** page, select **Create**.

3. Enter the basic details for your Community:
   - **Subscription**: Select an existing Subscription
   - **Resource Group**: `myResourceGroup`
   - **Community name**: `fabrikam`
   - **Region**: `East US`
   - **Community address space** - `10.0.0.0/16`

4. Click **Review + create**, ensure the details for your Enclave are correct, and click **Create**.

![image.png](/assets/image-4724bf17-d6af-4765-909d-d7014a5af88a.png)

5. After the Community has been created, you can view it in Azure Portal.

![image.png](/assets/image-854871e7-79ac-4a9c-8fd8-64167ffac608.png)

## Clean up resources
If you need to delete your community created after completing this tutorial, this can be also done from the Azure Portal.

![image.png](/assets/image-4ba91829-c9aa-4701-bac4-63cf449861b7.png)

## Next steps
In this tutorial, you created two sample Enclaves using Azure Portal. In the next tutorial, you'll learn how to create several workloads within your enclave.

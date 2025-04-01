---
title: Create an Azure VMware Solution on a virtual network (Public preview)
author: jjaygbay1
ms.author: jacobjaygbay
description: Learn how to create an Azure VMware Solution on an Azure virtual network to apply Azure's infrastructure and VMware expertise effectively.
ms.topic: how-to
ms.service: azure-vmware
ms.date: 03/11/2025
ms.custom: engagement-fy25
#customer intent: As a cloud administrator, I want to create an Azure VMware Solution on a virtual network so that I can leverage Azure's infrastructure and VMware expertise.
---

# Create an Azure VMware Solution on a virtual network (Public preview)

In this tutorial, you learn how to create an Azure VMware Solution on Native private cloud. This solution combines a first-party Azure VMware Solution with Azure hardware and operations to improve your experience, enhance quality, and security. This offering provides updated architecture that uses Azure Native physical network and hardware infrastructure. You get the best of both worlds by applying your existing VMware expertise, with the benefits of the entire Azure cloud to effectively and efficiently manage your workloads. This initial launch of this offering utilizes the existing AV64 SKU.

With this offering, you can directly create the Azure VMware Solution SDDC using the AV64 SKU. You're no longer required to deploy a minimum of three hosts of AV36, AV36P, or AV52 to provision a cluster with AV64.

## Prerequisites

Before you begin, these items are required to create an Azure VMware Solution on Azure virtual network private cloud:

- Enable the Azure VMware Solution Fleet RP Service Principle as described in the enable Azure VMware Solution Fleet RP service principle.
- Appropriate administrative rights and permission to create a private cloud. You must be at minimum Owner or User Access Administrator on the subscription.
- Hosts provisioned and the Microsoft.Azure VMware Solution resource provider is registered.
- Azure Virtual Network with a minimum network address space of a /22.
- The newly created Azure Virtual Network and your Azure VMware Solution on Native SDDC must be in the same Resource Group.
- Ensure you have sufficient AV64 quota allocated to your subscription in the desired region before your deployment. 
- The following preview feature flag needs to be registered under the subscription where your private cloud resides.
    - az feature register--namespace Microsoft. Network 
      --name “EnablePrivateIpPrefixAllocation”--subscription "<Subscription ID>"
    - az feature registrations create --namespace "Microsoft.AVS"--name "Early Access"--subscription "<Subscription ID>"
    - az feature registration create--namespace "Microsoft.AVS"--name "FleetGreenfield"--subscription "<Subscription ID>"

```bash
az feature register --namespace Microsoft.Network --name EnablePrivateIpPrefixAllocation
```

## Sign into the Azure portal

1. Sign in to the Azure portal.

    >[!NOTE] 
    > If you need access to the Azure US Gov portal, go to [Azure portal](https://portal.azure.us/)

1. Select **Create a resource**.

1. In the **Search services and marketplace** text box, type **Azure VMware Solution** and select it from the search results.

1. On the **Azure VMware Solution** window, select **Create**.

    The following is the information needed to deploy the private cloud from your planning phase.
    
    | Field                       | Value                                                                                                           |
    |-----------------------------|-----------------------------------------------------------------------------------------------------------------|
    | **Subscription**            | Select the subscription you plan to use for the deployment. All resources in an Azure subscription are billed together. |
    | **Resource group**          | Select the resource group for your private cloud. An Azure resource group is a logical container into which Azure resources are deployed and managed. Alternatively, you can create a new resource group for your private cloud. |
    | **Resource name**           | Provide the name of your Azure VMware Solution private cloud.                                                   |
    | **Location**                | Select a location, such as (US) East US 2. It's the region you defined during the planning phase.               |
    | **Size of host**            | Select the AV64 SKU.                                                                                            |
    | **Availability zone**       | Select which availability zone you want your private cloud deployed in.                                         |
    | **Number of hosts**         | Number of hosts allocated for the private cloud cluster. The default value is 3, which you can increase or decrease after deployment. If these nodes aren't listed as available, contact support to request a quota increase. You can also select the link labeled If you need more hosts, request a quota increase in the Azure portal. |
    | **Virtual network**         | Azure Virtual Network with a minimum network address space of a /22. This can be a new or existing Virtual Network. |
    | **Address block for private cloud** | Provide an IP address block for the private cloud. The CIDR represents the private cloud management network and is used for the cluster management services, such as vCenter Server and NSX-T Manager. Use /22 address space, for example, 10.175.0.0/22. The address should be unique and not overlap with other Azure Virtual Networks and with on-premises networks. |
    | **DNS Forward Lookup**      | Input on your DNS Forward Lookup Zone. Either Private or Public. If no option is selected, the default is Public. This can be changed after your private cloud is created. |

1. Verify the information entered, and if correct, select **Create**.

    > [!NOTE] 
    > This step takes an estimated 5+ hours. Adding a single host in an existing cluster takes an estimated +1.5 hours. If you're adding a new cluster with maximum nodes (16), it can take an estimated 4+ hours.

1. Verify that the deployment was successful. Navigate to the resource group you created and select your private cloud. You see the status of **Succeeded** when the deployment is finished.

1. Verify that the deployment was successful. Navigate to the resource group you created and select your private cloud. You see the status of Succeeded when the deployment is finished. 
1. Connect to vCenter and NSX Manager using the VMware credentials shown in your Private Cloud. For more information, see [Access an Azure VMware Solution private cloud](tutorial-access-private-cloud.md). 
---
title: Create an Azure VMware Solution Generation 2 private cloud (preview)
author: jjaygbay1
ms.author: jacobjaygbay
description: Learn how to create an Azure VMware Solution Generation 2 Private Cloud to apply Azure's infrastructure and VMware expertise effectively.
ms.topic: how-to
ms.service: azure-vmware
ms.date: 4/21/2025
ms.custom: engagement-fy25
#customer intent: As a cloud administrator, I want to create an Azure VMware Solution Generation 2 Private Cloud so that I can leverage Azure's infrastructure and VMware expertise.
# Customer intent: "As a cloud administrator, I want to create an Azure VMware Solution Generation 2 private cloud so that I can efficiently utilize Azure's infrastructure and VMware capabilities to enhance network performance and security."
---

# Create an Azure VMware Solution Generation 2 Private Cloud (preview)

In this tutorial, you learn how to create an Azure VMware Solution Generation 2 (Gen 2) private cloud. This solution combines the first-party Azure VMware Solution with Azure hardware and network to simplify your networking architecture, and enhance performance and security. This initial launch of this generation utilizes the AV64 SKU.

With this generation, you can directly create the private cloud using the AV64 SKU. You are no longer required to deploy a minimum of three hosts of AV36, AV36P, or AV52 to provision a cluster with AV64.

## Prerequisites

Before you begin, these items are required to create an Azure VMware Solution Gen 2 private cloud:

- Enable the Azure VMware Solution Fleet Rp Service Principal as described in the [enable Azure VMware Solution Fleet Rp service Principal](native-first-party-principle-security.md).
- Ensure you have appropriate administrative rights and permission to create a private cloud. You must be at minimum Owner or User Access Administrator on the subscription.
- Hosts provisioned and the "Microsoft.AVS" resource provider is registered.
- Deploy or use an existing Azure Virtual Network with a minimum network address space of a /22 or four /24s.
- The newly created Azure Virtual Network and your Azure VMware Solution Gen 2 private cloud must be in the same Resource Group.
- Ensure you have sufficient AV64 quota allocated to your subscription in the desired region before your deployment. 
- The following Preview feature flags need to be registered under the subscription where your private cloud will reside. These commands can be run using Azure Cloud Shell. 

```bash
az feature register --namespace "Microsoft.Network" --name "EnablePrivateIpPrefixAllocation"  --subscription "<Subscription ID>"
```

```bash
az feature registration create --namespace "Microsoft.AVS" --name "EarlyAccess"  --subscription "<Subscription ID>"
```

```bash
az feature registration create --namespace "Microsoft.AVS" --name "FleetGreenfield" --subscription "<Subscription ID>" 
```

## Deployment Steps

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
    | **Virtual Network**         | Azure Virtual Network with a minimum network address space of a /22 or 4 /24s. This can be a new or existing Virtual Network. |
    | **Address block for private cloud** | Provide an IP address block for the private cloud. The CIDR represents the private cloud management network and is used for the cluster management services, such as vCenter Server and NSX-T Manager. Use /22 address space, for example, 10.175.0.0/22. The address should be unique and not overlap with other Azure Virtual Networks and with on-premises networks. |
    | **DNS Forward Lookup**      | Input on your DNS Forward Lookup Zone. Either Private or Public. If no option is selected, the default is Public. This can be changed after your private cloud is created. |

1. Verify the information entered, and if correct, select **Create**.

    > [!NOTE] 
    > This step takes an estimated 5+ hours. Adding a single host in an existing cluster takes an estimated +1.5 hours. If you're adding a new cluster with maximum nodes (16), it can take an estimated 4+ hours.

1. Verify that the deployment was successful. Navigate to the resource group you created and select your private cloud. You see the status of **Succeeded** when the deployment is finished.

1. Verify that the deployment was successful. Navigate to the resource group you created and select your private cloud. You see the status of Succeeded when the deployment is finished. 
1. Connect to vCenter Server and NSX Manager using the VMware credentials shown in your Private Cloud. For more information, see [Access an Azure VMware Solution private cloud](tutorial-access-private-cloud.md). 

## Next steps
  
- Learn more about [Azure VMware Solution Gen 2 private cloud design considerations](native-network-design-consideration.md)

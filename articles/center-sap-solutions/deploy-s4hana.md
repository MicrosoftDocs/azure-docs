---
title: Deploy S/4HANA infrastructure (preview)
description: Learn how to deploy S/4HANA infrastructure with Azure Center for SAP solutions (ACSS) through the Azure portal. You can deploy High Availability (HA), non-HA, and single-server configurations.
ms.service: azure-center-sap-solutions
ms.topic: how-to
ms.date: 07/19/2022
ms.author: ladolan
author: lauradolan
#Customer intent: As a developer, I want to deploy S/4HANA infrastructure using Azure Center for SAP solutions so that I can manage SAP workloads in the Azure portal.
---

# Deploy S/4HANA infrastructure with Azure Center for SAP solutions (preview)

[!INCLUDE [Preview content notice](./includes/preview.md)]

In this how-to guide, you'll learn how to deploy S/4HANA infrastructure in *Azure Center for SAP solutions (ACSS)*. There are [three deployment options](#deployment-types): distributed with High Availability (HA), distributed non-HA, and single server. 

## Prerequisites

- An Azure subscription.
- Register the **Microsoft.Workloads** Resource Provider on the subscription in which you are deploying the SAP system.
- An Azure account with **Contributor** role access to the subscriptions and resource groups in which you'll create the Virtual Instance for SAP solutions (VIS) resource.
- The ACSS application **Azure SAP Workloads Management** also needs Contributor role access to the resource groups for the SAP system. There are two options to grant access:
    - If your Azure account has **Owner** or **User Access Admin** role access, you can automatically grant access to the application when deploying or registering the SAP system.
    - If your Azure account doesn't have Owner or User Access Admin role access, you must enable access for the ACSS application. 
- A [network set up for your infrastructure deployment](prepare-network.md).

## Deployment types

There are three deployment options that you can select for your infrastructure, depending on your use case.

- **Distributed with High Availability (HA)** creates distributed HA architecture. This option is recommended for production environments. If you choose this option, you need to select a **High Availability SLA**. Select the appropriate SLA for your use case:
    - **99.99% (Optimize for availability)** shows available zone pairs for VM deployment. The first zone is primary and the next is secondary. Active ASCS and Database servers are deployed in the primary zone. Passive ASCS and Database servers are deployed in the secondary zone. Application servers are deployed evenly across both zones. This option isn't shown in regions without availability zones, or without at least one M-series and E-series VM SKU available in the zonal pairs within that region.
    - **99.95% (Optimize for cost)** shows three availability sets for all instances. The HA ASCS cluster is deployed in the first availability set. All Application servers are deployed across the second availability set. The HA Database server is deployed in the third availability set. No availability zone names are shown.
- **Distributed** creates distributed non-HA architecture. 
- **Single Server** creates architecture with a single server. This option is available for non-production environments only.
## Create deployment

1. Sign in to the [Azure portal](https://portal.azure.com).

1. In the search bar, enter and select **Azure Center for SAP solutions**.

1. On the ACSS landing page, select **Create a new SAP system**.

1. On the **Create Virtual Instance for SAP solutions** page, on the **Basics** tab, fill in the details for your project.

    1. For **Subscription**, select the Azure subscription into which you're deploying the infrastructure.

    1. For **Resource group**, select the resource group for all resources that the VIS creates.

1. Under **Instance details**, enter the details for your SAP instance.

    1. For **Name** enter the three-character SAP system identifier (SID). The VIS uses the same name as the SID.

    1. For **Region**, select the Azure region into which you're deploying the resources.

    1. For **Environment type**, select whether your environment is production or non-production. If you select **Production**, you can deploy a distributed HA or non-HA S/4HANA system. It's recommended to use distributed HA deployments for production systems. If you select **Non-production**, you can use a single-server deployment.

    1. For **SAP product**, keep the selection as **S/4HANA**.

    1. For **Database**, keep the selection as **HANA**.

    1. For **HANA scale method**, keep the selection as **Scale up**.

    1. For **Deployment type**, [select and configure your deployment type](#deployment-types).

    1. For **Network**, create the [network you created previously with subnets](prepare-network.md).

    1. For **Application subnet** and **Database subnet**, map the IP address ranges as required. It's recommended to use a different subnet for each deployment.

1. Under **Operating systems**, enter the OS details.

    1. For **Application OS image**, select the OS image for the application server.

    1. For **Database OS image**, select the OS image for the database server.

1. Under **Administrator account**, enter your administrator account details.

    1. For **Authentication type**, keep the setting as **SSH public**.

    1. For **Username**, enter a username.

    1. For **SSH public key source**, select a source for the public key. You can choose to generate a new key pair, use an existing key stored in Azure, or use an existing public key stored on your local computer. If you don't have keys already saved, it's recommended to generate a new key pair.

    1. For **Key pair name**, enter a name for the key pair.
    
    1. If you choose to use an **Existing public key stored in azure**, select the key in **Stored Keys** input
    
    1. Provide the corresponding SSH private key from **local file** stored on your computer or **copy paste** the private key.
    
    1. If you choose to use an **Existing public key**, you can either Provide the SSH public key from **local file** stored on your computer or **copy paste** the public key.
    
    1. Provide the corresponding SSH private key from **local file** stored on your computer or **copy paste** the private key.
   
1. Under **Configuration Details**, enter the FQDN for you SAP System .

    1. For **SAP FQDN**, provide FQDN for you system such "sap.contoso.com"

1. Select **Next: Virtual machines**.

1. In the **Virtual machines** tab, generate SKU size and total VM count recommendations for each SAP instance from ACSS. 

    1. For **Generate Recommendation based on**, under **Get virtual machine recommendations**, select **SAP Application Performance Standard (SAPS)**.

    1. For **SAPS for application tier**, provide the total SAPS for the application tier. For example, 30,000.

    1. For **Memory size for database (GiB)**, provide the total memory size required for the database tier. For example, 1024. The value must be greater than zero, and less than or equal to 11,400.
    
    1. Select **Generate Recommendation**.

    1. Review the VM size and count recommendations for ASCS, Application Server, and Database instances. 

    1. To change a SKU size recommendation, select the drop-down menu or select **See all sizes**. Filter the list or search for your preferred SKU.

    1. To change the Application server count, enter a new count for **Number of VMs** under **Application virtual machines**.
    
        The number of VMs for ASCS and Database instances aren't editable. The default number for each is **2**.

        ACSS automatically configures a database disk layout for the deployment. To view the layout for a single database server, make sure to select a VM SKU. Then, select **View disk configuration**. If there's more than one database server, the layout applies to each server. 

    1. Select **Next: Tags**.

1. Optionally, enter tags to apply to all resources created by the ACSS process. These resources include the VIS, ASCS instances, Application Server instances, Database instances, VMs, disks, and NICs.

1. Select **Review + Create**.

1. Review your settings before deployment. 

    1. Make sure the validations have passed, and there are no errors listed.

    1. Review the Terms of Service, and select the acknowledgment if you agree.

    1. Select **Create**.

1. Wait for the infrastructure deployment to complete. Numerous resources are deployed and configured. This process takes approximately 7 minutes.

## Confirm deployment

To confirm a deployment is successful:

1. In the [Azure portal](https://portal.azure.com), search for and select **Virtual Instances for SAP solutions**.

1. On the **Virtual Instances for SAP solutions** page, select the **Subscription** filter, and choose the subscription where you created the deployment.

1. In the table of records, find the name of the VIS. The **Infrastructure** column value shows **Deployed** for successful deployments.

If the deployment fails, delete the VIS resource in the Azure portal, then recreate the infrastructure. 

## Next steps

- [Install SAP software on your infrastructure](install-software.md)

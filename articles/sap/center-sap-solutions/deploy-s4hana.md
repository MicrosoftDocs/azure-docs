---
title: Deploy S/4HANA infrastructure
description: Learn how to deploy S/4HANA infrastructure with Azure Center for SAP solutions through the Azure portal. You can deploy High Availability (HA), non-HA, and single-server configurations.
ms.service: sap-on-azure
ms.subservice: center-sap-solutions
ms.topic: how-to
ms.date: 02/22/2023
ms.author: sagarkeswani
author: sagarkeswani
#Customer intent: As a developer, I want to deploy S/4HANA infrastructure using Azure Center for SAP solutions so that I can manage SAP workloads in the Azure portal.
---

# Deploy S/4HANA infrastructure with Azure Center for SAP solutions





In this how-to guide, you'll learn how to deploy S/4HANA infrastructure in *Azure Center for SAP solutions*. There are [three deployment options](#deployment-types): distributed with High Availability (HA), distributed non-HA, and single server. 

## Prerequisites

- An Azure [subscription](/azure/cost-management-billing/manage/create-subscription#create-a-subscription)
- [Register](/azure/azure-resource-manager/management/resource-providers-and-types#azure-portal) the **Microsoft.Workloads** Resource Provider on the subscription in which you are deploying the SAP system.
- An Azure account with **Contributor** [role](/azure/role-based-access-control/role-assignments-portal-subscription-admin) access to the subscriptions and resource groups in which you'll create the Virtual Instance for SAP solutions (VIS) resource.
- A **User-assigned managed** [identity](/azure/active-directory/managed-identities-azure-resources/how-manage-user-assigned-managed-identities?pivots=identity-mi-methods-azp#create-a-user-assigned-managed-identity) which has Contributor role access on the Subscription or atleast all resource groups (Compute, Network,Storage). If you wish to install SAP Software through the Azure Center for SAP solutions, also provide Storage Blob data Reader, Reader and Data Access roles to the identity on SAP bits storage account where you would store the SAP Media.
- A [network set up for your infrastructure deployment](prepare-network.md).
- Availability of minimum 4 cores of either Standard_D4ds_v4 or Standard_E4s_v3 SKUS which will be used during Infrastructure deployment and Software Installation
- [Review the quotas for your Azure subscription](../../quotas/view-quotas.md). If the quotas are low, you might need to create a support request before creating your infrastructure deployment. Otherwise, you might experience deployment failures or an **Insufficient quota** error. 
- Note the SAP Application Performance Standard (SAPS) and database memory size that you need to allow Azure Center for SAP solutions to size your SAP system. If you're not sure, you can also select the VMs. There are:
    - A single or cluster of ASCS VMs, which make up a single ASCS instance in the VIS.
    - A single or cluster of Database VMs, which make up a single Database instance in the VIS.
    - A single Application Server VM, which makes up a single Application instance in the VIS. Depending on the number of Application Servers being deployed or registered, there can be multiple application instances.


## Deployment types

There are three deployment options that you can select for your infrastructure, depending on your use case.

- **Distributed with High Availability (HA)** creates distributed HA architecture. This option is recommended for production environments. If you choose this option, you need to select a **High Availability SLA**. Select the appropriate SLA for your use case:
    - **99.99% (Optimize for availability)** shows available zone pairs for VM deployment. The first zone is primary and the next is secondary. Active ASCS and Database servers are deployed in the primary zone. Passive ASCS and Database servers are deployed in the secondary zone. Application servers are deployed evenly across both zones. This option isn't shown in regions without availability zones, or without at least one M-series and E-series VM SKU available in the zonal pairs within that region.
    - **99.95% (Optimize for cost)** shows three availability sets for all instances. The HA ASCS cluster is deployed in the first availability set. All Application servers are deployed across the second availability set. The HA Database server is deployed in the third availability set. No availability zone names are shown.
- **Distributed** creates distributed non-HA architecture. 
- **Single Server** creates architecture with a single server. This option is available for non-production environments only.

## Supported software

Azure Center for SAP solutions supports the following SAP software versions: S/4HANA 1909 SPS 03, S/4HANA 2020 SPS 03, and S/4HANA 2021 ISS 00.

The following operating system (OS) software versions are compatible with these SAP software versions:

| Publisher | Image and Image Version | Supported SAP Software Version |
| --------- | ----------------------- | ------------------------------ |
| Red Hat | Red Hat Enterprise Linux 8.6 for SAP Applications - x64 Gen2 latest | S/4HANA 1909 SPS 03, S/4HANA 2020 SPS 03, S/4HANA 2021 ISS 00, S/4HANA 2022 ISS 00 | 
| Red Hat | Red Hat Enterprise Linux 8.4 for SAP Applications - x64 Gen2 latest | S/4HANA 1909 SPS 03, S/4HANA 2020 SPS 03, S/4HANA 2021 ISS 00, S/4HANA 2022 ISS 00 | 
| Red Hat | Red Hat Enterprise Linux 8.2 for SAP Applications - x64 Gen2 latest | S/4HANA 1909 SPS 03, S/4HANA 2020 SPS 03, S/4HANA 2021 ISS 00, S/4HANA 2022 ISS 00 | 
| SUSE | SUSE Linux Enterprise Server (SLES) for SAP Applications 15 SP4 - x64 Gen2 latest | S/4HANA 1909 SPS 03, S/4HANA 2020 SPS 03, S/4HANA 2021 ISS 00, S/4HANA 2022 ISS 00 | 
| SUSE | SUSE Linux Enterprise Server (SLES) for SAP Applications 15 SP3 - x64 Gen2 latest | S/4HANA 1909 SPS 03, S/4HANA 2020 SPS 03, S/4HANA 2021 ISS 00, S/4HANA 2022 ISS 00 | 
| SUSE | SUSE Linux Enterprise Server (SLES) for SAP Applications 12 SP5 - x64 Gen2 latest | S/4HANA 1909 SPS 03 |
| SUSE | SUSE Linux Enterprise Server (SLES) for SAP Applications 12 SP4 - x64 Gen2 latest | S/4HANA 1909 SPS 03 |

- You can use `latest` if you want to use the latest image and not a specific older version. If the *latest* image version is newly released in marketplace and has an unforeseen issue, the deployment may fail. If you are using Portal for deployment, we recommend choosing a different image *sku train* (e.g. 12-SP4 instead of 15-SP3) till the issues are resolved. However, if deploying via API/CLI, you can provide any other *image version* which is available. To view and select the available image versions from a publisher, use below commands


    ```Powershell
    Get-AzVMImage -Location $locName -PublisherName $pubName -Offer $offerName -Sku $skuName | Select Version
    
    where, for example
    $locName="eastus"
    $pubName="RedHat"
    $offerName="RHEL-SAP-HA"
    $skuName="82sapha-gen2"
    ```
  
## Create deployment

1. Sign in to the [Azure portal](https://portal.azure.com).

1. In the search bar, enter and select **Azure Center for SAP solutions**.

1. On the Azure Center for SAP solutions landing page, select **Create a new SAP system**.

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

    1. For **Application subnet** and **Database subnet**, map the IP address ranges as required. It's recommended to use a different subnet for each deployment. The names including AzureFirewallSubnet, AzureFirewallManagementSubnet, AzureBastionSubnet and GatewaySubnet are reserved names within Azure. Please do not use these as the subnet names.

1. Under **Operating systems**, enter the OS details.

    1. For **Application OS image**, select the OS image for the application server.

    1. For **Database OS image**, select the OS image for the database server.

1. Under **Administrator account**, enter your administrator account details.

    1. For **Authentication type**, keep the setting as **SSH public**.

    1. For **Username**, enter an SAP administrator username.

    1. For **SSH public key source**, select a source for the public key. You can choose to generate a new key pair, use an existing key stored in Azure, or use an existing public key stored on your local computer. If you don't have keys already saved, it's recommended to generate a new key pair.

    1. For **Key pair name**, enter a name for the key pair.
    
    1. If you choose to use an **Existing public key stored in azure**, select the key in **Stored Keys** input
    
    1. Provide the corresponding SSH private key from **local file** stored on your computer or **copy paste** the private key.
    
    1. If you choose to use an **Existing public key**, you can either Provide the SSH public key from **local file** stored on your computer or **copy paste** the public key.
    
    1. Provide the corresponding SSH private key from **local file** stored on your computer or **copy paste** the private key.

1. Under **SAP Transport Directory**, enter how you want to set up the transport directory on this SID. This is applicable for Distributed with High Availability and Distributed deployments only.

    1. For **SAP Transport Options**, you can choose to **Create a new SAP transport Directory** or **Use an existing SAP transport Directory** or completely skip the creation of transport directory by choosing **Don't include SAP transport directory** option. Currently, only NFS on AFS storage account fileshares is supported.

    1. If you choose to **Create a new SAP transport Directory**, this will create and mount a new transport fileshare on the SID. By Default, this option will create an NFS on AFS storage account and a transport fileshare in the resource group where SAP system will be deployed. However, you can choose to create this storage account in a different resource group by providing the resource group name in **Transport Resource Group**. You can also provide a custom name for the storage account to be created under **Storage account name** section. Leaving the **Storage account name** will create the storage account with service default name **""SIDname""nfs""random characters""** in the chosen transport resource group. Creating a new transport directory will create a ZRS based replication for zonal deployments and LRS based replication for non-zonal deployments. If your region doesn't support ZRS replication deploying a zonal VIS will lead to a failure. In such cases, you can deploy a transport fileshare outside ACSS with ZRS replication and then create a zonal VIS where you select **Use an existing SAP transport Directory** to mount the pre-created fileshare.
   
    1. If you choose to **Use an existing SAP transport Directory**, select the pre - existing NFS fileshare under **File share name** option. The existing transport fileshare will be only mounted on this SID. The selected fileshare shall be in the same region as that of SAP system being created. Currently, file shares existing in a different region cannot be selected. Provide the associated private endpoint of the  storage account where the selected fileshare exists under **Private Endpoint** option.
    
    1. You can skip the creation of transport file share by selecting **Don't include SAP transport directory** option. The transport fileshare will neither be created or mounted for this SID.
    
1. Under **Configuration Details**, enter the FQDN for your SAP System.

    1. For **SAP FQDN**, provide only the domain name for your system such "sap.contoso.com"

1. Under **User assigned managed identity**, provide the identity which Azure Center for SAP solutions will use to deploy infrastructure.

    1. For **Managed identity source**, choose if you want the service to create a new managed identity or you can instead use an existing identity. If you wish to allow the service to create a managed identity, acknowledge the checkbox which asks for your consent for the identity to be created and the contributor role access to be added for all resource groups.

    1. For **Managed identity name**, enter a name for a new identity you want to create or select an existing identity from the drop down menu. If you are selecting an existing identity, it should have **Contributor** role access on the Subscription or on Resource Groups related to this SAP system you are trying to deploy. That is, it requires Contributor access to the SAP application Resource Group, Virtual Network Resource Group and Resource Group which has the existing SSHKEY. If you wish to later install the SAP system using ACSS, we also recommend giving the **Storage Blob Data Reader and Reader** and **Data Access roles** on the Storage Account which has the SAP software media.

1. Select **Next: Virtual machines**.

1. In the **Virtual machines** tab, generate SKU size and total VM count recommendations for each SAP instance from Azure Center for SAP solutions. 

    1. For **Generate Recommendation based on**, under **Get virtual machine recommendations**, select **SAP Application Performance Standard (SAPS)**.

    1. For **SAPS for application tier**, provide the total SAPS for the application tier. For example, 30,000.

    1. For **Memory size for database (GiB)**, provide the total memory size required for the database tier. For example, 1024. The value must be greater than zero, and less than or equal to 11,400.
    
    1. Select **Generate Recommendation**.

    1. Review the VM size and count recommendations for ASCS, Application Server, and Database instances. 

    1. To change a SKU size recommendation, select the drop-down menu or select **See all sizes**. Filter the list or search for your preferred SKU.

    1. To change the Application server count, enter a new count for **Number of VMs** under **Application virtual machines**.
    
        The number of VMs for ASCS and Database instances aren't editable. The default number for each is **2**.

        Azure Center for SAP solutions automatically configures a database disk layout for the deployment. To view the layout for a single database server, make sure to select a VM SKU. Then, select **View disk configuration**. If there's more than one database server, the layout applies to each server. 

1. Select **Next: Visualize Architecture**.

1. In the **Visualize Architecture** tab, visualize the architecture of the VIS that you're deploying.

    1. To view the visualization, make sure to configure all the inputs listed on the tab.

    1. Optionally, click and drag resources or containers to move them around visually.

    1. Click on **Reset** to reset the visualization to its default state. That is, revert any changes you may have made to the position of resources or containers.

    1. Click on **Scale to fit** to reset the visualization to its default zoom level.

    1. Click on **Zoom in** to zoom into the visualization.

    1. Click on **Zoom out** to zoom out of the visualization.

    1. Click on **Download JPG** to export the visualization as a JPG file.

    1. Click on **Feedback** to share your feedback on the visualization experience.

        The visualization doesn't represent all resources for the VIS that you're deploying, for instance it doesn't represent disks and NICs.

    1. Select **Next: Tags**.

1. Optionally, enter tags to apply to all resources created by the Azure Center for SAP solutions process. These resources include the VIS, ASCS instances, Application Server instances, Database instances, VMs, disks, and NICs.

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

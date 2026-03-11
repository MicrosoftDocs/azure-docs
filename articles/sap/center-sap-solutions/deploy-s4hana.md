---
title: Deploy an S/4HANA infrastructure
description: Learn how to deploy S/4HANA infrastructure with Azure Center for SAP solutions through the Azure portal with High Availability (HA), non-HA, and single-server configurations.
ms.service: sap-on-azure
ms.subservice: center-sap-solutions
ms.topic: how-to
ms.date: 03/10/2026
ms.author: sagarkeswani
author: sagarkeswani
#Customer intent: As a developer, I want to deploy S/4HANA infrastructure using Azure Center for SAP solutions so that I can manage SAP workloads in the Azure portal.
# Customer intent: As an IT administrator, I want to deploy S/4HANA infrastructure options using Azure Center for SAP solutions through the Azure portal, so that I can efficiently manage my SAP workloads in a reliable and scalable environment.
---

# Deploy S/4HANA infrastructure with Azure Center for SAP solutions

This article describes how to deploy S/4HANA infrastructure in *Azure Center for SAP solutions*. There are three [deployment options](#deployment-types):

* Distributed with High Availability (HA)
* Distributed without HA
* Single Server

## Prerequisites

- An Azure [subscription](/azure/cost-management-billing/manage/create-subscription#create-a-subscription).

- [Register](/azure/azure-resource-manager/management/resource-providers-and-types#azure-portal) the **Microsoft.Workloads** Resource Provider on the subscription in which you're deploying the SAP system.

- An Azure account with **Contributor** [role](/azure/role-based-access-control/role-assignments-portal-subscription-admin) access to the subscriptions and resource groups in which you create the Virtual Instance for SAP solutions (VIS) resource.

- A **User-assigned managed** [identity](/azure/active-directory/managed-identities-azure-resources/how-manage-user-assigned-managed-identities?pivots=identity-mi-methods-azp#create-a-user-assigned-managed-identity) that has **Contributor** role access on the subscription, or at least all resource groups (Compute, Network, and Storage). If you wish to install SAP Software through the Azure Center for SAP solutions, provide the following roles to the identity on SAP bits storage account where you would store the SAP Media:

  - **Storage Blob Data Reader**

  - **Reader and Data Access**

- A [network set up for your infrastructure deployment](prepare-network.md).

- A four-core vCPU SKU minimum of either *Standard_D4ds_v4* or *Standard_E4s_v3* used during Infrastructure deployment and software installation.

- [Review the quotas for your Azure subscription](/azure/quotas/view-quotas). If the quotas are low, you might need to create a support request before creating your infrastructure deployment. Otherwise, you might experience deployment failures or an **Insufficient quota** error.

- Note the SAP Application Performance Standard (SAPS) and database memory size that you need to allow Azure Center for SAP solutions to size your SAP system. If you're not sure, you can also select the virtual machines (VMs). There are:

  - A single or cluster of Advanced Business Application Programming Central Services (ASCS) VMs, which make up a single ASCS instance in the VIS.
  - A single or cluster of Database VMs, which make up a single Database instance in the VIS.
  - A single Application Server VM, which makes up a single Application instance in the VIS. Depending on the number of Application Servers being deployed or registered, there can be multiple application instances.

## Deployment types

There are three deployment options that you can select for your infrastructure, depending on your use case.

- **Distributed with High Availability (HA)** creates distributed HA architecture. This option is recommended for production environments. If you choose this option, you need to select a **High Availability SLA**. Select the appropriate Service Level Agreement (SLA) for your use case:

  - **99.99% (optimize for availability)** shows available zone pairs for VM deployment. The first zone is primary and the next is secondary. Active ASCS and Database servers are deployed in the primary zone. Passive ASCS and Database servers are deployed in the secondary zone. Application servers are deployed evenly across both zones. This option isn't shown in regions without availability zones. It also isn't shown without at least one M-series and E-series VM SKU available in the zonal pairs within that region.

  - **99.95% (optimize for cost)** shows three availability sets for all instances. The HA ASCS cluster is deployed in the first availability set. All Application servers are deployed across the second availability set. The HA Database server is deployed in the third availability set. No availability zone names are shown.

- **Distributed** creates distributed non-HA architecture.

- **Single Server** creates architecture with a single server. This option is available for nonproduction environments only.

## Supported software

Azure Center for SAP solutions supports the following SAP software versions: S/4HANA 1909 ISS 00, S/4HANA 2020 ISS 00, S/4HANA 2021 ISS 00, and S/4HANA 2022 ISS 00.

The following operating system (OS) software versions are compatible with these SAP software versions:

| Publisher | Image and Image Version | Supported SAP Software Version |
| --------- | ----------------------- | ------------------------------ |
| Red Hat | Red Hat Enterprise Linux 8.6 for SAP Applications - x64 Gen2 latest | S/4HANA 1909 ISS 00, S/4HANA 2020 ISS 00, S/4HANA 2021 ISS 00, S/4HANA 2022 ISS 00 |
| Red Hat | Red Hat Enterprise Linux 8.4 for SAP Applications - x64 Gen2 latest | S/4HANA 1909 ISS 00, S/4HANA 2020 ISS 00, S/4HANA 2021 ISS 00, S/4HANA 2022 ISS 00 |
| SUSE | SUSE Linux Enterprise Server (SLES) for SAP Applications 15 SP4 - x64 Gen2 latest | S/4HANA 1909 ISS 00, S/4HANA 2020 ISS 00, S/4HANA 2021 ISS 00, S/4HANA 2022 ISS 00 |
| SUSE | SUSE Linux Enterprise Server (SLES) for SAP Applications 15 SP3 - x64 Gen2 latest | S/4HANA 1909 ISS 00, S/4HANA 2020 ISS 00, S/4HANA 2021 ISS 00, S/4HANA 2022 ISS 00 |
| SUSE | SUSE Linux Enterprise Server (SLES) for SAP Applications 12 SP5 - x64 Gen2 latest | S/4HANA 1909 ISS 00 |

- You can use `latest` if you want to use the latest image and not a specific older version. If the *latest* image version is newly released in marketplace and has an unforeseen issue, the deployment might fail. If you're using Portal for deployment, we recommend choosing a different image *SKU train* (for example, 12-SP4 instead of 15-SP3) until the issues are resolved. However, if deploying via API/CLI, you can provide any other image version that's available. To view and select the available image versions from a publisher, run the following command:

  ```azurepowershell
  Get-AzVMImage -Location $locName -PublisherName $pubName -Offer $offerName -Sku $skuName | Select Version

  # Use your own values
  $locName="eastus"
  $pubName="RedHat"
  $offerName="RHEL-SAP-HA"
  $skuName="84sapha-gen2"
  ```

- Azure Center for SAP solutions now supports deployment of SAP system VMs with custom OS images along with Azure Marketplace images. For deployment using custom OS images, follow the steps [here](deploy-s4hana.md#use-a-custom-os-image).

## Create a deployment

1. Sign in to the [Azure portal](https://portal.azure.com).

1. In the search bar, enter and select **Azure Center for SAP solutions**.

1. On the Azure Center for SAP solutions landing page, select **Create a new SAP system**.

1. On the **Create Virtual Instance for SAP solutions** page, on the **Basics** tab, fill in the details for your project.

   1. For **Subscription**, select the Azure subscription into which you're deploying the infrastructure.

   1. For **Resource group**, select the resource group for all resources that the VIS creates.

1. Under **Instance details**, enter the details for your SAP instance.

   1. For **Name** enter the three-character SAP system identifier (SID). The VIS uses the same name as the SID.

   1. For **Region**, select the Azure region into which you're deploying the resources.

   1. For **Environment type**, select whether your environment is production or nonproduction. If you select **Production**, you can deploy a distributed HA or non-HA S/4HANA system. We recommend you use distributed HA deployments for production systems. If you select **Non-production**, you can use a single-server deployment.

   1. For **SAP product**, keep the selection as **S/4HANA**.

   1. For **Database**, keep the selection as **HANA**.

   1. For **HANA scale method**, keep the selection as **Scale up**.

   1. For **Deployment type**, [select and configure your deployment type](#deployment-types).

   1. For **Network**, create the [network you created previously with subnets](prepare-network.md).

   1. For **Application subnet** and **Database subnet**, map the IP address ranges as required. We recommend you use a different subnet for each deployment. The names including `AzureFirewallSubnet`, `AzureFirewallManagementSubnet`, `AzureBastionSubnet`, and `GatewaySubnet` are reserved names within Azure. Don't use these names as the subnet names.

1. Under **Operating systems**, select the source of the image.

1. If you're using Azure Marketplace OS images, use these settings:

   1. For **Application OS image**, select the OS image for the application server.

   1. For **Database OS image**, select the OS image for the database server.

   1. If you're using [custom OS images](deploy-s4hana.md#use-a-custom-os-image), use these settings:

      1. For **Application OS image**, select the image version from the Azure Compute Gallery.

      1. For **Database OS image**, select the image version from the Azure Compute Gallery.

1. Under **Administrator account**, enter your administrator account details.

   1. For **Authentication type**, keep the setting as **SSH public**.

   1. For **Username**, enter an SAP administrator username.

   1. For **SSH public key source**, select a source for the public key. You can choose to generate a new key pair, use an existing key stored in Azure, or use an existing public key stored on your local computer. If you don't have keys already saved, we recommend you generate a new key pair.

   1. For **Key pair name**, enter a name for the key pair.

   1. If you choose to use an **Existing public key stored in azure**, select the key in **Stored Keys** input

   1. Provide the corresponding SSH private key from **local file** stored on your computer or **copy paste** the private key.

   1. If you choose to use an **Existing public key**, you can either Provide the SSH public key from **local file** stored on your computer or **copy paste** the public key.

   1. Provide the corresponding SSH private key from **local file** stored on your computer or **copy paste** the private key.

1. Under **SAP Transport Directory**, enter how you want to set up the transport directory on this SID (applicable for Distributed with HA and Distributed deployments only).

   1. For **SAP Transport Options**, you can choose to **Create a new SAP transport Directory** or **Use an existing SAP transport Directory** or completely skip the creation of transport directory by choosing **Don't include SAP transport directory** option. Currently, only NFS on AFS storage account fileshares is supported.

   1. If you choose to **Create a new SAP transport Directory**, this option creates and mounts a new transport fileshare on the SID. By default, this option creates an NFS on AFS storage account and a transport fileshare in the resource group where an SAP system is deployed. However, you can choose to create this storage account in a different resource group by providing the resource group name in **Transport Resource Group**.

      You can also provide a custom name for the storage account to be created under **Storage account name** section. Leaving the **Storage account name** creates the storage account with the service default name `<SID><NFS><alphanumeric text>` in the chosen transport resource group. Creating a new transport directory creates a ZRS based replication for zonal deployments and LRS based replication for nonzonal deployments.

      If your region doesn't support ZRS replication deploying a zonal VIS leads to a failure. In such cases, you can deploy a transport fileshare outside Azure Center for SAP Solutions with ZRS replication and then create a zonal VIS where you select **Use an existing SAP transport Directory** to mount the precreated fileshare.

   1. If you choose to **Use an existing SAP transport Directory**, select the preexisting NFS fileshare under **File share name** option. The existing transport fileshare is only mounted on this SID. The selected fileshare shall be in the same region as the SAP system being created. Currently, file shares existing in a different region can't be selected. Provide the associated private endpoint of the  storage account where the selected fileshare exists under **Private Endpoint** option.

   1. You can skip the creation of transport file share by selecting **Don't include SAP transport directory** option. The transport fileshare isn't created or mounted for this SID.

1. Under **Configuration Details**, enter the FQDN for your SAP System.

   1. For **SAP FQDN**, provide only the domain name for your system, such as **sap.contoso.com**.

1. Under **User assigned managed identity**, provide the identity which Azure Center for SAP solutions uses to deploy infrastructure.

   1. For **Managed identity source**, choose if you want the service to create a new managed identity or you can instead use an existing identity. To allow the service to create a managed identity, select the checkbox to consent to the identity creation and the assignment of the Contributor role to all resource groups.

   1. For **Managed identity name**, enter a name for a new identity you want to create or select an existing identity from the drop-down menu. If you're selecting an existing identity, it should have **Contributor** role access on the Subscription or on Resource Groups related to this SAP system you're trying to deploy.

      That is, it requires Contributor access to the SAP application Resource Group, Virtual Network Resource Group, and Resource Group that has the existing SSHKEY. If you wish to later install the SAP system using Azure Center for SAP Solutions, we also recommend giving the **Storage Blob Data Reader and Reader** and **Data Access roles** on the Storage Account that has the SAP software media.

1. Under **Managed resource settings**, choose the network settings for the managed storage account deployed into your subscription. This storage account is required for ACSS to orchestrate the deployment of new SAP system and further power all the SAP management capabilities.

   1. For **Storage account network access**, select Enable access from specific virtual network for enhanced network security access for the managed storage account. This option ensures that this storage account is accessible only from the virtual network in which the SAP system exists.

   > [!IMPORTANT]
   > To use the secure network access option, you must enable the **Microsoft.Storage** [service endpoint](../../virtual-network/virtual-network-service-endpoints-overview.md) on the Application and Database subnets. You can learn more about storage account network security in [Azure Storage firewall rules](../../storage/common/storage-network-security.md). Private endpoint on managed storage account isn't currently supported in this scenario.

   When you choose to limit network access to specific virtual networks, Azure Center for SAP solutions service accesses this storage account using [**trusted access**](../../storage/common/storage-network-security.md?tabs=azure-portal#grant-access-to-trusted-azure-services) based on the managed identity associated with the VIS resource.

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

   1. Optionally, select and drag resources or containers to move them around visually.

   1. Select **Reset** to reset the visualization to its default state. That is, to revert any changes you made to the position of resources or containers.

   1. Select **Scale to fit** to reset the visualization to its default zoom level.

   1. Select **Zoom in** to zoom into the visualization.

   1. Select **Zoom out** to zoom out of the visualization.

   1. Select **Download JPG** to export the visualization as a JPG file.

   1. Select **Feedback** to share your feedback on the visualization experience.

      The visualization doesn't represent all resources for the VIS that you're deploying, for instance it doesn't represent disks and NICs.

   1. Select **Next: Tags**.

1. Optionally, enter tags to apply to all resources created by the Azure Center for SAP solutions process. These resources include the VIS, ASCS instances, Application Server instances, Database instances, VMs, disks, and NICs.

1. Select **Review + Create**.

1. Review your settings before deployment.

   1. Make sure the validations pass and there are no errors listed.

   1. Review the Terms of Service, and select the acknowledgment if you agree.

   1. Select **Create**.

1. Wait for the infrastructure deployment to complete. Numerous resources are deployed and configured. This process takes approximately 7 minutes.

## Use a Custom OS image

You can use custom images for deployment in Azure Center for SAP Solutions from the [Azure Compute Gallery](/azure/virtual-machines/capture-image-portal#capture-a-vm-in-the-portal).

### Custom OS image requirements

- Make sure you meet the [general SAP deployment prerequisites](#prerequisites), [downloaded the SAP media](../../sap/center-sap-solutions/get-sap-installation-media.md#prerequisites), and [install the SAP software](../../sap/center-sap-solutions/install-software.md#install-sap-software).

- Before you use an image from Azure Marketplace for customization, check the [list of supported OS image](#deployment-types) versions in Azure Center for SAP Solutions. BYOI is supported on the OS version supported by Azure Center for SAP Solutions. Make sure that Azure Center for SAP Solutions has support for the image, or else the deployment fails with the following error:

  ```error
  The resource ID provided consists of an OS image which is not supported in ACSS. Please ensure that the OS image version is supported in ACSS for a successful installation.
  ```

- Refer to SAP installation documentation to ensure the operating system prerequisites are met for the deployment to be successful.

- Check that the user-assigned managed identity has the **Reader role** on the gallery of the custom OS image. Otherwise, the deployment fails.

- [Create and upload a VM to a gallery in Azure Compute Gallery](/azure/virtual-machines/capture-image-portal#capture-a-vm-in-the-portal).

- Before beginning the deployment, make sure the image is available in Azure Compute Gallery.

- Verify that the image is in same subscription as the deployment.

- Check that the image VM is of the **Standard** security type.

### Deploy using a custom OS image

- Select the **Use a custom image** option during deployment. Choose which image to use for the application and database OS.

- Azure Center for SAP Solutions validates the base operating system version of the custom OS Image is available in the supportability matrix in Azure Center for SAP Solutions. If the versions are unsupported, the deployment fails. To fix this problem, delete the VIS and infrastructure resources from the resource group, then deploy again with a supported image.

- Make sure the image version that you're using is [compatible with the SAP software version](#deployment-types).

## Confirm a deployment

To confirm a deployment is successful:

1. In the [Azure portal](https://portal.azure.com), search for and select **Virtual Instances for SAP solutions**.

1. On the **Virtual Instances for SAP solutions** page, select the **Subscription** filter, and choose the subscription where you created the deployment.

1. In the table of records, find the name of the VIS. The **Infrastructure** column value shows **Deployed** for successful deployments.

If the deployment fails, delete the VIS resource in the Azure portal, then recreate the infrastructure.

## Next steps

- [Install SAP software on your infrastructure](install-software.md)

---
title: Quickstart - Deploy Azure CycleCloud Workspace for Slurm
description: Learn how to get CycleCloud Workspace for Slurm running using Azure Marketplace.
author: xpillons
ms.date: 05/27/2025
ms.author: padmalathas
---

# Quickstart - Deploy Azure CycleCloud Workspace for Slurm using Azure Marketplace

Azure CycleCloud Workspace for Slurm is a free Marketplace application that provides a simple, secure, and scalable way to manage compute and storage resources for HPC and AI workloads. In this quickstart, you install CycleCloud Workspace for Slurm using Azure Marketplace application.

The main steps to deploy and configure CycleCloud Workspace for Slurm including Open OnDemand are:
1. Review these instructions before starting: [Plan your CycleCloud Workspace for Slurm Deployment.](./how-to/ccws/plan-your-deployment.md).
1. Deploy a CycleCloud Workspace for Slurm environment using Azure Marketplace (this quickstart).
1. Register a Microsoft Entra ID application for Open OnDemand authentication: [Register a Microsoft Entra ID application for Open OnDemand](./how-to/ccws/register-entra-id-app.md)
1. Configure Open OnDemand to use the Microsoft Entra ID application: [Configure Open OnDemand with CycleCloud](./how-to/ccws/configure-open-ondemand.md)
1. Add users in CycleCloud: [Add users for Open OnDemand](./how-to/ccws/open-ondemand-add-users.md)

## Prerequisites

For this quickstart, you need:

1. An Azure account with an active subscription
1. The **Contributor** and **User Access Administrator** roles at the subscription level
1. Direct connection to the virtual network used by the cluster (i.e., not using Azure Bastion), if deploying Open OnDemand is required
1. Permission to register a Microsoft Entra ID application if deploying Open OnDemand

## How to deploy?

* Sign in to the [Azure portal.](https://portal.azure.com)
* Click on the upper left `+ Create a Resource` option
* In the `Search services and marketplace` box, enter **Slurm** and then select **Azure CycleCloud Workspace for Slurm**.
* On the **Azure CycleCloud Workspace for Slurm** page, select **Create**.

:::image type="content" source="./images/ccws/marketplace-000.png" alt-text="Screenshot of Azure CycleCloud Workspace for Slurm marketplace screen.":::

### Basics
* On the **New Azure CycleCloud Workspace for Slurm account** page, enter or select the following details.
   - **Subscription**: Select the subscription to use if not already selected.
   - **Region**: Select the Azure region in which you want to deploy your CycleCloud Workspace for Slurm environment.
   - **Resource group**: Select the resource group for the Azure CycleCloud Workspace for Slurm account, or create a new one.
   - **CycleCloud VM Size**: Choose a new VM Size or keep the default one. 
   - **Admin User**: Enter a name and a password for the CycleCloud administrator account.
   - **Admin SSH Public Key**: Select the public SSH key of the administrator account directly or if stored in an SSH key resource in Azure.
 
:::image type="content" source="./images/ccws/marketplace-basics.png" alt-text="Screenshot of the Basics options screen.":::

### File-system
#### Users' home directory - Create New
Specify where the users' home directory should be located. Create a new **Builtin NFS** uses the scheduler VM as an NFS server with an attached datadisk.
:::image type="content" source="./images/ccws/marketplace-fs-001.png" alt-text="Screenshot of the File-system mount for /shared and /home Builtin NFS create new options screen.":::

Create a new **Azure NetApp Files** creates an ANF account, pool and, volume of the specified capacity and service level.
:::image type="content" source="./images/ccws/marketplace-fs-002.png" alt-text="Screenshot of the File-system mount for /shared and /home Azure NetApp files create new options screen.":::

#### Users' home directory - Use Existing

If you have an existing NFS mount point, then select the **Use Existing** option and specify the settings to mount it.
:::image type="content" source="./images/ccws/marketplace-fs-003.png" alt-text="Screenshot of the File-system mount for /shared and /home use external NFS options screen.":::

#### Supplemental file-system mount - Create New

If you need to mount another file-system for your project data, you can either create a new one or specify an existing one. You can create a new Azure NetApp Files volume or an Azure Managed Lustre Filesystem.

:::image type="content" source="./images/ccws/marketplace-fs-004.png" alt-text="Screenshot of the Additional File-system mount for create new Azure NetApp Files.":::

:::image type="content" source="./images/ccws/marketplace-fs-005.png" alt-text="Screenshot of the Additional File-system mount for create new Azure Managed Lustre.":::

#### Supplemental file-system mount - Use Existing

If you have an existing external NFS mount point or an Azure Managed Lustre Filesystem, you can specify the mount options.

:::image type="content" source="./images/ccws/marketplace-fs-006.png" alt-text="Screenshot of the Additional File-system mount for an existing external NFS.":::

### Networking

Specify here if you want to create a new Virtual Network and subnets or use an existing one.

#### Create a new Virtual Network

:::image type="content" source="./images/ccws/marketplace-networking-001.png" alt-text="Screenshot of the Networking options for creating a new one.":::

- Select the CIDR that corresponds to the number of compute nodes you're targeting and specify a base IP address.
- Creating a Bastion is recommended if direct connectivity isn't provided by your corporate IT.
- Creating a NAT Gateway is required to provide outbound connectivity to internet. 
- Peer to an existing Virtual Network if you already have a HUB that can deliver services like Bastion and a VPN gateway. Ensure that you select a base IP address compatible with your peered virtual network. If the peered virtual network has a gateway, check the **Allow** gateway transit option.

#### Use existing Virtual Network

Before using an existing virtual network, check for the prerequisites in [Plan your CycleCloud Workspace for Slurm Deployment.](./how-to/ccws/plan-your-deployment.md#brownfield-deployment)

:::image type="content" source="./images/ccws/marketplace-networking-002.png" alt-text="Screenshot of the Networking options for using an existing one.":::

Specify how to manage the registration of the private endpoint used for the storage account created to store CycleCloud projects with a private DNS zone. Options include creating a new private DNS zone, using an existing one, or not registering it.

:::image type="content" source="./images/ccws/marketplace-networking-003.png" alt-text="Screenshot of the Networking options for Private DNS zone.":::


### Slurm Settings

Specify the virtual machine size and image to use for the Scheduler and the Login nodes. Images are the HPC Images provided in Azure Marketplace with the associated URIs:

| Image Name | URI |
|------------|-----|
| Alma Linux 8.10 | almalinux:almalinux-hpc:8_10-hpc-gen2:latest |
| Ubuntu 20.04 | microsoft-dsvm:ubuntu-hpc:2004:latest |
| Ubuntu 22.04 | microsoft-dsvm:ubuntu-hpc:2204:latest |
| Custom Image | You have to specify an image URN or image ID |

If you choose a `Custom Image`, you must then specify an image URN for an existing marketplace image or and image ID for an image in an Azure Compute Gallery.

You can also check the `Use image on all nodes` if you want the Scheduler, Login Nodes, and compute nodes to use the same image.

Specify the number of login nodes you want to provision initially and the maximum number allowed. 
Enabling health checks automatically executes node health checks for the HPC and GPU partitions, removing any unhealthy nodes when they start.
You can postpone the start of the cluster if you need additional configuration through the CycleCloud portal.

:::image type="content" source="./images/ccws/marketplace-slurm.png" alt-text="Screenshot of the Slurm settings.":::

To enable Slurm Job Accounting, check the box to display connectivity options. Ensure you have an Azure Database for MySQL flexible server resource that was deployed earlier.

You can connect using an FQDN or private IP if you supply your own virtual network or use virtual network peering when creating a new virtual network as part of your deployment. Connection via private endpoint is also available if you choose to create a new virtual network.

:::image type="content" source="./images/ccws/marketplace-slurm-accounting-001.png" alt-text="Screenshot of the Slurm Setting options for job accounting database, direct FQDN.":::

:::image type="content" source="./images/ccws/marketplace-slurm-accounting-002.png" alt-text="Screenshot of the Slurm Setting options for job accounting database with Private Endpoint.":::

### Partition Settings

Azure CycleCloud Workspace for Slurm comes with three defined Slurm partitions:
- HTC: For embarrassingly parallel non-MPI jobs.
- HPC: For tightly coupled MPI jobs mostly using VM types with or without InfiniBand support.
- GPU: For MPI and non-MPI GPU jobs using VM types with or without InfiniBand support.

You can configure the image and the maximum number of nodes for each partition that CycleCloud dynamically provisions. Only the HTC partition allows the use of spot instances, as spot instances aren't suitable for HPC and GPU jobs.

:::image type="content" source="./images/ccws/marketplace-partitions.png" alt-text="Screenshot of the Partition Settings options.":::

### Open OnDemand
To utilize Open OnDemand, select the checkbox and provide the required details: 
- the image name, 
- the domain name (`contoso.com`) used to extract the user name (`user@contoso.com`) to match the local Linux account (`user`) managed by CycleCloud and used for authentication, 
- the fully qualified domain name (FQDN) of the Open OnDemand web server (leave blank if intending to use the private IP), 
- indicate whether you plan to use an existing Microsoft Entra ID application or register one manually at a later stage. `Automatically register Entra ID application` is an additional option that will only appear when doing CLI deployment.

>[!NOTE]
>A Microsoft Entra ID application is necessary for user authentication. Create an application manually if one hasn't been created by our scripts. See [How to register a Microsoft Entra ID application for Open OnDemand](./how-to/ccws/register-entra-id-app.md) for more information.

:::image type="content" source="./images/ccws/marketplace-open-ondemand.png" alt-text="Screenshot of the Open OnDemand options.":::

### Advanced
Availability zones can be enabled for cluster compute nodes and new file-system resources. Placing compute nodes and storage in the same availability zone ensures minimal latency between them.

:::image type="content" source="./images/ccws/marketplace-advanced.png" alt-text="Screenshot of the Advanced options.":::

### Tags

Assign the appropriate tags to the necessary resources. CycleCloud dynamically provisions Virtual Machines and applies Node Array tags to them.

:::image type="content" source="./images/ccws/marketplace-tags.png" alt-text="Screenshot of the Tags options.":::


### Review and create

Review your options as this step also includes some validations. 

:::image type="content" source="./images/ccws/marketplace-review.png" alt-text="Screenshot of the Review.":::

After the validations are complete, click **Create** to initialize the deployment.

:::image type="content" source="./images/ccws/deployment.png" alt-text="Screenshot of the Deployment in progress.":::

Follow the deployment status and steps.

## Check your deployment

Connect to the `ccw-cyclecloud-vm` using Bastion with the username and SSH keys specified during the deployment.

:::image type="content" source="./images/ccws/cc-connect-with-bastion.png" alt-text="Screenshot of the Connect with Bastion menu.":::

:::image type="content" source="./images/ccws/bastion-connection.png" alt-text="Screenshot of the Connect with Bastion connection options.":::

After connected, check the cloud-init logs to verify everything is correct.

```bash
$tail -f -n 25 /var/log/cloud-init-output.log
Waiting for Azure.MachineType to be populated...
Waiting for Azure.MachineType to be populated...
Waiting for Azure.MachineType to be populated...
Waiting for Azure.MachineType to be populated...
Waiting for Azure.MachineType to be populated...
Waiting for Azure.MachineType to be populated...
Waiting for Azure.MachineType to be populated...
Waiting for Azure.MachineType to be populated...
Waiting for Azure.MachineType to be populated...
Waiting for Azure.MachineType to be populated...
Waiting for Azure.MachineType to be populated...
Waiting for Azure.MachineType to be populated...
Starting cluster ccws....
----------------------------
ccws : allocation -> started
----------------------------
Resource group: 
Cluster nodes:
    scheduler: Off -- --  
Total nodes: 1
CC start_cluster successful
/
exiting after install
Cloud-init v. 23.4-7.el8_10.alma.1 running 'modules:final' at Wed, 12 Jun 2024 10:15:53 +0000. Up 11.84 seconds.
Cloud-init v. 23.4-7.el8_10.alma.1 finished at Wed, 12 Jun 2024 10:28:15 +0000. Datasource DataSourceAzure [seed=/dev/sr0].  Up 754.29 seconds
```

Next, establish connectivity between your client machine and the CycleCloud VM. It's achieved through your corporate IT, a VPN, Bastion tunneling, or an attached public IP if permitted by your company. Access the web interface by browsing to https://<cyclecloud_ip>, and authenticate using the username and password provided during deployment. Verify that both the Scheduler and the Login node are running.

## Resources

* [Register a Microsoft Entra ID application for Open OnDemand](./how-to/ccws/register-entra-id-app.md)
* [Configure Open OnDemand with CycleCloud](./how-to/ccws/configure-open-ondemand.md)
* [Add users for Open OnDemand](./how-to/ccws/open-ondemand-add-users.md)
* [How to connect to the CycleCloud Portal through Bastion.](/azure/cyclecloud/how-to/ccws/connect-to-portal-with-bastion)
* [How to connect to a Login Node through Bastion.](/azure/cyclecloud/how-to/ccws/connect-to-login-node-with-bastion)
* [How to deploy a CycleCloud Workspace for Slurm environment using the CLI.](/azure/cyclecloud/how-to/ccws/deploy-with-cli)

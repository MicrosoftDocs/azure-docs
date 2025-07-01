---
title: Quickstart - Deploy Azure CycleCloud Workspace for Slurm
description: Learn how to get CycleCloud Workspace for Slurm running using Azure Marketplace.
author: xpillons
ms.date: 07/01/2025
ms.author: padmalathas
---

# Quickstart - Deploy Azure CycleCloud Workspace for Slurm using Azure Marketplace

Azure CycleCloud Workspace for Slurm is a free Marketplace application that provides a simple, secure, and scalable way to manage compute and storage resources for HPC and AI workloads. In this quickstart, you install CycleCloud Workspace for Slurm using Azure Marketplace application.

The main steps to deploy and configure CycleCloud Workspace for Slurm including Open OnDemand are:
1. Review these instructions before starting: [Plan your CycleCloud Workspace for Slurm Deployment](./how-to/ccws/plan-your-deployment.md).
1. Deploy a CycleCloud Workspace for Slurm environment using Azure Marketplace (this quickstart).
1. Register a Microsoft Entra ID application for Open OnDemand authentication: [Register a Microsoft Entra ID application for Open OnDemand](./how-to/ccws/register-entra-id-app.md).
1. Configure Open OnDemand to use the Microsoft Entra ID application: [Configure Open OnDemand with CycleCloud](./how-to/ccws/configure-open-ondemand.md)
1. Add users in CycleCloud: [Add users for Open OnDemand](./how-to/ccws/open-ondemand-add-users.md)

## Prerequisites

For this quickstart, you need:

1. An Azure account with an active subscription
1. The **Contributor** and **User Access Administrator** roles at the subscription level
1. Direct connection to the virtual network used by the cluster (that is, not using Azure Bastion), if you need to deploy Open OnDemand
1. Permission to register a Microsoft Entra ID application if you need to deploy Open OnDemand

## How to deploy

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Select **+ Create a Resource**.
1. In the **Search services and marketplace** box, enter **Slurm** and then select **Azure CycleCloud Workspace for Slurm**.
1. On the **Azure CycleCloud Workspace for Slurm** page, select **Create**.

:::image type="content" source="./images/ccws/marketplace-000.png" alt-text="Screenshot of Azure CycleCloud Workspace for Slurm marketplace screen.":::

### Basics
* On the **New Azure CycleCloud Workspace for Slurm account** page, enter or select the following details.
   - **Subscription**: Select the subscription to use if it's not already selected.
   - **Region**: Select the Azure region where you want to deploy your CycleCloud Workspace for Slurm environment.
   - **Resource group**: Select the resource group for the Azure CycleCloud Workspace for Slurm account, or create a new one.
   - **CycleCloud VM Size**: Choose a new VM Size or keep the default one. 
   - **Admin User**: Enter a name and a password for the CycleCloud administrator account.
   - **Admin SSH Public Key**: Select the public SSH key of the administrator account directly or if stored in an SSH key resource in Azure.
 
:::image type="content" source="./images/ccws/marketplace-basics.png" alt-text="Screenshot of the Basics options screen.":::

### File-system
#### Users' home directory - Create new
Specify where to put the users' home directory. 

- **Builtin NFS** - Uses the scheduler VM as an NFS server with an attached datadisk.
  :::image type="content" source="./images/ccws/marketplace-fs-001.png" alt-text="Screenshot of the File-system mount for /shared and /home Builtin NFS create new options screen.":::

- **Azure NetApp Files** - Creates an ANF account, pool, and volume with the specified capacity and service level.
  :::image type="content" source="./images/ccws/marketplace-fs-002.png" alt-text="Screenshot of the File-system mount for /shared and /home Azure NetApp files create new options screen.":::

#### Users' home directory - Use Existing

If you have an existing NFS mount point, select the **Use Existing** option and specify the settings to mount it.
:::image type="content" source="./images/ccws/marketplace-fs-003.png" alt-text="Screenshot of the File-system mount for /shared and /home use external NFS options screen.":::

#### Supplemental file-system mount - Create new

If you need to mount another file system for your project data, you can either create a new one or specify an existing one. You can create a new Azure NetApp Files volume or an Azure Managed Lustre Filesystem.

:::image type="content" source="./images/ccws/marketplace-fs-004.png" alt-text="Screenshot of the Additional File-system mount for create new Azure NetApp Files.":::

:::image type="content" source="./images/ccws/marketplace-fs-005.png" alt-text="Screenshot of the Additional File-system mount for create new Azure Managed Lustre.":::

#### Supplemental file-system mount - Use existing

If you have an existing external NFS mount point or an Azure Managed Lustre Filesystem, you can specify the mount options.

:::image type="content" source="./images/ccws/marketplace-fs-006.png" alt-text="Screenshot of the Additional File-system mount for an existing external NFS.":::

### Networking

Specify if you want to create a new virtual network and subnets or use an existing one.

#### Create a new virtual network

:::image type="content" source="./images/ccws/marketplace-networking-001.png" alt-text="Screenshot of the Networking options for creating a new one.":::

- Select the CIDR that corresponds to the number of compute nodes you're targeting and specify a base IP address.
- Create a Bastion if your corporate IT doesn't provide direct connectivity.
- Create a NAT Gateway to provide outbound connectivity to the internet.
- Peer to an existing virtual network if you already have a HUB that can deliver services like Bastion and a VPN gateway. Ensure that you select a base IP address compatible with your peered virtual network. If the peered virtual network has a gateway, check the **Allow** gateway transit option.

#### Use existing virtual network

Before using an existing virtual network, check the prerequisites in [Plan your CycleCloud Workspace for Slurm Deployment](./how-to/ccws/plan-your-deployment.md#brownfield-deployment).

:::image type="content" source="./images/ccws/marketplace-networking-002.png" alt-text="Screenshot of the Networking options for using an existing one.":::

Specify how to manage the registration of the private endpoint used for the storage account to store CycleCloud projects with a private DNS zone. You can choose to create a new private DNS zone, use an existing one, or not register it.

:::image type="content" source="./images/ccws/marketplace-networking-003.png" alt-text="Screenshot of the Networking options for Private DNS zone.":::


### Slurm settings

Specify the virtual machine size and image for the scheduler and the authentication nodes. The images are HPC images in Azure Marketplace with the following URIs:

| Image Name | URI |
|------------|-----|
| Alma Linux 8.10 | almalinux:almalinux-hpc:8_10-hpc-gen2:latest |
| Ubuntu 20.04 | microsoft-dsvm:ubuntu-hpc:2004:latest |
| Ubuntu 22.04 | microsoft-dsvm:ubuntu-hpc:2204:latest |
| Custom Image | You must specify an image URN or image ID |

If you choose a `Custom Image`, specify an image URN for an existing marketplace image or an image ID for an image in an Azure Compute Gallery.

To use the same image for the scheduler, authentication nodes, and compute nodes, select **Use image on all nodes**.

Specify the number of authentication nodes you want to provision initially and the maximum number allowed. 
When you enable health checks, the solution automatically runs node health checks for the HPC and GPU partitions and removes any unhealthy nodes.
You can delay the start of the cluster if you need to configure more settings through the CycleCloud portal.

:::image type="content" source="./images/ccws/marketplace-slurm.png" alt-text="Screenshot of the Slurm settings.":::

To enable Slurm Job Accounting, check the box to display connectivity options. Make sure you have an Azure Database for MySQL flexible server resource that you deployed earlier.

You can connect using an FQDN or private IP if you supply your own virtual network. You can also use virtual network peering when you create a new virtual network as part of your deployment. If you choose to create a new virtual network, you can also connect through a private endpoint.

:::image type="content" source="./images/ccws/marketplace-slurm-accounting-001.png" alt-text="Screenshot of the Slurm Setting options for job accounting database, direct FQDN.":::

:::image type="content" source="./images/ccws/marketplace-slurm-accounting-002.png" alt-text="Screenshot of the Slurm Setting options for job accounting database with Private Endpoint.":::

### Partition settings

Azure CycleCloud Workspace for Slurm includes three defined Slurm partitions:
- **HTC**: For embarrassingly parallel non-MPI jobs.
- **HPC**: For tightly coupled MPI jobs that mostly use VM types with or without InfiniBand support.
- **GPU**: For MPI and non-MPI GPU jobs that use VM types with or without InfiniBand support.

You can set the image and the maximum number of nodes for each partition that CycleCloud dynamically creates. Only the HTC partition lets you use spot instances, because spot instances don't work well for HPC and GPU jobs.

:::image type="content" source="./images/ccws/marketplace-partitions.png" alt-text="Screenshot of the Partition Settings options.":::

### Open OnDemand
To use Open OnDemand, select the checkbox and enter the following information: 
- the image name, 
- the domain name (`contoso.com`) that the system uses to get the user name (`user@contoso.com`) and match it with the local Linux account (`user`) that CycleCloud manages for authentication, 
- the fully qualified domain name (FQDN) of the Open OnDemand web server (leave blank if you want to use the private IP), 
- whether you plan to use an existing Microsoft Entra ID application or register one manually later. `Automatically register Entra ID application` is an extra option that appears only when you use CLI deployment.

>[!NOTE]
>User authentication requires a Microsoft Entra ID application. If our scripts don't create an application, manually create one. For more information, see [How to register a Microsoft Entra ID application for Open OnDemand](./how-to/ccws/register-entra-id-app.md).
>
>:::image type="content" source="./images/ccws/marketplace-open-ondemand.png" alt-text="Screenshot of the Open OnDemand options.":::
>
>### Advanced
> You can enable availability zones for cluster compute nodes and new file-system resources. Placing compute nodes and storage in the same availability zone ensures minimal latency between them.
>
>:::image type="content" source="./images/ccws/marketplace-advanced.png" alt-text="Screenshot of the Advanced options.":::

### Tags

Assign the appropriate tags to the necessary resources. CycleCloud dynamically provisions virtual machines and applies Node Array tags to them.

:::image type="content" source="./images/ccws/marketplace-tags.png" alt-text="Screenshot of the Tags options.":::


### Review and create

Review your options. This step also includes some validations. 

:::image type="content" source="./images/ccws/marketplace-review.png" alt-text="Screenshot of the Review.":::

When the validations are complete, select **Create** to initialize the deployment.

:::image type="content" source="./images/ccws/deployment.png" alt-text="Screenshot of the Deployment in progress.":::

Follow the deployment status and steps.

## Check your deployment

Connect to the `ccw-cyclecloud-vm` using Bastion with the username and SSH keys you specify during the deployment.

:::image type="content" source="./images/ccws/cc-connect-with-bastion.png" alt-text="Screenshot of the Connect with Bastion menu.":::

:::image type="content" source="./images/ccws/bastion-connection.png" alt-text="Screenshot of the Connect with Bastion connection options.":::

After connecting, check the cloud-init logs to verify everything is correct.

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

Next, set up connectivity between your client machine and the CycleCloud VM. Your corporate IT department might need to help you set up connectivity through a VPN, Bastion tunneling, or an attached public IP if your company permits it. Access the web interface by browsing to `https://<cyclecloud_ip>`. Sign in with the username and password you provide during deployment. Verify that both the scheduler and the sign-in node are running.

## Resources

* [Register a Microsoft Entra ID application for Open OnDemand](./how-to/ccws/register-entra-id-app.md)
* [Configure Open OnDemand with CycleCloud](./how-to/ccws/configure-open-ondemand.md)
* [Add users for Open OnDemand](./how-to/ccws/open-ondemand-add-users.md)
* [How to connect to the CycleCloud Portal through Bastion](/azure/cyclecloud/how-to/ccws/connect-to-portal-with-bastion)
* [How to connect to a Login Node through Bastion](/azure/cyclecloud/how-to/ccws/connect-to-login-node-with-bastion)
* [How to deploy a CycleCloud Workspace for Slurm environment using the CLI](/azure/cyclecloud/how-to/ccws/deploy-with-cli)

---
title: Configure VMware Cloud Director in Azure VMware Solution 
description: Learn how to deploy, manage, and automate virtual infrastructure resources inside your Azure VMware Solutions private cloud with VMware Cloud Director.
ms.topic: how-to
ms.date: 03/19/2021
---

# Configure VMware Cloud Director in Azure VMware Solution

[VMware Cloud Director](https://www.vmware.com/products/cloud-director.html) is used to deploy, manage, and automate virtual infrastructure resources inside your Azure VMware Solutions private cloud. It also lets service providers make optimal use of Azure VMware Solution resources by assigning each customer their respective "slice" of infrastructure and growing as needed. Each tenant can use a single interface to manage their resources.

Using VMware Cloud Director with [Azure VMware Solution](https://azure.microsoft.com/services/azure-vmware/), a Microsoft Cloud Solution Provider partner can:

- Create scalable virtual data centers that allow self-service provisioning of network, storage, and compute resources.

- Manage your customer tenants from a single portal and allocate resources to tenants as needed from a single or multiple Azure VMware Solution private clouds.

- Enable your customer's ability to consume the underlaying compute resources using the VCD pre-defined consumption models. Scaling their workloads up and down to answer their business needs.

Azure VMware Solution supports distributed VMware Cloud Director Cells with external database type architecture. VMware Cloud Director appliance-based deployment is currently not supported.

[image]

## VMware Cloud Director architecture in Azure

This solution guide describes how to install and configure VCD in a cell-based architecture on Azure IaaS instances and the supported network scenarios and limitations in this release of Azure VMware Solution.

The installation and configuration process creates the cells, connects them to the shared database, transfers server storage, and creates the system *administrator *account. The system administrator then establishes connections to the Azure VMware Solution vCenter Server and the NSX-T Manager cluster.

>[!NOTE]
>Mixed VMware Cloud Director installations on Linux and VMware Cloud Director appliance deployments in one server group are not supported.

## Requirements preparation

Before getting started with the VCD installation, there are several requirements we need.

- Access your My VMware account and download the VMware Cloud Director 10.2 binaries.

- An Azure Files NFS share to be used as a transfer store for the VMware Cloud Director cells.

- An [Azure Database for PostgreSQL](https://azure.microsoft.com/services/postgresql/) database instance.

- An Azure VNET with enough address space for the following subnets:

  - vcd-cell-subnet for the cells

  - AzureBastionSubnet for Azure Bastion service

  - GatewaySubnet in case we connect to the Azure VMware Solution private cloud using an ExpressRoute Gateway

- Two Linux instances for the VCD cells. The only supported Linux distributions for VMware Cloud Director are CentOS and Red Hat Enterprise Linux, version 7 or 8 in both cases.

- DNS resolution, direct and reverse, is mandatory for the VCD cells.

For a more detailed network overview, see the official VMware guidance [VMware Cloud Director network security requirements](https://docs.vmware.com/en/VMware-Cloud-Director/10.1/VMware-Cloud-Director-Install-Configure-Upgrade-Guide/GUID-EAD4BD34-978E-43FA-9054-0FC128B25784.html).

## Create an Azure VNET

First, we need to create a new resource group, which you'll use later to contain all Azure resources associated with the VCD deployment.

This example uses the name *avs-vcd-we* and the West Europe location and the az group create command to create this new resource group.

```azurecli-interactive
az group create --name avs-vcd-we \
--location westeurope
```

Create the VNET with [az network vnet create](https://docs.microsoft.com/cli/azure/network/vnet#az_network_vnet_create) command.

```azurecli-interactive
az network vnet create –-name vcd-vnet
-–resource-group avs-vcd-we \
--location westeurope \
--address-prefixes 10.1.0.0/16 \
--subnet-name vcd-cell-subnet \
--subnet-prefixes 10.1.1.0/24
```

Create the Azure Bastion subnet to be used later to access the VCD cells.

```azurecli-interactive
az network vnet subnet create –-name AzureBastionSubnet
-–resource-group avs-vcd-we \
--address-prefixes 10.1.0.0/27 \
--vnet-name vcd-vnet
```

## Create and configure the Network Security Group

Create the NSG to be used to protect the VCD cells.

## Create and deploy an Azure NFS file share

An NFS file share is needed as a transfer store for VMware Cloud Director cells. Review the details about the NFS store in VCD documentation.

Register NFS protocol.

```azurecli-interactive
az feature register \
--name AllowNfsFileShares \
--namespace Microsoft.Storage \
--subscription \$subscriptionId
```

Create the storage account, set the account to FileStorage type.

In the example, we'll use the same resource group created for the VNET. It will keep contained all the VCD-related resources in the same resource group.

```azurecli-interactive
az storage account create --resource-group avs-vcd-we \
--name vcdfileshare \
--location westeurope \
--sku Premium_LRS \
--kind FileStorage
```

Create the file share. The parameter quota is the size in GB.

```azurecli-interactive
az storage share-rm create --resource-group avs-vcd-we \
--storage-account vcdfileshare \
--name vcdnfsstore \
--enabled-protocol NFS \
--root-squash RootSquash \
--quota 1024
```

Disable secure transfer for the Storage Account.

1. From the Azure portal, access the storage account containing the new NFS share.

2. Select **Configuration**.

3. Select **Disabled** for **Secure transfer required**.

4. Select **Save**.

[image]

Review [Azure Files documentation](../storage/files/storage-files-how-to-create-nfs-shares.md) for more details about Azure Files NFS storage.

<!--Can we use this while in preview? does not support identity-based auth only token…-->

## Create and deploy an Azure Postgres SQL Database

1. In the Azure portal, search for **Azure Database for PostgreSQL**.

2. Select **Create**.

3. In the deployment option screen, select Single Server and select **Create**.

4. Fill in the required properties for the database instance. Remember to select version 10.

   [image]

5. Advance to **Review + Create** and select **Create** to start the deployment.

6. Follow [Azure Database for PostgreSQL documentation](../postgresql/howto-manage-firewall-using-portal.md) to configure the database firewall rules.

7.  Configure [Private Link](../postgresql/howto-configure-privatelink-portal.md) for the database.

## Prepare VMware Cloud Director cells

VMware Cloud Director cells will run on Linux Azure IaaS instances. The supported operating systems for VCD are CentOS and Red Hat Enterprise Linux versions 7 and 8. However, RHEL is preferred. For our example, we'll select RHEL 8.1.

These cells are deployed in the customer's vNet and connect to Azure VMware Solution. VMware recommends that a VMware Cloud Director cell to always be available. To align with this recommendation, deploy a minimum of two VMware Cloud Director cell instances.

For best practice, deploy a number of VMware Cloud Director cells equal to one plus the number of private clouds you plan to connect to VMware Cloud Director. In this tutorial, we'll deploy to a single Azure VMware Solution private cloud(1) and therefore require 2 vCloud director cells.

### Deploy a Linux virtual machine for each VMware Cloud Director cell

See [Azure Linux Virtual Machined documentation](../virtual-machines/linux/quick-create-portal.md) for the detailed procedure to create a Red Hat Enterprise Linux 8 instance.

- Select each VM to use the VNET and subnet created before and the Network Security Group defined and configured earlier.

- Use at least **Standard_D4ds_v4** as the instance size, comes with 4 vCPU and 16 GB of RAM.

- Configure the virtual machines (VMs) after deployment to use [static IP addresses](../virtual-network/virtual-networks-static-private-ip-arm-pportal.md#add-a-static-private-ip-address-to-an-existing-vm).

- Configure the instances to use [Availability Zones](../virtual-machines/Linux/create-cli-availability-zone.md) to provide another level of availability to the VCD server group.

### Deploy a Windows 10 virtual machine as a jump box

Deploy a Windows 10 virtual machine. You'll use this instance as a jump box to access the VCD cells. Review [Azure Virtual Machines documentation](../virtual-machines/windows/quick-create-portal.md) for the procedure.

### Deploy Azure Bastion

Bastion is an Azure service that enables an administrator to connect to a virtual machine using a browser and the Azure portal.

It provides secure and seamless RDP and SSH connectivity to your VMs directly from the Azure portal over TLS. That way, your VMs won't need a public IP address, agent, or special client software.

Bastion provides secure RDP and SSH connectivity to all the VMs in the virtual network in which it's provisioned. In our example, it enables the jump box through RDP and to the VCD cells through SSH.

For more details, see [Azure Bastion documentation](https://docs.microsoft.com/azure/bastion/). Use the **AzureBastionSubnet** you created earlier to deploy the service.

## Install binaries on each VCD cell

1. Access your jump box using Bastion.

1. Download the VMware Cloud Director binary installer in the jump box.

1. Create an SSL certificate and prepare the VMware Cloud Director Keystore for installation. See the [VMware guidance on SSL certificate creation](https://docs.vmware.com/en/VMware-Cloud-Director/10.1/VMware-Cloud-Director-Install-Configure-Upgrade-Guide/GUID-E16A013E-6E11-4AA0-837D-058B486764CF.html).
   
   >[!TIP]
   >You can also later create the Keystore after you do the binary installation on the first VMware Cloud Director cell.

1. Access the first cell using Bastion.

1. Install prerequisite packages:

   ```azurecli-interactive
   yum install -y bind-utils \
   libcurl-devel \
   libxml2-devel \
   make \
   openssl-devel \
   git \
   alsa-lib \
   libICE \
   libSM \
   libX11 \
   libXau \
   libXdmcp \
   libXext \
   libXi \
   libXt \
   libXtst \
   pciutils \
   redhat-lsb \
   wget
   ```
1. Install the NFS-utils package needed to mount the transfer store.

   ```azurecli-interactive
   yum install -y nfs-utils
   systemctl enable rpcbind nfs-server nfs-lock nfs-idmap
   systemctl start rpcbind nfs-server nfs-lock nfs-idmap   
   ```

### Install vCloud Director on the first VCD cell

The Linux VMs are now ready for the next step to install the vCloud Director.

1. Connect to the jump box using Bastion VM and copy the vCloud Director binaries from your blob storage account using AZ copy and with the following syntax:

   ```azurecli-interactive
   SCP VMware-vcloud-director-distribution-10.2.0-17029810.bin
   vcdadmin\@vcd-cell-FQDN:/home/vcdadmin   
   ```
1. Upload through SCP the Java Keystore file to the cell instance.

   ```azurecli-interactive
   scp java-keystore-file vcdadmin\@vcd-cell-FQDN:/home/vcdadmin   
   ```

1. Make the VCD binary executable.

   ```azurecli-interactive
   chmod +x vmware-vcloud-director-distribution-10.2.0-17029810.bin   
   ```
1. Install VMware Cloud Director.

   ```azurecli-interactive
   ./vmware-vcloud-director-distribution-10.2.0-17029810.bin   
   ```

1. Mount the NFS file share (transfer store) to the VM

   ```azurecli-interactive
   echo " AZURE_FILES_NFS_SHARE_IP:/volume_name \
   /opt/vmware/vcloud-director/data/transfer nfs defaults,_netdev 0 0" >> \
   /etc/fstab
   mount /opt/vmware/vcloud-director/data/transfer
   chown -R vcloud:vcloud /opt/vmware/vcloud-director/data/transfer   
   ```

1. Configure VMware Cloud Director in [unattended mode](https://docs.vmware.com/en/VMware-Cloud-Director/10.1/VMware-Cloud-Director-Install-Configure-Upgrade-Guide/GUID-094A7CCF-FBA5-457B-A4FC-68CF91D9B034.html).

   ```azurecli-interactive
   /opt/vmware/vcloud-director/bin/configure -ip *INSTANCE_IP* \
   --primary-port-http 80 --primary-port-https 443 -cons *INSTANCE_IP* \
   --console-proxy-port-https 8443 -dbhost *DB_ENDPOINT* -dbport 5432 \
   -dbtype postgres -dbname *DB_NAME* -dbuser *DB_MASTER_USER* \
   -dbpassword *DB_MASTER_USER_PASSWORD* --keystore /tmp/*KEYSTORE_FILE* \
   -w *KEYSTORE_PASSWORD* --enable-ceip true -unattended   
   ```

1. Adjust the Java heap size to help with performance. 

   1. Set the Java XMS value to at least 2 GB:

      ```azurecli-interactive
      sed -i "s/Xms1024M/Xms2048M/g" \
      /opt/vmware/vcloud-director/bin/vmware-vcd-cell-common      
      ```

   1. Set the maximum value to the VM memory value minus 2 GB:

      ```azurecli-interactive
      sed -i "s/Xmx4096M/Xmx6144M/g" \
      /opt/vmware/vcloud-director/bin/vmware-vcd-cell-common      
      ```

1. Enable and start the VMware Cloud Director service:

   ```azurecli-interactive
   chkconfig VMware-vcd on
   service VMware-vcd start   
   ```

1. Check if the service has started successfully:

   ```azurecli-interactive
   tail -f /opt/vmware/vcloud-director/logs/cell.log   
   ```

1. Copy the responses.properties and Java KeyStore files to the transfer store to use for installation on your other VMware Cloud Director cells:

   ```azurecli-interactive
   cp /opt/vmware/vcloud-director/etc/responses.properties \
   /opt/vmware/vcloud-director/data/transfer/responses.properties
   chmod 644 /opt/vmware/vcloud-director/data/transfer/responses.properties
   cp /tmp/certificates.ks \
   /opt/vmware/vcloud-director/data/transfer/certificates.ks
   chmod 644 /opt/vmware/vcloud-director/data/transfer/certificates.ks   
   ```

1. Use the [cell-management-toolsystem-setup](https://docs.vmware.com/en/VMware-Cloud-Director/10.1/VMware-Cloud-Director-Install-Configure-Upgrade-Guide/GUID-81685FF4-891E-4C79-A014-D19FD40352D3.html) command to configure the VMware Cloud Director installation:

   ```azurecli-interactive
   /opt/vmware/vcloud-director/bin/cell-management-tool system-setup \
   --email *EMAIL* --full-name *FULL_NAME* \
   --installation-id *INSTALLATION_ID* --password *PASSWORD* \
   --system-name *SYSTEM_NAME* --serial-number *SERIAL_NUMBER* \
   --user *USER* --unattended   
   ```

## Install VMware Cloud Director on other Linux VMs

To install and configure VMware Cloud Director on the remaining cell, *repeat the following steps* for each cell:

1. Access the instance using Bastion.

1. Make the binary executable:

   ```azurecli-interactive
   chmod +x VMware-vcloud-director-distribution-10.2.0-17029810.bin   
   ```

1. Install the binary on the VM:

   ```azurecli-interactive
   ./ VMware-vcloud-director-distribution-10.2.0-17029810.bin   
   ```

1. Mount the transfer store to this VM:

   ```azurecli-interactive
   echo " AZURE_FILES_NFS_SHARE_IP:/volume_name \
   /opt/vmware/vcloud-director/data/transfer nfs defaults,_netdev 0 0" >> \
   /etc/fstab
   mount /opt/vmware/vcloud-director/data/transfer
   chown -R vcloud:vcloud /opt/vmware/vcloud-director/data/transfer   
   ```

1. Do the initial VMware Cloud Director cell configuration using an [unattended configuration](https://docs.vmware.com/en/VMware-Cloud-Director/10.1/VMware-Cloud-Director-Install-Configure-Upgrade-Guide/GUID-094A7CCF-FBA5-457B-A4FC-68CF91D9B034.html):

   ```azurecli-interactive
   /opt/vmware/vcloud-director/bin/configure \
   -r /opt/vmware/vcloud-director/data/transfer/responses.properties \
   -ip *INSTANCE_IP* --primary-port-http 80 --primary-port-https 443 \
   -cons *INSTANCE_IP* --console-proxy-port-https 8443 \
   --keystore /opt/vmware/vcloud-director/data/transfer/*KEYSTORE_FILE* \
   -w *KEYSTORE_PASSWORD* --enable-ceip true -unattended   
   ```

1. Adjust the Java heap size to help with performance:

   1. Set the Java XMS value to at least 2 GB:

      ```azurecli-interactive
      sed -i "s/Xms1024M/Xms2048M/g" \
      /opt/vmware/vcloud-director/bin/vmware-vcd-cell-common      
      ```

   1. Set the maximum value to the VM memory value minus 2 GB:

      ```azurecli-interactive
      sed -i "s/Xmx4096M/Xmx6144M/g" \
      /opt/vmware/vcloud-director/bin/vmware-vcd-cell-common      
      ```

1. Enable and start the VMware Cloud Director service:

   ```azurecli-interactive
   chkconfig VMware-vcd on
   service VMware-vcd start   
   ```

1. Check if the service has started successfully:

   ```azurecli-interactive
      tail -f /opt/vmware/vcloud-director/logs/cell.log
   ```

## Deploy Azure load balancers 

We need to deploy load balancers in Azure to allow access from the internet to the VMware Cloud Director interface and console proxy. This process involves the following steps:

1. Deploy an Azure Application Gateway for VMware Cloud Director interface and API access.

2. Deploy an Azure Standard Load Balancer for console proxy access.

### Azure Application Gateway for VCD interface and API access

To create an Azure Application Gateway for interface and API access, do the following:

### Create an Azure Standard Load Balancer for console proxy access

Supported scenarios for tenants to access their vCD Org portal and workloads are described below. These scenarios may change over time (increased scenarios), and we will be updating this guide accordingly.

## Scenario A – Support of HTTP / HTTPS to VCD portal

In this scenario, the provider will configure a public IP using the standard Azure Application Gateway service and create conditional forwarding rules based on the URL of the subscriber to allow each subscriber access to their vCD portal. The subscriber can access their workloads using a web console, but no RDP or public IP is possible on the various Org VDC workloads.

[image]

- Provider configures HTTP/HTTPS App Gateway or Azure FW Public IP

- Tenant access is over HTTP/ HTTPS to the vCD tenant portal

- Tenant can access jump box or other workloads VMs through HTTP/HTTPS

## Scenario B –Provider custom NVA configured in provider Azure vnet in front of vCD

In this scenario, the provider can configure a custom NVA or Azure Firewall DNAT rule translating the public IP to the address of the Org VDC T1 segment external address. Another DNAT rule is then applied to translate the T1 external address to the subnets behind the tenant T1 gateway. This enables the subscriber to access either a jump box or separate workloads through public IP, RDP sessions on the Org VDC network.

[insert diagram]

## Scenario C –Peered subscriber (tenant) vnet to provider vnet and NVA to Org VDC

In this scenario, the subscriber has peered their vnet to the provider Azure vnet using standard vnet peering. The subscriber can create a custom NVA solution that will conditionally forward traffic to the providers NVA in the provider
vnet in front of vCD and which in turn will route traffic through a DNAT rule described in scenario B to the subscriber Org VDC VM's or NVA on the Org VDC network.

## Limitations

Both scenarios B and C suffer from limitations of the DNAT rule scalability of either Azure Firewall or NVA-based solution. Read more on [subscription features and service limits.](../azure-resource-manager/management/azure-subscription-service-limits.md#azure-firewall-limits) AVS will implement more advanced public IP networking in the future, effectively removing these limitations, but for now, it remains in effect.

## References

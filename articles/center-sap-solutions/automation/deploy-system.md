---
title: About SAP system deployment for the automation framework
description: Overview of the SAP system deployment process within the SAP on Azure Deployment Automation Framework.
author: kimforss
ms.author: kimforss
ms.reviewer: kimforss
ms.date: 11/17/2021
ms.topic: conceptual
ms.service: virtual-machines-sap
---

# SAP system deployment for the automation framework

The creation of the [SAP system](automation-deployment-framework.md#sap-concepts) is part of the [SAP on Azure Deployment Automation Framework](automation-deployment-framework.md) process. The SAP system creates your virtual machines (VMs), and supporting components for your [SAP application](automation-deployment-framework.md#sap-concepts). 

The SAP system deploys:

- The [database tier](#database-tier), which deploys database VMs, their disks, and a Standard Azure Load Balancer. You can run [HANA databases](automation-configure-extra-disks.md#hana-databases) or [AnyDB databases](automation-configure-extra-disks.md#anydb-databases) in this tier.
- The [SAP central services tier](#central-services-tier), which deploys a customer-defined number of VMs and an Azure Standard Load Balancer.
- The [application tier](#application-tier), which deploys the VMs and their disks.
- The [web dispatcher tier](#web-dispatcher-tier)

## Application tier

The application tier deploys a customer-defined number of VMs. These VMs are size **Standard_D4s_v3** with a 30-GB operating system (OS) disk and a 512-GB data disk.

To set the application server count, define the parameter `application_server_count` for this tier in your parameter file. For example, `application_server_count= 3`.


## Central services tier

The SAP central services (SCS) tier deploys a customer-defined number of VMs. These VMs are size **Standard_D4s_v3** with a 30-GB OS disk and a 512-GB data disk. This tier also deploys an [Azure Standard Load Balancer](../../load-balancer/load-balancer-overview.md).

To set the SCS server count, define the parameter `scs_server_count` for this tier in your parameter file. For example, `scs_server_count=1`.


## Web dispatcher tier

The web dispatcher tier deploys a customer-defined number of VMs.  This tier also deploys an [Azure Standard Load Balancer](../../load-balancer/load-balancer-overview.md).

To set the web server count, define the parameter `web_server_count` for this tier in your parameter file. For example, `web_server_count = 2`.

## Database tier

The database tier deploys the VMs and their disks, and also an [Azure Standard Load Balancer](../../load-balancer/load-balancer-overview.md). You can use either [HANA databases](automation-configure-extra-disks.md#hana-databases) or [AnyDB databases](automation-configure-extra-disks.md#anydb-databases) as your database VMs.

You can set the size of database VMs with the parameter `size` for this tier. For example, `"size": "S4Demo"` for HANA databases or `"size": "1 TB"` for AnyDB databases. Refer to the **Size** parameter in the tables of [HANA database VM options](automation-configure-extra-disks.md#hana-databases) and [AnyDB database VM options](automation-configure-extra-disks.md#anydb-databases) for possible values.

By default, the automation framework deploys the correct disk configuration for HANA database deployments. For HANA database deployments, the framework calculates default disk configuration based on VM size. However, for AnyDB database deployments, the framework calculates default disk configuration based on database size. You can set a disk size as needed by creating a custom JSON file in your deployment. For an example, [see the following JSON code sample and replace values as necessary for your configuration](automation-configure-extra-disks.md#custom-sizing-file). Then, define the parameter `db_disk_sizes_filename` in the parameter file for the database tier. For example, `db_disk_sizes_filename = "path/to/JSON/file"`.

You can also [add extra disks to a new system](automation-configure-extra-disks.md#custom-sizing-file), or [add extra disks to an existing system](automation-configure-extra-disks.md#add-extra-disks-to-existing-system).

## Core configuration

The following example parameter file shows only required parameters.

```bash
# The environment value is a mandatory field, it is used for partitioning the environments, for example (PROD and NP)
environment="DEV"

# The location value is a mandatory field, it is used to control where the resources are deployed
location="westeurope"

# The network logical name is mandatory - it is used in the naming convention and should map to the workload virtual network logical name 
network_name="SAP01"

# sid is a mandatory field that defines the SAP Application SID
sid="S15"

app_tier_vm_sizing="Production"
app_tier_use_DHCP=true

database_platform="HANA"

database_size="S4Demo"
database_sid="XDB"

database_vm_use_DHCP=true

database_vm_image={
  os_type="linux"
  source_image_id=""
  publisher="SUSE"
  offer="sles-sap-15-sp2"
  sku="gen2"
  version="latest"
}

# application_server_count defines how many application servers to deploy
application_server_count=2

application_server_image= {
  os_type=""
  source_image_id=""
  publisher="SUSE"
  offer="sles-sap-15-sp2"
  sku="gen2"
  version="latest"
}

scs_server_count=1

# scs_instance_number
scs_instance_number="00"

# ers_instance_number
ers_instance_number="02"

# webdispatcher_server_count defines how many web dispatchers to deploy
webdispatcher_server_count=0


```

## Deploying the SAP system
   
The sample SAP System configuration file `DEV-WEEU-SAP01-X01.tfvars` is located in the `~/Azure_SAP_Automated_Deployment/samples/WORKSPACES/SYSTEM/DEV-WEEU-SAP01-X01` folder.

Running the command below will deploy the SAP System.

# [Linux](#tab/linux)

> [!TIP]
> Perform this task from the deployer.

You can copy the sample configuration files to start testing the deployment automation framework.

```bash
cd ~/Azure_SAP_Automated_Deployment

cp -Rp sap-automation/deploy/samples/WORKSPACES WORKSPACES

```


```bash
cd ~/Azure_SAP_Automated_Deployment/WORKSPACES/SYSTEM/DEV-WEEU-SAP01-X01

${DEPLOYMENT_REPO_PATH}/deploy/scripts/installer.sh          \
        --parameterfile DEV-WEEU-SAP01-X01.tfvars           \
        --type sap_system
```
# [Windows](#tab/windows)

You can copy the sample configuration files to start testing the deployment automation framework.

```powershell

cd C:\Azure_SAP_Automated_Deployment

xcopy sap-automation\deploy\samples\WORKSPACES WORKSPACES

```


```powershell

cd C:\Azure_SAP_Automated_Deployment\WORKSPACES\SYSTEM\DEV-WEEU-SAP01-X01

New-SAPSystem -Parameterfile DEV-WEEU-SAP01-X01.tfvars 
-Type sap_system
```

# [Azure DevOps](#tab/devops)

Open (https://dev.azure.com) and go to your Azure DevOps Services project.

> [!NOTE]
> Ensure that the 'Deployment_Configuration_Path' variable in the 'SDAF-General' variable group is set to the folder that contains your configuration files, for this example you can use 'samples/WORKSPACES'.

The deployment will use the configuration defined in the Terraform variable file located in the 'samples/WORKSPACES/SYSTEM/DEV-WEEU-SAP01-X00' folder. 

Run the pipeline by selecting the _SAP system deployment_ pipeline from the Pipelines section. Enter 'DEV-WEEU-SAP01-X00' as the SAP System configuration name.

You can track the progress in the Azure DevOps Services portal. Once the deployment is complete, you can see the SAP System details in the _Extensions_ tab.

---

### Output files

The deployment will create an Ansible hosts file (`SID_hosts.yaml`) and an Ansible parameter file (`sap-parameters.yaml`) that are required input for the Ansible playbooks.
## Next steps

> [!div class="nextstepaction"]
> [About workload zone deployment with automation framework](automation-software.md)

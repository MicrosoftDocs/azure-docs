---
title: Deploy system and automation framework with BoM
description: How to deploy your SAP system with the automation framework using the Bill of Materials (BoM) you created. The guide includes instructions for SAP HANA and SAP DB databases.
author: kimforss
ms.author: kimforss
ms.reviewer: kimforss
ms.date: 10/14/2021
ms.topic: how-to
ms.service: virtual-machines-sap
---

# Deploying databases with BoM

The [SAP deployment automation framework on Azure](automation-deployment-framework.md) uses a Bill of Materials (BoM). You can [deploy SAP HANA](#deploy-sap-hana) or [deploy SAP Application Database (SAP DB)](#deploy-sap-db) with a BoM. Then, your SAP Basis administrator can configure the database client with your connection details and credentials.

> [!NOTE]
> This guide covers advanced deployment topics. For a basic explanation of how to deploy the automation framework, see the [get started guide](automation-get-started.md) instead.

## Prerequisites

- [Get, download, and prepare your SAP installation media and related files](automation-bom-get-files.md) if you haven't already done so. Make sure to have the [name of the SAPCAR utility file that you downloaded](automation-bom-get-files.md#acquire-media) available.
- [Prepare your BoM](automation-bom-prepare.md) if you haven't already done so. Make sure to have the BoM file that you created available.
- [Process your BoM](automation-bom-process.md) if you haven't already done so. Make sure to have the configuration details from when you [deployed your infrastructure](automation-bom-process.md#deploy-system-infrastructure). Also check that your application servers have swap space of &gt; 256 MB available.
- Generate templates for your SAP installation. Always generate HANA templates before SAP Application Database (SAP DB) templates.
    - [Generate SAP HANA templates](automation-bom-templates-hana.md)
    - [Generate SAP DB templates](automation-bom-templates-db.md)
- An Azure subscription. If you don't already have an Azure subscription, [create a free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- An SAP account with permissions to work with the database you want to use.
- Optionally, create a virtual machine (VM) within Azure to use for transferring SAP media from your storage account. This method improves the transfer speed. Make sure you have connectivity between your VM and the target SAP VM. For example, check that your SSH keys are in place.

## Deploy SAP HANA

You can deploy SAP HANA [through a manual process](#manual-hana-deployment) or [through a scripted process](#scripted-hana-deployment).

### Manual HANA deployment

You can deploy SAP HANA manually using the HANA Database Lifecycle Manager (HDBLCM).

1. Make sure the mount point exists for your installation media.

    ```bash
    mkdir -p /usr/sap/install
    ```

1. Mount the exported directory of installation media. Replace `<scs-vm-IP>` with the IP address of your ASCS VM.
    
    ```bash
    mount <scs-vm-IP>:/usr/sap/install /usr/sap/install
    ```

1. Create a temporary directory and go to that directory.

    ```bash
    mkdir /tmp/hana_install; cd $_
    ```

1. Make sure the HDBLCM is available. Replace `<SERVER>` with the name of your server file name. For example, `IMDB_SERVER20_052_0-80002031.SAR`.

    ```bash
    /usr/sap/install/download_basket/SAPCAR.EXE -manifest SAP_HANA_DATABASE/SIGNATURE.SMF -xf /usr/sap/install/download_basket/<SERVER>.SAR
    ```

1. Open your HANA installation template in an editor. The file name is `/usr/sap/install/config/<BoM_Name>.params`, where `<BoM_Name>` is the HANA version you're installing. For example, `/usr/sap/install/config/HANA_2_00_052_v001.params`. Update these variables:

    1. Set `components=all`.

    1. Update `hostname` to the name of your HANA VM. For example, `hostname=hd1-hanadb-vm`.

    1. Update `sid` to your HANA SAP system identifier (SID). For example, `sid=HD1`.

    1. Update `number` to the instance number. For example, `number=00`.

    1. Save your changes.

1. Open your HANA password file. The file name is `/usr/sap/install/config/<BoM_Name>.params.xml`.  Replace all the Ansible variables, such as `{{ db_root_password }}`, with a single password.

1. Run the HANA installation. Replace `<BoM_Name>` with the HANA version that you're installing.

    ```bash
    at /usr/sap/install/config/<BoM_Name>.params.xml | SAP_HANA_DATABASE/hdblcm --read_password_from_stdin=xml -b --configfile=/usr/sap/install/config/<BoM_Name>.params
    ```

### Scripted HANA deployment

The scripted process for deploying SAP HANA uses [Ansible playbooks](#about-playbooks).

1. Runs an Ansible playbook to configure the operating system (OS).

1. Runs an Ansible playbook to configure the SAP OS.

    1. Configures Logical Volume Management (LVM) volumes.

    1. Configures generic SAP file system mounts. These mounts include the directory structure, such as `/sapmnt` and `/usr/sap`, and file systems, such as `/etc/fstab`.

1. Runs an Ansible playbook to process the BoM file. Obtains and prepares the correct installation media for the system.

    1. Configures installation directories, such as `/sapmnt/<SID>` and `/usr/sap/install`.

    1. Configures media directory exports.

    1. Iterates over BoM content to download. This content includes media, unattended installation templates, and more. The playbook also iterates over nested BoMs to make sure all required media is available. 

    1. Downloads media to `/usr/sap/downloads` on the VM's file system.

    1. Extracts and organizes media into directories to support the automation process.

    1. Creates a Network File System (NFS) export of media for use by other VMs in the system.

    1. Mounts the NFS export on other VMs in the system.

1. Runs an Ansible playbook to deploy a stand-alone SAP HANA instance using SWPM.

## Deploy SAP DB

You can deploy SAP DB using [Ansible playbooks](#about-playbooks). 

1. Sign in to your deployer VM.

1. Go to the Ansible configuration files directory under your SAP system directory. For example:

    ```bash
    cd ~/Azure_SAP_Automated_Deployment/WORKSPACES/SAP_SYSTEM/NP-CEUS-SAP0-X00/ansible_config_files
    ```

1. Run the Ansible playbook to install SCS.

    ```bash
    ansible-playbook -i hosts ~/Azure_SAP_Automated_Deployment/sap-hana/deploy/ansible/playbook_install_scs.yml
    ```

1. [Install the HANA database](#deploy-sap-hana) if you haven't already done so.

1. Run the Ansible playbook to install the database content.

    ```bash
    ansible-playbook -i hosts ~/Azure_SAP_Automated_Deployment/sap-hana/deploy/ansible/playbook_install_db.yml
    ```

1. Run the Ansible playbook to install the Primary Application Server (PAS).

    ```bash
    ansible-playbook -i hosts ~/Azure_SAP_Automated_Deployment/sap-hana/deploy/ansible/playbook_install_pas.yml
    ```

1. Run the Ansible playbook to install the Additional Application Server(s) (AAS).

    ```bash
    ansible-playbook -i hosts ~/Azure_SAP_Automated_Deployment/sap-hana/deploy/ansible/playbook_install_aas.yml
    ```

1. Run the Ansible playbook to install the Web Dispatcher Server(s).

    ```bash
    ansible-playbook -i hosts ~/Azure_SAP_Automated_Deployment/sap-hana/deploy/ansible/playbook_install_web.yml
    ```

## About playbooks

The installation methods for SAP HANA and SAP DB both use Ansible playbooks.

Each playbook configures OS groups and users with configurable GUIDs and UIDs. These settings use the defaults for new systems. These users have the same UID across all systems with the same SID: `<SID>adm` where `<SID>` is the SID, `sapsys`, and `sapadm`.

These playbooks configure SAP OS prerequisites, including OS and software dependencies. For more about dependencies, see [SAP Note 2369910](https://launchpad.support.sap.com/#/notes/2369910) and [SAP Note 2365849](https://launchpad.support.sap.com/#/notes/2365849).

The playbooks also install the SAP product through SAP Software Provisioning Manager (SWPM) or HDBLCM.

## Next steps

- [Run automation framework from Cloud Shell](automation-run-from-cloud-shell.md)

- [Run automation framework from Linux](automation-run-from-linux.md)

- [Run automation framework from Windows](automation-run-from-windows.md)

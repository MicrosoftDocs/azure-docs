---
title: Process BoM for automated deployment
description: How to process your SAP Bill of Materials (BoM) for use with the automated deployment framework on Azure.
author: kimforss
ms.author: kimforss
ms.reviewer: kimforss
ms.date: 10/14/2021
ms.topic: how-to
ms.service: virtual-machines-sap
---

# Process BoM

Before you can use your SAP Bill of Materials (BoM) with the [deployment automation framework](automation-deployment-framework.md), you have to process the BoM. 

> [!NOTE]
> This guide covers advanced deployment topics. For a basic explanation of how to deploy the automation framework, see the [get started guide](automation-get-started.md) instead.

## Prerequisites

- [Get, download, and prepare your SAP installation media and related files](automation-bom-get-files.md) if you haven't already done so.
- [Prepare your BoM](automation-bom-prepare.md) if you haven't already done so.
- An Azure subscription. If you don't already have an Azure subscription, [create a free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- An SAP account with permissions to work with the database you want to use.

## Deploy system infrastructure

To deploy your system infrastructure, you must prepare the existing Ansible playbook. This process assumes that the deployer runs the SAP system deployment. The deployment generates the folder `Azure_SAP_Automated_Deployment/WORKSPACES/SAP_SYSTEM/<SAP-SYSTEM-NAME>/ansible_config_files`, where the value `<SAP-SYSTEM-NAME>` is the name of your deployment, such as `NP-EUS2-SAP0-X00`. The folder contains three files: `hosts`, `hosts.yml`, and `output.json`. Ansible uses these files for the automated configuration of your system. 

### Update Ansible playbook

Before you can successfully deploy your system, you must make some changes to your SAP playbook's settings:

1. Sign in to your deployer virtual machine (VM).

1. Open `Azure_SAP_Automated_Deployment/sap-hana/deploy/ansible/sap_playbook.yml` in an editor.

1. Comment out the play on lines 49-65 for Azure File Share mounting:

    ```yml
    # Mount Azure File share on all linux jumpboxes including rti
    - hosts: localhost:jumpboxes_linux
      become: true
      become_user: root
      roles:
        - role: mount-azure-files
          when: output.software.storage_account_sapbits.file_share_name != ""
    
    # Mount Azure File share on all hanadbnodes. When the scenario is Large Instance, this task will be skipped
    - hosts: hanadbnodes
      become: true
      become_user: root
      roles:
        - role: mount-azure-files
          when:
            - output.software.storage_account_sapbits.file_share_name != ""
            - hana_database.size != "LargeInstance"
    ```

1. Comment out the play on lines 67-81 for SAP media downloading:

    ```yml
    # Download SAP Media on Azure File Share
    - hosts: localhost
      become: true
      become_user: root
      roles:
        - role: sap-media-download
    
    - hosts: hanadbnodes
      become: true
      become_user: root
      roles:
        - role: sap-media-transfer
          when: hana_database.size == "LargeInstance"
        - role: large-instance-environment-setup
          when: hana_database.size == "LargeInstance"
    ```
    
1. Comment out the play on lines 94-142 for the installation of HANA database components:

    ```yml
    # Hana DB components install
    - hosts: hanadbnodes
      become: true
      become_user: root
      any_errors_fatal: true
      vars_files:
        - "vars/ha-packages.yml"
      pre_tasks:
        - name: Include SAP HANA DB sizes
          include_vars:
            file: "{{ configs_path }}/hdb_sizes.json"
            name: hdb_sizes
      roles:
        - role: hdb-server-install
        - role: hana-system-replication
          when: hana_database.high_availability
          vars:
            sid: "{{ hana_database.instance.sid }}"
            instance_number: "{{ hana_database.instance.instance_number }}"
            hdb_version: "{{ hana_database.db_version }}"
            hdb_disks: "{{ hdb_sizes[hana_database.size].storage }}"
            hana_system_user_password: "{{ hana_database.credentials.db_systemdb_password }}"
            primary_instance:
              name: "{{ hana_database.nodes[0].dbname }}"
              ip_admin: "{{ hana_database.nodes[0].ip_admin_nic }}"
            secondary_instance:
              name: "{{ hana_database.nodes[1].dbname }}"
              ip_admin: "{{ hana_database.nodes[1].ip_admin_nic }}"
        - role: hana-os-clustering
          when: hana_database.high_availability
          vars:
            resource_group_name: "{{ output.infrastructure.resource_group.name }}"
            sid: "{{ hana_database.instance.sid }}"
            instance_number: "{{ hana_database.instance.instance_number }}"
            hdb_size: "{{ hana_database.size }}"
            hdb_lb_feip: "{{ hana_database.loadbalancer.frontend_ip }}"
            ha_cluster_password: "{{ hana_database.credentials.ha_cluster_password }}"
            sap_hana_fencing_agent_subscription_id: "{{ lookup('env', 'SAP_HANA_FENCING_AGENT_SUBSCRIPTION_ID') }}"
            sap_hana_fencing_agent_tenant_id: "{{ lookup('env', 'SAP_HANA_FENCING_AGENT_TENANT_ID') }}"
            sap_hana_fencing_agent_client_id: "{{ lookup('env', 'SAP_HANA_FENCING_AGENT_CLIENT_ID') }}"
            sap_hana_fencing_agent_client_password: "{{ lookup('env', 'SAP_HANA_FENCING_AGENT_CLIENT_SECRET') }}"
            primary_instance:
              name: "{{ hana_database.nodes[0].dbname }}"
              ip_admin: "{{ hana_database.nodes[0].ip_admin_nic }}"
              ip_db: "{{ hana_database.nodes[0].ip_db_nic }}"
            secondary_instance:
              name: "{{ hana_database.nodes[1].dbname }}"
              ip_admin: "{{ hana_database.nodes[1].ip_admin_nic }}"
              ip_db: "{{ hana_database.nodes[1].ip_db_nic }}"
    ```

1. Save your changes.

### Run Ansible playbook

Next, run the Ansible playbook to configure your servers.

1. Sign in to your deployer VM, if necessary.

1. Go to the Ansible configuration files folder for your SAP system. Replace `<SAP-SYSTEM-NAME>` with the name of your SAP deployment.

    ```bash
    cd ~/Azure_SAP_Automated_Deployment/WORKSPACES/SAP_SYSTEM/<SAP-SYSTEM-NAME>/ansible_config_files
    ```

1. Run the Ansible playbook that you modified:

    ```bash
    export ANSIBLE_HOST_KEY_CHECKING=False
    ansible-playbook -i hosts.yml ~/Azure_SAP_Automated_Deployment/sap-hana/deploy/ansible/sap_playbook.yml
    ```

## Define SAP system

Next, set up your SAP system by [generating a shared access signature (SAS) token](#generate-sas-token), then [creating a configuration file](#create-configuration-file).

### Generate SAS token

Next, generate a SAS token for your installation media downloads:

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. Select **Storage accounts** from the services list. Or, enter `storage accounts` in the search bar.

1. Select the storage account you're using for your SAP Library.

1. In the storage account's menu, under **Security + networking**, select **Shared access signature**. Or, enter `shared access signature` in the storage account's search bar.

1. On the **Shared access signature** pane, under **Allowed services**, select only **Blob**.

1. Under **Allowed resource types**, select only **Object**.

1. Under **Allowed permissions**, select only **Read**.

1. Under **Blob versioning permissions**, make sure **Enables deletion of versions** is deselected.

1. Under **Start and expiry date/time**, set **Start** and **End** to a large enough time frame to allow downloads to complete.

1. Select **Generate SAS and connection string**.

1. Copy down the SAS token. You'll use the token when you [create your configuration file](#create-configuration-file).

### Create configuration file

For every SAP system that you deploy, you need to generate a configuration file. This file contains the configurations for the system deployment. 

1. Sign in to your deployer VM.

1. Go to your Ansible inventory folder. Replace `<SAP-SYSTEM-NAME>` with the name of the SAP system you want to configure, such as `NP-CEUS-SAP0-X00`.

    ```bash
    cd ~/Azure_SAP_Automated_Deployment/WORKSPACES/SAP_SYSTEM/<SAP-SYSTEM-NAME>/ansible_config_files
    ```

1. Create a new configuration file called `sap-system-config.yml`.

1. Open `sap-system-config.yml`.

1. Copy the following YAML variables into the configuration file.

    ```yml
    # BoM Processing variables
    sapbits_location_base_path: ""
    bom_base_name: ""
    target_media_location: "/usr/sap/install"
    
    # SAS Token for downloading Media
    sapbits_sas_token: ""
    
    # SAP Configuration for templates and install
    aas_hostname: ""
    aas_instance_number: ""
    app_sid: ""
    download_basket_dir: "{{ target_media_location }}/download_basket"
    hdb_hostname: ""
    hdb_instance_number: ""
    hdb_sid: ""
    pas_hostname: ""
    pas_instance_number: ""
    password_hana_system: ""
    sap_fqdn: ""
    sapadm_uid: 2100
    sapinst_gid: 2001
    sapsys_gid: 2000
    scs_hostname: ""
    scs_instance_number: ""
    sidadm_uid: 2000
    ```

    > [!NOTE]
    > The playbook automatically generates a password for your application instance and puts the password in the key vault for the workload zone.

1. Add your own values for the following variables:

    1. For `sapbits_location_base_path`, add the URL to your `sapbits` Azure storage container. 

    1. For `bom_base_name`, add the name of your BoM upload directory in the SAP Library. For example, `S4HANA_2020_ISS_v001`.

    1. For `sapbits_sas_token`, add the [SAS token you generated](#generate-sas-token). 

    1. For `aas_hostname`, add the hostname of your SAP Additional Application Server (AAS).

    1. For `aas_instance_number`, add the instance number of your AAS instances. For example, `12`.

    1. For `app_sid`, add the SAP identifier (SID) of your application tier. For example, `X00`.

    1. For `hdb_hostname`, add the hostname of your HANA database.

    1. For `hdb_instance_number`, add the instance number of your HANA database. For example, `00`.

    1. For `hdb_sid`, add the SID of your SAP HANA database. For example, `D00`.

    1. For `pas_hostname`, add the hostname of your primary application server (PAS).

    1. For `pas_instance_number`, add the instance number of your PAS instance. For example, `10`.

    1. For `password_hana_system`, add your password for the SAP HANA system.

    1. For `sap_fqdn`, add the fully qualified domain name (FQDN) of your SAP system.

    1. For `sapadm_uid`, add the identifier for your SAP administrator (`sapadmin`). For example, `2100`.

    1. For `sapinst_gid`, add the identifier for your SAP instance group (`sapinst`). For example, `2001`.

    1. For `sapsys_gid`, add the identifier for your  SAP system (`sapsys`). For example, `2000`.

    1. For `scs_hostname`, add the hostname for your SAP Central Services (SCS) VM.

    1. For `scs_instance_number`, add the instance number of your SCS instance. For example, `00`.

    1. For `sidadm_uid`, add the user identifier for your SID administrator (`<SID>adm` where `<SID>` is your SID). For example, `2100`.

1. Save your changes.

## Process BoM

To process your BoM for your SAP system installation:

1. Sign in to your deployer VM.

1. Go to your Ansible configuration files folder. Replace `<SAP-SYSTEM-NAME>` with the name of the SAP system you're deploying. For example, `NP-CEUS-SAP0-X00`.

    ```bash
    cd ~/Azure_SAP_Automated_Deployment/WORKSPACES/SAP_SYSTEM/<SAP-SYSTEM-NAME>/ansible_config_files
    ```

1. Run the Ansible playbook to process the BoM file. 

    ```bash
    ansible-playbook -i hosts.yml ~/Azure_SAP_Automated_Deployment/sap-hana/deploy/ansible/playbook_process_bom.yml
    ```

The playbook processes your BoM file to obtain and prepare installation media. Then, the playbook makes the media available on the SCS node. The playbook also exports required file shares so other nodes can install the media. 

1. Configures volumes in the Logical Volume Manager (LVM).
1. Configures generate SAP file system mounts. These mounts include directory structure such as `/sapmnt` and `/usr/sap`, and file systems such as `/etc/fstab`.
1. Configures installation directories such as `/usr/sap/install` and `/sapmnt/<SID>` where `<SID>` is the SID.
1. Iterates over BoM content to download. This content includes SAP media, unattended installation templates, and more. The playbook also iterates over nested BoM content.
1. Download installation media to a known location (`/usr/sap/install`) on the filesystem of the SCS VM.
1. Extracts installation media into directories to help with automation.
1. Makes media available to other VMs in the system by creating Network File System (NFS) exports.

## Next steps

> [!div class="nextstepaction"]
> [Deploy SAP system with BoM](automation-bom-deploy.md)

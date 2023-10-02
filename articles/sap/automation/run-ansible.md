---
title: Run Ansible to configure the SAP system
description: Configure the environment and install SAP by using Ansible playbooks with SAP Deployment Automation Framework.
author: kimforss
ms.author: kimforss
ms.reviewer: kimforss
ms.date: 11/17/2021
ms.topic: how-to
ms.service: sap-on-azure
ms.subservice: sap-automation
ms.custom: devx-track-ansible
---

# Get started with Ansible configuration

When you use [SAP Deployment Automation Framework](deployment-framework.md), you can perform an [automated infrastructure deployment](get-started.md). You can also do the required operating system configurations and install SAP by using Ansible playbooks provided in the repository. These playbooks are located in the automation framework repository in the `/sap-automation/deploy/ansible` folder.

| Filename                                   | Description                                       |
| ------------------------------------------ | ------------------------------------------------- |
| `playbook_01_os_base_config.yaml`          | Base operating system (OS) configuration          |
| `playbook_02_os_sap_specific_config.yaml`  | SAP-specific OS configuration                     |
| `playbook_03_bom_processing.yaml`          | SAP Bill of Materials (SAP BoM) processing        |
| `playbook_04_00_00_hana_db_install`        | SAP HANA database installation                    |
| `playbook_05_00_00_sap_scs_install.yaml`   | SAP central services (SCS) installation           |
| `playbook_05_01_sap_dbload.yaml`           | Database loader                                   |
| `playbook_05_02_sap_pas_install.yaml`      | SAP primary application server (PAS) installation |
| `playbook_05_03_sap_app_install.yaml`      | SAP application server installation               |
| `playbook_05_04_sap_web_install.yaml`      | SAP web dispatcher installation                   |
| `playbook_04_00_01_hana_hsr.yaml`          | SAP HANA high-availability configuration                         |

## Prerequisites

The Ansible playbooks require the `sap-parameters.yaml` and `SID_host.yaml` files in the current directory.

### Configuration files

The `sap-parameters.yaml` file contains information that Ansible uses for configuration of the SAP infrastructure.

```yaml
---

# bom_base_name is the name of the SAP Application Bill of Materials file
bom_base_name:                 S41909SPS03_v0010ms
# Set to true to instruct Ansible to update all the packages on the virtual machines
upgrade_packages:              false 

# TERRAFORM CREATED
sap_fqdn:                      sap.contoso.net                      
# kv_name is the name of the key vault containing the system credentials
kv_name:                       DEVWEEUSAP01user###
# secret_prefix is the prefix for the name of the secret stored in key vault
secret_prefix:                 DEV-WEEU-SAP01

# sap_sid is the application SID
sap_sid:                       X01
# scs_high_availability is a boolean flag indicating 
# if the SAP Central Services are deployed using high availability 
scs_high_availability:         false
# SCS Instance Number
scs_instance_number:           "00"
# scs_lb_ip is the SCS IP address of the load balancer in 
# front of the SAP Central Services virtual machines
scs_lb_ip:                     10.110.32.26
# ERS Instance Number
ers_instance_number:           "02"
# ecs_lb_ip is the ERS IP address of the load balancer in
# front of the SAP Central Services virtual machines
ers_lb_ip:                     

# sap_sid is the database SID
db_sid:                        XDB
# platform
platform:                      HANA

# db_high_availability is a boolean flag indicating if the 
# SAP database servers are deployed using high availability
db_high_availability:          false
# db_lb_ip is the IP address of the load balancer in front of the database virtual machines
db_lb_ip:                      10.110.96.13

disks:
  - { host: 'x01dxdb00l0538', LUN: 0, type: 'sap' }
  - { host: 'x01dxdb00l0538', LUN: 10, type: 'data' }
  - { host: 'x01dxdb00l0538', LUN: 11, type: 'data' }
  - { host: 'x01dxdb00l0538', LUN: 12, type: 'data' }
  - { host: 'x01dxdb00l0538', LUN: 13, type: 'data' }
  - { host: 'x01dxdb00l0538', LUN: 20, type: 'log' }
  - { host: 'x01dxdb00l0538', LUN: 21, type: 'log' }
  - { host: 'x01dxdb00l0538', LUN: 22, type: 'log' }
  - { host: 'x01dxdb00l0538', LUN: 2, type: 'backup' }
  - { host: 'x01app00l538', LUN: 0, type: 'sap' }
  - { host: 'x01app01l538', LUN: 0, type: 'sap' }
  - { host: 'x01scs00l538', LUN: 0, type: 'sap' }

...
```

The `X01_hosts.yaml` file is the inventory file that Ansible uses for configuration of the SAP infrastructure. The `X01` label might differ for your deployments.

```yaml
X01_DB:
  hosts:
    x01dxdb00l0538:
      ansible_host        : 10.110.96.12
      ansible_user        : azureadm
      ansible_connection  : ssh 
      connection_type     : key
  vars:
    node_tier             : hana

X01_SCS:
  hosts:
    x01scs00l538:
      ansible_host        : 10.110.32.25
      ansible_user        : azureadm
      ansible_connection  : ssh 
      connection_type     : key
  vars:
    node_tier             : scs

X01_ERS:
  hosts:
  vars:
    node_tier             : ers

X01_PAS:
  hosts:
    x01app00l538:
      ansible_host        : 10.110.32.24
      ansible_user        : azureadm
      ansible_connection  : ssh 
      connection_type     : key 

  vars:
    node_tier             : pas

X01_APP:
  hosts:
    x01app01l538:
      ansible_host        : 10.110.32.15
      ansible_user        : azureadm
      ansible_connection  : ssh 
      connection_type     : key 

  vars:
    node_tier             : app

X01_WEB:
  hosts:
  vars:
    node_tier             : web

```

## Run a playbook

Make sure that you [download the SAP software](software.md) to your Azure environment before you run this step.

To run a playbook or multiple playbooks, use the following `ansible-playbook` command. This example runs the operating system configuration playbook.

```bash

sap_params_file=sap-parameters.yaml

if [[ ! -e "${sap_params_file}" ]]; then
        echo "Error: '${sap_params_file}' file not found!"
        exit 1
fi

# Extract the sap_sid from the sap_params_file, so that we can determine
# the inventory file name to use.
sap_sid="$(awk '$1 == "sap_sid:" {print $2}' ${sap_params_file})"

kv_name="$(awk '$1 == "kv_name:" {print $2}' ${sap_params_file})"

prefix="$(awk '$1 == "secret_prefix:" {print $2}' ${sap_params_file})"
password_secret_name=$prefix-sid-password

password_secret=$(az keyvault secret show --vault-name ${kv_name} --name ${password_secret_name} | jq -r .value)

export           ANSIBLE_PASSWORD=$password_secret
export           ANSIBLE_INVENTORY="${sap_sid}_hosts.yaml"
export           ANSIBLE_PRIVATE_KEY_FILE=sshkey
export           ANSIBLE_COLLECTIONS_PATHS=/opt/ansible/collections${ANSIBLE_COLLECTIONS_PATHS:+${ANSIBLE_COLLECTIONS_PATHS}}
export           ANSIBLE_REMOTE_USER=azureadm

# Ref: https://docs.ansible.com/ansible/2.9/reference_appendices/interpreter_discovery.html
# Silence warnings about Python interpreter discovery
export           ANSIBLE_PYTHON_INTERPRETER=auto_silent

# Set of options that will be passed to the ansible-playbook command
playbook_options=(
        --inventory-file="${sap_sid}_hosts.yaml"
        --private-key=${ANSIBLE_PRIVATE_KEY_FILE}
        --extra-vars="_workspace_directory=`pwd`"
        --extra-vars="@${sap_params_file}"
        -e ansible_ssh_pass='{{ lookup("env", "ANSIBLE_PASSWORD") }}'
        "${@}"
)

ansible-playbook "${playbook_options[@]}" ~/Azure_SAP_Automated_Deployment/sap-automation/deploy/ansible/playbook_01_os_base_config.yaml

```

### Operating system configuration

The operating system configuration playbook is used to configure the operating system of the SAP virtual machines. The playbook performs the following tasks.

# [Linux](#tab/linux)

The following tasks are executed on Linux virtual machines:

- Enables logging for `sudo` operations
- Ensures that the Azure virtual machine agent is configured correctly
- Ensures that all the repositories are registered and enabled
- Ensures that all the packages are installed
- Creates volume groups and logical volumes
- Configures the kernel parameters
- Configures routing for more network interfaces (if necessary)
- Creates the user accounts and groups
- Configures the banners displayed when signed in
- Configures the services required

# [Windows](#tab/windows)

- Ensures that all the components are installed:
    - StorageDsc
    - NetworkingDsc
    - ComputerManagementDsc
    - PSDesiredStateConfiguration
    - WindowsDefender
    - ServerManager
    - SecurityPolicyDsc
    - Visual C++ runtime libraries
    - ODBC drivers
- Configures the swap file size
- Initializes the disks
- Configures Windows Firewall
- Joins the virtual machine to the specified domain

---

### SAP-specific operating system configuration

The SAP-specific operating system configuration playbook is used to configure the operating system of the SAP virtual machines. The playbook performs the following tasks.

# [Linux](#tab/linux)

The following tasks are executed on Linux virtual machines:

- Configures the hosts file
- Ensures that all the SAP-specific repositories are registered and enabled
- Ensures that all the SAP-specific packages are installed
- Performs the disk mount operations
- Configures the SAP-specific services
- Implements configurations defined in the relevant SAP Notes

# [Windows](#tab/windows)

- Adds local groups and permissions
- Connects to the Windows file shares

---

### Local software download

This playbook downloads the installation media from the control plane to the installation media source. The installation media can be shared out from the central services instance or from Azure Files or Azure NetApp Files.

# [Linux](#tab/linux)

The following tasks are executed on the central services instance virtual machine:

- Download the software from the storage account and make it available for the other virtual machines.

# [Windows](#tab/windows)

The following tasks are executed on the central services instance virtual machine:

- Download the software from the storage account and make it available for the other virtual machines.

---

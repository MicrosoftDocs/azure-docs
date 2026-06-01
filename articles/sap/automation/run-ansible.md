---
title: Run Ansible to configure the SAP system
description: Configure the environment and install SAP by using Ansible playbooks with SAP Deployment Automation Framework.
author: kimforss
ms.author: kimforss
ms.date: 04/06/2026
ms.topic: how-to
ms.service: sap-on-azure
ms.subservice: sap-automation
ms.custom:
  - devx-track-ansible
  - devx-track-azurecli
  - sfi-ropc-nochange
# Customer intent: "As a system administrator, I want to configure and automate the SAP system installation using Ansible playbooks, so that I can streamline the deployment process and ensure consistent environments across my infrastructure."
---

# Configure SAP systems by using Ansible playbooks

SAP Deployment Automation Framework includes Ansible playbooks that configure operating systems and install SAP components on your Azure virtual machines (VMs). Running the playbooks automates what would otherwise be a lengthy, error-prone manual process.

In this article, you run the playbooks for each phase of the SAP installation: operating system configuration, software download, database installation, Central Services, application servers, and Web Dispatcher.

The playbooks are in the `/sap-automation/deploy/ansible` folder. The following table lists each playbook and its purpose.

| Filename                                   | Description                                       |
| ------------------------------------------ | ------------------------------------------------- |
| `playbook_01_os_base_config.yaml`          | Base operating system configuration          |
| `playbook_02_os_sap_specific_config.yaml`  | SAP-specific operating system configuration                     |
| `playbook_03_bom_processing.yaml`          | SAP Bill of Materials processing        |
| `playbook_04_00_00_hana_db_install`        | SAP HANA database installation                    |
| `playbook_05_00_00_sap_scs_install.yaml`   | SAP central services installation           |
| `playbook_05_01_sap_dbload.yaml`           | Database loader                                   |
| `playbook_04_00_01_hana_hsr.yaml`          | SAP HANA high-availability configuration                         |
| `playbook_05_02_sap_pas_install.yaml`      | SAP primary application server installation |
| `playbook_05_03_sap_app_install.yaml`      | SAP application server installation               |
| `playbook_05_04_sap_web_install.yaml`      | SAP Web Dispatcher installation                   |

## Prerequisites

- SAP Deployment Automation Framework [deployed and configured](get-started.md).
- [Azure CLI](/cli/azure/install-azure-cli) installed and authenticated.
- [SAP installation media downloaded](software.md) to your Azure environment.
- SSH key access to the SAP VMs.
- The `sap-parameters.yaml` and `SID_host.yaml` files in the current directory.

### Configuration files

The `sap-parameters.yaml` file contains the information that Ansible needs to configure the SAP infrastructure.

```yaml
---
# bom_base_name is the name of the SAP Application Bill of Materials file
bom_base_name:                 S41909SPS03_v0010ms
# Set to true to instruct Ansible to update all the packages on the virtual machines
upgrade_packages:              false

# TERRAFORM CREATED
sap_fqdn:                      sap.contoso.net
# kv_name is the name of the key vault containing the system credentials
kv_name:                       LABSECESAP01user###
# secret_prefix is the prefix for the name of the secret stored in key vault
secret_prefix:                 LAB-SECE-SAP01

# sap_sid is the application SID
sap_sid:                       L00
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
  - { host: 'l00dxdb00l0538', LUN: 0, type: 'sap' }
  - { host: 'l00dxdb00l0538', LUN: 10, type: 'data' }
  - { host: 'l00dxdb00l0538', LUN: 11, type: 'data' }
  - { host: 'l00dxdb00l0538', LUN: 12, type: 'data' }
  - { host: 'l00dxdb00l0538', LUN: 13, type: 'data' }
  - { host: 'l00dxdb00l0538', LUN: 20, type: 'log' }
  - { host: 'l00dxdb00l0538', LUN: 21, type: 'log' }
  - { host: 'l00dxdb00l0538', LUN: 22, type: 'log' }
  - { host: 'l00dxdb00l0538', LUN: 2, type: 'backup' }
  - { host: 'l00app00l538', LUN: 0, type: 'sap' }
  - { host: 'l00app01l538', LUN: 0, type: 'sap' }
  - { host: 'l00scs00l538', LUN: 0, type: 'sap' }
...
```

The `L00_hosts.yaml` file is the inventory file that Ansible uses to configure the SAP infrastructure. The `L00` label might differ for your deployments.

```yaml
L00_DB:
  hosts:
    l00dxdb00l0538:
      ansible_host        : 10.110.96.12
      ansible_user        : azureadm
      ansible_connection  : ssh
      connection_type     : key
  vars:
    node_tier             : hana

L00_SCS:
  hosts:
    l00scs00l538:
      ansible_host        : 10.110.32.25
      ansible_user        : azureadm
      ansible_connection  : ssh
      connection_type     : key
  vars:
    node_tier             : scs

L00_ERS:
  hosts:
  vars:
    node_tier             : ers

L00_PAS:
  hosts:
    l00app00l538:
      ansible_host        : 10.110.32.24
      ansible_user        : azureadm
      ansible_connection  : ssh
      connection_type     : key

  vars:
    node_tier             : pas

L00_APP:
  hosts:
    l00app01l538:
      ansible_host        : 10.110.32.15
      ansible_user        : azureadm
      ansible_connection  : ssh
      connection_type     : key

  vars:
    node_tier             : app

L00_WEB:
  hosts:
  vars:
    node_tier             : web
```

## Run a playbook

You can run the playbooks by using the configuration menu, the Azure DevOps pipeline, or the command line.

To use the configuration menu, run the `configuration_menu` script.

```bash
${HOME}/Azure_SAP_Automated_Deployment/sap-automation/deploy/ansible/configuration_menu.sh
```

:::image type="content" source="./media/tutorial/configuration-menu.png" alt-text="Diagram that shows the SAP Deployment Automation Ansible configuration menu." lightbox="./media/tutorial/configuration-menu.png":::

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

password_secret=$(az keyvault secret show --vault-name ${kv_name} --name ${password_secret_name} --query value --output table )

export           ANSIBLE_PASSWORD=$password_secret
export           ANSIBLE_INVENTORY="${sap_sid}_hosts.yaml"
export           ANSIBLE_PRIVATE_KEY_FILE=sshkey
export           ANSIBLE_COLLECTIONS_PATHS=/opt/ansible/collections${ANSIBLE_COLLECTIONS_PATHS:+${ANSIBLE_COLLECTIONS_PATHS}}
export           ANSIBLE_REMOTE_USER=azureadm

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

## Configure the operating system

The operating system configuration playbook configures the SAP VMs.

You can run the playbook by using:

- The DevOps pipeline `Configuration and SAP installation` by choosing `Core Operating System Configuration`.
- The configuration menu script `configuration_menu.sh`.
- The command line.

# [Linux](#tab/linux)

The playbook runs the following tasks on Linux VMs:

- Enable logging for `sudo` operations.
- Ensure that the **Azure virtual machine agent** is configured correctly.
- Ensure that all the repositories are registered and enabled.
- Ensure that all the packages are installed.
- Create volume groups and logical volumes.
- Configure the kernel parameters.
- Configure routing for extra network interfaces (if necessary).
- Create the user accounts and groups.
- Configure the banners displayed when signed in.
- Configure the services required.

```bash
cd ${HOME}/Azure_SAP_Automated_Deployment/WORKSPACES/SYSTEM/LAB-SECE-SAP04-L00/

export                            sap_sid=L00
export           ANSIBLE_PRIVATE_KEY_FILE=sshkey

playbook_options=(
        --inventory-file="${sap_sid}_hosts.yaml"
        --private-key=${ANSIBLE_PRIVATE_KEY_FILE}
        --extra-vars="_workspace_directory=`pwd`"
        --extra-vars="@sap-parameters.yaml"
        "${@}"
)

# Run the playbook to retrieve the ssh key from the Azure key vault
ansible-playbook "${playbook_options[@]}" ~/Azure_SAP_Automated_Deployment/sap-automation/deploy/ansible/pb_get-sshkey.yaml

# Run the playbook to perform the Operating System configuration
ansible-playbook "${playbook_options[@]}" ~/Azure_SAP_Automated_Deployment/sap-automation/deploy/ansible/playbook_01_os_base_config.yaml
```

# [Windows](#tab/windows)

The playbook runs the following tasks on Windows VMs:

- Ensure that all the components are installed:

  - `StorageDsc`
  - `NetworkingDsc`
  - `ComputerManagementDsc`
  - `PSDesiredStateConfiguration`
  - `WindowsDefender`
  - `ServerManager`
  - `SecurityPolicyDsc`
  - Visual C++ runtime libraries
  - ODBC drivers

- Configure the swap file size.
- Initialize the disks.
- Configure Windows Firewall.
- Join the virtual machine to the specified domain.

```bash
cd ${HOME}/Azure_SAP_Automated_Deployment/WORKSPACES/SYSTEM/LAB-SECE-SAP04-L00/

export                   sap_sid=L00
export       workload_vault_name="LABSECESAP04user###"
export  ANSIBLE_PRIVATE_KEY_FILE=sshkey

playbook_options=(
        --inventory-file="${sap_sid}_hosts.yaml"
        --private-key=${ANSIBLE_PRIVATE_KEY_FILE}
        --extra-vars="_workspace_directory=`pwd`"
        --extra-vars ansible_ssh_pass='{{ lookup("env", "ANSIBLE_PASSWORD") }}'
        --extra-vars="@sap-parameters.yaml"
        "${@}"
)

# Run the playbook to perform the Operating System configuration
ansible-playbook "${playbook_options[@]}" ~/Azure_SAP_Automated_Deployment/sap-automation/deploy/ansible/playbook_01_os_base_config.yaml
```

---

## Configure SAP-specific operating system settings

The SAP-specific operating system configuration playbook configures the SAP VMs for SAP workloads.

# [Linux](#tab/linux)

The playbook runs the following tasks on Linux VMs:

- Configure the hosts file.
- Ensure that all the SAP-specific repositories are registered and enabled.
- Ensure that all the SAP-specific packages are installed.
- Perform the disk mount operations.
- Configure the SAP-specific services.
- Implement configurations defined in the relevant SAP Notes.

You can run the playbook by using:

- The DevOps pipeline `Configuration and SAP installation` by choosing `SAP Operating System Configuration`.
- The configuration menu script `configuration_menu.sh`.
- The command line.

```bash
cd ${HOME}/Azure_SAP_Automated_Deployment/WORKSPACES/SYSTEM/LAB-SECE-SAP04-L00/

export                   sap_sid=L00
export  ANSIBLE_PRIVATE_KEY_FILE=sshkey

playbook_options=(
        --inventory-file="${sap_sid}_hosts.yaml"
        --private-key=${ANSIBLE_PRIVATE_KEY_FILE}
        --extra-vars="_workspace_directory=`pwd`"
        --extra-vars ansible_ssh_pass='{{ lookup("env", "ANSIBLE_PASSWORD") }}'
        --extra-vars="@sap-parameters.yaml"
        "${@}"
)

# Run the playbook to retrieve the ssh key from the Azure key vault
ansible-playbook "${playbook_options[@]}" ~/Azure_SAP_Automated_Deployment/sap-automation/deploy/ansible/pb_get-sshkey.yaml

# Run the playbook to perform the SAP Specific Operating System configuration
ansible-playbook "${playbook_options[@]}" ~/Azure_SAP_Automated_Deployment/sap-automation/deploy/ansible/playbook_02_os_sap_specific_config.yaml
```

# [Windows](#tab/windows)

The playbook runs the following tasks on Windows VMs:

- Add local groups and permissions.
- Connect to the Windows file shares.

```bash
cd ${HOME}/Azure_SAP_Automated_Deployment/WORKSPACES/SYSTEM/LAB-SECE-SAP04-L00/

export                   sap_sid=L00
export       workload_vault_name="LABSECESAP04user###"
export  ANSIBLE_PRIVATE_KEY_FILE=sshkey
                          prefix="LAB-SECE-SAP04"

password_secret_name=$prefix-sid-password

password_secret=$(az keyvault secret show --vault-name ${workload_vault_name} --name ${password_secret_name} --query value --output table)
export ANSIBLE_PASSWORD=$password_secret

playbook_options=(
        --inventory-file="${sap_sid}_hosts.yaml"
        --private-key=${ANSIBLE_PRIVATE_KEY_FILE}
        --extra-vars="_workspace_directory=`pwd`"
        --extra-vars ansible_ssh_pass='{{ lookup("env", "ANSIBLE_PASSWORD") }}'
        --extra-vars="@sap-parameters.yaml"
        "${@}"
)

# Run the playbook to perform the SAP Specific Operating System configuration
ansible-playbook "${playbook_options[@]}" ~/Azure_SAP_Automated_Deployment/sap-automation/deploy/ansible/playbook_02_os_sap_specific_config.yaml
```

---

## Download SAP installation media locally

This playbook downloads the installation media from the control plane to the installation media source. The installation media can be shared from the central services instance or from Azure Files or Azure NetApp Files.

You can run the playbook by using:

- The DevOps pipeline `Configuration and SAP installation` by choosing `Local software download`.
- The configuration menu script `configuration_menu.sh`.
- The command line.

# [Linux](#tab/linux)

On the central services instance virtual machine, the playbook:

- Downloads the software from the storage account and makes it available for the other VMs.

```bash
cd ${HOME}/Azure_SAP_Automated_Deployment/WORKSPACES/SYSTEM/LAB-SECE-SAP04-L00/

export                   sap_sid=L00
export  ANSIBLE_PRIVATE_KEY_FILE=sshkey

playbook_options=(
        --inventory-file="${sap_sid}_hosts.yaml"
        --private-key=${ANSIBLE_PRIVATE_KEY_FILE}
        --extra-vars="_workspace_directory=`pwd`"
        --extra-vars ansible_ssh_pass='{{ lookup("env", "ANSIBLE_PASSWORD") }}'
        --extra-vars="@sap-parameters.yaml"
        "${@}"
)

# Run the playbook to retrieve the ssh key from the Azure key vault
ansible-playbook "${playbook_options[@]}" ~/Azure_SAP_Automated_Deployment/sap-automation/deploy/ansible/pb_get-sshkey.yaml

# Run the playbook to download the software from the SAP Library
ansible-playbook "${playbook_options[@]}" ~/Azure_SAP_Automated_Deployment/sap-automation/deploy/ansible/playbook_03_bom_processing.yaml
```

# [Windows](#tab/windows)

On the central services instance virtual machine, the playbook:

- Downloads the software from the storage account and makes it available for the other VMs.

```bash
cd ${HOME}/Azure_SAP_Automated_Deployment/WORKSPACES/SYSTEM/LAB-SECE-SAP04-L00/

export                   sap_sid=L00
export       workload_vault_name="LABSECESAP04user###"
export  ANSIBLE_PRIVATE_KEY_FILE=sshkey
                          prefix="LAB-SECE-SAP04"

password_secret_name=$prefix-sid-password

password_secret=$(az keyvault secret show --vault-name ${workload_vault_name} --name ${password_secret_name} --query value --output table)
export ANSIBLE_PASSWORD=$password_secret

playbook_options=(
        --inventory-file="${sap_sid}_hosts.yaml"
        --private-key=${ANSIBLE_PRIVATE_KEY_FILE}
        --extra-vars="_workspace_directory=`pwd`"
        --extra-vars ansible_ssh_pass='{{ lookup("env", "ANSIBLE_PASSWORD") }}'
        --extra-vars="@sap-parameters.yaml"
        "${@}"
)

# Run the playbook to download the software from the SAP Library
ansible-playbook "${playbook_options[@]}" ~/Azure_SAP_Automated_Deployment/sap-automation/deploy/ansible/playbook_03_bom_processing.yaml
```

---

## Install SAP Central Services and configure high availability

This playbook performs the Central Services installation. For high-availability scenarios, the playbook also configures the Pacemaker cluster needed for SAP Central Services for high availability on Linux and Windows Failover Clustering for Windows.

You can run the playbook by using:

- The DevOps pipeline `Configuration and SAP installation` by choosing `SCS Installation & High Availability Configuration`.
- The configuration menu script `configuration_menu.sh`.
- The command line.

# [Linux](#tab/linux)

The playbook performs the following tasks:

- Central Services installation.
- Pacemaker cluster configuration.

```bash
cd ${HOME}/Azure_SAP_Automated_Deployment/WORKSPACES/SYSTEM/LAB-SECE-SAP04-L00/

export                   sap_sid=L00
export  ANSIBLE_PRIVATE_KEY_FILE=sshkey

playbook_options=(
        --inventory-file="${sap_sid}_hosts.yaml"
        --private-key=${ANSIBLE_PRIVATE_KEY_FILE}
        --extra-vars="_workspace_directory=`pwd`"
        --extra-vars ansible_ssh_pass='{{ lookup("env", "ANSIBLE_PASSWORD") }}'
        --extra-vars="@sap-parameters.yaml"
        "${@}"
)

# Run the playbook to retrieve the ssh key from the Azure key vault
ansible-playbook "${playbook_options[@]}" ~/Azure_SAP_Automated_Deployment/sap-automation/deploy/ansible/pb_get-sshkey.yaml

# Run the playbook to install SAP Central Services
ansible-playbook "${playbook_options[@]}" ~/Azure_SAP_Automated_Deployment/sap-automation/deploy/ansible/playbook_05_00_00_sap_scs_install.yaml
```

# [Windows](#tab/windows)

The playbook performs the following tasks:

- Central Services installation.
- Windows failover cluster configuration.

```bash
cd ${HOME}/Azure_SAP_Automated_Deployment/WORKSPACES/SYSTEM/LAB-SECE-SAP04-L00/

export                   sap_sid=L00
export       workload_vault_name="LABSECESAP04user###"
export  ANSIBLE_PRIVATE_KEY_FILE=sshkey
                          prefix="LAB-SECE-SAP04"

password_secret_name=$prefix-sid-password

password_secret=$(az keyvault secret show --vault-name ${workload_vault_name} --name ${password_secret_name} --query value --output table)
export ANSIBLE_PASSWORD=$password_secret

playbook_options=(
        --inventory-file="${sap_sid}_hosts.yaml"
        --private-key=${ANSIBLE_PRIVATE_KEY_FILE}
        --extra-vars="_workspace_directory=`pwd`"
        --extra-vars ansible_ssh_pass='{{ lookup("env", "ANSIBLE_PASSWORD") }}'
        --extra-vars="@sap-parameters.yaml"
        "${@}"
)

# Run the playbook to install SAP Central Services
ansible-playbook "${playbook_options[@]}" ~/Azure_SAP_Automated_Deployment/sap-automation/deploy/ansible/playbook_05_00_00_sap_scs_install.yaml
```

---

## Install the database server

This playbook performs the database server installation.

You can run the playbook by using:

- The DevOps pipeline `Configuration and SAP installation` by choosing `Database installation`.
- The configuration menu script `configuration_menu.sh`.
- The command line.

# [Linux](#tab/linux)

The playbook performs the following task:

- Database instance installation.

```bash
cd ${HOME}/Azure_SAP_Automated_Deployment/WORKSPACES/SYSTEM/LAB-SECE-SAP04-L00/

export                   sap_sid=L00
export  ANSIBLE_PRIVATE_KEY_FILE=sshkey

playbook_options=(
        --inventory-file="${sap_sid}_hosts.yaml"
        --private-key=${ANSIBLE_PRIVATE_KEY_FILE}
        --extra-vars="_workspace_directory=`pwd`"
        --extra-vars ansible_ssh_pass='{{ lookup("env", "ANSIBLE_PASSWORD") }}'
        --extra-vars="@sap-parameters.yaml"
        "${@}"
)

# Run the playbook to retrieve the ssh key from the Azure key vault
ansible-playbook "${playbook_options[@]}" ~/Azure_SAP_Automated_Deployment/sap-automation/deploy/ansible/pb_get-sshkey.yaml

# Run the playbook to install the database
ansible-playbook "${playbook_options[@]}" ~/Azure_SAP_Automated_Deployment/sap-automation/deploy/ansible/playbook_04_00_00_db_install.yaml
```

# [Windows](#tab/windows)

The playbook performs the following task:

- Database instance installation.

```bash
cd ${HOME}/Azure_SAP_Automated_Deployment/WORKSPACES/SYSTEM/LAB-SECE-SAP04-L00/

export                   sap_sid=L00
export       workload_vault_name="LABSECESAP04user###"
export  ANSIBLE_PRIVATE_KEY_FILE=sshkey
                          prefix="LAB-SECE-SAP04"

password_secret_name=$prefix-sid-password

password_secret=$(az keyvault secret show --vault-name ${workload_vault_name} --name ${password_secret_name} --query value --output table)
export ANSIBLE_PASSWORD=$password_secret

playbook_options=(
        --inventory-file="${sap_sid}_hosts.yaml"
        --private-key=${ANSIBLE_PRIVATE_KEY_FILE}
        --extra-vars="_workspace_directory=`pwd`"
        --extra-vars ansible_ssh_pass='{{ lookup("env", "ANSIBLE_PASSWORD") }}'
        --extra-vars="@sap-parameters.yaml"
        "${@}"
)

# Run the playbook to install the database
ansible-playbook "${playbook_options[@]}" ~/Azure_SAP_Automated_Deployment/sap-automation/deploy/ansible/playbook_04_00_00_db_install.yaml
```

---

## Load the database

This playbook performs the database load.

You can run the playbook by using:

- The DevOps pipeline `Configuration and SAP installation` by choosing `Database Load`.
- The configuration menu script `configuration_menu.sh`.
- The command line.

# [Linux](#tab/linux)

The playbook performs the following task:

- Database loading.

```bash
cd ${HOME}/Azure_SAP_Automated_Deployment/WORKSPACES/SYSTEM/LAB-SECE-SAP04-L00/

export                   sap_sid=L00
export  ANSIBLE_PRIVATE_KEY_FILE=sshkey

playbook_options=(
        --inventory-file="${sap_sid}_hosts.yaml"
        --private-key=${ANSIBLE_PRIVATE_KEY_FILE}
        --extra-vars="_workspace_directory=`pwd`"
        --extra-vars ansible_ssh_pass='{{ lookup("env", "ANSIBLE_PASSWORD") }}'
        --extra-vars="@sap-parameters.yaml"
        "${@}"
)

# Run the playbook to retrieve the ssh key from the Azure key vault
ansible-playbook "${playbook_options[@]}" ~/Azure_SAP_Automated_Deployment/sap-automation/deploy/ansible/pb_get-sshkey.yaml

# Run the playbook to load the database
ansible-playbook "${playbook_options[@]}" ~/Azure_SAP_Automated_Deployment/sap-automation/deploy/ansible/playbook_05_01_sap_dbload.yaml
```

# [Windows](#tab/windows)

The playbook performs the following task:

- Database loading.

```bash
cd ${HOME}/Azure_SAP_Automated_Deployment/WORKSPACES/SYSTEM/LAB-SECE-SAP04-L00/

export                   sap_sid=L00
export       workload_vault_name="LABSECESAP04user###"
export  ANSIBLE_PRIVATE_KEY_FILE=sshkey
                          prefix="LAB-SECE-SAP04"

password_secret_name=$prefix-sid-password

password_secret=$(az keyvault secret show --vault-name ${workload_vault_name} --name ${password_secret_name} --query value --output table)
export ANSIBLE_PASSWORD=$password_secret

playbook_options=(
        --inventory-file="${sap_sid}_hosts.yaml"
        --private-key=${ANSIBLE_PRIVATE_KEY_FILE}
        --extra-vars="_workspace_directory=`pwd`"
        --extra-vars ansible_ssh_pass='{{ lookup("env", "ANSIBLE_PASSWORD") }}'
        --extra-vars="@sap-parameters.yaml"
        "${@}"
)

# Run the playbook to load the database
ansible-playbook "${playbook_options[@]}" ~/Azure_SAP_Automated_Deployment/sap-automation/deploy/ansible/playbook_05_01_sap_dbload.yaml
```

---

## Configure database high availability

This playbook configures database server high availability.

You can run the playbook by using:

- The DevOps pipeline `Configuration and SAP installation` by choosing `Database High Availability Configuration`.
- The configuration menu script `configuration_menu.sh`.
- The command line.

# [Linux](#tab/linux)

The playbook performs the following tasks:

- Database high-availability configuration.
- For HANA, the playbook also configures the Pacemaker cluster needed for SAP HANA for high availability on Linux and configures HANA System replication.
- For Oracle, the playbook also configures Oracle Data Guard.

```bash
cd ${HOME}/Azure_SAP_Automated_Deployment/WORKSPACES/SYSTEM/LAB-SECE-SAP04-L00/

export                   sap_sid=L00
export  ANSIBLE_PRIVATE_KEY_FILE=sshkey

playbook_options=(
        --inventory-file="${sap_sid}_hosts.yaml"
        --private-key=${ANSIBLE_PRIVATE_KEY_FILE}
        --extra-vars="_workspace_directory=`pwd`"
        --extra-vars ansible_ssh_pass='{{ lookup("env", "ANSIBLE_PASSWORD") }}'
        --extra-vars="@sap-parameters.yaml"
        "${@}"
)

# Run the playbook to retrieve the ssh key from the Azure key vault
ansible-playbook "${playbook_options[@]}" ~/Azure_SAP_Automated_Deployment/sap-automation/deploy/ansible/pb_get-sshkey.yaml

# Run the playbook to configure database high availability
ansible-playbook "${playbook_options[@]}" ~/Azure_SAP_Automated_Deployment/sap-automation/deploy/ansible/playbook_04_00_01_db_ha.yaml
```

# [Windows](#tab/windows)

The playbook performs the following tasks:

- Database high-availability configuration.
- SQL Server Always On availability group configuration.

```bash
cd ${HOME}/Azure_SAP_Automated_Deployment/WORKSPACES/SYSTEM/LAB-SECE-SAP04-L00/

export                   sap_sid=L00
export       workload_vault_name="LABSECESAP04user###"
export  ANSIBLE_PRIVATE_KEY_FILE=sshkey
                          prefix="LAB-SECE-SAP04"

password_secret_name=$prefix-sid-password

password_secret=$(az keyvault secret show --vault-name ${workload_vault_name} --name ${password_secret_name} --query value --output table)
export ANSIBLE_PASSWORD=$password_secret

playbook_options=(
        --inventory-file="${sap_sid}_hosts.yaml"
        --private-key=${ANSIBLE_PRIVATE_KEY_FILE}
        --extra-vars="_workspace_directory=`pwd`"
        --extra-vars ansible_ssh_pass='{{ lookup("env", "ANSIBLE_PASSWORD") }}'
        --extra-vars="@sap-parameters.yaml"
        "${@}"
)

# Run the playbook to configure database high availability
ansible-playbook "${playbook_options[@]}" ~/Azure_SAP_Automated_Deployment/sap-automation/deploy/ansible/playbook_04_00_01_db_ha.yaml
```

---

## Install the primary application server

This playbook installs the primary application server.

You can run the playbook by using:

- The DevOps pipeline `Configuration and SAP installation` by choosing `Primary Application Server Installation`.
- The configuration menu script `configuration_menu.sh`.
- The command line.

# [Linux](#tab/linux)

The playbook performs the following task:

- Primary application server installation.

```bash
cd ${HOME}/Azure_SAP_Automated_Deployment/WORKSPACES/SYSTEM/LAB-SECE-SAP04-L00/

export                   sap_sid=L00
export  ANSIBLE_PRIVATE_KEY_FILE=sshkey

playbook_options=(
        --inventory-file="${sap_sid}_hosts.yaml"
        --private-key=${ANSIBLE_PRIVATE_KEY_FILE}
        --extra-vars="_workspace_directory=`pwd`"
        --extra-vars ansible_ssh_pass='{{ lookup("env", "ANSIBLE_PASSWORD") }}'
        --extra-vars="@sap-parameters.yaml"
        "${@}"
)

# Run the playbook to retrieve the ssh key from the Azure key vault
ansible-playbook "${playbook_options[@]}" ~/Azure_SAP_Automated_Deployment/sap-automation/deploy/ansible/pb_get-sshkey.yaml

# Run the playbook to install the primary application server
ansible-playbook "${playbook_options[@]}" ~/Azure_SAP_Automated_Deployment/sap-automation/deploy/ansible/playbook_05_02_sap_pas_install.yaml
```

# [Windows](#tab/windows)

The playbook performs the following task:

- Primary application server installation.

```bash
cd ${HOME}/Azure_SAP_Automated_Deployment/WORKSPACES/SYSTEM/LAB-SECE-SAP04-L00/

export                   sap_sid=L00
export       workload_vault_name="LABSECESAP04user###"
export  ANSIBLE_PRIVATE_KEY_FILE=sshkey
                          prefix="LAB-SECE-SAP04"

password_secret_name=$prefix-sid-password

password_secret=$(az keyvault secret show --vault-name ${workload_vault_name} --name ${password_secret_name} --query value --output table)
export ANSIBLE_PASSWORD=$password_secret

playbook_options=(
        --inventory-file="${sap_sid}_hosts.yaml"
        --private-key=${ANSIBLE_PRIVATE_KEY_FILE}
        --extra-vars="_workspace_directory=`pwd`"
        --extra-vars ansible_ssh_pass='{{ lookup("env", "ANSIBLE_PASSWORD") }}'
        --extra-vars="@sap-parameters.yaml"
        "${@}"
)

# Run the playbook to install the primary application server
ansible-playbook "${playbook_options[@]}" ~/Azure_SAP_Automated_Deployment/sap-automation/deploy/ansible/playbook_05_02_sap_pas_install.yaml
```

---

## Install multiple application servers

This playbook installs an extra application server.

You can run the playbook by using:

- The DevOps pipeline `Configuration and SAP installation` by choosing `Application Server Installation`.
- The configuration menu script `configuration_menu.sh`.
- The command line.

# [Linux](#tab/linux)

The playbook performs the following task:

- Application server installation.

```bash
cd ${HOME}/Azure_SAP_Automated_Deployment/WORKSPACES/SYSTEM/LAB-SECE-SAP04-L00/

export                   sap_sid=L00
export  ANSIBLE_PRIVATE_KEY_FILE=sshkey

playbook_options=(
        --inventory-file="${sap_sid}_hosts.yaml"
        --private-key=${ANSIBLE_PRIVATE_KEY_FILE}
        --extra-vars="_workspace_directory=`pwd`"
        --extra-vars ansible_ssh_pass='{{ lookup("env", "ANSIBLE_PASSWORD") }}'
        --extra-vars="@sap-parameters.yaml"
        "${@}"
)

# Run the playbook to retrieve the ssh key from the Azure key vault
ansible-playbook "${playbook_options[@]}" ~/Azure_SAP_Automated_Deployment/sap-automation/deploy/ansible/pb_get-sshkey.yaml

# Run the playbook to install the application servers
ansible-playbook "${playbook_options[@]}" ~/Azure_SAP_Automated_Deployment/sap-automation/deploy/ansible/playbook_05_02_sap_app_install.yaml
```

# [Windows](#tab/windows)

The playbook performs the following task:

- Application server installation.

```bash
cd ${HOME}/Azure_SAP_Automated_Deployment/WORKSPACES/SYSTEM/LAB-SECE-SAP04-L00/

export                   sap_sid=L00
export       workload_vault_name="LABSECESAP04user###"
export  ANSIBLE_PRIVATE_KEY_FILE=sshkey
                          prefix="LAB-SECE-SAP04"

password_secret_name=$prefix-sid-password

password_secret=$(az keyvault secret show --vault-name ${workload_vault_name} --name ${password_secret_name} --query value --output table)
export ANSIBLE_PASSWORD=$password_secret

playbook_options=(
        --inventory-file="${sap_sid}_hosts.yaml"
        --private-key=${ANSIBLE_PRIVATE_KEY_FILE}
        --extra-vars="_workspace_directory=`pwd`"
        --extra-vars ansible_ssh_pass='{{ lookup("env", "ANSIBLE_PASSWORD") }}'
        --extra-vars="@sap-parameters.yaml"
        "${@}"
)

# Run the playbook to install the application servers
ansible-playbook "${playbook_options[@]}" ~/Azure_SAP_Automated_Deployment/sap-automation/deploy/ansible/playbook_05_02_sap_app_install.yaml
```

---

## Install the Web Dispatcher

This playbook installs the Web Dispatchers.

You can run the playbook by using:

- The DevOps pipeline `Configuration and SAP installation` by choosing `Web Dispatcher Installation`.
- The configuration menu script `configuration_menu.sh`.
- The command line.

# [Linux](#tab/linux)

The playbook performs the following task:

- Web Dispatcher installation.

```bash
cd ${HOME}/Azure_SAP_Automated_Deployment/WORKSPACES/SYSTEM/LAB-SECE-SAP04-L00/

export                   sap_sid=L00
export  ANSIBLE_PRIVATE_KEY_FILE=sshkey

playbook_options=(
        --inventory-file="${sap_sid}_hosts.yaml"
        --private-key=${ANSIBLE_PRIVATE_KEY_FILE}
        --extra-vars="_workspace_directory=`pwd`"
        --extra-vars ansible_ssh_pass='{{ lookup("env", "ANSIBLE_PASSWORD") }}'
        --extra-vars="@sap-parameters.yaml"
        "${@}"
)

# Run the playbook to retrieve the ssh key from the Azure key vault
ansible-playbook "${playbook_options[@]}" ~/Azure_SAP_Automated_Deployment/sap-automation/deploy/ansible/pb_get-sshkey.yaml

# Run the playbook to install the Web Dispatcher
ansible-playbook "${playbook_options[@]}" ~/Azure_SAP_Automated_Deployment/sap-automation/deploy/ansible/playbook_05_04_sap_web_install.yaml
```

# [Windows](#tab/windows)

The playbook performs the following task:

- Web Dispatcher installation.

```bash
cd ${HOME}/Azure_SAP_Automated_Deployment/WORKSPACES/SYSTEM/LAB-SECE-SAP04-L00/

export                   sap_sid=L00
export       workload_vault_name="LABSECESAP04user###"
export  ANSIBLE_PRIVATE_KEY_FILE=sshkey
                          prefix="LAB-SECE-SAP04"

password_secret_name=$prefix-sid-password

password_secret=$(az keyvault secret show --vault-name ${workload_vault_name} --name ${password_secret_name} --query value --output table)
export ANSIBLE_PASSWORD=$password_secret

playbook_options=(
        --inventory-file="${sap_sid}_hosts.yaml"
        --private-key=${ANSIBLE_PRIVATE_KEY_FILE}
        --extra-vars="_workspace_directory=`pwd`"
        --extra-vars ansible_ssh_pass='{{ lookup("env", "ANSIBLE_PASSWORD") }}'
        --extra-vars="@sap-parameters.yaml"
        "${@}"
)


# Run the playbook to install the Web Dispatcher
ansible-playbook "${playbook_options[@]}" ~/Azure_SAP_Automated_Deployment/sap-automation/deploy/ansible/playbook_05_04_sap_web_install.yaml
```

---

## Register the system in ACSS

This playbook performs the Azure Center for SAP Solutions (ACSS) registration.

You can run the playbook by using:

- The DevOps pipeline `Configuration and SAP installation` by choosing `Register System in ACSS`.
- The configuration menu script `configuration_menu.sh`.
- The command line.

# [Linux](#tab/linux)

The playbook performs the following task:

- ACSS registration.

```bash
cd ${HOME}/Azure_SAP_Automated_Deployment/WORKSPACES/SYSTEM/LAB-SECE-SAP04-L00/

export                   sap_sid=L00
export  ANSIBLE_PRIVATE_KEY_FILE=sshkey

playbook_options=(
        --inventory-file="${sap_sid}_hosts.yaml"
        --private-key=${ANSIBLE_PRIVATE_KEY_FILE}
        --extra-vars="_workspace_directory=`pwd`"
        --extra-vars ansible_ssh_pass='{{ lookup("env", "ANSIBLE_PASSWORD") }}'
        --extra-vars="@sap-parameters.yaml"
        "${@}"
)

# Run the playbook to retrieve the ssh key from the Azure key vault
ansible-playbook "${playbook_options[@]}" ~/Azure_SAP_Automated_Deployment/sap-automation/deploy/ansible/pb_get-sshkey.yaml

# Run the playbook to register the system in ACSS
ansible-playbook "${playbook_options[@]}" ~/Azure_SAP_Automated_Deployment/sap-automation/deploy/ansible/playbook_06_00_acss_registration.yaml
```

# [Windows](#tab/windows)

The playbook performs the following task:

- ACSS registration.

```bash
cd ${HOME}/Azure_SAP_Automated_Deployment/WORKSPACES/SYSTEM/LAB-SECE-SAP04-L00/

export                   sap_sid=L00
export       workload_vault_name="LABSECESAP04user###"
export  ANSIBLE_PRIVATE_KEY_FILE=sshkey
                          prefix="LAB-SECE-SAP04"

password_secret_name=$prefix-sid-password

password_secret=$(az keyvault secret show --vault-name ${workload_vault_name} --name ${password_secret_name} --query value --output table)
export ANSIBLE_PASSWORD=$password_secret

playbook_options=(
        --inventory-file="${sap_sid}_hosts.yaml"
        --private-key=${ANSIBLE_PRIVATE_KEY_FILE}
        --extra-vars="_workspace_directory=`pwd`"
        --extra-vars ansible_ssh_pass='{{ lookup("env", "ANSIBLE_PASSWORD") }}'
        --extra-vars="@sap-parameters.yaml"
        "${@}"
)

# Run the playbook to register the system in ACSS
ansible-playbook "${playbook_options[@]}" ~/Azure_SAP_Automated_Deployment/sap-automation/deploy/ansible/playbook_06_00_acss_registration.yaml
```

---

## Related content

- [Get started with SAP Deployment Automation Framework](get-started.md)
- [Download SAP software](software.md)
- [Prepare the Bill of Materials](bom-prepare.md)

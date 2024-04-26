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
ms.custom: devx-track-ansible, devx-track-azurecli
---

# Get started with Ansible configuration

When you use [SAP Deployment Automation Framework](deployment-framework.md), you can perform an [automated infrastructure deployment](get-started.md). You can also do the required operating system configurations and install SAP by using Ansible playbooks provided in the repository. These playbooks are located in the automation framework repository in the `/sap-automation/deploy/ansible` folder.

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

The `L00_hosts.yaml` file is the inventory file that Ansible uses for configuration of the SAP infrastructure. The `L00` label might differ for your deployments.

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

Make sure that you [download the SAP software](software.md) to your Azure environment before you run this step.

One way you can run the playbooks is to use the configuration menu.

Run the `configuration_menu` script.

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

## Operating system configuration

The operating system configuration playbook is used to configure the operating system of the SAP virtual machines. The playbook performs the following tasks.

You can run the playbook by using either:

- The DevOps pipeline `Configuration and SAP installation` by choosing `Core Operating System Configuration`.
- The configuration menu script `configuration_menu.sh`.
- The command line.

# [Linux](#tab/linux)

The following tasks are executed on Linux virtual machines:

- Enable logging for `sudo` operations.
- Ensure that the Azure virtual machine agent is configured correctly.
- Ensure that all the repositories are registered and enabled.
- Ensure that all the packages are installed.
- Create volume groups and logical volumes.
- Configure the kernel parameters.
- Configure routing for more network interfaces (if necessary).
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

The following tasks are executed on Windows virtual machines:

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

## SAP-specific operating system configuration

The SAP-specific operating system configuration playbook is used to configure the operating system of the SAP virtual machines. The playbook performs the following tasks.

# [Linux](#tab/linux)

The following tasks are executed on Linux virtual machines:

- Configure the hosts file.
- Ensure that all the SAP-specific repositories are registered and enabled.
- Ensure that all the SAP-specific packages are installed.
- Perform the disk mount operations.
- Configure the SAP-specific services.
- Implement configurations defined in the relevant SAP Notes.

You can run the playbook by using either:

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

The following tasks are executed on Windows virtual machines:

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

## Local software download

This playbook downloads the installation media from the control plane to the installation media source. The installation media can be shared out from the central services instance or from Azure Files or Azure NetApp Files.

You can run the playbook by using either:

- The DevOps pipeline `Configuration and SAP installation` by choosing `Local software download`.
- The configuration menu script `configuration_menu.sh`.
- The command line.

# [Linux](#tab/linux)

The following tasks are executed on the central services instance virtual machine:

- Download the software from the storage account and make it available for the other virtual machines.

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

The following tasks are executed on the central services instance virtual machine:

- Download the software from the storage account and make it available for the other virtual machines.

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

## SAP Central Services and high-availability configuration

This playbook performs the Central Services installation. For high-availability scenarios, the playbook also configures the Pacemaker cluster needed for SAP Central Services for high availability on Linux and Windows Failover Clustering for Windows.

You can run the playbook by using either:

- The DevOps pipeline `Configuration and SAP installation` by choosing `SCS Installation & High Availability Configuration`.
- The configuration menu script `configuration_menu.sh`.
- The command line.

# [Linux](#tab/linux)

The playbook performs the following tasks:

- Central Services installation
- Pacemaker cluster configuration

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
ansible-playbook "${playbook_options[@]}" ~/Azure_SAP_Automated_Deployment/sap-automation/deploy/ansible/playbook_05_00_00_sap_scs_install.yaml

```

# [Windows](#tab/windows)

The playbook performs the following tasks:

- Central Services installation
- Windows failover cluster configuration

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
ansible-playbook "${playbook_options[@]}" ~/Azure_SAP_Automated_Deployment/sap-automation/deploy/ansible/playbook_05_00_00_sap_scs_install.yaml

```

---

## Database installation

This playbook performs the database server installation.

You can run the playbook by using either:

- The DevOps pipeline `Configuration and SAP installation` by choosing `Database installation`.
- The configuration menu script `configuration_menu.sh`.
- The command line.

# [Linux](#tab/linux)

The playbook performs the following task:

- Database instance installation

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
ansible-playbook "${playbook_options[@]}" ~/Azure_SAP_Automated_Deployment/sap-automation/deploy/ansible/playbook_04_00_00_db_install.yaml

```

# [Windows](#tab/windows)

The playbook performs the following task:

- Database instance installation

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
ansible-playbook "${playbook_options[@]}" ~/Azure_SAP_Automated_Deployment/sap-automation/deploy/ansible/playbook_04_00_00_db_install.yaml

```

---

## Database load

This playbook performs the Database load.

You can run the playbook by using either:

- The DevOps pipeline `Configuration and SAP installation` by choosing `Database Load`.
- The configuration menu script `configuration_menu.sh`.
- The command line.

# [Linux](#tab/linux)

The playbook performs the following task:

- Database load

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
ansible-playbook "${playbook_options[@]}" ~/Azure_SAP_Automated_Deployment/sap-automation/deploy/ansible/playbook_05_01_sap_dbload.yaml

```

# [Windows](#tab/windows)

The playbook performs the following task:

- Database load

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
ansible-playbook "${playbook_options[@]}" ~/Azure_SAP_Automated_Deployment/sap-automation/deploy/ansible/playbook_05_01_sap_dbload.yaml

```

---

## Database high-availability configuration

This playbook performs the database server high-availability configuration.

You can run the playbook by using either:

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

# Run the playbook to download the software from the SAP Library
ansible-playbook "${playbook_options[@]}" ~/Azure_SAP_Automated_Deployment/sap-automation/deploy/ansible/playbook_04_00_01_db_ha.yaml

```

# [Windows](#tab/windows)

The playbook performs the following tasks:

- Database high-availability configuration
- SQL Server Always On availability group configuration

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
ansible-playbook "${playbook_options[@]}" ~/Azure_SAP_Automated_Deployment/sap-automation/deploy/ansible/playbook_04_00_01_db_ha.yaml

```

---

## Primary application server installation

This playbook performs the installation of the primary application server.

You can run the playbook by using either:

- The DevOps pipeline `Configuration and SAP installation` by choosing `Primary Application Server Installation`.
- The configuration menu script `configuration_menu.sh`.
- The command line.

# [Linux](#tab/linux)

The playbook performs the following task:

- Primary application server installation

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
ansible-playbook "${playbook_options[@]}" ~/Azure_SAP_Automated_Deployment/sap-automation/deploy/ansible/playbook_05_02_sap_pas_install.yaml

```

# [Windows](#tab/windows)

The playbook performs the following task:

- Primary application server installation

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
ansible-playbook "${playbook_options[@]}" ~/Azure_SAP_Automated_Deployment/sap-automation/deploy/ansible/playbook_05_02_sap_pas_install.yaml

```

---

## Additional application server installation

This playbook performs the installation of the application servers.

You can run the playbook by using either:

- The DevOps pipeline `Configuration and SAP installation` by choosing `Application Server Installation`.
- The configuration menu script `configuration_menu.sh`.
- The command line.

# [Linux](#tab/linux)

The playbook performs the following task:

- Application server installation

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
ansible-playbook "${playbook_options[@]}" ~/Azure_SAP_Automated_Deployment/sap-automation/deploy/ansible/playbook_05_02_sap_app_install.yaml

```

# [Windows](#tab/windows)

The playbook performs the following task:

- Application server installation

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
ansible-playbook "${playbook_options[@]}" ~/Azure_SAP_Automated_Deployment/sap-automation/deploy/ansible/playbook_05_02_sap_app_install.yaml

```

---

## Web Dispatcher installation

This playbook performs the installation of the Web Dispatchers.

You can run the playbook by using either:

- The DevOps pipeline `Configuration and SAP installation` by choosing `Web Dispatcher Installation`.
- The configuration menu script `configuration_menu.sh`.
- The command line.

# [Linux](#tab/linux)

The playbook performs the following task:

- Web Dispatcher installation

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
ansible-playbook "${playbook_options[@]}" ~/Azure_SAP_Automated_Deployment/sap-automation/deploy/ansible/playbook_05_04_sap_web_install.yaml

```

# [Windows](#tab/windows)

The playbook performs the following task:

- Web Dispatcher installation

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
ansible-playbook "${playbook_options[@]}" ~/Azure_SAP_Automated_Deployment/sap-automation/deploy/ansible/playbook_05_04_sap_web_install.yaml

```

---

## ACSS registration

This playbook performs the Azure Center for SAP Solutions (ACSS) registration.

You can run the playbook by using either:

- The DevOps pipeline `Configuration and SAP installation` by choosing `Register System in ACSS`.
- The configuration menu script `configuration_menu.sh`.
- The command line.

# [Linux](#tab/linux)

The playbook performs the following task:

- ACSS registration

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
ansible-playbook "${playbook_options[@]}" ~/Azure_SAP_Automated_Deployment/sap-automation/deploy/ansible/playbook_06_00_acss_registration.yaml

```

# [Windows](#tab/windows)

The playbook performs the following task:

- ACSS registration

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
ansible-playbook "${playbook_options[@]}" ~/Azure_SAP_Automated_Deployment/sap-automation/deploy/ansible/playbook_06_00_acss_registration.yaml

```

---

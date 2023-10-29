---
title: Extensibility
description: Describe how to extend the SAP Deployment Automation Framework.
author: kimforss
ms.author: kimforss
ms.reviewer: kimforss
ms.date: 10/29/2023
ms.topic: conceptual
ms.service: sap-on-azure
ms.subservice: sap-automation
---

# Extending the SAP Deployment Automation Framework

There are several ways to extend the SAP Deployment Automation Framework. You can fork the source code repository and make the changes in your fork of the code. 

> [!NOTE]
> If you fork the source code repository, you must maintain your fork of the code. You must also merge the changes from the source code repository into your fork of the code whenever there is a new release of the SDAF codebase.

## Executing your own Ansible playbooks as part of the SAP Deployment Automation Framework Azure DevOps orchestration.

You can implement your own Ansible playbooks, which are automatically be called as part of the Azure DevOps 'OS Configuration and SAP Installation' pipeline.

The Ansible playbooks must be located in a folder called 'Ansible' located in the root folder in your configuration repository. They're called with the same parameter files as the SDAF playbooks so you have access to all the configuration.


The Ansible playbooks must be named according to the following naming convention:

'Playbook name_pre' for playbooks to be run before the SDAF playbook and 'Playbook name_post' for playbooks to be run after the SDAF playbook.

| Playbook name                             | Playbook name for 'pre' tasks                 | Playbook name for 'post' tasks                 | Description                                                        |
| ----------------------------------------- | --------------------------------------------- | ---------------------------------------------- | ----------------------------------------------------------------- |
| `playbook_01_os_base_config.yaml`         | `playbook_01_os_base_config_pre.yaml`         | `playbook_01_os_base_config_post.yaml`         | Base operating system configuration                               |
| `playbook_02_os_sap_specific_config.yaml` | `playbook_02_os_sap_specific_config_pre.yaml` | `playbook_02_os_sap_specific_config_post.yaml` | SAP specific configuration                                        |
| `playbook_03_bom_processing.yaml`         | `playbook_03_bom_processing_pre.yaml`         | `playbook_03_bom_processing_post.yaml`         | Bill of Material processing                                       |
| `playbook_04_00_00_db_install.yaml`       | `playbook_04_00_00_db_install_pre.yaml`       | `playbook_04_00_00_db_install_post.yaml`       | Database server installation                                      |
| `playbook_04_00_01_db_ha.yaml`            | `playbook_04_00_01_db_ha_pre.yaml`            | `playbook_04_00_01_db_ha_post.yaml`            | Database High Availability configuration                          |
| `playbook_05_00_00_sap_scs_install.yaml`  | `playbook_05_00_00_sap_scs_install_pre.yaml`  | `playbook_05_00_00_sap_scs_install_post.yaml`  | Central Services Installation and High Availability configuration |
| `playbook_05_01_sap_dbload.yaml`          | `playbook_05_01_sap_dbload_pre.yaml`          | `playbook_05_01_sap_dbload_post.yaml`          | Database load                                                     |
| `playbook_05_02_sap_pas_install.yaml`     | `playbook_05_02_sap_pas_install_pre.yaml`     | `playbook_05_02_sap_pas_install_post.yaml`     | Primary Application Server installation                           |
| `playbook_05_03_sap_app_install.yaml`     | `playbook_05_03_sap_app_install_pre.yaml`     | `playbook_05_03_sap_app_install_post.yaml`     | Additional Application Server installation                        |
| `playbook_05_04_sap_web_install.yaml`     | `playbook_05_04_sap_web_install_pre.yaml`     | `playbook_05_04_sap_web_install.yaml`          | Web dispatcher installation                                        |


### Sample Ansible playbook

```yaml	
---
# /*---------------------------------------------------------------------------8
# |                                                                            |
# |                  Run commands on all remote hosts                          |
# |                                                                            |
# +------------------------------------4--------------------------------------*/

- hosts: "{{ sap_sid | upper }}_DB  :
    {{ sap_sid | upper }}_SCS :
    {{ sap_sid | upper }}_ERS :
    {{ sap_sid | upper }}_PAS :
    {{ sap_sid | upper }}_APP :
    {{ sap_sid | upper }}_WEB"

  name:                                "Examples on how to run commands on remote hosts"
  gather_facts:                        true
  tasks:

    - name:                            "Calculate information about the OS distribution"
      ansible.builtin.set_fact:
        distro_family:                 "{{ ansible_os_family | upper }}"
        distribution_id:               "{{ ansible_distribution | lower ~ ansible_distribution_major_version }}"
        distribution_full_id:          "{{ ansible_distribution | lower ~ ansible_distribution_version }}"

    - name:                            "Show information"
      ansible.builtin.debug:
        msg:
          - "Distro family:        {{ distro_family }}"
          - "Distribution id:      {{ distribution_id }}"
          - "Distribution full id: {{ distribution_full_id }}"

    - name:                            "Show how to run a command on all remote host"
      ansible.builtin.command:         "whoami"
      register:                        whoami_results

    - name:                            "Show results"
      ansible.builtin.debug:
        var:                           whoami_results
        verbosity:                     0

    - name:                            "Show how to run a command on just the 'SCS' and 'ERS' hosts"
      ansible.builtin.command:         "whoami"
      register:                        whoami_results
      when: 
        - "'scs' in supported_tiers or 'ers' in supported_tiers "
...

```

## Adding custom repositories to the SAP Deployment Automation Framework installation for Linux

If you need to register additional Linux package repositories to the Virtual Machines deployed by the framework, you can add the following section to the sap-parameters-yaml file.

In this example, the repository 'epel' is registered on all the hosts in your SAP deployment that are running RedHat 8.2.

```yaml

custom_repos:
  redhat8.2:
    - { tier: 'ha', repo: 'epel', url: 'https://dl.fedoraproject.org/pub/epel/epel-release-latest-8.noarch.rpm', state: 'present' }

```

## Adding custom packages to the SAP Deployment Automation Framework installation for Linux

If you need to install additional Linux packages to the Virtual Machines deployed by the framework, you can add the following section to the sap-parameters-yaml file.

In this example, the package 'openssl' is installed on all the hosts in your SAP deployment that are running SUSE Enterprise Linux for SAP Applications version 15.3.

```yaml

custom_packages:
  sles_sap15.3:
    - { tier: 'os', package: 'openssl', node_tier: 'all', state: 'present' }

```

If you want to install a package on a specific server type (`app`, `ers`, `pas`, `scs`, `hana`) you can add the following section to the sap-parameters-yaml file.

```yaml

custom_packages:
  sles_sap15.3:
    - { tier: 'ha', package: 'pacemaker', node_tier: 'hana', state: 'present' }

```



## Adding custom kernel parameters to the SAP Deployment Automation Framework installation for Linux

You can extend the SAP Deployment Automation Framework by adding custom kernel parameters to the SDAF installation.

When you add the following section to the sap-parameters-yaml file, the parameter 'fs.suid_dumpable' is set to 0 on all the hosts in your SAP deployment.

```yaml

custom_parameters:
  common:
    - { tier: 'os', node_tier: 'all', name: 'fs.suid_dumpable', value: '0', state: 'present' }

```


## Next step

> [!div class="nextstepaction"]
> [Configure custom naming](naming-module.md)

---
title: Extensibility for the SAP Deployment Automation Framework
description: Describe how to extend the SAP Deployment Automation Framework.
author: kimforss
ms.author: kimforss
ms.reviewer: kimforss
ms.date: 10/29/2023
ms.topic: concept-article
ms.service: sap-on-azure
ms.subservice: sap-automation
ms.custom: devx-track-ansible, linux-related-content
# Customer intent: "As a cloud engineer, I want to extend the SAP Deployment Automation Framework by incorporating custom configurations and Ansible playbooks, so that I can tailor the deployment to meet specific operational requirements efficiently."
---

# Extending the SAP Deployment Automation Framework


Within the SAP Deployment Automation Framework (SDAF), we recognize the importance of adaptability and customization to meet the unique needs of various deployments. This document describes the ways to extend the framework's capabilities, ensuring that it aligns  with your specific requirements.

Some of the common scenarios for extending the framework include:

- Forking the Source Code Repository: One method of extending SDAF is by forking the source code repository. This approach grants you the flexibility to make tailored modifications within your own forked version of the code. By doing so, you gain control over the framework's core functionality, enabling you to tailor it precisely to your deployment objectives.

- Adding Stages to the SAP Configuration Pipeline: Another way to customization is by adding stages to the SAP configuration pipeline. This approach allows you to integrate specific processes or steps that are integral to your deployment workflows into the automation pipeline.

- Streamlined Extensibility: This capability allows you to effortlessly incorporate your existing Ansible playbooks directly into the SDAF. By using this feature, you can seamlessly integrate your Ansible automation scripts with the framework, further enhancing its versatility.

- Configuration extensibility: This feature allows you to extend the framework's configuration capabilities by adding custom repositories, packages, kernel parameters, logical volumes, mounts, and exports without the need to write any code.

Throughout this documentation, we provide comprehensive guidance on each of these extensibility options, ensuring that you have the knowledge and tools needed to tailor the SAP Deployment Automation Framework to your specific deployment needs.

> [!NOTE]
> If you fork the source code repository, you must maintain your fork of the code. You must also merge the changes from the source code repository into your fork of the code whenever there is a new release of the SDAF codebase.

## Executing your own Ansible playbooks as part of the Azure DevOps orchestration

You can implement your own Ansible playbooks, which are automatically be called as part of the Azure DevOps 'OS Configuration and SAP Installation' pipeline.

The Ansible playbooks must be located in a folder called 'Ansible' located in the root folder in your configuration repository. They're called with the same parameter files as the SDAF playbooks so you have access to all the configuration.


The Ansible playbooks must be named according to the following naming convention:

'Playbook name_pre' for playbooks to be run before the SDAF playbook and 'Playbook name_post' for playbooks to be run after the SDAF playbook.

| Playbook name                                           | Playbook name for 'pre' tasks                              | Playbook name for 'post' tasks                              | Description                                                       |
| ------------------------------------------------------- | ---------------------------------------------------------- | ----------------------------------------------------------- | ----------------------------------------------------------------- |
| `playbook_01_os_base_config.yaml`                       | `playbook_01_os_base_config_pre.yaml`                      | `playbook_01_os_base_config_post.yaml`                      | Base operating system configuration                               |
| `playbook_02_os_sap_specific_config.yaml`               | `playbook_02_os_sap_specific_config_pre.yaml`              | `playbook_02_os_sap_specific_config_post.yaml`              | SAP specific configuration                                        |
| `playbook_03_bom_processing.yaml`                       | `playbook_03_bom_processing_pre.yaml`                      | `playbook_03_bom_processing_post.yaml`                      | Bill of Material processing                                       |
| `playbook_04_00_00_db_install.yaml`                     | `playbook_04_00_00_db_install_pre.yaml`                    | `playbook_04_00_00_db_install_post.yaml`                    | Database server installation                                      |
| `playbook_04_00_01_db_ha.yaml`                          | `playbook_04_00_01_db_ha_pre.yaml`                         | `playbook_04_00_01_db_ha_post.yaml`                         | Database High Availability configuration                          |
| `playbook_05_00_00_sap_scs_install.yaml`                | `playbook_05_00_00_sap_scs_install_pre.yaml`               | `playbook_05_00_00_sap_scs_install_post.yaml`               | Central Services Installation and High Availability configuration |
| `playbook_05_01_sap_dbload.yaml`                        | `playbook_05_01_sap_dbload_pre.yaml`                       | `playbook_05_01_sap_dbload_post.yaml`                       | Database load                                                     |
| `playbook_05_02_sap_pas_install.yaml`                   | `playbook_05_02_sap_pas_install_pre.yaml`                  | `playbook_05_02_sap_pas_install_post.yaml`                  | Primary Application Server installation                           |
| `playbook_05_03_sap_app_install.yaml`                   | `playbook_05_03_sap_app_install_pre.yaml`                  | `playbook_05_03_sap_app_install_post.yaml`                  | Application Server installation                                   |
| `playbook_05_04_sap_web_install.yaml`                   | `playbook_05_04_sap_web_install_pre.yaml`                  | `playbook_05_04_sap_web_install_post.yaml`                  | Web dispatcher installation                                       |
| `playbook_08_00_00_post_configuration_actions.yaml`     | `playbook_08_00_00_post_configuration_actions_pre.yml`     | `playbook_08_00_00_post_configuration_actions_post.yml`     | Post Configuration Actions                                        |

> [!NOTE]
> The playbook_08_00_00_post_configuration_actions.yaml step has no SDAF provided roles/tasks, it's only there to facilitate `_pre` and `_post` hooks after SDAF has completed the installation and configuration.

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

## Updating the user and group IDs (Linux)

If you want to change the user and group IDs used by the framework, you can add the following section to the sap-parameters.yaml file.

```yaml
# User and group IDs
sapadm_uid:   "3000"
sidadm_uid:   "3100"
sapinst_gid:  "300"
sapsys_gid:   "400"

```

You can use the `configuration_settings` variable to let Terraform add them to sap-parameters.yaml file.

```terraform
configuration_settings = {
  sapadm_uid           = "3000",
  sidadm_uid           = "3100",
  sapinst_gid          = "300",
  sapsys_gid           = "400"
}

```

## Adding custom host names for instances (Linux)

In addition to the host names generated by the framework, you can add custom host names for the instances in your SAP deployment. To do so, add the following section to the sap-parameters.yaml file.

```yaml
custom_scs_virtual_hostname:   "myscshostname"
custom_ers_virtual_hostname:   "myershostname"
custom_db_virtual_hostname:    "mydbhostname"
custom_pas_virtual_hostname:   "mypashostname"
```

You can use the `configuration_settings` variable to let Terraform add them to sap-parameters.yaml file.

```terraform
configuration_settings = {
  custom_scs_virtual_hostname        = "myscshostname",
  custom_ers_virtual_hostname        = "myershostname",
  custom_db_virtual_hostname         = "mydbhostname",
  custom_pas_virtual_hostname        = "mypashostname"

}

```


## Adding custom repositories (Linux)

If you need to register extra Linux package repositories to the Virtual Machines deployed by the framework, you can add the following section to the sap-parameters.yaml file.

In this example, the repository 'epel' is registered on all the hosts in your SAP deployment that are running RedHat 8.2.

```yaml

custom_repos:
  redhat8.2:
    - { tier: 'ha', repo: 'epel', url: 'https://dl.fedoraproject.org/pub/epel/epel-release-latest-8.noarch.rpm', state: 'present' }

```

## Adding custom packages (Linux)

If you need to install more Linux packages to the Virtual Machines deployed by the framework, you can add the following section to the sap-parameters.yaml file.

In this example, the package 'openssl' is installed on all the hosts in your SAP deployment that are running SUSE Enterprise Linux for SAP Applications version 15.3.

```yaml

custom_packages:
  sles_sap15.3:
    - { tier: 'os', package: 'openssl', node_tier: 'all', state: 'present' }

```

If you want to install a package on a specific server type (`app`, `ers`, `pas`, `scs`, `hana`) you can add the following section to the sap-parameters.yaml file.

```yaml

custom_packages:
  sles_sap15.3:
    - { tier: 'ha', package: 'pacemaker', node_tier: 'hana', state: 'present' }

```

## Adding custom kernel parameters (Linux)

You can extend the SAP Deployment Automation Framework by adding custom kernel parameters to the SDAF installation.

When you add the following section to the sap-parameters.yaml file, the parameter 'fs.suid_dumpable' is set to 0 on all the hosts in your SAP deployment.

```yaml

custom_parameters:
  common:
    - { tier: 'os', node_tier: 'all', name: 'fs.suid_dumpable', value: '0', state: 'present' }

```

## Adding custom services (Linux)

If you need to manage other services on the Virtual Machines deployed by the framework, you can add the following section to the sap-parameters.yaml file.

In this example, the 'firewalld' service is stopped and disabled on all the hosts in your SAP deployment that are running RedHat 7.x.

```yaml

custom_services:
  redhat7:
    - { tier: 'os',          service: 'firewalld',    node_tier: 'all',     state: 'stopped'   }
    - { tier: 'os',          service: 'firewalld',    node_tier: 'all',     state: 'disabled'  }


```

## Adding custom logical volumes (Linux)

You can extend the SAP Deployment Automation Framework by adding logical volumes based on extra disks in your SDAF installation.

When you add the following section to the sap-parameters.yaml file, a logical volume 'lv_custom' is created on all Virtual machines with a disk with the name 'custom' in your SAP deployment. A filesystem is mounted on the logical volume and available on '/custompath.'


```yaml

custom_logical_volumes:
  - tier:       'sapos'
    node_tier:  'all'
    vg:         'vg_custom'
    lv:         'lv_custom'
    size:       '100%FREE'
    fstype:     'xfs'
    path:       '/custompath' 
```

> [!NOTE]
> In order to use this functionality you need to add an extra disk named 'custom' to one or more of your Virtual machines. For more information, see [Custom disk sizing](configure-extra-disks.md).

You can use the `configuration_settings` variable to let Terraform add them to sap-parameters.yaml file.

```terraform
configuration_settings = {
  custom_logical_volumes = [
    {
      tier      = 'sapos'
      node_tier = 'all'
      vg        = 'vg_custom'
      lv        = 'lv_custom'
      size      = '100%FREE'
      fstype    = 'xfs'
      path      = '/custompath' 
    }
  ]
}
```

## Adding custom mount (Linux)

You can extend the SAP Deployment Automation Framework by mounting extra mount points in your installation.

When you add the following section to the sap-parameters.yaml file, a filesystem '/usr/custom' is mounted from an NFS share on 'xxxxxxxxx.file.core.windows.net:/xxxxxxxxx/custom.'

```yaml

custom_mounts:
  - path:         "/usr/custom"
    opts:         "vers=4,minorversion=1,sec=sys"
    mount:        "xxxxxxxxx.file.core.windows.net:/xxxxxxxx/custom"
    target_nodes: "scs,pas,app"
```

The `target_nodes` attribute defines which nodes have the mount defined. Use 'all' if you want all nodes to have the mount defined.

You can use the `configuration_settings` variable to let Terraform add them to sap-parameters.yaml file.

```terraform
configuration_settings = {
  custom_mounts = [
    {
      path         = "/usr/custom",
      opts         = "vers=4,minorversion=1,sec=sys",
      mount        = "xxxxxxxxx.file.core.windows.net:/xxxxxxxx/custom",
      target_nodes = "scs,pas,app"
    }
  ]
}
```

## Adding custom export (Linux)

You can extend the SAP Deployment Automation Framework by adding extra folders to be exported from the Central Services virtual machine.

When you add the following section to the sap-parameters.yaml file, a filesystem '/usr/custom' is exported from the Central Services virtual machine and available via NFS.

```yaml

custom_exports:
    path:         "/usr/custom"

```

You can use the `configuration_settings` variable to let Terraform add them to sap-parameters.yaml file.

```terraform
configuration_settings = {
  custom_mounts = [
    {
      path         = "/usr/custom",
    }
  ]
}
```

> [!NOTE]
> This applies only for deployments with NFS_Provider set to 'NONE' as this makes the Central Services server an NFS Server.

## Custom Stripe sizes (Linux)

If you want to the stripe sizes used by the framework when creating the disks, you can add the following section to the sap-parameters.yaml file with the values you want.

```yaml
# User and group IDs
hana_data_stripe_size:                 256
hana_log_stripe_size:                  64

db2_log_stripe_size:                   64
db2_data_stripe_size:                  256
db2_temp_stripe_size:                  128

sybase_data_stripe_size:               256
sybase_log_stripe_size:                64
sybase_temp_stripe_size:               128

oracle_data_stripe_size:               256
oracle_log_stripe_size:                128

```

## Custom volume sizes (Linux)

If you want to the default volume sizes used by the framework, you can add the following section to the sap-parameters.yaml file with the values you want.

```yaml

sapmnt_volume_size:                    32g
usrsap_volume_size:                    32g
hanashared_volume_size:                32g
```

## Next step

> [!div class="nextstepaction"]
> [Configure custom naming](naming-module.md)

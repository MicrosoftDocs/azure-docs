---
title: Ansible module and version matrix for Azure
description: Ansible module and version matrix for Azure
ms.service: ansible
keywords: ansible, roles, matrix, version, azure, devops
author: tomarcher
manager: jeconnoc
ms.author: tarcher
ms.date: 09/22/2018
ms.topic: article
---

# Ansible module and version matrix

## Ansible modules for Azure
Ansible ships with a number of modules that can be executed directly on remote hosts or through playbooks.
This article lists the Ansible modules for Azure that can provision Azure cloud resources such as virtual machine, networking, and container services. You can get these modules from the official release of Ansible or from the following playbook roles published by Microsoft.

| Ansible module for Azure                   |  Ansible 2.4 |  Ansible 2.5 |  Ansible 2.6 | Ansible 2.7 | [Ansible Role](#introduction-to-azurepreviewmodule) | 
|---------------------------------------------|--------------|--------------|-----------------------------|-------------------------------------|-------------------------------------| 
| **Compute**                    |           |                          |                          |                            |                                | 
| azure_rm_availabilityset                    | Yes          | Yes                         | Yes          | Yes          | Yes                                 | 
| azure_rm_availabilityset_facts              | Yes          | Yes                         | Yes          | Yes          | Yes                                 | 
| azure_rm_deployment                         | Yes          | Yes                         | Yes          | Yes          | Yes                                 | 
| azure_rm_resource                           | -            | -                           | Yes          | Yes          | Yes                                 | 
| azure_rm_resource_facts                     | -            | -                           | Yes          | Yes          | Yes                                 | 
| azure_rm_virtualmachine_scaleset_facts      | Yes          | Yes                         | Yes          | Yes          | Yes                                 | 
| azure_rm_virtualmachineimage_facts          | Yes          | Yes                         | Yes          | Yes          | Yes                                 | 
| azure_rm_resourcegroup                      | Yes          | Yes                         | Yes          | Yes          | Yes                                 | 
| azure_rm_resourcegroup_facts                | Yes          | Yes                         | Yes          | Yes          | Yes                                 | 
| azure_rm_virtualmachine                     | Yes          | Yes                         | Yes          | Yes          | Yes                                 | 
| azure_rm_virtualmachine_facts               | -            | -                           | -            | Yes          | Yes                                 | 
| azure_rm_virtualmachine_extension           | Yes          | Yes                         | Yes          | Yes          | Yes                                 | 
| azure_rm_virtualmachine_scaleset            | Yes          | Yes                         | Yes          | Yes          | Yes                                 | 
| azure_rm_image                              |              | Yes                         | Yes          | Yes          | Yes                                 | 
| **Networking**                    |           |                          |                          |                             |                               | 
| azure_rm_virtualnetwork                     | Yes          | Yes                         | Yes          | Yes          | Yes                                 | 
| azure_rm_virtualnetwork_facts               | Yes          | Yes                         | Yes          | Yes          | Yes                                 | 
| azure_rm_subnet                             | Yes          | Yes                         | Yes          | Yes          | Yes                                 | 
| azure_rm_networkinterface                   | Yes          | Yes                         | Yes          | Yes          | Yes                                 | 
| azure_rm_networkinterface_facts             | Yes          | Yes                         | Yes          | Yes          | Yes                                 | 
| azure_rm_publicipaddress                    | Yes          | Yes                         | Yes          | Yes          | Yes                                 | 
| azure_rm_publicipaddress_facts              | Yes          | Yes                         | Yes          | Yes          | Yes                                 | 
| azure_rm_dnsrecordset                       | Yes          | Yes                         | Yes          | Yes          | Yes                                 | 
| azure_rm_dnsrecordset_facts                 | Yes          | Yes                         | Yes          | Yes          | Yes                                 | 
| azure_rm_dnszone                            | Yes          | Yes                         | Yes          | Yes          | Yes                                 | 
| azure_rm_dnszone_facts                      | Yes          | Yes                         | Yes          | Yes          | Yes                                 | 
| azure_rm_loadbalancer                       | Yes          | Yes                         | Yes          | Yes          | Yes                                 | 
| azure_rm_loadbalancer_facts                 | Yes          | Yes                         | Yes          | Yes          | Yes                                 | 
| azure_rm_appgateway                         | -            | -                           | -            | Yes          | Yes                                 | 
| azure_rm_appgwroute                         | -            | -                           | -            | -            | Yes                                 | 
| azure_rm_appgwroute                         | -            | -                           | -            | -            | Yes                                 |
| azure_rm_appgwroute_facts                   | -            | -                           | -            | -            | Yes                                 |
| azure_rm_appgwroutetable                    | -            | -                           | -            | -            | Yes                                 |
| azure_rm_appgwroutetable_facts              | -            | -                           | -            | -            | Yes                                 | 
| azure_rm_securitygroup                      | Yes          | Yes                         | Yes          | Yes          | Yes                                 |
| azure_rm_route                              | -            | -                           | -            | Yes          | Yes                                 | 
| azure_rm_routetable                         | -            | -                           | -            | Yes          | Yes                                 | 
| azure_rm_routetable_facts                   | -            | -                           | -            | Yes          | Yes                                 | 
| **Storage**                    |           |                          |                          |                             |                               | 
| azure_rm_storageaccount                     | Yes          | Yes                         | Yes          | Yes          | Yes                                 | 
| azure_rm_storageaccount_facts               | Yes          | Yes                         | Yes          | Yes          | Yes                                 | 
| azure_rm_storageblob                        | Yes          | Yes                         | Yes          | Yes          | Yes                                 | 
| azure_rm_managed_disk                       | Yes          | Yes                         | Yes          | Yes          | Yes                                 | 
| azure_rm_managed_disk_facts                 | Yes          | Yes                         | Yes          | Yes          | Yes                                 | 
| **Containers**                    |           |                          |                          |                            |                                | 
| azure_rm_aks                                | -            | -                           | Yes          | Yes          | Yes                                 | 
| azure_rm_aks_facts                          | -            | -                           | Yes          | Yes          | Yes                                 | 
| azure_rm_acs                                | Yes          | Yes                         | Yes          | Yes          | Yes                                 | 
| azure_rm_containerinstance                  | -            | Yes                         | Yes          | Yes          | Yes                                 | 
| azure_rm_containerinstance_facts            | -            | -                           | -              | -            | Yes                                 | 
| azure_rm_containerregistry                  | -            | Yes                         | Yes          | Yes          | Yes                                 | 
| azure_rm_containerregistry_facts            | -            | -                           | -            | Yes          | Yes                                 | 
| azure_rm_containerregistryreplication       | -            | -                           | -            | -            | Yes                                 | 
| azure_rm_containerregistryreplication_facts | -            | -                           | -            | -            | Yes                                 | 
| azure_rm_containerregistrywebhook           | -            | -                           | -            | -            | Yes                                 | 
| azure_rm_containerregistrywebhook_facts     | -            | -                           | -            | -            | Yes                                 | 
| **Azure Functions**                    |           |                          |                          |                            |                                | 
| azure_rm_functionapp                        | Yes          | Yes                         | Yes          | Yes          | Yes                                 | 
| azure_rm_functionapp_facts                  | Yes          | Yes                         | Yes          | Yes          | Yes                                 | 
| **Databases**                    |           |                          |                          |                             |                               | 
| azure_rm_sqlserver                          | -            | Yes                         | Yes          | Yes          | Yes                                 | 
| azure_rm_sqlserver_facts                    | -            | Yes                         | Yes          | Yes          | Yes                                 | 
| azure_rm_sqldatabase                        | -            | Yes                         | Yes          | Yes          | Yes                                 | 
| azure_rm_sqldatabase_facts                  | -            | -                           | -            | -            | Yes                                 | 
| azure_rm_sqlelasticpool                     | -            | -                           | -            | -            | Yes                                 | 
| azure_rm_sqlelasticpool_facts               | -            | -                           | -            | -            | Yes                                 | 
| azure_rm_sqlfirewallrule                    | -            | -                           | -            | Yes          | Yes                                 | 
| azure_rm_sqlfirewallrule_facts              | -            | -                           | -            | -            | Yes                                 | 
| azure_rm_mysqlserver                        | -            | Yes                         | Yes          | Yes          | Yes                                 | 
| azure_rm_mysqlserver_facts                  | -            | -                           | -            | Yes          | Yes                                 | 
| azure_rm_mysqldatabase                      | -            | Yes                         | Yes          | Yes          | Yes                                 | 
| azure_rm_mysqldatabase_facts                | -            | -                           | -            | Yes          | Yes                                 | 
| azure_rm_mysqlfirewallrule                  | -            | -                           | -            | -            | Yes                                 | 
| azure_rm_mysqlfirewallrule_facts            | -            | -                           | -            | -            | Yes                                 | 
| azure_rm_mysqlconfiguration                 | -            | -                           | -            | -            | Yes                                 | 
| azure_rm_mysqlconfiguration_facts           | -            | -                           | -            | -            | Yes                                 | 
| azure_rm_postgresqlserver                   | -            | Yes                         | Yes          | Yes          | Yes                                 | 
| azure_rm_postgresqlserver_facts             | -            | -                           | -            | Yes          | Yes                                 | 
| azure_rm_postgresqldatabase                 | -            | Yes                         | Yes          | Yes          | Yes                                 | 
| azure_rm_postgresqldatabase_facts           | -            | -                           | -            | Yes          | Yes                                 | 
| azure_rm_postgresqlfirewallrule             | -            | -                           | -            | -            | Yes                                 | 
| azure_rm_postgresqlfirewallrule_facts       | -            | -                           | -            | -            | Yes                                 | 
| azure_rm_postgresqlconfiguration            | -            | -                           | -            | -            | Yes                                 | 
| azure_rm_postgresqlconfiguration_facts      | -            | -                           | -            | -            | Yes                                 | 
| **Key Vault**                    |           |                          |                          |                             |                               | 
| azure_rm_keyvault                           | -            | Yes                         | Yes          | Yes          | Yes                                 |
| azure_rm_keyvault_facts                     | -            | -                           | -              | -              | Yes                               |
| azure_rm_keyvaultkey                        | -            | Yes                         | Yes          | Yes          | Yes                                 |
| azure_rm_keyvaultsecret                     | -            | Yes                         | Yes          | Yes          | Yes                                 |
| **Web Apps**                    |           |                          |                          |                             |                               | 
| azure_rm_appserviceplan                          | -            | -                         | -          | Yes          | Yes                                 | 
| azure_rm_appserviceplan_facts                    | -            | -                         | -          | Yes          | Yes                                 | 
| azure_rm_webapp                                  | -            | -                         | -          | Yes          | Yes                                 | 
| azure_rm_webapp_facts                            | -            | -                         | -          | Yes          | Yes                                 | 
| **Traffic Manager**                    |           |                          |                          |                             |                               | 
| azure_rm_trafficmanagerendpoint                  | -            | -                         | -          | Yes          | Yes                                 | 
| azure_rm_trafficmanagerendpoint_facts            | -            | -                         | -          | Yes          | Yes                                 | 
| azure_rm_trafficmanagerprofile                   | -            | -                         | -          | Yes          | Yes                                 | 
| azure_rm_trafficmanagerprofile_facts             | -            | -                         | -          | Yes          | Yes                                 | 
| **AutoScale**                    |           |                          |                          |                             |                               | 
| azure_rm_autoscale                  | -            | -                         | -          | Yes          | Yes                                 | 
| azure_rm_autoscale_facts            | -            | -                         | -          | Yes          | Yes                                 | 

## Introduction to playbook role for Azure
The [azure_preview_module playbook role](https://galaxy.ansible.com/Azure/azure_preview_modules/) is the most complete role and includes all the latest Azure modules. The updates and bug fixes are done in a more timely manner than the official Ansible release. If you use Ansible for Azure resource provisioning purposes, you're encouraged to install the azure_preview_module role.

The azure_preview_module playbook role is released every three weeks.

## Next steps
More information related to playbook roles, refer to [Creating Reusable Playbooks](http://docs.ansible.com/ansible/latest/playbooks_reuse.html). 

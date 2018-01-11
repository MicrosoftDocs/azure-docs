---
title: Ansible matrix
description: Ansible matrix
ms.service: ansible
keywords: ansible, roles, matrix, version, azure, devops
author: tomarcher
manager: routlaw
ms.author: tarcher
ms.date: 01/11/2018
ms.topic: article
---

| Ansible modules for Azure                   |  Ansible 2.4 |  Playbook Role azure_module |  Playbook Role azure_preview_module | 
|---------------------------------------------|--------------|-----------------------------|-------------------------------------| 
| azure_rm_availabilityset                    | Y            | Y                           | Y                                   | 
| azure_rm_availabilityset_facts              | Y            | Y                           | Y                                   | 
| azure_rm_deployment                         | Y            | Y                           | Y                                   | 
| azure_rm_virtualmachine_scaleset_facts      | Y            | Y                           | Y                                   | 
| azure_rm_virtualmachineimage_facts          | Y            | Y                           | Y                                   | 
| azure_rm_resourcegroup                      | Y            | Y                           | Y                                   | 
| azure_rm_resourcegroup_facts                | Y            | Y                           | Y                                   | 
| azure_rm_virtualmachine                     | Y            | Y                           | Y                                   | 
| azure_rm_virtualmachine_extension           | Y            | Y                           | Y                                   | 
| azure_rm_virtualmachine_scaleset            | Y            | Y                           | Y                                   | 
| azure_rm_virtualnetwork                     | Y            | Y                           | Y                                   | 
| azure_rm_virtualnetwork_facts               | Y            | Y                           | Y                                   | 
| azure_rm_subnet                             | Y            | Y                           | Y                                   | 
| azure_rm_networkinterface                   | Y            | Y                           | Y                                   | 
| azure_rm_networkinterface_facts             | Y            | Y                           | Y                                   | 
| azure_rm_publicipaddress                    | Y            | Y                           | Y                                   | 
| azure_rm_publicipaddress_facts              | Y            | Y                           | Y                                   | 
| azure_rm_dnsrecordset                       | Y            | Y                           | Y                                   | 
| azure_rm_dnsrecordset_facts                 | Y            | Y                           | Y                                   | 
| azure_rm_dnszone                            | Y            | Y                           | Y                                   | 
| azure_rm_dnszone_facts                      | Y            | Y                           | Y                                   | 
| azure_rm_loadbalancer                       | Y            | Y                           | Y                                   | 
| azure_rm_loadbalancer_facts                 | Y            | Y                           | Y                                   | 
| azure_rm_applicationgateway-                | -            | Y                           |                                     | 
| azure_rm_applicationgateway_facts           | -            | -                           | Y                                   | 
| azure_rm_securitygroup                      | -            | -                           | Y                                   | 
| azure_rm_securitygroup_facts                | -            | -                           | Y                                   | 
| azure_rm_storageaccount                     | Y            | Y                           | Y                                   | 
| azure_rm_storageaccount_facts               | Y            | Y                           | Y                                   | 
| azure_rm_storageblob                        | Y            | Y                           | Y                                   | 
| azure_rm_managed_disk                       | Y            | Y                           | Y                                   | 
| azure_rm_managed_disk_facts                 | Y            | Y                           | Y                                   | 
| azure_rm_acs                                | Y            | Y                           | Y                                   | 
| azure_rm_containerinstance                  | -            | -Y                          |                                     | 
| azure_rm_containerinstance_facts            | -            | -                           | Y                                   | 
| azure_rm_containerregistry                  | -            | Y                           | Y                                   | 
| azure_rm_containerregistry_facts            | -            | -                           | Y                                   | 
| azure_rm_containerregistryreplication       | -            | -                           | Y                                   | 
| azure_rm_containerregistryreplication_facts | -            | -                           | Y                                   | 
| azure_rm_containerregistrywebhook           | -            | -                           | Y                                   | 
| azure_rm_containerregistrywebhook_facts     | -            | -                           | Y                                   | 
| azure_rm_functionapp                        | Y            | Y                           | Y                                   | 
| azure_rm_functionapp_facts                  | Y            | Y                           | Y                                   | 
| azure_rm_sqlserver                          | -            | Y                           | Y                                   | 
| azure_rm_sqlserver_facts                    | -            | -                           | Y                                   | 
| azure_rm_sqldatabase                        | -            | -                           | Y                                   | 
| azure_rm_sqldatabase_facts                  | -            | -                           | Y                                   | 
| azure_rm_sqlelasticpool                     | -            | -                           | Y                                   | 
| azure_rm_sqlelasticpool_facts               | -            | -                           | Y                                   | 
| azure_rm_sqlfirewallrule                    | -            | -                           | Y                                   | 
| azure_rm_sqlfirewallrule_facts              | -            | -                           | Y                                   | 
| azure_rm_mysqlserver                        | -            | Y                           | Y                                   | 
| azure_rm_mysqlserver_facts                  | -            | -                           | Y                                   | 
| azure_rm_mysqldatabase                      | -            | -                           | Y                                   | 
| azure_rm_mysqldatabase_facts                | -            | -                           | Y                                   | 
| azure_rm_mysqlfirewallrule                  | -            | -                           | Y                                   | 
| azure_rm_mysqlfirewallrule_facts            | -            | -                           | Y                                   | 
| azure_rm_mysqlconfiguration                 | -            | -                           | Y                                   | 
| azure_rm_mysqlconfiguration_facts           | -            | -                           | Y                                   | 
| azure_rm_postgresqlserver                   | -            | Y                           | Y                                   | 
| azure_rm_postgresqlserver_facts             | -            | -                           | Y                                   | 
| azure_rm_postgresqldatabase                 | -            | -                           | Y                                   | 
| azure_rm_postgresqldatabase_facts           | -            | -                           | Y                                   | 
| azure_rm_postgresqlfirewallrule             | -            | -                           | Y                                   | 
| azure_rm_postgresqlfirewallrule_facts       | -            | -                           | Y                                   | 
| azure_rm_postgresqlconfiguration            | -            | -                           | Y                                   | 
| azure_rm_postgresqlconfiguration_facts      | -            | -                           | Y                                   | 

## Introduction to azure_module 
The [azure_module playbook role](https://galaxy.ansible.com/Azure/azure_modules/) includes the latest changes and bug fixes for Azure modules from the [devel branch of Ansible repository](https://github.com/ansible/ansible/tree/devel). If you cannot wait for Ansible's next release, installing this role is a good choice.

The azure_module playbook role is released every three weeks.

## Introduction to azure_preview_module
The [azure_preview_module playbook role](https://galaxy.ansible.com/Azure/azure_preview_modules/) is the most complete and includes all the latest Azure modules. The update and bug fixes are done in a more timely manner than the official Ansible release. If you use Ansible for Azure resource provisioning purposes, you're encouraged to install this role.

The azure_preview_module playbook role is released every three weeks.

## Next steps
More information related to playbook roles, refer to [Creating Reusable Playbooks](http://docs.ansible.com/ansible/latest/playbooks_reuse.html). 
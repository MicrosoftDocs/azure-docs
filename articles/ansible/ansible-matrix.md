---
title: Ansible module and version matrix for Azure | Microsoft Docs
description: Ansible module and version matrix for Azure
keywords: ansible, roles, matrix, version, azure, devops
ms.topic: reference
ms.service: ansible
author: tomarchermsft
manager: jeconnoc
ms.author: tarcher
ms.date: 04/30/2019
---

# Ansible module and version matrix

Ansible includes a suite of modules for use in provisioning and configuring Azure resources. These resources include virtual machines, scale sets, networking services, and container services. This article lists the various Ansible modules for Azure and the Ansible versions in which they ship.

## Ansible modules for Azure

The following modules can be executed directly on remote hosts or through playbooks.

These modules are available from the Ansible official release and from the following Microsoft playbook roles.

| Ansible module for Azure                   |  Ansible 2.4 |  Ansible 2.5 |  Ansible 2.6 | Ansible 2.7 | Ansible 2.8 | Ansible Role | 
|---------------------------------------------|--------------|--------------|-----------------------------|-------------------------------------|--------------|--------------| 
| **Compute**                    |           |                          |                          |                            |           |           |
| azure_rm_availabilityset                    | Yes          | Yes                         | Yes          | Yes          | Yes          | Yes          |
| azure_rm_availabilityset_facts              | Yes          | Yes                         | Yes          | Yes          | Yes          | Yes          |
| azure_rm_deployment                         | Yes          | Yes                         | Yes          | Yes          | Yes          | Yes          |
| azure_rm_deployment_facts                   | -            | -                           | -            | -            | Yes          | Yes          |
| azure_rm_functionapp                        | Yes          | Yes                         | Yes          | Yes          | Yes          | Yes          |
| azure_rm_functionapp_facts                  | Yes          | Yes                         | Yes          | Yes          | Yes          | Yes          |
| azure_rm_image                              | -            | Yes                         | Yes          | Yes          | Yes          | Yes          |
| azure_rm_image_facts                        | -            | -                           | -            | -            | Yes          | Yes          |
| azure_rm_resource                           | -            | -                           | Yes          | Yes          | Yes          | Yes          |
| azure_rm_resource_facts                     | -            | -                           | Yes          | Yes          | Yes          | Yes          |
| azure_rm_resourcegroup                      | Yes          | Yes                         | Yes          | Yes          | Yes          | Yes          |
| azure_rm_resourcegroup_facts                | Yes          | Yes                         | Yes          | Yes          | Yes          | Yes          |
| azure_rm_virtualmachine                     | Yes          | Yes                         | Yes          | Yes          | Yes          | Yes          |
| azure_rm_virtualmachine_facts               | -            | -                           | -            | Yes          | Yes          | Yes          |
| azure_rm_virtualmachineextension           | Yes          | Yes                         | Yes          | Yes          | Yes          | Yes          |
| azure_rm_virtualmachineextension_facts      | -            | -                           | -            | -            | Yes          | Yes          |
| azure_rm_virtualmachineimage_facts          | Yes          | Yes                         | Yes          | Yes          | Yes          | Yes          |
| azure_rm_virtualmachinescaleset            | Yes          | Yes                         | Yes          | Yes          | Yes          | Yes          |
| azure_rm_virtualmachinescaleset_facts      | Yes          | Yes                         | Yes          | Yes          | Yes          | Yes          |
| azure_rm_virtualmachinescalesetextension    | -            | -                           | -            | -            | Yes          | Yes          |
| azure_rm_virtualmachinescalesetextension_facts | -            | -                        | -            | -            | Yes          | Yes          |
| azure_rm_virtualmachinescalesetinstance     | -            | -                           | -            | -            | Yes          | Yes          |
| azure_rm_virtualmachinescalesetinstance_facts | -            | -                         | -            | -            | Yes          | Yes          |
| **Networking**                              |              |                             |              |              |              |              |
| azure_rm_appgateway                         | -            | -                           | -            | Yes          | Yes          | Yes          |
| azure_rm_appgwroute                         | -            | -                           | -            | -            | -          | Yes          |
| azure_rm_appgwroute_facts                   | -            | -                           | -            | -            | -          | Yes          |
| azure_rm_appgwroutetable                    | -            | -                           | -            | -            | -          | Yes          |
| azure_rm_appgwroutetable_facts              | -            | -                           | -            | -            | -          | Yes          |
| azure_rm_applicationsecuritygroup           | -            | -                           | -            | -            | Yes          | Yes          |
| azure_rm_applicationsecuritygroup_facts     | -            | -                           | -            | -            | Yes          | Yes          |
| azure_rm_cdnendpoint                        | -            | -                         | -          | -            | Yes          | Yes          |
| azure_rm_cdnendpoint_facts                  | -            | -                         | -          | -            | Yes          | Yes          |
| azure_rm_cdnprofile                         | -            | -                         | -          | -            | Yes          | Yes          |
| azure_rm_cdnprofile_facts                   | -            | -                         | -          | -            | Yes          | Yes          |
| azure_rm_dnsrecordset                       | Yes          | Yes                         | Yes          | Yes          | Yes          | Yes          |
| azure_rm_dnsrecordset_facts                 | Yes          | Yes                         | Yes          | Yes          | Yes          | Yes          |
| azure_rm_dnszone                            | Yes          | Yes                         | Yes          | Yes          | Yes          | Yes          |
| azure_rm_dnszone_facts                      | Yes          | Yes                         | Yes          | Yes          | Yes          | Yes          |
| azure_rm_loadbalancer                       | Yes          | Yes                         | Yes          | Yes          | Yes          | Yes          |
| azure_rm_loadbalancer_facts                 | Yes          | Yes                         | Yes          | Yes          | Yes          | Yes          |
| azure_rm_networkinterface                   | Yes          | Yes                         | Yes          | Yes          | Yes          | Yes          |
| azure_rm_networkinterface_facts             | Yes          | Yes                         | Yes          | Yes          | Yes          | Yes          |
| azure_rm_publicipaddress                    | Yes          | Yes                         | Yes          | Yes          | Yes          | Yes          |
| azure_rm_publicipaddress_facts              | Yes          | Yes                         | Yes          | Yes          | Yes          | Yes          |
| azure_rm_route                              | -            | -                           | -            | Yes          | Yes          | Yes          |
| azure_rm_routetable                         | -            | -                           | -            | Yes          | Yes          | Yes          |
| azure_rm_routetable_facts                   | -            | -                           | -            | Yes          | Yes          | Yes          |
| azure_rm_securitygroup                      | Yes          | Yes                         | Yes          | Yes          | Yes          | Yes          |
| azure_rm_subnet                             | Yes          | Yes                         | Yes          | Yes          | Yes          | Yes          |
| azure_rm_subnet_facts                       | -            | -                           | -            | -            | Yes          | Yes          |
| azure_rm_trafficmanagerendpoint             | -            | -                         | -          | Yes          | Yes          | Yes          |
| azure_rm_trafficmanagerendpoint_facts       | -            | -                         | -          | Yes          | Yes          | Yes          |
| azure_rm_trafficmanagerprofile              | -            | -                         | -          | Yes          | Yes          | Yes          |
| azure_rm_trafficmanagerprofile_facts        | -            | -                         | -          | Yes          | Yes          | Yes          |
| azure_rm_virtualnetwork                     | Yes          | Yes                         | Yes          | Yes          | Yes          | Yes          |
| azure_rm_virtualnetwork_facts               | Yes          | Yes                         | Yes          | Yes          | Yes          | Yes          |
| azure_rm_virtualnetworkpeering              | -            | -                         | -          | -            | Yes          | Yes          |
| **Storage**                    |           |                          |                          |                            |           |           |
| azure_rm_manageddisk                        | Yes          | Yes                         | Yes          | Yes          | Yes          | Yes          |
| azure_rm_manageddisk_facts                  | Yes          | Yes                         | Yes          | Yes          | Yes          | Yes          |
| azure_rm_storageaccount                     | Yes          | Yes                         | Yes          | Yes          | Yes          | Yes          |
| azure_rm_storageaccount_facts               | Yes          | Yes                         | Yes          | Yes          | Yes          | Yes          |
| azure_rm_storageblob                        | Yes          | Yes                         | Yes          | Yes          | Yes          | Yes          |
| **Web**                    |           |                          |                          |                             |           |           |
| azure_rm_appserviceplan                     | -            | -                         | -          | Yes          | Yes          | Yes          |
| azure_rm_appserviceplan_facts               | -            | -                         | -          | Yes          | Yes          | Yes          |
| azure_rm_webapp                             | -            | -                         | -          | Yes          | Yes          | Yes          |
| azure_rm_webapp_facts                       | -            | -                         | -          | Yes          | Yes          | Yes          |
| azure_rm_webappslot                         | -            | -                         | -          | -            | Yes          | Yes          |
| **Containers**                    |           |                          |                          |                            |           |           |
| azure_rm_acs                                | Yes          | Yes                         | Yes          | Yes          | Yes          | Yes          |
| azure_rm_aks                                | -            | -                           | Yes          | Yes          | Yes          | Yes          |
| azure_rm_aks_facts                          | -            | -                           | Yes          | Yes          | Yes          | Yes          |
| azure_rm_aksversion_facts                   | -            | -                           | -            | -            | Yes          | Yes          |
| azure_rm_containerinstance                  | -            | Yes                         | Yes          | Yes          | Yes          | Yes          |
| azure_rm_containerinstance_facts            | -            | -                           | -            | -            | Yes          | Yes          |
| azure_rm_containerregistry                  | -            | Yes                         | Yes          | Yes          | Yes          | Yes          |
| azure_rm_containerregistry_facts            | -            | -                           | -            | Yes          | Yes          | Yes          |
| azure_rm_containerregistryreplication       | -            | -                           | -            | -            | Yes          | Yes          |
| azure_rm_containerregistryreplication_facts | -            | -                           | -            | -            | Yes          | Yes          |
| azure_rm_containerregistrywebhook           | -            | -                           | -            | -            | Yes          | Yes          |
| azure_rm_containerregistrywebhook_facts     | -            | -                           | -            | -            | Yes          | Yes          |
| **Databases**                    |           |                          |                          |                             |           |           |
| azure_rm_cosmosdbaccount                    | -            | -                           | -            | -            | Yes          | Yes          |
| azure_rm_cosmosdbaccount_facts              | -            | -                           | -            | -            | Yes          | Yes          |
| azure_rm_mariadbconfiguration               | -            | -                           | -            | -            | Yes          | Yes          |
| azure_rm_mariadbconfiguration_facts         | -            | -                           | -            | -            | Yes          | Yes          |
| azure_rm_mariadbdatabase                    | -            | -                           | -            | -            | Yes          | Yes          |
| azure_rm_mariadbdatabase_facts              | -            | -                           | -            | -            | Yes          | Yes          |
| azure_rm_mariadbfirewallrule                | -            | -                           | -            | -            | Yes          | Yes          |
| azure_rm_mariadbfirewallrule_facts          | -            | -                           | -            | -            | Yes          | Yes          |
| azure_rm_mariadbserver                      | -            | -                           | -            | -            | Yes          | Yes          |
| azure_rm_mariadbserver_facts                | -            | -                           | -            | -            | Yes          | Yes          |
| azure_rm_mysqlconfiguration                 | -            | -                           | -            | -            | Yes          | Yes          |
| azure_rm_mysqlconfiguration_facts           | -            | -                           | -            | -            | Yes          | Yes          |
| azure_rm_mysqldatabase                      | -            | Yes                         | Yes          | Yes          | Yes          | Yes          |
| azure_rm_mysqldatabase_facts                | -            | -                           | -            | Yes          | Yes          | Yes          |
| azure_rm_mysqlfirewallrule                  | -            | -                           | -            | -            | Yes          | Yes          |
| azure_rm_mysqlfirewallrule_facts            | -            | -                           | -            | -            | Yes          | Yes          |
| azure_rm_mysqlserver                        | -            | Yes                         | Yes          | Yes          | Yes          | Yes          |
| azure_rm_mysqlserver_facts                  | -            | -                           | -            | Yes          | Yes          | Yes          |
| azure_rm_postgresqlconfiguration            | -            | -                           | -            | -            | Yes          | Yes          |
| azure_rm_postgresqlconfiguration_facts      | -            | -                           | -            | -            | Yes          | Yes          |
| azure_rm_postgresqldatabase                 | -            | Yes                         | Yes          | Yes          | Yes          | Yes          |
| azure_rm_postgresqldatabase_facts           | -            | -                           | -            | Yes          | Yes          | Yes          |
| azure_rm_postgresqlfirewallrule             | -            | -                           | -            | -            | Yes          | Yes          |
| azure_rm_postgresqlfirewallrule_facts       | -            | -                           | -            | -            | Yes          | Yes          |
| azure_rm_postgresqlserver                   | -            | Yes                         | Yes          | Yes          | Yes          | Yes          |
| azure_rm_postgresqlserver_facts             | -            | -                           | -            | Yes          | Yes          | Yes          |
| azure_rm_rediscache                         | -            | -                           | -            | -            | Yes          | Yes          |
| azure_rm_rediscache_facts                   | -            | -                           | -            | -            | Yes          | Yes          |
| azure_rm_rediscachefirewallrule             | -            | -                           | -            | -            | Yes          | Yes          |
| azure_rm_sqldatabase                        | -            | Yes                         | Yes          | Yes          | Yes          | Yes          |
| azure_rm_sqldatabase_facts                  | -            | -                           | -            | -            | Yes          | Yes          |
| azure_rm_sqlelasticpool                     | -            | -                           | -            | -            | Yes          | Yes          |
| azure_rm_sqlelasticpool_facts               | -            | -                           | -            | -            | Yes          | Yes          |
| azure_rm_sqlfirewallrule                    | -            | -                           | -            | Yes          | Yes          | Yes          |
| azure_rm_sqlfirewallrule_facts              | -            | -                           | -            | -            | Yes          | Yes          |
| azure_rm_sqlserver                          | -            | Yes                         | Yes          | Yes          | Yes          | Yes          |
| azure_rm_sqlserver_facts                    | -            | Yes                         | Yes          | Yes          | Yes          | Yes          |
| **Analytics**                    |           |                          |                          |                             |           |           |
| azure_rm_hdinsightcluster                   | -            | -                           | -            | -            | Yes          | Yes          |
| **Integration**                    |           |                          |                          |                             |           |           |
| azure_rm_servicebus                         | -            | -                           | -            | -            | Yes          | Yes          |
| azure_rm_servicebus_facts                   | -            | -                           | -            | -            | Yes          | Yes          |
| azure_rm_servicebusqueue                    | -            | -                           | -            | -            | Yes          | Yes          |
| azure_rm_servicebussaspolicy                | -            | -                           | -            | -            | Yes          | Yes          |
| azure_rm_servicebustopic                    | -            | -                           | -            | -            | Yes          | Yes          |
| azure_rm_servicebustopicsubscription        | -            | -                           | -            | -            | Yes          | Yes          |
| **Security**                    |           |                          |                          |                             |           |           |
| azure_rm_keyvault                           | -            | Yes                         | Yes          | Yes          | Yes          | Yes          |
| azure_rm_keyvault_facts                     | -            | -                           | -              | -          | Yes          | Yes          |
| azure_rm_keyvaultkey                        | -            | Yes                         | Yes          | Yes          | Yes          | Yes          |
| azure_rm_keyvaultsecret                     | -            | Yes                         | Yes          | Yes          | Yes          | Yes          |
| azure_rm_roleassignment                     | -            | -                           | -            | -            | Yes          | Yes          |
| azure_rm_roleassignment_facts               | -            | -                           | -            | -            | Yes          | Yes          |
| azure_rm_roledefinition                     | -            | -                           | -            | -            | Yes          | Yes          |
| azure_rm_roledefinition_facts               | -            | -                           | -            | -            | Yes          | Yes          |
| **DevOps**               |           |                          |                          |                             |           |           |
| azure_rm_devtestlab                         | -            | -                           | -            | -            | Yes          | Yes          |
| azure_rm_devtestlab_facts                   | -            | -                           | -            | -            | Yes          | Yes          |
| azure_rm_devtestlabarmtemplate_facts        | -            | -                           | -            | -            | Yes          | Yes          |
| azure_rm_devtestlabartifact_facts           | -            | -                           | -            | -            | Yes          | Yes          |
| azure_rm_devtestlabartifactsource           | -            | -                           | -            | -            | Yes          | Yes          |
| azure_rm_devtestlabartifactsource_facts     | -            | -                           | -            | -            | Yes          | Yes          |
| azure_rm_devtestlabcustomimage              | -            | -                           | -            | -            | Yes          | Yes          |
| azure_rm_devtestlabenvironment              | -            | -                           | -            | -            | Yes          | Yes          |
| azure_rm_devtestlabpolicy                   | -            | -                           | -            | -            | Yes          | Yes          |
| azure_rm_devtestlabschedule                 | -            | -                           | -            | -            | Yes          | Yes          |
| azure_rm_devtestlabvirtualmachine           | -            | -                           | -            | -            | Yes          | Yes          |
| azure_rm_devtestlabvirtualmachine_facts | -            | -                           | -            | -            | Yes          | Yes          |
| azure_rm_devtestlabvirtualnetwork           | -            | -                           | -            | -            | Yes          | Yes          |
| azure_rm_devtestlabvirtualnetwork_facts     | -            | -                           | -            | -            | Yes          | Yes          |
| **Azure Monitor**          |           |                          |                          |                             |           |           |
| azure_rm_autoscale                  | -            | -                         | -          | Yes          | Yes          | Yes          |
| azure_rm_autoscale_facts            | -            | -                         | -          | Yes          | Yes          | Yes          |
| azure_rm_loganalyticsworkspace              | -            | -                           | -            | -            | Yes          | Yes          |
| azure_rm_loganalyticsworkspace_facts        | -            | -                           | -            | -            | Yes          | Yes          |

## Introduction to playbook role for Azure

The [azure_preview_module playbook role](https://galaxy.ansible.com/Azure/azure_preview_modules/) includes all the latest Azure modules. The updates and bug fixes are done in a more timely manner than the official Ansible release. If you use Ansible for Azure resource provisioning purposes, you're encouraged to install the `azure_preview_module` playbook role.

The `azure_preview_module` playbook role is released every three weeks.

## Next steps

For more information about playbook roles, see [Creating reusable playbooks](https://docs.ansible.com/ansible/latest/playbooks_reuse.html). 

---
title: Ansible module and version matrix for Azure | Microsoft Docs
description: Ansible module and version matrix for Azure
keywords: ansible, roles, matrix, version, azure, devops
ms.topic: reference
ms.date: 10/14/2019
---

# Ansible module and version matrix

Ansible includes a suite of modules for use in provisioning and configuring Azure resources. These resources include virtual machines, scale sets, networking services, and container services. This article lists the various Ansible modules for Azure and the Ansible versions in which they ship.

## Ansible modules for Azure

The following modules can be executed directly on remote hosts or through playbooks.  

These modules are available from the Ansible official release and from the following Microsoft playbook roles.

> [!NOTE]
> From Ansible 2.9 onwards, we renamed all *_facts modules to *_info to adhere to Ansible naming convention. The old and renamed modules are linked so apart from seeing a deprecation warning, all modules work as before.

| Ansible module for Azure                   |  Ansible 2.4 |  Ansible 2.5 |  Ansible 2.6 | Ansible 2.7 | Ansible 2.8 | Ansible 2.9 | Ansible Role | 
|---------------------------------------------|--------------|--------------|-----------------------------|-------------------------------------|--------------|--------------|--------------|  
| **Compute**                    |           |                          |                          |                            |           |           |           |
| azure_rm_availabilityset                   | Yes          | Yes                         | Yes          | Yes          | Yes          | Yes          | Yes          |
| azure_rm_availabilityset_info              | Yes          | Yes                         | Yes          | Yes          | Yes          | Yes          | Yes          |
| azure_rm_batchaccount                       | -            | -                           | -            | -            | -            | Yes          | Yes          |
| azure_rm_deployment                         | Yes          | Yes                         | Yes          | Yes          | Yes          | Yes          | Yes          |
| azure_rm_deployment_info                   | -            | -                           | -            | -            | Yes          | Yes          | Yes          |
| azure_rm_functionapp                        | Yes          | Yes                         | Yes          | Yes          | Yes          | Yes          | Yes          |
| azure_rm_functionapp_info                  | Yes          | Yes                         | Yes          | Yes          | Yes          | Yes          | Yes          |
| azure_rm_gallery                            | -            | -                           | -            | -            | -            | Yes          | Yes          |
| azure_rm_gallery_info                       | -            | -                           | -            | -            | -            | Yes          | Yes          |
| azure_rm_galleryimage                       | -            | -                           | -            | -            | -            | Yes          | Yes          |
| azure_rm_galleryimage_info                  | -            | -                           | -            | -            | -            | Yes          | Yes          |
| azure_rm_galleryimageversion                | -            | -                           | -            | -            | -            | Yes          | Yes          |
| azure_rm_galleryimageversion_info           | -            | -                           | -            | -            | -            | Yes          | Yes          |
| azure_rm_image                              | -            | Yes                         | Yes          | Yes          | Yes          | Yes          | Yes          |
| azure_rm_image_info                        | -            | -                           | -            | -            | Yes          | Yes          | Yes          |
| azure_rm_resource                           | -            | -                           | Yes          | Yes          | Yes          | Yes          | Yes          |
| azure_rm_resource_info                     | -            | -                           | Yes          | Yes          | Yes          | Yes          | Yes          |
| azure_rm_resourcegroup                      | Yes          | Yes                         | Yes          | Yes          | Yes          | Yes          | Yes          |
| azure_rm_resourcegroup_info                | Yes          | Yes                         | Yes          | Yes          | Yes          | Yes          | Yes          |
| azure_rm_snapshot                           | -            | -                           | -            | -            | -            | Yes          | Yes          |
| azure_rm_virtualmachine                     | Yes          | Yes                         | Yes          | Yes          | Yes          | Yes          | Yes          |
| azure_rm_virtualmachine_info               | -            | -                           | -            | Yes          | Yes          | Yes          | Yes          |
| azure_rm_virtualmachineextension            | Yes          | Yes                         | Yes          | Yes          | Yes          | Yes          | Yes          |
| azure_rm_virtualmachineextension_info      | -            | -                           | -            | -            | Yes          | Yes          | Yes          |
| azure_rm_virtualmachineimage_info          | Yes          | Yes                         | Yes          | Yes          | Yes          | Yes          | Yes          |
| azure_rm_virtualmachinescaleset             | Yes          | Yes                         | Yes          | Yes          | Yes          | Yes          | Yes          |
| azure_rm_virtualmachinescaleset_info       | Yes          | Yes                         | Yes          | Yes          | Yes          | Yes          | Yes          |
| azure_rm_virtualmachinescalesetextension    | -            | -                           | -            | -            | Yes          | Yes          | Yes          |
| azure_rm_virtualmachinescalesetextension_info | -            | -                        | -            | -            | Yes          | Yes          | Yes          |
| azure_rm_virtualmachinescalesetinstance     | -            | -                           | -            | -            | Yes          | Yes          | Yes          |
| azure_rm_virtualmachinescalesetinstance_info | -            | -                         | -            | -            | Yes          | Yes          | Yes          |
| **Networking**                              |              |                             |              |              |              |              |              |
| azure_rm_appgateway                         | -            | -                           | -            | Yes          | Yes          | Yes          | Yes          |
| azure_rm_applicationsecuritygroup           | -            | -                           | -            | -            | Yes          | Yes          | Yes          |
| azure_rm_applicationsecuritygroup_info     | -            | -                           | -            | -            | Yes          | Yes          | Yes          |
| azure_rm_cdnendpoint                        | -            | -                         | -          | -            | Yes          | Yes          | Yes          |
| azure_rm_cdnendpoint_info                  | -            | -                         | -          | -            | Yes          | Yes          | Yes          |
| azure_rm_cdnprofile                         | -            | -                         | -          | -            | Yes          | Yes          | Yes          |
| azure_rm_cdnprofile_info                   | -            | -                         | -          | -            | Yes          | Yes          | Yes          |
| azure_rm_dnsrecordset                       | Yes          | Yes                         | Yes          | Yes          | Yes          | Yes          | Yes          |
| azure_rm_dnsrecordset_info                 | Yes          | Yes                         | Yes          | Yes          | Yes          | Yes          | Yes          |
| azure_rm_dnszone                            | Yes          | Yes                         | Yes          | Yes          | Yes          | Yes          | Yes          |
| azure_rm_dnszone_info                      | Yes          | Yes                         | Yes          | Yes          | Yes          | Yes          | Yes          |
| azure_rm_firewall                           | -            | -                           | -            | -            | -            | Yes          | Yes          |
| azure_rm_firewall_info                      | -            | -                           | -            | -            | -            | Yes          | Yes          |
| azure_rm_loadbalancer                       | Yes          | Yes                         | Yes          | Yes          | Yes          | Yes          | Yes          |
| azure_rm_loadbalancer_info                 | Yes          | Yes                         | Yes          | Yes          | Yes          | Yes          | Yes          |
| azure_rm_networkinterface                   | Yes          | Yes                         | Yes          | Yes          | Yes          | Yes          | Yes          |
| azure_rm_networkinterface_info             | Yes          | Yes                         | Yes          | Yes          | Yes          | Yes          | Yes          |
| azure_rm_publicipaddress                    | Yes          | Yes                         | Yes          | Yes          | Yes          | Yes          | Yes          |
| azure_rm_publicipaddress_info              | Yes          | Yes                         | Yes          | Yes          | Yes          | Yes          | Yes          |
| azure_rm_route                              | -            | -                           | -            | Yes          | Yes          | Yes          | Yes          |
| azure_rm_routetable                         | -            | -                           | -            | Yes          | Yes          | Yes          | Yes          |
| azure_rm_routetable_info                   | -            | -                           | -            | Yes          | Yes          | Yes          | Yes          |
| azure_rm_securitygroup                      | Yes          | Yes                         | Yes          | Yes          | Yes          | Yes          | Yes          |
| azure_rm_securitygroup_info                 | -            | -                           | -            | -            | -            | Yes          | Yes          |
| azure_rm_subnet                             | Yes          | Yes                         | Yes          | Yes          | Yes          | Yes          | Yes          |
| azure_rm_subnet_info                       | -            | -                           | -            | -            | Yes          | Yes          | Yes          |
| azure_rm_trafficmanagerendpoint             | -            | -                         | -          | Yes          | Yes          | Yes          | Yes          |
| azure_rm_trafficmanagerendpoint_info       | -            | -                         | -          | Yes          | Yes          | Yes          | Yes          |
| azure_rm_trafficmanagerprofile              | -            | -                         | -          | Yes          | Yes          | Yes          | Yes          |
| azure_rm_trafficmanagerprofile_info        | -            | -                         | -          | Yes          | Yes          | Yes          | Yes          |
| azure_rm_virtualnetwork                     | Yes          | Yes                         | Yes          | Yes          | Yes          | Yes          | Yes          |
| azure_rm_virtualnetwork_info               | Yes          | Yes                         | Yes          | Yes          | Yes          | Yes          | Yes          |
| azure_rm_virtualnetworkgateway              | -            | -                         | -          | -            | Yes          | Yes          | Yes          |
| azure_rm_virtualnetworkpeering              | -            | -                         | -          | -            | Yes          | Yes          | Yes          |
| azure_rm_virtualnetworkpeering_info         | -            | -                         | -          | -            | -            | Yes          | Yes          |
| **Storage**                    |           |                          |                          |                            |           |           |         |
| azure_rm_manageddisk                        | Yes          | Yes                         | Yes          | Yes          | Yes          | Yes          | Yes          |
| azure_rm_manageddisk_info                  | Yes          | Yes                         | Yes          | Yes          | Yes          | Yes          | Yes          |
| azure_rm_storageaccount                     | Yes          | Yes                         | Yes          | Yes          | Yes          | Yes          | Yes          |
| azure_rm_storageaccount_info               | Yes          | Yes                         | Yes          | Yes          | Yes          | Yes          | Yes          |
| azure_rm_storageblob                        | Yes          | Yes                         | Yes          | Yes          | Yes          | Yes          | Yes          |
| **Web**                    |           |                          |                          |                             |           |           |           |
| azure_rm_appserviceplan                     | -            | -                         | -          | Yes          | Yes          | Yes          | Yes          |
| azure_rm_appserviceplan_info               | -            | -                         | -          | Yes          | Yes          | Yes          | Yes          |
| azure_rm_webapp                             | -            | -                         | -          | Yes          | Yes          | Yes          | Yes          |
| azure_rm_webapp_info                       | -            | -                         | -          | Yes          | Yes          | Yes          | Yes          |
| azure_rm_webappslot                         | -            | -                         | -          | -            | Yes          | Yes          | Yes          |
| **Containers**                    |           |                          |                          |                            |           |           |          |
| azure_rm_acs                                | Yes          | Yes                         | Yes          | Yes          | Yes          | Yes          | Yes          |
| azure_rm_aks                                | -            | -                           | Yes          | Yes          | Yes          | Yes          | Yes          |
| azure_rm_aks_info                          | -            | -                           | Yes          | Yes          | Yes          | Yes          | Yes          |
| azure_rm_aksversion_info                   | -            | -                           | -            | -            | Yes          | Yes          | Yes          |
| azure_rm_containerinstance                  | -            | Yes                         | Yes          | Yes          | Yes          | Yes          | Yes          |
| azure_rm_containerinstance_info            | -            | -                           | -            | -            | Yes          | Yes          | Yes          |
| azure_rm_containerregistry                  | -            | Yes                         | Yes          | Yes          | Yes          | Yes          | Yes          |
| azure_rm_containerregistry_info            | -            | -                           | -            | Yes          | Yes          | Yes          | Yes          |
| azure_rm_containerregistryreplication       | -            | -                           | -            | -            | -          | -          | Yes          |
| azure_rm_containerregistryreplication_info  | -            | -                           | -            | -            | -          | -          | Yes          |
| azure_rm_containerregistrywebhook           | -            | -                           | -            | -            | -          | -          | Yes          |
| azure_rm_containerregistrywebhook_info      | -            | -                           | -            | -            | -          | -          | Yes          |
| **Databases**                    |           |                          |                          |                             |           |           |          |
| azure_rm_cosmosdbaccount                    | -            | -                           | -            | -            | Yes          | Yes          | Yes          |
| azure_rm_cosmosdbaccount_info              | -            | -                           | -            | -            | Yes          | Yes          | Yes          |
| azure_rm_mariadbconfiguration               | -            | -                           | -            | -            | Yes          | Yes          | Yes          |
| azure_rm_mariadbconfiguration_info         | -            | -                           | -            | -            | Yes          | Yes          | Yes          |
| azure_rm_mariadbdatabase                    | -            | -                           | -            | -            | Yes          | Yes          | Yes          |
| azure_rm_mariadbdatabase_info              | -            | -                           | -            | -            | Yes          | Yes          | Yes          |
| azure_rm_mariadbfirewallrule                | -            | -                           | -            | -            | Yes          | Yes          | Yes          |
| azure_rm_mariadbfirewallrule_info          | -            | -                           | -            | -            | Yes          | Yes          | Yes          |
| azure_rm_mariadbserver                      | -            | -                           | -            | -            | Yes          | Yes          | Yes          |
| azure_rm_mariadbserver_info                | -            | -                           | -            | -            | Yes          | Yes          | Yes          |
| azure_rm_mysqlconfiguration                 | -            | -                           | -            | -            | Yes          | Yes          | Yes          |
| azure_rm_mysqlconfiguration_info           | -            | -                           | -            | -            | Yes          | Yes          | Yes          |
| azure_rm_mysqldatabase                      | -            | Yes                         | Yes          | Yes          | Yes          | Yes          | Yes          |
| azure_rm_mysqldatabase_info                | -            | -                           | -            | Yes          | Yes          | Yes          | Yes          |
| azure_rm_mysqlfirewallrule                  | -            | -                           | -            | -            | Yes          | Yes          | Yes          |
| azure_rm_mysqlfirewallrule_info            | -            | -                           | -            | -            | Yes          | Yes          | Yes          |
| azure_rm_mysqlserver                        | -            | Yes                         | Yes          | Yes          | Yes          | Yes          | Yes          |
| azure_rm_mysqlserver_info                  | -            | -                           | -            | Yes          | Yes          | Yes          | Yes          |
| azure_rm_postgresqlconfiguration            | -            | -                           | -            | -            | Yes          | Yes          | Yes          |
| azure_rm_postgresqlconfiguration_info      | -            | -                           | -            | -            | Yes          | Yes          | Yes          |
| azure_rm_postgresqldatabase                 | -            | Yes                         | Yes          | Yes          | Yes          | Yes          | Yes          |
| azure_rm_postgresqldatabase_info           | -            | -                           | -            | Yes          | Yes          | Yes          | Yes          |
| azure_rm_postgresqlfirewallrule             | -            | -                           | -            | -            | Yes          | Yes          | Yes          |
| azure_rm_postgresqlfirewallrule_info       | -            | -                           | -            | -            | Yes          | Yes          | Yes          |
| azure_rm_postgresqlserver                   | -            | Yes                         | Yes          | Yes          | Yes          | Yes          | Yes          |
| azure_rm_postgresqlserver_info             | -            | -                           | -            | Yes          | Yes          | Yes          | Yes          |
| azure_rm_rediscache                         | -            | -                           | -            | -            | Yes          | Yes          | Yes          |
| azure_rm_rediscache_info                   | -            | -                           | -            | -            | Yes          | Yes          | Yes          |
| azure_rm_rediscachefirewallrule             | -            | -                           | -            | -            | Yes          | Yes          | Yes          |
| azure_rm_sqldatabase                        | -            | Yes                         | Yes          | Yes          | Yes          | Yes          | Yes          |
| azure_rm_sqldatabase_info                  | -            | -                           | -            | -            | Yes          | Yes          | Yes          |
| azure_rm_sqlelasticpool                    | -            | -                           | -            | -            | -          | -          | Yes          |
| azure_rm_sqlelasticpool_info               | -            | -                           | -            | -            | -          | -          | Yes          |
| azure_rm_sqlfirewallrule                    | -            | -                           | -            | Yes          | Yes          | Yes          | Yes          |
| azure_rm_sqlfirewallrule_info              | -            | -                           | -            | -            | Yes          | Yes          | Yes          |
| azure_rm_sqlserver                          | -            | Yes                         | Yes          | Yes          | Yes          | Yes          | Yes          |
| azure_rm_sqlserver_info                    | -            | Yes                         | Yes          | Yes          | Yes          | Yes          | Yes          |
| **Analytics**                    |           |                          |                          |                             |           |           |          |
| azure_rm_hdinsightcluster                   | -            | -                           | -            | -            | Yes          | Yes          | Yes          |
| azure_rm_hdinsightcluster_info              | -            | -                           | -            | -            | -            | Yes          | Yes          |
| **Integration**                    |           |                          |                          |                             |           |           |          |
| azure_rm_servicebus                         | -            | -                           | -            | -            | Yes          | Yes          | Yes          |
| azure_rm_servicebus_info                   | -            | -                           | -            | -            | Yes          | Yes          | Yes          |
| azure_rm_servicebusqueue                    | -            | -                           | -            | -            | Yes          | Yes          | Yes          |
| azure_rm_servicebussaspolicy                | -            | -                           | -            | -            | Yes          | Yes          | Yes          |
| azure_rm_servicebustopic                    | -            | -                           | -            | -            | Yes          | Yes          | Yes          |
| azure_rm_servicebustopicsubscription        | -            | -                           | -            | -            | Yes          | Yes          | Yes          |
| **Security**                    |           |                          |                          |                             |           |           |           |
| azure_rm_keyvault                           | -            | Yes                         | Yes          | Yes          | Yes          | Yes          | Yes          |
| azure_rm_keyvault_info                     | -            | -                           | -              | -          | Yes          | Yes          | Yes          |
| azure_rm_keyvaultkey                        | -            | Yes                         | Yes          | Yes          | Yes          | Yes          | Yes          |
| azure_rm_keyvaultkey_info                   | -            | -                           | -            | -            | -            | Yes          | Yes          |
| azure_rm_keyvaultsecret                     | -            | Yes                         | Yes          | Yes          | Yes          | Yes          | Yes          |
| azure_rm_roleassignment                     | -            | -                           | -            | -            | Yes          | Yes          | Yes          |
| azure_rm_roleassignment_info               | -            | -                           | -            | -            | Yes          | Yes          | Yes          |
| azure_rm_roledefinition                     | -            | -                           | -            | -            | Yes          | Yes          | Yes          |
| azure_rm_roledefinition_info               | -            | -                           | -            | -            | Yes          | Yes          | Yes          |
| **DevOps**               |           |                          |                          |                             |           |           |                  |
| azure_rm_devtestlab                         | -            | -                           | -            | -            | Yes          | Yes          | Yes          |
| azure_rm_devtestlab_info                   | -            | -                           | -            | -            | Yes          | Yes          | Yes          |
| azure_rm_devtestlabarmtemplate_info        | -            | -                           | -            | -            | Yes          | Yes          | Yes          |
| azure_rm_devtestlabartifact_info           | -            | -                           | -            | -            | Yes          | Yes          | Yes          |
| azure_rm_devtestlabartifactsource           | -            | -                           | -            | -            | Yes          | Yes          | Yes          |
| azure_rm_devtestlabartifactsource_info     | -            | -                           | -            | -            | Yes          | Yes          | Yes          |
| azure_rm_devtestlabcustomimage              | -            | -                           | -            | -            | Yes          | Yes          | Yes          |
| azure_rm_devtestlabcustomimage_info         | -            | -                           | -            | -            | -            | Yes          | Yes          |
| azure_rm_devtestlabenvironment              | -            | -                           | -            | -            | Yes          | Yes          | Yes          |
| azure_rm_devtestlabenvironment_info         | -            | -                           | -            | -            | -            | Yes          | Yes          |
| azure_rm_devtestlabpolicy                   | -            | -                           | -            | -            | Yes          | Yes          | Yes          |
| azure_rm_devtestlabpolicy_info              | -            | -                           | -            | -            | -            | Yes          | Yes          |
| azure_rm_devtestlabschedule                 | -            | -                           | -            | -            | Yes          | Yes          | Yes          |
| azure_rm_devtestlabschedule_info            | -            | -                           | -            | -            | -            | Yes          | Yes          |
| azure_rm_devtestlabvirtualmachine           | -            | -                           | -            | -            | Yes          | Yes          | Yes          |
| azure_rm_devtestlabvirtualmachine_info | -            | -                           | -            | -            | Yes          | Yes          | Yes          |
| azure_rm_devtestlabvirtualnetwork           | -            | -                           | -            | -            | Yes          | Yes          | Yes          |
| azure_rm_devtestlabvirtualnetwork_info     | -            | -                           | -            | -            | Yes          | Yes          | Yes          |
| **Azure Monitor**                           |              |                           |            |              |                 |           |              |
| azure_rm_autoscale                          | -            | -                         | -          | Yes          | Yes          | Yes          | Yes          |
| azure_rm_autoscale_info                    | -            | -                         | -          | Yes          | Yes          | Yes          | Yes          |
| azure_rm_loganalyticsworkspace              | -            | -                           | -            | -            | Yes          | Yes          | Yes          |
| azure_rm_loganalyticsworkspace_info        | -            | -                           | -            | -            | Yes          | Yes          | Yes          |
| azure_rm_monitorlogprofile                  | -            | -                           | -            | -            | -            | Yes          | Yes          |
| **Management and Governance**     |              |                           |            |            |            |            |              |
| azure_rm_automationaccount        | -            | -                         | -          | -          | -          | Yes        | Yes          |
| azure_rm_automationaccount_info   | -            | -                         | -          | -          | -          | Yes        | Yes          |
| azure_rm_lock                     | -            | -                         | -          | -          | -          | Yes        | Yes          |
| azure_rm_lock_info                | -            | -                         | -          | -          | -          | Yes        | Yes          |
| **Internet of Things**            |              |                           |            |            |            |            |              |
| azure_rm_iotdevice                | -            | -                         | -          | -          | -          | Yes        | Yes          |
| azure_rm_iotdevice_info           | -            | -                         | -          | -          | -          | Yes        | Yes          |
| azure_rm_iotdevicemodule          | -            | -                         | -          | -          | -          | Yes        | Yes          |
| azure_rm_iothub_info              | -            | -                         | -          | -          | -          | Yes        | Yes          |
| azure_rm_iothub_info              | -            | -                         | -          | -          | -          | Yes        | Yes          |
| azure_rm_iothubconsumergroup      | -            | -                         | -          | -          | -          | Yes        | Yes          |

## Introduction to playbook role for Azure

The [azure_preview_module playbook role](https://galaxy.ansible.com/Azure/azure_preview_modules/) includes all the latest Azure modules. The updates and bug fixes are done in a more timely manner than the official Ansible release. If you use Ansible for Azure resource provisioning purposes, you're encouraged to install the `azure_preview_module` playbook role.

The `azure_preview_module` playbook role is released every three weeks.

## Next steps

For more information about playbook roles, see [Creating reusable playbooks](https://docs.ansible.com/ansible/latest/playbooks_reuse.html). 
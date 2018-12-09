---
title: Scale Azure App Service web apps by using Ansible
description: Learn how to use Ansible to create a web app with Java 8 and the Tomcat container runtime in App Service on Linux
ms.service: ansible
keywords: ansible, azure, devops, bash, playbook, Azure App Service, Web App, scale, Java
author: tomarcher
manager: jeconnoc
ms.author: tarcher
ms.topic: tutorial
ms.date: 12/08/2018
---

# Scale Azure App Service web apps by using Ansible
[Azure App Service Web Apps](https://docs.microsoft.com/azure/app-service/app-service-web-overview) (or just Web Apps) hosts web applications, REST APIs, and mobile back ends. You can develop in your favorite language&mdash;.NET, .NET Core, Java, Ruby, Node.js, PHP, or Python.

Ansible enables you to automate the deployment and configuration of resources in your environment. This article shows you how to use Ansible to scale your app in Azure App Service.

## Prerequisites
- **Azure subscription** - If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio) before you begin.
- [!INCLUDE [ansible-prereqs-for-cloudshell-use-or-vm-creation1.md](../../includes/ansible-prereqs-for-cloudshell-use-or-vm-creation1.md)] [!INCLUDE [ansible-prereqs-for-cloudshell-use-or-vm-creation2.md](../../includes/ansible-prereqs-for-cloudshell-use-or-vm-creation2.md)]
- **Azure App Service Web Apps** - If you don't already have an Azure app service web app, you can [create Azure web apps by using Ansible](ansible-create-configure-azure-web-apps.md).

## Scale up an App in App Service
You can scale up by changing the pricing tier of the App Service plan that your app belongs to. This section presents a sample Ansible playbook that defines following operation:
- Get facts of an existing App Service plan
- Update the App service plan to S2 with two workers

```
- hosts: localhost
  connection: local
  vars:
    resource_group_name: myResourceGroup
    plan_name: myAppServicePlan
    location: eastus

  - name: Get facts of existing App serivce plan
    azure_rm_appserviceplan_facts:
      resource_group: "{{ resource_group_name }}"
      name: "{{ plan_name }}"
    register: facts

  - name: Scale up the App service plan
    azure_rm_appserviceplan:
      resource_group: "{{ resource_group_name }}"
      name: "{{ plan_name }}"
      is_linux: true
      sku: S2
      number_of_workers: 2
      
  - name: Get facts
    azure_rm_appserviceplan_facts:
      resource_group: "{{ resource_group_name }}"
      name: "{{ plan_name }}"
```

Save this playbook as *appserviceplan_scale.yml*, or [download the playbook](https://github.com/Azure-Samples/ansible-playbooks/blob/master/appserviceplan_scale.yml).

To run the playbook,  use the **ansible-playbook** command as follows:
```bash
ansible-playbook appserviceplan_scale.yml
```

After running the playbook, output similiar to the following example shows that the App service plan has been successfully updated to S2:
```
TASK [Get facts of existing App serivce plan] *************************************************
[WARNING]: Azure API profile latest does not define an entry for
WebSiteManagementClient

changed: [localhost]
TASK [Scale up the App Service Plan] *******************************************

changed: [localhost]
TASK [Get facts] ***************************************************************

ok: [localhost]
PLAY RECAP *********************************************************************
localhost                  : ok=3    changed=3    unreachable=0    failed=0  
```

## Next steps
> [!div class="nextstepaction"] 
> [Ansible on Azure](https://docs.microsoft.com/azure/ansible/)
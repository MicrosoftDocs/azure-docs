---
title: Tutorial - Configure a web app in Azure App Service using Ansible
description: Learn how to create a Java web app in Azure App Service on Linux using Ansible
keywords: ansible, azure, devops, bash, playbook, Azure App Service, Web App, Java
ms.topic: tutorial
ms.service: ansible
author: tomarchermsft
manager: jeconnoc
ms.author: tarcher
ms.date: 04/04/2019
---

# Tutorial: Configure a web app in Azure App Service using Ansible

[Azure App Service](/azure/app-service/overview) (or just Web Apps) hosts web applications, REST APIs, and mobile backends. You can develop in your favorite language&mdash;.NET, .NET Core, Java, Ruby, Node.js, PHP, or Python.

Ansible enables you to automate the deployment and configuration of resources in your environment. This article shows you how to use Ansible to create a web app by using the Java runtime. 

## Prerequisites

- [!INCLUDE [open-source-devops-prereqs-azure-sub.md](../../includes/open-source-devops-prereqs-azure-sub.md)]
- [!INCLUDE [ansible-prereqs-cloudshell-use-or-vm-creation1.md](../../includes/ansible-prereqs-cloudshell-use-or-vm-creation1.md)] [!INCLUDE [ansible-prereqs-cloudshell-use-or-vm-creation2.md](../../includes/ansible-prereqs-cloudshell-use-or-vm-creation2.md)]

> [!Note]
> Ansible 2.7 is required to run the following the sample playbooks in this tutorial.

## Create a simple app service

This section presents a sample Ansible playbook that defines the following resources:
- Resource group, where your App Service plan and web app will be deployed to
- Web app with Java 8 and the Tomcat container runtime in App Service on Linux

```yml
- hosts: localhost
  connection: local
  vars:
    resource_group: myResourceGroup
    webapp_name: myfirstWebApp
    plan_name: myAppServicePlan
    location: eastus
  tasks:
    - name: Create a resource group
      azure_rm_resourcegroup:
        name: "{{ resource_group }}"
        location: "{{ location }}"

    - name: Create App Service on Linux with Java Runtime
      azure_rm_webapp:
        resource_group: "{{ resource_group }}"
        name: "{{ webapp_name }}"
        plan:
          resource_group: "{{ resource_group }}"
          name: "{{ plan_name }}"
          is_linux: true
          sku: S1
          number_of_workers: 1
        frameworks:
          - name: "java"
            version: "8"
            settings:
              java_container: tomcat
              java_container_version: 8.5
```

Save the preceding playbook as `firstwebapp.yml`.

Run the playbook using the `ansible-playbook` command:

```bash
ansible-playbook firstwebapp.yml
```

The output from running the Ansible playbook shows that the web app was successfully created:

```Output
PLAY [localhost] 

TASK [Gathering Facts] 
ok: [localhost]

TASK [Create a resource group] 
changed: [localhost]

TASK [Create App Service on Linux with Java Runtime] 
 [WARNING]: Azure API profile latest does not define an entry for WebSiteManagementClient

changed: [localhost]

PLAY RECAP 
localhost                  : ok=3    changed=2    unreachable=0    failed=0
```

## Create an app service using Traffic Manager

You can use [Azure Traffic Manager](https://docs.microsoft.com/azure/app-service/web-sites-traffic-manager) to control how requests from web clients are distributed to apps in Azure App Service. When App Service endpoints are added to an Azure Traffic Manager profile, Traffic Manager tracks the status of your App Service apps. Statuses include running, stopped, and deleted. Traffic Manager can then decide which of those endpoints should receive traffic.

In App Service, an app runs in an [App Service plan](https://docs.microsoft.com/azure/app-service/overview-hosting-plans
). An App Service plan defines a set of compute resources for a web app to run. You can manage your App Service plan and web app in different groups.

This section presents a sample Ansible playbook that defines the following resources:
- Resource group, where your app service plan will be deployed to
- App Service plan
- Secondary resource group, where your web app will be deployed to
- Web app with Java 8 and the Tomcat container runtime in App Service on Linux
- Traffic Manager profile
- Traffic Manager endpoint, using the created website

```yml
- hosts: localhost
  connection: local
  vars:
    resource_group_webapp: myResourceGroupWebapp
    resource_group: myResourceGroup
    webapp_name: myLinuxWebApp
    plan_name: myAppServicePlan
    location: eastus
    traffic_manager_profile_name: myTrafficManagerProfile
    traffic_manager_endpoint_name: myTrafficManagerEndpoint

  tasks:
  - name: Create resource group
    azure_rm_resourcegroup:
        name: "{{ resource_group_webapp }}"
        location: "{{ location }}"

  - name: Create secondary resource group
    azure_rm_resourcegroup:
        name: "{{ resource_group }}"
        location: "{{ location }}"

  - name: Create App Service Plan
    azure_rm_appserviceplan:
      resource_group: "{{ resource_group }}"
      name: "{{ plan_name }}"
      location: "{{ location }}"
      is_linux: true
      sku: S1
      number_of_workers: 1

  - name: Create App Service on Linux with Java Runtime
    azure_rm_webapp:
        resource_group: "{{ resource_group_webapp }}"
        name: "{{ webapp_name }}"
        plan:
          resource_group: "{{ resource_group }}"
          name: "{{ plan_name }}"
          is_linux: true
          sku: S1
          number_of_workers: 1
        app_settings:
          testkey: "testvalue"
        frameworks:
          - name: java
            version: 8
            settings:
              java_container: "Tomcat"
              java_container_version: "8.5"

  - name: Get web app facts
    azure_rm_webapp_facts:
      resource_group: "{{ resource_group_webapp }}"
      name: "{{ webapp_name }}"
    register: webapp
    
  - name: Create Traffic Manager Profile
    azure_rm_trafficmanagerprofile:
      resource_group: "{{ resource_group_webapp }}"
      name: "{{ traffic_manager_profile_name }}"
      location: global
      routing_method: performance
      dns_config:
        relative_name: "{{ traffic_manager_profile_name }}"
        ttl:  60
      monitor_config:
        protocol: HTTPS
        port: 80
        path: '/'

  - name: Add endpoint to traffic manager profile, using created web site
    azure_rm_trafficmanagerendpoint:
      resource_group: "{{ resource_group_webapp }}"
      profile_name: "{{ traffic_manager_profile_name }}"
      name: "{{ traffic_manager_endpoint_name }}"
      type: azure_endpoints
      location: "{{ location }}"
      target_resource_id: "{{ webapp.webapps[0].id }}"
```

Save the preceding playbook as `webapp.yml`, or [download the playbook](https://github.com/Azure-Samples/ansible-playbooks/blob/master/webapp.yml).

Run the playbook using the `ansible-playbook` command:

```bash
ansible-playbook webapp.yml
```

The output from running the Ansible playbook shows that the App service plan, web app, Traffic Manager profile, and endpoint were successfully created:

```Output
PLAY [localhost] 

TASK [Gathering Facts] 
ok: [localhost]

TASK [Create resource group] 
changed: [localhost]

TASK [Create resource group for app service plan] 
changed: [localhost]

TASK [Create App Service Plan] 
 [WARNING]: Azure API profile latest does not define an entry for WebSiteManagementClient

changed: [localhost]

TASK [Create App Service on Linux with Java Runtime] 
changed: [localhost]

TASK [Get web app facts] 
ok: [localhost]

TASK [Create Traffic Manager Profile] 
 [WARNING]: Azure API profile latest does not define an entry for TrafficManagerManagementClient

changed: [localhost]

TASK [Add endpoint to traffic manager profile, using the web site created above] 
changed: [localhost]

TASK [Get Traffic Manager Profile facts] 
ok: [localhost]

PLAY RECAP 
localhost                  : ok=9    changed=6    unreachable=0    failed=0
```

## Next steps

> [!div class="nextstepaction"] 
> [Tutorial: Scale an app in Azure App Service web apps using Ansible](https://docs.microsoft.com/azure/ansible/ansible-scale-azure-web-apps)
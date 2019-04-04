---
title: Configure an RBAC role in Azure Kubernetes Service (AKS) using Ansible
description: Learn how to use Ansible to configure RBAC in Azure Kubernetes Service(AKS) cluster
ms.service: azure
keywords: ansible, azure, devops, bash, cloudshell, playbook, aks, container, Kubernetes, azure active directory, rbac
author: tomarchermsft
manager: jeconnoc
ms.author: tarcher
ms.topic: tutorial
---

# Configure an RBAC role in Azure Kubernetes Service (AKS) using Ansible

Azure Kubernetes Service (AKS) can be configured to use Azure Active Directory (AD) for user authentication. You can then log into an AKS cluster using your Azure Active Directory authentication token. Additionally, cluster administrators can configure Kubernetes role-based access control (RBAC) based on a user's identity or directory group membership.

This article shows you how to use Ansible to create an Azure AD-enabled AKS cluster and create an RBAC role in the cluster using Ansible.

## Prerequisites

- **Azure subscription** - If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio) before you begin.
- **Azure service principal** - When [creating the service principal](/cli/azure/create-an-azure-service-principal-azure-cli?view=azure-cli-latest), note the following values: **appId**, **displayName**, **password**, and **tenant**.
- [!INCLUDE [ansible-prereqs-for-cloudshell-use-or-vm-creation1.md](../../includes/ansible-prereqs-for-cloudshell-use-or-vm-creation1.md)] [!INCLUDE [ansible-prereqs-for-cloudshell-use-or-vm-creation2.md](../../includes/ansible-prereqs-for-cloudshell-use-or-vm-creation2.md)]
- Install `openshift` library using `pip install openshift`.
- Copy and save your `Object ID` from Azure portal -> `Azure Active Directory` -> `Users` -> your account.
![VM A](media/ansible-aks-configure-rbac/ansible-aad-objectid.png)
- When configuring Azure AD for AKS authentication, two Azure AD applications are configured. This operation must be completed by an Azure tenant administrator. For more information, see [Integrate Azure Active Directory with Azure Kubernetes Service](https://docs.microsoft.com/en-us/azure/aks/aad-integration#create-server-application). Make sure you obtain the server application secret, server application ID, the client application ID and the tenant ID from your Azure tenant administrator. You need the information in order to run the sample playbook.  

## Deploy cluster

This section shows you how to create an Azure Kubernetes Service with the Azure AD application created in previous steps. Save the tasks as *aks-create.yml*

> [!Tip]
> - This task loads `ssh_key` from `~/.ssh/id_rsa.pub`.You can change it to RSA public key in the single-line format - starting with "ssh-rsa" (without the quotes).
> - `client_id` and `client_secret` are loaded from `~/.azure/credentials`, the default credential file for Ansible. You can set these as your own service principal or load these from environment:
>    ```yml
>    client_id: "{{ lookup('env', 'AZURE_CLIENT_ID') }}"
>    client_secret: "{{ lookup('env', 'AZURE_SECRET') }}"
>    ```

```yml
- name: Create resource group
  azure_rm_resourcegroup:
      name: "{{ resource_group }}"
      location: "{{ location }}"

- name: List supported kubernetes version from Azure
  azure_rm_aks_version:
      location: "{{ location }}"
  register: versions

- name: Create AKS cluster with RBAC enabled
  azure_rm_aks:
      resource_group: "{{ resource_group }}"
      name: "{{ name }}"
      dns_prefix: "{{ name }}"
      enable_rbac: yes
      kubernetes_version: "{{ versions.azure_aks_versions[-1] }}"
      agent_pool_profiles:
        - count: 3
          name: nodepool1
          vm_size: Standard_D2_v2
      linux_profile:
          admin_username: azureuser
          ssh_key: "{{ lookup('file', '~/.ssh/id_rsa.pub') }}"
      service_principal:
          client_id: "{{ lookup('ini', 'client_id section=default file=~/.azure/credentials') }}"
          client_secret: "{{ lookup('ini', 'secret section=default file=~/.azure/credentials') }}"
      aad_profile:
          client_app_id: "{{ client_app_id }}"
          server_app_id: "{{ server_app_id }}"
          server_app_secret: "{{ server_app_secret }}"
          tenant_id: "{{ app_tenant_id }}"
  register: aks

- name: Save cluster user config
  copy:
      content: "{{ aks.kube_config }}"
      dest: "aks-{{ name }}-kubeconfig-user"

- name: Get admin config of AKS
  azure_rm_aks_facts:
      resource_group: "{{ resource_group }}"
      name: "{{ name }}"
      show_kubeconfig: admin
  register: aks

- name: Save the kubeconfig
  copy:
      content: "{{ aks.aks[0].kube_config }}"
      dest: "aks-{{ name }}-kubeconfig"
```

## Create RBAC binding

This section shows you how to create a role binding or cluster role binding. It will create a role in AKS. Save the file as *kube-role.yml*.

> Note: replace the `<your-aad-account>` placeholder with the object id of your Azure AD tenant.

```yml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: cluster-admins
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: cluster-admin
subjects:
- apiGroup: rbac.authorization.k8s.io
  kind: User
  name: <your-aad-account>
```

Deploy this role to AKS using the following task, save these tasks as *aks-kube-deploy.yml*.

```yml
- name: Apply role to AKS
  k8s:
      src: kube-role.yml
      kubeconfig: "aks-{{ name }}-kubeconfig"
```

## Putting everything together

Here is the complete playbook to call all preceding tasks. Save the playbook as *aks-rbac.yml*.

> [!Tip]
> replace the `<client id>`, `<server id>`, `<server secret>` and `<tenant id>` with your AAD information.

```yml
---
- hosts: localhost
  vars:
      resource_group: aksansibletest
      name: aksansibletest
      location: eastus
  tasks:
     - name: Ensure resource group exist
       azure_rm_resourcegroup:
           name: "{{ resource_group }}"
           location: "{{ location }}"

     - name: Create AKS
       vars:
           client_app_id: <client id>
           server_app_id: <server id>
           server_app_secret: <server secret>
           app_tenant_id: <tenant id>
       include_tasks: aks-create.yml

     - name: Enable RBAC
       include_tasks: aks-kube-deploy.yml
```

Save the playbook, with all other task files in one folder. To run this playbook, use command `ansible-playbook` as follows:

```bash
ansible-playbook aks-rbac.yml
```

## Verify
Use the kubectl to list the nodes with cluster user kube config

```bash
kubectl --kubeconfig aks-aksansibletest-kubeconfig-user get nodes
```

The command line should direct you to https://microsoft.com/devicelogin and let you enter a code to authenticate. Log in with your Azure account the nodes should be listed as below

```txt
To sign in, use a web browser to open the page https://microsoft.com/devicelogin and enter the code XXXXXXXX to authenticate.
NAME                       STATUS   ROLES   AGE   VERSION
aks-nodepool1-33413200-0   Ready    agent   49m   v1.12.6
aks-nodepool1-33413200-1   Ready    agent   49m   v1.12.6
aks-nodepool1-33413200-2   Ready    agent   49m   v1.12.6
```


## Clean up

Remove these resources by deleting the resource group

```yml
---
- hosts: localhost
  vars:
      name: aksansibletest
      resource_group: aksansibletest
  tasks:
      - name: Clean up resource group
        azure_rm_resourcegroup:
            name: "{{ resource_group }}"
            state: absent
            force: yes
      - name: Remove kubeconfig
        file:
            state: absent
            path: "aks-{{ name }}-kubeconfig"
```

Save this playbook to *clean.yml*, and run using command `ansible-playbook`:

```bash
ansible-playbook clean.yml
```

## Next steps

> [!div class="nextstepaction"]
> [Ansible on Azure](https://docs.microsoft.com/azure/ansible/)
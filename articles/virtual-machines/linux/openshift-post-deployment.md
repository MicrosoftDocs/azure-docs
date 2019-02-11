---
title: OpenShift on Azure post-deployment tasks | Microsoft Docs
description: Additional tasks for after an OpenShift cluster has been deployed. 
services: virtual-machines-linux
documentationcenter: virtual-machines
author: haroldwongms
manager: joraio
editor: 
tags: azure-resource-manager

ms.assetid: 
ms.service: virtual-machines-linux
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure
ms.date: 
ms.author: haroldw
---

# Post-deployment tasks

After you deploy an OpenShift cluster, you can configure additional items. This article covers:

- How to configure single sign-on by using Azure Active Directory (Azure AD)
- How to configure Log Analytics to monitor OpenShift
- How to configure metrics and logging
- How to install Open Service Broker for Azure (OSBA)

## Configure single sign-on by using Azure Active Directory

To use Azure Active Directory for authentication, first you need to create an Azure AD app registration. This process involves two steps: creating the app registration, and configuring permissions.

### Create an app registration

These steps use the Azure CLI to create the app registration, and the GUI (portal) to set the permissions. To create the app registration, you need the following five pieces of information:

- Display name: App registration name (for example, OCPAzureAD)
- Home page: OpenShift console URL (for example, https://masterdns343khhde.westus.cloudapp.azure.com/console)
- Identifier URI: OpenShift console URL (for example, https://masterdns343khhde.westus.cloudapp.azure.com/console)
- Reply URL: Master public URL and the app registration name (for example, https://masterdns343khhde.westus.cloudapp.azure.com/oauth2callback/OCPAzureAD)
- Password: Secure password (use a strong password)

The following example creates an app registration by using the preceding information:

```azurecli
az ad app create --display-name OCPAzureAD --homepage https://masterdns343khhde.westus.cloudapp.azure.com/console --reply-urls https://masterdns343khhde.westus.cloudapp.azure.com/oauth2callback/hwocpadint --identifier-uris https://masterdns343khhde.westus.cloudapp.azure.com/console --password {Strong Password}
```

If the command is successful, you get a JSON output similar to:

```json
{
  "appId": "12345678-ca3c-427b-9a04-ab12345cd678",
  "appPermissions": null,
  "availableToOtherTenants": false,
  "displayName": "OCPAzureAD",
  "homepage": "https://masterdns343khhde.westus.cloudapp.azure.com/console",
  "identifierUris": [
    "https://masterdns343khhde.westus.cloudapp.azure.com/console"
  ],
  "objectId": "62cd74c9-42bb-4b9f-b2b5-b6ee88991c80",
  "objectType": "Application",
  "replyUrls": [
    "https://masterdns343khhde.westus.cloudapp.azure.com/oauth2callback/OCPAzureAD"
  ]
}
```

Take note of the appId property returned from the command for a later step.

In the Azure portal:

1.  Select **Azure Active Directory** > **App Registration**.
2.  Search for your app registration (for example, OCPAzureAD).
3.  In the results, click the app registration.
4.  Under **Settings**, select **Required permissions**.
5.  Under **Required Permissions**, select **Add**.

  ![App Registration](media/openshift-post-deployment/app-registration.png)

6.  Click Step 1: Select API, and then click **Windows Azure Active Directory (Microsoft.Azure.ActiveDirectory)**. Click **Select** at the bottom.

  ![App Registration Select API](media/openshift-post-deployment/app-registration-select-api.png)

7.  On Step 2: Select Permissions, select **Sign in and read user profile** under **Delegated Permissions**, and then click **Select**.

  ![App Registration Access](media/openshift-post-deployment/app-registration-access.png)

8.  Select **Done**.

### Configure OpenShift for Azure AD authentication

To configure OpenShift to use Azure AD as an authentication provider, the /etc/origin/master/master-config.yaml file must be edited on all master nodes.

Find the tenant ID by using the following CLI command:

```azurecli
az account show
```

In the yaml file, find the following lines:

```yaml
oauthConfig:
  assetPublicURL: https://masterdns343khhde.westus.cloudapp.azure.com/console/
  grantConfig:
    method: auto
  identityProviders:
  - challenge: true
    login: true
    mappingMethod: claim
    name: htpasswd_auth
    provider:
      apiVersion: v1
      file: /etc/origin/master/htpasswd
      kind: HTPasswdPasswordIdentityProvider
```

Insert the following lines immediately after the preceding lines:

```yaml
  - name: <App Registration Name>
    challenge: false
    login: true
    mappingMethod: claim
    provider:
      apiVersion: v1
      kind: OpenIDIdentityProvider
      clientID: <appId>
      clientSecret: <Strong Password>
      claims:
        id:
        - sub
        preferredUsername:
        - unique_name
        name:
        - name
        email:
        - email
      urls:
        authorize: https://login.microsoftonline.com/<tenant Id>/oauth2/authorize
        token: https://login.microsoftonline.com/<tenant Id>/oauth2/token
```

Make sure the text aligns correctly under identityProviders. Find the tenant ID by using the following CLI command: ```az account show```

Restart the OpenShift master services on all master nodes:

**OpenShift Container Platform (OCP) with multiple masters**

```bash
sudo systemctl restart atomic-openshift-master-api
sudo systemctl restart atomic-openshift-master-controllers
```

**OpenShift Container Platform with a single master**

```bash
sudo systemctl restart atomic-openshift-master
```

**OKD with multiple masters**

```bash
sudo systemctl restart origin-master-api
sudo systemctl restart origin-master-controllers
```

**OKD with a single master**

```bash
sudo systemctl restart origin-master
```

In the OpenShift console, you now see two options for authentication: htpasswd_auth and [App Registration].

## Monitor OpenShift with Log Analytics

There are three ways to add the Log Analytics agent to OpenShift.
- Install the Log Analytics agent for Linux directly on each OpenShift node
- Enable Log Analytics VM Extension on each OpenShift node
- Install the Log Analytics agent as a OpenShift daemon-set

The full instructions are located here: https://docs.microsoft.com/azure/log-analytics/log-analytics-containers#configure-a-log-analytics-agent-for-red-hat-openshift.

## Configure metrics and logging

Based on the branch, the Azure Resource Manager templates for OpenShift Container Platform and OKD may provide input parameters for enabling metrics and logging as part of the installation.

The OpenShift Container Platform Marketplace offer also provides an option to enable metrics and logging during cluster installation.

If metrics / logging wasn't enabled during the installation of the cluster, they can easily be enabled after the fact.

### Ansible inventory pre-work

Verify the ansible inventory file (/etc/ansible/hosts) has the appropriate variables for metrics / logging. The inventory file can be found on different hosts based on the template used.

For the OpenShift Container template and Marketplace offer, the inventory file is located on Bastion host. For the OKD template, the inventory file is located on either the master-0 host or the bastion host based on the branch in use.

1. Edit the /etc/ansible/hosts file and add the following lines after the Identity Provider Section (# Enable HTPasswdPasswordIdentityProvider). If these lines are already present, don't add them again.

   OpenShift / OKD versions 3.9 and earlier

   ```yaml
   # Setup metrics
   openshift_hosted_metrics_deploy=false
   openshift_metrics_cassandra_storage_type=dynamic
   openshift_metrics_start_cluster=true
   openshift_metrics_hawkular_nodeselector={"type":"infra"}
   openshift_metrics_cassandra_nodeselector={"type":"infra"}
   openshift_metrics_heapster_nodeselector={"type":"infra"}
   openshift_hosted_metrics_public_url=https://metrics.$ROUTING/hawkular/metrics

   # Setup logging
   openshift_hosted_logging_deploy=false
   openshift_hosted_logging_storage_kind=dynamic
   openshift_logging_fluentd_nodeselector={"logging":"true"}
   openshift_logging_es_nodeselector={"type":"infra"}
   openshift_logging_kibana_nodeselector={"type":"infra"}
   openshift_logging_curator_nodeselector={"type":"infra"}
   openshift_master_logging_public_url=https://kibana.$ROUTING
   ```

   OpenShift / OKD versions 3.10 and later

   ```yaml
   # Setup metrics
   openshift_metrics_install_metrics=false
   openshift_metrics_start_cluster=true
   openshift_metrics_hawkular_nodeselector={"node-role.kubernetes.io/infra":"true"}
   openshift_metrics_cassandra_nodeselector={"node-role.kubernetes.io/infra":"true"}
   openshift_metrics_heapster_nodeselector={"node-role.kubernetes.io/infra":"true"}

   # Setup logging
   openshift_logging_install_logging=false
   openshift_logging_fluentd_nodeselector={"logging":"true"}
   openshift_logging_es_nodeselector={"node-role.kubernetes.io/infra":"true"}
   openshift_logging_kibana_nodeselector={"node-role.kubernetes.io/infra":"true"}
   openshift_logging_curator_nodeselector={"node-role.kubernetes.io/infra":"true"}
   openshift_logging_master_public_url=https://kibana.$ROUTING
   ```

3. Replace $ROUTING with the string used for the openshift_master_default_subdomain option in the same /etc/ansible/hosts file.

### Azure Cloud Provider in use

SSH to the bastion node or first master node (based on template and branch in use) using the credentials provided during deployment. Issue the following command:

**OpenShift Container Platform 3.7 and earlier**

```bash
ansible-playbook /usr/share/ansible/openshift-ansible/playbooks/byo/openshift-cluster/openshift-metrics.yml \
-e openshift_metrics_install_metrics=True \
-e openshift_metrics_cassandra_storage_type=dynamic

ansible-playbook /usr/share/ansible/openshift-ansible/playbooks/byo/openshift-cluster/openshift-logging.yml \
-e openshift_logging_install_logging=True \
-e openshift_hosted_logging_storage_kind=dynamic
```

**OpenShift Container Platform 3.9 and later**

```bash
ansible-playbook /usr/share/ansible/openshift-ansible/playbooks/openshift-metrics/config.yml \
-e openshift_metrics_install_metrics=True \
-e openshift_metrics_cassandra_storage_type=dynamic

ansible-playbook /usr/share/ansible/openshift-ansible/playbooks/openshift-logging/config.yml \
-e openshift_logging_install_logging=True \
-e openshift_logging_es_pvc_dynamic=true
```

**OKD 3.7 and earlier**

```bash
ansible-playbook ~/openshift-ansible/playbooks/byo/openshift-cluster/openshift-metrics.yml \
-e openshift_metrics_install_metrics=True \
-e openshift_metrics_cassandra_storage_type=dynamic

ansible-playbook ~/openshift-ansible/playbooks/byo/openshift-cluster/openshift-logging.yml \
-e openshift_logging_install_logging=True \
-e openshift_hosted_logging_storage_kind=dynamic
```

**OKD 3.9 and later**

```bash
ansible-playbook ~/openshift-ansible/playbooks/byo/openshift-cluster/openshift-metrics.yml \
-e openshift_metrics_install_metrics=True \
-e openshift_metrics_cassandra_storage_type=dynamic

ansible-playbook ~/openshift-ansible/playbooks/openshift-logging/config.yml \
-e openshift_logging_install_logging=True \
-e openshift_logging_es_pvc_dynamic=true
```

### Azure Cloud Provider not in use

SSH to the bastion node or first master node (based on template and branch in use) using the credentials provided during deployment. Issue the following command:


**OpenShift Container Platform 3.7 and earlier**

```bash
ansible-playbook /usr/share/ansible/openshift-ansible/playbooks/byo/openshift-cluster/openshift-metrics.yml \
-e openshift_metrics_install_metrics=True

ansible-playbook /usr/share/ansible/openshift-ansible/playbooks/byo/openshift-cluster/openshift-logging.yml \
-e openshift_logging_install_logging=True
```

**OpenShift Container Platform 3.9 and later**

```bash
ansible-playbook /usr/share/ansible/openshift-ansible/playbooks/openshift-metrics/config.yml \
-e openshift_metrics_install_metrics=True

ansible-playbook /usr/share/ansible/openshift-ansible/playbooks/openshift-logging/config.yml \
-e openshift_logging_install_logging=True
```

**OKD 3.7 and earlier**

```bash
ansible-playbook ~/openshift-ansible/playbooks/byo/openshift-cluster/openshift-metrics.yml \
-e openshift_metrics_install_metrics=True

ansible-playbook ~/openshift-ansible/playbooks/byo/openshift-cluster/openshift-logging.yml \
-e openshift_logging_install_logging=True
```

**OKD 3.9 and later**

```bash
ansible-playbook ~/openshift-ansible/playbooks/byo/openshift-cluster/openshift-metrics.yml \
-e openshift_metrics_install_metrics=True
ansible-playbook ~/openshift-ansible/playbooks/openshift-logging/config.yml \
-e openshift_logging_install_logging=True
```

## Install Open Service Broker for Azure (OSBA)

Open Service Broker for Azure, or OSBA, lets you provision Azure Cloud Services directly from OpenShift. OSBA in an Open Service Broker API implementation for Azure. The Open Service Broker API is a spec that defines a common language for cloud providers that cloud native applications can use to manage cloud services without lock-in.

To install OSBA on OpenShift, follow the instructions located here: https://github.com/Azure/open-service-broker-azure#openshift-project-template. 

## Next steps

- [Getting started with OpenShift Container Platform](https://docs.openshift.com/container-platform)
- [Getting started with OKD](https://docs.okd.io/latest)

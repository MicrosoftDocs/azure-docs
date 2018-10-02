---
title: OpenShift on Azure post-deployment tasks | Microsoft Docs
description: Additional tasks for after an OpenShift cluster has been deployed. 
services: virtual-machines-linux
documentationcenter: virtual-machines
author: haroldwongms
manager: najoshi
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

After you deploy an OpenShift cluster, you can configure additional items. This article covers the following:

- How to configure single sign-on by using Azure Active Directory (Azure AD)
- How to configure Log Analytics to monitor OpenShift
- How to configure metrics and logging

## Configure single sign-on by using Azure Active Directory

To use Azure Active Directory for authentication, first you need to create an Azure AD app registration. This process involves two steps: creating the app registration, and configuring permissions.

### Create an app registration

These steps use the Azure CLI to create the app registration, and the GUI (portal) to set the permissions. To create the app registration, you need the following five pieces of information:

- Display name: App registration name (for example, OCPAzureAD)
- Home page: OpenShift console URL (for example, https://masterdns343khhde.westus.cloudapp.azure.com:8443/console)
- Identifier URI: OpenShift console URL (for example, https://masterdns343khhde.westus.cloudapp.azure.com:8443/console)
- Reply URL: Master public URL and the app registration name (for example, https://masterdns343khhde.westus.cloudapp.azure.com/oauth2callback/OCPAzureAD)
- Password: Secure password (use a strong password)

The following example creates an app registration by using the preceding information:

```azurecli
az ad app create --display-name OCPAzureAD --homepage https://masterdns343khhde.westus.cloudapp.azure.com:8443/console --reply-urls https://masterdns343khhde.westus.cloudapp.azure.com/oauth2callback/OCPAzureAD --identifier-uris https://masterdns343khhde.westus.cloudapp.azure.com:8443/console --password {Strong Password}
```

If the command is successful, you get a JSON output similar to:

```json
{
  "appId": "12345678-ca3c-427b-9a04-ab12345cd678",
  "appPermissions": null,
  "availableToOtherTenants": false,
  "displayName": "OCPAzureAD",
  "homepage": "https://masterdns343khhde.westus.cloudapp.azure.com:8443/console",
  "identifierUris": [
    "https://masterdns343khhde.westus.cloudapp.azure.com:8443/console"
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
  assetPublicURL: https://masterdns343khhde.westus.cloudapp.azure.com:8443/console/
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

Find the tenant ID by using the following CLI command: ```az account show```

Restart the OpenShift master services on all master nodes:

**OpenShift Origin**

```bash
sudo systemctl restart origin-master-api
sudo systemctl restart origin-master-controllers
```

**OpenShift Container Platform (OCP) with multiple masters**

```bash
sudo systemctl restart atomic-openshift-master-api
sudo systemctl restart atomic-openshift-master-controllers
```

**OpenShift Container Platform with a single master**

```bash
sudo systemctl restart atomic-openshift-master
```

In the OpenShift console, you now see two options for authentication: htpasswd_auth and [App Registration].

## Monitor OpenShift with Log Analytics

To monitor OpenShift with Log Analytics, you can use one of two options: OMS Agent installation on VM host, or OMS Container. This article provides instructions for deploying the OMS Container.

## Create an OpenShift project for Log Analytics and set user access

```bash
oadm new-project omslogging --node-selector='zone=default'
oc project omslogging
oc create serviceaccount omsagent
oadm policy add-cluster-role-to-user cluster-reader system:serviceaccount:omslogging:omsagent
oadm policy add-scc-to-user privileged system:serviceaccount:omslogging:omsagent
```

## Create a daemon set yaml file

Create a file named ocp-omsagent.yml:

```yaml
apiVersion: extensions/v1beta1
kind: DaemonSet
metadata:
  name: oms
spec:
  selector:
    matchLabels:
      name: omsagent
  template:
    metadata:
      labels:
        name: omsagent
        agentVersion: 1.4.0-45
        dockerProviderVersion: 10.0.0-25
    spec:
      nodeSelector:
        zone: default
      serviceAccount: omsagent
      containers:
      - image: "microsoft/oms"
        imagePullPolicy: Always
        name: omsagent
        securityContext:
          privileged: true
        ports:
        - containerPort: 25225
          protocol: TCP
        - containerPort: 25224
          protocol: UDP
        volumeMounts:
        - mountPath: /var/run/docker.sock
          name: docker-sock
        - mountPath: /etc/omsagent-secret
          name: omsagent-secret
          readOnly: true
        livenessProbe:
          exec:
            command:
              - /bin/bash
              - -c
              - ps -ef | grep omsagent | grep -v "grep"
          initialDelaySeconds: 60
          periodSeconds: 60
      volumes:
      - name: docker-sock
        hostPath:
          path: /var/run/docker.sock
      - name: omsagent-secret
        secret:
         secretName: omsagent-secret
````

## Create a secret yaml file

To create the secret yaml file, you need two pieces of information: Log Analytics Workspace ID and Log Analytics Workspace Shared Key. 

A sample ocp-secret.yml file follows: 

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: omsagent-secret
data:
  WSID: wsid_data
  KEY: key_data
```

Replace wsid_data with the Base64 encoded Log Analytics Workspace ID. Then replace key_data with the Base64-encoded Log Analytics Workspace Shared Key.

```bash
wsid_data='11111111-abcd-1111-abcd-111111111111'
key_data='My Strong Password'
echo $wsid_data | base64 | tr -d '\n'
echo $key_data | base64 | tr -d '\n'
```

## Create the secret and daemon set

Deploy the secret file:

```bash
oc create -f ocp-secret.yml
```

Deploy the OMS Agent daemon set:

```bash
oc create -f ocp-omsagent.yml
```

## Configure metrics and logging

The Azure Resource Manager template for OpenShift Container Platform provides input parameters for enabling metrics and logging. The OpenShift Container Platform Marketplace offer and the OpenShift Origin Resource Manager template do not.

If you used the OCP Resource Manager template and metrics and logging weren't enabled at installation time, or if you used the OCP Marketplace offer, you can be easily enable these after the fact. If you're using the OpenShift Origin Resource Manager template, some pre-work is required.

### OpenShift Origin template pre-work

1. SSH to the first master node by using port 2200.

   Example:

   ```bash
   ssh -p 2200 clusteradmin@masterdnsixpdkehd3h.eastus.cloudapp.azure.com 
   ```

2. Edit the /etc/ansible/hosts file and add the following lines after the Identity Provider Section (# Enable HTPasswdPasswordIdentityProvider):

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

3. Replace $ROUTING with the string used for the openshift_master_default_subdomain option in the same /etc/ansible/hosts file.

### Azure Cloud Provider in use

On the first master node (Origin) or bastion node (OCP), SSH by using the credentials provided during deployment. Issue the following command:

```bash
ansible-playbook $HOME/openshift-ansible/playbooks/byo/openshift-cluster/openshift-metrics.yml \
-e openshift_metrics_install_metrics=True \
-e openshift_metrics_cassandra_storage_type=dynamic

ansible-playbook $HOME/openshift-ansible/playbooks/byo/openshift-cluster/openshift-logging.yml \
-e openshift_logging_install_logging=True \
-e openshift_hosted_logging_storage_kind=dynamic
```

### Azure Cloud Provider not in use

On the first master node (Origin) or bastion node (OCP), SSH by using the credentials provided during deployment. Issue the following command:

```bash
ansible-playbook $HOME/openshift-ansible/playbooks/byo/openshift-cluster/openshift-metrics.yml \
-e openshift_metrics_install_metrics=True 

ansible-playbook $HOME/openshift-ansible/playbooks/byo/openshift-cluster/openshift-logging.yml \
-e openshift_logging_install_logging=True 
```

## Next steps

- [Getting started with OpenShift Container Platform](https://docs.openshift.com/container-platform/3.6/getting_started/index.html)
- [Getting started with OpenShift Origin](https://docs.openshift.org/latest/getting_started/index.html)

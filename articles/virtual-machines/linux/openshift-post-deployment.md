---
title: OpenShift on Azure Post Deployment Tasks | Microsoft Docs
description: OpenShift Post Deployment Tasks
services: virtual-machines-linux
documentationcenter: virtual-machines
author: haroldw
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

After the OpenShift cluster is deployed, there are additional items that can be configured. This article will cover the following:

- Configure Single Sign On using Azure Active Directory (AAD)
- Configure OMS to monitor OpenShift
- Configure Metrics and Logging

## Single Sign On using AAD

In order to use AAD for authentication, an Azure AD App Registration must be created first. This process will involve two steps - creation of the app registration and then configure permissions.

### Create app registration

We will use the Azure CLI to create the App Registration and the GUI (Portal) to set the Permissions. To create the App Registration, five pieces of information will be needed.

- Display Name: App Registration Name (ex: OCPAzureAD)
- Home Page: OpenShift Console URL (ex:  https://masterdns343khhde.westus.cloudapp.azure.com:8443/console)
- Identifier URI: OpenShift Console URL (ex:  https://masterdns343khhde.westus.cloudapp.azure.com:8443/console)
- Reply URL: Master public URL and the App Registration Name (ex: https://masterdns343khhde.westus.cloudapp.azure.com:8443/oauth2callback/OCPAzureAD)
- Password: Secure Password (Use a Strong Password)

The following example will create an App Registration using the information from above.

```azurecli
az ad app create --display-name OCPAzureAD --homepage https://masterdns343khhde.westus.cloudapp.azure.com:8443/console --reply-urls https://masterdns343khhde.westus.cloudapp.azure.com:8443/oauth2callback/hwocpadint --identifier-uris https://masterdns343khhde.westus.cloudapp.azure.com:8443/console --password {Strong Password}
```

If the command is successful, you will get a JSON output similar to:

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
    "https://masterdns343khhde.westus.cloudapp.azure.com:8443/oauth2callback/OCPAzureAD"
  ]
}
```

Take note of the appId property returned from the command for a later step.

In the **Azure Portal**:

1.  Select **Azure Active Directory** --> **App Registration**
2.  Search for your App Registration (ex: OCPAzureAD)
3.  In results, click the App Registration
4.  In Settings blade, select **Required permissions**
5.  In Required Permissions blade, click **Add**

  ![App Registration](media/openshift-post-deployment/app-registration.png)

6.  Click on Step 1: Select API and then click **Windows Azure Active Directory (Microsoft.Azure.ActiveDirectory)** and click **Select** at bottom

  ![App Registration Select API](media/openshift-post-deployment/app-registration-select-api.png)

7.  On Step 2: Select Permissions, select **Sign in and read user profile** under **Delegated Permissions** and click **Select**

  ![App Registration Access](media/openshift-post-deployment/app-registration-access.png)

8.  Click **Done**

### Configure OpenShift for Azure AD authentication

To configure OpenShift to use Azure AD as an Authentication provider, the **/etc/origin/master/master-config.yaml** file must be edited on all Master Nodes.

The tenant Id can be found by using the following CLI command:

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

Insert the following lines immediately after the above lines:

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

The tenant Id can be found by using the following CLI command: ```az account show```

Restart the OpenShift Master services on all Master Nodes

**OpenShift Origin**

```bash
sudo systemctl restart origin-master-api
sudo systemctl restart origin-master-controllers
```

**OpenShift Container Platform with multiple Masters**

```bash
sudo systemctl restart atomic-openshift-master-api
sudo systemctl restart atomic-openshift-master-controllers
```

**OpenShift Container Platform with single Master**

```bash
sudo systemctl restart atomic-openshift-master
```

In the OpenShift Console, you will now see two options for authentication - htpasswd_auth and **[App Registration]**.

## Monitor OpenShift with OMS

Monitoring OpenShift with OMS can be achieved using one of two options - OMS Agent installation on VM host or OMS Container. This article provides instructions on deploying the OMS Container.

## Create an OpenShift project for OMS and set user access

```bash
oadm new-project omslogging --node-selector='zone=default'
oc project omslogging
oc create serviceaccount omsagent
oadm policy add-cluster-role-to-user cluster-reader system:serviceaccount:omslogging:omsagent
oadm policy add-scc-to-user privileged system:serviceaccount:omslogging:omsagent
```

## Create daemon set yaml file

Create a file named ocp-omsagent.yml.

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

## Create secret yaml file

In order to create the secret yaml file, two pieces of information will be needed - OMS Workspace ID and OMS Workspace Shared Key. 

Sample ocp-secret.yml file 

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: omsagent-secret
data:
  WSID: wsid_data
  KEY: key_data
```

Replace wsid_data with the Base64 encoded OMS Workspace ID and replace key_data with the Base64 encoded OMS Workspace Shared Key.

```bash
wsid_data='11111111-abcd-1111-abcd-111111111111'
key_data='My Strong Password'
echo $wsid_data | base64 | tr -d '\n'
echo $key_data | base64 | tr -d '\n'
```

## Create secret and daemon set

Deploy the Secret file

```bash
oc create -f ocp-secret.yml
```

Deploy the OMS Agent Daemon Set

```bash
oc create -f ocp-omsagent.yml
```

## Configure metrics and logging

The OpenShift Container Platform (OCP) Resource Manager template provides input parameters for enabling Metrics and Logging. The OpenShift Container Platform Marketplace Offer and OpenShift Origin Resource Manager template does not.

If the OCP Resource Manager template was used and Metrics and Logging weren't enabled at installation time or the OCP Marketplace offer was used, these can be easily enabled after the fact. If using the OpenShift Origin Resource Manager template, some pre-work is required.

### OpenShift Origin template pre-work

SSH to the the first Master Node using port 2200

Example

```bash
ssh -p 2200 clusteradmin@masterdnsixpdkehd3h.eastus.cloudapp.azure.com 
```

Edit the **/etc/ansible/hosts file** and add the following lines after the Identity Provider Section (# Enable HTPasswdPasswordIdentityProvider)

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

Replace $ROUTING with the string used for **openshift_master_default_subdomain** option in the same **/etc/ansible/hosts** file.

### Azure Cloud Provider in use

On the first Master Node (Origin) or Bastion Node (OCP), SSH using the credentials provided during deployment. Issue the following command:

```bash
ansible-playbook /usr/share/ansible/openshift-ansible/playbooks/byo/openshift-cluster/openshift-metrics.yml \
-e openshift_metrics_install_metrics=True \
-e openshift_metrics_cassandra_storage_type=dynamic

ansible-playbook /usr/share/ansible/openshift-ansible/playbooks/byo/openshift-cluster/openshift-logging.yml \
-e openshift_logging_install_logging=True \
-e openshift_hosted_logging_storage_kind=dynamic
```

### Azure Cloud Provider not in use

On the first Master Node (Origin) or Bastion Node (OCP), SSH using the credentials provided during deployment. Issue the following command:

```bash
ansible-playbook /usr/share/ansible/openshift-ansible/playbooks/byo/openshift-cluster/openshift-metrics.yml \
-e openshift_metrics_install_metrics=True 

ansible-playbook /usr/share/ansible/openshift-ansible/playbooks/byo/openshift-cluster/openshift-logging.yml \
-e openshift_logging_install_logging=True 
```

## Next steps

- [Getting started with OpenShift Container Platform](https://docs.openshift.com/container-platform/3.6/getting_started/index.html)
- [Getting started with OpenShift Origin](https://docs.openshift.org/latest/getting_started/index.html)
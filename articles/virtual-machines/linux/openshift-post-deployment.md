---
title: Post Deployment Tasks | Microsoft Docs
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

# Post Deployment Tasks

After the OpenShift cluster is deployed, there are additional items that can be configured. This article will cover the following:

- Configure Single Sign On using Azure Active Directory (AAD)
- Configure OMS to monitor OpenShift
- Configure Metrics and Logging

## Single Sign On using AAD

In order to use AAD for authentication, an Azure AD App Registration must be configured first.

[include detailed steps]

## Monitor OpenShift with OMS

Monitoring OpenShift with OMS can be achieved using one of two options - OMS Agent installation on VM host or OMS Container. This article provides instructions on deploying the OMS Container.

## Create an OpenShift Project for OMS and set user access

```
oadm new-project omslogging --node-selector='zone=default'
oc project omslogging
oc create serviceaccount omsagent
oadm policy add-cluster-role-to-user cluster-reader system:serviceaccount:omslogging:omsagent
oadm policy add-scc-to-user privileged system:serviceaccount:omslogging:omsagent
```

## Create daemon set yaml file

Create a file named ocp-omsagent.yml.

```
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

```
apiVersion: v1
kind: Secret
metadata:
  name: omsagent-secret
data:
  WSID: wsid_data
  KEY: key_data
```

Replace wsid_data with the Base64 encoded OMS Workspace ID and replace key_data with the Base64 encoded OMS Workspace Shared Key.

```
wsid_data='11111111-abcd-1111-abcd-111111111111'
key_data='My Strong Password'
echo $wsid_data | base64 | tr -d '\n'
echo $key_data | base64 | tr -d '\n'
```

## Create Secret and Daemon Set

Deploy the Secret file

```
oc create -f ocp-secret.yml
```

Deploy the OMS Agent Daemon Set

```
oc create -f ocp-omsagent.yml
```

## Configure Metrics and Logging

The OpenShift Container Platform (OCP) ARM template provides input parameters for enabling Metrics and Logging. The OpenShift Container Platform Marketplace Offer and OpenShift Origin ARM template does not.

If the OCP ARM template was used and Metrics and Logging weren't enabled at installation time or the OCP Marketplace offer was used, these can be easily enabled after the fact. If using the OpenShift Origin ARM template, some pre-work is required.

### OpenShift Origin Template Pre-work

SSH to the the first Master Node using port 2200

Example
```
ssh -p 2200 masterdnsixpdkehd3h.eastus.azure.cloudapp.com 
```

Edit the /etc/ansible/hosts file and add the following lines after the Identity Provider Section (# Enable HTPasswdPasswordIdentityProvider)

```
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

Replace $ROUTING with the string used for openshift_master_default_subdomain option in the same /etc/ansible/hosts file.

### Azure Cloud Provider in use

On the Bastion Node, SSH using the credentials provided during deployment. Issue the following command:

````
ansible-playbook /usr/share/ansible/openshift-ansible/playbooks/byo/openshift-cluster/openshift-metrics.yml \
-e openshift_metrics_install_metrics=True \
-e openshift_metrics_cassandra_storage_type=dynamic

ansible-playbook /usr/share/ansible/openshift-ansible/playbooks/byo/openshift-cluster/openshift-logging.yml \
-e openshift_logging_install_logging=True \
-e openshift_hosted_logging_storage_kind=dynamic
```

### Azure Cloud Provider **not** in use

On the Bastion Node, SSH using the credentials provided during deployment. Issue the following command:

````
ansible-playbook /usr/share/ansible/openshift-ansible/playbooks/byo/openshift-cluster/openshift-metrics.yml \
-e openshift_metrics_install_metrics=True 

ansible-playbook /usr/share/ansible/openshift-ansible/playbooks/byo/openshift-cluster/openshift-logging.yml \
-e openshift_logging_install_logging=True 
```

## Next Steps

- [Getting Started with OpenShift Container Platform](https://docs.openshift.com/container-platform/3.6/getting_started/index.html)
- [Getting Started with OpenShift Origin](https://docs.openshift.org/latest/getting_started/index.html)
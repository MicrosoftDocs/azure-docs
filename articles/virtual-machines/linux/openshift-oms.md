---
title: Monitor OpenShift with OMS | Microsoft Docs
description: Monitor OpenShift with OMS
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

# Monitor OpenShift with OMS

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

## Next Steps

- [Getting Started with OpenShift Container Platform](https://docs.openshift.com/container-platform/3.6/getting_started/index.html)
- [Getting Started with OpenShift Origin](https://docs.openshift.org/latest/getting_started/index.html)
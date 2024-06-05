---
title: Configure DNS Forwarding for Azure Red Hat OpenShift 4
description: Configure DNS Forwarding for Azure Red Hat OpenShift 4
author: johnmarco
ms.author: johnmarc
ms.service: azure-redhat-openshift
ms.topic: conceptual
ms.date: 04/24/2020
---
# Configure DNS forwarding on an Azure Red Hat OpenShift 4 Cluster

To configure DNS Forwarding on an Azure Red Hat OpenShift cluster, you'll need to modify the DNS operator. This modification will allow your application pods running inside the cluster to resolve names hosted on a private DNS server outside the cluster. These steps are documented for OpenShift 4.6 [here](https://docs.openshift.com/container-platform/4.6/networking/dns-operator.html).

For example, if you want to forward all DNS requests for *.example.com to be resolved by a DNS server 192.168.100.10, you can edit the operator configuration by running:
 
```bash
oc edit dns.operator/default
```
 
This will launch an editor and you can replace `spec: {}` with:
 
```yaml
spec:
  servers:
  - forwardPlugin:
      upstreams:
      - 192.168.100.10
    name: example-dns
    zones:
    - example.com
```

Save the file and exit your editor.

## Next steps
Check out more information on DNS forwarding for OpenShift 4.6 [here](https://docs.openshift.com/container-platform/4.6/networking/dns-operator.html).
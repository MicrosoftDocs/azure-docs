---
title: Customizing CoreDNS
description: Learn how to customize CoreDNS using Azure Kubernetes Service (AKS).
services: container-service
author: jnoller

ms.service: container-service
ms.topic: article
ms.date: 03/15/2019
ms.author: jnoller

#Customer intent: As a cluster operator or developer, I want to learn how to customize the CoreDNS configuration to add sub domains or extend to custom DNS endpoints within my network
---

# Customizing CoreDNS with Azure Kubernetes Service

Azure Kubernetes Service (AKS) uses the [CoreDNS][coredns] project for cluster DNS management and resolution with all 1.12.x and higher clusters. Previously, the now deprecated kube-dns project was used. This article shows you basic customization options available to you with this change.

> [!NOTE]
> kube-dns offered different [customization options][kubednsblog] via a Kubernetes config map, CoreDNS is **not** backwards compatible with kube-dns, so any customizations you had previously will need to be altered to be compatible with CoreDNS.

For additional information about CoreDNS, customizations and Kubernetes, please see the [official docs][corednsk8s].

## Before you begin

This article assumes that you have an existing AKS cluster. If you need an AKS cluster, see the AKS quickstart [using the Azure CLI][aks-quickstart-cli] or [using the Azure portal][aks-quickstart-portal].

## Changing the DNS TTL

In some cases, you may want to lower, or raise the Time to Live (TTL) setting for DNS name caching. CoreDNS offers a wide range DNS cache customization options which you can be [seen here][dnscache] but for this example, we will only alter the TTL value, which by default is 30 seconds.

Since AKS is a managed service, you can not modify the main configuration for CoreDNS (called a CoreFile), instead, you can use a Kubernetes config map to override the default settings:

>[!NOTE]
> If you want to see the AKS provided CoreDNS configmap, you can run: `kubectl get configmaps coredns -o yaml`

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: coredns-custom # this is the name of the configmap you can overwrite with your changes
  namespace: kube-system
data:
  test.server: | # you may select any name here, but it must end with the .server file extension
    .:53 {
        cache 15  # this is our new cache value
    }
```

You can see that this configmap is quite small - but you need to note the **name** value. By default, CoreDNS does not support this type of customization. As mentioned, you normally directly change the CoreFile itself. AKS has added the `coredns-custom` configmap which is loaded *after* the main CoreFile allowing for this flexibility.

In the above, we tell CoreDNS that for all domains (shown by the `.` in `.:53`), on port 53 (the default DNS port), we want to set the cache ttl to 15 (`cache 15`).

Once we have this and we save it as `coredns-custom.json` on disk, we can then load it via:

```
kubectl create configmap coredns-custom.json
```

And you can verify it:

```
kubectl get configmaps coredns-custom -o yaml
```

The final step to load the configmap is to **force** CoreDNS to reload, to do that, we run:

```
kubectl -n kube-system delete po -l k8s-app=kube-dns
```

This command is not destructive and will not cause down time - all it is doing is deleting the `kube-dns` pods, and allowing the system to recreate them. After this, you configuration will take effect.

## Re-writing DNS

Here's an example configmap to perform on-the-fly DNS name rewriting:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: coredns-custom
  namespace: kube-system
data:
  test.server: |
    <domain to be rewritten>.com:53 {
        errors
        cache 30
        rewrite name substring <domain to be rewritten>.com default.svc.cluster.local
        proxy .  /etc/resolv.conf # you can redirect this to a specific DNS server such as 10.0.0.10
    }
```

## Custom Proxies

Some customers need to use custom proxies, in this case, the configmap would look like:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: coredns-custom # this is the name of the configmap you can overwrite with your changes
  namespace: kube-system
data:
  test.server: | # you may select any name here, but it must end with the .server file extension
    .:53 {
        proxy foo.com 1.1.1.1
    }
```

## Custom DNS server for custom domains

In this case, I'd like to resolve my custom domain 'pug.life', but that's not a valid TLD, and so my AKS cluster would be unable to resolve it normally. So we load this:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: coredns-custom
  namespace: kube-system
data:
  puglife.server: |
    puglife.local:53 {
        errors
        cache 30
        proxy . 192.11.0.1  # this is my test/dev DNS server
    }
```
And after reloading CoreDNS, I can now resolve my bespoke domain!

## Stub domains

For this example, we want custom stub domains:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: coredns-custom # this is the name of the configmap you can overwrite with your changes
  namespace: kube-system
data:
    abc.com:53 {
        errors
        cache 30
        proxy . 1.2.3.4
    }
    my.cluster.local:53 {
        errors
        cache 30
        proxy . 2.3.4.5
    }
```


[kubednsblog]: https://www.danielstechblog.io/using-custom-dns-server-for-domain-specific-name-resolution-with-azure-kubernetes-service/
[cdnsplugins]: https://coredns.io/manual/toc/#plugins
[coredns]: https://coredns.io/
[precedence]: https://github.com/coredns/coredns/blob/master/plugin.cfg
[corednsk8s]: https://kubernetes.io/docs/tasks/administer-cluster/dns-custom-nameservers/#coredns
[customdomains]: https://coredns.io/2017/05/08/custom-dns-entries-for-kubernetes/
[dnscache]: https://coredns.io/plugins/cache/
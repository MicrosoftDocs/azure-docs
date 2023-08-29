---
title: Tag ARO resources using Azure Policy
description: Learn how to tag ARO resources in a cluster's resource group using Azure Policy
ms.service: azure-redhat-openshift
ms.topic: article
ms.date: 08/29/2023
author: johnmarco
ms.author: johnmarc
keywords: aro, openshift, cli, tagging
#Customer intent: I need to understand how to use Azure Policy to tag resources in a cluster's resource group.
---

# Tag ARO resources using Azure Policy







Azure Red Hat OpenShift uses cluster certificates stored on worker machines for API and application ingress. These certificates are normally updated in a transparent process during routine maintenance. In some cases, cluster certificates might fail to update during maintenance.

If you're experiencing certificate issues, you can manually update your certificates using [the `az aro update` command](/cli/azure/aro#az-aro-update):

```azurecli-interactive
az aro update --name MyCluster --resource-group MyResourceGroup --refresh-credentials
```
where:

* `name` is the name of the cluster
* `resource-group` is the name of the resource group. You can configure the default group using `az-config --defaults group=<name>`.
* refresh-credentials refreshes cluster application credentials

Running this command restarts worker machines and updates the cluster certificates, setting the cluster to a known, proper state. 

> [!NOTE]
> Certificates for custom domains need to be updated manually. For more information, see the [Red Hat OpenShift documentation](https://docs.openshift.com/rosa/applications/deployments/osd-config-custom-domains-applications.html).


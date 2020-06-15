---
title: Add or update your Red Hat pull secret
description: Add or update your Red Hat pull secret on existing 4.x ARO clusters
author: sakthi-vetrivel
ms.author: suvetriv
ms.service: container-service
ms.topic: conceptual
ms.date: 05/21/2020
keywords: pull secret, aro, openshift, red hat
#Customer intent: As a customer, I want to add or update my pull secret on an existing 4.x ARO cluster.
---

# Add or update your Red Hat pull secret

This guide covers adding or updating your Red Hat pull secret for an existing Azure Red Hat OpenShift 4.x cluster.

If you are creating your cluster for the first time, then you can add your pull secret in the same command you use to create your cluster. See the [Create an Azure Red Hat OpenShift 4 cluster](tutorial-create-cluster.md#get-a-red-hat-pull-secret-optional) tutorial for more details.

## Before you begin

Ensure that you have administrator access to your cluster.

## Prepare your pull secret

If you created your cluster but did not add a pull secret, follow the steps in the [Create an Azure Red Hat OpenShift 4 cluster](tutorial-create-cluster.md#get-a-red-hat-pull-secret-optional) to get your Red Hat pull secret. Save this file in a secure location and proceed to the next section.

If you would like to update an existing pull secret, follow these steps:

1. Fetch the secret named `pull-secret` in the openshift-config namespace and save it to a separate file by running the following command: 

```console
oc get secrets pull-secret -n openshift-config -o template='{{index .data ".dockerconfigjson"}}' | base64 -d |jq > pull-secret.json
```

Your output should be similar to the following (note that the actual secret value has been removed):

```json
{
    "auths": {
        "arosvc.azurecr.io": {
            "auth": "<my-aroscv.azurecr.io-secret>"
        }
    }
}
```

2. Navigate to your [Red Hat OpenShift cluster manager portal](https://cloud.redhat.com/openshift/install/azure/aro-provisioned) and click **Click Download pull secret.** You Red Hat pull secret will look like the following (note that the actual secret values have been removed):

```json
{
    "auths": {
        "cloud.openshift.com": {
            "auth": "<my-crc-secret>",
            "email": "klamenzo@redhat.com"
        },
        "quay.io": {
            "auth": "<my-quayio-secret>",
            "email": "klamenzo@redhat.com"
        },
        "registry.connect.redhat.com": {
            "auth": "<my-registry.connect.redhat.com-secret>",
            "email": "klamenzo@redhat.com"
        },
        "registry.redhat.io": {
            "auth": "<my-registry.redhat.io-secret>",
            "email": "klamenzo@redhat.com"
        }
    }
}
```

3. Edit the pull secret file you got from your cluster by adding in the entries found in your Red Hat pull secret. Your final file should look like the following (note that the actual secret values have been removed):

```json
{
    "auths": {
        "cloud.openshift.com": {
            "auth": "<my-crc-secret>",
            "email": "klamenzo@redhat.com"
        },
        "quay.io": {
            "auth": "<my-quayio-secret>",
            "email": "klamenzo@redhat.com"
        },
        "registry.connect.redhat.com": {
            "auth": "<my-registry.connect.redhat.com-secret>",
            "email": "klamenzo@redhat.com"
        },
        "registry.redhat.io": {
            "auth": "<my-registry.redhat.io-secret>",
            "email": "klamenzo@redhat.com"
        },
        "arosvc.azurecr.io": {
            "auth": "<my-aroscv.azurecr.io-secret>"
        }
    }
}
```

4. Ensure the the file is valid json. There are many ways to validate your json. The following example uses jq:
```json
cat pull-secret.json | jq
```

> NOTE
> If an error is in the file it can be seen `parse error`.

## Add your pull secret to your cluster

Run the following update command to update or add your pull secret to your cluster:

```console
oc set data secret/pull-secret -n openshift-config --from-file=.dockerconfigjson=./pull-secret.json
```

Once the secret is set, Operator Hub will have access to the Red Hat certified operators.

## Validate that your secret is working

To ensure your pull secret has been updated and it working correctly, open OperatorHub and check for any Red Hat verified operator. For example, you can search for the OpenShift Container Storage operator and verify that the operator is available and you have permissions to install.

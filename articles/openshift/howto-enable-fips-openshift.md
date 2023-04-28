---
title: Enable FIPS on an Azure Red Hat OpenShift cluster
description: Learn how to enable FIPS on an Azure Red Hat OpenShift cluster.
ms.service: azure-redhat-openshift
ms.topic: article
ms.date: 5/5/2022
author: johnmarco
ms.author: johnmarc
keywords: aro, openshift, az aro, red hat, cli, azure, FIPS
#Customer intent: I need to understand how to enable FIPS on an Azure Red Hat OpenShift cluster.
---

# Enable FIPS for an Azure Red Hat OpenShift cluster

This article explains how to enable Federal Information Processing Standard (FIPS) for an Azure Red Hat OpenShift cluster. 

The Federal Information Processing Standard (FIPS) 140 is a US government standard that defines minimum security requirements for cryptographic modules in information technology products, and systems. Testing against the FIPS 140 standard is maintained by the Cryptographic Module Validation Program (CMVP), a joint effort between the US National Institute of Standards and Technology (NIST) and the Canadian Centre for Cyber Security, a branch of the Communications Security Establishment (CSE) of Canada.

## Support for FIPS cryptography

Starting with Release 4.10, you can deploy an Azure Red Hat OpenShift cluster in FIPS mode. FIPS mode ensures the control plane is using FIPS 140-2 cryptographic modules. All workloads and operators deployed on a cluster need to use FIPS 140-2 in order to be FIPS compliant.
 
You can install an Azure Red Hat OpenShift cluster that uses FIPS Validated / Modules in Process cryptographic libraries on the x86_64 architecture.

> [!NOTE]
> If you're using Azure File storage, you can't enable FIPS mode.

## To enable FIPS on your Azure Red Hat OpenShift cluster

To enable FIPs on your Azure Red Hat OpeShift cluster, define the following parameters as environment variables:

```azurecli-interactive
az aro create \
  --resource-group $RESOURCEGROUP \
  --name $CLUSTER \
  --vnet aro-vnet \
  --master-subnet master-subnet \
  --worker-subnet worker-subnet 
  --fips
```
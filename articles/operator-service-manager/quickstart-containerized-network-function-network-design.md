---
title: Design a Containerized Network Function (CNF) with Nginx
description: Learn how to design a Containerized Network Function (CNF) with Nginx.
author: sherrygonz
ms.author: sherryg
ms.date: 09/07/2023
ms.topic: quickstart
ms.service: azure-operator-service-manager
---

# Quickstart: Design a Containerized Network Function (CNF) Network Service Design with Nginx  


 This quickstart describes how to use the `az aosm` Azure CLI extension to create and publish a basic Network Service Design.

## Prerequisite: Azure account with active subscription

An Azure account with an active subscription is required. If you don't have an Azure subscription, follow the instructions here [Start free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) to create an account before you begin.

## Create input file

Create an input file for publishing the Network Service Design. Execute the following command to generate the input configuration file for the Network Service Design (NSD).

```azurecli
az aosm nsd generate-config
{
    "publisher_name": "Name of the Publisher resource you want your definition published to. Will be created if it does not exist.",
    "publisher_resource_group_name": "Resource group for the Publisher resource. Will be created if it does not exist.",
    "acr_artifact_store_name": "Name of the ACR Artifact Store resource. Will be created if it does not exist.",
    "location": "Azure location to use when creating resources.",
    "network_functions": [
        {
            "publisher": "The name of the publisher that this NFDV is published under.",
            "publisher_resource_group": "The resource group that the publisher is hosted in.",
            "name": "The name of the existing Network Function Definition Group to deploy using this NSD",
            "version": "The version of the existing Network Function Definition to base this NSD on.  This NSD will be able to deploy any NFDV with deployment parameters compatible with this version.",
            "publisher_offering_location": "The region that the NFDV is published to.",
            "publisher_scope": "The scope that the publisher is published under. Currently, only 'private' is supported.",    
            "type": "Type of Network Function. Valid values are 'cnf' or 'vnf'",
            "multiple_instances": "Set to true or false.  Whether the NSD should allow arbitrary numbers of this type of NF.  If set to false only a single instance will be allowed.  Only supported on VNFs, must be set to false on CNFs."
        }
    ],
    "nsdg_name": "Network Service Design Group Name. This is the collection of Network Service Design Versions. Will be created if it does not exist.",
    "nsd_version": "Version of the NSD to be created. This should be in the format A.B.C",
    "nsdv_description": "Description of the NSDV"
}
```
Here's a sample:

```azurecli
{
    "publisher_name": "nginx-publisher",
    "publisher_resource_group_name": "nginx-publisher-rg",
    "acr_artifact_store_name": "nginx-nsd-acr",
    "location": "uksouth",
    "network_functions": [
        {
            "publisher": "nginx-publisher",
            "publisher_resource_group": "nginx-publisher-rg",
            "name": "nginx-nfdg",
            "version": "1.0.0",
            "publisher_offering_location": "uksouth",
            "publisher_scope": "private",
            "type": "cnf",
            "multiple_instances": false
        }
    ],
    "nsdg_name": "nginx-nsdg",
    "nsd_version": "1.0.0",
    "nsdv_description": "Deploys a basic NGINX CNF"
}
```
## Build the Network Service Design (NSD)

Initiate the build process for the Network Service Definition (NSD) using the following command:

```azurecli
az aosm nsd build -f input.json
```
After the build process completes, review the generated files to gain insights into the NSD's architecture and structure.

## Publish the Network Service Design (NSD)

To publish the Network Service Design (NSD) and its associated artifacts, issue the following command:

```azurecli
az aosm nsd publish -f input.json
```
When the Publish process is complete navigate to your Publisher Resource Group to observe and review the resources and artifacts that were produced.

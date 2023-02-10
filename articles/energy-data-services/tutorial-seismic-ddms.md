---
title: Tutorial - Sample steps to interact with Seismic DDMS in Microsoft Energy Data Services  #Required; page title is displayed in search results. Include the brand.
description: This tutorial shows you how to interact with Seismic DDMS Microsoft Energy Data Services  #Required; article description that is displayed in search results. 
author: elizabethhalper #Required; your GitHub user alias, with correct capitalization.
ms.author: elhalper #Required; microsoft alias of author; optional team alias.
ms.service: energy-data-services #Required; service per approved list. slug assigned by ACOM.
ms.topic: tutorial #Required; leave this attribute/value as-is.
ms.date: 3/16/2022
ms.custom: template-tutorial #Required; leave this attribute/value as-is.
---

# Tutorial: Sample steps to interact with Seismic DDMS

Seismic DDMS provides the capability to operate on seismic data in the Microsoft Energy Data Services instance.

In this tutorial, you will learn how to:

> [!div class="checklist"]
> * Register data partition to seismic
> * Utilize seismic DDMS Api's to store and retrieve seismic data

[!INCLUDE [preview features callout](./includes/preview/preview-callout.md)]
## Prerequisites

### Microsoft Energy Data Services instance details

* Once the [Microsoft Energy Data Services instance](./quickstart-create-microsoft-energy-data-services-instance.md) is created, note down the following details:
  
  | Parameter          | Value to use             | Example                               |
  | ------------------ | ------------------------ |-------------------------------------- |
  | CLIENT_ID          | Application (client) ID  | 3dbbb.....  |
  | CLIENT_SECRET      | Client secrets           |  _fl******************                |
  | TENANT_ID          | Directory (tenant) ID    | 72f988bf-86f1-41af-91ab-2d7cd011db47  |
  | SCOPE              | Application (client) ID  | 3dbbb.....  |
  | base_uri           | URI                      | instancename.energy.azure.com              |
  | data-partition-id  | Data Partition(s)        | instancename-datapartitionid                       |

### Postman setup

1. Download and install [Postman](https://www.postman.com/) desktop app
2. Import the following files into Postman:
  * To import the Postman collection and environment variables, follow the steps outlined in [Importing data into Postman](https://learning.postman.com/docs/getting-started/importing-and-exporting-data/#importing-data-into-postman)
  * [Smoke test Postman collection](https://community.opengroup.org/osdu/platform/deployment-and-operations/infra-azure-provisioning/-/raw/master/source/ddms-smoke-tests/Azure%20DDMS%20OSDU%20Smoke%20Tests.postman_collection.json)
  * [Smoke Test Environment](https://community.opengroup.org/osdu/platform/deployment-and-operations/infra-azure-provisioning/-/raw/master/source/ddms-smoke-tests/%5BShip%5D%20osdu-glab.msft-osdu-test.org.postman_environment.json)
  
3. Update the **CURRENT_VALUE** of the Postman Environment with the information obtained in [Microsoft Energy Data Services instance details](#microsoft-energy-data-services-instance-details)

## Register data partition to seismic

 * Script to register
   ```sh
   curl --location --request POST '[url]/seistore-svc/api/v3/tenant/{{datapartition}}' \
   --header 'Authorization: Bearer {{TOKEN}}' \
   --header 'Content-Type: application/json' \
   --data-raw '{
    "esd": "{{datapartition}}.{{domain}}",
    "gcpid": "{{datapartition}}",
    "default_acl": "users.datalake.admins@{{datapartition}}.{{domain}}.com"
    }'
   ```
## Utilize seismic ddms API's to store and retrieve seismic data

In order to use the Seismic DMS, follow the steps in the Seismic DDMS SDUTIL tutorial.

## Next steps
<!-- Add a context sentence for the following links -->
> [!div class="nextstepaction"]
> [Seismic DDMS SDUTIL tutorial](./tutorial-seismic-ddms-sdutil.md)
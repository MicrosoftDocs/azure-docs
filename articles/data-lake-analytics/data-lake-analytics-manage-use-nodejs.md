---
title: Manage Azure Data Lake Analytics using Azure SDK for Node.js
description: This article describes how to use the Azure SDK for Node.js to manage Data Lake Analytics accounts, data sources, jobs & users.
ms.service: data-lake-analytics
ms.reviewer: whhender
ms.topic: how-to
ms.date: 01/27/2023
ms.custom: devx-track-js
---
# Manage Azure Data Lake Analytics using Azure SDK for Node.js

[!INCLUDE [manage-selector](../../includes/data-lake-analytics-selector-manage.md)]

[!INCLUDE [retirement-flag](includes/retirement-flag.md)]

This article describes how to manage Azure Data Lake Analytics accounts, data sources, users, and jobs using an app written using the Azure SDK for Node.js. 

The following versions are supported:

* **Node.js version: 0.10.0 or higher**
* **REST API version for Account: 2015-10-01-preview**

## Features

* Account management: create, get, list, update, and delete.

## How to install

```bash
npm install @azure/arm-datalake-analytics
```

## Authenticate using Azure Active Directory

 ```javascript
 const { DefaultAzureCredential } = require("@azure/identity");
 //service principal authentication
 var credentials = new DefaultAzureCredential();
 ```

## Create the Data Lake Analytics client

```javascript
const { DataLakeAnalyticsAccountManagementClient } = require("@azure/arm-datalake-analytics");
var accountClient = new DataLakeAnalyticsAccountManagementClient(credentials, 'your-subscription-id');
```

## Create a Data Lake Analytics account

```javascript
var util = require('util');
var resourceGroupName = 'testrg';
var accountName = 'testadlaacct';
var location = 'eastus2';

// A Data Lake Store account must already have been created to create
// a Data Lake Analytics account. See the Data Lake Store readme for
// information on doing so. For now, we assume one exists already.
var datalakeStoreAccountName = 'existingadlsaccount';

// account object to create
var accountToCreate = {
  tags: {
    testtag1: 'testvalue1',
    testtag2: 'testvalue2'
  },
  name: accountName,
  location: location,
  properties: {
    defaultDataLakeStoreAccount: datalakeStoreAccountName,
    dataLakeStoreAccounts: [
      {
        name: datalakeStoreAccountName
      }
    ]
  }
};

client.accounts.beginCreateAndWait(resourceGroupName, accountName, accountToCreate).then((result)=>{
  console.log('result is: ' + util.inspect(result, {depth: null}));
}).catch((err)=>{
  console.log(err);
    /*err has reference to the actual request and response, so you can see what was sent and received on the wire.
      The structure of err looks like this:
      err: {
        code: 'Error Code',
        message: 'Error Message',
        body: 'The response body if any',
        request: reference to a stripped version of http request
        response: reference to a stripped version of the response
      }
    */
}) 
```

## See also

* [Microsoft Azure SDK for Node.js](https://github.com/Azure/azure-sdk-for-js)

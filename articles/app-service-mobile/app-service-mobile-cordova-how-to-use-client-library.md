<properties
	pageTitle="How to Use Apache Cordova Plugin for Azure Mobile Apps"
	description="How to Use Apache Cordova Plugin for Azure Mobile Apps"
	services="app-service\mobile"
	documentationCenter="javascript"
	authors="adrianhall"
	manager="dwrede"
	editor=""/>

<tags
	ms.service="app-service-mobile"
	ms.workload="mobile"
	ms.tgt_pltfrm="mobile-html"
	ms.devlang="javascript"
	ms.topic="article"
	ms.date="02/17/2016"
	ms.author="adrianha"/>

# How to Use Apache Cordova Client Library for Azure Mobile Apps

[AZURE.INCLUDE [app-service-mobile-selector-client-library](../../includes/app-service-mobile-selector-client-library.md)]

This guide teaches you to perform common scenarios using the latest [Apache Cordova Plugin for Azure Mobile Apps]. If you are new to Azure Mobile
Apps, first complete [Azure Mobile Apps Quick Start] to create a backend, create a table, and download a pre-built Apache Cordova project. In this
guide, we focus on the client-side Apache Cordova Plugin.

##<a name="Setup"></a>Setup and Prerequisites

This guide assumes that you have created a backend with a table. This guide assumes that the table has the same schema as the tables in those
tutorials. This guide also assumes that you have added the Apache Cordova Plugin to your code.  If you have not done so, you may add the Apache
Cordova plugin to your project on the command-line:

```
cordova plugin add ms-azure-mobile-apps
```

##<a name="create-client"></a>How to: Create Client

Create a client connection by creating a `WindowsAzure.MobileServicesClient` object.  Replace `appUrl` with the URL to your Mobile App.

```
var client = WindowsAzure.MobileServicesClient(appUrl);
```

##<a name="table-reference"></a>How to: Create Table Reference

To access or update data, create a reference to the backend table. Replace `tableName` with the name of your table

```
var table = client.getTable(tableName);
```

##<a name="querying"></a>How to: Query Data

##<a name="filtering"></a>How to: Filter Returned Data

## <a name="sorting"></a>How to: Sort Returned Data

##<a name="inserting"></a>How to: Insert Data

##<a name="modifying"></a>How to: Modify Data

##<a name="deleting"></a>How to: Delete Data

##<a name="server-auth"></a>How to: Authenticate with a Provider (Server Flow)

##<a name="client-auth"></a>How to: Authenticate with a Provider (Client Flow)

##<a name="templates"></a>How to: Register push templates to send cross-platform notifications

##<a name="errors"></a>How to: Handle Errors

<!-- URLs. -->
[Azure Mobile Apps Quick Start]: app-service-mobile-cordova-get-started.md


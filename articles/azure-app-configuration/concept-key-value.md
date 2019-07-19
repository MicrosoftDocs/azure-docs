---
title: Azure App Configuration key-value store | Microsoft Docs
description: An overview of how configuration data is stored in Azure App Configuration
services: azure-app-configuration
documentationcenter: ''
author: yegu-ms
manager: maiye
editor: ''

ms.service: azure-app-configuration
ms.devlang: na
ms.topic: overview
ms.workload: tbd
ms.date: 04/19/2019
ms.author: yegu
---

# Keys and values

Azure App Configuration stores configuration data as key-value pairs. Key-value pairs are a simple yet flexible way to represent various kinds of application settings that developers are familiar with.

## Keys

Keys serve as the name for key-value pairs and are used to store and retrieve corresponding values. It's a common practice to organize keys into a hierarchical namespace by using a character delimiter, such as `/` or `:`. Use a convention that's best suited for your application. App Configuration treats keys as a whole. It doesn't parse keys to figure out how their names are structured or enforce any rule on them.

The usage of configuration data within application frameworks might dictate specific naming schemes for key values. As an example, Java's Spring Cloud framework defines `Environment` resources that supply settings to a Spring application to be parameterized by variables that include *application name* and *profile*. Keys for Spring Cloud-related configuration data typically start with these two elements separated by a delimiter.

Keys stored in App Configuration are case-sensitive, unicode-based strings. The keys *app1* and *App1* are distinct in an app configuration store. Keep this in mind when you use configuration settings within an application because some frameworks handle configuration keys case-insensitively. For example, the ASP.NET Core configuration system treats keys as case-insensitive strings. To avoid unpredictable behaviors when you query App Configuration within an ASP.NET Core application, don't use keys that differ only by casing.

You can use any unicode character in key names entered into App Configuration except for `*`, `,`, and `\`. These characters are reserved. If you need to include a reserved character, you must escape it by using `\{Reserved Character}`. There's a combined size limit of 10,000 characters on a key-value pair. This limit includes all characters in the key, its value, and all associated optional attributes. Within this limit, you can have many hierarchical levels for keys.

### Design key namespaces

There are two general approaches to naming keys used for configuration data: flat or hierarchical. These methods are similar from an application usage standpoint, but hierarchical naming offers a number of advantages:

* Easier to read. Instead of one long sequence of characters, delimiters in a hierarchical key name function as spaces in a sentence. They also provide natural breaks between words.
* Easier to manage. A key name hierarchy represents logical groups of configuration data.
* Easier to use. It's simpler to write a query that pattern-matches keys in a hierarchical structure and retrieves only a portion of configuration data. Also, many newer programming frameworks have native support for hierarchical configuration data such that your application can make use of specific sets of configuration.

You can organize keys in App Configuration hierarchically in many ways. Think of such keys as [URIs](https://en.wikipedia.org/wiki/Uniform_Resource_Identifier). Each hierarchical key is a resource *path* composed of one or more components that are joined together by delimiters. Choose what character to use as a delimiter based on what your application, programming language, or framework needs. Use multiple delimiters for different keys in App Configuration.

Here are several examples of how you can structure your key names into a hierarchy:

* Based on component services

        AppName:Service1:ApiEndpoint
        AppName:Service2:ApiEndpoint

* Based on deployment regions

        AppName:Region1:DbEndpoint
        AppName:Region2:DbEndpoint

### Label keys

Key values in App Configuration can optionally have a label attribute. Labels are used to differentiate key values with the same key. A key *app1* with labels *A* and *B* forms two separate keys in an app configuration store. By default, the label for a key value is empty, or `null`.

Label provides a convenient way to create variants of a key. A common use of labels is to specify multiple environments for the same key:

    Key = AppName:DbEndpoint & Label = Test
    Key = AppName:DbEndpoint & Label = Staging
    Key = AppName:DbEndpoint & Label = Production

### Version key values

App Configuration doesn't version key values automatically as they're modified. Use labels as a way to create multiple versions of a key value. For example, you can input an application version number or a Git commit ID in labels to identify key values associated with a particular software build.

You can use any unicode character in labels except for `*`, `,`, and `\`. These characters are reserved. To include a reserved character, you must escape it by using `\{Reserved Character}`.

### Query key values

Each key value is uniquely identified by its key plus a label that can be `null`. You query an app configuration store for key values by specifying a pattern. The app configuration store returns all key values that match the pattern and their corresponding values and attributes. Use the following key patterns in REST API calls to App Configuration:

| Key | |
|---|---|
| `key` is omitted or `key=*` | Matches all keys |
| `key=abc` | Matches key name **abc** exactly |
| `key=abc*` | Matches key names that start with **abc** |
| `key=*abc` | Matches key names that end with **abc** |
| `key=*abc*` | Matches key names that contain **abc** |
| `key=abc,xyz` | Matches key names **abc** or **xyz**, limited to five CSVs |

You also can include the following label patterns:

| Label | |
|---|---|
| `label` is omitted or `label=*` | Matches any label, which includes `null` |
| `label=%00` | Matches `null` label |
| `label=1.0.0` | Matches label **1.0.0** exactly |
| `label=1.0.*` | Matches labels that start with **1.0.** |
| `label=*.0.0` | Matches labels that end with **.0.0** |
| `label=*.0.*` | Matches labels that contain **.0.** |
| `label=%00,1.0.0` | Matches labels `null` or **1.0.0**, limited to five CSVs |

## Values

Values assigned to keys are also unicode strings. You can use all unicode characters for values. There's an optional user-defined content type associated with each value. Use this attribute to store information, for example an encoding scheme, about a value that helps your application to process it properly.

Configuration data stored in an app configuration store, which includes all keys and values, is encrypted at rest and in transit. App Configuration isn't a replacement solution for Azure Key Vault. Don't store application secrets in it.

## Next steps

* [Point-in-time snapshot](./concept-point-time-snapshot.md)  
* [Feature management](./concept-feature-management.md)  

---
title: Azure App Configuration key-value store | Microsoft Docs
description: An overview of how configuration data are stored in Azure App Configuration
services: azure-app-configuration
documentationcenter: ''
author: yegu-ms
manager: balans
editor: ''

ms.service: azure-app-configuration
ms.devlang: na
ms.topic: overview
ms.workload: tbd
ms.date: 02/24/2019
ms.author: yegu
---

# Key-value store

Azure App Configuration stores configuration data as key-value pairs, a simple yet flexible way of representing various kinds of application settings that developers are familiar with.

## Keys

Keys serve as the name for key-value pairs and are used for storing and retrieving corresponding values. It's a common practice to organize keys into a hierarchical namespace using a character delimiter (such as `/` or `:`) based on a convention that is best suited for your application. App Configuration treats keys as a whole. They do not parse keys to figure out how their names are structured or enforce any rule on them.

The usage of configuration store within application frameworks may dictate specific naming schemes for key-values. As an example, Java's Spring Cloud framework defines `Environment` resources that supply settings to a Spring application to be parameterized by variables including *application name* and *profile*. Keys for Spring Clould related configuration data will typically start with these two elements, separately by a delimiter.

Keys stored in App Configuration are case-sensitive, unicode-based strings. The keys *app1* and *App1* are distinct in an app configuration store. Keep this in mind when using configuration settings within an application, since some frameworks handle configuration keys case-insensitively. For example, the ASP.NET Core configuration system treats keys as case-insensitive strings. To avoid unpredictable behaviors when querying App Configuration within an ASP.NET Core application, keys that differ only by casing should not be used.

You're allowed to use any unicode character in key names entered into App Configuration, except for `*`, `,` and `\` which are reserved. If you need to include a reserved character, you must escape it using `\{Reserved Character}`. There's a combined size limit of 10K characters on a key-value pair. This includes all characters in the key, its value, and all associated optional attributes. Within this limit, you can have many hierarchical levels for keys.

### Designing key namespaces

There are two general approaches to naming keys used for configuration data: flat or hierarchical. These methods are very similar from an application usage standpoint, but the latter offers a number of advantages:

* Easier to read. Instead of one long sequence of characters, delimiters in a hierarchical key name functions as spaces in a sentence and provides natural breaks between words.
* Easier to manage. A key name hierarchy represents logical groups of configuration data.
* Easier to use. It's simpler to write a query that pattern-matches keys in a hierarchical structure and retrieves only a portion of configuration data. In addition, many newer programming frameworks have native support for hierarchical configuration data such that your application can make use of specific sets of configuration.

You can organize keys in App Configuration hierarchically in many ways. You can think of such keys as [URIs](https://en.wikipedia.org/wiki/Uniform_Resource_Identifier). Each hierarchical key is a resource *path* composed of one or more components, joined together by delimiters. You can choose what character to use as a delimiter based on what your application, programming language or framework needs. You can use multiple delimiters for different keys in App Configuration.

Here are several examples of how you can structure your key names into a hierarchy:

* Based on environments

        AppName:Test:DB:Endpoint
        AppName:Staging:DB:Endpoint
        AppName:Production:DB:Endpoint

* Based on component services

        AppName:Service1:Test:DB:Endpoint
        AppName:Service1:Staging:DB:Endpoint
        AppName:Service1:Production:DB:Endpoint
        AppName:Service2:Test:DB:Endpoint
        AppName:Service2:Staging:DB:Endpoint
        AppName:Service2:Production:DB:Endpoint

* Based on deployment regions

        AppName:Production:Region1:DB:Endpoint
        AppName:Production:Region2:DB:Endpoint

### Versioning key-values

Key-values in App Configuration can optionally have a **label** attribute. Labels are used to differentiate key-values with the same key. A key *app1* with labels *v1* and *v2* form two separate key-values in an app configuration store. By default, the label for a key-value is empty (or `null`).

App Configuration does not version key-values automatically as they are modified. You can use labels as a way to create multiple versions of a key-value. For example, you can input an application version number or a Git commit ID in labels to identify key-values associated with a particular software build.

You're allowed to use any unicode character in labels, except for `*`, `,` and `\`, which are reserved. If you need to include a reserved character, you must escape it using `\{Reserved Character}`.

### Querying key-values

Each key-value is uniquely identified by its key plus a label that can be `null`. You query an app configuration store for key-values by specifying a pattern. The app configuration store will return all key-values that match the pattern and their corresponding values and attributes. You can use the following key patterns in REST API calls to App Configuration:

| Key | |
|---|---|
| `key` is omitted or `key=*` | Matches all keys |
| `key=abc` | Matches key name **abc** exactly. |
| `key=abc*` | Matches key names that start with **abc** |
| `key=*abc` | Matches key names that end with **abc** |
| `key=*abc*` | Matches key names that contain **abc** |
| `key=abc,xyz` | Matches key names **abc** or **xyz**, limited to 5 CSVs |

You can also include the following label patterns:

| Label | |
|---|---|
| `label` is omitted or `label=*` | Matches any label, including `null` |
| `label=%00` | Matches `null` label. |
| `label=1.0.0` | Matches label **1.0.0** exactly |
| `label=1.0.*` | Matches labels that start with **1.0.** |
| `label=*.0.0` | Matches labels that end with **.0.0** |
| `label=*.0.*` | Matches labels that contain **.0.** |
| `label=%00,1.0.0` | Matches labels `null` or **1.0.1**, limited to 5 CSVs |

## Values

Values assigned to keys are also unicode strings. You can use all unicode characters for values. There's an optional user-defined **content type** associated with each value. You can use this attribute to store information (for example, encoding scheme) about a value that helps your application to process it properly.

Configuration data stored in an app configuration store, including all keys and values, are encrypted at rest and in transit. Nevertheless App Configuration is not a replacement solution for Azure Key Vault. You should not store application secrets in it.

## Next steps

* [Concept: Point-in-time snapshot](concept-point-time-snapshot.md)  

---
title: Understand Azure App Configuration key-value store
description: Understand key-value storage in Azure App Configuration, which stores configuration data as key-values. Key-values are a representation of application settings.
author: maud-lv
ms.author: malev
ms.service: azure-app-configuration
ms.topic: conceptual
ms.date: 09/14/2022
ms.custom: devdivchpfy22
---

# Keys and values

Azure App Configuration stores configuration data as key-values. Key-values are a simple and flexible representation of application settings used by developers.

## Keys

Keys serve as identifiers for key-values and are used to store and retrieve corresponding values. It's a common practice to organize keys into a hierarchical namespace by using a character delimiter, such as `/` or `:`. Use a convention best suited to your application. App Configuration treats keys as a whole. It doesn't parse keys to figure out how their names are structured or enforce any rule on them.

Here's an example of key names structured into a hierarchy based on component services:

```aspx
    AppName:Service1:ApiEndpoint
    AppName:Service2:ApiEndpoint
```

The use of configuration data within application frameworks might dictate specific naming schemes for key-values. For example, Java's Spring Cloud framework defines `Environment` resources that supply settings to a Spring application. These resources are parameterized by variables that include *application name* and *profile*. Keys for Spring Cloud-related configuration data typically start with these two elements separated by a delimiter.

Keys stored in App Configuration are case-sensitive, unicode-based strings. The keys *app1* and *App1* are distinct in an App Configuration store. Keep this in mind when you use configuration settings within an application because some frameworks handle configuration keys case-insensitively. We don't recommend using case to differentiate keys.

You can use any unicode character in key names except for `%`. A key name can't be `.` or `..` either. There's a combined size limit of 10 KB on a key-value. This limit includes all characters in the key, its value, and all associated optional attributes. Within this limit, you can have many hierarchical levels for keys.

### Design key namespaces

Two general approaches to naming keys are used for configuration data: flat or hierarchical. These methods are similar from an application usage standpoint, but hierarchical naming offers many advantages:

* Easier to read. Delimiters in a hierarchical key name function as spaces in a sentence. They also provide natural breaks between words.
* Easier to manage. A key name hierarchy represents logical groups of configuration data.
* Easier to use. It's simpler to write a query that pattern-matches keys in a hierarchical structure and retrieves only a portion of configuration data. Also, many newer programming frameworks have native support for hierarchical configuration data such that your application can make use of specific sets of configuration.

You can organize keys in App Configuration hierarchically in many ways. Think of such keys as [URIs](https://en.wikipedia.org/wiki/Uniform_Resource_Identifier). Each hierarchical key is a resource *path* composed of one or more components that are joined together by delimiters. Choose what character to use as a delimiter based on what your application, programming language, or framework needs. Use multiple delimiters for different keys in App Configuration.

### Label keys

Key-values in App Configuration can optionally have a label attribute. Labels are used to differentiate key-values with the same key. A key *app1* with labels *A* and *B* forms two separate keys in an App Configuration store. By default, a key-value has no label. To explicitly reference a key-value without a label, use `\0` (URL encoded as `%00`).

Label provides a convenient way to create variants of a key. A common use of labels is to specify multiple environments for the same key:

```
    Key = AppName:DbEndpoint & Label = Test
    Key = AppName:DbEndpoint & Label = Staging
    Key = AppName:DbEndpoint & Label = Production
```

### Version key-values

Use labels as a way to create multiple versions of a key-value. For example, you can input an application version number or a Git commit ID in labels to identify key-values associated with a particular software build.

> [!NOTE]
> If you're looking for change versions, App Configuration keeps all changes of a key-value that occurred in the past certain period of time automatically. For more information, see [point-in-time snapshot](./concept-point-time-snapshot.md).

### Query key-values

Each key-value is uniquely identified by its key plus a label that can be `\0`. You query an App Configuration store for key-values by specifying a pattern. The App Configuration store returns all key-values that match the pattern including their corresponding values and attributes. Use the following key patterns in REST API calls to App Configuration:

| Key | Description |
|---|---|
| `key` is omitted or `key=*` | Matches all keys. |
| `key=abc` | Matches key name `abc` exactly. |
| `key=abc*` | Matches key names that start with `abc`.|
| `key=abc,xyz` | Matches key names `abc` or `xyz`. Limited to five CSVs. |

You also can include the following label patterns:

| Label | Description |
|---|---|
| `label` is omitted or `label=*` | Matches any label, which includes `\0`. |
| `label=%00` | Matches `\0` label. |
| `label=1.0.0` | Matches label `1.0.0` exactly. |
| `label=1.0.*` | Matches labels that start with `1.0.`. |
| `label=%00,1.0.0` | Matches labels `\0` or `1.0.0`, limited to five CSVs. |

> [!NOTE]
> `*`, `,`, and `\` are reserved characters in queries. If a reserved character is used in your key names or labels, you must escape it by using `\{Reserved Character}` in queries.

## Values

Values assigned to keys are also unicode strings. You can use all unicode characters for values.

### Use content type

Each key-value in App Configuration has a content type attribute. You can optionally use this attribute to store information about the type of value in a key-value that helps your application to process it properly. You can use any format for the content type. App Configuration uses [Media Types]( https://www.iana.org/assignments/media-types/media-types.xhtml) (also known as MIME types) for built-in data types such as feature flags, Key Vault references, and JSON key-values.

## Next steps

> [!div class="nextstepaction"]
> [Point-in-time snapshot](./concept-point-time-snapshot.md)

> [!div class="nextstepaction"]
> [Feature management](./concept-feature-management.md)

> [!div class="nextstepaction"]
> [Event handling](./concept-app-configuration-event.md)

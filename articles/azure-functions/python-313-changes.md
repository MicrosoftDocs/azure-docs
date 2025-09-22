---
title: Updates for Python 3.13+ in Azure Functions 
description: Understand key changes, new features, and compatibility considerations for running Azure Functions with Python 3.13 and later versions.
ms.topic: concept-article
ms.date: 07/24/2025
ms.devlang: python
ms.custom: devx-track-python, py-fresh-zinc
---

# Changes and guidance for Python 3.13+ in Azure Functions

This article outlines important Python feature updates introduced by Azure Functions starting with Python 3.13. These changes include runtime version management, performance enhancements, and several removed features.

## Python runtime version control 

Starting with Python 3.13, Functions introduces runtime version control, a new opt-in feature that lets you target specific versions of the Functions Python runtime used by your app.

Without version control enabled, your app continues to run on a default version of the Python runtime, which is managed by Functions. You must modify your *requirements.txt* file to instead request the latest released version, a prereleased version, or to be able to pin your app to a specific version of the Python runtime. 

You enable runtime version control by adding a reference to the Python runtime package to your *requirements.txt* file, where the value assigned to the package determines the runtime version used.
 
The specific reference you add in *requirements.txt* depends on your Python programming model, which can be one of these values:

| Model version |  Package name |
| ----- | ----- |
| [v2](functions-reference-python.md?pivots=python-mode-decorators#programming-model) | `azure-functions-runtime` | 
| [v1](functions-reference-python.md?pivots=python-mode-configuration#programming-model)  | `azure-functions-runtime-v1` |

This table indicates the versioning behavior based on the version value of this setting in your *requirements.txt* file:

| Version | Example | Behavior |
| --- | ---- | ---- |
| No value set | `azure-functions-runtime` | Your Python 3.13+ app runs on the latest available version of the Functions Python runtime. This option is best for staying current with platform improvements and features, since your app automatically receives the latest stable runtime updates. |
| Pinned to a specific version | `azure-functions-runtime==1.2.0` | Your Python 3.13+ app stays on the pinned runtime version and doesn't receive automatic updates. You must instead manually update your pinned version to take advantage of new features, fixes, and improvements in the runtime. Pinning is recommended for critical production workloads where stability and predictability are essential. Pinning also lets you test your app on prereleased runtime versions during development. |
| No package reference | n/a | By not setting the `azure-functions-runtime`, your Python 3.13+ app runs on a default version of the Python runtime that is behind the latest released version. Updates are made periodically by Functions. This option ensures stability and broad compatibility. However, access to the newest features and fixes are delayed until the default version is updated. | 

Keep these considerations in mind when using runtime version control with your Python 3.13+ app:

- Avoid pinning any production app to prerelease (alpha, beta, or dev) runtime versions.
- Review [Python runtime release notes](https://github.com/Azure/azure-functions-python-worker/releases) regularly to be aware of changes that are being applied to your app's Python runtime or to determine when to update a pinned version. 


## Other changes and improvements introduced in Python 3.13

Python 3.13 introduces several enhancements to Functions that improve performance and reliability and otherwise affect runtime behaviors:

### Dependency isolation now enabled by default

Your apps can now benefit from full *dependency isolation*, which means that when your app includes a dependency that's also used by the Python worker, such as `azure-functions` or `grpcio`, your app can use its own version even though the Python runtime uses a different version internally.

This isolation prevents version conflicts and improves compatibility with custom packages.

### Improved cold start performance

Python 3.13 provides a measurable reduction in [cold start time](./event-driven-scaling.md#cold-start) compared to Python 3.11, which results in faster app startup.

### Faster JSON handling with `Orjson` support

Functions now supports the automatic use of `Orjson`, a high-performance JSON library written in Rust. When `Orjson` is included in your app’s dependencies, the runtime automatically uses it for JSON serialization and deserialization without you having to make any changes in your code.

Using `Orjson` can provide both lower latency and higher throughput for JSON-heavy workloads, such as HTTP API calls and event processing. To ensure backward compatibility, the standard `json` library is used when `Orjson` isn't available.

### Simplified opt-in for HTTP streaming

- The [HTTP Streaming](./functions-bindings-http-webhook-trigger.md?tabs=python-v2&pivots=programming-language-python#http-streams-1) feature is now available without requiring any changes to your app setting or other configurations. While you must still opt in at the function level, you no longer need to add the `PYTHON_ENABLE_INIT_INDEXING` setting to use the feature.

## Feature support removed in Python

These features are no longer supported by Functions when using Python 3.13 and later versions:

- **[Worker Extensions](./functions-reference-python.md#python-worker-extensions)**: Custom worker extensions aren't compatible with the Python 3.13+ runtime. If your app rely on these extensions, you must reevaluate or migrate to using supported alternatives.
- **[Shared Memory](./functions-reference-python.md#shared-memory)**: The shared memory feature used for large payload optimization isn't available starting with Python 3.13. By default, all communication now uses gRPC-based messaging.

## Related article

+ [Azure Functions Python developer guide](functions-reference-python.md)
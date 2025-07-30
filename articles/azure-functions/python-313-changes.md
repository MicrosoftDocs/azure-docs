---
title: Python 3.13+ in Azure Functions
description: Understand key changes, new features, and compatibility considerations for running Azure Functions with Python 3.13 and above.
ms.topic: article
ms.date: 07/24/2025
ms.devlang: python
ms.custom: devx-track-python, py-fresh-zinc
---
# Python 3.13+ in Azure Functions
This guide outlines important updates introduced with Python 3.13+ in Azure Functions, including runtime version management, performance enhancements, and removed features.

## Python Runtime Version Control (Python 3.13+)
Starting with Python 3.13, Azure Functions introduces runtime version control, 
a new opt-in feature that allows you to specify which version of the **Python** runtime your app uses.

By default, apps continue to run on a stable platform-managed runtime version—**no changes are 
required** unless you choose to opt in.

### How to Enable
To enable runtime version control, add the appropriate package to your `requirements.txt`
- For the **v2 programming model**, add:
```python
azure-functions-runtime
```
- For the **v1 programming model**, add:
```python
azure-functions-runtime-v1
```

### Runtime Versioning Options
There are three ways to manage your runtime version:

1. **Pin to a specific version** (for example, `azure-functions-runtime==1.2.0`):
   - Pinning to a specific version ensures that your app’s runtime behavior remains consistent, with **no automatic updates**.
   - This approach is recommended for critical production workloads where stability and predictability are essential.
   - New features, fixes, and improvements aren't applied automatically—you must manually update the version to receive them.
2. **Include the package without pinning** (for example, `azure-functions-runtime`):
   - Including the package without specifying a version allows your app to **automatically receive the latest stable runtime updates**.
   - This option is ideal for staying current with platform improvements and features.
   - New changes are adopted when the app is rebuilt and redeployed.
3. **Omit the package entirely**:
   - If you choose not to include the `azure-functions-runtime` package, your app runs using a platform-managed runtime version.
   - By default, the platform uses a stable version (for example, latest - 1) and updates it periodically.
   - Omitting the package ensures stability and broad compatibility, but **access to the newest features and fixes** may be delayed until the 
   default version is updated.

### Best Practices
- Avoid pinning to **alpha, beta, or dev versions** in production environments.
- Review [release notes](https://github.com/Azure/azure-functions-python-worker/releases) regularly if using unpinned versions to track changes.


## Key Changes and Improvements in Python 3.13+
Python 3.13 introduces several enhancements to Azure Functions, improving performance, reliability, and runtime behavior:

1. **Dependency Isolation (Enabled by Default)**

   Function apps now benefit from full **dependency isolation**.
   - If your app includes a dependency also used by the Python worker (for example, `azure-functions`, `grpcio`), your app uses **its own version**, 
   while the worker uses **its own internal version**.
   - This isolation prevents version conflicts and improves compatibility with custom packages.

2. **Cold Start Performance**

   Python 3.13 shows a **~4% reduction in cold start time** compared to Python 3.11, resulting in faster app startup.

3. **Faster JSON Handling with `Orjson` (Optional)**

   Azure Functions now supports automatic use of `Orjson`, a high-performance JSON library written in Rust.
   - When `Orjson` is included in your app’s dependencies (for example, in `requirements.txt`), the runtime automatically uses it for JSON 
   serialization and deserialization—**no code changes required**.
   - Benchmarks show up to **40% lower latency** and **50% higher throughput** for JSON-heavy workloads such as HTTP APIs and event processing.
   - If `Orjson` isn't present, the standard `json` library is used instead, ensuring backward compatibility.

4. **Simplified Opt-In for HTTP Streaming**
   - The [HTTP Streaming](./functions-bindings-http-webhook-trigger.md?tabs=python-v2&pivots=programming-language-python#http-streams-1) feature is now available 
   **without requiring any App Setting configuration**.
   - Users still need to opt in at the function level but no longer need to add `PYTHON_ENABLE_INIT_INDEXING` to use it.


## Unsupported Features in Python 3.13+
The following features are **no longer supported** in Azure Functions when using Python 3.13 and above:

- **Worker Extensions**
Custom worker extensions aren't compatible with the Python 3.13+ runtime. Functionality that previously relied on these extensions 
must be reevaluated or migrated to supported alternatives.
- **Shared Memory**
The shared memory feature used for large payload optimization is no longer available in Python 3.13+. All communication now uses 
gRPC-based messaging by default.
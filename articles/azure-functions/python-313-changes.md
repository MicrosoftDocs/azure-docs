---
title: Changes and Guidance for Python 3.13+ in Azure Functions
description: Understand key changes, new features, and compatibility considerations for running Azure Functions with Python 3.13 and above.
ms.topic: article
ms.date: 07/24/2025
ms.devlang: python
ms.custom:
  - devx-track-python
  - py-fresh-zinc
zone_pivot_groups: python-mode-functions
---
# Changes and Guidance for Python 3.13+ in Azure Functions
## Python Runtime Version Control (Python 3.13+)
Starting with Python 3.13, Azure Functions introduces runtime version control, allowing you to pin your app to a specific version of 
the **Python** runtime used in the platform.

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
- Guarantees no automatic changes to the runtime behavior.
- Recommended for critical production workloads.
- New features or fixes don't apply automatically—you must update the version manually.
2. **Include the package without pinning** (for example, `azure-functions-runtime`):
- Automatically receives the latest stable runtime updates.
- Good for staying current, but new changes are adopted when the app is rebuilt and redeployed.
3. **Omit the package entirely**:
- The app defaults to a stable version **prior to the latest release** (for example, latest - 1) and
be periodically updated by the platform.
- Useful for maintaining stability, but delays access to new features.

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

3. **Improved Throughput and Execution Speed**
Azure Functions with Python 3.13+ now use `uvloop` in production to handle HTTP requests.
This change results in:
- **~8% faster execution times**
- **~6% more requests processed per second**


## Unsupported Features in Python 3.13+
The following features are **no longer supported** in Azure Functions when using Python 3.13 and above:

- **Worker Extensions**
Custom worker extensions aren't compatible with the Python 3.13+ runtime. Functionality that previously relied on these extensions 
must be reevaluated or migrated to supported alternatives.
- **Shared Memory**
The shared memory feature used for large payload optimization is no longer available in Python 3.13+. All communication now uses 
gRPC-based messaging by default.
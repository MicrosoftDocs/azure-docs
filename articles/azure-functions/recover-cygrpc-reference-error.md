---
title: Troubleshoot Python module 'cygrpc' reference error in Azure Functions
description: Learn how to troubleshoot cygrpc reference error in Python functions.
author: Hazhzeng

ms.topic: article
ms.date: 07/27/2020
ms.author: hazeng
ms.custom: tracking-python
---

# Troubleshoot Python module 'cygrpc' reference error in Azure Functions

This article helps you troubleshoot 'cygrpc' related errors in your Python function app. These errors typically result in the following Azure Functions error message:

> `Cannot import name 'cygrpc' from 'grpc._cython'`

This error issue occurs when a Python function app fails to start with a proper Python interpreter. The root cause for this error is one of the following issues:

- [The Python interpreter mismatches OS architecture](#the-python-interpreter-mismatches-os-architecture)
- [The Python interpreter is not supported by Azure Functions Python Worker](#the-python-interpreter-is-not-supported-by-azure-functions-python-worker)

## Diagnose 'cygrpc' reference error

### The Python interpreter mismatches OS architecture

This is most likely caused by a 32-bit Python interpreter is installed on your 64-bit operating system.

If you're running on an x64 operating system, please ensure your Python 3.6, 3.7, or 3.8 interpreter is also on 64-bit version.

You can check your Python interpreter bitness by the following commands:

On Windows in PowerShell: `py -c 'import platform; print(platform.architecture()[0])'`

On Unix-like shell: `python3 -c 'import platform; print(platform.architecture()[0])'`

If there's a mismatch between Python interpreter bitness and operating system architecture, please download a proper Python interpreter from [Python Software Foundation](https://python.org/downloads/release).

### The Python interpreter is not supported by Azure Functions Python Worker

The Azure Functions Python Worker only supports Python 3.6, 3.7, and 3.8.
Please check if your Python interpreter matches our expected version by `py --version` in Windows or `python3 --version` in Unix-like systems. Ensure the return result is Python 3.6.x, Python 3.7.x, or Python 3.8.x.

If your Python interpreter version does not meet our expectation, please download the Python 3.6, 3.7, or 3.8 interpreter from [Python Software Foundation](https://python.org/downloads/release).

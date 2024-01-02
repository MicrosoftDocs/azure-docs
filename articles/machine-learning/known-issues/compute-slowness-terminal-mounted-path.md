---
title: Known issue - Slowness in compute instance terminal from a mounted path
titleSuffix: Azure Machine Learning
description: While using the compute instance terminal inside a mounted path of data folder, any commands executed from the terminal result in slowness.
author: s-polly
ms.author: scottpolly
ms.topic: troubleshooting  
ms.service: machine-learning
ms.subservice: core
ms.date: 08/04/2023
ms.custom: known-issue
---

# Known issue  - Slowness in compute instance terminal from a mounted path

[!INCLUDE [dev v2](../includes/machine-learning-dev-v2.md)]

While using the compute instance terminal inside a mounted path of a data folder, any commands executed from the terminal result in slowness. This issue is restricted to the terminal; running the commands from SDK using a notebook works as expected.

**Status:** Open

**Problem area:** Compute

## Symptoms

While using the compute instance terminal inside a mounted path of a data folder, any commands executed from the terminal result in slowness. This issue is restricted to the terminal; running the commands from SDK using a notebook works as expected.

### Cause

The `LD_LIBRARY_PATH` contains an empty string by default, which is treated as the current directory. This causes many library lookups on remote storage, resulting in slowness.

As an example: 

```python
LD_LIBRARY_PATH /opt/intel/compilers_and_libraries_2018.3.222/linux/mpi/intel64/lib:/opt/intel/compilers_and_libraries_2018.3.222/linux/mpi/mic/lib::/anaconda/envs/azureml_py38/lib/:/usr/local/cuda/lib64:/usr/local/cuda/extras/CUPTI/lib64/
```

Notice the `::` in the path. This is the empty string, which is treated as the current directory.

When one of the paths in a list is "" - every executable tries to find the dynamic libraries it needs relative to current working directory.

## Solutions and workarounds

On the CI set the path making sure that `LD_LIBRARY_PATH` doesn't contain an empty string.

```export LD_LIBRARY_PATH="$(echo $LD_LIBRARY_PATH | sed 's/\(:\)\1\+/\1/g')"```

## Next steps

- [About known issues](azure-machine-learning-known-issues.md)

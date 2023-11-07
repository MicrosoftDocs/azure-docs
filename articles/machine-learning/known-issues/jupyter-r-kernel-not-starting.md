---
title: Known issue - Compute instance | Jupyter R Kernel doesn't start in new compute instance images 
titleSuffix: Azure Machine Learning
description: When trying to launch an R kernel in JupyterLab or a notebook in a new compute instance, the kernel fails to start
author: s-polly
ms.author: scottpolly
ms.topic: troubleshooting  
ms.service: machine-learning
ms.subservice: core
ms.date: 08/14/2023
ms.custom: known-issue
---

# Known issue  - Jupyter R Kernel doesn't start in new compute instance images 

[!INCLUDE [dev v2](../includes/machine-learning-dev-v2.md)]

When trying to launch an R kernel in JupyterLab or a notebook in a new compute instance, the kernel fails to start with `Error: .onLoad failed in loadNamespace()`.

**Status:** Open

**Problem area:** Compute

## Symptoms

After creating a new compute instance, try to launch R kernel in JupyterLab or a Jupyter notebook. The kernel fails to launch. You'll see the following messages in the Jupyter logs:


```  
Aug 01 14:18:48 august-compute2Q6DP2A jupyter[11568]: Error: .onLoad failed in loadNamespace() for 'pbdZMQ', details:
Aug 01 14:18:48 august-compute2Q6DP2A jupyter[11568]:   call: dyn.load(file, DLLpath = DLLpath, ...)
Aug 01 14:18:48 august-compute2Q6DP2A jupyter[11568]:   error: unable to load shared object '/usr/local/lib/R/site-library/pbdZMQ/libs/pbdZMQ.so':
Aug 01 14:18:48 august-compute2Q6DP2A jupyter[11568]:   libzmq.so.5: cannot open shared object file: No such file or directory
Aug 01 14:18:48 august-compute2Q6DP2A jupyter[11568]: Execution halted
```

## Solutions and workarounds

To work around this issue, run this code in the compute instance terminal:

```azurecli
jupyter kernelspec list

sudo rm -r <path/to/kernel/directory>

conda create -n r -y -c conda-forge r-irkernel jupyter_client
conda run -n r bash -c 'Rscript <(echo "IRkernel::installspec()")'
jupyter kernelspec list

```

## Next steps

- [About known issues](azure-machine-learning-known-issues.md)

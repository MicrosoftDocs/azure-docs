---
author: Blackmist
ms.service: machine-learning
ms.topic: include
ms.date: 06/12/2023
ms.author: larryfr
---

> [!NOTE]
> This is not a complete list of the hosts required for all Python resources on the internet, only the most commonly used. For example, if you need access to a GitHub repository or other host, you must identify and add the required hosts for that scenario.

| __Host name__ | __Purpose__ |
| ---- | ---- |
| `anaconda.com`<br>`*.anaconda.com` | Used to install default packages. |
| `*.anaconda.org` | Used to get repo data. |
| `pypi.org` | Used to list dependencies from the default index, if any, and the index isn't overwritten by user settings. If the index is overwritten, you must also allow `*.pythonhosted.org`. |
| `pytorch.org`<br>`*.pytorch.org` | Used by some examples based on PyTorch. |
| `*.tensorflow.org` | Used by some examples based on Tensorflow. |

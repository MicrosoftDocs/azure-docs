---
title: 'Support boundaries for PyTorch Enterprise on Azure'
description: This article defines the support boundaries for PyTorch Enterprise. 
author: alonbochman
ms.author: alonbochman
ms.service: pytorch-enterprise
ms.topic: conceptual
ms.date: 07/06/2021
# Customer intent: As a data steward or catalog administrator, I need to onboard Azure data sources at scale before I register and scan them.
---
# Support boundaries for PyTorch Enterprise

This brief document describes the modules and components supported under Pytorch Enterprise.


|Area|Supported versions|Notes|
|----|----|----|
|OS|Windows 10, Debian 9, Debian 10, Ubuntu 16.04.7 LTS, Ubuntu 18.04.5 LTS|We support the LTS versions of Debian and Ubuntu distributions, and only the x86_64 architecture.|
|Python|3.6+||
|PyTorch|1.8.1+||
|CUDA Toolkit|10.2, 11.1||
|ONNX Runtime|1.7+||
|torchtext, torchvision, torch-tb-profiler, torchaudio| - |For libraries that haven’t a 1.0 release, we support the specific versions that are compatible with the corresponding supported PyTorch version. For example, see these tables: [TorchVision](https://github.com/pytorch/vision#installation), [TorchText](https://github.com/pytorch/text#installation), [TorchAudio](https://github.com/pytorch/audio/#dependencies)|
|torchserve|0.4.0+||

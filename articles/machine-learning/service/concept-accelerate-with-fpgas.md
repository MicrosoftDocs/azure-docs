---
title: Azure Machine Learning and FPGAs
description: Learn how to accelerate models and deep neural networks with FPGAs. 
services: machine-learning
ms.service: machine-learning
ms.component: core
ms.topic: conceptual
ms.reviewer: jmartens
ms.author: tedway
author: tedway
ms.date: 05/07/2018
# What is an FPGA and what can you do with it? What is an FPGA accelerator? What is it used for and how can you use it? Supported model types. Less expensive to score on FPGA than GPU and faster than GPU.
---

# What is a field programmable gate array (FPGA)?

Field programmable gate arrays (FPGA) are integrated circuits that can be reconfigured as needed. You can change an FPGA as needed to implement new logic. Azure Machine Learning Hardware Accelerated Models allow you to deploy trained models to FPGAs in the Azure cloud.

This functionality is powered by Project Brainwave, which handles translating deep neural networks (DNN) into an FPGA program. 

## Why use an FPGA?

FPGAs provide ultra-low latency, and they are particularly effective for scoring data at batch size one (there is no requirement for a large batch size).  They are cost-effective and available in Azure.  Project Brainwave can parallelize pre-trained DNNs across these FPGAs to scale out your service.

## Next steps

[Deploy a model as a web service on an FPGA](how-to-deploy-fpga-web-service.md)

[Learn how to install the FPGA SDK](reference-fpga-package-overview.md)
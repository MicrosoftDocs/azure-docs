---
title: Accelerating models with FPGAs 
description: Learn how to accelerate models and deep neural networks with FPGAs. 
services: machine-learning
ms.service: machine-learning
ms.component: core
ms.topic: conceptual
ms.reviewer: jmartens
ms.author: tedway
author: tedway
ms.date: 05/07/2018
---

# Accelerating deep neural networks models with FPGAs

This article describes how deep neural networks (DNN) can be accelerated with FPGAs (field programmable gate arrays) and why FPGAs are advantageous in this fast-changing AI landscape.

## Deep neural networks enable AI

Having a conversation with somebody who doesn't speak your language.  Analyzing medical images to detect cancer earlier.  Making the world accessible to everybody.  What used to be science fiction is becoming reality as DNNs have enabled major advances in artificial intelligence (AI).  Computer vision, language translation, speech recognition, language understanding, and other applications all rely on DNNs.

The challenge is that DNNs are difficult to serve and deploy in large-scale online services.  DNNs are heavily constrained by latency, cost, and power.  The size and complexity of DNNs are outpacing the growth of commodity CPUs.

Processing DNNs can be done by "hard" DNN processing units such as GPUs or ASICs.  DNNs are inherently parallel and require lots of matrix operations, which are what GPUs were designed to process.  Other ASICs (application specific integrated circuits) have been designed to process DNNs efficiently.  When these chips are designed, they must commit to a specific set of operators and data types to optimize for.  The chip cannot change once it is designed and manufactured.

On the other hand, "soft" DNN processing units based on FPGAs (field programmable gate arrays) enable chip configuration and the flexibility to update the chip by software. 

## Why FPGAs

Azure Machine Learning Hardware Accelerated Models is powered by Project Brainwave.  Project Brainwave is a platform that does the programming of the FPGA so you don't have to.
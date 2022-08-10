---
title: Azure Percept for DeepStream overview
description: A description of Azure Percept for DeepStream developer tools that provide a custom developer experience.
author: @MaxStrange
ms.author: strangem
manager: amiyouss
ms.service: azure-percept
ms.topic: overview
ms.date: 08/10/2022
ms.custom: template-concept #Required; leave this attribute/value as-is.
---


# Azure Percept for DeepStream Overview

Azure Percept for DeepStream includes developer tools that provide a custom developer experience. It enables you to create NVIDIA DeepStream containers using Microsoft-based images and guidance, supported models from NVIDIA out of the box, and/or bring your own models. 

DeepStream is NVIDIA’s toolkit to develop and deploy Vision AI applications and services. It provides multi-platform, scalable, Transport Layer Security (TLS)-encrypted security that can be deployed on-premises, on the edge, and in the cloud. 

## Azure Percept for DeepStream offers:

- **Simplifying your development process** 

  Auto selection of AI model execution and inference provider: One of several execution providers, such as ORT, CUDA, and TENSORT, are automatically selected to simplify your development process.

- **Customizing Region of Interest (ROI) to enable your business scenario**

  Region of Interest (ROI) configuration widget: Percept Player, a web app widget, is included for customizing ROIs to enable event detection for your business scenario.

- **Simplifying the configuration for pre/post processing** 

  You can add a Python-based model/parser using a configuration file, instead of hardcoding it into the pipeline.

- **Offering a broad Pre-built AI model framework** 

  This solution supports many of the most common CV models in use today, for example NVIDIA TAO, ONNX, CAFFE, UFF (TensorFlow), and Triton.

- **Supporting bring your own model** 

  Support for model/container customization, USB/RTSP camera and pre-recorded video stream(s), event-based video snippet storage in Azure Storage and Alerts, and AI model deployment via Azure IoT Module Twin update.

## Azure Percept for DeepStream key components  

The following table provides a list of Azure Percept for DeepStream’s key components and a description of each one.






## Next steps

You are now ready to start using Azure Percept for DeepStream to create, manage, and deploy custom Edge AI solutions. We recommend the following resources to get started:  

- [Getting started checklist for Azure Percept for DeepStream](https://microsoft.sharepoint-df.com/teams/AzurePerceptHCIDocumentation/Shared Documents/General/Azure Percept for Deep Sream/Completed Drafts/Archive/22-07-22_Drafts/quickstart-readme.docx?web=1)

- [Tutorial: Deploy a simulated manufacturing defect detection model using Azure Percept and DeepStream](https://microsoft.sharepoint-df.com/:w:/t/AzurePerceptHCIDocumentation/EbQFPiaksEZFut0dZFxFla0BscJl-O7I-NtyIAhSjkebFA?e=6Gnblo) 

